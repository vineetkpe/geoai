"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";
import { Button } from "@/components/ui/Button";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supabase = getSupabaseBrowserClient();

  const handleLogout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Sign out error:", err);
      setLoading(false);
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      isLoading={loading}
      onClick={handleLogout}
      className="text-xs"
    >
      Log Out
    </Button>
  );
}
