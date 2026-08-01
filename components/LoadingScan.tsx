'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Sparkles, Cpu, Search, CheckCircle2, ShieldAlert } from 'lucide-react';

interface LoadingScanProps {
  domain: string;
}

export const LoadingScan: React.FC<LoadingScanProps> = ({ domain }) => {
  const [step, setStep] = useState(0);

  const steps = [
    { title: 'Generating Buyer Search Queries', desc: 'Gemini synthesis based on brand context' },
    { title: 'Probing GPT-4o & Claude Models', desc: 'Evaluating brand recommendations & citations' },
    { title: 'Scanning Perplexity & Gemini Engines', desc: 'Parsing live real-time LLM web synthesis' },
    { title: 'Calculating AI Brand Visibility Score', desc: 'Analyzing mention frequencies across models' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 4500);

    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <Card className="max-w-xl mx-auto text-center py-12 px-6 border-brand-500/30 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Animated Pulse Ring */}
      <div className="relative mx-auto w-20 h-20 mb-8 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-brand-500/20 animate-ping" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-500/40">
          <Cpu className="w-8 h-8 text-white animate-pulse" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">
        Scanning AI Visibility for <span className="text-brand-400">{domain}</span>
      </h2>
      <p className="text-sm text-slate-400 mb-8">
        Calling 4 major LLM engines sequentially or in parallel. This usually takes 10 to 20 seconds.
      </p>

      {/* Step Indicators */}
      <div className="space-y-4 text-left max-w-md mx-auto">
        {steps.map((s, index) => {
          const isDone = index < step;
          const isCurrent = index === step;

          return (
            <div
              key={index}
              className={`p-3.5 rounded-xl border transition-all duration-300 flex items-center gap-3.5 ${
                isCurrent
                  ? 'bg-brand-500/10 border-brand-500/40 text-white shadow-md'
                  : isDone
                  ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                  : 'bg-slate-900/20 border-slate-900 text-slate-600'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <Sparkles className="w-5 h-5 text-brand-400 animate-spin shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-slate-700 shrink-0" />
              )}
              <div>
                <p className={`text-sm font-semibold ${isCurrent ? 'text-brand-300' : ''}`}>
                  {s.title}
                </p>
                <p className="text-xs text-slate-400">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldAlert className="w-4 h-4 text-brand-400" />
        <span>Live query verification in progress</span>
      </div>
    </Card>
  );
};
