export interface ServicePageData {
  slug: string
  breadcrumbName: string
  seo: {
    title: string
    description: string
  }
  hero: {
    h1: string
    // Titular grande editorial opcional (la portada a medida lo pinta como <p>,
    // con h1 como encabezado pequeño con la palabra clave) y fragmento a resaltar.
    title?: string
    titleAccent?: string
    subtitle: string
    primaryCtaLabel?: string
    secondaryCta?: {
      label: string
      href: string
    }
  }
  benefits: {
    title: string
    text: string
  }[]
  process: {
    title: string
    text: string
  }[]
  // Opt-in: emite una Offer por plan (UnitPriceSpecification mensual) en el JSON-LD
  // del Service. Sin esta marca, el JSON-LD sigue con una única Offer.
  offersFromTiers?: boolean
  pricing: {
    from: string
    includes?: string[]
    note?: string
    // Bloque independiente que se muestra ENCIMA del grid de `tiers`
    // (p. ej. un proyecto inicial de pago único, separado del recurrente).
    // Opcional y retrocompatible: si no se define, el comportamiento de
    // `tiers` no cambia respecto a las páginas de servicio existentes.
    initial?: {
      from: string
      includes?: string[]
      note?: string
      ctaLabel?: string
    }
    tiers?: {
      name: string
      from: string
      includes: string[]
      note?: string
      ctaLabel?: string
      recommended?: boolean
    }[]
  }
  faqs: {
    q: string
    a: string
  }[]
  cta?: {
    title: string
    text: string
    buttonLabel?: string
  }
  sectionTitles?: {
    benefits?: string
    process?: string
    pricing?: string
    faq?: string
  }
}
