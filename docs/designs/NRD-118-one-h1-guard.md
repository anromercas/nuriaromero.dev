# NRD-118 - One-H1 guard for every built page

## Why

[NRD-118](https://nuriaromerodev.atlassian.net/browse/NRD-118) (gap G5 of NRD-75, `docs/seo-audit/technical-follow-up.md` "Huecos", epic NRD-4). Hardening, not a defect: every built page has exactly one `<h1>` today (25 of 25 HTML files in `dist/`, counted read-only by the Tech Lead on the 2026-11-15 build). Phase-5 stories rewrite the H1 of `/seo-local-sevilla/`, `/diseno-web-sevilla/`, `/` and other owner pages, and only `/seo-local-sevilla/` is guarded (`scripts/check-seo-15.mjs:9`). Invariant "One H1 per page" (`.claude/harness/invariants.md`) is enforced by review only.

## What changes

- New pure helper `scripts/lib/one-h1.mjs`: counts `<h1>` start tags in a page, ignoring comments, `<script>`, `<style>` and `<template>` content.
- `scripts/check-seo-02.mjs`: inside its existing loop over every HTML file in `dist/` (lines 411-444), one more failure when the count is not exactly 1.
- Unit tests with fixtures (`tests/one-h1.test.js`).

## Out of scope

- A new `check-seo-16.mjs`: rejected (see Decisions) to avoid new `package.json` scripts and an edit of NRD-112's aggregate.
- Removing the per-page assertion in `check-seo-15.mjs:9` (it stays as the page-specific guard).
- Any page change.

## Requirements and scenarios

### Requirement: every built HTML page has exactly one `<h1>`

`scripts/check-seo-02.mjs` SHALL fail (`process.exitCode = 1`, its existing mechanism) for each HTML file under `dist/` whose `countH1` is not 1, with the message `<relative file>: expected exactly one <h1>, found <n>`.

#### Scenario: page with two H1

- WHEN a fixture page has `<h1>Uno</h1>` in the hero and `<h1>Dos</h1>` in a section
- THEN `countH1` returns 2 and the page is reported

#### Scenario: page with no H1

- WHEN a fixture page has only H2 headings
- THEN `countH1` returns 0 and the page is reported

#### Scenario: markup that is not a heading

- WHEN a fixture has `<!-- <h1>old</h1> -->`, a `<script>` containing the string `"<h1>"`, a `<header>` element and `<h10>`-like text, plus one real `<H1 class="kw">`
- THEN `countH1` returns 1 (case-insensitive tag, `<header>` is not `<h1>`, comments and script/style/template bodies are ignored)

#### Scenario: current build

- WHEN `pnpm build && pnpm check:seo-02:dist` runs on this branch
- THEN it passes, including the private report under `dist/informes/` (it has one `<h1>` and no `<main>`; the rule counts the whole document, so no exemption is needed)

## Files

| Layer | Action | Path                       | Notes                                                                             |
| ----- | ------ | -------------------------- | --------------------------------------------------------------------------------- |
| `app` | create | `scripts/lib/one-h1.mjs`   | pure helper (task 1.1)                                                            |
| `app` | create | `tests/one-h1.test.js`     | fixture tests (task 1.1)                                                          |
| `app` | modify | `scripts/check-seo-02.mjs` | import the helper; one `addFailure` in the per-file loop; summary text (task 1.2) |

## Interfaces

```js
// scripts/lib/one-h1.mjs
/** Number of <h1> start tags outside comments and <script>/<style>/<template> bodies. Regex: /<h1(?=[\s>\/])/gi after stripping. */
export function countH1(html) {}
```

Decisions:

- **Rule in `check-seo-02.mjs`, not a new `check-seo-16.mjs`.** The acceptance criterion allows either. `check-seo-02` already reads every built HTML file in one loop and is part of NRD-112's `check:seo:dist` aggregate, so the guard runs in CI with no new script, no `package.json` change and no edit to the aggregate or to `tests/package-scripts.test.js`.
- The success line of `check-seo-02` gains `; every page has exactly one <h1>` so the run output shows the rule ran.

## Data

None.

## Test plan (TDD order)

1. Task 1.1, `tests/one-h1.test.js` (RED: module missing): two H1 -> 2; none -> 0; the "markup that is not a heading" fixture -> 1; a minimal real page shape (head, header, main with one H1, footer) -> 1. Then the helper (GREEN).
2. Task 1.2, `scripts/check-seo-02.mjs`: call `countH1(html)` in the existing `for (const file of htmlFiles)` loop. Proof: `pnpm build && node scripts/check-seo-02.mjs` green; one local negative run (temporarily duplicate the `<h1>` in `src/components/seo-local/SeoLocalHero.astro` or add one to `src/pages/sobre-mi.astro`, rebuild, see the message, restore; never commit). Record outputs in the subtask comment.
3. `node --test tests/*.test.js` green after each task.

## Real-browser / e2e checks

None: no rendered output changes.

## Risks

- **Overlap with NRD-115.** NRD-115 adds a breadcrumb trailing-slash rule to `scripts/check-seo-02.mjs`. Both edits are additions in different places (this one inside the per-file loop plus one import and the summary line); whichever lands second rebases. No order dependency.
- **Overlap with NRD-112.** None in files (no `package.json` edit). The guard runs in CI once NRD-112 is merged (existing `Blocks` link NRD-112 -> NRD-118).
- **Later stories.** NRD-120 (step 1) and every page story after it must keep one H1; this rule is what blocks them from shipping two.

## ADRs

- Relies on [0005](../adr/0005-sitemap-robots-llms-and-seo-checks.md), [0006](../adr/0006-testing-node-test-and-tdd.md); invariant "One H1 per page". No new ADR.

## Tasks

- [ ] 1.1 [NRD-137 app] Add `scripts/lib/one-h1.mjs` (`countH1`); tests: `tests/one-h1.test.js` fixtures first (RED), then the helper (GREEN).
- [ ] 1.2 [NRD-138 app] Fail `scripts/check-seo-02.mjs` for any built page without exactly one `<h1>`; tests: `node --test tests/*.test.js`, `pnpm build`, `check-seo-02` green plus one local negative run recorded.
