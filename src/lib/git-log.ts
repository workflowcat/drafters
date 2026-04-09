/**
 * Read git history at build time for the changelog page.
 * Uses child_process.execSync — runs only in the build environment.
 */
import { execSync } from 'node:child_process';

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
  try {
    const format = '%H%x1f%h%x1f%ai%x1f%an%x1f%s%x1f%b%x1e';
    const cmd = `git log --pretty=format:'${format}' --name-only -n ${limit}`;
    const out = execSync(cmd, { encoding: 'utf8', cwd: process.cwd() });
    const commits: Commit[] = [];
    for (const raw of out.split('\x1e')) {
      if (!raw.trim()) continue;
      const [meta, ...fileLines] = raw.split('\n');
      const parts = meta.split('\x1f');
      if (parts.length < 6) continue;
      const [hash, shortHash, date, author, subject, body] = parts;
      const files = fileLines.map((l) => l.trim()).filter(Boolean);
      commits.push({
        hash,
        shortHash,
        date: date.slice(0, 10),
        author,
        subject,
        body: body || '',
        files,
      });
    }
    return commits;
  } catch (e) {
    console.warn('git log failed:', e);
    return [];
  }
}

export function affectedContent(files: string[]): string[] {
  return files
    .filter((f) => f.startsWith('src/content/') && (f.endsWith('.mdx') || f.endsWith('.md')))
    .map((f) => f.replace(/^src\/content\//, '').replace(/\.mdx?$/, ''));
}
