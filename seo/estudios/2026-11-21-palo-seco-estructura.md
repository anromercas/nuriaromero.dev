# Estudio competitivo: cómo construye y enlaza palo-seco.com sus páginas de ciudad

Fecha: 2026-11-21. Método: curl con UA de navegador, unas 30 peticiones (sitemap, home, 6 páginas SEO por ciudad, 4 de diseño web, 1 de soluciones a medida, 1 de IA Andorra, hub, servicios, 4 posts). Análisis con scripts sobre el HTML. Datos en bruto en `/private/tmp/claude-501/ps/` (temporal).

## Hallazgo principal: la premisa no se cumple del todo

Palo Seco NO posiciona "muchas ciudades". Tiene **6 ciudades** en SEO (Barcelona, Madrid, Valencia, Sevilla, Bilbao, Andorra), y todas son capitales grandes o el Principado. No hay barrios, pueblos ni comarcas como páginas propias. Los barrios (Triana, Nervión...) aparecen solo como texto dentro de la página de ciudad. Su modelo es "pocas ciudades, páginas largas y caras", no "muchas páginas finas". Es el opuesto de lo que Nuria quiere para el Aljarafe y los pueblos de Sevilla; sirve como referencia de plantilla, no de volumen.

## 1. Inventario (sitemap-index.xml -> sitemap-0.xml)

- `/sitemap.xml` da 404; el real es `/sitemap-index.xml` (un único sitemap-0.xml, 333 URLs). robots.txt lo declara.
- 333 URLs = ES + `/ca/` + `/en/` (hreflang es/ca/en/x-default en todas).
- Páginas de ubicación en ES (todas en el sitemap, verificado):

| Patrón | URLs |
|---|---|
| `/agencia-seo/<ciudad>/` | andorra, barcelona, bilbao, madrid, sevilla, valencia (6) |
| `/diseno-web-<ciudad>/` | andorra, barcelona, madrid, valencia (4) |
| `/soluciones-a-medida-<ciudad>/` | barcelona, madrid, valencia (3) |
| `/agencia-inteligencia-artificial-andorra/` | 1 |

Total ES: 14. Con CA y EN: 42 (en EN cambia el slug: `/en/seo-agency/sevilla/`, `/en/web-design-madrid/`, `/en/custom-solutions-barcelona/`).
- Además: `/agencia-seo/seo-local/` (servicio, no ciudad) y 3 posts Barcelona (`mejores-agencias-seo-en-barcelona`, `la-importancia-del-seo-en-barcelona`, `guia-definitiva-de-seo-local-para-negocios-en-barcelona`).
- Sub-ciudad (barrios, pueblos, comarcas): ninguna.

## 2. Hub y matriz servicio x ciudad

- Hub del servicio: `/agencia-seo/` (título "Agencia SEO con resultados en Google e IA", H1 "Agencia SEO"), con bloque H2 "Agencia SEO por ciudad" que lista las 6 con "SEO en X →" y la frase "Seguimos sumando". No hay `/ciudades/`.
- Hubs de servicio: `/agencia-seo/`, `/agencia-diseno-desarrollo-web/` (enlaza a las 4 de diseño web), `/agencia-inteligencia-artificial/` (enlaza a las 3 soluciones a medida + Andorra).
- Es una matriz parcial servicio x ciudad: SEO x 6, diseño web x 4, a medida x 3, IA x 1 (solo Andorra). Cada ciudad no tiene todos los servicios; el SEO es el servicio "ancla" y el que tiene más ciudades.
- La home NO es el hub de ciudades; la home solo las enlaza desde el footer.

## 3. Enlazado interno (la clave)

Recuento de enlaces entrantes a cada URL de `/agencia-seo/<ciudad>/` en 14 plantillas medidas (home, hub, 6 ciudades SEO, 4 diseño, soluciones, IA, post):

| Origen | Cómo enlaza |
|---|---|
| Footer sitewide (en TODAS las páginas) | Las 6 ciudades SEO: "SEO en Barcelona / Madrid / Valencia / Sevilla / Bilbao / Andorra". Es el pilar del modelo. |
| Menú principal (header, mega menú) | Solo UNA: el ítem "SEO" apunta a `/agencia-seo/barcelona/` (no a `/agencia-seo/`). Ninguna otra ciudad en el menú. |
| Home (cuerpo) | Solo la card "SEO / GEO / AIO" -> Barcelona. El resto de ciudades solo en el footer. |
| Hub `/agencia-seo/` | Bloque "Agencia SEO por ciudad" con las 6, más enlaces contextuales en el cuerpo ("agencia SEO en Andorra", "posicionamiento web en Madrid", "posicionamiento SEO en el País Vasco"). 2 enlaces por ciudad. |
| Páginas hermanas (bloque "Agencia SEO en otras ciudades") | Cada ciudad SEO enlaza a las otras 5, con "SEO en X →" y además un enlace contextual en el cuerpo (a veces el nombre pelado, ej. "Valencia"). 1-2 enlaces por hermana. |
| Páginas de diseño web | Bloque "Diseño web por ciudad": solo enlazan entre sí (cada una a las otras 3). No hay enlace de diseño web desde el footer ni el menú; entra desde `/agencia-diseno-desarrollo-web/` y entre hermanas. |
| Soluciones a medida | Entran desde `/agencia-inteligencia-artificial/` y hermanas. |
| Blog | Los 4 posts muestreados NO enlazan a ninguna página de ciudad en el cuerpo (solo el post `mejores-agencias-seo-en-barcelona` -> Barcelona). No verificado en el resto de posts (no los recorrí todos). |

Cuenta aproximada de enlaces entrantes (enlaces `<a>` HTML) por ciudad SEO, ejemplo Sevilla: footer en las ~14 plantillas muestreadas, hub x2, 5 hermanas x1-2 (cuerpo y bloque) = más de 20 por página, y esa cifra sube a cientos en el sitio completo porque el footer va en las 333 URLs (en cada idioma al idioma propio). Barcelona recibe más por estar en el menú y por la card de la home. Las demás reciben casi igual.
- Footer: lista TODAS las ciudades SEO (6 de 6), no una selección. No lista las de diseño web ni las de soluciones a medida (estas dependen de enlaces sueltos y hermanas). Con 6 ciudades es viable; con 50 pueblos no lo sería.
- Migas: JSON-LD BreadcrumbList presente con 3 niveles (Inicio > Servicios > "SEO Sevilla"); el nivel 2 apunta a `/#servicios` (ancla de la home), no al hub `/agencia-seo/`. Es un punto débil de enlazado (no se verificó si hay migas visibles en HTML).
- Ninguna página de ubicación queda huérfana del sitemap; todas tienen enlace real.

## 4. Anclas

- Footer y bloque de hermanas: "SEO en {Ciudad}" (exacto de marca, corto, repetitivo).
- Cuerpo del hub y de hermanas (contextual): variadas, p. ej. "agencia SEO en Andorra", "agencia de SEO en Barcelona", "posicionamiento web en Barcelona", "posicionamiento en Google en Valencia", "posicionamiento SEO en el País Vasco", "el SEO en Madrid", o solo "Valencia".
- Menú: "SEO" (con subtítulo "Posicionamiento en Google que trae clientes"), apuntando a Barcelona.
- Diseño web: "Diseño web en {Ciudad}→".
- Patrón: ancla de pie y tarjeta = formula fija; ancla contextual = variación de keyword + ciudad. Nada de "haz clic aquí".

## 5. Anatomía

Ejemplo ciudad grande (Barcelona, `/agencia-seo/barcelona/`) y ciudad media (Sevilla); no hay página de pueblo.

- Title: "Agencia SEO Sevilla: posicionamiento con IA - Palo Seco" (patrón "Agencia SEO {Ciudad}: {gancho} - Palo Seco"; Barcelona/Bilbao usan "posicionamiento web").
- Meta description: "Agencia SEO en Sevilla desde 2013: posicionamiento web con SEO técnico, contenido e IA. Menos informes, más ventas. ¡Pide tu auditoría gratis!" (~150 car., ciudad + CTA).
- H1: "Agencia SEO en Sevilla" (exacto). Hub: "Agencia SEO".
- H2 de Sevilla (16): "Posicionamiento web para dominar el mercado andaluz."; "En Sevilla hay mucha demanda y poca competencia bien trabajada"; "Seis frentes para ganar en Sevilla"; "¿Estás hablando con otras agencias? Vaya… lo sentimos."; "El caso de éxito es nuestro objetivo"; "Qué opinan nuestros clientes"; "Aquí no llegas tarde. Llegas a tiempo."; "SEO local por barrio, no un genérico «Sevilla»."; "Menos informes, más negocio."; "10 razones para hacer SEO en Sevilla"; "No nos digas más… ¿Ya has hecho SEO en Sevilla y no te ha funcionado?"; "¿Dudas sobre SEO en Sevilla? Las resolvemos."; "Agencia SEO en otras ciudades"; "Otros servicios que lo cambian todo"; "Trabaja con un panel en vivo, no con informes."; "Habla con un experto". 38 H3.
- Longitud: 3.350-3.560 palabras en `<main>` por página SEO (Sevilla 3.467). Diseño web ~3.100, a medida 3.340, IA Andorra 2.880. Una página de servicio sin ciudad (`/agencia-seo/`) tiene 3.260; la ciudad añade poco volumen.
- Compartido vs único (comparando frases de 4+ palabras tras sustituir el nombre de ciudad por un marcador): Sevilla vs Barcelona 49% idéntico; vs Madrid 55%; Andorra vs Bilbao 57%; Sevilla vs el hub genérico 54%. Frente a las otras 5 ciudades juntas, el texto "único" de cada ciudad es 38-51% = **1.300-1.800 palabras**. Diseño web Madrid vs Valencia: 75% idéntico (~740 palabras únicas). Estimación mía (método con frases, aproximado).
- Señales locales: SÍ pero ligeras y textuales. Sevilla menciona Triana (4 veces), Nervión (4), Los Remedios (2), Casco Antiguo, Sevilla Este, polígonos, sector aeronáutico, agroalimentario, Semana Santa y Feria de Abril (5 menciones), "cuarta ciudad de España", "capital andaluza". Andorra: parroquias, trilingüe. Bilbao: "Del Casco Viejo a Getxo", industria. Madrid: distritos. No hay mapa embebido (0 iframes), ni NAP local (la dirección en el JSON-LD es siempre Carrer de Sepúlveda, 96, Barcelona; teléfono andorrano +376 633 265 en el footer), ni casos de éxito ni testimonios de esa ciudad: la sección de testimonios (4,9/5, 30 reseñas, reseñas de Google) es idéntica en todas las páginas.
- FAQ: bloque visible y JSON-LD `FAQPage` (Sevilla: 3,5 KB de respuestas, preguntas localizadas, p. ej. "¿Trabajáis el SEO por barrios o para toda Sevilla?"; "¿Es más fácil posicionar en Sevilla que en Madrid o Barcelona?"). Las FAQ sí son específicas de ciudad.
- JSON-LD (4 tipos, iguales en todas las páginas de ubicación): `ProfessionalService` (@id `#org`, `areaServed: "ES"`, dirección Barcelona, priceRange "Desde 1.000€/mes"), `Service` (`areaServed: {City, Sevilla}`), `BreadcrumbList`, `FAQPage`. No hay `LocalBusiness` por ciudad ni `Place`.
- Canonical autorreferente; hreflang es/ca/en/x-default, con slugs EN distintos. Sin meta robots.
- Imágenes: 40 por página (idénticas, plantilla), 3 sin alt. Sin imágenes de la ciudad.
- Imagen/hero y bloques: tarjeta "Seis frentes" (6 sub-servicios), prueba social, 10 razones, CTA a briefing, panel en vivo. Es una página de servicio completa con inserciones de ciudad.

## 6. Riesgo doorway

- Señales de riesgo: estructura H2 y H3 idéntica (38 H3 iguales en todas las ciudades); testimonios, imágenes y datos de empresa idénticos; las ciudades secundarias (Sevilla, Bilbao) comparten 49-57% del texto; diseño web hasta 75%; NAP siempre Barcelona (no hay presencia local real en Sevilla, Madrid, Valencia, Bilbao).
- Mitigaciones que sí usan: 1.300-1.800 palabras únicas por ciudad (muy por encima de una página fina); ángulo comercial distinto por ciudad (Madrid = competitivo, Sevilla/Valencia = poca competencia, Bilbao = industria B2B, Andorra = multi-idioma y parroquias, Barcelona = IA); H2 que se reescriben según el mercado; FAQ localizadas; mención de barrios y estacionalidad real (Feria, Semana Santa); canonical propio por página; pocas páginas (6), no cientos; ninguna página fina.
- Valoración: riesgo bajo-medio para SEO; el riesgo mayor está en diseño web (75% compartido) y en que no hay evidencia local propia (caso, foto, dato, dirección).

## 7. Esfuerzo (proxy)

Unas 1.300-1.800 palabras únicas por página SEO de ciudad; unas 750-1.000 por página de diseño web; más una plantilla común de ~1.700 palabras y 38 H3. Total del sitio en ubicación: 14 páginas ES x ~1.200 palabras únicas ≈ 17.000 palabras, x3 idiomas (traducidas). Es esfuerzo alto por página, con pocas páginas.

## Qué copiar, mejorar y evitar para Nuria (Sevilla)

Copiar
- Enlazado en footer sitewide a TODAS las ubicaciones (con "SEO en X"): garantiza que ninguna es huérfana y reparte autoridad. Funciona con pocas; para muchas, usar un bloque agrupado (por comarca) en el footer o solo las principales.
- Hub de servicio con bloque "por ciudad" y bloque "otras ciudades" cruzado en cada página hermana: enlaces hermanos ayudan a descubrir y a repartir.
- Ancla corta y exacta ("SEO en Sevilla") en pie y tarjetas, y anclas variadas en cuerpo.
- FAQ localizadas con JSON-LD `FAQPage`, `Service` con `areaServed` y `BreadcrumbList`, canonical autorreferente.
- Ángulo del mercado distinto por ciudad en H2 y apertura (competencia, sectores, estacionalidad).

Mejorar
- Añadir lo que ellos no tienen: datos locales verificables (barrio real, calle, cliente local, caso, foto propia, mapa o dirección del municipio), testimonios del propio municipio.
- Un H2 y migas hacia el hub real (`/seo-local/` o `/municipios/`), no a un ancla de la home. Su breadcrumb nivel 2 es `/#servicios`.
- Schema `LocalBusiness` con `areaServed` `City` o `AdministrativeArea` para cada municipio, y la ciudad base (Sevilla) como dirección real.
- Para pueblos: páginas más cortas pero con datos únicos reales (población, sectores, hitos del pueblo) en vez de 3.500 palabras de plantilla; una página por municipio solo si hay algo único que decir.
- Barrios: un bloque dentro de la página de ciudad o páginas propias si hay demanda de búsqueda (Triana, Nervión...), que Palo Seco no hace.
- Footer escalable: agrupar por comarca (Aljarafe, Vega, Sevilla ciudad) para no listar 50 enlaces.

Evitar
- Copiar su plantilla (38 H3 idénticos, testimonios y 40 imágenes repetidos, 49-75% de texto compartido) en muchas páginas: con decenas de pueblos el porcentaje de texto compartido hace que parezcan doorway.
- NAP o dirección que no es de la zona de la página (ellos: Barcelona en todas); Google puede ignorar la señal local.
- Mandar el menú principal a una sola ciudad (su "SEO" -> Barcelona): refuerza una ciudad y confunde el hub.
- Prometer "seguimos sumando" sin páginas reales.

## No verificado

- Posiciones reales, tráfico o si Google indexa cada página (no consulté GSC ni SERP).
- Si las migas son visibles en HTML (solo verifiqué el JSON-LD).
- Blog completo: solo 4 posts muestreados para enlaces a ciudades.
- Las páginas `/ca/` y `/en/` (no se descargaron; se asume plantilla traducida por hreflang y sitemap).
- Recuento exacto de enlaces entrantes en las 333 URLs: la cifra por ciudad es una estimación de plantillas, no un crawl completo.
- El % de texto compartido es una estimación por coincidencia de frases tras sustituir el nombre de ciudad; puede subestimar paráfrasis.
