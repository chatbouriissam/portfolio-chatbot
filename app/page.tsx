'use client';

import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';
import { Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <Header />

      {/* Hero section */}
      <div className="pt-20 pb-4 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Portfolio Interactif IA
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
            Issam Chatbouri
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Étudiant Ingénieur Génie Informatique | IA & Full-Stack
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-green-700 dark:text-green-400 font-medium">
              Disponible pour un stage PFE (6 mois, dès février 2027)
            </span>
          </div>
        </div>
      </div>

      {/* Chat container */}
      <div className="flex-1 flex items-center justify-center px-4 pb-4">
        <div className="w-full max-w-4xl h-full max-h-[600px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <ChatInterface />
        </div>
      </div>

      {/* Footer note */}
      <div className="pb-4 px-4 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Ce portfolio est lui-même un projet : intégration d'IA générative (RAG) avec Next.js et TypeScript
        </p>
      </div>
    </div>
  );
}
