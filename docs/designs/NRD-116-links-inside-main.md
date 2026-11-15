# NRD-116 - check-seo-06 and check-seo-07 prove the link inside `<main>`

## Why

[NRD-116](https://nuriaromerodev.atlassian.net/browse/NRD-116) (gap G3 of NRD-75, `docs/seo-audit/technical-follow-up.md` "Huecos", epic NRD-4). Phase-5 step 0 (NRD-119) adds 7 contextual link rows and 3 reciprocal pairs from ADR 0013 tables A and D. Today `scripts/check-seo-06.mjs:61-62` tests `html.includes('href="<path>"')` and `html.includes(anchor)` as two independent whole-page tests, and `scripts/check-seo-07.mjs:238-243` does the same for `reciprocalLinks`. Header and Footer already contain `/portfolio/`, `/diseno-web-sevilla/`, `/desarrollo-software-medida/` and `/seo-local-sevilla/`, so a page could lose its contextual link and still pass. The rule must tie the `href` to the anchor text and to `<main>`.

## What changes

- New pure helper `scripts/lib/main-links.mjs`: extracts the `<main>` block(s) of a page and answers "is there an `<a>` with exactly this `href` whose visible text contains this anchor, inside `<main>`".
- `scripts/check-seo-06.mjs`: each `internalLinksBySource` row uses the helper instead of the two `includes` calls. The "target exists" check, the "at least two links per source" check and the site-wide "every trailing-slash href resolves" walk stay as they are.
- `scripts/check-seo-07.mjs`: each `reciprocalLinks` pair uses the helper in both directions.
- Unit tests with fixtures for the helper (`tests/main-links.test.js`).

## Out of scope

- Adding the ADR 0013 rows (NRD-119), trailing-slash rules (NRD-113 G1a, NRD-114 `/contacto/`, NRD-115 breadcrumbs), keyword ownership (NRD-117), one-H1 (NRD-118).
- CI wiring: NRD-112 runs every `check-seo-NN` through `check:seo:dist`; this story adds no script and does not touch `package.json`.
- Any page, component or data change. If a current row fails the new rule, that is a finding for the PO, not something to fix silently (it does not today, see Risks).

## Requirements and scenarios

### Requirement: internal-link rows are proven inside `<main>`

For every row `{ path, anchor }` of `internalLinksBySource[source]`, `scripts/check-seo-06.mjs` SHALL require at least one `<a>` element inside the `<main>` element of the built `source` page whose `href` attribute equals `path` exactly and whose visible text (tags stripped, HTML entities decoded, whitespace collapsed) contains `anchor`. Otherwise it MUST report `<source> -> <path>: no <a href="<path>"> containing "<anchor>" inside <main>` and exit non-zero.

#### Scenario: link only in the header or footer

- WHEN the source page has `<a href="/portfolio/">casos de éxito ...</a>` only inside `<header>` or `<footer>`
- THEN the helper returns false and check-seo-06 fails for that row

#### Scenario: anchor text present but not as the text of that link

- WHEN `<main>` contains the anchor string as plain text and an `<a href="<path>">` with different text
- THEN the helper returns false and the check fails

#### Scenario: anchor text with nested markup or entities

- WHEN `<main>` contains `<a class="x" href="/seo-local-sevilla/"><span>SEO local</span> y GEO &amp; más</a>` and the anchor is `SEO local y GEO & más`
- THEN the helper returns true

#### Scenario: current build

- WHEN `pnpm build && pnpm check:seo-06:dist` runs on this branch
- THEN it passes (all 73 rows and pair directions were verified inside `<main>` on the 2026-11-15 build by the Tech Lead, read-only)

### Requirement: reciprocal pairs are proven inside `<main>` in both directions

For every `reciprocalLinks` pair, `scripts/check-seo-07.mjs` SHALL apply the same rule twice: on `source`, a link to `target` containing `sourceAnchor`; on `target`, a link to `source` containing `targetAnchor`. The existing messages (`<page>: missing reciprocal anchor "<anchor>" to <other>`) are kept, suffixed with `inside <main>`.

#### Scenario: one direction disappears from `<main>`

- WHEN `/tienda-online-sevilla/` keeps `/web-para-comercios-sevilla/` only in the footer
- THEN check-seo-07 fails naming `/tienda-online-sevilla/` and the anchor

#### Scenario: current build

- WHEN `pnpm check:seo-07:dist` runs on this branch
- THEN it passes

### Requirement: pages with more than one `<main>` or none

The helper SHALL consider every `<main>...</main>` block of the page (as `getSections(html, "main")` in `check-seo-02.mjs:287`). A page with no `<main>` has no contextual links: every row on it fails.

#### Scenario: source without `<main>`

- WHEN the fixture page has no `<main>` element
- THEN `linkInMain` returns false

## Files

| Layer | Action | Path                         | Notes                                                                           |
| ----- | ------ | ---------------------------- | ------------------------------------------------------------------------------- |
| `app` | create | `scripts/lib/main-links.mjs` | pure helper, no dependency, ES module (task 1.1)                                |
| `app` | create | `tests/main-links.test.js`   | fixture tests for the helper (task 1.1)                                         |
| `app` | modify | `scripts/check-seo-06.mjs`   | lines 61-62 replaced by one `linkInMain` call, message above (task 1.2)         |
| `app` | modify | `scripts/check-seo-07.mjs`   | reciprocal loop (lines 235-244) uses `linkInMain` in both directions (task 1.2) |

## Interfaces

```js
// scripts/lib/main-links.mjs
/** Concatenated inner HTML of every <main> element; "" when none. */
export function mainContent(html) {}

/** Visible text: tags stripped, entities decoded (reuse decodeEntities from ./seo-inventory.mjs), whitespace collapsed, trimmed. */
export function visibleText(html) {}

/** [{ href, text }] for every <a ...>...</a> in the given HTML; href read from a double- or single-quoted attribute, null when absent. */
export function anchorsIn(html) {}

/** true when <main> holds an <a> whose href === path and whose visibleText includes anchor. */
export function linkInMain(html, path, anchor) {}
```

Decisions:

- Reuse `decodeEntities` from `scripts/lib/seo-inventory.mjs` (already exported and tested); do not copy it.
- `href` equality is exact (no trailing-slash normalization): the rows and the rendered links come from the same data (`InternalLinks.astro`, `SeoLocalRelated.astro`), so normalizing would hide a real data/render mismatch, and trailing slashes are NRD-113/114's rules.
- Anchor matching is a case-sensitive substring of the visible text, like today's `html.includes(anchor)`, so no existing row changes meaning.
- Nested `<a>` is invalid HTML; the regex `<a\b[^>]*>[\s\S]*?</a>` is enough for Astro output (same approach as `seo-inventory.mjs`).

## Data

None. No schema, storage, settings or env change.

## Test plan (TDD order)

1. Task 1.1, `tests/main-links.test.js` (RED: module missing), fixtures inline as template strings:
   - header-only link -> `linkInMain` false (scenario "link only in the header or footer");
   - footer-only link -> false;
   - anchor text in `<main>` as plain text plus an `<a>` with the right href but other text -> false (scenario "anchor text present but not as the text of that link");
   - right text on an `<a>` with another href -> false;
   - nested span and `&amp;` -> true (scenario "nested markup or entities");
   - single-quoted href -> true;
   - two `<main>` blocks, link in the second -> true; no `<main>` -> false.
     Then the helper (GREEN).
2. Task 1.2, `scripts/check-seo-06.mjs` and `scripts/check-seo-07.mjs` import the helper. Proof of the wiring: `pnpm build`, then `node scripts/check-seo-06.mjs` and `node scripts/check-seo-07.mjs` green; one local negative run (temporarily edit one anchor in `src/data/internal-links.ts` so only the header still links that path, rebuild, see the new message, restore; never commit it). Record both outputs in the subtask comment.
3. `node --test tests/*.test.js` green after each task.

## Real-browser / e2e checks

None: no rendered output changes. QA reads the check output on the PR's `verify` run (once NRD-112 is merged) or runs `pnpm build && pnpm check:seo-06:dist && pnpm check:seo-07:dist`.

## Risks

- **File overlap and order with NRD-113 and NRD-114.** Both add a rule to `scripts/check-seo-06.mjs` (and NRD-113 a test in `tests/trailing-slash-links.test.js`); NRD-114 also changes the `/contacto` rows of `src/data/internal-links.ts` to `/contacto/`. Recommended landing order: NRD-113, NRD-114, then this story (ADR 0013 / NRD-75 order: G1a before G3). Whichever lands second rebases on `develop`; the edits sit in different blocks (this story: the row loop at lines 50-64; NRD-113/114: the rendered-href walk or a new block), so conflicts are textual only. Because `href` equality is exact and both the row and the rendered link change together in NRD-114, the new rule stays green in either order.
- **File overlap with NRD-117.** NRD-117 appends a keyword-ownership block to `scripts/check-seo-07.mjs`; this story edits the reciprocal loop. Independent blocks; no order needed.
- **NRD-112 aggregate.** No new check file, so `tests/package-scripts.test.js` (NRD-112) needs no change.
- **Stricter rule, same data.** Verified read-only on the 2026-11-15 build: 73 of 73 row and pair directions already sit inside `<main>` with their anchor as link text. If the developer's build differs, report the failing row to the PO rather than editing copy here.

## ADRs

- Relies on [0005](../adr/0005-sitemap-robots-llms-and-seo-checks.md) (`check-seo-NN` contract), [0006](../adr/0006-testing-node-test-and-tdd.md) (node:test, TDD), [0013](../adr/0013-seo-site-architecture.md) (link rule 6: reciprocal pairs guarded by `check-seo-07`). No new ADR: a stricter assertion inside existing checks.

## Tasks

- [x] 1.1 [NRD-133 app] Add `scripts/lib/main-links.mjs` (`mainContent`, `visibleText`, `anchorsIn`, `linkInMain`); tests: `tests/main-links.test.js` fixtures first (RED), then the helper (GREEN).
- [ ] 1.2 [NRD-134 app] Use `linkInMain` in `scripts/check-seo-06.mjs` rows and `scripts/check-seo-07.mjs` reciprocal pairs; tests: `node --test tests/*.test.js`, `pnpm build`, both checks green plus one local negative run recorded.
