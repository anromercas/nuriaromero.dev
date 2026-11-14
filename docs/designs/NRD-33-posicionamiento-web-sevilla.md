# NRD-33 - Cover "posicionamiento web Sevilla" on /seo-local-sevilla/ and record keyword ownership

## Why

[NRD-33](https://nuriaromerodev.atlassian.net/browse/NRD-33) (M1, epic NRD-2). Source: S-2026-11-13-3. Searchers in Seville use "agencia seo sevilla" (1,000/month), "consultor seo sevilla" (590) and "posicionamiento web sevilla" (320) far more than "seo local sevilla" (50), the title term of `/seo-local-sevilla/`. The page never names "posicionamiento web en Sevilla", and which page owns which head term is not recorded in the repo.

Current state (verified in code):

- `src/data/seo-intents.ts` has `intentMatrix` (role per URL, with title/H1/content signals checked on `dist/` by `scripts/check-seo-07.mjs`). It has no per-keyword owner.
- `/seo-local-sevilla/` H2 keyword labels live in the `src/components/seo-local/*.astro` components. All six are pinned by `tests/seo-local-ficha-redesign.test.js:301-306`. The hero subtitle and FAQs live in `seoLocal` (`src/data/services.ts:463-600`). The subtitle rules (at most 200 chars, starts "Tus clientes te buscan en Google", contains "cada mes") are in `tests/seo-local-ficha-redesign.test.js:338-347`.
- The home already has an H2 "Posicionamiento web en Sevilla: cómo trabajo" (`src/pages/index.astro:327`). It was added in commit `6dffeee` and is required by `tests/seo-meta-titles.test.js:132-148`. See Risks.

## What changes

- New `keywordOwners` registry in `src/data/seo-intents.ts`: `consultor seo sevilla` maps to `/`; `seo local sevilla`, `agencia seo sevilla` and `posicionamiento web sevilla` map to `/seo-local-sevilla/`. A test enforces one owner per term (ADR 0012).
- `/seo-local-sevilla/` names "posicionamiento web en Sevilla" in:
  - one H2: the `ReviewBento` keyword label, which today reads "Posicionamiento en Google Maps para negocios locales";
  - the hero subtitle (first screen);
  - the answer of the FAQ "¿Eres una agencia de SEO local?", which also says "consultora SEO".
- `check-seo-15` asserts the H2 and the FAQ phrase on the built page.

## Out of scope

- Any change to the home (`src/pages/index.astro`), including its existing "Posicionamiento web en Sevilla: cómo trabajo" H2 (see Risks).
- H1 and `<title>` of `/seo-local-sevilla/` stay "SEO local Sevilla".
- The Search Console cannibalization check (NRD-22) and the KPI comparison (NRD-17).
- New pages, URL changes, prices.

## Requirements and scenarios

### Requirement: keyword ownership is recorded

`src/data/seo-intents.ts` SHALL export `keywordOwners`, one row per head term, with exactly one owner URL per term.

#### Scenario: four local head terms

- WHEN `tests/keyword-ownership.test.js` loads `keywordOwners`
- THEN `consultor seo sevilla` maps to `/` and `seo local sevilla`, `agencia seo sevilla`, `posicionamiento web sevilla` map to `/seo-local-sevilla/`

#### Scenario: no shared term

- WHEN two rows normalise to the same keyword (lowercase, accents stripped, whitespace collapsed)
- THEN the test fails

#### Scenario: owner is a real page

- WHEN a row's `url` is neither `/` nor listed in `intentMatrix` or `serviceRoutes`, or lacks the trailing slash
- THEN the test fails

### Requirement: the page names "posicionamiento web en Sevilla"

`/seo-local-sevilla/` MUST name "posicionamiento web en Sevilla" in exactly one H2, in the hero subtitle and in exactly one FAQ answer. H1 and title MUST keep "SEO local Sevilla".

#### Scenario: H2

- WHEN the page is built
- THEN exactly one `<h2>` contains "posicionamiento web en Sevilla" and the single `<h1>` still contains "SEO local Sevilla" (`check-seo-15`)

#### Scenario: first screen

- WHEN a visitor loads the page at 375 px or 1280 px
- THEN the hero subtitle (above the fold) contains the phrase, still starts "Tus clientes te buscan en Google", contains "cada mes" and is at most 200 characters

#### Scenario: FAQ and JSON-LD

- WHEN the FAQPage JSON-LD of the built page is parsed
- THEN it is valid JSON, and exactly one `acceptedAnswer.text` contains the phrase together with "consultora SEO"

### Requirement: honest positioning

The copy SHALL describe Nuria as "consultora SEO" (freelance) and MUST NOT call her an "agencia" or promise rankings.

#### Scenario: wording guard

- WHEN `tests/seo-local-posicionamiento-web.test.js` reads the `seoLocal` block
- THEN "agencia" appears only in the FAQ question that the answer negates, and the `check-seo-15` positive-promise regex does not match

### Requirement: no home cannibalization added

The home MUST NOT gain new "posicionamiento web" headings or mentions.

#### Scenario: home unchanged

- WHEN the story's diff is inspected
- THEN `src/pages/index.astro` is not modified, and the count of "posicionamiento web" there is still at most 3 (`tests/seo-meta-titles.test.js:145`)

## Files (layer `app`)

| Action | Path                                          | Notes                                                                                    |
| ------ | --------------------------------------------- | ---------------------------------------------------------------------------------------- |
| modify | `src/data/seo-intents.ts`                     | `KeywordOwner`, `keywordOwners`; `/seo-local-sevilla/` `contentSignals` gains the new H2 |
| modify | `src/components/seo-local/ReviewBento.astro`  | `revision-title` H2 text                                                                 |
| modify | `src/data/services.ts`                        | `seoLocal.hero.subtitle`, answer of "¿Eres una agencia de SEO local?"                    |
| modify | `scripts/check-seo-15.mjs`                    | H2 and FAQ JSON-LD assertions                                                            |
| modify | `tests/seo-local-ficha-redesign.test.js`      | update the `revision-title` pin (line 301)                                               |
| create | `tests/keyword-ownership.test.js`             | registry guard                                                                           |
| create | `tests/seo-local-posicionamiento-web.test.js` | copy guard                                                                               |
| create | `docs/adr/0012-keyword-ownership-registry.md` | written by the Tech Lead with this design                                                |

## Interfaces

```ts
// src/data/seo-intents.ts
export interface KeywordOwner {
  keyword: string; // lowercase search query, as tracked in seo.rankTracking
  url: string; // owner route, trailing slash
}

// One owner page per head term (ADR 0012). Other pages may mention a term in
// passing, but only the owner targets it in title, H1 or H2.
export const keywordOwners: KeywordOwner[] = [
  { keyword: "consultor seo sevilla", url: "/" },
  { keyword: "seo local sevilla", url: "/seo-local-sevilla/" },
  { keyword: "agencia seo sevilla", url: "/seo-local-sevilla/" },
  { keyword: "posicionamiento web sevilla", url: "/seo-local-sevilla/" },
];
```

Copy. This is the UI spec wording, adopted by the Tech Lead; the "UI spec" section below is the source. The developer may refine it in the PR only within the scenarios' constraints:

- H2 (`ReviewBento`, `id="revision-title"`): `Posicionamiento web en Sevilla: Google y Google Maps`
- Subtitle (182 chars, lowercase "cada mes" as the case-sensitive `/cada mes/` test requires): `Tus clientes te buscan en Google antes de decidir. Trabajo contigo cada mes el posicionamiento web en Sevilla de tu negocio, ficha y web, para que quien te busca no dude en llamarte.`
- FAQ answer: `No, soy consultora SEO y desarrolladora web freelance. El posicionamiento web en Sevilla de tu negocio lo hago yo misma: hablas directamente con la persona que hace el trabajo.`
  - "desarrolladora web" is allowed. No guard forbids it: `tests/seo-local-ficha-redesign.test.js:316` only bans "agencia" in H1-H3, `:321` only pins the question text, and the `check-seo-15` regexes (legacy and promise) do not match it. It is consistent with the Person `jobTitle` ("Consultor SEO y desarrolladora web freelance").
  - The new copy guard must not forbid it either.

## Data

None beyond the new exported constant. No schema, storage or settings change. The FAQPage JSON-LD is generated from `seoLocal.faqs` by `faqSchema` (`src/layouts/ServiceLayout.astro:47`), so it updates automatically.

## Test plan (TDD order)

1. `tests/keyword-ownership.test.js` (RED, task 1.1). Load the module with `const intents = await import(new URL('../src/data/seo-intents.ts', import.meta.url))`; Node 24 strips the types, as `scripts/check-seo-07.mjs:6` already relies on. Assert the expected map, uniqueness after normalisation, and that every owner URL exists.
2. Add `keywordOwners` (GREEN).
3. `tests/seo-local-posicionamiento-web.test.js` (RED, task 1.2): it reads sources as text (`readFile` pattern) and asserts:
   - exactly one `<h2` in `src/components/seo-local/*.astro` contains the phrase;
   - the subtitle constraints;
   - one FAQ answer has the phrase and "consultora SEO";
   - "agencia" appears only in the negated question;
   - no promise regex matches;
   - `src/pages/index.astro` has at most 3 "posicionamiento web".
4. Update the pin in `tests/seo-local-ficha-redesign.test.js:301`, then write the copy and update `contentSignals` (GREEN).
5. `scripts/check-seo-15.mjs`: add the H2 and FAQ JSON-LD assertions. Run `pnpm build`, then `pnpm check:seo-15:dist`, `check:seo-07:dist`, `check:seo-02:dist` and the rest.

## Real-browser / e2e checks

- `/seo-local-sevilla/` at 375, 390 and 1280 px: the subtitle stays above the fold next to the booking CTA, and the longer subtitle does not push the CTA below the first viewport at 390x844.
- The new H2 label wraps cleanly at 320 px; the `kw` style is unchanged.
- FAQ: open "¿Eres una agencia de SEO local?" and read the new answer. Paste the built page's JSON-LD into the Schema Markup Validator: 0 errors.

## Risks

- **Existing home heading.** The home already has the H2 "Posicionamiento web en Sevilla: cómo trabajo" (`src/pages/index.astro:327`), and a test requires it (`tests/seo-meta-titles.test.js:132`). The story only forbids _adding_ home headings, so this design leaves it alone. Both pages will target the phrase in an H2, while the registry names `/seo-local-sevilla/` as owner. Flagged to the PO: renaming or removing the home heading is a separate decision, best taken with Search Console data (NRD-22).
- **"consultora" vs "consultor".** The home and the Person schema deliberately use "consultor SEO" (keyword "consultor seo sevilla", `tests/seo-meta-titles.test.js:120,129`). This story uses "consultora SEO" only on `/seo-local-sevilla/`, as the AC asks. Do not touch the home wording.
- A longer subtitle may change the first-screen layout and the LCP element (`p.hero-subtitle` is the LCP element in the NRD-18 baseline). Keep it at most 200 chars and check at 390 px.

## ADRs

0003 (data in `src/data`), 0004 (SEO head and JSON-LD), 0005 (SEO checks), 0008 (Spanish copy), **0012 (keyword ownership registry, new)**.

## UI spec

Copy-only change on `/seo-local-sevilla/`, inside the existing "SEO local" visual world described in `DESIGN.md` (the reference direction for this page). No new component, token, class, layout or style rule. Every string below is exact. If the developer refines one in the PR, it must still meet the scenarios above, and this section must be updated to match.

### 1. Hero subtitle (`src/components/seo-local/SeoLocalHero.astro`, data in `seoLocal.hero.subtitle`, `src/data/services.ts`)

- **Screen and layout**: unchanged. `p.hero-subtitle` stays between the display title and `.hero-actions` (`src/components/BookingButton.astro` "Reservar una llamada" plus the "Ver los planes" link). It remains the NRD-18 LCP element.
- **Hierarchy**: unchanged. Keyword H1 "SEO local Sevilla" (`.kw`), display title with the one serif phrase "cuando importa", the subtitle as lead copy, then the booking CTA as the primary action.
- **Copy** (182 chars; the current string has 176):
  `Tus clientes te buscan en Google antes de decidir. Trabajo contigo cada mes el posicionamiento web en Sevilla de tu negocio, ficha y web, para que quien te busca no dude en llamarte.`
  - Assumption: replaces the Tech Lead's proposal, which starts the second sentence with a capitalised "Cada mes" (fails the case-sensitive `/cada mes/` test) and reads "posicionamiento web ... de tu ficha y tu web" (the ficha is not a web). It keeps "Trabajo contigo cada mes" from the current voice.
  - Assumption: "ficha" without "de Google" is clear because the sentence opens with Google and the ListingMock beside it shows the ficha; adding "de Google" would bring the string to about 192 chars and risk an extra line at 375 px.
  - The phrase stays plain text: no `<em>`, bold or link (The One Serif Phrase Rule; the subtitle is body copy).
- **Design system reuse**: the existing `.hero-subtitle` rule (52ch max, `rgb(203 213 225)`, 1.125rem, line-height 1.65). No change.
- **Responsive**: same rule at all widths. The 6 extra chars must not add a line at 375 px or 390 px compared with the current build. At 390x844 the booking button stays fully inside the first viewport. If the line count grows at 390 px, shorten the copy; never reduce the font size.
- **States, interactions**: n/a (static text).
- **Accessibility hand-off**: n/a; it stays a `<p>`.

### 2. Bento keyword heading (`src/components/seo-local/ReviewBento.astro`)

- **Screen and layout**: section `.bento-wrap` (`aria-labelledby="revision-title"`), unchanged. Only the text of `<h2 id="revision-title" class="kw">` changes; the display paragraph "Qué se revisa para que _te encuentren_" stays directly below it (The Keyword Heading Rule).
- **Copy**: `Posicionamiento web en Sevilla: Google y Google Maps` (52 chars). Sentence case, no icon, no uppercase, no letter-spacing, no serif accent.
  - Assumption: adopts the Tech Lead's proposal as is. It keeps "Google Maps" (the previous label's topic), so the heading still describes the six tiles, and it contains no "agencia" (pinned by `tests/seo-local-ficha-redesign.test.js`).
- **Hierarchy**: the keyword H2 stays the small slate-300 label; the display paragraph remains the visual headline of the section. Do not enlarge or recolor the label to push the keyword.
- **Design system reuse**: the existing `.kw` rule in the component (Onest 600, 1.0625rem, `rgb(203 213 225)`, line-height 1.3). No change.
- **Responsive**: at 320 px the label wraps to at most two lines with natural breaks (no `<br>`, no `&nbsp;`); from 768 px it fits on one line.
- **States, interactions**: n/a.
- **Accessibility hand-off**: the section's accessible name becomes the new H2 text through the existing `aria-labelledby`; nothing else to wire. The hero's "Ver qué se revisa" anchor target is untouched.

### 3. FAQ answer to "¿Eres una agencia de SEO local?" (`src/components/seo-local/SeoLocalFaq.astro`, data in `seoLocal.faqs`, `src/data/services.ts`)

- **Screen and layout**: unchanged. Last `details` item of the hairline-ruled FAQ list; the question stays exactly "¿Eres una agencia de SEO local?".
- **Copy** (176 chars):
  `No, soy consultora SEO y desarrolladora web freelance. El posicionamiento web en Sevilla de tu negocio lo hago yo misma: hablas directamente con la persona que hace el trabajo.`
  - Rendering: `splitAnswer` makes the first sentence the bold lead, so the reader sees **"No, soy consultora SEO y desarrolladora web freelance."** followed by one context paragraph. Today the bold lead is only "No."; joining it with the role gives the lead a real answer (DESIGN.md: "Answer opens with a bold lead sentence").
  - Assumption: keeps "desarrolladora web" next to "consultora SEO", because PRODUCT.md positions the service as profile work plus technical web implementation and the current answer already says "desarrolladora web freelance". Drops "en Sevilla" from the role sentence so "Sevilla" is not repeated in two consecutive lines.
  - Assumption: replaces the Tech Lead's proposal for the two reasons above. It still has "consultora SEO" and "posicionamiento web en Sevilla" in one `acceptedAnswer.text`, no "agencia" in the answer and no ranking promise.
  - No blank line inside the string (a blank line would split the context into two paragraphs).
- **Design system reuse**: the existing answer styles (bold lead in `<strong>`, context at 65ch). No change.
- **States, interactions**: native `details` open and close with the drawn plus indicator, unchanged; closed by default.
- **Responsive**: unchanged (two columns from 1024 px, stacked below).
- **Accessibility hand-off**: n/a; the native `summary` keeps keyboard and screen-reader behavior.

### Not changed

H1, `<title>`, display titles, the other five keyword H2s, buttons, links, related links, closing band and the home page. Loading, empty, error, partial and disabled states: n/a (static page, no data-driven element in scope).

## Tasks

- [x] 1.1 [NRD-51 app] Record keyword ownership of the four local head terms in `keywordOwners`; tests: `tests/keyword-ownership.test.js` first.
- [ ] 1.2 [NRD-52 app] Name "posicionamiento web en Sevilla" in the `ReviewBento` H2, the hero subtitle and the agencia FAQ answer, with `check-seo-15` assertions; tests: `tests/seo-local-posicionamiento-web.test.js` and the updated pin in `tests/seo-local-ficha-redesign.test.js` first.
