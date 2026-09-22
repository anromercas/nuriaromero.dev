# Unificar la redacción del área de servicio (footer vs. /contacto)
- **ID:** SEO-26
- **Prioridad:** Low
- **Estado:** resuelto (2026-09-22)
- **Fuente:** [local.md](../findings/local.md), sección 2, hallazgo "[BAJO, sin cambios]"
- **Scope:** `src/components/Footer.astro`, página `/contacto`

## Problema
Micro-variación de wording de localidad, sin cambios desde el 21-09: el footer dice "Sevilla y área metropolitana, España"; `/contacto` combina "Sevilla, España" y "Sevilla y su área metropolitana" en distintos párrafos. No es una discrepancia de NAP real (mismo área geográfica, sin dirección de calle en juego), pero conviene fijar una única redacción canónica antes de replicarla en una futura ficha de GBP, donde el campo de área de servicio es más rígido.

## Impacto
Bajo: no afecta a NAP consistency de forma crítica hoy, pero es preparación necesaria antes de que exista una ficha de GBP (SEO-10, pendiente de decisión humana — esta tarea no depende de esa decisión, es independiente).

## Objetivo
Fijar una única frase canónica de área de servicio (p. ej. "Sevilla y su área metropolitana") y aplicarla de forma consistente en footer y `/contacto`.

## Criterios de aceptación
- Footer y `/contacto` usan exactamente la misma redacción de área de servicio.
- `areaServed` en JSON-LD (`City` + `AdministrativeArea`) no cambia — ya es correcto, esta tarea es solo de copy visible.
- `npm run check:seo-11` sigue en verde.

## Checks sugeridos
```bash
npm run check:seo-11
```
- Verificación visual en vivo del texto de footer y `/contacto`.

## No hacer
No cambiar `areaServed` en el schema (ya está correctamente enriquecido). No añadir barrios ni radios de servicio no verificados.

## Resolución (2026-09-22)

`/contacto` ya usaba la frase canónica sugerida ("Sevilla y su área metropolitana") en su párrafo de área de servicio; el footer no. Único cambio: `src/components/Footer.astro:54` — `{SITE.address.locality} y área metropolitana, España` → `{SITE.address.locality} y su área metropolitana`.

La línea de `/contacto`'s `<address>` ("Sevilla, España") se dejó intacta: es un campo de localidad/país distinto (formato dirección), no la frase de "área de servicio" que pide unificar el criterio de aceptación.

`areaServed` en `src/lib/schema.ts` usa la constante `SERVICE_AREA`, independiente de este texto visible — sin cambios, confirmado.

Verificación: build limpio (23 páginas), `check:seo-11` en verde (23 páginas, 10 servicios), barrido completo de los 11 checkers en verde, `git diff --check` limpio.
