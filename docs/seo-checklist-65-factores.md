# Checklist de 65 factores SEO — estado real en nuriaromero.dev

Origen: [Google Sheet "65 FACTORES SEO 2026 — Checklist de Auditoría Completo"](https://docs.google.com/spreadsheets/d/1L0jowfUScp_FcCTLCy0Nl8mmzJu2rC_hyWRDbv-Dnk8/edit?gid=356301401#gid=356301401), una plantilla genérica de industria (todas las filas llegan marcadas "Pendiente" porque es un checklist en blanco, no un diagnóstico de este sitio).

Revisión: 2026-09-25. Este documento cruza cada uno de los 65 factores contra el estado **real** del código y contenido de nuriaromero.dev, apoyándose en la auditoría completa de 11 agentes en `docs/seo-audit/full-audit-2026-09-22/` (Health Score 77/100) y en el historial de commits posterior a esa fecha, más verificación puntual de código donde hacía falta.

Leyenda de estado: **Hecho** · **Parcial** (funciona pero incompleto, se explica qué falta) · **Pendiente** (no implementado) · **No aplica** (no encaja con el tamaño/etapa de este negocio ahora mismo).

---

## Bloque 1 — Contenido & Semántica (1-15)

| Nº | Factor | Estado | Evidencia | Prioridad |
|---|---|---|---|---|
| 1 | Intención de búsqueda | Parcial | Cada página de servicio tiene intención definida (`src/data/seo-intents.ts`), pero no hay un proceso repetible de analizar la SERP antes de escribir cada pieza nueva | Alta |
| 2 | H1 único orientado a keyword | Hecho | H1 con keyword cerca del inicio en todas las páginas de servicio (ej. "SEO local en Sevilla para negocios que quieren...") | Alta |
| 3 | Keyword en primeros 100 caracteres | Hecho | Subtítulos/intros de hero siguen el patrón keyword-primero de forma consistente | Alta |
| 4 | Jerarquía H2-H6 | Hecho | SEO-23 añadió H2 en formato pregunta; `ProcessSteps`/`FAQ` mantienen jerarquía limpia | Media |
| 5 | Cobertura semántica (entidades/LSI) | Parcial | Contenido extenso y cuidado, pero sin herramienta tipo Surfer/Clearscope que valide cobertura de términos frente a competidores | Alta |
| 6 | Profundidad y extensión | Parcial | Páginas de servicio con extensión robusta; blog todavía fino (solo 4 posts) | Alta |
| 7 | Legibilidad y estructura visual | Parcial | SEO-20 dividió FAQs largas en párrafos escaneables; hoy mismo se subió tamaño/interlineado del body. Falta medir Flesch Reading Ease en español | Media |
| 8 | Negritas y destacados | Hecho | `<strong>` resaltado en amarillo en Hero/AboutMe para conceptos clave | Media |
| 9 | Listas/viñetas para featured snippets | Hecho | FAQs, listas de precios y `ProcessSteps` numerados en toda la web | Alta |
| 10 | Cero contenido duplicado | Parcial | Canonicals autorreferenciales correctos (`SEO.astro`); SEO-19 tuvo que corregir un caso de casi-duplicado detectado manualmente — falta vigilancia sistemática | Alta |
| 11 | Actualización/freshness | Pendiente | Sin calendario de revisión periódica establecido; el trabajo hasta ahora es reactivo (auditorías puntuales) | Alta |
| 12 | Vídeos de YouTube embebidos | No aplica | Sin contenido de vídeo propio todavía; retomar si se produce vídeo en el futuro | Media |
| 13 | Gramática/ortografía/calidad editorial | Hecho | Copy revisado manualmente en cada sesión de trabajo, sin errores reportados | Media |
| 14 | Canibalización de keywords | Hecho | SEO-19 corrigió el caso detectado; `check-seo-07.mjs` vigila duplicados entre páginas de nicho | Alta |
| 15 | FAQ integradas | Hecho | `FAQPage` schema + componente `FAQ` en casi todas las páginas de servicio y nicho | Alta |

## Bloque 2 — Snippet & Visibilidad SERP (16-25)

| Nº | Factor | Estado | Evidencia | Prioridad |
|---|---|---|---|---|
| 16 | Meta title — keyword al inicio | Hecho | Ej. "SEO local en Sevilla \| Proyecto inicial desde 299 € + IVA" en `src/data/services.ts` | Alta |
| 17 | Meta description orientada a CTR | Hecho | Cada servicio define `seo.description` con keyword + precio + propuesta de valor | Alta |
| 18 | URL limpia, corta y con keyword | Hecho | Slugs tipo `/seo-local-sevilla/`, `/diseno-web-sevilla/` | Alta |
| 19 | Estructura de URL jerárquica | Hecho | URLs planas en raíz por decisión consciente (SEO-01 redirigió `/servicios/<slug>` → raíz con 301) | Media |
| 20 | HTTPS y seguridad | Hecho | HSTS con `includeSubDomains`, CSP sin `unsafe-inline` (commits recientes) | Alta |
| 21 | Breadcrumbs con schema | Hecho | `BreadcrumbList` implementado en `src/lib/schema.ts` | Alta |
| 22 | Schema markup relevante | Hecho | 88/100 en auditoría; migrado a patrón `@graph`, `Organization.logo` añadido | Alta |
| 23 | Open Graph y Twitter Cards | Hecho | `og:title`, `og:image`, `twitter:card` implementados en `SEO.astro` | Media |
| 24 | Optimización para AI Overviews/SGE | Parcial | `llms.txt`, FAQ con respuesta directa y "respuesta corta" ya trabajados (SEO-22/23); GEO score 74/100 — faltan `sameAs` más amplios y contenido multimodal | Alta |
| 25 | Sitemap XML actualizado | Hecho | 92/100 en auditoría, 0 páginas huérfanas/rotas | Alta |

## Bloque 3 — Multimedia & Experiencia (26-33)

| Nº | Factor | Estado | Evidencia | Prioridad |
|---|---|---|---|---|
| 26 | Alt text descriptivo | Hecho | `alt` es prop obligatoria en `astro:assets Image`; sin `<img>` crudos en el código | Alta |
| 27 | Nombres de archivo descriptivos | Hecho | `perfil-home.webp`, `nuriaromerodev-logo-blanco.svg`, etc. — nada tipo `IMG_1234` | Media |
| 28 | Compresión de imágenes (<150kb) | Hecho | Peso total de página 68 KiB en auditoría de laboratorio | Alta |
| 29 | Formatos modernos WebP/AVIF | Hecho | Todos los assets de imagen ya están en `.webp` | Alta |
| 30 | Dimensiones definidas (anti-CLS) | Hecho | CLS 0.000–0.016 en las 4 páginas medidas; `width`/`height` obligatorios vía `astro:assets` | Alta |
| 31 | Vídeo propio con VideoObject schema | No aplica | Sin producción de vídeo propio por ahora | Media |
| 32 | Transcripción de vídeos/podcasts | No aplica | Depende del factor 31 | Media |
| 33 | Infografías y contenido visual propio | No aplica | Sin recursos de diseño gráfico dedicados en este momento | Baja |

## Bloque 4 — Enlazado & Arquitectura (34-42)

| Nº | Factor | Estado | Evidencia | Prioridad |
|---|---|---|---|---|
| 34 | Interlinking entrante estratégico | Parcial | Header/Footer enlazan todas las páginas por igual; no hay un "pillar page" que concentre autoridad de forma explícita | Alta |
| 35 | Interlinking saliente | Hecho | SEO-21 añadió puentes de navegación entre páginas comerciales adyacentes | Alta |
| 36 | Anchor text variado y descriptivo | Hecho | 0 anchors genéricos ("aquí", "ver más") encontrados en todo el código | Alta |
| 37 | Páginas huérfanas | Hecho | 0 confirmadas en auditoría; las 7 páginas de servicio/nicho ya están en Header/Footer | Alta |
| 38 | Profundidad de clic ≤ 3 niveles | Hecho | Todo el catálogo de servicios es alcanzable a 1 clic desde cualquier página | Media |
| 39 | Enlaces externos a fuentes de autoridad | Pendiente | 0 enlaces externos a fuentes de autoridad encontrados en el blog | Media |
| 40 | Control de nofollow/sponsored/ugc | No aplica | Sin enlaces de afiliado ni comentarios de usuarios en el sitio | Media |
| 41 | Arquitectura en silos temáticos | Parcial | Cross-linking vía `internal-links.ts`/`seo-intents.ts`, pero sin pillar pages ni cluster de blog maduro (solo 4 posts) | Alta |
| 42 | Robots.txt bien configurado | Hecho | Generado automáticamente vía `astro-robots-txt`, confirmado abierto a bots de IA (GPTBot, ClaudeBot, etc.) | Alta |

## Bloque 5 — SEO Técnico On-Page (43-53)

| Nº | Factor | Estado | Evidencia | Prioridad |
|---|---|---|---|---|
| 43 | LCP | Hecho | 0.97–1.38s en Lighthouse (solo lab, sin datos de campo CrUX) | Alta |
| 44 | CLS | Hecho | 0.000–0.016 en las 4 páginas medidas | Alta |
| 45 | INP | Pendiente | No medible en laboratorio; sin acceso a CrUX/PSI por falta de credenciales de Google API (bloqueado, ver SEO-14) | Alta |
| 46 | Mobile-first y diseño responsivo | Hecho | Confirmado en auditoría + trabajo de esta sesión (tipografía, franjas visuales, footer) | Alta |
| 47 | Minificación y optimización de código | Hecho | Astro/Vite minifica JS/CSS/HTML por defecto en build de producción | Media |
| 48 | Lazy loading de imágenes/vídeos | Hecho | Verificadas todas las `<Image>` del sitio (`rg "<Image"`): logo del `Header.astro` (visible en todas las páginas) ahora con `loading="eager"` explícito; foto del hero de `index.astro` con `loading="eager" fetchpriority="high"` (confirmado en el `<img>` del build); `Hero.astro` (sobre-mí) ya tenía `eager`. El resto (proyectos, retrato de "sobre mí", listado de blog) queda en `lazy` por defecto, correcto por estar below-the-fold. `astro check` y `astro build` sin errores | Alta |
| 49 | Evitar pop-ups intrusivos | Hecho | Solo banner de cookies (necesario y no intrusivo), sin popups de marketing | Media |
| 50 | Canonical tags | Hecho | Autorreferenciales en todas las páginas, confirmado en `SEO.astro` | Alta |
| 51 | Página 404 personalizada | Pendiente | No existe `src/pages/404.astro` — el sitio usa la 404 genérica del hosting | Media |
| 52 | CTA claro y objetivo de conversión | Hecho | `BookingButton` como CTA primario en toda la web (commit reciente "make booking the primary CTA") | Alta |
| 53 | Favicon e identidad visual en SERPs | Hecho | Favicon SVG moderno implementado (`public/favicon.svg`) | Baja |

## Bloque 6 — E-E-A-T & Autoridad de Marca (54-65)

| Nº | Factor | Estado | Evidencia | Prioridad |
|---|---|---|---|---|
| 54 | Contenido firmado por autor | Hecho | Byline "Nuria Romero Castillo" visible en los 4 posts de blog | Alta |
| 55 | Página de autor con bio/credenciales/redes | Parcial | `/sobre-mi` existe con experiencia y trayectoria (NTT DATA, +10 años), pero podría reforzarse con más redes/credenciales visibles | Alta |
| 56 | Presencia en redes sociales | Parcial | `sameAs` limitado a LinkedIn + GitHub (GEO score señala esto como hueco) | Media |
| 57 | Brand queries | Pendiente | No verificable sin credenciales de Google Search Console (bloqueado, ver SEO-14) | Alta |
| 58 | Google Business Profile | Hecho | Confirmado y verificado 2026-09-25: ficha real (Place ID `ChIJ8Uv-vM9f0CoR8J75dj4I0HM`), negocio de zona de servicio, enlazada en `sameAs`/`hasMap` y en `/seo-local-sevilla` vía `LocalTrustStatus.astro` | Alta |
| 59 | Página "Sobre nosotros" completa | Hecho | `/sobre-mi` con trayectoria, experiencia y misión | Alta |
| 60 | Política de privacidad, legal y cookies | Hecho | Aviso legal, privacidad y cookies implementados (commit "páginas legales... + consentimiento") | Media |
| 61 | Menciones en medios y prensa (PR digital) | Pendiente | Sin evidencia de estrategia de Digital PR activa | Media |
| 62 | Reseñas de clientes y testimonios | Parcial | Confirmado 2026-09-27 en local: `GoogleReviews.astro` trae reseñas reales (1 reseña, 5.0 de media) y `reviewsSchema()` ya emite `AggregateRating`/`Review` en el JSON-LD de la home, verificado en el `<script>` renderizado. Único punto pendiente: confirmar que `GOOGLE_PLACES_API_KEY`/`GOOGLE_PLACE_ID` están bien puestas en el hosting de producción (no solo local) y hacer un deploy con estos commits | Alta |
| 63 | Directorios y rankings en blog | No aplica | Formato de contenido no usado actualmente en el blog | Alta |
| 64 | HTTPS + datos de contacto visibles | Hecho | Footer con email y teléfono visibles, HTTPS confirmado | Alta |
| 65 | Presencia en Wikipedia/Wikidata | No aplica | Negocio en etapa demasiado temprana para justificar una entrada enciclopédica | Baja |

---

## Resumen

- **Hecho:** 41
- **Parcial:** 11
- **Pendiente:** 6
- **No aplica (por ahora):** 7

## Por dónde empezar

### Accionables ya mismo (sin bloqueos externos), de menor a mayor esfuerzo

1. **#51 — Página 404 personalizada.** Un solo archivo nuevo (`src/pages/404.astro`), sin dependencias. El quick win más rápido de esta lista.
2. **#39 — Enlaces externos de autoridad en el blog.** Añadir 1-2 enlaces a fuentes citables (estudios, Google oficial) en los 4 posts existentes.
3. **#56 — Ampliar `sameAs`.** Ya se sumó GBP (#58); faltan más redes si existen (Instagram, X, YouTube...).
4. **#34 y #41 — Definir arquitectura de pillar pages.** Decidir qué página de servicio actúa como "pilar" por tema (SEO local, diseño web, automatización) y reforzar el interlinking entrante hacia ella desde el resto del contenido relacionado.
5. **#11 — Calendario de freshness.** Definir qué páginas se revisan cada cuánto (las de mayor tráfico/relevancia primero).
6. **#10 — Proceso de vigilancia de duplicados.** Convertir la corrección puntual de SEO-19 en una revisión periódica, no solo reactiva a auditorías.
7. **#1, #5, #6, #7, #24 — Contenido y semántica.** Trabajo editorial de fondo: sistematizar el análisis de intención de búsqueda antes de escribir, ampliar el blog, y reforzar la cobertura semántica de las páginas de servicio ya existentes.

### Bloqueados por decisión externa o credenciales (backlog secundario, ya documentado en tareas anteriores)

- **#45, #57 — INP y brand queries:** requieren credenciales de Google Search Console/CrUX (propiedad de SEO-14).
- **#62 — Reseñas con schema:** GBP (#58) ya no es el bloqueo. Falta únicamente `GOOGLE_PLACES_API_KEY` en variables de entorno (`GOOGLE_PLACE_ID` ya se conoce: `ChIJ8Uv-vM9f0CoR8J75dj4I0HM`) — propiedad de SEO-14.
- **#61 — PR digital:** requiere una estrategia de comunicación/relaciones con medios, fuera del alcance de cambios de código.

### No aplica por ahora (revisar si el negocio escala)

- **#12, #31, #32 — Vídeo propio y transcripciones:** retomar si se produce contenido de vídeo.
- **#33 — Infografías propias:** retomar si hay recursos de diseño gráfico dedicados.
- **#40, #63 — Nofollow/UGC y directorios de blog:** no aplican al formato de contenido actual del sitio.
- **#65 — Wikipedia/Wikidata:** revisar cuando la marca tenga notoriedad suficiente para justificarlo.
