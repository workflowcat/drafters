#!/usr/bin/env node
/**
 * Scaffold a new contract based on an existing one.
 *
 * Usage:
 *   pnpm new:contract <newBaseId> --based-on <existingBaseId>
 *
 * Copies both language variants and replaces the baseId.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DIR = join(ROOT, 'src/content/contracts');

const args = process.argv.slice(2);
const newBaseId = args[0];
const basedIdx = args.indexOf('--based-on');
const sourceBaseId = basedIdx >= 0 ? args[basedIdx + 1] : null;

if (!newBaseId || !sourceBaseId) {
  console.error('Usage: pnpm new:contract <newBaseId> --based-on <existingBaseId>');
  process.exit(1);
}

if (!/^[a-z0-9][a-z0-9-]*$/.test(newBaseId)) {
  console.error('newBaseId must be kebab-case');
  process.exit(1);
}

const all = readdirSync(DIR);
const sources = all.filter((f) => f.startsWith(`${sourceBaseId}.`));
if (sources.length === 0) {
  console.error(`No contract found with baseId "${sourceBaseId}"`);
  process.exit(1);
}

for (const file of sources) {
  const lang = file.match(/\.(uk|en|de)\.mdx$/)?.[1];
  if (!lang) continue;
  const src = readFileSync(join(DIR, file), 'utf8');
  const dest = src
    .replace(new RegExp(`id: ${sourceBaseId}\\.${lang}`), `id: ${newBaseId}.${lang}`)
    .replace(new RegExp(`baseId: ${sourceBaseId}`), `baseId: ${newBaseId}`)
    .replace(/documentId: [^\n]+/, `documentId: ${newBaseId}`);
  const outFile = join(DIR, `${newBaseId}.${lang}.mdx`);
  if (existsSync(outFile)) {
    console.error(`${outFile} already exists`);
    process.exit(1);
  }
  writeFileSync(outFile, dest);
  console.log(`✓ Created ${newBaseId}.${lang}.mdx`);
}

console.log(`\nNext:`);
console.log(`1. Edit src/content/contracts/${newBaseId}.*.mdx to customize`);
console.log(`2. Create a matching wiki document at src/content/documents/${newBaseId}.mdx`);
console.log(`3. Run \`pnpm build:astro\` to verify`);
