// GET /api/agentik-presentation/[id]
// Returns the stored HTML presentation for a given UUID.

import { getSupabase } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'id is required' });
  }

  // Basic UUID v4-shape sanity check (doesn't need to be perfect — just reject obvious garbage)
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return res.status(400).json({ error: 'invalid id' });
  }

  try {
    let supabase;
    try { supabase = getSupabase(); }
    catch { return res.status(500).json({ error: 'Server misconfigured.' }); }
    const { data, error } = await supabase
      .from('presentations')
      .select('html, client_name, client_company, created_at')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'not found' });
    }

    return res.status(200).json({
      html: data.html,
      client_name: data.client_name,
      client_company: data.client_company,
      created_at: data.created_at,
    });
  } catch (err) {
    console.error('Presentation fetch error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
