---
phase: 01-foundation-and-push
plan: "01"
subsystem: ui
tags: [vite, react19, typescript, tailwind-v4, shadcn-ui, capacitor, ios]

# Dependency graph
requires: []
provides:
  - app/ directory as standalone Vite+React 19+TS project
  - Tailwind v4 CSS-first setup (no tailwind.config.js)
  - shadcn/ui component library (button, card, badge, separator, scroll-area, input)
  - Capacitor config for iOS (appId: no.monstr.app)
  - All runtime and dev dependencies installed
affects:
  - 01-02-PLAN
  - 01-03-PLAN
  - 01-04-PLAN
  - 01-05-PLAN

# Tech tracking
tech-stack:
  added:
    - react@19
    - react-dom@19
    - vite@8
    - "@vitejs/plugin-react"
    - tailwindcss@4
    - "@tailwindcss/vite"
    - "@supabase/supabase-js"
    - "@tanstack/react-query@5"
    - react-router-dom@7
    - react-i18next
    - i18next
    - i18next-browser-languagedetector
    - lucide-react
    - "@capacitor/core"
    - "@capacitor/push-notifications"
    - "@capacitor/app"
    - "@capacitor/haptics"
    - "@capacitor/splash-screen"
    - shadcn/ui (button, card, badge, separator, scroll-area, input)
  patterns:
    - "Tailwind v4: CSS-first config via @import tailwindcss in index.css, no JS config file"
    - "shadcn/ui: components copied into src/components/ui/, customizable"
    - "Path alias: @ maps to ./src/ in both vite.config.ts and tsconfig.app.json"
    - "Named exports for all React components (no default exports)"
    - "TypeScript composite project references (tsconfig.json + tsconfig.app.json)"

key-files:
  created:
    - app/package.json
    - app/vite.config.ts
    - app/tsconfig.json
    - app/tsconfig.app.json
    - app/index.html
    - app/src/main.tsx
    - app/src/App.tsx
    - app/src/index.css
    - app/src/vite-env.d.ts
    - app/components.json
    - app/src/lib/utils.ts
    - app/src/components/ui/button.tsx
    - app/src/components/ui/card.tsx
    - app/src/components/ui/badge.tsx
    - app/src/components/ui/separator.tsx
    - app/src/components/ui/scroll-area.tsx
    - app/src/components/ui/input.tsx
    - app/capacitor.config.ts
  modified: []

key-decisions:
  - "Used ignoreDeprecations 6.0 in tsconfig.app.json to allow baseUrl with TypeScript 5.8+ (avoids error TS5101)"
  - "@capacitor/badge does not exist in npm registry - omitted; badge counts handled via APNs payload"
  - "cap init skipped (conflicts with capacitor.config.ts) - TypeScript config file used directly"
  - "shadcn init auto-selected base-nova style with neutral color (Tailwind v4 compatible)"

patterns-established:
  - "All app code lives in app/ subdirectory, separate from landing page in root"
  - "Named exports only for React components"
  - "Tailwind v4 with CSS variables for theming, dark mode via .dark class"

# Metrics
duration: 4min
completed: 2026-04-03
---

# Phase 01 Plan 01: Foundation Scaffold Summary

**Vite 8 + React 19 + TypeScript + Tailwind v4 CSS-first + shadcn/ui (6 components) project scaffolded in app/ with Capacitor configured for iOS (appId: no.monstr.app)**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-03T09:20:57Z
- **Completed:** 2026-04-03T09:24:35Z
- **Tasks:** 2/2
- **Files modified:** 18

## Accomplishments
- Created app/ as a fully standalone, buildable Vite+React 19+TS project — build exits 0 with 46 modules transformed
- Configured Tailwind v4 CSS-first (no tailwind.config.js), shadcn/ui initialized with full CSS variable theme including dark mode
- Added 6 shadcn/ui components (button, card, badge, separator, scroll-area, input) and Capacitor config ready for iOS

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold app/ with Vite + React 19 + TypeScript + dependencies** - `a38c04f` (feat)
2. **Task 2: Configure shadcn/ui and Capacitor** - `297401a` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `app/package.json` - Project manifest, name monstr-app, all deps
- `app/vite.config.ts` - React plugin, Tailwind v4, @ alias, port 5174
- `app/tsconfig.json` + `app/tsconfig.app.json` - Strict TS, bundler resolution, composite
- `app/index.html` - lang=no, root div, module script
- `app/src/main.tsx` - React 19 createRoot entry
- `app/src/App.tsx` - Named export component with Button test
- `app/src/index.css` - Tailwind v4 + full shadcn CSS variable theme
- `app/components.json` - shadcn/ui config (base-nova, neutral, Tailwind v4)
- `app/src/lib/utils.ts` - cn() utility
- `app/src/components/ui/*` - button, card, badge, separator, scroll-area, input
- `app/capacitor.config.ts` - appId: no.monstr.app, PushNotifications + SplashScreen

## Decisions Made
- Used `ignoreDeprecations: "6.0"` in tsconfig.app.json — TypeScript 5.8 treats `baseUrl` as deprecated (TS5101 error); this suppresses it while maintaining the path alias functionality
- `@capacitor/badge` package does not exist on npm — omitted; badge counts will be set via APNs `aps.badge` payload in push notification JSON
- Skipped `cap init` — it refuses to run when capacitor.config.ts exists; the TypeScript config is sufficient and preferred
- shadcn auto-selected `base-nova` style (Tailwind v4 native), no manual style selection needed

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] TypeScript TS5101 deprecation error on baseUrl**
- **Found during:** Task 1 (build verification)
- **Issue:** TypeScript 5.8+ treats `baseUrl` in tsconfig as deprecated, blocking `tsc -b`
- **Fix:** Added `"ignoreDeprecations": "6.0"` to tsconfig.app.json
- **Files modified:** `app/tsconfig.app.json`
- **Verification:** Build exits 0 after fix
- **Committed in:** `a38c04f`

**2. [Rule 3 - Blocking] @capacitor/badge package does not exist in npm registry**
- **Found during:** Task 1 (dependency installation)
- **Issue:** `npm install @capacitor/badge` returns 404 — package does not exist
- **Fix:** Omitted from dependencies; badge functionality available via APNs payload `aps.badge`
- **Files modified:** `app/package.json` (package not added)
- **Verification:** All other Capacitor packages installed successfully
- **Committed in:** `a38c04f`

---

**Total deviations:** 2 auto-fixed (1 bug, 1 blocking)
**Impact on plan:** Both handled inline with no scope change. Badge counts remain achievable via push notification payload.

## Issues Encountered
- `cap init` refused to run with TypeScript config present — this is expected Capacitor behavior, not an error. Config file is the source of truth.

## User Setup Required
None - no external service configuration required for this plan.

## Next Phase Readiness
- app/ project builds cleanly — all subsequent plans can import from this foundation
- shadcn/ui components ready to use with `@/components/ui/*` imports
- Tailwind v4 CSS variables established for consistent theming
- Capacitor core installed; iOS platform will be added in Plan 05
- No blockers for Plan 02 (Supabase setup)

---
*Phase: 01-foundation-and-push*
*Completed: 2026-04-03*

## Self-Check: PASSED
