# Feature: nueva jerarquía H1/H2/H3 en /servicios/diseno-web-sevilla

## Objetivo
Reescribir la jerarquía de encabezados de la página de diseño web en Sevilla
según el análisis competitivo (YAG, Mr Bogart, Alos Innovation) acordado con
el usuario, para diferenciarse en tres huecos que ninguno de los 3
competidores cubre: geolocalización explícita en el H1, SEO local/Maps como
encabezado propio, y el miedo a "quedar atada" a una agencia resuelto de
forma explícita.

## Estado
**Plan generado, NO ejecutar todavía.** El usuario pidió el plan "para
atacarlo cuando proceda" — queda a la espera de luz verde para empezar T1.

## Problema / por qué
La jerarquía actual usa títulos de sección genéricos y compartidos por las
4 páginas de servicio ("Qué vas a conseguir", "Cómo trabajo", "Precio
orientativo", "Preguntas frecuentes" — hardcodeados en
`src/layouts/ServiceLayout.astro`), sin keywords reales en los H2, sin
sección de dolor, sin prueba social propia y sin diferenciación local
explícita frente a competidores que no atacan "Sevilla" en su H1.

## Jerarquía acordada (referencia)
```
H1  Diseño web en Sevilla para negocios que quieren clientes, no solo una web bonita
H2  ¿Tu web actual no te trae clientes, o todavía no tienes una?
H2  Diseño web en Sevilla hecho por una programadora, no con plantillas
  H3  Rápida y con Core Web Vitals aprobados por Google
  H3  SEO local desde el primer día: apareces en Google y en Google Maps
  H3  La web es tuya: dominio y hosting a tu nombre, sin cuotas ocultas
H2  Cuánto cuesta una página web en Sevilla
  H3  Landing de una página desde 149 €
  H3  Web completa de hasta 5 páginas desde 399 €
H2  Así es el proceso de crear tu página web
  H3  Hablamos de tu negocio
  H3  Presupuesto cerrado, sin sorpresas
  H3  Diseño y desarrollo
  H3  Lanzamiento y primer mes de soporte
H2  Webs reales de negocios de Sevilla
H2  Por qué elegir a alguien de Sevilla para tu web
H2  Preguntas frecuentes sobre diseño web en Sevilla
H2  Empecemos con tu página web en Sevilla
```

## Contenido redactado (borrador final, pendiente de confirmación del usuario)

Redactado con la skill `/copywriting` sobre la jerarquía acordada arriba.
**No está confirmado todavía** — falta que el usuario elija la opción de H1
y dé el visto bueno final antes de pasarlo a `services.ts` en T3.

### H1 — pendiente de elegir una opción
- **Opción A (por defecto si no se dice lo contrario)**: "Diseño web en
  Sevilla para negocios que quieren clientes, no solo una web bonita"
- **Opción B**: "Tu negocio en Sevilla, encontrado en Google antes que tu
  competencia"
- **Opción C**: "Diseño web en Sevilla: rápida, en Google, y tuya de
  verdad"

### Subheadline
"Tu web trabaja 24 horas y es lo primero que ve un cliente antes de
decidirse. Si buscan lo que ofreces en Sevilla, que te encuentren a ti."

### CTA primario / secundario
Primario: **"Pide tu presupuesto por WhatsApp"**. Secundario: "Ver precios"
(arriba) / "Escríbeme por el formulario" (cierre).

### Cuerpo completo por sección
El texto completo de cada H2/H3 (dolor, diferenciadores, precios con ayuda
de decisión landing-vs-completa, proceso en 4 pasos, case studies de
Arkady/Adf Sevilla, por qué alguien de Sevilla) está redactado y aprobado
en cuanto a estructura — el texto íntegro vive en el historial de esta
conversación (mensaje del redactor SEO + pulido con `/copywriting`). Al
ejecutar T3, recuperar ese texto completo como fuente para
`src/data/services.ts`.

**Pendiente real**: nombre/rubro exacto de Adf Sevilla para el blurb de
case studies (hoy genérico "negocio familiar sevillano" por falta de dato).

### Meta content (SEO title/description) — reemplaza el actual en `services.ts`
- **Title**: `Diseño web en Sevilla | Precio cerrado desde 149 €` (49 car.)
- **Description**: `Diseño páginas web en Sevilla para negocios locales:
  rápidas, con SEO local y precio cerrado antes de empezar. Web completa
  desde 399 €, landing desde 149 €.` (159 car.)

### FAQs GEO-optimizadas (10 preguntas) — reemplazan las 5 actuales
Generadas con el skill `claude-seo:seo-geo` aplicando criterios de
citabilidad por LLMs (bloques autocontenidos de ~140-160 palabras,
respuesta directa en las primeras líneas, sin cifras no verificadas):

1. ¿Cuánto cuesta una página web en Sevilla?
2. ¿Cuánto tiempo se tarda en tener la página web lista?
3. ¿Qué diferencia hay entre una web hecha a medida y una hecha con Wix o
   una plantilla de WordPress?
4. Si contrato a un diseñador web, ¿la página queda a mi nombre o me
   quedo atado a esa persona o agencia?
5. ¿Mi página web va a aparecer en Google?
6. ¿Necesito saber de tecnología para gestionar mi web después de que me
   la entregues?
7. ¿Trabajas solo con negocios de Sevilla o también en remoto?
8. ¿Qué incluye exactamente el precio de 399 € de la web completa?
9. Ya tengo una página web pero no me está funcionando, ¿qué puedo hacer?
10. ¿Es mejor una landing de una página o una web completa de varias
    páginas?

El texto completo de cada respuesta vive en el historial de esta
conversación (mensaje "GEO / preguntas frecuentes"). Al ejecutar la tarea
de FAQ, recuperar esas 10 respuestas completas tal cual, sin resumir.

**Decisión ya tomada**: estas 10 preguntas sustituyen a las 5 FAQs
actuales de `disenoWeb.faqs` (no se acumulan ambas, para no duplicar
contenido ni diluir cuál responde qué). La idea de una FAQ de garantía
(antiguo T8) queda descartada salvo que Nuria confirme una promesa real
que pueda sostener — no está entre las 10 generadas.

**Ya resuelto, no requiere trabajo nuevo**: el schema `FAQPage`
(`faqSchema()` en `src/lib/schema.ts`, usado por `ServiceLayout.astro`) ya
se genera automáticamente a partir de `page.faqs` — al reemplazar el
array, el structured data se actualiza solo.

## Criterios de diseño visual (pedidos por el usuario)
- Estilo limpio y profesional, orientado a generar confianza.
- Hero arriba con titular principal y botón de llamada a la acción.
- Secciones bien diferenciadas visualmente para cada H2/H3 (la página ahora
  tiene bastante más contenido que la versión anterior).
- FAQ visible y bien estructurado al final (10 preguntas).
- Tono visual de "empresa de calidad", no low-cost/plantilla genérica.
- Responsive / mobile-first.

## Sistema de diseño actual (mapeado, sin tocar nada — se respeta, no se reinventa)
- **Sin tokens de color propios**: Tailwind v3 con `theme.extend` vacío. La
  paleta real es por convención de uso: `gray` (neutro: texto/bordes/fondos
  de tarjeta), `green-600/500` (único color de acción — CTA de WhatsApp),
  `yellow-500/200` (acento secundario, ya usado en los números del proceso),
  `blue-500` (enlaces). El único elemento "de marca" es un degradado radial
  violeta/azulado decorativo de fondo en `Layout.astro`, fijo en toda página.
- **Tipografía única**: "Onest Variable" (`@fontsource-variable/onest`) en
  todo el sitio, sin fuente display secundaria.
- **Modo oscuro** vía clase (`darkMode: 'class'`), cada componente lleva su
  variante `dark:` — cualquier componente nuevo debe seguir el mismo patrón.
- **Contenedor estándar**: `SectionContainer` (ancho máximo por breakpoint)
  + `TitleSection` (H2 con icono) — usado en TODAS las secciones del sitio,
  incluida la home (`index.astro`), que ya tiene la misma estructura
  multi-sección (`space-y-24`, IDs de ancla) que se quiere llevar aquí.
- **Sin librerías de animación** (ni Framer Motion ni GSAP): todo el motion
  del sitio es CSS/Tailwind puro + Astro View Transitions nativas. No se
  introduce ninguna dependencia nueva para esta feature.
- **Componentes de servicio ya existentes** (`ServiceHero`, `PricingCard`,
  `ProcessSteps`, `FAQ`, `CTASection`, `BenefitsGrid`): todos usan el mismo
  patrón visual de tarjeta (`rounded-xl border-gray-300 bg-gray-100/50
  dark:bg-gray-800/50`) — es precisamente esta repetición uniforme la que
  hace que la página se sienta "plantilla" en vez de "empresa de calidad"
  cuando hay muchas secciones seguidas.
- **`PricingCard.astro` es de 1 solo tier hoy** — no soporta los 2 tiers
  (landing/web completa) que pide el contenido ya redactado.
- **`FAQ.astro`** ya es un acordeón nativo `<details>/<summary>` sin JS,
  accesible — sirve tal cual para 10 preguntas, no requiere rediseño.
- **`Projects.astro`** ya existe y se usa en portfolio/home para mostrar
  proyectos con enlace — candidato directo a reutilizar para la sección de
  case studies en vez de crear un componente nuevo desde cero.
- **Iconos**: no hay iconos genéricos de "diferenciador/checklist" más allá
  de `Briefcase`/`Code`/`ProfileCheck` — puede hacer falta 1-2 SVG nuevos
  siguiendo el mismo patrón de archivo `.astro` si los 3 diferenciadores
  necesitan icono propio.

## Decisiones de diseño (nuevas, dentro del sistema existente)
1. **Alternar tarjeta / sin tarjeta entre secciones**: dolor y "por qué
   Sevilla" van sin tarjeta (texto + `TitleSection`, más aire, tono
   editorial); diferenciadores, precios y proceso mantienen tarjeta. Rompe
   la monotonía de "todo son cajas grises iguales" sin inventar un sistema
   visual nuevo.
2. **Tier de precio recomendado (399 €) destacado** con el amarillo ya
   existente en el sitio (mismo tono que los números del proceso) como
   borde/badge "Recomendado" — sin introducir color nuevo.
3. **Case studies**: reutilizar `Projects.astro` filtrado a Arkady/Adf
   Sevilla, no crear componente nuevo.
4. **FAQ**: mantener `FAQ.astro` tal cual (acordeón nativo), solo verificar
   que 10 ítems no rompan el espaciado.
5. **Hero**: añadir CTA secundario ancla ("Ver precios" → scroll a
   precios) junto al botón de WhatsApp ya existente, vía prop opcional en
   `ServiceHero.astro` (retrocompatible con las otras 3 páginas).
6. **Responsive**: tiers de precio en grid `sm:grid-cols-2` (mismo patrón
   que ya usa `BenefitsGrid`), 1 columna en móvil — sin breakpoints nuevos.

## Hallazgos de la exploración del código (ya hecha, sin tocar nada)
- `src/layouts/ServiceLayout.astro` es **compartido por las 4 páginas de
  servicio** (diseño web, software a medida, automatizaciones, IA). Los H2
  de sección están hardcodeados como texto literal dentro del layout, NO
  vienen de `services.ts` — cambiarlos para esta página requiere hacerlos
  configurables sin romper las otras 3.
- `src/components/services/BenefitsGrid.astro` ya renderiza cada
  `benefit.title` como `<h3>` — los 3 H3 de la sección de diferenciación
  mapean casi directo a los 4 `benefits` que ya existen en `disenoWeb`
  (`src/data/services.ts`), es principalmente reescritura de copy, no
  arquitectura nueva.
- `ServiceLayout.astro` ya tiene un `<slot />` libre entre precio y FAQ
  (línea 81) pensado para contenido extra por página — ahí pueden entrar
  "Webs reales de Sevilla" y "Por qué alguien de Sevilla" sin tocar el
  layout compartido.
- No existe ningún slot ANTES de beneficios para la sección de dolor
  (¿tu web no te trae clientes?) — hay que añadir uno nuevo.
- `TitleSection.astro` ya renderiza `<h2>` correctamente vía slot — sirve
  tal cual, solo cambia el texto que se le pasa.

## Restricciones
- `ServiceLayout.astro` es compartido: cualquier cambio a su estructura debe
  ser retrocompatible (props/slots opcionales con el comportamiento actual
  como default) para no tener que retocar software-medida, automatizaciones
  e inteligencia-artificial en esta misma feature.
- No se añade ninguna promesa o garantía que Nuria no pueda sostener
  (coherente con el historial reciente del repo de corregir claims no
  soportados) — la FAQ de garantía es condicional, no obligatoria.
- El precio mostrado en la página debe coincidir siempre con
  `src/data/services.ts` (fuente única de verdad) — no se hardcodea en
  ningún otro sitio.

## TDD
No aplica en sentido estricto: es contenido + ajustes de componentes de
presentación, no lógica de negocio. Verificación funcional: `astro check &&
astro build` (ya es el script `build` del repo) más revisión visual manual
de la jerarquía de encabezados y de que las otras 3 páginas de servicio no
cambiaron.

## Checklist de tareas

- [x] **T1 — Modelo de datos configurable**: añadido `sectionTitles?` a
  `ServicePageData` (benefits/process/pricing/faq), usado en
  `ServiceLayout.astro` con `??` sobre el texto genérico actual.
  Ruta: delegada (subagente `a61a9a07fc39d61e3`).
  Check: `pnpm astro check` — 0 errores. Las otras 3 páginas no definen
  `sectionTitles`, caen al default idéntico a hoy.

- [x] **T2 — Slot `before-benefits`**: añadido en `ServiceLayout.astro`,
  primer elemento dentro de `<div class="space-y-24 mt-8">`, antes de la
  sección de beneficios.
  Ruta: junto con T1 (mismo subagente, mismo archivo).
  Check: slot vacío por defecto, no renderiza nada si la página no lo usa.

- [x] **T3 — Volcar el copy ya redactado**: H1 opción A (default del plan,
  usuario no pidió otra), subheadline, `sectionTitles` con los 4 H2
  acordados, 3 `benefits` reescritos (Core Web Vitals / SEO local+Maps /
  dominio propio), `process` refinado, meta title/description nuevos.
  Ruta: inline. Check: `pnpm build` limpio, H1 verificado en
  `dist/diseno-web-sevilla/index.html`.

- [x] **T4 — Sección de dolor**: añadida en `diseno-web-sevilla.astro` vía
  `<Fragment slot="before-benefits">`, sin tarjeta (T13).
  Ruta: inline. Check: build pasa, texto presente en el HTML generado.

- [x] **T5 — Case studies**: sección "Webs reales de negocios de Sevilla"
  con `<Projects only={["arkady", "adfsevilla"]} />` (ver T12).
  Ruta: inline. Check: HTML generado muestra Arkady y Adf Sevilla, 0
  apariciones del proyecto de portfolio personal (filtro correcto).

- [x] **T6 — "Por qué elegir a alguien de Sevilla"**: añadida sin tarjeta,
  lista de 3 puntos.
  Ruta: inline. Check: build pasa.

- [x] **T7 — Desglose de precio**: resuelto con tiers reales (ver T10),
  no con prosa — `pricing.tiers` con landing 149 €/web completa 399 €
  (recomendada), más `pricing.note` con la ayuda de decisión landing-vs-
  completa renderizada encima del grid de tiers (`PricingCard.astro`
  ampliado para mostrar `note` también en modo tiers).
  Ruta: inline. Check: `dist/diseno-web-sevilla/index.html` contiene el
  badge "Recomendado" una vez; precios coinciden con `services.ts`.

- [x] **T8 — 10 FAQs GEO-optimizadas**: reemplazado por completo
  `disenoWeb.faqs` (10 preguntas, ninguna de las 5 antiguas se conserva).
  Ruta: inline. Check: HTML generado tiene 10 `<summary>` (acordeón FAQ);
  `faqSchema` sigue leyendo de `page.faqs` sin cambios de código.

- [x] **T10 — Tiers de precio (2 columnas)**: `PricingCard.astro` extendido
  con prop opcional `tiers?: Tier[]`; si se pasa, renderiza grid
  `sm:grid-cols-2` con el tier `recommended` destacado (borde + badge
  amarillo); si no se pasa, renderiza exactamente el markup anterior de 1
  tier. `pricing.tiers?` añadido a `ServicePageData`; `ServiceLayout.astro`
  pasa `tiers={page.pricing.tiers}` (undefined en las otras 3 páginas).
  También se añadió `id="precios"` al `SectionContainer` de precio, para
  el CTA ancla de T11.
  Ruta: inline (hecho directamente, no requirió delegación real).
  Check: `pnpm astro check` — 0 errores. Verificación visual en el pase de
  Playwright final.

- [x] **T11 — CTA secundario en el hero**: `ServiceHero.astro` acepta
  `secondaryCta?: { label, href }`; si se pasa, renderiza un link de texto
  subrayado junto al botón de WhatsApp. Sin definirlo, las otras 3 páginas
  no muestran nada nuevo.
  Ruta: inline.
  Check: `pnpm astro check` — 0 errores.

- [x] **T12 — Filtro de case studies**: `Projects.astro` extendido con
  prop opcional `only?: string[]` (filtra por `key: "arkady"|"adfsevilla"|
  "portfolio"`, añadido a cada proyecto). Sin la prop, sigue mostrando los
  3 (portfolio, home) — retrocompatible.
  Ruta: inline (no hizo falta delegar). Check: `pnpm astro check` — 0
  errores; verificado en HTML generado (ver T5).

- [x] **T13 — Secciones "sin tarjeta"**: dolor, case studies y "por qué
  Sevilla" usan `SectionContainer` + `TitleSection` sin ningún wrapper con
  `bg-gray-100/50`/`border` — quedan como texto sobre el fondo general,
  distinto de diferenciadores/precios/proceso que sí mantienen tarjeta.
  Ruta: inline. Check: build pasa, revisión de clases aplicadas.

- [ ] **T14 — Verificación final end-to-end**: `pnpm build` limpio,
  revisión visual completa en `pnpm dev`/`preview` de la jerarquía
  H1→H2→H3, en móvil y desktop, modo claro y oscuro, y confirmación de que
  las otras 3 páginas de servicio no sufrieron regresión visual por los
  cambios compartidos de T1/T2/T10/T11.
  Check: comandos y resultado documentados en este archivo al ejecutar.

## Entrega
Rama: `develop` (no es la rama por defecto). Estrategia: PR único
(`single-pr`) salvo que el alcance crezca al ejecutar T7/T8 más allá de lo
previsto, en cuyo caso se reevalúa.

## Próximo paso
Esperar confirmación del usuario para empezar por T1. No se ha escrito
ni modificado ningún archivo de código todavía.
