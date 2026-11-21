# Tasks

Independent of NRD-345. Ships before NRD-347 (extends the shortlist) and NRD-349 (skill calls the scripts).

## 1. Pipeline scripts

- [ ] 1.1 [NRD-355 app] Outline lint: `scripts/lib/outline-lint.mjs` (`parseOutline`, `lintOutline`) and `scripts/blog-outline-lint.mjs`; tests: `tests/blog-outline-lint.test.js` first with the `esquema-*.md` fixtures (one H1, H2 list, word target, sources, direct answer, fenced `#` ignored, CLI exit codes)
- [ ] 1.2 [NRD-356 app] Word count: `scripts/lib/word-count.mjs` (`stripFrontmatter`, `countWords`, `compareToTarget`) and `scripts/blog-word-count.mjs` reading the target with `parseOutline`; tests: `tests/blog-word-count.test.js` first (frontmatter, code, URLs excluded; accented and hyphenated words; within/under/over; CLI)
- [ ] 1.3 [NRD-357 app] Frontmatter scaffold: `scripts/lib/post-frontmatter.mjs` (`buildPostFrontmatter`) and `scripts/blog-scaffold.mjs` (`--write`, `--root`); tests: `tests/blog-scaffold.test.js` first (validates with `blogSchema`, always `draft: true`, any `draft` input throws, print-only writes nothing, write refuses existing post or missing cover)
- [ ] 1.4 [NRD-358 app] Topic shortlist: `scripts/lib/keyword-data.mjs`, `scripts/lib/blog-pillars.mjs`, `scripts/lib/topic-shortlist.mjs` and `scripts/blog-shortlist.mjs`; tests: `tests/blog-shortlist.test.js` first (every export shape, unknown shape fails, question filter, merge, deterministic order, pillar rules)

## Workflow follow-up

- QA runs each CLI on the fixtures and checks `pnpm build`.
- Archive the change at dev-done (`/team-harness:dev`).
