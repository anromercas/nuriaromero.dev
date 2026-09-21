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
