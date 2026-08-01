import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/scan/rateLimiter';
import { generateQueries } from '@/lib/scan/generateQueries';
import { getCachedQueryResults } from '@/lib/scan/cache';
import { runAllModels } from '@/lib/llm';
import { calculateScore } from '@/lib/scan/calculateScore';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { sanitizeDomain } from '@/lib/utils';
import { ModelResult } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { domain, brand_description, custom_queries } = body;

    if (!domain || !brand_description) {
      return NextResponse.json(
        { error: 'Missing required fields: domain and brand_description are required.' },
        { status: 400 }
      );
    }

    const cleanDomain = sanitizeDomain(domain);

    // 1. Rate Limit Check (30-day limit per domain)
    const rateCheck = await checkRateLimit(cleanDomain);
    if (!rateCheck.isAllowed && rateCheck.existingScanId) {
      return NextResponse.json({
        scanId: rateCheck.existingScanId,
        cachedScan: true,
        message: 'A free scan was run for this domain in the last 30 days. Returning existing report.',
      });
    }

    // 2. Generate 5 realistic buyer search queries (Gemini or fallback)
    const queries = await generateQueries(cleanDomain, brand_description, custom_queries || []);

    // 3. For each query, query models (checking 48hr cache first)
    const allQueryExecutions: { query_text: string; results: ModelResult[] }[] = [];
    const rawMatrixResults: ModelResult[][] = [];

    for (const queryText of queries) {
      // Check 48-hour cache across all users
      let modelResults = await getCachedQueryResults(queryText, cleanDomain, brand_description);

      if (!modelResults) {
        // Run fresh model calls across 4 LLMs
        modelResults = await runAllModels(queryText, cleanDomain, brand_description);
      }

      allQueryExecutions.push({
        query_text: queryText,
        results: modelResults,
      });

      rawMatrixResults.push(modelResults);
    }

    // 4. Calculate overall Visibility Score
    const visibilityScore = calculateScore(rawMatrixResults);

    // 5. Persist into Supabase database
    const supabase = getSupabaseServerClient();

    // Insert Scan row
    const { data: scanRow, error: scanErr } = await supabase
      .from('scans')
      .insert({
        domain: cleanDomain,
        brand_description: brand_description.trim(),
        custom_queries: custom_queries || [],
        visibility_score: visibilityScore,
        is_unlocked: false,
      } as any)
      .select('id')
      .single();

    if (scanErr || !scanRow) {
      console.error('[POST /api/scan] Error inserting scan record:', scanErr);
      throw new Error(`Failed to save scan record: ${scanErr?.message}`);
    }

    const scanId = (scanRow as any).id;

    // Insert scan_queries and scan_results
    for (const execution of allQueryExecutions) {
      const { data: queryRow, error: qErr } = await supabase
        .from('scan_queries')
        .insert({
          scan_id: scanId,
          query_text: execution.query_text,
        } as any)
        .select('id')
        .single();

      if (qErr || !queryRow) {
        console.error('[POST /api/scan] Error inserting query record:', qErr);
        continue;
      }

      const scanQueryId = (queryRow as any).id;

      const resultPayloads = execution.results.map((res) => ({
        scan_query_id: scanQueryId,
        model_name: res.model_name,
        raw_response: res.raw_response,
        mentioned: res.mentioned,
        competitors_mentioned: res.competitors_mentioned,
        status: res.status,
      }));

      const { error: resErr } = await supabase.from('scan_results').insert(resultPayloads as any);
      if (resErr) {
        console.error('[POST /api/scan] Error inserting scan_results:', resErr);
      }
    }

    // Upsert domain_scan_limits
    const { error: limitErr } = await supabase.from('domain_scan_limits').upsert(
      {
        domain: cleanDomain,
        last_scan_id: scanId,
        last_scanned_at: new Date().toISOString(),
      } as any,
      { onConflict: 'domain' }
    );

    if (limitErr) {
      console.error('[POST /api/scan] Error updating domain_scan_limits:', limitErr);
    }

    return NextResponse.json({ scanId });
  } catch (err) {
    console.error('[POST /api/scan] Unhandled error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error during scan' },
      { status: 500 }
    );
  }
}
