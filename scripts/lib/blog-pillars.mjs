// Content pillars of the blog and the ordered rules that map a topic to one.
// Owner decision 2026-11-21 (NRD-350). Terms are normalised (lowercase, no accents).
import { normaliseTerm } from "./keyword-ownership.mjs";

export const PILLARS = [
  { id: "seo", label: "SEO local y GEO" },
  { id: "web", label: "Diseño web y tiendas online" },
  { id: "ia", label: "Inteligencia artificial" },
  { id: "servicios", label: "Software a medida y automatizaciones" },
];

// Ordered, first match wins. "web" is broad, so it stays last.
export const PILLAR_RULES = [
  {
    pillar: "seo",
    target: "/seo-para-ia/",
    terms: [
      "geo",
      "aeo",
      "chatgpt",
      "gemini",
      "perplexity",
      "copilot",
      "ai overview",
      "ai overviews",
      "seo para ia",
      "posicionamiento en ia",
      "respuestas de ia",
      "buscadores de ia",
    ],
  },
  {
    pillar: "seo",
    target: "/seo-local-sevilla/",
    terms: [
      "seo",
      "posicionamiento",
      "posicionar",
      "google maps",
      "ficha de google",
      "perfil de empresa",
      "google business",
      "resenas",
      "buscador",
      "buscadores",
    ],
  },
  {
    pillar: "web",
    target: "/tienda-online-sevilla/",
    terms: [
      "tienda online",
      "tiendas online",
      "ecommerce",
      "comercio electronico",
      "woocommerce",
      "shopify",
      "vender por internet",
      "vender online",
    ],
  },
  {
    pillar: "servicios",
    target: "/automatizaciones/",
    terms: [
      "automatizar",
      "automatizacion",
      "automatizaciones",
      "automatico",
      "flujos de trabajo",
      "n8n",
      "zapier",
    ],
  },
  {
    pillar: "servicios",
    target: "/desarrollo-software-medida/",
    terms: [
      "software a medida",
      "aplicacion a medida",
      "aplicacion web",
      "aplicaciones web",
      "app a medida",
      "crm",
      "erp",
      "programa a medida",
    ],
  },
  {
    pillar: "ia",
    target: "/inteligencia-artificial/",
    terms: [
      "inteligencia artificial",
      "ia",
      "chatbot",
      "chatbots",
      "asistente virtual",
      "agente de ia",
      "agentes de ia",
    ],
  },
  {
    pillar: "web",
    target: "/diseno-web-sevilla/",
    terms: [
      "pagina web",
      "paginas web",
      "web",
      "sitio web",
      "diseno web",
      "dominio",
      "hosting",
      "landing",
    ],
  },
];

export function classifyTopic(text) {
  const padded = ` ${normaliseTerm(text)} `;
  for (const rule of PILLAR_RULES) {
    if (rule.terms.some((term) => padded.includes(` ${term} `)))
      return { pillar: rule.pillar, target: rule.target };
  }
  return null;
}
