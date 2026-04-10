/**
 * Read git history at build time for the changelog page and home-page
 * weather report. Data source is a pre-generated JSON snapshot written
 * by scripts/build-git-log.mjs during prebuild.
 *
 * This used to shell out to `git log` inside Astro pages via execSync,
 * which fails on build platforms that don't expose a .git directory
 * at render time (e.g. Vercel). The JSON snapshot decouples the render
 * path from the presence of .git.
 */
import history from '../data/git-history.json';

export interface Commit {
  hash: string;
  shortHash: string;
  date: string;
  author: string;
  subject: string;
  body: string;
  files: string[];
}

export function readGitLog(limit = 50): Commit[] {
  return (history as Commit[]).slice(0, limit);
}

export function affectedContent(files: string[]): string[] {
  return files
    .filter((f) => f.startsWith('src/content/') && (f.endsWith('.mdx') || f.endsWith('.md')))
    .map((f) => f.replace(/^src\/content\//, '').replace(/\.mdx?$/, ''));
}
