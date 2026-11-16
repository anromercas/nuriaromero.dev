# Design

## Context

See proposal.md (Why). Current state, read from the code on `develop` (d2ea153):

- `src/pages/seo-local-sevilla.astro` fills the `ServiceLayout` slots with twelve components from `src/components/seo-local/` and defines `main` (ink ground plus sky radial) and `.band` in a `<style is:global>` block.
- Components that read page data: `SeoLocalHero` (`seoLocal.hero`), `SeoLocalProcess` (`seoLocal.process`), `SeoLocalPlans` (`seoLocal.pricing`, `sectionTitles`), `SeoLocalFaq` (`seoLocal.faqs`, `sectionTitles.faq`, `cta`), `SeoLocalRelated` (`internalLinksBySource[seoLocal.slug]`), `SeoLocalClosing` (`seoLocal.cta`). Components with inline copy: `ReviewBento` (six tiles with inline SVG), `SeoLocalAgencia`, `RealProof`, `ProofStrip` ("+10 años", "2 webs en Sevilla"), `SeoLocalNap` (heading), `ListingMock` (labels, kept: it is the SEO-local drawing).
- Every component repeats `.kw`, `.display`, `.display em` (accent) and the colour literals of `DESIGN.md`; `tailwind.config.mjs` `theme.extend` is empty; styles are Astro scoped `<style>` blocks, not Tailwind utilities.
- `ServiceLayout` renders legacy fallback blocks (`ServiceHero`, `BenefitsGrid`, `PricingCard`, `FAQ`, `InternalLinks`, `CTASection`) for every slot a page does not fill, and always emits Service + FAQPage + BreadcrumbList from `page`.
- Tests are node:test files reading sources with regexes (no component rendering: `.astro` cannot be imported from plain `node --test`); dist checks are `scripts/check-seo-NN.mjs` run by `pnpm check:seo:dist` (`tests/package-scripts.test.js` requires a `check:seo-NN` and `check:seo-NN:dist` script per file, in order).
- The visible word count method used for the targets of the page stories is `parsePage(html).mainWordCount` in `scripts/lib/seo-inventory.mjs`.

## Goals / Non-Goals

**Goals:**

- A page composes the reference sections by passing props and slots; no copy, token or layout value has to be copied.
- `/seo-local-sevilla/` stays pixel and markup identical (except class and scoped-style attributes) and its JSON-LD identical.
- Page stories get a ready build-time contract (word range, FAQ equals FAQPage, Service presence) and a `<main>` diff tool.

**Non-Goals:**

- Visual improvements, copy edits, renames of the folder or components, restyling old-world shared components, Tailwind theme utilities for the ink world (the components use scoped CSS, so CSS custom properties are the single source; `theme.extend` stays empty and `DESIGN.md` says so).

## Decisions

**Approach.** Extract, do not rewrite. Each component keeps its markup and its layout CSS, swaps hardcoded copy for props (with slots where the content is markup: SVG illustrations, rich lede text, the process byline), and swaps colour and typography literals for CSS custom properties from one shared stylesheet. A small `SectionHeading` component owns the keyword heading plus display title plus single accent phrase, so the One Serif Phrase rule lives in one place. `ServiceLayout` gets an opt-in `variant="template"` so pages can omit sections without legacy fallbacks; `/seo-local-sevilla/` becomes the first consumer and passes exactly the data it renders today, which is what makes "no visual change" checkable. Regression tooling lands first (task 1.1) so the baseline is captured from the unchanged page.

Alternatives considered: Tailwind `theme.extend` tokens (rejected: the components are scoped CSS, utilities would mean rewriting markup and risking render changes); one big config-driven `TemplatePage` component (rejected: hides the section order in data, harder to omit or reorder, bigger diff); dynamic named slots per bento tile (rejected: composition with a `BentoTile` child is simpler and typed).

**Scoped CSS and slotted content.** Astro scopes selectors with `data-astro-cid-*`; markup passed through a slot carries the page's scope, not the component's. Every rule that targets slotted SVG or text (tile and hero illustrations, `.signal`, `.soft`, `.label`, `.strong`, byline link) MUST use `:global()` under the component's own class (for example `.tile :global(svg)`, `.tile :global(.signal)`). This is the main source of accidental render changes; the screenshot and `<main>` comparisons catch it.

### Files

All in layer `app`. `DESIGN.md` is a shared path routed to layer `app` (task 3.2).

Create:

- `src/styles/template.css` (app): `:root` custom properties for every colour token in the `DESIGN.md` front matter (hex), plus channel triplets for the alpha uses (`--sky-signal-rgb: 56 189 248`, `--ink-band-rgb: 8 16 36`), `--accent-size: 1.12em`, `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`; classes `.tpl-link` (the shared text link: today's `.hero-link` values, used by `BentoTile.link` and `FaqItem.links`), `.template-ground` (today's route `main` ground: `rgb(5 10 24)` plus the 10% sky radial ellipse 80% x 30%), `.band` (today's values), `.tpl-kw`, `.tpl-display`, `.tpl-accent` (today's `.kw`, `.display`, `.display em` values). Imported from the frontmatter of every template component and `SectionHeading` (`import "@/styles/template.css"`), so it ships only on pages that use the template. The Instrument Serif font stays a frontmatter import (`import "@fontsource/instrument-serif/400-italic.css"`), now only in `SectionHeading.astro` and `SeoLocalCycle.astro` (the two places that set serif text); the other components drop it.
- `src/components/seo-local/types.ts` (app): shared prop types (see Interfaces).
- `src/components/seo-local/SectionHeading.astro` (app).
- `src/components/seo-local/BentoTile.astro` (app).
- `src/components/seo-local/SeoLocalCycle.astro` (app): the cycle diagram card (SVG + visually hidden ordered list) moved verbatim out of `SeoLocalProcess`, labels as a prop.
- `scripts/lib/page-contract.mjs`, `scripts/lib/template-pages.mjs`, `scripts/check-seo-16.mjs`, `scripts/check-seo-17.mjs`, `scripts/diff-main.mjs` (app).
- `tests/fixtures/seo-local-sevilla.baseline.json` (app): `{ jsonld: [...parsed ld+json blocks], headings: [{ level, text }] }` captured from `dist/seo-local-sevilla/index.html` built from unchanged `develop`.
- `tests/page-contract.test.js`, `tests/template-components.test.js` (app).
- `docs/adr/0014-template-section-components.md` and its index row (written with this design).

Modify:

- `src/components/seo-local/SeoLocalHero.astro`, `ListingMock.astro` (styles only), `ProofStrip.astro`, `ReviewBento.astro`, `SeoLocalProcess.astro`, `RealProof.astro`, `SeoLocalAgencia.astro`, `SeoLocalPlans.astro`, `SeoLocalFaq.astro`, `SeoLocalRelated.astro`, `SeoLocalClosing.astro`, `SeoLocalNap.astro` (app).
- `src/layouts/ServiceLayout.astro` (app): `variant` prop.
- `src/pages/seo-local-sevilla.astro` (app): passes props and slots, `variant="template"`, drops the `<style is:global>` block.
- `src/data/site.ts` (app): `SITE_PROOF` with the two facts now hardcoded in `ProofStrip` (`{ stat: "+10 años", label: "de experiencia" }`, `{ stat: "2 webs en Sevilla", label: "de negocios locales" }`).
- `package.json` (app): `check:seo-16`, `check:seo-16:dist`, `check:seo-17`, `check:seo-17:dist`, and both appended to `check:seo:dist` in numeric order.
- `tests/seo-local-ficha-redesign.test.js`, `tests/seo-local-sevilla-redesign.test.js`, `tests/visibility-audit-graphics.test.js`, `tests/seo-local-posicionamiento-web.test.js` (app): assertions on copy, ids and headings that lived in component sources now target `src/pages/seo-local-sevilla.astro` (or `src/data/*`); assertions on styles (`.kw` weight, no uppercase, keyframes) target `src/styles/template.css` or the component that still owns them. Intent is never weakened; no assertion is deleted without a replacement.
- `DESIGN.md` (shared path, app): "Known Drift" and a short "Using the components on another page" section.

### Interfaces

`src/components/seo-local/types.ts`:

```ts
export interface AccentTitle {
  text: string;
  accent?: string;
} // accent must be a substring of text
export interface TextLink {
  label: string;
  href: string;
} // internal hrefs end in "/" or start with "#"
export interface ProofItem {
  stat: string;
  label: string;
}
export interface Step {
  title: string;
  text: string;
}
export interface ComparisonItem {
  lead: string;
  text: string;
}
export interface FaqItem {
  q: string;
  a: string;
  links?: TextLink[];
} // a: "\n\n" paragraphs, as today; links: owner pages shown after the answer
export type Tier = NonNullable<ServicePageData["pricing"]["tiers"]>[number];
export type BentoArea = "a" | "b" | "c" | "d" | "e" | "f";
```

Components (props; slots in brackets; defaults keep today's ids so the reference page markup does not change):

- `SectionHeading`: `{ id: string; keyword: string; title: AccentTitle; level?: "h1" | "h2" = "h2"; class?: string }`. Renders `<{level} id class="kw tpl-kw">{keyword}</{level}><p class="display tpl-display {class}">before<em class="tpl-accent">accent</em>after</p>`. The hero h1 today has no `id`; `id` is optional for `level="h1"` and omitted when not given. Keep the existing `kw`/`display` class names alongside the `tpl-*` ones only if a scoped override needs them; class changes are allowed by AC 5.
- `SeoLocalHero`: `{ keyword: string; title: AccentTitle; subtitle: string; primaryCtaLabel?: string; secondaryLink?: TextLink; actionsAttrs?: Record<string, string> }` [`visual`]. `actionsAttrs` spreads onto `.hero-actions` (the home passes `data-seo12-primary-cta`). When `Astro.slots.has("visual")` is false the hero renders no `.hero-visual` element (no empty column, no halo) and the copy takes the full width; same rule for `SeoLocalClosing`. Reference page: `keyword=seoLocal.hero.h1`, `title={ text: seoLocal.hero.title, accent: seoLocal.hero.titleAccent }`, `secondaryLink={ label: "Ver los planes", href: "#precios" }`, `<ListingMock slot="visual" />`.
- `ListingMock`: unchanged API (`animate?: boolean`); colours to tokens only.
- `ProofStrip`: `{ items: ProofItem[] }`; renders nothing when empty. The page builds the list: `SITE_PROOF[0]`, the Google cell only when `reviews` is not null (`"4,9 en Google"`-style stat and the singular/plural label, computed in the page exactly as today), `SITE_PROOF[1]`.
- `ReviewBento` (the bento wrapper): `{ headingId: string = "revision-title"; id?: string; keyword: string; title: AccentTitle; caption?: string = "Ejemplo ilustrativo" }` [default: `BentoTile` children]. Keeps the 6-column area map (`a a a a b b / c c d d d d / c c e e e e / f f f f f f`), the 768 px two-column rules for areas `a` and `f`, and the caption rule.
- `BentoTile`: `{ area: BentoArea; title: string; text: string; layout?: "stack" | "row" = "stack"; link?: TextLink; class?: string }` [default: the SVG]. `layout="row"` reproduces today's `.t-med` (illustration beside text from 768 px); `area="c"` keeps `justify-content: center` as today's `.t-busq`. `link` renders an underlined sky text link after the sentence (unused on the reference page; the home uses it).
- `SeoLocalProcess`: `{ headingId: string = "proceso-title"; id?: string; keyword: string; title: AccentTitle; steps: Step[]; portrait?: boolean = true; portraitAlt?: string }` [`byline`, `aside`]. The portrait image, alt and caption stay inside the component (the owner's real photo). The reference page passes the byline paragraph content (with its `/` link) in `byline` and `<SeoLocalCycle slot="aside" items={[...]} centre="cada mes" />` in `aside`.
- `SeoLocalCycle`: `{ items: string[]; centre: string; label?: string = "Ciclo mensual" }`; the SVG text labels and arcs move verbatim.
- `RealProof`: `{ headingId: string = "prueba-title"; id?: string; keyword: string; title: AccentTitle; reviews: GoogleReviewsData | null; note: string; projects: string[] }`.
- `SeoLocalAgencia`: `{ id: string = "agencia-o-consultora"; headingId: string; keyword: string; title: AccentTitle; items: ComparisonItem[]; link?: TextLink }`.
- `SeoLocalPlans`: `{ id: string = "precios"; headingId: string; keyword: string; title: AccentTitle; tiers: Tier[]; note?: string }` [`lede`]. The reference page builds the lede with `tierFrom(seoLocal, "Local")` and `tierFrom(seoLocal, "Local Pro")` (no price literal in the page).
- `SeoLocalFaq`: `{ headingId: string; keyword: string; title: AccentTitle; lede: string; faqs: FaqItem[]; ctaLabel?: string }`. `links` render one closing paragraph of underlined sky text links after the answer paragraphs (several owners allowed, e.g. a service page and a guide). The FAQPage stays built from the same array by the layout or page (`faqSchema` ignores `links`).
- `SeoLocalRelated`: `{ links: { path: string; anchor: string }[]; label?: string = "Sigue leyendo" }`.
- `SeoLocalClosing`: `{ headingId: string; keyword: string; title: AccentTitle; text: string; ctaLabel?: string; meta?: string }` [`visual`]. Reference page: `<ListingMock slot="visual" animate={false} />`.
- `SeoLocalNap`: `{ headingId: string; keyword: string }`; NAP lines from `SITE` (site-wide, allowed).
- `ServiceLayout`: `{ page: ServicePageData; variant?: "legacy" | "template" = "legacy" }`. With `template`: no fallback content in any slot (`<slot name="x" />` only), `<main class="template-ground px-4 pt-24">`; the legacy branch stays byte-identical for the other service pages. JSON-LD emission is unchanged in both variants.

Build-time contract (`scripts/lib/page-contract.mjs`, pure functions over an HTML string):

```js
export function mainWordCount(html)         // parsePage(html).mainWordCount (same method as the story targets)
export function jsonLdEntities(html)        // flat array of entities from every ld+json block, @graph unwrapped
export function faqPageQuestions(html)      // FAQPage mainEntity[].name, in order
export function visibleFaqQuestions(html)   // text of <summary> inside <main> details, in order
export function headingOutline(html)        // [{ level: 1|2|3, text }] inside <main>
export function normalizedMain(html)        // <main> inner HTML without class and data-astro-cid-* attributes, whitespace collapsed
```

`scripts/lib/template-pages.mjs`: `export const templatePages = [{ route: "/seo-local-sevilla/", service: true }]` with optional `words: [min, max]`. Page stories append their entry. `scripts/check-seo-17.mjs` loads `dist/<route>/index.html` for each entry and asserts word range, `visibleFaqQuestions` deep-equals `faqPageQuestions`, and Service presence equals `service`; it prints every failure, then exits 1. `scripts/check-seo-16.mjs` asserts `jsonLdEntities` and `headingOutline` of `dist/seo-local-sevilla/index.html` deep-equal the fixture; the file header says how to regenerate the fixture when a later story changes the reference page on purpose (`node scripts/check-seo-16.mjs --write`). `scripts/diff-main.mjs <before.html> <after.html>` prints the first differing region of `normalizedMain` and exits 1 on difference.

### Data

No schema, storage, settings or migration impact. `src/data/site.ts` gains `SITE_PROOF` (two facts moved from `ProofStrip`, same strings). No price, URL or JSON-LD change.

### Test plan (TDD order)

1. Task 1.1 (RED then GREEN): `tests/page-contract.test.js` with inline HTML fixtures for every function of `page-contract.mjs` (word count equals `parsePage`, `@graph` unwrapping, FAQ question order, `normalizedMain` drops `class` and `data-astro-cid-*` but keeps `style`, `href`, `aria-*`) and for `template-pages.mjs` entries (routes end in `/`, `words` min < max). Then build unchanged `develop`, write the fixture with `check-seo-16 --write`, copy `dist/seo-local-sevilla/index.html` to `$TMPDIR/nuriaromero-163-before.html` for later `diff-main`. `tests/package-scripts.test.js` covers the new scripts. Scenarios: "JSON-LD and headings match the committed baseline", "FAQ and structured data diverge", "Word count over the target", "Unexpected Service entity".
2. Task 1.2: `tests/template-components.test.js` first asserts `template.css` defines every `DESIGN.md` colour token with its value (parse the front matter of `DESIGN.md`), `.band`, `.tpl-kw`, `.tpl-display`, `.tpl-accent`; `SectionHeading.astro` declares the `Props` above and renders a single `em`. Scenarios: "Token values match the design system", "Accent phrase present/absent".
3. Tasks 2.1-2.3, each first extending `tests/template-components.test.js` for the components it touches: the file declares `interface Props` with the listed fields, does not import `@/data/services` (nor `seoLocal`), uses `var(--` tokens and no `.display em {` / `.band {` redefinition; `seo-local-sevilla.astro` passes the props (keyword strings asserted there). Migrate the old source tests of those components in the same task. Scenarios: "No section imports page data", "Sections stop copying token values", "Page draws its own bento tile / hero visual", "FAQ item with a link" (source: `SeoLocalFaq` renders `faq.links`; `faqSchema` signature unchanged).
4. Task 3.1: test that `ServiceLayout` has `variant` and that the template branch has no fallback components inside its slots, and that `seo-local-sevilla.astro` has no `<style is:global>`. Scenario: "Page without plans" (verified in dist by QA and by a temporary local build of the reference page without the pricing slot; not committed).
5. Every task ends with `node --test tests/*.test.js`, `pnpm build`, `pnpm check:seo:dist` and `node scripts/diff-main.mjs $TMPDIR/nuriaromero-163-before.html dist/seo-local-sevilla/index.html` green. Run the before/after builds in the same session: the Google reviews block depends on build-time API data.

### Real-browser / e2e checks (QA)

- `/seo-local-sevilla/` before (develop) and after at 375, 768 and 1280 px: full-page screenshots identical except antialiasing; attach the `diff-main` output and the image comparison.
- Hero listing scroll animation still runs (scroll timeline) and the completed state shows with `prefers-reduced-motion: reduce`.
- FAQ accordions open and close with keyboard; focus outline 2 px sky on summary, hero link, related pills, review link; booking buttons unchanged.
- No horizontal overflow at 375 px (hero halo and closing radial still clipped).
- Spot-check one other service page (`/automatizaciones/`) still renders its legacy layout unchanged (legacy branch of `ServiceLayout`).

### ADRs relied on

0002 (Tailwind and TypeScript), 0003 (single app layer, `src/data`), 0004 (SEO head and JSON-LD), 0005 (SEO checks), 0006 (node:test, TDD), 0008 (Spanish copy, English code), 0013 (SEO site architecture). New: 0014 (template section components and shared ink tokens).

### Id rule and answers to the UI spec open questions

- **Id rule (all sections).** `headingId` is the id of the section's keyword heading and the target of its `aria-labelledby`; every section has one, unique on the page, with today's values as defaults. `id` is the optional section anchor for in-page links: when given it is rendered on the component's own `<section>` with `scroll-m-20` (as `SeoLocalAgencia` and `SeoLocalPlans` already do). Pages may instead put the anchor on the wrapping `SectionContainer id="..."`, which already carries `scroll-m-20` (the reference page does this for `revision-local` and `trabajo-real`, so its markup stays identical). `ReviewBento`, `SeoLocalProcess` and `RealProof` therefore take `headingId` (defaults `revision-title`, `proceso-title`, `prueba-title`) plus optional `id`.
- **`.tpl-link`: accepted.** One shared class in `src/styles/template.css` for `BentoTile.link` and `FaqItem.links` (ADR 0014: tokens and shared styles live in one place). The existing scoped `.hero-link` and `.agencia-link` may switch to it only if `diff-main` and the screenshots stay identical; otherwise they keep their scoped rules in this story.
- **Closing `meta` default: confirmed.** "30 minutos · Sin compromiso · Directamente conmigo" is already published on `/seo-local-sevilla/` and describes the booking call, which is the same on every page; pages override it only when they need to.
- **Hero / closing without `visual`: recorded** in Interfaces (`Astro.slots.has("visual")`); defensive state only.

## Risks / Trade-offs

- [Scoped styles stop matching slotted markup, so a stroke or label colour changes] → `:global()` rule above; `diff-main` cannot see CSS, so the screenshot comparison is mandatory before the PR.
- [CSS order changes: the shared stylesheet is now loaded before scoped styles and could win or lose differently] → shared classes have lower specificity than scoped selectors; keep per-component overrides (max-width, margins) scoped; compare computed styles on the three breakpoints if screenshots differ.
- [Google reviews data differs between the before and after builds] → build both in the same session; the fixture check excludes review-dependent markup (it only covers JSON-LD and headings, which do not depend on reviews).
- [The fixture freezes the reference page] → intended; a story that changes `/seo-local-sevilla/` on purpose regenerates it with `--write` in the same commit and says so in the PR.
- [Size: 7 work units, the story is 8 points] → no size concern beyond the estimate; the regression tooling is reused by NRD-164, NRD-165 and NRD-171.

## UI spec

Scope: this story ships no visual change. `/seo-local-sevilla/` MUST look and behave exactly as on `develop` at every width (AC 5); every value below that already exists on the page is today's value, now read from `src/styles/template.css`. The spec fixes the **visual API** of the sections (AC 8): what a page may vary and what the component owns, so NRD-164, NRD-165, NRD-171 and later pages compose instead of restyling. Visitor mode of the consuming pages: Persuade (one primary action: book a call). Source of truth: `DESIGN.md` (front matter tokens and Named Rules).

### 1. Global rules (all template sections)

- **Fixed by the component, never by the page:** colours, type scale, radii, borders, paddings, gaps, breakpoints (640, 768, 1024 px), grid templates, focus and hover styles, motion. A page passes content (text, links, SVG drawings, data) and nothing else; no `style`/`class` overrides from the page except `SectionHeading`'s `class` used by the component itself for its per-section `max-width`.
- **Varies per page:** keyword heading text, display title and its accent phrase, ids, body copy, list items, tiles' SVG drawings, links, CTA labels.
- **Heading pattern** (`src/components/seo-local/SectionHeading.astro`): keyword heading (`.tpl-kw`: Onest 600, 1.0625rem, `text-secondary`, sentence case, no uppercase, no tracking, no icon) then display paragraph (`.tpl-display`: headline token, `text-strong`, `text-wrap: balance`) with at most one `em.tpl-accent` (Instrument Serif italic 400, `sky-accent`, `--accent-size` 1.12em, -0.01em). The display `max-width` stays owned by each section (today: FAQ 14ch, bento 20ch, etc.), passed through `class` from the section, not from the page.
- **Copy rules for pages** (checked by `ux-review` on consuming stories): keyword heading is the search phrase in sentence case; display title is a short claim whose accent phrase is 1-4 words and appears verbatim in the title; no second accent, no emphasis inside body copy. Assumption: the 1-4 word range is inferred from every accent on the reference page ("te encuentren", "antes de empezar", "tu presencia local").
- **Ink tokens** (`src/styles/template.css`): every `DESIGN.md` colour token as a custom property with its hex value; no component keeps a colour literal except the alpha channel triplets defined there. No new token, colour or size is introduced.
- **Text link** (hero secondary link, comparison link, and the two new link uses below: `BentoTile.link`, `FaqItem.links`): `text-body` colour, underline in `sky-signal` at 70% alpha, `text-underline-offset: 0.3em`, `border-radius: 0.25rem`; hover `sky-accent` with `0.2s var(--ease-out)` colour transition; focus 2px `sky-signal` outline, 4px offset. These are today's `.hero-link` / `.agencia-link` values. Assumption: the new link uses get the same rule as a shared `.tpl-link` class in `template.css` (existing `.hero-link` and `.agencia-link` may keep their scoped copy in this story to avoid render risk).

### 2. Section by section: page varies / component owns

| Section                                         | Page varies                                                                                                                | Component owns                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SeoLocalHero.astro`                            | `keyword` (the h1), `title`+accent, `subtitle`, `primaryCtaLabel`, `secondaryLink`, `visual` slot (the page's own drawing) | two-column 1.05fr/0.95fr from 768 px, 52ch subtitle, booking button + underlined secondary link order, sky halo (16-18% radial) behind the visual, overflow clipping                                                                                                                                                                                                                                                  |
| `ListingMock.astro`                             | `animate`                                                                                                                  | the SEO-local drawing and its scroll-timeline fill; it is the reference page's visual, not a generic mock                                                                                                                                                                                                                                                                                                             |
| `ProofStrip.astro`                              | `items` (1-3 true, sourced facts)                                                                                          | hairline row, stacked with top rules below 640 px, equal columns with left rules from 640 px, stat in `text-strong` stat token, label `text-secondary` 0.9rem                                                                                                                                                                                                                                                         |
| `ReviewBento.astro` + `BentoTile.astro`         | heading, `caption` text, per tile: `title`, `text`, SVG slot, optional `link`                                              | the six-area map (`a a a a b b / c c d d d d / c c e e e e / f f f f f f` at 1024 px; single column below 768 px; today's two-column rules at 768 px), tile surface `card-surface`, 1px `hairline`, 1.25rem radius and padding, SVG on top, stroke colours for `.signal` (`sky-signal`), `.soft` (`drawing-soft`), `.label` (`text-secondary`), `.strong` (`text-strong`), one caption with rule under the whole grid |
| `SeoLocalProcess.astro` + `SeoLocalCycle.astro` | heading, `steps`, `byline` slot, `aside` slot (the cycle or another drawing), cycle `items`, `centre`, `label`             | owner portrait card (real photo, fixed), 1px sky timeline with ring dots (`site-ground` fill, as today), 20rem portrait + fluid column at 1024 px                                                                                                                                                                                                                                                                     |
| `RealProof.astro`                               | heading, `note`, `projects`                                                                                                | pull-quote card from live Google data, outline stars with yellow fill, link to all reviews, project cards                                                                                                                                                                                                                                                                                                             |
| `SeoLocalAgencia.astro`                         | heading, ids, `items` (lead + text), optional `link`                                                                       | 0.8fr/1.2fr at 1024 px, hairline-ruled list                                                                                                                                                                                                                                                                                                                                                                           |
| `SeoLocalPlans.astro`                           | heading, ids, `tiers`, `note`, `lede` slot                                                                                 | two equal-height cards, recommended card (yellow border, `card-surface-recommended`, yellow checks, "Recomendado" pill, -0.75rem lift on desktop), price at 1.75rem/700, buttons on one baseline                                                                                                                                                                                                                      |
| `SeoLocalFaq.astro`                             | heading, `lede`, `faqs`, per-item `links`, `ctaLabel`                                                                      | sticky intro at 1024 px (0.8fr/1.2fr), native `details`, drawn plus indicator, bold lead sentence split from the first sentence of `a`, 65ch answers                                                                                                                                                                                                                                                                  |
| `SeoLocalRelated.astro`                         | `links`, `label`                                                                                                           | top-ruled row of pill links                                                                                                                                                                                                                                                                                                                                                                                           |
| `SeoLocalClosing.astro`                         | heading, `text`, `ctaLabel`, `meta`, `visual` slot                                                                         | full-bleed `ink-closing` band, hairline-quiet edges, 4rem padding, 48ch copy, 16% sky radial behind the visual                                                                                                                                                                                                                                                                                                        |
| `SeoLocalNap.astro`                             | `headingId`, `keyword`                                                                                                     | NAP lines from `SITE`                                                                                                                                                                                                                                                                                                                                                                                                 |

### 3. Content ranges and states

The site is static: there is no loading or async state. Data-driven states are build-time only.

- **ProofStrip:** `items` empty renders nothing (no rules, no margin). 1 or 2 items keep the same row with equal columns. More than 3 is not allowed (the row breaks at 375 px). Reviews `null`: the page drops the Google cell, as today.
- **RealProof:** reviews `null` or without a quote: the quote card is omitted, note and projects still render (today's behaviour).
- **Bento:** exactly six `BentoTile` children, one per area `a`-`f`, each area used once. Fewer or more tiles is out of contract for this story. Tile `text`: one sentence, about 25 words at most. Assumption: the 25-word cap matches the longest reference tile and keeps tile heights balanced in the 4+2 rows.
- **BentoTile `link`** (new, unused on the reference page): one text link rendered as its own line after the sentence, `.tpl-link` style, label describes the destination (no "aquí", no "más info"). Absent: nothing rendered.
- **FAQ `links`** (new, unused on the reference page): after the answer paragraphs, one paragraph `.answer-links` with the links in the order given, separated by `·` (middle dot wrapped in `aria-hidden="true"`), same 65ch measure and `0.75rem` bottom margin as the answer paragraphs. Labels are the owner page's topic (for example "Diseño web en Sevilla"). Absent or empty array: no paragraph. Assumption: no lead-in text such as "Más información:", so the visible text adds only the link labels and the answer stays readable on its own.
- **FAQ count:** 4-8 questions per page. Assumption: reference page range; more than 8 makes the sticky intro too short relative to the list.
- **Related:** `links` empty renders nothing (today's behaviour).
- **Closing `meta`:** default `"30 minutos · Sin compromiso · Directamente conmigo"` (today's string). Confirmed by the Tech Lead: published booking fact, the same on every page; pages override only when needed.
- **Hero / Closing without a `visual`:** the copy column takes the full width, left aligned, with its own max-widths unchanged; no empty column or halo. Defensive state only (every template page passes its drawing, AC 3); implemented with `Astro.slots.has("visual")`.
- **Process without `aside`:** no empty card; steps column ends after the last step.

### 4. Optional sections and band rhythm (AC 4)

- With `ServiceLayout variant="template"` an unfilled slot outputs nothing: no `SectionContainer`, no legacy block, no extra gap. The remaining sections keep the 6rem `space-y-24` rhythm.
- `.band` (full bleed, `margin-inline: -1rem`, 3rem block padding, `hairline-quiet` top and bottom, `ink-band` at 85%) is a page-level wrapper, not part of any section. Rules for pages: never place two `.band` wrappers next to each other (a plain section sits between them); the closing band is always the last section before NAP; a page may have zero bands. Assumption: inferred from the reference order (plain, band, plain, band, plain..., closing) so separators never double.
- Reference order for composing pages: hero + proof strip, bento, process (band), real proof + comparison, plans (band), FAQ, related, closing + NAP. Any subset in this order is valid.

### 5. Responsive

No change. Breakpoints 640, 768 and 1024 px as listed above; at 320-375 px every section is single column, the hero halo and closing radial stay clipped (no horizontal overflow), proof strip stacks. New link elements wrap naturally (no `nowrap`).

### 6. Interactions and motion

Unchanged: hover/focus on booking buttons, hero link, review link, related pills, FAQ summary (2px `sky-signal` outline, 2-4px offset); FAQ native toggle with the vertical stroke hidden when open; hero listing scroll-timeline fill inside `prefers-reduced-motion: no-preference`, completed state by default; transitions 0.2s `var(--ease-out)`. No new animation.

### 7. Accessibility hand-off

- Each section keeps `aria-labelledby` pointing at the keyword heading id passed by the page; ids must be unique per page.
- Page-supplied SVG drawings keep `aria-hidden="true" focusable="false"`; the information they show must also be in the tile title or sentence. The cycle diagram keeps its visually hidden ordered list built from `items`.
- Link labels are self-descriptive out of context (FAQ and tile links are read in link lists).
- Heading outline per page: one h1 (hero keyword), section keywords as h2, tile and step names as h3.

### 8. Design skill

`impeccable:impeccable` (shape) used advisorily; its interview and `init` steps were skipped (unattended, spec-only write). The brief maps to: refinement that preserves the incumbent world, visual authority `DESIGN.md`, anti-goal "any pixel change on `/seo-local-sevilla/`".
