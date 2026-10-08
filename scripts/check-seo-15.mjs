import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const html = await readFile("dist/seo-local-sevilla/index.html", "utf8")
const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ")
const legacyOrUnsafe = /299\s*€|199\s*€|349\s*€|proyecto inicial|mínimo de tres meses|pacientes|tratamientos/i
const positivePromise = /(?:garantizamos|garantiza(?:mos)? más|primeras posiciones|más (?:tráfico|leads|llamadas|contactos)|te recomienda(?:rá)? (?:Google|ChatGPT|un asistente))/i

assert.equal((html.match(/<h1\b/gi) ?? []).length, 1)
assert.match(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "", /SEO local Sevilla/)
assert.match(text, /300 €\/mes \+ IVA/)
assert.match(text, /500 €\/mes \+ IVA/)
assert.match(text, /Recomendado/)
assert.match(text, /Reservar una llamada/)
assert.match(text, /Se factura mes a mes y no hay cuota de puesta en marcha aparte/)
assert.doesNotMatch(text, legacyOrUnsafe)
assert.doesNotMatch(text, positivePromise)

const payloads = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)]
  .map(([, payload]) => JSON.parse(payload))
const entities = payloads.flatMap((payload) => payload["@graph"] ?? [payload])
const service = entities.find((entity) => entity["@type"] === "Service")

assert.ok(service, "Expected a Service entity in JSON-LD")
assert.equal(service["@id"], "https://nuriaromero.dev/seo-local-sevilla/#service")
const offers = Array.isArray(service.offers) ? service.offers : []
assert.deepEqual(offers.map((offer) => [offer.name, offer.price]), [["Local", "300"], ["Local Pro", "500"]])
for (const offer of offers) {
  assert.equal(offer.priceCurrency, "EUR")
  assert.match(offer.url ?? "", /\/seo-local-sevilla\/$/)
  assert.equal(offer.priceSpecification?.["@type"], "UnitPriceSpecification")
  assert.equal(offer.priceSpecification?.price, Number(offer.price))
  assert.equal(offer.priceSpecification?.priceCurrency, "EUR")
  assert.equal(offer.priceSpecification?.unitText, "MON")
  assert.equal(offer.priceSpecification?.valueAddedTaxIncluded, false)
}
assert.doesNotMatch(JSON.stringify(service), legacyOrUnsafe)

assert.match(html, /Camino Andalucía, 426, 41309 La Rinconada, Sevilla/)
assert.match(html, /href="tel:\+34611812431"/)
assert.match(html, /href="https:\/\/maps\.app\.goo\.gl\/8eg71eAQJrfH7BGaA"/)

console.log("SEO-15 OK: seo-local-sevilla commercial and schema checks passed")
