# Design

## Context

See proposal.md (Why). Current state on `develop` (d2ea153):

- `src/pages/diseno-web-sevilla.astro` renders `ServiceLayout page={disenoWeb}` with legacy defaults for hero, benefits, process, pricing, FAQ, related and closing, plus three page blocks: the "before-benefits" intro with niche pills, "Webs reales de negocios de Sevilla" (`Projects only={["arkady","adfsevilla"]}`) and "Por qué elegir a alguien de Sevilla".
- `disenoWeb` (`src/data/services.ts` lines 14-143): title "Diseño web Sevilla | Diseñadora web, precio cerrado desde 149 €", H1 "Diseño web Sevilla para negocios que quieren clientes, no solo una web bonita", `secondaryCta` "Ver precios" `#precios`, four `sectionTitles` (benefits carries "Diseñadora web en Sevilla", the only variant), 3 benefits, 4 process steps, tiers "Landing de una página" (149 €) and "Web completa (hasta 5 páginas)" (399 €, recommended), 10 long FAQs (one cites a market range "entre 500 y 3.000 €"), `cta`. No `offersFromTiers`, so the Service JSON-LD has one Offer of 149.
- `serviceSchema` (`src/lib/schema.ts`) builds per-tier offers only as monthly `UnitPriceSpecification` (`unitText: "MON"`), guarded for `/seo-local-sevilla/` by `scripts/check-seo-15.mjs` and `tests/seo-local-ficha-redesign.test.js` (lines 389-397).
- Guards on this page: `tests/diseno-web-sevilla-intent.test.js` (title, H1, exactly one section title with the "diseñador/a web" variant = benefits, `seo-intents` row signals, internal-links rows for software and portfolio), `scripts/check-seo-07.mjs` (intent `contentSignals` of the row must appear in the built page: "Diseñadora web en Sevilla que programa tu página, sin plantillas", "Así es el proceso de crear tu página web", "Preguntas frecuentes sobre diseño web en Sevilla"; keyword ownership), `scripts/check-seo-02.mjs` (breadcrumb "Diseño web en Sevilla", one H1), `reciprocalLinks` in `src/data/seo-intents.ts` (pair with the price guide).
- From NRD-163 (must be merged first): template components with props, `ServiceLayout variant="template"`, `BentoTile`, `FaqItem.links`, `template-pages.mjs`, `check-seo-16/17`. Interfaces per `openspec/changes/nuriaromero-163-reusable-local-components/design.md`; if the merged API differs, the merged API wins and the developer notes it in the PR.

## Goals / Non-Goals

**Goals:**

- Same page, half the words, in the template world, with NRD-121's keyword work and the intent row intact.
- Structured data that equals the visible content: FAQPage = FAQ, Service offers = plans, BreadcrumbList unchanged.

**Non-Goals:**

- New prices or ranges (S-2026-11-13-1), shared component changes, niche page changes, changes to the price guide.

## Decisions

**Approach.** Keep the data-driven pattern: copy stays in `disenoWeb` (`src/data/services.ts`) and the page maps it onto the template sections through `ServiceLayout variant="template"` slots, exactly like `/seo-local-sevilla/`. The four existing `sectionTitles` become the keyword headings (the real `h2`) of bento, process, plans and FAQ, so the intent row signals, the single "diseñadora web" variant and NRD-121's headings survive without touching `seo-intents.ts`; new display titles carry the serif accent. Six bento items replace the three `benefits` (the field is only rendered by the legacy grid). Service offers follow the plans through a new opt-in `tierBilling: "one-time"`, implemented in `serviceSchema` as plain Offers, so the monthly branch used by `/seo-local-sevilla/` is untouched. Page illustrations live in `src/components/diseno-web/`. The UI spec written by the ux-designer (impeccable) fixes visuals; this design fixes structure, data and guarantees.

Alternatives considered: copy in the page frontmatter (rejected: `disenoWeb` already holds it, the intent tests read `services.ts`, and the invariant keeps site facts in `src/data`); a new `ServicePageData` field for bento tiles (rejected: `benefits` already models title plus text and has no other consumer); keeping a single Offer (rejected: GEO-4 asks offers to equal the visible plans).

### Section map (reference order)

| #   | Slot             | Component                                                        | Content source                                                                                                                                                                                                                                                                                                                                                                              |
| --- | ---------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `hero`           | `SeoLocalHero` + `ProofStrip`                                    | `keyword=disenoWeb.hero.h1` (unchanged H1), `title={ text: disenoWeb.hero.title, accent: disenoWeb.hero.titleAccent }` (new fields), `subtitle` (shortened, keeps "diseño web" wording natural), `secondaryLink={ label: "Ver precios", href: "#precios" }` from `secondaryCta`, `<WebMock slot="visual" />`; proof items from `SITE_PROOF` plus live Google rating only when reviews exist |
| 2   | `benefits`       | `SectionContainer id="que-incluye"` > `ReviewBento headingId="que-incluye-title"` + 6 `BentoTile`                   | `keyword=disenoWeb.sectionTitles.benefits`; tiles from `disenoWeb.benefits` (móvil, SEO local básico, WhatsApp/formulario, alta en Google, panel para editar, soporte), one sentence each, `<WebTileArt kind=... />` per tile, areas `a`-`f`                                                                                                                                                |
| 3   | `process`        | `.band` > `SeoLocalProcess`                                      | `keyword=disenoWeb.sectionTitles.process`; 4 steps from `disenoWeb.process` (propuesta, diseño, contenidos, publicación); only the published lead time ("2 a 4 semanas desde que tengo los contenidos") may appear; portrait on; no cycle `aside` (one-off project, not monthly)                                                                                                            |
| 4   | `before-pricing` | `RealProof` + `SeoLocalAgencia id="freelance-estudio-o-agencia"` | real sites `["arkady", "adfsevilla"]`, real review when available; comparison keyword heading "¿Freelance, estudio o agencia?" (no owned term), 3 `ComparisonItem`s, link to `#precios`                                                                                                                                                                                                     |
| 5   | `pricing`        | `.band` > `SeoLocalPlans`                                        | `keyword=disenoWeb.sectionTitles.pricing` (unchanged), `tiers=disenoWeb.pricing.tiers`, `note=disenoWeb.pricing.note` (shortened), `lede` slot built with `tierFrom(disenoWeb, "Landing de una página")` and `tierFrom(disenoWeb, "Web completa (hasta 5 páginas)")`                                                                                                                        |
| 6   | `faq`            | `SeoLocalFaq`                                                    | `keyword=disenoWeb.sectionTitles.faq`, `faqs=disenoWeb.faqs` (6-7 sourced items, `links` where needed)                                                                                                                                                                                                                                                                                      |
| 7   | `related`        | `SeoLocalRelated`                                                | `internalLinksBySource["/diseno-web-sevilla/"]` unchanged (guide, tienda online, niche pages, SEO local, software, portfolio rows)                                                                                                                                                                                                                                                          |
| 8   | `closing`        | `SeoLocalClosing` + `SeoLocalNap`                                | `disenoWeb.cta` (shortened), `<WebMock slot="visual" animate={false} />`; NAP keyword heading without owned terms of other pages                                                                                                                                                                                                                                                            |

### FAQ (GEO block)

Use 6-7 of the 7 sourced questions in NRD-165 ("Investigación"); natural wording; first two sentences answer directly; about 50-70 words each; `tú`.

1. "¿Cuánto cuesta hacer una página web?": published prices only ("desde 149 €" landing, "desde 399 €" web completa, precio cerrado por escrito), `links: [{ label: "Guía para entender el precio de una web", href: "/blog/cuanto-cuesta-una-pagina-web-en-sevilla/" }]`. No market range, no competitor price (the old "entre 500 y 3.000 €" sentence goes).
2. "¿Cuánto se tarda en hacer una web?": the already-published "2 a 4 semanas desde que tengo los contenidos"; no competitor lead times.
3. "¿Freelance, estudio o agencia para mi web?": short, may point to the comparison section (`#freelance-estudio-o-agencia`); can be dropped if the comparison covers it and the word budget is tight.
4. "¿Puedo hacer yo mismo la web gratis?": honest objection (when a builder is enough, when it falls short), no DIY keyword in any heading.
5. "¿WordPress o web a medida?": plain comparison, no tech jargon unexplained.
6. "¿La web incluye SEO?": what basic local SEO the build includes (from the tier `includes`), and that ongoing SEO is a separate monthly service: `links: [{ label: "SEO local y GEO para tu negocio", href: "/seo-local-sevilla/" }]`.
7. "¿Qué presupuesto necesito?": same published prices, how to choose landing vs full website, `links` to the price guide.

Prices in answers: declare `const LANDING_FROM = "149 €"` and `const WEB_FROM = "399 €"` at the top of `src/data/services.ts`, use them in both tiers and in the FAQ template strings (one literal per price in the file). The same `disenoWeb.faqs` feeds `faqSchema` (via `ServiceLayout`) and `SeoLocalFaq`.

### Files

All in layer `app`.

Create:

- `src/components/diseno-web/WebMock.astro` (app): phone plus desktop single-stroke drawing of a local business website, `animate?: boolean` (completed state default, motion only under `prefers-reduced-motion: no-preference` and `@supports`), caption "Ejemplo ilustrativo".
- `src/components/diseno-web/WebTileArt.astro` (app): `{ kind: "movil" | "seo-local" | "contacto" | "google" | "panel" | "soporte" }`, one SVG each (1.5 stroke, `currentColor`, `aria-hidden`, `signal`/`soft`/`label` classes).
- `tests/diseno-web-template.test.js` (app).

Modify:

- `src/data/types.ts` (app): `tierBilling?: "monthly" | "one-time"` on `ServicePageData` (comment: default monthly, only read with `offersFromTiers`); `faqs: { q: string; a: string; links?: { label: string; href: string }[] }[]`.
- `src/lib/schema.ts` (app): `serviceSchema` accepts `billing?: "monthly" | "one-time"` (default `"monthly"`); with `"one-time"` each tier Offer is `{ "@type": "Offer", name, url, price, priceCurrency: "EUR" }` with no `priceSpecification`. Monthly output stays byte-identical.
- `src/layouts/ServiceLayout.astro` (app): passes `billing: page.tierBilling` together with `tiers` (both variants).
- `src/data/services.ts` (app, `disenoWeb` and the two price constants only): `offersFromTiers: true`, `tierBilling: "one-time"`, `hero.title`/`hero.titleAccent`, shorter `subtitle`, six `benefits`, four short `process` steps, shorter `pricing.note`, new `faqs`, shorter `cta`. Unchanged: `slug`, `breadcrumbName`, `seo.title`, `seo.description`, `hero.h1`, `hero.secondaryCta`, all four `sectionTitles`, tier names, prices, `includes`, `recommended`.
- `src/pages/diseno-web-sevilla.astro` (app): template slots per the section map; drops `TitleSection`, `Projects` (now through `RealProof`), `niches` import and the three page blocks.
- `scripts/check-seo-02.mjs` (app): dist assertion for the two one-time Offers of `/diseno-web-sevilla/` (task 1.1).
- `scripts/lib/template-pages.mjs` (app): `{ route: "/diseno-web-sevilla/", words: [1000, 1200], service: true }`.
- `src/data/seo-intents.ts` (app): only if a signal heading changes (it should not: the three `contentSignals` stay as keyword headings); then update the row and `tests/diseno-web-sevilla-intent.test.js` in the same task.

Unchanged and must stay green: `tests/diseno-web-sevilla-intent.test.js`, `scripts/check-seo-07.mjs`, `scripts/check-seo-15.mjs`, `scripts/check-seo-16.mjs`, `tests/seo-local-ficha-redesign.test.js` (monthly offers), `public/llms.txt` line 10 (already "Desde 149 € (landing) o 399 €").

### Interfaces

```ts
// src/data/types.ts (additions)
tierBilling?: "monthly" | "one-time"
faqs: { q: string; a: string; links?: { label: string; href: string }[] }[]

// src/lib/schema.ts
export function serviceSchema(service: {
  name: string; description: string; url: string; serviceType: string; price: string
  tiers?: { name: string; from: string }[]
  billing?: "monthly" | "one-time" // new, default "monthly"
  id?: string
})
```

`WebTileArt`: `{ kind: "movil" | "seo-local" | "contacto" | "google" | "panel" | "soporte" }`; `WebMock`: `{ animate?: boolean }`.

### Data

No storage or migration. Data change limited to `disenoWeb` copy and two price constants with the same values; the JSON-LD Service of this page changes from one Offer to two one-time Offers (149, 399); FAQPage follows the new FAQ. No price change.

### Test plan (TDD order)

1. Task 1.1: `tests/diseno-web-template.test.js` first: `types.ts` declares `tierBilling` and the FAQ `links`; `schema.ts` has a one-time branch without `UnitPriceSpecification`; `ServiceLayout` passes `billing`; `disenoWeb` has `offersFromTiers: true` and `tierBilling: "one-time"`. Add `scripts/check-seo-02.mjs` assertions for `/diseno-web-sevilla/` on dist: the Service has exactly two Offers named as the tiers with prices "149" and "399" and no `priceSpecification` (check-seo-02 already owns the service-page JSON-LD checks; `check-seo-17` stays generic). Then implement; `check-seo-15` and `check-seo-16` stay green. Scenarios: "One-time offers", "Reference page untouched".
2. Task 1.2: illustration assertions first (aria-hidden, 1.5 stroke, no filled icons, "Ejemplo ilustrativo", reduced-motion guard). Scenario: "Illustrations" part of "Proof and illustrations are honest".
3. Task 1.3: structure assertions first: page uses `variant="template"`, imports the template components in reference slot order, no `TitleSection`/`niches`/legacy blocks, keyword headings bound to `disenoWeb.sectionTitles.*`, `secondaryLink` to `#precios`, six `benefits`, four `process` steps. Scenarios: "Sections in reference order", "Legacy blocks removed", "Plan prices from data", "Owned term kept".
4. Task 1.4: add the template entry, `pnpm build && pnpm check:seo-17:dist` RED (words, FAQ), then FAQ assertions: 6-7 items, every item's `q` matches one of the seven sourced questions (normalised), price answers interpolate `LANDING_FROM`/`WEB_FROM` and link to the guide, no "500 y 3.000" or other "€" literal outside the constants, no heading with "gratis"/"hacer una página web". Then write the copy. Scenarios: "Word budget", "FAQ equals FAQPage", "Price questions answered with published prices", "Honest DIY objection", "No market or competitor figures", "Price-guide term stays out of headings" (check-seo-07), "Reciprocal pair intact".
5. Every task: `node --test tests/*.test.js`, `pnpm build`, `pnpm check:seo:dist` green.

### Real-browser / e2e checks (QA)

- `/diseno-web-sevilla/` at 375, 768, 1280 px against the UI spec: no overflow, hero two columns from 768, bento area map from 1024, recommended plan lift on desktop with aligned buttons.
- Keyboard through hero CTA and "Ver precios" (scrolls to `#precios` below the fixed header), tile content, plan buttons, FAQ summaries, related pills, closing CTA; 2 px sky focus.
- WebMock completed state with reduced motion; animation otherwise.
- Rich Results Test (or schema validator) on the built page: Service with two Offers, FAQPage, BreadcrumbList valid.
- `/seo-local-sevilla/` unchanged (spot screenshot, `check-seo-16`).

### ADRs relied on

0003, 0004, 0005, 0006, 0008, 0012, 0013, 0014.

### Answers to the UI spec open questions

- **Support tile (f):** the plan data is the authority, because it is what the visitor buys: only "Web completa (hasta 5 páginas)" lists "Un mes de soporte tras el lanzamiento" (`src/data/services.ts`). The tile text now says "Con la web completa, ..." (like tile a), and the new process step 4 already avoids promising support for every plan. The older copy that implies the support month for every web (process step "Lanzamiento y primer mes de soporte", FAQ "¿Necesito saber de tecnología...?") is replaced by this story. **For the owner (non-blocking):** whether the landing also includes the support month is a product decision; until it is made, copy follows the tier `includes`.
- **Edit panel and WordPress answer:** repo evidence supports the capability, not a specific technology. Published copy says every web is handed over with training to change "un texto, una foto o un precio" yourself (`disenoWeb.process[3]`) "usando el panel" (`disenoWeb.faqs`, "¿Necesito saber de tecnología...?"); the home and `Projects` (`WORDPRESS` tag) show the owner also builds on WordPress ("trabajo con WordPress, Astro, React, Next.js..."). The tile "Un panel para editarla tú" stays (already published claim). The WordPress answer is rewritten so it does not contradict it: the owner works with both, both allow basic edits, and the choice depends on how much content the client publishes. **For the owner (non-blocking):** confirm that every custom (non-WordPress) web ships an editing panel; the claim is already live on the page today, so this story does not make it worse.
- **`ReviewBento` id:** NRD-163 id rule: `headingId="que-incluye-title"` for `aria-labelledby`, section anchor `que-incluye` on the wrapping `SectionContainer` (it carries `scroll-m-20`).
- **FAQ of 6 (question 3 dropped): accepted.** The design allowed dropping question 3 when the comparison section ("¿Freelance, estudio o agencia?") answers it; the six remaining questions are all sourced. FAQPage lists the same six.

## Risks / Trade-offs

- [`serviceSchema` change leaks into the monthly branch] → default `"monthly"`, byte-identical output guarded by `check-seo-15` and `check-seo-16`.
- [Removing the niche pills lowers internal links to niche pages] → they stay in the related row (`internal-links.ts`); QA re-runs the inbound-link inventory.
- [Word budget vs. seven FAQ answers] → drop question 3 if the comparison covers it; answers about 60 words.
- [S-2026-11-13-1 closes during the sprint with new prices] → out of scope here; prices change only through `src/data` in a later story.
- [NRD-163 API differs from its design] → merged API wins; deviations noted in the PR.
- Size: four work units for 5 points; the schema branch is small. No size concern.

## UI spec

Visual authority: `DESIGN.md` ("The Annotated Storefront") as rendered by `/seo-local-sevilla/`. Mode: persuade (one primary action: book a call). No new palette, type scale or component: every section is an NRD-163 template component (`src/components/seo-local/*`) with props, plus the two page illustrations already listed in Files. Colours, type and surfaces come only from the custom properties and classes of `src/styles/template.css` (NRD-163: colour tokens of the `DESIGN.md` front matter, `.template-ground`, `.band`, `.tpl-kw`, `.tpl-display`, `.tpl-accent`, `--ease-out`); if the merged token or prop names differ, the merged names win. Copy is Spanish, `tú`, no unexplained jargon; prices inside copy are interpolated from `LANDING_FROM` / `WEB_FROM` or `tierFrom`, never typed. Every display title below has exactly one accent phrase (the `accent` value, a substring of `text`).

What this redesign fixes against the reference: the old page mixes gray/yellow Tailwind cards, green glyph checks (`✓`), niche pills and three long prose blocks. All of it goes; the page reads as the same quiet working document as `/seo-local-sevilla/`, with the drawing changed from a Google listing to a business website.

### 1. Hero (`SeoLocalHero` + `WebMock` + `ProofStrip`)

- Layout: reference hero unchanged: one column under 768 px (copy, then drawing), two columns `1.05fr / 0.95fr` from 768 px, sky halo behind the drawing (already clipped by the component).
- Hierarchy: keyword h1 (small, slate) > display title > subtitle > booking button (primary, the only filled control) + "Ver precios" underlined text link (secondary) > drawing.
- Props: `keyword=disenoWeb.hero.h1` (unchanged); `title={ text: "Tu web, hecha a medida y a tu nombre", accent: "a tu nombre" }`. Assumption: ownership of domain and hosting is the page's most distinctive true fact (old benefit 3 and FAQ 4); new display copy, not fixed by any AC.
- `subtitle` (new `disenoWeb.hero.subtitle`): `` `Diseño y programo la web de tu negocio en Sevilla: rápida en el móvil, lista para Google y con precio cerrado desde ${LANDING_FROM}.` `` Assumption: shortened copy, keeps "diseño" wording natural; about 25 words, 52ch line from the component.
- `primaryCtaLabel`: not passed (site default "Reserva una primera sesión"). Assumption: same CTA as every page. `secondaryLink={ label: "Ver precios", href: "#precios" }` from `secondaryCta`.
- `WebMock` (`src/components/diseno-web/WebMock.astro`), the hero focal drawing:
  - One `<figure>` card styled like `ListingMock`: 1px `hairline` border, `rounded.card` (1.25rem), `card-surface` fill, `overflow: hidden`; drawing area on `drawing-surface` with a `hairline-quiet` bottom rule; `<figcaption>Ejemplo ilustrativo</figcaption>` in `text-muted` 0.78rem with a `hairline-quiet` top rule.
  - The drawing is a single SVG (one `viewBox`, so it scales with its column and cannot overflow at 320 px): a desktop browser frame on the left two thirds (three dots, an address pill with the SVG text "tunegocio.es", a header bar, a headline bar in `signal`, two `soft` text bars, a CTA pill in `signal`, three small service cards) and a phone in front overlapping its lower right corner (notch, the same page stacked, a round chat button in `signal` with a speech-bubble glyph drawn in stroke, a map pin). 1.5 stroke, round caps/joins, `currentColor`; `signal` = `sky-signal`, `soft` = `drawing-soft`, text labels `text-secondary`, base stroke `text-muted`. No fills except the phone screen ground (`card-surface`) that hides the desktop lines behind it.
  - `aria-label` on the figure: "Web de ejemplo de un negocio, en ordenador y en móvil"; the SVG is `aria-hidden="true" focusable="false"`. Assumption: wording.
  - Motion (`animate` default `true`): the completed state is the default CSS. Only inside `@media (prefers-reduced-motion: no-preference)` and `@supports (animation-timeline: scroll())`: the desktop text bars draw in (`stroke-dashoffset`), then the phone rises 6px and goes from opacity 0.7 to 1, then the CTA pill and chat button strokes draw, all on `scroll(root block)` within the first ~260px of scroll, like `ListingMock`. Without scroll timelines: only the phone rise, 0.7s `--ease-out`, once. `animate={false}` renders the completed state with no animation.
- `ProofStrip` (`src/components/seo-local/ProofStrip.astro`): `items` = `SITE_PROOF[0]` ("+10 años / de experiencia"), the Google cell only when `reviews` is not null (computed in the page exactly as the reference), `SITE_PROOF[1]` ("2 webs en Sevilla / de negocios locales"). No other figure.

### 2. Bento "qué incluye tu web" (`ReviewBento` + 6 `BentoTile` + `WebTileArt`)

- Wrapper: `SectionContainer id="que-incluye"` > `ReviewBento` with `keyword=disenoWeb.sectionTitles.benefits` (unchanged, carries the "Diseñadora web" variant), `title={ text: "Lo que lleva tu web desde el primer día", accent: "desde el primer día" }`, caption default "Ejemplo ilustrativo", `headingId="que-incluye-title"` (NRD-163 id rule: the anchor `que-incluye` is the `SectionContainer` id, the heading id is `que-incluye-title`). Assumption: display copy.
- Area map (reference: `a a a a b b / c c d d d d / c c e e e e / f f f f f f` from 1024 px). Tiles in source order a-f; `disenoWeb.benefits` holds them in this order. All titles and sentences Assumption: copy derived from the tier `includes` and the published process.

| Area | `kind`      | Title                           | Sentence                                                                                                      | Layout                                         |
| ---- | ----------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| a    | `google`    | "Alta en Google y Google Maps"  | "Con la web completa, te doy de alta en Search Console y la conecto con tu ficha de Google Business Profile." | stack                                          |
| b    | `contacto`  | "WhatsApp y formulario"         | "Un botón de WhatsApp y un formulario para que te escriban sin buscar tu teléfono."                           | stack                                          |
| c    | `movil`     | "Pensada primero para el móvil" | "Textos, botones y fotos se leen y se pulsan bien en cualquier pantalla, empezando por la del móvil."         | stack (tall tile, centred as reference area c) |
| d    | `seo-local` | "SEO local básico"              | "Títulos, textos y datos técnicos pensados para lo que buscan tus clientes en Sevilla."                       | stack                                          |
| e    | `panel`     | "Un panel para editarla tú"     | "Cambias un texto, una foto o un precio sin tocar código ni depender de mí."                                  | stack                                          |
| f    | `soporte`   | "Un mes de soporte"             | "Con la web completa, el primer mes después de publicar resuelvo tus dudas y los pequeños ajustes."                               | `row` (drawing beside text from 768 px)        |

- `WebTileArt` drawings (`src/components/diseno-web/WebTileArt.astro`, `aria-hidden`, same stroke rules as the reference tiles; rely on the `BentoTile` `:global(.signal|.soft|.label)` rules, do not restyle): `google` a wide search-result card (title bar `signal`, two `soft` bars) beside a map pin in `signal` on a `soft` street grid; `contacto` a speech bubble in `signal` over a three-line form with a send pill; `movil` a tall phone (fits the tall 2-column area) with stacked page blocks and a thumb-sized CTA pill in `signal`; `seo-local` a page outline with an h1 bar in `signal`, `soft` text bars and a small pin label "Sevilla" (SVG text, `label`); `panel` an editor with two labelled fields (SVG text "Texto", "Precio") and a pencil in `signal`; `soporte` a horizontal four-week track (`soft`) with a `signal` check at week 1 and two small message bubbles. No filled icons, no glyphs, no numbers or fake metrics in drawings.
- No `link` on any tile.

### 3. Process (`.band` > `SeoLocalProcess`)

- `id="proceso"`, `keyword=disenoWeb.sectionTitles.process` (unchanged), `title={ text: "Hablas con quien diseña tu web", accent: "quien diseña tu web" }`, `portrait` on with the component's default alt, no `aside` (no cycle card: one-off project). Assumption: display copy.
- `byline` slot: `Soy Nuria Romero, <a href="/">desarrolladora web en Sevilla</a>, y hago tu web de principio a fin.` Assumption: copy; the anchor avoids "consultor seo sevilla", owned by `/`.
- Steps (the four new `disenoWeb.process` entries, h3 + one sentence; only the published lead time appears; Assumption: copy):
  1. "Propuesta con precio cerrado": "Hablamos de tu negocio y te envío por escrito qué incluye, cuánto cuesta y el plazo."
  2. "Diseño": "Te enseño cómo quedará antes de programarla y ajustamos lo que haga falta."
  3. "Contenidos": "Me pasas textos, fotos y logo; si lo necesitas, te ayudo con los textos."
  4. "Publicación": "En 2 a 4 semanas desde que tengo los contenidos, la web está publicada y te enseño a editarla."

### 4. Real proof and comparison (`RealProof` + `SeoLocalAgencia`)

- `SectionContainer id="trabajo-real"` > `RealProof` with the reference values: `keyword` "Webs de negocios locales en Sevilla", `title={ text: "Trabajo que puedes ver", accent: "puedes ver" }`, `note` "Dos webs reales de negocios de Sevilla, hechas por mí. Puedes visitarlas y juzgar el trabajo por ti.", `projects=["arkady", "adfsevilla"]`, `reviews=reviewsData`. Assumption: reused verbatim from the reference because it is true and short.
- `SectionContainer` > `SeoLocalAgencia id="freelance-estudio-o-agencia" headingId="freelance-title"`, `keyword` "¿Freelance, estudio o agencia?", `title={ text: "Tres maneras de encargar tu web", accent: "encargar tu web" }`, `link={ label: "Ver los planes y precios", href: "#precios" }`. Items (`lead` renders bold, then `text`; Assumption: copy):
  1. lead "Una agencia suele repartir tu web entre varias personas: quien vende, quien diseña y quien programa." text "Conmigo hablas desde el primer día con quien la diseña y la programa."
  2. lead "Un estudio o una agencia tiene más manos si además necesitas campañas, redes o vídeo." text "Si buscas una web clara, rápida y bien hecha para tu negocio, una freelance suele bastar."
  3. lead "Elijas a quien elijas, pide por escrito qué incluye, cuánto cuesta y a nombre de quién quedan el dominio y el hosting." text "Aquí lo tienes publicado: dos opciones con precio cerrado, y dominio y hosting a tu nombre."

### 5. Plans (`.band` > `SeoLocalPlans`)

- `id="precios"` (target of "Ver precios"; keeps `scroll-m-20` so the fixed header never covers the keyword heading), `headingId="planes-title"`, `keyword=disenoWeb.sectionTitles.pricing` (unchanged), `title={ text: "Dos opciones, con precio cerrado", accent: "precio cerrado" }`, `tiers=disenoWeb.pricing.tiers` (names, prices, `includes`, `recommended`, tier note unchanged). Assumption: display copy.
- `lede` slot: `Una landing de una página cuesta <strong>desde {landing}</strong> y una web completa de hasta 5 páginas, <strong>desde {web}</strong>, con el precio cerrado por escrito antes de empezar.` with `landing = tierFrom(disenoWeb, "Landing de una página")`, `web = tierFrom(disenoWeb, "Web completa (hasta 5 páginas)")`. Assumption: copy.
- `note` (new `pricing.note`): "¿Quieres estar online ya, con lo esencial? Landing. ¿Tienes varios servicios y quieres explicar cada uno por separado? Web completa." Assumption: copy.
- Visual: reference plan cards. "Web completa" carries the yellow border, `card-surface-recommended`, yellow checks and the "Recomendado" badge, lifted 0.75rem in the two-column layout; both booking buttons share one baseline. The landing card keeps sky checks. Yellow appears nowhere else on the page except real review stars.

### 6. FAQ (`SeoLocalFaq`)

- `headingId="faq-title"`, `keyword=disenoWeb.sectionTitles.faq` (unchanged), `title={ text: "Dudas antes de encargar tu web", accent: "antes de encargar" }`, `lede` "Si tu duda no está aquí, la resolvemos en la llamada.", `ctaLabel` not passed (site default). Assumption: display copy.
- Six items: sourced questions 1, 2, 4, 5, 6, 7 of NRD-165 in this order; question 3 is dropped because section 4 answers it (word budget, as the design allows). The component bolds the first sentence (`splitAnswer`), so each first sentence is the direct answer (GEO-1). Answers are the exact `a` strings (`\n\n` = new paragraph); the developer may trim only a second paragraph if `check-seo-17` reports more than 1,200 words, never a first sentence. All Assumption: copy written from published facts.
  1. q "¿Cuánto cuesta hacer una página web?" a `` `Una landing de una página cuesta desde ${LANDING_FROM} y una web completa de hasta 5 páginas, desde ${WEB_FROM}. El precio queda cerrado por escrito antes de empezar.\n\nEl dominio y el hosting se contratan a tu nombre y los pagas tú directamente, así la web es tuya.` `` links `[{ label: "Guía para entender el precio de una web", href: "/blog/cuanto-cuesta-una-pagina-web-en-sevilla/" }]`
  2. q "¿Cuánto se tarda en hacer una web?" a "Una web de negocio suele estar lista en 2 a 4 semanas desde que tengo los contenidos: textos, fotos y logo. Una landing va más rápido que una web completa.\n\nEl plazo exacto queda escrito en la propuesta, junto al precio."
  3. q "¿Puedo hacer yo mi web gratis?" a "Sí, y a veces compensa: si estás empezando y te basta una página sencilla, un creador de webs gratuito puede servirte. Se queda corto cuando necesitas que Google entienda bien tu negocio, que cargue rápido en el móvil o que la web sea tuya y no de la plataforma.\n\nSi dudas, lo vemos en la llamada sin compromiso."
  4. q "¿WordPress o web a medida?" a "Depende de lo que vayas a hacer con ella: trabajo con las dos. Una web a medida lleva solo el código que necesita y carga más rápido; WordPress, un gestor de contenidos con miles de extensiones, compensa si vas a publicar mucho contenido por tu cuenta.\n\nEn las dos puedes cambiar tú un texto, una foto o un precio. Te digo cuál encaja con tu caso, sin venderte la que más me convenga."
  5. q "¿La web incluye SEO?" a "Sí, incluye SEO local básico: estructura, títulos y textos pensados para las búsquedas de tu zona, y una base técnica rápida y correcta. La web completa suma el alta en Google Search Console y en tu ficha de Google Business Profile.\n\nEl SEO continuo, mes a mes, es un servicio aparte, y nadie puede garantizarte una posición concreta." links `[{ label: "SEO local y GEO para tu negocio", href: "/seo-local-sevilla/" }]`
  6. q "¿Qué presupuesto necesito?" a `` `Para estar online con lo esencial, desde ${LANDING_FROM} con una landing; si tienes varios servicios que explicar por separado, desde ${WEB_FROM} con la web completa. Las dos opciones tienen precio cerrado.\n\nSi necesitas una tienda online, se presupuesta aparte.` `` links `[{ label: "Guía para entender el precio de una web", href: "/blog/cuanto-cuesta-una-pagina-web-en-sevilla/" }]`
- Layout and states: reference two columns from 1024 px (sticky intro left, ruled `details` list right), one column below; all items closed on load; native `details`/`summary` (Enter/Space); the drawn plus loses its vertical stroke when open; the links paragraph renders after the answer as underlined `sky-accent` text links.

### 7. Related (`SeoLocalRelated`)

- `links=internalLinksBySource["/diseno-web-sevilla/"]` (10 pills, unchanged), label default "Sigue leyendo". Pills wrap; hover border `sky-signal`, text `sky-accent`. Empty list: the nav is not rendered (component behaviour).

### 8. Closing and NAP (`SeoLocalClosing` + `WebMock` + `SeoLocalNap`)

- `SeoLocalClosing headingId="cierre-title"`, `keyword` "Reserva una llamada sobre tu web en Sevilla", `title={ text: "Empecemos por tu web", accent: "tu web" }` (new `disenoWeb.cta.title`), `text` "Cuéntame en qué punto está tu negocio y te respondo con una propuesta clara y un precio cerrado, sin compromiso." (new `cta.text`), `meta` "30 minutos · Sin compromiso · Directamente conmigo", `<WebMock slot="visual" animate={false} />`. Assumption: copy; the keyword heading holds no term owned by another page.
- `SectionContainer` > `SeoLocalNap headingId="nap-title"`, `keyword` "Diseño web desde La Rinconada, Sevilla". Assumption: mirrors the reference "SEO local desde La Rinconada, Sevilla" with this page's own term.

### States

- Static page, no loading or async UI. Build-time data only:
  - Google reviews unavailable (`reviewsData` null): the ProofStrip rating cell and the RealProof quote are omitted; the strip shows two cells and RealProof shows the note and the two project cards. Nothing else changes.
  - Reviews present but with no review text: rating cell shown, quote omitted (component behaviour).
  - Renamed tier: `tierFrom` throws and the build fails (intended).
- Disabled, form, empty and error states: n/a (no forms; the booking button opens the external booking page in a new tab).

### Responsive

- 320-639 px: one column; ProofStrip cells stacked with top rules; bento tiles stacked in source order (a-f) with 1rem padding; plans stacked (recommended second, no lift); FAQ intro above the list. WebMock scales inside its column (single SVG), the phone stays inside the figure.
- 640 px: ProofStrip horizontal.
- 768 px: hero two columns; bento two columns with tiles a and f full width, f drawing beside text; plans two columns with the recommended lift and aligned buttons.
- 1024 px: bento area map, process portrait column beside the timeline, comparison 0.8/1.2 columns, FAQ two columns with sticky intro.
- No horizontal scroll at any width; long words in pills and plan names wrap.

### Interactions

- Hover/focus exactly as the components: text links turn `sky-accent`; links, pills and FAQ summaries show a 2px `sky-signal` outline with 2-4px offset on `:focus-visible`; the booking button keeps its own ring. Transitions 0.2s `--ease-out`.
- "Ver precios" and "Ver los planes y precios" jump to `#precios`; scrolling follows the site setting (no new smooth scroll).
- One authored motion moment on the page: the hero WebMock. No entrance animations on sections, tiles or cards.
- Destructive actions, validation, optimistic updates: n/a.

### Accessibility hand-off

- One h1 (hero keyword). h2 per section in order: benefits keyword, process keyword, "Webs de negocios locales en Sevilla", "¿Freelance, estudio o agencia?", pricing keyword, FAQ keyword, closing keyword, NAP keyword. h3 for tile titles, step titles and plan names. Display titles are paragraphs.
- Focus order follows the visual order: booking button, "Ver precios", project cards, review link (when present), comparison link, plan buttons, FAQ summaries and their links, related pills, closing booking button, Maps link.
- WebMock: accessible name on the figure plus the visible caption; WebTileArt and every other SVG are `aria-hidden`; no information lives only in a drawing.
- Reduced motion: WebMock shows its completed state with no movement.
