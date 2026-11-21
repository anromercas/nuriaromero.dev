## Context

- Pipeline design: `docs/designs/NRD-327-blog-content-pipeline.md` sections 2 (steps, inputs, outputs, approval points) and 5 (project skill, scripts for deterministic steps). ADR 0020 (NRD-345 branch) records the working folder, scripts, skill and gate rules.
- Inputs this story builds on (all merged before it starts):
  - NRD-345: tracked `seo/contenido/README.md`, `tests/content-workspace.test.js`.
  - NRD-346: `scripts/blog-shortlist.mjs`, `scripts/blog-outline-lint.mjs` (`parseOutline`, `lintOutline` in `scripts/lib/outline-lint.mjs`, outline format with `Estado`), `scripts/blog-scaffold.mjs` (`--write`, `--root`, cover required, always `draft: true`), `scripts/blog-word-count.mjs`.
  - NRD-347: de-duplication inside `scripts/blog-shortlist.mjs` (`--queue`, `--posts`, "Descartadas").
  - NRD-348: `docs/blog-voice.md` and its checklist.
- Existing skills reused by name: `claude-seo:seo-content-brief`, `claude-seo:seo-sxo`, `claude-seo:seo-geo` (outline), `team-harness:flow-media` and the social library `social/mediateca` (`social.libraryDir`) as one image source; team-harness PR flow (`/team-harness:dev`, PR into `develop`, CI `verify`, ADR 0009) for publish.
- Covers: `cover { src, alt }` with files in `src/assets/blog/` (ADR 0019), weight and alt guarded by `scripts/check-seo-25.mjs`. NRD-331 (images for the 4 existing posts) is not done; the skill does not depend on it.
- Project skills live in `.claude/skills/<name>/SKILL.md` with YAML frontmatter `name` and `description`; `.claude/skills/` holds two untracked local skills (`flow-media`, `tira-comica`) that must stay out of commits.
- Draft safety: `tests/blog-drafts.test.js` proves `draft: true` never reaches pages, sitemap, RSS, listing or `llms.txt`.

## Goals / Non-Goals

**Goals:** a skill a session can run step by step, stopping at each owner approval; a script-enforced gate so no post file exists before the outline is approved; a test that pins the approval points and the skill's own scaffold command.

**Non-Goals:** the idea queue (NRD-350); generating images; flipping `draft`; a CI guard on the flip; committing sample-run artifacts.

## Decisions

**Approach.** The skill is instructions plus two templates; every mechanical action is a script call. Approval state lives in the artifacts (`Estado: aprobado (YYYY-MM-DD)` in `tema.md` and `esquema.md`, cover approval as a `- Portada:` field in `esquema.md`), so a later session resumes from files, not memory. The one hard gate is moved into code: `blog-scaffold.mjs --write` refuses unless the outline is lint-clean, approved and for the same slug, which makes acceptance criterion 2 testable instead of a convention. The test extracts the scaffold command from a marked block in `SKILL.md` and runs it, so the skill and the script cannot drift apart. The publish step only hands over; the owner flips `draft` in the PR.

**Skill content** (`.claude/skills/blog-pipeline/SKILL.md`, English instructions, artifacts and owner messages in Spanish):

- Frontmatter: `name: blog-pipeline`, `description:` one line ("Turn a real search question into a blog post draft PR for nuriaromero.dev, stopping for the owner's approval after topic, outline, cover, draft and publish").
- `## Before you start`: read `docs/blog-voice.md`, `seo/contenido/README.md`, ADR 0012 and ADR 0020; never set `draft` to false; never write under `src/content/blog/` except through the scaffold; commit exact paths only.
- `## Resume`: find the slug folder; the first artifact without `Estado: aprobado` (or missing cover approval, or missing draft) is the current step.
- `## Step 1. Topic`: input = saved exports in `.claude/state/seo/` (NRD-350 replaces this with the queue); run `node scripts/blog-shortlist.mjs <exports...> --limit 5`; show the owner the candidates and the "Descartadas" reasons; on the owner's pick write `seo/contenido/<slug>/tema.md` from `templates/tema.md` (question, keyword, intent, volume with source and date, pillar, target page, `Estado: pendiente de aprobación`). Stop: **Aprobación 1 (tema)**. On approval set `Estado: aprobado (<fecha>)`.
- `## Step 2. Outline`: with the SEO skills, write `seo/contenido/<slug>/esquema.md` from `templates/esquema.md` (H1, direct answer, H2 list, secondary keywords, word target, sources with dates; the H1 must not target a term owned by another page, ADR 0012); run `node scripts/blog-outline-lint.mjs seo/contenido/<slug>/esquema.md` until it passes. Stop: **Aprobación 2 (esquema)**.
- `## Step 3. Cover`: only after outline approval. Image from the owner, or from `social/mediateca` / `team-harness:flow-media`, never a stock image with unclear license or a recognisable person without consent; save as `src/assets/blog/<slug>.<jpg|png|webp>` (at least 1600 px wide, under the 100 KB generated-file guard of check-seo-25); write the alt text in Spanish describing the image; record `- Portada: <file> | alt: <texto>` in `esquema.md`. Stop: **Aprobación 3 (portada)**; on approval append `| aprobada (<fecha>)`.
- `## Step 4. Draft`: work on branch `feat/<KEY>-post-<slug>` from `develop`, where `<KEY>` is the post's tracker story (ask the PO skill to file one if none exists). Run the marked scaffold command; write the body following the outline and the voice guide (direct answer first, H2 from the outline, every figure cited, no promises); run `node scripts/blog-word-count.mjs src/content/blog/<slug>.md --outline seo/contenido/<slug>/esquema.md`, `node --test tests/*.test.js`, `pnpm build`, `pnpm check:seo:dist`; apply the voice checklist and paste the result for the owner; commit `seo/contenido/<slug>/`, the cover and the post by exact path. Stop: **Aprobación 4 (borrador)**.
- `## Step 5. Publish`: hand the branch to the team-harness PR flow (PR into `develop`, CI `verify`); the PR body says the post is a draft, lists what happens when the owner flips `draft` (page, sitemap, RSS, blog listing) and the follow-ups that go in that same owner-approved commit (`intentMatrix` row, internal links, `public/llms.txt` if it lists posts). The skill never changes `draft`: only the owner does, when she approves and merges. **Aprobación 5 (publicación)** is the owner's merge.
- The scaffold block is marked with an HTML comment on the line before the fence: `<!-- blog-pipeline:scaffold -->`, then:

```bash
node scripts/blog-scaffold.mjs --slug "<slug>" --title "<title>" --description "<description>" --date "<date>" --cover "<cover>" --alt "<alt>" --tags "<tags>" --outline "seo/contenido/<slug>/esquema.md" --write
```

**Templates.** `templates/tema.md`: `# Tema: <pregunta>` and fields `- Slug`, `- Pregunta`, `- Palabra clave`, `- Intención`, `- Volumen` (with source and date), `- Pilar`, `- Página destino`, `- Fuentes`, `- Estado: pendiente de aprobación`. `templates/esquema.md`: the NRD-346 outline format with placeholder Spanish text that passes the lint once `<slug>` is replaced (one H1, three `- H2:` items, `Objetivo de palabras: 900`, one source line, a direct-answer paragraph, `- Estado: pendiente de aprobación`, `- Portada:` empty).

**Files (layer `app`; `.claude/skills/**`, `seo/contenido/README.md` and `CLAUDE.md` are shared paths routed to `app`).**

- Modify `scripts/lib/outline-lint.mjs` (add `isApproved`) and `scripts/blog-scaffold.mjs` (gate) - task 1.1.
- Modify `tests/blog-scaffold.test.js`, `tests/blog-outline-lint.test.js` - task 1.1.
- Create `.claude/skills/blog-pipeline/SKILL.md`, `.claude/skills/blog-pipeline/templates/tema.md`, `.claude/skills/blog-pipeline/templates/esquema.md`, `tests/blog-pipeline-skill.test.js` - task 1.2.
- Modify `seo/contenido/README.md` (section "Cómo se usa"), `CLAUDE.md` (one line under "Arquitectura": `.claude/skills/blog-pipeline/`: pipeline del blog con aprobación de la dueña en cada paso), `tests/content-workspace.test.js` - task 1.3.

`.claude/` guard for tasks 1.2 and 1.3: only `.claude/skills/blog-pipeline/**` is added; no change to `.claude/settings.json`, `.claude/harness.json`, permissions, hooks or the team-harness plugin; `git add .claude/skills/blog-pipeline/` by exact path.

**Interfaces.**

```js
// scripts/lib/outline-lint.mjs (added)
export function isApproved(outline: ReturnType<typeof parseOutline>): boolean;
// true when outline.status matches /^aprobado(\s+\(\d{4}-\d{2}-\d{2}\))?$/

// scripts/blog-scaffold.mjs (changed)
// --write now also requires --outline <path> (resolved against --root):
//   missing --outline         -> exit 1 "blog-scaffold: --write needs --outline <esquema.md>"
//   lintOutline(...).ok false -> exit 1, prints the lint errors
//   !isApproved(outline)      -> exit 1 "blog-scaffold: outline is not approved (Estado: <status>)"
//   outline.slug !== --slug   -> exit 1 "blog-scaffold: outline slug <a> differs from --slug <b>"
// checks run before any file is created; print-only mode (no --write) unchanged and ignores --outline.
```

**Data.** No schema or settings change. No migration. Sample-run artifacts are not committed.

**Test plan (TDD order).**

1. Task 1.1, RED first in `tests/blog-outline-lint.test.js` (`isApproved` accepts `aprobado`, `aprobado (2026-11-24)`; rejects `pendiente de aprobación`, `aprobada`, null) and `tests/blog-scaffold.test.js` (scenarios "Pending outline" and "Approved outline"; also missing `--outline`, lint-failing outline, slug mismatch; each asserts no file under `<root>/src/content/blog/`).
2. Task 1.2, RED first in `tests/blog-pipeline-skill.test.js`:
   - frontmatter `name: blog-pipeline` and a non-empty `description`;
   - the five approval names appear in order (scenario "Approval points named");
   - mentions of `scripts/blog-shortlist.mjs`, `scripts/blog-outline-lint.mjs`, `scripts/blog-scaffold.mjs`, `scripts/blog-word-count.mjs`, `docs/blog-voice.md`, `seo/contenido/<slug>/tema.md`, `seo/contenido/<slug>/esquema.md`;
   - no match for `/draft:\s*false/` and a match for the owner-only flip sentence (scenario "No draft flip");
   - extract the fenced block after `<!-- blog-pipeline:scaffold -->`, replace the placeholders with sample values, split into argv, append `--root <tmp>`; in `<tmp>` write the filled `templates/esquema.md` with `Estado: aprobado (2026-11-24)` and a 1x1 cover under `src/assets/blog/`; run with `spawnSync(process.execPath, argv.slice(1), { cwd: repoRoot })`; the written post matches `/^draft: true$/m` (scenario "Scaffold as the skill calls it"); with `Estado: pendiente de aprobación` nothing is written (scenario "Pending outline");
   - the filled `templates/esquema.md` passes `lintOutline`.
3. Task 1.3, RED first: `tests/content-workspace.test.js` asserts the README names `.claude/skills/blog-pipeline/`.

**Real-browser / e2e checks.** No page changes. QA, as a real run (attended session): run the skill on a sample topic from a fixture export, approve the topic, and verify scenario "Sample run stops after the outline" (both files exist, lint passes, the skill stops, no file under `src/content/blog/`); then confirm the scaffold refuses with the pending outline (scenario "Draft without cover" by asking for the draft before a cover). Delete the sample folder afterwards; nothing from the run is committed.

**ADRs relied on.** ADR 0009 (branch flow), ADR 0012 (keyword ownership), ADR 0019 (covers), ADR 0020 (pipeline rules).

## Risks / Trade-offs

- A skill is instructions; only the scaffold gate is enforced by code. The flip of `draft` relies on review and on the owner (a CI guard is NRD-327 follow-up 7, not filed yet).
- A draft post on a branch can trip existing tests that iterate `src/content/blog/` (`tests/trailing-slash-links.test.js`, `tests/blog-post-template.test.js`); the draft step runs the full suite before asking for approval.
- Committing `seo/contenido/<slug>/` and the cover on the post branch means rejected drafts leave no trace on `develop`, which is intended.

## Dependencies

- Blocked by NRD-345 (folder), NRD-346 (scripts), NRD-347 (de-duplication), NRD-348 (voice guide); all must be on `develop` before task 1.1 starts. Blocks NRD-350 (adds step 0 and the queue input to this skill).
