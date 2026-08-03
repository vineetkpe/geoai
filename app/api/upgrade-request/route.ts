import { NextResponse } from 'next/server';
import { createAuthServerClient } from '@/lib/supabase/authServer';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const authClient = await createAuthServerClient();
    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const serviceClient = getSupabaseServerClient();

    // Check if user already has a pending request
    const { data: existingRequest, error: fetchError } = await serviceClient
      .from('upgrade_requests')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .maybeSingle();

    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to query existing requests.' },
        { status: 500 }
      );
    }

    if (existingRequest) {
      return NextResponse.json(
        { error: 'You already have a pending upgrade request.' },
        { status: 400 }
      );
    }

    // Insert new upgrade request
    const { data: newRequest, error: insertError } = await serviceClient
      .from('upgrade_requests')
      .insert({
        user_id: user.id,
        status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message || 'Failed to create upgrade request.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      request: newRequest,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
