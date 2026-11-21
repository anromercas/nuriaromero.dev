## Why

Tracker: [NRD-345](https://nuriaromerodev.atlassian.net/browse/NRD-345).

The blog content pipeline (NRD-327) keeps `tema.md`, `esquema.md` and the idea queue in `seo/contenido/`, but `seo/` is not tracked today (neither on `develop` nor in `.gitignore`), so those artifacts would never reach a PR or survive a clean clone. The PO decided on 2026-11-21 to track only `seo/contenido/`, as the NRD-327 design recommends.

## What Changes

- New tracked file `seo/contenido/README.md` (Spanish, read by the owner) describing the folder: `seo/contenido/<slug>/tema.md`, `seo/contenido/<slug>/esquema.md`, the idea queue `seo/contenido/ideas.json` (fields and statuses, filled by NRD-350), what does not belong there, and the rule that nothing publishes without the owner's merge.
- New test `tests/content-workspace.test.js` guarding the README and the recorded storage decision.
- `docs/designs/NRD-327-blog-content-pipeline.md`: the "Storage decision" line records the chosen path.
- New ADR 0020 (written in this design branch) records the pipeline-wide decisions: tracked working folder, deterministic scripts, project skill, owner gates.

## Out of scope

- Tracking or ignoring the rest of `seo/` (`seo/estudios/`, `seo/ranks/`); `.gitignore` is not touched.
- The queue file itself (`seo/contenido/ideas.json`, NRD-350), the pipeline scripts (NRD-346, NRD-347), the skill (NRD-349).
- Any change under `src/` or `public/`.

## Capabilities

### New Capabilities

- `content-workspace`: the tracked, documented working folder of the blog content pipeline.

### Modified Capabilities

- None.

## Impact

- Layer `app`: `tests/content-workspace.test.js` (new), `docs/designs/NRD-327-blog-content-pipeline.md`; shared path `seo/contenido/README.md` routed to `app`.
- `docs/adr/0020-blog-content-pipeline.md` and the ADR index (Tech Lead, this branch).
- No dependency, URL, copy, schema or data change; nothing radical.
