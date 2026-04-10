/**
 * Build-time content index.
 *
 * Scans src/content/ synchronously, parses frontmatter, and returns a
 * resolver for wikilink lookup. The index is keyed by:
 *   - id (primary)
 *   - lowercased title (any language)
 *   - lowercased alias
 *
 * This runs once per build inside the remark plugin, before content
 * collections are available. Keep it cheap and side-effect-free.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const CONTENT_ROOT = fileURLToPath(new URL('../content/', import.meta.url));

const COLLECTION_TYPES = [
  'terms',
  'clauses',
  'documents',
  'roles',
  'workflows',
  'cases',
  'cast',
];

const ROUTE_PREFIX = {
  terms: '/terms',
  clauses: '/clauses',
  documents: '/documents',
  roles: '/roles',
  workflows: '/workflows',
  cases: '/cases',
  cast: '/cast',
};

// Very small YAML frontmatter reader. We don't need full YAML — just strings,
// nested objects (one level), and string arrays. Keeps deps zero.
function parseFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const body = match[1];
  const result = {};
  const lines = body.split('\n');
  let currentKey = null;
  let currentObj = null;

  for (const rawLine of lines) {
    if (rawLine.trim() === '' || rawLine.trim().startsWith('#')) continue;
    const indentMatch = rawLine.match(/^(\s*)(.*)$/);
    const indent = indentMatch[1].length;
    const line = indentMatch[2];

    if (indent === 0) {
      currentObj = null;
      const kv = line.match(/^([\w-]+):\s*(.*)$/);
      if (!kv) continue;
      const [, key, rawValue] = kv;
      currentKey = key;

      if (rawValue === '' || rawValue === undefined) {
        // Object or array starts on next lines
        result[key] = {};
        currentObj = result[key];
        continue;
      }
      // Inline array: [a, b, c]
      if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
        result[key] = rawValue
          .slice(1, -1)
          .split(',')
          .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
          .filter(Boolean);
        continue;
      }
      result[key] = stripQuotes(rawValue);
    } else if (indent >= 2 && currentObj && typeof currentObj === 'object') {
      const kv = line.match(/^([\w-]+):\s*(.*)$/);
      if (!kv) continue;
      const [, key, rawValue] = kv;
      currentObj[key] = stripQuotes(rawValue);
    }
  }
  return result;
}

function stripQuotes(v) {
  if (typeof v !== 'string') return v;
  v = v.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  return v;
}

function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (/\.mdx?$/.test(name)) out.push(full);
  }
  return out;
}

let _cache = null;

export function buildIndex() {
  if (_cache) return _cache;
  const index = new Map();
  const entries = [];

  for (const collection of COLLECTION_TYPES) {
    const dir = join(CONTENT_ROOT, collection);
    const files = walk(dir);
    const seenBaseIds = new Set();
    for (const file of files) {
      const source = readFileSync(file, 'utf8');
      const fm = parseFrontmatter(source);
      if (!fm || !fm.id) continue;

      // For clauses, collapse language variants to their baseId
      let entryKey = fm.id;
      if (collection === 'clauses' && fm.baseId) {
        if (seenBaseIds.has(fm.baseId)) continue; // only first variant wins
        seenBaseIds.add(fm.baseId);
        entryKey = fm.baseId;
      }
      const route = `${ROUTE_PREFIX[collection]}/${entryKey}`;
      const id = entryKey;

      // Bilingual title handling
      const titles = [];
      if (typeof fm.title === 'string') titles.push(fm.title);
      else if (fm.title && typeof fm.title === 'object') {
        for (const v of Object.values(fm.title)) if (v) titles.push(v);
      }

      // Short definition for tooltips (terms + roles have these)
      const shorts = [];
      if (typeof fm.short === 'string') shorts.push(fm.short);
      else if (fm.short && typeof fm.short === 'object') {
        for (const v of Object.values(fm.short)) if (v) shorts.push(v);
      }

      const entry = {
        id,
        collection,
        route,
        titles,
        short: shorts[0] || null,
        aliases: Array.isArray(fm.aliases) ? fm.aliases : [],
      };
      entries.push(entry);

      // Index by id + titles + aliases (case-insensitive)
      const keys = new Set([id, ...titles, ...entry.aliases]);
      for (const k of keys) {
        if (!k) continue;
        index.set(k.toLowerCase(), entry);
      }
    }
  }

  _cache = { index, entries };
  return _cache;
}

export function resolve(target) {
  const { index, entries } = buildIndex();
  if (!target) return null;
  const key = target.trim().toLowerCase();

  // Support explicit "collection/id" form: e.g. [[roles/pm]]
  if (key.includes('/')) {
    const [collection, id] = key.split('/', 2);
    if (COLLECTION_TYPES.includes(collection) && id) {
      const hit = entries.find((e) => e.collection === collection && e.id === id);
      if (hit) return hit;
    }
  }
  return index.get(key) || null;
}
