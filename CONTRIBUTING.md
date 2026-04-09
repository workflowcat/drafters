# Contributing to Drafters

Drafters is a workflow-first wiki for IT services companies. Its core value is composition: reusable clauses assembled into contracts, with bilingual variants and full docx exports. This guide covers how to add or change content.

## Quick start

```sh
pnpm install
pnpm dev              # http://localhost:4321
pnpm build            # static build (exports + pagefind)
pnpm lint:content     # catches broken wikilinks, orphans, missing reviewers
```

## Adding content

All content lives in `src/content/` under seven typed collections:

| Collection   | What it is                                           |
| :----------- | :--------------------------------------------------- |
| `terms/`     | Glossary entries. Drive tooltips on wikilinks.       |
| `clauses/`   | Reusable legal fragments with `uk` + `en` variants.  |
| `documents/` | Wiki pages about contracts (commentary, notes).      |
| `contracts/` | Compiled, signable contract bodies per language.     |
| `workflows/` | Narrative processes tying everything together.       |
| `roles/`     | Actors referenced in workflows.                      |
| `cases/`     | Scenario bundles of workflows.                       |

Each entry is typed via Zod in `src/content/config.ts`. The build fails if frontmatter doesn't match.

### Adding a clause

Use the scaffold:

```sh
pnpm new:clause payment-schedule "Графік платежів" "Payment Schedule" --tags finance,legal
```

This creates:

- `src/content/clauses/payment-schedule.uk.mdx`
- `src/content/clauses/payment-schedule.en.mdx`

Fill them in, using `[[wikilinks]]` to reference other clauses or terms. Add to a document's `composedOf` list to include it in a contract:

```yaml
composedOf:
  - payment-dispute
  - payment-schedule  # ← your new clause
```

### Adding a contract

Clone an existing contract:

```sh
pnpm new:contract subcontract-designer-2026 --based-on subcontract-dev-2026
```

Edit `src/content/contracts/subcontract-designer-2026.uk.mdx` + `.en.mdx`. Also create a matching wiki page at `src/content/documents/subcontract-designer-2026.mdx` with `composedOf` listing the clauses.

### Wikilinks

Write `[[Target]]` or `[[Target|Display text]]` anywhere in a body. The build resolves them at compile time against clause baseIds, document ids, term titles, and aliases. Broken wikilinks fail the content linter.

## Content lint

```sh
pnpm lint:content
```

Reports:

- **[BROKEN]** — wikilinks that don't resolve
- **[ORPHAN]** — clauses with zero inbound references
- **[META]** — workflows or documents missing `updated` timestamps
- **[AUDIT]** — active contracts missing essential clauses (dispute resolution, liability limit, effect of termination)
- **[EXPIRED]** — entries with expired `reviewExpires` dates

Run this before opening a PR.

## Review workflow

Clauses marked `status: active` should have:

- `reviewedBy` — name or team responsible
- `reviewedOn` — ISO date of last review
- `reviewExpires` — ISO date when the review must be refreshed

The `/admin` page surfaces entries that are overdue. `pnpm lint:content` fails on expired reviews.

## Design + UX

All visual tokens live in `src/styles/tokens.css`. Typography: Fraunces (serif) for body and headings, Raleway (sans) for chrome. Interaction vocabulary: color-only transitions at 180ms.

## Architecture notes

- **Composition over duplication.** If text appears verbatim in two contracts, extract it as a clause. If it varies slightly, extract two variants with a shared tag.
- **Cross-pillar clauses matter most.** Dispute resolution, liability limits, and effect of termination appear in both subcontracts and client MSAs. These are the most valuable clauses in the library.
- **Wiki pages ≠ contracts.** `documents/foo.mdx` is a wiki page about the contract; `contracts/foo.uk.mdx` is the actual signable contract body.
- **Exports are static.** `scripts/build-exports.mjs` pre-generates every docx, md, and zip at build time. No runtime server.

## License

Code: MIT. Content: CC BY 4.0.

The contract templates in this repo are examples, not legal advice.
