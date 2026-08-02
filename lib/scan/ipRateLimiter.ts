import { NextRequest } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function checkIpRateLimit(req: NextRequest): Promise<{
  isAllowed: boolean;
  error?: string;
}> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder') || supabaseKey.includes('placeholder')) {
    console.warn('[checkIpRateLimit] Supabase credentials are missing or using placeholder in .env.local');
    return {
      isAllowed: false,
      error: 'Supabase database is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local',
    };
  }

  const rawIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
  const clientIp = rawIp ? rawIp.split(',')[0].trim() : '127.0.0.1';

  const supabase = getSupabaseServerClient();

  try {
    const { data: limitRow, error } = await supabase
      .from('ip_scan_limits')
      .select('request_count, window_start')
      .eq('ip', clientIp)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') {
        console.error('[checkIpRateLimit] Unexpected database error checking IP rate limit:', error);
        return {
          isAllowed: false,
          error: `Database error (${error.code || 'ERR'}): ${error.message || 'Failed to access ip_scan_limits. Ensure migrations in supabase/migrations/0002_ip_rate_limit.sql are applied.'}`,
        };
      }
    }

    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 60 minutes

    if (!limitRow || (error && (error as any).code === 'PGRST116')) {
      // First scan request for this IP
      const { error: insertErr } = await supabase.from('ip_scan_limits').insert({
        ip: clientIp,
        request_count: 1,
        window_start: new Date(now).toISOString(),
      } as any);

      if (insertErr) {
        console.error('[checkIpRateLimit] Unexpected database error inserting IP limit:', insertErr);
        return {
          isAllowed: false,
          error: `Database error (${insertErr.code || 'ERR'}): ${insertErr.message}`,
        };
      }

      return { isAllowed: true };
    }

    const rowData = limitRow as { request_count: number; window_start: string };
    const windowStart = new Date(rowData.window_start).getTime();

    if (now - windowStart > windowMs) {
      // Window expired, reset counter and window_start
      const { error: resetErr } = await supabase
        .from('ip_scan_limits')
        .update({
          request_count: 1,
          window_start: new Date(now).toISOString(),
        } as any)
        .eq('ip', clientIp);

      if (resetErr) {
        console.error('[checkIpRateLimit] Unexpected database error resetting IP limit:', resetErr);
        return {
          isAllowed: false,
          error: `Database error (${resetErr.code || 'ERR'}): ${resetErr.message}`,
        };
      }

      return { isAllowed: true };
    }

    // Active 60-minute window
    if (rowData.request_count >= 3) {
      return {
        isAllowed: false,
        error: 'Too many scans from this network. Please try again in a bit.',
      };
    }

    // Increment request_count
    const { error: updateErr } = await supabase
      .from('ip_scan_limits')
      .update({
        request_count: rowData.request_count + 1,
      } as any)
      .eq('ip', clientIp);

    if (updateErr) {
      console.error('[checkIpRateLimit] Unexpected database error incrementing IP limit:', updateErr);
      return {
        isAllowed: false,
        error: `Database error (${updateErr.code || 'ERR'}): ${updateErr.message}`,
      };
    }

    return { isAllowed: true };
  } catch (err) {
    console.error('[checkIpRateLimit] Exception during IP rate limit check:', err);
    return {
      isAllowed: false,
      error: `Database connection error: ${err instanceof Error ? err.message : 'Failed to connect to Supabase.'}`,
    };
  }
}
