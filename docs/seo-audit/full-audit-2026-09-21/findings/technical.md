# Auditoría Técnica SEO — nuriaromero.dev

Fecha: 2026-09-21
Método: fetch en vivo (curl) contra producción + inspección del repo local (`portfolio-nuriaromerodev/nuriaromero.dev`, Astro v4.4.5, estático, Netlify). Sin datos de campo (Search Console/CrUX/PSI no disponibles — Tier -1 confirmado); todo lo relativo a Core Web Vitals es evaluación de laboratorio/estática, no de campo.

## Puntuación Technical SEO: 78 / 100

Justificación al final del documento.

---

## 1. Crawlability

**Estado: PASS**, con 1 hallazgo Medium.

- `robots.txt`: permite todo, con reglas explícitas `Allow` para GPTBot, OAI-SearchBot, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Google-Extended (confirmado, generado por integración `astro-robots-txt` en `astro.config.mjs`). Correcto y alineado con buenas prácticas de gestión de crawlers de IA.
- Sitemap: `sitemap-index.xml` → `sitemap-0.xml`, 22 URLs, todas con trailing slash consistente y coincidente con las URLs reales servidas (verificado con `curl` sobre las 22, ver sección 2).
- `astro.config.mjs` filtra explícitamente `/components` del sitemap (`filter: (page) => !page.includes('/components')`) — correcto.

**Hallazgo Medium — `/components/` accesible en producción con solo noindex, no bloqueado en robots.txt**
- Evidencia: `GET https://nuriaromero.dev/components/` → `200 OK`, `<meta name="robots" content="noindex, nofollow">`. No aparece en el sitemap. `robots.txt` no tiene un `Disallow: /components` explícito.
- No es un problema de indexación (el noindex funciona), pero es una página de desarrollo/showcase de componentes que no debería viajar al build de producción.
- Recomendación: excluir `src/pages/components.astro` del build de producción (p. ej. condicionarlo a `import.meta.env.DEV`, o moverlo fuera de `src/pages` en producción) en vez de depender solo del meta noindex. Alternativa más ligera: añadir `Disallow: /components` en `astro-robots-txt` como capa adicional de defensa, aunque la corrección real es no publicarla.

## 2. Indexabilidad — Códigos HTTP y Canonicals

**Estado: PASS** en las 22 URLs del sitemap; **FAIL / Critical** en la cadena de redirects de las rutas migradas.

### 2.1 Verificación de las 22 URLs del sitemap

Todas devuelven `200 OK` directo, sin redirects intermedios, sin soft-404 (comprobado con `curl -I` una a una):

home, `/automatizaciones/`, `/aviso-legal/`, `/blog/`, 4 posts de blog, `/contacto/`, `/cookies/`, `/desarrollo-software-medida/`, `/diseno-web-sevilla/`, `/inteligencia-artificial/`, `/portfolio/`, `/privacidad/`, `/seo-local-sevilla/`, `/sobre-mi/`, `/tienda-online-sevilla/`, y las 4 páginas de nicho (`web-para-abogados-gestorias-sevilla`, `web-para-clinicas-sevilla`, `web-para-comercios-sevilla`, `web-para-restaurantes-sevilla`).

No se ha detectado ningún 404/500 no documentado.

### 2.2 CRÍTICO — Cadena de doble redirect 301 en las 4 páginas de servicio migradas

**Severidad: Critical.** Confirmado con evidencia de cabeceras HTTP completas.

Causa raíz confirmada (no solo probable): `public/_redirects` apunta a la ruta sin barra final:

```
/servicios/diseno-web-sevilla           /diseno-web-sevilla           301
/servicios/desarrollo-software-medida   /desarrollo-software-medida   301
/servicios/automatizaciones             /automatizaciones             301
/servicios/inteligencia-artificial      /inteligencia-artificial      301
```

`astro.config.mjs` no define `trailingSlash` ni `build.format`, por lo que Astro usa el valor por defecto `build.format: 'directory'`: cada página se compila como `<slug>/index.html`, accesible de forma nativa solo en `/<slug>/`. Cuando Netlify recibe una petición a `/<slug>` (sin barra) y no hay un archivo exacto con ese nombre sino un directorio con `index.html`, añade automáticamente un segundo 301 hacia `/<slug>/`. Evidencia de cabeceras real:

```
GET /servicios/diseno-web-sevilla
→ HTTP/2 301, location: /diseno-web-sevilla
  cache-status: fwd-status=301  (proviene de la regla en _redirects)

GET /diseno-web-sevilla
→ HTTP/2 301, location: /diseno-web-sevilla/
  cache-status: fwd-status=200  (redirect automático de Netlify por servir un directorio, NO viene de _redirects)

GET /diseno-web-sevilla/  → 200 OK
```

Resultado: **2 saltos 301** para llegar a la URL final, en las 4 páginas migradas:
`/servicios/diseno-web-sevilla` → `/diseno-web-sevilla` → `/diseno-web-sevilla/` → 200. Igual para `desarrollo-software-medida`, `automatizaciones`, `inteligencia-artificial`.

**`/servicios/` y `/servicios` (sin slug) NO tienen el problema**: ambas resuelven en **1 solo salto** directo a `/` (home), porque el destino (`/`) ya coincide con el formato que Netlify sirve sin necesidad de un segundo redirect.
```
GET /servicios/  → 301 → /   (1 salto)
GET /servicios   → 301 → /   (1 salto)
```

**Recomendación (accionable, sin tocar nada aún — solo lectura en esta auditoría):**
Editar `public/_redirects` para que las 4 reglas apunten ya con la barra final, eliminando el segundo salto:
```
/servicios/diseno-web-sevilla           /diseno-web-sevilla/           301
/servicios/desarrollo-software-medida   /desarrollo-software-medida/   301
/servicios/automatizaciones             /automatizaciones/             301
/servicios/inteligencia-artificial      /inteligencia-artificial/      301
```
Esto colapsa la cadena a un único 301, que es lo que el negocio pidió verificar tras el traslado de URLs.

### 2.3 Canonicals — PASS

Verificado en las 4 páginas de servicio y las 4 de nicho + `seo-local-sevilla` y `tienda-online-sevilla`: todas se autorreferencian correctamente a la ruta en raíz con barra final, nunca a `/servicios/<slug>`:

```
https://nuriaromero.dev/diseno-web-sevilla/            → canonical: .../diseno-web-sevilla/
https://nuriaromero.dev/desarrollo-software-medida/    → canonical: .../desarrollo-software-medida/
https://nuriaromero.dev/automatizaciones/              → canonical: .../automatizaciones/
https://nuriaromero.dev/inteligencia-artificial/       → canonical: .../inteligencia-artificial/
https://nuriaromero.dev/seo-local-sevilla/             → canonical: .../seo-local-sevilla/
https://nuriaromero.dev/tienda-online-sevilla/         → canonical: .../tienda-online-sevilla/
https://nuriaromero.dev/web-para-restaurantes-sevilla/ → canonical: .../web-para-restaurantes-sevilla/
https://nuriaromero.dev/web-para-clinicas-sevilla/     → canonical: .../web-para-clinicas-sevilla/
https://nuriaromero.dev/web-para-abogados-gestorias-sevilla/ → autorreferenciado correcto
https://nuriaromero.dev/web-para-comercios-sevilla/    → autorreferenciado correcto
```

Explicación de código: `src/components/seo/SEO.astro` genera el canonical automáticamente con `new URL(Astro.url.pathname, Astro.site).href` y ninguna página de servicio/nicho pasa un `canonical` explícito que apunte a la ruta antigua — por diseño, es imposible que el canonical apunte a `/servicios/<slug>` salvo que se fuerce manualmente. Sin riesgo de regresión futura mientras no se introduzcan overrides.

## 3. Consistencia de trailing slash en enlaces internos — Hallazgo High (nuevo, no documentado previamente)

**Severidad: High.** El mismo patrón de inconsistencia detectado en los redirects **se repite en el código fuente**: los slugs de servicios y nichos se definen SIN barra final en `src/data/services.ts` y `src/data/niches.ts` (p. ej. `slug: "/diseno-web-sevilla"`), y ese valor crudo se usa directamente como `href` en varios puntos sin normalizar:

| Componente | Uso | Efecto |
|---|---|---|
| `src/components/Header.astro:53` | `url: page.slug` → menú de navegación principal (dropdown "Servicios") | Cada clic en el menú de navegación, presente en TODAS las páginas, dispara un 301 innecesario antes de llegar a la URL final |
| `src/components/Footer.astro:21,38` | `href={service.slug}` / `href={niche.slug}` | Igual: footer presente en todas las páginas linka sin barra final |
| `src/pages/index.astro:143,169,201` | `href={service.slug}` / `href={niche.slug}` | Tarjetas de servicios/nichos en la home enlazan sin barra final |
| `src/layouts/ServiceLayout.astro:27,38` | `{ name: page.breadcrumbName, url: page.slug }` usado tanto en el breadcrumb visible como en `breadcrumbSchema(breadcrumbs)` (JSON-LD) | Ver 3.1 y 3.2 |

Evidencia HTTP: el link del footer/nav/home a `/diseno-web-sevilla` no está roto, pero fuerza un salto 301 extra (el mismo "segundo salto" de la sección 2.2) en cada navegación interna, en vez de enlazar directamente a `/diseno-web-sevilla/`. Esto desperdicia presupuesto de rastreo para bots y añade latencia/una petición extra para usuarios en cada clic de menú, footer o tarjeta de la home, en las 8 páginas de servicio/nicho.

**Recomendación:** normalizar los `slug` en `src/data/services.ts` y `src/data/niches.ts` para que incluyan la barra final (`"/diseno-web-sevilla/"`), o añadir un helper de normalización en el punto de consumo (`href={service.slug.endsWith('/') ? service.slug : service.slug + '/'}`). Preferible corregir en origen (los datos) para no repetir el parche en cada componente.

### 3.1 — Sub-hallazgo: breadcrumb visible sin barra final

El breadcrumb visible en página (`Breadcrumbs.astro`) recibe `item.url = page.slug` y renderiza `<a href="/diseno-web-sevilla">` (confirmado en HTML servido de `/diseno-web-sevilla/`). Mismo problema que la navegación.

### 3.2 — Sub-hallazgo Medium: inconsistencia en datos estructurados BreadcrumbList

El JSON-LD `BreadcrumbList` generado por `breadcrumbSchema(breadcrumbs)` usa la misma URL sin barra final:

```json
{"@type":"BreadcrumbList","itemListElement":[
  {"@type":"ListItem","position":1,"name":"Inicio","item":"https://nuriaromero.dev/"},
  {"@type":"ListItem","position":2,"name":"Diseño web en Sevilla","item":"https://nuriaromero.dev/diseno-web-sevilla"}
]}
```
(verificado en `/diseno-web-sevilla/`, y por construcción de código se repite en las 8 páginas de servicio/nicho que usan `ServiceLayout.astro`)

Esto es una inconsistencia menor pero real: la URL declarada en el dato estructurado (`.../diseno-web-sevilla`, sin barra) no coincide con la URL canónica real de la página (`.../diseno-web-sevilla/`). No suele bloquear el enriquecimiento de resultados en Google, pero es una discrepancia que conviene resolver junto con el punto 3, ya que la causa es la misma (`page.slug` sin normalizar).

## 4. Seguridad

**Estado: PASS.** Cabeceras verificadas en 6 páginas de tipos distintos (home, servicio migrado, nicho, blog index, legal, y `/components/`): `content-security-policy`, `strict-transport-security: max-age=31536000`, `x-content-type-options: nosniff`, `x-frame-options: DENY`, `referrer-policy: strict-origin-when-cross-origin`, `permissions-policy: camera=(), microphone=(), geolocation=()`. Idénticas y consistentes en todas las páginas comprobadas, incluida `/components/`.

Nota Low: la `strict-transport-security` no incluye `includeSubDomains` ni `preload`. No es un problema si no hay subdominios relevantes, pero si en algún momento se añaden (p. ej. `www.` o un subdominio de blog/app), conviene revisarlo. No degradado a Medium por falta de evidencia de subdominios activos.

No se detectó mixed content: no hay recursos `http://` cargados desde HTTPS en home ni en página de servicio comprobada.

## 5. Mobile / Viewport / Hreflang

**Estado: PASS.**

- Viewport: `<meta name="viewport" content="width=device-width, initial-scale=1">` presente y correcto.
- `<html lang="es">` — confirmado en `src/layouts/Layout.astro:26`, único layout de idioma usado en todo el sitio.
- Hreflang: **no existe ningún `<link rel="alternate" hreflang="...">` en el sitio** (verificado en las 10 páginas de servicio/nicho comprobadas). Correcto: es un sitio monolingüe en español dirigido a Sevilla, no debe tener hreflang. No aplica el sub-skill `seo-hreflang` porque no hay variantes de idioma/región que validar.

No se ha podido evaluar mobile-friendliness real (tap targets, overlapping, font-size renderizado) porque no hay acceso a Lighthouse/PSI (Tier -1 confirmado); la evaluación se limita a lo verificable en el HTML/CSS fuente (viewport correcto, Tailwind con clases responsive `sm:`/`md:` usadas extensamente en los componentes revisados).

## 6. Imágenes / Core Web Vitals (evaluación de laboratorio/estática)

**Estado: PASS**, buena implementación técnica.

- Todas las imágenes de contenido (home, `Projects.astro`, tarjetas de proyectos) usan el componente `<Image>` de `astro:assets`, que en el build genera automáticamente:
  - Formato **WebP** (`/_astro/*.webp`)
  - `srcset` responsive (400w/800w) + atributo `sizes`
  - **`width`/`height` explícitos** (previene layout shift, buena señal para CLS)
  - `loading="lazy"` y `decoding="async"` en imágenes no críticas
- No se ha detectado ningún `<img>` "crudo" (sin `astro:assets`) en el código fuente de `src` — 0 coincidencias.
- No se usa AVIF (solo WebP). No es un error, pero AVIF suele pesar entre un 10-20% menos que WebP con calidad similar; podría evaluarse como mejora Low/Medium si el peso de imagen resulta ser un cuello de botella real (no verificable sin datos de campo/PSI).

Riesgos potenciales de CWV solo a nivel de código (sin datos de campo, por tanto estimación, no medición):
- **LCP**: no se detectó `fetchpriority="high"` ni preload explícito para la imagen probablemente LCP (hero de home/servicio). Si el hero usa una imagen grande por encima del pliegue, no marcarla como prioritaria puede penalizar el LCP. Severidad Low/Medium — recomendación: revisar si el hero de cada página tiene imagen y, si la tiene, añadir `loading="eager"` + `fetchpriority="high"` solo a esa imagen concreta (no a las de la grid de proyectos, que ya usan lazy correctamente).
- **CLS**: mitigado por `width`/`height` explícitos en todas las imágenes vistas — riesgo bajo.
- **INP**: no se detecta JS bloqueante pesado en el HTML servido (solo un script de hidratación `hoisted.*.js` + JSON-LD + un script inline pequeño). Sin datos de campo no se puede confirmar el valor real, pero la superficie de riesgo en el código es baja al ser sitio mayormente estático.

## 7. Renderizado / JavaScript

**Estado: PASS.** Confirmado que el sitio es completamente estático (SSG con Astro): el contenido completo (H1, texto, FAQs) está presente en el HTML crudo servido por `curl` sin ejecutar JavaScript. El único JS cargado es un módulo hoisted de hidratación puntual y el JSON-LD. No hay dependencia de renderizado del lado del cliente (no es una SPA), por lo que no hay riesgo de indexación relacionado con CSR.

## 8. Datos estructurados

**Estado: PASS con matiz** (ver 3.2). Se detectó `Schema.astro` inyectando JSON-LD de tipo `Service`, `FAQPage` y `BreadcrumbList` en las páginas de servicio/nicho (vía `src/lib/schema.ts`). No se ha validado exhaustivamente el schema completo (`serviceSchema`, `faqSchema`) letra por letra contra el validador de Google/schema.org — **no verificado**, por alcance y tiempo; se recomienda una pasada dedicada de validación de rich results si no se ha hecho ya.

## 9. IndexNow

**No verificado.** No se ha comprobado si el sitio notifica a IndexNow (Bing/Yandex/Naver) tras publicar o actualizar contenido; no hay evidencia en el repo de una integración de IndexNow (no se ha encontrado ningún endpoint, key file `*.txt` de IndexNow, ni llamada saliente en el código de build/CI). Dado que Netlify + Astro no lo activan por defecto, es razonable asumir que no está implementado, pero se marca como no verificado en profundidad (no se ha revisado el pipeline de CI/CD ni webhooks de Netlify).

## Puntos de la lista original marcados explícitamente como no verificados

- Validación exhaustiva letra por letra del JSON-LD (`Service`/`FAQPage`) contra el validador oficial de rich results — no realizada por alcance.
- IndexNow — no verificado (ver sección 9).
- Mobile-friendliness real medido (tap targets, overlaps renderizados) — solo inferido de HTML/CSS fuente, sin Lighthouse/PSI.
- Core Web Vitals de campo (LCP/INP/CLS reales) — imposible sin credenciales de CrUX/PSI/GA4 (Tier -1 confirmado); todo lo reportado en la sección 6 es evaluación estática de código, no medición.

---

## Resumen de hallazgos por severidad

**Critical**
1. Cadena de doble redirect 301 en las 4 páginas de servicio migradas (`/servicios/<slug>` → `/<slug>` → `/<slug>/` → 200), causada por que `public/_redirects` no incluye la barra final en el destino mientras Astro construye en formato `directory`. Fix: añadir `/` al destino de las 4 reglas en `_redirects`.

**High**
2. Los enlaces internos (menú de navegación `Header.astro`, `Footer.astro`, tarjetas de la home `index.astro`, y breadcrumb de `ServiceLayout.astro`) apuntan a las 8 páginas de servicio/nicho SIN barra final, generando un 301 innecesario en cada clic interno. Causa raíz: `slug` definido sin barra final en `src/data/services.ts` / `src/data/niches.ts`. Fix: normalizar los slugs en origen.

**Medium**
3. `/components/` sigue publicado en producción (200 + noindex) en vez de excluirse del build; higiene, no indexación.
4. JSON-LD `BreadcrumbList` en las 8 páginas de servicio/nicho declara la URL del segundo nivel sin barra final, inconsistente con el canonical real (misma causa raíz que el hallazgo 2).

**Low**
5. `Strict-Transport-Security` sin `includeSubDomains`/`preload` (revisar solo si hay/habrá subdominios).
6. Imágenes solo en WebP, sin variante AVIF (ahorro potencial de peso, no crítico).
7. Posible ausencia de `fetchpriority="high"` en imagen LCP de hero — no confirmado por falta de datos de campo, señalado como riesgo de código.

---

## Justificación de la puntuación (78/100)

Se parte de una base técnica sólida: sitio 100% estático, cabeceras de seguridad completas y consistentes, sitemap y robots.txt bien configurados (incluyendo gestión explícita de crawlers de IA), canonicals correctos y sin overrides peligrosos, hreflang correctamente ausente, imágenes con buena implementación técnica (WebP, srcset, dimensiones explícitas, lazy loading), y renderizado sin dependencia de JS.

Se penaliza con -15 puntos por el hallazgo Critical (cadena de doble redirect en 4 URLs de negocio importantes, exactamente lo que el negocio pidió verificar) y -5 puntos por el hallazgo High (la misma causa raíz contaminando la navegación interna de 8 páginas clave, con impacto en presupuesto de rastreo y experiencia de usuario). Se resta -2 puntos adicionales por los hallazgos Medium/Low acumulados (página `/components/` en producción, inconsistencia menor en datos estructurados, falta de IndexNow verificado). No se penaliza por Core Web Vitals de campo al no haber datos disponibles (Tier -1); la evaluación de laboratorio no muestra señales de alarma.
