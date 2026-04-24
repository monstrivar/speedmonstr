# Agentik — Merkevare og visuelt design

*Sist oppdatert: 2026-04-24*

## Designfilosofi

Agentik bruker en **rolig, redaksjonell estetikk** som kommuniserer teknisk dybde uten corporate-støy. Designet skal føles som et produktstudio — varmt, presist, voksent. Ikke en tech-startup i neon. Ikke et rådgivningshus i gråtoner.

Målgruppen er norsk næringsliv som har sett gjennom AI-hypen. Designet skal signalisere: vi er praktikere, vi bygger ting som kjører, vi har tillit til stilt tone.

## Fargepalett

| Rolle | Navn | Hex | Bruk |
|-------|------|-----|------|
| **Bakgrunn** | Cream | `#F5F2EC` | Hovedbakgrunn, lyse seksjoner |
| **Surface** | Paper | `#E8E4DC` | Tekst på mørk bakgrunn, varme flater |
| **Dark** | Deep Slate | `#1A1F25` | Mørke seksjoner, hovedtekst |
| **Petrol** | Deep Teal | `#1A6B6D` | Brand-aksent på lyse flater |
| **Signal** | Bright Teal | `#4FC3B0` | Brand-aksent på mørke flater, "live"-indikatorer |
| **Copper** | Warm Amber | `#C4854C` | CTA og konverteringspunkter (sparsomt) |

### Fargebruk i praksis
- **Copper** er eksklusivt for handling: primær-CTA, konverteringsknapper, "bestill audit"-momenter. Aldri dekorativt.
- **Petrol** er brandens signaturfarge på lys bakgrunn — bruk for aksenter, linjer, ikoner, sekundære CTA.
- **Signal** er petrol-søsteren for mørk bakgrunn — bruk for "kjører nå"-indikatorer og subtile highlights.
- **Cream-mot-Deep Slate** er hovedkontrasten. Varmt, ikke klinisk — unngå ren hvit og ren svart.

## Typografi

### Fonter

| Font | Type | Rolle |
|------|------|-------|
| **Plus Jakarta Sans** | Sans-serif, vekter 200–800 | Overskrifter + brødtekst + data-komponenter |
| **JetBrains Mono** | Monospace | Tall, kodelignende data, tekniske stempler |

Plus Jakarta Sans bærer hele stemmen. Ingen serif-kontrast, ingen display-font — rolig og konsistent.

### Typografisk hierarki
- **Hovedoverskrift (hero):** Plus Jakarta Sans bold, clamp(2.2rem, 5.5vw, 4.2rem), tight letter-spacing (-0.02em)
- **Seksjonsoverskrifter:** Plus Jakarta Sans bold, clamp(1.8rem, 4vw, 3rem)
- **Brødtekst:** Plus Jakarta Sans regular, 1rem–1.125rem, leading-relaxed
- **Label/eyebrow:** JetBrains Mono, 11px, uppercase, letter-spacing 0.35em, opacity 40%
- **Data/tall:** JetBrains Mono for statistikk og tekniske detaljer

## Designelementer

### Stil
- **Myke, avrundede former** — knapper og kort er pill-shaped eller med rounded-[1.5rem–2rem] border-radius
- **Tynne linjer og subtile borders** — 1px, ofte med opacity (f.eks. `border-dark/10`)
- **Generøs whitespace** — padding er raus, seksjoner puster
- **Ingen tunge drop-shadows** — bruk subtil backdrop-blur og svake interne skygger

### Teksturer og overflater
- **Noise-overlay:** SVG fractal noise filter på bakgrunn, opacity 0.05 — gir papir-følelse
- **Ambient gradients:** Petrol- og copper-glød som radial gradients på hero — blurret, pulserende
- **Hero-video:** Kraftig blur + mørk vignett holder videoen ambient, ikke dominerende

### Animasjoner og bevegelse
- **GSAP ScrollTrigger:** Elementer fader inn og slider opp ved scroll
- **Magnetiske knapper:** Subtil scale(1.03) på hover med ease-out cubic-bezier, + sliding background layer
- **Live-agent-telemetri:** Agenter på hero viser kjørende prosesser (progress bars, fade-in-linjer) — demonstrerer at Agentik er live, ikke statisk
- **Rotating words:** Hero-overskrift roterer gjennom eksempler på prosesser (Rapportering, Kundesupport, HR…) — viser bredden

### Responsivt design
- **Mobile-first:** Alt fungerer på telefon før desktop
- **Breakpoints:** Tailwind standard (sm/md/lg)
- **Hero:** 100dvh slik at det fyller skjermen uavhengig av browser-UI

## Ikoner og grafikk

- **Ikon-bibliotek:** Lucide React (strektegnede, rene linjer)
- **Favicon:** Custom Agentik-ikon (public/favicon.png, public/favicon.svg)
- **Logo:** "Agentik" i tekst — Plus Jakarta Sans semi-bold, tight letter-spacing
- **Hero-video:** public/hero-bg.mp4 (ambient, kraftig blurret)

## Tone of voice

| Egenskap | Ja | Nei |
|----------|----|----|
| **Konkret** | "Vi bygger agenter som kjører" | "Vi transformerer din AI-reise" |
| **Rolig** | Voksen, trygg, selvsikker | Hype, utropstegn, "revolusjonerende" |
| **Ærlig** | "Hvis AI ikke gir verdi, sier vi det" | Vage løfter, mirakelretorikk |
| **Norsk** | Hele UX på norsk, norske eksempler | Engelske buzzwords, anglisismer |
| **Redaksjonell** | Tekst som kan leses, ikke bare skannes | Bullet-spam, korte staccato-setninger kun |

## Landingssidestruktur (visuell flyt)

1. **Navbar** — Flytende pille-nav, kontekst-avhengig farge (mørk bakgrunn på hero, cream når scrolled)
2. **Hero** (mørk) — Rotating-word-overskrift, ambient video, copper CTA
3. **Live agents** — Animerte agent-eksempler som demonstrerer at Agentik kjører, ikke bare snakker
4. **Prosess** — 30-dagers audit → implementering, fast pris, tydelige milepæler
5. **Resultater / Proof** — Kundecases og målbare utfall
6. **Team** — Ivar og Ole Kristian, varmt og personlig
7. **Kontaktskjema** — Fornavn, bedrift, telefon, epost, mål (kort)
8. **Footer** — Kontaktinfo, Personvern, Vilkår

## Forbudt

- Ren hvit (#FFFFFF) bakgrunn
- Ren svart (#000000) tekst
- Signal Red eller andre varselsfarger (Monstr brukte rød — Agentik er teal + copper)
- Glassy corporate gradients
- Stock-foto av smilende folk i hotellobbyer
- AI-generert clip art
- Emojis i produksjonstekst (aksept i dashboards/demo-innhold hvor relevant)
