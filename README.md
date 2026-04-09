# Drafters

Workflow wiki for IT services companies. Bilingual (Ukrainian / English), workflow-first, modular, exportable. Built with [Astro](https://astro.build), deployed on [Vercel](https://vercel.com).

> Statuc HTML. Monospace accents on warm paper. Every contract is a composition of reusable clauses, linked into narrative workflows. Nothing lives in isolation.

## Content model

Six content collections, each strongly typed:

- **workflows/** — narrative pages that tie documents, roles and terms together
- **documents/** — contracts, SoPs, policies; composed of clauses
- **clauses/** — reusable legal fragments (Payment Dispute, IP Assignment, …)
- **terms/** — glossary entries with tooltips (Subcontractor, ФОП, Rate, …)
- **roles/** — actors (Tech Lead, PM, Legal, IT Ops)
- **cases/** — scenario bundles of workflows

Cross-links use `[[Target]]` or `[[Target|Display]]` wikilink syntax, resolved at build time. Broken links surface as warnings and render with a red underline.

Every page auto-generates a backlinks section from frontmatter references + body wikilinks.

## Running locally

```sh
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # static build → ./dist
pnpm preview      # serve the built site
```

## Project layout

```
src/
├─ content/
│  ├─ config.ts               # Zod schemas for all six collections
│  ├─ workflows/
│  ├─ documents/
│  ├─ clauses/
│  ├─ terms/
│  ├─ roles/
│  └─ cases/
├─ components/                # Astro components
├─ layouts/
│  └─ PageLayout.astro        # base layout (rail + body + margin)
├─ lib/
│  ├─ content-index.mjs       # sync scanner used by the remark plugin
│  ├─ remark-wikilinks.mjs    # [[wikilink]] → resolved link node
│  └─ backlinks.ts            # build-time backlinks index
├─ pages/                     # routes
└─ styles/
   ├─ tokens.css              # palette + type
   ├─ base.css                # base typography + inline voice
   ├─ layout.css              # grid + header + page chrome
   └─ print.css               # print / PDF stylesheet
```

## Design

Two-temperature palette: warm cream paper, ink brown, amber accent for active links and terminal chrome. Dark mode is a mirrored warm dark with cream ink, same amber. Typography: Source Serif 4 for body and headings, JetBrains Mono for terminal accents — breadcrumbs, wikilinks, status pills, ASCII dividers. 68ch measure, generous marginalia on desktop, single column on mobile.

## License

Code: MIT.
Content: CC BY 4.0 — attribution to **Drafters** when reused.

Contract templates published here are examples, not legal advice. Use at your own risk.
