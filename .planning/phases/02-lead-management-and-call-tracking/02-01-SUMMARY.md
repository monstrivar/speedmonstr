---
phase: 02-lead-management-and-call-tracking
plan: 01
subsystem: database
tags: [supabase, postgresql, rls, typescript, migrations]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: leads table, auth.users, supabase.ts Database type, types/index.ts pattern
provides:
  - call_events table DDL (migration SQL ready to run)
  - RLS policy scoped to organization via leads join
  - Indexes on lead_id, user_id, initiated_at DESC
  - TypeScript types: CallEvent, CallEventInsert, CallOutcome
affects:
  - 02-02 (useCallEvent hook)
  - 02-03 (CallButton component)
  - All Phase 02 plans that write/read call_events

# Tech tracking
tech-stack:
  added: []
  patterns: [migration SQL files in app/supabase/migrations/, manual Supabase dashboard execution pattern]

key-files:
  created:
    - app/supabase/migrations/002-call-events.sql
  modified:
    - app/src/types/supabase.ts
    - app/src/types/index.ts
    - app/tsconfig.json

key-decisions:
  - "call_events.user_id references auth.users (not public.users) — matches push_tokens pattern"
  - "outcome CHECK constraint inline on column, not separate enum type — simpler to extend"
  - "duration_sec measures time user was away from app, NOT actual call duration"

patterns-established:
  - "Migration files live in app/supabase/migrations/ with numeric prefix (001, 002, ...)"
  - "TypeScript types are manually synced to supabase.ts after each migration (no CLI codegen yet)"
  - "Convenience types (CallOutcome = NonNullable<CallEvent['outcome']>) exported from types/index.ts"

# Metrics
duration: 10min
completed: 2026-04-03
---

# Phase 02 Plan 01: call_events Migration + TypeScript Types Summary

**call_events table DDL with org-scoped RLS policy, 3 indexes, and TypeScript types (CallEvent, CallEventInsert, CallOutcome) ready for hook development**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-04-03T00:00:00Z
- **Completed:** 2026-04-03T00:10:00Z
- **Tasks:** 2/3 complete (Task 3 is checkpoint: human-action — awaiting migration run)
- **Files modified:** 4

## Accomplishments
- Migration SQL file created with 9-column call_events table, RLS, and performance indexes
- TypeScript Database type extended with call_events Row/Insert/Update
- CallEvent, CallEventInsert, and CallOutcome exported from types/index.ts
- tsc --noEmit passes with 0 errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Write call_events migration SQL** - `3af896b` (feat)
2. **Task 2: Add call_events types to supabase.ts** - `c3c927a` (feat)
3. **Task 3: Run migration in Supabase dashboard** - pending checkpoint

## Files Created/Modified
- `app/supabase/migrations/002-call-events.sql` - call_events CREATE TABLE, RLS, 3 indexes
- `app/src/types/supabase.ts` - Added call_events Row/Insert/Update to Database type
- `app/src/types/index.ts` - Exported CallEvent, CallEventInsert, CallOutcome
- `app/tsconfig.json` - Added ignoreDeprecations:"6.0" (root tsconfig was missing it, causing tsc --noEmit to fail)

## Decisions Made
- `user_id` references `auth.users` (not `public.users`) to match the push_tokens precedent from Phase 01
- `outcome` uses a CHECK constraint inline rather than a PostgreSQL ENUM type — easier to extend without ALTER TYPE
- `duration_sec` semantics documented in SQL comment: time user was away from the app, not actual call duration

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Root tsconfig.json missing ignoreDeprecations:"6.0"**
- **Found during:** Task 2 (tsc --noEmit verification)
- **Issue:** `tsconfig.app.json` had `ignoreDeprecations:"6.0"` but the root `tsconfig.json` did not. Running `tsc --noEmit` from the project root produced TS5101 error for `baseUrl`.
- **Fix:** Added `"ignoreDeprecations": "6.0"` to root `tsconfig.json` compilerOptions
- **Files modified:** app/tsconfig.json
- **Verification:** `tsc --noEmit` exits with 0 errors
- **Committed in:** c3c927a (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Fix was necessary for tsc --noEmit to pass. No scope creep.

## Issues Encountered
None beyond the tsconfig deviation above.

## User Setup Required
Task 3 is a checkpoint requiring manual action:

1. Open Supabase dashboard for your project
2. Go to SQL Editor → New query
3. Paste the full contents of `app/supabase/migrations/002-call-events.sql`
4. Click Run — verify no errors
5. In Table Editor, confirm `call_events` table exists with 9 columns
6. In Authentication > Policies, confirm "Users manage org call events" policy on call_events
7. Type "migrated" to signal completion

## Next Phase Readiness
- Migration SQL is ready — once Task 3 (human) runs it, the table exists in Supabase
- TypeScript types compile cleanly — 02-02 (useCallEvent hook) can import CallEventInsert without type errors
- No blockers for Phase 02 continuation once migration is applied

---
*Phase: 02-lead-management-and-call-tracking*
*Completed: 2026-04-03*

## Self-Check: PASSED
