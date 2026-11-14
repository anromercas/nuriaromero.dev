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

## Validación de producción en móvil (2026-11-14, NRD-19 / NRD-42)

**Método.** Chrome estable en modo headless, controlado con `playwright-core@1.49.1` (canal `chrome`), viewport 375x812, DPR 3, `isMobile` y `hasTouch`, sobre producción. Las capturas se guardaron fuera del repo (no se adjuntan a la historia desde esta ejecución). No es una revisión visual humana en dispositivo real: lo marcado como "pendiente QA" necesita ojo humano.

### `/seo-local-sevilla/` (acordeón `<details>/<summary>` + `FAQPage`)

- Scroll horizontal: **ninguno** (`scrollWidth` = `clientWidth` = 375, también con las 9 FAQ abiertas). Los únicos elementos que sobrepasan 375 px son el menú móvil fuera de pantalla (`fixed`, oculto) y SVG decorativos, sin efecto en el scroll.
- Táctil: las 9 FAQ abren con `tap` y se cierran con un segundo `tap`. Zona táctil de cada `summary`: 341x63 o 341x85 px.
- Teclado: las 9 FAQ se abren con Enter (impares) y Espacio (pares) sobre el `summary` enfocado, avanzando con Tab. En las FAQ 2 a 9 el foco es `:focus-visible` con `outline` sólido de 2 px (`rgb(56, 189, 248)`). En la FAQ 1 el foco se puso por script, por lo que `:focus-visible` no se activó: **pendiente QA** comprobar a mano el foco visible de la primera FAQ con Tab desde la página.
- Primera frase = respuesta directa (la frase en negrita responde a la pregunta; juicio del auditor, revisión editorial humana pendiente): 9/9. Ejemplos: "¿Eres una agencia de SEO local?" -> "No."; "¿Necesito tener web?" -> "No para trabajar el plan Local.".
- Coincidencia con `FAQPage`: **9 preguntas visibles y 9 en JSON-LD**; `Question.name` igual a la pregunta visible (9/9) y `acceptedAnswer.text` igual al texto visible (frase destacada + párrafos de contexto unidos con un espacio) (9/9). Sin diferencias.

### `/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/`

- Scroll horizontal: **ninguno** (375/375). La tabla comparativa de "¿En qué se diferencian el SEO local y el GEO?" mide 341 px, igual que su contenedor: no desborda; las columnas son estrechas y el texto se parte en muchas líneas (legible, sin recorte). Mejora de legibilidad opcional, no defecto.
- Cada encabezado en forma de pregunta (más "Respuesta corta") va seguido de un párrafo cuya primera frase responde, o de una lista cuyo primer punto responde (juicio del auditor): "Respuesta corta", "¿Qué es el SEO local?", "¿Qué es el GEO...?", "¿En qué se diferencian...?" (la frase introduce la tabla: misma base, lectores distintos), "¿Por qué importa el GEO ahora?", "¿Qué cuatro cosas puedes hacer ya?" (lista ordenada) y "¿Prefieres que te lo monte alguien?" (la primera frase aclara que no hace falta contratar a nadie, la oferta viene después). Sin defectos.
- **Observación (no es defecto, no se abre seguimiento):** la entrada no tiene acordeón (0 `<details>`) ni `FAQPage`; el JSON-LD servido es `ProfessionalService`/`Organization`, `WebSite`, `Article` y `BreadcrumbList`. Añadir `FAQPage` a los posts sería un candidato SEO nuevo para el PO.

### Resumen

- Defectos de esta comprobación: ninguno.
- Pendiente QA en navegador real: foco visible de la primera FAQ con Tab, pulsación táctil en dispositivo físico, y revisión visual de que el banner de cookies (inferior) no tape el contenido durante la lectura.
