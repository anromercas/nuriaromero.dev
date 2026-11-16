# Proposal

## Why

Tracker: [NRD-230](https://nuriaromerodev.atlassian.net/browse/NRD-230) (bug, epic NRD-162, milestone M4). The custom 404 (NRD-223) is `noindex` and has no canonical, but `src/components/seo/SEO.astro:32` always emits `og:url` with the computed canonical (`:16`, `new URL(Astro.url.pathname, Astro.site)`), which on the 404 is `/404/`. Netlify serves that page for every missing route, so a broken URL shared on social networks shows `/404/` as the card URL (follow-up LOW of the NRD-223 review).

## What Changes

- `SEO.astro` emits `og:url` under the same `!noindex` condition as the canonical; nothing else in the head changes.
- `scripts/check-seo-19.mjs` (runs in CI) fails if `dist/404.html` declares `og:url`.
- Tests in `tests/not-found-page.test.js`: source guard plus built checks (404 without `og:url`, an indexable page keeps `og:url` equal to its canonical).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `not-found-page`: the 404 head also carries no `og:url`; the shared SEO head omits `og:url` together with the canonical on `noindex` pages only.

## Out of scope

- Other Open Graph or Twitter tags (title, description, image) of the 404 or any page.
- Sitemap, `llms.txt`, redirects or Netlify config.

## Impact

- Code (layer `app`): `src/components/seo/SEO.astro`, `scripts/check-seo-19.mjs`, `tests/not-found-page.test.js`.
- SEO: only `src/pages/404.astro` sets `noindex` today, so only `dist/404.html` changes. No URL, dependency, CSP or Netlify change. Not radical.
