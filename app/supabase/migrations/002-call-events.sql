-- call_events: tracks each call attempt from the app
-- duration_sec = time user was away from app (NOT actual call duration)
CREATE TABLE call_events (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id         uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  initiated_at    timestamptz NOT NULL DEFAULT now(),
  returned_at     timestamptz,
  outcome         text CHECK (outcome IN ('answered', 'no_answer', 'voicemail', 'cancelled')),
  duration_sec    integer,
  note            text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE call_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage org call events"
  ON call_events FOR ALL
  USING (
    lead_id IN (
      SELECT id FROM leads WHERE organization_id IN (
        SELECT organization_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE INDEX call_events_lead_id_idx ON call_events (lead_id);
CREATE INDEX call_events_user_id_idx ON call_events (user_id);
CREATE INDEX call_events_initiated_at_idx ON call_events (initiated_at DESC);
