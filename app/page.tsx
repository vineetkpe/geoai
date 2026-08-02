import React from "react";
import Link from "next/link";
import { ScanForm } from "@/components/ScanForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0E1420] text-[#EDEEF2] flex flex-col justify-between">
      {/* 1. Simple Header */}
      <header className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 text-center sm:text-left">
        <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#EDEEF2]">
          AI Visibility Checker
        </span>
      </header>

      {/* Main Centered Column */}
      <main className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-12 space-y-12 sm:space-y-16 flex-1">
        {/* 2. Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight tracking-tight text-[#EDEEF2]">
            Is AI recommending you, or your competitor?
          </h1>
          <p className="text-base sm:text-lg text-[#6B7280] max-w-xl mx-auto leading-relaxed">
            AI assistants are increasingly where people turn to ask for product and category recommendations. This tool checks whether your business actually shows up in those answers.
          </p>
        </section>

        {/* 3. Scan Form */}
        <section>
          <ScanForm />
        </section>

        {/* 4. How It Works Section */}
        <section className="pt-8 border-t border-[#6B7280]/20 space-y-6">
          <h2 className="font-display text-xl font-bold text-[#EDEEF2] text-center">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center sm:text-left">
            <div className="bg-[#1B2333] border border-[#6B7280]/30 rounded-xl p-5 space-y-2">
              <span className="font-mono text-xs text-[#F5A623] font-semibold block">
                01
              </span>
              <p className="text-sm text-[#EDEEF2] leading-snug">
                We ask 4 real AI models buyer-style questions about your category.
              </p>
            </div>

            <div className="bg-[#1B2333] border border-[#6B7280]/30 rounded-xl p-5 space-y-2">
              <span className="font-mono text-xs text-[#F5A623] font-semibold block">
                02
              </span>
              <p className="text-sm text-[#EDEEF2] leading-snug">
                We check if your business is mentioned in the recommendations.
              </p>
            </div>

            <div className="bg-[#1B2333] border border-[#6B7280]/30 rounded-xl p-5 space-y-2">
              <span className="font-mono text-xs text-[#F5A623] font-semibold block">
                03
              </span>
              <p className="text-sm text-[#EDEEF2] leading-snug">
                You get your score and see who's winning instead of you.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 5. Minimal Footer */}
      <footer className="w-full max-w-4xl mx-auto px-4 py-8 border-t border-[#6B7280]/20 text-center text-xs text-[#6B7280] flex flex-col sm:flex-row items-center justify-between gap-4">
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
