'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Share2, Check, ExternalLink, Trophy, AlertTriangle, TrendingUp } from 'lucide-react';

interface ScoreDisplayProps {
  domain: string;
  score: number;
  scanId: string;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ domain, score, scanId }) => {
  const [copied, setCopied] = useState(false);

  const getGradeInfo = (val: number) => {
    if (val >= 80) return { label: 'Dominant AI Visibility', color: 'text-emerald-400', bg: 'from-emerald-500/20 to-emerald-500/5', border: 'border-emerald-500/30' };
    if (val >= 50) return { label: 'Moderate AI Visibility', color: 'text-amber-400', bg: 'from-amber-500/20 to-amber-500/5', border: 'border-amber-500/30' };
    if (val >= 20) return { label: 'Low AI Visibility', color: 'text-orange-400', bg: 'from-orange-500/20 to-orange-500/5', border: 'border-orange-500/30' };
    return { label: 'Invisible in AI Engine Search', color: 'text-red-400', bg: 'from-red-500/20 to-red-500/5', border: 'border-red-500/30' };
  };

  const grade = getGradeInfo(score);
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/scan/${scanId}` : '';

  const handleCopyLink = () => {
    if (navigator.clipboard && shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTwitterShare = () => {
    const text = `Our AI Visibility Score for ${domain} is ${score}%! Check your brand's recommended status across AI engines:`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  return (
    <Card className={`relative overflow-hidden border ${grade.border} bg-gradient-to-br ${grade.bg} p-8 text-center shadow-2xl`}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <span className="px-3 py-1 bg-slate-900/80 border border-slate-700/80 rounded-full text-xs font-semibold text-slate-300">
          Target Domain: <strong className="text-white">{domain}</strong>
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1.5"
            title="Copy Report Link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
          <button
            onClick={handleTwitterShare}
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1.5"
            title="Post on X / Twitter"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Tweet</span>
          </button>
        </div>
      </div>

      <div className="py-6">
        <div className="inline-flex items-baseline justify-center gap-1">
          <span className="text-7xl font-extrabold tracking-tight text-white drop-shadow-md">
            {score}
          </span>
          <span className="text-3xl font-bold text-brand-400">%</span>
        </div>
        <div className={`mt-3 inline-block px-4 py-1.5 rounded-full text-sm font-bold border ${grade.border} ${grade.color} bg-slate-950/60`}>
          {grade.label}
        </div>
      </div>

      <p className="text-xs text-slate-400 max-w-lg mx-auto">
        Based on query sampling across Gemini, GPT-4o Mini, Claude Haiku, and Perplexity Sonar.
      </p>
    </Card>
  );
};
