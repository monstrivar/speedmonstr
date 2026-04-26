import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';

const Vilkar = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Brukervilkår | Agentik</title>
        <meta name="description" content="Brukervilkår for Agentik. Les om vilkårene for bruk av våre tjenester." />
        <link rel="canonical" href="https://agentik.no/vilkar" />
      </Helmet>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-dark/10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-heading font-bold text-xl text-dark">Agentik</Link>
          <Link to="/" className="font-sans text-sm text-dark/60 hover:text-dark transition-colors flex items-center gap-2">
            <ArrowLeft size={16} /> Tilbake til forsiden
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 pt-28 pb-24">
        <h1 className="font-heading font-bold text-3xl md:text-5xl text-dark tracking-tight leading-tight mb-8">Brukervilkår</h1>
        <p className="font-sans text-dark/50 text-sm mb-12">Sist oppdatert: 26. april 2026</p>

        <div className="font-sans text-dark/80 text-lg leading-relaxed space-y-6">

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">1. Om tjenesten</h2>
          <p>Agentik er et AI-studio som blir fast AI-partner for norske bedrifter. Tjenesten leveres som AI-Partner (månedlig partneravtale med kartlegging, bygging og forbedring av AI-løsninger) eller som AI-Workshop. Hver leveranse defineres i en separat avtale med tydelig omfang og pris.</p>

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">2. Avtalepartene</h2>
          <p>Disse vilkårene gjelder mellom Agentik, org.nr. 933 378 179, heretter «Leverandøren», og bedriften som inngår avtale om bruk av tjenesten, heretter «Kunden».</p>

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">3. Tjenestens omfang</h2>
          <p>Leverandøren tilbyr følgende tjenester:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>AI-Partner</strong> — fast månedlig partneravtale. Inkluderer komplett AI-Revisjon (kartlegging av hvor AI gir høyest ROI), månedlig strategimøte, bygging og vedlikehold av AI-løsninger, eget ROI-dashbord, opplæring av teamet, og direkte Slack-tilgang.</li>
            <li><strong>AI-Workshop</strong> — praktiske halvdags- og heldagsworkshops i AI-verktøy og bruk i arbeidshverdagen.</li>
            <li><strong>Enkeltprosjekter</strong> — design og bygging av spesifikke AI-løsninger utenfor en partneravtale, prises separat per prosjekt.</li>
          </ul>
          <p>Omfang, leveranser, tidsramme og ansvarsfordeling avtales spesifikt per prosjekt i egen oppdragsavtale.</p>

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">4. Priser og betaling</h2>
          <p>Gjeldende priser (alle eks. mva.):</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>AI-Partner:</strong> 39 000 kr/mnd (Founding-pris for de første 3 partnerne, deretter 49 000 kr/mnd). Ingen binding etter 90 dager.</li>
            <li><strong>AI-Workshop (halvdag):</strong> fra 25 000 kr.</li>
            <li><strong>AI-Workshop (heldag):</strong> 35 000 – 50 000 kr.</li>
            <li><strong>Enkeltprosjekter:</strong> prises etter omfang.</li>
          </ul>
          <p>AI-Partner faktureres månedlig forskuddsvis. Software- og API-kostnader fra tredjeparter kommer i tillegg og betales direkte av Kunden. Faktura sendes i henhold til avtale, med 14 dagers betalingsfrist. Ved forsinket betaling tilkommer forsinkelsesrente i henhold til forsinkelsesrenteloven.</p>

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">5. 90-dagers verdigaranti</h2>
          <p>For AI-Partner gjelder 90-dagers verdigaranti: Innen 90 dager skal Leverandøren ha kartlagt, prioritert og implementert AI- og automasjonstiltak med dokumentert årlig verdipotensial tilsvarende minst 2x Kundens investering i perioden. Hvis dette ikke oppnås, jobber Leverandøren videre uten månedlig honorar i opptil 90 ekstra dager. Dersom verdien fortsatt ikke er dokumentert etter denne perioden, refunderes siste fakturerte måned.</p>
          <p>Garantien forutsetter at Kunden gir nødvendige systemtilganger innen avtalt tid, stiller med én intern kontaktperson, deltar på avtalte møter og workshops, gir tilbakemelding innen avtalt frist, tar i bruk løsningene som er avtalt, og har tilstrekkelig volum eller repetitive prosesser til at verdipotensialet er realistisk. Definisjon av "dokumentert verdipotensial" og målbare kriterier skrives inn i oppdragsavtalen ved oppstart.</p>

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">6. Oppsigelse</h2>
          <p>AI-Partner har 90 dagers oppstartsfase (Sprint), deretter månedlig oppsigelse fra begge parter. Oppsigelse i Sprint-perioden krever skriftlig avtale. AI-Workshop og enkeltprosjekter kan ikke avbestilles uten avtale etter oppstart. Ved avbestilling før oppstart refunderes innbetalt beløp i sin helhet.</p>

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">7. Databehandling</h2>
          <p>Under AI-Partner-arbeid og prosjekter kan Leverandøren få tilgang til personopplysninger og annen konfidensiell informasjon fra Kunden. En separat databehandleravtale inngås ved behov. Leverandøren forplikter seg til å behandle alle personopplysninger i henhold til GDPR og gjeldende norsk personvernlovgivning.</p>

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">8. Leveranse og ansvar</h2>
          <p>Leverandøren leverer etter beste evne og bransjestandard. Leverandøren er ikke ansvarlig for tap som skyldes feil i underliggende AI-modeller fra tredjepartsleverandører (f.eks. Anthropic, OpenAI, Google), nedetid hos slike leverandører, eller force majeure. Leverandørens samlede erstatningsansvar er begrenset til beløpet Kunden har betalt for det aktuelle prosjektet.</p>

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">9. Immaterielle rettigheter</h2>
          <p>Kunden får bruksrett til leveranser og kildekode produsert i prosjektet. Leverandøren beholder rettigheter til generiske metoder, mønstre, maler og underliggende teknologi utviklet før eller utenfor prosjektet. Kunden beholder alle rettigheter til egne data, forretningsinformasjon og domenekunnskap.</p>

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">10. Konfidensialitet</h2>
          <p>Begge parter forplikter seg til å behandle all informasjon mottatt fra den andre parten konfidensielt. Denne forpliktelsen gjelder også etter avtalens opphør. Konfidensialitetsplikten omfatter ikke informasjon som er allment tilgjengelig eller som parten lovlig har mottatt fra tredjeparter.</p>

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">11. Tvister og lovvalg</h2>
          <p>Disse vilkårene er underlagt norsk lov. Eventuelle tvister søkes løst gjennom forhandlinger. Dersom partene ikke oppnår enighet, avgjøres tvisten ved de alminnelige domstoler med Skien tingrett som verneting.</p>

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">12. Endringer i vilkårene</h2>
          <p>Leverandøren forbeholder seg retten til å endre disse vilkårene. Vesentlige endringer varsles skriftlig minst 30 dager før ikrafttredelse.</p>
        </div>
      </article>
    </div>
  );
};

export default Vilkar;
