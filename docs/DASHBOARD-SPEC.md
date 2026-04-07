# Monstr Dashboard — Komplett spesifikasjon

> Byggeguide for Claude Code. Alt som trengs for å bygge enterprise-dashboardet.

---

## Oversikt

**Hva:** Et kundevendt dashboard for Monstr-kunder som gir salgsteamet full oversikt over innkommende leads, automatisk routing, oppfølgingsstatus, og varsler ved manglende oppfølging.

**Hvor:** `app.monstr.no` — egen subdomain, Vercel-deploy

**Hvem bruker det:**
- Daglig leder / eier — oversikt, ser at ting fungerer, ROI
- Salgssjef — full kontroll, får eskaleringsvarsler, styrer teamet
- Teammedlemmer (rørlegger-teamleder, elektriker-teamleder, etc.) — ser leads routed til sin avdeling, markerer oppfølging

**Tech stack:**
- React + Vite (konsistent med eksisterende monstr.no-prosjekt)
- Supabase for database + auth + realtime
- Vercel for hosting
- Twilio for SMS (eksisterende)
- Webhook mottar leads → Supabase → dashboard viser dem i sanntid

---

## Brukerroller

| Rolle | Ser | Kan gjøre |
|-------|-----|-----------|
| **Admin** (daglig leder) | Alt: alle leads, alle avdelinger, alle tall | Administrere team, endre routing-regler, SMS-templates, sender-IDer |
| **Salgssjef** | Alle leads, eskaleringsvarsler, team-ytelse | Markere leads, tildele manuelt, se eskaleringslogg |
| **Teammedlem** | Kun leads routed til sin avdeling | Markere som fulgt opp, legge til notater |

---

## Sider og funksjoner

### 1. Innlogging

- Magic link via e-post (ingen passord — enkelt for håndverkere)
- Første gang: admin oppretter teammedlemmer med navn + e-post + avdeling
- Session varer 30 dager (de skal ikke måtte logge inn hver dag)
- Responsivt — fungerer på mobil (teammedlemmer er på farten)

---

### 2. Oversikt (Dashboard-forsiden)

Første ting brukeren ser etter innlogging. Alt viktig i ett blikk.

**Øverst: Nøkkeltall-kort (4 stk)**

```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  I dag: 12  │ │ Responstid  │ │ Denne mnd   │ │  Venter på  │
│  nye leads  │ │   18 sek    │ │  247 leads  │ │ oppfølging  │
│             │ │  (snitt)    │ │             │ │    ⚠️ 3     │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

- "I dag" = leads mottatt siden midnatt
- "Responstid" = gjennomsnittlig tid fra lead inn til SMS sendt (alltid under 30 sek, men vis det)
- "Denne mnd" = totalt antall leads denne måneden
- "Venter på oppfølging" = leads som har fått SMS men ingen har markert oppfølging. **Rød farge hvis noen har ventet over grensen** (se eskalering under)

**Midten: Lead-feed (sanntid)**

En liste over de siste leads, nyeste øverst. Oppdateres i sanntid (Supabase realtime subscriptions).

```
┌──────────────────────────────────────────────────────────────┐
│ 🔴 Ola Nordmann — Vannlekkasje                    14:32     │
│    Rørlegger · monstr.no skjema · Venter på oppfølging      │
├──────────────────────────────────────────────────────────────┤
│ ✅ Kari Hansen — Nytt bad                          13:15     │
│    Rørlegger · Meta lead · Fulgt opp av Per                  │
├──────────────────────────────────────────────────────────────┤
│ 🟡 Erik Johansen — Sikringsskap                    11:48     │
│    Elektriker · Google Ads · Venter (1t 44min)               │
└──────────────────────────────────────────────────────────────┘
```

Hvert lead viser:
- Navn
- Kort beskrivelse (fra fritekstfelt)
- Avdeling (auto-routed)
- Kilde (hvilken lead-kilde)
- Status: `Ny` → `SMS sendt` → `Venter på oppfølging` → `Fulgt opp` → `Booket` / `Ikke relevant`
- Tid siden innkommet
- Hvem som fulgte opp (hvis gjort)

**Fargesystem:**
- 🔴 Rød: Ventet over eskaleringsgrensen (standard: 2 timer)
- 🟡 Gul: Ventet over 1 time, under grensen
- ✅ Grønn: Fulgt opp
- ⚪ Grå: Ikke relevant / diskvalifisert

**Bunn: Enkel graf**

Leads per dag siste 30 dager. Enkel linjegraf. Ingenting fancy — bare trendlinje så de ser om volumet går opp eller ned.

---

### 3. Lead-detaljside

Klikk på et lead → åpner full detaljvisning.

```
┌──────────────────────────────────────────────────────────┐
│  Ola Nordmann                                            │
│  📱 +47 912 34 567  ·  📧 ola@nordmann.no               │
│  🏢 Selskap: Nordmann Bygg AS                            │
│  📍 Kilde: monstr.no kontaktskjema                       │
│  🏷️ Avdeling: Rørlegger (auto-routed)                    │
│                                                          │
│  Henvendelse:                                            │
│  "Vi har en vannlekkasje i kjelleren som trenger         │
│   umiddelbar utbedring. Huset er fra 1972."              │
│                                                          │
│  ─── Tidslinje ────────────────────────────────────      │
│  14:32  Lead mottatt                                     │
│  14:32  SMS sendt: "Hei Ola — vi har mottatt             │
│         forespørselen din om vannlekkasjen..."            │
│  14:32  Varsel sendt til Rørlegger-team                  │
│  16:45  ⚠️ Eskaleringsvarsel sendt til salgssjef         │
│  17:02  Per markerte som fulgt opp                        │
│  17:02  Notat: "Ringt, avtalt befaring torsdag 10:00"    │
│                                                          │
│  ┌─────────────┐ ┌──────────────┐ ┌────────────────┐    │
│  │ ✅ Fulgt opp │ │ 📝 Legg til  │ │ ❌ Ikke relevant│   │
│  │             │ │    notat     │ │                │    │
│  └─────────────┘ └──────────────┘ └────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

**Handlingsknapper:**
- **"Fulgt opp"** — teammedlem klikker dette etter at de har ringt/sendt e-post. Stopper eskaleringstimeren.
- **"Legg til notat"** — fritekst. "Ringt, avtalt befaring torsdag." Logges i tidslinja.
- **"Ikke relevant"** — lead er spam, feil avdeling, etc. Fjernes fra aktiv kø.
- **"Tildel til annen"** — (kun salgssjef/admin) flytt leadet til en annen avdeling/person

---

### 4. Eskaleringssystem (Missed Lead Alert)

**Logikk:**

1. Lead kommer inn → status settes til "Venter på oppfølging"
2. Timer starter
3. Hvis ingen klikker "Fulgt opp" innen **X timer** (konfigurerbart, standard 2 timer):
   - SMS sendes til salgssjef: "Henvendelse fra Ola Nordmann om vannlekkasje har ventet i 2 timer uten oppfølging."
   - Lead markeres som 🔴 i dashboardet
   - Logges i tidslinja
4. Hvis fortsatt ingen oppfølging etter **2X timer** (standard 4 timer):
   - SMS sendes til admin/daglig leder
   - "Kritisk: Lead fra Ola Nordmann har ventet 4 timer. Ingen oppfølging."

**Konfigurerbart per kunde:**
- Eskaleringsgrense: 1-4 timer (standard 2)
- Hvem som får eskaleringsvarsel: salgssjef og/eller daglig leder
- Varsling via: SMS, e-post, eller Slack
- Arbeidstid: eskalering kun innenfor definerte timer (f.eks. 07-17 hverdager)
  - Leads som kommer inn utenfor arbeidstid: timer starter ved neste arbeidsdag start

**Hvorfor dette konverterer:**
- Salgssjefen får kontroll uten å måtte mikrostyre
- Teamet vet at noen ser om de dropper ballen → de dropper den sjeldnere
- Daglig leder ser at systemet aktivt beskytter mot tapte kunder
- Det er en funksjon ingen andre tilbyr på dette prisnivået

---

### 5. Avdelingsoversikt (kun salgssjef/admin)

Viser ytelse per avdeling:

```
┌──────────────────────────────────────────────────────────┐
│  Avdelinger                                              │
│                                                          │
│  🔧 Rørlegger     89 leads   │ 82 fulgt opp │ 7 venter  │
│  ⚡ Elektriker     64 leads   │ 61 fulgt opp │ 3 venter  │
│  🎨 Maler         52 leads   │ 50 fulgt opp │ 2 venter  │
│  🪵 Tømrer        42 leads   │ 40 fulgt opp │ 2 venter  │
│                                                          │
│  Snitt oppfølgingstid per avdeling:                      │
│  Rørlegger: 47 min · Elektriker: 1t 12min                │
│  Maler: 38 min · Tømrer: 2t 05min                        │
└──────────────────────────────────────────────────────────┘
```

Dette er gull for salgssjefen — de ser umiddelbart hvilken avdeling som er treg og kan ta tak i det.

---

### 6. Leadkilder (analytics)

Enkel oversikt over hvor leads kommer fra:

```
Denne måneden:
  monstr.no skjema:    124 leads  (50%)
  Meta lead forms:      68 leads  (28%)
  Google Ads:           43 leads  (17%)
  Finn.no:              12 leads  (5%)
```

Enkel bar chart eller donut chart. Ingenting mer avansert enn dette.

Nyttig for kunden: de ser hvor de bør bruke mer/mindre ads-budsjett.

---

### 7. Innstillinger (kun admin)

**Teamadministrasjon:**
- Legg til teammedlem (navn, e-post, avdeling)
- Fjern teammedlem
- Endre rolle (teammedlem → salgssjef)

**Routing-regler:**
- Vis gjeldende regler: "Nøkkelord X, Y, Z → Rørlegger-team"
- Enkel redigering: legg til/fjern nøkkelord per avdeling
- Fallback-avdeling: leads som ikke matcher noe → standard avdeling

**SMS-innstillinger:**
- Vis gjeldende SMS-template per avdeling
- Forhåndsvisning av hvordan SMS-en ser ut
- Avsender-ID per avdeling (f.eks. "TF Rør", "TF Elektro")

**Eskaleringsinnstillinger:**
- Tidsgrense for første eskalering (standard 2 timer)
- Tidsgrense for andre eskalering (standard 4 timer)
- Hvem mottar eskaleringsvarsel
- Arbeidstider (start/slutt per ukedag)

---

## Datamodell (Supabase)

### Tabeller

**organizations**
```
id              uuid PK
name            text        "Rørlegger Sansen AS"
slug            text        "rorlegger-sansen" (brukt i URL)
plan            text        "bedrift"
created_at      timestamptz
```

**users**
```
id              uuid PK (Supabase auth)
organization_id uuid FK → organizations
name            text
email           text
role            text        "admin" | "salgssjef" | "teammedlem"
department_id   uuid FK → departments (nullable for admin/salgssjef)
created_at      timestamptz
```

**departments**
```
id              uuid PK
organization_id uuid FK → organizations
name            text        "Rørlegger"
keywords        text[]      ["lekkasje", "rør", "avløp", "varmtvannsbereder"]
sender_id       text        "TF Rør" (alfanumerisk SMS-avsender)
sms_template    text        SMS-template for denne avdelingen
created_at      timestamptz
```

**leads**
```
id              uuid PK
organization_id uuid FK → organizations
department_id   uuid FK → departments (nullable før routing)
first_name      text
last_name       text
email           text
phone           text
company         text
description     text        (fritekstfelt)
source          text        "website" | "meta" | "google" | "finn" | "webhook"
status          text        "ny" | "sms_sendt" | "venter" | "fulgt_opp" | "booket" | "ikke_relevant"
followed_up_by  uuid FK → users (nullable)
followed_up_at  timestamptz (nullable)
escalated       boolean     default false
escalated_at    timestamptz (nullable)
sms_sent_at     timestamptz
created_at      timestamptz
```

**lead_notes**
```
id              uuid PK
lead_id         uuid FK → leads
user_id         uuid FK → users
note            text
created_at      timestamptz
```

**lead_events** (tidslinje)
```
id              uuid PK
lead_id         uuid FK → leads
event_type      text        "created" | "sms_sent" | "routed" | "escalated" | "followed_up" | "note_added" | "status_changed"
description     text
user_id         uuid FK → users (nullable — null for system-events)
created_at      timestamptz
```

**escalation_settings**
```
id                  uuid PK
organization_id     uuid FK → organizations
first_threshold_min integer     default 120 (2 timer)
second_threshold_min integer    default 240 (4 timer)
notify_salgssjef    boolean     default true
notify_admin        boolean     default true
notify_via          text        "sms" | "email" | "slack"
work_hours_start    time        "07:00"
work_hours_end      time        "17:00"
work_days           integer[]   [1,2,3,4,5] (man-fre)
created_at          timestamptz
```

---

## Webhook-flyt (lead inn → dashboard)

```
1. Lead kommer inn (webhook / skjema / Meta / Google)
        ↓
2. API mottar og validerer
        ↓
3. AI analyserer fritekstfelt → bestemmer avdeling (keyword + OpenAI fallback)
        ↓
4. Lead lagres i Supabase med department_id og status "ny"
        ↓
5. SMS sendes via Twilio (med riktig sender-ID for avdelingen)
        ↓
6. Status oppdateres til "sms_sendt" → "venter"
        ↓
7. Varsel sendes til avdelingens teammedlemmer (Telegram/Slack/push)
        ↓
8. Lead vises i dashboard i sanntid (Supabase realtime)
        ↓
9. Eskaleringstimer starter
        ↓
10. Teammedlem klikker "Fulgt opp" i dashboard → timer stoppes
        ↓
    ELLER: Timer utløper → eskaleringsvarsel til salgssjef/admin
```

---

## Design og UX

### Visuell stil

- **Konsistent med monstr.no** — bruk samme fargepalett og typografi
- Mørk sidebar-navigasjon (bg-dark/bg-[#111])
- Lyst hovedinnhold (bg-background/bg-[#F5F0EB])
- Accent-farge (#E63B2E) for varsler, CTAer, og viktige elementer
- Font: samme som monstr.no (heading + sans + data fonts)

### Layout

```
┌────────┬─────────────────────────────────────────────┐
│        │                                             │
│  LOGO  │  Oversikt  Leads  Avdelinger  Innstillinger │
│        │                                             │
│  Nav   │ ┌─────────────────────────────────────────┐ │
│        │ │                                         │ │
│  Over- │ │          Hovedinnhold                   │ │
│  sikt  │ │                                         │ │
│        │ │                                         │ │
│  Leads │ │                                         │ │
│        │ │                                         │ │
│  Avd.  │ │                                         │ │
│        │ │                                         │ │
│  Inn-  │ │                                         │ │
│  still.│ │                                         │ │
│        │ │                                         │ │
│        │ └─────────────────────────────────────────┘ │
│        │                                             │
│  Org   │                                             │
│  navn  │                                             │
└────────┴─────────────────────────────────────────────┘
```

- Sidebar kollapser til hamburger-meny på mobil
- Lead-feed på forsiden er scrollbar
- Lead-detalj åpner som slide-over panel fra høyre (ikke ny side — raskere)

### Mobil-prioritet

Teammedlemmer er håndverkere på farten. Mobil er like viktig som desktop:
- Lead-feed som full-width liste
- "Fulgt opp"-knappen er stor og lett å treffe med tommel
- Notatfelt med autoexpand
- Eskaleringsvarsel med tydelig visuell indikator

---

## Onboarding-flyt for ny kunde

1. Admin oppretter organisasjon i Supabase (du gjør dette manuelt i starten)
2. Kunden mottar magic link til app.monstr.no
3. Første innlogging → enkel wizard:
   - "Velkommen til Monstr! La oss sette opp teamet ditt."
   - Steg 1: Legg til avdelinger (rørlegger, elektriker, etc.)
   - Steg 2: Legg til teammedlemmer (navn + e-post per avdeling)
   - Steg 3: Bekreft SMS-avsender-ID per avdeling
   - Steg 4: Sett eskaleringsgrense (standard 2 timer, kan justeres)
4. Du kobler webhook i bakgrunnen
5. Systemet er live — første lead vises i dashboardet

I starten gjør du steg 1-3 manuelt med kunden på en onboarding-call. Wizarden kan bygges senere.

---

## Hva vi IKKE bygger nå

- Fakturering/betaling i dashboardet (Vipps/bankoverføring manuelt)
- To-veis SMS i dashboardet (meldingstråd med kunden)
- Kalenderintegrasjon (booking direkte fra dashboard)
- Rapporteksport (PDF-rapporter)
- Push-notifikasjoner (bruker SMS/Slack/Telegram for varsler i v1)
- Kundeportal (kunden ser ikke dashboardet — det er internt)

Disse kan legges til i v2 basert på kundebehov.

---

## MVP-sjekkpunktliste

Minimum for å levere til første kunde:

- [ ] Supabase-prosjekt satt opp med tabellene over
- [ ] Auth med magic link fungerer
- [ ] Webhook-endepunkt som mottar leads og lagrer i Supabase
- [ ] AI-routing (keyword + OpenAI fallback) som setter department_id
- [ ] SMS sendes via Twilio med riktig sender-ID
- [ ] Dashboard-forside med nøkkeltall og lead-feed (sanntid)
- [ ] Lead-detaljside med tidslinje, "Fulgt opp"-knapp, og notatfelt
- [ ] Eskaleringslogikk (Supabase edge function eller cron) som sjekker ubesvarte leads
- [ ] Eskaleringsvarsel via SMS til salgssjef
- [ ] Avdelingsoversikt-side
- [ ] Innstillinger: team-admin, routing-nøkkelord, eskaleringsgrenser
- [ ] Responsivt design (mobil-først)
- [ ] Deploy til app.monstr.no via Vercel
