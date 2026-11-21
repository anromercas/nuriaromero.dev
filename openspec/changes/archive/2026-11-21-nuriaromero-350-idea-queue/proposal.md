## Why

Tracker: [NRD-350](https://nuriaromerodev.atlassian.net/browse/NRD-350).

The blog pipeline must not depend on the owner inventing topics. In her comments of 2026-11-21 on NRD-327 she asked for a "step 0" of continuous idea discovery: 4 posts a month (minimum 2) across four pillars (SEO local and GEO; web design and online stores; artificial intelligence; other services: custom software and automations), with topics taken from real questions (People Also Ask, question keywords, client questions from the NRD-323 report, Search Console queries), not free brainstorming. The NRD-327 design does not cover it.

## What Changes

- One idea queue `seo/contenido/ideas.json` (`{ version: 1, ideas: [...] }`), one entry per idea: question, keyword, intent, volume, difficulty, target page or cluster, pillar, score, source with date, status (`propuesta`, `aprobada`, `rechazada`, `en curso`, `publicada`) and date added.
- `scripts/lib/idea-queue.mjs` (reader from NRD-347) gains the full entry validation, intent classification, a deterministic score (volume, difficulty, service fit, GEO citability), a de-duplicated merge (NRD-347 `dedupeCandidates` against owners, published posts and every queued idea), a pillar-balanced pick of the top 4 proposals, status changes and stable serialization.
- `scripts/blog-ideas-refresh.mjs`: reads saved exports (NRD-346 formats), merges new ideas as `propuesta`, rewrites the queue and prints the "Ideas para el blog" report section with the 4 best proposals, or says plainly that there is not enough data. `scripts/blog-idea-status.mjs <id> <status>` records the owner's approve/reject.
- Weekly hook: `.claude/harness/seo.md` gains a "Weekly blog idea refresh" section for the scheduled SEO run (inside the existing `seo.dataforseo.maxCallsPerRun`, at most 6 calls for ideas, no paid service added); the top 4 appear in the run report for the owner to approve or reject.
- The `blog-pipeline` skill (NRD-349) gains step 0 (apply the owner's decisions to the queue) and starts its topic step from `aprobada` ideas.

## Out of scope

- New data providers or paid services; raising the DataForSEO call cap; changing the team-harness `seo` skill itself.
- Writing posts (the skill does it per topic); the cadence is a target for the owner, not an automated publisher.
- Committing the queue from the unattended SEO run (it has no commit rights); see design Risks.

## Capabilities

### New Capabilities

- `blog-idea-queue`: continuous, de-duplicated, ordered idea queue feeding the blog pipeline.

### Modified Capabilities

- None (the skill's queue input is specified here because `blog-pipeline-skill` is not archived yet).

## Impact

- Layer `app`: `scripts/lib/idea-queue.mjs`, `scripts/blog-ideas-refresh.mjs`, `scripts/blog-idea-status.mjs`, tests and fixtures; shared paths `seo/contenido/ideas.json`, `seo/contenido/README.md`, `.claude/harness/seo.md`, `.claude/skills/blog-pipeline/SKILL.md` routed to `app`.
- Depends on NRD-345, NRD-346, NRD-347 and NRD-349 being merged first. No dependency, URL, copy, schema or site data change; no new external service; nothing radical.
