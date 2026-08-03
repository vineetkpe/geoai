"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";
import { Mail, CheckCircle2, ArrowLeft } from "lucide-react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const supabase = getSupabaseBrowserClient();

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const redirectTo = `${window.location.origin}/auth/callback?next=/reset-password`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo }
      );

      if (resetError) {
        setError(resetError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
      setLoading(false);
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
        <h2 className="text-xl font-bold text-[#EDEEF2] mt-3">Reset your password</h2>
        <p className="text-sm text-[#6B7280] mt-1">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <Card className="shadow-2xl border-[#6B7280]/30">
        {success ? (
          <div className="space-y-6 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#EDEEF2]">Check your email</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                We sent a password reset link to{" "}
                <span className="text-[#EDEEF2] font-semibold">{email}</span>. Please click the link in the email to set a new password.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/login">
                <Button variant="secondary" size="md" className="w-full gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back to Log In
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleResetRequest} className="space-y-4">
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

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="mt-2 w-full gap-2"
            >
              <Mail className="w-4 h-4" /> Send Reset Link
            </Button>

            <div className="pt-4 border-t border-[#6B7280]/20 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#EDEEF2] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Log In
              </Link>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
