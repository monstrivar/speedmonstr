import { Link } from 'react-router-dom';
import BlogLayout from './BlogLayout';

const schema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Slik setter du opp en enkel speed-to-lead-prosess',
  description: 'Enkelt rammeverk for speed-to-lead. Gå fra kaotisk oppfølging til en strukturert prosess som svarer leads automatisk.',
  inLanguage: 'nb-NO',
  step: [
    { '@type': 'HowToStep', position: 1, name: 'Definer hva som faktisk er et lead', text: 'Start med å bli konkret: Hva er et lead i deres verden? Poenget er at dere har én tydelig definisjon.' },
    { '@type': 'HowToStep', position: 2, name: 'Kartlegg dagens flyt fra skjema til oppfølging', text: 'Tegn opp dagens flyt: Hvor havner skjemaet? Hvem ser det først? Når tar dere kontakt?' },
    { '@type': 'HowToStep', position: 3, name: 'Innfør en minimumsstandard for alle nye leads', text: 'Første respons innen X minutter i åpningstiden. En kort, personlig melding som bekrefter mottak.' },
    { '@type': 'HowToStep', position: 4, name: 'Automatiser det som bør være likt — hver gang', text: 'Mottak av skjemadata inn i et system, utsendelse av bekreftelses-SMS, varsel til selger.' },
    { '@type': 'HowToStep', position: 5, name: 'Lag en enkel oppfølgingssekvens', text: 'Dag 0: Automatisk bekreftelse + telefon. Dag 1: Oppfølgings-SMS. Dag 3: E-post. Dag 7: Siste sjekk inn.' },
    { '@type': 'HowToStep', position: 6, name: 'Gi selgerne bedre kontekst med en enkel dashboard', text: 'Selgere bør se hvilket skjema leadet kom fra, hva de er interessert i, og status.' },
    { '@type': 'HowToStep', position: 7, name: 'Mål responsid og konvertering', text: 'Mål gjennomsnittlig tid til første respons og hvor mange leads som blir til møter.' },
  ],
};

const Article2 = () => {
  return (
    <BlogLayout
      title="Slik setter du opp en enkel speed-to-lead-prosess — uten dyrt CRM-prosjekt"
      metaDescription="Enkelt rammeverk for speed-to-lead. Lær hvordan du går fra kaotisk oppfølging til en strukturert prosess som svarer leads automatisk og gir selgerne bedre møter."
      slug="speed-to-lead-prosess"
      schema={schema}
    >
      <h2 className="font-heading font-bold text-2xl text-dark mt-10">Hvorfor mange aldri kommer i gang</h2>
      <p>De fleste vet at rask oppfølging er viktig. Likevel skjer det ikke. Årsakene er ofte: «Vi må få på plass et nytt CRM først.» «Vi har ikke tid til å bygge alt rundt det.» «Teknisk sett blir dette komplisert.»</p>
      <p>Resultatet er at ingenting skjer, og leads fortsetter å forsvinne.</p>
      <p>Men du trenger ikke et stort CRM-prosjekt for å få på plass en fungerende <Link to="/blogg/hva-er-speed-to-lead" className="text-accent underline decoration-2 underline-offset-4 hover:text-dark transition-colors">speed-to-lead-prosess</Link>. Du trenger en enkel, fokusert pipeline for nye henvendelser.</p>

      <h2 className="font-heading font-bold text-2xl text-dark mt-10">Steg 1: Definer hva som faktisk er et lead</h2>
      <p>Start med å bli konkret: Hva er et lead i deres verden?</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>«Alle som fyller ut kontaktskjema på nettsiden.»</li>
        <li>«Alle som ber om tilbud via skjema på landingssiden.»</li>
        <li>«Alle som booker konsultasjon.»</li>
      </ul>
      <p>Poenget er at dere har én tydelig definisjon, så alle vet hva som skal ha rask respons.</p>

      <h2 className="font-heading font-bold text-2xl text-dark mt-10">Steg 2: Kartlegg dagens flyt fra skjema til oppfølging</h2>
      <p>Før du automatiserer noe som helst, bør du tegne opp dagens flyt:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Hvor havner skjemaet i dag?</li>
        <li>Hvem ser det først?</li>
        <li>Hvordan blir leadet fordelt til selger eller ansvarlig?</li>
        <li>Når og hvordan tar dere kontakt?</li>
      </ul>
      <p>Denne enkle øvelsen avslører som regel hull: manuell forwarding av e-post, dobbel registrering i Excel/CRM, ingen klare tidsfrister.</p>

      <h2 className="font-heading font-bold text-2xl text-dark mt-10">Steg 3: Innfør en «minimumsstandard» for alle nye leads</h2>
      <p>Lag en enkel regel som gjelder for absolutt alle leads:</p>
      <p>Første respons innen X minutter i åpningstiden (for eksempel 5 eller 15 min). En kort, personlig melding som bekrefter at du har mottatt henvendelsen, forklarer hva som skjer videre, og setter forventning til når de hører fra deg.</p>
      <p>Eksempel på SMS:</p>
      <div className="bg-dark text-primary/90 font-data text-sm p-6 rounded-2xl border border-primary/20 my-4">
        «Hei [navn]! Takk for henvendelsen din til [bedrift]. Vi ser gjennom den nå og tar kontakt i løpet av [tidspunkt]. Har du spørsmål imens, svar på denne meldingen.»
      </div>
      <p>Det alene skaper en helt annen opplevelse for leadet.</p>

      <h2 className="font-heading font-bold text-2xl text-dark mt-10">Steg 4: Automatiser det som bør være likt — hver gang</h2>
      <p>Mye av speed-to-lead kan automatiseres, uten å føles kaldt eller upersonlig.</p>
      <p>Typiske ting som bør automatiseres:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Mottak av skjemadata — inn i et system (ikke bare e-post).</li>
        <li>Utsendelse av bekreftelses-SMS/e-post.</li>
        <li>Varsel til selger eller team på Slack/Teams/SMS.</li>
        <li>Påminnelse hvis ingen har tatt tak i leadet innen X minutter.</li>
      </ul>

      <h2 className="font-heading font-bold text-2xl text-dark mt-10">Steg 5: Lag en enkel oppfølgingssekvens</h2>
      <p>Ikke alle svarer på første forsøk. Derfor bør en speed-to-lead-prosess alltid ha noen enkle, forhåndsdefinerte trinn:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Dag 0:</strong> Lead kommer inn — automatisk bekreftelse + forsøk på telefon.</li>
        <li><strong>Dag 1:</strong> Kort oppfølgings-SMS hvis du ikke fikk tak i dem.</li>
        <li><strong>Dag 3:</strong> Oppfølgings-e-post med forslag til tidspunkt.</li>
        <li><strong>Dag 7:</strong> Siste høflige «sjekk inn».</li>
      </ul>
      <p>Poenget er ikke å mase, men å være ryddig og tydelig.</p>

      <h2 className="font-heading font-bold text-2xl text-dark mt-10">Steg 6: Gi selgerne bedre kontekst — med en enkel dashboard</h2>
      <p>Når selgere får inn et lead, bør de slippe å gjette. Et enkelt dashboard eller oversikt bør gi: Hvilket skjema leadet kom fra, hva de er interessert i, eventuell historikk, og status (kontaktet, avtalt møte, tapt, vunnet).</p>
      <p>Dette trenger ikke være komplisert eller «stor CRM-implementering». Poenget er at selgerne har nok info til å være relevante fra første sekund.</p>

      <h2 className="font-heading font-bold text-2xl text-dark mt-10">Steg 7: Mål responsid og konvertering</h2>
      <p>Til slutt: det som måles, forbedres. En god speed-to-lead-prosess bør gi deg tall på:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Gjennomsnittlig tid til første respons.</li>
        <li>Hvor mange leads som får respons innen målet (f.eks. 15 min).</li>
        <li>Hvor mange leads som blir til møter/avtaler.</li>
      </ul>
      <p>Da kan du gradvis stramme inn: korte ned responstiden, justere meldinger, forbedre oppfølgingssekvensen — og faktisk se effekten.</p>
      <p className="mt-8"><Link to="/blogg/speed-to-lead-feil" className="text-accent underline decoration-2 underline-offset-4 hover:text-dark transition-colors">Neste: Se de 7 vanligste feilene med speed-to-lead — og hvordan du unngår dem.</Link></p>
    </BlogLayout>
  );
};

export default Article2;
