// Nes-event signup handler.
// Writes email + optional consultation flag straight to Airtable (Monstr base, Nes table).

const AIRTABLE_BASE_ID = 'appM5wdT9AbJ1YRCy';
const AIRTABLE_TABLE_ID = 'tblowWaqwmXRLCP3u';
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!AIRTABLE_API_KEY) {
    console.error('AIRTABLE_API_KEY is not configured');
    return res.status(500).json({ error: 'Server misconfigured.' });
  }

  const { epost, gratis_konsultasjon } = req.body || {};

  if (!epost || !/^\S+@\S+\.\S+$/.test(epost)) {
    return res.status(400).json({ error: 'Gyldig e-post er påkrevd.' });
  }

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          records: [
            {
              fields: {
                'E-post': epost,
                'Gratis konsultasjon': Boolean(gratis_konsultasjon),
                Kilde: 'agentik.no/nes',
                Opprettet: new Date().toISOString(),
              },
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const body = await response.text();
      console.error(`Airtable ${response.status}:`, body);
      return res.status(500).json({ error: 'Kunne ikke lagre.' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Nes signup error:', error);
    return res.status(500).json({ error: 'Noe gikk galt.' });
  }
}
