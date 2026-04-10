#!/usr/bin/env node
/**
 * Prebuild step: capture recent git history into a JSON snapshot
 * that the Astro site can import safely at render time.
 *
 * Why: readGitLog() used to shell out to `git log` inside .astro pages,
 * which fails on build platforms (Vercel) that check out code without
 * a .git directory. A committed JSON snapshot decouples the render
 * path from the presence of .git at build time.
 *
 * Parsing strategy (two passes — easier to get right than single-pass):
 *   Pass 1: `git log --pretty=format:...` with ASCII control chars as
 *           separators. Gives clean meta (hash, date, author, subject,
 *           body). Body may contain newlines but no \x1f / \x1e.
 *   Pass 2: `git log --format=%x00%H --name-only` — NUL-delimited blocks,
 *           each block starts with a hash then a newline-separated file
 *           list. Merge into the meta by hash.
 *
 * Behaviour when git is unavailable (e.g. Vercel's build container):
 *   - If a snapshot already exists → keep it (what the developer
 *     committed on their last local build).
 *   - If no snapshot exists → write [] so the JSON import doesn't blow up.
 */
import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, 'src/data');
const OUT_FILE = join(OUT_DIR, 'git-history.json');
const LIMIT = 100;

const FS = '\x1f'; // ASCII unit separator — field delimiter
const RS = '\x1e'; // ASCII record separator — commit delimiter

function readMeta(limit) {
  const format = `%H${FS}%h${FS}%ai${FS}%an${FS}%s${FS}%b`;
  const cmd = `git log --pretty=format:'${format}${RS}' -n ${limit}`;
  const out = execSync(cmd, {
    encoding: 'utf8',
    cwd: ROOT,
    stdio: ['pipe', 'pipe', 'pipe'],
    maxBuffer: 10 * 1024 * 1024,
  });
  const commits = [];
  for (const raw of out.split(RS)) {
    // Each chunk after the first starts with a '\n' that git log
    // inserts between commits — strip leading whitespace.
    const trimmed = raw.replace(/^[\r\n]+/, '');
    if (!trimmed.trim()) continue;
    const parts = trimmed.split(FS);
    if (parts.length < 6) continue;
    const [hash, shortHash, date, author, subject, body] = parts;
    commits.push({
      hash,
      shortHash,
      date: date.slice(0, 10),
      author,
      subject,
      body: (body || '').trim(),
      files: [],
    });
  }
  return commits;
}

function readFilesByHash(limit) {
  // %x00 = NUL — guaranteed absent from filenames and commit metadata.
  // Each block after splitting on NUL: HASH\n<file1>\n<file2>\n...
  const cmd = `git log --format='%x00%H' --name-only -n ${limit}`;
  const out = execSync(cmd, {
    encoding: 'utf8',
    cwd: ROOT,
    stdio: ['pipe', 'pipe', 'pipe'],
    maxBuffer: 10 * 1024 * 1024,
  });
  const byHash = new Map();
  for (const block of out.split('\x00')) {
    if (!block.trim()) continue;
    const lines = block.split('\n');
    const hash = lines[0].trim();
    if (!hash) continue;
    const files = lines
      .slice(1)
      .map((l) => l.trim())
      .filter(Boolean);
    byHash.set(hash, files);
  }
  return byHash;
}

try {
  const commits = readMeta(LIMIT);
  const filesByHash = readFilesByHash(LIMIT);
  for (const c of commits) {
    c.files = filesByHash.get(c.hash) || [];
  }
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(commits, null, 2) + '\n');
  console.log(
    `[git-log] Wrote ${commits.length} commits to src/data/git-history.json`
  );
} catch (e) {
  if (existsSync(OUT_FILE)) {
    console.log(
      '[git-log] git log unavailable — keeping existing src/data/git-history.json'
    );
  } else {
    console.log(
      '[git-log] git log unavailable and no existing snapshot — writing []'
    );
    mkdirSync(OUT_DIR, { recursive: true });
    writeFileSync(OUT_FILE, '[]\n');
  }
}
