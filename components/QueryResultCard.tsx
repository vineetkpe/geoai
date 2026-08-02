'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ScanQuery, ScanResult, ModelName } from '@/types';
import { CheckCircle2, XCircle, AlertCircle, MinusCircle, Quote, ChevronDown, ChevronUp } from 'lucide-react';

interface QueryResultCardProps {
  query: ScanQuery;
  isLocked?: boolean;
}

export const QueryResultCard: React.FC<QueryResultCardProps> = ({ query, isLocked = false }) => {
  const [selectedModel, setSelectedModel] = useState<ModelName>('gpt');
  const [isExpanded, setIsExpanded] = useState(false);

  const results = query.results || [];
  const activeResult = results.find((r) => r.model_name === selectedModel) || results[0];

  const handleSelectModel = (modelName: ModelName) => {
    setSelectedModel(modelName);
    setIsExpanded(false);
  };

  const getModelLabel = (name: ModelName) => {
    switch (name) {
      case 'gemini': return 'Gemini';
      case 'gpt': return 'GPT';
      case 'claude': return 'Claude';
      case 'perplexity': return 'Perplexity';
    }
  };

  const getResponseContent = (res: ScanResult) => {
    if (res.status === 'unavailable') {
      return "This model didn't respond for this query. This can happen occasionally — the other models' results below are still accurate.";
    }
    if (res.status === 'skipped') {
      return "This model wasn't checked for this scan.";
    }
    return res.raw_response;
  };

  const responseText = activeResult ? getResponseContent(activeResult) : '';
  const isLong = responseText.length > 250 && activeResult?.status === 'success';
  const displayText = isLong && !isExpanded ? `${responseText.slice(0, 250)}...` : responseText;

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
              onClick={() => handleSelectModel(res.model_name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${isSelected
                  ? 'bg-brand-500/20 border-brand-500 text-white shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
            >
              <span>{getModelLabel(res.model_name)}</span>
              {isSkipped ? (
                <MinusCircle className="w-3.5 h-3.5 text-slate-400" />
              ) : isUnavailable ? (
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              ) : isMentioned ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-red-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Model Response Display */}
      {activeResult && (
        <div className="bg-slate-950/60 rounded-xl p-4 sm:p-5 border border-slate-800/80 space-y-3">
          {/* Prominent Plain-Language Result Line */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="font-bold text-sm sm:text-base">
              {activeResult.status === 'skipped' ? (
                <span className="text-slate-400 flex items-center gap-2">
                  <MinusCircle className="w-4 h-4 text-slate-400 shrink-0" />
                  This model wasn't checked for this scan
                </span>
              ) : activeResult.status === 'unavailable' ? (
                <span className="text-amber-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  This model didn't respond for this query
                </span>
              ) : activeResult.mentioned ? (
                <span className="text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Mentioned your business
                </span>
              ) : (
                <span className="text-red-400 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  Did not mention your business — recommended other options instead
                </span>
              )}
            </div>
            <span className="text-xs font-semibold text-slate-400 hidden sm:inline-block">
              {getModelLabel(activeResult.model_name)}
            </span>
          </div>

          {/* Response Text (Normal Body Font, Comfortable Reading Size) */}
          <div className="text-sm text-slate-300 leading-relaxed space-y-2 font-normal">
            <p className="whitespace-pre-line">{displayText}</p>

            {isLong && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors inline-flex items-center gap-1 focus:outline-none"
              >
                <span>{isExpanded ? 'Show less' : 'Read full response'}</span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
