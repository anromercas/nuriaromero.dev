# Puentes de navegación entre páginas comerciales adyacentes
- **ID:** SEO-21
- **Prioridad:** Medium
- **Estado:** resuelto (2026-09-22)
- **Fuente:** [sxo.md](../findings/sxo.md), Hallazgo Principal; [cluster.md](../findings/cluster.md), hallazgo 3
- **Scope:** `src/data/internal-links.ts`, `src/data/seo-intents.ts`, componentes de página de `/diseno-web-sevilla/`, `/web-para-comercios-sevilla/`, `/tienda-online-sevilla/` y las 4 páginas de nicho

## Problema
`seo-intents.ts` documenta con precisión qué intención posee cada URL y `check:seo-07` valida que no haya duplicación técnica, pero el avatar real (`.agents/product-marketing-context.md`, "no nativo digital") no verbaliza su necesidad en esos términos exactos. Un dueño de comercio que busca "página web para mi tienda en Sevilla" no distingue de antemano si necesita catálogo (`/web-para-comercios-sevilla/`), web general (`/diseno-web-sevilla/`) o checkout completo (`/tienda-online-sevilla/`).

El array `reciprocalLinks` de `seo-intents.ts` solo documenta 2 pares, ambos informacional→comercial (blog↔servicio). No existe ningún enlace recíproco documentado entre páginas comerciales adyacentes. Además, ni `/diseno-web-sevilla/` ni `/seo-local-sevilla/` enlazan hacia abajo a ninguna de las 4 páginas de nicho en `internal-links.ts` (solo hacia `tienda-online-sevilla`, el post de precio y contacto) — son alcanzables por nav/footer, pero el hub no las refuerza contextualmente dentro del contenido.

## Impacto
Medio: fricción de experiencia de búsqueda para un usuario que aterriza en la página "casi correcta" sin garantía editorial de encontrar ahí mismo un puente claro hacia la página que encaja con su necesidad real.

## Objetivo
1. Añadir a `/tienda-online-sevilla/` un puente explícito tipo "¿Solo necesitas mostrar tu catálogo sin cobrar online? Mira la web para comercios" → enlaza a `/web-para-comercios-sevilla/`, y el puente inverso en esa página hacia tienda online para quien sí necesita checkout.
2. En `/diseno-web-sevilla/`, reforzar el enlace a la página de nicho correspondiente más arriba en el documento (no solo en un bloque final de "también hacemos").
3. Añadir en `internal-links.ts` entradas de `/diseno-web-sevilla/` y `/seo-local-sevilla/` hacia las 4 páginas de nicho.

## Criterios de aceptación
- `/tienda-online-sevilla/` y `/web-para-comercios-sevilla/` tienen un puente de copy explícito y bidireccional, no solo un enlace en bloque final.
- `/diseno-web-sevilla/` y `/seo-local-sevilla/` tienen entradas hacia las 4 páginas de nicho en `internal-links.ts`.
- `npm run check:seo-06` y `npm run check:seo-07` siguen en verde.
- Ningún enlace nuevo apunta a rutas no publicadas.

## Checks sugeridos
```bash
npm run check:seo-06
npm run check:seo-07
```

## No hacer
No fusionar páginas ni cambiar su intención primaria documentada en `seo-intents.ts`. No declarar el problema de experiencia de búsqueda resuelto sin validación de consultas reales (pendiente de SEO-14/GSC).

## Evidencia de resolución (2026-09-22)
- **Puente tienda-online ↔ comercios (copy visible, no solo dato):** párrafo añadido en `src/pages/tienda-online-sevilla.astro` ("Si lo único que necesitas es mostrar tu catálogo y tus horarios, sin cobrar online todavía, seguramente te encaja mejor la web para comercios" → `/web-para-comercios-sevilla/`) y nuevo bloque `before-benefits` en `src/pages/web-para-comercios-sevilla.astro` (antes sin contenido propio) con el puente inverso hacia `/tienda-online-sevilla/`. Reforzado con una nueva entrada en `reciprocalLinks` (`src/data/seo-intents.ts`), validada por `check:seo-07`.
- **`/diseno-web-sevilla/` — enlace a nicho más arriba:** lista de 4 píldoras a las páginas de nicho añadida dentro del bloque `before-benefits` (justo debajo del hero, antes de Beneficios/Proceso/Precio), reutilizando el patrón ya existente en la home.
- **`internal-links.ts`:** `/diseno-web-sevilla/` y `/seo-local-sevilla/` ahora incluyen las 4 rutas de nicho cada una.
- **Checks:** `check:seo-06` y `check:seo-07` en verde; sweep completo `check:seo-02`–`check:seo-14` en verde sobre `dist` fresco; `git diff --check` limpio. Enlaces verificados en `dist/**/*.html` con slash final, apuntando a rutas reales publicadas.
- Detalle completo en `odd/tasks/seo-audit-backlog-2026-09-22.md`, entrada "SEO-21".
