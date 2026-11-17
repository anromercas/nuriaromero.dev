## Why

Tracker: [NRD-241](https://nuriaromerodev.atlassian.net/browse/NRD-241).

Answer engines (Google AI, ChatGPT, Perplexity) join the signals of an entity by its name. Today the brand shows up in several forms: the JSON-LD and `og:site_name` say "Nuria Romero", most `<title>` tags carry no brand, the legal pages end in "| nuriaromero.dev", the home title puts the brand in the middle, and the header logo link is announced as "Ir al inicio". The GEO audit (geo-optimizer-skill 4.19.7, 2026-11-17, home 77/100) also flags an Organization node without `name`/`url`: the home emits a second `ProfessionalService`/`Organization` node with the shared `@id` that only carries `aggregateRating`/`review` when real Google reviews are available (`src/lib/schema.ts:51-75`).

## What Changes

- Every `<title>` of an indexable page ends with the canonical brand `SITE.name` ("Nuria Romero"), added once by the SEO head component; page sources that already put the brand in the middle (home, `/sobre-mi/`) or use the domain (legal pages) are rewritten so the brand appears only as the suffix. `og:title`/`twitter:title` keep the page's own title; `og:site_name` keeps `SITE.name`.
- The reviews JSON-LD node (`reviewsSchema`) carries `name` and `url` like the main business node, so no Organization-typed node in the build lacks them.
- The header logo link gets the accessible name "Nuria Romero, nuriaromero.dev": brand first, plus the text the wordmark shows (WCAG 2.5.3); the wordmark image is unchanged.
- `public/llms.txt` names the site with the same brand.
- `scripts/check-seo-11.mjs` fails when an indexable title does not end with the brand, `og:site_name` differs from `SITE.name`, or an Organization-typed node lacks `name`/`url`; `scripts/check-seo-15.mjs` measures its 65-character limit on the page-owned part of the title (before the brand suffix).
- ADR 0016 records the title suffix convention.

## Out of scope

- Changing the visual wordmark of the header logo (owner decision, stated in the story).
- Rewording any page-owned title other than the three cases above, meta descriptions, H1s or body copy.
- Generating `llms.txt` at build (it stays a hand-kept file, as today).
- Footer brand (already renders `SITE.name`).

## Capabilities

### New Capabilities

- `site-identity`: one canonical brand string across titles, Open Graph, JSON-LD entities, the header logo name and `llms.txt`, and complete Organization nodes.

### Modified Capabilities

- None.

## Impact

- `src/components/seo/SEO.astro`, new `src/lib/seo-title.ts`, `src/lib/schema.ts` (relative `.ts` imports, `reviewsSchema`), `src/components/Header.astro` (logo link), `src/pages/index.astro`, `src/pages/sobre-mi.astro`, `src/pages/aviso-legal.astro`, `src/pages/privacidad.astro`, `src/pages/cookies.astro` (title prop only), `public/llms.txt`, `scripts/check-seo-11.mjs`, `scripts/check-seo-15.mjs`, `tests/fixtures/blog-posts.baseline.json` (regenerated: post titles gain the suffix), new tests.
- Rendered titles grow by 15 characters ("` | Nuria Romero`"); long titles are truncated in results after the page-owned part, which keeps the keyword at the start. Recorded as a trade-off in ADR 0016.
- No radical change: no dependency, no new page, no URL change, legal page bodies untouched (only the `<title>` text is made consistent).
