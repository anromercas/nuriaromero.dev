# Registro de autoridad y backlinks

**Tarea:** SEO-13
**Estado:** parcial: la base local está implementada; la verificación externa depende de una fuente de datos autorizada y de acciones humanas reales.
**Última revisión local:** 2026-09-21
**Propietaria:** Nuria Romero

## Línea base antes de cualquier campaña

| Campo | Estado verificable | Evidencia requerida antes de actualizarlo |
| --- | --- | --- |
| Fuente de datos | No configurada; no se atribuyen cifras de backlinks, dominios referentes, anchors, autoridad o toxicidad | Export fechado de una fuente autorizada (por ejemplo, Search Console/Bing Webmaster Tools o una API contratada) |
| Fecha de captura | 2026-09-21: solo se ha revisado el repositorio y la salida local | Export original, URL/fuente, rango temporal y fecha de descarga |
| Backlinks confirmados | No confirmados en esta tarea | URL origen, URL destino, fecha de comprobación y respuesta HTTP observable |
| Dominios referentes | No cuantificados | Export de la fuente elegida y deduplicación por dominio |
| Anchors | No cuantificados | Export de anchors y revisión manual de contexto |
| Calidad/toxicidad | No evaluada sin datos | Revisión de relevancia, contexto, destino, intención editorial y señales de spam |

La ausencia de datos no significa penalización. La línea base se debe conservar sin sobrescribirla cuando llegue una fuente nueva.

## Activos públicos que pueden enlazarse

Estos activos son propios, públicos y revisables. El enlace solo se propone cuando resuelve una necesidad editorial concreta:

| Activo | Audiencia o contexto legítimo | Propietaria | Evidencia esperada | Criterio de descarte |
| --- | --- | --- | --- | --- |
| `https://nuriaromero.dev/recursos/` | Recursos de desarrollo web, SEO local y búsquedas con IA | Nuria Romero | URL pública, contenido visible y revisión de enlaces | Descartar si el contexto no es relevante o si el enlace sería solo promocional |
| `https://nuriaromero.dev/sobre-mi/` | Perfil profesional, autoría o colaboración confirmada | Nuria Romero | Identidad y experiencia descritas en la página | Descartar si se necesita una credencial no publicada o no verificable |
| `https://nuriaromero.dev/portfolio/` | Caso o proyecto que el sitio enlazado permite revisar | Nuria Romero + cliente, cuando aplique | Dominio público y consentimiento del cliente cuando se le nombre | Descartar si no existe consentimiento o el proyecto ya no es público |
| `https://nuriaromero.dev/blog/` y sus guías | Artículos editoriales que aportan una fuente o explicación | Nuria Romero | Artículo publicado, fecha y enlaces internos verificables | Descartar si el tema no coincide o el enlace no añade contexto |

No se inventan partners, premios, testimonios, colaboraciones, métricas, clientes ni menciones. Los proyectos del portfolio no son backlinks confirmados por aparecer en esta tabla.

## Registro de outreach seguro

Antes de contactar, completar una fila y conservar la respuesta. El propietario no delega una acción sin confirmar relevancia y consentimiento.

| Fecha | Prospecto y URL | Relación real | Recurso propuesto | Propietaria | Evidencia esperada | Criterio de descarte | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Pendiente | Pendiente de identificar; no se presupone una relación | Pendiente de confirmar | Pendiente de confirmar | Nuria Romero | Respuesta explícita y URL publicada, si ocurre | No enviar sin relación/contexto real; rechazar pago, intercambio o red artificial | No iniciado |

### Guion permitido

> He publicado este recurso porque explica [tema]. Si encaja de forma natural en tu contenido sobre [contexto], puedes enlazarlo como referencia. No hace falta responder ni enlazarlo si no aporta valor.

No se ofrece dinero, producto, reseña, intercambio de enlaces, publicación de invitado sin control editorial ni placement garantizado a cambio de un enlace.

## Checklist de calidad de cada enlace

1. Confirmar que el dominio y la página existen y responden correctamente.
2. Confirmar relevancia temática y geográfica solo cuando esté documentada.
3. Leer el contexto visible: el enlace debe ayudar a la persona, no solo transferir señal.
4. Registrar el anchor exacto y evitar anchors comerciales repetitivos.
5. Revisar si la página parece editorial, patrocinada o generada para enlaces; descartar granjas de enlaces, PBNs, directorios irrelevantes y redes artificiales.
6. Registrar si el enlace es `nofollow`, `sponsored` o `ugc` cuando la página lo declare; no intentar eludir esa indicación.
7. Verificar destino canónico y respuesta HTTP antes de contar el enlace como confirmado.
8. No usar métricas de autoridad o toxicidad sin una export fechada y reproducible.

## Medición y atribución

- Guardar cada export con fecha, fuente y rango temporal; no mezclar fuentes como si fueran equivalentes.
- Comparar enlaces y dominios referentes en cortes periódicos, deduplicando URLs y dominios.
- Relacionar cambios con varias señales (impresiones, clics, consultas, conversiones y enlaces), sin atribuir una mejora de ranking a una única acción.
- Coordinar la instrumentación y la lectura de rendimiento con SEO-14.
- Revisar con SEO-10 cualquier caso, testimonio o referencia de cliente antes de publicarlo.

## Límites actuales

La verificación de backlinks externos, anchors, autoridad y toxicidad queda **pendiente** hasta disponer de acceso autorizado a una fuente fiable. Este documento es un sistema de trabajo; no es evidencia de enlaces ganados.
