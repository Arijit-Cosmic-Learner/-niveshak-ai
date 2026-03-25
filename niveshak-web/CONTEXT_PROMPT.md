# Niveshak.AI — Full Context Prompt for Claude

> **Copy-paste this entire prompt into a new Claude conversation to resume work.**

---

## Project Overview

**Niveshak.AI** is India's first goal-matched investment discovery platform designed for first-time investors. It's a mobile-first Progressive Web App that guides users through an 11-step financial quiz, runs a local recommendation engine (no backend ML), and presents personalised investment plans with AI-generated explanations.

**Tagline:** "Aapke sapno ke liye, sahi nivesh" (The right investment for your dreams)

**Live URL:** https://niveshak-web.vercel.app

---

## Build Plan (9 Steps Total)

| Step | Status | Description |
|------|--------|-------------|
| 1 | ✅ Done | Product design, PRD, folder structure, component tree |
| 2 | ✅ Done | Vite scaffold, all dependencies, path aliases, Tailwind config |
| 3 | ✅ Done | Engine modules, Zustand stores, hooks, data layer, i18n |
| 4 | ✅ Done | All 5 pages, 21 components, full routing |
| 5 | ✅ Done | PWA config, lazy loading, ErrorBoundary, Supabase wiring |
| 6 | ✅ Done | Vercel deploy, Supabase project, env vars, .npmrc fix |
| 7 | ✅ Done | AI Plan Explanation — Edge Function + Gemini 1.5 Flash + AIExplanationCard |
| 8 | ❌ TODO | Vercel Analytics + custom event tracking |
| 9 | ❌ TODO | Custom domain (niveshak.ai) |

**Additionally pending:**
- SQL migration for `partner_leads` table has NOT been run in Supabase SQL Editor yet
- Anthropic Claude Haiku key not set (using free Gemini tier currently)
- Git remote `origin/master` is behind local `master` by ~6 commits (needs `git push`)

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.2.4 |
| Build | Vite | 8.0.1 |
| Language | TypeScript (strict) | 5.9.3 |
| Styling | Tailwind CSS | 3.4.19 |
| State | Zustand (with persist) | 5.0.12 |
| Routing | React Router DOM | 7.13.2 |
| i18n | i18n-js | 4.5.3 |
| Icons | Lucide React | 1.0.1 |
| PWA | vite-plugin-pwa | 1.2.0 |
| Backend | Supabase (Edge Functions + DB) | 2.100.0 |
| AI | Google Gemini 1.5 Flash (free) / Anthropic Claude Haiku (paid, optional) | — |
| Deploy | Vercel | Production |

---

## Design System

- **Background:** `#0D0D0D` (near-black)
- **Accent:** `#AAFF00` (lime green)
- **Cards:** `bg-black-light` with `border-border-dark`
- **Font:** Sora (headings), Inter (body)
- **Mobile-first:** 390px base, responsive up
- **All Hindi text** must be written as `\uXXXX` Unicode escapes in source code

---

## Project Structure

```
d:\raizzed.ai\niveshak-web\
├── .env.local                    # Supabase URL + anon key, app config
├── package.json                  # React 19, Vite 8, Zustand 5, etc.
├── vite.config.ts                # Path aliases, PWA manifest, workbox
├── tsconfig.json                 # Strict mode, path aliases
├── tailwind.config.js            # Custom colors, fonts, spacing
├── .npmrc                        # legacy-peer-deps=true (required for Vercel)
├── vercel.json                   # SPA rewrites
├── index.html                    # Entry point
├── src/
│   ├── main.tsx                  # BrowserRouter + StrictMode + App
│   ├── App.tsx                   # Routes: /, /discover, /results, /partner, *
│   ├── pages/
│   │   ├── LandingPage.tsx       # Hero, personas, how-it-works (resets stores on mount)
│   │   ├── OnboardingPage.tsx    # 11-step quiz flow
│   │   ├── ResultsPage.tsx       # Score ring, corpus, allocations, AI card
│   │   ├── PartnerPage.tsx       # B2B demo request form
│   │   └── NotFoundPage.tsx      # 404
│   ├── components/
│   │   ├── common/               # Button, Badge, Disclaimer, ErrorBoundary, LanguageToggle, LogoMark, ProgressBar
│   │   ├── layout/               # Layout (Outlet wrapper), Navbar, BottomNav
│   │   ├── landing/              # HeroSection, PersonaCard, HowItWorks, PartnerChips
│   │   ├── onboarding/           # QuestionCard, GoalCard, GoalGrid, GoalSlider, InflationProjectionBox, OptionCard, OptionList
│   │   ├── results/              # ScoreRing, CorpusCard, AllocationBar, AllocationCard, InstrumentCard, AIExplanationCard
│   │   └── partner/              # DemoRequestForm, RevenueModelGrid, ValuePropCard
│   ├── engine/
│   │   ├── riskScorer.ts         # 0-100 score from experience + tolerance + timeline + occupation
│   │   ├── inflationProjector.ts # FV = PV × (1+0.06)^n, formatRupee helper
│   │   ├── instrumentMatcher.ts  # Filter→sort→top4 instruments, weighted % allocation
│   │   └── allocationBuilder.ts  # Orchestrates all engines → RecommendationResult
│   ├── store/
│   │   ├── useOnboardingStore.ts # currentStep, answers, isComplete (persisted)
│   │   ├── useResultsStore.ts    # RecommendationResult (persisted)
│   │   └── useLanguageStore.ts   # 'en' | 'hi' toggle (persisted)
│   ├── hooks/
│   │   ├── useOnboarding.ts      # Step navigation, validation, conditional steps
│   │   ├── useRecommendation.ts  # Runs full engine pipeline
│   │   └── useTranslation.ts     # i18n wrapper with t(), isHindi, toggleLanguage()
│   ├── lib/
│   │   ├── anthropic.ts          # buildExplanationPayload() + fetchAIExplanation() → Edge Function
│   │   └── supabase.ts           # Supabase client + submitDemoLead()
│   ├── data/
│   │   ├── instruments.ts        # 10 instruments (SSY, PPF, NSC, NPS, Gold, RD, Debt MF, ELSS, Nifty 50 Index)
│   │   ├── personas.ts           # 3 sample personas (auto-driver, teacher, PM)
│   │   └── steps.ts              # 11 onboarding step definitions with EN/HI
│   ├── types/
│   │   ├── onboarding.ts         # GoalType, TimelineType, OccupationType, etc.
│   │   ├── instruments.ts        # Instrument, InstrumentRecommendation, RecommendationResult
│   │   ├── navigation.ts         # Route type definitions
│   │   └── index.ts              # Re-exports + utility types
│   ├── i18n/
│   │   ├── en.ts                 # English translations
│   │   ├── hi.ts                 # Hindi translations (Unicode escaped)
│   │   └── index.ts              # i18n-js setup
│   └── constants/
│       ├── colors.ts, fonts.ts, radius.ts, spacing.ts
├── supabase/
│   ├── functions/
│   │   └── explain-recommendation/
│   │       └── index.ts          # Deno Edge Function (Gemini/Anthropic dual provider)
│   ├── migrations/
│   │   └── 001_partner_leads.sql # NOT YET RUN in Supabase dashboard
│   └── .temp/                    # Supabase CLI project ref
└── public/
    ├── favicon.svg, icon-192.png, icon-512.png, icon-maskable.png
    └── screenshot-landing.png
```

---

## Infrastructure Details

### Supabase
- **Project:** `biahaugabildprbvummf` (Mumbai region)
- **URL:** `https://biahaugabildprbvummf.supabase.co`
- **Edge Function deployed:** `explain-recommendation`
- **Secrets set:** `GEMINI_API_KEY` (active), `ANTHROPIC_API_KEY` (not yet set)
- **Database:** `partner_leads` table migration written but NOT executed

### Vercel
- **Project:** `niveshak-web`
- **URL:** https://niveshak-web.vercel.app
- **Environment vars:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_APP_ENV=production`
- **Build command:** `npm run build` → `tsc -b && vite build`
- **Output dir:** `dist`

### Environment Variables (.env.local)
```
VITE_SUPABASE_URL=https://biahaugabildprbvummf.supabase.co
VITE_SUPABASE_ANON_KEY=<set>
VITE_ANTHROPIC_API_KEY=<empty>
VITE_APP_ENV=development
VITE_APP_NAME=Niveshak.AI
VITE_INFLATION_RATE=0.06
VITE_DEFAULT_LANG=en
```

---

## Git History (most recent first)

```
a4ff713 fix: reset onboarding + results on landing page mount
5df31ab fix(step7): gemini-1.5-flash-latest model name
f1dc8d3 fix(step7): auto-trigger AI, all user inputs to AI, gemini-1.5-flash
fdc562d feat(step7): dual AI provider - Gemini (free) + Anthropic fallback
2ed4e7c feat(step7): AI explanation card + Supabase Edge Function
a202896 fix(deploy): add .npmrc legacy-peer-deps + engines field for Vercel
18afb82 feat(step-6): add vercel.json SPA config + Supabase migration for partner_leads
27e35ba feat(step-5): PWA config, lazy loading, error boundary, Supabase lead capture
2a58d51 feat(step-4): implement all screens, components, and full routing
84a668c feat(step-3): implement Zustand stores, engine, hooks, and data layer
6e2c66c feat: add niveshak-web — React Vite web app scaffold
5cd2df7 chore: fix expo config and install gesture handler
086d08d chore: initialise Niveshak.AI project structure
```

Note: `origin/master` is at `a202896`. Local `master` is 6 commits ahead. Need `git push`.

---

## Onboarding Flow (11 Steps)

| # | Field | Input Type | Key in Store |
|---|-------|-----------|-------------|
| 0 | Name | text | `answers.name` |
| 1 | State | state_select (31 Indian states) | `answers.state` |
| 2 | Occupation | option_list (8 choices) | `answers.occupation` |
| 3 | Monthly in-hand income | slider ₹2K–₹500K | `answers.inHandIncome` |
| 4 | Monthly surplus | slider ₹500–₹300K | `answers.monthlySurplus` |
| 5 | Financial goal | goal_grid (8 goals) | `answers.goal` |
| 6 | Goal amount | slider ₹50K–₹2Cr (shows inflation) | `answers.goalAmount` |
| 7 | Timeline | option_list (6 choices) | `answers.timeline` |
| 8 | Monthly investment capacity | slider ₹500–₹200K | `answers.monthlyInvestment` |
| 9 | Investment experience | option_list (5 choices) | `answers.experience` |
| 10 | Risk tolerance | option_list (4 choices) | `answers.riskTolerance` |

---

## Recommendation Engine Pipeline

```
answers → riskScorer(experience, riskTolerance, timeline, occupation) → score 0-100
                                                                        → profile: CONSERVATIVE | BALANCED | GROWTH
answers → inflationProjector(goalAmount, timeline) → adjustedCorpus (FV at 6% p.a.)
answers + score + projection → instrumentMatcher → top 4 instruments with % allocation
All above → allocationBuilder → RecommendationResult (stored in useResultsStore)
```

### Risk Scoring Weights (total 100)
- Experience: 0–25 pts
- Risk tolerance: 0–35 pts
- Timeline: 0–25 pts
- Occupation: 0–15 pts

### Risk Profiles
- 0–33: CONSERVATIVE
- 34–66: BALANCED
- 67–100: GROWTH

### Instruments (10 total)
1. Sukanya Samriddhi Yojana (8.2%, gov)
2. PPF (7.1%, gov, 15yr lock-in)
3. NSC (7.7%, gov, 5yr)
4. NPS (9-11%, pension)
5. Digital Gold SIP (8-10%)
6. Recurring Deposit (6.5-7%, zero risk)
7. Debt MF Short Duration (7-8%)
8. ELSS Tax-Saving MF (12-15%, 3yr lock-in)
9. Nifty 50 Index Fund (12-14%)

---

## AI Explanation System

### Architecture
```
ResultsPage mounts → AIExplanationCard auto-triggers on mount
  → buildExplanationPayload(results, answers, language) → all 11 user inputs + instruments
  → POST to Supabase Edge Function: /functions/v1/explain-recommendation
  → Edge Function checks ANTHROPIC_API_KEY (paid, priority), falls back to GEMINI_API_KEY (free)
  → Returns 3-4 sentence personalised advisory
  → AIExplanationCard shows typewriter text reveal
```

### Edge Function: `explain-recommendation`
- **Runtime:** Deno (Supabase Edge Functions)
- **Providers:** Anthropic Claude Haiku → Gemini 1.5 Flash (fallback)
- **Model (Gemini):** `gemini-1.5-flash-latest` via v1beta API
- **Model (Anthropic):** `claude-haiku-4-5-20251001`
- **Max tokens:** 600
- **Prompt:** Structured with full user profile, goal, plan — outputs 3-4 flowing prose sentences

### Current Issue Status
- Gemini 2.0 Flash → **429 quota error** (fixed: switched to 1.5 Flash)
- Gemini 1.5 Flash → **404 model not found** (fixed: changed to `gemini-1.5-flash-latest`)
- Auto-trigger on mount → ✅ working
- Full user profile in prompt → ✅ all 11 inputs sent

---

## What's Left to Do

### Immediate Tasks

#### 1. Push to Remote
```bash
git push origin master
```

#### 2. Run SQL Migration (manual — Supabase Dashboard → SQL Editor)
```sql
CREATE TABLE IF NOT EXISTS public.partner_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_name text NOT NULL,
  contact_name text NOT NULL,
  product_type text NOT NULL,
  phone_email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.partner_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_insert_leads" ON public.partner_leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "auth_select_leads" ON public.partner_leads FOR SELECT TO authenticated USING (true);
```

#### 3. Step 8 — Vercel Analytics
```bash
npm install @vercel/analytics
```
- Add `<Analytics />` component to `src/main.tsx` inside StrictMode
- Add custom `track()` events to:
  - `useOnboarding.ts` — track each step completion
  - `useLanguageStore.ts` — track language toggle
  - `DemoRequestForm.tsx` — track successful demo submissions
  - `ResultsPage.tsx` — track results page view with risk profile

#### 4. Step 9 — Custom Domain
- Vercel Dashboard → niveshak-web project → Settings → Domains → Add `niveshak.ai`
- At DNS registrar: Add CNAME record pointing to `cname.vercel-dns.com`

### Future Enhancements (not in original 9-step plan)
- Switch to Anthropic Claude Haiku when budget allows (just set `ANTHROPIC_API_KEY` in Supabase secrets — Edge Function auto-switches, no code changes)
- Admin dashboard for viewing `partner_leads`
- User session tracking / returning user experience
- Share results as image/PDF
- WhatsApp integration

---

## Critical Build Rules

1. **Hindi text:** Always use `\uXXXX` Unicode escapes in source files, never raw Devanagari
2. **File writes:** Use `[System.IO.File]::WriteAllText(path, content, [System.Text.UTF8Encoding]::new($false))` on Windows PowerShell for any file with Unicode
3. **Vite manualChunks:** Must be a function, not an object (Vite 8 requirement)
4. **.npmrc:** `legacy-peer-deps=true` is required or Vercel builds fail
5. **TypeScript:** Always run `npx tsc --noEmit` before committing
6. **Deploy flow:** `npx tsc --noEmit` → `git add -A && git commit` → `vercel --prod`
7. **Edge Function deploy:** `cd niveshak-web && npx supabase functions deploy explain-recommendation`
8. **Background terminals** in this workspace always start at `D:\raizzed.ai` (workspace root), not `niveshak-web`
9. **Working directory** for all commands: `d:\raizzed.ai\niveshak-web`

---

## Quick Start for New Session

```bash
cd d:\raizzed.ai\niveshak-web
npm run dev          # Start dev server on localhost:3000
npx tsc --noEmit     # Type-check
npm run build        # Production build (tsc + vite)
vercel --prod        # Deploy to production
npx supabase functions deploy explain-recommendation  # Deploy Edge Function
```

---

*Last updated: March 25, 2026 — after Step 7 completion + bug fixes (commit a4ff713)*
