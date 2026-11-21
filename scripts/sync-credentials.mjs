#!/usr/bin/env node
/**
 * Sync certificate PDFs from Reuben's drop folder into public/credentials/.
 *
 *   Drop folder (default): ~/Downloads/COURSERA CREDENTIALS
 *   Override with:         CREDENTIALS_DIR=/some/path npm run credentials:sync
 *
 * Rules:
 * - Only files listed in src/data/credentials.json are published (copied as <slug>.pdf).
 *   Anything else is reported as NEW and left alone, so nothing goes live without its
 *   title, issuer, date and verify link filled in from the certificate itself.
 * - The drop folder is never modified: files are copied, never moved or deleted.
 * - A missing drop folder is not an error (e.g. building on another machine).
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dropDir = process.env.CREDENTIALS_DIR || join(homedir(), 'Downloads', 'COURSERA CREDENTIALS');
const outDir = join(root, 'public', 'credentials');
const data = JSON.parse(readFileSync(join(root, 'src', 'data', 'credentials.json'), 'utf8'));
const bySource = new Map(data.credentials.map((c) => [c.source, c]));

if (!existsSync(dropDir)) {
  console.log(`[credentials] drop folder not found (${dropDir}); keeping the PDFs already in public/credentials.`);
  process.exit(0);
}

mkdirSync(outDir, { recursive: true });
const pdfs = readdirSync(dropDir).filter((f) => f.toLowerCase().endsWith('.pdf'));
let copied = 0;
const unknown = [];

for (const file of pdfs) {
  const entry = bySource.get(file);
  if (!entry) {
    unknown.push(file);
    continue;
  }
  const src = join(dropDir, file);
  const dest = join(outDir, `${entry.slug}.pdf`);
  const changed = !existsSync(dest) || statSync(dest).size !== statSync(src).size || statSync(src).mtimeMs > statSync(dest).mtimeMs;
  if (changed) {
    copyFileSync(src, dest);
    copied += 1;
  }
}

const missing = data.credentials.filter((c) => !pdfs.includes(c.source)).map((c) => c.source);
console.log(`[credentials] ${pdfs.length} PDF(s) in drop folder, ${copied} copied/updated, ${data.credentials.length} listed on the site.`);
if (missing.length) console.log(`[credentials] listed but not in drop folder (kept from last sync): ${missing.join(', ')}`);
if (unknown.length) {
  console.log('[credentials] NEW, not published yet (add details to src/data/credentials.json or ask the agent):');
  unknown.forEach((f) => console.log(`  - ${f}`));
}
