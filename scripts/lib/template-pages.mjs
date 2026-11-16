// Pages composed from the template section components (NRD-163). Each page
// story appends its entry; scripts/check-seo-17.mjs asserts the contract on
// dist/<route>/index.html for every entry.
//   route:   pathname with trailing slash
//   service: the page must emit a Service entity in JSON-LD
//   words:   optional [min, max] visible word range of <main>, without elements marked
//            data-word-budget="exclude" (the live Google review quote of RealProof):
//            owner-controlled text only (ADR 0015)
export const templatePages = [
  { route: "/seo-local-sevilla/", service: true },
  { route: "/", words: [900, 1100], service: false },
  { route: "/diseno-web-sevilla/", words: [1000, 1200], service: true },
  { route: "/contacto/", words: [150, 450], service: false },
  { route: "/tienda-online-sevilla/", words: [900, 1100], service: true },
  { route: "/automatizaciones/", words: [700, 800], service: true },
  { route: "/desarrollo-software-medida/", words: [750, 850], service: true },
  { route: "/inteligencia-artificial/", words: [750, 850], service: true },
  { route: "/sobre-mi/", words: [550, 600], service: false },
  { route: "/portfolio/", words: [100, 250], service: false },
  { route: "/recursos/", words: [100, 250], service: false },
  { route: "/blog/", words: [150, 350], service: false },
];
