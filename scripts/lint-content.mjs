#!/usr/bin/env node
/**
 * Content linter: catches broken wikilinks, orphan clauses, missing
 * reviewers, and other health issues. Runs without Astro.
 *
 * Exit code:
 *   0 = clean
 *   1 = warnings (broken links, orphans, etc.)
 *   2 = errors (missing required fields)
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const CONTENT = join(ROOT, 'src/content');

function walk(dir) {
  const out = [];
  let items;
  try { items = readdirSync(dir); } catch { return out; }
  for (const name of items) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (/\.mdx?$/.test(name)) out.push(full);
  }
  return out;
}

function parseFrontmatter(src) {
  return matter(src).data;
}

function bodyText(src) {
  return matter(src).content;
}

// Scan everything
const collections = ['terms', 'clauses', 'documents', 'roles', 'workflows', 'cases', 'contracts', 'cast'];
const entries = [];
for (const col of collections) {
  for (const file of walk(join(CONTENT, col))) {
    const src = readFileSync(file, 'utf8');
    const fm = parseFrontmatter(src);
    if (!fm || !fm.id) continue;
    entries.push({
      file,
      collection: col,
      id: fm.id,
      baseId: fm.baseId || fm.id,
      fm,
      body: bodyText(src),
    });
  }
}

// Build resolver
const resolver = new Map();
for (const e of entries) {
  const keys = [
    e.collection === 'clauses' || e.collection === 'contracts' ? e.baseId : e.id,
  ];
  if (fmTitles(e.fm).length) keys.push(...fmTitles(e.fm));
  if (Array.isArray(e.fm.aliases)) keys.push(...e.fm.aliases);
  for (const k of keys) if (k) resolver.set(String(k).toLowerCase(), e);
}
function fmTitles(fm) {
  const out = [];
  if (typeof fm.title === 'string') out.push(fm.title);
  else if (fm.title && typeof fm.title === 'object') {
    for (const v of Object.values(fm.title)) if (v) out.push(v);
  }
  return out;
}

let warnings = 0;
let errors = 0;
const WIKILINK = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;

// Check broken wikilinks
for (const e of entries) {
  const seen = new Set();
  let m;
  WIKILINK.lastIndex = 0;
  while ((m = WIKILINK.exec(e.body))) {
    const target = m[1].trim();
    if (seen.has(target.toLowerCase())) continue;
    seen.add(target.toLowerCase());
    // Accept "collection/id" form
    if (target.includes('/')) {
      const [col, id] = target.split('/', 2);
      if (entries.some((x) => x.collection === col && (x.id === id || x.baseId === id))) continue;
    }
    if (!resolver.get(target.toLowerCase())) {
      console.log(`[BROKEN]  ${e.collection}/${e.id}: [[${target}]]`);
      warnings++;
    }
  }
}

// Orphan clauses — clauses with zero inbound references
const inboundCount = new Map();
for (const e of entries) {
  // Frontmatter references
  if (Array.isArray(e.fm.composedOf)) {
    for (const c of e.fm.composedOf) {
      inboundCount.set(`clauses/${c}`, (inboundCount.get(`clauses/${c}`) || 0) + 1);
    }
  }
  // Body wikilinks
  WIKILINK.lastIndex = 0;
  let m;
  while ((m = WIKILINK.exec(e.body))) {
    const target = m[1].trim().toLowerCase();
    const hit = resolver.get(target);
    if (hit) {
      const key = `${hit.collection}/${hit.baseId || hit.id}`;
      inboundCount.set(key, (inboundCount.get(key) || 0) + 1);
    }
  }
}
const seenBases = new Set();
for (const e of entries) {
  if (e.collection !== 'clauses') continue;
  if (seenBases.has(e.baseId)) continue;
  seenBases.add(e.baseId);
  const key = `clauses/${e.baseId}`;
  if (!inboundCount.get(key)) {
    console.log(`[ORPHAN]  ${e.baseId} has zero inbound references`);
    warnings++;
  }
}

// Missing required fields
for (const e of entries) {
  if (e.collection === 'workflows' || e.collection === 'documents') {
    if (!e.fm.updated) {
      console.log(`[META]    ${e.collection}/${e.id} missing 'updated' timestamp`);
      warnings++;
    }
  }
}

// Contracts completeness: check that every active commercial contract
// has the essential "protection quartet". NDAs and SLAs are subordinate
// documents and have their own protection patterns, so skip them.
const ESSENTIAL = ['dispute-resolution-uk', 'liability-limitation-mutual', 'effect-of-termination'];
const SKIP_IDS = new Set(['nda-general', 'sla-template', 'data-processing-agreement-2026', 'statement-of-work-2026']);
for (const e of entries) {
  if (e.collection !== 'documents') continue;
  if (e.fm.type !== 'contract') continue;
  if (e.fm.status !== 'active') continue;
  if (SKIP_IDS.has(e.id)) continue;
  const composedRaw = e.fm.composedOf;
  const composed = Array.isArray(composedRaw) ? composedRaw : [];
  const missing = ESSENTIAL.filter((c) => !composed.includes(c));
  if (missing.length > 0) {
    console.log(`[AUDIT]   ${e.id} missing essential clauses: ${missing.join(', ')}`);
    warnings++;
  }
}

// Expired reviews
const now = new Date();
for (const e of entries) {
  if (e.fm.reviewExpires) {
    const d = new Date(e.fm.reviewExpires);
    if (!isNaN(+d) && d < now) {
      console.log(`[EXPIRED] ${e.collection}/${e.id} review expired ${e.fm.reviewExpires}`);
      warnings++;
    }
  }
}

console.log(
  `\n${entries.length} entries scanned · ${warnings} warnings · ${errors} errors`
);
process.exit(errors > 0 ? 2 : warnings > 0 ? 1 : 0);
