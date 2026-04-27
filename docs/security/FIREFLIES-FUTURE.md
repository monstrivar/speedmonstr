# Fireflies-integrasjon — fremtidig sikkerhetsmodell

Når vi begynner å lagre møtetranskripter, må vi være ekstra forsiktige. Dette dokumentet låser arkitekturen så vi ikke maler oss inn i et hjørne.

## Prinsipp: minst-privilegiert eksponering

Møtetranskripter inneholder **det mest sensitive innholdet i hele plattformen** — beslutninger, økonomiske tall, personlig kontekst, navn på interne roller, sensitive prosjekter. Reglene:

1. **Aldri returnere transkripter som del av default `/api/agentik-partner/[slug]`-respons.**
   Den endpointen pakker alt vi viser i dashbord-listene. Transkripter må lazy-loades fra en egen endpoint som krever eksplisitt klikk.

2. **Egen tabell, egen RLS-policy.**
   ```sql
   CREATE TABLE public.partner_meeting_transcripts (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     meeting_id uuid REFERENCES public.partner_meetings(id) ON DELETE CASCADE,
     partner_id uuid REFERENCES public.partners(id) ON DELETE CASCADE,
     fireflies_id text UNIQUE,
     summary text,                    -- AI-generert kort sammendrag (kan vises i listen)
     highlights jsonb,                -- structured highlights array
     action_items jsonb,
     full_transcript text,            -- selve transkriptet (sensitivt — kun lazy-load)
     created_at timestamptz DEFAULT now()
   );
   ALTER TABLE public.partner_meeting_transcripts ENABLE ROW LEVEL SECURITY;
   -- Ingen public policy — kun service-role får tilgang.
   ```

3. **Eksplisitt fetch.**
   `GET /api/agentik-partner/[slug]/meeting/[meetingId]/transcript` med samme JWT + ACL-sjekk som hovedendpointen. Returnerer kun den ene transkripten.

4. **Lagre kun det vi trenger.**
   Hvis vi senere vil tilby "spør AI om hva som ble sagt", lagrer vi transkriptet. Hvis ikke, lagrer vi bare summary + highlights + action_items, og lar selve transkriptet leve hos Fireflies (vi henter det on-demand fra deres API).

5. **Logging.**
   Lese-tilgang til full_transcript skal logges som en `partner_activity`-rad ("Ivar leste transkriptet for møte X"). Defense-in-depth — hvis det skjer noe rart, har vi audit-trail.

## Hva vi viser kunden

- I `Møter`-tab-en under hvert tidligere møte: knappe "Se sammendrag" → modal med summary + highlights + action_items
- Aldri full transkript til kunden direkte — det er for oss internt (eventuelt for kundens egne nøkkelpersoner med eksplisitt confirm).

## Hva vi viser admin

- Samme + en knapp "Les full transkripsjon" i AdminPartner Møter-tab-en, som henter `full_transcript` lazy.

## Konsekvens

Transkripter lekker IKKE selv om noen finner anon-keyen, JWT-en til en annen kunde, eller en feil i app-laget. RLS-policyen alene blokkerer.

## Implementasjons-rekkefølge når tiden kommer

1. Migration for `partner_meeting_transcripts`-tabellen (ovenfor)
2. Fireflies webhook-endpoint som lagrer summary + highlights ved møte-ferdig
3. UI: knapp "Se sammendrag" → modal
4. Admin-only: "Les full transkripsjon"-knapp som henter via egen endpoint
5. Logging av full-transcript-tilgang som partner_activity
