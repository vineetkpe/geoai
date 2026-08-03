"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const supabase = getSupabaseBrowserClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  // TODO: re-enable when Google OAuth provider is configured in Supabase
  const handleGoogleLogin = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (oauthError) {
        setError(oauthError.message);
        setGoogleLoading(false);
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred with Google login.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Link href="/" className="inline-block">
          <h1 className="text-2xl font-bold font-display tracking-tight text-[#EDEEF2]">
            GEO<span className="text-[#F5A623]">.SCANNER</span>
          </h1>
        </Link>
        <p className="text-sm text-[#6B7280] mt-2">
          Sign in to your account
        </p>
      </div>

      <Card className="shadow-2xl border-[#6B7280]/30">
        <form onSubmit={handleEmailLogin} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3 text-xs text-red-400 font-medium">
              {error}
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            className="mt-2"
          >
            Sign In
          </Button>
        </form>

        {/* TODO: re-enable when Google OAuth provider is configured in Supabase */}
        {/*
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#6B7280]/30" />
          </div>
          <span className="relative bg-[#1B2333] px-3 text-xs font-semibold uppercase text-[#6B7280]">
            Or
          </span>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="lg"
          isLoading={googleLoading}
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.3-.8-.4-1.7-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
            />
          </svg>
          Continue with Google
        </Button>
        */}

        <p className="text-center text-xs text-[#6B7280] mt-6">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-[#F5A623] hover:underline font-semibold"
          >
            Sign Up
          </Link>
        </p>
      </Card>
    </div>
  );
}
