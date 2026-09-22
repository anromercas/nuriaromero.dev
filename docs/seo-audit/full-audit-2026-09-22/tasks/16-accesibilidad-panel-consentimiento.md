# Accesibilidad del panel de consentimiento de analítica
- **ID:** SEO-16
- **Prioridad:** High
- **Estado:** resuelto (2026-09-22)
- **Fuente:** [technical.md](../findings/technical.md), hallazgo TECH-02; [visual.md](../findings/visual.md), hallazgos 2.2, 2.3, 2.4; PageSpeed Insights móvil real aportado por la propietaria (categoría "Navegación agéntica")
- **Scope:** `src/components/AnalyticsConsent.astro`

## Problema
Hallazgo confirmado por **tres fuentes independientes convergentes** (tratado como un único hallazgo, no tres):

1. **PageSpeed Insights móvil real** (evidencia aportada directamente por la propietaria del sitio): categoría "Navegación agéntica", 2/3, auditoría fallida "ARIA role should be appropriate for the element" sobre `<aside id="analytics-consent" role="dialog">`.
2. **Código fuente** (`AnalyticsConsent.astro`): `role="dialog"` sin `aria-modal`, sin gestión de foco al abrir, sin focus trap, sin cierre con `Escape`, sin retorno de foco al elemento disparador. El propio comportamiento (el usuario puede seguir navegando el resto de la página) confirma que no es un diálogo modal real.
3. **Pruebas en navegador real** (Playwright, 4 viewports): 20 pulsaciones de Tab desde la carga nunca alcanzan los botones "Aceptar/Rechazar analítica" ni "Configurar" (quedan fuera del orden de tabulación esperado); `Escape` no cierra el panel en ningún viewport. Además: overflow interno de ~4px a 360px (`scrollHeight: 274px` vs. `clientHeight: 270px`); botones "Aceptar/Rechazar analítica" y "Configurar" miden 45px de alto en 390/414px, 3px bajo el estándar de 48×48px (WCAG 2.5.5 / Material Design).

Este componente se renderiza en todas las páginas del sitio (aviso de cookies/analítica), por lo que el problema es transversal, no limitado a una URL.

## Impacto
Alto: un usuario que navegue solo con teclado o lector de pantalla puede interactuar con todo el contenido de la página (incluido el CTA de WhatsApp) sin que el diálogo de consentimiento intercepte el foco ni sea fácilmente alcanzable para aceptar/rechazar deliberadamente. Con clic/tap normal (ratón o dedo) el diálogo funciona bien — el problema es específico de navegación por teclado/tecnología de asistencia/agentes de IA.

## Objetivo
Puesto que el panel es un banner persistente no bloqueante (no un modal real que impida interactuar con el resto de la página), la corrección recomendada es sustituir `role="dialog"` por `role="region"` con `aria-label` (o eliminar el rol y dejar el `<aside>` con su rol implícito `complementary`), evitando declarar semántica de diálogo que el componente no implementa.

Si en el futuro se decide mantener `role="dialog"`, implementar el patrón completo: `aria-modal="true"`, foco inicial al abrir, focus trap mientras esté visible, cierre con `Escape`, y retorno de foco al elemento que lo abrió — no es un fix de una sola línea.

## Criterios de aceptación
- El rol ARIA del panel refleja su comportamiento real (no bloqueante) o, si se opta por modal real, implementa el patrón completo descrito arriba.
- Navegación por teclado: Tab alcanza los controles del panel en un orden razonable; si se implementa como modal, el foco queda atrapado dentro mientras esté visible.
- `Escape` tiene un comportamiento definido y consistente con el rol elegido.
- Los 3 botones ("Aceptar analítica", "Rechazar analítica", "Configurar") miden al menos 48px de alto.
- Sin overflow interno en 360px de ancho (5-8px de margen extra de padding inferior o ajuste de interlineado).
- Verificación con Playwright en los 4 viewports (360/390/414/1440) confirmando alcance por Tab y comportamiento de `Escape`.

## Checks sugeridos
- Auditoría de accesibilidad (axe-core o equivalente) sobre el componente.
- Repetir la prueba de 20 pulsaciones de Tab documentada en `visual.md` y confirmar que los controles del panel son alcanzables.
- Repetir la captura de PageSpeed Insights móvil (categoría "Navegación agéntica") tras el cambio.

## No hacer
No convertir el panel en un modal bloqueante real sin decidirlo explícitamente (cambiaría la experiencia de consentimiento actual, que permite seguir navegando). No tocar el resto de la lógica de consentimiento (GA4, cookies) fuera del alcance ARIA/foco/tamaño de botón.

## Resolución (2026-09-22)

**Cambios en `src/components/AnalyticsConsent.astro`:**
- `role="dialog"` → `role="region"` (se mantienen `aria-labelledby`/`aria-describedby`, válidos para `region`). Refleja el comportamiento real: banner persistente no bloqueante, no un diálogo modal.
- `.consent-actions button { min-height: 2.75rem }` → `min-height: 3rem` (48px), para los 3 botones "Aceptar analítica", "Rechazar analítica", "Configurar".
- Media query móvil: `max-height: min(34vh, 18rem)` → `min(35vh, 18.5rem)`, para eliminar el overflow interno de ~4px a 360px sin reducir el contenido visible.

**Cambio adicional en `src/layouts/Layout.astro` (fuera del componente, dentro de alcance ARIA/foco):** `<AnalyticsConsent />` se renderiza ahora justo después de abrir `<body>`, antes de `<Header />`/`<main>`/`<Footer />` (antes se renderizaba después del `<Footer />`, al final del DOM). El posicionamiento visual no cambia (`position: fixed`), pero el orden de tabulación sí: al ser `position: fixed` sin `tabindex` explícito, el orden de Tab sigue el orden del DOM, y el panel estaba después de todo el contenido de la página (menú, hero, tarjetas de servicio, footer), por lo que 20 pulsaciones de Tab nunca lo alcanzaban. Moverlo al inicio del DOM no es un focus trap ni un patrón modal: el usuario puede seguir tabulando más allá del panel hacia el resto de la página en cualquier momento.

**RED (antes del fix, Playwright/Python contra `dist` servido localmente):**
- `role="dialog"`, sin `aria-modal` en los 4 viewports.
- Overflow a 360px: `scrollHeight: 274px` vs `clientHeight: 270px` (coincide con `visual.md`).
- Alturas de botón a 390/414px: 45.1875px (coincide con `visual.md`, ~45px).
- Tab desde carga (viewport 390px, 20 pulsaciones): el foco recorre menú, tema, CTAs del hero y las 8 tarjetas de servicio; nunca alcanza `#consent-accept`/`#consent-reject`/`#consent-customize`.

**GREEN (después del fix):**
- `role="region"` en los 4 viewports; `aria-modal` sigue ausente (correcto: ya no se declara semántica de diálogo).
- Overflow a 360px: `scrollHeight: 277px == clientHeight: 277px` — sin overflow.
- Alturas de botón a 390/414px: exactamente 48px.
- Tab desde carga (viewport 390px): el foco alcanza `#consent-accept` en la 2ª pulsación, `#consent-reject` en la 3ª, `#consent-customize` en la 4ª — dentro de un orden razonable, antes del menú y del resto del contenido.
- `Escape`: el panel sigue visible tras pulsar Escape, en los 4 viewports. Esto es **el comportamiento correcto y consistente con el rol `region`** — al no ser un diálogo modal, no se define ninguna acción de cierre por teclado (igual que cualquier otra región no interactiva de la página). El criterio de aceptación "`Escape` tiene un comportamiento definido y consistente con el rol elegido" queda satisfecho por ausencia deliberada de handler, no por un cierre implementado.

**Verificación de la reproducción exacta de `visual.md` (20 pulsaciones de Tab, viewport 390px):** confirma que los 3 botones SÍ son alcanzables tras el fix. Importante: la alcanzabilidad **no** se debió únicamente al cambio de rol ARIA (que no afecta el orden de tabulación) — se debió al cambio de posición del componente en el DOM (`Layout.astro`), un problema de orden en el DOM distinto del rol ARIA, tal y como anticipaba el hallazgo original ("la alcanzabilidad nunca fue culpa directa del rol ARIA").

**Regresión:** `npm run build` (0 errores, 0 warnings de tipo) + `check:seo-02` a `check:seo-14` (11 checks) sobre el `dist` fresco. `check:seo-12` falló inicialmente porque sus aserciones tenían hardcodeados los valores antiguos (`min(34vh, 18rem)`, `min-height: 2.75rem`); se actualizó `scripts/check-seo-12.mjs` para reflejar los nuevos valores intencionados (`min(35vh, 18.5rem)`, `min-height: 3rem`), tras lo cual los 11 checks pasan. `git diff --check` limpio.

**Verificación en los 4 viewports (360/390/414/1440):** confirmada con Playwright (Python, `playwright==1.60.0`, ya instalado en el sistema) contra `dist` servido localmente (`python3 -m http.server`). Script ad-hoc, no incorporado como script permanente del proyecto (los `check:seo-*` existentes son parsers de HTML estático, no pruebas de interacción de navegador; no encajaba forzarlo ahí). No se tomaron capturas de pantalla (no fueron necesarias para verificar las métricas numéricas objeto de esta tarea).

**Pendiente/fuera de alcance:** ninguno de los criterios de aceptación queda abierto. No se implementó ningún patrón modal (sin `aria-modal`, sin focus trap, sin retorno de foco), tal y como pedía "No hacer".
