# Automasjoner

Oversikt over alle live N8N-workflows som driver Agentik-driften. Hver workflow har sin egen MD-fil her med detaljer (noder, credentials, gotchas, hvordan endre).

## Live workflows

| Workflow | ID | Trigger | Formål |
|---|---|---|---|
| [AI Form Lead Handler](./ai-form-lead-handler.md) | `Zu6rLrT0bRlDeQb2` | Webhook (POST `/agentik-form-lead`) | Skjema-leads fra agentik.no → Attio + auto-svar + Slack |
| [AI Email Auto-Reply with Knowledge Base](./ai-email-auto-reply.md) | `dJL4Gk4dO5ZPqAH3` | Gmail (innkommende til hei@agentik.no) | Klassifiserer og svarer på innkommende e-post, håndterer booking-flyt og kjøpsintensjon |
| [AI Assessment Handler](./ai-assessment-handler.md) | `Pv1Aj3Vg38ogshQ8` | Webhook (POST `/agentik-assessment`) | Pre-assessment fra `/takk` → finner Attio-person, legger til strukturert notat, Slack-varsel + business case-estimat |

## Felles infrastruktur

Begge workflowene deler dette:

### N8N
- **Cloud-host:** `agentiknorway.app.n8n.cloud`
- **Project:** `Ivar André Knutsen <ivar@agentik.no>` (id: `MwUxGmYeKw0rPRiv`)
- **Endring via SDK:** bruk `mcp__n8n__update_workflow` med workflow-ID. Husk: `update_workflow` regenererer credential-referanser, så Slack og HTTP Bearer-credentials må re-lenkes manuelt i UI etter hver SDK-oppdatering.
- **Endring via UI:** åpne `https://agentiknorway.app.n8n.cloud/workflow/<workflow-id>`

### Credentials (lever i N8N, deles mellom workflows)
| Type | N8N-navn | Brukes av |
|---|---|---|
| HTTP Bearer Auth | (Attio API-token, ikke auto-link-bart) | Alle Attio HTTP-noder i begge workflows |
| Supabase API | "Supabase account" | Audit-log + kunnskapsbase vector store |
| OpenAI API | "OpenAI account" | Klassifiserings-modell, svar-modell, embeddings |
| Gmail OAuth2 | "Gmail OAuth2 API" | Send/lese e-post fra hei@agentik.no |
| Slack | (slackApi, ikke auto-link-bart) | Varsler til #social |
| Google Calendar OAuth2 | (Google API) | Booking-flyt i e-post-agenten (Ivar/Ole/Agentik-kalendere) |

### Attio CRM
- **API-base:** `https://api.attio.com/v2`
- **Auth:** Bearer-token i `Authorization`-header (samme credential begge workflows)
- **Standard-headers:** `Content-Type: application/json`
- **Endpoints brukt:**
  - `PUT /objects/people/records?matching_attribute=email_addresses` — opprett/upsert person
  - `PUT /objects/companies/records?matching_attribute=domains` — opprett/upsert bedrift (krever query param!)
  - `POST /notes` — legg notat på person eller bedrift
  - `POST /lists/<list-id>/entries` — legg oppføring i pipeline
- **Sales Pipeline list-id:** `809fb8c9-6b2e-46a8-9f5a-8d831bc3e677`

**Gotcha:** Attio PUT mot `/records` krever `?matching_attribute=...`-query-param for å fungere. Uten den får du `400 Bad request - Query params validation error`. For people: `email_addresses`. For companies: `domains`.

### Supabase
- **Audit-tabell:** `email_log`
  - Kolonner: `direction`, `gmail_message_id`, `gmail_thread_id`, `from_address`, `to_address`, `subject`, `body`, `classification`, `created_at`
- **Vector store-tabell:** `documents` (kunnskapsbase med embeddings)
- **Embeddings-modell:** `text-embedding-3-small` (1536-dim)

### Slack
- **Workspace:** Agentik
- **Kanal for varsler:** `#social`

### OpenAI
- **Default-modell:** `gpt-5-mini` (både klassifisering og svar-generering)
- **Embeddings:** `text-embedding-3-small`

## Når du legger til en ny automasjon

1. Bygg workflow i N8N (helst via SDK + `mcp__n8n__create_workflow_from_code` for sporbarhet)
2. Test med curl/event mot trigger
3. Opprett en ny MD-fil i denne mappa etter samme mal som de eksisterende
4. Legg til én rad i tabellen øverst i denne README-en
5. Hvis automasjonen påvirker repo-koden eller env-vars: oppdater `docs/PLATTFORM-OG-TEKNOLOGI.md`
