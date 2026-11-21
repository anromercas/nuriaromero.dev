# Tasks

Starts after NRD-345, NRD-346, NRD-347 and NRD-349 are merged into `develop`. Last story of the blog pipeline chain.

## 1. Idea queue

- [ ] 1.1 [NRD-365 app] Extend `scripts/lib/idea-queue.mjs` with `ideaId`, `validateIdea`, `classifyIntent`, `scoreIdea`, `mergeIdeas`, `pickProposals`, `setIdeaStatus`, `serializeQueue`; tests: `tests/blog-idea-queue.test.js` first (duplicates of any status, owner or post not added, new idea with every field, no-pillar skipped, exact scores, byte-stable serialization, pillar-balanced pick, status change)
- [ ] 1.2 [NRD-366 app] Create `scripts/blog-ideas-refresh.mjs`, `scripts/blog-idea-status.mjs` and the empty `seo/contenido/ideas.json` (exact path only); tests: `tests/blog-ideas-refresh.test.js` first (required date, four proposals, fewer-than-four and no-data messages, dry run, idempotent rerun, status CLI, repo queue validates)
- [ ] 1.3 [NRD-367 app] Add the weekly refresh to `.claude/harness/seo.md`, step 0 and the queue-based topic step to `.claude/skills/blog-pipeline/SKILL.md`, approve/reject instructions to `seo/contenido/README.md`; tests: `tests/seo-brief-ideas.test.js` and `tests/blog-pipeline-skill.test.js` cases first

## Workflow follow-up

- QA runs the refresh on fixtures and one real saved export with a temporary queue.
- Archive the change at dev-done (`/team-harness:dev`).
