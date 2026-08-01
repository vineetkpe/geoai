'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { ModelBreakdown } from '@/components/ModelBreakdown';
import { QueryResultCard } from '@/components/QueryResultCard';
import { EmailGateModal } from '@/components/EmailGateModal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Scan, ModelBreakdownItem, ModelName } from '@/types';
import { Lock, Unlock, ShieldAlert, Sparkles, ArrowLeft, Eye, Zap } from 'lucide-react';
import Link from 'next/link';

export default function ScanResultPage() {
  const params = useParams();
  const scanId = params.scanId as string;

  const [scan, setScan] = useState<Scan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchScan = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/scan/${scanId}`);
      if (!res.ok) {
        throw new Error('Failed to load scan report');
      }
      const data: Scan = await res.json();
      setScan(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred loading results.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scanId) {
      fetchScan();
    }
  }, [scanId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Loading your AI visibility score report...</p>
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400">
          <ShieldAlert className="w-10 h-10 mx-auto mb-2" />
          <h2 className="text-xl font-bold">Report Not Found</h2>
          <p className="text-sm mt-1">{error || 'Unable to retrieve scan data.'}</p>
        </div>
        <Link href="/">
          <Button variant="secondary" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Return to Home
          </Button>
        </Link>
      </div>
    );
  }

  const queries = scan.queries || [];
  const sampleQuery = queries.length > 0 ? queries[0] : null;
  const lockedQueries = queries.slice(1);

  // Compute breakdown across all queries for ModelBreakdown component
  const modelNames: ModelName[] = ['gemini', 'gpt', 'claude', 'perplexity'];
  const breakdown: ModelBreakdownItem[] = modelNames.map((name) => {
    let total = 0;
    let mentioned = 0;
    let hasUnavailable = false;

    for (const q of queries) {
      const res = (q.results || []).find((r) => r.model_name === name);
      if (res) {
        total++;
        if (res.mentioned) mentioned++;
        if (res.status === 'unavailable') hasUnavailable = true;
      }
    }

    return {
      model_name: name,
      displayName: name.toUpperCase(),
      totalQueries: total,
      mentionedQueries: mentioned,
      status: hasUnavailable ? 'unavailable' : 'success',
    };
  });

  // Calculate competitor count estimate for blurred teaser
  let competitorSet = new Set<string>();
  for (const q of queries) {
    for (const r of q.results || []) {
      if (Array.isArray(r.competitors_mentioned)) {
        r.competitors_mentioned.forEach((c) => competitorSet.add(c));
      }
    }
  }
  const competitorCount = Math.max(3, competitorSet.size);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Run Another Domain Scan
        </Link>
        {scan.is_unlocked && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Unlock className="w-3.5 h-3.5" /> Full Free Report Unlocked
          </span>
        )}
      </div>

      {/* Hero Score Display */}
      <ScoreDisplay domain={scan.domain} score={scan.visibility_score} scanId={scan.id} />

      {/* Per-Model Breakdown Grid */}
      <ModelBreakdown breakdown={breakdown} />

      {/* Free Sample Query Card (Proof it's real AI response) */}
      {sampleQuery && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-brand-400" />
              <span>Free Verified Sample Query</span>
            </h3>
            <span className="text-xs text-slate-400">Sample 1 of {queries.length} Queries</span>
          </div>
          <QueryResultCard query={sampleQuery} />
        </div>
      )}

      {/* Locked Section OR Full Unlocked Queries */}
      {!scan.is_unlocked ? (
        <Card className="relative overflow-hidden border-brand-500/30 p-8 text-center bg-slate-900/90 shadow-2xl">
          {/* Background Blurred Teaser Elements */}
          <div className="space-y-4 filter blur-sm opacity-30 select-none pointer-events-none mb-6">
            {lockedQueries.map((q, idx) => (
              <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-left">
                <p className="font-bold text-sm text-slate-300">"{q.query_text}"</p>
                <div className="mt-2 text-xs text-slate-500">Sample competitor recommendation text masked...</div>
              </div>
            ))}
          </div>

          {/* Foreground Overlay Content */}
          <div className="relative z-10 max-w-xl mx-auto space-y-5 py-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center mx-auto text-brand-400">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-2xl font-black text-white">
              {competitorCount} competitors are being recommended instead of you in these results
            </h3>

            <p className="text-sm text-slate-300">
              Enter your email to unlock your full free report and see all 5 buyer queries across all 4 AI engines.
            </p>

            <Button
              size="lg"
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 text-base shadow-xl"
            >
              See My Full Free Report Now
            </Button>
          </div>
        </Card>
      ) : (
        /* Full Unlocked Breakdown */
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Full Unlocked Query Analysis (5/5 Queries)</span>
            </h3>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              All LLM Responses Revealed
            </span>
          </div>

          <div className="space-y-4">
            {lockedQueries.map((query) => (
              <QueryResultCard key={query.id} query={query} />
            ))}
          </div>

          {/* Phase 2 Upgrade CTA (Placeholder) */}
          <Card className="border-brand-500/40 bg-gradient-to-r from-brand-950/40 via-slate-900 to-slate-950 p-6 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 text-brand-400" />
              <span>PRO MONITORING & COMPETITOR AUDIT</span>
            </div>

            <h4 className="text-xl font-bold text-white">
              Want exact named competitor rankings & weekly automated AI visibility alerts?
            </h4>

            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              Get named competitor frequency breakdowns, step-by-step GEO action plans, and weekly rank tracking across ChatGPT, Gemini, Claude & Perplexity.
            </p>

            <div className="pt-2">
              <Button
                variant="secondary"
                disabled
                className="opacity-75 cursor-not-allowed border-brand-500/30"
              >
                Upgrade to Pro for $12/mo (Coming Soon in Phase 2)
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Email Gate Modal */}
      <EmailGateModal
        scanId={scan.id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUnlocked={() => {
          setIsModalOpen(false);
          fetchScan();
        }}
      />
    </div>
  );
}
