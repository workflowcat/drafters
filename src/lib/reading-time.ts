/**
 * Estimate reading time (in minutes) for a text body.
 * Ukrainian/English average reading speed ~200 wpm.
 */
export function readingMinutes(text: string): number {
  if (!text) return 0;
  // Strip frontmatter
  const body = text.replace(/^---\n[\s\S]*?\n---\n/, '');
  // Strip MDX components, tables, code fences
  const clean = body
    .replace(/<[^>]+>/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\|/g, ' ');
  const words = clean.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function readingTimeLabel(text: string, lang: 'uk' | 'en' = 'uk'): string {
  const mins = readingMinutes(text);
  if (lang === 'uk') {
    if (mins === 1) return '1 хв читання';
    if (mins < 5) return `${mins} хв читання`;
    return `~${mins} хв читання`;
  }
  if (mins === 1) return '1 min read';
  return `${mins} min read`;
}
