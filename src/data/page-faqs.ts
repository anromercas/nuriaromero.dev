// FAQs of pages that are not a ServicePageData (home and contact). They feed the
// visible FAQ, the FAQPage JSON-LD and the AI discovery files from one place.
import type { ServicePageData } from "@/data/types";
import { disenoWeb, seoLocal, tierFrom } from "./services.ts";

export const homeFaqs: ServicePageData["faqs"] = [
  {
    q: "¿Qué hace un consultor SEO?",
    a: "Revisa cómo apareces en Google y mejora lo que hace que te encuentren: tu ficha de Google, tu web y tus reseñas. En mi caso también hago la parte técnica de la web, así que no necesitas a otra persona para aplicar los cambios.",
  },
  {
    q: "¿Cuánto cobra un SEO al mes?",
    a: `Depende del alcance, y lo habitual es una cuota mensual. Yo publico mis precios: el Plan Local cuesta ${tierFrom(seoLocal, "Local")} y el Local Pro, ${tierFrom(seoLocal, "Local Pro")}, facturados mes a mes.`,
    links: [
      { label: "Ver los planes de SEO local", href: "/seo-local-sevilla/" },
    ],
  },
  {
    q: "¿Quién es el mejor consultor SEO?",
    a: "No hay un mejor consultor SEO para todo el mundo: el adecuado es el que encaja con tu negocio y te explica lo que hace. Fíjate en que publique precios y alcance, en que hables con quien hace el trabajo, en que enseñe trabajos reales y en que no te prometa posiciones.",
  },
  {
    q: "¿Qué es el SEO?",
    a: "Es el trabajo para que tu negocio aparezca en Google cuando alguien busca lo que ofreces, sin pagar por cada clic. Incluye tu web, tu ficha de Google y, cada vez más, cómo te mencionan los asistentes de IA.",
  },
  {
    q: "¿El SEO se paga?",
    a: "Aparecer en los resultados normales de Google es gratis: no pagas por cada clic ni por cada visita. Lo que se paga es el trabajo para conseguirlo, lo hagas tú, una agencia o una consultora.",
  },
  {
    q: "¿Qué diferencia hay entre SEO y SEM?",
    a: "El SEO trabaja para que aparezcas en los resultados normales de Google; el SEM son anuncios que pagas por cada clic. El SEO tarda más en notarse, pero lo que consigues no depende de seguir pagando cada clic.",
  },
];

export const contactFaqs: ServicePageData["faqs"] = [
  {
    q: "¿Cuánto cobra un SEO al mes?",
    a: `El plan Local cuesta ${tierFrom(seoLocal, "Local")} y el Local Pro, ${tierFrom(seoLocal, "Local Pro")}. Los dos son mensuales y en la página de SEO local tienes lo que incluye cada uno.`,
    links: [{ label: "Planes de SEO local", href: "/seo-local-sevilla/" }],
  },
  {
    q: "¿Cuánto cuesta hacer una página web?",
    a: `Una landing de una página parte de ${tierFrom(disenoWeb, "Landing de una página")} y una web completa de hasta 5 páginas, de ${tierFrom(disenoWeb, "Web completa (hasta 5 páginas)")}. El precio queda cerrado y pactado por escrito antes de empezar.`,
    links: [
      { label: "Diseño web en Sevilla", href: "/diseno-web-sevilla/" },
      {
        label: "Guía para entender el precio de una web",
        href: "/blog/cuanto-cuesta-una-pagina-web-en-sevilla/",
      },
    ],
  },
  {
    q: "¿Cuánto se tarda?",
    a: "Una web de negocio local suele estar lista en 2 a 4 semanas desde que tengo todos los contenidos. Si me escribes, te respondo en menos de 24 horas laborables, y el plazo exacto de tu proyecto se cierra en la propuesta.",
    links: [{ label: "Diseño web en Sevilla", href: "/diseno-web-sevilla/" }],
  },
  {
    q: "¿Mejor un freelance o una agencia?",
    a: "Conmigo hablas directamente con quien hace el trabajo, sin nadie en medio. Una agencia tiene más manos para llevar a la vez campañas, redes y diseño, así que depende de lo que necesites.",
    links: [
      {
        label: "Agencia o consultora",
        href: "/seo-local-sevilla/#agencia-o-consultora",
      },
    ],
  },
];
