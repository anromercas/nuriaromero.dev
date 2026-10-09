import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

// Extrae { title, description } del bloque `seo: { title: "...", description: "..." }`
// que sigue a cada `export const <name>` en services.ts / niches.ts.
function extractSeoBlocks(src) {
  const blocks = []
  const exportRegex = /export const (\w+)[\s\S]*?seo:\s*\{\s*title:\s*"((?:\\.|[^"\\])*)",\s*description:\s*"((?:\\.|[^"\\])*)"\s*,?\s*\}/g
  let m
  while ((m = exportRegex.exec(src)) !== null) {
    blocks.push({ name: m[1], title: m[2], description: m[3] })
  }
  return blocks
}

test('home title includes Sevilla and description stays within 160 chars', async () => {
  const home = await source('src/pages/index.astro')
  const match = home.match(/<Layout\s+title="([^"]+)"\s+description="([^"]+)"/)
  assert.ok(match, 'no se encontró el bloque <Layout title=... description=...> en index.astro')
  const [, title, description] = match

  assert.match(title, /Sevilla/, 'el title de home debe incluir "Sevilla"')
  assert.ok(
    description.length <= 160,
    `la description de home mide ${description.length} caracteres (límite 160)`
  )
})

test('services.ts: los 4 seo.description de servicio miden <=160 y mencionan la credencial de experiencia', async () => {
  const servicesSrc = await source('src/data/services.ts')
  const blocks = extractSeoBlocks(servicesSrc)
  const targets = ['disenoWeb', 'desarrolloSoftware', 'automatizaciones', 'inteligenciaArtificial']

  for (const name of targets) {
    const block = blocks.find((b) => b.name === name)
    assert.ok(block, `no se encontró el bloque seo de "${name}" en services.ts`)
    assert.ok(
      block.description.length <= 160,
      `${name}: description mide ${block.description.length} caracteres (límite 160)`
    )
    assert.match(
      block.description,
      /años de experiencia/,
      `${name}: la description debe mencionar la credencial de experiencia ("años de experiencia")`
    )
  }
})

test('services.ts: los seo.title de los 4 servicios no cambian (blindaje del patrón servicio+Sevilla+precio)', async () => {
  const servicesSrc = await source('src/data/services.ts')
  const blocks = extractSeoBlocks(servicesSrc)

  const expectedTitles = {
    disenoWeb: 'Diseño web en Sevilla | Precio cerrado desde 149 €',
    desarrolloSoftware: 'Desarrollo de software a medida en Sevilla | Aplicaciones web',
    automatizaciones: 'Automatización de procesos para negocios en Sevilla | n8n y Make',
    inteligenciaArtificial: 'IA para negocios en Sevilla | Chatbots y asistentes con IA',
  }

  for (const [name, expectedTitle] of Object.entries(expectedTitles)) {
    const block = blocks.find((b) => b.name === name)
    assert.ok(block, `no se encontró el bloque seo de "${name}" en services.ts`)
    assert.equal(block.title, expectedTitle, `${name}: el seo.title no debe cambiar`)
  }
})

test('niches.ts: los 4 seo.description de nicho miden <=160 caracteres', async () => {
  const nichesSrc = await source('src/data/niches.ts')
  const blocks = extractSeoBlocks(nichesSrc)
  const targets = ['restaurantes', 'clinicas', 'comercios', 'profesionales']

  for (const name of targets) {
    const block = blocks.find((b) => b.name === name)
    assert.ok(block, `no se encontró el bloque seo de "${name}" en niches.ts`)
    assert.ok(
      block.description.length <= 160,
      `${name}: description mide ${block.description.length} caracteres (límite 160)`
    )
  }
})

test('niches.ts: los seo.title de los 4 nichos no cambian', async () => {
  const nichesSrc = await source('src/data/niches.ts')
  const blocks = extractSeoBlocks(nichesSrc)

  const expectedTitles = {
    restaurantes: 'Página web para restaurantes en Sevilla | Carta, reservas y Google',
    clinicas: 'Página web para clínicas en Sevilla | Dentistas, fisios, psicólogos',
    comercios: 'Página web para comercios y tiendas en Sevilla | Vende online',
    profesionales: 'Página web para abogados y gestorías en Sevilla | Capta clientes',
  }

  for (const [name, expectedTitle] of Object.entries(expectedTitles)) {
    const block = blocks.find((b) => b.name === name)
    assert.ok(block, `no se encontró el bloque seo de "${name}" en niches.ts`)
    assert.equal(block.title, expectedTitle, `${name}: el seo.title no debe cambiar`)
  }
})

test('home owns the "consultor SEO Sevilla" keyword in title, description, H1 and first paragraph', async () => {
  const home = await source('src/pages/index.astro')
  const match = home.match(/<Layout\s+title="([^"]+)"\s+description="([^"]+)"/)
  assert.ok(match, 'no se encontró el bloque <Layout title=... description=...> en index.astro')
  const [, title, description] = match

  assert.ok(title.startsWith('Consultor SEO en Sevilla'), 'el title debe empezar por "Consultor SEO en Sevilla"')
  assert.ok(title.length <= 65, `el title mide ${title.length} caracteres (límite 65)`)
  assert.match(description, /consultor SEO en Sevilla/i)
  assert.ok(
    description.length >= 140 && description.length <= 160,
    `la description mide ${description.length} caracteres (rango 140-160)`
  )

  const h1 = home.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? ''
  assert.match(h1, /Consultor SEO en Sevilla/)
  assert.doesNotMatch(h1, /consultora/i)

  const heroParagraph = home.match(/<\/h2>\s*<p[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? ''
  assert.equal((heroParagraph.match(/consultor SEO en Sevilla/gi) ?? []).length, 1)
})

test('home profile photo alt uses the "consultor SEO en Sevilla" wording', async () => {
  const home = await source('src/pages/index.astro')
  assert.match(home, /alt="Nuria Romero, consultor SEO en Sevilla y desarrolladora web"/)
  assert.doesNotMatch(home, /alt="[^"]*consultora SEO/i)
})

test('home: "posicionamiento web en Sevilla" aparece en un h2/h3, <=3 veces y no en title ni H1', async () => {
  const home = await source('src/pages/index.astro')
  const keyword = /posicionamiento web/gi
  const title = home.match(/<Layout\s+title="([^"]+)"/)[1]
  const h1 = home.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)[1]
  const headings = [...home.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/g)].map((m) => m[1])
  // TitleSection renders an h2, so its slot content counts as a heading.
  const titleSections = [...home.matchAll(/<TitleSection>([\s\S]*?)<\/TitleSection>/g)].map((m) => m[1])

  assert.ok(
    [...headings, ...titleSections].some((h) => /posicionamiento web en Sevilla/i.test(h)),
    'falta "posicionamiento web en Sevilla" en un encabezado h2/h3 de la home'
  )
  assert.ok((home.match(keyword) ?? []).length <= 3, 'más de 3 apariciones de "posicionamiento web" en la home')
  assert.doesNotMatch(title, keyword, 'el title no debe contener la keyword')
  assert.doesNotMatch(h1, keyword, 'el H1 no debe contener la keyword')
})
