# Design

## Context

See proposal.md (Why). State on `develop` (a62e1cd), plus NRD-212 and NRD-217 (NRD-170 task 1.1) merged before this story per sprint order:

- `src/pages/portfolio.astro`: `Layout` (title "Casos de éxito — Webs para negocios en Sevilla", description unchanged), `Schema` with `breadcrumbSchema` (Inicio, Casos de éxito), `<main class="px-4 pt-24">` with `Breadcrumbs`, an `<h1>` with `CodeIcon` "Casos de éxito", a gray paragraph, `<Projects />` (all projects: arkady, adfsevilla) and `CTASection`.
- `tests/casos-exito.test.js` pins: breadcrumb `{ name: "Casos de éxito", url: "/portfolio/" }`, `title="Casos de éxito —`, a literal `<h1…>…Casos de éxito…</h1>` in the page source, no "proyectos propios", and the Header link label.
- After NRD-217: `RealProof` accepts `projectsVariant="ink"`, which renders `Projects variant="ink"` (0.9rem screenshots, no shadows, hairlines, asymmetric layout; same titles, descriptions, alt texts and links).
- Inbound links to `/portfolio/`: `/` and `/diseno-web-sevilla/` (ADR 0013 table A rows 4 and 5), `/recursos/`, Header. `/portfolio/` has no `internalLinksBySource` entry.
- Non-service template precedent: `/contacto/` (NRD-171).

## Goals / Non-Goals

**Goals:**

- The page in the ink world, at most 250 words, with the two real projects as the visual of the page.

**Non-Goals:**

- New content, FAQ, proof strip, plans, Service; switching other pages to ink cards.

## Decisions

**Approach.** Compose like `/contacto/`: `Layout` plus template components. The hero has no drawn visual (`SeoLocalHero` without the `visual` slot renders `hero-solo`): the real screenshots right below are the page's visual, and a drawing would add an "Ejemplo ilustrativo" next to real work. `RealProof` carries the projects with `projectsVariant="ink"` and the live review quote when present (excluded from the word cap by NRD-212's marker). Related links come from a new `internalLinksBySource["/portfolio/"]` entry so `SeoLocalRelated` renders them like on every template page.

1. **H1.** `SeoLocalHero keyword="Casos de éxito"` renders the single H1 (`SectionHeading level="h1"`). `tests/casos-exito.test.js` checks the page source for a literal `<h1>`; the assertion changes to `keyword="Casos de éxito"` on `<SeoLocalHero` plus a `dist/portfolio/index.html` check that the only H1 text is "Casos de éxito" (same guarantee, real output).
2. **Related links** (anchors in pills, no owned term, trailing slashes): `{ path: "/diseno-web-sevilla/", anchor: "diseño web para tu negocio", kind: "contextual" }`, `{ path: "/tienda-online-sevilla/", anchor: "tienda online para vender por internet", kind: "contextual" }`, `{ path: "/desarrollo-software-medida/", anchor: "software a medida para tu empresa", kind: "contextual" }`, `{ path: "/contacto/", anchor: "cuéntame tu proyecto", kind: "conversion" }`. `SeoLocalRelated` label: default ("Sigue leyendo") or one the UI spec sets.
3. **No proof strip.** The only sourced figures ("+10 años", "2 webs en Sevilla") would repeat what the two cards already show; the story allows it only with a real sourced datum.

Alternatives considered: a drawn hero mock (rejected: decoration next to real screenshots); `Projects` directly without `RealProof` (rejected: loses the keyword heading, the note and the live review, and the story names `RealProof`); a new portfolio-only card component (rejected: NRD-170 already provides the shared ink variant).

### TL decisions on the UX open questions (2026-11-16)

1. **Hidden new-tab hints count.** `mainWordCount` strips tags, not visually hidden text, so the two " (se abre en una pestaña nueva)" spans (about 12 words) are counted; NRD-170's UI spec already measures the ink cards at about 103 words with them. Estimate about 241 of 250: the hint wording stays (same as `/contacto/` and the other new-tab links), and the developer measures with `check-seo-17` and reports the count in the PR. Over 250: apply the trimming order below; the card text and the hints are shared and not trimmed here.
2. **Closing keyword made unique:** "Reserva una llamada sobre tu web" instead of "Reserva una llamada sobre tu proyecto" (already the closing h2 of `/desarrollo-software-medida/`). Duplicate H2 text across pages is harmless for the checks but weakens each page's outline; "web" matches what this page shows and is not an owned term. Same word count.

### Section map

| #   | Section     | Component                                                   | Content                                                                                                                                                                                                                         |
| --- | ----------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0   | breadcrumbs | `Breadcrumbs`                                               | unchanged array (Inicio, Casos de éxito)                                                                                                                                                                                        |
| 1   | hero        | `SectionContainer` > `SeoLocalHero` (no visual)             | `keyword="Casos de éxito"` (H1); display title with one accent; subtitle of one or two sentences (GEO-1: real websites for Seville businesses, visit each on its domain); booking button default; `secondaryLink` to `#trabajo-real` optional (UI spec) |
| 2   | real proof  | `SectionContainer id="trabajo-real"` > `RealProof`          | keyword h2 (no owned term, for example "Proyectos reales en Sevilla"), display title, `projects={["arkady", "adfsevilla"]}`, `reviews={reviewsData}`, note (one sentence saying what they are), `projectsVariant="ink"`         |
| 3   | related     | `SectionContainer` > `SeoLocalRelated`                      | `links={internalLinksBySource["/portfolio/"] ?? []}`                                                                                                                                                                            |
| 4   | closing     | `SeoLocalClosing`                                           | keyword h2 "Reserva una llamada sobre tu web" (TL decision 2), display title, one short text, default CTA and meta                                                                                                          |

**Word cap (250).** Expected: breadcrumbs ~3, hero ~45, real proof ~133 (headings ~10, note ~18, ink cards ~103 including the hidden new-tab hints, as measured in NRD-170's UI spec), related ~22, closing ~38; total ~241 (TL decision 1). If `check-seo-17` reports more than 250, trim in this order: (1) closing text to one sentence; (2) the note; (3) the hero subtitle's second sentence. Project card text is shared data and is not trimmed here. Trimming beyond this order is explained in the PR description.

### Files

All in layer `app`.

Create:

- `tests/portfolio-template.test.js`.

Modify:

- `src/pages/portfolio.astro`: section map; imports `Breadcrumbs`, `SectionContainer`, `SeoLocalHero`, `RealProof`, `SeoLocalRelated`, `SeoLocalClosing`, `internalLinksBySource`, `getGoogleReviews`; drops `Projects`, `CTASection`, `CodeIcon`; keeps `Layout` title, description and `breadcrumbSchema(breadcrumbs)`.
- `src/data/internal-links.ts`: `"/portfolio/"` entry (decision 2), contextual rows before the conversion row.
- `scripts/lib/template-pages.mjs`: `{ route: "/portfolio/", words: [100, 250], service: false }` (the contract needs a lower bound; 100 guards against an empty page).
- `tests/casos-exito.test.js`: H1 assertion per decision 1; every other assertion unchanged.

Unchanged and green: `src/components/Projects.astro` and `RealProof.astro` (from NRD-217), `tests/adr-0013-link-rows.test.js`, `tests/breadcrumb-trailing-slash.test.js`, `tests/one-h1.test.js`, `public/llms.txt` (line 30), `check-seo-07`, `check-seo-13`.

### Interfaces

None new (uses `RealProof` `projectsVariant` from NRD-217). `internalLinksBySource` gains a key; `InternalLink` type unchanged.

### Data

None: no storage or schema change. JSON-LD stays BreadcrumbList.

### Test plan (TDD order)

Task 1.1 (NRD-219), RED first in `tests/portfolio-template.test.js` (source and `dist/` assertions as in `tests/contact-template.test.js`):

1. `<main class="template-ground`; component order `Breadcrumbs`, `SeoLocalHero`, `RealProof`, `SeoLocalRelated`, `SeoLocalClosing`; no `CTASection`, `CodeIcon`, `<Projects`, `text-gray-`, `SeoLocalFaq`, `ProofStrip`, `SeoLocalPlans`, `SeoLocalNap`; `projects={["arkady", "adfsevilla"]}` and `projectsVariant="ink"`; `links={internalLinksBySource["/portfolio/"]`; schema is `breadcrumbSchema(breadcrumbs)` only; the `"/portfolio/"` links entry has the four paths with trailing slash and the conversion row last; the `templatePages` entry exists. Scenarios "Sections in order", "Legacy blocks removed", "Ink cards with real screenshots", "Breadcrumbs only", "Related links and booking".
2. Update `tests/casos-exito.test.js` (decision 1).
3. Add the template entry, observe `pnpm build && pnpm check:seo-17:dist` RED, implement with the UI spec copy; built page: one H1 "Casos de éxito", ownership check green, word count at most 250. Scenarios "Direct answer in the hero", "Word cap", "Ownership check passes".
4. `node --test tests/*.test.js`, `pnpm build`, `pnpm check:seo:dist` green.

### Real-browser / e2e checks (QA)

- `/portfolio/` at 375, 768, 1024 and 1280 px against the UI spec: ink cards asymmetric from 768 px, stacked below, screenshots with 0.9rem corners and no shadow, no overflow.
- Keyboard: breadcrumbs, hero CTA, project links (new-tab hint), Google reviews link when present, related pills, closing CTA; 2 px sky focus.
- Screenshot alternative texts read by a screen reader.
- Rich Results Test: BreadcrumbList only.

### ADRs relied on

0003, 0004, 0005, 0006, 0008, 0012, 0013, 0014, 0015.

## Risks / Trade-offs

- [NRD-217 not merged when this starts] -> blocked by link; do not duplicate the variant here.
- [Cap with shared card text] -> about 230 expected; card text is not trimmed here (shared with other pages).
- [Hero without a visual looks empty] -> `hero-solo` is the component's designed state; the cards follow immediately; the UI spec may add the secondary link to `#trabajo-real`.
- Size: one work unit for 2 points; no size concern.

## UI spec

Visitor mode: the projects lead. The page is a short frame around two real sites: a text-only hero that answers what is here, the two ink cards as the page's only visual, then the next step. Everything reuses `src/components/seo-local/*` and `src/styles/template.css` tokens; no new component, token or drawing. Site copy in Spanish, sentence case, no owned term (`src/data/seo-intents.ts`) in the H1 or any H2.

### Page frame (`src/pages/portfolio.astro`)

- `<main class="template-ground px-4 pt-24">` (same as `ServiceLayout variant="template"`, no `pb-24`: the closing band is the last block and sits on the footer), one `<div class="space-y-24">` holding sections 0-3 and the closing band as its last child, like the template order in `DESIGN.md` "Using the components on another page".
- Section 0 and 1 share the first `SectionContainer`: `<Breadcrumbs items={breadcrumbs} />` then `SeoLocalHero` (pattern of `src/pages/contacto.astro`). Breadcrumbs component unchanged (known drift, `DESIGN.md`).
- No `.band` wrapper on this page (only one plain section between hero and closing; a band there would add a second full-bleed edge right before the closing band).
- Reading order and primary action: H1 and answer, booking button (primary, the only filled control), "Ver los proyectos" (secondary text link), the two cards (main information), related pills (secondary), closing booking button.

### Hero (`SeoLocalHero`, `hero-solo`, no `visual` slot)

- `keyword="Casos de éxito"` (H1, fixed by the design).
- `title={{ text: "Negocios de Sevilla con su web en marcha", accent: "en marcha" }}`. Assumption: no criterion fixes the display title; one accent phrase, verbatim substring, no owned term.
- `subtitle="Aquí tienes webs reales que he hecho para negocios de Sevilla: un local de celebraciones y una administración de fincas. Puedes visitar cada una en su propio dominio."` Assumption: wording mine; facts come from the two published project descriptions (`src/components/Projects.astro`); the two sentences satisfy "Direct answer in the hero" (what they are, where to visit them).
- Booking button: default label ("Reserva una primera sesión"), `primaryCtaLabel` not passed.
- `secondaryLink={{ label: "Ver los proyectos", href: "#trabajo-real" }}`. Assumption: on 320-414 px the hero fills the first screen and the cards start below the fold; the link tells the visitor the work is right below. `RealProof` with `id` already adds `scroll-m-20`, so the heading lands below the fixed header.
- Layout: `hero-solo` is one column at every width; display `max-width: 16ch`, subtitle 52ch (component defaults). No halo (it only exists behind a visual). Nothing else is added to fill the right side: the empty space at 1024+ px is intended, the cards follow at 6rem.

### Real proof (`SectionContainer id="trabajo-real"` > `RealProof`)

- `headingId="proyectos-title"`, `keyword="Proyectos reales en Sevilla"` (h2), `title={{ text: "Dos negocios, dos webs a medida", accent: "a medida" }}`. Assumption: keyword from the design's example; title mine.
- `note="Cada tarjeta enlaza a la web publicada; la de Arkady incluye un sistema de reservas hecho desde cero."` Assumption: the reservation fact is already published on `/desarrollo-software-medida/` (`RealProof` note there) and in the Arkady card.
- `projects={["arkady", "adfsevilla"]}`, `reviews={reviewsData}` (`await getGoogleReviews()` in frontmatter), `projectsVariant="ink"`.
- Cards: exactly the ink branch of `Projects.astro` from NRD-170 decision 4 (NRD-217) as built there: 0.9rem screenshot corners, `--hairline` border, `--card-surface`, no shadow, no hover lift or zoom, alternating image side and unequal columns from 768 px, one column below; title `h3`, technology list, description, external link with the visually hidden "(se abre en una pestaña nueva)". This page passes no styling and overrides nothing: if the ink cards need a change, it is made in NRD-217's component, not here.
- States:
  - Reviews present: the pull-quote card renders between the heading and the note (component order), with "Ver todas las reseñas en Google" when `placeId` exists; the quote is excluded from the word cap (NRD-212).
  - Reviews `null` or empty (build without API key, API failure): the quote is omitted, the heading is followed directly by the note and cards; no placeholder, no empty card, no message. This is a complete state, not an error.
  - Loading: n/a (static build). Screenshots load lazily below the fold with fixed `width`/`height`, so no layout shift; first paint shows every section in its final state.
  - Empty projects: n/a (two fixed keys; the page must not render if a key is missing, which the existing `getProjectImage` throw already guarantees at build).

### Related links (`SectionContainer` > `SeoLocalRelated`)

- `links={internalLinksBySource["/portfolio/"] ?? []}` (four rows of decision 2, in that order, conversion last).
- `label="Si buscas algo parecido"`. Assumption: the default "Sigue leyendo" suggests articles; these are services and contact, and the label ties them to the projects just seen.
- Empty links: the component renders nothing (existing guard); the closing band still follows.

### Closing (`SeoLocalClosing`, no `visual` slot, `closing-solo`)

- `headingId="cierre-title"`, `keyword="Reserva una llamada sobre tu web"` (h2; TL decision 2: unique on the site).
- `title={{ text: "¿Quieres que tu negocio sea el siguiente?", accent: "el siguiente" }}` (current page's CTA title, kept).
- `text="Cuéntame qué necesita tu negocio y te digo qué web encaja, con precio cerrado por escrito."` Assumption: replaces the old CTA text; "precio cerrado por escrito" is already published on `/contacto/` (FAQ answer).
- `ctaLabel` and `meta` defaults ("Reservar una llamada", "30 minutos · Sin compromiso · Directamente conmigo").
- No drawing: a drawn mock would be the only illustration on a page of real work and would need "Ejemplo ilustrativo"; `closing-solo` drops the radial by design.

### Word budget (check against `check-seo-17`)

Breadcrumbs ~3, hero ~45 (H1 2, title 8, subtitle 28, buttons 7), real proof ~133 (headings 10, note 18, ink cards ~103 with the hidden new-tab hints, TL decision 1), related ~22, closing ~38 (headings 13, text 16, CTA and meta ~9). Total ~241, under 250. If over, apply the design's trim order; the subtitle's second sentence is the last to go because it carries "where to visit them".

### Design system reuse

- Components: `src/components/Breadcrumbs.astro`, `src/components/SectionContainer.astro`, `src/components/seo-local/SeoLocalHero.astro`, `RealProof.astro`, `SeoLocalRelated.astro`, `SeoLocalClosing.astro`, `SectionHeading.astro` (through them), `src/components/BookingButton.astro`, `src/components/Projects.astro` (ink branch, NRD-217).
- Tokens and classes from `src/styles/template.css` only, through the components: `.template-ground`, `--ink-closing`, `--hairline`, `--hairline-quiet`, `--card-surface`, `--sky-signal`, `--sky-accent`, `--text-*`, `--ease-out`. The page adds no `<style>` block and no Tailwind color utility (`text-gray-*` is banned by the test plan).
- New component: none.

### Responsive

- 320-767 px: one column throughout; hero actions wrap (button above link when they do not fit); cards stacked, screenshot above text; related pills wrap; closing band full-bleed with 1rem inner padding. No horizontal overflow at 320 px (long card titles wrap; the screenshot is `w-full`).
- 768 px and up: hero stays one column (`hero-solo`); ink cards switch to the asymmetric two-column layout with alternating image side (NRD-217); quote card goes two columns (component).
- 1024 and 1280 px: no further change; content stays inside `SectionContainer`.

### Interactions and motion

- No entrance or scroll animation on this page; first paint is the complete state. Only the existing 0.2s `--ease-out` state transitions of the components (hero link color, pill border and color, booking button hover).
- Ink cards have no hover transform (NRD-170 decision 4 bans `scale-`, `translate-`); the link inside is the affordance.
- "Ver los proyectos" uses the global scroll behavior; no JS. No destructive actions, forms or validation: n/a.

### Accessibility hand-off

- One H1 (hero keyword); h2 per section (`proyectos-title`, `cierre-title`), h3 per card; display titles are paragraphs (`SectionHeading`).
- Focus order: breadcrumbs, booking button, "Ver los proyectos", Google reviews link (when present), each card's external link (new-tab hint read), related pills, closing booking button. 2px `--sky-signal` outline on all of them (component styles).
- After "Ver los proyectos", focus stays on the link (plain anchor jump); the target section is labelled by its h2. Screenshots keep `alt={title}` (descriptive project title).
- `SeoLocalRelated` nav keeps `aria-label="Contenido relacionado"`; no async results to announce.
