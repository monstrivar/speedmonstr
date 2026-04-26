# Pricing-seksjon + AI-Partner-pivot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add new AI-Partner pricing section to homepage, create two SEO-optimized landing pages (`/ai-partner` and `/ai-revisjon`), and update existing audit-focused copy across 4 homepage sections to align with the AI-Partner narrative.

**Architecture:** New `PricingSection` React component mounted in `NySide.jsx` between Proof and Process sections. Two new page components added as React Router routes. In-place copy updates to 4 existing sections in `NySide.jsx`. No new dependencies — all uses existing `react-helmet-async`, `lucide-react`, Tailwind CSS, and `react-router-dom` already in the project.

**Tech Stack:** React 19 (function components, hooks), Vite 8, Tailwind CSS v3, react-router-dom v7, react-helmet-async, lucide-react. No test framework — verification via `npm run lint` + `npm run build` + manual browser check.

**Source spec:** [`docs/superpowers/specs/2026-04-26-pricing-section-design.md`](../specs/2026-04-26-pricing-section-design.md)

**Reference design:** Visual brainstorm v7 (preserved at `.superpowers/brainstorm/95757-1777192309/content/offer-v7.html`)

---

## File Structure

**Files to create:**
- `src/components/PricingSection.jsx` — Pricing section with AI-Partner hero card + Workshop secondary card. ~250 lines.
- `src/pages/AiPartner.jsx` — `/ai-partner` landing page. Full pakke beskrivelse + garanti + FAQ. ~400 lines.
- `src/pages/AiRevisjon.jsx` — `/ai-revisjon` landing page. SEO-optimalisert AI-revisjon-forklaring. ~350 lines.

**Files to modify:**
- `src/main.jsx` — add 2 new `<Route>`s
- `src/pages/NySide.jsx` — import + mount `<PricingSection />`, update copy in 4 sections (Outcomes, Workshops, Process, RiskReversal)

**No new dependencies.**

**Verification approach (no Jest/Vitest available):**
- Each task ends with `npm run lint` + `npm run build` passing
- After each task, optional `npm run dev` for visual check on `localhost:5173`
- Final task includes manual browser verification of all routes

---

## Task 1: Create PricingSection component

**Files:**
- Create: `src/components/PricingSection.jsx`
- Modify: `src/pages/NySide.jsx` (add import + mount)

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p src/components
```

- [ ] **Step 2: Write `src/components/PricingSection.jsx`**

```jsx
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const PricingSection = () => {
  return (
    <section id="tilbud" className="reveal-section bg-[#F5F2EC] py-24 md:py-32 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-14">
          <div className="reveal inline-block w-12 h-0.5 bg-[#1A6B6D] mb-5" />
          <h2 className="reveal font-agentik text-[clamp(1.8rem,4vw,3rem)] text-[#1A1F25] tracking-tight leading-[1.1] mb-3">
            Slik jobber vi sammen
          </h2>
          <p className="reveal font-sans text-[#1A1F25]/55 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Vi tar inn 3 partnere de neste 60 dagene. Etter det går prisen opp.
          </p>
        </div>

        {/* HERO CARD — AI-Partner */}
        <div className="reveal relative bg-white border border-[#1A1F25]/8 rounded-2xl p-8 md:p-10 mb-5 shadow-[0_4px_24px_rgba(26,31,37,0.04)]">

          {/* Spots badge */}
          <div className="absolute top-5 right-5 bg-[#C4854C] text-white font-data text-[10px] font-semibold px-3 py-1.5 rounded-full uppercase tracking-[0.1em]">
            2 av 3 spots
          </div>

          <div className="font-data text-[10px] text-[#1A6B6D] uppercase tracking-[0.18em] mb-3">
            Hovedtilbud
          </div>

          <h3 className="font-agentik font-bold text-[clamp(2rem,4vw,2.5rem)] text-[#1A1F25] tracking-tight leading-[1.05] mb-2">
            AI-Partner
          </h3>

          <p className="font-sans text-[15px] text-[#1A1F25]/60 leading-relaxed mb-5 max-w-[520px]">
            Fast AI-rådgiver og dev-team for bedrifter som vil få AI fra idé til drift — uten å ansette internt.
          </p>

          <div className="flex items-center gap-3 font-data text-[13px] text-[#1A1F25] mb-6 pb-6 border-b border-[#1A1F25]/8">
            <span>39 000 kr/mnd</span>
            <span className="text-[#1A1F25]/30">·</span>
            <span className="text-[#1A1F25]/55">ingen binding etter 90 dager</span>
          </div>

          {/* AI-Revisjon callout — links to /ai-revisjon */}
          <Link
            to="/ai-revisjon"
            className="flex items-center justify-between gap-4 no-underline bg-gradient-to-br from-[#1A6B6D]/8 to-[#4FC3B0]/5 border border-[#1A6B6D]/18 rounded-xl px-4 py-4 mb-5 hover:from-[#1A6B6D]/12 hover:to-[#4FC3B0]/8 transition-colors"
          >
            <div className="flex-1">
              <div className="font-data text-[9px] text-[#1A6B6D] uppercase tracking-[0.18em] font-semibold mb-1">
                ★ Inkludert
              </div>
              <div className="font-heading font-bold text-[17px] text-[#1A1F25] tracking-tight">
                Komplett AI-Revisjon
              </div>
            </div>
            <div className="font-heading text-[13px] text-[#1A6B6D] font-semibold whitespace-nowrap flex items-center gap-1">
              Les hva det er <ArrowRight size={14} />
            </div>
          </Link>

          {/* Inclusion list */}
          <ul className="list-none p-0 m-0 mb-7 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-x-7">

            {/* ROI dashbord — featured, full width */}
            <li className="md:col-span-2 flex gap-3 text-[13px] text-[#1A1F25] leading-snug bg-[#C4854C]/6 border border-[#C4854C]/15 rounded-lg px-4 py-3">
              <span className="text-[#C4854C] font-bold flex-shrink-0 text-base">📊</span>
              <span>
                <strong className="text-[#1A1F25]">Eget ROI-dashbord</strong> — live oversikt over hva vi har bygget og målbar effekt i sanntid. Settes opp automatisk ved oppstart.
              </span>
            </li>

            <li className="flex gap-3 text-[13px] text-[#1A1F25] leading-snug">
              <span className="text-[#1A6B6D] font-bold flex-shrink-0">→</span>
              <span>Månedlig strategimøte og prioritering</span>
            </li>
            <li className="flex gap-3 text-[13px] text-[#1A1F25] leading-snug">
              <span className="text-[#1A6B6D] font-bold flex-shrink-0">→</span>
              <span>Bygging, vedlikehold og videreutvikling av AI-løsninger</span>
            </li>
            <li className="flex gap-3 text-[13px] text-[#1A1F25] leading-snug">
              <span className="text-[#1A6B6D] font-bold flex-shrink-0">→</span>
              <span>Direkte Slack-tilgang for løpende rådgivning</span>
            </li>
            <li className="flex gap-3 text-[13px] text-[#1A1F25] leading-snug">
              <span className="text-[#1A6B6D] font-bold flex-shrink-0">→</span>
              <span>Opplæring av teamet i de nye løsningene</span>
            </li>

          </ul>

          <Link
            to="/ai-partner"
            className="btn-magnetic inline-flex rounded-full px-6 py-3 text-[13px] bg-[#C4854C] text-white font-heading font-semibold tracking-tight no-underline"
          >
            <span className="btn-layer bg-[#1A1F25]"></span>
            <span className="btn-text flex items-center gap-2">
              Les mer om AI-Partner <ArrowRight size={14} />
            </span>
          </Link>

        </div>

        {/* SECONDARY — Workshop */}
        <div className="reveal bg-white border border-[#1A1F25]/8 rounded-2xl p-6 md:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div className="flex-1">
            <div className="font-data text-[10px] text-[#1A6B6D] uppercase tracking-[0.18em] mb-2">
              Sidetilbud
            </div>
            <h3 className="font-heading font-bold text-[22px] text-[#1A1F25] tracking-tight leading-tight mb-1.5">
              AI Workshop
            </h3>
            <p className="font-sans text-[13px] text-[#1A1F25]/60 leading-relaxed mb-2 max-w-md">
              Praktisk opplæring i AI for ledere eller team. Halvdag eller heldag, hos dere eller hos oss.
            </p>
            <div className="font-data text-[12px] text-[#1A1F25]/70">
              Fra 25 000 kr
            </div>
          </div>

          <a
            href="#contact"
            className="btn-magnetic inline-flex rounded-full px-5 py-2.5 text-[12px] bg-transparent text-[#1A1F25] border border-[#1A1F25]/20 font-heading font-semibold tracking-tight no-underline self-start md:self-center whitespace-nowrap"
          >
            <span className="btn-text flex items-center gap-2">
              Snakk med oss <ArrowRight size={13} />
            </span>
          </a>

        </div>

        {/* Founding anchor */}
        <p className="reveal text-center mt-6 text-[11px] text-[#1A1F25]/40 italic font-heading">
          Når Founding er fylt: AI-Partner blir 49 000 kr/mnd
        </p>

      </div>
    </section>
  );
};
```

- [ ] **Step 3: Add import to `src/pages/NySide.jsx`**

Find the existing imports near top of `src/pages/NySide.jsx` (around line 1–20). Add this line after the other imports (after `import { ArrowRight, ... } from 'lucide-react';` or similar):

```jsx
import { PricingSection } from '../components/PricingSection.jsx';
```

- [ ] **Step 4: Mount `<PricingSection />` in NySide between `<Proof />` and `<Workshops />`**

Find the JSX where the page sections are rendered (search for `<Proof />`). It looks like:

```jsx
<Proof />
<Workshops />
```

Change to:

```jsx
<Proof />
<PricingSection />
<Workshops />
```

- [ ] **Step 5: Run lint**

```bash
npm run lint
```

Expected: PASS, no errors. If errors: fix per ESLint output and re-run.

- [ ] **Step 6: Run build**

```bash
npm run build
```

Expected: PASS, "built in Xms". If errors: fix and re-run.

- [ ] **Step 7: (Optional but recommended) Visual check**

```bash
npm run dev
```

Open http://localhost:5173. Scroll past Proof — should see new "Slik jobber vi sammen" section with AI-Partner hero + Workshop card. Stop dev server with Ctrl+C.

- [ ] **Step 8: Commit**

```bash
git add src/components/PricingSection.jsx src/pages/NySide.jsx
git commit -m "feat: add AI-Partner pricing section to homepage"
```

---

## Task 2: Update Outcomes section — remove audit reference

**Files:**
- Modify: `src/pages/NySide.jsx` (around lines 763–766)

**Why:** The Outcomes section currently says "Vi kaller det en AI Opportunity Audit. Du kaller det klarhet." This conflicts with the new AI-Partner narrative.

- [ ] **Step 1: Locate the text in `src/pages/NySide.jsx`**

Search for: `Vi kaller det en`

You'll find this block:

```jsx
<h2 className="reveal font-agentik font-bold text-[clamp(1.8rem,4vw,3rem)] text-[#E8E4DC] tracking-tight leading-[1.1] mb-4">
  Etter 30 dager sitter du igjen med dette
</h2>
<p className="reveal text-[#E8E4DC]/45 text-base md:text-lg max-w-2xl mb-16 leading-relaxed">
  Vi kaller det en{' '}
  <span className="text-[#1A6B6D] font-medium">AI Opportunity Audit</span>.
  {' '}Du kaller det klarhet.
</p>
```

- [ ] **Step 2: Replace with new copy aligned to AI-Partner**

Change the heading and paragraph to:

```jsx
<h2 className="reveal font-agentik font-bold text-[clamp(1.8rem,4vw,3rem)] text-[#E8E4DC] tracking-tight leading-[1.1] mb-4">
  Etter 90 dager har dere AI i drift
</h2>
<p className="reveal text-[#E8E4DC]/45 text-base md:text-lg max-w-2xl mb-16 leading-relaxed">
  Som <span className="text-[#1A6B6D] font-medium">AI-Partner</span> kartlegger vi, prioriterer og bygger sammen — slik at AI faktisk havner i daglig drift, ikke bare i strategi-dokumenter.
</p>
```

- [ ] **Step 3: Lint + build**

```bash
npm run lint && npm run build
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/pages/NySide.jsx
git commit -m "copy: update Outcomes section for AI-Partner narrative"
```

---

## Task 3: Update Workshops section — change funnel from audit to AI-Partner

**Files:**
- Modify: `src/pages/NySide.jsx` (around lines 902–916)

**Why:** Workshops section ends with bridge text "starter de fleste med en AI Audit" + a "Book en gratis samtale" button. Both should funnel to AI-Partner instead.

- [ ] **Step 1: Locate the bridge text and button**

Search for: `starter de fleste`

You'll find this block:

```jsx
{/* Bridge line → funnels to audit */}
<div className="reveal border-t border-[#1A1F25]/8 pt-10">
  <p className="font-agentik italic text-lg md:text-xl text-[#1A1F25]/75 tracking-tight mb-8 max-w-lg">
    For selskaper som ønsker mer enn bare opplæring, starter de fleste
    med en AI Audit.
  </p>
  <button
    onClick={() => scrollTo('contact')}
    className="btn-magnetic rounded-full px-7 py-3.5 text-sm bg-[#C4854C] text-[#F5F2EC] font-heading font-medium tracking-tight"
  >
    <span className="btn-layer bg-[#1A1F25]"></span>
    <span className="btn-text flex items-center gap-2">
      Book en gratis samtale <ArrowRight size={16} />
    </span>
  </button>
</div>
```

- [ ] **Step 2: Replace with AI-Partner funnel**

Change the bridge to:

```jsx
{/* Bridge line → funnels to AI-Partner */}
<div className="reveal border-t border-[#1A1F25]/8 pt-10">
  <p className="font-agentik italic text-lg md:text-xl text-[#1A1F25]/75 tracking-tight mb-8 max-w-lg">
    For selskaper som vil gå fra opplæring til faktisk drift, starter de fleste
    som AI-Partner.
  </p>
  <button
    onClick={() => scrollTo('tilbud')}
    className="btn-magnetic rounded-full px-7 py-3.5 text-sm bg-[#C4854C] text-[#F5F2EC] font-heading font-medium tracking-tight"
  >
    <span className="btn-layer bg-[#1A1F25]"></span>
    <span className="btn-text flex items-center gap-2">
      Se AI-Partner <ArrowRight size={16} />
    </span>
  </button>
</div>
```

- [ ] **Step 3: Update the comment above the section header**

Search for: `// WORKSHOPS (trust-builder → funnels back to audit)`

Change to:

```jsx
// WORKSHOPS (trust-builder → funnels to AI-Partner pricing section)
```

- [ ] **Step 4: Lint + build**

```bash
npm run lint && npm run build
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/NySide.jsx
git commit -m "copy: redirect Workshops funnel from audit to AI-Partner"
```

---

## Task 4: Update Process section — replace 3-step audit flow with AI-Partner method

**Files:**
- Modify: `src/pages/NySide.jsx` (around lines 926–946)

**Why:** Current Process is "01 Introduksjonssamtale → 02 AI Audit → 03 Implementering". New narrative: "01 Kartlegg → 02 Bygg → 03 Forbedre".

- [ ] **Step 1: Locate the steps array**

Search for: `Introduksjonssamtale`

You'll find:

```jsx
const Process = () => {
  const steps = [
    {
      num: '01',
      title: 'Introduksjonssamtale',
      tag: 'Gratis',
      desc: 'Vi forstår deres behov og avklarer om dette er riktig for dere.',
    },
    {
      num: '02',
      title: 'AI Audit',
      tag: null,
      desc: 'Vi analyserer prosesser og finner de største mulighetene for AI.',
    },
    {
      num: '03',
      title: 'Implementering',
      tag: 'Valgfritt',
      desc: 'Vi hjelper dere å faktisk gjennomføre løsningene — fra pilot til produksjon.',
    },
  ];
```

- [ ] **Step 2: Replace with new AI-Partner method**

Change the array to:

```jsx
const Process = () => {
  const steps = [
    {
      num: '01',
      title: 'Kartlegg',
      tag: 'Uke 1–2',
      desc: 'AI-Revisjon: vi finner hvor AI gir høyest ROI hos dere — prosesser, systemer, prioriteringer.',
    },
    {
      num: '02',
      title: 'Bygg',
      tag: 'Uke 3–12',
      desc: 'Vi setter første AI-løsning i drift og bygger en konkret 90-dagers roadmap sammen.',
    },
    {
      num: '03',
      title: 'Forbedre',
      tag: 'Måned 4+',
      desc: 'Løpende drift, optimalisering og nye løsninger — måned for måned, uten lang binding.',
    },
  ];
```

- [ ] **Step 3: Lint + build**

```bash
npm run lint && npm run build
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/pages/NySide.jsx
git commit -m "copy: update Process steps to AI-Partner method (Kartlegg/Bygg/Forbedre)"
```

---

## Task 5: Update RiskReversal section — replace audit-credit with garanti

**Files:**
- Modify: `src/pages/NySide.jsx` (around lines 1035–1048)

**Why:** Current section says "Investeringen i en AI Audit trekkes fra implementering". With AI-Partner, audit is included; the new risk-reversal is the "Betaler seg selv"-garantien.

- [ ] **Step 1: Locate the section**

Search for: `Investeringen i en AI Audit`

You'll find:

```jsx
const RiskReversal = () => (
  <section className="reveal-section py-20 md:py-24 px-6 border-t border-[#1A1F25]/8" style={{ background: '#F5F2EC' }}>
    <div className="max-w-3xl mx-auto text-center">
      <div className="reveal w-12 h-0.5 bg-[#1A6B6D] mx-auto mb-8" />
      <h2 className="reveal font-agentik text-[clamp(1.6rem,3.5vw,2.5rem)] text-[#1A1F25] tracking-tight leading-[1.1] mb-6">
        Lav risiko — høy oppside
      </h2>
      <p className="reveal font-sans text-[#1A1F25]/55 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
        Investeringen i en AI Audit trekkes fra dersom dere velger å gå videre
        med implementering sammen med oss.
      </p>
    </div>
  </section>
);
```

- [ ] **Step 2: Replace with 90-dagers verdigaranti teaser**

Change the section to:

```jsx
const RiskReversal = () => (
  <section className="reveal-section py-20 md:py-24 px-6 border-t border-[#1A1F25]/8" style={{ background: '#F5F2EC' }}>
    <div className="max-w-3xl mx-auto text-center">
      <div className="reveal w-12 h-0.5 bg-[#1A6B6D] mx-auto mb-8" />
      <h2 className="reveal font-agentik text-[clamp(1.6rem,3.5vw,2.5rem)] text-[#1A1F25] tracking-tight leading-[1.1] mb-6">
        90-dagers verdigaranti
      </h2>
      <p className="reveal font-sans text-[#1A1F25]/65 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-5">
        Vi dokumenterer og implementerer AI-tiltak med <strong className="text-[#1A1F25]">minst 2x investeringen i årlig verdipotensial</strong> — eller jobber videre uten månedlig honorar til vi gjør det.
      </p>
      <p className="reveal font-agentik italic text-[#1A6B6D] text-sm md:text-base mb-8">
        Garantien er gulvet. Business caset er målet.
      </p>
      <Link
        to="/ai-partner"
        className="reveal inline-flex items-center gap-2 font-heading font-semibold text-[14px] text-[#1A6B6D] hover:text-[#1A1F25] transition-colors"
      >
        Les hele garantien <ArrowRight size={14} />
      </Link>
    </div>
  </section>
);
```

- [ ] **Step 3: Add `Link` import if not already imported**

Check the top of `src/pages/NySide.jsx` for `import { Link } from 'react-router-dom';`. If missing, add it. If present, no change.

- [ ] **Step 4: Lint + build**

```bash
npm run lint && npm run build
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/NySide.jsx
git commit -m "copy: replace audit-credit with Betaler seg selv-garantien in RiskReversal"
```

---

## Task 6: Create AiRevisjon page (`/ai-revisjon` route)

**Files:**
- Create: `src/pages/AiRevisjon.jsx`
- Modify: `src/main.jsx`

- [ ] **Step 1: Create `src/pages/AiRevisjon.jsx`**

```jsx
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowRight, Search, Target, FileText, Map, CheckCircle } from 'lucide-react';

const AiRevisjon = () => {
  return (
    <div className="min-h-screen bg-[#F5F2EC]">
      <Helmet>
        <title>AI-Revisjon — kartlegging av hvor AI gir høyest ROI | Agentik</title>
        <meta name="description" content="AI-Revisjon: strukturert kartlegging av hvor AI og automasjon gir høyest verdi i bedriften deres. Inkludert i AI-Partner-avtalen." />
        <meta property="og:title" content="AI-Revisjon | Agentik" />
        <meta property="og:description" content="Strukturert kartlegging av hvor AI gir høyest ROI. Inkludert i AI-Partner-avtalen." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://agentik.no/ai-revisjon" />
        <link rel="canonical" href="https://agentik.no/ai-revisjon" />
      </Helmet>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F5F2EC]/80 backdrop-blur-md border-b border-[#1A1F25]/10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-heading font-bold text-xl text-[#1A1F25]">Agentik</Link>
          <Link to="/" className="font-sans text-sm text-[#1A1F25]/60 hover:text-[#1A1F25] transition-colors flex items-center gap-2">
            <ArrowLeft size={16} /> Tilbake til forsiden
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 pt-28 pb-24">

        {/* Hero */}
        <div className="mb-16">
          <div className="font-data text-[10px] text-[#1A6B6D] uppercase tracking-[0.2em] mb-4">
            Inkludert i AI-Partner
          </div>
          <h1 className="font-agentik font-bold text-4xl md:text-6xl text-[#1A1F25] tracking-tight leading-[1.05] mb-6">
            AI-Revisjon
          </h1>
          <p className="font-sans text-[#1A1F25]/70 text-lg md:text-xl leading-relaxed max-w-2xl">
            Vi finner hvor AI og automasjon gir høyest ROI hos dere — før vi bygger noe. Strukturert, datadrevet og med konkrete neste-steg-anbefalinger.
          </p>
        </div>

        {/* Hva er det */}
        <section className="mb-16">
          <h2 className="font-agentik font-bold text-2xl md:text-3xl text-[#1A1F25] tracking-tight mb-5">
            Hva er en AI-Revisjon?
          </h2>
          <div className="space-y-4 text-[#1A1F25]/75 text-base md:text-lg leading-relaxed">
            <p>
              De fleste bedrifter starter med å bygge AI-løsninger uten å vite hvor verdien faktisk ligger. Resultatet er ofte en teknologi som imponerer i demoer, men ikke endrer hverdagen.
            </p>
            <p>
              En AI-Revisjon snur dette: vi bruker 2 uker på å kartlegge driften deres, intervjuer nøkkelpersoner, og identifiserer hvor AI gir mest verdi i forhold til innsats. Resultatet er en prioritert liste over hva som faktisk er verdt å bygge — og en 90-dagers roadmap.
            </p>
            <p>
              Vi bygger ikke noe før vi vet hva som er verdt å bygge.
            </p>
          </div>
        </section>

        {/* Slik gjør vi det */}
        <section className="mb-16">
          <h2 className="font-agentik font-bold text-2xl md:text-3xl text-[#1A1F25] tracking-tight mb-8">
            Slik gjør vi det
          </h2>
          <div className="space-y-6">
            {[
              {
                icon: Search,
                step: '01',
                title: 'Kickoff og intervjuer',
                desc: 'Vi møter ledelsen og 4–6 nøkkelpersoner for å forstå hvor tiden går, hvor frustrasjonen sitter, og hvor potensialet er størst.',
              },
              {
                icon: Map,
                step: '02',
                title: 'Prosess- og systemkartlegging',
                desc: 'Vi tegner opp manuelle flyter, dataflyt mellom systemer, og identifiserer hvor menneskelig arbeid kan automatiseres eller forsterkes med AI.',
              },
              {
                icon: Target,
                step: '03',
                title: 'ROI-prioritering',
                desc: 'Hvilke tiltak gir mest verdi? Hvilke er enklest å bygge? Vi rangerer på verdi, gjennomførbarhet og risiko — og lander på 3–5 konkrete tiltak å starte med.',
              },
              {
                icon: FileText,
                step: '04',
                title: '90-dagers roadmap',
                desc: 'En konkret leveranseplan: hvilke løsninger bygges først, hvordan måles effekten, og hva er neste steg etter 90 dager.',
              },
            ].map((s) => (
              <div key={s.step} className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#1A6B6D]/10 flex items-center justify-center mt-1">
                  <s.icon size={20} className="text-[#1A6B6D]" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-data text-[10px] text-[#1A6B6D] uppercase tracking-[0.18em] font-semibold">{s.step}</span>
                    <h3 className="font-heading font-bold text-lg md:text-xl text-[#1A1F25] tracking-tight">{s.title}</h3>
                  </div>
                  <p className="font-sans text-[#1A1F25]/65 text-base leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Hva dere får */}
        <section className="mb-16">
          <h2 className="font-agentik font-bold text-2xl md:text-3xl text-[#1A1F25] tracking-tight mb-6">
            Hva dere får
          </h2>
          <ul className="space-y-3">
            {[
              'Skriftlig revisjonsrapport med funn, anbefalinger og prioriteringer',
              'Prosesskart over de viktigste arbeidsflytene deres',
              '90-dagers roadmap med konkrete tiltak og forventet effekt',
              'ROI-estimater per tiltak (verdipotensial og innsats)',
              'Anbefalt rekkefølge basert på verdi og gjennomførbarhet',
            ].map((item, i) => (
              <li key={i} className="flex gap-3 items-start">
                <CheckCircle size={20} className="text-[#1A6B6D] flex-shrink-0 mt-0.5" />
                <span className="font-sans text-[#1A1F25]/75 text-base md:text-lg leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* For hvem */}
        <section className="mb-16">
          <h2 className="font-agentik font-bold text-2xl md:text-3xl text-[#1A1F25] tracking-tight mb-6">
            For hvem passer dette?
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Kundeservice og support', desc: 'Mange repetitive henvendelser som kan auto-besvares eller rutes smartere.' },
              { title: 'Salg og lead-håndtering', desc: 'Inbound leads som ikke følges opp raskt nok, kvalifisering som kan automatiseres.' },
              { title: 'Intern admin og rapportering', desc: 'Manuell datasammenstilling, rapporter som tar timer per uke.' },
              { title: 'Fakturering og bestillingsflyt', desc: 'Manuell håndtering av fakturaer, ordrebekreftelser eller avvik.' },
            ].map((c, i) => (
              <div key={i} className="bg-white border border-[#1A1F25]/8 rounded-xl p-5">
                <h3 className="font-heading font-bold text-base text-[#1A1F25] mb-2">{c.title}</h3>
                <p className="font-sans text-[#1A1F25]/60 text-sm leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Hvorfor inkludert */}
        <section className="mb-16 bg-[#1A6B6D]/5 border border-[#1A6B6D]/15 rounded-2xl p-6 md:p-8">
          <h2 className="font-agentik font-bold text-xl md:text-2xl text-[#1A1F25] tracking-tight mb-3">
            Hvorfor er AI-Revisjon inkludert i AI-Partner?
          </h2>
          <p className="font-sans text-[#1A1F25]/70 text-base leading-relaxed">
            Vi selger ikke AI-Revisjon som standalone-produkt. Grunnen er enkel: en revisjon uten implementering blir et dyrt strategi-dokument. Når dere blir AI-Partner, får dere revisjonen som første fase — og vi bygger videre fra rapporten umiddelbart etter.
          </p>
        </section>

        {/* CTA */}
        <section className="text-center pt-8 border-t border-[#1A1F25]/10">
          <p className="font-sans text-[#1A1F25]/60 text-base mb-6">
            Klar for å starte?
          </p>
          <Link
            to="/ai-partner"
            className="btn-magnetic inline-flex rounded-full px-7 py-3.5 text-sm bg-[#C4854C] text-white font-heading font-semibold tracking-tight no-underline"
          >
            <span className="btn-layer bg-[#1A1F25]"></span>
            <span className="btn-text flex items-center gap-2">
              Bli AI-Partner <ArrowRight size={16} />
            </span>
          </Link>
        </section>

      </article>
    </div>
  );
};

export default AiRevisjon;
```

- [ ] **Step 2: Add route to `src/main.jsx`**

Find the imports at top of `src/main.jsx`. Add after the other page imports:

```jsx
import AiRevisjon from './pages/AiRevisjon.jsx';
```

Find the `<Routes>` block and add the new route before the closing `</Routes>`:

```jsx
<Route path="/ai-revisjon" element={<AiRevisjon />} />
```

The full Routes block should now look like:

```jsx
<Routes>
  <Route path="/" element={<NySide />} />
  <Route path="/personvern" element={<Personvern />} />
  <Route path="/vilkar" element={<Vilkar />} />
  <Route path="/ai-revisjon" element={<AiRevisjon />} />
</Routes>
```

- [ ] **Step 3: Lint + build**

```bash
npm run lint && npm run build
```

Expected: PASS.

- [ ] **Step 4: Visual check (recommended)**

```bash
npm run dev
```

Open http://localhost:5173/ai-revisjon. Should render the new page. Stop with Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add src/pages/AiRevisjon.jsx src/main.jsx
git commit -m "feat: add /ai-revisjon landing page"
```

---

## Task 7: Create AiPartner page (`/ai-partner` route)

**Files:**
- Create: `src/pages/AiPartner.jsx`
- Modify: `src/main.jsx`

- [ ] **Step 1: Create `src/pages/AiPartner.jsx`**

```jsx
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowRight, ShieldCheck, Calendar, Wrench, MessageCircle, GraduationCap, BarChart3, CheckCircle } from 'lucide-react';

const AiPartner = () => {
  return (
    <div className="min-h-screen bg-[#F5F2EC]">
      <Helmet>
        <title>AI-Partner — fast AI-rådgiver for norske bedrifter | Agentik</title>
        <meta name="description" content="AI-Partner: fast månedlig avtale med AI-rådgiver og dev-team. 39 000 kr/mnd, ingen binding etter 90 dager. 90-dagers verdigaranti — minst 2x investeringen i årlig verdipotensial." />
        <meta property="og:title" content="AI-Partner | Agentik" />
        <meta property="og:description" content="Fra AI-nysgjerrighet til AI i drift. 90-dagers verdigaranti — minst 2x investeringen i årlig verdipotensial." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://agentik.no/ai-partner" />
        <link rel="canonical" href="https://agentik.no/ai-partner" />
      </Helmet>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F5F2EC]/80 backdrop-blur-md border-b border-[#1A1F25]/10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-heading font-bold text-xl text-[#1A1F25]">Agentik</Link>
          <Link to="/" className="font-sans text-sm text-[#1A1F25]/60 hover:text-[#1A1F25] transition-colors flex items-center gap-2">
            <ArrowLeft size={16} /> Tilbake til forsiden
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 pt-28 pb-24">

        {/* Hero */}
        <div className="mb-16">
          <div className="font-data text-[10px] text-[#1A6B6D] uppercase tracking-[0.2em] mb-4">
            Hovedtilbud — 2 av 3 spots igjen
          </div>
          <h1 className="font-agentik font-bold text-4xl md:text-6xl text-[#1A1F25] tracking-tight leading-[1.05] mb-6">
            AI-Partner
          </h1>
          <p className="font-sans text-[#1A1F25]/70 text-lg md:text-xl leading-relaxed max-w-2xl mb-6">
            Fra AI-nysgjerrighet til AI i drift, uten å ansette internt. Vi blir deres faste AI-rådgiver og dev-team — kartlegger, bygger og forbedrer måned for måned.
          </p>
          <div className="flex items-center gap-3 font-data text-sm text-[#1A1F25]">
            <span className="font-semibold">39 000 kr/mnd</span>
            <span className="text-[#1A1F25]/30">·</span>
            <span className="text-[#1A1F25]/55">ingen binding etter 90 dager</span>
          </div>
        </div>

        {/* Hva er det */}
        <section className="mb-16">
          <h2 className="font-agentik font-bold text-2xl md:text-3xl text-[#1A1F25] tracking-tight mb-5">
            Hva er en AI-Partner?
          </h2>
          <div className="space-y-4 text-[#1A1F25]/75 text-base md:text-lg leading-relaxed">
            <p>
              En AI-Partner er motsatt av en konsulent som leverer rapport og forsvinner. Vi blir en del av teamet deres på månedlig basis — kartlegger hvor AI gir verdi, bygger løsningene, og forbedrer dem kontinuerlig.
            </p>
            <p>
              Etter 90 dager fortsetter vi måned-til-måned, kun hvis dere ser verdi. Ingen lang binding, ingen lock-in. Det er den letteste måten å få AI i drift uten å ansette internt.
            </p>
          </div>
        </section>

        {/* Slik fungerer det — 4 faser */}
        <section className="mb-16">
          <h2 className="font-agentik font-bold text-2xl md:text-3xl text-[#1A1F25] tracking-tight mb-8">
            Slik fungerer det
          </h2>
          <div className="space-y-8">
            {[
              {
                step: '01',
                phase: 'Uke 1–2',
                title: 'AI-Revisjon',
                desc: 'Vi kartlegger hvor AI gir høyest ROI hos dere. Intervjuer ledelse og nøkkelpersoner, prosesskartlegging, ROI-prioritering.',
                cta: { text: 'Les mer om AI-Revisjon', to: '/ai-revisjon' },
              },
              {
                step: '02',
                phase: 'Uke 3–6',
                title: 'Bygging av første AI-løsning',
                desc: 'Den høyest prioriterte løsningen settes i drift. Vi bygger, tester, og lærer opp teamet i bruk.',
              },
              {
                step: '03',
                phase: 'Uke 7–12',
                title: 'Optimalisering + roadmap låst',
                desc: 'Første løsning forbedres basert på faktisk bruk. 90-dagers roadmap lås, og dere bestemmer om vi fortsetter.',
              },
              {
                step: '04',
                phase: 'Måned 4+',
                title: 'Løpende partnerskap',
                desc: 'Måned-til-måned. Vi prioriterer, bygger og forbedrer kontinuerlig — uten lang binding.',
              },
            ].map((p) => (
              <div key={p.step} className="border-l-2 border-[#1A6B6D]/30 pl-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-data text-[10px] text-[#1A6B6D] uppercase tracking-[0.18em] font-semibold">{p.step} · {p.phase}</span>
                </div>
                <h3 className="font-heading font-bold text-xl md:text-2xl text-[#1A1F25] tracking-tight mb-2">{p.title}</h3>
                <p className="font-sans text-[#1A1F25]/65 text-base leading-relaxed">{p.desc}</p>
                {p.cta && (
                  <Link to={p.cta.to} className="inline-flex items-center gap-1.5 mt-3 text-sm text-[#1A6B6D] hover:text-[#1A1F25] font-heading font-semibold transition-colors">
                    {p.cta.text} <ArrowRight size={13} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Hva som er inkludert */}
        <section className="mb-16">
          <h2 className="font-agentik font-bold text-2xl md:text-3xl text-[#1A1F25] tracking-tight mb-8">
            Hva som er inkludert
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { icon: BarChart3, title: 'Eget ROI-dashbord', desc: 'Live oversikt over leveranser, status og målbar effekt. Settes opp automatisk ved oppstart.' },
              { icon: Calendar, title: 'Månedlig strategimøte', desc: 'Vi går gjennom hva som har blitt levert, hva som virker, og hva som prioriteres neste måned.' },
              { icon: Wrench, title: 'Bygging og vedlikehold', desc: 'Vi bygger nye AI-løsninger og holder eksisterende i drift. Inkludert i månedsprisen.' },
              { icon: MessageCircle, title: 'Direkte Slack-tilgang', desc: 'Spørsmål, idéer, problemer — svar samme virkedag fra rådgiveren.' },
              { icon: GraduationCap, title: 'Opplæring av teamet', desc: 'Når vi bygger en ny løsning, sørger vi for at teamet vet hvordan å bruke den.' },
              { icon: ShieldCheck, title: 'Komplett AI-Revisjon', desc: 'Inkludert som første fase. Strukturert kartlegging av hvor AI gir mest verdi.' },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-[#1A1F25]/8 rounded-xl p-5">
                <item.icon size={22} className="text-[#1A6B6D] mb-3" />
                <h3 className="font-heading font-bold text-base text-[#1A1F25] tracking-tight mb-2">{item.title}</h3>
                <p className="font-sans text-[#1A1F25]/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Garantien — 90-dagers verdigaranti */}
        <section className="mb-16 bg-gradient-to-br from-[#1A6B6D]/8 to-[#4FC3B0]/5 border border-[#1A6B6D]/20 rounded-2xl p-6 md:p-10">
          <div className="font-data text-[10px] text-[#1A6B6D] uppercase tracking-[0.2em] font-semibold mb-3">
            ★ Inkludert i alle partneravtaler
          </div>
          <h2 className="font-agentik font-bold text-2xl md:text-3xl text-[#1A1F25] tracking-tight mb-5">
            90-dagers verdigaranti
          </h2>
          <p className="font-sans text-[#1A1F25] text-lg md:text-xl leading-relaxed mb-4">
            Innen 90 dager skal vi ha kartlagt, prioritert og implementert AI- og automasjonstiltak med dokumentert årlig verdipotensial tilsvarende <strong>minst 2x investeringen deres i perioden</strong>.
          </p>
          <p className="font-sans text-[#1A1F25] text-base md:text-lg leading-relaxed mb-5">
            Hvis vi ikke klarer det, jobber vi videre uten månedlig honorar til verdien er dokumentert.
          </p>
          <p className="font-sans italic text-[#1A1F25]/65 text-sm md:text-base leading-relaxed mb-6">
            Verdien kan komme fra spart tid, frigjort kapasitet, raskere oppfølging, færre manuelle steg, færre feil eller bedre utnyttelse av eksisterende ressurser.
          </p>
          <div className="border-t border-[#1A6B6D]/20 pt-5">
            <p className="font-agentik italic text-lg md:text-xl text-[#1A1F25] text-center">
              Garantien er gulvet. Business caset er målet.
            </p>
          </div>
        </section>

        {/* Vilkår for garantien */}
        <section className="mb-16">
          <h2 className="font-agentik font-bold text-2xl md:text-3xl text-[#1A1F25] tracking-tight mb-5">
            Vilkår for at garantien gjelder
          </h2>
          <p className="font-sans text-[#1A1F25]/70 text-base leading-relaxed mb-5">
            Verdiarbeidet krever at dere er aktive partnere. Garantien gjelder når dere:
          </p>
          <ul className="space-y-3 text-[#1A1F25]/75 text-base leading-relaxed">
            {[
              'Gir nødvendige systemtilganger innen avtalt tid',
              'Stiller med én intern kontaktperson som eier samarbeidet',
              'Deltar på avtalte møter og workshops',
              'Gir tilbakemelding innen avtalt frist',
              'Tar i bruk løsningene som er avtalt',
              'Har nok volum eller repetitive prosesser til at verdipotensialet er realistisk',
            ].map((item, i) => (
              <li key={i} className="flex gap-3 items-start">
                <CheckCircle size={20} className="text-[#1A6B6D] flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Pris */}
        <section className="mb-16">
          <h2 className="font-agentik font-bold text-2xl md:text-3xl text-[#1A1F25] tracking-tight mb-6">
            Pris
          </h2>
          <div className="bg-white border border-[#1A1F25]/8 rounded-2xl p-6 md:p-8">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-data text-3xl md:text-4xl font-semibold text-[#1A1F25]">39 000 kr</span>
              <span className="font-sans text-[#1A1F25]/55 text-lg">/mnd</span>
            </div>
            <p className="font-sans text-[#1A1F25]/65 text-base leading-relaxed mb-4">
              Founding-pris for de første 3 partnerne. Låst for alltid — ingen automatiske prisøkninger.
            </p>
            <p className="font-sans text-[#1A1F25]/50 text-sm italic">
              Når Founding er fylt: AI-Partner blir 49 000 kr/mnd for nye kunder.
            </p>
          </div>
        </section>

        {/* Ikke inkludert */}
        <section className="mb-16">
          <h2 className="font-agentik font-bold text-2xl md:text-3xl text-[#1A1F25] tracking-tight mb-6">
            Hva som ikke er inkludert
          </h2>
          <p className="font-sans text-[#1A1F25]/70 text-base leading-relaxed mb-4">
            Vi tror på ærlighet om hva som er utenfor scope:
          </p>
          <ul className="space-y-2 text-[#1A1F25]/70 text-base leading-relaxed">
            <li>• Software- og API-kostnader (OpenAI, Slack, etc.) — betales direkte av dere</li>
            <li>• Eksterne integrasjoner som krever betalt utvikling fra tredjeparter</li>
            <li>• Store enkeltprosjekter utover månedlig kapasitet (prises separat)</li>
            <li>• Hardware, lisenser eller infrastruktur</li>
          </ul>
        </section>

        {/* For hvem passer dette */}
        <section className="mb-16">
          <h2 className="font-agentik font-bold text-2xl md:text-3xl text-[#1A1F25] tracking-tight mb-5">
            For hvem passer AI-Partner?
          </h2>
          <p className="font-sans text-[#1A1F25]/70 text-base md:text-lg leading-relaxed mb-5">
            AI-Partner passer for bedrifter som allerede har manuelle prosesser, repeterende oppgaver og nok volum til at små forbedringer kan gi stor årlig verdi.
          </p>
          <p className="font-sans text-[#1A1F25]/70 text-base md:text-lg leading-relaxed mb-5">
            Konkret betyr det dere som:
          </p>
          <ul className="space-y-3 text-[#1A1F25]/75 text-base md:text-lg leading-relaxed">
            {[
              'Bruker mye tid på manuelle steg som kan systematiseres',
              'Får inn nok henvendelser, leads eller bestillinger til at automasjon flytter nålen',
              'Vil bruke AI strategisk, men ikke vil ansette en intern AI-spesialist',
              'Har en ledelse som kan ta beslutninger og prioritere internt',
            ].map((item, i) => (
              <li key={i} className="flex gap-3 items-start">
                <CheckCircle size={20} className="text-[#1A6B6D] flex-shrink-0 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Når passer det ikke */}
        <section className="mb-16 bg-[#1A1F25]/4 border-l-3 border-[#1A6B6D] rounded-r-xl p-6 md:p-7">
          <h2 className="font-agentik font-bold text-xl md:text-2xl text-[#1A1F25] tracking-tight mb-4">
            Når passer det ikke?
          </h2>
          <p className="font-sans text-[#1A1F25]/75 text-base leading-relaxed mb-4">
            Hvis vi etter en samtale ikke ser realistisk potensial for minst 2x årlig verdi, anbefaler vi heller:
          </p>
          <ul className="space-y-2 text-[#1A1F25]/75 text-base leading-relaxed mb-4">
            <li>• En <strong>AI Workshop</strong> (fra 25 000 kr) for å bygge intern kompetanse</li>
            <li>• Et <strong>mindre forprosjekt</strong> for å teste én konkret løsning før dere binder dere</li>
          </ul>
          <p className="font-sans italic text-[#1A1F25]/65 text-sm md:text-base leading-relaxed">
            Bedre å være ærlig før enn etter.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="font-agentik font-bold text-2xl md:text-3xl text-[#1A1F25] tracking-tight mb-6">
            Vanlige spørsmål
          </h2>
          <div className="space-y-5">
            {[
              {
                q: 'Skal dere spare oss 240 000 kr på 90 dager?',
                a: 'Ikke nødvendigvis realisert cash på 90 dager. Det vi garanterer er at vi innen 90 dager skal ha implementert tiltak med dokumentert årlig verdipotensial tilsvarende minst 2x investeringen. Det kan være spart tid, frigjort kapasitet, raskere oppfølging, færre manuelle steg eller færre feil. Målet er at AI-arbeidet skal gi økonomisk mening — ikke bare bli en kul demo.',
              },
              {
                q: 'Hvordan beregner dere verdien?',
                a: 'Vi lager en value baseline i starten. Da ser vi på hvor mye tid som brukes på konkrete prosesser i dag, hvem som gjør jobben, hvor ofte det skjer, intern timekost og hva som kan forbedres. Eksempel: Hvis vi frigjør 6 timer i uka hos ansatte med intern kost på 800 kr/time, er det 6 × 800 × 52 = 249 600 kr i årlig verdipotensial.',
              },
              {
                q: 'Hva skjer hvis dere ikke klarer garantien?',
                a: 'Da stopper vi faktureringen av månedlig honorar og jobber videre uten ekstra månedlig kostnad til vi har dokumentert verdien. Det er ikke en pengene-tilbake-garanti, men en leveranse- og verdigaranti. Internt har vi en cap på 90 ekstra dager fritt arbeid før vi refunderer siste faktura — dette skrives inn i kontrakten på Dag 1.',
              },
              {
                q: 'Hva om vi ikke får tatt løsningene i bruk internt?',
                a: 'Da må vi være ærlige: verdien kommer først når løsningene tas i bruk. Derfor krever sprinten at dere har én intern kontaktperson, gir oss nødvendige tilganger og deltar i korte avklaringer underveis. Hvis dere ikke ønsker å endre arbeidsflyter, bør dere ikke kjøpe en AI-Partner.',
              },
              {
                q: 'Hvorfor ikke bare gjøre dette selv?',
                a: 'Det kan dere absolutt gjøre hvis dere har intern kapasitet, teknisk kompetanse og noen som eier implementeringen. Utfordringen vi ofte ser er at AI blir liggende som enkeltstående tester og ikke kommer inn i arbeidsflytene. Vår jobb er å prioritere riktig, bygge det som gir mest verdi først, og sørge for at det faktisk kommer i drift.',
              },
              {
                q: 'Hva hvis vi vil avslutte etter 90 dager?',
                a: 'Da gjør dere det. Etter 90-dagers Sprint er det månedlig oppsigelse — ingen lang binding, ingen lock-in.',
              },
              {
                q: 'Hvor mange timer dekker 39 000 kr/mnd?',
                a: 'Vi jobber etter prioriteringsmodell, ikke timepris. Hver måned bygger og forbedrer vi det som gir mest verdi innenfor avtalt kapasitet (~20 timer/mnd). Større prosjekter prises separat.',
              },
              {
                q: 'Kan vi få AI-Revisjonen alene, uten partneravtale?',
                a: 'Nei. Vi har sluttet å selge revisjon som standalone fordi det skaper "rapport som havner i skuffen"-problemet. Revisjonen er inkludert i AI-Partner.',
              },
              {
                q: 'Eier vi løsningene dere bygger?',
                a: 'Ja. Alle løsninger som bygges spesifikt for dere er deres eiendom, inkludert kode og data. Vi beholder egne metoder og rammeverk.',
              },
              {
                q: 'Hva om vi vil oppskalere?',
                a: 'Da snakker vi om en større pakke (f.eks. flere parallelle prosjekter, dedikerte ressurser). Founding-prisen kan økes med agreement, eller dere går over til en bedriftspakke.',
              },
            ].map((item, i) => (
              <div key={i} className="border-b border-[#1A1F25]/10 pb-5">
                <h3 className="font-heading font-bold text-base md:text-lg text-[#1A1F25] mb-2">{item.q}</h3>
                <p className="font-sans text-[#1A1F25]/65 text-sm md:text-base leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA — uforpliktende samtale */}
        <section className="text-center pt-8 border-t border-[#1A1F25]/10">
          <p className="font-agentik italic text-lg md:text-xl text-[#1A1F25]/75 mb-3">
            Ta en uforpliktende samtale med oss
          </p>
          <p className="font-sans text-[#1A1F25]/60 text-base mb-8 max-w-lg mx-auto leading-relaxed">
            Vi bruker første samtale på å se om det finnes 2x verdipotensial hos dere. Hvis ikke, sier vi det rett ut og foreslår et bedre alternativ — Workshop eller et mindre forprosjekt.
          </p>
          <Link
            to="/#contact"
            className="btn-magnetic inline-flex rounded-full px-7 py-3.5 text-sm bg-[#C4854C] text-white font-heading font-semibold tracking-tight no-underline"
          >
            <span className="btn-layer bg-[#1A1F25]"></span>
            <span className="btn-text flex items-center gap-2">
              Book en samtale <ArrowRight size={16} />
            </span>
          </Link>
          <p className="font-data text-[10px] text-[#1A1F25]/40 uppercase tracking-[0.15em] mt-6">
            2 av 3 Founding-spots igjen
          </p>
        </section>

      </article>
    </div>
  );
};

export default AiPartner;
```

- [ ] **Step 2: Add route to `src/main.jsx`**

Add the import after the AiRevisjon import:

```jsx
import AiPartner from './pages/AiPartner.jsx';
```

Add the route:

```jsx
<Route path="/ai-partner" element={<AiPartner />} />
```

- [ ] **Step 3: Lint + build**

```bash
npm run lint && npm run build
```

Expected: PASS.

- [ ] **Step 4: Visual check**

```bash
npm run dev
```

Open http://localhost:5173/ai-partner. Should render the new page. Verify links work:
- "Tilbake til forsiden" → /
- "Les mer om AI-Revisjon" (in fase 01) → /ai-revisjon
- "Snakk med oss" CTA → /#contact (anchor)

Stop with Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add src/pages/AiPartner.jsx src/main.jsx
git commit -m "feat: add /ai-partner landing page with full deliverables and garanti"
```

---

## Task 8: Add Schema.org Service markup to both landing pages

**Files:**
- Modify: `src/pages/AiRevisjon.jsx`
- Modify: `src/pages/AiPartner.jsx`

**Why:** Schema.org `Service` markup helps Google show rich snippets in search results, improving CTR for "AI revisjon", "AI partner Norge" queries.

- [ ] **Step 1: Add Service schema to AiRevisjon.jsx**

In `src/pages/AiRevisjon.jsx`, find the `<Helmet>` block. Add a `<script type="application/ld+json">` element inside `<Helmet>`:

```jsx
<Helmet>
  <title>AI-Revisjon — kartlegging av hvor AI gir høyest ROI | Agentik</title>
  <meta name="description" content="AI-Revisjon: strukturert kartlegging av hvor AI og automasjon gir høyest verdi i bedriften deres. Inkludert i AI-Partner-avtalen." />
  <meta property="og:title" content="AI-Revisjon | Agentik" />
  <meta property="og:description" content="Strukturert kartlegging av hvor AI gir høyest ROI. Inkludert i AI-Partner-avtalen." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://agentik.no/ai-revisjon" />
  <link rel="canonical" href="https://agentik.no/ai-revisjon" />
  <script type="application/ld+json">{JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'AI-Revisjon',
    provider: {
      '@type': 'Organization',
      name: 'Agentik',
      url: 'https://agentik.no',
    },
    serviceType: 'AI Consulting',
    description: 'Strukturert kartlegging av hvor AI og automasjon gir høyest ROI i bedriften. Inkludert i AI-Partner-avtalen.',
    areaServed: { '@type': 'Country', name: 'Norway' },
  })}</script>
</Helmet>
```

- [ ] **Step 2: Add Service schema to AiPartner.jsx**

In `src/pages/AiPartner.jsx`, find the `<Helmet>` block. Add the schema:

```jsx
<Helmet>
  <title>AI-Partner — fast AI-rådgiver for norske bedrifter | Agentik</title>
  <meta name="description" content="AI-Partner: fast månedlig avtale med AI-rådgiver og dev-team. 39 000 kr/mnd, ingen binding etter 90 dager. Betaler seg selv-garanti inkludert." />
  <meta property="og:title" content="AI-Partner | Agentik" />
  <meta property="og:description" content="Fra AI-nysgjerrighet til AI i drift. Fast månedlig avtale, ingen lang binding, garanti inkludert." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://agentik.no/ai-partner" />
  <link rel="canonical" href="https://agentik.no/ai-partner" />
  <script type="application/ld+json">{JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'AI-Partner',
    provider: {
      '@type': 'Organization',
      name: 'Agentik',
      url: 'https://agentik.no',
    },
    serviceType: 'AI Consulting Retainer',
    description: 'Fast månedlig avtale med AI-rådgiver og dev-team. Kartlegging, bygging og forbedring av AI-løsninger. 90-dagers verdigaranti — minst 2x investeringen i årlig verdipotensial.',
    areaServed: { '@type': 'Country', name: 'Norway' },
    offers: {
      '@type': 'Offer',
      price: '39000',
      priceCurrency: 'NOK',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '39000',
        priceCurrency: 'NOK',
        unitText: 'MONTH',
      },
    },
  })}</script>
</Helmet>
```

- [ ] **Step 3: Lint + build**

```bash
npm run lint && npm run build
```

Expected: PASS.

- [ ] **Step 4: Verify schema in browser**

```bash
npm run dev
```

Open http://localhost:5173/ai-partner. Right-click → "View page source". Search for `application/ld+json`. Should see the JSON-LD block. Repeat for /ai-revisjon. Stop with Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add src/pages/AiRevisjon.jsx src/pages/AiPartner.jsx
git commit -m "feat: add Schema.org Service markup to AI-Partner and AI-Revisjon pages"
```

---

## Task 9: Final visual verification + smoke test

**Files:** None modified — verification only.

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Manual verification checklist**

Open browser to http://localhost:5173 and verify each:

- [ ] Homepage hero loads correctly (no regressions)
- [ ] Scroll to "Etter 90 dager har dere AI i drift" — Outcomes section reads correctly
- [ ] Scroll to "Slik jobber vi sammen" — PricingSection renders with AI-Partner card + Workshop card
- [ ] AI-Revisjon callout in pricing card has hover state
- [ ] Click "Les hva det er →" in AI-Revisjon callout → navigates to /ai-revisjon
- [ ] /ai-revisjon page renders with all sections (Hero, Hva er det, Slik gjør vi det, Hva dere får, For hvem, Hvorfor inkludert, CTA)
- [ ] /ai-revisjon CTA "Bli AI-Partner" → navigates to /ai-partner
- [ ] /ai-partner page renders with all sections (Hero, Hva er det, 4 faser, Inkludert, Garantien, Pris, Ikke inkludert, For hvem, FAQ, CTA)
- [ ] /ai-partner garanti-seksjon viser "Betaler seg selv-garantien" tekst korrekt
- [ ] /ai-partner CTA "Snakk med oss" → går til /#contact
- [ ] Klikk "Tilbake til forsiden" på begge nye sider → går til /
- [ ] Klikk "Les mer om AI-Partner →" CTA i homepage pricing card → går til /ai-partner
- [ ] Process-seksjon på forsiden viser "Kartlegg / Bygg / Forbedre" (ikke "AI Audit")
- [ ] RiskReversal-seksjon viser "Betaler seg selv-garantien" + lenke til /ai-partner
- [ ] Workshops-seksjon CTA viser "Se AI-Partner" og scroller til #tilbud-seksjonen
- [ ] Mobile view (responsive) — test minst pricing card og /ai-partner i mobil-bredde (Chrome DevTools device emulation)

- [ ] **Step 3: Stop dev server**

Ctrl+C in terminal.

- [ ] **Step 4: Final lint + build verification**

```bash
npm run lint && npm run build
```

Expected: Both PASS with no errors.

- [ ] **Step 5: No commit needed (verification only)**

If any of the manual checks fail, return to the relevant Task and fix. Otherwise, the implementation is complete.

---

## Self-Review Checklist (engineer should run after completion)

- [ ] All 9 tasks committed individually with descriptive messages
- [ ] No `console.log` debug statements left in code
- [ ] No commented-out code
- [ ] All routes accessible (homepage, /personvern, /vilkar, /ai-partner, /ai-revisjon)
- [ ] Build size hasn't grown unexpectedly (compare `dist/` size before vs. after — should be ~10–20% larger due to two new pages)
- [ ] All internal Links use `react-router-dom` `Link` (not `<a href>`) for SPA navigation
- [ ] All external/anchor refs (`#contact`, `mailto:`) use plain `<a>`
- [ ] Lighthouse SEO score on /ai-partner ≥ 90 (open Chrome DevTools → Lighthouse → run on the URL)

---

## What is NOT in this plan (deferred)

- `/ai-workshop` dedicated landing page (Workshop card links to `#contact` for now)
- Actual ROI dashboard product (mentioned in copy, but the dashbord itself is a separate product to build)
- Booking engine (CTA points to existing `#contact` form which uses N8N flow)
- Customer testimonials per package (Proof section remains offer-agnostic and unchanged)
- Hero CTA copy refresh (deferred to scope C if needed)

---

## Plan complete

Saved to `docs/superpowers/plans/2026-04-26-pricing-section.md`.

Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
