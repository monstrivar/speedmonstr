import { useState, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft, ArrowRight, ShieldCheck, Calendar, Wrench, MessageCircle,
  GraduationCap, BarChart3, CheckCircle, Plus, Minus, Sparkles, TrendingUp,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FAQ_ITEMS = [
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
];

const PHASES = [
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
    desc: 'Første løsning forbedres basert på faktisk bruk. 90-dagers roadmap låst, og dere bestemmer om vi fortsetter.',
  },
  {
    step: '04',
    phase: 'Måned 4+',
    title: 'Løpende partnerskap',
    desc: 'Måned-til-måned. Vi prioriterer, bygger og forbedrer kontinuerlig — uten lang binding.',
  },
];

const INCLUDED = [
  { icon: BarChart3, title: 'Eget ROI-dashbord', desc: 'Live oversikt over leveranser, status og målbar effekt. Settes opp automatisk ved oppstart.' },
  { icon: Calendar, title: 'Månedlig strategimøte', desc: 'Vi går gjennom hva som har blitt levert, hva som virker, og hva som prioriteres neste måned.' },
  { icon: Wrench, title: 'Bygging og vedlikehold', desc: 'Vi bygger nye AI-løsninger og holder eksisterende i drift. Inkludert i månedsprisen.' },
  { icon: MessageCircle, title: 'Direkte Slack-tilgang', desc: 'Spørsmål, idéer, problemer — svar samme virkedag fra rådgiveren.' },
  { icon: GraduationCap, title: 'Opplæring av teamet', desc: 'Når vi bygger en ny løsning, sørger vi for at teamet vet hvordan å bruke den.' },
  { icon: ShieldCheck, title: 'Komplett AI-Revisjon', desc: 'Inkludert som første fase. Strukturert kartlegging av hvor AI gir mest verdi.' },
];

const Accordion = ({ q, a, isOpen, onToggle, index }) => (
  <div className="reveal border-b border-[#1A1F25]/10 last:border-b-0">
    <button
      onClick={onToggle}
      aria-expanded={isOpen}
      className="w-full flex items-center justify-between gap-6 py-5 text-left group"
    >
      <span className="flex items-start gap-4 flex-1">
        <span className="font-data text-[10px] text-[#1A6B6D] uppercase tracking-[0.18em] font-semibold pt-1.5 hidden sm:inline">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="font-heading font-bold text-base md:text-lg text-[#1A1F25] tracking-tight group-hover:text-[#1A6B6D] transition-colors">
          {q}
        </span>
      </span>
      <span className={`flex-shrink-0 w-8 h-8 rounded-full bg-[#1A6B6D]/10 flex items-center justify-center transition-transform ${isOpen ? 'rotate-180' : ''}`}>
        {isOpen ? (
          <Minus size={16} className="text-[#1A6B6D]" aria-hidden="true" />
        ) : (
          <Plus size={16} className="text-[#1A6B6D]" aria-hidden="true" />
        )}
      </span>
    </button>
    <div
      className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100 pb-5' : 'grid-rows-[0fr] opacity-0'}`}
    >
      <div className="overflow-hidden">
        <p className="font-sans text-[#1A1F25]/70 text-sm md:text-base leading-relaxed pl-0 sm:pl-12 pr-12">
          {a}
        </p>
      </div>
    </div>
  </div>
);

const AiPartner = () => {
  const [openFaq, setOpenFaq] = useState(0);
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

      // Animated 2x counter on garanti
      const counter = document.querySelector('.garanti-multiplier');
      if (counter) {
        gsap.fromTo(
          counter,
          { scale: 0.6, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.9,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: counter,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen bg-[#F5F2EC]">
      <Helmet>
        <title>AI-Partner — fast AI-rådgiver for norske bedrifter | Agentik</title>
        <meta name="description" content="AI-Partner: fast månedlig avtale med AI-rådgiver og dev-team. 39 000 kr/mnd, ingen binding etter 90 dager. 90-dagers verdigaranti — minst 2x investeringen i årlig verdipotensial." />
        <meta property="og:title" content="AI-Partner | Agentik" />
        <meta property="og:description" content="Fra AI-nysgjerrighet til AI i drift. 90-dagers verdigaranti — minst 2x investeringen i årlig verdipotensial." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://agentik.no/ai-partner" />
        <link rel="canonical" href="https://agentik.no/ai-partner" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'AI-Partner',
          provider: { '@type': 'Organization', name: 'Agentik', url: 'https://agentik.no' },
          serviceType: 'AI Consulting Retainer',
          description: 'Fast månedlig avtale med AI-rådgiver og dev-team. Kartlegging, bygging og forbedring av AI-løsninger. 90-dagers verdigaranti — minst 2x investeringen i årlig verdipotensial.',
          areaServed: { '@type': 'Country', name: 'Norway' },
          offers: {
            '@type': 'Offer',
            price: '39000',
            priceCurrency: 'NOK',
            priceSpecification: { '@type': 'UnitPriceSpecification', price: '39000', priceCurrency: 'NOK', unitText: 'MONTH' },
          },
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

      {/* HERO — dramatic */}
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
          <div className="reveal inline-flex items-center gap-2 bg-[#C4854C]/10 border border-[#C4854C]/30 rounded-full px-4 py-1.5 mb-8">
            <Sparkles size={14} className="text-[#C4854C]" aria-hidden="true" />
            <span className="font-data text-[11px] text-[#1A1F25] uppercase tracking-[0.15em] font-semibold">
              Founding — 2 av 3 spots igjen
            </span>
          </div>

          <h1 className="reveal font-agentik font-bold text-5xl md:text-7xl lg:text-8xl text-[#1A1F25] tracking-[-0.025em] leading-[0.95] mb-8">
            AI-Partner.
          </h1>

          <p className="reveal font-sans text-[#1A1F25]/70 text-xl md:text-2xl leading-snug max-w-3xl mb-10 tracking-tight">
            Fra AI-nysgjerrighet til AI i drift, uten å ansette internt. Vi blir deres faste AI-rådgiver og dev-team — kartlegger, bygger og forbedrer måned for måned.
          </p>

          <div className="reveal flex flex-wrap items-end gap-6 md:gap-10 mb-10">
            <div>
              <div className="font-data text-[10px] text-[#1A1F25]/50 uppercase tracking-[0.15em] mb-2">Founding-pris</div>
              <div className="flex items-baseline gap-2">
                <span className="font-data text-5xl md:text-6xl font-bold text-[#1A1F25] tracking-tight">39 000</span>
                <span className="font-sans text-[#1A1F25]/55 text-lg">kr/mnd</span>
              </div>
            </div>
            <div className="hidden sm:block w-px h-16 bg-[#1A1F25]/15" aria-hidden="true" />
            <div>
              <div className="font-data text-[10px] text-[#1A1F25]/50 uppercase tracking-[0.15em] mb-2">Binding</div>
              <div className="font-heading font-semibold text-[#1A1F25] text-lg">
                Ingen — etter 90-dagers Sprint
              </div>
            </div>
            <div className="hidden md:block w-px h-16 bg-[#1A1F25]/15" aria-hidden="true" />
            <div>
              <div className="font-data text-[10px] text-[#1A1F25]/50 uppercase tracking-[0.15em] mb-2">Garanti</div>
              <div className="font-heading font-semibold text-[#1A1F25] text-lg">
                2x verdipotensial på 90 dager
              </div>
            </div>
          </div>

          <div className="reveal flex flex-wrap items-center gap-4">
            <Link
              to="/#contact"
              className="btn-magnetic inline-flex rounded-full px-7 py-4 text-sm bg-[#C4854C] text-[#F5F2EC] font-heading font-semibold tracking-tight no-underline"
            >
              <span className="btn-layer bg-[#1A1F25]"></span>
              <span className="btn-text flex items-center gap-2">
                Book uforpliktende samtale <ArrowRight size={16} aria-hidden="true" />
              </span>
            </Link>
            <a
              href="#garanti"
              className="font-heading font-semibold text-sm text-[#1A6B6D] hover:text-[#1A1F25] transition-colors flex items-center gap-1.5 px-3 py-3"
            >
              Les garantien <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* HVA ER DET — boxed quote-style */}
      <section className="px-6 py-16 md:py-24 bg-white border-y border-[#1A1F25]/8">
        <div className="max-w-3xl mx-auto">
          <div className="reveal w-12 h-0.5 bg-[#1A6B6D] mb-8" />
          <h2 className="reveal font-agentik font-bold text-3xl md:text-4xl text-[#1A1F25] tracking-tight mb-8">
            En AI-Partner er motsatt av en konsulent.
          </h2>
          <div className="space-y-5 text-[#1A1F25]/75 text-lg leading-relaxed">
            <p className="reveal">
              Konsulenten leverer rapport og forsvinner. Vi blir en del av teamet deres på månedlig basis — kartlegger hvor AI gir verdi, bygger løsningene, og forbedrer dem kontinuerlig.
            </p>
            <p className="reveal">
              Etter 90 dager fortsetter vi måned-til-måned, kun hvis dere ser verdi. Ingen lang binding, ingen lock-in. Det er den letteste måten å få AI i drift uten å ansette internt.
            </p>
          </div>
        </div>
      </section>

      {/* SLIK FUNGERER DET — 4 phase cards */}
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="reveal inline-block w-12 h-0.5 bg-[#1A6B6D] mb-5" />
            <h2 className="reveal font-agentik font-bold text-3xl md:text-5xl text-[#1A1F25] tracking-tight leading-tight">
              Slik fungerer det
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {PHASES.map((p, idx) => (
              <div
                key={p.step}
                className="reveal group relative bg-white border border-[#1A1F25]/8 rounded-2xl p-7 md:p-8 hover:border-[#1A6B6D]/40 hover:shadow-[0_8px_32px_rgba(26,107,109,0.08)] transition-all duration-300"
              >
                <div className="absolute top-7 right-7 font-agentik font-bold text-5xl md:text-6xl text-[#1A6B6D]/10 leading-none select-none" aria-hidden="true">
                  {p.step}
                </div>
                <div className="font-data text-[10px] text-[#1A6B6D] uppercase tracking-[0.18em] font-semibold mb-4">
                  {p.phase}
                </div>
                <h3 className="font-heading font-bold text-xl md:text-2xl text-[#1A1F25] tracking-tight mb-3 max-w-[80%]">
                  {p.title}
                </h3>
                <p className="font-sans text-[#1A1F25]/65 text-[15px] leading-relaxed mb-4">
                  {p.desc}
                </p>
                {p.cta && (
                  <Link
                    to={p.cta.to}
                    className="inline-flex items-center gap-1.5 text-sm text-[#1A6B6D] hover:text-[#C4854C] font-heading font-semibold transition-colors"
                  >
                    {p.cta.text} <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                )}
                {idx === 3 && (
                  <div className="mt-2 inline-flex items-center gap-1.5 font-data text-[10px] text-[#C4854C] uppercase tracking-[0.15em] font-semibold">
                    <Sparkles size={12} aria-hidden="true" /> Måned-til-måned
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HVA ER INKLUDERT — 6 cards */}
      <section className="px-6 py-20 md:py-28 bg-white border-y border-[#1A1F25]/8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="reveal inline-block w-12 h-0.5 bg-[#1A6B6D] mb-5" />
            <h2 className="reveal font-agentik font-bold text-3xl md:text-5xl text-[#1A1F25] tracking-tight leading-tight mb-3">
              Hva som er inkludert
            </h2>
            <p className="reveal font-sans text-[#1A1F25]/55 text-base md:text-lg max-w-xl mx-auto">
              Alt under er inkludert i månedsprisen. Software- og API-kostnader fra tredjeparter kommer i tillegg.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {INCLUDED.map((item, i) => (
              <div
                key={i}
                className="reveal group relative bg-[#F5F2EC] border border-[#1A1F25]/8 rounded-2xl p-6 hover:border-[#1A6B6D]/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-[#1A6B6D]/10 flex items-center justify-center mb-4 group-hover:bg-[#1A6B6D]/15 transition-colors">
                  <item.icon size={20} className="text-[#1A6B6D]" aria-hidden="true" />
                </div>
                <h3 className="font-heading font-bold text-base text-[#1A1F25] tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="font-sans text-[#1A1F25]/60 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GARANTIEN — dramatic, glowing */}
      <section id="garanti" className="px-6 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          <div className="reveal relative bg-[#1A1F25] text-[#F5F2EC] rounded-3xl p-8 md:p-14 overflow-hidden">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  'radial-gradient(circle at 20% 0%, rgba(79,195,176,0.4) 0%, transparent 60%), radial-gradient(circle at 80% 100%, rgba(196,133,76,0.25) 0%, transparent 50%)',
              }}
              aria-hidden="true"
            />
            <div className="relative">
              <div className="font-data text-[11px] text-[#4FC3B0] uppercase tracking-[0.2em] font-semibold mb-4 flex items-center gap-2">
                <ShieldCheck size={14} aria-hidden="true" /> Inkludert i alle partneravtaler
              </div>

              <h2 className="reveal font-agentik font-bold text-4xl md:text-6xl tracking-tight leading-[1.05] mb-8">
                90-dagers verdigaranti.
              </h2>

              <div className="flex items-baseline gap-3 mb-8">
                <span className="garanti-multiplier inline-block font-agentik font-bold text-7xl md:text-8xl text-[#4FC3B0] leading-none">
                  2x
                </span>
                <span className="font-heading font-semibold text-xl md:text-2xl text-[#F5F2EC]/80 tracking-tight">
                  investeringen i årlig verdipotensial
                </span>
              </div>

              <div className="space-y-4 text-[#F5F2EC]/85 text-lg leading-relaxed mb-8 max-w-2xl">
                <p>
                  Innen 90 dager skal vi ha kartlagt, prioritert og implementert AI- og automasjonstiltak med dokumentert årlig verdipotensial tilsvarende minst 2x investeringen deres i perioden.
                </p>
                <p>
                  Hvis vi ikke klarer det, jobber vi videre uten månedlig honorar til verdien er dokumentert.
                </p>
                <p className="text-sm italic text-[#F5F2EC]/55">
                  Verdien kan komme fra spart tid, frigjort kapasitet, raskere oppfølging, færre manuelle steg, færre feil eller bedre utnyttelse av eksisterende ressurser.
                </p>
              </div>

              <div className="border-t border-[#F5F2EC]/15 pt-6">
                <p className="font-agentik italic text-2xl md:text-3xl text-[#F5F2EC] tracking-tight">
                  Garantien er gulvet. Business caset er målet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VILKÅR — checklist box */}
      <section className="px-6 py-16 md:py-20 bg-white border-y border-[#1A1F25]/8">
        <div className="max-w-3xl mx-auto">
          <div className="reveal w-12 h-0.5 bg-[#1A6B6D] mb-8" />
          <h2 className="reveal font-agentik font-bold text-2xl md:text-3xl text-[#1A1F25] tracking-tight mb-4">
            Vilkår for at garantien gjelder
          </h2>
          <p className="reveal font-sans text-[#1A1F25]/65 text-base md:text-lg leading-relaxed mb-8">
            Verdiarbeidet krever at dere er aktive partnere. Garantien gjelder når dere:
          </p>
          <div className="reveal grid md:grid-cols-2 gap-3">
            {[
              'Gir nødvendige systemtilganger innen avtalt tid',
              'Stiller med én intern kontaktperson som eier samarbeidet',
              'Deltar på avtalte møter og workshops',
              'Gir tilbakemelding innen avtalt frist',
              'Tar i bruk løsningene som er avtalt',
              'Har nok volum eller repetitive prosesser',
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start bg-[#F5F2EC] rounded-lg px-4 py-3">
                <CheckCircle size={18} className="text-[#1A6B6D] flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="font-sans text-[#1A1F25] text-sm md:text-base leading-snug">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRIS — dramatic */}
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="reveal inline-block w-12 h-0.5 bg-[#1A6B6D] mb-5" />
            <h2 className="reveal font-agentik font-bold text-3xl md:text-5xl text-[#1A1F25] tracking-tight leading-tight">
              Pris
            </h2>
          </div>

          <div className="reveal relative bg-white border-2 border-[#C4854C]/30 rounded-3xl p-8 md:p-12 shadow-[0_12px_48px_rgba(196,133,76,0.08)]">
            <div className="absolute top-6 right-6 bg-[#C4854C] text-[#F5F2EC] font-data text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.12em]">
              Founding
            </div>

            <div className="font-data text-[10px] text-[#1A6B6D] uppercase tracking-[0.18em] font-semibold mb-3">
              For de første 3 partnerne
            </div>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-agentik font-bold text-7xl md:text-8xl text-[#1A1F25] tracking-[-0.03em] leading-none">
                39 000
              </span>
              <span className="font-sans text-[#1A1F25]/55 text-2xl">kr/mnd</span>
            </div>

            <p className="font-sans text-[#1A1F25]/70 text-base md:text-lg leading-relaxed mb-6 max-w-xl">
              Founding-pris låst for alltid for de første 3 partnerne. Ingen automatiske prisøkninger. Software- og API-kostnader betales direkte av dere.
            </p>

            <div className="flex items-center gap-3 pt-6 border-t border-[#1A1F25]/10">
              <TrendingUp size={16} className="text-[#1A1F25]/40" aria-hidden="true" />
              <p className="font-sans text-[#1A1F25]/50 text-sm italic">
                Når Founding er fylt: AI-Partner blir <strong className="not-italic text-[#1A1F25]/70">49 000 kr/mnd</strong> for nye kunder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* IKKE INKLUDERT — quick honest section */}
      <section className="px-6 py-16 md:py-20 bg-white border-y border-[#1A1F25]/8">
        <div className="max-w-3xl mx-auto">
          <div className="reveal w-12 h-0.5 bg-[#1A6B6D] mb-8" />
          <h2 className="reveal font-agentik font-bold text-2xl md:text-3xl text-[#1A1F25] tracking-tight mb-4">
            Hva som ikke er inkludert
          </h2>
          <p className="reveal font-sans text-[#1A1F25]/65 text-base md:text-lg leading-relaxed mb-6">
            Vi tror på ærlighet om hva som er utenfor scope:
          </p>
          <ul className="reveal space-y-2 text-[#1A1F25]/70 text-base leading-relaxed">
            <li>— Software- og API-kostnader (OpenAI, Slack, etc.) — betales direkte av dere</li>
            <li>— Eksterne integrasjoner som krever betalt utvikling fra tredjeparter</li>
            <li>— Store enkeltprosjekter utover månedlig kapasitet (prises separat)</li>
            <li>— Hardware, lisenser eller infrastruktur</li>
          </ul>
        </div>
      </section>

      {/* FOR HVEM + NÅR PASSER IKKE — 2-col split */}
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="reveal bg-white border border-[#1A1F25]/8 rounded-2xl p-7 md:p-9">
            <div className="font-data text-[10px] text-[#1A6B6D] uppercase tracking-[0.18em] font-semibold mb-3">
              For dere som
            </div>
            <h2 className="font-agentik font-bold text-2xl md:text-3xl text-[#1A1F25] tracking-tight mb-5 leading-tight">
              Passer perfekt
            </h2>
            <ul className="space-y-3 text-[#1A1F25]/75 text-base leading-relaxed">
              {[
                'Bruker mye tid på manuelle steg',
                'Får inn nok henvendelser, leads eller bestillinger',
                'Vil bruke AI strategisk uten å ansette',
                'Har en ledelse som kan ta beslutninger',
              ].map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <CheckCircle size={18} className="text-[#1A6B6D] flex-shrink-0 mt-1" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="reveal bg-[#1A1F25]/3 border border-[#1A1F25]/12 rounded-2xl p-7 md:p-9 border-l-4 border-l-[#1A6B6D]">
            <div className="font-data text-[10px] text-[#1A1F25]/50 uppercase tracking-[0.18em] font-semibold mb-3">
              Når det ikke passer
            </div>
            <h2 className="font-agentik font-bold text-2xl md:text-3xl text-[#1A1F25] tracking-tight mb-5 leading-tight">
              Vi sier det rett ut
            </h2>
            <p className="font-sans text-[#1A1F25]/75 text-base leading-relaxed mb-4">
              Hvis vi ikke ser realistisk potensial for minst 2x årlig verdi, anbefaler vi heller:
            </p>
            <ul className="space-y-2 text-[#1A1F25]/75 text-base leading-relaxed mb-5">
              <li>— En <strong>AI Workshop</strong> (fra 25 000 kr)</li>
              <li>— Et <strong>mindre forprosjekt</strong> for å teste én løsning</li>
            </ul>
            <p className="font-agentik italic text-[#1A1F25]/55 text-sm">
              Bedre å være ærlig før enn etter.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ — accordion */}
      <section className="px-6 py-20 md:py-28 bg-white border-y border-[#1A1F25]/8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="reveal inline-block w-12 h-0.5 bg-[#1A6B6D] mb-5" />
            <h2 className="reveal font-agentik font-bold text-3xl md:text-5xl text-[#1A1F25] tracking-tight leading-tight">
              Vanlige spørsmål
            </h2>
          </div>

          <div className="space-y-1">
            {FAQ_ITEMS.map((item, i) => (
              <Accordion
                key={i}
                index={i}
                q={item.q}
                a={item.a}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <div className="reveal inline-block w-12 h-0.5 bg-[#1A6B6D] mb-6 mx-auto" />
          <h2 className="reveal font-agentik font-bold text-3xl md:text-5xl text-[#1A1F25] tracking-tight leading-[1.05] mb-5">
            Ta en uforpliktende samtale.
          </h2>
          <p className="reveal font-sans text-[#1A1F25]/60 text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto">
            Vi bruker første samtale på å se om det finnes 2x verdipotensial hos dere. Hvis ikke, sier vi det rett ut og foreslår et bedre alternativ.
          </p>
          <Link
            to="/#contact"
            className="reveal btn-magnetic inline-flex rounded-full px-8 py-4 text-base bg-[#C4854C] text-[#F5F2EC] font-heading font-semibold tracking-tight no-underline"
          >
            <span className="btn-layer bg-[#1A1F25]"></span>
            <span className="btn-text flex items-center gap-2">
              Book en samtale <ArrowRight size={18} aria-hidden="true" />
            </span>
          </Link>
          <p className="reveal font-data text-[11px] text-[#1A1F25]/40 uppercase tracking-[0.18em] mt-8">
            2 av 3 Founding-spots igjen
          </p>
        </div>
      </section>
    </div>
  );
};

export default AiPartner;
