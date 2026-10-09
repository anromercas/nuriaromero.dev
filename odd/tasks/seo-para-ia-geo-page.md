# Feature: página de servicio "SEO para IA / GEO" (`/seo-para-ia/`)

## Estado: PENDIENTE DE EJECUCIÓN — no iniciado

Documento de planificación creado el 2026-10-09 en la rama `feat/seo-consultor-sevilla-home`. No se ha escrito código, test ni contenido en `src/`. Nada de lo que sigue está aprobado por la usuaria hasta que ella diga "vamos a hacer esto" y resuelva las decisiones de la sección "Decisiones pendientes de la usuaria".

- Espejo Engram: topic `odd/seo-para-ia-geo-page/tasks` (ver "Progress and evidence" para el estado de la verificación).
- TDD: enabled (fuente: instrucción global de proyecto "Strict TDD Mode"). Runner: `node --test tests/*.test.js`. Build: `npm run build` (`astro check && astro build`).
- Entrega: `ask-on-risk` (por defecto). Receipt-driven development: apagado salvo que la usuaria lo active (`gentle-ai review mode status` lo confirma).

## Objective
Crear una página de servicio nueva, `/seo-para-ia/`, que capture la demanda de "SEO para IA / GEO" (nicho con búsquedas y CPC altos y sin competencia local medida) sin competir con la home (dueña de "consultor SEO en Sevilla") ni con `/seo-local-sevilla/` (dueña de "SEO local Sevilla" y Google Maps).

## Problem and why

Datos medidos (informes en el scratchpad de la sesión 2026-10-09: `consultor-seo-sevilla-competencia-dataforseo.md`, `competidores-locales-sevilla.md`, `raw/`; DataForSEO Labs + Google Ads, España):

| Keyword | Búsquedas/mes (ES) | CPC | Intención |
|---|---|---|---|
| geo seo | 590 | 6-9 € | informacional/comercial |
| seo para ia | 320 | 9,44 € | informacional |
| seo ia | 320 | 6-9 € | informacional |
| seo para chatgpt | 70 | n/d | informacional |

- Ningún competidor local medido (Sergio García Monge, jorgelujan, adriancaballero, seowebsevilla, dobuss...) lo tiene en title, H1 ni H2. En el informe es la acción 6 del plan (impacto medio-alto, esfuerzo medio) y el gap nº 13.
- Nuria no rankea hoy por ninguna keyword medida (0 posiciones), así que todo es gap.
- Hoy el contenido GEO vive solo en el post informativo `src/content/blog/que-es-geo-posicionamiento-ia-negocios-sevilla.md` (publicado 2026-09-21) y en un bloque secundario de la home y de `/seo-local-sevilla/`. No hay página comercial que ataque la keyword.
- Limitación honesta [M]/[I]: los volúmenes son nacionales (no hay dato Sevilla ciudad para estas keywords) y el factor limitante del dominio es la autoridad (0 enlaces útiles, 26 dominios referentes casi todos spam, según el informe DataForSEO). La página mejora el on-page, pero el ranking de una keyword nacional con CPC alto será lento sin enlaces.

## Scope

Dentro:
- Entrada nueva `seoParaIa` en `src/data/services.ts` (tipo `ServicePageData`) y página `src/pages/seo-para-ia.astro` que reutiliza `ServiceLayout` (opción de menor esfuerzo, ver "Arquitectura").
- Copy completo (sección "Copy listo para pegar").
- Schema: `Service` + `FAQPage` + `BreadcrumbList` (ya los emite `ServiceLayout`); ajuste mínimo de `serviceSchema` para admitir "sin precio".
- Enlazado interno bidireccional (`src/data/internal-links.ts`), fila en `src/data/seo-intents.ts`, línea en `public/llms.txt`.
- Tests (`tests/seo-para-ia.test.js`) y script de comprobación sobre `dist/`.

## Out of scope
- Tocar la home, `/seo-local-sevilla/`, `sobre-mi` o el post GEO más allá de añadir enlaces a la página nueva (y solo vía `internal-links.ts` / el enlace único ya acordado). No se cambian sus titles, H1, H2 ni metas.
- Componentes visuales nuevos (hero editorial propio, mock, bento): opcional T9, no obligatorio.
- Versión por nicho (`/seo-para-ia-clinicas/`, etc.): fuera hasta tener medición.
- Estrategia de enlaces entrantes (backlinks): es la palanca principal pero es otro trabajo (acción 3 del informe).
- Cualquier commit, push o PR sin que la usuaria lo decida.

## Constraints (no negociables)
1. **Anti-canibalización.**
   - La cadena "consultor SEO en Sevilla" (y "consultor" en title, meta, H1, H2, H3, slug y anchors) NO aparece en esta página salvo el único enlace a la home con el anchor exacto `consultor SEO en Sevilla` (patrón ya testeado en `tests/seo-consultor-strategy.test.js`, una vez por página).
   - "SEO local Sevilla" no aparece en title/H1/H2 de esta página. El enlace a `/seo-local-sevilla/` usa un anchor de servicio local ("servicio de SEO local y Google Maps"), nunca la keyword de IA.
   - La keyword principal de esta página ("SEO para IA") no aparece como anchor hacia la home ni hacia seo-local.
2. **Nada inventado.** Sin casos, cifras, reseñas, antes/después ni resultados. Solo datos reales ya publicados en la web (precios Local 300 €/mes + IVA y Local Pro 500 €/mes + IVA, +10 años de experiencia, NAP de `src/data/site.ts`). Lo que falte se marca `[PENDIENTE: dato real]`.
3. **Sin promesas.** Prohibido "te sale en ChatGPT", "garantizado", "primeras posiciones", "te recomendará". El test de contenido lo bloquea.
4. Tono de la web: directo, tuteo, español de España, sin vocabulario defensivo (los límites se dicen una vez, en una FAQ, no en cada sección).
5. Identificadores, claves y comentarios de código en inglés; copy visible en español.
6. Precio: no existe precio publicado para "SEO para IA" como servicio propio. No se inventa (ver decisión D1).

## Decisión de keyword

Candidatas evaluadas con los datos medidos:

| Opción | Búsquedas/mes | CPC | Pros | Contras |
|---|---|---|---|---|
| **"SEO para IA"** | 320 | 9,44 € | Lenguaje de cliente, se entiende sin jerga, CPC más alto (señal comercial), 1:1 con el patrón de slug del sitio | Volumen menor que "geo seo"; SERP informacional |
| "GEO" / "geo seo" | 590 | 6-9 € | Mayor volumen | Ambigua ("geo" = geolocalización, geografía); jerga; el dato de 590 mezcla intenciones [I]; riesgo de tráfico irrelevante |
| "posicionamiento en buscadores de IA" | sin dato medible | n/d | Descriptiva | Sin demanda medible; larga |
| "SEO para ChatGPT" | 70 | n/d | Muy concreta | Volumen bajo, ata la página a un solo producto |

**Recomendación: principal = "SEO para IA"; secundarias = "GEO" / "geo seo" (en intro, H2 y title) y "SEO para ChatGPT" / "posicionamiento en buscadores de IA" (variantes naturales en cuerpo y FAQ).** Razón: "SEO para IA" es lo que entiende un dueño de negocio y tiene el CPC más alto; "GEO" se incluye en title y primer H2 para recoger los 590 sin depender de un término ambiguo. Alternativa si la usuaria prefiere volumen: principal "GEO" con slug `/geo-seo/` (no recomendada, ver contras).

Slug propuesto: `/seo-para-ia/` (breadcrumb: "SEO para IA y GEO"). Sin "-sevilla" en el slug porque la demanda medida es nacional; la señal local va en title, H1 y entidad (schema `areaServed` ya global).

## Intención de búsqueda (SERP backwards)

Hecho con 2 consultas WebSearch ("seo para ia geo posicionamiento en buscadores de inteligencia artificial servicio" y "geo seo qué es optimización para ChatGPT Perplexity AI Overviews consultor"). Limitación: la herramienta devuelve una SERP orientativa (no Google.es en Sevilla) y no hay posiciones exactas; no se gastó crédito DataForSEO.

Lo que aparece: guías informativas ("qué es GEO y cómo posicionarte en ChatGPT"; BBVA, Nuclio, SiteGround, Soamee, Dribba, etc.) y páginas de agencias de servicio ("Posicionamiento GEO", Agencia 2VM, Visionclick, Digitalmenta). Quien busca quiere, en este orden:
1. Entender qué es y si le afecta ("qué es", "cómo funciona").
2. Saber qué se hace en concreto (qué se toca: contenido estructurado, schema, acceso de rastreadores, señales externas).
3. Si es de pago, quién lo hace y cuánto cuesta.

Consecuencia de diseño: página **híbrida servicio con definición arriba**. Abre con la respuesta directa (qué es), sigue con qué se trabaja y cómo, y cierra con precio, FAQ y CTA. No duplicar la guía larga: eso es del post.

## Relación con el post GEO existente

| | Post `que-es-geo-posicionamiento-ia-negocios-sevilla` | Página nueva `/seo-para-ia/` |
|---|---|---|
| Rol | Informativo (qué es, cuatro pasos que puedes hacer tú) | Comercial (qué hago yo, cómo trabajo, precio, CTA) |
| Keyword | "qué es el GEO" | "SEO para IA" / "GEO" |
| Tabla SEO local vs GEO | Sí (se queda ahí) | No se copia; solo 3 tarjetas cortas y enlace al post |
| Cuatro pasos DIY | Sí | No se repiten; se enlaza |

Reglas: no copiar párrafos del post; la página enlaza al post con anchor "guía sobre qué es el GEO" (informativo) y el post enlaza a la página con anchor "servicio de SEO para IA y GEO". El post hoy remata con enlace a `/seo-local-sevilla/` como "servicio de SEO local y GEO"; se mantiene, y se añade el enlace nuevo en su bloque de `internal-links.ts`. `seo-intents.ts` ya tiene la fila informativa del post y la comercial de seo-local; se añade una tercera fila comercial con rol diferenciado.

## Arquitectura (opción de menor esfuerzo)

Patrón actual: cada página de servicio es un objeto `ServicePageData` en `src/data/services.ts` + un `.astro` en `src/pages/` que usa `ServiceLayout` (que ya inyecta `Schema` con `serviceSchema` + `faqSchema` + `breadcrumbSchema`, breadcrumbs, FAQ, enlaces internos y CTA). `seo-local-sevilla.astro` añade slots con componentes propios; es la versión cara.

**Recomendado (A):** `seoParaIa: ServicePageData` en `services.ts` + `src/pages/seo-para-ia.astro` mínimo (`<ServiceLayout page={seoParaIa} />` con slot `pricing` sustituido). Hero por defecto (`ServiceHero`: H1 visible con la keyword). Esfuerzo ~250 líneas, cero componentes nuevos, sitemap automático (`@astrojs/sitemap`).

Alternativa (B, opcional T9): replicar el patrón de `SeoLocalHero` (H1 pequeño con keyword + titular grande editorial, campos `hero.title` / `hero.titleAccent` del tipo) con un `SeoParaIaHero.astro`. Más diseño, +100 líneas, ninguna mejora de SEO. Solo si la usuaria quiere continuidad visual con seo-local.

Puntos de atención detectados al explorar:
- `ServiceLayout` siempre pinta el bloque `pricing`; si no hay precio propio hay que sobreescribir el slot `pricing` (variante A de precio: sin tarjeta; variante B: tarjeta con precio).
- `serviceSchema` exige `price` (calcula `priceValue` desde el string y emite `Offer`). Sin precio habría que hacerlo opcional → T2 con test.
- `ServicePageData.pricing.from` es obligatorio en el tipo; con "sin precio" se rellena con el precio de Local Pro o se hace opcional (decidir en T2/T3).

## Título y meta (longitudes contadas)

- Title (43): `SEO para IA y GEO en Sevilla | Nuria Romero`
- Meta description (148): `Trabajo el SEO para IA (GEO) de negocios en Sevilla: que ChatGPT, Gemini y Google IA entiendan qué haces y puedan citarte. Sin promesas de posición.`
- Alternativa meta (144): `SEO para IA y GEO: que ChatGPT y Google IA entiendan tu negocio, con información clara y datos estructurados. Servicio de Nuria Romero, Sevilla.`
- Límites del repo: title ≤ 60, meta 140-160 (el test los verifica). Sin "consultor" en ninguno.

## Jerarquía de encabezados

Un solo H1, visible y con la keyword (variante A: sin separar "headline vs encabezado SEO"; si se hace B/T9, el H1 pasa a ser el pequeño `SEO para IA y GEO en Sevilla` y el titular visible es "Que cuando alguien pregunte a una IA, tu negocio tenga con qué responder").

```
H1  SEO para IA en Sevilla: que ChatGPT, Gemini y Google entiendan tu negocio
 H2 Qué es el SEO para IA (GEO)
 H2 En qué se diferencia del SEO y del SEO local
  H3 SEO clásico
  H3 SEO local
  H3 SEO para IA (GEO)
 H2 Qué trabajo para que una IA pueda entender tu negocio
  H3 Información clara y consistente
  H3 Contenido escrito para responder
  H3 Datos estructurados
  H3 Acceso para los rastreadores
  H3 Señales fuera de tu web
 H2 Cómo trabajamos el SEO para IA
  H3 Revisión de cómo te ven hoy
  H3 Plan de prioridades
  H3 Implementación
  H3 Seguimiento
 H2 Esta web aplica lo que te propongo
 H2 Para quién es
 H2 Cuánto cuesta el SEO para IA
 H2 Preguntas frecuentes sobre SEO para IA
 H2 (CTA) Veamos qué sabe hoy una IA de tu negocio
```

Mapeo a `ServicePageData`: `hero.h1`, `hero.subtitle`, `sectionTitles.{benefits,process,pricing,faq}`, `benefits[]` (los 5 H3 de "Qué trabajo"), `process[]` (los 4 H3 de "Cómo trabajamos"), `faqs[]`, `cta`. Las secciones "Qué es", "En qué se diferencia", "Esta web aplica" y "Para quién es" se colocan en los slots `before-benefits` / `before-pricing` del layout con markup simple (`SectionContainer` + `TitleSection` + párrafos), sin componentes nuevos.

## Copy listo para pegar

### Hero
- **H1:** SEO para IA en Sevilla: que ChatGPT, Gemini y Google entiendan tu negocio
- **Subtítulo:** Cada vez es más habitual preguntar a una inteligencia artificial en lugar de buscar en Google. Trabajo para que, cuando pregunten por lo que haces, haya información clara, coherente y fácil de citar sobre tu negocio.
- **CTA principal:** Reservar una llamada
- **CTA secundario (ancla a `#que-trabajo`):** Ver qué trabajo

### Qué es el SEO para IA (GEO)
El SEO para IA, también llamado GEO (Generative Engine Optimization), es el trabajo de preparar la información de tu negocio para que asistentes como ChatGPT, Gemini o Perplexity, y los resúmenes con IA de Google, puedan entenderla y, cuando encaje, citarla en sus respuestas.

Se apoya en lo mismo que el SEO de siempre, una web clara, rápida y bien estructurada, y añade una capa: que cada dato importante esté escrito de forma directa, coherente y verificable. Nadie decide qué responde un asistente; lo que sí se puede es que no falte información buena de la que sacarte.

### En qué se diferencia del SEO y del SEO local
- **SEO clásico.** Busca que tus páginas aparezcan en la lista de resultados de Google. Es la base: sin una web bien hecha no hay nada que citar.
- **SEO local.** Trabaja tu ficha de Google y tu presencia en Maps para quien busca cerca. Lo detallo en mi [servicio de SEO local y Google Maps](/seo-local-sevilla/).
- **SEO para IA (GEO).** Cuida que un asistente que redacta una respuesta encuentre datos claros sobre quién eres, qué ofreces y dónde. Si quieres entenderlo primero con calma, tienes la [guía sobre qué es el GEO](/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/).

### Qué trabajo para que una IA pueda entender tu negocio (`sectionTitles.benefits`; id `que-trabajo`)
1. **Información clara y consistente.** Reviso que tu nombre, servicios, zona, horarios y precios digan lo mismo en tu web, tu ficha de Google y tus perfiles. Si un dato se contradice, un asistente no sabe cuál creer.
2. **Contenido escrito para responder.** Preparo las páginas y las preguntas frecuentes de tu web con la respuesta directa en las primeras líneas, para que cada párrafo se entienda también fuera de contexto.
3. **Datos estructurados.** Añado el marcado schema.org (negocio, servicio, preguntas frecuentes, migas de pan) que describe tu negocio a buscadores y sistemas de IA en un formato que pueden leer sin interpretar.
4. **Acceso para los rastreadores.** Compruebo que ni el robots.txt ni la web bloquean a los rastreadores de los asistentes y preparo un archivo llms.txt como apoyo, un índice de tus páginas más útiles.
5. **Señales fuera de tu web.** Ficha de Google completa, perfiles profesionales enlazados y reseñas reales de tus clientes: datos externos que ayudan a confirmar quién eres.

### Cómo trabajamos el SEO para IA (`sectionTitles.process`)
1. **Revisión de cómo te ven hoy.** Pregunto a los principales asistentes por tu sector y tu zona, y miro qué información tuya encuentran, qué falta y qué se contradice. `[PENDIENTE: confirmar que este es el método real de revisión que quiere ofrecer]`
2. **Plan de prioridades.** Te explico en lenguaje claro qué corregir primero y por qué, sin jerga.
3. **Implementación.** Actualizo tu web y tu ficha: textos, preguntas frecuentes, datos estructurados y accesos.
4. **Seguimiento.** Reviso cada cierto tiempo qué responden los asistentes y qué visitas llegan desde ellos, y ajusto el siguiente paso. `[PENDIENTE: frecuencia y formato real del seguimiento; en SEO local es un vídeo-informe mensual, confirmar si aplica aquí]`

### Esta web aplica lo que te propongo
Esta misma web tiene preguntas frecuentes con la respuesta al inicio, datos estructurados de negocio, servicio y migas de pan, un archivo llms.txt con el índice de páginas y no bloquea a los rastreadores de los principales asistentes. `[VERIFICAR en T3 contra astro.config.mjs / robots: citar solo los rastreadores realmente permitidos]` `[PENDIENTE: dato real de visibilidad propia en asistentes (captura y fecha) si se llega a medir; no publicar sin evidencia]`

### Para quién es
Para negocios de Sevilla y su área metropolitana que ya tienen web, o van a tenerla, y quieren que la información sobre lo que hacen esté ordenada para quien pregunta a una IA: clínicas, restaurantes, despachos, comercios y servicios profesionales. Si todavía no tienes web, primero hace falta [una web bien construida](/diseno-web-sevilla/): es la base de todo lo demás.

### Cuánto cuesta el SEO para IA (`sectionTitles.pricing`)
**Variante A (recomendada, usa solo precios publicados):**
El trabajo de SEO para IA no tiene tarifa propia: forma parte del plan Local Pro, desde 500 €/mes + IVA, que incluye información estructurada para que buscadores y sistemas de IA entiendan el negocio y el trabajo de web que acompaña a la ficha. Se factura mes a mes y no hay cuota de puesta en marcha aparte. Cuéntame tu caso en la llamada y vemos si encaja.

**Variante B (servicio propio):** `[PENDIENTE: precio y alcance reales de un plan o revisión puntual de SEO para IA; no existe precio publicado]`

### Preguntas frecuentes (`faqs`, 8; respuesta directa en las dos primeras frases)
1. **¿Qué es el SEO para IA?**
   Es el trabajo de preparar la información de tu negocio para que asistentes como ChatGPT, Gemini o Perplexity puedan entenderla y citarla cuando alguien les pregunta. Se apoya en una web clara, datos coherentes y contenido escrito para responder, y se complementa con el SEO que ya haces para Google.

2. **¿El SEO para IA es lo mismo que el GEO?**
   Sí, son dos nombres para lo mismo. GEO son las siglas de Generative Engine Optimization, la forma técnica de llamar a optimizar para buscadores y asistentes que generan respuestas; "SEO para IA" es la forma que usa la mayoría de la gente.

3. **¿Puedes garantizar que ChatGPT me recomiende?**
   No, y nadie debería prometértelo: tú no controlas lo que responde un asistente, ni yo. Lo que sí hago es que tu negocio tenga información clara, coherente y fácil de citar, que es lo que aumenta las opciones de que te tengan en cuenta.

4. **¿Sustituye al SEO tradicional?**
   No, se construye encima. Una web rápida, bien estructurada y con una ficha de Google cuidada sigue siendo la base; el SEO para IA añade que esa información esté escrita y marcada para que un asistente la entienda.

5. **¿Qué trabajas en concreto?**
   Cinco cosas: que los datos de tu negocio no se contradigan, que tus páginas y preguntas frecuentes respondan de forma directa, el marcado schema.org, el acceso de los rastreadores (robots.txt y llms.txt) y las señales externas como tu ficha de Google y tus reseñas reales.

6. **¿Cuánto cuesta?**
   Forma parte del plan Local Pro, desde 500 €/mes + IVA, facturado mes a mes y sin cuota de puesta en marcha aparte. `[PENDIENTE: reescribir si se decide precio propio (variante B)]`

7. **¿Cómo se mide si funciona y cuánto tarda?**
   No hay un plazo fijo, porque depende de cada sector y de lo que ya tengas publicado. Se mide con las visitas que llegan desde asistentes de IA en tus analíticas, con Search Console y revisando periódicamente qué responden los asistentes sobre tu negocio. `[PENDIENTE: confirmar herramientas de medición reales]`

8. **¿Qué diferencia hay con el SEO local?**
   El SEO local trabaja tu aparición en Google y Google Maps para búsquedas cercanas; el SEO para IA trabaja que un asistente entienda y pueda citar tu negocio. Se solapan en la base (ficha y datos coherentes), por eso los trabajo juntos en [SEO local y Google Maps](/seo-local-sevilla/).

### CTA final (`cta`)
- **title:** Veamos qué sabe hoy una IA de tu negocio
- **text:** En una llamada revisamos qué información tuya hay disponible y cuál sería el siguiente paso útil. Sin compromiso y sin promesas de posición.
- **buttonLabel:** Reservar una llamada

### Enlace a la home (uno solo, anchor exacto)
Dentro de "Para quién es" o del texto de cierre, una vez: "Soy Nuria Romero, [consultor SEO en Sevilla](/) y desarrolladora web, y trabajo directamente contigo, sin intermediarios." (Debe coincidir con `<a href="/" ...>consultor SEO en Sevilla</a>`; añadir esta página al test de "una vez por página".) `[DECISIÓN: confirmar redacción de la persona gramatical con la usuaria, el sitio usa "consultor" en femenino/masculino genérico en este anchor por consistencia SEO]`

## Schema propuesto

`ServiceLayout` ya emite `Service` + `FAQPage` + `BreadcrumbList` a partir de `ServicePageData`; el negocio (`ProfessionalService`/`Organization`, `@id` `https://nuriaromero.dev/#business`) y la persona van globales. Ejemplo del resultado esperado (variante A con `Offer` de Local Pro; sin precio propio el bloque `offers` se omite, ver T2):

```json
[
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "SEO para IA en Sevilla: que ChatGPT, Gemini y Google entiendan tu negocio",
    "description": "Trabajo el SEO para IA (GEO) de negocios en Sevilla: que ChatGPT, Gemini y Google IA entiendan qué haces y puedan citarte. Sin promesas de posición.",
    "url": "https://nuriaromero.dev/seo-para-ia/",
    "serviceType": "SEO para IA y GEO",
    "provider": { "@id": "https://nuriaromero.dev/#business" },
    "areaServed": [
      { "@type": "City", "name": "Sevilla" },
      { "@type": "AdministrativeArea", "name": "Área metropolitana de Sevilla" }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Qué es el SEO para IA?",
        "acceptedAnswer": { "@type": "Answer", "text": "Es el trabajo de preparar la información de tu negocio para que asistentes como ChatGPT, Gemini o Perplexity puedan entenderla y citarla cuando alguien les pregunta. ..." }
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://nuriaromero.dev/" },
      { "@type": "ListItem", "position": 2, "name": "SEO para IA y GEO", "item": "https://nuriaromero.dev/seo-para-ia/" }
    ]
  }
]
```

Notas: (1) no se añaden `aggregateRating` ni `review` aquí (la regla del sitio es solo reseñas reales de GBP vía `reviewsSchema`); (2) las FAQ en JSON-LD ya normalizan saltos de línea (`faqSchema`); Google restringe el rich result de FAQ para la mayoría de sitios, pero el marcado sigue siendo útil para que otros sistemas lo lean, no se promete rich result; (3) si hay variante B con precio mensual, usar `offersFromTiers`/`UnitPriceSpecification` como `seoLocal`.

### llms.txt y sitemap
- `public/llms.txt`: añadir bajo "## Servicios" `- [SEO para IA y GEO](https://nuriaromero.dev/seo-para-ia/): Preparar la información de tu negocio para que asistentes de IA puedan entenderla y citarla: contenido, datos estructurados y señales externas. Sin garantía de mención ni de posición.` (misma línea de honestidad que el encabezado del archivo).
- Sitemap: automático (`@astrojs/sitemap` en `astro.config.mjs`, sin `lastmod` para páginas estáticas). No hay cambio de código; el check de `dist/` verifica que `/seo-para-ia/` aparece en `sitemap-0.xml`.

## Enlazado interno bidireccional

Reglas: el anchor "consultor SEO en Sevilla" apunta SOLO a la home; los anchors hacia la página nueva usan "SEO para IA y GEO" (sin "consultor"); ninguna página enlaza dos veces a la misma URL con el mismo anchor.

| Desde | Hacia | Anchor | Tipo |
|---|---|---|---|
| Home `/` (bloque `"/"` en `internal-links.ts`) | `/seo-para-ia/` | SEO para IA y GEO | contextual |
| `/seo-local-sevilla/` (`internal-links.ts`) | `/seo-para-ia/` | SEO para IA y GEO para buscadores con IA | contextual |
| Post GEO (bloque del post en `internal-links.ts`) | `/seo-para-ia/` | servicio de SEO para IA y GEO | contextual |
| `/inteligencia-artificial/` | `/seo-para-ia/` | SEO para IA: que los asistentes entiendan tu negocio | contextual |
| `/sobre-mi` (si tiene bloque en `internal-links.ts`; si no, omitir) | `/seo-para-ia/` | SEO para IA y GEO | contextual |
| `/seo-para-ia/` (nuevo bloque) | `/` | consultor SEO en Sevilla | contextual (único, ver arriba) |
| `/seo-para-ia/` | `/seo-local-sevilla/` | servicio de SEO local y Google Maps | contextual |
| `/seo-para-ia/` | `/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/` | guía sobre qué es el GEO | contextual |
| `/seo-para-ia/` | `/sobre-mi/` | quién soy y cómo trabajo | contextual |
| `/seo-para-ia/` | `/diseno-web-sevilla/` | una web bien construida | contextual |
| `/seo-para-ia/` | `/contacto` | cuéntame cómo te encuentran hoy | conversion |

Cuidado: `tests/seo-local-sevilla-redesign.test.js` y `tests/seo-consultor-strategy.test.js` leen `internal-links.ts` y componentes de seo-local; ejecutar toda la suite tras T4. Añadir un enlace a seo-local no debe alterar su title/H1/H2 ni `seoLocal.seo`.

## Fila para `src/data/seo-intents.ts`

```ts
{
  url: "/seo-para-ia/",
  intent: "Commercial: hire work to make a business understandable and citable by AI assistants",
  topic: "servicio de SEO para IA y GEO",
  cta: "Book a call",
  titleSignal: "SEO para IA y GEO",
  descriptionSignal: "ChatGPT, Gemini y Google IA",
  h1Signal: "SEO para IA",
  contentSignals: ["Qué trabajo para que una IA pueda entender tu negocio", "Cómo trabajamos el SEO para IA"],
},
```

## Decisiones pendientes de la usuaria
- **D1 (bloqueante para T3):** ¿precio? Variante A (incluido en Local Pro 500 €/mes + IVA, ya publicado) o variante B (servicio/plan propio con precio nuevo). Recomendado: A hasta tener demanda medida.
- **D2:** Keyword principal: recomendado "SEO para IA" (slug `/seo-para-ia/`). Alternativa "GEO".
- **D3:** ¿Método de revisión y de seguimiento reales que se quieren prometer? (los dos puntos `[PENDIENTE]` del proceso). Sin esto, se publican esos pasos con redacción genérica.
- **D4:** ¿Hero estándar (A) o editorial como seo-local (B/T9)?

## Dependencias y riesgos
- Reseñas/pruebas reales: no hay caso ni resultado de GEO propio publicable. La prueba social se limita a lo ya verificado (reseñas GBP vía `getGoogleReviews`, si se quisiera mostrar) y a "esta web aplica lo que te propongo". `[PENDIENTE: dato real]` cualquier cifra de visibilidad en IA.
- Ficha de Google: `localTrust.gbp.status === "verified"` y NAP en `site.ts` (La Rinconada, Sevilla) ya están; no tocar. La página no afirma ubicación distinta.
- Canibalización: riesgo de que Google asocie esta página con "seo local sevilla" por el enlace y el solapamiento temático. Mitigación: constraints 1, tests de ausencia de cadenas y revisión en Search Console a 4 y 8 semanas (consultas que mapean a la URL equivocada).
- Autoridad del dominio (0 enlaces útiles): el ranking de "seo para ia" a nivel nacional será lento sin enlaces. No es un fallo de la página.
- Claims sobre cómo funcionan los asistentes: evitar afirmaciones técnicas no verificables (p. ej. efecto de llms.txt). `[VERIFICAR]` en T3 cualquier frase factual sobre Google AI Overviews contra la documentación oficial de Google Search antes de publicar.
- Duplicación con el post: control por tests (frases del post no copiadas) y por la tabla de roles.
- Si la usuaria descarta la variante B o cambia el precio de Local Pro, actualizar copy y FAQ 6.

## Plan de tareas

Forecast de líneas autoría (añadidas + eliminadas, sin generados): tests ~170, `services.ts` ~190, página `.astro` ~45, `schema.ts` ~20, `internal-links.ts` ~30, `seo-intents.ts` ~12, `llms.txt` ~2, script de dist ~60 + `package.json` 2 = **~530 líneas**. Supera el heurístico de ~400.

Estrategia de entrega: `ask-on-risk`; al superar ~400, proponer cadena en 2 PR (strategy `stacked-to-main`, decisión de la usuaria; resolver skills `work-unit-commits` y `chained-pr` por nombre antes de crear PR):
- Slice 1 (T1-T3, ~425 líneas): contrato, schema opcional y página.
- Slice 2 (T4-T6, ~105 líneas): enlazado, llms.txt, script de dist.
Un commit Conventional por tarea (`test:`/`feat(seo):`/`docs:`), sin "Co-Authored-By" ni atribución IA. Rama sugerida: `feat/seo-para-ia-geo-page` desde `main` (no sobre `feat/seo-consultor-sevilla-home`, que tiene trabajo sin comitear de otros temas).

Convenciones: ruta = inline (1-3 ficheros, entendido) o delegada (2+ ficheros no triviales, lectura previa a escritura, ejecución de tests/build). Todas las tareas con código siguen RED (test fallando observado) → GREEN → REFACTOR; registrar la evidencia en este documento. Antes de implementar, el padre lee este fichero y su espejo Engram y pasa el locator al escritor.

- [ ] **T0 — Resolver D1-D4 con la usuaria.** Ficheros: este documento (actualizar "Decisiones"). Ruta: inline. Aceptación: las 4 decisiones registradas; los `[PENDIENTE]` de proceso resueltos o aceptados como redacción genérica; variante de precio elegida. Bloquea T3.
- [ ] **T1 — Test de contrato (RED).** Ficheros: `tests/seo-para-ia.test.js`. Ruta: inline (un fichero). Test primero (es el test): (a) `seoParaIa` existe con `slug "/seo-para-ia/"`; title ≤ 60 y meta 140-160; ninguno ni `hero.h1` ni `sectionTitles` contienen `/consultor/i` ni `/seo local sevilla/i`; (b) 6-8 FAQs, cada respuesta con una primera frase ≤ 220 car.; (c) regex anti-promesa `/garantiz|primeras posiciones|te sale en|te recomendar[aá]|asegur/i` sin coincidencias; (d) lista blanca de cifras: solo `500 €`, `300 €`, `10 años`, `2026` y similares; (e) existe `src/pages/seo-para-ia.astro` con `ServiceLayout`; (f) enlace a la home con anchor exacto una sola vez. Aceptación: test ejecutado y fallando por las razones correctas (RED observado: 100% de los casos de datos/página fallan al no existir `seoParaIa`).
- [ ] **T2 — `serviceSchema` con precio opcional.** Ficheros: `src/lib/schema.ts`, `src/data/types.ts` (si `pricing.from` pasa a opcional), caso nuevo en `tests/seo-para-ia.test.js` o `tests/seo-consultor-strategy.test.js`. Ruta: inline (cambio pequeño y entendido). Test primero: `serviceSchema` sin `price` no emite `offers`; con `price` se comporta como hoy (las demás páginas no cambian; snapshot de `diseno-web-sevilla`). Aceptación: RED→GREEN, `astro check` sin errores de tipos en todas las páginas de servicio. Omitir si D1 = variante A con `from: "500 €"` (en ese caso el `Offer` actual sale con el precio de Local Pro; valorar si es correcto semánticamente antes de omitir).
- [ ] **T3 — Entrada `seoParaIa` y página.** Ficheros: `src/data/services.ts`, `src/pages/seo-para-ia.astro`. Ruta: **delegada** (copy extenso + 2 ficheros; el escritor recibe este documento como especificación del copy). Test primero: los casos de T1 (a), (b), (c), (d), (e) pasan de RED a GREEN. Aceptación: `node --test tests/*.test.js` verde; `npm run build` exit 0; copy literal del documento con los `[PENDIENTE]` resueltos según T0 (ninguno `[PENDIENTE` ni `[VERIFICAR` queda en `src/`); verificación de la frase de "Esta web aplica..." contra la config real de rastreadores.
- [ ] **T4 — Enlazado interno e intent matrix.** Ficheros: `src/data/internal-links.ts`, `src/data/seo-intents.ts`, caso de test nuevo. Ruta: delegada (2 ficheros + leer tests de seo-local). Test primero: cada fila de la tabla de enlazado existe con su anchor exacto; la home y las demás páginas no enlazan "consultor SEO en Sevilla" a otra URL que `/`; la fila de `seo-intents.ts` existe y la de seo-local no cambia. Aceptación: suite completa verde (incluidos `seo-consultor-strategy` y `seo-local-sevilla-redesign`); `git diff` no toca `seoLocal.seo` ni títulos/H1/H2 de home y seo-local.
- [ ] **T5 — `llms.txt`.** Ficheros: `public/llms.txt`. Ruta: inline. Test primero: caso que lee el fichero y exige la URL y la línea de honestidad (sin "garantiza"/"posiciona primero"). Aceptación: RED→GREEN; formato idéntico a las demás entradas.
- [ ] **T6 — Check sobre `dist/`.** Ficheros: `scripts/check-seo-para-ia.mjs`, `package.json` (scripts `check:seo-para-ia` y `check:seo-para-ia:dist`). Ruta: inline. Test primero: ejecutar el script antes de que exista la página (falla). Comprueba en `dist/seo-para-ia/index.html`: un solo `<h1>` con "SEO para IA"; canonical correcto; JSON-LD con `Service`, `FAQPage` y `BreadcrumbList`; ausencia de `/consultor/i` fuera del único anchor a la home; ausencia de promesas; `sitemap-0.xml` contiene la URL. Aceptación: `npm run check:seo-para-ia` exit 0.
- [ ] **T7 — Verificación integral.** Ficheros: ninguno. Ruta: **delegada** (ejecución de tests/build/visual). Aceptación: `node --test tests/*.test.js` y `npm run build` verdes; revisión visual desktop y móvil (hero, secciones, FAQ, CTA, sin scroll horizontal); `git diff --check` limpio; confirmar que ningún título/H1/H2 de home ni seo-local cambió.
- [ ] **T8 — Post-publicación (medición).** Ficheros: este documento (registro). Ruta: inline. Aceptación: URL enviada a indexar en Search Console; línea base registrada (impresiones/clics = 0 para las queries objetivo); fechas de seguimiento a 4, 8 y 12 semanas anotadas; snapshot de SERP de "seo para ia" y "geo seo" con DataForSEO (≈0,03 USD por consulta, dentro del límite de 0,15 USD; solo con aprobación).
- [ ] **T9 (opcional) — Hero editorial.** Ficheros: `src/components/seo-ia/SeoParaIaHero.astro` (nuevo) y `src/pages/seo-para-ia.astro`. Ruta: delegada. Solo si D4 = B. Test primero: H1 pequeño con la keyword + `<p class="display">` con el titular; un único `<h1>`. Aceptación: build y tests verdes, sin cambios en el copy.

## Métricas de éxito
Línea base: 0 posiciones y 0 impresiones para estas keywords (informe DataForSEO 2026-10-09).
- Search Console, filtrando por la URL `/seo-para-ia/`: impresiones y clics de "seo para ia", "geo seo", "seo ia", "seo para chatgpt"; posición media. Revisar a las 4, 8 y 12 semanas desde la publicación. Señal de alerta: la URL aparece para "consultor seo sevilla" o "seo local sevilla" (canibalización) → revisar anchors y textos.
- Analítica: sesiones con referrer de asistentes de IA (por ejemplo chatgpt.com, perplexity.ai, gemini.google.com, copilot.microsoft.com), y clics al CTA/WhatsApp desde la URL.
- DataForSEO (bajo coste, con aprobación): posición en SERP para "seo para ia" y "geo seo" (España) a las 8 y 12 semanas, ≈0,03 USD cada consulta; opcional, comprobación de menciones en LLM si la usuaria lo aprueba (coste adicional).
- Expectativa realista: indexación en días; ranking estable de una keyword nacional con dominio sin enlaces, en meses. Medir tendencia, no una posición concreta.

## Progress and evidence
- 2026-10-09: documento creado tras exploración de `services.ts`, `types.ts`, `ServiceLayout.astro`, `seo-local-sevilla.astro`, `SeoLocalHero.astro`, `schema.ts`, `site.ts`, `local-trust.ts`, `internal-links.ts`, `seo-intents.ts`, `public/llms.txt`, `astro.config.mjs`, `tests/seo-consultor-strategy.test.js`, scripts `check-seo-*.mjs`, post GEO e informes de DataForSEO. Ninguna tarea iniciada. Longitudes de title (43) y meta (148) contadas con script.
- Espejo Engram: topic `odd/seo-para-ia-geo-page/tasks`, proyecto nuriaromero.dev. Estado de verificación: ver la nota final de la sesión (se actualiza al leer de vuelta).

## Cómo retomar
1. `mem_context`, luego `mem_search` con `odd/seo-para-ia-geo-page/tasks` (proyecto nuriaromero.dev) y `mem_get_observation` del resultado; leer este fichero; reconciliar si difieren.
2. Re-verificar que sigue siendo cierto: la home sigue siendo dueña de "consultor SEO en Sevilla"; no existe ya una página `seo-para-ia`; precio de Local Pro vigente (500 €/mes + IVA en `seoLocal`); estado de los volúmenes (opcional, relanzar DataForSEO solo con aprobación).
3. Crear rama `feat/seo-para-ia-geo-page` desde `main`; resolver T0 con la usuaria; empezar por T1 (RED).
4. Actualizar este documento y el espejo tras cada tarea, con commit y evidencia.

## Next step
La usuaria decide si arrancamos y responde D1 (precio: incluido en Local Pro o servicio propio). Después, T0 → T1.
