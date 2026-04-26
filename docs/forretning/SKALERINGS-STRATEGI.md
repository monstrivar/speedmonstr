# Skaleringsstrategi: hvordan ta på flest mulig kunder uten stress

> Fra 3 Founding-partnere til 8–12 aktive AI-Partnere på 18 måneder, med to gründere. Ikke 80-timers uker.

## TL;DR

**Leverage ligger i modulene, ikke i timene.** Hver ny kunde adopterer 80% pre-bygde løsninger som tilpasses, og 20% nytt skreddersydd arbeid. Ved kunde nr. 8 har vi 8 «ProductPackages» (modul + SOP + n8n-mal + dokumentasjon) som genererer leverbart arbeid på 4–8 timer per gjenbruk i stedet for 40–80 timer per ny build. Det er forskjellen mellom 4 maks-kapasitet og 12 maks-kapasitet.

**Tre prinsipper:**

1. **Hver ting gjøres maks 2 ganger manuelt.** Tredje gang produktiseres den.
2. **Automasjon eier alt repeterbart.** Hjernen vår eier kun det som krever skjønn.
3. **Tids-budsjettering på Mandag.** Vi vet ved ukestart hvor mange timer hver klient får.

## Realistic kapasitet-matematikk

**Tilgjengelige timer:**
- 2 gründere × 40 t/uke × 4 uker = **320 timer/mnd totalt**
- Av dette: ~70% leveranse, 20% salg/marketing, 10% admin = **~225 leveransetimer/mnd**

**Forbruk per klient:**
| Fase | Timer/mnd per klient |
|---|---|
| Sprint (måned 1–3, AI-Revisjon + bygging) | 30 timer |
| Drift (måned 4+, vedlikehold + nye løsninger) | 18 timer |

**Maks-kapasitet under ulike scenarioer:**

| Klient-mix | Beregning | Maks aktive | Status hos oss |
|---|---|---|---|
| Alle i Sprint-fase | 225 / 30 = 7,5 | **7 klienter** | Tilfellet i mnd 2–4 av oppstart |
| Alle i Drift-fase | 225 / 18 = 12,5 | **12 klienter** | Tilfellet etter mnd 9 |
| 50/50-mix | 225 / 24 = 9,4 | **9 klienter** | Realistisk kontinuerlig steady-state |

**Konklusjon:** Med **null produktisering** kan 2 gründere realistisk håndtere 4–6 klienter uten stress. Med **full produktisering** (8 ferdig-bygde moduler): 9–12 klienter. Det er forskjellen.

## Productizing-modellen

### Hva er en «ProductPackage»?

Når vi bygger noe for klient A og det viser seg å være verdifullt, dokumenterer vi det slik at klient B får det på en dag i stedet for en uke.

Hver ProductPackage har:

1. **Hva den løser** (1-setnings problem-statement)
2. **n8n-template** (eksportert workflow JSON)
3. **SOP** (steg-for-steg deployment-sjekkliste)
4. **Klient-dokumentasjon** (Notion-side de kan se)
5. **Verdi-baseline-mal** (hvordan måle ROI)
6. **Pris-anchor** (hva den er verdt for kunden)

### De 8 modulene (fra spec §22)

| Modul | Bruksområde | Tilpasningstid (etter v1) |
|---|---|---|
| **Support-assistent** | Klassifiserer + svarer på supporthenvendelser | 6–8 t |
| **Salgs-assistent** | Forbereder møter, oppsummerer kundehistorikk, oppdaterer CRM | 8–10 t |
| **Onboarding-automasjon** | Onboarder kunder/ansatte med færre manuelle steg | 6 t |
| **Intern kunnskaps-assistent** | Svarer ansatte basert på dokumentasjon/SOP | 8 t |
| **Rapport-automasjon** | Ukentlige/månedlige ledelsesrapporter | 4–6 t |
| **Møte-til-CRM** | Møter → notater → CRM → action items | 5 t |
| **Tilbuds-assistent** | Tilbudsutkast + prosjektbeskrivelser | 6 t |
| **Dokumentbehandling** | Ekstraherer/oppsummerer/ruter info fra PDF-er, kontrakter, søknader | 8 t |

**Bygge-rekkefølge anbefalt:**
1. Onboarding-automasjon (vi har den allerede internt — porter til klient)
2. Møte-til-CRM (eksisterende AI Email Auto-Reply-pattern)
3. Rapport-automasjon (enkel, høy verdi)
4. Support-assistent (mest etterspurt)
5. Resten i takt med kunde-etterspørsel

## Automasjonsflater

Det vi har nå (uke 1):

| Hva | Status | Tidsbesparelse |
|---|---|---|
| Lead-skjema → Attio + auto-svar | ✅ Live | 15 min/lead |
| Pre-assessment → Attio-notat + preso | ✅ Live | 60 min/preso |
| AI-presentasjon-generering (Claude Opus) | ✅ Live | 90 min/preso |
| Partner-onboarding INIT (Notion + mail) | 🔧 Bygd, creds mangler | 45 min/onboarding |
| Partner-onboarding SUBMIT (Notion + tasks) | 🔧 Bygd, creds mangler | 60 min/onboarding |

Det vi bør automatisere som NESTE (når kunde 2 og 3 er om bord):

| Hva | Tidsbesparelse | Bygg-tid |
|---|---|---|
| Månedlig ROI-rapport per klient | 4 t/mnd × 5 klienter = 20 t/mnd | 8 t |
| Faktura-generering Fiken | 30 min/mnd × 5 klienter | 4 t |
| Slack-kanal-kveld-sammendrag (auto) | 15 min/dag × 5 klienter | 3 t |
| Risikovarsler (klient stille i 7 dager) | Mulig oppsigelse-forebygging | 2 t |
| Kontraktsfornyelse-flow (3 mnd før utløp) | Ingen tap pga glemt fornyelse | 2 t |

## Daglig / ukentlig / månedlig cadence

### Daglig (15 min)

**08:30 — Standup (Slack-huddle eller Loom):**
- Hva gjorde du i går?
- Hva gjør du i dag?
- Blokkere?

**Sjekk Notion-tasks:** alle Doing skal være forventet å være Done innen kveld.

### Ukentlig (90 min mandag)

**Mandag 09:00 — Strategimøte:**
- Gjennomgang: alle aktive klienter, status, neste steg (15 min)
- Ukens prioritet per klient (10 min × 5 klienter = 50 min)
- Bygg vs vedlikehold: hva er bottleneck? (15 min)

**Fredag 16:00 — Reflective close:**
- Hva ble bygget denne uka? Loggføres i Arbeidsoppgaver.
- Hva ble lært? Notes til ProductPackage-bibliotek.
- Hvilke klienter trenger extra oppmerksomhet neste uke?

### Månedlig (4 timer)

**Første mandag i måneden:**
- ROI-dashbord per klient (1 t)
- Strategimøte med hver klient (45 min × N klienter)
- Faktura sendes ut (30 min)
- Pipeline-review (30 min)

### Kvartalsvis (full dag)

- Pris-audit: skal vi heve?
- Kapasitet-review: tid å hire?
- Modul-audit: hvilke nye moduler skal vi bygge?
- Strategi for neste kvartal

## Hiring-roadmap

Bygd rundt MRR-triggere:

### 100–150k MRR: Første kontraktør (~150 kr/time × 30 t/mnd = 4 500 kr/mnd)

**Rolle:** Implementeringskontraktør (deltid, frilans).
**Profil:** Norsk-tales, kan n8n + Python/Node, 1-3 års erfaring.
**Hva de gjør:** Pakker ut ProductPackage-templates til nye klienter, SOP-følging.
**Trigger:** når begge gründere er konsekvent over 35 t/uke i 3 uker rad.

### 150–300k MRR: Fast deltids-spesialist (~25k kr/mnd, 50% stilling)

**Rolle:** Implementeringsspesialist.
**Profil:** Kan ta ansvar for 3–5 klienters drift-oppgaver alene.
**Hva de gjør:** Vedlikeholder og forbedrer eksisterende løsninger.
**Trigger:** når 5+ klienter er i Drift-fase.

### 300–500k MRR: Full-time implementer (~50k kr/mnd)

Frigjør Ivar og Ole til å være rene salgs- og strategi-roller.

### 500–700k MRR: Project/Delivery Manager

Tar ansvar for klientkommunikasjon og prosjekt-koordinering.

### 800k+ MRR: Customer Success / Account Manager

Retention og expansion.

## Time-budsjettering: hvordan unngå stress

### Den enkle regelen: 90/10

Ved start av hver uke, alloker 90% av tilgjengelige timer til konkrete klient-oppgaver. Hold 10% buffer for emergencies + nye salgs-samtaler.

**Mandag morgen (Notion):**
- Hver klient har ukens `Forventet timer` notert
- Total skal være ≤ 36 t per gründer (4 timer reservert til buffer + møter)
- Hvis over 36: re-prioriter eller flytt til kontraktør

### Stress-signal-sjekkliste

Hvis 2 eller flere av disse er sanne, er vi over kapasitet:

- [ ] En eller flere klienter har «Backlog»-tasks som er > 14 dager gamle
- [ ] Vi svarer på Slack > 4 timer i snitt (mål: ≤ 2 timer)
- [ ] Vi avlyser eller flytter strategimøter > 1 gang per måned
- [ ] Vi bruker > 4 t/uke på admin (regnskap, faktura, mailrydding)
- [ ] En av gründerne jobber > 45 t/uke i 2 uker rad

**Tiltak ved 3+ signaler:**
1. Pause på nye sales-aktiviteter (én måned)
2. Hire kontraktør (eller øk timer hvis allerede har)
3. Audit modul-templates: hva tar for lang tid?

## Hvordan vi systematiserer kunnskap

### Notion: «Modul-bibliotek» (eget arbeidsrom)

Struktur:
```
📚 Modul-bibliotek
├── 🤖 Support-assistent
│   ├── Hva den gjør (1-pager)
│   ├── n8n-template (lenke + JSON-eksport)
│   ├── SOP (deployment-steg)
│   ├── Klient-FAQ-mal
│   └── Verdi-baseline-mal
├── 💼 Salgs-assistent
│   └── (samme struktur)
└── ... (8 totalt)
```

### Hver klient-leveranse → bibliotek-oppdatering

Etter bygging:
1. Eksporter n8n-workflow → lagres i modul-mappa
2. Sjekk om SOP trenger oppdatering
3. Logg i `Modul-historikk`-database: hvem, hva, hvor lang tid

Etter 8 klienter med samme modul: vi vet eksakt hvor lang tid den tar, hva som varierer, og hva som kan automatiseres ytterligere.

### AI-assistert dokumentasjon

For hver ny klient-leveranse, kjør:
- «Skriv SOP for det vi nettopp gjorde» → Claude Opus genererer utkast
- Vi reviewer i 10 min og redigerer
- Sluttdokument går i modul-biblioteket

Sparer ~2 timer per leveranse vs å skrive fra scratch.

## Hvordan kunden ikke merker volum

Det viktige: hvis vi har 8 klienter, skal hver enkelt føle at de er den ENESTE.

**Hva vi gjør for å bevare det:**

1. **Slack-kanal per klient** med samme respons-tid (2 t i snitt). Vi lar aldri en kanal stå ubesvart over natten.
2. **Månedlig strategimøte per klient** står fast. Aldri avlyses for en annen klient.
3. **Personlig hilsning** — Slack-melding med deres navn på morgenen, ikke generisk.
4. **Klient-dashbord** holdes oppdatert. Aldri «Status: ukjent».
5. **Ingen template-svar i Slack.** Hvis vi merker at vi blir for travle: stoppe opp, ta Loom-video som forklaring.

## ProductPackages-prising

Etter 3–4 klienter har brukt en modul: kan prises som **standard add-on**:

| Modul | Standalone-pris (i tillegg til AI-Partner) |
|---|---|
| Support-assistent (basis) | 25 000 kr engangs |
| Salgs-assistent | 35 000 kr engangs |
| Onboarding-automasjon | 20 000 kr engangs |
| ... | ... |

Bruk dette for kunder som kun vil ha én ting (ikke full AI-Partner). Genererer prosjekt-revenue uten å øke månedlig kapasitet.

## Kortversjon: 5 hovedgrep for å skalere

1. **Bygg modul-biblioteket fra dag 1.** Hver leveranse → SOP + template.
2. **Time-budsjetter på mandag.** Aldri start uka uten å vite hver klients prioritert oppgave.
3. **Hire kontraktør ved 100–150k MRR.** Ikke vent til dere er utbrent.
4. **Daglig 15-min standup.** Holder hverandre ærlige om kapasitet.
5. **«Kunden er den eneste»-regelen.** Aldri la skaleringen påvirke individets opplevelse.

## Tids-investering for å bygge dette

Initielle investeringer (hver gründer):
- **Mandag-ritualet etablert:** 4 timer (1 mnd å bli vane)
- **Modul-bibliotek-opprettelse:** 8 timer (oppsett av Notion-arbeidsrommet)
- **Første 2 ProductPackages dokumentert:** 12 timer (etter første 2 klienter)
- **Standup-rutine:** 0 timer (bare gjør det)

**Total upfront-investering:** 24 timer per gründer = ~6 dager med fokus.

**Avkastning:** ved klient nr. 5 er hver ny klient 60% raskere å onboarde og levere til. Det er forskjellen mellom 4 og 9 klienter på samme tid.

## Slik ser slutten av år 1 ut

Hvis vi følger denne planen:

- **8 aktive AI-Partnere** (mix av Sprint og Drift)
- **MRR: 350–400k kr** (med 1–2 priseringer underveis)
- **1 fast deltids-spesialist + 1 kontraktør** ansatt
- **8 ProductPackages** dokumentert og bevist
- **Begge gründere på 35–40 t/uke** (ikke 60+)
- **Pipeline:** 12+ varme leads i kø for 2026/2027

**År 2-mål:** 1M+ MRR med 3 fast ansatte. Fra konsulent-praksis til skalerbart selskap.
