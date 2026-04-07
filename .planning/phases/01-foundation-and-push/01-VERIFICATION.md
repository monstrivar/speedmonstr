---
phase: 01-foundation-and-push
verified: 2026-04-03T14:10:01Z
status: gaps_found
score: 12/14 must-haves verified
gaps:
  - truth: "Capacitor iOS project exists and builds in Xcode"
    status: failed
    reason: "CocoaPods workspace (app/ios/App/App.xcworkspace) is absent — npx cap add ios ran but pod install was not run, so the project cannot open or build in Xcode"
    artifacts:
      - path: "app/ios/App/App.xcworkspace"
        issue: "File does not exist. Only app/ios/App/App.xcodeproj/project.xcworkspace (inner Xcode-managed workspace) is present, not the CocoaPods top-level workspace needed for Capacitor builds."
    missing:
      - "Run `cd app/ios/App && pod install` to generate App.xcworkspace"
      - "Or run `npx cap sync ios` from app/ after CocoaPods is installed"
  - truth: "Push notification shows lead name and description in Norwegian"
    status: partial
    reason: "Edge Function constructs lead name as `lead.name` (line 213) but the schema has no `name` column — leads have `first_name` and `last_name`. The notification title will always fall back to 'New lead' instead of the actual person's name."
    artifacts:
      - path: "app/supabase/functions/push-notification/index.ts"
        issue: "Line 213: `const leadName = (lead.name as string) ?? 'New lead'` — should be `[lead.first_name, lead.last_name].filter(Boolean).join(' ')` to match the actual schema columns."
    missing:
      - "Fix line 213 to concatenate first_name + last_name from the webhook record"
---

# Phase 01: Foundation and Push — Verification Report

**Phase Goal:** A business owner's phone goes BING when a lead arrives.
**Verified:** 2026-04-03T14:10:01Z
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| #  | Truth                                                                      | Status       | Evidence                                                                          |
|----|---------------------------------------------------------------------------|--------------|-----------------------------------------------------------------------------------|
| 1  | app/ directory exists as standalone Vite+React+TS project                  | VERIFIED     | app/package.json (name: monstr-app), vite.config.ts, tsconfig.json all present    |
| 2  | npm run build in app/ produces dist/ with no errors                        | VERIFIED     | Build ran: 1972 modules, exit 0, dist/index.html + assets produced                |
| 3  | shadcn/ui components available (button, card, badge, input, etc.)          | VERIFIED     | app/src/components/ui/ has button, card, badge, separator, scroll-area, input     |
| 4  | Capacitor config is present and valid                                      | VERIFIED     | app/capacitor.config.ts: appId "no.monstr.app", webDir "dist", PushNotifications plugin configured |
| 5  | Supabase client connects with env vars                                     | VERIFIED     | app/src/lib/supabase.ts: createClient<Database> reading VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY |
| 6  | Auth hook provides user state and signIn/signOut                           | VERIFIED     | app/src/hooks/useAuth.ts: getSession + onAuthStateChange, signInWithOtp, signOut  |
| 7  | TanStack Query client configured and provided                              | VERIFIED     | query-client.ts exported, main.tsx wraps App in QueryClientProvider               |
| 8  | i18n initialized with Norwegian as default language                        | VERIFIED     | app/src/lib/i18n.ts: lng "no", fallbackLng "no", imported as side-effect in main.tsx |
| 9  | All UI strings through i18n t() function                                   | VERIFIED     | All TSX files use useTranslation(); LoginPage, DashboardPage, LeadCard, Layout, App all use t() |
| 10 | Database schema SQL ready with 5 tables + RLS                              | VERIFIED     | schema.sql: 5 CREATE TABLE, 5 ENABLE ROW LEVEL SECURITY, ALTER PUBLICATION for realtime |
| 11 | Dashboard with realtime lead feed (useLeads + Supabase channel)            | VERIFIED     | useLeads.ts: supabase.channel("leads-realtime") postgres_changes INSERT, invalidateQueries on event |
| 12 | Push notification hook registers and stores APNs token in Supabase         | VERIFIED     | usePushNotifications.ts: PushNotifications.register(), upserts to push_tokens table |
| 13 | Capacitor iOS project exists and builds in Xcode                           | FAILED       | App.xcodeproj exists but App.xcworkspace (CocoaPods workspace) is absent — pod install not run |
| 14 | Push notification shows lead name in Norwegian                             | PARTIAL      | Edge Function uses `lead.name` (line 213) but schema has first_name + last_name; name will always be undefined |

**Score:** 12/14 truths verified

---

### Required Artifacts

| Artifact                                              | Status    | Details                                                                          |
|------------------------------------------------------|-----------|----------------------------------------------------------------------------------|
| `app/package.json`                                   | VERIFIED  | All deps present: react 19, supabase-js, tanstack/react-query, capacitor, i18next |
| `app/vite.config.ts`                                 | VERIFIED  | react() + tailwindcss() plugins, @ alias, port 5174                              |
| `app/capacitor.config.ts`                            | VERIFIED  | appId no.monstr.app, PushNotifications + SplashScreen plugins                    |
| `app/src/main.tsx`                                   | VERIFIED  | BrowserRouter + QueryClientProvider + i18n side-effect import, named App import  |
| `app/src/lib/supabase.ts`                            | VERIFIED  | Named export `supabase` + `supabaseConfigured`, typed with Database               |
| `app/src/lib/query-client.ts`                        | VERIFIED  | Named export `queryClient`, staleTime 30s, gcTime 5min                           |
| `app/src/lib/i18n.ts`                                | VERIFIED  | Named export `i18n`, lng "no", resources no+en                                   |
| `app/src/hooks/useAuth.ts`                           | VERIFIED  | Named export `useAuth`, full signIn/signOut/loading/user                         |
| `app/src/hooks/useLeads.ts`                          | VERIFIED  | Named export `useLeads`, Supabase query + realtime channel + invalidateQueries    |
| `app/src/hooks/usePushNotifications.ts`              | VERIFIED  | Named export `usePushNotifications`, register + upsert to push_tokens            |
| `app/src/types/index.ts`                             | VERIFIED  | Named exports Lead, Organization, AppUser, PushToken, Department                 |
| `app/src/types/supabase.ts`                          | VERIFIED  | Full Database type with Row/Insert/Update for all 5 tables                       |
| `app/src/pages/LoginPage.tsx`                        | VERIFIED  | 73 lines, named export, useTranslation, signIn called on submit, success state    |
| `app/src/pages/DashboardPage.tsx`                    | VERIFIED  | 46 lines, named export, useLeads wired, LeadCard rendered, i18n throughout        |
| `app/src/components/Layout.tsx`                      | VERIFIED  | Named export, usePushNotifications(user.id) called, iOS safe-area insets applied  |
| `app/src/components/LeadCard.tsx`                    | VERIFIED  | Named export, tel: link, Badge with t() status, Intl.DateTimeFormat "no"         |
| `app/src/locales/no.json`                            | VERIFIED  | Covers auth, dashboard, lead (incl. all statuses), common, navigation, push keys  |
| `app/supabase/schema.sql`                            | VERIFIED  | 5 tables, 5 RLS blocks, ALTER PUBLICATION for realtime, pg_net extension          |
| `app/supabase/functions/push-notification/index.ts`  | PARTIAL   | APNs JWT signing, correct endpoint, correct bundle ID — but lead name extraction uses wrong field |
| `app/ios/` (Capacitor iOS project)                   | PARTIAL   | App.xcodeproj + AppDelegate.swift + Info.plist present; App.xcworkspace missing (CocoaPods not run) |
| `app/.gitignore`                                     | VERIFIED  | node_modules, dist, .env, ios/App/Pods/ and build artifacts all excluded          |

---

### Key Link Verification

| From                                  | To                                  | Via                              | Status   | Details                                                      |
|--------------------------------------|-------------------------------------|----------------------------------|----------|--------------------------------------------------------------|
| app/src/main.tsx                     | app/src/lib/i18n.ts                 | import "@/lib/i18n" side-effect  | WIRED    | Line 5 of main.tsx                                           |
| app/src/main.tsx                     | app/src/lib/query-client.ts         | QueryClientProvider wrapping App | WIRED    | Lines 4+6 of main.tsx                                        |
| app/src/hooks/useAuth.ts             | app/src/lib/supabase.ts             | import { supabase }              | WIRED    | Line 3 of useAuth.ts                                         |
| app/src/hooks/useLeads.ts            | app/src/lib/supabase.ts             | supabase.from('leads').select()  | WIRED    | Lines 11-18 and channel on line 27                           |
| app/src/hooks/useLeads.ts            | supabase Realtime channel           | supabase.channel + postgres_changes | WIRED | Lines 27-46, cleanup via supabase.removeChannel              |
| app/src/hooks/usePushNotifications.ts| app/src/lib/supabase.ts             | supabase.from('push_tokens').upsert | WIRED | Lines 34-50 (with any cast due to missing types)             |
| app/src/components/Layout.tsx        | app/src/hooks/usePushNotifications.ts | usePushNotifications(user.id)  | WIRED    | Line 15 of Layout.tsx                                        |
| app/src/pages/DashboardPage.tsx      | app/src/hooks/useLeads.ts           | useLeads(organizationId)         | WIRED    | Line 18 of DashboardPage.tsx                                 |
| app/src/App.tsx                      | app/src/hooks/useAuth.ts            | useAuth() for route protection   | WIRED    | Line 10 of App.tsx                                           |
| app/supabase/functions/push-notification/index.ts | APNs API           | fetch to api.sandbox.push.apple.com | WIRED | Lines 241-252, JWT signing with Web Crypto ES256             |
| app/supabase/functions/push-notification/index.ts | push_tokens table  | supabase.from('push_tokens').select | WIRED | Lines 168-173, two-step org → users → tokens query           |
| app/capacitor.config.ts              | app/ios/                            | npx cap sync ios                 | PARTIAL  | Config exists and iOS project has native files, but CocoaPods workspace missing |

---

### Anti-Patterns Found

| File                                             | Line | Pattern                            | Severity | Impact                                                    |
|-------------------------------------------------|------|------------------------------------|----------|-----------------------------------------------------------|
| app/supabase/functions/push-notification/index.ts | 213  | `lead.name` — non-existent column  | BLOCKER  | Push notification title always shows "New lead" instead of the lead's actual name |
| app/src/hooks/usePushNotifications.ts            | 34   | `as any` cast on supabase.from()    | WARNING  | Bypasses TypeScript; functional but loses type safety on push_tokens upsert |
| app/src/pages/DashboardPage.tsx                  | 12   | TODO comment on organization_id     | INFO     | Expected for Phase 01 — will be resolved in Phase 02 profile lookup |

---

### Human Verification Required

#### 1. iOS Xcode Build

**Test:** Run `cd app/ios/App && pod install`, then open `App.xcworkspace` in Xcode, select a development team, build for Simulator (Cmd+B).
**Expected:** Build succeeds. App shows login page in iOS Simulator.
**Why human:** Requires Xcode + CocoaPods installed; cannot verify pod install success programmatically in this environment.

#### 2. Push Notification End-to-End

**Test:** With a real Supabase project configured, a real APNs .p8 key, and the app on a physical iOS device, insert a row into the leads table.
**Expected:** Phone receives push notification. Notification shows the lead's name (first_name + last_name) and description in Norwegian. Tapping opens the app.
**Why human:** Requires Apple Developer account, physical device, Supabase project with Edge Function deployed — cannot simulate.

---

### Gaps Summary

Two gaps block complete goal achievement:

**Gap 1 — iOS CocoaPods workspace missing (structural)**
`npx cap add ios` created the native Xcode project (`App.xcodeproj`) but CocoaPods was not run. The `App.xcworkspace` file — which Capacitor requires for building — does not exist at `app/ios/App/App.xcworkspace`. The fix is a single command: `cd app/ios/App && pod install`. This is a setup step, not a code authoring problem.

**Gap 2 — Edge Function uses wrong field for lead name (logic bug)**
Line 213 of the Edge Function reads `lead.name`, but the `leads` table schema has `first_name` and `last_name` columns (no `name` column). This means every push notification title will display "New lead" rather than the actual caller's name. The fix is one line: replace `lead.name` with the concatenation of `first_name` and `last_name` from the webhook record.

Both gaps are small and fixable. The core architecture is sound: Supabase client, auth, realtime, push registration, Edge Function, schema, i18n, and all wiring are all in place.

---

_Verified: 2026-04-03T14:10:01Z_
_Verifier: Claude (gsd-verifier)_
