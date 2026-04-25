# AI Form Lead Handler

**ID:** `Zu6rLrT0bRlDeQb2`
**URL:** https://agentiknorway.app.n8n.cloud/workflow/Zu6rLrT0bRlDeQb2
**Aktiv siden:** 2026-04-25
**Eier:** Ivar
**Designdoc:** [`docs/superpowers/specs/2026-04-25-skjema-til-n8n-design.md`](../superpowers/specs/2026-04-25-skjema-til-n8n-design.md)

## Hva den gjør

Mottar skjema-innsendinger fra agentik.no, oppretter person + bedrift + notat + Sales Pipeline-oppføring i Attio, genererer personlig auto-svar via gpt-5-mini med Agentik-kunnskapsbase som verktøy, sender svaret fra hei@agentik.no, og varsler #social i Slack.

## Trigger

**Webhook:** `POST https://agentiknorway.app.n8n.cloud/webhook/agentik-form-lead`

Forventet payload (sendes av `api/agentik-contact.js`):
```json
{
  "fornavn": "Lars",
  "bedrift": "Hansen Industri AS",
  "telefon": "+47 90 12 34 56",
  "epost": "lars@hansen.no",
  "maal": "Vi bruker mye tid på fakturahåndtering og lurer på om AI kan hjelpe",
  "kilde": "agentik.no",
  "opprettet": "2026-04-25T10:00:00.000Z"
}
```

`fornavn`, `bedrift`, `epost` påkrevd. `telefon` og `maal` kan være tomme.

Svarer umiddelbart med `{"success": true}` (responseMode: `onReceived`) — resten av kjeden kjører asynkront.

## Flyt

```
Skjema-innsending (Webhook)
       ↓
Normaliser felter (Set: fornavn, bedrift, telefon, epost, maal, domain, submitted_at, submitted_date)
       ↓
Opprett person i Attio (PUT /objects/people/records?matching_attribute=email_addresses)
       ↓
Opprett bedrift i Attio (PUT /objects/companies/records?matching_attribute=domains)
       ↓
Legg til skjema-notat (POST /notes — tittel "Skjema-innsending fra agentik.no — {{dato}}")
       ↓
Legg til i Sales Pipeline (POST /lists/809fb8c9.../entries — alltid, skjema-leads er kvalifiserte)
       ↓
Logg i Supabase (email_log: direction=inbound, classification={"source":"form_lead"})
       ↓
Generer auto-svar (LangChain Agent + gpt-5-mini + Kunnskapsbase-tool)
       ↓
Send svar via Gmail (resource: message, operation: send, fra hei@agentik.no)
       ↓
Varsle Slack (#social, mrkdwn-format med lenke til Attio-personen)
```

## Auto-svar-prompt

System-melding (begrenset til skjema-kontekst):
- Tiltal med fornavn
- Bekreft mottak
- HVIS `maal` fylt ut: speil tilbake + bruk kunnskapsbasen for konkret innsikt
- HVIS `maal` tom: be om kort beskrivelse
- Be om 2-3 tidspunkter for 20-min utforskningsmøte
- Signatur: "Hilsen Ivar & Ole, Agentik"
- Tone: direkte, ikke salgsspråk, ingen emoji

Når lead-en svarer, fanges svaret av [AI Email Auto-Reply](./ai-email-auto-reply.md) som klassifiserer som booking-forespørsel og kjører kalender + Slack-godkjenning + invitasjon.

## Slack-varsel

Format (på #social):
```
🟢 Ny skjema-lead — agentik.no

*{fornavn}* fra *{bedrift}*
📧 {epost}
📞 {telefon}        ← droppes hvis tom

Mål: «{maal}»       ← eller "_ikke spesifisert — auto-svar ber om kontekst_"

Auto-svar sendt → ber om 2-3 tidspunkter
Attio: <link til personen i CRM>
```

## Avhengigheter

| Eksternt system | Hvordan brukt |
|---|---|
| Attio | 4 HTTP-noder (person, bedrift, notat, pipeline) — bruker Bearer-token credential |
| Supabase (`email_log`) | Audit-log via Supabase-noden |
| Supabase (`documents`) | Kunnskapsbase via vector store-tool på agenten |
| OpenAI | gpt-5-mini for svar, text-embedding-3-small for kunnskapsbase-søk |
| Gmail | Send svar fra hei@agentik.no |
| Slack | Post til #social |

## Endringer

### Endre prompt eller tone på auto-svaret
Åpne workflowen → "Generer auto-svar"-noden → endre `systemMessage` under Options. Test med curl mot webhook.

### Endre Slack-format
Åpne "Varsle Slack"-noden → endre `text`-feltet (mrkdwn). Husk: `\\n` for newlines når du redigerer i ekspresjonsfeltet.

### Endre Attio-felter
Hver Attio-node har `jsonBody`. Hvis du legger til et nytt felt, sjekk at det matcher Attio-modellens `slug` (ikke display-navnet). Bruker du `mcp__claude_ai_Notion__notion-fetch` eller direkte API-kall? Bruk Attio-API direkte: `GET /objects/companies/attributes`.

### Oppdatere via SDK
1. Endre `/tmp/agentik-form-lead-handler.ts` (kopier fra siste versjon i N8N hvis ikke i repo)
2. `mcp__n8n__validate_workflow` med koden
3. `mcp__n8n__update_workflow` med ID `Zu6rLrT0bRlDeQb2`
4. **Re-link Slack og 4 Attio HTTP Bearer-credentials i UI** (auto-link funker ikke for disse credential-typene fordi det kan finnes flere av samme type)
5. `mcp__n8n__publish_workflow`

## Kjente quirks

- **Attio PUT mot `/companies/records` krever `?matching_attribute=domains`** — uten den får du 400. Bygde først uten, måtte fikse.
- **HTTP Bearer + Slack-credentials wipes på hver `update_workflow`-call** — må re-lenkes manuelt hver gang via UI. Alle andre credentials (Supabase, OpenAI, Gmail) auto-linkes.
- **Webhook-respons returnerer umiddelbart** — hvis nedstrøms feiler, ser klienten suksess. Sjekk N8N execution log for å diagnostisere.

## Kilden i koden (Vercel-siden)

`api/agentik-contact.js` POSTer hit. Env var: `N8N_WEBHOOK_URL` (satt på `agentik` Vercel-prosjektet for både Production og Preview).
