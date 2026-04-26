// POST /api/agentik-onboarding-init
// Triggered internally (by Ivar/Ole via Slack-cmd or Notion-form) when a new
// AI-Partner has said yes. Creates a Supabase onboarding record + forwards
// to N8N which provisions Notion klient-side and sends onboarding-email.

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const N8N_ONBOARDING_INIT_WEBHOOK_URL = process.env.N8N_ONBOARDING_INIT_WEBHOOK_URL;
const ONBOARDING_INIT_SECRET = process.env.ONBOARDING_INIT_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Light auth — only Ivar/Ole should trigger this. Use a shared secret.
  const auth = req.headers['x-agentik-secret'];
  if (!ONBOARDING_INIT_SECRET || auth !== ONBOARDING_INIT_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Supabase env vars missing');
    return res.status(500).json({ error: 'Server misconfigured.' });
  }

  const {
    bedrift,
    daglig_leder,
    daglig_leder_epost,
    daglig_leder_telefon,
    bedrift_domene,
    org_nr,
    pris_per_mnd,
    intern_kommentar,
    created_by,
  } = req.body || {};

  if (!bedrift || !daglig_leder_epost) {
    return res.status(400).json({ error: 'bedrift og daglig_leder_epost er påkrevd.' });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const { data, error } = await supabase
      .from('onboardings')
      .insert({
        bedrift,
        daglig_leder: daglig_leder || null,
        daglig_leder_epost,
        daglig_leder_telefon: daglig_leder_telefon || null,
        bedrift_domene: bedrift_domene || null,
        org_nr: org_nr || null,
        pris_per_mnd: pris_per_mnd ?? 39000,
        intern_kommentar: intern_kommentar || null,
        created_by: created_by || null,
        status: 'initiated',
      })
      .select('id, token, bedrift, daglig_leder, daglig_leder_epost, pris_per_mnd, created_at')
      .single();

    if (error || !data) {
      console.error('Supabase insert failed:', error);
      return res.status(500).json({ error: 'Could not initiate onboarding.' });
    }

    const onboardingUrl = `https://agentik.no/onboarding/${data.token}`;

    // Forward to n8n — fire and continue. n8n provisions Notion + sends email.
    if (N8N_ONBOARDING_INIT_WEBHOOK_URL) {
      try {
        await fetch(N8N_ONBOARDING_INIT_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            onboarding_url: onboardingUrl,
            bedrift_domene: bedrift_domene || null,
            org_nr: org_nr || null,
            daglig_leder_telefon: daglig_leder_telefon || null,
            intern_kommentar: intern_kommentar || null,
            created_by: created_by || null,
          }),
        });
      } catch (e) {
        console.error('N8N webhook failed (non-fatal):', e);
      }
    }

    return res.status(200).json({
      success: true,
      id: data.id,
      token: data.token,
      onboarding_url: onboardingUrl,
    });
  } catch (err) {
    console.error('Onboarding init error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
