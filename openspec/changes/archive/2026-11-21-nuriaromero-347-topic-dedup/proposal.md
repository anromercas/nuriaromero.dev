## Why

Tracker: [NRD-347](https://nuriaromerodev.atlassian.net/browse/NRD-347).

A post that targets an intent already owned by a page cannibalises that page (ADR 0012), and re-proposing a published or rejected topic wastes the owner's approval time. The shortlist of NRD-346 ranks candidates but does not know what the site already owns, publishes or has rejected.

## What Changes

- New pure helper `scripts/lib/topic-dedup.mjs`: token-based topic coverage (`topicTokens`, `coveredBy`) and `dedupeCandidates`, which drops a candidate covered by a `keywordOwners` or `intentMatrix` row of `src/data/seo-intents.ts`, by the title of a published post, or by an idea of the queue whose status is `rechazada`, `en curso` or `publicada`. Every drop carries a reason (kind, reference, detail).
- New `scripts/lib/blog-posts.mjs` (`readPosts`): title and `draft` of every `src/content/blog/*.md`.
- New `scripts/lib/idea-queue.mjs` reader (`parseIdeaQueue`, `readIdeaQueue`, `IDEA_STATUSES`, `DEFAULT_QUEUE_PATH` = `seo/contenido/ideas.json`): the minimal queue contract; NRD-350 extends it with the full entry shape and the writer.
- `scripts/blog-shortlist.mjs` applies the de-duplication by default (`--queue`, `--posts` options) and prints a "Descartadas" table with the reason of each drop; `--json` includes `dropped`.

## Out of scope

- Creating or writing the idea queue, scoring and the weekly refresh (NRD-350).
- Changing `keywordOwners` or `intentMatrix` rows; resolving pre-existing overlaps.
- Semantic (embedding or model) similarity: matching is deterministic token coverage.
- Any change under `src/` or `public/`.

## Capabilities

### New Capabilities

- `blog-topic-dedup`: the topic shortlist drops owned intents, published posts and settled queued ideas, with a reason for each.

### Modified Capabilities

- None (the `blog-pipeline-scripts` capability of NRD-346 is not yet archived; this behaviour is specified as its own capability).

## Impact

- Layer `app`: `scripts/lib/topic-dedup.mjs`, `scripts/lib/blog-posts.mjs`, `scripts/lib/idea-queue.mjs` (new), `scripts/blog-shortlist.mjs` (modified), tests and fixtures under `tests/`.
- Depends on NRD-346 (merged first): `shortlistTopics`, `Candidate`, `normaliseTerm` reuse.
- No dependency, URL, copy, schema or data change; nothing radical.
