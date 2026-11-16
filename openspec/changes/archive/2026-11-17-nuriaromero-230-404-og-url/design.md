# Design

## Context

See proposal.md (Why). Root cause: `src/components/seo/SEO.astro:27` renders the canonical only when `!noindex`, while `:32` renders `<meta property="og:url" content={canonical} />` unconditionally. `rg noindex src/pages src/layouts` shows only `src/pages/404.astro` (through `Layout`) sets it. `scripts/check-seo-19.mjs` already fails on a 404 canonical; `tests/not-found-page.test.js` holds a source guard for the canonical condition and built checks that skip without `dist/`.

## Goals / Non-Goals

**Goals:** no `og:url` on `noindex` pages; every indexable page keeps it unchanged; enforced in CI.

**Non-Goals:** any other head tag.

## Decisions

**Approach.** Wrap `og:url` in the same condition as the canonical: `{!noindex && <meta property="og:url" content={canonical} />}`. A `noindex` page has no URL that should be shared, which is the same reason it has no canonical. CI enforcement goes in `check-seo-19` because node tests that read `dist/` skip in CI (it runs `node --test` before the build).

**Files** (all layer `app`):

- Modify `src/components/seo/SEO.astro` (line 32 only).
- Modify `scripts/check-seo-19.mjs` (`if (/<meta property="og:url"/.test(html)) fail("404: must not declare og:url")`, next to the canonical check).
- Modify `tests/not-found-page.test.js`.

**Interfaces.** None changed (`SEO.astro` props unchanged).

**Data.** None.

**Test plan (TDD order).** In `tests/not-found-page.test.js`, RED first:

1. Source: "SEO.astro renders og:url only when the page is not noindex", regex `\{!noindex && <meta property="og:url" content=\{canonical\} \/>\}` (scenario "Noindex pages omit og:url").
2. Built (skip without `dist/404.html`): extend "built 404" with `assert.ok(!/<meta property="og:url"/.test(html))` (scenario "Noindex without canonical or og:url").
3. Built (skip without `dist/index.html`): `dist/index.html` has `og:url` equal to its `link rel="canonical"` href (scenario "Indexable pages keep canonical and og:url").
4. `scripts/check-seo-19.mjs` gains the `og:url` failure; then `node --test tests/*.test.js`, `pnpm build`, `pnpm check:seo:dist` green.

**Real-browser / e2e checks (QA).** View source of `dist/404.html` (or `/ruta-inexistente/` on `pnpm preview`): `noindex`, no canonical, no `og:url`. `/seo-local-sevilla/`: `og:url` equals its canonical.

**ADRs relied on.** 0004 (SEO head through `SEO.astro`), 0005 (SEO checks), 0006 (TDD).

## Risks / Trade-offs

- A future `noindex` page loses `og:url` too. Intended: same rule as the canonical, stated in the spec.
