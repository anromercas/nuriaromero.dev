# Backlink Profile — nuriaromero.dev (auditoría 2026-09-21)

**Tier de datos: 0 — Basic (Common Crawl + Verify only).** No hay API key de Moz ni de Bing Webmaster Tools configurada (`backlinks_auth.py --check --json` confirmado antes de esta sección). Por tanto **no existe ninguna fuente fiable de Domain Authority, Page Authority, Spam Score, recuento real de dominios referentes ni distribución de anchor text** para este dominio. Todo lo que sigue son los únicos dos tipos de evidencia disponibles en tier 0: (a) métricas de grafo de Common Crawl y (b) verificación directa por crawler de los pocos enlaces candidatos identificables desde el propio sitio.

## Resumen ejecutivo

No se ha podido confirmar la existencia de **ningún backlink externo real** hacia nuriaromero.dev con las fuentes disponibles. El dominio no aparece en el índice de Common Crawl consultado, y los dos únicos sitios de terceros enlazables desde el propio portfolio (los dos casos de cliente) no muestran, en las páginas verificadas, ningún enlace de vuelta. Esto es coherente con un sitio personal/portfolio joven, no es necesariamente una señal de mal SEO, pero implica que el perfil de backlinks es, a día de hoy, prácticamente inexistente y depende por completo de acciones futuras de link building.

## 1. Common Crawl — métricas de dominio

**Fuente:** `commoncrawl_graph.py nuriaromero.dev --json` (release `cc-main-2026-jan-feb-mar`, dato cacheado del 2026-09-16). **Confianza: 0.50** (nivel de dominio, no de URL; y en este caso ni siquiera hay dato positivo).

| Métrica | Valor |
|---|---|
| `in_crawl` | `false` |
| `in_rankings` | `false` |
| PageRank | `null` |
| Harmonic centrality | `null` |
| Dominios referentes (muestra) | 0 |

**Interpretación correcta (importante para no malinterpretar el dato):** `in_crawl: false` significa que Common Crawl **no ha encontrado el dominio en su rastreo**, no que tenga cero backlinks confirmados. Common Crawl es una muestra parcial de la web (no un índice exhaustivo tipo Google), actualizada trimestralmente, y sistemáticamente falla en cubrir dominios nuevos, de bajo tráfico o `.dev` poco enlazados. Esta ausencia es evidencia débil-indirecta de "pocos o ningún backlink de dominios que sí están bien crawleados", pero **no es una prueba concluyente de cero backlinks**. No se puede derivar un PageRank, centralidad ni lista de dominios referentes de este dato porque no existen en la fuente.

## 2. Verificación directa de backlinks candidatos

Al no haber ninguna lista conocida de backlinks entrantes, se identificaron los únicos dos enlaces salientes hacia dominios de terceros controlados por clientes reales del negocio (los dos casos de estudio mostrados en la home de nuriaromero.dev), como candidatos más probables a un enlace de vuelta (reciprocidad habitual en relaciones freelancer-cliente):

- `https://adfsevilla.com/` — cliente "Adf Sevilla" (WordPress, administración de fincas), enlazado desde la home con anchor "Preview".
- `https://arkadycelebraciones.es/` — cliente "Arkady Celebraciones" (SPA en React/Vite con SSG), enlazado igual.

**Verificación con `verify_backlinks.py --target https://nuriaromero.dev`:**

| Dominio origen candidato | HTTP status | ¿Enlace a nuriaromero.dev encontrado? | Método |
|---|---|---|---|
| adfsevilla.com | 200 | No | Fetch HTTP directo (sitio estático/WordPress, contenido completo en el HTML crudo) |
| arkadycelebraciones.es | 200 | No | El crawler automático lo marcó `unverifiable_js` (SPA), pero se verificó manualmente: el HTML es **pre-renderizado (SSG, `data-server-rendered="true"`)**, así que el contenido completo (nav, footer, página "Sobre Nosotros") sí está presente en el fetch crudo. No aparece ninguna mención a `nuriaromero.dev` ni "Nuria Romero" en home, footer ni `/sobre-nosotros`. |

**Confianza: 0.90** para ambos resultados (evidencia directa por fetch HTTP + inspección manual del HTML, no solo el veredicto automático del script). No se puede descartar al 100% un enlace en alguna página interna no revisada (ej. una página de "créditos" no enlazada desde el menú), pero en las páginas donde razonablemente se esperaría un crédito de autoría (home, footer, sobre nosotros) no existe.

**Nota sobre el script automático:** para `arkadycelebraciones.es` el script clasificó el resultado como `unverifiable_js` por detección genérica de SPA, pero en este caso concreto sí era verificable porque el sitio usa SSG y sirve HTML completo sin necesidad de ejecutar JS. Se señala esto explícitamente para no dejar una limitación de la herramienta pasar como limitación de los datos.

## 3. Otras fuentes de tier 0 exploradas (sin resultado)

Se intentó además una búsqueda de menciones externas del dominio mediante fetch directo a buscadores públicos (DuckDuckGo HTML, Bing HTML) para detectar cualquier mención textual de "nuriaromero.dev" fuera del propio sitio. DuckDuckGo devolvió explícitamente "No results found". Bing no devolvió resultados extraíbles en HTML estático (su SERP actual depende de JS/Copilot). Este intento **no sustituye una herramienta de backlinks real** (no distingue backlink de mención sin enlace, ni cubre motores no indexados vía scraping simple) y se reporta solo como diligencia adicional de tier 0, con **confianza muy baja (0.30)** y resultado nulo.

## Limitaciones explícitas de esta sección (tier 0)

- **No hay Domain Authority ni Page Authority** (requiere Moz, no configurado).
- **No hay Spam Score ni ratio de toxic links** (requiere Moz o DataForSEO).
- **No hay distribución real de anchor text** entrante (requiere Moz, Bing o DataForSEO).
- **No hay recuento fiable de dominios referentes** ni su calidad (Common Crawl no tiene al dominio indexado; sin Moz/Bing/DataForSEO no hay alternativa).
- **No hay dato de link velocity** (tendencia en el tiempo) — solo disponible con DataForSEO, no existente en ningún tier gratuito.
- **No hay ratio follow/nofollow** entrante.
- De los 7 factores de la fórmula de scoring ponderado del skill (dominios referentes, calidad de dominios, naturalidad de anchor text, ratio tóxico, velocidad, follow/nofollow, relevancia geográfica), **0 de 7 tienen dato positivo real** disponible en tier 0 para este dominio; solo se pudo verificar negativamente 2 backlinks candidatos concretos.

## Backlink Profile — Puntuación

**No se emite una puntuación numérica de 0-100 de confianza normal.** Siguiendo la política del propio skill para tier 0 ("fewer than 4 scoring factors have data → report INSUFFICIENT DATA, not a numeric score"), y dado que aquí el recuento real es 0 de 7 factores con dato positivo:

> **Backlink Profile: DATOS INSUFICIENTES (no numérico).**
> Si se exige una referencia orientativa de bajo compromiso para comparar con el resto de categorías de esta auditoría: **15-25/100**, con **confianza baja (~0.3)**, basada exclusivamente en (a) ausencia en Common Crawl, (b) ausencia confirmada de enlace de vuelta en los 2 únicos casos de cliente verificables, y (c) la naturaleza esperable de un portfolio personal joven sin campaña de link building. Este rango **no debe tratarse como una puntuación real de autoridad** — es una estimación cualitativa de "perfil de backlinks prácticamente en cero", no una medición.

## Hallazgos

### 1. [Severidad: Media] Perfil de backlinks externo no verificable / probablemente inexistente

**Evidencia.** Ausencia en Common Crawl + 0 backlinks confirmados en los 2 candidatos más probables (case studies de cliente). No hay evidencia de directorios locales, prensa, colegios profesionales, ni enlaces de partners.

**Impacto.** Sin backlinks externos, la autoridad de dominio depende solo de señales on-page/técnicas (ya cubiertas en otras secciones de esta auditoría) y de EEAT interno. Para un negocio local que compite por "diseño web Sevilla", "SEO local Sevilla", etc., los backlinks locales relevantes suelen ser una palanca de ranking significativa que hoy no se está usando.

**Recomendación accionable (realista para esta etapa del negocio):**
1. **Reciprocidad con los 2 clientes ya reales** (adfsevilla.com, arkadycelebraciones.es): pedir explícitamente un enlace de crédito tipo "Web creada por Nuria Romero — nuriaromero.dev" en el footer o en una página de créditos/aviso legal. Es la oportunidad de menor esfuerzo y mayor relevancia temática (son clientes reales, ya existe relación).
2. **Directorios locales de Sevilla de calidad media-alta** (no farms de spam): Cámara de Comercio de Sevilla, asociaciones de autónomos/pymes sevillanas, directorios sectoriales de desarrollo web/diseño con moderación editorial. Priorizar los que pidan ficha con revisión manual (mejor señal que alta automática).
3. **Colegios/asociaciones profesionales** si aplica alguna afiliación real de la titular (ej. asociaciones de desarrolladoras, colectivos de mujeres en tech en Sevilla/Andalucía) — suelen ofrecer perfil de miembro con enlace de vuelta, y aportan relevancia temática + geográfica real, no genérica.
4. **Prensa local / medios digitales sevillanos**: nota de prensa o entrevista breve sobre el lanzamiento del servicio de SEO local para negocios de Sevilla (ángulo noticiable: "freelancer sevillana ayuda a pymes locales a aparecer en Google"). Un enlace de un medio local .es con audiencia real pesa más que decenas de directorios genéricos.
5. **Futuros casos de cliente**: incorporar la petición de enlace de crédito como parte del proceso estándar de entrega de cada proyecto nuevo (cláusula opcional en el contrato/onboarding), no solo pedirlo a posteriori.
6. No perseguir directorios genéricos de baja calidad ni intercambios de enlaces masivos — con Domain Rating actual probablemente muy bajo, un patrón de enlaces tóxicos sería más dañino que la ausencia total de enlaces.

### 2. [Severidad: Baja] No se puede auditar toxicidad ni naturalidad de anchor text por falta de fuente de datos

**Evidencia.** Tier 0 no incluye Spam Score ni distribución de anchor text.

**Recomendación.** No accionable hoy sin subir de tier. Si en el futuro se contratase Moz Pro (tier 1, ~99$/mes) o se activase Bing Webmaster Tools (tier 2, gratuito, solo requiere verificar propiedad del dominio), se recomienda repetir esta sección — Bing Webmaster Tools en particular es gratuito y ya debería estar activado como mínimo para Search Console-equivalente, independientemente del backlink audit.

## Frescura de los datos

- Common Crawl: dato cacheado del 2026-09-16, release trimestral `cc-main-2026-jan-feb-mar` — desactualización potencial de hasta ~3 meses.
- Verificación de backlinks candidatos: en tiempo real (fetch ejecutado el 2026-09-21).

## Recomendación de escalado

- Activar **Bing Webmaster Tools** cuanto antes: es gratuito, no requiere presupuesto, y desbloquea tier 2 (enlaces entrantes reales, no solo candidatos verificados manualmente).
- No se recomienda a día de hoy el gasto en Moz Pro ni DataForSEO dado el volumen de negocio actual; revisar cuando el número de clientes/case studies crezca lo suficiente para que el link building sea una prioridad de inversión.
- Para el análisis de contenido/E-E-A-T y de crawlabilidad técnica de estos mismos hallazgos de casos de cliente, ver los hallazgos ya cubiertos en `findings/content.md` (no se duplican aquí).
