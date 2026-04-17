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
        className={`font-fraunces font-semibold text-xl tracking-tight transition-colors duration-500 ${
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
// HERO
// ─────────────────────────────────────────────────
const Hero = () => {
  const ref = useRef(null);

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
      style={{
        background: `
          radial-gradient(ellipse at 25% 50%, rgba(26,107,109,0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 75% 20%, rgba(196,133,76,0.04) 0%, transparent 40%),
          radial-gradient(ellipse at 50% 80%, rgba(232,228,220,0.04) 0%, transparent 50%),
          #1A1F25
        `,
      }}
    >
      {/* Faint grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(232,228,220,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,228,220,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 text-center max-w-5xl mx-auto pt-24">
        <p className="ny-h font-data text-[11px] uppercase tracking-[0.35em] text-[#E8E4DC]/35 mb-10">
          AI-rådgivning for norske selskaper
        </p>

        <h1 className="ny-h mb-10">
          <span className="block font-fraunces text-[clamp(2.4rem,7vw,5.5rem)] text-[#E8E4DC] tracking-[-0.02em] leading-[1.05]">
            Få konkrete AI-resultater
          </span>
          <span className="block font-fraunces text-[clamp(2.4rem,7vw,5.5rem)] text-[#E8E4DC] tracking-[-0.02em] leading-[1.05]">
            i din bedrift
          </span>
          <span className="block font-fraunces italic text-[clamp(2.4rem,7vw,5.5rem)] text-[#C4854C] tracking-[-0.02em] leading-[1.05] mt-1">
            — på 30 dager
          </span>
        </h1>

        <p className="ny-h font-sans text-[#E8E4DC]/50 text-base md:text-lg max-w-xl mx-auto mb-12 leading-relaxed tracking-tight">
          Vi hjelper selskaper med å identifisere og implementere AI-løsninger
          som sparer tid, kutter kostnader og skaper vekst.
        </p>

        <div className="ny-h">
          <button
            onClick={() => scrollTo('contact')}
            className="btn-magnetic rounded-full px-8 py-4 text-base bg-[#C4854C] text-[#F5F2EC] font-heading font-medium tracking-tight"
          >
            <span className="btn-layer bg-[#1A1F25]"></span>
            <span className="btn-text flex items-center gap-3">
              Book en gratis introduksjonssamtale <ArrowRight size={18} />
            </span>
          </button>
        </div>
      </div>
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
        <h2 className="reveal font-fraunces text-[clamp(1.8rem,4vw,3rem)] text-[#1A1F25] tracking-tight leading-[1.1] mb-8">
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

        <p className="reveal font-fraunces italic text-xl md:text-2xl text-[#1A1F25]/80 tracking-tight">
          Resultatet? Lite effekt — og bortkastet tid.
        </p>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────
// SOLUTION
// ─────────────────────────────────────────────────
const Solution = () => (
  <section className="reveal-section py-24 md:py-32 px-6" style={{ background: '#1A1F25' }}>
    <div className="max-w-4xl mx-auto">
      <div className="reveal w-12 h-0.5 bg-[#1A6B6D] mb-8" />
      <h2 className="reveal font-fraunces text-[clamp(1.8rem,4vw,3rem)] text-[#E8E4DC] tracking-tight leading-[1.1] mb-8">
        Vi finner de mest lønnsomme
        <br className="hidden md:block" /> AI-mulighetene for deg
      </h2>
      <p className="reveal font-sans text-[#E8E4DC]/55 text-base md:text-lg max-w-2xl leading-relaxed">
        Gjennom vår{' '}
        <span className="text-[#1A6B6D] font-medium">AI Opportunity Audit</span>{' '}
        analyserer vi hvordan din bedrift jobber i dag, og identifiserer hvor AI
        kan skape størst verdi — raskest mulig.
      </p>
    </div>
  </section>
);

// ─────────────────────────────────────────────────
// DELIVERABLES
// ─────────────────────────────────────────────────
const Deliverables = () => {
  const items = [
    {
      title: 'Kartlegging av arbeidsprosesser',
      desc: 'Vi mapper hele verdikjeden og finner flaskehalsene.',
    },
    {
      title: '3–5 konkrete AI-muligheter',
      desc: 'Prioritert etter ROI og implementeringskompleksitet.',
    },
    {
      title: 'Estimert tids- og kostnadsbesparelse',
      desc: 'Tallgrunnlag du kan ta med inn i ledergruppen.',
    },
    {
      title: 'Handlingsplan for implementering',
      desc: 'Steg-for-steg — fra pilot til produksjon.',
    },
  ];

  return (
    <section className="reveal-section bg-[#F5F2EC] py-24 md:py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="reveal w-12 h-0.5 bg-[#1A6B6D] mb-8" />
        <h2 className="reveal font-fraunces text-[clamp(1.8rem,4vw,3rem)] text-[#1A1F25] tracking-tight leading-[1.1] mb-16">
          Dette får du i en AI Audit
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          {items.map((item, i) => (
            <div key={i} className="reveal flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1A6B6D]/10 flex items-center justify-center mt-0.5">
                <Check size={16} className="text-[#1A6B6D]" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-[#1A1F25] text-base md:text-lg tracking-tight mb-1">
                  {item.title}
                </h3>
                <p className="font-sans text-[#1A1F25]/50 text-sm leading-relaxed">{item.desc}</p>
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
        <h2 className="reveal font-fraunces text-[clamp(1.8rem,4vw,3rem)] text-[#1A1F25] tracking-tight leading-[1.1] mb-6">
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
          <p className="font-fraunces italic text-lg md:text-xl text-[#1A1F25]/60 leading-relaxed">
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
        <h2 className="reveal font-fraunces text-[clamp(1.8rem,4vw,3rem)] text-[#1A1F25] tracking-tight leading-[1.1] mb-6">
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
          <p className="font-fraunces italic text-lg md:text-xl text-[#1A1F25]/75 tracking-tight mb-8 max-w-lg">
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
        <h2 className="reveal font-fraunces text-[clamp(1.8rem,4vw,3rem)] text-[#1A1F25] tracking-tight leading-[1.1] mb-16">
          Slik fungerer det
        </h2>

        <div className="grid md:grid-cols-3 gap-10 md:gap-12">
          {steps.map((step) => (
            <div key={step.num} className="reveal">
              <span className="block font-fraunces text-7xl md:text-8xl text-[#1A6B6D]/15 leading-none mb-4 select-none">
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
      <h2 className="reveal font-fraunces text-[clamp(1.6rem,3.5vw,2.5rem)] text-[#1A1F25] tracking-tight leading-[1.1] mb-6">
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
// FINAL CTA
// ─────────────────────────────────────────────────
const FinalCTA = () => (
  <section id="contact" className="reveal-section py-28 md:py-36 px-6" style={{ background: '#1A1F25' }}>
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="reveal font-fraunces text-[clamp(1.8rem,4.5vw,3.2rem)] text-[#E8E4DC] tracking-tight leading-[1.1] mb-10">
        Klar for å finne deres
        <br /> AI-muligheter?
      </h2>

      <div className="reveal mb-8">
        {/* TODO: Replace with actual booking URL (e.g. Cal.com link) */}
        <button
          onClick={() => scrollTo('contact')}
          className="btn-magnetic rounded-full px-10 py-5 text-base md:text-lg bg-[#C4854C] text-[#F5F2EC] font-heading font-medium tracking-tight"
        >
          <span className="btn-layer bg-[#E8E4DC]"></span>
          <span className="btn-text flex items-center gap-3">
            Book en gratis samtale <ArrowRight size={20} />
          </span>
        </button>
      </div>

      <p className="reveal font-data text-[11px] text-[#E8E4DC]/25 tracking-[0.15em] uppercase">
        Kun et begrenset antall selskaper tas inn hver måned
      </p>
    </div>
  </section>
);

// ─────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────
const Footer = () => (
  <footer className="border-t border-[#E8E4DC]/8 py-12 px-6" style={{ background: '#1A1F25' }}>
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <span className="font-fraunces font-semibold text-[#E8E4DC]/30 tracking-tight">Tinde</span>
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
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&display=swap"
          rel="stylesheet"
        />
        <style>{`.font-fraunces{font-family:'Fraunces',serif}`}</style>
      </Helmet>

      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Deliverables />
        <Proof />
        <Workshops />
        <Process />
        <RiskReversal />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
};
