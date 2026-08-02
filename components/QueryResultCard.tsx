'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ScanQuery, ScanResult, ModelName } from '@/types';
import { CheckCircle2, XCircle, AlertCircle, MinusCircle, Quote, Bot, Sparkles, Brain, Compass } from 'lucide-react';

interface QueryResultCardProps {
  query: ScanQuery;
  isLocked?: boolean;
}

export const QueryResultCard: React.FC<QueryResultCardProps> = ({ query, isLocked = false }) => {
  const [selectedModel, setSelectedModel] = useState<ModelName>('gpt');

  const results = query.results || [];
  const activeResult = results.find((r) => r.model_name === selectedModel) || results[0];

  const getModelLabel = (name: ModelName) => {
    switch (name) {
      case 'gemini': return 'Gemini';
      case 'gpt': return 'GPT-4o';
      case 'claude': return 'Claude 3.5';
      case 'perplexity': return 'Perplexity';
    }
  };

  return (
    <Card className={`relative transition-all border-slate-800 ${isLocked ? 'blur-sm select-none opacity-60' : ''}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Quote className="w-5 h-5 text-brand-400 shrink-0" />
          <h4 className="text-base font-bold text-white leading-snug">
            "{query.query_text}"
          </h4>
        </div>
      </div>

      {/* Model Selector Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {results.map((res) => {
          const isSelected = res.model_name === selectedModel;
          const isMentioned = res.mentioned;
          const isUnavailable = res.status === 'unavailable';
          const isSkipped = res.status === 'skipped';

          return (
            <button
              key={res.id || res.model_name}
              onClick={() => setSelectedModel(res.model_name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                isSelected
                  ? 'bg-brand-500/20 border-brand-500 text-white shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{getModelLabel(res.model_name)}</span>
              {isSkipped ? (
                <MinusCircle className="w-3 h-3 text-slate-400" />
              ) : isUnavailable ? (
                <AlertCircle className="w-3 h-3 text-amber-400" />
              ) : isMentioned ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              ) : (
                <XCircle className="w-3 h-3 text-red-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Model Response Display */}
      {activeResult && (
        <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 font-mono text-xs text-slate-300 space-y-3 leading-relaxed">
          <div className="flex items-center justify-between text-slate-400 font-sans pb-2 border-b border-slate-800">
            <span className="font-semibold text-white">
              {getModelLabel(activeResult.model_name)} Response
            </span>
            <span className="flex items-center gap-1">
              Status:{' '}
              <strong
                className={
                  activeResult.status === 'skipped'
                    ? 'text-slate-400'
                    : activeResult.status === 'unavailable'
                    ? 'text-amber-400'
                    : activeResult.mentioned
                    ? 'text-emerald-400'
                    : 'text-red-400'
                }
              >
                {activeResult.status === 'skipped'
                  ? 'Skipped'
                  : activeResult.status === 'unavailable'
                  ? 'Unavailable'
                  : activeResult.mentioned
                  ? 'Mentioned'
                  : 'Not Mentioned'}
              </strong>
            </span>
          </div>

          <div className="max-h-60 overflow-y-auto whitespace-pre-wrap pr-2 text-slate-300">
            {activeResult.raw_response}
          </div>
        </div>
      )}
    </Card>
  );
};
