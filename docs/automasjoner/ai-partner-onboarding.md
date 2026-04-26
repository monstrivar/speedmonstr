# AI Partner Onboarding — n8n-workflows (skal bygges)

> To workflows som orkestrerer onboarding fra «yes» til «i drift». Begge bruker Notion API + Supabase + Slack.

## Status

**Blueprint** — krever at du setter opp Notion API-integrasjon og linker credentials i n8n UI. Estimert tid: 30-45 min.

## Forutsetninger

### 1. Opprett Notion API-integrasjon

1. Gå til https://www.notion.so/profile/integrations
2. Klikk «New integration»
3. Navn: «Agentik n8n», workspace: din
4. Kopier «Internal Integration Token» (`ntn_...`)
5. **Del databasene med integrasjonen:**
   - Åpne hver av de 5 Agentik-databasene i Notion
   - Klikk «...» (tre prikker) → «Connections» → velg «Agentik n8n»
   - Gjenta for: Klienter, Nøkkelpersoner, Onboarding-oppgaver, Arbeidsoppgaver, Møter

### 2. Sett env-variabler på Vercel

```
N8N_ONBOARDING_INIT_WEBHOOK_URL=https://agentiknorway.app.n8n.cloud/webhook/agentik-onboarding-init
N8N_ONBOARDING_SUBMIT_WEBHOOK_URL=https://agentiknorway.app.n8n.cloud/webhook/agentik-onboarding-submit
ONBOARDING_INIT_SECRET=<lag en lang random string>
```

## Database-IDer (sjekkliste)

```
Klienter            : 870cf648-c6fb-4465-8629-6aecf6dd8914
Nøkkelpersoner      : bf37ec74-1ca3-427b-aae2-55198f1ef599
Onboarding-oppgaver : 84ea0306-8c4b-4d75-861c-8416f76d880c
Arbeidsoppgaver     : aaab3865-fb90-4408-9f5a-ca5b18551e32
Møter               : 2d57d48b-d89a-4301-8c4c-aa481b7bda41
```

---

## Workflow 1: «AI Partner Onboarding INIT»

**Trigger:** Webhook `POST /agentik-onboarding-init`

**Input payload (fra `/api/agentik-onboarding-init.js`):**
```json
{
  "id": "uuid",
  "token": "abc123...",
  "bedrift": "Bedrift AS",
  "daglig_leder": "Ola Nordmann",
  "daglig_leder_epost": "ola@bedrift.no",
  "daglig_leder_telefon": "+47...",
  "bedrift_domene": "bedrift.no",
  "org_nr": "999999999",
  "pris_per_mnd": 39000,
  "intern_kommentar": "Møtt på event",
  "created_by": "Ivar",
  "onboarding_url": "https://agentik.no/onboarding/abc123...",
  "created_at": "2026-04-26T..."
}
```

### Noder

#### 1. Webhook (trigger)
- Path: `agentik-onboarding-init`
- Response: `{"success":true}`

#### 2. Normaliser felter (Set)
Generer slug, sprint-slutt-dato:
```js
slug         = bedrift.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
onboardingDt = new Date().toISOString().split('T')[0]
sprintSlutt  = new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0]
```

#### 3. Opprett klient i Notion (HTTP POST)
- URL: `https://api.notion.com/v1/pages`
- Auth: HTTP Header Auth (Authorization: Bearer NOTION_TOKEN)
- Headers:
  - `Notion-Version: 2022-06-28`
  - `Content-Type: application/json`
- Body:
```json
{
  "parent": { "database_id": "870cf648-c6fb-4465-8629-6aecf6dd8914" },
  "properties": {
    "Bedrift": { "title": [{"text": {"content": "{{ bedrift }}"}}] },
    "Status": { "select": { "name": "Onboarding" } },
    "Slug": { "rich_text": [{"text": {"content": "{{ slug }}"}}] },
    "Onboarding-token": { "rich_text": [{"text": {"content": "{{ token }}"}}] },
    "Pris/mnd": { "number": {{ pris_per_mnd }} },
    "Onboarding-dato": { "date": { "start": "{{ onboardingDt }}" } },
    "Sprint-slutt": { "date": { "start": "{{ sprintSlutt }}" } },
    "Daglig leder": { "rich_text": [{"text": {"content": "{{ daglig_leder }}"}}] },
    "Daglig leder e-post": { "email": "{{ daglig_leder_epost }}" },
    "Daglig leder telefon": { "phone_number": "{{ daglig_leder_telefon }}" },
    "Org.nr": { "rich_text": [{"text": {"content": "{{ org_nr }}"}}] },
    "Bedrift-domene": { "url": "https://{{ bedrift_domene }}" }
  }
}
```
- Output: Notion returnerer `{ id: "page-uuid", ... }` — vi trenger `id` til neste steg

#### 4. Oppdater Supabase med Notion page-ID (Supabase node)
- Resource: row, Operation: update
- Table: `onboardings`
- Match: token = `{{ token }}`
- Fields:
  - `notion_klient_page_id`: `{{ $('Opprett klient i Notion').item.json.id }}`
  - `notion_klient_url`: `{{ $('Opprett klient i Notion').item.json.url }}`
  - `status`: `form_sent`

#### 5. Opprett 5 initielle onboarding-oppgaver (HTTP POST × 5 i parallell, eller én Code node som loop'er)

Tasks:
| # | Oppgave | Tildelt | Type |
|---|---|---|---|
| 1 | Spille inn personlig Loom-velkomstvideo | Ivar | Video |
| 2 | Send onboarding-mail til kunden | System | E-post |
| 3 | Forbered velkomstgave-pakke | Ole | Gave |
| 4 | Generer kontrakt og send via Vipps eSign | Ivar | Kontrakt |
| 5 | Opprett Slack-kanal #partner-{slug} | Ivar | Slack |

For hver task — POST til `https://api.notion.com/v1/pages`:
```json
{
  "parent": { "database_id": "84ea0306-8c4b-4d75-861c-8416f76d880c" },
  "properties": {
    "Oppgave": { "title": [{"text": {"content": "{{ task_navn }}"}}] },
    "Klient": { "relation": [{"id": "{{ klient_page_id }}"}] },
    "Status": { "select": { "name": "Todo" } },
    "Tildelt": { "select": { "name": "{{ tildelt }}" } },
    "Type": { "select": { "name": "{{ type }}" } }
  }
}
```

#### 6. Send onboarding-mail til kunden (Gmail)
- To: `{{ daglig_leder_epost }}`
- Subject: `Velkommen, {{ daglig_leder }} — Agentik AI-Partner`
- Body (HTML):
```
Hei {{ daglig_leder }},

stas å ha {{ bedrift }} med oss som AI-Partner.

For å forberede de neste 90 dagene godt, ber vi deg fylle ut et kort skjema (5–8 min):

→ {{ onboarding_url }}

Vi setter opp arbeidsrommet, sender Slack-invitasjoner og book intro-møter med teamet ditt så snart skjemaet er inne.

Spør oss om alt — vi er på Slack hver virkedag.

Hilsen Ivar & Ole
Agentik
```

#### 7. Varsle Slack (#social)
- Channel: #social
- Message:
```
:tada: *Ny AI-Partner: {{ bedrift }}*

Daglig leder: {{ daglig_leder }} ({{ daglig_leder_epost }})
Pris: {{ pris_per_mnd }} kr/mnd

Onboarding-form: {{ onboarding_url }}
Notion-klient: {{ notion_klient_url }}

Initielle 5 oppgaver er opprettet i Notion. Følg dem.
```

---

## Workflow 2: «AI Partner Onboarding SUBMIT»

**Trigger:** Webhook `POST /agentik-onboarding-submit`

**Input payload (fra `/api/agentik-onboarding/[token].js` POST):**
```json
{
  "token": "abc123...",
  "id": "uuid",
  "bedrift": "Bedrift AS",
  "daglig_leder_epost": "ola@bedrift.no",
  "form_data": {
    "bedrift": "Bedrift AS",
    "orgNr": "999999999",
    "bedriftDomene": "bedrift.no",
    "besoksAdresse": "Storgata 1, 4800 Arendal",
    "dagligLederNavn": "Ola Nordmann",
    "dagligLederTittel": "Daglig leder",
    "dagligLederEpost": "ola@bedrift.no",
    "dagligLederTelefon": "+47...",
    "fakturaSamme": "Ja",
    "fakturaEpost": "",
    "fakturaReferanse": "",
    "fakturaAdresse": "",
    "nokkelpersoner": [
      { "navn": "Kari", "rolle": "Salg", "epost": "...", "telefon": "...", "omrade": "Salg", "inviterSlack": true, "bookIntro": true },
      { "navn": "Per", "rolle": "Drift", ... }
    ],
    "systemer": ["HubSpot", "Slack", ...],
    "systemerAnnet": "Egen CRM ved navn ...",
    "brandUrl": "...",
    "brandFarger": "...",
    "konfidensialitet": "Ja — vi kan brukes som referanse",
    "foretrukketKanal": "Slack",
    "arbeidstid": "man-fre 08-16",
    "gaveAdresseSamme": "Ja",
    "gaveAdresse": "",
    "allergier": "...",
    "tilgangsTid": "Innen 1 uke",
    "spesielleHensyn": "..."
  },
  "submitted_at": "2026-04-26T..."
}
```

### Noder

#### 1. Webhook (trigger) — path: `agentik-onboarding-submit`

#### 2. Hent Notion klient page-ID (Supabase query)
- Match: token = `{{ token }}`
- Returner: `notion_klient_page_id`

#### 3. Oppdater Notion klient-side med form-data (HTTP PATCH)
- URL: `https://api.notion.com/v1/pages/{{ notion_klient_page_id }}`
- Body: oppdaterer Status til "Aktiv Sprint", legger til faktura-info, adresse, konfidensialitet, etc.

#### 4. Loop: Opprett rad i Nøkkelpersoner for hver person
For hver `nokkelpersoner[i]`:
- POST `https://api.notion.com/v1/pages`
- Body:
```json
{
  "parent": { "database_id": "bf37ec74-1ca3-427b-aae2-55198f1ef599" },
  "properties": {
    "Navn": { "title": [{"text": {"content": "{{ p.navn }}"}}] },
    "Klient": { "relation": [{"id": "{{ klient_page_id }}"}] },
    "Rolle": { "rich_text": [{"text": {"content": "{{ p.rolle }}"}}] },
    "E-post": { "email": "{{ p.epost }}" },
    "Telefon": { "phone_number": "{{ p.telefon }}" },
    "Område": { "select": { "name": "{{ p.omrade }}" } },
    "Inviter til Slack": { "checkbox": {{ p.inviterSlack }} },
    "Skal book intro-møte": { "checkbox": {{ p.bookIntro }} }
  }
}
```

#### 5. Loop: For hver person med `bookIntro=true`, opprett intro-møte-oppgave
POST til Onboarding-oppgaver:
```json
{
  "Oppgave": "Book intro-møte (15 min) med {{ p.navn }} — {{ p.rolle }}",
  "Klient": [klient_page_id],
  "Status": "Todo",
  "Tildelt": "Ivar",
  "Type": "Møte"
}
```

#### 6. Opprett øvrige onboarding-oppgaver
| Oppgave | Tildelt | Type |
|---|---|---|
| Send velkomstgave til {{ adresse }} | Ole | Gave |
| Book kickoff-møte med daglig leder + nøkkelpersoner | Ivar | Møte |
| Inviter {{ N }} personer til Slack-kanal | Ivar | Slack |
| Opprett Fiken-kunde og første faktura | Ivar | Faktura |
| Sett opp dashbord på agentik.no/partner/{{ slug }} | Ivar | Dashbord |
| Gjennomgå brand-assets fra {{ brandUrl }} | Ivar | Notion |

#### 7. Send oppfølgings-mail til kunden
Bekreft at vi har mottatt skjema, sier hva som skjer videre.

#### 8. Slack-varsel til #social
Sammendrag:
```
:white_check_mark: *Onboarding-skjema fullført: {{ bedrift }}*

{{ N }} nøkkelpersoner registrert
{{ N_intro }} intro-møter å book
Kickoff: book innen 5 virkedager

Notion-klient: {{ notion_klient_url }}
```

---

## Hvordan bygge dette i n8n

1. Opprett workflow «AI Partner Onboarding INIT»
2. Bygg nodene over (eller bruk `mcp__n8n__create_workflow_from_code` med koden i denne docen)
3. Link credentials manuelt:
   - Notion HTTP Header Auth (Authorization: Bearer ntn_...)
   - Supabase API
   - Gmail OAuth2 (eksisterende)
   - Slack OAuth2 (eksisterende)
4. Aktiver + publiser
5. Test med curl mot `/api/agentik-onboarding-init`
6. Gjenta for SUBMIT-workflow

## Manuell V1-løsning hvis du ikke vil bygge n8n ennå

Inntil n8n er på plass kan du:
1. Kjøre `/api/agentik-onboarding-init` (lagrer i Supabase)
2. Manuelt opprette Notion klient-side (kopier fra forrige kunde)
3. Manuelt opprette tasks i Notion
4. Manuelt sende e-post til kunden med onboarding-link

API-en vil fortsatt logge alt i Supabase, så data er trygt selv uten n8n.
