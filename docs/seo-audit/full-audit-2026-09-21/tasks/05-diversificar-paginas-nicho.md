# Diversificar contenido y experiencia de las páginas nicho
- **ID:** SEO-05
- **Prioridad:** P1
- **Estado:** parcial
- **Fuente:** [content.md](../findings/content.md), hallazgos 1, 2 y 7; [visual.md](../findings/visual.md), sección 5
- **Scope:** Las cuatro páginas de nicho y sus bloques de hero/benefits/process/FAQ, manteniendo su intención sectorial y precio vigente.

## Problema
Las cuatro páginas reutilizan boilerplate literal y una plantilla estructural casi idéntica. La auditoría lo considera un riesgo de calidad de plantilla y experiencia específica, no una prueba de canibalización de keywords. También faltan imágenes o ejemplos reales en algunos nichos.

## Objetivo
**Riesgo operativo:** Mantener el boilerplate puede diluir experiencia sectorial y calidad percibida sin aportar diferenciación.

Aumentar la especificidad sectorial de cada página con contenido y evidencia propios, conservando solo los elementos comunes que tengan una causa de producto real.

## Criterios de aceptación
- Cada página incluye una propuesta, ejemplos, objeciones, proceso o prueba de experiencia específicos del sector.
- El texto repetido entre las cuatro páginas se reduce o se justifica explícitamente como componente común.
- No se copian testimonios, resultados o claims no verificables entre nichos.
- La intención, CTA, precio y datos legales permanecen coherentes con la estrategia vigente.
- Se documenta qué contenido queda compartido y por qué.

## Dependencias y decisiones abiertas
Decisiones humanas abiertas: qué experiencias reales existen para restaurantes, clínicas, comercios y profesionales; qué imágenes se pueden publicar; qué claims están autorizados. Depende de SEO-06/07 para no crear enlaces o bloques que contradigan la arquitectura.

## Implementación 2026-09-21
- Se hicieron explícitos en HTML los enfoques sectoriales ya autorizados mediante títulos propios de beneficios y proceso: carta/reservas para restaurantes, información y cita para clínicas, catálogo/venta para comercios y especialidad/consulta para despachos.
- No se añadieron clientes, casos de éxito, testimonios, resultados, métricas, imágenes ni nuevos claims. Se conserva el copy sectorial existente de hero, beneficios, proceso y FAQ.
- No se modificaron enlaces, arquitectura hub-and-spoke ni la intención de las FAQs: esas decisiones continúan en SEO-06/07.

## Bloques compartidos que se mantienen
- **CTA final:** se mantiene porque la acción comercial es la misma en los cuatro servicios: contactar por WhatsApp o formulario para pedir una propuesta. El título y el texto del CTA siguen siendo sectoriales en cada página.
- **Precio desde 399 €:** se mantiene porque es el precio de salida vigente de la misma oferta base; los incluidos y las notas siguen describiendo el alcance particular de cada sector.
- **Dominio y hosting el primer año:** se mantiene como condición comercial común de la oferta base.
- **datos legales, consentimiento y privacidad:** se mantienen como requisito transversal. Las páginas de clínicas y despachos conservan los matices sectoriales ya autorizados sobre datos de salud y consultas.
- **Estructura de precio y FAQ:** se mantiene para que las páginas sigan siendo comparables y escaneables; el contenido dentro de cada bloque sigue siendo específico de cada sector.

## Evidencia y límite de cierre
- Check automatizado: `npm run check:seo-05`, que construye desde cero y ejecuta `node scripts/check-seo-05.mjs` sobre las cuatro páginas renderizadas. Comprueba títulos sectoriales, similitud de copy mediante n-gramas, canonical y JSON-LD tolerantes al orden de atributos, guards deterministas de claims explícitos no autorizados y esta documentación de bloques compartidos. El guard no sustituye una revisión editorial completa ni acredita experiencia sectorial.
- RED observado: antes de los cambios, el check falló porque los HTML mantenían los títulos genéricos compartidos y no existía esta documentación de bloques comunes.
- GREEN observado: tras `npm run check:seo-05`, el build generó las 22 páginas y el checker pasó para las cuatro rutas renderizadas. El checker resuelve las rutas desde el repositorio, no desde el directorio actual.
- Estado parcial: faltan decisiones humanas y evidencia publicable para añadir ejemplos reales, imágenes propias o claims de experiencia para restaurantes, clínicas, comercios y profesionales. No se puede cerrar ese punto sin esas autorizaciones.
- Correcciones de calidad del checker: las rutas se resuelven desde el repositorio; canonical y JSON-LD se leen por atributos/elementos; la duplicación se compara por similitud de n-gramas; los guards cubren claims explícitos de garantía, ranking, porcentajes y plazos; y el mensaje/documentación aclara que el check no sustituye revisión editorial ni prueba experiencia.

## Checks sugeridos
- Comparativa de texto repetido entre las cuatro páginas.
- Revisión editorial por sector y lectura con el avatar objetivo.
- Build, HTML renderizado y schema de cada página.
- Revisión de no duplicar FAQs sin intención.

## No hacer
No inventar casos de éxito, clientes, métricas, fotografías ni expertise sectorial; no variar palabras solo para aparentar unicidad; no cambiar la intención de las páginas sin decisión de negocio.
