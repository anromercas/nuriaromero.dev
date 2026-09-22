# Normalizar barra final en Header y Footer
- **ID:** SEO-15
- **Prioridad:** Medium
- **Estado:** hecho (2026-09-22)
- **Fuente:** [technical.md](../findings/technical.md), hallazgo TECH-01
- **Scope:** `src/components/Header.astro`, `src/components/Footer.astro`, `scripts/check-seo-02.mjs`

## Problema
SEO-02 (auditoría 2026-09-21) normalizó los enlaces bare en las cinco fuentes de blog y en las 10 páginas canónicas de servicio/nicho, pero no alcanzó los componentes de navegación global. `Header.astro` (líneas ~21-37) y `Footer.astro` (líneas 104-119) siguen enlazando 7 rutas sin barra final: `/portfolio`, `/blog`, `/sobre-mi`, `/contacto`, `/aviso-legal`, `/privacidad`, `/cookies`. Como ambos componentes se renderizan en las ~22 páginas del sitio, cada carga contiene 7 enlaces que fuerzan un salto 301 evitable en cada clic o rastreo.

Verificación HTTP en vivo confirma el salto real: `/portfolio → 301 → /portfolio/`, `/blog → 301 → /blog/`, `/sobre-mi → 301 → /sobre-mi/`, `/contacto → 301 → /contacto/`.

## Impacto
Medio: no bloquea indexación ni rastreo, pero desperdicia presupuesto de rastreo de forma repetida en cada página y contradice parcialmente el objetivo de SEO-02.

## Objetivo
Añadir la barra final a los 7 `href`/`url` en `Header.astro` y `Footer.astro`, alineándolos con la política de trailing slash ya aplicada al resto del sitio.

## Criterios de aceptación
- Los 7 enlaces de Header/Footer usan `/` final.
- `scripts/check-seo-02.mjs` amplía su alcance para cubrir estos dos componentes compartidos (actualmente solo cubre las 10 rutas canónicas y las fuentes de blog).
- Verificación HTTP en vivo (`curl -sSIL --max-redirs 0`) confirma `200` directo sin `Location` en las 7 rutas.
- No se modifican URLs externas ni otros enlaces.

## Checks sugeridos
```bash
npm run check:seo-02
curl -sSIL --max-redirs 0 https://nuriaromero.dev/portfolio/
curl -sSIL --max-redirs 0 https://nuriaromero.dev/blog/
curl -sSIL --max-redirs 0 https://nuriaromero.dev/sobre-mi/
curl -sSIL --max-redirs 0 https://nuriaromero.dev/contacto/
```

## No hacer
No cambiar la política de trailing slash del sitio completo, no tocar enlaces externos ni el `href` de rutas ya normalizadas.

## Evidencia de cierre (2026-09-22)
- **RED:** se amplió `scripts/check-seo-02.mjs` con la lista `sharedNavPages` (7 rutas) y una comprobación por archivo sobre las secciones `<header>`/`<footer>` renderizadas. Con `Header.astro`/`Footer.astro` sin corregir, `npm run check:seo-02` falló con decenas de errores `shared nav/footer href omits trailing slash (...)` en las 22 páginas del sitio, confirmando el hueco.
- **Fix:** se añadió `/` final a los 7 `href`/`url` (`/portfolio/`, `/blog/`, `/sobre-mi/`, `/contacto/`, `/aviso-legal/`, `/privacidad/`, `/cookies/`) en `Header.astro` (array `navItems`) y `Footer.astro` (nav inferior y enlaces legales).
- **GREEN:** `npm run check:seo-02` → `SEO-02 check passed: scanned 23 HTML files; 10 canonical service/niche pages use trailing-slash internal links, breadcrumbs, schemas, and canonicals.` (incluye la comprobación ampliada, sin fallos).
- **Verificación HTTP local** (`BROWSER=none netlify dev --offline --no-open --dir dist --port 8888`, `curl -sSIL --max-redirs 0`): `/portfolio/`, `/blog/`, `/sobre-mi/`, `/contacto/`, `/aviso-legal/`, `/privacidad/`, `/cookies/` → `200 OK` directo, sin cabecera `Location`, sin salto 301.
- **Regresión:** las 11 comprobaciones `check:seo-02` a `check:seo-14` pasan sobre el mismo `dist` sin fallos. `git diff --check` sin errores.
