import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('shared projects include client cases but not this portfolio', async () => {
  const projects = await source('src/components/Projects.astro')
  assert.match(projects, /key: "arkady"/)
  assert.match(projects, /key: "adfsevilla"/)
  assert.doesNotMatch(projects, /key: "portfolio"|nuriaromero\.dev - Portfolio personal/)
  assert.match(projects, /PROJECTS\.filter\(\(project\) => !only \|\| only\.includes\(project\.key\)\)/)
})

test('case labels identify success stories while preserving the existing route', async () => {
  const [home, header, portfolio, resources] = await Promise.all([
    source('src/pages/index.astro'),
    source('src/components/Header.astro'),
    source('src/pages/portfolio.astro'),
    source('src/pages/recursos.astro'),
  ])
  assert.match(home, /<SectionContainer id="casos">[\s\S]*?Casos de éxito[\s\S]*?<Projects \/>/)
  assert.match(header, /title: "Casos de éxito",\s*label: "Casos de éxito",\s*url: "\/portfolio\/"/)
  assert.match(header, /aria-label=\{link\.label\}/)
  assert.match(portfolio, /\{ name: "Casos de éxito", url: "\/portfolio" \}/)
  assert.match(portfolio, /title="Casos de éxito —/)
  assert.match(portfolio, /<h1[^>]*>[\s\S]*?Casos de éxito[\s\S]*?<\/h1>/)
  assert.doesNotMatch(portfolio, /proyectos propios/i)
  assert.match(resources, /href: "\/portfolio\/",\s*label: "Ver casos de éxito"/)
  assert.doesNotMatch(resources, /Ver portfolio/)
})
