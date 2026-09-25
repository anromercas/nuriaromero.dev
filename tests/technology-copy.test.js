import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('home describes the broader technology stack without attributing it to the featured cases', async () => {
  const home = await source('src/pages/index.astro')
  const cases = home.match(/<SectionContainer id="casos">([\s\S]*?)<Projects \/>/)?.[1]

  assert.ok(cases, 'success cases section exists')
  assert.match(cases, /trabajo con\s+WordPress, Astro, React, Next\.js y otras tecnologías/i)
  assert.doesNotMatch(cases, /Wordpress, Vite y React/)
})

test('Person structured data names Astro and Next.js alongside existing expertise', async () => {
  const schema = await source('src/lib/schema.ts')
  const knowsAbout = schema.match(/knowsAbout:\s*\[([\s\S]*?)\]/)?.[1]

  assert.ok(knowsAbout, 'Person knowsAbout exists')
  for (const technology of ['Angular', 'React', 'WordPress', 'Astro', 'Next.js']) {
    assert.match(knowsAbout, new RegExp(`"${technology.replace('.', '\\.')}"`))
  }
})
