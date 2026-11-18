# Design

## Context

[NRD-127](https://nuriaromerodev.atlassian.net/browse/NRD-127), phase 5 step 9a of ADR 0013. The post is `src/content/blog/como-aparecer-en-google-maps-negocio-sevilla.md` (content collection `blog`, schema in `src/content/config.ts`: `title`, `description`, `pubDate`, optional `updatedDate`). It renders through `src/pages/blog/[slug].astro` and `src/layouts/BlogPostLayout.astro`: the frontmatter title is the only H1, the description is the lede and the meta description, `updatedDate` drives the "Actualizado el" `time` element and `Article.dateModified` (`articleSchema`, `src/lib/schema.ts:231-242`), and the related block comes from `internalLinksBySource["/blog/como-aparecer-en-google-maps-negocio-sevilla/"]` (`src/data/internal-links.ts`). Sitemap `lastmod` comes from `updatedDate`/`pubDate` only (invariant, `getBlogLastmodBySlug`).

Guards touching the post: `scripts/check-seo-18.mjs` freezes every post (title, description, canonical, `Article`, `BreadcrumbList`, body text and body links) in `tests/fixtures/blog-posts.baseline.json`; its header prescribes `pnpm build && node scripts/check-seo-18.mjs --write` in the same commit when a story edits a post on purpose. `check-seo-07` checks the `intentMatrix` row (title "Cómo aparecer en Google Maps", description "Perfil de Empresa", H1 "Cómo aparecer en Google Maps", content headings "¿Cómo conecto la ficha con mi página web?" and "¿Prefieres que te lo deje montado?"). `check-seo-06` checks the four link rows; `check-seo-21` checks dates and sitemap coherence; `check-seo-02` trailing slash and breadcrumbs (G1a done, NRD-113); keyword ownership (G6).

Current state measured on the Markdown with the direct-answer rule of NRD-245 (first block a paragraph of 1-2 sentences and 15-45 words):

| H2 | Lead today | Verdict |
| --- | --- | --- |
| Respuesta corta | 2 sentences, 51 words | too long |
| ¿Qué es Google Business Profile y por qué es gratis? | 2 sentences, 44 words; never says it is free | passes the count, does not answer; rewrite |
| ¿Cómo creo o reclamo mi ficha...? | numbered list | no lead |
| ¿Qué información debo completar en la ficha? | 2 sentences, 39 words | passes |
| ¿Cómo consigo reseñas que marquen la diferencia? | 2 sentences, 27 words | passes |
| ¿Cómo conecto la ficha con mi página web? | 12 words | too short |
| ¿Cómo mantengo la ficha actualizada? | 8 words | too short |
| ¿Cuánto tarda en notarse? | 2 sentences, 33 words | passes |
| ¿Prefieres que te lo deje montado? | 26 words, no hub link | passes; add hub link |

## Goals / Non-Goals

**Goals:** SEO-2 closed with a measured sample (or the gap named); SEO-1 description; GEO-1 direct answers; SEO-6 hub link in the body; GEO-4 `Article` and `BreadcrumbList` kept with trailing slash; real `updatedDate`; CWV before and after; DEL-5.

**Non-Goals:** title/H1/URL changes, figures, FAQPage, images, layout changes, other posts.

## Decisions

### Approach

Two subtasks: evidence, then one content commit guarded by a new Markdown-level test. The test works on the source (frontmatter and H2 sections) because the rules are about owner copy; the built-page checks (07, 06, 18, 21, 02, G6) cover the rendered result. The helper that splits a post into sections lives in `tests/helpers/` so NRD-128 reuses it. Copy changes are surgical: rewrite only the failing leads plus the one that does not answer, add the hub link, add gap sections only from the measured list, set `updatedDate`. The baseline is regenerated in the same commit and its diff must touch only this post.

### Evidence (task 1.1)

- **SERP (1 call):** DataForSEO `serp/google/organic/live/advanced`, `Seville,Andalusia,Spain`, `es`, mobile, depth 10, `como aparecer en google maps`. Record local pack, AI Overview, People Also Ask (literal), organic domains in order with page type and URL.
- **Sample (at most 5 calls):** `on_page/content_parsing/live` for the first five organic results that are guides or articles (videos, forums and Google's own help pages are named, not measured). Record main-content words per page and the median; compare with the post body (`data-post-body` visible words; 786 in the inventory, row 5).
- **Subtopic table and gap list:** rows are the H2/H3 subtopics of the measured guides; columns are the competitors and this post. A gap is a subtopic covered by at least two measured competitors, or present in PAA, that the post does not answer. The list feeds task 1.2; it is the only source of new sections.
- **Who runs the calls:** an agent with `mcp__dataforseo__*` (the orchestrator itself or `team-harness:seo-strategist`); the developer agent has no DataForSEO tools (NRD-97). Never simulated. Fallback: `curl` of each page, same counting rule, labelled "medido con curl, no DataForSEO"; without either, "sin dato (<reason>)", no length target and no new section.
- **CWV baseline:** Lighthouse 12.8.2 mobile, median of 3, the NRD-18 command (`npx -y lighthouse@12.8.2 <url> --form-factor=mobile --output=json --chrome-flags="--headless=new" --quiet`, never in `package.json`) on the production URL and on `pnpm build && pnpm preview` of the untouched branch; task 1.2 repeats the preview runs after the edit.
- **Where:** `docs/seo-audit/keyword-clusters-2026-11.md`, section "SEO local", entry "Dato observado (NRD-127, YYYY-MM-DD), SL-4 `como aparecer en google maps`", next to the existing SL-4 line; CWV in `docs/seo-audit/full-audit-2026-09-21/tasks/04-validar-cwv-y-lcp.md`, final section "Medición YYYY-MM-DD (NRD-127)" (own section per story to avoid branch conflicts).
- **Budget:** at most 6 DataForSEO calls.

### Copy (task 1.2)

Proposals; the UI spec may refine them within the scenarios. Counts measured with the test's rule.

- **Description** (158 chars): `Cómo aparecer en Google Maps con tu negocio en Sevilla: crear y verificar el Perfil de Empresa, completar la ficha, conseguir reseñas y conectarla con tu web.`
- **Respuesta corta** (2 sentences, 44 words): `Para aparecer en Google Maps, crea o reclama la ficha de tu negocio en Google Business Profile, verifícala y complétala con datos reales y coherentes con tu web. Ninguna acción garantiza una posición, pero una ficha completa y activa da mejor información a Google.`
- **¿Qué es Google Business Profile y por qué es gratis?** (2 sentences, 39 words): `Google Business Profile, antes Google My Business, es la ficha gratuita de tu negocio en Google: la tarjeta con fotos, horario, reseñas y teléfono que puede salir en Maps y en la Búsqueda. Crearla y mantenerla no cuesta nada.` The existing second sentence about keeping it updated stays as a following paragraph or is folded in.
- **¿Cómo creo o reclamo mi ficha...?** lead before the list (33 words): `Entra en Google Business Profile con tu cuenta de Google, busca tu negocio y reclama la ficha si ya existe o créala si no; después verifícala con el método que Google te ofrezca.`
- **¿Cómo conecto la ficha con mi página web?** lead (28 words): `Usa en la web exactamente el mismo nombre, dirección y teléfono que en la ficha, enlaza cada una desde la otra y describe el negocio con datos estructurados.` The list stays (its intro line "Para que Google confíe:" becomes part of the list context, not the lead).
- **¿Cómo mantengo la ficha actualizada?** lead (30 words): `Revisa la ficha cada vez que cambie algo del negocio, como el horario de festivos, las fotos o los servicios, y responde a las preguntas y reseñas que vayan llegando.`
- **¿Prefieres que te lo deje montado?** (heading kept, content signal): `Puedo ayudarte a completar la ficha, conectarla con tu web y preparar un enlace para pedir reseñas, dentro de mi [servicio de SEO local y GEO](/seo-local-sevilla/).` followed by the existing `[Cuéntame tu caso](/contacto/)` sentence.
- **Gap candidate** (only if task 1.1 lists it or PAA asks it): `## ¿Por qué no aparece mi negocio en Google Maps?`, lead (33 words): `Lo más habitual es que la ficha no esté verificada, que esté suspendida por incumplir las directrices o que, para esa búsqueda, Google vea otras fichas más relevantes, más cercanas o más conocidas.` Then a short list linking the official pages already cited in the post (verification `support.google.com/business/answer/7107242`, guidelines `.../3038177`, local ranking `.../7091`). Placed after "¿Cómo mantengo la ficha actualizada?". A second gap section, if any, follows the same rules.
- **`updatedDate`:** the date of the content commit (YYYY-MM-DD). It is the content's real last change, the collection's equivalent of a CMS field; never a build date, never bumped without a content change.
- No new figures, no promise of position (every "garantiz" sentence negated), Spanish copy, trailing-slash internal links.

### Files

| Layer | Action | Path | Notes |
| --- | --- | --- | --- |
| `app` | modify | `docs/seo-audit/keyword-clusters-2026-11.md` | SL-4 "Dato observado (NRD-127)" (1.1) |
| `app` | modify | `docs/seo-audit/full-audit-2026-09-21/tasks/04-validar-cwv-y-lcp.md` | "Medición (NRD-127)" before (1.1), after (1.2) |
| `app` | create | `tests/helpers/post-sections.js` | Markdown frontmatter and H2 section reader (1.2; reused by NRD-128) |
| `app` | create | `tests/maps-post-intent.test.js` | scenarios of `maps-guide-post` (1.2) |
| `app` | modify | `src/content/blog/como-aparecer-en-google-maps-negocio-sevilla.md` | description, leads, hub link, gap sections, `updatedDate` (1.2) |
| `app` | modify | `tests/fixtures/blog-posts.baseline.json` | regenerated with `check-seo-18 --write`; only this post's entry changes (1.2) |

`src/data/seo-intents.ts` and `src/data/internal-links.ts` are read, not written (signals and rows already match).

### Interfaces

```js
// tests/helpers/post-sections.js
/** Parse a blog post: frontmatter fields as strings, body without frontmatter. */
export function readPost(slug) // -> { data: { title, description, pubDate, updatedDate? }, body }
/** Strip Markdown links to their text and remove ** markers. */
export function plainText(markdown) // -> string
/** H2 sections in order: heading text and first block (trimmed, up to the first blank line). */
export function sections(body) // -> [{ heading, lead, isParagraph }]
/** Direct-answer rule (NRD-245): paragraph, 1-2 sentences, 15-45 words. */
export function isDirectAnswer({ lead, isParagraph }) // -> boolean
/** Sentences of a text, split on . ! ? followed by space or end. */
export function sentences(text) // -> string[]
```

`isParagraph` is false when the first block starts with `- `, `* `, `1. ` (any digit), `|` or `>`. Words are whitespace tokens of `plainText(lead)`. The frontmatter parser handles the flat `key: value` lines this collection uses (quoted strings, ISO dates, inline arrays); no YAML dependency.

```js
// tests/maps-post-intent.test.js (assertions)
// worksTerm(title): normaliseTerm(title).includes("como aparecer en google maps")
// description.length <= 160; includes("Google Maps") && includes("Perfil de Empresa")
// sections(body).every(isDirectAnswer)
// /\]\(\/seo-local-sevilla\/\)/.test(body)
// updatedDate exists, >= pubDate, <= today
// every sentence of plainText(body) matching /garantiz/i matches /\b(no|ninguna|ningún|nadie|sin)\b/i
// headings include "¿Cómo conecto la ficha con mi página web?" and "¿Prefieres que te lo deje montado?"
// reciprocalLinks pair (post -> /seo-local-sevilla/) and both anchors in internalLinksBySource
```

### Data

Content only (one Markdown file) and a regenerated test fixture. No storage, schema or settings change; no migration.

### Test plan (TDD order)

1. Task 1.1: evidence, no tests.
2. Task 1.2 RED: write `tests/helpers/post-sections.js` and `tests/maps-post-intent.test.js`; run `node --test tests/maps-post-intent.test.js` and record the failing assertions (description, leads, hub link, `updatedDate`). Scenarios: "Term in title, H1 and description", "Leads measured on the Markdown", "Hub link in the body", "Guarantees only in negative form", "Update date set and coherent".
3. GREEN: edit the post; `node --test tests/*.test.js`.
4. `pnpm build && node scripts/check-seo-18.mjs --write`; inspect `git diff tests/fixtures/blog-posts.baseline.json` (only this slug; `dateModified` = `updatedDate`); then `pnpm check:seo:dist` (02, 06, 07, 18, 21, ownership). Scenarios: "Intent signals in the built post", "Related block and pair kept", "Built dates agree", "Intentional post edit regenerates the baseline".
5. Lighthouse after (preview, median of 3) in the CWV record. `pnpm format` only on edited files (the Markdown and the two test files).

### Real-browser / e2e checks

- 375 px and 320 px: the post reads cleanly, new section and lists wrap, the body hub link is visibly a link with focus ring; no horizontal scroll.
- The header shows "Publicado el 1 de julio de 2026 · Actualizado el <fecha>".
- Rich Results Test or Schema Markup Validator: `Article` (`dateModified` = update date) and `BreadcrumbList` (trailing slash) with 0 errors.
- LCP and CLS before/after (CWV record); the LCP element should remain the H1 or lede text.
- Specialist reviews: `seo-review` with the task 1.1 sample (SEO-2, GEO-1, GEO-4, DEL-5), `ux-review` and `a11y-responsive` only if markup changes beyond Markdown prose.

### ADRs relied on

0004, 0005 (sitemap and SEO checks), 0008 (Spanish copy), 0012 (ownership), 0013 (step 9a, posts), 0017 (freshness: blog dates stay frontmatter-driven). No new ADR.

## Owner-account actions (executed by the orchestrator)

- Search Console URL Inspection of the post after the scheduled promotion that contains NRD-127 and NRD-128: **executable owner action** (Search Console API). Optional follow-up, not part of the Definition of Done; no owner action is needed to develop the story.

## Risks / Trade-offs

- **Shared files with NRD-128.** Both stories regenerate `tests/fixtures/blog-posts.baseline.json` (adjacent entries) and NRD-128 reuses the helper; NRD-127 `Blocks` NRD-128 and NRD-128 merges `develop` before its content commit. Both must land in `develop` within the same promotion window (PO): merge them back to back.
- **A just-indexed URL changes content.** Title, H1, URL and canonical stay; the edit improves answers, so the risk of losing the index entry is low.
- **DataForSEO unavailable to the executing agent.** The orchestrator runs the calls; fallback labelled; without a sample no section is added.
- **Word-count comparison bias.** Competitor main content versus our post body; both bases are recorded and no target is derived from them alone.

## UI spec

Scope: prose and frontmatter of `src/content/blog/como-aparecer-en-google-maps-negocio-sevilla.md` only. No change to `src/layouts/BlogPostLayout.astro`, `src/pages/blog/[slug].astro`, components, styles or tokens. Mode: Read (the visitor wants to understand how to get the business on Google Maps). Word, sentence and character counts below were measured with the rule of `tests/helpers/post-sections.js` (`plainText`, whitespace tokens, split on `. ! ?` followed by space or end); the developer re-measures with the real helper.

### Post page (`/blog/como-aparecer-en-google-maps-negocio-sevilla/`)

**1. Screens and layout.** Unchanged. Region order stays: breadcrumbs, `header.post-header` (H1 from `title`, `p.post-lede` from `description`, `p.post-meta` with author and dates), `div.post-prose[data-post-body]`, related block (`SeoLocalRelated`, from `internalLinksBySource`), closing band (`SeoLocalClosing`). Section order in the body: intro paragraph (unchanged), "Respuesta corta", "¿Qué es Google Business Profile y por qué es gratis?", "¿Cómo creo o reclamo mi ficha de Google Business Profile?", "¿Qué información debo completar en la ficha?", "¿Cómo consigo reseñas que marquen la diferencia?", "¿Cómo conecto la ficha con mi página web?", "¿Cómo mantengo la ficha actualizada?", gap section(s) if any (see 4.9), "¿Cuánto tarda en notarse?", "¿Prefieres que te lo deje montado?". H2 texts are not changed.

**2. Hierarchy.** Per section the direct-answer paragraph is the first thing read after the H2 and must stand alone (a reader who stops there has the answer); lists, official-source links and the "web bien hecha" aside are secondary. The single conversion in the body stays the last section; the primary page CTA stays the closing band ("Reserva una llamada"). The hub link sits in the last section, after the reader has the whole method, not in a lead.

**3. States.** n/a (static prose, no data-driven element). The only conditional UI is the existing "Actualizado el" span in `p.post-meta`, which appears because `updatedDate` is set.

**4. Copy (exact strings, Spanish).** Tone: tú, imperative verbs, plain business language, no promise of position (PRODUCT.md, invariant "No promised rankings"). Terminology: "Google Business Profile" in the body, "Perfil de Empresa" as its Spanish name (used in the description and introduced once in 4.3); "ficha" for the listing everywhere.

4.1 `description` (frontmatter; renders as the lede and the meta description), 152 chars:
`Pasos para aparecer en Google Maps con tu negocio en Sevilla: crea y verifica tu Perfil de Empresa, complétalo, consigue reseñas y conéctalo con tu web.`
Assumption: replaces the design's proposal because the lede sits right under the H1 "Cómo aparecer en Google Maps si tienes..."; opening the lede with "Cómo aparecer en Google Maps" again repeats the heading word for word. Same signals ("Google Maps", "Perfil de Empresa"), imperative voice like the body.

4.2 "Respuesta corta", first paragraph replaced (2 sentences, 41 words):
`Para aparecer en Google Maps, crea o reclama tu ficha en Google Business Profile, verifícala y complétala con datos reales y coherentes con tu web. Ninguna acción garantiza una posición, pero una ficha completa y activa da mejor información a Google.`
Assumption: design text trimmed by 3 words ("de tu negocio" became "tu") to leave margin under 45.

4.3 "¿Qué es Google Business Profile y por qué es gratis?", first paragraph replaced (2 sentences, 41 words):
`Google Business Profile (Perfil de Empresa en español; antes, Google My Business) es la ficha gratuita de tu negocio: la tarjeta con fotos, horario, reseñas y teléfono que puede salir en Maps y en la Búsqueda. Crearla y mantenerla es gratis.`
Followed by the existing sentence as its own paragraph, unchanged: `Mantenerla actualizada ayuda a que los clientes encuentren información práctica del negocio.`
Assumption: adds "Perfil de Empresa" so the name in the lede/description and the name in the body are visibly the same product; the design's version measured 45 words (at the limit), this one 41.

4.4 "¿Cómo creo o reclamo mi ficha de Google Business Profile?", new paragraph before the existing numbered list (2 sentences, 31 words); the list stays unchanged:
`Busca tu negocio en Google Business Profile con tu cuenta de Google: si ya tiene ficha, reclámala; si no, créala. Después verifícala con uno de los métodos que Google te ofrezca.`
Assumption: reworded from the design so the order matches the list (search, claim or create, verify) and avoids repeating step 1's "Entra en google.com/business" verbatim.

4.5 "¿Qué información debo completar en la ficha?" and "¿Cómo consigo reseñas que marquen la diferencia?": unchanged (they pass).

4.6 "¿Cómo conecto la ficha con mi página web?", new first paragraph (1 sentence, 28 words):
`Usa en la web exactamente el mismo nombre, dirección y teléfono que en la ficha, enlaza cada una desde la otra y describe el negocio con datos estructurados.`
Then the existing line `La ficha y la web se refuerzan mutuamente. Para que Google confíe:` stays as the second paragraph introducing the unchanged list, and the closing `Este último punto ... [así las construyo yo](/diseno-web-sevilla/).` stays.
Assumption: keeping the existing intro line (rather than dropping it) is the smallest edit; "datos estructurados" is explained by the third list item.

4.7 "¿Cómo mantengo la ficha actualizada?", new first paragraph (1 sentence, 30 words), replacing `Mantén la información de la ficha al día:`:
`Revisa la ficha cada vez que cambie algo del negocio, como el horario de festivos, las fotos o los servicios, y responde a las preguntas y reseñas que vayan llegando.`
Then a list intro paragraph `Una rutina sencilla:` before the unchanged list.
Assumption: the old intro line repeated the heading; the new lead says it better, and a short intro keeps the list from following a sentence that already ends in a full stop.

4.8 "¿Prefieres que te lo deje montado?", the paragraph replaced by one paragraph (2 sentences, 35 words; the hub link is here):
`Puedo ayudarte a completar la ficha, conectarla con tu web y preparar un enlace para pedir reseñas, dentro de mi [servicio de SEO local y GEO](/seo-local-sevilla/). [Cuéntame tu caso](/contacto/) y revisamos qué necesita tu negocio.`
The anchor "servicio de SEO local y GEO" is the registered anchor of the row `/seo-local-sevilla/` in `internalLinksBySource` (`src/data/internal-links.ts:112`); it appears both here and in the related block, which is intended. Both sentences stay in one paragraph (one block, so the lead is the whole paragraph).

4.9 Gap section(s), only if the task 1.1 gap list names the subtopic (at most two). For the candidate, placed after "¿Cómo mantengo la ficha actualizada?":
- H2: `¿Por qué no aparece mi negocio en Google Maps?`
- Lead (1 sentence, 33 words): `Lo más habitual es que la ficha no esté verificada, que esté suspendida por incumplir las directrices o que, para esa búsqueda, Google vea otras fichas más relevantes, más cercanas o más conocidas.`
- Unordered list (Assumption: exact items written by UX; each links an official Google page already cited in the post, wording hedged with "puede" where Google does not state an absolute):
  - `**Ficha sin verificar**: puede no mostrarse en Maps ni en la Búsqueda hasta que la verifiques ([cómo verificar la ficha](https://support.google.com/business/answer/7107242?hl=es)).`
  - `**Ficha suspendida**: revisa que el nombre, la dirección y la categoría cumplan las [directrices de Google](https://support.google.com/business/answer/3038177?hl=es).`
  - `**Otras fichas más relevantes**: Google ordena los resultados locales por relevancia, distancia y prominencia ([cómo funciona el posicionamiento local](https://support.google.com/business/answer/7091?hl=es)).`
- A second gap section, if listed: question-form H2 in the same sentence-case Spanish as the others, a lead that passes `isDirectAnswer`, at least one official Google link, placed after the first gap section and before "¿Cuánto tarda en notarse?". No section without a gap-list entry; no copy is pre-written for it.

4.10 `updatedDate`: the date of the content commit; the header then reads `Por Nuria Romero Castillo · Publicado el 1 de julio de 2026 · Actualizado el <d> de <mes> de <aaaa>` (existing format from `formatDate`, `es-ES`).

4.11 Unchanged: title/H1, URL, intro paragraph (its "no se puede garantizar" is already negated), "¿Cuánto tarda en notarse?", every existing link and its anchor.

**5. Design system reuse.** Everything renders through the existing `.post-prose` rules in `src/layouts/BlogPostLayout.astro` (paragraphs `--text-secondary`, 68ch; H2 `--text-strong`; links underlined with `--sky-signal-rgb`, hover `--sky-accent`, focus ring `--sky-signal`; `ul` markers `--sky-signal`; `strong` `--text-strong`) and `.post-lede` (52ch). Use plain Markdown only: paragraphs, `##`, `-` lists, `**bold**` for list labels as the existing lists do, inline links. No HTML, no H3, no table, blockquote or image. No new component.

**6. Responsive.** No new behavior. At 320 px the 152-char lede wraps within `.post-lede` and the longer leads wrap within `.post-prose`; the gap section's long anchors ("cómo funciona el posicionamiento local") wrap like the existing ones. No horizontal scroll.

**7. Interactions.** Only the existing link states of `.post-prose a` (hover color, `focus-visible` outline). Both new body links (hub, and gap-list links if added) are standard inline links, same tab, no `target="_blank"` for the internal hub link; external Google links follow the existing post (Markdown default, same tab).

**8. Accessibility hand-off.** Heading levels stay H1 then H2 only. Link text makes sense out of context (no "aquí"). Reading and focus order equal source order: the hub link is the first focusable element of the last section, before "Cuéntame tu caso". No async content.

**9. GEO-ready content.** Every H2 opens with a 1-2 sentence answer (4.2-4.9); the "Actualizado el" date comes from `updatedDate`, the real content change (4.10), never faked. Brand: the post body names no brand string beyond the author line rendered by the layout; no keyword stuffing ("Google Maps" is not added to leads that do not need it) and no hidden text.
