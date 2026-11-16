# Design

## Context

See proposal.md (Why). Current state on `develop` (d2ea153), `src/pages/index.astro`:

- Uses `Layout` directly (not `ServiceLayout`), JSON-LD `personSchema()`, `faqSchema(homeFaqs)` and `reviewsSchema(reviewsData)` when reviews exist; `getGoogleReviews()` is called once.
- Hero: `SectionContainer id="home-hero"` with `class="seo12-home-hero ..."` and `data-seo12-hero="true"`, small H1 "Consultor SEO en Sevilla para negocios locales", an H2 display line, a paragraph with yellow `strong`, a `nav data-seo12-primary-cta` with `BookingButton`, and the raster portrait `perfil-home.webp` as the eager, high-priority LCP image.
- Then: "hitos" icon row, services grouped by problem (`serviceGroups`, `serviceOutcomes`), niche pills, the all-services price grid (`#precios`), old `ProcessSteps`, "Casos de éxito" (`Projects`), `GoogleReviews`, `InternalLinks`, old `FAQ` (6 long answers), `CTASection`.
- Guards that read the home: `scripts/check-seo-12.mjs` (dist and source markers `seo12-home-hero`, `data-seo12-hero`, `data-seo12-primary-cta`, booking href), `tests/seo-meta-titles.test.js` (title, H1, first hero paragraph regex `</h2>\s*<p`, portrait alt, "posicionamiento web" at most once and never in headings), `tests/single-price-source.test.js` (`homeDescription` template from `tierFrom(seoLocal, "Local")`), `tests/google-reviews-error.test.js` (reviews fetched once, JSON-LD only with data), `tests/home-services-list.test.js` (groups and price cards), `tests/technology-copy.test.js` (casos copy and Person `knowsAbout`), `tests/dark-variants.test.js` (space after `</strong>` in the hero), `tests/trailing-slash-links.test.js` (contact links), `tests/seo-local-posicionamiento-web.test.js` (at most 3 "posicionamiento web" on the home), `scripts/check-seo-07.mjs` (intent matrix and keyword ownership on dist).
- From NRD-163 (must be merged first): `src/components/seo-local/*` with props, `SectionHeading`, `BentoTile` (with `link`), `SeoLocalCycle`, `SeoLocalFaq` (`FaqItem.links`), `src/styles/template.css` (`.template-ground`, `.band`), `scripts/lib/template-pages.mjs`, `scripts/check-seo-17.mjs`. Interfaces as in `openspec/changes/nuriaromero-163-reusable-local-components/design.md`; if the merged API differs, the merged API wins and the developer notes it in the PR.

## Goals / Non-Goals

**Goals:**

- The home reads as a page of the template world, with about half the words, and every SEO guarantee of NRD-122 kept.
- The FAQ is the GEO block: sourced questions, direct answers, mirrored exactly in FAQPage.

**Non-Goals:**

- New template components, changes to shared components, new figures, Service JSON-LD on the home (the home is the consultant's profile page; it has no visible plans, so no Service with offers), a visible breadcrumb on `/` (so no BreadcrumbList).

## Decisions

**Approach.** The home stays on `Layout` (it is not a `ServicePageData` page) and composes the NRD-163 sections directly inside `<main class="template-ground px-4">`, wrapping each in `SectionContainer` and the process in `.band`, exactly like `/seo-local-sevilla/` does through `ServiceLayout` slots (`space-y-24` between sections). Copy lives in the page frontmatter as typed constants (`AccentTitle`, `Step[]`, `FaqItem[]`...), prices only through `tierFrom()`, service routes and names from `services` and site facts from `SITE`/`SITE_PROOF`. The hero keeps its `SectionContainer id="home-hero"` with the `seo12` markers and passes `actionsAttrs={{ "data-seo12-primary-cta": "" }}` to `SeoLocalHero`, so `check-seo-12` keeps passing unchanged. Illustrations specific to the home live in `src/components/home/` following `DESIGN.md` (1.5 stroke, round caps and joins, `currentColor`, `signal`/`soft` classes, `aria-hidden`, "Ejemplo ilustrativo" once under the bento and on the hero mock). The `## UI spec` written by the ux-designer (impeccable) fixes the visual details and any improvement; this design fixes structure, data and guarantees.

Alternatives considered: rendering the home through `ServiceLayout variant="template"` with a synthetic `ServicePageData` (rejected: it would emit a Service entity and a breadcrumb the home does not have, and would force fake pricing data); keeping the raster portrait in the hero (rejected: the template hero is a drawing; the real portrait belongs to the process timeline, where `DESIGN.md` puts it).

### Section map (reference order)

| #   | Section          | Component                                                                                          | Content source                                                                                                                                                                                                                                                                           |
| --- | ---------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Hero             | `SeoLocalHero` in `SectionContainer id="home-hero" class="seo12-home-hero" data-seo12-hero="true"` | `keyword` = "Consultor SEO en Sevilla para negocios locales" (unchanged H1); `title` short with one accent phrase; `subtitle` includes "consultor SEO en Sevilla" (first paragraph); `primaryCtaLabel` default booking; `secondaryLink` to `#que-hago`; `<HomeHeroMock slot="visual" />` |
| 2   | Proof strip      | `ProofStrip`                                                                                       | live Google rating cell only when `reviewsData` exists, `SITE_PROOF` facts; no other figure                                                                                                                                                                                              |
| 3   | Bento "qué hago" | `SectionContainer id="que-hago"` > `ReviewBento headingId="que-hago-title"` + 6 `BentoTile`                                                        | one tile per `services` entry except `capilarLocal`; `title` from a short label, `text` one sentence, `link={{ label: service.breadcrumbName, href: service.slug }}`, `<ServiceTileArt kind="..." />` as the tile SVG                                                                    |
| 4   | Process          | `.band` > `SeoLocalProcess`                                                                        | 4 steps (shortened `homeProcess`), `portraitAlt="Nuria Romero, consultor SEO en Sevilla y desarrolladora web"` (keeps the alt test), `byline` slot; no `aside` cycle unless the UI spec asks for one                                                                                     |
| 5a  | Real proof       | `RealProof`                                                                                        | `reviews={reviewsData}`, real projects (`Projects` ids), honest note                                                                                                                                                                                                                     |
| 5b  | Comparison       | `SeoLocalAgencia id="consultor-o-agencia"`                                                         | keyword heading "¿Consultor SEO o agencia?" (no "agencia seo sevilla" in the H2), 3 `ComparisonItem`s, `link={{ label: "Ver los planes de SEO local", href: "/seo-local-sevilla/#precios" }}`                                                                                            |
| 6   | (no plans)       | none                                                                                               | plans live on `/seo-local-sevilla/`                                                                                                                                                                                                                                                      |
| 7a  | FAQ              | `SeoLocalFaq`                                                                                      | `homeFaqs: FaqItem[]` (6-8 sourced questions)                                                                                                                                                                                                                                            |
| 7b  | Related          | `SeoLocalRelated`                                                                                  | `internalLinksBySource["/"]` (+4 niche rows)                                                                                                                                                                                                                                             |
| 7c  | Closing + NAP    | `SeoLocalClosing` + `SeoLocalNap`                                                                  | closing copy and `<HomeHeroMock slot="visual" animate={false} />`; NAP keyword heading without terms owned by other pages                                                                                                                                                                |

Keyword headings: sentence case, the real `h2`; none may contain a term owned by another page (`keywordOwners`); "consultor SEO" may appear in at most the H1 and one H2 to avoid stuffing. "posicionamiento web" appears at most once on the page and never in a heading (existing tests).

### FAQ (GEO block)

Pick 6-8 of the 8 sourced questions in NRD-164 ("Investigación"), natural wording allowed, each answer: direct answer in the first two sentences, plain Spanish in `tú`, at most about 60 words, `\n\n` paragraphs allowed.

- Price questions (1 "¿Cuánto cobra un SEO al mes?", 2 "¿Cuánto se cobra por SEO?", 8 "¿Cuánto cuesta el SEO?"): use one or two of them (they overlap); answers interpolate `tierFrom(seoLocal, "Local")` and `tierFrom(seoLocal, "Local Pro")` (both already say "+ IVA"), never a price literal; `links: [{ label: "Ver los planes de SEO local", href: "/seo-local-sevilla/" }]`. No competitor rate.
- 3 "¿Qué hace un consultor SEO?": direct description of the work, linking to the process section is not needed.
- 4 "¿Quién es el mejor consultor SEO en España?": honest criteria for choosing (published prices and scope, direct contact, no position promises, real work you can see); never "la mejor".
- 5 "¿Qué es SEO y se paga?", 6 "¿Qué es el SEO?", 7 "¿Qué diferencia hay entre SEO y SEM?": one or two sentences each; 5 and 6 may be merged into one question.
- The same `homeFaqs` array feeds `faqSchema(homeFaqs)` and `SeoLocalFaq`; `faqSchema` ignores `links`.

### Files

All in layer `app`.

Create:

- `src/components/home/HomeHeroMock.astro` (app): hero drawing for a consultant at work on a local listing (exact content from the UI spec), `animate?: boolean` mirroring `ListingMock` (completed state default, scroll-driven fill only inside `prefers-reduced-motion: no-preference` and `@supports`), `figcaption` "Ejemplo ilustrativo".
- `src/components/home/ServiceTileArt.astro` (app): `{ kind: "seo-local" | "diseno-web" | "tienda-online" | "software" | "automatizaciones" | "ia" }` returning one single-stroke SVG per service (`aria-hidden="true"`, `focusable="false"`, `stroke-width="1.5"`, `currentColor`, `signal`/`soft`/`label` classes styled by `BentoTile`).
- `tests/home-template.test.js` (app).

Modify:

- `src/pages/index.astro` (app): rewritten as above; keeps `homeDescription` exactly, the `Layout title` exactly, `getGoogleReviews()` called once, Person/FAQPage/reviews JSON-LD.
- `scripts/lib/template-pages.mjs` (app): add `{ route: "/", words: [900, 1100], service: false }`.
- `src/data/internal-links.ts` (app, task 1.2): append four contextual rows to `"/"`, after the existing five, reusing the anchors of the `"/diseno-web-sevilla/"` row: `/web-para-restaurantes-sevilla/` "web para restaurantes en Sevilla", `/web-para-clinicas-sevilla/` "web para clínicas y consultas", `/web-para-comercios-sevilla/` "web para comercios y tiendas", `/web-para-abogados-gestorias-sevilla/` "web para despachos y gestorías". Reason: `scripts/check-seo-02.mjs` (home section) requires the home `<main>` to link the four niche pages in trailing-slash form; the old niche pills did it and are removed. The niche pages are parked (PRD section 6), not retired: they stay public and indexed, so the home keeps its contextual links to them through the existing related row, with no new section or copy and no change to the guard. Existing rows and their order stay as they are.
- `tests/seo-meta-titles.test.js` (app): the first-paragraph assertion reads the `subtitle` passed to `SeoLocalHero` instead of `</h2>\s*<p`; the H1 assertion reads the `keyword` prop (or the dist H1 if simpler); title, alt and "posicionamiento web" assertions keep their meaning.
- `tests/home-services-list.test.js` (app): retired (the grouped list and price cards are removed by this story); its accessibility intent (linked rows with focus outline) is replaced in `tests/home-template.test.js` by "each service tile has a link to its route ending in `/`".
- `tests/technology-copy.test.js` (app): the casos-copy test is replaced by an assertion on the `RealProof` usage; the Person `knowsAbout` test stays.
- `tests/dark-variants.test.js` (app): the "space after `</strong>` in the home hero" test targets nothing now; replace it with the generic punctuation test that already exists, or point it at the new hero subtitle if it keeps inline tags.

Unchanged and must stay green: `scripts/check-seo-12.mjs`, `tests/single-price-source.test.js`, `tests/google-reviews-error.test.js`, `tests/trailing-slash-links.test.js`, `tests/seo-local-posicionamiento-web.test.js`, `tests/main-links.test.js`, `scripts/check-seo-07.mjs`, `scripts/check-seo-02.mjs` (not relaxed), `scripts/check-seo-06.mjs`, `public/llms.txt` (no home entry changes), the existing five rows of `src/data/internal-links.ts` `"/"`.

### Interfaces

No new shared interface. Page-local constants typed with the NRD-163 types:

```ts
import type {
  AccentTitle,
  Step,
  ComparisonItem,
  FaqItem,
} from "@/components/seo-local/types";
const homeFaqs: FaqItem[];
const homeProcess: Step[];
const comparison: ComparisonItem[];
const tileServices = services.filter((s) => s !== capilarLocal); // 6 entries, order: seoLocal, disenoWeb, tiendaOnline, desarrolloSoftware, automatizaciones, inteligenciaArtificial
```

`ServiceTileArt` props: `{ kind: "seo-local" | "diseno-web" | "tienda-online" | "software" | "automatizaciones" | "ia" }`. `HomeHeroMock` props: `{ animate?: boolean }`.

### Data

None: no schema, storage or settings change. FAQ copy stays in the page (as today); prices only via `tierFrom`; `src/data/services.ts`, `site.ts`, `seo-intents.ts` unchanged; `internal-links.ts` only gains the four niche rows of `"/"` (task 1.2).

### Test plan (TDD order)

1. Task 1.1: `tests/home-template.test.js` first asserts `ServiceTileArt.astro` and `HomeHeroMock.astro` exist, every `<svg` has `aria-hidden="true"` and `stroke-width="1.5"`, no `fill=` other than `none`/`currentColor`, and the hero mock has "Ejemplo ilustrativo" and a reduced-motion guard. RED, then draw.
2. Task 1.2: extend `tests/home-template.test.js` first: the home imports `SeoLocalHero`, `ProofStrip`, `ReviewBento`, `BentoTile`, `SeoLocalProcess`, `RealProof`, `SeoLocalAgencia`, `SeoLocalFaq`, `SeoLocalRelated`, `SeoLocalClosing`, `SeoLocalNap`; no `TitleSection`, `ProcessSteps`, `GoogleReviews`, `CTASection`, `InternalLinks`, `Badge`, glyph icon imports; no `SeoLocalPlans`; `data-seo12-hero` and `data-seo12-primary-cta` present; `<main` has `template-ground`; sections in reference order (index of each component tag increasing); six tiles each with `href={service.slug}` style links; the H2 of the comparison does not contain "Sevilla"; `internalLinksBySource["/"]` contains the four niche paths (trailing slash, `kind: "contextual"`) and still contains the five existing rows (scenario "Niche pages stay linked from the home"). Migrate the four old tests listed in Files in the same task. Scenarios: "Sections in reference order", "No plans on the home", "Service tiles", "Hero markers present", "Owned term in title and H1".
3. Task 1.3: first add `/` to `templatePages` and run `pnpm build && pnpm check:seo-17:dist` to observe RED (words over 1,100, FAQ count); extend `tests/home-template.test.js`: `homeFaqs` has 6-8 items, every price answer uses `tierFrom(seoLocal` and has a `/seo-local-sevilla/` link, no "€" literal in the page outside `tierFrom` results, `faqSchema(homeFaqs)` and `faqs={homeFaqs}` both present, no "la mejor"/"el mejor" self-claim. Then write the copy. Scenarios: "Word budget", "FAQ equals FAQPage", "Price questions use published plans", "Honest answer about the best consultant", "Reviews unavailable at build time" (`ProofStrip`/`RealProof` with `null`, already covered by NRD-163 components; verify a local build without the Places key).
4. Every task: `node --test tests/*.test.js`, `pnpm build`, `pnpm check:seo:dist` green; `node scripts/check-seo-16.mjs` still green (the reference page must not change).

### Real-browser / e2e checks (QA)

- `/` at 375, 768 and 1280 px against the UI spec: no horizontal overflow, hero two columns from 768 px, bento area map from 1024 px.
- Mobile menu, consent banner (does not cover the hero CTA, NRD-70), floating WhatsApp button and the booking CTA open the schedule in a new tab.
- Keyboard: tab order through hero CTA, secondary link, tile links, FAQ summaries (open/close with Enter/Space), related pills, closing CTA; visible 2 px sky focus outline.
- Hero mock: completed state with `prefers-reduced-motion: reduce`; scroll fill with motion allowed.
- LCP and CLS on mobile (Lighthouse or DevTools performance) compared with the NRD-18 baseline: no CLS regression; LCP element is now text or the drawing.
- `/seo-local-sevilla/` unchanged (spot screenshot at 1280 px).

### ADRs relied on

0003, 0004, 0006, 0008, 0012 (keyword ownership), 0013 (SEO site architecture), 0014 (template section components).

### Answers to the UI spec open questions

- **`#que-hago` scroll margin:** the anchor goes on the wrapping `SectionContainer id="que-hago"`; `SectionContainer` already renders `scroll-m-20` (5rem). No change to `ReviewBento`, so `/seo-local-sevilla/` and its check-seo-16 baseline are untouched.
- **Ids:** follow the NRD-163 id rule (its design, "Id rule"): every section gets a unique `headingId` for `aria-labelledby`; anchors for in-page links are the component `id` (rendered on its `<section>` with `scroll-m-20`) or the wrapping `SectionContainer id`. If the merged NRD-163 API names differ, the merged names win with the same meaning.
- **FAQ of 6 and C4:** compatible. Every visible question maps to a sourced question in NRD-164: item 2 ("¿Cuánto cobra un SEO al mes?") is question 1 and also answers 2 and 8 (same intent, so no duplicate answers); "¿Qué es el SEO?" is question 6 and "¿El SEO se paga?" is the second half of question 5, whose first half is the same as question 6. Rewording and splitting a sourced question is "natural rewording"; no question is invented. Six is inside the 6-8 range.

## Risks / Trade-offs

- [Removing the all-services price grid and the services list cuts internal links from the home to service pages] → the bento links every service page; related links keep their rows and gain the four parked niche pages (replacing the niche pills, so `check-seo-02` stays green without relaxing it); the inbound-link inventory (`scripts/seo-inventory.mjs`) is re-run by QA to confirm every service page keeps an inbound link from `/`.
- [Removing the eager raster portrait changes LCP] → expected improvement; verify against the NRD-18 baseline; the portrait stays `loading="lazy"` in the process band.
- [Copy budget vs. FAQ: 8 short answers can eat 400+ words] → choose 6-7 questions, merge 5 and 6, keep answers near 60 words.
- [Price answers could drift from data] → interpolation through `tierFrom` and the "no € literal" test.
- [NRD-163 API differs from its design] → merged API wins; deviations noted in the PR.
- Size: 5 points looks right for three work units; no size concern.

## UI spec

Visitor mode: Persuade (one primary action: book a first session). Visual authority: `DESIGN.md` ("The Annotated Storefront") and the visual API fixed in NRD-163's UI spec (`openspec/changes/nuriaromero-163-reusable-local-components/design.md`, "UI spec"): the page passes content only (text, links, SVG drawings, data); colours, type, radii, spacing, breakpoints, focus and motion belong to the components and `src/styles/template.css`. No new token, colour, font size or component beyond the two home drawings listed in Files. The old gray/yellow world (yellow `strong`, `Badge`, glyph icons, `bg-gray-900/60` cards, raster hero) disappears from the home entirely. Copy is Spanish, `tú`, sentence case; every string below is exact.

### 1. Page frame and order

- `<main class="template-ground px-4 pt-24">`, inside it one `<div class="space-y-24">` holding the groups below in this order. Assumption: `pt-24` mirrors `ServiceLayout variant="template"` so the hero clears the fixed `Header` exactly as on `/seo-local-sevilla/`.
- Groups (each a `SectionContainer` unless noted): (1) hero + proof strip in the same group, no gap between them (as the reference `hero` slot); (2) bento; (3) `.band` > process; (4) real proof; (5) comparison; (6) FAQ; (7) related; (8) closing band (component is full bleed, not wrapped) + NAP in a `SectionContainer`. One `.band` only (process); the closing band is separated from it by four plain sections.
- Heading outline: one h1 (hero keyword), seven h2 keyword headings (bento, process, real proof, comparison, FAQ, closing, NAP), h3 for tile and step names. "consultor SEO" appears in the h1 and only one h2 (comparison). No h2 contains a `keywordOwners` term of another page.

### 2. Hero (`SeoLocalHero` in `SectionContainer id="home-hero" class="seo12-home-hero" data-seo12-hero="true"`)

- `keyword` (h1): `Consultor SEO en Sevilla para negocios locales` (unchanged, NRD-122).
- `title`: `{ text: "Que tu próximo cliente te encuentre a ti", accent: "te encuentre a ti" }`. Assumption: shortened from the current display line "Haz que tu próximo cliente encuentre tu negocio" to fit 16ch display and the 1-4 word accent rule.
- `subtitle`: `Soy Nuria Romero, consultor SEO en Sevilla y desarrolladora web. Trabajo tu ficha de Google, tu web y cómo apareces en las respuestas de IA, y hablas siempre conmigo.` Assumption: keeps "consultor SEO en Sevilla" in the first paragraph and the "trato directo" promise of `homeDescription`; no emphasis inside it (the old yellow `strong` is gone, so the dark-variants space-after-`</strong>` case no longer exists).
- Primary action: `BookingButton` default label `Reserva una primera sesión` (no `primaryCtaLabel`). `actionsAttrs={{ "data-seo12-primary-cta": "" }}`.
- `secondaryLink`: `{ label: "Ver qué hago", href: "#que-hago" }`. The anchor `que-hago` is on the wrapping `SectionContainer`, which already carries `scroll-m-20` (5rem), so the bento keyword heading stays visible below the fixed header with no change to `ReviewBento` or `/seo-local-sevilla/` (Tech Lead decision).
- Visual slot: `<HomeHeroMock slot="visual" />` (section 3). The removed "Aceptando nuevos proyectos" badge is not replaced.
- Hierarchy: keyword h1 (small, `text-secondary`) > display title > subtitle (52ch) > booking button + text link > drawing (right from 768 px, below the copy on mobile). The LCP element becomes the display title.

### 3. `HomeHeroMock` (`src/components/home/HomeHeroMock.astro`)

Thesis: the home sells the consultant, not one listing, so the drawing shows the same business found in the three places the work covers (search, map, AI answer). It is a sibling of `ListingMock`, built with the same anatomy and token values, never a copy of its storefront.

- Frame: `<figure class="mock" aria-label="Ejemplo: tu negocio en el buscador, en el mapa y en un asistente de IA">`, `card-surface` fill, 1px `hairline`, 1.25rem radius, `overflow: hidden`, colour `text-body`; values via `var(--...)` from `src/styles/template.css`.
- Header strip (`drawing-surface` ground, 1px `hairline-quiet` bottom rule, padding 1rem 1.25rem): a drawn search pill (rounded rect, `sky-signal` 1.5 stroke, magnifier glyph drawn as circle + line) containing the HTML text `peluquería en Triana` in `text-strong`, 0.95rem. Assumption: a generic local search from a non-clinical trade (PRODUCT.md), in a Seville neighbourhood.
- Body (padding 1.1rem 1.25rem 1.25rem, `ul` with 0.9rem gap, three rows, each a 3-column grid: 2.5rem drawing / text / 1.25rem check):
  1. drawing: three stacked pill bars, the top one `signal`, the rest `soft` (a result list); label `En el buscador`.
  2. drawing: map pin (same path language as the bento "ficha" pin) over two `soft` street curves; label `En el mapa`.
  3. drawing: a chat bubble with a tail, two `soft` bars inside and one `signal` bar; label `En un asistente de IA`.
  Each row: label line in `text-muted` 0.8rem, then `Tu negocio` in `text-strong` 650 1rem; right column a circled check drawn in `sky-signal` (as `ListingMock` checks). Rows separated by 1px `hairline-quiet` rules.
- `figcaption`: `Ejemplo ilustrativo` (label token, `text-muted`, 0.8rem, padding 0 1.25rem 1rem).
- Drawings: inline SVG, `aria-hidden="true"`, `focusable="false"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="1.5"`, round caps and joins, `signal`/`soft` classes. No yellow, no stars, no rank numbers, no "#1": the drawing must not suggest a guaranteed position.
- Motion (`animate` default `true`): completed state is the default CSS. Only inside `@media (prefers-reduced-motion: no-preference)` and `@supports (animation-timeline: scroll())`: rows fade and rise 0.5rem in sequence and each check stroke draws (`stroke-dashoffset`), driven by `animation-timeline: scroll(root)` over the first ~30vh, with the same timed fallback pattern as `ListingMock`. `animate={false}` (closing band) renders the completed state with no animation rules applied.

### 4. Proof strip (`ProofStrip`)

`items` built in the page: `SITE_PROOF[0]` ("+10 años" / "de experiencia"), the Google cell only when `reviewsData` is not null (stat `"{rating} en Google"`, label `"{n} opinión|opiniones"`, computed as on the reference page), `SITE_PROOF[1]` ("2 webs en Sevilla" / "de negocios locales"). Reviews `null`: two cells, same row. No other figure.

### 5. Bento "qué hago" (`ReviewBento` + six `BentoTile`)

- `SectionContainer id="que-hago"` > `ReviewBento`: `headingId="que-hago-title"`, keyword `Servicios para negocios locales en Sevilla`, `title: { text: "Lo que puedo hacer por tu negocio", accent: "por tu negocio" }`, default caption `Ejemplo ilustrativo`.
- Tiles in `tileServices` order, h3 = outcome, link = owner page (`label: service.breadcrumbName`, `href: service.slug`), so title and link never repeat the same words. Assumption on all titles and sentences (one sentence each, at most 25 words):

| Area | Service | `layout` | `title` | `text` | `ServiceTileArt kind` |
| --- | --- | --- | --- | --- | --- |
| a | `seoLocal` | stack | `Que te encuentren cerca` | `Ordeno tu ficha de Google y tu web para que te encuentren en Google, en Maps y en las respuestas de IA.` | `seo-local` |
| b | `disenoWeb` | stack | `Una web que se entiende` | `Webs claras y rápidas, pensadas para el móvil y preparadas para que te encuentren.` | `diseno-web` |
| c | `tiendaOnline` | stack | `Vender por internet` | `Vende tus productos desde una tienda propia, fácil de gestionar en tu día a día.` | `tienda-online` |
| d | `desarrolloSoftware` | stack | `Herramientas a tu medida` | `Programas hechos para tu negocio cuando las hojas de cálculo y el software genérico se quedan cortos.` | `software` |
| e | `automatizaciones` | stack | `Menos tareas repetitivas` | `Conecto las aplicaciones que ya usas para que las tareas repetitivas se hagan solas.` | `automatizaciones` |
| f | `inteligenciaArtificial` | row | `Respuestas a cualquier hora` | `Asistentes con IA que responden las dudas frecuentes de tus clientes con la información de tu negocio.` | `ia` |

- `ServiceTileArt` drawings (single stroke, `signal` for the part that matters, `soft` for context, `label` text only where named; aspect ratios match the area so tiles stay balanced):
  - `seo-local` (wide, viewBox ~360x150): map pin + listing card bars + five outline stars in `signal` (outline only, no yellow fill: not a real rating).
  - `diseno-web` (~320x130): browser window with dot bar, `signal` title bar, `soft` text bars, and a small phone outline overlapping its right edge.
  - `tienda-online` (tall, ~320x300, area c is two rows high): phone outline with three product rows (square thumbnail + two bars) and a `signal` pill button at the bottom.
  - `software` (~320x130): table of four rows with a `signal` check column on the right.
  - `automatizaciones` (~320x130): three rounded nodes joined by arrows, labels `correo`, `hoja`, `factura`.
  - `ia` (~320x150, beside text from 768 px): one `soft` question bubble and one `signal` answer bubble, labels `¿Abrís el sábado?` and `Sí, de 10 a 14 h`.
- Hover: none on tiles (only the text link reacts, `.tpl-link`). The whole tile is not clickable: one link per tile, after the sentence.

### 6. Process (`.band` > `SeoLocalProcess`)

- `id="proceso"` (section anchor), `headingId="proceso-title"`, keyword `Cómo trabajo contigo, paso a paso`, `title: { text: "Sin intermediarios, de principio a fin", accent: "de principio a fin" }`, `portraitAlt="Nuria Romero, consultor SEO en Sevilla y desarrolladora web"`, no `aside` (no cycle: the monthly cycle is specific to the SEO local service).
- `byline` slot: `Soy Nuria Romero: llevo más de 10 años desarrollando software y ahora trabajo con negocios de Sevilla.` (no self link to `/`).
- `homeProcess` (4 steps). Assumption on wording, condensed from today's five steps without adding facts:
  1. `Me cuentas tu caso` / `Una primera sesión para entender tu negocio y qué te frena hoy.`
  2. `Propuesta por escrito` / `Precio, alcance y plazos cerrados antes de empezar.`
  3. `Avances a la vista` / `Ves cómo avanza el trabajo y opinas por el camino, no solo al final.`
  4. `Lanzamiento y seguimiento` / `Publico, te enseño a manejarlo y sigo disponible; en SEO local, mes a mes.`

### 7. Real proof (`RealProof`)

`SectionContainer id="trabajo-real"` > `RealProof headingId="prueba-title"`, keyword `Opiniones y proyectos reales en Sevilla`, `title: { text: "Trabajo que puedes ver", accent: "puedes ver" }`, `reviews={reviewsData}`, `projects={["arkady", "adfsevilla"]}`, `note`: `Dos webs reales de negocios de Sevilla, hechas por mí. Visítalas y juzga el trabajo por ti.` Reviews `null`: quote card omitted, note and projects remain.

### 8. Comparison (`SeoLocalAgencia`)

`id="consultor-o-agencia"`, `headingId="consultor-title"`, keyword `¿Consultor SEO o agencia?`, `title: { text: "Dos formas de llevar tu SEO", accent: "tu SEO" }`, `link: { label: "Ver los planes de SEO local", href: "/seo-local-sevilla/#precios" }`. Items (Assumption, adapted from the reference without "agencia SEO Sevilla"):

1. lead `Con una agencia, tu cuenta suele pasar por varias personas.` text `Conmigo hablas directamente con quien revisa tu ficha y trabaja tu web.`
2. lead `Una agencia tiene más manos para campañas, redes y diseño a la vez.` text `Si lo que necesitas es que Google entienda bien tu negocio, una consultora con base técnica suele bastar.`
3. lead `Elijas lo que elijas, pide por escrito qué incluye cada mes.` text `Mis planes de SEO local están publicados, con precio y alcance, y sin promesas de posiciones.`

### 9. FAQ (`SeoLocalFaq`)

- Keyword `Preguntas frecuentes sobre SEO`, `title: { text: "Dudas antes de llamar", accent: "antes de llamar" }`, `lede`: `Si tu duda no está aquí, la resolvemos en la llamada.`, `ctaLabel="Reserva una primera sesión"` (Assumption: same label as the hero so the page has one action name).
- `homeFaqs`, 6 items in this order (story question number in brackets). The component bolds the first sentence, so each first sentence is the direct answer (GEO-1). Assumption on all wording; prices only by interpolation:
  1. [3] `¿Qué hace un consultor SEO?` / `Revisa cómo apareces en Google y mejora lo que hace que te encuentren: tu ficha de Google, tu web y tus reseñas. En mi caso también hago la parte técnica de la web, así que no necesitas a otra persona para aplicar los cambios.`
  2. [1] `¿Cuánto cobra un SEO al mes?` / `` `Depende del alcance, y lo habitual es una cuota mensual. Yo publico mis precios: el Plan Local cuesta ${tierFrom(seoLocal, "Local")} y el Local Pro, ${tierFrom(seoLocal, "Local Pro")}, facturados mes a mes.` `` with `links: [{ label: "Ver los planes de SEO local", href: "/seo-local-sevilla/" }]`.
  3. [4] `¿Quién es el mejor consultor SEO?` / `No hay un mejor consultor SEO para todo el mundo: el adecuado es el que encaja con tu negocio y te explica lo que hace. Fíjate en que publique precios y alcance, en que hables con quien hace el trabajo, en que enseñe trabajos reales y en que no te prometa posiciones.`
  4. [6] `¿Qué es el SEO?` / `Es el trabajo para que tu negocio aparezca en Google cuando alguien busca lo que ofreces, sin pagar por cada clic. Incluye tu web, tu ficha de Google y, cada vez más, cómo te mencionan los asistentes de IA.`
  5. [5] `¿El SEO se paga?` / `Aparecer en los resultados normales de Google es gratis: no pagas por cada clic ni por cada visita. Lo que se paga es el trabajo para conseguirlo, lo hagas tú, una agencia o una consultora.`
  6. [7] `¿Qué diferencia hay entre SEO y SEM?` / `El SEO trabaja para que aparezcas en los resultados normales de Google; el SEM son anuncios que pagas por cada clic. El SEO tarda más en notarse, pero lo que consigues no depende de seguir pagando cada clic.`
- Questions 2 and 8 of the story are covered by item 2 (same intent); none of the six collides with a `/seo-local-sevilla/` FAQ question.

### 10. Related, closing and NAP

- `SeoLocalRelated`: `links={internalLinksBySource["/"]}`, default label `Sigue leyendo`. Nine pills: the five existing rows, then the four niche rows (see Files). No other markup.
- `SeoLocalClosing`: `headingId="cierre-title"`, keyword `Reserva una primera sesión conmigo`, `title: { text: "Hablemos de cómo te encuentran tus clientes", accent: "tus clientes" }`, `text`: `Cuéntame cómo es tu negocio y te diré qué tiene sentido hacer primero, sin compromiso.`, `ctaLabel="Reserva una primera sesión"`, default `meta` (`30 minutos · Sin compromiso · Directamente conmigo`), `<HomeHeroMock slot="visual" animate={false} />`. Assumption on copy.
- `SeoLocalNap`: `headingId="nap-title"`, keyword `Dónde trabajo: La Rinconada, Sevilla`. Assumption.

### 11. Text budget

Estimated visible words: hero ~50, proof ~15, bento ~170, process ~85, real proof ~30 plus the live review and project cards (~120), comparison ~95, FAQ ~300, related ~35, closing ~40, NAP ~20: about 960-1,000 (the four niche pills add ~20 words to related). If `check-seo-17` reports more than 1,100 (long live review), trim FAQ second sentences first, never the first sentence of an answer; below 900, nothing is added to tiles (25-word cap).

### 12. States

Static site, no loading or async state. Build-time states only: reviews `null` (proof strip drops the Google cell, real proof drops the quote, no reviews JSON-LD); `internalLinksBySource["/"]` empty (related renders nothing). No empty, error or disabled UI state exists on this page.

### 13. Responsive

Inherited from the components (NRD-163 UI spec, section 5): 320-767 px everything single column, hero drawing below the copy, proof strip stacked with top rules below 640 px; 768 px hero two columns 1.05fr/0.95fr, bento two columns with areas a and f full width and f in row layout; 1024 px six-area bento, process 20rem portrait + steps, FAQ 0.8fr/1.2fr with sticky intro, comparison 0.8fr/1.2fr. `HomeHeroMock` at 320 px: rows keep the three-column grid, label text wraps, no horizontal overflow; the search text may wrap to two lines.

### 14. Interactions and motion

All hover/focus states come from the components: booking pill, `.tpl-link` (tile links, FAQ links, comparison link, hero secondary link), related pills, FAQ `details` summary (Enter/Space, drawn plus loses its vertical stroke when open), 2px `sky-signal` focus outline with 2-4px offset. One authored scroll moment on the page: the hero mock fill (section 3); the closing mock is static. No reveal animation on the hero section (`seo12` exclusion stays). No destructive actions.

### 15. Accessibility hand-off

- Tab order: header, hero booking button, `Ver qué hago`, six tile links (a-f, DOM order equals visual order), review link (when present), project links, comparison link, FAQ booking button, FAQ summaries and their answer links, related pills, closing booking button, NAP phone and Maps links.
- Every drawing is `aria-hidden`; the information is repeated in tile titles and sentences. `HomeHeroMock` exposes its `aria-label` and readable text; its row labels are real text.
- Ids (NRD-163 id rule: `headingId` = keyword heading id for `aria-labelledby`; `id` or the wrapping `SectionContainer id` = in-page anchor with `scroll-m-20`). Anchors: `home-hero`, `que-hago`, `proceso`, `trabajo-real`, `consultor-o-agencia`. Heading ids: `que-hago-title`, `proceso-title`, `prueba-title`, `consultor-title`, `faq-title`, `cierre-title`, `nap-title`; all unique on the page.
- Tile link labels name the destination service (`SEO local en Sevilla`, `Diseño web en Sevilla`...), unique on the page.
