import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8")

const legacyOrUnsafe = /299\s*€|199\s*€|349\s*€|proyecto inicial|mínimo de tres meses|permanencia obligatoria|pacientes|tratamientos/i
const positivePromise = /(?:garantizamos|garantiza(?:mos)? más|primeras posiciones|más (?:tráfico|leads|llamadas|contactos)|te recomienda(?:rá)? (?:Google|ChatGPT|un asistente))/i

test("seo local data exposes only the approved recurring offer", async () => {
  const services = await source("src/data/services.ts")
  const seoLocal = services.slice(services.indexOf("export const seoLocal"), services.indexOf("export const capilarLocal"))

  assert.match(seoLocal, /from:\s*"300 € \+ IVA"/)
  assert.match(seoLocal, /name:\s*"Local"[\s\S]*?from:\s*"300 €\/mes \+ IVA"/)
  assert.match(seoLocal, /name:\s*"Local Pro"[\s\S]*?from:\s*"500 €\/mes \+ IVA"[\s\S]*?recommended:\s*true/)
  assert.doesNotMatch(seoLocal, /initial:\s*\{/)
  assert.doesNotMatch(seoLocal, legacyOrUnsafe)
  assert.doesNotMatch(seoLocal, positivePromise)
})

test("seo local composition is diagnostic-led, ordered and books a call", async () => {
  const [route, layout, plans, bento, process, proof, services] = await Promise.all([
    source("src/pages/seo-local-sevilla.astro"),
    source("src/layouts/ServiceLayout.astro"),
    source("src/components/seo-local/SeoLocalPlans.astro"),
    source("src/components/seo-local/ReviewBento.astro"),
    source("src/components/seo-local/SeoLocalProcess.astro"),
    source("src/components/seo-local/RealProof.astro"),
    source("src/data/services.ts"),
  ])
  const seoLocal = services.slice(services.indexOf("export const seoLocal"), services.indexOf("export const capilarLocal"))

  assert.match(route, /<ServiceLayout page=\{seoLocal\}>/)
  assert.match(route, /<ReviewBento \/>/)
  const order = ["slot=\"hero\"", "<ReviewBento", "<SeoLocalProcess", "<RealProof", "<SeoLocalPlans"].map((marker) => route.indexOf(marker))
  assert.ok(order.every((index) => index >= 0), "all sections composed")
  assert.deepEqual(order, [...order].sort((x, y) => x - y), "hero, bento, process, proof, plans")
  // FAQ, internal links and closing CTA stay in the shared layout after the pricing slot.
  assert.ok(layout.indexOf('<slot name="pricing">') < layout.indexOf("<FAQ"))
  assert.ok(layout.indexOf("<FAQ") < layout.indexOf("<InternalLinks"))
  assert.ok(layout.indexOf("<InternalLinks") < layout.indexOf("<CTASection"))
  for (const component of [bento, process, proof, plans]) {
    assert.match(component, /<section[\s\S]*?<h2/)
    assert.match(component, /aria-labelledby=/)
  }
  assert.match(plans, /<ul/)
  assert.match(seoLocal, /primaryCtaLabel:\s*"Reservar una llamada"/)
  assert.match(seoLocal, /ctaLabel:\s*"Reservar una llamada"/)
})

test("booking button supports a page-specific call label without changing its safe default", async () => {
  const button = await source("src/components/BookingButton.astro")

  assert.match(button, /label\?:\s*string/)
  assert.match(button, /ariaLabel\?:\s*string/)
  assert.match(button, /label\s*=\s*"Reserva una primera sesión"/)
  assert.match(button, /ariaLabel\s*=\s*label/)
})
