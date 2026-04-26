// GET /api/agentik-onboarding/[token]   → fetch onboarding data
// POST /api/agentik-onboarding/[token]  → submit form

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const N8N_ONBOARDING_SUBMIT_WEBHOOK_URL = process.env.N8N_ONBOARDING_SUBMIT_WEBHOOK_URL;

export default async function handler(req, res) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Supabase env vars missing');
    return res.status(500).json({ error: 'Server misconfigured.' });
  }

  const { token } = req.query;
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'token required' });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('onboardings')
        .select('id, token, status, bedrift, bedrift_domene, org_nr, daglig_leder, daglig_leder_epost, daglig_leder_telefon, pris_per_mnd, form_data, form_submitted_at, completed_at')
        .eq('token', token)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Onboarding ikke funnet' });
      }

      return res.status(200).json(data);
    } catch (err) {
      console.error('Onboarding fetch error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  if (req.method === 'POST') {
    const formData = req.body || {};

    if (!formData || typeof formData !== 'object') {
      return res.status(400).json({ error: 'form data required' });
    }

    try {
      // Look up the onboarding record first
      const { data: existing, error: lookupErr } = await supabase
        .from('onboardings')
        .select('id, token, status, bedrift, daglig_leder_epost')
        .eq('token', token)
        .single();

      if (lookupErr || !existing) {
        return res.status(404).json({ error: 'Onboarding ikke funnet' });
      }

      if (existing.status === 'completed') {
        return res.status(400).json({ error: 'Onboarding er allerede ferdigstilt' });
      }

      // Update with form data
      const { data: updated, error: updateErr } = await supabase
        .from('onboardings')
        .update({
          status: 'form_filled',
          form_data: formData,
          form_submitted_at: new Date().toISOString(),
        })
        .eq('token', token)
        .select('id, token, bedrift, daglig_leder_epost, form_data')
        .single();

      if (updateErr || !updated) {
        console.error('Onboarding update failed:', updateErr);
        return res.status(500).json({ error: 'Could not save form' });
      }

      // Forward to n8n — n8n updates Notion klient-side + creates Nøkkelpersoner-rows + tasks
      if (N8N_ONBOARDING_SUBMIT_WEBHOOK_URL) {
        try {
          await fetch(N8N_ONBOARDING_SUBMIT_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              token: updated.token,
              id: updated.id,
              bedrift: updated.bedrift,
              daglig_leder_epost: updated.daglig_leder_epost,
              form_data: updated.form_data,
              submitted_at: new Date().toISOString(),
            }),
          });
        } catch (e) {
          console.error('N8N submit webhook failed (non-fatal):', e);
        }
      }

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('Onboarding submit error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
