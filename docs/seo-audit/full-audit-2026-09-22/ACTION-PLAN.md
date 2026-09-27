# Plan de acción priorizado — nuriaromero.dev (2026-09-22)

Basado en `FULL-AUDIT-REPORT.md` y las 12 tareas nuevas en `tasks/` (SEO-15 a SEO-26). No incluye GBP/prueba social (ya cubierto por SEO-10, pendiente de decisión humana) ni verificación externa de backlinks (ya cubierto por SEO-13, pendiente de fuente autorizada).

---

## Critical

Ninguno. No hay hallazgos que bloqueen indexación, rastreo o disponibilidad del sitio.

---

## High

| Tarea | Hallazgo | Impacto | Esfuerzo |
|---|---|---|---|
| SEO-16 | Panel de consentimiento sin `aria-modal`, focus trap, ni cierre con `Escape` (3 fuentes convergentes: PSI real, código, navegador) | Accesibilidad, cumplimiento, navegación agéntica/IA | Medio (2-4h) |
| SEO-17 | Botón flotante de WhatsApp solapa el CTA del hero a 360px | Conversión (CTA principal oculto en el ancho de Android más común) | Bajo (1-2h) |
| SEO-18 | Cierre de FAQ plantillado en las 4 páginas de nicho — mismo hallazgo desde el 21-09, sin resolver | Percepción de calidad, E-E-A-T, higiene de seguimiento | Bajo (1-2h) |
| SEO-24 | `/seo-local-sevilla/` sin "agencia" en título/H1 pese a 9/9 SERP usándola (keyword principal, 5.000/mes) | Relevancia de framing para la keyword de mayor volumen del negocio | Bajo (1-2h) |

---

## Medium

| Tarea | Hallazgo | Impacto | Esfuerzo |
|---|---|---|---|
| SEO-15 | Header/Footer sin barra final en 7 enlaces compartidos | Presupuesto de rastreo, consistencia técnica | Trivial (<1h) |
| SEO-19 | FAQ de precio casi duplicada (comercios/tienda online, diseño-web/blog), fuera del alcance de `check-seo-07.mjs` | Riesgo de canibalización, schema `FAQPage` duplicado | Medio (3-5h) |
| SEO-20 | Respuestas de FAQ largas (100-130+ palabras) sin subdivisión | Legibilidad móvil, citabilidad IA | Medio (4-6h) |
| SEO-21 | Sin puentes de navegación entre páginas comerciales adyacentes | Experiencia de búsqueda, tasa de rebote del avatar no-digital-nativo | Medio (2-3h) |
| SEO-22 | Enlace relativo no citable en 4 FAQ de nicho + `llms.txt` solo cubre 1/4 posts | Citabilidad IA (GEO) | Bajo (1h) |
| SEO-23 | H2 sin formato pregunta, falta "respuesta corta" en 3/4 posts, sin contenido multi-modal | Citabilidad IA (GEO), profundidad de contenido | Medio-Alto (4-8h) |

---

## Low

| Tarea | Hallazgo | Impacto | Esfuerzo |
|---|---|---|---|
| SEO-25 | `Organization.logo` ausente, patrón `@graph` no adoptado, IndexNow, HSTS `preload`, CSP `unsafe-inline`, anomalía TTFB home | Mejoras incrementales, sin bloqueo funcional | Bajo (2-3h) |
| SEO-26 | Micro-variación de wording de área de servicio (footer vs. `/contacto`) | Consistencia previa a configurar la futura GBP | Trivial (<1h) |

---

## Ya cubierto por tareas anteriores (sin tarea nueva)

- **GBP y prueba social** — decisión humana pendiente, propiedad de SEO-10. Esta auditoría no fabrica ni añade contenido nuevo aquí.
- **Verificación externa de backlinks / outreach** — propiedad de SEO-13, pendiente de fuente de datos autorizada (Moz/Bing).
- **Credenciales Google API (GSC/CrUX/GA4/PSI)** — propiedad de SEO-14, ya documentada como pendiente de evidencia humana/producción.

---

## Orden recomendado de ejecución

1. **Quick wins de coste mínimo, impacto alto** (mismo día): SEO-15, SEO-18, SEO-22, SEO-26.
2. **High priority restante**: SEO-17 (CSS de posicionamiento), SEO-24 (copy), SEO-16 (requiere prueba de accesibilidad tras el cambio).
3. **Medium**: SEO-19, SEO-21, SEO-20, SEO-23, en ese orden (de menor a mayor esfuerzo editorial).
4. **Low**: SEO-25, cuando haya ventana de mantenimiento técnico.

Cada tarea sigue el mismo patrón del backlog anterior: commit por tarea, checker/verificación enfocada donde sea posible, sin inventar métricas ni evidencia no verificada.
