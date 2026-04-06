export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // API key authentication
  const { WEBHOOK_API_KEY } = process.env;
  if (!WEBHOOK_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== WEBHOOK_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const {
    TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,
    SMS_AIRTABLE_BASE_ID, SMS_AIRTABLE_LOG_TABLE_ID, AIRTABLE_TOKEN,
  } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    return res.status(500).json({ error: 'SMS not configured' });
  }

  const { fornavn, telefon, bedriftsnavn, recordId } = req.body || {};

  if (!fornavn || !telefon) {
    return res.status(400).json({ error: 'Missing required fields: fornavn, telefon' });
  }

  // Normalize Norwegian phone number (handles "40 50 60 70" format)
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
  if (!normalizedPhone) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }

  const smsBody = `Hei ${fornavn}, takk for henvendelsen.\n\nVi tar kontakt med deg veldig snart, dette blir veldig bra!\n\nMed vennlig hilsen,\n${bedriftsnavn || 'Monstr'}`;

  // Send SMS via Twilio
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
        From: 'MonstrAI',
        To: normalizedPhone,
        Body: smsBody,
      }),
    });
    const twilioData = await twilioRes.json();
    twilioSid = twilioData.sid || null;
    smsStatus = twilioData.sid ? 'Sendt' : 'Feilet';
    console.log('SMS SHOW:', smsStatus, twilioData.sid || twilioData.message);
  } catch (err) {
    console.error('Twilio error:', err);
    return res.status(500).json({ error: 'SMS sending failed' });
  }

  // Log to SMS Logg table
  if (SMS_AIRTABLE_BASE_ID && SMS_AIRTABLE_LOG_TABLE_ID && AIRTABLE_TOKEN) {
    try {
      await fetch(
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
              Kilde: 'SHOW-knapp',
            },
          }),
        }
      );
    } catch (err) {
      console.error('SMS Logg error:', err);
    }
  }

  return res.status(200).json({ success: true, smsStatus, twilioSid });
}
