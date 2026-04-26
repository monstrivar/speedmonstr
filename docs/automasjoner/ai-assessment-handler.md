# AI Assessment Handler — n8n-workflow (skal bygges)

> Mottar svar fra `/takk`-skjemaet, finner eksisterende Attio-person (opprettet av `AI Form Lead Handler`), oppdaterer med assessment-data og varsler i Slack.

## Trigger

**Webhook (POST)** — URL settes som env-variabel `N8N_ASSESSMENT_WEBHOOK_URL` på Vercel.

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
    "antallAnsatte": "26–50",
    "avdelinger": ["Salg", "Support / kundeservice", "Drift / operasjon"],
    "friksjonOmrader": [
      "Treg oppfølging av kunder/leads",
      "Tilbud og oppfølging tar for lang tid"
    ],
    "unodvendigTid": "Sortere supporthenvendelser, forberede tilbud, oppdatere CRM",
    "supportVolum": "51–100",
    "salgsVolum": "11–25",
    "manuelleTimer": "21–40 timer",
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

## Workflow-steg

### 1. Webhook node

- Method: POST
- Authentication: None (samme som `AI Form Lead Handler`)
- Returner 200 umiddelbart, prosesser asynkront

### 2. Search Attio Person by email

- Bruk eksisterende Attio-credentials
- Endpoint: `Persons` collection
- Filter: `email_addresses contains {{$json.epost}}`
- **Forventet:** Personen finnes (opprettet av `AI Form Lead Handler` ved første skjema)
- **Fallback hvis ikke funnet:** Opprett ny person med epost (sjelden — bare hvis brukeren navigerer direkte til `/takk` uten å ha submittet første skjema)

### 3. Format assessment as structured note

Bruk en Code-node til å formatere svarene som lesbar markdown:

```js
const a = $json.answers;
const md = `# Pre-Assessment — ${$json.fornavn || 'Ukjent'} (${$json.bedrift || 'Ukjent bedrift'})
Innsendt: ${$json.submittedAt}

## Kontekst
- **Rolle:** ${a.rolle}
- **Antall ansatte:** ${a.antallAnsatte}
- **Avdelinger:** ${(a.avdelinger || []).join(', ')}

## Friksjon
- **Friksjon-områder:** ${(a.friksjonOmrader || []).join(', ')}
- **Mest unødvendig tid på:**
${a.unodvendigTid}

## Volum
- **Support-volum/uke:** ${a.supportVolum}
- **Salgs-volum/mnd:** ${a.salgsVolum}
- **Manuelle timer/uke (totalt):** ${a.manuelleTimer}

## Den viktigste — første arbeidsflyt
${a.forsteArbeidsflyt}

## AI i dag
- **Har testet:** ${a.aiTestet}
- **Blokkering:** ${(a.aiBlokkering || []).join(', ')}

## Suksess-mål
${a.suksessMaal}
- **Viktigste verdi:** ${(a.verdiPrioritet || []).join(', ')}

## Implementering
- **Intern kontaktperson:** ${a.kontaktperson}
- **Tilgang-tidsramme:** ${a.tilgangsTid}
- **Endringsvilje:** ${a.endringsvilje}
`;
return [{ json: { ...$json, assessmentMd: md } }];
```

### 4. Append note to Attio Person

- Bruk Attio HTTP node eller Attio app-node
- Action: Create note on Person record
- Title: `Pre-assessment — ${submittedAt date}`
- Content: `{{ $json.assessmentMd }}` (parent_record_id = personen fra steg 2)

### 5. Update Sales Pipeline-record

- Finn pipeline-oppføringen tilknyttet personen (opprettet av `AI Form Lead Handler`)
- Oppdater status til `Pre-assessment fullført` eller tilsvarende
- Sett custom-felter:
  - `antall_ansatte`: a.antallAnsatte
  - `support_volum_uke`: a.supportVolum
  - `manuelle_timer_uke`: a.manuelleTimer
  - `forste_arbeidsflyt`: a.forsteArbeidsflyt
  - `endringsvilje`: a.endringsvilje
  - `tilgang_tidsramme`: a.tilgangsTid

> **Note:** Hvis disse feltene ikke finnes i Attio enda, opprett dem i Sales Pipeline-objektet før workflow aktiveres.

### 6. Slack-varsel til #social

- Channel: `#social` (samme som eksisterende workflow)
- Message:

```
🎯 Pre-assessment fullført — {{ $json.fornavn }} ({{ $json.bedrift }})

*Den viktigste arbeidsflyten:*
> {{ $json.answers.forsteArbeidsflyt }}

*Volum:* {{ $json.answers.manuelleTimer }} man.timer/uke · {{ $json.answers.supportVolum }} support/uke
*Endringsvilje:* {{ $json.answers.endringsvilje }} · *Tilgang:* {{ $json.answers.tilgangsTid }}

📋 Attio: <https://app.attio.com/agentik/objects/persons/{{ $json.attio_person_id }}|Åpne person>
```

### 7. Optional — generer business case (forenklet)

Hvis `manuelleTimer` indikerer høyt volum (>20 t/uke), legg til en automatisk
beregning:

```js
const timerMap = {
  '0–5 timer': 2.5,
  '6–10 timer': 8,
  '11–20 timer': 15.5,
  '21–40 timer': 30.5,
  '40+ timer': 50,
  'Usikker': null,
};
const timerPerUke = timerMap[$json.answers.manuelleTimer];
if (!timerPerUke) return null;

// Antar 30% kan automatiseres realistisk i sprint-perioden
const frigjorteTimerPerUke = Math.round(timerPerUke * 0.30 * 10) / 10;
const arligVerdi = frigjorteTimerPerUke * 800 * 52; // 800 kr/time × 52 uker

return [{ json: {
  ...$json,
  estimatFrigjorteTimer: frigjorteTimerPerUke,
  estimatArligVerdi: arligVerdi,
  estimatRoiMultiplier: Math.round((arligVerdi / 117000) * 10) / 10,
}}];
```

Bruk dette i Slack-meldingen og som forberedelse til mulighetssamtalen.

## Miljøvariabler som må settes på Vercel

| Variabel | Verdi |
|---|---|
| `N8N_ASSESSMENT_WEBHOOK_URL` | URL til workflow-en når den er deployet |

## Testing

Etter at workflow er aktivert:

```bash
curl -X POST https://YOUR_VERCEL_DEPLOYMENT/api/agentik-assessment \
  -H "Content-Type: application/json" \
  -d '{
    "fornavn": "Test",
    "epost": "test@example.com",
    "bedrift": "Test AS",
    "submittedAt": "2026-04-26T14:00:00.000Z",
    "answers": {
      "rolle": "Daglig leder",
      "antallAnsatte": "26–50",
      "avdelinger": ["Salg", "Support / kundeservice"],
      "friksjonOmrader": ["Treg oppfølging av kunder/leads"],
      "unodvendigTid": "Test",
      "supportVolum": "51–100",
      "salgsVolum": "11–25",
      "manuelleTimer": "21–40 timer",
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

Verifiser:
- HTTP 200 fra endepunktet
- Note synes på personen i Attio
- Slack-melding kommer i #social
- Custom-felter i Sales Pipeline er oppdatert
