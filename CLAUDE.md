# Agentik — AI-studio for norske bedrifter

## Hva dette prosjektet er

Agentik er et norsk AI-studio som bygger AI-agenter for norske bedrifter. Vi kartlegger hvor AI gir verdi, prioriterer etter ROI, og bygger agentene i produksjon — fra stemme-resepsjonist til faktura-agent.

Dette repoet inneholder **agentik.no** — landingssiden som selger studiet. Selve agent-leveransene lever i egne, kundespesifikke repoer.

## Repostruktur

```
speedmonstr/                  ← repo-navnet er fortsatt fra tidligere (Monstr-arven). Ikke kritisk å endre.
├── CLAUDE.md                 ← Du er her
├── index.html                Landing page entry (Plus Jakarta Sans + JetBrains Mono)
├── src/
│   ├── main.jsx              Router: /, /personvern, /vilkar
│   ├── index.css             Tailwind + globale styles
│   └── pages/
│       ├── NySide.jsx        Hovedsiden (Agentik-landingen)
│       ├── Personvern.jsx
│       └── Vilkar.jsx
├── api/
│   └── agentik-contact.js    POST-endepunkt → Make.com → Attio
├── public/                   Statiske assets (hero-video, logoer, team, klientlogoer)
│   ├── aiarendal.html        AI Arendal event-landing
│   ├── skills/               Claude-skill-kort (PDF/MD)
│   └── claude-verktoykassen.zip
├── presentation/             HTML keynote-deck for events
├── docs/                     Intern dokumentasjon (norsk)
├── vercel.json
├── package.json              name: "agentik"
├── tailwind.config.js        Agentik-palette (cream, deep slate, petrol, signal, copper)
└── vite.config.js
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
| Lead-flyt | Kontaktskjema → `/api/agentik-contact` → Make.com (EU2) → Attio CRM |
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

## Kontaktskjema-flyten

1. Bruker fyller ut skjema på `/` (NySide.jsx)
2. POST til `/api/agentik-contact` med `{ fornavn, bedrift, telefon, epost, maal }`
3. API videresender til `MAKE_WEBHOOK_URL` (standard: `hook.eu2.make.com/...`) med `kilde: "agentik.no"`
4. Make.com router leadet inn i Attio CRM og sender eventuelle varsler

Eneste miljøvariabel: `MAKE_WEBHOOK_URL` (har fallback, men settes i Vercel).

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
| AI Opportunity Audit | 50 000 kr | Fast pris, 30 dager |
| Agent-implementering | 50 000 – 300 000 kr | Prosjekt per agent |
| Workshop (halvdag/heldag) | 15 000 – 45 000 kr | Engangshendelse |
| Løpende rådgivning | 2 500 kr/t | Retainer eller time |

Audit-investeringen (50 000 kr) trekkes fra første implementering. Se `docs/agentik/HVA-ER-AGENTIK.md` for full produktbeskrivelse.

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
| `docs/agentik/MALGRUPPE.md` | Målgruppedefinisjon |
| `docs/agentik/INNHOLDSSTRATEGI.md` | Innholds- og markedsføringsstrategi |
| `docs/MERKEVARE-OG-DESIGN.md` | Merkevareidentitet, farger, typografi, designsystem |
| `docs/PLATTFORM-OG-TEKNOLOGI.md` | Systemarkitektur, API, miljøvariabler, deployment |
| `docs/TECH-DECISIONS.md` | Tech-stack og agent-referansearkitektur |
| `docs/CONVENTIONS.md` | Kodestandard, filstruktur, git-praksis |
| `docs/juridisk/DATABEHANDLERAVTALE.md` | Databehandleravtale-mal |
| `docs/forretning/` | Forretningsplan, roadmap, neste steg |

Når du legger til ny kontekst: opprett dedikert fil i `docs/`, legg til én-linjes-referanse her. CLAUDE.md er indeksen — `docs/` holder dybden.

## Hva dette repoet IKKE er

- **Ikke et SaaS-produkt.** Agentik selger tjenester, ikke software.
- **Ikke et monorepo.** En eneste landingsside, minimal API-funksjon.
- **Ikke Monstr.** Monstr (speed-to-lead SMS for håndverkere) er sunsettet. All Monstr-kode er slettet i april 2026.
