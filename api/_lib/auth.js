// Shared auth helper for /api/* endpoints.
// Verifies Supabase JWT and returns { email, isAdmin, userId } or throws.
//
// SECURITY NOTE: getSupabase() returns a client using SUPABASE_KEY. With our setup
// that key is the anon key (RLS still applies for anon). All admin endpoints do an
// explicit JWT check via verifyAuth/requireAdmin BEFORE running any queries — this
// means the auth model is "verify token at the gate, query freely after". Do NOT
// remove the JWT check assuming RLS will catch it; some queries we run could fail
// silently or return empty rows under RLS instead of erroring.
//
// IMPORTANT: keep ADMIN_EMAILS default in sync with VITE_ADMIN_EMAILS in src/lib/auth.jsx.

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
// Prefer service-role key when available — bypasses RLS so server can read/write every table.
// Falls back to anon key for backward compatibility. Once the public-read RLS policies on
// partner_* tables are dropped (after SUPABASE_SERVICE_ROLE_KEY is set in env), the anon
// fallback will stop working and force the right config.
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
const USING_SERVICE_ROLE = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'ivar@agentik.no,ole@agentik.no,ivar@monstr.no')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function getSupabase() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Server misconfigured');
  }
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const isUsingServiceRole = () => USING_SERVICE_ROLE;

export async function verifyAuth(req) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) {
    const err = new Error('Mangler token');
    err.status = 401;
    throw err;
  }
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user?.email) {
    const err = new Error('Ugyldig token');
    err.status = 401;
    throw err;
  }
  const email = data.user.email.toLowerCase();
  return {
    email,
    userId: data.user.id,
    isAdmin: ADMIN_EMAILS.includes(email),
  };
}

export async function requireAdmin(req) {
  const user = await verifyAuth(req);
  if (!user.isAdmin) {
    const err = new Error('Admin-tilgang kreves');
    err.status = 403;
    throw err;
  }
  return user;
}
