# Normalizar enlaces internos y URLs estructuradas
- **ID:** SEO-02
- **Prioridad:** P0
- **Estado:** pendiente
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
- Una búsqueda de los ocho servicios/nichos no encuentra enlaces internos afectados sin barra final.
- No se modifican URLs externas ni enlaces que no pertenezcan a este hallazgo.
- Las páginas siguen resolviendo 200 en sus URLs canónicas.

## Dependencias y decisiones abiertas
Coordinar con SEO-01 y confirmar que Astro mantiene `trailingSlash: directory` o equivalente. Decidir si se normaliza en los datos fuente (`services.ts`/`niches.ts`) o mediante una función única de URL; no asumir una estrategia sin revisar el patrón actual.

## Checks sugeridos
- Búsqueda global de hrefs, slugs y URLs de breadcrumb sin `/` final.
- `curl` directo a una muestra de páginas y comprobación de ausencia de 301 en enlaces canónicos.
- Inspección del JSON-LD generado y validación sintáctica.

## No hacer
No hacer reemplazos globales sobre URLs externas, no cambiar la política de trailing slash del sitio completo y no duplicar helpers de URL sin necesidad.
