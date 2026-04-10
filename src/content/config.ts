import { defineCollection, z, reference } from 'astro:content';

// Shared fragments ----------------------------------------------------------

const bilingualText = z.union([
  z.string(),
  z.object({
    uk: z.string().optional(),
    en: z.string().optional(),
    de: z.string().optional(),
  }),
]);

const tagList = z.array(z.string()).default([]);
const statusLiteral = z.enum(['draft', 'active', 'deprecated', 'archived']).default('draft');
const languageLiteral = z.enum(['uk', 'en', 'de']);

// Terms — glossary entries (tooltips + full pages) --------------------------

const terms = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    title: z.object({
      uk: z.string().optional(),
      en: z.string().optional(),
      de: z.string().optional(),
    }),
    short: z.object({
      uk: z.string().optional(),
      en: z.string().optional(),
      de: z.string().optional(),
    }),
    aliases: z.array(z.string()).default([]),
    tags: tagList,
    related: z.array(z.string()).default([]),
  }),
});

// Clauses — reusable legal fragments with language variants -----------------

const clauses = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    baseId: z.string().optional(),
    title: bilingualText,
    lang: languageLiteral.optional(),
    languages: z.array(languageLiteral).default(['uk']),
    aliases: z.array(z.string()).default([]),
    tags: tagList,
    commentary: z.string().optional(),
    source: z.string().optional(), // upstream Drive doc
    reviewedBy: z.string().optional(),
    reviewedOn: z.string().optional(),
    reviewExpires: z.string().optional(),
  }),
});

// Documents — contracts, SoPs, composed of clauses --------------------------

const documents = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    title: bilingualText,
    type: z.enum(['contract', 'policy', 'form', 'checklist', 'sop']),
    languages: z.array(languageLiteral).default(['uk']),
    status: statusLiteral,
    composedOf: z.array(z.string()).default([]), // clause ids
    workflows: z.array(z.string()).default([]),
    driveSource: z.string().url().optional(),
    supersedes: z.string().optional(),
    aliases: z.array(z.string()).default([]),
    tags: tagList,
    updated: z.string().optional(), // ISO date
    reviewedBy: z.string().optional(),
    reviewedOn: z.string().optional(),
    reviewExpires: z.string().optional(),
  }),
});

// Roles — actors referenced in workflows ------------------------------------

const roles = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    title: bilingualText,
    short: bilingualText.optional(),
    tags: tagList,
  }),
});

// Workflows — the narrative binding unit ------------------------------------

const workflowStep = z.object({
  id: z.string().optional(),
  title: bilingualText.optional(),
  role: z.string().optional(),
  uses: z.array(z.string()).default([]),
  outputs: z.array(z.string()).default([]),
});

const workflows = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    title: bilingualText,
    pillar: z.enum([
      'gtm',
      'client-engagement',
      'delivery',
      'people',
      'finance',
      'security',
      'internal-it',
    ]),
    primaryLanguage: languageLiteral.default('uk'),
    status: statusLiteral,
    steps: z.array(workflowStep).default([]),
    related: z.array(z.string()).default([]),
    tags: tagList,
    updated: z.string().optional(),
  }),
});

// Cases — scenarios bundling multiple workflows -----------------------------

const cases = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    title: bilingualText,
    workflows: z.array(z.string()).default([]),
    tags: tagList,
    // Optional recurring cast references for cross-linking cases.
    clients: z.array(z.string()).default([]),       // company cast ids
    people: z.array(z.string()).default([]),        // individual cast ids
  }),
});

// Cast — recurring fake characters (companies + people) that appear
// across cases. Having them as a collection lets us link them via
// wikilinks, show where each character shows up, and evolve their
// profiles over time.
const cast = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    kind: z.enum(['company', 'person']),
    title: z.string(),           // short display name e.g. "Horizon"
    legalName: z.string().optional(), // full legal name e.g. "Horizon Maritime Analytics Oy"
    country: z.string().optional(),
    law: z.string().optional(),
    industry: z.string().optional(),
    size: z.string().optional(),
    personality: z.string().optional(),
    aliases: z.array(z.string()).default([]),
    tags: tagList,
    // Cross-references
    relatedCompanies: z.array(z.string()).default([]),
    relatedPeople: z.array(z.string()).default([]),
  }),
});

// Contracts — compiled, signable contract bodies ---------------------------
// Each entry is one language variant of one document's contract body.
// The MDX body contains the actual contract text: preamble, key terms table,
// clauses inlined via <Clause baseId="..." lang="..."/> components,
// termination, liability, signatures, attachments. This is what the export
// pipeline turns into a real .docx that you could print and sign.

const contracts = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    baseId: z.string(),
    documentId: z.string(),
    lang: languageLiteral,
    title: bilingualText,
    contractor: z.string().optional(),
    counterparty: z.string().optional(),
    updated: z.string().optional(),
    tags: tagList,
  }),
});

export const collections = {
  terms,
  clauses,
  documents,
  roles,
  workflows,
  cases,
  cast,
  contracts,
};
