import React from "react";
import { Header } from "@/components/Header";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0E1420] text-[#EDEEF2] flex flex-col justify-between">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <LoginForm />
      </main>
    </div>
  );
}
