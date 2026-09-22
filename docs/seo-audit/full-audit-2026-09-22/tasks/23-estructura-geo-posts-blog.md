# Estructura GEO en el resto del blog: formato pregunta, respuesta corta y contenido multi-modal
- **ID:** SEO-23
- **Prioridad:** Medium
- **Estado:** hecho (2026-09-22)
- **Fuente:** [geo.md](../findings/geo.md), hallazgos 4 y 5
- **Scope:** `src/content/blog/como-aparecer-en-google-maps-negocio-sevilla.md`, `src/content/blog/cuanto-cuesta-una-pagina-web-en-sevilla.md`, `src/content/blog/pagina-web-para-restaurantes-que-necesita.md`, `/seo-local-sevilla/` (tabla comparativa)

## Problema
Dos gaps de estructura/profundidad GEO, ambos sin cambios desde el 21-09:

1. **H2 sin formato pregunta y sin bloque "respuesta corta" (Baja-Media):** el post GEO ya tiene H2 cerca del formato pregunta (sin `¿...?` literal) y sección "Respuesta corta" al inicio. Los otros 3 posts (`Paso 1: crea o reclama tu ficha`, `En qué no gastar`, etc.) están aún más lejos del formato pregunta y **ninguno tiene bloque de respuesta corta**.
2. **Sin contenido multi-modal (Media):** ningún post de blog ni ninguna de las 9 páginas con `FAQPage` tiene imagen editorial propia, tabla de datos ni vídeo. Solo iconografía decorativa y una `og:image` genérica compartida.

## Impacto
Medio: reduce la citabilidad y profundidad percibida por asistentes de IA, especialmente en los 3 posts con mayor potencial de tráfico informacional (precio, Google Maps, restaurantes).

## Objetivo
1. Reescribir los H2 del post GEO en formato interrogativo explícito (`¿...?`) y replicar el patrón "respuesta corta" + preguntas en los 3 posts restantes.
2. Añadir al menos una tabla comparativa citable (p. ej. SEO local vs. GEO, o los 2 tiers de precio) en el post GEO y en `/seo-local-sevilla/` — contenido citable de bajo coste que no requiere producción audiovisual.

## Criterios de aceptación
- Los 3 posts restantes tienen un bloque de "respuesta corta" al inicio, de 1-2 frases autocontenidas.
- H2 del post GEO reescritos en formato pregunta.
- Al menos 1 tabla de datos citable en el post GEO y 1 en `/seo-local-sevilla/`, con datos reales (precios/niveles ya documentados en `.agents/product-marketing-context.md`, sin cifras nuevas inventadas).
- `npm run check:seo-08` sigue en verde.

## Checks sugeridos
```bash
npm run check:seo-08
```
- Revisión manual de que la tabla no introduce ningún claim prohibido (posición, velocidad exacta, garantías).

## No hacer
No inventar cifras, plazos ni promesas de resultado en las tablas nuevas. No producir vídeo o infografía en esta tarea (esfuerzo medio-alto, fuera de alcance; ver recomendación de `geo.md` como paso futuro si se graba contenido real).

## Evidencia (2026-09-22)

**H2 antes/después (muestra):**
- GEO: "Cuatro cosas que puedes hacer ya" → "¿Qué cuatro cosas puedes hacer ya?"
- Google Maps: "Paso 1: crea o reclama tu ficha" → "¿Cómo creo o reclamo mi ficha de Google Business Profile?"
- Precio web: "Las 5 preguntas que debes hacer antes de contratar" → "¿Qué preguntas debo hacer antes de contratar una web?"
- Restaurantes: "Lo imprescindible" → "¿Qué es imprescindible en la web de un restaurante?"

Todos los H2 de los 4 posts reescritos a formato `¿...?`, salvo el H2 "Respuesta corta" del post GEO (se mantiene literal porque `check:seo-08` valida ese heading exacto). Los 3 posts restantes tienen ahora un bloque "Respuesta corta" de 1-2 frases al inicio, parafraseando contenido ya existente en el propio post — sin datos nuevos.

**Tabla 1 — post GEO ("¿En qué se diferencian el SEO local y el GEO?"):**

| Aspecto | SEO local | GEO |
| --- | --- | --- |
| Qué optimiza | Que tu negocio aparezca en Google Maps y en la búsqueda clásica de tu zona | Que un asistente de IA (ChatGPT, Perplexity, AI Overviews) pueda entender tu negocio y, si corresponde, citarlo |
| Dónde se nota | Google Maps y los resultados locales de la búsqueda tradicional | Las respuestas redactadas por asistentes de inteligencia artificial |
| Qué necesita como base | Ficha de Google Business Profile completa y NAP coherente | Información clara y bien estructurada, con FAQs y datos estructurados |
| Qué no garantiza ninguno de los dos | Una posición concreta en Google | Que un asistente te mencione en su respuesta |

**Tabla 2 — `/seo-local-sevilla/` (Básico vs. Competitivo):**

| | Básico | Competitivo |
| --- | --- | --- |
| Precio | Desde 199 €/mes | Desde 349 €/mes |
| Contenido optimizado al mes | 1 pieza | 2-3 piezas |
| Recomendado para | Sectores con poca competencia en tu zona | Sectores y zonas más disputados en Sevilla |
| Compromiso mínimo sugerido | 3 meses | 3 meses |

Todas las cifras de la tabla 2 vienen literalmente de `src/data/services.ts` (`seoLocal.pricing`), cruzadas con `.agents/product-marketing-context.md`. Ninguna cifra, plazo o promesa de resultado inventada en ninguna de las dos tablas.

**Checks:** `npm run build` + `check:seo-02` a `check:seo-14` (11 checks) en verde sobre `dist` fresco, incluido `check:seo-08` (heading "Respuesta corta" del GEO + estructura FAQ). Requirió actualizar `src/data/seo-intents.ts` (`contentSignals` de `check:seo-07` referenciaban el texto literal de 2 H2 renombrados). `git diff --check` limpio.
