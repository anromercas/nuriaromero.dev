# Design

## Context

See proposal.md (Why). State on `develop` (b6da86a):

- Every in-focus service page is on the template (M4): `ServiceLayout variant="template"` plus the NRD-163 components in `src/components/seo-local/`. The closest precedent is `src/pages/inteligencia-artificial.astro` (NRD-169): `SeoLocalHero` + page drawing + `ProofStrip`, `ReviewBento` with six `BentoTile`, `SeoLocalProcess`, `SeoLocalAgencia`, one-plan `SeoLocalPlans`, `SeoLocalFaq`, `SeoLocalRelated`, `SeoLocalClosing` + `SeoLocalNap`; copy in `src/data/services.ts`, small arrays (`tiles`, `plan`, `proofItems`, `comparisonItems`) in the page.
- `DESIGN.md` "The Editorial Hero Rule" (PR #97, D4): every page uses `SeoLocalHero`; `ServiceHero` is never chosen or offered.
- Price: `seoLocal.pricing.tiers` holds "Local Pro" `from: "500 €/mes + IVA"` and its eight `includes`; `tierFrom(service, name)` (`src/data/services.ts:21`) already serves the home, `/contacto/` and `/seo-local-sevilla/`. `seoLocal.pricing.note` holds the published "Se factura mes a mes y no hay cuota de puesta en marcha aparte."
- JSON-LD: `ServiceLayout` always calls `serviceSchema({ ..., price: page.pricing.from })`, and `serviceSchema` (`src/lib/schema.ts:113`) always emits `offers` (one Offer from `price`, or one per tier when `offersFromTiers`). There is no way today to publish a Service without an Offer.
- Menu: `services` builds the header dropdown (`src/components/Header.astro:43`) and the footer list; `focusServices` builds the 404 links and is pinned to six slugs by `tests/not-found-page.test.js` and used by `scripts/check-seo-19.mjs`.
- Guards that see the new page: `check-seo-06` (link rows, trailing slash), `check-seo-07` (intent rows and keyword ownership on `dist/`), `check-seo-08` (FAQ details vs FAQPage), `check-seo-11` (Service provider/areaServed), `check-seo-17` (template pages), `check-seo-19` (404), `check-seo-20` (og:url), `tests/seo-meta-titles.test.js` (parses every `export const ... seo: { title, description }` block), `tests/single-price-source.test.js`.
- Robots policy (`astro.config.mjs`): `*`, GPTBot, OAI-SearchBot, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Google-Extended allowed. JSON-LD on service pages: LocalBusiness and WebSite (global, `Layout.astro`), Service, FAQPage, BreadcrumbList. `public/llms.txt` exists.
- Current word counts on a local build of 2026-11-17: `/inteligencia-artificial/` 846 of 850, `/` 1013 of 1100 (relevant to NRD-25, which adds pills there).

## Goals / Non-Goals

**Goals:**

- A commercial page that owns "SEO para IA" nationally, on the template with the editorial hero, about 800 words, six sourced FAQ items, Local Pro as the only price, no own Offer, nothing promised or invented.
- The page reachable from the menu, footer and 404 from day one (the data entry does it), so it is not an orphan before NRD-25.

**Non-Goals:**

- Link rows, intent and ownership registry, `llms.txt` (NRD-25); `check-seo-21` (NRD-26); tool or vendor names of the D3 method; any price of its own.

## Decisions

**Approach.** Same data-driven pattern as `/inteligencia-artificial/`: copy lives in a new `seoParaIa: ServicePageData` entry placed right after `seoLocal` in `src/data/services.ts`; the page composes the NRD-163 components through `ServiceLayout variant="template"` slots, with the editorial `SeoLocalHero` and a new page drawing. The price is read, never written: `pricing.from` and `pricing.includes` come from the Local Pro tier of `seoLocal` through a new exported `pricingTier()` helper (`tierFrom` delegates to it), and `pricing.note` is `seoLocal.pricing.note`. The Service JSON-LD drops its Offer through a new opt-out `ownOffer: false` on the entry, read by `ServiceLayout`; `serviceSchema` accepts a missing `price` and omits `offers` only when neither a price nor tiers are given, so every existing page renders the same JSON-LD (same keys, same order: `offers` stays last).

1. **No own Offer instead of an Offer at 500.** D1 = A says the work has no price of its own; an Offer on `/seo-para-ia/` with the Local Pro price would publish a product that does not exist (story: "no emite un Offer propio inventado"). The visible plan card is the Local Pro plan, labelled as such, so GEO-4 coherence holds: the page shows a plan of another service and the JSON-LD does not claim it as this Service's offer.
2. **Menu, footer and 404.** ADR 0013 ("Menu and breadcrumbs") assigns the menu entry to NRD-24 through the data entry; PRD section 5 lists the page as in focus. `seoParaIa` goes right after `seoLocal` in both `services` and `focusServices`; `tests/not-found-page.test.js` moves from six to seven slugs. Label (`breadcrumbName`): "SEO para IA".
3. **National scope.** Title, description and H1 carry "SEO para IA" and no "Sevilla" (SEO-1 "alcance nacional", ADR 0013: GEO-1 SERP has no Seville-local result). The local entity still shows in the NAP block and the global LocalBusiness JSON-LD. `serviceSchema` keeps the shared `areaServed` (Sevilla) because it is the site-wide service area of the business; changing it is out of scope.
4. **The home link lives in the page, not in the link map.** The single `<a href="/">consultor SEO en Sevilla</a>` goes in the `SeoLocalProcess` byline, exactly as on `/seo-local-sevilla/` (`src/pages/seo-local-sevilla.astro:204`), so this story can test it. NRD-25 MUST NOT add a `/` row to `internalLinksBySource["/seo-para-ia/"]` (it would be a second home link).
5. **Six bento tiles.** `ReviewBento` has six areas (a-f). The plan's five "qué trabajo" items become six by splitting "acceso para los rastreadores" into robots access (d) and the `llms.txt` index (e); `llms.txt` is described as a support index, never as something that makes an assistant cite you.
6. **No "en qué se diferencia" section and no "para quién es" section.** The difference with classic SEO is FAQ 2 and the local service is reached through the related pill (NRD-25); "para quién" folds into the hero subtitle. Both cuts are needed for the word budget. The slot that would have held the comparison holds "Esta web aplica lo que te propongo" through `SeoLocalAgencia` (lead plus text items), which is the page's only proof besides the experience and the live rating.
7. **D3 method in steps 1 and 4 (revised 2026-11-17 after the UI spec).** The owner answered D3 on NRD-24 (comment of 2026-11-17 10:59; plan wording in PR #99, open, docs only). The decision is the owner's and needs no merge to be valid, so this story uses it instead of the generic wording: step 1 = a fixed set of questions about your sector and area asked to the main AI assistants, what they know, what is missing or contradicts itself, plus a check that crawlers can enter and the site is understood; step 4 = every month the same questions are repeated, results and visits from assistants are compared, and you receive a report with what changed and the next step. "Cada mes" and "informe" are now published facts of the method; tool and vendor names (geo-optimizer-skill, DataForSEO) and internal figures (10-15 questions, 3-5 runs, GA4) stay off the page (no digits, digit whitelist unchanged), and no step promises a mention or position. No cycle diagram in the process `aside`: the four steps already say it and the word budget has no room.
9. **Local Pro includes without "Todo lo incluido en Local" (revised after the UI spec).** The Local plan is not shown here, so that item points to nothing. `seoParaIa.pricing.includes` = the Local Pro tier `includes` without items starting "Todo lo incluido en" (filtered in `src/data/services.ts`, still read from the tier, no copied strings), and the plan lede says in words that Local Pro also covers your Google profile work (the Local plan), with no extra link (the related pill to `/seo-local-sevilla/` arrives with NRD-25). Seven items, about 8 words fewer.
10. **One CTA label (revised after the UI spec, SEO-5).** Every booking button on the page says "Reservar una llamada", as on `/seo-local-sevilla/`: `hero.primaryCtaLabel: "Reservar una llamada"` (passed to `SeoLocalHero` as `primaryCtaLabel`), `plan.ctaLabel = seoParaIa.hero.primaryCtaLabel`, FAQ and closing keep their default "Reservar una llamada". The BookingButton default "Reserva una primera sesión" is not used on this page.
8. **Word budget 750-850** (story: about 700-850, design fixes it). The related pills arrive with NRD-25 (about 25-30 words), so this story lands at 780-815 words measured by `check-seo-17` and reports the count in the PR. Above 815, trim in this order and stop when it fits: (1) the last sentence of FAQ answers, never the first sentence, never the "nadie puede prometerte" sentence of answer 4 and never the price sentence of answer 6; (2) the `text` of the "Esta web aplica" items down to a short clause; (3) the plan lede down to its first sentence; (4) the closing text down to its first sentence. Tiles, steps and FAQ items are never removed. Below 780, lengthen FAQ answers 2, 3 and 5 first.

Alternatives considered: `ServiceHero` or a new `SeoParaIaHero.astro` (rejected by D4 and the Editorial Hero Rule); an Offer at the Local Pro price (rejected, decision 1); making `pricing.from` optional in `ServicePageData` (rejected: the legacy `PricingCard` and several pages read it; an opt-out flag touches one call site); a separate `/seo-para-ia/` plan with its own includes (rejected: D1 = A); typing "500 €/mes + IVA" in the entry (rejected: single source, `tests/single-price-source.test.js` spirit and invariant "Data lives in `src/data`").

### Section map (reference order)

| #   | Slot             | Component                                                                    | Content source                                                                                                                                                                                                                                                                       |
| --- | ---------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `hero`           | `SeoLocalHero` + `AiAnswerMock` + `ProofStrip`                               | `keyword=seoParaIa.hero.h1`, `title={ text: hero.title, accent: hero.titleAccent }`, `subtitle=hero.subtitle`, `secondaryLink` from `hero.secondaryCta` (`#que-trabajo`), `<AiAnswerMock slot="visual" />`; proof `[SITE_PROOF[0], rating?]` exactly as `/inteligencia-artificial/` |
| 2   | `benefits`       | `SectionContainer id="que-trabajo"` > `ReviewBento` + 6 `BentoTile`          | `keyword=sectionTitles.benefits`; tiles from `benefits` in order; `<SeoIaTileArt kind=... />`; areas a-f, f `row`                                                                                                                                                                   |
| 3   | `process`        | `.band` > `SeoLocalProcess id="proceso"`                                     | `keyword=sectionTitles.process`, four `process` steps, `byline` slot with the only home link (decision 4)                                                                                                                                                                           |
| 4   | `before-pricing` | `SectionContainer` > `SeoLocalAgencia id="esta-web"`                         | keyword "Esta web aplica lo que te propongo", four items in the page (`thisSiteItems`), link "Ver el precio" to `#precios`                                                                                                                                                         |
| 5   | `pricing`        | `.band` > `SeoLocalPlans`                                                    | `keyword=sectionTitles.pricing`, `tiers={[plan]}` with `plan = { name: "Local Pro", from: seoParaIa.pricing.from, includes: seoParaIa.pricing.includes ?? [], note: seoParaIa.pricing.note, ctaLabel: seoParaIa.hero.primaryCtaLabel }`, `lede` slot with `<strong>{seoParaIa.pricing.from}</strong>` and the Local plan covered in words (decision 9)                       |
| 6   | `faq`            | `SeoLocalFaq`                                                                | `keyword=sectionTitles.faq`, six `faqs`                                                                                                                                                                                                                                              |
| 7   | `related`        | `SeoLocalRelated`                                                            | `internalLinksBySource[seoParaIa.slug] ?? []` (empty until NRD-25; the component renders nothing for an empty list)                                                                                                                                                                 |
| 8   | `closing`        | `SeoLocalClosing` + `AiAnswerMock animate={false}` (or none) + `SeoLocalNap` | `cta.title`/`cta.text`; closing keyword "Reserva una llamada sobre SEO para IA"; NAP keyword "SEO para IA desde La Rinconada, Sevilla"                                                                                                                                              |

Display titles, accents, drawings and exact tile/step/item sentences are fixed by the UI spec (ux-designer, impeccable). The strings below are fixed by this design (tested); drafts marked "draft" may be shortened by the UI spec within the same meaning.

### Fixed copy (`seoParaIa`)

- `slug` `/seo-para-ia/`; `breadcrumbName` "SEO para IA"; `ownOffer: false`.
- `seo.title` (48): "SEO para IA y GEO: que la IA entienda tu negocio". Plain string literal on one line (parsed by `tests/seo-meta-titles.test.js`).
- `seo.description` (158): "SEO para IA (GEO): preparo la información de tu negocio para que ChatGPT, Gemini y los resúmenes con IA de Google la entiendan y puedan citarla. Sin promesas." Plain string literal.
- `hero.h1` (62): "SEO para IA: que ChatGPT, Gemini y Google entiendan tu negocio".
- `hero.subtitle` (draft): "Preparo la información de tu negocio para que ChatGPT, Gemini o los resúmenes con IA de Google la entiendan y puedan citarla. Es el SEO para IA, también llamado GEO, y va incluido en el plan Local Pro." First sentence answers what (GEO-1).
- `hero.secondaryCta`: `{ label: "Ver qué trabajo", href: "#que-trabajo" }`.
- `sectionTitles`: benefits "Qué trabajo para que una IA entienda tu negocio"; process "Cómo trabajamos el SEO para IA"; pricing "Cuánto cuesta el SEO para IA"; faq "Preguntas frecuentes sobre SEO para IA". These four strings and `hero.h1`/`seo.title` are the signals NRD-25 copies into the intent row.
- `benefits` (six, draft sentences, one each): a "Datos que no se contradicen" (name, services, area, hours and prices say the same on your web, your Google profile and your profiles); b "Respuestas directas" (every page and FAQ answers in its first lines); c "Datos estructurados" (schema.org markup for business, services, questions and breadcrumbs); d "Acceso para los rastreadores" (robots.txt does not block assistants' crawlers); e "Un índice llms.txt" (a file listing your most useful pages, as support); f "Señales fuera de tu web" (complete Google profile, linked profiles and real reviews that confirm who you are).
- `process` (four, draft): "Revisión de cómo te ven hoy" (what information about you assistants find today, what is missing and what contradicts itself); "Plan de prioridades" (what to fix first and why, without jargon); "Implementación" (texts, FAQ, structured data and access on your web and profile); "Seguimiento" (every month the same questions are repeated, results and visits from assistants compared, and a report with what changed and the next step). D3 method per decision 7, PR #99 wording as the base; no tool or vendor name, no digit.
- `hero.primaryCtaLabel`: "Reservar una llamada" (decision 10).
- `pricing`: `{ from: LOCAL_PRO_TIER.from, includes: LOCAL_PRO_TIER.includes.filter((item) => !item.startsWith("Todo lo incluido en")), note: seoLocal.pricing.note }` with `const LOCAL_PRO_TIER = pricingTier(seoLocal, "Local Pro")` after `seoLocal` (decision 9).
- `cta` (draft): title "Veamos qué sabe hoy una IA de tu negocio"; text "En una llamada revisamos qué información tuya hay y cuál sería el siguiente paso útil."

### FAQ (GEO block, six items, sourced)

Answers about 30-35 words, first sentence direct (at most 220 characters), `tú`, one paragraph each, no links. Sources: `.claude/state/seo/questions/2026-11-16.md` "Bloque GEO (`posicionamiento en ia`)" (DataForSEO SERP, Seville, es, desktop, 2026-11-16) and `docs/seo-audit/keyword-clusters-2026-11.md` (S1 2026-11-13, S3 2026-11-15).

1. "¿Qué es el SEO para IA o GEO?" (AI Overview of `posicionamiento en ia` defines GEO/AEO; top result titles, 2026-11-16 and S3 2026-11-15): preparing your business information so that assistants such as ChatGPT, Gemini or Perplexity, and Google's AI summaries, can understand it and cite it when it fits; GEO (Generative Engine Optimization) is the technical name.
2. "¿En qué se diferencia el SEO para IA del SEO tradicional?" (featured snippet of the top result, 2026-11-16): classic SEO aims at the results list; SEO for AI makes sure an assistant writing an answer finds clear data about you; it is built on top of a well-made web.
3. "¿Es lo mismo GEO que AEO?" (AI Overview defines GEO and AEO, 2026-11-16; S3): nearly; AEO focuses on direct answers, GEO on engines that generate answers with AI; in practice they are worked together, and here both are called SEO para IA.
4. "¿Cómo hago que ChatGPT recomiende mi negocio?" (ads and videos cited in the AI Overview, 2026-11-16): first sentence exactly "Nadie puede prometerte que un asistente recomiende o cite tu negocio: no lo controlas tú ni lo controlo yo." then what can be done (clear, consistent, citable information). DEL-5.
5. "¿Qué hay que trabajar para aparecer en las respuestas de IA?" (AI Overview topics: question-answer structure, E-E-A-T, schema Organization/Service/FAQPage, third-party mentions, entities, 2026-11-16): the six bento points in one answer, without promising appearance.
6. "¿Cuánto cuesta el SEO para IA?" (commercial intent: agency service pages and paid ads on `posicionamiento en ia`, S3 2026-11-15, and `geo posicionamiento ia`, S1 2026-11-13): `` `El SEO para IA va incluido en el plan Local Pro, que cuesta ${LOCAL_PRO_TIER.from}.` `` then the published billing note (month to month, no separate set-up fee).

Left out: PAA "¿Cómo atraer clientes con IA?", "¿Qué IA es buena para marketing?", "¿Cuáles son las 3 IA más usadas?" (different intent or an unverifiable ranking claim); measurement and timing (no sourced question; the D3 method is described in the process instead).

### "Esta web aplica lo que te propongo" (`thisSiteItems` in the page, draft)

Four `SeoLocalAgencia` items (`lead` bold + `text`): FAQ with the answer first ("como las de esta página"); structured data for business, service, questions and breadcrumbs; a public `llms.txt` with the index of the main pages; crawlers of ChatGPT, Claude, Perplexity and Gemini allowed to read the site. Assistant-to-agent map tested against `astro.config.mjs`: ChatGPT -> GPTBot and OAI-SearchBot; Claude -> ClaudeBot; Perplexity -> PerplexityBot; Gemini -> Google-Extended. No figure, screenshot or claim about the site's own visibility in assistants.

### Files

All in layer `app`.

Create:

- `src/pages/seo-para-ia.astro`: template slots per the section map; `tiles` (`{ area, kind, layout }`), `plan`, `proofItems`, `thisSiteItems` in the page; imports `seoParaIa` (and nothing that holds a price literal).
- `src/components/seo-ia/AiAnswerMock.astro`: hero figure (shell identical to `src/components/ia/ChatMock.astro` / `src/components/software/AppMock.astro`: `<figure>` with `aria-label`, `<figcaption>Ejemplo ilustrativo</figcaption>`, one SVG `aria-hidden="true" focusable="false"`, stroke 1.5, round caps/joins, no fills, no yellow, at most one `<text>` label with no digit or brand, rendered at 11 px or more at 320 px). Concept for the UI spec: a business data card (rows of soft bars, a small `{ }` hint of structured data) joined by a `signal` line to an assistant answer window whose text is drawn as bars. No logo, ranking, star, badge, number or "recomendado". Completed state is the default CSS; any motion is the scroll-linked rest-to-rest nudge of ChatMock under `prefers-reduced-motion: no-preference` and `@supports (animation-timeline: scroll())`, never hiding content at first paint.
- `src/components/seo-ia/SeoIaTileArt.astro`: `{ kind: "coherencia" | "respuestas" | "schema" | "rastreadores" | "llms" | "senales" }`, one SVG each, same drawing rules as `src/components/ia/AiTileArt.astro` (no `<text>` at all), only the `BentoTile` `signal`/`soft`/`label` classes.
- `tests/seo-para-ia.test.js`.

Modify:

- `src/data/types.ts`: `ownOffer?: boolean` on `ServicePageData`, with an English comment (default true; false means the service has no price of its own and its Service JSON-LD has no `offers`).
- `src/lib/schema.ts`: `serviceSchema` `price?: string`; `offers` computed as today and spread last only when present (`...(offers ? { offers } : {})`). Output for every caller that passes a price is identical.
- `src/layouts/ServiceLayout.astro`: `price: page.ownOffer === false ? undefined : page.pricing.from`.
- `src/data/services.ts`: `export function pricingTier(service, tierName)` (returns the tier, throws like today), `tierFrom` returns `pricingTier(...).from`; `const LOCAL_PRO_TIER = pricingTier(seoLocal, "Local Pro")` after `seoLocal`; `export const seoParaIa: ServicePageData` after it; `seoParaIa` inserted after `seoLocal` in `services` and `focusServices`; header comment of the file mentions the new page and that it has no price of its own.
- `scripts/lib/template-pages.mjs`: `{ route: "/seo-para-ia/", words: [750, 850], service: true }`.
- `tests/not-found-page.test.js`: `SLUGS` gains `/seo-para-ia/` after `/seo-local-sevilla/` (test name "seven in-focus slugs").
- Shared doc (routed to task 2.3, layer `app` owner): `odd/tasks/seo-para-ia-geo-page.md`: mark the stale lines (out-of-scope "opcional T9", architecture A/B with `ServiceHero` and `SeoParaIaHero.astro`, price variant B, T2 "omitir si", T9) as superseded by D4/D1 and by this change, set status "En ejecución (NRD-24, NRD-25, NRD-26)" and point to `openspec/changes/nuriaromero-24-seo-para-ia-page/`.

Written by the TL in this change: `docs/adr/0013-seo-site-architecture.md` (status line, GEO-1 owner-map status, page-verdict row and P1 note: P1 accepted on 2026-11-17).

Unchanged and green: `tests/seo-meta-titles.test.js`, `tests/single-price-source.test.js` (no `llms.txt` line yet), `tests/keyword-ownership.test.js`, `tests/seo-consultor-strategy.test.js`, `check-seo-02` (offers of the ten listed pages), `check-seo-16` (seo-local JSON-LD baseline), `check-seo-07`, `check-seo-19` (404 links now include the new slug through `focusServices`).

### Interfaces

```ts
// src/data/types.ts (ServicePageData)
ownOffer?: boolean // default true; false: no price of its own, Service JSON-LD without offers

// src/lib/schema.ts
export function serviceSchema(service: {
  name: string
  description: string
  url: string
  serviceType: string
  price?: string // omitted: no Offer unless tiers are given
  tiers?: { name: string; from: string }[]
  billing?: "monthly" | "one-time"
  id?: string
}): Record<string, unknown>

// src/data/services.ts
type Tier = NonNullable<ServicePageData["pricing"]["tiers"]>[number]
export function pricingTier(service: ServicePageData, tierName: string): Tier
export function tierFrom(service: ServicePageData, tierName: string): string // unchanged signature
export const seoParaIa: ServicePageData

// src/components/seo-ia/AiAnswerMock.astro
interface Props { animate?: boolean } // default true; false in the closing band
// src/components/seo-ia/SeoIaTileArt.astro
interface Props { kind: "coherencia" | "respuestas" | "schema" | "rastreadores" | "llms" | "senales" }
```

### Data

No storage, schema or settings migration. No price change: the Local Pro price is read from `seoLocal`. New JSON-LD on one new URL: Service without `offers`, FAQPage (six), BreadcrumbList ("Inicio" > "SEO para IA"). Sitemap gains the URL automatically (no `lastmod`, ADR 0005).

### Test plan (TDD order)

All in `tests/seo-para-ia.test.js` unless noted; observe RED before each implementation.

1. Task 1.1 (schema contract): `src/lib/schema.ts` declares `price?: string` and spreads `offers` only when present; `src/data/types.ts` declares `ownOffer?: boolean`; `ServiceLayout.astro` passes `page.ownOffer === false ? undefined : page.pricing.from`; `src/data/services.ts` exports `pricingTier` and `tierFrom` still returns "500 €/mes + IVA" for Local Pro (runtime import of `services.ts`). Regression: `pnpm build && pnpm check:seo-02:dist && pnpm check:seo-16:dist` green (other pages' offers unchanged). Scenario "No own Offer" (other pages part).
2. Task 2.1 (drawings): illustration assertions as `tests/ia-template.test.js` (SVG attributes, no fills, no digits or brands in `<text>`, no "€"/"%", no yellow, `SeoIaTileArt` without `<text>`, six-kind union, `AiAnswerMock` figure `aria-label`, caption "Ejemplo ilustrativo", reduced-motion and `@supports` guards if it animates, one SVG). Scenario "Editorial hero only" (drawing part).
3. Task 2.2 (data and page): runtime `seoParaIa`: slug, title at most 60, description 140-160, "SEO para IA" in title/description/H1, no "Sevilla" in them, no `/consultor/i` or `/seo local sevilla/i` in title, H1 or `sectionTitles`; `ownOffer === false`; `pricing.from === tierFrom(seoLocal, "Local Pro")`; no "€" in the `seoParaIa` source block or the page; six `benefits`, four `process`; `services` and `focusServices` contain it right after `seoLocal`; page uses `variant="template"`, `SeoLocalHero` with `slot="visual"`, never `ServiceHero`/`TitleSection`/`text-gray-`; components in section-map order; exactly one `<a href="/">consultor SEO en Sevilla</a>` in the page and no other "consultor"; crawler map vs `astro.config.mjs` robots policy for every assistant named in `thisSiteItems`; promise regex `/garantiz|primeras posiciones|te sale en|te recomendar|asegur/i` on every `seoParaIa` string and the page copy; digit whitelist (digits only inside the Local Pro price value or "10" of the experience); no `[PENDIENTE`/`[VERIFICAR` under `src/`; `seoParaIa.pricing.includes` has no item starting "Todo lo incluido" and every item is in `LOCAL_PRO_TIER.includes`; `hero.primaryCtaLabel === "Reservar una llamada"`, the page passes it to `SeoLocalHero` and to the plan `ctaLabel`, and the page has no "Reserva una primera sesión"; steps 1 and 4 mention the assistants' questions and the monthly report ("cada mes", "informe") and match no `/dataforseo|geo-optimizer|ga4/i`. Update `tests/not-found-page.test.js` (seven slugs). Scenarios "Placement fields within limits", "No term of the home or the local page", "Sections in reference order", "Editorial hero only", "Price from the Local Pro tier", "Named crawlers are allowed", "One home link", "Listed as an in-focus service", "No promise phrases", "Figure whitelist".
4. Task 2.3 (FAQ and budget): add the template entry, observe `pnpm build && pnpm check:seo-17:dist` RED (route missing or out of range), then FAQ assertions: six items whose questions equal the list above in order; every first sentence at most 220 characters (split as `SeoLocalFaq` does); answer 4 starts with "Nadie puede prometerte"; answer 6 interpolates `${LOCAL_PRO_TIER.from}` in source and renders "500 €/mes + IVA"; then write the copy within 780-815 words. Scenarios "Word budget", "FAQ equals FAQPage", "Direct first sentence", "Recommendation answered without a promise".
5. Every task: `node --test tests/*.test.js`, `pnpm build`, `pnpm check:seo:dist` green; after 2.2 also the built-site checks of scenario "Indexable and in the sitemap" by reading `dist/` once (the permanent guard is NRD-26).

### Real-browser / e2e checks (QA)

- `/seo-para-ia/` at 320, 375, 768, 1024 and 1280 px against the UI spec: no horizontal scroll; hero drawing scales, its label at 11 px or more at 320 px; one-plan card follows the NRD-168 one-plan rule; bento area map from 1024 px.
- First paint with no scroll and with reduced motion: the hero drawing is complete.
- Keyboard: hero booking button, "Ver qué trabajo" (lands on `#que-trabajo` below the fixed header), byline home link, "Ver el precio", plan button, FAQ summaries, closing button; 2 px sky focus ring visible.
- Header dropdown (desktop and mobile menu) and footer show "SEO para IA"; the 404 lists it.
- Rich Results Test / Schema Markup Validator on the built page: Service without Offer, FAQPage with six questions, BreadcrumbList; no errors.
- `dist/seo-para-ia/index.html` view-source: one H1, canonical `https://nuriaromero.dev/seo-para-ia/`, `og:url` equal to it.

### ADRs relied on

0003 (single app layer, `src/data`), 0004 (SEO head and structured data), 0005 (sitemap, robots, `llms.txt`, checks), 0006 (node:test, TDD), 0008 (Spanish copy, English code), 0012 (keyword ownership), 0013 (site architecture, P1, menu), 0014 (template section components), 0015 (word budget of owner text).

## Risks / Trade-offs

- [Word budget with the Local Pro card (seven includes after decision 9) and six FAQ] -> answers about 30-35 words, one-sentence tiles and steps, trimming order in decision 8; this story lands at 780-815 so NRD-25's pills fit.
- [A Service without Offer looks "less complete" to validators] -> `offers` is optional in schema.org Service; publishing a fake own Offer is worse (D1 = A). QA validates no errors.
- [The page reads as a promise to appear in ChatGPT] -> regex test, answer 4's fixed first sentence, drawing without badges or rankings, DEL-5 review.
- [Cannibalisation of `/seo-local-sevilla/`] -> no "SEO local Sevilla" in title, H1 or headings; national scope; ownership rows and anchors in NRD-25; Search Console review after promotion (owner).
- [Menu grows to eight services plus niches] -> accepted by ADR 0013; no reorder beyond placing the page after local SEO.
- [Stale plan lines mislead the developer] -> task 2.3 marks them superseded; this design is the source of truth.
- Size: four work units for 5 points; no size concern.

## UI spec

Author: ux-designer, with `impeccable:impeccable` (shape; established world, so no new visual direction). Visual authority: `DESIGN.md` ("The Annotated Storefront", Editorial Hero Rule) and the built `/inteligencia-artificial/` (`src/pages/inteligencia-artificial.astro`) as the structural twin. Mode: Persuade, with an honesty floor: the page explains a piece of work, it never shows a result. Every string below is Spanish site copy; strings already fixed by "Fixed copy" and "Section map" are repeated only as references and are not changed. Lines marked `Assumption:` are UX calls the design left open.

### Page frame and global rules

- Route `/seo-para-ia/`, `ServiceLayout variant="template"` (`src/layouts/ServiceLayout.astro`): `main.template-ground`, breadcrumbs "Inicio" > "SEO para IA" from the layout, 6rem between slots. Header, footer, WhatsApp button unchanged.
- Rhythm (top to bottom): hero + proof strip (ground) / bento (ground) / process (`.band`) / "Esta web aplica" (ground) / plan (`.band`) / FAQ (ground) / related (ground, empty until NRD-25) / closing band + NAP. No two `.band` wrappers touch, closing stays last.
- Tokens only from `src/styles/template.css` (`--ink-ground`, `--card-surface`, `--drawing-surface`, `--hairline`, `--hairline-quiet`, `--sky-signal`, `--sky-accent`, `--drawing-soft`, `--text-*`) and classes `.tpl-kw`, `.tpl-display`, `.tpl-accent`, `.tpl-link`, `.band`. No Tailwind colour utilities, no `text-gray-`, no new palette, no yellow anywhere on this page (the single plan is not `recommended`; no star rating is drawn).
- Headings: every section through `SectionHeading` (`src/components/seo-local/SectionHeading.astro`): keyword heading (h1 in the hero, h2 elsewhere) plus display paragraph with exactly one serif accent, which is a verbatim substring of the title. Display titles below are the UI spec's; none contains "Sevilla", "consultor", a digit or a word caught by the promise regex.
- Reused components (no change to any of them): `SeoLocalHero`, `ProofStrip`, `ReviewBento`, `BentoTile`, `SeoLocalProcess`, `SeoLocalAgencia`, `SeoLocalPlans`, `SeoLocalFaq`, `SeoLocalRelated`, `SeoLocalClosing`, `SeoLocalNap` (all `src/components/seo-local/`), `SectionContainer` (`src/components/SectionContainer.astro`), `BookingButton` (`src/components/BookingButton.astro`). New: only the two drawings of the design (`src/components/seo-ia/AiAnswerMock.astro`, `src/components/seo-ia/SeoIaTileArt.astro`), built as copies of the shells of `src/components/ia/ChatMock.astro` and `src/components/ia/AiTileArt.astro`. No "New component" beyond them.

### 1. Hero (`hero` slot)

- Composition: `SeoLocalHero` two columns from 768 px (1.05fr copy / 0.95fr drawing), stacked below (copy first, drawing second). `ProofStrip` right under it.
- `keyword` (h1): `seoParaIa.hero.h1` (fixed).
- Display title: `hero.title` "Datos claros que una IA pueda entender", `hero.titleAccent` "pueda entender". Assumption: states the deliverable (clear data) and the honest outcome (understanding), not citation or recommendation; 38 characters keeps the 16ch display to three lines at 320 px.
- Subtitle: `hero.subtitle` as drafted in "Fixed copy" (two sentences, unchanged). Assumption: it already answers "what" in its first sentence and states the Local Pro inclusion; shortening it would lose one of the two.
- Actions: booking button labelled "Reservar una llamada" (`primaryCtaLabel={seoParaIa.hero.primaryCtaLabel}`, decision 10; the `BookingButton` default "Reserva una primera sesión" never appears on this page), then the text link "Ver qué trabajo" -> `#que-trabajo` (fixed).
- Visual slot: `<AiAnswerMock slot="visual" />` (animated variant), with the shared sky halo of `SeoLocalHero`.
- Proof strip: `[SITE_PROOF[0], rating?]` exactly as `/inteligencia-artificial/`: "+10 años / de experiencia" and, when `getGoogleReviews()` returns data, "{rating} en Google / {n} opinión|opiniones". Partial state: without review data the strip shows one cell; never a placeholder, never "2 webs en Sevilla" (not about this service).
- Hierarchy: display title > subtitle > booking button > drawing > proof. The primary action is the booking button; "Ver qué trabajo" is secondary.

#### `AiAnswerMock` drawing (concept for task 2.1)

- Shell identical to `ChatMock`: `<figure class="mock">` on `--card-surface` with 1px `--hairline` and 1.25rem radius; drawing area on `--drawing-surface` with a `--hairline-quiet` bottom rule; `<figcaption>Ejemplo ilustrativo</figcaption>` in `--text-muted` 0.8rem. One SVG, `viewBox="0 0 320 220"`, `fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"`, max-width 26rem, centred.
- `aria-label` of the figure: "Ejemplo de la información de un negocio, ordenada y con datos estructurados, que un asistente de IA usa al escribir su respuesta". Assumption: describes the mechanism, not an outcome.
- Left, the business data card (about x 8-142): rounded rect (rx 12); header row with a small circle (`soft`) and the only `<text class="label">`: "Tu negocio" (15 viewBox units, `--text-secondary`, renders at 11 px or more at 320 px; no digit, no brand); a `soft` divider; four rows of pill bars in `soft` standing for name, services, area and hours, one of them (services) in `signal`; at the card foot a small structured-data hint drawn as two curly braces `{ }` in `signal` around two short `soft` bars.
- Middle, the connector: a dashed `soft` guide (`stroke-dasharray="3 5"`) plus a `signal` line with an arrowhead from the `signal` row of the card to the answer window (left to right; on every width the drawing scales as one image, it never reflows).
- Right, the assistant answer window (about x 170-312): rounded rect (rx 12) with a top bar of three small `soft` circles; a question bubble (`soft` pill, right-aligned); an answer block of three `soft` text bars where the second bar is `signal`, the same length as the card's `signal` row (visual rhyme: the answer reuses your data); a `soft` input pill at the bottom with a `signal` send arrow.
- Never: logos, brand names, stars, rankings, badges, numbers, check marks of approval, "recomendado", yellow, fills.
- Motion: completed drawing is the default CSS. Only when `animate` is true, inside `@media (prefers-reduced-motion: no-preference)` and `@supports (animation-timeline: scroll())`, the group "connector + `signal` answer bar" does the ChatMock rest-to-rest nudge (`translateY` 0 -> -3px -> 0 over `animation-range: 0 220px`, `scroll(root block)`). Nothing is hidden at first paint and no opacity animation. `animate={false}` in the closing band renders the same drawing without the class.

### 2. Bento "Qué trabajo" (`benefits` slot)

- `SectionContainer id="que-trabajo"` (its `scroll-m-20` lands the anchor under the fixed header) > `ReviewBento headingId="que-trabajo-title"` (no own `id`, as on `/inteligencia-artificial/`).
- `keyword`: `sectionTitles.benefits` (fixed). Display title: "Lo que una IA lee de tu negocio", accent "de tu negocio". Assumption.
- Six `BentoTile` in source order, areas a-f, layouts `stack` except f `row`; area map from `ReviewBento` (1024 px: "a a a a b b / c c d d d d / c c e e e e / f f f f f f"; 768-1023: two columns with a and f full width; below 768: one column). Caption under the bento: the default "Ejemplo ilustrativo".
- Tile titles are the fixed `benefits` titles; the sentences below replace the drafts (one sentence each). Assumption for all six sentences (same meaning as the drafts, shortened for the word budget):

| Area | kind | Title (fixed) | Sentence |
| --- | --- | --- | --- |
| a | `coherencia` | Datos que no se contradicen | Nombre, servicios, zona, horario y precios dicen lo mismo en tu web, en tu perfil de Google y en tus redes. |
| b | `respuestas` | Respuestas directas | Cada página y cada pregunta frecuente responde en sus primeras líneas, sin rodeos. |
| c | `schema` | Datos estructurados | Marcado schema.org para tu negocio, tus servicios, tus preguntas y la ruta de cada página. |
| d | `rastreadores` | Acceso para los rastreadores | Tu robots.txt no bloquea a los rastreadores de los asistentes de IA. |
| e | `llms` | Un índice llms.txt | Un archivo con tus páginas más útiles, como apoyo para que los sistemas de IA se orienten. |
| f | `senales` | Señales fuera de tu web | Perfil de Google completo, perfiles enlazados y reseñas reales que confirman quién eres. |

#### `SeoIaTileArt` drawings (concept for task 2.1)

Same rules as `AiTileArt`: one SVG per kind, attributes as above, no `<text>`, no fills, only `.signal` / `.soft` (default stroke is the tile's `--text-muted`), information carried by the tile title and sentence. ViewBoxes follow the area shapes of `AiTileArt`: a, d, e, f `0 0 320 130`; b `0 0 160 130`; c `0 0 160 230`.

- `coherencia` (a, wide): three small panels side by side (a browser frame, a profile card with a map-pin outline, a social card with a round avatar), each with the same three `soft` bars; one `signal` horizontal line runs through the matching middle bar of all three panels.
- `respuestas` (b): a page frame whose first text bar is `signal` and noticeably longer, followed by four shorter `soft` bars; a small `signal` chevron points at the first bar.
- `schema` (c, tall): a pair of large `soft` curly braces enclosing three key-value rows (short `soft` bar + longer `signal` bar); below, a `signal` down arrow to a small graph of three ring nodes joined by lines (one central node in `signal`, two in default stroke).
- `rastreadores` (d, wide): left, a file card with four `soft` lines; middle, an open gate drawn as two posts with one leaf swung open; three small `signal` ring dots travel along a `signal` path through the gate to a page frame on the right. No robot face or icon-font robot.
- `llms` (e, wide): a list card with four rows, each a small `soft` square bullet and a bar, the second row in `signal`; a `signal` arrow from that row to a stack of three offset page frames on the right.
- `senales` (f, row; drawing left at 55% from 768 px): a central ring (the business) with three `signal` spokes to three satellites in default stroke: a map-pin outline, a profile card with avatar circle and two bars, a speech bubble with two `soft` bars (a review, deliberately without stars).

### 3. Process (`process` slot)

- `.band` > `SectionContainer` > `SeoLocalProcess id="proceso" headingId="proceso-title"` with the portrait (default `portrait`, default alt). No `aside` slot: no cycle diagram (decision 7: the four steps already say it and the word budget has no room).
- `keyword`: `sectionTitles.process` (fixed). Display title: "Primero mirar, después corregir", accent "después corregir". Assumption.
- Byline (the only home link, decision 4), exact: `Soy Nuria Romero, <a href="/">consultor SEO en Sevilla</a>, y este trabajo lo hago contigo, sin intermediarios.` Assumption: mirrors the `/seo-local-sevilla/` byline; the monthly rhythm is told by step 4, so the byline does not repeat it; the link inherits the byline's existing link style.
- Steps (fixed titles; sentences replace the drafts, Assumption for the wording; steps 1 and 4 follow the D3 method of decision 7: no tool or vendor name, no internal figure, no digit, no promise of mention or position):
  1. "Revisión de cómo te ven hoy": "Pregunto a los principales asistentes de IA lo que preguntaría un cliente de tu sector y tu zona, anoto qué saben de ti, qué falta y qué se contradice, y reviso que sus rastreadores puedan entrar y entender tu web."
  2. "Plan de prioridades": "Qué corregir primero y por qué, explicado sin tecnicismos."
  3. "Implementación": "Textos, preguntas frecuentes, datos estructurados y acceso, en tu web y en tu perfil."
  4. "Seguimiento": "Cada mes repito las mismas preguntas, comparo los resultados y las visitas que llegan desde los asistentes, y recibes un informe con lo que ha cambiado y el siguiente paso."

### 4. "Esta web aplica lo que te propongo" (`before-pricing` slot)

- `SectionContainer` > `SeoLocalAgencia id="esta-web" headingId="esta-web-title"`, keyword "Esta web aplica lo que te propongo" (fixed). Display title: "Lo puedes comprobar en esta página", accent "en esta página". Assumption.
- `thisSiteItems` (lead in bold + text; Assumption, final wording of the draft):
  1. lead "Preguntas con la respuesta primero." text "Como las de esta página."
  2. lead "Datos estructurados." text "De negocio, servicio, preguntas y ruta de navegación."
  3. lead "Un llms.txt público." text "Con el índice de las páginas principales."
  4. lead "Rastreadores de IA permitidos." text "ChatGPT, Claude, Perplexity y Gemini pueden leer la web."
- Link: "Ver el precio" -> `#precios` (fixed). No figure, screenshot, score or visibility claim.

### 5. Plan (`pricing` slot)

- `.band` > `SectionContainer` > `SeoLocalPlans headingId="planes-title"` (section `id` stays the default `precios`, target of "Ver el precio"). One card: the component's one-plan rule (single left-aligned card, max 36rem, at every width). Not `recommended`: no yellow border, no "Recomendado" badge.
- `keyword`: `sectionTitles.pricing` (fixed). Display title: "Va dentro del plan Local Pro", accent "Local Pro". Assumption.
- Lede slot, exact: `El SEO para IA no tiene precio aparte: forma parte del plan Local Pro, <strong>{seoParaIa.pricing.from}</strong>, que también incluye el trabajo en tu perfil de Google.` Assumption for the wording (decision 9: the Local plan covered in words, no link; renders "500 €/mes + IVA" from data, no literal in the page). Trimming step (3) of decision 8 cuts it to its first sentence, which here is the whole lede, so it is not trimmed.
- Card: h3 "Local Pro", price `pricing.from`, the seven `includes` (Local Pro tier without the "Todo lo incluido en..." item, decision 9) with sky checks, `plan-note` = `pricing.note` ("Se factura mes a mes y no hay cuota de puesta en marcha aparte."), booking button "Reservar una llamada" (`ctaLabel: seoParaIa.hero.primaryCtaLabel`, decision 10). No section-level `note` prop (avoids printing the billing note twice).

### 6. FAQ (`faq` slot)

- `SectionContainer` > `SeoLocalFaq headingId="faq-title"`; two columns from 1024 px with the sticky intro (keyword, display, lede, booking button "Reservar una llamada"), one column below.
- `keyword`: `sectionTitles.faq` (fixed). Display title: "Dudas antes de empezar", accent "antes de empezar". Lede: "Si tu duda no está aquí, la vemos en la llamada." (same as `/inteligencia-artificial/`). Assumption.
- Six native `details`, all closed by default, questions fixed by the design in that order. Answers (Assumption: exact text written to the design's sourced meaning, one paragraph, no links, first sentence is the bold lead that `SeoLocalFaq` splits at the first `. `; trim only per decision 8):
  1. "Es preparar la información de tu negocio para que asistentes como ChatGPT, Gemini o Perplexity, y los resúmenes con IA de Google, la entiendan y puedan citarla cuando encaje. GEO (Generative Engine Optimization) es su nombre técnico."
  2. "El SEO de siempre busca un buen puesto en la lista de resultados; el SEO para IA cuida que un asistente encuentre datos claros sobre ti cuando escribe su respuesta. Se construye encima de una web bien hecha."
  3. "Casi. El AEO se centra en las respuestas directas y el GEO en los buscadores que generan respuestas con IA. En la práctica se trabajan juntos, y aquí a los dos los llamo SEO para IA."
  4. "Nadie puede prometerte que un asistente recomiende o cite tu negocio: no lo controlas tú ni lo controlo yo. Lo que sí se puede hacer es que tu información sea clara, coherente en todas partes y fácil de citar."
  5. "Que tus datos coincidan en todas partes, que tus páginas respondan pronto, los datos estructurados, el acceso de los rastreadores, un índice llms.txt y señales fuera de tu web. Todo eso ayuda a que te entiendan; aparecer no depende solo de ti."
  6. `` `El SEO para IA va incluido en el plan Local Pro, que cuesta ${LOCAL_PRO_TIER.from}. ${seoLocal.pricing.note}` `` (renders "... que cuesta 500 €/mes + IVA. Se factura mes a mes y no hay cuota de puesta en marcha aparte.").
- Interaction: summary row is the whole hit area; the drawn plus loses its vertical stroke when open (existing CSS); focus ring on `summary:focus-visible` (existing).

### 7. Related (`related` slot)

- `SeoLocalRelated links={internalLinksBySource[seoParaIa.slug] ?? []}`. Empty state (this story): the component renders nothing, so the FAQ is followed directly by the closing band; no placeholder, no heading without links. NRD-25 fills it.

### 8. Closing and NAP (`closing` slot)

- `SeoLocalClosing headingId="cierre-title"`, keyword "Reserva una llamada sobre SEO para IA" (fixed); display title `cta.title` "Veamos qué sabe hoy una IA de tu negocio" with accent "qué sabe hoy" (Assumption); text `cta.text` as drafted; default CTA "Reservar una llamada" and default meta "30 minutos · Sin compromiso · Directamente conmigo"; visual `<AiAnswerMock slot="visual" animate={false} />` (static, as `ChatMock` on `/inteligencia-artificial/`). Assumption: "or none" in the section map resolved to the static drawing so the closing band matches its twin.
- `SectionContainer` > `SeoLocalNap headingId="nap-title"`, keyword "SEO para IA desde La Rinconada, Sevilla" (fixed).

### States

- The page is static: no loading, error or form state of its own. Data-driven parts: proof strip (one or two cells, see hero), related links (empty renders nothing), plan (always present: `pricingTier` throws at build if Local Pro is missing, so a broken price never ships). n/a: disabled, optimistic, destructive confirmations.

### Responsive (320 px up; breakpoints 640, 768, 1024 of the template)

- 320-639: everything one column; hero copy then drawing; proof cells stacked with top rules; bento one column, tiles padding 1rem; process portrait above the timeline; plan card full width; FAQ intro above the list. No horizontal scroll: the hero halo is clipped by the existing `.hero-visual` rules and SVGs scale with `width: 100%`.
- 640: proof strip horizontal. 768: hero two columns; bento two columns (a and f full width, f becomes drawing-left row); plan stays one card (max 36rem, left aligned). 1024: bento six-column area map; process portrait column plus timeline; FAQ 0.8/1.2 with sticky intro.
- The hero drawing label stays at 11 px or more at 320 px (15 viewBox units in a 320-unit viewBox inside the card padding).

### Interactions

- Hover/focus inherit from the components: hero text link underline in sky at 70%, `--sky-accent` on hover; booking button one step darker on hover; 2px `--sky-signal` focus outline with 2-4px offset everywhere; transitions 0.2s `cubic-bezier(0.16, 1, 0.3, 1)`.
- Motion budget: the one authored moment is the `AiAnswerMock` nudge in the hero; plus the existing `SectionContainer` view reveal. Nothing else animates.
- "Ver qué trabajo" and "Ver el precio" are in-page anchors (native jump, `scroll-m-20` offsets the fixed header); no smooth-scroll script.

### Accessibility hand-off

- One h1 (hero keyword). h2 per section (keyword headings), h3 for tile, step, plan names. Display titles are paragraphs.
- Focus order: skip/header -> breadcrumbs -> booking button -> "Ver qué trabajo" -> byline home link -> "Ver el precio" -> plan booking button -> FAQ intro button -> six summaries -> closing button -> NAP phone and Maps link -> footer.
- Drawings: SVGs `aria-hidden`; the hero and closing figures carry the `aria-label` above and the visible caption "Ejemplo ilustrativo". Tile art adds no accessible name.
- No async content, so no live regions.
