// GET /api/agentik-auth/me
// Verifies Supabase JWT (via shared _lib/auth.js — single source of truth for ADMIN_EMAILS),
// returns the partners this user has access to + admin flag.

import { verifyAuth, getSupabase } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let user;
  try {
    user = await verifyAuth(req);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }

  try {
    const admin = getSupabase();
    const { email, isAdmin } = user;

    let partners = [];
    if (isAdmin) {
      const { data, error } = await admin
        .from('partners')
        .select('slug, bedrift')
        .order('bedrift', { ascending: true });
      if (error) throw error;
      partners = data || [];
    } else {
      // Exact email match (NEVER use ilike alone — wildcards in stored emails would bypass).
      const { data: peopleRows, error: peopleErr } = await admin
        .from('partner_people')
        .select('partner_id, epost')
        .eq('epost', email);
      if (peopleErr) throw peopleErr;
      let allRows = peopleRows || [];
      // Fallback: case-insensitive match (epost stored mixed-case), but JS-side exact compare.
      if (allRows.length === 0) {
        const escaped = email.replace(/[%_]/g, '\\$&');
        const { data: ciRows } = await admin
          .from('partner_people')
          .select('partner_id, epost')
          .ilike('epost', escaped);
        allRows = (ciRows || []).filter((r) => (r.epost || '').toLowerCase() === email);
      }
      const ids = [...new Set(allRows.map((r) => r.partner_id))];
      if (ids.length > 0) {
        const { data, error } = await admin
          .from('partners')
          .select('slug, bedrift')
          .in('id', ids)
          .order('bedrift', { ascending: true });
        if (error) throw error;
        partners = data || [];
      }
    }

    return res.status(200).json({
      email,
      isAdmin,
      partners,
    });
  } catch (err) {
    console.error('Auth me error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
