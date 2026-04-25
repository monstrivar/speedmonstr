# Tekniske beslutninger

> Referansedokument for CLAUDE.md. Begrunnelser for tekniske valg på Agentik-landing og i agent-leveranser.

*Sist oppdatert: 2026-04-24*

---

## Landingsside-stack

- **React 19 + Vite + JSX** — enkelt, raskt, ingen TypeScript-overhead på en stort sett ferdig landingsside. Ikke refaktorer til TS uten grunn.
- **Tailwind CSS v3** — utility-first, token-systemet i `tailwind.config.js` holder merkevaren konsistent
- **react-router-dom v7** — enkel ruting, tre ruter (`/`, `/personvern`, `/vilkar`)
- **react-helmet-async** — per-side SEO/OG-metadata
- **GSAP + ScrollTrigger** — animasjoner med cinematografisk følelse. Tyngre enn Framer Motion, men NySide-komponenten er allerede bygget rundt den
- **Lucide React** — strektegnede ikoner, konsistent med merkevaren

## API-laget

- **Vercel Serverless Functions** (Node.js) — `api/agentik-contact.js`. En eneste endpoint for kontaktskjemaet.
- **N8N → Attio + Gmail + Slack + Supabase** — kontaktskjemaet poster til N8N-webhooken `AI Form Lead Handler`. Workflowen oppretter person, bedrift, notat og Sales Pipeline-oppføring i Attio, genererer personlig auto-svar via gpt-5-mini med kunnskapsbase (Supabase vector store), sender svaret fra hei@agentik.no, og varsler #social i Slack. Hele flyten er detaljert i `docs/PLATTFORM-OG-TEKNOLOGI.md`.

Hvorfor N8N og ikke Make.com: lead-håndteringen krevde mer enn ren CRM-ruting — auto-svar med kunnskapsbase, Slack-varsler, Supabase audit, og samme behandling som inngående e-post (som allerede kjørte i N8N via `AI Email Auto-Reply with Knowledge Base`). Konsolidering på N8N betyr én plattform å vedlikeholde, og når en lead svarer på vårt auto-svar fanges svaret av eksisterende e-postagent som kjører booking-flowen automatisk.

**Migreringsdato:** 2026-04-25 — se `docs/superpowers/specs/2026-04-25-skjema-til-n8n-design.md` for designrasjonale.

## Hosting

- **Vercel** — samme plattform for landingsside og API. Null deploy-konfigurasjon, preview URLs per PR.
- **Custom domene:** agentik.no

## Agent-stack (det vi bygger til kunder)

Dette er teknologiene vi vanligvis anbefaler og bygger med — ikke låst, men standard-startpunkt:

| Område | Default | Alternativer |
|--------|---------|--------------|
| LLM | Anthropic Claude (Opus/Sonnet/Haiku) | OpenAI, Google Gemini der relevant |
| Agent-rammeverk | Claude Agent SDK, Vercel AI SDK | LangGraph for komplekse state-machines |
| Kode-tooling | Claude Code | Cursor, Windsurf |
| Orkestrering | Vercel Workflow / AI Gateway | Temporal for durable workflows |
| Vektorsøk | Embed direkte via Gateway | Pinecone, Supabase pgvector |
| Stemme-agent | Vapi eller Retell + Claude backend | Twilio Voice + egen stack |
| Automasjon | N8N | Make.com, Zapier |
| CRM-integrasjon | Attio, HubSpot | Salesforce for større kunder |
| Backend | Supabase | PostgreSQL + Vercel Functions |
| Observability | LangSmith, Langfuse | PostHog, egen logging |

## Prinsipper for agent-leveranser

1. **Start i Claude Code-miljø.** All agent-kode lever i git, ikke i en no-code-plattform.
2. **Produksjon fra dag én.** Pilot = fungerer i ekte workflow med ekte data. Ingen "proof of concept" som ikke kjører.
3. **Tydelig evaluering.** Hver agent skal ha en liten evals-suite — input/output-par vi kan kjøre mot nye modellversjoner.
4. **Kunden skal eie koden.** Kode leveres via git-repo til kunden. Vi gir bruksrett til våre generiske mønstre, ikke eksklusiv.
5. **Observability fra start.** Log alt: prompts, tokens, kostnad, latens, utfall. Uten dette er det umulig å forbedre agenten.

## State management (på landingssiden)

- Ingen global state manager — React Context for det som deles, `useState` for lokal UI-state
- TanStack Query er ikke i bruk på landingssiden (lite server-state) men er default når vi bygger dashboards for kunder
