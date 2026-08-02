# AI Visibility Checker

**AI Visibility Checker** is a Next.js 14 (App Router, TypeScript) application that measures how visible your brand or domain is across 4 major AI search models: **Google Gemini**, **OpenAI ChatGPT**, **Anthropic Claude**, and **Perplexity AI**.

---

## 🚀 Features

- **Multi-LLM Parallel Execution**: Queries Gemini 2.5 Flash-Lite, GPT-4o Mini, Claude 3.5 Haiku, and Perplexity Sonar concurrently with graceful error isolation per model.
- **AI Query Synthesis**: Generates 5 realistic buyer search queries based on brand description and custom inputs.
- **30-Day Domain Rate Limiting**: Prevents abuse by enforcing 1 free scan per domain every 30 days via `domain_scan_limits`.
- **48-Hour Result Caching**: Reuses identical query results executed within 48 hours to minimize API costs.
- **Anti-Spoofing Dynamic OG Card**: Generates shareable score cards via `/api/og?scanId=[scanId]` fetching verified database scores directly from Supabase.
- **Lead Capture Email Gate**: Captures emails to unlock full 5-query x 4-model response breakdowns.

---

## 🛠️ Project Structure

```
ai-visibility-checker/
├── app/
│   ├── page.tsx                    # Landing page + scan form
│   ├── layout.tsx                  # Global layout + theme styles
│   ├── globals.css                 # Tailwind CSS styles & animations
│   ├── scan/
│   │   └── [scanId]/
│   │       └── page.tsx            # Interactive score & breakdown report
│   └── api/
│       ├── scan/
│       │   └── route.ts            # POST: Rate limit, query gen, 48h cache, LLM scan, save DB
│       ├── scan/[scanId]/
│       │   └── route.ts            # GET: Retrieve scan report & query matrix
│       ├── unlock/
│       │   └── route.ts            # POST: Capture email & unlock full report
│       └── og/
│           └── route.tsx           # Anti-spoofing dynamic OG score card
├── components/
│   ├── ScanForm.tsx                # Input form with domain, description & custom queries
│   ├── ScoreDisplay.tsx            # Visibility score hero badge & share triggers
│   ├── ModelBreakdown.tsx          # Status grid across 4 LLM models
│   ├── QueryResultCard.tsx         # Verified sample & full query response viewer
│   ├── EmailGateModal.tsx          # Email capture dialog to unlock report
│   ├── LoadingScan.tsx             # Animated scan progress indicator
│   └── ui/                         # Reusable UI elements (Button, Input, Card)
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser Supabase client
│   │   ├── server.ts               # Service-role Supabase server client
│   │   └── types.ts                # DB row interfaces
│   ├── llm/
│   │   ├── gemini.ts                # Gemini API wrapper
│   │   ├── openai.ts                # GPT-4o Mini wrapper
│   │   ├── anthropic.ts             # Claude 3.5 Haiku wrapper
│   │   ├── perplexity.ts            # Perplexity Sonar wrapper
│   │   └── index.ts                 # Unified runAllModels execution engine
│   ├── scan/
│   │   ├── generateQueries.ts       # Gemini query generator with fallback templates
│   │   ├── detectMention.ts         # Case-insensitive + fuzzy brand mention detector
│   │   ├── extractCompetitors.ts    # Heuristic competitor brand extractor
│   │   ├── calculateScore.ts        # Visibility percentage score calculator
│   │   ├── rateLimiter.ts           # 30-day per-domain rate limiter
│   │   └── cache.ts                 # 48-hour LLM query response cache
│   └── utils.ts
├── supabase/
│   └── migrations/
│       └── 0001_init.sql            # Runnable SQL migration file
├── types/
│   └── index.ts                     # Shared TypeScript types
├── .env.local.example                # Blank environment variables template
├── .env.local                        # Real secret environment keys (gitignored)
├── .gitignore                        # Git exclusion rules
├── next.config.js
├── tailwind.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📋 Prerequisites & Supabase Setup

### 1. Database Setup (Supabase)
1. Create a project at [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open `supabase/migrations/0001_init.sql` from this repository, paste its contents, and click **Run**.
4. This creates tables for `scans`, `scan_queries`, `scan_results`, `domain_scan_limits`, and `users` with indexes and constraints.

---

## 🔑 Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in the required API keys:

| Variable | Description | Where to get it |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | Supabase Dashboard > Project Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key | Supabase Dashboard > Project Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key | Supabase Dashboard > Project Settings > API |
| `GEMINI_API_KEY` | Google Gemini API Key | [Google AI Studio](https://aistudio.google.com/) |
| `OPENAI_API_KEY` | OpenAI API Key | [OpenAI Platform](https://platform.openai.com/) |
| `ANTHROPIC_API_KEY` | Anthropic API Key | [Anthropic Console](https://console.anthropic.com/) |
| `PERPLEXITY_API_KEY` | Perplexity API Key | [Perplexity Settings](https://www.perplexity.ai/settings/api) |
| `RESEND_API_KEY` | Resend API Key | Optional for lead email notifications |
| `ENABLED_MODELS` | Optional comma-separated model filter (`gemini,gpt,claude,perplexity`). Defaults to all 4 if unset. | Internal testing / config |

---

## 💻 Local Development

1. Install dependencies:
```bash
npm install
```

2. Run the Next.js development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deployment (Vercel)

1. Push your code to a Git repository.
2. Import the project into [Vercel](https://vercel.com).
3. Add all environment variables listed in `.env.local.example` to Vercel Project Settings.
4. Deploy!
