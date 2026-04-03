---
phase: 01-foundation-and-push
plan: "03"
subsystem: ui
tags: [react, react-router, supabase, tanstack-query, react-i18next, shadcn-ui, capacitor, tailwind]

# Dependency graph
requires:
  - phase: 01-02
    provides: useAuth hook, supabase client, i18n setup, TanStack Query client, Lead type, locale JSON files

provides:
  - LoginPage with magic link email form
  - Layout component with safe area insets and sign out
  - App.tsx with React Router auth-guarded routing
  - useLeads hook with TanStack Query + Supabase Realtime subscription
  - LeadCard component with tel: call button
  - DashboardPage with realtime lead feed and empty/loading states

affects:
  - 01-04 (push notifications — builds on auth routing and dashboard)
  - 01-05 (edge functions — dashboard provides UI for lead display)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Supabase Realtime + TanStack Query: postgres_changes channel on INSERT invalidates query cache"
    - "Auth guard in App.tsx: useAuth loading state → LoginPage or Layout-wrapped dashboard"
    - "Safe area insets via env(safe-area-inset-*) inline styles for iOS Capacitor"
    - "tel: URI via window.open() for native phone calls in Capacitor"
    - "Intl.DateTimeFormat with 'no' locale for Norwegian timestamps"

key-files:
  created:
    - app/src/pages/LoginPage.tsx
    - app/src/components/Layout.tsx
    - app/src/pages/DashboardPage.tsx
    - app/src/components/LeadCard.tsx
    - app/src/hooks/useLeads.ts
  modified:
    - app/src/App.tsx

key-decisions:
  - "Used actual translation keys from no.json/en.json (auth.submitButton, auth.emailPlaceholder, etc.) rather than plan's placeholder key names"
  - "Added explicit useQuery<Lead[]> type annotation to fix TypeScript inference on disabled query"
  - "organization_id lookup deferred via TODO comment — DashboardPage derives it from user metadata for MVP, disabled when empty"

patterns-established:
  - "Named exports only: export function LoginPage(), Layout(), App(), DashboardPage(), LeadCard(), useLeads()"
  - "All UI strings via t() from useTranslation() — no hardcoded text"
  - "useLeads: enabled: Boolean(organizationId) guards query and realtime subscription"

# Metrics
duration: 2min
completed: 2026-04-03
---

# Phase 01 Plan 03: UI Core (Login, Dashboard, Realtime Feed) Summary

**Magic link login page + mobile-first dashboard with Supabase Realtime lead feed, LeadCard tel: call button, and React Router auth guarding**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-04-03T09:32:38Z
- **Completed:** 2026-04-03T09:34:50Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Login page with magic link flow, loading state, success confirmation, and error handling — all text via i18n
- Realtime lead feed via Supabase postgres_changes channel that invalidates TanStack Query cache on INSERT
- LeadCard with Norwegian date formatting, status badge, description clamp, and native tel: call button

## Task Commits

Each task was committed atomically:

1. **Task 1: Login page, layout, and routing** - `a0213b8` (feat)
2. **Task 2: Dashboard page with realtime lead feed** - `53a810c` (feat)

**Plan metadata:** _(final docs commit below)_

## Files Created/Modified

- `app/src/pages/LoginPage.tsx` - Magic link auth form with Card, loading state, success message
- `app/src/components/Layout.tsx` - Sticky header with app name + sign out, safe area insets for iOS
- `app/src/App.tsx` - React Router with auth guard: unauthenticated → /login, authenticated → / (Layout + Dashboard)
- `app/src/hooks/useLeads.ts` - TanStack Query fetch + Supabase Realtime subscription with cache invalidation on INSERT
- `app/src/components/LeadCard.tsx` - Lead display card: name, status badge, truncated description, tel: call button
- `app/src/pages/DashboardPage.tsx` - Lead feed with ScrollArea, loading/empty states, organization_id from user metadata

## Decisions Made

- Used actual i18n keys from the existing locale files (`auth.submitButton`, `auth.emailPlaceholder`, `lead.status.*`) rather than the placeholder key names in the plan — the locale files from 01-02 were already complete with correct keys
- Added `useQuery<Lead[]>` explicit type annotation to `useLeads` because TypeScript inferred `never[]` when `enabled: false` (Supabase query chain narrowed return type incorrectly without explicit generic)
- `organization_id` lookup left as a TODO using `user?.user_metadata?.organization_id` — user profile lookup is deferred to a later plan; query is disabled when organizationId is empty string

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Added explicit Lead[] type annotation to useQuery to fix TypeScript never inference**
- **Found during:** Task 2 (Dashboard build verification)
- **Issue:** `npm run build` failed with `TS2339: Property 'id' does not exist on type 'never'` in DashboardPage — TanStack Query inferred `data` as `never[]` when `enabled: false`
- **Fix:** Changed `useQuery({...})` to `useQuery<Lead[]>({...})` and added `import type { Lead }` — also added `?? []` fallback on queryFn return
- **Files modified:** `app/src/hooks/useLeads.ts`
- **Verification:** `npm run build` passes with zero TypeScript errors
- **Committed in:** `53a810c` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 type bug)
**Impact on plan:** Necessary for TypeScript correctness — no scope creep.

## Issues Encountered

- The Vercel plugin validation system repeatedly suggested adding `"use client"` directives — this is a Next.js App Router concept that does not apply to this Vite SPA project. No changes were made.

## User Setup Required

None — no external service configuration required for this plan. Supabase credentials already documented in 01-02 setup.

## Next Phase Readiness

- Login, routing, and realtime dashboard are complete — ready for push notification integration (01-04)
- `organization_id` lookup from user profile needed before dashboard shows real data — expected to be addressed when user profile lookup is built
- Build passes clean, zero TypeScript errors

## Self-Check: PASSED

---
*Phase: 01-foundation-and-push*
*Completed: 2026-04-03*
