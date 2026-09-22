# Dividir respuestas de FAQ largas en bloques escaneables
- **ID:** SEO-20
- **Prioridad:** Medium
- **Estado:** hecho (2026-09-22)
- **Fuente:** [content.md](../findings/content.md), hallazgo 2
- **Scope:** `src/data/niches.ts`, `src/data/services.ts`, `src/components/services/FAQ.astro` (layout, si hace falta)

## Problema
Las respuestas de FAQ siguen en bloques únicos de 100-130+ palabras sin subdivisión, listas ni negrita más allá de la primera frase (que ya se resalta correctamente desde SEO-08). Ejemplos confirmados en producción: "¿Cómo tratáis los datos de los pacientes?" (clínicas, 2 párrafos densos), "¿Me ayudas también con las reseñas de Google?" (restaurantes), varias FAQs de comercios/abogados. Mismo patrón que en la auditoría del 21-09, sin cambios.

## Impacto
Medio: dificulta la lectura rápida en móvil para el avatar objetivo (35-55 años, no nativo digital) y reduce la citabilidad literal por asistentes de IA más allá de la primera frase.

## Objetivo
Mantener la respuesta directa ya resaltada en la primera frase (funciona bien, no tocar) y dividir el resto en 2 párrafos cortos o listas cuando el layout del componente FAQ lo permita, priorizando las FAQs transaccionales (precio, plazo) sobre las legales/técnicas que necesitan más matiz.

## Criterios de aceptación
- Las FAQs de precio y plazo en las 4 páginas de nicho y en los servicios principales quedan en frases de longitud escaneable (idealmente <60 palabras por bloque, con subdivisión donde el contenido lo permita).
- La primera frase de respuesta directa (ya resaltada) no se toca en su función, solo el contexto que sigue.
- Sin pérdida de información legal/técnica relevante en las FAQs de sectores regulados (RGPD, deontología).
- `npm run check:seo-08` sigue en verde (valida build, conteo de FAQs, `FAQPage` schema y enlaces).

## Checks sugeridos
```bash
npm run check:seo-08
```
- Revisión manual de longitud de párrafo (palabras por bloque) antes/después en una muestra representativa.

## No hacer
No resumir hasta perder matices legales importantes (RGPD, deontología profesional). No tocar la mecánica de respuesta directa ya implementada en SEO-08.

## Evidencia (2026-09-22)
- **Componente:** `FAQ.astro` no soportaba varios párrafos de contexto (siempre un único `<p>`), así que fue necesario un cambio mínimo: `splitAnswer()` ahora separa el contexto por `\n\s*\n` en un array de párrafos, y la plantilla renderiza uno `<p>` por elemento. FAQs sin `\n\n` en los datos se renderizan exactamente igual que antes (0 cambio visual, verificado con `check:seo-08` sobre las FAQs no tocadas).
- **20 FAQs reestructuradas** (solo se insertó `\n\n` entre frases ya existentes, sin reescribir contenido ni añadir cifras/afirmaciones nuevas):
  - Transaccionales (precio/plazo), las 18 prioritarias del scope: restaurantes, clínicas, comercios y abogados (precio); diseño web (precio, plazo, "incluye 399 €"); software a medida (precio, plazo); automatizaciones (precio, plazo); IA (precio, plazo); SEO local (precio, "incluye proyecto inicial 299 €", plazo); tienda online (precio, plazo).
  - 2 ejemplos confirmados explícitamente en el "Problema" de este documento, aunque no son transaccionales: restaurantes "¿Me ayudas también con las reseñas de Google?" y clínicas "¿Cómo tratáis los datos de los pacientes?" (RGPD — dividido solo en los límites de frase existentes, sin perder matiz legal).
- **Omitidas (prioridad baja, pendiente de una futura pasada):** el resto de FAQs de nicho/servicio (~58), incluida la FAQ de deontología de abogados ("¿Hay límites para la publicidad...?") y otras FAQs legales/técnicas no transaccionales. Siguen en un único bloque de 70-130 palabras; no se forzó su división para no arriesgar el alcance de esta tarea.
- **Verificación de longitud:** script Node/tsx que reimplementa la lógica exacta de `splitAnswer()` sobre los datos reales confirma que los 20 bloques reestructurados quedan en ≤62 palabras por párrafo (la mayoría 20-60), frente a los 73-160 originales de un único bloque.
- **Checks:** `npm run build` (0 errores) → `check:seo-08` (98 FAQs, mismo recuento que antes) → barrido completo `check:seo-02` a `check:seo-14` (11 checks) sobre `dist` fresco, todos en verde, incluyendo `check:seo-05` y `check:seo-07`. `git diff --check` limpio.
