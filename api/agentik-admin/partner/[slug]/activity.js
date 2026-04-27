// POST /api/agentik-admin/partner/[slug]/activity → log a new activity entry

import { requireAdmin, getSupabase } from '../../../_lib/auth.js';

const VALID_TYPES = ['update', 'meeting', 'milestone', 'task', 'comment', 'delivery', 'discovery'];

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
    const { type, tittel, beskrivelse, forfatter, related_id, related_type, happened_at } = req.body || {};
    if (!tittel || !type) return res.status(400).json({ error: 'type og tittel er påkrevd' });
    if (!VALID_TYPES.includes(type)) return res.status(400).json({ error: 'ugyldig type' });

    const { data: partner, error: pErr } = await supabase
      .from('partners')
      .select('id')
      .eq('slug', slug)
      .single();
    if (pErr || !partner) return res.status(404).json({ error: 'Partner not found' });

    const { data, error } = await supabase
      .from('partner_activity')
      .insert({
        partner_id: partner.id,
        type,
        tittel: tittel.trim(),
        beskrivelse: beskrivelse?.trim() || null,
        forfatter: forfatter?.trim() || 'Agentik',
        related_id: related_id || null,
        related_type: related_type || null,
        happened_at: happened_at || new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw error;
    return res.status(201).json({ activity: data });
  } catch (err) {
    console.error('Admin activity post error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
