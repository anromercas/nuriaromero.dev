# Crear un plan verificable de autoridad externa
- **ID:** SEO-13
- **Prioridad:** P3
- **Estado:** pendiente
- **Fuente:** [backlinks.md](../findings/backlinks.md), resumen, secciones 2, 4 y 5; [local.md](../findings/local.md), sección 8
- **Scope:** Plan de autoridad externa, citas/directorios, menciones y backlinks ganados. La auditoría disponible es Tier 0 y no permite cuantificar el perfil completo.

## Problema
No se confirmó ningún backlink externo con Common Crawl ni verificación directa. Tampoco hay datos fiables de autoridad, toxicidad o anchors porque no hay API de Moz/Bing configurada. Esto es una limitación de medición y una oportunidad de trabajo, no prueba de penalización.

## Objetivo
**Riesgo operativo:** Actuar sin fuente ni criterios puede producir enlaces irrelevantes o prácticas artificiales.

Definir un plan sostenible de autoridad y un método de medición antes de ejecutar outreach o altas en directorios.

## Criterios de aceptación
- Se documentan fuentes y método para medir dominios referentes, enlaces y anchors.
- Se priorizan oportunidades relevantes y legítimas: casos autorizados, asociaciones, directorios locales coherentes o colaboraciones reales.
- Cada acción tiene propietario, evidencia esperada y criterio de descarte.
- No se compran enlaces ni se generan redes artificiales.
- Se establece una línea base antes de cualquier campaña, sin atribuir ranking a una sola acción.

## Dependencias y decisiones abiertas
Decidir presupuesto, tiempo, canales, colaboraciones disponibles y si se habilita una fuente de datos fiable. Coordinar con SEO-10 para casos/testimonios y SEO-14 para medición.

## Checks sugeridos
- Export de la fuente elegida y fecha de captura.
- Verificación manual de cada enlace relevante.
- Revisión de relevancia, anchor y riesgo de spam.
- Registro de acciones y resultados, sin usar métricas no disponibles como hechos.

## No hacer
No hacer link building masivo, no usar PBNs, no pagar reseñas/enlaces de baja calidad y no afirmar autoridad o toxicidad sin datos observables.

## Implementación local SEO-13

**Estado:** parcial. La base de autoridad está implementada localmente; la confirmación de backlinks externos sigue pendiente.

- Se publicó `/recursos/` como activo enlazable propio, con enlaces a `/sobre-mi/`, `/portfolio/`, `/blog/` y la guía GEO.
- El activo incluye una política visible: no comprar enlaces, no intercambiarlos artificialmente y no publicar métricas, testimonios o colaboraciones sin evidencia.
- Se añadió `docs/seo-audit/authority-backlink-register.md` como registro operativo con línea base fechada, propietario, evidencia esperada, criterios de descarte, guion de outreach y checklist de calidad.
- `public/llms.txt` ahora incluye el hub de recursos para facilitar su descubrimiento como página pública.
- `scripts/check-seo-13.mjs` valida el hub renderizado, los enlaces internos, la política de seguridad, el registro y la ausencia de métricas inventadas.

### Evidencia y pendientes

- Check local: `npm run check:seo-13` (build + checker) debe ejecutarse tras cada cambio de esta tarea.
- `git diff --check` verifica la integridad del cambio.
- No se ha ejecutado outreach ni se ha afirmado ningún backlink ganado.
- Backlinks, dominios referentes, anchors, autoridad y toxicidad permanecen pendientes hasta disponer de una fuente externa autorizada y una fecha de captura reproducible.
