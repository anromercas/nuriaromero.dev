// Contenido de las 4 páginas de servicio.
// Precios acordados: landing 149 €, web 5 páginas 399 €, automatización 149 €,
// chatbot IA 399 €, software a medida 999 €. Tienda online: precio y alcance en
// src/data/store-offer.ts. SEO para IA (/seo-para-ia/) has no price of its own: it
// shows the Local Pro plan of the local SEO page and its Service JSON-LD has no offers.
import type { ServicePageData } from "@/data/types"
import { STORE_FROM, STORE_FINAL_PRICE_NOTE, storeIncludes } from "./store-offer.ts"

// Precios de diseño web para interpolar en el copy y el FAQ. Los `from` de los planes
// (guardados por tests/single-price-source.test.js) quedan como literales; un test
// de tests/diseno-web-template.test.js comprueba que ambos coinciden.
const LANDING_FROM = "149 €"
const WEB_FROM = "399 €"

// Precio único de software a medida: `pricing.from` y las respuestas lo toman de aquí.
const SOFTWARE_FROM = "999 €"

// Precio único del chatbot con IA: `pricing.from` y la respuesta de coste lo toman de aquí.
const AI_FROM = "399 €"

type Tier = NonNullable<ServicePageData["pricing"]["tiers"]>[number]

/** Named pricing tier; throws so a renamed tier fails the build. */
export function pricingTier(service: ServicePageData, tierName: string): Tier {
  const tier = service.pricing.tiers?.find((t) => t.name === tierName)
  if (!tier)
    throw new Error(`Pricing tier "${tierName}" not found in ${service.slug}`)
  return tier
}

/** `from` label of a named pricing tier; throws so a renamed tier fails the build. */
export function tierFrom(service: ServicePageData, tierName: string): string {
  return pricingTier(service, tierName).from
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
      "Desarrollo de software y aplicaciones web a medida en Sevilla, desde 999 euros: gestión, reservas y portales de cliente. +10 años de experiencia.",
  },
  hero: {
    h1: "Desarrollo de software a medida en Sevilla para tu empresa",
    title: "Software que trabaja como tu empresa",
    titleAccent: "como tu empresa",
    subtitle: `Desarrollo aplicaciones web a medida para tus pedidos, reservas o clientes. Primera fase desde ${SOFTWARE_FROM}, con precio cerrado.`,
    secondaryCta: { label: "Ver precio", href: "#precios" },
  },
  sectionTitles: {
    benefits: "Qué software a medida puedo hacer para tu empresa",
    process: "Así es el proceso de desarrollar tu aplicación a medida",
    pricing: "Cuánto cuesta el software a medida en Sevilla",
    faq: "Preguntas frecuentes sobre software a medida en Sevilla",
  },
  benefits: [
    {
      title: "Aplicación web",
      text: "Una herramienta que abres en el navegador, sin instalar nada.",
    },
    {
      title: "App para el móvil",
      text: "Tu equipo consulta y apunta datos desde el móvil.",
    },
    {
      title: "Gestión interna o ERP",
      text: "Pedidos, stock y facturas juntos: un ERP, tu programa de gestión.",
    },
    {
      title: "API e integraciones",
      text: "Conecto tus programas con una API, un enlace entre programas, para que los datos pasen solos.",
    },
    {
      title: "Reservas y citas",
      text: "Tus clientes eligen día y hora y tú ves la agenda completa.",
    },
    {
      title: "Panel de datos",
      text: "Ves cómo van tus pedidos, ventas o reservas de un vistazo.",
    },
  ],
  process: [
    {
      title: "Analizo tu forma de trabajar",
      text: "Me cuentas cómo trabajas y vemos dónde se pierde más tiempo.",
    },
    {
      title: "Primera fase con precio cerrado",
      text: "Te envío por escrito qué incluye, cuánto cuesta y el plazo.",
    },
    {
      title: "Entregas que ya puedes usar",
      text: "Ves las pantallas y después versiones parciales que ya usas.",
    },
    {
      title: "Ampliamos cuando toca",
      text: "Si funciona, añadimos la siguiente fase con su precio cerrado.",
    },
  ],
  pricing: {
    from: SOFTWARE_FROM,
    includes: [
      "Análisis de procesos y propuesta de solución",
      "Prototipo de pantallas antes de desarrollar",
      "Aplicación web accesible desde cualquier dispositivo",
      "Formación para tu equipo",
      "Garantía y soporte tras la entrega",
    ],
    note: "Cada proyecto es distinto: tras la primera reunión te doy un presupuesto cerrado por fases.",
  },
  cta: {
    title: "Empecemos por tu herramienta",
    text: "Cuéntame cómo trabajas y te respondo con una propuesta clara, sin compromiso.",
  },
  faqs: [
    {
      q: "¿Qué es un software a medida?",
      a: "Es una aplicación hecha para cómo trabaja tu empresa, en lugar de adaptarte tú a un programa genérico. Puede llevar tus pedidos, reservas o presupuestos.",
    },
    {
      q: "¿Cuánto cuesta un software a medida?",
      a: `Desde ${SOFTWARE_FROM} para una herramienta interna sencilla. Los proyectos más completos se presupuestan por fases, cada una con precio cerrado por escrito antes de empezarla.`,
    },
    {
      q: "¿Qué se puede desarrollar a medida: aplicación web, app móvil, ERP o API?",
      a: "Una aplicación web, una app que tu equipo usa desde el móvil, un ERP o una API que conecta tus programas. También reservas y paneles.",
    },
    {
      q: "¿De quién es el código?",
      a: "El código y la documentación son tuyos desde el primer día, sin cláusulas que te aten a mí. Otro profesional puede continuarlo cuando quieras.",
    },
    {
      q: "¿Qué empresas de desarrollo de software a medida hay en Sevilla?",
      a: "Hay agencias, estudios y profesionales independientes, y conviene comparar más de uno. Mira quién programa, si hay precio cerrado por fases y si el código será tuyo. Yo trabajo en Sevilla y hablas conmigo.",
    },
  ],
}

export const automatizaciones: ServicePageData = {
  slug: "/automatizaciones/",
  breadcrumbName: "Automatizaciones",
  seo: {
    title: "Automatización de procesos en Sevilla para negocios | n8n y Make",
    description:
      "Automatización de procesos en Sevilla con n8n y Make: facturas, citas e informes que se hacen solos, desde 149 euros. Más de 10 años de experiencia.",
  },
  hero: {
    h1: "Automatización de procesos en Sevilla: que tu negocio trabaje solo",
    title: "Que las tareas repetitivas se hagan solas",
    titleAccent: "se hagan solas",
    subtitle:
      "Automatizar un proceso es que una tarea que haces siempre igual, como copiar datos o enviar el mismo aviso, la hagan solos tus programas conectados. Tú te quedas con lo que necesita a una persona.",
    secondaryCta: { label: "Ver precio", href: "#precios" },
  },
  sectionTitles: {
    benefits: "Ejemplos de automatización de procesos",
    process: "Así es el proceso de automatizar tus tareas repetitivas",
    pricing: "Cuánto cuesta automatizar un proceso",
    faq: "Preguntas frecuentes sobre automatización de procesos",
  },
  benefits: [
    {
      title: "Mensajes de WhatsApp",
      text: "Las confirmaciones y los recordatorios salen solos, y lo que necesita respuesta te llega a ti.",
    },
    {
      title: "Facturas",
      text: "Al cerrar un pedido, la factura se crea y se guarda en su carpeta.",
    },
    {
      title: "Citas y recordatorios",
      text: "Cada reserva entra en tu agenda y el cliente recibe su aviso el día antes.",
    },
    {
      title: "Formularios a tu hoja o CRM",
      text: "Lo que te escriben desde la web llega ordenado a tu hoja de cálculo o a tu lista de clientes.",
    },
    {
      title: "Avisos internos",
      text: "Te enteras al momento de un pedido nuevo, una reseña o un pago pendiente.",
    },
    {
      title: "Informes",
      text: "Cada lunes recibes en tu correo un resumen de ventas o gastos, sin montarlo a mano.",
    },
  ],
  process: [
    {
      title: "Mapear la tarea",
      text: "Me cuentas cómo la haces hoy y apuntamos cada paso.",
    },
    {
      title: "Simplificarla antes de automatizarla",
      text: "Quitamos los pasos que sobran, para no automatizar un desorden.",
    },
    {
      title: "Elegir la herramienta",
      text: "Uso n8n o Make, que conectan tus programas, según lo que haya que unir.",
    },
    {
      title: "Piloto con casos reales",
      text: "La pruebo con pedidos, citas o mensajes de verdad antes de dejarla sola.",
    },
    {
      title: "Dejarla funcionando",
      text: "Queda activa, con avisos si algo falla y documentada para que sepas qué hace.",
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
      q: "¿Qué es la automatización de procesos?",
      a: "Es conseguir que una tarea que sigue siempre los mismos pasos la hagan tus programas conectados, en lugar de hacerla tú a mano. Por ejemplo, los datos del formulario de tu web pasan solos a tu hoja de clientes.",
    },
    {
      q: "¿Cuál es la mejor IA para automatizar procesos?",
      a: "No hay una sola mejor, y muchas automatizaciones no necesitan inteligencia artificial. Monto el flujo con n8n o Make y añado un modelo de IA solo en el paso que lee, clasifica o redacta texto.",
      links: [
        {
          label: "Chatbots y soluciones con IA",
          href: "/inteligencia-artificial/",
        },
      ],
    },
    {
      q: "¿Qué ejemplos de automatización hay en una empresa?",
      a: "Los más útiles son mensajes de WhatsApp, facturas, citas y recordatorios, formularios que llegan a tu hoja o CRM, avisos internos e informes. Todos repiten los mismos pasos.",
    },
    {
      q: "¿Cómo se automatizan los mensajes de WhatsApp?",
      a: "Se conecta el canal oficial de WhatsApp Business con tu agenda o tu formulario mediante n8n o Make, y las confirmaciones y los recordatorios salen solos. Lo que necesita a una persona te sigue llegando.",
    },
    {
      q: "¿Se pueden automatizar las facturas y las tareas administrativas?",
      a: "Sí: la factura puede crearse al cerrar un pedido, los datos pasar a tu programa de facturación y los documentos guardarse en su carpeta. Antes lo pruebo contigo con casos reales.",
    },
    {
      q: "¿Cómo empiezo a automatizar los procesos de mi empresa?",
      a: "Elige una sola tarea repetitiva y apunta sus pasos tal como los haces hoy. Después se simplifica y se prueba con casos reales antes de dejarla sola.",
    },
  ],
  cta: {
    title: "Empecemos por una tarea",
    text: "Cuéntame qué tarea repites cada semana y te digo si compensa automatizarla.",
  },
};

export const inteligenciaArtificial: ServicePageData = {
  slug: "/inteligencia-artificial/",
  breadcrumbName: "Inteligencia artificial",
  seo: {
    title: "IA para negocios en Sevilla | Chatbots y asistentes con IA",
    description:
      "Llevo la IA a tu negocio en Sevilla con más de 10 años de experiencia en desarrollo: chatbots que atienden clientes y agentes que reservan o toman pedidos.",
  },
  hero: {
    h1: "Inteligencia artificial aplicada a tu negocio",
    title: "IA que responde con tu información",
    titleAccent: "con tu información",
    subtitle:
      "Monto chatbots y agentes de inteligencia artificial para empresas y negocios de Sevilla. Atienden a tus clientes en tu web o WhatsApp con tu información y te pasan la conversación cuando hace falta una persona.",
    secondaryCta: { label: "Ver precio", href: "#precios" },
  },
  sectionTitles: {
    benefits: "Qué puede hacer la IA en tu negocio",
    process: "Así es el proceso de implantar IA en tu negocio",
    pricing: "Cuánto cuesta implementar IA en tu negocio",
    faq: "Preguntas frecuentes sobre inteligencia artificial para negocios",
  },
  benefits: [
    {
      title: "Chatbot en tu web y WhatsApp",
      text: "Responde las dudas frecuentes de tus clientes en tu web o en WhatsApp Business.",
    },
    {
      title: "Agente que reserva o toma pedidos",
      text: "Un agente de IA no solo contesta: apunta la cita o el pedido en tus herramientas.",
    },
    {
      title: "Respuestas con tu información",
      text: "Contesta con tus servicios, precios y horarios, no con lo que encuentra por internet.",
    },
    {
      title: "Pasa la conversación a una persona",
      text: "Cuando no sabe la respuesta, te avisa y la conversación sigue contigo.",
    },
    {
      title: "Resúmenes",
      text: "Resume conversaciones, correos o documentos largos en unas pocas líneas.",
    },
    {
      title: "Datos cuidados y RGPD",
      text: "Te explico qué datos se envían y a quién, según el RGPD, la ley europea de datos.",
    },
  ],
  process: [
    {
      title: "Elegimos un caso de uso",
      text: "Buscamos la tarea en la que la IA te ayuda de verdad, como las dudas que más se repiten.",
    },
    {
      title: "Piloto con tus datos",
      text: "Lo monto con la información real de tu negocio y lo pruebas antes de decidir.",
    },
    {
      title: "Ajuste con casos reales",
      text: "Corregimos las respuestas con preguntas de verdad de tus clientes.",
    },
    {
      title: "Conexión a tu web o WhatsApp",
      text: "Lo dejo funcionando en tu canal, con supervisión y ajustes el primer mes.",
    },
  ],
  pricing: {
    from: AI_FROM,
    includes: [
      "Análisis de tu caso de uso",
      "Prueba piloto con datos reales de tu negocio",
      "Integración con tu web, WhatsApp o herramientas",
      "Configuración respetuosa con el RGPD",
      "Supervisión y ajustes el primer mes",
    ],
    note: "El coste depende del caso de uso. Con la prueba piloto ves cómo responde con tus datos antes de seguir.",
  },
  cta: {
    title: "Empecemos por tus clientes",
    text: "Cuéntame qué te preguntan más tus clientes y te digo si un chatbot te ayuda de verdad.",
  },
  faqs: [
    {
      q: "¿Cuál es la mejor IA para empresas?",
      a: "No hay una sola mejor: depende de la tarea. Las empresas usan asistentes generales, como ChatGPT o Gemini, para redactar y resumir, y chatbots conectados a su información para atender clientes.",
    },
    {
      q: "¿Qué diferencia hay entre ChatGPT y una IA para mi negocio?",
      a: "ChatGPT es un asistente general. Una IA para tu negocio puede usar un modelo parecido, el motor que entiende y escribe texto, pero responde con tu información, en tu web o WhatsApp, con tus reglas y con una persona detrás.",
    },
    {
      q: "¿Cómo implantar IA en mi empresa?",
      a: "Empieza por un solo caso de uso, como las dudas que más se repiten. Después se monta un piloto con tus datos, se ajusta con preguntas reales y, cuando funciona, se conecta a tu web o WhatsApp.",
    },
    {
      q: "¿Qué es un agente de IA para empresas?",
      a: "Es una IA que no solo contesta: completa una tarea con tus herramientas, como reservar una cita o tomar un pedido. Actúa dentro de los límites que tú marcas y pasa a una persona lo que no puede resolver. Se presupuesta según el caso.",
    },
    {
      q: "¿Un chatbot puede atender a mis clientes?",
      a: "Sí, atiende las preguntas frecuentes solo con la información de tu negocio. Cuando no sabe la respuesta, te pasa la conversación a una persona. Así se reducen los errores, aunque no hay garantía absoluta de que acierte siempre.",
    },
    {
      q: "¿Cuánto cuesta y cuánto se tarda en poner IA en marcha?",
      a: `Un chatbot para tu web o WhatsApp cuesta desde ${AI_FROM}. El piloto con tus datos tarda de 1 a 2 semanas, según cuánta información haya que preparar.`,
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

// Local Pro tier of the local SEO page: the only price SEO para IA shows, read and never typed.
const LOCAL_PRO_TIER = pricingTier(seoLocal, "Local Pro")

export const seoParaIa: ServicePageData = {
  slug: "/seo-para-ia/",
  breadcrumbName: "SEO para IA",
  ownOffer: false,
  seo: {
    title: "SEO para IA y GEO: que la IA entienda tu negocio",
    description:
      "SEO para IA (GEO): preparo la información de tu negocio para que ChatGPT, Gemini y los resúmenes con IA de Google la entiendan y puedan citarla. Sin promesas.",
  },
  hero: {
    h1: "SEO para IA: que ChatGPT, Gemini y Google entiendan tu negocio",
    title: "Datos claros que una IA pueda entender",
    titleAccent: "pueda entender",
    subtitle:
      "Preparo la información de tu negocio para que ChatGPT, Gemini o los resúmenes con IA de Google la entiendan y puedan citarla. Es el SEO para IA, también llamado GEO, y va incluido en el plan Local Pro.",
    primaryCtaLabel: "Reservar una llamada",
    secondaryCta: { label: "Ver qué trabajo", href: "#que-trabajo" },
  },
  sectionTitles: {
    benefits: "Qué trabajo para que una IA entienda tu negocio",
    process: "Cómo trabajamos el SEO para IA",
    pricing: "Cuánto cuesta el SEO para IA",
    faq: "Preguntas frecuentes sobre SEO para IA",
  },
  benefits: [
    {
      title: "Datos que no se contradicen",
      text: "Nombre, servicios, zona, horario y precios dicen lo mismo en tu web, en tu perfil de Google y en tus redes.",
    },
    {
      title: "Respuestas directas",
      text: "Cada página y cada pregunta frecuente responde en sus primeras líneas, sin rodeos.",
    },
    {
      title: "Datos estructurados",
      text: "Marcado schema.org para tu negocio, tus servicios, tus preguntas y la ruta de cada página.",
    },
    {
      title: "Acceso para los rastreadores",
      text: "Tu robots.txt no bloquea a los rastreadores de los asistentes de IA.",
    },
    {
      title: "Un índice llms.txt",
      text: "Un archivo con tus páginas más útiles, como apoyo para que los sistemas de IA se orienten.",
    },
    {
      title: "Señales fuera de tu web",
      text: "Perfil de Google completo, perfiles enlazados y reseñas reales que confirman quién eres.",
    },
  ],
  process: [
    {
      title: "Revisión de cómo te ven hoy",
      text: "Pregunto a los principales asistentes de IA lo que preguntaría un cliente de tu sector y tu zona, anoto qué saben de ti, qué falta y qué se contradice, y reviso que sus rastreadores puedan entrar y entender tu web.",
    },
    {
      title: "Plan de prioridades",
      text: "Qué corregir primero y por qué, explicado sin tecnicismos.",
    },
    {
      title: "Implementación",
      text: "Textos, preguntas frecuentes, datos estructurados y acceso, en tu web y en tu perfil.",
    },
    {
      title: "Seguimiento",
      text: "Cada mes repito las mismas preguntas, comparo los resultados y las visitas que llegan desde los asistentes, y recibes un informe con lo que ha cambiado y el siguiente paso.",
    },
  ],
  pricing: {
    from: LOCAL_PRO_TIER.from,
    includes: LOCAL_PRO_TIER.includes.filter((item) => !item.startsWith("Todo lo incluido en")),
    note: seoLocal.pricing.note,
  },
  faqs: [
    {
      q: "¿Qué es el SEO para IA o GEO?",
      a: "Es preparar la información de tu negocio para que asistentes como ChatGPT, Gemini o Perplexity, y los resúmenes con IA de Google, la entiendan y puedan citarla cuando encaje.",
    },
    {
      q: "¿En qué se diferencia el SEO para IA del SEO tradicional?",
      a: "El SEO de siempre busca un buen puesto en la lista de resultados; el SEO para IA cuida que un asistente encuentre datos claros sobre ti cuando escribe su respuesta.",
    },
    {
      q: "¿Es lo mismo GEO que AEO?",
      a: "Casi. El AEO se centra en las respuestas directas y el GEO en los buscadores que generan respuestas con IA.",
    },
    {
      q: "¿Cómo hago que ChatGPT recomiende mi negocio?",
      a: "Nadie puede prometerte que un asistente recomiende o cite tu negocio: no lo controlas tú ni lo controlo yo. Sí se puede trabajar una información clara, coherente y citable.",
    },
    {
      q: "¿Qué hay que trabajar para aparecer en las respuestas de IA?",
      a: "Datos que coincidan en todas partes, respuestas directas, datos estructurados, el acceso de rastreadores, un índice llms.txt y señales fuera de tu web.",
    },
    {
      q: "¿Cuánto cuesta el SEO para IA?",
      a: `El SEO para IA va incluido en el plan Local Pro, que cuesta ${LOCAL_PRO_TIER.from}.`,
    },
  ],
  cta: {
    title: "Veamos qué sabe hoy una IA de tu negocio",
    text: "En una llamada vemos qué información tuya hay y el siguiente paso útil.",
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
  seoParaIa,
  capilarLocal,
  disenoWeb,
  desarrolloSoftware,
  automatizaciones,
  inteligenciaArtificial,
  tiendaOnline,
]

// In-focus service pages per PRD section 5, local SEO first; parked pages excluded.
export const focusServices: ServicePageData[] = [
  seoLocal,
  seoParaIa,
  disenoWeb,
  tiendaOnline,
  desarrolloSoftware,
  automatizaciones,
  inteligenciaArtificial,
]
