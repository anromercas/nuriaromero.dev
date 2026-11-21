# Tasks

Starts after NRD-346 is merged into `develop` (extends `scripts/blog-shortlist.mjs`). Ships before NRD-349 and NRD-350.

## 1. Topic de-duplication

- [x] 1.1 [NRD-359 app] `scripts/lib/topic-dedup.mjs` (`STOPWORDS`, `topicTokens`, `coveredBy`, `dedupeCandidates` with `owned-intent` and `published-post`) and `scripts/lib/blog-posts.mjs` (`readPosts`); tests: `tests/blog-topic-dedup.test.js` first (tokens, coverage rule, owned term, intent topic, published post, draft does not block, free idea kept)
- [ ] 1.2 [NRD-360 app] `scripts/lib/idea-queue.mjs` reader (`IDEA_STATUSES`, `DEFAULT_QUEUE_PATH`, `parseIdeaQueue`, `readIdeaQueue`), `queued-idea` drops and `describeReason`, wired into `scripts/blog-shortlist.mjs` (`--queue`, `--posts`, "Descartadas" table, `dropped` in `--json`); tests: `tests/blog-shortlist-dedup.test.js` first (blocking vs non-blocking statuses, missing and malformed queue, CLI reasons for the three rules)

## Workflow follow-up

- QA runs the shortlist on fixtures and one real export.
- Archive the change at dev-done (`/team-harness:dev`).
