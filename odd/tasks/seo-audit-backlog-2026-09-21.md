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
- [x] SEO-02 Normalize internal URLs — five bare target-route links in authorized blog sources now use trailing slashes; fresh recursive verification is green. See `docs/seo-audit/full-audit-2026-09-21/tasks/02-normalizar-urls-internas.md`.
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
- SEO-02 checker scope: `npm run check:seo-02` runs the existing build exactly once and then calls `node scripts/check-seo-02.mjs` directly, avoiding npm recursion. The checker recursively scans every `dist/**/*.html` for bare URLs in `href`, visible breadcrumbs, and JSON-LD schema values for the ten target routes; it preserves route-specific canonical, `BreadcrumbList`, and visible-breadcrumb assertions.
- SEO-02 RED evidence: before the amendment, a temporary copy of `dist/diseno-web-sevilla/index.html` was used to make one target `href` bare. `node scripts/check-seo-02.mjs` exited `1` with the expected bare-URL diagnostic; the rendered file was restored and the temporary copy removed.
- SEO-02 GREEN verification: after normalizing the five real bare target-route links in the authorized blog sources, `npm run check:seo-02` runs `npm run build` once and then `node scripts/check-seo-02.mjs`; it exits `0` after the fresh build reports 0 errors, 0 warnings and 1 preexisting hint. The recursive checker scans all 23 `dist/**/*.html` files and confirms all 10 canonical service/niche pages use trailing slashes in internal links, visible breadcrumbs, JSON-LD schema and canonicals. `git diff --check` is the integrity command; protected unrelated untracked paths remain untouched.
- SEO-02 public URL evidence (2026-09-21): executed `curl -sSIL --max-redirs 0` against all ten canonical URLs. Each returned exactly `HTTP/2 200`; none returned a `Location` header, so no redirect occurred: `/diseno-web-sevilla/`, `/desarrollo-software-medida/`, `/automatizaciones/`, `/inteligencia-artificial/`, `/seo-local-sevilla/`, `/tienda-online-sevilla/`, `/web-para-restaurantes-sevilla/`, `/web-para-clinicas-sevilla/`, `/web-para-comercios-sevilla/`, `/web-para-abogados-gestorias-sevilla/` on `https://nuriaromero.dev`.
- Full local verification: pending.
- Remote push authorization: destination branches are named by the user; credential/session to use must be confirmed before remote operation.

## Next step
Continue with SEO-03.
