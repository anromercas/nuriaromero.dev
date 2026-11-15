# nuriaromero.dev

Portfolio y web de servicios SEO local de Nuria Romero (nuriaromero.dev). Sitio estático con Astro 4, Tailwind 3 y TypeScript. El contenido y el copy del sitio están en español.

## Comandos (pnpm)

- Arrancar: `pnpm dev`
- Build (incluye typecheck): `pnpm build` (`astro check && astro build`)
- Typecheck solo: `pnpm astro check`
- Tests: `node --test tests/*.test.js`
- Checks SEO: `pnpm check:seo-NN` (construyen antes con `pnpm build`), o `pnpm check:seo-NN:dist` si ya existe `dist/`
- Formateo: `pnpm format <ficheros>` (Prettier + prettier-plugin-astro). No formatear el repo entero de golpe: solo los ficheros que se editan.
- Lint: no hay configurado; el typecheck lo cubre `astro check`.

## Arquitectura

- `src/components`, `src/layouts`, `src/pages`, `src/content`, `src/data`, `src/lib`.
- `odd/tasks/<feature>.md`: documentos de tareas por feature. Son la fuente de verdad del trabajo en curso.
- `DESIGN.md` y `PRODUCT.md`: dirección de diseño y de producto.
- `scripts/check-seo-*.mjs`: validaciones SEO sobre el build en `dist/`.

## Proceso

- Ramas: `feat/*` desde `develop`. `develop` se fusiona en `main` para publicar.
- Commits: conventional commits. Sin `Co-Authored-By` ni atribución de IA.
- Los cambios de comportamiento van con su test en `tests/`.

## Prohibiciones

- Sin restricciones de ficheros por ahora.
