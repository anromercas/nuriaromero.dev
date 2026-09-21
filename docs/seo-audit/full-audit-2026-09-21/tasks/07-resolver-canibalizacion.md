# Resolver canibalización y solapes de intención
- **ID:** SEO-07
- **Prioridad:** P1
- **Estado:** pendiente
- **Fuente:** [cluster.md](../findings/cluster.md), hallazgos 1, 2, 4, 5 y propuesta; [content.md](../findings/content.md), hallazgo 3; [geo.md](../findings/geo.md), sección 6; [sxo.md](../findings/sxo.md), sección 2
- **Scope:** Decisiones de intención y contenido para blog vs servicio GEO/SEO local, precio vs servicio y comercios vs tienda online, además de FAQs sectoriales.

## Problema
Hay riesgo de competencia interna latente: FAQ SEO local repetida en cuatro nichos, solape blog–servicio sobre GEO, y pares de páginas con intención próxima. El informe cuantifica el riesgo estructural, pero no demuestra todavía pérdida de rankings.

## Objetivo
**Riesgo operativo:** Cambiar o fusionar URLs sin evidencia puede borrar cobertura útil o generar nuevas ambigüedades.

Asignar una intención primaria y un rol editorial a cada URL afectada, reduciendo solapes sin eliminar información útil ni prometer resultados de posicionamiento.

## Criterios de aceptación
- Se documenta una matriz URL → intención primaria → keyword/tema principal → CTA.
- Las FAQs repetidas dejan de competir por la misma formulación o se sustituyen por preguntas sectoriales justificadas.
- Blog y servicio GEO tienen funciones distintas y enlaces recíprocos con anchors coherentes.
- Se toma una decisión explícita para comercios vs tienda y precio vs servicio.
- No se afirma que la canibalización haya sido resuelta mediante rankings no medidos.

## Dependencias y decisiones abiertas
Decisiones humanas abiertas: cuál es la oferta prioritaria, si `/tienda-online-sevilla/` es un servicio distinto, y qué contenido debe vivir en blog o landing. Depende de SEO-05 y SEO-06. Requiere datos de GSC para validar después, cubierto por SEO-14.

## Checks sugeridos
- Revisión de títulos, H1, headings, canonicals, enlaces y FAQs.
- Matriz de similitud antes/después.
- Consulta de GSC por URL/query si se dispone.
- Crawl para verificar que cada intención tiene una ruta clara.

## No hacer
No fusionar ni redirigir URLs solo por similitud textual, no borrar FAQs sin preservar la respuesta útil y no declarar canibalización confirmada sin evidencia de consultas/URLs competidoras.
