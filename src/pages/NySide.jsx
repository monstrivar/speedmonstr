import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Check, Phone, Mail, Zap, FileText, Mic, BarChart3, ChevronDown } from 'lucide-react';
import { PricingSection } from '../components/PricingSection.jsx';

gsap.registerPlugin(ScrollTrigger);

// ─── Agentik palette ────────────────────────────
// Two-accent system: teal = brand / system / "live agent" signal,
// copper = CTA / conversion / "do this" moments only.
//
// Dark:   #1A1F25  (deep slate)
// Cream:  #F5F2EC  (warm off-white — backgrounds)
// Paper:  #E8E4DC  (warm cream — text on dark, surfaces)
// Petrol: #1A6B6D  (deep teal — brand accent on LIGHT backgrounds)
// Signal: #4FC3B0  (bright teal — brand accent on DARK backgrounds, "live")
// Copper: #C4854C  (warm amber — CTAs & conversion only, used sparingly)
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
    let ticking = false;
    let lastScrolled = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const next = window.scrollY > 60;
        if (next !== lastScrolled) {
          lastScrolled = next;
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
        href="/"
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
        <button onClick={() => scrollTo('agents')} className="link-hover cursor-pointer bg-transparent border-none">
          Agenter
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
      className="relative h-[100dvh] w-full overflow-hidden flex items-center justify-center px-6"
      style={{ background: '#1A1F25', contain: 'paint' }}
    >
      {/* Background video — heavy blur keeps it ambient, not distracting */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none scale-110"
        style={{ filter: 'blur(24px) saturate(1.1)' }}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/hero-bg.jpg"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Dark vignette so text stays legible over the video */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(26,31,37,0.45) 0%, rgba(26,31,37,0.78) 70%, #1A1F25 100%)',
        }}
      />

      {/* Ambient glow — petrol */}
      <div
        className="absolute w-[800px] h-[800px] top-1/2 left-1/4 rounded-full opacity-30 blur-[120px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(26,107,109,0.4) 0%, transparent 70%)',
          transform: 'translate3d(-50%, -50%, 0)',
          willChange: 'transform',
        }}
      />
      {/* Ambient glow — copper */}
      <div
        className="absolute w-[600px] h-[600px] top-1/3 right-0 rounded-full opacity-20 blur-[100px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(196,133,76,0.35) 0%, transparent 70%)',
          transform: 'translate3d(25%, -25%, 0)',
          willChange: 'transform',
        }}
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
              className="inline-block font-agentik font-bold text-[#C4854C] tracking-[-0.02em] leading-[1.4] pb-1"
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
          <span className="block font-agentik font-bold text-[clamp(2.2rem,5.5vw,4.2rem)] text-[#E8E4DC] tracking-[-0.02em] leading-[1.12]">
            burde kunne automatiseres.
          </span>
        </h1>

        <p className="ny-h font-agentik font-bold text-[clamp(1.6rem,3.5vw,2.4rem)] text-[#C4854C] tracking-tight mb-8">
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
            Brukt av Droptech, Brainwaves, SalesUp og flere
          </p>
        </div>
      </div>

      {/* Scroll prompt */}
      <button
        onClick={() => scrollTo('agents')}
        aria-label="Bla til agentene"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-[#E8E4DC]/40 hover:text-[#E8E4DC]/80 transition-colors duration-300"
      >
        <span className="font-data text-[10px] uppercase tracking-[0.3em]">Bla ned</span>
        <ChevronDown size={18} className="animate-bounce" />
      </button>

      {/* Bottom gradient transition into next section (dark agents section, so very subtle) */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0E1114] to-transparent pointer-events-none" />
    </section>
  );
};

// ─────────────────────────────────────────────────
// LIVE AGENTS — rotating showcase of agents in production
// ─────────────────────────────────────────────────
const AGENTS = [
  {
    name: 'Stemme-agent',
    role: 'Telefon-resepsjonist',
    Icon: Phone,
    metrics: [
      { label: 'Samtaler besvart (30 dager)', value: '1 247', unit: '' },
      { label: 'Snitt-tid før svar', value: '2.1', unit: 's' },
      { label: 'Møter booket', value: '89', unit: '' },
      { label: 'Timer spart', value: '143', unit: 't' },
    ],
    terminal: [
      { type: 'cmd', text: '$ agentik init voice-receptionist' },
      { type: 'dim', text: '→ Trener på 200 historiske samtaler...' },
      { type: 'dim', text: '→ Klone stemme + tone-of-voice...' },
      { type: 'dim', text: '→ Kobler til SIP-trunk...' },
      { type: 'ok', text: '✓ Live på +47 22 XX XX XX' },
      { type: 'accent', text: '◆ Booker møter 24/7. Ingen tapte anrop.' },
    ],
  },
  {
    name: 'E-post Support Agent',
    role: 'Inbox-triage',
    Icon: Mail,
    metrics: [
      { label: 'Behandlet (30 dager)', value: '12 892', unit: '' },
      { label: 'Snitt-respons', value: '43', unit: 's' },
      { label: 'Eskalert til menneske', value: '4.2', unit: '%' },
      { label: 'Timer spart', value: '287', unit: 't' },
    ],
    terminal: [
      { type: 'cmd', text: '$ agentik init email-support' },
      { type: 'dim', text: '→ Indekserer 14 230 historiske svar...' },
      { type: 'dim', text: '→ Bygger response-templates...' },
      { type: 'dim', text: '→ Kobler til support@selskap.no...' },
      { type: 'ok', text: '✓ Treffsikkerhet: 95.8%' },
      { type: 'accent', text: '◆ Svarer kunder mens du sover.' },
    ],
  },
  {
    name: 'Lead Response Agent',
    role: 'Speed-to-lead',
    Icon: Zap,
    metrics: [
      { label: 'Leads behandlet', value: '3 421', unit: '' },
      { label: 'Snitt-respons', value: '47', unit: 's' },
      { label: 'Booket møte (av besvart)', value: '38', unit: '%' },
      { label: 'Estimert økt omsetning', value: '2.4', unit: 'M kr' },
    ],
    terminal: [
      { type: 'cmd', text: '$ agentik init speed-to-lead' },
      { type: 'dim', text: '→ Kobler til kontakt-skjema + HubSpot...' },
      { type: 'dim', text: '→ Skriver SMS + e-post-templates...' },
      { type: 'dim', text: '→ Setter opp eskaleringslogikk...' },
      { type: 'ok', text: '✓ Leveringsrate: 99.1%' },
      { type: 'accent', text: '◆ Konvertering opp 21x på 5-min-svar.' },
    ],
  },
  {
    name: 'Faktura-agent',
    role: 'Bokføring',
    Icon: FileText,
    metrics: [
      { label: 'Fakturaer prosessert', value: '8 540', unit: '' },
      { label: 'Treffsikkerhet', value: '98.4', unit: '%' },
      { label: 'Krever manuell sjekk', value: '1.6', unit: '%' },
      { label: 'Timer spart', value: '192', unit: 't' },
    ],
    terminal: [
      { type: 'cmd', text: '$ agentik init invoice-sorter' },
      { type: 'dim', text: '→ Analyserer 1 240 historiske fakturaer...' },
      { type: 'dim', text: '→ Bygger klassifiseringsmodell...' },
      { type: 'dim', text: '→ Kobler mot Tripletex + Visma...' },
      { type: 'ok', text: '✓ Live i bokføringen' },
      { type: 'accent', text: '◆ ROI estimert: 340%' },
    ],
  },
  {
    name: 'Møtenotat-agent',
    role: 'CRM-oppdatering',
    Icon: Mic,
    metrics: [
      { label: 'Møter transkribert', value: '412', unit: '' },
      { label: 'Action items hentet', value: '1 287', unit: '' },
      { label: 'CRM-oppdateringer', value: '412', unit: '' },
      { label: 'Møter uten oppfølging', value: '0', unit: '' },
    ],
    terminal: [
      { type: 'cmd', text: '$ agentik init meeting-notes' },
      { type: 'dim', text: '→ Kobler til Zoom + Teams + HubSpot...' },
      { type: 'dim', text: '→ Henter transkript...' },
      { type: 'dim', text: '→ Klassifiserer action items + neste steg...' },
      { type: 'ok', text: '✓ Oppdaterer CRM automatisk' },
      { type: 'accent', text: '◆ Ingen møter glemmes igjen.' },
    ],
  },
  {
    name: 'Rapport-agent',
    role: 'Daglig morgenrapport',
    Icon: BarChart3,
    metrics: [
      { label: 'Rapporter sendt', value: '180', unit: '' },
      { label: 'Datakilder koblet', value: '8', unit: '' },
      { label: 'Lesetid for ledelsen', value: '2', unit: 'min' },
      { label: 'Manuelle timer spart', value: '96', unit: 't/mnd' },
    ],
    terminal: [
      { type: 'cmd', text: '$ agentik init morning-report' },
      { type: 'dim', text: '→ Kobler Stripe + Shopify + GA4 + HubSpot...' },
      { type: 'dim', text: '→ Bygger dashboard-narrativ...' },
      { type: 'dim', text: '→ Test-leveranse til ledelsen...' },
      { type: 'ok', text: '✓ Levert 06:00 hver morgen' },
      { type: 'accent', text: '◆ Ledelsen er alltid oppdatert.' },
    ],
  },
];

const ROTATE_MS = 7500;

const LiveAgents = () => {
  const [active, setActive] = useState(0);
  // Auto-rotate runs by default. Stops permanently the first time the user
  // clicks a tab — they're driving now, no surprise jumps.
  const [userSelected, setUserSelected] = useState(false);

  useEffect(() => {
    if (userSelected) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % AGENTS.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [userSelected]);

  const handleTabClick = (i) => {
    setActive(i);
    setUserSelected(true);
  };

  const agent = AGENTS[active];

  return (
    <section
      id="agents"
      className="relative py-24 md:py-32 px-6"
      style={{ background: '#0E1114' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="block w-6 h-px bg-[#4FC3B0]" />
            <p className="font-data text-[10px] uppercase tracking-[0.25em] text-[#E8E4DC]/50">
              Live agenter · i produksjon
            </p>
          </div>
          <h2 className="font-agentik font-bold text-[clamp(1.8rem,4vw,3rem)] text-[#E8E4DC] tracking-tight leading-[1.1] mb-4">
            Agenter som tar seg av jobben.
          </h2>
          <p className="text-[#E8E4DC]/45 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Vi bygger ikke strategier. Vi bygger agenter som kjører — døgnet rundt, uten pause, uten lønnsslipp.
          </p>
        </div>

        {/* Agent tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-5">
          {AGENTS.map((a, i) => {
            const isActive = i === active;
            return (
              <button
                key={a.name}
                onClick={() => handleTabClick(i)}
                className={`font-data text-[11px] uppercase tracking-[0.12em] px-4 py-2.5 rounded-full border transition-all duration-300 ${
                  isActive
                    ? 'bg-[#E8E4DC] text-[#0E1114] border-[#E8E4DC]'
                    : 'bg-transparent text-[#E8E4DC]/55 border-[#E8E4DC]/15 hover:text-[#E8E4DC] hover:border-[#E8E4DC]/40'
                }`}
              >
                {a.name}
              </button>
            );
          })}
        </div>

        {/* Auto-rotate progress bar */}
        <div className="max-w-xs mx-auto mb-10 h-[3px] flex items-center justify-center">
          {!userSelected ? (
            <div className="w-full h-[3px] bg-[#E8E4DC]/8 rounded-full overflow-hidden">
              <div
                key={active}
                className="h-full bg-[#4FC3B0]"
                style={{ animation: `agent-progress ${ROTATE_MS}ms linear forwards` }}
              />
            </div>
          ) : (
            <button
              onClick={() => setUserSelected(false)}
              className="font-data text-[10px] uppercase tracking-[0.2em] text-[#E8E4DC]/30 hover:text-[#4FC3B0] transition-colors"
            >
              ▶ Start auto-rotasjon
            </button>
          )}
        </div>

        {/* Agent card + terminal */}
        <div
          key={active}
          className="grid md:grid-cols-2 gap-5 agent-fade-in"
        >
          {/* Card */}
          <div className="bg-[#161A1F] border border-[#E8E4DC]/8 rounded-2xl p-6 md:p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-11 h-11 rounded-xl bg-[#4FC3B0]/12 border border-[#4FC3B0]/30 flex items-center justify-center">
                <agent.Icon size={20} className="text-[#4FC3B0]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-agentik font-semibold text-[#E8E4DC] text-base tracking-tight truncate">
                  {agent.name}
                </p>
                <p className="font-data text-[10px] uppercase tracking-[0.15em] text-[#E8E4DC]/35">
                  {agent.role}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 font-data text-[10px] tracking-[0.1em] uppercase text-[#4FC3B0] bg-[#4FC3B0]/10 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4FC3B0] shadow-[0_0_8px_#4FC3B0]" />
                Live
              </span>
            </div>

            <div className="flex flex-col gap-4 flex-1">
              {agent.metrics.map((m) => (
                <div
                  key={m.label}
                  className="flex justify-between items-baseline pb-3 border-b border-[#E8E4DC]/6 last:border-b-0 last:pb-0"
                >
                  <span className="text-[#E8E4DC]/55 text-[13px] tracking-tight">{m.label}</span>
                  <span className="font-data text-[#E8E4DC] text-[16px] font-medium tracking-tight">
                    {m.value}
                    {m.unit && <span className="text-[#E8E4DC]/40 text-[11px] ml-1">{m.unit}</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Terminal */}
          <div className="bg-[#161A1F] border border-[#E8E4DC]/8 rounded-2xl overflow-hidden flex flex-col">
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[#E8E4DC]/8 bg-black/25">
              <span className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3A3D42]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#3A3D42]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#3A3D42]" />
              </span>
              <span className="font-data text-[10px] text-[#E8E4DC]/40 ml-2">
                ~/agentik/deploy
              </span>
            </div>
            <div className="p-5 md:p-6 font-data text-[12px] leading-[1.85] flex-1">
              {agent.terminal.map((line, i) => {
                const colorClass = {
                  cmd: 'text-[#E8E4DC]',
                  dim: 'text-[#E8E4DC]/40',
                  ok: 'text-[#4FC3B0]',
                  accent: 'text-[#C4854C]',
                  warn: 'text-[#E8B449]',
                }[line.type] || 'text-[#E8E4DC]';
                return (
                  <div
                    key={i}
                    className={`agent-line ${colorClass}`}
                    style={{ animationDelay: `${i * 90}ms` }}
                  >
                    {line.text}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
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
                <stop offset="0%" stopColor="#4FC3B0" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#4FC3B0" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <path ref={fillRef} d={areaPath} fill="url(#areaGrad)" />

            {/* The line */}
            <path
              ref={pathRef}
              d={linePath}
              stroke="#4FC3B0"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />

            {/* Dot at inflection point */}
            <circle cx="300" cy="38" r="5" fill="#4FC3B0" opacity="0.7" />
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
          <p className="graph-text font-agentik font-bold text-xl md:text-2xl text-[#E8E4DC] tracking-tight mb-4">
            Behovet for manuelt arbeid har gått ned dramatisk
          </p>
          <p className="graph-text text-[#4FC3B0]/75 text-base md:text-lg">
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
        <div className="reveal w-12 h-0.5 bg-[#1A6B6D] mb-8" />
        <h2 className="reveal font-agentik font-bold text-[clamp(1.8rem,4vw,3rem)] text-[#1A1F25] tracking-tight leading-[1.1] mb-4">
          Konkurrentene dine har allerede begynt
        </h2>
        <p className="reveal text-[#1A1F25]/55 text-base md:text-lg mb-14 max-w-2xl leading-relaxed">
          Bare fantasien setter grenser for hva som kan automatiseres.
        </p>

        <div className="grid md:grid-cols-2 gap-8 md:gap-10 mb-14">
          {areas.map((area) => (
            <div key={area.name} className="reveal">
              <h3 className="font-agentik font-bold text-[#1A1F25] text-base md:text-lg tracking-tight mb-3">
                {area.name}
              </h3>
              <ul className="space-y-2.5">
                {area.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="block w-1 h-1 rounded-full bg-[#1A6B6D] mt-2.5 flex-shrink-0" />
                    <span className="text-[#1A1F25]/65 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="reveal font-agentik italic text-lg md:text-xl text-[#1A1F25]/70 tracking-tight max-w-lg">
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
        <h2 className="reveal font-agentik font-bold text-[clamp(1.8rem,4vw,3rem)] text-[#E8E4DC] tracking-tight leading-[1.1] mb-4">
          Etter 90 dager har dere AI i drift
        </h2>
        <p className="reveal text-[#E8E4DC]/45 text-base md:text-lg max-w-2xl mb-16 leading-relaxed">
          Som <span className="text-[#1A6B6D] font-medium">AI-Partner</span> kartlegger vi, prioriterer og bygger sammen — slik at AI faktisk havner i daglig drift, ikke bare i strategi-dokumenter.
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
  <section id="proof" className="reveal-section py-24 md:py-32 px-6" style={{ background: '#E8E4DC' }}>
    <div className="max-w-4xl mx-auto">
      <div className="reveal w-12 h-0.5 bg-[#1A6B6D] mb-8 mx-auto" />
      <h2 className="reveal font-agentik font-bold text-[clamp(1.8rem,4vw,3rem)] text-[#1A1F25] tracking-tight leading-[1.1] mb-4 text-center">
        Brukt av selskaper over hele Norge
      </h2>
      <p className="reveal text-[#1A1F25]/50 text-sm text-center mb-14">
        Noen av selskapene vi har hjulpet med AI-strategi og implementering
      </p>

      {/* Logo strip */}
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

      {/* Testimonials */}
      <div className="grid md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="reveal bg-[#F5F2EC] rounded-2xl p-6 md:p-8">
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

// ─────────────────────────────────────────────────
// WORKSHOPS (trust-builder → funnels to AI-Partner pricing section)
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
        <h2 className="reveal font-agentik text-[clamp(1.8rem,4vw,3rem)] text-[#1A1F25] tracking-tight leading-[1.1] mb-6">
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
          Våre workshops har samlet deltakere fra selskaper som Brainwaves,
          Droptech, SalesUp og flere.
        </p>

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

  return (
    <section id="process" className="reveal-section bg-[#F5F2EC] py-24 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="reveal w-12 h-0.5 bg-[#1A6B6D] mb-8" />
        <h2 className="reveal font-agentik text-[clamp(1.8rem,4vw,3rem)] text-[#1A1F25] tracking-tight leading-[1.1] mb-16">
          Slik fungerer det
        </h2>

        <div className="grid md:grid-cols-3 gap-10 md:gap-12">
          {steps.map((step) => (
            <div key={step.num} className="reveal">
              <span className="block font-agentik text-7xl md:text-8xl text-[#1A6B6D]/15 leading-none mb-4 select-none">
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
// TEAM — who's behind Agentik
// ─────────────────────────────────────────────────
const TEAM = [
  {
    name: 'Ivar André Knutsen',
    role: 'CEO & Co-founder',
    image: '/team/ivar.jpg',
  },
  {
    name: 'Ole Kristian',
    role: 'COO & Co-founder',
    image: '/team/ole.jpg',
  },
];

const Team = () => (
  <section className="reveal-section py-24 md:py-28 px-6" style={{ background: '#E8E4DC' }}>
    <div className="max-w-4xl mx-auto">
      <div className="reveal w-12 h-0.5 bg-[#1A6B6D] mb-8" />
      <h2 className="reveal font-agentik font-bold text-[clamp(1.8rem,4vw,3rem)] text-[#1A1F25] tracking-tight leading-[1.1] mb-4">
        Hvem som står bak
      </h2>
      <p className="reveal font-sans text-[#1A1F25]/55 text-base md:text-lg max-w-2xl mb-14 leading-relaxed">
        Agentik bygges av to gründere som har levd og pustet AI-systemer i flere år.
        Når dere snakker med oss, snakker dere med folka som faktisk bygger agentene.
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

// ─────────────────────────────────────────────────
// RISK REVERSAL
// ─────────────────────────────────────────────────
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
    <section id="contact" className="reveal-section py-28 md:py-36 px-6" style={{ background: '#1A1F25' }}>
      <div className="max-w-lg mx-auto">
        <h2 className="reveal font-agentik font-bold text-[clamp(1.8rem,4.5vw,3.2rem)] text-[#E8E4DC] tracking-tight leading-[1.1] mb-3 text-center">
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

        <p className="reveal mt-8 text-center text-sm text-[#F5F2EC]/60">
          Eller send oss en epost:{' '}
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

// ─────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────
const Footer = () => (
  <footer className="border-t border-[#E8E4DC]/8 pt-16 pb-10 px-6" style={{ background: '#1A1F25' }}>
    <div className="max-w-5xl mx-auto">
      {/* Top row — brand + nav */}
      <div className="grid md:grid-cols-2 gap-10 pb-10 border-b border-[#E8E4DC]/8">
        <div>
          <div className="font-agentik font-semibold text-[#E8E4DC] text-xl tracking-tight mb-3">
            Agentik
          </div>
          <p className="font-sans text-[#E8E4DC]/40 text-sm max-w-sm leading-relaxed">
            Vi bygger AI-agenter som kjører i produksjon for norske selskaper.
            Fra kartlegging til live system — på uker, ikke måneder.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:justify-self-end font-sans">
          <div>
            <h4 className="font-data text-[10px] uppercase tracking-[0.18em] text-[#E8E4DC]/35 mb-4">
              Selskap
            </h4>
            <ul className="space-y-3 text-[#E8E4DC]/55 text-sm">
              <li>
                <button onClick={() => scrollTo('agents')} className="hover:text-[#4FC3B0] transition-colors">
                  Agenter
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('process')} className="hover:text-[#4FC3B0] transition-colors">
                  Prosess
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('contact')} className="hover:text-[#4FC3B0] transition-colors">
                  Book samtale
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-data text-[10px] uppercase tracking-[0.18em] text-[#E8E4DC]/35 mb-4">
              Juridisk
            </h4>
            <ul className="space-y-3 text-[#E8E4DC]/55 text-sm">
              <li>
                <a href="/vilkar" className="hover:text-[#4FC3B0] transition-colors">
                  Vilkår
                </a>
              </li>
              <li>
                <a href="/personvern" className="hover:text-[#4FC3B0] transition-colors">
                  Personvern
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom row — legal line */}
      <div className="pt-8">
        <p className="font-sans text-[#E8E4DC]/30 text-xs tracking-tight">
          &copy; {new Date().getFullYear()} Agentik · Org.nr 933 378 179 · Skien, Norge
        </p>
      </div>
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
        <title>Agentik | AI-Partner for norske bedrifter</title>
        <meta
          name="description"
          content="Vi blir deres faste AI-rådgiver og dev-team. 90-dagers verdigaranti: minst 2x investeringen i årlig verdipotensial — eller jobber vi videre uten månedlig honorar."
        />
        <meta property="og:title" content="Agentik | AI-Partner for norske bedrifter" />
        <meta
          property="og:description"
          content="Vi blir deres faste AI-rådgiver og dev-team. 90-dagers verdigaranti: minst 2x investeringen i årlig verdipotensial."
        />
        <meta property="og:locale" content="nb_NO" />
        <meta property="og:url" content="https://agentik.no/" />
        <link rel="canonical" href="https://agentik.no/" />
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

          @keyframes agent-progress {
            from { width: 0%; }
            to { width: 100%; }
          }
          @keyframes agent-fade-in {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes agent-line-in {
            from { opacity: 0; transform: translateX(-6px); }
            to { opacity: 1; transform: translateX(0); }
          }
          .agentik-page .agent-fade-in { animation: agent-fade-in 600ms ease-out both; }
          .agentik-page .agent-line { opacity: 0; animation: agent-line-in 380ms ease-out forwards; }
        `}</style>
      </Helmet>

      <div className="agentik-page">
      <Navbar />
      <main>
        <Hero />
        <LiveAgents />
        <GraphSection />
        <Urgency />
        <Outcomes />
        <Proof />
        <PricingSection />
        <Workshops />
        <Process />
        <Team />
        <RiskReversal />
        <ContactForm />
      </main>
      <Footer />
      </div>
    </>
  );
};
