export interface ServicePageData {
  slug: string
  breadcrumbName: string
  seo: {
    title: string
    description: string
  }
  hero: {
    h1: string
    subtitle: string
  }
  benefits: {
    title: string
    text: string
  }[]
  process: {
    title: string
    text: string
  }[]
  pricing: {
    from: string
    includes: string[]
    note?: string
  }
  faqs: {
    q: string
    a: string
  }[]
  cta?: {
    title: string
    text: string
  }
}
