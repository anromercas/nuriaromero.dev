# Excluir `/components/` del build público
- **ID:** SEO-03
- **Prioridad:** P1
- **Estado:** completado
- **Fuente:** [technical.md](../findings/technical.md), resumen de severidad; [sitemap.md](../findings/sitemap.md), secciones 2 y 6
- **Scope:** Ruta `/components/` y cualquier mecanismo de exclusión de páginas demo del build/publicación.

## Problema
`/components/` seguía publicado con 200 aunque llevaba `noindex`. El sitemap ya lo excluía, por lo que existía una diferencia entre higiene de publicación y señal de indexación.

## Objetivo
**Riesgo operativo:** Mantener una ruta interna pública aumenta superficie indexable y confunde el inventario de producción.

Evitar que la galería o ruta interna `/components/` se publique en producción, manteniendo la exclusión del sitemap y sin romper los componentes compartidos usados por rutas públicas.

## Decisión aplicada
Se eligió la opción mínima y segura: se eliminó únicamente `src/pages/components.astro`, la página demo autónoma que generaba `/components/`.

La galería queda eliminada y no está disponible tampoco durante el desarrollo: no se encontró un uso real de esa ruta que justificara mantener una vía local o de previsualización. Los componentes compartidos no se tocaron y siguen disponibles para las páginas públicas que los importan.

`astro.config.mjs` no se modificó. Su filtro existente de sitemap (`!page.includes('/components')`) se conserva sin cambios como defensa adicional, aunque ya no hay una página `/components/` que generar.

## Criterios de aceptación
- [x] En el build de producción actual, `dist/components/index.html` no existe; por tanto, `/components/` no se emite como ruta estática pública.
- [x] `/components/` no aparece en los sitemap generados (`dist/sitemap-0.xml` y `dist/sitemap-index.xml`).
- [x] La página demo autónoma se eliminó sin modificar componentes compartidos ni sus importaciones en rutas públicas.
- [x] La galería no dispone de vía local/previsualización por decisión explícita y ausencia de uso real de la ruta.

## Evidencia observada
- `npm run build` finalizó correctamente: `astro check` informó `0 errors`, `0 warnings` y `1 hint` preexistente en `src/components/seo/Schema.astro`; Astro construyó `22 page(s)`.
- Tras ese build nuevo, el listado de `dist/**/*.html` contiene 22 rutas y no incluye `/components/`; `dist/components/index.html` está ausente.
- Tras ese build nuevo, la búsqueda de `<loc>.../components/</loc>` en `dist/sitemap*.xml` no devolvió coincidencias. Los sitemaps observados son `sitemap-0.xml` y `sitemap-index.xml`.
- No se hizo una comprobación remota con `curl`: esta tarea verifica el artefacto de producción local y no incluye despliegue.

## No hacer
No convertir `noindex` en sustituto de una decisión de publicación, no bloquear componentes reutilizados y no tocar robots.txt para ocultar una ruta que ya no deba existir.
