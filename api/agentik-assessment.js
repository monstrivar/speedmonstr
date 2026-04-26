// Pre-assessment handler for Agentik /takk page.
// Forwards every submission to a separate N8N webhook ("AI Assessment Handler"),
// which finds the existing Attio person (created by /api/agentik-contact),
// appends the assessment as a structured note, and notifies Slack.

const N8N_ASSESSMENT_WEBHOOK_URL = process.env.N8N_ASSESSMENT_WEBHOOK_URL;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!N8N_ASSESSMENT_WEBHOOK_URL) {
    console.error('N8N_ASSESSMENT_WEBHOOK_URL is not configured');
    return res.status(500).json({ error: 'Server misconfigured.' });
  }

  const { fornavn, epost, bedrift, answers, submittedAt } = req.body || {};

  if (!epost || !answers || typeof answers !== 'object') {
    return res.status(400).json({ error: 'epost og answers er påkrevd.' });
  }

  try {
    const response = await fetch(N8N_ASSESSMENT_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fornavn: fornavn || '',
        epost,
        bedrift: bedrift || '',
        kilde: 'agentik.no/takk',
        submittedAt: submittedAt || new Date().toISOString(),
        answers,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`N8N assessment webhook ${response.status}:`, body);
      return res.status(500).json({ error: 'Kunne ikke lagre assessment.' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Assessment webhook error:', error);
    return res.status(500).json({ error: 'Noe gikk galt.' });
  }
}
