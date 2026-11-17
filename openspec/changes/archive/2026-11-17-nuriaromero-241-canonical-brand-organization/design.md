# Design: canonical brand "Nuria Romero" and complete Organization nodes

## Context

See proposal.md - Why. Current state on `develop`:

- `src/data/site.ts:3-7` `SITE.name = "Nuria Romero"` (public brand), `SITE.shortName = "nuriaromero.dev"` (allowed variant), `SITE.url = "https://nuriaromero.dev"`.
- `src/components/seo/SEO.astro:25` renders `<title>{title}</title>` with the raw page title; lines 30 and 39 reuse it for `og:title`/`twitter:title`; line 36 `og:site_name = SITE.name`. Every page passes its title through `Layout` (`src/layouts/Layout.astro:32-39`); service pages pass `page.seo.title` from `src/data/services.ts` / `src/data/niches.ts` via `ServiceLayout`; blog posts pass the frontmatter title via `BlogPostLayout`.
- Built titles today (local `dist/`): only `/404.html` and `/recursos/` end with "— Nuria Romero"; the home is "Consultor SEO en Sevilla | Nuria Romero, SEO local y para IA" (`src/pages/index.astro:120`), `/sobre-mi/` is "Sobre mí — Nuria Romero, desarrolladora web en Sevilla" (`src/pages/sobre-mi.astro:79`), legal pages end in "| nuriaromero.dev" (`src/pages/aviso-legal.astro:7`, `privacidad.astro:7`, `cookies.astro:7`).
- `src/lib/schema.ts:15-44` `localBusinessSchema()` is complete (`name`, `alternateName`, `url`, `logo`, `description`, address, contact, `sameAs`). `reviewsSchema()` (lines 51-75) emits a second node with the same `@id` and types but no `name`/`url`; it is used only by the home (`src/pages/index.astro:128`) when `getGoogleReviews()` returns real data (production builds with the Places key; local and CI builds have none). `schema.ts` imports `@/data/site` and `@/data/local-trust` through the alias, so `node --test` cannot import it today.
- `scripts/check-seo-11.mjs` already checks the business node naming, `sameAs`, person naming and `og:site_name != "nuriaromero.dev"`; it finds the business node with `find()` (first node with the `@id`), so the reviews node is never inspected.
- `scripts/check-seo-15.mjs:15` asserts the `/seo-local-sevilla/` rendered title is at most 65 characters (today 63).
- `tests/seo-meta-titles.test.js` freezes the `seo.title` source strings of services and niches and requires the home source title to start with "Consultor SEO en Sevilla", include "Sevilla" and be at most 65 characters. These source strings do not change in this design.
- `scripts/check-seo-18.mjs` freezes each blog post `title` in `tests/fixtures/blog-posts.baseline.json`; the fixture is regenerated on purpose (`--write`) when the rendered title changes.
- `src/components/Header.astro:51-62`: the logo link has `aria-label="Ir al inicio"`, which overrides the image `alt="Nuria Romero"`.
- `public/llms.txt:1-3`: title "# Nuria Romero"; summary says "Índice curado de información pública de nuriaromero.dev".

## Goals / Non-Goals

**Goals:**

- One place appends the brand to titles; page sources keep owning their own title text.
- Every Organization-typed node is complete in every build (with or without review data), guarded on `dist/` and by a unit test that does not depend on the Places key.

**Non-Goals:**

- No change to service or niche `seo.title` strings, meta descriptions, H1s or the visual wordmark.
- No `@graph` merge of the reviews node into the Layout node (they are emitted by different components; adding `name`/`url` satisfies the requirement with less churn).

## Decisions

**Approach.** A small pure helper `brandedTitle(title)` in a new `src/lib/seo-title.ts` returns `title` when it already ends with `SITE.name`, else `` `${title} | ${SITE.name}` ``; `SEO.astro` uses it for `<title>` only, so `og:title`/`twitter:title` stay as the page title and `og:site_name` carries the brand. The home and `/sobre-mi/` source titles drop the mid-string brand, and the legal titles drop "| nuriaromero.dev", so the suffix is the brand's only occurrence. `reviewsSchema()` adds `name: SITE.name` and `url: SITE.url`; `schema.ts` switches to relative `.ts` imports (pattern already used by `src/data/navigation.ts`) so a node test can call it with a fixture. `check-seo-11` gains three assertions (title suffix on indexable pages, exact `og:site_name`, every Organization-typed node complete), and `check-seo-15` measures the page-owned part. Alternative rejected: changing every `seo.title` source string to include the brand, which would break the frozen-title tests on purpose in 14 places and duplicate the brand string 25 times instead of reading it from `SITE.name`.

**New source titles** (owner copy, Spanish, no new claims):

| File | Before | After (page-owned part) | Rendered `<title>` |
| --- | --- | --- | --- |
| `src/pages/index.astro:120` | Consultor SEO en Sevilla \| Nuria Romero, SEO local y para IA | Consultor SEO en Sevilla, SEO local y para IA | Consultor SEO en Sevilla, SEO local y para IA \| Nuria Romero (60) |
| `src/pages/sobre-mi.astro:79` | Sobre mí — Nuria Romero, desarrolladora web en Sevilla | Sobre mí — Desarrolladora web en Sevilla | Sobre mí — Desarrolladora web en Sevilla \| Nuria Romero |
| `src/pages/aviso-legal.astro:7` | Aviso legal \| nuriaromero.dev | Aviso legal | Aviso legal \| Nuria Romero |
| `src/pages/privacidad.astro:7` | Política de privacidad \| nuriaromero.dev | Política de privacidad | Política de privacidad \| Nuria Romero |
| `src/pages/cookies.astro:7` | Política de cookies \| nuriaromero.dev | Política de cookies | Política de cookies \| Nuria Romero |

Legal pages: only the `title` prop changes (metadata consistency with this planned feature); descriptions and bodies are untouched.

**Header logo.** Remove `aria-label="Ir al inicio"` from the logo link and change the image to `alt="Nuria Romero, nuriaromero.dev"`, so the link's accessible name starts with the canonical brand (acceptance criterion) and also contains the text the wordmark shows ("nuriaromero.dev"), meeting WCAG 2.5.3 Label in Name: a voice-control user saying "nuriaromero.dev" or "Nuria Romero" activates it. Rejected: alt "Nuria Romero" alone (name does not contain the visible text), "nuriaromero.dev – Nuria Romero" (brand not first; the story asks for the brand as the name). The link to `/` is self-evident from its position (WCAG 2.4.4 is met by the brand name on a home link, the common pattern). NRD-259 also edits `Header.astro` (nav links and menus); this change touches only lines 51-55, so the two merge cleanly in either order.

**llms.txt.** Line 3 becomes: "Índice curado de información pública de la web de Nuria Romero (nuriaromero.dev). Nuria Romero Castillo desarrolla webs, ..." (rest unchanged). The legal name "Nuria Romero Castillo" stays where it names the person (allowed variant in `site.ts`).

### Files

| Action | Path | Symbols | Layer |
| --- | --- | --- | --- |
| create | `src/lib/seo-title.ts` | `TITLE_SEPARATOR`, `brandedTitle(title)` | app |
| modify | `src/components/seo/SEO.astro` | `<title>{brandedTitle(title)}</title>` | app |
| modify | `src/pages/index.astro`, `src/pages/sobre-mi.astro`, `src/pages/aviso-legal.astro`, `src/pages/privacidad.astro`, `src/pages/cookies.astro` | `title` prop only | app |
| modify | `scripts/check-seo-15.mjs` | measure title without `" | " + SITE.name`, assert suffix | app |
| modify | `scripts/check-seo-11.mjs` | title suffix on non-noindex pages, `og:site_name === SITE.name`, Organization-typed nodes complete (every node, not only the first with the `@id`) | app |
| modify | `tests/fixtures/blog-posts.baseline.json` | regenerated with `pnpm build && node scripts/check-seo-18.mjs --write` (only `title` values change; verify the diff) | app |
| modify | `src/lib/schema.ts` | imports `../data/site.ts`, `../data/local-trust.ts`, `import type` from `./google-reviews.ts`; `reviewsSchema` adds `name`, `url` | app |
| modify | `src/components/Header.astro` | logo link without `aria-label`; `<Image alt="Nuria Romero, nuriaromero.dev">` | app |
| modify | `public/llms.txt` | line 3 wording | app |
| create | `tests/site-identity.test.js` | unit and source tests below | app |

If `src/data/local-trust.ts` imports anything through the `@/` alias, switch that import to a relative `.ts` path too (same pattern); if `src/lib/google-reviews.ts` is needed only as a type, keep it as `import type` so node never loads it.

### Interfaces

```ts
// src/lib/seo-title.ts
import { SITE } from "../data/site.ts"
export const TITLE_SEPARATOR = " | "
/** Page title with the canonical brand as the only suffix. */
export function brandedTitle(title: string): string
```

`reviewsSchema(data: GoogleReviewsData)` keeps its signature; its result gains `name: SITE.name`, `url: SITE.url`.

### Data

None: no schema, storage or settings change. `SITE.name` stays the single brand source.

### Test plan (TDD order)

1. `tests/site-identity.test.js` (RED first):
   - `brandedTitle("Aviso legal")` is "Aviso legal | Nuria Romero"; `brandedTitle("Recursos para citar y compartir — Nuria Romero")` is unchanged; the result never contains the brand twice (scenarios "Service page title gains the suffix", "Title already ending with the brand").
   - Source test: the home title prop starts with "Consultor SEO en Sevilla" and does not contain "Nuria Romero"; `sobre-mi.astro` title does not contain "Nuria Romero"; no `src/pages/*.astro` title prop contains "nuriaromero.dev" ("Home title keeps its keyword first", "Legal pages stop using the domain as brand").
   - `SEO.astro` renders `<title>` from `brandedTitle(` and `og:title` from the raw `title`.
   - `reviewsSchema(fixture)` (import `src/lib/schema.ts`) returns `name === "Nuria Romero"`, `url === "https://nuriaromero.dev"`, `@id` ".../#business"; `localBusinessSchema().alternateName === "nuriaromero.dev"` ("Home with real Google reviews").
   - `Header.astro`: the `<a href="/"` logo link has no `aria-label`, its `<Image` has `alt="Nuria Romero, nuriaromero.dev"`: starts with `SITE.name` and contains `SITE.shortName` ("Screen reader reads the logo link", "Voice control uses the visible wordmark").
   - `public/llms.txt` first line is "# Nuria Romero" and line 3 contains "la web de Nuria Romero" ("llms.txt introduction").
2. `scripts/check-seo-11.mjs` new assertions, proven RED on the current `dist/` (titles without suffix) before the SEO.astro change, then GREEN ("A title without the brand fails the build check", "Site name differs from the brand", "Incomplete node fails the build check").
3. `scripts/check-seo-15.mjs` length on the page-owned part ("Page-owned title length stays guarded").
4. Full suite, `pnpm build`, `pnpm check:seo:dist` (with the regenerated blog fixture) green. `tests/seo-meta-titles.test.js` stays green unchanged.

### Real-browser / e2e checks

- VoiceOver or Chrome accessibility tree: the header logo link reads "Nuria Romero, nuriaromero.dev, enlace" on desktop and at 375 px; with macOS Voice Control, "Click nuriaromero.dev" activates it.
- Browser tab shows "… | Nuria Romero" on home, a service page, a blog post and a legal page.

### ADRs relied on

ADR 0004 (SEO head and JSON-LD in one place), ADR 0005 (build checks), ADR 0013 (home owns "consultor SEO Sevilla" in title), new ADR 0016 (title brand suffix).

## Risks / Trade-offs

- [Longer titles are truncated in results] → the brand goes last, so truncation drops the brand, never the page keyword; the 65-character guard keeps applying to the page-owned part (ADR 0016).
- [Blog fixture regeneration could hide an accidental post change] → the commit diff of `blog-posts.baseline.json` must change only `title` values; the reviewer checks it.
- [Reviews node only exists in production builds] → covered by the unit test on `reviewsSchema()`; `check-seo-11` covers it whenever review data is present.
- [Removing the "Ir al inicio" label] → the link keeps a meaningful name that starts with the brand and contains the visible wordmark text (WCAG 2.5.3 met; raised by the ux-designer and decided by the Tech Lead).

## Migration Plan

None. Rollback is reverting the commits.

## UI spec

No visual change: layout, wordmark asset, spacing, colors and motion stay exactly as on `develop`. Only the accessible name of one link and the browser-tab text change.

### Header logo link (`src/components/Header.astro`)

1. **Screens and layout**: n/a (same position, first item of the pill nav on every page; same `@/assets/nuriaromerodev-logo-blanco.svg`, classes `flex min-h-12 items-center px-2` on the link and `block h-10 w-auto` on the image unchanged).
2. **Hierarchy**: n/a.
3. **States**: n/a (static link). Hover, focus and active styling unchanged.
4. **Copy**: accessible name "Nuria Romero, nuriaromero.dev", taken from the image: `<Image alt="Nuria Romero, nuriaromero.dev">` (brand first, then the visible wordmark text); the link carries no `aria-label` and no `title`. Do not add visually hidden text ("Ir al inicio" or similar) inside the link: the name must be exactly that alt string.
5. **Design system reuse**: `Image` from `astro:assets` and the existing link classes; no new tokens or components.
6. **Responsive**: n/a. The logo link is visible and identical at 320 px, 375 px and every breakpoint; the accessible name is the same on mobile and desktop.
7. **Interactions**: n/a (navigation to `/` unchanged; keep the 48 px tap target from `min-h-12`).
8. **Accessibility hand-off**: the logo link stays first in the tab order, before the "servicios" button. Screen readers announce "Nuria Romero, nuriaromero.dev, enlace". The name contains the visible wordmark text "nuriaromero.dev", so voice-control users can activate the link by saying it (WCAG 2.5.3 Label in Name; spec scenario "Voice control uses the visible wordmark").

### Browser tab and page titles (`src/components/seo/SEO.astro` via `brandedTitle`)

4. **Copy**: the tab shows the page-owned title followed by " | Nuria Romero", with the exact strings from the "New source titles" table above; the brand appears once per title. On-page headings (H1, keyword headings) do not change.
1-3, 5-8: n/a (head metadata only, no rendered element).
9. **GEO-ready content**: the brand is written exactly "Nuria Romero" (`SITE.name`) in every title suffix and in `public/llms.txt`; no new visible content, no "updated" date added.
