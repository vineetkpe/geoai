"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";
import { Lock, CheckCircle2, ArrowRight } from "lucide-react";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const supabase = getSupabaseBrowserClient();

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify both fields.");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred while resetting password.");
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
        <h2 className="text-xl font-bold text-[#EDEEF2] mt-3">Set new password</h2>
        <p className="text-sm text-[#6B7280] mt-1">
          Please enter and confirm your new password below.
        </p>
      </div>

      <Card className="shadow-2xl border-[#6B7280]/30">
        {success ? (
          <div className="space-y-6 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#EDEEF2]">Password updated!</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Your password has been successfully reset. You can now access your account with your new password.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/dashboard">
                <Button variant="primary" size="md" className="w-full gap-2">
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3 text-xs text-red-400 font-medium">
                {error}
              </div>
            )}

            <Input
              label="New Password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="mt-2 w-full gap-2"
            >
              <Lock className="w-4 h-4" /> Update Password
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
