import { NextRequest, NextResponse } from 'next/server';
import { checkIpRateLimit } from '@/lib/scan/ipRateLimiter';
import { checkRateLimit } from '@/lib/scan/rateLimiter';
import { generateQueries } from '@/lib/scan/generateQueries';
import { getCachedQueryResults } from '@/lib/scan/cache';
import { runAllModels } from '@/lib/llm';
import { calculateScore } from '@/lib/scan/calculateScore';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { createAuthServerClient } from '@/lib/supabase/authServer';
import { sanitizeDomain } from '@/lib/utils';
import { ModelResult } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { domain, brand_description, custom_queries } = body;

    if (!domain || typeof domain !== 'string' || !brand_description || typeof brand_description !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid required fields: domain and brand_description are required.' },
        { status: 400 }
      );
    }

    const cleanDomain = sanitizeDomain(domain);

    // Validate domain length and non-emptiness (max valid domain length is 253 chars)
    if (!cleanDomain || cleanDomain.length > 253) {
      return NextResponse.json(
        { error: 'Invalid domain length. Domain must be non-empty and 253 characters or fewer.' },
        { status: 400 }
      );
    }

    // Validate brand_description length (max 200 characters)
    if (brand_description.trim().length === 0 || brand_description.length > 200) {
      return NextResponse.json(
        { error: 'Invalid brand description length. Description must be between 1 and 200 characters.' },
        { status: 400 }
      );
    }

    // Require authentication to run a scan
    const authClient = createAuthServerClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Please log in to run a scan.' },
        { status: 401 }
      );
    }

    const userId = user.id;

    // 0. IP Rate Limit Check (max 3 scans per 60 min per IP)
    const ipRateCheck = await checkIpRateLimit(req);
    if (!ipRateCheck.isAllowed) {
      return NextResponse.json(
        { error: ipRateCheck.error || 'Too many scans from this network. Please try again in a bit.' },
        { status: 429 }
      );
    }

    // 1. Rate Limit Check (30-day limit per domain)
    const rateCheck = await checkRateLimit(cleanDomain);
    if (!rateCheck.isAllowed) {
      if (rateCheck.existingScanId) {
        return NextResponse.json({
          scanId: rateCheck.existingScanId,
          cachedScan: true,
          message: 'A free scan was run for this domain in the last 30 days. Returning existing report.',
        });
      } else {
        return NextResponse.json(
          { error: rateCheck.error || 'Rate limit check failed due to a database error. Please try again later.' },
          { status: 503 }
        );
      }
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
    const insertPayload: Record<string, any> = {
      domain: cleanDomain,
      brand_description: brand_description.trim(),
      custom_queries: custom_queries || [],
      visibility_score: visibilityScore,
      is_unlocked: false,
      user_id: userId,
    };

    let { data: scanRow, error: scanErr } = await supabase
      .from('scans')
      .insert(insertPayload as any)
      .select('id')
      .single();

    // Fallback: If DB schema has not executed 0005_scans_user_id migration yet, retry without user_id
    if (scanErr && (scanErr.message?.includes('user_id') || scanErr.code === 'PGRST204')) {
      delete insertPayload.user_id;
      const retryRes = await supabase
        .from('scans')
        .insert(insertPayload as any)
        .select('id')
        .single();
      scanRow = retryRes.data;
      scanErr = retryRes.error;
    }

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
