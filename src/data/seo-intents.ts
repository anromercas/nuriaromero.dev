export interface SeoIntentRow {
  url: string
  intent: string
  topic: string
  cta: string
  titleSignal: string
  descriptionSignal: string
  h1Signal: string
  contentSignals: string[]
}

// Editorial guardrail: these rows define the role each potentially overlapping URL owns.
// Rankings are intentionally not part of this matrix; SEO-14 will validate queries in GSC.
export const intentMatrix: SeoIntentRow[] = [
  {
    url: "/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/",
    intent: "Informational: understand GEO and apply a four-step checklist",
    topic: "qué es el GEO para negocios en Sevilla",
    cta: "Read the service when technical implementation is needed",
    titleSignal: "Qué es el GEO",
    descriptionSignal: "Guía práctica",
    h1Signal: "Qué es el GEO",
    contentSignals: ["Qué cuatro cosas puedes hacer ya", "Prefieres que te lo monte alguien"],
  },
  {
    url: "/seo-local-sevilla/",
    intent: "Commercial: hire an SEO local and GEO implementation service",
    topic: "servicio de SEO local y GEO en Sevilla",
    cta: "Request a proposal",
    titleSignal: "SEO local en Sevilla",
    descriptionSignal: "Proyecto inicial 299 €",
    h1Signal: "SEO local en Sevilla para negocios",
    contentSignals: ["Así es el proceso de trabajar tu SEO local", "Cuánto cuesta el SEO local en Sevilla"],
  },
  {
    url: "/seo-para-clinicas-capilares-sevilla/",
    intent: "Commercial: contract local SEO and conversion foundations for a hair-transplant clinic",
    topic: "SEO para clínicas capilares en Sevilla",
    cta: "Request the CAPILAR LOCAL initial project",
    titleSignal: "SEO para clínicas capilares en Sevilla",
    descriptionSignal: "CAPILAR LOCAL 299 € + IVA",
    h1Signal: "CAPILAR LOCAL",
    contentSignals: ["Visibilidad, confianza y contacto", "Proyecto inicial de alcance cerrado"],
  },
  {
    url: "/blog/cuanto-cuesta-una-pagina-web-en-sevilla/",
    intent: "Informational: compare web project budget variables",
    topic: "cuánto cuesta una página web y qué revisar",
    cta: "Use the checklist and ask for a project assessment",
    titleSignal: "¿Cuánto cuesta una página web",
    descriptionSignal: "Qué factores influyen en el precio",
    h1Signal: "¿Cuánto cuesta una página web",
    contentSignals: ["Qué debo revisar en una propuesta económica", "Qué preguntas debo hacer antes de contratar"],
  },
  {
    url: "/diseno-web-sevilla/",
    intent: "Commercial: contract design and development for a local business website",
    topic: "diseño web para negocios locales en Sevilla",
    cta: "Request a fixed-price web proposal",
    titleSignal: "Diseño web en Sevilla",
    descriptionSignal: "Diseño páginas web en Sevilla",
    h1Signal: "Diseño web en Sevilla para negocios",
    contentSignals: ["Así es el proceso de crear tu página web", "Preguntas frecuentes sobre diseño web en Sevilla"],
  },
  {
    url: "/web-para-comercios-sevilla/",
    intent: "Commercial: local catalogue and shop presence for a physical retailer",
    topic: "web para comercios de barrio en Sevilla",
    cta: "Request a commerce website proposal",
    titleSignal: "Página web para comercios",
    descriptionSignal: "Webs y tiendas online para comercios",
    h1Signal: "Página web para comercios y tiendas",
    contentSignals: ["Catálogo de productos", "Web de catálogo o tienda online completa"],
  },
  {
    url: "/tienda-online-sevilla/",
    intent: "Transactional: build an ecommerce with checkout, products and stock",
    topic: "tienda online con pasarela de pago en Sevilla",
    cta: "Request an ecommerce scope and quote",
    titleSignal: "Tienda online en Sevilla",
    descriptionSignal: "pasarela de pago propia",
    h1Signal: "Tienda online en Sevilla para negocios",
    contentSignals: ["Así es el proceso de crear tu tienda online", "Pasarela de pago integrada y probada"],
  },
]

export const nicheRoutes = [
  "/web-para-restaurantes-sevilla/",
  "/web-para-clinicas-sevilla/",
  "/web-para-comercios-sevilla/",
  "/web-para-abogados-gestorias-sevilla/",
]

// Service routes rendered from src/data/services.ts. Used to catch near-duplicate
// FAQ questions between a niche page and a service page (e.g. comercios vs.
// tienda-online-sevilla), not just niche-vs-niche.
export const serviceRoutes = [
  "/diseno-web-sevilla/",
  "/desarrollo-software-medida/",
  "/automatizaciones/",
  "/inteligencia-artificial/",
  "/seo-local-sevilla/",
  "/seo-para-clinicas-capilares-sevilla/",
  "/tienda-online-sevilla/",
]

export const reciprocalLinks = [
  {
    source: "/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/",
    target: "/seo-local-sevilla/",
    sourceAnchor: "servicio de SEO local y GEO en Sevilla",
    targetAnchor: "guía sobre SEO local y GEO",
  },
  {
    source: "/blog/cuanto-cuesta-una-pagina-web-en-sevilla/",
    target: "/diseno-web-sevilla/",
    sourceAnchor: "servicio de diseño web y su alcance",
    targetAnchor: "guía para entender el precio de una web",
  },
  // Commercial-to-commercial bridge (SEO-21): the avatar doesn't know upfront
  // whether they need a catalogue page or full checkout, so both adjacent
  // commercial pages carry an explicit in-content pointer to the other.
  {
    source: "/tienda-online-sevilla/",
    target: "/web-para-comercios-sevilla/",
    sourceAnchor: "web para comercios",
    targetAnchor: "tienda online en Sevilla",
  },
]
