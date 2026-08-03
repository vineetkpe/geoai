import { NextResponse } from 'next/server';
import { createAuthServerClient } from '@/lib/supabase/authServer';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { requestId, action } = await request.json();

    if (!requestId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid parameters. requestId and action (approve|reject) are required.' },
        { status: 400 }
      );
    }

    // 1. Verify caller session
    const authClient = createAuthServerClient();
    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Verify caller is admin
    const serviceClient = getSupabaseServerClient();
    const { data: adminCheck } = await serviceClient
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .maybeSingle();

    if (!adminCheck?.is_admin) {
      return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    // 3. Verify target request exists and status is pending
    const { data: upgradeReq, error: fetchErr } = await serviceClient
      .from('upgrade_requests')
      .select('id, user_id, status')
      .eq('id', requestId)
      .maybeSingle();

    if (fetchErr || !upgradeReq) {
      return NextResponse.json({ error: 'Upgrade request not found.' }, { status: 404 });
    }

    if (upgradeReq.status !== 'pending') {
      return NextResponse.json(
        { error: `Request has already been ${upgradeReq.status}.` },
        { status: 400 }
      );
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    const nowIso = new Date().toISOString();

    // 4. Update request status
    const { error: updateReqErr } = await serviceClient
      .from('upgrade_requests')
      .update({
        status: newStatus,
        resolved_at: nowIso,
      })
      .eq('id', requestId);

    if (updateReqErr) {
      return NextResponse.json(
        { error: updateReqErr.message || 'Failed to update request status.' },
        { status: 500 }
      );
    }

    // 5. If approved, update user plan to premium
    if (action === 'approve') {
      const { error: updateUserErr } = await serviceClient
        .from('users')
        .update({ plan: 'premium' })
        .eq('id', upgradeReq.user_id);

      if (updateUserErr) {
        return NextResponse.json(
          { error: updateUserErr.message || 'Failed to upgrade user plan.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true, status: newStatus });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
