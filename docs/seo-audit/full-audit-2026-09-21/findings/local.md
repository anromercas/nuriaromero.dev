# Auditoría Local SEO — nuriaromero.dev

Fecha: 2026-09-21
Alcance: auditoría de solo lectura, basada en código fuente del repo (Astro estático) — no se ha llamado a ninguna API de Google.

## Resumen ejecutivo

**Puntuación Local SEO: 42/100**

Negocio tipo **Service Area Business (SAB)** correctamente modelado a nivel de NAP y schema (sin dirección pública, área de servicio declarada). El problema central no es de consistencia de datos — el NAP es limpio — sino de **credibilidad de la propuesta**: el sitio vende "SEO local + configuración de Google Business Profile" como servicio explicando con detalle qué es una ficha de GBP, pero no evidencia tener una ficha de GBP propia, ni un embed de Maps, ni reseñas propias, ni un enlace `sameAs` a su propio perfil de Google Business. Para una especialista que se posiciona vendiendo justo esto a terceros, es el hallazgo de mayor impacto de la auditoría.

| Dimensión | Peso | Puntuación (0-100) | Ponderado |
|---|---|---|---|
| GBP Signals | 25% | 10 | 2.5 |
| Reviews & Reputation | 20% | 15 | 3.0 |
| Local On-Page SEO | 20% | 65 | 13.0 |
| NAP Consistency & Citations | 15% | 55 | 8.25 |
| Local Schema Markup | 10% | 70 | 7.0 |
| Local Link & Authority Signals | 10% | 30 | 3.0 |
| **Total** | | | **≈42/100** |

Nota de cálculo: GBP y Reviews pesan un 45% combinado y ambos están casi a cero por ausencia total de ficha propia — esto arrastra la puntuación global a pesar de que el on-page y el schema están razonablemente bien hechos para tratarse de un sitio Astro estático sin CMS.

---

## 1. Tipo de negocio detectado

**Service Area Business (SAB)**, correctamente modelado:
- `src/data/site.ts` documenta explícitamente en comentario: *"La dirección no incluye calle a propósito: el negocio opera desde casa, solo se publica la ciudad (Sevilla)"*.
- No hay dirección postal completa en ningún lugar público (footer, contacto, schema). Solo aparece en `/aviso-legal` por obligación LSSI (ver §2).
- Copy consistente de área de servicio: "Sevilla y área metropolitana" (footer, `/contacto`, FAQs de `/diseno-web-sevilla` y `/seo-local-sevilla`).
- No hay embed de Google Maps ni enlace "Cómo llegar" en ninguna página — coherente con SAB, sin penalización aquí.

Este patrón (sin calle, con ciudad + área metropolitana) es correcto para SAB y evita el error típico de "doorway address" o dirección falsa.

---

## 2. Auditoría de consistencia NAP

| Campo | Footer (`Footer.astro`) | `/contacto` | `/aviso-legal` | JSON-LD (`schema.ts`) |
|---|---|---|---|---|
| Nombre | `nuriaromero.dev` (shortName) | `nuriaromero.dev` (shortName) | "Nuria Romero Castillo" (titular legal) | "Nuria Romero — Diseño web y automatizaciones en Sevilla" (SITE.name) |
| Teléfono | 611 812 431 | 611 812 431 | 611 812 431 | `+34611812431` |
| Email | nuriaromero.dev@gmail.com | nuriaromero.dev@gmail.com | nuriaromero.dev@gmail.com | nuriaromero.dev@gmail.com |
| Localidad | "Sevilla y área metropolitana" | "Sevilla, España" | "Camino Andalucía 426, 41309 **La Rinconada**, Sevilla" | `addressLocality: "Sevilla"` |

**Hallazgos:**

- **[BAJO] Nombre inconsistente entre 4 variantes.** El sitio usa indistintamente "nuriaromero.dev", "Nuria Romero Castillo" y "Nuria Romero — Diseño web y automatizaciones en Sevilla" según la página. Ninguna de las tres coincide literalmente con las otras dos. No es grave porque no hay ficha de GBP con la que discrepar todavía, pero **en el momento en que se cree la ficha de GBP, el nombre de la ficha debe fijarse primero y todas las variantes del sitio deben alinearse con ese nombre exacto** (Google exige coincidencia exacta de nombre entre GBP y web).
- **[INFO] Teléfono y email correctos y consistentes** con los datos de referencia proporcionados (+34 611 812 431 / nuriaromero.dev@gmail.com) en las 4 fuentes revisadas. Formato de `tel:` y de schema (`+34611812431`) es válido en formato internacional.
- **[BAJO] Discrepancia de localidad legal vs. comercial.** El aviso legal declara domicilio fiscal en **La Rinconada** (municipio distinto de Sevilla capital, aunque dentro del área metropolitana), mientras el resto del sitio y el schema dicen "Sevilla". Esto es intencional y correcto (el aviso legal exige el domicilio fiscal real, no el área de marketing) y no es una discrepancia de NAP en el sentido SEO, porque el domicilio del aviso legal no se usa como dirección de negocio en ningún NAP público ni en el schema. Se documenta aquí solo para que quede constancia de que, si algún día se crea una ficha de GBP, la dirección de verificación (probablemente La Rinconada) no debe filtrarse como pública si se opera como SAB puro, y "área metropolitana de Sevilla" en el copy sigue siendo veraz.

---

## 3. Schema LocalBusiness / ProfessionalService

Definido en `src/lib/schema.ts` (`localBusinessSchema()`) e inyectado globalmente en `Layout.astro` (aparece en **todas** las páginas del sitio vía `<Schema schema={[localBusinessSchema(), websiteSchema()]} />`). Esto es una buena práctica.

```json
{
  "@type": "ProfessionalService",
  "name": "...", "url": "...", "telephone": "+34611812431", "email": "...",
  "address": { "addressLocality": "Sevilla", "addressRegion": "Andalucía", "addressCountry": "ES" },
  "geo": { "latitude": 37.3826, "longitude": -5.9963 },
  "areaServed": { "@type": "City", "name": "Sevilla" },
  "sameAs": [...]
}
```

- **[INFO] Subtipo correcto.** `ProfessionalService` es válido para un freelance de servicios digitales (no existe un subtipo Schema.org más específico para "diseño web/SEO"; `LocalBusiness`/`ProfessionalService` genérico es lo recomendado en estos casos). No aplica aquí ningún subtipo de la tabla de verticales (`local-schema-types.md`) porque el propio negocio de Nuria no es restaurante/clínica/legal/etc. — esos son los verticales de sus *clientes*, no el suyo.
- **[MEDIO] `address` sin `streetAddress`/`postalCode`.** Es intencional (SAB sin local público) y aceptable en la práctica, pero técnicamente Google marca `streetAddress` y `postalCode` como parte de las propiedades recomendadas del bloque `address`. No es un error a corregir (no se debe publicar una dirección falsa), solo una limitación inherente al modelo SAB que conviene tener presente.
- **[MEDIO] `geo` con 4 decimales, no 5.** `lat: 37.3826, lng: -5.9963` → 4 decimales (~11m de precisión) en vez de los 5 recomendados (~1.1m). Fácil de corregir: ampliar a 5 decimales reales de la ubicación (ej. `37.38260` no basta, hace falta un dato real de 5 decimales, no rellenar con un cero).
- **[MEDIO] `areaServed` demasiado plano.** Solo declara `{"@type": "City", "name": "Sevilla"}`. No incluye:
  - Un `GeoCircle` o `AdministrativeArea` que cubra explícitamente "área metropolitana de Sevilla" (mencionada en el copy pero ausente del schema).
  - Ninguno de los sub-barrios que sí aparecen en el copy (Triana, Nervión, Los Remedios) — ver §5, esto es el mismo problema replicado en schema.
  - `sameAs` a la entidad de Wikipedia/Wikidata de Sevilla, recomendado para SAB según la referencia de schema local (`local-schema-types.md`, sección SAB-specific).
- **[ALTO] Falta `openingHoursSpecification`.** No hay ninguna declaración de horario en ningún schema del sitio. Aunque es una freelance, declarar un horario de atención razonable (aunque sea "L-V 9:00-18:00") es una propiedad recomendada por Google y ayuda a la elegibilidad de rich results.
- **[INFO] Falta `aggregateRating`/`review`.** Coherente con que no hay reseñas todavía (ver §6), no es un error de implementación — `google-reviews.ts` ya está preparado para inyectar `AggregateRating` en cuanto exista una ficha de GBP con reseñas (comentario explícito en el código: *"para AggregateRating en el futuro"*). Es una pieza de infraestructura ya construida y a la espera de datos reales.

---

## 4. Señales de Google Business Profile — el hallazgo principal

**[CRÍTICO] El sitio no evidencia tener una ficha de Google Business Profile propia**, a pesar de venderla activamente como servicio:

- `src/lib/google-reviews.ts` confirma en su propio comentario de cabecera: *"Mientras no exista una ficha de Google Business Profile (o no se hayan configurado las variables de entorno), esto debe devolver `null` (...) es el estado esperado hoy"*. Es decir, está confirmado en el propio código que **hoy no existe ficha de GBP para nuriaromero.dev**.
- No hay embed de Google Maps en ninguna página (`rg` sobre `google.com/maps`, `iframe`, `place_id`, `g.page` no arroja resultados de producto, solo el tipado en `env.d.ts`).
- `SITE.sameAs` (usado también en `personSchema`/`localBusinessSchema`) solo enlaza LinkedIn y GitHub — no hay enlace a un perfil de Google Business ni a una URL `g.page/...`.
- La página `/seo-local-sevilla.astro` explica en detalle qué es una ficha de GBP ("la ficha gratuita de Google que muestra tu negocio en Google Maps...") y afirma haber dado de alta la ficha de dos clientes (Arkady, Adf Sevilla — ver §7), pero en ningún punto del sitio se muestra, enlaza o menciona la ficha de GBP de la propia Nuria Romero.
- Consecuencia de E-E-A-T local: un visitante que llega a `/seo-local-sevilla` buscando contratar el servicio puede razonablemente preguntarse "si esto funciona, ¿por qué no lo tiene ella misma visible?". Es el típico caso de "el zapatero remendón anda descalzo" y debilita la prueba social justo en la página que más la necesita.

### Checklist GBP

| Señal | Estado |
|---|---|
| Ficha de GBP propia detectable | ❌ Ausente (confirmado por comentario en código fuente) |
| Embed de Google Maps | ❌ Ausente |
| Enlace a perfil de Google Business / `g.page` | ❌ Ausente |
| Widget de reseñas de Google | ⚠️ Infraestructura lista (`google-reviews.ts`), sin datos porque no hay ficha |
| Mención de categoría GBP propia | ❌ N/A (no hay ficha) |
| Evidencia de posts / fotos de GBP propio | ❌ N/A |

**Recomendación crítica:** dar de alta la ficha de Google Business Profile propia como categoría primaria correcta (p. ej. "Diseñador de páginas web" o "Consultor de SEO" — la categoría primaria es, según Whitespark 2026, el factor de ranking local #1, y una categoría equivocada es el factor negativo #1), configurar `GOOGLE_PLACES_API_KEY`/`GOOGLE_PLACE_ID` (ya soportado por `google-reviews.ts`) para activar el widget de reseñas real, y enlazarla en `SITE.sameAs`.

---

## 5. Reseñas y reputación

**[CRÍTICO]** No hay ninguna reseña visible, agregada ni individual, en ningún punto del sitio. `getGoogleReviews()` siempre devuelve `null` en el estado actual porque no hay `GOOGLE_PLACE_ID` configurado (no hay ficha). No hay `aggregateRating` en ningún JSON-LD.

- Velocidad de reseñas: no evaluable (0 reseñas, 0 fichas).
- Regla de 18 días (Sterling Sky): no aplica todavía, pero es relevante para cuando se cree la ficha — sin flujo constante de reseñas nuevas cada ~3 semanas, el ranking local sufre un "acantilado" de caída. El propio servicio `/seo-local-sevilla` ya vende "gestión de reseñas" a clientes, así que el mismo criterio debería aplicarse a la ficha propia una vez exista.
- Tasa de respuesta a reseñas: no evaluable.

---

## 6. Prueba social local (casos Arkady y Adf Sevilla)

Ubicación: `/seo-local-sevilla.astro` → `<Projects only={["arkady", "adfsevilla"]} />`, datos en `src/components/Projects.astro`.

| Caso | Enlace verificable | Ubicación mencionada | Testimonio/cita | Métrica de resultado |
|---|---|---|---|---|
| Arkady Celebraciones | ✅ `https://arkadycelebraciones.es/` (enlace live "Preview") | ✅ "barrio del Cerro del Águila, Sevilla" | ❌ Ninguno | ❌ Ninguna |
| Adf Sevilla | ✅ `https://adfsevilla.com/` (enlace live "Preview") | ✅ "barrio del Cerro del Águila, Sevilla" | ❌ Ninguno | ❌ Ninguna |

**[MEDIO]** Ambos casos tienen enlace real y funcional a la web del cliente y mencionan un barrio concreto de Sevilla, lo cual sí aporta señal de "experiencia local real" (E-E-A-T) verificable — un revisor puede visitar el enlace y confirmar que existe. Sin embargo, falta el elemento más persuasivo: **ningún testimonio citado con nombre/cargo del cliente ni ninguna métrica de resultado** (tráfico, posición, reseñas conseguidas, tiempo de carga). Esto ya está identificado internamente: hay un comentario `TODO` explícito en el propio código (`Projects.astro`, línea ~160) que dice textualmente que hay que pedir a estos clientes *"un testimonio/cita real (...) y una métrica de resultado verificable"* antes de publicarlo — es decir, el equipo ya es consciente de esta carencia y la tiene pendiente de resolver con datos reales, no de inventar.

El propio texto de `/seo-local-sevilla` reconoce la limitación con honestidad ("No son casos de éxito de posicionamiento con cifras de ranking o tráfico, porque este servicio es nuevo"), lo cual es coherente y evita afirmaciones no verificables, pero deja la página de venta del servicio de SEO local sin ningún resultado cuantificado que mostrar.

---

## 7. Cobertura de sub-zonas de Sevilla (Triana, Nervión, Los Remedios)

Estas tres zonas aparecen citadas como ejemplos de búsqueda dentro del copy, pero de forma **suelta y sin refuerzo estructural**:

| Zona | Dónde aparece | H1/H2 dedicado | En URL | En schema `areaServed` |
|---|---|---|---|---|
| Triana | FAQ de restaurantes (`niches.ts:29`), FAQ de SEO local (`services.ts:552`) | ❌ | ❌ | ❌ |
| Nervión | Beneficio de clínicas (`niches.ts:129`), FAQ clínicas (`niches.ts:168`), FAQ home (`index.astro:52`) | ❌ | ❌ | ❌ |
| Los Remedios | Beneficio de comercios (`niches.ts:221`) | ❌ | ❌ | ❌ |

**[MEDIO]** Las 4 páginas de nicho + `/seo-local-sevilla` cubren bien la ciudad de Sevilla como conjunto, pero **no cubren los sub-barrios de forma consistente ni reforzada**: son menciones incidentales dentro de párrafos de FAQ o listas de beneficios, nunca en un H2 dedicado, nunca en la URL/slug, y nunca reflejadas en el `areaServed` del schema (que solo dice `City: Sevilla`, sin barrios). Esto es coherente con el enfoque "SAB sin páginas de doorway por barrio" (evita el riesgo de páginas finas duplicadas), pero deja sobre la mesa una oportunidad real: dado que "Whitespark 2026" señala las páginas de servicio dedicadas como el factor #1 de SEO local orgánico y el #2 de visibilidad en IA, una sección de FAQ o un bloque "Sevilla y su área metropolitana: Triana, Nervión, Los Remedios, Cerro del Águila..." con enlace interno reforzaría sin necesidad de crear páginas de barrio de bajo valor.

No se detecta "doorway page swap test" aplicable — no hay páginas por localización, así que no hay riesgo de contenido duplicado por ciudad/barrio (esto es correcto para un SAB centrado en una sola área metropolitana).

---

## 8. Citas en directorios Tier 1

No se ha podido consultar Yelp/BBB en vivo (sin acceso API ni fetch autorizado a servicios externos en esta auditoría). No hay ningún enlace saliente desde el sitio hacia Yelp, BBB, Páginas Amarillas ni ningún directorio local en `SITE.sameAs` ni en el resto del código. Para un freelance de servicios digitales en España, los directorios Tier 1 más relevantes no son Yelp/BBB (poco usados en España para este vertical) sino: **Google Business Profile** (crítico, ausente — ver §4), y opcionalmente perfiles profesionales tipo **LinkedIn** (sí presente) y directorios sectoriales de desarrollo/diseño (no detectados).

**[INFO]** 3 de los 5 factores de visibilidad en IA (Whitespark 2026) están relacionados con citas — la ausencia total de citas locales (más allá de LinkedIn/GitHub) es una brecha relevante también de cara a GEO, que es justamente lo que el sitio vende a terceros.

---

## 9. Calidad de páginas de ubicación (multi-location)

No aplica: el sitio no es multi-ubicación (una sola área de servicio, Sevilla + metro). No se detectan páginas de doorway ni contenido duplicado por ciudad.

---

## Top 10 acciones priorizadas

1. **[CRÍTICO]** Crear y verificar una ficha de Google Business Profile propia, con categoría primaria correcta (p. ej. "Diseñador de páginas web" / "Consultor de marketing"), antes de seguir vendiendo el servicio de GBP a terceros. Es el factor de ranking local #1 y su ausencia es la brecha más visible de la auditoría.
2. **[CRÍTICO]** Configurar `GOOGLE_PLACES_API_KEY` y `GOOGLE_PLACE_ID` (ya soportado por `google-reviews.ts`) en cuanto exista la ficha, para activar reseñas reales y `aggregateRating` en el schema.
3. **[CRÍTICO]** Enlazar la ficha de GBP propia en `SITE.sameAs` y, si procede, embeber el widget/enlace de Maps en `/contacto` o `/seo-local-sevilla` como prueba de "predicar con el ejemplo".
4. **[ALTO]** Añadir `openingHoursSpecification` al schema `ProfessionalService` en `src/lib/schema.ts`.
5. **[ALTO]** Pedir a Arkady Celebraciones y Adf Sevilla el testimonio con nombre/cargo y una métrica verificable pendientes (ya marcado como `TODO` en `Projects.astro`) antes de ampliar la prueba social del servicio de SEO local.
6. **[MEDIO]** Ampliar `geo` a 5 decimales reales de precisión en `src/data/site.ts`.
7. **[MEDIO]** Enriquecer `areaServed` en `localBusinessSchema()`/`serviceSchema()` con un `GeoCircle`/`AdministrativeArea` para "área metropolitana de Sevilla" y considerar `sameAs` a Wikidata/Wikipedia de Sevilla.
8. **[MEDIO]** Reforzar Triana, Nervión, Los Remedios (y Cerro del Águila) con un bloque dedicado (H2 o sección de zonas) enlazado internamente desde `/seo-local-sevilla` y las páginas de nicho relevantes, en vez de dejarlas solo como ejemplos sueltos dentro de FAQs.
9. **[BAJO]** Unificar el nombre de marca ("nuriaromero.dev" vs "Nuria Romero Castillo" vs "Nuria Romero — Diseño web...") antes de crear la ficha de GBP, para que coincida exactamente con el nombre que se registre en Google.
10. **[BAJO]** Evaluar citas en directorios profesionales/sectoriales relevantes para España (más allá de LinkedIn/GitHub) para reforzar señales de autoridad local y GEO.

---

## Limitaciones de esta auditoría

- No se ha llamado a la API de Google Business Profile ni a Google Maps: no hay credenciales configuradas, tal y como confirma el propio código (`google-reviews.ts`). El análisis de GBP se basa 100% en señales indirectas del código fuente (ausencia de embeds, enlaces, variables de entorno y el comentario explícito del desarrollador).
- No se ha consultado Yelp/BBB ni otros directorios en vivo (sin fetch externo autorizado en esta auditoría); la sección de citas se basa solo en enlaces salientes presentes en el propio repositorio.
- No se ha medido la proximidad geográfica real de posibles buscadores (55.2% de la varianza de ranking local según Search Atlas) — está fuera del control del sitio y no es auditable desde el código.
- No se ha verificado el renderizado final en producción (build/deploy); todo el análisis parte del código fuente `.astro`/`.ts` del repo, asumiendo que se refleja fielmente en el HTML servido.
