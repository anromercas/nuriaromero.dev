# 0017. Build-derived page freshness from git history

- Status: Accepted
- Date: 2026-11-17

## Context

Answer engines favour pages with a verifiable update date, and the GEO rules of this project forbid hard-coded, faked or build-time dates (NRD-242). Blog posts already have frontmatter dates; pages had none. The site is static (ADR 0001), so any date must be computed at build time. CI builds from a depth-1 clone; Netlify's clone depth is not under the repository's control.

## Decision

- A page's modification date is the committer date of the newest commit that touched its sources, read with `git log` at build time by `src/lib/freshness.ts`. Sources per route are declared in `src/data/page-freshness.ts` (page file plus the `src/data` modules that hold its copy or prices); a unit test fails when an indexable route has no entry.
- When history cannot prove the date (no git, untracked file, shallow-boundary commit), the date is omitted. Never the build time, never a hand-written page date.
- The date is published as `dateModified` of a `WebPage` JSON-LD node (`webPageSchema` in `src/lib/schema.ts`, added by `Layout.astro`) and, on service pages and the home, as a visible "Actualizado: <mes año>" label (`src/components/PageUpdated.astro`) with the identical `datetime`.
- The label is build-derived metadata and carries `data-word-budget="exclude"` (extends ADR 0015: it is absent in shallow builds, so counting it would break CI/production parity). Owner copy never carries the marker.
- `scripts/check-seo-21.mjs` guards format, "not later than the build", label/JSON-LD equality and blog/sitemap coherence; `scripts/check-seo-16.mjs` ignores the `WebPage` node.

## Consequences

- Dates are real and need no manual upkeep; a shallow build silently publishes none.
- An edit to a shared data module (`src/data/services.ts`) refreshes every page that reads it.
- New indexable pages must be registered in `src/data/page-freshness.ts`.
- Sitemap `lastmod` stays blog-only; extending it to pages would read the same function.
- Amendment (NRD-344): `/blog/` is dated by the most recent of the newest published post's `updatedDate ?? pubDate` (frontmatter) and the last commit of `src/pages/blog/index.astro`; `src/content/blog` is not a source, so draft commits never move it (`newestPublishedPostDate`, `latestDate` in `src/lib/freshness.ts`).

## Evidence

- `src/lib/freshness.ts`, `src/data/page-freshness.ts`, `src/components/PageUpdated.astro`, `src/layouts/Layout.astro`, `scripts/check-seo-21.mjs`, `tests/freshness.test.js`, `tests/page-freshness.test.js` (NRD-242).
- Design: `openspec/changes/nuriaromero-242-real-date-modified/design.md`.
