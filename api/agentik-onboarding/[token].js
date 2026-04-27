// GET /api/agentik-onboarding/[token]   → fetch onboarding data
// POST /api/agentik-onboarding/[token]  → submit form

import { getSupabase } from '../_lib/auth.js';

const N8N_ONBOARDING_SUBMIT_WEBHOOK_URL = process.env.N8N_ONBOARDING_SUBMIT_WEBHOOK_URL;

const slugify = (str) =>
  String(str || '')
    .toLowerCase()
    // Norwegian letters first (NFD doesn't decompose æ/ø/å) — must come BEFORE the generic strip.
    .replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

// Returns a slug guaranteed unique in the partners table.
async function uniqueSlug(supabase, base) {
  if (!base) base = 'partner-' + Math.random().toString(36).slice(2, 8);
  let candidate = base;
  for (let i = 2; i <= 20; i++) {
    const { data, error } = await supabase
      .from('partners')
      .select('id')
      .eq('slug', candidate)
      .maybeSingle();
    if (error || !data) return candidate;
    candidate = `${base}-${i}`;
  }
  return `${base}-${Math.random().toString(36).slice(2, 6)}`;
}

// Provision the customer's partner record + initial people + initial tasks
// based on the form data they just submitted.
async function provisionPartnerFromOnboarding(supabase, onboarding, formData) {
  // Skip if a partner is already linked to this onboarding
  const { data: existing } = await supabase
    .from('partners')
    .select('id, slug')
    .eq('onboarding_id', onboarding.id)
    .maybeSingle();
  if (existing) return existing;

  const slugBase = slugify(onboarding.bedrift || formData.bedrift || '');
  const slug = await uniqueSlug(supabase, slugBase);

  const onboardingDate = new Date();
  // Sprint slutt = 91 days after onboarding date
  const sprintEnd = new Date(onboardingDate.getTime() + 91 * 24 * 60 * 60 * 1000);

  const { data: partner, error: partnerErr } = await supabase
    .from('partners')
    .insert({
      onboarding_id: onboarding.id,
      bedrift: onboarding.bedrift || formData.bedrift,
      slug,
      status: 'onboarding',
      daglig_leder: formData.dagligLederNavn || onboarding.daglig_leder,
      daglig_leder_epost: formData.dagligLederEpost || onboarding.daglig_leder_epost,
      daglig_leder_telefon: formData.dagligLederTelefon || onboarding.daglig_leder_telefon,
      logo_url: formData.logoUrl || null,
      pris_per_mnd: onboarding.pris_per_mnd ?? 39000,
      onboarding_dato: onboardingDate.toISOString().slice(0, 10),
      sprint_slutt: sprintEnd.toISOString().slice(0, 10),
    })
    .select()
    .single();

  if (partnerErr || !partner) {
    console.error('Partner insert failed:', partnerErr);
    return null;
  }

  // Insert key people
  const people = (formData.nokkelpersoner || [])
    .filter((p) => p?.navn?.trim())
    .map((p) => ({
      partner_id: partner.id,
      navn: p.navn.trim(),
      rolle: p.rolle?.trim() || null,
      epost: p.epost?.trim() || null,
      telefon: p.telefon?.trim() || null,
      omrade: p.omrade?.trim() || null,
      inviter_slack: !!p.inviterSlack,
      bookket_intro: false,
    }));
  if (people.length > 0) {
    const { error } = await supabase.from('partner_people').insert(people);
    if (error) console.error('Partner_people insert failed:', error);
  }

  // Always include the daglig leder if not already in the people list (so they can log in)
  const dlEpost = (formData.dagligLederEpost || onboarding.daglig_leder_epost || '').toLowerCase();
  const dlAlreadyIn = people.some((p) => p.epost && p.epost.toLowerCase() === dlEpost);
  if (dlEpost && !dlAlreadyIn) {
    await supabase.from('partner_people').insert({
      partner_id: partner.id,
      navn: formData.dagligLederNavn || onboarding.daglig_leder || dlEpost.split('@')[0],
      rolle: formData.dagligLederTittel || 'Daglig leder',
      epost: dlEpost,
      telefon: formData.dagligLederTelefon || onboarding.daglig_leder_telefon || null,
      inviter_slack: true,
      bookket_intro: false,
    });
  }

  // Initial onboarding tasks — mirrors what n8n creates in Notion
  const introCount = (formData.nokkelpersoner || []).filter((p) => p?.bookIntro && p?.navn).length;
  const slackInviteCount = (formData.nokkelpersoner || []).filter((p) => p?.inviterSlack && p?.navn).length;

  const tasks = [
    { oppgave: 'Send velkomstgave', tildelt: 'Ole', category: 'onboarding', type: 'Gave' },
    { oppgave: 'Book kickoff-møte (90 min) — innen 5 virkedager', tildelt: 'Ivar', category: 'onboarding', type: 'Møte' },
    { oppgave: `Inviter ${slackInviteCount} personer til Slack-kanal`, tildelt: 'Ivar', category: 'onboarding', type: 'Slack' },
    { oppgave: 'Opprett Fiken-kunde og send første faktura', tildelt: 'Ivar', category: 'onboarding', type: 'Faktura' },
    { oppgave: 'Verifiser brand-assets (logo, farger)', tildelt: 'Ivar', category: 'onboarding', type: 'Setup' },
    { oppgave: 'AI-Revisjon: prosess- og systemkartlegging', tildelt: 'Ivar', category: 'revisjon', type: 'Notion' },
    { oppgave: 'AI-Revisjon: verdi-baseline dokumentert', tildelt: 'Ivar', category: 'revisjon', type: 'Notion' },
    { oppgave: 'AI-Revisjon: ROI-prioritering (top 3-5 tiltak)', tildelt: 'Ivar', category: 'revisjon', type: 'Notion' },
    { oppgave: 'AI-Revisjon: 90-dagers roadmap låst sammen med kunden', tildelt: 'Ivar', category: 'revisjon', type: 'Notion' },
  ];
  for (let i = 0; i < introCount; i++) {
    const p = formData.nokkelpersoner[i];
    if (!p?.navn || !p?.bookIntro) continue;
    tasks.push({
      oppgave: `AI-Revisjon: intervju med ${p.navn} (${p.rolle || 'rolle ukjent'})`,
      tildelt: 'Ivar',
      category: 'revisjon',
      type: 'Møte',
    });
  }

  const taskRows = tasks.map((t) => ({ partner_id: partner.id, status: 'todo', ...t }));
  if (taskRows.length > 0) {
    const { error } = await supabase.from('partner_tasks').insert(taskRows);
    if (error) console.error('Partner_tasks insert failed:', error);
  }

  // First activity entry — kickoff signal
  await supabase.from('partner_activity').insert({
    partner_id: partner.id,
    type: 'milestone',
    tittel: 'Onboarding-skjema fullført — Sprint starter',
    beskrivelse: `${people.length} nøkkelpersoner registrert. Vi setter opp Slack, kickoff og første intervjuer.`,
    forfatter: 'Agentik',
    happened_at: new Date().toISOString(),
  });

  return partner;
}

export default async function handler(req, res) {
  const { token } = req.query;
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'token required' });
  }

  let supabase;
  try {
    supabase = getSupabase();
  } catch {
    return res.status(500).json({ error: 'Server misconfigured.' });
  }

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('onboardings')
        .select('id, token, status, bedrift, bedrift_domene, org_nr, daglig_leder, daglig_leder_epost, daglig_leder_telefon, pris_per_mnd, form_data, form_submitted_at, completed_at, loom_video_url')
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
        .select('id, token, status, bedrift, daglig_leder, daglig_leder_epost, daglig_leder_telefon, pris_per_mnd')
        .eq('token', token)
        .single();
      const isFirstSubmission = existing?.status === 'initiated';

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
        .select('id, token, bedrift, daglig_leder, daglig_leder_epost, daglig_leder_telefon, pris_per_mnd, form_data')
        .single();

      if (updateErr || !updated) {
        console.error('Onboarding update failed:', updateErr);
        return res.status(500).json({ error: 'Could not save form' });
      }

      // Provision partner + people + tasks in Supabase (so dashboard works immediately).
      // Failures here are non-fatal — n8n still does Notion side, admin can fix in /admin.
      let provisionedPartner = null;
      try {
        provisionedPartner = await provisionPartnerFromOnboarding(supabase, updated, formData);
      } catch (e) {
        console.error('Partner provisioning failed (non-fatal):', e);
      }

      // Forward to n8n — only on FIRST submission. Resubmits would create duplicate Notion rows
      // and emails. (Partner provisioning above is idempotent so re-running it is safe.)
      if (isFirstSubmission && N8N_ONBOARDING_SUBMIT_WEBHOOK_URL) {
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
              partner_slug: provisionedPartner?.slug || null,
              submitted_at: new Date().toISOString(),
            }),
          });
        } catch (e) {
          console.error('N8N submit webhook failed (non-fatal):', e);
        }
      }

      return res.status(200).json({ success: true, partner_slug: provisionedPartner?.slug || null });
    } catch (err) {
      console.error('Onboarding submit error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
