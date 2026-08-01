import { getSupabaseServerClient } from '@/lib/supabase/server';
import { sanitizeDomain } from '@/lib/utils';

export async function checkRateLimit(domain: string): Promise<{
  isAllowed: boolean;
  existingScanId?: string;
}> {
  const cleanDomain = sanitizeDomain(domain);
  const supabase = getSupabaseServerClient();

  try {
    const { data: limitRow, error } = await supabase
      .from('domain_scan_limits')
      .select('last_scan_id, last_scanned_at')
      .eq('domain', cleanDomain)
      .single();

    if (error) {
      // Check specifically for PostgREST "no rows found" error code (PGRST116)
      if (error.code === 'PGRST116') {
        return { isAllowed: true };
      }
      // Fail closed on any other database error to prevent bypass/unlimited scans
      console.error('[checkRateLimit] Unexpected database error checking rate limit:', error);
      return { isAllowed: false };
    }

    if (!limitRow) {
      return { isAllowed: true };
    }

    const rowData = limitRow as any;
    const lastScannedAt = new Date(rowData.last_scanned_at).getTime();
    const now = Date.now();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

    if (now - lastScannedAt < thirtyDaysMs && rowData.last_scan_id) {
      // Scanned within the last 30 days
      return {
        isAllowed: false,
        existingScanId: rowData.last_scan_id,
      };
    }

    return { isAllowed: true };
  } catch (err) {
    console.error('[checkRateLimit] Exception during rate limit check:', err);
    return { isAllowed: false };
  }
}
