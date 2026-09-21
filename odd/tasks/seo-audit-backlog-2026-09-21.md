# SEO audit backlog 2026-09-21

## Objective
Execute the 14 actionable SEO audit tasks documented in `docs/seo-audit/full-audit-2026-09-21/tasks/`, one work-unit commit per task on `develop`, then run the complete local verification suite before any remote push.

## Problem
The audit found technical redirect waste, internal URL inconsistencies, content duplication/cannibalization, GEO/E-E-A-T gaps, local trust gaps, mobile UX friction, and missing measurement evidence.

## Why
The user explicitly authorized implementation of the complete audit backlog in batches of three, with independent commits and production verification for checks that cannot be reproduced locally.

## Constraints
- Work on `develop`; do not push until all tasks and local verification are complete.
- Preserve unrelated untracked files: `.codex/`, `.playwright-mcp/`, and `docs/seo-audit/keywords/`.
- Never invent GBP, testimonial, opening-hours, location, performance, or backlink evidence.
- Use Conventional Commits without AI attribution.
- Execute tasks in batches of three, sequentially within each batch when dependencies require it.
- Full local test/build verification happens after all tasks; each task still receives focused checks where practical.

## Effective TDD
- Mode: enabled by project instructions.
- Source: session instructions.
- Runner: project scripts (`pnpm run build`; existing JS tests where applicable).
- SEO-01 updates Netlify redirect configuration only; no applicable unit-test target exists. The focused runtime check is `curl -I` against the four `/servicios/<slug>` URLs after a local server or deployed environment is available.

## Checklist

- [x] SEO-01 Fix service migration redirects — `docs/seo-audit/full-audit-2026-09-21/tasks/01-redirects-servicios.md`
- [ ] SEO-02 Normalize internal URLs — `docs/seo-audit/full-audit-2026-09-21/tasks/02-normalizar-urls-internas.md`
- [ ] SEO-03 Exclude components page — `docs/seo-audit/full-audit-2026-09-21/tasks/03-excluir-components.md`
- [ ] SEO-04 Validate CWV and LCP — `docs/seo-audit/full-audit-2026-09-21/tasks/04-validar-cwv-y-lcp.md`
- [ ] SEO-05 Diversify niche pages — `docs/seo-audit/full-audit-2026-09-21/tasks/05-diversificar-paginas-nicho.md`
- [ ] SEO-06 Improve internal linking — `docs/seo-audit/full-audit-2026-09-21/tasks/06-arquitectura-enlazado-interno.md`
- [ ] SEO-07 Resolve cannibalization — `docs/seo-audit/full-audit-2026-09-21/tasks/07-resolver-canibalizacion.md`
- [ ] SEO-08 Improve citability and readability — `docs/seo-audit/full-audit-2026-09-21/tasks/08-mejorar-citabilidad-y-legibilidad.md`
- [ ] SEO-09 Add authorship and llms.txt improvements — `docs/seo-audit/full-audit-2026-09-21/tasks/09-autoría-y-llms.md`
- [ ] SEO-10 Strengthen GBP and social proof — `docs/seo-audit/full-audit-2026-09-21/tasks/10-gbp-prueba-social.md`
- [ ] SEO-11 Align local schema and brand — `docs/seo-audit/full-audit-2026-09-21/tasks/11-schema-local-y-marca.md`
- [ ] SEO-12 Fix mobile UX and visual proof — `docs/seo-audit/full-audit-2026-09-21/tasks/12-ux-mobile-y-prueba-visual.md`
- [ ] SEO-13 Build authority/backlinks plan — `docs/seo-audit/full-audit-2026-09-21/tasks/13-autoridad-y-backlinks.md`
- [ ] SEO-14 Establish SEO measurement — `docs/seo-audit/full-audit-2026-09-21/tasks/14-medicion-seo.md`

## Delivery batches

- Batch 1: SEO-01, SEO-02, SEO-03
- Batch 2: SEO-04, SEO-05, SEO-06
- Batch 3: SEO-07, SEO-08, SEO-09
- Batch 4: SEO-10, SEO-11, SEO-12
- Batch 5: SEO-13, SEO-14

## Progress evidence

- Branch at start: `develop`.
- Audit backlog files exist under `docs/seo-audit/full-audit-2026-09-21/`.
- Implementation commit: this work unit (`fix(seo): avoid double redirects for migrated services`).
- SEO-01 observed configuration evidence: the four `/servicios/<slug>` rules now target canonical root URLs with trailing slashes.
- SEO-01 unit-test evidence: not applicable; `_redirects` is Netlify configuration and has no unit-test target.
- SEO-01 focused runtime evidence (`BROWSER=none netlify dev --offline --no-open --dir dist --port 8888` + `curl -sSIL --max-redirs 2`): `/servicios/diseno-web-sevilla` → `301 Location: /diseno-web-sevilla/` → `200`; `/servicios/desarrollo-software-medida` → `301 Location: /desarrollo-software-medida/` → `200`; `/servicios/automatizaciones` → `301 Location: /automatizaciones/` → `200`; `/servicios/inteligencia-artificial` → `301 Location: /inteligencia-artificial/` → `200`.
- Full local verification: pending.
- Remote push authorization: destination branches are named by the user; credential/session to use must be confirmed before remote operation.

## Next step
Commit the verified SEO-01 work unit, then continue with SEO-02.
