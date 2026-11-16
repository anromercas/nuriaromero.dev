# Design

## Context

See proposal.md (Why). State on `develop` (a62e1cd), plus NRD-212 (word budget without the live review quote) merged before this story per sprint order:

- `src/pages/inteligencia-artificial.astro` is a one-liner: `<ServiceLayout page={inteligenciaArtificial} />` (legacy variant).
- `inteligenciaArtificial` (`src/data/services.ts:398-500`): title "IA para negocios en Sevilla | Chatbots y asistentes con IA" (pinned by `tests/seo-meta-titles.test.js`), description with "chatbots que atienden clientes" (intent `descriptionSignal`), H1 "Inteligencia artificial aplicada a tu negocio" (`h1Signal`), `sectionTitles` (process "Así es el proceso de implantar IA en tu negocio" and pricing "Cuánto cuesta implementar IA en tu negocio" are the intent row `contentSignals`, checked by `check-seo-07`; benefits "Qué consigue tu negocio con IA aplicada, sin humo"; faq "Preguntas frecuentes sobre inteligencia artificial para negocios"), four long benefits, four steps, `pricing` `{ from: "399 €", includes: [5], note }`, nine long FAQs. Published facts reused: chatbot from 399 €; pilot "entre una y dos semanas según cuánta información haya que preparar"; trained only with the business information and hands off to a person when it does not know; no absolute guarantee; RGPD configuration documented; WhatsApp Business or web widget; a chatbot that also creates an order or a booking is quoted per case.
- Template precedent: `/automatizaciones/` (NRD-166, `src/pages/automatizaciones.astro`): service page without `RealProof`, one plan built in the page from `pricing`, comparison through `SeoLocalAgencia`. ADR 0014.
- Guards: `tests/seo-meta-titles.test.js`, `tests/keyword-ownership.test.js`, `tests/adr-0013-link-rows.test.js` (row IA -> software), `tests/software-medida-intent.test.js` (inbound link from IA), `tests/automatizaciones-template.test.js` (reciprocal pair; its FAQ question 2 differs from "¿Cuál es la mejor IA para empresas?"), `tests/single-price-source.test.js`, `check-seo-02` (Service offer, breadcrumb "Inteligencia artificial"), `check-seo-07`, `check-seo-17`.
- No AI project, client or metric is published (`src/data/local-trust.ts`, `src/components/Projects.astro`).

## Goals / Non-Goals

**Goals:**

- Same intent, about 40% fewer words, in the template world; intent row intact.
- FAQPage = visible FAQ (six sourced questions); one Service Offer = the one visible plan (399).

**Non-Goals:**

- Title, description or H1 changes (NRD-126); GEO targeting (NRD-24/25/26); new figures.

## Decisions

**Approach.** Same data-driven pattern as `/automatizaciones/`: the page composes the NRD-163 components with slots, the copy lives in `inteligenciaArtificial`, and the single plan is built in the page from `inteligenciaArtificial.pricing`, so the existing single Service Offer equals it. The price becomes `const AI_FROM = "399 €"` next to `SOFTWARE_FROM`, used by `pricing.from` and interpolated in the cost answer (one literal; `tests/single-price-source.test.js` reads prices by import since NRD-195).

1. **C3 versus the gated intent work.** The epic's C3 asks for the owned keyword in title and H1. The literal "inteligencia artificial para empresas sevilla" is not in today's title or H1, and changing them is a re-targeting the story explicitly leaves to NRD-126 ("esta historia no reorienta la página: mantiene la keyword del registro"); the title is pinned by `tests/seo-meta-titles.test.js` and the intent row. Decision: title, description and H1 stay; "inteligencia artificial" and "empresas" appear in the hero subtitle and FAQ naturally. Flagged in the tracker summary for the PO; not a blocker.
2. **No real-proof section.** The story says "proyectos reales si los hay"; there are none for AI. Showing the two websites would prove nothing about the service (same reasoning as `/automatizaciones/`). The before-pricing slot holds only the comparison.
3. **Proof strip.** `[SITE_PROOF[0], rating?]` exactly as `/automatizaciones/`: "+10 años / de experiencia" and the live Google rating cell when reviews exist. Without reviews the strip has one cell (accepted on `/automatizaciones/`).
4. **Six FAQ items, question 2 folded into 1.** Research questions 1 ("¿Cuál es la mejor IA para empresas?") and 2 ("¿Qué inteligencia artificial usan las empresas?") have the same intent; one answer covers both (what companies use day to day and how to choose). Seven separate answers would not fit 750-850 words with six tiles, four steps and the comparison.
5. **Comparison and FAQ question 3 overlap on purpose.** The comparison "¿IA a medida o ChatGPT tal cual?" is the visual decision aid (three items); FAQ item 2 answers the PAA wording in two or three sentences without repeating the items verbatim.
6. **Related links.** Keep the four rows (automatizaciones reciprocal, SEO local, software row of ADR 0013 table A, contact) and add `{ path: "/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/", anchor: "guía sobre cómo te encuentran las IA", kind: "contextual" }` before the conversion row. The anchor is in a pill, not a heading, and contains no owned term. `/seo-para-ia/` does not exist yet; no link to it.

Alternatives considered: changing the H1 to "Inteligencia artificial para empresas en Sevilla" (rejected: re-targeting is NRD-126's gated work and would break the intent signal and title test); showing `RealProof` with the two websites (rejected, decision 2); a one-tier `pricing.tiers` (rejected: duplicates the price literal).

### TL decisions on the UX open questions (2026-11-16)

1. **ChatMock motion: confirmed.** The 3 px scroll-linked nudge of the handoff group (the AppMock/FlowMock mechanism) replaces the bubbles drawing in: a scroll-driven draw-in with `fill: both` shows the empty start state at scroll 0. Without scroll timelines the drawing is static. The Files entry is updated.
2. **FAQ length: accepted.** Answers of about 35-45 words as written in the UI spec; GEO-1 holds because each first sentence answers. The developer measures with `check-seo-17`: under 750, lengthen answers toward 50 words first (answers 3, 4 and 2, in that order), then the comparison texts; over 850, apply the trimming order below. The PR reports the measured count.
3. **`pricing.includes` and `pricing.note`: changed in this story** (task 2.1 already edits `inteligenciaArtificial`; no test pins them; the plan card shows them, so C6 applies to this page). `includes[0]` "Análisis del caso de uso con mejor retorno" becomes "Análisis de tu caso de uso"; `note` "... La prueba piloto te permite decidir sin arriesgar." becomes "El coste depende del caso de uso. Con la prueba piloto ves cómo responde con tus datos antes de seguir." No price changes. The legacy process step and FAQ that also say "mejor retorno" are replaced by the new copy anyway.
4. **Label size: 15 viewBox units confirmed** for ChatMock. AppMock's 12-unit "Pedidos" label (`src/components/software/AppMock.astro`) rendering near 9 px at 320 px is out of scope here; noted for the PO as a possible a11y follow-up on `/desarrollo-software-medida/`.

### Section map (reference order)

| #   | Slot             | Component                                                                                                 | Content source                                                                                                                                                                                                                                                                                                                                            |
| --- | ---------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `hero`           | `SeoLocalHero` + `ProofStrip`                                                                             | `keyword=inteligenciaArtificial.hero.h1` (unchanged), `title={ text: hero.title, accent: hero.titleAccent }` (new), shorter `subtitle` (answers what and for whom in the first two sentences, GEO-1), `secondaryLink` from new `hero.secondaryCta` to `#precios`, `<ChatMock slot="visual" />`; proof items `[SITE_PROOF[0], rating?]`                    |
| 2   | `benefits`       | `SectionContainer id="que-puede-hacer"` > `ReviewBento headingId="que-puede-hacer-title"` + 6 `BentoTile` | `keyword=inteligenciaArtificial.sectionTitles.benefits` (new: "Qué puede hacer la IA en tu negocio"); tiles from `benefits` in order chatbot (web y WhatsApp), agente que reserva o toma pedidos, respuestas con tu información, derivación a una persona, resúmenes, RGPD; one sentence each; `<AiTileArt kind=... />`; areas a-f                        |
| 3   | `process`        | `.band` > `SeoLocalProcess id="proceso"`                                                                  | `keyword=sectionTitles.process` (unchanged signal); 4 steps: caso de uso, piloto con tus datos (the published "1 a 2 semanas" may appear here or only in the FAQ, never both with different wording), ajuste con casos reales, conexión definitiva a tu web o WhatsApp; portrait on                                                                       |
| 4   | `before-pricing` | `SectionContainer` > `SeoLocalAgencia id="ia-o-chatgpt"`                                                  | keyword "¿IA a medida o ChatGPT tal cual?", three items in the page (when ChatGPT as is is enough: drafting, ideas, your own use; when a solution for your business pays off: it answers your customers with your information, on your channels, with rules and a person behind; start with one use case and a pilot), link "Ver el precio" to `#precios` |
| 5   | `pricing`        | `.band` > `SeoLocalPlans`                                                                                 | `keyword=sectionTitles.pricing` (unchanged signal), `tiers={[plan]}` with `plan = { name: "Chatbot con IA", from: inteligenciaArtificial.pricing.from, includes: pricing.includes ?? [], note: pricing.note }`, `lede` slot with `<strong>desde {pricing.from}</strong>` and that projects that combine AI with automations are quoted per case           |
| 6   | `faq`            | `SeoLocalFaq headingId="faq-title"`                                                                       | `keyword=sectionTitles.faq` (unchanged), six sourced items                                                                                                                                                                                                                                                                                                |
| 7   | `related`        | `SeoLocalRelated`                                                                                         | `internalLinksBySource[inteligenciaArtificial.slug]` (decision 6)                                                                                                                                                                                                                                                                                         |
| 8   | `closing`        | `SeoLocalClosing` + `SeoLocalNap`                                                                         | new `inteligenciaArtificial.cta`, `<ChatMock slot="visual" animate={false} />`; closing keyword "Reserva una llamada sobre IA para tu negocio"; NAP keyword "Inteligencia artificial desde La Rinconada, Sevilla"                                                                                                                                         |

Display titles, accents, tile sentences and exact copy are fixed by the UI spec (ux-designer, impeccable). Copy constraints: `tú`; jargon explained in place ("agente de IA", "modelo", "RGPD" get a plain gloss); no figure other than "399 €" (from data), "1 a 2 semanas" (published pilot time) and "+10 años"/"más de 10 años"; no promise of savings, return, response accuracy or AI-assistant visibility; no brand presented as the best.

### FAQ (GEO block)

Six items, answers about 35-50 words (sized to the word budget, see TL decision 2), first two sentences answer directly, `tú`, in this order:

1. "¿Cuál es la mejor IA para empresas?" (PAA, KW-Labs `mejores ia para empresas`; covers PAA "¿Qué inteligencia artificial usan las empresas?"): there is no single best one; it depends on the task. Companies use general assistants to write and summarise, and chatbots or agents connected to their own information to serve customers; choose by use case, data privacy and the channels your customers use. Brands may be named only as examples, never ranked.
2. "¿Qué diferencia hay entre ChatGPT y una IA para mi negocio?" (PAA "¿Qué IA es mejor que ChatGPT?" / "¿Diferencia entre IA y ChatGPT?"): ChatGPT is a general assistant; a solution for your business can use a similar model but answers with your information, on your web or WhatsApp, with your rules and a person behind it. No "better than" claim.
3. "¿Cómo implantar IA en mi empresa?" (RS `Implementar ia en mi empresa`): one concrete use case first, a pilot with your real data, adjustment with real cases, then the final connection; the process section's steps in one answer.
4. "¿Qué es un agente de IA para empresas?" (KW-Labs `agente de ia para empresas`): an AI that does not only answer but completes a task with your tools (books an appointment, takes an order), within limits you set and with handoff to a person; quoted per case (published).
5. "¿Un chatbot puede atender a mis clientes?" (KW-Ads `chatbot para empresas`; RS `Chatbot de ia`): yes, the frequent questions, trained only with your information; when it does not know, it hands the conversation to you; it reduces mistakes but there is no absolute guarantee.
6. "¿Cuánto cuesta y cuánto se tarda en poner IA en marcha?" (competitor ads with price and lead time; their figures are not published): `` `Un chatbot para tu web o WhatsApp cuesta desde ${AI_FROM}.` `` then the pilot of one to two weeks depending on the information to prepare, and that projects combining AI with automations are quoted per case.

Left out: research question 2 as a separate item (decision 4); "cursos de ia para empresas" (training intent). The current answers about privacy, classic chatbots, trial, having a website and replacing the team go; their key facts move into the RGPD and handoff tiles, the comparison and answers 3, 5 and 6.

**Word budget (750-850, set by the story).** If `check-seo-17` reports more than 850, trim in this order and stop as soon as the page fits: (1) the last sentence of FAQ answers, never one of the first two and never the handoff or no-guarantee sentence of answer 5 or the price of answer 6; (2) the `text` of the comparison items, down to one short clause; (3) the plan lede, down to the "desde" sentence; (4) the closing text, keeping its first sentence. FAQ items, tiles and steps are never removed. Below 750, extend FAQ answers first. Trimming beyond this order must be explained in the PR description (lesson of NRD-167).

### Files

All in layer `app`.

Create:

- `src/components/ia/ChatMock.astro`: single-SVG figure of a chat window with three or four bubbles (customer question, bot answer, a second question, a "te paso con una persona" handoff marker drawn as a person outline joining the thread in `signal`); `animate?: boolean` (completed state by default; the only motion is a 3 px scroll-linked nudge of the handoff group under `prefers-reduced-motion: no-preference` and `@supports (animation-timeline: scroll())`, static otherwise, never hidden in the initial CSS, no-scroll first paint complete, lesson of NRD-196/NRD-168; see TL decision 1); figure shell as `src/components/software/AppMock.astro` (viewBox `0 0 320 220`, caption "Ejemplo ilustrativo", `aria-label` on the figure, SVG `aria-hidden="true" focusable="false"`); at most one SVG `<text>` label, a common noun, no digits or names, sized at 15 viewBox units so it renders at 11 px or more at a 320 px viewport (TL decision 4).
- `src/components/ia/AiTileArt.astro`: `{ kind: "chatbot" | "agente" | "respuestas" | "persona" | "resumenes" | "rgpd" }`, one SVG each (1.5 stroke, `currentColor`, no fills, no `<text>`, `aria-hidden`, only the `BentoTile` `signal`/`soft`/`label` classes).
- `tests/ia-template.test.js`.

Modify:

- `src/data/services.ts`: `const AI_FROM = "399 €"` next to `SOFTWARE_FROM` with a one-line comment; update the file header comment if it lists prices (it already says "chatbot IA 399 €"; keep). `inteligenciaArtificial`: `pricing.from: AI_FROM`, new `hero.title`, `hero.titleAccent`, shorter `hero.subtitle`, `hero.secondaryCta` (`{ label: "Ver precio", href: "#precios" }`), `sectionTitles.benefits`, six `benefits`, four `process`, six `faqs`, new `cta`; `pricing.includes[0]` becomes "Análisis de tu caso de uso" and `pricing.note` becomes "El coste depende del caso de uso. Con la prueba piloto ves cómo responde con tus datos antes de seguir." (TL decision 3). Unchanged: `slug`, `breadcrumbName`, `seo.*`, `hero.h1`, `sectionTitles.process`, `sectionTitles.pricing`, `sectionTitles.faq`, the other four `pricing.includes`.
- `src/pages/inteligencia-artificial.astro`: template slots per the section map (`tiles` array `{ area, kind, layout }`, `plan`, `proofItems`, `comparisonItems` in the page as on `/automatizaciones/`).
- `src/data/internal-links.ts`: one contextual row (decision 6) before the conversion row of `"/inteligencia-artificial/"`.
- `scripts/lib/template-pages.mjs`: `{ route: "/inteligencia-artificial/", words: [750, 850], service: true }`.

Unchanged and green: `tests/seo-meta-titles.test.js`, `tests/seo-intents-copy-sync.test.js`, `tests/keyword-ownership.test.js`, `tests/adr-0013-link-rows.test.js`, `tests/software-medida-intent.test.js`, `tests/automatizaciones-template.test.js`, `tests/single-price-source.test.js`, `public/llms.txt` (line 14 already describes chatbots and assistants, no price), `check-seo-02/07/16`.

### Interfaces

```ts
// src/components/ia/ChatMock.astro
interface Props {
  animate?: boolean; // default true
}
// src/components/ia/AiTileArt.astro
interface Props {
  kind: "chatbot" | "agente" | "respuestas" | "persona" | "resumenes" | "rgpd";
}
```

No data type change (`ServicePageData` already has `hero.title`, `titleAccent`, `secondaryCta`, `cta`).

### Data

No storage or migration, no price change (the literal moves into a constant with the same value). FAQPage from nine to six questions; Service (one Offer 399) and BreadcrumbList unchanged.

### Test plan (TDD order)

1. Task 1.1 (NRD-214), illustration assertions first in `tests/ia-template.test.js`: SVGs `aria-hidden`, stroke 1.5, no filled shapes, "Ejemplo ilustrativo" on `ChatMock`, reduced-motion guard and no `opacity: 0`/`visibility: hidden` in the default CSS, the six-kind union, no digits or names in SVG `<text>`. Scenario "Illustrations are examples".
2. Task 2.1 (NRD-215), structure assertions first: page uses `variant="template"` with `SeoLocalHero`, `ChatMock`, `ProofStrip`, `ReviewBento`, `AiTileArt`, `SeoLocalProcess`, `SeoLocalAgencia`, `SeoLocalPlans`, `SeoLocalFaq`, `SeoLocalRelated`, `SeoLocalClosing`, `SeoLocalNap` in this order; no `RealProof`, `TitleSection`, `✓`, `text-gray-`/`bg-gray-`; keyword headings bound to `inteligenciaArtificial.sectionTitles.*`; plan built from `inteligenciaArtificial.pricing` (no "€" in the page); `services.ts` holds exactly one `"399 €"` literal (`const AI_FROM`) and `inteligenciaArtificial.pricing.from === "399 €"`; six `benefits`, four steps; every `inteligenciaArtificial` string has no digit other than "399", "10", "1" and "2" (pilot weeks); no H2 string contains "GEO" or "posicionamiento en IA"; the related row to the GEO guide sits before the conversion row. Then implement; `seo-meta-titles`, `seo-intents-copy-sync`, `adr-0013-link-rows`, `check-seo-02` and `check-seo-07` green. Scenarios "Intent signals kept", "No term of another owner in headings", "Sections in reference order", "Legacy blocks removed", "One plan, one offer", "Proof strip without reviews", "Related links".
3. Task 2.2 (NRD-216), add the template entry, observe `pnpm build && pnpm check:seo-17:dist` RED, then FAQ assertions: six items whose normalised questions equal the list above in order; none equals the `/automatizaciones/` question; answer 6 interpolates `${AI_FROM}` in source and matches `/1 (a|y) 2 semanas/`; answers 1 and 2 match no `/(la|el) mejor (es|ia es)|te recomiendo|mejor que chatgpt es/i`; answer 5 matches `/persona/` and no `/garantiz|siempre acierta|100 ?%/i` except a negated guarantee ("no hay garantía absoluta" is allowed: assert `/no .*garant/i`); answer 4 mentions "reserva" or "pedido". Then write the copy within 750-850 words. Scenarios "Word budget", "FAQ equals FAQPage", "No duplicate of the automation question", "Best AI answered with criteria", "Handoff and no absolute guarantee", "Price answer from data".
4. Every task: `node --test tests/*.test.js`, `pnpm build`, `pnpm check:seo:dist` green.

### Real-browser / e2e checks (QA)

- `/inteligencia-artificial/` at 375, 768, 1024 and 1280 px against the UI spec: no overflow; the single plan is one readable column (NRD-168 one-plan rule); bento area map from 1024 px.
- Keyboard: hero CTA, "Ver precio" (lands on `#precios` below the fixed header), comparison link, plan button, FAQ summaries, related pills, closing CTA; 2 px sky focus visible.
- `ChatMock` completed state at first paint, with reduced motion and with no scroll; no text inside the drawing below 11 px rendered at 320 px.
- Rich Results Test: Service with one Offer 399, FAQPage with six questions, BreadcrumbList.

### ADRs relied on

0003, 0004, 0005, 0006, 0008, 0012, 0013, 0014, 0015.

## Risks / Trade-offs

- [C3 read as "keep the registry placement"] -> decision 1; the PO can move the title/H1 change into NRD-126 when its gate opens.
- [Answers 1 and 2 drift into recommending a brand] -> test regex plus review; brands only as examples.
- [Overlap with the GEO page or post] -> no GEO term in headings; one link to the guide.
- [750-850 words with six FAQs and no real proof] -> answers about 50 words, one-sentence tiles and steps; trimming order above.
- [Animation hides content before scroll] -> completed state is the default CSS; QA checks first paint (Sprint 7 lesson).
- Size: three work units for 5 points; no size concern.

## UI spec

Visual authority: `DESIGN.md` ("The Annotated Storefront") as rendered by `/seo-local-sevilla/`; the closest pattern is `src/pages/automatizaciones.astro` (same section set, no `RealProof`, one plan, comparison through `SeoLocalAgencia`): copy its composition, not its copy. Mode: persuade (one primary action: book a call). No new palette, type scale or shared component: every section is an NRD-163 component (`src/components/seo-local/*`) with props, plus the two page illustrations in Files. Colours, type and surfaces come only from `src/styles/template.css` (`--ink-ground`, `--sky-signal`, `--sky-accent`, `--drawing-soft`, `--hairline`, `--hairline-quiet`, `--card-surface`, `--drawing-surface`, `--text-*`, `--ease-out`, `.band`, `.tpl-kw`, `.tpl-display`, `.tpl-accent`, `.tpl-link`). Copy is Spanish, `tú`; "agente de IA", "modelo" and "RGPD" get a plain gloss where they first appear. The only figures are the price (from `AI_FROM` / `inteligenciaArtificial.pricing.from`, never typed in the page), "1 a 2 semanas" (FAQ 6 only) and "+10 años". Every display title has exactly one accent phrase (the `accent` value, a verbatim substring of `text`). Strings below are exact; every FAQ answer is one paragraph.

What this redesign fixes against the reference: four long gray benefit cards, a nine-question wall of text and an old-world pricing box. The page becomes the same quiet working document as `/seo-local-sevilla/`, with the drawing changed to a short chat in which the bot answers and then a person joins, so the visitor sees "it answers my customers, and a human is behind it" before reading a word. That handoff is the one idea the page repeats (hero drawing, tile d, comparison item 2, FAQ 5).

Skill note: `impeccable:impeccable` (shape) used inside the established world; its interview and context-setup steps were skipped (unattended). Its answers are taken from the story, this design and the shipped template pages; inferred decisions are marked `Assumption:`.

### 1. Hero (`SeoLocalHero` + `ChatMock` + `ProofStrip`)

- Layout: reference hero unchanged (one column under 768 px: copy then drawing; `1.05fr / 0.95fr` from 768 px; sky halo behind the drawing, clipped by the component).
- Hierarchy: keyword h1 (small, slate) > display title > subtitle > booking button (primary, the only filled control) + "Ver precio" underlined text link (secondary) > drawing.
- `keyword=inteligenciaArtificial.hero.h1` (unchanged).
- `title={ text: "IA que responde con tu información", accent: "con tu información" }` (new `hero.title`, `hero.titleAccent`). Assumption: display copy; states the page's honesty promise (trained only with the business information, published fact).
- `subtitle` (new `hero.subtitle`): "Monto chatbots y agentes de inteligencia artificial para empresas y negocios de Sevilla. Atienden a tus clientes en tu web o WhatsApp con tu información y te pasan la conversación cuando hace falta una persona." Assumption: copy; the first sentence answers what and for whom (GEO-1), "inteligencia artificial" and "empresas" in body text (design decision 1); no digit, no promise.
- `primaryCtaLabel`: not passed (site default). `secondaryLink={ label: "Ver precio", href: "#precios" }` from new `hero.secondaryCta`.
- `ChatMock` (`src/components/ia/ChatMock.astro`), the hero focal drawing:
  - Figure shell identical to `src/components/software/AppMock.astro`: `<figure class="mock">` with 1px `--hairline` border, 1.25rem radius, `--card-surface`, `overflow: hidden`; `.drawing` on `--drawing-surface`, 1.25rem padding, `--hairline-quiet` bottom rule; `<figcaption>Ejemplo ilustrativo</figcaption>` in `--text-muted` 0.8rem. Same scoped classes `signal` (`--sky-signal`), `soft` (`--drawing-soft`), `label` (`--text-secondary`, `stroke: none`).
  - One SVG, `viewBox="0 0 320 220"`, `fill="none"`, `stroke="currentColor"` (base `--text-muted`), `stroke-width="1.5"`, round caps/joins, `max-width: 26rem`, `aria-hidden="true" focusable="false"`.
  - Composition (Assumption: drawing details inside the design's description): a chat window (rect rx 12, full viewBox minus 8 units) with a header row: a small circle (bot avatar, `soft`) and one SVG `<text class="label">Asistente</text>` (the only text; common noun, no digits or names), separated from the thread by a `soft` hairline. Thread, top to bottom, bubbles as rounded rects (rx 10) holding `soft` pill bars instead of words:
    1. Customer question, right-aligned, default stroke, one bar.
    2. Bot answer, left-aligned, default stroke, two bars (longer).
    3. Second customer question, right-aligned, one short bar.
    4. Handoff marker: a centred `soft` dashed rule interrupted by a person outline in `signal` (head circle r 5 plus a shoulders arc) = "a person joins".
    5. Person's reply, left-aligned, bubble and its one bar in `signal`.
    - Bottom: a `soft` input pill with a small `signal` send arrow at its right end.
      No numbers, names, times, ticks or read receipts anywhere. Bubbles never overlap; at least 6 units between them.
  - Label size: the label renders at 11 px or more at a 320 px viewport (the SVG is about 240 px wide there), so `.label { font-size: 15px }` in viewBox units. Assumption: derived from the QA rule "no text below 11 px at 320 px"; AppMock's 12px would render near 9 px.
  - `aria-label` on the figure: "Ejemplo de chatbot que responde a un cliente con la información del negocio y pasa la conversación a una persona". Assumption: wording.
  - Motion (`animate` default `true`). Rule one: the completed drawing is the only default CSS state: every bubble, the handoff marker and the reply are visible at first paint, at scroll 0, with reduced motion and in every browser; no `opacity: 0`, no `visibility: hidden`, no `stroke-dashoffset` start values outside the animated rule. Rule two: the only motion is a rest-to-rest nudge, the same mechanism AppMock and FlowMock ship: inside `@media (prefers-reduced-motion: no-preference)` and `@supports (animation-timeline: scroll())`, the group `.handoff` (person marker plus reply bubble) runs `animation: handoff-nudge linear both; animation-timeline: scroll(root block); animation-range: 0 220px;` with keyframes `0% { transform: none } 50% { transform: translateY(-3px) } 100% { transform: none }`. Fallback without scroll timelines (Firefox, older Safari): no animation, the completed drawing; no timed draw-in, no JavaScript. `animate={false}` (closing band) renders the same drawing with no animation class. Assumption: this replaces the design's "bubbles draw in" with a nudge, because a scroll-driven draw-in with `fill: both` shows the empty start state at scroll 0, which breaks "first paint complete" (NRD-167 lesson); the design's invariants (completed default, reduced-motion guard, never hidden) are kept.
- `ProofStrip` (`src/components/seo-local/ProofStrip.astro`): `items=[SITE_PROOF[0], rating?]` computed in the page exactly as `/automatizaciones/`: "+10 años / de experiencia", then "{rating} en Google / {n} opiniones" only when `reviewsData` is not null. No other figure, no empty cell.

### 2. Bento "qué puede hacer la IA en tu negocio" (`ReviewBento` + 6 `BentoTile` + `AiTileArt`)

- `SectionContainer id="que-puede-hacer"` > `ReviewBento headingId="que-puede-hacer-title"`, `keyword=inteligenciaArtificial.sectionTitles.benefits` ("Qué puede hacer la IA en tu negocio"), `title={ text: "Lo que puede hacer por ti", accent: "por ti" }`, caption default "Ejemplo ilustrativo". Assumption: display copy.
- Area map is the component's (`a a a a b b / c c d d d d / c c e e e e / f f f f f f` from 1024 px); the page holds `tiles` = `{ area, kind, layout }` in this order, and `inteligenciaArtificial.benefits` in the same order. Titles h3 (component), one sentence each, no `link`. All titles and sentences Assumption: copy from the story list and published facts.

| Area | `kind`       | Title                                | Sentence                                                                                | Layout |
| ---- | ------------ | ------------------------------------ | --------------------------------------------------------------------------------------- | ------ |
| a    | `chatbot`    | "Chatbot en tu web y WhatsApp"       | "Responde las dudas frecuentes de tus clientes en tu web o en WhatsApp Business."       | stack  |
| b    | `agente`     | "Agente que reserva o toma pedidos"  | "Un agente de IA no solo contesta: apunta la cita o el pedido en tus herramientas."     | stack  |
| c    | `respuestas` | "Respuestas con tu información"      | "Contesta con tus servicios, precios y horarios, no con lo que encuentra por internet." | stack  |
| d    | `persona`    | "Pasa la conversación a una persona" | "Cuando no sabe la respuesta, te avisa y la conversación sigue contigo."                | stack  |
| e    | `resumenes`  | "Resúmenes"                          | "Resume conversaciones, correos o documentos largos en unas pocas líneas."              | stack  |
| f    | `rgpd`       | "Datos cuidados y RGPD"              | "Te explico qué datos se envían y a quién, según el RGPD, la ley europea de datos."     | `row`  |

- `AiTileArt` (`src/components/ia/AiTileArt.astro`): one SVG per `kind`, `aria-hidden="true" focusable="false"`, 1.5 stroke, round caps/joins, `currentColor`, no fills, no `<text>`, no digits; only the `BentoTile` `:global(.signal|.soft|.label)` classes (do not restyle). Each drawing fits its area's shape. Assumption: compositions.
  - `chatbot` (wide a): a browser window (three dots, empty `soft` address pill) with a small `signal` chat bubble in its lower-right corner, and beside it a phone outline holding two stacked bubbles (one `soft`, one default). No WhatsApp logo.
  - `agente` (narrow b): a chat bubble at top joined by a short `signal` arrow to a small calendar of 3 x 3 `soft` cells, one cell `signal` with a check stroke.
  - `respuestas` (tall c): a stack of three `soft` documents with line bars, a `signal` connector running down from the front document into a bubble at the bottom with two bars.
  - `persona` (wide d): two bubbles at left, a `signal` arrow to a person outline (head circle plus shoulders arc) in `signal` at right.
  - `resumenes` (wide e): five long `soft` bars on the left gathered by a `signal` bracket into a small card on the right with two short bars.
  - `rgpd` (full row f): a `soft` document with line bars and a `signal` padlock outline (shackle arc plus body rect rx 3) overlapping its lower corner. No shield badge, no letters.

### 3. Process (`.band` > `SeoLocalProcess`)

- `id="proceso"`, `headingId="proceso-title"`, `keyword=inteligenciaArtificial.sectionTitles.process` (unchanged intent signal), `title={ text: "Primero un piloto con tus datos", accent: "con tus datos" }`, `portrait` on with the default alt, no byline, no aside. Assumption: display copy; byline omitted for the word budget (the experience lives in the proof strip).
- Steps (new `inteligenciaArtificial.process`, h3 + one sentence; "1 a 2 semanas" appears only in FAQ 6, design rule "never both"). Assumption: copy.
  1. "Elegimos un caso de uso": "Buscamos la tarea en la que la IA te ayuda de verdad, como las dudas que más se repiten."
  2. "Piloto con tus datos": "Lo monto con la información real de tu negocio y lo pruebas antes de decidir."
  3. "Ajuste con casos reales": "Corregimos las respuestas con preguntas de verdad de tus clientes."
  4. "Conexión a tu web o WhatsApp": "Lo dejo funcionando en tu canal, con supervisión y ajustes el primer mes."

### 4. Comparison (`SectionContainer` > `SeoLocalAgencia`)

- `id="ia-o-chatgpt"`, `headingId="ia-o-chatgpt-title"`, `keyword` "¿IA a medida o ChatGPT tal cual?" (design), `title={ text: "Cuándo basta con ChatGPT y cuándo no", accent: "cuándo no" }`, `link={ label: "Ver el precio", href: "#precios" }`. Items in the page (`lead` bold, then `text`; Assumption: copy carrying the facts of the removed "sustituye a mi equipo" and "probar antes" answers):
  1. lead "Para redactar, buscar ideas o tu propio trabajo, ChatGPT tal cual te basta." text "Te lo diré en la primera llamada."
  2. lead "Si tiene que atender a tus clientes, compensa una solución para tu negocio." text "Responde con tu información, en tus canales, con tus reglas y con una persona detrás."
  3. lead "Empieza por un solo caso de uso y un piloto." text "Así ves cómo responde antes de decidir."

### 5. Plan (`.band` > `SeoLocalPlans`)

- `id` default `"precios"` (target of "Ver precio" and "Ver el precio"; keeps `scroll-m-20`), `headingId="planes-title"`, `keyword=inteligenciaArtificial.sectionTitles.pricing` (unchanged intent signal), `title={ text: "Empieza con un chatbot", accent: "un chatbot" }`. Assumption: display copy.
- `tiers={[plan]}` exactly as the design: name "Chatbot con IA", `from`, `includes` and `note` from `inteligenciaArtificial.pricing`; no `recommended`, no `ctaLabel`.
- `lede` slot: `Tu chatbot con IA, con piloto incluido, <strong>desde {inteligenciaArtificial.pricing.from}</strong>. Si lo combinas con automatizaciones, te doy presupuesto según el caso.` Assumption: copy; "piloto incluido" restates `pricing.includes[1]`. No section `note` prop (the tier carries `pricing.note`).
- Visual: one plan card, not recommended (Reserved Yellow Rule: a single option is not a recommendation): `--card-surface`, `--hairline` border, sky checks, no badge. NRD-168 one-plan rule (`.plan-list:has(> .plan:only-child)` in `src/components/seo-local/SeoLocalPlans.astro`): one column, `max-width: 36rem`, left-aligned under the heading and lede, never stretched. Button at the card bottom.

### 6. FAQ (`SeoLocalFaq`)

- `headingId="faq-title"`, `keyword=inteligenciaArtificial.sectionTitles.faq` (unchanged), `title={ text: "Lo que preguntan las empresas sobre IA", accent: "sobre IA" }`, `lede` "Si tu duda no está aquí, la vemos en la llamada.", `ctaLabel` not passed. Assumption: display copy.
- Six items in the design's order; the component bolds the first sentence (up to the first period), so each first sentence is the direct answer (GEO-1); no `links`. Answers are about 35-45 words (accepted, TL decision 2), so the page lands inside 750-850 (estimated about 830 with these strings). Assumption: length set by the word budget; extend toward 50 words only if `check-seo-17` reports under 750. All answers Assumption: copy from published facts. Brands appear in answer 1 only as examples, never ranked.
  1. q "¿Cuál es la mejor IA para empresas?" a "No hay una sola mejor: depende de la tarea. Las empresas usan asistentes generales, como ChatGPT o Gemini, para redactar y resumir, y chatbots conectados a su información para atender clientes. Elige por caso de uso, privacidad de tus datos y canales de tus clientes."
  2. q "¿Qué diferencia hay entre ChatGPT y una IA para mi negocio?" a "ChatGPT es un asistente general. Una IA para tu negocio puede usar un modelo parecido, el motor que entiende y escribe texto, pero responde con tu información, en tu web o WhatsApp, con tus reglas y con una persona detrás."
  3. q "¿Cómo implantar IA en mi empresa?" a "Empieza por un solo caso de uso, como las dudas que más se repiten. Después se monta un piloto con tus datos, se ajusta con preguntas reales y, cuando funciona, se conecta a tu web o WhatsApp."
  4. q "¿Qué es un agente de IA para empresas?" a "Es una IA que no solo contesta: completa una tarea con tus herramientas, como reservar una cita o tomar un pedido. Actúa dentro de los límites que tú marcas y pasa a una persona lo que no puede resolver. Se presupuesta según el caso."
  5. q "¿Un chatbot puede atender a mis clientes?" a "Sí, atiende las preguntas frecuentes solo con la información de tu negocio. Cuando no sabe la respuesta, te pasa la conversación a una persona. Así se reducen mucho los errores, aunque no hay garantía absoluta de que acierte siempre."
  6. q "¿Cuánto cuesta y cuánto se tarda en poner IA en marcha?" a `` `Un chatbot para tu web o WhatsApp cuesta desde ${AI_FROM}. El piloto con tus datos tarda de 1 a 2 semanas, según cuánta información haya que preparar. Si lo combinas con automatizaciones, te doy presupuesto según el caso.` ``
- Trimming follows the design's order; the protected sentences are answer 5's handoff and no-guarantee sentences and answer 6's price sentence.
- Layout and states: reference (two columns from 1024 px with sticky intro, one column below; all items closed on load; native `details`/`summary`; drawn plus loses its vertical stroke when open).

### 7. Related (`SeoLocalRelated`)

- `links=internalLinksBySource["/inteligencia-artificial/"]` (five pills after decision 6, the GEO guide pill before the conversion pill), label default. Hover border `--sky-signal`, text `--sky-accent`. Long anchors wrap inside the pill; no truncation.

### 8. Closing and NAP (`SeoLocalClosing` + `ChatMock` + `SeoLocalNap`)

- `SeoLocalClosing headingId="cierre-title"`, `keyword` "Reserva una llamada sobre IA para tu negocio" (design), `title={ text: inteligenciaArtificial.cta.title, accent: "tus clientes" }` with new `cta.title` "Empecemos por tus clientes" and `cta.text` "Cuéntame qué te preguntan más tus clientes y te digo si un chatbot te ayuda de verdad.", `meta` default ("30 minutos · Sin compromiso · Directamente conmigo"), `<ChatMock slot="visual" animate={false} />`. Assumption: copy ("sin compromiso" left to the meta line so it is not said twice).
- `SectionContainer` > `SeoLocalNap headingId="nap-title"`, `keyword` "Inteligencia artificial desde La Rinconada, Sevilla" (design).

### States

- Static page, no async UI. Build-time data only: `reviewsData` null: the ProofStrip shows the single "+10 años" cell (accepted on `/automatizaciones/`), no placeholder. Reviews present: rating cell added.
- Loading, empty, error, disabled and form states: n/a (no forms; booking buttons open the external booking page in a new tab).

### Responsive

- 320-639 px: one column; ChatMock scales inside its column (single SVG; "Asistente" at 11 px or more rendered); bento tiles stacked a-f; the single plan card full width; FAQ intro above the list.
- 640 px: ProofStrip horizontal.
- 768 px: hero two columns; bento two columns with a and f full width, f drawing beside its text; plan card follows the one-plan rule.
- 1024 px: bento area map, process portrait column, comparison 0.8/1.2, FAQ two columns with sticky intro.
- No horizontal scroll at any width; long words ("conversación", "información", the plan name) wrap.

### Interactions

- Hover/focus exactly as the components: text links turn `--sky-accent`; links, pills and FAQ summaries get a 2px `--sky-signal` outline with 2-4px offset on `:focus-visible`; booking buttons keep their own ring. Transitions 0.2s `--ease-out`.
- "Ver precio" and "Ver el precio" jump to `#precios` below the fixed header; no new smooth scroll.
- One authored motion moment: the hero ChatMock nudge. No entrance animations elsewhere.
- Destructive actions, validation, optimistic updates: n/a.

### Accessibility hand-off

- One h1 (hero keyword). h2 in order: benefits keyword, process keyword, "¿IA a medida o ChatGPT tal cual?", pricing keyword, FAQ keyword, closing keyword, NAP keyword. h3 for tile titles, step titles and the plan name. Display titles are paragraphs. No h2 contains "GEO" or "posicionamiento en IA".
- Focus order follows visual order: hero booking button, "Ver precio", "Ver el precio", plan button, FAQ intro booking button, FAQ summaries, related pills, closing booking button, Maps link.
- ChatMock: accessible name on the figure plus the visible caption; AiTileArt and every other SVG `aria-hidden`; no information lives only in a drawing (the handoff is also in tile d and FAQ 5).
- Reduced motion: ChatMock shows its completed state with no movement.
