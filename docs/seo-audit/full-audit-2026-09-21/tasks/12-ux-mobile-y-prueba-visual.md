# Mejorar UX mobile above-the-fold y recopilar prueba visual

- **ID:** SEO-12
- **Prioridad:** P1
- **Estado:** parcial — implementación local completada; validación en navegador real ejecutada el 2026-11-14 (NRD-20) con defectos abiertos (ver sección «Validación en navegador 2026-11-14 (NRD-20)»)
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

## Validación en navegador 2026-11-14 (NRD-20)

Primera validación en navegador real de lo implementado en SEO-12. Sin cambios de código de producto: solo medición.

- **Objetivo probado:** build de producción de `develop` en el commit `025d94fb1a94d212ed648b9fa99300fbcd57a9c2` (`pnpm build` + `pnpm astro preview --port 4399`, servido en local desde `dist/`; no se desplegó nada). Incluye el CTA «Reservar» de la cabecera (NRD-15), que producción aún no tiene.
- **Navegador:** Google Chrome 157.0.8103.51 real (headless, vía Playwright con `executablePath`), emulación de dispositivo con táctil y `deviceScaleFactor` 3 por debajo de 768 px. Un contexto nuevo por combinación (sin datos de sitio = primera visita); para «aceptado»/«rechazado» se pulsa `#consent-accept` / `#consent-reject` y se recarga.
- **Medición:** `scrollWidth <= innerWidth` en el primer viewport, en un barrido de scroll y al final; intersección de rectángulos entre `#analytics-consent`, `#whatsapp-floating-button`, «Configuración de cookies» del pie y todo enlace de reserva visible (hero, cabecera, `#mobile-menu` abierto), en el primer viewport, al final y en un barrido cada 60 % del viewport.
- **Evidencias:** capturas en `$TMPDIR/nuriaromero-qa/NRD-20/` (no se versionan; adjuntas a NRD-20). Nombre `<home|seo>-<ancho>-<first|accepted|rejected>-<top|bottom|menu>.png`, más `kb-*-tabN.png`, `matrix.json` y `keyboard.json`.

### Matriz (24 combinaciones)

| página              | ancho    | estado de consentimiento | scroll horizontal | solapes                                                                                                                                                                                                                  | foco                                           | veredicto     | evidencia                                                                           | bug            |
| ------------------- | -------- | ------------------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- | ------------- | ----------------------------------------------------------------------------------- | -------------- |
| /                   | 360x800  | primera visita           | no (360/360)      | banner x WhatsApp (el panel, z-index 100, tapa el botón z-40); CTA del hero en y=793 de 800: fuera del primer viewport; banner x «Configuración de cookies» del footer al final de la página (esperable hasta responder) | —                                              | falla         | home-360-first-top.png, home-360-first-bottom.png, home-360-first-menu.png          | NRD-70, NRD-71 |
| /                   | 360x800  | aceptado                 | no (360/360)      | ninguno                                                                                                                                                                                                                  | —                                              | pasa          | home-360-accepted-top.png, home-360-accepted-bottom.png, home-360-accepted-menu.png | —              |
| /                   | 360x800  | rechazado                | no (360/360)      | ninguno                                                                                                                                                                                                                  | —                                              | pasa          | home-360-rejected-top.png, home-360-rejected-bottom.png, home-360-rejected-menu.png | —              |
| /                   | 390x844  | primera visita           | no (390/390)      | banner x WhatsApp (el panel, z-index 100, tapa el botón z-40); banner x CTA del hero; banner x «Configuración de cookies» del footer al final de la página (esperable hasta responder)                                   | falla: Tab 8 CTA del hero tapado por el banner | falla         | home-390-first-top.png, home-390-first-bottom.png, home-390-first-menu.png          | NRD-70, NRD-71 |
| /                   | 390x844  | aceptado                 | no (390/390)      | transitorio: WhatsApp pasa sobre el CTA final durante el scroll (y=8602); sin solape en el primer viewport ni al final                                                                                                   | —                                              | pasa con nota | home-390-accepted-top.png, home-390-accepted-bottom.png, home-390-accepted-menu.png | —              |
| /                   | 390x844  | rechazado                | no (390/390)      | transitorio: WhatsApp pasa sobre el CTA final durante el scroll (y=8602); sin solape en el primer viewport ni al final                                                                                                   | —                                              | pasa con nota | home-390-rejected-top.png, home-390-rejected-bottom.png, home-390-rejected-menu.png | —              |
| /                   | 414x896  | primera visita           | no (414/414)      | banner x WhatsApp (el panel, z-index 100, tapa el botón z-40); banner x CTA del hero; banner x «Configuración de cookies» del footer al final de la página (esperable hasta responder)                                   | —                                              | falla         | home-414-first-top.png, home-414-first-bottom.png, home-414-first-menu.png          | NRD-70, NRD-71 |
| /                   | 414x896  | aceptado                 | no (414/414)      | ninguno                                                                                                                                                                                                                  | —                                              | pasa          | home-414-accepted-top.png, home-414-accepted-bottom.png, home-414-accepted-menu.png | —              |
| /                   | 414x896  | rechazado                | no (414/414)      | ninguno                                                                                                                                                                                                                  | —                                              | pasa          | home-414-rejected-top.png, home-414-rejected-bottom.png, home-414-rejected-menu.png | —              |
| /                   | 1440x900 | primera visita           | no (1440/1440)    | banner x «Configuración de cookies» del footer al final de la página (esperable hasta responder)                                                                                                                         | correcto                                       | pasa con nota | home-1440-first-top.png, home-1440-first-bottom.png                                 | —              |
| /                   | 1440x900 | aceptado                 | no (1440/1440)    | ninguno                                                                                                                                                                                                                  | —                                              | pasa          | home-1440-accepted-top.png, home-1440-accepted-bottom.png                           | —              |
| /                   | 1440x900 | rechazado                | no (1440/1440)    | ninguno                                                                                                                                                                                                                  | —                                              | pasa          | home-1440-rejected-top.png, home-1440-rejected-bottom.png                           | —              |
| /seo-local-sevilla/ | 360x800  | primera visita           | no (360/360)      | banner x WhatsApp (el panel, z-index 100, tapa el botón z-40); banner x CTA del hero; banner x «Configuración de cookies» del footer al final de la página (esperable hasta responder)                                   | —                                              | falla         | seo-360-first-top.png, seo-360-first-bottom.png, seo-360-first-menu.png             | NRD-70, NRD-71 |
| /seo-local-sevilla/ | 360x800  | aceptado                 | no (360/360)      | ninguno                                                                                                                                                                                                                  | —                                              | pasa          | seo-360-accepted-top.png, seo-360-accepted-bottom.png, seo-360-accepted-menu.png    | —              |
| /seo-local-sevilla/ | 360x800  | rechazado                | no (360/360)      | ninguno                                                                                                                                                                                                                  | —                                              | pasa          | seo-360-rejected-top.png, seo-360-rejected-bottom.png, seo-360-rejected-menu.png    | —              |
| /seo-local-sevilla/ | 390x844  | primera visita           | no (390/390)      | banner x WhatsApp (el panel, z-index 100, tapa el botón z-40); banner x CTA del hero; banner x «Configuración de cookies» del footer al final de la página (esperable hasta responder)                                   | falla: Tab 8 CTA del hero tapado por el banner | falla         | seo-390-first-top.png, seo-390-first-bottom.png, seo-390-first-menu.png             | NRD-70, NRD-71 |
| /seo-local-sevilla/ | 390x844  | aceptado                 | no (390/390)      | ninguno                                                                                                                                                                                                                  | —                                              | pasa          | seo-390-accepted-top.png, seo-390-accepted-bottom.png, seo-390-accepted-menu.png    | —              |
| /seo-local-sevilla/ | 390x844  | rechazado                | no (390/390)      | ninguno                                                                                                                                                                                                                  | —                                              | pasa          | seo-390-rejected-top.png, seo-390-rejected-bottom.png, seo-390-rejected-menu.png    | —              |
| /seo-local-sevilla/ | 414x896  | primera visita           | no (414/414)      | banner x WhatsApp (el panel, z-index 100, tapa el botón z-40); banner x «Configuración de cookies» del footer al final de la página (esperable hasta responder)                                                          | —                                              | falla         | seo-414-first-top.png, seo-414-first-bottom.png, seo-414-first-menu.png             | NRD-71         |
| /seo-local-sevilla/ | 414x896  | aceptado                 | no (414/414)      | ninguno                                                                                                                                                                                                                  | —                                              | pasa          | seo-414-accepted-top.png, seo-414-accepted-bottom.png, seo-414-accepted-menu.png    | —              |
| /seo-local-sevilla/ | 414x896  | rechazado                | no (414/414)      | ninguno                                                                                                                                                                                                                  | —                                              | pasa          | seo-414-rejected-top.png, seo-414-rejected-bottom.png, seo-414-rejected-menu.png    | —              |
| /seo-local-sevilla/ | 1440x900 | primera visita           | no (1440/1440)    | banner x CTA del hero; banner x «Configuración de cookies» del footer al final de la página (esperable hasta responder)                                                                                                  | correcto                                       | falla         | seo-1440-first-top.png, seo-1440-first-bottom.png                                   | NRD-70         |
| /seo-local-sevilla/ | 1440x900 | aceptado                 | no (1440/1440)    | ninguno                                                                                                                                                                                                                  | —                                              | pasa          | seo-1440-accepted-top.png, seo-1440-accepted-bottom.png                             | —              |
| /seo-local-sevilla/ | 1440x900 | rechazado                | no (1440/1440)    | ninguno                                                                                                                                                                                                                  | —                                              | pasa          | seo-1440-rejected-top.png, seo-1440-rejected-bottom.png                             | —              |

Foco: «—» = no medido en esa combinación; el pase de teclado se hizo en primera visita a 390 y 1440 px (diseño de NRD-20).

### Resultados

- **Scroll horizontal:** ninguno en las 24 combinaciones (`scrollWidth == innerWidth`, también al final y en el barrido).
- **Consentimiento aceptado/rechazado:** el panel se cierra al pulsar, no reaparece tras recargar y `localStorage['site-analytics-consent']` guarda `accepted`/`rejected`. El control de reapertura («Configuración de cookies», en el pie) no solapa con WhatsApp. Sin solapes en el primer viewport ni al final. Nota: a 390 px en la home, WhatsApp pasa transitoriamente sobre el CTA final durante el scroll (y≈8602); no es un solape estable.
- **Primera visita en mobile (360/390/414):** el panel de consentimiento (`position: fixed; z-index: 100`, `.consent-panel` en `src/components/AnalyticsConsent.astro:98`, regla mobile `@media (max-width: 600px)` en `:110`; líneas en develop 025d94f) cubre por completo el botón de WhatsApp (`z-40`, `src/components/WhatsAppButton.astro:14`): el botón no se ve ni se puede pulsar hasta responder. Además tapa el CTA del hero en home 390/414 y en SEO local 360/390; en home 360x800 el CTA del hero queda en y=793 de 800 (fuera del primer viewport en todos los estados). Con el menú abierto en primera visita, el CTA del drawer queda bajo el panel (home 390/414, SEO local 360/390).
- **Primera visita en 1440x900:** en `/seo-local-sevilla/` el CTA del hero queda bajo el panel (y=771–816 frente a panel y=761–883) hasta que se responde. En la home el CTA de la cabecera y el del hero quedan libres.
- **Teclado (390 y 1440, primera visita):** el orden es el del DOM: enlace «Más información» y controles del consentimiento (Aceptar, Rechazar, Configurar) → logo → menú (390) o navegación + «Reservar» (1440) → hero. Todos los elementos tienen foco visible (`:focus-visible`, anillo de 2–3 px). No hay trampa de foco. A 390 px el CTA del hero (home y SEO local: Tab 8) recibe el foco **tapado por el panel de consentimiento**, igual que «Ver servicios»/«Ver los planes» y los enlaces de nicho de la home. A 1440 px el foco nunca queda oculto en la cabecera ni en los controles del consentimiento.
- **Limitaciones:** emulación de Chrome, no un teléfono físico; no se probó Safari/iOS ni la barra de direcciones dinámica (`vh` frente a `dvh`). Se recomienda una comprobación posterior en dispositivo real. El pase de teclado no cubre aceptado/rechazado ni 360/414, ni el botón «Guardar preferencias» (`#consent-save`), que solo aparece tras pulsar «Configurar» y no se abrió. Numeración de Tab: base 1 (Tab 1 = primer elemento enfocado). `kb-home-390-tab9.png` es la captura del Tab 9 («Ver servicios», también tapado por el panel), el elemento siguiente al CTA del hero (Tab 8); no hay captura del Tab 8, su medición está en `keyboard.json`.

### Defectos

Defectos agrupados por causa, uno por bug NRD:

1. CTA del hero (y foco) tapados por el panel de consentimiento en primera visita (mobile y SEO local en 1440): NRD-70.
2. Panel de consentimiento tapa el botón flotante de WhatsApp en primera visita mobile: NRD-71.

Capturas clave: `home-390-first-top.png` (panel sobre CTA y WhatsApp), `seo-1440-first-top.png`, `kb-home-390-tab9.png`.
