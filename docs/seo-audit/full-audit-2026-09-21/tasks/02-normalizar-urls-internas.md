# Normalizar enlaces internos y URLs estructuradas
- **ID:** SEO-02
- **Prioridad:** P0
- **Estado:** verificada en verde
- **Fuente:** [technical.md](../findings/technical.md), secciones 3, 3.1 y 3.2
- **Scope:** Slugs y enlaces internos de servicios/nichos, breadcrumbs y `BreadcrumbList` afectados por la ausencia de trailing slash.

## Problema
Navegación, tarjetas y breadcrumbs apuntan a páginas de servicio/nicho sin trailing slash, provocando un 301 en cada clic. El mismo desajuste aparece en la URL de segundo nivel del JSON-LD `BreadcrumbList`. La causa raíz señalada es que los slugs de origen no incluyen la barra final.

## Objetivo
**Riesgo operativo:** Mantener enlaces sin barra final introduce redirects internos repetidos y señales inconsistentes.

Alinear los slugs y todas sus representaciones internas con la URL canónica con trailing slash, evitando redirects al navegar y contradicciones entre HTML, canonical y schema.

## Criterios de aceptación
- Los enlaces internos afectados de header, footer, home y layouts apuntan directamente a URLs con `/` final.
- Los breadcrumbs visibles y sus `item`/`@id` en `BreadcrumbList` usan la misma URL canónica.
- El checker recorre recursivamente todo `dist/**/*.html` y no encuentra `href`, breadcrumb visible ni URL de schema sin barra final para ninguno de los diez servicios/nichos.
- No se modifican URLs externas ni enlaces que no pertenezcan a este hallazgo.
- Las páginas siguen resolviendo 200 en sus URLs canónicas.

## Evidencia
- **RED:** en una copia temporal de `dist/diseno-web-sevilla/index.html`, sustituir un `href="/diseno-web-sevilla/"` por `href="/diseno-web-sevilla"` hace fallar `node scripts/check-seo-02.mjs` con salida `1`; se restaura y elimina la copia temporal.
- **Build fresco y checker:** `npm run check:seo-02`. Este comando ejecuta una sola vez el `build` existente (`astro check && astro build`) y, al terminar, ejecuta directamente `node scripts/check-seo-02.mjs`; no vuelve a invocar npm ni se recursa.
- **Alcance del checker:** recorre recursivamente todo `dist/**/*.html` y detecta, para las diez rutas objetivo, `href`, breadcrumbs visibles y valores URL en JSON-LD sin `/` final. Conserva las aserciones por ruta para canonical, `BreadcrumbList` y breadcrumbs visibles.
- **Resultado GREEN:** tras normalizar los cinco enlaces bare reales de las fuentes de blog autorizadas, `npm run check:seo-02` termina con salida `0`: build fresco con 0 errores, 0 warnings y 1 hint preexistente; el checker recorre los 23 archivos de `dist/**/*.html` y confirma que las 10 páginas canónicas de servicio/nicho usan trailing slash en enlaces internos, breadcrumbs, schema y canonicals.
- **Evidencia pública (2026-09-21):** se ejecutó `curl -sSIL --max-redirs 0` contra las diez URLs canónicas. Las diez respuestas fueron exactamente `HTTP/2 200` y ninguna incluyó cabecera `Location` (por tanto, no hubo redirect):

```text
https://nuriaromero.dev/diseno-web-sevilla/                         HTTP/2 200
https://nuriaromero.dev/desarrollo-software-medida/                HTTP/2 200
https://nuriaromero.dev/automatizaciones/                          HTTP/2 200
https://nuriaromero.dev/inteligencia-artificial/                   HTTP/2 200
https://nuriaromero.dev/seo-local-sevilla/                         HTTP/2 200
https://nuriaromero.dev/tienda-online-sevilla/                     HTTP/2 200
https://nuriaromero.dev/web-para-restaurantes-sevilla/             HTTP/2 200
https://nuriaromero.dev/web-para-clinicas-sevilla/                 HTTP/2 200
https://nuriaromero.dev/web-para-comercios-sevilla/                HTTP/2 200
https://nuriaromero.dev/web-para-abogados-gestorias-sevilla/       HTTP/2 200
```
- **Integridad:** `git diff --check`.

```bash
npm run check:seo-02
git diff --check
```

## Dependencias y decisiones abiertas
Coordinar con SEO-01 y confirmar que Astro mantiene `trailingSlash: directory` o equivalente. Decidir si se normaliza en los datos fuente (`services.ts`/`niches.ts`) o mediante una función única de URL; no asumir una estrategia sin revisar el patrón actual.

## Checks sugeridos
- Búsqueda global de hrefs, slugs y URLs de breadcrumb sin `/` final.
- `curl` directo a una muestra de páginas y comprobación de ausencia de 301 en enlaces canónicos.
- Inspección del JSON-LD generado y validación sintáctica.

## No hacer
No hacer reemplazos globales sobre URLs externas, no cambiar la política de trailing slash del sitio completo y no duplicar helpers de URL sin necesidad.
