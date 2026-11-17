# Design

## Context

See proposal.md (Why). State on `develop` (f21567c):

- `src/pages/blog/[slug].astro` renders `<BlogPostLayout post={post}><Content /></BlogPostLayout>` for every non-draft post (4 today, none with `updatedDate` or `image`).
- `src/layouts/BlogPostLayout.astro`: `Layout` with `title`, `description`, `ogType="article"`, `ogImage={image}`; `<Schema slot="head">` with `articleSchema(...)` and `breadcrumbSchema(breadcrumbs)` (Inicio, Blog, post); `<main class="px-4 pt-24">` with a `SectionContainer` holding `Breadcrumbs` and `<article>` (gray `<header>` with `<h1>{title}</h1>`, description, "Por <a href="/sobre-mi/">Nuria Romero Castillo</a> · Publicado el <time>" and optional "Actualizado el <time>"), then `<EntryContentStyles />` and `<div class="entry-content"><slot /></div>`; then `InternalLinks` (gray aside, contextual links and a separate conversion line) and `CTASection` in their own containers.
- `src/components/EntryContentStyles.astro`: global `.entry-content` rules with `@apply` gray/blue utilities; also used by `src/layouts/LegalLayout.astro` (stays).
- Checks reading posts: `check-seo-06` (every `internalLinksBySource` link of each post as `<a href>` with its anchor inside `<main>`; all internal hrefs exist with trailing slash), `check-seo-07` (ownership: title, H1, H2 of every page; post H2s are body headings), `check-seo-08` (GEO post: first `<article>…</article>` holds an H2 "Respuesta corta", an `<ol>` and absolute service links), `check-seo-09` (GEO post `<article>`: `<a href="/sobre-mi/">Nuria Romero Castillo</a>`, "Publicado el … <time datetime="2026-09-21T00:00:00.000Z">"; Article `datePublished` and `author` `@id`), `check-seo-02` (one H1, BreadcrumbList last item equals canonical).
- Baseline precedent: `scripts/check-seo-16.mjs` freezes the reference page JSON-LD and headings in `tests/fixtures/seo-local-sevilla.baseline.json`, rewritten only with `--write`.
- `tests/package-scripts.test.js` requires, for every `scripts/check-seo-NN.mjs`, the scripts `check:seo-NN` (`pnpm build && node scripts/check-seo-NN.mjs`) and `check:seo-NN:dist`, ordered, and `check:seo:dist` chaining every check in numeric order.
- CI (`.github/workflows/ci.yml`) runs `node --test` before `pnpm build`, so tests that need `dist/` skip in CI; build-level guarantees belong in a `check-seo-NN` script.

## Goals / Non-Goals

**Goals:**

- Posts in the ink world with the NRD-163 related and closing sections.
- A CI-enforced proof that the post text, body links, metadata and Article / BreadcrumbList JSON-LD did not change.

**Non-Goals:**

- Any post text change, word budgets for posts, `LegalLayout`, the `/blog/` index (NRD-221).

## Decisions

**Approach.** Two work units. First, freeze the contract on the current layout: mark the body wrapper with `data-post-body`, add a pure helper that extracts the post contract from a built page, a build check that compares every built post with a JSON baseline, and generate the baseline from the current (old) layout. Second, recompose the layout on the template; the check must pass against the untouched baseline, which is the "body text before and after" proof the story asks for, enforced in CI and not only in a local test.

1. **Body marker, not a class.** `data-post-body` is a stable hook independent of styling classes (`entry-content` today, `post-prose` after). The helper finds the element carrying it and returns its inner HTML, closing it by balanced `<div>` counting (the same approach as `findMatchingDivClose` in `scripts/check-seo-02.mjs`), so nested markup cannot cut it short.
2. **What the baseline freezes.** Per slug: `title` (`<title>`), `description` (meta), `canonical`, `jsonld` (only the entities with `@type` `Article` and `BreadcrumbList`, from `jsonLdEntities`; the site-wide business and website entities are owned by `check-seo-11` and are not frozen here), `bodyText` (`visibleText` of the body) and `bodyLinks` (`anchorsIn` of the body: `{ href, text }` in order). The check fails if a post is added, removed or differs; `--write` regenerates it (a later story that edits a post on purpose, such as NRD-127/128, regenerates it in the same commit, as with `check-seo-16`).
3. **Check number 18.** Next free number on `develop`. NRD-223 adds the following one after this merges.
4. **Header.** The post title stays the only H1 and keeps its text; it is styled with the template display/headline tokens (large, `--text-strong`, `text-wrap: balance`) with no serif accent inside the H1 (choosing an accent phrase per post would be a content decision). The DESIGN.md keyword-heading rule applies to sections; an article title is its own heading, the documented exception. The serif accent of the page appears in the closing heading (`SeoLocalRelated` has no heading). TL decision 2026-11-16: this meets the story's Visual criterion; the header's "acento serif" in the story scope lists ingredients of the ink world, and putting it in the header would mean either an `<em>` chosen per post inside the H1 (a content decision) or serif body copy (banned by the One Serif Phrase Rule). The header carries the ink tokens and the sky/hairline treatment instead. Description as lede (`--text-secondary`), byline in `--text-muted` with the author link styled as `.tpl-link`, "Publicado el" and "Actualizado el" texts unchanged (check-seo-09). A 1 px `--hairline` rule separates header and body.
5. **Prose.** Rules live in the layout `<style>` as `.post-prose :global(h2)`, `:global(p)`, ... (slotted Markdown carries no scope attribute; ADR 0014 consequence). Tokens only: headings `--text-strong`, body `--text-body`/`--text-secondary`, links `--text-body` underlined in `sky-signal` at 70% with `--sky-accent` hover and a 2 px `--sky-signal` focus outline (the `.tpl-link` treatment, since Markdown links cannot take a class), `strong` `--text-strong`, `hr` and table borders `--hairline`, table header on `--card-surface`. Measure about 68ch. Lists keep their markers (they are content, not decorative numbering). The table keeps table semantics (no `display: block` on `table`): `width: 100%`, smaller type, cells wrap (`overflow-wrap: anywhere`, `hyphens: auto` under `lang="es"`), so the page never overflows at 320-375 px.
6. **Related links.** `SeoLocalRelated links={internalLinksBySource[url] ?? []}` in its own `SectionContainer` after the article; contextual and conversion links render as the same pills with their mapped anchors (same destinations, `check-seo-06`). The UI spec may set a `label` (default "Sigue leyendo").
7. **Closing.** `SeoLocalClosing` with one generic copy for every post (layout constants, not per-post data): keyword h2 without an owned term (for example "Reserva una llamada"), display title with one accent, one sentence, default CTA and meta. No figures or promises.
8. **Container order.** `<main class="template-ground px-4 pt-24">` with `<div class="space-y-24">`: article container, related container, closing container (closing last, the only band). `<article>` contains header and body only, so `check-seo-08`/`09` keep matching the first `<article>`.

Alternatives considered: comparing post text in a `tests/` file reading `dist/` (rejected as the only guard: it skips in CI because tests run before the build); hashing the Markdown sources (rejected: proves the sources did not change, not that the layout renders the same body).

### Files

All in layer `app`.

Task 1.1 (NRD-225), contract:

- Create `scripts/lib/post-contract.mjs`: `postBodyHtml(html)`, `postContract(html)`.
- Create `scripts/check-seo-18.mjs`: reads every `dist/blog/<slug>/index.html` (directories under `dist/blog/` holding an `index.html`), builds `{ [slug]: postContract(html) }`, compares with the fixture (`assert.deepEqual` per slug with a message naming slug and field), `--write` rewrites it.
- Create `tests/fixtures/blog-posts.baseline.json` (generated, never hand-edited).
- Modify `src/layouts/BlogPostLayout.astro`: `data-post-body` on `<div class="entry-content">` only.
- Modify `package.json`: `"check:seo-18": "pnpm build && node scripts/check-seo-18.mjs"`, `"check:seo-18:dist": "node scripts/check-seo-18.mjs"` after the `check:seo-17` pair, and ` && node scripts/check-seo-18.mjs` at the end of `check:seo:dist`.
- Create `tests/post-contract.test.js`.

Task 1.2 (NRD-226), layout:

- Modify `src/layouts/BlogPostLayout.astro`: decisions 4-8; imports `SeoLocalRelated`, `SeoLocalClosing`, `@/styles/template.css`; removes `CTASection`, `InternalLinks`, `EntryContentStyles`; keeps `Layout` props, `Schema` block, `breadcrumbs`, `url`, `formatDate`.
- Create `tests/blog-post-template.test.js`.

Unchanged: `src/pages/blog/[slug].astro`, `src/content/blog/*.md`, `src/data/internal-links.ts`, `src/lib/schema.ts`, `src/components/EntryContentStyles.astro`, `src/layouts/LegalLayout.astro`, checks 02/06/07/08/09.

### Interfaces

```js
// scripts/lib/post-contract.mjs
/** Inner HTML of the element marked data-post-body; throws Error("post body marker not found") when absent. */
export function postBodyHtml(html: string): string;

/** Frozen contract of a built post page. */
export function postContract(html: string): {
  title: string;
  description: string;
  canonical: string | null;
  jsonld: object[];                 // Article and BreadcrumbList entities, in document order
  bodyText: string;                 // visibleText(postBodyHtml(html))
  bodyLinks: { href: string | null; text: string }[]; // anchorsIn(postBodyHtml(html))
};
```

Reuses `visibleText`, `anchorsIn` (`scripts/lib/main-links.mjs`) and `jsonLdEntities` (`scripts/lib/page-contract.mjs`).

### Data

No storage or schema change. New committed fixture `tests/fixtures/blog-posts.baseline.json` (generated). JSON-LD unchanged.

### Test plan (TDD order)

Task 1.1 (NRD-225):

1. RED `tests/post-contract.test.js`: synthetic page with a header (`<h1>`, byline), `<div class="x" data-post-body><h2>A</h2><div><p>B <a href="/c/">d</a></p></div><p>E</p></div>`, then a related nav and a closing: `postContract` returns `bodyText` "A B d E", `bodyLinks` `[{ href: "/c/", text: "d" }]`, title/description/canonical from the head, `jsonld` keeps only Article and BreadcrumbList; a page without the marker throws; `src/layouts/BlogPostLayout.astro` contains `data-post-body`; `package.json` has the `check:seo-18` pair (also covered by `tests/package-scripts.test.js`). Scenario "Body text and links match the baseline" (mechanism).
2. GREEN: helper, marker, check, scripts; `pnpm build && node scripts/check-seo-18.mjs --write` on the OLD layout; inspect the fixture (4 slugs, non-empty `bodyText`, GEO post table text present); `pnpm check:seo:dist` green.

Task 1.2 (NRD-226):

1. RED `tests/blog-post-template.test.js` (source): no `CTASection`, `InternalLinks`, `EntryContentStyles`, `text-gray-`, `bg-gray-`, `border-gray-`; `template-ground`; `SeoLocalRelated` fed from `internalLinksBySource[url]` (directly or through a `relatedLinks` constant; the UI spec renders its container only when the list is non-empty, so the assertion matches the source expression, not a fixed JSX shape); `SeoLocalClosing` after it; exactly one `<h1` whose content is `{title}`; `data-post-body` between `<article` and `</article>`; "Publicado el" and "Actualizado el" texts; `href="/sobre-mi/"`; `articleSchema({ title, description, url, pubDate, updatedDate, image })` and `breadcrumbSchema(breadcrumbs)` kept; `` const url = `/blog/${post.slug}/` `` kept. Scenarios "Legacy styles removed", "Header content", "Update date shown only when set", "Closing band with booking".
2. Built-page block (skip without `dist/`): for each post, one H1 equal to the frontmatter title; last `<section>` in `<main>` is the closing with the booking URL from `src/data/site.ts`. Scenario "Closing band with booking".
3. GREEN: implement per the UI spec; `node --test tests/*.test.js`, `pnpm build`, `pnpm check:seo:dist` green with `check-seo-18` against the UNCHANGED baseline (scenarios "Body text and links match the baseline", "Metadata and JSON-LD match the baseline"), 06 ("Mapped links inside main"), 02/07 ("Ownership and link checks pass"), 08 and 09. `git diff develop -- src/content/blog` empty ("Markdown sources untouched").

### Real-browser / e2e checks (QA)

- The four posts at 375, 768 and 1280 px: header hierarchy, prose measure, lists, the GEO post table (no page overflow at 320/375 px, cells wrap), related pills wrap, closing band.
- Contrast: body text, links (rest, hover), table header text on `--card-surface`, byline muted text: WCAG 2.2 AA.
- Keyboard: breadcrumbs, author link, every body link, related pills, closing CTA; visible 2 px sky focus on body links and pills.
- No animated element starts below AA in the first viewport (the article container is visible at first paint).
- `/blog/` -> post -> service page stays in the ink world (with NRD-221).
- Rich Results Test on one post: Article and BreadcrumbList unchanged.

### ADRs relied on

0003, 0004, 0005, 0006, 0008, 0012, 0013, 0014.

## Risks / Trade-offs

- [Astro output of the Markdown changes between builds (heading ids, entities)] -> the contract stores visible text and link href/text only, not raw HTML; heading ids and attributes do not count.
- [Baseline generated after the layout change by mistake] -> task order and `Blocks` link (NRD-225 blocks NRD-226); NRD-226 forbids `--write`; the PR shows the fixture added in the 1.1 commit, before the layout commit.
- [Future content stories must regenerate the baseline] -> documented in the check header comment; intended, like `check-seo-16`.
- [Merge order with NRD-223] -> both add a check and edit `package.json`; NRD-223 takes the next number after 18 and rebases on `develop` (sprint order).
- [Prose styles diverge from legal pages] -> intended: legal pages keep `LegalLayout` (PRD), `EntryContentStyles` untouched.
- Size: 3 points, two work units; no size concern.

## UI spec

Mode: Read (the visitor understands something; the reading experience comes first, persuasion only at the end). World: the ink template of `DESIGN.md` and `src/styles/template.css`; no new token, color, font or component. Everything new is scoped CSS in the `<style>` of `src/layouts/BlogPostLayout.astro` reading the existing custom properties. Reference compositions: `src/pages/recursos.astro` (container order, `space-y-24`, solo closing) and `src/pages/seo-local-sevilla.astro`.

### 1. Page frame (`src/layouts/BlogPostLayout.astro`)

- `<main class="template-ground px-4 pt-24">` > `<div class="space-y-24">` > three `SectionContainer` (`src/components/SectionContainer.astro`) in this order: (1) article, (2) related links, (3) closing. Same skeleton as `src/pages/recursos.astro`.
- Container (1): `Breadcrumbs` (`src/components/Breadcrumbs.astro`, items unchanged, outside the `<article>`), then `<article>` holding only `<header class="post-header">` and `<div class="post-prose" data-post-body><slot /></div>`.
- Alignment: everything left-aligned inside the container (max 56rem from `lg:max-w-4xl`), like the reference page; nothing is centered.
- Import `@/styles/template.css` in the frontmatter (the components already import it; the layout needs it for `.tpl-display` and `.tpl-link` on its own markup).
- Motion: `SectionContainer` keeps its existing scroll reveal. The article container starts in the first viewport, so its `view()` progress is already past `entry 35%` at first paint and it renders fully opaque (same as the recursos hero container). No other animation is added.

### 2. Post header (`<header class="post-header">`)

Reading order: H1, lede, byline. No action in the header; the only interactive element is the author link.

- **H1**: `<h1 class="tpl-display post-title">{title}</h1>`, text exactly the frontmatter title, no accent `<em>` and no keyword heading above it (documented exception, design decision 4). `.tpl-display` gives `--text-strong`, 700, `-0.03em`, `text-wrap: balance`. Scoped `.post-title`: `max-width: 24ch; margin: 0 0 1.25rem; font-size: clamp(2rem, 5vw, 2.75rem); line-height: 1.1;`. Assumption: smaller ceiling than the 3.5rem Display token and 24ch instead of 16ch because post titles run 64-78 characters; at 16ch/3.5rem they would take 5-6 lines.
- **Lede**: `<p class="post-lede">{description}</p>`: `--text-secondary`, `1.125rem`, `line-height: 1.65`, `max-width: 52ch`, `margin: 0` (DESIGN.md lead copy 48-52ch, same as `.hero-subtitle`).
- **Byline**: `<p class="post-meta">`, markup and text unchanged from today: "Por " + `<a href="/sobre-mi/" class="tpl-link">Nuria Romero Castillo</a>` + " · " + `<span>Publicado el <time datetime=…>…</time></span>` + optional `<span> · Actualizado el <time datetime=…>…</time></span>`. Style: `margin: 1.25rem 0 0; color: var(--text-muted); font-size: 0.9375rem; line-height: 1.6;`. The `<time>` elements inherit `--text-muted`; the author link takes `.tpl-link` (`--text-body`, sky underline at 70%, `--sky-accent` hover, 2px `--sky-signal` focus outline). The line wraps freely at 320 px (no `nowrap`). Assumption: wrapping is acceptable; "Publicado el 21 de septiembre de 2026" fits one line at 320 px on its own.
- **Divider**: `.post-header { padding-bottom: 2rem; border-bottom: 1px solid var(--hairline); margin-bottom: 2.5rem; }`.
- Header spacing from breadcrumbs: the existing `mb-6` of `Breadcrumbs` plus `.post-header { padding-top: 1rem }`. Assumption: gives the H1 the same breathing room as `SeoLocalHero` without its 2.5rem top padding.

### 3. Prose (`.post-prose`, slotted Markdown)

All rules as `.post-prose :global(<tag>)` (ADR 0014; slotted Markdown has no scope attribute). Elements present in the four posts: `h2`, `h3`, `p`, `ul`, `ol`, `li`, nested lists, `a`, `strong`, `em`, `hr`, `table` (GEO post only, 3 columns, 5 rows). No images, quotes or code; no rules for them.

- **Measure**: `.post-prose` has no max-width; `:global(p, ul, ol, h2, h3)` take `max-width: 68ch`. The table spans the full container width (more room for 3 columns).
- **First / last**: `> :global(:first-child) { margin-top: 0 }`, `> :global(:last-child) { margin-bottom: 0 }`.
- **p**: `color: var(--text-secondary); font-size: 1.0625rem; line-height: 1.75; margin: 0 0 1.25rem;`.
- **h2**: Onest 700, `font-size: clamp(1.5rem, 3vw, 1.875rem); line-height: 1.2; letter-spacing: -0.02em; color: var(--text-strong); margin: 3rem 0 1rem; text-wrap: balance; scroll-margin-top: 6rem;`. No serif accent and no keyword-heading pairing: body headings are content (the One Serif Phrase Rule applies to section headings). Assumption: `scroll-margin-top` keeps the fixed navbar off a heading reached by an in-page anchor.
- **h3**: `font-size: 1.25rem; font-weight: 650; line-height: 1.3; color: var(--text-strong); margin: 2rem 0 0.75rem;`.
- **ul / ol**: `margin: 0 0 1.25rem; padding-left: 1.5rem; color: var(--text-secondary); font-size: 1.0625rem; line-height: 1.7;` with `list-style: disc` / `decimal` kept (content, not decoration). `li + li { margin-top: 0.5rem }`; `li > ul, li > ol { margin: 0.5rem 0 0 }`. Markers: `ul > li::marker { color: var(--sky-signal) }`, `ol > li::marker { color: var(--text-muted); font-variant-numeric: tabular-nums }`. Assumption: sky bullet ties lists to the world; numbers stay quiet so they do not read as decorative step numbering.
- **a**: the `.tpl-link` treatment re-declared under `.post-prose :global(a)`: `color: var(--text-body); text-decoration: underline; text-decoration-color: rgb(var(--sky-signal-rgb) / 0.7); text-underline-offset: 0.3em; border-radius: 0.25rem; transition: color 0.2s var(--ease-out);` hover `color: var(--sky-accent)`; `:focus-visible { outline: 2px solid var(--sky-signal); outline-offset: 4px; }`. Under `prefers-reduced-motion: reduce` the transition is `none`. Links are told apart from `--text-secondary` paragraphs by underline plus the lighter `--text-body`, never by color alone.
- **strong**: `color: var(--text-strong); font-weight: 600;` (inside a link it keeps the link color on hover).
- **em**: Onest italic (inherit family); never Instrument Serif in the body.
- **hr**: `border: 0; border-top: 1px solid var(--hairline); margin: 3rem 0; max-width: none;`.
- **table** (keeps table semantics, no `display: block`): `width: 100%; border-collapse: collapse; margin: 2rem 0; font-size: 0.9375rem; line-height: 1.5; text-align: left;`. `th, td { padding: 0.75rem 0.875rem; border: 1px solid var(--hairline); vertical-align: top; overflow-wrap: anywhere; hyphens: auto; }` (page is `lang="es"`). `th { background: var(--card-surface); color: var(--text-strong); font-weight: 600; }`, `td { color: var(--text-secondary); }`, `td:first-child { color: var(--text-body); font-weight: 600; }`. Below 480px: `font-size: 0.875rem` and cell padding `0.5rem 0.625rem`. Assumption: the first column holds row labels ("Qué optimiza", "Dónde se nota", ...) rendered as `td` by Markdown, so it gets label weight without changing markup.

### 4. Related links (container 2)

- `<SeoLocalRelated links={internalLinksBySource[url] ?? []} />` (`src/components/seo-local/SeoLocalRelated.astro`), default label "Sigue leyendo" (no `label` prop). Contextual and conversion links render as the same pills, in map order, with their mapped anchors.
- Render container (2) only when the post has mapped links (`(internalLinksBySource[url] ?? []).length > 0`). Assumption: the component renders nothing for an empty list, and an empty `SectionContainer` would double the 6rem gap; all four posts have links today.
- Behavior from the component as is: top hairline, wrapping pills, `--sky-signal` border and `--sky-accent` text on hover, 2px focus outline.

### 5. Closing (container 3, last element of `<main>`)

`SeoLocalClosing` (`src/components/seo-local/SeoLocalClosing.astro`) without `visual` slot (`closing-solo`, no radial), one copy for every post as layout constants:

- `headingId="post-cierre-title"`
- `keyword="Reserva una llamada"` (Assumption: same keyword h2 as `/recursos/` and the service pages; owns no term.)
- `title={{ text: "¿Quieres aplicarlo a tu negocio?", accent: "a tu negocio" }}` (Assumption: generic for the four topics; the single serif accent of the page.)
- `text="Cuéntame tu caso y vemos juntos qué tiene sentido para tu web, tu ficha de Google o tus búsquedas con IA."` (Assumption: no figures, no promised result, fits the restaurants post as well.)
- `ctaLabel` and `meta` defaults ("Reservar una llamada", "30 minutos · Sin compromiso · Directamente conmigo").

### 6. Checklist coverage

- **States**: static page; the only conditional parts are the "Actualizado el" span (only with `updatedDate`) and container (2) (only with links). No loading, error or empty states.
- **Copy**: unchanged except the closing strings above; header strings unchanged (check-seo-09).
- **Design system reuse**: tokens `--ink-ground` (via `.template-ground`), `--text-strong`, `--text-body`, `--text-secondary`, `--text-muted`, `--hairline`, `--card-surface`, `--sky-signal`, `--sky-signal-rgb`, `--sky-accent`, `--ease-out`; classes `.template-ground`, `.tpl-display`, `.tpl-link`; components `SectionContainer`, `Breadcrumbs`, `SeoLocalRelated`, `SeoLocalClosing` (with `SectionHeading`, `BookingButton`). No new component.
- **Responsive**: single column at every width. 320-375 px: H1 at 2rem, prose at full width minus the 1rem `px-4` gutters, table cells wrap and hyphenate, related pills wrap, closing stacks; no horizontal overflow. 768 px+: measure caps prose at 68ch; H1 grows to 2.75rem by 880 px. Closing grid follows its component.
- **Interactions**: hover/focus as above for author link, body links and pills; booking button from `BookingButton`. No JS.
- **Accessibility hand-off**: one H1; body headings keep their Markdown order (h2 > h3). Focus order: navbar, breadcrumbs, author link, body links in reading order, related pills, booking button, footer. Related `nav` keeps `aria-label="Contenido relacionado"`; closing `section` is labelled by `post-cierre-title`. Contrast on `--ink-ground`: `--text-secondary` and `--text-muted` body/meta text, `--text-body` links and `--text-strong` headers on `--card-surface` all exceed 4.5:1; the 70% sky underline is decorative (links also differ by lightness and the underline itself).
