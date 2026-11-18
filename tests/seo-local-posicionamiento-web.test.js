import test from "node:test"
import assert from "node:assert/strict"
import { readFile, readdir } from "node:fs/promises"
import { normaliseTerm } from "../scripts/lib/keyword-ownership.mjs"

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8")
const seoLocalData = async () => {
  const services = await source("src/data/services.ts")
  return services.slice(services.indexOf("export const seoLocal"), services.indexOf("export const capilarLocal"))
}

const worksTerm = (text, term) =>
  normaliseTerm(term)
    .split(" ")
    .every((word) => ` ${normaliseTerm(text)} `.includes(` ${word} `))

// Section keyword headings (the real h2) now come from the page as the
// `keyword` prop of each section component, plus any literal h2 left in components.
const pageKeywords = async () => {
  const route = await source("src/pages/seo-local-sevilla.astro")
  return [...route.matchAll(/<(\w+)\b[^<>]*?\bkeyword="([^"]+)"/g)].map(([, tag, inner]) => ({ file: `${tag}.astro`, inner }))
}

const phrase = /posicionamiento web en Sevilla/i
const positivePromise = /(?:garantizamos|garantiza(?:mos)? más|primeras posiciones|más (?:tráfico|leads|llamadas|contactos)|te recomienda(?:rá)? (?:Google|ChatGPT|un asistente))/i

test("exactly one H2 of /seo-local-sevilla/ names the phrase", async () => {
  const dir = "src/components/seo-local"
  const files = (await readdir(new URL(`../${dir}`, import.meta.url))).filter((name) => name.endsWith(".astro"))
  const headings = []
  for (const file of files) {
    const text = await source(`${dir}/${file}`)
    for (const [, inner] of text.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)) headings.push(inner)
  }
  for (const { inner } of await pageKeywords()) headings.push(inner)

  assert.equal(headings.filter((heading) => phrase.test(heading)).length, 1)
})

test("hero subtitle names the phrase and keeps the existing rules", async () => {
  const data = await seoLocalData()
  const subtitle = data.match(/subtitle:\s*\n?\s*"([^"]+)"/)?.[1]

  assert.ok(subtitle, "seoLocal.hero.subtitle not found")
  assert.match(subtitle, phrase)
  assert.ok(subtitle.length <= 200, `subtitle is ${subtitle.length} chars`)
  assert.match(subtitle, /^Tus clientes te buscan en Google/)
  assert.match(subtitle, /cada mes/)
})

test("exactly one FAQ answer names the phrase together with consultora SEO", async () => {
  const data = await seoLocalData()
  const answers = [...data.matchAll(/\n\s*a:\s*\n?\s*"([^"]+)"/g)].map(([, answer]) => answer)
  const matching = answers.filter((answer) => phrase.test(answer))

  assert.equal(matching.length, 1)
  assert.match(matching[0], /consultora SEO/)
})

const selfDescription = [/\b(?:soy|somos) (?:una |tu )?agencia\b/i, /\bnuestra agencia\b/i]
const componentTexts = async () => {
  const dir = "src/components/seo-local"
  const files = (await readdir(new URL(`../${dir}`, import.meta.url))).filter((name) => name.endsWith(".astro"))
  return Promise.all(files.map(async (file) => ({ file, text: await source(`${dir}/${file}`) })))
}

test("copy stays honest: agencia only in the FAQ question and the agency section, no self-description, no promises", async () => {
  const data = await seoLocalData()
  const components = await componentTexts()
  const withoutQuestion = data.replace("¿Eres una agencia de SEO local?", "")
  const agency = components.find(({ file }) => file === "SeoLocalAgencia.astro")

  assert.doesNotMatch(withoutQuestion, /agencia/i)
  assert.ok(agency, "SeoLocalAgencia.astro exists")
  assert.match(agency.text, /consultora/)
  const route = await source("src/pages/seo-local-sevilla.astro")
  assert.match(route, /como consultora SEO, hablas directamente/)
  for (const pattern of selfDescription) assert.doesNotMatch(route, pattern)
  assert.doesNotMatch(route, positivePromise)
  for (const { file, text } of components) {
    if (file !== "SeoLocalAgencia.astro") assert.doesNotMatch(text, /agencia/i, file)
    for (const pattern of selfDescription) assert.doesNotMatch(text, pattern, file)
    assert.doesNotMatch(text, positivePromise, file)
  }
  for (const pattern of selfDescription) assert.doesNotMatch(data, pattern)
  assert.doesNotMatch(data, positivePromise)
  assert.match(data, /No, soy consultora SEO/)
})

test("exactly one H2 works agencia seo sevilla and it lives in SeoLocalAgencia.astro", async () => {
  const components = await componentTexts()
  const headings = []
  for (const { file, text } of components) {
    for (const [, inner] of text.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)) headings.push({ file, inner })
  }
  headings.push(...(await pageKeywords()))
  const matching = headings.filter(({ inner }) => worksTerm(inner, "agencia seo sevilla"))

  assert.equal(matching.length, 1)
  assert.equal(matching[0].file, "SeoLocalAgencia.astro")
})

test("the price answer is composed from tiers, with no price literal in the component", async () => {
  const [plans, route] = await Promise.all([
    source("src/components/seo-local/SeoLocalPlans.astro"),
    source("src/pages/seo-local-sevilla.astro"),
  ])

  assert.match(route, /<SeoLocalPlans[\s\S]*?answer=\{`[^`]*\$\{tierFrom\(seoLocal, "Local"\)\}/)
  assert.doesNotMatch(route, /<Fragment slot="lede">/)
  assert.match(route, /tierFrom\(seoLocal, "Local"\)/)
  assert.match(route, /tierFrom\(seoLocal, "Local Pro"\)/)
  assert.match(plans, /class="plans-lede"/)
  assert.match(plans, /<slot name="lede"/)
  assert.doesNotMatch(plans, /(?:300|500)\s*€/)
  assert.doesNotMatch(route, /(?:300|500)\s*€/)
  assert.ok(plans.indexOf("<SectionHeading") < plans.indexOf('class="plans-lede"'))
  assert.ok(plans.indexOf('class="plans-lede"') < plans.indexOf('class="plans-note"'))
})

test("the llms.txt entry of the page keeps both published prices and promises no position", async () => {
  const llms = await source("public/llms.txt")
  const line = llms.split("\n").find((entry) => entry.includes("https://nuriaromero.dev/seo-local-sevilla/"))

  assert.ok(line, "llms.txt entry not found")
  assert.match(line, /300 €\/mes \+ IVA/)
  assert.match(line, /500 €\/mes \+ IVA/)
  assert.doesNotMatch(line, positivePromise)
})

test("the home gains no new posicionamiento web mentions", async () => {
  const home = await source("src/pages/index.astro")

  assert.ok((home.match(/posicionamiento web/gi) ?? []).length <= 3)
})

test("title and H1 work posicionamiento web sevilla and keep SEO local Sevilla", async () => {
  const data = await seoLocalData()
  const title = data.match(/seo:\s*\{\s*title:\s*"([^"]+)"/)?.[1]
  const h1 = data.match(/\bh1:\s*"([^"]+)"/)?.[1]

  assert.ok(title, "seoLocal.seo.title not found")
  assert.ok(h1, "seoLocal.hero.h1 not found")
  assert.match(title, /SEO local Sevilla/)
  assert.ok(worksTerm(title, "posicionamiento web sevilla"), title)
  assert.match(title, /300 €\/mes/)
  assert.ok(title.length <= 65, `title is ${title.length} chars`)
  assert.match(h1, /SEO local Sevilla/)
  assert.ok(worksTerm(h1, "posicionamiento web sevilla"), h1)
  assert.doesNotMatch(`${title} ${h1}`, /agencia/i)
})
