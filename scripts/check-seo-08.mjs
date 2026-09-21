import { readdir, readFile } from "node:fs/promises"
import { join } from "node:path"

const page = await readFile("dist/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/index.html", "utf8")
const article = page.match(/<article[\s\S]*?<\/article>/i)?.[0]

if (!article) {
  throw new Error("SEO-08: no se encontró el artículo GEO renderizado")
}

const failures = []
const expect = (condition, message) => {
  if (!condition) failures.push(message)
}

expect(
  /<h2[^>]*>[^<]*(?:resumen|respuesta corta)[^<]*<\/h2>/i.test(article),
  "SEO-08: el post GEO necesita una sección de respuesta breve con heading",
)
expect(
  /<ol[\s>]/i.test(article),
  "SEO-08: el post GEO debe conservar una lista ordenada de acciones",
)
expect(
  /href="https:\/\/nuriaromero\.dev\/(?:seo-local-sevilla|diseno-web-sevilla)\//g.test(article),
  "SEO-08: los enlaces de servicio del post GEO deben ser absolutos",
)
expect(
  !/<a[^>]+href="\/(?:seo-local-sevilla|diseno-web-sevilla)\//i.test(article),
  "SEO-08: el post GEO todavía contiene un enlace relativo de servicio",
)

const htmlFiles = []
const collectHtmlFiles = async (directory) => {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) await collectHtmlFiles(path)
    else if (entry.name.endsWith(".html")) htmlFiles.push(path)
  }
}

await collectHtmlFiles("dist")
const faqBlocks = []
for (const path of htmlFiles) {
  const html = await readFile(path, "utf8")
  const pageFaqs = [...html.matchAll(/<details[\s\S]*?<\/details>/gi)].map((match) => match[0])
  faqBlocks.push(...pageFaqs)

  if (pageFaqs.length > 0) {
    expect(/"@type":"FAQPage"/.test(html), `SEO-08: ${path} no contiene FAQPage schema`)
    const questionCount = (html.match(/"@type":"Question"/g) ?? []).length
    expect(
      questionCount === pageFaqs.length,
      `SEO-08: ${path} tiene ${pageFaqs.length} FAQs visibles y ${questionCount} preguntas en schema`,
    )
  }
}
expect(faqBlocks.length > 0, "SEO-08: no se encontraron FAQs renderizadas")
expect(
  faqBlocks.every((block) => /<p[^>]*>\s*<strong[\s>]/i.test(block)),
  "SEO-08: cada FAQ debe separar visualmente la respuesta directa del contexto",
)
expect(
  faqBlocks.every((block) => /<p[^>]*>\s*<strong[\s>][\s\S]*?<\/strong>\s*<\/p>/i.test(block)),
  "SEO-08: cada FAQ debe tener una respuesta directa autónoma en su primer párrafo",
)

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"))
  process.exit(1)
}

console.log(`SEO-08 checks passed: ${faqBlocks.length} FAQs and GEO article structure validated.`)
