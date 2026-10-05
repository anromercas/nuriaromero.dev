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
