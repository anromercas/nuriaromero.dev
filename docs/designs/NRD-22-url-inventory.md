# NRD-22 - Inventory of every indexable URL: target query, title, H1, indexation, cannibalization, thin and orphan pages

## Why

[NRD-22](https://nuriaromerodev.atlassian.net/browse/NRD-22) (SEO method phase 1, epic NRD-4). Blocked by [NRD-17](https://nuriaromerodev.atlassian.net/browse/NRD-17) (phase 0 baseline and GSC access); blocks [NRD-73](https://nuriaromerodev.atlassian.net/browse/NRD-73) (phase 2 keywords). The intent matrix (`src/data/seo-intents.ts`, `intentMatrix`, `keywordOwners` per ADR 0012) and the hub/spoke map (`src/data/internal-links.ts`, `internalLinksBySource`) were designed from local HTML only. Nobody knows, per URL, which query it targets, whether Google indexes it, which pages compete and which are thin or orphan. Phase 3 (NRD-74) and the page rewrites need that inventory.

Current state (verified on `develop` 6c7b03c):

- The sitemap (`@astrojs/sitemap`, `astro.config.mjs:48`, filter excludes `/components`) currently lists 24 URLs: home, six service pages, four niche pages (parked), `/seo-para-clinicas-capilares-sevilla/` (parked), `/blog/` and four posts, `/recursos/`, `/portfolio/`, `/sobre-mi/`, `/contacto/`, three legal pages. There is no `/casos-de-exito/` route: case studies render inside `/portfolio/` and shared `Projects.astro` (`tests/casos-exito.test.js`). The inventory records that as an observation, it does not create the route.
- Every page has one `<main>` (`ServiceLayout`, `BlogPostLayout`, `LegalLayout`, and `index`, `portfolio`, `recursos`, `blog/index`, `contacto`, `sobre-mi`), so "main content" and "inbound links outside nav/footer" can be measured as text and `<a href>` inside `<main>`.
- `scripts/check-seo-06.mjs` and `check-seo-07.mjs` already parse `dist/` HTML with regular expressions and no dependency; node 24 imports `src/data/*.ts` directly (`tests/keyword-ownership.test.js:4`).
- Search Console is reachable through the read-only service account (`~/.config/claude-seo/run.sh gsc_query|gsc_inspect`, recorded on NRD-17). Raw exports are not committed.

Approach: a small, tested, dependency-free inventory script reads `dist/` and the data files and prints the on-page columns, so 24+ rows are measured, not hand-copied, and phase 3 can re-run it. GSC columns are merged from a JSON export kept outside the repo. The analysis (cannibalization, thin, orphan, mismatches, recommendations) is written by the developer from that output.

## What changes

- `scripts/lib/seo-inventory.mjs` (pure functions) and `scripts/seo-inventory.mjs` (CLI, `pnpm seo:inventory`), with `tests/seo-inventory.test.js`.
- `docs/seo-audit/inventory-2026-11.md`: dated inventory table, cannibalization, thin pages, orphan pages, intent mismatches and phase-3 recommendations, in English with Spanish queries verbatim.

## Out of scope

- Any copy, title, URL, redirect, link or page change; any edit to `seo-intents.ts` or `internal-links.ts` (recommendations only, inputs for NRD-74).
- New stories for findings (phase 3 decides).
- Acting on parked pages (listed and marked "parked" only).
- Committing GSC exports or anything from `~/.config/claude-seo/`.

## Requirements and scenarios

### Requirement: measured on-page columns

`pnpm build && pnpm seo:inventory` SHALL print one row per `<loc>` in `dist/sitemap-0.xml` with: URL, status (`in-focus` | `parked` | `support` | `legal`), intended target query, `<title>`, H1 text (and count), meta description length, canonical, word count of `<main>`, inbound internal links from `<main>` of other pages.

- Target query: the `keywordOwners` keyword(s) whose `url` matches, else the `intentMatrix.topic` for that URL, else `none`.
- Status: `parked` for `nicheRoutes` and `/seo-para-clinicas-capilares-sevilla/`; `legal` for `/aviso-legal/`, `/privacidad/`, `/cookies/`; `in-focus` for `/` and the remaining `serviceRoutes`; else `support`. Checked in that order (`serviceRoutes` also lists the parked capilares page, which stays `parked`).

#### Scenario: page with two H1

- WHEN a page renders two `<h1>`
- THEN its row shows `h1Count: 2` and the text of both

#### Scenario: inbound links outside nav and footer

- WHEN `/recursos/` is linked from `<header>`/`<footer>` of every page but from no other page's `<main>`
- THEN its inbound count is 0 and it is an orphan candidate

#### Scenario: self links and fragments

- WHEN a page links to itself or to `/ruta/#section`
- THEN self links are not counted and fragment/query links count for the path without them

### Requirement: Search Console columns

The table SHALL add, per URL, the URL Inspection coverage state (`gsc_inspect`, capture date) and the top 3 queries with impressions and average position for one 28-day window (`gsc_query`, dimensions `page,query`, web search, Spain and all devices, window as returned by the API). URLs with no data show "N/D".

#### Scenario: no GSC rows

- WHEN a URL has no impressions in the window
- THEN its query cells read "N/D: sin impresiones" and its coverage state is still recorded

#### Scenario: GSC export missing

- WHEN the CLI runs without `--gsc <file>`
- THEN the GSC columns print "N/D" and the on-page columns still print (the script never calls Google itself)

### Requirement: cannibalization

The doc SHALL list every query where two or more URLs have impressions in the window, with clicks, impressions and position per URL, the owner per `keywordOwners` / PRD (home "consultor SEO en Sevilla"; `/seo-local-sevilla/` "SEO local Sevilla" and the NRD-33 head terms) and a recommendation: keep, re-target or re-link, naming the page that should own the query.

#### Scenario: owner ranks behind another page

- WHEN `findCannibalization` returns "seo local sevilla" with `/seo-local-sevilla/` and `/` both receiving impressions
- THEN the row names `/seo-local-sevilla/` as owner and recommends re-link (or re-target) for `/`, with the figures

### Requirement: thin, orphan and mismatch lists

The doc SHALL list thin pages (main word count clearly below the pages that outrank them for its target query, using the competitor evidence already in `.claude/state/seo/2026-11-13.md`, or no unique intent), orphan pages (0 inbound links from `<main>` or absent from the sitemap) and mismatches between `intentMatrix` / `keywordOwners` and the queries Google actually shows for each page, each with its evidence.

#### Scenario: no evidence

- WHEN there is no competitor word count for a page's query
- THEN the page is not called thin on word count; the gap is marked

### Requirement: no site change

`pnpm check:seo-06:dist` and `check:seo-07:dist` SHALL pass unchanged; the diff touches only `scripts/`, `tests/`, `package.json` and `docs/`.

## Files (layer `app`)

| Action | Path                                  | Notes                                                                                                                                |
| ------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| create | `scripts/lib/seo-inventory.mjs`       | pure parsing and aggregation                                                                                                         |
| create | `scripts/seo-inventory.mjs`           | CLI: reads `dist/`, `src/data/seo-intents.ts`, optional `--gsc <file>` and `--inspect <file>`; prints a markdown table (or `--json`) |
| create | `tests/seo-inventory.test.js`         | unit tests with inline HTML/XML fixtures                                                                                             |
| modify | `package.json`                        | `"seo:inventory": "node scripts/seo-inventory.mjs"` (no `npm`, `tests/package-scripts.test.js`)                                      |
| create | `docs/seo-audit/inventory-2026-11.md` | the deliverable                                                                                                                      |
| modify | `docs/seo-audit/README.md`            | one index row linking the inventory                                                                                                  |

## Interfaces

```js
// scripts/lib/seo-inventory.mjs
/** @returns {string[]} pathnames with trailing slash, in sitemap order */
export function parseSitemapPaths(xml, origin = "https://nuriaromero.dev") {}

/**
 * @returns {{ title: string, h1: string[], metaDescriptionLength: number,
 *   canonical: string|null, mainWordCount: number, mainLinks: string[] }}
 * mainLinks: internal pathnames found in <main>, normalised (no query/fragment, trailing slash)
 */
export function parsePage(html) {}

/** @param {Map<string, {mainLinks: string[]}>} pages @returns {Map<string, number>} */
export function countInboundLinks(pages) {}

/** @param {{ keywordOwners, intentMatrix, nicheRoutes, serviceRoutes }} intents */
export function classifyPath(path, intents) {} // -> { status, targetQuery }

/**
 * @param {{ page: string, query: string, clicks: number, impressions: number, position: number }[]} rows
 * @returns {{ query: string, pages: typeof rows }[]} queries with >= 2 distinct pages, by total impressions desc
 */
export function findCannibalization(rows) {}

/** @returns {Map<string, typeof rows>} top N queries per page by impressions */
export function topQueriesByPage(rows, n = 3) {}
```

GSC input files are the JSON written by `run.sh gsc_query --dimensions page,query ...` and `gsc_inspect`, saved in the developer's scratch directory. The CLI normalises page URLs (`https://nuriaromero.dev/x/` -> `/x/`); the exact JSON keys are read from one real export at task 1.2 and adapted in a small `fromGscExport(json)` adapter if they differ from the row shape above.

## Data

None in the product. Documentation and a dev script only; no runtime dependency.

## Test plan (TDD order)

1. Task 1.1 - `tests/seo-inventory.test.js` (RED): `parseSitemapPaths` on a 3-URL fixture; `parsePage` for title, two H1, meta description length (characters, entities decoded), canonical, words in `<main>` only (scripts, styles and tags excluded), links in `<main>` only with self/fragment/query normalisation; `countInboundLinks` ignores self links and header/footer links; `classifyPath` for a service, a niche, a legal page and a blog post (`targetQuery` from `keywordOwners` before `intentMatrix.topic`); `findCannibalization` keeps only queries with two or more distinct pages, sorted by impressions; `topQueriesByPage`. GREEN, then the CLI; `pnpm build && pnpm seo:inventory` prints 24 rows.
2. Task 1.2 - data capture and the inventory table; `node --test tests/*.test.js` green.
3. Tasks 1.3-1.4 - analysis sections; `pnpm check:seo-06:dist` and `check:seo-07:dist` green.

## Real-browser / e2e checks

None (no UI change). QA spot-checks three rows (title, H1, word count) against the built HTML and one cannibalization row against the export summary in the doc.

## Risks

- **Script size.** About 150 lines with tests; it keeps the 24-row table honest and is reusable by phase 3 and later re-inventories. It fits 5 points together with the analysis because GSC access is ready.
- **Phase-0 dependency.** NRD-17 provides the access and the KPI window; the inventory can use its own 28-day window (dated) if NRD-17's refreshed baseline is not merged yet. The Blocks link stays for the method order.
- **URL Inspection quota.** 24 inspections, far under the daily API quota.
- **Data freshness.** The last 2-3 days are not consolidated in GSC; the doc states the exact window returned.
- **Worktree inputs.** `.claude/state/seo/*` and `seo/ranks/history.jsonl` are untracked and exist only in the main checkout; read them from there, never copy them into the branch.

## ADRs

0003 (single app layer, `src/data` as source of truth), 0005 (build-time SEO checks), 0006 (node:test and TDD), 0012 (keyword ownership registry).

## Tasks

- [x] 1.1 [NRD-86 app] Build the dependency-free inventory helper and `pnpm seo:inventory` CLI over `dist/` and `src/data/seo-intents.ts`; tests: `tests/seo-inventory.test.js` first.
- [ ] 1.2 [NRD-87 app] Capture GSC page-query rows (28 days) and URL Inspection states, run the CLI and write the dated inventory table in `docs/seo-audit/inventory-2026-11.md`; tests: unit suite green.
- [ ] 1.3 [NRD-88 app] Write the cannibalization section (queries with two or more URLs, figures, owner, keep/re-target/re-link); tests: unit suite green.
- [ ] 1.4 [NRD-89 app] Write the thin, orphan and intent-mismatch sections and the phase-3 recommendations; tests: `check:seo-06:dist`, `check:seo-07:dist` green.
