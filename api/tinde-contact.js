// Contact form handler for /nyside (Agentik landing).
// Forwards every submission to a Make.com webhook, which routes the lead
// into Attio.

const MAKE_WEBHOOK_URL =
  process.env.MAKE_WEBHOOK_URL ||
  'https://hook.eu2.make.com/iedbsay1cbv8urvn2xtmc8k14ejsu028';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fornavn, bedrift, telefon, epost, maal } = req.body || {};

  if (!fornavn || !bedrift || !epost) {
    return res.status(400).json({ error: 'Fornavn, bedrift og epost er påkrevd.' });
  }

  try {
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fornavn,
        bedrift,
        telefon: telefon || '',
        epost,
        maal: maal || '',
        kilde: 'agentik.no',
        opprettet: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`Make webhook ${response.status}:`, body);
      return res.status(500).json({ error: 'Kunne ikke lagre henvendelsen.' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Noe gikk galt.' });
  }
}
