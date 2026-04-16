/**
 * Shared helpers for collection index pages and listing UIs.
 */

export function pickTitle(title: unknown): string {
  if (typeof title === 'string') return title;
  if (title && typeof title === 'object') {
    const t = title as Record<string, string>;
    return t.uk || t.en || t.de || '';
  }
  return '';
}

export function pickShort(short: unknown): string {
  if (typeof short === 'string') return short;
  if (short && typeof short === 'object') {
    const s = short as Record<string, string>;
    return s.uk || s.en || s.de || '';
  }
  return '';
}

export const COLLECTION_LABELS: Record<string, { uk: string; en: string }> = {
  contracts: { uk: 'Контракти', en: 'Contracts' },
  clauses: { uk: 'Пункти', en: 'Clauses' },
  terms: { uk: 'Терміни', en: 'Terms' },
  cast: { uk: 'Персонажі', en: 'Cast' },
};

export const ROUTE_PREFIX: Record<string, string> = {
  contracts: '/contracts',
  clauses: '/clauses',
  terms: '/terms',
  cast: '/cast',
};
