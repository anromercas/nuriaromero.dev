# Design

## Context

See proposal.md (Why). Current state on `develop` (86027b0):

- `tiendaOnline` (`src/data/services.ts` lines 670-785): `pricing.from: "399 €"`, four `includes`, a long `note` that frames 399 € as the base website and quotes gateway, stock, variants and shipping separately; ten FAQs, of which the price answer (line 738), the gateway answer (742), the Shopify/Wix answer (746), the product-load answer (762) and the shipping/stock answer (778) contradict the new offer; benefit 1 "Tienda propia, sin comisión de marketplace" (696) frames platforms as a monthly fee to avoid; `hero.secondaryCta.label` "Ver cómo se presupuesta".
- `src/pages/tienda-online-sevilla.astro` renders the legacy `ServiceLayout` (default `pricing` slot = `PricingCard` with `from`, `includes`, `note`) plus two page blocks ("¿Ya vendes por Instagram...?" with the in-content link to `/web-para-comercios-sevilla/`, and "Por qué elegir a alguien que programa"). Both stay in this story (NRD-168 recomposes the page).
- Service JSON-LD: `ServiceLayout` passes `price: page.pricing.from` to `serviceSchema` (`src/lib/schema.ts`), which emits one Offer with the digits of that string; `tiendaOnline` has no `offersFromTiers`, so a single Offer is already the behaviour.
- Other store mentions: `disenoWeb` full-website tier note (`services.ts` line 115) "¿Necesitas una tienda online completa? Se presupuesta aparte." (the story's lines 93/128 moved with NRD-165; the old FAQ sentence no longer exists); `comercios` in `src/data/niches.ts` line 275 (`pricing.note`) and line 284 (second paragraph of "Catálogo o tienda online completa: ¿qué precio tiene cada opción?"); `public/llms.txt` line 15.
- Guards: `tests/tienda-online-retarget.test.js` ("price logic is unchanged" requires "399 €" and "se presupuesta según el catálogo"), `tests/single-price-source.test.js` (llms.txt prices must exist in the service `pricing`, parsed with a regex over `from: "..."` literals, so a constant would be invisible to it), `tests/diseno-web-template.test.js` (owner-fact guards over every `disenoWeb` string and the built `/diseno-web-sevilla/` `<main>`: a sentence with "panel" must say it is not included or quoted apart), `scripts/check-seo-07.mjs` (intent `contentSignals` of the store row, including "Pasarela de pago integrada y probada" from the page block; niche-vs-service FAQ near-duplicates).
- `src/data/local-trust.ts` already imports a sibling data module with a relative `.ts` path (`./site.ts`); `allowImportingTsExtensions` is on through `astro/tsconfigs/base`, and Node 24 loads it in tests with type stripping.

## Goals / Non-Goals

**Goals:**

- One data module owns the store figure and lists; services, niches, the page and the tests read it.
- The store page shows the offer through its pricing section; FAQ, benefits and process stop contradicting it.
- Service JSON-LD and llms.txt publish 499; tests fail before and pass after.

**Non-Goals:**

- Moving the page to the template, word budget, new FAQ questions (NRD-168).
- Touching niche panel sentences (PRD §12) or the store title, description, H1 and intent row.

## Decisions

**Approach.** Add `src/data/store-offer.ts` as the single source (no imports, plain exports) and import it with a relative `.ts` path from `services.ts` and `niches.ts`, following `local-trust.ts`. `tiendaOnline.pricing` points at it, so `serviceSchema` keeps emitting one Offer, now 499, with no schema change. The store page overrides only the legacy `pricing` slot with a small props-only component that renders the options and both lists; the rest of the legacy page stays until NRD-168. The FAQ copy interpolates `STORE_FROM`, so `services.ts` holds no store "€" literal. `single-price-source.test.js` switches from regex parsing to importing `services.ts`, which keeps its guarantees and sees constants.

Alternatives considered: the source inside `tiendaOnline.pricing` (rejected: `niches.ts` would import `services.ts` for one value and the options/lists have no place in `ServicePageData`); a constant in `services.ts` exported to niches (rejected: mixes a cross-page offer into the service-page file and couples niches to all services); one Offer per option in JSON-LD (rejected by the owner: same price, adds nothing); reusing `PricingCard` tiers for the three options (rejected: it cannot render the two scope lists or the link, and it would print "Recomendado" styling rules meant for paid tiers).

### Data: `src/data/store-offer.ts` (exact values)

```ts
// Online store offer (owner decisions 2026-11-16, PRD §14). Single source for the
// starting price, the three options and the scope lists; nothing else writes them.
export const STORE_FROM = "499 €";

export type StoreOptionId = "woocommerce" | "shopify" | "a-medida";

export interface StoreOption {
  id: StoreOptionId;
  name: string;
  example?: string;
  recurringCost: string;
}

export interface StoreScopeItem {
  text: string;
  link?: { label: string; href: string };
}

export const storeOptions: StoreOption[] = [
  {
    id: "woocommerce",
    name: "WooCommerce",
    recurringCost: "El hosting y el dominio quedan a tu nombre y los pagas tú.",
  },
  {
    id: "shopify",
    name: "Shopify",
    recurringCost:
      "La cuota mensual de la plataforma la pagas tú directamente a Shopify.",
  },
  {
    id: "a-medida",
    name: "Tienda a medida",
    example: "por ejemplo, con Next.js y Supabase",
    recurringCost: "El hosting y el dominio quedan a tu nombre y los pagas tú.",
  },
];

export const storeIncludes: string[] = [
  "Tienda montada en tu web, con un diseño adaptado a tu marca",
  "Una pasarela de pago con tarjeta, como Stripe",
  "Envíos sencillos: tarifa plana y/o recogida en tienda",
  "Hasta unos 20 productos cargados por mí, con variantes simples de talla o color",
  "Una sesión de formación para subir productos y gestionar pedidos desde el panel",
  "Un mes de soporte tras el lanzamiento",
];

export const storeQuotedSeparately: StoreScopeItem[] = [
  { text: "Pagos con Redsys o Bizum" },
  { text: "Catálogos grandes o importaciones masivas de productos" },
  { text: "Envíos por peso o por zona e integraciones con transportistas" },
  {
    text: "Facturación automática o sincronización de stock con otros sistemas",
    link: { label: "Ver automatizaciones", href: "/automatizaciones/" },
  },
];

export const STORE_FINAL_PRICE_NOTE =
  "El precio final se cierra por escrito después de conocer tu proyecto, antes de empezar.";
```

No tax wording: the other one-off project prices of the site ("149 €", "399 €", "999 €") carry none (AC 9). "Un mes de soporte tras el lanzamiento" is the same literal as the design-web plans.

### Data: `tiendaOnline` changes (`src/data/services.ts`)

Import: `import { STORE_FROM, STORE_FINAL_PRICE_NOTE, storeIncludes } from "./store-offer.ts"`. Update the header comment (line 3, "E-commerce: sin precio público") to point at `store-offer.ts`.

- `hero.secondaryCta.label`: "Ver precio y opciones" (href `#precios` unchanged). Title, description, H1 and subtitle unchanged (AC 11; `tienda-online-retarget` guards them).
- `pricing`: `{ from: STORE_FROM, includes: [...storeIncludes], note: STORE_FINAL_PRICE_NOTE }`.
- Benefit 1 keeps its title "Tienda propia, sin comisión de marketplace"; text: "En un marketplace pagas una comisión a la plataforma por cada venta y vendes en un espacio que no es tuyo. En tu tienda no hay comisión de marketplace: pagas la de la pasarela de pago y, si eliges Shopify, su cuota mensual directamente a Shopify." Benefits 2 and 3 unchanged (benefit 2 describes the panel, now included in all three options).
- Process step 1 text: "Hablamos de tu catálogo y de cómo vendes, y eliges entre WooCommerce, Shopify o una tienda a medida. De ahí sale el alcance real de tu proyecto." Steps 2-4 unchanged.
- FAQ, in the current order, only these answers change (question texts unchanged except the platform one):
  - "¿Cuánto cuesta una tienda online en Sevilla?": `` `Una tienda online básica cuesta desde ${STORE_FROM}, con el panel de gestión incluido, en WooCommerce, Shopify o a medida, como prefieras. Incluye el diseño adaptado a tu marca, una pasarela de pago con tarjeta, envíos sencillos, la carga de hasta unos 20 productos, una sesión de formación y un mes de soporte.\n\nEl precio final se cierra por escrito después de conocer tu proyecto, antes de empezar. Redsys o Bizum, los catálogos grandes, los envíos por peso o zona y las conexiones con otros sistemas se presupuestan aparte.` ``
  - "¿Qué pasarelas de pago se pueden integrar en mi tienda online?": "Una pasarela de pago con tarjeta, como Stripe, va incluida en el precio de partida. Redsys, la pasarela de los bancos españoles, y Bizum se presupuestan aparte.\n\nCada pasarela cobra su propia comisión por venta, que pagas tú directamente a la pasarela, no a mí. Te ayudo a elegir la que encaja con tus clientes."
  - Platform question becomes "¿WooCommerce, Shopify o una tienda a medida?": `` `Las tres parten del mismo precio, desde ${STORE_FROM}, y eliges tú. Shopify es la más rápida de poner en marcha y no te ocupas del hosting, pero pagas a Shopify una cuota mensual. WooCommerce funciona sobre WordPress, tiene miles de extensiones y el hosting y el dominio quedan a tu nombre.\n\nUna tienda a medida, por ejemplo con Next.js y Supabase, lleva solo lo que necesitas y también queda a tu nombre. Si dudas, lo vemos en la llamada según lo que vendes.` `` (no Wix mention.)
  - "¿Quién sube los productos a la tienda una vez está lista, tú o yo?": "La carga inicial de hasta unos 20 productos, con variantes simples de talla o color, la hago yo y va incluida. Después, tú añades productos, cambias precios o marcas algo como agotado desde el panel de gestión: te enseño en una sesión de formación.\n\nSi tienes un catálogo grande o necesitas importar muchos productos de golpe, esa carga se presupuesta aparte."
  - "¿La tienda gestiona el envío y el stock sola, o eso lo tengo que hacer yo?": keep the first two sentences; replace the last one with "Los envíos con tarifa plana o recogida en tienda van incluidos; los envíos por peso o zona y las integraciones con transportistas se presupuestan aparte."
- The other five FAQs and the `cta` stay. Developer check: no remaining sentence in `tiendaOnline` contradicts the offer (guarded by the test below).

### Page: pricing slot (`src/pages/tienda-online-sevilla.astro`)

Add `<SectionContainer slot="pricing" id="precios">` with `TitleSection` (`CodeIcon`, `tiendaOnline.sectionTitles.pricing` "Cuánto cuesta una tienda online en Sevilla", unchanged) and `<StoreOffer from={STORE_FROM} options={storeOptions} includes={storeIncludes} quotedSeparately={storeQuotedSeparately} note={STORE_FINAL_PRICE_NOTE} />`. The two existing page blocks stay, with one sentence changed. In the "¿Ya vendes por Instagram o WhatsApp...?" block, the third paragraph "Una tienda online propia resuelve los dos casos: cobras de forma automática y segura, tu catálogo queda ordenado y no dependes de una plataforma de terceros para seguir vendiendo." becomes "Una tienda online propia resuelve los dos casos: cobras de forma automática y segura, tu catálogo queda ordenado y vendes con tu marca, no dentro de un marketplace." The old wording contradicts Shopify being one of the three options. The page is promoted to `main` on a schedule and may ship before NRD-168, so the contradiction is not left in place. The "web para comercios" link paragraph (the reciprocal pair) is unchanged. The "Presupuesto cerrado según tu catálogo" bullet is consistent with the written final price and stays. NRD-168 removes both blocks.

`StoreOffer.astro` (new, `src/components/tienda-online/`, layer app): props only, no data import; legacy page styling (same surfaces as `PricingCard`: `rounded-xl border border-gray-700 bg-gray-800/50`, white price, `text-gray-300` body). Structure: price block ("Desde" + `from`) with the lead "Eliges la plataforma: las tres opciones parten del mismo precio."; a `<ul>` of three option cards (`h3` name, `example` in muted text when present, `recurringCost`), one column under 640 px and three from 640 px; two lists with `h3` "Qué incluye" and "Se presupuesta aparte" (the item with `link` renders its text followed by the link, trailing-slash href); the note; `BookingButton`. No yellow, no "Recomendado" (the client chooses; none is recommended).

### Other mentions

- `disenoWeb` full-website tier `note` (`services.ts` line 115): `` `¿Necesitas una tienda online? Desde ${STORE_FROM}: lo tienes en la página de tienda online.` `` It must not contain "panel" (owner-fact guard of `tests/diseno-web-template.test.js`) nor "se presupuesta aparte". The related row of the page already links `/tienda-online-sevilla/` ("tienda online para vender tus productos"); the tier note is a plain string in `SeoLocalPlans`, so it mentions rather than links. The FAQ "¿Qué presupuesto necesito?" no longer carries a store sentence on `develop`: nothing to change there.
- `comercios` (`src/data/niches.ts`, add `import { STORE_FROM } from "./store-offer.ts"`):
  - line 275 `pricing.note`: `` `¿Quieres vender online con pago y envíos? La tienda online parte de ${STORE_FROM}: lo tienes en la página de tienda online.` ``
  - line 284, second paragraph only: `` `Una tienda online completa con pasarela de pago y envíos parte de ${STORE_FROM}, en WooCommerce, Shopify o a medida; lo tienes explicado en https://nuriaromero.dev/tienda-online-sevilla/. Un catálogo muy grande se presupuesta aparte, y en ambos casos el precio se cierra por escrito antes de empezar.` `` (the "20 productos y uno de 500" sentence goes: it argued that the store has no single price). First and third paragraphs unchanged. The URL-in-answer form follows the existing comercios answer that links `/seo-local-sevilla/`; the page already links the store in content.
  - All ten "panel" occurrences in `niches.ts` stay byte-identical.
- `public/llms.txt` line 15: `- [Diseño de tienda online en Sevilla](https://nuriaromero.dev/tienda-online-sevilla/): Tienda online desde 499 €, con panel de gestión incluido, en WooCommerce, Shopify o a medida, a elegir. El precio final se cierra por escrito según el proyecto.`

### Files

All in layer `app`.

Create: `src/data/store-offer.ts`, `src/components/tienda-online/StoreOffer.astro`, `tests/store-offer.test.js`.

Modify: `src/data/services.ts` (`tiendaOnline` as above, one `disenoWeb` tier note, import, header comment), `src/data/niches.ts` (import and two `comercios` strings), `src/pages/tienda-online-sevilla.astro` (pricing slot), `public/llms.txt` (line 15), `scripts/check-seo-02.mjs` (store Offer assertion), `tests/single-price-source.test.js` (runtime import, store line), `tests/tienda-online-retarget.test.js` ("price logic" test to the new rule).

Unchanged and green: `tests/diseno-web-template.test.js`, `tests/diseno-web-sevilla-intent.test.js`, `scripts/check-seo-07.mjs` (the store row signals, including "Pasarela de pago integrada y probada", stay on the page), `check-seo-15/16/17`.

### Interfaces

```ts
// src/data/store-offer.ts
export const STORE_FROM: string; // "499 €"
export type StoreOptionId = "woocommerce" | "shopify" | "a-medida";
export interface StoreOption {
  id: StoreOptionId;
  name: string;
  example?: string;
  recurringCost: string;
}
export interface StoreScopeItem {
  text: string;
  link?: { label: string; href: string };
}
export const storeOptions: StoreOption[];
export const storeIncludes: string[];
export const storeQuotedSeparately: StoreScopeItem[];
export const STORE_FINAL_PRICE_NOTE: string;

// src/components/tienda-online/StoreOffer.astro
interface Props {
  from: string;
  options: StoreOption[];
  includes: string[];
  quotedSeparately: StoreScopeItem[];
  note: string;
}
```

### Data

No storage or migration. Store price 399 -> 499 (owner decision); Service Offer price follows; FAQPage follows the rewritten answers and the reworded platform question.

### Test plan (TDD order)

1. Task 1.1, `tests/store-offer.test.js` first (RED: the module does not exist and the data still says 399):
   - source values: `STORE_FROM === "499 €"`, three options named WooCommerce, Shopify, "Tienda a medida" (the last with an example naming Next.js), Shopify's `recurringCost` matches `/cuota mensual/` and "Shopify", the other two match `/hosting/`, `/dominio/`, `/a tu nombre/`; `storeIncludes` has the six items, `storeQuotedSeparately` the four, the last with `link.href === "/automatizaciones/"`; `STORE_FINAL_PRICE_NOTE` matches `/por escrito/` and `/antes de empezar/`. Scenarios "Included list", "Quoted-separately list and note" (data part).
   - single literal: walking `src/**/*.{ts,astro}`, the string "499 €" occurs only in `src/data/store-offer.ts`. Scenario "No hand-written store figure".
   - `tiendaOnline` (runtime import of `services.ts`): `pricing.from === STORE_FROM`, `pricing.includes` deep-equals `storeIncludes`, `pricing.note === STORE_FINAL_PRICE_NOTE`; the `tiendaOnline` block of `services.ts` source has no "€".
   - copy guards over every string of `tiendaOnline` (JSON walk, sentences split on `[.!?:]` and newlines): no "399"; every `\d+` match is "499" or "20"; no "%"; a sentence with Redsys or Bizum matches `/aparte|presupuest/`; no `/sin (una )?cuota/i`; a sentence with "carga" and "productos" that matches `/presupuest/` also matches `/grande|masiv|muchos/`; price FAQ includes `STORE_FROM`, `/panel/`, `/por escrito/`; a FAQ whose `q` mentions Shopify exists, its answer names WooCommerce, Shopify and "a medida" and does not match `/no (te )?(lo )?ofrezco|no trabajo con shopify/i`. Scenarios "Price answer", "Platform answer", "No contradicting sentence", "No third-party amounts" (data part).
   - `tests/tienda-online-retarget.test.js` "price logic" now asserts the price FAQ interpolates `${STORE_FROM}` in source (no "399 €") and that the llms line starts with `- [Diseño de tienda online en Sevilla]` and contains "desde 499 €" (it is renamed "price logic follows the store offer source"); the llms part of this test lands in task 1.3, so in 1.1 only the FAQ assertion changes.
   - `scripts/check-seo-02.mjs`: on `dist/tienda-online-sevilla/index.html` the Service has exactly one Offer, `price` "499", `priceCurrency` "EUR", no `priceSpecification`. Scenario "One store offer".
     Then implement `store-offer.ts` and the `tiendaOnline` changes.
2. Task 1.2, dist assertions first in `tests/store-offer.test.js` (skip when `dist/` is missing, like `diseno-web-template`), plus the same visible-text assertions in `check-seo-02.mjs` so CI enforces them after the build: the built `<main>` of `/tienda-online-sevilla/` contains "499 €", each option name and `recurringCost`, each `storeIncludes` item, each `storeQuotedSeparately` text, an `<a href="/automatizaciones/">`, and the final-price note; source assertions: the page imports `storeOptions`, `storeIncludes` and `storeQuotedSeparately` from the store offer source and writes none of their texts itself; no file under `src/components/tienda-online/` imports from `@/data` (props only). These assertions name no component on purpose: NRD-168 replaces `StoreOffer.astro` and must keep this test green unchanged. Scenarios "Three options with their recurring cost", "Lists read from the source", "Quoted-separately list and note". Then build the component and the slot.
3. Task 1.3, first: `tests/single-price-source.test.js` refactor (import `services` from `src/data/services.ts`, collect `pricing.from`, `pricing.initial?.from` and `tiers[].from` per slug; same assertions) and a new test "llms.txt: the store line follows the store offer source" (contains `desde ${STORE_FROM}`, "panel de gestión", WooCommerce, Shopify, "a medida"; no "se presupuesta según el catálogo"); `tienda-online-retarget` llms assertion moved to the new rule; `tests/store-offer.test.js` adds: `disenoWeb` full-website tier note includes `STORE_FROM` and "tienda online" and matches neither `/presupuesta aparte/` nor `/panel/`; `comercios.pricing.note` and the second paragraph of the comercios price FAQ include `STORE_FROM` and "/tienda-online-sevilla/" or "tienda online", and no comercios string matches `/tienda online[^.]*se presupuesta (aparte|según)/i`; `niches.ts` still has exactly ten "panel" matches. Scenarios "llms.txt line follows the source", "Design-web plan note", "Commerce niche page", "Store mention reads the store offer source". Then edit the three files.
4. Every task: `node --test tests/*.test.js`, `pnpm build`, `pnpm check:seo:dist` green (02, 07 near-duplicates with the reworded platform question, 16, 17).

### Real-browser / e2e checks (QA)

- `/tienda-online-sevilla/` at 375, 768 and 1280 px: pricing section shows "Desde 499 €", three option cards (stacked under 640 px), both lists and the note; no horizontal scroll; keyboard reaches the automatizaciones link and the booking button with a visible focus ring.
- `/diseno-web-sevilla/` plans: the full-website note reads the store price; `/web-para-comercios-sevilla/`: pricing note and the price FAQ answer.
- Rich Results Test (or schema validator) on the built store page: Service with one Offer 499 EUR, FAQPage valid.

### ADRs relied on

0003 (src/data single source), 0004 (JSON-LD through `serviceSchema`), 0005 (llms.txt and checks), 0006 (node:test, TDD), 0008 (Spanish copy). No new ADR: a per-offer data module under `src/data` is an application of ADR 0003, not a new pattern.

## Risks / Trade-offs

- [The legacy pricing block is replaced again by NRD-168 days later] -> kept to one small props-only component; NRD-168 deletes it. If the scheduled promotion ships this story alone, production still shows the correct offer.
- [Reworded platform question trips the niche-vs-service near-duplicate check] -> "¿WooCommerce, Shopify o una tienda a medida?" shares no trigram with the comercios questions; `check-seo-07` runs in every task.
- [Shopify fee wording read as a promise about Shopify's terms] -> only "la cuota mensual de la plataforma la pagas tú directamente a Shopify", no amount, no plan name.
- [Runtime import in `single-price-source.test.js` breaks if a data module gains an `@/` value import] -> data modules import siblings with relative `.ts` paths (this design, `local-trust.ts`); the test failure would point at it.
- [Diseño-web owner-fact guard] -> the tier note avoids "panel"; the store page's own panel claim is the store offer, not a website claim.
- Size: three work units for 5 points; no size concern.

## UI spec

Scope: the pricing section of `/tienda-online-sevilla/` (`#precios`), rendered by the new `src/components/tienda-online/StoreOffer.astro` inside the page's `pricing` slot. The page is still on the legacy gray world (`ServiceLayout` without `variant="template"`, see DESIGN.md "Known Drift"), so this section uses the legacy utilities of `src/components/services/PricingCard.astro`, `BenefitsGrid.astro` and `ProcessSteps.astro`, not the ink tokens of `src/styles/template.css`. NRD-168 replaces it with the template world; nothing here should anticipate that.

Mode: persuade. The visitor compares a closed price (persona 3); success is reading the price, seeing that the platform is their choice at the same price, knowing what is and is not inside, and booking a call.

### StoreOffer section (`#precios`)

**1. Screens and layout.** One section, the existing slot position of `ServiceLayout` (after the process steps, before the "Por qué elegir a alguien que programa" block, FAQ, related, closing). Wrapper: `src/components/SectionContainer.astro` with `id="precios"` (keeps `scroll-m-20` for the hero link "Ver precio y opciones"); heading: `src/components/TitleSection.astro` with `<CodeIcon class="size-7" />` (`src/components/icons/Code.astro`) and `tiendaOnline.sectionTitles.pricing`, exactly as the legacy default slot renders it. Inside `StoreOffer`, top to bottom, separated by `mt-8` between regions:

1. Price block (no card): `<p>` holding `<span class="block text-gray-300">Desde</span>` and `<span class="block text-4xl font-bold text-white">{from}</span>`, then the lead `<p class="mt-3 max-w-prose text-gray-300">Eliges la plataforma: las tres opciones parten del mismo precio.</p>`. Assumption: the price block is plain text, not a card, so the option cards below are not nested inside another card (DESIGN.md "Don't nest a card inside a card") and the figure reads as the section's anchor.
2. Options: `<ul aria-label="Opciones de plataforma" class="grid gap-4 sm:grid-cols-3">`, one `<li>` card per option in source order (WooCommerce, Shopify, Tienda a medida).
3. Scope lists: `<div class="grid gap-8 md:grid-cols-2">` with two blocks, "Qué incluye" first, "Se presupuesta aparte" second.
4. Note: `<p class="text-sm text-gray-400">{note}</p>`.
5. CTA: `src/components/BookingButton.astro` with its default label ("Reserva una primera sesión"), `mt-6` above it.

**2. Hierarchy.** Primary information: "Desde 499 €" (largest type in the section). Secondary: the three equal options, then what is included. Tertiary: what is quoted apart and the written-price note. Primary action: the booking button, last, after everything the visitor needs to decide. Reading order equals DOM order equals visual order at every width.

**3. States.** Static, build-time content: no loading, error, success or disabled states (n/a). Data-driven variations only:

- An option without `example` renders no example line (no empty gap); currently only "Tienda a medida" has one.
- A `quotedSeparately` item without `link` renders text only; with `link`, see Interactions.
- Empty arrays are not a supported state (the data module always holds 3 / 6 / 4 items, guarded by `tests/store-offer.test.js`); the component does not render placeholders for them.

**4. Copy.** All visible strings come from props (`src/data/store-offer.ts`) except these, fixed in the component:

- "Desde" (same word as `PricingCard`).
- Lead: "Eliges la plataforma: las tres opciones parten del mismo precio." (fixed by the design above).
- `h3` "Qué incluye" and `h3` "Se presupuesta aparte" (fixed by the design above).
- Options list accessible name "Opciones de plataforma". Assumption: the `<ul>` has no visible heading of its own, so it needs a name for screen-reader list navigation.
- The link label "Ver automatizaciones" comes from data (`storeQuotedSeparately[3].link.label`).
  No "Recomendado", no badge, no tax wording, no other figure.

**5. Design system reuse.**

- Option card surface: `rounded-xl border border-gray-700 bg-gray-800/50 p-5` (the `PricingCard` surface; Assumption: `p-5` instead of `p-6` so three cards keep about 150 px of text width at 640 px).
- Option name: `<h3 class="text-lg font-semibold text-gray-100">` (the `BenefitsGrid` / `ProcessSteps` card title).
- Example: `<p class="mt-1 text-sm text-gray-400">{example}</p>`. Recurring cost: `<p class="mt-3 text-sm text-gray-300">{recurringCost}</p>`. Assumption: muted text uses `text-gray-400`, not the `text-gray-500` of `PricingCard` notes, because gray-500 on the card surface falls under 4.5:1 for small text; the same applies to the note.
- List headings: `<h3 class="mb-3 text-lg font-semibold text-gray-100">`.
- "Qué incluye" items: the legacy check row `<li class="flex gap-x-2">` with `<span class="text-green-400" aria-hidden="true">✓</span>` and `text-gray-300`, in a `<ul class="space-y-2 text-gray-300">` (as in `PricingCard` and the page's own block).
- "Se presupuesta aparte" items: same row structure, marker `<span class="text-gray-500" aria-hidden="true">+</span>`. Assumption: a different, neutral marker so a quoted-apart item never reads as included (no green check, no red cross: nothing here is a negative).
- Link: `text-blue-400 underline underline-offset-4 hover:text-blue-300` (legacy text link, as in `src/components/AboutMe.astro`).
- No yellow, no `border-2`, no shadow, no icons inside cards (no brand logos: there is no Shopify or WooCommerce icon in `src/components/icons/`, and a WordPress logo would mislabel WooCommerce).
- New component: `StoreOffer.astro` is new by design (Tech Lead decision); it is a composition of the pieces above, no new token or pattern.

**6. Responsive.**

- 320-639 px: one column throughout; options stacked as three full-width cards; lists stacked; price `text-4xl` fits ("499 €"); `BookingButton` hides "primera" under 370 px by its own rule. No horizontal scroll.
- 640 px and up: options in three equal columns (`sm:grid-cols-3`, gap 1rem); lists still stacked.
- 768 px and up: lists side by side (`md:grid-cols-2`, gap 2rem); the section is capped by `SectionContainer` (`md:max-w-2xl`, `lg:max-w-4xl`).
- Cards in a row stretch to equal height (grid default); their text stays top-aligned.

**7. Interactions.**

- Non-interactive cards: no hover, no pointer, no transition.
- The item with `link` renders its `text` on the first line and the link on its own line below it (`<a class="mt-1 block w-fit ...">` inside the text span), trailing-slash `href="/automatizaciones/"`, same tab. Assumption: a separate line avoids punctuation between a period-less item and the label.
- Link focus: `rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400`. Booking button keeps its own ring and opens in a new tab (existing behaviour).
- No section animation beyond the existing `SectionContainer` reveal (already gated by `prefers-reduced-motion`).

**8. Accessibility hand-off.**

- Headings: section `h2` (TitleSection), then `h3` per option name and per list; no other heading levels.
- Focus order inside the section: "Ver automatizaciones" link, then the booking button. Nothing else is focusable.
- Markers (`✓`, `+`) and `CodeIcon` are `aria-hidden="true"`; the list headings carry the meaning.
- "Desde" and the price sit in one `<p>` so it is read as "Desde 499 €".
- No async content: no live regions needed.

### Hero secondary link (`tiendaOnline.hero.secondaryCta`)

Only the label changes to "Ver precio y opciones" (fixed by the design above); `href="#precios"`, placement and styling in `src/components/services/ServiceHero.astro` unchanged. n/a for the rest of the checklist.
