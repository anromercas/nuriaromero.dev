# blog-pipeline-skill Specification

## Purpose
The `blog-pipeline` project skill turns a real search question into a blog post draft PR in five steps (topic, outline, cover, draft, publish), using the deterministic pipeline scripts and the voice guide, and stops for the owner's approval after each step; nothing is written under `src/content/blog/` before the outline is approved and `draft` is never set to false by the skill.

## Requirements

### Requirement: The skill runs five steps with an owner approval after each

`.claude/skills/blog-pipeline/SKILL.md` SHALL define, in order, the steps topic, outline, cover, draft and publish, each ending at a named approval point "Aprobación 1 (tema)", "Aprobación 2 (esquema)", "Aprobación 3 (portada)", "Aprobación 4 (borrador)" and "Aprobación 5 (publicación)", where the skill stops and waits for the owner.

#### Scenario: Approval points named

- **WHEN** the skill test reads `SKILL.md`
- **THEN** it finds the five approval point names in that order

### Requirement: Topic and outline are written to the content folder and stop for approval

The topic step SHALL write `seo/contenido/<slug>/tema.md` and the outline step `seo/contenido/<slug>/esquema.md` from the skill templates, each with `Estado: pendiente de aprobación`, and stop. The outline SHALL pass `scripts/blog-outline-lint.mjs` before the skill asks for approval.

#### Scenario: Sample run stops after the outline

- **WHEN** the skill runs on a sample topic and the owner approves the topic
- **THEN** `seo/contenido/<slug>/tema.md` and `seo/contenido/<slug>/esquema.md` exist, the outline passes the lint, the skill stops at "Aprobación 2 (esquema)" and nothing exists under `src/content/blog/` for that slug

### Requirement: No post file is written before the outline is approved

`scripts/blog-scaffold.mjs --write` SHALL require `--outline <esquema.md>` (resolved under `--root`) that passes the outline lint, whose `Estado` is `aprobado` (optionally followed by a date) and whose `Slug` equals `--slug`; otherwise it SHALL exit non-zero without creating any file.

#### Scenario: Pending outline

- **WHEN** the scaffold runs with `--write` and an outline whose `Estado` is `pendiente de aprobación`
- **THEN** it exits 1 and `src/content/blog/<slug>.md` does not exist

#### Scenario: Approved outline

- **WHEN** the scaffold runs with `--write` and an approved, lint-clean outline with the same slug
- **THEN** it writes `src/content/blog/<slug>.md` whose frontmatter has `draft: true`

### Requirement: The skill uses the pipeline scripts and the voice guide

The skill SHALL call `scripts/blog-shortlist.mjs` (with de-duplication), `scripts/blog-outline-lint.mjs`, `scripts/blog-scaffold.mjs` and `scripts/blog-word-count.mjs` for the mechanical steps, and SHALL make the draft step read and apply `docs/blog-voice.md`. Its scaffold command, run exactly as written in `SKILL.md`, SHALL produce frontmatter with `draft: true`.

#### Scenario: Scaffold as the skill calls it

- **WHEN** the test runs the command of the skill's marked scaffold block with sample values, an approved outline and `--root` set to a temporary directory
- **THEN** the written post's frontmatter contains `draft: true`

### Requirement: The draft always carries the cover and its alt

The cover step SHALL place the approved image under `src/assets/blog/<slug>.<ext>` with alt text approved by the owner, and the draft step SHALL always scaffold the post with that `cover` (the scaffold rejects a post without one).

#### Scenario: Draft without cover

- **WHEN** the draft step is attempted before a cover is approved
- **THEN** the skill stops at "Aprobación 3 (portada)" and no post is scaffolded

### Requirement: Publishing is the owner's decision

The publish step SHALL hand the draft branch to the team-harness PR flow (PR into `develop`, CI `verify`) and SHALL NOT change `draft` to `false`; the owner flips it when approving and merging. `SKILL.md` SHALL NOT contain an instruction to set `draft: false`.

#### Scenario: No draft flip

- **WHEN** the skill test scans `SKILL.md`
- **THEN** it finds no instruction that writes `draft: false` and finds the statement that only the owner flips `draft`
