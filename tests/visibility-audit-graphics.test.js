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
  const [process, cycle, route] = await Promise.all([
    source("src/components/seo-local/SeoLocalProcess.astro"),
    source("src/components/seo-local/SeoLocalCycle.astro"),
    source("src/pages/seo-local-sevilla.astro"),
  ])

  for (const label of ["Trabajo revisable", "Prioridades acordadas", "Vídeo-informe mensual", "cada mes"]) {
    assert.ok(route.includes(label), label)
  }
  assert.match(cycle, /class="cycle-diagram"[\s\S]*?aria-hidden="true"/)
  assert.match(cycle, /class="cycle-list"/)
  assert.match(process, /aria-labelledby=\{headingId\}[\s\S]*?id=\{headingId\}/)
  assert.match(route, /headingId="proceso-title"/)
  assert.doesNotMatch(process + cycle, /(?:transition|animation):/)
})

test("each redesigned section pairs aria-labelledby with its heading id and keeps drawings decorative", async () => {
  const [bento, proof, plans, route] = await Promise.all([
    source("src/components/seo-local/ReviewBento.astro"),
    source("src/components/seo-local/RealProof.astro"),
    source("src/components/seo-local/SeoLocalPlans.astro"),
    source("src/pages/seo-local-sevilla.astro"),
  ])

  assert.match(proof, /aria-labelledby=\{headingId\}[\s\S]*?id=\{headingId\}/)
  assert.match(route, /headingId="prueba-title"/)
  assert.match(plans, /aria-labelledby="planes-title"[\s\S]*?id="planes-title"/)
  assert.match(bento, /aria-labelledby=\{headingId\}[\s\S]*?id=\{headingId\}/)
  assert.match(route, /headingId="revision-title"/)
  const svgs = route.match(/<svg[^>]*>/g) ?? []
  assert.ok(svgs.length >= 6)
  for (const svg of svgs) assert.match(svg, /aria-hidden="true"/)
})
