import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createAuthServerClient } from "@/lib/supabase/authServer";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/Header";
import { RequestUpgradeButton } from "@/components/RequestUpgradeButton";
import { CheckCircle2, Clock, Sparkles, ShieldCheck } from "lucide-react";

export default async function UpgradePage() {
  const authClient = createAuthServerClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const serviceClient = getSupabaseServerClient();

  // Fetch current user plan
  const { data: userProfile } = await serviceClient
    .from("users")
    .select("plan")
    .eq("id", user.id)
    .maybeSingle();

  const userPlan = userProfile?.plan || "free";

  // Fetch latest upgrade request
  const { data: latestRequest } = await serviceClient
    .from("upgrade_requests")
    .select("status, requested_at")
    .eq("user_id", user.id)
    .order("requested_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const isPending = latestRequest?.status === "pending";
  const isPremium = userPlan === "premium";

  return (
    <div className="min-h-screen bg-[#0E1420] text-[#EDEEF2] flex flex-col justify-between">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-xl">
          <Card className="shadow-2xl border-[#6B7280]/30 space-y-6">
            {isPremium ? (
              <div className="text-center py-6 space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F5A623]/10 border border-[#F5A623]/30 text-[#F5A623]">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-[#EDEEF2]">
                  You're on Premium
                </h2>
                <p className="text-sm text-[#6B7280] max-w-md mx-auto">
                  Your account has active Premium status. Enjoy unlimited scans, detailed competitor breakdowns, and priority query execution.
                </p>
              </div>
            ) : isPending ? (
              <div className="text-center py-6 space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
                  <Clock className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-[#EDEEF2]">
                  Request Pending
                </h2>
                <p className="text-sm font-medium text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 max-w-md mx-auto">
                  Request sent — we'll review and follow up by email
                </p>
                <p className="text-xs text-[#6B7280]">
                  Submitted for: <span className="text-[#EDEEF2]">{user.email}</span>
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-[#6B7280]/20 pb-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/20 mb-2">
                      <Sparkles className="w-3.5 h-3.5" /> Premium Plan
                    </div>
                    <h2 className="text-2xl font-bold text-[#EDEEF2]">
                      Upgrade to Premium
                    </h2>
                  </div>
                </div>

                <div className="space-y-3 py-2 text-sm text-[#EDEEF2]">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#F5A623] shrink-0 mt-0.5" />
                    <span>Unlimited GEO domain visibility scans & analysis</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#F5A623] shrink-0 mt-0.5" />
                    <span>Full competitor breakdown across GPT, Claude, and Gemini</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#F5A623] shrink-0 mt-0.5" />
                    <span>Custom query generation & optimization recommendations</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#F5A623] shrink-0 mt-0.5" />
                    <span>Priority engine queue & expert support</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#6B7280]/20">
                  <RequestUpgradeButton />
                </div>
              </>
            )}

            <div className="text-center pt-2">
              <Link
                href="/"
                className="text-xs text-[#6B7280] hover:text-[#EDEEF2] transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
