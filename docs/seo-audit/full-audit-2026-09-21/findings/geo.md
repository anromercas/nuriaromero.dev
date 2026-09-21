# Auditoría GEO (Generative Engine Optimization) — nuriaromero.dev

Fecha: 2026-09-21 · Método: lectura del repo (`portfolio-nuriaromerodev/nuriaromero.dev`) + verificación en vivo (`curl`, con y sin user-agent de bots de IA) contra `https://nuriaromero.dev`. Auditoría de solo lectura, sin cambios en sitio ni repo.

## Puntuación GEO Readiness: 78/100

| Dimensión | Peso | Nota (0-100) | Comentario breve |
|---|---|---|---|
| Citabilidad (passage-level) | 25% | 80 | FAQs autocontenidas y con cifras, pero con enlaces relativos rotos fuera de contexto y ligeramente por debajo del rango óptimo de palabras |
| Legibilidad estructural | 20% | 70 | H2 del post no son preguntas; buena jerarquía general; FAQ con schema correcto |
| Contenido multi-modal | 15% | 55 | Sin imágenes/diagramas propios en el post de blog, sin vídeo, sin tablas de datos |
| Autoridad y señales de marca | 20% | 75 | Schema Person/Organization sólido y NAP consistente, pero sin autoría visible en el post, sameAs limitado (sin YouTube/Reddit) |
| Accesibilidad técnica para IA | 20% | 100 | Estático real (Astro), sin JS para el contenido, robots.txt y CDN abren a todos los bots de IA relevantes |

Cálculo ponderado: 0,25×80 + 0,20×70 + 0,15×55 + 0,20×75 + 0,20×100 = **78,25 ≈ 78/100**.

---

## 0. Corrección a un dato de partida del encargo

El encargo afirmaba que `llms.txt` **no** incluye enlace al blog, a `/sobre-mi/` ni a `/contacto/`. Verificado en vivo (`curl https://nuriaromero.dev/llms.txt`, 200 OK) y contra el repo (`public/llms.txt`): **eso es incorrecto**. La sección "Más" sí incluye los cuatro enlaces:

```
## Más
- [Portfolio](https://nuriaromero.dev/portfolio)
- [Blog](https://nuriaromero.dev/blog)
- [Sobre mí](https://nuriaromero.dev/sobre-mi)
- [Contacto](https://nuriaromero.dev/contacto)
```

El gap real y verificado es más estrecho: **el enlace al `/blog` es solo al índice, no a los 4 posts individuales** (ver hallazgo 1).

---

## 1. `llms.txt` — Severidad: Media

**Evidencia**: `public/llms.txt` (repo) y respuesta en vivo idéntica. El repo tiene 4 posts en `src/content/blog/` (`que-es-geo-posicionamiento-ia-negocios-sevilla.md`, `como-aparecer-en-google-maps-negocio-sevilla.md`, `cuanto-cuesta-una-pagina-web-en-sevilla.md`, `pagina-web-para-restaurantes-que-necesita.md`), pero `llms.txt` solo enlaza `https://nuriaromero.dev/blog` (el índice), sin URLs ni descripciones de los posts.

**Por qué importa**: el blog es precisamente el contenido más "citable" (preguntas directas, formato pregunta-respuesta, sin intención comercial explícita) frente a las páginas de servicio, que mezclan información con venta. `llms.txt` es el mapa que un LLM usa para decidir qué merece la pena rastrear/priorizar; dejar los posts solo a un nivel de indirección (índice → post) reduce la probabilidad de que un crawler con presupuesto de rastreo limitado o un asistente que solo lee `llms.txt` "en caliente" (sin navegar) descubra el contenido informacional.

No es un error grave (el sitemap y el propio `/blog` listan los posts, y el robots.txt no bloquea nada), pero para un negocio cuyo propio producto es GEO, es una inconsistencia de "predicar con el ejemplo".

**Recomendación accionable**: listar los posts explícitamente en `llms.txt`, con URL y descripción de una frase (mismo formato que el resto de secciones). Propuesta concreta de sección a añadir (sustituye la línea `- [Blog](https://nuriaromero.dev/blog): ...` por un subapartado, o añade esto justo debajo):

```
## Blog
- [Qué es el GEO y por qué tu negocio en Sevilla debería prestarle atención](https://nuriaromero.dev/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/): SEO local y GEO explicados sin jerga, con 4 pasos prácticos para negocios de Sevilla.
- [Cómo aparecer en Google Maps con tu negocio en Sevilla](https://nuriaromero.dev/blog/como-aparecer-en-google-maps-negocio-sevilla/)
- [Cuánto cuesta una página web en Sevilla](https://nuriaromero.dev/blog/cuanto-cuesta-una-pagina-web-en-sevilla/)
- [Qué necesita la página web de un restaurante](https://nuriaromero.dev/blog/pagina-web-para-restaurantes-que-necesita/)
```

(Completa las dos últimas descripciones con la `description` real del frontmatter de cada post; no las tengo verificadas literalmente porque no estaban en el alcance pedido.) Idealmente automatizar esto en build (leer `astro:content` de `blog` al generar `public/llms.txt`, igual que ya se hace en `astro.config.mjs` para el `lastmod` del sitemap) para que no se desincronice cuando se añadan posts nuevos.

**Esfuerzo**: bajo (contenido manual) / medio (si se automatiza en build).

---

## 2. Citabilidad a nivel de pasaje — Severidad: Baja-Media

**Evidencia cuantitativa** (conteo de palabras por respuesta, script Python sobre el contenido fuente):

- FAQs de las 4 páginas de nicho (`src/data/niches.ts`, 32 respuestas): media **127 palabras**, rango 116–144.
- FAQs de `/seo-local-sevilla` (`src/data/services.ts`, 12 respuestas): media **106,5 palabras**, rango 95–131.
- Párrafos del post de blog GEO: entre 36 y 160 palabras (la mayoría 60-100).

El rango óptimo de citación (134-167 palabras) está ligeramente por encima de la media real en ambos casos. No es un problema grave — las respuestas son largas para ser "demasiado cortas" y no son fragmentos triviales — pero indica que hay margen para acercarse al rango óptimo sin necesidad de reescritura completa.

**Estructura de las respuestas (positivo)**: las FAQ de nicho y de `/seo-local-sevilla` siguen un patrón consistente y bueno para citación: primera frase = respuesta directa con cifra concreta (p. ej. "El proyecto inicial tiene un precio cerrado de 299 €..."), luego matices, y cierre con una frase de venta/CTA. Esto es coherente con la práctica de "direct answer en los primeros 40-60 palabras".

**Problema real encontrado**: varias respuestas de `src/data/niches.ts` y de `seoLocal.faqs` incluyen enlaces **relativos** sin dominio, p. ej.:

> "...tengo un servicio aparte de SEO local que puedes consultar en **/seo-local-sevilla**."

(Aparece en las FAQ de `restaurantes`, `clinicas`, `comercios` y `profesionales` en `src/data/niches.ts`, líneas 84, 184, 284, 384.) Si un LLM extrae ese pasaje como cita textual (lo cual es justo el objetivo de esa respuesta), `/seo-local-sevilla` no es una URL resoluble fuera del contexto de la página — es una ruta relativa que solo funciona como link `<a href>` dentro del HTML, no como texto plano citado en una respuesta de ChatGPT/Perplexity. Esto no rompe el HTML (el `href` real en el layout probablemente resuelve bien la navegación en el sitio), pero **para el propósito específico de citabilidad por IA que esta frase persigue, el dato "dónde consultar más" queda inutilizable fuera del sitio**.

**Recomendación accionable**: en los textos de FAQ pensados explícitamente para citación externa, sustituir las rutas relativas por URLs absolutas: `https://nuriaromero.dev/seo-local-sevilla`. Es un cambio de contenido puro (texto en `niches.ts` y `services.ts`), sin tocar lógica del layout ni el `href` real de los enlaces internos existentes.

**Esfuerzo**: bajo.

---

## 3. Post de blog GEO — estructura y citabilidad — Severidad: Baja

**Evidencia**: `src/content/blog/que-es-geo-posicionamiento-ia-negocios-sevilla.md`.

Puntos fuertes:
- Definiciones directas en primera frase de cada sección ("El SEO local es el trabajo que...", "GEO son las siglas de...").
- Evita la trampa de inventar estadísticas sin fuente: la sección "Por qué importa ahora" dice explícitamente "no vamos a darte aquí una cifra concreta porque no podríamos sostenerla con datos propios verificables". Es una buena práctica de honestidad de contenido, pero como efecto secundario **reduce la citabilidad**: los LLMs y los AI Overviews citan con más frecuencia pasajes con estadísticas atribuidas a una fuente. Aquí se ha optado conscientemente por no aportarlas.

Puntos de mejora:
- **Los H2 no están en formato pregunta** ("Qué es el SEO local", "Qué es el GEO...", "Por qué importa ahora", "Cuatro cosas que puedes hacer ya"). Están cerca del formato pregunta pero sin el signo de interrogación ni la construcción interrogativa completa ("¿Qué es el SEO local?"). El framework GEO recomienda encabezados en formato pregunta explícito porque coincide mejor con cómo se formulan los prompts de los usuarios y facilita el emparejamiento semántico consulta-pasaje.
- **Ninguna autoría visible en la página del post**: `BlogPostLayout.astro` no renderiza un byline ("Por Nuria Romero") en el HTML visible; solo existe en el `Article` JSON-LD (`author: { "@id": PERSON_ID }`, en `src/lib/schema.ts`). Un LLM que resuma o cite el post no tiene una señal textual visible de autoría, solo estructurada. Google recomienda autoría visible además de marcada; para GEO, el texto extraído sin marcado adjunto pierde esa señal de autoridad si el modelo no procesa el JSON-LD.
- Sin contenido multimodal: no hay imágenes propias, gráficos ni tablas en el post (dimensión "Multi-Modal Content" es la más débil del sitio, 55/100).

**Recomendación accionable**:
1. Reescribir los H2 como preguntas: "¿Qué es el SEO local?", "¿Qué es el GEO?", "¿Por qué importa el GEO ahora?", "¿Qué puedes hacer ya por tu negocio?".
2. Añadir un byline visible bajo el título en `BlogPostLayout.astro` (`<p>Por <a href="/sobre-mi">Nuria Romero</a></p>`), coherente con el `author` ya presente en el schema.
3. Considerar una infografía simple o tabla comparativa SEO vs GEO — es contenido de bajo coste que sube la dimensión más débil.

**Esfuerzo**: bajo (H2 y byline) / medio (contenido multimodal nuevo).

---

## 4. Señales de marca / entidad — Severidad: Baja

**Evidencia**: `src/lib/schema.ts`, `src/data/site.ts`, `public/llms.txt`, `Footer.astro`.

**NAP (Nombre/Dirección/Teléfono) — consistente**: teléfono `611 812 431` / `+34611812431`, email `nuriaromero.dev@gmail.com`, localidad `Sevilla` coinciden en `SITE` (fuente única en `src/data/site.ts`), `llms.txt` y el schema `ProfessionalService`. No hay discrepancias de NAP detectadas.

**Nombre de entidad — inconsistencia menor**: el schema `Person` usa `"Nuria Romero Castillo"` (`src/lib/schema.ts:46`), mientras que `llms.txt`, el `<footer>`, el `<title>` de `/sobre-mi` y el propio `sameAs` de LinkedIn (`nuria-romero-castillo`, coincide) usan `"Nuria Romero"` a secas en todo el contenido visible. No es un error — es habitual omitir el segundo apellido en el nombre "de marca" — pero para la resolución de entidad de un LLM (que intenta enlazar menciones de "Nuria Romero" con el nombre legal completo del schema), esto no ayuda a reforzar la coincidencia frente a fuentes externas (LinkedIn si usa el nombre completo, GitHub `anromercas` no contiene el nombre en absoluto). Es una discrepancia leve, no bloqueante.

**Schema Person/Organization**: bien implementado — `ProfessionalService` con `@id`, `geo`, `areaServed`, `founder` enlazado por `@id` al `Person`; `Person` con `knowsAbout`, `worksFor` enlazado por `@id`, y `sameAs`. Es un grafo de entidad correcto (buena práctica).

**`sameAs` limitado**: solo LinkedIn y GitHub. Sin YouTube (la señal con mayor correlación reportada, ~0,737), sin Reddit, sin Wikipedia (esperable para un negocio local, no es un problema per se) y sin perfil de Google Business Profile enlazado explícitamente en el schema (aunque las páginas de servicio mencionan repetidamente que se gestiona GBP, no hay una URL de la ficha real en `sameAs` ni en el contenido). Dado que el propio negocio vende "alta y optimización de Google Business Profile" como servicio, no tener el enlace a la propia ficha de GBP en el sitio es una omisión visible para cualquier auditor (incluida esta auditoría) y potencialmente para un LLM que intente verificar la entidad.

**Recomendación accionable**:
1. Añadir la URL de la ficha de Google Business Profile de Nuria Romero al array `sameAs` de `personSchema()`/`localBusinessSchema()` en `src/lib/schema.ts`, y como enlace visible en `/contacto` o el footer.
2. Evaluar armonizar el nombre: o se usa "Nuria Romero Castillo" también en `llms.txt`/footer/títulos, o se simplifica el `Person.name` a "Nuria Romero" para que coincida con todo el resto del sitio. Cualquiera de las dos opciones es válida; lo que no conviene es mantener las dos formas repartidas sin criterio.
3. Es razonable no forzar un canal de YouTube si no existe contenido real que sostenerlo — mencionarlo como oportunidad futura, no como fallo actual.

**Esfuerzo**: bajo.

---

## 5. Accesibilidad técnica para crawlers de IA — Severidad: Ninguna (positivo, verificado)

**Evidencia verificada en vivo**:
- `astro.config.mjs`: sin `output: 'server'` ni adaptador SSR configurado → Astro usa su modo por defecto `static`, confirmado.
- `curl https://nuriaromero.dev/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/` (sin renderizar JS) devuelve el texto completo del artículo en el HTML crudo (`grep -c "Generative Engine Optimization"` → 1 coincidencia en HTML plano).
- `curl https://nuriaromero.dev/seo-local-sevilla/` devuelve las preguntas de FAQ literalmente en el HTML crudo, y **0 directivas `client:`** de Astro (ninguna isla de hidratación en esta página) → no depende de JavaScript para mostrar contenido.
- Cabeceras HTTP con user-agent `GPTBot` y `ClaudeBot` explícitos devuelven `200 OK` desde Netlify (CDN), confirmando que no hay bloqueo a nivel de CDN/edge más allá de lo que dice `robots.txt` (a veces el robots.txt permite pero el hosting bloquea por firma de user-agent; aquí no ocurre).
- `robots.txt` en vivo confirma `Allow: /` explícito para `GPTBot`, `OAI-SearchBot`, `ClaudeBot`, `Claude-Web`, `anthropic-ai`, `PerplexityBot`, `Google-Extended`.
- No existe `/rsl.xml` ni `/.well-known/rsl.xml` (404 en ambos) → no hay licencia RSL 1.0. No es una anomalía (RSL es un estándar todavía muy poco adoptado en 2026), pero se deja constancia de la ausencia según lo solicitado.

Esta es la dimensión mejor resuelta del sitio (100/100) y coherente con que el negocio vende exactamente este tipo de trabajo técnico.

---

## 6. Posible canibalización entre el post de blog GEO y `/seo-local-sevilla` — Severidad: Media

**Evidencia de solapamiento textual directo**:

- Post de blog, H2 "Qué es el GEO: lo mismo, pero para la inteligencia artificial": define GEO, menciona ChatGPT/Perplexity/"modo IA" de Google, y explica que un asistente "necesita encontrar... información clara sobre quién eres, qué ofreces y dónde estás".
- FAQ de `/seo-local-sevilla` (`src/data/services.ts:559`), pregunta **casi idéntica en intención**: "¿Qué es el GEO y por qué me interesa si ya hago SEO?" → "El GEO (Generative Engine Optimization) es optimizar tu presencia para que te citen asistentes de inteligencia artificial como ChatGPT, Perplexity o el resumen con IA de Google (AI Overviews)...".
- Otra FAQ de la misma página (`services.ts:591`), "¿Cómo hace un asistente de inteligencia artificial (ChatGPT, Perplexity) para recomendar un negocio en vez de otro?", responde esencialmente la misma pregunta que resuelve el post de blog en su párrafo 4 ("Un asistente de inteligencia artificial, en términos sencillos, es un programa...").

**Por qué es un riesgo real y no solo teórico**: ambas piezas son del mismo dominio, mismo autor/entidad, fecha del post es hoy (2026-09-21, coincide con el propio día de esta auditoría, contenido recién publicado) y compiten literalmente por la consulta "qué es el GEO" / "qué es la optimización para IA" en español + Sevilla. Un LLM que indexe ambas páginas puede:
1. Citar solo una de las dos (probablemente la FAQ de `/seo-local-sevilla`, porque es más corta y autocontenida por respuesta, encaja mejor en el patrón de extracción de FAQPage) y dejar el post de blog —con más profundidad y mejor forma narrativa— invisible.
2. En el peor caso, si las dos respuestas difieren ligeramente en matiz o énfasis, generar una respuesta compuesta que mezcle fuentes con matices distintos del mismo dominio, lo cual no es señal de autoridad sino de ruido.

No hay contradicción factual entre las dos piezas (ambas dicen lo mismo, solo con distinto nivel de detalle), así que no es un problema de credibilidad, pero sí de **eficiencia de la señal**: dos piezas del mismo sitio resolviendo la misma pregunta sin enlazarse explícitamente como "profundiza aquí" / "resumen rápido aquí" desperdician la oportunidad de reforzarse mutuamente.

**Nota positiva parcial**: el post de blog SÍ enlaza hacia `/seo-local-sevilla` al final ("es justo lo que trabajo en mi servicio de SEO local y GEO en Sevilla"), estableciendo una relación de "contenido informativo → página de servicio". Pero no hay enlace en sentido inverso: la FAQ de `/seo-local-sevilla` que responde "qué es el GEO" no enlaza al post de blog para quien quiera la versión ampliada. La relación es unidireccional.

**Recomendación accionable**:
1. Añadir un enlace desde la respuesta FAQ "¿Qué es el GEO y por qué me interesa si ya hago SEO?" en `services.ts` hacia el post de blog completo ("puedes leer la explicación completa en [este artículo](https://nuriaromero.dev/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/)"), para que ambas páginas se refuercen como par "resumen citable ↔ contenido de profundidad", en vez de competir en aislamiento.
2. Considerar diferenciar el ángulo: dejar que el post de blog sea la pieza canónica y extensa sobre "qué es GEO" en general (ya lo es), y que la FAQ de `/seo-local-sevilla` se enfoque explícitamente en "qué es el GEO **dentro de este servicio**" en vez de repetir la definición genérica — reduciría el solapamiento léxico directo sin perder la respuesta rápida que necesita el visitante de la página de servicio.

**Esfuerzo**: bajo (enlace) / medio (reescritura de matiz).

---

## Resumen priorizado (top 5 cambios de mayor impacto)

| # | Cambio | Dimensión | Impacto | Esfuerzo |
|---|---|---|---|---|
| 1 | Listar los 4 posts del blog individualmente en `llms.txt` (con URL absoluta y descripción) | Citabilidad / Estructura | Alto | Bajo |
| 2 | Sustituir rutas relativas (`/seo-local-sevilla`) por URLs absolutas en las respuestas FAQ pensadas para citación externa | Citabilidad | Alto | Bajo |
| 3 | Enlazar cruzado entre la FAQ "qué es el GEO" de `/seo-local-sevilla` y el post de blog GEO, y diferenciar el ángulo de cada uno | Citabilidad / Autoridad | Medio-Alto | Bajo-Medio |
| 4 | Añadir byline visible ("Por Nuria Romero") en `BlogPostLayout.astro` y convertir H2 del post en formato pregunta | Estructura / Autoridad | Medio | Bajo |
| 5 | Añadir ficha de Google Business Profile a `sameAs` del schema y armonizar "Nuria Romero" vs "Nuria Romero Castillo" en todo el sitio | Autoridad y marca | Medio | Bajo |

---

## Puntuaciones por plataforma (estimación cualitativa, sin acceso a herramientas DataForSEO en esta sesión)

No se dispuso de herramientas MCP de DataForSEO (`ai_optimization_chat_gpt_scraper`, `ai_opt_llm_ment_search`) en este entorno, así que estas puntuaciones son una estimación basada en las señales técnicas y de contenido verificadas arriba, no en tracking real de menciones. Se recomienda contrastarlas con datos reales cuando haya acceso a esas herramientas.

| Plataforma | Estimación | Razonamiento |
|---|---|---|
| Google AI Overviews | Media-Alta | FAQPage schema correcto + robots.txt abierto a Google-Extended + contenido local muy específico (nichos + Sevilla) encaja bien con el patrón de AI Overviews para intención local |
| ChatGPT (con navegación) | Media | Acceso técnico total (GPTBot/OAI-SearchBot permitidos), pero `llms.txt` incompleto y la canibalización del hallazgo 6 pueden diluir cuál de las dos páginas se cita |
| Perplexity | Media-Alta | Perplexity suele citar fuentes con datos concretos y fecha reciente; las FAQ con precios exactos y el post recién publicado (mismo día) encajan bien con su patrón de citación |
| Bing Copilot | Baja-Media | Sin verificación específica de Bingbot/IndexNow en esta auditoría (fuera del alcance pedido); el acceso general es bueno pero no se confirmó el crawler específico de Bing |

---

## Archivos y evidencia citados

- `/Users/nuria/Desktop/code/nuriaromerodev/portfolio-nuriaromerodev/nuriaromero.dev/public/llms.txt`
- `/Users/nuria/Desktop/code/nuriaromerodev/portfolio-nuriaromerodev/nuriaromero.dev/src/lib/schema.ts`
- `/Users/nuria/Desktop/code/nuriaromerodev/portfolio-nuriaromerodev/nuriaromero.dev/src/data/site.ts`
- `/Users/nuria/Desktop/code/nuriaromerodev/portfolio-nuriaromerodev/nuriaromero.dev/src/data/niches.ts`
- `/Users/nuria/Desktop/code/nuriaromerodev/portfolio-nuriaromerodev/nuriaromero.dev/src/data/services.ts` (bloque `seoLocal`, líneas 455-603)
- `/Users/nuria/Desktop/code/nuriaromerodev/portfolio-nuriaromerodev/nuriaromero.dev/src/content/blog/que-es-geo-posicionamiento-ia-negocios-sevilla.md`
- `/Users/nuria/Desktop/code/nuriaromerodev/portfolio-nuriaromerodev/nuriaromero.dev/src/layouts/BlogPostLayout.astro`
- `/Users/nuria/Desktop/code/nuriaromerodev/portfolio-nuriaromerodev/nuriaromero.dev/astro.config.mjs`
- Verificación en vivo: `https://nuriaromero.dev/llms.txt`, `https://nuriaromero.dev/robots.txt`, `https://nuriaromero.dev/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/`, `https://nuriaromero.dev/seo-local-sevilla/` (curl estándar y con user-agent `GPTBot`/`ClaudeBot`, 2026-09-21)
