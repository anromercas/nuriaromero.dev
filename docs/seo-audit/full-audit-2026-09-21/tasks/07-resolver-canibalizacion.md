# Resolver canibalización y solapes de intención
- **ID:** SEO-07
- **Prioridad:** P1
- **Estado:** parcial — controles editoriales y verificación local implementados; validación de consultas pendiente
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

## Implementación local (2026-09-21)

Se añadió `src/data/seo-intents.ts` como matriz explícita URL → intención primaria → tema/keyword → CTA para los pares con mayor riesgo:

| URL | Intención primaria | Tema principal | CTA |
| --- | --- | --- | --- |
| `/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/` | Informacional: entender GEO y aplicar una checklist | qué es el GEO para negocios en Sevilla | Leer el servicio si hace falta implementación técnica |
| `/seo-local-sevilla/` | Comercial: contratar implementación SEO local/GEO | servicio de SEO local y GEO en Sevilla | Pedir propuesta |
| `/blog/cuanto-cuesta-una-pagina-web-en-sevilla/` | Informacional: comparar variables de presupuesto | cuánto cuesta una página web y qué revisar | Usar la checklist y pedir valoración |
| `/diseno-web-sevilla/` | Comercial: contratar diseño/desarrollo web local | diseño web para negocios locales en Sevilla | Pedir propuesta web a precio cerrado |
| `/web-para-comercios-sevilla/` | Comercial: catálogo y presencia local de comercio físico | web para comercios de barrio en Sevilla | Pedir propuesta para comercio |
| `/tienda-online-sevilla/` | Transaccional: ecommerce con pago, productos y stock | tienda online con pasarela de pago en Sevilla | Pedir alcance y presupuesto ecommerce |

El blog GEO se mantiene educativo y enlaza al servicio con un anchor comercial; el servicio enlaza de vuelta con un anchor informacional. El artículo de precios conserva la comparación editorial y enlaza al servicio de diseño, que mantiene la conversión y el presupuesto. Comercio y tienda online quedan separados por catálogo/presencia local frente a checkout, stock y venta transaccional.

`scripts/check-seo-07.mjs` y `npm run check:seo-07` verifican títulos, meta descriptions, H1, señales de copy, ausencia de preguntas FAQ duplicadas entre las cuatro páginas de nicho y los dos pares de enlaces recíprocos. El control demuestra diferenciación estructural local, no que Google haya dejado de mostrar URLs competidoras.

## Pendiente

- GSC por URL/query para confirmar o refutar canibalización real (SEO-14); no se han inventado rankings ni impresiones.
- Aprobación comercial/editorial de la prioridad entre catálogo y tienda online y de la oferta SEO local/GEO; la matriz actual es un control determinista reversible, no una decisión comercial definitiva.
