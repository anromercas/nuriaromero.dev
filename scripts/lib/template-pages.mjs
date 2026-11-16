// Pages composed from the template section components (NRD-163). Each page
// story appends its entry; scripts/check-seo-17.mjs asserts the contract on
// dist/<route>/index.html for every entry.
//   route:   pathname with trailing slash
//   service: the page must emit a Service entity in JSON-LD
//   words:   optional [min, max] visible word range of <main>
export const templatePages = [{ route: "/seo-local-sevilla/", service: true }];
