# Design

## Context

See proposal.md (Why). State on `develop` (b6da86a) plus NRD-24 and NRD-25 merged (prerequisites):

- Checks: `scripts/check-seo-02.mjs` to `check-seo-20.mjs`; `package.json` has `check:seo-NN` (`pnpm build && node scripts/check-seo-NN.mjs`) and `check:seo-NN:dist` for each, and `check:seo:dist` runs all in numeric order. `tests/package-scripts.test.js` derives the expected scripts from the files in `scripts/`, so a new `check-seo-21.mjs` without its entries fails the suite. CI `verify` (`.github/workflows/ci.yml:34`) runs `pnpm check:seo:dist` after `pnpm build`.
- Reusable helpers: `countH1` (`scripts/lib/one-h1.mjs`), `jsonLdEntities` (`scripts/lib/page-contract.mjs`), `mainContent`, `visibleText` (`scripts/lib/main-links.mjs`). Precedent for a pure lib plus thin script with unit tests on fixture strings: `scripts/lib/og-url.mjs` + `scripts/check-seo-20.mjs` + `tests/og-url-guard.test.js` (NRD-236/239: resolve paths with `fileURLToPath`, never `URL.pathname`, so checkouts with spaces or accents work).
- The page after NRD-24/25: one H1 "SEO para IA: que ChatGPT, Gemini y Google entiendan tu negocio"; canonical `https://nuriaromero.dev/seo-para-ia/`; JSON-LD Service (no `offers`, `ownOffer: false`), FAQPage (six), BreadcrumbList, plus the global LocalBusiness and WebSite; the only "consultor" is the byline link `<a href="/">consultor SEO en Sevilla</a>`; the copy avoids `garantiz`, `asegur`, "primeras posiciones", "te sale en", "te recomendar" (answer 4 says "Nadie puede prometerte..."); `dist/sitemap-0.xml` lists the URL; `dist/llms.txt` (copied from `public/llms.txt`) has the "SEO para IA" line under "## Servicios". The 2026-11-17 build has no "consultor" in the header, footer or global JSON-LD of service pages.

## Goals / Non-Goals

**Goals:**

- One build check that catches the regressions the story names, runs in CI, and is unit-tested on fixtures.

**Non-Goals:**

- Checking copy quality, word count (owned by `check-seo-17`), links (`check-seo-06/07`) or other pages.

## Decisions

**Approach.** Pure function plus thin script, as `og-url`/`check-seo-20`: `seoParaIaFailures({ html, sitemap, llms })` returns an array of failure strings and never throws; `check-seo-21.mjs` resolves the build directory (optional first CLI argument, default the repo's `dist/`, both through `fileURLToPath`/`path.resolve`), reads the three files (a missing file is a failure with its path, not a crash), prints every failure prefixed `SEO-21:` and exits 1, or prints `SEO-21: /seo-para-ia/ contract passed`.

1. **Where "consultor" is counted.** Not the whole HTML: a future site-wide header, footer or global JSON-LD change would fail this page for a reason that is not its own. The check counts `/consultor/gi` in `<main>` inner HTML, `<title>`, the meta description and the page's own JSON-LD entities (Service, FAQPage, BreadcrumbList); the total must be 1, and `<main>` must contain exactly one `<a href="/"[^>]*>consultor SEO en Sevilla</a>`.
2. **Promise pattern.** `/garantiz|primeras posiciones|te sale en|te recomendar|asegur/i` (the NRD-24 test regex) on the visible text of `<main>`, the title, the meta description and the FAQPage answers. No negation allowance is needed: the page states the limit without those words.
3. **No own Offer.** Every JSON-LD entity with `@type` "Service" must lack `offers`; Service, FAQPage and BreadcrumbList must each be present at least once.
4. **H1.** `countH1(html) === 1` and the H1 visible text contains "SEO para IA" (case-sensitive, as published).
5. **Canonical.** `<link rel="canonical" href="https://nuriaromero.dev/seo-para-ia/">` (attribute order tolerant, exact href).
6. **Sitemap and llms.txt.** `sitemap` contains `<loc>https://nuriaromero.dev/seo-para-ia/</loc>`; in `llms`, the section between `## Servicios` and the next `## ` has a line containing `(https://nuriaromero.dev/seo-para-ia/)`.
7. **RED before the page exists.** The page is already on `develop` when this story starts, so the "fails before the page exists" evidence is (a) the unit tests written first (module missing, then each mutated fixture failing for its reason) and (b) `node scripts/check-seo-21.mjs <empty temp dir>` exiting 1 with the missing-file failure, recorded in the subtask comment.

### Files

All in layer `app`.

Create:

- `scripts/lib/seo-para-ia-contract.mjs`: `export const SEO_PARA_IA_URL`, `export const PROMISE_PATTERN`, `export function seoParaIaFailures({ html, sitemap, llms })`.
- `scripts/check-seo-21.mjs`: header comment "NRD-26: build contract of /seo-para-ia/ (page, sitemap, llms.txt)".
- `tests/seo-para-ia-check.test.js`: fixtures as template strings in the test (a valid minimal page with `<main>`, H1, canonical, three JSON-LD scripts, the byline link; a valid sitemap; a valid `llms.txt` with "## Servicios").

Modify:

- `package.json`: `"check:seo-21": "pnpm build && node scripts/check-seo-21.mjs"`, `"check:seo-21:dist": "node scripts/check-seo-21.mjs"` right after the 20 entries, and ` && node scripts/check-seo-21.mjs` at the end of `check:seo:dist` (exact formats asserted by `tests/package-scripts.test.js`).

### Interfaces

```js
// scripts/lib/seo-para-ia-contract.mjs
export const SEO_PARA_IA_URL = "https://nuriaromero.dev/seo-para-ia/";
export const PROMISE_PATTERN = /garantiz|primeras posiciones|te sale en|te recomendar|asegur/i;
/** @returns {string[]} every failure; empty when the contract holds */
export function seoParaIaFailures({ html, sitemap, llms }) {}

// scripts/check-seo-21.mjs [distDir]
// exit 0: prints "SEO-21: /seo-para-ia/ contract passed"; exit 1: prints each failure
```

### Data

None. Read-only check on build output.

### Test plan (TDD order)

1. Task 1.1, RED first in `tests/seo-para-ia-check.test.js` (module missing): valid fixtures return `[]`; one test per mutation, each returning a failure that names it: two `<h1>`; H1 without "SEO para IA"; canonical to another URL; missing canonical; no FAQPage; no BreadcrumbList; no Service; Service with `offers`; a second "consultor" in `<main>` text; "consultor" in the title; the home link with another anchor; each promise phrase of `PROMISE_PATTERN` in `<main>`; sitemap without the URL; `llms.txt` without the line, and with the line outside "## Servicios"; missing inputs (`html` undefined) reported, not thrown. Then implement the lib and the script, add the `package.json` entries (`tests/package-scripts.test.js` green), record the missing-page RED (`node scripts/check-seo-21.mjs <empty temp dir>` exit 1), then `pnpm build && pnpm check:seo-21:dist` exit 0 and `pnpm check:seo:dist` green. Scenarios "Built page passes", "Missing page fails", "Contract violations fail", "Run by CI".

### Real-browser / e2e checks (QA)

None in a browser (build-time check, no UI). QA verifies on the PR head: `pnpm build && pnpm check:seo-21:dist` exit 0; a temporary local edit adding a second `<h1>` or a promise phrase to the page makes it exit 1 with the named failure (reverted, never committed); the CI `verify` log of the PR shows `SEO-21` passing.

### Owner-account actions (executed by the orchestrator)

- Search Console URL inspection and indexing request for `https://nuriaromero.dev/seo-para-ia/` after `develop` is promoted to `main` and deployed: **executable owner action** (configured Search Console API first, else the user's signed-in browser in an attended session, else queued in `.claude/state/attended-actions.json`). Not part of this story's Definition of Done; it feeds the M2 exit criterion.
- Search Console baseline (impressions, clicks, position = 0 for "seo para ia", "posicionamiento en ia", "geo seo") recorded after the page is live: **executable owner action** (Search Console API read). Not part of this story.

### ADRs relied on

0005 (checks on `dist/`), 0006 (TDD), 0011 (CI `verify`), 0013 (page contract inputs).

## Risks / Trade-offs

- [The check duplicates parts of NRD-24's unit tests] -> intended: unit tests guard the source, this guards the built HTML that crawlers read.
- [Brittle on markup changes of shared components] -> scoped to `<main>`, title, description and the page's own JSON-LD; the H1 test uses visible text.
- [A legitimate future negated promise ("no te aseguro...")] -> the page wording avoids the pattern; a future story that needs it changes the pattern with its test.
- Size: one work unit for 2 points; no size concern.

## UI spec

No visible UI changes. This story adds a build-time check (`scripts/check-seo-21.mjs`) and its lib and tests; it creates or edits nothing under `src/pages/**`, `src/layouts/**`, `src/components/**`, `src/styles/**` or `tailwind.config.mjs`, so `ux-review` and `a11y-responsive` do not apply. Checklist items 1 to 8 (screens, hierarchy, states, copy, design-system reuse, responsive, interactions, accessibility): n/a.

### UI contract the check protects

The check freezes, on the built `dist/seo-para-ia/index.html`, the visible parts of the page shipped by NRD-24 that a reader sees:

- **Heading hierarchy**: exactly one `<h1>`, whose visible text contains "SEO para IA" (published: "SEO para IA: que ChatGPT, Gemini y Google entiendan tu negocio"). A future layout or component edit that adds a second H1 (for example a heading promoted in a shared hero) fails the build.
- **Byline link**: inside `<main>`, the only occurrence of "consultor" is the byline anchor `<a href="/">consultor SEO en Sevilla</a>`; its visible anchor text must stay exactly "consultor SEO en Sevilla". Rewording the byline or adding "consultor" to visible body copy, the title or the meta description fails the build.
- **Tone of visible copy**: no promise wording (`PROMISE_PATTERN`) in the visible text of `<main>`, the title, the meta description or the FAQ answers. The page keeps stating limits honestly (for example "Nadie puede prometerte...").

These are the existing NRD-24 copy and structure, not new decisions; the check adds no copy to the site.

### Developer-facing output (not site UI)

The script's console output is defined in Decisions and Interfaces (`SEO-21:` prefix, `SEO-21: /seo-para-ia/ contract passed` on success). Assumption: each failure line names the rule and what was found (for example `SEO-21: expected 1 <h1>, found 2`), in English like the other `check-seo-NN` scripts, so a CI log reader can fix the page without opening the script.
