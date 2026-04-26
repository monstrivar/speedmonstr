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
                <CheckCircle size={20} className="text-[#1A6B6D] flex-shrink-0 mt-0.5" aria-hidden="true" />
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
            className="btn-magnetic inline-flex rounded-full px-7 py-3.5 text-sm bg-[#C4854C] text-[#F5F2EC] font-heading font-medium tracking-tight no-underline"
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
