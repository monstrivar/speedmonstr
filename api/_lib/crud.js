// Generic CRUD handler for partner sub-resources.
// Endpoints expose POST/PATCH/DELETE; PATCH/DELETE expect `id` in the body.
//
// `autoActivity` opts the resource into automatic partner_activity logging:
//   - on POST: log a "create" activity if `onCreate` returns truthy
//   - on PATCH: log a "transition" activity if `onUpdate(prev, next)` returns truthy
// Each callback returns either null (skip) or { type, tittel, beskrivelse }.

import { requireAdmin, getSupabase } from './auth.js';

async function logActivity(supabase, partnerId, payload, related) {
  if (!payload) return;
  try {
    await supabase.from('partner_activity').insert({
      partner_id: partnerId,
      type: payload.type || 'update',
      tittel: payload.tittel,
      beskrivelse: payload.beskrivelse || null,
      forfatter: 'Agentik',
      related_id: related?.id || null,
      related_type: related?.type || null,
      happened_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Auto-activity log failed:', err.message);
  }
}

// Fields that must be cast to number (or null) before insert/update — strings like
// "39 000" with a thousands separator, or empty strings, would otherwise reach Postgres.
const NUMERIC_FIELDS = new Set([
  'pris_per_mnd', 'verdi_estimat_arlig', 'forventet_timer', 'faktiske_timer',
  'spart_timer_uke', 'arlig_verdi_estimat', 'timepris',
]);

const coerceNumber = (v) => {
  if (v == null || v === '') return null;
  const cleaned = typeof v === 'string' ? v.replace(/\s+/g, '').replace(',', '.') : v;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
};

export function makeCrudHandler({ table, allowedFields, requiredFields = [], autoActivity }) {
  return async function handler(req, res) {
    try {
      await requireAdmin(req);
    } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
    }

    const { slug } = req.query;
    if (!slug) return res.status(400).json({ error: 'slug required' });

    const supabase = getSupabase();
    const { data: partner, error: pErr } = await supabase
      .from('partners')
      .select('id')
      .eq('slug', slug)
      .single();
    if (pErr || !partner) return res.status(404).json({ error: 'Partner not found' });

    const pickAllowed = (body) => {
      const out = {};
      for (const k of allowedFields) {
        if (!(k in (body || {}))) continue;
        let v = body[k];
        if (NUMERIC_FIELDS.has(k)) {
          out[k] = coerceNumber(v);
          continue;
        }
        if (typeof v === 'string') v = v.trim();
        if (v === '') v = null;
        out[k] = v;
      }
      return out;
    };

    if (req.method === 'POST') {
      const body = pickAllowed(req.body);
      for (const k of requiredFields) {
        if (!body[k]) return res.status(400).json({ error: `${k} er påkrevd` });
      }
      const { data, error } = await supabase
        .from(table)
        .insert({ ...body, partner_id: partner.id })
        .select()
        .single();
      if (error) {
        console.error(`${table} insert error:`, error);
        return res.status(500).json({ error: error.message });
      }
      if (autoActivity?.onCreate) {
        const payload = autoActivity.onCreate(data);
        await logActivity(supabase, partner.id, payload, { id: data.id, type: autoActivity.relatedType });
      }
      return res.status(201).json({ item: data });
    }

    if (req.method === 'PATCH') {
      const id = req.body?.id;
      if (!id) return res.status(400).json({ error: 'id påkrevd' });
      const body = pickAllowed(req.body);
      if (Object.keys(body).length === 0) {
        return res.status(400).json({ error: 'Ingen felter å oppdatere' });
      }
      // Fetch previous state for transition detection
      let prev = null;
      if (autoActivity?.onUpdate) {
        const prevRes = await supabase.from(table).select('*').eq('id', id).eq('partner_id', partner.id).maybeSingle();
        prev = prevRes.data;
      }
      const { data, error } = await supabase
        .from(table)
        .update(body)
        .eq('id', id)
        .eq('partner_id', partner.id)
        .select()
        .single();
      if (error || !data) return res.status(404).json({ error: 'Ikke funnet' });
      if (autoActivity?.onUpdate && prev) {
        const payload = autoActivity.onUpdate(prev, data);
        await logActivity(supabase, partner.id, payload, { id: data.id, type: autoActivity.relatedType });
      }
      return res.status(200).json({ item: data });
    }

    if (req.method === 'DELETE') {
      const id = req.body?.id;
      if (!id) return res.status(400).json({ error: 'id påkrevd' });
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
        .eq('partner_id', partner.id);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method not allowed' });
  };
}
