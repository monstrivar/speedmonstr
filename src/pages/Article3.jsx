import { Link } from 'react-router-dom';
import BlogLayout from './BlogLayout';

const schema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Hva skjer når leads havner i en felles e-postboks?', acceptedAnswer: { '@type': 'Answer', text: 'Noen leads blir besvart raskt, andre blir liggende. Ingen har eierskap. Løsningen er å la leads gå inn i en dedikert pipeline der hver lead får en ansvarlig og status.' } },
    { '@type': 'Question', name: 'Hvorfor er det viktig med tidsfrist for første respons?', acceptedAnswer: { '@type': 'Answer', text: 'Uten definert standard svarer folk når de har tid, ikke når kunden er varmest. Definer en tydelig standard: alle leads skal ha første respons innen 15 minutter i åpningstiden.' } },
    { '@type': 'Question', name: 'Hvorfor feiler generiske førsteresponser?', acceptedAnswer: { '@type': 'Answer', text: 'Generiske e-poster som kunne vært sendt til hvem som helst dreper momentet. Bruk fornavnet, referer til det de spurte om, og si hva som skjer videre.' } },
    { '@type': 'Question', name: 'Hva er risikoen når alt ansvar ligger på én person?', acceptedAnswer: { '@type': 'Answer', text: 'Er vedkommende opptatt, syk eller på ferie, stopper alt opp. Del ansvar, definer backup, og bygg prosess i stedet for å være avhengig av enkeltpersoner.' } },
    { '@type': 'Question', name: 'Hvorfor trenger man strukturert oppfølging?', acceptedAnswer: { '@type': 'Answer', text: 'Mange ringer én gang og gir opp. Kunden kan være opptatt. En forhåndsdefinert oppfølgingssekvens over noen dager sikrer at ingen leads faller mellom stolene.' } },
    { '@type': 'Question', name: 'Hvorfor er data viktig for speed-to-lead?', acceptedAnswer: { '@type': 'Answer', text: 'Uten data vet du ikke om dere faktisk har blitt bedre. Mål tid til første respons, antall kontakter per lead, og andel leads som blir til møter.' } },
    { '@type': 'Question', name: 'Kan teknologi alene løse speed-to-lead?', acceptedAnswer: { '@type': 'Answer', text: 'Nei. Teknologi uten tydelige regler hjelper lite. Start med enkel definisjon av et lead, klar standard for responsid, og enkle oppfølgingstrinn. Bruk teknologien til å støtte prosessen.' } },
  ],
};

const Article3 = () => {
  return (
    <BlogLayout
      title="7 vanlige speed-to-lead-feil som kveler salget — og hvordan du fikser dem"
      metaDescription="Unngå de vanligste feilene med speed-to-lead. 7 typiske fallgruver norske bedrifter gjør når de følger opp leads — og konkrete forslag til hvordan du løser dem."
      slug="speed-to-lead-feil"
      schema={schema}
    >
      <p>De fleste norske bedrifter vet at rask oppfølging er viktig. Likevel gjør de de samme feilene, gang etter gang. Her er de 7 vanligste — og hva du kan gjøre med dem. <Link to="/blogg/hva-er-speed-to-lead" className="text-accent underline decoration-2 underline-offset-4 hover:text-dark transition-colors">Les grunnleggende om speed-to-lead her.</Link></p>

      <h2 className="font-heading font-bold text-2xl text-dark mt-10">Feil 1: Leadet havner i en felles e-postboks</h2>
      <p>Det kanskje vanligste problemet er at alle henvendelser går til en felles e-postadresse: post@, firmapost@ eller kontakt@. Der blir de liggende sammen med alt mulig annet — fakturaer, leverandørhenvendelser og spam.</p>
      <p><strong>Konsekvens:</strong> Noen leads blir besvart raskt, andre blir liggende. Ingen har eierskap, og ingen har full oversikt.</p>
      <p><strong>Løsning:</strong> La leads gå inn i en dedikert pipeline eller liste der hver lead får en ansvarlig og status. E-post kan fortsatt brukes, men som varsel — ikke som eneste system.</p>

      <h2 className="font-heading font-bold text-2xl text-dark mt-10">Feil 2: Ingen klar tidsfrist for første respons</h2>
      <p>«Vi svarer så fort vi kan» er ikke en strategi. Det er en unnskyldning.</p>
      <p>Når det ikke finnes en definert standard, blir det til at folk svarer når de har tid — ikke når kunden er varmest.</p>
      <p><strong>Løsning:</strong> Definer en tydelig standard, for eksempel: «Alle leads skal ha første respons innen 15 minutter i åpningstiden.» «Leads som kommer på kveldstid, får automatisk bekreftelse og blir ringt neste virkedag før kl. 09:30.» Og — følg den opp.</p>

      <h2 className="font-heading font-bold text-2xl text-dark mt-10">Feil 3: Første respons er kald og generisk</h2>
      <p>Hvis første svar er en generisk e-post som kunne vært sendt til hvem som helst — gjerne dagen etter — forsvinner mye av momentumet.</p>
      <div className="bg-dark text-primary/90 font-data text-sm p-6 rounded-2xl border border-primary/20 my-4">
        Dårlig: «Vi har mottatt din henvendelse. Vi vil komme tilbake til deg.»
      </div>
      <p>Kunden vet fortsatt ingenting om hva som skjer, eller når.</p>
      <p><strong>Løsning:</strong> Gjør første respons varm, konkret og forventningssettende. Bruk fornavnet deres. Referer til det de faktisk har spurt om. Si hva som skjer videre — og når.</p>

      <h2 className="font-heading font-bold text-2xl text-dark mt-10">Feil 4: Alt ansvar ligger på én person</h2>
      <p>I mange SMB-er er det én person som «eier» alle leads. Er vedkommende i møte, syk eller på ferie, stopper alt opp.</p>
      <p><strong>Løsning:</strong> Del ansvar og bygg prosess, ikke helter. Definer hvem som har primæransvar, hvem som er backup, og hvordan nye leads fordeles mellom selgere.</p>

      <h2 className="font-heading font-bold text-2xl text-dark mt-10">Feil 5: Ingen strukturert oppfølging når du ikke får tak i leadet</h2>
      <p>Mange ringer én gang. Hvis kunden ikke svarer, dør leadet.</p>
      <p>Men kundens liv er også travelt. De kan sitte i møte, være på reise eller bare ikke rekke å ta telefonen. Det betyr ikke at de ikke er interessert.</p>
      <p><strong>Løsning:</strong> Lag en enkel oppfølgingssekvens som er definert på forhånd:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Forsøk 1:</strong> Telefon + SMS hvis du ikke får tak i dem.</li>
        <li><strong>Forsøk 2:</strong> Ny SMS eller e-post dagen etter.</li>
        <li><strong>Forsøk 3:</strong> Siste høflige melding noen dager senere.</li>
      </ul>
      <p>Da slipper selgerne å «føle seg masete», fordi det finnes en felles standard.</p>

      <h2 className="font-heading font-bold text-2xl text-dark mt-10">Feil 6: Manglende data — dere gjetter på hva som fungerer</h2>
      <p>Uten data vet du ikke om speed-to-lead faktisk har blitt bedre. Typisk situasjon: «Vi føler at vi svarer raskt nå.» Ingen vet hva gjennomsnittlig responstid faktisk er. Ingen kan si hvor mange leads som faktisk blir kontaktet.</p>
      <p><strong>Løsning:</strong> Mål det viktigste: Tid til første respons. Antall kontakter per lead. Andel leads som blir til møter eller tilbud. Du trenger ikke et avansert system — det viktigste er at tallene finnes og blir brukt.</p>

      <h2 className="font-heading font-bold text-2xl text-dark mt-10">Feil 7: Alt forsøkes løst med teknologi, uten tydelige rammer</h2>
      <p>Noen går motsatt vei og tror at problemet er «verktøyene». De kjøper et stort CRM, innfører nye systemer og integrasjoner — men glemmer å etablere en enkel, tydelig prosess.</p>
      <p>Teknologi uten tydelige regler hjelper lite.</p>
      <p><strong>Løsning:</strong> Start alltid med en enkel definisjon av et lead, klar standard for responsid, og et enkelt sett med oppfølgingstrinn. Bruk teknologien til å støtte prosessen, ikke omvendt.</p>

      <p className="mt-8"><Link to="/blogg/speed-to-lead-prosess" className="text-accent underline decoration-2 underline-offset-4 hover:text-dark transition-colors">Les videre: Slik setter du opp en enkel speed-to-lead-prosess steg for steg.</Link></p>
    </BlogLayout>
  );
};

export default Article3;
