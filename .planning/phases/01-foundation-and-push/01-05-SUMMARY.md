---
phase: 01-foundation-and-push
plan: 05
subsystem: infra
tags: [capacitor, ios, push-notifications, react, typescript, vite]

# Dependency graph
requires:
  - phase: 01-04
    provides: usePushNotifications hook ready to wire into authenticated UI
provides:
  - Push hook wired into Layout.tsx (fires on every authenticated session)
  - Capacitor iOS project at app/ios/ using Swift Package Manager
  - Web build synced to iOS project (4 Capacitor plugins registered)
  - app/.gitignore excluding iOS build artifacts
affects: [ios-build, push-testing, app-store-release]

# Tech tracking
tech-stack:
  added: ["@capacitor/ios@8.3.0"]
  patterns: ["Push hook called in Layout with user?.id — registers on all authenticated screens"]

key-files:
  created:
    - app/.gitignore
    - app/ios/App/App.xcodeproj/project.pbxproj
    - app/ios/App/App/AppDelegate.swift
    - app/ios/App/App/Info.plist
    - app/ios/App/CapApp-SPM/Package.swift
  modified:
    - app/src/components/Layout.tsx
    - app/src/lib/supabase.ts
    - app/package.json
    - app/package-lock.json

key-decisions:
  - "@capacitor/ios was not in package.json — installed as part of task (Rule 3 blocking fix)"
  - "Capacitor 8 uses Swift Package Manager: iOS project is App.xcodeproj (no top-level App.xcworkspace)"
  - "Push hook placed in Layout.tsx (not DashboardPage) — fires once per session regardless of route"
  - "supabase.ts updated with supabaseConfigured guard and placeholder fallbacks — build works without .env.local"

patterns-established:
  - "usePushNotifications(user?.id ?? null) in Layout — null-safe, no-op on web/unauthenticated"
  - "supabaseConfigured export pattern — consumers guard Supabase calls during local dev without .env.local"

# Metrics
duration: 8min
completed: 2026-04-03
---

# Phase 01 Plan 05: Wire Push + Capacitor iOS Summary

**Push registration wired into authenticated Layout, Capacitor iOS project generated via Swift Package Manager, synced with web build, and verified in Xcode (Simulator build succeeded)**

## Performance

- **Duration:** ~25 min (including Xcode human-verify checkpoint)
- **Started:** 2026-04-03T09:40:00Z
- **Completed:** 2026-04-03T10:00:00Z
- **Tasks:** 1 auto + 1 human-verify (approved)
- **Files modified:** 10

## Accomplishments

- `usePushNotifications(user?.id ?? null)` called in Layout.tsx — registers for push on every authenticated app startup
- `@capacitor/ios` installed, `npx cap add ios` and `npx cap sync ios` completed cleanly
- iOS project at `app/ios/App/App.xcodeproj` with all 4 Capacitor plugins (app, haptics, push-notifications, splash-screen)
- `app/.gitignore` created, excluding `node_modules/`, `dist/`, `.env*`, and iOS build artifacts (Pods, build/, xcuserdata/, DerivedData/)

## Task Commits

1. **Task 1: Wire push hook and build iOS project** - `be7ed55` (feat)
2. **Task 2: Checkpoint — Xcode verification** - `91fb580` (docs, pre-approval state)

**Plan metadata:** (final commit — this update)

## Files Created/Modified

- `app/src/components/Layout.tsx` - Added `usePushNotifications` import and call with `user?.id`
- `app/src/lib/supabase.ts` - Added `supabaseConfigured` boolean export and placeholder fallbacks for missing env vars
- `app/.gitignore` - Created, excludes node_modules, dist, .env, iOS build artifacts
- `app/package.json` - Added `@capacitor/ios@^8.3.0` to dependencies
- `app/ios/App/App.xcodeproj/project.pbxproj` - Xcode project file (Capacitor generated)
- `app/ios/App/App/AppDelegate.swift` - Swift app delegate (Capacitor generated)
- `app/ios/App/App/Info.plist` - iOS app configuration (Capacitor generated)
- `app/ios/App/CapApp-SPM/Package.swift` - Swift Package Manager manifest listing all Capacitor plugins

## Decisions Made

- **@capacitor/ios missing from dependencies:** Was not in package.json despite being required for `cap add ios`. Installed as Rule 3 (blocking fix). Added to dependencies.
- **No top-level App.xcworkspace:** Capacitor 8 uses Swift Package Manager instead of CocoaPods. The project opens via `App.xcodeproj`, which contains `project.xcworkspace` internally. This is correct and expected.
- **Push hook in Layout, not DashboardPage:** Layout wraps all authenticated routes, ensuring push registration fires once per session on every screen.
- **supabase.ts hardened with guard + fallbacks:** `createClient` with empty strings throws at runtime. Added `?? ""` fallbacks, placeholder strings to prevent throw, and exported `supabaseConfigured` so consumers can conditionally call Supabase. This allows the web dev server and Xcode build to work without `.env.local` present.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed missing @capacitor/ios dependency**
- **Found during:** Task 1 (cap add ios step)
- **Issue:** `npx cap add ios` failed with "Could not find the ios platform. You must install it in your project first, e.g. w/ npm install @capacitor/ios"
- **Fix:** Ran `npm install @capacitor/ios` — added to dependencies
- **Files modified:** app/package.json, app/package-lock.json
- **Verification:** `npx cap add ios` succeeded after install
- **Committed in:** be7ed55 (Task 1 commit)

**2. [Rule 2 - Missing Critical] Added supabaseConfigured guard in supabase.ts**
- **Found during:** Task 1 (dev server + Xcode build smoke-test)
- **Issue:** `createClient(undefined, undefined)` throws at runtime when `VITE_SUPABASE_*` env vars absent; breaks local dev and prevents clean Xcode verification
- **Fix:** Added `?? ""` fallbacks, placeholder values for createClient, exported `supabaseConfigured` boolean
- **Files modified:** app/src/lib/supabase.ts
- **Verification:** `npm run build` passes without `.env.local`; dev server starts cleanly
- **Committed in:** be7ed55 (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 missing critical)
**Impact on plan:** Both fixes necessary for verification steps to pass. No scope creep.

## Issues Encountered

- Capacitor 8 SPM pattern produces `App.xcodeproj` not a standalone `App.xcworkspace`. Plan verification step (`ls app/ios/App/App.xcworkspace`) would fail — actual path is `app/ios/App/App.xcodeproj`. Verified project exists and is correct structure.

## User Setup Required

Before Xcode build will succeed:

1. Open `app/ios/App/App.xcodeproj` in Xcode (not .xcworkspace — there isn't one at the top level with SPM)
2. Select your **Apple Developer Team** in Signing & Capabilities
3. Add **Push Notifications** capability
4. Add **Background Modes** capability → check "Remote notifications"
5. Build for Simulator (`Cmd+B`) to verify project compiles

## Next Phase Readiness

- Phase 01 is complete. Xcode checkpoint approved — web server works, web build succeeds, Xcode builds for iPhone 16 Simulator.
- All code committed; schema, env vars, and APNs secrets still require manual Supabase setup (documented in STATE.md concerns)
- iOS push will only work on a real device (Simulator cannot receive APNs)
- Next natural step: Phase 02 — Supabase project creation, schema execution, APNs key configuration, and end-to-end push testing on device

---
*Phase: 01-foundation-and-push*
*Completed: 2026-04-03*

## Self-Check: PASSED
