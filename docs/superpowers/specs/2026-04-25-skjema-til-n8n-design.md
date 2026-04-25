# Skjema-lead-flyt via N8N — designdokument

**Dato:** 2026-04-25
**Status:** Godkjent design, klar for implementeringsplan
**Eier:** Ivar

## Bakgrunn

Kontaktskjemaet på agentik.no sender i dag inn til en Make.com-webhook (EU2) som videresender til Attio CRM. Flyten er bare en CRM-dump — ingen auto-svar til lead, ingen Slack-varsel, ingen klassifisering, ingen kunnskapsbase-bruk.

I parallell finnes en moden N8N-workflow `AI Email Auto-Reply with Knowledge Base` (40 noder, aktiv) som behandler innkommende e-post til hei@agentik.no med klassifisering, Attio-oppdatering, kunnskapsbase-svar, kalender-integrasjon, Slack-godkjenning og Sales Pipeline-tagging.

Skjema-leads burde få minst like god behandling som cold inbound. I dag får de mindre.

## Mål

1. Skjema-innsendinger får personlig auto-svar som flytter samtalen videre (ber om tidspunkter eller kontekst)
2. Slack-varsel umiddelbart ved hver skjema-lead
3. Attio får person + bedrift + notat + Sales Pipeline-oppføring, tydelig merket som skjema-lead
4. Gjenbruke maksimalt av eksisterende N8N-workflow — ikke bygge dobbelt
5. Trygg cutover fra Make.com uten tapte leads

## Ikke-mål

- Erstatte den eksisterende e-postagenten (den fortsetter uendret for innkommende e-post)
- Bygge captcha/spam-beskyttelse på skjemaet (YAGNI inntil vi faktisk får spam)
- Endre frontend-skjemaet eller dets felter

## Arkitektur

```
agentik.no skjema
       ↓
POST /api/agentik-contact (uendret kontrakt mot frontend)
       ↓ (bytter URL fra MAKE_WEBHOOK_URL → N8N_WEBHOOK_URL)
N8N: "AI Form Lead Handler" (ny workflow)
       ↓
1. Webhook trigger (strukturert JSON: fornavn, bedrift, telefon, epost, maal)
2. Normaliser felter, sett intensjon = "form_lead"
3. Opprett/oppdater person i Attio (med lead_source = "agentik.no_skjema", tag = "skjema-lead")
4. Opprett/oppdater bedrift i Attio
5. Legg til notat i Attio ("Skjema-innsending fra agentik.no — {{dato}}" + maal-feltet)
6. Legg til i Sales Pipeline (alltid — skjema-leads er kvalifiserte per definisjon)
7. Logg i Supabase (audit, gjenbruker eksisterende tabell)
8. Generer auto-svar (LangChain-agent + samme kunnskapsbase som original workflow)
9. Send svar via Gmail (fra hei@agentik.no)
10. Varsle Slack (alltid)
```

**Hva som gjenbrukes fra eksisterende workflow:** Attio HTTP-noder (person, bedrift, notat, Sales Pipeline), Supabase audit-node, Kunnskapsbase vector store + embeddings + svar-modell, Gmail-node, Slack-node. Credentials og connection-konfigurasjon eksisterer allerede.

**Hva som droppes fra original:** Klassifiserings-agent + parser, spam-check, klage-branch, booking-godkjenning-branch, kjøpsintensjon-if. Alt er pre-besvart eller irrelevant for skjema-leads.

## Attio-merking

Skjema-leads merkes på tre måter for synlighet:

1. **Person-felt:** `lead_source = "agentik.no_skjema"` (eksakt feltnavn bekreftes ved implementering)
2. **Tag på personen:** `skjema-lead` (for filtrering)
3. **Notat-tittel:** "Skjema-innsending fra agentik.no — {{dato}}" (for visuell timeline)

## Auto-svar

LangChain-agent bruker samme kunnskapsbase + svar-modell som original workflow, men med en strammere prompt for skjema-kontekst.

### Prompt

```
Du er Agentiks første kontaktpunkt. En ny lead har sendt inn skjemaet på agentik.no.

Lead-data:
- Fornavn: {{fornavn}}
- Bedrift: {{bedrift}}
- Mål/kontekst: {{maal}} (kan være tom)

Skriv et kort, varmt og konkret svar på norsk (4-6 setninger):
1. Tiltal med fornavn
2. Bekreft at vi har mottatt henvendelsen
3. HVIS maal er fylt ut: speil tilbake hva de skrev og pek kort på hvordan vi typisk hjelper
   med slike utfordringer (bruk kunnskapsbasen for konkret innsikt, ikke generisk fluff)
   HVIS maal er tom: be dem kort beskrive hva de ønsker å snakke om
4. Be om 2-3 tidspunkter som passer for et 20-min utforskningsmøte denne eller neste uke
5. Avslutt med signatur: "Hilsen Ivar & Ole, Agentik"

Tone: direkte, ikke salgsspråk, ingen overdrevne løfter, ingen emoji.
```

### Eksempel — `maal` fylt ut

> Hei Lars,
>
> Takk for at du tok kontakt. Du nevner at dere bruker mye tid på fakturahåndtering og lurer på om AI kan hjelpe — det er en av de tydeligste ROI-casene vi ser hos lignende bedrifter, og som regel ligger gevinsten i å automatisere matching mellom faktura, PO og leveranse før den havner hos en saksbehandler.
>
> Vi tar gjerne en 20 minutters samtale for å se hva som faktisk er verdt å bygge hos dere. Har du 2-3 tidspunkter denne eller neste uke som passer?
>
> Hilsen Ivar & Ole, Agentik

### Eksempel — `maal` tom

> Hei Lars,
>
> Takk for at du sendte inn skjemaet. For å bruke samtalen vår mest mulig konkret — kan du i et par setninger skrive hva som trigget henvendelsen? Et spesifikt problem dere prøver å løse, en idé dere vurderer, eller bare nysgjerrighet på hva vi gjør?
>
> Send oss gjerne også 2-3 tidspunkter som passer for et 20-min utforskningsmøte denne eller neste uke.
>
> Hilsen Ivar & Ole, Agentik

### Hvorfor designet er slik

- Auto-svaret *ber om noe* (tidspunkter eller kontekst). Det skyver ikke ballen tilbake til oss og forsinker.
- Når lead-en svarer, kommer svaret inn på hei@agentik.no → eksisterende e-postagent klassifiserer det som booking-forespørsel og kjører booking-flowen (kalender + Slack-godkjenning + invitasjon). Vi får sluttføring uten å bygge noe nytt.
- Kunnskapsbasen brukes kun når relevant (konkret maal), ikke som padding.

## Slack-varsel

Samme kanal som eksisterende kjøpsintensjon-varsel. Format:

```
🟢 Ny skjema-lead — agentik.no

*Lars Hansen* fra *Hansen Industri AS*
📧 lars@hansen.no
📞 +47 90 12 34 56

Mål: «Vi bruker mye tid på fakturahåndtering og lurer på om AI kan hjelpe»

Auto-svar sendt → ber om 2-3 tidspunkter
Attio: <https://app.attio.com/agentik/person/abc123|Åpne i CRM>
```

Hvis `maal` er tom: erstatt linjen med `Mål: _ikke spesifisert — auto-svar ber om kontekst_`.
Hvis `telefon` er tom: drop telefon-linjen.

## Edge cases og feilhåndtering

| Case | Håndtering |
|---|---|
| Webhook nede / N8N nede | `/api/agentik-contact.js` returnerer 500. Frontend viser eksisterende feilmelding. |
| Attio-kall feiler | Workflow fortsetter. Auto-svar går likevel ut. Slack-varsel inkluderer ⚠️ "Attio-feil — opprett manuelt". |
| Auto-svar feiler å generere | Fallback til hardkodet svar: "Hei {{fornavn}}, takk for at du tok kontakt. Vi melder oss innen 24t. — Ivar & Ole, Agentik". Slack-varsel sier ⚠️ "AI-svar feilet, fallback brukt". |
| Duplikat skjema-innsending (samme e-post innen 5 min) | Webhook godtar, men Slack-varsel sier "Duplikat innen 5 min". Auto-svar sendes ikke på nytt. Dedupe-logikk: sjekk Supabase audit-tabell før send. |
| Loop-fare | Ingen risiko. Den nye workflowen trigger på webhook, ikke e-post. Eksisterende e-postagent har allerede beskyttelse mot å trigge på egne utsendinger. |
| Tom `bedrift` eller `telefon` | Skjemaet validerer `fornavn + bedrift + epost` som påkrevd. `telefon` håndteres som "ikke oppgitt". |
| Spam (botter) | Ingen captcha i dag. YAGNI inntil faktisk problem. |

## Migreringsplan

**Steg 1 — Bygg ny N8N-workflow** (ikke koblet til skjemaet enda).
Test ved å POSTe til webhook-URL-en med curl:

```bash
curl -X POST <N8N_WEBHOOK_URL> \
  -H 'Content-Type: application/json' \
  -d '{"fornavn":"Test","bedrift":"Test AS","epost":"ivar@agentik.no","maal":"test","telefon":""}'
```

Verifiser: Attio fikk personen + bedrift + notat + Sales Pipeline, Slack fikk varsel, du fikk auto-svar.

**Steg 2 — Kjør i parallell i 1-2 dager.**
`/api/agentik-contact.js` POSTer til *både* Make og N8N med `Promise.allSettled` så feil i den ene ikke blokkerer den andre. Sammenlign output i Attio og avslør evt. avvik.

**Steg 3 — Når N8N er stabil**, fjern Make-kallet. `/api/agentik-contact.js` peker bare til N8N. Make-scenarioet deaktiveres (ikke slettes) i en uke som rollback-buffer.

**Steg 4 — Slett Make.com-scenarioet.** Oppdater `docs/PLATTFORM-OG-TEKNOLOGI.md` (Make → N8N). Fjern `MAKE_WEBHOOK_URL`-env varen i Vercel.

**Rollback-plan:** Bytt URL-en tilbake til Make i `/api/agentik-contact.js`, deploy. ~30 sekunder.

## Endringer i koden

- `api/agentik-contact.js`: Ny env var `N8N_WEBHOOK_URL`. Body utvides med `kilde: "agentik.no_skjema"` så N8N har tydelig markør. I steg 2 sender til begge; i steg 3 kun N8N.
- Ingen frontend-endringer.

## Endringer i dokumentasjon

- `docs/PLATTFORM-OG-TEKNOLOGI.md`: Erstatt Make.com-flyten med N8N-flyten. Oppdater env-tabellen.
- `docs/TECH-DECISIONS.md`: Logg avgjørelsen om å konsolidere lead-flyt på N8N i stedet for å vedlikeholde to separate plattformer.

## Suksesskriterier

1. Hver skjema-innsending resulterer i: person + bedrift + notat + Sales Pipeline-oppføring i Attio, alle merket som skjema-lead
2. Lead får et personlig auto-svar innen 30 sekunder etter innsending
3. Slack får varsel innen 30 sekunder etter innsending
4. Når lead svarer på auto-svaret, fanges svaret av eksisterende e-postagent og booking-flowen kjører automatisk
5. Make.com-scenarioet er deaktivert
6. `docs/PLATTFORM-OG-TEKNOLOGI.md` reflekterer ny arkitektur

## Åpne spørsmål til implementering

- Eksakt feltnavn på `lead_source` og `Sales Pipeline` i Attio-modellen (sjekkes mot eksisterende workflow ved bygging)
- Hvilken Slack-kanal — sannsynligvis samme som kjøpsintensjon-varslene i eksisterende agent (gjenbrukes)
- Skal Supabase-audit-tabellen ha en `kilde`-kolonne, eller skal vi bruke eksisterende skjema som det er?
