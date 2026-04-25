// Contact form handler for Agentik landing page.
// During migration: forwards to BOTH Make.com and the new N8N workflow
// in parallel. Once N8N is verified stable, the Make.com fork is removed.

const MAKE_WEBHOOK_URL =
  process.env.MAKE_WEBHOOK_URL ||
  'https://hook.eu2.make.com/iedbsay1cbv8urvn2xtmc8k14ejsu028';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fornavn, bedrift, telefon, epost, maal } = req.body || {};

  if (!fornavn || !bedrift || !epost) {
    return res.status(400).json({ error: 'Fornavn, bedrift og epost er påkrevd.' });
  }

  const payload = {
    fornavn,
    bedrift,
    telefon: telefon || '',
    epost,
    maal: maal || '',
    kilde: 'agentik.no',
    opprettet: new Date().toISOString(),
  };

  const targets = [
    { name: 'make', url: MAKE_WEBHOOK_URL },
    N8N_WEBHOOK_URL ? { name: 'n8n', url: N8N_WEBHOOK_URL } : null,
  ].filter(Boolean);

  const results = await Promise.allSettled(
    targets.map((t) =>
      fetch(t.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then(async (response) => {
        if (!response.ok) {
          const body = await response.text();
          throw new Error(`${t.name} ${response.status}: ${body}`);
        }
        return t.name;
      })
    )
  );

  const failures = results.filter((r) => r.status === 'rejected');
  const successes = results.filter((r) => r.status === 'fulfilled');

  if (successes.length === 0) {
    failures.forEach((f) => console.error('Webhook failure:', f.reason));
    return res.status(500).json({ error: 'Kunne ikke lagre henvendelsen.' });
  }

  if (failures.length > 0) {
    failures.forEach((f) => console.error('Partial webhook failure:', f.reason));
  }

  return res.status(200).json({ success: true });
}
