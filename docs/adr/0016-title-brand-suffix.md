# 0016. Canonical brand as the only title suffix

- Status: Accepted
- Date: 2026-11-17

## Context

Answer engines join the signals of an entity by its name. The brand "Nuria Romero" is declared once in `src/data/site.ts` (`SITE.name`) and is already used by `og:site_name` and the JSON-LD business and person entities, but page titles used it inconsistently: most carried no brand, two used it mid-string and the legal pages used the domain (NRD-241, GEO audit 2026-11-17). Service and niche `seo.title` strings are frozen by `tests/seo-meta-titles.test.js` because they carry the keyword + city + price pattern.

## Decision

- `src/components/seo/SEO.astro` renders `<title>` through `brandedTitle()` (`src/lib/seo-title.ts`): the page title, then `" | "`, then `SITE.name`, unless the page title already ends with `SITE.name`.
- Page sources own only their part of the title and never write the brand or the domain inside it.
- `og:title` and `twitter:title` keep the page's own title; `og:site_name` carries the brand.
- Title length guards (for example `scripts/check-seo-15.mjs`) apply to the page-owned part; `scripts/check-seo-11.mjs` requires the suffix on every indexable page.

## Consequences

- One brand string for every title, read from `SITE.name`; renaming the brand is a one-line change.
- Rendered titles are 15 characters longer; results truncate after the page keyword, which stays first.
- A story that edits a blog post title or regenerates the post baseline sees the suffix in `tests/fixtures/blog-posts.baseline.json`.
- Reviews reject a page title that embeds the brand or the domain.

## Evidence

- `src/lib/seo-title.ts`, `src/components/seo/SEO.astro`, `scripts/check-seo-11.mjs`, `scripts/check-seo-15.mjs`, `tests/site-identity.test.js` (NRD-241).
- Design: `openspec/changes/nuriaromero-241-canonical-brand-organization/design.md`.
