# Monstr — Prismodell

## Modell: Graduert prisstige

Prisen starter lavt for de første kundene og øker med 20% for hver 5. kunde til vi treffer motstand i markedet. Når vi finner taket, går vi litt tilbake og sementerer standardprisen der.

## Pristrapp

| Kohort | Kunde nr. | Pris/mnd |
|--------|-----------|----------|
| 1 | 1–5 | 2 999 kr |
| 2 | 6–10 | 3 599 kr |
| 3 | 11–15 | 4 319 kr |
| 4 | 16–20 | 5 183 kr |
| 5 | 21–25 | 6 219 kr |
| 6 | 26–30 | 7 463 kr |

Beregning: forrige pris × 1.20, rundet til nærmeste heltall.

## Regler

- **Hver kunde beholder sin pris.** Kunden betaler prisen som gjaldt da de signerte. Ingen prisøkning for eksisterende kunder.
- **Prisen bestemmes av totalt antall aktive kunder** på signeringstidspunktet, ikke historisk antall.
- **Ingen bindingstid.** Månedlig fakturering, kan avsluttes når som helst.
- **SMS-kostnader kommer i tillegg** og viderefaktureres til kostpris (typisk 100–300 kr/mnd).
- **Oppsett er gratis.**

## Prisfunn (tak)

Når vi opplever merkbar motstand (lavere konvertering, lengre salgssyklus, hyppigere prisinnvendinger):

1. Gå ett trinn tilbake fra der motstanden oppsto
2. Sett dette som standard listepris
3. Alle fremtidige kunder betaler standardprisen
4. Eksisterende kunder beholder sin kohort-pris

## Salgsargument per kohort

Ole bruker alltid nåværende kohort-pris og neste prisøkning som urgency:

> "Vi tar inn kunder til [PRIS] i måneden akkurat nå. Etter [ANTALL PLASSER IGJEN] kunder til går prisen opp til [NESTE PRIS]. Du beholder din pris så lenge du er kunde."

## Implementering

- **Airtable:** Hvert kundeobjekt har feltet `kohort` (1–6+) og `pris_mnd` satt ved signering.
- **Fakturering:** Basert på `pris_mnd` fra kunderecord, ikke en global prisinnstilling.
- **Sporing:** Dashboard/oversikt som viser antall aktive kunder og gjeldende kohort-pris for neste signering.

## Produktomfang (alle kohorter)

Alle kunder får samme produkt uavhengig av pris:

- Auto-respons SMS innen 30–60 sekunder
- Personlig SMS med bedriftens navn som avsender
- Varsling til eier/team via SMS, Telegram eller e-post
- Opptil 2 leadkilder (nettskjema, annonser, etc.)
- 3-trinns SMS-oppfølgingssekvens over 7 dager
- 14 dagers gratis prøveperiode

## Årlig betaling (valgfritt)

Kunder kan velge å betale årlig og få 50% rabatt på sin kohort-pris:

| Kohort | Månedlig | Årlig (per mnd) | Årlig totalt |
|--------|----------|------------------|--------------|
| 1 | 2 999 kr | 1 499 kr | 17 988 kr |
| 2 | 3 599 kr | 1 799 kr | 21 588 kr |
| 3 | 4 319 kr | 2 159 kr | 25 908 kr |
| 4 | 5 183 kr | 2 591 kr | 31 092 kr |
| 5 | 6 219 kr | 3 109 kr | 37 308 kr |
| 6 | 7 463 kr | 3 731 kr | 44 772 kr |

50% rabatt er aggressivt men strategisk: det låser kunder i 12 måneder, gir cash up-front, og eliminerer churn-risiko for et helt år. Kunder som betaler årlig på kohort 3+ betaler fortsatt mindre enn månedlig kohort 1-pris, noe som gjør årlig til et sterkt salgsargument på høyere kohorter.
