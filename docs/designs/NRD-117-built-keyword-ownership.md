# NRD-117 - Keyword ownership enforced on the built pages

## Why

[NRD-117](https://nuriaromerodev.atlassian.net/browse/NRD-117) (gap G6 of NRD-75, `docs/seo-audit/technical-follow-up.md` "Huecos", epic NRD-4; rule of ADR 0012 extended by ADR 0013 table C). `keywordOwners` in `src/data/seo-intents.ts` records one owner page per head term, but `tests/keyword-ownership.test.js:17-55` checks only the registry's shape. Nothing iterates the registry over the built pages, so a phase-5 rewrite could start a second page targeting a registered term in its `<title>`, H1 or H2 and nobody would notice. Step 0 (NRD-119) doubles the registry from 5 to 10 terms and must land with this guard in place.

## What changes

- New pure helper `scripts/lib/keyword-ownership.mjs`: term normalization, extraction of the targeted texts of a page (title, every H1, every H2) with the one named `/blog/` listing exemption, and the violation finder over a set of pages.
- `scripts/check-seo-07.mjs` (the intent check, which already imports `seo-intents.ts`): a new block walks every built HTML file under `dist/`, maps it to its route and fails on each violation.
- `tests/keyword-ownership.test.js`: fixture tests for the helper (new tests appended; the three existing tests are untouched, including the exact-set assertion that NRD-119 updates).

## Out of scope

- Registering the five ADR 0013 table C terms (NRD-119) and updating the exact-set assertion at `tests/keyword-ownership.test.js:22-28` (NRD-119).
- Changing any page copy. ADR 0012: a pre-existing overlap is reported to the PO, never fixed silently.
- A new `check-seo-16` script or `package.json` change (the rule lives in `check-seo-07`, already in NRD-112's aggregate).
- Connector-tolerant matching (see Risks: the home H2 "Posicionamiento web en Sevilla: cómo trabajo"). The acceptance criterion defines the normalization as lowercase plus folded accents; this story implements exactly that.

## Requirements and scenarios

### Requirement: only the owner targets a registered term

For every row `{ keyword, url }` of `keywordOwners`, `scripts/check-seo-07.mjs` SHALL fail when any built page under `dist/` whose route is not `url` contains `normaliseTerm(keyword)` as a substring of `normaliseTerm(text)` for its `<title>` text, any H1 text or any H2 text. `normaliseTerm` lowercases, folds diacritics (NFD, drop `\p{Diacritic}`), replaces every run of non-letter/non-digit characters with one space and trims. The message names keyword, owner, offending route, element and text: `keyword "<k>" (owner <url>) is targeted by <route> in <title|h1|h2>: "<text>"`.

#### Scenario: a second page uses a registered term in an H2

- WHEN a fixture set has `/seo-local-sevilla/` as owner of `agencia seo sevilla` and `/diseno-web-sevilla/` has `<h2>Agencia SEO Sevilla para tu web</h2>`
- THEN `findOwnershipViolations` returns one violation for `/diseno-web-sevilla/`, element `h2`

#### Scenario: accents, case and punctuation do not hide a match

- WHEN the term is `diseño tienda online sevilla` and another page's title is `Diseno tienda online, Sevilla`
- THEN it is a violation

#### Scenario: the owner itself is never a violation

- WHEN `/seo-local-sevilla/` has `<h1>SEO local Sevilla</h1>`
- THEN there is no violation for `seo local sevilla`

#### Scenario: body text does not count

- WHEN another page mentions `seo local sevilla` in a `<p>` or an H3
- THEN there is no violation

#### Scenario: current build with today's five terms

- WHEN `pnpm build && pnpm check:seo-07:dist` runs on this branch
- THEN it passes (verified read-only on the 2026-11-15 build by the Tech Lead: no page other than the owner carries any of the five terms in title, H1 or H2)

### Requirement: the `/blog/` listing exemption is one named rule

On the `/blog/` listing page only, H2 elements that sit inside a post card link (`<a href="/blog/<slug>">` or `<a href="/blog/<slug>/">`) SHALL be ignored, because a listing repeating its posts' titles does not target them (PO decision 2026-11-15 on NRD-75 "Observations for the PO"). The exemption MUST be a single named constant/function with a comment citing that decision; the listing page's `<title>`, H1 and any H2 outside a card link are still checked.

#### Scenario: card heading repeats a registered post title

- WHEN `/blog/` has `<a href="/blog/como-aparecer-en-google-maps-negocio-sevilla/"><h2>Cómo aparecer en Google Maps si tienes un negocio en Sevilla</h2></a>` and `como aparecer en google maps` is owned by the post
- THEN there is no violation

#### Scenario: same heading outside a card link

- WHEN `/blog/` has that H2 outside any `/blog/<slug>` link, or the same card markup appears on another route
- THEN it is a violation

#### Scenario: card link without trailing slash

- WHEN the card link is `href="/blog/<slug>"` (today, before NRD-113) or `href="/blog/<slug>/"` (after NRD-113)
- THEN both are exempt

### Requirement: the rule follows the registry

The rule SHALL read `keywordOwners` at run time and contain no term list of its own, so the five rows NRD-119 adds are covered without editing the rule.

#### Scenario: registry grows

- WHEN a fixture registry has a sixth term owned by a fixture page
- THEN the finder checks it with no code change

## Files

| Layer | Action | Path                                | Notes                                                                                      |
| ----- | ------ | ----------------------------------- | ------------------------------------------------------------------------------------------ |
| `app` | create | `scripts/lib/keyword-ownership.mjs` | pure helper (task 1.1)                                                                     |
| `app` | modify | `tests/keyword-ownership.test.js`   | append fixture tests; existing tests untouched (task 1.1)                                  |
| `app` | modify | `scripts/check-seo-07.mjs`          | new block after the reciprocal loop, before the error report; summary line counts it (1.2) |

## Interfaces

```js
// scripts/lib/keyword-ownership.mjs
export function normaliseTerm(text) {} // lowercase, NFD + strip \p{Diacritic}, non [\p{L}\p{N}] runs -> " ", trim

/** Route of a built file relative to dist/: "index.html" -> "/", "blog/index.html" -> "/blog/", "a/b/index.html" -> "/a/b/". */
export function routeOf(relativeFile) {}

// PO decision 2026-11-15 (NRD-75 "Observations for the PO"): a listing page that
// repeats its posts' titles in card headings does not target those titles.
export const LISTING_CARD_EXEMPTION = {
  route: "/blog/",
  cardHref: /^\/blog\/[^/"']+\/?$/,
};

/** { title: string, h1: string[], h2: string[] } as visible text (tags stripped, entities decoded); applies LISTING_CARD_EXEMPTION to h2 when route matches. */
export function targetedTexts(html, route) {}

/**
 * @param {Map<string, string>} pages route -> html
 * @param {{ keyword: string, url: string }[]} owners
 * @returns {{ keyword, owner, route, element: "title"|"h1"|"h2", text }[]}
 */
export function findOwnershipViolations(pages, owners) {}
```

Decisions:

- Placed in `check-seo-07.mjs`, not in the unit suite: `tests/*.test.js` run before `pnpm build` in CI (`ci.yml`), so a test over `dist/` would fail or be skipped there. The unit suite proves the logic on fixtures; the check proves it on the real build (CI step from NRD-112).
- Reuse `decodeEntities` from `scripts/lib/seo-inventory.mjs`.
- The exemption strips card-link blocks (`<a\b[^>]*href="..."[^>]*>[\s\S]*?</a>` whose href matches `cardHref`) from the HTML before collecting H2 on `/blog/` only; nothing else is exempt.
- `/informes/**` is scanned like any page (it carries no registered term); no exemption needed.

## Data

None. No schema, storage, settings or env change. Reads `keywordOwners` only.

## Test plan (TDD order)

1. Task 1.1, `tests/keyword-ownership.test.js` (RED: module missing), new `test(...)` blocks after the existing three:
   - second page with the term in an H2 -> one violation (scenario "a second page uses a registered term in an H2");
   - title with `Diseno tienda online, Sevilla` -> violation (accents/punctuation);
   - owner page -> none; term only in `<p>` and `<h3>` -> none;
   - `/blog/` card H2 inside `<a href="/blog/x/">` and inside `<a href="/blog/x">` -> none; same H2 outside a card link on `/blog/` -> violation; card markup on `/recursos/` -> violation;
   - a sixth fixture term is checked (registry-driven);
   - `routeOf` maps the three path shapes.
     Then the helper (GREEN).
2. Task 1.2, `scripts/check-seo-07.mjs`: walk `dist/` (same recursive walk as `check-seo-06.mjs:66-74`), build the `Map`, push each violation into `errors`, extend the success line with `and <n> keyword owners checked on <m> pages`. Proof: `pnpm build && node scripts/check-seo-07.mjs` green; one local negative run (temporarily put "SEO local Sevilla" in an H2 of `/diseno-web-sevilla/`, rebuild, see the violation, restore; never commit). Record outputs in the subtask comment.
3. `node --test tests/*.test.js` green after each task.

## Real-browser / e2e checks

None: no rendered output changes. QA reads the `check-seo-07` output (`verify` once NRD-112 is merged, or `pnpm build && pnpm check:seo-07:dist`).

## Risks

- **Literal matching misses natural phrasing; one pre-existing case for the PO.** With connector words ("en", "de") the home `/` has the H2 "Posicionamiento web en Sevilla: cómo trabajo", which works `posicionamiento web sevilla` (owner `/seo-local-sevilla/`). The literal rule of the acceptance criterion does not flag it, and `tests/seo-meta-titles.test.js:132` currently requires the home to carry "posicionamiento web en Sevilla" in an h2/h3 (an earlier decision). Making the rule connector-tolerant would turn the check red today until the home H2 changes, so it is a PO decision (candidate: phase-5 step 3, the home story), reported, not applied here.
- **Overlap with NRD-119.** NRD-119 edits `tests/keyword-ownership.test.js` lines 22-28 and adds the five terms; this story appends tests to the same file and must land first (existing `Blocks` link NRD-117 -> NRD-119). With NRD-119's terms, the 2026-11-15 build shows only the two `/blog/` card headings (exempt by this rule).
- **Overlap with NRD-116.** NRD-116 edits the reciprocal loop of `scripts/check-seo-07.mjs`; this story appends a new block after it. Independent; whichever lands second rebases.
- **NRD-112 aggregate.** No new check file, no `package.json` change.

## ADRs

- Relies on [0012](../adr/0012-keyword-ownership-registry.md) (one owner per head term; title, H1, H2), [0013](../adr/0013-seo-site-architecture.md) (table C), [0005](../adr/0005-sitemap-robots-llms-and-seo-checks.md), [0006](../adr/0006-testing-node-test-and-tdd.md). No new ADR: enforces ADR 0012 as written.

## Tasks

- [ ] 1.1 [NRD-135 app] Add `scripts/lib/keyword-ownership.mjs` (`normaliseTerm`, `routeOf`, `LISTING_CARD_EXEMPTION`, `targetedTexts`, `findOwnershipViolations`); tests: fixture tests appended to `tests/keyword-ownership.test.js` first (RED), then the helper (GREEN).
- [ ] 1.2 [NRD-136 app] Run the ownership rule over `dist/` in `scripts/check-seo-07.mjs`; tests: `node --test tests/*.test.js`, `pnpm build`, `check-seo-07` green plus one local negative run recorded.
