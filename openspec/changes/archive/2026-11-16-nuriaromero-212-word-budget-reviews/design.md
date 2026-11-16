# Design

## Context

See proposal.md (Why). State on `develop` (a62e1cd):

- `scripts/lib/page-contract.mjs`: `mainWordCount(html)` returns `parsePage(html).mainWordCount`; `parsePage` (`scripts/lib/seo-inventory.mjs:71-110`) strips `<script>`/`<style>`, comments and tags from the first `<main>` and splits on whitespace. `tests/page-contract.test.js` asserts `mainWordCount(page) === parsePage(page).mainWordCount` on a fixture without quote.
- `scripts/check-seo-17.mjs` calls `mainWordCount` for every `templatePages` entry with `words` (`/`, `/diseno-web-sevilla/`, `/contacto/`, `/tienda-online-sevilla/`, `/automatizaciones/`, `/desarrollo-software-medida/`).
- `src/components/seo-local/RealProof.astro:28-52` renders `<figure class="quote">` (blockquote, stars, author, relative time, link to Google) only when `reviews` has at least one review; CI and local builds have no `GOOGLE_PLACES_API_KEY`, so the figure is absent from `dist/` there.
- The live rating cell of `ProofStrip` (built in each page from `reviewsData`) is also absent in CI; it is bounded (two short strings) and not part of this story.
- `parsePage` also feeds the URL inventory (`scripts/seo-inventory.mjs`), where the number means "all visible text"; it must not change.

## Goals / Non-Goals

**Goals:**

- The word budget is identical with and without the live review quote, by an explicit marker that a test proves.
- No visible change, no range or copy change, no change to the inventory numbers.

**Non-Goals:**

- Excluding the `ProofStrip` rating cell, editing reviews, re-measuring delivered pages.

## Decisions

**Approach.** Mark the content, not the component: the quote `<figure>` gets `data-word-budget="exclude"`, and `page-contract.mjs` gains `withoutWordBudgetExcluded(html)`, which removes every element whose opening tag carries that attribute together with its subtree. `mainWordCount(html)` becomes `parsePage(withoutWordBudgetExcluded(html)).mainWordCount`. Removal walks the HTML from the marked opening tag and counts opening and closing tags of the same name until the depth returns to zero, so a nested element of the same name inside the marked one (for example a `figure` inside the `figure`) is handled; a void or self-closing marked tag removes only itself. The marker is a generic, documented convention (ADR 0015), so any future live third-party block (for example another embed) can use it without changing the check.

Alternatives considered: stripping `figure.quote` by class (rejected: class names are styling, `normalizedMain` already treats them as noise, and the exclusion would be implicit); building with a fixture review in CI (rejected: the quote length is unbounded in production, so the measured page would still differ); changing `parsePage` (rejected: the inventory counts all visible text by design); an HTML parser dependency (rejected: radical, and the regex approach is the house pattern of these helpers).

### Files

All in layer `app`.

Modify:

- `scripts/lib/page-contract.mjs`: export `WORD_BUDGET_EXCLUDE = "data-word-budget"` (attribute name; value `"exclude"`), export `withoutWordBudgetExcluded(html)`, `mainWordCount` uses it; update the `mainWordCount` doc comment ("excludes elements marked `data-word-budget="exclude"`").
- `src/components/seo-local/RealProof.astro`: `<figure class="quote" data-word-budget="exclude">`. Nothing else in the component changes.
- `scripts/lib/template-pages.mjs`: header comment line for `words`: "optional [min, max] visible word range of <main>, without elements marked data-word-budget="exclude" (the live Google review quote of RealProof): owner-controlled text only (ADR 0015)".
- `tests/page-contract.test.js`, `tests/template-components.test.js`.

Design-time (written in this design worktree, not by the developer): `docs/adr/0015-word-budget-owner-text.md` and its row in `docs/adr/README.md`.

Unchanged: `scripts/lib/seo-inventory.mjs`, `scripts/check-seo-17.mjs` (already calls `mainWordCount`), every page, `tests/fixtures/seo-local-sevilla.baseline.json`.

### Interfaces

```js
// scripts/lib/page-contract.mjs
export const WORD_BUDGET_EXCLUDE = "data-word-budget";
/** html without every element (and its subtree) whose opening tag has data-word-budget="exclude". */
export function withoutWordBudgetExcluded(html) /* : string */;
/** Visible word count of <main>, without word-budget-excluded elements. */
export function mainWordCount(html) /* : number */;
```

The attribute matches with double or single quotes and any position among the tag attributes (`\sdata-word-budget\s*=\s*("exclude"|'exclude')`). An unclosed marked element removes to the end of the input (fails safe: never counts third-party text).

### Data

None: no storage, schema, settings or migration. No range in `templatePages` changes.

### Test plan (TDD order)

Task 1.1, RED first:

1. `tests/page-contract.test.js`:
   - "mainWordCount is identical with and without the marked review quote": a `<main>` with copy plus `<figure class="quote" data-word-budget="exclude"><blockquote><p>…long review…</p></blockquote><figcaption><div class="stars" role="img" aria-label="Valoración: 5 de 5 estrellas"><svg>…</svg></div><span class="author">Ana</span><span class="when">hace 2 meses</span><a href="https://search.google.com/local/reviews?placeid=x">Ver todas las reseñas en Google</a></figcaption></figure>` versus the same `<main>` without the figure: equal counts (scenario "Same count with and without the review quote").
   - "text outside the marker is counted": words before and after a marked element are counted exactly (scenario "Text outside the marker is counted").
   - nested same-name element inside a marked element, single-quoted attribute, two marked elements in one page.
   - the existing "mainWordCount equals parsePage().mainWordCount" stays (fixture without marker), and `withoutWordBudgetExcluded` returns an unmarked page unchanged.
2. `tests/template-components.test.js`: `RealProof.astro` source matches `/<figure class="quote" data-word-budget="exclude">/` and the figure still wraps the blockquote, stars, author, relative time and Google link (scenario "Review quote carries the marker").
3. Implement; then `node --test tests/*.test.js`, `pnpm build`, `pnpm check:seo:dist` green with no range or copy change (scenario "Delivered pages keep their ranges"; `check-seo-16` covers the reference page JSON-LD and headings).

### Real-browser / e2e checks (QA)

- `/seo-local-sevilla/` and `/` at 375 and 1280 px: no visual change (the build has no quote; the attribute is invisible).
- Optional, when Places variables are available locally: build with them, confirm the quote renders as before and `pnpm check:seo-17:dist` reports the same counts as without them.

### ADRs relied on

0005, 0006, 0014; new 0015.

## Risks / Trade-offs

- [Marker misused to hide owner copy from the budget] -> ADR 0015 limits it to live third-party content; reviews reject it on owner copy; `tests/template-components.test.js` pins its single current use.
- [Rating cell still differs between CI and production by about five words] -> bounded and small; listed out of scope for the PO.
- [Regex walk on malformed HTML] -> input is Astro output; unclosed marked element fails safe (excluded to the end).
- Size: one work unit, 2 points; no size concern.

## UI spec

No visible change. This story adds one non-presentational attribute to an existing element; layout, styles, copy, states and behavior stay exactly as on `develop`.

### RealProof review quote (`src/components/seo-local/RealProof.astro`)

1. **Screens and layout**: unchanged. The `<figure class="quote">` keeps its position inside `section.proof` (after `SectionHeading`, before `div.sites`) on every page that renders `RealProof` (`/`, `/diseno-web-sevilla/`, `/tienda-online-sevilla/`, `/automatizaciones/`, `/desarrollo-software-medida/`, `/seo-local-sevilla/`). The only markup change is the opening tag: `<figure class="quote" data-word-budget="exclude">`. The figure's children (blockquote, stars, author, relative time, Google link) and their order stay as they are.
2. **Hierarchy**: unchanged.
3. **States**: unchanged. With reviews: the figure renders as today, now carrying the attribute. Without reviews (CI and local builds without `GOOGLE_PLACES_API_KEY`): no figure, as today. No new loading, empty or error state.
4. **Copy**: unchanged. «Ver todas las reseñas en Google» and the `aria-label` «Valoración: N de 5 estrellas» keep their current text; no new strings.
5. **Design system reuse**: no token, class or component is added or changed. The attribute must not be used as a CSS hook: no selector on `[data-word-budget]` in `RealProof.astro` `<style>`, `src/styles/**` or `tailwind.config.mjs`. Assumption: keeping the marker free of styling makes sure it stays a build-check convention (ADR 0015) and cannot change the look.
6. **Responsive**: unchanged at 320, 375 and 1280 px and every breakpoint in between.
7. **Interactions**: unchanged (link hover/focus, `target="_blank"` with `rel="noopener noreferrer"`).
8. **Accessibility hand-off**: unchanged. `data-*` attributes are not exposed to the accessibility tree; the figure, the stars `role="img"` with its label and the link keep their accessible names. No new focus stop and no announcement.

Acceptance for `ux-review`: the built pages are visually identical to `develop` at 375 and 1280 px (with no quote in CI builds), and the only diff in `RealProof.astro` is the added attribute on the figure opening tag.
