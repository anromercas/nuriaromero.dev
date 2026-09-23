# Eliminar 'unsafe-inline' de script-src en la CSP
- **ID:** SEO-27
- **Prioridad:** Medium (seguridad, no SEO directo)
- **Estado:** pendiente
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
