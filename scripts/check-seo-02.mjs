import { readdir, readFile } from "node:fs/promises"
import path from "node:path"

const distDir = path.resolve("dist")
const pages = [
  { url: "/diseno-web-sevilla/", breadcrumbName: "Diseño web en Sevilla" },
  { url: "/desarrollo-software-medida/", breadcrumbName: "Software a medida" },
  { url: "/automatizaciones/", breadcrumbName: "Automatizaciones" },
  { url: "/inteligencia-artificial/", breadcrumbName: "Inteligencia artificial" },
  { url: "/seo-local-sevilla/", breadcrumbName: "SEO local en Sevilla" },
  { url: "/tienda-online-sevilla/", breadcrumbName: "Tienda online en Sevilla" },
  { url: "/web-para-restaurantes-sevilla/", breadcrumbName: "Web para restaurantes" },
  { url: "/web-para-clinicas-sevilla/", breadcrumbName: "Web para clínicas" },
  { url: "/web-para-comercios-sevilla/", breadcrumbName: "Web para comercios" },
  { url: "/web-para-abogados-gestorias-sevilla/", breadcrumbName: "Web para despachos y gestorías" },
]

// SEO-15: shared Header/Footer nav routes that must also carry a trailing
// slash on every rendered page, not just the 10 canonical service/niche
// pages checked above.
const sharedNavPages = [
  "/portfolio/",
  "/blog/",
  "/sobre-mi/",
  "/contacto/",
  "/aviso-legal/",
  "/privacidad/",
  "/cookies/",
]

const withoutSlash = (url) => url.endsWith("/") ? url.slice(0, -1) : url
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
const getSections = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?</${tag}>`, "gi"))].map((match) => match[0])
const getHrefs = (html) => [...html.matchAll(/\bhref\s*=\s*(?:["']([^"']*)["']|([^\s>]+))/gi)].map((match) => match[1] ?? match[2])

// SEO-15 follow-up: Header.astro's <header> element closes right after the
// desktop <nav>; the mobile-menu drawer (#mobile-menu-overlay / #mobile-menu)
// is a sibling <div> rendered immediately after </header>, not nested inside
// it, and duplicates the same shared-nav links. A plain <header>...</header>
// capture misses it entirely, which would let a mobile-only bare-href
// regression pass undetected. Widen the "header" section to also span the
// adjacent #mobile-menu drawer, located by ID and closed via balanced <div>
// counting (not assumed strict nesting), bounded to a nearby window so it
// can never swallow unrelated or footer content.
const findMatchingDivClose = (html, fromIndex) => {
  const tagPattern = /<div\b[^>]*>|<\/div\s*>/gi
  tagPattern.lastIndex = fromIndex
  let depth = 1
  let match
  while ((match = tagPattern.exec(html))) {
    if (match[0].toLowerCase().startsWith("<div")) {
      if (!match[0].endsWith("/>")) depth++
    } else {
      depth--
      if (depth === 0) return match.index + match[0].length
    }
  }
  return -1
}

const getHeaderSections = (html) => {
  const headerPattern = /<header\b[^>]*>[\s\S]*?<\/header>/gi
  const mobileMenuOpenPattern = /<div\b[^>]*\bid\s*=\s*["']mobile-menu["'][^>]*>/i
  const searchWindowSize = 20000
  const sections = []
  let match

  while ((match = headerPattern.exec(html))) {
    const headerStart = match.index
    const headerEnd = match.index + match[0].length
    const window = html.slice(headerEnd, headerEnd + searchWindowSize)
    const mobileMenuMatch = mobileMenuOpenPattern.exec(window)

    if (mobileMenuMatch) {
      const openTagEnd = headerEnd + mobileMenuMatch.index + mobileMenuMatch[0].length
      const closeIdx = findMatchingDivClose(html, openTagEnd)
      if (closeIdx !== -1) {
        sections.push(html.slice(headerStart, closeIdx))
        continue
      }
    }

    sections.push(match[0])
  }

  return sections
}
const getJsonLdBlocks = (html) => [...html.matchAll(/<script\b[^>]*\btype\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((match) => match[1])
const failures = []
const failureSet = new Set()

const addFailure = (message) => {
  if (!failureSet.has(message)) {
    failureSet.add(message)
    failures.push(message)
  }
}

const findHtmlFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => [])
  const files = await Promise.all(entries.map(async (entry) => {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) return findHtmlFiles(file)
    return entry.isFile() && entry.name.endsWith(".html") ? [file] : []
  }))
  return files.flat()
}

const isBareTargetUrl = (value, bareUrl) => {
  if (typeof value !== "string") return false
  const normalized = value.trim()
  if (normalized === bareUrl || new RegExp(`^${escapeRegExp(bareUrl)}(?:[?#]|$)`).test(normalized)) return true

  try {
    const url = new URL(normalized)
    return url.hostname === "nuriaromero.dev" && url.pathname === bareUrl
  } catch {
    return false
  }
}

const collectJsonStrings = (value, strings = []) => {
  if (typeof value === "string") strings.push(value)
  else if (Array.isArray(value)) value.forEach((entry) => collectJsonStrings(entry, strings))
  else if (value && typeof value === "object") Object.values(value).forEach((entry) => collectJsonStrings(entry, strings))
  return strings
}

const parseBreadcrumbItems = (html) => {
  const breadcrumbItems = []
  for (const block of getJsonLdBlocks(html)) {
    try {
      const schema = JSON.parse(block)
      const schemas = Array.isArray(schema) ? schema : [schema]
      for (const entry of schemas) {
        if (entry?.["@type"] !== "BreadcrumbList") continue
        for (const item of entry.itemListElement ?? []) {
          if (typeof item?.item === "string") breadcrumbItems.push(item.item)
        }
      }
    } catch {
      // Other checks/build validation own malformed JSON-LD; this check only inspects valid BreadcrumbList blocks.
    }
  }
  return breadcrumbItems
}

const htmlFiles = await findHtmlFiles(distDir)
if (htmlFiles.length === 0) addFailure(`dist: no HTML files found under ${distDir}`)

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8")
  const relativeFile = path.relative(distDir, file)
  const hrefs = getHrefs(html)
  const schemaUrls = getJsonLdBlocks(html).flatMap((block) => {
    try {
      return collectJsonStrings(JSON.parse(block))
    } catch {
      return []
    }
  })
  const breadcrumbs = getSections(html, "nav").filter((section) => /aria-label\s*=\s*["']Miga de pan["']/i.test(section))

  for (const { url: page } of pages) {
    const bareUrl = withoutSlash(page)
    if (hrefs.some((href) => isBareTargetUrl(href, bareUrl))) {
      addFailure(`${relativeFile}: internal href omits trailing slash (${bareUrl})`)
    }
    if (schemaUrls.some((url) => isBareTargetUrl(url, bareUrl))) {
      addFailure(`${relativeFile}: schema URL omits trailing slash (${bareUrl})`)
    }
    if (breadcrumbs.some((breadcrumb) => new RegExp(`(?:["']|\\s)${escapeRegExp(bareUrl)}(?:["'<\\s?#]|$)`).test(breadcrumb))) {
      addFailure(`${relativeFile}: visible breadcrumb URL omits trailing slash (${bareUrl})`)
    }
  }

  const navFooterSections = [...getHeaderSections(html), ...getSections(html, "footer")]
  for (const page of sharedNavPages) {
    const bareUrl = withoutSlash(page)
    if (navFooterSections.some((section) => getHrefs(section).some((href) => isBareTargetUrl(href, bareUrl)))) {
      addFailure(`${relativeFile}: shared nav/footer href omits trailing slash (${bareUrl})`)
    }
  }
}

for (const { url: page, breadcrumbName } of pages) {
  const file = path.join(distDir, page.slice(1), "index.html")
  let html

  try {
    html = await readFile(file, "utf8")
  } catch {
    addFailure(`${page}: missing ${file}`)
    continue
  }

  const canonicalPattern = new RegExp(
    `<link[^>]+rel=["']canonical["'][^>]+href=["'][^"']*${escapeRegExp(page)}["']`,
  )
  if (!canonicalPattern.test(html)) {
    addFailure(`${page}: canonical link with trailing slash not found`)
  }

  const hrefs = getHrefs(html)
  if (!hrefs.includes(page)) {
    addFailure(`${page}: no internal href uses canonical trailing-slash URL (${page})`)
  }

  const bareHref = withoutSlash(page)
  const breadcrumbItems = parseBreadcrumbItems(html)
  if (breadcrumbItems.some((item) => isBareTargetUrl(item, bareHref))) {
    addFailure(`${page}: BreadcrumbList item omits trailing slash (${bareHref})`)
  }
  if (!breadcrumbItems.some((item) => item === page || item.endsWith(page))) {
    addFailure(`${page}: BreadcrumbList item with trailing slash not found`)
  }

  const breadcrumb = getSections(html, "nav").find((section) => /aria-label\s*=\s*["']Miga de pan["']/i.test(section))
  if (!breadcrumb) {
    addFailure(`${page}: visible breadcrumb navigation not found`)
  } else {
    if (!breadcrumb.includes('aria-current="page"') || !breadcrumb.includes(breadcrumbName)) {
      addFailure(`${page}: visible breadcrumb does not identify the current page`)
    }
    if (getHrefs(breadcrumb).some((href) => isBareTargetUrl(href, bareHref))) {
      addFailure(`${page}: visible breadcrumb omits trailing slash (${bareHref})`)
    }
  }
}

const home = await readFile(path.join(distDir, "index.html"), "utf8").catch(() => null)
if (!home) {
  addFailure("/: missing dist/index.html")
} else {
  const homeContent = getSections(home, "main").join("\n")
  const header = getHeaderSections(home).join("\n")
  const footer = getSections(home, "footer").join("\n")

  for (const { url: page } of pages) {
    const bareHref = withoutSlash(page)
    for (const [name, section] of [["home", homeContent], ["navigation", header], ["footer", footer]]) {
      const hrefs = getHrefs(section)
      if (!hrefs.includes(page)) {
        addFailure(`${name}: missing canonical internal href (${page})`)
      }
      if (hrefs.some((href) => isBareTargetUrl(href, bareHref))) {
        addFailure(`${name}: internal href omits trailing slash (${bareHref})`)
      }
    }
  }
}

if (failures.length > 0) {
  console.error(`SEO-02 check failed (${failures.length} issue${failures.length === 1 ? "" : "s"}):`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exitCode = 1
} else {
  console.log(`SEO-02 check passed: scanned ${htmlFiles.length} HTML files; ${pages.length} canonical service/niche pages use trailing-slash internal links, breadcrumbs, schemas, and canonicals.`)
}
