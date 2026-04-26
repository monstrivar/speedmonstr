# Pricing-seksjon + AI-Partner-pivot — designdokument

**Dato:** 2026-04-26
**Eier:** Ivar
**Status:** Designgodkjent, klar for implementasjonsplan
**Scope-valg:** B — pricing-seksjon + nye landing pages + cleanup av eksisterende audit-fokuserte seksjoner

---

## Hva vi bygger

Replacer Agentiks tidligere "AI Opportunity Audit som hovedprodukt"-narrativ med ny posisjonering: **AI-Partner som fast månedlig avtale**, hvor AI-Revisjonen er inkludert som første fase. Workshop forblir et sidetilbud.

Nye landing pages bygges for SEO og selvstendig kunde-utforsking. Eksisterende seksjoner som peker mot Audit som separat produkt oppdateres til å støtte det nye narrativet.

---

## Hovedoffer-struktur

### AI-Partner (hovedprodukt)

- **Pris:** 39 000 kr/mnd
- **Binding:** Ingen binding etter 90 dager (månedlig oppsigelse etter Sprint)
- **Founding-vindu:** Første 3 partnere låser 39k for alltid. Når Founding er fylt går prisen opp til 49k/mnd.
- **Inkludert:**
  1. Komplett AI-Revisjon (egen detaljert side: `/ai-revisjon`)
  2. Eget ROI-dashbord (live oversikt, settes opp automatisk ved oppstart)
  3. Månedlig strategimøte og prioritering
  4. Bygging, vedlikehold og videreutvikling av AI-løsninger
  5. Direkte Slack-tilgang for løpende rådgivning
  6. Opplæring av teamet i de nye løsningene
- **"90-dagers verdigaranti" (vises både på pricing-kort som teaser, og full versjon på /ai-partner):**
  > **90-dagers verdigaranti**
  >
  > Innen 90 dager skal vi ha kartlagt, prioritert og implementert AI- og automasjonstiltak med dokumentert årlig verdipotensial tilsvarende **minst 2x investeringen deres i perioden**.
  >
  > Hvis vi ikke klarer det, jobber vi videre uten månedlig honorar til verdien er dokumentert.
  >
  > *Verdien kan komme fra spart tid, frigjort kapasitet, raskere oppfølging, færre manuelle steg, færre feil eller bedre utnyttelse av eksisterende ressurser.*
  >
  > **Punchline:** "Garantien er gulvet. Business caset er målet."

- **Vilkår for at garantien gjelder (vises på /ai-partner i egen seksjon):**
  Garantien gjelder når kunden:
  - gir nødvendige systemtilganger innen avtalt tid
  - stiller med én intern kontaktperson
  - deltar på avtalte møter/workshops
  - gir tilbakemelding innen avtalt frist
  - tar i bruk løsningene som er avtalt
  - har nok volum/repetitive prosesser til at verdipotensialet er realistisk

- **Kontraktsmessig tids-cap (intern, ikke nevnt på siden):** maks 90 ekstra dager fritt arbeid. Etter det refunderes siste faktura. Definisjon av "dokumentert" og "verdipotensial" skrives inn i kontrakt på Dag 1.

### AI Workshop (sidetilbud)

- **Pris:** Fra 25 000 kr
- **Format:** Halvdag/heldag, ledere eller team
- **Mål:** Opplæring + inngangsport for de som ikke er klare for AI-Partner

---

## Pricing-seksjon (visuelt)

Lås godkjent i visuell brainstorm v7. Kort sammendrag av komponenten:

**Layout:**
- Sentrert overskrift: "Slik jobber vi sammen"
- Sub: "Vi tar inn 3 partnere de neste 60 dagene. Etter det går prisen opp."
- **Hero-kort (AI-Partner)** — hvit bakgrunn, cream-seksjon rundt, copper-badge "2 av 3 spots" øverst høyre
  - Eyebrow (mono, petrol, uppercase): "Hovedtilbud"
  - Produktnavn (Plus Jakarta Sans, 36px, bold, slate): "AI-Partner"
  - Subtitle (15px, slate@62%): "Fast AI-rådgiver og dev-team for bedrifter som vil få AI fra idé til drift — uten å ansette internt."
  - Pris-linje (mono, 13px): "39 000 kr/mnd · ingen binding etter 90 dager"
  - Skillelinje
  - **AI-Revisjon callout** — petrol-gradient bakgrunn, en-linjes hook med "★ Inkludert" + "Komplett AI-Revisjon" + "Les hva det er →" (lenker til `/ai-revisjon`)
  - **ROI-dashbord-bullet** — copper-tonet bakgrunn, full bredde, 📊 emoji, kort beskrivelse
  - 3 vanlige bullets (2-kolonner grid): strategimøte, bygging+vedlikehold, Slack-tilgang, opplæring
  - CTA-knapp (copper, "Les mer om AI-Partner →") — lenker til `/ai-partner`
- **Sekundær-kort (Workshop)** — horisontal rad, hvit, sekundær-knapp ("Les mer →")
- **Anker-tekst nederst:** "Når Founding er fylt: AI-Partner blir 49 000 kr/mnd"

**Brand-palette:**
- Bakgrunn: `#F5F2EC` (cream)
- Kort: `#FFFFFF`
- Tekst primær: `#1A1F25` (slate)
- Eyebrow/aksent: `#1A6B6D` (petrol)
- Highlight-bakgrunn (ROI): `rgba(196,133,76,0.06)` med border `rgba(196,133,76,0.15)`
- AI-Revisjon-callout: lineær gradient petrol→signal med lav opacitet
- CTA: `#C4854C` (copper)

**Plassering på forsiden:** Mellom `Proof` (testimonialer) og `Process` (metode). Ny seksjon-id: `#tilbud`.

---

## Nye landing pages

### `/ai-revisjon`

**Mål:** SEO-rangering for "AI revisjon", "AI audit Norge", "AI kartlegging bedrift". Lar lead utforske og selge seg selv.

**Struktur (anslått 1000–1500 ord):**

1. **Hero** — "AI-Revisjon" + 1-setnings hook ("Vi finner hvor AI gir høyest ROI hos dere før vi bygger noe.")
2. **Hva er en AI-Revisjon?** — 2–3 avsnitt om hvorfor kartlegging trumfer "bygg først"
3. **Slik gjør vi det** — 4 steg:
   - Kickoff og intervjuer med ledelsen og nøkkelpersoner
   - Prosesskartlegging (manuelle flyter, dataflyt, systemer)
   - ROI-prioritering (hvilke tiltak gir mest, hvilke er enkleste)
   - Konkret 90-dagers roadmap med valgte tiltak
4. **Hva dere får** — bullet-liste med deliverables (rapport, roadmap, prioriteringsliste, neste-steg-anbefaling)
5. **For hvem passer dette?** — 4 case-typer (kundeservice, salg/leads, intern admin, rapportering)
6. **Hvorfor inkludert i AI-Partner** — kort om hvorfor dette IKKE selges som standalone (vi bygger ikke uten å ha kartlagt først)
7. **FAQ** — 5–7 spørsmål: hvor lang tid, må vi gjøre noe, hvilke systemer trengs, hva hvis vi ikke ser ROI, kan vi få revisjonen alene
8. **CTA** — "Klar for å starte? Bli AI-Partner →" (lenker tilbake til `/ai-partner`)

**SEO:**
- `<title>`: "AI-Revisjon — kartlegging av hvor AI gir høyest ROI | Agentik"
- Meta description: ~150 chars, inneholder "AI-revisjon" og "norske bedrifter"
- Schema.org `Service` markup
- H1 = "AI-Revisjon", H2 per seksjon

### `/ai-partner`

**Mål:** Full sell på AI-Partner-pakken. Lead som kommer hit er kvalifisert.

**Struktur (anslått 1500–2000 ord):**

1. **Hero** — "AI-Partner" + hovedhook ("Fra AI-nysgjerrighet til AI i drift, uten å ansette internt.")
2. **Hva er det?** — 1-2 avsnitt om partner-modellen (vs. one-off konsulent)
3. **Slik fungerer det** — 4 faser:
   - Fase 1 (uke 1–2): AI-Revisjon (lenker til `/ai-revisjon` for detaljer)
   - Fase 2 (uke 3–6): Bygging av første AI-løsning
   - Fase 3 (uke 7–12): Optimalisering + 90-dagers roadmap låst
   - Fase 4 (mnd 4+): Løpende partnerskap, måned-til-måned
4. **Hva som er inkludert** — utdypende liste (samme bullets som pricing-kort + dybde):
   - Komplett AI-Revisjon
   - Eget ROI-dashbord (med screenshot/mockup hvis mulig)
   - Månedlig strategimøte
   - Bygging og vedlikehold
   - Slack-tilgang
   - Opplæring av teamet
5. **Garantien vår** — full tekst som over, fremhevet seksjon
6. **Pris** — 39k/mnd Founding (3 spots), 49k/mnd etter
7. **Hva som IKKE er inkludert** — ærlighet om grenser (software-kostnader, eksterne API-kostnader, ekstreme prosjekter prises separat)
8. **For hvem passer dette?** — kvalifiserings-framing: passer for bedrifter med manuelle prosesser, repeterende oppgaver og nok volum
9. **Når passer det ikke?** — ærlig: hvis ikke 2x potensial → anbefal heller Workshop eller mindre forprosjekt
10. **CTA** — "uforpliktende samtale" framing, ikke commit-to-buy
9. **FAQ** — 7–10 spørsmål: oppsigelse, scope, software-kostnader, om vi feiler garantien, oppskalering, etc.
10. **CTA** — kontaktskjema-link (`#contact` på forsiden) eller calendly-style booking-link

**SEO:**
- `<title>`: "AI-Partner — fast AI-rådgiver for norske bedrifter | Agentik"
- Schema.org `Service` markup
- Internal links til `/ai-revisjon`, og til forsiden#contact

---

## Eksisterende seksjoner — endringer

| Seksjon | Endring | Linje (ca.) |
|---|---|---|
| `Hero` (NySide.jsx) | CTA-tekst eller subtekst som nevner Audit → AI-Partner | ~112 |
| `Outcomes` | Hvis nevner Audit som outcome → endre til AI-Partner | 735 |
| `Workshops` | Final CTA "starter med en AI Audit" → "starter med å bli AI-Partner" | 902 |
| `Process` | 3-stegs flow Intro→Audit→Implementering → ny: Kartlegg→Bygg→Forbedre (eller Sprint→Drift→Skalering) | 926 |
| `RiskReversal` | "Audit trekkes fra" → 120k garanti-budskap (kort versjon, peker til /ai-partner) | 1035 |

**Hva som IKKE endres:** Hero-tagline, LiveAgents, GraphSection, Urgency, Proof, Team, ContactForm. Disse er offer-agnostisk.

---

## Komponentbrytning

**Nye filer:**

```
src/
├── components/
│   └── PricingSection.jsx          (ny — hero-kort + Workshop-kort + anker-tekst)
└── pages/
    ├── AiRevisjon.jsx               (ny — landing page for /ai-revisjon)
    └── AiPartner.jsx                (ny — landing page for /ai-partner)
```

**Endringer i eksisterende filer:**

```
src/main.jsx                         routes for /ai-revisjon og /ai-partner
src/pages/NySide.jsx                 import + plasser <PricingSection />
                                     oppdater Process, RiskReversal, Workshops, Outcomes copy
```

**Hvorfor PricingSection som egen komponent:** NySide.jsx er allerede 1346 linjer. Pricing er en stor logisk enhet med egen styling-overhead. Ut i egen fil holder NySide.jsx håndterbar.

**Hvorfor /ai-revisjon og /ai-partner som egne sider, ikke modaler:** SEO. Modaler har én URL og rangerer ikke. Egne sider får hver sin metatag-kontekst og kan deles direkte.

---

## Routing

`src/main.jsx` har allerede `BrowserRouter` med ruter for `/`, `/personvern`, `/vilkar`. Legg til:

```jsx
<Route path="/ai-revisjon" element={<AiRevisjon />} />
<Route path="/ai-partner" element={<AiPartner />} />
```

Begge sider trenger samme `Navbar` og en footer (eller Navbar + simpel link-rad nederst).

---

## SEO-detaljer

**Per-side meta:**
- `react-helmet-async` allerede i bruk på `NySide.jsx` — gjenbruk pattern
- Hver landing page får unik `<title>`, `<meta description>`, `<meta property="og:*">` og `<link rel="canonical">`

**Schema.org:**
- AI-Partner-siden: `Service` schema med `provider`, `serviceType: "AI Consulting"`, `offers: { price: "39000", priceCurrency: "NOK" }`
- AI-Revisjon-siden: `Service` schema med tilsvarende felt

**Internal linking:**
- Pricing-kort på forsiden lenker til `/ai-partner` og `/ai-revisjon`
- `/ai-revisjon` lenker tilbake til `/ai-partner` i CTA
- `/ai-partner` lenker til `/ai-revisjon` i Fase 1-beskrivelsen

---

## Hva vi IKKE bygger nå (eksplisitt scope-cap)

- `/ai-workshop`-side (Workshop-kortet kan lenke til `#contact` for nå, eller til en simpel anker innenfor en eksisterende seksjon)
- ROI-dashbord-produktet selv (det er en separat byggesak; pricing-siden lover bare at det finnes)
- Booking-engine på `/ai-partner` (CTA peker mot eksisterende `#contact` med skjema)
- Customer testimonialer per pakke (Proof-seksjonen er offer-agnostisk og forblir)

---

## Rekkefølge på implementasjon (forslag — utdypes i plan)

1. Pricing-seksjon-komponent + plasser i NySide.jsx
2. Cleanup av Process, RiskReversal, Workshops, Outcomes copy
3. `/ai-partner`-side
4. `/ai-revisjon`-side
5. Routing + SEO

Ship'es som én PR eller fire mindre PRs — avgjøres i implementasjonsplan.

---

## Åpne spørsmål — behandles i plan-fasen

- Hvor mye case-tekst skrives på `/ai-revisjon` (ekte vs. generisk siden vi har 0 kunder å referere)?
- Skal `/ai-partner` inkludere en demo/mockup av ROI-dashbordet, eller bare beskrive det?
- Hva er Process sin nye 3-stegs-formulering? Forslag: "Kartlegg → Bygg → Forbedre" (matcher partneravtalen-doc) eller "Sprint → Drift → Skalering"?
- Worker `react-helmet-async` riktig på rene `/ai-revisjon`-ruter (ikke bare på forsiden)? Bør verifiseres i implementasjon.
