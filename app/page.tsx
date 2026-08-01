'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ScanForm } from '@/components/ScanForm';
import { LoadingScan } from '@/components/LoadingScan';
import { Sparkles, Bot, Search, BarChart3, ArrowRight, Zap, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [scannedDomain, setScannedDomain] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleScanSubmit = async (data: {
    domain: string;
    brand_description: string;
    custom_queries: string[];
  }) => {
    setIsLoading(true);
    setScannedDomain(data.domain);
    setErrorMsg('');

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to trigger scan');
      }

      if (responseData.scanId) {
        router.push(`/scan/${responseData.scanId}`);
      } else {
        throw new Error('Invalid response from scan server');
      }
    } catch (err) {
      console.error('Scan submit error:', err);
      setErrorMsg(err instanceof Error ? err.message : 'An error occurred while scanning.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Hero Header */}
      <div className="text-center space-y-5 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span>Generative Engine Optimization (GEO) Audit</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
          Are AI Search Engines Recommending{' '}
          <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Your Brand?
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Instantly test your company domain across 4 top LLMs (Gemini, ChatGPT, Claude, Perplexity). Find out if buyers see you or your competitors when asking for recommendations.
        </p>
      </div>

      {/* Main Interactive Section */}
      {isLoading ? (
        <LoadingScan domain={scannedDomain} />
      ) : (
        <div className="space-y-6">
          {errorMsg && (
            <div className="max-w-2xl mx-auto p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
              {errorMsg}
            </div>
          )}
          <ScanForm onSubmit={handleScanSubmit} isLoading={isLoading} />
        </div>
      )}

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-slate-900">
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center">
            <Bot className="w-5 h-5 text-brand-400" />
          </div>
          <h3 className="text-base font-bold text-white">4 AI Engine Analysis</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Evaluates your brand mention rate across ChatGPT (GPT-4o), Google Gemini 1.5, Claude 3.5, and Perplexity Sonar simultaneously.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Search className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-base font-bold text-white">Realistic Buyer Queries</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Automatically synthesizes realistic search queries (best tools for use-case, alternatives, top recommendations) used by real buyers.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-base font-bold text-white">Shareable Visibility Score</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Get an instant percentage score with an OpenGraph share card to showcase your brand's authority or identify growth opportunities.
          </p>
        </div>
      </div>
    </div>
  );
}
