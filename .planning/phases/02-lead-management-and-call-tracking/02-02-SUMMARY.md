---
phase: 02-lead-management-and-call-tracking
plan: "02"
subsystem: hooks
tags: [react, tanstack-query, capacitor, supabase, typescript, call-tracking]

requires:
  - phase: 02-01
    provides: call_events schema in Supabase, CallEventInsert/CallOutcome types in @/types

provides:
  - useUpdateLeadStatus: TanStack Query mutation that updates lead status and invalidates leads query
  - useCallEventMutation: TanStack Query mutation that inserts call_events rows
  - useAppResume: Capacitor App.addListener wrapper with ref-based callback and cleanup
  - useCallTracking: composed hook encapsulating full call lifecycle (press -> log -> resume -> follow-up)

affects:
  - 02-03 (LeadDetailSheet consumes useCallTracking and useUpdateLeadStatus)
  - 02-04 (FollowUpPrompt consumes showFollowUp and handleFollowUpOutcome from useCallTracking)

tech-stack:
  added: []
  patterns:
    - "pendingCallRef pattern: sync useRef to state on every render so Capacitor listeners avoid stale closures"
    - "TanStack Query invalidateQueries on mutation onSuccess for real-time UI refresh"
    - "Capacitor listener cleanup: void listenerPromise.then(handle => handle.remove()) in useEffect return"

key-files:
  created:
    - app/src/hooks/useLeadMutations.ts
    - app/src/hooks/useAppResume.ts
    - app/src/hooks/useCallTracking.ts
  modified: []

key-decisions:
  - "pendingCallRef synced to pendingCall state on every render — listener reads ref, not state, to avoid stale closure without re-registering"
  - "handleCallPress logs fire-and-forget (no await) — tel: link on anchor element handles actual call initiation"
  - "outcome: null stored in call_events when user selects 'cancelled' — preserves event row while indicating no outcome"

patterns-established:
  - "pendingCallRef pattern: const ref = useRef(state); ref.current = state — use ref inside async callbacks"
  - "Capacitor listener cleanup: return () => { void listenerPromise.then(h => h.remove()) }"
  - "useAppResume onResumeRef: keeps callback current without empty-deps violation"

duration: 2min
completed: 2026-04-03
---

# Phase 02 Plan 02: useLeadMutations + useAppResume + useCallTracking Summary

**Three business-logic hooks for call tracking: Supabase mutations for lead status and call events, a Capacitor app-resume detector with stale-closure-safe ref pattern, and a composed lifecycle hook tying call press, resume detection, and follow-up state together.**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-04-03T18:13:52Z
- **Completed:** 2026-04-03T18:15:22Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- useUpdateLeadStatus and useCallEventMutation written with full TanStack Query useMutation patterns, no `any` types
- useAppResume wraps Capacitor App.addListener with a useRef-based callback so the listener never needs re-registration
- useCallTracking composes the full call lifecycle: press logs initiated_at, app resume triggers follow-up prompt, outcome records returned_at + duration_sec

## Task Commits

1. **Task 1: useLeadMutations** - `e522c8a` (feat)
2. **Task 2: useAppResume + useCallTracking** - `f767580` (feat)

## Files Created/Modified

- `app/src/hooks/useLeadMutations.ts` - useUpdateLeadStatus (status mutation + query invalidation) and useCallEventMutation (insert call_events)
- `app/src/hooks/useAppResume.ts` - Capacitor appStateChange listener with onResumeRef and cleanup
- `app/src/hooks/useCallTracking.ts` - Composed hook: handleCallPress, showFollowUp state, handleFollowUpOutcome with pendingCallRef

## Decisions Made

- pendingCallRef is synced to pendingCall state on every render (`pendingCallRef.current = pendingCall`) so the appStateChange listener always reads fresh state without re-registration. This is the canonical pattern for Capacitor listeners in React.
- outcome is stored as `null` (not omitted) when user selects "cancelled" — the call_events row is still written so the event is recorded.
- Fire-and-forget logCallEvent in handleCallPress — caller's anchor `href="tel:..."` handles the OS-level call; no await needed here.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All three hooks are ready for consumption by LeadDetailSheet (02-03) and FollowUpPrompt (02-04)
- `npx tsc --noEmit` passes with zero errors
- No blockers

---
*Phase: 02-lead-management-and-call-tracking*
*Completed: 2026-04-03*
