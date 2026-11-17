# Design: key template sections open with a 1-2 sentence direct answer

## Context

See proposal.md - Why. Current state on `develop`:

- Every template section heading goes through `src/components/seo-local/SectionHeading.astro` (ADR 0014): the real `h2` carries the short keyword (`.tpl-kw`), followed by a display-title `<p class="tpl-display">` with one serif accent. That display paragraph is a visual title, not body copy.
- Key-section components and what follows the heading today:
  - `ReviewBento.astro` (props `headingId`, `id`, `keyword`, `title`, `caption`): heading, then `.bento` tiles (slot).
  - `SeoLocalProcess.astro` (`steps`, `portrait`, optional `byline` slot): heading, optional byline `<p>`, then the step grid.
  - `SeoLocalAgencia.astro` (`headingId`, `items`, `link`): heading inside `.agencia-intro`, the comparison `<ul>` in `.agencia-body`.
  - `SeoLocalPlans.astro` (`tiers`, `note`, optional `lede` slot): heading, optional lede, optional note, then plan `<article>`s.
  - `SeoLocalFaq.astro` (`lede: string` required, `faqs`): heading, lede `<p>`, booking button, then `<details>`.
- Heading ids per page (from the page sources):

| Route | What it is | Who / which option | Price | How I work | FAQ |
| --- | --- | --- | --- | --- | --- |
| `/` | `que-hago-title` | `consultor-title` | (no price section) | `proceso-title` | `faq-title` |
| `/seo-local-sevilla/` | `revision-title` | `agencia-title` | `planes-title` | `proceso-title` | `faq-title` |
| `/diseno-web-sevilla/` | `que-incluye-title` | `freelance-title` | `planes-title` | `proceso-title` | `faq-title` |
| `/tienda-online-sevilla/` | `que-incluye-title` | `plataforma-title` | `planes-title` | `proceso-title` | `faq-title` |
| `/automatizaciones/` | `ejemplos-title` | `que-automatizar-primero-title` | `planes-title` | `proceso-title` | `faq-title` |
| `/desarrollo-software-medida/` | `que-se-puede-hacer-title` | `medida-title` | `planes-title` | `proceso-title` | `faq-title` |
| `/inteligencia-artificial/` | `que-puede-hacer-title` | `ia-o-chatgpt-title` | `planes-title` | `proceso-title` | `faq-title` |
| `/seo-para-ia/` | `que-trabajo-title` | (none: `esta-web-title` is proof, not audience) | `planes-title` | `proceso-title` | `faq-title` |

- Word counts of `<main>` owner text on the current build vs ranges in `scripts/lib/template-pages.mjs`: `/` 1013 [900-1100], `/diseno-web-sevilla/` 1165 [1000-1200], `/tienda-online-sevilla/` 1068 [900-1100], `/automatizaciones/` 788 [700-800], `/desarrollo-software-medida/` 807 [750-850], `/inteligencia-artificial/` 849 [750-850], `/seo-para-ia/` 842 [750-850]; `/seo-local-sevilla/` (reference) has no range.
- `scripts/check-seo-17.mjs` loops over `templatePages` and checks word range, FAQ/FAQPage parity and Service presence; helpers live in `scripts/lib/page-contract.mjs` and are unit-tested in `tests/page-contract.test.js`. `tests/template-components.test.js` holds source tests for the section components.
- Prices come from `src/data/services.ts` (`tierFrom(service, tierName)`, `pricing.tiers`) and `src/data/store-offer.ts`; `tests/single-price-source.test.js` guards price literals.
- `scripts/check-seo-16.mjs` freezes only JSON-LD and the heading outline of `/seo-local-sevilla/`; answers change neither.

## Goals / Non-Goals

**Goals:**

- One prop on `SectionHeading` gives every section the same answer slot, markup and style.
- The contract is data (`keySections` per page) checked on `dist/`, so a later page edit cannot silently drop an answer.

**Non-Goals:**

- No change to heading levels, keyword headings, display titles, FAQ items, JSON-LD, prices or word ranges.

## Decisions

**Approach.** `SectionHeading` gains `answer?: string` and renders `<p class="tpl-answer" data-direct-answer>{answer}</p>` right after the display paragraph (inside the same wrapper, so the Agencia intro column carries it). The five key-section components accept `answer?: string` and pass it through; `SeoLocalFaq` makes `lede` optional and renders it only when present (pages that pass `answer` drop the lede, which also frees words). `.tpl-answer` lives in `src/styles/template.css` with the values of the UI spec (body size, `--text-body`, measure 52ch: lead copy per DESIGN.md, 48-52ch; confirmed by the Tech Lead after the UI spec raised it). `templatePages` entries gain `keySections: string[]` (heading ids, table above); `page-contract.mjs` exports `directAnswer(html, headingId)` returning `{ text, words, sentences, precededByBlock }` or `null`, and `check-seo-17` fails for each registered id whose answer is missing, outside 15-45 words, over two sentences, or preceded by a `ul`, `ol`, `article`, `details`, `figure`, `table` or bento tile inside the section. Rejected: a separate `DirectAnswer` component placed by each page (pages could put it after the cards and nothing would enforce order), and turning the display title into the answer (it is a styled one-line title; changing it would change the visual system of every page).

**Prices inside answers.** The answer stays a plain string (no `<strong>`, no links): the bold of `.plans-lede strong` is not carried over, accepted because the answer is a sentence, not a price display. To keep a figure and its unit together, `SectionHeading` renders `answer.replace(/(\d)\s+(€)/g, "$1\u00a0$2")` (non-breaking space between the last digit and "€"); `src/data` values and `tierFrom` stay unchanged (they also feed JSON-LD, `llms.txt` checks and price tests). `/mes + IVA` may wrap after "€"; acceptable. Rejected: changing `tierFrom` to return a non-breaking space (touches every price consumer and the single-price-source guards for a visual detail).

**Answer texts are not in the spec.** The spec fixes the contract (presence, position, 15-45 words, 1-2 sentences, `tú`, no promises, prices from data) and the UI spec fixes the opening pattern per section type; the exact Spanish strings are written in tasks 2.1-2.4 under the copy rules below, because each depends on that page's word budget and trims. They are reviewed in the PR by `seo-review` (owner copy, principle 1).

**Counting rules** (in `directAnswer`): words = whitespace-separated tokens of the decoded text (same tokenizer as `mainWordCount`); sentences = segments ending in `.`, `?` or `!` followed by a space or the end (a trailing segment without punctuation counts as one).

**Copy rules for the answers** (owner copy, reviewed by `seo-review`): start with the answer itself ("El SEO local es…", "Trabajo en cuatro pasos:…", "Desde {price}…"), name the service and, where it is true, the area once; self-contained (no "como ves arriba", no pronoun pointing to another section); price answers interpolate `{tierFrom(seoLocal, "Local")}` or the store-offer value instead of a literal; no ranking or result promises (invariant "No promised rankings", PRD principle 1); `tú`. FAQ-section answer: one sentence that answers the most common question of that page in brief, consistent with the corresponding FAQ item (never a different figure). Keep "Sevilla" mentions to what the sentence needs (NRD-243 measures the home density later).

**Word budget.** Where an answer is added and the page would leave its range, trim in this order: the FAQ lede (replaced by the answer), Plans lede/note text that the answer now covers, process byline, bento tile body text. Never trim FAQ answers (FAQPage parity) or the answers themselves. Ranges in `template-pages.mjs` are not changed.

**Reference page.** `/seo-local-sevilla/` gets answers like the others. The living requirement "The reference page renders unchanged" is reworded by NRD-242 (archive NRD-242 first) to allow on-purpose changes with a regenerated baseline; regenerate `tests/fixtures/seo-local-sevilla.baseline.json` only if `check-seo-16` reports a difference (it should not: answers add no heading and no JSON-LD).

### Files

| Action | Path | Symbols | Layer |
| --- | --- | --- | --- |
| modify | `src/components/seo-local/SectionHeading.astro` | prop `answer?: string`, `<p class="tpl-answer" data-direct-answer>` | app |
| modify | `src/components/seo-local/ReviewBento.astro`, `SeoLocalProcess.astro`, `SeoLocalAgencia.astro`, `SeoLocalPlans.astro` | prop `answer?: string` forwarded | app |
| modify | `src/components/seo-local/SeoLocalFaq.astro` | `answer?: string`, `lede?: string` | app |
| modify | `src/styles/template.css` | `.tpl-answer` (UI spec) | app |
| modify | `scripts/lib/page-contract.mjs` | `directAnswer(html, headingId)` | app |
| modify | `scripts/lib/template-pages.mjs` | `keySections` per entry (added per page in tasks 1.2-1.5) | app |
| modify | `scripts/check-seo-17.mjs` | key-section assertions | app |
| modify | `src/pages/index.astro`, `seo-local-sevilla.astro` (task 1.2); `diseno-web-sevilla.astro`, `tienda-online-sevilla.astro` (1.3); `automatizaciones.astro`, `desarrollo-software-medida.astro` (1.4); `inteligencia-artificial.astro`, `seo-para-ia.astro` (1.5) | `answer` props, trims | app |
| modify | `tests/template-components.test.js`, `tests/page-contract.test.js` | tests below | app |

### Interfaces

```ts
// SectionHeading.astro Props
interface Props { id?: string; keyword: string; title: AccentTitle; level?: "h1" | "h2"; class?: string; answer?: string }
// ReviewBento / SeoLocalProcess / SeoLocalAgencia / SeoLocalPlans: existing Props & { answer?: string }
// SeoLocalFaq: existing Props with lede?: string, & { answer?: string }
```

```js
// scripts/lib/page-contract.mjs
/** Direct answer of the section labelled by headingId, or null when the section has none. */
export function directAnswer(html, headingId) // -> { text, words, sentences, precededByBlock } | null
// scripts/lib/template-pages.mjs entry
// { route, words?, service, keySections?: string[] }
```

### Data

None: no schema or storage change. Prices stay in `src/data`.

### Test plan (TDD order)

1. Task 1.1, RED first:
   - `tests/page-contract.test.js`: `directAnswer` on HTML fixtures: answer right after the display title → counted words/sentences; no answer → `null`; a `<ul>` before the answer → `precededByBlock: true`; a 3-sentence answer → `sentences: 3` ("Registered key section without an answer", "Answer too short or too long", "Answer preceded by a list").
   - `tests/template-components.test.js`: `SectionHeading.astro` renders `data-direct-answer` only when `answer` is set and after the `tpl-display` paragraph; the five components declare and forward `answer`; `SeoLocalFaq` renders the lede only when present ("Section with an answer", "Section without an answer", "FAQ section answer replaces the lede").
   - `check-seo-17` passes unchanged (no page registers key sections yet).
2. Tasks 1.2-1.5, per page pair: register `keySections` in `template-pages.mjs`, `pnpm build`, see `check-seo-17` RED naming each missing answer; then write the answers (and trims), rebuild, `check-seo-17` GREEN including word ranges ("Pages covered", "Word range kept"). Add to `tests/template-components.test.js` a source test that no `answer="…"` string literal in the page contains a digit followed by "€" ("Price answer reads the site data").
3. Full suite, `pnpm build`, `pnpm check:seo:dist` green after each task.

### Real-browser / e2e checks

- Each of the eight pages at 375 px and 1280 px: every key section shows heading, display title, then the answer paragraph before cards/steps/plans/FAQ; readable measure, AA contrast on the ink ground, spacing consistent with the UI spec; the Agencia two-column layout still balances on desktop.
- Reading order with a screen reader: h2 keyword, display title, answer, then content.
- Sticky FAQ intro at 1280x720 and 1024x768 on every page with the longest FAQ answer: the whole intro (keyword, display, answer, booking button) is visible without being clipped while it sticks. If it does not fit, it is a QA failure: fix by shortening that page's FAQ answer within 15-45 words, not by dropping the sticky behaviour.
- A price answer at 320 px and 375 px: the figure and "€" never break onto separate lines.

### ADRs relied on

ADR 0014 (template section components, contract in `template-pages.mjs`), ADR 0015 (word budgets measure owner text: answers are owner text and count), ADR 0013 (keyword ownership: answers do not target other pages' head terms in headings; they are paragraphs).

## Risks / Trade-offs

- [Copy volume: about 39 answers plus trims across eight pages] → split into four page-pair tasks; size concern reported to the PO (closer to 8 points than 5).
- [Pages at their word ceiling] → trimming order fixed above; never relax ranges.
- [Keyword cannibalisation from answers] → `check-seo-07`, `keyword-ownership.test.js` and `check:seo:dist` run after each task; answers mention the page's own service, not other owners' head terms.
- [Archive order with NRD-242 on `page-template`] → archive NRD-242 first; if this change archives first, add the NRD-242 sentence about on-purpose changes when archiving NRD-242.
- [NRD-242 adds a label inside `ServiceLayout` and the home] → independent of section markup; the label is excluded from word counts.

## Migration Plan

None. Rollback is reverting the commits; sections without `answer` render as before.

## UI spec

Scope: the direct-answer paragraph that `SectionHeading` renders, its shared style `.tpl-answer` in `src/styles/template.css`, and how each of the five key-section components places it. No new component, token, color or type size: the answer is the existing DESIGN.md "Body / lead copy" role on the ink ground. Design skill: impeccable (context loaded; its `init`/interview steps skipped, answers taken from DESIGN.md, PRODUCT.md and the current components).

### 1. Answer paragraph (`src/components/seo-local/SectionHeading.astro`)

- **Markup.** When `answer` is a non-empty string (after `trim()`), render `<p class="tpl-answer" data-direct-answer>{answer}</p>` immediately after the display paragraph, as a sibling (same parent). Nothing renders when `answer` is absent or blank: no empty `<p>`. Assumption: blank strings are treated as absent so a page never ships an empty answer box; the reason is the "Section without an answer" scenario.
- The `class` prop keeps applying only to the display paragraph; `.tpl-answer` never receives it. Hero (`SeoLocalHero`) and Closing (`SeoLocalClosing`) do not pass `answer` and stay unchanged.
- **Content is plain text.** No inline links, `<strong>` or line breaks inside the answer (it is a string prop). Prices interpolated from `src/data` render as plain text, without the bold/nowrap treatment of `.plans-lede strong`; `SectionHeading` joins the last digit and "€" with a non-breaking space (Tech Lead decision in Decisions, "Prices inside answers").
- **Hierarchy per key section.** Reading order and visual order are the same: keyword `h2` (`.tpl-kw`, small, `--text-secondary`) → display title (`.tpl-display`, large, white, one serif accent) → answer (`.tpl-answer`, lead body) → section content (tiles, steps, list, plans, FAQ). The display title stays the visual anchor; the answer is the first readable sentence and must look like copy, not like a subtitle or a callout.

### 2. Style `.tpl-answer` (`src/styles/template.css`)

Add after `.tpl-display`, with a one-line comment ("Direct answer under a section heading: lead copy. Sections own the bottom margin."):

| Property | Value | Source |
| --- | --- | --- |
| `max-width` | `52ch` | DESIGN.md Typography, "48-52ch for lead copy"; same measure as `.plans-lede`. Assumption: 52ch instead of the design's "about 60ch", because DESIGN.md fixes lead copy at 48-52ch and the answer is lead copy. |
| `margin` | `0 0 2rem` | default; components override the bottom margin (section 3) |
| `color` | `var(--text-body)` | DESIGN.md "`text-body` section default"; AA on `--ink-ground` and on `.band` (about 15:1) |
| `font-size` | `1.125rem` | top of the DESIGN.md Body range; same as `.plans-lede` |
| `font-weight` | `400` | Body role |
| `line-height` | `1.6` | Body role; same as `.plans-lede` |
| `text-wrap` | `pretty` | avoids a one-word last line; harmless where unsupported |

Not allowed: italic, Instrument Serif, `--sky-accent`, background, border, left rule, icon or uppercase label ("The One Serif Phrase Rule"; the answer is body copy). Same value at every width: no breakpoint rule in `template.css`.

### 3. Placement and spacing per component

Rule: display → answer gap is `1rem` in every section; answer → content gap is the gap the section already had between the display title and its content, so the section rhythm does not change. Where the display margin is larger than `1rem`, the component shrinks it only when an answer follows, with `:has(+ .tpl-answer)` (already used in `SeoLocalPlans.astro`). Rules live in each component's scoped `<style>` with `:global(...)`, like the existing `*-display` rules.

| Component (path) | Display margin with answer | `.tpl-answer` bottom margin | Notes |
| --- | --- | --- | --- |
| `ReviewBento.astro` | `.bento-wrap :global(.bento-display:has(+ .tpl-answer)) { margin-bottom: 1rem }` | `1.75rem` (`.bento-wrap :global(.tpl-answer)`) | tiles follow |
| `SeoLocalProcess.astro` | `.process :global(.process-display:has(+ .tpl-answer)) { margin-bottom: 1rem }` | `2.25rem` | the answer sits before the optional byline; the byline's existing `margin-top: -1.25rem` collapses with the answer's `2.25rem` to a `1rem` gap, so no byline change is needed |
| `SeoLocalAgencia.astro` | unchanged (`1rem`) | `1.5rem` below 1024px (the grid has `gap: 0`, the hairline list follows directly); `0` from 1024px (the answer ends the intro column) | answer stays inside `.agencia-intro`; on desktop it fills the 0.8fr column, which is narrower than 52ch |
| `SeoLocalPlans.astro` | unchanged (`1rem`) | `2rem` when the plan list follows; `0.75rem` when a lede or note follows (`.plans :global(.tpl-answer:has(+ .plans-lede, + .plans-note))`) | answer renders before the lede slot and the note |
| `SeoLocalFaq.astro` | unchanged (`1rem`) | `1.5rem` (the booking button follows, as with the lede today); `0.75rem` when a lede follows (`.faq-intro :global(.tpl-answer:has(+ .lede))`) | the lede renders only when the `lede` prop is set; the answer sits inside the sticky `.faq-intro` above the button |

Order inside each section, for `ux-review` to check: keyword h2, display, answer, then (Process) byline, (Plans) lede, note, (FAQ) lede, booking button, then the section's list/grid.

### 4. States

- With answer: as above. Without answer: markup and spacing identical to today (no `:has` rule matches, no empty paragraph).
- Loading, empty, error, disabled, partial: n/a (static build-time text).

### 5. Copy

- Spanish, `tú`, owner copy written per page in tasks 2.1-2.4 under the "Copy rules for the answers" above; the exact strings are fixed there because each depends on that page's word budget and trims. Assumption: this spec fixes the opening pattern per section type, not the 39 strings, so the developer does not copy a sentence whose facts belong to another page.
- Opening pattern per key section (first words carry the answer, before any context):
  - What it is (`ReviewBento`): "{Service} es…" / "Con {servicio}…" defining what the visitor gets.
  - Who / which option (`SeoLocalAgencia`): "Te conviene {opción} si…" naming the condition.
  - Price (`SeoLocalPlans`): "{Servicio} cuesta desde {tierFrom(...)}…" with the value from `src/data`; mention the billing period and "sin IVA" only if the plans render it.
  - How I work (`SeoLocalProcess`): "Trabajo en {n} pasos: …" where n equals the number of steps rendered.
  - FAQ (`SeoLocalFaq`): one sentence answering the page's most asked question, consistent with its FAQ item.
- The brand, when named, is written "Nuria Romero" exactly as in the page's existing copy. No keyword stuffing, no hidden text: the answer is visible, normal-size body copy.

### 6. Design system reuse

Tokens: `--text-body`, `--ink-ground`, `.band` ground (unchanged). Classes: `.tpl-kw`, `.tpl-display`, new `.tpl-answer` alongside them in `src/styles/template.css`. Components: `src/components/seo-local/SectionHeading.astro`, `ReviewBento.astro`, `SeoLocalProcess.astro`, `SeoLocalAgencia.astro`, `SeoLocalPlans.astro`, `SeoLocalFaq.astro`. Type role: DESIGN.md Body (lead copy). No new component.

### 7. Responsive

- 320-767px: answer full width of the section up to 52ch (at 320px it wraps to about 6-9 lines for 45 words; acceptable, no truncation, no clamping). Agencia and FAQ are single column: answer sits between the display and the list/button with the margins of section 3.
- 768-1023px: same as mobile; Bento tiles go two columns below the answer.
- 1024px and up: Agencia and FAQ go two columns; the answer stays in the left intro column (FAQ intro remains sticky with the answer inside; the intro gets taller by the answer, about 5-6 lines). Assumption: a 45-word answer keeps the sticky FAQ intro shorter than the viewport at 1280x720; QA checks it in the real browser.

### 8. Interactions

n/a: the answer is static text, no hover, focus, transition or motion.

### 9. Accessibility hand-off

- Plain `<p>`: no `role`, no `aria-*`, no live region. `data-direct-answer` is for the contract check only.
- Screen-reader order equals visual order: h2, display, answer, content. Do not move the answer with CSS `order` or grid placement.
- Do not wire the answer to `aria-describedby` of the section (the section is already labelled by the h2; duplicating would be read twice).

### 10. GEO-ready content

Applies (public pages, `seo.enabled`): each registered key section opens with the 1-2 sentence answer before its context (sections 1 and 3). No "updated" date is added by this change. Brand written exactly as above. No keyword stuffing or hidden text.
