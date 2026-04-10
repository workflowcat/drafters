/**
 * File-level git history: commits that touched a specific content file,
 * with the diff between each pair of consecutive revisions.
 *
 * Runs at build time via child_process. Used by the diff surfaces on
 * clause/document pages and by the admin "pending review" view.
 *
 * Exported functions:
 *  - fileCommits(path)          — list commits that touched the file
 *  - fileDiff(path, from, to)   — unified diff between two revisions
 *  - fileAtRev(path, rev)       — file contents at a specific revision
 *  - touchedSinceDate(path, d)  — commits touching path after a date
 */
import { execSync } from 'node:child_process';

export interface FileCommit {
  hash: string;
  shortHash: string;
  date: string;      // YYYY-MM-DD
  author: string;
  subject: string;
}

export interface DiffHunk {
  header: string;    // @@ -1,5 +1,7 @@
  lines: Array<{
    kind: 'ctx' | 'add' | 'del';
    text: string;
  }>;
}

export interface FileDiff {
  from: string;
  to: string;
  hunks: DiffHunk[];
  added: number;
  removed: number;
}

function run(cmd: string): string {
  try {
    return execSync(cmd, {
      encoding: 'utf8',
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'ignore'],
      maxBuffer: 10 * 1024 * 1024,
    });
  } catch {
    return '';
  }
}

/**
 * List commits that touched a specific file, most recent first.
 * `limit` caps the result. Pass a relative path from repo root.
 */
export function fileCommits(path: string, limit = 20): FileCommit[] {
  if (!path) return [];
  const fmt = '%H%x1f%h%x1f%ai%x1f%an%x1f%s%x1e';
  const out = run(
    `git log --follow --pretty=format:'${fmt}' -n ${limit} -- '${path}'`
  );
  if (!out) return [];
  const rows: FileCommit[] = [];
  for (const raw of out.split('\x1e')) {
    const t = raw.trim();
    if (!t) continue;
    const [hash, shortHash, date, author, subject] = t.split('\x1f');
    if (!hash) continue;
    rows.push({
      hash,
      shortHash,
      date: (date || '').slice(0, 10),
      author,
      subject,
    });
  }
  return rows;
}

/**
 * Return the content of a file at a given revision. Used when
 * rendering a historical snapshot of a clause or document.
 */
export function fileAtRev(path: string, rev: string): string {
  if (!path || !rev) return '';
  return run(`git show '${rev}:${path}'`);
}

/**
 * Parse `git diff --unified=2` output into a structured set of hunks.
 * We keep it narrow: single file, no rename detection, no binary.
 */
function parseUnifiedDiff(raw: string): { hunks: DiffHunk[]; added: number; removed: number } {
  const hunks: DiffHunk[] = [];
  let added = 0;
  let removed = 0;
  let current: DiffHunk | null = null;
  for (const line of raw.split('\n')) {
    if (line.startsWith('@@')) {
      if (current) hunks.push(current);
      current = { header: line, lines: [] };
      continue;
    }
    if (!current) continue;
    if (line.startsWith('+++') || line.startsWith('---')) continue;
    if (line.startsWith('+')) {
      current.lines.push({ kind: 'add', text: line.slice(1) });
      added++;
    } else if (line.startsWith('-')) {
      current.lines.push({ kind: 'del', text: line.slice(1) });
      removed++;
    } else if (line.startsWith(' ')) {
      current.lines.push({ kind: 'ctx', text: line.slice(1) });
    }
  }
  if (current) hunks.push(current);
  return { hunks, added, removed };
}

/**
 * Unified diff between two revisions of a file. `from` may be an
 * earlier commit hash, `to` defaults to HEAD. Returns a parsed
 * hunk list plus the added/removed line counts.
 */
export function fileDiff(
  path: string,
  from: string,
  to = 'HEAD'
): FileDiff {
  if (!path || !from) {
    return { from, to, hunks: [], added: 0, removed: 0 };
  }
  const raw = run(
    `git diff --unified=2 ${from} ${to} -- '${path}'`
  );
  const { hunks, added, removed } = parseUnifiedDiff(raw);
  return { from, to, hunks, added, removed };
}

/**
 * Commits touching `path` after `sinceISO` (YYYY-MM-DD). Used by
 * the admin "pending review" surface: any content file touched
 * after its reviewedOn date is pending.
 */
export function touchedSinceDate(path: string, sinceISO: string): FileCommit[] {
  if (!path || !sinceISO) return [];
  const fmt = '%H%x1f%h%x1f%ai%x1f%an%x1f%s%x1e';
  const out = run(
    `git log --follow --pretty=format:'${fmt}' --since='${sinceISO}' -- '${path}'`
  );
  if (!out) return [];
  const rows: FileCommit[] = [];
  for (const raw of out.split('\x1e')) {
    const t = raw.trim();
    if (!t) continue;
    const [hash, shortHash, date, author, subject] = t.split('\x1f');
    if (!hash) continue;
    rows.push({
      hash,
      shortHash,
      date: (date || '').slice(0, 10),
      author,
      subject,
    });
  }
  return rows;
}

/**
 * Given a content collection + id, guess the repo-relative path.
 * Works for .mdx files under src/content/<col>/<id>.mdx. For clause
 * variants the caller passes id like `payment-dispute.uk`.
 */
export function contentPath(collection: string, id: string): string {
  return `src/content/${collection}/${id}.mdx`;
}
