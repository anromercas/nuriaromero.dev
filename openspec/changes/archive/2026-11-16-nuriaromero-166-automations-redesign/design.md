# Design

## Context

See proposal.md (Why). State on `develop` (86027b0), plus NRD-168's one-plan rule in `SeoLocalPlans` (merged before this story; see Decisions for the fallback):

- `src/pages/automatizaciones.astro` is a one-liner: `<ServiceLayout page={automatizaciones} />` (all legacy defaults).
- `automatizaciones` (`src/data/services.ts` lines 275-379): title "Automatización de procesos en Sevilla para negocios | n8n y Make", description and H1 with "Automatización de procesos en Sevilla" (NRD-123), long subtitle, `sectionTitles` (process "Así es el proceso de automatizar tus tareas repetitivas" and pricing "Cuánto cuesta automatizar un proceso" are the intent row `contentSignals`; benefits "Qué consigue tu negocio automatizando procesos con n8n y Make"; faq "Preguntas frecuentes sobre automatización de procesos"), 4 long benefits (one claims "se amortiza en semanas"), 4 steps, `pricing` `{ from: "149 €", includes: [5], note: "Precio por automatización. Los packs de varias automatizaciones tienen descuento." }`, nine long FAQs, no `cta` (legacy default).
- Guards: `tests/automatizaciones-intent.test.js` (title/H1/description signals; `pricing: { from: "149 €"` as the first key of `pricing` in source; llms line exists; no `keywordOwners` row for the route), `tests/seo-meta-titles.test.js` (title unchanged), `tests/single-price-source.test.js`, `scripts/check-seo-07.mjs` (signals, reciprocal pair with `/inteligencia-artificial/` via the related row anchor "chatbots y soluciones con IA", ownership), `check-seo-16`, `check-seo-17`.
- No automation project exists in `src/components/Projects.astro` (only `arkady` and `adfsevilla`, both websites) and `localTrust.socialProof` is empty.
- Template precedent: `src/pages/diseno-web-sevilla.astro` (NRD-165), ADR 0014.

## Goals / Non-Goals

**Goals:**

- Same intent, about 40% fewer words, in the template world; the NRD-123 placement and intent row intact.
- FAQPage = visible FAQ, one Service Offer = the one visible plan (149).

**Non-Goals:**

- New prices, pack prices or discounts; a `keywordOwners` row; changes to the AI page.

## Decisions

**Approach.** Same data-driven pattern as `/diseno-web-sevilla/`: copy in `automatizaciones` (`src/data/services.ts`), sections from `ServiceLayout variant="template"` slots. The process and pricing `sectionTitles` stay as keyword headings so the intent signals survive. The single published price is shown as one plan built in the page from `automatizaciones.pricing` (name is display copy; price, includes and note come from data), so the Service JSON-LD (one Offer from `pricing.from`) already equals the visible plan and `offersFromTiers` stays off. No real-proof section: there is no published automation project, and websites would not prove automation work (C6). Page illustrations live in `src/components/automatizaciones/`.

Alternatives considered: adding a one-tier `pricing.tiers` to the data (rejected: it duplicates the "149 €" literal next to `pricing.from`, which `automatizaciones-intent` pins as the first key, and adds nothing the page cannot map); `RealProof` with the two websites (rejected: unrelated proof for an automation page); a fifth FAQ about price (rejected: not a sourced question; the plan answers it).

**One-plan layout.** `SeoLocalPlans` lays tiers in two columns from 768 px; NRD-168 adds `.plan-list:has(> .plan:only-child)` (one column, `max-width: 36rem`, left-aligned with the heading and the lede; the same value on 166, 167 and 168). If, after rebasing, that rule is absent (NRD-168 not merged), task 2.1 adds it with the same selector and values as NRD-168's design, CSS only, and checks `/seo-local-sevilla/` and `/diseno-web-sevilla/` plans unchanged.

### Section map (reference order)

| #   | Slot             | Component                                                                                   | Content source                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --- | ---------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `hero`           | `SeoLocalHero` + `ProofStrip`                                                               | `keyword=automatizaciones.hero.h1` (unchanged), `title={ text: hero.title, accent: hero.titleAccent }` (new fields), `subtitle` (new, first two sentences define process automation in business language), `secondaryLink={ label: hero.secondaryCta.label ("Ver precio"), href: "#precios" }` (new `secondaryCta`), `<FlowMock slot="visual" />`; proof items `SITE_PROOF[0]` and the Google rating only when reviews exist (no "webs" figure: not automation proof) |
| 2   | `benefits`       | `SectionContainer id="ejemplos"` > `ReviewBento headingId="ejemplos-title"` + 6 `BentoTile` | `keyword=automatizaciones.sectionTitles.benefits` (new: "Ejemplos de automatización de procesos"); tiles from `automatizaciones.benefits` in order whatsapp, facturas, citas, formularios, avisos, informes; one sentence each; `<AutomationTileArt kind=... />`; areas a-f                                                                                                                                                                                           |
| 3   | `process`        | `.band` > `SeoLocalProcess id="proceso"`                                                    | `keyword=automatizaciones.sectionTitles.process` (unchanged signal); 5 steps from `automatizaciones.process`: mapear la tarea, simplificarla antes de automatizarla, elegir la herramienta (n8n o Make), piloto con casos reales, dejarla funcionando con avisos y documentación; portrait on; no `aside`                                                                                                                                                             |
| 4   | `before-pricing` | `SectionContainer` > `SeoLocalAgencia id="que-automatizar-primero"`                         | keyword "¿Qué conviene automatizar primero y qué no?", three items (lead + text) in the page, like the design-web comparison: start with repetitive, rule-based tasks that cost time every week; leave out what changes every time or needs judgement; automate a process only after simplifying it; link "Ver el precio" to `#precios`                                                                                                                               |
| 5   | `pricing`        | `.band` > `SeoLocalPlans`                                                                   | `keyword=automatizaciones.sectionTitles.pricing` (unchanged signal), `tiers={[plan]}` with `plan = { name: "Por automatización", from: automatizaciones.pricing.from, includes: automatizaciones.pricing.includes ?? [], note: automatizaciones.pricing.note }`, `lede` slot with `<strong>desde {automatizaciones.pricing.from}</strong>`                                                                                                                            |
| 6   | `faq`            | `SeoLocalFaq headingId="faq-title"`                                                         | `keyword=automatizaciones.sectionTitles.faq` (unchanged), `faqs=automatizaciones.faqs` (six sourced items)                                                                                                                                                                                                                                                                                                                                                            |
| 7   | `related`        | `SeoLocalRelated`                                                                           | `internalLinksBySource["/automatizaciones/"]` unchanged (software, IA with the reciprocal anchor, contacto)                                                                                                                                                                                                                                                                                                                                                           |
| 8   | `closing`        | `SeoLocalClosing` + `SeoLocalNap`                                                           | `automatizaciones.cta` (new), `<FlowMock slot="visual" animate={false} />`; closing keyword "Reserva una llamada sobre tus procesos"; NAP keyword "Automatizaciones desde La Rinconada, Sevilla"                                                                                                                                                                                                                                                                      |

Display titles, accents, ledes and tile sentences are fixed by the UI spec (ux-designer, impeccable). Copy constraints for every string: no figure other than the published price (and the tool name "n8n"), no savings/ROI claim, `tú`, tools named with what they do.

### Decisions on the UX open questions (2026-11-16)

1. **Savings guard.** The digit rule (the only digits are "149", ignoring "n8n") applies only to the strings of `automatizaciones` in `src/data/services.ts`. On the built `<main>`, only the claims regex applies: `/ROI|retorno|amortiz|%|\d+\s*(horas|semanas)/i`. Page-wide figures that are published and sourced (ProofStrip "+10 años", the Google rating and its count, the NAP phone and postcode) are not savings claims.
2. **One-plan width.** Fixed in the NRD-168 design: `.plan-list:has(> .plan:only-child) { grid-template-columns: minmax(0, 1fr); max-width: 36rem; margin-inline: 0; }`. The card is left-aligned with the heading and the lede. The task 2.1 fallback uses the same rule.
3. **FAQ answers in the UI spec.** The six answers in the UI spec are binding copy for task 2.2, as on `/diseno-web-sevilla/`. The developer may only (a) trim to fit 700-800 words, starting with the last sentence of an answer and never the first two (GEO-1), and (b) change wording that fails a guard in this design: the digit rule, the claims regex, the AI answer naming n8n or Make, or the examples answer naming the six bento examples. In case of conflict, this design wins and the PR states the change.
4. **ProofStrip with no reviews.** Same rule as NRD-167: the strip shows only published proof that is relevant to the page's service. Here that is `SITE_PROOF[0]` ("+10 años / de experiencia") plus the Google rating when it exists. "2 webs en Sevilla" stays out because websites prove nothing about automation and this page has no RealProof. With no reviews, the strip keeps its one cell: it is the only true proof, and hiding it would leave the hero with none. The UI spec must define the one-cell state: a single cell left-aligned with the subtitle, no empty slots or dividers, and the same type as the reference cells.

### FAQ (GEO block)

Six of the eight sourced questions, answers about 45-60 words, first two sentences answer directly:

1. "¿Qué es la automatización de procesos?" (PAA): a task that follows the same steps every time is done by connected tools instead of by hand; one business example.
2. "¿Cuál es la mejor IA para automatizar procesos?" (PAA; KW-Labs): no single best; the flow is built with n8n or Make, and an AI model is added only for the step that reads, classifies or writes text; `links: [{ label: "Chatbots y soluciones con IA", href: "/inteligencia-artificial/" }]`. Different wording from the AI page's future "¿Cuál es la mejor IA para empresas?" (NRD-169).
3. "¿Qué ejemplos de automatización hay en una empresa?" (PAA "5 ejemplos", natural wording): the six bento examples, one clause each.
4. "¿Cómo se automatizan los mensajes de WhatsApp?" (KW-Labs): confirmations and reminders sent from the official WhatsApp Business channel connected to the agenda or form through n8n or Make; replies that need a person still reach you.
5. "¿Se pueden automatizar las facturas y las tareas administrativas?" (KW-Labs): yes, e.g. an invoice created when an order closes, data passed to the billing program, documents filed; Nuria checks it with real cases first.
6. "¿Cómo empiezo a automatizar los procesos de mi empresa?" (AIO steps): pick one repetitive task, write its steps, simplify, pilot with real cases; matches the process section.

Left out: "¿Cuáles son los 4 tipos de automatización?" (industrial taxonomy, off-intent) and "¿Qué procesos conviene automatizar primero y cuáles no?" (the comparison section answers it). No price FAQ (the plan shows it).

### Files

All in layer `app`.

Create:

- `src/components/automatizaciones/FlowMock.astro`: single-SVG figure of a three-node flow (chat bubble -> sheet/CRM grid -> bell alert) joined by stroked connectors with a `signal` pulse dot; `animate?: boolean` (completed state by default; connector draw-in only under `prefers-reduced-motion: no-preference`; nothing hidden in the initial state, NRD-196 lesson); caption "Ejemplo ilustrativo"; `aria-label` on the figure; SVG `aria-hidden`; no logos or numbers.
- `src/components/automatizaciones/AutomationTileArt.astro`: `{ kind: "whatsapp" | "facturas" | "citas" | "formularios" | "avisos" | "informes" }`, one SVG each (1.5 stroke, `currentColor`, `aria-hidden`, `signal`/`soft`/`label` classes from `BentoTile`), no brand logos (the WhatsApp tile is a generic chat bubble).
- `tests/automatizaciones-template.test.js`.

Modify:

- `src/data/services.ts` (`automatizaciones` only): new `hero.title`, `hero.titleAccent`, `hero.subtitle`, `hero.secondaryCta`; `sectionTitles.benefits`; six `benefits`; five `process` steps; six `faqs`; new `cta`. Unchanged: `slug`, `breadcrumbName`, `seo.*`, `hero.h1`, `sectionTitles.process`, `sectionTitles.pricing`, `sectionTitles.faq`, `pricing` (with `from: "149 €"` first).
- `src/pages/automatizaciones.astro`: template slots per the section map.
- `scripts/lib/template-pages.mjs`: `{ route: "/automatizaciones/", words: [700, 800], service: true }`.
- Fallback only: `src/components/seo-local/SeoLocalPlans.astro` one-plan rule if NRD-168's is missing.

Unchanged and green: `tests/automatizaciones-intent.test.js`, `tests/seo-meta-titles.test.js`, `tests/single-price-source.test.js`, `public/llms.txt` line 13 (no price, still true), `check-seo-07/16`.

### Interfaces

```ts
// src/components/automatizaciones/FlowMock.astro
interface Props {
  animate?: boolean;
}
// src/components/automatizaciones/AutomationTileArt.astro
interface Props {
  kind:
    "whatsapp" | "facturas" | "citas" | "formularios" | "avisos" | "informes";
}
```

No data type change: `secondaryCta`, `title`, `titleAccent` and `cta` already exist on `ServicePageData`.

### Data

No storage or migration, no price change. FAQPage from nine to six questions; Service (one Offer 149) and BreadcrumbList unchanged.

### Test plan (TDD order)

1. Task 1.1, illustration assertions first in `tests/automatizaciones-template.test.js`: SVGs `aria-hidden`, stroke 1.5, no filled shapes, "Ejemplo ilustrativo" on `FlowMock`, reduced-motion guard and no `opacity: 0`/`visibility: hidden` in the default (non-animated) CSS, the six-kind union, no digits in any SVG `<text>`, no brand names in SVG text. Scenario "Illustrations".
2. Task 2.1, structure assertions first: page uses `variant="template"` with `SeoLocalHero`, `FlowMock`, `ProofStrip`, `ReviewBento`, `AutomationTileArt`, `SeoLocalProcess`, `SeoLocalAgencia`, `SeoLocalPlans`, `SeoLocalFaq`, `SeoLocalRelated`, `SeoLocalClosing`, `SeoLocalNap` in this order; no `RealProof`, `TitleSection`, `✓`, `text-gray-`/`bg-gray-`; keyword headings bound to `automatizaciones.sectionTitles.*`; the plan is built from `automatizaciones.pricing` (no "€" literal in the page); six `benefits` whose titles cover WhatsApp, facturas, citas, formularios, avisos, informes; five `process` steps; the subtitle's first two sentences contain "automatiz" and do not start with a tool name; savings guard over every `automatizaciones` string (after removing "n8n"): the only digits are "149", and no `/ROI|retorno|amortiz|%|\d+\s*(horas|semanas)/i`; on the built `<main>` (skip without `dist/`), only the claims regex, not the digit rule (decision 1). Then implement; `automatizaciones-intent`, `check-seo-07` (signals, reciprocal pair, ownership) and `check-seo-02` green. Scenarios "Intent kept", "No term of another owner in headings", "Sections in reference order", "Legacy blocks removed", "Direct answer", "One plan, one offer", "No savings figures", "Reciprocal pair intact".
3. Task 2.2, add the template entry, observe `pnpm build && pnpm check:seo-17:dist` RED (words, FAQ), then FAQ assertions: six items whose normalised questions equal the list above in order; the examples answer names the six bento examples; the AI answer mentions n8n or Make, links `/inteligencia-artificial/` and its question is not "¿Cuál es la mejor IA para empresas?"; no FAQ answer holds a digit outside "n8n". Then write the copy within 700-800 words. Scenarios "Word budget", "FAQ equals FAQPage", "Examples answer matches the bento", "AI question from the automation angle".
4. Every task: `node --test tests/*.test.js`, `pnpm build`, `pnpm check:seo:dist` green.

### Real-browser / e2e checks (QA)

- `/automatizaciones/` at 375, 768, 1024 and 1280 px against the UI spec: no overflow; the single plan is one readable column (not half a grid); bento area map from 1024 px.
- Keyboard: hero CTA, "Ver precio" (lands on `#precios` below the fixed header), comparison link, plan button, FAQ summaries and the IA link, related pills, closing CTA; 2 px sky focus.
- `FlowMock` completed state with reduced motion and first paint before any scroll.
- Rich Results Test: Service with one Offer 149, FAQPage with six questions, BreadcrumbList.

### ADRs relied on

0003, 0004, 0005, 0006, 0008, 0012, 0013, 0014.

## Risks / Trade-offs

- [700-800 words with six FAQs and five steps is tight] -> answers about 50 words, steps one sentence; drop the WhatsApp or invoices answer to one sentence before touching the definition.
- [No real-proof section reads thinner than the reference] -> the UI spec compensates with the comparison and process; C6 forbids unrelated proof.
- [Tool and platform claims] -> only n8n and Make (already published) and "the official WhatsApp Business channel"; no plan prices of third parties.
- [NRD-168 not merged when this starts] -> fallback rule in task 2.1, same selector and values, checked on the other template pages.
- Size: three work units for 5 points; no size concern.

## UI spec

Visual authority: `DESIGN.md` ("The Annotated Storefront") as rendered by `/seo-local-sevilla/` and `/diseno-web-sevilla/` (`src/pages/diseno-web-sevilla.astro` is the structural precedent). Mode: persuade (one primary action: book a call). No new palette, type scale or shared component: every section is an NRD-163 template component in `src/components/seo-local/*` with props, plus the two page illustrations listed in Files. Colours, type and surfaces come only from `src/styles/template.css` (custom properties of the `DESIGN.md` front matter, `.template-ground`, `.band`, `.tpl-kw`, `.tpl-display`, `.tpl-accent`, `--ease-out`). Copy is Spanish, `tú`, plain business language. Figures follow decision 1: in the `automatizaciones` strings the only digits are "149" (ignoring "n8n"), and in page-authored copy the price is always interpolated from `automatizaciones.pricing.from`; the built `<main>` also shows published, sourced figures from shared components (ProofStrip "+10 años", the Google rating and count, the NAP phone and postcode), which are allowed there; on `<main>` only the claims regex `/ROI|retorno|amortiz|%|\d+\s*(horas|semanas)/i` must not match. Every display title has exactly one accent phrase (`accent` is a verbatim substring of `text`). Yellow does not appear on this page except real Google stars (the single plan is not "recommended").

What the redesign fixes: the legacy page is four long benefit cards, a numbered process list, a pricing card and nine long FAQs in the gray/yellow Tailwind world. It becomes the same quiet working document as the reference, with the drawing changed from a Google listing to a small automation flow. With no real-proof section, the comparison and the process carry the trust: they show judgement (what not to automate) and a careful method (pilot with real cases).

### Word budget (700-800 visible words in `<main>`)

Approximate targets per section, from the copy below: breadcrumbs 3; hero 58; proof strip 4-8; bento 105; process 80; comparison 70; plans 75; FAQ 290; related 20; closing 40; NAP 27. Total about 775. Assumption: estimate by hand; `check-seo-17` decides. Over 800, trim in this order: (1) the "como ..." example clause of comparison items 1 and 2; (2) the tail ", con las pruebas, los avisos y la documentación incluidos" of the plan lede (the includes list already says it); (3) only then the last sentence of an FAQ answer that has more than two (decision 3: never the first two sentences, so the six two-sentence answers below stay whole). Never trim the subtitle definition, a tile sentence or a step sentence. Under 700: add the process `byline` given in section 3.

### 1. Hero (`SeoLocalHero` + `FlowMock` + `ProofStrip`)

- Layout: reference hero unchanged: one column under 768 px (copy, then drawing), two columns `1.05fr / 0.95fr` from 768 px, sky halo behind the drawing (clipped by the component).
- Hierarchy: keyword h1 (small, slate) > display title > subtitle > booking button (the only filled control) + "Ver precio" underlined text link > drawing.
- `keyword=automatizaciones.hero.h1` (unchanged: "Automatización de procesos en Sevilla: que tu negocio trabaje solo").
- `title={ text: "Que las tareas repetitivas se hagan solas", accent: "se hagan solas" }` (new `hero.title` / `hero.titleAccent`). Assumption: display copy; echoes the H1 promise without repeating the keyword.
- `subtitle` (new `hero.subtitle`): "Automatizar un proceso es que una tarea que haces siempre igual, como copiar datos o enviar el mismo aviso, la hagan solos tus programas conectados. Tú te quedas con lo que necesita a una persona." Assumption: copy; the two sentences are the GEO-1 definition, contain "Automatizar", name no tool (tools are explained in the process and FAQ 2) and hold no digit.
- `primaryCtaLabel`: not passed (site default). `secondaryLink={ label: "Ver precio", href: "#precios" }` from new `hero.secondaryCta.label` "Ver precio" (singular: one plan).
- `ProofStrip` (`src/components/seo-local/ProofStrip.astro`): `items` = `SITE_PROOF[0]` ("+10 años / de experiencia"), then the Google cell only when `reviewsData` is not null (built exactly as in `diseno-web-sevilla.astro`). No `SITE_PROOF[1]` (websites are not automation proof). The strip is one or two cells; the component's `grid-auto-columns: 1fr` lays them out, no change to `ProofStrip`.
  - One-cell state (no reviews, decision 4): the strip renders one `li` with "+10 años" (stat, `text-strong` 1.375rem/650) over "de experiencia" (label, `text-secondary` 0.9rem), the same type as the reference cells. The cell starts at the subtitle's left edge at every width (under 640 px the cell has no side padding; from 640 px the component's `li:first-child { padding-left: 0 }` keeps it flush). No empty slots, no placeholder cell and no vertical or horizontal divider inside the strip: only the strip's own top and bottom `hairline` rules, as in the reference. The text stays left-aligned and is not centred or stretched; the strip keeps the full content width so its rules line up with the two-cell state.

#### `FlowMock` (`src/components/automatizaciones/FlowMock.astro`)

- Container: one `<figure>` styled like `WebMock` (`src/components/diseno-web/WebMock.astro`): 1px `hairline` border, 1.25rem radius, `card-surface`, `overflow: hidden`; drawing area on `drawing-surface` with 1.25rem padding and a `hairline-quiet` bottom rule; `<figcaption>Ejemplo ilustrativo</figcaption>` in `text-muted` 0.8rem.
- Drawing: one SVG, one `viewBox` about 300 x 190 (scales with its column, cannot overflow at 320 px), `width: 100%`, `max-width: 26rem`, centred in the drawing area so labels never exceed about 16px on wide screens. Three nodes left to right on one baseline, joined by two connectors:
  1. a chat bubble (rounded rect with a tail, two `soft` text bars), SVG label "Mensaje nuevo";
  2. a sheet grid (rounded rect, 3 x 3 `soft` cells) whose last row is redrawn in `signal` (the new entry), SVG label "Tu hoja o CRM";
  3. a bell in `signal` with two short `signal` ring strokes, SVG label "Aviso para ti".
  - Connectors: a gentle curve between nodes with a small open arrowhead. Each connector is two paths on top of each other: a `soft` base path (always visible) and a `signal` overlay (the animated one). A small stroked ring (r about 3, no fill) sits on the first connector as the "pulse".
  - Labels: class `label` (`text-secondary`, `font-family: inherit`), sized so they render at least 11px at a 320 px viewport (about 13.5 units in a 300-wide viewBox); no digits, no brand names, never animated. Assumption: label wording and size.
  - Strokes 1.5, round caps/joins, `currentColor` base `text-muted`; `signal` = `--sky-signal`, `soft` = `--drawing-soft`. No fills (no filled shapes at all, including the pulse ring); no logos, numbers or metrics.
- Accessible name: `aria-label="Ejemplo de automatización: un mensaje nuevo se apunta en tu hoja o CRM y te llega un aviso"` on the figure; the SVG is `aria-hidden="true" focusable="false"`. Assumption: wording.
- Motion (`animate` default `true`): the completed state is the default CSS (all paths drawn, overlays visible). Only inside `@media (prefers-reduced-motion: no-preference)`:
  - with `@supports (animation-timeline: scroll())`: the two `signal` connector overlays draw in (`stroke-dashoffset`, `pathLength="1"`) on `scroll(root block)` range 0-140px, then the new sheet row and the bell strokes draw in over 100-220px. The `soft` base paths, nodes and labels stay fully visible at first paint, so the flow reads complete before any scroll (NRD-196 lesson: nothing that carries meaning is hidden or faded in the initial state).
  - without scroll timelines: the same overlays draw once on load, 0.9s `--ease-out`, 0.2s delay.
  - No `opacity` or `visibility` animation on anything.
- `animate={false}`: completed state, no animation (used in the closing band).

### 2. Bento of examples (`ReviewBento` + 6 `BentoTile` + `AutomationTileArt`)

- Wrapper: `SectionContainer id="ejemplos"` > `ReviewBento headingId="ejemplos-title"`, `keyword=automatizaciones.sectionTitles.benefits` ("Ejemplos de automatización de procesos", new), `title={ text: "Lo que puede hacerse solo en tu negocio", accent: "hacerse solo" }`, caption default "Ejemplo ilustrativo". Assumption: display copy.
- Area map unchanged (reference `a a a a b b / c c d d d d / c c e e e e / f f f f f f` from 1024 px). Tiles in source order a-f; `automatizaciones.benefits` holds them in this order. No `link` on any tile. All titles and sentences Assumption: copy written from the story's example list and the published includes; one sentence each, no digits.

| Area | `kind`        | Title                         | Sentence                                                                                         | Layout                                  |
| ---- | ------------- | ----------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------- |
| a    | `whatsapp`    | "Mensajes de WhatsApp"        | "Las confirmaciones y los recordatorios salen solos, y lo que necesita respuesta te llega a ti." | stack                                   |
| b    | `facturas`    | "Facturas"                    | "Al cerrar un pedido, la factura se crea y se guarda en su carpeta."                             | stack                                   |
| c    | `citas`       | "Citas y recordatorios"       | "Cada reserva entra en tu agenda y el cliente recibe su aviso el día antes."                     | stack (tall tile)                       |
| d    | `formularios` | "Formularios a tu hoja o CRM" | "Lo que te escriben desde la web llega ordenado a tu hoja de cálculo o a tu lista de clientes."  | stack                                   |
| e    | `avisos`      | "Avisos internos"             | "Te enteras al momento de un pedido nuevo, una reseña o un pago pendiente."                      | stack                                   |
| f    | `informes`    | "Informes"                    | "Cada lunes recibes en tu correo un resumen de ventas o gastos, sin montarlo a mano."            | `row` (drawing beside text from 768 px) |

- Tile d explains "CRM" in its sentence ("lista de clientes"), so the title can keep the searched term. These six titles are the wording FAQ 3 repeats.
- `AutomationTileArt` drawings (`aria-hidden="true" focusable="false"`, 1.5 stroke, round caps/joins, `currentColor`, no fills, no SVG text, no digits, no logos; use the `BentoTile` `:global(.signal|.soft)` classes, do not restyle). Each `kind` has its own `viewBox` shaped for its area. Assumption: compositions.
  - `whatsapp` (wide): an incoming bubble with `soft` bars on the left, an outgoing bubble in `signal` on the right with a drawn double check, and a small clock outline between them (sent on its own). Generic bubbles: no WhatsApp glyph, no green.
  - `facturas` (narrow): a document outline with a zigzag bottom edge and `soft` lines, an arrow in `signal` into a folder outline. No currency sign or amounts.
  - `citas` (tall): a calendar outline at the top (`soft` cell grid, one cell ringed in `signal`), a `signal` line down to a message bubble with a small bell.
  - `formularios` (wide): a form outline (three `soft` field bars, a send pill in `signal`), an arrow, then a sheet grid whose newest row is `signal`.
  - `avisos` (wide): three small outlines (a shopping bag, a speech bubble, a card) joined by `soft` lines into one bell in `signal`. No star (stars are reserved for real ratings).
  - `informes` (row): a sheet grid, an arrow, a one-page summary document with `soft` bars, and an envelope outline in `signal`. No chart bars or axes (they read as data).

### 3. Process (`.band` > `SeoLocalProcess`)

- `id="proceso"`, `headingId="proceso-title"`, `keyword=automatizaciones.sectionTitles.process` (unchanged signal), `title={ text: "Primero se simplifica, luego se automatiza", accent: "luego se automatiza" }`, `portrait` on with the component default alt, no `aside`, no `byline` (word budget). Assumption: display copy. Fallback byline only if the page measures under 700 words: `Soy Nuria Romero, <a href="/">desarrolladora web en Sevilla</a>, y monto y pruebo cada automatización yo misma.`
- Steps (the five new `automatizaciones.process` entries, h3 + one sentence; Assumption: copy following the design's step list):
  1. "Mapear la tarea": "Me cuentas cómo la haces hoy y apuntamos cada paso."
  2. "Simplificarla antes de automatizarla": "Quitamos los pasos que sobran, para no automatizar un desorden."
  3. "Elegir la herramienta": "Uso n8n o Make, que conectan tus programas, según lo que haya que unir."
  4. "Piloto con casos reales": "La pruebo con pedidos, citas o mensajes de verdad antes de dejarla sola."
  5. "Dejarla funcionando": "Queda activa, con avisos si algo falla y documentada para que sepas qué hace."

### 4. Comparison (`SectionContainer` > `SeoLocalAgencia`)

- `id="que-automatizar-primero"`, `headingId="que-automatizar-primero-title"`, `keyword` "¿Qué conviene automatizar primero y qué no?" (design), `title={ text: "Por dónde empezar a automatizar", accent: "empezar" }`, `link={ label: "Ver el precio", href: "#precios" }`. Items (the component renders `lead` bold, a space, then `text`; Assumption: copy following the design's three points):
  1. lead "Empieza por lo repetitivo." text "Una tarea que sigue siempre los mismos pasos y te quita tiempo cada semana, como confirmar citas o pasar datos de un programa a otro."
  2. lead "Deja fuera lo que cambia cada vez." text "Si una tarea necesita tu criterio, como responder una queja o cerrar un presupuesto, es mejor que la siga haciendo una persona."
  3. lead "Simplifica antes de automatizar." text "Un proceso con pasos de más sigue siendo lento aunque lo haga una máquina: primero lo ordenamos y luego lo automatizamos."

### 5. Plan (`.band` > `SeoLocalPlans`)

- `id` default `"precios"` (target of "Ver precio" and "Ver el precio"; `scroll-m-20` keeps the keyword heading clear of the fixed header), `headingId="planes-title"`, `keyword=automatizaciones.sectionTitles.pricing` (unchanged signal), `title={ text: "Sabes lo que cuesta antes de empezar", accent: "antes de empezar" }`, `tiers={[plan]}` exactly as the design builds it (`name: "Por automatización"`, `from`, `includes`, `note` from `automatizaciones.pricing`), no section `note` prop. Assumption: display copy.
- `lede` slot: `Cada automatización cuesta <strong>desde {automatizaciones.pricing.from}</strong>, con las pruebas, los avisos y la documentación incluidos.` Assumption: copy; every word matches a published include.
- Card: the standard (non-recommended) card: `card-surface`, `hairline` border, name, price "149 €" at 1.75rem, hairline, the five `includes` with sky drawn checks, the tier note (`pricing.note`, unchanged) in `text-muted` 0.875rem, booking button (default label) at the bottom. No badge, no yellow, no lift.
- One-plan layout (decision 2): `.plan-list:has(> .plan:only-child) { grid-template-columns: minmax(0, 1fr); max-width: 36rem; margin-inline: 0; }`, the same rule from NRD-168 or the task 2.1 fallback. One column at every width, `max-width: 36rem`, left-aligned with the keyword heading, the display title and the lede (same left edge). Under 36rem of available width the card takes the full content column. The card never stretches to the full container and never sits in half of a two-column grid with an empty cell beside it.

### 6. FAQ (`SeoLocalFaq`)

- `headingId="faq-title"`, `keyword=automatizaciones.sectionTitles.faq` (unchanged), `title={ text: "Lo que preguntan antes de automatizar", accent: "antes de automatizar" }`, `lede` "Si tu duda no está aquí, la vemos en la llamada.", `ctaLabel` not passed. Assumption: display copy.
- Six items in the design's order. The component bolds the first sentence (`splitAnswer`), so each first sentence is the direct answer. No digit in any answer (only "n8n"). Exact strings, binding copy for task 2.2 (decision 3: the developer may only trim a last sentence beyond the first two, or change wording that fails a guard of this design, and states it in the PR); Assumption: copy written from the design's answer outlines and published facts:
  1. q "¿Qué es la automatización de procesos?" a "Es conseguir que una tarea que sigue siempre los mismos pasos la hagan tus programas conectados, en lugar de hacerla tú a mano. Por ejemplo, cuando alguien rellena el formulario de tu web, sus datos pasan solos a tu hoja de clientes y te llega un aviso."
  2. q "¿Cuál es la mejor IA para automatizar procesos?" a "No hay una sola mejor, y muchas automatizaciones no necesitan inteligencia artificial. Monto el flujo con n8n o Make, que conectan tus aplicaciones, y añado un modelo de IA solo en el paso que lee, clasifica o redacta texto, como ordenar los correos que llegan." links `[{ label: "Chatbots y soluciones con IA", href: "/inteligencia-artificial/" }]`
  3. q "¿Qué ejemplos de automatización hay en una empresa?" a "En un negocio pequeño, los más útiles son mensajes de WhatsApp, facturas, citas y recordatorios, formularios que llegan a tu hoja o CRM, avisos internos e informes. Todos tienen algo en común: pasos que se repiten igual cada vez."
  4. q "¿Cómo se automatizan los mensajes de WhatsApp?" a "Se conecta el canal oficial de WhatsApp Business con tu agenda o tu formulario mediante n8n o Make, y las confirmaciones y los recordatorios salen solos. Los mensajes que necesitan a una persona te siguen llegando a ti."
  5. q "¿Se pueden automatizar las facturas y las tareas administrativas?" a "Sí: la factura puede crearse al cerrar un pedido, los datos pasar a tu programa de facturación y los documentos guardarse en su carpeta. Antes de dejarlo funcionando, lo pruebo contigo con casos reales de tu negocio."
  6. q "¿Cómo empiezo a automatizar los procesos de mi empresa?" a "Elige una sola tarea repetitiva y apunta sus pasos tal como los haces hoy. Después se simplifica, se elige la herramienta y se prueba con casos reales antes de dejarla sola, como en el proceso de esta página."
- Layout and states: reference two columns from 1024 px (sticky intro left, ruled `details` list right), one column below; all items closed on load; native `details`/`summary`; the drawn plus loses its vertical stroke when open; the FAQ 2 link renders after the answer as an underlined `sky-accent` text link.

### 7. Related (`SeoLocalRelated`)

- `links=internalLinksBySource["/automatizaciones/"]` (three pills, unchanged: software, IA with "chatbots y soluciones con IA", contacto), label default "Sigue leyendo". Pills wrap; hover border `sky-signal`, text `sky-accent`.

### 8. Closing and NAP (`SeoLocalClosing` + `FlowMock` + `SeoLocalNap`)

- `SeoLocalClosing headingId="cierre-title"`, `keyword` "Reserva una llamada sobre tus procesos" (design), `title={ text: automatizaciones.cta.title, accent: "una tarea" }` with new `cta.title` "Empecemos por una tarea", `text` = new `cta.text` "Cuéntame qué tarea repites cada semana y te digo si compensa automatizarla y cuánto costaría, sin compromiso.", `meta` default, `<FlowMock slot="visual" animate={false} />`. Assumption: copy.
- `SectionContainer` > `SeoLocalNap headingId="nap-title"`, `keyword` "Automatizaciones desde La Rinconada, Sevilla" (design).

### States

- Static page, no loading or async UI. Build-time data only:
  - Google reviews unavailable (`reviewsData` null): the ProofStrip shows only "+10 años / de experiencia" (the one-cell state defined in section 1). Nothing else depends on reviews (no RealProof on this page).
  - `pricing.includes` empty: the card shows name, price, note and button (component behaviour); not expected.
- Empty, error, disabled, form and success states: n/a (no forms; the booking button opens the external booking page in a new tab, as everywhere).

### Responsive

- 320-639 px: one column; hero copy then FlowMock (labels at least 11px); ProofStrip cells stacked with top rules; bento tiles stacked a-f; the plan card full width of the content column; FAQ intro above the list.
- 640 px: ProofStrip horizontal.
- 768 px: hero two columns; bento two columns with tiles a and f full width, f drawing beside its text; the plan stays one column, `max-width: 36rem`, left-aligned with heading and lede.
- 1024 px: bento area map; process portrait column beside the timeline; comparison intro/list columns of the component; FAQ two columns with sticky intro.
- No horizontal scroll at any width; long words ("Simplificarla antes de automatizarla", "automatizaciones") wrap inside their h3 or pill.

### Interactions

- Hover and focus as the components: text links turn `sky-accent`; links, pills and FAQ summaries show a 2px `sky-signal` outline with 2-4px offset on `:focus-visible`; the booking button keeps its ring. Transitions 0.2s `--ease-out`.
- "Ver precio" and "Ver el precio" jump to `#precios`; scrolling follows the site setting (no new smooth scroll).
- One authored motion moment: the hero FlowMock. No entrance animation on sections, tiles, steps or the card.
- Validation, optimistic updates, destructive confirmations: n/a.

### Accessibility hand-off

- One h1 (hero keyword). h2 per section in order: benefits keyword, process keyword, "¿Qué conviene automatizar primero y qué no?", pricing keyword, FAQ keyword, closing keyword, NAP keyword. h3 for tile titles, step titles and the plan name. Display titles are paragraphs.
- Focus order follows the visual order: booking button, "Ver precio", "Ver el precio", plan booking button, FAQ summaries and the IA link, FAQ booking button, related pills, closing booking button, phone link, "Ver en Google Maps".
- FlowMock: accessible name on the figure plus the visible caption; the SVG and every `AutomationTileArt` are `aria-hidden`; the meaning of each drawing is in the figure name or the tile title and sentence.
- Reduced motion: FlowMock shows its completed state with no movement.
