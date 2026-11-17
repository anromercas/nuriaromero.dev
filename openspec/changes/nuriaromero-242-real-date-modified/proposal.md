## Why

Tracker: [NRD-242](https://nuriaromerodev.atlassian.net/browse/NRD-242).

Perplexity and Google AI favour sources with a visible, verifiable update date. The home and the service pages publish no date at all (largest point loss of the GEO audit, geo-optimizer-skill 4.19.7, 2026-11-17: home 77/100, Perplexity 50). Blog posts already emit `datePublished`/`dateModified` (`src/lib/schema.ts:206-227`) and show "Publicado el" / "Actualizado el" (`src/layouts/BlogPostLayout.astro:60-78`), but nothing guards their coherence.

## What Changes

- New build-time freshness source: the date of the last commit that touched a page's source file or the `src/data` modules that hold its copy, read with `git log`, never the build time. When the history cannot prove that date (no git, untracked file, shallow clone boundary), the date is omitted and the build does not fail.
- Every indexable page registered in a route-to-sources map emits a `WebPage` JSON-LD node with `dateModified` (only when the date is known).
- Service pages and the home show a discreet "Actualizado: <mes año>" label with a `<time datetime>` equal to the JSON-LD value; legal pages show no label (they keep their own "Última actualización" legal text).
- Blog posts keep their current behaviour; their `<time>` elements gain markers so a build check can compare them with the Article JSON-LD and the sitemap `lastmod`.
- New build check `scripts/check-seo-21.mjs` in `check:seo:dist`; `scripts/check-seo-16.mjs` ignores the freshness node when comparing the reference page JSON-LD with its fixture.
- ADR 0017 records the freshness source and the word-budget marker on the label.

## Out of scope

- Sitemap `lastmod` for non-blog pages (the invariant keeps it blog-only; pages without it stay coherent with "omit rather than invent").
- Changing CI (`actions/checkout` depth) or Netlify settings.
- The visible date on legal pages, `/contacto/`, `/sobre-mi/`, `/portfolio/`, `/recursos/`, `/blog/` (JSON-LD only on those).
- Treating shared component or style changes as content updates.

## Capabilities

### New Capabilities

- `content-freshness`: real, build-derived modification dates for pages and posts, in JSON-LD, visible labels and the sitemap, with omission when unknown.

### Modified Capabilities

- `page-template`: the reference-page JSON-LD baseline excludes the build-derived freshness node.

## Impact

- New `src/lib/freshness.ts`, `src/data/page-freshness.ts`, `src/components/PageUpdated.astro`, `scripts/check-seo-21.mjs`, tests.
- Modified `src/lib/schema.ts` (`webPageSchema`), `src/layouts/Layout.astro`, `src/layouts/ServiceLayout.astro`, `src/pages/index.astro`, `src/layouts/BlogPostLayout.astro` (markers only), `scripts/check-seo-16.mjs`, `package.json` (`check:seo:dist`, `check:seo-21`, `check:seo-21:dist`).
- Builds run `git` at build time (already present on Netlify and CI); CI checks out with depth 1, so CI builds omit the dates, and the checks accept omission.
- No new dependency, no network call, no radical change.
