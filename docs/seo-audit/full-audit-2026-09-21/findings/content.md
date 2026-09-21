# Content Quality — nuriaromero.dev (auditoría 2026-09-21)

Alcance: home (`/`), 4 páginas de nicho (`/web-para-restaurantes-sevilla`, `/web-para-clinicas-sevilla`, `/web-para-comercios-sevilla`, `/web-para-abogados-gestorias-sevilla`), 2 páginas nuevas (`/seo-local-sevilla`, `/tienda-online-sevilla`), `/diseno-web-sevilla`, post de blog `/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/`, `/sobre-mi`. Fuentes leídas: `src/data/niches.ts`, `src/data/services.ts`, `src/data/site.ts`, `src/pages/*.astro`, `src/content/blog/*.md`, `src/components/AboutMe.astro`, `.agents/product-marketing-context.md`.

## Puntuación global: Content Quality = 68/100

Nota metodológica: no es contenido AI-spam plantillado sin criterio — hay voz, restricciones de claims respetadas y profundidad temática real (399€ min. de contenido por nicho supera de sobra el mínimo de 800 palabras para service page). El descuento viene sobre todo de trustworthiness/experiencia (E-E-A-T) más débil de lo que el resto de la calidad del copy sugiere, y de un patrón de contenido plantillado (boilerplate) que un rater humano de la QRG de sept-2025 marcaría como "mismo mensaje, ligera reescritura, repetido varias veces" — el marcador explícito de "repetitive structure across pages" que la propia guía pide vigilar.

## E-E-A-T breakdown

| Factor | Peso | Puntuación | Justificación |
|---|---|---|---|
| Experience | 20% | 55/100 | Solo 2 casos reales (Arkady Celebraciones, Adf Sevilla), citados sin fecha ni resultado cuantificado, y explícitamente "no son casos de éxito de posicionamiento con cifras" (correcto por honestidad, pero deja el SEO local sin ninguna prueba de experiencia de primera mano en ese servicio concreto, que es nuevo). El resto de páginas de nicho no aportan ninguna experiencia de primera mano específica del sector (ej. no hay ningún caso real de restaurante o clínica, solo el genérico Arkady/Adf reutilizado en todas). |
| Expertise | 25% | 72/100 | `/sobre-mi` y `AboutMe.astro` dan credenciales técnicas verificables (+10 años, NTT DATA, stacks concretos, Schema.org `Person`). Los textos de servicio muestran conocimiento técnico correcto (Core Web Vitals bien explicado, RGPD, alérgenos UE, deontología de abogados). Pero esa expertise no está firmada en cada página de nicho ni en el post de blog — no hay bylines, y el blog no enlaza a `/sobre-mi` ni muestra autoría explícita en la propia entrada. |
| Authoritativeness | 25% | 58/100 | Sin señales externas: no hay reseñas de clientes citadas con nombre, ni menciones de prensa/gremios, ni backlinks reales. `sameAs` en `site.ts` solo enlaza LinkedIn y GitHub personales, no perfiles de negocio con reputación (no hay Google Business Profile del propio negocio enlazado, irónico dado que el servicio nuevo es justo optimizar GBP de terceros). El clúster de 4 páginas de nicho + `/seo-local-sevilla` reparte la misma autoridad temática "SEO local" en 5 URLs distintas en vez de concentrarla (ver hallazgo #1). |
| Trustworthiness | 30% | 78/100 | Punto fuerte: NIF, domicilio fiscal y titular real en `site.ts` (aunque solo se exponen en páginas legales, no en el footer — ver nota abajo), precio cerrado repetido de forma consistente, restricciones de claims (posición en Google, velocidad exacta) respetadas en TODO el contenido revisado, RGPD mencionado con matices correctos y derivado a asesoría cuando corresponde, deontología de abogados tratada con precisión legal razonable para contenido no jurídico. |

**E-E-A-T ponderado: (55×0.20)+(72×0.25)+(58×0.25)+(78×0.30) = 67.9/100**

## AI citation readiness (GEO): 74/100

- Positivo: FAQPage JSON-LD (`faqSchema` en `ServiceLayout.astro`, confirmado en `src/lib/schema.ts`) presente en todas las páginas de nicho y de servicio → las preguntas son técnicamente extraíbles.
- Positivo: mensaje de negocio explícito sobre GEO (`/seo-local-sevilla`, post de blog) con definición correcta de "Generative Engine Optimization" y ejemplos concretos (ChatGPT, Perplexity, AI Overviews).
- Negativo (severidad media): las respuestas de FAQ que superan 100-130 palabras en un solo párrafo sin sub-frases cortas ni la respuesta directa en la primera oración reducen la "citabilidad": un LLM que resume para dar una respuesta corta tiene que extraer y comprimir en vez de citar casi literal. Ver hallazgo #4.
- Negativo (severidad baja-media): la respuesta a "¿Qué es el GEO...?" en `/seo-local-sevilla` y el post de blog dedicado a exactamente esa pregunta compiten por la misma intención informacional citable (ver hallazgo #3).

## Hallazgos

### 1. [Severidad: Media-Alta] Plantilla estructural + boilerplate literal repetido 4 veces en las páginas de nicho — diluye autoridad de `/seo-local-sevilla`

**Evidencia.** Las 4 páginas de `src/data/niches.ts` comparten exactamente la misma arquitectura: 4 `benefits`, 4 `process` (mismo patrón "hablamos/propuesta cerrada/diseño-montaje/lanzamiento"), 1 tier de `pricing` a 399 €, 8 FAQs con el mismo orden temático (precio → gestión propia → objeción "ya estoy en [plataforma X]" → reseñas/casos especiales → **"cómo aparezco cuando buscan cerca de mí"** → 3 FAQs específicas del sector). Esto no es intrínsecamente malo (es difícil evitarlo en páginas de nicho con la misma oferta base), pero el patrón se vuelve un problema QRG cuando la respuesta de la FAQ nº5 es casi el mismo texto reescrito con sinónimos en las 4 páginas:

- Restaurantes: *"tengo un servicio aparte de SEO local que puedes consultar en /seo-local-sevilla. No es obligatorio contratarlo para tener una web bien optimizada: es una opción para quien quiere ir un paso más allá."*
- Clínicas: *"tengo un servicio aparte de SEO local que puedes consultar en /seo-local-sevilla. No hace falta contratarlo para tener una web bien planteada: es una opción para quien quiere ir sumando visibilidad mes a mes."*
- Comercios: *"tengo un servicio aparte de SEO local que puedes consultar en /seo-local-sevilla. No es imprescindible contratarlo para tener una web bien optimizada: es una opción para quien quiere seguir ganando visibilidad mes a mes."*
- Profesionales: *"tengo un servicio aparte de SEO local que puedes consultar en /seo-local-sevilla. No es necesario contratarlo para tener una web bien planteada: es una opción para quien quiere sumar visibilidad de forma continuada."*

Las cuatro respuestas completas (no solo esta frase final) siguen también la misma fórmula de 3 pasos ("depende sobre todo de [ficha GBP completa] + [datos estructurados/página específica] + [reseñas recientes]") con vocabulario del sector intercambiado. No es contenido duplicado verbatim (Copyscape/similaridad textual no lo detectaría como plagio), pero es exactamente el patrón que la QRG de septiembre 2025 pide vigilar en contenido generado o semi-generado: **"repetitive structure across pages"** y **"no original insight"** en esa sección concreta — la variación es léxica, no conceptual.

**Riesgo real evaluado:**
- Para E-E-A-T: bajo-medio de forma aislada (una sola frase plantillada no hunde una página de 1.500 palabras con contenido específico real como alérgenos UE, integración con Doctoralia o deontología de abogados). El riesgo es acumulativo: un rater o un crawler que analice las 4 páginas juntas (como se le pide a un quality rater comparar páginas del mismo sitio) detecta el patrón fácilmente.
- Para "thin/templated content": no calificaría como thin content (1.500 palabras, FAQs específicas por vertical con detalle real), pero sí como contenido parcialmente plantillado en la sección de cierre de cada FAQ set.
- Para canibalización/dilución de `/seo-local-sevilla`: **riesgo moderado real**, no solo teórico. Las 4 páginas de nicho responden ya, con bastante completitud, a la pregunta "¿cómo consigo aparecer cuando alguien me busca cerca de mí?" — que es la pregunta central que `/seo-local-sevilla` existe para poseer. Un usuario o un LLM generativo puede obtener la respuesta completa sin necesitar hacer clic a `/seo-local-sevilla`, y Google puede terminar rankeando indistintamente cualquiera de las 5 URLs para consultas tipo "cómo aparecer en búsquedas locales sevilla [sector]", repartiendo la señal de relevancia en vez de concentrarla en la página que se decidió como cabeza de clúster (ver `.agents/product-marketing-context.md`, líneas 100-107: `/seo-local-sevilla` se creó explícitamente para consolidar esa keyword).

**Recomendación accionable.**
1. Recortar la respuesta de la FAQ "cómo aparezco cerca de mí" en las 4 páginas de nicho a 2-3 frases (los 3 factores + 1 frase de enlace), y eliminar la reafirmación completa de "no es obligatorio/imprescindible/necesario... opción para ir sumando visibilidad" duplicada — decir la idea, no la misma idea 4 veces con sinónimos.
2. Sustituir el link genérico "puedes consultar en /seo-local-sevilla" en las 4 páginas por texto de anchor distinto y específico del sector (ej. "auditoría SEO local para clínicas" en vez de repetir la fórmula), reforzando semánticamente el hub sin duplicar su contenido.
3. Considerar mover el detalle largo (el "cómo funciona el SEO local paso a paso") solo a `/seo-local-sevilla`, y que las 4 páginas de nicho enlacen con una frase corta + CTA, dejando que sea `/seo-local-sevilla` quien concentre la profundidad y por tanto la señal de relevancia semántica para esas consultas.

### 2. [Severidad: Media] Hero/benefits/process de las 4 páginas de nicho son la misma plantilla con vocabulario sustituido — no canibalización de keywords, pero sí riesgo de "site-wide template quality" bajo

**Evidencia.** Comparando estructura (no solo FAQ): los 4 `process` siguen el idéntico patrón de 4 pasos (conversación inicial → presupuesto cerrado → diseño/montaje del contenido específico → lanzamiento + Google/Maps); los 4 `pricing` usan el mismo "desde 399 €" con includes casi calcados (SEO local + conexión Google Maps + dominio/hosting primer año) cambiando solo 1-2 líneas específicas del sector; y los 4 hero subtitles siguen la fórmula "[quien busca tu sector] decide/compara en Google antes de [acción] → creo webs que ayudan a convertir eso en [resultado del sector]".

**Veredicto sobre canibalización de keywords:** **bajo** entre las 4 páginas de nicho y bajo frente a `/diseno-web-sevilla` — cada página apunta a un head term long-tail claramente distinto ("web para restaurantes Sevilla" vs "web para clínicas Sevilla" vs "diseño web Sevilla" genérico), sin solapamiento de intención de búsqueda principal. Esto está bien resuelto arquitectónicamente. El riesgo no es de keywords, es de **calidad percibida por comparación directa**: un usuario o rater que abra 2 de estas páginas seguidas (plausible, ya que la home enlaza a las 4 desde el hub) notará el patrón de plantilla con find-and-replace de vocabulario, lo cual reduce la percepción de que cada página está "escrita a medida" pese a que, en el contenido específico de cada FAQ, sí lo está.

**Recomendación.** No es urgente reescribir toda la arquitectura (reutilizar estructura entre páginas de nicho es una práctica SEO legítima y `seo-programmatic` la valida si hay suficiente variación de fondo, que aquí existe en las FAQs 6-8 de cada página). Sí recomiendo variar el **orden** de las secciones `benefits`/`process` entre al menos 2 de las 4 páginas y diversificar la redacción de al menos 1-2 de los títulos de `benefits` que hoy siguen casi el mismo patrón sintáctico ("Que te encuentren...", "Aparece cuando..."), para reducir la sensación de plantilla al ojo humano.

### 3. [Severidad: Media] Solapamiento semántico entre el post de blog GEO y la FAQ "¿Qué es el GEO?" de `/seo-local-sevilla`

**Evidencia.** El post `/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/` tiene como intención principal explicar "qué es el GEO" (H2: "Qué es el GEO: lo mismo, pero para la inteligencia artificial"). La FAQ de `/seo-local-sevilla` (`src/data/services.ts`, línea 559) es **"¿Qué es el GEO y por qué me interesa si ya hago SEO?"**, con definición prácticamente igual de completa: mismo término expandido (Generative Engine Optimization), mismos ejemplos (ChatGPT, Perplexity, AI Overviews), mismo mecanismo explicado (FAQs redactadas para ser citables).

**Qué SÍ es distinto (mitiga el riesgo):** el post de blog añade contenido genuinamente nuevo no cubierto en la página de servicio — la sección "Qué es el SEO local" desde cero para quien no sabe nada, los "4 pasos que puedes hacer ya" sin contratar a nadie (framing informacional puro, coherente con `.agents/product-marketing-context.md` que exige no mezclar blog informacional con páginas transaccionales), y un ángulo pedagógico ("sin dar por hecho que sabes qué es un dato estructurado o un LLM") que la página de servicio no tiene porque ya asume intención comercial.

**Riesgo real:** moderado, no alto — ambas piezas pueden competir por la consulta informacional "qué es el GEO" / "qué es posicionamiento IA", y Google normalmente escoge una sola URL como canónica para esa intención, probablemente el post de blog por tener más profundidad puramente informacional. Esto no perjudica al negocio (el blog linka de vuelta a `/seo-local-sevilla` como CTA), pero si el objetivo era que `/seo-local-sevilla` capturase también el tráfico de "qué es GEO", la FAQ competidora dentro de la propia página de servicio reduce esa opción.

**Recomendación.** Acortar la respuesta de esa FAQ concreta en `/seo-local-sevilla` a una definición de 2-3 frases con un enlace explícito "más detalle en [el post del blog]" en vez de repetir la explicación completa — refuerza el post como la pieza canónica para esa intención informacional y deja la FAQ de la página de servicio centrada en la objeción comercial ("por qué me interesa a mí, cliente que ya paga por SEO").

### 4. [Severidad: Media] Legibilidad: respuestas de FAQ con frases y párrafos demasiado largos para el avatar objetivo y para featured snippets/citación por IA

**Evidencia cuantitativa** (muestras de `src/data/niches.ts`):
- FAQ "¿Cuánto cuesta una página web para un restaurante?": 123 palabras, 5 frases, media de 24,6 palabras/frase.
- FAQ "¿Cómo tratáis los datos de los pacientes?" (clínicas): 128 palabras en **3 frases**, media de 42,7 palabras/frase — muy por encima del umbral recomendado (~20 palabras/frase) para audiencia no nativa digital de 35-55 años que "no sabe qué es Search Console" (perfil definido en `.agents/product-marketing-context.md`).
- Patrón repetido: al menos 6-8 de las 32 respuestas de FAQ en `niches.ts` superan 100 palabras en un único bloque sin subdivisión (ni salto de línea, ni lista, ni negrita para la respuesta directa).

**Impacto evaluado:**
- Escaneabilidad para el avatar objetivo (bajo perfil digital): negativo. Un dueño de negocio local que consulta esta FAQ desde el móvil, buscando una respuesta rápida a "¿cuánto cuesta?", tiene que leer un párrafo de 5 frases para llegar a la cifra y las condiciones.
- Featured snippets / AI Overviews: negativo moderado. Google y los asistentes de IA priorizan citar la primera frase o las primeras ~40-60 palabras cuando son autocontenidas y responden directo; aquí la cifra y condición clave sí suelen estar en la primera frase (buen hábito ya presente), pero el resto del párrafo denso dificulta que un snippet capture matices importantes (ej. "funcionalidades adicionales se presupuestan aparte") sin cortar a mitad de idea.

**Recomendación.** No es necesario acortar todas las respuestas (algunas, como las de RGPD o deontología, requieren matices y está bien que los tengan), pero sí:
1. Mantener la respuesta directa en la primera frase (ya se hace en la mayoría — buena práctica GEO existente, mantenerla).
2. Para las respuestas de 3+ frases y 100+ palabras, partir el bloque en 2 párrafos cortos o convertir el listado de condiciones en negrita/lista cuando el layout lo permita (revisar si `ServiceLayout`/el componente de FAQ soporta HTML enriquecido en `a`, no solo texto plano).
3. Priorizar la reescritura en las FAQs más "transaccionales" (precio, plazo) donde la velocidad de lectura importa más para el avatar objetivo; las FAQs legales/técnicas pueden mantener más longitud si aportan matiz necesario.

### 5. [Severidad: Baja] E-E-A-T: ausencia de autoría/fecha visible en el post de blog y de cualquier señal de experiencia específica de nicho

**Evidencia.** El frontmatter del post GEO tiene `pubDate: 2026-09-21` (bien, aporta frescura) pero no hay campo de autor visible en el render ni enlace a `/sobre-mi` desde el propio artículo. Las 4 páginas de nicho no citan ningún caso de un restaurante, clínica, comercio o despacho real — reutilizan siempre los mismos 2 casos genéricos (Arkady Celebraciones, Adf Sevilla) vía el componente `Projects`, ninguno de los cuales es, a juzgar por sus nombres, una clínica o un despacho de abogados. Esto es honesto (no se inventa un caso falso) pero deja las páginas de nicho sin ninguna señal de "experience" (el factor que la QRG pesa al 20%) específica del sector que venden.

**Recomendación.** Añadir byline + enlace a `/sobre-mi` en la plantilla de post de blog (cambio de layout, no de contenido). Para las páginas de nicho, si en el futuro hay un cliente real de alguno de esos 4 sectores, priorizar añadirlo con nombre y enlace verificable — mientras tanto, es preferible mantener la honestidad actual ("no son casos de éxito de posicionamiento con cifras, porque este servicio es nuevo", ya presente en `/seo-local-sevilla`) antes que inventar prueba social.

### 6. [Severidad: Informativa — verificación de compliance, sin incidencias] Claims prohibidos

Se revisó todo el contenido de `niches.ts`, `services.ts`, las 3 páginas `.astro` de servicio nuevas/existentes y el post de blog buscando cifras exactas de velocidad de carga o promesas de posición en Google. **No se encontró ninguna infracción**: todas las menciones a rendimiento usan framing de objetivo/proceso ("optimizo para que cargue rápido", "construida pensando en cumplir los Core Web Vitals") y todas las menciones a posicionamiento incluyen negación explícita de garantía ("nadie controla el algoritmo de Google ni puede garantizar una posición concreta", "no puedo prometerte una posición concreta ni un plazo exacto"). Mención aparte positiva: el blog `cuanto-cuesta-una-pagina-web-en-sevilla.md` cita el umbral real de Core Web Vitals (LCP ≤2,5s "bueno" en percentil 75) con fuente a web.dev, correctamente enmarcado como definición del estándar de Google, no como promesa de rendimiento propio — es el uso correcto de una cifra técnica sin infringir la restricción de negocio.

### 7. [Severidad: Baja] `/seo-local-sevilla` y `/tienda-online-sevilla`: profundidad y solapamiento

- `/seo-local-sevilla`: contenido propio y diferenciado, buena profundidad (11 FAQs, sección de casos reales con matiz honesto sobre la novedad del servicio, sección "por qué alguien que programa"). Bajo riesgo de solapamiento con `/diseno-web-sevilla` — se citan mutuamente de forma correcta (FAQ "¿Necesito tener ya una web...?" enlaza a `/diseno-web-sevilla` en vez de repetir su contenido).
- `/tienda-online-sevilla`: solapamiento moderado con la página de nicho `comercios` (`/web-para-comercios-sevilla`) en el eje "marketplace vs. tienda propia / comisión de Stripe-Redsys". Ambas páginas desarrollan el mismo argumento (no pagar comisión de marketplace, sí la de la pasarela) con ejemplos casi idénticos (Amazon/Wallapop en comercios; Shopify/Wix en tienda online — distintos pero tocan el mismo tema de "SaaS con cuota vs. propio"). No es tan grave como el hallazgo #1 porque los head terms de cada página son distintos (comercios = negocio de barrio general; tienda online = ecommerce dedicado), pero conviene vigilar que no se conviertan en la misma página de facto si `comercios` sigue creciendo su sección de ecommerce.

## Resumen de recomendaciones priorizadas

1. (Alta prioridad) Recortar y diversificar la FAQ "cómo aparezco cerca de mí" en las 4 páginas de nicho — hallazgo #1.
2. (Media) Acortar la FAQ "¿Qué es el GEO?" en `/seo-local-sevilla` y remitir al post de blog como fuente canónica — hallazgo #3.
3. (Media) Dividir/reformatear respuestas de FAQ de 100+ palabras en 1 sola frase, priorizando las de precio/plazo — hallazgo #4.
4. (Media) Variar orden/redacción de `benefits`/`process` entre páginas de nicho para reducir la sensación de plantilla — hallazgo #2.
5. (Baja) Añadir byline al layout de blog y enlace a `/sobre-mi` — hallazgo #5.
