## Context

NRD-236 added the og:url build guard: the pure rule `scripts/lib/og-url.mjs` (`isNoindex`, `ogUrlProblems`) and the walker `scripts/check-seo-20.mjs`, tested in `tests/og-url-guard.test.js`. Today `isNoindex` matches `/noindex/i` inside the robots content, so `content="none"` counts as indexable. `scripts/check-seo-20.mjs:6` builds `dist` with `new URL("../dist/", import.meta.url).pathname`; the same pattern is in `tests/og-url-guard.test.js:104` (`distDir.pathname`) and `tests/store-offer.test.js:75,78,156`. `URL.pathname` stays percent-encoded, so these break in a checkout path with spaces or accents. `scripts/check-seo-05.mjs:3-5` already uses `fileURLToPath`, the pattern to reuse. The site itself only emits `noindex, nofollow` (`src/components/seo/SEO.astro:28`).

## Goals / Non-Goals

**Goals:** `none` recognised as noindex; decoded paths in the three files; one failing test first; no change in built HTML.

**Non-Goals:** changing `SEO.astro`, bot-specific robots metas, `X-Robots-Tag`, touching other files that use `URL.pathname`.

## Decisions

`isNoindex` keeps its signature and stripping, but parses the robots `content` as comma-separated tokens (trimmed, lowercased) and returns true when a token is `noindex` or `none`. Token matching is stricter than the current substring regex but equivalent for every value the site emits (`noindex, nofollow`) and every value the tests use (`noindex,nofollow`). Path fixes are mechanical: wrap the file URL in `fileURLToPath` (imported from `node:url`) wherever the code needs a string path; calls that pass a `URL` object straight to `fs` (`readFileSync(new URL(...))`, `existsSync(new URL(...))`, dynamic `import(new URL(...))`) are already correct and stay. One subtask, one commit: the change is about 20 lines.

**Files** (all layer `app`):
- modify `scripts/lib/og-url.mjs`: `isNoindex` token parsing and JSDoc.
- modify `scripts/check-seo-20.mjs`: `import { fileURLToPath } from "node:url"`; `const dist = fileURLToPath(new URL("../dist/", import.meta.url));`.
- modify `tests/og-url-guard.test.js`: new test (below); import `fileURLToPath`; `walk(fileURLToPath(distDir))`.
- modify `tests/store-offer.test.js`: import `fileURLToPath`; line 75 prefix `fileURLToPath(root)` (keeps its trailing separator, so the relative result is unchanged); line 78 `walk(fileURLToPath(new URL("src", root)))`; line 156 `readdirSync(fileURLToPath(dir))`.

**Interfaces** (unchanged signatures):

```js
/** True when a robots meta carries the noindex or none token (case/space-insensitive). */
export function isNoindex(html: string): boolean
```

**Data:** none. No storage, settings, schema or built-HTML change.

**Test plan (TDD order):**
1. RED, `tests/og-url-guard.test.js`, new test "robots none is treated as noindex": `isNoindex(notFound("none"))`, `notFound("NONE")`, `notFound(" none ")` are true; `ogUrlProblems(notFound("none"))` is `[]`; `page({ robots: "none", canonical: null })` (has og:url) and `page({ robots: "none", og: [] })` (has canonical) report problems; `isNoindex(page({ robots: "index, follow" }))` and `isNoindex(page())` are false; `noindex, nofollow` / `noindex,nofollow` stay true. Covers scenarios "Robots none is treated as noindex", "Index, follow stays indexable". Fails today because `/noindex/` does not match `none`.
2. GREEN: change `isNoindex`.
3. Path refactor in the three files, covered by the existing tests ("built dist" test in og-url-guard, "499 €" and "props only" tests in store-offer) and by `rg -n "\.pathname"` returning nothing in the three files (scenario "Guard paths are decoded file paths").
4. Full suite `node --test tests/*.test.js`, `pnpm build`, `pnpm check:seo-20:dist`: record the indexable/noindex counts on `develop` before the change and compare (scenario "Built output is unchanged").

**Real-browser / e2e checks:** none; no UI or published HTML change. QA runs `pnpm build && pnpm check:seo-20:dist` and compares the reported counts with the `develop` baseline; optionally runs `node scripts/check-seo-20.mjs` from a copy of the repo in a path with a space (for example `$TMPDIR/nrd 239 qa/`) after building there.

**ADRs relied on:** none specific; invariants "Sitemap, robots and llms.txt stay consistent" (check-seo scripts keep passing) and "TDD".

## Risks / Trade-offs

- Token matching no longer matches `noindex` embedded in a longer word (for example `xnoindex`); that is more correct and no built page uses such a value.
- A future robots value combining `none` with `index` would be classified as noindex; browsers apply the most restrictive directive, so this matches crawler behavior.
