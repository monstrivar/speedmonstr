import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';

const Personvern = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Personvernerklæring | Monstr</title>
        <meta name="description" content="Personvernerklæring for Monstr. Les om hvordan vi samler inn, bruker og beskytter dine personopplysninger." />
        <link rel="canonical" href="https://monstr.no/personvern" />
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
        <h1 className="font-heading font-bold text-3xl md:text-5xl text-dark tracking-tight leading-tight mb-8">Personvernerklæring</h1>
        <p className="font-sans text-dark/50 text-sm mb-12">Sist oppdatert: 31. mars 2026</p>

        <div className="font-sans text-dark/80 text-lg leading-relaxed space-y-6">

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">1. Hvem er behandlingsansvarlig?</h2>
          <p>Monstr, org.nr. 933 378 179, er behandlingsansvarlig for personopplysninger som samles inn via nettsiden monstr.no og tilknyttede tjenester. Kontakt oss på ivar@monstr.no dersom du har spørsmål om vår behandling av personopplysninger.</p>

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">2. Hvilke personopplysninger samler vi inn?</h2>
          <p>Når du fyller ut forespørselsskjemaet på nettsiden vår, samler vi inn følgende opplysninger:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Fornavn og etternavn</li>
            <li>Firmanavn</li>
            <li>E-postadresse</li>
            <li>Telefonnummer</li>
            <li>Nettside-URL</li>
            <li>Svar på kvalifiseringsspørsmål (antall leads, leadkilder, oppfølgingsprosess, kundeverdi, intensjon og beslutningstaker)</li>
          </ul>
          <p>Vi samler ikke inn opplysninger gjennom informasjonskapsler (cookies), sporingspikler, eller tredjepartsanalyse. Nettsiden bruker ingen analyseverktøy som Google Analytics eller lignende.</p>

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">3. Formål og rettslig grunnlag</h2>
          <p>Vi behandler personopplysningene dine for følgende formål:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Vurdere om speed-to-lead er relevant for din bedrift</strong> — basert på kvalifiseringssvarene du oppgir. Rettslig grunnlag: berettiget interesse (GDPR art. 6(1)(f)).</li>
            <li><strong>Kontakte deg for å avtale en samtale</strong> — via telefon, SMS eller e-post. Rettslig grunnlag: berettiget interesse basert på din aktive forespørsel.</li>
            <li><strong>Sende deg en automatisk bekreftelse via SMS</strong> — umiddelbart etter at du har sendt inn skjemaet. Rettslig grunnlag: berettiget interesse som del av tjenestelevering du har etterspurt.</li>
          </ul>

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">4. Hvem deler vi opplysningene med?</h2>
          <p>Vi bruker følgende tredjepartsleverandører for å levere tjenesten:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Airtable (USA)</strong> — lagring og organisering av forespørsler. Overføring til USA er dekket av Airtables Data Privacy Framework-sertifisering.</li>
            <li><strong>Twilio (USA)</strong> — utsendelse av SMS. Overføring til USA er dekket av Twilios Data Privacy Framework-sertifisering.</li>
            <li><strong>Vercel (USA)</strong> — hosting av nettsiden og serverløse funksjoner. Overføring til USA er dekket av Vercels Data Privacy Framework-sertifisering.</li>
          </ul>
          <p>Vi selger aldri personopplysningene dine til tredjeparter. Vi deler kun opplysninger med leverandørene som er nødvendige for å levere tjenesten.</p>

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">5. Overføring til land utenfor EØS</h2>
          <p>Våre leverandører (Airtable, Twilio, Vercel) er basert i USA. Overføring av personopplysninger til USA skjer i henhold til EU-US Data Privacy Framework, som sikrer et tilstrekkelig beskyttelsesnivå i samsvar med GDPR. Dersom rammeverket endres, vil vi oppdatere denne erklæringen og iverksette alternative overføringsmekanismer (f.eks. Standard Contractual Clauses).</p>

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">6. Hvor lenge lagrer vi opplysningene?</h2>
          <p>Vi lagrer personopplysningene dine så lenge det er nødvendig for å vurdere og følge opp din forespørsel. Dersom vi ikke inngår en avtale, slettes opplysningene innen 12 måneder etter siste kontakt. Dersom du blir kunde, lagres opplysningene så lenge kundeforholdet varer, pluss 12 måneder etter avsluttet avtale for eventuell oppfølging.</p>

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">7. Dine rettigheter</h2>
          <p>Du har følgende rettigheter etter GDPR:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Innsyn</strong> — du kan be om å se hvilke opplysninger vi har om deg.</li>
            <li><strong>Retting</strong> — du kan be om at feilaktige opplysninger blir rettet.</li>
            <li><strong>Sletting</strong> — du kan be om at opplysningene dine blir slettet.</li>
            <li><strong>Begrensning</strong> — du kan be om at behandlingen begrenses.</li>
            <li><strong>Dataportabilitet</strong> — du kan be om å motta opplysningene dine i et strukturert format.</li>
            <li><strong>Innsigelse</strong> — du kan protestere mot behandling basert på berettiget interesse.</li>
          </ul>
          <p>For å utøve dine rettigheter, kontakt oss på ivar@monstr.no. Vi svarer innen 30 dager.</p>

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">8. Klagerett</h2>
          <p>Dersom du mener at vi behandler personopplysningene dine i strid med GDPR, har du rett til å klage til Datatilsynet (datatilsynet.no).</p>

          <h2 className="font-heading font-bold text-2xl text-dark mt-10">9. Endringer i personvernerklæringen</h2>
          <p>Vi kan oppdatere denne erklæringen ved behov. Vesentlige endringer vil bli kommunisert via nettsiden. Siste oppdateringsdato vises øverst i dokumentet.</p>
        </div>
      </article>
    </div>
  );
};

export default Personvern;
