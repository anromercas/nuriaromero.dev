# 0005. Sitemap, robots, llms.txt and build-time SEO checks

- Status: Accepted (retroactive)
- Date: 2026-11-12

## Context

Crawlers (search and AI) must find every public page, with real `lastmod` where it exists, and SEO regressions are easy to introduce without noticing in the browser.

## Decision

- Sitemap: `@astrojs/sitemap` in `astro.config.mjs`. It filters out `/components` and sets `lastmod` only for blog posts, read from their frontmatter (`updatedDate` or `pubDate`); other pages get no `lastmod` instead of a fake build date.
- Robots: `astro-robots-txt` with `allow: /` for all agents and explicitly for AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Google-Extended).
- `public/llms.txt` is a hand-curated index of public pages (profile, services, sectors, editorial, official profiles, sitemap), in Spanish, with no promise of indexing or citation.
- SEO acceptance criteria become build-time checks: `scripts/check-seo-NN.mjs` read the built HTML in `dist/` (and `src/data` as reference) and exit non-zero on failure. Each has `pnpm check:seo-NN` (builds first) and `pnpm check:seo-NN:dist` (reuses `dist/`).
- Private client reports in `public/informes/**` get `X-Robots-Tag: noindex, nofollow` from `public/_headers` and are not linked.

## Consequences

- Adding or removing a public page means checking the sitemap output and updating `public/llms.txt` by hand.
- A story with an SEO structure acceptance criterion adds or extends a `check-seo-*` script; existing checks must keep passing after `pnpm build`.
- `public/informes/**` is still emitted into `dist/` and may be picked up by the sitemap integration only if it becomes an Astro route; keep reports as static files.

## Evidence

- `astro.config.mjs`: `getBlogLastmodBySlug`, `sitemap({ filter, serialize })`, `robotsTxt({ policy })`, `site`.
- `public/llms.txt`; `public/_headers` (`/informes/*`).
- `scripts/check-seo-02.mjs` ... `check-seo-15.mjs`, `scripts/check-capilar-local.mjs`; `package.json` `check:seo-*` scripts.
