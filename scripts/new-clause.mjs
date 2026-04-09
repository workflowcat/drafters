#!/usr/bin/env node
/**
 * Scaffold a new clause with uk + en variants.
 *
 * Usage:
 *   pnpm new:clause <baseId> "Title UA" "Title EN" [--tags a,b,c]
 *
 * Creates:
 *   src/content/clauses/<baseId>.uk.mdx
 *   src/content/clauses/<baseId>.en.mdx
 */
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DIR = join(ROOT, 'src/content/clauses');

const args = process.argv.slice(2);
if (args.length < 3) {
  console.error('Usage: pnpm new:clause <baseId> "Title UA" "Title EN" [--tags a,b,c]');
  process.exit(1);
}

const [baseId, titleUk, titleEn, ...rest] = args;
let tags = [];
for (let i = 0; i < rest.length; i++) {
  if (rest[i] === '--tags' && rest[i + 1]) {
    tags = rest[i + 1].split(',').map((s) => s.trim()).filter(Boolean);
    i++;
  }
}

if (!/^[a-z0-9][a-z0-9-]*$/.test(baseId)) {
  console.error('baseId must be kebab-case (lowercase, digits, hyphens)');
  process.exit(1);
}

const ukFile = join(DIR, `${baseId}.uk.mdx`);
const enFile = join(DIR, `${baseId}.en.mdx`);
if (existsSync(ukFile) || existsSync(enFile)) {
  console.error(`Clause "${baseId}" already exists`);
  process.exit(1);
}

mkdirSync(DIR, { recursive: true });

const ukTemplate = `---
id: ${baseId}.uk
baseId: ${baseId}
lang: uk
title:
  uk: ${titleUk}
  en: ${titleEn}
languages: [uk, en]
aliases: []
tags: [${tags.join(', ')}]
commentary: TODO — short editorial note about when this clause is used.
---

TODO — write the Ukrainian clause text here.

Use [[wikilinks]] to reference other clauses, terms, or documents.

## Notes (optional — editorial commentary, stripped from exports)

Anything under commentary headings gets stripped from the docx
export pipeline. Keep it here freely.
`;

const enTemplate = `---
id: ${baseId}.en
baseId: ${baseId}
lang: en
title:
  uk: ${titleUk}
  en: ${titleEn}
languages: [uk, en]
aliases: []
tags: [${tags.join(', ')}]
commentary: TODO — short editorial note about when this clause is used.
---

TODO — write the English clause text here.

Use [[wikilinks]] to reference other clauses, terms, or documents.

## Notes (optional — editorial commentary, stripped from exports)

Anything under commentary headings gets stripped from the docx
export pipeline. Keep it here freely.
`;

writeFileSync(ukFile, ukTemplate);
writeFileSync(enFile, enTemplate);

console.log(`✓ Created ${baseId}.uk.mdx`);
console.log(`✓ Created ${baseId}.en.mdx`);
console.log(`\nNext: edit the files, run \`pnpm build:astro\` to verify.`);
