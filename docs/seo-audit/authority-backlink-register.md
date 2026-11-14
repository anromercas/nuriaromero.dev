# Registro de autoridad y backlinks

**Tarea:** SEO-13
**Estado:** parcial: la base local está implementada y hay una línea base fechada (2026-11-14, DataForSEO); la lista de outreach y las acciones humanas reales siguen pendientes.
**Última revisión local:** 2026-11-14
**Propietaria:** Nuria Romero

## Línea base antes de cualquier campaña

> Nota (2026-11-14): esta tabla queda sustituida por la línea base fechada 2026-11-14 de este documento. Se conservan las filas como histórico.

| Campo                 | Estado verificable                                                                                       | Evidencia requerida antes de actualizarlo                                                                       |
| --------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Fuente de datos       | No configurada; no se atribuyen cifras de backlinks, dominios referentes, anchors, autoridad o toxicidad | Export fechado de una fuente autorizada (por ejemplo, Search Console/Bing Webmaster Tools o una API contratada) |
| Fecha de captura      | 2026-09-21: solo se ha revisado el repositorio y la salida local                                         | Export original, URL/fuente, rango temporal y fecha de descarga                                                 |
| Backlinks confirmados | No confirmados en esta tarea                                                                             | URL origen, URL destino, fecha de comprobación y respuesta HTTP observable                                      |
| Dominios referentes   | No cuantificados                                                                                         | Export de la fuente elegida y deduplicación por dominio                                                         |
| Anchors               | No cuantificados                                                                                         | Export de anchors y revisión manual de contexto                                                                 |
| Calidad/toxicidad     | No evaluada sin datos                                                                                    | Revisión de relevancia, contexto, destino, intención editorial y señales de spam                                |

La ausencia de datos no significa penalización. La línea base se debe conservar sin sobrescribirla cuando llegue una fuente nueva.

## Línea base 2026-11-14 (DataForSEO Backlinks API)

Fuente: DataForSEO Backlinks API, cuenta del harness (`seo.dataforseo`), objetivo `nuriaromero.dev`.
Fecha de captura: 2026-11-14 (el índice de DataForSEO no informa de una fecha de datos propia en estas respuestas).
Llamadas: 3 de 5 permitidas (`backlinks_summary`, `backlinks_referring_domains`, `backlinks_anchors`); 3 de 30 del tope diario del harness. No se usó `backlinks_bulk_spam_score` porque las respuestas ya traen `backlinks_spam_score`.

| Métrica                                     | Valor                           | Endpoint                                                              |
| ------------------------------------------- | ------------------------------- | --------------------------------------------------------------------- |
| Backlinks totales                           | 36                              | `backlinks_summary`                                                   |
| Dominios referentes (incluye subdominios)   | 35                              | `backlinks_summary`                                                   |
| Dominios principales referentes             | 33                              | `backlinks_summary`, `backlinks_referring_domains` (`total_count` 33) |
| Backlinks con `nofollow`                    | 9                               | `backlinks_summary` (`referring_links_attributes`)                    |
| Cuota dofollow (sin `nofollow`)             | 75 % (27 de 36; cálculo propio) | derivado de `backlinks_summary`                                       |
| `backlinks_spam_score` del dominio objetivo | 59                              | `backlinks_summary`                                                   |
| Primera vez visto                           | 2025-09-30                      | `backlinks_summary`                                                   |

### Anchors principales (`backlinks_anchors`, ordenados por backlinks)

La API devolvió solo 3 anchors, no 10: es todo lo que hay en la fuente a esta fecha.

| Anchor                                                                                                                                                                                      | Backlinks | Dominios referentes | Spam score |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------------------- | ---------- |
| "High Quality Dofollow Backlinks DA 50 PA 40 Premium PBN Network Service nuriaromero.dev Rank First Page Google Fast SEO Link Building Buy Backlinks Online Cheap" (anchor de venta de PBN) | 27        | 27                  | 63         |
| "nuriaromero.dev" (URL desnuda)                                                                                                                                                             | 8         | 7                   | 50         |
| (sin texto: enlace de imagen)                                                                                                                                                               | 1         | 1                   | 15         |

No hay anchors de marca ni de servicio escritos por terceros reales. Los 27 enlaces del primer anchor llevan `noopener` y ninguno `nofollow`.

### Cuota de spam

- Umbral: `backlinks_spam_score` >= 60 (umbral de la historia).
- 25 de 33 dominios principales referentes superan el umbral (75,8 %; cálculo propio sobre `backlinks_referring_domains`).
- Esos 25 dominios aportan 27 de los 36 backlinks (75 %), el mismo número que el anchor de venta de PBN: los dos conjuntos coinciden en cifra, y es lo esperable si son los mismos enlaces (inferencia, no comprobada enlace a enlace).
- Entre 50 y 59: 7 dominios (acortadores de URL y agregadores, todos `nofollow`); el 8.º (`toplikevideo.com`, spam score 15) es el único por debajo.
- Lectura: la cifra "26 dominios referentes casi todos spam" citada sin fecha en `odd/tasks/seo-para-ia-geo-page.md` no se reutiliza; esta línea base la sustituye como medición fechada. No implica penalización (ver el aviso del registro).

### Dominios probablemente spam (solo listado, sin disavow)

Fuente `backlinks_referring_domains`, 2026-11-14, `backlinks_spam_score` >= 60:

| Dominio                        | Spam score | Backlinks | Visto por primera vez |
| ------------------------------ | ---------- | --------- | --------------------- |
| m98ufa.com                     | 75         | 1         | 2026-07-03            |
| bestnz-poker-casinoslot.com    | 70         | 1         | 2026-10-11            |
| kernelpanicpodcast.com         | 70         | 2         | 2026-09-24            |
| fashionclothingnews.com        | 70         | 1         | 2026-09-01            |
| betwinnermirror.com            | 70         | 1         | 2026-08-20            |
| homesforsaleoldgreenwichct.com | 70         | 1         | 2026-08-11            |
| plumeriamarketing.com          | 70         | 1         | 2026-07-03            |
| clifflisting.com               | 65         | 2         | 2026-10-12            |
| lorentius.com                  | 60         | 1         | 2026-11-11            |
| websquemolan.com               | 60         | 1         | 2026-10-29            |
| dbike-us.com                   | 60         | 1         | 2026-10-18            |
| bureatag.com                   | 60         | 1         | 2026-10-15            |
| thcradar.com                   | 60         | 1         | 2026-10-15            |
| techbumppy.com                 | 60         | 1         | 2026-10-13            |
| sahammurah.com                 | 60         | 1         | 2026-10-13            |
| archive-hu.com                 | 60         | 1         | 2026-10-09            |
| thedocmag.com                  | 60         | 1         | 2026-10-01            |
| dupurgeniefr.com               | 60         | 1         | 2026-09-29            |
| onvaxs.com                     | 60         | 1         | 2026-09-26            |
| cvillico.com                   | 60         | 1         | 2026-09-25            |
| uncledspizza.com               | 60         | 1         | 2026-08-27            |
| quotesblom.com                 | 60         | 1         | 2026-08-26            |
| theforbestimes.com             | 60         | 1         | 2026-08-22            |
| betulcrime.com                 | 60         | 1         | 2026-08-14            |
| ggmap.us.com                   | 60         | 1         | 2026-08-02            |

Nota para la propietaria: la mayoría aparece entre julio y noviembre de 2026 (enlaces nuevos), con un anchor que vende enlaces PBN y menciona la URL del sitio. Parece una campaña de spam ajena, no enlaces ganados. Decisión sobre disavow: fuera de alcance de NRD-21.

## Activos públicos que pueden enlazarse

Estos activos son propios, públicos y revisables. El enlace solo se propone cuando resuelve una necesidad editorial concreta:

| Activo                                      | Audiencia o contexto legítimo                              | Propietaria                            | Evidencia esperada                                               | Criterio de descarte                                                           |
| ------------------------------------------- | ---------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `https://nuriaromero.dev/recursos/`         | Recursos de desarrollo web, SEO local y búsquedas con IA   | Nuria Romero                           | URL pública, contenido visible y revisión de enlaces             | Descartar si el contexto no es relevante o si el enlace sería solo promocional |
| `https://nuriaromero.dev/sobre-mi/`         | Perfil profesional, autoría o colaboración confirmada      | Nuria Romero                           | Identidad y experiencia descritas en la página                   | Descartar si se necesita una credencial no publicada o no verificable          |
| `https://nuriaromero.dev/portfolio/`        | Caso o proyecto que el sitio enlazado permite revisar      | Nuria Romero + cliente, cuando aplique | Dominio público y consentimiento del cliente cuando se le nombre | Descartar si no existe consentimiento o el proyecto ya no es público           |
| `https://nuriaromero.dev/blog/` y sus guías | Artículos editoriales que aportan una fuente o explicación | Nuria Romero                           | Artículo publicado, fecha y enlaces internos verificables        | Descartar si el tema no coincide o el enlace no añade contexto                 |

No se inventan partners, premios, testimonios, colaboraciones, métricas, clientes ni menciones. Los proyectos del portfolio no son backlinks confirmados por aparecer en esta tabla.

## Registro de outreach seguro

Antes de contactar, completar una fila y conservar la respuesta. El propietario no delega una acción sin confirmar relevancia y consentimiento.

| Fecha      | Prospecto y URL                                                                                                                                                                                                                                     | Relación real       | Recurso propuesto                                                                                                                                                                                                                                                     | Propietaria  | Evidencia esperada                                                                        | Criterio de descarte                                                                                      | Estado      |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ----------- |
| 2026-11-14 | Cámara de Comercio de Sevilla, guías de TICNegocios: https://ticnegocios.camaradesevilla.com/guias/ (cargó el 2026-11-14). Guías sobre posicionamiento en Google, Google My Business e IA. Relevancia: audiencia pyme sevillana                     | Sin relación previa | `https://nuriaromero.dev/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/` y `https://nuriaromero.dev/blog/como-aparecer-en-google-maps-negocio-sevilla/` como lectura complementaria; contacto por `https://ticnegocios.camaradesevilla.com/servicios/contacto/` | Nuria Romero | Respuesta explícita y URL publicada del enlace en una guía o página de recursos           | No hay vía para proponer guías o piden pago, alta como partner de pago o exclusividad                     | No iniciado |
| 2026-11-14 | Sevilla Emprendedora (Ayuntamiento de Sevilla), blog: https://www.sevilla.org/servicios/economia/sevilla-emprendedora/blog (cargó el 2026-11-14; incluye un post sobre Perfil de Empresa en Google). Relevancia: emprendedores y pymes de la ciudad | Sin relación previa | `https://nuriaromero.dev/blog/como-aparecer-en-google-maps-negocio-sevilla/`                                                                                                                                                                                          | Nuria Romero | Respuesta del servicio y enlace publicado en un post o ficha de recursos                  | Web institucional que no enlaza a terceros comerciales, o sin canal de contacto distinto de la centralita | No iniciado |
| 2026-11-14 | WordPress Sevilla (Meetup): https://www.meetup.com/es-ES/wordpress-sevilla/ (cargó el 2026-11-14). Relevancia: comunidad local de desarrolladores y webs                                                                                            | Sin relación previa | Propuesta de charla corta sobre SEO local para webs de negocios; si se acepta, la ficha del evento o las notas enlazan a `https://nuriaromero.dev/recursos/`                                                                                                          | Nuria Romero | Charla aceptada y URL del evento o de las diapositivas con enlace                         | Los organizadores piden pago o patrocinio, o la charla es un anuncio de servicios                         | No iniciado |
| 2026-11-14 | WordCamp Sevilla 2027: https://sevilla.wordcamp.org/2027/ (cargó el 2026-11-14; en fase temprana de planificación, con formulario de contacto abierto). Relevancia: evento WordPress de Sevilla                                                     | Sin relación previa | Ofrecer ayuda voluntaria o una charla cuando abran convocatoria; perfil en `https://nuriaromero.dev/sobre-mi/`                                                                                                                                                        | Nuria Romero | Respuesta de organizadores y, cuando exista, página de ponentes o voluntariado con enlace | Solo se obtiene el enlace pagando un patrocinio (descartar esa vía) o no se abre convocatoria             | No iniciado |
| 2026-11-14 | GDG Sevilla (Google Developer Group): https://gdg.community.dev/gdg-sevilla/ (cargó el 2026-11-14). Relevancia media: desarrolladores, menos pymes locales                                                                                          | Sin relación previa | Charla o taller sobre sitios web visibles en buscadores y respuestas de IA; recurso `https://nuriaromero.dev/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/`                                                                                                    | Nuria Romero | Charla aceptada y ficha del evento con enlace                                             | La convocatoria no encaja con el tema, o es un evento sin revisión editorial                              | No iniciado |

Nota (2026-11-14): se verificaron 5 oportunidades, por debajo del objetivo de 10-20, por decisión de la propietaria. Se añadirán más cuando existan relaciones reales (clientes del portfolio, asociaciones o colegios profesionales de los que sea socia). Descartados tras revisarlos: directorios genéricos de empresas, Sevilla TechPark, Andalucía Emprende, AJE Sevilla, Startup Grind Sevilla, Global AI Sevilla, Alhambra Search (Granada) y Andalu-SEO (sin sitio activo).

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

> Nota (2026-11-14): este texto queda sustituido por la línea base fechada 2026-11-14, que ya cuenta con fuente y fecha de captura. Se conserva como histórico.
