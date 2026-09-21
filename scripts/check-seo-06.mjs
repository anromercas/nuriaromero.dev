import { readFile, readdir } from "node:fs/promises"
import { existsSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const root = new URL("../", import.meta.url)
const distDir = new URL("dist/", root)
const mapSource = await readFile(new URL("src/data/internal-links.ts", root), "utf8")
const linkRows = [...mapSource.matchAll(/^\s*"([^"]+)":\s*\[([\s\S]*?)^\s*\],/gm)]
const errors = []

if (linkRows.length === 0) errors.push("No internal-link map entries found")

const routeFile = (route) => {
  if (route === "/") return new URL("index.html", distDir)
  if (route.endsWith("/")) return new URL(`${route.slice(1)}index.html`, distDir)
  return new URL(`${route.slice(1)}/index.html`, distDir)
}

for (const [, source, links] of linkRows) {
  const sourceFile = routeFile(source)
  if (!existsSync(sourceFile)) {
    errors.push(`${source}: rendered source does not exist`)
    continue
  }
  const html = await readFile(sourceFile, "utf8")
  const targets = [...links.matchAll(/path:\s*"([^"]+)"[\s\S]*?anchor:\s*"([^"]+)"/g)]
  if (targets.length < 2) errors.push(`${source}: expected at least two mapped contextual/conversion links`)
  for (const [, path, anchor] of targets) {
    if (!existsSync(routeFile(path))) errors.push(`${source} -> ${path}: rendered target does not exist`)
    if (!html.includes(`href="${path}"`)) errors.push(`${source} -> ${path}: link missing from rendered source`)
    if (!html.includes(anchor)) errors.push(`${source} -> ${path}: descriptive anchor missing: ${anchor}`)
  }
}

const renderedFiles = []
const walk = async (dir) => {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) await walk(path)
    else if (entry.name.endsWith(".html")) renderedFiles.push(path)
  }
}
await walk(fileURLToPath(new URL("dist/", root)))
for (const file of renderedFiles) {
  const html = await readFile(file, "utf8")
  for (const [, href] of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    if (href.endsWith("/")) {
      if (!existsSync(routeFile(href))) errors.push(`${file}: internal target does not exist: ${href}`)
    }
  }
}

if (errors.length) {
  console.error(`SEO-06 internal-link check failed (${errors.length} error${errors.length === 1 ? "" : "s"})`)
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`SEO-06 internal-link check passed: ${linkRows.length} mapped sources and ${renderedFiles.length} rendered HTML files checked`)
