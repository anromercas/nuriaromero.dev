# Diferenciar FAQ de precio casi duplicada y ampliar check-seo-07.mjs
- **ID:** SEO-19
- **Prioridad:** Medium
- **Estado:** resuelto (2026-09-22)
- **Fuente:** [cluster.md](../findings/cluster.md), hallazgos 1 y 2
- **Scope:** `src/data/niches.ts`, `src/data/services.ts`, `scripts/check-seo-07.mjs`

## Problema
Dos solapes de título/FAQ no cubiertos por el checker actual:

1. **Comercios ↔ Tienda online (Media-Alta, no detectado por el checker):** `/web-para-comercios-sevilla/` tiene la FAQ `"¿Cuánto cuesta una tienda online?"` (`niches.ts:283`) y `/tienda-online-sevilla/` tiene `"¿Cuánto cuesta una tienda online en Sevilla?"` (`services.ts:672`), con redacción y estructura de respuesta casi calcadas, ambas renderizadas como `FAQPage` JSON-LD. `scripts/check-seo-07.mjs` (líneas 34-48) solo compara preguntas duplicadas *entre las 4 rutas de nicho* (`intents.nicheRoutes`), nunca nicho vs. servicio, así que este par queda fuera del alcance del checker.
2. **Diseño web ↔ post de precio (Media, detectado pero sin resolver):** el H2/FAQ de precio en `/diseno-web-sevilla/` (`"Cuánto cuesta una página web en Sevilla"`, `services.ts:26,91`) sigue usando prácticamente el mismo titular que el post *"¿Cuánto cuesta una página web en Sevilla? Qué influye en el precio"*, pese a que la intención (comercial vs. informativo) y el enlace recíproco ya están documentados en `seo-intents.ts`.

## Impacto
Medio-Alto: riesgo de canibalización de keyword y de schema `FAQPage` duplicado en el par comercios/tienda-online; riesgo menor pero persistente en diseño-web/blog.

## Objetivo
Reescribir la pregunta y el enfoque de la FAQ de comercios para centrarse en la decisión "catálogo vs. tienda online completa" (ya es su enfoque real en la respuesta) sin repetir el titular "¿Cuánto cuesta una tienda online?". Reformular el H2/FAQ de `/diseno-web-sevilla/` a una formulación puramente transaccional (p. ej. "Precio de una página web en Sevilla: desde 149 €"), reservando la redacción "¿Cuánto cuesta...? Qué influye en el precio" en exclusiva para el post. Ampliar `check-seo-07.mjs` para comparar también preguntas de nicho contra las de servicio, no solo nicho contra nicho.

## Criterios de aceptación
- La pregunta de FAQ de comercios ya no coincide ni es casi idéntica a la de tienda online.
- El H2/FAQ de precio de `/diseno-web-sevilla/` usa una formulación distinta a la del post de blog.
- `scripts/check-seo-07.mjs` detecta duplicados nicho vs. servicio, no solo nicho vs. nicho (nueva cobertura, con test RED/GREEN demostrando que antes no lo detectaba).
- No se elimina información útil de ninguna de las dos FAQs, solo se diferencia la formulación.
- Precios reales sin cambios (399€ catálogo, tienda online sin precio público — presupuesto por alcance).

## Checks sugeridos
```bash
npm run check:seo-07
```
- RED: confirmar que la versión ampliada del checker falla contra el estado actual (par comercios/tienda-online sin diferenciar).
- GREEN: confirmar que pasa tras la reescritura.

## No hacer
No fusionar ni eliminar ninguna de las dos páginas ni de las dos FAQs. No declarar la canibalización resuelta mediante rankings no medidos (pendiente de validación GSC bajo SEO-14).

## Resolución (2026-09-22)

**1. Comercios ↔ Tienda online (`src/data/niches.ts`):**
- Antes: `q: "¿Cuánto cuesta una tienda online?"` → respuesta empezaba directamente por el precio del catálogo.
- Después: `q: "Catálogo o tienda online completa: ¿qué precio tiene cada opción?"` → la respuesta ahora abre con "Depende de cuál de las dos opciones elijas, porque son dos productos con alcance distinto." antes de dar los mismos dos precios (399 € catálogo; tienda online completa sin precio público, presupuesto por alcance). No se eliminó información, solo se antepuso el marco de decisión catálogo/tienda online completa que ya estructuraba la respuesta.

**2. Diseño web ↔ post de blog (`src/data/services.ts`):**
- H2 antes: `"Cuánto cuesta una página web en Sevilla"` → después: `"Precio de una página web en Sevilla: desde 149 €"` (formulación transaccional, no interrogativa).
- FAQ antes: `q: "¿Cuánto cuesta una página web en Sevilla?"` → después: `q: "¿Qué incluye el precio cerrado de una página web en Sevilla?"`. La redacción "¿Cuánto cuesta...? Qué influye en el precio" queda en exclusiva para `/blog/cuanto-cuesta-una-pagina-web-en-sevilla/`. La respuesta se reordenó (precio cerrado + qué incluye primero, rango de mercado 500-3.000 € después) sin quitar ningún dato.

**`scripts/check-seo-07.mjs`:** se añadió `serviceRoutes` a `src/data/seo-intents.ts` y una comparación nicho-vs-servicio (normalizando `"en Sevilla"` y puntuación, igualdad exacta tras normalizar). RED: contra el estado sin corregir, detectó el par comercios/tienda-online (`"¿Cuánto cuesta una tienda online?"` ~= `"¿Cuánto cuesta una tienda online en Sevilla?"`). GREEN: tras la reescritura, `npm run check:seo-07` pasa (32 niche FAQs comparadas contra 60 service FAQs, 0 errores).

**Regresión:** `npm run build` + `check:seo-02` a `check:seo-14` (11 checks) sobre el mismo `dist`, todos en verde, sin cambios adicionales a ningún checker. `git diff --check` limpio.
