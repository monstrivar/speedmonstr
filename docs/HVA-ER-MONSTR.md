# Hva er Monstr?

## Kort oppsummering

Monstr er et norsk SaaS-produkt som automatiserer hastighetsrespons på kundehenvendelser for håndverks- og servicebedrifter. Når en potensiell kunde sender inn en henvendelse via nettskjema, annonse eller annen kanal, sørger Monstr for at de får en personlig SMS-respons innen 30-60 sekunder — automatisk, med bedriftens navn som avsender.

## Problemet vi løser

Håndverkere og servicebedrifter (rørleggere, elektrikere, malere, snekkere, verksteder) mottar henvendelser via nettskjemaer, annonser, Google Business og Finn.no, men bruker ofte timer eller dager på å svare. I mellomtiden kontakter kundene konkurrenter og velger den som svarer først.

**Nøkkelstatistikk:** Bedrifter som svarer innen 5 minutter er 21 ganger mer sannsynlig å lande kunden.

Hver tapt rask respons = tapt kunde = tusenvis til hundretusenvis i tapte inntekter per år per bedrift.

## Løsningen

Monstr fanger opp henvendelser fra alle kilder (nettskjema, Meta-annonser, Google Ads, booking-systemer, Finn.no) og:

1. **Sender personlig SMS automatisk** innen 30-60 sekunder — mens kunden fortsatt har telefonen i hånden
2. **Varsler bedriftseieren/teamet** via SMS, Telegram eller e-post om at en ny henvendelse har kommet inn
3. **Logger alt i et dashbord** med tidslinje, status og oppfølgingssporing
4. **Eskalerer** dersom ingen følger opp innen en gitt tid (f.eks. 2 timer → SMS til salgsleder, 4 timer → SMS til daglig leder)

## Hvem er Monstr for?

### Ideell kunde
- Håndverks- eller servicebedrift med 1-50 ansatte
- Mottar 10+ henvendelser per måned
- Kundeverdi per jobb 5 000+ kr
- Har variabel responstid (noen ganger raskt, ofte sent)
- Mister kunder til konkurrenter som svarer raskere
- Ønsker å skalere uten å ansette flere folk

### Ikke ideell kunde
- Får svært få henvendelser (under 10/mnd)
- Alle kunder ringer (ingen digitale skjemaer)
- Har ikke bygget en pålitelig kilde til henvendelser ennå
- Problemet er å skaffe leads, ikke hastighet på respons

## Prismodell

### Graduert prisstige

Én plan — alle kunder får samme produkt. Prisen øker med 20% for hver 5. kunde:

| Kohort | Kunde nr. | Pris/mnd |
|--------|-----------|----------|
| 1 | 1–5 | 2 999 kr |
| 2 | 6–10 | 3 599 kr |
| 3 | 11–15 | 4 319 kr |
| 4 | 16–20 | 5 183 kr |
| 5 | 21–25 | 6 219 kr |
| 6 | 26–30 | 7 463 kr |

Hver kunde beholder sin pris. Årlig betaling gir 50% rabatt.

### Produktomfang (alle kohorter)
- Auto-respons SMS innen 30–60 sekunder
- Personlig SMS med bedriftens navn som avsender
- Varsling til eier/team via SMS, Telegram eller e-post
- Opptil 2 leadkilder (nettskjema, annonser, etc.)
- 3-trinns SMS-oppfølgingssekvens over 7 dager
- 14 dagers gratis prøveperiode

### Kontraktsvilkår
- Ingen bindingstid
- Månedlig fakturering
- SMS-kostnader viderefaktureres til kostpris (typisk 100–300 kr/mnd)
- Gratis oppsett

Se `docs/salg/PRISMODELL.md` for full prismodell, årlige priser og implementeringsdetaljer.

## Verdiforslaget i tall

For en typisk håndverksbedrift med:
- 30 henvendelser/mnd
- Kundeverdi 25 000 kr/jobb
- 30% konverteringsrate (bransjestandard)
- Nåværende responstid: 2-4 timer

**Uten Monstr:** ~9 av 30 konverterer = 225 000 kr/mnd
**Med Monstr (21x raskere respons → høyere konvertering):** Selv en økning fra 30% til 40% konvertering = 3 ekstra kunder/mnd = +75 000 kr/mnd i ekstra omsetning — for fra 2 999 kr/mnd i abonnement.

## Forretningsmodell

1. **Speed-to-lead (kjerne):** Månedlige SaaS-abonnementer fra 2 999 kr/mnd (graduert prisstige)
2. **Generelle automatiseringer:** Skreddersydde prosjekter (engangs, høyere margin)
3. **Rådgivning:** Timebasert rådgivning for større kunder

## Teknisk oversikt

- **Frontend:** React 19 + Vite, Tailwind CSS, GSAP-animasjoner
- **Backend:** Vercel Serverless Functions (Node.js)
- **Database/CRM:** Airtable (nå), Supabase (dashbord-fase)
- **SMS:** Twilio
- **Varslinger:** Telegram Bot API
- **Automatisering:** Make.com / n8n
- **Hosting:** Vercel med automatisk deploy fra Git

## Teamet

Grunnlagt av Ivar Knutsen — tidligere rørlegger, nå AI/automatiseringsekspert. To-personers team i oppstartsfasen. Bygger med moderne AI-verktøy (Claude Code, GPT-4) for å levere på nivået til et 10-personers byrå.

## Målsettinger

- **Måned 1-3:** 2-3 nye kunder/mnd
- **Måned 4-6:** 4-5 nye kunder/mnd
- **Måned 7-12:** 5-7 nye kunder/mnd
- **År 1 mål:** 21-42 kunder, 51-114k MRR
- **Break-even:** Måned 2-3 (trenger kun 2 kunder à 2 999 kr for å dekke faste kostnader)
- **Full tid:** Måned 9 (80k MRR)
- **Lokasjonsuavhengig:** Måned 12+
