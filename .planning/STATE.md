# Project State

## Current Phase
Phase 01: Foundation + Push Notifications

## Status
In progress

## Current Position
Phase: 01 of 1 (Foundation + Push Notifications)
Plan: 02 of 5 complete
Last activity: 2026-04-03 - Completed 01-02-PLAN.md (Infrastructure Layers)

Progress (phase 01): ██░░░ 40% (2/5 plans complete)

## Decisions Made
- TypeScript for companion app, JSX stays for landing page
- React 19 + Vite + Tailwind v4 + shadcn/ui
- Capacitor for iOS (Android later)
- Supabase (new project) for auth, db, realtime, edge functions
- APNs directly for push (no Firebase for iOS-only phase)
- react-i18next for i18n (Norwegian default)
- TanStack Query for server state
- Same repo, app/ subdirectory
- Apple Developer Account active (registered on partner)
- Used ignoreDeprecations "6.0" in tsconfig.app.json (TypeScript 5.8+ deprecates baseUrl, TS5101)
- @capacitor/badge does not exist on npm; badge counts via APNs aps.badge payload instead
- shadcn/ui auto-selected base-nova style (Tailwind v4 native) — no manual override needed
- Tailwind v4 CSS-first: no tailwind.config.js, theme via CSS variables in index.css
- Departments table defined before users in schema.sql (FK ordering: users.department_id -> departments.id)
- ON DELETE CASCADE on org-level FKs; ON DELETE SET NULL on department_id in users/leads
- TanStack Query: refetchOnWindowFocus disabled, retry 1 — suits long-lived mobile sessions
- i18n escapeValue: false — React handles XSS, double-escaping breaks JSX interpolation
- schema.sql includes indexes on leads(organization_id, status, created_at DESC) proactively

## Concerns / Watch For
- schema.sql must be executed manually in Supabase dashboard before any auth or realtime features work
- VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in app/.env.local

## Session Continuity
Last session: 2026-04-03T09:29:31Z
Stopped at: Completed 01-02-PLAN.md
Resume file: None
Next plan: .planning/phases/01-foundation-and-push/01-03-PLAN.md
