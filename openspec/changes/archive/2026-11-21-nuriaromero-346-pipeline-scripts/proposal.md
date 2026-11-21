## Why

Tracker: [NRD-346](https://nuriaromerodev.atlassian.net/browse/NRD-346).

The mechanical steps of the blog content pipeline (NRD-327, sections 4 and 5 of `docs/designs/NRD-327-blog-content-pipeline.md`) must not spend model steps: ranking topic candidates, checking an outline, scaffolding a post's frontmatter and counting words are deterministic and belong in tested scripts.

## What Changes

- **Topic shortlist** `scripts/blog-shortlist.mjs`: reads saved keyword/question exports (the project's normalized JSON, a DataForSEO API response or a Search Console search-analytics response), keeps question-shaped topics, merges duplicates, classifies each into a content pillar with a target page, and prints candidates ordered by fit and volume, each with its question and dated source. Pure helpers `scripts/lib/keyword-data.mjs`, `scripts/lib/blog-pillars.mjs`, `scripts/lib/topic-shortlist.mjs`.
- **Outline lint** `scripts/blog-outline-lint.mjs` over `scripts/lib/outline-lint.mjs`: rejects an `esquema.md` with zero or several H1, without an H2 list, without a word target, without sources or without a direct answer.
- **Frontmatter scaffold** `scripts/blog-scaffold.mjs` over `scripts/lib/post-frontmatter.mjs`: builds frontmatter valid for the blog collection schema, cover included, always `draft: true`; writes `src/content/blog/<slug>.md` only with `--write` and an explicit slug.
- **Word count** `scripts/blog-word-count.mjs` over `scripts/lib/word-count.mjs`: counts body words of a post (no frontmatter) and compares them with the outline's target.
- One fixture-based test file per script in `tests/`.

## Out of scope

- De-duplication against keyword owners, published posts and the idea queue (NRD-347).
- The idea queue and its weekly refresh (NRD-350); the skill that calls the scripts (NRD-349) and its approval gate on `--write`.
- Calling DataForSEO, Search Console or any API: scripts only read saved files.
- `package.json` script aliases (the skill calls `node scripts/...` directly), new dependencies, any change under `src/` or `public/`.

## Capabilities

### New Capabilities

- `blog-pipeline-scripts`: deterministic shortlist, outline lint, frontmatter scaffold and word count for the blog content pipeline.

### Modified Capabilities

- None.

## Impact

- Layer `app`: 4 CLIs under `scripts/`, 6 helpers under `scripts/lib/`, 4 test files and fixtures under `tests/fixtures/blog-pipeline/`.
- Reads `src/content/blog-schema.ts` in tests; reuses `normaliseTerm` from `scripts/lib/keyword-ownership.mjs`.
- No dependency, URL, copy, schema or data change; nothing radical. ADR 0020 (written in NRD-345's branch) records the scripts-over-model-steps rule.
