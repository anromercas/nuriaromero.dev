# Auditoría visual/UX — nuriaromero.dev (2026-09-21)

Método: capturas con Playwright (Chromium) en desktop 1440×900 y mobile 390×844 (iPhone-like, device scale factor 2), viewport (above-the-fold) y página completa. Capturas con banner de cookies visible y capturas adicionales tras rechazar/cerrar el banner (`*-fold-nocookie.png`) para evaluar el diseño real debajo.

URLs cubiertas: home, `/seo-local-sevilla/`, `/tienda-online-sevilla/`, `/web-para-restaurantes-sevilla/`, `/diseno-web-sevilla/` (comparativa). Todas capturadas en ambos viewports.

Nota de alcance: no se ha medido Lighthouse/contraste con herramienta automática (axe/WCAG contrast checker); la valoración de contraste es visual/estimada a partir de las capturas, no una medición certificada.

---

## 1. Above-the-fold en mobile

### 1.1 [ALTO] Home: el CTA queda fuera del viewport inicial en mobile
- Captura: `home-mobile-fold-nocookie.png` (y `home-mobile-fold.png` con banner de cookies)
- En mobile (390×844), el H1 ("Más oportunidades para tu negocio en Google y en las búsquedas con inteligencia artificial") ocupa 4 líneas completas por el tamaño de fuente grande, seguido de dos párrafos de descripción/bio. El resultado: en el primer pantallazo visible **no aparece ningún botón de CTA** — el botón verde de WhatsApp solo asoma por el borde inferior (un par de píxeles del borde superior del botón).
- Esto contradice el objetivo declarado: el avatar del negocio navega sobre todo desde el móvil y poco nativo digital, por lo que necesita ver la acción (WhatsApp/presupuesto) sin hacer scroll.
- Comparativa: en `/seo-local-sevilla/` y `/tienda-online-sevilla/` (ver 1.2) el CTA sí es visible en el mismo viewport, porque el hero tiene un solo párrafo de introducción en vez de dos. La home tiene contenido de sobra (badge + H1 + párrafo de propuesta + párrafo bio) que no cabe en 844px de alto.
- Recomendación accionable: en mobile, reducir a un único párrafo antes del CTA (mover el segundo párrafo de bio — "Soy Nuria Romero, desarrolladora..." — a después de los botones, o acortarlo), o reducir el tamaño de fuente del H1 en mobile (actualmente parece heredar el mismo clamp que desktop generando 4 líneas). Objetivo: que al menos el botón principal de WhatsApp sea visible sin scroll en un iPhone estándar.

### 1.2 [OK] Páginas de nicho: CTA sí visible en el fold mobile
- Capturas: `seo-local-sevilla-mobile-fold-nocookie.png`, `tienda-online-sevilla-mobile-fold-nocookie.png`, `web-para-restaurantes-sevilla-mobile-fold-nocookie.png`
- Las 3 páginas de nicho muestran breadcrumb + H1 + un párrafo + los 2 botones CTA ("Escríbeme por WhatsApp" / "Pide presupuesto sin compromiso") dentro del viewport inicial (aunque ajustado, casi rozando el borde inferior en `seo-local-sevilla`). El mensaje se entiende en menos de 3 segundos: título claro por servicio + ciudad, propuesta de valor en una frase, CTA de WhatsApp destacado en verde.
- Esto confirma que el problema de 1.1 es específico de la home por exceso de copy en el hero, no un patrón general de la plantilla.

### 1.3 [MEDIO] Banner de cookies bloquea el 100% del above-the-fold en mobile en la primera carga
- Captura: `home-mobile-fold.png`
- El banner de consentimiento ("Tu privacidad importa") se renderiza como modal/panel inferior que en mobile cubre desde la mitad de la pantalla hasta el fondo, tapando por completo el CTA y parte del segundo párrafo. Es una capa adicional sobre el problema 1.1: en la primera visita real (sin cookies ya decididas), el usuario ve H1 + banner de cookies, cero CTA.
- Recomendación: en mobile, usar un banner más compacto (una línea + 1-2 botones en fila, altura reducida) en vez del bloque actual de ~350px, para no bloquear tanto contenido útil en el primer scroll.

### 1.4 [OK] Desktop 1440px: above-the-fold correcto en todas las páginas
- Capturas: `home-desktop-fold-nocookie.png`, `diseno-web-sevilla-desktop-fold-nocookie.png`, etc.
- En desktop el H1 cabe en 2-3 líneas por el mayor ancho disponible, y ambos CTAs quedan visibles sin scroll en todas las páginas revisadas. No hay hallazgos aquí.

---

## 2. Bloque FAQ ampliado (8 preguntas) en `/web-para-restaurantes-sevilla/`

### 2.1 [OK] Implementado como acordeón colapsado, no como muro de texto
- Capturas: `web-para-restaurantes-sevilla-desktop-full.png`, `web-para-restaurantes-sevilla-mobile-full.png`, recorte `faq_crop3` (zoom sobre 3 ítems)
- Las 8 preguntas se muestran colapsadas por defecto con icono `›` y solo la pregunta visible; el usuario despliega la respuesta que le interesa. Esto evita el muro de texto y mantiene el scroll razonable.
- Cada fila del acordeón tiene una altura holgada (target táctil estimado muy por encima de 48px, hay padding generoso arriba/abajo del texto) — no hay problema de tamaño de toque en mobile.
- Longitud total de página razonable: en mobile la página completa mide ~4.990px CSS de alto (viewport 390×844 → serían ~6 pantallazos de scroll total contando hero, "Qué vas a conseguir", "Cómo trabajo", precio, FAQ y CTA final). No es una página anormalmente larga para una landing de servicio con precio + FAQ + prueba social.
- Sin hallazgos negativos en este bloque; el patrón de acordeón es el recomendado y ya está bien resuelto.

---

## 3. Layout responsive / solapamientos / botones táctiles

### 3.1 [BAJO] Botón flotante de WhatsApp cerca del texto en el hero de home (mobile)
- Captura: `/tmp/home_mobile_bottom.png` (recorte del hero de home mobile), no persistido en el repo — referencia visual únicamente; recrear con el mismo recorte de `home-mobile-fold-nocookie.png` si se necesita evidencia física.
- El botón flotante de WhatsApp (esquina inferior derecha, fijo) queda muy próximo a la última línea del segundo párrafo del hero ("trato directo, sin intermediarios"), aunque no llega a solapar el texto en esta página. Es un riesgo de solapamiento en textos ligeramente más largos o en dispositivos con viewport algo más estrecho (p.ej. 360px de Android gama media).
- Recomendación: añadir un margen inferior de seguridad (padding-bottom) al bloque de texto del hero en mobile, o excluir el botón flotante de WhatsApp en el hero si ya hay un CTA de WhatsApp inline justo debajo.

### 3.2 [OK] No se detectan solapamientos, texto cortado ni desbordes horizontales
- Revisadas las capturas full-page de las 5 URLs en ambos viewports: no hay elementos superpuestos, texto truncado con "…" inesperado, ni scroll horizontal aparente (el ancho de contenido respeta el viewport en todas las capturas).

### 3.3 [OK] Botones CTA con tamaño táctil adecuado en mobile
- En todas las páginas de nicho y home, los botones de WhatsApp / "Pide presupuesto" tienen altura visual generosa (aprox. 56-60px físicos con scale factor 2 → ~28-30px CSS de alto de texto más padding vertical amplio), consistente con un target táctil ≥48px.

---

## 4. Contraste de color y legibilidad tipográfica

### 4.1 [OK, con matiz] Contraste general bueno en modo oscuro
- El texto blanco (H1, subtítulos) sobre fondo azul marino muy oscuro tiene contraste alto. El texto secundario en gris claro sobre el mismo fondo también se lee con comodidad en las capturas.
- El texto destacado en amarillo sobre fondo oscuro ("desarrolladora con más de 10 años de experiencia") tiene muy buen contraste y funciona bien como énfasis visual.
- Matiz: esta valoración es visual, no una medición de ratio de contraste WCAG con herramienta (p.ej. axe-core o el contrast checker de Chrome DevTools). Si se requiere certeza normativa (AA/AAA), recomiendo pasar una auditoría de accesibilidad automatizada dedicada.

### 4.2 [OK] Tipografía legible en mobile
- El tamaño de fuente base del cuerpo de texto en mobile se ve cómodo (aparenta ≥16px), sin necesidad de zoom para leer. Los saltos de línea del H1 en home (ver 1.1) son un problema de *layout/espacio*, no de legibilidad tipográfica en sí.

---

## 5. Coherencia de mensaje: home vs. `/diseno-web-sevilla/` vs. `/seo-local-sevilla/`

### 5.1 [OK] La home ya no vende "diseño web" como propuesta principal
- Capturas: `home-desktop-fold-nocookie.png` vs `diseno-web-sevilla-desktop-fold-nocookie.png` vs `seo-local-sevilla-mobile-fold-nocookie.png`
- Home: H1 = "Más oportunidades para tu negocio en Google y en las búsquedas con inteligencia artificial" → mensaje central es visibilidad/SEO/GEO. El primer párrafo refuerza esto (Google + IA); el diseño/mejora de la web aparece como frase subordinada al final del primer párrafo ("Si tu web no ayuda a conseguirlo, también la diseño o la mejoro") y el segundo párrafo repite el orden: primero SEO local + GEO, después "Si además necesitas una web nueva... también me ocupo de eso".
- `/diseno-web-sevilla/`: H1 = "Diseño web en Sevilla para negocios que quieren clientes, no solo una web bonita" → mensaje 100% centrado en diseño web, con su propio CTA y precio.
- `/seo-local-sevilla/`: H1 = "SEO local en Sevilla para negocios que quieren clientes, no solo aparecer en Google" → mensaje centrado en SEO local, coherente con el reposicionamiento de la home.
- Conclusión: no hay conflicto de mensaje. La jerarquía es correcta (home = hub SEO/GEO con diseño web como servicio complementario; las páginas de nicho desarrollan cada servicio por separado). Es una arquitectura de mensaje limpia.
- Único matiz menor (no bloqueante): al llevar dos frases seguidas mencionando "diseño/mejora de la web" en la home (una en cada párrafo), el mensaje secundario se repite dos veces en poco espacio; se podría fusionar en una sola mención para aligerar el hero y ayudar además a resolver 1.1 (menos texto = CTA visible antes).

---

## 6. Pendiente / fuera de alcance de esta pasada
- No se ha revisado `/diseno-web-sevilla/` en mobile con el mismo detalle que las páginas de nicho nuevas (se priorizó home mobile, seo-local-sevilla mobile y el bloque FAQ de restaurantes por limitación de tiempo). La captura `diseno-web-sevilla-mobile-fold-nocookie.png` existe en el directorio de screenshots pero no se ha analizado línea a línea en este informe.
- No se ha probado en tablet (768px) ni laptop (1366px), solo desktop 1440 y mobile 390, según lo pedido.
- No se ha medido contraste con herramienta automática (ver 4.1).
- No se ha verificado el menú hamburguesa (icono ☰ visible en mobile) en su estado abierto — no se hizo clic para comprobar el despliegue de navegación ni el tamaño táctil de sus enlaces.

---

## 7. Puntuación

**Puntuación above-the-fold visual/UX: 72/100** (confianza media-alta; basada en capturas propias, no en test de usuario real)

Desglose:
- Desktop (todas las páginas revisadas): sin penalización, CTA y mensaje claros → sobresaliente.
- Páginas de nicho en mobile (`seo-local-sevilla`, `tienda-online-sevilla`, `web-para-restaurantes-sevilla`): CTA visible, mensaje claro en <3s → bien resuelto.
- Home en mobile: penalización fuerte por CTA fuera de fold (hallazgo 1.1, alto impacto porque la home es la puerta de entrada de marca y el avatar objetivo es mayoritariamente mobile) + banner de cookies que agrava el problema en la primera visita (1.3).
- FAQ ampliada: sin penalización, bien resuelta con acordeón.
- Message match home/nicho: sin penalización.

Si se corrige 1.1 (y de paso 1.3), la puntuación subiría a un rango 85-90/100.
