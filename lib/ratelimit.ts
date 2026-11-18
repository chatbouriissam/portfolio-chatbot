// Simple in-memory rate limiter (pour dev et déploiement sans KV store)
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX || '20', 10);
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '600000', 10); // 10 minutes

export function checkRateLimit(identifier: string): { success: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  // Nettoyer les entrées expirées périodiquement
  if (rateLimitMap.size > 1000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.resetTime < now) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!entry || entry.resetTime < now) {
    // Nouvelle fenêtre
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return { success: true, remaining: MAX_REQUESTS - 1 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { success: false, remaining: 0 };
  }

  entry.count++;
  return { success: true, remaining: MAX_REQUESTS - entry.count };
}

export function getRateLimitResetTime(identifier: string): number {
  const entry = rateLimitMap.get(identifier);
  return entry?.resetTime || Date.now();
}
