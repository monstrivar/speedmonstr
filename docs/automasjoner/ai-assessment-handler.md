# AI Assessment Handler

> Mottar svar fra `/takk`-skjemaet, finner Attio-personen, legger til strukturert pre-assessment-notat med business case-estimat, og varsler i Slack.

- **Workflow ID:** `Pv1Aj3Vg38ogshQ8`
- **URL:** https://agentiknorway.app.n8n.cloud/workflow/Pv1Aj3Vg38ogshQ8
- **Production webhook:** `https://agentiknorway.app.n8n.cloud/webhook/agentik-assessment`
- **Test webhook:** `https://agentiknorway.app.n8n.cloud/webhook-test/agentik-assessment`

---

## Aktivering — det du må gjøre én gang

1. **Link Attio-credentials manuelt** i n8n UI på begge HTTP-nodene:
   - `Finn person i Attio`
   - `Legg til assessment-notat`

   Bruk samme bearer-token som ligger på `AI Form Lead Handler`-workflowen (HTTP Bearer Auth — Attio API Token).

2. **Sett env-variabel på Vercel:**
   ```
   N8N_ASSESSMENT_WEBHOOK_URL=https://agentiknorway.app.n8n.cloud/webhook/agentik-assessment
   ```

3. **Aktiver workflow** i UI.

4. **Test:**
   ```bash
   curl -X POST https://agentik.no/api/agentik-assessment \
     -H "Content-Type: application/json" \
     -d '{
       "fornavn": "Test",
       "epost": "test-assessment@example.com",
       "bedrift": "Test AS",
       "submittedAt": "2026-04-26T14:00:00.000Z",
       "answers": {
         "rolle": "Daglig leder",
         "antallAnsatte": "26-50",
         "avdelinger": ["Salg", "Support / kundeservice"],
         "friksjonOmrader": ["Treg oppfølging av kunder/leads"],
         "unodvendigTid": "Test",
         "supportVolum": "51-100",
         "salgsVolum": "11-25",
         "manuelleTimer": "21-40 timer",
         "forsteArbeidsflyt": "Test arbeidsflyt",
         "aiTestet": "Ja, litt",
         "aiBlokkering": ["Vi mangler tid"],
         "suksessMaal": "Test suksess",
         "verdiPrioritet": ["Spart tid"],
         "kontaktperson": "Test",
         "tilgangsTid": "Innen 1 uke",
         "endringsvilje": "Ja"
       }
     }'
   ```

---

## Flyt

```
Webhook (POST /agentik-assessment)
  → Normaliser felter (Set)
  → Format assessment (Code — bygger markdown + business case-estimat)
  → Finn person i Attio (HTTP PUT — upsert via e-post, returnerer record_id)
  → Legg til assessment-notat (HTTP POST /v2/notes)
  → Varsle Slack (#social)
```

---

## Noder i detalj

### 1. `Assessment-innsending` (Webhook)
- POST `/agentik-assessment`
- Response mode: `onReceived` (returnerer 200 umiddelbart)
- Mottar payload fra `api/agentik-assessment.js` på Vercel

### 2. `Normaliser felter` (Set)
Ekstraherer felter fra `body`:
- `fornavn`, `epost`, `bedrift`, `submittedAt`, `submitted_date` (yyyy-mm-dd), `answers` (object)

### 3. `Format assessment` (Code, runOnceForEachItem)
Bygger markdown-struktur på alle svarene:
- Kontekst (rolle, ansatte, avdelinger)
- Friksjon (områder, unødvendig tid)
- Volum (support, salg, manuelle timer)
- Den viktigste arbeidsflyten
- AI i dag (testet, blokkering)
- Suksess-mål (90 dager + verdi-prioritet)
- Implementering (kontakt, tilgang, vilje)

Beregner også **business case-estimat**:
- Mapper `manuelleTimer` til antatt timer/uke
- Antar 30% kan automatiseres realistisk i Sprint
- Multipliser med 800 kr/time × 52 uker
- Sammenlign mot 117 000 kr Founding-investering = ROI-multiplier

Output: `assessmentMd` (full markdown) + `businessCaseLine` (kort sammendrag for Slack).

### 4. `Finn person i Attio` (HTTP PUT)
- `PUT /v2/objects/people/records?matching_attribute=email_addresses`
- Idempotent upsert — finner eksisterende person opprettet av `AI Form Lead Handler` ved første skjema. Hvis personen ikke finnes (sjelden — direkte navigasjon til /takk), opprettes den.
- Returnerer `data.id.record_id`

### 5. `Legg til assessment-notat` (HTTP POST)
- `POST /v2/notes`
- `parent_object: people`, `parent_record_id` fra forrige node
- `title: "Pre-assessment — yyyy-mm-dd"`
- `content`: full markdown fra `Format assessment` (JSON.stringify-escapet)

### 6. `Varsle Slack` (Slack post)
- Channel: `#social`
- Innhold:
  - Hvem (navn + bedrift + e-post)
  - Den viktigste arbeidsflyten (fokus-punkt)
  - Volum (manuelle timer + support)
  - Endringsvilje + tilgang-tidsramme
  - Business case-estimat
  - Lenke til Attio-personen

---

## Payload-format (innkommende)

```json
{
  "fornavn": "Ivar",
  "epost": "ivar@bedrift.no",
  "bedrift": "Bedrift AS",
  "kilde": "agentik.no/takk",
  "submittedAt": "2026-04-26T14:32:11.000Z",
  "answers": {
    "rolle": "Daglig leder",
    "antallAnsatte": "26-50",
    "avdelinger": ["Salg", "Support / kundeservice"],
    "friksjonOmrader": ["Treg oppfølging av kunder/leads", "Tilbud og oppfølging tar for lang tid"],
    "unodvendigTid": "Sortere supporthenvendelser, forberede tilbud, oppdatere CRM",
    "supportVolum": "51-100",
    "salgsVolum": "11-25",
    "manuelleTimer": "21-40 timer",
    "forsteArbeidsflyt": "Sortere og foreslå svar på de første 200 supporthenvendelsene per uke",
    "aiTestet": "Ja, litt",
    "aiBlokkering": ["Vi vet ikke hvor vi skal starte", "Vi mangler tid"],
    "suksessMaal": "Frigjort 8 t/uke i support og kuttet responstid fra 4 t til 30 min",
    "verdiPrioritet": ["Spart tid", "Bedre supportkapasitet"],
    "kontaktperson": "Ivar Knutsen, daglig leder",
    "tilgangsTid": "Innen 1 uke",
    "endringsvilje": "Ja"
  }
}
```

---

## Hvis du må endre workflow-en

- **Via UI:** https://agentiknorway.app.n8n.cloud/workflow/Pv1Aj3Vg38ogshQ8
- **Via SDK:** `mcp__n8n__update_workflow` med ID `Pv1Aj3Vg38ogshQ8`. Husk å re-linke Attio og Slack credentials i UI etter SDK-oppdatering (de regenereres som placeholders).

---

## Fremtidige forbedringer

- **Sales Pipeline custom-felter:** Når Attio Sales Pipeline har felter som `forste_arbeidsflyt`, `manuelle_timer_uke`, `endringsvilje`, kan vi legge til en HTTP PATCH-node som oppdaterer pipeline-oppføringen direkte. Krever at feltene først opprettes i Attio.
- **Booking-flow:** Etter assessment kan workflow-en automatisk hente ledige slots (kopiere logikk fra `AI Form Lead Handler`) og foreslå tider via e-post — så du ikke trenger å sende auto-svar manuelt.
- **OpenAI-pre-analyse:** Send svarene gjennom gpt-5-mini som analyserer "passer denne til AI-Partner Sprint?" og returnerer score + 3 hypoteser. Resultatet kan inn i Slack-meldingen.
- **Supabase audit-log:** Legg til logging i `email_log`-tabellen som de andre workflowene gjør, med `classification: {"source": "assessment"}`.
