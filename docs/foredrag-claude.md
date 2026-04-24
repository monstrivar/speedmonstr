# Foredrag: Claude — Fra leke til arbeidskraft

**Taler:** Ivar Knutsen (evt. med partner som teknisk support)
**Dato:** ~17. april 2026
**Lengde:** 30 minutter
**Publikum:** ~20 norske SMB-eiere (intimt rom, nært)
**Format:** 17 slides + 1-2 live demoer + Dispatch "wait-and-reveal"
**Tone:** Personlig, samtale-aktig. Med 20 personer i rommet — ikke "presentasjonsmodus", men mer som et utvidet møte. Du kan stille spørsmål til rommet, peke på enkeltpersoner, lese energien.

---

## 🎯 Skjult mål (INTERNT — ikke del med publikum)

Under den synlige agendaen (inspirere + gi verktøy) ligger en skjult kommersiell baktanke: **foredraget skal skape nok begjær etter "hvordan får jeg dette på plass for teamet mitt?" til at noen i rommet ber om en workshop etterpå.**

Dette betyr foredraget må leve i spenningen mellom to ting:

- **Gi nok verdi** til at folk tar deg på alvor og stoler på at du vet hva du snakker om
- **Ikke gi bort metoden** — vis resultater og kraft, men ikke den pedagogiske prosessen for hvordan du får et helt team til å jobbe slik

Tre prinsipper for å ramme dette:

1. **Vis kraften, skjul hvordan.** Demoer skal levere mic-drop-øyeblikk. Men aldri forklar steg-for-steg hvordan *de* kan replikere nøyaktig det.
2. **Plant "det tok meg lang tid å finne ut."** Subtile referanser til din egen læringskurve — "dette tok meg 6 måneder å forstå", "det finnes en måte å gjøre dette 10x bedre" — signaliserer ekspertise uten å være salesy.
3. **Lead capture, ikke lead pitch.** Du *ber ikke* om workshop-registreringer. Du gir bort Dispatch-resultatet som lead-magnet og lar de interesserte komme til deg. Dispatch reveal-en er allerede strukturert for det.

Se [Workshop-hook-øyeblikk](#workshop-hook-øyeblikk) nederst for inventar over hvor disse seedene plantes i manuset.

---

## Endringslogg

- **v1 (2026-04-11):** Første utkast. 15 slides, 3 demoer.
- **v2 (2026-04-11):** Byttet Sora 2 → Seedance 2.0 (med Sora som mellomtrinn). La til Cowork-sikkerhet som eget segment. La til Dispatch som signatur-demo (erstatter Cowork-demo). La til Q&A-seksjon med 10 memorerbare svar. La til åpne beslutninger for Ivar.
- **v3 (2026-04-11):** Beslutninger tatt. Keynote som format. Demo 2 byttet til Alternativ B (bygg ROI-kalkulator fra scratch). Dispatch-oppgave valgt: bransjenyheter for publikum. Åpne beslutninger lukket.
- **v5 (2026-04-14):** Ny Slide 4 "Lanseringstempo" lagt til — viser ~20 Claude/Anthropic-lanseringer fra feb-apr 2026 for å illustrere akselererende utviklingstakt. Alle slides renummerert (4→5 osv., nå 17 slides). Tidsplan justert: Slide 3 kuttet 30 sek, ny slide tar 1 min, Slide 15 kuttet 30 sek. Total fortsatt 30 min.
- **v4 (2026-04-11):** Publikumstall revidert til ~20. Skjult kommersielt mål lagt til: skape workshop-begjær. Tone justert til mer intimt/samtale. Slide 15 og 16 omskrevet for curiosity-drevet close. Workshop-hook-øyeblikk-inventar lagt til. Lead capture-strategi skjerpet på slide 14 og 17.

---

## Innholdsfortegnelse

1. [Narrativ-ryggrad](#narrativ-ryggrad)
2. [Tidsplan med slides](#tidsplan)
3. [Slide-deck (16 slides)](#slide-deck)
4. [Demo-playbook](#demo-playbook)
5. [Q&A — 10 spørsmål med memorerbare svar](#qa)
6. [Pre-talk sjekkliste](#pre-talk-sjekkliste)
7. [Åpne beslutninger](#åpne-beslutninger)

---

## Narrativ-ryggrad

Hele foredraget henger på én setning:

> **«AI sluttet å være en leke. Den ble en arbeidskraft. Her er hva du kan gjøre med den i morgen.»**

Historien beveger seg gjennom tre akter:

- **Akt 1 (6 min):** Hvor er vi? To år siden var Will Smith spaghetti. Nå er det Seedance 2.0. Claude er der Anthropic vinner på "gjøre arbeid."
- **Akt 2 (18 min):** Claude har tre ansikter: *tenker med deg* (Claude.ai), *jobber for deg* (Cowork + Dispatch), *bygger med deg* (Claude Code).
- **Akt 3 (6 min):** Hva kan DU starte med i morgen? Lukk med tilbakeblikket.

Alt annet i dette dokumentet er implementasjonsdetaljer for denne historien.

---

## Tidsplan

| # | Slide | Tid | Kumulativ |
|---|-------|-----|-----------|
| 1 | Åpning | 1:00 | 1:00 |
| 2 | Video: 2023 → 2025 → 2026 | 2:30 | 3:30 |
| 3 | Tidslinje | 1:00 | 4:30 |
| 4 | **Lanseringstempo (NY)** | 1:00 | 5:30 |
| 5 | Modell-landskap | 1:00 | 6:30 |
| 6 | Tre ansikter (transition) | 0:30 | 7:00 |
| 7 | Claude.ai — tenkepartner | 1:30 | 8:30 |
| 8 | **DEMO 1: Claude.ai** | 3:00 | 11:30 |
| 9 | Claude Skills | 2:00 | 13:30 |
| 10 | Claude Cowork + Dispatch + sikkerhet | 3:00 | 16:30 |
| 11 | **DISPATCH "send"** (del av slide 10-flyt) | — | 16:30 |
| 12 | Claude Code | 2:00 | 18:30 |
| 13 | **DEMO 2: Claude Code + Monstr** | 4:00 | 22:30 |
| 14 | **DISPATCH "reveal"** | 1:30 | 24:00 |
| 15 | Hva du kan starte med i morgen | 2:00 | 26:00 |
| 16 | Close (tilbake til 2023 → ?) | 2:00 | 28:00 |
| 17 | Q&A | 2:00 | 30:00 |

**Buffer:** 0. Dette er tight. Pre-recorded backup for alle demoer er ikke valgfritt.

---

## Slide-deck

### Slide 1 — Åpning

**Tittel:** *Fra leke til arbeidskraft*
**Undertittel:** *Hva AI faktisk kan gjøre i april 2026*

**Visuelt:** Ditt navn. Monstr-logo nederst. Lite tekst. Gjerne et bilde av deg med mobilen.

**Talepunkter (1 min):**
- "Jeg heter Ivar. Jeg bygger Monstr — et system som hjelper norske håndverkere svare kunder på SMS innen 30 sekunder."
- "Jeg er ikke AI-guru. Jeg er en bygger som bruker dette hver eneste dag — og de siste månedene har jeg brukt mer og mer tid på å hjelpe andre bedrifter komme i gang med det samme." *[workshop-seed #1 — plant tidlig at du gjør dette]*
- "I dag skal jeg ikke forklare hvordan AI fungerer under panseret. Jeg skal vise deg hva det *gjør* — og hvorfor de neste 24 månedene kommer til å skille bedrifter i to grupper."
- "Vi har 30 minutter. Dere er ~20 mennesker. Stopp meg underveis hvis noe er uklart. Dette er en samtale, ikke en forelesning."

---

### Slide 2 — To år. Se selv.

**Tittel:** *Mars 2023 → september 2025 → februar 2026*

**Visuelt:** Tre videoruter side-om-side (eller sekvensiell avspilling):

1. **Venstre:** Will Smith eating spaghetti (Modelscope, mars 2023). Klassisk "AI-video er ødelagt"-meme.
2. **Midten:** Sora 2-demo (OpenAI, september 2025). Fotorealistisk, med synkron lyd.
3. **Høyre:** Seedance 2.0-klipp (ByteDance, februar 2026). 2K, native audio, karakter-konsistens, 15 sekunder i én generasjon.

**Talepunkter (2.5 min):**
- *Ikke snakk mens venstre video går.* La folk le. De vil le.
- Når midten starter: "To og et halvt år senere. Sora 2. Jeg skulle vise deg denne som 'siste nytt'."
- Når høyre starter: "Men dette klippet — Seedance 2.0 — er bare 6 uker gammelt. Fra ByteDance, selskapet bak TikTok. Det er CapCut som allerede har det innebygd."
- **Punchline:** "26. mars i år — på *samme dag* — la OpenAI ned Sora-appen, og Seedance 2.0 ble lansert på CapCut internasjonalt."
- "Det er det jeg prøver å si. Det går så fort at selv toppen taper plass. Du bør ikke satse på *merket*. Du bør satse på *evnen*."

**Risiko:** Videoene må være nedlastet lokalt. Ikke stol på YouTube i en live-presentasjon.

**Hvor finner du klippene:**
- Will Smith spaghetti 2023: søk "Will Smith eating spaghetti Modelscope" på YouTube
- Sora 2 demo: offisiell OpenAI Sora 2 launch reel, YouTube
- Seedance 2.0 demo: ByteDance offisiell release video, eller CapCut integrasjon

---

### Slide 3 — Tidslinje

**Tittel:** *Det siste toget du så komme forbi*

**Visuelt:** Horisontal tidslinje, 10 prikker. Hver prikk: dato + én setning.

```
nov 2022  →  ChatGPT lanseres. 100M brukere på 2 måneder.
mar 2023  →  GPT-4. "Will Smith spiser spaghetti."
jul 2023  →  Claude 2 lanseres.
feb 2024  →  Google Bard blir Gemini.
okt 2024  →  Claude får Computer Use. AI kan nå styre datamaskinen din.
sep 2025  →  Sora 2. Nesten ikke til å skille fra ekte video.
feb 2026  →  Claude Opus 4.6 — 1M kontekst standard.
feb 2026  →  Seedance 2.0 lanseres. 2K video med native lyd.
mar 2026  →  Sora-appen legges ned. Seedance 2.0 på CapCut.
apr 2026  →  Claude Cowork GA. Vi er her.
```

**Talepunkter (1.5 min):**
- "Dette er ikke en powerpoint-slide. Det er et varsel."
- "For tre og et halvt år siden var ChatGPT science fiction. I dag er det som Microsoft Office."
- "Det viktige er ikke hver enkelt prikk. Det er kurven."
- Avslutt: "Så — hvor er vi *nå*?"

---

### Slide 4 — Lanseringstempo

**Tittel:** *Bare de siste 10 ukene*

**Visuelt:** Tett kalender-grid fra februar til april 2026. Hver rad er én uke. Hvert punkt er én lansering. Poenget er **visuell overbelastning** — publikum skal *se* tettheten, ikke lese hvert punkt. Ca 25 merker på 10 uker.

Kuratert utvalg (for Keynote — vis som tett, scrollende vegg med datoer i venstre kolonne og korte beskrivelser til høyre):

```
5. feb    Opus 4.6 — ny toppmodell med 1 million ord kontekst
7. feb    Fast Mode — 2.5x raskere svar
10. feb   Cowork lansert på Windows
11. feb   Gratis-plan utvidet med Skills og koblinger
12. feb   Anthropic henter $30 mrd — verdsatt til $380 mrd
17. feb   Sonnet 4.6 — ny mellommodell
20. feb   Automatisk sikkerhetsskanning av kode
25. feb   Kjøper AI-oppstarten Vercept
26. feb   Gratis Claude til 10 000 open source-prosjekter
2. mar    Memory til alle gratisbrukere
7. mar    /loop — oppgaver som gjentar seg i opptil 7 dager
12. mar   Interaktive grafer + stemme på desktop
12. mar   $100M partnerfond lansert
13. mar   1M kontekst tilgjengelig for alle betalende
17. mar   Dispatch — send oppgaver fra mobilen
19. mar   Claude.ai 65% raskere
23. mar   Computer Use — Claude styrer skrivebordet ditt
3. apr    Computer Use på Windows
7. apr    Mythos — ny sikkerhetsmodell (kun partnere)
8. apr    Managed Agents — autonome agenter i produksjon
9. apr    Cowork generelt tilgjengelig for alle
```

**Talepunkter (1 min):**
- *La sliden synke inn 3-4 sekunder i stillhet.*
- "Dette er ikke to år. Dette er ti uker."
- "To nye toppmodeller. Et oppkjøp. Tretti milliarder i ny finansiering. Computer Use. Cowork. Dispatch. Managed Agents."
- "Det er nesten en ny lansering *hver eneste dag*."
- *Pek på listen:* "Og dette er bare Claude. OpenAI og Google kjører i samme tempo. Hele feltet akselererer."
- **Transition:** "Så — hvem bør du faktisk satse på?"

---

### Slide 5 — Modell-landskapet i dag

**Tittel:** *Tre i tet. Ett du bør lære navnet på.*

**Visuelt:** Tre kolonner.

| **Anthropic — Claude** | **OpenAI — ChatGPT** | **Google — Gemini** |
|---|---|---|
| Opus 4.6 (flagship) | GPT-5.4 | Gemini 3 Pro |
| Best på agentisk arbeid | Mest kjent, mest brukt | Dypt i Google-stacken |
| Kan styre datamaskinen | Video via Sora (nedlagt app) | Video via Veo 3 |

Under: *"Vi snakker om Claude. Ikke fordi det er best på alt. Fordi det er lengst fremme på én ting: å faktisk gjøre arbeid."*

**Talepunkter (1 min):**
- "Alle de tre har egne styrker. Sannheten: hvis du er seriøs, trenger du tilgang til to av dem."
- "ChatGPT er best til å være en *assistent du prater med*. Claude er best til å være en *ansatt du gir et mål til*."
- "Det er den enkle grunnen til at jeg snakker om Claude de neste 22 minuttene."

---

### Slide 6 — Transition: tre ansikter

**Tittel:** *Claude har tre ansikter. La oss møte alle tre.*

**Visuelt:** Tre bokser med ikoner.

1. **Claude.ai** → *Tenkepartner i nettleseren*
2. **Claude Cowork** → *Autonom arbeider på datamaskinen din*
3. **Claude Code** → *Bygger som lager digitale løsninger*

Under: *"Tenker med deg → Jobber for deg → Bygger med deg"*

**Talepunkter (30 sek):**
- "Samme hjerne. Tre forskjellige kropper."
- "Vi tar dem i denne rekkefølgen. Letteste først."

---

### Slide 7 — Claude.ai

**Tittel:** *Claude.ai — tenkepartneren som husker*

**Visuelt:** Fire bokser:

- **Projects** — arbeidsrom med egne filer og kontekst
- **Artifacts** — levende dokumenter og mini-apper i samtalen
- **Memory** — husker deg på tvers av samtaler (siden mars 2026 også på gratis)
- **Connectors** — 50+ verktøy: Gmail, Drive, Notion, Slack, Linear, Stripe...

**Talepunkter (1.5 min):**
- "Dette er Claude.ai — det du finner når du går til claude.ai. Gratis-versjon finnes, Pro er ca 200 kr i måneden."
- **Projects:** "Tenk på det som en mappe der Claude kan alt om et bestemt prosjekt. Last opp filer, skriv instrukser, og Claude husker alt i det prosjektet."
- **Artifacts:** "Her er det første som overrasker. Claude lager ikke bare tekst. Be om en graf, få en graf. Be om en kalkulator, få en som fungerer. Be om en hel nettside, få det."
- **Memory:** "Nytt i 2026. Claude husker hva du jobber med på tvers av samtaler. Gratis-brukere fikk det 2. mars."
- **Connectors:** "Og nå kan du koble Claude direkte til Gmail, Drive, Notion, Slack, regnskap, CRM — over 50 verktøy. Ingen koding."

---

### Slide 8 — DEMO 1: Claude.ai

**Tittel:** *La oss prøve det*

**Visuelt:** Full-screen Claude.ai. Ingen slide — bytt til nettleseren.

**Demo-spec:**

**Prep:** Project ferdig opprettet: "Monstr — kundefeedback Q1." 3 filer: `kundefeedback-q1.csv` (fake data), `monstr-oversikt.pdf`, `screenshot-inbox.png`.

**Prompt (skriv det langsomt):**
```
Gå gjennom feedbacken og finn de tre viktigste mønstrene.
Lag en interaktiv en-siders oversikt jeg kan vise til teamet i morgen.
```

**Forventet output:** Artifact med kort, grafer, farger. Kjører live.

**Talepunkter under demo (3 min):**
- Langsomt. Folk trenger å se skjermen.
- Mens du venter: "Claude bruker 10 sekunder på å tenke. Normalt."
- Når Artifact dukker opp: *pause*. "Dette er ikke et skjermbilde. Dette er en faktisk applikasjon Claude bygde nå. Jeg kan dele linken etterpå."

**Fallback:** `backup-demo1.mp4` på desktop. Spill av etter 15 sek med frys.

---

### Slide 9 — Claude Skills

**Tittel:** *Lær Claude én gang. Bruk for alltid.*

**Visuelt:** Mappestruktur:

```
.claude/skills/
├── monstr-epost/
│   └── SKILL.md
├── ukerapport/
│   └── SKILL.md
└── kundeanalyse/
    └── SKILL.md
```

Til høyre: utdrag av en `SKILL.md` med YAML frontmatter + instruks.

**Talepunkter (2 min):**
- "Her er det som gjør Claude unik. Og jeg skal være ærlig — det tok meg seks måneder å skjønne hvorfor dette var så kraftig. Nå skal jeg gi dere kortversjonen." *[workshop-seed #2]*
- "I stedet for å kopiere instrukser inn i chatten hver gang, skriver du dem én gang — i en fil. Claude kaller det en *Skill*. Bokstavelig talt en mappe med en tekstfil."
- **Konkret eksempel:** "Jeg har en Skill som heter `monstr-epost`. Den vet hvordan Monstr skriver til kunder — tonefall, disclaimere, signatur. Jeg trenger aldri forklare det igjen. Jeg sier bare 'skriv en epost til denne kunden' og Claude bruker Skill-en automatisk."
- "Det betyr: standardiserte arbeidsmåter, uten at det føles som byråkrati. Alle i teamet ditt får samme kvalitet."
- "Skills fungerer i Claude.ai *og* Claude Code. Skriv det én gang, bruk overalt."
- **Aha-linjen:** "Det er som å ansette en ny medarbeider og gi dem en håndbok — men håndboken leses hver eneste gang, av alle, uten unntak."
- **Mini-plant:** "Kunsten — og det er her mange feiler — er å skrive Skill-en på *riktig nivå*. For spesifikk, og den er ubrukelig utenfor ett scenario. For generell, og Claude vet ikke når den skal brukes. Men det er et annet foredrag." *[workshop-seed #3]*

---

### Slide 10 — Claude Cowork

**Tittel:** *Claude Cowork — gi den et mål, få et resultat*
**Undertittel:** *Lansert generelt tilgjengelig 9. april 2026. En uke gammelt.*

**Visuelt:** Tre kolonner:

**Kolonne 1: Hva er det?**
- Desktop-app for Mac og Windows
- Claude styrer datamaskinen din
- Leser filer, åpner apper, sender e-post, jobber i nettleseren
- Planlagte oppgaver: hver mandag, hver måned, hver morgen

**Kolonne 2: Er det trygt?**
- Sandkasse på OS-nivå
- Bare mappene DU velger
- Nettverksproxy blokkerer ukjente servere
- Selv en vellykket prompt injection er isolert
- 84% færre tillatelses-varsler enn før

**Kolonne 3: Dispatch (NYHET)**
- Send oppgaver fra mobilen din
- Claude jobber på desktop-en din
- Kontinuerlig samtale mellom telefon og PC
- Pro og Max-brukere

**Talepunkter (3 min):**

*Del 1 (45 sek) — hva er det:*
- "Her kommer det som skiller Claude fra nesten alt annet."
- "Claude Cowork er en app. Du installerer den på Mac eller Windows. Den gjør én ting: den styrer datamaskinen din."
- "Ikke i en sandkasse-chat. På ekte. Den åpner Finder, leser PDFer, går i Gmail, lager og flytter filer."
- "Du gir den et mål — som å gi en ansatt en oppgave — og den kommer tilbake når det er ferdig."

*Del 2 (45 sek) — sikkerhet (viktig):*
- "Det første folk spør om: 'leser den alt på datamaskinen min?' Nei."
- "Claude Cowork har det som heter sandkasse — altså avgrenset tilgang. Den ser bare mappene du eksplisitt gir den. Den kan bare snakke med godkjente nettsteder."
- "Selv hvis noen klarer å lure Claude via et dokument, er den fanget. Kan ikke stjele passordene dine, kan ikke 'ringe hjem' til en angriper."
- "På macOS bruker den Apple sine innebygde sikkerhetsmurer. Dette er reelt — ikke markedsføring."

*Del 3 (30 sek) — Dispatch:*
- "Her kommer den kule delen."
- "Du trenger ikke sitte ved PC-en din for å gi Cowork oppgaver. Du sender dem fra telefonen."
- "Jeg kan være ute på kundebesøk, tenke 'jeg burde sette opp ukerapporten' — dra frem mobilen, si det til Claude — og det skjer på min Mac hjemme."
- **Transisjon til demo-øyeblikk:** "La meg vise dere."

*Del 4 (30 sek) — DISPATCH SETUP LIVE:*
- Dra frem telefonen. Vis den.
- "Jeg skal sende en oppgave til Cowork på laptopen min nå. Jeg gjør det foran dere — og oppgaven er *for dere*, ikke meg."
- Åpne Claude-appen på mobilen. Skriv eller snakk:
  ```
  Søk opp de viktigste nyhetene og endringene for norske
  småbedrifter og servicenæringer de siste 7-14 dagene.
  Fokuser på regelverksendringer, skatt, tilskuddsordninger,
  bransjenytt, og tekniske endringer som påvirker hvordan
  bedrifter drives. Lag en kort tabell-basert oversikt med
  kildelink på hver sak. Maks 5-7 punkter. Marker hva som
  er umiddelbart handlingskrevende.
  ```
- "Sendt. Den jobber nå på min Mac hjemme. Telefon i lomma."
- **Ikke se på telefonen igjen før slide 14.**

**Kritisk:** Sjekk på forhånd at Dispatch funker med din Claude-konto. Test nøyaktig samme oppgavetype dagen før og mål hvor lang tid den tar — du trenger å vite at den fullføres innen ca 8 min (tiden mellom slide 10 og slide 14).

---

### Slide 11 — Dispatch i detalj (optional, kan kuttes)

**Tittel:** *Dispatch — samme samtale, to enheter*

**Visuelt:** Screenshot av Claude mobil-app + skjermbilde av Cowork på desktop som viser samme tråd.

**Talepunkter (0 min — dette er en no-talking slide, bare visuell):**
- Denne slide-en eksisterer bare som visuell bakgrunn mens du venter på at Dispatch-oppgaven din starter i bakgrunnen.
- Hvis tid tillater, eller som backup.

**Anbefalt: KUTT denne.** Slide 10 dekker Dispatch godt nok. Bare gå direkte til slide 12.

---

### Slide 12 — Claude Code

**Tittel:** *Claude Code — når du vil bygge noe*

**Visuelt:** Fem ikoner: Terminal, VS Code, Desktop app, Web (claude.ai/code), iPhone. Under: *"Samme Claude, fem steder."*

**Talepunkter (2 min):**
- "Siste flate. Og den jeg personlig bruker mest."
- "Claude Code er Claude med tilgang til koden din, filsystemet ditt, og terminalen. Det høres teknisk ut. Det er det delvis. Men ikke la det skremme deg."
- "Claude Code er ikke bare for utviklere. Det er for alle som har noen gang trengt en datamaskin til å *gjøre* noe — lage en rapport, bygge en mini-app, automatisere en rutine."
- "Forskjellen mellom Claude.ai og Claude Code er enkel: Claude.ai *tenker* med deg. Claude Code *gjør* med deg."
- "Den kan kjøre agenter i parallell. Den kan planlegge før den handler. Den kan kjøre mens du sover. Den husker på tvers av sesjoner."
- **Bridge til demo:** "Jeg bygget Monstr på 8 uker. Alene. Med Claude Code. La meg vise deg hvordan."

---

### Slide 13 — DEMO 2: Claude Code — bygg en ROI-kalkulator

**Tittel:** *Live: fra ingenting til fungerende app på 4 minutter*

**Visuelt:** Full-screen terminal + VS Code med en TOM mappe.

**Hva du bygger:** En ROI-kalkulator som viser hvor mye bedrifter taper på sen respons til leads. Relevant for Monstr (forsterker kjerne-budskapet), nyttig som ekte verktøy, og enkelt nok til 4 min.

**Demo-spec:**

1. Tom mappe åpen: `~/demos/roi-kalkulator` (opprett tom, IKKE fra forhåndsfylt mappe).
2. Åpne Claude Code i mappen.
3. Prompt (les høyt mens du skriver):
   ```
   Bygg en enkel HTML-side med en kalkulator som viser
   hvor mye penger bedrifter taper på sen respons til leads.

   Input (tre felter):
   - Antall leads per måned
   - Gjennomsnittlig jobbverdi (kr)
   - Nåværende close rate (%)

   Output (vis stort):
   - Inntekt i dag (kr/år)
   - Potensiell inntekt hvis svartid under 5 min (21x close rate)
   - Tapt inntekt per år — STORT, i varsel-gult

   Bruk Monstr-stilen: mørk bakgrunn (#0a0a0a), hvite overskrifter,
   varsel-gult (#fbbf24) for det viktige tallet. Vanilla HTML + JS,
   ingen rammeverk. Plan mode først. Start en enkel server når
   ferdig så jeg kan vise den live.
   ```
4. Vis **plan mode** → Claude viser planen før handling. La publikum se at Claude *tenker først*.
5. "Godkjent." → Claude skriver filen(e).
6. Når serveren starter: åpne nettleseren på `localhost:8080` (eller tilsvarende).
7. Skriv inn realistiske tall: 50 leads/mnd, 15 000 kr/jobb, 25% close rate.
8. Pek på det gule tallet: *"Dette er realistisk for en gjennomsnittlig norsk håndverker-bedrift. Se tallet. Det er penger som forsvinner fordi ingen svarer telefonen innen 5 minutter."*

**Talepunkter under demo (4 min):**
- "Før vi starter: dette er en ekte mappe, helt tom. Jeg har ikke forhåndsbygd noe."
- Mens Claude planlegger: "Merk at den tenker *først*. Den bygger ikke før jeg har godkjent planen. Det er det som skiller Claude Code fra å bare si til en AI 'bygg noe'."
- Mens Claude koder: *"Første gang jeg gjorde dette brukte jeg tre timer og fikk noe halvferdig. Nå gjør jeg det flere ganger om dagen på 4 minutter. Det er ikke fordi Claude har blitt smartere — det er fordi jeg har lært hvordan jeg skal snakke med den."* *[workshop-seed #4]*
- Når det er ferdig: **"Fire minutter. Fra ingenting til en fungerende app. Og jeg har ikke skrevet en eneste kodelinje."**
- Peker på det gule tallet i browseren: *"Og dette — dette er hvorfor Monstr eksisterer. Forskjellen mellom å svare på 5 minutter og å svare på 30 minutter er sannsynligvis det største udekkede ROI-et i småbedrifter i Norge akkurat nå."*

**Fallback:** `backup-demo2.mp4` — skjermopptak av akkurat samme bygg fra kvelden før. Hvis live henger mer enn 20 sek: *"La meg vise dere innspillingen fra i går kveld med samme prompt."* Spill av.

**Risiko:**
- Claude kan velge å bygge noe litt annerledes enn ditt skjermopptak. Det er OK — forvent det. Ikke si "dette er ikke det jeg forventet."
- Hvis Claude vil installere npm-pakker eller noe mer avansert: i planen kan du se det og si "nei, bare vanilla HTML, takk" før du godkjenner.
- Test PROMPTEN minst 3 ganger på forhånd. Juster formuleringene hvis Claude konsekvent velger feil retning.

---

### Slide 14 — DISPATCH REVEAL 🎯

**Tittel:** *Husker dere hva jeg sendte fra telefonen min?*

**Visuelt:** Skjerm kobles til mobilen eller Cowork-appen på laptop vises. Tabell-output fra bransjenyhet-oppgaven.

**Talepunkter (1.5 min):**
- Dra frem telefonen igjen (eller vis Cowork på skjermen).
- "Husker dere da jeg sendte oppgaven fra telefonen min — for ca 8 minutter siden? La oss se hva som har skjedd."
- Åpne Claude-appen eller Cowork på skjermen.
- Vis tabellen: 5-7 punkter om ukens viktigste nyheter for norske bedrifter, med kildelinker.
- "Mens jeg har snakket med dere, har Claude gått på nettet, lest bransjenyheter, funnet de viktigste sakene, og laget denne oversikten for *dere*. Ikke meg."
- Scroll gjennom listen mens du peker på 2-3 konkrete saker.
- **Punchline:** "Dette er forskjellen på å *bruke* AI og å *ha* AI. Den trenger ikke deg til stede for å levere."
- **Bonus-move (GULL):** "Den er laget for dere — så jeg sender linken på epost til alle som vil ha den etter foredraget. Ta frem telefonen og send meg navnet ditt på [ditt nummer / epost]."

Den siste biten gir deg en lead-magnet. Alle i rommet som tar kontakt blir en lead du kan følge opp.

**Kritisk:** Dette er **magic moment-et** i hele foredraget. Det er også det som kan krasje mest spektakulært hvis det ikke funker. Sikringstiltak:
- Test Dispatch-oppgaven på nøyaktig samme maskin/konto dagen før, samme tid på døgnet.
- Ha en backup-video klar hvor du VISER den samme reveal fra en tidligere testkjøring. "Jeg har også en innspilling av dette fra i går — for sikkerhets skyld."
- Hvis Claude svarer med "Jeg trenger tilgang til X" mens du er på scenen: si "perfekt eksempel på sandkassen vi snakket om!" og spill av backup-videoen.

---

### Slide 15 — Hva du kan starte med i morgen

**Tittel:** *Nivå 1 — tre steder å begynne*

**Visuelt:** Tre kolonner (som før), men med en grå linje nederst:

| **Bare prøve** | **Spare tid** | **Bygge noe** |
|---|---|---|
| **Claude.ai Pro** ~200 kr/mnd | **Claude Cowork** via Pro/Max | **Claude Code** samme pris |
| Opprett et Project for én oppgave du gjør ukentlig. Dra inn filene. Snakk med det. | Gi det én gjentakende oppgave. La det kjøre i en uke. Mål tidsbesparelsen. | Finn en liten ting du skulle ha bygget. En intern side, et script, en rapport. Start. |
| **Første uke:** spar 1 time | **Første uke:** spar 5 timer | **Første uke:** bygg noe ekte |

Nederst, i grå tekst:
> *Dette er nivå 1. Nivå 2 er når hele teamet ditt jobber slik, med egne Skills, egne automatiseringer, og integrasjoner mot systemene dere allerede bruker. Det er et annet foredrag.*

**Talepunkter (2.5 min):**
- "Dette er ikke en teknologi-utstilling. Dette er verktøy du kan ha i dag."
- "Mitt råd: velg ÉN av de tre. Ikke alle på én gang. Velg den du trenger mest, og hold deg der i to uker."
- "De fleste feiler ikke fordi AI er for komplisert. De feiler fordi de prøver for mye på én gang, blir overveldet, og gir opp."
- "Én oppgave. Én uke. Mål resultatet. Utvid derfra."
- "Hvis du er usikker på hvilken: start med Claude.ai Pro og Projects. Det er lavest terskel."
- **Tilhører workshop-hook:** *"Og vær oppmerksom på at det dere ser her — det er nivå 1. Det er enkeltpersonen som lærer å bruke verktøyene. Nivå 2 er når et helt team jobber slik sammen: egne Skills, egne automatiseringer, koblet til deres egne systemer. Det er en annen samtale, og den krever en annen prosess. Men det er dit de fleste bedrifter som lykkes med dette, ender opp."* *[workshop-seed #5 — eksplisitt men ikke pitch]*

---

### Slide 16 — Close

**Tittel:** *Se igjen. Mars 2023 → februar 2026 → ?*

**Visuelt:** Tre små thumbnails fra slide 2. Over: et tomt spørsmålstegn der "april 2028" ville vært.

**Talepunkter (2 min):**
- "Husk disse tre klippene fra starten?"
- "Det er tre år mellom venstre og høyre. Og seks uker mellom midten og høyre."
- *Pause.*
- "Det jeg har vist dere i dag — Claude.ai, Skills, Cowork, Dispatch, Claude Code — det er ikke komplisert teknologi. Det er verktøy dere kan ha på plass i løpet av en ettermiddag."
- "Men det jeg *ikke* har vist dere er hvordan dere får et helt team til å jobbe slik. Hvordan dere bygger Skills som passer for *deres* bedrift. Hvordan dere kobler dette til systemene dere allerede har. Og hvordan dere unngår de 6 måneder med prøving og feiling jeg selv gikk gjennom."
- "Det krever en annen samtale. Og jeg tenker at det er den vi tar hvis dere tar kontakt etterpå."
- *Pause. Se på rommet.*
- "Spørsmålet er ikke om AI kommer til å endre hvordan dere jobber. Det gjorde det allerede."
- "Spørsmålet er om dere vil være blant dem som *kjente det på kroppen* de neste 12 månedene — eller blant dem som kom for sent."
- **Mellom-punchline:** "De som starter denne måneden får to års forsprang på de som venter til neste vår. Og to år nå — er mer enn to år pleide å være."
- **Punchline:** "Jeg står her ikke fordi AI er nytt. Jeg står her fordi det allerede er her — og jeg ønsker å gi dere et forsprang. Kom og snakk med meg etterpå hvis dere vil vite hvordan."

**Kritisk tonal note:** Den avsluttende linjen ("kom og snakk med meg etterpå") skal være rolig, ikke salgsaktig. Du inviterer til samtale, ikke til kjøp. Du skal ikke engang nevne ordet "workshop" på scenen. Hele closingen skaper curiosity + invitasjon. De som er interesserte vil komme til deg.

---

### Slide 17 — Q&A / Takk

**Tittel:** *Spørsmål?*

**Visuelt:**
- Ivar
- Telefonnummer / epost (stort)
- QR-kode som lenker til en enkel landingsside (valgfritt men sterkt anbefalt — se Workshop-hook-inventar nederst)
- Monstr-logo
- Tekst under: *"Send meg en melding hvis du vil ha bransjenyhet-oversikten fra i dag — eller bare for å snakke videre."*

**Talepunkter:** Q&A, opptil 2 min. Hard close etter det.

**Lead capture-strategi:** Dispatch reveal-slide (13) er der du ber dem eksplisitt om å ta kontakt for nyhetsrapporten. Slide 16 er passivt — bare kontaktinfo. Ikke be om telefoner på scenen — la dem komme til deg i pausen. Det er mer effektivt og mindre pushy.

---

## Demo-playbook

### Demo 1 — Claude.ai (slide 8)

**Mål:** Vis Projects + Artifacts + Memory i én flyt. 3 minutter.

**Før scenen:**
- [ ] Project "Monstr — kundefeedback Q1" opprettet
- [ ] 3 filer lastet opp (CSV, PDF, PNG)
- [ ] Testkjørt promptet minst én gang — sjekk at Artifact ser bra ut
- [ ] `backup-demo1.mp4` på desktop (skjermopptak av vellykket kjøring)
- [ ] Nettleser ren — privat modus, signed-in Claude, ingen personlige bookmarks
- [ ] Font-size økt til 150% i nettleseren

**Prompt:**
```
Gå gjennom feedbacken og finn de tre viktigste mønstrene.
Lag en interaktiv en-siders oversikt jeg kan vise til teamet i morgen.
```

**Hvis henger:** 15 sek vent. Deretter: "La meg vise dere innspillingen fra i går." → spill av backup.

---

### Demo 2 — Claude Code bygger ROI-kalkulator (slide 13)

**Mål:** Vis at ikke-utviklere kan lage ekte apper fra ingenting. 4 minutter.

**Før scenen:**
- [ ] Tom mappe klar: `~/demos/roi-kalkulator` (tom!)
- [ ] Claude Code åpen i terminal, innlogget, på Opus 4.6
- [ ] Plan mode testet
- [ ] Font-size: minst 16pt i terminal, 150% i VS Code, 150% i nettleser
- [ ] Mørk bakgrunn, lyse farger (projektorer hater lyst på lyst)
- [ ] `backup-demo2.mp4` fra i går kveld (skjermopptak av samme prompt)
- [ ] **KRITISK:** Ingen hemmeligheter synlig i `.env` eller tabs — dobbeltsjekk
- [ ] iMessage/Slack/Mail slått av
- [ ] Test nettleser-sti: vit hvilken `localhost:XXXX` Claude velger (varierer — kan være 8080, 3000, 5173)
- [ ] **Testkjør promptet minst 3 ganger i forveien** — juster ordene hvis Claude konsekvent velger feil retning
- [ ] Realistiske testverdier huskt: f.eks. 50 leads/mnd, 15 000 kr jobbverdi, 25% close rate → viser tydelig tap

**Prompt (copy-paste fra slide 13 over):** se slide 13-spec for full prompt.

**Mens den jobber:**
- *Under plan mode:* "Merk at den tenker *først*. Den bygger ikke før jeg har godkjent planen."
- *Mens den koder:* "Jeg gjør dette flere ganger om dagen. Det føles aldri magisk lenger. Det føles som verktøy."

**Når ferdig:**
- Skift til nettleser.
- Skriv inn testverdiene.
- Pek på det gule tallet.
- "Fire minutter. Fra ingenting til en fungerende app. Og dette — dette er hvorfor Monstr eksisterer."

---

### Dispatch Reveal (slide 10 setup + slide 14 reveal) — SIGNATUR-DEMOEN

**Mål:** Visuelt bevis på autonomt arbeid. 30 sek setup + 1.5 min reveal.

**Før scenen:**
- [ ] Claude mobil-app innlogget på telefonen din
- [ ] Claude Cowork innlogget på laptopen din (og slått på, koblet til wifi)
- [ ] Dispatch testet dagen før med nøyaktig samme oppgavetype
- [ ] Vit hvor lang tid en typisk Dispatch-oppgave tar (mål det på forhånd)
- [ ] Backup-video av tidligere vellykket reveal: `backup-dispatch-reveal.mp4`
- [ ] Mobilen lader hele tiden eller har 100% batteri
- [ ] Mobilen har ikke notifikasjoner på som vil distrahere

**Dispatch-prompt (sendes på slide 10):**
```
Søk opp de viktigste nyhetene og endringene for norske
småbedrifter og servicenæringer de siste 7-14 dagene.
Fokuser på regelverksendringer, skatt, tilskuddsordninger,
bransjenytt, og tekniske endringer som påvirker hvordan
bedrifter drives. Lag en kort tabell-basert oversikt med
kildelink på hver sak. Maks 5-7 punkter. Marker hva som
er umiddelbart handlingskrevende.
```

**Hvorfor denne oppgaven:**
- Universelt relevant for alle bedriftseiere i rommet
- Ingen private data som skal vises på skjerm
- Krever computer use (Claude må gå på nettet) — visuelt imponerende
- Output er en tabell som er lett å forstå på 2 sekunder
- Du kan dele resultatet med publikum som en lead-magnet etter foredraget

**TIMING:** Send denne på slide 10 (~15 min inn). Reveal på slide 14 (~23-24 min inn). Det gir Dispatch ca 8 minutter å fullføre.

**Test det dagen før:** Mål hvor lang tid din Cowork bruker på akkurat denne oppgaven med din internettforbindelse. Hvis den tar >10 min, forkort tidsrommet ("siste 7 dager" i stedet for 14). Hvis <5 min, utvid.

**Ekstra sikkerhet:** Kjør Dispatch-oppgaven 30-45 min før du går på scenen (fra garderoben eller baksiden). Det betyr oppgaven allerede er ferdig lenge før du trenger å vise resultatet. Teknisk sett "cheater" du — men audiencen vet ikke det, og risikoen for at noe krasjer live er 0.

**Hvis det ikke er ferdig når du er på slide 14:**
- "Den jobber fortsatt! Autonome systemer er ikke magi — de tar tid. La meg vise dere hva den gjorde i går, samme oppgave." → spill av backup.

**Hvis Dispatch kræsjer helt:**
- "Akkurat som jeg sa — dette er én uke gammelt. Vi er tidlige. Her er hva det ser ut når det funker." → spill av backup.

---

## Q&A

Forbered deg på disse 10 spørsmålene. Memorer kjerne-svarene. De er skrevet kort med vilje.

### 1. "Er dataene mine trygge? Leser Claude de private filene mine?"

**Kort svar:**
> Cowork har sandkasse — det betyr avgrenset tilgang. Den ser bare mappene du eksplisitt gir den. OS-nivå beskyttelse på Mac og Linux. Selv en vellykket prompt injection kan ikke ringe hjem eller stjele SSH-nøkler. Pro/Team/Enterprise: dataene dine trenes ikke på. Enterprise har Zero Data Retention hvis du trenger det for regulerte bransjer.

**Hvis de presser:**
> Du kan også kjøre Claude Code lokalt mot din egen kode — filer forlater aldri maskinen din med mindre du velger det.

---

### 2. "Hva koster det?"

**Kort svar:**
> Claude.ai Pro: ~200 kr/mnd. Max: ~1000-2000 kr/mnd for ekstra kapasitet. Team: ~250 kr/bruker/mnd. Enterprise: på avtale. Claude Code er inkludert i Pro. Start med Pro. Det er mindre enn én time med regnskapshjelp.

---

### 3. "Må jeg kunne kode?"

**Kort svar:**
> Nei. For Claude.ai og Cowork: absolutt ikke. For Claude Code: du trenger ikke kunne kode, men du må være komfortabel med å åpne en terminal. Det er som å gå fra å bruke en bil til å løfte panseret — ikke kjemi-grad, bare litt nysgjerrighet.

---

### 4. "Fungerer det på norsk?"

**Kort svar:**
> Ja. Flytende norsk. Jeg bruker det til kundebrev, rapporter, og tekniske dokumenter på norsk hver eneste dag. Den forstår også dialekter rimelig godt.

---

### 5. "Hva skjer hvis Claude gjør noe feil på datamaskinen min?"

**Kort svar:**
> Cowork spør om tillatelse når den vil gjøre noe utenfor sandkassen. Du kan alltid stoppe den midt i. Filer den "sletter" havner i papirkurven — du kan angre. Mitt råd: start med en testmappe, ikke hele Desktop-en din, før du stoler fullt på den.

---

### 6. "Hva med GDPR?"

**Kort svar:**
> Ja, Anthropic støtter GDPR. Du kan be om sletting av dataene dine. For Team og Enterprise er dataene lagret i EU. For Pro brukere: dataene dine trenes det ikke på som standard.

**Hvis de presser på regulerte bransjer:**
> For helse, finans, eller jus trenger du Enterprise-planen med Zero Data Retention. Det eksisterer.

---

### 7. "Hva er forskjellen på dette og ChatGPT?"

**Kort svar:**
> ChatGPT er bredere kjent og har flere brukere. Claude er lengre fremme på ett område: å faktisk gjøre arbeid — ikke bare svare på spørsmål. Cowork, computer use, Skills, sandkasse — alt er designet for autonomt arbeid på dine filer. For tekst-chat velger mange ChatGPT. For å få ting gjort, velger du Claude. Mitt råd hvis du har råd: ha begge.

---

### 8. "Hvor lang tid tok det å bygge Monstr?"

**Kort svar:**
> 8 uker. Alene. Med Claude Code. Det er ikke å skryte — det er å illustrere kapasiteten. Hadde tatt meg 6 måneder uten Claude. Kanskje aldri i det hele tatt.

---

### 9. "Kan jeg erstatte ansatte med dette?"

**Kort svar:**
> Feil spørsmål. Riktig spørsmål er: "Hva kan jeg gjøre nå som jeg ikke hadde tid til før?" De som vinner er ikke de som kutter kostnader — det er de som skalerer ambisjonene. AI gjør deg ikke billigere. Den gjør deg større.

---

### 10. "Hva er den største feilen nybegynnere gjør?"

**Kort svar:**
> To ting. Først: de prøver alt på én gang — AI til alt, hver dag, overalt. De blir overveldet og gir opp. Velg én oppgave. Én uke. Mål. Utvid. Andre: de gir opp etter to-tre dårlige resultater og tror "AI fungerer ikke". Det fungerer. Men det krever at du lærer å snakke til det. Det er en ferdighet — akkurat som å lære å Google.

---

### Bonus-spørsmål som kan dukke opp

**"Blir ikke alt dette endret neste måned?"**
> Ja. Men venting er ikke en strategi. Byggingen du gjør nå er plattformen du vinner på i 2027. De som venter på at det skal "stabilisere seg" venter alltid.

**"Kommer det på norsk?"**
> Det er på norsk. Nå. Grensesnittet er på engelsk, men samtalene kan være på norsk.

**"Hva om jeg ikke stoler på AI?"**
> Helt gyldig. Start med oppgaver du allerede kunne gjort selv — og bruk AI til å gjøre dem raskere. Ikke la AI bestemme noe viktig før du har sett at den leverer konsistent i en måned.

---

## Pre-talk sjekkliste

### 2 dager før (2026-04-15)
- [ ] Slide-deck ferdig (Keynote / Google Slides / PDF)
- [ ] Demoene testet end-to-end én gang hver
- [ ] Alle backup-videoer spilt inn: `backup-demo1.mp4`, `backup-demo2.mp4`, `backup-dispatch-reveal.mp4`
- [ ] Project i Claude.ai forhåndspopulert med data
- [ ] Monstr-repoen i god stand, demo-branch klar
- [ ] Video-klippene lastet ned lokalt: Will Smith 2023, Sora 2, Seedance 2.0
- [ ] Dispatch testet på din telefon og laptop, med samme oppgavetype du skal kjøre
- [ ] Q&A memorert — du skal kunne svare på alle 10 uten å nøle

### Dagen før (2026-04-16)
- [ ] Kjør hele presentasjonen gjennom én gang med timer — sikt 28 min
- [ ] Test projektor-oppsett hvis mulig
- [ ] Lad opp alt: laptop, mobil, iPad hvis relevant
- [ ] Backup-disk med alle videoer + prompts på minnepenn (USB-C + USB-A adapter?)
- [ ] Dispatch-test: send en oppgave kvelden før, se om den fullfører innen tidsrommet du trenger

### 30 min før
- [ ] Lukk alle tabs og apper — bare Claude.ai, terminal, Cowork, Keynote
- [ ] Slå av alle notifikasjoner: iMessage, Slack, Mail, WhatsApp, alt
- [ ] Koble til wifi + sjekk hastighet
- [ ] Fyll vannflaska
- [ ] Gå på do
- [ ] **Trigger Dispatch-oppgaven fra telefonen din akkurat før du går på scenen** (hvis du vil, som ekstra sikkerhet — det betyr at oppgaven har 30+ min på seg til å fullføre før slide 14)

### 30 sek før
- [ ] Pust.
- [ ] Du har gjort dette 100 ganger i hodet ditt. Bare gjør det.

---

## Beslutninger tatt (v3-v4)

Alle åpne spørsmål fra v2 er nå lukket:

- ✅ **Slide-format:** Keynote
- ✅ **Demo 2:** Alternativ B — bygg ROI-kalkulator fra scratch (ikke endre Monstr)
- ✅ **Dispatch-oppgave:** Bransjenyheter for norske småbedrifter (universelt relevant, ingen private data, lead-magnet-potensiale på reveal)
- ✅ **Partner-rolle:** Teknisk support og backup-håndtering (ikke live-bygging på scenen)
- ✅ **Publikumsstørrelse:** ~20 personer (intimt format)
- ✅ **Skjult mål:** Skape workshop-begjær uten eksplisitt pitch

Ingen åpne spørsmål før testkjøringer starter.

---

## Workshop-hook-øyeblikk

Dette er inventaret over alle subtile seeds plantet gjennom foredraget for å skape workshop-begjær. Når du rehearser, sørg for at disse linjene kommer naturlig — ikke som auswendig-lærte pitches.

| # | Slide | Linje / øyeblikk | Hva det planter |
|---|-------|------------------|-----------------|
| 1 | 1 (Åpning) | *"...de siste månedene har jeg brukt mer og mer tid på å hjelpe andre bedrifter komme i gang med det samme."* | At du allerede hjelper andre — du er en man kan snakke med |
| 2 | 9 (Skills) | *"Det tok meg seks måneder å skjønne hvorfor dette var så kraftig."* | Læringskurve eksisterer — snarvei finnes |
| 3 | 9 (Skills) | *"Men det er et annet foredrag."* (om Skill-design) | Det finnes dypere innsikt du kunne delt |
| 4 | 13 (Claude Code demo) | *"Første gang jeg gjorde dette brukte jeg tre timer og fikk noe halvferdig. Nå gjør jeg det på 4 minutter. Det er fordi jeg har lært hvordan jeg skal snakke med den."* | Ferdighet, ikke magi. Ferdighet kan læres bort. |
| 5 | 15 (Hva du kan starte med) | *"Dette er nivå 1. Nivå 2 er når hele teamet ditt jobber slik... Det er en annen samtale, og den krever en annen prosess."* | Eksplisitt (men ikke salesy) hint om at det finnes et steg opp |
| 6 | 16 (Close) | *"...hvordan dere unngår de 6 måneder med prøving og feiling jeg selv gikk gjennom. Det krever en annen samtale. Og jeg tenker at det er den vi tar hvis dere tar kontakt etterpå."* | Direkte invitasjon — men ramme som "samtale", ikke "kjøp" |
| 7 | 16 (Close) | *"Kom og snakk med meg etterpå hvis dere vil vite hvordan."* | Soft CTA — de interesserte selv-selekterer |
| 8 | 14 (Dispatch reveal) | *"Den er laget for dere — send meg navnet ditt for å få den på epost."* | Lead capture-mekanisme (ikke workshop-pitch, men list-building som muliggjør oppfølging) |

**Kritisk regel:** Du skal **aldri nevne "workshop", "kurs", eller pris** på scenen. Hele maskineriet er bygget for at folk kommer til *deg* etter foredraget og spør "hvordan kan jeg lære dette?" — og *da* har du samtalen om hva du tilbyr.

**Hvis noen spør direkte under Q&A "kan du hjelpe oss komme i gang?":** Svar: *"Ja, det er det jeg holder på med når jeg ikke bygger Monstr. Kom og snakk med meg etterpå, så kan vi se på hva dere har i dag og hva som passer."* Rolig. Ikke-salgsaktig. Individualisering.

### Anbefalt oppfølgingsmekanisme

**Opprett en enkel landingsside før foredraget** — kan være én side du bygger i Claude Code (poetisk, gitt at det reinforcer budskapet). Innhold:

1. "Takk for at du var på foredraget"
2. Knapp: "Få bransjenyhet-oversikten på epost" (epost-fangst)
3. Subtil: "Ønsker du hjelp med å komme i gang selv eller med teamet?" → kort skjema eller Calendly

QR-kode på slide 17 lenker hit. Alt som kommer inn er kvalifiserte leads for videre samtale.

---

## Ressurser og kilder

### Offisiell dokumentasjon
- [Claude Cowork (Anthropic)](https://www.anthropic.com/product/claude-cowork)
- [Cowork på claude.com](https://claude.com/product/cowork)
- [Claude Code sandboxing](https://code.claude.com/docs/en/sandboxing)
- [Claude Skills dokumentasjon](https://code.claude.com/docs/en/skills)
- [Claude Skills repo (GitHub)](https://github.com/anthropics/skills)
- [Assign tasks from anywhere (Dispatch)](https://support.claude.com/en/articles/13947068-assign-tasks-to-claude-from-anywhere-in-cowork)
- [Dispatch og Computer Use (blog)](https://claude.com/blog/dispatch-and-computer-use)

### Video-referanser
- [Will Smith Eating Spaghetti test (Wikipedia)](https://en.wikipedia.org/wiki/Will_Smith_Eating_Spaghetti_test)
- [Sora 2 (OpenAI)](https://openai.com/index/sora-2/)
- [Seedance 2.0 på CapCut (TechCrunch)](https://techcrunch.com/2026/03/26/bytedances-new-ai-video-generation-model-dreamina-seedance-2-0-comes-to-capcut/)

### Sikkerhet / permissions
- [Making Claude Code more secure (Anthropic engineering)](https://www.anthropic.com/engineering/claude-code-sandboxing)
- [Claude Cowork permission model](https://milvus.io/ai-quick-reference/what-permission-model-does-claude-cowork-use-for-accessing-my-files-and-data)

---

*Sist oppdatert: 2026-04-14 av Claude (Opus 4.6, 1M kontekst)*
