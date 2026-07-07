// Constructores de JSON-LD (schema.org). Cada página inyecta los suyos
// con <Schema slot="head" schema={...} />; el de negocio va global en Layout.
import { SITE } from "@/data/site"

const BUSINESS_ID = `${SITE.url}/#business`
const PERSON_ID = `${SITE.url}/#person`

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": BUSINESS_ID,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    image: `${SITE.url}${SITE.defaultOgImage}`,
    telephone: `+${SITE.whatsapp}`,
    email: SITE.email,
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.lat,
      longitude: SITE.geo.lng,
    },
    areaServed: {
      "@type": "City",
      name: "Sevilla",
    },
    sameAs: [...SITE.sameAs],
    founder: { "@id": PERSON_ID },
  }
}

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Nuria Romero Castillo",
    url: `${SITE.url}/sobre-mi`,
    jobTitle: "Desarrolladora web freelance",
    worksFor: { "@id": BUSINESS_ID },
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.address.locality,
      addressCountry: SITE.address.country,
    },
    knowsAbout: [
      "Diseño y desarrollo web",
      "SEO local",
      "Desarrollo de software a medida",
      "Automatización de procesos con n8n y Make",
      "Inteligencia artificial aplicada a negocios",
      "Angular",
      "React",
      "WordPress",
    ],
    sameAs: [...SITE.sameAs],
  }
}

export function serviceSchema(service: {
  name: string
  description: string
  url: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: new URL(service.url, SITE.url).href,
    provider: { "@id": BUSINESS_ID },
    areaServed: {
      "@type": "City",
      name: "Sevilla",
    },
  }
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  }
}

export function articleSchema(post: {
  title: string
  description: string
  url: string
  pubDate: Date
  updatedDate?: Date
  image?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    url: new URL(post.url, SITE.url).href,
    image: new URL(post.image ?? SITE.defaultOgImage, SITE.url).href,
    datePublished: post.pubDate.toISOString(),
    dateModified: (post.updatedDate ?? post.pubDate).toISOString(),
    author: { "@id": PERSON_ID },
    publisher: { "@id": BUSINESS_ID },
    inLanguage: "es",
  }
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: new URL(item.url, SITE.url).href,
    })),
  }
}
