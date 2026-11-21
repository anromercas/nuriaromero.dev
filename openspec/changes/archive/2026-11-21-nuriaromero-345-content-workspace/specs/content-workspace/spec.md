## ADDED Requirements

### Requirement: The content working folder is tracked and documented

The repository SHALL track `seo/contenido/README.md`, which MUST describe the blog pipeline working files: `seo/contenido/<slug>/tema.md`, `seo/contenido/<slug>/esquema.md` and the idea queue file `seo/contenido/ideas.json`, including the queue entry fields and the statuses `propuesta`, `aprobada`, `rechazada`, `en curso` and `publicada`. A unit test SHALL fail when the README is missing or no longer names `tema.md` and `esquema.md`.

#### Scenario: README present

- **WHEN** `node --test tests/*.test.js` runs on a checkout that contains `seo/contenido/README.md` naming `tema.md`, `esquema.md` and `ideas.json`
- **THEN** the content workspace test passes

#### Scenario: README removed or incomplete

- **WHEN** `seo/contenido/README.md` is deleted, or its text no longer contains `tema.md` or `esquema.md`
- **THEN** the content workspace test fails naming the missing file or term

### Requirement: Only the content folder of seo/ is tracked

The change that tracks `seo/contenido/` SHALL NOT add any other file under `seo/` (for example `seo/estudios/` or `seo/ranks/`) to version control, and SHALL NOT change `.gitignore`.

#### Scenario: Commit contents

- **WHEN** the story's commit is inspected with `git show --stat`
- **THEN** the only path under `seo/` it adds is `seo/contenido/README.md`

### Requirement: The storage decision is recorded in the pipeline design

The "Storage decision" line of `docs/designs/NRD-327-blog-content-pipeline.md` SHALL state that the chosen path is `seo/contenido/` (PO decision of 2026-11-21, NRD-345).

#### Scenario: Decision recorded

- **WHEN** the content workspace test reads the NRD-327 design document
- **THEN** its "Storage decision" line names `seo/contenido/` as the chosen, tracked path
