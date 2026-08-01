'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Lock, Mail, Sparkles, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface EmailGateModalProps {
  scanId: string;
  isOpen: boolean;
  onClose: () => void;
  onUnlocked: () => void;
}

export const EmailGateModal: React.FC<EmailGateModalProps> = ({
  scanId,
  isOpen,
  onClose,
  onUnlocked,
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanId, email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to unlock report');
      }

      onUnlocked();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-brand-500/20 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Lock Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-500/30">
          <Lock className="w-7 h-7 text-white" />
        </div>

        <h3 className="text-2xl font-extrabold text-center text-white mb-2">
          Unlock Full AI Visibility Report
        </h3>
        <p className="text-sm text-center text-slate-400 mb-6">
          See all 5 buyer search queries across all 4 AI models (Gemini, GPT-4o, Claude 3.5, Perplexity) with complete raw response analysis.
        </p>

        <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 mb-6 space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Complete 5 Queries × 4 Models matrix analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Unfiltered raw AI output text snippets</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Instant access (no password or credit card required)</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Mail className="w-4 h-4 text-brand-400" />
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Work Email Address
              </label>
            </div>
            <Input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              required
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full text-base py-3.5 shadow-xl"
            isLoading={isLoading}
          >
            Unlock My Full Free Report Now
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <span>We respect your privacy. No spam guaranteed.</span>
        </div>
      </div>
    </div>
  );
};
