// Contact form handler for Agentik landing page.
// Forwards every submission to a N8N webhook ("AI Form Lead Handler"),
// which creates Attio records, sends an auto-reply, and notifies Slack.

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!N8N_WEBHOOK_URL) {
    console.error('N8N_WEBHOOK_URL is not configured');
    return res.status(500).json({ error: 'Server misconfigured.' });
  }

  const { fornavn, bedrift, telefon, epost, maal } = req.body || {};

  if (!fornavn || !bedrift || !epost) {
    return res.status(400).json({ error: 'Fornavn, bedrift og epost er påkrevd.' });
  }

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
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
      console.error(`N8N webhook ${response.status}:`, body);
      return res.status(500).json({ error: 'Kunne ikke lagre henvendelsen.' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Noe gikk galt.' });
  }
}
