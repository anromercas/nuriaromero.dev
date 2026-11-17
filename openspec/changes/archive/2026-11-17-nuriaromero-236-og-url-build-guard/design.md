# Design

## Context

See proposal.md (Why). Current state on `develop` (a227f03):

- `src/components/seo/SEO.astro:27` renders `<link rel="canonical" href={canonical} />` and `:32` `<meta property="og:url" content={canonical} />`, both only when `!noindex`; `:28` renders `<meta name="robots" content="noindex, nofollow" />` when `noindex`.
- `public/informes/centro-amara-9a50b0fdb3cb/index.html` is copied verbatim to `dist/`, with `<meta name="robots" content="noindex,nofollow">` (no space) and neither canonical nor `og:url`.
- Today's build has 26 HTML files: 24 indexable (all with `og:url` equal to their canonical, trailing slash) and 2 `noindex` (`404.html`, the report). The new check passes on the current build.
- `scripts/check-seo-19.mjs` owns the 404 contract; its walker only visits `index.html` files. `tests/not-found-page.test.js` asserts `check:seo:dist` ends with `check-seo-19`, which must change once `check-seo-20` is chained after it.
- CI runs `node --test` before the build, so tests that read `dist/` skip there; enforcement on real output must be a `check-seo-NN` script.

## Goals / Non-Goals

**Goals:** a CI-enforced guard over every built page; a unit-tested pure rule demonstrating both failure modes in the AC; no published HTML change.

**Non-Goals:** other social tags; refactoring `check-seo-19`.

## Decisions

**Approach.** Put the rule in a pure function `ogUrlProblems(html)` in `scripts/lib/og-url.mjs` (same pattern as `scripts/lib/one-h1.mjs`), and a thin `scripts/check-seo-20.mjs` that walks all `*.html` under `dist/` (not only `index.html`, so `404.html` is included), collects problems per relative path, prints them and exits 1. A new numbered check rather than extending `check-seo-19` keeps the 404 contract separate from a site-wide head rule and follows the one-check-per-concern convention (ADR 0005). Tags are found tolerantly of attribute order, comments and `<script>/<style>` bodies are stripped first, so JSON-LD or inline text never counts.

**Files** (all layer `app`):

- Create `scripts/lib/og-url.mjs`.
- Create `scripts/check-seo-20.mjs`.
- Create `tests/og-url-guard.test.js`.
- Modify `package.json` (scripts `check:seo-20`, `check:seo-20:dist`, and `check:seo:dist` chain).
- Modify `tests/not-found-page.test.js` (the "package.json declares the check-seo-19 pair and chains it last" test: assert the chain includes ` && node scripts/check-seo-19.mjs` instead of ending with it; rename the test accordingly).

**Interfaces.**

```js
// scripts/lib/og-url.mjs
/** True when a robots meta contains noindex (with or without spaces). */
export function isNoindex(html) /* : boolean */;
/**
 * Problems of one built page with its og:url and canonical; [] when valid.
 * Indexable: exactly one og:url, exactly one canonical, equal, absolute (https://), ending in "/".
 * Noindex: no og:url and no canonical.
 */
export function ogUrlProblems(html) /* : string[] */;
```

`scripts/check-seo-20.mjs`: no exports; prints `check-seo-20: <relative path>: <problem>` per problem and exits 1; exits 1 too when `dist/` has no HTML or no indexable page; on success prints `check-seo-20: og:url ok on <n> indexable pages, absent on <m> noindex pages`.

**Data.** None.

**Test plan (TDD order).** In `tests/og-url-guard.test.js` (import `../scripts/lib/og-url.mjs`), RED first (module missing):

1. A synthetic service page (`https://nuriaromero.dev/seo-local-sevilla/` as canonical and `og:url`) has no problems (scenario "Indexable pages keep their canonical").
2. The same page without `og:url` reports a missing `og:url` (scenario "Removing og:url from a service page fails the guard").
3. `og:url` different from the canonical, a duplicated `og:url`, and a URL without trailing slash each report a problem (scenario "og:url appears once with a trailing slash").
4. A synthetic noindex 404 (`content="noindex, nofollow"`, no canonical, no `og:url`) has no problems; the same with `content="noindex,nofollow"` too (report page form).
5. The 404 with an added `og:url` reports it; the 404 with a canonical reports it (scenarios "Adding og:url to the 404 fails the guard", "Noindex pages omit og:url").
6. An `og:url` string inside a `<script type="application/ld+json">` body is ignored.
7. `package.json` declares `check:seo-20` = `pnpm build && node scripts/check-seo-20.mjs`, `check:seo-20:dist` = `node scripts/check-seo-20.mjs`, `check:seo:dist` ends with ` && node scripts/check-seo-20.mjs`, and the script file exists (scenario "Every built page is guarded").
8. Built (skip without `dist/index.html`): every `*.html` under `dist/` has no problems and at least one is indexable.

Then update `tests/not-found-page.test.js`, implement the helper, the script and the `package.json` entries; `node --test tests/*.test.js`, `pnpm build`, `pnpm check:seo:dist` green. Optionally confirm the guard by hand: temporarily delete the `og:url` line from a built `dist/seo-local-sevilla/index.html` and run `pnpm check:seo-20:dist` (fails), then rebuild.

**Real-browser / e2e checks (QA).** None in a browser (no published change). QA runs `pnpm build && pnpm check:seo:dist` and confirms the `check-seo-20` line reports 24 or more indexable and 2 noindex pages, and that `git diff develop -- src/` is empty.

**ADRs relied on.** 0004 (SEO head through `SEO.astro`), 0005 (sitemap, robots, llms and SEO checks), 0006 (node:test and TDD), 0011 (CI verify workflow runs `check:seo:dist`).

## Risks / Trade-offs

- A future static HTML file in `public/` without robots meta and without canonical would fail as indexable. Intended: either it gets a canonical through a layout or it is explicitly `noindex`.
- Regex parsing of built HTML instead of a DOM parser: consistent with the other `check-seo-*` scripts and adds no dependency; Astro's output is regular enough.

## UI spec

### No visible UI change

This story adds a build-time check (`scripts/lib/og-url.mjs`, `scripts/check-seo-20.mjs`), tests and `package.json` scripts only. No page, layout, component, style, client script, public asset or site copy changes, so there is nothing new for a visitor to see or use.

### What must stay unchanged

- No file under `src/` or `public/` is touched; `git diff develop -- src/ public/` is empty.
- `src/components/seo/SEO.astro` keeps its current head output: canonical (`:27`) and `og:url` (`:32`) only on indexable pages, `<meta name="robots" content="noindex, nofollow" />` (`:28`) on noindex pages.
- The built HTML of every page in `dist/` is unchanged against a `develop` build (same head tags, markup and copy) (24 indexable pages, 2 noindex: `404.html` and `informes/centro-amara-9a50b0fdb3cb/index.html`). In particular the 404 page keeps its layout, copy and links exactly as shipped in NRD-230.
- The Spanish site copy, design tokens (`tailwind.config.mjs`), global styles and components are untouched.

### Checklist

1. Screens and layout: n/a (no screen changes).
2. Hierarchy: n/a.
3. States: n/a for the site. The only "states" are the check's console outcomes, fixed by the Interfaces section above (`check-seo-20: <relative path>: <problem>` and exit 1 on failure; the `og:url ok on <n> indexable pages, absent on <m> noindex pages` line on success).
4. Copy: no site copy. Console messages of the check are developer-facing and in English, like the other `check-seo-*` scripts. Assumption: problem strings inside `ogUrlProblems` are free-form English sentences chosen by the developer (for example "missing og:url", "og:url differs from canonical"), since only tests and CI logs read them and no acceptance criterion fixes their wording.
5. Design system reuse: n/a (no UI built).
6. Responsive: n/a.
7. Interactions: n/a.
8. Accessibility hand-off: n/a; `ux-review` and `a11y-responsive` paths are not touched, so neither specialist should be triggered by this change.
