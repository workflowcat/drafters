#!/usr/bin/env node
/**
 * Build-time export generator.
 *
 * Walks src/content/ and generates static files under public/exports/
 * for every workflow, document, and clause:
 *   - source.mdx        raw MDX source
 *   - *.docx            clean Word doc from markdown body
 *   - *.zip             bundle including docx + mdx + README + related
 *
 * Runs before `astro build` via a `prebuild` script hook.
 */

import { readdirSync, readFileSync, statSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname, basename, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import archiver from 'archiver';
import { createWriteStream } from 'node:fs';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  LevelFormat,
  Footer,
  PageNumber,
} from 'docx';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CONTENT_ROOT = join(ROOT, 'src/content');
const EXPORT_ROOT = join(ROOT, 'public/exports');

// ── Utilities ─────────────────────────────────────────────

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

function pickTitle(title) {
  if (typeof title === 'string') return title;
  if (title && typeof title === 'object') {
    return title.uk || title.en || title.de || '';
  }
  return '';
}

function ensureDir(p) {
  mkdirSync(p, { recursive: true });
}

// ── Tiny markdown → docx walker ───────────────────────────
// Covers: h1-h3, paragraphs, bold/italic, bullet lists, numbered
// lists, blockquotes, wikilinks (flatten to their display text).
//
// This is deliberately minimal. The point is clean legal output,
// not parity with every markdown feature. Tables and images are
// stripped; code fences render as plain paragraphs.

function stripFrontmatter(md) {
  if (md.startsWith('---')) {
    const end = md.indexOf('\n---', 3);
    if (end !== -1) return md.slice(end + 4).replace(/^\n+/, '');
  }
  return md;
}

function flattenInline(text) {
  // Convert [[Target]] and [[Target|Display]] to just the display text
  text = text.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2');
  text = text.replace(/\[\[([^\]]+)\]\]/g, '$1');
  // Convert [text](url) to text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  return text;
}

function inlineRuns(text) {
  // Split by bold/italic markers and produce TextRun[] with formatting
  const runs = [];
  const re = /(\*\*[^*]+\*\*|_[^_]+_|`[^`]+`)/g;
  let lastIndex = 0;
  let m;
  while ((m = re.exec(text))) {
    if (m.index > lastIndex) {
      runs.push(new TextRun({ text: text.slice(lastIndex, m.index) }));
    }
    const token = m[0];
    if (token.startsWith('**')) {
      runs.push(new TextRun({ text: token.slice(2, -2), bold: true }));
    } else if (token.startsWith('_')) {
      runs.push(new TextRun({ text: token.slice(1, -1), italics: true }));
    } else if (token.startsWith('`')) {
      runs.push(new TextRun({ text: token.slice(1, -1), font: 'Consolas' }));
    }
    lastIndex = m.index + token.length;
  }
  if (lastIndex < text.length) {
    runs.push(new TextRun({ text: text.slice(lastIndex) }));
  }
  return runs.length ? runs : [new TextRun({ text })];
}

function markdownToParagraphs(md, titleText) {
  const body = stripFrontmatter(md);
  const lines = body.split('\n');
  const paragraphs = [];

  if (titleText) {
    paragraphs.push(
      new Paragraph({
        text: titleText,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.LEFT,
        spacing: { after: 400 },
      })
    );
  }

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Blank
    if (trimmed === '') {
      i++;
      continue;
    }

    // Headings
    const hMatch = /^(#{1,6})\s+(.*)$/.exec(trimmed);
    if (hMatch) {
      const level = hMatch[1].length;
      const text = flattenInline(hMatch[2]);
      const heading =
        level === 1
          ? HeadingLevel.HEADING_1
          : level === 2
          ? HeadingLevel.HEADING_2
          : level === 3
          ? HeadingLevel.HEADING_3
          : HeadingLevel.HEADING_4;
      paragraphs.push(
        new Paragraph({ text, heading, spacing: { before: 280, after: 160 } })
      );
      i++;
      continue;
    }

    // Bullet list
    if (/^[-*]\s+/.test(trimmed)) {
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        const text = flattenInline(lines[i].trim().replace(/^[-*]\s+/, ''));
        paragraphs.push(
          new Paragraph({
            children: inlineRuns(text),
            bullet: { level: 0 },
            spacing: { after: 60 },
          })
        );
        i++;
      }
      continue;
    }

    // Numbered list
    if (/^\d+\.\s+/.test(trimmed)) {
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        const text = flattenInline(lines[i].trim().replace(/^\d+\.\s+/, ''));
        paragraphs.push(
          new Paragraph({
            children: inlineRuns(text),
            numbering: { reference: 'standard-numbering', level: 0 },
            spacing: { after: 60 },
          })
        );
        i++;
      }
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('>')) {
      const text = flattenInline(trimmed.replace(/^>\s*/, ''));
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text, italics: true })],
          indent: { left: 400 },
          spacing: { after: 120 },
        })
      );
      i++;
      continue;
    }

    // HR / divider — skip
    if (/^[-=*]{3,}$/.test(trimmed)) {
      i++;
      continue;
    }

    // Strip HTML tags (sidenote components etc.)
    if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
      i++;
      continue;
    }

    // Collect a paragraph (consecutive non-blank lines)
    const chunk = [];
    while (i < lines.length && lines[i].trim() !== '' && !/^#{1,6}\s/.test(lines[i].trim())) {
      chunk.push(lines[i].trim());
      i++;
    }
    const joined = flattenInline(chunk.join(' '));
    paragraphs.push(
      new Paragraph({
        children: inlineRuns(joined),
        spacing: { after: 160 },
        alignment: AlignmentType.JUSTIFIED,
      })
    );
  }

  return paragraphs;
}

function makeDoc(paragraphs, title) {
  return new Document({
    creator: 'Drafters',
    title,
    description: `Exported from Drafters — ${title}`,
    styles: {
      default: {
        document: {
          run: { font: 'Georgia', size: 22 }, // 11pt
        },
      },
    },
    numbering: {
      config: [
        {
          reference: 'standard-numbering',
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: '%1.',
              alignment: AlignmentType.LEFT,
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: 'Drafters · ', size: 16, color: '888888' }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: '888888' }),
                ],
              }),
            ],
          }),
        },
        children: paragraphs,
      },
    ],
  });
}

async function writeDocx(md, title, outPath) {
  const paragraphs = markdownToParagraphs(md, title);
  const doc = makeDoc(paragraphs, title);
  const buffer = await Packer.toBuffer(doc);
  writeFileSync(outPath, buffer);
}

// ── Zip helper ────────────────────────────────────────────

function zipDir(files, outPath) {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(outPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    output.on('close', () => resolve());
    archive.on('error', reject);
    archive.pipe(output);
    for (const f of files) {
      if (f.content) archive.append(f.content, { name: f.name });
      else if (f.path) archive.file(f.path, { name: f.name });
    }
    archive.finalize();
  });
}

// ── Content loaders ───────────────────────────────────────

function loadCollection(name) {
  const dir = join(CONTENT_ROOT, name);
  const files = walk(dir);
  return files.map((file) => {
    const raw = readFileSync(file, 'utf8');
    const parsed = matter(raw);
    return { file, raw, data: parsed.data, body: parsed.content };
  });
}

// ── README generators ─────────────────────────────────────

function mkReadme({ title, lines, generated }) {
  return `# ${title}\n\n${lines.join('\n')}\n\n---\nGenerated by Drafters on ${generated}.\n`;
}

// ── Main ──────────────────────────────────────────────────

async function main() {
  // Clean previous exports
  try {
    rmSync(EXPORT_ROOT, { recursive: true, force: true });
  } catch {}
  ensureDir(EXPORT_ROOT);

  const now = new Date().toISOString().slice(0, 10);

  const workflows = loadCollection('workflows');
  const documents = loadCollection('documents');
  const clauses = loadCollection('clauses');
  const terms = loadCollection('terms');
  const roles = loadCollection('roles');

  // Index clauses by baseId
  const clausesByBase = new Map();
  for (const c of clauses) {
    const base = c.data.baseId || c.data.id;
    if (!clausesByBase.has(base)) clausesByBase.set(base, []);
    clausesByBase.get(base).push(c);
  }

  let count = 0;

  // ── Workflows ────────────────────────────
  for (const w of workflows) {
    const id = w.data.id;
    const title = pickTitle(w.data.title) || id;
    const outDir = join(EXPORT_ROOT, 'workflows', id);
    ensureDir(outDir);

    writeFileSync(join(outDir, 'source.mdx'), w.raw);
    await writeDocx(w.body, title, join(outDir, 'workflow.docx'));

    // Bundle: workflow.docx + all referenced docs as docx + README
    const bundleFiles = [
      { path: join(outDir, 'workflow.docx'), name: `01_workflow.docx` },
      { path: join(outDir, 'source.mdx'), name: `source/workflow.mdx` },
    ];
    const affected = new Set();
    // Walk steps, pull referenced documents
    if (Array.isArray(w.data.steps)) {
      for (const step of w.data.steps) {
        if (!Array.isArray(step.uses)) continue;
        for (const useId of step.uses) {
          affected.add(useId);
        }
      }
    }
    let fileIndex = 2;
    for (const useId of affected) {
      const doc = documents.find((d) => d.data.id === useId);
      if (doc) {
        const docTitle = pickTitle(doc.data.title);
        const docOutPath = join(outDir, `ref-${useId}.docx`);
        await writeDocx(doc.body, docTitle, docOutPath);
        bundleFiles.push({
          path: docOutPath,
          name: `documents/${String(fileIndex).padStart(2, '0')}_${useId}.docx`,
        });
        bundleFiles.push({
          content: doc.raw,
          name: `source/documents/${useId}.mdx`,
        });
        fileIndex++;
      }
    }

    const readme = mkReadme({
      title,
      lines: [
        `Workflow bundle exported from Drafters.`,
        ``,
        `Contains the workflow narrative + every document referenced in its steps,`,
        `plus the raw MDX source under ./source/.`,
        ``,
        `Referenced documents: ${affected.size}`,
      ],
      generated: now,
    });
    bundleFiles.push({ content: readme, name: 'README.md' });

    await zipDir(bundleFiles, join(outDir, 'bundle.zip'));
    count++;
  }

  // ── Documents ────────────────────────────
  for (const d of documents) {
    const id = d.data.id;
    const title = pickTitle(d.data.title) || id;
    const outDir = join(EXPORT_ROOT, 'documents', id);
    ensureDir(outDir);

    writeFileSync(join(outDir, 'source.mdx'), d.raw);
    await writeDocx(d.body, title, join(outDir, 'document.docx'));

    // Bundle with context: document.docx + composed clauses + terms glossary + README
    const bundleFiles = [
      { path: join(outDir, 'document.docx'), name: `01_document.docx` },
      { path: join(outDir, 'source.mdx'), name: `source/document.mdx` },
    ];
    let idx = 2;
    if (Array.isArray(d.data.composedOf)) {
      for (const clauseBaseId of d.data.composedOf) {
        const variants = clausesByBase.get(clauseBaseId) || [];
        const ukVariant = variants.find((c) => c.data.lang === 'uk') || variants[0];
        if (ukVariant) {
          const clauseTitle = pickTitle(ukVariant.data.title);
          const clauseOut = join(outDir, `ref-${clauseBaseId}.docx`);
          await writeDocx(ukVariant.body, clauseTitle, clauseOut);
          bundleFiles.push({
            path: clauseOut,
            name: `clauses/${String(idx).padStart(2, '0')}_${clauseBaseId}.docx`,
          });
          bundleFiles.push({
            content: ukVariant.raw,
            name: `source/clauses/${clauseBaseId}.mdx`,
          });
          idx++;
        }
      }
    }

    const readme = mkReadme({
      title,
      lines: [
        `Document bundle exported from Drafters.`,
        ``,
        `Contains the document + all its composed clauses as separate files,`,
        `plus the raw MDX sources under ./source/.`,
        ``,
        `Composed of ${(d.data.composedOf || []).length} clauses.`,
      ],
      generated: now,
    });
    bundleFiles.push({ content: readme, name: 'README.md' });

    await zipDir(bundleFiles, join(outDir, 'with-context.zip'));
    count++;
  }

  // ── Clauses ──────────────────────────────
  for (const [baseId, variants] of clausesByBase) {
    const outDir = join(EXPORT_ROOT, 'clauses', baseId);
    ensureDir(outDir);
    const primary = variants.find((v) => v.data.lang === 'uk') || variants[0];
    const title = pickTitle(primary.data.title) || baseId;
    writeFileSync(join(outDir, 'source.mdx'), primary.raw);
    await writeDocx(primary.body, title, join(outDir, 'clause.docx'));
    count++;
  }

  console.log(`[exports] Generated ${count} export bundles in public/exports/`);
}

main().catch((e) => {
  console.error('[exports] failed:', e);
  process.exit(1);
});
