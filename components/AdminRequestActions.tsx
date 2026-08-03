"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface AdminRequestActionsProps {
  requestId: string;
}

export function AdminRequestActions({ requestId }: AdminRequestActionsProps) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (action: "approve" | "reject") => {
    setError(null);
    setLoadingAction(action);

    try {
      const res = await fetch("/api/admin/upgrade-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || `Failed to ${action} request.`);
        setLoadingAction(null);
        return;
      }

      router.refresh();
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
      setLoadingAction(null);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {error && (
        <span className="text-xs text-red-400 font-medium">{error}</span>
      )}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="primary"
          size="sm"
          isLoading={loadingAction === "approve"}
          disabled={loadingAction !== null}
          onClick={() => handleAction("approve")}
        >
          Approve
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          isLoading={loadingAction === "reject"}
          disabled={loadingAction !== null}
          onClick={() => handleAction("reject")}
          className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
        >
          Reject
        </Button>
      </div>
    </div>
  );
}
