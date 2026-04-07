# Monstr — Plattform og teknologi

## Systemarkitektur

Monstr består av tre hovedkomponenter:

```
┌─────────────────────────────────────────────────────┐
│                    LEADKILDER                         │
│  Nettskjema · Meta Ads · Google Ads · Finn.no        │
│  Booking-systemer · Google Business · Chat            │
└──────────────┬──────────────────────────┬────────────┘
               │ webhook                   │ skjema
               ▼                           ▼
┌──────────────────────┐    ┌──────────────────────────┐
│   /api/webhook       │    │   /api/submit-lead       │
│   (kundeintegrasjon) │    │   (booking-skjema)       │
│   Vercel Function    │    │   Vercel Function        │
└──────────┬───────────┘    └──────────┬───────────────┘
           │                           │
           ▼                           ▼
┌──────────────────────────────────────────────────────┐
│                  PROSESSERING                         │
│  Validering → Scoring → Normalisering → Lagring      │
└──────┬──────────┬──────────────┬─────────────────────┘
       │          │              │
       ▼          ▼              ▼
   ┌────────┐ ┌────────┐  ┌──────────────┐
   │Airtable│ │ Twilio │  │ Telegram Bot │
   │  (CRM) │ │ (SMS)  │  │  (varsling)  │
   └────────┘ └────────┘  └──────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │  app.monstr.no        │
                    │  (dashbord - planlagt)│
                    │  Supabase + React     │
                    └───────────────────────┘
```

## Teknisk stack

### Frontend (monstr.no — landing page)
| Teknologi | Versjon | Rolle |
|-----------|---------|-------|
| React | 19 | UI-rammeverk |
| Vite | 6 | Bundler og dev-server |
| Tailwind CSS | 4 | Styling |
| GSAP | 3 | Scroll-animasjoner |
| Lucide React | — | Ikoner |
| React Router | 7 | Navigasjon |
| React Helmet Async | — | SEO meta-tags |

### Backend (Vercel Serverless Functions)
| Teknologi | Rolle |
|-----------|-------|
| Node.js | Runtime |
| Vercel Functions | Serverless API |
| Airtable API | Database og CRM |
| Twilio | SMS-utsending |
| Telegram Bot API | Eiervarsling |

### Fremtidig dashbord (app.monstr.no)
| Teknologi | Rolle |
|-----------|-------|
| React + Vite | Frontend |
| Supabase | Database, auth, real-time subscriptions |
| Supabase Row Level Security | Tilgangskontroll per organisasjon |
| Vercel | Hosting |

### Infrastruktur
| Tjeneste | Rolle |
|----------|-------|
| Vercel | Hosting, edge-nettverk, serverless functions, automatisk deploy |
| Git/GitHub | Versjonskontroll, CI/CD trigger |
| Airtable | Primær datalager (nåværende fase) |
| Supabase | Planlagt datalager (dashbord-fase) |

## API-endepunkter

### POST /api/submit-lead
**Formål:** Fanger kvalifiserte prospekter fra booking-skjemaet på monstr.no

**Input:**
```json
{
  "firstName": "Ola",
  "company": "Ola Rør AS",
  "phone": "99887766",
  "email": "ola@olaror.no",
  "website": "olaror.no",
  "leadsPerMonth": "10-30",
  "leadSources": ["web_form", "meta_ads"],
  "followUpProcess": "noen_ganger",
  "customerValue": "25000+",
  "intent": "pilot",
  "decisionMaker": "ja"
}
```

**Prosessering:**
1. Rate limiting (maks 3 innsendinger per IP per time)
2. Validering (påkrevde felt, e-postformat)
3. Lead scoring-algoritme (volum + verdi + intensjon + prosesskvalitet)
4. Prioritetstildeling (Hot >=12 poeng, Warm >=8, Cold <8)
5. Telefon/nettside-normalisering (norsk format)

**Output:**
- Lagrer i Airtable (alle skjemadata + score + prioritet)
- Sender SMS via Twilio (personalisert melding basert på score)
- Sender Telegram-varsling til eier (med lead-sammendrag og prioritets-emoji)

### POST /api/webhook
**Formål:** Fleksibel webhook-mottaker for leads fra kundeintegrasjoner

**Autentisering:** API-nøkkel i header (`x-api-key`)

**Input:** Fleksibel feltmapping — støtter mange navnekonvensjoner:
- `firstName` / `first_name` / `name` / `fornavn`
- `email` / `e-post`
- `phone` / `telefon`
- `company` / `firma`
- `website` / `nettside`
- `source` (leadsource-identifikator)

**Output:**
- Lagrer i Airtable med kildesporing
- Sender SMS via Twilio
- Sender Telegram-varsling til eier

## Miljøvariabler

| Variabel | Tjeneste | Bruk |
|----------|----------|------|
| `AIRTABLE_TOKEN` | Airtable | API-tilgang |
| `AIRTABLE_BASE_ID` | Airtable | Base-identifikator |
| `AIRTABLE_TABLE_ID` | Airtable | Tabell-identifikator |
| `TWILIO_ACCOUNT_SID` | Twilio | Konto-ID |
| `TWILIO_AUTH_TOKEN` | Twilio | Autentisering |
| `TELEGRAM_BOT_TOKEN` | Telegram | Bot-tilgang |
| `TELEGRAM_CHAT_ID` | Telegram | Mottaker-chat |
| `WEBHOOK_API_KEY` | Intern | Webhook-autentisering |

## Dashbord — teknisk spesifikasjon

### Datamodell (Supabase)

**8 tabeller:**

1. **organizations** — Bedrifter som bruker Monstr
2. **users** — Brukere (eiere, ledere, ansatte) koblet til org
3. **departments** — Avdelinger innen en organisasjon
4. **leads** — Alle innkommende henvendelser
5. **lead_notes** — Notater lagt til av teammedlemmer
6. **lead_events** — Tidslinje over alle hendelser (mottatt, SMS sendt, varslet, eskalert, fulgt opp)
7. **escalation_settings** — Konfigurerbare eskaleringsnivåer per org/avdeling
8. **sms_templates** — SMS-maler per avdeling med avsender-ID

### Hovedfunksjoner

**1. Oversiktside (Dashboard)**
- 4 nøkkeltallskort: Dagens leads, gjennomsnittlig responstid, leads denne måneden, leads som venter
- Sanntids lead-feed (sortert nyeste først) med fargekodede statuser
- Linjegraf: Leads per dag siste 30 dager

**2. Lead-detaljvisning (slide-over panel)**
- Full kontaktinfo og henvendelsetekst
- Tidslinje over alle hendelser
- Handlingsknapper: "Fulgt opp", "Legg til notat", "Ikke relevant", "Tilordne annen"

**3. Avdelingsytelse**
- Leads per avdeling med oppfølgingsrate
- Gjennomsnittlig oppfølgingstid per avdeling

**4. Leadkilde-analyse**
- Hvor leads kommer fra denne måneden (søyle/donut)
- Prosentfordeling per kilde

**5. Eskaleringssystem**
- Lead inn → status "venter"
- Ingen oppfølging etter X timer (standard 2t) → SMS til salgsleder, lead blir 🔴
- Fortsatt ingen etter 2X timer (standard 4t) → SMS til daglig leder
- Respekterer arbeidstider (kan deaktiveres utenfor 07-17 hverdager)

**6. Innstillinger (kun admin)**
- Teammedlem-håndtering
- Rutingsregler (nøkkelord → avdeling)
- SMS-malredigering per avdeling
- Eskaleringterskler og varslingspreferanser
- Arbeidstidkonfigurasjon

### Sanntidsoppdateringer
Supabase Realtime brukes for:
- Nye leads dukker opp umiddelbart i feedet
- Statusendringer reflekteres over alle tilkoblede klienter
- Eskaleringsalarmer vises i sanntid

### Autentisering og tilgang
- Supabase Auth (e-post/passord)
- Row Level Security (RLS) sikrer at bedrifter kun ser egne data
- Roller: Admin (eier), Manager (leder), Member (ansatt)

## Deploymentflyt

```
Utvikler pusher til Git
        │
        ▼
Vercel bygger automatisk (Vite build)
        │
        ├── Preview deployment (branch/PR)
        │
        └── Produksjon deployment (main branch)
              │
              ├── monstr.no (landing page + SPA)
              ├── /api/submit-lead (serverless function)
              └── /api/webhook (serverless function)
```

### vercel.json konfigurering
- SPA rewrites: Alle ruter → `/index.html`
- API rewrites: `/api/*` → serverless functions
- Headers: CORS, cache-kontroll

## Integrasjoner og automatisering

### Nåværende integrasjoner
- **Airtable:** Alle leads lagres her, fungerer som CRM
- **Twilio:** Sender SMS med bedriftens avsender-ID
- **Telegram:** Sanntidsvarsling til bedriftseier

### Planlagte integrasjoner
- **Make.com / n8n:** Workflow-automatisering for komplekse flyter
- **Supabase:** Database, auth og real-time for dashbordet
- **OpenAI API:** AI-personaliserte SMS-svar (fremtidig utvidelse)
- **Google Sheets:** Alternativ/enkel datautgang for kunder
- **Slack:** Teamvarsling for kunder
