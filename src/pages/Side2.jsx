import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight, Check, X, ChevronDown,
  Headphones, TrendingUp, UserPlus, BookOpen,
  BarChart3, Calendar, FileCheck, FileSearch,
} from 'lucide-react';
import { PricingSection } from '../components/PricingSection.jsx';

gsap.registerPlugin(ScrollTrigger);

// ─── Agentik palette ─────────────────────────────────────────
// Dark:   #1A1F25  (deep slate)
// Black:  #0E1114  (near-black for max contrast moments)
// Cream:  #F5F2EC  (warm off-white — backgrounds)
// Paper:  #E8E4DC  (warm cream — text on dark, surfaces)
// Petrol: #1A6B6D  (deep teal — brand accent on LIGHT)
// Signal: #4FC3B0  (bright teal — brand accent on DARK)
// Copper: #C4854C  (warm amber — CTAs only)
// ─────────────────────────────────────────────────────────────

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

// ─────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    let last = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const next = window.scrollY > 60;
        if (next !== last) {
          last = next;
          setScrolled(next);
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      style={{ willChange: 'transform', transform: 'translate3d(-50%, 0, 0)' }}
      className={`fixed top-4 left-1/2 z-50 w-[92%] max-w-5xl rounded-full transition-all duration-500 flex items-center justify-between px-6 py-3 ${
        scrolled
          ? 'bg-[#F5F2EC]/90 backdrop-blur-md border border-[#1A1F25]/10 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <a
        href="/side2"
        className={`font-agentik font-semibold text-xl tracking-tight transition-colors duration-500 ${
          scrolled ? 'text-[#1A1F25]' : 'text-[#E8E4DC]'
        }`}
      >
        Agentik
      </a>

      <div
        className={`hidden md:flex items-center gap-8 text-sm font-medium tracking-tight ${
          scrolled ? 'text-[#1A1F25]' : 'text-[#E8E4DC]/70'
        }`}
      >
        <button onClick={() => scrollTo('problem')} className="link-hover cursor-pointer bg-transparent border-none">
          Problemet
        </button>
        <button onClick={() => scrollTo('sprint')} className="link-hover cursor-pointer bg-transparent border-none">
          Sprint
        </button>
        <button onClick={() => scrollTo('moduler')} className="link-hover cursor-pointer bg-transparent border-none">
          Moduler
        </button>
        <button onClick={() => scrollTo('garanti')} className="link-hover cursor-pointer bg-transparent border-none">
          Garanti
        </button>
        <button onClick={() => scrollTo('tilbud')} className="link-hover cursor-pointer bg-transparent border-none">
          Tilbud
        </button>
      </div>

      <button
        onClick={() => scrollTo('contact')}
        className={`btn-magnetic rounded-full px-5 py-2.5 text-sm tracking-tight font-heading font-medium transition-all duration-300 ${
          scrolled
            ? 'bg-[#C4854C] text-[#F5F2EC]'
            : 'bg-[#E8E4DC]/10 text-[#E8E4DC] border border-[#E8E4DC]/20 backdrop-blur-sm'
        }`}
      >
        <span className="btn-layer bg-[#1A1F25]"></span>
        <span className="btn-text">Book samtale</span>
      </button>
    </nav>
  );
};

// ─────────────────────────────────────────────────────────────
// HERO — "Din eksterne AI-avdeling."
// ─────────────────────────────────────────────────────────────
const Hero = () => {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.s2-hero-el', {
        y: 50,
        opacity: 0,
        stagger: 0.12,
        duration: 1.3,
        ease: 'power3.out',
        delay: 0.25,
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-[100dvh] w-full overflow-hidden flex items-center justify-center px-6 py-32"
      style={{ background: '#1A1F25', contain: 'paint' }}
    >
      {/* Background video — heavy blur */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none scale-110"
        style={{ filter: 'blur(28px) saturate(1.15)' }}
        autoPlay muted loop playsInline preload="auto"
        poster="/hero-bg.jpg"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(26,31,37,0.40) 0%, rgba(26,31,37,0.78) 65%, #1A1F25 100%)',
        }}
      />

      {/* Petrol glow */}
      <div
        className="absolute w-[900px] h-[900px] top-1/2 left-1/4 rounded-full opacity-30 blur-[140px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(26,107,109,0.45) 0%, transparent 70%)',
          transform: 'translate3d(-50%, -50%, 0)',
        }}
      />
      {/* Copper glow */}
      <div
        className="absolute w-[700px] h-[700px] top-1/3 right-0 rounded-full opacity-20 blur-[120px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(196,133,76,0.4) 0%, transparent 70%)',
          transform: 'translate3d(25%, -25%, 0)',
        }}
      />

      {/* Faint grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(232,228,220,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,228,220,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 text-center max-w-5xl mx-auto pt-12">
        {/* Eyebrow chip */}
        <div className="s2-hero-el inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#4FC3B0]/8 border border-[#4FC3B0]/25 backdrop-blur-sm mb-12">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4FC3B0] shadow-[0_0_10px_#4FC3B0]" />
          <span className="font-data text-[10px] uppercase tracking-[0.28em] text-[#4FC3B0]">
            AI-Partner for ambisiøse bedrifter
          </span>
        </div>

        {/* Headline */}
        <h1 className="s2-hero-el font-agentik font-bold tracking-[-0.025em] leading-[0.98] mb-8">
          <span
            className="block text-[#E8E4DC]"
            style={{ fontSize: 'clamp(2.6rem, 7.5vw, 6.4rem)' }}
          >
            Din eksterne
          </span>
          <span
            className="block text-[#C4854C]"
            style={{ fontSize: 'clamp(2.6rem, 7.5vw, 6.4rem)' }}
          >
            AI-avdeling.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="s2-hero-el font-agentik text-[#E8E4DC]/70 text-xl md:text-2xl lg:text-3xl max-w-3xl mx-auto leading-[1.35] mb-12 tracking-tight">
          Vi finner, bygger og drifter AI som skaper målbar verdi — ikke nye demoer.
        </p>

        {/* CTAs */}
        <div className="s2-hero-el flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button
            onClick={() => scrollTo('contact')}
            className="btn-magnetic rounded-full px-8 py-4 text-base bg-[#C4854C] text-[#F5F2EC] font-heading font-medium tracking-tight"
          >
            <span className="btn-layer bg-[#1A1F25]"></span>
            <span className="btn-text flex items-center gap-3">
              Book en AI-mulighetssamtale <ArrowRight size={18} />
            </span>
          </button>
          <button
            onClick={() => scrollTo('sprint')}
            className="group inline-flex items-center gap-2 px-6 py-4 text-sm text-[#E8E4DC]/75 hover:text-[#E8E4DC] font-heading font-medium tracking-tight transition-colors"
          >
            Slik jobber vi
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Trust line */}
        <p className="s2-hero-el text-[#E8E4DC]/30 text-xs tracking-[0.1em]">
          Brukt av Droptech, Brainwaves, SalesUp og flere
        </p>
      </div>

      {/* Scroll prompt */}
      <button
        onClick={() => scrollTo('problem')}
        aria-label="Bla ned"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-[#E8E4DC]/40 hover:text-[#E8E4DC]/80 transition-colors duration-300"
      >
        <span className="font-data text-[10px] uppercase tracking-[0.3em]">Bla ned</span>
        <ChevronDown size={18} className="animate-bounce" />
      </button>

      {/* Bottom transition fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F5F2EC] to-transparent pointer-events-none" />
    </section>
  );
};

// ─────────────────────────────────────────────────────────────
// PROBLEM — "De fleste tester AI. Få får det i drift."
// ─────────────────────────────────────────────────────────────
const Problem = () => {
  const fails = [
    'starter med verktøy i stedet for forretningsproblemer',
    'vet ikke hvilke arbeidsflyter som skal prioriteres',
    'mangler internt eierskap og teknisk kapasitet',
    'løsninger blir aldri vedlikeholdt eller forbedret',
    'AI blir aldri en del av daglig drift',
  ];

  return (
    <section
      id="problem"
      className="reveal-section relative py-28 md:py-40 px-6 overflow-hidden"
      style={{ background: '#F5F2EC' }}
    >
      {/* Decorative accent */}
      <div
        className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[100px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #C4854C 0%, transparent 70%)' }}
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="reveal flex items-center gap-3 mb-8">
          <span className="font-data text-[10px] uppercase tracking-[0.25em] text-[#1A6B6D]">01 — Problemet</span>
          <span className="block flex-1 h-px bg-[#1A1F25]/10" />
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left — headline */}
          <div className="lg:col-span-6">
            <h2 className="reveal font-agentik font-bold text-[clamp(2.2rem,5vw,4rem)] text-[#1A1F25] tracking-[-0.025em] leading-[1.02] mb-6">
              De fleste tester AI.<br />
              <span className="text-[#1A6B6D]">Få får det i drift.</span>
            </h2>
            <p className="reveal font-agentik text-[#1A1F25]/60 text-lg md:text-xl leading-relaxed max-w-md">
              Det er ikke teknologien som mangler. Det er eierskapet, prioriteringen og implementeringen som glipper — gang på gang.
            </p>
          </div>

          {/* Right — fail list */}
          <div className="lg:col-span-6">
            <p className="reveal font-data text-[11px] uppercase tracking-[0.22em] text-[#1A1F25]/40 mb-7">
              Slik feiler bedrifter med AI:
            </p>
            <ul className="space-y-4">
              {fails.map((f, i) => (
                <li key={i} className="reveal group flex items-start gap-5 pb-4 border-b border-[#1A1F25]/8 last:border-b-0">
                  <span className="font-data text-[12px] text-[#C4854C] font-semibold mt-1 w-6">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-agentik text-[#1A1F25] text-base md:text-lg tracking-tight leading-snug">
                    {f}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────
// NEW APPROACH — "AI trenger eierskap, implementering og forbedring"
// ─────────────────────────────────────────────────────────────
const NewApproach = () => {
  const pillars = [
    { label: 'Kartlegg', desc: 'Vi forstår prosesser, systemer og bottlenecks før vi rører ett verktøy. Høyest verdi først.' },
    { label: 'Bygg', desc: 'Vi implementerer inn i faktiske arbeidsflyter — ikke som demoer ved siden av.' },
    { label: 'Vedlikehold', desc: 'AI-systemer trenger en eier som passer på dem måned etter måned. Det er oss.' },
    { label: 'Mål', desc: 'Hver leveranse knyttes til timer spart, kapasitet frigjort eller kroner.' },
  ];

  return (
    <section
      className="reveal-section relative py-28 md:py-40 px-6 overflow-hidden"
      style={{ background: '#1A1F25' }}
    >
      {/* Petrol glow */}
      <div
        className="absolute -top-20 right-1/4 w-[600px] h-[600px] rounded-full opacity-25 blur-[140px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #1A6B6D 0%, transparent 70%)' }}
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="reveal flex items-center gap-3 mb-8">
          <span className="font-data text-[10px] uppercase tracking-[0.25em] text-[#4FC3B0]">02 — Vår tilnærming</span>
          <span className="block flex-1 h-px bg-[#E8E4DC]/10" />
        </div>

        <div className="max-w-4xl mb-16">
          <h2 className="reveal font-agentik font-bold text-[clamp(2.2rem,5vw,4rem)] text-[#E8E4DC] tracking-[-0.025em] leading-[1.02] mb-8">
            AI trenger <span className="italic font-medium text-[#4FC3B0]">eierskap,</span> implementering og kontinuerlig forbedring.
          </h2>
          <p className="reveal font-agentik text-[#E8E4DC]/60 text-lg md:text-xl leading-relaxed max-w-3xl">
            Derfor blir vi din eksterne AI-avdeling. Vi tar ansvaret for å finne mulighetene, bygge løsningene, drifte dem og forbedre dem — slik at teamet ditt kan fokusere på det de gjør best.
          </p>
        </div>

        {/* Pillars grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#E8E4DC]/8 border border-[#E8E4DC]/8 rounded-2xl overflow-hidden">
          {pillars.map((p, i) => (
            <div
              key={i}
              className="reveal p-7 md:p-8 bg-[#1A1F25] hover:bg-[#22282F] transition-colors duration-300"
            >
              <div className="flex items-baseline gap-3 mb-3">
                <span className="font-data text-[10px] text-[#4FC3B0]/70">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-agentik font-semibold text-[#E8E4DC] text-lg tracking-tight">
                  {p.label}
                </h3>
              </div>
              <p className="font-agentik text-[#E8E4DC]/50 text-[14px] leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Manifesto line */}
        <p className="reveal mt-16 font-agentik italic text-[#E8E4DC]/75 text-2xl md:text-3xl tracking-tight max-w-3xl leading-[1.3]">
          Ingen AI uten eier. Ingen eier uten ansvar.<br className="hidden md:block" /> <span className="text-[#4FC3B0]">Ingen ansvar uten resultat.</span>
        </p>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────
// SPRINT PHASES — 90-Day AI Partner Sprint
// ─────────────────────────────────────────────────────────────
const SprintPhases = () => {
  const phases = [
    {
      n: '01',
      tag: 'Kartlegg',
      window: 'Uke 1–2',
      headline: 'Vi forstår bedriften før vi bygger.',
      bullets: [
        'Intervjuer med 4–6 nøkkelpersoner',
        'Prosess- og systemkartlegging',
        'Verdi-baseline for sammenlikning',
      ],
    },
    {
      n: '02',
      tag: 'Prioriter',
      window: 'Uke 2–3',
      headline: 'Vi finner hvor AI gir høyest verdi.',
      bullets: [
        'ROI-prioritering av tiltak',
        '90-dagers roadmap låses sammen med dere',
        '3–5 valgte initiativer dokumenteres',
      ],
    },
    {
      n: '03',
      tag: 'Bygg',
      window: 'Uke 3–9',
      headline: 'Vi setter AI i drift, ikke i demo.',
      bullets: [
        'Implementering av prioriterte løsninger',
        'Testing med faktiske ansatte',
        'Opplæring og innfasing',
      ],
    },
    {
      n: '04',
      tag: 'Forbedre',
      window: 'Uke 9–13',
      headline: 'Vi måler, justerer og dokumenterer verdien.',
      bullets: [
        'Optimalisering basert på faktisk bruk',
        'Verdimåling og dokumentasjon',
        'Roadmap for fortsatt arbeid',
      ],
    },
  ];

  return (
    <section
      id="sprint"
      className="reveal-section relative py-28 md:py-40 px-6 overflow-hidden"
      style={{ background: '#F5F2EC' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="reveal flex items-center gap-3 mb-8">
          <span className="font-data text-[10px] uppercase tracking-[0.25em] text-[#1A6B6D]">03 — Hovedtilbudet</span>
          <span className="block flex-1 h-px bg-[#1A1F25]/10" />
        </div>

        <div className="max-w-4xl mb-20">
          <h2 className="reveal font-agentik font-bold text-[clamp(2.2rem,5vw,4rem)] text-[#1A1F25] tracking-[-0.025em] leading-[1.02] mb-6">
            På 90 dager gjør vi AI-muligheter om til <span className="text-[#1A6B6D]">løsninger i drift.</span>
          </h2>
          <p className="reveal font-agentik text-[#1A1F25]/60 text-lg md:text-xl leading-relaxed max-w-2xl">
            Den 90-dagers AI-Partner-sprinten er en praktisk implementeringsperiode. Vi kartlegger, prioriterer, bygger og måler — sammen med dere.
          </p>
        </div>

        {/* Phase timeline */}
        <div className="relative">
          {/* Vertical line for desktop */}
          <div
            className="hidden md:block absolute left-0 top-12 bottom-12 w-px bg-gradient-to-b from-[#1A6B6D]/40 via-[#1A6B6D]/20 to-transparent"
            style={{ left: 'calc(8.33% - 0.5px)' }}
            aria-hidden="true"
          />

          <div className="space-y-10 md:space-y-14">
            {phases.map((p) => (
              <div key={p.n} className="reveal grid md:grid-cols-12 gap-6 md:gap-8 items-start">
                {/* Number node */}
                <div className="md:col-span-1 flex md:justify-start">
                  <div className="relative w-14 h-14 rounded-full bg-[#F5F2EC] border-2 border-[#1A6B6D]/30 flex items-center justify-center">
                    <span className="font-data text-[13px] font-semibold text-[#1A6B6D]">
                      {p.n}
                    </span>
                  </div>
                </div>

                {/* Card */}
                <div className="md:col-span-11 bg-white border border-[#1A1F25]/8 rounded-2xl p-7 md:p-9 shadow-[0_2px_20px_rgba(26,31,37,0.04)]">
                  <div className="flex flex-wrap items-baseline gap-4 mb-4">
                    <h3 className="font-agentik font-bold text-[#1A1F25] text-2xl md:text-3xl tracking-tight">
                      {p.tag}
                    </h3>
                    <span className="font-data text-[10px] uppercase tracking-[0.18em] text-[#1A6B6D] bg-[#1A6B6D]/10 px-2.5 py-1 rounded-full">
                      {p.window}
                    </span>
                  </div>
                  <p className="font-agentik text-[#1A1F25] text-lg md:text-xl tracking-tight leading-snug mb-6 max-w-2xl">
                    {p.headline}
                  </p>
                  <ul className="grid sm:grid-cols-3 gap-x-8 gap-y-2.5">
                    {p.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm text-[#1A1F25]/65 leading-snug">
                        <Check size={14} className="text-[#1A6B6D] flex-shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map → Prioritize → Build → Improve summary */}
        <div className="reveal mt-20 pt-10 border-t border-[#1A1F25]/8 flex flex-wrap items-center justify-center gap-3 md:gap-5 font-agentik text-base md:text-xl tracking-tight">
          <span className="text-[#1A1F25]">Kartlegg</span>
          <ArrowRight size={18} className="text-[#1A6B6D]/60" />
          <span className="text-[#1A1F25]">Prioriter</span>
          <ArrowRight size={18} className="text-[#1A6B6D]/60" />
          <span className="text-[#1A1F25]">Bygg</span>
          <ArrowRight size={18} className="text-[#1A6B6D]/60" />
          <span className="text-[#1A1F25] font-semibold">Forbedre</span>
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────
// USE CASE MODULES — 8 reusable modules
// ─────────────────────────────────────────────────────────────
const UseCaseModules = () => {
  const modules = [
    {
      name: 'Support-assistent',
      desc: 'Klassifiserer henvendelser, foreslår svar, finner dokumentasjon og eskalerer komplekse saker.',
      value: 'Raskere support, mindre press på senior ansatte.',
      Icon: Headphones,
      featured: true,
    },
    {
      name: 'Salgs-assistent',
      desc: 'Forbereder møter, oppsummerer kundehistorikk, oppdaterer CRM, foreslår neste steg og lager tilbudsutkast.',
      value: 'Mer tid på salg, ren CRM-data.',
      Icon: TrendingUp,
      featured: true,
    },
    {
      name: 'Onboarding-automasjon',
      desc: 'Sender onboarding-e-poster, samler info, oppretter prosjekter, minner om manglende data.',
      value: 'Raskere oppstart, færre dropp-ball-øyeblikk.',
      Icon: UserPlus,
    },
    {
      name: 'Intern kunnskapsassistent',
      desc: 'Svarer ansatte basert på dokumentasjon, SOP-er, support-artikler og rutiner.',
      value: 'Færre avbrytelser, mindre avhengighet av seniorer.',
      Icon: BookOpen,
    },
    {
      name: 'Rapport-automasjon',
      desc: 'Genererer ukentlige, månedlige og ledelses-rapporter fra spredte datakilder.',
      value: 'Bedre beslutningsgrunnlag, mindre admin.',
      Icon: BarChart3,
    },
    {
      name: 'Møte-til-CRM',
      desc: 'Gjør møter om til oppsummeringer, action items, oppfølgings-e-poster og CRM-notater automatisk.',
      value: 'Ingen møter glemmes, ingen oppgaver glipper.',
      Icon: Calendar,
    },
    {
      name: 'Tilbuds-assistent',
      desc: 'Lager tilbudsutkast, prosjektbeskrivelser, prising og oppfølgings-e-poster.',
      value: 'Raskere tilbudsproduksjon, høyere kvalitet.',
      Icon: FileCheck,
    },
    {
      name: 'Dokumentbehandling',
      desc: 'Ekstraherer, oppsummerer og ruter info fra PDF-er, kontrakter, søknader og skjema.',
      value: 'Mindre manuelt arbeid, færre feil.',
      Icon: FileSearch,
    },
  ];

  return (
    <section
      id="moduler"
      className="reveal-section relative py-28 md:py-40 px-6 overflow-hidden"
      style={{ background: '#0E1114' }}
    >
      {/* Ambient signal glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] rounded-full opacity-15 blur-[180px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #4FC3B0 0%, transparent 70%)' }}
      />
      {/* Faint grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(232,228,220,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,228,220,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="reveal flex items-center gap-3 mb-8">
          <span className="font-data text-[10px] uppercase tracking-[0.25em] text-[#4FC3B0]">04 — Moduler vi bygger</span>
          <span className="block flex-1 h-px bg-[#E8E4DC]/10" />
        </div>

        <div className="max-w-3xl mb-16">
          <h2 className="reveal font-agentik font-bold text-[clamp(2.2rem,5vw,4rem)] text-[#E8E4DC] tracking-[-0.025em] leading-[1.02] mb-6">
            Områdene hvor AI faktisk skaper verdi.
          </h2>
          <p className="reveal font-agentik text-[#E8E4DC]/60 text-lg md:text-xl leading-relaxed">
            Vi har sett det samme mønsteret igjen og igjen. Dette er arbeidsflytene der vi konsekvent ser raskest implementering, klarest verdi og lavest risiko.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((m, i) => {
            const featured = m.featured;
            return (
              <div
                key={i}
                className={`reveal group relative rounded-2xl p-7 md:p-8 transition-all duration-500 hover:-translate-y-1 ${
                  featured
                    ? 'bg-gradient-to-br from-[#1A6B6D]/15 to-[#4FC3B0]/5 border border-[#4FC3B0]/25 lg:col-span-1'
                    : 'bg-[#161A1F] border border-[#E8E4DC]/8 hover:border-[#4FC3B0]/20'
                }`}
              >
                {featured && (
                  <span className="absolute top-5 right-5 font-data text-[9px] uppercase tracking-[0.2em] text-[#4FC3B0] bg-[#4FC3B0]/10 px-2 py-1 rounded-full">
                    Mest brukt
                  </span>
                )}

                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors duration-500 ${
                    featured
                      ? 'bg-[#4FC3B0]/20 border border-[#4FC3B0]/40'
                      : 'bg-[#4FC3B0]/8 border border-[#4FC3B0]/20 group-hover:bg-[#4FC3B0]/15'
                  }`}
                >
                  <m.Icon size={20} className="text-[#4FC3B0]" />
                </div>

                <h3 className="font-agentik font-bold text-[#E8E4DC] text-lg md:text-xl tracking-tight mb-3">
                  {m.name}
                </h3>
                <p className="font-agentik text-[#E8E4DC]/55 text-sm leading-relaxed mb-5">
                  {m.desc}
                </p>
                <div className="pt-4 border-t border-[#E8E4DC]/8">
                  <p className="font-data text-[10px] uppercase tracking-[0.18em] text-[#C4854C]/80 mb-1.5">
                    Verdi
                  </p>
                  <p className="font-agentik text-[#E8E4DC]/80 text-sm tracking-tight leading-snug">
                    {m.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────
// VALUE GUARANTEE — dramatic black with animated 2x
// ─────────────────────────────────────────────────────────────
const ValueGuarantee = () => {
  const ref = useRef(null);
  const [animatedNum, setAnimatedNum] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 70%',
        once: true,
        onEnter: () => {
          const obj = { v: 0 };
          gsap.to(obj, {
            v: 234000,
            duration: 2.2,
            ease: 'power2.out',
            onUpdate: () => setAnimatedNum(Math.round(obj.v)),
          });
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="garanti"
      ref={ref}
      className="reveal-section relative py-28 md:py-40 px-6 overflow-hidden"
      style={{ background: '#0E1114' }}
    >
      {/* Copper radial */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full opacity-25 blur-[160px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #C4854C 0%, transparent 65%)' }}
      />

      <div className="relative max-w-5xl mx-auto">
        <div className="reveal flex items-center gap-3 mb-8 justify-center">
          <span className="block w-6 h-px bg-[#C4854C]" />
          <span className="font-data text-[10px] uppercase tracking-[0.25em] text-[#C4854C]">
            05 — 90-dagers verdigaranti
          </span>
          <span className="block w-6 h-px bg-[#C4854C]" />
        </div>

        <h2 className="reveal text-center font-agentik font-bold text-[clamp(2.2rem,5.5vw,4.4rem)] text-[#E8E4DC] tracking-[-0.025em] leading-[1.02] mb-6 max-w-4xl mx-auto">
          Bygget rundt målbar verdi,<br />
          <span className="text-[#C4854C] italic font-medium">ikke AI-hype.</span>
        </h2>

        <p className="reveal text-center font-agentik text-[#E8E4DC]/65 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-16">
          Innen 90 dager skal vi ha kartlagt, prioritert og implementert AI-tiltak med dokumentert årlig verdipotensial på minst <strong className="text-[#E8E4DC]">2x investeringen</strong>. Hvis ikke, jobber vi videre uten månedlig honorar til verdien er dokumentert.
        </p>

        {/* The math card */}
        <div className="reveal relative max-w-3xl mx-auto bg-gradient-to-br from-[#1A1F25] to-[#22282F] border border-[#C4854C]/20 rounded-3xl p-8 md:p-12 mb-12 overflow-hidden">
          {/* Decorative inner glow */}
          <div
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-15 blur-[80px] pointer-events-none"
            style={{ background: 'radial-gradient(circle, #C4854C 0%, transparent 70%)' }}
          />

          <div className="relative">
            <p className="font-data text-[10px] uppercase tracking-[0.25em] text-[#C4854C]/80 mb-6 text-center">
              Regnestykket — Founding-pris
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 mb-10">
              {/* Investment */}
              <div className="text-center">
                <p className="font-data text-[10px] uppercase tracking-[0.2em] text-[#E8E4DC]/40 mb-3">
                  Investering (90 dager)
                </p>
                <p className="font-agentik font-bold text-[#E8E4DC] text-3xl md:text-4xl tracking-tight">
                  117 000<span className="text-[#E8E4DC]/40 text-lg ml-1">kr</span>
                </p>
              </div>

              {/* Multiplier */}
              <div className="text-center flex flex-col items-center justify-center">
                <p className="font-data text-[10px] uppercase tracking-[0.2em] text-[#C4854C] mb-3">
                  Garantert minimum
                </p>
                <p className="font-agentik font-bold text-[#C4854C] text-6xl md:text-7xl tracking-[-0.04em] leading-none">
                  2×
                </p>
              </div>

              {/* Documented value */}
              <div className="text-center">
                <p className="font-data text-[10px] uppercase tracking-[0.2em] text-[#4FC3B0] mb-3">
                  Årlig verdipotensial
                </p>
                <p className="font-agentik font-bold text-[#4FC3B0] text-3xl md:text-4xl tracking-tight tabular-nums">
                  {animatedNum.toLocaleString('nb-NO')}
                  <span className="text-[#4FC3B0]/50 text-lg ml-1">kr</span>
                </p>
              </div>
            </div>

            {/* Worked example */}
            <div className="pt-8 border-t border-[#E8E4DC]/8">
              <p className="font-data text-[10px] uppercase tracking-[0.2em] text-[#E8E4DC]/40 mb-3 text-center">
                Eksempel
              </p>
              <p className="text-center font-agentik text-[#E8E4DC]/70 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
                Hvis vi frigjør <span className="text-[#E8E4DC] font-medium">6 timer/uke</span> til en intern kost på <span className="text-[#E8E4DC] font-medium">800 kr/time</span> = <span className="text-[#4FC3B0] font-medium">249 600 kr</span> i årlig verdipotensial.
              </p>
            </div>
          </div>
        </div>

        {/* Punchline */}
        <p className="reveal text-center font-agentik italic text-[#C4854C] text-xl md:text-2xl tracking-tight mb-12">
          Garantien er gulvet. Business caset er målet.
        </p>

        {/* Conditions strip */}
        <div className="reveal grid md:grid-cols-3 gap-px bg-[#E8E4DC]/8 border border-[#E8E4DC]/8 rounded-xl overflow-hidden max-w-4xl mx-auto">
          {[
            { label: 'Ikke kontant-besparelse', desc: 'Verdipotensial — ikke garantert utbetalt cash innen 90 dager.' },
            { label: 'Måles konkret', desc: 'Spart tid, frigjort kapasitet, færre manuelle steg, færre feil.' },
            { label: 'Definert dag 1', desc: 'Dokumentert verdipotensial defineres i oppdragsavtalen ved oppstart.' },
          ].map((c, i) => (
            <div key={i} className="bg-[#0E1114] p-6">
              <p className="font-data text-[10px] uppercase tracking-[0.18em] text-[#4FC3B0] mb-2">
                {c.label}
              </p>
              <p className="font-agentik text-[#E8E4DC]/55 text-sm leading-relaxed">
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────
// WHO IT IS FOR — fit / no-fit contrast
// ─────────────────────────────────────────────────────────────
const WhoItIsFor = () => {
  const fit = [
    'B2B-bedrifter med 20–300 ansatte',
    'support-, salgs- eller driftsteam med volum',
    'manuelle prosesser som kan systematiseres',
    'ledelse som tør å beslutte og prioritere',
    'én intern eier som kan ta tilganger og tilbakemeldinger',
    'nok repetisjon til at små forbedringer flytter mye',
  ];

  const noFit = [
    'små selskap uten reell prosess-volum',
    'bedrifter uten klar operasjonell smerte',
    'selskap som bare er "nysgjerrige på AI"',
    'team som ikke vil endre arbeidsflyt',
    'ingen intern kontaktperson',
    'forventer ubegrenset utvikling for fast pris',
  ];

  return (
    <section
      className="reveal-section relative py-28 md:py-36 px-6 overflow-hidden"
      style={{ background: '#1A1F25' }}
    >
      <div className="relative max-w-6xl mx-auto">
        <div className="reveal flex items-center gap-3 mb-8">
          <span className="font-data text-[10px] uppercase tracking-[0.25em] text-[#4FC3B0]">06 — Hvem det passer for</span>
          <span className="block flex-1 h-px bg-[#E8E4DC]/10" />
        </div>

        <div className="max-w-3xl mb-16">
          <h2 className="reveal font-agentik font-bold text-[clamp(2.2rem,5vw,4rem)] text-[#E8E4DC] tracking-[-0.025em] leading-[1.02] mb-6">
            Vi sier <span className="text-[#4FC3B0]">ja</span> til noen — og <span className="text-[#C4854C]">nei</span> til mange.
          </h2>
          <p className="reveal font-agentik text-[#E8E4DC]/60 text-lg md:text-xl leading-relaxed">
            Hvis vi ikke ser realistisk potensial for minst 2x årlig verdi, anbefaler vi heller en workshop. Det er bedre for dere — og bedre for oss.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Fit column */}
          <div className="reveal bg-gradient-to-br from-[#1A6B6D]/10 to-[#4FC3B0]/5 border border-[#4FC3B0]/20 rounded-2xl p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#4FC3B0]/15 border border-[#4FC3B0]/40 flex items-center justify-center">
                <Check size={18} className="text-[#4FC3B0]" strokeWidth={2.5} />
              </div>
              <h3 className="font-agentik font-bold text-[#E8E4DC] text-xl md:text-2xl tracking-tight">
                Passer for dere som har
              </h3>
            </div>
            <ul className="space-y-3">
              {fit.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="block w-1.5 h-1.5 rounded-full bg-[#4FC3B0] mt-2 flex-shrink-0" />
                  <span className="font-agentik text-[#E8E4DC]/80 text-[15px] leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* No-fit column */}
          <div className="reveal bg-[#161A1F] border border-[#E8E4DC]/10 rounded-2xl p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#C4854C]/15 border border-[#C4854C]/40 flex items-center justify-center">
                <X size={18} className="text-[#C4854C]" strokeWidth={2.5} />
              </div>
              <h3 className="font-agentik font-bold text-[#E8E4DC] text-xl md:text-2xl tracking-tight">
                Ikke et fit hvis
              </h3>
            </div>
            <ul className="space-y-3">
              {noFit.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="block w-1.5 h-1.5 rounded-full bg-[#C4854C]/60 mt-2 flex-shrink-0" />
                  <span className="font-agentik text-[#E8E4DC]/55 text-[15px] leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────
// PROOF
// ─────────────────────────────────────────────────────────────
const CLIENT_LOGOS = [
  { src: '/clients/droptech.png', alt: 'Droptech' },
  { src: '/clients/brainwaves.png', alt: 'Brainwaves' },
  { src: '/clients/salesup.png', alt: 'SalesUp' },
  { src: '/clients/Badogbygg.webp', alt: 'Bad og Bygg' },
  { src: '/clients/kick-trening.png', alt: 'Kick Trening' },
  { src: '/clients/arendalnaringsforening-ung-sort-logo.png', alt: 'Arendal Næringsforening Ung' },
  { src: '/clients/imitch.png', alt: 'iMitch' },
  { src: '/clients/nes.png', alt: 'NES' },
];

const TESTIMONIALS = [
  {
    quote: 'Sparer 4 timer i uka på oppfølging av kunder. Tid vi nå bruker på det som faktisk tjener penger!',
    name: 'Tommy Grude',
    company: 'Grude Consulting',
  },
  {
    quote: 'Praktisk og konkret — viste oss nye verktøy vi faktisk kan bruke med en gang. Vi er allerede i gang med å teste. Verdt tiden 100%.',
    name: 'Fredrik Opheim',
    company: 'Brainwaves',
  },
  {
    quote: 'Hjulpet meg med å identifisere og løse utfordringer gjennom en grundig og profesjonell prosess. Kom tilbake med solide anbefalinger etter bare noen dager.',
    name: 'Jørn Nilsen',
    company: 'Droptech',
  },
];

const Proof = () => (
  <section className="reveal-section py-24 md:py-32 px-6" style={{ background: '#E8E4DC' }}>
    <div className="max-w-5xl mx-auto">
      <div className="reveal w-12 h-0.5 bg-[#1A6B6D] mb-8 mx-auto" />
      <h2 className="reveal font-agentik font-bold text-[clamp(1.8rem,4vw,3rem)] text-[#1A1F25] tracking-tight leading-[1.1] mb-4 text-center">
        Brukt av selskaper over hele Norge
      </h2>
      <p className="reveal text-[#1A1F25]/50 text-sm text-center mb-14">
        Noen av selskapene vi har hjulpet med AI-strategi og implementering
      </p>

      <div className="reveal flex flex-wrap justify-center items-center gap-8 md:gap-12 mb-20 px-4">
        {CLIENT_LOGOS.map((logo) => (
          <img
            key={logo.alt}
            src={logo.src}
            alt={logo.alt}
            className="h-8 md:h-10 w-auto object-contain grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
          />
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="reveal bg-[#F5F2EC] rounded-2xl p-6 md:p-8 border border-[#1A1F25]/5">
            <p className="text-[#1A1F25]/70 text-sm leading-relaxed mb-6">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div>
              <p className="font-agentik font-semibold text-[#1A1F25] text-sm tracking-tight">{t.name}</p>
              <p className="text-[#1A1F25]/40 text-xs">{t.company}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────
// TEAM
// ─────────────────────────────────────────────────────────────
const TEAM = [
  { name: 'Ivar André Knutsen', role: 'CEO & Co-founder', image: '/team/ivar.jpg' },
  { name: 'Ole Kristian', role: 'COO & Co-founder', image: '/team/ole.jpg' },
];

const Team = () => (
  <section className="reveal-section py-24 md:py-28 px-6" style={{ background: '#F5F2EC' }}>
    <div className="max-w-4xl mx-auto">
      <div className="reveal w-12 h-0.5 bg-[#1A6B6D] mb-8" />
      <h2 className="reveal font-agentik font-bold text-[clamp(1.8rem,4vw,3rem)] text-[#1A1F25] tracking-tight leading-[1.1] mb-4">
        To gründere. Direkte tilgang.
      </h2>
      <p className="reveal font-agentik text-[#1A1F25]/55 text-base md:text-lg max-w-2xl mb-14 leading-relaxed">
        Når dere snakker med oss, snakker dere med folka som faktisk bygger. Ingen account managere som videresender meldinger.
      </p>

      <div className="grid sm:grid-cols-2 gap-8 md:gap-10">
        {TEAM.map((person) => (
          <div key={person.name} className="reveal flex flex-col">
            <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#1A1F25]/5 mb-5">
              <img
                src={person.image}
                alt={person.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-[1.03]"
              />
            </div>
            <h3 className="font-agentik font-semibold text-[#1A1F25] text-lg md:text-xl tracking-tight mb-1">
              {person.name}
            </h3>
            <p className="font-data text-[10px] uppercase tracking-[0.18em] text-[#1A6B6D]">
              {person.role}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────
// CONTACT
// ─────────────────────────────────────────────────────────────
const ContactForm = () => {
  const [form, setForm] = useState({ fornavn: '', bedrift: '', telefon: '', epost: '', maal: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/agentik-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('sent');
        setForm({ fornavn: '', bedrift: '', telefon: '', epost: '', maal: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const inputClass =
    'w-full bg-[#252A31] border border-[#E8E4DC]/10 rounded-lg px-4 py-3.5 text-[#E8E4DC] text-sm placeholder:text-[#E8E4DC]/35 focus:outline-none focus:border-[#C4854C]/50 focus:ring-1 focus:ring-[#C4854C]/30 transition-colors';

  if (status === 'sent') {
    return (
      <section id="contact" className="reveal-section py-28 md:py-36 px-6" style={{ background: '#1A1F25' }}>
        <div className="max-w-md mx-auto text-center">
          <div className="w-14 h-14 rounded-full bg-[#1A6B6D]/20 flex items-center justify-center mx-auto mb-6">
            <Check size={24} className="text-[#1A6B6D]" />
          </div>
          <h2 className="font-agentik font-bold text-2xl text-[#E8E4DC] tracking-tight mb-3">
            Takk for henvendelsen
          </h2>
          <p className="text-[#E8E4DC]/50 text-base">
            Vi tar kontakt innen kort tid.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="reveal-section relative py-28 md:py-36 px-6 overflow-hidden" style={{ background: '#1A1F25' }}>
      {/* Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20 blur-[140px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #1A6B6D 0%, transparent 70%)' }}
      />

      <div className="relative max-w-lg mx-auto">
        <p className="reveal text-center font-data text-[10px] uppercase tracking-[0.25em] text-[#4FC3B0] mb-5">
          07 — La oss snakke
        </p>
        <h2 className="reveal font-agentik font-bold text-[clamp(1.8rem,4.5vw,3.2rem)] text-[#E8E4DC] tracking-tight leading-[1.05] mb-4 text-center">
          Vil du finne hvor AI kan skape verdi
          <br /> i deres bedrift?
        </h2>
        <p className="reveal text-[#E8E4DC]/45 text-base text-center mb-10 max-w-md mx-auto leading-relaxed">
          Fyll ut skjemaet, så tar vi en uforpliktende mulighetssamtale. Kun et begrenset antall selskaper tas inn hver måned.
        </p>

        <form onSubmit={handleSubmit} className="reveal space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text" placeholder="Fornavn" required
              value={form.fornavn}
              onChange={(e) => setForm({ ...form, fornavn: e.target.value })}
              className={inputClass}
            />
            <input
              type="text" placeholder="Bedrift" required
              value={form.bedrift}
              onChange={(e) => setForm({ ...form, bedrift: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="email" placeholder="E-post" required
              value={form.epost}
              onChange={(e) => setForm({ ...form, epost: e.target.value })}
              className={inputClass}
            />
            <input
              type="tel" placeholder="Telefon (valgfritt)"
              value={form.telefon}
              onChange={(e) => setForm({ ...form, telefon: e.target.value })}
              className={inputClass}
            />
          </div>
          <textarea
            placeholder="Hva ønsker dere å oppnå med AI? (valgfritt)"
            rows={3}
            value={form.maal}
            onChange={(e) => setForm({ ...form, maal: e.target.value })}
            className={`${inputClass} resize-none`}
          />

          <button
            type="submit"
            disabled={status === 'sending'}
            className="btn-magnetic w-full rounded-lg py-4 text-base bg-[#C4854C] text-[#F5F2EC] font-heading font-medium tracking-tight disabled:opacity-60"
          >
            <span className="btn-layer bg-[#1A1F25]"></span>
            <span className="btn-text flex items-center justify-center gap-2">
              {status === 'sending' ? 'Sender...' : 'Book en mulighetssamtale'}
              {status !== 'sending' && <ArrowRight size={18} />}
            </span>
          </button>

          {status === 'error' && (
            <p className="text-red-400 text-sm text-center">
              Noe gikk galt. Prøv igjen eller send en e-post direkte.
            </p>
          )}
        </form>

        <p className="reveal mt-8 text-center text-sm text-[#F5F2EC]/60">
          Eller send oss en e-post:{' '}
          <a
            href="mailto:hei@agentik.no"
            className="text-[#F5F2EC] underline decoration-[#C4854C]/50 underline-offset-4 hover:decoration-[#C4854C] transition-colors"
          >
            hei@agentik.no
          </a>
        </p>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="border-t border-[#E8E4DC]/8 pt-16 pb-10 px-6" style={{ background: '#1A1F25' }}>
    <div className="max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-10 pb-10 border-b border-[#E8E4DC]/8">
        <div>
          <div className="font-agentik font-semibold text-[#E8E4DC] text-xl tracking-tight mb-3">
            Agentik
          </div>
          <p className="font-agentik text-[#E8E4DC]/40 text-sm max-w-sm leading-relaxed">
            Din eksterne AI-avdeling. Vi identifiserer, implementerer, vedlikeholder og forbedrer AI-systemer som skaper målbar verdi.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:justify-self-end">
          <div>
            <h4 className="font-data text-[10px] uppercase tracking-[0.18em] text-[#E8E4DC]/35 mb-4">
              Selskap
            </h4>
            <ul className="space-y-3 text-[#E8E4DC]/55 text-sm">
              <li><button onClick={() => scrollTo('sprint')} className="hover:text-[#4FC3B0] transition-colors">Sprint</button></li>
              <li><button onClick={() => scrollTo('moduler')} className="hover:text-[#4FC3B0] transition-colors">Moduler</button></li>
              <li><button onClick={() => scrollTo('contact')} className="hover:text-[#4FC3B0] transition-colors">Book samtale</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-data text-[10px] uppercase tracking-[0.18em] text-[#E8E4DC]/35 mb-4">
              Juridisk
            </h4>
            <ul className="space-y-3 text-[#E8E4DC]/55 text-sm">
              <li><a href="/vilkar" className="hover:text-[#4FC3B0] transition-colors">Vilkår</a></li>
              <li><a href="/personvern" className="hover:text-[#4FC3B0] transition-colors">Personvern</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="pt-8">
        <p className="font-agentik text-[#E8E4DC]/30 text-xs tracking-tight">
          &copy; {new Date().getFullYear()} Agentik · Org.nr 933 378 179 · Skien, Norge
        </p>
      </div>
    </div>
  </footer>
);

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────
export default function Side2() {
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal-section').forEach((section) => {
        gsap.from(section.querySelectorAll('.reveal'), {
          y: 40,
          opacity: 0,
          stagger: 0.08,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
            once: true,
          },
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <Helmet>
        <title>Agentik | Din eksterne AI-avdeling</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta
          name="description"
          content="Vi blir deres eksterne AI-avdeling. Vi identifiserer, implementerer, vedlikeholder og forbedrer AI-systemer som skaper målbar verdi i support, salg, drift og interne arbeidsflyter."
        />
        <meta property="og:title" content="Agentik | Din eksterne AI-avdeling" />
        <meta
          property="og:description"
          content="Fra AI-nysgjerrighet til AI i daglig drift. 90-dagers verdigaranti: minst 2x investeringen i årlig verdipotensial."
        />
        <meta property="og:locale" content="nb_NO" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <style>{`
          .font-agentik{font-family:'Plus Jakarta Sans',sans-serif}
          .agentik-page,.agentik-page .font-heading,.agentik-page .font-sans{font-family:'Plus Jakarta Sans',sans-serif}
          .agentik-page .font-data{font-family:'JetBrains Mono',ui-monospace,monospace}
        `}</style>
      </Helmet>

      <div className="agentik-page">
        <Navbar />
        <main>
          <Hero />
          <Problem />
          <NewApproach />
          <SprintPhases />
          <UseCaseModules />
          <ValueGuarantee />
          <PricingSection />
          <WhoItIsFor />
          <Proof />
          <Team />
          <ContactForm />
        </main>
        <Footer />
      </div>
    </>
  );
}
