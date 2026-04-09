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
  Header,
  PageNumber,
  BorderStyle,
  PageBreak,
} from 'docx';
import { markdownToChildren } from './lib/md-to-docx.mjs';

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

// ── Doc assembly ──────────────────────────────────────────
// Uses the shared md → docx walker from scripts/lib/md-to-docx.mjs.
// Supports three document kinds:
//   - wiki:     plain page with a title heading, default footer
//   - clause:   clause-only doc with clause metadata footer
//   - contract: cover page, running header with contract name,
//               running footer with "Drafters · page X", numbered
//               sections, clean legal styling

function coverPageChildren({ title, parties, lang = 'uk' }) {
  const children = [];
  // Empty runs to push the title down the page
  for (let i = 0; i < 6; i++) {
    children.push(new Paragraph({ children: [new TextRun({ text: '' })] }));
  }
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [
        new TextRun({
          text: title,
          size: 48, // 24pt
          bold: true,
          font: 'Georgia',
        }),
      ],
    })
  );
  if (parties) {
    const sep = lang === 'uk' ? 'між' : 'between';
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        children: [new TextRun({ text: sep, size: 22, italics: true, color: INK_MUTED })],
      })
    );
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [new TextRun({ text: parties.contractor, size: 24, bold: true })],
      })
    );
    const amp = lang === 'uk' ? 'та' : 'and';
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [new TextRun({ text: amp, size: 22, italics: true, color: INK_MUTED })],
      })
    );
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 800 },
        children: [new TextRun({ text: parties.counterparty, size: 24, bold: true })],
      })
    );
  }
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: 'Drafters',
          size: 18,
          color: '8A8578',
          font: 'Georgia',
        }),
      ],
    })
  );
  // Force the rest of the document onto a new page
  children.push(
    new Paragraph({
      children: [new TextRun({ children: [new PageBreak()] })],
    })
  );
  return children;
}

const INK_MUTED = '555555';

function makeDoc({ kind, title, body, parties, lang = 'uk' }) {
  const bodyChildren = markdownToChildren(body);

  let allChildren;
  if (kind === 'contract') {
    allChildren = [...coverPageChildren({ title, parties, lang }), ...bodyChildren];
  } else {
    allChildren = [
      new Paragraph({
        text: title,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.LEFT,
        spacing: { after: 400 },
      }),
      ...bodyChildren,
    ];
  }

  return new Document({
    creator: 'Drafters',
    title,
    description: `Exported from Drafters — ${title}`,
    styles: {
      default: {
        document: {
          run: { font: 'Georgia', size: 22 }, // 11pt
        },
        heading1: {
          run: { font: 'Georgia', size: 32, bold: true },
          paragraph: { spacing: { before: 400, after: 200 } },
        },
        heading2: {
          run: { font: 'Georgia', size: 26, bold: true },
          paragraph: { spacing: { before: 320, after: 160 } },
        },
        heading3: {
          run: { font: 'Georgia', size: 22, bold: true },
          paragraph: { spacing: { before: 240, after: 120 } },
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
        properties: {
          page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } },
        },
        headers: kind === 'contract'
          ? {
              default: new Header({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                      new TextRun({ text: title, size: 16, color: '8A8578', font: 'Georgia' }),
                    ],
                  }),
                ],
              }),
            }
          : undefined,
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: 'Drafters · ', size: 16, color: '8A8578' }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: '8A8578' }),
                  new TextRun({ text: ' / ', size: 16, color: '8A8578' }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: '8A8578' }),
                ],
              }),
            ],
          }),
        },
        children: allChildren,
      },
    ],
  });
}

async function writeDocx(md, title, outPath, options = {}) {
  const doc = makeDoc({
    kind: options.kind || 'wiki',
    title,
    body: md,
    parties: options.parties,
    lang: options.lang || 'uk',
  });
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

// ── <Clause> component inlining ───────────────────────────
// When a contract MDX body contains <Clause baseId="X" lang="Y" />,
// we resolve it at export time by pasting the clause's markdown body
// in place. This turns the contract body into a single flat document.

function inlineClauses(body, clausesByBase, defaultLang) {
  // Self-closing and paired forms
  const re = /<Clause\s+baseId=["']([^"']+)["'](?:\s+lang=["']([^"']+)["'])?\s*\/>/g;
  return body.replace(re, (_match, baseId, lang) => {
    const variants = clausesByBase.get(baseId) || [];
    const targetLang = lang || defaultLang;
    const hit =
      variants.find((v) => v.data.lang === targetLang) ||
      variants.find((v) => v.data.lang === 'uk') ||
      variants.find((v) => v.data.lang === 'en') ||
      variants[0];
    if (!hit) {
      return `\n\n> [missing clause: ${baseId}]\n\n`;
    }
    // Strip clause H1/H2 headings to avoid conflict with surrounding structure,
    // and strip the "Commentary" / "When to use" sections that are wiki notes
    // rather than legal text.
    let text = hit.body;
    // Remove sections like "## On watch out", "## Notes", "## Where used"
    // that are editorial commentary, not contract text. We recognize them
    // by being H2 sections after the main clause body.
    // Simple heuristic: cut off everything at the first "## " that's
    // clearly a commentary heading.
    const commentaryCutoff = text.search(
      /\n##\s+(На що звертати увагу|Things to watch|Notes|Practical|Практичні|Critical points|Why|Чому|When to use|Де використовується|Where used|When to|Де ще|Де це використовується|Нотатки|Різниця|Difference|Що цей пункт НЕ|What this clause|Де ще використовується|What's gone|What this)/i
    );
    if (commentaryCutoff !== -1) {
      text = text.slice(0, commentaryCutoff);
    }
    return '\n\n' + text.trim() + '\n\n';
  });
}

// ── README generators ─────────────────────────────────────

function mkReadme({ title, lines, generated }) {
  return `# ${title}\n\n${lines.join('\n')}\n\n---\nGenerated by Drafters on ${generated}.\n`;
}

// ── Main ──────────────────────────────────────────────────

async function writeClausesManifest(clausesByBase) {
  // Shape: { [baseId]: { title, tags, commentary, variants: { uk: body, en: body } } }
  const manifest = {};
  for (const [baseId, variants] of clausesByBase) {
    const first = variants[0];
    const title = first.data.title;
    const tags = first.data.tags || [];
    const commentary = first.data.commentary || null;
    const body = {};
    for (const v of variants) {
      if (v.data.lang) body[v.data.lang] = v.body;
    }
    manifest[baseId] = { title, tags, commentary, variants: body };
  }
  const outPath = join(ROOT, 'public', 'clauses.json');
  writeFileSync(outPath, JSON.stringify(manifest, null, 2));
  console.log(`[exports] Wrote clauses manifest (${Object.keys(manifest).length} clauses)`);
}

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
  const contracts = loadCollection('contracts');

  // Index clauses by baseId
  const clausesByBase = new Map();
  for (const c of clauses) {
    const base = c.data.baseId || c.data.id;
    if (!clausesByBase.has(base)) clausesByBase.set(base, []);
    clausesByBase.get(base).push(c);
  }

  // Index contracts by baseId
  const contractsByBase = new Map();
  for (const c of contracts) {
    const base = c.data.baseId || c.data.id;
    if (!contractsByBase.has(base)) contractsByBase.set(base, []);
    contractsByBase.get(base).push(c);
  }

  // Write the clauses manifest for the /builder page
  await writeClausesManifest(clausesByBase);

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

  // ── Contracts (compiled, signable contract bodies) ───
  // For each contract entry, inline its <Clause> components and
  // write a proper .docx alongside the raw source.
  for (const [baseId, variants] of contractsByBase) {
    const outDir = join(EXPORT_ROOT, 'contracts', baseId);
    ensureDir(outDir);
    for (const v of variants) {
      const lang = v.data.lang;
      const title = pickTitle(v.data.title) || baseId;
      // Inline clauses into the body text
      const inlined = inlineClauses(v.body, clausesByBase, lang);
      // Build parties for the cover page
      const parties =
        v.data.contractor === 'sloboda-gmbh'
          ? {
              contractor: 'Sloboda Software GMBH',
              counterparty:
                v.data.counterparty === 'customer'
                  ? lang === 'uk' ? 'Клієнт' : 'Customer'
                  : lang === 'uk' ? 'Субпідрядник' : 'Subcontractor',
            }
          : undefined;
      // Write raw mdx + compiled markdown + docx
      writeFileSync(join(outDir, `contract.${lang}.mdx`), v.raw);
      writeFileSync(join(outDir, `contract.${lang}.md`), inlined);
      await writeDocx(inlined, title, join(outDir, `contract.${lang}.docx`), {
        kind: 'contract',
        parties,
        lang,
      });
      count++;
    }
    // Bundle: zip all lang variants + README
    const bundleFiles = [];
    for (const v of variants) {
      const lang = v.data.lang;
      bundleFiles.push({
        path: join(outDir, `contract.${lang}.docx`),
        name: `contract.${lang}.docx`,
      });
      bundleFiles.push({
        path: join(outDir, `contract.${lang}.md`),
        name: `contract.${lang}.md`,
      });
    }
    const readme = mkReadme({
      title: pickTitle(variants[0].data.title) || baseId,
      lines: [
        `Compiled, signable contract exported from Drafters.`,
        ``,
        `Contains the full contract assembled from reusable clauses,`,
        `in all available languages (${variants.map((v) => v.data.lang).join(', ')}).`,
        ``,
        `The .docx files are ready to print, redline, and sign.`,
        `The .md files are the same content in plain markdown.`,
      ],
      generated: now,
    });
    bundleFiles.push({ content: readme, name: 'README.md' });
    await zipDir(bundleFiles, join(outDir, 'contract.zip'));
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
