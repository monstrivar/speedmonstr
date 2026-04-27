-- RLS lockdown — kjøres ETTER at SUPABASE_SERVICE_ROLE_KEY er satt i Vercel env.
-- Se docs/security/RLS-LOCKDOWN.md for kontekst.

DROP POLICY IF EXISTS "Public read partners" ON public.partners;
DROP POLICY IF EXISTS "Public read activity" ON public.partner_activity;
DROP POLICY IF EXISTS "Public read meetings" ON public.partner_meetings;
DROP POLICY IF EXISTS "Public read people" ON public.partner_people;
DROP POLICY IF EXISTS "Public read projects" ON public.partner_projects;
DROP POLICY IF EXISTS "Public read roi" ON public.partner_roi;
DROP POLICY IF EXISTS "Public read tasks" ON public.partner_tasks;
DROP POLICY IF EXISTS "Public read by token" ON public.onboardings;
DROP POLICY IF EXISTS "Public read by id" ON public.presentations;

-- Når disse droppes har RLS ingen policies → kun service_role kan lese.
-- Anon-keyen i klient-bundlen vår får ingenting ut når den brukes direkte mot REST/GraphQL.
