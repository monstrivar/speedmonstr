# Kodekonvensjoner

> Referansedokument for CLAUDE.md. Gjeldende konvensjoner for hele prosjektet.

---

## Språk

### I kode
- Variabelnavn, funksjoner, komponenter, typer: **engelsk**
- Kommentarer: **engelsk** (korte, kun der logikken ikke er selvforklarende)
- Commit-meldinger: **engelsk**
- Filnavn: **engelsk** (kebab-case for filer, PascalCase for komponenter)

### I brukergrensesnitt
- All brukervendt tekst går gjennom i18n (`t()`-funksjonen)
- Standardspråk: norsk bokmål
- Ingen hardkodede strenger i JSX/TSX — alltid nøkler
- Datoer: `Intl.DateTimeFormat` med brukerens locale
- Tall: `Intl.NumberFormat` med brukerens locale

### I dokumentasjon
- `/docs/` skrives på norsk (primært for Ivar og partneren)
- README.md og teknisk docs skrives på engelsk (for fremtidig team)

## Filstruktur

### Companion-appen (`app/`)
```
app/src/
├── components/          Delte UI-komponenter
│   ├── ui/              shadcn/ui-komponenter (auto-generert)
│   └── [Feature].tsx    Feature-spesifikke komponenter
├── pages/               Sidekomponenter (én per rute)
├── hooks/               Custom React hooks
├── lib/                 Utilities, Supabase-klient, helpers
├── locales/             i18n-oversettelser (no.json, en.json, ...)
├── types/               TypeScript-typer (inkl. Supabase-genererte)
└── assets/              Statiske filer (ikoner, lyeder)
```

### Navnekonvensjoner
| Type | Konvensjon | Eksempel |
|------|-----------|----------|
| Komponent-filer | PascalCase.tsx | `LeadCard.tsx` |
| Hook-filer | camelCase.ts | `useLeads.ts` |
| Utility-filer | kebab-case.ts | `format-phone.ts` |
| Typer | PascalCase | `Lead`, `Organization` |
| Konstanter | UPPER_SNAKE | `ESCALATION_THRESHOLD` |
| CSS-klasser | Tailwind utilities | Ingen custom CSS med mindre nødvendig |

## TypeScript

- Strict mode aktivert
- Ingen `any` — bruk `unknown` og type-guards hvis nødvendig
- Supabase-typer genereres med `supabase gen types typescript` og importeres
- Props-interfaces defineres i samme fil som komponenten
- Eksporter typer med `export type` (ikke `export interface` med mindre det er for extending)

## Komponenter

- Funksjonelle komponenter med arrow functions
- Props destruktureres i funksjonsparameteren
- Ingen default exports — alltid named exports
- En komponent per fil (med unntak av små hjelpere)
- Hooks øverst i komponenten, return-statement nederst

## Git

- Branch per feature: `feature/push-notifications`, `feature/call-tracking`
- Commit-meldinger: imperativ form, kort ("Add lead detail view", "Fix escalation timer")
- Ingen force-push til main
- Squash-merge for feature branches

## Testing

- Tester skrives for forretningslogikk (scoring, eskalering, routing)
- Ikke test UI-komponenter med mindre de har kompleks logikk
- Vitest som test runner (konsistent med Vite)
- Test-filer ved siden av kildefil: `useLeads.test.ts`

## Avhengigheter

- Foretrekk innebygd/plattform-API fremfor npm-pakker
- Ingen pakke installeres uten klar begrunnelse
- Lock-fil (package-lock.json) committes alltid
- Hold Capacitor-plugins på samme major-versjon
