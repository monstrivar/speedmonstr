# Monstr Companion App — Roadmap

## Milestone 1: Working Companion App

### Phase 01: Foundation + Push Notifications
**Goal:** A business owner's phone goes BING when a lead arrives.
**Plans:** 5 plans

Plans:
- [ ] 01-01-PLAN.md — Scaffold app/ with Vite + React 19 + TS + Tailwind v4 + shadcn/ui + Capacitor
- [ ] 01-02-PLAN.md — Supabase client, auth hook, i18n, types, and database schema SQL
- [ ] 01-03-PLAN.md — Login page, dashboard with realtime lead feed, mobile-first UI
- [ ] 01-04-PLAN.md — Push notification pipeline (Capacitor registration + APNs Edge Function)
- [ ] 01-05-PLAN.md — Wire push into app, Capacitor iOS build, Xcode verification

### Phase 02: Lead Management + Call Tracking
**Goal:** Team members can manage leads and we track their response times.
- Lead detail view with full timeline
- Click-to-call with automatic call tracking
- "Did you follow up?" prompt on app resume
- Follow-up actions (mark as followed up, add note, not relevant)
- Response time analytics (time from notification to call)

### Phase 03: SMS Log + Escalation System
**Goal:** Full visibility into SMS activity and automatic escalation when leads are ignored.
- SMS log page with delivery status from Twilio
- Escalation logic (Supabase Edge Function / cron)
- Escalation push + SMS to manager at threshold 1
- Escalation push + SMS to admin at threshold 2
- Work hours configuration

### Phase 04: Analytics + Admin
**Goal:** Business owners see ROI and can manage their team.
- Lead source analytics (bar/donut chart)
- Department performance view
- Team management (add/remove members, assign roles)
- Routing rules (keywords → department)
- SMS template editor per department
- Escalation settings UI

### Phase 05: App Store + Polish
**Goal:** Listed in Apple App Store, production-ready.
- Custom notification sounds (4 built-in options)
- Notification sound picker in settings
- App Store assets (screenshots, description, privacy policy)
- App Store submission and review
- PWA fallback for web users
- Dark mode (optional)
