// Constructores de JSON-LD (schema.org). Cada página inyecta los suyos
// con <Schema slot="head" schema={...} />; el de negocio va global en Layout.
import { SITE } from "@/data/site"
import { localTrust } from "@/data/local-trust"
import type { GoogleReviewsData } from "@/lib/google-reviews"

const BUSINESS_ID = `${SITE.url}/#business`
const PERSON_ID = `${SITE.url}/#person`
const WEBSITE_ID = `${SITE.url}/#website`
const SERVICE_AREA = [
  { "@type": "City", name: "Sevilla" },
  { "@type": "AdministrativeArea", name: "Área metropolitana de Sevilla" },
]

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "Organization"],
    "@id": BUSINESS_ID,
    name: SITE.name,
    alternateName: SITE.shortName,
    url: SITE.url,
    description: SITE.description,
    image: `${SITE.url}${SITE.defaultOgImage}`,
    logo: `${SITE.url}${SITE.logo}`,
    telephone: `+${SITE.whatsapp}`,
    email: SITE.email,
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      postalCode: SITE.address.postalCode,
      addressLocality: SITE.address.municipality,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    areaServed: SERVICE_AREA,
    sameAs: [...SITE.sameAs],
    founder: { "@id": PERSON_ID },
    ...(localTrust.gbp.status === "verified" && localTrust.gbp.profileUrl
      ? { hasMap: SITE.mapsUrl }
      : {}),
  }
}

// Reseñas reales de Google Business Profile (ver src/lib/google-reviews.ts).
// Referencia BUSINESS_ID por @id para que, dentro del mismo @graph, Google
// asocie este aggregateRating/review con la entidad LocalBusiness/Organization
// ya declarada en localBusinessSchema(). Solo se llama cuando
// getGoogleReviews() devolvió datos reales — nunca con reseñas inventadas.
export function reviewsSchema(data: GoogleReviewsData) {
  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "Organization"],
    "@id": BUSINESS_ID,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: data.rating,
      reviewCount: data.userRatingCount,
      bestRating: 5,
      worstRating: 1,
    },
    review: data.reviews.map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.author },
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: review.text,
    })),
  }
}

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: SITE.name,
    alternateName: "Nuria Romero Castillo",
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
      "Astro",
      "Next.js",
    ],
    sameAs: [...SITE.sameAs],
  }
}

export function serviceSchema(service: {
  name: string
  description: string
  url: string
  serviceType: string
  // Precio de salida tal cual se muestra en la página (p. ej. "399 €"),
  // definido en src/data/services.ts o src/data/niches.ts.
  price: string
}) {
  const priceValue = service.price.replace(/[^\d,.]/g, "").replace(",", ".")
  const serviceUrl = new URL(service.url, SITE.url).href

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: serviceUrl,
    serviceType: service.serviceType,
    provider: { "@id": BUSINESS_ID },
    areaServed: SERVICE_AREA,
    offers: {
      "@type": "Offer",
      url: serviceUrl,
      price: priceValue,
      priceCurrency: "EUR",
    },
  }
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE.url,
    name: SITE.name,
    publisher: { "@id": BUSINESS_ID },
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
        // Answers may use \n\n paragraph breaks for visual scannability
        // (SEO-20, see FAQ.astro's splitAnswer). Collapse that whitespace
        // convention here so structured-data text stays clean, continuous
        // prose instead of leaking literal newlines (SEO-20 follow-up).
        text: faq.a.replace(/\s+/g, " ").trim(),
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
