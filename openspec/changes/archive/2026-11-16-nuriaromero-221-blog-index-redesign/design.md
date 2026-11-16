# Design

## Context

See proposal.md (Why). State on `develop` (f21567c):

- `src/pages/blog/index.astro`: `Layout` (title "Blog — Webs, SEO local y automatización para negocios de Sevilla", description unchanged), `breadcrumbSchema(breadcrumbs)` (Inicio `/`, Blog `/blog/`), `<main class="px-4 pt-24">` with one `SectionContainer` holding `Breadcrumbs`, a gray `<h1>Blog</h1>`, a gray lead and a `<ul>` of four gray cards. Each card is an `<a href={`/blog/${post.slug}/`}>` wrapping `<time>`, an `<h2>` with the post title, the description and "Leer artículo →". Posts come from `getCollection("blog", ({ data }) => !data.draft)` sorted by `pubDate` descending; dates are formatted with `toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })`.
- `tests/trailing-slash-links.test.js` asserts `url: "/blog/"` and the literal ``href={`/blog/${post.slug}/`}`` in the page source.
- `scripts/lib/keyword-ownership.mjs` `LISTING_CARD_EXEMPTION` drops `<a href="/blog/<slug>/">...</a>` blocks before reading the H2s of `/blog/` (NRD-75), because the current H2 titles sit inside the card links.
- `scripts/check-seo-13.mjs` only needs `/recursos/` to link to `/blog/`; `public/llms.txt` lists `/blog/` (unchanged).
- Non-service template precedents: `/contacto/` (NRD-171) and `/recursos/` (NRD-220, rows in `src/pages/recursos.astro`).

## Goals / Non-Goals

**Goals:**

- `/blog/` in the ink world with the NRD-163 sections, the posts as rows, at most 350 visible words, search signals unchanged.

**Non-Goals:**

- Post content, the post layout (NRD-222), tags, pagination, images, FAQ, proof, plans, Service.

## Decisions

**Approach.** Compose like `/recursos/`: `Layout` plus template components for the hero and the closing; the post list uses `SectionHeading` (keyword `h2` + display title) followed by page-local rows styled only with `src/styles/template.css` tokens. Each row shows the date (`<time datetime>`), the title as an `h3` whose text is the link to the post, and the description. Rows, not cards or a bento, because the content is a dated index of four to N articles that grows over time.

1. **The title is the link.** The `h3` contains `<a class="tpl-link" href={`/blog/${post.slug}/`}>{post.data.title}</a>`. This removes the four identical "Leer artículo" labels (meaningful, distinct link text, fewer words) and keeps the exact `href` expression that `tests/trailing-slash-links.test.js` reads. No whole-row click target.
2. **Post titles are `h3`.** The section keyword is the only list `h2`; titles below H2 are not read by the ownership check (title, H1, H2), so the posts never count as targeting their own owned terms (NRD-117) without relying on `LISTING_CARD_EXEMPTION`. The exemption stays in place (removing it is out of scope and harmless to keep).
3. **Hero H1.** The keyword H1 starts with "Blog" (the UI spec may add a short qualifier, for example "Blog de webs, SEO local y automatización"); it must not contain a term registered in `src/data/seo-intents.ts` `keywordOwners` (check with `normaliseTerm`). Title and meta description stay exactly as today. TL decision 2026-11-16: the UI spec H1 "Blog sobre webs, SEO local y búsquedas con IA" stays; it describes what the posts cover today (no post is about automation), while the title tag keeps "automatización" because the story keeps the current title.
4. **Dates.** Keep the current `es-ES` long format of `pubDate`, in a small helper inside the page frontmatter; `updatedDate` is not shown on the index (it is shown in the post header, NRD-222).
5. **Row anatomy differs from `/recursos/` on purpose.** From 768 px a fixed 11rem date rail plus a fluid title/description column (UI spec), not the 0.8fr/1.2fr split: a date is short and fixed-width, so a proportional column would leave dead space; the split stays asymmetric (confirmed by the TL, 2026-11-16).
6. **No row emphasis.** Unlike `/recursos/`, no row is featured: the list is chronological and every post is a peer; emphasis would be an editorial decision the story does not make.
7. **Word budget.** `templatePages` entry `{ route: "/blog/", words: [150, 350], service: false }`. The upper bound is the story cap (350 including the current four posts); the lower bound guards against an empty list. A fifth post would add about 45 words; when the list outgrows the cap, the story that adds the post revisits the range (noted in Risks).

Alternatives considered: `ReviewBento` tiles (rejected: fixed six areas for four posts and needs illustrations); `SeoLocalRelated` pills (rejected: a pill carries no date or description, so the list would lose the "what is it about" of each post).

### Section map

| #   | Section     | Component                                                             | Content                                                                                                                                                                  |
| --- | ----------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0   | breadcrumbs | `Breadcrumbs`                                                         | unchanged array (Inicio, Blog)                                                                                                                                           |
| 1   | hero        | `SectionContainer` > `SeoLocalHero` (no visual)                       | keyword H1 starting with "Blog"; display title with one accent; one or two sentences: practical guides on webs, local SEO, automation and AI search for business owners; booking button default |
| 2   | posts       | `SectionContainer id="blog-entradas"` > `SectionHeading` + `<ul>` rows | keyword h2 without an owned term (for example "Guías publicadas"), display title; one row per post: `<time>`, `h3` link title, description                              |
| 3   | closing     | `SeoLocalClosing` (inside a `SectionContainer`, as on `/recursos/`)   | keyword h2 (for example "Reserva una llamada"), display title, one short text, default CTA and meta                                                                      |

**Word estimate.** Breadcrumbs 2, hero ~40, section heading ~8, four rows ~170 (date 5, title ~12, description ~24 each), closing ~35: about 255, under 350. If over 350: (1) closing text to one sentence; (2) hero subtitle to one sentence. Never shorten a post title or description (they are post content).

### Files

All in layer `app`.

Create:

- `tests/blog-index-template.test.js`.

Modify:

- `src/pages/blog/index.astro`: section map above; imports `Breadcrumbs`, `SectionContainer`, `SeoLocalHero`, `SectionHeading`, `SeoLocalClosing`, `@/styles/template.css`; keeps `getCollection` filter and sort, `breadcrumbs`, `Layout` title and description and `<Schema slot="head" schema={breadcrumbSchema(breadcrumbs)} />`; scoped row styles with template tokens only (`--hairline`, `--text-*`, `--sky-*`, `--ease-out`); link styling from the shared `.tpl-link`.
- `scripts/lib/template-pages.mjs`: append `{ route: "/blog/", words: [150, 350], service: false }`.

Unchanged and expected green: `tests/trailing-slash-links.test.js`, `tests/keyword-ownership.test.js`, `tests/one-h1.test.js`, `tests/breadcrumb-trailing-slash.test.js`, `scripts/check-seo-02/06/07/13/17.mjs`, `public/llms.txt`, `src/content/blog/*.md`.

### Interfaces

No new exported interface. Page-local only:

```ts
const formatDate = (date: Date) =>
  date.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
```

### Data

None: no storage, schema or settings change. JSON-LD stays BreadcrumbList.

### Test plan (TDD order)

Task 1.1 (NRD-224), RED first in `tests/blog-index-template.test.js` (source assertions plus a `dist/` block skipped when `dist/blog/index.html` is absent, as in `tests/recursos-template.test.js`):

1. Source: `templatePages` has `route: "/blog/", words: [150, 350], service: false`; `<main class="template-ground`; order `<Breadcrumbs`, `<SeoLocalHero`, `<SectionHeading`, `<SeoLocalClosing` after `<main`; no `text-gray-`, `bg-gray-`, `border-gray-`, `→`, literal `<h1`, `SeoLocalFaq`, `ProofStrip`, `SeoLocalPlans`, `ReviewBento`, `serviceSchema`, `faqSchema`; schema is `breadcrumbSchema(breadcrumbs)`; titles render as `<h3` containing ``href={`/blog/${post.slug}/`}`` and `post.data.title`; `post.data.description` and `post.data.pubDate` rendered. Scenarios "Sections in order", "Legacy blocks removed", "Every post listed with its own data", "Breadcrumbs only".
2. Built page (skip without `dist/`): exactly one H1 starting with "Blog"; every `src/content/blog/*.md` slug without `draft: true` linked once as `/blog/<slug>/` in `<main>`, in `pubDate` descending order; `mainWordCount` between 150 and 350; no `"@type":"Service"` or `FAQPage`. Scenarios "Direct answer in the hero", "Word cap", "Closing band with booking".
3. Observe steps 1-2 RED against the current page (the old page may already fall inside the word range, so the RED evidence is the test file, not `check-seo-17`), add the `templatePages` entry, implement, then `node --test tests/*.test.js`, `pnpm build`, `pnpm check:seo:dist` green (02 one H1, 06 links, 07 ownership, 17 contract). Scenario "Ownership check passes", "Post content untouched" (`git diff --stat develop -- src/content/blog` empty, stated in the PR).

### Real-browser / e2e checks (QA)

- `/blog/` at 375, 768, 1024 and 1280 px against the UI spec: rows readable, no horizontal overflow, long titles wrap (`text-wrap: balance`).
- Keyboard: breadcrumbs, hero CTA, the four title links in order, closing CTA; 2 px sky focus outline visible on every title link.
- Section reveal: the hero renders complete at first paint; no list text starts below AA contrast in the first viewport.
- Navigating from `/blog/` to a post and back keeps the ink world on both (together with NRD-222).
- Rich Results Test: BreadcrumbList only.

### ADRs relied on

0003, 0004, 0005, 0006, 0008, 0012, 0013, 0014, 0015.

## Risks / Trade-offs

- [A fifth or sixth post pushes `<main>` over 350 words] -> the cap is per the story; the story that publishes the post updates the range in `scripts/lib/template-pages.mjs` (check-seo-17 fails loudly, never silently).
- [Ownership regression through a new H2] -> only the section keyword and closing keyword are H2; both checked by `check-seo-07`.
- [Row styles drift from `/recursos/`] -> tokens only, same hairline, type and link rules (ADR 0014); copying the `/recursos/` rules into a shared component is not worth it for two pages with different row anatomy.
- Size: one work unit for 2 points; no size concern.

## UI spec

Reference world: `DESIGN.md` (ink template, tokens and shared classes in `src/styles/template.css`). Closest precedent: `src/pages/recursos.astro` (NRD-220). Visitor mode: Read (a dated index of guides); the booking call is the secondary conversion. Design skill `impeccable:impeccable` (shape) consulted through its context loader; its interview, `init` and file-writing steps were skipped (unattended), answers taken from the story, this design, `PRODUCT.md`, `DESIGN.md` and `/recursos/`.

### Page frame

- `<main class="template-ground px-4 pt-24">` with an inner `<div class="space-y-24">` holding, in order: hero `SectionContainer` (with `Breadcrumbs` inside it, before `SeoLocalHero`, as on `/recursos/`), posts `SectionContainer id="blog-entradas"`, closing `SectionContainer` with `SeoLocalClosing`. No bottom padding on `main`: the closing band is the last element.
- No `.band` wrapper on the posts section: the closing band stays the only band and the last one (DESIGN.md composition rule).
- Header, Footer, WhatsApp button and `Breadcrumbs` (`src/components/Breadcrumbs.astro`) unchanged (shared old-world pieces, DESIGN.md Known Drift).

### 1. Hero (`src/components/seo-local/SeoLocalHero.astro`, no `visual` slot, so `hero-solo`)

- `keyword="Blog sobre webs, SEO local y búsquedas con IA"` (exact; renders the only `h1`). Assumption: the qualifier describes what the four current posts cover (two on webs, one on Google Maps, one on GEO); "automatización" from the title tag is left out because no post covers it yet. Checked against `keywordOwners` in `src/data/seo-intents.ts`: no owned term is a substring of its normalised form ("seo local" without "sevilla", no "diseño web sevilla", no "como aparecer en google maps").
- `title={{ text: "Guías claras para decidir sin tecnicismos", accent: "sin tecnicismos" }}`. Assumption: no criterion fixes the display title; "sin tecnicismos" comes from the current lead.
- `subtitle="Guías prácticas y sin jerga para dueños de negocios en Sevilla que quieren entender su web, su ficha de Google y las búsquedas con IA antes de invertir."` One sentence: what (guides on web, Google listing, AI search) and for whom (business owners in Seville). Assumption: new copy; no figure, no promise.
- Primary CTA: `BookingButton` default label ("Reserva una primera sesión", `src/components/BookingButton.astro`); no `secondaryLink`. Assumption: the list starts right below the hero, so a jump link would only add words.
- Hierarchy: H1 keyword (small, `--text-secondary`, from `.tpl-kw`), display title (largest text on the page), subtitle, button. Nothing else above the fold.

### 2. Posts (`SectionContainer id="blog-entradas"`)

Heading: `SectionHeading` (`src/components/seo-local/SectionHeading.astro`) with `id="blog-entradas-title"`, `keyword="Guías publicadas"`, `title={{ text: "De la más reciente a la más antigua", accent: "más reciente" }}`. Assumption: the display title states the sort order, so the list needs no extra label. The keyword contains no owned term.

List: one `<ul class="post-rows">` (margin-top 2.5rem, no list style, no padding, `border-bottom: 1px solid var(--hairline)`), one `<li class="post-row">` per non-draft post, `pubDate` descending. No new text per post: date, title and description come from the frontmatter verbatim, never shortened, truncated or line-clamped.

Row anatomy (DOM order = reading order = visual order):

1. `<time class="post-date" datetime={post.data.pubDate.toISOString()}>{formatDate(post.data.pubDate)}</time>`, e.g. "21 de septiembre de 2026".
2. `<div class="post-body">` holding `<h3 class="post-title"><a class="tpl-link" href={`/blog/${post.slug}/`}>{post.data.title}</a></h3>` then `<p class="post-text">{post.data.description}</p>`.

No icons, no arrow glyphs, no "Leer artículo" label, no card surface, no rounded box, no featured row (Decision 5), no whole-row click target.

Tokens and type (all from `src/styles/template.css`, no literal colours, no Tailwind colour utilities):

- Row: `padding-block: 1.5rem`, `border-top: 1px solid var(--hairline)` (same as `.resource-row`).
- `.post-date`: `display: block`, `--text-muted`, 0.875rem, weight 500, line-height 1.5, `font-variant-numeric: tabular-nums`, lowercase month as produced by `es-ES`, no letter-spacing, no uppercase. Allowed to wrap; no `white-space: nowrap`.
- `.post-title`: margin 0 0 0.5rem, 1.25rem (1.375rem from 768 px), weight 600, line-height 1.25, `text-wrap: balance`. Its colour and underline come from the shared `.tpl-link` (`--text-body`, `sky-signal` underline at 70%, `--sky-accent` on hover, 2px `--sky-signal` focus outline with 4px offset, 0.2s `--ease-out`). Do not restyle `.tpl-link` locally. Assumption: the underline stays on titles so the links are recognisable without relying on colour.
- `.post-text`: margin 0, `--text-secondary`, 1rem, line-height 1.65, `max-width: 60ch`.

Layout:

- Below 768 px: one column; date above title above description, row `display: grid; gap: 0.5rem`.
- From 768 px: each `li` is a grid `grid-template-columns: 11rem minmax(0, 1fr)`, `column-gap: 2rem`, `align-items: baseline`: the date forms a narrow left rail, title and description share the wide column, and the date baseline aligns with the title's first line. Assumption: a fixed narrow rail instead of `/recursos/`'s 0.8fr/1.2fr, because a date needs about 11rem and a wider column would leave dead space; the split stays asymmetric (DESIGN.md Asymmetry Rule).
- 1024 px and up: same grid; `SectionContainer` caps the width at `lg:max-w-4xl`.
- 320 px: content width 288 px; long titles and descriptions wrap, nothing overflows horizontally (no URL is shown as text).

### 3. Closing (`src/components/seo-local/SeoLocalClosing.astro`, no `visual` slot)

- `headingId="blog-cierre-title"`, `keyword="Reserva una llamada"`, `title={{ text: "¿Quieres aplicarlo a tu negocio?", accent: "a tu negocio" }}`, `text="Si después de leer te quedan dudas sobre tu web, tu ficha de Google o las búsquedas con IA, lo vemos juntos en una llamada."`, `ctaLabel` and `meta` left at their defaults ("Reservar una llamada"; "30 minutos · Sin compromiso · Directamente conmigo"). Assumption: new copy; no figure, no promise of results.

### States

- Static page built from the `blog` collection at build time: loading, error, partial and disabled states n/a.
- Empty list: not a UI state. With zero non-draft posts the page falls under the 150-word floor and `check-seo-17` fails the build (Decision 6); no empty-state message is rendered.
- Long or many posts: titles and descriptions wrap without truncation; a fifth post adds a row (word range handled per Risks).

### Word budget

Estimate of visible words in `<main>`: breadcrumbs 2, hero ~45 (H1 8, display 6, subtitle 27, button 4), posts heading 9, four rows ~169 (dates 20, titles 53, descriptions 96), closing ~40: about 265, inside `[150, 350]`. Over 350: follow the trim order in Decisions (closing text first, then the hero subtitle); never touch post data.

### Interactions and motion

- Hover only on links (`.tpl-link` colour to `--sky-accent`); rows have no hover state. `BookingButton` keeps its own states.
- No new animation. The only motion is the existing `SectionContainer` view-timeline reveal (`src/components/SectionContainer.astro`); a section already inside the first viewport is past its entry range and renders at full opacity, and everything is static under `prefers-reduced-motion: reduce`. No per-row stagger.
- Post links open in the same tab.

### Accessibility hand-off

- Heading outline: one `h1` (hero keyword), `h2` "Guías publicadas", one `h3` per post title, `h2` "Reserva una llamada". Display titles stay `<p>` (from `SectionHeading`).
- Focus order: header, breadcrumb "Inicio", hero booking button, the post title links newest first, closing booking button, footer. Each title link shows the 2px `--sky-signal` outline from `.tpl-link`.
- Link text is the post title: distinct and meaningful out of context, no `aria-label` override.
- `<time datetime>` carries the machine date; the visible date is the `es-ES` long format.
- Contrast pairings are existing template pairings: `--text-muted` on `--ink-ground` for dates, `--text-secondary` for descriptions, `--text-body` for title links.
