import { callGemini } from './gemini';
import { callGPT } from './openai';
import { callClaude } from './anthropic';
import { callPerplexity } from './perplexity';
import { ModelResult, ModelName } from '@/types';
import { detectMention } from '@/lib/scan/detectMention';
import { extractCompetitors } from '@/lib/scan/extractCompetitors';

export interface ModelCallConfig {
  name: ModelName;
  fn: (query: string) => Promise<string>;
}

export async function runAllModels(
  query: string,
  domain: string,
  brandDescription: string
): Promise<ModelResult[]> {
  const allModels: ModelCallConfig[] = [
    { name: 'gemini', fn: callGemini },
    { name: 'gpt', fn: callGPT },
    { name: 'claude', fn: callClaude },
    { name: 'perplexity', fn: callPerplexity },
  ];

  const envModels = process.env.ENABLED_MODELS;
  let enabledNames: Set<string>;

  if (envModels && envModels.trim().length > 0) {
    const parsed = envModels
      .split(',')
      .map((m) => m.trim().toLowerCase())
      .filter(Boolean);
    enabledNames = new Set(parsed);
  } else {
    // If unset or empty, default to all 4 enabled
    enabledNames = new Set(['gemini', 'gpt', 'claude', 'perplexity']);
  }

  const enabledModels = allModels.filter((m) => enabledNames.has(m.name));
  const skippedModels = allModels.filter((m) => !enabledNames.has(m.name));

  const results = await Promise.allSettled(
    enabledModels.map((model) => model.fn(query))
  );

  const resultMap = new Map<ModelName, ModelResult>();

  enabledModels.forEach((model, index) => {
    const result = results[index];
    if (result.status === 'fulfilled' && result.value) {
      const rawResponse = result.value;
      const mentioned = detectMention(rawResponse, domain, brandDescription);
      const competitors = extractCompetitors(rawResponse, domain);

      resultMap.set(model.name, {
        model_name: model.name,
        raw_response: rawResponse,
        mentioned,
        competitors_mentioned: competitors,
        status: 'success',
      });
    } else {
      const errorMsg = result.status === 'rejected' ? String(result.reason) : 'Unknown error';
      console.warn(`[runAllModels] ${model.name} failed for query "${query}":`, errorMsg);
      resultMap.set(model.name, {
        model_name: model.name,
        raw_response: `[${model.name.toUpperCase()} Service Unavailable: ${errorMsg}]`,
        mentioned: false,
        competitors_mentioned: [],
        status: 'unavailable',
      });
    }
  });

  skippedModels.forEach((model) => {
    resultMap.set(model.name, {
      model_name: model.name,
      raw_response: '[Skipped for this scan — not enabled in backend config]',
      mentioned: false,
      competitors_mentioned: [],
      status: 'skipped',
    });
  });

  return allModels.map((m) => resultMap.get(m.name)!);
}
