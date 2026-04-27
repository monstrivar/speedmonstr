# Agentik — AI-studio for norske bedrifter

## Hva dette prosjektet er

Agentik er et norsk AI-studio som bygger AI-agenter for norske bedrifter. Vi kartlegger hvor AI gir verdi, prioriterer etter ROI, og bygger agentene i produksjon — fra stemme-resepsjonist til faktura-agent.

Dette repoet inneholder **agentik.no** — landingssiden som selger studiet. Selve agent-leveransene lever i egne, kundespesifikke repoer.

## Repostruktur

```
speedmonstr/
├── CLAUDE.md                 ← Du er her
├── index.html                Landing page entry
├── src/
│   ├── main.jsx              Router (9 ruter)
│   ├── index.css             Tailwind + globale styles
│   └── pages/
│       ├── NySide.jsx        Original landing (kjører fortsatt)
│       ├── Side2.jsx         Ny premium AI-Partner landing (skal erstatte NySide)
│       ├── Takk.jsx          Pre-assessment etter /side2 form-submit
│       ├── Preso.jsx         AI-generert HTML-preso per kunde (/preso/[id])
│       ├── Onboarding.jsx    Partner-onboarding-skjema (/onboarding/[token])
│       ├── AiPartner.jsx     /ai-partner — AI-Partner detail page
│       ├── AiRevisjon.jsx    /ai-revisjon — AI-Revisjon (sprint fase 1)
│       ├── Personvern.jsx
│       └── Vilkar.jsx
├── api/
│   ├── agentik-contact.js                  POST — kontaktskjema fra /side2 → n8n
│   ├── agentik-assessment.js               POST — pre-assessment fra /takk → n8n
│   ├── agentik-presentation/[id].js        GET — henter generert preso-HTML fra Supabase
│   ├── agentik-onboarding-init.js          POST — Ivar/Ole trigger onboarding av ny partner
│   └── agentik-onboarding/[token].js       GET/POST — kunde-fronted onboarding-form
├── public/
│   ├── aiarendal.html                Event-landing
│   ├── onboarding-flow.html          Visualisering av onboarding-flyten (intern presentasjon)
│   ├── strategi-3-klienter.html      60-dagers strategi-visualisering (intern presentasjon)
│   ├── skills/                       Claude-skill-kort
│   └── claude-verktoykassen.zip
├── presentation/             HTML keynote-deck for events
├── docs/                     Intern dokumentasjon (norsk)
├── vercel.json, package.json, tailwind.config.js, vite.config.js
```

## Tech-stack (landingsside)

| Lag | Teknologi |
|-----|-----------|
| Språk | JavaScript (JSX). **Ingen TypeScript** — landingen er enkel, TS er overhead her |
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v3 (konfigurert med Agentik-palette) |
| Animasjon | GSAP + ScrollTrigger |
| Ikoner | Lucide React |
| Ruting | react-router-dom v7 |
| SEO | react-helmet-async |
| Fonter | Plus Jakarta Sans (body + heading) + JetBrains Mono (data/tall) |
| API | Vercel Serverless Functions (Node.js) |
| Lead-flyt | Kontaktskjema → `/api/agentik-contact` → N8N webhook → Attio + Gmail auto-svar + Slack-varsel + Supabase audit |
| Hosting | Vercel (agentik.no) |

## Designsystem

Palette lever to steder:
1. **Tailwind config** — `background` (#F5F2EC), `dark` (#1A1F25), `petrol`, `signal`, `copper`
2. **Inline brackets i NySide.jsx** — `bg-[#F5F2EC]`, `text-[#C4854C]` osv., fordi noen komponenter trenger eksakte verdier med transparens (`#F5F2EC/90`)

Fonter: Plus Jakarta Sans overalt. JetBrains Mono kun for tall, tekniske labels, eyebrow-tekst.

Full brand-dokumentasjon: `docs/MERKEVARE-OG-DESIGN.md`.

## Kjøre lokalt

```bash
npm install
npm run dev              # Vite dev server på :5173
npm run build            # Produksjonsbygg
npm run preview          # Forhåndsvisning av bygg
npm run lint             # ESLint
```

## Hovedflyt: lead → AI-Partner

End-to-end-flyt fra fremmed besøkende til onboardet AI-Partner:

```
1. /side2 (lead-skjema)
   ↓ POST /api/agentik-contact → n8n «AI Form Lead Handler»
   ↓ Oppretter Attio-person + bedrift + auto-svar med møte-tider
   ↓ Redirect til /takk?n=&e=&b=

2. /takk (pre-assessment, 12 spørsmål, typeform-stil)
   ↓ POST /api/agentik-assessment → n8n «AI Assessment Handler»
   ↓ Firecrawl scrape + Claude Opus genererer HTML-preso (10 slides)
   ↓ Lagrer preso i Supabase + notater i Attio (person + bedrift)
   ↓ Slack-varsel med URL: agentik.no/preso/[uuid]

3. (Møte avholdt — kunde sier "ja")

4. /api/agentik-onboarding-init triggert (av Ivar/Ole)
   ↓ n8n «AI Partner Onboarding INIT»
   ↓ Notion klient-side opprettet + 5 initielle tasks + onboarding-mail

5. /onboarding/[token] (kunde fyller ut intake, 9 steg)
   ↓ POST /api/agentik-onboarding/[token]
   ↓ n8n «AI Partner Onboarding SUBMIT»
   ↓ Notion-rad per nøkkelperson + intro-møter + setup-tasks
   ↓ Bekreftelses-mail + Slack

6. Ivar/Ole krysser av tasks i Notion → onboarded
```

Full onboarding-strategi: `docs/agentik/ONBOARDING.md` + visualisering på `public/onboarding-flow.html`.

## n8n-workflows (alle aktive)

| Workflow | ID | Status |
|---|---|---|
| AI Form Lead Handler | `Zu6rLrT0bRlDeQb2` | Live |
| AI Email Auto-Reply | `dJL4Gk4dO5ZPqAH3` | Live |
| AI Assessment Handler | `Pv1Aj3Vg38ogshQ8` | Live |
| AI Partner Onboarding INIT | `SOSHZFRKHXrUU5H7` | Bygd, Notion-creds må linkes |
| AI Partner Onboarding SUBMIT | `uoNd4dBO5ZdmTVCI` | Bygd, Notion-creds må linkes |

## Vercel env-variabler (production)

| Variabel | Status |
|---|---|
| `N8N_WEBHOOK_URL` | ✓ |
| `N8N_ASSESSMENT_WEBHOOK_URL` | ✓ |
| `N8N_ONBOARDING_INIT_WEBHOOK_URL` | Mangler — settes når INIT-workflowen er klar |
| `N8N_ONBOARDING_SUBMIT_WEBHOOK_URL` | Mangler — settes når SUBMIT-workflowen er klar |
| `ONBOARDING_INIT_SECRET` | Mangler — random string for å beskytte init-endepunkt |
| `SUPABASE_URL` | ✓ (server-side) |
| `SUPABASE_KEY` | ✓ (anon-key, server-side med RLS bypass via samme key som klient) |
| `VITE_SUPABASE_URL` | ✓ (klient) |
| `VITE_SUPABASE_ANON_KEY` | ✓ (anon, klient) |
| `VITE_ADMIN_EMAILS` | Valgfri — for admin-UI på klient (samme verdi som `ADMIN_EMAILS`) |
| `ADMIN_EMAILS` | ✓ — kommaseparert, default `ivar@agentik.no,ole@agentik.no` |
| `ATTIO_API_KEY` | ✓ (for `/api/agentik-admin/attio-lookup`) |
| `OPENAI_API_KEY` | ✓ (Slack `/partner` polish, assessment generering) |
| `SLACK_SIGNING_SECRET` | Mangler — settes når Slack-app for `/partner`-kommandoen er registrert |

## Konvensjoner

- **Engelsk** i kode, commits, kommentarer
- **Norsk** i UI og `/docs/`
- En logisk endring per commit, imperativ form i subject
- Ingen TypeScript i landingssiden (bevisst valg)
- Ikke legg til tunge avhengigheter uten klar grunn

Detaljer: `docs/CONVENTIONS.md`.

## Tjenester Agentik selger (kontekst for AI-arbeid)

| Tjeneste | Pris | Modell |
|----------|------|--------|
| **AI-Partner** (hovedtilbud) | 39 000 kr/mnd | Månedlig, ingen binding etter 90 dager. Founding-pris låst for første 3 partnere. Etter Founding: 49 000 kr/mnd |
| AI Workshop (halvdag/heldag) | 25 000 – 50 000 kr | Engangshendelse |
| Enkeltprosjekter | Etter omfang | Prises separat for kunder uten partneravtale |

**AI-Partner inkluderer**: Komplett AI-Revisjon (kartlegging), månedlig strategimøte, bygging og vedlikehold, Slack-tilgang, opplæring, eget ROI-dashbord.

**90-dagers verdigaranti**: Innen 90 dager dokumentert årlig verdipotensial ≥ 2x investeringen — eller jobber vi videre uten månedlig honorar til verdien er dokumentert. Kontraktsmessig cap: 90 ekstra dager fritt arbeid før refund av siste faktura.

Se `docs/agentik/HVA-ER-AGENTIK.md` og `docs/agentik/TJENESTER.md` for full produktbeskrivelse. Landing pages: `/ai-partner` og `/ai-revisjon`.

## Team

- **Ivar Knutsen** — medgründer. Teknisk lead, bygger med Claude Code daglig.
- **Ole Kristian Haug** — medgründer. Salg og kundeleveranser.

Lokasjon: Skien og Arendal.

## Doc-routing

**Hold CLAUDE.md under 200 linjer.** Dypere kontekst legges i `docs/`:

| Fil | Innhold |
|-----|---------|
| `docs/agentik/HVA-ER-AGENTIK.md` | Full produktbeskrivelse, forretningsmodell, posisjon |
| `docs/agentik/TJENESTER.md` | Detaljert tjenestebeskrivelse |
| `docs/agentik/PARTNERAVTALE.md` | Partneravtale-struktur: tre tiers, priser, scope, kapasitetsplanlegging |
| `docs/agentik/ONBOARDING.md` | Partner-onboarding fra «ja» til AI i drift: timeline, WOW-momenter, V1 vs V2-tooling |
| `docs/agentik/MALGRUPPE.md` | Målgruppedefinisjon |
| `docs/agentik/INNHOLDSSTRATEGI.md` | Innholds- og markedsføringsstrategi |
| `docs/MERKEVARE-OG-DESIGN.md` | Merkevareidentitet, farger, typografi, designsystem |
| `docs/PLATTFORM-OG-TEKNOLOGI.md` | Systemarkitektur, API, miljøvariabler, deployment |
| `docs/automasjoner/README.md` | Live N8N-workflows: ID-er, credentials, felles infrastruktur |
| `docs/automasjoner/ai-partner-onboarding.md` | Onboarding-workflows (INIT + SUBMIT): blueprint + Notion-DB-IDer |
| `docs/automasjoner/ai-assessment-handler.md` | Pre-assessment workflow med preso-generering |
| `docs/forretning/2MND-STRATEGI-3-KLIENTER.md` | 60-dagers plan for 3 Founding-partnere — ukentlig roadmap, kanaler, KPI-er |
| `docs/TECH-DECISIONS.md` | Tech-stack og agent-referansearkitektur |
| `docs/CONVENTIONS.md` | Kodestandard, filstruktur, git-praksis |
| `docs/juridisk/DATABEHANDLERAVTALE.md` | Databehandleravtale-mal |
| `docs/forretning/` | Forretningsplan, roadmap, neste steg |

Når du legger til ny kontekst: opprett dedikert fil i `docs/`, legg til én-linjes-referanse her. CLAUDE.md er indeksen — `docs/` holder dybden.

## Hva dette repoet IKKE er

- **Ikke et SaaS-produkt.** Agentik selger tjenester, ikke software.
- **Ikke et monorepo.** En eneste landingsside, minimal API-funksjon.
- **Ikke Monstr.** Monstr (speed-to-lead SMS for håndverkere) er sunsettet. All Monstr-kode er slettet i april 2026.
