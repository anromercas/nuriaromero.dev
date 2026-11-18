# Design

## Context

[NRD-128](https://nuriaromerodev.atlassian.net/browse/NRD-128), phase 5 step 9b of ADR 0013. Same rendering path and guards as the Google Maps guide (NRD-127 design): `src/content/blog/cuanto-cuesta-una-pagina-web-en-sevilla.md` through `BlogPostLayout.astro`; `check-seo-18` baseline (`tests/fixtures/blog-posts.baseline.json`), `check-seo-07` (`intentMatrix` row: title "¿Cuánto cuesta una página web", description "Qué factores influyen en el precio", H1 "¿Cuánto cuesta una página web", content headings "Qué debo revisar en una propuesta económica" and "Qué preguntas debo hacer antes de contratar"), `check-seo-06` (three link rows), `check-seo-21`, `check-seo-02`, ownership (G6). The reciprocal pair with `/diseno-web-sevilla/` exists in both directions (`reciprocalLinks`, `internalLinksBySource`; `tests/diseno-web-template.test.js` pins the hub side).

Published prices live only in `src/data/services.ts` and are shown on `/diseno-web-sevilla/` (`tests/single-price-source.test.js`). The post has no price figure today; its numbers are "2,5" (LCP threshold, twice), "75" (percentile) and "10" (years of experience), plus list markers 1 to 5.

Current leads (direct-answer rule of NRD-245):

| H2 | Lead today | Verdict |
| --- | --- | --- |
| Respuesta corta | 2 sentences, 48 words | too long |
| ¿Qué hace variar el presupuesto de una web? | 2 sentences, 50 words | too long |
| ¿Qué debo revisar en una propuesta económica? | 2 sentences, 28 words | passes |
| ¿Qué debe incluir una web profesional para un negocio local? | 6 words | too short |
| ¿Qué preguntas debo hacer antes de contratar una web? | numbered list | no lead |
| ¿Cómo trabajo en cada proyecto? | 3 sentences, 55 words | too long |

## Goals / Non-Goals

**Goals:** SEO-2 measured sample (or gap named); SEO-1 description; GEO-1 leads; SEO-4 no figure, guarded by a test; SEO-6 hub link kept; GEO-4 `Article`/`BreadcrumbList`; real `updatedDate`; CWV before and after; DEL-5.

**Non-Goals:** any figure; title/H1/URL changes; `/diseno-web-sevilla/` copy; FAQPage on posts.

## Decisions

### Approach

Mirror NRD-127: evidence subtask, then one content commit guarded by a Markdown-level test that reuses `tests/helpers/post-sections.js` (created by NRD-127; this branch merges `develop` after NRD-127 lands, before task 1.2). The distinctive guard is the number set: the post may only contain the numbers it has today, so neither a price nor any other new figure can slip in while S-2026-11-13-1 is open. The post answers "cuánto cuesta" honestly without a figure: it depends on scope, here is what to compare, and the author's own fixed price is published on the service page (linked, not quoted).

### Evidence (task 1.1)

- **SERP (1 call):** DataForSEO `serp/google/organic/live/advanced`, `Seville,Andalusia,Spain`, `es`, mobile, depth 10, `cuanto cuesta una pagina web en sevilla`. Needed because the S10 extract (2026-11-15, call 15) kept domains and titles but no URLs. Record local pack, AI Overview, PAA (literal), organic domains in order with page type and URL; compare with S10.
- **Sample (at most 5 calls):** `on_page/content_parsing/live` of the price guides and price-list or service pages with prices in the top 10 (S10: `hostinger.com`, `ideandoazul.com`, `proweb.cat`, `belleweb.es`, `ikaroa.com`); skip social and off-topic results (S10: `facebook.com`, `mejordesevilla.com`, named not measured). Main-content words per page, median, post body words (661 in the inventory, row 6).
- **Subtopic table and gap list:** as in NRD-127. Competitor price figures may be written in the evidence entry as observed data; they never move into the post.
- **Who runs the calls, fallback, CWV, budget:** as in NRD-127 (agent with `mcp__dataforseo__*`, orchestrator or `team-harness:seo-strategist`; `curl` fallback labelled; "sin dato" otherwise; Lighthouse 12.8.2 mobile median of 3 on production and on `pnpm preview` of the untouched branch; at most 6 calls).
- **Where:** `docs/seo-audit/keyword-clusters-2026-11.md`, section "Diseño web", entry "Dato observado (NRD-128, YYYY-MM-DD), DW-2 `cuanto cuesta una pagina web en sevilla`"; CWV in `docs/seo-audit/full-audit-2026-09-21/tasks/04-validar-cwv-y-lcp.md`, final section "Medición YYYY-MM-DD (NRD-128)".

### Copy (task 1.2)

Proposals; the UI spec may refine them within the scenarios. No digit in any of them.

- **Description** (154 chars): `Cuánto cuesta una página web en Sevilla: qué factores influyen en el precio, qué partidas comparar en cada presupuesto y qué preguntar antes de contratar.` The `intentMatrix` row's `descriptionSignal` becomes `Cuánto cuesta una página web en Sevilla` (the old capitalised signal "Qué factores influyen en el precio" no longer opens a sentence).
- **Intro** (not an H2): `El precio de una página web varía mucho según el alcance, el contenido y el trabajo técnico incluido. Esta guía no da cifras de mercado: explica qué partidas comparar y qué preguntar antes de contratar.`
- **Respuesta corta** (2 sentences, 37 words): `Una página web en Sevilla cuesta según su alcance, el contenido y el trabajo técnico incluido, así que no hay una cifra única fiable. Para comparar presupuestos, revisa qué incluye cada partida y qué se cobra aparte.`
- **¿Qué hace variar el presupuesto de una web?** lead (27 words): `Lo que más mueve el precio es el alcance: cuántas páginas, diseño a medida o plantilla, tienda online, redacción de textos, integraciones y soporte después del lanzamiento.` The sentence on domain, hosting, maintenance and licences follows (or moves to the recurring-costs section if that gap is added).
- **¿Qué debe incluir una web profesional para un negocio local?** lead (34 words): `Una web profesional para un negocio local debe verse bien en el móvil, cargar rápido, facilitar el contacto y quedar dada de alta en Google, con el dominio y el hosting a tu nombre.` Then the existing intro line and list.
- **¿Qué preguntas debo hacer antes de contratar una web?** lead before the list (28 words): `Antes de contratar, pregunta de quién serán el dominio y el hosting, qué resultados puede demostrar, si el precio es cerrado y qué soporte hay después del lanzamiento.`
- **¿Cómo trabajo en cada proyecto?** lead (28 words): `En cada propuesta detallo el alcance, el trabajo de SEO técnico previsto, los costes recurrentes y el soporte incluido, para que sepas qué pagas y qué queda fuera.` Then the existing credential sentence with its `/sobre-mi/` link and the measurement sentence, and the closing line: `Si quieres una referencia concreta, en mi [servicio de diseño web](/diseno-web-sevilla/) tienes el precio cerrado publicado y qué incluye, o puedes [escribirme](/contacto/) con los detalles de tu proyecto.` (keeps both body links; the old anchor text "mi servicio de diseño web y qué incluye" may stay instead, the baseline is regenerated either way).
- **Gap candidates** (only if the 1.1 gap list or PAA has them):
  - `## ¿Qué gastos se pagan cada año?`, lead (29 words): `Además del proyecto, una web suele tener costes que se repiten: la renovación del dominio, el alojamiento, el mantenimiento y, si las hay, las licencias de plantillas o plugins.` Then: ask for each renewal to be listed in the proposal.
  - `## ¿Qué cambia entre una web sencilla, una corporativa y una tienda online?`, lead (31 words): `Una web sencilla de pocas páginas, una web corporativa con más secciones y una tienda online con pagos y catálogo no requieren el mismo trabajo, así que tampoco cuestan lo mismo.` Then a link to the existing related row's destination `/tienda-online-sevilla/` only if it fits naturally.
- **`updatedDate`:** the date of the content commit.
- No promise (every "garantiz" sentence negated; today's two already are), Spanish copy, trailing-slash links.

### Files

| Layer | Action | Path | Notes |
| --- | --- | --- | --- |
| `app` | modify | `docs/seo-audit/keyword-clusters-2026-11.md` | DW-2 "Dato observado (NRD-128)" (1.1) |
| `app` | modify | `docs/seo-audit/full-audit-2026-09-21/tasks/04-validar-cwv-y-lcp.md` | "Medición (NRD-128)" before (1.1), after (1.2) |
| `app` | create | `tests/price-post-intent.test.js` | scenarios of `web-price-guide-post` (1.2) |
| `app` | modify | `src/content/blog/cuanto-cuesta-una-pagina-web-en-sevilla.md` | description, intro, leads, gap sections, `updatedDate` (1.2) |
| `app` | modify | `src/data/seo-intents.ts` | post row `descriptionSignal` (1.2) |
| `app` | modify | `tests/fixtures/blog-posts.baseline.json` | regenerated; only this post's entry changes (1.2) |

Reused, not written: `tests/helpers/post-sections.js` (NRD-127). If it is missing because NRD-127 has not merged, stop and merge `develop` first; never create a divergent copy.

### Interfaces

```js
// tests/price-post-intent.test.js (assertions), helpers from tests/helpers/post-sections.js
// worksTerm(t): normaliseTerm(t).includes("cuanto cuesta una pagina web") && includes("sevilla")
// worksTerm(title) && worksTerm(description); description.length <= 160
// description.includes(intentMatrix row.descriptionSignal)
// sections(body).every(isDirectAnswer)
// numbersOf(body) ⊆ {"2","5","75","10"}, where numbersOf strips link URLs "(...)" and
//   leading list markers /^\s*\d+\.\s/m before matching /\d+/g
// !/€|\beuros?\b|\bEUR\b/i.test(body)
// /\]\(\/diseno-web-sevilla\/\)/.test(body); reciprocal pair with /diseno-web-sevilla/ holds
// updatedDate exists, >= pubDate, <= today
// every "garantiz" sentence is negated
// headings include "¿Qué debo revisar en una propuesta económica?" and
//   "¿Qué preguntas debo hacer antes de contratar una web?"
```

### Data

Content only, one registry string and a regenerated fixture. No storage, schema, settings or price change; no migration.

### Test plan (TDD order)

1. Task 1.1: evidence, no tests.
2. Task 1.2: merge `develop` (NRD-127 merged). RED: `tests/price-post-intent.test.js`; record failing assertions (description, leads, `updatedDate`; the number guard passes before and after, it is a regression guard). Scenarios: "Term in title, H1 and description", "Leads measured on the Markdown", "Number set unchanged", "Hub link and pair", "Guarantees only in negative form", "Update date set and coherent".
3. GREEN: edit the post and the `descriptionSignal`; `node --test tests/*.test.js` (includes `single-price-source`, `diseno-web-template`).
4. `pnpm build && node scripts/check-seo-18.mjs --write`; the baseline diff touches only this slug; `pnpm check:seo:dist` (02, 06, 07, 18, 21, ownership). Scenarios: "Intent signals in the built post", "Built dates agree", "Pointer to the published price".
5. Lighthouse after (preview, median of 3). Format only edited files.

### Real-browser / e2e checks

- 375 px and 320 px: post readable, lists and any new section wrap, links focusable; no horizontal scroll.
- Header shows "Publicado el 7 de julio de 2026 · Actualizado el <fecha>".
- Rich Results Test: `Article` (`dateModified`) and `BreadcrumbList` 0 errors.
- No "€" or price visible anywhere in the post (QA reads the page; the test guards the source).
- LCP and CLS before/after in the CWV record.
- Specialist reviews: `seo-review` with the task 1.1 sample (SEO-2, SEO-4, GEO-1, GEO-4, DEL-5).

### ADRs relied on

0004, 0005, 0008, 0012, 0013 (step 9b), 0017. No new ADR.

## Owner-account actions (executed by the orchestrator)

- Search Console URL Inspection of the post after the promotion that contains NRD-127 and NRD-128: **executable owner action** (Search Console API). Optional follow-up, not part of the Definition of Done; no owner action is needed to develop the story.

## Risks / Trade-offs

- **A price guide without prices may underperform price-list competitors.** Accepted until the user decides S-2026-11-13-1; the post links to the published fixed price instead. The evidence entry records how many competitors publish figures, so the PO has data for that decision.
- **Shared files and order with NRD-127.** Blocked by NRD-127 (helper, baseline); merge back to back so both reach `develop` in the same promotion window.
- **Signal change.** `descriptionSignal` changes with the description; `check-seo-07` catches a mismatch.
- **DataForSEO unavailable:** as in NRD-127.

## UI spec

Prose-only change. The post keeps its route, layout and components: `src/layouts/BlogPostLayout.astro` (breadcrumbs, `post-header` with H1, `post-lede`, `post-meta`; `post-prose` body; `SeoLocalRelated`; `SeoLocalClosing`). No component, token, style, class or layout region is added or changed. Checklist items 3 (states: static page, no data-driven element), 6 (responsive: no new layout) and 7 (interactions) are n/a beyond the notes below. No "New component".

### Visible header (`BlogPostLayout.astro`, `post-header`)

- H1: unchanged (`title`).
- Lede (`p.post-lede`, `--text-secondary`, 52ch): renders the frontmatter `description` verbatim, so the new description is visible copy, not only meta. Use the design's description exactly: `Cuánto cuesta una página web en Sevilla: qué factores influyen en el precio, qué partidas comparar en cada presupuesto y qué preguntar antes de contratar.` Assumption: its opening repeats the H1 wording; accepted because `check-seo-07` and the term scenario need it, and the colon turns it into the guide's table of contents rather than a second title.
- Meta line (`p.post-meta`): `Por Nuria Romero Castillo · Publicado el 7 de julio de 2026 · Actualizado el <fecha>`, produced by the existing `updatedDate` branch; nothing to build. The date is the content commit's date (real change only).

### Body (`src/content/blog/cuanto-cuesta-una-pagina-web-en-sevilla.md`, `post-prose`)

Hierarchy: the reader's question is "how much?"; the honest answer is "it depends on scope; here is what to compare; here is a real fixed price". Reading order: lede, intro, "Respuesta corta", the reasons the price varies, what to check, what to ask, how I work plus the pointer to the published price. Every H2 is followed by its lead as a separate paragraph (blank line after it), then the existing content. No H3, table, bold lead, callout or new Markdown construct is added; existing `**bold**` list labels stay. No digit and no "€"/"euro"/"EUR" in any new string (the test guards it); numbers in words are also avoided in new copy.

1. **Intro (first paragraph, no heading).** Replace the current three sentences with: `No hay una tarifa única para una web: el precio sale del trabajo que incluye. Por eso esta guía no da cifras de mercado y se centra en lo que sí puedes comparar entre presupuestos.` Assumption: replaces the design's proposed intro, which repeated both the lede ("qué partidas comparar y qué preguntar") and the "Respuesta corta" lead ("alcance, el contenido y el trabajo técnico"); three consecutive statements of the same idea would bury the answer. It keeps the honesty note (no market figures) in one line.
2. **`## Respuesta corta`** lead: the design's text verbatim (2 sentences, 37 words). Nothing follows it.
3. **`## ¿Qué hace variar el presupuesto de una web?`** lead: the design's text verbatim. Then, as its own paragraph, the existing sentence `Dominio, alojamiento, mantenimiento y licencias también pueden cobrarse aparte; pide que cada partida y su renovación queden claras en la propuesta.` unless the yearly-costs gap section is added (then that sentence moves there, see 4b). The current first sentence ("Una web sencilla con una plantilla...") is dropped: the lead now carries it.
4. **Gap sections** (only if the 1.1 gap list or PAA supports them; at most two). Placement: directly after "¿Qué hace variar el presupuesto de una web?" and before "¿Qué debo revisar en una propuesta económica?", in this order. Assumption: they extend "what moves the price", so they belong next to it, before the checklist sections.
   - 4a. `## ¿Qué cambia entre una web sencilla, una corporativa y una tienda online?` Lead: the design's text verbatim. Optional second paragraph, only if it reads naturally: `Si lo que necesitas es vender por internet, revisa qué incluye el [presupuesto de una tienda online](/tienda-online-sevilla/).` Assumption: the anchor reuses the registered row anchor, so the link text matches the related block and reads on its own.
   - 4b. `## ¿Qué gastos se pagan cada año?` Lead: the design's text verbatim. Second paragraph: `Pide que la propuesta indique cada renovación, quién la paga y a nombre de quién queda.` Assumption: condenses the sentence moved from section 3; "a nombre de quién" echoes the ownership item already in the post.
5. **`## ¿Qué debo revisar en una propuesta económica?`**: unchanged (lead passes; heading is an intent signal; keep it byte-exact).
6. **`## ¿Qué debe incluir una web profesional para un negocio local?`** lead: the design's text verbatim, then the existing line `Cuando compares presupuestos, comprueba que incluyan:` and the list, unchanged.
7. **`## ¿Qué preguntas debo hacer antes de contratar una web?`** (heading byte-exact): lead paragraph before the list, the design's text verbatim; the numbered list and the closing line `Si alguien no puede responderte con claridad a estas cinco, sigue buscando.` stay.
8. **`## ¿Cómo trabajo en cada proyecto?`** in three paragraphs:
   - Lead (alone): the design's text verbatim (`En cada propuesta detallo el alcance, ... para que sepas qué pagas y qué queda fuera.`). The old sentence "En cada propuesta detallo el alcance, el trabajo de SEO técnico previsto, los costes recurrentes y el soporte incluido." is removed from the following paragraph so it is not said twice.
   - Second paragraph: `Soy [desarrolladora de software con más de 10 años de experiencia](/sobre-mi/). El rendimiento final depende del contenido, los recursos y el entorno de uso; si la medición es importante para tu proyecto, podemos acordar cómo comprobarlo.` (existing sentences, link and "10" unchanged.)
   - Closing paragraph (pointer to the published price): `Si buscas una referencia concreta, consulta [el precio cerrado de mi servicio de diseño web](/diseno-web-sevilla/) y qué incluye, o [escríbeme con los detalles de tu proyecto](/contacto/).` Assumption: replaces the design's closing line so each anchor names its destination out of context ("el precio cerrado..." says why to click; the contact anchor matches the registered conversion anchor). "Precio cerrado" is the service page's own term (`src/data/services.ts`), and the figure is not written. Link targets are exactly `/diseno-web-sevilla/` and `/contacto/` with the trailing slash.

### Tone and copy rules

- Spanish, second person singular (tú), close and direct, as the rest of the post; no jargon added; business language before technical detail (PRODUCT.md principles 1 and 3).
- No promise: no new sentence uses "garantiz"; the two existing ones stay negated.
- No placeholder text; every string above is final except the `updatedDate` value.

### Design system reuse

- Prose renders only through the `.post-prose` rules in `src/layouts/BlogPostLayout.astro`: `p`/`ol`/`ul` at 1.0625rem, `--text-secondary`, 68ch; `h2` with `--text-strong` and `scroll-margin-top`; links with `--text-body`, `--sky-signal` underline and focus outline. The header uses `.post-lede` and `.post-meta` (`--text-muted`).
- `SeoLocalRelated` (fed by `internalLinksBySource` in `src/data/internal-links.ts`) and `SeoLocalClosing` stay as they are; the related block keeps satisfying the `check-seo-06` anchors.

### Responsive

- 320 px to desktop: the new H2s are long questions; they wrap within the `clamp(1.5rem, 3vw, 1.875rem)` size with no truncation. Lead paragraphs and lists reflow; nothing hides or stacks differently. No horizontal scroll (QA real-browser check in the design).

### Accessibility hand-off

- Heading outline stays one H1 then H2s only, in the reading order above; no level skipped.
- Every body link has descriptive text that makes sense out of context (no "aquí", no bare URL). No new interactive element, image, icon or announcement.
- The visible lede equals the meta description, so assistive technology and search snippets say the same thing.

### GEO-ready content

- Each H2 opens with a 1-2 sentence, 15-45 word direct answer before the context (sections 2-8 above).
- "Actualizado el" shows the real content-commit date only; never a fixed or backdated value.
- No brand string is added to the body; the byline keeps `Nuria Romero Castillo` as rendered by the layout. No keyword stuffing and no hidden text: the term appears in the lede and, naturally, in the "Respuesta corta" lead.
