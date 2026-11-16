# Design

## Context

See proposal.md (Why). State this design builds on: `develop` at 86027b0 plus NRD-195 (`nuriaromero-195-store-offer-pricing`, merged before this story starts; if its merged API differs from its design, the merged API wins and the developer notes it in the PR).

- `src/pages/tienda-online-sevilla.astro`: legacy `ServiceLayout` with two page blocks ("¿Ya vendes por Instagram o WhatsApp...?" holding the in-content link "web para comercios", and "Por qué elegir a alguien que programa" holding "Pasarela de pago integrada y probada", an intent content signal) and, after NRD-195, a `pricing` slot with `StoreOffer.astro`.
- `tiendaOnline` (`src/data/services.ts`): title "Diseño de tienda online en Sevilla | Pasarela de pago propia", H1 "Diseño de tienda online en Sevilla para negocios que quieren vender", description with "pasarela de pago propia", subtitle (double-quoted literal, read by regex in `tests/tienda-online-retarget.test.js`), `sectionTitles` (process "Así es el proceso de crear tu tienda online" is an intent signal; pricing "Cuánto cuesta una tienda online en Sevilla"), 3 long benefits, 4 long steps, ten FAQs (NRD-195 rewrote price, gateway, platform, product-load and shipping answers), `pricing` from `store-offer.ts`.
- `src/data/store-offer.ts` (NRD-195): `STORE_FROM`, `storeOptions` (`id`, `name`, `example?`, `recurringCost`), `storeIncludes`, `storeQuotedSeparately`, `STORE_FINAL_PRICE_NOTE`.
- Guards that must stay green unchanged: `tests/store-offer.test.js` (single "499 €" literal, `tiendaOnline.pricing` equals the source, copy guards over every `tiendaOnline` string, price FAQ with panel and written price, a FAQ whose question mentions Shopify comparing the three options, dist `<main>` holding every option name and recurring cost, every list item, the `/automatizaciones/` link and the note, no `@/data` import under `src/components/tienda-online/`), `scripts/check-seo-02.mjs` (one Offer 499), `tests/tienda-online-retarget.test.js`, `tests/single-price-source.test.js`, `tests/adr-0013-link-rows.test.js` (row 7 anchor of the tienda related links), `scripts/check-seo-07.mjs` (intent signals, reciprocal pair tienda <-> comercios inside `<main>`, niche-vs-service FAQ near-duplicates, ownership), `check-seo-16` (reference page) and `check-seo-17` (template contract).
- Template precedent: `src/pages/diseno-web-sevilla.astro` (NRD-165) and its archived design; components and rules from ADR 0014.
- `SeoLocalPlans` lays tiers in `repeat(2, ...)` from 768 px; three tiers would wrap 2 + 1.

## Goals / Non-Goals

**Goals:**

- Same page and intent, half the words, in the template world, with the NRD-195 offer read from its source and all its guards green.
- FAQPage = visible FAQ, Service = one Offer 499, BreadcrumbList unchanged.

**Non-Goals:**

- Changing the store offer, its lists, JSON-LD offer or llms.txt line (NRD-195).
- A lead-time answer (no published store lead time).
- Title, description, H1 (NRD-34) and NRD-125's post-indexation work.

## Decisions

**Approach.** Copy stays in `tiendaOnline` and `store-offer.ts`; the page maps it onto the template sections through `ServiceLayout variant="template"` slots, as on `/diseno-web-sevilla/`. The three options become three plan cards built from the source (`storeTiers`), and a page component `StoreScope` renders the included and quoted-separately lists below them, so the prices area shows the whole offer without new text. The comparison section explains when to choose each option from two new per-option fields in the same source. The two process and pricing keyword headings keep the intent signals; the removed legacy signal is replaced by the comparison keyword heading. `SeoLocalPlans` gains additive CSS for one and three plans only.

Alternatives considered: one "Tienda online básica" plan with the options in a lede (rejected: NRD-195 requires each option and its recurring cost in the prices area and its dist test reads them); recurring cost repeated in the comparison (rejected: the same sentence twice on a 1,000-word page; the comparison carries `bestFor` and `tradeOff`, the plan cards the recurring cost); a new shared "scope list" component (rejected: only this page needs it; page components live in `src/components/<page>/` like `diseno-web/`); restyling `StoreOffer.astro` (rejected: legacy Tailwind world, wrong structure for the template; deleted instead).

### Section map (reference order)

| #   | Slot             | Component                                                                                         | Content source                                                                                                                                                                                                                                                                                                                                                                                                      |
| --- | ---------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `hero`           | `SeoLocalHero` + `ProofStrip`                                                                     | `keyword=tiendaOnline.hero.h1` (unchanged), `title={ text: hero.title, accent: hero.titleAccent }` (new fields), `subtitle` (shorter, double-quoted, no price, still says "tienda online"), `secondaryLink={ label: hero.secondaryCta.label, href: "#precios" }`, `<StoreMock slot="visual" />`; proof items as on `/diseno-web-sevilla/` (`SITE_PROOF[0]`, Google rating only when reviews exist, `SITE_PROOF[1]`) |
| 2   | `benefits`       | `SectionContainer id="que-incluye"` > `ReviewBento headingId="que-incluye-title"` + 6 `BentoTile` | `keyword=tiendaOnline.sectionTitles.benefits` (new: "Qué incluye tu tienda online en Sevilla"); tiles from `tiendaOnline.benefits` in order catálogo, pasarela de pago, variantes, envíos sencillos, panel de gestión, SEO de producto; one sentence each, each consistent with an item of `storeIncludes` (SEO de producto is the page's existing benefit 3, shortened); `<StoreTileArt kind=... />`; areas a-f    |
| 3   | `process`        | `.band` > `SeoLocalProcess id="proceso"`                                                          | `keyword=tiendaOnline.sectionTitles.process` (unchanged signal); 4 steps from `tiendaOnline.process`: alcance, propuesta cerrada por escrito, construcción (pago probado de principio a fin), formación y lanzamiento (un mes de soporte); no lead time; portrait on; no `aside`                                                                                                                                    |
| 4   | `before-pricing` | `RealProof` + `SeoLocalAgencia id="woocommerce-shopify-o-a-medida"`                               | RealProof: `projects=["arkady", "adfsevilla"]`, `reviews`, a note that presents them as real websites of Seville businesses made by Nuria (not as stores); comparison keyword "¿WooCommerce, Shopify o a medida?" (new intent signal), items `storeOptions.map(o => ({ lead: o.bestFor, text: o.tradeOff }))`, link "Ver precio y opciones" to `#precios`                                                           |
| 5   | `pricing`        | `.band` > `SeoLocalPlans` + `StoreScope`                                                          | `keyword=tiendaOnline.sectionTitles.pricing` (unchanged signal), `tiers=storeTiers`, `lede` slot with `<strong>desde {STORE_FROM}</strong>` and that the client chooses the platform; then `<StoreScope includes={storeIncludes} quotedSeparately={storeQuotedSeparately} note={STORE_FINAL_PRICE_NOTE} />` inside the same band                                                                                    |
| 6   | `faq`            | `SeoLocalFaq headingId="faq-title"`                                                               | `keyword=tiendaOnline.sectionTitles.faq` (unchanged), `faqs=tiendaOnline.faqs` (five sourced items)                                                                                                                                                                                                                                                                                                                 |
| 7   | `related`        | `SeoLocalRelated`                                                                                 | `internalLinksBySource["/tienda-online-sevilla/"]` unchanged (its first row "web para comercios que también quieren vender online" keeps the reciprocal pair inside `<main>`)                                                                                                                                                                                                                                       |
| 8   | `closing`        | `SeoLocalClosing` + `SeoLocalNap`                                                                 | `tiendaOnline.cta` (shorter), `<StoreMock slot="visual" animate={false} />`; closing keyword "Reserva una llamada sobre tu tienda online"; NAP keyword "Tiendas online desde La Rinconada, Sevilla"                                                                                                                                                                                                                 |

Display titles, accents, ledes and tile sentences are fixed by the UI spec (ux-designer, impeccable); this design fixes structure, data and guarantees. Copy constraint for every string: no figure other than those in `store-offer.ts` (the NRD-195 copy guard enforces "499" and "20" only), no "€" literal, `tú`, no unexplained jargon.

### Data changes

`src/data/store-offer.ts` (add, do not rewrite existing values):

```ts
import type { ServicePageData } from "./types.ts";

export interface StoreOption {
  id: StoreOptionId;
  name: string;
  example?: string;
  recurringCost: string;
  bestFor: string; // new: when to choose it, one sentence
  tradeOff: string; // new: what to weigh, one sentence
  panel: string; // new: the management panel this option comes with (an included item)
}

type Tier = NonNullable<ServicePageData["pricing"]["tiers"]>[number];

/** The three options as plan tiers at the shared starting price (no recommended option).
 *  The checked list item is something included (the panel); the recurring cost is the
 *  plain plan note, never a checked item. No string is transformed (no capitalising). */
export const storeTiers: Tier[] = storeOptions.map((o) => ({
  name: o.name,
  from: STORE_FROM,
  includes: [o.panel],
  note: o.recurringCost,
}));
```

`panel` draft values: "Panel de gestión de WooCommerce", "Panel de gestión de Shopify", "Panel de gestión programado a medida". The `example` of the custom option ("por ejemplo, con Next.js y Supabase") is not on a card. The plans lede uses it mid-sentence through interpolation, so its lowercase start reads naturally, e.g. `Eliges WooCommerce, Shopify o una tienda a medida ({storeOptions.find((o) => o.id === "a-medida")?.example}); las tres cuestan <strong>desde {STORE_FROM}</strong>.`

Draft values (the UI spec may reword; no figures, no third-party amounts):

- WooCommerce: `bestFor` "Si quieres una tienda sobre WordPress, con miles de extensiones y todo a tu nombre.", `tradeOff` "Necesita su propio hosting y actualizaciones de vez en cuando."
- Shopify: `bestFor` "Si quieres empezar rápido sin ocuparte del hosting ni de las actualizaciones.", `tradeOff` "La tienda vive dentro de Shopify y pagas su cuota cada mes."
- Tienda a medida: `bestFor` "Si necesitas algo que las plataformas no hacen o quieres solo el código justo.", `tradeOff` "Los cambios grandes los hace alguien que programe, yo u otra persona."

`tiendaOnline` (`src/data/services.ts`):

- Unchanged: `slug`, `breadcrumbName`, `seo.*`, `hero.h1`, `hero.secondaryCta` (href and the NRD-195 label), `sectionTitles.process`, `sectionTitles.pricing`, `sectionTitles.faq`, `pricing`, `cta` keys.
- New/changed: `hero.title`, `hero.titleAccent`; `hero.subtitle` shortened (double-quoted literal, contains "tienda online", no price, no promise; e.g. "Diseño y monto tu tienda online en WooCommerce, Shopify o a medida, con panel de gestión, pago con tarjeta y precio cerrado por escrito."); `sectionTitles.benefits` "Qué incluye tu tienda online en Sevilla"; six `benefits`; four `process` steps; five `faqs`; shorter `cta.text`.
- Every `tiendaOnline` string keeps passing the NRD-195 copy guards.

`src/data/seo-intents.ts`: the `/tienda-online-sevilla/` row `contentSignals` becomes `["Así es el proceso de crear tu tienda online", "¿WooCommerce, Shopify o a medida?"]`; `descriptionSignal`, `titleSignal`, `h1Signal` unchanged.

### Decisions on the UX open questions (2026-11-16)

1. **Three similar cards; recurring cost under a check.** Keep three cards: one per option at the same price is the offer, and the client chooses. A single card holding the three options would need a new component, and NRD-195 requires each option and its recurring cost to be visible in the prices area. The recurring cost moves out of `includes` into the tier `note` (plain `plan-note` text, no check), so a check only ever marks something included. The checked item per card is a new `panel` field, an item that is really included. The cards differ by name, panel and cost; the reasons to choose live in the comparison right above. `SeoLocalPlans` and `Tier` stay unchanged.
2. **768-1023 px.** No 2 + 1 layout. Three plans stay one column (`max-width: 36rem`, left-aligned, same as the one-plan rule) until 1024 px, then three columns.
3. **Capitalising `example`.** Dropped. `storeTiers` transforms no strings and no longer maps `example` to a card. The example appears mid-sentence in the plans lede, so its lowercase start is correct.
4. **UX copy against the NRD-195 guards.** Starting each `bestFor` with the option name is fine: the NRD-195 tests do not read `bestFor`, and the NRD-168 test only asks for no digits. Dropping the Redsys/Bizum sentence from the price FAQ is fine: the NRD-195 Redsys rule is conditional (only sentences that mention Redsys or Bizum must say "aparte"), and the fact stays visible in `StoreScope` and in the catalogue answer. The price answer stays valid only if all of these hold:
   - The question text is "¿Cuánto cuesta una tienda online en Sevilla?", unchanged.
   - The price comes through `${STORE_FROM}`, never as a "€" literal.
   - The answer contains "panel" and "por escrito".
   - No digit appears other than 499 or 20, and no "399".

   The same holds for the platform answer: the question text is unchanged and it names WooCommerce, Shopify and "a medida".

### Single-plan width (applies to NRD-166 and NRD-167)

`.plan-list:has(> .plan:only-child) { grid-template-columns: minmax(0, 1fr); max-width: 36rem; margin-inline: 0; }`, left-aligned with the heading and the lede at every width (see Files).

### FAQ (GEO block)

Five items, answers about 50-70 words, first two sentences answer directly (`SeoLocalFaq` bolds the first sentence), `tú`, prices only through `${STORE_FROM}`:

1. "¿Cuánto cuesta una tienda online en Sevilla?" (research Q1; question text kept for NRD-195): the NRD-195 answer, second paragraph may be shortened; keeps `STORE_FROM`, "panel", "por escrito". No competitor figures.
2. "¿Cómo se crea o se monta una tienda online?" (Q2 + Q3, natural merge of crear, montar, abrir): start from what you sell (products, photos, prices, shipping), choose the platform, set-up with the brand, card payment and shipping, initial load, a full test purchase, training on the panel. No lead time.
3. "¿WooCommerce, Shopify o una tienda a medida?" (Q4; question text kept for NRD-195): the NRD-195 answer, may be shortened; three options at the same starting price; Shopify presented as offered.
4. "¿Qué plataforma conviene para un catálogo grande o con stock en varios almacenes?" (Q5): depends on the catalogue and current systems; large catalogues, bulk imports and stock sync with other systems are quoted separately in any of the three options; no PrestaShop or other platform offered; `links: [{ label: "Automatizaciones para tu negocio", href: "/automatizaciones/" }]`.
5. "¿Qué requisitos legales y técnicos tiene una tienda online?" (Q6): domain, HTTPS, a payment gateway and legal texts (aviso legal, privacidad, cookies, condiciones de venta); the store is delivered prepared for them; tax questions go to the gestoría; no legal advice or compliance promise.

Omitted: Q7 lead time (no store lead time in `src/data`; the AC allows omitting it). The current answers about digital products, physical shop, existing website, later features and gateways are not in the research and go; their facts that matter stay visible in the plans and scope lists (card gateway included, Redsys/Bizum quoted separately, initial load included).

### Files

All in layer `app`.

Create:

- `src/components/tienda-online/StoreMock.astro`: single-SVG figure (product card with photo frame, title and price bars, size chips, add-to-cart pill in `signal`; a cart drawer outline with one line item), `animate?: boolean` (completed state by default, motion only under `prefers-reduced-motion: no-preference`), caption "Ejemplo ilustrativo", `aria-label` on the figure, SVG `aria-hidden`. No numbers in the drawing (the price is a bar, not "499 €").
- `src/components/tienda-online/StoreTileArt.astro`: `{ kind: "catalogo" | "pago" | "variantes" | "envios" | "panel" | "seo" }`, one SVG each (1.5 stroke, `currentColor`, `aria-hidden`, `signal`/`soft`/`label` classes from `BentoTile`).
- `src/components/tienda-online/StoreScope.astro`: props `{ includes: string[]; quotedSeparately: StoreScopeItem[]; note: string }`, template tokens only (`@/styles/template.css`), two lists with `h3` "Incluido en las tres opciones" and "Se presupuesta aparte" (two columns from 768 px), the linked item renders its `link` as an underlined `sky-accent` text link, the note below; no `@/data` import.
- `tests/tienda-online-template.test.js`.

Modify:

- `src/data/store-offer.ts`, `src/data/services.ts` (`tiendaOnline`), `src/data/seo-intents.ts` (one signal), as above.
- `src/pages/tienda-online-sevilla.astro`: template slots per the section map; drops `TitleSection`, `StoreOffer` and both legacy blocks.
- `src/components/seo-local/SeoLocalPlans.astro` (CSS only, additive): `.plan-list:has(> .plan:only-child) { grid-template-columns: minmax(0, 1fr); max-width: 36rem; margin-inline: 0; }` at every width (it also overrides the two-column rule from 768 px). The card stays left-aligned with the heading and the lede and keeps about the width of one column of the two-plan grid at 1024 px; NRD-166 and NRD-167 use this exact value; for three plans, `.plan-list:has(> .plan:nth-child(3):last-child)` stays one column with `max-width: 36rem; margin-inline: 0` from 768 px to 1023 px (no 2 + 1 layout with an empty cell), then from 1024 px uses `grid-template-columns: repeat(3, minmax(0, 1fr)); max-width: none`. Two-plan layout byte-identical in markup and rules. Used later by NRD-166 and NRD-167 (one plan each).
- `scripts/lib/template-pages.mjs`: `{ route: "/tienda-online-sevilla/", words: [900, 1100], service: true }`.

Delete: `src/components/tienda-online/StoreOffer.astro` (NRD-195; the NRD-195 tests name no component).

### Interfaces

```ts
// src/data/store-offer.ts (additions)
interface StoreOption {
  /* existing */ bestFor: string;
  tradeOff: string;
  panel: string;
}
export const storeTiers: Tier[];

// src/components/tienda-online/StoreScope.astro
interface Props {
  includes: string[];
  quotedSeparately: StoreScopeItem[];
  note: string;
}
// src/components/tienda-online/StoreMock.astro
interface Props {
  animate?: boolean;
}
// src/components/tienda-online/StoreTileArt.astro
interface Props {
  kind: "catalogo" | "pago" | "variantes" | "envios" | "panel" | "seo";
}
```

### Data

No storage or migration, no price change. FAQPage changes from ten to five questions; Service and BreadcrumbList unchanged.

### Test plan (TDD order)

1. Task 1.1, `tests/tienda-online-template.test.js` first: every `storeOptions` item has non-empty `bestFor`, `tradeOff` and `panel` without digits; `storeTiers` has three tiers named as the options, each `from === STORE_FROM`, `includes` equal to `[panel]`, `note === recurringCost`, none `recommended`; the plans lede in the page interpolates the custom option's `example`; `SeoLocalPlans.astro` source holds the `:only-child` and `nth-child(3):last-child` rules and its markup is unchanged (compare the template part without the `<style>` block to a fixture captured before the edit, as `contact-template.test.js` does). Then implement. `check-seo-16` green (reference page, two plans). Scenario "Three plans at one price" (data part).
2. Task 1.2, illustration and scope assertions first: `StoreMock`/`StoreTileArt` SVGs `aria-hidden`, stroke 1.5, no `fill` other than `none`/card surface, "Ejemplo ilustrativo", reduced-motion guard, the `kind` union of six; no digit inside any SVG `<text>`; `StoreScope` imports no `@/data`, renders two `h3`, one `<ul>` per list, and the link markup. Scenario "Illustrations".
3. Task 2.1, structure assertions first: page uses `variant="template"`, template components in reference slot order (`SeoLocalHero`, `StoreMock`, `ProofStrip`, `ReviewBento`, `StoreTileArt`, `SeoLocalProcess`, `RealProof`, `SeoLocalAgencia`, `SeoLocalPlans`, `StoreScope`, `SeoLocalFaq`, `SeoLocalRelated`, `SeoLocalClosing`, `SeoLocalNap`); no `TitleSection`, `StoreOffer`, `✓`, `text-gray-`/`bg-gray-`; keyword headings bound to `tiendaOnline.sectionTitles.*`; comparison items built from `storeOptions`; plans `tiers={storeTiers}`; six `benefits`, four `process` steps, none with a digit; intent row signal updated. Run the NRD-195 tests (unchanged) and `check-seo-07` (signals, reciprocal pair, ownership). Scenarios "Owned term kept", "No term of another owner in headings", "Sections in reference order", "Legacy blocks removed", "Scope lists below the plans", "Three offered options compared", "Real proof only", "Reciprocal pair intact".
4. Task 2.2, add the template entry, `pnpm build && pnpm check:seo-17:dist` RED (words, FAQ), then FAQ assertions: five items whose normalised questions equal the list above in order; price and platform questions keep their NRD-195 text; the catalogue answer matches `/presupuest/` and `/aparte/` and names no platform outside the three; the legal answer names "dominio", "HTTPS", "pasarela", "aviso legal" and contains "gestoría" and no `/garantiz|cumple(s)? (con )?la ley/`; no FAQ answer matches `/semanas|d[ií]as|meses/` (no lead time); FAQ data holds no "€" literal. Then write the copy within 900-1,100 words. Scenarios "Word budget", "FAQ equals FAQPage", "Price answer from the source", "Large catalogues answered honestly", "Legal question without legal advice", "No unpublished lead time".
5. Every task: `node --test tests/*.test.js`, `pnpm build`, `pnpm check:seo:dist` green, including every NRD-195 assertion unchanged.

### Real-browser / e2e checks (QA)

- `/tienda-online-sevilla/` at 375, 768, 1024 and 1280 px against the UI spec: no overflow; three plan cards stacked under 768 px, two + one at 768 px, three columns from 1024 px with aligned buttons; `StoreScope` lists below; bento area map from 1024 px.
- `/seo-local-sevilla/` and `/diseno-web-sevilla/` plans unchanged (spot screenshots; `check-seo-16`).
- Keyboard: hero CTA, "Ver precio y opciones" (lands on `#precios` below the fixed header), comparison link, plan buttons, the automatizaciones links (scope list and FAQ), FAQ summaries, related pills, closing CTA; 2 px sky focus.
- `StoreMock` completed state with reduced motion and the first paint before any scroll (NRD-196 lesson: no element hidden in the initial state).
- Rich Results Test: Service with one Offer 499, FAQPage with five questions, BreadcrumbList.

### ADRs relied on

0003, 0004, 0005, 0006, 0008, 0012, 0013, 0014. No new ADR: page components and additive layout rules in a shared component are covered by ADR 0014 ("a change to a shared component must be checked on every template page").

## Risks / Trade-offs

- [Shared `SeoLocalPlans` CSS leaks into two-plan pages] -> rules are scoped by `:has()` to one or three children; two-plan pages keep today's rules; screenshots of the reference and design-web plans in QA. Browsers without `:has()` fall back to the current two-column grid (acceptable).
- [NRD-195 tests break on the recomposed page] -> NRD-195 asserts data and visible text, not markup or component names; this design keeps the price and platform questions, `tiendaOnline.pricing`, and every list item and recurring cost visible.
- [Word budget with three plan cards plus two lists] -> plan cards hold one sentence each; FAQ answers about 60 words; the second paragraph of the price answer is the first thing to trim.
- [Removing ten FAQs loses long-tail text] -> the five kept are the sourced ones (C4); facts move to the plans and scope lists.
- [Real proof shows websites, not stores] -> the note says what they are; no store client is claimed.
- [Lead-time question omitted] -> stated in the report; if the owner publishes a store lead time later, a small follow-up adds the question.
- Size: four work units for 5 points; no size concern.

## UI spec

Visual authority: `DESIGN.md` ("The Annotated Storefront") as rendered by `/seo-local-sevilla/` and `/diseno-web-sevilla/` (NRD-165, the closest precedent: same slots, same components, page illustrations in `src/components/diseno-web/`). Mode: persuade (one primary action: book a call). No new palette, type scale or shared component: every section is an NRD-163 template component (`src/components/seo-local/*`) with props, plus the three page components listed in Files. Colours, type and surfaces come only from the custom properties and classes of `src/styles/template.css` (`--card-surface`, `--drawing-surface`, `--hairline`, `--hairline-quiet`, `--sky-signal`, `--sky-accent`, `--drawing-soft`, `--text-strong|body|secondary|muted`, `--ease-out`, `.band`). Copy is Spanish, `tú`, no unexplained jargon; the only figures in `tiendaOnline` / `store-offer.ts` strings are `STORE_FROM` (interpolated, never typed) and "20" (the initial product load, as in `storeIncludes`); no "€" literal in any string written here. Every display title has exactly one accent phrase (the `accent` value, a substring of `text`).

What this redesign fixes against the current page: gray Tailwind cards, the legacy `StoreOffer` block and two long prose blocks go; the page reads as the same quiet working document as the reference, with the drawing changed to a product page and a cart. Yellow appears nowhere on this page except real review stars: no plan is recommended (the client chooses the platform).

Word budget guide (900-1,100 in `<main>`, `check-seo-17`): the copy below is sized to land at about 1,000 words. If the build reports more than 1,100, trim in this order: the second paragraph of FAQ 2, the process byline, the second paragraph of FAQ 4. Never trim a first sentence of a FAQ answer, a scope list item or a recurring cost. Under 900: restore the NRD-195 second paragraph of FAQ 1 ("Redsys o Bizum, los catálogos grandes...") first.

### 1. Hero (`SeoLocalHero` + `StoreMock` + `ProofStrip`)

- Layout: reference hero unchanged: one column under 768 px (copy, then drawing), two columns `1.05fr / 0.95fr` from 768 px, sky halo behind the drawing (component).
- Hierarchy: keyword h1 (small, slate) > display title > subtitle > booking button (primary, the only filled control in the hero) + "Ver precio y opciones" underlined text link (secondary) > drawing.
- Props: `keyword=tiendaOnline.hero.h1` (unchanged); `title={ text: "Tu tienda online, lista para vender", accent: "lista para vender" }` (new `hero.title` / `hero.titleAccent`). Assumption: display copy, not fixed by any AC.
- `subtitle` (new `tiendaOnline.hero.subtitle`, double-quoted literal): "Diseño y monto tu tienda online en WooCommerce, Shopify o a medida, con panel de gestión, pago con tarjeta y precio cerrado por escrito." Assumption: the TL's draft adopted verbatim (22 words, contains "tienda online", no price).
- `primaryCtaLabel`: not passed (site default "Reserva una primera sesión"). `secondaryLink={ label: tiendaOnline.hero.secondaryCta.label, href: "#precios" }` (label "Ver precio y opciones" from NRD-195).
- `StoreMock` (`src/components/tienda-online/StoreMock.astro`), the hero focal drawing, built like `src/components/diseno-web/WebMock.astro`:
  - One `<figure>` card: 1px `--hairline` border, radius 1.25rem, `--card-surface` fill, `overflow: hidden`; drawing area on `--drawing-surface` with a `--hairline-quiet` bottom rule; `<figcaption>Ejemplo ilustrativo</figcaption>` in `--text-muted` 0.78rem with a `--hairline-quiet` top rule (same rules as WebMock).
  - A single SVG (one `viewBox`, so it scales with its column and cannot overflow at 320 px). Left two thirds: a product page card with a photo frame (rounded rect holding a simple tote bag drawn in stroke), a title bar (`--text-secondary` stroke), a shorter price bar in `signal` (a bar, never a number), a row of three size chips (outlined pills; the middle one in `signal` = selected), two colour dots (stroke-only circles, one ringed in `signal`), and a wide add-to-cart pill in `signal` with a small bag glyph drawn in stroke. Right third, overlapping the card edge: a cart drawer (tall rounded rect filled with `--card-surface` to mask the lines behind it, the only fill besides `none`), a header bar, one line item (small square thumb + two `soft` bars), a `soft` divider, a total bar and a checkout pill outline in `signal`. 1.5 stroke, round caps/joins, `currentColor` base `--text-muted`; `signal` = `--sky-signal`, `soft` = `--drawing-soft`. No SVG `<text>` at all, no digits, no currency, no WooCommerce or Shopify logos.
  - `aria-label` on the figure: "Tienda online de ejemplo: ficha de producto y carrito". The SVG is `aria-hidden="true" focusable="false"`. Assumption: wording.
  - Motion (`animate` default `true`). The default CSS is the completed drawing, fully visible at first paint before any scroll (NRD-196 lesson): no keyframe may start at `opacity` below 0.7, and no stroke may start fully hidden by `stroke-dashoffset`. Only inside `@media (prefers-reduced-motion: no-preference)`: with `@supports (animation-timeline: scroll())`, over `scroll(root block)` 0-220px, the cart drawer slides from `translateX(10px)` and opacity 0.75 to its place and opacity 1, and the line item's two bars grow from `scaleX(0.6)` to 1 (origin left); without scroll timelines, the drawer slide only, once, 0.7s `--ease-out`, 0.3s delay. Nothing else moves. `animate={false}` renders the completed state with no animation. Assumption: motion choreography.
- `ProofStrip` (`src/components/seo-local/ProofStrip.astro`): `items` built exactly as on `/diseno-web-sevilla/`: `SITE_PROOF[0]`, the Google cell only when `reviewsData` is not null, `SITE_PROOF[1]`. No other figure.

### 2. Bento "qué incluye tu tienda" (`ReviewBento` + 6 `BentoTile` + `StoreTileArt`)

- Wrapper: `SectionContainer id="que-incluye"` > `ReviewBento headingId="que-incluye-title"`, `keyword=tiendaOnline.sectionTitles.benefits` ("Qué incluye tu tienda online en Sevilla"), `title={ text: "Lo que lleva tu tienda al abrir", accent: "al abrir" }`, caption default "Ejemplo ilustrativo". Assumption: display copy.
- Area map is the reference one (`a a a a b b / c c d d d d / c c e e e e / f f f f f f` from 1024 px). `tiendaOnline.benefits` holds the six tiles in this order (`title`, `text`); the page maps them to `area`, `kind` and `layout` like the `tiles` array of `/diseno-web-sevilla/`. All titles and sentences Assumption: copy derived item by item from `storeIncludes` (plus the existing SEO benefit), one sentence each, no digit other than "20".

| Area | `kind`      | Title                           | Sentence                                                                                      | Layout                                  |
| ---- | ----------- | ------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------- |
| a    | `catalogo`  | "Tu catálogo, ya subido"        | "Subo yo hasta unos 20 productos con sus fotos y precios, para que abras lista para vender."  | stack                                   |
| b    | `pago`      | "Pago con tarjeta"              | "Tus clientes pagan con tarjeta a través de una pasarela como Stripe."                        | stack                                   |
| c    | `variantes` | "Tallas y colores"              | "Cada producto puede tener variantes simples de talla o color sin repetir fichas."            | stack (tall tile, centred as area c)    |
| d    | `envios`    | "Envíos sencillos"              | "Tarifa plana, recogida en tienda o las dos, configuradas desde el primer día."               | stack                                   |
| e    | `panel`     | "Un panel para el día a día"    | "Desde el panel subes productos, cambias precios y ves tus pedidos; te enseño a usarlo."      | stack                                   |
| f    | `seo`       | "Fichas preparadas para Google" | "Cada producto y cada categoría se escriben pensando en lo que busca quien quiere comprarlo." | `row` (drawing beside text from 768 px) |

- Tile a says "Subo yo" rather than "cargo" so no new sentence pairs "carga" with "productos" (keeps the NRD-195 copy guard trivially green). Assumption: wording.
- `StoreTileArt` drawings (`src/components/tienda-online/StoreTileArt.astro`, `aria-hidden="true" focusable="false"`, 1.5 stroke, round caps, `currentColor`; use the `BentoTile` `:global(.signal|.soft|.label)` classes, do not restyle; no SVG `<text>`, no digits, no filled icons, no brand logos). Assumption: drawing compositions, inside the `kind` union of the design:
  - `catalogo` (wide tile a): a shelf of three product cards in a row, each a photo frame + two `soft` bars; the middle card's frame in `signal`. Height capped by the existing `.tile-a svg { max-height: 15rem }`.
  - `pago`: a payment card outline (chip square, two `soft` bars, no numbers) tilted slightly, beside a `signal` check inside a circle.
  - `variantes` (tall tile c): a t-shirt outline above a column of three size pills (middle one `signal`) and a row of three colour circles (one ringed in `signal`), composed vertically to fill the tall area.
  - `envios` (wide tile d): a parcel box on the left joined by a dashed `soft` path to a small storefront outline on the right (the pick-up option), with a `signal` marker on the path.
  - `panel` (wide tile e): a dashboard window: a narrow `soft` sidebar and three order rows (thumb square + bar + small status pill), the first row's pill in `signal`.
  - `seo` (row tile f): a search result card (title bar in `signal`, two `soft` bars) whose title joins by a `soft` line to a small product card (photo frame + bar).
- No `link` on any tile.

### 3. Process (`.band` > `SeoLocalProcess`)

- `id="proceso"`, `headingId="proceso-title"`, `keyword=tiendaOnline.sectionTitles.process` (unchanged signal), `title={ text: "Del catálogo a tu tienda publicada", accent: "tu tienda publicada" }`, `portrait` on with the component's default alt, no `aside`. Assumption: display copy.
- `byline` slot: `Soy Nuria Romero, <a href="/">desarrolladora web en Sevilla</a>, y monto tu tienda de principio a fin.` Assumption: copy, same anchor as `/diseno-web-sevilla/` (avoids "consultor seo sevilla", owned by `/`).
- Steps (`tiendaOnline.process`, h3 + one sentence, no lead time, no digit; Assumption: copy):
  1. "Alcance": "Hablamos de lo que vendes y de cómo lo vendes, y eliges WooCommerce, Shopify o una tienda a medida."
  2. "Propuesta cerrada por escrito": "Te envío qué incluye y cuánto cuesta antes de empezar, sin sorpresas a mitad de camino."
  3. "Construcción": "Monto la tienda con tu marca y pruebo una compra completa, del carrito a la confirmación del pedido."
  4. "Formación y lanzamiento": "Te enseño a gestionar productos y pedidos, publicamos y tienes un mes de soporte incluido."

### 4. Real proof and comparison (`RealProof` + `SeoLocalAgencia`)

- `SectionContainer id="trabajo-real"` > `RealProof headingId="prueba-title"`, `keyword` "Trabajo real para negocios de Sevilla", `title={ text: "Trabajo que puedes ver", accent: "puedes ver" }`, `note` "Dos webs reales de negocios de Sevilla, hechas por mí. No son tiendas: te las enseño para que veas cómo trabajo.", `projects=["arkady", "adfsevilla"]`, `reviews=reviewsData`. Assumption: the keyword differs from the reference's "Webs de negocios locales en Sevilla" so no h2 here leans on the design-web page's "web ... Sevilla" ground; the note says plainly the projects are websites, not stores (design Risks).
- `SectionContainer` > `SeoLocalAgencia id="woocommerce-shopify-o-a-medida" headingId="plataforma-title"`, `keyword` "¿WooCommerce, Shopify o a medida?", `title={ text: "Elige tu plataforma", accent: "tu plataforma" }`, `link={ label: "Ver precio y opciones", href: "#precios" }`. Assumption: display copy and heading id.
- Items `storeOptions.map(o => ({ lead: o.bestFor, text: o.tradeOff }))`; `lead` renders bold. Each `bestFor` opens with the option's name so the reader knows which option each row is about (the TL drafts named WordPress and none of the option names in two of the three rows). Final values (Assumption: rewording of the TL drafts, allowed by the design; no digits):
  - WooCommerce: `bestFor` "WooCommerce, si quieres tu tienda sobre WordPress, con miles de extensiones y a tu nombre." `tradeOff` "Necesita su propio hosting y alguna actualización de vez en cuando."
  - Shopify: `bestFor` "Shopify, si quieres empezar rápido sin ocuparte del hosting ni de las actualizaciones." `tradeOff` "La tienda vive dentro de Shopify y le pagas su cuota cada mes."
  - Tienda a medida: `bestFor` "Una tienda a medida, si necesitas algo que las plataformas no hacen o quieres solo el código justo." `tradeOff` "Los cambios grandes los hace alguien que programe, yo u otra persona."

### 5. Plans and scope (`.band` > `SeoLocalPlans` + `StoreScope`)

- `SeoLocalPlans` with default `id="precios"` (target of both "Ver precio y opciones" links, keeps `scroll-m-20`), `headingId="planes-title"`, `keyword=tiendaOnline.sectionTitles.pricing` (unchanged signal), `title={ text: "Tres opciones, el mismo precio", accent: "el mismo precio" }`, `tiers=storeTiers`, no `note` prop (the final-price note lives in `StoreScope`). Assumption: display copy.
- `lede` slot (TL decision 3): `Eliges WooCommerce, Shopify o una tienda a medida ({example}); las tres cuestan <strong>desde {STORE_FROM}</strong>.` where `example = storeOptions.find((o) => o.id === "a-medida")?.example` (renders "por ejemplo, con Next.js y Supabase", lowercase, mid-sentence; no string transformation). "Desde" lives in the lede because each card price shows `tier.from` alone, as on the other template pages.
- Plan cards (component markup unchanged; only the TL's additive grid rules; TL decision 1): per card, top to bottom, the `h3` option name, the price `STORE_FROM`, one checked list item = the option's `panel` ("Panel de gestión de WooCommerce", "Panel de gestión de Shopify", "Panel de gestión programado a medida") with the sky check, then the `plan-note` = `recurringCost` (plain `--text-muted` 0.875rem text, no check), and the booking button (default label). A check only ever marks something included. No card carries the `example`. No badge, no yellow, no lift: all three cards on `--card-surface` with `--hairline` borders, equal visual weight.
- Grid (TL decision 2): up to 1023 px the three cards stack in one column, `max-width: 36rem`, left-aligned with the heading and the lede (same as the one-plan rule), cards at natural height. From 1024 px three equal columns; `align-items: stretch` and `.plan-cta { margin-top: auto }` keep the three buttons on one baseline although the Shopify cost note is longer. No 2 + 1 layout, no `min-height`, spacer or filler item.
- `StoreScope` (`src/components/tienda-online/StoreScope.astro`), inside the same band and `SectionContainer`, directly after `SeoLocalPlans`:
  - Outer `<div class="scope">` with `margin-top: 2.5rem`; no card and no border around the block (the plans are the cards; the scope reads as the terms of the same offer, avoiding cards inside the band next to cards). Assumption: layout.
  - Two columns from 768 px (`grid-template-columns: repeat(2, minmax(0, 1fr))`, gap 1.5rem row / 2rem column), one column below, included first. Each column: `h3` ("Incluido en las tres opciones", then "Se presupuesta aparte") in the plan `h3` style but 1.125rem (650, `--text-strong`, line-height 1.25), then a `<ul>` with a 1px `--hairline` top rule, `padding-top: 1rem`, gap 0.6rem, items `--text-secondary` 0.95rem / 1.5 with marker and text in a flex row, as the plan lists.
  - Markers (inline SVG, `aria-hidden="true" focusable="false"`, 1.1rem, 1.5 stroke, `margin-top: 0.2rem`): included items use the same check path as `SeoLocalPlans` (`M5 12.5l4.5 4.5L19 7.5`) in `--sky-signal`; quoted-separately items a short horizontal dash (`M7 12h10`) in `--text-muted`, a neutral "not in the starting price" mark, never red and never a cross. Assumption: marker choice.
  - The linked item ("Facturación automática o sincronización de stock con otros sistemas"): its text, a space, then the link "Ver automatizaciones" to `/automatizaciones/` styled like `.agencia-link` in `SeoLocalAgencia` (`--text-body`, underline `rgb(var(--sky-signal-rgb) / 0.7)`, offset 0.3em, hover `--sky-accent`, 2px `--sky-signal` focus outline, offset 4px).
  - The note (`STORE_FINAL_PRICE_NOTE`) below both columns, full width, `margin: 1.5rem 0 0`, `--text-body` 1rem / 1.6, `max-width: 65ch`; the last line of the prices band.

### 6. FAQ (`SeoLocalFaq`)

- `headingId="faq-title"`, `keyword=tiendaOnline.sectionTitles.faq` (unchanged), `title={ text: "Dudas antes de montar tu tienda", accent: "antes de montar" }`, `lede` "Si tu duda no está aquí, la vemos en la llamada.", `ctaLabel` not passed. Assumption: display copy.
- Five items in this order (`a` with `\n\n` between paragraphs; first sentence = direct answer, bolded by the component). Prices only through `${STORE_FROM}`; no "semanas", "días" or "meses"; no digit other than "20". Items 1 and 3 keep their NRD-195 question text and are shortened, not contradicted (AC). All answers Assumption: copy written from published facts (`store-offer.ts`, the design's FAQ outline).
  1. q "¿Cuánto cuesta una tienda online en Sevilla?" a `` `Una tienda online básica cuesta desde ${STORE_FROM}, con el panel de gestión incluido, en WooCommerce, Shopify o a medida, como prefieras. Incluye el diseño con tu marca, el pago con tarjeta, envíos sencillos, hasta unos 20 productos subidos por mí, formación y un mes de soporte.\n\nEl precio final se cierra por escrito antes de empezar.` ``
  2. q "¿Cómo se crea o se monta una tienda online?" a "Se empieza por lo que vendes: productos, fotos, precios y cómo los envías. Después eliges la plataforma y yo la monto con tu marca, el pago con tarjeta y los envíos.\n\nSubo los primeros productos, hago una compra de prueba completa y te enseño a llevar la tienda desde el panel."
  3. q "¿WooCommerce, Shopify o una tienda a medida?" a `` `Las tres parten del mismo precio, desde ${STORE_FROM}, y eliges tú. Shopify es la más rápida de poner en marcha y no te ocupas del hosting, pero pagas a Shopify una cuota mensual.\n\nWooCommerce funciona sobre WordPress y queda a tu nombre, igual que una tienda a medida, que lleva solo lo que necesitas. Si dudas, lo vemos en la llamada según lo que vendes.` ``
  4. q "¿Qué plataforma conviene para un catálogo grande o con stock en varios almacenes?" a "Depende de cuántos productos tienes y de qué programas usas ya para facturar o llevar el almacén. Las tres opciones admiten un catálogo grande, pero importarlo de golpe o sincronizar el stock con otros sistemas se presupuesta aparte.\n\nLo vemos con tus datos y te digo qué opción encaja mejor." links `[{ label: "Automatizaciones para tu negocio", href: "/automatizaciones/" }]`
  5. q "¿Qué requisitos legales y técnicos tiene una tienda online?" a "Necesitas un dominio, conexión segura HTTPS, una pasarela de pago y los textos legales: aviso legal, privacidad, cookies y condiciones de venta. Te entrego la tienda con HTTPS, la pasarela configurada y las páginas preparadas para esos textos.\n\nSu contenido y las dudas de impuestos conviene revisarlos con tu gestoría o con un abogado, porque yo no doy asesoramiento jurídico."
- Layout and states: reference two columns from 1024 px (sticky intro left, ruled `details` list right), one column below; all items closed on load; native `details`/`summary`; the links paragraph renders after the answer as underlined `sky-accent` text links (component).

### 7. Related (`SeoLocalRelated`)

- `links=internalLinksBySource["/tienda-online-sevilla/"]` unchanged (first pill "web para comercios que también quieren vender online", the reciprocal pair), label default "Sigue leyendo". Empty list: nav not rendered (component).

### 8. Closing and NAP (`SeoLocalClosing` + `StoreMock` + `SeoLocalNap`)

- `SeoLocalClosing headingId="cierre-title"`, `keyword` "Reserva una llamada sobre tu tienda online" (design), `title={ text: "Empecemos por tu tienda", accent: "tu tienda" }` (new `tiendaOnline.cta.title`), `text` "Cuéntame qué vendes y cómo lo vendes ahora, y te respondo con una propuesta clara y un precio cerrado, sin compromiso." (shorter `cta.text`), `meta` "30 minutos · Sin compromiso · Directamente conmigo", `<StoreMock slot="visual" animate={false} />`. Assumption: copy; `meta` is the reference literal in page markup, not a `tiendaOnline` string, so the NRD-195 digit guard over `tiendaOnline` does not apply to it.
- `SectionContainer` > `SeoLocalNap headingId="nap-title"`, `keyword` "Tiendas online desde La Rinconada, Sevilla" (design).

### States

- Static page, no loading or async UI. Build-time data only:
  - Google reviews unavailable (`reviewsData` null): ProofStrip shows two cells; RealProof shows the note and the two project cards without the quote.
  - Reviews present without text: rating cell shown, quote omitted (component).
  - The lede reads the custom option's `example`; if it is ever missing, the lede drops the parenthesis (no empty "()").
  - A `storeQuotedSeparately` item without `link`: text only.
- Disabled, form, empty and error states: n/a (no forms; booking buttons open the external booking page in a new tab).

### Responsive

- 320-639 px: one column; ProofStrip cells stacked; bento tiles stacked a-f with 1rem padding; plan cards stacked (WooCommerce, Shopify, Tienda a medida), max-width 36rem, left-aligned; scope lists stacked, included first; FAQ intro above the list. StoreMock scales inside its column; the cart drawer stays inside the figure at 320 px.
- 640 px: ProofStrip horizontal.
- 768 px: hero two columns; bento two columns with tiles a and f full width, f drawing beside text; plans still one column (max-width 36rem, left-aligned); scope lists two columns.
- 1024 px: bento area map; process portrait column; comparison 0.8/1.2 columns; plans three columns with aligned buttons; FAQ two columns.
- No horizontal scroll at any width; option names, list items and pills wrap.

### Interactions

- Hover/focus exactly as the components: text links turn `sky-accent`; links, pills and FAQ summaries show a 2px `sky-signal` outline with 2-4px offset on `:focus-visible`; booking buttons keep their own ring. Transitions 0.2s `--ease-out`.
- "Ver precio y opciones" (hero and comparison) jumps to `#precios`; the keyword heading lands below the fixed header (`scroll-m-20`); no new smooth scroll.
- One authored motion moment: the hero StoreMock. No entrance animations on sections, tiles, cards or lists.
- Destructive actions, validation, optimistic updates: n/a.

### Accessibility hand-off

- One h1 (hero keyword). h2 in order: benefits keyword, process keyword, "Trabajo real para negocios de Sevilla", "¿WooCommerce, Shopify o a medida?", pricing keyword, FAQ keyword, closing keyword, NAP keyword. h3: tile titles, step titles, plan names, the two scope list headings. Display titles are paragraphs.
- Focus order follows the visual order: booking button, "Ver precio y opciones", project cards, review link (when present), comparison link, the three plan buttons, "Ver automatizaciones", FAQ summaries and their links, related pills, closing booking button, Maps link.
- The three plan buttons share one label; each sits inside an `article` headed by its option name; no extra `aria-label`. Assumption: same pattern as the two-plan pages.
- StoreMock: accessible name on the figure plus the visible caption; StoreTileArt, scope markers and every other SVG are `aria-hidden`; no information lives only in a drawing or a marker (each list has its `h3`).
- Reduced motion: StoreMock shows its completed state with no movement.
