# Eliminar 'unsafe-inline' de script-src en la CSP
- **ID:** SEO-27
- **Prioridad:** Medium (seguridad, no SEO directo)
- **Estado:** completado (2026-09-23)
- **Fuente:** [technical.md](../findings/technical.md), hallazgo TECH-05; investigación SEO-25 (2026-09-22), diferida a decisión humana; autorizada por la usuaria el 2026-09-23
- **Scope:** `src/components/WhatsAppButton.astro`, `src/components/Header.astro`, `src/components/ThemeToggle.astro`, `src/components/ContactForm.astro`, `public/_headers`

## Problema
`Content-Security-Policy` en `public/_headers` incluye `'unsafe-inline'` en `script-src`, lo que permite ejecutar cualquier `<script>` inline en la página — reduce la protección real de la CSP contra XSS, aunque el sitio es estático sin inputs de usuario persistidos en base de datos (riesgo base ya bajo).

Inventario confirmado en SEO-25 (2026-09-22): solo 4 componentes tienen `<script>` genuinamente inline en el HTML final (marcados `is:inline` en Astro):
1. `src/components/WhatsAppButton.astro` — guarda de `IntersectionObserver` para ocultar el botón flotante en el hero (SEO-17, con re-enganche en `astro:page-load` para View Transitions)
2. `src/components/Header.astro` — lógica del menú móvil
3. `src/components/ThemeToggle.astro` — selector de tema oscuro/claro, usa `astro:after-swap` (paint-critical)
4. `src/components/ContactForm.astro` — envío del formulario de contacto

`AnalyticsConsent.astro` (mencionado en el scope original de SEO-25) **no** necesita migración: Astro ya extrae su script automáticamente a un `.js` externo (sin `is:inline`), cubierto por `'self'`.

## Impacto
Medio: mejora defensa en profundidad contra XSS. No bloqueante para SEO. Riesgo de regresión si la migración se hace sin probar cada script — 3 de los 4 componentes afectados fueron tocados esta misma sesión (WhatsApp, Header, panel de consentimiento adyacente) y tienen lógica de reenganche bajo Astro View Transitions que hay que preservar exactamente.

## Objetivo
Migrar los 4 scripts inline a archivos `.js` externos (nonces no son viables en un sitio 100% estático — requieren generación por request), eliminar `'unsafe-inline'` de `script-src` en `public/_headers`, y verificar que cada funcionalidad afectada sigue funcionando exactamente igual.

## Criterios de aceptación
- Los 4 scripts dejan de ser `is:inline` y se sirven como archivos externos.
- `script-src` en `public/_headers` ya no incluye `'unsafe-inline'`.
- El botón de WhatsApp sigue ocultándose/mostrándose correctamente en el hero, incluyendo tras navegación por View Transitions (SEO-17, no regresar ese fix).
- El menú móvil del header sigue abriendo/cerrando correctamente.
- El selector de tema sigue funcionando tras navegación por View Transitions (`astro:after-swap`).
- El formulario de contacto sigue enviando correctamente.
- `npm run build` + barrido completo de `check:seo-02` a `check:seo-14` en verde.
- Verificación en navegador real (Playwright) de las 4 funcionalidades, no solo ausencia de errores de build.

## Checks sugeridos
```bash
npm run build
npm run check:seo-12
curl -I https://nuriaromero.dev/ | grep -i content-security-policy
```
- Prueba manual/Playwright de: botón WhatsApp (aparece/desaparece en hero, 360px), menú móvil (abre/cierra), tema oscuro (persiste tras navegación), formulario de contacto (envía sin error de consola).

## No hacer
No usar nonces (no viables en sitio estático sin generación por request). No debilitar la CSP en otro punto para compensar. No tocar `AnalyticsConsent.astro` (ya no es inline, no lo necesita).

## Evidencia de cierre (2026-09-23)

Los 4 scripts se movieron a archivos externos bajo `src/scripts/` (mismo patrón que `AnalyticsConsent.astro`: `<script>` sin `is:inline` que hace `import "../scripts/x.js"`), y se eliminó `'unsafe-inline'` de `script-src` en `public/_headers` (única directiva tocada).

- `src/scripts/whatsapp-button.js` — port verbatim del guard de `IntersectionObserver` (SEO-17), incluido el re-enganche en `astro:page-load` para View Transitions (commit `cd1ca20`). Sin cambios de comportamiento.
- `src/scripts/header-mobile-menu.js` — port verbatim del menú móvil (guard `window.__mobileMenuInit`, delegación a nivel `document`, cierre en `astro:after-swap`). Sin cambios de comportamiento.
- `src/scripts/theme-toggle.js` — port verbatim del selector de tema, incluido el re-enganche en `astro:after-swap` (paint-critical, deliberadamente no cambiado a `astro:page-load`).
- `src/scripts/contact-form.js` — port del envío del formulario **+ fix del bug preexistente** `Uncaught SyntaxError: Identifier 'ENDPOINT' has already been declared` (hallado por un subagente de SEO-17 esta misma sesión). Fix: toda la lógica se envolvió en `initContactForm()` (scope de función, redeclaración estructuralmente imposible) enganchado solo a `astro:page-load` (igual que WhatsAppButton, que también dispara en la carga inicial — sin llamada directa adicional, para no duplicar el listener de submit). El guard de "elementos no encontrados" ahora retorna en silencio si `#contact-form` no existe (normal en el resto de páginas, ya que el listener persiste en `document` y dispara en cada navegación), y solo avisa por consola si el formulario existe pero faltan `#form-status`/`#submit-btn`.

**Verificación:**
- `npm run build` (23 páginas, 0 errores) + barrido completo `check:seo-02`–`check:seo-14` (11 checks) sobre `dist` limpio: todos en verde (`check:seo-12` incluido).
- Confirmado en el HTML de `dist` que no queda ningún `<script is:inline>`; solo `application/ld+json` y `<script type="module" src="/_astro/hoisted.*.js">`.
- `netlify dev --dir dist --offline` + `curl -I`: `script-src 'self' https://www.googletagmanager.com` (sin `'unsafe-inline'`), `style-src 'self' 'unsafe-inline'` intacto.
- Playwright contra el `dist` servido, viewport 360px:
  - Botón WhatsApp: se oculta en el hero de home y reaparece al hacer scroll — PASS. Repetición exacta de la reproducción de SEO-17 (navegar a `/contacto/`, click en "Inicio", home) — se re-oculta correctamente — PASS.
  - Menú móvil: abre y cierra (botón + tecla Escape) — PASS.
  - Selector de tema: cambia Dark→Light y persiste (`localStorage` + clase `.dark`) tras navegación por View Transitions — PASS.
  - Formulario de contacto: sin errores/warnings de consola en carga ni tras 3 ciclos de navegación repetida a `/contacto/` (único error de consola presente en todo momento: `font-src 'self'` bloqueando una fuente `data:` woff2, preexistente y fuera de alcance — no relacionado con `script-src`) — PASS. Bug de `ENDPOINT` confirmado corregido. Envío real de prueba completado con éxito (`✅ ¡Mensaje enviado correctamente!`).
- `git diff --check` limpio. Alcance limitado a los 4 componentes, los 4 `.js` nuevos, `public/_headers` y los dos documentos de seguimiento.

Un commit en `develop`.
