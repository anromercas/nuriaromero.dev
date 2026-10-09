import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('seo-local-sevilla does not compete for "consultor SEO" and keeps its H2 in sync with seo-intents', async () => {
  const [proc, intents] = await Promise.all([
    source('src/components/seo-local/SeoLocalProcess.astro'),
    source('src/data/seo-intents.ts'),
  ])
  const h2 = proc.match(/<h2 id="proceso-title" class="kw">([^<]+)<\/h2>/)?.[1]
  assert.equal(h2, 'Cómo trabajamos el SEO local en Sevilla')
  assert.doesNotMatch(h2, /consultor/i)
  assert.ok(intents.includes(`"${h2}"`), 'contentSignals mirrors the process H2')
  assert.doesNotMatch(intents, /Consultor de SEO local/)
})

test('seo-local-sevilla meta description mentions Google Maps, both prices and fits 140-160 chars', async () => {
  const data = await source('src/data/services.ts')
  const description = data.match(/export const seoLocal[\s\S]*?seo:\s*\{[\s\S]*?description:\s*\n?\s*"([^"]+)"/)?.[1]
  assert.ok(description, 'description found')
  assert.ok(description.length >= 140 && description.length <= 160, `description is ${description.length} chars`)
  assert.match(description, /Google Maps/)
  assert.match(description, /300 €\/mes \+ IVA/)
  assert.match(description, /500 €\/mes \+ IVA/)
  assert.doesNotMatch(description, /consultor/i)
})

test('Person schema presents the SEO consultant role and expertise', async () => {
  const schema = await source('src/lib/schema.ts')
  const person = schema.match(/export function personSchema\(\) \{([\s\S]*?)\n\}/)?.[1] ?? ''
  assert.match(person, /jobTitle: "Consultor SEO y desarrolladora web freelance"/)
  assert.match(person, /description: "Consultor SEO en Sevilla y desarrolladora web\. Ayudo a negocios locales a aparecer en Google, Google Maps y buscadores con IA\."/)
  for (const topic of ['Consultoría SEO', 'Posicionamiento web', 'Optimización para buscadores con IA (GEO)', 'Google Business Profile', 'SEO local']) {
    assert.ok(person.includes(`"${topic}"`), topic)
  }
})

test('pages link to the home with the exact anchor "consultor SEO en Sevilla", once per page', async () => {
  const anchorLink = /<a href="\/"[^>]*>consultor SEO en Sevilla<\/a>/g
  const proc = await source('src/components/seo-local/SeoLocalProcess.astro')
  const about = await source('src/components/AboutMe.astro')
  assert.equal((proc.match(anchorLink) ?? []).length, 1, 'seo-local-sevilla')
  assert.equal((about.match(anchorLink) ?? []).length, 1, 'sobre-mi')

  const links = await source('src/data/internal-links.ts')
  for (const slug of ['como-aparecer-en-google-maps-negocio-sevilla', 'que-es-geo-posicionamiento-ia-negocios-sevilla']) {
    const block = links.match(new RegExp(`"/blog/${slug}/": \\[([\\s\\S]*?)\\n  \\],`))?.[1] ?? ''
    const hits = block.match(/path: "\/", anchor: "consultor SEO en Sevilla", kind: "contextual"/g) ?? []
    assert.equal(hits.length, 1, slug)
  }
  const home = links.match(/"\/": \[([\s\S]*?)\n  \],/)?.[1] ?? ''
  assert.doesNotMatch(home, /path: "\/"/, 'home never links to itself')
})
