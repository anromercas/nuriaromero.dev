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
  pricing: {
    from: string
    includes?: string[]
    note?: string
    tiers?: {
      name: string
      from: string
      includes: string[]
      note?: string
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
  }
  sectionTitles?: {
    benefits?: string
    process?: string
    pricing?: string
    faq?: string
  }
}
