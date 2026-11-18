import { NextRequest } from 'next/server';
import { systemPrompt } from '@/data/system-prompt';
import { createKnowledgeFallback, streamChatCompletion, type Message } from '@/lib/llm';
import { checkRateLimit } from '@/lib/ratelimit';

const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 4000;

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function isMessage(value: unknown): value is Message {
  if (!value || typeof value !== 'object') return false;

  const message = value as Record<string, unknown>;
  return (
    (message.role === 'user' || message.role === 'assistant') &&
    typeof message.content === 'string' &&
    message.content.length > 0 &&
    message.content.length <= MAX_MESSAGE_LENGTH
  );
}

function isMessageArray(value: unknown): value is Message[] {
  return Array.isArray(value) && value.every(isMessage);
}

function isValidConversation(messages: Message[]) {
  return (
    messages.length > 0 &&
    messages.length <= MAX_MESSAGES &&
    messages[messages.length - 1].role === 'user' &&
    messages.every((message, index) => message.role === (index % 2 === 0 ? 'user' : 'assistant'))
  );
}

export async function POST(request: NextRequest) {
  const identifier =
    request.headers.get('x-real-ip') ??
    request.headers.get('x-forwarded-for')?.split(',').pop()?.trim() ??
    'unknown';
  const rateLimit = checkRateLimit(identifier);

  if (!rateLimit.success) {
    return jsonError(
      'Limite de messages atteinte. Veuillez réessayer dans quelques minutes.',
      429,
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError('Requête JSON invalide.', 400);
  }

  if (!body || typeof body !== 'object' || !('messages' in body)) {
    return jsonError('Messages invalides.', 400);
  }

  const submittedMessages = body.messages;
  if (
    !isMessageArray(submittedMessages) ||
    submittedMessages.length === 0 ||
    submittedMessages.length > MAX_MESSAGES
  ) {
    return jsonError('Messages invalides.', 400);
  }

  // The UI's initial welcome is not part of the visitor's conversation with the model.
  const messages =
    submittedMessages[0].role === 'assistant'
      ? submittedMessages.slice(1)
      : submittedMessages;

  if (!isValidConversation(messages)) {
    return jsonError('Messages invalides.', 400);
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let hasContent = false;
      const enqueueContent = (text: string) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'content', text })}\n\n`),
        );
        hasContent = true;
      };

      try {
        if (!process.env.GROQ_API_KEY) {
          enqueueContent(createKnowledgeFallback(messages));
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
          controller.close();
          return;
        }

        for await (const text of streamChatCompletion(messages, systemPrompt)) {
          enqueueContent(text);
        }

        if (!hasContent) {
          console.warn('Chat completion returned no content; using the portfolio knowledge fallback.');
          enqueueContent(createKnowledgeFallback(messages));
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
        controller.close();
      } catch (error) {
        console.error('Chat completion failed; using the portfolio knowledge fallback:', error);
        if (!hasContent) {
          enqueueContent(createKnowledgeFallback(messages));
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
        } else {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'error',
                text: 'La réponse a été interrompue. Veuillez réessayer.',
              })}\n\n`,
            ),
          );
        }
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
