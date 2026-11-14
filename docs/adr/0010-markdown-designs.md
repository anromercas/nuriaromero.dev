# 0010. Markdown designs in `docs/designs/`

- Status: Accepted
- Date: 2026-11-12

## Context

Before team-harness, designs and plans were scattered: `docs/superpowers/specs` and `docs/superpowers/plans` (dated), and per-feature task documents in `odd/tasks/`. The site is small and has no living capability specs worth maintaining through OpenSpec deltas.

## Decision

- Each story's technical design is one markdown file `docs/designs/{KEY}-{storySlug}.md` (`design.mode: markdown`), written by the Tech Lead on the story branch and committed with it. It holds: Why (Jira key and link), What changes, Out of scope, Requirements and WHEN/THEN scenarios covering every acceptance criterion, Files, Interfaces, Data, Test plan (TDD order), Real-browser checks, Risks, ADRs, Tasks 1:1 with Jira subtasks. A `## UI spec` section is owned by the UX designer.
- The design file is the source of truth for how; Jira is the status.
- Existing `docs/superpowers/**` and `odd/tasks/**` stay as historical records and are not migrated.

## Consequences

- No OpenSpec CLI or `openspec/` folder; requirements are not consolidated into living specs, so a later story that changes the same behavior references the earlier design.
- Bugs get a short design in the Jira comment, not a file, unless they change a specified requirement.

## Evidence

- `.claude/harness.json`: `design.mode: markdown`, `design.markdown.changesDir: docs/designs`, `naming: {KEY}-{storySlug}.md`, `design.adrDir: docs/adr`.
- `docs/superpowers/specs/2026-10-05-seo-local-sevilla-redesign-design.md`, `docs/superpowers/plans/`, `odd/tasks/*.md` (earlier formats).
