# Phase 02: Lead Management + Call Tracking - Research

**Researched:** 2026-04-03
**Domain:** React mobile UI patterns, Capacitor App lifecycle, Supabase mutations, TanStack Query v5
**Confidence:** HIGH (stack locked from Phase 01, all libraries verified via official docs)

---

<user_constraints>
## User Constraints (from phase context)

### Locked Decisions
- Build on existing app/ codebase (React 19 + TS + Vite + Tailwind v4 + shadcn/ui)
- Supabase for database + realtime
- Capacitor for iOS
- TanStack Query for server state
- All UI strings through react-i18next t()
- Named exports only
- Mobile-first design

### Claude's Discretion
- How to implement the lead detail view (slide-over sheet vs full page vs bottom sheet)
- How to detect app resume after phone call (Capacitor App plugin)
- How to structure call_events table
- How to build the "Did you follow up?" prompt UX
- Response time analytics visualization approach
- Whether to use shadcn/ui Sheet component for lead detail

### Deferred Ideas (OUT OF SCOPE)
- SMS log
- Escalation system
- Admin/settings pages
- Analytics dashboards beyond response time
- App Store submission
</user_constraints>

---

## Summary

Phase 02 adds lead detail view, click-to-call with automatic call tracking, and a post-call follow-up prompt. The existing codebase already has all dependencies installed — no new packages are needed. The @capacitor/app plugin is already in package.json at version 8.1.0 and provides `appStateChange` with `isActive: boolean`, which is the correct primitive for detecting when the user returns from the phone dialer.

The recommended UI pattern is **shadcn/ui Sheet with `side="bottom"` on mobile** for the lead detail view. This is already available in the codebase (shadcn is installed), delivers a native-feeling bottom drawer without adding dependencies, and matches how iOS users expect panels to appear. The Sheet component is Dialog-based (Radix UI), so it handles focus trapping, accessibility, and scroll locking correctly out of the box.

For call tracking, the pattern is: (1) log `call_initiated` event to Supabase on button press, (2) open `tel:` link, (3) listen for `appStateChange isActive: true`, (4) if a pending call exists, show follow-up prompt. All mutations go through TanStack Query v5 `useMutation` with `queryClient.invalidateQueries` on success. The `call_events` table should be added via a migration SQL file.

**Primary recommendation:** Use shadcn/ui Sheet (bottom) for lead detail, Capacitor `appStateChange` for resume detection, and a single `useCallTracking` hook that encapsulates the entire call + follow-up flow.

---

## Standard Stack

All packages already installed. No new npm installs required.

### Core (already in package.json)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @capacitor/app | ^8.1.0 | App lifecycle events (resume detection) | Official Capacitor plugin, iOS UIApplication notifications |
| @tanstack/react-query | ^5.96.1 | Server state + mutations | Already in use for useLeads |
| @supabase/supabase-js | ^2.101.1 | DB reads/writes | Already in use |
| shadcn/ui Sheet | (part of shadcn ^4.1.2) | Lead detail slide-over panel | Radix Dialog primitive, a11y handled, side="bottom" for mobile |
| react-i18next | ^17.0.2 | All UI strings | Already in use |
| lucide-react | ^1.7.0 | Icons (Phone, Check, X, FileText) | Already in use |

### Supporting (already installed)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @capacitor/haptics | ^8.0.2 | Tactile feedback on call button press | On "Ring" button tap for native feel |
| react-router-dom | ^7.14.0 | Optional: route-based lead detail | Only if sheet approach is abandoned |

### New packages needed
None. All capabilities are covered by installed dependencies.

**Installation:**
```bash
# Add Sheet component from shadcn (generates the file if not present)
npx shadcn@latest add sheet
# Check if already present:
ls app/src/components/ui/sheet.tsx
```

---

## Architecture Patterns

### Recommended Project Structure additions
```
app/src/
├── components/
│   ├── LeadCard.tsx          (EXISTING — add onPress handler to open sheet)
│   ├── LeadDetailSheet.tsx   (NEW — bottom sheet with full lead detail)
│   ├── FollowUpPrompt.tsx    (NEW — post-call modal/alert asking "Did you reach them?")
│   └── ui/
│       └── sheet.tsx         (ADD via shadcn CLI if not present)
├── hooks/
│   ├── useLeads.ts           (EXISTING)
│   ├── useCallTracking.ts    (NEW — encapsulates call_initiated + resume detection)
│   ├── useLeadMutations.ts   (NEW — updateLeadStatus, addCallEvent)
│   └── useAppResume.ts       (NEW — thin wrapper over Capacitor App appStateChange)
├── pages/
│   └── DashboardPage.tsx     (MODIFY — add selectedLeadId state, render LeadDetailSheet)
└── supabase/
    ├── schema.sql            (EXISTING)
    └── migrations/
        └── 002-call-events.sql  (NEW — call_events table)
```

### Pattern 1: Capacitor App Resume Detection

**What:** Listen for `appStateChange` with `isActive: true` to detect return from phone dialer.

**When to use:** After the user taps "Ring" and the tel: link opens the phone app. When `isActive` fires true, check if there is a pending call to show the follow-up prompt.

**Example:**
```typescript
// Source: https://capacitorjs.com/docs/apis/app
import { App } from "@capacitor/app"
import { useEffect, useRef } from "react"

export function useAppResume(onResume: () => void) {
  const onResumeRef = useRef(onResume)
  onResumeRef.current = onResume

  useEffect(() => {
    const listener = App.addListener("appStateChange", ({ isActive }) => {
      if (isActive) {
        onResumeRef.current()
      }
    })

    return () => {
      void listener.then((handle) => handle.remove())
    }
  }, [])
}
```

**Important:** `addListener` returns a `Promise<PluginListenerHandle>`, not a handle directly. Clean up by resolving the promise and calling `.remove()`.

### Pattern 2: Call Tracking Hook

**What:** Single hook managing the entire call + follow-up lifecycle.

**When to use:** Mount in the component that renders the call button (LeadDetailSheet or LeadCard).

```typescript
// useCallTracking.ts — conceptual structure
// Source: Capacitor App docs + TanStack Query v5 useMutation docs

import { useState, useRef } from "react"
import { useAppResume } from "./useAppResume"
import { useCallEventMutation } from "./useLeadMutations"

export function useCallTracking(leadId: string, userId: string) {
  const [pendingCall, setPendingCall] = useState<{ initiatedAt: string } | null>(null)
  const [showFollowUp, setShowFollowUp] = useState(false)
  const { mutate: logCallEvent } = useCallEventMutation()

  const handleCallPress = () => {
    const initiatedAt = new Date().toISOString()
    // Log call_initiated immediately
    logCallEvent({ leadId, userId, initiatedAt, outcome: null })
    setPendingCall({ initiatedAt })
    // tel: link opened by the button's href — no JS needed
  }

  useAppResume(() => {
    if (pendingCall) {
      setShowFollowUp(true)
    }
  })

  const handleFollowUpOutcome = (outcome: "answered" | "no_answer" | "voicemail" | "cancelled") => {
    if (!pendingCall) return
    const returnedAt = new Date().toISOString()
    logCallEvent({ leadId, userId, initiatedAt: pendingCall.initiatedAt, returnedAt, outcome })
    setPendingCall(null)
    setShowFollowUp(false)
  }

  return { handleCallPress, showFollowUp, handleFollowUpOutcome }
}
```

### Pattern 3: TanStack Query v5 useMutation for Lead Status

**What:** Mutate lead status with optimistic update so the badge changes immediately.

**When to use:** When user taps "Mark as followed up", "Not relevant", or adds a note.

```typescript
// Source: https://tanstack.com/query/v5/docs/framework/react/guides/mutations
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"

export function useUpdateLeadStatus(organizationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ leadId, status }: { leadId: string; status: LeadStatus }) => {
      const { error } = await supabase
        .from("leads")
        .update({ status })
        .eq("id", leadId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads", organizationId] })
    },
  })
}
```

### Pattern 4: shadcn/ui Sheet for Lead Detail

**What:** Bottom sheet on mobile, right sheet on desktop, showing full lead detail + call button.

**When to use:** User taps a LeadCard in the dashboard feed.

```typescript
// Source: https://ui.shadcn.com/docs/components/sheet
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

// In DashboardPage.tsx:
const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

<LeadDetailSheet
  lead={selectedLead}
  open={selectedLead !== null}
  onOpenChange={(open) => { if (!open) setSelectedLead(null) }}
/>

// LeadDetailSheet.tsx:
export function LeadDetailSheet({ lead, open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85dvh] rounded-t-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{fullName}</SheetTitle>
        </SheetHeader>
        {/* Lead details + call button + follow-up actions */}
      </SheetContent>
    </Sheet>
  )
}
```

**Note on `side`:** `side="bottom"` gives the mobile-native feel. Use `h-[85dvh]` with `dvh` units to account for iOS dynamic viewport (keyboard showing/hiding). Do NOT use `100vh` — it will be cut off by the home indicator bar.

### Anti-Patterns to Avoid

- **Do NOT use `window.location.href = "tel:..."` for call tracking.** It navigates away and makes state tracking unreliable. Use an `<a href="tel:...">` or `<Button as="a">` so the browser handles the tel: protocol. The button press fires `handleCallPress` synchronously before navigation.
- **Do NOT track call duration as actual phone call duration.** We cannot measure that. `duration_sec` in call_events is the time between `initiated_at` and `returned_at` (time user was away from app), not actual call length. Document this in code comments.
- **Do NOT listen for `resume` event instead of `appStateChange`.** The `appStateChange` event with `isActive: true` is the correct pattern for Capacitor 8. Both exist but `appStateChange` is more reliable across iOS/Android.
- **Do NOT put `App.addListener` inside a render function.** Always in `useEffect` with cleanup returning `handle.remove()`.
- **Do NOT assume the Sheet is already installed.** Run `npx shadcn@latest add sheet` to generate the component file.

---

## Database Schema: call_events Table

Add via migration file `app/supabase/migrations/002-call-events.sql`:

```sql
-- call_events: tracks each call attempt from the app
CREATE TABLE call_events (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id         uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  initiated_at    timestamptz NOT NULL DEFAULT now(),
  returned_at     timestamptz,          -- null until user returns to app
  outcome         text CHECK (outcome IN ('answered', 'no_answer', 'voicemail', 'cancelled')),
  duration_sec    integer,              -- time away from app (not actual call duration)
  note            text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE call_events ENABLE ROW LEVEL SECURITY;

-- Users can read/write call events within their organization
CREATE POLICY "Users manage org call events"
  ON call_events FOR ALL
  USING (
    lead_id IN (
      SELECT id FROM leads WHERE organization_id IN (
        SELECT organization_id FROM users WHERE id = auth.uid()
      )
    )
  );

-- Indexes for analytics queries
CREATE INDEX call_events_lead_id_idx ON call_events (lead_id);
CREATE INDEX call_events_user_id_idx ON call_events (user_id);
CREATE INDEX call_events_initiated_at_idx ON call_events (initiated_at DESC);
```

**Update supabase.ts types** to add call_events after running migration:
```typescript
call_events: {
  Row: {
    id: string
    lead_id: string
    user_id: string
    initiated_at: string
    returned_at: string | null
    outcome: "answered" | "no_answer" | "voicemail" | "cancelled" | null
    duration_sec: number | null
    note: string | null
    created_at: string
  }
  Insert: { ... }
  Update: { ... }
}
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Bottom sheet / drawer | Custom CSS position:fixed overlay | shadcn/ui Sheet with side="bottom" | Radix handles focus trap, scroll lock, accessibility, animation, keyboard dismiss |
| App state change detection | visibilitychange DOM event | Capacitor App.addListener('appStateChange') | visibilitychange is unreliable on iOS in Capacitor; native plugin hooks UIApplication directly |
| Optimistic UI for status update | Manual local state | TanStack Query useMutation + invalidateQueries | Race conditions, loading states, error rollback handled by the library |
| Realtime lead updates | setInterval polling | Supabase realtime (already in useLeads) | Already implemented; Phase 02 mutations just need invalidateQueries |
| "Did you reach them?" modal | Custom modal component | shadcn/ui Sheet or AlertDialog | Already available, a11y handled |

**Key insight:** The only genuinely new UI surface in this phase is LeadDetailSheet and FollowUpPrompt. Everything else is wiring existing primitives together.

---

## Common Pitfalls

### Pitfall 1: appStateChange fires on first mount
**What goes wrong:** `App.addListener('appStateChange')` fires `isActive: true` immediately when the component mounts on some devices, triggering the follow-up prompt before any call is made.
**Why it happens:** iOS fires `didBecomeActiveNotification` on initial foreground.
**How to avoid:** Only react to `isActive: true` when `pendingCall` state is non-null. The flag gates the prompt.
**Warning signs:** Follow-up prompt appears on app open, not after a call.

### Pitfall 2: Sheet height clipped by iOS home indicator
**What goes wrong:** `h-full` or `h-screen` Sheet content is obscured by the iPhone home indicator bar at the bottom.
**Why it happens:** `100vh` and `h-full` don't account for safe area insets in Capacitor webview.
**How to avoid:** Use `h-[85dvh]` (dynamic viewport height) and add `pb-safe` or `paddingBottom: 'env(safe-area-inset-bottom)'` inside the sheet content. The existing Layout already uses this pattern.
**Warning signs:** Action buttons at bottom of sheet are cut off on iPhone.

### Pitfall 3: Capacitor listener memory leak
**What goes wrong:** Multiple `App.addListener` calls accumulate if component re-mounts (e.g., on route change), causing duplicate follow-up prompts.
**Why it happens:** `addListener` returns a Promise; forgetting to call `.remove()` in cleanup leaves listeners alive.
**How to avoid:** Always clean up in useEffect return. `addListener` returns `Promise<PluginListenerHandle>` — resolve it to get the handle, then call `handle.remove()`.
**Warning signs:** Follow-up prompt appears twice, or console shows duplicate log entries.

### Pitfall 4: tel: link and call tracking race condition
**What goes wrong:** `handleCallPress` logs the event, but the `tel:` navigation happens before Supabase insert completes.
**Why it happens:** `window.location.href = tel:` fires synchronously and may interrupt the async insert.
**How to avoid:** Use an `<a href="tel:...">` element. The anchor's default navigation is handled by the browser after the click handler runs. Log the event fire-and-forget (don't `await`). The `returned_at` update happens later on app resume.
**Warning signs:** Some call events missing from Supabase but app shows follow-up prompt.

### Pitfall 5: Realtime subscription not updated for call_events
**What goes wrong:** After updating lead status, the dashboard list doesn't reflect the new status.
**Why it happens:** The existing realtime subscription in `useLeads` only watches INSERT, not UPDATE.
**How to avoid:** Either (a) expand the realtime subscription to include `UPDATE` events, or (b) rely on `queryClient.invalidateQueries` in `onSuccess` of the mutation, which re-fetches from Supabase. Option (b) is simpler and sufficient for Phase 02.
**Warning signs:** Lead status badge in feed doesn't change after marking followed-up.

### Pitfall 6: LeadDetailSheet re-renders losing call state
**What goes wrong:** Selecting a different lead while a call is "pending" loses the `pendingCall` state because the Sheet re-renders with a new `leadId`.
**Why it happens:** `useState` in `useCallTracking` is per-component instance; unmounting/remounting resets it.
**How to avoid:** Keep the Sheet mounted but hidden (controlled `open` prop), or lift `pendingCall` state up to DashboardPage so it persists across re-renders.
**Warning signs:** Follow-up prompt never shows after call if user tapped back before returning.

---

## Code Examples

### Add listener with proper cleanup
```typescript
// Source: https://capacitorjs.com/docs/apis/app
import { App } from "@capacitor/app"
import { useEffect } from "react"

useEffect(() => {
  const listenerPromise = App.addListener("appStateChange", ({ isActive }) => {
    if (isActive && pendingCallRef.current) {
      setShowFollowUp(true)
    }
  })

  return () => {
    void listenerPromise.then((handle) => handle.remove())
  }
}, []) // empty deps — use ref for pendingCall to avoid re-registering
```

### Update lead status via Supabase + TanStack Query
```typescript
// Source: https://supabase.com/docs/reference/javascript/update
// Source: https://tanstack.com/query/v5/docs/framework/react/guides/mutations
const { mutate: updateStatus, isPending } = useMutation({
  mutationFn: async ({ leadId, status }: { leadId: string; status: LeadStatus }) => {
    const { error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", leadId)
    if (error) throw error
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["leads", organizationId] })
  },
})
```

### Insert call event
```typescript
// Source: https://supabase.com/docs/reference/javascript/insert
const { mutate: logCall } = useMutation({
  mutationFn: async (event: CallEventInsert) => {
    const { error } = await supabase
      .from("call_events")
      .insert(event)
    if (error) throw error
  },
})
```

### Sheet component with bottom positioning
```typescript
// Source: https://ui.shadcn.com/docs/components/sheet
<Sheet open={open} onOpenChange={onOpenChange}>
  <SheetContent
    side="bottom"
    className="h-[85dvh] rounded-t-2xl overflow-y-auto"
    style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
  >
    <SheetHeader className="text-left">
      <SheetTitle>{fullName}</SheetTitle>
    </SheetHeader>
    {/* content */}
  </SheetContent>
</Sheet>
```

### Response time calculation for analytics display
```typescript
// Response time: lead.created_at → earliest call_event.initiated_at for that lead
// Use SQL view or compute in JS:
const responseMinutes = (
  (new Date(callEvent.initiated_at).getTime() - new Date(lead.created_at).getTime())
  / 1000 / 60
).toFixed(1)
```

---

## Lead Status State Machine

The existing `leads.status` enum maps to Phase 02 actions:

| Current Status | Action | New Status |
|----------------|--------|------------|
| `ny` | User taps "Fulgt opp" | `fulgt_opp` |
| `ny` | User taps "Ikke relevant" | `ikke_relevant` |
| `ny` | Call initiated (auto) | `venter` (optional — can stay `ny`) |
| `venter` | User taps "Fulgt opp" | `fulgt_opp` |
| `sms_sendt` | User taps "Fulgt opp" | `fulgt_opp` |

**Recommendation:** Do NOT automatically change status to `venter` on call initiation. Only update on explicit user action (follow-up prompt outcome). This prevents phantom status changes if the user dials but hangs up immediately.

The `booket` status is not part of Phase 02 actions — leave it for future phases.

---

## Response Time Analytics

Phase 02 scope: "Response time analytics (time from notification to call)."

**Recommendation:** Simple stat display only — no chart library needed.

```
Average response time = AVG(call_events.initiated_at - leads.created_at)
WHERE call_events.lead_id = leads.id
  AND leads.organization_id = :org_id
  AND call_events.initiated_at > NOW() - INTERVAL '30 days'
```

Display as: "Snitt responstid: 4.2 min" — a single stat card on the dashboard. Use a Supabase RPC function or compute in JS from the query results. Do NOT add a charting library (recharts, victory, etc.) for Phase 02 — a text stat is sufficient and in scope.

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| `window.document.addEventListener('visibilitychange')` | `App.addListener('appStateChange')` | Reliable on iOS in Capacitor; DOM events are unreliable in WKWebView |
| React Router params for detail view | Sheet/drawer overlay | Mobile-native pattern; preserves scroll position in background list |
| Manual loading state booleans | TanStack Query `isPending` from `useMutation` | Consistent, race-condition-safe loading states |

---

## Open Questions

1. **Should `call_events` have a realtime subscription?**
   - What we know: Phase 02 analytics are per-user, not team-shared in real time
   - What's unclear: Whether salgssjef needs to see team calls appear in real time
   - Recommendation: Skip realtime for call_events in Phase 02 — query on demand is sufficient. Add realtime in a later phase when the analytics page is built.

2. **Should the Sheet use `side="bottom"` always, or be responsive (bottom on mobile, right on desktop)?**
   - What we know: shadcn Sheet supports both; the `side` prop is a string
   - What's unclear: Whether any desktop users exist in Phase 02
   - Recommendation: Use `side="bottom"` always for Phase 02 since this is a mobile-first companion app. The spec shows desktop as side-panel but out-of-scope detail.

3. **Supabase types regeneration workflow**
   - What we know: `supabase.ts` is currently hand-written
   - What's unclear: Whether the Supabase CLI is set up for type generation
   - Recommendation: Continue hand-writing types for Phase 02. Add call_events types manually after running the migration SQL.

---

## Sources

### Primary (HIGH confidence)
- https://capacitorjs.com/docs/apis/app — `appStateChange` event, `addListener` signature, `AppState` interface
- https://ui.shadcn.com/docs/components/sheet — Sheet component API, `side` prop, sub-components
- https://tanstack.com/query/v5/docs/framework/react/guides/mutations — `useMutation` options, `onSuccess` invalidation pattern
- https://supabase.com/docs/reference/javascript/update — `.update()` method API
- https://supabase.com/docs/reference/javascript/insert — `.insert()` method API

### Secondary (MEDIUM confidence)
- https://github.com/shadcn-ui/ui/discussions/1601 — Community pattern for responsive Sheet (bottom mobile, right desktop)
- https://ionic.io/blog/take-control-of-your-capacitor-app-state — Capacitor app state patterns

### Tertiary (LOW confidence — flagged for validation)
- `appStateChange` fires immediately on mount behavior: observed in community issues (ionic-team/capacitor#2178), not documented officially. Validate by testing on device.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages already installed, versions confirmed in package.json
- Architecture patterns: HIGH — Capacitor App API and shadcn Sheet API verified via official docs
- Database schema: HIGH — follows same pattern as existing schema.sql
- Pitfalls: MEDIUM — appStateChange initial-fire behavior is LOW (community reports only); all others HIGH
- Analytics: HIGH — simple stat, no new library needed

**Research date:** 2026-04-03
**Valid until:** 2026-05-03 (stable libraries; Capacitor 8 and shadcn patterns unlikely to change)
