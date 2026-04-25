// Ingests Agentik knowledge base sources into Supabase pgvector.
//
// Reads markdown files from docs/agentik/ and extracts visible text from the
// legal JSX pages. Chunks each source, generates embeddings with OpenAI, and
// upserts into the `documents` table in the Agentik Supabase project.
//
// Usage:
//   SUPABASE_URL=... SUPABASE_KEY=... OPENAI_API_KEY=... \
//     node scripts/ingest-kb.mjs
//
// Or with .env (dotenv loads it automatically):
//   node scripts/ingest-kb.mjs
//
// SUPABASE_KEY accepts either a service_role key or an anon key (works as long
// as the documents table has RLS disabled, which is the default).

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !OPENAI_API_KEY) {
  console.error('Missing required env vars. Set SUPABASE_URL, SUPABASE_KEY, and OPENAI_API_KEY.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const EMBEDDING_MODEL = 'text-embedding-3-small'; // 1536 dims, matches our vector column

// Knowledge base sources.
// `kind` appears in metadata so the agent (or a filter) can scope retrieval.
const SOURCES = [
  { path: 'docs/agentik/HVA-ER-AGENTIK.md', kind: 'product',  title: 'Hva er Agentik' },
  { path: 'docs/agentik/TJENESTER.md',      kind: 'product',  title: 'Tjenester' },
  { path: 'docs/agentik/MALGRUPPE.md',      kind: 'audience', title: 'Målgruppe' },
  { path: 'src/pages/Personvern.jsx',       kind: 'legal',    title: 'Personvernerklæring', transform: 'jsx' },
  { path: 'src/pages/Vilkar.jsx',           kind: 'legal',    title: 'Brukervilkår',        transform: 'jsx' },
];

// Extract visible text from a JSX file by stripping imports, JS expressions,
// tags, and collapsing whitespace. Pragmatic, not bulletproof — works for the
// two legal pages we ingest.
function extractJsxText(src) {
  let s = src;
  s = s.replace(/^\s*import .+?;$/gm, '');
  s = s.replace(/^\s*export default .+?;?$/gm, '');
  // Remove JSX expressions like {t('foo')} but preserve text nodes
  s = s.replace(/\{[^{}]*\}/g, '');
  // Strip tags
  s = s.replace(/<[^>]+>/g, '\n');
  // Decode common HTML entities
  s = s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  // Collapse whitespace but keep paragraph breaks
  s = s.replace(/[ \t]+/g, ' ').replace(/\n\s*\n\s*\n+/g, '\n\n').trim();
  return s;
}

// Chunk markdown-ish text into ~1500-char pieces, preferring paragraph
// boundaries. Keeps headings with their following paragraph.
function chunkText(text, { targetSize = 1500, overlap = 150 } = {}) {
  const paragraphs = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const chunks = [];
  let current = '';

  for (const para of paragraphs) {
    if ((current + '\n\n' + para).length > targetSize && current) {
      chunks.push(current.trim());
      const tail = current.slice(-overlap);
      current = tail + '\n\n' + para;
    } else {
      current = current ? current + '\n\n' + para : para;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

async function embed(text) {
  const res = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });
  return res.data[0].embedding;
}

async function ingestSource({ path: relPath, kind, title, transform }) {
  const absPath = path.join(repoRoot, relPath);
  let raw;
  try {
    raw = await fs.readFile(absPath, 'utf8');
  } catch (err) {
    console.error(`  ✗ Cannot read ${relPath}: ${err.message}`);
    return { ok: false, count: 0 };
  }

  const text = transform === 'jsx' ? extractJsxText(raw) : raw;
  const chunks = chunkText(text);

  console.log(`\n→ ${relPath}  (${chunks.length} chunks)`);

  // Remove existing rows for this source so re-ingestion is idempotent
  const { error: deleteError } = await supabase.from('documents').delete().eq('source', relPath);
  if (deleteError) {
    console.error(`  ✗ Delete failed: ${deleteError.message}`);
    return { ok: false, count: 0 };
  }

  const rows = [];
  for (const [i, chunk] of chunks.entries()) {
    const embedding = await embed(chunk);
    rows.push({
      source: relPath,
      title,
      content: chunk,
      metadata: { kind, chunk_index: i, chunk_total: chunks.length },
      embedding,
    });
    process.stdout.write(`  ✓ chunk ${i + 1}/${chunks.length}\r`);
  }

  const { error: insertError } = await supabase.from('documents').insert(rows);
  if (insertError) {
    console.error(`\n  ✗ Insert failed: ${insertError.message}`);
    return { ok: false, count: 0 };
  }

  console.log(`  ✓ ingested ${chunks.length} chunks`);
  return { ok: true, count: chunks.length };
}

async function main() {
  console.log('Agentik KB ingestion');
  console.log('Target:', SUPABASE_URL);

  let total = 0;
  for (const source of SOURCES) {
    const { count } = await ingestSource(source);
    total += count;
  }

  const { count: actualCount } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true });

  console.log(`\nDone. ${total} chunks ingested this run. ${actualCount} rows total in documents.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
