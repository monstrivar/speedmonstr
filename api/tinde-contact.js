export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fornavn, bedrift, telefon, epost, maal } = req.body;

  if (!fornavn || !bedrift || !epost) {
    return res.status(400).json({ error: 'Fornavn, bedrift og epost er påkrevd.' });
  }

  const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE_ID = process.env.AIRTABLE_BASE_ID;
  const TABLE_ID = 'tblMvKrRdURSlxizj';

  try {
    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              Fornavn: fornavn,
              Bedrift: bedrift,
              Telefon: telefon || '',
              Epost: epost,
              'Mål med henvendelsen': maal || '',
              Kilde: 'tinde.ai',
              Opprettet: new Date().toISOString(),
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Airtable error:', err);
      return res.status(500).json({ error: 'Kunne ikke lagre henvendelsen.' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Noe gikk galt.' });
  }
}
