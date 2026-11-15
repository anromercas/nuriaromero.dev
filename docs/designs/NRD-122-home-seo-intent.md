# NRD-122 - Home `/`: keep "consultor SEO Sevilla", add "experto" to the running copy and stop the home H2 from targeting "posicionamiento web sevilla" (phase 5, step 3)

## Why

[NRD-122](https://nuriaromerodev.atlassian.net/browse/NRD-122) (phase 5 step 3 of ADR 0013; draft in `docs/seo-audit/page-optimization-checklist.md` "Paso 3"; epic NRD-4). The home is the registered owner of `consultor seo sevilla` (590 a month; 3 impressions at 6.3) and of cluster SL-2. The variants `experto seo sevilla` (90 a month, yearly trend +40%, KD 0, S10; 25 impressions at 52.8) and `consultor seo provincia de sevilla` (24 at 76.3) are served by `/seo-local-sevilla/`; ADR 0013 "SL-2 variants" leaves them unregistered and unlinked and asks this story whether "experto" belongs in the home's running copy. Separately, the home H2 `Posicionamiento web en Sevilla: cómo trabajo` (`src/pages/index.astro:327`, pinned by `tests/seo-meta-titles.test.js` last test) works `posicionamiento web sevilla` with the connector "en", while `/seo-local-sevilla/` owns that term in its title and H1 since NRD-120 (ADR 0012 overlap flagged in ADR 0012 line 21 and the NRD-120 review; criterion SEO-1b).

## What changes

1. **SEO-1b decided: reword the H2.** ADR 0012 says only the owner targets a registered term in title, H1 or H2; the NRD-120 SL-1 reading (`docs/seo-audit/keyword-clusters-2026-11.md`, "Dato observado (NRD-120, 2026-11-15)") shows the `agencia`/`posicionamiento` intent served by agency service pages, which is `/seo-local-sevilla/`'s job, not the consultant home's. The literal G6 guard misses the "en" form, so the home competes with its sibling for no SL-2 gain. The H2 becomes a process heading with no target term (proposal `Cómo trabajo, paso a paso`; avoid repeating the existing `sr-only` H2 `Así trabajo contigo`). The paragraph under it keeps at most one passing mention of "posicionamiento web" (running copy is allowed by ADR 0012).
2. **"Experto" enters the running copy once (SEO-1).** Evidence: the variant has 90 searches a month growing 40% a year, KD 0, belongs to SL-2 whose owner is `/` (ADR 0013), and today lands on the wrong page. It goes in the process paragraph, phrased for the searcher, not as a title: proposal `Si buscas un experto SEO en Sevilla, este es el proceso que sigo para el posicionamiento web de tu negocio, el mismo que para cualquier otro servicio, adaptado a tu proyecto:` (UI spec wording, accepted by the Tech Lead; the colon leads into the numbered list) It is not added to title, description, H1 or any heading, and neither variant is registered or linked. Gate: task 1.1 reads the `experto seo sevilla` SERP; if it shows no consultant or individual pages at all (only directories/agencies), the mention is not added and the reason is recorded.
3. **Guards.** The old "posicionamiento web en Sevilla in a home h2/h3" test is inverted; a new test pins "experto SEO" once in `<main>` copy and never in a heading.

Unchanged: title, description, H1, hero paragraph (`consultor SEO en Sevilla` once), photo alt, `internalLinksBySource["/"]` (row 5 to `/portfolio/` and the three posts), FAQ, schema (home emits no `BreadcrumbList`), the hero image (LCP element).

## Out of scope

- `consultor seo provincia de sevilla` (left where Google shows it, ADR 0013).
- Styling, layout and the `dark:` classes of `src/pages/index.astro` (NRD-14, which this story `Blocks`).
- `/seo-local-sevilla/` copy.

## Requirements and scenarios

"Works a term" here: every word of the term occurs in the normalised element (`normaliseTerm`), so "Posicionamiento web en Sevilla" works `posicionamiento web sevilla` even with "en".

### Requirement: SERP evidence for the "experto" decision (SEO-2)

The story SHALL record, in `docs/seo-audit/keyword-clusters-2026-11.md` section "SEO local" (SL-2), a "Dato observado (NRD-122, YYYY-MM-DD), `experto seo sevilla`" entry (DataForSEO `serp/google/organic/live/advanced`, Seville, `es`, mobile, task id; or a scheduled SEO report of at most 7 days): local pack, organic domains in order with page type, AI Overview presence, and an **Inferencia** on whether consultant pages rank. One call. It SHALL also record the SEO-1b decision and its reason (this design's item 1). The `seo-review` gets the SL-2 evidence of the story (local pack Rafa Ramos 13 and 77 reviews, Antonio Castro 68, Consultoría Seo · Sevilla 16; organic 4 listings or directories and 4 agency or service pages; S10).

#### Scenario: consultant pages present

- WHEN the SERP shows at least one consultant or individual page or local-pack entry
- THEN task 1.2 adds the "experto" sentence

#### Scenario: tool unavailable or no consultant pages

- WHEN the call fails or no consultant page ranks
- THEN the entry says "sin dato (<error>)" or states the finding, task 1.2 skips the "experto" sentence (the H2 reword still ships), and the subtask comment says so

### Requirement: no home title, H1 or H2 works "posicionamiento web sevilla" (SEO-1b)

No `<title>`, `<h1>` or `<h2>` of the built home SHALL work `posicionamiento web sevilla` (with or without "en"). `src/pages/index.astro` SHALL contain "posicionamiento web" at most once, and only outside headings.

#### Scenario: source test

- WHEN `tests/seo-meta-titles.test.js` runs its rewritten home test
- THEN no `<h1>`/`<h2>`/`<h3>` or `<TitleSection>` content and not the `<Layout title>` works `posicionamiento web sevilla`; the test fails on today's source

#### Scenario: built check

- WHEN `pnpm check:seo-07:dist` runs
- THEN it passes (G6 literal rule) and the new test also covers the "en" form G6 does not see

### Requirement: "experto" appears once in the running copy, never in a heading (SEO-1)

When task 1.1 allows it, the home SHALL contain `experto SEO en Sevilla` exactly once, inside a `<p>` in `<main>`, and SHALL NOT contain "experto" in title, description, H1, H2 or H3. The sentence MUST NOT promise a result (invariant "No promised rankings"). `consultor SEO en Sevilla` stays in title, description, H1 and hero paragraph (`tests/seo-meta-titles.test.js`, `tests/seo-consultor-strategy.test.js` unchanged).

#### Scenario: experto copy

- WHEN the new test reads `src/pages/index.astro`
- THEN "experto SEO en Sevilla" occurs once, outside any heading, and the existing consultor tests pass

#### Scenario: links stay

- WHEN `pnpm check:seo-06:dist` runs
- THEN the home still links `/portfolio/` and its three posts inside `<main>`

## Files

| Layer | Action | Path                                         | Notes                                                                                        |
| ----- | ------ | -------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `app` | modify | `docs/seo-audit/keyword-clusters-2026-11.md` | SL-2 "Dato observado (NRD-122, date)" and the SEO-1b decision (task 1.1)                     |
| `app` | modify | `src/pages/index.astro`                      | `#proceso` `TitleSection` text and the paragraph below it (task 1.2); no class changes       |
| `app` | modify | `tests/seo-meta-titles.test.js`              | last test rewritten: no heading/title works the term; at most one passing mention (task 1.2) |
| `app` | create | `tests/home-seo-intent.test.js`              | "experto SEO en Sevilla" once, outside headings (task 1.2)                                   |

## Interfaces

```js
// tests/home-seo-intent.test.js and the rewritten test
import { normaliseTerm } from "../scripts/lib/keyword-ownership.mjs";
const worksTerm = (text, term) =>
  normaliseTerm(term)
    .split(" ")
    .every((w) => ` ${normaliseTerm(text)} `.includes(` ${w} `));
// headings = <h1>-<h3> contents + <TitleSection> slot contents (TitleSection renders an h2)
```

## Data

None (copy in one page). No storage, schema or settings impact.

## Test plan (TDD order)

1. Task 1.1 (docs): SERP read, SL-2 entry, SEO-1b decision recorded; subtask comment with source, date, task id, and whether the "experto" gate is open.
2. Task 1.2 (RED first): rewrite the last test of `tests/seo-meta-titles.test.js` (fails on `Posicionamiento web en Sevilla: cómo trabajo`); create `tests/home-seo-intent.test.js` (fails: no "experto"); skip the experto test file if the gate is closed and say so. Then edit `src/pages/index.astro` (GREEN). `node --test tests/*.test.js`; `pnpm build && pnpm check:seo:dist`.
3. Format only `src/pages/index.astro` and the two test files.

## Real-browser / e2e checks

- 375 px: the `#proceso` heading and paragraph wrap cleanly; heading outline still one H1, the reworded H2 between "Precios claros, sin sorpresas" and "Casos de éxito".
- LCP unchanged (hero image, median 2.08 s NRD-18, 1.885 s NRD-50): no hero change; a spot check is enough.
- Specialist reviews (DEL-6): `seo-review` with the SL-2 evidence and task 1.1, `ux-review`, `a11y-responsive`.

## Owner-account actions (executed by the orchestrator)

- Search Console URL inspection and "Request indexing" for `https://nuriaromero.dev/` after the scheduled promotion that contains this story: **executable owner action**.

## Risks

- **"Experto" as a self-claim.** The sentence addresses the searcher ("si buscas un experto...") and is backed by the published 10+ years; the `seo-review` checks tone against `PRODUCT.md`.
- **Overlap with NRD-14.** NRD-14 removes `dark:` classes from `src/pages/index.astro`; this story edits two text nodes there. NRD-122 `Blocks` NRD-14 so the class sweep lands on top.
- **Signal is small.** Both variant numbers are beyond page 5 in one window (ADR 0013); the change is cheap and reversible.

## ADRs

Relies on [0012](../adr/0012-keyword-ownership-registry.md) (owner-only targeting; flagged overlap), [0013](../adr/0013-seo-site-architecture.md) ("SL-2 variants"), [0008](../adr/0008-spanish-copy-english-code.md). No new ADR.

## UI spec

Copy-only change to one existing section of the home. No new component and no class, token, layout, icon, attribute or order change; the section keeps its current look before and after NRD-14's class sweep.

### Home `#proceso` section (`src/pages/index.astro`, lines 324-332)

1. **Screens and layout.** Same place in the page: after `#precios` ("Precios claros, sin sorpresas") and before `#casos` ("Casos de éxito"). Region order inside the section is unchanged: `TitleSection` (`src/components/TitleSection.astro`, renders the `<h2>`, with the existing `<Briefcase class="size-8" />` from `src/components/icons/Briefcase.astro` before the text), the intro `<p class="mb-8 text-gray-300 max-w-2xl">`, then `<ProcessSteps steps={homeProcess} />` (`src/components/services/ProcessSteps.astro`, numbered `<ol>` with `<h3>` step titles; `homeProcess` data unchanged).
2. **Hierarchy.** The H2 names what the section is about (how the work goes). The intro sentence speaks to the searcher and leads into the numbered steps. The steps stay the main information. The section has no action (the booking CTA stays in `CTASection` further down).
3. **States.** n/a (static copy, nothing data-driven).
4. **Copy** (Spanish, the same informal "tú" register as the rest of the home):
   - H2 text (inside `TitleSection`, after the icon): `Cómo trabajo, paso a paso`. Assumption: this is the design's proposal. It is different from the `sr-only` H2 `Así trabajo contigo` (line 176) and from the `ServiceLayout` default `Cómo trabajo`, it contains no registered term, and "paso a paso" matches the numbered list it introduces.
   - Intro paragraph, gate open (task 1.1 allows "experto"): `Si buscas un experto SEO en Sevilla, este es el proceso que sigo para el posicionamiento web de tu negocio, el mismo que para cualquier otro servicio, adaptado a tu proyecto:` Assumption: this rewords the design's proposal so the sentence ends with a colon that leads into the numbered list, as today's paragraph does. The proposal ("... esto es lo que puedes esperar: sigo el mismo proceso ... ." ) puts a full stop right before the list and says "what to expect" and "same process" back to back. The new sentence keeps exactly one `experto SEO en Sevilla` and one `posicionamiento web`, has no "consultor", and promises no result (invariant "No promised rankings"). The design's exact string also meets the requirements; the developer uses the string in this spec unless the Tech Lead says otherwise.
   - Intro paragraph, gate closed: keep today's text word for word: `Para el posicionamiento web de tu negocio, como para cualquier otro servicio, sigo el mismo proceso, adaptado a tu proyecto:`
   - Either way, `src/pages/index.astro` contains "posicionamiento web" exactly once (this paragraph) and "experto" at most once (this paragraph).
5. **Design system reuse.** Existing `TitleSection` (`src/components/TitleSection.astro`), `Briefcase` (`src/components/icons/Briefcase.astro`), `ProcessSteps` (`src/components/services/ProcessSteps.astro`), `SectionContainer` (`src/components/SectionContainer.astro`; keeps `id="proceso"` and its scroll reveal), and the paragraph's current classes `mb-8 text-gray-300 max-w-2xl`. Nothing new. The DESIGN.md rule of one Instrument Serif italic phrase per heading is not applied: none of the home's `TitleSection` headings use it today, and restyling is out of scope (NRD-14 or a later redesign).
6. **Responsive.** From 320 px up: at 320-375 px the H2 `Cómo trabajo, paso a paso` (24 characters, `text-3xl`) may wrap to two lines next to the icon. That is fine: no `whitespace-nowrap` and no hyphenation. The intro paragraph (about 165 characters) wraps freely inside `max-w-2xl`, about 4-5 lines at 320 px. Behavior at each breakpoint stays as it is.
7. **Interactions.** n/a (no interactive element is added or changed; the existing section reveal, which only runs when reduced motion is not requested, stays).
8. **Accessibility hand-off.** The heading outline stays the same: one `<h1>`, this section's `<h2>` between "Precios claros, sin sorpresas" and "Casos de éxito", and step titles as `<h3>`. The H2's accessible name becomes `Cómo trabajo, paso a paso`; the `Briefcase` SVG has no title and adds nothing to it, so leave it as is. Keep the copy as plain text nodes: no `<strong>` or other emphasis on "experto SEO en Sevilla" (it is running copy, not a visual keyword).

## Tasks

- [ ] 1.1 [NRD-148 app] Read the SERP of `experto seo sevilla`, record it and the SEO-1b decision in `docs/seo-audit/keyword-clusters-2026-11.md`; tests: none (docs).
- [ ] 1.2 [NRD-149 app] Reword the home `#proceso` H2 and add "experto SEO en Sevilla" to its paragraph; tests: rewritten `seo-meta-titles` home test and new `tests/home-seo-intent.test.js` first (RED), then `src/pages/index.astro`.
