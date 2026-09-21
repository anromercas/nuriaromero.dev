# Clustering semántico y canibalización — nuriaromero.dev

Análisis de solo lectura sobre `src/data/niches.ts`, `src/data/services.ts`, `src/content/blog/*.md`, `src/layouts/ServiceLayout.astro`, `src/layouts/BlogPostLayout.astro`, `src/components/services/FAQ.astro` y grep global de `href=` en `src/pages` y `src/components`. No se ha modificado ningún archivo del sitio.

**Puntuación de salud del clúster semántico: 38/100** (100 = sin riesgo, 0 = canibalización severa). Riesgo alto, pero mayoritariamente **latente/estructural** todavía: el `site:nuriaromero.dev` actual apenas tiene indexadas más páginas que la home (confirmado por búsqueda web), lo que es coherente con que estas páginas y FAQs son de publicación muy reciente. Esto es una ventana de oportunidad, no una señal de que el riesgo no exista: en cuanto Google rastree e indexe las 7 páginas de nicho/servicio y los 4 posts, la arquitectura actual generará competencia interna real por las mismas consultas.

---

## 1. Hallazgo confirmado y cuantificado: FAQ "SEO local por sector" duplicada en las 4 páginas de nicho

**Severidad: Alta**

Las 4 páginas de nicho (`restaurantes`, `clinicas`, `comercios`, `profesionales` en `src/data/niches.ts`) contienen una FAQ con patrón idéntico:

- Restaurantes (línea 83): *"¿Cómo consigo que mi restaurante aparezca cuando alguien busca «restaurante cerca de mí»...?"*
- Clínicas (línea 183): *"¿Cómo consigo que aparezca mi clínica cuando alguien busca mi especialidad cerca de su casa?"*
- Comercios (línea 283): *"¿Cómo consigo que me encuentren los clientes de mi barrio cuando buscan en Google?"*
- Profesionales (línea 383): *"¿Cómo consigo que me encuentren cuando alguien busca «abogado [especialidad] Sevilla» o «gestoría cerca de mí»?"*

Las 4 respuestas comparten estructura textual casi calcada (solo cambia el sustantivo del sector):

> Restaurantes: *"Esa búsqueda depende sobre todo de tres cosas: que tu ficha de Google Business Profile esté completa y actualizada (...), que tu web tenga los datos estructurados que indican a Google dónde estás y qué ofreces, y que tengas reseñas recientes. La web que te entrego incluye esa base de SEO local para tu zona de Sevilla desde el primer día. Si además quieres un trabajo continuado cada mes (...), tengo un servicio aparte de SEO local que puedes consultar en /seo-local-sevilla."*

> Clínicas: *"Depende sobre todo de tres cosas: que cada tratamiento tenga su propia página bien optimizada (...), que tu ficha de Google Business Profile esté completa y con la categoría correcta, y que tengas reseñas de pacientes gestionadas con regularidad. La web que te entrego incluye esa base de SEO local por especialidad y zona desde el lanzamiento. Si además quieres un trabajo mensual continuado (...), tengo un servicio aparte de SEO local que puedes consultar en /seo-local-sevilla."*

> Comercios y Profesionales siguen exactamente el mismo esqueleto de 3 frases (factores → "la web que te entrego incluye esa base" → "si además quieres un trabajo mensual continuado (...) tengo un servicio aparte de SEO local que puedes consultar en /seo-local-sevilla").

Estimación de solape textual entre las 4 respuestas: ~80-85% de la estructura sintáctica y del léxico es idéntica (mismos 3 factores, mismo orden, misma frase de cierre citando `/seo-local-sevilla`, solo cambian sustantivos de sector). Esto no es solape de SERP (no verificable de forma fiable porque las páginas aún no están indexadas), sino solape de **intención y de plantilla de contenido**: las 4 páginas están, en el fondo, tratando de poseer la misma sub-intención ("SEO local para mi sector en Sevilla") con el mismo argumentario, en vez de que cada nicho aporte una respuesta realmente específica de su sector.

**Por qué es un riesgo real:** Google puede tratar bloques FAQ casi calcados en URLs distintas como contenido plantillado de bajo valor diferencial (boilerplate), lo que diluye la relevancia temática de cada página de nicho para su propia cola larga y refuerza, en cambio, una señal ambigua de "SEO local" repartida entre 5 URLs (las 4 de nicho + `/seo-local-sevilla`) para consultas del tipo "seo local para restaurantes sevilla" o "cómo aparecer en Google cerca de mí [sector]".

**Agravante crítico — el enlace citado NO es un hiperenlace real.** `src/components/services/FAQ.astro` línea 19 renderiza la respuesta como texto plano:
```astro
<p class="mt-3 text-gray-700 dark:text-gray-400">{faq.a}</p>
```
Astro escapa `{faq.a}` como nodo de texto, no como HTML. Por tanto, la cadena `/seo-local-sevilla` que aparece en las 4 respuestas se muestra como **texto plano no clicable**, sin `<a href>`. Consecuencia: las 4 páginas de nicho no envían ningún enlace interno real (ni para usuarios ni para el rastreador) hacia `/seo-local-sevilla`, a pesar de que el contenido cita explícitamente ese servicio 4 veces. Es la peor combinación posible: contenido casi duplicado que compite por la misma intención, sin que el enlazado interno mitigue esa competencia dirigiendo autoridad hacia el hub correcto.

**Verificado también en el resto de FAQs de precio:** el mismo patrón de cita sin enlazar aparece en la pregunta "¿Cuánto cuesta...?" de las 4 páginas de nicho, todas mencionan "399 €" con redacción muy similar entre sí y con `/diseno-web-sevilla` (que también fija "399 €" como precio de la web completa), sin ningún enlace real entre ellas tampoco.

---

## 2. Canibalización de keyword transaccional: blog vs. página de servicio

**Severidad: Alta** en el caso de precio; **Media** en el resto.

| Post de blog | Título / keyword objetivo | Página de servicio más cercana | Keyword objetivo de la página | Solape |
|---|---|---|---|---|
| `/blog/cuanto-cuesta-una-pagina-web-en-sevilla` | "¿Cuánto cuesta una página web en Sevilla? Qué influye en el precio" | `/diseno-web-sevilla` | H2 de sección: "Cuánto cuesta una página web en Sevilla" + FAQ "¿Cuánto cuesta una página web en Sevilla?" | **Coincidencia casi literal de título/FAQ entre dos URLs indexables.** Ambas apuntan a la misma consulta cabeza ("cuánto cuesta página web Sevilla"), con matiz de intención (post = informativo/comparativo, sin cifra de agencia propia; página = transaccional con "399 €"/"149 €"). El matiz de intención no es suficiente por sí solo para que Google las trate como no competidoras: es la misma pregunta, casi la misma redacción de titular. |
| `/blog/pagina-web-para-restaurantes-que-necesita` | "Página web para tu restaurante: qué necesita de verdad (y qué no)" | `/web-para-restaurantes-sevilla` | H1: "Página web para restaurantes y bares en Sevilla" | Solape moderado: el post no incluye "Sevilla" en el título (solo en meta description), enfoque informativo puro ("qué necesita", sin precio). Correctamente enlaza a la página de nicho con ancla descriptiva: *"He preparado una página específica con todo lo que incluye [una web para restaurantes en Sevilla](/web-para-restaurantes-sevilla)"*. Este es el único caso de los 4 posts donde el enlazado blog→servicio está bien resuelto. |
| `/blog/como-aparecer-en-google-maps-negocio-sevilla` | "Cómo aparecer en Google Maps si tienes un negocio en Sevilla (guía práctica)" | `/seo-local-sevilla` (temáticamente) pero enlaza solo a `/diseno-web-sevilla` | H1: "SEO local en Sevilla para negocios que quieren clientes..." | **Solape alto de intención y enlazado incorrecto.** El post trata exactamente el mismo núcleo temático que vende `/seo-local-sevilla` (ficha de Google Business Profile, datos estructurados, reseñas — los mismos 3 factores citados en la FAQ repetida de las 4 páginas de nicho) y es el post con mayor probabilidad de captar la consulta "cómo aparecer en Google Maps sevilla" / "seo local sevilla". Sin embargo, el único enlace de servicio que coloca (línea 48) es hacia `/diseno-web-sevilla` ("Este último punto es donde una web bien hecha marca la diferencia"), no hacia `/seo-local-sevilla`. Es decir: el post mejor posicionado para alimentar el hub de SEO local no le pasa autoridad ni tráfico contextual a ese hub. |
| `/blog/que-es-geo-posicionamiento-ia-negocios-sevilla` | "Qué es el GEO y por qué tu negocio en Sevilla debería prestarle atención" | `/seo-local-sevilla` | — | Correcto: enlaza tanto a `/seo-local-sevilla` como a `/diseno-web-sevilla` con anclas claras y diferenciadas. Es el mejor ejemplo de enlazado blog→servicio del sitio. |

**Conclusión del punto 2:** 2 de 4 posts alimentan bien a su página de servicio; 1 tiene solape de título/FAQ severo con una página transaccional (precio); 1 enlaza al servicio equivocado dado su tema real.

---

## 3. Evaluación de la arquitectura de enlazado interno actual

**Severidad: Alta (estructural)**

Se ha hecho `rg -n "href=\"/(web-para|seo-local-sevilla|diseno-web-sevilla|tienda-online-sevilla)"` sobre todo `src/pages`, `src/components` y `src/content/blog`. Resultado:

- **Cero enlaces** desde la navegación (`Header.astro`), el pie de página (`Footer.astro` solo enlaza a `/blog`) o la home (`index.astro`) hacia cualquiera de las 4 páginas de nicho o las 3 páginas de servicio (`diseno-web-sevilla`, `seo-local-sevilla`, `tienda-online-sevilla`). No existe un menú de "Servicios" ni un listado de nichos.
- **Cero enlaces** entre las 4 páginas de nicho entre sí (ninguna referencia cruzada tipo "si tienes un comercio con reservas, mira también...").
- **Cero enlaces** entre `/web-para-comercios-sevilla` y `/tienda-online-sevilla`, a pesar de que ambas páginas comparten casi el mismo argumentario de ecommerce (ver punto 4).
- Los únicos enlaces internos hacia estas 7 páginas provienen de: (a) las citas de texto plano no clicable dentro de las FAQ (ver punto 1, no cuentan como enlace real), y (b) 3 de los 4 posts del blog (ver tabla del punto 2).
- `ServiceLayout.astro` no tiene ningún slot ni componente de "servicios relacionados" o "también te puede interesar": la plantilla no contempla enlazado cruzado entre páginas hermanas. Es una limitación de plantilla, no solo de contenido.
- `BlogPostLayout.astro` tampoco tiene sección de "posts relacionados" ni bloque estructural de CTA contextual a servicios: cualquier enlace hacia servicios depende de que el redactor lo añada manualmente en el cuerpo del Markdown (por eso 1 de los 4 posts no lo hace correctamente).

**Conclusión:** las 7 páginas de nicho/servicio son efectivamente huérfanas de la navegación principal y dependen casi por completo de que el blog las enlace bien, cosa que ocurre en 3 de 4 casos y falla justo en el caso más temáticamente crítico (Google Maps → SEO local).

---

## 4. Solape adicional detectado: `/web-para-comercios-sevilla` vs. `/tienda-online-sevilla`

**Severidad: Alta**

No estaba en la lista de hallazgos ya confirmados por el usuario, pero el análisis de contenido lo confirma como el segundo caso más grave del sitio:

- Beneficio de `comercios` (niches.ts, línea 228): *"Venta online sin comisión de marketplace — Si quieres dar el salto, tienda online propia (WooCommerce o similar): no pagas comisión por venta a un marketplace..."*
- Beneficio de `tiendaOnline` (services.ts, línea 630): *"Tienda propia, sin comisión de marketplace — Vender en un marketplace o en una plataforma de terceros suele significar pagar una comisión por cada venta..."*

Mismo insight, mismo orden argumental, mismo título de beneficio casi literal ("sin comisión de marketplace").

- FAQ de `comercios`: *"¿Necesito una tienda online o me basta con un catálogo?"* y *"¿Cuánto cuesta una tienda online?"* — con la respuesta: *"Una tienda online completa con pasarela de pago y gestión de envíos se presupuesta aparte según el número de productos..."*
- FAQ de `tiendaOnline`: *"¿Cuánto cuesta una tienda online en Sevilla?"* — respuesta: *"No existe un precio único de tienda online, porque el coste depende directamente de cuántos productos vas a vender..."*

Ambas páginas responden la misma pregunta ("cuánto cuesta una tienda online") con el mismo mensaje de fondo (no hay precio fijo, depende del catálogo, presupuesto cerrado tras auditoría), y **no existe ningún enlace entre ambas páginas** (confirmado por grep). Un usuario o un rastreador que llega a `/web-para-comercios-sevilla` buscando vender online no es dirigido nunca a la página que sí está optimizada específicamente para ecommerce (`/tienda-online-sevilla`), y viceversa. Riesgo de que ambas compitan por consultas como "tienda online sevilla" / "vender online sevilla" / "ecommerce comercio sevilla" sin reforzarse.

---

## 5. Riesgo de ambigüedad de intención: "página web para mi negocio en Sevilla"

Para una consulta genérica ambigua como "página web para mi negocio en sevilla" o "diseño web sevilla", el sitio tiene **5 páginas candidatas** con propuesta de valor solapada en su núcleo (web local + SEO local + precio desde 399€/149€): las 4 de nicho + `/diseno-web-sevilla`. Esto no es necesariamente negativo si Google entiende `/diseno-web-sevilla` como el hub genérico y las 4 de nicho como sub-intenciones claramente diferenciadas (restaurante, clínica, comercio, despacho) — ese es justamente el patrón correcto de hub-and-spoke. El problema no es que existan 5 páginas, sino que:

1. No hay enlazado explícito que le diga a Google (y al usuario) "esto es un hub con 4 spokes", porque `/diseno-web-sevilla` no enlaza a ninguna de las 4 páginas de nicho ni ellas a él más allá de las citas de precio en texto plano.
2. La FAQ de SEO local repetida (punto 1) diluye la diferenciación sectorial precisamente en el punto donde más se necesitaría (la pregunta de "cómo aparecer cuando buscan cerca de mí").

Para "seo local para restaurantes sevilla" (u otros sectores), hay **doble candidatura real**: la propia página de nicho (que menciona SEO local en sus benefits y en la FAQ) y `/seo-local-sevilla` (que es genérica, sin sección ni mención por sector). Ninguna gana claramente porque ninguna enlaza a la otra de forma clicable.

---

## 6. Arquitectura de clúster hub-and-spoke propuesta

### Hubs

- **Hub 1 — "Diseño web Sevilla" (`/diseno-web-sevilla`)**: hub genérico de diseño/desarrollo web local. Debe enlazar (con ancla descriptiva, en una nueva sección "¿Tienes un negocio de un sector concreto?") a las 4 páginas de nicho como spokes.
- **Hub 2 — "SEO local / GEO Sevilla" (`/seo-local-sevilla`)**: hub único para toda intención de "aparecer en Google / Maps / IA cerca de mí", sea cual sea el sector. Ningún spoke debe intentar poseer esta intención por su cuenta.

### Spokes de Hub 1 (diseño web por sector)

- `/web-para-restaurantes-sevilla`
- `/web-para-clinicas-sevilla`
- `/web-para-comercios-sevilla`
- `/web-para-abogados-gestorias-sevilla`
- `/tienda-online-sevilla` (spoke transaccional de ecommerce, con enlace bidireccional específico con `/web-para-comercios-sevilla`, ver más abajo)

### Spokes de Hub 2 (contenido blog, todo GEO/SEO local)

- `/blog/como-aparecer-en-google-maps-negocio-sevilla`
- `/blog/que-es-geo-posicionamiento-ia-negocios-sevilla`

### Spoke de precio (feeder de Hub 1)

- `/blog/cuanto-cuesta-una-pagina-web-en-sevilla` — reposicionar como pieza puramente informativa/comparativa ("cómo comparar presupuestos", sin FAQ que replique literalmente la pregunta transaccional de `/diseno-web-sevilla`) y reforzar como feeder, no como competidor.

### Spoke de nicho con contenido propio

- `/blog/pagina-web-para-restaurantes-que-necesita` — ya correcto, mantener como feeder de `/web-para-restaurantes-sevilla`.

### Cambio de contenido requerido (no solo de enlaces)

1. **Reescribir la FAQ "¿Cómo consigo que aparezca...?" en las 4 páginas de nicho** para que cada una dé una respuesta realmente específica del sector (p. ej. para clínicas, enfatizar categorías de Google por especialidad y reseñas de pacientes con matices RGPD ya presentes en otras FAQs de esa misma página; para restaurantes, enfatizar fotos y reseñas de plato) en vez de repetir la misma plantilla de 3 factores, y terminar con **un enlace real** (`<a href="/seo-local-sevilla">`) en vez de solo citar la ruta como texto.
2. **Corregir `FAQ.astro`** para que `faq.a` admita renderizado de enlaces (por ejemplo aceptando fragmentos con `set:html` tras sanitizar, o dividiendo la respuesta en texto + un array opcional de CTAs/enlaces) — actualmente es técnicamente imposible enlazar desde una respuesta de FAQ en todo el sitio, no solo en estos 4 casos.
3. **Diferenciar la FAQ de precio** en `/diseno-web-sevilla` frente al post de precio del blog, o fusionar mensajes: el post debe posicionarse explícitamente como "cómo comparar presupuestos" (ya lo hace parcialmente) y el H2/FAQ de la página de servicio debe mantenerse como la respuesta transaccional con cifra concreta; evitar que ambas usen el enlace de anchor casi calcado "¿Cuánto cuesta una página web en Sevilla?" como titular literal en los dos sitios.

---

## 7. Matriz de enlazado interno propuesta

Leyenda: **M** = obligatorio (mandatory), **R** = recomendado, **O** = opcional.

| Origen | Destino | Tipo | Motivo |
|---|---|---|---|
| `/web-para-restaurantes-sevilla` | `/seo-local-sevilla` | M | Enlace real (hipervínculo) en la FAQ de SEO local, hoy es texto plano |
| `/web-para-clinicas-sevilla` | `/seo-local-sevilla` | M | Idem |
| `/web-para-comercios-sevilla` | `/seo-local-sevilla` | M | Idem |
| `/web-para-abogados-gestorias-sevilla` | `/seo-local-sevilla` | M | Idem |
| `/seo-local-sevilla` | 4 páginas de nicho | R | Sección "SEO local por sector" con 4 enlaces de salida, para reforzar que el hub cubre todos los sectores sin duplicar contenido |
| `/diseno-web-sevilla` | 4 páginas de nicho + `/tienda-online-sevilla` | M | Sección "¿Tienes un negocio de un sector concreto?" — hoy no existe ningún enlace saliente desde el hub genérico hacia sus spokes |
| 4 páginas de nicho | `/diseno-web-sevilla` | M | Enlace de vuelta al hub genérico (breadcrumb ya lo hace a "Inicio", pero no al hub de servicio) |
| `/web-para-comercios-sevilla` | `/tienda-online-sevilla` | M | Actualmente 0 enlaces; son las dos páginas con mayor solape de mensaje del sitio |
| `/tienda-online-sevilla` | `/web-para-comercios-sevilla` | M | Idem, bidireccional |
| `/blog/como-aparecer-en-google-maps-negocio-sevilla` | `/seo-local-sevilla` | M | Corregir: hoy enlaza solo a `/diseno-web-sevilla`, siendo el post temáticamente más alineado con SEO local |
| `/blog/como-aparecer-en-google-maps-negocio-sevilla` | `/diseno-web-sevilla` | R | Mantener como enlace secundario (ya existe) |
| `/blog/cuanto-cuesta-una-pagina-web-en-sevilla` | `/diseno-web-sevilla` | M | Ya existe, mantener |
| `/blog/cuanto-cuesta-una-pagina-web-en-sevilla` | 4 páginas de nicho | O | Añadir 1-2 enlaces contextuales ("si tienes un restaurante, mira el precio específico aquí") para repartir la intención transaccional hacia el spoke correcto |
| `/blog/pagina-web-para-restaurantes-que-necesita` | `/web-para-restaurantes-sevilla` | M | Ya existe, mantener |
| `/blog/que-es-geo-posicionamiento-ia-negocios-sevilla` | `/seo-local-sevilla` | M | Ya existe, mantener |
| `/blog/que-es-geo-posicionamiento-ia-negocios-sevilla` | `/diseno-web-sevilla` | R | Ya existe, mantener |
| Navegación principal (`Header.astro`) | `/diseno-web-sevilla`, `/seo-local-sevilla` | M | Actualmente ninguna de las 7 páginas de nicho/servicio es alcanzable desde el menú; al menos los 2 hubs deberían estar en navegación |
| Home (`index.astro`) | 2 hubs + listado de 4 nichos | R | Reforzar descubribilidad; hoy la home no enlaza a ninguna de las 7 páginas |

---

## 8. Comprobación de cannibalización (resumen de pares en riesgo)

| Par de páginas | Keyword en disputa | Riesgo | Evidencia |
|---|---|---|---|
| `/diseno-web-sevilla` ↔ `/blog/cuanto-cuesta-una-pagina-web-en-sevilla` | "cuánto cuesta una página web en sevilla" | Alto | Título/FAQ casi literal en ambas URLs |
| Las 4 páginas de nicho ↔ `/seo-local-sevilla` | "seo local [sector] sevilla" / "aparecer en google cerca de mí [sector]" | Alto | FAQ con estructura idéntica en las 4 + cero enlace real hacia el hub |
| `/web-para-comercios-sevilla` ↔ `/tienda-online-sevilla` | "tienda online sevilla" | Alto | Beneficio y FAQ de precio casi calcados, 0 enlaces cruzados |
| `/blog/como-aparecer-en-google-maps-negocio-sevilla` ↔ `/seo-local-sevilla` | "cómo aparecer en google maps sevilla" | Medio-alto | Mismo núcleo temático (GBP, datos estructurados, reseñas), pero el post enlaza al hub equivocado |
| `/blog/pagina-web-para-restaurantes-que-necesita` ↔ `/web-para-restaurantes-sevilla` | "página web para restaurante" | Bajo | Bien resuelto: intención informativa vs. transaccional, con enlace correcto |
| `/blog/que-es-geo-posicionamiento-ia-negocios-sevilla` ↔ `/seo-local-sevilla` | "geo / seo local sevilla" | Bajo | Bien resuelto: post 100% informativo, enlaza correctamente al hub |

---

## 9. Puntuación y desglose

**38/100**

- -20 puntos: FAQ de "SEO local por sector" casi duplicada en las 4 páginas de nicho, citando el mismo hub sin enlazarlo realmente (bug de `FAQ.astro` que impide cualquier hipervínculo en respuestas FAQ, no solo aquí).
- -15 puntos: coincidencia de título/FAQ entre `/diseno-web-sevilla` y el post de precio del blog, dos URLs indexables persiguiendo la misma pregunta cabeza.
- -15 puntos: solape de valor/FAQ entre `/web-para-comercios-sevilla` y `/tienda-online-sevilla` sin ningún enlace cruzado.
- -7 puntos: ausencia total de navegación/homepage hacia las 7 páginas de nicho/servicio (huérfanas de arquitectura, dependientes solo del blog).
- -5 puntos: el post de Google Maps enlaza al hub equivocado (diseño web en vez de SEO local).
- +15 puntos de mitigación: 2 de los 4 posts del blog ya enlazan correctamente a su página de servicio con ancla descriptiva, y las páginas de nicho sí tienen diferenciación real de contenido en sus otras 7 FAQs (no genéricas) y en sus benefits/process/pricing (buen copy sectorial fuera del bloque de SEO local repetido).
- El riesgo es hoy mayoritariamente latente porque la indexación de estas páginas todavía es incipiente (no se ha podido confirmar solape real de SERP vía `site:` search, que solo devuelve la home): es el momento de corregir antes de que Google fije señales de canonicalización entre estas URLs.
