# Kodekonvensjoner

> Referansedokument for CLAUDE.md. Gjeldende konvensjoner for agentik.no-repoet.

*Sist oppdatert: 2026-04-24*

---

## Språk

### I kode
- Variabelnavn, funksjoner, komponenter, typer: **engelsk**
- Kommentarer: **engelsk** (korte, kun der logikken ikke er selvforklarende)
- Commit-meldinger: **engelsk**, imperativ form
- Filnavn: **engelsk** (kebab-case for utility-filer, PascalCase for React-komponenter)

### I brukergrensesnitt
- All brukervendt tekst på **norsk bokmål**
- Datoer: `Intl.DateTimeFormat` med `no-NO`
- Tall: `Intl.NumberFormat` med `no-NO`
- Landingssiden er kun norsk i første versjon (ingen i18n-setup — legg til når vi faktisk har engelske kunder)

### I dokumentasjon
- `/docs/` skrives på norsk
- Kode-kommentarer og commit-meldinger: engelsk

## Filstruktur

```
speedmonstr/  (repo-navn beholdes midlertidig, ikke kritisk)
├── index.html              Landing page entry
├── src/
│   ├── main.jsx            Router
│   ├── index.css           Globale styles + Tailwind
│   └── pages/
│       ├── NySide.jsx      Hovedsiden (Agentik landing)
│       ├── Personvern.jsx
│       └── Vilkar.jsx
├── api/
│   └── agentik-contact.js  Kontaktskjema → Make → Attio
├── public/                 Statiske assets
├── presentation/           HTML keynote (for events)
├── docs/                   Intern dokumentasjon
├── vercel.json
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Navnekonvensjoner

| Type | Konvensjon | Eksempel |
|------|-----------|----------|
| React-komponenter | PascalCase.jsx | `NySide.jsx`, `Personvern.jsx` |
| Utility-filer | kebab-case.js | `format-phone.js` |
| Konstanter | UPPER_SNAKE | `MAKE_WEBHOOK_URL` |
| CSS-klasser | Tailwind utilities | Ingen custom CSS med mindre nødvendig |

## JSX (landingsside)

- Funksjonelle komponenter med arrow functions
- Props destruktureres i funksjonsparameteren
- Landingssiden (`NySide.jsx`) er én stor fil med nested komponenter — ikke et problem for en statisk side
- Default export for sidekomponenter brukt av router er OK her (react-router-dom bruker det)

## Tailwind

- Palette-tokens i `tailwind.config.js`: `background`, `dark`, `petrol`, `signal`, `copper`
- For Agentik-spesifikke hex-farger (#F5F2EC osv.) brukes `bg-[#...]` bracket-syntaks i NySide. Det er OK — designet er tett koblet til disse eksakte verdiene.

## Git

- Branch per større endring: `feature/...`, `fix/...`, `chore/...`
- Commit-meldinger: imperativ form, kort subject (<70 tegn), lengre forklaring i body
- Ingen force-push til main
- En logisk endring per commit

## Avhengigheter

- Foretrekk innebygd/plattform-API fremfor npm-pakker
- Ingen pakke installeres uten klar begrunnelse
- `package-lock.json` committes alltid

## Agent-prosjekter (kundeleveranser)

Når vi bygger agenter for kunder, lever de i egne repoer — ikke i dette. Konvensjoner for agent-prosjekter dokumenteres per prosjekt (hver kunde har ulike krav).
