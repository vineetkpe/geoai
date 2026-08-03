import React from "react";
import Link from "next/link";
import { ScanForm } from "@/components/ScanForm";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/Card";
import { RadialSignalDial } from "@/components/RadialSignalDial";
import {
  Search,
  Cpu,
  BarChart2,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Eye,
  Lock,
  Zap,
} from "lucide-react";

export default function Home() {
  const sampleModelStatus = [
    { name: "Gemini", mentioned: true },
    { name: "ChatGPT", mentioned: true },
    { name: "Claude", mentioned: true },
    { name: "Perplexity", mentioned: false },
  ];

  return (
    <div className="min-h-screen bg-[#0E1420] text-[#EDEEF2] flex flex-col justify-between">
      {/* Site Header */}
      <Header />

      <main className="w-full flex-1 space-y-16 sm:space-y-24 py-8 sm:py-16">
        {/* 1. Hero Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Headline, Copy & Scan Form */}
            <div className="lg:col-span-7 space-y-6 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/20">
                <Sparkles className="w-3.5 h-3.5" /> Multi-Engine Generative Engine Audit
              </div>

              <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight tracking-tight text-[#EDEEF2]">
                Is AI recommending you, or your competitor?
              </h1>

              <p className="text-base sm:text-lg text-[#6B7280] leading-relaxed max-w-xl mx-auto sm:mx-0">
                Buyers rely on AI assistants for software and brand recommendations. This scanner tests 5 buyer queries across 4 major AI search models to measure your domain's visibility score.
              </p>

              <div className="pt-2">
                <ScanForm />
              </div>
            </div>

            {/* Right Column: Illustrative Radial Signal Dial Graphic */}
            <div className="lg:col-span-5 hidden lg:flex flex-col items-center justify-center">
              <Card className="p-8 border-[#6B7280]/30 bg-gradient-to-br from-[#1B2333] to-[#0E1420] shadow-2xl flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute top-3 right-3 text-[10px] font-mono text-[#6B7280] uppercase tracking-wider">
                  Live Dial Spec
                </div>
                <RadialSignalDial
                  score={78}
                  modelStatus={sampleModelStatus}
                  size={210}
                  illustrative={true}
                />
                <p className="text-xs text-[#6B7280] text-center mt-4 max-w-xs">
                  Real-time 270° radial signal gauge tracking brand mentions across generative models.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* 2. How It Works Section */}
        <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 scroll-mt-20">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#EDEEF2]">
              How it works
            </h2>
            <p className="text-sm text-[#6B7280]">
              Three deterministic steps to audit your brand's AI search footprint
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-4 border-[#6B7280]/30 hover:border-[#F5A623]/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-center text-[#F5A623]">
                <Search className="w-5 h-5" />
              </div>
              <span className="font-mono text-xs text-[#F5A623] font-semibold block">
                STEP 01
              </span>
              <h3 className="font-bold text-lg text-[#EDEEF2]">
                Generate Buyer Queries
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                We generate 5 realistic search queries buyers use when seeking recommendations in your product category.
              </p>
            </Card>

            <Card className="p-6 space-y-4 border-[#6B7280]/30 hover:border-[#F5A623]/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-center text-[#F5A623]">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="font-mono text-xs text-[#F5A623] font-semibold block">
                STEP 02
              </span>
              <h3 className="font-bold text-lg text-[#EDEEF2]">
                Query 4 AI Engines
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                We query ChatGPT, Gemini, Claude, and Perplexity simultaneously to detect exact brand recommendations.
              </p>
            </Card>

            <Card className="p-6 space-y-4 border-[#6B7280]/30 hover:border-[#F5A623]/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-center text-[#F5A623]">
                <BarChart2 className="w-5 h-5" />
              </div>
              <span className="font-mono text-xs text-[#F5A623] font-semibold block">
                STEP 03
              </span>
              <h3 className="font-bold text-lg text-[#EDEEF2]">
                Calculate Visibility Score
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Receive your Radial Signal Score, per-model mention rate, and competitor recommendation frequency.
              </p>
            </Card>
          </div>
        </section>

        {/* 3. What's in Your Report Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#EDEEF2]">
              What's in your report
            </h2>
            <p className="text-sm text-[#6B7280]">
              Comprehensive visibility breakdown grounded strictly in real LLM query data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 space-y-3 border-[#6B7280]/30">
              <div className="flex items-center gap-2 text-[#F5A623] font-semibold text-sm">
                <BarChart2 className="w-4 h-4" /> AI Visibility Score
              </div>
              <h4 className="font-bold text-base text-[#EDEEF2]">
                Radial Signal Score
              </h4>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                An overall percentage score measuring how frequently your domain is recommended across all 20 query-model executions.
              </p>
            </Card>

            <Card className="p-6 space-y-3 border-[#6B7280]/30">
              <div className="flex items-center gap-2 text-[#F5A623] font-semibold text-sm">
                <Cpu className="w-4 h-4" /> Model Breakdown
              </div>
              <h4 className="font-bold text-base text-[#EDEEF2]">
                Per-Engine Mention Rates
              </h4>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Individual performance breakdown for ChatGPT (GPT-4o mini), Gemini Flash, Claude Haiku, and Perplexity (Sonar).
              </p>
            </Card>

            <Card className="p-6 space-y-3 border-[#6B7280]/30">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <Eye className="w-4 h-4" /> Verified Free Sample
              </div>
              <h4 className="font-bold text-base text-[#EDEEF2]">
                Live Sample LLM Response
              </h4>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Immediate access to 1 unmasked buyer query showing raw model responses and competitor mentions.
              </p>
            </Card>

            <Card className="p-6 space-y-3 border-[#6B7280]/30">
              <div className="flex items-center gap-2 text-[#F5A623] font-semibold text-sm">
                <Lock className="w-4 h-4" /> Full Free Report
              </div>
              <h4 className="font-bold text-base text-[#EDEEF2]">
                All 5 Query Executions
              </h4>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Enter your email address to instantly unlock all 5 buyer queries and 20 individual engine responses.
              </p>
            </Card>

            <Card className="p-6 space-y-3 border-[#6B7280]/30">
              <div className="flex items-center gap-2 text-[#F5A623] font-semibold text-sm">
                <Zap className="w-4 h-4" /> Premium Analytics
              </div>
              <h4 className="font-bold text-base text-[#EDEEF2]">
                Top Competitors Ranking
              </h4>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Premium users unlock exact competitor recommendation frequencies across all model responses.
              </p>
            </Card>

            <Card className="p-6 space-y-3 border-[#6B7280]/30">
              <div className="flex items-center gap-2 text-[#F5A623] font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4" /> Actionable Strategy
              </div>
              <h4 className="font-bold text-base text-[#EDEEF2]">
                Data-Grounded Action Plan
              </h4>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Deterministic, rule-based recommendations tailored to your specific model mention gaps and competitive threats.
              </p>
            </Card>
          </div>
        </section>

        {/* 4. FAQ Section */}
        <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 scroll-mt-20">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/20">
              <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#EDEEF2]">
              Everything you need to know
            </h2>
          </div>

          <div className="space-y-4">
            <Card className="p-5 border-[#6B7280]/30 space-y-2">
              <h3 className="font-bold text-base text-[#EDEEF2]">
                Is this scan free to use?
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Yes! You can run a free AI visibility scan for any domain. Viewing the initial report and verified sample query is completely free, and entering your email unlocks all 5 queries.
              </p>
            </Card>

            <Card className="p-5 border-[#6B7280]/30 space-y-2">
              <h3 className="font-bold text-base text-[#EDEEF2]">
                Which AI search models do you check?
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                We query 4 major AI search models simultaneously: ChatGPT (GPT-4o mini), Gemini Flash, Claude Haiku, and Perplexity (Sonar).
              </p>
            </Card>

            <Card className="p-5 border-[#6B7280]/30 space-y-2">
              <h3 className="font-bold text-base text-[#EDEEF2]">
                How often can I scan the same domain?
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                To prevent API quota abuse and provide consistent benchmarking, free scans for the same domain are limited to once every 30 days. Existing report cached results are returned within that window.
              </p>
            </Card>

            <Card className="p-5 border-[#6B7280]/30 space-y-2">
              <h3 className="font-bold text-base text-[#EDEEF2]">
                What does the AI Visibility Score mean?
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                The score represents the percentage of tested buyer queries where your domain was explicitly mentioned and recommended in the AI model responses.
              </p>
            </Card>

            <Card className="p-5 border-[#6B7280]/30 space-y-2">
              <h3 className="font-bold text-base text-[#EDEEF2]">
                Do you store my submitted data?
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                We store submitted domains, descriptions, and scan outputs solely to generate your report. Email addresses entered during unlock are stored to maintain session access. Read our full{" "}
                <Link href="/privacy" className="text-[#F5A623] hover:underline">
                  Privacy Policy
                </Link>.
              </p>
            </Card>

            <Card className="p-5 border-[#6B7280]/30 space-y-2">
              <h3 className="font-bold text-base text-[#EDEEF2]">
                How do I unlock Premium features?
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Logged-in users can request Premium access directly from their account Dashboard or from the report page. Once approved by an admin, your account receives full competitor rankings and executive action plans.
              </p>
            </Card>
          </div>
        </section>
      </main>

      {/* Expanded Footer */}
      <footer className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 border-t border-[#6B7280]/20 text-center text-xs text-[#6B7280] flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>© {new Date().getFullYear()} AI Visibility Checker. All rights reserved.</span>
        <div className="flex items-center gap-6">
          <a href="#how-it-works" className="hover:text-[#EDEEF2] transition-colors">
            How It Works
          </a>
          <a href="#faq" className="hover:text-[#EDEEF2] transition-colors">
            FAQ
          </a>
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
