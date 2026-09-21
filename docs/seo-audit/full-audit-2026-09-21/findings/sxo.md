# SXO — Search Experience Optimization (nuriaromero.dev)

Fecha: 2026-09-21 · Método: render_page.py (fetch real, mode auto) + parse_html.py + WebSearch (SERP-backwards) sobre 3 keywords + inspección de HTML/schema de 4 páginas objetivo.

## SXO Gap Score: 64/100 (confianza MEDIA)

Nota: este score es de **Search Experience**, independiente del SEO Health Score técnico. Confianza media porque el SERP se evaluó por títulos/snippets de WebSearch (no accesos completos a las 10 páginas top ni datos de PAA/Ads reales de un SERP tool dedicado — ver Limitaciones).

Desglose orientativo:
- Page Type match: 12/15 (Service Page vs Service Page — tipo correcto, pero framing de keyword deficiente en un caso)
- Content Depth: 13/15 (FAQs extensas, 2.644 y 1.952 palabras en las páginas de servicio)
- UX / friction: 9/15 (falta prueba social real, CTA único poco jerarquizado)
- Schema: 14/15 (ProfessionalService + Service + FAQPage + Breadcrumb en todas)
- Media: 5/15 (cero fotos reales de proyectos SEO, cero imágenes en nicho restaurantes)
- Authority/Trust: 6/15 (sin testimonios con nombre/cita, sin reseñas de Google enlazadas, casos "no son casos de éxito de SEO" auto-declarado)
- Freshness: 5/10 (sin fecha de publicación/actualización visible en las páginas de servicio)

---

## HALLAZGO PRINCIPAL (liderando el informe): riesgo de mismatch semántico en /seo-local-sevilla/ frente a "agencia SEO Sevilla"

**Severidad: MEDIA-ALTA (no es un mismatch de tipo de página, es un mismatch de framing de keyword literal)**

### Evidencia SERP para "agencia SEO Sevilla" (5.000 búsquedas/mes)

De los 9 resultados orgánicos que devolvió la búsqueda, **9 de 9 usan la palabra "Agencia" en el título o el dominio**:
- "Las 100+ mejores agencias SEO en Sevilla" (sortlist.es — directorio/listicle)
- "Agencia SEO Sevilla" (rock.et)
- "Agencia SEO en Sevilla | Más tráfico, más clientes" (mukane.com)
- "Agencia SEO Sevilla" (curisaestudio.com)
- "12 Mejores Agencias SEO Sevilla 2026: ¿Cuál elegir?" (pacoruben.com — listicle/comparación)
- "Posiciona Tu Web Sevilla | Agencia SEO Local" (posicionatuwebsevilla.com)
- "Agencia SEO Wolf: Posicionamiento Web SEO En Sevilla" (seowolf.es)
- "Agencia SEO Sevilla + 200 proyectos éxito" (bringconnections.com)
- "Agencia SEO Sevilla — Amarillo Limón" (amarillolimon.net)

**Tipo de página dominante en el SERP:** ~75% Service Page (agencia con proceso, precios, contacto) + ~25% Comparison/Directorio (listicles "mejores agencias", sortlist). El tipo de página de `/seo-local-sevilla/` (Service Page, con proceso, precios, FAQ, CTA de contacto — según taxonomía) **sí coincide estructuralmente** con el tipo dominante. Esto significa que **no hay mismatch de tipo de página** (no es un blog post ni una landing genérica), pero sí hay un mismatch de **coincidencia literal de palabra clave** en title/H1, que es una señal de relevancia on-page fuerte que Google usa para "agencia SEO Sevilla" como query comercial de alto volumen.

### El mismo patrón se repite en "SEO local Sevilla" (500/mes)
7 de 9 resultados usan "Agencia" en título (Sortlist, Coco Solution, Rocket Digital, agenciaseolocal.es ×2, PluxDigital, seolocalsevilla.com). El clúster secundario que también ataca `/seo-local-sevilla/` está expuesto al mismo patrón, aunque con menos intensidad.

### Contraste con "diseño web Sevilla" (500/mes)
Aquí el SERP es más heterogéneo: agencias ("Starenlared — Agencia Diseño Web"), pero también estudios y freelance-style sin la palabra "agencia" (Estudio TIPO, Mora Estudio Creativo, Creadores Web Sevilla, Sergio García). **`/diseno-web-sevilla/` no sufre el mismo riesgo** — su H1 ("Diseño web en Sevilla para negocios que quieren clientes, no solo una web bonita") encaja con un SERP donde el framing "estudio/freelance" también rankea.

### Por qué esto importa (y por qué NO es un fallo obvio)
- El copy evita literalmente "agencia" porque el negocio es freelance — decisión honesta y defendible (evita sobre-prometer una estructura que no existe, y de hecho el propio FAQ "¿me quedo atado a esa persona o agencia?" convierte la ausencia de estructura de agencia en un argumento de venta).
- Pero un usuario que busca "agencia SEO Sevilla" con intención transaccional escanea el SERP esperando ver la palabra "agencia" repetida; un resultado sin ella puede leerse (en el snippet) como "esto no es lo que busco" y bajar el CTR, incluso si el contenido interno resuelve mejor su necesidad real.
- Riesgo real medible: el H1 actual usa "SEO local en Sevilla", que corresponde a la keyword secundaria (500/mes), no a la principal (5.000/mes). El `<title>` tampoco contiene "agencia". Para la keyword de mayor volumen, la página está optimizada para un término distinto al que trae el 90% del volumen del clúster.

**Recomendación accionable:**
1. Añadir una variante semántica de "agencia" en un H2 o en el primer párrafo bajo el H1 sin cambiar el H1 principal ni la promesa de marca: por ejemplo un H2 tipo "SEO local en Sevilla sin agencia: trato directo con quien hace el trabajo" — esto captura la coincidencia semántica ("agencia SEO Sevilla" + negación) y refuerza el diferenciador ya presente en el FAQ.
2. Meta title: probar variante A/B "SEO local en Sevilla (sin agencia) | Auditoría SEO/GEO desde 299 €" para capturar el snippet-scan de quien busca "agencia" y ofrecer el contraste inmediato.
3. Vigilar posición/CTR real en Search Console para "agencia SEO Sevilla" tras 4-6 semanas; si el CTR es sistemáticamente bajo pese a buena posición, esto confirma el mismatch de framing y justifica el cambio de H1.

---

## Clasificación de tipo de página (taxonomía)

| Página | Tipo target | Tipo dominante SERP (keyword) | Match |
|---|---|---|---|
| /seo-local-sevilla/ | Service Page | Service Page (75%) + Comparison/Directorio (25%) — "agencia SEO Sevilla" | ALINEADO en tipo, MEDIO en framing de keyword |
| /diseno-web-sevilla/ | Service Page | Service Page/estudio — "diseño web Sevilla" | ALINEADO |
| / (home) | Hybrid (hub multi-servicio, sin keyword transaccional propia) | N/A — no compite por keyword comercial directa | No aplica mismatch; ver rol de hub abajo |
| /web-para-restaurantes-sevilla/ | Service Page (nicho) | Se asume Service Page/directorio para "página web restaurante Sevilla" (no evaluado con WebSearch dedicado — limitación) | Probable alineado, sin verificar |

---

## Home como hub de marca: ¿funciona?

**Hallazgo: funciona razonablemente bien para tráfico de marca/WhatsApp/GBP, con una fricción menor de navegación cruzada con /seo-local-sevilla/.**

- El `<title>` es "Nuria Romero | Visibilidad en Google y en búsquedas con IA para tu negocio" y el nombre "Nuria Romero" aparece ya en el `<title>` y en el primer bloque de contenido — alguien que busca "Nuria Romero desarrolladora" o llega por marca encuentra identidad clara de inmediato.
- H1 de home: "Más oportunidades para tu negocio en Google y en las búsquedas con inteligencia artificial" — no incluye el nombre, pero el logo/nav sí lo hace (asumido por convención Astro, no verificado visualmente — ver limitaciones).
- La home presenta 6 tarjetas de servicio con precio de salida visible ("Desde 299 €", "Desde 149 €", etc.) en el primer o segundo scroll — esto responde bien a la necesidad de un usuario de WhatsApp/Instagram que llega sin contexto SEO y quiere saber "qué ofrece y cuánto cuesta" rápido.
- **Fricción de navegación cruzada:** tanto la home (tarjeta "SEO local en Sevilla — Desde 299 €") como `/seo-local-sevilla/` responden a la intención "quiero mejorar mi presencia en Google". No es duplicidad de keyword (la home no tiene keyword transaccional propia, según la decisión ya documentada), pero si un usuario llega a la home vía Google Business Profile o WhatsApp y quiere profundizar en SEO local, tiene que dar un clic extra ("Ver servicio →") para llegar al contenido completo (proceso, FAQ de 12 preguntas, casos). Esto es correcto y esperado en un hub, no es un error, pero merece un enlace contextual reforzado: la tarjeta de home solo tiene "Ver servicio →" y "Desde 299 €" sin mencionar el diferencial GEO/IA que sí está en el H1 de /seo-local-sevilla/, lo que reduce la señal de "esto es justo lo que necesito" en el primer clic.

**Recomendación:** en la tarjeta de SEO local de la home, añadir una línea corta bajo el precio ("Google Maps + FAQs para IA, sin cuotas a ciegas") para que el usuario de WhatsApp/redes reconozca el mismo lenguaje que verá al entrar en la página de servicio, reduciendo fricción de continuidad.

---

## User stories (avatar: dueño/a de negocio local en Sevilla, 35-55, poco nativo digital)

Framework aplicado: cada historia cita la señal SERP/página que la origina.

1. **Como dueño de negocio escéptico de agencias**, quiero saber cuánto me va a costar sin sorpresas, porque me han timado antes con cuotas ocultas, pero me bloquea la **desconfianza genérica hacia "agencias SEO"**.
   *(Fuente: FAQ propia "¿Me garantizas que voy a salir en la primera página de Google?" + patrón de listicles "mejores agencias" en el SERP, que indica que el comprador compara activamente por miedo a elegir mal)*
   → **¿Resuelto en los primeros 2 scrolls?** SÍ en `/seo-local-sevilla/` y `/diseno-web-sevilla/`: precio cerrado visible en el segundo H2 ("Cuánto cuesta..."), a menos de 2 scrolls del H1.

2. **Como dueño de negocio que ya está en Google Maps/Instagram**, quiero entender si de verdad necesito algo más, porque no veo el problema de mi situación actual, pero me bloquea la **duda de fondo "¿esto es necesario o me están vendiendo humo?"**.
   *(Fuente: pregunta objetada explícitamente en el FAQ de la página de restaurantes: "¿De verdad necesito web si ya estoy en Google Maps y TripAdvisor?" — señal de que el propio negocio ya identificó esta objeción como recurrente)*
   → **¿Resuelto?** SÍ en la página de nicho de restaurantes (FAQ ampliada a 8 preguntas cubre esto explícitamente). PARCIALMENTE en `/seo-local-sevilla/`: el H2 "¿Sales en Google pero no te llaman, o todavía no apareces cuando te buscan?" plantea la duda pero la resuelve en párrafo de texto corrido, no con un contraste visual (antes/después) que un usuario poco digital procese en segundos.

3. **Como dueño comparando varios proveedores**, quiero ver pruebas de que esto funciona en negocios como el mío en Sevilla, porque no quiero ser el primer experimento, pero me bloquea la **falta de prueba social verificable** (sin cifras de ranking, sin reseñas con nombre y cita textual).
   *(Fuente: la propia página lo admite: "No son casos de éxito de posicionamiento con cifras de ranking o tráfico, porque este servicio es nuevo" — señal auto-declarada de gap de autoridad; y el patrón SERP de "200 proyectos éxito" en bringconnections.com, que sí ofrece prueba social cuantitativa)*
   → **¿Resuelto?** NO. Es la brecha más grave de las tres páginas de servicio analizadas — journey stage "decisión" sin resolver.

4. **Como dueño de restaurante que valora lo visual** (fotos que "abren el apetito" según la propia promesa de la página), quiero ver ejemplos de cómo queda una carta digital o una web de restaurante, porque decido con los ojos antes que con el texto, pero me bloquea que **la página de nicho no tiene ni una sola imagen** (`images: []` en el parseo).
   *(Fuente: contradicción interna — meta description promete "fotos que abren el apetito" pero la página en sí no muestra ninguna foto ni ejemplo visual)*
   → **¿Resuelto?** NO. Journey stage "consideración" con fricción de credibilidad directa.

Cobertura de etapas: awareness (historia 2), consideration (historias 1, 3, 4), decision (historia 3 se extiende a decisión). Cumple mínimo de 2 etapas.

---

## Persona Scoring

### Persona A — Dueño/a de negocio local escéptico (avatar objetivo, decisión por miedo a que le timen)
| Dimensión | Score | Evidencia |
|---|---|---|
| Relevance | 21/25 | Copy en lenguaje natural, sin jerga SEO sin explicar, FAQ responde miedos reales (cuotas ocultas, compromiso mínimo, garantías) |
| Clarity | 18/25 | Precio visible pronto, pero el H1 largo (13-14 palabras) y sin negrita/resaltado obliga a leer completo para captar el mensaje clave |
| Trust | 10/25 | Sin testimonios con nombre+foto+cita, sin enlace a reseñas de Google, casos de portfolio son solo "Preview" a webs externas sin contexto de resultado |
| Action | 17/25 | CTA único repetido ("Pedir presupuesto exacto" / WhatsApp) — correcto y de baja fricción, pero no hay CTA intermedio de menor compromiso (ej. "ver ejemplo de auditoría gratuita") para quien aún no está listo |
| **Total** | **66/100 — Bueno, con brecha de Trust** |

### Persona B — Comparador activo (mirando varias agencias/freelancers antes de decidir)
| Dimensión | Score | Evidencia |
|---|---|---|
| Relevance | 19/25 | Cubre criterios de comparación típicos (precio, proceso, permanencia de dominio/hosting a su nombre — diferenciador fuerte frente a agencias que retienen el dominio) |
| Clarity | 16/25 | La info está pero repartida en FAQ largo (12 preguntas); un comparador quiere tabla o resumen rápido, no scroll de FAQ acordeón |
| Trust | 8/25 | Mismo problema que Persona A, agravado: un comparador busca activamente reseñas externas (Google, Trustpilot) que aquí no se enlazan en ningún punto |
| Action | 15/25 | No hay comparativa explícita ("por qué yo vs. una agencia grande") más allá del FAQ de dominio/hosting; falta un cuadro resumen tipo "qué incluye / qué no incluye" |
| **Total** | **58/100 — Necesita mejora** |

### Persona más débil: Comparador activo (58/100)
**Problema principal:** cero prueba social verificable de terceros (reseñas de Google, testimonios con nombre) en las tres páginas de servicio analizadas.
**Fix recomendado:** insertar 2-3 reseñas reales de Google Business Profile (con nombre, negocio y fecha) en la sección "Negocios de Sevilla en los que ya he trabajado" de `/seo-local-sevilla/` y en la sección de proceso de `/diseno-web-sevilla/`; si aún no hay reseñas de SEO (servicio nuevo, ya declarado en el copy), usar reseñas del servicio de diseño web, que sí tiene proyectos en producción.

### Problemas sistémicos (ambas personas)
- **Trust es la dimensión más débil en las 3 páginas** (10/25 y 8/25): ausencia de prueba social de terceros verificable.
- **Media**: la página de restaurantes promete impacto visual y no lo demuestra (0 imágenes).

### Acciones prioritarias
1. Añadir prueba social verificable (reseñas GBP con nombre) — ataca el problema sistémico de Trust, beneficia a ambas personas.
2. Añadir 2-3 imágenes reales (capturas de carta digital / web entregada) en `/web-para-restaurantes-sevilla/` para cerrar la contradicción "prometo fotos, no muestro ninguna".
3. Reforzar framing semántico de "agencia SEO Sevilla" en `/seo-local-sevilla/` según recomendación de la sección de mismatch (beneficia sobre todo al Comparador, que llega vía búsqueda transaccional de alto volumen).

---

## Fricción de conversión — resumen

- **CTA:** consistente y de baja fricción (WhatsApp + formulario), correctamente repetido en cada sección. Sin CTA de menor compromiso (ej. checklist gratuita, auditoría exprés) para el usuario que aún no está listo para pedir presupuesto — oportunidad de captar leads más fríos.
- **Claridad de precio:** fuerte punto a favor — precio cerrado visible sin necesidad de contactar, algo que ningún competidor del SERP analizado muestra de forma tan explícita (ninguno de los "agencia SEO Sevilla" top-9 mostró precio en el título/snippet).
- **Objeciones cubiertas:** cuotas ocultas (sí, explícito y repetido), compromiso mínimo (sí), garantías de ranking (sí, con honestidad "no garantizo posición"), propiedad de dominio/hosting (sí, diferenciador fuerte). **RGPD/privacidad:** no verificado en detalle en el contenido de servicio — existe página "Política de privacidad" enlazada en footer, pero no hay mención de tratamiento de datos del formulario de contacto dentro de la propia página de servicio (solo en footer genérico).
- **Objeción no resuelta:** ausencia total de prueba social de terceros (ver Trust arriba) — es la fricción de conversión más severa detectada.

---

## Limitaciones

- El análisis SERP se basó en `WebSearch` (títulos, URLs y resumen editorial), no en un scraper de SERP dedicado: no se pudieron verificar PAA reales, presencia de Ads, "People Also Ask", featured snippets ni Local Pack para las 3 keywords. La sección de user-story-framework se aplicó de forma parcial (sin señales de PAA/Ads reales).
- No se analizaron con WebSearch dedicado las keywords específicas de la página de nicho (`/web-para-restaurantes-sevilla/`); su alineación de tipo de página se infiere por analogía con los patrones de Service Page observados en las otras dos keywords, no se verificó de forma independiente.
- No se accedió al contenido completo de los 10 resultados orgánicos de cada SERP (solo título/URL/snippet vía WebSearch), por lo que la clasificación de tipo de página de los competidores es aproximada, no una lectura directa de su HTML/schema.
- No se verificó visualmente (captura de pantalla) el above-the-fold real en viewport móvil; el análisis de "primeros 2 scrolls" se estimó por orden de H2/H1 en el DOM, no por medición de altura de viewport real.
- No se comprobó Search Console (posiciones, CTR reales, impresiones) — las recomendaciones de framing semántico ("agencia SEO Sevilla") deberían validarse con datos reales de CTR tras su implementación.
- Pendiente explícito de la lista original: no se hizo el mismo nivel de profundidad de SERP-backwards para la keyword específica de `/web-para-restaurantes-sevilla/` (ej. "página web para restaurantes Sevilla" o "diseño web restaurantes Sevilla") — recomendado como siguiente paso si se prioriza esa página.

---

Recomendación cruzada: los gaps de E-E-A-T/prueba social detectados aquí (Trust 10/25 y 8/25) se beneficiarían de un análisis más profundo con `/seo content`. Los gaps de schema son mínimos (ya hay ProfessionalService + Service + FAQPage + Breadcrumb), no se requiere `/seo schema` con urgencia. El componente de intención local (Google Maps, GBP) ya está bien cubierto en el copy pero no se verificó la ficha de GBP real — recomendado `/seo local` para auditar la ficha de Google Business Profile en sí.

¿Generar informe en PDF? Usa `/seo google report`.
