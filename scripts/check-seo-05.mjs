import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const distRoot = path.join(repoRoot, "dist")
const taskFile = path.join(
  repoRoot,
  "docs/seo-audit/full-audit-2026-09-21/tasks/05-diversificar-paginas-nicho.md",
)

const pages = [
  {
    slug: "web-para-restaurantes-sevilla",
    sector: "restaurantes",
    requiredHeadings: [
      "Carta, reservas y decisiones desde el móvil",
      "De la carta a una reserva clara",
    ],
  },
  {
    slug: "web-para-clinicas-sevilla",
    sector: "clínicas",
    requiredHeadings: [
      "Información clara antes de pedir cita",
      "Del primer contacto a una cita bien planteada",
    ],
  },
  {
    slug: "web-para-comercios-sevilla",
    sector: "comercios",
    requiredHeadings: [
      "Un escaparate que empieza antes de entrar",
      "Del catálogo local a la venta online",
    ],
  },
  {
    slug: "web-para-abogados-gestorias-sevilla",
    sector: "despachos y gestorías",
    requiredHeadings: [
      "Una web que explica tu especialidad con rigor",
      "De la consulta inicial a una presencia profesional",
    ],
  },
]

const forbiddenClaimPatterns = [
  {
    label: "guaranteed results",
    pattern: /\b(?:garantizamos|garantizo|te garantizo|aseguramos|aseguro)\b/i,
  },
  {
    label: "guaranteed ranking",
    pattern: /\b(?:n(?:ú|u)mero\s*1|primera\s+posici(?:ó|o)n|top\s*[1-3])\b/i,
  },
  { label: "unsupported percentage", pattern: /\b(?:99|100)\s?%\b/i },
  {
    label: "exact delivery promise",
    pattern: /\b(?:en|en solo)\s+\d+\s+d[ií]as?\b/i,
  },
]

const failures = []
const pageTexts = []

const parseAttributes = (tag) =>
  Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/gs)].map((match) => [
      match[1].toLowerCase(),
      match[3],
    ]),
  )

const extractTags = (html, tagName) =>
  [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, "gi"))].map((match) => match[0])

const extractScriptBlocks = (html) =>
  [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].map((match) => ({
    tag: `<script${match[1]}>`,
    content: match[2],
  }))

const extractText = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()

const normalizedWords = (text) =>
  extractText(text)
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .match(/[\p{L}\p{N}]+/gu) ?? []

const wordNgrams = (words, size = 3) => {
  const grams = new Set()
  for (let index = 0; index <= words.length - size; index += 1) {
    grams.add(words.slice(index, index + size).join(" "))
  }
  return grams
}

const ngramSimilarity = (left, right) => {
  const leftGrams = wordNgrams(normalizedWords(left))
  const rightGrams = wordNgrams(normalizedWords(right))
  const intersection = [...leftGrams].filter((gram) => rightGrams.has(gram)).length
  const union = new Set([...leftGrams, ...rightGrams]).size
  return union === 0 ? 0 : intersection / union
}

for (const page of pages) {
  const file = path.join(distRoot, page.slug, "index.html")
  const html = await readFile(file, "utf8").catch(() => null)

  if (!html) {
    failures.push(`${page.sector}: rendered page missing (${path.relative(repoRoot, file)})`)
    continue
  }

  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? ""
  const text = extractText(main)
  const canonicalTag = extractTags(html, "link").find(
    (tag) => parseAttributes(tag).rel?.toLowerCase().split(/\s+/).includes("canonical"),
  )
  const canonical = canonicalTag ? parseAttributes(canonicalTag).href : undefined
  const schemas = extractScriptBlocks(html).flatMap(({ tag, content }) => {
    const attributes = parseAttributes(tag)
    if (attributes.type?.toLowerCase() !== "application/ld+json") return []
    const json = content
    try {
      const parsed = JSON.parse(json)
      return Array.isArray(parsed) ? parsed : [parsed]
    } catch {
      return []
    }
  })
  const schemaTypes = new Set(
    schemas
      .flatMap((schema) =>
        Array.isArray(schema?.["@type"]) ? schema["@type"] : [schema?.["@type"]],
      )
      .filter(Boolean),
  )
  const headings = [...main.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)].map((match) =>
    extractText(match[1]),
  )
  pageTexts.push({ sector: page.sector, text })

  if (canonical !== `https://nuriaromero.dev/${page.slug}/`) {
    failures.push(`${page.sector}: canonical does not match the rendered route`)
  }
  for (const schemaType of ["Service", "FAQPage", "BreadcrumbList"]) {
    if (!schemaTypes.has(schemaType)) {
      failures.push(`${page.sector}: missing ${schemaType} JSON-LD schema`)
    }
  }

  for (const heading of page.requiredHeadings) {
    if (!headings.includes(heading)) {
      failures.push(`${page.sector}: missing sector-specific section heading "${heading}"`)
    }
  }

  for (const { label, pattern } of forbiddenClaimPatterns) {
    if (pattern.test(text)) {
      failures.push(`${page.sector}: unauthorized-claim guard matched ${label}`)
    }
  }
}

for (let index = 0; index < pageTexts.length; index += 1) {
  for (let compareIndex = index + 1; compareIndex < pageTexts.length; compareIndex += 1) {
    const similarity = ngramSimilarity(pageTexts[index].text, pageTexts[compareIndex].text)
    if (similarity >= 0.85) {
      failures.push(
        `${pageTexts[index].sector} and ${pageTexts[compareIndex].sector}: rendered copy is too similar (${(similarity * 100).toFixed(1)}%)`,
      )
    }
  }
}

const task = await readFile(taskFile, "utf8")
const sharedBlockDocumentation = [
  "## Bloques compartidos que se mantienen",
  "CTA final",
  "Precio desde 399 €",
  "datos legales",
]

for (const marker of sharedBlockDocumentation) {
  if (!task.includes(marker)) {
    failures.push(`task documentation: missing shared-block marker "${marker}"`)
  }
}

if (failures.length > 0) {
  console.error(`SEO-05 check failed (${failures.length} issue${failures.length === 1 ? "" : "s"}):`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exitCode = 1
} else {
  console.log(
    `SEO-05 check passed: ${pages.length} rendered niche pages have sector headings, sufficiently distinct copy, no explicit guarded claims, and documented shared blocks.`,
  )
}
