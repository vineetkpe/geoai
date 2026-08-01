import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { Scan, ScanQuery } from '@/types';

export async function GET(
  req: NextRequest,
  { params }: { params: { scanId: string } }
) {
  try {
    const scanId = params.scanId;
    if (!scanId) {
      return NextResponse.json({ error: 'Missing scanId' }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

    // 1. Fetch scan
    const { data: scanRow, error: scanErr } = await supabase
      .from('scans')
      .select('*')
      .eq('id', scanId)
      .single();

    if (scanErr || !scanRow) {
      return NextResponse.json({ error: 'Scan record not found' }, { status: 404 });
    }

    const scanData = scanRow as any;

    // 2. Fetch queries with scan_results
    const { data: queriesRows, error: qErr } = await supabase
      .from('scan_queries')
      .select('id, scan_id, query_text, created_at, scan_results(id, scan_query_id, model_name, raw_response, mentioned, competitors_mentioned, status, created_at)')
      .eq('scan_id', scanId)
      .order('created_at', { ascending: true });

    if (qErr) {
      console.error('[GET /api/scan/[scanId]] Error fetching queries:', qErr);
      return NextResponse.json({ error: 'Failed to load scan queries' }, { status: 500 });
    }

    // Check unlocked cookie flag for this visitor's session
    const unlockCookie = req.cookies.get(`unlocked_${scanId}`);
    const isUnlocked = Boolean(unlockCookie?.value);

    // Format output
    const formattedQueries: ScanQuery[] = ((queriesRows as any[]) || []).map((q) => ({
      id: q.id,
      scan_id: q.scan_id,
      query_text: q.query_text,
      created_at: q.created_at,
      results: (q.scan_results || []).map((r: any) => ({
        id: r.id,
        scan_query_id: r.scan_query_id,
        model_name: r.model_name,
        raw_response: r.raw_response,
        mentioned: r.mentioned,
        competitors_mentioned: Array.isArray(r.competitors_mentioned) ? r.competitors_mentioned : [],
        status: r.status || 'success',
        created_at: r.created_at,
      })),
    }));

    const responseScan: Scan = {
      id: scanData.id,
      domain: scanData.domain,
      brand_description: scanData.brand_description,
      custom_queries: Array.isArray(scanData.custom_queries) ? scanData.custom_queries : [],
      visibility_score: Number(scanData.visibility_score),
      is_unlocked: isUnlocked,
      unlocked_by_email: scanData.unlocked_by_email,
      created_at: scanData.created_at,
      queries: formattedQueries,
    };

    return NextResponse.json(responseScan);
  } catch (err) {
    console.error('[GET /api/scan/[scanId]] Error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
