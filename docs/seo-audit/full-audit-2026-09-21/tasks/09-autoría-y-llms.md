# Reforzar autoría visible y `llms.txt`
- **ID:** SEO-09
- **Prioridad:** P2
- **Estado:** parcial
- **Fuente:** [content.md](../findings/content.md), hallazgo 5; [geo.md](../findings/geo.md), secciones 1, 3 y 4
- **Scope:** Byline/fecha del post GEO y mejora del archivo `llms.txt`, con señales de entidad y enlaces de autoría que puedan verificarse.

## Problema
El post no muestra byline/fecha visible y `llms.txt` puede ser más útil como índice curado. Las señales de marca son correctas en parte, pero `sameAs` y la autoría visible son limitadas.

## Objetivo
**Riesgo operativo:** Añadir señales no verificadas dañaría la confianza; no actuar deja autoría y actualización poco visibles.

Hacer explícita la autoría y actualización editorial, y convertir `llms.txt` en una guía mantenible de páginas y entidades relevantes sin prometer tratamiento especial por crawlers.

## Criterios de aceptación
- El post muestra autora y fecha de publicación/actualización con formato consistente.
- La autora enlaza a una página de perfil relevante y esa página enlaza de vuelta cuando proceda.
- `llms.txt` existe, devuelve 200 y contiene enlaces absolutos a recursos públicos seleccionados.
- El archivo no incluye URLs privadas, efímeras o irrelevantes.
- La identidad de marca usada coincide con la decisión de SEO-11.

## Dependencias y decisiones abiertas
Decidir formato de fecha, política de actualización, nombre público de la marca y qué perfiles externos son oficiales. Verificar antes de añadir `sameAs` que los perfiles existan y representen a la misma entidad.

## Checks sugeridos
- `curl` del post y de `/llms.txt`.
- Revisión de HTML visible, JSON-LD de autor y enlaces absolutos.
- Validación de que todos los enlaces del archivo son 200 y canónicos.
- Diff editorial para evitar claims nuevos no aprobados.

## No hacer
No inventar fechas de actualización, perfiles sociales, credenciales o señales de entidad; no presentar `llms.txt` como requisito de indexación ni como garantía de citación.


## Implementación local (2026-09-21)

- El layout de artículos muestra la autora enlazada a `/sobre-mi/` y la fecha de publicación con `<time datetime>`. Si un post declara `updatedDate`, muestra también `Actualizado el`; no se añadió una fecha de actualización al post GEO porque no existía una fecha editorial verificada.
- La página `/sobre-mi/` enlaza de vuelta al blog, y el JSON-LD `Article` ya referencia la entidad `Person` del sitio mediante `author`.
- `public/llms.txt` se reorganizó como índice curado con enlaces absolutos, trailing slash en rutas internas, perfil, servicios, sectores, contenido editorial, perfiles externos ya declarados en la fuente de marca y sitemap. Incluye una limitación explícita: no garantiza indexación, posicionamiento, citación ni tratamiento especial por crawlers/asistentes.
- `npm run check:seo-09` ejecuta build + `scripts/check-seo-09.mjs` y valida autoría visible, fecha/Article schema, enlaces absolutos permitidos y ausencia de URLs efímeras/privadas. Resultado local: 22 páginas generadas, 0 errores, 0 warnings, 1 hint preexistente en `Schema.astro`; checker OK con 18 enlaces de `llms.txt`.

## Pendiente

- Verificar en el entorno desplegado que `/llms.txt`, el post GEO y `/sobre-mi/` devuelven HTTP 200 y que los enlaces externos siguen siendo perfiles oficiales accesibles.
- La comprobación local no acredita tratamiento de ningún crawler, citación, indexación ni mejora de rankings.
