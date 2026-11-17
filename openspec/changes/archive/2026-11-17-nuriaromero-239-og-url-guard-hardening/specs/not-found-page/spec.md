## ADDED Requirements

### Requirement: The og:url guard recognizes every noindex robots token

The og:url build check SHALL treat a page as noindex when its robots meta content, split by commas and compared case- and whitespace-insensitively, contains the token `noindex` or the token `none`, and SHALL treat every other page, including one without robots meta, as indexable.

#### Scenario: Robots none is treated as noindex

- **WHEN** the guard reads a page whose robots meta content is `none`, `NONE` or `none`
- **THEN** it treats the page as noindex, reports no problem when it has neither canonical nor `og:url`, and reports a problem when it declares either

#### Scenario: Index, follow stays indexable

- **WHEN** the guard reads a page whose robots meta content is `index, follow`, or a page without robots meta
- **THEN** it treats the page as indexable

### Requirement: The og:url guard finds built pages from any checkout path

The og:url build check and its tests SHALL turn file URLs into filesystem paths with `fileURLToPath`, so they find every built page regardless of spaces or non-ASCII characters in the repository path, and SHALL leave the built output unchanged.

#### Scenario: Guard paths are decoded file paths

- **WHEN** `scripts/check-seo-20.mjs`, `tests/og-url-guard.test.js` or `tests/store-offer.test.js` turn a file URL into a filesystem path
- **THEN** they use `fileURLToPath` from `node:url` and never `URL.pathname`

#### Scenario: Built output is unchanged

- **WHEN** `pnpm build` and `pnpm check:seo-20:dist` run after this change
- **THEN** they pass and report the same number of indexable and noindex pages as before it
