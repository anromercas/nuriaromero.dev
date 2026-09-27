# SEO-28 — Meta titles y descriptions

## Objective
Alinear los meta titles/descriptions del sitio con el enfoque de autoridad personal que usan los referentes freelance (soyjaviersantos.com, soyrafaramos.com, sergiogarciamonge.es), sin copiar sus claims.

## Problem and why
Investigación (agente de exploración, 2026-09-27): los 3 referentes anclan "Consultor SEO + Sevilla" en el title de home, comunican años de experiencia y firman con su nombre. En nuriaromero.dev:
- El title de `/` es el único de todo el sitio sin "Sevilla".
- La description de `/` mide ~230 caracteres (límite recomendado ~155-160, riesgo de truncado).
- Las 11 páginas de servicio/nicho no comunican credencial de años de experiencia ni firma personal en title/description.

## Authorized scope and constraints
- Decisión del usuario: añadir firma de autoridad personal (nombre y/o años de experiencia), recomendado sobre mantener el estilo actual.
- Decisión del orquestador (criterio técnico, no reabre la pregunta): los titles de servicio/nicho ya siguen un patrón fuerte (servicio + Sevilla + precio/diferenciador) que es mejor gancho de CTR que el de los competidores (que no muestran precio); no se toca ese patrón salvo home. La firma personal y la credencial "+10 años de experiencia" (ya usada y verificada en `sobre-mi.astro` y `desarrollo-software-medida` seo.description) se añaden en las **descriptions**, en primera persona, donde hay margen de caracteres.
- Alcance de archivos: `src/pages/index.astro`, `src/data/services.ts` (4 bloques `seo`), `src/data/niches.ts` (4 bloques `seo`). No se tocan páginas legales, blog, portfolio, contacto, recursos ni sobre-mí (ya correctas).
- Límites: title ≤ ~70 caracteres, description ≤ ~160 caracteres. No inventar claims no verificables (nada de reseñas, cifras de facturación ni años distintos a los ya usados en el sitio).
- TDD: enabled por instrucción de proyecto. Runner: `node --test tests/seo-meta-titles.test.js`. Delivery: ask-on-risk; forecast bajo 100 líneas autoría.

## Tasks
- [x] **SEO28-01** — Escribir test de regresión `tests/seo-meta-titles.test.js` (5 casos). Route: delegated writer. Acceptance: RED observado — 2/5 fallaban (home sin "Sevilla"; disenoWeb sin credencial de experiencia).
- [x] **SEO28-02** — Aplicar los nuevos title/description: home (añadir Sevilla, description 203→152 car.), 3 de 4 servicios con credencial "+10 años de experiencia" (desarrolloSoftware ya la tenía), 4 nichos con firma "Soy Nuria Romero y..." (la credencial de años no cabía en 160 car. junto al resto del mensaje). Ningún `seo.title` de servicio/nicho tocado (verificado por snapshot). Route: delegated writer. Acceptance: test 5/5 GREEN (verificado de nuevo por el orquestador), `npm run build` 0 errores, `git diff --check` limpio.

## Progress and evidence
- RED→GREEN observado por el agente escritor y reverificado por el orquestador ejecutando `node --test tests/seo-meta-titles.test.js` tras los cambios: 5 pass, 0 fail.
- Diff revisado línea a línea por el orquestador en `src/pages/index.astro`, `src/data/services.ts`, `src/data/niches.ts`: coincide con lo reportado, sin cambios en titles.
- Build (`npm run build`): exit 0, 24 páginas generadas.
- Árbol sin commitear a la espera de aprobación del usuario.

## Next step
Usuaria revisa el diff y decide si comitear en `feat/seo-28-meta-titles-descriptions`.
