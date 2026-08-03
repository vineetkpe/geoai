"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function RequestUpgradeButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestUpgrade = async () => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/upgrade-request", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit request.");
        setLoading(false);
        return;
      }

      router.refresh();
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      {error && (
        <div className="w-full bg-red-500/10 border border-red-500/40 rounded-lg p-3 text-xs text-red-400 font-medium text-center">
          {error}
        </div>
      )}
      <Button
        variant="primary"
        size="lg"
        isLoading={loading}
        onClick={handleRequestUpgrade}
        className="w-full"
      >
        Request Premium Access
      </Button>
    </div>
  );
}
