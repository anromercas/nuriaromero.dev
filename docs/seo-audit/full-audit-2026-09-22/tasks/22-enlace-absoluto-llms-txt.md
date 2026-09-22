# Enlace absoluto en FAQ de nicho y cobertura completa de llms.txt
- **ID:** SEO-22
- **Prioridad:** Medium
- **Estado:** resuelto (2026-09-22)
- **Fuente:** [geo.md](../findings/geo.md), hallazgos 2 y 3
- **Scope:** `src/data/niches.ts` (texto de FAQ), `public/llms.txt`

## Problema
Dos hallazgos de citabilidad GEO, ambos persistentes desde el 2026-09-21, ambos de esfuerzo bajo:

1. **Enlace relativo no citable (Media, sin corregir):** en las 4 páginas de nicho, la FAQ contiene el texto plano *"...tengo un servicio aparte de SEO local que puedes consultar en **/seo-local-sevilla**."* — una ruta relativa sin `https://nuriaromero.dev` incrustada como texto de respuesta. El `href` de navegación real es correcto; el problema es que si un LLM extrae esa frase como cita textual autocontenida, la URL no es resoluble fuera del sitio.
2. **`llms.txt` incompleto (Media, sin corregir):** la sección "Contenido editorial" enlaza individualmente solo 1 de los 4 posts de blog (`que-es-geo-posicionamiento-ia-negocios-sevilla`). Los otros 3 (`como-aparecer-en-google-maps-negocio-sevilla`, `cuanto-cuesta-una-pagina-web-en-sevilla`, `pagina-web-para-restaurantes-que-necesita`) solo son alcanzables vía el índice `/blog/`, un nivel de indirección más lejos para un asistente que prioriza lo listado explícitamente.

## Impacto
Alto impacto relativo a su coste (ambos identificados como las dos recomendaciones de mayor impacto en `geo.md`), esfuerzo bajo.

## Objetivo
1. Sustituir `/seo-local-sevilla` por `https://nuriaromero.dev/seo-local-sevilla` en el texto de las 4 respuestas de FAQ (cambio de contenido puro, no toca el `href` de navegación existente).
2. Añadir los 3 posts restantes a la sección "Contenido editorial" de `llms.txt`, mismo formato que el post ya incluido (URL absoluta + descripción de una frase).

## Criterios de aceptación
- Las 4 FAQ de nicho citan la URL completa `https://nuriaromero.dev/seo-local-sevilla/` en el texto de la respuesta.
- `llms.txt` enlaza individualmente los 4 posts de blog con URL absoluta.
- `npm run check:seo-09` sigue en verde (valida `llms.txt` como índice curado).

## Checks sugeridos
```bash
curl https://nuriaromero.dev/llms.txt
npm run check:seo-09
```

## No hacer
No cambiar el `href` de navegación existente (ya es correcto). No añadir a `llms.txt` ningún enlace no público o no verificado.

## Resolución (2026-09-22)

**Discrepancia frente al texto citado en "Problema":** este documento se escribió sobre el texto original del audit 2026-09-21. Antes de implementar, SEO-18 (misma sesión, tarea anterior) ya había reescrito el cierre de esta misma FAQ en las 4 páginas de nicho, cambiando por completo la redacción citada arriba (*"...tengo un servicio aparte de SEO local que puedes consultar en /seo-local-sevilla."*), que ya no existía en `src/data/niches.ts`. Se releyó el estado real del archivo en vez de asumir la cita: el texto vigente (ej. restaurantes) era *"...en /seo-local-sevilla/ cuento cómo llevo ese seguimiento para restaurantes y bares."* — SEO-18 ya había añadido la barra final, pero el hueco de citabilidad seguía presente en una forma nueva: seguía siendo una ruta relativa sin dominio en texto plano (sin `<a href>`, confirmado leyendo `src/components/services/FAQ.astro`, que interpola el texto sin parseo de markdown/enlaces). También se confirmó que la premisa "no toques el `href`, ya es correcto" no aplicaba a esta mención concreta: no hay ningún `href` ahí, es texto plano.

**Cambio aplicado:** se sustituyó `/seo-local-sevilla/` por `https://nuriaromero.dev/seo-local-sevilla/` en el texto visible de las 4 respuestas de FAQ, sin tocar el resto de la redacción de SEO-18.

**llms.txt:** se añadieron los 3 posts restantes a "Contenido editorial" con URL absoluta y descripción de una frase basada en el frontmatter real de cada post (`src/content/blog/*.md`), orden cronológico por `pubDate`.

**Verificación:** `npm run build` + `check:seo-09` en verde; sweep completo `check:seo-02`–`check:seo-14` (11 checks) en verde sobre `dist` fresco; `git diff --check` limpio; `dist/llms.txt` y las 4 páginas de nicho renderizadas confirmadas manualmente. Detalle completo en `odd/tasks/seo-audit-backlog-2026-09-22.md`, entrada SEO-22.
