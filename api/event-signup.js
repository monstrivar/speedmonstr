export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    AIRTABLE_TOKEN,
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
  } = process.env;

  if (!AIRTABLE_TOKEN) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const { firstName, lastName, email, phone, role, interests, source } = req.body;

  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: 'Fornavn, etternavn og e-post er påkrevd.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Ugyldig e-postadresse.' });
  }

  // Normalize phone number
  function normalizePhone(raw) {
    if (!raw) return '';
    let cleaned = raw.replace(/[\s\-()]/g, '');
    if (cleaned.startsWith('00')) cleaned = '+' + cleaned.slice(2);
    if (cleaned.startsWith('47') && !cleaned.startsWith('+')) cleaned = '+' + cleaned;
    if (/^\d{8}$/.test(cleaned)) cleaned = '+47' + cleaned;
    return cleaned;
  }

  const normalizedPhone = normalizePhone(phone);

  const BASE_ID = 'appM5wdT9AbJ1YRCy';
  const TABLE_ID = 'tblArPNUToBclL0ne';

  // 1. Save to Airtable
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            Fornavn: firstName,
            Etternavn: lastName,
            'E-post': email,
            Telefon: normalizedPhone || '',
            Rolle: role || '',
            ...(Array.isArray(interests) && interests.length > 0
              ? { Interesser: interests }
              : {}),
            Kilde: source || 'aiarendal-april-2026',
            Opprettet: new Date().toISOString(),
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Airtable error:', JSON.stringify(error));
      return res.status(500).json({ error: 'Kunne ikke lagre.', detail: error });
    }
  } catch (err) {
    console.error('Airtable error:', err);
    return res.status(500).json({ error: 'Noe gikk galt.' });
  }

  // 2. Send SMS if phone number provided
  if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && normalizedPhone) {
    try {
      const smsBody = buildSms(firstName, interests);
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
      const twilioAuth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');

      await fetch(twilioUrl, {
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
    } catch (err) {
      console.error('Twilio error:', err);
    }
  }

  return res.status(200).json({ success: true });
}

function buildSms(firstName, interests) {
  const items = Array.isArray(interests) ? interests : [];

  if (items.length === 0) {
    return `Hei ${firstName}!\nTakk igjen for deltakelsen på introkurset!\nJeg ønsker deg en strålende helg!\n\nMvh, Ivar\nMonstrAI`;
  }

  const formatted = formatList(items);

  if (items.length === 4) {
    return `Hei ${firstName}!\nTakk igjen for deltakelsen på introkurset!\nSer du er interessert i å snakke om mye! Vi tar snart kontakt for en prat.\n\nHa en fortsatt strålende helg videre!\n\nMvh, Ivar\nMonstrAI`;
  }

  if (items.length === 1) {
    return `Hei ${firstName}!\nTakk igjen for deltakelsen på introkurset!\nSer du er interessert i en samtale rundt ${formatted}, vi tar snart kontakt med deg om dette!\n\nHa en kjempefin dag videre, og god helg!\n\nMvh, Ivar\nMonstrAI`;
  }

  return `Hei ${firstName}!\nTakk igjen for deltakelsen på introkurset!\nSer du er interessert i en samtale rundt ${formatted}, vi tar snart kontakt om en samtale med deg rundt dette!\n\nHa en fortsatt strålende helg videre!\n\nMvh, Ivar\nMonstrAI`;
}

function formatList(items) {
  if (items.length === 1) return items[0].toLowerCase();
  const last = items[items.length - 1].toLowerCase();
  const rest = items.slice(0, -1).map(i => i.toLowerCase());
  return rest.join(', ') + ' og ' + last;
}
