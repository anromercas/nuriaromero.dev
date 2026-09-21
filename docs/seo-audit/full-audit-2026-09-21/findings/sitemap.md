# Auditoría de Sitemap — nuriaromero.dev

Fecha: 2026-09-21
Fuente: `https://nuriaromero.dev/sitemap-index.xml` + `sitemap-0.xml` (en vivo), `robots.txt` (en vivo), `astro.config.mjs`, `src/pages/`, `src/content/blog/` (repo local).

## Puntuación global: 90/100

Sitemap técnicamente correcto, sin páginas huérfanas ni bloqueadas, generado automáticamente y coherente con robots.txt. Los únicos puntos de mejora son informativos (namespaces sobrantes y ausencia deliberada de `lastmod` en páginas estáticas).

---

## 1. Validación XML

| Check | Resultado | Evidencia |
|---|---|---|
| `sitemap-index.xml` bien formado | ✅ PASS | `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` con una única entrada `<sitemap><loc>https://nuriaromero.dev/sitemap-0.xml</loc></sitemap>` |
| `sitemap-0.xml` bien formado | ✅ PASS | `<urlset xmlns="...sitemap/0.9" ...>` cierra correctamente, 22 `<url>` |
| Namespace principal correcto | ✅ PASS | `http://www.sitemaps.org/schemas/sitemap/0.9` |
| Namespaces adicionales sin uso (`news`, `xhtml`, `image`, `video`) | ℹ️ INFO | El `urlset` declara `xmlns:news`, `xmlns:xhtml`, `xmlns:image`, `xmlns:video` (salida por defecto de `@astrojs/sitemap`) pero ninguna URL usa esas etiquetas. No es un error — Google los ignora si no se usan — pero es peso XML innecesario. No requiere acción. |
| `priority` / `changefreq` | ✅ PASS (ausentes) | El sitemap no incluye ninguna de las dos etiquetas obsoletas. Correcto: Google las ignora desde 2020/2023 y `@astrojs/sitemap` no las genera por defecto. |
| Límite de 50.000 URLs / 50MB | ✅ PASS | 22 URLs, muy por debajo del límite. Un único archivo es más que suficiente. |

---

## 2. Estado HTTP y bloqueos (robots.txt / noindex)

Verificación en vivo de las 22 URLs del sitemap (`curl -I`, 2026-09-21):

| Resultado | Cantidad |
|---|---|
| 200 OK | 22 / 22 |
| Redirecciones (3xx) | 0 |
| Errores (4xx/5xx) | 0 |

- **robots.txt**: solo contiene reglas `Allow: /` para todos los user-agents (incluidos bots de IA). No hay ninguna regla `Disallow` que entre en conflicto con el sitemap. ✅ PASS
- **noindex**: se revisó `src/pages/*.astro` en busca de la prop `noindex`. Solo `src/pages/components.astro:13` la activa, y esa página **no está** en el sitemap (excluida explícitamente vía `filter: (page) => !page.includes('/components')` en `astro.config.mjs:49`). Ninguna de las 22 URLs del sitemap tiene `noindex`. ✅ PASS
- Todas las URLs del sitemap usan barra final consistente, coincidiendo con las URLs canónicas reales (sin duplicados con/sin slash). ✅ PASS

**Severidad: ninguna. Todos los checks de esta sección pasan.**

---

## 3. `lastmod`: cobertura y coherencia

| Página | `lastmod` en sitemap | Comentario |
|---|---|---|
| `/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/` | `2026-09-21` | ✅ Coincide con post nuevo (commit `054c138`, hoy) |
| `/blog/cuanto-cuesta-una-pagina-web-en-sevilla/` | `2026-07-07` | ✅ Fecha real de `pubDate`/`updatedDate` en frontmatter |
| `/blog/como-aparecer-en-google-maps-negocio-sevilla/` | `2026-07-01` | ✅ Fecha real de frontmatter |
| `/blog/pagina-web-para-restaurantes-que-necesita/` | `2026-06-24` | ✅ Fecha real de frontmatter |
| Resto de páginas (18 restantes: home, servicios, nicho, legal, blog index, portfolio, etc.) | **Sin `lastmod`** | Ver análisis abajo |

**Hallazgo (severidad: Baja / informativa):**

El `lastmod` **no está ausente por error**: es una decisión de diseño explícita en `astro.config.mjs:50-58`. La función `serialize()` solo añade `lastmod` a los posts del blog (leyendo `pubDate`/`updatedDate` del frontmatter real) y deja el resto de páginas sin la etiqueta, con un comentario explícito en el código:

```js
// Solo se añade `lastmod` cuando hay una fecha real del contenido
// (posts del blog). El resto de páginas estáticas se dejan sin
// `lastmod` en vez de rellenarlas con la fecha de build.
```

Esto es **mejor práctica que poner una fecha de build falsa** (que Google puede aprender a ignorar si detecta que siempre coincide con el deploy y no con cambios reales de contenido). Sin embargo, tiene un coste: páginas que **sí cambiaron recientemente y de forma sustancial** —las de nicho movidas de `/servicios/<slug>` a raíz (`diseno-web-sevilla`, `desarrollo-software-medida`, `automatizaciones`, `inteligencia-artificial`, ver commit `f084e16`) y las 4 páginas con FAQ ampliada (commit `b42b81d`)— no comunican esa fecha de actualización a Google vía sitemap, perdiendo una señal de frescura gratuita.

**Recomendación accionable:** si las páginas estáticas (`.astro`) incorporan en el futuro un campo de frontmatter o constante tipo `updatedDate` (aunque sea manual, actualizado solo cuando hay un cambio de contenido real), extender la misma función `serialize()` de `astro.config.mjs` para leerlo y añadir `lastmod` también a esas páginas. No usar la fecha de build automática. No es bloqueante: bajo impacto porque el `lastmod` es una señal débil para Google, pero es una mejora de bajo coste ya que la infraestructura (`serialize()`) ya existe y solo falta la fuente de datos por página.

---

## 4. Páginas huérfanas (en repo pero no en sitemap)

Comparación de `src/pages/*.astro` (excluyendo `blog/[slug].astro`, que es la plantilla dinámica que genera los 4 posts) contra las 22 URLs del sitemap:

| Archivo en `src/pages/` | ¿En sitemap? |
|---|---|
| `index.astro` | ✅ |
| `automatizaciones.astro` | ✅ |
| `aviso-legal.astro` | ✅ |
| `blog/index.astro` | ✅ |
| `blog/[slug].astro` → 4 posts | ✅ (los 4) |
| `components.astro` | ❌ (correcto, tiene `noindex`, excluido por `filter`) |
| `contacto.astro` | ✅ |
| `cookies.astro` | ✅ |
| `desarrollo-software-medida.astro` | ✅ |
| `diseno-web-sevilla.astro` | ✅ |
| `inteligencia-artificial.astro` | ✅ |
| `portfolio.astro` | ✅ |
| `privacidad.astro` | ✅ |
| `seo-local-sevilla.astro` | ✅ |
| `sobre-mi.astro` | ✅ |
| `tienda-online-sevilla.astro` | ✅ |
| `web-para-abogados-gestorias-sevilla.astro` | ✅ |
| `web-para-clinicas-sevilla.astro` | ✅ |
| `web-para-comercios-sevilla.astro` | ✅ |
| `web-para-restaurantes-sevilla.astro` | ✅ |

**Resultado: 0 páginas huérfanas.** Las 18 rutas estáticas indexables + 4 posts de blog = 22, coincide exactamente con el recuento del sitemap. La única página excluida (`components.astro`) lo está de forma intencional y correcta (design system interno, `noindex`).

**Severidad: ninguna.**

---

## 5. ¿Sitemap único o segmentado por secciones?

Con 22 URLs, un único `sitemap-0.xml` bajo `sitemap-index.xml` es **adecuado y no requiere cambios ahora**. Segmentar (p. ej. `sitemap-pages.xml`, `sitemap-blog.xml`, `sitemap-legal.xml`) solo aporta valor cuando:
- Se supera un volumen que dificulte el diagnóstico en Search Console (referencia práctica: cientos/miles de URLs, muy lejos de las 22 actuales), o
- Se necesita monitorizar la tasa de indexación por tipo de contenido de forma independiente (p. ej. si el blog escala a decenas de posts y se quiere ver su cobertura de indexación separada de las páginas de servicio).

**Recomendación:** no segmentar todavía. Es una automatización de `@astrojs/sitemap` que no requiere mantenimiento manual; segmentar ahora añadiría complejidad sin beneficio medible. Revisar esta decisión si el blog supera ~20-30 posts o si se añaden más páginas de nicho/industria.

---

## 6. Quality Gate — páginas de tipo "ubicación/nicho"

Páginas con enfoque de nicho + ciudad (Sevilla) actualmente en el sitemap:

`diseno-web-sevilla`, `seo-local-sevilla`, `tienda-online-sevilla`, `web-para-abogados-gestorias-sevilla`, `web-para-clinicas-sevilla`, `web-para-comercios-sevilla`, `web-para-restaurantes-sevilla` = **7 páginas**.

- Muy por debajo del umbral de ⚠️ WARNING (30+ páginas) y del 🛑 HARD STOP (50+ páginas). No aplica ninguna puerta de calidad todavía.
- Nota positiva: no son páginas de "ciudad intercambiada" (mismo texto, cambia solo el nombre de la ciudad) — son verticales de industria distintos (abogados/gestorías, clínicas, comercios, restaurantes) para una única ciudad, y ya se amplió su FAQ a 8 preguntas por página (commit `b42b81d`), lo que reduce el riesgo de contenido fino/duplicado tipo "doorway page".
- **Recomendación preventiva:** si en el futuro se replica este patrón a otras ciudades (p. ej. `web-para-restaurantes-madrid`, `web-para-restaurantes-malaga`...), vigilar el umbral de 30 páginas y garantizar ≥60% de contenido único por página (casos reales, testimonios o datos locales verificables, no solo el nombre de la ciudad cambiado) antes de escalar.

---

## Resumen de hallazgos por severidad

| Severidad | Hallazgo | Acción |
|---|---|---|
| Info | Namespaces `news`/`xhtml`/`image`/`video` sin uso en `urlset` | Ninguna acción requerida (no es error, Google los ignora) |
| Info | `priority`/`changefreq` ausentes | Ya correcto, no hay nada que quitar |
| Baja | 18 de 22 páginas sin `lastmod` (decisión intencional, documentada en código) | Opcional: añadir `updatedDate` manual a páginas estáticas clave y extender `serialize()` en `astro.config.mjs` |
| — | 0 páginas huérfanas, 0 URLs rotas/redirigidas/noindexadas, sitemap único adecuado al tamaño actual, quality gate de páginas de nicho no se activa (7 < 30) | Sin acción |
