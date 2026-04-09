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
    title: bilingualText,
    languages: z.array(languageLiteral).default(['uk']),
    tags: tagList,
    commentary: z.string().optional(),
    source: z.string().optional(), // upstream Drive doc
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
  }),
});

export const collections = {
  terms,
  clauses,
  documents,
  roles,
  workflows,
  cases,
};
