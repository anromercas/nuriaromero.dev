# Feature: oferta CAPILAR LOCAL y captación SEO para clínicas capilares

## Objetivo
Convertir el servicio de SEO local en una oferta de entrada clara para clínicas de injerto capilar y crear una página específica que capte búsquedas B2B en Sevilla, sin prometer posiciones, pacientes ni resultados médicos.

## Evidencia revisada
- Conversación compartida: análisis de oferta irresistible para clínicas capilares.
- Página actual: `src/pages/seo-local-sevilla.astro`.
- Datos del servicio: `src/data/services.ts` (`seoLocal`).
- Contexto de negocio: `.agents/product-marketing-context.md`.
- Investigación de competidores capilares: `research/competidores-sevilla/informe.md` y `.seo-cache/competidores-sevilla.json`.

## Decisiones y límites
- Nombre de trabajo: **CAPILAR LOCAL**; marco de comunicación: **Visibilidad · Confianza · Contacto**.
- Proyecto inicial: **299 € + IVA**, precio cerrado, pago único y sin obligación de continuar.
- Entrega: **10 días hábiles** desde accesos y materiales necesarios.
- Recurrente: Básico desde **199 €/mes + IVA** y Competitivo desde **349 €/mes + IVA**; sugerir 3 meses, no presentarlo como permanencia obligatoria si no existe contrato aprobado.
- No incluir gestión de reseñas, SEO completo de toda la web, rediseño integral, varias páginas optimizadas ni garantía de rankings/leads.
- El contenido médico, precios de tratamientos y FAQs deben partir de información validada por la clínica; no inventar afirmaciones clínicas.
- La medición no debe enviar datos de salud ni información identificable de pacientes a analítica.
- La optimización de Google Business Profile debe respetar nombre real, categoría adecuada, dirección/área y propiedad del cliente según las políticas de Google.

## Alcance del proyecto inicial CAPILAR LOCAL
1. Diagnóstico breve de visibilidad: web, indexación básica, SEO local, GBP, 3 competidores de Sevilla y 5–10 prioridades.
2. Revisión/optimización de GBP: categoría, servicios, descripción, datos de contacto, enlace, fotos existentes y recomendaciones de reseñas auténticas; no gestión mensual.
3. Optimización de **una** página estratégica: title, meta description, H1/H2, enfoque local, CTA, contacto y enlazado interno básico.
4. Datos estructurados básicos solo donde sea técnicamente viable y coherente con el contenido real.
5. Cinco FAQs para la página prioritaria, redactadas con información aprobada por la clínica.
6. Comprobación básica de Search Console/GA4 y de las acciones de contacto medibles, sin analítica sanitaria.
7. Informe corto con prioridades y plan de 90 días.
8. Revisión rápida a los 30 días como bonus acotado, no como mantenimiento.

## Plan de actuación por tareas

### T1 — Ajustar la propuesta y el alcance comercial
- [x] Reescribir `src/data/services.ts` para que el proyecto inicial comunique CAPILAR LOCAL y sus límites reales.
- [x] Mostrar siempre `+ IVA` en 299 €, 199 €/mes y 349 €/mes.
- [x] Añadir plazo de 10 días hábiles, pago único/sin obligación posterior y nota de alcance.
- [x] Separar visualmente puesta a punto inicial, crecimiento y crecimiento competitivo.
- [x] Cambiar CTAs genéricos por una acción clara: `Solicitar proyecto inicial` en el bloque inicial y `Hablar sobre crecimiento` en recurrente.
- [x] Mantener la recomendación de 3 meses como sugerencia razonada, no como condición contractual inventada.

### T2 — Reestructurar `/seo-local-sevilla/` como página generalista
- [x] Mantenerla como hub para SEO local en Sevilla, no convertirla en una landing exclusiva de clínicas.
- [x] Ajustar el bloque de precio para reflejar el nuevo alcance de 299 € sin afirmar que siempre se implementa schema en cualquier plataforma.
- [x] Añadir una sección breve “¿Este servicio encaja con una clínica capilar?” con enlace a la landing específica.
- [x] Revisar FAQs para evitar promesas de citación en IA como resultado garantizado; usar “facilitar la comprensión y citabilidad”.
- [x] Corregir cualquier texto que implique “reseñas gestionadas” dentro del proyecto inicial.

### T3 — Crear landing B2B específica
- [x] Crear `src/pages/seo-para-clinicas-capilares-sevilla.astro` siguiendo los patrones de `ServiceLayout` y los componentes existentes.
- [x] Target principal: clínicas de injerto capilar que buscan más solicitudes de valoración desde búsquedas locales; no pacientes finales.
- [x] Propuesta: “CAPILAR LOCAL: puesta a punto de Google y web para clínicas de injerto capilar en Sevilla”.
- [x] Estructura mínima: problema de captación → método Visibilidad/Confianza/Contacto → alcance de 299 € → qué no incluye → proceso de 10 días → mantenimiento → prueba social verificable → FAQs → CTA.
- [x] Incluir formulario, teléfono y WhatsApp como acciones medibles; no pedir datos clínicos del paciente en el primer contacto.
- [x] Añadir enlaces internos desde `/seo-local-sevilla/`, `/web-para-clinicas-sevilla/`, contacto y contenidos relevantes.
- [x] Añadir title, meta description, canonical, breadcrumbs, FAQ schema solo para FAQs visibles y datos de negocio sin inventar clínica cliente.

### T4 — Crear captación orgánica de apoyo
- [ ] Definir mapa de keywords B2B antes de redactar: `SEO para clínicas capilares`, `SEO para clínicas de injerto capilar`, `marketing digital clínica capilar`, `posicionamiento clínica capilar Sevilla` y variantes de intención comercial.
- [ ] Crear 3–4 contenidos de apoyo, cada uno con una intención distinta: diagnóstico de visibilidad, captación desde Google Maps, web que convierte solicitudes y medición segura en clínicas.
- [ ] Enlazar cada contenido a la landing; enlazar la landing al proyecto inicial y al contacto.
- [ ] No crear contenidos que mezclen la captación de clínicas con keywords de pacientes como “precio de injerto capilar” salvo que exista una estrategia separada y aprobada.
- [ ] Preparar un recurso comercial reutilizable: ejemplo de diagnóstico CAPILAR LOCAL con datos ficticios claramente etiquetados como ejemplo.

### T5 — Medición y validación
- [ ] Definir eventos agregados: clic en WhatsApp, clic en teléfono, envío de formulario y clic en CTA del proyecto inicial.
- [ ] Verificar consentimiento y que no se envíen nombres, teléfonos, mensajes ni datos médicos a GA4/otros sistemas.
- [ ] Medir Search Console por landing, consultas B2B, impresiones, CTR y clics; registrar baseline antes de publicar.
- [ ] Validar build, `astro check`, enlaces internos, metadata, sitemap, JSON-LD y render móvil.
- [ ] Solicitar indexación tras publicar y revisar cobertura a los 14–30 días.

### T6 — Lanzamiento comercial y aprendizaje
- [ ] Preparar un CTA de diagnóstico inicial sin prometer auditoría gratuita ilimitada.
- [ ] Contactar clínicas solo con mensajes personalizados y evidencia pública; no usar scraping agresivo ni afirmar resultados no demostrados.
- [ ] Medir durante 90 días: leads cualificados, tasa de respuesta, llamadas/formularios, consultas B2B, CTR y horas reales de entrega del proyecto de 299 €.
- [ ] Revisar el precio y el alcance solo después de observar al menos dos entregas reales; si supera 4–6 horas de trabajo, reducir alcance o subir precio, no añadir tareas gratis.

## Orden recomendado
1. T1 y T2: corregir oferta y página actual.
2. T3: publicar landing específica.
3. T5: dejar medición y validación listas antes de promocionar.
4. T4: publicar el primer contenido de apoyo y después el resto.
5. T6: comenzar prospección y revisar datos a 30/60/90 días.

## Criterios de aceptación
- Los tres precios aparecen con `+ IVA` y alcance diferenciado.
- El proyecto inicial tiene límites verificables y no mezcla mantenimiento.
- Existe una landing B2B separada de la página generalista de SEO local.
- Ninguna página promete posición, número de pacientes, crecimiento de tráfico o resultado médico.
- Las FAQs y claims médicos proceden de la clínica y la medición evita datos sanitarios.
- `pnpm astro check` y `pnpm build` pasan; los enlaces y datos estructurados se validan sobre el HTML generado.

## Estado
T1–T3 implementadas en el work-unit commit indicado abajo. Se añadió el comprobador estático `scripts/check-capilar-local.mjs` y el script `pnpm check:capilar-local`.

## Evidencia de entrega
- Work-unit commit: `1a6c750` — `feat(seo): add capilar local clinic offer`

## Verificación ejecutada
- `pnpm check:capilar-local` — PASS: valida el alcance acotado, el puente del hub y la landing B2B sin claims no soportados.
- `pnpm astro check` — PASS: 0 errores; mantiene un hint preexistente en `src/components/seo/Schema.astro` sobre `is:inline`.
- `pnpm build` — PASS: 24 páginas generadas, incluida `/seo-para-clinicas-capilares-sevilla/`.
- Inspección del HTML generado — PASS: title, canonical, `BreadcrumbList`, `FAQPage` y enlaces internos de la nueva landing presentes.

T4–T6 quedan pendientes.
