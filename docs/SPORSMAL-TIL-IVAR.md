# Spørsmål til Ivar — alt jeg trenger svar/handling på

> Etter alt arbeidet er ferdig: dette er listen over ting som krever DIN handling, info eller beslutning. Klassifisert etter type. Svar på det som er enklest først, da kommer mange av de andre på plass automatisk.

---

## 🚨 KRITISK — må gjøres for at flyten skal funke

### A. Notion API-credentials i n8n

n8n kan ikke skrive til Notion uten dette. **Tar 10 min:**

1. Gå til https://www.notion.so/profile/integrations
2. Klikk «New integration» → navn: «Agentik n8n», workspace: din
3. Kopier «Internal Integration Token» (`ntn_...`)
4. Del databasene med integrasjonen:
   - Åpne Notion-arbeidsrommet «Agentik»
   - For hver database (Klienter, Nøkkelpersoner, Onboarding-oppgaver, Arbeidsoppgaver, Møter): klikk «...» → «Connections» → velg «Agentik n8n»
5. I n8n UI: link credential på alle Notion HTTP-noder (4 noder fordelt på onboarding INIT + SUBMIT, 1 node på assessment-workflowen for å pre-koble)

### B. Vercel env-variabler (3 nye)

```bash
vercel env add N8N_ONBOARDING_INIT_WEBHOOK_URL production
# Verdi: https://agentiknorway.app.n8n.cloud/webhook/agentik-onboarding-init

vercel env add N8N_ONBOARDING_SUBMIT_WEBHOOK_URL production
# Verdi: https://agentiknorway.app.n8n.cloud/webhook/agentik-onboarding-submit

vercel env add ONBOARDING_INIT_SECRET production
# Verdi: en lang random string (f.eks. fra password-manager — 32 tegn)
```

### C. Push branch til remote

```bash
git push -u origin feat/ai-partner-pivot
```

→ Vercel preview-URL klar i ~30 sek. **Da er alle nye sider live på preview-domenet.**

### D. Aktiver de 2 onboarding-workflowene i n8n UI

Begge ligger som published men inaktive (toggle av). Slå på i UI etter credentials er linket.

---

## ❓ INFO/DATA jeg trenger fra deg (for å gjøre WOW-momentene ekte)

### 1. Velkomstgave — leverandør og innhold

Hvem skal bestilles fra? Anbefaler:
- **Tim Wendelboe** (Oslo, premium kaffe, gratis frakt over 600 kr)
- Eller en lokal kaffe-brenner i Skien/Arendal (gir lokal-vinkling)

Innhold (mitt forslag):
- 1 pose ferskbrent kaffe (200–250g)
- Branded Agentik-kopp eller karaffel
- Håndskrevet kort fra Ivar+Ole

**Spørsmål:**
- Hvilken kaffe-leverandør foretrekker du?
- Skal vi bestille branded kopp/karaffel? Hvis ja — design/font/farge?
- Bør pakken inkludere noe annet (sjokolade, salt, lokalt produkt)?

### 2. Loom-velkomstvideo

Skal du spille inn én generisk video som brukes for alle, eller én personlig per kunde?

**Anbefaler:** Generisk for V1 (90-sek script i `docs/agentik/ONBOARDING.md`). Personlig kan komme senere som egen WOW-grep.

**Spørsmål:**
- Vil du spille inn én generisk Loom denne uka? Hvis ja, send URL-en så jeg kan teste/embedde.
- Vil du heller ha at Loom blir personlig per kunde (du filmer raskt når trigger kommer)?

### 3. Vipps eSign — kontrakt-mal

**Kontrakt-mal må lages én gang.** Innhold finnes i `docs/agentik/PARTNERAVTALE.md`.

**Spørsmål:**
- Vil du selv lage kontrakt-mal (basert på PARTNERAVTALE.md) i Word + last opp i Vipps eSign? Eller vil du at jeg utarbeider en ferdig PDF du kan signere selv først som test?
- Hvilke spesifikke vilkår vil du legge til som ikke er i PARTNERAVTALE.md?

### 4. Branding — logo og farger for klient-Notion-side

For at Notion-klient-sider skal se ferdige ut, trenger vi:

**Spørsmål:**
- Har du en Agentik-logo som er hostet på en CDN-URL (PNG, transparent)? Hvis ikke: send meg en, jeg laster den opp på Vercel-public så vi får en stabil URL.
- Hvilke nøyaktige hex-koder er offisielle Agentik-farger? (Jeg har brukt #1A6B6D petrol, #C4854C copper, #1A1F25 ink — bekreft).

### 5. Eksisterende Attio-data

For at /takk-skjemaet og preso-genereringen skal kunne pre-fylle og hente kunde-historikk, trenger n8n å vite:

**Spørsmål:**
- Bekrefter du at Sales Pipeline-listen i Attio har ID `809fb8c9-6b2e-46a8-9f5a-8d831bc3e677`? (Som dokumentert i `docs/automasjoner/README.md`).
- Skal nye partnere (status «Aktiv Sprint») flyttes til en separat Attio-liste, eller bli i Sales Pipeline?

---

## 🤔 BESLUTNINGER jeg ikke kan ta alene

### 1. Notion vs `app.agentik.no` for klient-dashbord

**Min anbefaling: Notion nå, custom dashboard senere.**

Hvorfor:
- Notion gir 80% av verdien med 0% av build-tiden
- Custom dashboard = uker med arbeid (auth, dashboard-UI, admin-UI, data-sync)
- Bedre å validere modellen med 3 første partnere først
- Bygg `app.agentik.no` når du har 5+ partnere og trenger differensiering

**Spørsmål:**
- Er du enig i dette eller vil du at vi bygger custom-dashboard fra start? (hvis ja: ekstra 2-3 uker arbeid, skyver første partner-onboarding tilbake).

### 2. Skal `/side2` erstatte `/` (NySide.jsx)?

`/side2` er nå mye bedre enn `/`. Men det er fortsatt på branch.

**Spørsmål:**
- Skal vi erstatte `/` med innholdet fra `/side2` når vi merger? Eller la `/side2` være eget URL?

Min anbefaling: **erstatt `/` ved merge.** `/side2`-URL-en var bare for utvikling.

### 3. Kontrakt-binding etter Sprint

`docs/agentik/PARTNERAVTALE.md` sier «månedlig oppsigelse fra begge parter etter 90 dager».

**Spørsmål:**
- Er dette fortsatt gjeldende? Eller vil du legge til min. 6-12 mnd binding for å sikre cashflow?

### 4. Pris etter Founding-fasen

Etter 3 partnere á 39k = 117k MRR. Da hever vi til 49k for partner #4.

**Spørsmål:**
- Skal vi annonsere prisøkning offentlig (skaper urgency for nye leads)?
- Eller bare bytte stille, ny mal-mail for outreach?

### 5. Workshop-pris

`docs/agentik/TJENESTER.md` har «25 000–50 000 kr» som range.

**Spørsmål:**
- Vil du ha en standard halvdag-pris (f.eks. 25k) og heldag (40k) i kommunikasjon? Eller bevare fleksibilitet?

---

## 💡 FORSLAG (kan implementeres når du gir grønt lys)

### Quick wins jeg ikke har bygget enda:

1. **`/api/og`-endepunkt** som genererer dynamisk Notion-cover (1500×600 PNG med kundens logo + bedrifts-navn). Kan brukes som klient-page-cover automatisk. Bygg-tid: ~3 timer.

2. **Slack `/onboard`-kommando** som starter onboarding direkte fra Slack uten å åpne et nettskjema. Bygg-tid: ~2 timer.

3. **Månedlig auto-rapport** til hver klient — n8n-flow som hver første-i-måneden samler ROI-data fra Notion og sender pen e-post. Bygg-tid: ~6 timer.

4. **Kontraktsfornyelse-varsler** — Notion-formula som flagger «3 mnd til Sprint slutt» og oppretter task automatisk. Bygg-tid: ~1 time.

5. **Sticky CTA på /takk-thank-you-side** med booking-link til Calendly når kunden er ferdig med pre-assessment. Bygg-tid: ~1 time. **Anbefales sterkt.**

### Strategiske grep å vurdere:

6. **Lag `/preso/[id]/edit`-side** der Ivar/Ole kan justere AI-generert preso før møtet. Bygg-tid: ~6 timer.

7. **Bygg ut `/side2` med video-vitnesbyrd** når første kunde er klar (planlegg å spille inn 60-sek vitnesbyrd ved Sprint-slutt på partner #1).

8. **Episodisk newsletter** til pipeline (warm leads som ikke er klare ennå) — månedlig 5-min-lest med en konkret innsikt. Brukes som retention før salg.

---

## 📋 PRIORITERT REKKEFØLGE — slik jeg ville gjort det

**Denne uka (kritisk for å være "operativ"):**
1. Notion-integrasjon + credentials i n8n (10 min)
2. Push branch til remote (1 min)
3. Sett 3 nye Vercel env-vars (3 min)
4. Aktiver onboarding-workflows i n8n UI (1 min)
5. Bestill 5 sett velkomstgaver til lager (1-2 timer)

**Innen 2 uker:**
6. Spille inn generisk Loom-velkomstvideo (1 time inkludert testing)
7. Lage Vipps eSign kontrakt-mal (1-2 timer)
8. Test hele flyten ende-til-ende med dummy-data (30 min)

**Etter første partner-onboarding (lærings-runde):**
9. Justere det som ikke fungerte
10. Implementer Sticky CTA på /takk-thank-you (forslag #5)
11. Bygg månedlig auto-rapport (forslag #3)

---

## 🎯 OPPSUMMERT: hva som faktisk gjenstår av WOW-grep å bygge

| WOW-grep | Status | Hvem må gjøre |
|---|---|---|
| 1. Personlig e-post på 5 min | ✅ Bygget (n8n INIT) | Ivar: link creds |
| 2. Eget Notion-dashbord på 1 time | ✅ Bygget (n8n INIT + SUBMIT) | Ivar: link creds |
| 3. Loom-video fra Ivar+Ole | 🟡 Bygd integrasjon, mangler videoen | Ivar: spille inn |
| 4. Fysisk gave med håndskrevet note | 🟡 Tasks generert, mangler fysisk gave | Ivar+Ole: bestille lager |
| 5. Kickoff åpner med "bli kjent" | 🟡 Task generert, vi velger format på dagen | — |
| 6. Dashbord med konkrete timer spart | 🟡 Notion-side klar, må fylles ved første sprint | Ivar: bygge sammen med kunde |
| 7. Milepæl-middag + LinkedIn-post | 📝 Plan dokumentert | Ivar: huske ved 90 dager |

5 av 7 WOW-grep er **klare til bruk** så snart credentials er linket. De 2 siste (gave + dashbord-fyll) er fysiske/manuelle ting som dere uansett må gjøre selv.

---

## 📞 NÅR DU ER KLAR

Si fra hva du har svar på, så kjører jeg neste runde med implementering. Mange av spørsmålene er korte ja/nei og enkle valg. Jeg kan ta opp alt på 30-45 min når du har bestemt deg.
