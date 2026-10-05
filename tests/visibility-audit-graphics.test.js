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

test("VisibilityAudit renders a checklist-flow and a delivery-cycle instead of plain text", async () => {
  const audit = await source("src/components/seo-local/VisibilityAudit.astro")

  assert.match(audit, /import MapPin from "@\/components\/icons\/MapPin\.astro"/)
  assert.match(audit, /import Search from "@\/components\/icons\/Search\.astro"/)
  assert.match(audit, /import Gauge from "@\/components\/icons\/Gauge\.astro"/)
  assert.match(audit, /import Repeat from "@\/components\/icons\/Repeat\.astro"/)
  assert.match(audit, /class="audit-flow"/)
  assert.doesNotMatch(audit, /class="audit-list"/)
  assert.match(audit, /class="audit-cycle"/)
  assert.match(audit, /Trabajo revisable/)
  assert.match(audit, /Prioridades acordadas/)
  assert.match(audit, /Vídeo-informe mensual/)
  assert.match(audit, /cada mes/)
  assert.doesNotMatch(audit, /(?:transition|animation):\s*(?!\s*none\b)/)
})
