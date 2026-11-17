# Design: real, build-derived dateModified for pages and posts

## Context

See proposal.md - Why. Current state on `develop`:

- `src/layouts/Layout.astro:40` emits the global JSON-LD `[localBusinessSchema(), websiteSchema()]`; no page emits a `WebPage` node or any page date. Every page renders through `Layout` (directly, or via `ServiceLayout`, `BlogPostLayout`, `LegalLayout`).
- `src/lib/schema.ts:206-227` `articleSchema` sets `datePublished = pubDate`, `dateModified = updatedDate ?? pubDate`. `src/layouts/BlogPostLayout.astro:60-78` shows "Publicado el <time>" always and "Actualizado el <time>" when `updatedDate` exists, both with `datetime` from `toISOString()`.
- `astro.config.mjs:16-45` sets sitemap `lastmod` only for blog posts, from `updatedDate ?? pubDate` (`toISOString()`), never the build date (invariant "Sitemap, robots and llms.txt stay consistent").
- `src/layouts/LegalLayout.astro:35-37` shows a hand-written "Última actualización: {updated}" ("julio de 2026" on the three legal pages): the legal text version, not a page modification date.
- `scripts/check-seo-16.mjs` deep-compares every JSON-LD entity of `/seo-local-sevilla/` with `tests/fixtures/seo-local-sevilla.baseline.json`.
- `scripts/lib/template-pages.mjs` word ranges are tight (`/inteligencia-artificial/` 849 of 850, `/seo-para-ia/` 842 of 850, `/automatizaciones/` 788 of 800 on the current build); ADR 0015 removes `data-word-budget="exclude"` subtrees before counting.
- CI (`.github/workflows/ci.yml:22`) uses `actions/checkout@v4` with the default depth 1, so CI builds run in a shallow clone. Netlify's clone depth is not documented in the repo.
- `src/data/navigation.ts` shows the pattern for modules that `node --test` imports: relative imports with the `.ts` extension. `@types/node` is present (transitive), so `node:child_process` type-checks without a new dependency.

## Goals / Non-Goals

**Goals:**

- One build-time function decides a page's date from git, memoized, with safe omission.
- JSON-LD, visible label and checks agree by construction (same value object) and are guarded on `dist/`.
- Shallow builds (CI) pass every check with the dates omitted.

**Non-Goals:**

- Page `lastmod` in the sitemap; CI or Netlify configuration changes; dates for shared components or styles.

## Decisions

**Approach.** `src/lib/freshness.ts` runs `git log -1 --format=%H %cI -- <paths>` with `execFileSync` (no shell) from the repository root, returns the committer date in ISO 8601 with offset, and returns `undefined` on any error, empty output, or when the found commit is listed in the repository's `shallow` file (`git rev-parse --git-path shallow`), because a boundary commit only proves "this or earlier". Results are memoized per path list. `src/data/page-freshness.ts` maps each indexable route (trailing slash) to its repo-relative sources: the page file plus the `src/data` modules holding its copy or prices; blog posts are not in the map (their dates come from frontmatter). `Layout.astro` looks up `Astro.url.pathname`, and when the page is not `noindex` and a date exists, appends `webPageSchema({ url, name: title, dateModified })` to its global `<Schema>`. `PageUpdated.astro` renders the visible label from the same lookup; `ServiceLayout` (both variants) and `index.astro` render it, at the place the UI spec chooses. The label carries `data-word-budget="exclude"` (it is build-derived and absent in shallow builds, the same CI/production parity reason as ADR 0015). `scripts/check-seo-21.mjs` validates everything on `dist/`; `check-seo-16` drops `WebPage` entities before comparing. Alternatives rejected: build time (forbidden by the story and the GEO rules), a hand-kept `updatedDate` per page in `src/data` (manual, drifts, bumps without content change), a per-page `import.meta.url` lookup (points to the compiled chunk at build time, not the source file).

**Route-to-sources map** (`src/data/page-freshness.ts`):

| Route | Sources |
| --- | --- |
| `/` | `src/pages/index.astro`, `src/data/services.ts` |
| `/seo-local-sevilla/`, `/seo-para-ia/`, `/diseno-web-sevilla/`, `/desarrollo-software-medida/`, `/automatizaciones/`, `/inteligencia-artificial/`, `/seo-para-clinicas-capilares-sevilla/` | the page file, `src/data/services.ts` |
| `/tienda-online-sevilla/` | the page file, `src/data/services.ts`, `src/data/store-offer.ts` |
| `/web-para-restaurantes-sevilla/`, `/web-para-clinicas-sevilla/`, `/web-para-abogados-gestorias-sevilla/`, `/web-para-comercios-sevilla/` | the page file, `src/data/niches.ts` |
| `/contacto/` | `src/pages/contacto.astro`, `src/data/services.ts` |
| `/sobre-mi/`, `/portfolio/`, `/recursos/`, `/aviso-legal/`, `/privacidad/`, `/cookies/` | the page file |
| `/blog/` | `src/pages/blog/index.astro`, `src/content/blog` |

Excluded: `/404.html` (noindex), `/blog/<slug>/` (frontmatter dates), `public/informes/**` (private, static). `services.ts` holds the copy of every service page, so an edit to one service also refreshes the others' date: accepted (a real commit date of the page's data, never invented), documented in ADR 0017.

**Label pages.** Visible label only on the routes rendered by `ServiceLayout` (service, niche and capilares pages) and the home. `/contacto/`, `/sobre-mi/`, `/portfolio/`, `/recursos/`, `/blog/` and legal pages get the JSON-LD node only.

### Files

| Action | Path | Symbols | Layer |
| --- | --- | --- | --- |
| create | `src/lib/freshness.ts` | `getLastModified(paths, options?)`, `formatMonthYear(iso)` | app |
| create | `src/data/page-freshness.ts` | `pageSources`, `getPageDateModified(pathname)` | app |
| modify | `src/lib/schema.ts` | `webPageSchema(page)` | app |
| modify | `src/layouts/Layout.astro` | appends `webPageSchema` when a date exists and not `noindex` | app |
| create | `src/components/PageUpdated.astro` | props `{ date?: string }` | app |
| modify | `src/layouts/ServiceLayout.astro`, `src/pages/index.astro` | render `<PageUpdated date={getPageDateModified(Astro.url.pathname)} />` per the UI spec | app |
| modify | `src/layouts/BlogPostLayout.astro` | `data-post-published` / `data-post-updated` on the two `<time>` elements (no visible change) | app |
| create | `scripts/check-seo-21.mjs` | dist check (below) | app |
| modify | `scripts/check-seo-16.mjs` | filter out `@type === "WebPage"` before comparing; regenerate the fixture only if it changes | app |
| modify | `package.json` | `check:seo-21`, `check:seo-21:dist`, append `node scripts/check-seo-21.mjs` to `check:seo:dist` | app |
| create | `tests/freshness.test.js`, `tests/page-freshness.test.js` | unit tests below | app |
| modify | `docs/adr/README.md` index, new `docs/adr/0017-build-derived-freshness.md` | written with this design | app |

### Interfaces

```ts
// src/lib/freshness.ts (relative .ts imports only; node:child_process, node:fs, node:path)
export interface FreshnessOptions { cwd?: string } // default process.cwd()
/** ISO 8601 committer date (with offset) of the newest commit touching any path; undefined when unknown. Memoized per cwd + paths. */
export function getLastModified(paths: readonly string[], options?: FreshnessOptions): string | undefined
/** "noviembre de 2026" (es-ES, Europe/Madrid). */
export function formatMonthYear(iso: string): string

// src/data/page-freshness.ts
export const pageSources: Readonly<Record<string, readonly string[]>>
/** Normalizes to a trailing slash, looks up pageSources, returns getLastModified(...) or undefined. */
export function getPageDateModified(pathname: string): string | undefined

// src/lib/schema.ts
export function webPageSchema(page: { url: string; name: string; dateModified: string }): {
  "@context": "https://schema.org"; "@type": "WebPage"; "@id": string /* <abs url>#webpage */;
  url: string; name: string; dateModified: string; isPartOf: { "@id": string /* WEBSITE_ID */ };
  about: { "@id": string /* BUSINESS_ID */ }; inLanguage: "es"
}
```

`PageUpdated.astro` markup (styling per UI spec): `<p class="page-updated" data-word-budget="exclude">Actualizado: <time datetime={date} data-page-updated>{formatMonthYear(date)}</time></p>`; renders nothing when `date` is undefined.

`scripts/check-seo-21.mjs` (reads `dist/`, skips `informes/`):

- every `dateModified`/`datePublished` found in JSON-LD matches `^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$` and is not later than the HTML file's mtime (plus 5 minutes tolerance);
- a `time[data-page-updated]` requires a `WebPage` `dateModified` with the identical `datetime`; legal routes have no `data-page-updated`; `noindex` pages have no `WebPage` node;
- blog posts: `time[data-post-published]` equals Article `datePublished`; `time[data-post-updated]`, when present, equals Article `dateModified`, else `dateModified === datePublished`;
- `dist/sitemap-0.xml`: each post `lastmod` equals its Article `dateModified`; no non-blog URL has `lastmod`;
- prints how many pages carry a date (0 is valid: shallow build).

### Data

No schema or storage change. Dates are computed at build time from git history; nothing is written to the repository.

### Test plan (TDD order)

1. `tests/freshness.test.js` (RED first; creates throwaway repos in `os.tmpdir()` with `git init`, fixed `GIT_COMMITTER_DATE`/`GIT_AUTHOR_DATE`, local `user.name`/`user.email`):
   - one path, earlier commit → its ISO date ("Page changed in an earlier commit");
   - two paths changed on different dates → the newest ("Several sources");
   - untracked path and a non-repository directory → `undefined` ("No repository");
   - `git clone --depth 2 file://<repo>`: a path changed in HEAD → date; a path last changed at the boundary or earlier → `undefined` ("Shallow clone");
   - `formatMonthYear("2026-11-10T09:30:00+01:00") === "noviembre de 2026"`.
2. `tests/page-freshness.test.js`: every `src/pages/**/*.astro` route except `404.astro` and `blog/[slug].astro` has a `pageSources` entry and every listed source exists ("Unregistered page"); `getPageDateModified("/diseno-web-sevilla")` and `("/diseno-web-sevilla/")` use the same entry; `webPageSchema` returns the shape above (import `src/lib/schema.ts`; it needs relative imports: if NRD-241 is not merged yet, merge `develop` first or make the same relative-import change).
3. Source assertions in `tests/page-freshness.test.js`: `Layout.astro` adds `webPageSchema` only when not `noindex`; `PageUpdated.astro` carries `data-word-budget="exclude"` and `data-page-updated`; `LegalLayout.astro` does not render `PageUpdated` ("Legal page").
4. `scripts/check-seo-21.mjs` written against the current `dist/`: RED on the label/JSON-LD rule with a hand-edited copy of a built page (mismatched `datetime`), GREEN on the real build; `check-seo-16` passes with and without the node (build once normally, once from a `git clone --depth 1` of the branch).
5. Full suite, `pnpm build`, `pnpm check:seo:dist` green.

### Real-browser / e2e checks

- `/diseno-web-sevilla/`, `/web-para-restaurantes-sevilla/` and `/` at 375 px and 1280 px: the label is legible (AA contrast on the ink ground), discreet, does not wrap awkwardly, and is not mistaken for a CTA.
- A blog post: "Publicado el" and, where present, "Actualizado el" unchanged visually.
- `/privacidad/`: no new label.

### Owner-account actions (executed by the orchestrator)

- After the next scheduled promotion of `develop` to `main` reaches production: fetch `https://nuriaromero.dev/` and `https://nuriaromero.dev/diseno-web-sevilla/`, record whether the `WebPage` `dateModified` and the label are present, and comment the result on NRD-242 (this answers "does the Netlify clone give enough history"). **Executable owner action** (public pages, no account needed).
- If the dates are absent in production: read the Netlify deploy log of that build for the clone step (Netlify API with the configured token, else the user's signed-in browser in an attended session, else queue it in `.claude/state/attended-actions.json`) and comment the clone depth on NRD-242. **Executable owner action**. Changing Netlify build settings or the CI checkout depth is not part of this story; any such change is a **hard limit** (provider/site settings, repository CI config needs its own story and infra routing).

### ADRs relied on

ADR 0001 (static output, build-time work only), ADR 0004 (JSON-LD only through `schema.ts`/`Schema.astro`), ADR 0005 (sitemap lastmod blog-only, build checks), ADR 0014 (template pages, reference fixture), ADR 0015 (word budget marker), new ADR 0017.

## Risks / Trade-offs

- [Netlify builds from a shallow clone] → the pages omit dates (truthful, not invented); verified after the first promotion (owner-account action), and a follow-up story can raise the clone depth if needed.
- [A shared data module refreshes several pages' dates] → accepted and documented: the date is a real commit of the page's data; never later than the content's real change of that module.
- [Commits that only reformat a page bump its date] → accepted; the repo formats only edited files, so whole-repo reformat commits do not happen (CLAUDE.md).
- [Build time grows] → about 25 `git log` calls, memoized; negligible.
- [Legal pages carry a JSON-LD `dateModified` that may differ from their visible legal-version date] → different meanings (page vs legal text version); the legal label is not touched (legal pages are owner territory).
- [`check-seo-21` compares against file mtime] → tolerance of 5 minutes; `dist/` is always freshly built in CI and `pnpm check:seo`.

## Migration Plan

None. Rollback is reverting the commits; no data to migrate.

## UI spec

Scope: the visible "Actualizado: <mes año>" label (`src/components/PageUpdated.astro`) on the routes rendered by `src/layouts/ServiceLayout.astro` (both variants: the seven template service pages and the legacy niche/capilares pages) and on the home (`src/pages/index.astro`). Blog posts, legal pages and every other route: no visible change. These are Persuade pages, so the label is page metadata: quiet, never competing with the hero, the booking CTA or the proof strip.

### PageUpdated component (`src/components/PageUpdated.astro`)

1. **Screens and layout**: a single `<p class="page-updated" data-word-budget="exclude">` with the markup fixed in Interfaces. It owns no outer margin; the parent places it (sections below).
2. **Hierarchy**: tertiary meta, same weight as the breadcrumb trail. Never a heading, never inside the `<nav aria-label="Miga de pan">`, never a link.
3. **States**:
   - Date present: renders the label.
   - Date undefined (shallow clone, untracked file, git unavailable): renders nothing at all (no empty `<p>`, no placeholder, no "fecha no disponible" text); the surrounding layout looks exactly like today's page.
   - Loading, error, empty, disabled: n/a (build-time static text).
4. **Copy** (Spanish, fixed by the acceptance criterion "Actualizado: <mes año>"):
   - Visible text: `Actualizado: ` followed by `formatMonthYear(date)`, e.g. `Actualizado: noviembre de 2026`. Month in lowercase, as es-ES writes it and as `formatMonthYear` returns it; no day, no time.
   - `datetime` attribute: the full ISO value (`date`), identical to the `WebPage` `dateModified`.
   - Assumption: the colon form "Actualizado:" (not "Actualizado el", which stays exclusive to blog posts with a full date) keeps the month-year page label distinguishable from the post byline.
5. **Design system reuse**:
   - Import `@/styles/template.css` in the component (as `src/components/Breadcrumbs.astro` does) so the tokens exist on legacy pages too.
   - Scoped styles: `.page-updated { margin: 0; font-size: 0.875rem; line-height: 1.5; color: var(--text-muted); white-space: nowrap; }` and `.page-updated time { color: var(--text-secondary); }`. These are the exact size, line height and colour steps of `.crumbs` / `.crumbs-current`, so the label reads as part of the same meta line (DESIGN.md "Label" role, `text-muted` for meta).
   - Assumption: the date itself takes `text-secondary` (one step brighter) so the eye lands on the month, mirroring `.crumbs-current`. No other emphasis: no bold, no Instrument Serif, no sky or yellow colour, no icon, pill, border, uppercase or tracking (The Reserved Yellow Rule, The One Serif Phrase Rule).
   - New component: none beyond `PageUpdated` itself, already in the design's Files list.
6. **Responsive**: `white-space: nowrap` keeps the label on one line; the longest month ("Actualizado: septiembre de 2026", about 31 characters at 0.875rem) fits in the 288 px content width at 320 px.
7. **Interactions**: none. No hover, focus, cursor change, transition or animation of its own (it inherits the existing `SectionContainer` reveal where its parent section has it).
8. **Accessibility hand-off**: plain text read in document order; no `aria-live`, no `aria-label` override (the visible text is the accessible text); not focusable. Contrast: `#94a3b8` on `#050a18` (template ground) and on `#030712` (legacy site ground) is about 7.5:1; `#cbd5e1` is higher.
9. **GEO-ready content**: the date shown is the build-derived real last change from the same lookup as the JSON-LD, never a fixed or build-time date; when unknown it is absent (state above). Brand string: n/a (the label does not mention the brand). No hidden text.

### Service and niche pages (`src/layouts/ServiceLayout.astro`, both variants)

1. **Screens and layout**: the label sits in a meta row with the breadcrumbs, at the top of the first `SectionContainer`, before the `hero` slot. In both the `template` and the `legacy` branch, replace the bare `<Breadcrumbs items={breadcrumbs} />` with:
   ```astro
   <div class="page-meta">
     <Breadcrumbs items={breadcrumbs} />
     <PageUpdated date={dateModified} />
   </div>
   ```
   with `const dateModified = getPageDateModified(Astro.url.pathname)` computed once in the frontmatter.
   Assumption: next to the breadcrumbs is the existing meta line of every service page, the first thing a reader and a crawler meet, and it stays clear of the hero heading, the CTA and the proof strip, so the date reads as page metadata and not as a claim or a call to action.
   - Layout styles (scoped in `ServiceLayout.astro`): `.page-meta { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 0.25rem 1.5rem; margin-bottom: 1.5rem; }` and `.page-meta :global(.crumbs) { margin-bottom: 0; }`. The 1.5rem below the row equals today's `.crumbs` bottom margin, so the hero does not move, with or without a date. Do not edit `src/components/Breadcrumbs.astro` (its styles are pinned by `tests/breadcrumbs-ink.test.js`).
2. **Hierarchy**: breadcrumbs first (left), label second (right on wide rows, below on narrow ones). DOM and reading order: breadcrumb nav, label, hero `<h1>`.
3. **States**: date present: row as above. Date absent: the row holds only the breadcrumbs, visually identical to today. Rest n/a.
4. **Copy**: only the component copy above; breadcrumbs unchanged.
5. **Design system reuse**: `src/components/Breadcrumbs.astro` and `src/components/SectionContainer.astro` unchanged; tokens from `src/styles/template.css` via the component.
6. **Responsive**:
   - 320-767 px, and any width where trail plus label do not fit on one line (long niche crumbs such as "Web para abogados y gestorías en Sevilla"): the label wraps onto its own line directly below the breadcrumbs, left-aligned (a lone wrapped flex item with `space-between` sits at the start), 0.25rem row gap.
   - From 768 px (container `md:max-w-2xl`) when both fit: one line, breadcrumbs left, label right-aligned on the same baseline.
   - Nothing hides at any width; no horizontal overflow at 320 px.
7. **Interactions**: n/a (breadcrumb link states unchanged).
8. **Accessibility hand-off**: the label stays outside the breadcrumb `<nav>` so the landmark holds only navigation; tab order unchanged; exactly one `<h1>`.
9. **GEO-ready content**: as in the component.

### Home (`src/pages/index.astro`)

1. **Screens and layout**: the label goes at the end of the page, inside the last `SectionContainer` (the one holding `SeoLocalNap`, "Dónde trabajo: La Rinconada, Sevilla"), directly after `<SeoLocalNap ... />`, wrapped so the spacing exists only when there is a date:
   ```astro
   {homeDateModified && (
     <div class="home-updated"><PageUpdated date={homeDateModified} /></div>
   )}
   ```
   with `const homeDateModified = getPageDateModified(Astro.url.pathname)` in the frontmatter and `.home-updated { margin-top: 2.5rem; }` scoped in `index.astro`.
   Assumption: the home has no breadcrumb meta row; a meta line above the hero would sit between the header and the keyword heading of the most important viewport (and inside `#home-hero`, which `check-seo-12` inspects). The closing NAP block is the page's factual footer, where "last updated" reads naturally and cannot be mistaken for proof or a CTA.
2. **Hierarchy**: last line of `main`, after the NAP content, before the site footer. It does not join the `ProofStrip` (a date there would read as a proof figure).
3. **States**: date present: label as above. Date absent: no wrapper, no extra space; the NAP section ends as today.
4. **Copy**: only the component copy.
5. **Design system reuse**: `src/components/SectionContainer.astro` and `src/components/seo-local/SeoLocalNap.astro` unchanged.
6. **Responsive**: left-aligned at every width, on the NAP content's left edge; single line from 320 px up.
7. **Interactions**: n/a.
8. **Accessibility hand-off**: read after the NAP content; not focusable; no announcement.
9. **GEO-ready content**: as in the component.

### Unchanged UI

- Blog posts (`src/layouts/BlogPostLayout.astro`): the "Publicado el" / "Actualizado el" byline keeps its look; only the `data-post-*` attributes are added.
- Legal pages (`src/layouts/LegalLayout.astro`): keep "Última actualización: {updated}"; no `PageUpdated`.
- `/contacto/`, `/sobre-mi/`, `/portfolio/`, `/recursos/`, `/blog/`: no visible label (JSON-LD only, per the design).
