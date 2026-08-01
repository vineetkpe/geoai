'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { ModelBreakdownItem, ModelName } from '@/types';
import { CheckCircle2, XCircle, AlertCircle, Sparkles, Bot, Compass, Brain } from 'lucide-react';

interface ModelBreakdownProps {
  breakdown: ModelBreakdownItem[];
}

export const ModelBreakdown: React.FC<ModelBreakdownProps> = ({ breakdown }) => {
  const getModelMetadata = (name: ModelName) => {
    switch (name) {
      case 'gemini':
        return {
          title: 'Google Gemini',
          subtitle: 'Gemini 1.5 Flash',
          icon: Sparkles,
          color: 'text-amber-400',
          bgColor: 'bg-amber-500/10 border-amber-500/30',
        };
      case 'gpt':
        return {
          title: 'OpenAI GPT-4o',
          subtitle: 'GPT-4o Mini Tier',
          icon: Bot,
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-500/10 border-emerald-500/30',
        };
      case 'claude':
        return {
          title: 'Anthropic Claude',
          subtitle: 'Claude 3.5 Haiku',
          icon: Brain,
          color: 'text-purple-400',
          bgColor: 'bg-purple-500/10 border-purple-500/30',
        };
      case 'perplexity':
        return {
          title: 'Perplexity AI',
          subtitle: 'Sonar Realtime Web',
          icon: Compass,
          color: 'text-cyan-400',
          bgColor: 'bg-cyan-500/10 border-cyan-500/30',
        };
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-brand-400" />
        <span>Model Visibility Breakdown</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {breakdown.map((item) => {
          const meta = getModelMetadata(item.model_name);
          const Icon = meta.icon;
          const isMentioned = item.mentionedQueries > 0;
          const isUnavailable = item.status === 'unavailable';

          return (
            <Card key={item.model_name} className="relative p-5 hover:border-slate-700 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2.5 rounded-xl border ${meta.bgColor}`}>
                    <Icon className={`w-5 h-5 ${meta.color}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{meta.title}</h4>
                    <p className="text-xs text-slate-400">{meta.subtitle}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </span>
                {isUnavailable ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Unavailable
                  </span>
                ) : isMentioned ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mentioned ({item.mentionedQueries}/{item.totalQueries})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-400 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
                    <XCircle className="w-3.5 h-3.5" />
                    Not Mentioned
                  </span>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
