import { readFile } from "node:fs/promises"

// SEO-10: the local SEO page may publish the verified NAP and the verified
// Google Business Profile / Maps link, but must never invent social proof.
// The source of truth for "verified" is src/data/local-trust.ts + site.ts.
const root = new URL("../", import.meta.url)
const { localTrust } = await import(new URL("src/data/local-trust.ts", root))
const { SITE } = await import(new URL("src/data/site.ts", root))
const html = await readFile(new URL("dist/seo-local-sevilla/index.html", root), "utf8")
const failures = []
const expect = (condition, message) => {
  if (!condition) failures.push(message)
}

const gbp = localTrust.gbp
const gbpVerified = gbp.status === "verified"

// 1. NAP is published and matches the verified registry.
if (gbpVerified) {
  expect(html.includes(gbp.publicAddress), "SEO-10: la página debe publicar la dirección verificada de la GBP (NAP)")
  expect(html.includes(SITE.phone) || html.includes(SITE.phone.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3")), "SEO-10: la página debe publicar el teléfono verificado (NAP)")
}

// 2. Every Google Maps / GBP link must point to the verified asset, and only
//    when the registry says the GBP is verified.
const allowedMapsLinks = new Set(
  [SITE.mapsUrl, gbp.profileUrl, gbp.placeId && `https://search.google.com/local/reviews?placeid=${gbp.placeId}`].filter(Boolean),
)
const mapsLinks = [...html.matchAll(/href="([^"]*(?:google\.com\/maps|maps\.app\.goo\.gl|g\.page|search\.google\.com\/local)[^"]*)"/gi)].map((m) => m[1].replaceAll("&amp;", "&"))
if (!gbpVerified) expect(mapsLinks.length === 0, "SEO-10: no debe enlazarse una GBP o Maps mientras no esté verificada")
for (const link of mapsLinks) {
  expect(allowedMapsLinks.has(link), `SEO-10: enlace a Maps/GBP no verificado: ${link}`)
}

// 3. Never render unverified rating/review data (markup or copy).
expect(
  !/aggregateRating|reviewCount|"review"|Valoración media de [1-5]/i.test(html),
  "SEO-10: no deben renderizarse datos de rating/reseñas no verificados",
)

// 4. A rendered star rating is only acceptable when it is a real Google review
//    attributed to the verified place (link to its reviews).
if (/Valoración: [1-5](?:[.,]\d)? de 5 estrellas/.test(html)) {
  expect(
    gbpVerified && html.includes(`search.google.com/local/reviews?placeid=${gbp.placeId}`),
    "SEO-10: una valoración con estrellas debe enlazar a las reseñas de la GBP verificada",
  )
}

// 5. Curated social-proof records need consent and evidence to be verified.
for (const proof of localTrust.socialProof) {
  if (proof.status === "verified") {
    expect(proof.consentReference && proof.evidenceReference, `SEO-10: la prueba social "${proof.id}" verificada requiere consentimiento y evidencia`)
  }
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"))
  process.exit(1)
}

console.log("SEO-10 checks passed: NAP and Maps link match the verified GBP and no unverified social proof is rendered.")
