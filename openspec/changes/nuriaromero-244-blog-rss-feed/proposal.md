## Why

Tracker: [NRD-244](https://nuriaromerodev.atlassian.net/browse/NRD-244).

The blog has no feed: `/rss.xml` returns 404 and no page declares `<link rel="alternate" type="application/rss+xml">` (verified live by the orchestrator, 2026-11-17). Feed readers, aggregators and answer engines have no standard way to discover new posts (GEO audit, geo-optimizer-skill 4.19.7).

## What Changes

- The build writes `/rss.xml`, an RSS 2.0 feed of every published (non-draft) blog post: title, canonical URL with trailing slash, description, `pubDate`, newest first, from a static Astro endpoint `src/pages/rss.xml.ts` prerendered at build time. **No new dependency** (`@astrojs/rss` is not used: a new dependency is the owner's decision per PRD section 9, and the run is unattended).
- Every page's head declares `<link rel="alternate" type="application/rss+xml" title="Blog de Nuria Romero" href="/rss.xml">` through the SEO head component.
- The sitemap excludes `/rss.xml`; `robots.txt` keeps allowing it.
- New build check `scripts/check-seo-23.mjs` in `check:seo:dist`.
- The "Static output" invariant and ADR 0018 make explicit that prerendered (build-time) endpoints for non-HTML files are allowed, while server endpoints stay forbidden.

## Out of scope

- Full post content in the feed (`content:encoded`), images, categories or an Atom/JSON feed.
- A visible "RSS" link or icon in the UI.
- Changing `public/_headers` (Netlify serves `.xml` with an XML content type; no CSP impact, the feed runs no script).

## Capabilities

### New Capabilities

- `blog-feed`: the RSS 2.0 feed of published posts and its discovery link.

### Modified Capabilities

- None.

## Impact

- New `src/lib/rss.ts`, `src/pages/rss.xml.ts`, `scripts/check-seo-23.mjs`, `tests/rss-feed.test.js`, `docs/adr/0018-build-time-endpoints.md` (written with this design).
- Modified `src/components/seo/SEO.astro`, `astro.config.mjs` (sitemap filter), `package.json` (`check:seo-23`, `check:seo-23:dist`, `check:seo:dist`), `.claude/harness/invariants.md` and `openspec/config.yaml` (wording of the static-output rule only).
- Not radical: output stays fully static, no adapter, no runtime, no dependency. The invariant wording change is a clarification recorded in ADR 0018 and reported to the human.
