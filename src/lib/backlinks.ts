/**
 * Build-time backlinks index.
 *
 * Scans content collections and collects references from both:
 *   1. Frontmatter fields (composedOf, related, ...)
 *   2. Wikilinks inside MDX bodies ([[Target]], [[Target|Display]])
 *
 * Returns a Map keyed by `${collection}/${id}` → array of references.
 * Cached for the duration of the build.
 */

import { getCollection } from 'astro:content';

type Ref = {
  collection: string;
  id: string;
  title: string;
  route: string;
};

type BacklinkMap = Map<string, Ref[]>;

const WIKILINK_RE = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;

const ROUTE_PREFIX: Record<string, string> = {
  terms: '/terms',
  clauses: '/clauses',
  cast: '/cast',
  contracts: '/contracts',
};

function pickTitle(title: unknown): string {
  if (typeof title === 'string') return title;
  if (title && typeof title === 'object') {
    const t = title as Record<string, string>;
    return t.uk || t.en || t.de || '';
  }
  return '';
}

let _cache: BacklinkMap | null = null;

export async function buildBacklinks(): Promise<BacklinkMap> {
  if (_cache) return _cache;
  const map: BacklinkMap = new Map();

  const safeGet = async (name: Parameters<typeof getCollection>[0]) => {
    try {
      return await getCollection(name);
    } catch {
      return [];
    }
  };

  const [terms, clauses, cast, contracts] = await Promise.all([
    safeGet('terms'),
    safeGet('clauses'),
    safeGet('cast' as any),
    safeGet('contracts' as any),
  ]);

  const all: Array<{ collection: string; entry: any }> = [
    ...terms.map((e) => ({ collection: 'terms', entry: e })),
    ...clauses.map((e) => ({ collection: 'clauses', entry: e })),
    ...cast.map((e) => ({ collection: 'cast', entry: e })),
    ...contracts.map((e) => ({ collection: 'contracts', entry: e })),
  ];

  // Build a quick "title/id → {collection, id}" resolver.
  // Clauses and contracts collapse language variants to baseId.
  const resolver = new Map<string, { collection: string; id: string }>();
  for (const { collection, entry } of all) {
    const id =
      collection === 'clauses' || collection === 'contracts'
        ? entry.data.baseId || entry.data.id
        : entry.data.id;
    const title = pickTitle(entry.data.title);
    const aliases: string[] = entry.data.aliases || [];
    const keys = [id, entry.data.id, title, ...aliases].filter(Boolean);
    for (const k of keys) {
      resolver.set(String(k).toLowerCase(), { collection, id });
    }
  }

  const addRef = (targetKey: string, ref: Ref) => {
    const list = map.get(targetKey) || [];
    if (!list.some((r) => r.collection === ref.collection && r.id === ref.id)) {
      list.push(ref);
    }
    map.set(targetKey, list);
  };

  const asRef = (collection: string, entry: any): Ref => {
    const id =
      collection === 'clauses' || collection === 'contracts'
        ? entry.data.baseId || entry.data.id
        : entry.data.id;
    return {
      collection,
      id,
      title: pickTitle(entry.data.title) || id,
      route: `${ROUTE_PREFIX[collection] || '/' + collection}/${id}`,
    };
  };

  // Pass 1: frontmatter-declared references (contractor/counterparty on contracts)
  for (const { collection, entry } of all) {
    const ref = asRef(collection, entry);
    const d = entry.data;
    const declared: string[] = [];

    if (Array.isArray(d.composedOf)) declared.push(...d.composedOf.map((x: string) => `clauses/${x}`));
    if (Array.isArray(d.related)) declared.push(...d.related);
    if (collection === 'contracts') {
      if (d.contractor) declared.push(`cast/${d.contractor}`);
      if (d.counterparty) declared.push(`cast/${d.counterparty}`);
    }

    for (const dec of declared) {
      let key: string;
      if (dec.includes('/')) {
        key = dec.toLowerCase();
      } else {
        const found = resolver.get(dec.toLowerCase());
        if (found) key = `${found.collection}/${found.id}`;
        else continue;
      }
      addRef(key, ref);
    }
  }

  // Pass 2: wikilinks in MDX bodies
  for (const { collection, entry } of all) {
    const body: string = entry.body || '';
    if (!body.includes('[[')) continue;
    const ref = asRef(collection, entry);
    const seen = new Set<string>();
    let m;
    WIKILINK_RE.lastIndex = 0;
    while ((m = WIKILINK_RE.exec(body))) {
      const target = m[1].trim().toLowerCase();
      if (seen.has(target)) continue;
      seen.add(target);
      const found = resolver.get(target);
      if (!found) continue;
      const key = `${found.collection}/${found.id}`;
      addRef(key, ref);
    }
  }

  _cache = map;
  return map;
}

export async function getBacklinks(collection: string, id: string): Promise<Ref[]> {
  const map = await buildBacklinks();
  const key = `${collection}/${id}`;
  return (map.get(key) || []).filter((r) => !(r.collection === collection && r.id === id));
}
