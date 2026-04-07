// Rate limit: max 2 demo SMS per phone number per hour
const rateLimitMap = new Map();

function isRateLimited(phone) {
  const now = Date.now();
  const entries = rateLimitMap.get(phone) || [];
  const recent = entries.filter(t => now - t < 3600000);
  rateLimitMap.set(phone, recent);
  return recent.length >= 2;
}

function recordUsage(phone) {
  const entries = rateLimitMap.get(phone) || [];
  entries.push(Date.now());
  rateLimitMap.set(phone, entries);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,
    SMS_AIRTABLE_BASE_ID, SMS_AIRTABLE_LOG_TABLE_ID, AIRTABLE_TOKEN,
  } = process.env;

  // Leads table in Monstr base
  const LEADS_BASE_ID = 'appM5wdT9AbJ1YRCy';
  const LEADS_TABLE_ID = 'tblbt7GwhHHAY25dm';

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    return res.status(500).json({ error: 'SMS not configured' });
  }

  const { fornavn, telefon, bedriftsnavn, samtykke } = req.body || {};

  if (!fornavn || !telefon || !bedriftsnavn) {
    return res.status(400).json({ error: 'Alle felt er påkrevd' });
  }

  if (fornavn.length > 50 || bedriftsnavn.length > 80 || telefon.length > 20) {
    return res.status(400).json({ error: 'Feltene er for lange' });
  }

  // Normalize Norwegian phone number
  function normalizePhone(raw) {
    if (!raw) return '';
    let cleaned = raw.replace(/[\s\-()]/g, '');
    if (cleaned.startsWith('00')) cleaned = '+' + cleaned.slice(2);
    if (cleaned.startsWith('47') && !cleaned.startsWith('+')) cleaned = '+' + cleaned;
    if (/^\d{8}$/.test(cleaned)) cleaned = '+47' + cleaned;
    if (!cleaned.startsWith('+47')) return cleaned;
    return cleaned;
  }

  const normalizedPhone = normalizePhone(telefon);
  if (!normalizedPhone || !normalizedPhone.startsWith('+47') || normalizedPhone.length !== 11) {
    return res.status(400).json({ error: 'Ugyldig norsk telefonnummer' });
  }

  if (isRateLimited(normalizedPhone)) {
    return res.status(429).json({ error: 'Du har allerede testet demoen. Prøv igjen senere.' });
  }

  const smsBody = `Heisann ${fornavn},\nTakk for at du tok kontakt med oss!\n\nVi tar straks opp tråden, og ser frem til å hjelpe deg.\n\nMed vennlig hilsen,\n${bedriftsnavn}`;

  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  const twilioAuth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');

  let twilioSid = null;
  let smsStatus = 'Feilet';

  try {
    const twilioRes = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${twilioAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: bedriftsnavn.substring(0, 11),
        To: normalizedPhone,
        Body: smsBody,
      }),
    });
    const twilioData = await twilioRes.json();
    twilioSid = twilioData.sid || null;
    smsStatus = twilioData.sid ? 'Sendt' : 'Feilet';

    if (!twilioData.sid) {
      console.error('Twilio demo error:', twilioData.message);
      return res.status(500).json({ error: 'Kunne ikke sende SMS. Prøv igjen.' });
    }
  } catch (err) {
    console.error('Twilio error:', err);
    return res.status(500).json({ error: 'SMS-sending feilet' });
  }

  recordUsage(normalizedPhone);

  // Log to SMS Logg + Leads table in parallel
  const logPromises = [];

  // SMS Logg (existing audit trail)
  if (SMS_AIRTABLE_BASE_ID && SMS_AIRTABLE_LOG_TABLE_ID && AIRTABLE_TOKEN) {
    logPromises.push(
      fetch(
        `https://api.airtable.com/v0/${SMS_AIRTABLE_BASE_ID}/${SMS_AIRTABLE_LOG_TABLE_ID}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${AIRTABLE_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fields: {
              Mottaker: fornavn,
              Fornavn: fornavn,
              Telefon: normalizedPhone,
              Melding: smsBody,
              Sendt: new Date().toISOString(),
              Status: smsStatus,
              Kilde: 'Demo (nettside)',
              'Twilio SID': twilioSid,
            },
          }),
        }
      ).catch(err => console.error('SMS Logg error:', err))
    );
  }

  // Leads table (lead capture)
  if (AIRTABLE_TOKEN) {
    logPromises.push(
      fetch(
        `https://api.airtable.com/v0/${LEADS_BASE_ID}/${LEADS_TABLE_ID}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${AIRTABLE_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fields: {
              Navn: fornavn,
              Bedriftsnavn: bedriftsnavn,
              Telefon: normalizedPhone,
              Kilde: 'Demo (nettside)',
              'Samtykke oppfølging': !!samtykke,
              Opprettet: new Date().toISOString(),
              Status: 'Ny',
            },
          }),
        }
      ).catch(err => console.error('Leads table error:', err))
    );
  }

  await Promise.allSettled(logPromises);

  return res.status(200).json({ success: true });
}
