# Plan de acción SEO — nuriaromero.dev

**Fecha:** 2026-09-21  
**Estado del plan:** backlog ODD-ready; todas las tareas están pendientes.

## Alcance y limitaciones

Este documento convierte la auditoría existente en unidades ejecutables posteriormente con ODD. El alcance cubre los hallazgos de `findings/`, la verificación adicional indicada en el encargo y las decisiones necesarias para priorizar trabajo técnico, contenido, local, autoridad, UX y medición. No modifica código ni afirma mejoras de ranking.

Limitaciones relevantes:

- Los datos de Core Web Vitals de campo, GSC, GA4 y CrUX no estaban disponibles; los riesgos de LCP/CWV son estáticos o quedan sin medir.
- El perfil de backlinks es Tier 0: no hay fuente fiable para autoridad, toxicidad, anchors o recuento completo de dominios referentes.
- La valoración visual se basa en capturas Playwright de 390×844 y 1440×900; no sustituye Lighthouse, axe ni pruebas con usuarios.
- GBP, testimonios, naming, horarios, imágenes reales y perfiles externos requieren decisión y evidencia humana.
- La verificación adicional actual es: `/servicios/diseno-web-sevilla` → 301 `/diseno-web-sevilla` → 301 `/diseno-web-sevilla/` → 200; robots y sitemap devuelven 200. La ruta `/components/` dejó de generarse en producción desde el commit `689a5a1`.

## Scorecards por área

| Área | Score | Fuente | Lectura operativa |
|---|---:|---|---|
| Technical SEO | 78/100 | [technical.md](findings/technical.md) | Base sólida; prioridad inmediata en redirects y URLs internas. |
| Sitemap / indexabilidad | 90/100 | [sitemap.md](findings/sitemap.md) | Sitemap y robots correctos; la exclusión de `/components/` está resuelta. |
| Content Quality | 68/100 | [content.md](findings/content.md) | Calidad de copy razonable, pero boilerplate, E-E-A-T y legibilidad limitan el siguiente paso. |
| GEO readiness | 78/100 | [geo.md](findings/geo.md) | Buena accesibilidad técnica; citabilidad, autoría y `llms.txt` mejorables. |
| Local SEO | 42/100 | [local.md](findings/local.md) | Principal brecha: ausencia no verificada de GBP propia, reseñas y señales de confianza. |
| Clúster semántico | 38/100 | [cluster.md](findings/cluster.md) | Riesgo estructural alto de solapes y FAQs repetidas; validar con datos cuando haya indexación. |
| SXO | 64/100 | [sxo.md](findings/sxo.md) | Fricción de confianza, media y framing de intención en una página. |
| Visual / UX | 72/100 | [visual.md](findings/visual.md) | Home mobile y banner de cookies son los puntos accionables; desktop y FAQ están bien resueltos. |
| Backlinks | No cuantificable | [backlinks.md](findings/backlinks.md) | Falta fuente de datos; plan de autoridad a largo plazo. |

## Backlog priorizado

Prioridades: **P0** = corregir primero por impacto técnico directo; **P1** = riesgo alto/medio con dependencia operativa; **P2** = mejora estratégica y de calidad; **P3** = trabajo de autoridad o investigación de menor urgencia.

| Prioridad | Task file | Resultado esperado | Dependencias clave |
|---|---|---|---|
| P0 | [01-redirects-servicios.md](tasks/01-redirects-servicios.md) | Un único 301 desde las cuatro rutas migradas a sus canónicas | Confirmar las cuatro reglas |
| P0 | [02-normalizar-urls-internas.md](tasks/02-normalizar-urls-internas.md) | Enlaces, breadcrumbs y schema con trailing slash | SEO-01; decisión de normalización en origen |
| P1 | [03-excluir-components.md](tasks/03-excluir-components.md) | ✅ Resuelta en `689a5a1`: `/components/` ya no se publica en producción | — |
| P1 | [04-validar-cwv-y-lcp.md](tasks/04-validar-cwv-y-lcp.md) | Línea base de CWV y priorización LCP basada en evidencia | Acceso a PSI/CrUX/GSC/GA4 |
| P1 | [05-diversificar-paginas-nicho.md](tasks/05-diversificar-paginas-nicho.md) | Contenido sectorial propio y no inventado | Casos, imágenes y claims autorizados |
| P1 | [06-arquitectura-enlazado-interno.md](tasks/06-arquitectura-enlazado-interno.md) | Mapa hub-and-spoke implementable | Decisiones de hubs e intenciones |
| P1 | [07-resolver-canibalizacion.md](tasks/07-resolver-canibalizacion.md) | Matriz de intención y solapes resueltos | SEO-05/06; datos GSC para validar |
| P1 | [10-gbp-prueba-social.md](tasks/10-gbp-prueba-social.md) | Decisión y plan de señales locales verificables | GBP, consentimiento, testimonios |
| P1 | [12-ux-mobile-y-prueba-visual.md](tasks/12-ux-mobile-y-prueba-visual.md) | CTA visible y consentimiento menos obstructivo en mobile | Decisión de copy/UX y legal |
| P1 | [14-medicion-seo.md](tasks/14-medicion-seo.md) | Línea base y protocolo de seguimiento | Accesos, consentimiento y KPIs |
| P2 | [08-mejorar-citabilidad-y-legibilidad.md](tasks/08-mejorar-citabilidad-y-legibilidad.md) | FAQs y GEO más escaneables y autocontenidos | SEO-07 |
| P2 | [09-autoría-y-llms.md](tasks/09-autoría-y-llms.md) | Autoría visible y `llms.txt` curado | Naming y perfiles oficiales |
| P2 | [11-schema-local-y-marca.md](tasks/11-schema-local-y-marca.md) | Schema local y entidad coherentes | Decisiones de SEO-10 |
| P3 | [13-autoridad-y-backlinks.md](tasks/13-autoridad-y-backlinks.md) | Plan de autoridad con medición y sin prácticas artificiales | Fuente de backlinks, tiempo y colaboraciones |

## Mapa de cobertura de hallazgos accionables

| Hallazgo accionable de `findings/` | Tarea | Evidencia principal |
|---|---|---|
| Doble redirect en cuatro servicios migrados | [SEO-01](tasks/01-redirects-servicios.md) | [technical.md](findings/technical.md) §2.2 |
| Enlaces internos sin trailing slash | [SEO-02](tasks/02-normalizar-urls-internas.md) | [technical.md](findings/technical.md) §3 |
| Breadcrumb visible sin trailing slash | [SEO-02](tasks/02-normalizar-urls-internas.md) | [technical.md](findings/technical.md) §3.1 |
| `BreadcrumbList` sin trailing slash | [SEO-02](tasks/02-normalizar-urls-internas.md) | [technical.md](findings/technical.md) §3.2 |
| `/components/` publicado con `noindex` (hallazgo histórico, resuelto en `689a5a1`) | [SEO-03](tasks/03-excluir-components.md) | [technical.md](findings/technical.md) §1 y resumen |
| Falta de datos de campo LCP/INP/CLS | [SEO-04](tasks/04-validar-cwv-y-lcp.md) | [technical.md](findings/technical.md) §6 y limitaciones |
| Riesgo no confirmado de `fetchpriority` en LCP | [SEO-04](tasks/04-validar-cwv-y-lcp.md) | [technical.md](findings/technical.md) §6 |
| Boilerplate literal repetido en cuatro nichos | [SEO-05](tasks/05-diversificar-paginas-nicho.md) | [content.md](findings/content.md) §Hallazgo 1 |
| Plantilla hero/benefits/process repetida | [SEO-05](tasks/05-diversificar-paginas-nicho.md) | [content.md](findings/content.md) §Hallazgo 2 |
| Falta de experiencias/imágenes propias por nicho | [SEO-05](tasks/05-diversificar-paginas-nicho.md) | [content.md](findings/content.md) y [sxo.md](findings/sxo.md) |
| Arquitectura de enlazado interno pobre | [SEO-06](tasks/06-arquitectura-enlazado-interno.md) | [cluster.md](findings/cluster.md) §§3, 6 y 7 |
| FAQs SEO local repetidas | [SEO-07](tasks/07-resolver-canibalizacion.md) | [cluster.md](findings/cluster.md) §1 |
| Blog GEO vs FAQ de servicio | [SEO-07](tasks/07-resolver-canibalizacion.md) | [content.md](findings/content.md) §3; [geo.md](findings/geo.md) §6 |
| Blog/precio/servicio y comercios/tienda con intención solapada | [SEO-07](tasks/07-resolver-canibalizacion.md) | [cluster.md](findings/cluster.md) §§2, 4 y 5 |
| FAQs largas y poco legibles | [SEO-08](tasks/08-mejorar-citabilidad-y-legibilidad.md) | [content.md](findings/content.md) §4 |
| URLs relativas en contenido GEO | [SEO-08](tasks/08-mejorar-citabilidad-y-legibilidad.md) | [geo.md](findings/geo.md) §2 |
| Falta byline/fecha visible | [SEO-09](tasks/09-autoría-y-llms.md) | [content.md](findings/content.md) §5; [geo.md](findings/geo.md) §§3–4 |
| `llms.txt` mejorable | [SEO-09](tasks/09-autoría-y-llms.md) | [geo.md](findings/geo.md) §1 |
| Ausencia no verificada de GBP propia | [SEO-10](tasks/10-gbp-prueba-social.md) | [local.md](findings/local.md) §4 |
| Falta de reseñas/testimonios/señales de trust | [SEO-10](tasks/10-gbp-prueba-social.md) | [local.md](findings/local.md) §§5–6; [sxo.md](findings/sxo.md) |
| `ProfessionalService` mejorable | [SEO-11](tasks/11-schema-local-y-marca.md) | [local.md](findings/local.md) §3 |
| `openingHours`, `geo`, `areaServed`, `sameAs` | [SEO-11](tasks/11-schema-local-y-marca.md) | [local.md](findings/local.md) §3; [geo.md](findings/geo.md) §4 |
| Naming de marca inconsistente | [SEO-11](tasks/11-schema-local-y-marca.md) | [geo.md](findings/geo.md) §4 |
| CTA fuera del fold mobile en home | [SEO-12](tasks/12-ux-mobile-y-prueba-visual.md) | [visual.md](findings/visual.md) §1.1 |
| Banner de cookies bloquea el fold | [SEO-12](tasks/12-ux-mobile-y-prueba-visual.md) | [visual.md](findings/visual.md) §1.3 |
| Riesgo de proximidad del WhatsApp flotante | [SEO-12](tasks/12-ux-mobile-y-prueba-visual.md) | [visual.md](findings/visual.md) §3.1 |
| Perfil de backlinks no verificable | [SEO-13](tasks/13-autoridad-y-backlinks.md) | [backlinks.md](findings/backlinks.md) §§1–5 |
| Falta de autoridad externa | [SEO-13](tasks/13-autoridad-y-backlinks.md) | [backlinks.md](findings/backlinks.md) §5; [local.md](findings/local.md) §8 |
| GSC/GA4/CrUX insuficientes para medir impacto | [SEO-14](tasks/14-medicion-seo.md) | [technical.md](findings/technical.md) intro y limitaciones |

## Hallazgos informativos o no accionables que no requieren tarea

- Robots.txt y sitemap responden 200 y el sitemap es técnicamente correcto; no se abre una tarea de corrección mientras no cambie la evidencia ([sitemap.md](findings/sitemap.md)).
- Canonicals, renderizado estático Astro, seguridad HTTP, viewport, ausencia de hreflang en un sitio monolingüe y ausencia de mixed content fueron evaluados como correctos ([technical.md](findings/technical.md)).
- La implementación de imágenes con `astro:assets`, WebP, `srcset`, dimensiones explícitas y lazy loading es una base correcta; AVIF queda como mejora condicional, no como tarea autónoma ([technical.md](findings/technical.md) §6).
- La FAQ de restaurantes está correctamente colapsada en acordeón y los targets táctiles son adecuados; no se crea una tarea para rehacerla ([visual.md](findings/visual.md) §2 y §3.3).
- No se observaron solapamientos, texto cortado ni overflow horizontal en las capturas revisadas ([visual.md](findings/visual.md) §3.2).
- El desktop above-the-fold y el mensaje home–nicho se consideran correctos en la muestra visual ([visual.md](findings/visual.md) §§1.4 y 5).
- Claims prohibidos: la auditoría no detectó incidencias de compliance en el contenido revisado ([content.md](findings/content.md) §6).
- IndexNow no está verificado en profundidad; queda como investigación opcional, no como tarea del backlog actual, porque no se demostró una incidencia ni un beneficio necesario.
- HSTS sin `includeSubDomains`/`preload` solo requiere revisión si existen o se planifican subdominios relevantes; no se convierte en tarea ahora.
- Toxicidad y naturalidad de anchors no son evaluables sin una fuente de backlinks; se mantienen como limitación dentro de SEO-13, no como hallazgo independiente ([backlinks.md](findings/backlinks.md) §4).

## Orden recomendado para ejecutar con ODD

1. **Medición mínima primero:** ejecutar [SEO-14](tasks/14-medicion-seo.md) hasta dejar documentadas fuentes, accesos y baseline disponible; sin inventar datos faltantes.
2. **Higiene técnica P0:** ejecutar [SEO-01](tasks/01-redirects-servicios.md) y después [SEO-02](tasks/02-normalizar-urls-internas.md), verificando cada unidad antes de avanzar.
3. **Publicación e indexabilidad:** [SEO-03](tasks/03-excluir-components.md) ya está resuelta en `689a5a1`; mantener la comprobación de sitemap, robots y rutas públicas en futuras verificaciones.
4. **Conversión mobile y evidencia de rendimiento:** ejecutar [SEO-12](tasks/12-ux-mobile-y-prueba-visual.md) junto con [SEO-04](tasks/04-validar-cwv-y-lcp.md), manteniendo separadas UX visual y medición CWV.
5. **Arquitectura antes de reescribir:** resolver decisiones y matriz de intención en [SEO-07](tasks/07-resolver-canibalizacion.md), aplicar el mapa de [SEO-06](tasks/06-arquitectura-enlazado-interno.md) y luego diversificar con [SEO-05](tasks/05-diversificar-paginas-nicho.md). Si el cambio de arquitectura altera el contenido, actualizar el alcance de las tareas antes de escribir.
6. **Calidad editorial:** ejecutar [SEO-08](tasks/08-mejorar-citabilidad-y-legibilidad.md) y [SEO-09](tasks/09-autoría-y-llms.md) con las decisiones de naming de [SEO-11](tasks/11-schema-local-y-marca.md) coordinadas.
7. **Confianza local:** resolver decisiones humanas de [SEO-10](tasks/10-gbp-prueba-social.md) y después implementar schema coherente en [SEO-11](tasks/11-schema-local-y-marca.md).
8. **Autoridad externa:** cerrar [SEO-13](tasks/13-autoridad-y-backlinks.md) cuando exista una línea base y un canal legítimo de adquisición de menciones/enlaces.
9. **Seguimiento:** volver a [SEO-14](tasks/14-medicion-seo.md) para comparar únicamente métricas realmente disponibles y documentar cambios, sin prometer ranking.

Cada task file es una unidad pendiente para ODD: incluye objetivo, evidencia, alcance, criterios verificables, dependencias, riesgo operativo y checks sugeridos.
