import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createAuthServerClient } from "@/lib/supabase/authServer";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { AdminRequestActions } from "@/components/AdminRequestActions";
import { Shield, Users, Search, AlertCircle } from "lucide-react";

export const revalidate = 0; // Disable static cache for admin dashboard

export default async function AdminDashboardPage() {
  // 1. Check session
  const authClient = createAuthServerClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const serviceClient = getSupabaseServerClient();

  // 2. Check is_admin flag
  const { data: userProfile } = await serviceClient
    .from("users")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (!userProfile?.is_admin) {
    redirect("/");
  }

  // 3a. Fetch pending upgrade requests
  const { data: pendingRequests } = await serviceClient
    .from("upgrade_requests")
    .select("id, user_id, requested_at")
    .eq("status", "pending")
    .order("requested_at", { ascending: false });

  let joinedPendingRequests: Array<{
    id: string;
    user_id: string;
    email: string;
    requested_at: string;
  }> = [];

  if (pendingRequests && pendingRequests.length > 0) {
    const userIds = Array.from(new Set(pendingRequests.map((r) => r.user_id)));
    const { data: requestUsers } = await serviceClient
      .from("users")
      .select("id, email")
      .in("id", userIds);

    const userEmailMap = new Map<string, string>();
    requestUsers?.forEach((u) => userEmailMap.set(u.id, u.email));

    joinedPendingRequests = pendingRequests.map((r) => ({
      ...r,
      email: userEmailMap.get(r.user_id) || "Unknown User",
    }));
  }

  // 3b. Fetch most recent 100 users
  const { data: usersList } = await serviceClient
    .from("users")
    .select("id, email, plan, is_admin, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  // 3c. Fetch most recent 50 scans
  const { data: recentScans } = await serviceClient
    .from("scans")
    .select("id, domain, visibility_score, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <main className="min-h-screen bg-[#0E1420] text-[#EDEEF2] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#6B7280]/20 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/20 mb-2">
              <Shield className="w-3.5 h-3.5" /> Admin Control Panel
            </div>
            <h1 className="text-3xl font-bold font-display tracking-tight text-[#EDEEF2]">
              Admin Dashboard
            </h1>
          </div>
          <Link
            href="/"
            className="text-xs text-[#6B7280] hover:text-[#EDEEF2] transition-colors inline-block"
          >
            ← Return to Scanner
          </Link>
        </div>

        {/* Section 1: Pending Upgrade Requests */}
        <Card className="shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#6B7280]/20 pb-3">
            <h2 className="text-lg font-bold flex items-center gap-2 text-[#EDEEF2]">
              <AlertCircle className="w-5 h-5 text-[#F5A623]" />
              Pending Upgrade Requests ({joinedPendingRequests.length})
            </h2>
          </div>

          {joinedPendingRequests.length === 0 ? (
            <p className="text-sm text-[#6B7280] py-4 text-center">
              No pending upgrade requests.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#EDEEF2]">
                <thead className="text-xs uppercase bg-[#0E1420]/60 text-[#6B7280] border-b border-[#6B7280]/30">
                  <tr>
                    <th className="py-3 px-4">User Email</th>
                    <th className="py-3 px-4">Requested At</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#6B7280]/20">
                  {joinedPendingRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-[#0E1420]/30 transition-colors">
                      <td className="py-3 px-4 font-medium">{req.email}</td>
                      <td className="py-3 px-4 text-xs text-[#6B7280]">
                        {new Date(req.requested_at).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end">
                          <AdminRequestActions requestId={req.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Section 2: Users */}
        <Card className="shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#6B7280]/20 pb-3">
            <h2 className="text-lg font-bold flex items-center gap-2 text-[#EDEEF2]">
              <Users className="w-5 h-5 text-[#F5A623]" />
              Users ({usersList?.length || 0})
            </h2>
          </div>

          {!usersList || usersList.length === 0 ? (
            <p className="text-sm text-[#6B7280] py-4 text-center">
              No users registered yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#EDEEF2]">
                <thead className="text-xs uppercase bg-[#0E1420]/60 text-[#6B7280] border-b border-[#6B7280]/30">
                  <tr>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Plan</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#6B7280]/20">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-[#0E1420]/30 transition-colors">
                      <td className="py-3 px-4 font-medium">{u.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                            u.plan === "premium"
                              ? "bg-[#F5A623]/20 text-[#F5A623] border border-[#F5A623]/30"
                              : "bg-[#6B7280]/20 text-[#6B7280]"
                          }`}
                        >
                          {u.plan}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {u.is_admin ? (
                          <span className="text-emerald-400 font-semibold">Admin</span>
                        ) : (
                          <span className="text-[#6B7280]">User</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs text-[#6B7280]">
                        {new Date(u.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Section 3: Recent Scans */}
        <Card className="shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#6B7280]/20 pb-3">
            <h2 className="text-lg font-bold flex items-center gap-2 text-[#EDEEF2]">
              <Search className="w-5 h-5 text-[#F5A623]" />
              Recent Scans ({recentScans?.length || 0})
            </h2>
          </div>

          {!recentScans || recentScans.length === 0 ? (
            <p className="text-sm text-[#6B7280] py-4 text-center">
              No scans performed yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#EDEEF2]">
                <thead className="text-xs uppercase bg-[#0E1420]/60 text-[#6B7280] border-b border-[#6B7280]/30">
                  <tr>
                    <th className="py-3 px-4">Domain</th>
                    <th className="py-3 px-4">Visibility Score</th>
                    <th className="py-3 px-4">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#6B7280]/20">
                  {recentScans.map((s) => (
                    <tr key={s.id} className="hover:bg-[#0E1420]/30 transition-colors">
                      <td className="py-3 px-4 font-mono text-sm text-[#EDEEF2]">
                        {s.domain}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#F5A623]">
                        {s.visibility_score}%
                      </td>
                      <td className="py-3 px-4 text-xs text-[#6B7280]">
                        {new Date(s.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
