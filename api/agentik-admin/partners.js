// GET  /api/agentik-admin/partners  → list all partners (admin)
// POST /api/agentik-admin/partners  → create new partner (admin)

import { requireAdmin, getSupabase } from '../_lib/auth.js';

export default async function handler(req, res) {
  try {
    await requireAdmin(req);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }

  const supabase = getSupabase();

  if (req.method === 'GET') {
    try {
      const { data: partners, error } = await supabase
        .from('partners')
        .select('id, slug, bedrift, daglig_leder, status, onboarding_dato, sprint_slutt, brand_color, logo_url, pris_per_mnd, last_seen_at, last_seen_email, created_at, updated_at')
        .order('created_at', { ascending: false });
      if (error) throw error;

      // Aggregate quick stats per partner — N+1 but small dataset; optimize later if needed
      const enriched = await Promise.all((partners || []).map(async (p) => {
        const [{ count: openTasks }, { data: latestActivity }, { data: latestRoi }, { count: totalProjects }] = await Promise.all([
          supabase.from('partner_tasks').select('id', { count: 'exact', head: true }).eq('partner_id', p.id).in('status', ['todo', 'doing']),
          supabase.from('partner_activity').select('happened_at, tittel').eq('partner_id', p.id).order('happened_at', { ascending: false }).limit(1).maybeSingle(),
          supabase.from('partner_roi').select('arlig_verdi_estimat, metric_dato').eq('partner_id', p.id).order('metric_dato', { ascending: false }).limit(1).maybeSingle(),
          supabase.from('partner_projects').select('id', { count: 'exact', head: true }).eq('partner_id', p.id),
        ]);
        return {
          ...p,
          stats: {
            open_tasks: openTasks || 0,
            total_projects: totalProjects || 0,
            latest_activity: latestActivity || null,
            latest_roi: latestRoi || null,
          },
        };
      }));

      return res.status(200).json({ partners: enriched });
    } catch (err) {
      console.error('Admin partners list error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { slug, bedrift, daglig_leder, status, onboarding_dato, sprint_slutt, pris_per_mnd, brand_color } = req.body || {};
      if (!slug || !bedrift) {
        return res.status(400).json({ error: 'slug og bedrift er påkrevd' });
      }
      const allowedStatus = ['onboarding', 'sprint', 'drift', 'pause', 'avsluttet'];
      if (status && !allowedStatus.includes(status)) {
        return res.status(400).json({ error: 'ugyldig status' });
      }
      // Coerce pris_per_mnd: handle "39 000" → 39000, "" → null, 0 → 0 (free pilot allowed).
      let priceVal = null;
      if (pris_per_mnd != null && pris_per_mnd !== '') {
        const cleaned = typeof pris_per_mnd === 'string' ? pris_per_mnd.replace(/\s+/g, '').replace(',', '.') : pris_per_mnd;
        const n = Number(cleaned);
        priceVal = Number.isFinite(n) ? n : null;
      }
      const { data, error } = await supabase
        .from('partners')
        .insert({
          slug: slug.trim().toLowerCase(),
          bedrift: bedrift.trim(),
          daglig_leder: daglig_leder?.trim() || null,
          status: status || 'onboarding',
          onboarding_dato: onboarding_dato || null,
          sprint_slutt: sprint_slutt || null,
          pris_per_mnd: priceVal,
          brand_color: brand_color?.trim() || null,
        })
        .select()
        .single();
      if (error) {
        if (error.code === '23505') return res.status(409).json({ error: 'Slug er allerede i bruk' });
        throw error;
      }
      return res.status(201).json({ partner: data });
    } catch (err) {
      console.error('Admin partner create error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
