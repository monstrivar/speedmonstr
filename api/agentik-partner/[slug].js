// GET /api/agentik-partner/[slug]
// Returns full partner data for the customer-facing dashboard.
// Requires Supabase JWT in Authorization header. Authorization rules:
//  - Admin emails (env ADMIN_EMAILS) → access to any partner
//  - Otherwise: user.email must exist in partner_people for this partner
// Uses _lib/auth.js as the single source of truth for ADMIN_EMAILS.

import { verifyAuth, getSupabase } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug } = req.query;
  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'slug required' });
  }

  let user;
  try {
    user = await verifyAuth(req);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
  const { email, isAdmin } = user;

  try {
    const supabase = getSupabase();

    // 2. Fetch partner record
    const { data: partner, error: pErr } = await supabase
      .from('partners')
      .select('*')
      .eq('slug', slug)
      .single();

    if (pErr || !partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    // 3. Authorization check — exact email match (NEVER use ilike: wildcards in stored emails bypass).
    if (!isAdmin) {
      // Pull candidate rows; final exact comparison happens in JS after lowercasing.
      const escapedEmail = email.replace(/[%_]/g, '\\$&');
      const { data: aclRows, error: aclErr } = await supabase
        .from('partner_people')
        .select('epost')
        .eq('partner_id', partner.id)
        .ilike('epost', escapedEmail);
      if (aclErr) throw aclErr;
      const matched = (aclRows || []).some((r) => (r.epost || '').toLowerCase() === email);
      if (!matched) {
        return res.status(403).json({ error: 'Du har ikke tilgang til dette arbeidsrommet' });
      }
    }

    // 4. Aggregate
    const partnerId = partner.id;
    const [tasksRes, peopleRes, meetingsRes, projectsRes, roiRes, activityRes] = await Promise.all([
      supabase.from('partner_tasks').select('*').eq('partner_id', partnerId).order('updated_at', { ascending: false }),
      supabase.from('partner_people').select('*').eq('partner_id', partnerId).order('created_at', { ascending: true }),
      supabase.from('partner_meetings').select('*').eq('partner_id', partnerId).order('dato', { ascending: false }),
      supabase.from('partner_projects').select('*').eq('partner_id', partnerId).order('updated_at', { ascending: false }),
      supabase.from('partner_roi').select('*').eq('partner_id', partnerId).order('metric_dato', { ascending: false }),
      supabase.from('partner_activity').select('*').eq('partner_id', partnerId).order('happened_at', { ascending: false }).limit(20),
    ]);

    // Track that this user just opened the dashboard.
    // Skip for admins so the count reflects only customer engagement, not us spot-checking.
    if (!isAdmin) {
      try {
        await supabase
          .from('partners')
          .update({
            last_seen_at: new Date().toISOString(),
            last_seen_email: email,
          })
          .eq('id', partner.id);
      } catch (e) {
        console.warn('last_seen update failed (non-fatal):', e.message);
      }
    }

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
    console.error('Partner fetch error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
