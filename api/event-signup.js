export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { AIRTABLE_TOKEN } = process.env;
  if (!AIRTABLE_TOKEN) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const { name, email, role, interests, source } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Navn og e-post er påkrevd.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Ugyldig e-postadresse.' });
  }

  const BASE_ID = 'appM5wdT9AbJ1YRCy';
  const TABLE_ID = 'tblArPNUToBclL0ne';

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
            Navn: name,
            'E-post': email,
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

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Event signup error:', err);
    return res.status(500).json({ error: 'Noe gikk galt.' });
  }
}
