# Implementar la arquitectura de enlazado interno
- **ID:** SEO-06
- **Prioridad:** P1
- **Estado:** pendiente
- **Fuente:** [cluster.md](../findings/cluster.md), secciones 3, 6 y 7; [content.md](../findings/content.md), hallazgo 7
- **Scope:** Enlaces entre home, servicios, nichos, precio, blog y contenido GEO/SEO local.

## Problema
La arquitectura actual no expresa con suficiente claridad qué página es hub y qué páginas son spokes. Se reparte autoridad entre páginas de servicio/nicho y faltan conexiones contextuales útiles; la auditoría propone un esquema hub-and-spoke.

## Objetivo
**Riesgo operativo:** Añadir enlaces sin mapa puede repartir autoridad de forma arbitraria y aumentar la confusión de intención.

Convertir la arquitectura propuesta en un mapa de enlaces interno comprensible, con enlaces contextuales y anchors descriptivos que ayuden a usuarios y crawlers.

## Criterios de aceptación
- Existe un mapa de enlaces aprobado para hubs, spokes, precio y posts.
- Cada página objetivo recibe enlaces internos contextuales desde las páginas definidas en el mapa.
- Los anchors describen el destino sin sobreoptimización ni repetición artificial.
- No se crean enlaces a páginas no publicadas ni se rompe el recorrido de conversión.
- El mapa distingue enlaces de navegación, contextuales y de conversión.

## Dependencias y decisiones abiertas
Decidir qué página será hub principal para cada intención y qué relación comercial debe tener `/diseno-web-sevilla/`, `/seo-local-sevilla/`, `/tienda-online-sevilla/` y `/web-para-comercios-sevilla`. Coordinar con SEO-02 y SEO-07.

## Checks sugeridos
- Crawl interno y tabla origen → destino → anchor.
- Comprobación de enlaces rotos y de redirects internos.
- Revisión manual de contexto y accesibilidad de anchors.
- Verificación del sitemap/canonicals tras cambios.

## No hacer
No enlazar todas las páginas con todos los anchors, no crear páginas puente sin contenido, no usar exact-match de forma mecánica y no confundir más enlaces con mejor arquitectura.

## Implementación local (2026-09-21)

**Estado: parcial, pendiente de aprobación comercial/editorial.** Se implementó un mapa explícito y verificable para el enlazado contextual. La relación entre las páginas de servicio y nicho queda propuesta en código, pero la decisión comercial definitiva sobre `/diseno-web-sevilla/`, `/seo-local-sevilla/`, `/tienda-online-sevilla/` y `/web-para-comercios-sevilla/` debe confirmarse junto con SEO-02 y SEO-07 antes de considerarla aprobada.

### Mapa aplicado

- **Navegación:** `Header` y `Footer` mantienen el recorrido global hacia servicios, páginas de nicho, blog, portfolio, sobre mí y contacto.
- **Hub home `/`:** enlaza contextualmente a las guías de GEO, Google Maps y precios; las tarjetas existentes enlazan a servicios y nichos. El bloque de precios conserva el recorrido de conversión hacia cada servicio.
- **Hubs de servicio:** cada una de las seis páginas de servicio enlaza solo a servicios complementarios, contenido editorial relacionado y contacto como conversión:
  - `/diseno-web-sevilla/` → SEO local, tienda online, guía de precios, contacto.
  - `/desarrollo-software-medida/` → automatizaciones, IA, contacto.
  - `/automatizaciones/` → software a medida, IA, contacto.
  - `/inteligencia-artificial/` → automatizaciones, SEO local, contacto.
  - `/seo-local-sevilla/` → diseño web, guías de Google Maps y GEO, contacto.
  - `/tienda-online-sevilla/` → comercio, diseño web, SEO local, contacto.
- **Spokes de nicho:** cada página de nicho enlaza a diseño web y SEO local; se añade la relación con tienda online para comercios/restaurantes y contacto cuando corresponde.
- **Posts:** cada post enlaza a su servicio o nicho principal, a una guía complementaria cuando aporta contexto y a contacto como conversión. Los anchors son descriptivos y varían por contexto.

El mapa fuente completo, incluyendo `kind: contextual|conversion`, está en `src/data/internal-links.ts`; `src/components/InternalLinks.astro` lo renderiza sin enlazar a rutas no publicadas.

### Evidencia y pendientes

- `npm run check:seo-06`: build Astro + checker interno; **22 páginas, 0 errores, 0 warnings y 1 hint preexistente** en `src/components/seo/Schema.astro`; checker: **15 orígenes mapeados y 22 HTML renderizados comprobados**.
- `git diff --check`: correcto.
- El checker valida que cada destino renderizado existe, que cada enlace del mapa aparece en su origen y que cada anchor descriptivo está presente; también recorre los enlaces internos con trailing slash del HTML generado para detectar destinos inexistentes.
- Pendiente: revisión manual de contexto/accesibilidad y aprobación de las relaciones comerciales abiertas; no se inventan datos externos ni se declaran métricas de autoridad.
