# Monstr — Merkevare og visuelt design

## Designfilosofi

Monstr bruker en **brutalistisk, moderne estetikk** som kombinerer råhet med presisjon. Designet kommuniserer kraft, hastighet og profesjonalitet — uten å bli "corporate" eller generisk. Det skal føles som noe en håndverker respekterer: direkte, solid, ingen unødvendig pynt.

## Fargepalett

| Rolle | Farge | Hex | Bruk |
|-------|-------|-----|------|
| **Paper (base)** | Off-white | `#E8E4DD` | Hovedbakgrunn, lyse seksjoner |
| **Bakgrunn** | Varm off-white | `#F5F3EE` | Sidebakgrunn, subtil variant |
| **Accent (Signal Red)** | Rød | `#E63B2E` | CTA-knapper, viktige tall, uthevinger, seriøs oppmerksomhet |
| **Dark** | Dyp svart | `#111111` | Tekst, skygger, mørke seksjoner |

### Fargebruk i praksis
- **Rød (#E63B2E)** brukes sparsomt og med intensjon — kun for det som krever handling eller oppmerksomhet: knapper, nøkkeltall, dramatiske overskrifter
- **Mørke seksjoner** (#111111) brukes for hero og filosofi-seksjoner — skaper kontrast og tyngde
- **Paper-toner** (#E8E4DD / #F5F3EE) gir en varm, organisk følelse som skiller seg fra klinisk hvitt

## Typografi

### Fonter

| Font | Type | Rolle | Bruk |
|------|------|-------|------|
| **Space Grotesk** | Sans-serif | Overskrifter + brødtekst | Alt fra H1-H6 til paragraftekst |
| **DM Serif Display** | Serif, kursiv | Drama-font | Store utsagn, nøkkelord ("Sekunder.", "21x") |
| **Space Mono** | Monospace | Data-font | Statistikk, tall, tekniske elementer, tidsstempler |

### Typografisk hierarki
- **Hovedoverskrift (hero):** Space Grotesk, ~4.5rem desktop / ~2.5rem mobil, normal vekt
- **Drama-ord:** DM Serif Display italic, samme størrelse eller større, accent-farge
- **Seksjonsoverskrifter:** Space Grotesk, ~2.5rem, bold
- **Brødtekst:** Space Grotesk, 1rem-1.1rem, normal vekt
- **Data/tall:** Space Mono, varierende størrelse, ofte med accent-farge

### Eksempel fra hero
```
Svar På        ← Space Grotesk, normal
Sekunder.      ← DM Serif Display, italic, #E63B2E
```

## Designelementer

### Brutalistisk stil
- **Tunge skygger:** 4px drop shadows (ikke subtile box-shadows, men merkbare, grafiske skygger)
- **Solide kanter:** 1-2px borders, ikke avrundede hjørner overalt
- **Border-radius:** 2rem på kort og containere — avrundet men ikke boblaktig
- **Kontrast:** Sterke svart/hvitt-kontraster med rød som eneste fargeutrop

### Teksturer og overflater
- **Noise-overlay:** SVG fractal noise filter på bakgrunn — gir en subtil, papir-lignende tekstur
- **Betong-tekstur:** Hero-seksjonen bruker et bakgrunnsbilde med betong/rå tekstur
- **Filosofi-seksjon:** Eget bakgrunnsbilde med mørk, atmosfærisk stemning

### Animasjoner og bevegelse
- **GSAP ScrollTrigger:** Elementer animeres inn ved scroll — fade in, slide up, stagger-effekter
- **Magnetiske knapper:** Skalerer 1.03x ved hover med cubic-bezier easing — føles levende og responsivt
- **Typewriter-effekt:** SMS-eksempler skrives ut bokstav for bokstav — viser personaliseringen i sanntid
- **Kort-shuffler:** Henvendelser fra ulike kilder animeres som et kortstokk-shuffle — viser fangst fra alle kanaler
- **Tidsstempler:** Teller opp i sanntid (00:00:02, 00:00:05) for å vise hastigheten

### Responsivt design
- **Mobile-first:** Alt er designet for telefon først (kritisk — håndverkere bruker primært mobil)
- **Breakpoints:** Tailwind standard (sm: 640px, md: 768px, lg: 1024px)
- **Hero-tekst:** Skalerer fra ~2.5rem (mobil) til ~4.5rem (desktop)
- **Kort-layout:** Stacker vertikalt på mobil, grid på desktop

## Ikoner og grafikk

- **Ikon-bibliotek:** Lucide React (minimalistiske, strektegnede ikoner)
- **Favicon:** Custom Monstr-ikon (public/favicon.png)
- **Logo:** "Monstr" i tekst — Space Grotesk, spaced ut (letter-spacing: 0.15em), uppercase
- **Monogram:** "M" i logo-format for ikon/favicon-bruk
- **Bilder:** Hero-bg (betong/rå tekstur), Philosophy-bg (mørk, atmosfærisk)

## Tone of voice i design

| Egenskap | Ja | Nei |
|----------|----|----|
| **Direkte** | Korte setninger, klare tall | Lange utredninger, vage løfter |
| **Rå** | Brutalistisk, ærlig, selvsikker | Polert corporate, stock-foto-aktig |
| **Teknisk presis** | Monospace-tall, tidsstempler | Flytende, upresise formuleringer |
| **Norsk** | Hele UX er på norsk, norske eksempler | Engelske buzzwords, anglisismer |
| **Håndverker-respekt** | Snakker deres språk, vet hva en jobb er verdt | Snakker ned til målgruppen |

## Landingssidestruktur (visuell flyt)

1. **Navbar** — Fast, frosted-glass effekt, accent-farge ved scroll
2. **Hero** (mørk) — Stor overskrift, nøkkelstatistikk (21x), CTA
3. **Features** (lys) — 3-4 animerte kort med interaktive demoer
4. **Filosofi** (mørk) — Hvorfor hastighet fungerer, forskning og psykologi
5. **Kvalifisering** (lys) — "Passer for deg / Passer ikke for deg"
6. **Booking-skjema** (lys) — To-trinns skjema med scoring
7. **Footer** — Minimal, kontaktinfo

## Dashbord-design (app.monstr.no — planlagt)

Dashbordet følger samme merkevare men med et mer funksjonelt preg:
- Samme fargepalett (paper, accent red, dark)
- Samme typografi (Space Grotesk, Space Mono for data)
- Fargekodede statusikoner: 🔴 Rød (overdue), 🟡 Gul (venter >1t), ✅ Grønn (fulgt opp), ⚪ Grå (ikke relevant)
- Ren, datadrevet layout med sanntidsoppdateringer
- Mobiloptimalisert (håndverkere er i felt, ikke ved pult)
