## Context

- Story: [NRD-352](https://nuriaromerodev.atlassian.net/browse/NRD-352), epic M1 (NRD-2), 2 points. Source: `docs/research/NRD-323-faq-gap-report.md` sections 4.1 and 7; PO decision of 2026-11-21 (L1 and L5 as new entries, L8 merged into the Google Maps entry, no word budget declared).
- `/seo-local-sevilla/` renders its FAQ from `seoLocal.faqs` (`src/pages/seo-local-sevilla.astro:265`, `faqs={seoLocal.faqs}`) through `src/components/seo-local/SeoLocalFaq.astro`, which bolds the first sentence of each answer (`splitAnswer`). `ServiceLayout` builds the FAQPage JSON-LD with `faqSchema(page.faqs)` (`src/layouts/ServiceLayout.astro:51`), and `src/lib/ai-discovery.ts` (`faqPages`) builds `/ai/faq.json` from the same array. All consumers only read `faq.q` and `faq.a`.
- Prices: `seoLocal.pricing.tiers` ("Local" 300 €/mes + IVA, "Local Pro" 500 €/mes + IVA) in `src/data/services.ts`; `tierFrom(service, tierName)` (`src/data/services.ts:32`) throws on a renamed tier. Home and contact FAQs already read them with `tierFrom` (`src/data/page-faqs.ts:13`, `:39`).
- Guards that see the change: `scripts/check-seo-16.mjs` compares the page JSON-LD (FAQPage included) and headings with `tests/fixtures/seo-local-sevilla.baseline.json` and says to regenerate it with `--write` when a story changes the page on purpose; `scripts/check-seo-17.mjs` checks the visible FAQ equals the FAQPage; `scripts/check-seo-15.mjs` rejects promise wording and legacy prices on the page; `tests/ai-discovery*.test.js` keep `/ai/faq.json` equal to `faqSchema`.
- No test pins the length or the order of `seoLocal.faqs` today (checked: no `seoLocal.faqs[`, no length assertion).

## Goals / Non-Goals

**Goals:** the two new entries and the merged L8 sentence, exactly as the spec states them; prices read from the single source at read time; a test that fails if L1 stops reading them; structured data, AI files and the baseline in step.

**Non-Goals:** a word budget for the page; changes to page markup, key sections or components; FAQs of other pages.

## Decisions

**Approach.** Edit only the data. Insert L5 as the first entry of `seoLocal.faqs` (definition before the fit question) and L1 right after "¿Qué diferencia hay entre Local y Local Pro?" (price next to the plan comparison), and add the L8 sentence as the second sentence of the Google Maps entry so its first sentence (the direct answer) and its closing caveat stay. The L1 answer cannot call `tierFrom(seoLocal, ...)` inside the `seoLocal` literal (the constant is not initialized yet, temporal dead zone), so the entry defines `a` as a getter: `get a() { return \`El plan Local cuesta ${tierFrom(seoLocal, "Local")} ...\` }`. The getter runs only when a consumer reads `faq.a` (render, `faqSchema`, `buildAiFaq`, `JSON.stringify`), after `seoLocal` exists, and keeps the literal expression the acceptance criterion asks for. Alternatives rejected: extracting the tiers to a constant declared before `seoLocal` (the answer would no longer read `seoLocal.pricing`, against AC1); mutating `seoLocal.faqs` after the literal (order hidden away from the list, easy to break).

**Files**

| Action | Path | Symbol | Layer |
| --- | --- | --- | --- |
| modify | `src/data/services.ts` | `seoLocal.faqs`: new first entry L5, new L1 entry with a getter `a`, second sentence added to the Google Maps entry | app |
| create | `tests/seo-local-faq.test.js` | node:test cases of the test plan | app |
| modify | `tests/fixtures/seo-local-sevilla.baseline.json` | regenerated with `pnpm build && node scripts/check-seo-16.mjs --write` (FAQPage gains 2 questions, Maps answer changes; headings unchanged) | app |

Final order of `seoLocal.faqs` (11):

1. ¿Qué es el SEO local? (new, L5)
2. ¿Para qué tipo de negocio encaja este servicio?
3. ¿Cómo puede aparecer mi negocio en Google Maps? (L8 sentence added)
4. ¿Qué diferencia hay entre Local y Local Pro?
5. ¿Cuánto cuesta el SEO local? (new, L1)
6. ¿Qué ocurre en la llamada?
7. ¿Qué se mide y cómo se informa?
8. ¿Necesito tener web?
9. ¿Hay una puesta en marcha separada o una permanencia?
10. ¿Qué papel tienen los sistemas de IA?
11. ¿Eres una agencia de SEO local?

Exact copy (Spanish, from report 4.1; the L8 sentence adapted so it reads inside #2):

- L5 answer: "Es el trabajo para que tu negocio aparezca en Google y en Google Maps cuando alguien cerca de ti busca lo que ofreces. Incluye tu ficha de Google, tus reseñas y, según el plan, tu web."
- L1 answer: `El plan Local cuesta ${tierFrom(seoLocal, "Local")} y el Local Pro, ${tierFrom(seoLocal, "Local Pro")}. Se facturan mes a mes y no hay cuota de puesta en marcha aparte.`
- Google Maps answer: "Con una ficha de Google Business Profile completa y coherente: categoría correcta, servicios y horarios al día, reseñas auténticas y datos que coinciden en directorios y en la web. Esa ficha es la base del SEO local: el plan Local la mantiene al día y Local Pro suma el trabajo en la web. También influye la distancia entre quien busca y tu negocio, así que nadie puede prometer la primera posición."

**Interfaces**

```ts
// src/data/services.ts, inside seoLocal.faqs (type ServicePageData["faqs"][number] unchanged)
{
  q: "¿Cuánto cuesta el SEO local?",
  // Read at access time: seoLocal is not initialized while this literal is evaluated.
  get a() {
    return `El plan Local cuesta ${tierFrom(seoLocal, "Local")} y el Local Pro, ${tierFrom(seoLocal, "Local Pro")}. Se facturan mes a mes y no hay cuota de puesta en marcha aparte.`
  },
},
```

No type, helper or component changes. `pnpm astro check` must accept the getter against `{ q: string; a: string; links?: ... }` (it does: a getter-only accessor satisfies a `string` property in an object literal).

**Data.** No schema, storage or settings impact. No price edited. Migration: none.

**Test plan (TDD order)** - `tests/seo-local-faq.test.js`, written first and observed RED before the data edit (import `src/data/services.ts` with `await import(new URL(...).href)` as `tests/seo-para-ia.test.js` does; read the source with `readFileSync` for the source assertions):

1. Order and count: the questions of `seoLocal.faqs` deep-equal the 11-item list above (scenario "New entries in place").
2. L5 answer equals the spec text (scenario "New entries in place").
3. L1 answer equals "El plan Local cuesta 300 €/mes + IVA y el Local Pro, 500 €/mes + IVA. Se facturan mes a mes y no hay cuota de puesta en marcha aparte." and equals the template built with `tierFrom(seoLocal, "Local")` / `tierFrom(seoLocal, "Local Pro")` (scenario "Price answer renders the plan prices").
4. Live read: set `pricingTier(seoLocal, "Local").from = "123 €/mes + IVA"` in a `try`, read the L1 answer, assert it contains "123 €/mes + IVA", restore in `finally` (scenario "Price answer stops reading the pricing source").
5. Source guard: the slice of `src/data/services.ts` from `"¿Cuánto cuesta el SEO local?"` to the next `q:` contains `${tierFrom(seoLocal, "Local")}` and `${tierFrom(seoLocal, "Local Pro")}` and no `€` (same scenario; fails if a price is typed).
6. Serialization: `JSON.parse(JSON.stringify(seoLocal.faqs))` keeps the L1 answer with both prices, and `faqSchema(seoLocal.faqs)` (from `src/lib/schema.ts`) has 11 questions whose texts equal `faqAnswerText(a)` of each entry (scenario "Structured data and AI files stay equal").
7. Google Maps answer: starts with "Con una ficha de Google Business Profile completa y coherente", contains the L8 sentence, ends with the distance caveat, `/\d/` does not match (scenario "Merged L8 sentence").
8. No promises: L5, L1 and Maps answers do not match `/garantiz|primera posici|primeros puestos|top ?\d|en \d+ (?:d[ií]as|semanas|meses)|chatgpt|te recomendar|te citar/i`, with the Maps caveat "nadie puede prometer la primera posición" removed before the check (scenario "No promises").
9. Baseline: the FAQPage `mainEntity` names in `tests/fixtures/seo-local-sevilla.baseline.json` equal the 11-question list (proves the fixture was regenerated; scenario "Structured data and AI files stay equal").

Then edit `src/data/services.ts`, run `pnpm build`, regenerate the fixture with `node scripts/check-seo-16.mjs --write`, and run `node --test tests/*.test.js` and `pnpm check:seo:dist` (check-seo-15, -16 and -17 in particular). Format only `src/data/services.ts` and the new test with `pnpm format`. Fixtures and fakes: none new; the existing baseline is the only fixture touched.

**Real-browser / e2e checks (QA)**

- `/seo-local-sevilla/` at 375 px and desktop: the FAQ shows 11 entries in the order above; each `<details>` opens and closes with mouse and keyboard, focus is visible.
- The open L1 entry shows "El plan Local cuesta 300 €/mes + IVA y el Local Pro, 500 €/mes + IVA." in bold (lead sentence) and the billing sentence below; no "undefined" or empty answer (proves the getter is read during render).
- The open Google Maps entry shows the new middle sentence, no figures.
- View source: the FAQPage JSON-LD has 11 questions with the same texts; `/ai/faq.json` lists the same 11 for `/seo-local-sevilla/`.

**ADRs relied on:** 0003 (data in `src/data`), 0004 (JSON-LD through `schema.ts`), 0006 (node:test, TDD), 0008 (Spanish copy), 0012 and 0013 (keyword ownership: the page owns these questions), 0015 (word budget measured on owner text; none declared here), 0017 (freshness from the real last change).

## Risks / Trade-offs

- [The getter is an unusual shape in `src/data`] -> one English comment on the entry explains why; test 4 and test 6 prove render-time and serialization reads; QA checks the visible text.
- [Overlap with key sections of the page: "¿Cuánto cuesta?" direct answer and the definition in the review section] -> accepted by the PO; FAQ answers use different wording, so no literal duplication; the home entry "¿Cuánto cobra un SEO al mes?" keeps a different question and text (PO note).
- [More text on a page with no word budget (about +76 words)] -> PO chose not to declare a budget yet; flagged in the story comment.
- [check-seo-16 baseline regenerated in the same commit could hide an unintended JSON-LD change] -> the reviewer diffs the fixture: only the FAQPage `mainEntity` (2 new questions, 1 changed answer) may change; headings unchanged.

## UI spec

Data-only change: the existing FAQ section of `/seo-local-sevilla/` (`src/pages/seo-local-sevilla.astro`, `<SeoLocalFaq headingId="faq-title" ...>`) renders the new entries through `src/components/seo-local/SeoLocalFaq.astro` with no markup, style or prop change. Mode: Persuade (service page); the FAQ supports the booking decision.

### FAQ accordion (`SeoLocalFaq.astro`)

1. **Screens and layout**: no new view or region. The FAQ keeps its two-column layout (intro with heading, answer, lede and `BookingButton` on the left; `.faq-list` on the right from 1024 px, stacked below) and grows from 9 to 11 `<details>` rows in the order of the Files section above.
2. **Hierarchy**: the question (`.question`, `--text-strong`, weight 600) stays the scan line; the answer's first sentence is the bold lead (`splitAnswer` -> `<strong>`), the rest renders as one `--text-secondary` paragraph. The three answers are built so the lead is the direct answer:
   - L5 lead: "Es el trabajo para que tu negocio aparezca en Google y en Google Maps cuando alguien cerca de ti busca lo que ofreces." Context: "Incluye tu ficha de Google, tus reseñas y, según el plan, tu web."
   - L1 lead: "El plan Local cuesta 300 €/mes + IVA y el Local Pro, 500 €/mes + IVA." Context: "Se facturan mes a mes y no hay cuota de puesta en marcha aparte." The lead must contain both prices; `splitAnswer` ends the lead at the first `.`, `!` or `?` followed by a space, and "€/mes + IVA" contains none, so the split is correct as specified.
   - Google Maps lead unchanged ("Con una ficha ... en la web."). Context: the new L8 sentence and the distance caveat render together as one paragraph (no blank line between them).
   - Developer rule: no `\n\n` inside these answers (it would split the context into extra paragraphs); no abbreviation with a period ("p. ej.", "aprox.") in a lead sentence.
3. **States**: static content, built at compile time; no loading, empty or error state. All rows start closed (existing behavior, no `open` attribute). Failure state to guard against: an L1 answer rendered empty or as "undefined" if the getter is not read during render (QA check in the design).
4. **Copy**: exactly the strings of the spec and the "Exact copy" list above; questions "¿Qué es el SEO local?" and "¿Cuánto cuesta el SEO local?". Spanish, tú register, plain language consistent with the existing entries ("ficha de Google", "Local", "Local Pro"). Prices only as rendered by `tierFrom` ("300 €/mes + IVA", "500 €/mes + IVA"), matching the pricing cards of the same page.
5. **Design system reuse**: unchanged tokens and classes of `SeoLocalFaq.astro` (`--hairline` row borders, `--text-strong`, `--text-secondary`, `--sky-signal` indicator and focus ring, `.answer` max-width 65ch) and `src/styles/template.css`. No new component.
6. **Responsive**: unchanged. At 320-375 px the questions wrap within the summary next to the 1.5 rem indicator; the longest new question ("¿Cuánto cuesta el SEO local?") wraps to two lines at most. The sticky intro (>= 1024 px and >= 800 px tall) keeps working with a longer list.
7. **Interactions**: native `<details>` toggle with mouse, Enter and Space; plus/minus indicator; no animation added.
8. **Accessibility hand-off**: each new row is a native `<summary>` in DOM order, so tab order follows the 11-item list; visible focus via the existing `summary:focus-visible` outline. No icon-only control added (indicator stays `aria-hidden`).
9. **GEO-ready content**: each new answer opens with a direct 1-sentence answer (see Hierarchy); the brand is not named in these answers; no hidden text, no keyword repetition beyond the question itself. "Updated" date: unchanged mechanism (ADR 0017, real commit date).

- Assumption: the new entries carry no `links` (no "Ver planes" link to the pricing section); the design does not add them and the pricing cards sit directly above the FAQ.
