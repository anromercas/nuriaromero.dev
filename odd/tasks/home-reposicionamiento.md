# Feature: reposicionamiento de la home como hub de marca

## Objetivo
Reescribir `src/pages/index.astro` para que deje de competir por la keyword
transaccional "diseño web Sevilla" (que ya posee `/diseno-web-sevilla`) y pase
a funcionar como hub de marca centrado en oportunidades de visibilidad
(SEO local + GEO), dejando el diseño/mejora de web como servicio derivado y
condicional, según la decisión de arquitectura fechada 2026-09-20 en
`.agents/product-marketing-context.md`.

## Problema / por qué
El H1, subheadline, meta title/description y CTA final actuales de la home
repiten casi literalmente la keyword y la promesa de `/diseno-web-sevilla`
("Diseño de páginas web para negocios en Sevilla... traen clientes"),
canibalizando esa página en buscadores. Además, el meta description promete
"traen clientes" — un claim de resultado no verificable, del mismo patrón ya
corregido en el commit `548d430` ("fix(blog): remove unsupported claims from
3 published articles") — y el CTA final usa causalidad de miedo no
verificable ("cada día sin web es un cliente que se lleva otro"). La empresa
ha decidido mover toda keyword comercial de diseño web a `/diseno-web-sevilla`
y crear `/seo-local-sevilla` para el clúster de SEO/agencia SEO; la home debe
quedar libre para ranking de marca y como panel de entrada a todos los
servicios, con el mensaje de oportunidades (Google + IA) como eje principal.

## Alcance

**Dentro de esta feature:**
- Reescritura de `<Layout title / description>` de la home.
- Reescritura del hero (H1, subheadline, párrafo bajo el H1).
- Frase de entrada nueva en el grid de servicios ("¿Qué necesita tu
  negocio?").
- Ajuste de copy del paso `homeProcess` "Lanzamiento y soporte".
- Nueva FAQ sobre SEO local/GEO y reordenación de `homeFaqs`.
- Reescritura del CTA final (`CTASection`).
- Confirmación explícita de "no tocar" en la sección "Casos reales".

**Fuera de esta feature (se planea/ejecuta aparte):**
- Creación de la página `/seo-local-sevilla` — la está planificando otro
  agente en paralelo. Varias tareas de este plan (ver T4 y T5) dependen de
  que esa página y su entrada en `src/data/services.ts` existan antes de
  poder ejecutarse.
- Cualquier cambio a `ServiceLayout.astro`, `PricingCard.astro` o
  `Projects.astro` — no hace falta tocarlos para esta feature (ver
  Decisiones, punto sobre `PricingCard`).
- El servicio recurrente de SEO/GEO en sí (precios, alcance, niveles) ya está
  definido en `.agents/product-marketing-context.md`; este plan solo lo
  referencia para la tarjeta de precio de la home, no lo redefine.

## Restricciones
- Nunca prometer resultados/rankings/velocidad exacta no verificables (regla
  ya establecida en `.agents/product-marketing-context.md`).
- Tono cercano y profesional, tú, español de España neutro.
- El copy de H1/subheadline/CTA de esta sección ya está redactado y
  aprobado por la usuaria (ver Decisiones) — no rediseñar, usar tal cual.
- No modificar la sección "Casos reales" salvo lo indicado en T8 (no
  añadir mención de IA/GEO sin evidencia real que lo respalde).
- Cualquier tarea que dependa de `/seo-local-sevilla` no se ejecuta hasta que
  esa página y su entrada en `services.ts` existan.

## Decisiones (copy ya aprobado, usar literal)

- **H1**: "Más oportunidades para tu negocio en Google y en las búsquedas con
  inteligencia artificial"
- **Subheadline**: "Trabajo para que Google y las nuevas búsquedas con
  inteligencia artificial recomienden tu negocio cuando alguien busca lo que
  ofreces. Si tu web no ayuda a conseguirlo, también la diseño o la mejoro."
- **CTA primario**: "Cuéntame tu negocio por WhatsApp"
- **CTA secundario**: "Ver qué puedo hacer por tu negocio" (ancla a
  `#servicios`)
- **Explicación SEO local** (lenguaje de cliente): "Es el trabajo que hace
  que tu negocio aparezca en Google y en Google Maps cuando alguien busca
  cerca de ti lo que ofreces — por ejemplo, cuando alguien escribe 'clínica
  dental Nervión' o 'restaurante cerca de mí'."
- **Explicación GEO** (lenguaje de cliente): "Es lo mismo, pero para las
  nuevas formas de buscar: cuando alguien le pregunta a ChatGPT, al modo IA
  de Google o a otro asistente qué negocio de tu tipo hay en tu zona, trabajo
  para que el tuyo esté entre las respuestas que da."
- **`PricingCard.astro` no necesita cambios de componente**: `Tier.from` ya
  es `string` libre (confirmado leyendo el componente), así que un valor
  como `"199 €/mes"` cabe sin tocar el componente. El grid de precios propio
  de la home (`index.astro` líneas 174-201) tampoco necesita cambios: itera
  `services` y renderiza `Desde {service.pricing.from}` de forma genérica —
  al añadir el nuevo servicio a `services.ts` (fuera de esta feature, la
  hace el plan de `/seo-local-sevilla`), la tarjeta en la home aparece sola.

## TDD
No aplica en sentido estricto: es contenido y copy sobre componentes de
presentación ya existentes, no lógica de negocio testeable. Verificación
funcional: `pnpm build` (incluye `astro check`) limpio, más revisión visual
manual (desktop y móvil) de hero, grid de servicios, precios, proceso, FAQ,
casos y CTA final. No existe test runner que cubra contenido de páginas en
este repo.

## Checklist de tareas

- [x] **T1 — Meta title/description de la home** (`src/pages/index.astro`
  líneas 74-77). Sustituir el `title`/`description` actuales (repiten
  keyword de `/diseno-web-sevilla` y prometen "traen clientes") por una
  versión de hub de marca sin esa promesa, alineada al mensaje de
  oportunidades (Google + IA), sin nombrar una keyword transaccional
  específica de diseño web ni de SEO local (esas quedan para sus propias
  páginas).
  **Ejecutable ya: sí.**
  Ruta: inline (un solo archivo, cambio mecánico de dos strings).
  Check: `pnpm build` limpio; `dist/index.html` contiene el nuevo
  title/description; grep de "traen clientes" sobre `index.astro` → 0.
  **Hecho** — title: "Nuria Romero | Visibilidad en Google y en búsquedas
  con IA para tu negocio"; description sin "traen clientes" ni keyword
  transaccional de diseño web/SEO local. Verificado en `dist/index.html`.

- [x] **T2 — Hero: H1, subheadline y párrafo** (`src/pages/index.astro`
  líneas 85-97). Sustituir el H1 actual por el H1 aprobado; añadir el
  subheadline aprobado; reescribir el párrafo bajo el H1 para que lidere con
  visibilidad/SEO/GEO (no con "Creo webs rápidas"), dejando la web como
  frase final condicional ("Si tu web no ayuda a conseguirlo, también la
  diseño o la mejoro" ya cubre esto vía el subheadline — el párrafo debe ser
  coherente con esa misma idea, no repetirla con otras palabras
  contradictorias). Actualizar también el CTA primario/secundario del hero
  al copy aprobado (primario: WhatsApp con el texto nuevo; secundario: ancla
  a `#servicios` con el texto nuevo, sustituyendo el botón "Pide presupuesto
  gratis" a `/contacto`).
  **Ejecutable ya: sí.**
  Ruta: inline (un solo archivo, copy ya redactado, sin decisión de diseño
  pendiente).
  Check: `pnpm build` limpio; revisión visual del hero en desktop y móvil;
  confirmar que el CTA secundario hace scroll a `#servicios` (el `id` ya
  existe en la `SectionContainer` de servicios, línea 117).
  **Hecho** — H1 y subheadline aprobados usados literales; párrafo de bio
  reescrito para liderar con SEO local/GEO y dejar la web como frase
  condicional; CTA primario "Cuéntame tu negocio por WhatsApp" (WhatsApp);
  CTA secundario "Ver qué puedo hacer por tu negocio" ancla a `#servicios`
  (sustituye el antiguo "Pide presupuesto gratis" a `/contacto`; se retiró
  el import de `MailIcon` por quedar sin uso). `pnpm build` limpio.

- [x] **T3 — Frase de entrada en el grid de servicios**
  (`src/pages/index.astro`, dentro de `SectionContainer id="servicios"`,
  después de `TitleSection` en línea 121 y antes del `<ul>` en línea 122).
  Añadir una frase corta que enmarque el grid de servicios como el "cómo" del
  mensaje del hero (ej.: cómo consigo esas oportunidades, en la práctica).
  No tocar el resto del grid ni el bloque de nichos (líneas 144-161).
  **Ejecutable ya: sí.**
  Ruta: inline (una frase, un archivo).
  Check: `pnpm build` limpio; revisión visual de que la frase no rompe el
  espaciado de la sección.
  **Hecho** — añadida "Así consigo esas oportunidades en la práctica: elige
  el servicio que más se ajusta a lo que necesitas ahora mismo." entre el
  `TitleSection` y el `<ul>`. `pnpm build` limpio.

- [x] **T4 — Tarjeta de `/seo-local-sevilla` primera en el grid de
  servicios** (`src/data/services.ts`, array `services`). La entrada
  `seoLocal` ya existía (creada en paralelo por el plan
  `seo-local-sevilla.md`, T2); se movió a la primera posición del array
  `services`, delante de `disenoWeb`.
  Ruta: inline (reordenar 1 línea).
  Check: `pnpm build` limpio; `dist/index.html` muestra "SEO local en
  Sevilla" antes que "Diseño web en Sevilla" en el orden de aparición (nav,
  grid de servicios y footer, todos derivan del mismo array).
  **Hecho** — verificado con grep sobre `dist/index.html`.

- [x] **T5 — Confirmar formato de precio en la home**. La entrada
  `seoLocal` usa `pricing.from = "299 €"` (precio del proyecto inicial, no
  un "desde X €/mes" — decisión tomada por el agente que ejecutó
  `seo-local-sevilla.md`: los tiers recurrentes viven en `pricing.tiers`,
  y `pricing.from` representa el precio de entrada real). La tarjeta
  genérica de la home renderiza "Desde 299 €", que es coherente y no
  ambiguo (es el precio real más bajo de ese servicio) — no hizo falta
  ningún ajuste de texto ni tocar el grid.
  Ruta: inline (verificación).
  Check: `pnpm build` limpio; `dist/index.html` muestra "Desde 299 €" en
  la tarjeta de SEO local + GEO del grid de precios.
  **Hecho** — sin cambios de código necesarios.

- [x] **T6 — `homeProcess`: paso "Lanzamiento y soporte"**
  (`src/pages/index.astro` líneas 44-47, dentro del array `homeProcess`
  declarado en líneas 27-48; se renderiza en la sección "Cómo trabajo",
  líneas 203-212). Cambiar el título "Lanzamiento y soporte" por algo del
  tipo "Lanzamiento y mejora continua", y ajustar el texto del paso si hace
  falta para que no describa solo soporte puntual de una web, sino que
  también sea coherente con un servicio recurrente de optimización
  (SEO/GEO). No romper la coherencia con las 4 páginas de servicio, que no
  usan este array (es exclusivo de la home).
  **Ejecutable ya: sí** (no depende de que exista `/seo-local-sevilla`,
  es una generalización del texto, no una mención explícita al servicio).
  Ruta: inline (un título y un texto, un archivo).
  Check: `pnpm build` limpio; revisión de que el texto sigue siendo válido
  para negocios que solo contratan diseño web (no asume que todos contratan
  SEO/GEO recurrente).
  **Hecho** — título cambiado a "Lanzamiento y mejora continua"; texto
  mantiene el soporte puntual post-lanzamiento y añade, como condicional
  ("si el servicio incluye trabajo recurrente"), la mención a SEO local/GEO
  sin asumir que todo negocio lo contrata. `pnpm build` limpio.

- [x] **T7 — `homeFaqs`: nueva FAQ de SEO local/GEO y reordenación**
  (`src/pages/index.astro`, array `homeFaqs` líneas 50-71, renderizado en
  `SectionContainer id="faq"` líneas 232-238). Añadir una nueva FAQ "¿Qué es
  el SEO local y el GEO, y en qué se diferencian de tener una web?" usando
  literalmente las dos explicaciones aprobadas (SEO local y GEO, ver
  Decisiones) como cuerpo de la respuesta. Reordenar el array para que la
  FAQ de precio de la web ("¿Cuánto cuesta una página web para un negocio en
  Sevilla?", hoy primera, línea 51-54) deje de ser la primera — la nueva FAQ
  de SEO local/GEO es candidata a ir primera, coherente con el nuevo
  posicionamiento del hero. `faqSchema(homeFaqs)` (línea 78) no necesita
  cambios de código: regenera el `FAQPage` schema automáticamente a partir
  del array.
  **Ejecutable ya: sí** (la FAQ usa el copy ya aprobado en este plan, no
  depende de contenido de `/seo-local-sevilla`).
  Ruta: inline (una entrada nueva + reordenar un array, un archivo).
  Check: `pnpm build` limpio; `dist/index.html` contiene la nueva pregunta y
  el nuevo orden; verificar que el JSON-LD `FAQPage` incluye la nueva
  entrada (se genera solo desde `homeFaqs`).
  **Hecho** — nueva FAQ "¿Qué es el SEO local y el GEO, y en qué se
  diferencian de tener una web?" añadida como primera entrada de
  `homeFaqs`, con las dos explicaciones aprobadas literales más una frase
  de cierre que responde a la parte "en qué se diferencian de tener una
  web" de la pregunta. La FAQ de precio pasa a segunda posición. Verificado
  en `dist/index.html` (HTML visible y JSON-LD `FAQPage`, que se regenera
  solo desde el array).

- [x] **T8 — Sección "Casos reales": no tocar salvo confirmación**
  (`src/pages/index.astro` líneas 214-228). El texto actual ("ya están
  funcionando y posicionando en Google") es coherente con las restricciones
  de contenido y no requiere cambios. **No añadir mención de IA/GEO en esta
  sección**: no hay evidencia real (casos concretos de Arkady/Adf Sevilla
  posicionando en respuestas de IA) que lo respalde, y añadirlo sería un
  claim no verificable del tipo ya prohibido. Esta tarea es de verificación,
  no de escritura — se marca como completada si al revisar la sección no se
  ha modificado nada, o si un cambio propuesto en otra tarea la afectó por
  error.
  **Ejecutable ya: sí** (es una verificación, no una escritura).
  Ruta: inline (lectura de una sección, sin edición).
  Check: diff de `index.astro` no toca las líneas 214-228; si en el futuro
  Nuria confirma un caso real con mención de IA/GEO, reabrir esta tarea como
  cambio explícito, no implícito.
  **Hecho (verificación)** — la sección "Casos reales" no se ha modificado;
  su contenido es idéntico al original (solo se desplazó de línea por las
  inserciones anteriores en el archivo, de 214-228 a 230-244). No se añadió
  mención de IA/GEO.

- [x] **T9 — CTA final** (`src/pages/index.astro` líneas 240-245,
  componente `CTASection`). Sustituir el título actual ("Tu competencia ya
  está en Google") y el texto actual ("Cada día sin web posicionada es un
  cliente que se lleva otro...", causalidad de miedo no verificable, mismo
  patrón que otros claims ya corregidos en el commit `548d430`) por un
  título del tipo "Hablemos de las oportunidades que te estás perdiendo" y
  un texto alineado al mensaje de oportunidades del hero, sin causalidad de
  miedo ni cifras no verificables.
  **Ejecutable ya: sí.**
  Ruta: inline (dos strings, un archivo).
  Check: `pnpm build` limpio; grep de "cada día sin web" y "se lleva otro"
  sobre `index.astro` → 0; revisión de que el nuevo texto no introduce un
  claim de resultado no verificable.
  **Hecho** — título "Hablemos de las oportunidades que te estás perdiendo";
  texto sin causalidad de miedo ni cifras: "Cuéntame qué negocio tienes y te
  digo, sin compromiso, qué puedo hacer para que Google y las búsquedas con
  inteligencia artificial te encuentren." Grep de "cada día sin web" y "se
  lleva otro" sobre `index.astro` → 0 coincidencias. `pnpm build` limpio.

## Estado
**Completo (T1-T9).** Ejecutado en 2 tandas paralelas (agentes) más el
reorden final del orquestador. Verificado con Playwright y desplegado a
producción (commit `c8dfecb`, main). Re-indexación solicitada en Search
Console el 2026-09-21 ("Se ha solicitado la indexación").
