# Skjema-til-N8N implementeringsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Erstatt Make.com som mottaker for skjema-innsendinger med en ny N8N-workflow som gir Attio-oppføring, personlig auto-svar og Slack-varsel — alt i én flyt.

**Architecture:** Skjema → `/api/agentik-contact` → N8N webhook → ny workflow `AI Form Lead Handler`. Workflowen gjenbruker Attio HTTP-noder, Supabase audit, kunnskapsbase, Gmail og Slack fra eksisterende `AI Email Auto-Reply with Knowledge Base`. Klassifisering droppes (vi vet det er en lead). Migrering går via parallell-kjøring i 1-2 dager før Make-scenarioet deaktiveres.

**Tech Stack:** N8N (workflow), Vercel Functions (`api/agentik-contact.js`), Attio CRM v2 API, Gmail, Slack, Supabase (audit + vector store), OpenAI (svar-generering).

**Spec:** [`docs/superpowers/specs/2026-04-25-skjema-til-n8n-design.md`](../specs/2026-04-25-skjema-til-n8n-design.md)

---

## Faste verdier som brukes i planen

| Hva | Verdi |
|---|---|
| N8N project | `Ivar André Knutsen <ivar@agentik.no>` (id: `MwUxGmYeKw0rPRiv`) |
| Eksisterende workflow (referanse) | `AI Email Auto-Reply with Knowledge Base` (id: `dJL4Gk4dO5ZPqAH3`) |
| Slack-kanal | `#social` (samme som eksisterende kjøpsintensjon-varsel) |
| Supabase audit-tabell | `email_log` |
| Attio Sales Pipeline list-id | `809fb8c9-6b2e-46a8-9f5a-8d831bc3e677` |
| Gmail-konto for utsending | `hei@agentik.no` (samme credential som eksisterende workflow) |
| OpenAI-credential | Samme som eksisterende workflow |
| Supabase-credential | Samme som eksisterende workflow |
| Attio Bearer-token | Samme HTTP-header credential som eksisterende workflow |
| Make.com webhook (skal deaktiveres) | `https://hook.eu2.make.com/iedbsay1cbv8urvn2xtmc8k14ejsu028` |

---

## Task 1: Hent SDK-referanse og node-typer fra N8N MCP

**Files:** Ingen filer berøres — MCP-kall for å forberede workflow-bygging.

- [ ] **Step 1.1: Hent N8N SDK-referansen**

Kjør MCP-tool: `mcp__n8n__get_sdk_reference` (uten args) for å få byggemønsteret.

Forventet: dokumentasjon for hvordan workflow-kode struktureres.

- [ ] **Step 1.2: Hent type-definisjoner for nodene vi trenger**

Kjør: `mcp__n8n__get_node_types` med node-IDene:
- `n8n-nodes-base.webhook` (trigger)
- `n8n-nodes-base.set` (normalisering)
- `n8n-nodes-base.httpRequest` (Attio-kall)
- `n8n-nodes-base.supabase` (audit)
- `@n8n/n8n-nodes-langchain.agent` (auto-svar)
- `@n8n/n8n-nodes-langchain.lmChatOpenAi` (modell)
- `@n8n/n8n-nodes-langchain.vectorStoreSupabase` (kunnskapsbase tool)
- `@n8n/n8n-nodes-langchain.embeddingsOpenAi`
- `n8n-nodes-base.gmail` (send svar)
- `n8n-nodes-base.slack` (varsel)

Hvis discriminator-flagg trengs, søk først med `mcp__n8n__search_nodes` og les `resource`/`operation`-verdier.

---

## Task 2: Bygg "AI Form Lead Handler"-workflow

**Files:** Workflow lagres i N8N (ikke i repoet). Workflow-koden skrives som JS for `mcp__n8n__create_workflow_from_code`.

### Workflow-struktur

```
Webhook → Normaliser felter → [parallell:
                                  Opprett person i Attio,
                                  Opprett bedrift i Attio]
       → Legg til notat i Attio
       → Legg til i Sales Pipeline (Attio)
       → Logg i Supabase
       → Generer auto-svar (LangChain agent + kunnskapsbase)
       → Send via Gmail
       → Varsle Slack
```

### Node-konfigurasjoner

**Webhook trigger:**
- HTTP Method: POST
- Path: `agentik-form-lead`
- Response: "Immediately" med `{ success: true }`

**Normaliser felter (Set node):**
- Output:
  ```js
  {
    fornavn: $json.body.fornavn,
    bedrift: $json.body.bedrift,
    epost: $json.body.epost,
    telefon: $json.body.telefon || '',
    maal: $json.body.maal || '',
    domain: ($json.body.epost || '').split('@')[1] || '',
    submitted_at: new Date().toISOString()
  }
  ```

**Opprett person i Attio (HTTP Request):**
- Method: PUT
- URL: `https://api.attio.com/v2/objects/people/records?matching_attribute=email_addresses`
- Auth: Samme HTTP-header credential som eksisterende workflow
- Content-Type: JSON
- Body:
  ```json
  {
    "data": {
      "values": {
        "name": [{
          "first_name": "{{ $('Normaliser felter').item.json.fornavn }}",
          "last_name": "",
          "full_name": "{{ $('Normaliser felter').item.json.fornavn }}"
        }],
        "email_addresses": ["{{ $('Normaliser felter').item.json.epost }}"],
        "phone_numbers": [{ "original_phone_number": "{{ $('Normaliser felter').item.json.telefon }}" }]
      }
    }
  }
  ```
- (Hvis `telefon` er tom: ekskluder `phone_numbers` via `Object.assign` eller IF-node — se Task 2.5)

**Opprett bedrift i Attio (HTTP Request):**
- Method: PUT
- URL: `https://api.attio.com/v2/objects/companies/records`
- Body:
  ```json
  {
    "data": {
      "values": {
        "domains": [{ "domain": "{{ $('Normaliser felter').item.json.domain }}" }],
        "name": [{ "value": "{{ $('Normaliser felter').item.json.bedrift }}" }]
      }
    }
  }
  ```

**Legg til notat (HTTP Request):**
- Method: POST
- URL: `https://api.attio.com/v2/notes`
- Body:
  ```json
  {
    "data": {
      "parent_object": "people",
      "parent_record_id": "{{ $('Opprett person i Attio').item.json.data.id.record_id }}",
      "title": "Skjema-innsending fra agentik.no — {{ $('Normaliser felter').item.json.submitted_at.split('T')[0] }}",
      "format": "plaintext",
      "content": "{{ JSON.stringify('Bedrift: ' + $('Normaliser felter').item.json.bedrift + '\\n' + 'Telefon: ' + ($('Normaliser felter').item.json.telefon || 'ikke oppgitt') + '\\n' + 'E-post: ' + $('Normaliser felter').item.json.epost + '\\n\\n' + 'Mål/kontekst:\\n' + ($('Normaliser felter').item.json.maal || '(ikke spesifisert)')) }}"
    }
  }
  ```

**Legg til i Sales Pipeline (HTTP Request):**
- Method: POST
- URL: `https://api.attio.com/v2/lists/809fb8c9-6b2e-46a8-9f5a-8d831bc3e677/entries`
- Body:
  ```json
  {
    "data": {
      "parent_record_id": "{{ $('Opprett bedrift i Attio').item.json.data.id.record_id }}",
      "parent_object": "companies",
      "entry_values": {}
    }
  }
  ```

**Logg i Supabase (Supabase node):**
- Resource: `row`
- Operation: `create`
- Table: `email_log`
- Felter (matche eksisterende skjema; sjekk via Supabase MCP hvis usikker):
  - `customer_email`: `{{ $('Normaliser felter').item.json.epost }}`
  - `email_subject`: `[FORM] {{ $('Normaliser felter').item.json.bedrift }}`
  - `classification`: `form_lead`
  - `received_at`: `{{ $('Normaliser felter').item.json.submitted_at }}`
- (Hvis tabellen ikke har disse kolonnene: bruk de som finnes, eller utvid med en nullable `source`-kolonne i en oppfølgings-task)

**Generer auto-svar (LangChain agent):**
- Model: gjenbruk samme `lmChatOpenAi`-credential og modell-id som "Svar-modell" i original
- System-prompt:
  ```
  Du er Agentiks første kontaktpunkt. En ny lead har sendt inn skjemaet på agentik.no.

  Lead-data:
  - Fornavn: {{ $('Normaliser felter').item.json.fornavn }}
  - Bedrift: {{ $('Normaliser felter').item.json.bedrift }}
  - Mål/kontekst: {{ $('Normaliser felter').item.json.maal }} (kan være tom)

  Skriv et kort, varmt og konkret svar på norsk (4-6 setninger):
  1. Tiltal med fornavn
  2. Bekreft at vi har mottatt henvendelsen
  3. HVIS maal er fylt ut: speil tilbake hva de skrev og pek kort på hvordan vi typisk hjelper
     med slike utfordringer (bruk kunnskapsbase-toolet for konkret innsikt, ikke generisk fluff).
     HVIS maal er tom: be dem kort beskrive hva de ønsker å snakke om.
  4. Be om 2-3 tidspunkter som passer for et 20-min utforskningsmøte denne eller neste uke.
  5. Avslutt med signatur: "Hilsen Ivar & Ole, Agentik"

  Tone: direkte, ikke salgsspråk, ingen overdrevne løfter, ingen emoji.
  Returner KUN selve e-postteksten, ingen subject-linje.
  ```
- Tools: `Kunnskapsbase` (samme vector store som eksisterende workflow)

**Send via Gmail (Gmail node):**
- Resource: `message`
- Operation: `send`
- To: `{{ $('Normaliser felter').item.json.epost }}`
- Subject: `Re: Henvendelse til Agentik`
- Message: `{{ $('Generer auto-svar').item.json.output }}`
- From: `hei@agentik.no` (samme credential)

**Varsle Slack (Slack node):**
- Resource: `message`
- Operation: `post`
- Channel: `#social`
- Text:
  ```
  🟢 Ny skjema-lead — agentik.no

  *{{ $('Normaliser felter').item.json.fornavn }}* fra *{{ $('Normaliser felter').item.json.bedrift }}*
  📧 {{ $('Normaliser felter').item.json.epost }}
  {{ $('Normaliser felter').item.json.telefon ? '📞 ' + $('Normaliser felter').item.json.telefon : '' }}

  Mål: {{ $('Normaliser felter').item.json.maal ? '«' + $('Normaliser felter').item.json.maal + '»' : '_ikke spesifisert — auto-svar ber om kontekst_' }}

  Auto-svar sendt → ber om 2-3 tidspunkter
  Attio: <https://app.attio.com/agentik/people/{{ $('Opprett person i Attio').item.json.data.id.record_id }}|Åpne i CRM>
  ```

### Bygging

- [ ] **Step 2.1: Skriv workflow-koden**

Bruk SDK-mønsteret fra Task 1 og node-konfigurasjonene over. Workflow-navn: `AI Form Lead Handler`. Description: `Skjema-leads fra agentik.no — Attio + auto-svar + Slack`.

- [ ] **Step 2.2: Valider workflow-koden**

Kjør: `mcp__n8n__validate_workflow` med koden.
Forventet: ingen feil. Hvis feil — fiks og re-valider til ren.

- [ ] **Step 2.3: Opprett workflowen i N8N**

Kjør: `mcp__n8n__create_workflow_from_code` med validert kode + description.
Forventet: workflow opprettet med ID. **Noter ID-en** og **webhook-URL-en** (formatet: `https://<n8n-host>/webhook/agentik-form-lead`).

- [ ] **Step 2.4: Publiser workflowen**

Kjør: `mcp__n8n__publish_workflow` med ID-en fra forrige steg.
Forventet: workflow er aktiv og kan motta webhooks.

---

## Task 3: Test workflowen end-to-end

**Files:** Ingen filendringer — kun testing mot live N8N.

- [ ] **Step 3.1: Send test-payload til webhook**

Kjør:
```bash
curl -X POST <N8N_WEBHOOK_URL_FROM_TASK_2> \
  -H 'Content-Type: application/json' \
  -d '{
    "fornavn": "Testlead",
    "bedrift": "Test AS",
    "epost": "ivar+formtest@agentik.no",
    "telefon": "+47 90 00 00 00",
    "maal": "Vi vil utforske om AI kan automatisere fakturahåndtering"
  }'
```

Forventet: HTTP 200 med `{"success": true}` (eller default N8N webhook-respons).

- [ ] **Step 3.2: Verifiser i Attio**

Åpne https://app.attio.com — sjekk:
- Person `Testlead` finnes med e-post `ivar+formtest@agentik.no`
- Bedrift `Test AS` finnes
- Notat på personen har tittel `Skjema-innsending fra agentik.no — 2026-04-25`
- `Test AS` finnes i Sales Pipeline-listen

- [ ] **Step 3.3: Verifiser auto-svar i Gmail**

Åpne `ivar+formtest@agentik.no`-innboksen (eller hvor enn `+formtest`-aliaset lander). Bekreft:
- E-post mottatt fra `hei@agentik.no`
- Subject: `Re: Henvendelse til Agentik`
- Innhold: tiltaler "Testlead", speiler tilbake fakturahåndterings-utfordringen, ber om 2-3 tidspunkter, signert "Hilsen Ivar & Ole, Agentik"

- [ ] **Step 3.4: Verifiser Slack-varsel**

Åpne `#social` i Slack. Bekreft:
- Melding "🟢 Ny skjema-lead — agentik.no" mottatt
- Inneholder `Testlead`, `Test AS`, e-post, telefon, mål-tekst, lenke til Attio
- Lenken peker til riktig person i Attio

- [ ] **Step 3.5: Test også med tom `maal`**

Kjør curl med `"maal": ""` og bekreft at:
- Slack-varselet sier `_ikke spesifisert — auto-svar ber om kontekst_`
- Auto-svaret ber om beskrivelse av hva de ønsker å snakke om

- [ ] **Step 3.6: Test med tom `telefon`**

Kjør curl uten `telefon`-felt og bekreft at:
- Attio-personen opprettes uten feil (ingen telefon)
- Slack-varselet dropper telefon-linjen

- [ ] **Step 3.7: Rydd opp test-data**

Slett `Testlead`-personen og `Test AS`-bedriften fra Attio så ekte data ikke forurenses. Slett auto-svar-e-postene fra innboksen.

---

## Task 4: Oppdater `/api/agentik-contact.js` for parallell-kjøring

**Files:**
- Modify: `api/agentik-contact.js`

- [ ] **Step 4.1: Oppdater handler til parallell-kjøring**

Erstatt hele filen `api/agentik-contact.js` med:

```js
// Contact form handler for Agentik landing page.
// During migration: forwards to BOTH Make.com and the new N8N workflow
// in parallel. Once N8N is verified stable, the Make.com fork is removed.

const MAKE_WEBHOOK_URL =
  process.env.MAKE_WEBHOOK_URL ||
  'https://hook.eu2.make.com/iedbsay1cbv8urvn2xtmc8k14ejsu028';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fornavn, bedrift, telefon, epost, maal } = req.body || {};

  if (!fornavn || !bedrift || !epost) {
    return res.status(400).json({ error: 'Fornavn, bedrift og epost er påkrevd.' });
  }

  const payload = {
    fornavn,
    bedrift,
    telefon: telefon || '',
    epost,
    maal: maal || '',
    kilde: 'agentik.no',
    opprettet: new Date().toISOString(),
  };

  const targets = [
    { name: 'make', url: MAKE_WEBHOOK_URL },
    N8N_WEBHOOK_URL ? { name: 'n8n', url: N8N_WEBHOOK_URL } : null,
  ].filter(Boolean);

  const results = await Promise.allSettled(
    targets.map((t) =>
      fetch(t.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then(async (response) => {
        if (!response.ok) {
          const body = await response.text();
          throw new Error(`${t.name} ${response.status}: ${body}`);
        }
        return t.name;
      })
    )
  );

  const failures = results.filter((r) => r.status === 'rejected');
  const successes = results.filter((r) => r.status === 'fulfilled');

  if (successes.length === 0) {
    failures.forEach((f) => console.error('Webhook failure:', f.reason));
    return res.status(500).json({ error: 'Kunne ikke lagre henvendelsen.' });
  }

  if (failures.length > 0) {
    failures.forEach((f) => console.error('Partial webhook failure:', f.reason));
  }

  return res.status(200).json({ success: true });
}
```

- [ ] **Step 4.2: Lint**

Kjør: `npm run lint`
Forventet: PASS uten nye warnings/errors i `api/agentik-contact.js`.

- [ ] **Step 4.3: Commit**

```bash
git add api/agentik-contact.js
git commit -m "feat: parallel-run form leads to Make and N8N during migration"
```

---

## Task 5: Bruker setter `N8N_WEBHOOK_URL` i Vercel og deployer

**Files:** Ingen kode-endringer her — manuell Vercel-handling.

- [ ] **Step 5.1: Be brukeren legge til env var**

Be Ivar om å:
1. Åpne Vercel-prosjektet for `agentik.no`
2. Settings → Environment Variables
3. Legg til `N8N_WEBHOOK_URL` = `<URL fra Task 2.3>` for både Production og Preview
4. Bekreft at variabelen er lagret

- [ ] **Step 5.2: Trigger deploy**

Etter env var er lagret:
```bash
git push origin main
```
Vercel deployer automatisk. Bekreft i Vercel-dashboardet at deploy går grønt.

- [ ] **Step 5.3: Verifiser i prod**

Kjør:
```bash
curl -X POST https://agentik.no/api/agentik-contact \
  -H 'Content-Type: application/json' \
  -d '{
    "fornavn": "Prodtest",
    "bedrift": "Prodtest AS",
    "epost": "ivar+prodtest@agentik.no",
    "telefon": "",
    "maal": "produksjonstest av parallell-kjøring"
  }'
```

Forventet:
- HTTP 200 + `{"success": true}`
- Vercel logs viser at både Make og N8N ble kalt
- Attio (via N8N) har personen `Prodtest`
- Attio (via Make) har en duplikat-oppføring (forventet under parallell)
- Slack varslet i `#social`
- Auto-svar mottatt
- Rydd opp begge Attio-oppføringene etter verifikasjon

---

## Task 6: Verifisere parallell-kjøring i 1-2 dager

**Files:** Ingen kode-endringer — observasjon.

- [ ] **Step 6.1: La produksjonen rulle**

Vent 1-2 dager med ekte trafikk. Registrer hver skjema-innsending som kommer inn.

- [ ] **Step 6.2: Sammenlign Make- og N8N-resultater**

For hver skjema-innsending i perioden, bekreft:
- Begge plattformer mottok requesten (Vercel logs)
- Attio har konsistente oppføringer fra begge kilder
- Slack-varsler kommer kun fra N8N (Make sender ikke Slack i dag)
- Auto-svar går kun fra N8N (Make sender ikke auto-svar i dag)
- Ingen feil i Vercel logs

- [ ] **Step 6.3: Beslutning om cutover**

Hvis ingen avvik etter 1-2 dager → gå videre til Task 7.
Hvis avvik → diagnostiser, fiks, og start parallell-perioden på nytt.

---

## Task 7: Cutover — fjern Make.com-fork

**Files:**
- Modify: `api/agentik-contact.js`

- [ ] **Step 7.1: Fjern Make-call og forenkle handler**

Erstatt hele `api/agentik-contact.js` med:

```js
// Contact form handler for Agentik landing page.
// Forwards every submission to a N8N webhook ("AI Form Lead Handler"),
// which creates Attio records, sends an auto-reply, and notifies Slack.

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!N8N_WEBHOOK_URL) {
    console.error('N8N_WEBHOOK_URL is not configured');
    return res.status(500).json({ error: 'Server misconfigured.' });
  }

  const { fornavn, bedrift, telefon, epost, maal } = req.body || {};

  if (!fornavn || !bedrift || !epost) {
    return res.status(400).json({ error: 'Fornavn, bedrift og epost er påkrevd.' });
  }

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fornavn,
        bedrift,
        telefon: telefon || '',
        epost,
        maal: maal || '',
        kilde: 'agentik.no',
        opprettet: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`N8N webhook ${response.status}:`, body);
      return res.status(500).json({ error: 'Kunne ikke lagre henvendelsen.' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Noe gikk galt.' });
  }
}
```

- [ ] **Step 7.2: Lint og commit**

```bash
npm run lint
git add api/agentik-contact.js
git commit -m "refactor: remove Make.com fork now that N8N is stable"
git push origin main
```

- [ ] **Step 7.3: Verifiser deploy**

Vent på Vercel-deploy. Send et test-curl mot `https://agentik.no/api/agentik-contact` med en `+cutover-test`-alias. Bekreft at kun N8N-flyten kjører, ingen Make-trafikk i Make.com-dashbordet.

Rydd opp test-data i Attio.

---

## Task 8: Deaktiver Make.com-scenarioet

**Files:** Ingen kode — bruk Make MCP.

- [ ] **Step 8.1: Finn scenario-ID-en**

Kjør Make MCP: `mcp__claude_ai_Make__scenarios_list` med søk på `agentik` eller `webhook`. Identifiser scenarioet som tar imot fra `iedbsay1cbv8urvn2xtmc8k14ejsu028`-webhooken.

- [ ] **Step 8.2: Deaktiver scenarioet**

Kjør: `mcp__claude_ai_Make__scenarios_deactivate` med scenario-ID.
Forventet: scenario er stoppet, men ikke slettet (rollback-buffer i en uke).

- [ ] **Step 8.3: Sett påminnelse om sletting**

Notér i kalender eller TODO: slett Make-scenarioet om en uke (~2026-05-02). Etter det:
- `mcp__claude_ai_Make__scenarios_delete` med scenario-ID
- Be brukeren fjerne `MAKE_WEBHOOK_URL` env var fra Vercel

---

## Task 9: Oppdater dokumentasjon

**Files:**
- Modify: `docs/PLATTFORM-OG-TEKNOLOGI.md`
- Modify: `docs/TECH-DECISIONS.md`
- Modify: `CLAUDE.md` (bare hvis Make/Attio er nevnt der — sjekk først)

- [ ] **Step 9.1: Erstatt Make-flyten i `docs/PLATTFORM-OG-TEKNOLOGI.md`**

Finn ASCII-diagrammet og avsnittene som beskriver Make.com (linje ~28-60 og ~75-116 ifølge tidligere grep). Erstatt med:

```
Skjema (agentik.no)
       ↓
/api/agentik-contact (Vercel Function)
       ↓
N8N webhook → "AI Form Lead Handler" workflow
       ↓
Attio (person + bedrift + notat + Sales Pipeline)
+ Gmail auto-svar til lead
+ Slack-varsel til #social
+ Supabase audit-log
```

Oppdater env-tabellen: fjern `MAKE_WEBHOOK_URL`, legg til `N8N_WEBHOOK_URL` med beskrivelse "Webhook-endepunkt til N8N AI Form Lead Handler-workflowen".

- [ ] **Step 9.2: Logg avgjørelsen i `docs/TECH-DECISIONS.md`**

Legg til en seksjon (skript dato 2026-04-25):

```markdown
## 2026-04-25 — Konsolidering av lead-flyt på N8N

**Beslutning:** Skjema-innsendinger fra agentik.no rutes nå gjennom samme N8N-instans
som behandler innkommende e-post til hei@agentik.no. Make.com er deaktivert som
mellomledd.

**Hvorfor:** Skjema-leads fortjener samme behandling som cold inbound (auto-svar,
Slack-varsel, Sales Pipeline) — uten å vedlikeholde to parallelle flyter på to
plattformer. N8N hadde allerede den modne "AI Email Auto-Reply"-workflowen med
Attio-, Slack-, Gmail- og kunnskapsbase-noder vi kunne gjenbruke.

**Konsekvenser:** Én plattform for lead-håndtering. Auto-svar med personlig tilpasning
basert på `maal`-feltet. Slack-varsel umiddelbart ved hver skjema-lead. Make.com kan
sies opp hvis ingen andre scenarioer bruker det.
```

- [ ] **Step 9.3: Sjekk og oppdater `CLAUDE.md` om relevant**

```bash
grep -n "Make\|MAKE_WEBHOOK" /Users/ivarknutsen/speedmonstr/CLAUDE.md
```

Hvis treff: erstatt referansene til Make → N8N. Hvis ingen treff: hopp over.

- [ ] **Step 9.4: Commit**

```bash
git add docs/PLATTFORM-OG-TEKNOLOGI.md docs/TECH-DECISIONS.md
# legg til CLAUDE.md hvis endret
git commit -m "docs: update platform docs to reflect N8N lead flow"
git push origin main
```

---

## Suksesskriterier (gjenta fra spec)

1. ✅ Hver skjema-innsending → person + bedrift + notat + Sales Pipeline i Attio (verifisert i Task 3 + Task 6)
2. ✅ Lead får personlig auto-svar innen 30 sek (verifisert i Task 3.3)
3. ✅ Slack varsler innen 30 sek (verifisert i Task 3.4)
4. ✅ Lead-svar fanges av eksisterende e-postagent og kjører booking-flow (regresjons-test ved manuell svar i Task 3)
5. ✅ Make.com deaktivert (Task 8)
6. ✅ `docs/PLATTFORM-OG-TEKNOLOGI.md` reflekterer ny arkitektur (Task 9)

## Rollback-plan

Hvis noe går galt etter Task 7 (cutover):
1. Revert siste commit: `git revert HEAD && git push`
2. Vercel re-deployer automatisk til parallell-kjøring (Task 4-tilstand)
3. Hvis det også er ødelagt: revert til `git revert HEAD~1` (Make-only-tilstand)
4. Re-aktiver Make-scenarioet via `mcp__claude_ai_Make__scenarios_activate` hvis allerede deaktivert

Total rollback-tid: ~1 minutt.
