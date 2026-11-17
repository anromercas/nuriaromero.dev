import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const { SITE } = await import(new URL("../src/data/site.ts", import.meta.url))

const html = await readFile("dist/seo-local-sevilla/index.html", "utf8")
const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ")
const legacyOrUnsafe = /299\s*€|199\s*€|349\s*€|proyecto inicial|mínimo de tres meses|pacientes|tratamientos/i
const positivePromise = /(?:garantizamos|garantiza(?:mos)? más|primeras posiciones|más (?:tráfico|leads|llamadas|contactos)|te recomienda(?:rá)? (?:Google|ChatGPT|un asistente))/i

assert.equal((html.match(/<h1\b/gi) ?? []).length, 1)
assert.match(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "", /SEO local Sevilla/)
assert.match(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "", /posicionamiento web/i)
const pageTitle = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? ""
assert.match(pageTitle, /SEO local Sevilla/)
assert.match(pageTitle, /posicionamiento web/i)
// ADR 0016: the brand suffix is mandatory and the 65-char limit applies to the page-owned part.
const brandSuffix = ` | ${SITE.name}`
assert.ok(pageTitle.endsWith(brandSuffix), `title must end with "${brandSuffix}"`)
const ownTitle = pageTitle.slice(0, -brandSuffix.length)
assert.ok(ownTitle.length <= 65, `page-owned title is ${ownTitle.length} chars`)
assert.match(text, /300 €\/mes \+ IVA/)
assert.match(text, /500 €\/mes \+ IVA/)
assert.match(text, /Recomendado/)
assert.match(text, /Reservar una llamada/)
assert.match(text, /Se factura mes a mes y no hay cuota de puesta en marcha aparte/)
assert.doesNotMatch(text, legacyOrUnsafe)
assert.doesNotMatch(text, positivePromise)

const h2Texts = [...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)].map(([, inner]) => inner.replace(/<[^>]*>/g, "").trim())
assert.equal(h2Texts.filter((heading) => /posicionamiento web en Sevilla/i.test(heading)).length, 1)
assert.equal(
  h2Texts.filter((heading) => ["agencia", "seo", "sevilla"].every((word) => new RegExp(`\\b${word}\\b`, "i").test(heading))).length,
  1,
  "Expected exactly one H2 that works agencia seo sevilla",
)
assert.doesNotMatch(text, /\b(?:soy|somos) (?:una |tu )?agencia\b/i)
assert.doesNotMatch(text, /\bnuestra agencia\b/i)

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

const faqPage = entities.find((entity) => entity["@type"] === "FAQPage")
assert.ok(faqPage, "Expected a FAQPage entity in JSON-LD")
const faqAnswers = (faqPage.mainEntity ?? []).map((question) => question.acceptedAnswer?.text ?? "")
const phraseAnswers = faqAnswers.filter((answer) => /posicionamiento web en Sevilla/i.test(answer))
assert.equal(phraseAnswers.length, 1)
assert.match(phraseAnswers[0], /consultora SEO/)

assert.match(html, /Camino Andalucía, 426, 41309 La Rinconada, Sevilla/)
assert.match(html, /href="tel:\+34611812431"/)
assert.match(html, /href="https:\/\/maps\.app\.goo\.gl\/8eg71eAQJrfH7BGaA"/)

console.log("SEO-15 OK: seo-local-sevilla commercial and schema checks passed")
