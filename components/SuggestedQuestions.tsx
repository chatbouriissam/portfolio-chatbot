'use client';

import { MessageCircle } from 'lucide-react';

interface SuggestedQuestionsProps {
  onQuestionClick: (question: string) => void;
  disabled?: boolean;
}

const SUGGESTED_QUESTIONS = [
  "Présente-toi en 30 secondes",
  "Quels sont tes projets IA ?",
  "Parle-moi de ton stage chez LOGITECHNICA",
  "Quelles technologies maîtrises-tu ?",
  "Pourquoi te recruter ?",
  "Comment te contacter ?"
];

export default function SuggestedQuestions({ onQuestionClick, disabled }: SuggestedQuestionsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        <MessageCircle className="w-4 h-4" />
        <span className="font-medium">Questions suggérées :</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {SUGGESTED_QUESTIONS.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question)}
            disabled={disabled}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 hover:border-blue-400 dark:hover:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-slate-800"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}
