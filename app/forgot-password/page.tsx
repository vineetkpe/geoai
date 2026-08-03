import React from "react";
import { Header } from "@/components/Header";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";

export const metadata = {
  title: "Reset Password | GEO.SCANNER",
  description: "Request a password reset link for your GEO.SCANNER account.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#0E1420] text-[#EDEEF2] flex flex-col justify-between">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <ForgotPasswordForm />
      </main>
    </div>
  );
}
