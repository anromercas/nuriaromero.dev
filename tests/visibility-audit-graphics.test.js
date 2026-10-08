import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8")

test("new VisibilityAudit icons follow the project's bare-spread SVG icon convention", async () => {
  const icons = await Promise.all([
    source("src/components/icons/MapPin.astro"),
    source("src/components/icons/Search.astro"),
    source("src/components/icons/Gauge.astro"),
    source("src/components/icons/Repeat.astro"),
  ])

  for (const icon of icons) {
    assert.match(icon, /\{\.\.\.Astro\.props\}/)
    assert.match(icon, /viewBox="0 0 24 24"/)
    assert.match(icon, /stroke="currentColor"/)
    assert.match(icon, /stroke-width="2"/)
  }
})

test("the retired VisibilityAudit is gone and its monthly cycle lives in the process section", async () => {
  await assert.rejects(source("src/components/seo-local/VisibilityAudit.astro"), { code: "ENOENT" })
  const process = await source("src/components/seo-local/SeoLocalProcess.astro")

  for (const label of ["Trabajo revisable", "Prioridades acordadas", "Vídeo-informe mensual", "cada mes"]) {
    assert.ok(process.includes(label), label)
  }
  assert.match(process, /class="cycle-diagram"[\s\S]*?aria-hidden="true"/)
  assert.match(process, /class="cycle-list"/)
  assert.match(process, /aria-labelledby="proceso-title"[\s\S]*?id="proceso-title"/)
  assert.doesNotMatch(process, /(?:transition|animation):/)
})

test("each redesigned section pairs aria-labelledby with its heading id and keeps drawings decorative", async () => {
  const [bento, proof, plans] = await Promise.all([
    source("src/components/seo-local/ReviewBento.astro"),
    source("src/components/seo-local/RealProof.astro"),
    source("src/components/seo-local/SeoLocalPlans.astro"),
  ])

  assert.match(proof, /aria-labelledby="prueba-title"[\s\S]*?id="prueba-title"/)
  assert.match(plans, /aria-labelledby="planes-title"[\s\S]*?id="planes-title"/)
  assert.match(bento, /aria-labelledby="revision-title"[\s\S]*?id="revision-title"/)
  const svgs = bento.match(/<svg[^>]*>/g) ?? []
  assert.ok(svgs.length >= 6)
  for (const svg of svgs) assert.match(svg, /aria-hidden="true"/)
})
