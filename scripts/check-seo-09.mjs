import { readFile } from "node:fs/promises"

const articlePath = "dist/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/index.html"
const article = await readFile(articlePath, "utf8")
const llms = await readFile("dist/llms.txt", "utf8")
const failures = []
const expect = (condition, message) => {
  if (!condition) failures.push(message)
}

const articleBody = article.match(/<article[\s\S]*?<\/article>/i)?.[0] ?? ""
expect(articleBody.length > 0, "SEO-09: no se encontró el artículo GEO renderizado")
expect(
  /<a[^>]+href="\/sobre-mi\/"[^>]*>\s*Nuria Romero Castillo\s*<\/a>/i.test(articleBody),
  "SEO-09: el artículo debe mostrar una autora enlazada a su perfil",
)
expect(
  /Publicado el[\s\S]*?<time[^>]+datetime="2026-09-21T00:00:00.000Z"/i.test(articleBody),
  "SEO-09: el artículo debe mostrar la fecha de publicación con datetime verificable",
)
expect(
  /"@type":"Article"[\s\S]*?"datePublished":"2026-09-21T00:00:00.000Z"/i.test(article),
  "SEO-09: el Article schema debe conservar datePublished",
)
expect(
  /"author":\{"@id":"https:\/\/nuriaromero\.dev\/#person"\}/i.test(article),
  "SEO-09: el Article schema debe enlazar a la entidad Person del sitio",
)

const markdownLinks = [...llms.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((match) => match[1])
expect(markdownLinks.length >= 10, "SEO-09: llms.txt debe mantener un índice curado de recursos públicos")
const allowedExternalLinks = new Set([
  "https://linkedin.com/in/nuria-romero-castillo",
  "https://github.com/anromercas",
])
expect(
  markdownLinks.every(
    (link) => link.startsWith("https://nuriaromero.dev/") || allowedExternalLinks.has(link),
  ),
  "SEO-09: llms.txt solo debe contener enlaces absolutos a recursos públicos seleccionados",
)
expect(
  markdownLinks.includes("https://nuriaromero.dev/sobre-mi/"),
  "SEO-09: llms.txt debe enlazar al perfil público de la autora",
)
expect(
  /^## (?:Servicios|Sectores|Contenido editorial|Perfil y contacto)$/m.test(llms),
  "SEO-09: llms.txt debe conservar secciones curatoriales legibles",
)
expect(
  /no garantiza[n]?[^\n]*(?:posición|citación|tratamiento especial)/i.test(llms),
  "SEO-09: llms.txt debe evitar promesas de posicionamiento o citación",
)
expect(
  !/(?:localhost|127\.0\.0\.1|token|private|preview|staging|utm_|\?[^\s)]*=)/i.test(llms),
  "SEO-09: llms.txt no debe incluir URLs privadas, efímeras o con tracking",
)

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"))
  process.exit(1)
}

console.log(`SEO-09 checks passed: authorship markup, Article schema and ${markdownLinks.length} llms.txt links validated.`)
