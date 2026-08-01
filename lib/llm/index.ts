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
  const models: ModelCallConfig[] = [
    { name: 'gemini', fn: callGemini },
    { name: 'gpt', fn: callGPT },
    { name: 'claude', fn: callClaude },
    { name: 'perplexity', fn: callPerplexity },
  ];

  const results = await Promise.allSettled(
    models.map((model) => model.fn(query))
  );

  return results.map((result, index) => {
    const modelName = models[index].name;
    if (result.status === 'fulfilled' && result.value) {
      const rawResponse = result.value;
      const mentioned = detectMention(rawResponse, domain, brandDescription);
      const competitors = extractCompetitors(rawResponse, domain);

      return {
        model_name: modelName,
        raw_response: rawResponse,
        mentioned,
        competitors_mentioned: competitors,
        status: 'success',
      };
    } else {
      const errorMsg = result.status === 'rejected' ? String(result.reason) : 'Unknown error';
      console.warn(`[runAllModels] ${modelName} failed for query "${query}":`, errorMsg);
      return {
        model_name: modelName,
        raw_response: `[${modelName.toUpperCase()} Service Unavailable: ${errorMsg}]`,
        mentioned: false,
        competitors_mentioned: [],
        status: 'unavailable',
      };
    }
  });
}
