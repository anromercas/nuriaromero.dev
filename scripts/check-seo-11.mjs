import { readdir, readFile } from "node:fs/promises"

const distRoot = new URL("../dist/", import.meta.url)
const { localTrust } = await import(new URL("../src/data/local-trust.ts", import.meta.url))
const pages = []

async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = new URL(entry.name + (entry.isDirectory() ? "/" : ""), directory)
    // public/informes/* are private, noindex client reports copied verbatim from
    // public/ (standalone HTML, no site Layout), so they carry no site schema.
    if (entry.isDirectory()) {
      if (directory.pathname === distRoot.pathname && entry.name === "informes") continue
      await collect(path)
    }
    else if (entry.name === "index.html") pages.push(path)
  }
}

function fail(message) {
  throw new Error(`[SEO-11] ${message}`)
}

function parseSchemas(html, file) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
    (match) => {
      try {
        return JSON.parse(match[1])
      } catch {
        fail(`invalid JSON-LD in ${file}`)
      }
    },
  )
}

function hasArea(schema) {
  const areas = Array.isArray(schema.areaServed) ? schema.areaServed : [schema.areaServed]
  return areas.some((area) => area?.["@type"] === "City" && area.name === "Sevilla") &&
    areas.some((area) => area?.["@type"] === "AdministrativeArea" && area.name === "Área metropolitana de Sevilla")
}

await collect(distRoot)
if (pages.length === 0) fail("no built HTML pages found")

let serviceCount = 0
for (const path of pages) {
  const file = path.pathname.replace(`${distRoot.pathname}`, "dist/")
  const html = await readFile(path, "utf8")
  const schemas = parseSchemas(html, file).flatMap((schema) => {
    // SEO-25: entities can now arrive wrapped as a single @graph document
    // (canonical JSON-LD) instead of a bare array with per-entity @context.
    if (Array.isArray(schema)) return schema
    if (Array.isArray(schema["@graph"])) return schema["@graph"]
    return [schema]
  })
  const business = schemas.find((schema) => schema["@id"] === "https://nuriaromero.dev/#business")
  const person = schemas.find((schema) => schema["@id"] === "https://nuriaromero.dev/#person")
  if (!business) fail(`missing shared business entity in ${file}`)
  if (JSON.stringify(business["@type"]) !== JSON.stringify(["ProfessionalService", "Organization"])) {
    fail(`business entity must be ProfessionalService + Organization in ${file}`)
  }
  if (business.name !== "Nuria Romero" || business.alternateName !== "nuriaromero.dev") {
    fail(`business naming is not canonical in ${file}`)
  }
  if (!hasArea(business)) fail(`business areaServed is incomplete in ${file}`)
  // Verified profiles only: LinkedIn, GitHub and the verified Google Business
// Profile (activated in b5e59b6, see src/data/local-trust.ts). Add a profile
// here only after it is verified as Nuria's.
const VERIFIED_SAME_AS = [
  "https://linkedin.com/in/nuria-romero-castillo",
  "https://github.com/anromercas",
  "https://www.google.com/maps/place/?q=place_id:ChIJ8Uv-vM9f0CoR8J75dj4I0HM",
]
if (!Array.isArray(business.sameAs) || business.sameAs.join("|") !== VERIFIED_SAME_AS.join("|")) {
    fail(`business sameAs is not limited to verified profiles in ${file}`)
  }
  for (const forbidden of ["geo", "openingHoursSpecification", "aggregateRating", "review"]) {
    if (forbidden in business) fail(`business contains unverified ${forbidden} in ${file}`)
  }
  // The street address is public on the verified GBP (local-trust.ts) and in the
  // NAP block, so the schema may carry it, but only exactly as verified.
  if (business.address?.streetAddress || business.address?.postalCode) {
    const verifiedAddress = localTrust.gbp.status === "verified" ? localTrust.gbp.publicAddress : null
    const { streetAddress, postalCode, addressLocality } = business.address
    const rendered = `${streetAddress}, ${postalCode} ${addressLocality}`
    if (!verifiedAddress || !verifiedAddress.startsWith(rendered)) {
      fail(`business address "${rendered}" does not match the verified GBP address in ${file}`)
    }
  }
  if (html.includes('<meta property="og:site_name" content="nuriaromero.dev"')) {
    fail(`metadata uses the domain as the primary brand in ${file}`)
  }
  if (person) {
    if (person.name !== "Nuria Romero" || person.alternateName !== "Nuria Romero Castillo") {
      fail(`person naming is not canonical in ${file}`)
    }
    if (person.worksFor?.["@id"] !== business["@id"]) fail(`person is not linked to business in ${file}`)
  }
  for (const schema of schemas) {
    if (schema["@type"] === "Service") {
      serviceCount += 1
      if (schema.provider?.["@id"] !== business["@id"] || !hasArea(schema)) {
        fail(`service provider or areaServed is inconsistent in ${file}`)
      }
    }
  }
}

if (serviceCount === 0) fail("no Service schema found")
console.log(`SEO-11 schema checks passed for ${pages.length} pages and ${serviceCount} services`)
