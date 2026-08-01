'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Globe, Sparkles, Search, AlertCircle } from 'lucide-react';

interface ScanFormProps {
  onSubmit: (data: { domain: string; brand_description: string; custom_queries: string[] }) => void;
  isLoading: boolean;
}

export const ScanForm: React.FC<ScanFormProps> = ({ onSubmit, isLoading }) => {
  const [domain, setDomain] = useState('');
  const [description, setDescription] = useState('');
  const [query1, setQuery1] = useState('');
  const [query2, setQuery2] = useState('');
  const [errors, setErrors] = useState<{ domain?: string; description?: string }>({});

  const validate = (): boolean => {
    const newErrors: { domain?: string; description?: string } = {};

    const cleanDomain = domain.trim().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    if (!cleanDomain) {
      newErrors.domain = 'Domain name is required (e.g. stripe.com)';
    } else if (!cleanDomain.includes('.')) {
      newErrors.domain = 'Please enter a valid domain (e.g. acme.com)';
    }

    if (!description.trim()) {
      newErrors.description = 'Brand/product description is required';
    } else if (description.length > 200) {
      newErrors.description = 'Description cannot exceed 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const customQueries = [query1.trim(), query2.trim()].filter(Boolean);
      onSubmit({
        domain: domain.trim(),
        brand_description: description.trim(),
        custom_queries: customQueries,
      });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto border-brand-500/20 shadow-2xl shadow-brand-500/10">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Globe className="w-4 h-4 text-brand-400" />
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Target Domain Name <span className="text-brand-400">*</span>
            </label>
          </div>
          <Input
            placeholder="e.g. notion.so or mailchimp.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            error={errors.domain}
          />
        </div>

        <div>
          <div className="flex items-between justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Brand & Product Description <span className="text-brand-400">*</span>
              </label>
            </div>
            <span
              className={`text-xs ${
                description.length > 200 ? 'text-red-400 font-bold' : 'text-slate-400'
              }`}
            >
              {description.length}/200
            </span>
          </div>
          <textarea
            rows={3}
            maxLength={200}
            placeholder="e.g. All-in-one workspace for notes, docs, project management, and team collaboration."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full px-4 py-3 bg-slate-900/80 border ${
              errors.description ? 'border-red-500' : 'border-slate-700/80'
            } rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 shadow-inner resize-none text-sm`}
          />
          {errors.description && (
            <div className="flex items-center gap-1 mt-1 text-xs text-red-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.description}</span>
            </div>
          )}
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Optional Custom Search Queries (2 Max)
            </label>
          </div>
          <Input
            placeholder="e.g. best project management software for startups"
            value={query1}
            onChange={(e) => setQuery1(e.target.value)}
          />
          <Input
            placeholder="e.g. notion alternatives for small teams"
            value={query2}
            onChange={(e) => setQuery2(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full text-base py-4 shadow-xl hover:scale-[1.01]"
          isLoading={isLoading}
        >
          {isLoading ? 'Scanning AI Engine Ecosystem...' : 'Scan AI Visibility Free'}
        </Button>

        <p className="text-xs text-center text-slate-400">
          Scans 4 major AI models in parallel (Gemini, GPT-4o, Claude 3.5, Perplexity). Takes 10-20 seconds.
        </p>
      </form>
    </Card>
  );
};
