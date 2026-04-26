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
                desc: 'Første løsning forbedres basert på faktisk bruk. 90-dagers roadmap låst, og dere bestemmer om vi fortsetter.',
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
                <item.icon size={22} className="text-[#1A6B6D] mb-3" aria-hidden="true" />
                <h3 className="font-heading font-bold text-base text-[#1A1F25] tracking-tight mb-2">{item.title}</h3>
                <p className="font-sans text-[#1A1F25]/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Garantien — 90-dagers verdigaranti */}
        <section className="mb-16 bg-gradient-to-br from-[#1A6B6D]/8 to-[#4FC3B0]/5 border border-[#1A6B6D]/20 rounded-2xl p-6 md:p-10">
          <div className="font-data text-[10px] text-[#1A6B6D] uppercase tracking-[0.2em] font-semibold mb-3">
            <span aria-hidden="true">★</span> Inkludert i alle partneravtaler
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
                <CheckCircle size={20} className="text-[#1A6B6D] flex-shrink-0 mt-0.5" aria-hidden="true" />
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
                <CheckCircle size={20} className="text-[#1A6B6D] flex-shrink-0 mt-1" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Når passer det ikke */}
        <section className="mb-16 bg-[#1A1F25]/4 border-l-2 border-[#1A6B6D] rounded-r-xl p-6 md:p-7">
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
            className="btn-magnetic inline-flex rounded-full px-7 py-3.5 text-sm bg-[#C4854C] text-[#F5F2EC] font-heading font-medium tracking-tight no-underline"
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
