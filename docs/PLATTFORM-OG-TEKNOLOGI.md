# Agentik — Plattform og teknologi

*Sist oppdatert: 2026-04-24*

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
              │
              ▼
┌───────────────────────────┐
│   Make.com (EU2 region)   │
│   Webhook: iedbsay1...    │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│   Attio CRM               │
│   Lead opprettet +        │
│   oppfølging trigget      │
└───────────────────────────┘
```

Agentik-landingssiden er med vilje en enkel SPA. All logikk rundt leadhåndtering skjer i Make.com slik at vi kan endre flyten (varsling, berikelse, scoring) uten å deploye kode.

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
| Vercel Serverless Functions | API-handler |
| Make.com | Webhook-ruting til CRM |
| Attio | CRM og lead-oppfølging |

### Infrastruktur
| Tjeneste | Rolle |
|----------|-------|
| Vercel | Hosting, edge-nettverk, serverless functions, automatisk deploy |
| GitHub | Versjonskontroll, CI/CD trigger |
| Make.com | Integrasjonsplattform (EU2-region, EU-lagret data) |
| Attio | CRM |

## API-endepunkter

### POST /api/agentik-contact

**Formål:** Mottar innsendinger fra kontaktskjemaet på agentik.no og videresender til Make → Attio.

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

**Output til Make.com webhook:**
```json
{
  "fornavn": "Ola",
  "bedrift": "Ola AS",
  "telefon": "99887766",
  "epost": "ola@ola.no",
  "maal": "Vi vil automatisere tilbudsprosessen",
  "kilde": "agentik.no",
  "opprettet": "2026-04-24T..."
}
```

**Respons til klient:**
- 200 `{ success: true }` ved OK
- 400 hvis validering feiler
- 500 hvis Make ikke svarer 2xx

## Miljøvariabler

| Variabel | Tjeneste | Bruk |
|----------|----------|------|
| `MAKE_WEBHOOK_URL` | Make.com | Webhook-endepunkt (default hardkodet som fallback) |

Få eksterne secrets — Attio-token og ruting lever i Make.

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
