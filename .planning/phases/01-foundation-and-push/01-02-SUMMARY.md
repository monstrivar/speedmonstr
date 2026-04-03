---
phase: 01-foundation-and-push
plan: 02
subsystem: auth, database, i18n
tags: [supabase, tanstack-query, i18next, typescript, rls, postgres, react]

# Dependency graph
requires:
  - phase: 01-01-foundation-scaffold
    provides: Vite + React + TypeScript app scaffold in app/ with shadcn/ui

provides:
  - Typed Supabase client (supabase) exported from app/src/lib/supabase.ts
  - TanStack Query client (queryClient) exported from app/src/lib/query-client.ts
  - i18n configured with Norwegian default and English skeleton
  - Norwegian + English locale JSON files covering auth/dashboard/leads/push
  - Full Database TypeScript types for 5 tables with Row/Insert/Update
  - App-level type aliases: Lead, Organization, AppUser, Department, PushToken
  - useAuth hook with user state, signIn (magic link OTP), signOut
  - schema.sql with 5 tables, RLS on all tables, realtime for leads, indexes
  - main.tsx wired with BrowserRouter + QueryClientProvider + i18n side-effect

affects:
  - 01-03 (dashboard UI — needs useAuth, Lead type, i18n strings)
  - 01-04 (push notifications — needs useAuth user, PushToken type, supabase client)
  - 01-05 (edge functions — needs schema.sql as reference for table structure)

# Tech tracking
tech-stack:
  added:
    - "@supabase/supabase-js ^2.x — Supabase client"
    - "@tanstack/react-query ^5.x — TanStack Query client"
    - "i18next + react-i18next — i18n with Norwegian default"
    - "react-router-dom ^7.x — BrowserRouter added to main.tsx"
  patterns:
    - "Named exports only (no default exports in lib/hooks/types)"
    - "Typed Supabase client via Database generic for end-to-end type safety"
    - "i18n side-effect import in main.tsx before any component renders"
    - "TanStack Query wraps entire App at root"
    - "All UI strings via t() from locale JSON — no hardcoded text"

key-files:
  created:
    - app/.env.example
    - app/src/lib/supabase.ts
    - app/src/lib/query-client.ts
    - app/src/lib/i18n.ts
    - app/src/locales/no.json
    - app/src/locales/en.json
    - app/src/types/supabase.ts
    - app/src/types/index.ts
    - app/src/hooks/useAuth.ts
    - app/supabase/schema.sql
  modified:
    - app/src/main.tsx

key-decisions:
  - "Departments table created before users in schema.sql to satisfy FK constraint (users.department_id -> departments.id)"
  - "ON DELETE CASCADE on org-level FKs so deleting an org cleans up all child records"
  - "ON DELETE SET NULL on department_id in users/leads so department deletion doesn't cascade to users/leads"
  - "TanStack Query: refetchOnWindowFocus disabled, retry: 1 — suits mobile app patterns"
  - "i18n escapeValue: false — React handles XSS, double-escaping breaks JSX interpolation"
  - "Indexes added on leads(organization_id), leads(status), leads(created_at DESC), users(organization_id), push_tokens(user_id)"

patterns-established:
  - "lib/ files: named exports only, no default exports"
  - "hooks/ files: named function exports (export function useAuth)"
  - "types/ files: derived from Database type via table Row aliases"
  - "All locale strings in no.json/en.json — no hardcoded Norwegian text in components"

# Metrics
duration: 2min
completed: 2026-04-03
---

# Phase 01 Plan 02: Infrastructure Layers Summary

**Typed Supabase client + useAuth magic-link hook + i18next Norwegian i18n + TanStack Query provider + 5-table Postgres schema with RLS ready for Supabase dashboard**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-04-03T09:27:13Z
- **Completed:** 2026-04-03T09:29:31Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments

- Full TypeScript type coverage for 5 Supabase tables (Row/Insert/Update for organizations, departments, users, leads, push_tokens)
- Auth hook with magic link OTP flow, session hydration on mount, and onAuthStateChange subscription with proper cleanup
- i18n wired with Norwegian default covering all Phase 01 UI surface area (auth, dashboard, lead status/actions, push prompts)
- TanStack Query client with mobile-appropriate defaults (30s staleTime, 5min gcTime, no refetch-on-focus)
- Production-ready schema.sql: correct FK ordering, cascade rules, 5 RLS policies, realtime for leads, 5 performance indexes

## Task Commits

Each task was committed atomically:

1. **Task 1: Supabase client, TanStack Query, i18n, and types** - `a6c2512` (feat)
2. **Task 2: Auth hook and database schema SQL** - `23664d1` (feat)

**Plan metadata:** (committed with this summary)

## Files Created/Modified

- `app/.env.example` - Environment variable template with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- `app/src/lib/supabase.ts` - Typed Supabase client using Database generic
- `app/src/lib/query-client.ts` - TanStack Query client with 30s staleTime, 5min gcTime
- `app/src/lib/i18n.ts` - i18next configured with Norwegian default, English fallback
- `app/src/locales/no.json` - Norwegian strings: auth, dashboard, lead, navigation, push
- `app/src/locales/en.json` - English strings (skeleton, matches no.json structure)
- `app/src/types/supabase.ts` - Database type with Row/Insert/Update for all 5 tables
- `app/src/types/index.ts` - App-level type aliases derived from Database type
- `app/src/hooks/useAuth.ts` - useAuth: user, loading, signIn (OTP), signOut
- `app/supabase/schema.sql` - Complete Phase 01 schema: 5 tables, RLS, realtime, indexes
- `app/src/main.tsx` - Updated: BrowserRouter + QueryClientProvider + i18n side-effect import

## Decisions Made

- Departments table defined before users in schema.sql to satisfy the forward FK reference (users.department_id references departments.id)
- ON DELETE CASCADE on org-level foreign keys; ON DELETE SET NULL on department_id in users/leads — department deletion should not cascade to users or leads
- TanStack Query: `refetchOnWindowFocus: false` and `retry: 1` — mobile app sessions are long-lived, aggressive refetching hurts UX
- i18n `escapeValue: false` — React handles XSS, double-escaping breaks string interpolation in JSX
- Performance indexes added proactively: leads are filtered by org, status, and sorted by created_at DESC in every query

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

Before any feature can connect to Supabase:

1. Create a Supabase project at https://supabase.com
2. Copy URL and anon key from Project Settings > API
3. Create `app/.env.local` from `app/.env.example` and fill in the values
4. Run `app/supabase/schema.sql` in the Supabase dashboard SQL editor (Settings > SQL Editor)

## Next Phase Readiness

- Auth, data layer, i18n, and types are all wired — Plan 03 (dashboard UI) can import `useAuth`, `Lead`, `supabase`, and `t()` directly
- `schema.sql` must be executed in Supabase dashboard before realtime or auth features work end-to-end
- No blockers for Plan 03 development (mocked data works without Supabase credentials)

---
*Phase: 01-foundation-and-push*
*Completed: 2026-04-03*

## Self-Check: PASSED
