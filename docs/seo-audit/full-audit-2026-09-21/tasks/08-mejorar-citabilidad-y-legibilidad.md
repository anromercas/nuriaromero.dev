# Mejorar citabilidad y legibilidad del contenido
- **ID:** SEO-08
- **Prioridad:** P2
- **Estado:** parcial
- **Fuente:** [content.md](../findings/content.md), hallazgo 4; [geo.md](../findings/geo.md), secciones 2 y 3
- **Scope:** FAQs de servicios/nichos y post GEO, incluyendo estructura de párrafos, respuestas directas y enlaces absolutos cuando el contenido se extrae fuera de contexto.

## Problema
Las respuestas FAQ contienen frases y párrafos largos para el avatar objetivo y para extracción/citación. El contenido GEO incluye URLs relativas que pierden contexto fuera de la página.

## Objetivo
**Riesgo operativo:** Acortar sin criterio puede eliminar matices; no actuar mantiene barreras de lectura y extracción.

Hacer que las respuestas importantes sean escaneables, autocontenidas y citables, manteniendo precisión, matices legales y la voz profesional.

## Criterios de aceptación
- Las FAQs relevantes empiezan con una respuesta directa y después aportan contexto.
- Se dividen párrafos largos y se mantienen términos comprensibles para el avatar objetivo.
- Los enlaces que deban conservar contexto fuera de la página usan URLs absolutas o una alternativa equivalente verificable.
- No se alteran claims, precios ni datos legales sin fuente.
- La estructura de headings del post y páginas sigue siendo semántica.

## Dependencias y decisiones abiertas
Coordinar con SEO-07 para evitar reescribir contenido que se eliminará por solape. Decidir qué enlaces requieren ser absolutos por citabilidad y cuáles pueden permanecer relativos por UX.

## Checks sugeridos
- Lectura editorial en móvil.
- Extracción de fragmentos y revisión de autonomía sin contexto.
- Validación de enlaces absolutos y ausencia de enlaces rotos.
- Validación de FAQ schema tras cambios.

## No hacer
No escribir para snippets con frases artificiales, no saturar keywords, no eliminar matices por acortar y no presentar una citación de IA como garantía de visibilidad.

## Implementación local (2026-09-21)
- El componente compartido de FAQ separa automáticamente la primera oración como respuesta directa destacada y deja el contexto en un segundo párrafo, sin modificar los datos fuente ni el contenido del schema.
- El post GEO incorpora una sección inicial de respuesta corta, definiciones más escaneables, una lista ordenada de acciones y enlaces absolutos a los dos servicios relacionados.
- `scripts/check-seo-08.mjs` valida el heading de respuesta corta, la lista, los enlaces absolutos, la estructura de las 98 FAQs renderizadas y la correspondencia entre FAQs visibles y `FAQPage` schema.
- Verificación local: `npm run check:seo-08` (build correcto: 22 páginas, 0 errores, 0 warnings, 1 hint preexistente; checker SEO-08 correcto). El hint pertenece a `src/components/seo/Schema.astro` y no lo introduce esta tarea.

## Pendiente
- Revisión editorial humana en móvil para confirmar ritmo, matices y comprensión del avatar antes de publicar.
- Verificación de enlaces contra el entorno desplegado; la comprobación local valida la forma absoluta y el build, pero no acredita disponibilidad remota.
