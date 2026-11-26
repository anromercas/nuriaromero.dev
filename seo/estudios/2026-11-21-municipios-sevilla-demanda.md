# Estudio de demanda: páginas por municipio y barrio (Sevilla)

Fecha: 2026-11-21. Mercado: España (location 2724), idioma es. Solo lectura; no se ha tocado ningún fichero del proyecto salvo este informe.

## 1. Resumen ejecutivo

- La demanda medida para "servicio + municipio" en la provincia de Sevilla es **muy pequeña**: de unas 85 localidades y 9 plantillas, solo **11 consultas** (en 9 localidades) alcanzan 10 búsquedas/mes o más. Ningún barrio de Sevilla capital aparece con volumen.
- La única consulta con volumen apreciable es **"diseño web utrera" (70/mes)**. El resto está en 10-40.
- Referencia de la capital, para escala: "diseño web sevilla" 880, "consultor seo sevilla" 590, "agencia marketing digital sevilla" 260, "posicionamiento web sevilla" 260, "seo sevilla" 210. Una página de municipio vale entre el 1 % y el 8 % de eso.
- Meta de ser #1 para ~10 búsquedas/mes: **realista en Tomares, Écija y Utrera**; en Dos Hermanas hay más demanda pero el SERP está saturado de páginas locales dedicadas.
- Consecuencia: estas páginas son de **bajo retorno directo**; su valor es defensivo/de cobertura (y GEO), no de volumen. Publicar pocas y buenas.

## 2. Método y limitaciones (importante)

Llamadas de pago a DataForSEO: **14** (límite fijado: 30).

| Herramienta                             | Llamadas | Uso                                     |
| --------------------------------------- | -------- | --------------------------------------- |
| kw_data_google_ads_search_volume        | 6        | Verificación de volumen (Google Ads)    |
| dataforseo_labs_google_keyword_overview | 3        | Cribado masivo (hasta 700 kw/llamada)   |
| serp_organic_live_advanced              | 5        | SERP de las 5 consultas con más sentido |

Limitaciones medidas, no supuestas:

1. **La herramienta de volumen de Google Ads del MCP devuelve solo los 10 primeros resultados por llamada**, aunque se envíen 24 o 387 keywords (comprobado en 2 llamadas). Por eso no fue posible el "bulk de 1000" pedido. Se envió una primera llamada con 387 keywords y se recibieron 10 items; esa llamada y una de 24 keywords se consideran parcialmente perdidas.
2. Como alternativa se usó **Labs keyword_overview**, que acepta hasta 700 keywords, y solo devuelve las que tiene en su base. Los volúmenes coinciden con Google Ads cuando ambos responden (diseño web utrera 70, diseño web dos hermanas 20, seo dos hermanas 10, consultor seo dos hermanas 40, marketing digital dos hermanas 10). **Pero Labs omite algunas keywords que Ads sí da a 10** (ejemplo: "seo utrera", "diseño web camas": Ads 10, ausentes en Labs). Por tanto una keyword "no devuelta" significa "no medida o por debajo de ~10", no "0 confirmado".
3. Cribado Labs: ~330 keywords (9 plantillas en ~35 municipios, más diseño web/seo en ~20 municipios más) + ~50 barrios/Aljarafe/Sevilla + 15. Verificación Ads: unas 60 keywords (principalmente "diseño web X" y "seo X" de los municipios grandes). **No se midieron las 9 plantillas x todas las localidades en Google Ads.**
4. **La banda 5-9/mes no es medible**: Google Ads redondea el mínimo a 10. No hay segunda banda con datos; todo lo que no sale es "<10 o sin dato".
5. Los SERP muestran URLs enmascaradas (google.com/goto), por lo que el dominio de los resultados orgánicos se leyó del breadcrumb/título; las URLs reales solo están en las referencias del AI Overview.
6. nuriaromero.dev **no aparece** en ninguno de los 5 SERP consultados.

## 3. Localidades cribadas (sin volumen detectable en ninguna plantilla)

Alcalá de Guadaira, Mairena del Aljarafe (salvo diseño web, ver abajo), Coria del Río, La Rinconada, San Juan de Aznalfarache, Bormujos, Morón de la Frontera, Los Palacios y Villafranca, Osuna, Estepa, Marchena, Sanlúcar la Mayor, Castilleja de la Cuesta, Gines, Olivares, Cantillana, Alcalá del Río, La Algaba, Santiponce, Valencina, Salteras, Gelves, Palomares del Río, Almensilla, Bollullos, Umbrete, Benacazón, Villanueva del Ariscal, Pilas, Brenes, Tocina, Lora del Río, Cazalla de la Sierra, Constantina, El Viso del Alcor, Mairena del Alcor, Arahal, Las Cabezas de San Juan, Fuentes de Andalucía, Montequinto, Guillena, La Puebla del Río, El Cuervo, Paradas, Montellano, Burguillos y Castilleja de Guzmán.

Barrios y zonas (Nervión, Triana, Los Remedios, Macarena, Sevilla Este, Heliópolis, Bellavista, Bami, Cerro-Amate, Alcosa, San Pablo, Pino Montano, Casco Antiguo, Los Bermejales, La Cartuja, Torreblanca, Palmete, Aljarafe): **sin volumen en "diseño web X"** (Ads, 10 barrios: ninguno; Labs: ninguno) ni en seo/marketing/posicionamiento con los que se probó (Nervión, Triana, Sevilla Este, Aljarafe). Los barrios no merecen página por demanda.

Excepciones de aviso: "diseño web alcalá de guadaira", "seo alcalá de guadaira", "seo la rinconada", "seo tomares", etc. dieron respuesta vacía en Ads (sin volumen).

## 4. Consultas con >= 10 búsquedas/mes (medidas)

| Localidad            | Consulta                         | Volumen/mes                           | Fuente     |
| -------------------- | -------------------------------- | ------------------------------------- | ---------- |
| Utrera               | diseño web utrera                | 70 (rango mensual 40-140)             | Ads + Labs |
| Dos Hermanas         | consultor seo dos hermanas       | 40 (pico 320 en 2026-10; resto 10-40) | Ads + Labs |
| Dos Hermanas         | diseño web dos hermanas          | 20 (KD Labs 45)                       | Ads + Labs |
| Dos Hermanas         | seo dos hermanas                 | 10 (KD Labs 43)                       | Ads + Labs |
| Dos Hermanas         | posicionamiento web dos hermanas | 10                                    | Ads + Labs |
| Dos Hermanas         | marketing digital dos hermanas   | 10                                    | Ads + Labs |
| Utrera               | seo utrera                       | 10                                    | Ads        |
| Utrera               | posicionamiento web utrera       | 10 (pico 30)                          | Ads        |
| Utrera               | marketing digital utrera         | 10                                    | Ads        |
| Mairena del Aljarafe | diseño web mairena del aljarafe  | 10 (un mes de 90 en 2026-07)          | Ads        |
| Tomares              | diseño web tomares               | 10                                    | Ads        |
| Écija                | diseño web écija                 | 10                                    | Ads        |
| Camas                | diseño web camas                 | 10                                    | Ads        |
| Carmona              | diseño web carmona               | 10                                    | Ads        |
| Lebrija              | diseño web lebrija               | 10                                    | Ads        |
| Espartinas           | diseño web espartinas            | 10                                    | Labs       |

Nota: "consultor seo dos hermanas" tiene un pico de 320 en octubre de 2026 sobre una base de 10-40: probable anomalía puntual, no usar 40 como base.

Volumen total por localidad (suma de consultas distintas con >=10): Utrera 100, Dos Hermanas 90, resto 10 cada una.

## 5. SERP de las consultas con más sentido (5 llamadas)

| Consulta                              | Quién rankea                                                                                                                                                                                                                                                                                                             | Orientado de verdad a la localidad                                                                                                 | Dificultad        | Veredicto #1                                                                                        |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------- |
| diseño web utrera (70)                | AI Overview con mercurioestudios.com/diseno-web-utrera, creadoreswebsevilla.com/diseno-web-utrera, dvesign.com/diseno-web-utrera, kingseo.es/agencia-diseno-web-en/utrera, azahart, comunicaalcala, inventtatte. Orgánico clásico: rotulación (Dizone), directorios (Empresite, QDQ), starofservice de Cullera, Facebook | Hay 6-7 páginas locales dedicadas, pero **aparecen en el AI Overview, no en el orgánico**; el orgánico clásico es flojo y desviado | Media             | **Alcanzable** como orgánico; el AI Overview ya está ocupado por 7 competidores con página dedicada |
| consultor seo dos hermanas (40, pico) | Páginas dedicadas: cecomart.com/seo-sevilla/dos-hermanas, eugenioruizsilva.es, docseo.es, seowebsevilla.com, marquezf.com, estudionexia.com, agenciaeiduo.com, villaresstudio.com; Sortlist, ProntoPro; local pack con 3 fichas                                                                                          | Sí, casi todos                                                                                                                     | Alta              | **Difícil**: 8+ páginas dedicadas con ficha local; volumen real incierto por el pico                |
| diseño web dos hermanas (20)          | Sortlist, Proveedores.com, Trustlocal, ProntoPro; D&A Code, Grafiweb, Web al Cuadrado (299 €), comunicaalcala, nosunelanube, webeconomicasevilla; local pack de 3 fichas; 9 sitios relacionados                                                                                                                          | Sí                                                                                                                                 | Alta (KD Labs 45) | **Difícil**: agencias residentes + directorios                                                      |
| diseño web écija (10)                 | AI Overview: creadoreswebsevilla.com/diseno-web-ecija, narf.es, taifa.es, vimana360, creasotol; local pack: Narf (4,8 con 50 reseñas), Vimana360. Orgánico: Cinco Días (datos de empresa), Facebook, azuanet (página genérica de Sevilla), Sortlist Andalucía, kingseo (otra localidad)                                  | Solo 3-4 páginas realmente locales; orgánico clásico débil                                                                         | Media-baja        | **Alcanzable** en orgánico; local pack y AIO dominados por Narf                                     |
| diseño web tomares (10)               | Orgánico: InfoJobs, kingseo (página de Palomares), QDQ, portal del Ayuntamiento, Facebook de una imprenta, Iberinform, Houzz, Kompass. Panel de conocimiento: GM web studio                                                                                                                                              | **Ninguna página de agencia orientada a Tomares**                                                                                  | Baja              | **Fácil**                                                                                           |

Otros hallazgos del SERP: kingseo.es publica plantillas por municipio (agencia-diseno-web-en/utrera, /pedrera, /palomares...), y esas páginas rankean donde el SERP es débil; demuestra que el tipo de página funciona, y también el riesgo de doorway. Dos Hermanas es el único municipio con competencia real y volumen pequeño a la vez.

No se hicieron SERP de: seo/posicionamiento web utrera, diseño web mairena del aljarafe, camas, carmona, lebrija, espartinas (límite de presupuesto razonable por el peso de cada respuesta). Su dificultad es **no medida**.

## 6. Tabla priorizada

| Localidad                               | Tipo                    | Mejor consulta                  | Volumen                         | Volumen total | Dificultad SERP | Viabilidad #1                       | Prioridad        |
| --------------------------------------- | ----------------------- | ------------------------------- | ------------------------------- | ------------- | --------------- | ----------------------------------- | ---------------- |
| Utrera                                  | Municipio (50k hab.)    | diseño web utrera               | 70                              | 100           | Media           | Alcanzable en orgánico; AIO ocupado | P1               |
| Tomares                                 | Municipio Aljarafe      | diseño web tomares              | 10                              | 10            | Baja            | Fácil                               | P1               |
| Écija                                   | Municipio               | diseño web écija                | 10                              | 10            | Media-baja      | Alcanzable en orgánico              | P1               |
| Dos Hermanas                            | Municipio (el mayor)    | diseño web dos hermanas         | 20 (consultor seo: 40 con pico) | 90            | Alta            | Difícil; 8+ competidores dedicados  | P2               |
| Mairena del Aljarafe                    | Municipio Aljarafe      | diseño web mairena del aljarafe | 10                              | 10            | No medida       | Sin evaluar; no medido              | P2               |
| Espartinas                              | Municipio Aljarafe      | diseño web espartinas           | 10                              | 10            | No medida       | Sin evaluar                         | P2               |
| Camas                                   | Municipio metropolitano | diseño web camas                | 10                              | 10            | No medida       | Sin evaluar                         | P2               |
| Carmona                                 | Municipio               | diseño web carmona              | 10                              | 10            | No medida       | Sin evaluar                         | P3               |
| Lebrija                                 | Municipio               | diseño web lebrija              | 10                              | 10            | No medida       | Sin evaluar                         | P3               |
| Resto de municipios y todos los barrios | -                       | -                               | sin dato                        | 0 medido      | -               | -                                   | P3 (no publicar) |

Criterio P1: volumen >= 10 con SERP donde las páginas dedicadas son pocas o ausentes. P2: volumen >= 10 sin evaluar o con SERP difícil. P3: sin demanda medida.

## 7. Esfuerzo y riesgo de doorway

- Esfuerzo: bajo si se reutiliza la plantilla (`seo-local-sevilla`, hero editorial, menos texto) con contenido local genuino. No se ha tocado código.
- **Riesgo de doorway: alto si se generan en masa.** La señal de que Google las tolera es que kingseo rankea con plantillas, pero eso no es una garantía y su calidad es baja. Con 16 consultas sobre 9 localidades, publicar 50 páginas no se justifica por demanda.
- Recomendación: **una página por localidad que cubra "diseño web + SEO local" a la vez** (la consulta principal es siempre "diseño web X"). No crear una por plantilla, evita canibalización.
- Volumen seguro de publicación a la vez: **3 a 5 páginas**, con 4-6 semanas entre lotes para medir indexación y posiciones antes del siguiente.
- Contenido único mínimo por página (sin esto, no publicar):
  1. Datos locales reales: sectores y tejido económico del municipio (aceituna/logística en Dos Hermanas, hostelería y patrimonio en Écija, comercio y servicios en Tomares/Aljarafe, agro en Utrera y Lebrija).
  2. Distancia y tiempo a Sevilla y modo de trabajo (reunión presencial, remoto).
  3. Al menos un caso, ejemplo o escenario concreto de un negocio local plausible (sin inventar clientes ni cifras).
  4. Preguntas frecuentes propias de la zona y enlaces internos a los servicios y verticales ya existentes.
  5. Schema LocalBusiness/ProfessionalService con `areaServed` del municipio; ficha de Google Business Profile con área de servicio.

## 8. Lotes recomendados

**Lote 1 (4 páginas):** Utrera, Tomares, Écija, Mairena del Aljarafe.

- Utrera por ser la única con volumen real (70); Tomares y Écija por SERP débil y alcanzable.
- Mairena entra como apuesta barata (volumen 10, pico de 90, municipio grande); **antes de escribirla, medir su SERP** (1 llamada).

**Lote 2 (tras 4-6 semanas y con lectura de Search Console):** Dos Hermanas (competencia alta, pero es el mayor municipio y tiene el mayor volumen total; se enfoca mejor como "diseño web + SEO local en Dos Hermanas" con ángulo diferencial), Espartinas, Camas.

**Lote 3 (condicional):** Carmona, Lebrija, solo si el lote 1 consigue posiciones. Barrios de Sevilla y el resto de municipios: no publicar por demanda.

## 9. Próximos pasos propuestos

1. Medir el SERP de mairena del aljarafe, espartinas, camas, carmona y lebrija antes de decidir el lote 2.
2. Si hay presupuesto de llamadas, repetir el volumen de las plantillas restantes por Google Ads en bloques de 10 (límite de la herramienta) para las localidades del lote 1 y 2.
3. Tras publicar el lote 1, medir con el rank tracker (una keyword por página) y Search Console antes de ampliar.
