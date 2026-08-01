import { getSupabaseServerClient } from '@/lib/supabase/server';
import { ModelResult, ModelName } from '@/types';
import { detectMention } from './detectMention';
import { extractCompetitors } from './extractCompetitors';

export async function getCachedQueryResults(
  queryText: string,
  domain: string,
  brandDescription?: string
): Promise<ModelResult[] | null> {
  const supabase = getSupabaseServerClient();

  try {
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    // Query scan_queries joined with scan_results run within the last 48 hours
    const { data: matchedQueries, error: queryErr } = await supabase
      .from('scan_queries')
      .select('id, scan_results(model_name, raw_response, mentioned, competitors_mentioned, status, created_at)')
      .eq('query_text', queryText)
      .gt('created_at', fortyEightHoursAgo)
      .order('created_at', { ascending: false })
      .limit(1);

    if (queryErr || !matchedQueries || matchedQueries.length === 0) {
      return null;
    }

    const latestQuery: any = matchedQueries[0];
    const results: any[] = latestQuery?.scan_results;

    if (!results || !Array.isArray(results) || results.length === 0) {
      return null;
    }

    // Check if we have results for all 4 models
    const requiredModels: ModelName[] = ['gemini', 'gpt', 'claude', 'perplexity'];
    const cachedModelResults: ModelResult[] = [];

    for (const model of requiredModels) {
      const match = results.find((r: any) => r.model_name === model);
      if (match) {
        // Re-evaluate mention detection & competitors for the current target domain
        const reEvaluatedMention = detectMention(match.raw_response, domain, brandDescription);
        const reEvaluatedCompetitors = extractCompetitors(match.raw_response, domain);

        cachedModelResults.push({
          model_name: model,
          raw_response: match.raw_response,
          mentioned: reEvaluatedMention,
          competitors_mentioned: reEvaluatedCompetitors,
          status: (match.status as 'success' | 'unavailable') || 'success',
        });
      } else {
        // Missing a model, invalidate cache
        return null;
      }
    }

    return cachedModelResults;
  } catch (err) {
    console.warn('[getCachedQueryResults] Cache lookup error:', err);
    return null;
  }
}
