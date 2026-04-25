# Agentik — Plattform og teknologi

*Sist oppdatert: 2026-04-25*

## Systemarkitektur (landingsside)

```
┌───────────────────────────┐
│   Potensiell kunde        │
│   besøker agentik.no      │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│   Vercel (agentik.no)     │
│   - React 19 SPA (Vite)   │
│   - /  /personvern /vilkar│
└─────────────┬─────────────┘
              │  (skjema)
              ▼
┌───────────────────────────┐
│   /api/agentik-contact    │
│   (Vercel Function, Node) │
└─────────────┬─────────────┘
              │  (POST)
              ▼
┌───────────────────────────┐
│   N8N webhook             │
│   "AI Form Lead Handler"  │
└─────────────┬─────────────┘
              │
   ┌──────────┼──────────────┬─────────────┐
   ▼          ▼              ▼             ▼
┌──────┐  ┌──────┐    ┌──────────┐   ┌──────────┐
│Attio │  │Gmail │    │  Slack   │   │ Supabase │
│CRM   │  │auto- │    │ #social  │   │  (audit) │
│      │  │svar  │    │  varsel  │   │          │
└──────┘  └──────┘    └──────────┘   └──────────┘
```

Lead-håndtering er konsolidert på N8N. Samme N8N-instans driver også `AI Email Auto-Reply with Knowledge Base` som svarer på innkommende e-post til hei@agentik.no — så når en lead svarer på auto-svaret vårt, fanger eksisterende e-postagent svaret og kjører booking-flowen automatisk.

## Teknisk stack

### Landingsside (agentik.no)
| Teknologi | Versjon | Rolle |
|-----------|---------|-------|
| React | 19 | UI-rammeverk |
| Vite | 8 | Bundler og dev-server |
| Tailwind CSS | 3 | Styling |
| GSAP + ScrollTrigger | 3 | Scroll-animasjoner |
| Lucide React | 1 | Ikoner |
| React Router | 7 | Navigasjon |
| React Helmet Async | 3 | SEO og OG-tags |

### API-lag
| Teknologi | Rolle |
|-----------|-------|
| Node.js (Vercel Fluid Compute) | Runtime |
| Vercel Serverless Functions | API-handler (videresender til N8N) |

### Lead-pipeline (N8N)
| Komponent | Rolle |
|-----------|-------|
| Webhook trigger | Mottar skjema-payload fra Vercel-funksjonen |
| Set node | Normaliserer felter (fornavn, bedrift, telefon, epost, maal, domain) |
| Attio HTTP-noder | Oppretter person, bedrift, notat ("Skjema-innsending fra agentik.no — {{dato}}"), Sales Pipeline-oppføring |
| Supabase | Audit-log i `email_log`-tabellen |
| LangChain Agent | Genererer personlig auto-svar (gpt-5-mini + kunnskapsbase via Supabase vector store) |
| Gmail | Sender svaret fra hei@agentik.no |
| Slack | Varsler #social med lead-info og lenke til Attio |

Workflow-id: `Zu6rLrT0bRlDeQb2`. Kjenner du SDK-koden? Den er i N8N — endres direkte i UI eller via `mcp__n8n__update_workflow`.

### Infrastruktur
| Tjeneste | Rolle |
|----------|-------|
| Vercel | Hosting, edge-nettverk, serverless functions, automatisk deploy |
| GitHub | Versjonskontroll, CI/CD trigger |
| N8N (agentiknorway.app.n8n.cloud) | Lead-pipeline, e-postagent, kunnskapsbase |
| Attio | CRM |
| Supabase | Audit-log + kunnskapsbase (vector store) |
| OpenAI | Auto-svar-modell (gpt-5-mini) + embeddings (text-embedding-3-small) |
| Slack | Lead-varsler |
| Gmail (Google Workspace) | hei@agentik.no |

## API-endepunkter

### POST /api/agentik-contact

**Formål:** Mottar innsendinger fra kontaktskjemaet på agentik.no og videresender til N8N-webhooken.

**Input:**
```json
{
  "fornavn": "Ola",
  "bedrift": "Ola AS",
  "telefon": "99887766",
  "epost": "ola@ola.no",
  "maal": "Vi vil automatisere tilbudsprosessen"
}
```

**Validering:**
- `fornavn`, `bedrift`, `epost` påkrevd
- Metode må være POST
- `N8N_WEBHOOK_URL` må være satt i miljøet (returnerer 500 ellers)

**Output til N8N webhook:**
```json
{
  "fornavn": "Ola",
  "bedrift": "Ola AS",
  "telefon": "99887766",
  "epost": "ola@ola.no",
  "maal": "Vi vil automatisere tilbudsprosessen",
  "kilde": "agentik.no",
  "opprettet": "2026-04-25T..."
}
```

**Respons til klient:**
- 200 `{ success: true }` ved OK
- 400 hvis validering feiler
- 500 hvis N8N ikke svarer 2xx, eller hvis `N8N_WEBHOOK_URL` mangler

## Miljøvariabler

| Variabel | Tjeneste | Bruk |
|----------|----------|------|
| `N8N_WEBHOOK_URL` | N8N | Webhook-endepunkt til AI Form Lead Handler-workflowen |

`MAKE_WEBHOOK_URL` ble brukt frem til 2026-04-25 og er fjernet. Make-scenarioet `Agentik · kontaktskjema → Attio + auto-svar` er deaktivert. Kan slettes etter en ukes rollback-periode (~2026-05-02).

## Deploymentflyt

```
Utvikler pusher til main
        │
        ▼
Vercel bygger automatisk (Vite build)
        │
        ├── Preview deployment (per branch/PR)
        │
        └── Produksjonsdeployment (main)
              │
              ├── agentik.no (SPA)
              └── /api/agentik-contact (Serverless Function)
```

### vercel.json
- SPA rewrite: alle ruter (bortsett fra `/api/*` og `/aiarendal`) → `/index.html`
- `/aiarendal` → statisk HTML

## Hva vi bygger for kunder

Landingssiden er Agentik-presentasjonen. Selve tjenesten — AI-agenter — bygges per kundeprosjekt. Stack og referansearkitektur for agent-leveranser er dokumentert i `docs/TECH-DECISIONS.md` under "Agent-stack".

## Fremtidig utvidelse

- **Presentation-deck** (`presentation/index.html`) — brukes på keynotes, vedlikeholdes som en del av landing-repoet
- **/aiarendal** — statisk event-landing for AI Arendal, ruter til `public/aiarendal.html`
- **Blogg/case studies** — ikke bygget ennå, men ville lagt til som egen rute når det er innhold verdt å publisere
