# Eliminar selector de tema: dejar el sitio solo en dark mode

## Objective
Completar la retirada del light mode: eliminar todo el código relacionado con el
selector de tema (Dark/Light/System) ahora que la web solo se sirve en dark.

## Status
Backlog. No autorizado para implementar todavía — solo tracking para más adelante.

## Contexto (ya hecho, 2026-09-25)
- `src/layouts/Layout.astro`: `<html class="dark">` fijo y `color-scheme: dark`
  (antes `light dark`). El dark mode ya no depende de JS ni de
  `prefers-color-scheme`.
- `src/components/Header.astro`: quitado el botón `<ThemeToggle />` y su import.
  El usuario ya no puede cambiar de tema.
- `src/components/ThemeToggle.astro` y `src/scripts/theme-toggle.js` **siguen
  existiendo pero quedaron huérfanos** (nada los importa ni renderiza) —
  pendientes de borrar en esta tarea.

## Scope de esta tarea (pendiente)
- [ ] Borrar `src/components/ThemeToggle.astro` y `src/scripts/theme-toggle.js`.
- [ ] Quitar `darkMode: 'class'` de `tailwind.config.mjs` una vez no quede
      ningún uso de la variante `dark:`.
- [ ] Barrido completo del codebase: quitar todas las clases `dark:*` de
      Tailwind (cientos, repartidas en casi todos los `.astro`) y dejar solo
      el valor que hoy se ve en dark. Esto es un cambio grande, tocar por
      lotes/componente, no en un solo commit.
- [ ] `src/layouts/Layout.astro`: quitar el bloque
      `@media (prefers-color-scheme: dark) { body { color: ... } }` (ya
      redundante, Tailwind gana por especificidad, pero es ruido muerto).
- [ ] `src/components/Header.astro`: simplificar el logo — hoy sigue
      renderizando `logoDark`/`logoLight` con `dark:hidden`/`hidden dark:block`;
      con dark fijo solo se ve `logoLight`, se puede dejar un único `<Image>`.
- [ ] Revisar si el toggle de tema aparece en tests (`tests/*.test.js`) o en
      snapshots/checkers de `scripts/check-seo-*.mjs` y actualizar si lo
      referencian.

## Bug preexistente encontrado de paso (no arreglado, anotar para esta tarea)
`src/layouts/Layout.astro`, `#header-nav`/`@keyframes blur`: la animación de
blur del nav depende de `@media (prefers-color-scheme: dark)` (preferencia del
SO), no de la clase `.dark` del sitio. Ya estaba desacoplada del selector de
tema de la app antes de este cambio — un visitante con el SO en modo claro
seguía viendo el nav en estilo "claro" aunque el sitio se mostrara en dark.
Con el sitio fijo en dark, conviene quitar ese `@media` y dejar directamente
los valores dark del `@keyframes blur`.

## Verificación al cerrar esta tarea
- `npx astro check` sin errores.
- Grep de `dark:` en `src/**/*.astro` debe devolver 0 resultados.
- Revisión visual de las páginas principales tras el barrido (home, páginas de
  servicio, contacto) para confirmar que ningún componente quedó con colores
  pensados solo para el contraste del modo claro.
