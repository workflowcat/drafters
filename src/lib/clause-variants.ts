/**
 * Helpers for looking up clause language variants by baseId.
 *
 * The clauses collection has entries keyed by `{baseId}.{lang}`
 * with `baseId` and `lang` fields in frontmatter. Routes and the
 * <Clause> component work in terms of baseId, so we need a
 * resolver that takes baseId + preferred lang and returns the
 * best matching entry.
 */
import { getCollection } from 'astro:content';

export type ClauseEntry = Awaited<ReturnType<typeof getCollection<'clauses'>>>[number];

const FALLBACK_CHAIN: Record<string, string[]> = {
  uk: ['uk', 'en', 'de'],
  en: ['en', 'uk', 'de'],
  de: ['de', 'en', 'uk'],
};

let _allClauses: ClauseEntry[] | null = null;

async function getAllClauses(): Promise<ClauseEntry[]> {
  if (_allClauses) return _allClauses;
  _allClauses = await getCollection('clauses');
  return _allClauses;
}

/**
 * Return all entries sharing a baseId, one per language.
 */
export async function getClauseVariants(baseId: string): Promise<ClauseEntry[]> {
  const all = await getAllClauses();
  return all.filter((c) => (c.data.baseId || c.data.id) === baseId);
}

/**
 * Return the best matching entry for a baseId + desired lang,
 * falling back through the chain if the desired lang is missing.
 */
export async function getClauseByBase(
  baseId: string,
  desiredLang: string = 'uk'
): Promise<{ entry: ClauseEntry | null; lang: string | null; fallback: boolean }> {
  const variants = await getClauseVariants(baseId);
  if (variants.length === 0) return { entry: null, lang: null, fallback: false };

  const chain = FALLBACK_CHAIN[desiredLang] ?? ['uk', 'en', 'de'];
  for (const lang of chain) {
    const hit = variants.find((v) => v.data.lang === lang);
    if (hit) return { entry: hit, lang, fallback: lang !== desiredLang };
  }
  // Fallback: first available
  return { entry: variants[0], lang: variants[0].data.lang ?? null, fallback: true };
}

/**
 * Enumerate all unique baseIds and their available languages.
 * Used by the clauses index page and the route generator.
 */
export async function listClauseBases(): Promise<
  Array<{ baseId: string; languages: string[]; preferred: ClauseEntry }>
> {
  const all = await getAllClauses();
  const map = new Map<string, ClauseEntry[]>();
  for (const c of all) {
    const key = c.data.baseId || c.data.id;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(c);
  }
  return [...map.entries()].map(([baseId, entries]) => {
    const languages = entries.map((e) => e.data.lang ?? 'uk');
    // Prefer UA, then EN, then first
    const preferred =
      entries.find((e) => e.data.lang === 'uk') ??
      entries.find((e) => e.data.lang === 'en') ??
      entries[0];
    return { baseId, languages, preferred };
  });
}
