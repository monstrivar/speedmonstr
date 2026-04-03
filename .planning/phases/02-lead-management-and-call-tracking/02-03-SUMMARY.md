---
phase: 02-lead-management-and-call-tracking
plan: "03"
subsystem: ui
tags: [react, shadcn, base-ui, sheet, bottom-sheet, capacitor, haptics, i18n, typescript]

# Dependency graph
requires:
  - phase: 02-02
    provides: useCallTracking, useLeadMutations, useUpdateLeadStatus hooks

provides:
  - LeadDetailSheet: bottom sheet (h-[85dvh]) with lead details, Ring anchor, follow-up/not-relevant actions
  - FollowUpPrompt: post-call outcome selector (4 buttons, disablePointerDismissal)
  - shadcn Sheet component (base-ui/react dialog primitive, Tailwind v4 base-nova)

affects:
  - 02-04 (plan that wires LeadDetailSheet into DashboardPage/LeadsPage)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Bottom sheet at h-[85dvh] with env(safe-area-inset-bottom) padding for iPhone home indicator"
    - "Button asChild wrapping <a href=tel:> for native call initiation without window.open"
    - "Haptics.impact(ImpactStyle.Medium) called synchronously inside onClick before tel: anchor fires"
    - "disablePointerDismissal on Sheet prevents accidental swipe-to-dismiss on follow-up prompt"
    - "Sheet (Dialog.Root) onOpenChange signature: (open: boolean, eventDetails) => void — base-ui differs from Radix"

key-files:
  created:
    - app/src/components/ui/sheet.tsx
    - app/src/components/LeadDetailSheet.tsx
    - app/src/components/FollowUpPrompt.tsx
  modified:
    - app/src/locales/no.json
    - app/src/locales/en.json

key-decisions:
  - "Sheet component uses @base-ui/react/dialog (not Radix) — auto-selected by shadcn base-nova style; onOpenChange receives (open, eventDetails) not just (open)"
  - "FollowUpPrompt uses disablePointerDismissal to prevent accidental dismiss — calls onOutcome('cancelled') via onOpenChange for state cleanup"
  - "Haptics called synchronously in wrapper onClick; tel: anchor handles actual OS-level call; handleCallPress is fire-and-forget as per existing pattern"
  - "LeadDetailSheet wraps Sheet + FollowUpPrompt in a React Fragment — FollowUpPrompt renders outside SheetContent so it can layer on top"

patterns-established:
  - "Bottom sheet height: h-[85dvh] (not h-full or 100vh) — leaves enough room to indicate more content and avoids home indicator cutoff"
  - "Safe area: style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} on SheetContent"

# Metrics
duration: 2min
completed: 2026-04-03
---

# Phase 02 Plan 03: LeadDetailSheet + FollowUpPrompt Summary

**shadcn Sheet (base-ui dialect) bottom sheet at 85dvh with lead details, tel: Ring anchor, Haptics, and a disablePointerDismissal follow-up outcome prompt**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-03T18:17:40Z
- **Completed:** 2026-04-03T18:19:43Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Added shadcn Sheet component (base-ui/react/dialog, Tailwind v4 base-nova style)
- LeadDetailSheet: full lead info, phone/email/company/description/source, Ring button as `<a href="tel:">` with `Button asChild`, Haptics.impact on press, follow-up + not-relevant action buttons
- FollowUpPrompt: 4 outcome buttons, `disablePointerDismissal` prevents swipe dismiss, onOpenChange routes to `onOutcome("cancelled")` for state cleanup
- i18n keys added to both no.json and en.json (`followUp.*`, `lead.receivedLabel`)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add shadcn Sheet component** - `50c2c2d` (feat)
2. **Task 2: LeadDetailSheet + FollowUpPrompt components** - `6c52005` (feat)

**Plan metadata:** _(pending final commit)_

## Files Created/Modified
- `app/src/components/ui/sheet.tsx` - shadcn Sheet (Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose)
- `app/src/components/LeadDetailSheet.tsx` - Bottom sheet with lead detail, Ring anchor, action buttons, mounts FollowUpPrompt
- `app/src/components/FollowUpPrompt.tsx` - Post-call outcome selector sheet
- `app/src/locales/no.json` - Added followUp.* and lead.receivedLabel keys
- `app/src/locales/en.json` - Added followUp.* and lead.receivedLabel keys

## Decisions Made
- **base-ui onOpenChange signature differs from Radix:** `(open: boolean, eventDetails: DialogRoot.ChangeEventDetails) => void` — used arrow wrapper `(isOpen) => onOpenChange(isOpen)` to match parent's `(open: boolean) => void` shape
- **FollowUpPrompt uses `disablePointerDismissal`:** Prevents accidental dismiss when user taps outside; `onOpenChange` still fires with `false` on Escape — routed to `onOutcome("cancelled")` for state cleanup
- **LeadDetailSheet renders FollowUpPrompt as sibling (React Fragment):** Ensures FollowUpPrompt's Sheet can layer on top of LeadDetailSheet's Sheet without nesting Dialog inside Dialog

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

The shadcn Sheet component generated uses `@base-ui/react/dialog` (not Radix UI) due to the base-nova style preset. The `onOpenChange` signature includes a second `eventDetails` argument. Handled by wrapping in an arrow function to satisfy TypeScript — no functional impact.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- LeadDetailSheet and FollowUpPrompt are standalone components ready to be wired into DashboardPage/LeadsPage in Plan 02-04
- Components consume useCallTracking and useUpdateLeadStatus — both hooks fully implemented and tested in 02-02
- tsc --noEmit passes with zero errors

## Self-Check: PASSED

---
*Phase: 02-lead-management-and-call-tracking*
*Completed: 2026-04-03*
