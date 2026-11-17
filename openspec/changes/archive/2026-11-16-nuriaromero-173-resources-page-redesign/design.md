# Design

## Context

See proposal.md (Why). State on `develop` (a62e1cd), plus NRD-212 merged before this story per sprint order:

- `src/pages/recursos.astro`: `Layout` (title "Recursos para citar y compartir — Nuria Romero", description unchanged), `breadcrumbSchema` (Inicio, Recursos), `<main class="px-4 pt-24">` with `Breadcrumbs`, an `<h1>` "Recursos para citar y compartir", a gray lead, a page-local `resources` array of four `{ title, description, href, label }` rendered as identical gray cards with `h2` titles and "label →" links, and an aside "Criterio de transparencia" with the no-link-buying policy.
- `scripts/check-seo-13.mjs` on `dist/recursos/index.html`: H1 matches `/<h1[^>]*>\s*Recursos para citar y compartir\s*<\/h1>/`; links `href="/sobre-mi/"`, `"/portfolio/"`, `"/blog/"`, `"/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/"`; text "No se compran enlaces". `SeoLocalHero` renders the keyword as `<h1 class="tpl-kw">…</h1>` (seen on `dist/contacto/index.html`), which satisfies the regex.
- `tests/casos-exito.test.js` requires `href: "/portfolio/",\s*label: "Ver casos de éxito"` in the page source and no "Ver portfolio".
- `tests/keyword-ownership.test.js` and `check-seo-07` check title, H1 and H2 only; `LISTING_CARD_EXEMPTION` applies to `/blog/` h2 cards.
- Non-service template precedent: `/contacto/` (NRD-171).

## Goals / Non-Goals

**Goals:**

- The page in the ink world, at most 250 words, the four resources and the policy intact for SEO-13.

**Non-Goals:**

- New resources, illustrations, FAQ, proof, plans, Service.

## Decisions

**Approach.** Compose like `/contacto/`: `Layout` plus template components for the hero and the closing; the resources section uses `SectionHeading` (keyword `h2` + display title) followed by page-local index rows styled with `src/styles/template.css` tokens. Rows, not tiles, because the content is a short index of links.

1. **Rows, not bento.** `ReviewBento` has a fixed six-area map (`a a a a b b / c c d d d d / c c e e e e / f f f f f f`); four resources leave holes, and filling six tiles means adding two resources (text the story rules out) plus a six-kind illustration set. Rows satisfy "disposición asimétrica" through an unequal two-column grid (from 768 px: a narrow column with the resource type as a small `--text-muted` label and the `h3` title, a wide column with the sentence and the text link), `--hairline` separators, and one emphasised row (the GEO guide, the most citable resource) with a `--sky-signal` left rule; one column below 768 px. No glyph icons, no arrows as glyphs (link text only), no cards.
2. **Row titles are `h3`.** The section keyword is the `h2`; resource titles are `h3`, so they never count as targeting a term owned by a post (the ownership check reads title, H1 and H2), which meets the story's NRD-117 criterion without a new exemption.
3. **Transparency note inside the resources section.** A short paragraph after the rows (one or two sentences) keeps "No se compran enlaces" and the no-invented-evidence idea; it is not a separate section, to save words and avoid a second keyword heading with little content.
4. **Data shape.** The page keeps a `resources` array; each item `{ kind, title, text, href, label }` with `href` written before `label` (so `tests/casos-exito.test.js` keeps matching `href: "/portfolio/",\s*label: "Ver casos de éxito"`). Labels may change except "Ver casos de éxito".

Alternatives considered: six-tile bento with `ResourceTileArt` (rejected, decision 1); `SeoLocalRelated` pills only (rejected: pills carry an anchor but no sentence, so the page would lose the "who is it for" of each resource).

### TL decisions on the UX open questions (2026-11-16)

1. **Emphasised row: confirmed.** A 1 px `--sky-signal` left rule (not thicker: DESIGN.md depth is 1 px hairlines and the craft floor bans thick side stripes) plus the kind label "Guía destacada" in `--sky-accent`; the emphasis is in the text, not only in colour. Decision 1's "left rule" means this 1 px rule.
2. **GEO row stays fourth.** The list reads as a path (who I am, my work, my guides, the one guide most worth citing), and the featured row closes the index right above the transparency note, which also speaks about limits. First position would change no file or test, but would put a single article above the profile and projects that give it context.
3. **Formatting of this file.** A Prettier hook (NRD-211 bug: it formats files outside the repo) reformatted this design after the UX edit. Checked against the original: only table column padding and the `Resource` type split across lines changed; no wording changed.

### Section map

| #   | Section     | Component                                                               | Content                                                                                                                                                                                                                                                                                                                                  |
| --- | ----------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0   | breadcrumbs | `Breadcrumbs`                                                           | unchanged array (Inicio, Recursos)                                                                                                                                                                                                                                                                                                       |
| 1   | hero        | `SectionContainer` > `SeoLocalHero` (no visual)                         | `keyword="Recursos para citar y compartir"` (exact, H1); display title with one accent; subtitle of one or two sentences (GEO-1: public pages and guides on web, local SEO, automation and AI search, for whoever wants to cite or share them); booking button default                                                                   |
| 2   | resources   | `SectionContainer id="recursos-lista"` > `SectionHeading` + rows + note | keyword h2 (no owned term, for example "Páginas y guías para enlazar"), display title; four rows: perfil (`/sobre-mi/`), casos de éxito (`/portfolio/`, label "Ver casos de éxito"), guías prácticas (`/blog/`), guía sobre GEO (`/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/`, emphasised); note with "No se compran enlaces" |
| 3   | closing     | `SeoLocalClosing`                                                       | keyword h2 (for example "Reserva una llamada"), display title, one short text, default CTA and meta                                                                                                                                                                                                                                      |

**Word cap (250).** Expected: breadcrumbs ~2, hero ~40, resources ~120 (headings ~10, four rows x ~22 with type label, title, sentence and link, note ~25), closing ~45; total ~210. If over 250, trim in this order: (1) closing text to one sentence; (2) row sentences to one short clause; (3) the note to the policy sentence. Never remove a resource, a link or "No se compran enlaces". Trimming beyond this order is explained in the PR description.

### Files

All in layer `app`.

Create:

- `tests/recursos-template.test.js`.

Modify:

- `src/pages/recursos.astro`: section map; imports `Breadcrumbs`, `SectionContainer`, `SeoLocalHero`, `SectionHeading`, `SeoLocalClosing`, `@/styles/template.css`; scoped styles for the rows using only template tokens (`--hairline`, `--hairline-quiet`, `--text-*`, `--sky-signal`, `--sky-accent`, `--ease-out`), 2 px `--sky-signal` focus outline on row links; keeps `Layout` title, description and `breadcrumbSchema(breadcrumbs)`.
- `scripts/lib/template-pages.mjs`: `{ route: "/recursos/", words: [100, 250], service: false }` (the contract needs a lower bound; 100 guards against an empty page).

Unchanged and green: `scripts/check-seo-13.mjs`, `tests/casos-exito.test.js`, `tests/keyword-ownership.test.js`, `tests/breadcrumb-trailing-slash.test.js`, `tests/one-h1.test.js`, `public/llms.txt` (line 24), `check-seo-07`.

### Interfaces

Page-local type only:

```ts
type Resource = {
  kind: string;
  title: string;
  text: string;
  href: string;
  label: string;
};
```

### Data

None: no storage or schema change. JSON-LD stays BreadcrumbList.

### Test plan (TDD order)

Task 1.1 (NRD-220), RED first in `tests/recursos-template.test.js` (source and `dist/` assertions as in `tests/contact-template.test.js`):

1. Source: `<main class="template-ground`; order `Breadcrumbs`, `SeoLocalHero`, `SectionHeading`, `SeoLocalClosing`; `keyword="Recursos para citar y compartir"`; no `text-gray-`, `bg-gray-`, `border-gray-`, `→`, `SeoLocalFaq`, `ProofStrip`, `SeoLocalPlans`, `ReviewBento`; schema is `breadcrumbSchema(breadcrumbs)` only; four resources whose `href` end in `/` and include the four SEO-13 routes; `href: "/portfolio/",` followed by `label: "Ver casos de éxito"`; row titles rendered as `h3`; the `templatePages` entry exists. Scenarios "Sections in order", "Legacy blocks removed", "Resource links and policy", "Breadcrumbs only".
2. Add the template entry, observe `pnpm build && pnpm check:seo-17:dist` RED, implement with the UI spec copy; built page: exactly one H1 with the exact text, "No se compran enlaces" present, ownership check green, at most 250 words; `pnpm check:seo-13:dist` green. Scenarios "Direct answer in the hero", "Word cap", "Ownership check passes".
3. `node --test tests/*.test.js`, `pnpm build`, `pnpm check:seo:dist` green.

### Real-browser / e2e checks (QA)

- `/recursos/` at 375, 768, 1024 and 1280 px against the UI spec: rows asymmetric from 768 px, one column below, emphasised GEO row, no overflow.
- Keyboard: breadcrumbs, hero CTA, the four row links, closing CTA; 2 px sky focus visible on every row link.
- Rich Results Test: BreadcrumbList only.

### ADRs relied on

0003, 0004, 0005, 0006, 0008, 0012, 0013, 0014, 0015.

## Risks / Trade-offs

- [UI spec prefers a bento] -> decision 1 explains why rows; if the UI spec still chooses a bento it must keep four resources' worth of text under 250 words and add the illustration component within this task, and the tech lead revises the Files list.
- [Page-local row styles drift from the template] -> tokens only, no copied values (ADR 0014); reviewed by ux-review.
- [SEO-13 regression] -> the test asserts the four routes, the exact H1 and the policy text before the change.
- Size: one work unit for 2 points; no size concern.

## UI spec

Reference world: `DESIGN.md` (ink template, `src/styles/template.css`). Visitor mode: Read (a short index of linkable pages), with the booking call as the secondary conversion. Design skill `impeccable:impeccable` (shape) consulted; its interview and setup steps were skipped (unattended), answers taken from the story, this design and `/contacto/`.

### Page frame

- `<main class="template-ground px-4 pt-24">` (no bottom padding: the closing band is the last element, as in `src/layouts/ServiceLayout.astro` template variant), inner `<div class="space-y-24">` holding three `SectionContainer` blocks plus the closing. Order: hero (with `Breadcrumbs` inside its container, as on `src/pages/contacto.astro`), resources, closing.
- No `.band` wrapper on the resources section: the closing band must stay the only band and the last one (DESIGN.md composition rule).
- Header, Footer and WhatsApp button unchanged (old-world shared pieces).

### 1. Hero (`src/components/seo-local/SeoLocalHero.astro`, no `visual` slot, so `hero-solo`)

- `keyword="Recursos para citar y compartir"` (exact, renders the only `h1`).
- `title={{ text: "Páginas útiles para enlazar con criterio", accent: "con criterio" }}`. Assumption: no criterion fixes the display title; it restates the policy idea in one serif phrase.
- `subtitle="Mi perfil, mis casos de éxito y mis guías sobre webs, SEO local, automatización y búsquedas con IA. Están pensadas para quien escriba sobre estos temas y quiera citarlas o compartirlas."` Two sentences: what (sentence 1) and for whom (sentence 2), GEO-1. Assumption: audience wording inferred from the current lead; no invented audience claim (no "periodistas", no figures).
- Primary CTA: `BookingButton` default label ("Reserva una primera sesión"); no `secondaryLink`. Assumption: a secondary "Ver recursos" jump link would add words for a list that starts one screen below.
- Hierarchy: H1 keyword (small, `--text-secondary`), display title (largest text on the page), subtitle, button. Nothing else above the fold.

### 2. Resources (`SectionContainer id="recursos-lista"`)

Heading: `SectionHeading` (`src/components/seo-local/SectionHeading.astro`) with `id="recursos-lista-title"`, `keyword="Páginas y guías para enlazar"`, `title={{ text: "Elige la que encaje con tu texto", accent: "con tu texto" }}`. `SectionContainer` (`src/components/SectionContainer.astro`) already renders the `<section>` and accepts only `id` and `class`; no extra wrapper or new prop. Assumption: the h2 heads the region, as on `/contacto/`. Keyword contains no owned term (`src/data/seo-intents.ts`).

Rows: a `<ul class="resource-rows">` (margin-top 2.5rem) with four `<li class="resource-row">`, in this order and with this exact copy (`kind` / `h3` title / sentence / link label):

| #   | kind           | title (`h3`)         | text                                                                                             | href                                                    | label              |
| --- | -------------- | -------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------- | ------------------ |
| 1   | Perfil         | Perfil y experiencia | Quién soy, cómo trabajo y cómo contactar para confirmar una colaboración.                        | `/sobre-mi/`                                            | Conocer a Nuria    |
| 2   | Proyectos      | Casos de éxito       | Proyectos reales que puedes revisar en sus dominios públicos.                                    | `/portfolio/`                                           | Ver casos de éxito |
| 3   | Blog           | Guías prácticas      | Artículos sobre webs, SEO local, automatización y búsquedas con IA para negocios.                | `/blog/`                                                | Leer el blog       |
| 4   | Guía destacada | Guía sobre GEO       | Qué es el posicionamiento en búsquedas con IA, qué acciones ayudan y qué no se puede garantizar. | `/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/` | Abrir la guía      |

Assumption: sentences shortened from the current page (same facts, nothing added); labels kept from the current page ("Ver casos de éxito" is fixed by `tests/casos-exito.test.js`).

Row anatomy (DOM order = reading order): `<div class="row-head">` with `<p class="row-kind">` then `<h3 class="row-title">`; `<div class="row-body">` with `<p class="row-text">` then `<a class="tpl-link">`. No icons, no arrow glyphs, no card surface, no rounded box.

Tokens and type (all from `src/styles/template.css`, no literal colours):

- Row: `padding-block: 1.5rem`, `border-top: 1px solid var(--hairline)`; the list gets `border-bottom: 1px solid var(--hairline)` so the index is closed top and bottom.
- `.row-kind`: `--text-muted`, 0.875rem, weight 500, sentence case, no letter-spacing, no uppercase (DESIGN.md bans tracked eyebrows), margin-bottom 0.25rem.
- `.row-title`: `--text-strong`, 1.25rem (1.375rem from 768 px), weight 600, line-height 1.25, `text-wrap: balance`, margin 0.
- `.row-text`: `--text-secondary`, 1rem, line-height 1.65, `max-width: 52ch`, margin 0 0 0.75rem.
- Link: the shared `.tpl-link` class (underline in `sky-signal` at 70%, `--sky-accent` on hover, 2px `--sky-signal` focus outline, offset 4px, 0.2s `--ease-out` colour transition). Do not restyle it locally.

Emphasised row (row 4, GEO guide): `border-left: 1px solid var(--sky-signal)` plus `padding-left: 1.25rem`, and its `.row-kind` in `--sky-accent` instead of `--text-muted`. Assumption: the rule is 1 px, not thicker; side stripes above 1 px are a banned pattern in the impeccable craft floor and DESIGN.md depth is "1px hairlines". Emphasis comes from the sky rule plus the kind label "Guía destacada", not from size or a surface. Its top and bottom hairlines stay `--hairline`.

Transparency note: one `<p class="resource-note">` after the list, margin-top 1.5rem, `--text-muted`, 0.9375rem, line-height 1.6, `max-width: 60ch`, text exactly: "No se compran enlaces ni se intercambian de forma artificial. Tampoco publico cifras, testimonios ni colaboraciones sin evidencia verificable." No heading, no box, no icon. Assumption: wording condensed from the current aside; it keeps the literal "No se compran enlaces" required by `check-seo-13`.

Layout:

- Below 768 px: one column; `row-head` above `row-body` (gap 0.5rem). At 320 px nothing overflows: the long GEO href is never shown as text, only the label.
- From 768 px: each `li` is a two-column grid `minmax(0, 0.8fr) minmax(0, 1.2fr)` (the FAQ ratio from DESIGN.md asymmetry rule), `column-gap: 2.5rem`, `align-items: baseline` so the kind/title column and the sentence start on one line. Narrow column: kind + title; wide column: sentence + link.
- 1024 px and up: same grid; `SectionContainer` caps the width at `lg:max-w-4xl`.

### 3. Closing (`src/components/seo-local/SeoLocalClosing.astro`, no `visual` slot)

- `headingId="recursos-cierre-title"`, `keyword="Reserva una llamada"`, `title={{ text: "¿Necesitas algo más que un enlace?", accent: "más que un enlace" }}`, `text="Si tu negocio necesita una web, SEO local o automatizar tareas, lo hablamos directamente."`, `ctaLabel` and `meta` default ("Reservar una llamada"; "30 minutos · Sin compromiso · Directamente conmigo"). Assumption: copy is new; no figure or promise.

### States

Static page with no data fetching: loading, empty, error and partial states n/a. Disabled states n/a. The four resources are hard-coded; a missing item is a build-time test failure, not a UI state.

### Word budget

Estimated visible words in `<main>`: breadcrumbs 2, hero ~43, resources ~115 (headings 11, rows ~82, note 20), closing ~32: about 192, under the 250 cap with room for the developer's measured count. If the measure exceeds 250, follow the trim order in Decisions.

### Interactions and motion

- Hover: only on links (`.tpl-link` colour shift to `--sky-accent`, 0.2s `--ease-out`); rows themselves have no hover, no whole-row click target. BookingButton keeps its own states.
- No new animation. The only motion is the existing `SectionContainer` view-timeline reveal shared by every template page; sections in the first viewport render complete at first paint, and everything is static under `prefers-reduced-motion: reduce`. No entrance animation on rows, the note or the emphasised rule.

### Accessibility hand-off

- Heading outline: one `h1` (hero keyword), `h2` "Páginas y guías para enlazar", four `h3` row titles, `h2` "Reserva una llamada". Display titles stay `<p>` (from `SectionHeading`).
- Focus order: header, breadcrumbs, hero booking button, the four row links in table order, closing booking button, footer. Every row link shows the 2px `--sky-signal` outline from `.tpl-link`.
- Link labels are distinct and meaningful out of context ("Conocer a Nuria", "Ver casos de éxito", "Leer el blog", "Abrir la guía"); no `aria-label` override needed. Internal links open in the same tab.
- The emphasis of row 4 is conveyed in text ("Guía destacada"), not only by the sky rule.
- Contrast: `--text-muted` (#94a3b8) on `--ink-ground` for kind labels and the note, `--sky-accent` for the emphasised kind label; both are existing pairings in the template.
