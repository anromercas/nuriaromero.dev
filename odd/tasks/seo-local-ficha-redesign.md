# SEO local Sevilla: rediseño "la ficha que se completa"

## Objective
Rediseñar `/seo-local-sevilla/` para que sea más gráfica, dinámica y orientada a conversión (referencia de estructura: landing de agencia SEO oscura tipo Palo Seco), con el estilo propio de la web y solo prueba real.

## Why
La versión actual es texto sobre paneles oscuros; la usuaria la considera poco bonita y poco dinámica.

## Authorized scope
Ruta `src/pages/seo-local-sevilla.astro`, nuevos componentes en `src/components/seo-local/`, slots opcionales en `src/layouts/ServiceLayout.astro`, copy de `seoLocal` en `src/data/services.ts`, una fuente nueva, tests y `scripts/check-seo-15.mjs`. Fuera de alcance: `capilarLocal` y el resto de páginas de servicio.

## Constraints (no negociables)
- Local 300 €/mes + IVA, Local Pro 500 €/mes + IVA (Recomendado). CTA único "Reservar una llamada" (`BookingButton`).
- Sin métricas, logos, testimonios ni casos con resultados inventados. Gráficos de ejemplo etiquetados "ejemplo ilustrativo".
- Sin garantías de posición, tráfico, leads ni citas de IA. Lenguaje general (no clínico). Sin "proyecto inicial" ni permanencia.
- Prueba real permitida: reseñas Google (`getGoogleReviews`, se oculta si no hay datos), proyectos Arkady y ADF Sevilla (`Projects only=`), "+10 años de experiencia", foto `perfil-home.webp`.
- Guía Impeccable: sin eyebrow/kicker sobre títulos, sin numeración 01/02, sin texto con gradiente, sin tarjetas iguales icono+título+texto como estructura, sin halos de color sin offset.
- Verificación visual en `http://localhost:4321` (no 127.0.0.1), desktop y mobile.

## Routing
TDD estricto (runner: `node --test tests/*.test.js`). Una sola vía de escritura delegada por tandas. Build path: code-led. Sin concept-seed (estructura fijada por la usuaria). Cada tarea cierra con commit convencional sin atribución.

## Tasks
- [x] T1 Fuente `@fontsource/instrument-serif` + slots opcionales en `ServiceLayout` (hero, benefits, process) con fallback idéntico para otras páginas (75d862a)
- [x] T2 `SeoLocalHero` (H1 con acento serif cursiva, ficha dibujada ilustrativa, fila de datos reales) (e7a9af2)
- [x] T3 Bento "qué se revisa" con mini-gráficos dibujados (SVG propio, sin librerías) (1fb6771)
- [x] T4 "Cómo trabajamos": foto real, ciclo mensual circular (fa61149)
- [x] T5 Pruebas reales: reseñas Google + 2 proyectos reales (e8ac0d0)
- [x] T6 (código; pendiente review visual móvil, finish review y DESIGN.md) Composición de ruta, copy `seoLocal`, planes restilizados, actualizar tests y `check-seo-15`, verificación visual, finish review, DESIGN.md

## Acceptance
Todos los tests y `npm run build` + `node scripts/check-seo-15.mjs` en verde; revisión visual desktop/mobile sin overflow; reviewer de Impeccable sin fixes materiales abiertos.

## Progress
Dirección aprobada 2026-10-08. Batch A (T1-T3) + fix 5929a52; batch B: T4 fa61149, T5 e8ac0d0, T6 commit final. Evidencia: 38/38 tests, astro check 0 errores, build ok, check-seo-15 ok, otras páginas idénticas salvo hashes de assets. VisibilityAudit retirado y tests reescritos.


Finish review round (2026-10-08): fix 9601979 (visual round 1); lower third bespoke (FAQ, related chips, closing band with completed listing), scroll-driven fill of hero listing with completed fallback, asymmetric bento, pull-quote proof, three-cell proof strip, ink-blue ground and bands, larger SVG labels, aligned plan buttons. Evidence: 46/46 tests, astro check 0 errors, build ok, check-seo-15 ok, other pages identical except home review dates now in Spanish. Open for owner: ADF Sevilla screenshot (src/assets/projects/adfsevilla.webp) looks visually broken; not touched (shared).

Final visual round (2026-10-08, parent): found and fixed two real regressions the tests could not see: bento areas collapsed by grid-column:auto (ReviewBento) and hero glow pool causing 54px horizontal scroll at 390px (SeoLocalHero). Both with regression tests. Verified in browser at 1440, 820 and 390: no horizontal overflow. Evidence: 48/48 tests, astro check 0 errors, build 24 pages, check-seo-15 ok. Impeccable finish reviewer disposition: fix (8 items applied) then parent verification; second reviewer pass and DESIGN.md not run (owner decision).
