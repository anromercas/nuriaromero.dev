# Feature: mover páginas de servicio de /servicios/&lt;slug&gt; a raíz /&lt;slug&gt;

## Objetivo
Reestructurar las URLs de las 4 páginas de servicio para que cuelguen directamente
de la raíz del sitio en vez de bajo `/servicios/`, según la arquitectura de
keywords transaccionales acordada con el usuario, sin perder el posicionamiento
que ya puedan tener las URLs actuales.

## Problema / por qué
Las URLs actuales (`/servicios/diseno-web-sevilla`, etc.) anidan bajo un
segmento que no aporta valor semántico ni de keyword. El usuario pidió que
cuelguen de raíz, igual que ya hacen las páginas de nicho
(`/web-para-restaurantes-sevilla`, etc.).

## Alcance
**Dentro de esta feature:**
- Mover las 4 páginas de servicio existentes a raíz.
- Redirects 301 de las URLs antiguas a las nuevas.
- Eliminar el índice `/servicios/` y su link de menú, con redirect 301 a `/`.
- Actualizar todas las referencias internas rotas (nav, blog, llms.txt, docs).

**Fuera de esta feature (se planea aparte):**
- Creación de la nueva página `/tienda-online-sevilla` (contenido nuevo,
  no es una restructuración — es una feature de contenido distinta).
- Reenvío de la nueva estructura a Search Console (tarea operativa post-deploy,
  se hace una vez el cambio esté en producción, no bloquea el cierre de esta
  feature pero queda anotada en "próximo paso").

## Decisiones de arquitectura (ya resueltas)
1. **Mecanismo de redirects**: `public/_redirects` (formato Netlify), no la
   opción `redirects` de `astro.config.mjs` — en build estático Astro sirve
   esos redirects como meta-refresh/HTML, no como 301 real; `_redirects` de
   Netlify sí es un 301 real a nivel de servidor, que es lo que necesitamos
   para no perder señal SEO.
2. **Índice `/servicios/`**: se elimina. Redirect 301 a `/`. El botón
   "Servicios" del menú deja de ser un link y pasa a ser solo el disparador
   del dropdown (decisión confirmada por el usuario).

## Restricciones
- No se puede perder el posicionamiento de las URLs indexadas → todo redirect
  debe ser 301, nunca 302 ni meta-refresh.
- `ServiceLayout.astro` usa `page.slug` para breadcrumbs, canonical y JSON-LD:
  basta con que el string `slug` en `services.ts` coincida exactamente con la
  ruta del archivo `.astro` movido; no requiere cambios en `ServiceLayout.astro`.
- El sitemap (`@astrojs/sitemap`) se autogenera desde las páginas construidas:
  no requiere tocar `astro.config.mjs`.

## TDD
No aplica en el sentido estricto (RED/GREEN/REFACTOR): es una restructuración
de rutas estáticas y config, no lógica de negocio testeable. No existe test
runner de rutas en el repo (`tests/analytics-consent.test.js` es el único test
y no toca rutas). Verificación funcional en su lugar: build limpio, sitemap
correcto, redirects correctos, cero enlaces internos rotos a `/servicios/`.

## Checklist de tareas

- [x] **T1 — Redirects 301**: creado `public/_redirects` con 6 reglas (4
  servicios + `/servicios/` + `/servicios` sin barra) apuntando a las
  nuevas rutas de raíz / a `/`.
  Ruta: inline. Check: contenido revisado a mano, sintaxis Netlify válida.

- [x] **T2 — Mover páginas + actualizar slugs**: movidos los 4 `.astro` a
  `src/pages/`, actualizados los 4 `slug:` en `services.ts`, eliminado
  `src/pages/servicios/index.astro` y la carpeta (quedó vacía).
  Ruta: delegada (subagente `ae9021cde7bae2f23`).
  Check: `pnpm build` sin errores; `dist/sitemap-0.xml` contiene las 4 URLs
  nuevas y ninguna `/servicios/*` (verificado con grep).

- [x] **T3 — Nav del Header**: el item "Servicios" pasó de `<a href="/servicios/">`
  a `<button type="button">` (desktop) y `<span>` (móvil), sin navegación,
  solo dispara el dropdown/acordeón existente. Añadido `isServiciosActive`
  (basado en `dropdownItems`) para que siga resaltando como activo en
  páginas de servicio, ya que la comparación contra `/servicios/` dejó de
  tener sentido. `isActive()` ahora acepta `string | null`.
  Ruta: inline.
  Check: `pnpm build` (astro check incluido) sin errores. Revisión visual
  del dropdown queda para el pase de Playwright al final de toda la feature.

- [x] **T4 — Enlaces del blog**: actualizados los 2 enlaces. Los 2 archivos
  tenían cambios pendientes previos y no relacionados (correcciones de
  claims de otra tarea) — se hizo `git stash push` solo de esos 2 archivos,
  se aplicó el cambio de enlace sobre la base limpia, y se hará `git stash
  pop` después de este commit para no mezclar ambos trabajos en el mismo
  commit.
  Ruta: inline. Check: grep de `/servicios/` sobre ambos archivos → 0.

- [x] **T5 — `public/llms.txt`**: actualizadas las 4 URLs de servicios y
  eliminada la entrada "Todos los servicios" (apuntaba al índice ya
  eliminado).
  Ruta: inline. Check: grep de `/servicios` sobre el archivo → 0.

- [x] **T6 — Documentación de auditoría**: NO se reescribieron las menciones
  a `/servicios/` en `technical-follow-up.md` — son registros de auditoría
  fechados (2026-09-18/19), factualmente correctos para esa fecha;
  reescribirlos falsificaría el historial. En su lugar se añadió una nota
  fechada al principio del archivo explicando la migración y remitiendo a
  `odd/tasks/servicios-a-raiz.md`.
  Ruta: inline. Check: revisión manual.

- [x] **T7 — Verificación final end-to-end**: `pnpm build` limpio (20
  páginas, incluye `astro check`); `dist/sitemap-0.xml` solo tiene las 4
  URLs nuevas; grep global de `/servicios` sobre `src/` y `public/` solo
  devuelve `public/_redirects` (esperado) y un comentario no funcional en
  `src/pages/index.astro:24`. Revisión visual en navegador (dropdown,
  páginas cargando) queda para el pase de Playwright conjunto al final de
  toda la feature (servicios-a-raiz + jerarquia-diseno-web-sevilla), según
  pidió el usuario.
  Ruta: inline. Check: salidas de `pnpm build` y `grep` verificadas arriba.

## Próximo paso tras el despliegue (fuera del checklist de código)
Una vez en producción: enviar el sitemap actualizado en Search Console y
vigilar la cobertura de las 5 URLs antiguas (deben pasar a "Página con
redirección", no a error 404) durante las semanas siguientes.

## Estado
**Completo (T1-T7).** Ejecutado en un solo commit de trabajo en `develop`
(ver historial de git — mensaje `feat(seo): mover páginas de servicio a
raíz`). Verificación visual en navegador pendiente del pase de Playwright
conjunto al final de la feature `jerarquia-diseno-web-sevilla`, antes de
avisar al usuario para su propia revisión.
