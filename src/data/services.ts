// Contenido de las 4 páginas de servicio.
// Precios acordados: landing 149 €, web 5 páginas 399 €, automatización 149 €,
// chatbot IA 399 €, software a medida 999 €. Tienda online: precio y alcance en
// src/data/store-offer.ts.
import type { ServicePageData } from "@/data/types"
import { STORE_FROM, STORE_FINAL_PRICE_NOTE, storeIncludes } from "./store-offer.ts"

// Precios de diseño web para interpolar en el copy y el FAQ. Los `from` de los planes
// (guardados por tests/single-price-source.test.js) quedan como literales; un test
// de tests/diseno-web-template.test.js comprueba que ambos coinciden.
const LANDING_FROM = "149 €"
const WEB_FROM = "399 €"

/** `from` label of a named pricing tier; throws so a renamed tier fails the build. */
export function tierFrom(service: ServicePageData, tierName: string): string {
  const tier = service.pricing.tiers?.find((t) => t.name === tierName)
  if (!tier)
    throw new Error(`Pricing tier "${tierName}" not found in ${service.slug}`)
  return tier.from
}

export const disenoWeb: ServicePageData = {
  slug: "/diseno-web-sevilla/",
  offersFromTiers: true,
  tierBilling: "one-time",
  breadcrumbName: "Diseño web en Sevilla",
  seo: {
    title: "Diseño web Sevilla | Diseñadora web, precio cerrado desde 149 €",
    description:
      "Diseño páginas web en Sevilla con más de 10 años de experiencia: rápidas, con SEO local y precio cerrado. Web completa desde 399 €, landing desde 149 €.",
  },
  hero: {
    h1: "Diseño web Sevilla para negocios que quieren clientes, no solo una web bonita",
    title: "Tu web, hecha a medida y a tu nombre",
    titleAccent: "a tu nombre",
    subtitle: `Diseño y programo la web de tu negocio en Sevilla: rápida en el móvil, lista para Google y con precio cerrado desde ${LANDING_FROM}.`,
    secondaryCta: {
      label: "Ver precios",
      href: "#precios",
    },
  },
  sectionTitles: {
    benefits: "Diseñadora web en Sevilla que programa tu página, sin plantillas",
    process: "Así es el proceso de crear tu página web",
    pricing: "Precio de una página web en Sevilla: desde 149 €",
    faq: "Preguntas frecuentes sobre diseño web en Sevilla",
  },
  benefits: [
    {
      title: "Alta en Google y Google Maps",
      text: "Con la web completa, te doy de alta en Search Console y la conecto con tu ficha de Google Business Profile.",
    },
    {
      title: "WhatsApp y formulario",
      text: "Un botón de WhatsApp y un formulario para que te escriban sin buscar tu teléfono.",
    },
    {
      title: "Pensada primero para el móvil",
      text: "Textos, botones y fotos se leen y se pulsan bien en cualquier pantalla, empezando por la del móvil.",
    },
    {
      title: "SEO local básico",
      text: "Títulos, textos y datos técnicos pensados para lo que buscan tus clientes en Sevilla.",
    },
    {
      title: "Dominio y hosting a tu nombre",
      text: "Los configuro yo y quedan a tu nombre: la web es tuya y puedes cambiar de proveedor cuando quieras.",
    },
    {
      title: "Un mes de soporte",
      text: "En los dos planes, el primer mes después de publicar resuelvo tus dudas y hago los pequeños ajustes.",
    },
  ],
  process: [
    {
      title: "Propuesta con precio cerrado",
      text: "Hablamos de tu negocio y te envío por escrito qué incluye, cuánto cuesta y el plazo.",
    },
    {
      title: "Diseño",
      text: "Te enseño cómo quedará antes de programarla y ajustamos lo que haga falta.",
    },
    {
      title: "Contenidos",
      text: "Me pasas textos, fotos y logo; si lo necesitas, te ayudo con los textos.",
    },
    {
      title: "Publicación",
      text: "En 2 a 4 semanas desde que tengo los contenidos, la web está publicada, con un mes de soporte incluido.",
    },
  ],
  pricing: {
    from: "149 €",
    note: "¿Quieres estar online ya, con lo esencial? Landing. ¿Tienes varios servicios y quieres explicar cada uno por separado? Web completa.",
    tiers: [
      {
        name: "Landing de una página",
        from: "149 €",
        includes: [
          "Diseño a medida adaptado a móvil",
          "Textos optimizados para SEO local en Sevilla",
          "Botón de WhatsApp y formulario de contacto",
          "Creación y configuración del dominio y hosting",
          "Un mes de soporte tras el lanzamiento",
        ],
      },
      {
        name: "Web completa (hasta 5 páginas)",
        from: "399 €",
        recommended: true,
        includes: [
          "Todo lo de la landing, más estructura completa por secciones",
          "Hasta 5 páginas (inicio, servicios, sobre mí, contacto…)",
          "Alta en Google Search Console y en Google Business Profile",
          "Un mes de soporte tras el lanzamiento",
        ],
        note: `¿Necesitas una tienda online? Desde ${STORE_FROM}: lo tienes en la página de tienda online.`,
      },
    ],
  },
  faqs: [
    {
      q: "¿Cuánto cuesta hacer una página web?",
      a: `Una landing de una página cuesta desde ${LANDING_FROM} y una web completa de hasta 5 páginas, desde ${WEB_FROM}. El dominio y el hosting los pagas tú directamente, a tu nombre.`,
      links: [
        {
          label: "Guía para entender el precio de una web",
          href: "/blog/cuanto-cuesta-una-pagina-web-en-sevilla/",
        },
      ],
    },
    {
      q: "¿Cuánto se tarda en hacer una web?",
      a: "Una web de negocio suele estar lista en 2 a 4 semanas desde que tengo los contenidos: textos, fotos y logo.",
    },
    {
      q: "¿Puedo hacer yo mi web gratis?",
      a: "Sí, y a veces compensa: si estás empezando y te basta una página sencilla, un creador de webs gratuito puede servirte. Se queda corto si necesitas aparecer bien en Google o que la web sea tuya.",
    },
    {
      q: "¿WordPress o web a medida?",
      a: "Depende de lo que vayas a hacer con ella: trabajo con las dos. Una web a medida carga más rápido; WordPress, un gestor de contenidos, compensa si vas a publicar muy a menudo.\n\nLos planes de esta página son webs a medida sin panel de edición: durante el primer mes de soporte resuelvo tus dudas y hago yo los pequeños ajustes. Si quieres un panel de edición, se presupuesta aparte.",
    },
    {
      q: "¿La web incluye SEO?",
      a: "Sí, incluye SEO local básico: estructura, títulos y textos pensados para las búsquedas de tu zona, y una base técnica rápida y correcta. La web completa suma el alta en Search Console y Google Business Profile.",
      links: [
        {
          label: "SEO local y GEO para tu negocio",
          href: "/seo-local-sevilla/",
        },
      ],
    },
    {
      q: "¿Qué presupuesto necesito?",
      a: `Para estar online con lo esencial, desde ${LANDING_FROM} con una landing; si tienes varios servicios que explicar por separado, desde ${WEB_FROM} con la web completa. Las dos opciones tienen precio cerrado e incluyen un mes de soporte.`,
      links: [
        {
          label: "Guía para entender el precio de una web",
          href: "/blog/cuanto-cuesta-una-pagina-web-en-sevilla/",
        },
      ],
    },
  ],
  cta: {
    title: "Empecemos por tu web",
    text: "Cuéntame en qué punto está tu negocio y te respondo con una propuesta clara y un precio cerrado.",
  },
}

export const desarrolloSoftware: ServicePageData = {
  slug: "/desarrollo-software-medida/",
  breadcrumbName: "Software a medida",
  seo: {
    title: "Desarrollo de software a medida en Sevilla | Aplicaciones web",
    description:
      "Desarrollo de software y aplicaciones web a medida en Sevilla: gestión interna, reservas, presupuestos y portales de cliente. +10 años de experiencia.",
  },
  hero: {
    h1: "Desarrollo de software a medida en Sevilla para tu empresa",
    subtitle:
      "Cuando el Excel se queda corto y los programas genéricos no encajan con tu forma de trabajar, una aplicación hecha a tu medida ahorra horas cada semana. Desarrollo herramientas que se adaptan a tu negocio, y no al revés.",
  },
  sectionTitles: {
    benefits: "Qué gana tu empresa con software a medida",
    process: "Así es el proceso de desarrollar tu aplicación a medida",
    pricing: "Cuánto cuesta el software a medida en Sevilla",
    faq: "Preguntas frecuentes sobre software a medida en Sevilla",
  },
  benefits: [
    {
      title: "Adiós a las tareas repetitivas",
      text: "Gestión de pedidos, reservas, presupuestos, partes de trabajo, facturación… Lo que hoy haces a mano en papel o en Excel, automatizado en una herramienta pensada para ti.",
    },
    {
      title: "Experiencia real en empresas",
      text: "Más de 10 años desarrollando software para industria, salud y medioambiente, desde startups hasta consultoras como NTT DATA. Esa experiencia ahora al servicio de tu negocio.",
    },
    {
      title: "Empiezas pequeño, creces cuando toca",
      text: "No necesitas un proyecto enorme: empezamos por lo que más te duele y ampliamos según resultados. Pagas por lo que necesitas.",
    },
    {
      title: "Tecnología moderna y mantenible",
      text: "Aplicaciones web que funcionan en cualquier dispositivo, sin instalar nada. Código limpio y documentado que cualquier profesional podría continuar.",
    },
  ],
  process: [
    {
      title: "Analizo tu forma de trabajar",
      text: "Me cuentas tus procesos y detecto dónde se pierde tiempo o dinero. De ahí sale una propuesta concreta con prioridades.",
    },
    {
      title: "Prototipo primero",
      text: "Antes de desarrollar, ves pantallas de cómo será la herramienta. Ajustamos sobre el diseño, que es barato; no sobre el código, que es caro.",
    },
    {
      title: "Desarrollo por fases",
      text: "Entregas parciales que ya puedes usar. Cada fase tiene precio y plazo cerrados.",
    },
    {
      title: "Formación y soporte",
      text: "Te enseño a usarlo, dejo documentación y quedo disponible para mantenimiento y mejoras.",
    },
  ],
  pricing: {
    from: "999 €",
    includes: [
      "Análisis de procesos y propuesta de solución",
      "Prototipo de pantallas antes de desarrollar",
      "Aplicación web accesible desde cualquier dispositivo",
      "Formación para tu equipo",
      "Garantía y soporte tras la entrega",
    ],
    note: "Cada proyecto es distinto: tras la primera reunión te doy un presupuesto cerrado por fases.",
  },
  faqs: [
    {
      q: "¿Qué es exactamente el software a medida?",
      a: "El software a medida es una aplicación creada específicamente para la forma de trabajar de tu empresa: una herramienta de gestión de pedidos, un sistema de reservas, un portal para tus clientes, un control de presupuestos o partes de trabajo… A diferencia de un programa genérico o de una licencia estándar, no viene con funciones de sobra que nunca usas ni te obliga a adaptar tu proceso al programa. Se construye pensando en cómo trabajas hoy: qué datos manejas, quién los necesita ver y en qué momento. Es especialmente útil cuando ya usas Excel o varios programas sueltos que no se hablan entre sí, y quieres una sola herramienta que haga exactamente lo que tu negocio necesita, ni más ni menos.",
    },
    {
      q: "¿Cuánto cuesta desarrollar software a medida en Sevilla?",
      a: "El desarrollo de software a medida parte de 999 € para una herramienta interna sencilla, y los proyectos más completos se presupuestan por fases: primero analizo tu caso, y después te doy un precio cerrado para cada fase antes de empezarla, nunca una cifra global a ciegas.\n\nEsto te permite empezar por la parte que más tiempo o dinero te está haciendo perder, comprobar el resultado, y decidir después si amplías con nuevas funciones. El coste final depende de cuántas pantallas, integraciones con otras herramientas y usuarios necesita tu proyecto, algo que se concreta en la primera reunión de análisis.",
    },
    {
      q: "¿No me vale con un Excel o un programa estándar?",
      a: "A veces sí, y te lo diré con sinceridad en la primera reunión: no todo negocio necesita software a medida. Compensa claramente cuando pierdes horas semanales copiando datos entre archivos, cuando varias personas necesitan trabajar a la vez con la misma información sin pisarse los cambios, o cuando el programa estándar que usas te obliga a cambiar tu forma de trabajar en vez de adaptarse a ella. Si tu caso se resuelve con una plantilla de Excel mejor organizada o una automatización sencilla, te lo propongo así, porque te sale más barato y más rápido que un desarrollo completo.",
    },
    {
      q: "¿Qué pasa si en el futuro necesito cambios o quiero ampliar la aplicación?",
      a: "El software se entrega documentado y pensado para crecer por fases, no como un proyecto cerrado que se queda congelado el día de la entrega. Puedo encargarme yo misma del mantenimiento y de añadir nuevas funciones cuando las necesites, empezando siempre por lo que más impacto tenga en tu día a día. Y si en algún momento decides que continúe otro profesional, podrá hacerlo sin depender de mí: el código y la documentación son tuyos desde el primer día, sin cláusulas que te aten a que solo yo pueda tocar el proyecto.",
    },
    {
      q: "¿Cuánto tiempo se tarda en desarrollar una aplicación a medida?",
      a: "El plazo depende del alcance que definimos en la fase de análisis. Una herramienta sencilla, con una o dos funciones concretas (por ejemplo, un sistema de reservas o un control de pedidos), suele estar lista en unas pocas semanas.\n\nUn sistema más completo, con varios módulos y usuarios distintos, se desarrolla y entrega por fases, de forma que puedas empezar a usar cada parte según va estando terminada, en vez de esperar meses para ver el resultado. El plazo exacto de cada fase se cierra por escrito junto con el precio, antes de empezar a desarrollar esa fase.",
    },
    {
      q: "¿Qué diferencia hay entre contratar software a medida y usar un programa SaaS con licencia mensual?",
      a: "Un SaaS (un programa por el que pagas una cuota mensual, como muchos CRM o ERP genéricos) es rápido de empezar a usar, pero rara vez encaja al cien por cien con tu proceso, y la cuota se repite mes tras mes mientras sigas usándolo, subas o no de plan. El software a medida no tiene esa licencia mensual recurrente: pagas por el desarrollo, y a partir de ahí la aplicación es tuya, con mantenimiento solo si lo contratas cuando lo necesitas. A cambio, el desarrollo a medida requiere más tiempo inicial que darte de alta en un SaaS, porque primero se analiza y se construye para tu caso concreto.",
    },
    {
      q: "¿Puedo empezar solo por una parte del proyecto en vez de contratarlo todo de golpe?",
      a: "Sí, de hecho es como recomiendo empezar casi siempre. En la primera reunión detectamos juntas qué tarea te está haciendo perder más tiempo o dinero ahora mismo, y desarrollamos primero esa parte con precio y plazo cerrados. Una vez la estás usando y compruebas el resultado, decides si quieres ampliar con la siguiente fase o si con eso ya te vale. Esto reduce el riesgo de invertir en un proyecto grande antes de comprobar que la forma de trabajar propuesta encaja de verdad con tu negocio.",
    },
    {
      q: "¿Qué pasa si a mitad de desarrollo cambian los requisitos de mi negocio?",
      a: "Es algo que ocurre con frecuencia y está previsto en la forma de trabajar por fases: lo ya acordado y presupuestado para la fase en curso no cambia de precio a mitad de camino. Si surge una necesidad nueva o cambia algo importante de tu proceso, la valoramos juntas y, si afecta al alcance, se convierte en una fase adicional con su propio presupuesto cerrado, en vez de meterla sin avisar dentro de lo ya pactado. Así sabes en todo momento qué estás pagando y por qué, sin sorpresas en la factura final.",
    },
    {
      q: "¿En qué tecnologías desarrollas las aplicaciones y me quedo atada a ti como proveedora?",
      a: "Desarrollo aplicaciones web modernas, accesibles desde el navegador en cualquier dispositivo sin instalar nada, usando tecnologías estándar de la industria y no herramientas propietarias cerradas. El código queda documentado y organizado para que cualquier profesional con conocimientos pueda continuarlo si algún día decides cambiar de desarrollador o de proveedor. No hay dependencia forzada de un único formato o plataforma mía: la idea es que la herramienta sea tuya de verdad, igual que el dominio y el hosting de una web se contratan a tu nombre y no al mío.",
    },
  ],
}

export const automatizaciones: ServicePageData = {
  slug: "/automatizaciones/",
  breadcrumbName: "Automatizaciones",
  seo: {
    title: "Automatización de procesos en Sevilla para negocios | n8n y Make",
    description:
      "Automatización de procesos en Sevilla con n8n y Make: facturas, correos, citas e informes que se hacen solos. Más de 10 años de experiencia.",
  },
  hero: {
    h1: "Automatización de procesos en Sevilla: que tu negocio trabaje solo",
    subtitle:
      "¿Cuántas horas pierdes a la semana copiando datos, enviando los mismos correos o pasando pedidos de un sitio a otro? Conecto las herramientas que ya usas (correo, Excel, WhatsApp, facturación…) para que esas tareas se hagan solas.",
  },
  sectionTitles: {
    benefits: "Qué consigue tu negocio automatizando procesos con n8n y Make",
    process: "Así es el proceso de automatizar tus tareas repetitivas",
    pricing: "Cuánto cuesta automatizar un proceso",
    faq: "Preguntas frecuentes sobre automatización de procesos",
  },
  benefits: [
    {
      title: "Recupera horas cada semana",
      text: "Confirmaciones de cita, recordatorios a clientes, facturas recurrentes, informes de ventas… Todo lo que sigue un patrón se puede automatizar. Tú dedicas ese tiempo a vender.",
    },
    {
      title: "Con las herramientas que ya usas",
      text: "No hay que cambiar de programas: n8n y Make conectan Gmail, Google Sheets, WhatsApp, Holded, tu web y cientos de aplicaciones más entre sí.",
    },
    {
      title: "Menos errores humanos",
      text: "Los datos copiados a mano se equivocan; las automatizaciones no. Cada pedido, cita o factura llega donde tiene que llegar, siempre.",
    },
    {
      title: "Inversión pequeña, retorno rápido",
      text: "Una automatización sencilla se amortiza en semanas. Es la forma más barata de ganar productividad en un negocio pequeño.",
    },
  ],
  process: [
    {
      title: "Auditoría de tareas",
      text: "Repasamos juntas tu día a día y localizo qué tareas repetitivas se pueden automatizar y cuánto tiempo te ahorrarían.",
    },
    {
      title: "Propuesta priorizada",
      text: "Te propongo las automatizaciones ordenadas por impacto: primero las que más tiempo te devuelven.",
    },
    {
      title: "Implementación y pruebas",
      text: "Monto los flujos, los pruebo con casos reales y los dejo funcionando con avisos si algo falla.",
    },
    {
      title: "Documentación y control",
      text: "Te entrego cada flujo documentado y te enseño a supervisarlo. Sin dependencia: lo entiendes y lo controlas.",
    },
  ],
  pricing: {
    from: "149 €",
    includes: [
      "Auditoría de procesos automatizables",
      "Diseño e implementación del flujo con n8n o Make",
      "Pruebas con casos reales de tu negocio",
      "Avisos automáticos si algo falla",
      "Documentación y formación",
    ],
    note: "Precio por automatización. Los packs de varias automatizaciones tienen descuento.",
  },
  faqs: [
    {
      q: "¿Qué tipo de tareas se pueden automatizar en mi negocio?",
      a: "Casi cualquier tarea repetitiva que hoy hagas igual cada vez entre distintos programas: enviar recordatorios de cita por WhatsApp o email, generar facturas al cerrar un pedido, volcar los formularios de tu web a una hoja de cálculo o a tu CRM, avisarte de reseñas nuevas en Google, crear informes semanales de ventas o gastos, o pasar datos de un pedido de tu tienda online a tu programa de facturación. La regla práctica es sencilla: si describes el proceso paso a paso y cada paso es siempre igual, casi seguro que se puede automatizar, liberándote de hacerlo a mano una y otra vez.",
    },
    {
      q: "¿Qué son n8n y Make, y por qué se usan para automatizar en vez de programar desde cero?",
      a: "n8n y Make son plataformas de automatización que conectan entre sí las aplicaciones que ya usas (Gmail, Google Sheets, WhatsApp, tu programa de facturación, tu web…) mediante flujos visuales, sin tener que programar una integración desde cero para cada herramienta. Son de las plataformas más usadas del sector, con conexiones ya preparadas para cientos de aplicaciones, lo que reduce mucho el tiempo de desarrollo frente a construir cada conexión a medida. Las uso a diario tanto en proyectos freelance como en entornos de empresa, y elijo una u otra según qué herramientas necesites conectar y qué tan compleja sea la lógica del proceso.",
    },
    {
      q: "¿Necesito conocimientos técnicos para usar las automatizaciones después de que las montes?",
      a: "No. Una vez montada, la automatización funciona sola en segundo plano: no tienes que abrir ninguna plataforma ni tocar nada para que las tareas se sigan haciendo. Te entrego cada flujo documentado con instrucciones sencillas por si en algún momento quieres entender qué hace, y configuro avisos automáticos para que te enteres si algo falla, en vez de descubrirlo semanas después porque un pedido no llegó donde debía. Si algo necesita revisión, puedes contactarme directamente en lugar de intentar arreglarlo tú misma dentro de la plataforma.",
    },
    {
      q: "¿Automatizar procesos es solo para empresas grandes?",
      a: "Al contrario: suele notarse más en negocios pequeños, precisamente porque ahí cada hora cuenta más y no hay un equipo dedicado a tareas administrativas. Una clínica que confirma citas automáticamente por WhatsApp, una tienda que genera facturas solas al cerrar cada pedido o un despacho que recibe ya ordenados los formularios de contacto en una hoja de cálculo, son casos típicos de negocios pequeños donde la automatización libera tiempo real cada semana. No hace falta tener un departamento técnico ni un volumen enorme de operaciones para que compense.",
    },
    {
      q: "¿Cuánto cuesta automatizar un proceso de mi negocio?",
      a: "El precio parte de 149 € por automatización, e incluye la auditoría de esa tarea concreta, el diseño e implementación del flujo, las pruebas con casos reales de tu negocio y la documentación. Si necesitas automatizar varias tareas a la vez, los packs de varias automatizaciones tienen descuento sobre el precio individual.\n\nEl coste final de cada automatización depende de cuántas herramientas hay que conectar y de qué tan compleja sea la lógica del proceso (por ejemplo, si hay que tomar decisiones distintas según el caso), algo que se concreta después de la auditoría inicial.",
    },
    {
      q: "¿Cuánto tiempo se tarda en tener lista una automatización?",
      a: "Depende de cuántas herramientas conecta y de qué tan compleja sea la lógica del proceso. Una automatización sencilla, como enviar un recordatorio de cita o volcar un formulario a una hoja de cálculo, suele estar lista en pocos días desde que se aprueba la propuesta.\n\nProcesos con varios pasos condicionales o que conectan tres o cuatro herramientas distintas necesitan algo más de tiempo, porque incluyen una fase de pruebas con casos reales antes de dejarlas funcionando en tu día a día. El plazo se concreta en la propuesta priorizada, junto con el precio.",
    },
    {
      q: "¿Qué pasa si una automatización falla o hay un error a mitad de proceso?",
      a: "Cada flujo se configura con avisos automáticos si algo no sale como estaba previsto, por ejemplo si una herramienta externa deja de responder o llega un dato en un formato inesperado. En vez de que el error pase desapercibido, recibes una notificación para que puedas revisarlo o contactarme. Antes de dejar cualquier automatización funcionando en tu día a día, la pruebo con casos reales de tu negocio para detectar la mayoría de los problemas antes de que afecten a un pedido o a un cliente real.",
    },
    {
      q: "¿Se pueden automatizar procesos que usan varias herramientas distintas a la vez, como WhatsApp, Excel y facturación?",
      a: "Sí, de hecho es donde más valor aporta automatizar: cuantas más aplicaciones distintas intervienen en un proceso (por ejemplo, un pedido que llega por WhatsApp, se apunta en una hoja de cálculo y termina generando una factura), más tiempo se pierde copiando datos a mano entre ellas y más fácil es que se cuele un error humano. n8n y Make están pensados precisamente para conectar varias aplicaciones dentro de un mismo flujo, así que el proceso completo se puede automatizar de principio a fin, no solo un paso suelto.",
    },
    {
      q: "¿Automatizar con n8n o Make tiene algún coste aparte de tu servicio?",
      a: "Puede tenerlo, y te lo explico con transparencia antes de proponerte la herramienta: n8n y Make tienen sus propios planes de uso según el volumen de tareas que ejecutes al mes, y para negocios pequeños suele bastar con un plan económico o incluso gratuito. Mi honorario cubre la auditoría, el diseño, la implementación y la documentación del flujo; el coste de la plataforma en sí, si lo hay, depende del volumen de tu negocio y se evalúa juntas antes de decidir qué herramienta usar, para que no haya sorpresas en tu factura mensual.",
    },
  ],
}

export const inteligenciaArtificial: ServicePageData = {
  slug: "/inteligencia-artificial/",
  breadcrumbName: "Inteligencia artificial",
  seo: {
    title: "IA para negocios en Sevilla | Chatbots y asistentes con IA",
    description:
      "Llevo la IA a tu negocio en Sevilla con más de 10 años de experiencia en desarrollo: chatbots que atienden clientes, asistentes que redactan y clasifican.",
  },
  hero: {
    h1: "Inteligencia artificial aplicada a tu negocio",
    subtitle:
      "La IA ya no es cosa de grandes empresas. Un chatbot que responde a tus clientes a las 11 de la noche, un asistente que redacta respuestas a reseñas o clasifica tus correos: soluciones concretas, con retorno medible y sin humo.",
  },
  sectionTitles: {
    benefits: "Qué consigue tu negocio con IA aplicada, sin humo",
    process: "Así es el proceso de implantar IA en tu negocio",
    pricing: "Cuánto cuesta implementar IA en tu negocio",
    faq: "Preguntas frecuentes sobre inteligencia artificial para negocios",
  },
  benefits: [
    {
      title: "Atención al cliente 24/7",
      text: "Un chatbot entrenado con la información de tu negocio responde dudas frecuentes, toma datos de contacto y agenda citas mientras duermes. Tú solo atiendes lo importante.",
    },
    {
      title: "IA integrada en tus procesos",
      text: "Combinada con automatizaciones: clasificar correos, resumir documentos, redactar respuestas a reseñas de Google, extraer datos de facturas… La IA como empleado incansable.",
    },
    {
      title: "Sin humo: casos con retorno",
      text: "Solo propongo IA donde aporta valor real y medible. Si tu caso se resuelve mejor con una automatización simple, te lo diré y te costará menos.",
    },
    {
      title: "Tus datos, protegidos",
      text: "Configuro las soluciones cuidando la privacidad y el RGPD: qué datos se envían, a qué proveedor y con qué garantías. Todo explicado con claridad.",
    },
  ],
  process: [
    {
      title: "Detectamos el caso de uso",
      text: "Analizo dónde la IA puede ahorrarte tiempo o mejorar tu atención al cliente, y te propongo el caso con mejor retorno.",
    },
    {
      title: "Prueba piloto",
      text: "Monto una versión inicial con tus datos reales para que compruebes cómo responde antes de decidir.",
    },
    {
      title: "Ajuste y puesta en marcha",
      text: "Refino las respuestas, conecto la IA con tu web o WhatsApp y la dejo funcionando con supervisión.",
    },
    {
      title: "Medición y mejora",
      text: "Revisamos qué está resolviendo y qué no, y la vamos mejorando con casos reales.",
    },
  ],
  pricing: {
    from: "399 €",
    includes: [
      "Análisis del caso de uso con mejor retorno",
      "Prueba piloto con datos reales de tu negocio",
      "Integración con tu web, WhatsApp o herramientas",
      "Configuración respetuosa con el RGPD",
      "Supervisión y ajustes el primer mes",
    ],
    note: "El coste depende del caso de uso. La prueba piloto te permite decidir sin arriesgar.",
  },
  faqs: [
    {
      q: "¿Para qué puede usar la IA un negocio pequeño?",
      a: "Los casos con mejor retorno para un negocio pequeño son: un chatbot que atiende dudas frecuentes y recoge datos de contacto en tu web o WhatsApp, asistentes que redactan respuestas a reseñas de Google o a correos habituales, clasificación automática de mensajes según su urgencia o tipo, y extracción de datos de documentos como facturas o pedidos para no teclearlos a mano. La clave para elegir bien no es usar IA porque esté de moda, sino identificar en qué tarea concreta de tu día a día te ahorra horas reales, algo que reviso contigo en la primera reunión antes de proponerte nada.",
    },
    {
      q: "¿El chatbot con IA va a decir cosas raras o inventadas a mis clientes?",
      a: "El chatbot se entrena únicamente con la información real de tu negocio (servicios, precios, horarios, políticas de tu empresa) y se configura para que, ante una pregunta que no sabe responder con esa información, derive el contacto hacia ti en lugar de inventar una respuesta. Antes de publicarlo, lo pruebas tú misma con preguntas reales de tus clientes durante la fase de prueba piloto, así que nada llega a producción sin que lo hayas revisado antes. Esta configuración reduce mucho el riesgo de respuestas inventadas, aunque como con cualquier sistema de IA no existe una garantía absoluta del cien por cien.",
    },
    {
      q: "¿Qué pasa con la privacidad de mis clientes y el RGPD al usar IA?",
      a: "Antes de poner en marcha cualquier solución, defino con claridad qué datos se envían al proveedor de IA, con qué finalidad y bajo qué garantías, priorizando proveedores que ofrecen acuerdos de tratamiento de datos conformes con la normativa europea. Te entrego esa configuración documentada para que puedas incorporarla a tu registro de actividades de tratamiento si lo necesitas. No configuro ninguna solución que envíe datos personales de tus clientes sin que sepas exactamente a dónde van y por qué, porque en sectores como salud o servicios profesionales esto es especialmente delicado.",
    },
    {
      q: "¿Cuánto cuesta implantar IA en mi negocio?",
      a: "Un chatbot para web o WhatsApp parte de 399 €, incluyendo el análisis del caso de uso, la prueba piloto con tus datos reales, la integración con tu web o WhatsApp y la configuración respetuosa con el RGPD.\n\nLos proyectos que combinan IA con automatizaciones (por ejemplo, un chatbot que además genera un pedido o una cita automáticamente) se presupuestan según el caso concreto, porque el coste depende de cuántas herramientas hay que conectar. En todos los casos, la prueba piloto previa te permite ver cómo responde la IA con tu información real antes de decidir si sigues adelante.",
    },
    {
      q: "¿Qué diferencia hay entre un chatbot con IA y los chatbots clásicos de \"elige una opción\"?",
      a: "Un chatbot clásico solo puede seguir un guion cerrado de botones y respuestas predefinidas: si la pregunta del cliente no encaja exactamente en una de esas opciones, se queda bloqueado. Un chatbot con IA entiende preguntas escritas con lenguaje natural, como las escribiría un cliente real, y puede responder combinando la información de tu negocio aunque la pregunta no esté formulada exactamente igual que en su base de datos. Esto se traduce en menos clientes frustrados por no encontrar la opción correcta y más consultas resueltas sin que tengas que intervenir tú misma.",
    },
    {
      q: "¿Cuánto tiempo se tarda en tener un chatbot con IA funcionando?",
      a: "El proceso empieza con el análisis del caso de uso y sigue con una prueba piloto montada con la información real de tu negocio, algo que suele tardar entre una y dos semanas según cuánta información haya que preparar (servicios, precios, horarios, preguntas frecuentes).\n\nA partir de ahí, ajustamos las respuestas con casos reales antes de conectarlo a tu web o WhatsApp de forma definitiva. El plazo exacto depende de si la información de tu negocio ya está organizada o hay que recopilarla primero, algo que se aclara en la primera reunión.",
    },
    {
      q: "¿Puedo probar el chatbot antes de decidir si lo contrato de verdad?",
      a: "Sí, y es justo el paso que recomiendo antes de comprometerte con nada: monto una prueba piloto con la información real de tu negocio para que compruebes cómo responde a preguntas de verdad, no a un ejemplo genérico de demostración. Con esa prueba delante decides si el resultado te convence y quieres seguir adelante con la integración definitiva en tu web o WhatsApp, o si prefieres ajustar el enfoque antes de continuar. Esto reduce el riesgo de pagar por una solución de IA que luego no encaja con cómo hablan realmente tus clientes.",
    },
    {
      q: "¿Necesito tener ya una web para poner un chatbot con IA en mi negocio?",
      a: "No es imprescindible: un chatbot con IA se puede integrar directamente en WhatsApp Business, que es donde ya habla contigo la mayoría de tus clientes, sin depender de que tengas una web previa. Si además tienes o vas a tener una web, también se puede integrar ahí como un widget de chat visible en cualquier página. En la primera reunión analizamos por dónde te contactan más tus clientes hoy en día, para proponerte el canal donde realmente va a tener uso, en vez de añadirlo en un sitio donde nadie lo va a encontrar.",
    },
    {
      q: "¿La IA sustituye a mi equipo o a mí atendiendo a los clientes?",
      a: "No está pensada para eso, sino para quitarte de encima las consultas repetitivas (horarios, precios, disponibilidad, dudas frecuentes) y dejarte a ti el tiempo para lo que de verdad necesita trato personal: cerrar una venta importante, resolver un caso delicado o atender a un cliente habitual. El chatbot se configura para reconocer cuándo una consulta necesita intervención humana y derivarla, en lugar de intentar resolverlo todo por su cuenta. La IA funciona mejor como un filtro que se encarga de lo rutinario, no como un reemplazo de la atención personal que diferencia a un negocio pequeño de uno grande.",
    },
  ],
}

export const seoLocal: ServicePageData = {
  slug: "/seo-local-sevilla/",
  offersFromTiers: true,
  breadcrumbName: "SEO local en Sevilla",
  seo: {
    title: "SEO local Sevilla y posicionamiento web | Desde 300 €/mes + IVA",
    description:
      "Me dedico a posicionar negocios en Google y Google Maps con SEO local en Sevilla. Ficha desde 300 €/mes + IVA o ficha y web desde 500 €/mes + IVA.",
  },
  hero: {
    h1: "SEO local Sevilla y posicionamiento web",
    title: "Tu negocio está en Sevilla. La pregunta es si te encuentran cuando importa.",
    titleAccent: "cuando importa",
    subtitle:
      "Tus clientes te buscan en Google antes de decidir. Trabajo contigo cada mes el posicionamiento web en Sevilla de tu negocio, ficha y web, para que quien te busca no dude en llamarte.",
    primaryCtaLabel: "Reservar una llamada",
    secondaryCta: { label: "Ver qué se revisa", href: "#revision-local" },
  },
  sectionTitles: {
    benefits: "Qué se revisa para que tu presencia local tenga sentido",
    process: "Cómo trabajamos el SEO local",
    pricing: "Dos planes, con un alcance claro",
    faq: "Preguntas antes de empezar",
  },
  benefits: [
    {
      title: "Una ficha que explica bien tu negocio",
      text: "Ordenamos servicios, horarios, categorías y descripciones para que la información esencial sea coherente y útil para quien busca cerca.",
    },
    {
      title: "Señales públicas que no se contradicen",
      text: "Revisamos cómo aparece tu negocio en directorios y otros espacios públicos para evitar datos distintos que confundan a quien busca.",
    },
    {
      title: "Una web que acompaña a la ficha",
      text: "Cuando la web lo necesita, aclaramos servicios, zonas y recorridos para que buscadores y personas entiendan qué ofreces.",
    },
  ],
  process: [
    {
      title: "Revisión del punto de partida",
      text: "Miramos ficha, información pública, web y acciones que se pueden observar para acordar prioridades útiles.",
    },
    {
      title: "Puesta en orden",
      text: "Actualizo la información y trabajo las mejoras acordadas para que la presencia local sea más clara y coherente.",
    },
    {
      title: "Trabajo mensual",
      text: "Mantengo la ficha activa, reviso el contenido y ajusto el siguiente paso según lo que necesite el negocio.",
    },
    {
      title: "Informe y conversación directa",
      text: "Recibes un vídeo-informe mensual con el trabajo realizado, prioridades y próximos pasos, con contacto directo por WhatsApp.",
    },
  ],
  pricing: {
    from: "300 € + IVA",
    note: "Se factura mes a mes y no hay cuota de puesta en marcha aparte.",
    tiers: [
      {
        name: "Local",
        from: "300 €/mes + IVA",
        ctaLabel: "Reservar una llamada",
        includes: [
          "Ficha de Google completa y ordenada",
          "Servicios, horarios y descripción actualizados",
          "Lenguaje alineado con las búsquedas locales relevantes",
          "Datos coherentes en guías y directorios",
          "Fotos y publicaciones nuevas cada mes",
          "Plan para solicitar opiniones auténticas",
          "Medición de llamadas, clics y rutas cuando estén disponibles",
          "Vídeo-informe mensual, próximos pasos y contacto directo por WhatsApp",
        ],
        note: "Para negocios que necesitan poner en orden y cuidar su ficha de Google.",
      },
      {
        name: "Local Pro",
        from: "500 €/mes + IVA",
        recommended: true,
        ctaLabel: "Reservar una llamada",
        includes: [
          "Todo lo incluido en Local",
          "Rediseño de la web y revisión completa con plan estratégico",
          "Web organizada por servicios y zonas cuando corresponda",
          "Corrección de errores que dificultan que Google interprete la web",
          "Títulos más claros para los resultados de búsqueda",
          "Páginas por servicio y zona cuando aporten valor",
          "Información estructurada para que buscadores y sistemas de IA entiendan el negocio",
          "Páginas conectadas entre sí de forma intencional",
        ],
        note: "Para negocios que necesitan trabajar ficha y web como un mismo sistema.",
      },
    ],
  },
  faqs: [
    {
      q: "¿Para qué tipo de negocio encaja este servicio?",
      a: "Está pensado para negocios de Sevilla donde cada cliente cuenta y la información local debe ser clara. En la llamada vemos si el alcance encaja con tu situación.",
    },
    {
      q: "¿Cómo puede aparecer mi negocio en Google Maps?",
      a: "Con una ficha de Google Business Profile completa y coherente: categoría correcta, servicios y horarios al día, reseñas auténticas y datos que coinciden en directorios y en la web. También influye la distancia entre quien busca y tu negocio, así que nadie puede prometer la primera posición.",
    },
    {
      q: "¿Qué diferencia hay entre Local y Local Pro?",
      a: "Local se centra en la ficha de Google y su mantenimiento. Local Pro incorpora además el trabajo necesario en la web para que ficha y web funcionen como un mismo sistema.",
    },
    {
      q: "¿Qué ocurre en la llamada?",
      a: "Hablamos de tu negocio, de la presencia que tienes ahora y de si este servicio encaja. El objetivo es aclarar el siguiente paso útil, no prometer un resultado.",
    },
    {
      q: "¿Qué se mide y cómo se informa?",
      a: "Cuando están disponibles, revisamos llamadas, clics y solicitudes de ruta. Cada mes recibes un vídeo-informe con el trabajo realizado, las prioridades y el siguiente paso.",
    },
    {
      q: "¿Necesito tener web?",
      a: "No para trabajar el plan Local. Si tu web necesita acompañar a la ficha, Local Pro incluye la revisión y el trabajo web que se acuerde para tu negocio.",
    },
    {
      q: "¿Hay una puesta en marcha separada o una permanencia?",
      a: "No se cobra una puesta en marcha independiente. Los planes se facturan mes a mes y esta página no establece una permanencia contractual.",
    },
    {
      q: "¿Qué papel tienen los sistemas de IA?",
      a: "Una información clara y estructurada puede ayudar a que buscadores y sistemas de IA entiendan el negocio. No implica una recomendación, cita ni aparición garantizada.",
    },
    {
      q: "¿Eres una agencia de SEO local?",
      a: "No, soy consultora SEO y desarrolladora web freelance. El posicionamiento web en Sevilla de tu negocio lo hago yo misma: hablas directamente con la persona que hace el trabajo.",
    },
  ],
  cta: {
    title: "Aclaremos qué está frenando tu presencia local",
    text: "En una llamada vemos si este servicio encaja con tu negocio y cuál sería el siguiente paso útil.",
    buttonLabel: "Reservar una llamada",
  },
}

export const capilarLocal: ServicePageData = {
  slug: "/seo-para-clinicas-capilares-sevilla/",
  breadcrumbName: "SEO para clínicas capilares en Sevilla",
  seo: {
    title: "SEO para clínicas capilares en Sevilla | CAPILAR LOCAL desde 300 €/mes + IVA",
    description: "CAPILAR LOCAL optimiza la ficha de Google y, si lo necesitas, la web de tu clínica de injerto capilar en Sevilla: planes mensuales desde 300 €/mes + IVA.",
  },
  hero: {
    h1: "CAPILAR LOCAL: SEO local mensual para clínicas de injerto capilar en Sevilla",
    subtitle: "Para propietarias y responsables de clínica que quieren ordenar su presencia local y sus puntos de contacto, con un plan mensual desde el principio y sin promesas de pacientes, posiciones ni resultados médicos.",
    secondaryCta: { label: "Ver planes y precio", href: "#precios" },
  },
  sectionTitles: { benefits: "Visibilidad, confianza y contacto: una base comercial clara", process: "Cómo trabajo CAPILAR LOCAL cada mes", pricing: "CAPILAR LOCAL: planes y precio mensual", faq: "Preguntas frecuentes para clínicas" },
  benefits: [
    { title: "Visibilidad", text: "Diagnóstico breve de web, indexación básica, SEO local, Google Business Profile y tres competidores de Sevilla para priorizar qué corregir primero." },
    { title: "Confianza", text: "Revisión de la información pública de la ficha y una página estratégica con cinco FAQs. Las afirmaciones médicas, tratamientos y precios los proporciona y aprueba la clínica; no se inventan claims clínicos." },
    { title: "Contacto", text: "Reviso acciones de formulario, teléfono y WhatsApp como contactos medibles. La medición se plantea sin datos clínicos, mensajes, nombres ni teléfonos enviados a analítica." },
  ],
  process: [
    { title: "Día 1: accesos y contexto", text: "Confirmamos propiedad de los activos, servicios, materiales disponibles y quién valida la información médica y comercial." },
    { title: "Primeras dos semanas: diagnóstico y puesta en marcha", text: "Reviso la presencia local y tres competidores de Sevilla, y empiezo a trabajar la ficha, la página estratégica y las FAQs aprobadas por la clínica." },
    { title: "Cada mes: ficha, contenido y seguimiento", text: "Ajusto la ficha, publico contenido nuevo cuando aplica y reviso qué está funcionando para priorizar el siguiente mes." },
    { title: "Informe mensual y próximos pasos", text: "Recibes un informe corto cada mes con el trabajo realizado y las prioridades siguientes. El plan continúa mes a mes, sin permanencia obligatoria." },
  ],
  pricing: {
    from: "300 € + IVA",
    note: "Los dos planes de CAPILAR LOCAL se facturan mes a mes desde el principio, sin proyecto inicial aparte. No obligan a una permanencia mínima, aunque sugiero tres meses para evaluar el trabajo.",
    tiers: [
      { name: "Local", from: "300 €/mes + IVA", includes: ["Optimización continua de la ficha de Google Business Profile de la clínica", "Revisión y coherencia del NAP en directorios locales", "Publicaciones y fotos nuevas cada mes, aprobadas por la clínica", "Estrategia para conseguir reseñas auténticas de pacientes", "Informe mensual de trabajo"], note: "La información médica, los tratamientos y los precios los aporta y aprueba la clínica.", ctaLabel: "Empezar con Local" },
      { name: "Local Pro", from: "500 €/mes + IVA", recommended: true, includes: ["Todo lo incluido en el plan Local", "Optimización de la página estratégica de la clínica y su enlazado interno", "Datos estructurados básicos cuando sean técnicamente viables", "Revisión de indexación y errores técnicos de la web", "FAQs aprobadas por la clínica para resolver dudas antes de la primera visita"], note: "Pensado para clínicas que quieren reforzar ficha y web a la vez.", ctaLabel: "Empezar con Local Pro" },
    ],
  },
  faqs: [
    { q: "¿CAPILAR LOCAL está dirigido a pacientes?", a: "No. Es un servicio B2B para propietarias y responsables de clínicas de injerto capilar que quieren revisar su presencia local y los puntos de contacto de su propia clínica." },
    { q: "¿Qué diferencia hay entre Local y Local Pro?", a: "Local se centra en el perfil de Google Business Profile de la clínica. Local Pro añade el trabajo en la propia web: página estratégica, datos estructurados y revisión técnica, para reforzar lo que hace la ficha." },
    { q: "¿Hay permanencia?", a: "No hay una permanencia obligatoria. Sugiero un mínimo de tres meses para evaluar el trabajo mensual, y se concreta por escrito antes de empezar." },
    { q: "¿Quién valida las FAQs y el contenido médico?", a: "La clínica debe aportar y aprobar la información médica, los tratamientos, los precios y cualquier afirmación clínica antes de publicar. El servicio no inventa ni valida contenido sanitario." },
    { q: "¿Se pueden medir los contactos sin tratar datos de salud?", a: "Sí. Se revisan de forma básica los clics de WhatsApp, teléfono, formulario y CTA sin enviar datos clínicos, nombres, teléfonos ni mensajes a analítica." },
    { q: "¿Garantiza CAPILAR LOCAL más solicitudes?", a: "No. El trabajo mensual es transparente y acotado al alcance de cada plan; no se garantizan posiciones, volumen de contactos, citas, pacientes, menciones en asistentes de IA ni resultados médicos." },
  ],
  cta: { title: "Habla conmigo sobre CAPILAR LOCAL", text: "Cuéntame qué activos tiene hoy tu clínica y qué plan encaja mejor. El primer contacto no necesita datos clínicos de pacientes." },
}

export const tiendaOnline: ServicePageData = {
  slug: "/tienda-online-sevilla/",
  breadcrumbName: "Tienda online en Sevilla",
  seo: {
    title: "Diseño de tienda online en Sevilla | Pasarela de pago propia",
    description:
      "Diseño tiendas online para negocios de Sevilla desde 499 euros, con pasarela de pago propia y sin comisión de marketplace. Presupuesto cerrado.",
  },
  hero: {
    h1: "Diseño de tienda online en Sevilla para negocios que quieren vender",
    title: "Tu tienda online, lista para vender",
    titleAccent: "lista para vender",
    subtitle:
      "Diseño y monto tu tienda online en WooCommerce, Shopify o a medida, con panel de gestión, pago con tarjeta y precio cerrado por escrito.",
    secondaryCta: {
      label: "Ver precio y opciones",
      href: "#precios",
    },
  },
  sectionTitles: {
    benefits: "Qué incluye tu tienda online en Sevilla",
    process: "Así es el proceso de crear tu tienda online",
    pricing: "Cuánto cuesta una tienda online en Sevilla",
    faq: "Preguntas frecuentes sobre tiendas online en Sevilla",
  },
  benefits: [
    {
      title: "Tu catálogo, ya subido",
      text: "Subo yo hasta unos 20 productos con sus fotos y precios.",
    },
    {
      title: "Pago con tarjeta",
      text: "Tus clientes pagan con tarjeta a través de una pasarela como Stripe.",
    },
    {
      title: "Tallas y colores",
      text: "Variantes simples de talla o color sin repetir fichas.",
    },
    {
      title: "Envíos sencillos",
      text: "Tarifa plana, recogida en tienda o las dos.",
    },
    {
      title: "Un panel para el día a día",
      text: "Subes productos, cambias precios y ves tus pedidos desde el panel.",
    },
    {
      title: "Fichas preparadas para Google",
      text: "Cada producto y categoría se escriben pensando en lo que busca quien compra.",
    },
  ],
  process: [
    {
      title: "Alcance",
      text: "Hablamos de lo que vendes y eliges WooCommerce, Shopify o una tienda a medida.",
    },
    {
      title: "Propuesta cerrada por escrito",
      text: "Te envío qué incluye y cuánto cuesta antes de empezar.",
    },
    {
      title: "Construcción",
      text: "Monto la tienda con tu marca y pruebo una compra completa, del carrito al pedido.",
    },
    {
      title: "Formación y lanzamiento",
      text: "Te enseño a gestionar productos y pedidos, publicamos y tienes un mes de soporte.",
    },
  ],
  pricing: {
    from: STORE_FROM,
    includes: [...storeIncludes],
    note: STORE_FINAL_PRICE_NOTE,
  },
  faqs: [
    {
      q: "¿Cuánto cuesta una tienda online en Sevilla?",
      a: `Una tienda online básica cuesta desde ${STORE_FROM}, con panel de gestión, en WooCommerce, Shopify o a medida. Incluye diseño con tu marca, pago con tarjeta, envíos, hasta unos 20 productos subidos por mí, formación y un mes de soporte.\n\nSe presupuestan aparte Redsys o Bizum, los catálogos grandes y los envíos por peso o por zona, y el precio final se cierra por escrito.`,
    },
    {
      q: "¿Cómo se crea o se monta una tienda online?",
      a: "Se empieza por lo que vendes: productos, fotos y precios. Eliges la plataforma, yo la monto con tu marca, hago una compra de prueba y te enseño el panel.",
    },
    {
      q: "¿WooCommerce, Shopify o una tienda a medida?",
      a: `Las tres parten del mismo precio, desde ${STORE_FROM}, y eliges tú. Shopify es la más rápida y sin hosting, pero pagas su cuota mensual a Shopify.\n\nWooCommerce y una tienda a medida quedan a tu nombre.`,
    },
    {
      q: "¿Qué plataforma conviene para un catálogo grande o con stock en varios almacenes?",
      a: "Depende de tu catálogo y de los programas que uses. Las tres opciones admiten un catálogo grande, pero importarlo de golpe o sincronizar el stock con otros sistemas se presupuesta aparte.",
      links: [{ label: "Automatizaciones para tu negocio", href: "/automatizaciones/" }],
    },
    {
      q: "¿Qué requisitos legales y técnicos tiene una tienda online?",
      a: "Necesitas un dominio, conexión segura HTTPS, una pasarela de pago y los textos legales: aviso legal, privacidad, cookies y condiciones de venta. Te la entrego preparada para todo ello.\n\nSu contenido y los impuestos, mejor con tu gestoría o un abogado: no doy asesoramiento jurídico.",
    },
  ],
  cta: {
    title: "Empecemos por tu tienda",
    text: "Cuéntame qué vendes y te respondo con una propuesta clara y un precio cerrado.",
  },
}

export const services = [
  seoLocal,
  capilarLocal,
  disenoWeb,
  desarrolloSoftware,
  automatizaciones,
  inteligenciaArtificial,
  tiendaOnline,
]
