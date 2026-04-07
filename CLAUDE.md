# Monstr — Speed-to-Lead Platform

## What this project is

Monstr automates instant customer response for Norwegian service businesses (plumbers, electricians, painters, carpenters). When a potential customer submits an inquiry, Monstr sends a personalized SMS response within 30-60 seconds — automatically, with the business name as sender. Businesses that respond within 5 minutes are 21x more likely to close the deal.

**Two products in one repo:**
- **Landing page** (`src/`) — monstr.no, sells the product. React + Vite + JSX. Mostly done.
- **Companion app** (`app/`) — app.monstr.no, IS the product. React + Vite + TypeScript. Under active development.

## Repository structure

```
speedmonstr/
├── CLAUDE.md              ← You are here
├── src/                   ← Landing page (monstr.no) — JSX, do not refactor to TS
├── app/                   ← Companion app (app.monstr.no) — TypeScript
│   ├── src/
│   │   ├── components/    UI components (shadcn/ui in components/ui/)
│   │   ├── pages/         One component per route
│   │   ├── hooks/         Custom React hooks
│   │   ├── lib/           Supabase client, utilities
│   │   ├── locales/       i18n translations (no.json, en.json, se.json, dk.json)
│   │   ├── types/         TypeScript types (incl. Supabase-generated)
│   │   └── assets/        Static files (icons, notification sounds)
│   ├── ios/               Capacitor iOS project
│   └── vite.config.ts
├── api/                   ← Shared Vercel serverless functions
├── docs/                  ← Product and architecture documentation
└── vercel.json            ← Subdomain routing (monstr.no / app.monstr.no)
```

## Tech stack (companion app)

| Layer | Technology | Notes |
|-------|-----------|-------|
| Language | TypeScript (strict) | No `any`. Generated Supabase types. |
| Framework | React 19 + Vite | Same foundation as landing page |
| UI | shadcn/ui + Tailwind CSS v4 | Own the components, Monstr-branded |
| Database | Supabase | Auth, Realtime, Edge Functions, RLS |
| Auth | Supabase Magic Link | No passwords — email link, 30-day sessions |
| Native | Capacitor (iOS first) | Android in phase 2, same codebase |
| Push | APNs (via Supabase Edge Function) | Native iOS push, no Firebase needed yet |
| i18n | react-i18next | Norwegian default, prepared for en/se/dk |
| Charts | Recharts | Lightweight, responsive |
| Server state | TanStack Query | Caching, sync with Supabase |
| Testing | Vitest | Business logic only, not UI snapshots |

## Key conventions

- **English** for all code, variables, comments, commits
- **Norwegian** for UI text (via i18n `t()` keys — never hardcoded strings)
- **Norwegian** for docs in `/docs/`
- Named exports only (no default exports)
- One component per file, PascalCase filenames
- Hooks: `useLeads.ts`, utils: `format-phone.ts`
- No global state manager — React Context + TanStack Query + Supabase Realtime
- See `docs/CONVENTIONS.md` for complete rules

## Build and run

```bash
# Landing page (monstr.no)
npm run dev              # Vite dev server on :5173

# Companion app (app.monstr.no)
cd app && npm run dev    # Vite dev server on :5174

# Capacitor (iOS)
cd app && npx cap sync && npx cap open ios

# Generate Supabase types
npx supabase gen types typescript --project-id <id> > app/src/types/supabase.ts
```

## Architecture decisions

All technical rationale is in `docs/TECH-DECISIONS.md`. Key points:
- TypeScript for companion app, JSX stays for landing page
- Capacitor over React Native (one codebase, web + iOS + Android)
- APNs directly (no Firebase) for iOS-only phase
- shadcn/ui for professional, accessible, customizable components
- Supabase for everything backend (auth, db, realtime, edge functions)

## The companion app in brief

The app's core job: **notify instantly when a lead arrives, make it trivial to call back.**

1. Push notification with customer name + issue
2. Tap "Call" → phone app opens with number
3. Return to app → "Did you follow up?" prompt
4. Everything logged: call tracking, response times, escalations

For full scope: `docs/COMPANION-APP-SCOPE.md`
For database schema: `docs/DASHBOARD-SPEC.md` + `docs/COMPANION-APP-SCOPE.md` (extended tables)
For brand/design: `docs/MERKEVARE-OG-DESIGN.md`

## Current priority

**Push notifications that work on iOS.** This is the core of the product. Everything else is secondary until a business owner's phone goes BING when a lead arrives.

## Business context

- **Pricing:** Graduated cohort model, starting at 2,999 kr/mnd (see `docs/salg/PRISMODELL.md`)
- **Target:** Norwegian SMB service businesses, 1-500 employees
- **Scale path:** Norway → Scandinavia → UK/USA
- **Team:** Ivar + partner, Claude Code as development tool
- **Apple Developer Account:** Active (registered on partner, private)
- **Event deadline:** April 17, 2026 — demo to 30-40 business owners

Full business context: `docs/HVA-ER-MONSTR.md`
Full platform spec: `docs/PLATTFORM-OG-TEKNOLOGI.md`

## Documentation routing

**This file must stay under 200 lines.** When adding new context:

1. Create a dedicated file in `docs/` for the detailed content
2. Add a one-line reference here pointing to that file
3. This CLAUDE.md is the index — docs/ files hold the depth

Current reference files:
| File | Contains |
|------|----------|
| `docs/HVA-ER-MONSTR.md` | Product overview, pricing, value prop, targets |
| `docs/MERKEVARE-OG-DESIGN.md` | Brand identity, colors, typography, design system |
| `docs/PLATTFORM-OG-TEKNOLOGI.md` | System architecture, API endpoints, data model |
| `docs/COMPANION-APP-SCOPE.md` | Full companion app scope, PWA, native, call tracking |
| `docs/TECH-DECISIONS.md` | Technical rationale for all stack choices |
| `docs/CONVENTIONS.md` | Code style, naming, file structure, git workflow |
| `docs/salg/PRISMODELL.md` | Graduated cohort pricing model, annual pricing, implementation |
| `docs/DASHBOARD-SPEC.md` | Database schema, escalation logic, onboarding flow |

**Follow this pattern for all future additions.** If a topic needs more than ~10 lines of detail, it goes in a `docs/` file with a pointer from here.
