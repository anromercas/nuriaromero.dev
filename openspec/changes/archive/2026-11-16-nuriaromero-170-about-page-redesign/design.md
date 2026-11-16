# Design

## Context

See proposal.md (Why). State on `develop` (a62e1cd), plus NRD-212 merged before this story per sprint order:

- `src/pages/sobre-mi.astro`: `Layout` (title "Sobre mí — Nuria Romero, desarrolladora web en Sevilla", description unchanged), `Schema` with `personSchema()` and `breadcrumbSchema` (no visible breadcrumbs today), `<main class="px-4 pt-24">` with `Hero` (H1 "Hey, soy Nuria Romero", `perfil-profesional.webp`, availability `Badge`, `SocialPill` links), `AboutMe` (six paragraphs, `me.webp` rotated portrait, the exact link `<a href="/">consultor SEO en Sevilla</a>` pinned by `tests/seo-consultor-strategy.test.js`, a link to `/blog/`) and `Experience` (seven roles: CNA 2014, Corner Safety 2018, NTT DATA 2020, Vixion 2022, Wipop by BBVA 2025, TalentionTime 2026, WHAN 2026).
- `Hero`, `AboutMe`, `Experience`, `ExperienceItem`, `Badge` and `SocialPill` are imported only by this page (and `Hero.astro` is read by `tests/trailing-slash-links.test.js`).
- `personSchema()` (`src/lib/schema.ts:77-111`): jobTitle "Consultor SEO y desarrolladora web freelance", description about local SEO in Seville; pinned by `tests/seo-consultor-strategy.test.js` and `tests/technology-copy.test.js`.
- `RealProof` renders `<Projects only={projects} />`; `Projects.astro` holds `PROJECTS` (arkady, adfsevilla) and old-world card markup (`shadow-xl`, `border-gray-800`, `text-gray-100`, hover translate and scale), pinned by `tests/casos-exito.test.js` (`key: "arkady"`, the `only` filter). `Projects` is rendered only through `RealProof` (`/`, `/seo-local-sevilla/`, `/diseno-web-sevilla/`, `/tienda-online-sevilla/`, `/desarrollo-software-medida/`) and directly on `/portfolio/`.
- Non-service template precedent: `/contacto/` (`src/pages/contacto.astro`, NRD-171): `Layout`, `<main class="template-ground px-4 pt-24 pb-24">`, `Breadcrumbs`, `SeoLocalHero` with a slotted visual.
- Owned terms that must stay out of title, H1 and H2 (`keywordOwners`): "consultor seo sevilla", "seo local sevilla", "agencia seo sevilla", "posicionamiento web sevilla", "diseño web sevilla", "diseño tienda online sevilla", "desarrollo de software a medida sevilla", "inteligencia artificial para empresas sevilla", plus the two blog terms.

## Goals / Non-Goals

**Goals:**

- The page in the ink world with about 45% fewer words, the same facts, the same URL, title, description and Person entity.
- One shared, opt-in ink project card used by `/sobre-mi/` and `/portfolio/` (NRD-172).

**Non-Goals:**

- A FAQ (see proposal Out of scope), a services bento, plans or NAP; switching delivered pages to the ink cards.

## Decisions

**Approach.** Compose the page like `/contacto/`: `Layout` plus template components, with the portrait as the hero visual. Section content is page-local (this page has no `src/data` entry; its facts are the published experience figure from `SITE_PROOF` and the career facts already on the site). The process section carries the biography: its byline introduces Nuria with the two natural links, the four steps say how she works, and the `aside` slot holds a compact career record that replaces the seven-card `Experience` list with the same published facts.

1. **Hero portrait.** `SeoLocalHero` `visual` slot with a page-local `<figure>` holding `perfil-profesional.webp` through `astro:assets` `Image` (eager, `widths` 320/480/640, real `alt` "Nuria Romero, desarrolladora web y consultora SEO en Sevilla"), 1.25rem radius, `--hairline` border, no rotation, no tint. The process section then sets `portrait={false}` so the same person is not shown twice in two screens; the UI spec may instead keep the process portrait and drop the hero one only if it justifies it against `DESIGN.md`.
2. **Proof strip.** `[SITE_PROOF[0], rating?, SITE_PROOF[1]]` as on `/diseno-web-sevilla/`: "+10 años de experiencia", the live Google rating when reviews exist, "2 webs en Sevilla de negocios locales" (the same work the real proof section shows).
3. **Career record in the process `aside`.** A short `<h3>` ("Mi recorrido") plus a `<dl>` or `<ol>` of at most five published milestones (year, role, company), from oldest to newest, for example 2014 CNA, 2018 Corner Safety, 2020 NTT DATA, 2022 Vixion, 2025-2026 freelance (Wipop by BBVA and others), and one sentence on sectors and stack already published (industria, salud y medioambiente; Angular, React, Node.js). No new fact, no client logo.
4. **Shared ink project cards.** `Projects.astro` gets `variant?: "legacy" | "ink"`; the `legacy` branch is today's markup byte for byte; the `ink` branch renders the same `PROJECTS` filtered by `only`, keeps each title as `h3`, description, technology list, `alt={title}` and the external link (`target="_blank"`, `rel="noopener noreferrer"`, visually hidden "(se abre en una pestaña nueva)"), with scoped styles that use only `src/styles/template.css` tokens: screenshot `border-radius: 0.9rem`, no `box-shadow`, `--hairline` border, `--card-surface`; asymmetric layout (alternating image side and unequal columns from 768 px, one column below). `RealProof` gets `projectsVariant?: "legacy" | "ink"` and forwards it. Delivered pages pass nothing and stay identical. The data stays in `Projects.astro` for now (moving it to `src/data` would churn `tests/casos-exito.test.js` for no behaviour gain; noted as debt).
5. **Remove dead old-world components.** After the page stops importing them, delete `Hero`, `AboutMe`, `Experience`, `ExperienceItem`, `Badge`, `SocialPill` (verified: no other importer); move the "consultor SEO en Sevilla" assertion of `tests/seo-consultor-strategy.test.js` to `src/pages/sobre-mi.astro`; drop `Hero.astro` from `tests/trailing-slash-links.test.js`. Assets (`me.webp`, `perfil-profesional.webp`) stay.
6. **Breadcrumbs become visible** (`Breadcrumbs` component, as on `/contacto/`), so BreadcrumbList matches the page (GEO-4).

Alternatives considered: keeping `AboutMe` restyled (rejected: six paragraphs cannot fit the budget and the component mixes old classes); a FAQ with the freelance question (rejected: same question already on `/contacto/`); restyling `Projects` for every page now (rejected: changes five delivered pages, including the reference, outside this story); a new separate project-card component (rejected: two sources of the same project markup).

### TL decisions on the UX open questions (2026-11-16)

1. **Word budget: the UI spec copy (~560 without reviews) is accepted** and the allocation below is corrected to it. The lower margin is tight but safe in one direction: with reviews, production adds the rating cell (about five words) and the quote is excluded (NRD-212), so the published page measures the same or slightly more than CI. The developer measures with `check-seo-17`: under 550, extend in the reverse trimming order (closing text, note, career sentence, steps); over 600, trim in order. The PR reports the measured count.
2. **Career record stays stacked under the timeline at every width.** A side-by-side layout needs a change to the shared `SeoLocalProcess.astro`, which every template page renders; that is not in this story's files and would need a check of every page. Not a follow-up: stacked is the accepted design.
3. **Breadcrumbs: accepted as the known drift** already recorded in `DESIGN.md` and shipped on `/contacto/` and the template service pages. Its links have no own focus style but do not remove the browser outline, so focus stays visible (WCAG 2.4.7). Migrating `Breadcrumbs` to the ink world (sky focus ring, template text colours) is a cross-page follow-up for the PO, not part of this story.

### Section map

| #   | Section     | Component                                                          | Content                                                                                                                                                                                                                                                                                                                                                                     |
| --- | ----------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0   | breadcrumbs | `Breadcrumbs`                                                      | `[{ Inicio, / }, { Sobre mí, /sobre-mi/ }]` (same array as the schema)                                                                                                                                                                                                                                                                                                      |
| 1   | hero        | `SectionContainer` > `SeoLocalHero` + portrait `figure`            | `keyword` (H1) names Nuria Romero (for example "Sobre mí: Nuria Romero"); display title with one accent; lead 48-52ch, at most about 45 words, first two sentences: who, what (webs, local SEO, custom software and automations for businesses), where (Sevilla); `secondaryLink={ label: "Cómo trabajo", href: "#como-trabajo" }`; booking button default                  |
| 2   | proof       | `ProofStrip`                                                       | decision 2                                                                                                                                                                                                                                                                                                                                                                  |
| 3   | process     | `.band` > `SectionContainer` > `SeoLocalProcess id="como-trabajo"` | keyword h2 about how she works (no owned term), display title; `byline` slot with the two links (`<a href="/">consultor SEO en Sevilla</a>` exactly once, and a natural anchor to `/seo-local-sevilla/`); four steps: trato directo conmigo, propuesta cerrada por escrito, entrega, seguimiento; `portrait={false}` (decision 1); `aside` slot: career record (decision 3) |
| 4   | real proof  | `SectionContainer id="trabajo-real"` > `RealProof`                 | keyword h2 (for example "Proyectos reales para negocios de Sevilla"), display title, `projects={["arkady", "adfsevilla"]}`, `reviews={reviewsData}`, honest note (what the two sites are), `projectsVariant="ink"`                                                                                                                                                          |
| 5   | closing     | `SeoLocalClosing`                                                  | keyword h2 (for example "Reserva una llamada conmigo"), display title, short text, default CTA and meta; visual slot optional (UI spec)                                                                                                                                                                                                                                     |

**Word budget (550-600, set by the story).** Allocation (corrected, TL decision 1; the first version summed to about 524): breadcrumbs ~3, hero ~57, proof ~11, process ~285 (headings ~11, byline ~39, steps ~149, career record ~88), real proof ~155 (headings ~11, note ~41, ink cards ~103 including the hidden new-tab hints), closing ~50; total ~560 without reviews. If `check-seo-17` reports over 600, trim in this order and stop when it fits: (1) step texts to one sentence; (2) the career record's sentence on sectors and stack; (3) the real-proof note to one sentence; (4) the closing text to one sentence. Never remove the hero's first two sentences, the two links or a milestone. Under 550, extend in reverse order. Trimming beyond this order is explained in the PR description.

### Files

All in layer `app`.

Create:

- `tests/sobre-mi-template.test.js`.

Modify:

- `src/components/Projects.astro`: `variant` prop and `ink` branch (decision 4).
- `src/components/seo-local/RealProof.astro`: `projectsVariant` prop forwarded to `Projects`.
- `src/pages/sobre-mi.astro`: section map above; imports `Breadcrumbs`, `SectionContainer`, `SeoLocalHero`, `ProofStrip`, `SeoLocalProcess`, `RealProof`, `SeoLocalClosing`, `Image`, `SITE_PROOF`, `getGoogleReviews`; keeps `personSchema()` and `breadcrumbSchema(breadcrumbs)`.
- `scripts/lib/template-pages.mjs`: `{ route: "/sobre-mi/", words: [550, 600], service: false }`.
- `tests/template-components.test.js` (variant assertions), `tests/seo-consultor-strategy.test.js` (anchor read from `src/pages/sobre-mi.astro`), `tests/trailing-slash-links.test.js` (drop `Hero.astro`).

Delete:

- `src/components/Hero.astro`, `src/components/AboutMe.astro`, `src/components/Experience.astro`, `src/components/ExperienceItem.astro`, `src/components/Badge.astro`, `src/components/SocialPill.astro`.

Unchanged and green: `src/lib/schema.ts`, `tests/casos-exito.test.js`, `tests/technology-copy.test.js`, `tests/breadcrumb-trailing-slash.test.js`, `tests/one-h1.test.js`, `public/llms.txt` (line 6 still true), `check-seo-07`, `check-seo-13` (links to `/sobre-mi/` from `/recursos/`), `check-seo-16` (the reference page passes no variant).

### Interfaces

```ts
// src/components/Projects.astro
interface Props {
  only?: string[];
  variant?: "legacy" | "ink"; // default "legacy": markup unchanged
}
// src/components/seo-local/RealProof.astro (added prop)
interface Props {
  // ...existing props
  projectsVariant?: "legacy" | "ink"; // default "legacy"
}
```

### Data

None: no storage, schema or settings change. JSON-LD stays Person + BreadcrumbList.

### Test plan (TDD order)

1. Task 1.1 (NRD-217), RED in `tests/template-components.test.js`: `Projects.astro` declares `variant?: "legacy" | "ink"` with default `"legacy"`; the legacy branch still contains today's classes (guard that it was not edited); the ink branch contains no `shadow-`, `gray-`, `scale-`, `translate-` or `rotate`, sets `border-radius: 0.9rem` on the screenshot and uses `var(--hairline)`; the ink link has `rel="noopener noreferrer"` and the new-tab hint; `RealProof.astro` declares `projectsVariant` and passes it as `variant` to `<Projects`. Then implement; `tests/casos-exito.test.js` green; `check-seo-16` green. Scenarios "Ink cards on request", "Default unchanged", "Same content in both variants".
2. Task 2.1 (NRD-218), RED in `tests/sobre-mi-template.test.js` (source and `dist/` assertions as in `tests/contact-template.test.js`): `<main class="template-ground` ; component order `Breadcrumbs`, `SeoLocalHero`, `ProofStrip`, `SeoLocalProcess`, `RealProof`, `SeoLocalClosing`; no `Hero`, `AboutMe`, `Experience`, `TitleSection`, `text-gray-`, `bg-gray-`, `SeoLocalFaq`, `SeoLocalPlans`, `SeoLocalNap`, `ReviewBento`; `projectsVariant="ink"`; schema array is `personSchema()` and `breadcrumbSchema(breadcrumbs)` only; exactly one `<a href="/">consultor SEO en Sevilla</a>` and one link to `/seo-local-sevilla/`; the six removed component files do not exist; the `templatePages` entry exists. Update the two moved test assertions. Add the entry, observe `pnpm build && pnpm check:seo-17:dist` RED, then write the page with the UI spec copy. Scenarios "Direct answer in the hero", "Sections in order", "Legacy blocks removed", "Word budget", "Ownership check passes", "Links to the home and to SEO local", "Person and breadcrumbs only", "Proof strip without reviews", "Only published projects".
3. Every task: `node --test tests/*.test.js`, `pnpm build`, `pnpm check:seo:dist` green.

### Real-browser / e2e checks (QA)

- `/sobre-mi/` at 375, 768, 1024 and 1280 px against the UI spec: portrait never stretched or cropped oddly, no overflow, career record readable at 375 px, ink project cards asymmetric from 768 px and stacked below.
- Keyboard: breadcrumb links, hero CTA, "Cómo trabajo" (lands on `#como-trabajo` below the fixed header), byline links, project links (new-tab hint announced), Google reviews link when present, closing CTA; 2 px sky focus visible.
- `/`, `/seo-local-sevilla/`, `/diseno-web-sevilla/` project cards unchanged (legacy variant).
- Rich Results Test: Person and BreadcrumbList only.

### ADRs relied on

0003, 0004, 0005, 0006, 0008, 0012, 0013, 0014, 0015.

## Risks / Trade-offs

- [Budget 550-600 with no FAQ] -> the career record and two-sentence steps carry the facts; allocation and trimming order above; the range is narrow, so the PR reports the measured count.
- [Two project card styles on the site until the follow-up] -> ink only on `/sobre-mi/` and `/portfolio/`; proposed to the PO as a follow-up to switch the other `RealProof` pages.
- [Deleting components another branch uses] -> `rg` check in the task; WIP 1 keeps branches serial.
- [Losing E-E-A-T detail from the long work history] -> the career record keeps the roles, companies and years; Person JSON-LD unchanged.
- Size: two work units for 3 points (the shared ink variant was planned here because NRD-170 lands before NRD-172); no size concern.

## UI spec

Visual authority: `DESIGN.md` ("The Annotated Storefront") as rendered by `/seo-local-sevilla/` and `/diseno-web-sevilla/`; non-service composition copied from `src/pages/contacto.astro`. Mode: persuade, but the subject is the person: the page's one picture is Nuria's real photo, the rest is quiet working document. One primary action: book a call. No new palette, type scale or shared component: every section is an NRD-163 template component (`src/components/seo-local/*`) with props; the only new markup is the hero portrait `figure`, the career record (process `aside`) and the `ink` branch of `src/components/Projects.astro`. Colours, type and surfaces come only from `src/styles/template.css` (`--card-surface`, `--drawing-surface`, `--hairline`, `--hairline-quiet`, `--sky-signal`, `--sky-accent`, `--text-strong`, `--text-body`, `--text-secondary`, `--text-muted`, `--ease-out`, `.template-ground`, `.band`, `.tpl-link`). Copy is Spanish, `tú`, business language; the only figures are "+10 años" (from `SITE_PROOF`), the years of published roles, "30 minutos" (closing meta default) and "24 horas laborables" (already published on `/contacto/`). Every display title has exactly one accent phrase (verbatim substring of `text`). Strings below are exact.

What this redesign fixes against the reference: the old page is a rotated portrait on a yellow tint, a "Disponible para trabajar" badge, six gray paragraphs with yellow monospace highlights, glyph section titles and seven long job cards. All of it goes. The page now answers "who is she, what does she do, can I trust her" in the first viewport (name, work, Seville, real face), then shows how she works, her record at a glance, and two real sites.

### 0. Breadcrumbs (`Breadcrumbs`)

- `src/components/Breadcrumbs.astro` as on `/contacto/`, first child of the hero `SectionContainer`, items = the same `breadcrumbs` array as the schema ("Inicio" / "Sobre mí"). Component unchanged (its old-world classes are accepted as on `/contacto/`, DESIGN.md "Known Drift"); no restyle in this story.

### 1. Hero (`SeoLocalHero` + portrait `figure` + `ProofStrip`)

- Layout: `<main class="template-ground px-4 pt-24 pb-24">` > `<div class="space-y-24">` (as `/contacto/`). The first `SectionContainer` (no `id`) holds `Breadcrumbs`, `SeoLocalHero` and, right after it, `ProofStrip` (same container, as the reference hero). One column under 768 px (copy, then portrait); `1.05fr / 0.95fr` from 768 px (component).
- Hierarchy: keyword h1 (small, slate) > display title > lead > booking button (the only filled control) + "Cómo trabajo" underlined text link > portrait.
- `keyword="Sobre mí: Nuria Romero"` (design example kept; names her, no owned term).
- `title={ text: "Un proyecto, una sola persona", accent: "una sola persona" }`. Assumption: display copy; states the `PRODUCT.md` positioning (clients talk directly with the person who does the work) without reusing the `/diseno-web-sevilla/` process title.
- `subtitle`: "Soy Nuria Romero, desarrolladora web y consultora SEO en Sevilla. Hago webs, tiendas online, SEO local, software a medida y automatizaciones para negocios que quieren más clientes. Conmigo hablas directamente con quien hace el trabajo, desde la primera llamada hasta la entrega." (42 words; sentences 1-2 answer who, what and where, GEO-1). Assumption: copy; every service named is published on the site.
- `primaryCtaLabel`: not passed (site default "Reserva una primera sesión"). `secondaryLink={ label: "Cómo trabajo", href: "#como-trabajo" }` (design).
- Portrait (`slot="visual"`), page-local markup and scoped style in `src/pages/sobre-mi.astro`:
  - `<figure class="portrait">` > `Image` from `astro:assets`, `src` = `@/assets/perfil-profesional.webp` (896 x 1053, cut-out with transparent background), `alt="Nuria Romero, desarrolladora web y consultora SEO en Sevilla"`, `widths={[320, 480, 640]}`, `sizes="(min-width: 768px) 352px, 256px"`, `loading="eager"`, `fetchpriority="high"`, `decoding="async"`. Assumption: `fetchpriority="high"`, since the portrait is the likely LCP element. No `figcaption` (the alt carries the name; a visible caption would repeat the h1 and spend words).
  - Figure: `margin: 0 auto`, `width: 100%`, `max-width: 16rem` under 768 px and `22rem` from 768 px; `padding: 1rem 1rem 0` (the cut-out stands on the frame's bottom edge); `border: 1px solid var(--hairline)`; `border-radius: 1.25rem`; `background: var(--card-surface)`; `overflow: hidden`. Image: `display: block; width: 100%; height: auto` (intrinsic ratio; never `object-fit: cover`, never cropped or stretched). No rotation, tint, ring, filter or shadow. The component's sky halo stays behind the figure (the hero's one light in DESIGN.md). Assumption: frame sizes and the bottom-anchored padding.
- Portrait placement (design decision 1 confirmed): portrait in the hero, `SeoLocalProcess` with `portrait={false}`. Reason against `DESIGN.md`: the hero visual slot holds the page's focal image, and on an about page the real face is the proof that answers "who"; a second photo (`perfil-home.webp`) two screens later would make two peers of the same subject.
- `ProofStrip` (`src/components/seo-local/ProofStrip.astro`): `items = [SITE_PROOF[0], rating?, SITE_PROOF[1]]` computed exactly as in `src/pages/diseno-web-sevilla.astro` (rating cell only when `reviewsData` is not null). No other figure.

### 2. Process (`.band` > `SeoLocalProcess` + career record)

- `<div class="band"><SectionContainer>` > `SeoLocalProcess id="como-trabajo" headingId="como-trabajo-title" portrait={false}` (single column, component's `.no-portrait`).
- `keyword="Cómo trabajo con tu negocio"`, `title={ text: "Así trabajamos, de principio a fin", accent: "de principio a fin" }`. Assumption: copy; no owned term.
- `byline` slot (exact markup; links take the component's byline link style, no extra classes): `Desarrollo software desde 2014 y hoy trabajo también como <a href="/">consultor SEO en Sevilla</a>, siempre con negocios reales. Si lo que quieres es que tus clientes te encuentren en Google Maps, aquí tienes cómo trabajo el <a href="/seo-local-sevilla/">SEO local para negocios</a>.` Assumption: copy; the first anchor is the exact pinned string, "desde 2014" is the published CNA start; the second anchor is natural and avoids the owned "seo local sevilla".
- `steps` (h3 + text, page-local array; Assumption: copy written from the design's four steps and published facts):
  1. "Trato directo conmigo": "No hay comerciales ni cuentas que pasen de mano en mano. Me cuentas qué necesitas, te pregunto lo que haga falta para entender tu negocio y te respondo en menos de 24 horas laborables."
  2. "Propuesta cerrada por escrito": "Antes de empezar te envío qué incluye, cuánto cuesta y en qué plazo lo tendrás, todo explicado sin tecnicismos. El precio no cambia a mitad de camino si no cambiamos lo acordado."
  3. "Entrega que puedes revisar": "Ves los avances durante el proyecto y me dices qué cambiar antes de publicar. Al terminar te enseño a usar lo que te entrego para que no dependas de mí en el día a día."
  4. "Seguimiento después de publicar": "Cuando todo está en marcha, sigo a tu lado para dudas, cambios y mejoras. Si tu negocio crece, ampliamos por fases, y cada fase llega con su propio precio cerrado antes de empezar."
- Career record (`slot="aside"`), page-local markup and scoped style:
  - `<div class="career">` > `<h3>Mi recorrido</h3>` > `<ol class="career-list">` (oldest to newest; each `<li><span class="career-year">…</span> <span class="career-role">…</span></li>`) > `<p class="career-note">…</p>`.
  - Rows (exact; Assumption: wording condensed from the published `Experience` entries; no new fact, no logo):
    - "2014" / "Software de control en el Centro Nacional de Aceleradores (CNA)"
    - "2018" / "Desarrolladora fullstack en Corner Safety"
    - "2020" / "Frontend sénior en NTT DATA, como desarrolladora principal en proyectos móviles"
    - "2022" / "Fullstack sénior en Vixion, con aplicaciones web y móviles industriales"
    - "Desde 2025" / "Freelance para Wipop by BBVA, TalentionTime y WHAN"
  - Note: "He trabajado en proyectos de industria, salud y medioambiente, con Angular, React, Node.js y apps móviles. Hoy pongo esa experiencia al servicio de negocios de Sevilla: webs, tiendas online, SEO local, software a medida y automatizaciones."
  - Visual: not a card (the timeline already owns the dots; a ruled list keeps it a record, not a peer panel). `max-width: 40rem`; `padding-top: 1.5rem; border-top: 1px solid var(--hairline)` (same rule as the RealProof note). h3 matches the component's step h3 (`--text-strong`, 1.125rem, 650) with `margin: 0 0 1rem`. List: no bullets, `margin: 0; padding: 0; list-style: none`; each `li` is a grid `grid-template-columns: 6.5rem minmax(0, 1fr)`, `gap: 1rem`, `padding: 0.6rem 0`; `li + li` gets `border-top: 1px solid var(--hairline-quiet)`. Year: `--text-strong`, 650, 0.95rem, `font-variant-numeric: tabular-nums`. Role: `--text-secondary`, 0.975rem, line height 1.5. Note: `--text-secondary`, 0.975rem, 1.6, `max-width: 65ch`, `margin: 1.25rem 0 0`. No sky colour, icon or yellow. Assumption: all sizes (taken from the timeline's own values).
  - Placement: stacked under the timeline at every width (the `aside` slot renders inside the component's single `.steps` column; a side-by-side layout would need a `SeoLocalProcess` change outside this story's files).

### 3. Real proof (`RealProof` with `projectsVariant="ink"`)

- `SectionContainer id="trabajo-real"` > `RealProof headingId="prueba-title"`, `keyword="Proyectos reales para negocios de Sevilla"` (design), `title={ text: "Webs que puedes visitar hoy", accent: "visitar hoy" }`, `projects={["arkady", "adfsevilla"]}`, `reviews={reviewsData}`, `projectsVariant="ink"`, `note="Dos webs de negocios de Sevilla hechas por mí: un local de celebraciones con reservas online y una administración de fincas. Puedes visitarlas y juzgar el trabajo por ti. Prefiero enseñarte webs reales que prometerte cifras que no puedo demostrar."` Assumption: copy; says what the two sites are and keeps the reference's honesty note.
- Quote card (live review): component behaviour, unchanged.

### 4. Ink project cards (`Projects variant="ink"`, shared with NRD-172 `/portfolio/`)

Specified once here; `/portfolio/` uses the same branch with no overrides, so both pages show identical cards.

- Markup (ink branch only; legacy branch untouched): `<div class="ink-projects">` > per project `<article class="ink-project">` > `<div class="ink-shot">` (the `Image` with the legacy props: `alt={title}`, `width={400}`, `height={224}`, `widths={[400, 800]}`, `loading="lazy"`, `decoding="async"`; `sizes="(min-width: 768px) 420px, 100vw"`) + `<div class="ink-body">` > `<h3>{title}</h3>`, `<p>{description}</p>`, `<ul class="ink-tags">` (one `<li>{tag.name}</li>` per tag), then the link.
- Link (replaces the "Preview" `LinkButton` in the ink branch): `<a href={link} target="_blank" rel="noopener noreferrer" class="tpl-link">Visitar {hostname}<span class="sr-only"> (se abre en una pestaña nueva)</span></a>`, `hostname` = `new URL(link).hostname` without a leading `www.` (renders "Visitar arkadycelebraciones.es" and "Visitar adfsevilla.com"). Assumption: label; unique per card and honest about the destination. If a project has `github`, a second `tpl-link` "Ver el código en GitHub" with the same hint, separated by 1.25rem (none has one today). Assumption.
- Tags as text chips, no icons (DESIGN.md: no glyph icon components in this world): `border: 1px solid var(--hairline)`, `border-radius: 9999px`, `padding: 0.2rem 0.7rem`, `color: var(--text-secondary)`, `font-size: 0.8rem`; list `display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 0; padding: 0; list-style: none`.
- Surfaces: `.ink-project` is the card: `background: var(--card-surface)`, `border: 1px solid var(--hairline)`, `border-radius: 1.25rem`, `padding: 1rem`, `display: grid; gap: 1.25rem`. `.ink-shot`: `border: 1px solid var(--hairline-quiet)`, `border-radius: 0.9rem`, `overflow: hidden`, `background: var(--drawing-surface)`; image `display: block; width: 100%; height: auto; aspect-ratio: 16 / 9; object-fit: cover; object-position: top` (the screenshot top, where the site's header and hero are). No `box-shadow`, no hover transform or scale on card or image. Text: h3 `--text-strong`, 1.25rem, 650, line height 1.3, `margin: 0`, `text-wrap: pretty`; description `--text-secondary`, 1rem, 1.6, `max-width: 65ch`, `margin: 0.6rem 0 1rem`; link `display: inline-block; margin-top: 1.25rem`.
- Layout: `.ink-projects` = `display: grid; gap: 1.5rem`. Under 768 px each card is one column, screenshot first. From 768 px: card `grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr); align-items: center; gap: 2rem; padding: 1.25rem`; even cards (`:nth-child(even)`) use `minmax(0, 0.85fr) minmax(0, 1.15fr)` with the screenshot in the second column (`order: 2` on `.ink-shot`; DOM order stays image then text, so reading order is identical). Assumption: the 1.15/0.85 split (Asymmetry Rule).
- `/portfolio/` (NRD-172): with more projects the alternation simply continues (odd image left, even image right); the variant takes no page-specific prop.

### 5. Closing (`SeoLocalClosing`)

- `SeoLocalClosing headingId="cierre-title"`, `keyword="Reserva una llamada conmigo"` (design), `title={ text: "Cuéntame qué necesita tu negocio", accent: "tu negocio" }`, `text="En 30 minutos vemos tu caso, qué te conviene hacer primero y cuánto costaría. Si no soy la persona adecuada para lo que necesitas, te lo digo en la misma llamada."`, `ctaLabel` and `meta` default. Assumption: copy.
- No `visual` slot (`closing-solo`: one column, no halo). Reason: the only honest visual is the portrait, already in the hero; a drawing would be an illustration with nothing to explain. Last section of `<main>`.

### Word budget

Measured on the copy above without reviews: breadcrumbs ~3, hero ~57, proof ~11, process ~285 (headings 11, byline 39, steps ~149, career record ~88), real proof ~155 (headings 11, note 41, cards ~103 including the hidden new-tab hints), closing ~50: about 560, inside 550-600. `check-seo-17` is the authority; over 600 or under 550, apply the design's trimming order (or its reverse to extend). Note: the design's per-section allocation adds up to about 524, not 575; this copy is sized to the real range.

### States

- Static page, no async UI. Build-time data only:
  - `reviewsData` null: ProofStrip shows two cells ("+10 años", "2 webs en Sevilla"), no empty cell; RealProof shows the note and the two cards, no quote.
  - Reviews without text: rating cell shown, quote omitted (component).
  - Missing project image: the build fails (`getProjectImage` throws), as in legacy; no runtime placeholder.
- Loading, empty, error, success, disabled and form states: n/a (no forms; the booking buttons open the external booking page).

### Responsive

- 320-639 px: one column; portrait frame max 16rem wide (about 19rem tall) centered under the copy; career rows keep the 6.5rem year column ("Desde 2025" fits on one line) and roles wrap; ink cards stacked with the screenshot full card width at 16:9; long project titles and "Aceleradores (CNA)" wrap; no horizontal scroll.
- 640 px: ProofStrip horizontal (component).
- 768 px: hero two columns, portrait frame max 22rem; ink cards two asymmetric columns, alternating sides.
- 1024 px and up: as 768 inside the `lg:max-w-4xl` container; process stays one column.
- Nothing is hidden at any width.

### Interactions

- Hover and focus as the components: text links (hero link, byline links, card `tpl-link`, review link) turn `--sky-accent` on hover and get a 2px `--sky-signal` outline with 3-4px offset on `:focus-visible`; booking buttons keep their own ring. Transitions 0.2s `--ease-out`. Ink cards are not interactive themselves (only their link), so no card hover.
- "Cómo trabajo" jumps to `#como-trabajo` below the fixed header (`scroll-m-20` from the component); no smooth-scroll script.
- Motion: none authored. First paint is the complete state: the portrait is eager and static and no element starts hidden. The only motion is the existing `SectionContainer` view-timeline reveal shared by all template pages (reduced-motion safe); add no entrance animation.
- Destructive actions, validation, optimistic updates: n/a.

### Accessibility hand-off

- One h1 (hero keyword "Sobre mí: Nuria Romero"). h2 in order: "Cómo trabajo con tu negocio", "Proyectos reales para negocios de Sevilla", "Reserva una llamada conmigo". h3: the four step titles, "Mi recorrido", the project titles. Display titles are paragraphs (component).
- Focus order follows visual order: breadcrumb "Inicio", booking button, "Cómo trabajo", "consultor SEO en Sevilla", "SEO local para negocios", review link (when present), "Visitar arkadycelebraciones.es", "Visitar adfsevilla.com", closing booking button.
- Portrait: real `alt` (above). Screenshots keep `alt={title}`.
- Career record is a real `<ol>`, announced as a five-item list in chronological order; year and role are plain text inside one `li`.
- New-tab links carry the visually hidden "(se abre en una pestaña nueva)".
