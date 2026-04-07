import { Link } from 'react-router-dom';
import BlogLayout from './BlogLayout';

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Hva er speed-to-lead? Slik øker du salg med raskere oppfølging av leads',
  description: 'Lær hva speed-to-lead er, hvorfor raske svar på leads er kritisk, og hvordan norske bedrifter mister salg på treg oppfølging.',
  author: { '@type': 'Organization', name: 'Monstr' },
  publisher: { '@type': 'Organization', name: 'Monstr', url: 'https://monstr.no' },
  mainEntityOfPage: 'https://monstr.no/blogg/hva-er-speed-to-lead',
  inLanguage: 'nb-NO',
};

const Article1 = () => {
  return (
    <BlogLayout
      title="Hva er speed-to-lead? Slik øker du salg med raskere oppfølging av leads"
      metaDescription="Lær hva speed-to-lead er, hvorfor raske svar på leads er kritisk, og hvordan norske bedrifter mister salg på treg oppfølging — og hva du kan gjøre med det."
      slug="hva-er-speed-to-lead"
      schema={schema}
    >
      <h2 className="font-heading font-bold text-2xl text-dark mt-10">Hva betyr «speed-to-lead»?</h2>
      <p>Speed-to-lead handler om hvor raskt du følger opp en ny henvendelse fra en potensiell kunde — fra de sender inn et skjema eller en forespørsel, til de faktisk hører fra deg.</p>
      <p>Det er ikke et «nice to have», men en direkte driver for hvor mange av leadsene dine som blir til kunder.</p>
      <p>Når en potensiell kunde sender inn et skjema, er det fordi problemet deres er aktivt akkurat nå. De vurderer deg — men de vurderer sannsynligvis også konkurrentene dine. Den som svarer først, har en enorm fordel.</p>

      <h2 className="font-heading font-bold text-2xl text-dark mt-10">Hvorfor er tid kritisk for leads?</h2>
      <p>Tenk på egne kjøpsprosesser:</p>
      <p>Du sender inn et skjema til to-tre leverandører. Den ene ringer deg tilbake på fem minutter. De andre svarer neste dag — eller aldri. Hvem er du mest positivt innstilt til?</p>
      <p>I praksis ser vi ofte at:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Etter 5-10 minutter faller sannsynligheten for å få tak i leadet merkbart.</li>
        <li>Etter 1-2 timer har leadet ofte snakket med noen andre — eller mistet momentet.</li>
        <li>Etter 24 timer er du i «vi bryr oss ikke egentlig»-sonen i hodet til kunden, uansett hvor gode dere egentlig er.</li>
      </ul>

      <h2 className="font-heading font-bold text-2xl text-dark mt-10">Typiske konsekvenser av treg speed-to-lead i norske bedrifter</h2>
      <p>Når norske SMB-er har treg oppfølging, ser vi ofte de samme symptomene:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Mange «varme» leads som aldri blir ringt.</li>
        <li>Selgere som sier «det er for få leads», mens det egentlig er for få gode oppfølginger.</li>
        <li>Kundereiser som stopper etter skjemaet: «Takk for henvendelsen, vi tar kontakt» — og så skjer ingenting.</li>
        <li>Ledelsen tror problemet er markedsføring, ikke responsid.</li>
      </ul>
      <p>Summen er enkel: Du betaler for trafikk og leads, men lar konkurrentene ta inntektene.</p>

      <h2 className="font-heading font-bold text-2xl text-dark mt-10">Hvor raskt bør du svare på leads?</h2>
      <p>Det perfekte svaret er nesten alltid: «så raskt som mulig». I praksis betyr det at bedrifter bør ha et mål om:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Første respons innen 1-5 minutter i åpningstiden.</li>
        <li>Automatisert, personlig bekreftelse døgnet rundt.</li>
        <li>Strukturert oppfølgingssekvens hvis leadet ikke svarer på første forsøk.</li>
      </ul>
      <p>Poenget er ikke at alt må være 100% perfekt manuelt. Poenget er at leadet skal føle: «De tok meg på alvor med en gang.»</p>

      <h2 className="font-heading font-bold text-2xl text-dark mt-10">Hvorfor manuell oppfølging ofte feiler</h2>
      <p>De fleste norske bedrifter forsøker å løse dette manuelt: Skjema går til en fellespostkasse. En selger eller resepsjon skal «følge med og ringe». I praksis skjer det når noen har tid.</p>
      <p>Resultatet er forutsigbart: Responsid varierer fra 5 minutter til 3 dager. Oppfølgingen er personavhengig. Ingen har egentlig kontroll på hvor mange leads som faktisk blir fulgt opp.</p>
      <p>Det er her systematisert speed-to-lead kommer inn — med klare regler, automatiske responser og strukturert oppfølging. <Link to="/blogg/speed-to-lead-feil" className="text-accent underline decoration-2 underline-offset-4 hover:text-dark transition-colors">Se de 7 vanligste feilene bedrifter gjør med speed-to-lead.</Link></p>

      <h2 className="font-heading font-bold text-2xl text-dark mt-10">Hvordan et godt speed-to-lead-oppsett ser ut</h2>
      <p>Et moderne oppsett for speed-to-lead kan for eksempel se slik ut:</p>
      <ol className="list-decimal pl-6 space-y-2">
        <li>Skjemainnsending — går direkte inn i et system (ikke bare e-post).</li>
        <li>Leadet får umiddelbart en personlig bekreftelse (SMS eller e-post) med riktig tone, på norsk.</li>
        <li>Selger/ansvarlig får et varsel med all info om leadet og forslag til neste steg.</li>
        <li>Hvis ingen tar kontakt innen X minutter, trigges en påminnelse.</li>
        <li>Hvis det fortsatt ikke er kontakt, går leadet inn i en kort oppfølgingssekvens (f.eks. SMS + e-post over noen dager).</li>
      </ol>
      <p>Nøkkelen er forutsigbarhet: Hver lead får samme minimumsstandard — hver gang. <Link to="/blogg/speed-to-lead-prosess" className="text-accent underline decoration-2 underline-offset-4 hover:text-dark transition-colors">Les hvordan du setter opp en enkel speed-to-lead-prosess steg for steg.</Link></p>

      <h2 className="font-heading font-bold text-2xl text-dark mt-10">Fra magefølelse til målbare tall</h2>
      <p>Den store fordelen når du tar speed-to-lead på alvor, er at du kan måle: Hvor raskt dere faktisk svarer. Hvor mange leads som blir til møter eller tilbud. Hvilke kanaler som gir best leads.</p>
      <p>Da kan du ta beslutninger basert på fakta, ikke magefølelse («det føles som vi ringer raskt»).</p>
    </BlogLayout>
  );
};

export default Article1;
