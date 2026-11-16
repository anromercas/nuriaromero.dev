# Design

## Context

See proposal.md (Why). State on `develop` (b062e47):

- `src/layouts/BlogPostLayout.astro`: `<main class="template-ground ...">`, `<article>` with the title as only H1 and `<div class="post-prose" data-post-body><slot /></div>`; then `SeoLocalRelated` (`<nav class="related" aria-label="Contenido relacionado">`, rendered only when `internalLinksBySource[url]` has links; all 4 posts have them) and `SeoLocalClosing` (`<section class="closing" aria-labelledby="post-cierre-title">` holding `BookingButton` → `<a href={bookingUrl}>`). Scoped `<style>` with `.post-prose :global(...)` rules; th/td `border: 1px solid var(--hairline)` (lines 261-268), th background `var(--card-surface)`.
- `src/styles/template.css` `:root` tokens mirror `DESIGN.md` front matter `colors`; `tests/template-components.test.js` requires every `DESIGN.md` colour in `template.css` with the same value.
- Computed contrast: `--hairline` #334155 1.91 (ground) / 1.84 (card); `--drawing-soft` #475569 2.61 / 2.52; slate-500 #64748b 4.15 / 4.01. No existing token sits in the 3:1-ish border range without being a text colour, hence a new token.
- Markdown code blocks: Astro 4 default Shiki (`github-dark`) renders `<pre class="astro-code github-dark" style="background-color:#24292e;overflow-x:auto" tabindex="0">`; the inline background beats a stylesheet rule unless `!important`. Its comment colour `#6a737d` gives 3.97:1 on `--card-surface`, below AA. Computed lowest text-token contrast on `--card-surface` of the bundled themes (shikiji 0.9.19): `github-dark` 3.97, `one-dark-pro` 3.16, `dracula` 4.06, `github-dark-dimmed` 4.93 (comments `#768390`; its only lower foreground, `#2d333b`, is drawn on a `#6cb6ff` background for `markup.ignored`).
- `scripts/lib/post-contract.mjs`: `postBodyHtml(html)` (balanced same-tag counting from the `data-post-body` element) and `postContract(html)` returning `{ title, description, canonical, jsonld, bodyText, bodyLinks }`. `scripts/check-seo-18.mjs` compares every `dist/blog/*/index.html` contract with `tests/fixtures/blog-posts.baseline.json` field by field; it runs in CI through `check:seo:dist`. `tests/blog-post-template.test.js` already checks H1 and closing on built posts, but only when `dist/` exists (skipped in CI).
- `bookingUrl` lives in `src/data/site.ts` and already loads from plain Node (`tests/blog-post-template.test.js`, `scripts/check-seo-19.mjs` import it; Node 24 strips types). Astro renders its `&` as `&amp;` in `href`; `anchorsIn` decodes entities.

## Goals / Non-Goals

**Goals:**

- Table borders at >= 3:1 through a shared token; ink styles for quote, code, code block and image; CI-enforced H1 / related / closing structure of every post.

**Non-Goals:**

- Post text, other hairline uses, new contract fields or baseline regeneration.

## Decisions

**Approach.** Three work units, each one commit. (1) Add the `hairline-strong` token to `DESIGN.md` and `template.css` and use it for th/td borders only. (2) Add scoped `.post-prose` rules for `blockquote`, inline `code`, `pre` and `img` on existing tokens. (3) Make `postContract` validate the post structure before building the contract, throwing one specific error per rule; because `check-seo-18` already calls it for every built post, the guarantee is enforced in CI without a new check script or baseline change.

1. **New token instead of a loose colour.** `hairline-strong: #64748b` (slate-500, same family as `hairline` / `hairline-quiet`), 4.15:1 on ground, 4.01:1 on card. Recorded in `DESIGN.md` so the token-sync test keeps both in step. Only table cells use it; cards keep the quiet hairline look.
2. **Shiki background and theme.** `pre` sets `background-color: var(--card-surface) !important` (commented: overrides Shiki's inline style). The default `github-dark` comment colour fails AA on that surface (3.97:1), so `astro.config.mjs` sets `markdown: { shikiConfig: { theme: "github-dark-dimmed" } }`: a bundled theme (no new dependency) whose every text token is >= 4.93:1 on `--card-surface`. No post has a code block today, so the build output does not change. Rejected: a written AA exception (the acceptance criterion asks AA text) and per-colour `span[style*=...]` overrides (fragile).
3. **Validation, not new contract fields.** Structure is a rule ("must have"), not a frozen value; asserting it keeps the baseline untouched and gives the "each failure" errors the story asks for.
4. **`bookingUrl` injectable.** `postContract(html, { bookingUrl } = {})` defaults to the value imported from `src/data/site.ts`; tests use the real value, so data stays in one place.

**Files** (all layer `app`; `DESIGN.md` is a shared path routed to `app`):

- Modify `DESIGN.md` (front matter `colors`: `hairline-strong: "#64748b"` after `hairline-quiet`; Colors section: one line "Hairline Strong (`hairline-strong`) for data-table cell borders, at least 3:1 on ground and card"; Shapes section: the sentence "All borders are 1px `hairline`." becomes "All borders are 1px `hairline`, except data-table cell borders, which use `hairline-strong`.").
- Modify `astro.config.mjs` (add `markdown: { shikiConfig: { theme: "github-dark-dimmed" } }` to `defineConfig`; nothing else).
- Modify `src/styles/template.css` (`--hairline-strong: #64748b;` after `--hairline-quiet`).
- Modify `src/layouts/BlogPostLayout.astro` (th/td border token; new prose rules).
- Modify `scripts/lib/post-contract.mjs`.
- Modify `tests/blog-post-template.test.js`, `tests/post-contract.test.js`.

**Interfaces.**

CSS added to the layout `<style>` (values may be refined by the UI spec; tokens, overflow and sizing behaviour are fixed):

```css
.post-prose :global(th),
.post-prose :global(td) { border: 1px solid var(--hairline-strong); /* rest unchanged */ }

.post-prose :global(blockquote) {
  max-width: 68ch; margin: 2rem 0; padding: 0.25rem 0 0.25rem 1.25rem;
  border-left: 2px solid var(--sky-signal); color: var(--text-body);
}
.post-prose :global(blockquote p) { color: inherit; }
.post-prose :global(blockquote > :last-child) { margin-bottom: 0; }

.post-prose :global(:not(pre) > code) {
  padding: 0.1em 0.35em; border: 1px solid var(--hairline); border-radius: 0.375rem;
  background: var(--card-surface); color: var(--text-body);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 0.9em;
  overflow-wrap: anywhere;
}

.post-prose :global(pre) {
  max-width: 100%; margin: 2rem 0; padding: 1rem 1.25rem; overflow-x: auto;
  border: 1px solid var(--hairline); border-radius: 0.75rem;
  /* Shiki writes the background inline; the ink surface must win. */
  background-color: var(--card-surface) !important;
  color: var(--text-body);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.875rem; line-height: 1.6;
}
.post-prose :global(pre:focus-visible) { outline: 2px solid var(--sky-signal); outline-offset: 4px; }

.post-prose :global(img) {
  display: block; max-width: 100%; height: auto; margin: 2rem 0;
  border-radius: 0.75rem;
}
```

`scripts/lib/post-contract.mjs`:

```js
import { bookingUrl as siteBookingUrl } from "../../src/data/site.ts";
/** Inner HTML of the first element whose opening tag matches openTagRe (balanced same-tag counting); null when absent. */
export function elementInnerHtml(html, openTagRe) { /* generalised from postBodyHtml */ }
export function postBodyHtml(html) { /* same behaviour and errors as today, via elementInnerHtml */ }
/** Throws Error("post must have exactly one h1 (found N)") | Error("related links block not found") | Error("closing booking link not found"). */
export function assertPostStructure(html, bookingUrl) { /* ... */ }
export function postContract(html, { bookingUrl = siteBookingUrl } = {}) {
  assertPostStructure(html, bookingUrl);
  /* same object as today */
}
```

Rules: H1 count over the whole document (`/<h1[\s>]/gi`); related block = `<nav ...aria-label="Contenido relacionado"...>` whose inner HTML has at least one `<a` with an `href`; closing = `<section ...aria-labelledby="post-cierre-title"...>` whose inner HTML has an anchor (via `anchorsIn`) with decoded `href === bookingUrl`. The body-marker check runs first, so a page without the marker keeps throwing "post body marker not found".

**Data.** None: no schema, storage or settings impact; `tests/fixtures/blog-posts.baseline.json` unchanged.

**Test plan (TDD order).**

1. NRD-232, `tests/blog-post-template.test.js` (RED): th/td rule uses `var(--hairline-strong)`; parse `template.css` `:root` hex values and assert contrast(`--hairline-strong`, `--ink-ground`) >= 3 and contrast(`--hairline-strong`, `--card-surface`) >= 3 (scenario "Table borders visible"). `tests/template-components.test.js` then needs the `DESIGN.md` value (already enforces sync).
2. NRD-233, `tests/blog-post-template.test.js` (RED): `astro.config.mjs` matches `shikiConfig:\s*\{\s*theme:\s*"github-dark-dimmed"`; rules exist for `:global(blockquote)`, `:global(:not(pre) > code)`, `:global(pre)` with `overflow-x: auto` and `max-width: 100%`, `:global(pre:focus-visible)`, `:global(img)` with `max-width: 100%` and `height: auto`; these rule bodies contain no `#hex` and no `rgb(` without `var(` (scenario "Quote, code and image").
3. NRD-234, `tests/post-contract.test.js` (RED): the sample page gains `<nav aria-label="Contenido relacionado"><a href="/rel/">…</a></nav>` and `<section aria-labelledby="post-cierre-title">…<a href="${bookingUrl with & as &amp;}">…</a></section>`; valid page returns the same contract as today; `assert.throws` for 0 H1, 2 H1 (`/exactly one h1/`), no nav, nav without links (`/related links block not found/`), no closing section, closing with another href (`/closing booking link not found/`); the missing-marker case keeps its message. Then `pnpm build && pnpm check:seo:dist` (check-seo-18 green against the unchanged baseline; never `--write`).

**Real-browser / e2e checks (QA).**

- `/blog/cuanto-cuesta-una-pagina-web-en-sevilla/` (price tables) at 320, 375 and 1280 px: cell borders clearly visible, no horizontal page scroll.
- Same post, DevTools: inject into `.post-prose` a `<blockquote><p>…</p></blockquote>`, a `<p>` with `<code>`, a `<pre tabindex="0" style="background-color:#24292e;overflow-x:auto"><code>` with one 300-character line, and an `<img src="/favicon.svg" width="2000" height="1000">`; check at 320 px: quote and code on ink tokens, `pre` on the card surface (not #24292e) and scrolling inside the column, Tab onto `pre` shows the sky outline, image within the column with its ratio, no page overflow. No real post holds these elements today.
- Body text of the four posts visually unchanged.

**ADRs relied on.** 0014 (shared template tokens in `template.css`, values from `DESIGN.md`), 0005 (SEO checks), 0006 (TDD).

## Risks / Trade-offs

- `!important` on the `pre` background is the only way to beat Shiki's inline style; scoped to `.post-prose pre`. The Shiki theme change is global to Markdown, but only blog posts render Markdown and none has a code block yet.
- Requiring a related links block makes a future post without `internalLinksBySource` entries fail `check-seo-18`. Intended: the related block is part of the post template; the error message names the fix.
- A stronger hairline only on tables is an exception to "all borders are 1px hairline"; `DESIGN.md` records it both in Colors and in the Shapes border rule.

## UI spec

Surface mode: Read. All changes live in the scoped `<style>` of `src/layouts/BlogPostLayout.astro`, inside `.post-prose` (`<div class="post-prose" data-post-body>`). No new markup, view, navigation, copy or component. Tokens come from `src/styles/template.css` `:root` (values from `DESIGN.md`); radii use the `DESIGN.md` `rounded` scale as literal rem values, because `template.css` has no radius variables. The rules below refine the CSS in Interfaces; where they differ, this section wins (tokens, overflow and sizing behaviour are the same).

### 1. Table cell borders (`.post-prose th`, `td`)

- Screens and layout: unchanged; affects the price tables of `/blog/cuanto-cuesta-una-pagina-web-en-sevilla/` and any future table.
- Hierarchy: unchanged. The border separates rows and columns; it must not compete with the text. `th` keeps `var(--card-surface)` + `var(--text-strong)`; `td:first-child` keeps `var(--text-body)` 600.
- Design system: `border: 1px solid var(--hairline-strong)` on `th` and `td` only (4.15:1 on `--ink-ground`, 4.01:1 on `--card-surface`). Width stays 1px. `hr`, `.post-header` bottom rule, cards and every other `--hairline` use stay on `--hairline`.
- Responsive: unchanged (`@media (max-width: 479px)`: 0.875rem text, 0.5rem 0.625rem padding; `overflow-wrap: anywhere`, `hyphens: auto`). At 320 px the table fits the column with no page scroll.
- States, copy, interactions: n/a (static content).
- Accessibility: the border is the graphic needed to read the grid (WCAG 1.4.11); 3:1 is met by the token, no further work.

### 2. Block quote (`.post-prose blockquote`)

- Layout: block in the reading column, `max-width: 68ch` (same measure as `p`), `margin: 2rem 0`, `padding: 0.25rem 0 0.25rem 1.25rem`.
- Hierarchy: a quoted passage, one step brighter than body paragraphs, not a pull-quote card. Assumption: an inline left-rule quote, not the `DESIGN.md` "Pull-quote proof" card, because that pattern is a review-proof component with stars and author, and a quote inside an article should keep the reading flow.
- Design system: `border-left: 2px solid var(--sky-signal)` (the "part that matters" stroke in `DESIGN.md`); text `var(--text-body)`; inner `p` inherits colour (`blockquote p { color: inherit; }`) and keeps the prose `p` size 1.0625rem / 1.75. Upright, no italics, no quote glyph, no background. Assumption: upright text, because the serif italic is reserved for one phrase per heading in `DESIGN.md`.
- `blockquote > :last-child { margin-bottom: 0; }` so the rule ends with the text.
- Links, `strong`, inline `code` inside a quote keep their prose rules.
- Responsive: no change at any width; at 320 px padding-left stays 1.25rem (text width about 250 px).
- States, copy, interactions: n/a.
- Accessibility: native `blockquote`; nothing extra.

### 3. Inline code (`.post-prose :not(pre) > code`)

- Hierarchy: marks a literal (a domain, a field, a file name) inside running text; must read as part of the sentence, not as a button.
- Design system: `padding: 0.1em 0.35em`; `border: 1px solid var(--hairline)` (decorative, the text carries the meaning); `border-radius: 0.25rem` (Assumption: same radius as prose links in this layout, the closest small value; `rounded.control` 0.5rem looks like a pill at 0.9em text); `background: var(--card-surface)`; `color: var(--text-body)`; `font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`; `font-size: 0.9em`; `overflow-wrap: anywhere` so a long token wraps instead of widening the page.
- Inside a link (`a code`): Assumption: inherits the link colour (`color: inherit`) so the link hover to `--sky-accent` still shows on the code text; the underline stays on the anchor. Declare `.post-prose :global(a code)` after the inline-code rule: both selectors have the same specificity.
- Inside a table cell or quote: same rule (em-based, scales with the cell font).
- Responsive: no change; wraps at 320 px.
- States, copy, interactions: n/a.

### 4. Code block (`.post-prose pre`)

- Layout: full column width, `max-width: 100%`, `margin: 2rem 0`, `padding: 1rem 1.25rem`, `overflow-x: auto` (the block scrolls, the page never does). Lines do not wrap (`white-space` stays `pre`), so code keeps its shape.
- Design system: `border: 1px solid var(--hairline)`; `border-radius: 0.9rem` (Assumption: `rounded.image`, the panel radius below card size; the design's 0.75rem is not on the `DESIGN.md` scale); `background-color: var(--card-surface) !important` over the background Shiki writes inline (the `github-dark-dimmed` theme set in `astro.config.mjs` by NRD-233), with the comment from Interfaces; `color: var(--text-body)` as fallback for unhighlighted code; monospace stack as inline code; `font-size: 0.875rem`; `line-height: 1.6`. Syntax colours come from `github-dark-dimmed` unchanged: every text token is at least 4.93:1 on `--card-surface` (comments `#768390`), so the layout overrides no token colour. `pre code` gets no inline-code chrome (selector excludes it): no padding, border or background.
- Responsive: at `max-width: 479px`, padding `0.875rem 1rem` (Assumption: matches the tighter table padding at that breakpoint, leaves more line visible); font size stays 0.875rem (14 px floor for code legibility).
- Interactions: scroll by touch, trackpad or keyboard arrows after focus. Focus: Shiki sets `tabindex="0"`; `pre:focus-visible { outline: 2px solid var(--sky-signal); outline-offset: 4px; }`, same as prose links. No copy button, no hover state.
- States: n/a (static). A `pre` without Shiki (no inline style) looks the same.
- Accessibility hand-off: the focusable `pre` is in document order after the preceding paragraph; no accessible name needed. Syntax text meets AA through the theme choice; nothing else to add.

### 5. Image (`.post-prose img`)

- Layout: `display: block`; `max-width: 100%`; `height: auto` (keeps the ratio from `width`/`height` attributes, no layout shift); `margin: 2rem 0`. An image inside a `p` is capped by that paragraph's 68ch; a bare image by the column.
- Design system: `border-radius: 0.9rem` (`rounded.image`, Assumption: the design's 0.75rem replaced by the scale value used for portraits). No border, no shadow (Hairline Depth Rule: no shadows; a border is not needed on photos).
- Responsive: shrinks with the column from 320 px; never wider than the column.
- States: n/a (no lazy-load placeholder; `alt` text is a content concern for NRD-127 / NRD-128).
- Accessibility: alt text comes from Markdown; decorative images need `alt=""` in content. Nothing for the developer here.

### 6. Copy

n/a: no new strings. Post text is untouched.

### 7. Reduced motion and interactions summary

No new transitions. Only new interactive state is `pre:focus-visible`.

### Checks for ux-review and QA

- Body text of the four posts must look identical except table borders.
- Table cell borders use `--hairline-strong`; every other border stays on `--hairline` / `--hairline-quiet`, as the `DESIGN.md` Shapes sentence now states ("All borders are 1px `hairline`, except data-table cell borders, which use `hairline-strong`.").
- No `#hex`, `rgb(` without `var(` in the new rule bodies (test in NRD-233).
- A Markdown code block in the built output carries `class="astro-code github-dark-dimmed"`; the rendered `pre` shows the `--card-surface` fill, not the theme's inline background, and comments read at AA.
- The DevTools injection check in "Real-browser / e2e checks (QA)" stays valid: its `#24292e` inline style stands for any Shiki inline background, which the `!important` rule must beat.
