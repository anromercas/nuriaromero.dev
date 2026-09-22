# Corregir solape del botón flotante de WhatsApp con el CTA del hero
- **ID:** SEO-17
- **Prioridad:** High
- **Estado:** resuelto (2026-09-22)
- **Fuente:** [visual.md](../findings/visual.md), hallazgo 3.1
- **Scope:** componente del botón flotante de WhatsApp (home, hero mobile)

## Problema
A 360px de ancho (el Android más común), el botón flotante circular de WhatsApp (fixed, 48×48px, esquina inferior derecha) se superpone visualmente sobre el botón pill "Ver qué puedo hacer por tu negocio": tapa literalmente parte del texto ("...negocio" queda oculto bajo el círculo verde). Geometría confirmada por DOM: botón flotante `top:736 left:296 bottom:784 right:344` vs. CTA `top:754 left:16 right:343` — se solapan ~30px verticalmente y ~48px horizontalmente. Confirmado con captura de pantalla real (`home-360-fold-nocookie-v2.png`).

A 390/414px el botón flotante queda pegado al borde inferior sobre contenido de scroll (menos grave, sin tapar CTA). A 1440px desktop no hay solapamiento.

Esto ya se señalaba como riesgo teórico en la auditoría del 21-09 (hallazgo 3.1, "riesgo en viewports algo más estrechos") pero no se aplicó margen de seguridad suficiente; ahora está confirmado con evidencia visual real.

## Impacto
Alto: en 360px el usuario puede pulsar por error el botón flotante pensando que pulsa el CTA principal (o viceversa), y visualmente se percibe como un defecto de maquetación en el fold, justo donde el negocio necesita conversión.

## Objetivo
Eliminar el solapamiento visual en el rango mobile, priorizando 360px.

## Criterios de aceptación
- Sin solapamiento geométrico entre el botón flotante y ningún CTA del hero en 360/390/414px (verificado con `getBoundingClientRect`).
- Sin overflow horizontal introducido por el cambio (`scrollWidth === clientWidth` en los 4 viewports).
- El CTA de WhatsApp inline del hero sigue siendo el mecanismo principal de contacto por WhatsApp; si se decide ocultar/atenuar el flotante cuando el hero está en viewport, no debe desaparecer de otras secciones de scroll.

## Recomendación técnica (del hallazgo original)
En mobile, cuando el hero con sus CTAs está en viewport, ocultar u opacar el botón flotante de WhatsApp (ya existe un CTA de WhatsApp inline en el propio hero, es redundante mostrarlo también flotante ahí), o aumentar el `padding-bottom`/margen de seguridad del bloque de CTAs del hero para que el flotante no pueda invadir su área táctil.

## Checks sugeridos
- Captura y geometría DOM con Playwright en 360/390/414/1440px tras el cambio (mismo método que `visual.md`).
- Verificación manual táctil en un dispositivo o emulador real a 360px.

## No hacer
No eliminar el botón flotante de WhatsApp de otras secciones del sitio (solo el conflicto puntual con el hero). No introducir un nuevo mecanismo de contacto no solicitado.

## Resolución (2026-09-22)

**Cambio en `src/components/WhatsAppButton.astro`:** el botón flotante se oculta (`display:none`, vía una clase que se activa/desactiva desde un `IntersectionObserver`) mientras el CTA del hero de la home (`[data-seo12-primary-cta]`, el `<nav>` que contiene "Cuéntame tu negocio por WhatsApp" y "Ver qué puedo hacer por tu negocio") está en el viewport, y solo por debajo de 768px de ancho (`matchMedia("(max-width: 767px)")`). Se eligió esta opción (ocultar) en vez de ampliar el padding/margen del bloque de CTAs del hero porque el botón flotante es `position: fixed` — su posición en viewport no se mueve al añadir espaciado al contenido, así que un ajuste de márgenes no podía garantizar ausencia de solape ante futuros cambios de copy del hero, mientras que ocultarlo mientras el CTA de WhatsApp del propio hero ya está visible elimina el solape de forma robusta y es coherente con que mostrar los dos a la vez es redundante. No existía lógica de scroll/`IntersectionObserver` previa en el proyecto para extender; se añadió una nueva, con guarda defensiva (`if (!floatingButton || !heroCta || !("IntersectionObserver" in window)) return`) que la hace no-op en el resto de páginas (no tienen `[data-seo12-primary-cta]`) y en navegadores sin soporte (el botón se comporta como antes). Se usa `display:none` (no solo `opacity:0`) para que `getBoundingClientRect()` también deje de solaparse geométricamente, no solo visualmente.

**RED (antes del fix, Playwright/Python contra `dist` servido localmente, componente revertido temporalmente con `git stash`):**
- 360px: botón flotante `top:736 left:296 right:344 bottom:784` vs. CTA del hero `top:680 left:16 right:344 bottom:788` — solape geométrico `True` (coincide con el hallazgo original; los píxeles exactos difieren ligeramente del audit por entorno/fuentes, pero el patrón de solape es el mismo).
- 390/414/1440px: sin solape (coincide con el hallazgo original).

**GREEN (después del fix, mismos 4 viewports):**
- 360/390/414px: el botón flotante colapsa a `top:0 left:0 right:0 bottom:0` (`display:none`) mientras el CTA del hero está en viewport — solape `False`. Reaparece (`display:flex`) tras hacer scroll ~1500px más allá del hero.
- 1440px: el botón flotante no se ve afectado (sigue `display:flex` en su posición habitual) — sin solape, como en el hallazgo original.
- Sin overflow horizontal introducido en ninguno de los 4 viewports (`document.documentElement.scrollWidth === document.documentElement.clientWidth`), tanto en RED como en GREEN.
- Verificado en `/contacto/` y `/sobre-mi/` que el botón flotante se sigue mostrando con normalidad (`display:flex`) — el cambio es específico del hero de la home, no global.
- El CTA de WhatsApp inline del hero ("Cuéntame tu negocio por WhatsApp") no se modificó y sigue siendo el mecanismo principal de contacto visible en esa sección.

**Regresión:** `npm run build` (0 errores) + `check:seo-02` a `check:seo-14` (11 checks) sobre el `dist` fresco — todos pasaron sin necesidad de tocar ningún checker. `git diff --check` limpio. Verificación con Playwright (Python, `playwright==1.60.0`, ya instalado), mismo método ad-hoc que SEO-16, no incorporado como script permanente del proyecto.

**Pendiente/fuera de alcance:** ninguno de los criterios de aceptación queda abierto. No se tocó el resto de tareas pendientes (SEO-18 a SEO-26) ni se introdujo un nuevo mecanismo de contacto.
