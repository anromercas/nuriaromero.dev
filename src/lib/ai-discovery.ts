// Pure builders for the AI discovery files (/.well-known/ai.txt, /ai/summary.json,
// /ai/faq.json). No imports from astro:* so node --test can load it (ADR 0018).
// Everything is read from src/data; there are no build dates (ADR 0017).
import type { ServicePageData } from "@/data/types";
import { CRAWLER_POLICY } from "../data/crawler-policy.ts";
import { contactFaqs, homeFaqs } from "../data/page-faqs.ts";
import { niches } from "../data/niches.ts";
import { services } from "../data/services.ts";
import { SERVICE_AREA, SITE } from "../data/site.ts";
import { faqAnswerText } from "./schema.ts";

type FaqEntry = ServicePageData["faqs"][number];

const abs = (path: string) => new URL(path, SITE.url).href;

/** Every page that publishes a FAQPage, in a stable order. */
export function faqPages(): { url: string; faqs: FaqEntry[] }[] {
  return [
    { url: "/", faqs: homeFaqs },
    { url: "/contacto/", faqs: contactFaqs },
    ...services.map((page) => ({ url: page.slug, faqs: page.faqs })),
    ...niches.map((page) => ({ url: page.slug, faqs: page.faqs })),
  ];
}

export function buildAiFaq() {
  return {
    site: SITE.url,
    inLanguage: "es" as const,
    pages: faqPages().map(({ url, faqs }) => ({
      url: abs(url),
      questions: faqs.map((faq) => ({
        question: faq.q,
        answer: faqAnswerText(faq.a),
      })),
    })),
  };
}

export function buildAiSummary() {
  return {
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    logo: `${SITE.url}${SITE.logo}`,
    contact: { email: SITE.email, telephone: `+${SITE.whatsapp}` },
    address: {
      streetAddress: SITE.address.street,
      postalCode: SITE.address.postalCode,
      addressLocality: SITE.address.municipality,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    areaServed: SERVICE_AREA.map((area) => area.name),
    sameAs: [...SITE.sameAs],
    services: services.map((service) => ({
      name: service.breadcrumbName,
      url: abs(service.slug),
      description: service.seo.description,
      ...(service.ownOffer !== false
        ? { priceFrom: service.pricing.from }
        : {}),
      ...(service.pricing.tiers
        ? {
            plans: service.pricing.tiers.map(({ name, from }) => ({
              name,
              from,
            })),
          }
        : {}),
    })),
    sectors: niches.map((niche) => ({
      name: niche.breadcrumbName,
      url: abs(niche.slug),
      priceFrom: niche.pricing.from,
    })),
    resources: {
      llmsTxt: `${SITE.url}/llms.txt`,
      aiTxt: `${SITE.url}/.well-known/ai.txt`,
      faq: `${SITE.url}/ai/faq.json`,
      sitemap: `${SITE.url}/sitemap-index.xml`,
    },
  };
}

const toList = (value: string | string[] | undefined): string[] =>
  value === undefined ? [] : [value].flat();

export function buildAiTxt(): string {
  const groups = CRAWLER_POLICY.map((rule) =>
    [
      `User-agent: ${rule.userAgent}`,
      ...toList(rule.allow).map((path) => `Allow: ${path}`),
      ...toList(rule.disallow).map((path) => `Disallow: ${path}`),
    ].join("\n"),
  );
  return [
    `# ai.txt de ${SITE.shortName}`,
    "# Generado en el build a partir de los datos del sitio. Las reglas coinciden con /robots.txt.",
    "",
    groups.join("\n\n"),
    "",
    "# Recursos",
    `LLMs-Txt: ${SITE.url}/llms.txt`,
    `AI-Summary: ${SITE.url}/ai/summary.json`,
    `AI-FAQ: ${SITE.url}/ai/faq.json`,
    `Sitemap: ${SITE.url}/sitemap-index.xml`,
    "",
  ].join("\n");
}
