---
phase: 01-foundation-and-push
plan: "04"
subsystem: push-notifications
tags: [capacitor, apns, ios, push-notifications, supabase, edge-functions, web-crypto, deno]

# Dependency graph
requires:
  - phase: 01-02
    provides: Supabase client, auth hook, TypeScript types, project structure

provides:
  - usePushNotifications hook — requests APNs permissions, registers device, stores token in push_tokens table
  - Supabase Edge Function push-notification — receives leads INSERT webhook, signs APNs JWT, sends push to all org devices

affects:
  - 01-05-plan (deploy and wire webhooks)
  - Any future notification preferences or scheduling work

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "APNs JWT signed with Web Crypto (ECDSA ES256, IEEE P1363 format) — no DER conversion needed in Deno"
    - "Push token upserted on user_id+platform conflict — safe to call on every app launch"
    - "Edge Function validates webhook type+table before processing — skips non-INSERT or non-leads events"

key-files:
  created:
    - app/src/hooks/usePushNotifications.ts
    - app/supabase/functions/push-notification/index.ts
  modified: []

key-decisions:
  - "push_tokens upsert uses onConflict: user_id,platform — one token per user per platform"
  - "supabase.from('push_tokens') cast to any — push_tokens not in generated types until schema is run; types fixed in later plan"
  - "Edge Function defaults APNS_ENVIRONMENT to sandbox for safety — must explicitly set production"
  - "APNs JWT signed with Web Crypto (Deno native) — produces IEEE P1363 64-byte signature, no DER-to-raw conversion unlike Node.js"
  - "apns-topic set to no.monstr.app — must match iOS app bundle ID exactly"

patterns-established:
  - "Hook guard pattern: if (!userId || !Capacitor.isNativePlatform()) return — prevents web-only crashes"
  - "Listener cleanup via removeAllListeners() in useEffect return — prevents listener leaks across re-mounts"

# Metrics
duration: 2min
completed: "2026-04-03"
---

# Phase 01 Plan 04: Push Notification Pipeline Summary

**Capacitor APNs token registration hook and Deno Edge Function that signs APNs JWTs with Web Crypto and sends push notifications on lead INSERT**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-03T09:32:29Z
- **Completed:** 2026-04-03T09:34:20Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- `usePushNotifications` hook requests permissions on native platform, registers device, upserts APNs token to `push_tokens` table, handles foreground notifications and tap-to-call actions, cleans up all listeners on unmount
- `push-notification` Supabase Edge Function receives Supabase webhook, queries org users and their push tokens, generates APNs JWT using Web Crypto, dispatches alert push to every registered iOS device
- Notification tap opens phone dialer (`tel:`) for leads that have a phone number — core value-add for speed-to-lead

## Task Commits

Each task was committed atomically:

1. **Task 1: Capacitor push notification registration hook** - `fe634c9` (feat)
2. **Task 2: Supabase Edge Function for APNs push sending** - `dd8fcbb` (feat)

**Plan metadata:** (see final commit below)

## Files Created/Modified
- `app/src/hooks/usePushNotifications.ts` - React hook: permission request, device registration, token storage, notification handling
- `app/supabase/functions/push-notification/index.ts` - Deno Edge Function: webhook receiver, APNs JWT signer, push dispatcher

## Decisions Made
- **push_tokens upsert `onConflict: user_id,platform`:** One active token per user per platform. Re-calling on app launch is idempotent and keeps the token fresh.
- **`supabase.from('push_tokens') as any`:** The generated Supabase types don't include `push_tokens` until the schema.sql is executed against the live project. Cast unblocks the build; types regenerate once the schema is applied.
- **APNs JWT via Web Crypto (IEEE P1363):** Deno's `crypto.subtle.sign` with ECDSA returns raw r||s (64 bytes), not DER-encoded like Node.js. No conversion needed — signature is base64url-encoded directly.
- **Default `APNS_ENVIRONMENT=sandbox`:** Safer default. Production deployments must explicitly set `APNS_ENVIRONMENT=production`.
- **`apns-topic: no.monstr.app`:** Must match the iOS app bundle ID exactly. Configured to match the Capacitor app bundle.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TypeScript type error on push_tokens upsert**
- **Found during:** Task 1 (build verification)
- **Issue:** `supabase.from("push_tokens")` infers `never` because `push_tokens` is not in the generated Database types — the schema hasn't been executed against a live Supabase project yet
- **Fix:** Cast `supabase.from("push_tokens") as any` with an eslint-disable comment; types will be regenerated after schema is applied
- **Files modified:** `app/src/hooks/usePushNotifications.ts`
- **Verification:** `npm run build` passes with zero errors
- **Committed in:** `fe634c9` (part of Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 type-system bug from missing schema)
**Impact on plan:** Minimal — the fix is correct and expected. Types regenerate once schema.sql runs against Supabase.

## Issues Encountered
- Supabase TypeScript types do not include `push_tokens` until schema.sql is executed against the live project. The `as any` cast is intentional and documented.

## User Setup Required

Before push notifications can work in production:

1. **Apply schema.sql** in Supabase dashboard → SQL Editor (creates `push_tokens` table and other tables)
2. **Set Edge Function env vars** in Supabase dashboard → Settings → Edge Functions:
   - `APNS_TEAM_ID` — Apple Developer Team ID
   - `APNS_KEY_ID` — APNs Auth Key ID (from `.p8` filename)
   - `APNS_PRIVATE_KEY` — Full contents of the `.p8` key file
   - `APNS_ENVIRONMENT` — `sandbox` (dev) or `production` (live)
3. **Deploy the Edge Function:** `supabase functions deploy push-notification` (covered in plan 01-05)
4. **Create Supabase webhook:** Database → Webhooks → INSERT on `leads` → URL: `https://<project>.supabase.co/functions/v1/push-notification`

## Next Phase Readiness
- Push notification pipeline is code-complete; both client and server sides are implemented
- Requires plan 01-05 for Supabase CLI deploy and webhook wiring
- Requires schema.sql to be executed before end-to-end testing is possible
- `usePushNotifications` hook is ready to be added to the authenticated Layout or DashboardPage

---
*Phase: 01-foundation-and-push*
*Completed: 2026-04-03*

## Self-Check: PASSED
