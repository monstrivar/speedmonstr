# Partner-onboarding — fra «ja» til AI i drift

> Hvordan vi tar inn nye AI-Partnere på en måte som føles sømløst, profesjonelt og premium — uten at vi som to gründere drukner i admin.

---

## TL;DR

Når en kunde sier «la oss kjøre», skjer det fem ting innen 60 minutter, syv ting innen 24 timer, og kunden er i drift innen 5 virkedager. Det meste automatiseres bak kulissene; det personlige (video, gave, første mail) feels håndlaget. Slack blir den eneste daglige kontaktflaten. Hver kunde får eget dashbord på `agentik.no/partner/[slug]` fra dag 1.

---

## Filosofi (4 prinsipper)

1. **Hastighet skaper tillit.** Mens entusiasmen er på topp ("vi vil dette!") må vi vise at vi faktisk leverer. Den kritiske vinduet er de første 60 minuttene.
2. **Automatiser bakgrunn, personifiser front.** Faktura, kontrakter, kanaler, dashbord — automatiseres. Velkomstvideo, første e-post, gave med håndskreven note — alltid personlig.
3. **Én tråd.** Slack-kanal (de + oss) blir det operative hjemmet. E-post er bare for formelle ting (kontrakt, faktura). Telefon er for nød.
4. **Synlighet er trygghet.** Eget dashbord fra dag 1 — selv om det er tomt. Kunden ser at strukturen finnes, og at vi har styring.

---

## Mine 5 runder (kort om tankegangen)

### Runde 1 — Hva må skje uansett?
Listet alt: kontrakt, faktura, intake-skjema, kickoff-møte, Slack, dashbord, prosjektverktøy, gave. Innså raskt at jo mer kunden må gjøre selv den første uken, desto mer faller engasjementet. Beslutning: kunden gjør én ting (intake-skjema), vi gjør resten.

### Runde 2 — Hvor er WOW?
WOW kommer ikke fra å gjøre alt — det kommer fra å gjøre noe uventet ekstra godt. Identifiserte 5 mulige WOW-momenter (under). Det viktigste: hastigheten i de første minuttene + det fysiske som lander om 1–2 dager.

### Runde 3 — V1 vs V2
Vi trenger ikke perfekt automasjon for de første 3 Founding-partnerne. Mye gjøres manuelt med templates. Men vi skal *bygge automasjonen mens vi onboarder de første*, slik at kunde 4 onboardes 80% automatisk. Hver gang vi gjør noe to ganger, lager vi en automasjon — i tråd med Agentik-filosofien.

### Runde 4 — Hva motvirker WOW?
Friksjonspunkter som dreper magien:
- Kontrakt-runder med advokater hos kunden (kan ta uker)
- Gave som ikke kommer frem
- Slack-invitasjon som havner i spam
- For mange skjemaer som forventer rask utfylling
- Uklart hvem som gjør hva (oss eller dem?)

Tiltak: soft-start (begynn jobben på verbalt ja, kontrakt parallellt), eget velkomst-skjema med "lagre underveis"-funksjon, single-point-of-contact begge veier, redundant kontakt for Slack.

### Runde 5 — Lifetime value-vinkel
Onboarding er ikke et 5-dagers løp — det er begynnelsen på et langt forhold. Vi bygger ikke for første uka, vi bygger for år 1, 2, 3. Det betyr:
- Konsistente touchpoints fortsetter etter at Sprinten er ferdig (måned 4+ rutiner)
- 90-dagers milepæl-feiring (markerer overgang fra Sprint til løpende AI-Partner)
- Årlig strategisk review

---

## Den anbefalte løsningen — high level

```
Trigger: "Onboard new partner"-knapp i Slack (eller form Ivar fyller ut)
   ↓
n8n-workflow «AI Partner Onboarding» orkestrerer:
   ├─ T+0:    Velkomstmail fra Ivar/Ole (video + neste steg)
   ├─ T+0:    BRREG-oppslag (auto-fyller bedrifts-data)
   ├─ T+5:    Kontrakt sendt til signering
   ├─ T+5:    Slack-kanal opprettet + kunde invitert
   ├─ T+10:   Notion-arbeidsområde opprettet (fra template)
   ├─ T+10:   Dashbord provisjonert på agentik.no/partner/[slug]
   ├─ T+15:   Intake-skjema sendt til kunden
   ├─ T+15:   Calendar-invitasjon for kickoff (innen 5 virkedager)
   ├─ T+30:   Velkomst-gave bestilt (Slack-godkjenning)
   ├─ T+45:   Attio: prospect → active partner
   ├─ T+45:   Fiken: månedlig fakturering opprettet
   ├─ T+60:   Første faktura sendt
   └─ T+24h:  Personlig push: Ivar kommenterer i Slack-kanal

Parallelle løp etter signering:
   ├─ Kontrakt signert → Attio oppdatert + Fiken aktivert
   └─ Gave levert (T+24-72h) → Slack-notif til oss
```

---

## Customer journey — timeline

### T+0 (de sier «la oss kjøre»)

**Det vi gjør:** Ivar (eller Ole) trigger «Onboard new partner» — fyller ut et lite skjema med bedrift, kontaktperson, e-post, kommentarer, gave-preferanser.

**Det kunden får:**
- Personlig e-post fra Ivar innen 5 minutter:
  > Hei [Navn],
  >
  > Stas at dere ble vår [tredje] Founding-partner. Her er hva som skjer:
  >
  > 1. Innen i dag — kontrakt til signering, dashbord-link, Slack-invitasjon
  > 2. Innen 24 timer — intake-skjema (5 min å fylle ut)
  > 3. Innen 5 virkedager — kickoff-møte (jeg foreslår 3 tider under)
  >
  > Velkommen om bord. Vi gleder oss.
  >
  > Hilsen Ivar & Ole
  >
  > P.S. Loom-video som forklarer alt → [link]
- Slack-invitasjon med kanalnavn `#partner-[bedrift-slug]`
- Kontrakt på e-post (via Penneo eller Verified)

### T+1 time

- Kunde sjekker dashbord — `agentik.no/partner/[slug]` — ser:
  - Status: «Onboarding pågår»
  - Roadmap-skelett (4 faser)
  - Kontakt-liste (Ivar + Ole)
  - Kontrakt-status: «Venter på signering»
  - Faktura-status: «Klar for utsendelse»

### T+24 timer

- Velkomstvideo levert (Loom — kan være pre-innspilt med navn lagt til)
- Intake-skjema (Notion eller egen side på agentik.no): system, kontaktpersoner, KPI-er, branding-assets, eksisterende verktøy
- Påminnelse om kickoff-møte (3 forslag til tid)

### T+24-72 timer

- Velkomst-gave lander hos kunden:
  - Lokal norsk kaffe (Tim Wendelboe? eller noe lokalt fra Skien/Arendal)
  - Håndskrevet note fra Ivar+Ole
  - Note: «Velkommen til Agentik. Vi gleder oss til 90 dager sammen.»
  - (Optional: bok — *AI Engineering* av Chip Huyen, eller en relevant norsk bok)

### T+5 virkedager — kickoff-møte

- 90-min møte (helst fysisk hvis Skien/Arendal/Oslo, ellers video)
- Agenda:
  1. Bli kjent (15 min) — bli kjent på en måte vi ikke kunne i salgssamtalen
  2. Gjennomgang av intake-svar (15 min)
  3. Demo av dashbord + Slack (10 min)
  4. AI-Revisjon — start umiddelbart (40 min) — workshop-format med 4-6 nøkkelpersoner
  5. Neste steg + datoer (10 min)

### T+1 uke

- AI-Revisjon ferdig — første rapport tilgjengelig på dashbord
- 3-5 prioriterte tiltak låst
- Første tiltak begynner bygging

### T+30 dager

- Første AI-løsning i drift
- Månedlig strategimøte
- ROI-dashbord viser første tall (timer spart)

### T+90 dager — milepæl

- Sprint avsluttet
- Verdigaranti dokumentert (≥ 2x årlig verdipotensial)
- Overgangs-feiring: middag med Ivar+Ole (eller hjemme-lunsj hvis nært)
- LinkedIn-post (med tillatelse) som markerer milepælen — gir kunden synlighet

### Måned 4+

- Løpende AI-Partner-modus
- Månedlig strategimøte → 30 min
- Slack-aktivitet: svar samme virkedag
- Kvartalsvis: stor strategi-review (2 timer)
- Årlig: rapport over ALT vi har bygget + dokumentert verdi

---

## De 7 WOW-momentene

| # | Når | Hva | Hvorfor det wower |
|---|---|---|---|
| 1 | T+5 min | Personlig e-post som kommer raskere enn forventet | Speed = profesjonalitet. De forventet kanskje en mal-mail neste dag |
| 2 | T+1 time | Eget dashbord på en URL de kan vise sjefen | "Vi har allerede vår egen Agentik-side" — bygger eierskap fra dag 1 |
| 3 | T+24 timer | Loom-video fra Ivar+Ole som snakker direkte til dem | Ansikt + stemme = relasjon. Nesten ingen B2B-leverandører gjør dette |
| 4 | T+1-3 dager | Fysisk gave med håndskrevet note | Det digitale er forventet i 2026. Det fysiske er sjeldent → minneverdig |
| 5 | T+5 dager | Kickoff som åpner med "bli kjent" — ikke business | Vi er ikke konsulenter som starter med slides. Vi er partnere som starter med samtale |
| 6 | T+30 dager | Dashboard viser første KONKRETE timer spart | Beviset på at det virker — i tall, levert akkurat når skepsisen ville vært høyest |
| 7 | T+90 dager | Milepæl-middag + (med tillatelse) LinkedIn-post | De får både privat anerkjennelse + offentlig synlighet for sin AI-investering |

---

## Tooling-stack — V1 (manuell-tung) vs V2 (automatisert)

### V1 — gjelder for Founding-partner #1, #2, #3

| Område | Verktøy | V1-tilnærming |
|---|---|---|
| Trigger | Slack-melding `/onboard [bedrift]` | Manuelt — Ivar fyller ut Notion-form |
| BRREG-oppslag | Manuelt på brreg.no | Klipp-og-lim org.nr og adresse |
| Velkomst-mail | Gmail (manuelt) | Mal i drafts → personlig touch + send |
| Kontrakt | Vipps eSign | Last opp PDF-mal, send med BankID-signering |
| Slack-kanal | Slack manuelt | Opprett `#partner-[slug]`, inviter + Ivar+Ole |
| Notion-arbeidsområde | Notion manuelt | Dupliser template, inviter kunde |
| Dashbord | `agentik.no/partner/[slug]` | Ny side i kode (vi bygger malen denne uka) |
| Intake-skjema | Notion form ELLER skjema på agentik.no | Bruke samme stack som /takk |
| Velkomst-gave | Lokal kaffeleverandør | Manuell bestilling — håndskrevet kort sammen |
| Calendar | Google Calendar | Manuell invitasjon med 3 tidsforslag |
| Attio | Eksisterende Sales Pipeline | Flytt person til "Active Partner" stadium |
| Fiken | Manuelt | Opprett kunde + månedlig faktura-mal |
| Loom-video | Pre-innspilt | Generisk velkomstvideo — Ivar+Ole sammen, 2 min |

**Tidsbruk per onboarding (V1):** 2-3 timer for Ivar/Ole. Mest manuelt arbeid.

### V2 — etter Founding-partner #3 er onboardet

| Område | V2-tilnærming |
|---|---|
| Trigger | n8n-workflow «AI Partner Onboarding» starter på Slack-kommando eller Notion-form |
| BRREG | API-oppslag (gratis API hos brreg.no) |
| Velkomst-mail | Auto-generert med Claude Opus (personlig tone, fyller inn navn/bedrift) |
| Kontrakt | Vipps eSign API auto-genererer fra mal (eller fortsatt halv-manuelt — uansett er det rask) |
| Slack | Slack API: oppretter kanal + inviterer |
| Notion | Notion API: dupliserer template |
| Dashbord | Auto-provisjoneres fra Supabase + ferdig dashbord-side |
| Intake | Multi-step form (samme pattern som /takk) |
| Gave | API mot lokal florist eller Bring eller Cornelis (Tim Wendelboe har ikke API men har online bestilling som kan automatiseres med Puppeteer) |
| Calendar | n8n finner ledige slots (samme logikk som AI Form Lead Handler bruker) |
| Attio | Auto-flyttes via API |
| Fiken | Fiken API: auto-opprettet kunde + recurring faktura |
| Loom-video | Pre-innspilt master + AI-genererte navn-overlays (eller bare same video for alle) |

**Tidsbruk per onboarding (V2):** 15-20 min for Ivar/Ole — bare review + send.

---

## Hvert verktøy — konkret valg

### Kontrakt-signering

**Anbefalt: Vipps eSign.**

Hvorfor:
- BankID-signering — norsk standard, juridisk sterkest i Norge
- Vipps er et merke alle norske bedrifter kjenner og stoler på
- Pay-per-use (~25 kr/dok) — ingen månedlig abo
- Lav friksjon for kunden — de kjenner allerede Vipps-flowen

**Hvordan det fungerer:**
1. Vi laster opp PDF-kontrakten i Vipps eSign
2. Sender til daglig leders e-post + telefon
3. De får varsel — signerer med BankID på mobilen (~30 sek)
4. Vi får ferdig signert PDF tilbake + signeringslogg

**Backup hvis Vipps eSign ikke er tilgjengelig:**
- Verified.no Free plan (5 dok/mnd gratis, BankID)
- Visma Sign (~390 kr/mnd hvis volum øker)

**For Founding-fasen:** Et enkelt **Letter of Intent** på e-post mellom Ivar/Ole og daglig leder kan være nok for å starte arbeidet umiddelbart — formell kontrakt signeres via Vipps eSign innen 7 dager. Avtaleloven dekker digitale samtykker, så vi mister ingenting på å starte raskt.

### Faktura

**Fiken** — API tilgjengelig.
- Opprett ny kunde via API
- Sett opp månedlig recurring faktura (39 000 kr eks. mva)
- Forfall 14 dager
- Faktura-mal som inkluderer: månedlig honorar + en linje for software/API-kostnader hvis aktuelt

### Prosjekthåndtering / klient-hub

**Anbefalt: Notion — for både klient-facing og internt arbeid.**

Hvorfor: 2 personer × 5 klienter er ikke stort nok til å rettferdiggjøre Linear (~200 kr/mnd) i tillegg til Notion. Holder oss til ett verktøy → en login, ingen tool-sprawl, alle data på samme sted.

**Strukturen i Notion-workspacet:**

```
Notion: «Agentik»
├── 📁 Klienter (database — én side per klient, deles med kunden)
│   ├── 📄 Klient A — Bedrift AS
│   │   ├── Velkommen + lenker
│   │   ├── Roadmap (90-dagers Sprint visualisert)
│   │   ├── Aktive prosjekter (Kanban: Planlagt / Bygges / Test / I drift)
│   │   ├── Møtenotater
│   │   ├── Beslutninger (decisions log)
│   │   ├── Dokumentasjon (system-info, prosessbeskrivelser)
│   │   ├── ROI-dashbord (embed fra agentik.no/partner/[slug])
│   │   └── Kontakter
│   ├── 📄 Klient B (samme struktur)
│   └── 📄 Klient C
│
├── 🛠 Internt — Backlog (database, IKKE delt med klienter)
│   ├── Bygge: Faktura-agent for Klient A
│   ├── Bygge: Support-bot for Klient B
│   ├── Vedlikehold: Dashbord-fix
│   └── Markedsføring: LinkedIn-post om Klient A
│
└── 📚 Templates
    ├── Klient-side template (dupliseres per ny kunde)
    └── Møtenotat-template
```

**Hva som deles med kunden:**
- Deres egen klient-side i `Klienter`-databasen (Notion share-link)
- Ingenting fra `Internt — Backlog`

**Hva som er privat hos oss:**
- Hele `Internt — Backlog`
- Alle andre klient-sider

Ulike permissions per side i samme workspace. Cleaner enn å ha 2 verktøy.

**Hva det sparer oss:**
- ~200 kr/mnd i Linear-abo
- Én login mindre
- Cognitive overhead — alt på samme sted

### Slack

Hver kunde får eget kanalnavn `#partner-[slug]`.
- Inviterer kunden inn med deres bedrifts-mail
- Kanal-tema: «Daglig kontakt-kanal — Agentik × [Bedrift]»
- Pinned message med viktige lenker (dashbord, Notion-hub, neste møte)
- Slack-bruk er INKLUDERT i AI-Partner — vi tar ansvaret for at det fungerer

### Klient-dashbord

**URL:** `agentik.no/partner/[slug]` — token-protected (bare med riktig token-link).

**Innhold:**
- Status-bar: «Pågående: Sprint Fase 2 — Bygging»
- Roadmap: 4 faser med dato-progresjon
- Aktive prosjekter: 3-5 cards med status
- ROI-tracker: timer spart, dokumentert verdi (oppdaters månedlig)
- Møter: kommende + nylig avholdt med notat-lenker
- Team: Ivar + Ole + evt. kontraktører
- Lenker: Notion-hub, Slack-kanal, Fiken-faktura

**Teknisk:** ny rute i samme React-app. Data fra Supabase-tabell `partners` + `partner_projects` + `partner_meetings`.

### Velkomstgave

**Anbefalt for V1:** lokal norsk kaffe + håndskrevet kort.
**Leverandør-ideer:**
- Tim Wendelboe (Oslo, premium, kjent merke)
- Solberg & Hansen (Oslo, premium)
- Lokal kaffebrenneri i Skien/Arendal — gir mer personlig vinkel («fra vår hjemby»)

**Pakke-innhold (~500 kr):**
- 1 pose kaffe
- Branded kopp eller karaffel (vurder å bestille 50 stk Agentik-merket)
- Håndskrevet kort med Ivar+Ole-signaturer
- 1 lokal liten ting (sjokolade fra Freia? Salt fra Lofoten? Varierer)

**Logistikk:** kjøpes inn på lager (10 sett) — sendes med Bring Express eller leveres personlig hvis lokalt. Setter et lite lager hjemme hos Ivar/Ole.

**V2:** API-integrasjon med lokal kurer for auto-sending når n8n trigger.

### Velkomstvideo (Loom)

**Format:** 90-120 sekunder, Ivar+Ole sammen i kamera.
**Manus:**
1. (Begge) «Hei [Fornavn], gratulerer — du er offisielt en av våre tre Founding-partnere.»
2. (Ivar) «Vi har gjort dette enklere enn vi opprinnelig planla, fordi vi vil bevise at AI-Partner-modellen funker.»
3. (Ole) «I løpet av 90 dager kommer vi til å kartlegge, prioritere og bygge sammen. Du har allerede tilgang til ditt eget dashbord [vis skjerm raskt].»
4. (Begge) «Vi kommer til å være tilgjengelige på Slack hver virkedag. Stille spørsmål når som helst — vi svarer alltid samme dag.»
5. (Ivar) «Sees i kickoff-møtet. Velkommen om bord.»

Spilles inn én gang. Brukes for alle Founding-partnerne. Kan personifiseres senere med navn-overlay i Loom.

### Intake-skjema

**Hva vi trenger:**
- Bedrifts-bekreftelse (BRREG pre-fylt — bekreft)
- Faktura-kontakt (navn, e-post, evt. spes referanse)
- Tekniske kontakter med titler
- System-oversikt (multiselect: HubSpot, Tripletex, Slack, Google Workspace, Office 365 etc.) + URL-er
- KPI-er kunden vil tracke (multiselect + custom)
- Brand-assets (logo upload, brand-farger, evt. brand-guide)
- Konfidensialitets-nivå (offentlig case / kan navngis i markedsføring / NDA-strict)
- Slack-emails (personer som skal inviteres)
- Tidssoner og typisk arbeidstid
- Allergier eller preferanser for fremtidige gaver/møter

**Format:** Multi-step form på agentik.no, samme pattern som /takk. Lagres i Supabase. Slack-varsel når fylt ut.

**Tid:** ~5-7 minutter for kunden å fylle ut.

---

## Hva du må gjøre denne uka (konkret)

For å være klar til å onboarde Founding-partner #1 sømløst:

### 1. Lag malen for kontrakt
- Mal i Word eller Google Docs basert på `docs/agentik/PARTNERAVTALE.md`
- Last opp i Penneo eller Verified
- Test med en mal-signering på deg selv

### 2. Spill inn velkomstvideo
- Ivar+Ole sammen, 90 sek, samme manus som over
- Loom (gratis, perfekt for dette)
- Lagre URL et sted dere finner igjen

### 3. Lag Notion-template
- Gå til Notion → Templates
- Bygg «Agentik Partner Workspace» med alle seksjonene
- Test med å duplisere den

### 4. Forbered velkomstgave-pakke
- Bestill 5 sett klare på lager
- Skriv håndskrevne kort på forhånd (la noen variabler tomme — fyll ut når en kunde signer)

### 5. Lag dashbord-malen
- Ny rute i koden: `/partner/[slug]`
- Henter fra Supabase (ny tabell `partners`)
- Strukturen finnes i seksjonen over
- Vi bygger denne i kodebasen — neste større arbeidsoppgave

### 6. Sett opp Fiken-mal
- Ny kunde-template med standard 39 000 kr/mnd
- Recurring månedlig faktura-mal

### 7. Skriv velkomst-mal-mailen
- Lagre som Gmail-utkast
- Variabler du fyller ut hver gang: navn, dato for kickoff, kontrakt-link

---

## Hva vi automatiserer over tid

I kronologisk rekkefølge (etter at de første 3 partnerne er onboarded):

1. **Onboarding-trigger** — `/onboard [bedrift]`-Slack-kommando som starter n8n-workflow
2. **BRREG-oppslag** — auto-fyller adresse, daglig leder, ansatte
3. **Slack-kanal-opprettelse** — Slack API
4. **Notion-duplisering** — Notion API
5. **Dashbord-provisjonering** — Supabase insert + token-generering
6. **Fiken-fakturaopprettelse** — Fiken API
7. **Penneo-kontrakt-utsendelse** — Penneo API
8. **Velkomstgave-bestilling** — kurer/florist API eller Slack-godkjenningsstegm
9. **Calendar-invitasjon** — gjenbruk samme logic som AI Form Lead Handler

Resultat: V2 onboarding tar ~15 minutter aktiv tid for Ivar/Ole. Resten skjer i bakgrunnen mens dere drikker kaffe.

---

## Hva som signaliserer at onboarding fungerer

**Klient-side:**
- Klienten svarer på Slack innen 24 timer (de er aktive)
- Intake-skjema fylt ut innen 48 timer
- De stille konkrete spørsmål om første-tiltak (de er engasjert)
- Svar fra resten av deres team i Slack-kanalen (det er ikke bare daglig leder)

**Vår side:**
- Hver av de 14 trinene i workflow-en utløper grønt
- Ingen manuelle hopp i kjeden (V2-mål)
- Kickoff-møte avholdes innen 5 virkedager
- AI-Revisjon ferdig innen 21 dager etter signert kontrakt (minst 2 uker, opp til 3)
- Første verdi-tall i dashbord innen 30 dager

---

## Hva som varmt anbefales å bygge inn permanent

Etter onboarding er ferdig (måned 1+), behold disse vanene:

1. **Månedlig sjekk-inn med "ikke-business"-element.** Ikke alt skal være ROI. Spør om bedriften, om livet, om hva som skjer.
2. **Synlige milepæler i Slack.** Hver gang noe går live: «🟢 Faktura-agent er nå live i tripleteX. Spart estimat: 4 t/uke.»
3. **Kvartalsvis case study.** Med tillatelse: skriv en kort artikkel (5 min lese-tid) om hva vi har bygget. Send til klienten først for review. De får sosial credit, vi får marketing-content.
4. **Årlig anniversary.** Send en kort video eller en flaske vin på 1-års-dagen. Ingen B2B-konsulent gjør dette. Vi er partnerne deres.

---

## Avslutning

Onboarding er det første kunden husker — og som regel det de forteller andre om når dere refereres. En sømløs onboarding er ikke en "nice-to-have" — det er det viktigste salgsargumentet for partner #4, #5, #6.

For Founding-fasen: gjør det manuelt og varmt. For Year 2: gjør det automatisert og fortsatt varmt (det varme overlever automasjonen hvis vi designer det riktig).

Det viktigste rådet: **gjør tre ting godt heller enn ti ting middelmådig.** I prioritert rekkefølge:
1. Personlig velkomstmail på minutter, ikke timer
2. Eget klient-dashbord fra dag 1
3. Fysisk gave med håndskrevet note innen 72 timer

De andre fire WOW-momentene legges til etterhvert.
