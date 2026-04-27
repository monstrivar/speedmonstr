// POST /api/agentik-admin/partner/[slug]/roi → add a new ROI snapshot

import { requireAdmin, getSupabase } from '../../../_lib/auth.js';

export default async function handler(req, res) {
  try {
    await requireAdmin(req);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { slug } = req.query;
  if (!slug) return res.status(400).json({ error: 'slug required' });

  const supabase = getSupabase();

  try {
    const { spart_timer_uke, arlig_verdi_estimat, timepris, metric_dato, notater } = req.body || {};

    const { data: partner, error: pErr } = await supabase
      .from('partners')
      .select('id')
      .eq('slug', slug)
      .single();
    if (pErr || !partner) return res.status(404).json({ error: 'Partner not found' });

    const { data, error } = await supabase
      .from('partner_roi')
      .insert({
        partner_id: partner.id,
        metric_dato: metric_dato || new Date().toISOString().slice(0, 10),
        spart_timer_uke: spart_timer_uke ? Number(spart_timer_uke) : null,
        arlig_verdi_estimat: arlig_verdi_estimat ? Number(arlig_verdi_estimat) : null,
        timepris: timepris ? Number(timepris) : null,
        notater: notater?.trim() || null,
      })
      .select()
      .single();
    if (error) throw error;
    return res.status(201).json({ roi: data });
  } catch (err) {
    console.error('Admin ROI post error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
