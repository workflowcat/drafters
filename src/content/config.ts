import { defineCollection, z } from 'astro:content';

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
    source: z.string().optional(),
    reviewedBy: z.string().optional(),
    reviewedOn: z.string().optional(),
    reviewExpires: z.string().optional(),
  }),
});

// Cast — companies + people referenced by contracts and cases ---------------

const cast = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    kind: z.enum(['company', 'person']),
    title: z.string(),
    legalName: z.string().optional(),
    country: z.string().optional(),
    law: z.string().optional(),
    industry: z.string().optional(),
    size: z.string().optional(),
    personality: z.string().optional(),
    aliases: z.array(z.string()).default([]),
    tags: tagList,
    relatedCompanies: z.array(z.string()).default([]),
    relatedPeople: z.array(z.string()).default([]),
  }),
});

// Contracts — compiled, signable contract bodies ---------------------------
// One MDX file per (contract, language) pair. The MDX body contains the
// full contract text: preamble, key terms table, sections composing clauses
// via <Clause baseId="..." />, voices, signatures, attachments.

const contracts = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    baseId: z.string(),
    documentId: z.string().optional(),
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
  cast,
  contracts,
};
