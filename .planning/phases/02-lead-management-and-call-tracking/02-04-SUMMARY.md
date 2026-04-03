---
phase: 02-lead-management-and-call-tracking
plan: 04
subsystem: ui
tags: [react, tanstack-query, supabase, i18n, typescript, shadcn]

# Dependency graph
requires:
  - phase: 02-03
    provides: LeadDetailSheet, FollowUpPrompt, useCallTracking, useLeadMutations

provides:
  - LeadCard wired to LeadDetailSheet via onPress → selectedLead state
  - useResponseTime hook computing avg minutes from call_events joined with leads (30-day window)
  - Response time stat card on dashboard (hidden when no data)
  - Phase 02 full feature loop complete: tap lead → sheet → call → follow-up → status update

affects:
  - phase-03 (any dashboard analytics work)
  - supabase types (Relationships fields now present, required for postgrest-js composite builds)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Controlled sheet pattern: selectedLead state in DashboardPage, LeadDetailSheet mounted at page root (not inside ScrollArea)"
    - "buttonVariants on native <a> element instead of Button asChild (base-nova Button has no asChild)"
    - "Supabase Database type requires Relationships arrays on each table for tsc -b composite mode"

key-files:
  created:
    - app/src/hooks/useResponseTime.ts
  modified:
    - app/src/components/LeadCard.tsx
    - app/src/pages/DashboardPage.tsx
    - app/src/components/LeadDetailSheet.tsx
    - app/src/types/supabase.ts
    - app/src/locales/no.json
    - app/src/locales/en.json

key-decisions:
  - "LeadDetailSheet mounted outside ScrollArea at DashboardPage root — keeps it always in DOM so pendingCall state in useCallTracking persists across open/close cycles"
  - "buttonVariants({ size: 'lg' }) on <a href=tel:> instead of Button asChild — base-nova (base-ui/react) Button does not support asChild prop"
  - "Supabase Database type must include Relationships arrays on each table — postgrest-js GenericTable requires it; tsc --noEmit was lenient but tsc -b (composite) infers never without it"
  - "Stat card hidden (not 0 min) when no call_events yet — no misleading zero shown to new users"

patterns-established:
  - "All Supabase table types must include Relationships arrays matching actual FK schema"
  - "Native <a> elements styled with buttonVariants() + cn() instead of asChild where link semantics needed"

# Metrics
duration: 65min
completed: 2026-04-03
---

# Phase 02 Plan 04: Wire LeadDetailSheet + Response Time Stat Summary

**Full Phase 02 lead management loop complete: tap card opens bottom sheet, call button logs event, follow-up prompt records outcome, avg response time stat card on dashboard**

## Performance

- **Duration:** 65 min
- **Started:** 2026-04-03T19:12:13Z
- **Completed:** 2026-04-03T20:17:13Z
- **Tasks:** 2 (+ checkpoint pending user verification)
- **Files modified:** 6

## Accomplishments

- LeadCard now fires `onPress` callback; entire card is a button (call button removed — moved to sheet)
- DashboardPage manages `selectedLead` state and renders LeadDetailSheet outside ScrollArea
- `useResponseTime` hook queries call_events joined with leads, computes avg minutes over 30 days
- Stat card renders only when data is non-null; hidden for users with no call history yet
- Fixed two pre-existing type bugs that caused `npm run build` (tsc -b) to fail

## Task Commits

Each task was committed atomically:

1. **Task 1: Wire LeadCard → LeadDetailSheet in DashboardPage** - `2ca2e13` (feat)
2. **Task 2: Response time stat hook + stat card in dashboard** - `3f4fbc5` (feat)

**Plan metadata:** pending (after checkpoint approval)

## Files Created/Modified

- `app/src/hooks/useResponseTime.ts` - TanStack Query hook; call_events joined with leads, 30-day avg in minutes
- `app/src/components/LeadCard.tsx` - Added onPress prop; card is now a button element; removed inline call button
- `app/src/pages/DashboardPage.tsx` - selectedLead state; LeadDetailSheet at root; useResponseTime + stat card
- `app/src/components/LeadDetailSheet.tsx` - Fixed: replaced Button asChild with buttonVariants on native `<a>`
- `app/src/types/supabase.ts` - Fixed: added Relationships arrays to all six tables
- `app/src/locales/no.json` - Added dashboard.avgResponseTime and dashboard.minutes
- `app/src/locales/en.json` - Added dashboard.avgResponseTime and dashboard.minutes

## Decisions Made

- LeadDetailSheet always mounted (controlled open prop), not conditionally rendered — preserves useCallTracking state across open/close
- Stat card shows nothing (not 0) when no call events — avoids misleading "0 min" for users who haven't called anyone yet
- `buttonVariants` applied directly to `<a>` element — base-nova Button (base-ui/react) doesn't support Radix-style asChild prop

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Supabase Database type missing Relationships arrays**
- **Found during:** Task 2 build verification
- **Issue:** postgrest-js `GenericTable` type requires a `Relationships` field on every table. `tsc --noEmit` was lenient (non-composite mode), but `tsc -b` (composite build used by `npm run build`) inferred `never` for all table row/insert types, breaking useLeadMutations and useResponseTime
- **Fix:** Added `Relationships` arrays with correct FK metadata to all six tables in `supabase.ts`
- **Files modified:** `app/src/types/supabase.ts`
- **Verification:** `npm run build` passes with zero type errors
- **Committed in:** `3f4fbc5` (Task 2 commit)

**2. [Rule 1 - Bug] Button asChild not supported by base-nova Button component**
- **Found during:** Task 2 build verification
- **Issue:** `LeadDetailSheet` used `<Button asChild>` pattern (Radix-style) but this project uses base-nova (base-ui/react) Button which has no `asChild` prop — TypeScript error TS2322
- **Fix:** Replaced with native `<a>` element using `cn(buttonVariants({ size: "lg" }), ...)` for identical visual output
- **Files modified:** `app/src/components/LeadDetailSheet.tsx`
- **Verification:** `npm run build` passes, ring button renders identically
- **Committed in:** `3f4fbc5` (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (2 Rule 1 bugs)
**Impact on plan:** Both fixes required for build to pass. No scope creep — changes confined to making existing code type-correct.

## Issues Encountered

- `tsc --noEmit` (non-composite) reported clean but `tsc -b` (composite, used by `npm run build`) failed with `never` inference — the two modes have different strictness on generic resolution for Supabase table types. The `Relationships` field is the missing link.

## User Setup Required

None — no new external services or environment variables required by this plan.

## Next Phase Readiness

- Phase 02 fully complete: full lead management + call tracking + analytics loop is live
- All pieces wired: push notification → lead card → detail sheet → call → follow-up prompt → status update → response time stat
- Ready to move to Phase 03 (if planned)
- One concern: schema.sql must be executed in Supabase before call_events data can populate the stat card — this was noted in STATE.md from earlier phases

---
*Phase: 02-lead-management-and-call-tracking*
*Completed: 2026-04-03*

## Self-Check: PASSED
