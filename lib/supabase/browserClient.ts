import { createBrowserClient } from '@supabase/ssr';

/**
 * STRICT RULE: This client must ONLY be used for supabase.auth.* calls
 * (signInWithPassword, signUp, signInWithOAuth, signOut, onAuthStateChange).
 * NEVER use it for direct table queries anywhere in the app — all table access
 * stays server-side via the existing lib/supabase/server.ts service-role client.
 */
export function getSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
