# RLS Lockdown — apply etter SUPABASE_SERVICE_ROLE_KEY er satt

## Hvorfor

Pr nå har alle `partner_*`-tabeller og `presentations`+`onboardings` en **"Public read"-policy med `using_expr: true`**. Det betyr at hvem som helst med anon-keyen (som ligger i nettleser-bundlen vår) kan lese alle kunde-data direkte via Supabase REST/GraphQL — uten å gå gjennom auth-portene våre.

Dette er ikke synlig utad, men det er en ekte lekkasje. Demo-data nå er ufarlige, men det fjerne lekkasjen før første betalende kunde.

## Stegene

### 1. Hent service-role key fra Supabase

Dashboard → Settings → API → "Project API keys" → kopier `service_role` `secret`-nøkkelen.
**Aldri** eksponer denne til klienten. Den bypassser RLS.

### 2. Legg den i Vercel + lokalt

```bash
# Vercel (gjenta for production, preview, development hvis ønskelig)
printf "<service-role-secret>" | vercel env add SUPABASE_SERVICE_ROLE_KEY production
printf "<service-role-secret>" | vercel env add SUPABASE_SERVICE_ROLE_KEY development

# Lokalt
echo "SUPABASE_SERVICE_ROLE_KEY=<service-role-secret>" >> .env
```

Server-koden allerede prefererer `SUPABASE_SERVICE_ROLE_KEY` over `SUPABASE_KEY` (se `api/_lib/auth.js`). Når env-variabelen er satt, brukes service-role automatisk på neste deploy.

### 3. Deploy

Trigger en redeploy i Vercel slik at functions plukker opp den nye env-variabelen. Test at `/admin` og `/partner/demo` fortsatt fungerer.

### 4. Apply lockdown-migrasjonen

Kjør SQL-en i `docs/security/rls-lockdown.sql` i Supabase SQL Editor (eller bed Claude bruke `apply_migration`):

```sql
-- Drop the dangerous public-read policies
DROP POLICY IF EXISTS "Public read partners" ON public.partners;
DROP POLICY IF EXISTS "Public read activity" ON public.partner_activity;
DROP POLICY IF EXISTS "Public read meetings" ON public.partner_meetings;
DROP POLICY IF EXISTS "Public read people" ON public.partner_people;
DROP POLICY IF EXISTS "Public read projects" ON public.partner_projects;
DROP POLICY IF EXISTS "Public read roi" ON public.partner_roi;
DROP POLICY IF EXISTS "Public read tasks" ON public.partner_tasks;
DROP POLICY IF EXISTS "Public read by token" ON public.onboardings;
DROP POLICY IF EXISTS "Public read by id" ON public.presentations;

-- RLS forblir enabled — uten policies kommer ingenting ut for noen rolle utenom service_role.
-- Server-side koden vår bruker service-role og bypasser RLS.
-- Client-side vår koder kaller aldri Supabase direkte — alle kall går gjennom /api/* med JWT-gating.
```

### 5. Verifiser

- `/admin` skal fortsatt liste alle partnere
- `/partner/demo` skal fortsatt laste kunde-dashboardet
- Direkte anon-kall mot `https://yqpccmztmapgyefrqynp.supabase.co/rest/v1/partner_people` skal returnere tom array eller 403
- Sjekk Supabase advisors → RLS-warnings skal være borte for partner_*

## Hvorfor service-role er trygt

- Den finnes kun i Vercel-funksjonene, ikke i nettleseren
- Hver request går gjennom `verifyAuth(req)` som validerer Supabase JWT før noen DB-spørringer kjøres
- Etter JWT-verifisering vet vi hvem brukeren er og hvilken partner de har tilgang til — autorisasjonen ligger i applikasjonslaget
- RLS er nå et "defense in depth"-lag: selv om noen skulle slippe forbi auth-laget, har anon-keyen ingen leserettigheter
