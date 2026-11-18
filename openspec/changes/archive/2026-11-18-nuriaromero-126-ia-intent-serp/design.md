# Design

## Context

[NRD-126](https://nuriaromerodev.atlassian.net/browse/NRD-126), phase 5 step 7 of ADR 0013. The page renders from `inteligenciaArtificial` (`src/data/services.ts:408`) through `src/pages/inteligencia-artificial.astro` on the template (`ServiceLayout variant="template"`, NRD-169). Its only H1 is the keyword heading of `SeoLocalHero` (`hero.h1`, rendered as `<h1 class="tpl-kw">` by `src/components/seo-local/SectionHeading.astro`); the large display line "IA que responde con tu información" is a `<p>`. `ServiceLayout.astro:40-43` feeds `Service.name` from `hero.h1` and `Service.description` from `seo.description`. `SEO.astro` appends the brand suffix to `seo.title` (ADR 0016).

Blockers are done: G4 (NRD-112, checks in CI), G5 (NRD-118, one-H1 guard), step 0 (NRD-119, registry and link rows). Indexation precondition met (comment of 2026-11-17).

Current signals and guards:

| Element | Today | Guard |
| --- | --- | --- |
| `seo.title` | `IA para negocios en Sevilla \| Chatbots y asistentes con IA` | `tests/seo-meta-titles.test.js:76` (frozen), `tests/ia-template.test.js:266`, `check-seo-07` (`titleSignal`) |
| `hero.h1` | `Inteligencia artificial aplicada a tu negocio` (6 words) | `tests/ia-template.test.js:264`, `check-seo-07` (`h1Signal`), one-H1 guard |
| `seo.description` | `Llevo la IA a tu negocio en Sevilla con más de 10 años de experiencia en desarrollo: chatbots que atienden clientes y agentes que reservan o toman pedidos.` | `tests/seo-meta-titles.test.js` (<= 160, experience credential), `check-seo-07` (`descriptionSignal`) |
| `<main>` words | 846 of 750-850 (2026-11-17, NRD-25 proposal) | `check-seo-17`, `tests/ia-template.test.js` built-page test |

## Goals / Non-Goals

**Goals:** title, H1 and description work `inteligencia artificial para empresas sevilla`; SERP evidence and a CWV baseline recorded before the edit; links of table A row 3 and the `/automatizaciones/` pair pinned by a test.

**Non-Goals:** new sections or copy, FAQ edits, training intent, word-budget change, `llms.txt` change (its entry already reads "Chatbots y agentes de IA para empresas de Sevilla", consistent with the new copy).

## Decisions

### Approach

Data-only change in `inteligenciaArtificial` plus the registry row, after a recorded evidence task. The SERP formula is "service + Sevilla"; the registered term is the head of IA-2, so the title leads with it and keeps one service noun ("Chatbots"). The H1 swaps one six-word phrase for another so the `<main>` budget does not move (the budget has 4 words of slack). "Works the term" means the normalised text (`normaliseTerm`, `scripts/lib/keyword-ownership.mjs`) contains "inteligencia artificial", "empresas" and "sevilla"; the connector "en" is natural Spanish and keeps the G6 guard satisfied (G6 matches the exact term phrase on other pages only).

Proposed copy (the UI spec may refine within the scenarios):

- Title (59 chars): `Inteligencia artificial para empresas en Sevilla | Chatbots`
- H1 (48 chars, 6 words): `Inteligencia artificial para empresas en Sevilla`
- Description (151 chars): `Inteligencia artificial para empresas en Sevilla: chatbots que atienden clientes y agentes que reservan o toman pedidos. Más de 10 años de experiencia.`

Figures: only "10", already allowed by `tests/ia-template.test.js` ("no figure beyond the price, '10 años' and the pilot weeks").

### Evidence (task 1.1)

- **SERP (1 DataForSEO call):** `serp/google/organic/live/advanced`, `Seville,Andalusia,Spain`, `es`, mobile, depth 10, keyword `inteligencia artificial para empresas sevilla`. It returns the result URLs, which S10 and the 2026-11-17 report did not keep.
- **Word counts (at most 3 calls):** `on_page/content_parsing/live` of the service pages in that top 10 (today `iasevilla.com`, `simebuscas.com`, `robleragency.com`), counting main-content words; record the endpoint and that it is main content, not the whole page. Our figure for comparison: the `<main>` count of `check-seo-17` (owner text, ADR 0015).
- **Who runs the calls:** an agent with the DataForSEO MCP tools (`mcp__dataforseo__*`). The developer agent has none (NRD-97 design): the orchestrator runs the calls itself or through `team-harness:seo-strategist` and passes the results to the subtask. No call is ever simulated. Fallback without DataForSEO: `curl` of each page, main-content words counted the same way, labelled "medido con curl, no DataForSEO"; without either, "sin dato (<reason>)".
- **CWV baseline:** Lighthouse 12.8.2, mobile, median of 3, the NRD-18 command (`npx -y lighthouse@12.8.2 <url> --form-factor=mobile --output=json --chrome-flags="--headless=new" --quiet`; never added to `package.json`), on the production URL and on `pnpm build && pnpm preview` of the untouched branch. Task 1.2 repeats the preview runs after the edit; the before/after pair on preview decides regression, production is the reference baseline.
- **Where:** `docs/seo-audit/keyword-clusters-2026-11.md`, section "IA / automatizaciones", entry "Dato observado (NRD-126, YYYY-MM-DD), IA-2 `inteligencia artificial para empresas sevilla`" (source, task id, local pack, organic domains in order with page type, AI Overview, PAA, word counts and counting basis, comparison with S10 and 2026-11-17, **Inferencia**). CWV in `docs/seo-audit/full-audit-2026-09-21/tasks/04-validar-cwv-y-lcp.md`, new final section "Medición YYYY-MM-DD (NRD-126)" with the conditions and results table format of the NRD-18 section. Each sprint story writes its own section so the three branches do not conflict.
- **Budget:** at most 4 DataForSEO calls for this story (sprint total for NRD-126 to NRD-128 at most 16; `seo.dataforseo.maxCallsPerRun` is 30).

### Files

| Layer | Action | Path | Notes |
| --- | --- | --- | --- |
| `app` | modify | `docs/seo-audit/keyword-clusters-2026-11.md` | IA-2 "Dato observado (NRD-126)" (task 1.1) |
| `app` | modify | `docs/seo-audit/full-audit-2026-09-21/tasks/04-validar-cwv-y-lcp.md` | "Medición (NRD-126)" before (1.1) and after (1.2) |
| `app` | modify | `src/data/services.ts` | `inteligenciaArtificial.seo.title`, `seo.description`, `hero.h1` (1.2) |
| `app` | modify | `src/data/seo-intents.ts` | `/inteligencia-artificial/` row: `titleSignal`, `h1Signal` = `Inteligencia artificial para empresas en Sevilla` (1.2) |
| `app` | create | `tests/ia-intent.test.js` | term, lengths, H1 word count, registry and link assertions (1.2) |
| `app` | modify | `tests/ia-template.test.js` | "intent signals stay as they were": new H1 and title strings (1.2) |
| `app` | modify | `tests/seo-meta-titles.test.js` | frozen `inteligenciaArtificial` title (1.2) |

### Interfaces

```js
// tests/ia-intent.test.js
import { normaliseTerm } from "../scripts/lib/keyword-ownership.mjs";
const worksTerm = (text) => {
  const t = normaliseTerm(text);
  return ["inteligencia artificial", "empresas", "sevilla"].every((p) => t.includes(p));
};
// Assertions: worksTerm(seo.title), worksTerm(hero.h1), worksTerm(seo.description);
// seo.title.length <= 65; seo.description.length <= 160 && includes("años de experiencia");
// hero.h1.split(/\s+/).length === 6 (word budget parity);
// intentMatrix row: hero.h1.includes(h1Signal), seo.title.includes(titleSignal),
//   seo.description.includes(descriptionSignal);
// internalLinksBySource["/inteligencia-artificial/"] has path "/desarrollo-software-medida/";
// reciprocalLinks pair { source: "/automatizaciones/", target: "/inteligencia-artificial/" }
//   with both anchors present in the two link rows.
```

### Data

Static copy only. No storage, schema, settings or price change; no migration.

### Test plan (TDD order)

1. Task 1.1: evidence only (no tests).
2. Task 1.2, RED: create `tests/ia-intent.test.js`; it fails on today's title, H1 and description (record the failing line). Scenarios: "Title, H1 and description work the registered term", "Links to the adjacent services hold".
3. GREEN: edit `services.ts` and the `intentMatrix` row; update the frozen strings in `tests/ia-template.test.js` and `tests/seo-meta-titles.test.js` in the same commit. `node --test tests/*.test.js`.
4. `pnpm build && pnpm check:seo:dist`: `check-seo-07` (signals), keyword ownership (G6), `check-seo-17` (word budget, scenario "Text budget unchanged"; the built-page test in `ia-template.test.js` runs too), one-H1, `check-seo-21` (dates).
5. Lighthouse after (preview, median of 3) recorded next to the baseline. Format only edited files.

### Real-browser / e2e checks

- 375 px and 320 px: the hero keyword H1 (48 chars instead of 45) wraps cleanly, no overflow; display line, subtitle and CTAs unchanged.
- LCP and CLS on the built page (Lighthouse before/after in the CWV record); the LCP element should stay the same text element.
- Rich Results Test or Schema Markup Validator: `Service` (name = new H1), `FAQPage`, `BreadcrumbList` with 0 errors.
- Specialist reviews: `seo-review` (with the task 1.1 reading: SEO-2, GEO-1 to GEO-4, DEL-5), `ux-review`, `a11y-responsive`.

### ADRs relied on

0004 (SEO head and structured data), 0008 (Spanish copy), 0012 (keyword ownership), 0013 (architecture, step 7), 0014 and 0015 (word budget), 0016 (brand suffix), 0017 (freshness). No new ADR.

## Owner-account actions (executed by the orchestrator)

- Search Console URL Inspection of `https://nuriaromero.dev/inteligencia-artificial/` after the scheduled promotion that contains this story, to confirm Google picked up the new title: **executable owner action** (Search Console API). Optional follow-up, not part of the story's Definition of Done; no owner action is needed to develop the story.

## Risks / Trade-offs

- **Title loses "asistentes con IA".** Kept "Chatbots" as the service noun; "agentes" stays in the description. Trade-off accepted for leading with the registered term.
- **Word budget slack is 4 words.** The H1 stays at 6 words; the test pins the word count, and `check-seo-17` catches any drift.
- **DataForSEO unavailable to the executing agent** (happened in NRD-121/122). Mitigation: the orchestrator runs the calls; fallback `curl` counts are labelled; nothing is invented.
- **Small demand.** The exact term has no measured volume; the value is a correct intent signal on an indexed page, not a promised position.

## UI spec

Copy-only change on one existing screen. No component, token, style, layout, slot or markup changes; the developer edits three strings in `inteligenciaArtificial` (`src/data/services.ts`) and nothing under `src/components/`, `src/styles/` or `src/pages/`.

### Screen: `/inteligencia-artificial/` hero (`SeoLocalHero`)

1. **Screens and layout.** Unchanged. `src/pages/inteligencia-artificial.astro` keeps `ServiceLayout variant="template"` and the editorial hero (`src/components/seo-local/SeoLocalHero.astro`, DESIGN.md "The Editorial Hero Rule"): keyword `h1` (`.tpl-kw`), display line `<p class="tpl-display hero-display">`, subtitle, `BookingButton` plus "Ver precio" link, `ChatMock` in the `visual` slot, then `ProofStrip`. Region order stays as today.
2. **Hierarchy.** Unchanged. The display line "IA que responde con tu información" (accent "con tu información") stays the visual lead; the keyword `h1` stays the small sentence-case heading above it (DESIGN.md "The Keyword Heading Rule"); primary action stays "Reserva" booking button. The keyword line now names who and where (empresas, Sevilla), the display line names the promise, so the two lines carry different ideas.
3. **States.** n/a (static copy, no data-driven element changes; the optional Google rating cell in `ProofStrip` is untouched).
4. **Copy** (Spanish, exact strings; site tone, no promise of rankings or AI recommendations):
   - `hero.h1` (visible keyword heading, the page's only `h1`): `Inteligencia artificial para empresas en Sevilla` (6 words, 48 characters). Sentence case: only the first word capitalised plus the proper noun "Sevilla". No trailing period.
   - `seo.title` (not visible on the page; `<title>`, `og:title`, `twitter:title`): `Inteligencia artificial para empresas en Sevilla | Chatbots` (59 characters). The rendered `<title>` becomes `Inteligencia artificial para empresas en Sevilla | Chatbots | Nuria Romero` via `brandedTitle` (`src/lib/seo-title.ts`, ADR 0016); `og:title` and `twitter:title` stay without the suffix, as today. Assumption: Google may cut the rendered title after "Chatbots" on mobile; the registered term sits fully in the first 48 characters, so the truncation loses only the brand suffix, which is acceptable and matches the other service pages.
   - `seo.description` (not visible): `Inteligencia artificial para empresas en Sevilla: chatbots que atienden clientes y agentes que reservan o toman pedidos. Más de 10 años de experiencia.` (151 characters). Keeps the intent signal "chatbots que atienden clientes" verbatim and the credential "años de experiencia"; the only figure is "10".
   - Unchanged and not to be touched: `hero.title`, `hero.titleAccent`, `hero.subtitle`, `hero.secondaryCta`, every `sectionTitles` entry, FAQ, benefits, process, pricing, closing and NAP copy.
   - Assumption: the copy proposed by the Tech Lead is adopted verbatim; a refinement was considered and rejected because the H1 must stay at exactly 6 words (word budget 846/850) and must contain "inteligencia artificial", "empresas" and "Sevilla", which leaves no better six-word phrasing than the proposed one.
5. **Design system reuse.** No new styles. The keyword heading keeps `.tpl-kw` (`src/styles/template.css`: `--text-secondary`, 1.0625rem, weight 600, line-height 1.3) rendered by `src/components/seo-local/SectionHeading.astro` with `level="h1"`; the display line keeps `.tpl-display` + `.hero-display` (max 16ch, `clamp(2.25rem, 6vw, 3.5rem)`). New component: none.
6. **Responsive.** The new keyword line is 3 characters longer than today (48 vs 45). At 320 px (288 px content width) and 375 px it wraps to two lines, as today; from 768 px (hero two-column, copy column `1.05fr`) it fits on one or two lines depending on width. Rules: natural word wrapping only; do not add `&nbsp;`, `<br>`, `white-space: nowrap`, manual hyphenation or a `max-width` to the keyword line; no horizontal overflow at any width from 320 px. Display line, subtitle and CTAs must reflow exactly as before (no change expected, since their strings do not change).
7. **Interactions.** n/a (no interactive element changes; booking button and "Ver precio" link keep their current hover, focus and pressed states).
8. **Accessibility hand-off.** The page keeps exactly one `h1` (the keyword heading); its accessible text becomes the new string. Heading order `h1` then section `h2`s is unchanged. `Service.name` in JSON-LD follows `hero.h1` automatically (`ServiceLayout.astro`), so the visible H1 and the structured name stay identical. No ARIA or focus changes.
9. **GEO-ready content.** The hero's direct statement of who and where is now the H1 itself; the subtitle already answers what the service does ("Monto chatbots y agentes de inteligencia artificial para empresas y negocios de Sevilla...") and stays. The brand is not written in the changed visible copy; in the rendered `<title>` it appears only as `Nuria Romero` through `brandedTitle`. No visible "updated" date is added. No keyword stuffing: the registered term appears once in each of title, H1 and description, which is the minimum the spec requires.

### Check list for `ux-review`

- Built page: the only `h1` reads exactly `Inteligencia artificial para empresas en Sevilla`; the `.tpl-display` line still reads "IA que responde con tu información" with the accent on "con tu información".
- `<title>` and `<meta name="description">` match the strings above byte for byte (after `brandedTitle`).
- No diff under `src/components/`, `src/styles/`, `src/layouts/` or `src/pages/inteligencia-artificial.astro`.
- `check-seo-17` still reports the `<main>` word count at 846 (within 750-850).
