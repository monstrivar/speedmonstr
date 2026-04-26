// GET /api/agentik-partner/[slug]
// Returns full partner data for the customer-facing dashboard.
// Aggregates: partner record + tasks + people + meetings + projects + ROI.

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const { slug } = req.query;
  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'slug required' });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const { data: partner, error: pErr } = await supabase
      .from('partners')
      .select('*')
      .eq('slug', slug)
      .single();

    if (pErr || !partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    const partnerId = partner.id;

    const [tasksRes, peopleRes, meetingsRes, projectsRes, roiRes] = await Promise.all([
      supabase.from('partner_tasks').select('*').eq('partner_id', partnerId).order('created_at', { ascending: false }),
      supabase.from('partner_people').select('*').eq('partner_id', partnerId).order('created_at', { ascending: true }),
      supabase.from('partner_meetings').select('*').eq('partner_id', partnerId).order('dato', { ascending: false }),
      supabase.from('partner_projects').select('*').eq('partner_id', partnerId).order('created_at', { ascending: false }),
      supabase.from('partner_roi').select('*').eq('partner_id', partnerId).order('metric_dato', { ascending: false }),
    ]);

    return res.status(200).json({
      partner,
      tasks: tasksRes.data || [],
      people: peopleRes.data || [],
      meetings: meetingsRes.data || [],
      projects: projectsRes.data || [],
      roi: roiRes.data || [],
    });
  } catch (err) {
    console.error('Partner fetch error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
