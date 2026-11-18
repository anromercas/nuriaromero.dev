// Pages composed from the template section components (NRD-163). Each page
// story appends its entry; scripts/check-seo-17.mjs asserts the contract on
// dist/<route>/index.html for every entry.
//   route:   pathname with trailing slash
//   keySections: optional heading ids of the key sections (what it is, who/which option,
//            price, how I work, FAQ); each must open with a 15-45 word, 1-2 sentence direct
//            answer (NRD-245)
//   service: the page must emit a Service entity in JSON-LD
//   words:   optional [min, max] visible word range of <main>, without elements marked
//            data-word-budget="exclude" (the live Google review quote of RealProof):
//            owner-controlled text only (ADR 0015)
//   termCaps: optional { [term]: max }: visible <main> words (same exclusions as words)
//            containing the term, case and accent insensitive, must not exceed max
export const templatePages = [
  {
    route: "/seo-local-sevilla/",
    service: true,
    keySections: [
      "revision-title",
      "agencia-title",
      "planes-title",
      "proceso-title",
      "faq-title",
    ],
  },
  {
    route: "/",
    words: [900, 1100],
    termCaps: { sevilla: 14 },
    service: false,
    keySections: [
      "que-hago-title",
      "consultor-title",
      "proceso-title",
      "faq-title",
    ],
  },
  {
    route: "/diseno-web-sevilla/",
    words: [1000, 1200],
    service: true,
    keySections: [
      "que-incluye-title",
      "freelance-title",
      "planes-title",
      "proceso-title",
      "faq-title",
    ],
  },
  { route: "/contacto/", words: [150, 450], service: false },
  {
    route: "/tienda-online-sevilla/",
    words: [900, 1100],
    service: true,
    keySections: [
      "que-incluye-title",
      "plataforma-title",
      "planes-title",
      "proceso-title",
      "faq-title",
    ],
  },
  {
    route: "/automatizaciones/",
    words: [700, 800],
    service: true,
    keySections: [
      "ejemplos-title",
      "que-automatizar-primero-title",
      "planes-title",
      "proceso-title",
      "faq-title",
    ],
  },
  {
    route: "/desarrollo-software-medida/",
    words: [750, 850],
    service: true,
    keySections: [
      "que-se-puede-hacer-title",
      "medida-title",
      "planes-title",
      "proceso-title",
      "faq-title",
    ],
  },
  {
    route: "/inteligencia-artificial/",
    words: [750, 850],
    service: true,
    keySections: [
      "que-puede-hacer-title",
      "ia-o-chatgpt-title",
      "planes-title",
      "proceso-title",
      "faq-title",
    ],
  },
  {
    route: "/seo-para-ia/",
    words: [750, 850],
    service: true,
    keySections: [
      "que-trabajo-title",
      "planes-title",
      "proceso-title",
      "faq-title",
    ],
  },
  { route: "/sobre-mi/", words: [550, 600], service: false },
  { route: "/portfolio/", words: [100, 250], service: false },
  { route: "/recursos/", words: [100, 250], service: false },
  { route: "/blog/", words: [150, 350], service: false },
];
