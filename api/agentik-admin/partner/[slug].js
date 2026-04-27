// GET   /api/agentik-admin/partner/[slug]  → full partner data (admin view)
// PATCH /api/agentik-admin/partner/[slug]  → update partner core fields

import { requireAdmin, getSupabase } from '../../_lib/auth.js';

const ALLOWED_FIELDS = [
  'bedrift', 'daglig_leder', 'status',
  'onboarding_dato', 'sprint_slutt',
  'pris_per_mnd', 'brand_color', 'logo_url',
  'slack_kanal', 'slack_url',
];
const ALLOWED_STATUS = ['onboarding', 'sprint', 'drift', 'pause', 'avsluttet'];
const NUMERIC_FIELDS = new Set(['pris_per_mnd']);
const HEX_FIELDS = new Set(['brand_color']);

function coerceUpdate(body) {
  const out = {};
  for (const k of ALLOWED_FIELDS) {
    if (!(k in (body || {}))) continue;
    let v = body[k];
    if (NUMERIC_FIELDS.has(k)) {
      if (v == null || v === '') { out[k] = null; continue; }
      const cleaned = typeof v === 'string' ? v.replace(/\s+/g, '').replace(',', '.') : v;
      const n = Number(cleaned);
      out[k] = Number.isFinite(n) ? n : null;
      continue;
    }
    if (typeof v === 'string') v = v.trim();
    if (v === '') v = null;
    if (HEX_FIELDS.has(k) && v && !/^#?[0-9a-fA-F]{3,8}$/.test(v)) {
      throw new Error(`${k} må være en hex-farge (f.eks. #1A6B6D)`);
    }
    out[k] = v;
  }
  if (out.status && !ALLOWED_STATUS.includes(out.status)) {
    throw new Error('ugyldig status');
  }
  return out;
}

export default async function handler(req, res) {
  try {
    await requireAdmin(req);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }

  const { slug } = req.query;
  if (!slug) return res.status(400).json({ error: 'slug required' });

  const supabase = getSupabase();

  if (req.method === 'GET') {
    try {
      const { data: partner, error } = await supabase
        .from('partners')
        .select('*')
        .eq('slug', slug)
        .single();
      if (error || !partner) return res.status(404).json({ error: 'Partner not found' });

      const partnerId = partner.id;
      const [tasksRes, peopleRes, meetingsRes, projectsRes, roiRes, activityRes] = await Promise.all([
        supabase.from('partner_tasks').select('*').eq('partner_id', partnerId).order('updated_at', { ascending: false }),
        supabase.from('partner_people').select('*').eq('partner_id', partnerId).order('created_at', { ascending: true }),
        supabase.from('partner_meetings').select('*').eq('partner_id', partnerId).order('dato', { ascending: false }),
        supabase.from('partner_projects').select('*').eq('partner_id', partnerId).order('updated_at', { ascending: false }),
        supabase.from('partner_roi').select('*').eq('partner_id', partnerId).order('metric_dato', { ascending: false }),
        supabase.from('partner_activity').select('*').eq('partner_id', partnerId).order('happened_at', { ascending: false }).limit(50),
      ]);

      return res.status(200).json({
        partner,
        tasks: tasksRes.data || [],
        people: peopleRes.data || [],
        meetings: meetingsRes.data || [],
        projects: projectsRes.data || [],
        roi: roiRes.data || [],
        activity: activityRes.data || [],
      });
    } catch (err) {
      console.error('Admin partner get error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      let updates;
      try {
        updates = coerceUpdate(req.body);
      } catch (validationErr) {
        return res.status(400).json({ error: validationErr.message });
      }
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'Ingen felter å oppdatere' });
      }
      updates.updated_at = new Date().toISOString();

      // Detect status transition for auto-activity logging
      const wantsStatusLog = 'status' in updates;
      const prev = wantsStatusLog
        ? (await supabase.from('partners').select('id, status').eq('slug', slug).maybeSingle()).data
        : null;

      const { data, error } = await supabase
        .from('partners')
        .update(updates)
        .eq('slug', slug)
        .select()
        .single();
      if (error || !data) return res.status(404).json({ error: 'Partner not found or update failed' });

      if (prev && prev.status !== data.status) {
        const STATUS_COPY = {
          sprint: { type: 'milestone', tittel: '90-dagers Sprint startet', beskrivelse: 'Vi er offisielt i gang. Implementering og første leveranser går nå.' },
          drift: { type: 'milestone', tittel: 'Sprint fullført — over i drift', beskrivelse: 'Verdien er dokumentert. Vi går over til løpende partnerskap.' },
          pause: { type: 'update', tittel: 'Partnerskapet er pauset', beskrivelse: null },
          avsluttet: { type: 'update', tittel: 'Partnerskapet er avsluttet', beskrivelse: null },
        };
        const copy = STATUS_COPY[data.status];
        if (copy) {
          try {
            await supabase.from('partner_activity').insert({
              partner_id: data.id,
              type: copy.type,
              tittel: copy.tittel,
              beskrivelse: copy.beskrivelse,
              forfatter: 'Agentik',
              happened_at: new Date().toISOString(),
            });
          } catch (e) { console.warn('Status auto-log failed:', e.message); }
        }
      }
      return res.status(200).json({ partner: data });
    } catch (err) {
      console.error('Admin partner patch error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
