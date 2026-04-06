export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    AIRTABLE_TOKEN,
    TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,
    TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID,
  } = process.env;

  // SMS base IDs — single source of truth, never changes
  const SMS_BASE_ID = 'apppLbO2YqIMYWh3X';
  const COMPANIES_TABLE_ID = 'tblfjGVLv2krsNwQk';
  const SMS_LOG_TABLE_ID = 'tblKQIg7SIGS91HAV';

  if (!AIRTABLE_TOKEN) {
    return res.status(500).json({ error: 'Server configuration error: missing AIRTABLE_TOKEN' });
  }

  const body = req.body || {};
  const clientId = req.query.client || body.client || '';
  const webhookKey = req.headers['x-api-key'] || req.query.key;

  if (!clientId) {
    return res.status(400).json({ error: 'Missing client parameter' });
  }

  if (!webhookKey) {
    return res.status(401).json({ error: 'Missing API key — use ?key= parameter or x-api-key header' });
  }

  // Known field names to extract — everything else goes to "extra data"
  const knownFields = new Set([
    'firstName', 'first_name', 'name', 'fornavn',
    'lastName', 'last_name', 'etternavn',
    'company', 'company_name', 'firma', 'selskap', 'bedrift',
    'email', 'e-post', 'epost',
    'phone', 'telefon', 'phone_number', 'mobil', 'telefonnummer',
    'website', 'nettside', 'url',
    'source', 'message', 'melding', 'beskjed',
    'client', 'address', 'adresse', 'service_type',
  ]);

  // Flexible field mapping - support common variations
  const firstName = body.firstName || body.first_name || body.name || body.fornavn || '';
  const lastName = body.lastName || body.last_name || body.etternavn || '';
  const company = body.company || body.company_name || body.firma || body.selskap || body.bedrift || '';
  const email = body.email || body['e-post'] || body.epost || '';
  const phone = body.phone || body.telefon || body.phone_number || body.mobil || body.telefonnummer || '';
  const website = body.website || body.nettside || body.url || '';
  const source = body.source || 'unknown';
  const message = body.message || body.melding || body.beskjed || '';

  // Capture any extra/unknown fields so no data is lost
  const extraData = {};
  for (const [key, value] of Object.entries(body)) {
    if (!knownFields.has(key) && value !== undefined && value !== '') {
      extraData[key] = value;
    }
  }

  // Validation
  if (!firstName || !email || !company) {
    return res.status(400).json({
      error: 'Missing required fields. Need at least: name/firstName, email, and company.',
      received_fields: Object.keys(body),
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
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

  const normalizedPhone = normalizePhone(phone);

  // Normalize website URL
  function normalizeWebsite(raw) {
    if (!raw) return '';
    let url = raw.trim();
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    return url;
  }

  const normalizedWebsite = normalizeWebsite(website);

  // Look up client config from Aktive Bedrifter table (SMS base)
  let clientConfig = null;
  if (clientId) {
    try {
      const formula = encodeURIComponent(`{Client ID} = "${clientId}"`);
      const lookupRes = await fetch(
        `https://api.airtable.com/v0/${SMS_BASE_ID}/${COMPANIES_TABLE_ID}?filterByFormula=${formula}&maxRecords=1`,
        { headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` } }
      );
      if (lookupRes.ok) {
        const data = await lookupRes.json();
        if (data.records && data.records.length > 0) {
          const rec = data.records[0];
          clientConfig = {
            recordId: rec.id,
            webhookKey: rec.fields['Webhook Key'] || '',
            // All Aktive Bedrifter fields — available as SMS template variables
            bedriftsnavn: rec.fields['Bedriftsnavn'] || '',
            kontaktperson: rec.fields['Kontaktperson'] || '',
            telefon: rec.fields['Telefon'] || '',
            epost: rec.fields['E-post'] || '',
            nettside: rec.fields['Nettside'] || '',
            bransje: rec.fields['Bransje'] || '',
            senderId: rec.fields['Sender ID'] || '',
            plan: rec.fields['Plan'] || '',
            smsTemplate: rec.fields['SMS Mal'] || '',
          };
        }
      }
    } catch (err) {
      console.error('Client lookup error:', err);
    }
  }

  // If client not found, reject
  if (!clientConfig) {
    return res.status(404).json({ error: `Client "${clientId}" not found. Webhook is inactive.` });
  }

  // Validate per-client webhook key
  if (!clientConfig.webhookKey || webhookKey !== clientConfig.webhookKey) {
    return res.status(401).json({ error: 'Unauthorized: invalid API key for this client' });
  }

  // Determine SMS sender and content
  const senderId = clientConfig?.senderId || 'Monstr';
  const businessName = clientConfig?.bedriftsnavn || company;

  // All template variables — lead fields + all Aktive Bedrifter fields
  const templateVars = {
    // Lead fields (from form submission)
    fornavn: firstName, first_name: firstName,
    etternavn: lastName, last_name: lastName,
    epost: email, email: email,
    telefon: normalizedPhone, phone: normalizedPhone,
    melding: message, message: message,
    selskap: company, company: company,
    nettside_lead: website,
    // Client/business fields (from Aktive Bedrifter)
    bedriftsnavn: businessName, business_name: businessName,
    kontaktperson: clientConfig?.kontaktperson || '', contact_person: clientConfig?.kontaktperson || '',
    kontakt_epost: clientConfig?.epost || '',
    kontakt_telefon: clientConfig?.telefon || '',
    kontakt_nettside: clientConfig?.nettside || '',
    bransje: clientConfig?.bransje || '',
    plan: clientConfig?.plan || '',
    sender_id: senderId,
  };

  let smsBody;
  if (clientConfig?.smsTemplate) {
    // Replace all {variable} placeholders with their values
    smsBody = clientConfig.smsTemplate.replace(/\{(\w+)\}/g, (match, key) => {
      return templateVars[key] !== undefined ? templateVars[key] : match;
    });
  } else {
    smsBody = `Hei, ${firstName}! Takk for forespørselen! Du hører fra oss veldig snart.\n\nMed vennlig hilsen,\n${templateVars.kontaktperson || businessName}`;
  }

  // Send SMS + notification + log to SMS Logg — all in parallel
  const promises = [];

  // SMS via Twilio
  let twilioSid = null;
  let smsStatus = 'Feilet';

  if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && normalizedPhone) {
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const twilioAuth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');

    try {
      const twilioRes = await fetch(twilioUrl, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${twilioAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: senderId,
          To: normalizedPhone,
          Body: smsBody,
        }),
      });
      const twilioData = await twilioRes.json();
      twilioSid = twilioData.sid || null;
      smsStatus = twilioData.sid ? 'Sendt' : 'Feilet';
      console.log('Twilio response:', twilioData.sid || twilioData.message || twilioData);
    } catch (err) {
      console.error('Twilio error:', err);
    }
  }

  // Notification SMS to business owner
  const notifyPhone = clientConfig?.telefon ? normalizePhone(clientConfig.telefon) : '';
  if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && notifyPhone) {
    const leadFields = [];
    if (firstName) leadFields.push(`Fornavn: ${firstName}`);
    if (lastName) leadFields.push(`Etternavn: ${lastName}`);
    if (company) leadFields.push(`Bedrift: ${company}`);
    if (normalizedPhone) leadFields.push(`Telefonnummer: ${phone}`);
    if (email) leadFields.push(`E-post: ${email}`);
    if (message) leadFields.push(`Beskjed: ${message}`);
    if (website) leadFields.push(`Nettside: ${website}`);
    for (const [key, value] of Object.entries(extraData)) {
      leadFields.push(`${key}: ${value}`);
    }

    const notifyBody = `Ny henvendelse i skjema!\n\n${leadFields.join('\n')}`;

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
          To: notifyPhone,
          Body: notifyBody,
        }),
      })
        .then(r => r.json())
        .then(d => console.log('Notification SMS:', d.sid ? 'sent' : d.message || d))
        .catch(err => console.error('Notification SMS error:', err))
    );
  }

  // Log to SMS Logg table (single source of truth for all leads)
  let leadId;
  const smsLogFields = {
    Mottaker: `${firstName} ${lastName}`.trim(),
    Fornavn: firstName,
    Etternavn: lastName,
    Telefon: normalizedPhone,
    'E-post': email,
    Melding: smsBody,
    Sendt: new Date().toISOString(),
    Status: smsStatus,
    Kilde: source,
  };
  if (twilioSid) smsLogFields['Twilio SID'] = twilioSid;
  if (clientConfig?.recordId) smsLogFields.Bedrift = [clientConfig.recordId];
  if (Object.keys(extraData).length > 0) {
    smsLogFields['Ekstra data'] = JSON.stringify(extraData, null, 2);
  }

  promises.push(
    fetch(
      `https://api.airtable.com/v0/${SMS_BASE_ID}/${SMS_LOG_TABLE_ID}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields: smsLogFields }),
      }
    )
      .then(r => r.json())
      .then(d => { leadId = d.id; console.log('SMS Logg: saved OK, id:', d.id || d.error); })
      .catch(err => console.error('SMS Logg error:', err))
  );

  // Telegram notification
  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    const telegramMsg = [
      `📩 Nytt lead${clientConfig ? ` — ${businessName}` : ''}!`,
      '',
      `Klient: ${clientId || 'ukjent'}`,
      `Kilde: ${source}`,
      `Navn: ${firstName} ${lastName}`.trim(),
      `Selskap: ${company}`,
      `E-post: ${email}`,
      `Telefon: ${normalizedPhone || 'Ingen'}`,
      `SMS: ${smsStatus === 'Sendt' ? '✅ Sendt' : '❌ Feilet'}`,
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

  // Wait for log + notification before responding
  await Promise.allSettled(promises);

  return res.status(200).json({ success: true, leadId, smsStatus, twilioSid });
}
