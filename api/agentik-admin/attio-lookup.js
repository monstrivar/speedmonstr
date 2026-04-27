// GET /api/agentik-admin/attio-lookup?email=...
// Pre-fills onboarding by pulling person + company from Attio.
// Used when admin clicks "Onboard new partner" — they paste an email,
// we find the existing CRM record and auto-fill the partner form.

import { requireAdmin } from '../_lib/auth.js';

const ATTIO_API_KEY = process.env.ATTIO_API_KEY;
const ATTIO_BASE = 'https://api.attio.com/v2';

async function attioFetch(path, opts = {}) {
  const res = await fetch(`${ATTIO_BASE}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${ATTIO_API_KEY}`,
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Attio ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json();
}

// Attio attribute helpers (their schema nests values inside arrays of objects)
const firstValue = (attr) => Array.isArray(attr) && attr.length > 0 ? attr[0] : null;
const stringValue = (attr) => firstValue(attr)?.value ?? null;
const personalNameValue = (attr) => {
  const v = firstValue(attr);
  if (!v) return null;
  return v.full_name || [v.first_name, v.last_name].filter(Boolean).join(' ') || null;
};
const recordRefValue = (attr) => firstValue(attr)?.target_record_id ?? null;

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await requireAdmin(req);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }

  if (!ATTIO_API_KEY) {
    return res.status(500).json({ error: 'ATTIO_API_KEY mangler i miljøet' });
  }

  const email = (req.query.email || '').trim().toLowerCase();
  if (!email) return res.status(400).json({ error: 'email kreves' });

  try {
    // Search for the person by email in Attio
    const search = await attioFetch('/objects/people/records/query', {
      method: 'POST',
      body: JSON.stringify({
        filter: { email_addresses: { email_address: { '$eq': email } } },
        limit: 1,
      }),
    });

    const personRecord = search.data?.[0];
    if (!personRecord) {
      return res.status(404).json({ error: 'Fant ingen person i Attio med den e-posten', email });
    }

    const v = personRecord.values || {};
    const person = {
      attio_record_id: personRecord.id?.record_id,
      navn: personalNameValue(v.name),
      epost: stringValue(v.email_addresses) || email,
      telefon: stringValue(v.phone_numbers),
      tittel: stringValue(v.job_title),
    };

    let company = null;
    const companyRefId = recordRefValue(v.company);
    if (companyRefId) {
      try {
        const companyRecord = await attioFetch(`/objects/companies/records/${companyRefId}`);
        const cv = companyRecord.data?.values || {};
        company = {
          attio_record_id: companyRefId,
          bedrift: stringValue(cv.name),
          domene: stringValue(cv.domains),
          org_nr: stringValue(cv.organization_number) || stringValue(cv.org_nr),
          ansatte: stringValue(cv.employees),
          beskrivelse: stringValue(cv.description),
        };
      } catch (err) {
        console.warn('Attio company fetch failed:', err.message);
      }
    }

    // Suggested slug derived from company name (admin can override)
    const suggestedSlug = company?.bedrift
      ? company.bedrift.toLowerCase()
        .replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a')
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60)
      : null;

    return res.status(200).json({
      person,
      company,
      suggestedSlug,
    });
  } catch (err) {
    console.error('Attio lookup error:', err);
    return res.status(500).json({ error: err.message });
  }
}
