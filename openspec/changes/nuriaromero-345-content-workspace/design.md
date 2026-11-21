## Context

- `seo/` exists only in the main checkout (`seo/estudios/`, `seo/ranks/history.jsonl`), untracked and not ignored (`.gitignore` has no `seo` entry; `git ls-files seo` is empty). `repo.qaExemptPaths` in `.claude/harness.json` already lists `seo/ranks/`.
- The NRD-327 design (`docs/designs/NRD-327-blog-content-pipeline.md:26`) left the storage choice to the PO; the PO chose `seo/contenido/` on 2026-11-21 (NRD-345 description).
- `seo/` is not in any layer's `paths` and is not infra-owned, so `seo/contenido/README.md` is a shared path; it is routed to the only layer, `app`.
- Pattern for "a doc must exist and name X" tests: `tests/design-md-fonts.test.js`, `tests/iteration-review-routine.test.js` (read a file with `readFile` and `assert.match`).
- ADR 0020 (this branch) records the pipeline-wide decisions the later stories build on.

## Goals / Non-Goals

**Goals:** a tracked, documented working folder whose README names every artifact the pipeline writes; a test that keeps the README honest; the decision recorded where the design asked for it.

**Non-Goals:** tracking `seo/estudios/` or `seo/ranks/`; `.gitignore` changes; creating `ideas.json` (NRD-350) or any slug folder; scripts or skill.

## Decisions

**Approach.** Add one Spanish README at `seo/contenido/README.md` (the owner reads it; sibling `seo/estudios/*.md` are Spanish too) and commit it by exact path, which is enough for git to track the folder without touching `.gitignore`. A node:test file reads the README and the NRD-327 design and asserts the required names, so removing the file or dropping `tema.md`/`esquema.md` fails CI. The queue file name `ideas.json` is fixed here (ADR 0020) so NRD-347 and NRD-350 can rely on it; its content arrives with NRD-350.

**README content** (headings and bullets, Spanish, about 40-70 lines):

- `# Carpeta de trabajo del blog` plus one sentence: what the folder is (working files of the blog pipeline, versioned so approvals travel with the PR).
- `## Estructura`:
  - `ideas.json`: the single idea queue (NRD-350). Each entry: `id`, `question` (pregunta que responde), `keyword`, `intent`, `volume`, `difficulty`, `target` (página o clúster destino), `pillar` (`seo`, `web`, `ia`, `servicios`), `score`, `source` (`name`, `date`), `status`, `added`. Statuses: `propuesta`, `aprobada`, `rechazada`, `en curso`, `publicada`, with one line each on who sets them.
  - `<slug>/tema.md`: chosen topic, question, demand data with source and date, intent, target page, `Estado`.
  - `<slug>/esquema.md`: H1, H2 list, secondary keywords, direct answer, word target, sources, `Estado` (format validated by `scripts/blog-outline-lint.mjs`, NRD-346).
- `## Qué no va aquí`: drafts go to `src/content/blog/<slug>.md` with `draft: true`; covers to `src/assets/blog/`; raw DataForSEO and Search Console exports to `.claude/state/seo/` (not versioned); the rest of `seo/` is not versioned.
- `## Reglas`: nothing publishes without the owner's merge; every claim in a draft cites a source listed in `esquema.md`; one keyword owner per intent (ADR 0012); commit exact paths (`git add seo/contenido/<ruta>`), never `git add seo/`.

**Files.**

- Create `seo/contenido/README.md` (shared path, layer `app`).
- Create `tests/content-workspace.test.js` (layer `app`).
- Modify `docs/designs/NRD-327-blog-content-pipeline.md` (layer `app`): replace the "Storage decision" paragraph with `Storage decision (PO, 2026-11-21, NRD-345): \`seo/contenido/\` is tracked (only that folder; the rest of \`seo/\` stays untracked).` followed by the original reasoning in one sentence.
- Tech Lead, this branch: `docs/adr/0020-blog-content-pipeline.md` and its row in `docs/adr/README.md`.

**Interfaces.** None (documentation and a test).

**Data.** No schema, storage or settings change. No migration.

**Test plan (TDD order).**

1. `tests/content-workspace.test.js` first (RED: the README does not exist):
   - "README exists and names the pipeline files": `readFile("seo/contenido/README.md")` resolves and matches `/tema\.md/`, `/esquema\.md/`, `/ideas\.json/` (scenarios "README present", "README removed or incomplete").
   - "README names every queue status": matches each of `propuesta`, `aprobada`, `rechazada`, `en curso`, `publicada`.
   - "NRD-327 design records the storage decision": the line starting with `Storage decision` in `docs/designs/NRD-327-blog-content-pipeline.md` matches `/seo\/contenido\//` and `/NRD-345/` (scenario "Decision recorded").
2. Write the README and edit the design line; GREEN. Then `node --test tests/*.test.js` and `pnpm build`.
3. Scenario "Commit contents" is checked by the developer and QA with `git show --stat HEAD` (only `seo/contenido/README.md` under `seo/`).

**Real-browser / e2e checks.** None: no page, layout or asset changes. QA checks `git show --stat` of the story commit and that `git ls-files seo` lists only `seo/contenido/README.md`.

**ADRs relied on.** ADR 0012 (keyword ownership, cited in the README), ADR 0020 (new, this branch).

## Risks / Trade-offs

- `git add seo/` would sweep `seo/estudios/` and `seo/ranks/` into the commit in the main checkout. Mitigation: the subtask and README require exact paths; QA checks the commit stat.
- The README describes the queue fields before NRD-350 builds the queue; if NRD-350 changes a field name it must update the README in the same change (stated in NRD-350's design).
- Optional for the PO, not done here: adding `seo/contenido/` to `repo.qaExemptPaths` would skip browser QA for stories that only touch working files. It is a harness config choice, so it is left out of this story.
