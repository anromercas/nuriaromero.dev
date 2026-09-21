# Feature: nueva página de servicio /seo-local-sevilla

## Objetivo
Crear la nueva página de servicio "SEO local en Sevilla" en `/seo-local-sevilla`
(raíz, siguiendo la arquitectura de `servicios-a-raiz.md`) para captar el
clúster de keywords de mayor volumen de todo el sitio (`agencia seo sevilla`,
5.000 búsquedas/mes, y el grupo de 500/mes de "SEO local/posicionamiento
Sevilla"), con el mismo proceso que `jerarquia-diseno-web-sevilla.md`: análisis
de competidores → jerarquía H1-H3 → copy → FAQ GEO → decisiones de diseño →
checklist ODD.

## Estado
**T1-T6 completadas (2026-09-21).** Plan aprobado (T1 y T4 confirmados por
la usuaria) y ejecutado en código: nuevo objeto `seoLocal` en
`services.ts`, nueva página `seo-local-sevilla.astro`, línea en
`llms.txt`, `pnpm astro check` y `pnpm build` pasando sin errores.

## Problema / por qué
El sitio no tiene ninguna página que ataque el clúster de SEO local en Sevilla,
pese a ser el término de mayor volumen de búsqueda de todo el negocio (10x el
de diseño web). La home dejó de competir por keywords transaccionales
(actualización 2026-09-20 en `.agents/product-marketing-context.md`) y debe
llevarse a una página dedicada, igual que se hizo con diseño web. Además, el
negocio ya tiene precio validado para este servicio (proyecto inicial 299 € +
recurrente en 2 tiers) sin ninguna página que lo muestre.

## Restricción de negocio ya decidida (no se cuestiona)
- H1 sin la palabra "agencia" literal (Nuria es freelance, no tiene equipo),
  aunque sea el término de mayor volumen — eje "SEO local en Sevilla" /
  "Posicionamiento SEO en Sevilla", con "experta/consultora SEO" como
  vocabulario de apoyo en el cuerpo para captar esa variante también.
- Precio ya validado, no negociable en este plan:
  - **Proyecto inicial**: 299 € precio cerrado (auditoría SEO/GEO +
    configuración de Google Business Profile + datos estructurados + FAQs
    para buscadores con IA).
  - **Recurrente, 2 tiers**: Básico desde 199 €/mes (poca competencia local:
    1 pieza de contenido/mes, GBP, seguimiento mensual) y Competitivo desde
    349 €/mes (sectores disputados: 2-3 piezas de contenido/mes, optimización
    más frecuente, informe mensual detallado). Compromiso mínimo sugerido de
    3 meses en el recurrente.

## Análisis de competidores (hecho con WebFetch, 2026-09-21)

Se analizaron 6 de las 9 agencias que rankean hoy para el clúster (las 3
restantes no se llegaron a analizar por límite de tiempo, no por fallo de
carga; ninguna de las URLs dio 404 en este pase).

### 1. GF Publicidad — https://gfpublicidad.es/posicionamiento-web/sevilla/
- H1: "Posicionamiento web en Sevilla"
- H2 clave: "La dura realidad del posicionamiento web en Sevilla", "Agencia
  Posicionamiento Web Sevilla", "No más promesas vacías", "Por qué Google te
  ignora", "¿Qué sentirás cuando tu negocio domine la primera página de
  Google?", FAQ, "Historias de empresarios que dejaron de ser invisibles",
  reseñas, CTA de auditoría gratis.
- **Sí muestra precio**: 600-1.200 € (local) y 1.500-3.000 €/mes
  (competitivo) — es el único con rango de precio parecido a nuestros tiers.
- Casos de éxito con nombre (Clínicas DentalBell, Manosalbas, Tapias), 110
  reseñas de Google citadas, proceso en 4 pasos, 8 FAQ.
- Usa "agencia" varias veces. Promete "top 3" / "dominar la primera página"
  — roza la promesa de posición concreta.

### 2. Posiciona Tu Web Sevilla — https://www.posicionatuwebsevilla.com/
- H1: "Posicionamiento Seo local en Sevilla" (ya usa casi literalmente
  nuestro eje elegido).
- H2 clave: "¿Por qué invertir en Posicionamiento Web Local?", casos de
  éxito con URLs reales de clientes, "¿Cómo logramos posicionarte?" (método
  en 4 etapas), FAQ (5 preguntas).
- **No muestra precio** ("presupuesto personalizado").
- Usa "agencia" con frecuencia. No promete posiciones concretas, lenguaje
  vago ("primeros resultados").

### 3. PluxDigital — https://pluxdigital.com/agencia-seo-local-sevilla/
- H1: "La agencia de SEO Local que pone tu negocio en lo más alto de Google
  en Sevilla".
- H2 clave: "Análisis por zonas", "Franja horaria de mayor búsqueda", "Así
  trabajamos con un negocio de restaurante en Sevilla" (caso ilustrativo,
  +65% interacciones), "Los sectores que más se benefician", FAQ.
- No muestra precio (solo "ver tarifas", sin cifra). Sí promete "posiciones
  de Google" y una métrica de resultado (+65%) — sin aclarar si es
  verificable o ilustrativa.

### 4. SEO Local Sevilla — https://seolocalsevilla.com/
- H1: "Seo Local Sevilla".
- H2 clave: repite "Seo Local Sevilla" / "Agencia Seo Local Sevilla" /
  "Consultor Seo Local Sevilla" casi como variantes de keyword encadenadas
  (relleno de keyword, poco natural), "Ventajas del posicionamiento Local",
  "Factores del SEO Local", FAQ (6 preguntas).
- **Sí muestra precio**: "mínimo de 300 €/mes" — sin proyecto inicial ni
  entrada más barata.
- Sin casos de éxito ni testimonios. Sin proceso paso a paso explicado (solo
  lista de servicios). Sí da una horquilla de tiempo ("1 a 6 meses").

### 5. Mora Estudio Creativo — https://moraestudiocreativo.es/agencia-de-seo-en-sevilla/
- H1: "Agencia de SEO en Sevilla".
- H2 clave: "Posicionamiento web y SEO Local para pymes y autónomos de
  Sevilla", "Cómo trabajamos el SEO Orgánico", "SEO Local en Sevilla — Domina
  el posicionamiento en Google Maps", "Cómo trabajamos el SEO local de tu
  negocio físico".
- No muestra precio. Caso de éxito con gráficas (Clínica Blife, en Madrid,
  no Sevilla). Proceso explicado por fases. 30 reseñas de Google.
- Es el único que hace framing anti-hype explícito: "cualquiera que te
  prometa #1 en 30 días te miente" — el honesty-framing NO es un hueco
  100% libre, pero ninguno lo combina con precio cerrado transparente.

### 6. seosevilla.com
- H1 genérico de marca ("Hacemos Grandes Tus Ideas"), no optimizado a la
  keyword — punto débil claro de esta web.
- H2 clave: "SEO en Sevilla: posicionamiento web, visibilidad orgánica...",
  "Auditoría SEO", "SEO técnico: la infraestructura que define el techo"
  (jerga sin explicar), "SEO local en Sevilla: la palanca de captación más
  directa".
- +200 proyectos, lista de clientes con nombre, proceso "01 Radiografiamos,
  02 Configuramos, 03 Desplegamos, 04 Ajustamos". Promete métricas fuertes
  ("+340% tráfico", "x5 llamadas", "primeras posiciones de Google") sin
  matizar que no son garantía. No tiene FAQ visible. No muestra precio.

## Hallazgos de la exploración (huecos = oportunidad de diferenciación)

1. **Ningún competidor menciona GEO / IA** (ChatGPT, Perplexity, AI
   Overviews, "que te cite un asistente de IA"). Los 6 hablan solo de Google
   clásico. Es el hueco más grande y el más alineado con lo que Nuria ya
   vende (FAQs para buscadores con IA, datos estructurados) — nadie más en
   el SERP local de Sevilla lo está usando como diferenciador hoy.
2. **Nadie ofrece una entrada de bajo compromiso y precio cerrado.** Las
   opciones son: sin precio público ("presupuesto personalizado", 3 de 6) o
   compromiso mensual directo desde 300 €-3.000 €/mes sin escalón previo (2
   de 6). El proyecto inicial de 299 € (auditoría + GBP + datos
   estructurados + FAQs IA) antes de pedir un recurrente es un paso que
   ningún competidor analizado ofrece — resuelve directamente el miedo del
   avatar a "quedar atada" a una cuota mensual sin saber antes qué se
   consigue.
3. **La mayoría usa jerga sin explicar** ("SEO técnico", "linkbuilding",
   "la infraestructura que define el techo") o relleno de keyword poco
   natural (seolocalsevilla.com repite "Agencia/Consultor/Seo Local Sevilla"
   como H2 encadenados). Explicar SEO y GEO en lenguaje de cliente (como ya
   exige `.agents/product-marketing-context.md`) es diferenciador real
   frente a este grupo.
4. **Varios prometen resultados/posiciones concretas** ("dominar la primera
   página", "+340% tráfico", "x5 llamadas", "top 3") sin matizar que no es
   garantizable — exactamente el tipo de claim que este sitio ya corrigió en
   otras páginas (`fix(blog): remove unsupported claims`, commit reciente).
   El framing de "proceso y oportunidades medibles, nunca posición
   garantizada" es coherente con la política del sitio y diferente de la
   mayoría del SERP (solo Mora Estudio hace algo parecido).
5. **Ninguno explica el "de qué se compone" del SEO local para alguien que
   no sabe qué es Google Business Profile o un dato estructurado** — todos
   asumen que el lector ya sabe qué está comprando. Coincide con el avatar
   de Nuria (no nativo digital) más que con el lector medio al que apuntan
   estas 6 páginas (dueños de pyme algo más digitalizados).

## Jerarquía de encabezados propuesta

```
H1  SEO local en Sevilla para negocios que quieren clientes, no solo aparecer en Google
H2  ¿Sales en Google pero no te llaman, o todavía no apareces cuando te buscan?
H2  SEO local en Sevilla explicado por una desarrolladora, no solo "posicionamiento"
  H3  Que te encuentren en Google Maps cuando buscan "tu cosa + tu barrio"
  H3  Que te citen los buscadores con inteligencia artificial (ChatGPT, Perplexity, AI Overviews)
  H3  Proceso y oportunidades medibles, nunca una posición prometida
H2  Cuánto cuesta el SEO local en Sevilla
  H3  Proyecto inicial: auditoría SEO/GEO + Google Business Profile — 299 €
  H3  Básico desde 199 €/mes (poca competencia en tu sector/zona)
  H3  Competitivo desde 349 €/mes (sectores disputados)
H2  Así es el proceso de trabajar tu SEO local
  H3  Auditoría inicial de tu negocio y tu competencia en Sevilla
  H3  Configuración de base: Google Business Profile, datos estructurados, FAQs para IA
  H3  Contenido y optimización mensual
  H3  Seguimiento e informe cada mes
H2  Negocios de Sevilla en los que ya he trabajado el SEO local
H2  Por qué elegir a alguien que programa, no solo "hace SEO"
H2  Preguntas frecuentes sobre SEO local en Sevilla
H2  Empecemos con el SEO local de tu negocio en Sevilla
```

Nota sobre el H2 de "negocios en los que ya he trabajado el SEO local": **no
se presentan como casos de éxito de posicionamiento** (no hay datos de
ranking ni tráfico verificables todavía para este servicio, que es nuevo).
Se reutiliza `Projects.astro` con los mismos proyectos de siempre (Arkady,
Adf Sevilla), porque el SEO local (alta y configuración de Google Business
Profile, estructura semántica) ya formaba parte del proceso de diseño web
que se les hizo — es un hecho verificable, no una promesa de resultado. El
título del H2 lo deja explícito para no insinuar métricas que no existen.

## Contenido redactado

### H1 — opción por defecto y alternativas
- **Opción A (por defecto)**: "SEO local en Sevilla para negocios que
  quieren clientes, no solo aparecer en Google" — mantiene la fórmula ya
  usada en `/diseno-web-sevilla` ("...que quieren clientes, no solo..."),
  coherencia de marca entre páginas de servicio, y ataca directamente la
  objeción real del avatar (rankings sin llamadas no sirven de nada).
- **Opción B**: "Posicionamiento SEO en Sevilla: que te encuentren en
  Google y en las búsquedas con inteligencia artificial" — más explícito en
  GEO (el hallazgo #1 de diferenciación) pero menos alineado con el patrón
  de H1 ya usado en el sitio.
- **Opción C**: "SEO local en Sevilla sin promesas de humo: proceso claro y
  precio cerrado desde 299 €" — pone el precio y el framing anti-hype (el
  hallazgo #4) directamente en el H1, más agresivo pero puede sonar
  defensivo/reactivo a la competencia en vez de propositivo.

### Subheadline
"Que te encuentren cuando alguien busca lo que ofreces en tu barrio, tanto
en Google como en los asistentes de inteligencia artificial. Sin cuotas
mensuales a ciegas: empiezas con un proyecto inicial de precio cerrado antes
de decidir si sigues cada mes."

### CTA primario / secundario
Primario: **"Pide tu auditoría SEO/GEO"**. Secundario: "Ver precios" (ancla
a `#precios`, mismo patrón que diseño web).

### Borrador de secciones principales

**Sección de dolor (H2 "¿Sales en Google pero no te llaman...?")** — sin
tarjeta, tono editorial (mismo patrón que diseño web): explica que aparecer
en una búsqueda no es lo mismo que aparecer en las búsquedas correctas para
tu negocio y tu zona, que muchos negocios de Sevilla ya están en Google Maps
pero con la ficha desactualizada o sin ninguna reseña gestionada, y que cada
vez más gente pregunta directamente a ChatGPT o al buscador con IA de Google
en vez de escribir una búsqueda clásica — si tu negocio no está preparado
para eso, no apareces ni ahí.

**Sección de diferenciadores (benefits, 3 H3)** — mapea a `benefits` de
`ServicePageData`, mismo patrón que diseño web:
1. *Google Maps / SEO local*: ficha de Google Business Profile completa y
   optimizada, datos estructurados para que Google entienda qué eres y
   dónde estás.
2. *GEO / búsquedas con IA*: FAQs redactadas para que los asistentes de IA
   puedan citar directamente tu negocio, explicado en una frase sin asumir
   que el lector sabe qué es un LLM ("los programas de inteligencia
   artificial que la gente usa para buscar en vez de Google, como ChatGPT").
3. *Proceso, no promesa*: se explica exactamente qué se hace cada mes y qué
   se entrega (informe), nunca una posición o un resultado garantizado.

**Sección de precio (H2 "Cuánto cuesta el SEO local en Sevilla")** — usa
`PricingCard` en modo `tiers` con 3 elementos: proyecto inicial (299 €, sin
recurrencia) + tier Básico (199 €/mes) + tier Competitivo (349 €/mes,
`recommended` si se decide destacar uno, a confirmar con la usuaria — ver
Restricciones). Nota explicativa encima del grid ayudando a decidir Básico
vs. Competitivo según nivel de competencia del sector/zona, mismo patrón que
la nota landing-vs-completa de diseño web.

**Proceso (4 H3)**: auditoría inicial → configuración de base (GBP + datos
estructurados + FAQs IA, coincide con lo que se entrega en el proyecto
inicial de 299 €) → contenido y optimización mensual → seguimiento e informe
mensual.

**"Negocios de Sevilla en los que ya he trabajado el SEO local"**: reutiliza
`Projects.astro only={["arkady", "adfsevilla"]}` (igual que diseño web), con
blurb honesto (SEO local como parte del proceso de diseño web, no resultado
de posicionamiento aislado).

**"Por qué elegir a alguien que programa, no solo hace SEO"**: sin tarjeta,
2-3 puntos: viene del desarrollo de software (dato estructurado bien hecho,
no un plugin genérico), precio cerrado en el proyecto inicial, trato
directo sin depender de una agencia con varios interlocutores.

### FAQs GEO-optimizadas — lista de preguntas propuestas (mínimo 10, texto
completo pendiente de redactar en la ejecución con `claude-seo:seo-geo`,
siguiendo el mismo criterio de citabilidad que diseño web: bloques
autocontenidos ~140-160 palabras, respuesta directa al inicio, sin cifras no
verificadas)

1. ¿Qué es el SEO local y en qué se diferencia del SEO normal?
2. ¿Cuánto cuesta el SEO local en Sevilla?
3. ¿Qué es el GEO y por qué me interesa si ya hago SEO?
4. ¿Cuánto tiempo se tarda en ver resultados con el SEO local?
5. ¿Me garantizas que voy a salir en la primera página de Google?
6. ¿Qué incluye exactamente el proyecto inicial de 299 €?
7. ¿En qué se diferencia el tier Básico del Competitivo, y cuál me conviene?
8. ¿Tengo que quedarme un mínimo de tiempo contratado?
9. ¿Necesito tener ya una web para contratar el SEO local, o me la puedes
   hacer también?
10. ¿Qué es Google Business Profile y por qué es tan importante para un
    negocio local?
11. ¿Cómo hace un asistente de inteligencia artificial (ChatGPT, Perplexity)
    para recomendar un negocio en vez de otro?
12. ¿Trabajas el SEO local solo para negocios de Sevilla?

(12 preguntas listadas, mínimo 10 se seleccionarán/redactarán al ejecutar;
descartar solapes con las FAQ de `/diseno-web-sevilla` si el negocio no
tiene web propia se resuelve remitiendo a esa página, no duplicando
contenido).

### Meta content (SEO title/description)
- **Title**: `SEO local en Sevilla | Auditoría SEO/GEO desde 299 €` (52
  car., a ajustar en ejecución si excede el límite recomendado).
- **Description**: `Posicionamiento SEO local en Sevilla para negocios que
  quieren clientes: Google Maps, datos estructurados y FAQs para buscadores
  con IA. Proyecto inicial 299 €, recurrente desde 199 €/mes.` (aprox. 165
  car., ajustar en ejecución).

## Decisiones de diseño

1. **Reutilizar `ServiceLayout.astro` tal cual** — ya es genérico
   (secciones configurables vía `sectionTitles`, slot `before-benefits` para
   la sección de dolor, slot libre entre precio y FAQ para case studies y
   "por qué elegir"). No requiere ningún cambio de layout.
2. **`PricingCard.astro` ya soporta el caso de 3 elementos en `tiers`
   (confirmado leyendo el componente, línea 5-18 y 23-73)**: el campo
   `from` es un `string` libre, así que `"199 €/mes"` y `"349 €/mes"` caben
   sin tocar el componente (solo el proyecto inicial de 299 € no lleva
   "/mes" en el string, también soportado al ser texto libre). Único punto
   a decidir en ejecución: si se destaca uno de los 3 con `recommended`
   (badge "Recomendado") — candidato natural es el tier Competitivo por ser
   el de mayor margen, pero no está decidido, dejar como pregunta abierta
   al ejecutar T3.
3. **`FAQ.astro` sin cambios** — acordeón nativo, ya probado con 10 ítems en
   diseño web.
4. **`Projects.astro` sin cambios** — ya soporta `only={["arkady",
   "adfsevilla"]}` (feature añadida en `jerarquia-diseno-web-sevilla.md`
   T12), se reutiliza tal cual.
5. **Alternar tarjeta / sin tarjeta**, mismo patrón que diseño web: dolor,
   case studies y "por qué elegir" sin tarjeta (editorial); diferenciadores,
   precio y proceso con tarjeta.
6. **Nav del Header**: no requiere cambio de código. `Header.astro` genera
   el dropdown de servicios dinámicamente desde `[...services, ...niches]`
   (confirmado, línea 51) — añadir el nuevo objeto al array `services` de
   `src/data/services.ts` lo mete solo en el menú.
7. **No se crea ningún componente nuevo.** Todo el contenido nuevo encaja en
   los componentes de servicio ya existentes.

## Restricciones
- No prometer resultados, tráfico, posiciones o rankings concretos en
  Google ni en buscadores con IA — el negocio vende "proceso y oportunidades
  medibles", nunca garantía de resultado. Ningún H2/H3/FAQ debe usar cifras
  de resultado tipo "+340% tráfico" o "top 3" (a diferencia de varios
  competidores analizados).
- No presentar Arkady/Adf Sevilla como "casos de éxito de SEO" con métricas
  — solo como negocios en los que ya se ha configurado SEO local real
  (verificable), sin inventar cifras de ranking o tráfico que no existen
  para este servicio nuevo.
- SEO y GEO deben explicarse en lenguaje de cliente en cada mención (no
  asumir que el lector sabe qué es un dato estructurado, un LLM o Google
  Business Profile) — coherente con el avatar (no nativo digital).
- Precio debe coincidir siempre con `src/data/services.ts` como fuente
  única de verdad, igual que las otras 4 páginas de servicio.
- Tono cercano y profesional, tú, español de España neutro, sin jerga sin
  explicar.
- Compromiso mínimo de 3 meses en el recurrente debe mencionarse de forma
  transparente (al menos en una FAQ), no ocultarse en letra pequeña.

## TDD
No aplica: es contenido + reutilización de componentes de presentación ya
existentes, sin lógica de negocio nueva. Verificación funcional: `pnpm
astro check && pnpm build` (ya es el script `build` del repo), revisión
visual manual de la jerarquía de encabezados, y verificación de que las
otras 4 páginas de servicio no cambian (mismo patrón que
`jerarquia-diseno-web-sevilla.md`).

## Checklist de tareas

- [x] **T1 — Confirmación de H1 y tier destacado** (confirmado por la
  usuaria, 2026-09-21): Opción A de H1 ("SEO local en Sevilla para
  negocios que quieren clientes, no solo aparecer en Google"). Badge
  "Recomendado" en el tier **Competitivo (349 €/mes)**. Layout de precios:
  el proyecto inicial de 299 € se muestra como bloque separado ENCIMA del
  grid de los 2 tiers recurrentes, no como tercer elemento del mismo grid
  (ver T4, decisión ya tomada, no queda abierta).
  Ruta: pregunta a la usuaria — respondida.
  Check: respuesta registrada arriba.

- [x] **T2 — Nuevo objeto `seoLocal` en `services.ts`** (hecho,
  2026-09-21): añadido el objeto `ServicePageData` completo al final del
  array `services` exportado, sin reordenar los 4 existentes (confirmado
  con `git diff` — solo inserciones). Incluye hero (H1 opción A +
  subheadline + secondaryCta "Ver precios"), `sectionTitles` con los 4 H2,
  3 `benefits`, 4 `process`, `pricing` con `from: "299 €"`, `note` de
  ayuda para elegir tier, `initial` (proyecto inicial 299 € con includes y
  nota) y `tiers` (Básico 199 €/mes, Competitivo 349 €/mes
  `recommended: true`, ambos con nota de compromiso mínimo de 3 meses), y
  12 `faqs` completas (~140-170 palabras cada una, estilo GEO igual que
  `disenoWeb.faqs`). Para separar el proyecto inicial del grid de tiers
  (T4) se añadió el campo opcional `pricing.initial` al tipo
  `ServicePageData` (`src/data/types.ts`) y se extendió `PricingCard.astro`
  (`src/components/services/PricingCard.astro`) para renderizarlo como
  bloque propio ENCIMA del grid solo cuando `initial` está definido — las
  4 páginas existentes no pasan ese campo, así que su render no cambia
  (verificado: 0 diferencias en su HTML generado).
  Check: `pnpm astro check` — 0 errores. `pnpm build` — 0 errores, 21
  páginas generadas incluyendo `seo-local-sevilla`.

- [x] **T3 — Nueva página `src/pages/seo-local-sevilla.astro`** (hecho,
  2026-09-21): mismo patrón que `diseno-web-sevilla.astro` — `ServiceLayout`
  con `page={seoLocal}`, slot `before-benefits` con la sección de dolor
  (sin tarjeta), y slot libre con "Negocios de Sevilla en los que ya he
  trabajado el SEO local" (`Projects only={["arkady","adfsevilla"]}` +
  blurb honesto sin métricas de ranking) y "Por qué elegir a alguien que
  programa, no solo 'hace SEO'" (lista con checks, sin tarjeta).
  Check: `pnpm build` limpio; `dist/seo-local-sevilla/index.html` contiene
  el H1 elegido y las 3 secciones del slot libre (verificado con `rg`).

- [x] **T4 — Layout de precio decidido** (confirmado por la usuaria,
  2026-09-21): el proyecto inicial (299 €) se separa visualmente del grid
  de tiers recurrentes, no entra como tercer elemento del mismo
  `sm:grid-cols-2`. Estructura al ejecutar: un bloque/tarjeta propio para
  "Proyecto inicial — 299 €" (fuera del array `tiers`, o como primer tier
  con `recommended: false` pero renderizado en su propia fila si
  `PricingCard` no distingue tipos — a resolver con un pequeño ajuste
  retrocompatible en `PricingCard.astro` o con un bloque manual en
  `seo-local-sevilla.astro` fuera del componente, lo que quede más simple
  al ejecutar) y debajo el grid de 2 columnas ya existente con Básico y
  Competitivo (`recommended: true`).
  Ruta: inline (verificación de que el HTML generado respeta esta
  separación) + delegada si `PricingCard.astro` necesita el ajuste.
  Check: `pnpm build` limpio; `dist/seo-local-sevilla/index.html` muestra
  el proyecto inicial en su propio bloque, separado del grid de tiers.

- [x] **T5 — `public/llms.txt`** (hecho, 2026-09-21): añadida la línea del
  nuevo servicio en la sección "Servicios", mismo formato que la línea
  existente de diseño web.
  Check: `rg "seo-local-sevilla" public/llms.txt` devuelve 1 línea. ✓

- [x] **T6 — Verificación final** (hecho, 2026-09-21): `pnpm astro check`
  → 0 errores, 0 warnings relevantes (1 hint preexistente en
  `Schema.astro`, no relacionado). `pnpm build` → 0 errores, 21 páginas
  generadas. `dist/sitemap-0.xml` contiene
  `https://nuriaromero.dev/seo-local-sevilla/`. `dist/seo-local-sevilla/index.html`
  verificado con `rg`: H1 correcto ("SEO local en Sevilla para negocios
  que quieren clientes, no solo aparecer en Google"), 12 preguntas en el
  FAQ schema (`"@type":"Question"` × 12, ≥10 requeridas), bloque "Proyecto
  inicial" (299 €) separado del grid de 2 tiers (Básico 199 €/mes,
  Competitivo 349 €/mes con badge "Recomendado"). `git diff --stat` de las
  4 páginas de servicio existentes (`diseno-web-sevilla.astro`,
  `desarrollo-software-medida.astro`, `automatizaciones.astro`,
  `inteligencia-artificial.astro`) → sin cambios. HTML generado de
  `diseno-web-sevilla` verificado sin el bloque nuevo "Proyecto inicial"
  (0 coincidencias), confirmando que el cambio en `PricingCard.astro` es
  retrocompatible. No se ejecutó verificación con Playwright/`pnpm
  preview` (no solicitada explícitamente en esta ejecución; el build
  estático y la inspección de HTML generado cubren el check funcional
  pactado en el plan).
  Nota: `src/pages/index.astro` aparece modificado en `git status`, pero
  es un cambio preexistente de otro trabajo en curso (reposicionamiento de
  home, ver `odd/tasks/home-reposicionamiento.md`), no tocado en esta
  ejecución — confirmado no editando ni leyendo ese archivo en ningún
  momento de T2-T6.

## Próximo paso
T1-T6 completadas (2026-09-21). `pnpm astro check` y `pnpm build` pasan
sin errores. Pendiente: que el orquestador integre este trabajo con el
resto de cambios en curso (reposicionamiento de home, orden del array
`services` en `src/pages/index.astro`) y decida si se ejecuta la
verificación opcional con Playwright/`pnpm preview` antes de commitear.
Ningún `git add`/`commit` se ha realizado en esta ejecución.
