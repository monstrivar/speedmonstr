# Sikkerhets- og oppsett-sjekkliste

Dette må være på plass før første betalende kunde tar i bruk plattformen.

## Kritisk (må fikses før første betalende kunde)

- [ ] **RLS-lockdown** — Følg `docs/security/RLS-LOCKDOWN.md`. Trenger `SUPABASE_SERVICE_ROLE_KEY` env, deretter en migrasjon. Pr nå kan anon-keyen lese alle partner-tabeller direkte.
- [ ] **Aktiver "Leaked password protection"** i Supabase Dashboard → Authentication → Policies. Verifierer mot HaveIBeenPwned.
- [ ] **Vercel Preview env-vars** — `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` mangler for Preview. Oppgrader Vercel CLI til v52+ og kjør `vercel env add ... preview --yes`.

## Konfigurasjon (når relevant)

- [ ] **Supabase Auth redirect URLs** — Site URL og Redirect URLs satt for production + localhost. Se `docs/OPERASJONER.md`.
- [ ] **Slack-app for `/partner`-kommandoen**:
  1. Lag ny Slack app i workspaceet
  2. Slash Commands → "/partner" → URL: `https://agentik.no/api/agentik-slack/partner`
  3. Basic Information → Signing Secret → kopier
  4. `vercel env add SLACK_SIGNING_SECRET production`
- [ ] **`ONBOARDING_INIT_SECRET`** env-var hvis vi tar i bruk `/api/agentik-onboarding-init` fra eksterne kilder (n8n, Slack-cmd). Bare en random string.

## Når kontraktssignering kommer

- [ ] Velg PandaDoc eller Signere.no (BankID = mer norsk-premium)
- [ ] Sett opp template med variabler ({{bedrift}}, {{daglig_leder}}, {{pris_per_mnd}}, {{onboarding_url}})
- [ ] Webhook-URL fra dem → ny Vercel function `/api/agentik-contract/webhook`
- [ ] Webhook signature verification

## Når Fiken kommer

- [ ] Fiken API-token i Vercel env (`FIKEN_API_TOKEN`)
- [ ] Fiken company ID i env (`FIKEN_COMPANY_SLUG`)
- [ ] Vercel function som oppretter kunde + faktura ved kontrakt-signert webhook
- [ ] Webhook fra Fiken når faktura er betalt → oppdaterer `partners.payment_status`

## Når Fireflies kommer

- [ ] Fireflies API-token i env
- [ ] **Viktig:** Møte-transkripter skal lagres i en separat tabell med eksplisitt RLS — IKKE returneres som default i `/api/agentik-partner/[slug]`. Lazy-loaded når en kunde klikker på et spesifikt møte.
- [ ] Vurder kryptert kolonne for sensitive deler av transkriptet
- [ ] Webhook fra Fireflies når et møte er ferdig prosessert

## Månedlig sjekkliste

- [ ] Kjør `mcp__claude_ai_Supabase__get_advisors` (security + performance)
- [ ] Sjekk Vercel logs for unormale 5xx-spikes
- [ ] Sjekk Supabase auth-logs for mistenkelige login-forsøk
- [ ] Verifiser at backups fungerer (Supabase tar daily auto-backups på Pro+)
