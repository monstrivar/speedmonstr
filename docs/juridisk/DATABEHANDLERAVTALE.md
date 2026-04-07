# Databehandleravtale

**I henhold til personopplysningsloven og GDPR artikkel 28**

---

## 1. Partene

**Behandlingsansvarlig (Kunden):**
- Bedrift: ___________________________
- Org.nr: ___________________________
- Kontaktperson: ___________________________
- E-post: ___________________________

**Databehandler (Leverandøren):**
- Bedrift: Monstr
- Org.nr: 933 378 179
- Kontaktperson: Ivar André Knutsen
- E-post: ivar@monstr.no

---

## 2. Bakgrunn og formål

Denne databehandleravtalen regulerer Leverandørens behandling av personopplysninger på vegne av Kunden i forbindelse med levering av Monstr speed-to-lead-tjenesten.

Leverandøren mottar og behandler personopplysninger fra Kundens innkommende leads (henvendelser via kontaktskjemaer, annonseplattformer og andre leadkilder) for å levere automatisert leadrespons og oppfølging.

Avtalen er et tillegg til tjenesteavtalen mellom partene og gjelder så lenge Leverandøren behandler personopplysninger på vegne av Kunden.

---

## 3. Omfanget av behandlingen

### 3.1 Kategorier av registrerte
- Potensielle kunder (leads) som sender inn henvendelser til Kunden via kontaktskjemaer, annonseplattformer eller andre innkommende kanaler.

### 3.2 Typer personopplysninger
- Fornavn og etternavn
- E-postadresse
- Telefonnummer
- Eventuell tilleggsinformasjon som innhentes gjennom skjemaer (f.eks. firmanavn, interessefelt, forespørselsdetaljer)

### 3.3 Behandlingens art og formål
- Mottak og lagring av leaddata fra Kundens leadkilder
- Utsendelse av automatiske SMS- og/eller e-postmeldinger til leads på vegne av Kunden
- Scoring og prioritering av leads basert på oppgitte data
- Varsling til Kundens ansatte om nye leads
- Presentasjon av leaddata i oversikt/dashboard tilgjengelig for Kunden

### 3.4 Behandlingens varighet
Behandlingen pågår så lenge tjenesteavtalen mellom partene er aktiv. Ved opphør av avtalen slettes alle personopplysninger i henhold til punkt 9.

---

## 4. Leverandørens plikter

Leverandøren skal:

a) Kun behandle personopplysninger i henhold til dokumenterte instrukser fra Kunden, med mindre behandlingen kreves etter EU-rett eller norsk lov.

b) Sikre at personer som er autorisert til å behandle personopplysningene har forpliktet seg til konfidensialitet.

c) Treffe alle tiltak som kreves etter GDPR artikkel 32 for å sikre et passende sikkerhetsnivå, herunder:
   - Kryptering av data under overføring (TLS/HTTPS)
   - Tilgangskontroll til systemer som inneholder personopplysninger
   - Regelmessig gjennomgang av sikkerhetstiltak

d) Ikke engasjere en annen databehandler (underleverandør) uten forutgående skriftlig godkjenning fra Kunden, jf. punkt 6.

e) Bistå Kunden med å oppfylle sine forpliktelser overfor registrerte (innsyn, retting, sletting, dataportabilitet) innen rimelig tid.

f) Bistå Kunden med å sikre overholdelse av forpliktelsene etter GDPR artikkel 32-36, herunder vurdering av personvernkonsekvenser.

g) Slette eller tilbakelevere alle personopplysninger etter avslutning av tjenesten, jf. punkt 9.

h) Gjøre tilgjengelig for Kunden all informasjon som er nødvendig for å påvise overholdelse av forpliktelsene i GDPR artikkel 28.

---

## 5. Kundens plikter

Kunden skal:

a) Sikre at det foreligger gyldig rettslig grunnlag for innsamling og behandling av personopplysningene (f.eks. berettiget interesse eller samtykke).

b) Informere sine registrerte (leads) om at personopplysningene behandles av en databehandler, og om formålet med behandlingen.

c) Gi Leverandøren klare og dokumenterte instrukser for behandlingen.

d) Varsle Leverandøren umiddelbart dersom det oppdages feil eller mangler i behandlingen.

---

## 6. Underleverandører

Kunden gir herved forhåndsgodkjenning til bruk av følgende underleverandører:

| Underleverandør | Tjeneste | Lokasjon |
|---|---|---|
| Airtable | Datalagring og organisering | USA (EU-US DPF) |
| Twilio | SMS-utsendelse | USA (EU-US DPF) |
| Vercel | Hosting og serverløse funksjoner | USA (EU-US DPF) |
| Telegram | Varsling til kundens ansatte | EU/global |

Leverandøren skal informere Kunden skriftlig om eventuelle planlagte endringer i underleverandører minst 30 dager før endringen trer i kraft. Kunden har rett til å motsette seg endringen innen 14 dager etter varsel.

---

## 7. Overføring til tredjeland

Personopplysninger overføres til USA gjennom bruk av underleverandørene nevnt i punkt 6. Overføringen skjer i henhold til EU-US Data Privacy Framework (DPF), som gir et tilstrekkelig beskyttelsesnivå godkjent av EU-kommisjonen.

Dersom DPF-rammeverket oppheves eller endres, forplikter Leverandøren seg til umiddelbart å implementere alternative overføringsmekanismer (Standard Contractual Clauses) eller migrere til EU-baserte leverandører.

---

## 8. Sikkerhetstiltak

Leverandøren har implementert følgende tekniske og organisatoriske sikkerhetstiltak:

- Alle API-nøkler og hemmeligheter lagres som krypterte miljøvariabler, aldri i kildekode
- All dataoverføring skjer via HTTPS/TLS
- Serverløse funksjoner kjører i isolerte miljøer uten delt tilstand
- Tilgang til Airtable-data er begrenset til autoriserte API-nøkler
- Rate-limiting på API-endepunkter for å forhindre misbruk
- Regelmessig gjennomgang av tilgangsrettigheter

---

## 9. Sletting og tilbakelevering

Ved opphør av avtalen skal Leverandøren:

a) Slutte å behandle personopplysninger på vegne av Kunden umiddelbart.

b) Innen 30 dager etter avtalens opphør, gi Kunden mulighet til å eksportere alle data i et strukturert, maskinlesbart format (CSV eller JSON).

c) Innen 60 dager etter avtalens opphør, slette alle personopplysninger fra sine systemer, inkludert backuper, med mindre lagring er påkrevd etter gjeldende lovgivning.

d) Bekrefte skriftlig at sletting er gjennomført.

---

## 10. Sikkerhetsbrudd

Ved brudd på personopplysningssikkerheten (datainnbrudd, uautorisert tilgang, tap av data) skal Leverandøren:

a) Varsle Kunden uten ugrunnet opphold, og senest innen 24 timer etter at bruddet er oppdaget.

b) Gi Kunden tilstrekkelig informasjon til å oppfylle sin varslingsplikt overfor Datatilsynet (innen 72 timer) og de registrerte.

c) Dokumentere bruddet, dets virkninger og tiltak som er iverksatt for å utbedre og forebygge lignende hendelser.

---

## 11. Revisjon og kontroll

Kunden har rett til å gjennomføre revisjon av Leverandørens behandling av personopplysninger, enten selv eller gjennom en uavhengig tredjepart, med 30 dagers skriftlig varsel. Leverandøren skal bistå med å tilrettelegge for slik revisjon innenfor normal arbeidstid.

---

## 12. Ansvar

Leverandørens ansvar under denne avtalen følger ansvarsbestemmelsene i tjenesteavtalen mellom partene. Leverandøren er ansvarlig for skade som oppstår som følge av behandling i strid med denne avtalen eller GDPR.

---

## 13. Avtalens varighet

Denne avtalen gjelder fra undertegnelsesdato og så lenge Leverandøren behandler personopplysninger på vegne av Kunden. Avtalen opphører automatisk 60 dager etter opphør av tjenesteavtalen, etter at sletting er gjennomført i henhold til punkt 9.

---

## 14. Signatur

**Behandlingsansvarlig (Kunden):**

Sted/dato: ___________________________

Signatur: ___________________________

Navn: ___________________________

Tittel: ___________________________

**Databehandler (Leverandøren):**

Sted/dato: ___________________________

Signatur: ___________________________

Navn: ___________________________

Tittel: ___________________________
