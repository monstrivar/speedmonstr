// POST /api/agentik-slack/partner
// Slack slash command: /partner <slug> <message>
// Polishes the message with OpenAI and inserts it as a partner_activity entry.

import crypto from 'node:crypto';
import { getSupabase } from '../_lib/auth.js';

const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_PARTNER_MODEL || 'gpt-4o-mini';

const HELP_TEXT = `Bruk: \`/partner <slug> <melding>\`\n` +
  `Eksempel: \`/partner demo Workshop med ledergruppen i dag — fant 3 prosesser å automatisere\``;

const config = { api: { bodyParser: false } };
export { config };

async function readRawBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return Buffer.concat(chunks).toString('utf8');
}

function verifySlackSignature(rawBody, headers) {
  if (!SLACK_SIGNING_SECRET) return false;
  const ts = headers['x-slack-request-timestamp'];
  const sig = headers['x-slack-signature'];
  if (!ts || !sig || typeof sig !== 'string') return false;
  // Reject replays older than 5 min — guard against NaN timestamps slipping through.
  const tsNum = Number(ts);
  if (!Number.isFinite(tsNum) || Math.abs(Math.floor(Date.now() / 1000) - tsNum) > 300) return false;
  const base = `v0:${ts}:${rawBody}`;
  let computed;
  try {
    computed = 'v0=' + crypto.createHmac('sha256', SLACK_SIGNING_SECRET).update(base).digest('hex');
  } catch {
    return false;
  }
  if (computed.length !== sig.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(sig));
  } catch {
    return false;
  }
}

function parseFormUrl(s) {
  const out = {};
  for (const part of s.split('&')) {
    const [k, v = ''] = part.split('=');
    out[decodeURIComponent(k)] = decodeURIComponent(v.replace(/\+/g, ' '));
  }
  return out;
}

async function polishMessage(raw) {
  if (!OPENAI_API_KEY) return { tittel: raw.slice(0, 70), beskrivelse: raw.length > 70 ? raw : null, type: 'update' };
  // Slack retries after 3s — must respond well under that. Hard cap OpenAI at 2.2s.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2200);
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content: `Du er Agentik sin redaktør. Du får en kort, uformell beskrivelse av noe som har skjedd i en kundeleveranse, skrevet på norsk eller engelsk. Skriv det om til konsist, profesjonelt norsk som passer i en kundes statusfeed. Behold fakta, fjern slang, ikke finn på detaljer. Returner JSON: {"tittel": "kort imperativ overskrift, max 70 tegn", "beskrivelse": "1-2 setninger, max 200 tegn", "type": "update|meeting|milestone|task|delivery|discovery"}.`,
          },
          { role: 'user', content: raw },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.4,
      }),
    });
    if (!res.ok) throw new Error(`OpenAI ${res.status}`);
    const json = await res.json();
    const content = json.choices?.[0]?.message?.content;
    if (!content) throw new Error('no content');
    const parsed = JSON.parse(content);
    if (!parsed.tittel) throw new Error('missing tittel');
    return parsed;
  } catch (err) {
    console.warn('polishMessage failed:', err.message);
    // Fallback: use raw text as title
    return { tittel: raw.slice(0, 70), beskrivelse: raw.length > 70 ? raw : null, type: 'update' };
  } finally {
    clearTimeout(timer);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!SLACK_SIGNING_SECRET) {
    return res.status(500).json({ error: 'Server misconfigured (SLACK_SIGNING_SECRET)' });
  }

  const rawBody = await readRawBody(req);
  if (!verifySlackSignature(rawBody, req.headers)) {
    return res.status(401).send('Invalid signature');
  }

  const params = parseFormUrl(rawBody);
  const text = (params.text || '').trim();
  const userName = params.user_name || 'Slack';

  if (!text || text === 'help') {
    return res.status(200).json({ response_type: 'ephemeral', text: HELP_TEXT });
  }

  // Parse: first whitespace-separated token is slug, rest is the message
  const m = text.match(/^(\S+)\s+([\s\S]+)$/);
  if (!m) {
    return res.status(200).json({ response_type: 'ephemeral', text: HELP_TEXT });
  }
  const slug = m[1].toLowerCase();
  const message = m[2].trim();

  const supabase = getSupabase();
  const { data: partner, error: pErr } = await supabase
    .from('partners')
    .select('id, bedrift, slug')
    .eq('slug', slug)
    .single();
  if (pErr || !partner) {
    return res.status(200).json({
      response_type: 'ephemeral',
      text: `Fant ingen partner med slug \`${slug}\`. Sjekk listen i admin.`,
    });
  }

  const polished = await polishMessage(message);

  const { error: insertErr } = await supabase
    .from('partner_activity')
    .insert({
      partner_id: partner.id,
      type: polished.type || 'update',
      tittel: polished.tittel,
      beskrivelse: polished.beskrivelse || null,
      forfatter: userName,
      happened_at: new Date().toISOString(),
    });
  if (insertErr) {
    console.error('Slack /partner insert error:', insertErr);
    return res.status(200).json({ response_type: 'ephemeral', text: 'Klarte ikke lagre. Prøv igjen.' });
  }

  return res.status(200).json({
    response_type: 'in_channel',
    text: `:sparkles: *${partner.bedrift}* — lagt til i feeden`,
    attachments: [
      {
        color: '#4FC3B0',
        title: polished.tittel,
        text: polished.beskrivelse || '',
        footer: `agentik.no/partner/${partner.slug} · av ${userName}`,
      },
    ],
  });
}
