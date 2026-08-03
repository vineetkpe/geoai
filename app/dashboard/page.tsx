import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createAuthServerClient } from "@/lib/supabase/authServer";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScanForm } from "@/components/ScanForm";
import { Sparkles, History, Search, ArrowRight, ExternalLink } from "lucide-react";

export default async function DashboardPage() {
  const authClient = createAuthServerClient();
  const {
    data: { session },
  } = await authClient.auth.getSession();
  const user = session?.user ?? null;

  if (!user) {
    redirect("/login");
  }

  const serviceClient = getSupabaseServerClient();

  // Fetch user plan and scans concurrently
  const [profileResult, scansResult] = await Promise.all([
    serviceClient
      .from("users")
      .select("plan")
      .eq("id", user.id)
      .maybeSingle(),
    serviceClient
      .from("scans")
      .select("id, domain, visibility_score, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const userPlan = profileResult.data?.plan || "free";
  const isPremium = userPlan === "premium";
  const scans = scansResult.data || [];

  return (
    <div className="min-h-screen bg-[#0E1420] text-[#EDEEF2] flex flex-col justify-between">
      <Header />

      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#6B7280]/20 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-[#EDEEF2]">
              Welcome back, <span className="text-[#F5A623]">{user.email}</span>
            </h1>
            <p className="text-sm text-[#6B7280] mt-1">
              Manage your domain AI visibility reports & subscription status
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold">
              Current Plan:
            </span>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                isPremium
                  ? "bg-[#F5A623]/20 text-[#F5A623] border border-[#F5A623]/30"
                  : "bg-[#6B7280]/20 text-[#EDEEF2] border border-[#6B7280]/40"
              }`}
            >
              {userPlan}
            </span>
          </div>
        </div>

        {/* Upgrade Prompt Banner (If Free Plan) */}
        {!isPremium && (
          <Card className="border-[#F5A623]/30 bg-gradient-to-r from-[#1B2333] via-[#1B2333] to-[#F5A623]/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F5A623]/20 text-[#F5A623] border border-[#F5A623]/30 mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Upgrade Available
              </div>
              <h3 className="text-lg font-bold text-[#EDEEF2]">
                Unlock Competitor Frequency & Executive Action Plans
              </h3>
              <p className="text-xs text-[#6B7280] max-w-xl">
                Get full competitor rankings, per-model breakdowns, and data-grounded action plans across ChatGPT, Gemini, Claude, and Perplexity.
              </p>
            </div>
            <Link href="/upgrade" className="shrink-0 w-full sm:w-auto">
              <Button variant="primary" size="md" className="w-full sm:w-auto gap-2">
                Request Premium Access <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </Card>
        )}

        {/* Run a New Scan Section */}
        <Card className="shadow-xl space-y-4">
          <div className="border-b border-[#6B7280]/20 pb-3">
            <h2 className="text-lg font-bold flex items-center gap-2 text-[#EDEEF2]">
              <Search className="w-5 h-5 text-[#F5A623]" />
              Run a New Scan
            </h2>
            <p className="text-xs text-[#6B7280] mt-1">
              Enter your domain and description to check your AI search visibility score across major models.
            </p>
          </div>
          <ScanForm />
        </Card>

        {/* Scans History Section */}
        <Card className="shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#6B7280]/20 pb-3">
            <h2 className="text-lg font-bold flex items-center gap-2 text-[#EDEEF2]">
              <History className="w-5 h-5 text-[#F5A623]" />
              Your Domain Scans ({scans.length})
            </h2>
            <Link href="/">
              <Button variant="secondary" size="sm" className="gap-1.5">
                <Search className="w-3.5 h-3.5 text-[#F5A623]" /> Run New Scan
              </Button>
            </Link>
          </div>

          {scans.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#6B7280]/10 border border-[#6B7280]/20 flex items-center justify-center mx-auto text-[#6B7280]">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#EDEEF2]">
                  No domain scans yet
                </h3>
                <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
                  Run your first AI visibility scan to analyze your brand's recommendations across major AI models.
                </p>
              </div>
              <Link href="/">
                <Button variant="primary" size="md" className="mt-2">
                  Run Your First Scan
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#EDEEF2]">
                <thead className="text-xs uppercase bg-[#0E1420]/60 text-[#6B7280] border-b border-[#6B7280]/30">
                  <tr>
                    <th className="py-3 px-4">Domain</th>
                    <th className="py-3 px-4">Visibility Score</th>
                    <th className="py-3 px-4">Scan Date</th>
                    <th className="py-3 px-4 text-right">Report</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#6B7280]/20">
                  {scans.map((scan) => (
                    <tr
                      key={scan.id}
                      className="hover:bg-[#0E1420]/40 transition-colors group cursor-pointer"
                    >
                      <td className="py-3 px-4 font-mono font-medium text-[#EDEEF2]">
                        <Link
                          href={`/scan/${scan.id}`}
                          className="hover:text-[#F5A623] transition-colors"
                        >
                          {scan.domain}
                        </Link>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#F5A623]">
                        {scan.visibility_score}%
                      </td>
                      <td className="py-3 px-4 text-xs text-[#6B7280]">
                        {new Date(scan.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/scan/${scan.id}`}
                          className="inline-flex items-center gap-1 text-xs text-[#F5A623] hover:underline font-semibold"
                        >
                          View Report <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-8 border-t border-[#6B7280]/20 text-center text-xs text-[#6B7280] flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>© {new Date().getFullYear()} AI Visibility Checker. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-[#EDEEF2] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-[#EDEEF2] transition-colors">
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
}
