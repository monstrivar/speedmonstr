# Agentik — operasjonshåndbok

Daglig drift av plattformen. Hvordan onboarder vi en ny partner, hvordan logger vi aktivitet, hvordan håndterer vi feil. Holdes kort. Detaljer i andre dokumenter.

## Hovedflyt — fra "ja" til levende dashbord

```
Møte: kunden sier ja
   ↓
Admin → /admin/ny-partner
   ↓ (lim inn e-post)
Attio-oppslag eller manuell utfylling
   ↓
"Opprett onboarding" → får lenke
   ↓
Send lenke via mail-knapp (forhåndsutfylt)
   ↓
Kunde fyller ut intake (5–8 min)
   ↓ (POST /api/agentik-onboarding/[token])
Auto: partner-rad opprettet + nøkkelpersoner + start-tasks + første aktivitet
   ↓
Vi får Slack-varsel
   ↓
Kunde får link til /partner/[slug] når Slack-kanal er oppe (vi sender den)
   ↓
Sprint starter — vi logger aktivitet løpende
```

## Hvor du gjør hva

| Hva | Hvor |
|---|---|
| Liste alle partnere | `/admin` |
| Onboarde ny | `/admin/ny-partner` |
| Endre status, dato, pris, brand | `/admin/partner/[slug]` → Oversikt |
| Legge til AI-løsning i pipelinen | `/admin/partner/[slug]` → Pipeline |
| Marker oppgave ferdig | `/admin/partner/[slug]` → Oppgaver |
| Logg ROI-måling | `/admin/partner/[slug]` → Verdi |
| Logg aktivitet manuelt (alt mulig) | `/admin/partner/[slug]` → Aktivitet |
| Rask aktivitet fra Slack | `/partner [slug] [melding]` |
| Legge til nøkkelperson | `/admin/partner/[slug]` → Team |
| Booke møte | `/admin/partner/[slug]` → Møter |
| Se kundens dashbord | "Vis kunde-side" knappen i admin |

## Auto-loggede hendelser (du trenger ikke logge selv)

Disse skapes automatisk i Aktivitet-feeden når du gjør disse handlingene i admin:

- **Lagt til AI-løsning** → "Ny AI-løsning i pipeline: <tittel>"
- **AI-løsning → Bygges** → "Bygging startet: <tittel>"
- **AI-løsning → Live** → "<tittel> er live" + årlig verdi hvis satt
- **Møte med dato i fremtiden** → "Møte planlagt: <tittel>"
- **Partner-status onboarding → sprint** → "90-dagers Sprint startet"
- **Partner-status sprint → drift** → "Sprint fullført — over i drift"
- **Partner-status → pause/avsluttet** → tilsvarende melding
- **Onboarding-skjema fullført** → "Onboarding-skjema fullført — Sprint starter"

For ALT annet av interesse — konkrete leveranser, oppdaterte tall, innsikt fra møter — bruk **Aktivitet-fanen i admin** eller **`/partner [slug] ...` i Slack** (sistnevnte polisher meldingen via OpenAI før innsending).

## Slack `/partner`-kommandoen

```
/partner demo Workshop med ledergruppen i dag — fant 3 prosesser å automatisere
```

→ OpenAI gjør om til konsist norsk → vises i Demo Bedrift sin Aktivitet-feed innen 2 sekunder.

Krever at Slack-app er konfigurert med `SLACK_SIGNING_SECRET` env-var. Ikke aktivt før du har gjort den oppsetten (se docs/security/SETUP-CHECKLIST.md).

## Når noe ser rart ut

| Symptom | Hva å sjekke |
|---|---|
| `/admin` viser "Du har ikke admin-tilgang" | E-posten din er ikke i `ADMIN_EMAILS` env (eller `VITE_ADMIN_EMAILS` på klienten). Default: ivar@agentik.no, ole@agentik.no, ivar@monstr.no |
| Kunde får "Ingen tilgang ennå" | Kundens e-post er ikke i `partner_people.epost` for noen partner. Legg dem til via `/admin/partner/[slug]` → Team |
| Magic link kommer ikke | Sjekk Supabase auth-logs (Dashboard → Authentication → Users), redirect URL whitelist |
| Dashbord laster ikke | Sjekk Vercel function-logs for `/api/agentik-partner/[slug]`. RLS, env vars, eller spørringsfeil |
| Onboarding-lenke gir 404 | Token finnes ikke i `onboardings`-tabellen, eller status er allerede 'completed' |
| n8n SUBMIT skaper duplikate Notion-rader | Ikke lenger et problem — endpoint forwarder kun ved første submission (status='initiated') |

## Sikkerhet

- Auth: Supabase magic-link → passord etter første login
- Admin-emails: definert i env, sjekkes server-side ved hver admin-spørring
- API-endepunkter: alle admin-rutes verifiserer JWT + admin-rolle. Kunde-ruter verifiserer JWT + at e-post matcher `partner_people` for slug
- Slack-kommando: HMAC-signatur verifiseres mot `SLACK_SIGNING_SECRET`
- Onboarding-init: beskyttet av `ONBOARDING_INIT_SECRET` shared secret
- Dataservice: anon-keyen er i klient-bundlen, men har ingen leserettigheter når RLS-lockdown er kjørt (se `docs/security/RLS-LOCKDOWN.md`)

## Deploy

`git push` til main → Vercel deployer automatisk. Vercel-funksjoner har 300s timeout (mer enn nok for våre formål).

For Preview-deploys: alle env-vars må også settes for "Preview" i Vercel dashboard.

## Liste over backlog-items

Se TaskList eller `.task-cache.json`. De viktigste:

- **Slack-app oppsett** — registrere `/partner` slash command (etter SLACK_SIGNING_SECRET er satt)
- **PandaDoc eller Signere.no** — kontraktsignering før onboarding-skjema (din valg)
- **Fiken API** — månedlig fakturering (når første betalende kunde)
- **Fireflies-integrasjon** — møtetranskripter under hvert møte i `/partner` (langt frem i tid)

## Backup-strategi

Supabase tar daglige backups (Pro plan og oppover). For ekstra trygghet: legg til en cron som eksporterer `partners` + `partner_*` til JSON i Vercel Blob storage månedlig. Ikke bygd ennå.
