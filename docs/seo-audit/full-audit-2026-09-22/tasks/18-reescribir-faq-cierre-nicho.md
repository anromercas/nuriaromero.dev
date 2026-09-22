# Reescribir el cierre de FAQ plantillado en las 4 páginas de nicho
- **ID:** SEO-18
- **Prioridad:** High (coste bajo, impacto alto)
- **Estado:** resuelto (2026-09-22)
- **Fuente:** [content.md](../findings/content.md), hallazgo 1
- **Scope:** `src/data/niches.ts` — FAQ "¿Cómo consigo que aparezca mi negocio cuando alguien busca cerca de mí/su casa?" en las 4 páginas de nicho

## Problema
**Este es el mismo hallazgo detectado en la auditoría del 2026-09-21, sin ningún cambio de redacción en producción a 2026-09-22.** El cierre de la FAQ es, verbatim, el mismo texto con solo el verbo negado variando:

- Restaurantes: *"No es obligatorio contratarlo para tener una web bien optimizada: es una opción para quien quiere ir un paso más allá."*
- Clínicas: *"No hace falta contratarlo para tener una web bien planteada: es una opción para quien quiere ir sumando visibilidad mes a mes."*
- Comercios: *"No es imprescindible contratarlo para tener una web bien optimizada: es una opción para quien quiere seguir ganando visibilidad mes a mes."*
- Abogados/gestorías: *"No es necesario contratarlo para tener una web bien planteada: es una opción para quien quiere sumar visibilidad de forma continuada."*

**Nota de higiene de seguimiento:** el backlog anterior marca SEO-05 y SEO-07 como "parcial" con evidencia real de checkers deterministas en verde (`check-seo-05.mjs`, `check-seo-07.mjs`). Esos checkers validan estructura, claims prohibidos y similitud agregada por n-gramas — no la variación semántica de esta frase concreta, que es exactamente el problema original. El checker no está mal diseñado; el punto de atención es de proceso: un hallazgo textual citado literalmente debería cerrarse verificando que ese texto cambió, no solo que un checker estructural pase.

## Impacto
Alto en relación a su coste: patrón "repetitive structure across pages" (percepción de calidad de sitio) y dilución moderada de `/seo-local-sevilla/`, creada explícitamente como cabeza de clúster para esta keyword.

## Objetivo
Recortar y diversificar genuinamente el cierre de esta FAQ en las 4 páginas, manteniendo los 3 factores reales (ficha GBP completa → datos estructurados → reseñas recientes) pero sin la reafirmación plantillada "no es obligatorio/imprescindible/necesario... opción para ir sumando visibilidad" repetida con sinónimos.

## Criterios de aceptación
- Las 4 variantes dejan de compartir la misma estructura de frase con solo el verbo cambiado (verificable por comparación textual directa, no solo por similitud de n-gramas agregada).
- Cada cierre incluye un enlace con anchor específico del sector (no genérico) hacia `/seo-local-sevilla/`.
- Respuesta recortada a 2-3 frases: los 3 factores + 1 frase de enlace.
- Sin nuevos claims, cifras, casos o testimonios (restricción de `.agents/product-marketing-context.md`).
- `npm run check:seo-05` y `npm run check:seo-07` (o equivalente) siguen en verde tras el cambio.

## Checks sugeridos
- Comparación textual directa (no solo n-gramas) de las 4 respuestas antes/después.
- `npm run check:seo-05`, `npm run check:seo-07`.

## No hacer
No añadir cifras, casos de éxito ni promesas de resultado. No cambiar los 3 factores reales enumerados (GBP, datos estructurados, reseñas), solo la redacción de cierre.

## Evidencia de resolución (2026-09-22)
Cambio aplicado en `src/data/niches.ts` (líneas de la FAQ "¿Cómo consigo que aparezca mi negocio...?" en cada uno de los 4 nichos). La frase de los 3 factores se mantuvo sin cambios de sustancia; solo se reescribió y recortó lo que venía después, de 3 frases redundantes a 1 frase de cierre con enlace, con esqueleto gramatical distinto en cada nicho:

- Restaurantes — antes: *"No es obligatorio contratarlo para tener una web bien optimizada: es una opción para quien quiere ir un paso más allá."* → después: *"Esa base ya viene incluida en la web que te entrego. Si el mes que viene prefieres no acordarte tú de revisarlo, en /seo-local-sevilla/ cuento cómo llevo ese seguimiento para restaurantes y bares."*
- Clínicas — antes: *"No hace falta contratarlo para tener una web bien planteada: es una opción para quien quiere ir sumando visibilidad mes a mes."* → después: *"La web que te entrego ya nace con esa base montada. Para las clínicas que buscan no depender de acordarse cada mes, en /seo-local-sevilla/ explico el seguimiento de SEO local que hago para consultas."*
- Comercios — antes: *"No es imprescindible contratarlo para tener una web bien optimizada: es una opción para quien quiere seguir ganando visibilidad mes a mes."* → después: *"Ya incluyo esa base en tu web desde el lanzamiento. Quien prefiera no estar pendiente de revisarlo mes a mes encuentra en /seo-local-sevilla/ cómo planteo ese seguimiento para comercios de barrio."*
- Abogados/gestorías — antes: *"No es necesario contratarlo para tener una web bien planteada: es una opción para quien quiere sumar visibilidad de forma continuada."* → después: *"En la web ya queda resuelta esa base desde el primer día. Los despachos que buscan un seguimiento constante, en lugar de revisarlo ellos mismos, encuentran en /seo-local-sevilla/ cómo planteo ese trabajo mensual para despachos y gestorías."*

Verificación: comparación textual directa de las 4 variantes (confirmado: 4 esqueletos de frase distintos, no plantilla con verbo cambiado). `npm run build` + `npm run check:seo-05` y `check:seo-07` en verde. Barrido `check:seo-02` a `check:seo-14` (todos los que existen en el repo) en verde sobre el mismo `dist`. `git diff --check` limpio. Sin cifras, casos ni garantías nuevas. Un commit en `develop`.
