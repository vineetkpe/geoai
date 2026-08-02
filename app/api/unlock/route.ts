import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scanId, email } = body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!scanId || !email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Valid scanId and email address are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const supabase = getSupabaseServerClient();

    // 1. Insert/Upsert into users table
    const { error: userErr } = await supabase.from('users').upsert(
      {
        email: cleanEmail,
      } as any,
      { onConflict: 'email' }
    );

    if (userErr) {
      console.warn('[POST /api/unlock] User table upsert notice:', userErr);
    }

    // 2. Mark scan as unlocked
    const { error: scanErr } = await supabase
      .from('scans')
      .update({
        is_unlocked: true,
        unlocked_by_email: cleanEmail,
      } as any)
      .eq('id', scanId);

    if (scanErr) {
      console.error('[POST /api/unlock] Error updating scan record:', scanErr);
      return NextResponse.json({ error: 'Failed to unlock scan record' }, { status: 500 });
    }

    // 3. Set cookie session flag
    const response = NextResponse.json({
      success: true,
      scanId,
      email: cleanEmail,
      message: 'Report successfully unlocked.',
    });

    response.cookies.set(`unlocked_${scanId}`, 'true', {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
    });

    return response;
  } catch (err) {
    console.error('[POST /api/unlock] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
