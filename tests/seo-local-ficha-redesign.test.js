import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8")
const seoLocalData = async () => {
  const services = await source("src/data/services.ts")
  return services.slice(services.indexOf("export const seoLocal"), services.indexOf("export const capilarLocal"))
}

test("T1: serif accent font is installed and the layout exposes optional slots with default fallbacks", async () => {
  const [pkg, layout, types, data] = await Promise.all([
    source("package.json"),
    source("src/layouts/ServiceLayout.astro"),
    source("src/data/types.ts"),
    seoLocalData(),
  ])

  assert.match(pkg, /"@fontsource\/instrument-serif"/)
  for (const name of ["hero", "benefits", "process"]) {
    assert.match(layout, new RegExp(`<slot name="${name}">[\\s\\S]*?</slot>`))
  }
  assert.match(layout, /<slot name="hero">[\s\S]*?<ServiceHero/)
  assert.match(layout, /<slot name="benefits">[\s\S]*?<BenefitsGrid/)
  assert.match(layout, /<slot name="process">[\s\S]*?<ProcessSteps/)
  assert.match(types, /titleAccent\?:\s*string/)
  assert.match(data, /titleAccent:\s*"cuando importa"/)
  assert.ok(data.includes("La pregunta es si te encuentran cuando importa."))
})

test("T2: hero, listing mock and proof strip honour the proof and label rules", async () => {
  const [hero, heading, mock, proof, site, route] = await Promise.all([
    source("src/components/seo-local/SeoLocalHero.astro"),
    source("src/components/seo-local/SectionHeading.astro"),
    source("src/components/seo-local/ListingMock.astro"),
    source("src/components/seo-local/ProofStrip.astro"),
    source("src/data/site.ts"),
    source("src/pages/seo-local-sevilla.astro"),
  ])

  assert.match(heading, /instrument-serif\/400-italic\.css/)
  assert.match(hero, /<SectionHeading[^>]*level="h1"/)
  assert.match(route, /titleAccent/)
  assert.match(hero, /<BookingButton/)
  assert.match(route, /Ver los planes/)
  assert.match(route, /href: "#precios"/)
  assert.match(mock, /Ejemplo ilustrativo/)
  assert.match(mock, /Tu negocio/)
  for (const label of ["Horarios actualizados", "Servicios claros", "Fotos nuevas", "Reseñas respondidas"]) {
    assert.ok(mock.includes(label), label)
  }
  assert.match(mock, /prefers-reduced-motion:\s*no-preference/)
  assert.match(site, /\+10 años/)
  assert.match(site, /de experiencia/)
  assert.match(site, /2 webs en Sevilla/)
  assert.match(proof, /items\.length > 0/)
  assert.match(route, /reviewsData\s*\?/)
  assert.match(route, /<ProofStrip items=\{proofItems\}/)
  assert.match(route, /getGoogleReviews\(\)/)
  assert.match(route, /<SeoLocalHero/)
  assert.match(route, /slot="hero"/)
})


test("T3: review bento is asymmetric, has six drawn tiles and one illustrative label", async () => {
  const [bento, tile, heading, route] = await Promise.all([
    source("src/components/seo-local/ReviewBento.astro"),
    source("src/components/seo-local/BentoTile.astro"),
    source("src/components/seo-local/SectionHeading.astro"),
    source("src/pages/seo-local-sevilla.astro"),
  ])

  assert.match(route, /Qué se revisa para que/)
  assert.match(heading, /instrument-serif\/400-italic\.css/)
  assert.match(route, /te encuentren/)
  assert.match(bento, /grid-template-areas/)
  assert.match(tile, /@media \(max-width:\s*767px\)/)
  assert.equal((route.match(/<BentoTile\b/g) ?? []).length, 6)
  assert.equal((tile.match(/<h3/g) ?? []).length, 2, "one h3 per tile layout")
  assert.ok((route.match(/<svg/g) ?? []).length >= 6)
  assert.equal((bento.match(/Ejemplo ilustrativo/g) ?? []).length, 1)
  assert.equal((route.match(/Ejemplo ilustrativo/g) ?? []).length, 0)
  assert.match(route, /fontanero cerca de mí/)
  assert.match(route, /llamadas/)
  assert.match(route, /clics/)
  assert.match(route, /rutas/)
  assert.doesNotMatch(bento + tile, /pacientes|tratamientos|garantiz/i)
  assert.doesNotMatch(route, /pacientes|tratamientos|garantiz/i)
  assert.match(route, /<ReviewBento[\s\S]*?headingId="revision-title"/)
})

test("batch A review fixes: singular opinion, caption attached to grid, balanced ficha tile, one matched state per directory row", async () => {
  const [route, bento] = await Promise.all([
    source("src/pages/seo-local-sevilla.astro"),
    source("src/components/seo-local/ReviewBento.astro"),
  ])

  assert.match(route, /userRatingCount === 1 \? "opinión" : "opiniones"/)
  assert.ok(bento.indexOf("{caption}") > bento.indexOf('class="bento"'), "caption must follow the grid")
  assert.match(bento, /caption = "Ejemplo ilustrativo"/)
  assert.match(bento, /class="bento-caption"/)
  assert.match(route, /<svg viewBox="0 40 360 150"/)
  assert.doesNotMatch(route, /<circle cx="28" cy="(24|65|106)" r="7" class="soft">/)
})

test("T4: process section shows the real person, a timeline without numerals and an accessible monthly cycle", async () => {
  const [proc, cycle, route, layout] = await Promise.all([
    source("src/components/seo-local/SeoLocalProcess.astro"),
    source("src/components/seo-local/SeoLocalCycle.astro"),
    source("src/pages/seo-local-sevilla.astro"),
    source("src/layouts/ServiceLayout.astro"),
  ])

  assert.match(route, /text: "Hablas con quien hace el trabajo", accent: "quien hace el trabajo"/)
  assert.match(cycle, /instrument-serif\/400-italic\.css/)
  assert.match(proc, /import \{ Image \} from "astro:assets"/)
  assert.match(proc, /@\/assets\/perfil-home\.webp/)
  assert.match(proc, /portraitAlt = "Nuria Romero, desarrolladora web freelance en Sevilla"/)
  assert.match(proc, /alt=\{portraitAlt\}/)
  assert.match(proc, /loading="lazy"/)
  assert.match(proc, /<figcaption>\{portraitAlt\}<\/figcaption>/)
  assert.match(route, /steps=\{seoLocal\.process\}/)
  assert.match(proc, /class="timeline"/)
  assert.doesNotMatch(proc, /list-style:\s*decimal/)
  for (const label of ["Trabajo revisable", "Prioridades acordadas", "Vídeo-informe mensual", "cada mes"]) {
    assert.ok(route.includes(label), label)
  }
  assert.match(cycle, /<svg[^>]*class="cycle-diagram"[^>]*aria-hidden="true"/)
  assert.match(cycle, /<marker|<path[^>]*class="[^"]*\barrow\b/)
  assert.match(proc, /aria-labelledby=\{headingId\}/)
  assert.match(proc, /<SectionHeading[\s\S]*?id=\{headingId\}/)
  assert.match(route, /headingId="proceso-title"/)
  assert.match(cycle, /class="cycle-list"/)
  assert.doesNotMatch(proc + cycle, /pacientes|tratamientos|garantiz/i)
  assert.doesNotMatch(proc + cycle, /(?:transition|animation):/)
  assert.match(route, /<SeoLocalProcess/)
  assert.match(route, /slot="process"/)
  assert.match(layout, /<slot name="process">/)
})

test("T5: real proof section reuses reviews and the two client sites, with no KPI figures", async () => {
  const [proof, route, layout] = await Promise.all([
    source("src/components/seo-local/RealProof.astro"),
    source("src/pages/seo-local-sevilla.astro"),
    source("src/layouts/ServiceLayout.astro"),
  ])

  assert.match(route, /text: "Trabajo que puedes ver", accent: "puedes ver"/)
  assert.match(proof, /reviews\.reviews\[0\]/)
  assert.match(proof, /<Projects only=\{projects\}/)
  assert.match(route, /projects=\{\["arkady", "adfsevilla"\]\}/)
  assert.match(proof, /aria-labelledby=\{headingId\}/)
  assert.match(proof, /<SectionHeading[\s\S]*?id=\{headingId\}/)
  assert.match(route, /headingId="prueba-title"/)
  assert.doesNotMatch(proof, /pacientes|tratamientos|garantiz|%/i)
  assert.match(route, /getGoogleReviews\(\)/)
  assert.equal((route.match(/getGoogleReviews\(\)/g) ?? []).length, 1)
  assert.match(route, /<RealProof[\s\S]*?reviews=\{reviewsData\}/)
  assert.match(layout, /<slot name="before-pricing" \/>/)
})

test("T6: plans use the dark language, mark Local Pro as recommended and leave other pages untouched", async () => {
  const [plans, layout, route] = await Promise.all([
    source("src/components/seo-local/SeoLocalPlans.astro"),
    source("src/layouts/ServiceLayout.astro"),
    source("src/pages/seo-local-sevilla.astro"),
  ])

  assert.match(plans, /id="precios"/)
  assert.match(plans, /seoLocal\.pricing\.tiers/)
  assert.match(plans, /Recomendado/)
  assert.match(plans, /<BookingButton/)
  assert.match(plans, /tier\.ctaLabel/)
  assert.match(plans, /rgb\(250 204 21\)/)
  assert.doesNotMatch(plans, /pacientes|tratamientos|garantiz|✓/i)
  assert.match(layout, /<slot name="pricing">[\s\S]*?<PricingCard/)
  assert.match(route, /slot="pricing"/)
})

test("review fix round 1: padded cycle viewBox, sr-only cycle list, stretched photo column", async () => {
  const [proc, cycle] = await Promise.all([
    source("src/components/seo-local/SeoLocalProcess.astro"),
    source("src/components/seo-local/SeoLocalCycle.astro"),
  ])

  assert.match(cycle, /viewBox="0 0 440 300"/)
  assert.match(cycle, /\.cycle-list \{[^}]*position:\s*absolute[^}]*clip:\s*rect\(0,\s*0,\s*0,\s*0\)/)
  assert.match(proc, /\.person \{[^}]*display:\s*flex/)
  assert.match(proc, /object-fit:\s*cover/)
})

test("finish review: layout exposes faq, related and closing slots with legacy fallbacks", async () => {
  const layout = await source("src/layouts/ServiceLayout.astro")

  assert.match(layout, /<slot name="faq"><SectionContainer>[\s\S]*?<FAQ[\s\S]*?<\/SectionContainer><\/slot>/)
  assert.match(layout, /<slot name="related"><SectionContainer>[\s\S]*?<InternalLinks[\s\S]*?<\/SectionContainer><\/slot>/)
  assert.match(layout, /<slot name="closing"><SectionContainer>[\s\S]*?<CTASection[\s\S]*?<\/SectionContainer><\/slot>/)
})

test("finish review: FAQ, related links and closing CTA are bespoke and keep the data", async () => {
  const [faq, related, closing, route] = await Promise.all([
    source("src/components/seo-local/SeoLocalFaq.astro"),
    source("src/components/seo-local/SeoLocalRelated.astro"),
    source("src/components/seo-local/SeoLocalClosing.astro"),
    source("src/pages/seo-local-sevilla.astro"),
  ])

  assert.match(faq, /seoLocal\.faqs/)
  assert.match(faq, /<details/)
  assert.match(faq, /<summary/)
  assert.match(faq, /<BookingButton/)
  assert.match(faq, /aria-labelledby="faq-title"[\s\S]*?id="faq-title"/)
  assert.match(faq, /<em>/)
  assert.match(faq, /class="indicator"[^>]*aria-hidden="true"/)
  assert.doesNotMatch(faq, /ProfileCheck|›/)
  assert.match(faq, /:focus-visible/)

  assert.match(related, /internalLinksBySource/)
  assert.match(related, /<nav[^>]*aria-label="Contenido relacionado"/)
  assert.match(related, /links\.length > 0/)
  assert.doesNotMatch(related, /rounded-xl|bg-gray/)

  assert.match(route, /<ListingMock slot="visual" animate=\{false\}/)
  assert.match(closing, /<BookingButton/)
  assert.match(route, /seoLocal\.cta/)
  assert.match(route, /accent: "tu presencia local"/)
  assert.match(closing, /aria-labelledby=\{headingId\}/)
  assert.match(closing, /<SectionHeading\s+id=\{headingId\}/)
  assert.match(route, /headingId="cierre-title"/)

  for (const slot of ["faq", "related", "closing"]) assert.match(route, new RegExp(`slot="${slot}"`))
})

test("finish review: the hero listing fills in on a scroll timeline with a completed fallback", async () => {
  const mock = await source("src/components/seo-local/ListingMock.astro")

  assert.match(mock, /animation-timeline:\s*scroll\(/)
  assert.match(mock, /@supports \(animation-timeline:\s*scroll\(\)\)/)
  assert.match(mock, /prefers-reduced-motion:\s*no-preference/)
  assert.match(mock, /class="scene"/)
  assert.match(mock, /class="rating-row"/)
  assert.match(mock, /animate\?:\s*boolean/)
  assert.match(mock, /Ejemplo ilustrativo/)
  assert.doesNotMatch(mock, /\d[,.]\d\s*(?:\/|sobre)/)
})

test("finish review: bento is truly asymmetric, measurement reads side by side, labels are legible", async () => {
  const [bento, tile] = await Promise.all([
    source("src/components/seo-local/ReviewBento.astro"),
    source("src/components/seo-local/BentoTile.astro"),
  ])

  assert.match(bento, /"a a a a b b"/)
  assert.match(bento, /"c c d d d d"/)
  assert.match(bento, /"c c e e e e"/)
  assert.match(tile, /\.tile-row\s*\{[^}]*flex-direction:\s*row/)
  const sizes = [...tile.matchAll(/\.tile :global\(\.(?:label|strong)\) \{[^}]*font-size:\s*(\d+)px/g)].map((m) => Number(m[1]))
  assert.ok(sizes.length >= 1 && sizes.every((size) => size >= 17), `label sizes ${sizes}`)
})

test("finish review: real proof renders one pull-quote and the proof strip is a three-cell band", async () => {
  const [proof, strip, site] = await Promise.all([
    source("src/components/seo-local/RealProof.astro"),
    source("src/components/seo-local/ProofStrip.astro"),
    source("src/data/site.ts"),
  ])

  assert.match(proof, /<blockquote/)
  assert.match(proof, /reviews\.reviews\[0\]|reviews\?\.reviews/)
  assert.doesNotMatch(proof, /import GoogleReviews/)
  assert.match(proof, /Projects only=\{projects\}/)
  assert.match(site, /stat: "\+10 años", label: "de experiencia"/)
  assert.match(site, /stat: "2 webs en Sevilla", label: "de negocios locales"/)
  assert.match(strip, /<strong>\{item\.stat\}<\/strong>/)
  assert.match(strip, /border-left/)
})

test("finish review: ink-blue ground, cycle labels are large, plan buttons align and Pro is lifted on purpose", async () => {
  const [route, proc, plans, hero] = await Promise.all([
    source("src/pages/seo-local-sevilla.astro"),
    source("src/components/seo-local/SeoLocalCycle.astro"),
    source("src/components/seo-local/SeoLocalPlans.astro"),
    source("src/components/seo-local/SeoLocalHero.astro"),
  ])

  assert.match(route, /<style is:global>[\s\S]*?main\s*\{[\s\S]*?rgb\(5 10 24\)/)
  assert.match(route, /\.band\b/)
  assert.match(hero, /radial-gradient/)
  const cycle = [...proc.matchAll(/\.cycle-diagram :global\(\.(?:label|centre)\) \{[^}]*font-size:\s*(\d+)px/g)].map((m) => Number(m[1]))
  assert.ok(cycle.length === 2 && cycle.every((size) => size >= 19), `cycle sizes ${cycle}`)
  assert.match(proc, /text-anchor="middle" class="label">\{third\[0\]\}/)
  assert.match(plans, /\.plan :global\(a\)[\s\S]*?margin-top:\s*auto|\.plan-cta\s*\{[^}]*margin-top:\s*auto/)
  assert.match(plans, /\.plan\.recommended\s*\{[^}]*margin-top:\s*-0\.75rem/)
})

test("bento named areas are not reset by a later grid-column: auto", async () => {
  const [bento, tile] = await Promise.all([
    source("src/components/seo-local/ReviewBento.astro"),
    source("src/components/seo-local/BentoTile.astro"),
  ])

  assert.doesNotMatch(bento + tile, /grid-area:\s*\w+;\s*grid-column:\s*auto/)
})

test("hero glow pool never bleeds past the page gutter (no horizontal scroll on mobile)", async () => {
  const hero = await source("src/components/seo-local/SeoLocalHero.astro")

  assert.match(hero, /\.hero-visual::before\s*\{[^}]*inset:\s*-25%\s+-1rem/)
})

test("the agency section follows the kw + display pattern and has one heading", async () => {
  const [agencia, route, css] = await Promise.all([
    source("src/components/seo-local/SeoLocalAgencia.astro"),
    source("src/pages/seo-local-sevilla.astro"),
    source("src/styles/template.css"),
  ])

  assert.match(agencia, /<section[^>]*id=\{id\}[^>]*aria-labelledby=\{headingId\}/)
  assert.match(agencia, /id = "agencia-o-consultora"/)
  assert.match(agencia, /<SectionHeading[\s\S]*?id=\{headingId\}/)
  assert.match(route, /<SeoLocalAgencia[\s\S]*?headingId="agencia-title"[\s\S]*?keyword="¿Agencia SEO en Sevilla o consultora\?"/)
  assert.equal((agencia.match(/<h1/g) ?? []).length, 0)
  assert.equal((agencia.match(/<h3/g) ?? []).length, 0)
  assert.match(css, /\.tpl-kw \{[^}]*font-weight:\s*600[^}]*\}/)
  assert.doesNotMatch(css, /\.tpl-kw \{[^}]*(?:uppercase|letter-spacing)/)
  assert.match(route, /href: "#precios"/)
})

test("listing pending state keeps text legible (>= 4.5:1 needs at least 0.7 opacity)", async () => {
  const mock = await source("src/components/seo-local/ListingMock.astro")

  assert.match(mock, /@keyframes check-in\s*\{\s*from\s*\{\s*opacity:\s*0\.(?:7|8|9)/)
})

test("T7: every section has a small keyword heading above its display title, one h1 only", async () => {
  const read = (name) => source(`src/components/seo-local/${name}.astro`)
  const [hero, bento, proc, proof, plans, faq, closing, data, route, css] = await Promise.all([
    read("SeoLocalHero"), read("ReviewBento"), read("SeoLocalProcess"), read("RealProof"),
    read("SeoLocalPlans"), read("SeoLocalFaq"), read("SeoLocalClosing"), seoLocalData(),
    source("src/pages/seo-local-sevilla.astro"), source("src/styles/template.css"),
  ])
  const keyword = (text, id, label) => {
    const kw = text.indexOf(`<h2 id="${id}" class="kw">${label}</h2>`)
    assert.ok(kw >= 0, `${id} keyword heading`)
    assert.ok(text.indexOf('class="display"') > kw, `${id} display title follows the keyword heading`)
  }

  const routeKeyword = (id, label) =>
    assert.match(route, new RegExp(`headingId="${id}"\\s+keyword="${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`), id)
  routeKeyword("revision-title", "Posicionamiento web en Sevilla: Google y Google Maps")
  routeKeyword("proceso-title", "Cómo trabajamos el SEO local en Sevilla")
  routeKeyword("prueba-title", "Webs de negocios locales en Sevilla")
  for (const section of [bento, proc, proof]) assert.match(section, /<SectionHeading[\s\S]*?id=\{headingId\}[\s\S]*?keyword=\{keyword\}/)
  keyword(plans, "planes-title", "Cuánto cuesta el SEO local en Sevilla")
  keyword(faq, "faq-title", "Preguntas frecuentes sobre SEO local en Sevilla")
  assert.match(route, /headingId="cierre-title"\s+keyword="Reserva una llamada sobre SEO local en Sevilla"/)
  assert.match(closing, /<SectionHeading\s+id=\{headingId\}\s+keyword=\{keyword\}/)
  assert.match(hero, /<SectionHeading[\s\S]*?level="h1"[\s\S]*?keyword=\{keyword\}/)
  assert.match(route, /keyword=\{seoLocal\.hero\.h1\}/)
  assert.match(data, /h1:\s*"SEO local Sevilla y posicionamiento web"/)
  assert.match(data, /title:\s*"Tu negocio está en Sevilla\. La pregunta es si te encuentran cuando importa\."/)
  assert.match(data, /title:\s*"SEO local Sevilla y posicionamiento web \| Desde 300 €\/mes \+ IVA"/)
  for (const heading of ["Ficha de Google Business Profile", "Datos coherentes en directorios locales", "Búsquedas locales en Sevilla", "Reseñas de Google", "Web para negocios locales", "Medición de llamadas, clics y rutas"]) {
    assert.ok(route.includes(`title="${heading}"`), heading)
  }
  for (const component of [bento, proc, proof, plans, faq]) {
    assert.equal((component.match(/<h1/g) ?? []).length, 0)
    assert.doesNotMatch(component, /<h[1-3][^>]*>[^<]*agencia/i)
  }
  for (const component of [plans, faq]) {
    assert.match(component, /\.kw \{[^}]*font-weight:\s*600[^}]*\}/)
    assert.doesNotMatch(component, /\.kw \{[^}]*(?:uppercase|letter-spacing)/)
  }
  assert.equal((closing.match(/<h1/g) ?? []).length, 0)
  assert.match(css, /\.tpl-kw \{[^}]*font-weight:\s*600[^}]*\}/)
  assert.doesNotMatch(css, /\.tpl-kw \{[^}]*(?:uppercase|letter-spacing)/)
  assert.match(data, /¿Cómo puede aparecer mi negocio en Google Maps\?/)
  assert.match(data, /¿Eres una agencia de SEO local\?/)
  assert.match(data, /nadie puede prometer la primera posición/)
})

test("meta description is human, keeps both prices and fits in a search snippet", async () => {
  const data = await seoLocalData()
  const match = data.match(/seo:\s*\{[\s\S]*?description:\s*\n?\s*"([^"]+)"/)

  assert.ok(match, "seoLocal.seo.description not found")
  const description = match[1]
  assert.ok(description.length <= 160, `description is ${description.length} chars`)
  assert.match(description, /^Me dedico a posicionar negocios en Google/)
  assert.match(description, /SEO local en Sevilla/)
  assert.match(description, /300 €\/mes \+ IVA/)
  assert.match(description, /500 €\/mes \+ IVA/)
})

test("hero subtitle sells the work without defensive disclaimers", async () => {
  const data = await seoLocalData()
  const match = data.match(/subtitle:\s*\n?\s*"([^"]+)"/)

  assert.ok(match, "seoLocal.hero.subtitle not found")
  const subtitle = match[1]
  assert.ok(subtitle.length <= 200, `subtitle is ${subtitle.length} chars`)
  assert.match(subtitle, /^Tus clientes te buscan en Google/)
  assert.match(subtitle, /cada mes/)
  assert.doesNotMatch(subtitle, /sin promesas/i)
})

test("plans note and proof line state facts without legalistic disclaimers", async () => {
  const [data, proof] = await Promise.all([seoLocalData(), source("src/components/seo-local/RealProof.astro")])

  assert.match(data, /note:\s*"Se factura mes a mes y no hay cuota de puesta en marcha aparte\."/)
  assert.doesNotMatch(data.slice(data.indexOf("pricing:"), data.indexOf("tiers:")), /en esta página/)
  const route = await source("src/pages/seo-local-sevilla.astro")
  assert.match(route, /Dos webs reales de negocios de Sevilla, hechas por mí\. Puedes visitarlas y juzgar el trabajo por ti\./)
  assert.doesNotMatch(proof + route, /No publico cifras/)
})

test("T8: llms.txt carries the real offer, schema opts in to two monthly offers, NAP is published from the single source", async () => {
  const [llms, schema, layout, types, data, site, nap, route, check] = await Promise.all([
    source("public/llms.txt"),
    source("src/lib/schema.ts"),
    source("src/layouts/ServiceLayout.astro"),
    source("src/data/types.ts"),
    seoLocalData(),
    source("src/data/site.ts"),
    source("src/components/seo-local/SeoLocalNap.astro"),
    source("src/pages/seo-local-sevilla.astro"),
    source("scripts/check-seo-15.mjs"),
  ])

  const entry = llms.split("\n").find((line) => line.includes("/seo-local-sevilla/")) ?? ""
  assert.ok(entry.includes("300 €/mes + IVA") && entry.includes("500 €/mes + IVA"))
  assert.doesNotMatch(entry, /299|199|Proyecto inicial/i)
  assert.doesNotMatch(entry, /garantiz/i)

  assert.match(types, /offersFromTiers\?:\s*boolean/)
  assert.match(data, /offersFromTiers:\s*true/)
  assert.match(layout, /offersFromTiers/)
  assert.match(schema, /UnitPriceSpecification/)
  assert.match(schema, /unitText:\s*"MON"/)
  assert.match(schema, /valueAddedTaxIncluded:\s*false/)
  assert.match(schema, /\$\{serviceUrl\}#\$\{service\.id\}/)
  assert.match(layout, /id:\s*"service"/)
  assert.match(check, /unitText/)
  assert.match(check, /valueAddedTaxIncluded/)

  assert.ok(site.includes('full: "Camino Andalucía, 426, 41309 La Rinconada, Sevilla"'))
  assert.match(route, /<SeoLocalNap\s+headingId="nap-title"\s+keyword="SEO local desde La Rinconada, Sevilla"/)
  assert.match(nap, /<h2 id=\{headingId\} class="tpl-kw nap-kw">\s*\{keyword\}\s*<\/h2>/)
  assert.match(nap, /aria-labelledby=\{headingId\}/)
  assert.match(nap, /SITE\.address\.full/)
  assert.match(nap, /href=\{`tel:\+\$\{SITE\.whatsapp\}`\}/)
  assert.match(nap, /SITE\.phone/)
  assert.match(nap, /SITE\.name/)
  assert.match(nap, /href=\{SITE\.mapsUrl\}[\s\S]*?target="_blank"[\s\S]*?rel="noopener noreferrer"/)
  assert.match(nap, /Ver en Google Maps/)
  assert.match(nap, /:focus-visible/)
  assert.doesNotMatch(nap, /<iframe|<h1|uppercase/)
  assert.match(route, /<SeoLocalNap/)
})
