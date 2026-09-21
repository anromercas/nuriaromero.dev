# Mejorar UX mobile above-the-fold y recopilar prueba visual
- **ID:** SEO-12
- **Prioridad:** P1
- **Estado:** parcial — implementación local completada; validación visual de navegador pendiente
- **Fuente:** [visual.md](../findings/visual.md), secciones 1 y 3; [sxo.md](../findings/sxo.md), fricción de conversión
- **Scope:** Hero mobile de la home, banner de cookies y posible proximidad del WhatsApp flotante al texto. No incluye rehacer el patrón FAQ que la auditoría considera correcto.

## Problema
En 390×844, el CTA de la home queda fuera del primer viewport por la combinación de H1 y dos párrafos. El banner de cookies cubre gran parte del fold en primera visita y el botón flotante queda cerca del copy, aunque no se observó solape real.

## Objetivo
**Riesgo operativo:** No actuar mantiene el CTA fuera del primer viewport y el consentimiento como barrera de primera visita.

Hacer visible una acción principal en el primer viewport mobile y reducir la obstrucción del consentimiento, conservando legibilidad, accesibilidad y cumplimiento legal.

## Criterios de aceptación
- En viewport 390×844 sin cookies previas, el CTA principal de la home es visible sin scroll.
- En primera visita, el banner no oculta simultáneamente H1 y CTA; sus controles siguen siendo claros y utilizables.
- No hay solape entre WhatsApp flotante y contenido en 360px, 390px y 414px representativos.
- Desktop mantiene el above-the-fold y las páginas de nicho no pierden sus CTAs visibles.
- Se conservan los textos legales y la posibilidad real de aceptar/rechazar según la configuración vigente.

## Dependencias y decisiones abiertas
Decidir si se acorta/mueve el segundo párrafo, se ajusta tipografía/espaciado o se rediseña el banner. La decisión debe considerar legal/cookies y la prioridad comercial del CTA. Depende de no romper el contenido de home ni las pruebas visuales existentes.

## Checks sugeridos
- Capturas Playwright mobile 360/390/414 y desktop 1440.
- Prueba con cookies nuevas, aceptadas y rechazadas.
- Revisión de foco, teclado y targets táctiles.
- Comprobación de ausencia de overflow horizontal y solapes.

## No hacer
No ocultar el banner para mejorar la captura, no eliminar consentimiento legal sin revisión, no sacrificar legibilidad del H1 ni asumir que un CTA visible garantiza conversión.


## Implementación local y evidencia

- Se compactó el hero de la home en mobile (`py-12`, tipografía/leading y separación responsive) para adelantar el CTA principal sin cambiar el contenido ni el CTA de desktop.
- El banner de consentimiento conserva aceptar, rechazar, configurar, guardar y el enlace legal; en ≤600px limita su altura a `min(34vh, 18rem)`, permite scroll interno y mantiene controles de al menos 44px con foco visible.
- El botón flotante de WhatsApp usa 48px en mobile y 56px desde `sm`, con offsets de 16/20px para reducir proximidad al contenido.
- `npm run check:seo-12` pasa después de `astro check` + `astro build`: 22 páginas generadas, 0 errores, 0 warnings y 1 hint preexistente de `Schema.astro`. El checker confirma el hero/CTA, las restricciones del consentimiento y CTAs de contacto en las cuatro páginas de nicho.
- No se ejecutó Playwright/CUA ni se generaron capturas nuevas: el entorno de navegador no estuvo disponible. Quedan pendientes las capturas y comprobaciones reales a 360/390/414/1440px, cookies nuevas/aceptadas/rechazadas, foco/teclado y solapes; no se presenta evidencia visual inventada.

## Decisión

Se priorizó una reducción conservadora del espacio vertical del hero y un banner compacto con scroll interno, en lugar de ocultar contenido o retirar el consentimiento legal.
