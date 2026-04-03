# Project State

## Current Phase
Phase 02: Lead Management and Call Tracking

## Status
Phase 02 in progress — awaiting checkpoint (Task 3: run migration in Supabase dashboard)

## Current Position
Phase: 02 of 2 (Lead Management and Call Tracking)
Plan: 01 of N — Tasks 1-2 complete, paused at checkpoint Task 3
Last activity: 2026-04-03 - Completed 02-01 Tasks 1-2; paused at Task 3 checkpoint

Progress (phase 01): █████ 100% (all 5 plans complete)
Progress (phase 02): ░░░░░ in progress (02-01 tasks 1-2 done, migration checkpoint pending)

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
- useQuery<Lead[]> explicit type annotation required — Supabase chain infers never[] when query disabled (enabled: false)
- organization_id for DashboardPage derived from user_metadata for MVP; full user profile lookup deferred to later plan
- Supabase Realtime + TanStack Query pattern: postgres_changes INSERT channel calls invalidateQueries on same queryKey
- push_tokens upsert uses onConflict: user_id,platform — one token per user per platform, idempotent on every launch
- APNs JWT signed with Web Crypto (Deno ECDSA ES256, IEEE P1363 format) — no DER conversion needed unlike Node.js
- Edge Function defaults APNS_ENVIRONMENT to sandbox for safety — must explicitly set production
- apns-topic set to no.monstr.app — must match iOS app bundle ID exactly
- supabase.from('push_tokens') cast to any pending schema execution — types regenerate after schema.sql is applied
- @capacitor/ios was missing from package.json; installed as Rule 3 blocking fix in 01-05
- Capacitor 8 SPM: open app/ios/App/App.xcodeproj in Xcode (no standalone App.xcworkspace with SPM)
- usePushNotifications placed in Layout.tsx (not DashboardPage) — fires once per session on all routes
- supabase.ts exports supabaseConfigured boolean — consumers guard Supabase calls behind this flag during local dev without .env.local
- call_events.user_id references auth.users (not public.users) — matches push_tokens pattern
- call_events outcome uses CHECK constraint inline, not PostgreSQL ENUM — easier to extend
- duration_sec on call_events measures time user was away from app, NOT actual call duration
- Root tsconfig.json requires ignoreDeprecations:"6.0" (same as tsconfig.app.json) — both needed for clean tsc --noEmit

## Concerns / Watch For
- schema.sql must be executed manually in Supabase dashboard before any auth or realtime features work
- VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in app/.env.local
- APNs env vars (APNS_TEAM_ID, APNS_KEY_ID, APNS_PRIVATE_KEY, APNS_ENVIRONMENT) must be set in Supabase Edge Function settings before push works
- Supabase webhook must be created manually: Database → Webhooks → INSERT on leads → push-notification function URL
- Capacitor 8 iOS project uses SPM: open App.xcodeproj (not App.xcworkspace) in Xcode
- Push notifications require physical iPhone (Simulator cannot receive APNs)
- Xcode: must manually add Push Notifications + Background Modes capabilities, and select development team

## Session Continuity
Last session: 2026-04-03T00:10:00Z
Stopped at: 02-01 Task 3 checkpoint — user must run migration SQL in Supabase dashboard
Resume file: None — resume after user types "migrated"
Next plan: Continue 02-01 Task 3 (verify migration ran), then proceed to 02-02
