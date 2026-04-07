import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';

const Vilkar = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Brukervilkår | Monstr</title>
        <meta name="description" content="Brukervilkår for Monstr. Les om vilkårene for bruk av våre tjenester." />
        <link rel="canonical" href="https://monstr.no/vilkar" />
      </Helmet>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-dark/10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-heading font-bold text-xl text-dark">Monstr</Link>
          <Link to="/" className="font-sans text-sm text-dark/60 hover:text-dark transition-colors flex items-center gap-2">
            <ArrowLeft size={16} /> Tilbake til forsiden
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 pt-28 pb-24">
        <h1 className="font-heading font-bold text-3xl md:text-5xl text-dark tracking-tight leading-tight mb-8">Brukervilkår</h1>
        <p className="font-sans text-dark/50 text-sm mb-12">Sist oppdatert: 31. mars 2026</p>

        <div className="font-sans text-dark/80 text-lg leading-relaxed space-y-6">

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">1. Om tjenesten</h2>
          <p>Monstr leverer et automatisert speed-to-lead-system som sørger for at innkommende leads fra kontaktskjemaer, annonser og andre kanaler mottar umiddelbar oppfølging via SMS og/eller e-post. Tjenesten konfigureres og driftes av Monstr på vegne av kunden.</p>

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">2. Avtalepartene</h2>
          <p>Disse vilkårene gjelder mellom Monstr, org.nr. 933 378 179, heretter «Leverandøren», og bedriften som inngår avtale om bruk av tjenesten, heretter «Kunden».</p>

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">3. Tjenestens omfang</h2>
          <p>Leverandøren forplikter seg til å:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Sette opp og konfigurere automatisert leadrespons basert på kundens eksisterende leadkilder.</li>
            <li>Sende automatiske, personlige SMS og/eller e-postmeldinger til nye leads innen sekunder etter mottak.</li>
            <li>Gi kunden tilgang til en oversikt over innkommende leads med scoring og prioritering.</li>
            <li>Drifte og vedlikeholde systemet i avtaleperioden.</li>
          </ul>
          <p>Kunden forplikter seg til å gi Leverandøren nødvendig tilgang til skjemaer, annonseplattformer og andre systemer som kreves for å levere tjenesten.</p>

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">4. Priser og betaling</h2>
          <p>Tjenesten faktureres månedlig i henhold til gjeldende prisliste. Per 31. mars 2026 er gjeldende priser:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Standard:</strong> 2 999 NOK per måned ekskl. mva.</li>
            <li><strong>Enterprise:</strong> 6 000 NOK per måned ekskl. mva.</li>
          </ul>
          <p>Faktura sendes ved månedsskifte med 14 dagers betalingsfrist. Ved forsinket betaling tilkommer forsinkelsesrente i henhold til forsinkelsesrenteloven.</p>

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">5. Prøveperiode</h2>
          <p>Kvalifiserte bedrifter kan tilbys en 14-dagers prøveperiode uten kostnad. Prøveperioden gir full tilgang til Standard-tjenesten. Etter prøveperioden starter abonnementet automatisk med mindre kunden skriftlig avslutter innen prøveperiodens utløp.</p>

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">6. Oppsigelse</h2>
          <p>Begge parter kan si opp avtalen med 30 dagers skriftlig varsel. Oppsigelse kan sendes via e-post. Ved oppsigelse avsluttes tjenesten ved utløpet av inneværende faktureringsperiode. Det gis ingen refusjon for allerede fakturerte perioder.</p>

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">7. Databehandling</h2>
          <p>Leverandøren opptrer som databehandler på vegne av Kunden for personopplysninger som behandles gjennom tjenesten (leads fra kundens kunder). En separat databehandleravtale inngås ved oppstart av kundeforholdet. Leverandøren forplikter seg til å behandle alle personopplysninger i henhold til GDPR og gjeldende norsk personvernlovgivning.</p>

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">8. Tilgjengelighet og ansvar</h2>
          <p>Leverandøren tilstreber 99,5 % oppetid for tjenesten, men garanterer ikke uavbrutt drift. Leverandøren er ikke ansvarlig for tap som skyldes nedetid hos tredjepartsleverandører (Twilio, Airtable, Vercel), force majeure, eller feil i kundens egne systemer. Leverandørens samlede erstatningsansvar er begrenset til beløpet kunden har betalt for tjenesten de siste 3 månedene.</p>

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">9. Immaterielle rettigheter</h2>
          <p>Alle rettigheter til systemet, konfigurasjonen og den underliggende teknologien tilhører Leverandøren. Kunden beholder alle rettigheter til sine egne data, herunder leaddata og kundeinformasjon. Ved oppsigelse har kunden rett til å eksportere sine data i et strukturert format innen 30 dager.</p>

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">10. Konfidensialitet</h2>
          <p>Begge parter forplikter seg til å behandle all informasjon mottatt fra den andre parten konfidensielt. Denne forpliktelsen gjelder også etter avtalens opphør. Konfidensialitetsplikten omfatter ikke informasjon som er allment tilgjengelig eller som parten lovlig har mottatt fra tredjeparter.</p>

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">11. Tvister og lovvalg</h2>
          <p>Disse vilkårene er underlagt norsk lov. Eventuelle tvister søkes løst gjennom forhandlinger. Dersom partene ikke oppnår enighet, avgjøres tvisten ved de alminnelige domstoler med Skien tingrett som verneting.</p>

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">12. Endringer i vilkårene</h2>
          <p>Leverandøren forbeholder seg retten til å endre disse vilkårene. Vesentlige endringer varsles skriftlig minst 30 dager før ikrafttredelse. Fortsatt bruk av tjenesten etter endringstidspunktet anses som aksept av de oppdaterte vilkårene.</p>
        </div>
      </article>
    </div>
  );
};

export default Vilkar;
