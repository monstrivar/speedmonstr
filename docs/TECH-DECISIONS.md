# Tekniske beslutninger

> Referansedokument for CLAUDE.md. Begrunnelser for tekniske valg i companion-appen.

---

## TypeScript

Companion-appen (`app/`) bruker TypeScript. Landingssiden (`src/`) forblir JSX — den er ferdig og enkel.

Begrunnelse: Prosjektet skal gjøres ordentlig fra starten. TypeScript gir trygghet ved refaktorering, bedre DX med Supabase-genererte typer, og færre runtime-feil.

## UI-rammeverk: shadcn/ui + Tailwind CSS v4

- **shadcn/ui** gir oss produksjonsklare komponenter (knapper, modaler, sheets, tabeller) som vi eier og kan tilpasse til Monstr-stilen
- Ikke et avhengighetsbibliotek — komponentene kopieres inn i prosjektet
- Basert på Radix UI primitives — tilgjengelig, tastaturnavigasjon, mobilvennlig
- Tailwind v4 for all styling, konsistent med landingssiden

## Internasjonalisering: react-i18next

- Norsk som standardspråk, klargjort for svensk, dansk, engelsk
- Locale-basert routing: `/no/`, `/en/`, `/se/`, `/dk/`
- Oversettelsefiler i `app/src/locales/{no,en,se,dk}.json`
- Alle brukervendte strenger går gjennom `t()`-funksjonen fra dag 1
- Datoer og tall formateres med `Intl` API (respekterer locale)

## Native: Capacitor (iOS først)

- Capacitor wrapper rundt web-appen → ekte iOS-app i App Store
- Android kommer i fase 2 (samme kodebase, bare generere Android-prosjektet)
- Apple Developer Account er registrert på partner (privat inntil AS opprettes)
- Push via APNs direkte (ikke Firebase for iOS) — enklere, færre avhengigheter

### Capacitor plugins (v1)
| Plugin | Bruk |
|--------|------|
| `@capacitor/push-notifications` | APNs push-varsler |
| `@capacitor/haptics` | Vibrasjonsfeedback |
| `@capacitor/app` | App lifecycle (resume etter samtale) |
| `@capacitor/splash-screen` | Splash screen |
| `@capacitor/badge` | Badge-tall på app-ikon |

## Database: Supabase (nytt prosjekt)

- Nytt Supabase-prosjekt dedikert til companion-appen
- Auth: Magic link (e-post)
- Realtime: Subscriptions på `leads`-tabellen
- Edge Functions: Push-sending, eskaleringslogikk
- Row Level Security: Isolasjon per organisasjon
- Genererte TypeScript-typer via `supabase gen types`

## Push-arkitektur (iOS)

```
Ny lead → Supabase insert
    ↓
Database webhook / Edge Function trigger
    ↓
Edge Function: hent relevante brukere + push tokens
    ↓
Send via APNs (Apple Push Notification Service)
    ↓
iOS viser native notifikasjon med lyd + handlingsknapper
```

Ingen Firebase nødvendig for iOS-only fase. APNs direkte via HTTP/2 fra Edge Function.

## Grafer: Recharts

- Lettvekt, React-native (ikke DOM-manipulasjon)
- Responsivt ut av boksen
- Enkel API for linjediagrammer og søylediagrammer
- Brukes kun på analytics-sidene — ikke en tung avhengighet

## State management

- Ingen global state manager (ingen Redux, Zustand)
- React Context for auth-state og organisasjonsdata
- Supabase Realtime for live data
- React Query / TanStack Query for server-state caching og synkronisering
- Lokal state med useState/useReducer for UI-state
