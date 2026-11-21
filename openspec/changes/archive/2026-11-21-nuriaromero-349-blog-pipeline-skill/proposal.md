## Why

Tracker: [NRD-349](https://nuriaromerodev.atlassian.net/browse/NRD-349).

The owner wants to publish posts regularly without writing them from scratch and without losing control. The approved NRD-327 design (sections 2 and 5 of `docs/designs/NRD-327-blog-content-pipeline.md`) recommends a project skill that chains the existing SEO skills and the deterministic scripts, with an owner approval after every step.

## What Changes

- New tracked project skill `.claude/skills/blog-pipeline/` (`SKILL.md` plus templates `templates/tema.md` and `templates/esquema.md`): five steps (topic, outline, cover, draft, publish), each ending at a named owner approval point ("Aprobación 1 (tema)" to "Aprobación 5 (publicación)"). It uses the scripts of NRD-346/NRD-347 (shortlist with de-duplication, outline lint, frontmatter scaffold, word count) and the voice guide of NRD-348; the draft always carries the cover and its alt; the publish step hands over to the team-harness PR flow and never changes `draft`.
- `scripts/blog-scaffold.mjs` gains an approval gate: `--write` requires `--outline <esquema.md>` that passes the lint, has `Estado: aprobado` and the same slug, so nothing is written under `src/content/blog/` before the outline is approved. `scripts/lib/outline-lint.mjs` gains `isApproved`.
- New test `tests/blog-pipeline-skill.test.js`: the skill names the five approval points in order and the scripts, never instructs `draft: false`, and its scaffold command, run as written, produces `draft: true` and only with an approved outline.
- `seo/contenido/README.md` and `CLAUDE.md` point to the skill.

## Out of scope

- The idea queue as the topic source and the weekly refresh (NRD-350 adds a step 0 and the queue input).
- Producing cover images for the existing posts (NRD-331) or a new image tool; a CI guard on the `draft` flip (NRD-327 follow-up 7).
- Publishing any post: running the skill on a sample topic is a QA check whose artifacts are not committed.
- Other local skills in `.claude/skills/` (`flow-media`, `tira-comica`) stay untracked.

## Capabilities

### New Capabilities

- `blog-pipeline-skill`: owner-gated project skill that turns a topic into a draft post PR.

### Modified Capabilities

- None (the scaffold gate is specified in this capability because `blog-pipeline-scripts` is not archived yet).

## Impact

- Layer `app`: `scripts/blog-scaffold.mjs`, `scripts/lib/outline-lint.mjs`, `tests/blog-scaffold.test.js`, `tests/blog-outline-lint.test.js`, `tests/blog-pipeline-skill.test.js`, `tests/content-workspace.test.js`, `CLAUDE.md`; shared paths `.claude/skills/blog-pipeline/**` and `seo/contenido/README.md` routed to `app`.
- Depends on NRD-345, NRD-346, NRD-347 and NRD-348 being merged first. No dependency, URL, copy, schema or data change; nothing radical.
