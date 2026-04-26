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
// LOGO STRIP — instant credibility right after hero
// ─────────────────────────────────────────────────────────────
const LOGO_STRIP = [
  { src: '/clients/droptech.png', alt: 'Droptech' },
  { src: '/clients/brainwaves.png', alt: 'Brainwaves' },
  { src: '/clients/salesup.png', alt: 'SalesUp' },
  { src: '/clients/Badogbygg.webp', alt: 'Bad og Bygg' },
  { src: '/clients/kick-trening.png', alt: 'Kick Trening' },
  { src: '/clients/imitch.png', alt: 'iMitch' },
  { src: '/clients/nes.png', alt: 'NES' },
];

const LogoStrip = () => (
  <section className="reveal-section py-14 md:py-16 px-6 border-b border-[#1A1F25]/8" style={{ background: '#F5F2EC' }}>
    <div className="max-w-6xl mx-auto">
      <p className="reveal text-center font-data text-[10px] uppercase tracking-[0.28em] text-[#1A1F25]/40 mb-9">
        Selskaper vi har jobbet med
      </p>
      <div className="reveal flex flex-wrap justify-center items-center gap-x-10 gap-y-7 md:gap-x-14">
        {LOGO_STRIP.map((logo) => (
          <img
            key={logo.alt}
            src={logo.src}
            alt={logo.alt}
            className="h-7 md:h-8 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
          />
        ))}
      </div>
    </div>
  </section>
);

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
// METRICS STRIP — aggregated proof
// NOTE: Tall er placeholder — bytt med faktiske aggregater før prod.
// ─────────────────────────────────────────────────────────────
const MetricsStrip = () => {
  const ref = useRef(null);
  const [counts, setCounts] = useState({ hours: 0, systems: 0, value: 0 });

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          const obj = { hours: 0, systems: 0, value: 0 };
          gsap.to(obj, {
            hours: 12480,
            systems: 47,
            value: 8.4,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () =>
              setCounts({
                hours: Math.round(obj.hours),
                systems: Math.round(obj.systems),
                value: Number(obj.value.toFixed(1)),
              }),
          });
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="reveal-section relative py-20 md:py-24 px-6 border-y border-[#E8E4DC]/8"
      style={{ background: '#0E1114' }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full opacity-20 blur-[120px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #1A6B6D 0%, transparent 70%)' }}
      />
      <div className="relative max-w-5xl mx-auto">
        <p className="reveal text-center font-data text-[10px] uppercase tracking-[0.25em] text-[#4FC3B0]/70 mb-10">
          Så langt for våre kunder
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-10 sm:gap-y-0">
          <div className="reveal text-center">
            <p className="font-agentik font-bold text-[#E8E4DC] text-4xl md:text-5xl tracking-[-0.03em] tabular-nums mb-2">
              {counts.hours.toLocaleString('nb-NO')}
            </p>
            <p className="font-data text-[10px] uppercase tracking-[0.18em] text-[#E8E4DC]/45">
              Timer spart
            </p>
          </div>
          <div className="reveal text-center sm:border-x border-[#E8E4DC]/10">
            <p className="font-agentik font-bold text-[#E8E4DC] text-4xl md:text-5xl tracking-[-0.03em] tabular-nums mb-2">
              {counts.systems}
            </p>
            <p className="font-data text-[10px] uppercase tracking-[0.18em] text-[#E8E4DC]/45">
              AI-løsninger i drift
            </p>
          </div>
          <div className="reveal text-center">
            <p className="font-agentik font-bold text-[#C4854C] text-4xl md:text-5xl tracking-[-0.03em] tabular-nums mb-2">
              {counts.value.toFixed(1)}<span className="text-[#C4854C]/60 text-2xl ml-1">M kr</span>
            </p>
            <p className="font-data text-[10px] uppercase tracking-[0.18em] text-[#E8E4DC]/45">
              Dokumentert årlig verdipotensial
            </p>
          </div>
        </div>
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
// CASE STUDY — anonymized before/after with concrete numbers
// NOTE: Tall er realistiske placeholdere fra spec §11. Bytt med
// faktisk anonymisert kunde-case når første sprint er ferdig.
// ─────────────────────────────────────────────────────────────
const CaseStudy = () => {
  const beforeMetrics = [
    { label: 'Faktura-sortering', value: '14', unit: 't/uke' },
    { label: 'Tilbuds-produksjon', value: '6', unit: 't/uke' },
    { label: 'Møte-til-CRM admin', value: '4', unit: 't/uke' },
  ];
  const afterMetrics = [
    { label: 'Faktura-sortering', value: '1.2', unit: 't/uke' },
    { label: 'Tilbuds-produksjon', value: '1.5', unit: 't/uke' },
    { label: 'Møte-til-CRM admin', value: '0.5', unit: 't/uke' },
  ];

  return (
    <section
      className="reveal-section relative py-28 md:py-36 px-6 overflow-hidden"
      style={{ background: '#F5F2EC' }}
    >
      <div className="relative max-w-6xl mx-auto">
        <div className="reveal flex items-center gap-3 mb-8">
          <span className="font-data text-[10px] uppercase tracking-[0.25em] text-[#1A6B6D]">
            05 — Case
          </span>
          <span className="block flex-1 h-px bg-[#1A1F25]/10" />
        </div>

        <div className="max-w-3xl mb-14">
          <h2 className="reveal font-agentik font-bold text-[clamp(2.2rem,5vw,4rem)] text-[#1A1F25] tracking-[-0.025em] leading-[1.02] mb-6">
            Slik så det ut etter <span className="text-[#1A6B6D]">90 dager.</span>
          </h2>
          <p className="reveal font-agentik text-[#1A1F25]/60 text-lg md:text-xl leading-relaxed">
            Anonymisert. Norsk regnskapsbedrift, 45 ansatte. Tre arbeidsflyter prioritert i sprinten — fakturasortering, tilbudsutkast og møte-til-CRM.
          </p>
        </div>

        {/* Before / After grid */}
        <div className="reveal grid md:grid-cols-2 gap-5 mb-10">
          {/* Before */}
          <div className="bg-white border border-[#1A1F25]/8 rounded-2xl p-7 md:p-9">
            <div className="flex items-center gap-3 mb-7">
              <span className="font-data text-[10px] uppercase tracking-[0.22em] text-[#1A1F25]/50 bg-[#1A1F25]/5 px-2.5 py-1 rounded-full">
                Før
              </span>
              <span className="font-agentik text-[#1A1F25]/60 text-sm">
                Manuelt arbeid
              </span>
            </div>
            <ul className="space-y-5">
              {beforeMetrics.map((m) => (
                <li key={m.label} className="flex justify-between items-baseline pb-4 border-b border-[#1A1F25]/8 last:border-b-0 last:pb-0">
                  <span className="font-agentik text-[#1A1F25]/70 text-[15px]">{m.label}</span>
                  <span className="font-agentik font-bold text-[#1A1F25] text-2xl tracking-tight tabular-nums">
                    {m.value}
                    <span className="text-[#1A1F25]/40 text-sm ml-1">{m.unit}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* After */}
          <div className="bg-gradient-to-br from-[#1A6B6D]/8 to-[#4FC3B0]/4 border border-[#1A6B6D]/25 rounded-2xl p-7 md:p-9">
            <div className="flex items-center gap-3 mb-7">
              <span className="font-data text-[10px] uppercase tracking-[0.22em] text-[#1A6B6D] bg-[#1A6B6D]/12 px-2.5 py-1 rounded-full">
                Etter 90 dager
              </span>
              <span className="font-agentik text-[#1A6B6D] text-sm font-medium">
                I drift
              </span>
            </div>
            <ul className="space-y-5">
              {afterMetrics.map((m) => (
                <li key={m.label} className="flex justify-between items-baseline pb-4 border-b border-[#1A6B6D]/15 last:border-b-0 last:pb-0">
                  <span className="font-agentik text-[#1A1F25]/80 text-[15px]">{m.label}</span>
                  <span className="font-agentik font-bold text-[#1A6B6D] text-2xl tracking-tight tabular-nums">
                    {m.value}
                    <span className="text-[#1A6B6D]/50 text-sm ml-1">{m.unit}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Outcome row */}
        <div className="reveal bg-[#1A1F25] rounded-2xl p-7 md:p-10 grid sm:grid-cols-3 gap-y-6 sm:gap-y-0 sm:gap-x-8">
          <div>
            <p className="font-data text-[10px] uppercase tracking-[0.2em] text-[#4FC3B0] mb-2">
              Frigjort kapasitet
            </p>
            <p className="font-agentik font-bold text-[#E8E4DC] text-3xl tracking-tight tabular-nums">
              20.8<span className="text-[#E8E4DC]/40 text-base ml-1">t/uke</span>
            </p>
          </div>
          <div className="sm:border-x sm:border-[#E8E4DC]/10 sm:px-8">
            <p className="font-data text-[10px] uppercase tracking-[0.2em] text-[#4FC3B0] mb-2">
              Dokumentert årlig verdi
            </p>
            <p className="font-agentik font-bold text-[#E8E4DC] text-3xl tracking-tight tabular-nums">
              865 280<span className="text-[#E8E4DC]/40 text-base ml-1">kr</span>
            </p>
          </div>
          <div>
            <p className="font-data text-[10px] uppercase tracking-[0.2em] text-[#C4854C] mb-2">
              Avkastning år 1
            </p>
            <p className="font-agentik font-bold text-[#C4854C] text-3xl tracking-tight tabular-nums">
              7.4×<span className="text-[#C4854C]/50 text-base ml-1">av investering</span>
            </p>
          </div>
        </div>

        <p className="reveal mt-8 text-center font-data text-[11px] uppercase tracking-[0.18em] text-[#1A1F25]/40">
          Verdi-baseline = 800 kr/time intern kost · oppgitt i oppdragsavtalen
        </p>
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
            06 — 90-dagers verdigaranti
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
// COMPARISON — vs alternatives
// ─────────────────────────────────────────────────────────────
const Comparison = () => {
  const rows = [
    {
      label: 'Tid til første AI i drift',
      hire: '6–12 måneder',
      consult: '2–4 måneder',
      diy: 'Ofte aldri',
      us: '3–6 uker',
    },
    {
      label: 'Strategisk eierskap',
      hire: 'Internt',
      consult: 'Rapport, så ut',
      diy: 'Uklart',
      us: 'Vi eier roadmap-en',
    },
    {
      label: 'Vedlikehold og forbedring',
      hire: 'Avhengig av ressurs',
      consult: 'Tilleggspris',
      diy: 'Glipper raskt',
      us: 'Inkludert månedlig',
    },
    {
      label: 'Verdimåling og dokumentasjon',
      hire: 'Sjelden formalisert',
      consult: 'Sluttrapport',
      diy: 'Nei',
      us: 'Live ROI-dashbord',
    },
    {
      label: 'Kostnad år 1',
      hire: '900k+ (lønn + lader)',
      consult: '500k–1.5M',
      diy: 'Skjult i intern tid',
      us: '468k (39k × 12)',
    },
    {
      label: 'Risiko ved feil retning',
      hire: 'Høy — fast kostnad',
      consult: 'Medium — kontrakt',
      diy: 'Lav i kr, høy i tid',
      us: 'Lav — månedlig oppsigelse',
    },
  ];

  return (
    <section
      className="reveal-section relative py-28 md:py-36 px-6 overflow-hidden"
      style={{ background: '#1A1F25' }}
    >
      <div className="relative max-w-6xl mx-auto">
        <div className="reveal flex items-center gap-3 mb-8">
          <span className="font-data text-[10px] uppercase tracking-[0.25em] text-[#4FC3B0]">
            07 — Sammenligning
          </span>
          <span className="block flex-1 h-px bg-[#E8E4DC]/10" />
        </div>

        <div className="max-w-3xl mb-12">
          <h2 className="reveal font-agentik font-bold text-[clamp(2.2rem,5vw,4rem)] text-[#E8E4DC] tracking-[-0.025em] leading-[1.02] mb-6">
            Hvorfor ikke bare ansette internt?
          </h2>
          <p className="reveal font-agentik text-[#E8E4DC]/60 text-lg md:text-xl leading-relaxed">
            Greit spørsmål. Her er hva vi konsekvent ser hos selskaper som har vurdert alternativene.
          </p>
        </div>

        {/* Desktop table */}
        <div className="reveal hidden md:block overflow-hidden rounded-2xl border border-[#E8E4DC]/10">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#0E1114] border-b border-[#E8E4DC]/10">
                <th className="font-data text-[10px] uppercase tracking-[0.18em] text-[#E8E4DC]/45 px-5 py-4 font-medium" />
                <th className="font-data text-[10px] uppercase tracking-[0.18em] text-[#E8E4DC]/55 px-5 py-4 font-medium">Ansette internt</th>
                <th className="font-data text-[10px] uppercase tracking-[0.18em] text-[#E8E4DC]/55 px-5 py-4 font-medium">Generisk konsulent</th>
                <th className="font-data text-[10px] uppercase tracking-[0.18em] text-[#E8E4DC]/55 px-5 py-4 font-medium">Gjøre det selv</th>
                <th className="font-data text-[10px] uppercase tracking-[0.18em] text-[#4FC3B0] px-5 py-4 font-medium bg-[#4FC3B0]/5 border-l border-[#4FC3B0]/20">
                  Agentik AI-Partner
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-[#E8E4DC]/8 last:border-b-0">
                  <td className="px-5 py-5 font-agentik text-[#E8E4DC] text-[14px] tracking-tight font-medium">
                    {row.label}
                  </td>
                  <td className="px-5 py-5 font-agentik text-[#E8E4DC]/55 text-[14px]">{row.hire}</td>
                  <td className="px-5 py-5 font-agentik text-[#E8E4DC]/55 text-[14px]">{row.consult}</td>
                  <td className="px-5 py-5 font-agentik text-[#E8E4DC]/55 text-[14px]">{row.diy}</td>
                  <td className="px-5 py-5 font-agentik text-[#E8E4DC] text-[14px] font-medium bg-[#4FC3B0]/5 border-l border-[#4FC3B0]/20">
                    {row.us}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="reveal md:hidden space-y-4">
          {rows.map((row, i) => (
            <div key={i} className="bg-[#161A1F] border border-[#E8E4DC]/10 rounded-xl p-5">
              <p className="font-agentik font-semibold text-[#E8E4DC] text-base tracking-tight mb-4 pb-3 border-b border-[#E8E4DC]/8">
                {row.label}
              </p>
              <dl className="grid grid-cols-2 gap-y-3 gap-x-4 text-[13px]">
                <dt className="font-data uppercase tracking-[0.12em] text-[#E8E4DC]/40 text-[10px]">Ansette</dt>
                <dd className="text-[#E8E4DC]/70 font-agentik">{row.hire}</dd>
                <dt className="font-data uppercase tracking-[0.12em] text-[#E8E4DC]/40 text-[10px]">Konsulent</dt>
                <dd className="text-[#E8E4DC]/70 font-agentik">{row.consult}</dd>
                <dt className="font-data uppercase tracking-[0.12em] text-[#E8E4DC]/40 text-[10px]">DIY</dt>
                <dd className="text-[#E8E4DC]/70 font-agentik">{row.diy}</dd>
                <dt className="font-data uppercase tracking-[0.12em] text-[#4FC3B0] text-[10px]">Agentik</dt>
                <dd className="text-[#E8E4DC] font-agentik font-medium">{row.us}</dd>
              </dl>
            </div>
          ))}
        </div>

        <p className="reveal mt-10 text-center font-agentik italic text-[#E8E4DC]/50 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Den beste løsningen kommer an på dere. Hvis dere har internt eierskap og teknisk kapasitet, er ansettelse riktig. Hvis ikke — er det det vi løser.
        </p>
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
          <span className="font-data text-[10px] uppercase tracking-[0.25em] text-[#4FC3B0]">08 — Hvem det passer for</span>
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
// FAQ — objection handling from spec §11
// ─────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: 'Er dette dyrt?',
    a: 'Det avhenger av mengden manuelt arbeid og operasjonell verdi i bedriften. Hvis vi ikke ser realistisk potensial for et sterkt business case, anbefaler vi ikke sprinten. Målet er at de første 90 dagene skaper dokumentert verdipotensial som klart rettferdiggjør investeringen.',
  },
  {
    q: 'Kan vi ikke bare gjøre dette selv?',
    a: 'Hvis dere har intern kapasitet, teknisk kompetanse og en eier som passer på implementering — ja. Utfordringen vi ser oftest er at AI blir værende som isolerte tester som aldri inngår i daglige arbeidsflyter. Vår rolle er å prioritere det som gir høyest verdi, implementere ordentlig, og vedlikeholde over tid.',
  },
  {
    q: 'Er ikke dette bare automasjon?',
    a: 'Automasjon er én del. Den større verdien er eierskap. Vi hjelper dere bestemme hva som skal automatiseres, hva som skal bruke AI, hva som skal forbli manuelt, hvordan det skal kobles mot deres systemer, og hvordan det skal vedlikeholdes og forbedres.',
  },
  {
    q: 'Sier dere altså at vi sparer 234 000 kr på 90 dager?',
    a: 'Ikke nødvendigvis realisert kontantbesparelse på 90 dager. Det vi garanterer er at vi innen 90 dager har implementert AI- eller automasjonstiltak med dokumentert årlig verdipotensial på minst 2× investeringen. Det kan komme fra spart tid, frigjort kapasitet, raskere oppfølging, færre manuelle steg eller færre feil.',
  },
  {
    q: 'Hvordan beregner dere verdi?',
    a: 'Vi lager en verdi-baseline i starten. Vi ser på hvor mye tid som brukes på spesifikke arbeidsflyter i dag, hvem som gjør jobben, hvor ofte det skjer, intern timekost, og hva som realistisk kan forbedres. Eksempel: Hvis vi frigjør 6 timer/uke til 800 kr/time intern kost = 249 600 kr i årlig verdipotensial.',
  },
  {
    q: 'Hva skjer hvis dere ikke når garantien?',
    a: 'Vi jobber videre uten månedlig honorar i opptil 90 ekstra dager til verdien er dokumentert. Dette er ikke en money-back-garanti. Det er en leverings- og verdigaranti.',
  },
  {
    q: 'Hva er bindingen?',
    a: '90 dager (selve sprinten). Etter det er det månedlig oppsigelse fra begge parter. Founding-prisen på 39 000 kr/mnd er låst for alltid for de første tre partnerne.',
  },
  {
    q: 'Hvem eier det vi bygger?',
    a: 'Dere eier dataene og de ferdige løsningene som er bygget spesifikt for dere — inkludert full bruksrett til kildekoden. Vi eier våre templates, metoder og rammeverk som vi bruker på tvers av kunder.',
  },
];

const FAQItem = ({ q, a, isOpen, onToggle }) => (
  <div className="border-b border-[#1A1F25]/10 last:border-b-0">
    <button
      onClick={onToggle}
      className="w-full flex items-start justify-between gap-6 py-6 md:py-7 text-left group"
      aria-expanded={isOpen}
    >
      <span className="font-agentik font-semibold text-[#1A1F25] text-base md:text-lg tracking-tight leading-snug pr-4">
        {q}
      </span>
      <span
        className={`flex-shrink-0 w-8 h-8 rounded-full border border-[#1A6B6D]/30 flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-[#1A6B6D] border-[#1A6B6D] rotate-180' : 'bg-transparent group-hover:bg-[#1A6B6D]/10'
        }`}
      >
        <ChevronDown
          size={15}
          className={`transition-colors ${isOpen ? 'text-white' : 'text-[#1A6B6D]'}`}
        />
      </span>
    </button>
    <div
      className="overflow-hidden transition-all duration-400 ease-out"
      style={{
        maxHeight: isOpen ? '500px' : '0',
        opacity: isOpen ? 1 : 0,
      }}
    >
      <p className="font-agentik text-[#1A1F25]/65 text-base md:text-lg leading-relaxed pb-7 max-w-3xl">
        {a}
      </p>
    </div>
  </div>
);

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section
      className="reveal-section relative py-28 md:py-36 px-6 overflow-hidden"
      style={{ background: '#F5F2EC' }}
    >
      <div className="relative max-w-4xl mx-auto">
        <div className="reveal flex items-center gap-3 mb-8">
          <span className="font-data text-[10px] uppercase tracking-[0.25em] text-[#1A6B6D]">
            09 — Vanlige spørsmål
          </span>
          <span className="block flex-1 h-px bg-[#1A1F25]/10" />
        </div>

        <h2 className="reveal font-agentik font-bold text-[clamp(2rem,4.5vw,3.5rem)] text-[#1A1F25] tracking-[-0.025em] leading-[1.05] mb-12">
          Det vi pleier å få spørsmål om.
        </h2>

        <div className="reveal bg-white border border-[#1A1F25]/8 rounded-2xl px-6 md:px-10 shadow-[0_2px_20px_rgba(26,31,37,0.04)]">
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem
              key={i}
              q={item.q}
              a={item.a}
              isOpen={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
            />
          ))}
        </div>

        <p className="reveal mt-10 text-center font-agentik text-[#1A1F25]/55 text-base">
          Andre spørsmål? Send en e-post til{' '}
          <a
            href="mailto:hei@agentik.no"
            className="text-[#1A6B6D] underline decoration-[#1A6B6D]/40 underline-offset-4 hover:decoration-[#1A6B6D] transition-colors"
          >
            hei@agentik.no
          </a>
        </p>
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
  const [form, setForm] = useState({
    fornavn: '',
    bedrift: '',
    telefon: '',
    epost: '',
    ansatte: '',
    manuelleTimer: '',
    maal: '',
  });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // Combine qualification + maal into one field for N8N webhook compatibility
      const payload = {
        fornavn: form.fornavn,
        bedrift: form.bedrift,
        telefon: form.telefon,
        epost: form.epost,
        maal: [
          form.ansatte ? `Antall ansatte: ${form.ansatte}` : null,
          form.manuelleTimer ? `Estimerte manuelle timer/uke: ${form.manuelleTimer}` : null,
          form.maal ? `Mål: ${form.maal}` : null,
        ].filter(Boolean).join(' · '),
      };

      const res = await fetch('/api/agentik-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus('sent');
        setForm({ fornavn: '', bedrift: '', telefon: '', epost: '', ansatte: '', manuelleTimer: '', maal: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const inputClass =
    'w-full bg-[#252A31] border border-[#E8E4DC]/10 rounded-lg px-4 py-3.5 text-[#E8E4DC] text-sm placeholder:text-[#E8E4DC]/35 focus:outline-none focus:border-[#C4854C]/50 focus:ring-1 focus:ring-[#C4854C]/30 transition-colors';
  const selectClass = `${inputClass} appearance-none bg-no-repeat bg-[length:14px] bg-[position:right_1rem_center] cursor-pointer`;
  const selectStyle = {
    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23E8E4DC' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
  };

  if (status === 'sent') {
    return (
      <section id="contact" className="reveal-section relative py-28 md:py-36 px-6 overflow-hidden" style={{ background: '#1A1F25' }}>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-25 blur-[140px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #1A6B6D 0%, transparent 70%)' }}
        />
        <div className="relative max-w-xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-[#4FC3B0]/15 border border-[#4FC3B0]/40 flex items-center justify-center mx-auto mb-7">
            <Check size={26} className="text-[#4FC3B0]" strokeWidth={2.5} />
          </div>
          <h2 className="font-agentik font-bold text-3xl md:text-4xl text-[#E8E4DC] tracking-tight mb-4">
            Takk for henvendelsen
          </h2>
          <p className="text-[#E8E4DC]/55 text-base md:text-lg leading-relaxed mb-12 max-w-md mx-auto">
            Vi har mottatt skjemaet og lest gjennom det. Slik ser veien videre ut:
          </p>

          {/* Next steps timeline */}
          <ol className="text-left max-w-md mx-auto space-y-5">
            {[
              { tag: 'Innen 24 timer', title: 'Personlig svar på e-post', desc: 'Vi bekrefter mottak og foreslår 2–3 tider for samtalen.' },
              { tag: '15–20 minutter', title: 'Mulighetssamtale', desc: 'Vi går gjennom info dere oppga og diskuterer hvor AI kan gi verdi.' },
              { tag: 'Etter samtalen', title: 'Konkret anbefaling', desc: 'Hvis det er fit: 90-dagers Sprint-tilbud. Hvis ikke: ærlig anbefaling om alternativ.' },
            ].map((step, i) => (
              <li key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1A6B6D]/15 border border-[#1A6B6D]/35 flex items-center justify-center mt-0.5">
                  <span className="font-data text-[11px] text-[#4FC3B0] font-semibold">{i + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="font-data text-[10px] uppercase tracking-[0.18em] text-[#4FC3B0]/80 mb-1">{step.tag}</p>
                  <p className="font-agentik font-semibold text-[#E8E4DC] text-base tracking-tight mb-1">{step.title}</p>
                  <p className="font-agentik text-[#E8E4DC]/55 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-12 text-[#E8E4DC]/40 text-sm">
            Spørsmål i mellomtiden?{' '}
            <a href="mailto:hei@agentik.no" className="text-[#E8E4DC]/70 underline decoration-[#C4854C]/50 underline-offset-4 hover:decoration-[#C4854C] transition-colors">
              hei@agentik.no
            </a>
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
          10 — La oss snakke
        </p>
        <h2 className="reveal font-agentik font-bold text-[clamp(1.8rem,4.5vw,3.2rem)] text-[#E8E4DC] tracking-tight leading-[1.05] mb-4 text-center">
          Vil du finne hvor AI kan skape verdi
          <br /> i deres bedrift?
        </h2>
        <p className="reveal text-[#E8E4DC]/45 text-base text-center mb-10 max-w-md mx-auto leading-relaxed">
          Fyll ut skjemaet, så tar vi en uforpliktende mulighetssamtale. Vi tar inn 3 founding-partnere de neste 60 dagene.
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

          {/* Qualification fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              required
              value={form.ansatte}
              onChange={(e) => setForm({ ...form, ansatte: e.target.value })}
              className={selectClass}
              style={selectStyle}
            >
              <option value="" disabled>Antall ansatte</option>
              <option value="1-19">1–19</option>
              <option value="20-49">20–49</option>
              <option value="50-99">50–99</option>
              <option value="100-299">100–299</option>
              <option value="300+">300+</option>
            </select>
            <select
              required
              value={form.manuelleTimer}
              onChange={(e) => setForm({ ...form, manuelleTimer: e.target.value })}
              className={selectClass}
              style={selectStyle}
            >
              <option value="" disabled>Estimerte manuelle timer/uke</option>
              <option value="0-10">0–10 timer</option>
              <option value="10-30">10–30 timer</option>
              <option value="30-60">30–60 timer</option>
              <option value="60+">60+ timer</option>
              <option value="vet ikke">Vet ikke</option>
            </select>
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

          <p className="text-center text-[11px] text-[#E8E4DC]/30 pt-2 leading-relaxed">
            Vi svarer personlig innen 24 timer. Ingen automatiske drip-sekvenser.
          </p>
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
// SIDE2 PRICING — inline variant that keeps user in /side2 flow
// ─────────────────────────────────────────────────────────────
const Side2Pricing = () => {
  const includes = [
    { title: 'Komplett AI-Revisjon', desc: 'Strukturert kartlegging av hvor AI gir høyest ROI. Skjer i de første 1–2 ukene.' },
    { title: 'Eget ROI-dashbord', desc: 'Live oversikt over hva som er bygget og målbar effekt. Settes opp automatisk ved oppstart.', featured: true },
    { title: 'Månedlig strategimøte', desc: 'Gjennomgang av forrige måneds leveranser, prioritering av neste.' },
    { title: 'Bygging og vedlikehold', desc: 'AI-løsninger bygges, drives og forbedres innenfor månedlig kapasitet.' },
    { title: 'Direkte Slack-tilgang', desc: 'Løpende rådgivning og spørsmål — svar samme virkedag.' },
    { title: 'Opplæring av teamet', desc: 'Når nye løsninger settes i drift, sørger vi for at folkene bruker dem.' },
  ];

  return (
    <section id="tilbud" className="reveal-section relative py-28 md:py-36 px-6 overflow-hidden" style={{ background: '#F5F2EC' }}>
      <div className="relative max-w-5xl mx-auto">
        <div className="reveal flex items-center gap-3 mb-8 justify-center">
          <span className="block w-8 h-px bg-[#1A6B6D]" />
          <span className="font-data text-[10px] uppercase tracking-[0.25em] text-[#1A6B6D]">
            Tilbud
          </span>
          <span className="block w-8 h-px bg-[#1A6B6D]" />
        </div>

        <div className="text-center mb-14">
          <h2 className="reveal font-agentik font-bold text-[clamp(2rem,4.5vw,3.5rem)] text-[#1A1F25] tracking-[-0.025em] leading-[1.05] mb-4">
            Slik jobber vi sammen
          </h2>
          <p className="reveal font-agentik text-[#1A1F25]/60 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Vi tar inn 3 founding-partnere de neste 60 dagene. Etter det går prisen opp.
          </p>
        </div>

        {/* Hero pricing card */}
        <div className="reveal relative bg-white border border-[#1A1F25]/10 rounded-3xl p-8 md:p-12 mb-5 shadow-[0_4px_30px_rgba(26,31,37,0.06)] overflow-hidden">
          {/* Subtle gradient accent */}
          <div
            className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full opacity-10 blur-[80px] pointer-events-none"
            style={{ background: 'radial-gradient(circle, #1A6B6D 0%, transparent 70%)' }}
          />

          <div className="relative grid md:grid-cols-12 gap-8 md:gap-10 items-start">
            {/* Left — name, price, framing */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-data text-[10px] text-[#1A6B6D] uppercase tracking-[0.18em] font-semibold">
                  Hovedtilbud
                </span>
                <span className="bg-[#C4854C]/12 text-[#C4854C] font-data text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.12em]">
                  2 av 3 spots igjen
                </span>
              </div>

              <h3 className="font-agentik font-bold text-[#1A1F25] text-4xl md:text-5xl tracking-[-0.025em] leading-[1.05] mb-5">
                AI-Partner
              </h3>

              <p className="font-agentik text-[#1A1F25]/65 text-base md:text-lg leading-relaxed mb-7">
                Din eksterne AI-avdeling. Fast månedlig rådgiver og bygger som tar AI fra idé til drift.
              </p>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-agentik font-bold text-[#1A1F25] text-5xl md:text-6xl tracking-[-0.03em] tabular-nums">
                  39 000
                </span>
                <span className="font-agentik text-[#1A1F25]/50 text-base">kr/mnd</span>
              </div>
              <p className="font-agentik text-[#1A1F25]/45 text-sm mb-2">
                Founding-pris · låst for alltid
              </p>
              <p className="font-data text-[10px] text-[#1A1F25]/40 uppercase tracking-[0.15em]">
                Etter 3 partnere: 49 000 kr/mnd
              </p>

              <div className="mt-8 pt-6 border-t border-[#1A1F25]/8">
                <p className="font-agentik text-[#1A1F25]/65 text-sm leading-relaxed mb-5">
                  90 dagers Sprint som oppstart, deretter månedlig oppsigelse fra begge parter.
                </p>
                <button
                  onClick={() => scrollTo('contact')}
                  className="btn-magnetic inline-flex rounded-full px-6 py-3.5 text-sm bg-[#C4854C] text-[#F5F2EC] font-heading font-medium tracking-tight"
                >
                  <span className="btn-layer bg-[#1A1F25]"></span>
                  <span className="btn-text flex items-center gap-2">
                    Book mulighetssamtale <ArrowRight size={14} />
                  </span>
                </button>
              </div>
            </div>

            {/* Right — what's included */}
            <div className="md:col-span-7">
              <p className="font-data text-[10px] text-[#1A6B6D] uppercase tracking-[0.18em] mb-5">
                Inkludert hver måned
              </p>
              <ul className="space-y-3.5">
                {includes.map((item, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-3.5 p-4 rounded-xl ${
                      item.featured
                        ? 'bg-gradient-to-br from-[#1A6B6D]/8 to-[#4FC3B0]/4 border border-[#1A6B6D]/15'
                        : ''
                    }`}
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1A6B6D]/12 flex items-center justify-center mt-0.5">
                      <Check size={13} className="text-[#1A6B6D]" strokeWidth={2.5} />
                    </span>
                    <div className="flex-1">
                      <p className="font-agentik font-semibold text-[#1A1F25] text-[14px] tracking-tight mb-0.5">
                        {item.title}
                      </p>
                      <p className="font-agentik text-[#1A1F25]/55 text-[13px] leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Workshop — secondary */}
        <div className="reveal bg-white border border-[#1A1F25]/8 rounded-2xl p-6 md:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex-1">
            <div className="font-data text-[10px] text-[#1A6B6D] uppercase tracking-[0.18em] mb-2">
              Sidetilbud
            </div>
            <h3 className="font-agentik font-bold text-[20px] md:text-[22px] text-[#1A1F25] tracking-tight leading-tight mb-1.5">
              AI Workshop
            </h3>
            <p className="font-agentik text-[13px] md:text-[14px] text-[#1A1F25]/60 leading-relaxed mb-2 max-w-md">
              Praktisk opplæring i AI for ledere eller team. Halvdag eller heldag, hos dere eller hos oss.
            </p>
            <div className="font-data text-[12px] text-[#1A1F25]/70">
              Fra 25 000 kr
            </div>
          </div>

          <button
            onClick={() => scrollTo('contact')}
            className="btn-magnetic inline-flex rounded-full px-5 py-2.5 text-[12px] bg-transparent text-[#1A1F25] border border-[#1A1F25]/20 font-heading font-medium tracking-tight self-start md:self-center whitespace-nowrap"
          >
            <span className="btn-layer bg-[#1A1F25]"></span>
            <span className="btn-text flex items-center gap-2">
              Snakk med oss <ArrowRight size={13} />
            </span>
          </button>
        </div>

        <p className="reveal text-center mt-6 text-[11px] text-[#1A1F25]/40 italic font-agentik">
          Software- og API-kostnader (OpenAI, Slack, etc.) kommer i tillegg og betales direkte av kunden.
        </p>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────
// STICKY CTA — appears after hero is out of viewport
// ─────────────────────────────────────────────────────────────
const StickyCTA = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        // Show after first viewport height (hero is fully past)
        const shouldShow = window.scrollY > window.innerHeight * 0.85;
        // Hide near the contact form so we don't double up
        const contactEl = document.getElementById('contact');
        let nearContact = false;
        if (contactEl) {
          const rect = contactEl.getBoundingClientRect();
          nearContact = rect.top < window.innerHeight * 0.6;
        }
        setVisible(shouldShow && !nearContact);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed bottom-5 left-1/2 z-40 transition-all duration-500 ${
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-6 pointer-events-none'
      }`}
      style={{ transform: `translate3d(-50%, ${visible ? '0' : '24px'}, 0)` }}
    >
      <div className="flex items-center gap-3 md:gap-5 px-4 md:px-5 py-2.5 md:py-3 rounded-full bg-[#1A1F25]/95 backdrop-blur-md border border-[#E8E4DC]/15 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
        <span className="hidden md:inline-flex items-center gap-2 text-[#E8E4DC]/65 text-sm font-agentik tracking-tight pl-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4FC3B0] shadow-[0_0_8px_#4FC3B0]" />
          2 av 3 founding-spots igjen
        </span>
        <button
          onClick={() => scrollTo('contact')}
          className="btn-magnetic rounded-full px-5 md:px-6 py-2.5 text-[13px] md:text-sm bg-[#C4854C] text-[#F5F2EC] font-heading font-medium tracking-tight"
        >
          <span className="btn-layer bg-[#1A1F25]"></span>
          <span className="btn-text flex items-center gap-2">
            Book samtale <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
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
          <LogoStrip />
          <Problem />
          <NewApproach />
          <MetricsStrip />
          <SprintPhases />
          <UseCaseModules />
          <CaseStudy />
          <ValueGuarantee />
          <Comparison />
          <Side2Pricing />
          <WhoItIsFor />
          <FAQ />
          <Proof />
          <Team />
          <ContactForm />
        </main>
        <Footer />
        <StickyCTA />
      </div>
    </>
  );
}
