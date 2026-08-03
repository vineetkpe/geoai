import React from "react";
import Link from "next/link";
import { createAuthServerClient } from "@/lib/supabase/authServer";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { LogoutButton } from "@/components/LogoutButton";

export async function Header() {
  let user = null;
  let isAdmin = false;

  try {
    const authClient = createAuthServerClient();
    const {
      data: { session },
    } = await authClient.auth.getSession();
    const currentUser = session?.user ?? null;

    if (currentUser) {
      user = currentUser;
      const serviceClient = getSupabaseServerClient();
      const { data: userProfile } = await serviceClient
        .from("users")
        .select("is_admin")
        .eq("id", user.id)
        .maybeSingle();

      isAdmin = Boolean(userProfile?.is_admin);
    }
  } catch {
    // Unauthenticated or error - user stays null
  }

  return (
    <header className="w-full bg-[#0E1420] border-b border-[#6B7280]/20 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left Side Branding */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-bold font-display tracking-tight text-[#EDEEF2] group-hover:text-white transition-colors">
            GEO<span className="text-[#F5A623]">.SCANNER</span>
          </span>
          <span className="hidden md:inline-block text-xs font-medium text-[#6B7280] border-l border-[#6B7280]/30 pl-2">
            AI Visibility Checker
          </span>
        </Link>

        {/* Right Side Navigation */}
        <nav className="flex items-center gap-4 text-sm font-medium">
          {user ? (
            <>
              <span className="hidden sm:inline-block text-xs text-[#6B7280] truncate max-w-[180px]">
                {user.email}
              </span>
              <Link
                href="/dashboard"
                className="text-[#EDEEF2] hover:text-[#F5A623] transition-colors"
              >
                Dashboard
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                >
                  Admin
                </Link>
              )}
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[#EDEEF2] hover:text-[#F5A623] transition-colors text-sm font-medium"
              >
                Log In
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
