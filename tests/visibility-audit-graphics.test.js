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

  const flowIcons = audit.match(/class="audit-flow-icon" aria-hidden="true"/g)
  assert.equal(flowIcons?.length, 5)
  assert.match(audit, /aria-labelledby="diagnostico-title"[\s\S]*?id="diagnostico-title"/)
  assert.match(audit, /aria-labelledby="revision-title"[\s\S]*?id="revision-title"/)
  assert.match(audit, /aria-labelledby="evidencia-title"[\s\S]*?id="evidencia-title"/)
  assert.match(audit, /<ProfileCheck class="audit-cycle-icon" aria-hidden="true" \/>/)
  assert.match(audit, /<Briefcase class="audit-cycle-icon" aria-hidden="true" \/>/)
})

test("the delivery-cycle icon sizing rule stays unscoped so it also sizes the Calendar icon", async () => {
  const audit = await source("src/components/seo-local/VisibilityAudit.astro")

  // Calendar.astro does not spread {...Astro.props}, so it never receives Astro's
  // scoped-style data-astro-cid attribute. A plain scoped `.audit-cycle-icon { ... }`
  // rule silently fails to match Calendar's <svg>, which then renders at the browser's
  // default intrinsic size (huge) because Calendar also sets no width/height itself.
  assert.match(audit, /:global\(\.audit-cycle-icon\)\s*\{/)
})
