# Auditoría SEO completa — nuriaromero.dev

Fecha: 2026-09-22 · Auditoría de solo lectura (sin cambios de código) sobre `https://nuriaromero.dev` en producción, con lectura del repositorio local como apoyo. Consolida los 11 informes de especialistas en `docs/seo-audit/full-audit-2026-09-22/findings/` y da continuidad a la auditoría previa del 2026-09-21.

**Tipo de negocio:** Service Area Business (SAB) — desarrolladora freelance de servicios digitales (diseño web, software a medida, automatizaciones, IA, SEO local/GEO) para pequeños negocios locales en Sevilla y su área metropolitana. Sin local público, sin multi-sede.

---

## Resumen ejecutivo

### Health Score global: **77/100**

| Categoría | Peso | Puntuación | Ponderado |
|---|---|---|---|
| Technical SEO | 22% | 88 | 19.4 |
| Content Quality | 23% | 70 | 16.1 |
| On-Page SEO | 20% | 62 | 12.4 |
| Schema | 10% | 88 | 8.8 |
| Performance | 10% | 100* | 10.0 |
| AI Search Readiness (GEO) | 10% | 74 | 7.4 |
| Images | 5% | 68 | 3.4 |
| **Total ponderado** | **100%** | | **77.5 ≈ 77/100** |

\*Performance 100/100 es **solo dato de laboratorio** (Lighthouse, una ejecución, 4 páginas). No hay datos de campo (CrUX/PSI) por falta de credenciales de Google API — ver limitación de entorno más abajo. Se usa el número reportado por el especialista tal cual, con esta salvedad explícita: no representa el CWV real percibido por usuarios (p75).

Local SEO (38/100) y Backlinks (datos insuficientes, sin puntuación numérica) se reportan como secciones propias pero **no forman parte de las siete categorías ponderadas anteriores**, porque no están en la lista de pesos definida para este ciclo de auditoría. Ambas dependen en gran medida de decisiones humanas o activos externos pendientes (ficha de Google Business Profile, outreach de enlaces), no de trabajo de código.

### Qué confirma esta auditoría como resuelto en producción (con evidencia en vivo)

- **SEO-01** (redirects de `/servicios/<slug>`): confirmado, 301 único salto en las 4 rutas.
- **SEO-03** (`/components/`): confirmado ausente, 404 limpio, fuera del sitemap.
- **SEO-09** (autoría/fecha en el post GEO): confirmado en HTML servido, con JSON-LD `Article` coherente.
- **SEO-11** (naming de marca unificado, grafo de entidad `ProfessionalService`/`Organization`/`Person` con `@id`): confirmado en las 22 páginas y 10 servicios.
- **SEO-12** (CTA de WhatsApp visible sin scroll en mobile): confirmado con capturas reales en 360/390/414px.
- Sitemap: 92/100, 0 páginas huérfanas/rotas/noindexadas.

### Lo que sigue abierto (top 5 por prioridad)

1. **[Alto]** Panel de consentimiento de analítica (`AnalyticsConsent.astro`) sin `aria-modal`, sin focus trap, inalcanzable por Tab, `Escape` no cierra — confirmado de forma convergente por tres fuentes independientes: datos reales de PageSpeed Insights móvil aportados por la propietaria, lectura del código fuente, y pruebas en navegador real (Playwright).
2. **[Alto]** El botón flotante de WhatsApp solapa visualmente el CTA "Ver qué puedo hacer por tu negocio" a 360px de ancho (Android más común) — confirmado con captura de pantalla y geometría DOM real.
3. **[Alto, coste bajo]** El cierre de la FAQ "cómo aparezco cerca de mí" en las 4 páginas de nicho sigue siendo la misma plantilla con el verbo sinónimo cambiado — **exactamente el mismo hallazgo detectado el 2026-09-21**, sin cambios de texto pese a que SEO-05/SEO-07 muestran evidencia de trabajo técnico sustancial (ver nota de higiene de seguimiento abajo).
4. **[Alto]** `/seo-local-sevilla/` sigue sin usar la palabra "agencia" en título/H1, pese a que 9 de 9 resultados orgánicos para "agencia SEO Sevilla" (5.000 búsquedas/mes) la usan — verificado con WebSearch real el 21-09, sin cambios hoy.
5. **[Medio]** Enlaces sin barra final en `Header.astro`/`Footer.astro` (componentes compartidos en las ~22 páginas): SEO-02 normalizó blog y las 10 rutas canónicas, pero no alcanzó la navegación global, generando un 301 evitable en cada clic/rastreo.

### Quick wins (coste bajo, impacto alto)

- Reescribir las 4 variantes del cierre de FAQ de nicho (puramente editorial, ~1-2h).
- Añadir barra final a los 7 enlaces de Header/Footer (~30 min).
- Sustituir la ruta relativa `/seo-local-sevilla` por URL absoluta en las 4 FAQ de nicho (~15 min).
- Añadir los 3 posts de blog restantes a `llms.txt` (~15 min).
- Añadir "agencia" como vocabulario de apoyo en `/seo-local-sevilla/` sin cambiar el H1 de marca (~1h).

### ⚠️ Nota de higiene de seguimiento (tracking hygiene)

El backlog `odd/tasks/seo-audit-backlog-2026-09-21.md` marca SEO-05 y SEO-07 como **"Estado: parcial"**, con evidencia real de trabajo desplegado: títulos sectoriales visibles, matriz de intención documentada, checkers deterministas (`check-seo-05.mjs`, `check-seo-07.mjs`) en verde. Todo eso es cierto y verificable. Pero el hallazgo concreto y literal que motivó esas tareas —el cierre de FAQ plantillado palabra por palabra en las 4 páginas de nicho— **sigue exactamente igual en producción**, verbatim, sin ningún cambio de redacción. La razón técnica es clara: los checkers validan estructura, claims prohibidos y similitud agregada por n-gramas, no la variación semántica de una frase concreta ya señalada como problema. Esto no es un fallo de los checkers (hacen bien lo que fueron diseñados para hacer), pero sí una llamada de atención: **"parcial" con evidencia de checker en verde puede ocultar que el hallazgo textual original de más alta prioridad no se tocó.** Recomendación de proceso: cuando una tarea de auditoría cita un texto exacto como problema, el criterio de cierre debería incluir una comprobación de que ese texto exacto cambió, no solo que un checker estructural pase.

### Limitación de entorno (aplica a toda la auditoría, no se repite por categoría)

- **Sin credenciales de Google API**: no hay datos de Search Console, CrUX ni GA4 en ningún punto de esta auditoría. Confirmado con `google_auth.py --check`. Afecta a Performance (solo lab, sin INP ni p75), GEO (sin verificación de apariciones reales), Cluster/SXO (sin validación de canibalización por consultas reales) y Local (sin GBP API).
- **Sin clave Moz/Bing**: perfil de backlinks a Tier 0 (Common Crawl + verificación manual), sin Domain Authority, Spam Score ni dominios referentes reales.
- **`drift_history.py` roto en este entorno** (Python 3.9 frente a sintaxis `dict | None` que requiere 3.10+): no se estableció ninguna línea base de drift en esta pasada.
- **Google Rich Results Test no ejecutable** desde este entorno (sin sesión/navegador interactivo con API pública). La validación de schema de esta auditoría es manual y rigurosa, pero no sustituye una pasada real por la herramienta de Google.

---

## 1. SEO Técnico — 88/100

Fuente: `findings/technical.md`, `findings/sitemap.md`.

**Qué funciona:** robots.txt correcto y abierto a bots de IA (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended); sitemap válido (23 URLs, 0 errores, 0 huérfanas); HTTPS forzado en un solo salto; cabeceras de seguridad completas (HSTS, CSP, X-Frame-Options, etc.); canonicals autorreferenciales correctos; renderizado 100% SSR/SSG (Astro), sin dependencia de JS para contenido indexable; SEO-01 y SEO-03 confirmados en vivo.

**Hallazgos:**

| ID | Hallazgo | Severidad |
|---|---|---|
| TECH-01 | Header/Footer sin barra final en 7 enlaces compartidos (SEO-02 no cubrió componentes de layout) | Media |
| TECH-02 | `role="dialog"` inapropiado en el panel de consentimiento (ver sección On-Page/UX, hallazgo unificado) | Media/Alta |
| TECH-03 | IndexNow no implementado | Baja |
| TECH-04 | HSTS sin `includeSubDomains`/`preload` | Baja |
| TECH-05 | CSP con `'unsafe-inline'` en `script-src` | Baja |
| SITEMAP-01 | 19 de 23 páginas sin `lastmod` (decisión intencional, sin fechas fabricadas) | Baja |

Sin hallazgos de severidad Critical/High en esta categoría. Sitemap: 92/100 propio (sin cambios respecto al 21-09).

---

## 2. Calidad de contenido — 70/100

Fuente: `findings/content.md`.

E-E-A-T ponderado: Experience 55, Expertise 76, Authoritativeness 58, Trustworthiness 79 → 70.2/100.

**Mejora real desde el 21-09:** autoría y fecha visibles en el post GEO (SEO-09), confirmado en producción, con impacto positivo en Expertise (72→76).

**Sin cambios desde el 21-09** (mismos hallazgos, mismo texto):
1. Cierre de FAQ "cómo aparezco cerca de mí" — plantilla idéntica con verbo sinónimo en las 4 páginas de nicho (Media-Alta).
2. Respuestas de FAQ largas (100-130+ palabras) en bloque único, sin listas ni subdivisión (Media).
3. Solape semántico entre la FAQ "¿Qué es el GEO?" de `/seo-local-sevilla/` y el post de blog dedicado (Media).

**Sin infracciones de claims prohibidos** (posición en Google, velocidad exacta, garantías) en todas las páginas revisadas — cumplimiento consistente de las restricciones de `.agents/product-marketing-context.md`.

---

## 3. On-Page SEO (SXO, arquitectura de enlazado, UX) — 62/100

Fuente: `findings/sxo.md`, `findings/cluster.md`, `findings/visual.md`.

**Resuelto desde el 21-09:** las 7 páginas de servicio/nicho dejaron de ser huérfanas de navegación (Header/Footer las incluyen); enlace del post de Google Maps corregido a `/seo-local-sevilla/`; enlace cruzado comercios ↔ tienda online ya existe; CTA de WhatsApp visible sin scroll en mobile (SEO-12).

**Hallazgos abiertos:**

- **Puentes de navegación ausentes entre páginas comerciales adyacentes** (`/diseno-web-sevilla/` ↔ `/web-para-comercios-sevilla/` ↔ `/tienda-online-sevilla/`, y del hub genérico a las 4 páginas de nicho): el avatar objetivo ("no nativo digital") no distingue por adelantado catálogo/web general/tienda online, y `reciprocalLinks` en `seo-intents.ts` solo cubre pares informacional↔comercial (Media).
- **`/seo-local-sevilla/` sin la palabra "agencia"** en título/H1, pese a 9/9 resultados SERP para "agencia SEO Sevilla" (5.000/mes) usándola — verificado con WebSearch real el 21-09, sigue vigente hoy (Media-Alta, heredado).
- **FAQ "¿Cuánto cuesta una tienda online?" casi duplicada** entre `/web-para-comercios-sevilla/` y `/tienda-online-sevilla/`, con `FAQPage` schema en ambas — **no detectada por `check-seo-07.mjs`**, que solo compara preguntas entre las 4 rutas de nicho, nunca nicho vs. servicio (Media-Alta).
- **H2/FAQ de precio en `/diseno-web-sevilla/` casi calcado** del titular del post de blog de precio, pese a intención documentada y enlace recíproco existente (Media).
- **Botón flotante de WhatsApp solapa el CTA del hero a 360px** — confirmado con captura y geometría DOM (Alto).
- **Panel de consentimiento inaccesible por teclado** — ver hallazgo unificado abajo (Alto).
- RGPD no confirmado (ni descartado) en el FAQ interno de `/web-para-clinicas-sevilla/` y `/web-para-abogados-gestorias-sevilla/` — gap sin verificar, baja confianza.

### Hallazgo unificado de accesibilidad: panel de consentimiento (`AnalyticsConsent.astro`)

Confirmado por **tres fuentes independientes convergentes**:
1. PageSpeed Insights móvil real, aportado directamente por la propietaria del sitio: categoría "Navegación agéntica", 2/3, auditoría fallida "ARIA role should be appropriate for the element" sobre el `<aside role="dialog">`.
2. Lectura del código fuente (`src/components/AnalyticsConsent.astro`): sin `aria-modal`, sin gestión de foco, sin captura de foco, sin cierre con `Escape`.
3. Pruebas en navegador real (Playwright, 4 viewports): 20 pulsaciones de Tab nunca alcanzan los botones del diálogo; `Escape` no lo cierra; overflow interno de ~4px a 360px; botones de 45px de alto (3px bajo el estándar de 48px).

Tratado como **un único hallazgo de severidad Alta**, no tres hallazgos separados, dado el origen convergente.

---

## 4. Schema / Datos estructurados — 88/100

Fuente: `findings/schema.md`.

23/23 páginas del sitemap con JSON-LD sintácticamente válido, 0 errores críticos, tipos correctos (`ProfessionalService`/`Organization`, `Service`, `Article`, `FAQPage`, `BreadcrumbList`, `Person`, `WebSite`) con propiedades obligatorias presentes.

**Hallazgos (todos Warning/Info, ninguno bloqueante):**
- Referencias `@id` entre bloques `<script>` distintos sin `@graph`, sin confirmar con Rich Results Test (Warning).
- Falta `Organization.logo` (solo hay `image`) (Info).
- Patrón "array con `@context` repetido" en vez de `@graph` (Info, estilo).
- `Article` sin `mainEntityOfPage` (Info).
- No se ha podido ejecutar Google Rich Results Test desde este entorno — validación manual rigurosa como sustituto, no equivalente (limitación declarada).

Ausencia intencional y correcta de `geo`/`aggregateRating`/`review`/`openingHoursSpecification` — no se marca como defecto, es la aplicación correcta de "no inventar datos locales" (ver sección Local SEO).

---

## 5. Rendimiento y Core Web Vitals — 100/100 (solo laboratorio)

Fuente: `findings/performance.md`.

Primera medición real con herramienta de laboratorio (Lighthouse 13.5.0, mobile) de esta serie de auditorías. 4 páginas evaluadas (home, `/diseno-web-sevilla/`, `/web-para-restaurantes-sevilla/`, `/contacto/`): Performance 100/100 en las 4; LCP 0.97–1.38s (Good); CLS 0.000–0.016 (Good); peso de página mínimo (68 KiB, 7 peticiones).

**No se reporta INP** porque no es medible en laboratorio y no hay acceso a CrUX (PSI devolvió 429 dos veces, sin `GOOGLE_API_KEY`). **No hay ningún dato de campo (p75) para ninguna métrica.** Anomalía menor: TTFB de la home (496ms) notablemente más alto que el resto (48-193ms) — no crítico, pero a vigilar. Medición de terceros solo capturada en estado "sin consentimiento" — no se ha medido el impacto de GA4 tras aceptar cookies.

---

## 6. Imágenes — 68/100 (estimación razonada, sin auditoría dedicada este ciclo)

No se ejecutó un especialista de imágenes en este ciclo de 11 auditorías; esta puntuación combina evidencia indirecta de otros informes:
- **Positivo** (technical.md): imágenes de portfolio con `width`/`height`, `srcset`, `loading="lazy"`, `decoding="async"` — buena práctica técnica anti-CLS, confirmado en CLS 0.000–0.016 en todas las páginas medidas.
- **Negativo** (geo.md, sección 5): ausencia total de imágenes editoriales propias (diagramas, capturas, infografías) en los 4 posts de blog y las 9 páginas con FAQ — solo iconografía decorativa y una `og:image` genérica compartida.
- No se ha verificado cobertura ni calidad de texto alternativo (`alt`) de forma sistemática en ninguno de los 11 informes — gap de verificación, no defecto confirmado.

---

## 7. AI Search Readiness / GEO — 74/100

Fuente: `findings/geo.md`.

| Dimensión | Peso | Nota |
|---|---|---|
| Citabilidad (passage-level) | 25% | 78 |
| Legibilidad estructural | 20% | 72 |
| Contenido multi-modal | 15% | 50 |
| Autoridad y señales de marca | 20% | 72 |
| Accesibilidad técnica para IA | 20% | 90 |

**Confirmado en vivo, no solo intención de diseño:** `llms.txt` con 18 enlaces absolutos; FAQ con respuesta directa resaltada; post GEO con sección "Respuesta corta"; byline y fecha visibles en los 4 posts.

**Persisten sin cambios desde el 21-09:**
- Enlace relativo no citable (`/seo-local-sevilla` sin dominio) en las 4 FAQ de nicho (Media).
- `llms.txt` solo enlaza individualmente 1 de 4 posts de blog (Media).
- `sameAs` limitado a LinkedIn + GitHub, sin GBP/YouTube/Reddit (Media, condicionado a decisión GBP pendiente de SEO-10 para el enlace de GBP específicamente).
- H2 del post GEO sin formato pregunta; 3 de 4 posts sin bloque "respuesta corta" (Baja-Media).
- Sin contenido multi-modal (tablas, imágenes propias, vídeo) en ningún contenido editorial (Media).
- `ai.txt`/`rsl.xml` no implementados (Baja, informativo, estándares aún incipientes).

---

## 8. Local SEO — 38/100 (reportado, no ponderado en el Health Score)

Fuente: `findings/local.md`.

| Dimensión | Peso | Puntuación |
|---|---|---|
| GBP Signals | 25% | 10 |
| Reviews & Reputation | 20% | 15 |
| Local On-Page SEO | 20% | 65 |
| NAP Consistency & Citations | 15% | 60 |
| Local Schema Markup | 10% | 72 |
| Local Link & Authority | 10% | 30 |

**Mejorado desde el 21-09:** naming de marca unificado ("Nuria Romero" consistente en footer/título/JSON-LD, protegido por checker `check-seo-11.mjs`); grafo de entidad enlazado con `@id`; `areaServed` enriquecido con `City` + `AdministrativeArea`.

**Bloqueado por decisión humana pendiente, no por código:** la ausencia de ficha de Google Business Profile arrastra el 45% del peso (GBP Signals + Reviews) al mínimo. El sitio expone esto de forma transparente y correcta en `/seo-local-sevilla/` en vez de fabricar datos — postura correcta a nivel SEO/E-E-A-T mientras se decide. **Ya cubierto por SEO-10 en el backlog anterior; esta auditoría no crea una tarea nueva para ello.**

Hallazgo menor sin cambios: micro-variación de wording de área de servicio entre footer y `/contacto` ("Sevilla y área metropolitana" vs. "Sevilla, España" / "Sevilla y su área metropolitana").

---

## 9. Backlinks y autoridad — Datos insuficientes (Tier 0, reportado, no ponderado)

Fuente: `findings/backlinks.md`.

Sin API de Moz/Bing configurada. Common Crawl no tiene el dominio indexado (`in_crawl: false`). Verificación manual de los 2 candidatos más probables (adfsevilla.com, arkadycelebraciones.es): **ninguno enlaza de vuelta**. 0 de 7 factores de la fórmula de scoring con dato positivo real — siguiendo la política del propio skill, no se emite una puntuación numérica. Sin cambios respecto al 21-09 (no se ha ejecutado outreach). Ya cubierto por SEO-13 en el backlog anterior; sin tarea nueva.

---

## Apéndice — alcance y método de cada especialista

Ver cada archivo en `findings/` para el detalle completo de evidencia, URLs verificadas y limitaciones declaradas por especialista. Ningún hallazgo de este informe introduce cifras, rankings, reseñas o backlinks no reportados textualmente por los 11 informes originales.
