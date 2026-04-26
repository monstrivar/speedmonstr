# Handoff — AI-Partner pivot

**Dato:** 2026-04-26
**Branch:** `feat/ai-partner-pivot` (24 commits, ikke pushet til remote)
**Status:** AI-Partner-pivot er i hovedsak ferdig. Klar for visuelle polish-runder eller merge til main.

---

## Hvor vi forlot det

Brukeren testet `/ai-partner` og `/ai-revisjon` etter et større visuelt redesign og ga to typer feedback:

1. **Tekst-forbedringer (DONE)** — endret "For hvem" fra use-cases til roller (Daglig leder, COO, CFO, Avdelingsleder), og reframet "Hva dere får" / "Hva som er inkludert" til verdi-fokus i stedet for feature-lister. AI-Revisjon: rettet "2 uker" → "4 uker".

2. **Foreslått neste steg (IKKE GJORT, brukeren stoppet før jeg startet):** legge til et konkret ROI-eksempel-blokk på `/ai-partner` med matten "6 timer/uke × 800 kr × 52 = 249 600 kr i årlig verdipotensial" — for å gjøre 2x-garantien håndgripelig. Plassering: mellom "Det dere får hver måned" og "Garantien"-seksjonen.

---

## Hva som er bygget i denne sesjonen

### Ny landing page-arkitektur
- `src/components/PricingSection.jsx` — pricing-seksjon mountet i NySide.jsx mellom Proof og Workshops
- `src/components/ScrollToTop.jsx` — fikser route-navigasjon (var bug: ny side åpnet seg ikke på toppen)
- `src/pages/AiPartner.jsx` — ny route `/ai-partner` med dramatisk hero, 4 fase-kort, 6 inkludert-kort med verdi-vinkling, **90-dagers verdigaranti** med svart hero-blokk + animert "2x"-tall, Vilkår, dramatisk pris-display (8xl 39 000), 4 rolle-kort, "Når det ikke passer", FAQ-accordion, CTA
- `src/pages/AiRevisjon.jsx` — ny route `/ai-revisjon` med hero (4 uker), 4 step-kort, verdi-fokuserte deliverables, 4 rolle-kort, hvorfor-inkludert-blokk, CTA

### Hjemmeside-cleanup
- Outcomes: copy refreshed til "Etter 90 dager har dere AI i drift"
- Workshops: funnel redirected fra audit til AI-Partner via `#tilbud`
- Process: nye steg "Kartlegg → Bygg → Forbedre"
- RiskReversal: erstattet audit-credit med 90-dagers verdigaranti-teaser
- Navbar: la til "Tilbud"-link
- Helmet meta: oppdatert til AI-Partner-narrativ

### Legal docs
- `Vilkar.jsx`: full omskriving av tjenestebeskrivelse + garanti
- `Personvern.jsx`: N8N-migrering + AI-Partner-narrativ

### SEO
- `index.html`: meta description + og-tags
- `public/sitemap.xml`: la til `/ai-partner` og `/ai-revisjon`
- Schema.org `Service` markup på begge nye sider

### Interne docs (på linje)
- `CLAUDE.md` — ny pristabel
- `docs/agentik/PARTNERAVTALE.md` — full omskriving (single-tier i stedet for 3-tier)
- `docs/agentik/HVA-ER-AGENTIK.md` — repositionert
- `docs/agentik/TJENESTER.md` — full omskriving
- `docs/agentik/MALGRUPPE.md`, `INNHOLDSSTRATEGI.md`, `docs/MERKEVARE-OG-DESIGN.md` — copy-fikser

### Polish
- `tailwind.config.js`: definerte `font-agentik` (var udefinert, falt stille tilbake til default)
- `.gitignore`: la til `.superpowers/`

---

## Nøkkel-design-valg som ligger fast

1. **90-dagers verdigaranti** med 2x investering som "betaler seg selv"-anker. Punchline: "Garantien er gulvet. Business caset er målet."
2. **Founding-pris 39 000 kr/mnd** for første 3 partnere, deretter 49 000 kr/mnd. Låst for alltid for Founding-kunder.
3. **Ingen binding etter 90 dager** — månedlig oppsigelse. AI-Revisjon (4 uker) inkludert som fase 1.
4. **Workshop er sidetilbud**, ikke hovedprodukt. Pris: fra 25 000 kr.
5. **Discovery Sprint som standalone-produkt er fjernet** — alt er innfaset i AI-Partner.
6. **Eget ROI-dashbord** som differensiator (auto-bygges ved onboarding).
7. **For-hvem er nå roller** (Daglig leder/COO/CFO/Avdelingsleder), ikke selskapstyper eller use-cases.

---

## Forslag til neste steg når du starter ny sesjon

**Kortere polish (anbefalt først):**
1. **ROI-eksempel-blokk** på `/ai-partner` (det jeg var i ferd med). Plasseres mellom "Det dere får hver måned" (linje ~340 i AiPartner.jsx) og "Garantien"-seksjonen. Innhold: visualiser 6h × 800kr × 52 = 249 600 kr som en regne-blokk, så leseren ser konkret hva 2x verdi betyr. Bruk samme card-pattern som Garantien-blokken (radial gradient, big numbers).
2. **Mobile-test** av begge nye sider — hero har 7xl/8xl tall som kan overflowe på små skjermer.
3. **Hero-CTA på homepage** kunne fått en sekundær "Se AI-Partner →"-link ved siden av primær CTA, slik at lead lett finner pricing uten å scrolle gjennom hele siden.

**Mer omfattende:**
4. **Add testimonial-blokk** på `/ai-partner` (placeholder mens du venter på første kunde-quote).
5. **Konkret eksempel-seksjon** på `/ai-partner`: "Slik kan AI-Partner se ut for en regnskapsbedrift" — typisk månedlig leveranseplan.
6. **`/ai-workshop`-side** (utsatt fra opprinnelig plan).
7. **Konvertere Process-seksjonen til klikkbar** — hver av de tre stegene kunne ekspandere med detaljer.

**Drift / merge:**
8. Push branch til remote: `git push -u origin feat/ai-partner-pivot`
9. Eller merge direkte til main: `git checkout main && git merge feat/ai-partner-pivot && git push`

---

## Branch-state ved pause

```
24 commits ahead of main, 0 behind
21 files endret, ~1600 insertions / ~470 deletions
Lint: PASS
Build: PASS
Dev server: drept
Working tree: clean
```

---

## Relevante filer

- **Spec:** `docs/superpowers/specs/2026-04-26-pricing-section-design.md`
- **Plan:** `docs/superpowers/plans/2026-04-26-pricing-section.md`
- **Brainstorm-mockups:** `.superpowers/brainstorm/95757-1777192309/content/offer-v7.html` (siste låste design)
- **Hovedkode:**
  - `src/components/PricingSection.jsx` — homepage pricing
  - `src/pages/AiPartner.jsx` — full landing
  - `src/pages/AiRevisjon.jsx` — AI-Revisjon detail
  - `src/main.jsx` — routes
  - `src/pages/NySide.jsx` — homepage med oppdaterte seksjoner

---

## Quick start for ny sesjon

```bash
# Se status
cd /Users/ivarknutsen/speedmonstr
git log --oneline feat/ai-partner-pivot --not main | head -10

# Start dev
npm run dev
# Åpne http://localhost:5173/ai-partner og /ai-revisjon

# Pick up where we left off:
# Implement ROI-example block in src/pages/AiPartner.jsx
# (mellom "Det dere får hver måned" og "Garantien"-seksjonen)
```
