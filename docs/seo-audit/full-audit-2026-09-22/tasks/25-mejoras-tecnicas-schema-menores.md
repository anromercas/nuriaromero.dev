# Mejoras técnicas y de schema menores
- **ID:** SEO-25
- **Prioridad:** Low
- **Estado:** parcialmente implementado (2026-09-22) — ver "Resultado por punto" al final
- **Fuente:** [schema.md](../findings/schema.md), sección 2 (Info); [technical.md](../findings/technical.md), hallazgos TECH-03, TECH-04, TECH-05; [performance.md](../findings/performance.md), hallazgo #2
- **Scope:** `src/lib/schema.ts`, cabeceras (`public/_headers` o configuración Netlify equivalente), `public/` (IndexNow)

## Problema
Conjunto de mejoras incrementales de baja severidad, ninguna bloqueante, agrupadas por ser de bajo esfuerzo individual:

1. **`Organization.logo` ausente** (solo hay `image`, probablemente 1200×630, no cuadrada). Google usa específicamente `logo` (idealmente cuadrada, mín. 112×112px) para el Knowledge Panel.
2. **Patrón "array con `@context` repetido"** en vez de `@graph` — válido y soportado, pero `@graph` es más canónico cuando hay referencias cruzadas por `@id` (ya es el caso en este sitio).
3. **IndexNow no implementado** (`/indexnow-key.txt` → 404) — sin soporte de notificación instantánea a Bing/Yandex/Naver.
4. **HSTS sin `includeSubDomains`/`preload`** (`max-age=31536000` correcto, falta el resto).
5. **CSP con `'unsafe-inline'` en `script-src`** — reduce protección real contra XSS, aunque el sitio es estático sin inputs de usuario persistidos.
6. **Anomalía de TTFB en home** (496ms vs. 48-193ms en otras páginas) — no crítico, pero a investigar.

## Impacto
Bajo en cada punto individual; agrupados por ser mejoras de higiene técnica de bajo esfuerzo que no requieren decisión de negocio.

## Objetivo
Aplicar las mejoras que no dependen de datos externos:
- Añadir `Organization.logo` (logo cuadrado real, mín. 112×112px) si existe un asset cuadrado disponible.
- Evaluar migrar a patrón `@graph` (cambio de estilo, sin romper validación existente).
- Evaluar HSTS `includeSubDomains; preload` si no hay subdominios HTTP planificados.
- Evaluar migrar scripts inline a nonces/archivos externos para eliminar `'unsafe-inline'` de CSP.
- Investigar la causa del TTFB elevado en home (caché de edge, tamaño de respuesta).
- IndexNow: prioridad baja, solo si se decide adoptar (Bing/Yandex/Naver tienen peso marginal para este negocio).

## Criterios de aceptación
- Cada mejora aplicada no rompe `npm run check:seo-11` (schema) ni el resto de checkers existentes.
- Cabeceras de seguridad verificadas en vivo tras el cambio (`curl -I`).
- No se fabrica ningún logo o asset — si no existe un logo cuadrado real, este punto queda pendiente de asset, no se aproxima recortando la imagen actual sin revisión de diseño.

## Checks sugeridos
```bash
npm run check:seo-11
curl -I https://nuriaromero.dev/
```

## No hacer
No implementar IndexNow sin decisión explícita (prioridad baja, esfuerzo bajo pero no urgente). No debilitar la CSP en el proceso de eliminar `unsafe-inline` (verificar que todo script sigue funcionando).

## Resultado por punto (2026-09-22)

1. **`Organization.logo` — pendiente de asset, no implementado.** Inventario de `public/` (única carpeta de assets estáticos, junto con `src/assets/projects/` que solo contiene imágenes de portfolio): `favicon.svg` (24×24, glyph genérico tipo `</>`, no es un logo de marca — es el icono de pestaña del navegador), `me.jpg` (3383×3467, foto personal, no cuadrada exacta), `perfil-profesional.webp` (896×1053, retrato, no cuadrado), `og/og-default.png` (1200×630, ya usado como `image`, no cuadrado). Ningún asset es un logo cuadrado real de marca. Por criterio de aceptación explícito de la tarea ("no se fabrica ningún logo... no se aproxima recortando la imagen actual"), este punto queda **pendiente de asset**: no se añade `logo` a `localBusinessSchema()`.

2. **Migración a `@graph` — implementado.** `src/components/seo/Schema.astro` normalizaba el array de entidades a un único `<script type="application/ld+json">` con un array JS donde cada entidad conservaba su propio `@context` ("array con `@context` repetido"). Se cambió `Schema.astro` (no `src/lib/schema.ts`: los builders de entidades no cambian, solo el envoltorio de salida) para que, cuando se pasa más de una entidad en una misma llamada `<Schema schema={[...]} />`, se emitan bajo un único documento `{"@context": "https://schema.org", "@graph": [...]}` sin `@context` individual por entidad; una entidad suelta se deja igual que antes (con su propio `@context`, sin envoltorio `@graph` innecesario). Los datos y todas las referencias cruzadas por `@id` (`founder`, `provider`, `publisher`, `worksFor`) se mantienen intactos — verificado parseando JSON-LD de `dist/index.html`, `dist/sobre-mi/index.html`, `dist/diseno-web-sevilla/index.html`, un post de blog y `dist/portfolio/index.html`: todos los bloques son JSON válido y los `@id` (`#business`, `#person`, `#website`) siguen resolviendo igual.
   Los checkers `scripts/check-seo-02.mjs`, `check-seo-05.mjs` y `check-seo-11.mjs` parseaban JSON-LD asumiendo array plano o objeto único; se extendieron (misma lógica en los tres: si el objeto parseado tiene `@graph` como array, usar sus miembros) para reconocer el nuevo formato — sin este ajuste, `check:seo-02` y `check:seo-05` fallaban tras la migración (comprobado con RED real antes del fix).

3. **Anomalía de TTFB en home — investigado, sin fix de código.** Comparación de tamaño de `dist/index.html` (91.307 B) vs. `dist/diseno-web-sevilla/index.html` (89.337 B, TTFB 185 ms), `dist/web-para-restaurantes-sevilla/index.html` (64.067 B, TTFB 193 ms) y `dist/contacto/index.html` (40.701 B, TTFB 48 ms): home y `diseno-web-sevilla` tienen un tamaño casi idéntico (91 KB vs. 89 KB) pero un TTFB muy distinto (496 ms vs. 185 ms, 2,7×), lo que descarta que el tamaño de la respuesta explique la anomalía por sí solo. Recuento de `<script>` en el HTML generado: home y `diseno-web-sevilla` tienen el mismo número (5), sin ningún script o bloque inline desproporcionadamente grande específico de home (el único script no-`is:inline` del sitio, `AnalyticsConsent.astro`, se extrae automáticamente a un `.js` externo por el bundler de Astro en las 23 páginas por igual). Sitio 100% estático (`output` por defecto en `astro.config.mjs`, sin `output: 'server'` ni `prerender` por página) — todo el HTML se genera en build, no hay lógica de servidor por request que pueda diferir entre rutas. Con esta evidencia, no hay ninguna causa a nivel de código de este repo que explique el TTFB elevado de home; es coherente con caché de edge de Netlify/varianza de una única medición de laboratorio (el propio informe de performance ya advierte que es una sola ejecución, no p75 de campo). **Recomendación:** repetir la medición de TTFB con varias ejecuciones (mediana de 3-5, o CrUX/PSI con `GOOGLE_API_KEY` cuando esté disponible) antes de investigar más — con los datos actuales de una sola muestra no se puede distinguir una causa real de ruido de red/CDN. No se aplicó ningún cambio de código.

4. **HSTS `includeSubDomains`/`preload` — investigado, pendiente de decisión humana. No implementado.** No existe `Strict-Transport-Security` en `public/_headers` ni `netlify.toml` en el repo — la cabecera `strict-transport-security: max-age=31536000` que se ve en producción (`curl -I https://nuriaromero.dev/`, confirmado en vivo) la añade Netlify automáticamente por dominio custom HTTPS, no el repo. Subdominios verificados vía DNS (`dig`): solo `www.nuriaromero.dev` resuelve (apunta a Netlify) y ya redirige 301 a `https://nuriaromero.dev/` con HSTS presente en la respuesta de redirección; `mail`, `blog`, `api`, `app`, `cdn` no resuelven; no hay registro `MX` en el dominio (el email de contacto es Gmail, fuera de este dominio). **Conclusión:** con el único subdominio conocido (`www`) ya sirviendo HTTPS y redirigiendo correctamente, añadir `includeSubDomains` sería de riesgo bajo hoy — pero añadirlo requiere crear explícitamente una línea `Strict-Transport-Security` en `public/_headers` (ahora mismo no gestionada por el repo, gestionada por la plataforma), lo cual está fuera del alcance de esta tarea. **`preload`, explícitamente, no se toca ni se recomienda activar sin tu firma** — es una decisión de muy difícil marcha atrás (retirarse de la lista de precarga de navegadores puede tardar meses y solo es posible después de haber dejado de enviar `preload` durante un tiempo). Pendiente de tu decisión.

5. **CSP `'unsafe-inline'` en `script-src` — investigado, pendiente de decisión humana. No implementado.** Inventario de `<script>` en `src/` (`rg -n "<script" src -g '*.astro'`): 6 coincidencias, pero solo **4 son realmente inline en el HTML generado** y requerirían migración:
   - `src/components/WhatsAppButton.astro` (`is:inline`)
   - `src/components/Header.astro` (`is:inline`, acordeón del menú móvil)
   - `src/components/ThemeToggle.astro` (`is:inline`)
   - `src/components/ContactForm.astro` (`is:inline`)
   `src/components/AnalyticsConsent.astro` (mencionado en el scope de la tarea) **no necesita migración**: su `<script>` no lleva `is:inline`, así que Astro ya lo extrae automáticamente a un archivo externo (`/_astro/hoisted.*.js`, confirmado inspeccionando `dist/index.html` y `dist/contacto/index.html`) servido same-origin, ya cubierto por `'self'` sin necesitar `'unsafe-inline'`. `src/components/seo/Schema.astro` (`type="application/ld+json"`) tampoco cuenta: los bloques JSON-LD no son ejecutables, `script-src` no los afecta.
   **Recomendación para una tarea futura:** nonces generados por request no son viables en este sitio (100% estático, sin servidor en cada request que pueda generar/inyectar un nonce distinto por HTML servido) — la opción realista es **extraer los 4 scripts `is:inline` a archivos `.js` externos** (mismo patrón que Astro ya aplica automáticamente a `AnalyticsConsent.astro` al quitarle `is:inline`, o moviéndolos a `src/scripts/*.js` e importándolos), tras lo cual `'unsafe-inline'` podría eliminarse de `script-src` en `public/_headers`. Requiere probar cada uno de los 4 (menú móvil, WhatsApp, tema claro/oscuro, formulario de contacto) tras la extracción, ya que son funcionalidad revisada recientemente en esta misma sesión. No se toca `public/_headers`.

6. **IndexNow — no implementado, según "No hacer".** `/indexnow-key.txt` se deja ausente, sin cambios.
