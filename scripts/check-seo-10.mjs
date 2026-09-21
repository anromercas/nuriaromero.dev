import { readFile } from "node:fs/promises"

const html = await readFile("dist/seo-local-sevilla/index.html", "utf8")
const failures = []
const expect = (condition, message) => {
  if (!condition) failures.push(message)
}

expect(
  /id="prueba-social-verificable"/i.test(html),
  "SEO-10: la página de SEO local debe exponer el estado de prueba social verificable",
)
expect(
  /GBP propia[\s\S]{0,160}pendiente de decisión/i.test(html),
  "SEO-10: el estado de la GBP debe permanecer explícitamente pendiente",
)
expect(
  /No se muestran reseñas ni valoraciones/i.test(html),
  "SEO-10: la UI debe declarar que no se muestran reseñas ni valoraciones sin datos verificables",
)
expect(
  !/aggregateRating|reviewCount|"review"|Valoración media de [1-5]/i.test(html),
  "SEO-10: no deben renderizarse datos de rating/reseñas no verificados",
)
expect(
  !/google\.com\/maps|g\.page|placeid=/i.test(html),
  "SEO-10: no debe enlazarse una GBP o Maps hasta que exista un activo verificado",
)

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"))
  process.exit(1)
}

console.log("SEO-10 checks passed: local trust status is transparent and contains no unverified proof.")
