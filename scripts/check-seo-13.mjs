import { readFile } from "node:fs/promises"

const failures = []
const expect = (condition, message) => {
  if (!condition) failures.push(message)
}

const read = async (path, label) => {
  try {
    return await readFile(path, "utf8")
  } catch {
    failures.push(`SEO-13: ${label} is missing (${path})`)
    return ""
  }
}

const resources = await read("dist/recursos/index.html", "the public resources hub")
const register = await read(
  "docs/seo-audit/authority-backlink-register.md",
  "the authority register",
)
const llms = await read("public/llms.txt", "the public llms index")

expect(
  /<h1[^>]*>\s*Recursos para citar y compartir\s*<\/h1>/i.test(resources),
  "SEO-13: the resources hub needs a descriptive H1",
)
for (const route of [
  "/sobre-mi/",
  "/portfolio/",
  "/blog/",
  "/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/",
]) {
  expect(
    resources.includes(`href="${route}"`),
    `SEO-13: the resources hub must link to ${route}`,
  )
}
expect(
  /No se compran enlaces|no se compran enlaces/i.test(resources),
  "SEO-13: the resources hub must state the non-purchasing policy",
)
expect(
  /fuente de datos|fecha de captura|línea base/i.test(register),
  "SEO-13: the register must define measurement baseline and capture date",
)
expect(
  /propietario|evidencia esperada|criterio de descarte/i.test(register),
  "SEO-13: every outreach record must define owner, evidence and rejection criteria",
)
expect(
  /PBN|link farm|compra(?:r)? enlaces|reseñas? pagadas|redes artificiales/i.test(register),
  "SEO-13: the register must document prohibited artificial-link tactics",
)
expect(
  /https:\/\/nuriaromero\.dev\/recursos\//i.test(llms),
  "SEO-13: llms.txt must expose the resources hub as a public linkable asset",
)
expect(
  !/(?:\b(?:DA|DR|authority score)\s*[:=]\s*\d|\b\d+\s+backlinks?\b|\b\d+\s+dominios?\s+referentes?\b)/i.test(register),
  "SEO-13: the register must not invent authority or backlink metrics",
)

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"))
  process.exit(1)
}

console.log("SEO-13 checks passed: linkable resources, safe outreach register and measurement safeguards validated.")
