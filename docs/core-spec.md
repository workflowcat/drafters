# Drafters — core spec (v1 → v2)

*Status: retrospective spec. Written April 2026, at the end of v1, as the
seed for v2. Captures what worked, what didn't, and the invariants that
should carry forward regardless of stack.*

This is not a plan. It's the distilled product — what Drafters is trying
to be, which parts of v1 earned their place, and which parts didn't.
A new implementation should treat the **invariants** as load-bearing and
the **technical choices** as signal-not-gospel.

---

## 1. What this is

Drafters is a **reference library for people who draft and negotiate
professional services contracts** in the Ukraine / EU context.
The primary user is a senior practitioner (partner, in-house counsel,
ops lead, founder) who:

- has to produce a signable contract fast,
- wants institutional memory about which clauses matter and why,
- trains juniors by walking them through the thinking, not just the text.

It is **not** a contract generator. It is **not** a DocuSign replacement.
It is closer to an opinionated Notion-meets-Tufte: a living set of
clause patterns and worked examples, presented at multiple levels of
detail.

The unusual trick: contracts are **composed** (assembled from reusable
clauses via `<Clause baseId="..." />`) and **annotated** (voice
components provide the partner-in-your-ear commentary), but the output
is still **one clean signable document** when you want it.

### Primary audiences

1. **The drafter.** Needs to produce a contract they'd send to
   counterparty today. Cares about: clean signable text, correct party
   block, section numbering, copy-paste-into-Word survival.
2. **The negotiator.** About to walk into a call. Cares about: what to
   push back on, where the real money is, what trade-offs are available.
3. **The junior / onboard.** Reading to learn. Cares about: why each
   clause exists, how a senior would think about it, what the
   historical context is.

Each audience gets a different view of the same source document. That
is the core invariant.

---

## 2. The core invariant: one source, three views

This is the single most important idea in v1 and must survive into v2.

Every contract has **three layers**, rendered from the same MDX source
via a view toggle:

### Layer 1 — **Clean / signable**

The document you'd send to counterparty. Passes the copy-paste test:
select-all → paste into Word → zero cleanup needed.

Requirements:
- No tool chrome (no baseIDs, no fallback chips, no "clause/" headers).
- No commentary (no voice cards).
- No briefing (no executive summary or meta prose).
- Proper section numbering from the contract's own headings.
- Party block, signature block, attachments all formatted like a real
  law-firm draft.
- A **copy button** that produces plain text, reinforces that the layer
  is signable.

### Layer 2 — **Reviewed / commentary**

Layer 1 + marginalia. The "redlined" view a senior associate would
pass to a junior.

Requirements:
- Briefing at top as an **executive summary panel**, not a blockquote.
- Voice comments float in the right margin, anchored to the clause they
  comment on.
- Voices do not visually fight the underlying text; the primary thread
  is still the signable contract.
- Each voice has a distinct persona (see §4). Five personas.

### Layer 3 — **Brief**

The 1-pager a partner hands the junior before a negotiation.

Requirements:
- Shows: contract title + executive summary + section list (the `h2`
  sequence serves as the TOC).
- Hides: everything else. No body prose, no tables, no clauses, no
  voices.
- Brief-mode h2 is lighter than document-mode h2 (no top border) so
  the list reads as a TOC, not a truncated doc.

### The invariants

- **All three layers derive from one source.** No duplicate files. No
  "signable-variant" + "annotated-variant" + "brief-variant." One MDX
  per contract-language combination; CSS + state attribute switches
  the view.
- **State lives in `data-view` on the layout wrapper.** Persisted to
  localStorage per-page. Layer switch is instant, no reload.
- **Each layer is stand-alone-useful.** Clean is sendable. Reviewed is
  trainable. Brief is shareable with execs.
- **Editor chrome (baseIDs, lang fallback chips) never appears in any
  layer.** It's editor-only affordance, visible on the standalone
  clause page (`/clauses/[id]`) but hidden when inlined into a contract.

---

## 3. The wiki basics

The rest of Drafters is a wiki that supports the contracts. It is
intentionally low-ceremony.

### Entities

Each is a content collection of MDX files.

| Collection | What it is | Example |
|---|---|---|
| `contracts` | Full compiled agreements | Services Agreement 2026 |
| `clauses` | Reusable contract sections | payment-dispute-client |
| `cases` | Worked examples, war stories | Lead attribution at Atelier Brun |
| `cast` | Companies + people referenced | Acme Services GmbH, Maya Lindqvist |
| `workflows` | Multi-step procedures | Client onboarding |
| `roles` | Role definitions | Tech Lead, Delivery Manager |
| `terms` | Glossary entries | Rate increase, Prepayment |

`documents` existed in v1 as a middle layer mapping clause composition;
it was retired because contracts ARE the compiled documents. Do not
reintroduce unless there's a proven reason.

### File structure

Every entity:
- Lives in `src/content/{collection}/`.
- Has a stable `baseId` (never changes once set).
- Has an optional `lang` variant (`.uk.mdx`, `.en.mdx`, etc.).
- Declares its frontmatter per the collection schema.

Example frontmatter:
```yaml
id: services-agreement-2026.uk
baseId: services-agreement-2026
lang: uk
title:
  uk: Договір про надання послуг — Acme Services GmbH
  en: Services Agreement — Acme Services GmbH
contractor: acme-services
counterparty: customer
updated: '2026-04-13'
tags: [contract, msa, client, "2026", signable]
```

### Cross-references

Two mechanisms:

1. **Frontmatter refs** — structured, typed. `contractor: acme-services`
   points to a `cast` entity. Checked by the linter.
2. **Wikilinks in prose** — `[[slug]]` syntax resolved at build time.
   Broken refs fail lint. Renders as a hover-popover-free link.

Keep both. Structured refs are for machines (build graph, export
pipeline). Wikilinks are for humans writing prose.

### Backlinks

Every page shows "Referenced from" with a typed breakdown (workflows,
cases, cast, clauses, terms, roles). Computed at build time by scanning
the reference graph. Required invariant: if A references B, B shows A
in its backlinks — no one-directional linking.

### Language handling

- Source of truth is per-language MDX files.
- Shared `baseId` groups variants.
- A URL `/contracts/services-agreement-2026` picks a preferred variant;
  `?lang=en` overrides.
- Title is an object (`title.uk`, `title.en`) so the URL can show the
  right title per lang.
- Chrome (nav, buttons, labels) is one language. Content is in whatever
  the author wrote. Do NOT mix — mixed chrome reads as cheap.

### Conventions that must hold

- **`baseId` is forever.** Renames are painful — they break wikilinks,
  exports, backlinks. Pick well and keep.
- **One file = one concept.** A clause file is a clause, not a cluster.
- **Authoring is in-repo.** Authors open an editor and type markdown.
  No CMS, no web admin.
- **Lint is load-bearing.** Broken refs, missing lang variants, orphaned
  clauses, dead wikilinks — all fail the build. This keeps the wiki
  honest without review discipline.

---

## 4. The voice system

Every contract has annotations written in one of five voices. Each has
a name, a color, and a distinct editorial personality. Keep all five.
Adding more flattens the taxonomy; removing any loses a distinct angle.

| Voice | Label | Color | Angle |
|---|---|---|---|
| `legal` | Юридичний / Legal | Steel blue `#7e8fa6` | Legal risk, what the clause actually means |
| `business` | Бізнес / Business | Muted green `#6b9e6b` | Cash flow, revenue, commercial implications |
| `negotiations` | Переговори / Negotiations | Lavender `#9ca9ef` | Trade-offs, redlines, what to push back on |
| `delivery` | Delivery | Warm amber `#c4956a` | Operational reality, team impact, documentation |
| `interaction` | Взаємодія / Interaction | Neutral grey `#a0a0a0` | How this clause interacts with others in the document |

### Rendering

Tufte-style sidenote. Not a Disco Elysium chip. Specifically:

- Colored **2px left border** — the only chroma on the voice.
- Voice label in small-caps, muted (0.68rem, 0.85 opacity, 0.08em letter-spacing).
- Body in serif, italic not required, line-height ~1.55.
- No emoji. No background color. No bold pill.
- Tight padding (just the 0.9rem left gutter).

This reads as a scholarly footnote, which is correct for a legal
document context. The emoji-chip variant looked decorative and pulled
attention away from the contract text.

### Positioning

- **Desktop ≥1280px, reviewed mode:** voices float into a dedicated
  right margin (20rem gutter = 18rem voice + 2rem left margin). Content
  column is `calc(100% - 20rem)`. Each `h2` does `clear: right` so
  voices stay tied to their section.
- **Below 1280px (or clean/brief mode):** voices hidden (brief) or
  inline (reviewed on narrow screens falls back gracefully).
- **Mobile:** inline full-width cards.

### Writing voices

- Voices are written **after** the content they annotate, in source
  order. The float behavior in the DOM takes care of placement.
- Each voice is 2-4 sentences. A voice that runs to 10 sentences is
  really a sub-clause — extract it.
- Mixing languages inside a voice is OK (lots of terms of art stay
  English in a Ukrainian commercial context).
- Voices cluster after clauses or tables, not after each paragraph.
  Over-annotation kills readability.

---

## 5. Content collections (detailed)

### Contracts

Full compiled agreements. MDX body is:

1. `# {title}` — h1
2. Briefing blockquote — executive summary for Layer 2 / Layer 3
3. Preamble — party block, start date, whereas clauses
4. `## 1. Key Terms` (or equivalent) — usually a table
5. Voices after the table
6. `## N. {Section}` — each section either contains prose or inlines
   one or more `<Clause baseId="..." />`
7. Voices after each clause / table / section
8. `## N. Signatures` — signature block
9. `## Додаток А — Ставки` or equivalent attachments

### Clauses

Self-contained contract sections. MDX body is the clause text, no
surrounding h1/h2 (those come from the containing contract). The clause
MDX file CAN contain its own title in frontmatter — displayed on
`/clauses/[id]` but hidden when inlined into a contract.

Clauses are authored **without assuming what contract they'll be
inlined into**. No "see §3 above." Use wikilinks to other clauses or
terms if cross-reference is needed.

### Cases

Worked examples. "Here's what happened, here's how it was resolved,
here's what we learned." Frontmatter connects to `clients` (company
cast entries), `people` (individual cast entries), and `clauses`
referenced during the case.

### Cast

Companies and people. Two types: `company` and `person`. Each has a
small frontmatter block (jurisdiction, industry, personality) and
short prose. The cast page reverse-looks-up "appears in cases" from
the cases collection.

### Workflows

Multi-step procedures with numbered steps. Each step references a
`role` (who does it) and optionally `uses` (which clauses or
documents are touched). Workflows are for training and onboarding,
not runtime task management.

### Roles

Role definitions. Short. Referenced by workflow steps.

### Terms

Glossary. The shortest entity type. One term, one paragraph. Linked
from contract prose via wikilinks.

---

## 6. The reading experience

### Page layout

Three-column grid on desktop (≥1024px):
- **Rail** (13rem, left): nav, breadcrumb, recent.
- **Body** (measure ~66ch): the actual content.
- **Margin** (1fr, right): TOC, related, sidenotes.

Below 1024px: single column, rail + margin hidden.

The grid **responds to document state** via `:has()`:
- Contract page in reviewed mode at ≥1280px: grid becomes `13rem +
  62rem`, margin hidden (it's now the voice gutter instead).
- Contract page in brief mode at ≥1024px: margin hidden (the briefing
  IS the TOC).

This pattern — **CSS responds to document state declaratively** — is
important. Resist the urge to duplicate layouts or add JavaScript
class toggles for things CSS `:has()` can express.

### Typography

- **Body / display:** Fraunces (serif, variable). Use optical sizing
  for h1s.
- **Chrome:** Raleway (sans).
- **h1:** display weight, light, negative letter-spacing.
- **h2:** smaller than h1, sans-serif, semibold, top border to mark
  section boundaries.
- **Body text:** serif, normal weight, 1.6ish line-height, 66ch measure.

Case: **sentence case everywhere**. No uppercase chrome. No tight
letter-spacing. Looks clean, reads fast.

### Chrome minimalism

- One rail nav with ≤5 top-level items. Secondary entities reached
  through prose, wikilinks, or the command palette.
- No scroll progress bar, no reading tools toolbar, no floating chrome.
- No hover popovers for wikilinks — they're just underlined links.
- Backlinks section at the bottom of every content page. Keep it.

### Search

Command palette (⌘K / Ctrl+K) backed by Pagefind. One search surface,
not a separate `/search` page. Pagefind runs at build, no server
component needed.

---

## 7. Filesystem-as-database

v1 committed to markdown-as-database and this worked. Stay the course.

### Why markdown wins for this product

- **Composition is a filesystem concern.** A contract is an ordered list
  of clause refs — that's `<Clause baseId="..." />` in MDX, not a JOIN.
- **Translations** = one file per lang with shared baseId. No
  translations table.
- **Versioning** = git. Branches, blame, diffs. No audit table.
- **Reusability** = build-time ref resolution. Broken refs fail lint
  at authoring time.
- **Authoring** = editor. No admin UI, no auth, no seed scripts.

### When a DB becomes correct

Exactly one trigger: **runtime per-user data.** E.g., counterparty
marking up a clause, tracked comments stored per-user, client approval
state.

When that trigger fires, the right move is:
- Clauses stay in markdown.
- A new `comments` / `approvals` collection lives in a DB.
- Joined at read time by `{baseId, userId}`.

Do not migrate clauses to a DB to "enable comments." The clause is
still a document; comments are a runtime projection on top.

### The export pipeline

`scripts/build-exports.mjs` compiles each contract into `.md`, `.docx`,
and `.zip` artifacts in `public/exports/`. This pipeline is the bridge
to Word.

In v1 it was linked from the UI via download buttons. Those came down
— the exports still exist on disk, unlinked, waiting for a Word MCP
integration. v2 should do the same: generate the artifacts, do not link
to them until the Word integration is real.

---

## 8. Small wins (things that clicked)

These are small, specific v1 decisions that felt right. Carry them
forward.

- **Copy-clean button.** One-click test of whether Layer 1 works. If
  you paste the result and it needs cleanup, Layer 1 is leaking chrome.
  Essential as a dogfooding affordance.
- **Dotted separator between stacked clauses** in the same section. No
  visible heading, just a minimal visual break so two clauses don't
  run together.
- **Executive summary styling** for the briefing. Paper-soft background,
  lavender left-border, serif body, no blockquote quotes. Signals
  "meta" without signalling "pull quote."
- **Section-anchored voices via `> h2 { clear: right }`.** Voices stack
  in the margin within their section. A new section starts a new
  voice stack. This keeps long contracts readable.
- **`:has()`-driven grid expansion.** No JS, no wrapper components,
  just CSS reacting to the document's declared state.
- **Build-time lint.** Every broken ref caught before deploy.
- **Backlinks everywhere.** The network effect of a wiki only works if
  both directions are visible.
- **Sentence-case, no uppercase chrome.** Reads contemporary; looks
  less "corporate portal from 2008."

---

## 9. What didn't work (do not repeat)

v1 grew too many features, accumulated mixed-language chrome, and
decorated itself with things that served no reader. Specifically:

### Aesthetic missteps

- **Cream paper background + offset lavender/peach shadows + uppercase
  chrome + tight letter-spacing on buttons.** Looks vintage, reads
  heavy. Go white, use sentence case, drop shadows.
- **Emoji on voice labels.** Cute in a wiki, jarring in a legal doc.
- **Blockquote styling for briefings.** Reads as a pull-quote, which
  is the opposite of what the briefing is.

### Surface-area bloat

v1 had 21 routes. Most weren't reader destinations:

- `/graph`, `/analytics`, `/compare`, `/changelog`, `/admin` —
  metadata-about-the-wiki pages. Felt like "features for
  completeness." Retire.
- `/clauses/heat` — a heatmap of clause usage. Interesting data, no
  reader job. Retire.
- `/documents/*` — middle layer between clauses and contracts.
  Redundant. Retire. Let `/clauses/[id]` show "used in contracts"
  directly.

v2 starts with fewer routes and adds only when a concrete reader job
emerges. Rule of thumb: **every route must answer a question someone
walks in asking.**

### Navigation bloat

v1 rail had 12 items. Too many. v2 rail should have ≤5. Everything
else reaches through wikilinks, command palette, backlinks.

### Language mixing

Ukrainian nav labels + English button text + mixed section headings
(`## 1. Key terms` + `## 2. Платежі`) all in one doc. Pick a language
per chrome surface and commit. Content can be whatever the author
wrote.

### Clause chrome leaking into contracts

`.clause__header` ("clause / payment-dispute-client") and
`[fallback: en]` chips visible inside a rendered contract. These are
editor affordances — fine on the standalone clause page, must be
hidden when inlined. This is a core invariant (Layer 1 cleanness).

### Export buttons without a destination

17 download buttons across the site for `.docx`/`.md`/`.zip` outputs
nobody had asked for. Remove. When Word MCP flow is real, add **one**
button: "Open in Word."

---

## 10. Technical choices (signal, not gospel)

What the v1 stack is, what about it earned its place, what to keep in
mind if v2 changes stacks.

### Stack

- **Astro 5 + Content Collections + MDX.** Good fit: server-rendered,
  type-safe frontmatter, MDX components (the `<Clause>` + `<Voice>`
  pattern depends on MDX).
- **Pagefind** for search. Runs at build, produces a static index, no
  server. Solid.
- **Git** for versioning. Obviously.
- **Vercel** for deploy. Fine.
- **No database.** Keep it that way until runtime-per-user data arrives.

### Patterns worth keeping regardless of stack

- **Filesystem content + frontmatter + wikilinks + build-time lint.**
  Any static-site generator supports this (Astro, Next MDX, Eleventy,
  Hugo). The conventions are portable.
- **`<Clause baseId="..." />` as inline composition.** Requires a
  component model (MDX, Mitosis, server components). Not portable to
  raw markdown, but the concept is stack-agnostic.
- **State on a wrapper, CSS drives layout.** `data-view="clean|reviewed|brief"`
  with `:has()`-based grid expansion. Works anywhere `:has()` works
  (widely supported since late 2023).

### Scripts that earned their place

- `scripts/lint-content.mjs` — broken refs, missing langs, orphans.
  Keep + extend.
- `scripts/build-exports.mjs` — compiles contracts to
  `.md/.docx/.zip`. Keep. The Word MCP flow will consume this.
- `scripts/new-clause.mjs`, `scripts/new-contract.mjs` — authoring
  scaffolds. Low-weight, useful.
- `scripts/build-git-log.mjs` — generated the `/changelog` page. Can
  retire if `/changelog` retires.

---

## 11. Open questions for v2

These were unresolved at v1's end. Answer before v2 implementation.

### Product / IA

- **Word MCP flow timing.** Is "Open in Word" the v2 launch button
  or a v2.1 addition? If launch, the export pipeline becomes
  user-facing, not a dangling artifact.
- **Brief-mode shape.** v1 ended as "h1 + briefing + all h2 (TOC)."
  Should each h2 in brief mode get a one-line "focus" annotation
  (e.g., `§7 — Liability — торгуватися останнім, 12 місяців fees`)?
  Would turn the TOC into a negotiator's cheat-sheet without
  re-introducing voice cards.
- **Sub-clause numbering.** `<Clause>` components stacked under a `h2`
  currently render as flowing prose with a dotted separator. Should
  they auto-number as `§2.1`, `§2.2`? Would need a render change and
  possibly a frontmatter `order` field.
- **Runtime comments?** The one trigger for introducing a DB. If v2
  needs counterparty / client markup, design the `comments` collection
  up front.

### Content

- **How many contracts in the library?** v1 had 5 (MSA, T&M, DedTeam,
  SoW, DPA). Is that the canon, or should v2 add NDA-mutual,
  consulting-fixed, referral-agreement, etc.? More contracts = more
  maintenance; pick carefully.
- **Is the cases collection pulling its weight?** Cases are worked
  examples. v1 had a handful. Either commit (target 20+ over a year)
  or retire in favor of inline commentary.
- **Voice coverage goal.** Every contract should have all five voices
  present across its sections — one-voice contracts feel flat.
  Lint for this? Or leave to authoring discipline?

### Technical

- **Is MDX the right component escape hatch?** Yes for now. Revisit if
  Astro ever becomes painful.
- **`public/exports/` in git?** v1 tracked them (~100MB of binaries).
  Could build-on-deploy instead. Trade-off: git grows, but the exports
  are reproducible from source.
- **Search beyond Pagefind?** Fine for v2. Revisit if semantic search
  (embeddings) becomes a specific reader need.

### Aesthetic

- **Voice aesthetic at v2.** v1 ended on Tufte sidenote (minimal,
  colored border, small-caps label). Keep, or try something more
  distinctive? Don't go back to emoji chips.
- **Branding / identity.** Drafters has no logo, no explicit visual
  identity beyond "Fraunces + Raleway + lavender." Is that enough, or
  does v2 want proper branding?

---

## 12. What survives from v1 verbatim

These files / patterns should be ported to v2 with minimal change:

- `src/content/clauses/*.mdx` — the clause library. The canonical
  reusable sections.
- `src/content/contracts/services-agreement-2026.uk.mdx` — the
  reference MSA, post-cleanup. Use as the model.
- `src/content/contracts/time-and-materials-2026.en.mdx` — the
  reference T&M.
- `scripts/lint-content.mjs` — rules.
- `scripts/build-exports.mjs` — pipeline.
- The three-layer view-toggle pattern (CSS + tiny JS).
- The five-voice taxonomy and colors.
- The `:has()`-based grid expansion pattern.
- The backlinks computation.
- The wikilinks resolver.

## 13. What is explicitly out of scope

State this up front so v2 doesn't drift:

- Real-time collaboration.
- Multi-tenant / multi-organization support.
- In-browser WYSIWYG editing.
- Signing / e-signature integration.
- Payment processing / invoicing.
- AI contract generation ("write me an NDA"). Drafters is a reference
  library, not a generator. If v3 wants AI assistance, it should be
  editorial (help me annotate) not generative (write me a contract).
- A "marketplace" of contracts from other authors.

---

## One-line summary for the v2 kickoff

> Drafters is a composable contract reference library with three views
> over every document — signable, annotated, briefed — built on
> markdown files, wiki-style cross-refs, and five annotation voices.
> Keep the invariants, drop the decoration.
