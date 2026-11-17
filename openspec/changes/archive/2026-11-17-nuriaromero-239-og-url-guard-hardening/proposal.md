## Why

[NRD-239](https://nuriaromerodev.atlassian.net/browse/NRD-239). The PR #92 review of the NRD-236 og:url build guard left two LOW findings. First, `scripts/check-seo-20.mjs` and two tests resolve filesystem paths with `URL.pathname`, which keeps percent-encoding (`%20`, escaped non-ASCII), so the guard finds no files or crashes when the repository lives in a path with spaces or accents. Second, `isNoindex` in `scripts/lib/og-url.mjs` only recognises the `noindex` token, while robots `content="none"` is equivalent to `noindex, nofollow`; a future page using `none` would be wrongly treated as indexable by the guard.

## What Changes

- `isNoindex` treats a robots meta whose comma-separated tokens include `noindex` or `none` (case- and whitespace-insensitive) as noindex.
- `scripts/check-seo-20.mjs`, `tests/og-url-guard.test.js` and `tests/store-offer.test.js` turn file URLs into paths with `fileURLToPath` from `node:url` instead of `URL.pathname`.
- New unit test in `tests/og-url-guard.test.js` for `content="none"`.
- No change to any published HTML, page, component or `package.json` script.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `not-found-page`: two added requirements next to "Canonical is omitted only on noindex pages" (left unchanged): the og:url guard treats a page as noindex when its robots meta carries `noindex` or `none`, and it finds built pages from any checkout path.

## Impact

- Code: `scripts/lib/og-url.mjs`, `scripts/check-seo-20.mjs`, `tests/og-url-guard.test.js`, `tests/store-offer.test.js` (layer `app`).
- Build output: none. `pnpm check:seo-20:dist` reports the same indexable and noindex counts as before.
- No new dependency (`node:url` is a Node built-in), no radical change.

## Out of scope

- Changing what `src/components/seo/SEO.astro` emits (it keeps `noindex, nofollow`).
- Bot-specific robots metas (`googlebot`, `bingbot`) and the `X-Robots-Tag` header in `public/_headers`.
- Replacing `URL.pathname` in other scripts or tests not named in the story.
