import type { Metadata } from 'next';
import './globals.css';
import React from 'react';
import { Sparkles, ShieldCheck, Github } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI Visibility Checker | Measure Your Brand Across AI Search Engines',
  description: 'Check how your brand or domain ranks across Gemini, GPT-4o, Claude 3.5, and Perplexity in 20 seconds.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 flex flex-col min-h-screen relative antialiased selection:bg-brand-500 selection:text-white">
        {/* Background glow graphics */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-brand-600/20 via-brand-500/5 to-transparent blur-3xl opacity-60" />
        </div>

        {/* Navigation Bar */}
        <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-white tracking-tight">AI Visibility</span>
                <span className="text-brand-400 font-bold text-lg"> Checker</span>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>4 LLMs Analyzed Live</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Body */}
        <main className="relative z-10 flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-slate-900 bg-slate-950/80 py-8 text-center text-xs text-slate-500">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} AI Visibility Checker. Built for modern GEO & AI SEO optimization.</p>
            <p className="text-slate-600">Evaluates Gemini, GPT-4o, Claude 3.5 & Perplexity Sonar</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
