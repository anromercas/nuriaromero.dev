# Decidir GBP propia y construir prueba social verificable
- **ID:** SEO-10
- **Prioridad:** P2
- **Estado:** pendiente
- **Fuente:** [local.md](../findings/local.md), secciones 4–7 y top de acciones; [sxo.md](../findings/sxo.md), desglose de autoridad/trust
- **Scope:** GBP propia, reseñas/testimonios, casos de experiencia y señales de confianza local, sin fabricar evidencia.

## Problema
La auditoría no pudo verificar una GBP propia, reseñas propias, embed de Maps ni `sameAs` a una ficha propia. También detecta pocos casos y sin resultados cuantificados, lo que debilita la confianza para un servicio de SEO local.

## Objetivo
**Riesgo operativo:** Publicar señales no consentidas o artificiales crea riesgo reputacional y de políticas.

Definir y ejecutar, si la usuaria lo aprueba y puede demostrarlo, un plan de presencia local y prueba social que sea auténtico, consentido y verificable.

## Criterios de aceptación
- Existe una decisión documentada sobre si procede crear/reclamar una GBP propia como SAB y qué dirección/área se publicará.
- Solo se publican testimonios, nombres, logos, imágenes y resultados con consentimiento y evidencia.
- Las señales incorporadas al sitio enlazan a activos reales y consistentes con NAP.
- Si no se crea GBP o no hay testimonios autorizados, la decisión y la ausencia quedan documentadas; la tarea no se marca por defecto como cumplida.
- No se prometen rankings ni resultados de clientes.

## Dependencias y decisiones abiertas
Decisiones humanas obligatorias: crear/reclamar GBP, categoría, área de servicio, horarios, si mostrar domicilio, solicitar reseñas, qué testimonios/casos tienen consentimiento y qué imágenes reales pueden publicarse. Depende de SEO-11 para `sameAs` y datos locales.

## Checks sugeridos
- Revisión de consentimiento y trazabilidad de cada prueba social.
- Comprobación de NAP, URLs y perfiles.
- Revisión manual de claims y de las políticas aplicables de Google.
- Captura de evidencia de activos publicados, sin exponer datos personales innecesarios.

## No hacer
No crear una ficha falsa, no comprar reseñas, no publicar testimonios sin permiso, no inventar resultados ni añadir un mapa/dirección que contradiga el modelo SAB.

## Implementación local (2026-09-21)

- La página `/seo-local-sevilla/` incluye un bloque visible de transparencia sobre la prueba social. Declara que la GBP propia está pendiente de decisión y que no se muestran reseñas, valoraciones, testimonios ni métricas sin activo, consentimiento y evidencia verificables.
- `src/data/local-trust.ts` funciona como registro explícito para la futura GBP y las piezas de prueba social. Sus URLs, `placeId` y registros de testimonios están vacíos hasta que la propietaria aporte datos y trazabilidad; el área propuesta conserva el modelo SAB sin publicar domicilio.
- `npm run check:seo-10` integra build y `scripts/check-seo-10.mjs`, que comprueba el estado pendiente renderizado y falla si aparecen ratings, reseñas o enlaces a Maps no verificados.

## Estado

**Parcial, no completada por defecto.** La base local y el guard de publicación están implementados, pero siguen pendientes las decisiones humanas de crear/reclamar la GBP, categoría, área, horarios y dirección de verificación, además de cualquier consentimiento de testimonios/casos. No se añade `sameAs`, mapa, dirección, reseña, valoración ni claim de resultado.
