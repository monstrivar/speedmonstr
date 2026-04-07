# Monstr Companion App — Scope

> Komplett scope for app.monstr.no — companion-appen som kundene bruker daglig.
> Bygger videre på DASHBOARD-SPEC.md med fokus på: push-varsler, click-to-call, mobilopplevelse, og PWA.

---

## Konsept

Companion-appen er **det daglige verktøyet** for Monstr-kunder. Mens landingssiden (monstr.no) selger produktet, er companion-appen produktet. Den lever på app.monstr.no og installeres som PWA på telefonen.

**Hovedoppgave:** Gi umiddelbar varsling når en ny lead kommer inn, og gjøre det så enkelt som mulig å ringe kunden tilbake — rett fra varselet.

---

## Prosjektstruktur

Appen lever i samme repo som landingssiden, under en egen mappe:

```
speedmonstr/
├── src/                  ← Landingsside (monstr.no)
├── app/                  ← Companion-app (app.monstr.no)
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── components/
│   │   │   ├── Layout.jsx          (sidebar + mobile nav)
│   │   │   ├── LeadCard.jsx        (lead i feedet)
│   │   │   ├── LeadDetail.jsx      (slide-over panel)
│   │   │   ├── StatCard.jsx        (nøkkeltall-kort)
│   │   │   ├── NotificationBell.jsx
│   │   │   └── CallButton.jsx      (click-to-call)
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       (oversikt)
│   │   │   ├── Leads.jsx           (full lead-liste)
│   │   │   ├── LeadSources.jsx     (analytics)
│   │   │   ├── Departments.jsx     (avdelingsytelse)
│   │   │   ├── SmsLog.jsx          (SMS-logg)
│   │   │   ├── Settings.jsx        (innstillinger)
│   │   │   └── Login.jsx           (magic link)
│   │   ├── hooks/
│   │   │   ├── useLeads.js         (Supabase realtime)
│   │   │   ├── useNotifications.js (push + service worker)
│   │   │   └── useAuth.js          (Supabase auth)
│   │   ├── lib/
│   │   │   ├── supabase.js
│   │   │   └── notifications.js
│   │   └── sw.js                   (service worker)
│   ├── index.html
│   ├── manifest.json               (PWA manifest)
│   └── vite.config.js
├── api/                  ← Delte API-funksjoner (Vercel)
├── public/               ← Landingsside assets
├── vercel.json           ← Routing: app.monstr.no → /app, monstr.no → /
└── package.json          ← Delt (monorepo-light)
```

### Vercel-routing

```json
// vercel.json — forenklet konsept
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/app/index.html", "has": [{ "type": "host", "value": "app.monstr.no" }] },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Alternativt: to separate Vite builds i samme repo med separate `vite.config.js`.

---

## Kjernefunksjoner

### 1. Push-varsler (hovedfunksjonen)

**Flyten:**
```
Ny lead inn via webhook
        ↓
API lagrer i Supabase
        ↓
Supabase trigger / edge function
        ↓
Web Push API sender varsling til alle
relevante teammedlemmer
        ↓
📱 BING BING!
┌─────────────────────────────────┐
│ 🔴 Monstr                       │
│ Ny henvendelse: Ola Nordmann    │
│ "Vannlekkasje i kjelleren"      │
│                                  │
│  [Ring opp]     [Se detaljer]   │
└─────────────────────────────────┘
```

**Push-varselet inneholder:**
- Kundens navn
- Kort beskrivelse av henvendelsen (trunkert til ~60 tegn)
- Kilde (nettskjema, Meta, Google Ads)
- **To handlingsknapper:**
  - **"Ring opp"** → åpner telefonappen direkte med kundens nummer
  - **"Se detaljer"** → åpner companion-appen på leadets detaljside

**Teknisk implementering:**
- **Web Push API** + **Service Worker** (fungerer på Android, desktop, og iOS 16.4+)
- Push-abonnement lagres i Supabase (`push_subscriptions`-tabell)
- Backend sender push via **web-push** npm-pakke (VAPID-nøkler)
- Supabase Edge Function som trigger på nye rader i `leads`-tabellen
- Fallback: SMS-varsling (Twilio) for brukere som ikke har installert PWA

**Varslingsregler (konfigurerbare):**
- Teammedlemmer: Varsles kun om leads routed til sin avdeling
- Salgssjef: Varsles om alle leads + eskaleringer
- Admin: Varsles om eskaleringer
- Stille timer: Ingen push mellom f.eks. 22:00-07:00 (leads samles opp)

### 2. Click-to-call + automatisk call tracking

**Det viktigste etter varslingen.** Når en håndverker ser at en ny lead har kommet inn, skal det ta maks 2 trykk å ringe kunden.

**Implementering:**
- `<a href="tel:+4799887766">` — fungerer på alle mobiler og i Capacitor native
- Telefonnummeret vises stort og tydelig på lead-kortet
- Etter at samtalen er avsluttet og brukeren kommer tilbake til appen: prompt "Fulgt opp?" med én stor knapp

**I lead-feedet:**
```
┌──────────────────────────────────────┐
│ 🔴  Ola Nordmann          14:32     │
│     Vannlekkasje i kjelleren         │
│     Rørlegger · nettskjema           │
│                                      │
│     📞 +47 912 34 567        [Ring]  │
└──────────────────────────────────────┘
```

**I lead-detaljvisningen:**
- Stort "Ring opp"-knapp øverst (accent-farge, full bredde på mobil)
- Nummer er klikkbart overalt det vises

#### Call tracking — automatisk oppfølgingsmåling

Når en bruker trykker "Ring" registrerer vi det som en `call_initiated`-event. Dette gir oss verdifull data **uten at brukeren trenger å gjøre noe manuelt**:

**Hva vi måler:**
- **Tid fra varsling til ring:** Push-varsling kl 14:32, bruker trykker "Ring" kl 14:35 → 3 min responstid
- **Tid fra lead inn til ring:** Lead mottatt 14:32, ringt 14:35 → 3 min total oppfølgingstid
- **Ring-rate:** Hvor mange leads blir faktisk ringt vs. ignorert
- **Ring per bruker:** Hvem i teamet er raskest/mest aktiv
- **Tid på dagen:** Når er teamet mest responsivt

**Automatisk "fulgt opp"-logikk:**
1. Bruker trykker "Ring" → `call_initiated`-event logges med timestamp
2. Appen går i bakgrunnen (telefonappen åpner)
3. Bruker kommer tilbake til appen etter samtalen
4. Appen viser prompt: **"Snakket du med Ola?"**
   - **[Ja, fulgt opp]** → markerer som fulgt opp, stopper eskaleringstimer
   - **[Ikke svar]** → logger forsøk, holder lead åpen, kan prøve igjen
   - **[Legg til notat]** → åpner notatfelt ("Avtalt befaring torsdag 10:00")

**Dette gir oss analytics som kundene elsker:**
```
┌────────────────────────────────────────────┐
│  Oppfølgingsanalyse — April 2026           │
│                                            │
│  Snitt tid fra varsel til ring:  4 min     │
│  Snitt tid fra lead inn til ring: 4.5 min  │
│  Ring-rate:  87% (av leads med tlf.nr)     │
│  Første forsøk-suksess: 62%               │
│                                            │
│  Raskeste team: Rørlegger (3 min snitt)    │
│  Tregeste team: Tømrer (12 min snitt)      │
│                                            │
│  Per person:                               │
│  Per Olsen:     2.1 min snitt  (43 leads)  │
│  Kari Sansen:   5.3 min snitt  (38 leads)  │
│  Erik Nordmann: 8.7 min snitt  (22 leads)  │
└────────────────────────────────────────────┘
```

**Ny tabell: `call_events`**
```
id              uuid PK
lead_id         uuid FK → leads
user_id         uuid FK → users
initiated_at    timestamptz     (når "Ring" ble trykket)
returned_at     timestamptz     (når bruker kom tilbake til appen)
outcome         text            "answered" | "no_answer" | "voicemail" | "cancelled"
duration_sec    integer         (estimert — tid mellom initiated og returned)
note            text            (valgfritt notat etter samtale)
created_at      timestamptz
```

### 3. SMS-logg

**Ny side som ikke er i DASHBOARD-SPEC.md.** Kundene vil se hva som faktisk har blitt sendt ut.

**Innhold:**
```
┌────────────────────────────────────────────────────────┐
│  SMS-logg                          April 2026  ▼       │
│                                                        │
│  I dag: 8 SMS sendt                                    │
│  Denne måneden: 124 SMS sendt                          │
│  Estimert kostnad denne mnd: 186 kr                    │
│                                                        │
│  ────────────────────────────────────────────────       │
│                                                        │
│  14:32  → Ola Nordmann (+47 912 34 567)                │
│  "Hei Ola! Vi har mottatt henvendelsen din om          │
│   vannlekkasjen. En av våre rørleggere tar kontakt     │
│   med deg snart. — Sansen Rør AS"                      │
│  Status: ✅ Levert                                      │
│                                                        │
│  13:15  → Kari Hansen (+47 987 65 432)                 │
│  "Hei Kari! Takk for henvendelsen om nytt bad.         │
│   Vi tar kontakt i løpet av kort tid. — Sansen Rør"    │
│  Status: ✅ Levert                                      │
│                                                        │
│  11:48  → Erik Johansen (+47 456 78 901)               │
│  "Hei Erik! Vi ser på henvendelsen din om              │
│   sikringsskapet. — Sansen Elektro"                    │
│  Status: ⚠️ Ikke levert (ugyldig nummer)               │
└────────────────────────────────────────────────────────┘
```

**Funksjoner:**
- Kronologisk liste over alle sendte SMS-er
- Full meldingstekst synlig
- Leveringsstatus fra Twilio (levert, feilet, venter)
- Filtrering per avdeling, per måned
- Kostnadsoversikt (antall SMS × snittpris)
- Eskalerings-SMS-er vises også (merket med ⚠️-ikon)

**Datakilde:** Twilio webhook for leveringsstatus → lagres i `sms_log`-tabell i Supabase

### 4. Dashboard (oversikt)

Som spesifisert i DASHBOARD-SPEC.md, men tilpasset mobil:

**Nøkkeltall-kort (2×2 grid på mobil):**
- Leads i dag
- Snitt responstid
- Leads denne mnd
- Venter på oppfølging (med varseltall)

**Lead-feed:** Sanntids, scrollbar liste. Hvert kort har:
- Statusfarge (🔴🟡✅⚪)
- Navn + kort beskrivelse
- Avdeling + kilde
- Tidsstempel
- Telefonnummer med ring-knapp
- Tap → åpner detalj-panel

**Trendgraf:** Leads per dag siste 30 dager (enkel sparkline)

### 5. Lead-detalj (slide-over)

Åpner fra høyre (desktop) eller som fullskjerm (mobil):

```
┌──────────────────────────────────────┐
│  ← Tilbake                           │
│                                      │
│  Ola Nordmann                        │
│  📱 +47 912 34 567                   │
│  📧 ola@nordmann.no                  │
│  🏢 Nordmann Bygg AS                 │
│  📍 monstr.no skjema                 │
│  🏷️ Rørlegger (auto)                 │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  📞  RING OPP                │    │
│  └──────────────────────────────┘    │
│                                      │
│  "Vi har en vannlekkasje i           │
│   kjelleren som trenger umiddelbar   │
│   utbedring. Huset er fra 1972."     │
│                                      │
│  ── Tidslinje ──────────────────     │
│  14:32  Lead mottatt                 │
│  14:32  SMS sendt ✅                  │
│  14:33  Varsel sendt til Rørlegger   │
│  16:45  ⚠️ Eskalert til salgssjef    │
│  17:02  Fulgt opp av Per             │
│  17:02  📝 "Avtalt befaring torsdag" │
│                                      │
│  ┌────────┐┌────────┐┌────────────┐  │
│  │✅ Fulgt ││📝 Notat││❌ Ikke rel. │  │
│  │  opp   ││        ││            │  │
│  └────────┘└────────┘└────────────┘  │
└──────────────────────────────────────┘
```

### 6. Analytics (leadkilder)

Enkel oversikt — ingen overkomplisering:

- Søylediagram: Leads per kilde denne måneden
- Prosentfordeling
- Trend vs. forrige måned (↑ +12% fra nettskjema)
- Filtrering per tidsperiode (uke/måned/kvartal)

### 7. Avdelingsytelse

For salgssjef og admin:
- Leads per avdeling
- Oppfølgingsrate (%)
- Snitt oppfølgingstid
- Antall eskaleringer
- "Verste" avdeling uthevet (som motivasjon for forbedring)

---

## Distribusjon — Web + App Store + Google Play

### Strategi: Bygg én gang, distribuer overalt

Vi bygger appen som en **React web-app** og bruker **Capacitor** til å wrappe den som native app for App Store og Google Play. Samme kodebase, tre distribusjonskanaler.

```
React + Vite (én kodebase)
        │
        ├── app.monstr.no (web — direkte tilgang)
        │
        ├── Capacitor → iOS → App Store
        │
        └── Capacitor → Android → Google Play
```

### Hvorfor Capacitor?

| | PWA alene | Capacitor (vår tilnærming) |
|---|---|---|
| **App Store-listing** | Nei | Ja — ekte native app |
| **Opplevd profesjonalitet** | "Legg til på hjemskjerm" | "Last ned fra App Store" |
| **Push-varsler** | Ustabilt på iOS | Full native push via APNs/FCM |
| **Kodebase** | Én (web) | Én (web) — Capacitor wrapper |
| **Tilgang til native API-er** | Begrenset | Fullt — kamera, haptics, kontakter |
| **Oppdateringer** | Umiddelbart | Umiddelbart for web-laget, App Store review kun for native endringer |
| **Kostnad** | $0 | $99/år Apple + $25 engangs Google |

**Capacitor er riktig valg fordi:**
- Det er det React-native teamet hos Ionic vedlikeholder — modent og stabilt
- All forretningslogikk er web — Capacitor legger kun til native shell
- Vi kan live-oppdatere app-innholdet uten App Store review (via Capgo eller lignende)
- Appen føles 100% native: push, haptics, splash screen, app-ikon
- Samme utvikler (deg) kan bygge alt — ingen Swift/Kotlin nødvendig

### Native-spesifikke funksjoner (via Capacitor plugins)

| Plugin | Hva det gir oss |
|--------|-----------------|
| **@capacitor/push-notifications** | Native push via APNs (iOS) og FCM (Android) — pålitelig, aldri blokkert |
| **@capacitor/haptics** | Vibrasjonsfeedback: kort buzz ved ny lead, kraftig buzz ved eskalering |
| **@capacitor/app** | Detekterer app resume (bruker tilbake etter telefonsamtale → vis "Fulgt opp?") |
| **@capacitor/splash-screen** | Monstr splash ved oppstart |
| **@capacitor/status-bar** | Kontroll over statusbar-farge (mørk/lys) |
| **@capacitor/badge** | Badge-tall på app-ikonet: "3" ubesvarte leads |

### Push-varsler (native)

Med Capacitor bruker vi **ekte native push** i stedet for Web Push:

**iOS:** Apple Push Notification Service (APNs)
**Android:** Firebase Cloud Messaging (FCM)

Fordeler over Web Push:
- Fungerer alltid — ingen "tillat varsler i nettleser"-problem
- Vises i Notification Center som alle andre apper
- Støtter **handlingsknapper** direkte i varselet
- Støtter **egendefinerte varslingslyder**
- Badge-oppdatering på app-ikonet

**Flyt:**
```
Ny lead → Supabase Edge Function → Firebase/APNs → Telefon

📱 Varsling:
┌─────────────────────────────────────┐
│ 🔴 Monstr                   nå     │
│ Ny henvendelse fra Ola Nordmann     │
│ "Vannlekkasje i kjelleren"          │
│                                     │
│   [📞 Ring opp]    [👁 Se detaljer] │
└─────────────────────────────────────┘
```

### Egendefinerte varslingslyeder

Brukerne kan velge sin egen varslingslyd for Monstr. Dette er **overraskende viktig** — det gjør at de gjenkjenner en Monstr-varsling umiddelbart uten å se på telefonen.

**Innebygde lyder (levert med appen):**
- **"Monstr Alert"** (standard) — kort, distinkt, profesjonell
- **"Urgent"** — skarpere, for eskaleringer
- **"Soft Ping"** — diskret, for rolige kontormiljøer
- **"Construction"** — kraftig, for bråkete byggeplasser (faktisk nyttig for målgruppen)

**Implementering:**
- Lydfiler leveres som `.caf` (iOS) og `.mp3` (Android) i native asset-bundles
- Valgt lyd lagres i `notification_preferences`-tabellen
- Capacitor Push plugin støtter custom sound per notification channel
- Eskaleringsvarsler kan ha egen lyd (hardere/mer insisterende)

**I innstillinger:**
```
┌──────────────────────────────────────┐
│  Varslingsinnstillinger              │
│                                      │
│  Varslingslyd for nye leads:         │
│  ┌──────────────────────────────┐    │
│  │ 🔊 Monstr Alert    ▶ [test] │    │
│  │ 🔊 Urgent          ▶ [test] │    │
│  │ 🔊 Soft Ping       ▶ [test] │    │
│  │ 🔊 Construction    ▶ [test] │    │
│  └──────────────────────────────┘    │
│                                      │
│  Varslingslyd for eskaleringer:      │
│  ┌──────────────────────────────┐    │
│  │ 🔊 Urgent          ▶ [test] │    │
│  └──────────────────────────────┘    │
│                                      │
│  Stille timer:                       │
│  22:00 — 07:00                       │
└──────────────────────────────────────┘
```

### App Store-krav

**For Apple App Store:**
- Apple Developer Account ($99/år)
- App Review retningslinjer: appen vår er B2B-verktøy, uproblematisk
- Splash screen + app-ikon i alle størrelser (Capacitor genererer fra én master-fil)
- Privacy Policy (vi har allerede DATABEHANDLERAVTALE.md — utvid til engelsk)
- App Store Connect listing: screenshots, beskrivelse, nøkkelord

**For Google Play:**
- Google Play Developer Account ($25 engangs)
- Enklere review-prosess enn Apple
- Samme assets som iOS (screenshots, beskrivelse)

**App Store listing:**
```
Monstr — Speed-to-Lead

Få umiddelbar varsling når en ny kundehenvendelse kommer inn.
Ring opp kunden direkte fra appen. Aldri tap en lead igjen.

Kategorier: Business, Productivity
Pris: Gratis (krever Monstr-abonnement)
```

### PWA som fallback

Web-versjonen (app.monstr.no) fungerer fortsatt som fullverdig PWA:
- For desktop-brukere (salgssjef/admin som jobber fra PC)
- For brukere som ikke vil laste ned appen
- Som onboarding-steg: "Prøv i nettleseren, last ned appen når du er klar"

**PWA manifest.json:**
```json
{
  "name": "Monstr",
  "short_name": "Monstr",
  "description": "Speed-to-lead companion",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#111111",
  "theme_color": "#E63B2E",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

**Service Worker:**
- Cache-first for statiske assets
- Network-first for API-kall
- Push event handler (Web Push som fallback for native push)
- Background sync for offline-handlinger

---

## Datamodell (utvidelse av DASHBOARD-SPEC)

I tillegg til tabellene fra DASHBOARD-SPEC.md:

### Nye tabeller

**push_subscriptions**
```
id                uuid PK
user_id           uuid FK → users
endpoint          text        (Web Push endpoint URL)
keys_p256dh       text        (krypteringsnøkkel)
keys_auth         text        (auth secret)
device_info       text        ("Chrome Android", "Safari iOS")
active            boolean     default true
created_at        timestamptz
```

**sms_log**
```
id                uuid PK
organization_id   uuid FK → organizations
lead_id           uuid FK → leads (nullable — for eskaleringer)
recipient_phone   text
recipient_name    text
message_text      text        (full SMS-tekst)
sender_id         text        ("Sansen Rør", "Sansen Elektro")
sms_type          text        "auto_response" | "escalation" | "follow_up_sequence"
twilio_sid        text        (Twilio message SID)
status            text        "queued" | "sent" | "delivered" | "failed" | "undelivered"
status_updated_at timestamptz
cost_nok          decimal     (estimert kostnad i NOK)
created_at        timestamptz
```

**notification_preferences**
```
id                uuid PK
user_id           uuid FK → users
push_enabled      boolean     default true
push_new_leads    boolean     default true
push_escalations  boolean     default true
quiet_start       time        "22:00"
quiet_end         time        "07:00"
created_at        timestamptz
```

---

## Eskaleringssystem — utvidet for push

Oppdatert flyt med push-varsler:

```
Lead inn
  ↓
Push-varsling til teammedlemmer i riktig avdeling
  "🔔 Ny henvendelse: Ola Nordmann — Vannlekkasje"
  [Ring opp] [Se detaljer]
  ↓
2 timer uten "fulgt opp"
  ↓
Push + SMS til salgssjef
  "⚠️ Ola Nordmann har ventet 2 timer uten oppfølging"
  ↓
4 timer uten "fulgt opp"
  ↓
Push + SMS til admin/daglig leder
  "🚨 KRITISK: Lead har ventet 4 timer"
```

---

## Tech Stack

| Teknologi | Rolle | Hvorfor |
|-----------|-------|---------|
| **React 19** | UI | Konsistent med landingsside |
| **Vite** | Bundler | Konsistent, rask |
| **Tailwind CSS** | Styling | Konsistent, mobile-first |
| **Supabase** | Database + Auth + Realtime | Alt-i-ett, gratis tier er nok for MVP |
| **Supabase Auth** | Magic link login | Enkelt for håndverkere |
| **Supabase Realtime** | Live lead-feed | Sanntidsoppdateringer uten polling |
| **Supabase Edge Functions** | Push-sending, eskalering | Serverless, trigger på DB-endringer |
| **Web Push API** | Push-varsler | Gratis, fungerer på alle plattformer |
| **web-push** (npm) | Push fra server | VAPID-basert, ingen tredjepartstjeneste |
| **Twilio** | SMS-sending + status | Eksisterende integrasjon |
| **Recharts / Chart.js** | Grafer | Lettvekt, enkel |
| **Vercel** | Hosting | Eksisterende, automatisk deploy |
| **vite-plugin-pwa** | PWA-generering | Automatisk SW + manifest |
| **Capacitor** | Native wrapper | iOS + Android fra samme kodebase |
| **@capacitor/push-notifications** | Native push | APNs (iOS) + FCM (Android) |
| **@capacitor/haptics** | Vibrasjon | Taktil feedback ved varsler og handlinger |
| **@capacitor/app** | App lifecycle | Detekterer resume etter samtale |
| **Firebase Cloud Messaging** | Android push | Gratis, pålitelig |

---

## Autentisering

**Magic link (e-post):**
1. Bruker skriver inn e-post på login-siden
2. Supabase sender e-post med magic link
3. Klikk → innlogget, session varer 30 dager
4. Ingen passord å huske (kritisk for målgruppen)

**Tilgangskontroll (RLS):**
- Alle queries filtreres automatisk på `organization_id`
- Teammedlemmer ser kun leads i sin avdeling
- Salgssjef/admin ser alt i sin organisasjon
- Ingen kryssorganisasjon-tilgang mulig

---

## Mobilopplevelse (prioritet #1)

Håndverkere bruker telefon, ikke PC. Appen må føles naturlig på mobil.

### Navigasjon på mobil
- **Bunn-tab-bar** (ikke hamburger-meny):
  ```
  ┌────────────────────────────────────┐
  │                                    │
  │         (innhold)                  │
  │                                    │
  ├──────┬──────┬──────┬──────┬──────┤
  │  🏠  │  📋  │  📱  │  📊  │  ⚙️  │
  │ Hjem │Leads │ SMS  │Stats │ Mer  │
  └──────┴──────┴──────┴──────┴──────┘
  ```
- Store treffområder (min 44×44px)
- Swipe-gester: swipe lead-kort til venstre → "Fulgt opp"

### Viktige mobilhensyn
- **Ring-knappen** er alltid synlig og stor (min 48px høy, full bredde)
- **Pull-to-refresh** på lead-feedet
- **Haptic feedback** på viktige handlinger (fulgt opp, eskalering)
- **Offline-indikator** tydelig synlig
- **Mørk modus** (valgfritt — håndverkere i felt med skarp sol)

---

## Onboarding-flyt

### Ny bruker (invitert av admin)

```
Magic link e-post
    ↓
"Velkommen til Monstr, Per!"
"Du er lagt til i Sansen Rør AS, avdeling Rørlegger."
    ↓
"Vil du motta varsler når nye henvendelser kommer inn?"
    [Ja, aktiver varsler]  ← ber om push-tillatelse
    ↓
"Installer Monstr på telefonen for best opplevelse"
    [Legg til på hjemskjerm]  ← PWA install prompt
    ↓
Dashboard — "Du er klar! Første henvendelse dukker opp her."
```

### Ny organisasjon (admin)

```
Magic link e-post
    ↓
Onboarding-wizard (4 steg):
1. Avdelinger (rørlegger, elektriker, etc.)
2. Teammedlemmer (navn + e-post per avdeling)
3. SMS-avsender per avdeling
4. Eskaleringsgrense (standard 2 timer)
    ↓
"Alt er klart! Del disse instruksjonene med teamet."
    ↓
Dashboard — tomt, men med testknapp:
    [Send test-lead] → simulerer en henvendelse gjennom hele flyten
```

---

## Sider — oppsummering

| Side | Hvem ser den | Beskrivelse |
|------|-------------|-------------|
| **Login** | Alle | Magic link, minimalistisk |
| **Dashboard** | Alle | Nøkkeltall + sanntids lead-feed |
| **Leads** | Alle | Full liste, filtrering, søk |
| **Lead-detalj** | Alle | Kontaktinfo, tidslinje, ring-knapp, handlinger |
| **SMS-logg** | Salgssjef + Admin | Alle sendte SMS-er med status og kostnad |
| **Leadkilder** | Salgssjef + Admin | Analytics per kilde |
| **Avdelinger** | Salgssjef + Admin | Ytelse per avdeling |
| **Innstillinger** | Admin | Team, routing, SMS-maler, eskalering |
| **Profil** | Alle | Varslingspreferanser, quiet hours |

---

## Hva vi IKKE bygger i v1

- ❌ To-veis SMS-chat i appen (kommer i v2)
- ❌ Kalenderintegrasjon / booking
- ❌ Fakturering / betaling
- ❌ PDF-rapporteksport
- ❌ AI-chat / copilot i dashboardet
- ❌ Kundeportal (kundene ser ikke dashboardet)
- ❌ Flerorganisasjons-switching (1 bruker = 1 org i v1)
- ❌ Webhook-builder / integrasjonsmarkedsplass

---

## MVP-sjekkpunktliste

### Infrastruktur
- [ ] Supabase-prosjekt oppsatt med alle tabeller (inkl. nye)
- [ ] RLS-policies for alle tabeller
- [ ] Supabase Auth med magic link konfigurert
- [ ] Vercel-routing for app.monstr.no subdomain
- [ ] VAPID-nøkler generert for Web Push
- [ ] Twilio webhook for SMS-leveringsstatus

### Autentisering
- [ ] Login-side med magic link
- [ ] Session-håndtering (30 dager)
- [ ] Rolle-basert tilgang (admin/salgssjef/teammedlem)

### Kjernefunksjoner
- [ ] Dashboard med nøkkeltall (4 kort)
- [ ] Sanntids lead-feed (Supabase Realtime)
- [ ] Lead-detaljvisning med tidslinje
- [ ] Click-to-call (`tel:` lenker)
- [ ] "Fulgt opp"-knapp som stopper eskaleringstimer
- [ ] Notatfelt på leads
- [ ] Push-varsler ved nye leads
- [ ] Push-varsler ved eskalering
- [ ] SMS-loggside med leveringsstatus

### Eskalering
- [ ] Supabase Edge Function/cron som sjekker ubesvarte leads
- [ ] Push + SMS ved 1. eskaleringsgrense
- [ ] Push + SMS ved 2. eskaleringsgrense
- [ ] Respekt for arbeidstider

### Analytics
- [ ] Leadkilder per måned (søylediagram)
- [ ] Avdelingsytelse (tabell)
- [ ] SMS-kostnadsoversikt

### Admin
- [ ] Teammedlem-håndtering (legg til / fjern)
- [ ] Routing-regler (nøkkelord → avdeling)
- [ ] SMS-mal-redigering per avdeling
- [ ] Eskaleringsinnstillinger

### PWA (web fallback)
- [ ] Service worker med caching
- [ ] manifest.json med ikoner
- [ ] Offline-indikator

### Native app (Capacitor)
- [ ] Capacitor-prosjekt initialisert
- [ ] iOS-prosjekt generert og testet i Xcode
- [ ] Android-prosjekt generert og testet
- [ ] Native push-varsler (APNs + FCM)
- [ ] Egendefinerte varslingslyeder (4 innebygde)
- [ ] Haptic feedback på nøkkelhandlinger
- [ ] App resume-deteksjon (vis "Fulgt opp?" etter samtale)
- [ ] Badge-tall på app-ikon (ubesvarte leads)
- [ ] Splash screen med Monstr-branding
- [ ] App Store listing (screenshots, beskrivelse, privacy policy)
- [ ] Google Play listing

### Call tracking
- [ ] `call_events`-tabell i Supabase
- [ ] Logg `call_initiated` ved klikk på "Ring"
- [ ] App resume → "Snakket du med [navn]?"-prompt
- [ ] Oppfølgingsanalyse-side (tid fra varsel til ring)

### Mobil
- [ ] Bunn-tab-bar navigasjon
- [ ] Responsivt design (mobile-first)
- [ ] Store touch-targets
- [ ] Pull-to-refresh

---

## Estimert byggeomfang

| Komponent | Kompleksitet | Avhengigheter |
|-----------|-------------|---------------|
| Supabase-oppsett | Lav | Ingen |
| Auth + login | Lav | Supabase |
| Dashboard + lead-feed | Medium | Supabase Realtime |
| Lead-detalj + handlinger | Medium | Dashboard |
| Push-varsler | Medium-Høy | Service Worker, Supabase Edge Functions |
| SMS-logg | Lav | Twilio webhook |
| Eskaleringslogikk | Medium | Supabase Edge Functions / cron |
| Analytics-sider | Lav | Leads-data |
| Admin/innstillinger | Medium | Alle tabeller |
| PWA-oppsett | Lav | vite-plugin-pwa |
| Mobil-optimalisering | Medium | Alle sider |

**Foreslått byggeorden:**
1. Supabase + auth + login
2. Dashboard + lead-feed (sanntid)
3. Lead-detalj + click-to-call + call tracking
4. Push-varsler (Edge Function + native via Capacitor)
5. Egendefinerte varslingslyeder
6. SMS-logg
7. Eskaleringslogikk
8. Analytics + oppfølgingsanalyse (call tracking data)
9. Admin/innstillinger
10. Capacitor native wrapper (iOS + Android)
11. PWA-polering for web-fallback
12. App Store + Google Play listing
13. Test med ekte data
