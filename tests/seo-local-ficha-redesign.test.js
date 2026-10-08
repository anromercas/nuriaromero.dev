import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8")
const seoLocalData = async () => {
  const services = await source("src/data/services.ts")
  return services.slice(services.indexOf("export const seoLocal"), services.indexOf("export const capilarLocal"))
}

test("T1: serif accent font is installed and the layout exposes optional slots with default fallbacks", async () => {
  const [pkg, layout, types, data] = await Promise.all([
    source("package.json"),
    source("src/layouts/ServiceLayout.astro"),
    source("src/data/types.ts"),
    seoLocalData(),
  ])

  assert.match(pkg, /"@fontsource\/instrument-serif"/)
  for (const name of ["hero", "benefits", "process"]) {
    assert.match(layout, new RegExp(`<slot name="${name}">[\\s\\S]*?</slot>`))
  }
  assert.match(layout, /<slot name="hero">[\s\S]*?<ServiceHero/)
  assert.match(layout, /<slot name="benefits">[\s\S]*?<BenefitsGrid/)
  assert.match(layout, /<slot name="process">[\s\S]*?<ProcessSteps/)
  assert.match(types, /h1Accent\?:\s*string/)
  assert.match(data, /h1Accent:\s*"cuando importa"/)
  assert.ok(data.includes("La pregunta es si te encuentran cuando importa."))
})
