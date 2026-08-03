import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/Header';

export const metadata = {
  title: 'Privacy Policy - AI Visibility Checker',
  description: 'Privacy Policy for AI Visibility Checker',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-pageBg text-primaryText flex flex-col justify-between">
      <Header />

      <main className="w-full max-w-3xl mx-auto px-4 py-8 sm:py-12 flex-1">
        <Card className="space-y-6">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-primaryText">Privacy Policy</h1>
          <p className="text-sm text-mutedText">Last updated: August 2, 2026</p>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primaryText">1. Information We Collect</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              When you use AI Visibility Checker, we collect the domain name and brand description you submit for scanning. If you choose to unlock a full report, we also collect your email address.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primaryText">2. How We Use Your Information</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              We use the submitted domain and brand description strictly to execute AI queries, calculate your visibility score, and generate your report. We use your email address to unlock report features and send relevant updates about our product.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primaryText">3. Third-Party AI Services</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              To evaluate your brand visibility across generative search engines, generated scan queries are processed via API integrations with third-party providers, including Google, OpenAI, Anthropic, and Perplexity. We do not sell your personal data or submitted information to third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primaryText">4. Cookies</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              We use essential HTTP-only cookies (such as unlock session state cookies) solely to maintain your session authorization state after you unlock a report.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primaryText">5. Contact Us</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              If you have any questions or concerns regarding this Privacy Policy, please contact us at <span className="text-accent">[SUPPORT_EMAIL]</span>.
            </p>
          </section>

          <div className="pt-4 border-t border-slate-800">
            <Link href="/" className="text-xs text-accent hover:underline">
              ← Back to Home
            </Link>
          </div>
        </Card>
      </main>

      <footer className="w-full max-w-4xl mx-auto px-4 py-8 border-t border-[#6B7280]/20 text-center text-xs text-mutedText flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>© {new Date().getFullYear()} AI Visibility Checker. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-primaryText transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-primaryText transition-colors">
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
}
