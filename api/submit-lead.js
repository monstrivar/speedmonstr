// Simple in-memory rate limiter (resets on cold start, good enough for spam protection)
const submissions = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limit: max 3 submissions per IP per hour
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxPerWindow = 3;

  const ipRecord = submissions.get(ip) || [];
  const recent = ipRecord.filter(t => now - t < windowMs);
  if (recent.length >= maxPerWindow) {
    return res.status(429).json({ error: 'For mange forespørsler. Prøv igjen senere.' });
  }
  recent.push(now);
  submissions.set(ip, recent);

  const {
    AIRTABLE_TOKEN,
    TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,
    TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID,
  } = process.env;

  // SMS base IDs — single source of truth
  const SMS_BASE_ID = 'apppLbO2YqIMYWh3X';
  const COMPANIES_TABLE_ID = 'tblfjGVLv2krsNwQk';
  const SMS_LOG_TABLE_ID = 'tblKQIg7SIGS91HAV';

  if (!AIRTABLE_TOKEN) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const {
    firstName,
    lastName,
    company,
    email,
    phone,
    website,
    leadsPerMonth,
    leadSources,
    followUpProcess,
    customerValue,
    intent,
    decisionMaker,
  } = req.body;

  // Validation — matches frontend: firstName, phone, company required
  if (!firstName || !phone || !company) {
    return res.status(400).json({ error: 'Fornavn, telefonnummer og bedrift er påkrevd.' });
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Ugyldig e-postadresse.' });
  }

  // Validate dropdown values against allowed options
  const allowedLeads = ['0–10', '10–30', '30–75', '75+', ''];
  const allowedValues = ['Under 5 000 NOK', '5 000–15 000 NOK', '15 000–50 000 NOK', '50 000+ NOK', ''];
  const allowedIntent = ['Gjør bare undersøkelser', 'Åpen for en pilot / test', 'Ute etter en langsiktig løsning', ''];
  const allowedProcess = ['Vi svarer raskt mesteparten av tiden', 'Vi svarer, men det er inkonsekvent', 'Vi er ofte for trege med å svare', 'Vi har ikke en tydelig prosess', ''];
  const allowedDecision = ['Eier / gründer', 'Salgssjef', 'Markedsføringssjef', 'Annet', ''];

  if (!allowedLeads.includes(leadsPerMonth || '')) return res.status(400).json({ error: 'Ugyldig verdi.' });
  if (!allowedValues.includes(customerValue || '')) return res.status(400).json({ error: 'Ugyldig verdi.' });
  if (!allowedIntent.includes(intent || '')) return res.status(400).json({ error: 'Ugyldig verdi.' });
  if (!allowedProcess.includes(followUpProcess || '')) return res.status(400).json({ error: 'Ugyldig verdi.' });
  if (!allowedDecision.includes(decisionMaker || '')) return res.status(400).json({ error: 'Ugyldig verdi.' });

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

  const normalizedPhone = normalizePhone(phone);

  // Normalize website URL
  function normalizeWebsite(raw) {
    if (!raw) return '';
    let url = raw.trim();
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    return url;
  }

  const normalizedWebsite = normalizeWebsite(website);

  // Lead scoring based on form answers
  const volumeScores = { '0–10': 1, '10–30': 2, '30–75': 3, '75+': 4 };
  const valueScores = {
    'Under 5 000 NOK': 1,
    '5 000–15 000 NOK': 2,
    '15 000–50 000 NOK': 3,
    '50 000+ NOK': 4,
  };
  const intentScores = {
    'Gjør bare undersøkelser': 1,
    'Åpen for en pilot / test': 3,
    'Ute etter en langsiktig løsning': 4,
  };
  const processScores = {
    'Vi svarer raskt mesteparten av tiden': 1,
    'Vi svarer, men det er inkonsekvent': 2,
    'Vi er ofte for trege med å svare': 3,
    'Vi har ikke en tydelig prosess': 4,
  };

  const score =
    (volumeScores[leadsPerMonth] || 0) +
    (valueScores[customerValue] || 0) +
    (intentScores[intent] || 0) +
    (processScores[followUpProcess] || 0);

  let priority;
  if (score >= 12) priority = '🔴 Hot';
  else if (score >= 8) priority = '🟠 Warm';
  else priority = '🔵 Cold';

  // Look up Monstr AS in Aktive Bedrifter to link SMS Logg entries
  let monstrRecordId = null;
  try {
    const formula = encodeURIComponent(`{Client ID} = "monstr-as"`);
    const lookupRes = await fetch(
      `https://api.airtable.com/v0/${SMS_BASE_ID}/${COMPANIES_TABLE_ID}?filterByFormula=${formula}&maxRecords=1`,
      { headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` } }
    );
    if (lookupRes.ok) {
      const data = await lookupRes.json();
      if (data.records?.length > 0) {
        monstrRecordId = data.records[0].id;
      }
    }
  } catch (err) {
    console.error('Monstr lookup error:', err);
  }

  // 1. Save to SMS Logg (Airtable)
  const extraData = {
    Selskap: company,
    Nettside: normalizedWebsite,
    'Leads per måned': leadsPerMonth || '',
    Leadkilder: Array.isArray(leadSources) ? leadSources.join(', ') : '',
    Oppfølgingsprosess: followUpProcess || '',
    Kundeverdi: customerValue || '',
    Intensjon: intent || '',
    Beslutningstaker: decisionMaker || '',
    Score: score,
    Prioritet: priority,
  };

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${SMS_BASE_ID}/${SMS_LOG_TABLE_ID}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            Mottaker: `${firstName} ${lastName || ''}`.trim(),
            Fornavn: firstName,
            Etternavn: lastName || '',
            Telefon: normalizedPhone,
            'E-post': email,
            Sendt: new Date().toISOString(),
            Status: 'Sendt',
            Kilde: 'monstr.no',
            'Ekstra data': JSON.stringify(extraData, null, 2),
            ...(monstrRecordId ? { Bedrift: [monstrRecordId] } : {}),
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Airtable error:', error);
      return res.status(500).json({ error: 'Kunne ikke lagre forespørselen.' });
    }
    console.log('SMS Logg: saved OK');
  } catch (err) {
    console.error('Airtable submit error:', err);
    return res.status(500).json({ error: 'Noe gikk galt. Prøv igjen.' });
  }

  // 2. Send SMS + Push notification in parallel, BEFORE responding
  const promises = [];

  if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && normalizedPhone) {
    let smsBody;
    if (score >= 8) {
      smsBody = `Hei ${firstName}! Takk for at du fylte ut skjemaet hos Monstr. Basert på det du har delt, ser det ut som vi kan hjelpe deg med å svare raskere på leads og konvertere flere av dem. Vi ringer deg i løpet av kort tid for å finne en tid som passer for en rask prat.`;
    } else {
      smsBody = `Hei ${firstName}! Takk for interessen for Monstr. Vi har mottatt forespørselen din og skal se nærmere på den. Vi tar kontakt dersom vi tror speed-to-lead kan skape verdi for deg.`;
    }

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const twilioAuth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');

    promises.push(
      fetch(twilioUrl, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${twilioAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: 'Monstr',
          To: normalizedPhone,
          Body: smsBody,
        }),
      })
        .then(r => r.json())
        .then(d => console.log('Twilio response:', d.sid || d.message || d))
        .catch(err => console.error('Twilio error:', err))
    );
  }

  // Telegram notification
  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    const telegramMsg = [
      `${priority} Nytt lead!`,
      '',
      `Navn: ${firstName} ${lastName || ''}`.trim(),
      `Selskap: ${company}`,
      `Verdi: ${customerValue || 'Ukjent'}`,
      `Leads/mnd: ${leadsPerMonth || '?'}`,
      `E-post: ${email}`,
      `Telefon: ${normalizedPhone || 'Ingen'}`,
    ].join('\n');

    promises.push(
      fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramMsg,
        }),
      })
        .then(r => r.json())
        .then(d => console.log('Telegram response:', d.ok ? 'sent' : d))
        .catch(err => console.error('Telegram error:', err))
    );
  }

  // Wait for all notifications to complete before responding
  await Promise.allSettled(promises);

  return res.status(200).json({ success: true });
}
