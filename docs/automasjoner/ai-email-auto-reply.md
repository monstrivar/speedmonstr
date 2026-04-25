# AI Email Auto-Reply with Knowledge Base

**ID:** `dJL4Gk4dO5ZPqAH3`
**URL:** https://agentiknorway.app.n8n.cloud/workflow/dJL4Gk4dO5ZPqAH3
**Aktiv siden:** 2026-04-24
**Eier:** Ivar

## Hva den gjør

Trigger på hver innkommende e-post til `hei@agentik.no`. Klassifiserer e-posten (er det spam, klage, booking-forespørsel, kjøpsintensjon?), oppretter/oppdaterer kontakt i Attio, logger i Supabase, og enten:

- **Spam:** dropper
- **Klage:** videresender til ivar@agentik.no + legger klage-notat i Attio
- **Booking-forespørsel:** sjekker Ivar/Ole sine kalendere, ber om Slack-godkjenning, sender kalender-invitasjon ved godkjenning
- **Vanlig henvendelse:** genererer AI-svar (gpt-5-mini + kunnskapsbase) og sender fra hei@agentik.no
- **Kjøpsintensjon (uansett av over):** varsler #social i Slack + legger bedrift i Sales Pipeline

## Trigger

**Gmail Trigger** på `hei@agentik.no`-innboks. Polling-basert (N8N henter nye e-poster på intervall).

## Flyt (40 noder)

```
Ny e-post mottatt (Gmail Trigger)
       ↓
Normaliser kunde-data (parse fra-adresse, body, subject)
       ↓
Klassifiser e-post (LangChain Agent + gpt-5-mini + structured output parser)
       │   Outputs: contact_name, contact_company, language, reason,
       │            is_complaint, is_booking_request, requested_time_iso,
       │            requested_person (Ivar|Ole|either), has_purchasing_intent, intent_reason
       ↓
Opprett/oppdater person i Attio
       ↓
Legg til klassifiserings-notat (med all metadata fra klassifiseringa)
       ↓
Logg i Supabase (email_log)
       ↓
Spam? — JA → STOPP
       ↓ NEI
Klage? — JA → Videresend til Ivar + Klage-notat → STOPP
       ↓ NEI
Booking-forespørsel? — JA → Sjekk kalender → Sett ansvarlig (Ivar/Ole) → Slack godkjenning →
                              Godkjent? → JA → Send kalenderinvitasjon
       │ NEI
       ↓
Bygg svar-prompt (Set)
       ↓
Generer svar (LangChain Agent + Svar-modell + Kunnskapsbase + Ivar/Ole/Agentik kalender-tools)
       ↓
Send svar (Gmail reply)
       ↓
Kjøpsintensjon? — JA → Varsle Slack + Personlig e-post? → Opprett bedrift i Attio → Sales Pipeline
```

## Klassifiserings-modell

Output-skjema (structured output via JSON parser):
```ts
{
  contact_name: string,
  contact_company: string,
  language: 'no' | 'en' | ...,
  reason: string,
  is_complaint: boolean,
  is_booking_request: boolean,
  requested_time_iso: string | null,
  requested_person: 'Ivar' | 'Ole' | 'either',
  has_purchasing_intent: boolean,
  intent_reason: string
}
```

Modell: `gpt-5-mini` (Klassifiserer-modell-noden).

## Booking-flyten

Når `is_booking_request: true`:
1. **Sjekk hvem er ledig** — POST mot `googleapis.com/calendar/v3/freeBusy` med `requested_time_iso` ± 30 min
2. **Sett ansvarlig person** — basert på `requested_person` eller første ledige
3. **Be om godkjenning (Slack)** — `sendAndWait` til #social, venter på menneskelig OK
4. **Godkjent → Send kalenderinvitasjon** — Google Calendar event create med kunden som invitee

## Svar-genereringen

Bruker `Generer svar`-agenten med:
- **Modell:** Svar-modell (gpt-5-mini)
- **Kunnskapsbase:** Supabase vector store (`documents`-tabell, topK=5)
- **Tools:** `Hent Ivars events`, `Hent Oles events`, `Hent Agentik bookings` (alle Google Calendar-tools)

Svaret sendes via Gmail `reply`-operation, som beholder thread-konteksten.

## Kjøpsintensjon-grenen

Hvis `has_purchasing_intent: true`:
1. **Varsle Slack** (#social) med varsel
2. **Personlig e-post?** — IF-node, hvis ikke gmail/yahoo/etc.
3. **Opprett/oppdater bedrift i Attio** (utleder fra e-post-domenet)
4. **Legg til i Sales Pipeline** (samme list-id som AI Form Lead Handler bruker)

## Avhengigheter

| Eksternt system | Hvordan brukt |
|---|---|
| Gmail | Trigger (innkommende) + send svar/videresending |
| Attio | Person, bedrift, notater (klassifisering + klage), Sales Pipeline |
| Supabase (`email_log`) | Audit-log |
| Supabase (`documents`) | Kunnskapsbase for svar-agenten |
| OpenAI | gpt-5-mini (klassifisering + svar), text-embedding-3-small (kunnskapsbase) |
| Slack | Sendelement (klage-varsel), sendAndWait (booking-godkjenning), post (kjøpsintensjon-varsel) |
| Google Calendar | Free/busy-sjekk, kalenderinvitasjon, getAll for tools |

## Endringer

### Endre klassifiseringen (legg til ny intensjon)
Åpne "Klassifiser e-post"-noden → utvide `outputParser`'s schema → oppdater system-prompt → legg til ny IF-branch eller utvidet eksisterende.

### Endre svar-tonen
"Generer svar"-noden → endre `systemMessage` under Options. Bruker kunnskapsbasen automatisk.

### Endre kunnskapsbasens innhold
Kjør `node scripts/ingest-kb.mjs` for å oppdatere `documents`-tabellen i Supabase med ny innhold fra `docs/`. Workflowen plukker det opp neste gang den genererer svar (cache-fri vector search).

### Oppdatere via SDK
Workflowen ble bygget i UI, ikke via SDK. Hvis du vil eksportere → endre → re-importere via SDK:
1. `mcp__n8n__get_workflow_details` med ID
2. Konverter manuelt til SDK-format (eller bruk N8N's eksport-funksjon)
3. `mcp__n8n__update_workflow`
4. Re-link Slack + 5 Attio HTTP Bearer-credentials i UI

## Kjente quirks

- **Webhooks fra hei@agentik.no kan loope** hvis vårt auto-svar trigger lead-ens auto-responder. Workflowen har ikke eksplisitt loop-detektion ennå — sjekk execution-log hvis du ser uvanlig høy volum.
- **Booking-forespørsler krever menneskelig OK i Slack** — `sendAndWait` blokkerer execution til noen klikker godkjenn. Hvis ingen klikker innen N8N-timeout (default 1t), feiler executionen.
- **Klassifiseringen kan misforstå norsk** — modell er gpt-5-mini, har stort sett bra norsk forståelse, men hvis du ser feilklassifiseringer, vurder å oppgradere til større modell midlertidig.
