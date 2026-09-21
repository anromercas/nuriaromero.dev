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
- [x] SEO-03 Exclude components page — removed only the standalone `src/pages/components.astro` demo page; the gallery is intentionally unavailable in development and shared components remain available to public pages. See `docs/seo-audit/full-audit-2026-09-21/tasks/03-excluir-components.md`.
- [ ] SEO-04 Validate CWV and LCP — **Estado: parcial**; baseline local documentada, pero la medición real de CWV/LCP sigue pendiente por tooling/acceso faltante. Ver `docs/seo-audit/full-audit-2026-09-21/tasks/04-validar-cwv-y-lcp.md`.
- [ ] SEO-05 Diversify niche pages — **Estado: parcial**; se hicieron visibles títulos sectoriales de beneficios y proceso en las cuatro páginas sin añadir claims, casos, imágenes ni testimonios. Quedan bloqueados los ejemplos y la prueba de experiencia por autorizaciones humanas. Ver `docs/seo-audit/full-audit-2026-09-21/tasks/05-diversificar-paginas-nicho.md`.
- [ ] SEO-06 Improve internal linking — **Estado: parcial**; mapa hub/spoke y enlaces contextuales implementados y comprobados localmente; queda pendiente la aprobación comercial/editorial de las relaciones abiertas. Ver `docs/seo-audit/full-audit-2026-09-21/tasks/06-arquitectura-enlazado-interno.md`.
- [ ] SEO-07 Resolve cannibalization — **Estado: parcial**; matriz URL→intención→tema→CTA, separación editorial blog/servicio GEO, precio/diseño web y comercio/tienda online, FAQs de nicho sin preguntas duplicadas y checker determinista local implementados. La validación GSC de consultas/URLs y la aprobación comercial de prioridades siguen pendientes; no se declara resuelta la canibalización. Ver `docs/seo-audit/full-audit-2026-09-21/tasks/07-resolver-canibalizacion.md`.
- [ ] SEO-08 Improve citability and readability — **Estado: parcial**; FAQs renderizadas con respuesta directa destacada y contexto separado, post GEO con sección answer-first, definiciones/lista escaneables y enlaces absolutos. `npm run check:seo-08` valida build, 98 FAQs, `FAQPage` schema y enlaces; quedan pendientes revisión editorial móvil y verificación remota de disponibilidad. Ver `docs/seo-audit/full-audit-2026-09-21/tasks/08-mejorar-citabilidad-y-legibilidad.md`.
- [ ] SEO-09 Add authorship and llms.txt improvements — **Estado: parcial**; el post GEO muestra autora enlazada a `/sobre-mi/` y publicación verificable, `/sobre-mi/` enlaza al blog, y `public/llms.txt` es un índice curado con 18 enlaces absolutos seleccionados y límites explícitos sin promesas a crawlers. `npm run check:seo-09` valida build + autoría/schema/enlaces y pasa con 22 páginas, 0 errores, 0 warnings y 1 hint preexistente. Queda pendiente la verificación desplegada HTTP 200 y la comprobación remota de enlaces oficiales. Ver `docs/seo-audit/full-audit-2026-09-21/tasks/09-autoría-y-llms.md`.
- [ ] SEO-10 Strengthen GBP and social proof — **Estado: parcial**; se añadió un bloque visible de transparencia en `/seo-local-sevilla/`, un registro seguro de GBP/prueba social pendiente de datos humanos y `npm run check:seo-10`, que bloquea ratings, reseñas y enlaces Maps no verificados. La decisión de crear/reclamar GBP, sus datos públicos y cualquier consentimiento de prueba social siguen pendientes. Ver `docs/seo-audit/full-audit-2026-09-21/tasks/10-gbp-prueba-social.md`.
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
- SEO-03 decision: removed only `src/pages/components.astro`, the standalone demo page. No real use of `/components/` was found, so the gallery is eliminated rather than retained for development or preview; shared components remain untouched and available to public pages. `astro.config.mjs` and its existing sitemap filter remain unchanged.
- SEO-03 focused verification: a fresh `npm run build` completed with Astro check reporting 0 errors, 0 warnings and 1 preexisting hint in `src/components/seo/Schema.astro`; Astro generated 22 pages. The resulting `dist/components/index.html` is absent, the generated HTML-route listing has no `/components/`, and neither `dist/sitemap-0.xml` nor `dist/sitemap-index.xml` contains a `/components/` URL. No remote deployment check was run.
- SEO-04 baseline local (completado): `npm run build` OK (22 páginas, 0 errores, 0 warnings, 1 hint preexistente); `BROWSER=none netlify dev --offline --no-open --dir dist --port 8888` y `curl -sSIL --max-redirs 0 http://localhost:8888<ruta>` devolvieron `HTTP 200` para home + 10 plantillas. Host/puerto: `localhost:8888`; viewport/dispositivo/conexión: N/A; runtime harness: N/A porque no hay harness CWV y no se ejecutaron Lighthouse/Playwright/web-vitals. PSI/CrUX/GA4: N/A por falta de tooling/acceso. No se inventan métricas: LCP/INP/CLS y elemento LCP siguen pendientes; el hero es textual y no hay evidencia para `fetchpriority`/`eager`/`preload`.
- SEO-05 RED: `node scripts/check-seo-05.mjs` falló antes de los cambios porque los cuatro HTML renderizados aún usaban los títulos compartidos de beneficios/proceso y la tarea no documentaba los bloques comunes.
- SEO-05 GREEN: `npm run check:seo-05` construye las 22 páginas con 0 errores, 0 warnings y 1 hint preexistente de `Schema.astro`; después, `node scripts/check-seo-05.mjs` confirma títulos sectoriales, similitud de copy mediante n-gramas, guards deterministas de claims explícitos, canonical, JSON-LD `Service`/`FAQPage`/`BreadcrumbList` y bloques compartidos documentados para las cuatro rutas renderizadas. El guard no sustituye una revisión editorial completa ni acredita experiencia sectorial.
- SEO-05 changed files: `src/data/niches.ts` (títulos sectoriales visibles), `scripts/check-seo-05.mjs` (check de HTML renderizado), `docs/seo-audit/full-audit-2026-09-21/tasks/05-diversificar-paginas-nicho.md` y este backlog (alcance, evidencia y bloqueo).
- SEO-05 quality corrections: `check:seo-05` integra build + checker; el checker es independiente del cwd, tolera orden de atributos/elementos en canonical y JSON-LD, detecta similitud por n-gramas y amplía los guards deterministas. La documentación limita explícitamente lo que esta automatización acredita.
- Remote push authorization: destination branches are named by the user; credential/session to use must be confirmed before remote operation.

## Next step
Continue with SEO-05; mantener SEO-04 en estado parcial hasta disponer de PSI/CrUX/GA4 o Lighthouse/Playwright para medir CWV/LCP de forma reproducible.

- SEO-06 local implementation (partial): added `src/data/internal-links.ts` as the explicit hub/spoke map for home, six service pages, four niche pages, and four blog posts; `src/components/InternalLinks.astro` renders contextual versus conversion links. `src/layouts/ServiceLayout.astro`, `src/layouts/BlogPostLayout.astro`, and `src/pages/index.astro` consume the map without linking to unpublished routes.
- SEO-06 focused verification: `npm run check:seo-06` completed the Astro build and `node scripts/check-seo-06.mjs`; 22 rendered pages, 0 errors, 0 warnings, 1 preexisting hint in `src/components/seo/Schema.astro`, 15 mapped origins and all mapped destinations checked. `git diff --check` is clean.
- SEO-06 pending human decision: the map's commercial relationship between `/diseno-web-sevilla/`, `/seo-local-sevilla/`, `/tienda-online-sevilla/`, and `/web-para-comercios-sevilla/` still needs editorial/business approval coordinated with SEO-02 and SEO-07. No external authority or ranking claims were added.
- SEO-07 local evidence: `src/data/seo-intents.ts` records six primary intent rows with topic and CTA ownership; the GEO article remains informational while `/seo-local-sevilla/` remains commercial, and price guidance remains informational while `/diseno-web-sevilla/` remains commercial. `/web-para-comercios-sevilla/` owns local catalogue/presence and `/tienda-online-sevilla/` owns checkout, stock and ecommerce delivery.
- SEO-07 focused verification: `npm run check:seo-07` runs `npm run build` and `node scripts/check-seo-07.mjs`; build completed with 0 errors, 0 warnings and 1 preexisting Astro hint, then the checker passed 6 intent rows, all 32 rendered niche FAQs, and 2 reciprocal link pairs. The checker also guards title/meta/H1/copy signals and fails if a niche FAQ question is duplicated across routes.
- SEO-07 limitation: local HTML checks prove deterministic differentiation only. GSC query/URL evidence is still pending under SEO-14, and commercial/editorial priorities remain human decisions; no ranking or canibalization resolution claim is made.

- SEO-08 local implementation (partial): `src/components/services/FAQ.astro` now renders each FAQ's first sentence as a highlighted direct answer and the remaining context as a separate paragraph. The GEO post adds a short-answer section, scannable definitions and an ordered action list, while service links in extracted content use absolute URLs.
- SEO-08 focused verification: `npm run check:seo-08` completed the Astro build with 22 pages, 0 errors, 0 warnings and 1 preexisting hint in `src/components/seo/Schema.astro`; `scripts/check-seo-08.mjs` then passed 98 rendered FAQs, visible/schema question-count parity, semantic GEO structure and absolute service links.
- SEO-08 pending human evidence: mobile editorial review and deployed-link availability remain pending. The local checker does not claim remote availability, citation visibility or ranking outcomes.

- SEO-09 local evidence: `src/layouts/BlogPostLayout.astro` renders the linked author, `Publicado el` and optional `Actualizado el`; `src/components/AboutMe.astro` links back to `/blog/`; `public/llms.txt` contains 18 absolute links to selected public resources plus two already-declared official profiles. `npm run check:seo-09` runs a fresh build and `scripts/check-seo-09.mjs`, confirming the visible author/date, `Article` schema, curated link allowlist and no private/ephemeral/tracking URLs.
- SEO-09 pending deployment evidence: local generation cannot prove HTTP 200 on production or external profile availability, and does not claim crawler treatment, citation, indexation or rankings.

- SEO-10 local evidence: `src/data/local-trust.ts` keeps GBP identifiers/URLs and social-proof records empty until human verification; `LocalTrustStatus.astro` communicates the pending state without publishing fabricated evidence. `npm run check:seo-10` runs a fresh build and `scripts/check-seo-10.mjs`, which validates the transparency block and rejects unverified ratings, reviews, Maps URLs, and Place IDs.
- SEO-10 pending human evidence: creating or claiming a SAB GBP, choosing category/service area/hours, deciding whether any address is public, and obtaining consent/evidence for testimonials, case studies, logos, images, or metrics. No external profile access or remote deployment check was performed.
