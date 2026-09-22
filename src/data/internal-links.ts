export type InternalLinkKind = "contextual" | "conversion"

export interface InternalLink {
  path: string
  anchor: string
  kind: InternalLinkKind
}

export const internalLinksBySource: Record<string, InternalLink[]> = {
  "/": [
    { path: "/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/", anchor: "qué son el SEO local y el GEO", kind: "contextual" },
    { path: "/blog/como-aparecer-en-google-maps-negocio-sevilla/", anchor: "guía para aparecer en Google Maps", kind: "contextual" },
    { path: "/blog/cuanto-cuesta-una-pagina-web-en-sevilla/", anchor: "cómo calcular el precio de una web", kind: "contextual" },
  ],
  "/diseno-web-sevilla/": [
    { path: "/seo-local-sevilla/", anchor: "SEO local y GEO para tu negocio", kind: "contextual" },
    { path: "/tienda-online-sevilla/", anchor: "tienda online para vender tus productos", kind: "contextual" },
    { path: "/web-para-restaurantes-sevilla/", anchor: "web para restaurantes en Sevilla", kind: "contextual" },
    { path: "/web-para-clinicas-sevilla/", anchor: "web para clínicas y consultas", kind: "contextual" },
    { path: "/web-para-comercios-sevilla/", anchor: "web para comercios y tiendas", kind: "contextual" },
    { path: "/web-para-abogados-gestorias-sevilla/", anchor: "web para despachos y gestorías", kind: "contextual" },
    { path: "/blog/cuanto-cuesta-una-pagina-web-en-sevilla/", anchor: "guía para entender el precio de una web", kind: "contextual" },
    { path: "/contacto", anchor: "cuéntame qué web necesitas", kind: "conversion" },
  ],
  "/desarrollo-software-medida/": [
    { path: "/automatizaciones/", anchor: "automatizaciones para las tareas repetitivas", kind: "contextual" },
    { path: "/inteligencia-artificial/", anchor: "soluciones con inteligencia artificial", kind: "contextual" },
    { path: "/contacto", anchor: "cuéntame qué proceso quieres mejorar", kind: "conversion" },
  ],
  "/automatizaciones/": [
    { path: "/desarrollo-software-medida/", anchor: "software a medida para procesos más complejos", kind: "contextual" },
    { path: "/inteligencia-artificial/", anchor: "chatbots y soluciones con IA", kind: "contextual" },
    { path: "/contacto", anchor: "cuéntame qué tarea quieres automatizar", kind: "conversion" },
  ],
  "/inteligencia-artificial/": [
    { path: "/automatizaciones/", anchor: "automatizaciones conectadas con tu negocio", kind: "contextual" },
    { path: "/seo-local-sevilla/", anchor: "SEO local y GEO en Sevilla", kind: "contextual" },
    { path: "/contacto", anchor: "cuéntame qué solución de IA necesitas", kind: "conversion" },
  ],
  "/seo-local-sevilla/": [
    { path: "/diseno-web-sevilla/", anchor: "diseño web preparado para SEO local", kind: "contextual" },
    { path: "/web-para-restaurantes-sevilla/", anchor: "SEO local para restaurantes en Sevilla", kind: "contextual" },
    { path: "/web-para-clinicas-sevilla/", anchor: "SEO local para clínicas en Sevilla", kind: "contextual" },
    { path: "/web-para-comercios-sevilla/", anchor: "SEO local para comercios en Sevilla", kind: "contextual" },
    { path: "/web-para-abogados-gestorias-sevilla/", anchor: "SEO local para despachos y gestorías", kind: "contextual" },
    { path: "/blog/como-aparecer-en-google-maps-negocio-sevilla/", anchor: "guía para mejorar tu ficha de Google Maps", kind: "contextual" },
    { path: "/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/", anchor: "guía sobre SEO local y GEO", kind: "contextual" },
    { path: "/contacto", anchor: "cuéntame cómo aparece hoy tu negocio", kind: "conversion" },
  ],
  "/tienda-online-sevilla/": [
    { path: "/web-para-comercios-sevilla/", anchor: "web para comercios que también quieren vender online", kind: "contextual" },
    { path: "/diseno-web-sevilla/", anchor: "diseño web para empezar con una presencia local", kind: "contextual" },
    { path: "/seo-local-sevilla/", anchor: "SEO local para atraer clientes de tu zona", kind: "contextual" },
    { path: "/contacto", anchor: "cuéntame qué quieres vender online", kind: "conversion" },
  ],
  "/web-para-restaurantes-sevilla/": [
    { path: "/diseno-web-sevilla/", anchor: "diseño web para negocios locales", kind: "contextual" },
    { path: "/seo-local-sevilla/", anchor: "SEO local para restaurantes en Sevilla", kind: "contextual" },
    { path: "/tienda-online-sevilla/", anchor: "tienda online si también vendes productos", kind: "contextual" },
    { path: "/blog/pagina-web-para-restaurantes-que-necesita/", anchor: "guía sobre lo que necesita una web de restaurante", kind: "contextual" },
  ],
  "/web-para-clinicas-sevilla/": [
    { path: "/diseno-web-sevilla/", anchor: "diseño web para clínicas y consultas", kind: "contextual" },
    { path: "/seo-local-sevilla/", anchor: "SEO local para que encuentren tu clínica", kind: "contextual" },
    { path: "/contacto", anchor: "cuéntame qué necesita tu consulta", kind: "conversion" },
  ],
  "/web-para-comercios-sevilla/": [
    { path: "/tienda-online-sevilla/", anchor: "tienda online para tu comercio", kind: "contextual" },
    { path: "/diseno-web-sevilla/", anchor: "diseño web para mostrar tu catálogo", kind: "contextual" },
    { path: "/seo-local-sevilla/", anchor: "SEO local para atraer clientes del barrio", kind: "contextual" },
  ],
  "/web-para-abogados-gestorias-sevilla/": [
    { path: "/diseno-web-sevilla/", anchor: "diseño web para despachos profesionales", kind: "contextual" },
    { path: "/seo-local-sevilla/", anchor: "SEO local para profesionales en Sevilla", kind: "contextual" },
    { path: "/contacto", anchor: "cuéntame qué necesita tu despacho", kind: "conversion" },
  ],
  "/blog/como-aparecer-en-google-maps-negocio-sevilla/": [
    { path: "/seo-local-sevilla/", anchor: "servicio de SEO local y GEO", kind: "contextual" },
    { path: "/diseno-web-sevilla/", anchor: "web preparada para conectar con Google Maps", kind: "contextual" },
    { path: "/contacto", anchor: "cuéntame cómo está tu ficha", kind: "conversion" },
  ],
  "/blog/cuanto-cuesta-una-pagina-web-en-sevilla/": [
    { path: "/diseno-web-sevilla/", anchor: "servicio de diseño web y su alcance", kind: "contextual" },
    { path: "/tienda-online-sevilla/", anchor: "presupuesto de una tienda online", kind: "contextual" },
    { path: "/contacto", anchor: "escríbeme con los detalles de tu proyecto", kind: "conversion" },
  ],
  "/blog/pagina-web-para-restaurantes-que-necesita/": [
    { path: "/web-para-restaurantes-sevilla/", anchor: "web para restaurantes en Sevilla", kind: "contextual" },
    { path: "/seo-local-sevilla/", anchor: "SEO local para tu zona", kind: "contextual" },
    { path: "/tienda-online-sevilla/", anchor: "tienda online si también vendes productos", kind: "contextual" },
    { path: "/contacto", anchor: "cuéntame qué necesita tu restaurante", kind: "conversion" },
  ],
  "/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/": [
    { path: "/seo-local-sevilla/", anchor: "servicio de SEO local y GEO en Sevilla", kind: "contextual" },
    { path: "/diseno-web-sevilla/", anchor: "web propia bien construida", kind: "contextual" },
    { path: "/blog/como-aparecer-en-google-maps-negocio-sevilla/", anchor: "guía para aparecer en Google Maps", kind: "contextual" },
    { path: "/contacto", anchor: "cuéntame qué necesita tu negocio", kind: "conversion" },
  ],
}
