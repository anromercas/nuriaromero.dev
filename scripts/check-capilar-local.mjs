import { readFile } from "node:fs/promises"

const failures = []
const expect = (condition, message) => {
  if (!condition) failures.push(message)
}
const read = async (path) => {
  try {
    return await readFile(path, "utf8")
  } catch {
    failures.push(`CAPILAR LOCAL: missing ${path}`)
    return ""
  }
}

const services = await read("src/data/services.ts")
const hub = await read("src/pages/seo-local-sevilla.astro")
const landingPage = await read("src/pages/seo-para-clinicas-capilares-sevilla.astro")
const intents = await read("src/data/seo-intents.ts")
const landing = landingPage + services

for (const phrase of [
  "CAPILAR LOCAL",
  "299 € + IVA",
  "10 días hábiles",
  "pago único",
  "sin obligación de continuar",
  "3 competidores",
  "una página estratégica",
  "5 FAQs",
  "90 días",
  "30 días",
  "199 €/mes + IVA",
  "349 €/mes + IVA",
  "Solicitar proyecto inicial",
  "Hablar sobre crecimiento",
]) {
  expect(services.includes(phrase), `CAPILAR LOCAL: service data must state ${phrase}`)
}

expect(hub.includes("¿Este servicio encaja con una clínica capilar?"), "CAPILAR LOCAL: hub must bridge to the clinic landing")
expect(hub.includes('href="/seo-para-clinicas-capilares-sevilla/"'), "CAPILAR LOCAL: hub must link to the clinic landing")
expect(!hub.includes("reseña gestionada"), "CAPILAR LOCAL: hub must not claim review management in the initial project")
expect(services.includes("  capilarLocal,\n"), "CAPILAR LOCAL: clinic landing must be present in shared services navigation")
expect(intents.includes('url: "/seo-para-clinicas-capilares-sevilla/"'), "CAPILAR LOCAL: clinic landing must have a search-intent entry")
expect(hub.includes("Desde 199 €/mes + IVA") && hub.includes("Desde 349 €/mes + IVA"), "CAPILAR LOCAL: hub comparison must show recurring prices with IVA")

for (const phrase of [
  "CAPILAR LOCAL",
  "Visibilidad",
  "Confianza",
  "Contacto",
  "299 € + IVA",
  "10 días hábiles",
  "Qué no incluye",
  "199 €/mes + IVA",
  "349 €/mes + IVA",
  "sin datos clínicos",
  "información aprobada por la clínica",
  "/seo-local-sevilla/",
  "/web-para-clinicas-sevilla/",
  "/contacto",
]) {
  expect(landing.includes(phrase), `CAPILAR LOCAL: landing must state ${phrase}`)
}

for (const unsupportedClaim of ["top 3", "primera página", "pacientes garantizados", "leads garantizados", "resultados médicos garantizados"]) {
  expect(!landingPage.toLowerCase().includes(unsupportedClaim), `CAPILAR LOCAL: landing must not promise ${unsupportedClaim}`)
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"))
  process.exit(1)
}

console.log("CAPILAR LOCAL checks passed: bounded offer, general hub bridge and B2B clinic landing are present.")
