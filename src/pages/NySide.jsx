import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Check, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ─── Tinde palette ──────────────────────────────
// Dark:   #1A1F25  (deep slate)
// Cream:  #F5F2EC  (warm off-white — backgrounds)
// Paper:  #E8E4DC  (warm cream — text on dark, surfaces)
// Petrol: #1A6B6D  (deep teal — primary brand accent)
// Copper: #C4854C  (warm amber — CTAs & action color)
// ─────────────────────────────────────────────────

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

// ─────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl rounded-full transition-all duration-500 flex items-center justify-between px-6 py-3 ${
        scrolled
          ? 'bg-[#F5F2EC]/80 backdrop-blur-xl border border-[#1A1F25]/10 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <a
        href="/nyside"
        className={`font-tinde font-semibold text-xl tracking-tight transition-colors duration-500 ${
          scrolled ? 'text-[#1A1F25]' : 'text-[#E8E4DC]'
        }`}
      >
        Tinde
      </a>

      <div
        className={`hidden md:flex items-center gap-8 text-sm font-medium tracking-tight ${
          scrolled ? 'text-[#1A1F25]' : 'text-[#E8E4DC]/70'
        }`}
      >
        <button onClick={() => scrollTo('problem')} className="link-hover cursor-pointer bg-transparent border-none">
          Utfordringen
        </button>
        <button onClick={() => scrollTo('process')} className="link-hover cursor-pointer bg-transparent border-none">
          Prosess
        </button>
        <button onClick={() => scrollTo('proof')} className="link-hover cursor-pointer bg-transparent border-none">
          Resultater
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

// ─────────────────────────────────────────────────
// HERO — story-based with rotating words
// ─────────────────────────────────────────────────
const ROTATE_WORDS = [
  'Rapportering',
  'Kundesupport',
  'HR',
  'Fakturering',
  'Onboarding',
  'Markedsføring',
  'Regnskap',
];

const Hero = () => {
  const ref = useRef(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Rotate words every 2.5s — simple fade up
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % ROTATE_WORDS.length);
        setAnimating(false);
      }, 400);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Entrance animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.ny-h', {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 1.3,
        ease: 'power3.out',
        delay: 0.3,
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-[100dvh] w-full overflow-hidden flex items-center justify-center px-6"
      style={{ background: '#1A1F25' }}
    >
      {/* Ambient glow — petrol */}
      <div
        className="absolute w-[800px] h-[800px] top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[120px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(26,107,109,0.4) 0%, transparent 70%)' }}
      />
      {/* Ambient glow — copper */}
      <div
        className="absolute w-[600px] h-[600px] top-1/3 right-0 translate-x-1/4 -translate-y-1/4 rounded-full opacity-20 blur-[100px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(196,133,76,0.35) 0%, transparent 70%)' }}
      />

      {/* Faint grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(232,228,220,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,228,220,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 text-center max-w-4xl mx-auto pt-24">
        <p className="ny-h font-data text-[11px] uppercase tracking-[0.35em] text-[#E8E4DC]/40 mb-14">
          AI-rådgivning for norske selskaper
        </p>

        <h1 className="ny-h mb-6">
          <span className="block mb-2 h-[1.4em] overflow-hidden" style={{ fontSize: 'clamp(2.2rem,5.5vw,4.2rem)' }}>
            <span
              className="inline-block font-tinde font-bold text-[#C4854C] tracking-[-0.02em] leading-[1.4] pb-1"
              style={{
                opacity: animating ? 0 : 1,
                transform: animating ? 'translateY(-12px)' : 'translateY(0)',
                transition: 'opacity 0.4s ease, transform 0.4s ease',
                fontSize: 'inherit',
              }}
            >
              {ROTATE_WORDS[wordIndex]}
            </span>
          </span>
          <span className="block font-tinde font-bold text-[clamp(2.2rem,5.5vw,4.2rem)] text-[#E8E4DC] tracking-[-0.02em] leading-[1.12]">
            burde kunne automatiseres.
          </span>
        </h1>

        <p className="ny-h font-tinde font-bold text-[clamp(1.6rem,3.5vw,2.4rem)] text-[#C4854C] tracking-tight mb-8">
          Det kan det.
        </p>

        <div className="ny-h flex flex-col items-center gap-6 mt-12">
          <button
            onClick={() => scrollTo('contact')}
            className="btn-magnetic rounded-full px-8 py-4 text-base bg-[#C4854C] text-[#F5F2EC] font-heading font-medium tracking-tight"
          >
            <span className="btn-layer bg-[#1A1F25]"></span>
            <span className="btn-text flex items-center gap-3">
              Book en gratis introduksjonssamtale <ArrowRight size={18} />
            </span>
          </button>
          <p className="text-[#E8E4DC]/25 text-xs tracking-wide">
            Brukt av Morrow, Gard, Å Energi og flere
          </p>
        </div>
      </div>

      {/* Bottom gradient transition */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#F5F2EC] to-transparent" />
    </section>
  );
};

// ─────────────────────────────────────────────────
// PROBLEM
// ─────────────────────────────────────────────────
const Problem = () => {
  const painPoints = [
    'Vet ikke hvilke prosesser som faktisk bør automatiseres',
    'Bruker tid på feil verktøy',
    'Mangler en klar plan for implementering',
  ];

  return (
    <section id="problem" className="reveal-section bg-[#F5F2EC] py-24 md:py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="reveal w-12 h-0.5 bg-[#1A6B6D] mb-8" />
        <h2 className="reveal font-tinde text-[clamp(1.8rem,4vw,3rem)] text-[#1A1F25] tracking-tight leading-[1.1] mb-8">
          AI er overalt — men hvor
          <br className="hidden md:block" /> starter du egentlig?
        </h2>

        <p className="reveal font-sans text-[#1A1F25]/60 text-base md:text-lg max-w-2xl mb-12 leading-relaxed">
          De fleste selskaper vet at AI er viktig, men:
        </p>

        <div className="space-y-5 mb-14">
          {painPoints.map((point, i) => (
            <div key={i} className="reveal flex items-start gap-4 pl-5 border-l-2 border-[#1A1F25]/15">
              <X size={18} className="text-[#1A1F25]/35 mt-1 flex-shrink-0" strokeWidth={2.5} />
              <p className="font-sans text-[#1A1F25]/75 text-base md:text-lg leading-relaxed">{point}</p>
            </div>
          ))}
        </div>

        <p className="reveal font-tinde italic text-xl md:text-2xl text-[#1A1F25]/80 tracking-tight">
          Resultatet? Lite effekt — og bortkastet tid.
        </p>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────
// GRAPH — the drop in manual work
// ─────────────────────────────────────────────────
const GraphSection = () => {
  const pathRef = useRef(null);
  const fillRef = useRef(null);
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const path = pathRef.current;
    const fill = fillRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          once: true,
        },
      });

      tl.to(path, {
        strokeDashoffset: 0,
        duration: 2.2,
        ease: 'power2.inOut',
      });

      tl.from(fill, {
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
      }, '-=1');

      tl.from('.graph-text', {
        y: 20,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.6');
    });
    return () => ctx.revert();
  }, []);

  const linePath = 'M 0,38 C 120,38 220,38 300,38 C 370,38 410,180 490,184 C 540,186 700,186 800,186';
  const areaPath = linePath + ' L 800,220 L 0,220 Z';

  return (
    <section ref={sectionRef} className="py-20 md:py-28 px-6" style={{ background: '#1A1F25' }}>
      <div className="max-w-3xl mx-auto">
        {/* Graph */}
        <div className="relative mb-12">
          <svg viewBox="0 0 800 220" className="w-full h-auto" preserveAspectRatio="none">
            {/* Faint horizontal grid lines */}
            <line x1="0" y1="38" x2="800" y2="38" stroke="#E8E4DC" strokeWidth="1" opacity="0.06" />
            <line x1="0" y1="112" x2="800" y2="112" stroke="#E8E4DC" strokeWidth="1" opacity="0.04" />
            <line x1="0" y1="186" x2="800" y2="186" stroke="#E8E4DC" strokeWidth="1" opacity="0.06" />

            {/* Area fill */}
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C4854C" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#C4854C" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <path ref={fillRef} d={areaPath} fill="url(#areaGrad)" />

            {/* The line */}
            <path
              ref={pathRef}
              d={linePath}
              stroke="#C4854C"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />

            {/* Dot at inflection point */}
            <circle cx="300" cy="38" r="5" fill="#C4854C" opacity="0.6" />
          </svg>

          {/* Y-axis labels */}
          <span className="absolute left-0 top-[14%] text-[10px] font-data text-[#E8E4DC]/20 -translate-x-full pr-3 hidden md:block">
            Manuelt
          </span>
          <span className="absolute left-0 bottom-[10%] text-[10px] font-data text-[#E8E4DC]/20 -translate-x-full pr-3 hidden md:block">
            Automatisert
          </span>
        </div>

        {/* Text */}
        <div className="text-center">
          <p className="graph-text font-tinde font-bold text-xl md:text-2xl text-[#E8E4DC] tracking-tight mb-4">
            Behovet for manuelt arbeid har gått ned dramatisk
          </p>
          <p className="graph-text text-[#C4854C]/70 text-base md:text-lg">
            Visste du at du kan automatisere opptil 80% av arbeidshverdagen med AI?
          </p>
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────
// URGENCY — the cost of waiting
// ─────────────────────────────────────────────────
const Urgency = () => {
  const areas = [
    {
      name: 'Support',
      items: [
        'Automatisk besvarelse 24/7 med agent som kjenner bedriften',
        'Morgenrapport og ferdige e-post-drafts klar for dagen',
      ],
    },
    {
      name: 'Markedsføring',
      items: [
        'Automatisk research og content creation',
        'Automatisk posting, overvåking og respondering',
        'Automatisk ads-optimalisering på tvers av plattformer',
      ],
    },
    {
      name: 'HR & Onboarding',
      items: [
        'Automatisk screening og rangering av kandidater',
        'Onboarding-flyt som tilpasser seg hver ny ansatt',
      ],
    },
    {
      name: 'Rapportering',
      items: [
        'Dashboards som oppdaterer seg selv',
        'Ukentlige oppsummeringer generert og sendt automatisk',
      ],
    },
  ];

  return (
    <section className="reveal-section py-24 md:py-32 px-6" style={{ background: '#E8E4DC' }}>
      <div className="max-w-4xl mx-auto">
        <div className="reveal w-12 h-0.5 bg-[#C4854C] mb-8" />
        <h2 className="reveal font-tinde font-bold text-[clamp(1.8rem,4vw,3rem)] text-[#1A1F25] tracking-tight leading-[1.1] mb-4">
          Konkurrentene dine har allerede begynt
        </h2>
        <p className="reveal text-[#1A1F25]/55 text-base md:text-lg mb-14 max-w-2xl leading-relaxed">
          Bare fantasien setter grenser for hva som kan automatiseres.
        </p>

        <div className="grid md:grid-cols-2 gap-8 md:gap-10 mb-14">
          {areas.map((area) => (
            <div key={area.name} className="reveal">
              <h3 className="font-tinde font-bold text-[#1A1F25] text-base md:text-lg tracking-tight mb-3">
                {area.name}
              </h3>
              <ul className="space-y-2.5">
                {area.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="block w-1 h-1 rounded-full bg-[#C4854C] mt-2.5 flex-shrink-0" />
                    <span className="text-[#1A1F25]/65 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="reveal font-tinde italic text-lg md:text-xl text-[#1A1F25]/70 tracking-tight max-w-lg">
          Spørsmålet er ikke om du skal bruke AI. Det er om du skal være først — eller sist.
        </p>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────
// OUTCOMES — what the client walks away with
// ─────────────────────────────────────────────────
const Outcomes = () => {
  const outcomes = [
    {
      title: 'Vet nøyaktig hvor AI gir mest verdi',
      desc: 'Ikke gjetning — en prioritert liste over de 3–5 mulighetene med høyest ROI i din bedrift.',
    },
    {
      title: 'Har tallene du trenger for ledelsen',
      desc: 'Estimert besparelse i timer og kroner, klar til å presenteres i ledergruppen.',
    },
    {
      title: 'Kan starte allerede neste uke',
      desc: 'En konkret handlingsplan med tydelige steg — fra pilot til produksjon.',
    },
    {
      title: 'Slipper å bruke måneder på research',
      desc: 'Vi har gjort det før. Du får svaret på 30 dager, ikke 6 måneder med prøving og feiling.',
    },
  ];

  return (
    <section className="reveal-section py-24 md:py-32 px-6" style={{ background: '#1A1F25' }}>
      <div className="max-w-4xl mx-auto">
        <div className="reveal w-12 h-0.5 bg-[#1A6B6D] mb-8" />
        <h2 className="reveal font-tinde font-bold text-[clamp(1.8rem,4vw,3rem)] text-[#E8E4DC] tracking-tight leading-[1.1] mb-4">
          Etter 30 dager sitter du igjen med dette
        </h2>
        <p className="reveal text-[#E8E4DC]/45 text-base md:text-lg max-w-2xl mb-16 leading-relaxed">
          Vi kaller det en{' '}
          <span className="text-[#1A6B6D] font-medium">AI Opportunity Audit</span>.
          {' '}Du kaller det klarhet.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {outcomes.map((item, i) => (
            <div key={i} className="reveal flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1A6B6D]/15 flex items-center justify-center mt-0.5">
                <Check size={16} className="text-[#1A6B6D]" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-semibold text-[#E8E4DC] text-base md:text-lg tracking-tight mb-1">
                  {item.title}
                </h3>
                <p className="text-[#E8E4DC]/40 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────
// PROOF
// ─────────────────────────────────────────────────
const Proof = () => {
  const companies = ['Morrow', 'Gard', 'Å Energi', 'Blatchford Mobility'];

  return (
    <section id="proof" className="reveal-section py-24 md:py-32 px-6" style={{ background: '#E8E4DC' }}>
      <div className="max-w-4xl mx-auto text-center">
        <p className="reveal font-data text-[11px] uppercase tracking-[0.3em] text-[#1A1F25]/30 mb-6">
          Sosial proof
        </p>
        <h2 className="reveal font-tinde text-[clamp(1.8rem,4vw,3rem)] text-[#1A1F25] tracking-tight leading-[1.1] mb-6">
          Allerede brukt av selskaper i Norge
        </h2>
        <p className="reveal font-sans text-[#1A1F25]/55 text-base md:text-lg max-w-2xl mx-auto mb-16 leading-relaxed">
          Vi har gjennomført workshops for deltakere fra blant annet:
        </p>

        <div className="reveal flex flex-wrap justify-center gap-4 md:gap-5 mb-16">
          {companies.map((name) => (
            <div
              key={name}
              className="px-6 py-3 rounded-full border border-[#1A1F25]/12 bg-[#F5F2EC]/60 backdrop-blur-sm"
            >
              <span className="font-heading font-semibold text-[#1A1F25] text-sm md:text-base tracking-tight">
                {name}
              </span>
            </div>
          ))}
          <div className="px-6 py-3 rounded-full border border-[#1A1F25]/8 bg-[#F5F2EC]/30">
            <span className="font-sans text-[#1A1F25]/35 text-sm md:text-base">+ flere</span>
          </div>
        </div>

        <div className="reveal max-w-lg mx-auto">
          <p className="font-tinde italic text-lg md:text-xl text-[#1A1F25]/60 leading-relaxed">
            Ekstremt positive tilbakemeldinger — og flere har allerede gått videre
            til konkrete AI-prosjekter med oss.
          </p>
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────
// WORKSHOPS (trust-builder → funnels back to audit)
// ─────────────────────────────────────────────────
const Workshops = () => {
  const workshops = [
    'Intro til Claude',
    'Claude Cowork — hands-on bruk i team',
    'Claude Code — for utviklere',
  ];

  return (
    <section className="reveal-section bg-[#F5F2EC] py-24 md:py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="reveal w-12 h-0.5 bg-[#1A6B6D] mb-8" />
        <h2 className="reveal font-tinde text-[clamp(1.8rem,4vw,3rem)] text-[#1A1F25] tracking-tight leading-[1.1] mb-6">
          Vi trener også team i praktisk bruk av AI
        </h2>
        <p className="reveal font-sans text-[#1A1F25]/60 text-base md:text-lg max-w-2xl mb-10 leading-relaxed">
          I tillegg til å hjelpe selskaper med implementering, holder vi kurs og
          workshops i hvordan AI-verktøy faktisk brukes i arbeidshverdagen.
        </p>

        <p className="reveal font-sans text-[#1A1F25]/50 text-sm mb-5 tracking-tight">
          Vi har blant annet gjennomført:
        </p>

        <div className="space-y-4 mb-12">
          {workshops.map((name) => (
            <div key={name} className="reveal flex items-center gap-3 pl-5 border-l-2 border-[#1A6B6D]/20">
              <span className="font-heading font-semibold text-[#1A1F25] text-base md:text-lg tracking-tight">
                {name}
              </span>
            </div>
          ))}
        </div>

        <p className="reveal font-sans text-[#1A1F25]/50 text-sm mb-14 leading-relaxed max-w-xl">
          Våre workshops har samlet deltakere fra selskaper som Morrow, Gard,
          Å Energi og flere.
        </p>

        {/* Bridge line → funnels to audit */}
        <div className="reveal border-t border-[#1A1F25]/8 pt-10">
          <p className="font-tinde italic text-lg md:text-xl text-[#1A1F25]/75 tracking-tight mb-8 max-w-lg">
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
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────
// PROCESS
// ─────────────────────────────────────────────────
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

  return (
    <section id="process" className="reveal-section bg-[#F5F2EC] py-24 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="reveal w-12 h-0.5 bg-[#1A6B6D] mb-8" />
        <h2 className="reveal font-tinde text-[clamp(1.8rem,4vw,3rem)] text-[#1A1F25] tracking-tight leading-[1.1] mb-16">
          Slik fungerer det
        </h2>

        <div className="grid md:grid-cols-3 gap-10 md:gap-12">
          {steps.map((step) => (
            <div key={step.num} className="reveal">
              <span className="block font-tinde text-7xl md:text-8xl text-[#1A6B6D]/15 leading-none mb-4 select-none">
                {step.num}
              </span>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="font-heading font-bold text-[#1A1F25] text-lg md:text-xl tracking-tight">
                  {step.title}
                </h3>
                {step.tag && (
                  <span className="font-data text-[10px] uppercase tracking-[0.15em] text-[#1A6B6D] bg-[#1A6B6D]/10 px-2.5 py-1 rounded-full">
                    {step.tag}
                  </span>
                )}
              </div>
              <p className="font-sans text-[#1A1F25]/50 text-sm md:text-base leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────
// RISK REVERSAL
// ─────────────────────────────────────────────────
const RiskReversal = () => (
  <section className="reveal-section py-20 md:py-24 px-6 border-t border-[#1A1F25]/8" style={{ background: '#F5F2EC' }}>
    <div className="max-w-3xl mx-auto text-center">
      <div className="reveal w-12 h-0.5 bg-[#1A6B6D] mx-auto mb-8" />
      <h2 className="reveal font-tinde text-[clamp(1.6rem,3.5vw,2.5rem)] text-[#1A1F25] tracking-tight leading-[1.1] mb-6">
        Lav risiko — høy oppside
      </h2>
      <p className="reveal font-sans text-[#1A1F25]/55 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
        Investeringen i en AI Audit trekkes fra dersom dere velger å gå videre
        med implementering sammen med oss.
      </p>
    </div>
  </section>
);

// ─────────────────────────────────────────────────
// CONTACT FORM
// ─────────────────────────────────────────────────
const ContactForm = () => {
  const [form, setForm] = useState({ fornavn: '', bedrift: '', telefon: '', epost: '', maal: '' });
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'sent' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/tinde-contact', {
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
          <h2 className="font-tinde font-bold text-2xl text-[#E8E4DC] tracking-tight mb-3">
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
    <section id="contact" className="reveal-section py-28 md:py-36 px-6" style={{ background: '#1A1F25' }}>
      <div className="max-w-lg mx-auto">
        <h2 className="reveal font-tinde font-bold text-[clamp(1.8rem,4.5vw,3.2rem)] text-[#E8E4DC] tracking-tight leading-[1.1] mb-3 text-center">
          Klar for å finne deres
          <br /> AI-muligheter?
        </h2>
        <p className="reveal text-[#E8E4DC]/35 text-sm text-center mb-10">
          Kun et begrenset antall selskaper tas inn hver måned
        </p>

        <form onSubmit={handleSubmit} className="reveal space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Fornavn"
              required
              value={form.fornavn}
              onChange={(e) => setForm({ ...form, fornavn: e.target.value })}
              className={inputClass}
            />
            <input
              type="text"
              placeholder="Bedrift"
              required
              value={form.bedrift}
              onChange={(e) => setForm({ ...form, bedrift: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="email"
              placeholder="E-post"
              required
              value={form.epost}
              onChange={(e) => setForm({ ...form, epost: e.target.value })}
              className={inputClass}
            />
            <input
              type="tel"
              placeholder="Telefon (valgfritt)"
              value={form.telefon}
              onChange={(e) => setForm({ ...form, telefon: e.target.value })}
              className={inputClass}
            />
          </div>
          <textarea
            placeholder="Målet med henvendelsen (valgfritt)"
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
              {status === 'sending' ? 'Sender...' : 'Book en gratis samtale'}
              {status !== 'sending' && <ArrowRight size={18} />}
            </span>
          </button>

          {status === 'error' && (
            <p className="text-red-400 text-sm text-center">
              Noe gikk galt. Prøv igjen eller send en e-post direkte.
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────
const Footer = () => (
  <footer className="border-t border-[#E8E4DC]/8 py-12 px-6" style={{ background: '#1A1F25' }}>
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <span className="font-tinde font-semibold text-[#E8E4DC]/30 tracking-tight">Tinde</span>
      <p className="font-sans text-[#E8E4DC]/20 text-sm">
        &copy; {new Date().getFullYear()} Tinde. Alle rettigheter forbeholdt.
      </p>
    </div>
  </footer>
);

// ─────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────
export const NySide = () => {
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
        <title>Tinde | AI-rådgivning som gir konkrete resultater</title>
        <meta
          name="description"
          content="Vi hjelper norske selskaper med å identifisere og implementere AI-løsninger. Konkrete resultater på 30 dager."
        />
        <meta property="og:title" content="Tinde | AI-rådgivning som gir konkrete resultater" />
        <meta
          property="og:description"
          content="Vi hjelper norske selskaper med å identifisere og implementere AI-løsninger. Konkrete resultater på 30 dager."
        />
        <meta property="og:locale" content="nb_NO" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
          rel="stylesheet"
        />
        <style>{`
          .font-tinde{font-family:'Plus Jakarta Sans',sans-serif}
          .tinde-page,.tinde-page .font-heading,.tinde-page .font-sans{font-family:'Plus Jakarta Sans',sans-serif}
        `}</style>
      </Helmet>

      <div className="tinde-page">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <GraphSection />
        <Urgency />
        <Outcomes />
        <Proof />
        <Workshops />
        <Process />
        <RiskReversal />
        <ContactForm />
      </main>
      <Footer />
      </div>
    </>
  );
};
