# Design note: splitting Drafters into tools

*Status: thinking, not a committed plan. Written April 2026.*

Drafters today is one Astro site with one nav, one build, one deploy.
Inside that monolith live what are effectively three different
products sharing the same content:

1. **Wiki** — the browseable reference. `/terms`, `/clauses`,
   `/documents`, `/roles`, `/workflows`, `/cases`, `/cast`,
   `/contracts`. You come here to look something up.
2. **Builder** — the composition tool. `/builder`. You come here
   when you need to assemble a contract out of clauses, pick a
   language, save presets, export to DOCX/MD.
3. **Heatmaps** (currently `/admin`) — the governance dashboard.
   Broken wikilinks, orphans, drafts, missing timestamps, language
   coverage, touched-since-date. You come here once a week or once
   a month to audit content health.

The question: are these one product or three products that happen
to share a content vault?

## Why splitting is interesting

The three tools have fundamentally different **usage rhythms**,
**personas**, and **mental models**.

| | Wiki | Builder | Heatmaps |
| :-- | :-- | :-- | :-- |
| Rhythm | Daily browse | Episodic, per-deal | Weekly/monthly audit |
| Persona | Lawyers, ops, AMs, delivery leads | AMs, new-business, legal admin | Head of Legal, Ops Director |
| Mental model | "What does this say?" | "Assemble the right thing" | "What needs my attention?" |
| Interaction | Read-mostly, jump between pages | Drag clauses, reorder, export | Scan a list, click to fix |
| Pricing instinct | Per-seat, low | Per-seat, higher | Per-org, flat |

When you look at it this way, the monolith has a real problem:
the chrome (nav, header, command palette, mobile drawer) is the
same for all three, which means none of them is optimized. A
daily-browse user sees builder UI cluttering the header. A
once-a-month auditor sees daily-browse nav items they don't need.

More importantly — **they sell differently**. A law firm might
want only the wiki. A sales team might want only the builder
pointed at a shared clause library. A CEO might want only the
heatmaps for their existing wiki-in-Notion. Today you can't sell
any of those without the whole package.

## Why splitting is dangerous

The killer feature of Drafters is **cross-linking**. From a wiki
clause page you see "used in 4 contracts". From a heatmaps orphan
list you click straight into the wiki to fix it. From a wiki
document you click "open in builder" to customize it. These
cross-links make the product feel like one living thing instead
of three disconnected tools.

If you naively split into three separate sites on three separate
domains, those links become URL strings pointing at deployments
that may or may not exist, may or may not be accessible, may or
may not have matching content versions. The whole "composed
system" feeling evaporates.

A second risk: the vault (content + schemas + wikilinks +
backlinks + content-index + file-history + helpers) is ~15 files
of shared logic. Splitting into three sites means maintaining
three Astro configs, three build pipelines, three deploy
workflows, three copies of Pagefind. That's a lot of surface
area for a team of one.

## Four options

### Option 1: Keep the monolith, add mode switching

Same site, same build. Introduce a "tools" concept in the config
and show different chrome / nav based on which tools the current
customer has enabled.

- **Pros**: trivial. Cross-links stay free. One deploy, one auth,
  one search index.
- **Cons**: can't sell "just the wiki" as a separate SKU. Every
  customer gets the whole codebase even if they only use one tool.
  Theming is constrained to what the shared chrome allows.

### Option 2: Monorepo with three Astro sites + shared package

`packages/vault/` owns schemas + content + libs. `sites/wiki/`,
`sites/builder/`, `sites/heatmaps/` are three separate Astro
apps that import from `@drafters/vault`.

- **Pros**: true independence. Sell, theme, and deploy each
  site separately. Three teams can work in parallel without
  stepping on each other.
- **Cons**: maintenance 3× by default. Cross-linking becomes
  cross-origin (doable with a canonical URL scheme, but fragile).
  Pagefind has to run per site, so search is local to each tool
  unless you pay for a hosted search service. Overkill for
  current size (1 dev, ~70 content entries).

### Option 3: Plugin/integration model on top of the monolith

One site, one build, one deploy. But `/builder` and `/heatmaps`
become **Astro integrations** (or internal plugins) that can be
turned on/off in config. The vault + wiki are the base. Other
tools are add-ons.

- **Pros**: preserves cross-linking. One codebase, one deploy.
  Per-customer feature flags become a one-line config change.
  Migration is evolutionary — mostly moving files, not rewriting.
  Later, if you need separate deploys for a specific customer,
  a plugin can be lifted into its own site.
- **Cons**: plugin API has to be designed carefully (what can a
  tool see of the vault? what routes can it claim? what chrome
  slots can it fill?). If done badly, the "plugin" abstraction
  leaks and you get the worst of both worlds.

### Option 4: Headless content API + separate SPA apps

The vault becomes a content server (JSON + compiled HTML + DOCX
blobs). Each tool is a standalone app fetching from that API,
potentially in a different stack (Next, Vue, SolidStart,
whatever fits).

- **Pros**: maximum flexibility. Replatform one tool without
  touching the others. Different tools can have different
  release cadences.
- **Cons**: lose SSG entirely. Need a content server to run
  24/7. Complex deployment. Lose Pagefind static indexing. Lose
  the "it's just HTML on Vercel" simplicity. Massive overkill
  for current scale. This is the "we're a platform company now"
  option and should only be considered after the plugin model
  has been proven and outgrown.

## Recommendation: Option 3, evolving toward Option 2 if needed

Start with the plugin/integration model. Here's why:

1. **The current codebase is already ~90% there.** The vault
   (content + lib + styles) is cleanly separated from the pages.
   Moving `/builder.astro` and `/admin.astro` into
   `src/tools/builder/` and `src/tools/heatmaps/` is mostly a
   file-tree reorganization, not a rewrite.

2. **Cross-linking stays free.** Wiki, builder, and heatmaps stay
   on the same domain, share the same command palette, share the
   same Pagefind index, share the same backlink graph.

3. **Per-customer feature flags become trivial.** A customer
   wants wiki only? Set `tools: ['wiki']` in their
   `drafters.config.ts` and the builder/heatmaps routes don't
   get emitted. No separate infra, no separate auth, no code
   duplication.

4. **You can still escalate to Option 2 later.** If a real
   customer demand appears for fully independent deploys, the
   plugin boundaries are already drawn. You lift a plugin into
   its own `sites/` directory and wire it up as a dependent of
   `packages/vault/`. The migration is mechanical.

## Concrete migration steps (if you commit to this)

### Phase 0: draw seams without moving files (1 day)

- Audit `src/pages/` and tag each file as `wiki` / `builder` /
  `heatmaps` / `shared-chrome`.
- Audit `src/components/` the same way. `BacklinksSection`,
  `CommandPalette`, `MobileNav`, `RecentlyViewed`, `PageLayout`
  are shared chrome. `FileHistory` is wiki-specific (or arguably
  vault-level).
- Audit `src/lib/` — everything here is vault/shared. Good.

### Phase 1: introduce `drafters.config.ts` (half a day)

```ts
// drafters.config.ts
export default {
  tools: ['wiki', 'builder', 'heatmaps'],
  wiki: {
    collections: ['terms', 'clauses', 'documents', 'roles',
                  'workflows', 'cases', 'cast', 'contracts'],
  },
  builder: {
    defaultLanguage: 'uk',
    allowedLanguages: ['uk', 'en'],
  },
  heatmaps: {
    showBrokenLinks: true,
    showOrphans: true,
    showDrafts: true,
    showTouchedSince: 30, // days
  },
};
```

### Phase 2: move pages into tool directories (half a day)

```
src/
  tools/
    wiki/
      pages/
        terms/[id].astro
        clauses/[id].astro
        ...
      components/  (wiki-specific, if any)
    builder/
      pages/
        index.astro  (currently src/pages/builder.astro)
      components/
    heatmaps/
      pages/
        index.astro  (currently src/pages/admin.astro)
      components/
  pages/
    index.astro      (the landing — stays shared)
```

An Astro integration reads `drafters.config.ts` at build time
and virtualizes `src/tools/*/pages/` into the actual `src/pages/`
tree. Tools that are disabled get skipped.

### Phase 3: per-tool chrome variants (1 day)

`PageLayout` takes a `tool?: 'wiki' | 'builder' | 'heatmaps'`
prop. The header, nav, and rail adapt:

- **Wiki chrome**: all collection links in rail, full command
  palette, search bar prominent.
- **Builder chrome**: minimal rail ("Contracts", "Presets"),
  search hidden (no point searching the builder), exports
  prominent.
- **Heatmaps chrome**: scannable-list aesthetic, filter bar
  prominent, no lateral navigation.

The command palette stays shared but its command list is
filtered by enabled tools.

### Phase 4: promotion to `packages/` (only if needed, 3+ days)

If and only if a customer appears who genuinely needs independent
deploys, extract `src/content/`, `src/lib/`, `src/styles/base.css`,
and shared chrome into `packages/vault/`. Make each tool a
separate `sites/*/` Astro project that imports from it. This is
the Option 2 migration, done after the seams have been validated.

## Things I'd explicitly not do

- **Don't split now to "prepare for the future".** Splitting before
  you have customer demand is cargo-cult architecture. It adds
  maintenance cost and removes cross-linking with no upside.
- **Don't go headless (Option 4).** Drafters is static HTML on
  Vercel. That is a feature, not a limitation. Keep it.
- **Don't duplicate the schema.** The vault schema is the source of
  truth. Every tool reads from it. No per-tool data models.
- **Don't let the builder or heatmaps write to the vault.** All
  writes are MDX edits in the git repo, reviewed via PR. Tools
  are read-only views.
- **Don't introduce three separate Pagefind indexes.** One index,
  filtered per tool at query time.

## Open questions

- **Auth.** Today there's no auth. If a customer wants
  per-tool access control ("only partners see heatmaps"), does
  that live in the vault, in the tool, or in a
  gateway in front of both? Probably a gateway — treat the
  vault as public within the perimeter and gate entire
  tools at the edge.
- **Telemetry for heatmaps.** The heatmaps tool currently shows
  content health (broken links, orphans). A richer version would
  show **usage heatmaps**: which clauses are exported most, which
  contracts are built most, which wiki pages are viewed most.
  That requires telemetry — client-side beacons or server logs.
  Neither fits the current "it's just HTML on Vercel" model and
  would be the biggest architectural shift.
- **Content review workflow.** If tools are separate packages,
  where does "Legal reviews a clause before merging" live? In
  the vault as metadata, with each tool respecting the
  `reviewedBy` field. Probably fine as-is.
- **White-labeling.** If a customer wants their own branding on
  the wiki, that's a theme variable, not an architecture decision.
  Keep theme configurable in `drafters.config.ts` and don't
  over-engineer.

## Summary

Splitting Drafters into wiki / builder / heatmaps is a real idea,
not a fake one. The tools have different personas, rhythms, and
likely pricing. But the cross-linking that makes Drafters feel
like one product is worth protecting.

**The right move is the plugin model (Option 3)**: one codebase,
one deploy, but with tool-level feature flags and per-tool
chrome. It gives you 80% of the benefits of separate apps
(per-customer SKUs, independent theming, focused UX) while
preserving the 20% that actually matters (cross-links, shared
search, single deploy, static hosting).

Revisit the "three separate sites" option (Option 2) only when
a real customer demands independent deploys. Until then, it's
just maintenance cost with no user-visible benefit.
