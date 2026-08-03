import React from "react";
import { Header } from "@/components/Header";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export const metadata = {
  title: "Update Password | GEO.SCANNER",
  description: "Set a new password for your GEO.SCANNER account.",
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#0E1420] text-[#EDEEF2] flex flex-col justify-between">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <ResetPasswordForm />
      </main>
    </div>
  );
}
