import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft, ArrowRight, Search, Target, FileText, Map, CheckCircle, Sparkles,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
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
];

const DELIVERABLES = [
  'Skriftlig revisjonsrapport med funn, anbefalinger og prioriteringer',
  'Prosesskart over de viktigste arbeidsflytene deres',
  '90-dagers roadmap med konkrete tiltak og forventet effekt',
  'ROI-estimater per tiltak (verdipotensial og innsats)',
  'Anbefalt rekkefølge basert på verdi og gjennomførbarhet',
];

const USE_CASES = [
  { title: 'Kundeservice og support', desc: 'Mange repetitive henvendelser som kan auto-besvares eller rutes smartere.' },
  { title: 'Salg og lead-håndtering', desc: 'Inbound leads som ikke følges opp raskt nok, kvalifisering som kan automatiseres.' },
  { title: 'Intern admin og rapportering', desc: 'Manuell datasammenstilling, rapporter som tar timer per uke.' },
  { title: 'Fakturering og bestillingsflyt', desc: 'Manuell håndtering av fakturaer, ordrebekreftelser eller avvik.' },
];

const AiRevisjon = () => {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 24,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen bg-[#F5F2EC]">
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
          provider: { '@type': 'Organization', name: 'Agentik', url: 'https://agentik.no' },
          serviceType: 'AI Consulting',
          description: 'Strukturert kartlegging av hvor AI og automasjon gir høyest ROI i bedriften. Inkludert i AI-Partner-avtalen.',
          areaServed: { '@type': 'Country', name: 'Norway' },
        })}</script>
      </Helmet>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F5F2EC]/80 backdrop-blur-md border-b border-[#1A1F25]/10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-heading font-bold text-xl text-[#1A1F25]">Agentik</Link>
          <Link to="/" className="font-sans text-sm text-[#1A1F25]/60 hover:text-[#1A1F25] transition-colors flex items-center gap-2">
            <ArrowLeft size={16} aria-hidden="true" /> Tilbake
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-28 md:pt-36 pb-16 md:pb-24 px-6 overflow-hidden">
        <div
          className="absolute inset-0 -z-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(0deg, rgba(26,107,109,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(26,107,109,0.6) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-5xl mx-auto">
          <div className="reveal inline-flex items-center gap-2 bg-[#1A6B6D]/10 border border-[#1A6B6D]/30 rounded-full px-4 py-1.5 mb-8">
            <Sparkles size={14} className="text-[#1A6B6D]" aria-hidden="true" />
            <span className="font-data text-[11px] text-[#1A1F25] uppercase tracking-[0.15em] font-semibold">
              Inkludert i AI-Partner
            </span>
          </div>

          <h1 className="reveal font-agentik font-bold text-5xl md:text-7xl lg:text-8xl text-[#1A1F25] tracking-[-0.025em] leading-[0.95] mb-8">
            AI-Revisjon.
          </h1>

          <p className="reveal font-sans text-[#1A1F25]/70 text-xl md:text-2xl leading-snug max-w-3xl mb-10 tracking-tight">
            Vi finner hvor AI og automasjon gir høyest ROI hos dere — før vi bygger noe. Strukturert, datadrevet og med konkrete neste-steg-anbefalinger.
          </p>

          <div className="reveal flex flex-wrap items-end gap-6 md:gap-10 mb-10">
            <div>
              <div className="font-data text-[10px] text-[#1A1F25]/50 uppercase tracking-[0.15em] mb-2">Varighet</div>
              <div className="flex items-baseline gap-2">
                <span className="font-data text-5xl md:text-6xl font-bold text-[#1A1F25] tracking-tight">2 uker</span>
              </div>
            </div>
            <div className="hidden sm:block w-px h-16 bg-[#1A1F25]/15" aria-hidden="true" />
            <div>
              <div className="font-data text-[10px] text-[#1A1F25]/50 uppercase tracking-[0.15em] mb-2">Format</div>
              <div className="font-heading font-semibold text-[#1A1F25] text-lg">
                Intervjuer + kartlegging + rapport
              </div>
            </div>
            <div className="hidden md:block w-px h-16 bg-[#1A1F25]/15" aria-hidden="true" />
            <div>
              <div className="font-data text-[10px] text-[#1A1F25]/50 uppercase tracking-[0.15em] mb-2">Pris</div>
              <div className="font-heading font-semibold text-[#1A1F25] text-lg">
                Inkludert i AI-Partner
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HVA ER DET */}
      <section className="px-6 py-16 md:py-24 bg-white border-y border-[#1A1F25]/8">
        <div className="max-w-3xl mx-auto">
          <div className="reveal w-12 h-0.5 bg-[#1A6B6D] mb-8" />
          <h2 className="reveal font-agentik font-bold text-3xl md:text-4xl text-[#1A1F25] tracking-tight mb-8 leading-tight">
            Vi bygger ikke noe før vi vet hva som er verdt å bygge.
          </h2>
          <div className="space-y-5 text-[#1A1F25]/75 text-lg leading-relaxed">
            <p className="reveal">
              De fleste bedrifter starter med å bygge AI-løsninger uten å vite hvor verdien faktisk ligger. Resultatet er ofte en teknologi som imponerer i demoer, men ikke endrer hverdagen.
            </p>
            <p className="reveal">
              En AI-Revisjon snur dette: vi bruker 2 uker på å kartlegge driften deres, intervjuer nøkkelpersoner, og identifiserer hvor AI gir mest verdi i forhold til innsats.
            </p>
            <p className="reveal font-agentik italic text-[#1A6B6D] text-xl md:text-2xl pt-4">
              Resultatet er en prioritert liste over hva som faktisk er verdt å bygge — og en 90-dagers roadmap.
            </p>
          </div>
        </div>
      </section>

      {/* SLIK GJØR VI DET — 4 step cards */}
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="reveal inline-block w-12 h-0.5 bg-[#1A6B6D] mb-5" />
            <h2 className="reveal font-agentik font-bold text-3xl md:text-5xl text-[#1A1F25] tracking-tight leading-tight">
              Slik gjør vi det
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {STEPS.map((s) => (
              <div
                key={s.step}
                className="reveal group relative bg-white border border-[#1A1F25]/8 rounded-2xl p-7 md:p-8 hover:border-[#1A6B6D]/40 hover:shadow-[0_8px_32px_rgba(26,107,109,0.08)] transition-all duration-300"
              >
                <div className="absolute top-7 right-7 font-agentik font-bold text-5xl md:text-6xl text-[#1A6B6D]/10 leading-none select-none" aria-hidden="true">
                  {s.step}
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#1A6B6D]/10 flex items-center justify-center mb-5 group-hover:bg-[#1A6B6D]/15 transition-colors">
                  <s.icon size={22} className="text-[#1A6B6D]" aria-hidden="true" />
                </div>
                <h3 className="font-heading font-bold text-xl md:text-2xl text-[#1A1F25] tracking-tight mb-3">
                  {s.title}
                </h3>
                <p className="font-sans text-[#1A1F25]/65 text-[15px] leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HVA DERE FÅR — checklist */}
      <section className="px-6 py-20 md:py-24 bg-white border-y border-[#1A1F25]/8">
        <div className="max-w-3xl mx-auto">
          <div className="reveal w-12 h-0.5 bg-[#1A6B6D] mb-8" />
          <h2 className="reveal font-agentik font-bold text-3xl md:text-4xl text-[#1A1F25] tracking-tight mb-8">
            Hva dere får
          </h2>
          <div className="grid gap-3">
            {DELIVERABLES.map((item, i) => (
              <div key={i} className="reveal flex gap-4 items-start bg-[#F5F2EC] rounded-xl px-5 py-4 hover:bg-[#1A6B6D]/8 transition-colors">
                <div className="font-data text-[11px] font-bold text-[#1A6B6D] pt-1.5 w-6 flex-shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <CheckCircle size={20} className="text-[#1A6B6D] flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="font-sans text-[#1A1F25] text-base md:text-lg leading-relaxed">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOR HVEM */}
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="reveal inline-block w-12 h-0.5 bg-[#1A6B6D] mb-5" />
            <h2 className="reveal font-agentik font-bold text-3xl md:text-5xl text-[#1A1F25] tracking-tight leading-tight">
              For hvem passer dette?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {USE_CASES.map((c, i) => (
              <div
                key={i}
                className="reveal bg-white border border-[#1A1F25]/8 rounded-2xl p-6 md:p-7 hover:border-[#1A6B6D]/40 hover:-translate-y-1 transition-all duration-300"
              >
                <h3 className="font-heading font-bold text-lg md:text-xl text-[#1A1F25] mb-2 tracking-tight">{c.title}</h3>
                <p className="font-sans text-[#1A1F25]/60 text-[15px] leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HVORFOR INKLUDERT — dramatic */}
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <div className="reveal relative bg-gradient-to-br from-[#1A6B6D]/10 via-[#4FC3B0]/5 to-transparent border border-[#1A6B6D]/20 rounded-3xl p-8 md:p-12">
            <h2 className="font-agentik font-bold text-2xl md:text-4xl text-[#1A1F25] tracking-tight leading-tight mb-5">
              Hvorfor er AI-Revisjon inkludert i AI-Partner?
            </h2>
            <p className="font-sans text-[#1A1F25]/75 text-lg leading-relaxed mb-4">
              Vi selger ikke AI-Revisjon som standalone-produkt. Grunnen er enkel: en revisjon uten implementering blir et dyrt strategi-dokument.
            </p>
            <p className="font-sans text-[#1A1F25]/75 text-lg leading-relaxed">
              Når dere blir AI-Partner, får dere revisjonen som første fase — og vi bygger videre fra rapporten umiddelbart etter.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 md:py-32 bg-white border-t border-[#1A1F25]/8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="reveal inline-block w-12 h-0.5 bg-[#1A6B6D] mb-6 mx-auto" />
          <h2 className="reveal font-agentik font-bold text-3xl md:text-5xl text-[#1A1F25] tracking-tight leading-[1.05] mb-5">
            Klar for å starte?
          </h2>
          <p className="reveal font-sans text-[#1A1F25]/60 text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto">
            AI-Revisjon er fase 1 i AI-Partner. Bli partner, så starter vi kartleggingen i uke 1.
          </p>
          <Link
            to="/ai-partner"
            className="reveal btn-magnetic inline-flex rounded-full px-8 py-4 text-base bg-[#C4854C] text-[#F5F2EC] font-heading font-semibold tracking-tight no-underline"
          >
            <span className="btn-layer bg-[#1A1F25]"></span>
            <span className="btn-text flex items-center gap-2">
              Bli AI-Partner <ArrowRight size={18} aria-hidden="true" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AiRevisjon;
