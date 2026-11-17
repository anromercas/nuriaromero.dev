# Design: fewer "Sevilla" repetitions on the home (22 → at most 14)

## Context

See proposal.md - Why. Current state on `develop` (22 occurrences in visible `<main>` text of `dist/index.html`, counted per word as in `mainWordCount`, live review excluded):

| # | Occurrence | Source | Status |
| --- | --- | --- | --- |
| 1-2 | H1 "Consultor SEO en Sevilla para negocios locales", hero subtitle "consultor SEO en Sevilla" | `src/pages/index.astro:139,144` | protected (ADR 0013) |
| 3-5 | tile links "SEO local en Sevilla", "Diseño web en Sevilla", "Tienda online en Sevilla" | `index.astro` bento tiles | protected (owner anchors) |
| 6 | "web para restaurantes en Sevilla" | `src/data/internal-links.ts:17` | protected |
| 7-8 | project titles "Arkady Celebraciones - … en Sevilla", "Adf Sevilla - … en Sevilla" (3 words) | `src/components/Projects.astro:85,94` | protected (real titles) |
| 9 | quoted keyword "administradores de fincas en sevilla" (and "gestión de fincas en sevilla") | `Projects.astro:96` | protected |
| 10 | NAP "41309 La Rinconada, Sevilla" | `SeoLocalNap` from `SITE.address.full` | protected |
| E1 | proof stat "2 webs en Sevilla" | `src/data/site.ts:61` `SITE_PROOF` (9 pages) | editable, **kept** |
| E2 | H2 keyword "Servicios para negocios locales en Sevilla" | `index.astro:156` | editable |
| E3 | byline "ahora trabajo con negocios de Sevilla." | `index.astro:240` | editable |
| E4 | portrait caption "Nuria Romero, consultor SEO en Sevilla y desarrolladora web" (`portraitAlt` is also the `<figcaption>`, `SeoLocalProcess.astro:45`) | `index.astro:236` | editable |
| E5 | H2 keyword "Opiniones y proyectos reales en Sevilla" | `index.astro:249` | editable |
| E6 | note "Dos webs reales de negocios de Sevilla, hechas por mí." | `index.astro:252` | editable |
| E7 | anchor "casos de éxito de webs para negocios en Sevilla" | `internal-links.ts:16` (source `/`) | editable |
| E8 | NAP H2 keyword "Dónde trabajo: La Rinconada, Sevilla" | `index.astro:302` | editable |
| E9-E10 | ", Sevilla" after "barrio del Cerro del Águila" in both project descriptions | `Projects.astro:87,95` | editable (shared with `/portfolio/`, accepted) |

The PO counts 12 protected and 10 editable occurrences: rows 1-10, with rows 7-8 and 9 each holding more than one. Guards: `tests/home-template.test.js:333` freezes the `portraitAlt` literal. `:202` freezes the H1 keyword and `:301` keeps the agency comparison heading free of "Sevilla"; neither is touched. `tests/template-components.test.js:157` and `tests/seo-local-ficha-redesign.test.js:55,276` freeze `SITE_PROOF` (kept, so untouched). `scripts/check-seo-06.mjs` requires every mapped internal link to render. `/portfolio/` word range is [100, 250] (248 today).

## Goals / Non-Goals

**Goals:**

- Reach 13 occurrences (one below the cap, slack for NRD-245's home answers) by editing home copy, one home anchor and the two shared descriptions.
- Make the cap a data entry checked at build time, like the word range.

**Non-Goals:**

- No change to `SITE_PROOF` (would rewrite the proof strip of nine pages and two frozen tests for one occurrence), title, H1, description, JSON-LD or other pages' anchors.

## Decisions

**Approach.** Reword nine editable occurrences (E2-E10) and keep E1. `page-contract.mjs` gains `termOccurrences(html, term)`: it takes the visible `<main>` text after `withoutWordBudgetExcluded` (ADR 0015), tokenizes like `mainWordCount`, normalizes each token (NFD, strip diacritics, lowercase) and counts tokens containing the normalized term. `templatePages` entries gain an optional `termCaps: { [term]: max }`; the `/` entry gets `{ sevilla: 14 }`, and `check-seo-17` reports any entry over its cap. Rejected: a dedicated test reading `dist/` from `tests/` (`node --test` runs before the build in CI), a density metric (PO decision), editing `SITE_PROOF` (scope, see Non-Goals).

**New copy** (Spanish, `tú`, nothing invented):

| # | After |
| --- | --- |
| E2 | keyword "Servicios para negocios locales" |
| E3 | "… ahora trabajo con negocios locales." |
| E4 | `portraitAlt="Nuria Romero, consultor SEO y desarrolladora web"` (update the literal in `tests/home-template.test.js:333` to this string; same assertion) |
| E5 | keyword "Opiniones y proyectos reales" |
| E6 | note "Dos webs reales de negocios locales, hechas por mí. Visítalas y juzga el trabajo por ti." |
| E7 | `/` entry anchor "casos de éxito de webs para negocios locales" (the `/diseno-web-sevilla/` entry keeps its anchor) |
| E8 | keyword "Dónde trabajo: La Rinconada" (the NAP address with "Sevilla" follows right below) |
| E9-E10 | "… en el barrio del Cerro del Águila." (drop ", Sevilla") |

Expected count: 22 − 9 = 13, plus whatever NRD-245's home answers add. NRD-245's home answers should not name the city (its copy rule says to keep "Sevilla" to what the sentence needs). If they push the count over 14, trim those answers, never a protected occurrence.

### Files

| Action | Path | Symbols | Layer |
| --- | --- | --- | --- |
| modify | `scripts/lib/page-contract.mjs` | `termOccurrences(html, term)` | app |
| modify | `scripts/lib/template-pages.mjs` | `termCaps` field; `/` entry `{ sevilla: 14 }` (task 1.2) | app |
| modify | `scripts/check-seo-17.mjs` | cap assertion | app |
| modify | `tests/page-contract.test.js` | unit tests | app |
| modify | `src/pages/index.astro` | E2-E6, E8 props | app |
| modify | `src/data/internal-links.ts` | E7 (`/` source only) | app |
| modify | `src/components/Projects.astro` | E9-E10 | app |
| modify | `tests/home-template.test.js` | `portraitAlt` literal at line 333 | app |

### Interfaces

```js
// scripts/lib/page-contract.mjs
/** Number of visible <main> words (word-budget-excluded blocks removed) whose normalized form contains the normalized term. */
export function termOccurrences(html, term) // -> number
// scripts/lib/template-pages.mjs entry: { route, words?, service, keySections?, termCaps?: Record<string, number> }
```

### Data

None. Copy changes only; `SITE_PROOF`, `SITE.address` and JSON-LD unchanged.

### Test plan (TDD order)

1. Task 1.1, `tests/page-contract.test.js` (RED first): `termOccurrences` counts "Sevilla", "SEVILLA" and "sevilla," in a `<main>` fixture; ignores text outside `<main>`, inside `data-word-budget="exclude"` and in `alt` attributes; matches accented variants of the term. `check-seo-17` support for `termCaps`, no cap registered yet: suite and `check:seo:dist` green.
2. Task 1.2 on a branch with NRD-245 merged (merge `develop` first): register `termCaps: { sevilla: 14 }` for `/`, `pnpm build`, see `check-seo-17` RED (22 or more) ("Count over the cap fails the build check"). Apply E2-E10, update the `portraitAlt` literal, rebuild: GREEN at 13 or 14 ("Protected occurrences remain", "Count after NRD-245"). Then confirm `keyword-ownership.test.js` and `seo-intents-copy-sync.test.js` pass unchanged, and `home-template.test.js` passes with only the caption literal updated. Also confirm the `/` and `/portfolio/` word ranges in `check-seo-17` and the `check-seo-06` internal-link rendering pass.

### Real-browser / e2e checks

- Home at 375 px and 1280 px: the shortened headings, the caption and the NAP heading read naturally and keep the layout. `/portfolio/` cards read correctly without ", Sevilla".

### ADRs relied on

ADR 0013 (home owns "consultor SEO Sevilla"; owner anchors), ADR 0014 (template contract in `template-pages.mjs`), ADR 0015 (live review excluded from measurements).

## Risks / Trade-offs

- [NRD-245 adds "Sevilla" in home answers] → one occurrence of slack; the check fails visibly and the fix is trimming the answer.
- [Live review contains "Sevilla" in production] → excluded by the ADR 0015 marker, so CI and production count the same.
- [Shared descriptions change `/portfolio/`] → accepted by the PO; still true; word range has room.
- [Less local wording in headings] → local relevance stays in title, H1, subtitle, anchors, NAP and JSON-LD (`areaServed`).

## Migration Plan

None. Rollback is reverting the commits.

## UI spec

Copy-only change on the home (`src/pages/index.astro`) and the shared project cards (`src/components/Projects.astro`, also on `/portfolio/`). No new components, tokens, classes or layout changes; every string renders through its current component and style. Checklist items not listed (states, interactions, new components) are n/a: the page is static and nothing changes behavior.

### Strings (exact, Spanish, `tú`)

| Element | Component / style | New string |
| --- | --- | --- |
| E2 services H2 | `SectionHeading` (`src/components/seo-local/SectionHeading.astro`), `.tpl-kw` in `src/styles/template.css` | `Servicios para negocios locales` |
| E3 byline | `SeoLocalProcess` slot `byline` | `Soy Nuria Romero: llevo más de 10 años desarrollando software y ahora trabajo con negocios locales.` |
| E4 portrait `alt` and `<figcaption>` | `SeoLocalProcess` `portraitAlt` (`figcaption` style) | `Nuria Romero, consultor SEO y desarrolladora web` |
| E5 proof H2 | `SectionHeading` in `RealProof`, `.tpl-kw` | `Opiniones y proyectos reales` |
| E6 projects note | `RealProof` `.sites-note` | `Dos webs reales de negocios locales, hechas por mí. Visítalas y juzga el trabajo por ti.` |
| E7 related-link anchor (`/` source only) | `SeoLocalRelated` from `src/data/internal-links.ts` | `casos de éxito de webs para negocios locales` |
| E8 NAP H2 | `SeoLocalNap` `.tpl-kw.nap-kw` | `Dónde trabajo: La Rinconada` |
| E9-E10 project descriptions | `Projects.astro` | `... en el barrio del Cerro del Águila.` followed by the existing second sentence unchanged |

- Wording and punctuation exactly as in the design's "New copy" table; no other string on the page changes. The display titles under each `.tpl-kw` (`.tpl-display`, e.g. "Lo que puedo hacer por tu negocio") stay as they are.
- E8: the address line right below (`SITE.address.full`, "41309 La Rinconada, Sevilla") keeps the city visible next to the heading, so the NAP block still reads as Seville.

### Hierarchy and local intent

- Each `.tpl-kw` stays the semantic H2 above its display title; reading order is unchanged.
- Local intent stays visible in the first viewport (H1 and hero subtitle with "consultor SEO en Sevilla"), in the three service tiles ("SEO local en Sevilla", "Diseño web en Sevilla", "Tienda online en Sevilla"), in the proof strip ("2 webs en Sevilla"), in the project titles and in the NAP address. "Negocios locales" replaces the city only where it repeated it within a few lines.
- Assumption: "negocios locales" over "tu zona" or "tu ciudad" for E2, E3, E6 and E7, because it is already the site's term (H1 "para negocios locales") and invents no place.

### Responsive (320 px to 1280 px)

- `.tpl-kw` is 1.0625rem / 600 / line-height 1.3 at every width; the new headings are 27-31 characters (were 37-42). Expected: one line from 375 px up; at most two lines at 320 px, wrapping between words, no hyphenation, no horizontal overflow. No `text-wrap`, size or spacing change is added.
- The caption (`figcaption`, 0.9rem) gets shorter (48 characters): at most two lines under the portrait (`max-width: 20rem`) at 320 px, one or two lines above.
- The `.sites-note` (`max-width: 65ch`) and the project card descriptions only get shorter; card heights in `/portfolio/` and the home may shrink by a line, which is acceptable as long as cards in a row still align as today (grid, no fixed heights).

### Accessibility hand-off

- The portrait `alt` equals the visible `<figcaption>` (existing pattern, unchanged); it must still name the person.
- H2 ids (`que-hago-title`, `prueba-title`, `nap-title`) and `aria-labelledby` links stay; only the text changes, so the sections' accessible names become the new headings.
- The related link keeps a descriptive anchor (destination clear without context).

### GEO-ready content

- No new sections; the brand stays "Nuria Romero" as written today. No hidden text or keyword stuffing introduced; the change removes repetition. No "updated" date is added.
