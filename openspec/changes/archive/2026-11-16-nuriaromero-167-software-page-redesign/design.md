# Design

## Context

See proposal.md (Why). State on `develop` (86027b0), plus NRD-195 (runtime-import price test) and NRD-168 (one-plan rule in `SeoLocalPlans`), both merged before this story per sprint order:

- `src/pages/desarrollo-software-medida.astro` is a one-liner: `<ServiceLayout page={desarrolloSoftware} />`.
- `desarrolloSoftware` (`src/data/services.ts` lines 169-273): title "Desarrollo de software a medida en Sevilla | Aplicaciones web" (pinned by `tests/software-medida-intent.test.js` and `tests/seo-meta-titles.test.js`), description with "aplicaciones web a medida" and "años de experiencia", H1 "Desarrollo de software a medida en Sevilla para tu empresa", long subtitle, `sectionTitles` (process "Así es el proceso de desarrollar tu aplicación a medida" and pricing "Cuánto cuesta el software a medida en Sevilla" are the intent row `contentSignals`; benefits "Qué gana tu empresa con software a medida"; faq "Preguntas frecuentes sobre software a medida en Sevilla"), 4 long benefits (one names NTT DATA), 4 steps, `pricing` `{ from: "999 €", includes: [5], note: "Cada proyecto es distinto: tras la primera reunión te doy un presupuesto cerrado por fases." }`, nine long FAQs (the one about changes already publishes: "el código y la documentación son tuyos desde el primer día, sin cláusulas que te aten"), no `cta`.
- Guards: `tests/software-medida-intent.test.js` (title, H1, description signals, intent row, inbound links from design web, automatizaciones and IA, reciprocal pair with `/diseno-web-sevilla/` through the related rows), `tests/seo-meta-titles.test.js`, `tests/keyword-ownership.test.js`, `tests/adr-0013-link-rows.test.js`, `scripts/check-seo-02.mjs` (breadcrumb "Software a medida"), `check-seo-07` (signals, reciprocal pair inside `<main>`, ownership), `check-seo-16`, `check-seo-17`.
- Real projects: `arkady` (a bookings website built from scratch with Vite, React and Tailwind) and `adfsevilla` (WordPress website). No custom-software client is published.
- Template precedent: `/diseno-web-sevilla/` (NRD-165), ADR 0014; one-plan pattern: NRD-166's design.

## Goals / Non-Goals

**Goals:**

- Same intent, about 40% fewer words, in the template world; NRD-124 placement and intent row intact.
- FAQPage = visible FAQ, one Service Offer = the one visible plan (999).

**Non-Goals:**

- New prices, phase prices or lead times; changes to the ownership registry; Sortlist/Clutch.

## Decisions

**Approach.** Same data-driven pattern as the other template service pages. The process and pricing `sectionTitles` stay as keyword headings (intent signals). The price becomes `const SOFTWARE_FROM = "999 €"` at the top of `services.ts`, used by `pricing.from` and interpolated in the price answer, so the figure has one literal (NRD-195 made `single-price-source.test.js` read prices by import, so a constant is fine). The plan is built in the page from `desarrolloSoftware.pricing`, as on `/automatizaciones/`, so the existing single Service Offer equals it. Real proof uses the two real sites with a note that says what they are (websites; `arkady` includes a bookings flow built from scratch), never a software client. Code ownership is answered with the sentence the site already publishes; no new contractual claim, so no owner question is needed (the AC's `needs-human` path does not trigger).

Alternatives considered: a one-tier `pricing.tiers` (rejected: duplicates the price literal); omitting `RealProof` as on `/automatizaciones/` (rejected: the story lists it and `arkady` is real custom development with a bookings flow; the note keeps it honest); keeping the NTT DATA benefit as a bento tile (rejected: the bento is "what can be built"; the experience claim moves to the process byline if the UI spec keeps it).

**One-plan layout.** Relies on NRD-168's `.plan-list:has(> .plan:only-child)` rule (one column, `max-width: 36rem`, left-aligned with the heading and the lede; the same value on 166, 167 and 168); if absent after rebasing, task 2.1 adds it as NRD-168's design specifies (CSS only) and checks the other template pages' plans unchanged.

### Section map (reference order)

| #   | Slot             | Component                                                                                                       | Content source                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --- | ---------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `hero`           | `SeoLocalHero` + `ProofStrip`                                                                                   | `keyword=desarrolloSoftware.hero.h1` (unchanged), `title={ text: hero.title, accent: hero.titleAccent }` (new), `subtitle` (shorter), `secondaryLink={ label: "Ver precio", href: "#precios" }` (new `secondaryCta`), `<AppMock slot="visual" />`; proof items exactly as `/diseno-web-sevilla/`: `SITE_PROOF[0]`, the Google rating when reviews exist, `SITE_PROOF[1]`                                                                                  |
| 2   | `benefits`       | `SectionContainer id="que-se-puede-hacer"` > `ReviewBento headingId="que-se-puede-hacer-title"` + 6 `BentoTile` | `keyword=desarrolloSoftware.sectionTitles.benefits` (new: "Qué software a medida puedo hacer para tu empresa"); tiles from `desarrolloSoftware.benefits` in order aplicación web, app para el móvil, gestión interna o ERP, API e integraciones, reservas, panel de datos; one sentence each; `<SoftwareTileArt kind=... />`; areas a-f                                                                                                                   |
| 3   | `process`        | `.band` > `SeoLocalProcess id="proceso"`                                                                        | `keyword=desarrolloSoftware.sectionTitles.process` (unchanged signal); 4 steps: análisis de tu forma de trabajar, fase 1 con precio y plazo cerrados por escrito, entregas parciales que ya usas, ampliación cuando toca; no lead-time figure; portrait on; `byline` slot may carry the published experience ("más de 10 años")                                                                                                                           |
| 4   | `before-pricing` | `RealProof` + `SeoLocalAgencia id="medida-o-estandar"`                                                          | RealProof `projects=["arkady", "adfsevilla"]`, `reviews`, note presenting them as real projects made from scratch for Seville businesses; comparison keyword "¿Software a medida o estándar?", three items in the page (when a standard program or a spreadsheet is enough; when custom pays off: hours lost copying data, several people on the same data, a program that forces your process; start with one phase), link "Ver el precio" to `#precios` |
| 5   | `pricing`        | `.band` > `SeoLocalPlans`                                                                                       | `keyword=desarrolloSoftware.sectionTitles.pricing` (unchanged signal), `tiers={[plan]}` with `plan = { name: "Primera fase", from: desarrolloSoftware.pricing.from, includes: desarrolloSoftware.pricing.includes ?? [], note: desarrolloSoftware.pricing.note }`, `lede` slot with `<strong>desde {desarrolloSoftware.pricing.from}</strong>` and "por fases"                                                                                            |
| 6   | `faq`            | `SeoLocalFaq headingId="faq-title"`                                                                             | `keyword=desarrolloSoftware.sectionTitles.faq` (unchanged), five sourced items                                                                                                                                                                                                                                                                                                                                                                            |
| 7   | `related`        | `SeoLocalRelated`                                                                                               | `internalLinksBySource["/desarrollo-software-medida/"]` unchanged (automatizaciones, IA, diseño web with the reciprocal anchor, contacto)                                                                                                                                                                                                                                                                                                                 |
| 8   | `closing`        | `SeoLocalClosing` + `SeoLocalNap`                                                                               | `desarrolloSoftware.cta` (new), `<AppMock slot="visual" animate={false} />`; closing keyword "Reserva una llamada sobre tu proyecto"; NAP keyword "Software a medida desde La Rinconada, Sevilla"                                                                                                                                                                                                                                                         |

Display titles, accents, ledes and tile sentences are fixed by the UI spec (ux-designer, impeccable). The plan name "Primera fase" is display copy; if the UI spec prefers another, it must not imply a fixed scope or a price other than "desde". Copy constraints: no figure other than the published price and "+10 años"/"más de 10 años", `tú`, jargon explained (API, ERP get a plain gloss in their tile sentence). The "app para el móvil" tile describes an application your team uses from the phone; it does not promise a native store app.

### Decisions on the UX open questions (2026-11-16)

1. **ProofStrip.** Use `[SITE_PROOF[0], rating?, SITE_PROOF[1]]`, the same items as `/diseno-web-sevilla/`. "2 webs en Sevilla / de negocios locales" is published, verified proof, and it is the same work the RealProof section shows (`arkady`, `adfsevilla`). Without it, a build with no reviews would leave a strip of one cell. This differs from `/automatizaciones/`, which has no RealProof and where websites prove nothing about the service.
2. **Bare "999 €" on the plan card.** Keep `SeoLocalPlans` and `Tier` unchanged, and pass `from` straight from data. Every template plan card on the site shows the bare price ("149 €" and "399 €" on `/diseno-web-sevilla/`, "499 €" on the store page), with "desde" in the lede. Changing the shared component would touch every template page and the reference fixture to serve one card. Three things already make the card read as a starting price: the lede (`desde {pricing.from}`, "por fases"), the plan name "Primera fase" and the note ("presupuesto cerrado por fases"). The UI spec must keep the lede with "desde" and must not drop the note. The Service Offer still reads `pricing.from`.
3. **Word budget (750-850, set by the story).** The range does not move. The Projects cards come from the shared `Projects.astro` and are not trimmed here. If `check-seo-17` reports more than 850 words, trim in this order and stop as soon as the page fits:
   1. The last sentence or second paragraph of FAQ answers. Never the first two sentences (GEO-1), and never the code-ownership sentence.
   2. The `text` of the comparison items, down to one short clause each.
   3. The RealProof note, down to one sentence.
   4. The closing text.

   FAQ items, bento tiles and steps are never removed (the spec and C4 require them). Below 750 words, extend the FAQ answers first.

### FAQ (GEO block)

Five items, answers about 50-65 words, first two sentences answer directly, `tú`:

1. "¿Qué es un software a medida?" (KW-Labs): an application made for how your company works (orders, bookings, quotes, client portal), instead of adapting to a generic program.
2. "¿Cuánto cuesta un software a medida?" (KW-Ads): `` `Desde ${SOFTWARE_FROM} para una herramienta interna sencilla...` `` then the phase-by-phase written quote; no other figure, no competitor range.
3. "¿Qué se puede desarrollar a medida: aplicación web, app móvil, ERP o API?" (top snippets): the six bento items in one or two sentences; coherence with the bento.
4. "¿De quién es el código?" (top snippet): "El código y la documentación son tuyos desde el primer día..." (the published claim, `services.ts` line 250), plus that another professional can continue it.
5. "¿Qué empresas de desarrollo de software a medida hay en Sevilla?" (dominant SERP format): no ranking or "las mejores"; what to look at (who builds it, phases with written prices, code ownership, references you can visit) and that Nuria works directly with you in Seville.

Left out: "¿Software a medida o software estándar para mi empresa?" (weak evidence; covered by the comparison section, as the story says). The current answers about Excel, SaaS, phases, changing requirements and technology go; their key facts stay in the comparison, process and plan.

### Files

All in layer `app`.

Create:

- `src/components/software/AppMock.astro`: single-SVG figure of an internal tool (sidebar, a header bar, a list of five order/booking rows with status pills drawn as strokes, one row highlighted in `signal`); `animate?: boolean` (completed state by default; row highlight motion only under `prefers-reduced-motion: no-preference`; nothing hidden in the initial state); caption "Ejemplo ilustrativo"; `aria-label` on the figure; SVG `aria-hidden`; no numbers, names or dates in the drawing.
- `src/components/software/SoftwareTileArt.astro`: `{ kind: "web" | "movil" | "gestion" | "api" | "reservas" | "datos" }`, one SVG each (1.5 stroke, `currentColor`, `aria-hidden`, `signal`/`soft`/`label` classes); the `datos` tile draws axes and a stroke line without values.
- `tests/software-template.test.js`.

Modify:

- `src/data/services.ts`: `const SOFTWARE_FROM = "999 €"` next to the design-web constants (with a one-line comment); `desarrolloSoftware`: `pricing.from: SOFTWARE_FROM`, new `hero.title`, `hero.titleAccent`, shorter `hero.subtitle`, `hero.secondaryCta`, `sectionTitles.benefits`, six `benefits`, four `process` steps, five `faqs`, new `cta`. Unchanged: `slug`, `breadcrumbName`, `seo.*`, `hero.h1`, `sectionTitles.process`, `sectionTitles.pricing`, `sectionTitles.faq`, `pricing.includes`, `pricing.note`.
- `src/pages/desarrollo-software-medida.astro`: template slots per the section map.
- `scripts/lib/template-pages.mjs`: `{ route: "/desarrollo-software-medida/", words: [750, 850], service: true }`.
- Fallback only: `src/components/seo-local/SeoLocalPlans.astro` one-plan rule if NRD-168's is missing.

Unchanged and green: `tests/software-medida-intent.test.js`, `tests/seo-meta-titles.test.js`, `tests/keyword-ownership.test.js`, `tests/adr-0013-link-rows.test.js`, `tests/single-price-source.test.js` (llms line 12 lists no price), `public/llms.txt`, `check-seo-02/07/16`.

### Interfaces

```ts
// src/components/software/AppMock.astro
interface Props {
  animate?: boolean;
}
// src/components/software/SoftwareTileArt.astro
interface Props {
  kind: "web" | "movil" | "gestion" | "api" | "reservas" | "datos";
}
```

No data type change.

### Data

No storage or migration, no price change (the literal moves into a constant with the same value). FAQPage from nine to five questions; Service (one Offer 999) and BreadcrumbList unchanged.

### Test plan (TDD order)

1. Task 1.1, illustration assertions first in `tests/software-template.test.js`: SVGs `aria-hidden`, stroke 1.5, no filled shapes, "Ejemplo ilustrativo" on `AppMock`, reduced-motion guard and no `opacity: 0`/`visibility: hidden` in the default CSS, the six-kind union, no digits or names in SVG `<text>`. Scenario "Illustrations".
2. Task 2.1, structure assertions first: page uses `variant="template"` with `SeoLocalHero`, `AppMock`, `ProofStrip`, `ReviewBento`, `SoftwareTileArt`, `SeoLocalProcess`, `RealProof`, `SeoLocalAgencia`, `SeoLocalPlans`, `SeoLocalFaq`, `SeoLocalRelated`, `SeoLocalClosing`, `SeoLocalNap` in this order; no `TitleSection`, `✓`, `text-gray-`/`bg-gray-`; keyword headings bound to `desarrolloSoftware.sectionTitles.*`; plan built from `desarrolloSoftware.pricing` (no "€" in the page); `services.ts` holds exactly one `"999 €"` literal (`const SOFTWARE_FROM`) and `desarrolloSoftware.pricing.from === "999 €"`; six `benefits` covering web, móvil, gestión/ERP, API, reservas, datos; four steps; every `desarrolloSoftware` string has no digit other than "999" and "10" (experience). Then implement; `software-medida-intent`, `check-seo-02` (one Offer 999, breadcrumb) and `check-seo-07` green. Scenarios "Owned term kept", "No term of another owner in headings", "Sections in reference order", "Legacy blocks removed", "One plan, one offer", "Real proof only", "Reciprocal pair intact".
3. Task 2.2, add the template entry, observe `pnpm build && pnpm check:seo-17:dist` RED, then FAQ assertions: five items whose normalised questions equal the list above in order; the price answer interpolates `${SOFTWARE_FROM}` in source and mentions "fases"; the code answer matches `/c[oó]digo/` and `/tuyos? desde el primer d[ií]a/`; the companies answer matches no `/mejores|ranking|top \d/i` and mentions "Sevilla"; the "what can be built" answer names web, móvil, ERP and API. Then write the copy within 750-850 words. Scenarios "Word budget", "FAQ equals FAQPage", "Price answer from data", "Code ownership as already published", "Companies in Seville without a ranking".
4. Every task: `node --test tests/*.test.js`, `pnpm build`, `pnpm check:seo:dist` green.

### Real-browser / e2e checks (QA)

- `/desarrollo-software-medida/` at 375, 768, 1024 and 1280 px against the UI spec: no overflow (the H1 at 768 px, fixed in NRD-159, still fits); the single plan is one readable column; bento area map from 1024 px.
- Keyboard: hero CTA, "Ver precio" (lands on `#precios` below the fixed header), project cards, comparison link, plan button, FAQ summaries, related pills, closing CTA; 2 px sky focus.
- `AppMock` completed state with reduced motion and first paint before any scroll.
- Rich Results Test: Service with one Offer 999, FAQPage with five questions, BreadcrumbList.

### ADRs relied on

0003, 0004, 0005, 0006, 0008, 0012, 0013, 0014.

## Risks / Trade-offs

- [Proof from websites on a software page] -> the note says what they are; `arkady`'s bookings flow built from scratch is the closest true example; no software client claimed.
- ["App móvil" read as a native store app] -> tile sentence describes an app your team uses from the phone; the UI spec keeps that wording.
- [750-850 words with real proof and five FAQs] -> answers about 55 words, one-sentence tiles and steps; trimming order in "Decisions on the UX open questions" item 3.
- [Bare price on the single plan card read as a fixed price] -> the lede says "desde" and "por fases", and the plan name and note frame it as a first phase; same pattern as the other template plans (decision 2).
- [Prerequisites not merged] -> the price constant needs NRD-195's test refactor (otherwise `single-price-source` cannot see the price; keep the literal and add an equality test as `disenoWeb` does); the one-plan rule has the fallback in task 2.1.
- Size: three work units for 5 points; no size concern.

## UI spec

Visual authority: `DESIGN.md` ("The Annotated Storefront") as rendered by `/seo-local-sevilla/` and `/diseno-web-sevilla/` (`src/pages/diseno-web-sevilla.astro` is the closest pattern; copy its composition, not its copy). Mode: persuade (one primary action: book a call). No new palette, type scale or shared component: every section is an NRD-163 template component (`src/components/seo-local/*`) with props, plus the two page illustrations listed in Files. Colours, type and surfaces come only from `src/styles/template.css` (`--ink-ground`, `--sky-signal`, `--sky-accent`, `--drawing-soft`, `--hairline`, `--hairline-quiet`, `--card-surface`, `--drawing-surface`, `--text-*`, `--ease-out`, `.band`, `.tpl-kw`, `.tpl-display`, `.tpl-accent`, `.tpl-link`). Copy is Spanish, `tú`, no unexplained jargon; the only figures are the price (interpolated from `SOFTWARE_FROM` in `services.ts` or `desarrolloSoftware.pricing.from` in the page, never typed in the page) and "+10 años" / "más de 10 años". Every display title has exactly one accent phrase (the `accent` value, a verbatim substring of `text`). Strings below are exact; `\n\n` would mean a new paragraph (none is used: every FAQ answer is one paragraph to fit the word budget).

What this redesign fixes against the reference: the old page is four long gray benefit cards, a nine-question wall of text and a pricing box in the old Tailwind world. All of it goes. The page reads as the same quiet working document as `/seo-local-sevilla/`, with the drawing changed from a Google listing to a small internal tool, so the visitor sees "a program for my orders" before reading a word.

### 1. Hero (`SeoLocalHero` + `AppMock` + `ProofStrip`)

- Layout: reference hero unchanged (one column under 768 px: copy then drawing; `1.05fr / 0.95fr` from 768 px; sky halo behind the drawing, clipped by the component).
- Hierarchy: keyword h1 (small, slate) > display title > subtitle > booking button (primary, the only filled control) + "Ver precio" underlined text link (secondary) > drawing.
- `keyword=desarrolloSoftware.hero.h1` (unchanged).
- `title={ text: "Software que trabaja como tu empresa", accent: "como tu empresa" }` (new `hero.title`, `hero.titleAccent`). Assumption: display copy; states the page's one idea (the tool adapts to you, the published positioning "se adaptan a tu negocio, y no al revés").
- `subtitle` (new `hero.subtitle`): `` `Desarrollo aplicaciones web a medida para tus pedidos, reservas, presupuestos o clientes. Empezamos por una primera fase desde ${SOFTWARE_FROM}, con precio cerrado.` `` Assumption: shortened copy; keeps "aplicaciones web a medida" (owned here, NRD-124) in body text, about 25 words.
- `primaryCtaLabel`: not passed (site default). `secondaryLink={ label: "Ver precio", href: "#precios" }` from new `hero.secondaryCta`.
- `AppMock` (`src/components/software/AppMock.astro`), the hero focal drawing:
  - Same figure shell as `src/components/diseno-web/WebMock.astro`: `<figure>` with 1px `--hairline` border, 1.25rem radius, `--card-surface`, `overflow: hidden`; drawing area on `--drawing-surface` with 1.25rem padding and a `--hairline-quiet` bottom rule; `<figcaption>Ejemplo ilustrativo</figcaption>` in `--text-muted` 0.78rem.
  - One SVG, `viewBox="0 0 320 220"` (same as WebMock, so both mocks share proportions and it scales down to 320 px without overflow), `fill="none"`, 1.5 stroke, round caps/joins, `currentColor` base = `--text-muted`; classes `signal` (`--sky-signal`), `soft` (`--drawing-soft`), `label` (`--text-secondary`), declared in the component like WebMock.
  - Composition (Assumption: drawing composition inside the design's description): an app window (rounded rect, rx 10) split into a left sidebar about 64 units wide (four `soft` nav bars, the second one `signal` = active section) and a main area; in the main area a header row with one SVG `<text class="label">Pedidos</text>` (the only text in the drawing, a common noun, no digits), a `soft` search pill and a small `signal` outlined "+" button; below, a list of five rows separated by `soft` hairlines, each row: a small circle (checkbox), two `soft` bars standing in for client and date, and a status pill outline at the right end. Row 2 is the highlighted row: its row outline (rect rx 6) and its status pill are `signal`. No numbers, names, dates, prices or fake totals anywhere.
  - `aria-label` on the figure: "Herramienta interna de ejemplo con una lista de pedidos y su estado". Assumption: wording. SVG `aria-hidden="true" focusable="false"`.
  - Motion (`animate` default `true`): completed state is the default CSS (all rows, the highlight and the pills visible; no `opacity: 0`, no `visibility: hidden`). Only inside `@media (prefers-reduced-motion: no-preference)` and `@supports (animation-timeline: scroll())`: the five row bars draw in top to bottom (`stroke-dashoffset` on `pathLength="1"`), then the row 2 highlight outline and its pill draw, on `scroll(root block)` within the first ~260px, like WebMock. Without scroll timelines (still under no-preference): only the highlight outline draws once, 0.7s `--ease-out`. `animate={false}` (closing band) renders the completed state with no animation. Assumption: motion details.
- `ProofStrip` (`src/components/seo-local/ProofStrip.astro`): `items` = `[SITE_PROOF[0], rating?, SITE_PROOF[1]]` exactly as `/diseno-web-sevilla/`: "+10 años / de experiencia", then the Google cell (computed in the page as there) only when `reviewsData` is not null, then "2 webs en Sevilla / de negocios locales" (the same work RealProof shows). No other figure.

### 2. Bento "qué se puede hacer a medida" (`ReviewBento` + 6 `BentoTile` + `SoftwareTileArt`)

- `SectionContainer id="que-se-puede-hacer"` > `ReviewBento headingId="que-se-puede-hacer-title"`, `keyword=desarrolloSoftware.sectionTitles.benefits` ("Qué software a medida puedo hacer para tu empresa"), `title={ text: "Herramientas que encajan en tu día a día", accent: "en tu día a día" }`, caption default "Ejemplo ilustrativo". Assumption: display copy.
- Area map is the component's (`a a a a b b / c c d d d d / c c e e e e / f f f f f f` from 1024 px); tiles in source order a-f, `desarrolloSoftware.benefits` in the same order; the page holds a `tiles` array of `{ area, kind, layout }` like `/diseno-web-sevilla/`. Titles h3 (component), one sentence each, no `link`. All titles and sentences Assumption: copy written from the story list and the published facts; API and ERP get their plain gloss inside the sentence.

| Area | `kind`     | Title                   | Sentence                                                                                                 | Layout |
| ---- | ---------- | ----------------------- | -------------------------------------------------------------------------------------------------------- | ------ |
| a    | `web`      | "Aplicación web"        | "Una herramienta que abres en el navegador desde cualquier ordenador, sin instalar nada."                | stack  |
| b    | `movil`    | "App para el móvil"     | "Tu equipo la abre desde el móvil para consultar o apuntar datos esté donde esté."                       | stack  |
| c    | `gestion`  | "Gestión interna o ERP" | "Pedidos, stock, presupuestos y facturas en un solo sitio: eso es un ERP, un programa de gestión."       | stack  |
| d    | `api`      | "API e integraciones"   | "Conecto tu herramienta con los programas que ya usas mediante una API, para que los datos pasen solos." | stack  |
| e    | `reservas` | "Reservas y citas"      | "Tus clientes eligen día y hora, y tú ves la agenda completa sin llamadas ni papeles."                   | stack  |
| f    | `datos`    | "Panel de datos"        | "Ves de un vistazo cómo van tus pedidos, ventas o reservas, con datos que hoy tienes repartidos."        | `row`  |

- `SoftwareTileArt` (`src/components/software/SoftwareTileArt.astro`): one SVG per `kind`, `aria-hidden="true" focusable="false"`, 1.5 stroke, round caps/joins, `currentColor`, no fills, no `<text>`, no digits; uses only the `BentoTile` `:global(.signal|.soft|.label)` classes (do not restyle). Each drawing fits its area shape. Assumption: compositions.
  - `web` (wide area a): a browser frame with three dots and an empty `soft` address pill, a `signal` header bar and a three-row table of `soft` bars.
  - `movil` (narrow area b): a tall phone outline with notch, three stacked `soft` list cards and one `signal` pill button near the thumb zone. No app-store badge.
  - `gestion` (tall area c): one `signal` rounded frame ("un solo sitio") holding three stacked modules drawn in `soft` stroke: a box (stock), a page with lines (presupuesto), a receipt with a zigzag bottom (factura).
  - `api` (wide area d): two program windows left and right joined by a `soft` dashed line carrying two small `signal` packets (rects) with an arrowhead each way.
  - `reservas` (wide area e): a calendar of 5 x 3 `soft` cells with one `signal` cell holding a check stroke, and a small clock outline beside it.
  - `datos` (full row f): `soft` axes, three `soft` bars and one rising `signal` stroke line with ring dots; no values, ticks or labels.

### 3. Process (`.band` > `SeoLocalProcess`)

- `id="proceso"`, `headingId="proceso-title"`, `keyword=desarrolloSoftware.sectionTitles.process` (unchanged intent signal), `title={ text: "Empezamos por lo que más tiempo te quita", accent: "más tiempo te quita" }`, `portrait` on with the default alt, no `aside`. Assumption: display copy.
- `byline` slot: `Soy Nuria Romero, <a href="/">desarrolladora web en Sevilla</a>, y llevo más de 10 años haciendo software para empresas.` Assumption: carries the published experience that the old NTT DATA benefit held (company name dropped for length); the anchor matches `/diseno-web-sevilla/` and avoids "consultor seo sevilla", owned by `/`.
- Steps (new `desarrolloSoftware.process`, h3 + one sentence, no lead-time figure; Assumption: copy):
  1. "Analizo tu forma de trabajar": "Me cuentas cómo trabajas hoy y vemos juntos dónde se pierde más tiempo."
  2. "Primera fase con precio cerrado": "Te envío por escrito qué incluye, cuánto cuesta y el plazo antes de empezar."
  3. "Entregas que ya puedes usar": "Primero ves las pantallas y después versiones parciales que tu equipo usa desde el principio."
  4. "Ampliamos cuando toca": "Si la primera fase funciona, añadimos la siguiente con su propio precio cerrado."

### 4. Real proof and comparison (`RealProof` + `SeoLocalAgencia`)

- `SectionContainer id="trabajo-real"` > `RealProof headingId="prueba-title"`, `keyword` "Trabajo real para negocios de Sevilla", `title={ text: "Proyectos que puedes visitar", accent: "puedes visitar" }`, `projects=["arkady", "adfsevilla"]`, `reviews=reviewsData`, `note` "Dos webs reales de negocios de Sevilla, hechas por mí. La de Arkady Celebraciones incluye un sistema de reservas programado desde cero." Assumption: copy; says what the projects are (websites; only Arkady's bookings flow is custom) and claims no software client. The title must not say "desde cero" for both (adfsevilla is WordPress).
- `SectionContainer` > `SeoLocalAgencia id="medida-o-estandar" headingId="medida-title"`, `keyword` "¿Software a medida o estándar?", `title={ text: "Cuándo compensa hacerlo a medida", accent: "compensa" }`, `link={ label: "Ver el precio", href: "#precios" }`. Items (`lead` bold, then `text`; Assumption: copy carrying the facts of the removed Excel, SaaS and phases answers):
  1. lead "Si un programa estándar o una hoja de cálculo bien organizada te resuelve el trabajo, úsalo." text "Te lo diré en la primera llamada: te sale más barato y más rápido."
  2. lead "Compensa cuando pierdes horas copiando datos, cuando varias personas tocan la misma información o cuando tu programa te obliga a cambiar tu forma de trabajar." text "Ahí una herramienta hecha para ti te devuelve ese tiempo."
  3. lead "Elijas a quien elijas, empieza por una fase pequeña con precio cerrado y pide que el código sea tuyo." text "Así trabajo yo: por fases, y con el código tuyo desde el primer día."

### 5. Plan (`.band` > `SeoLocalPlans`)

- `id` default `"precios"` (target of "Ver precio" and "Ver el precio"; keeps `scroll-m-20`), `headingId="planes-title"`, `keyword=desarrolloSoftware.sectionTitles.pricing` (unchanged intent signal), `title={ text: "Una primera fase, con precio cerrado", accent: "precio cerrado" }`. Assumption: display copy.
- `tiers={[plan]}` exactly as the design: name "Primera fase", `from`, `includes` and `note` from `desarrolloSoftware.pricing`; no `recommended`, no `ctaLabel` (site default). Assumption: "Primera fase" kept; with the lede it reads as the starting step, not a fixed scope.
- `lede` slot: `Empiezas por una primera fase <strong>desde {desarrolloSoftware.pricing.from}</strong> y amplías por fases cuando lo necesites, cada una con su precio por escrito.` Assumption: copy; "desde" and "por fases" are both visible next to the card. No section `note` prop (the tier carries `pricing.note`, so it is not shown twice).
- Visual: one plan card, not recommended: `--card-surface`, `--hairline` border, sky checks, no badge, no yellow anywhere (the Reserved Yellow Rule: a single option is not a recommendation). Layout from NRD-168's one-plan rule (`.plan-list:has(> .plan:only-child)`): one column, `max-width: 36rem`, left-aligned with the keyword heading, display title and lede above it; never stretched to the full container. The card price stays "999 €" as `SeoLocalPlans` renders `tier.from` (no component change); the lede carries "desde" and "por fases", and the tier note (`pricing.note`) stays. Button at the card bottom.

### 6. FAQ (`SeoLocalFaq`)

- `headingId="faq-title"`, `keyword=desarrolloSoftware.sectionTitles.faq` (unchanged), `title={ text: "Lo que te preguntas antes de empezar", accent: "antes de empezar" }`, `lede` "Si tu duda no está aquí, la vemos en la llamada.", `ctaLabel` not passed. Assumption: display copy.
- Five items in this order (design FAQ list); the component bolds the first sentence, so each first sentence is the direct answer (GEO-1); no `links`. All answers Assumption: copy written from published facts.
- Word trimming if `check-seo-17` reports more than 850 visible words, in this order, stopping as soon as the page fits: (1) the last sentence of FAQ answers, never one of the first two sentences and never the code-ownership sentence of answer 4 ("El código y la documentación son tuyos desde el primer día..."); (2) the `text` of the comparison items (section 4); (3) the RealProof note, keeping its first sentence; (4) the closing `cta.text`, keeping its first sentence. Never remove FAQ items, bento tiles or process steps.
  1. q "¿Qué es un software a medida?" a "Es una aplicación hecha para la forma de trabajar de tu empresa, en lugar de adaptarte tú a un programa genérico. Puede llevar tus pedidos, tus reservas, tus presupuestos o un portal para tus clientes. Solo tiene lo que usas y crece por fases cuando necesitas algo más."
  2. q "¿Cuánto cuesta un software a medida?" a `` `Desde ${SOFTWARE_FROM} para una herramienta interna sencilla. Los proyectos más completos se presupuestan por fases: analizo tu caso y te doy un precio cerrado por escrito para cada fase antes de empezarla. Así empiezas por lo que más tiempo te quita y decides después si amplías.` ``
  3. q "¿Qué se puede desarrollar a medida: aplicación web, app móvil, ERP o API?" a "Una aplicación web que abres en el navegador, una app que tu equipo usa desde el móvil, un ERP para la gestión interna o una API que conecta tus programas. También sistemas de reservas y paneles con tus datos. A menudo es una combinación, y empezamos por la pieza que más falta te hace."
  4. q "¿De quién es el código?" a "Es tuyo. El código y la documentación son tuyos desde el primer día, sin cláusulas que te aten a mí. Si algún día quieres que lo continúe otro profesional, puede hacerlo, porque queda documentado y hecho con tecnologías estándar."
  5. q "¿Qué empresas de desarrollo de software a medida hay en Sevilla?" a "Hay agencias, estudios y profesionales independientes, y conviene comparar más de uno. Al elegir, mira quién va a programar tu herramienta, si te da precio cerrado por fases, si el código será tuyo y si puedes ver proyectos reales. Yo trabajo en Sevilla y hablas directamente conmigo."
- Layout and states: reference (two columns from 1024 px with sticky intro, one column below; all items closed on load; native `details`/`summary`; drawn plus loses its vertical stroke when open).

### 7. Related (`SeoLocalRelated`)

- `links=internalLinksBySource["/desarrollo-software-medida/"]` (4 pills, unchanged), label default. Hover border `--sky-signal`, text `--sky-accent`. Empty list: not rendered (component).

### 8. Closing and NAP (`SeoLocalClosing` + `AppMock` + `SeoLocalNap`)

- `SeoLocalClosing headingId="cierre-title"`, `keyword` "Reserva una llamada sobre tu proyecto", `title={ text: desarrolloSoftware.cta.title, accent: "tu herramienta" }` with new `cta.title` "Empecemos por tu herramienta" and `cta.text` "Cuéntame cómo trabajas hoy y qué te gustaría resolver. Te respondo con una propuesta clara para la primera fase, sin compromiso.", `meta` default, `<AppMock slot="visual" animate={false} />`. Assumption: copy.
- `SectionContainer` > `SeoLocalNap headingId="nap-title"`, `keyword` "Software a medida desde La Rinconada, Sevilla" (design).

### States

- Static page, no async UI. Build-time data only:
  - `reviewsData` null: the ProofStrip shows two cells ("+10 años" and "2 webs en Sevilla"; no empty placeholder) and RealProof shows the note and the two project cards without quote.
  - Reviews present without review text: rating cell shown, quote omitted (component behaviour).
- Loading, empty, error, disabled and form states: n/a (no forms; the booking buttons open the external booking page in a new tab).

### Responsive

- 320-639 px: one column; AppMock scales inside its column (single SVG, the "Pedidos" label must stay at least 11px rendered: size the text at 11 units or more in the 320-wide viewBox); bento tiles stacked a-f; the single plan card full width; FAQ intro above the list.
- 640 px: ProofStrip horizontal.
- 768 px: hero two columns (the H1 still fits, NRD-159); bento two columns with a and f full width, f drawing beside text; plan card follows the one-plan rule.
- 1024 px: bento area map, process portrait column, comparison 0.8/1.2, FAQ two columns with sticky intro.
- No horizontal scroll at any width; long words ("integraciones", plan name) wrap.

### Interactions

- Hover/focus exactly as the components: text links turn `--sky-accent`; links, pills, project cards and FAQ summaries get a 2px `--sky-signal` outline with 2-4px offset on `:focus-visible`; the booking button keeps its own ring. Transitions 0.2s `--ease-out`.
- "Ver precio" and "Ver el precio" jump to `#precios` below the fixed header; no new smooth scroll.
- One authored motion moment: the hero AppMock. No entrance animations elsewhere.
- Destructive actions, validation, optimistic updates: n/a.

### Accessibility hand-off

- One h1 (hero keyword). h2 in order: benefits keyword, process keyword, "Trabajo real para negocios de Sevilla", "¿Software a medida o estándar?", pricing keyword, FAQ keyword, closing keyword, NAP keyword. h3 for tile titles, step titles and the plan name. Display titles are paragraphs.
- Focus order follows visual order: booking button, "Ver precio", byline link, project cards, review link (when present), "Ver el precio", plan button, FAQ summaries, related pills, closing booking button, Maps link.
- AppMock: accessible name on the figure plus the visible caption; SoftwareTileArt and all other SVGs `aria-hidden`; no information lives only in a drawing.
- Reduced motion: AppMock shows its completed state with no movement.
