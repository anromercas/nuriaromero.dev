// Contenido de las 4 páginas de servicio.
// Precios acordados: landing 149 €, web 5 páginas 399 €, automatización 149 €,
// chatbot IA 399 €, software a medida 999 €. E-commerce: sin precio público.
import type { ServicePageData } from "@/data/types"

export const disenoWeb: ServicePageData = {
  slug: "/servicios/diseno-web-sevilla",
  breadcrumbName: "Diseño web en Sevilla",
  seo: {
    title: "Diseño web en Sevilla para negocios | Webs que salen en Google",
    description:
      "Diseño páginas web en Sevilla para negocios locales: rápidas, optimizadas para SEO local y pensadas para conseguir clientes. Precios claros y trato directo.",
  },
  hero: {
    h1: "Diseño web en Sevilla para negocios que quieren clientes",
    subtitle:
      "Tu página web no es un adorno: es tu comercial disponible 24 horas. Creo webs rápidas, que aparecen en Google cuando alguien busca lo que tú ofreces en Sevilla, y que convierten visitas en llamadas y reservas.",
  },
  benefits: [
    {
      title: "Web hecha por una programadora, no con una plantilla",
      text: "Más de 10 años desarrollando software. Tu web carga en menos de 2 segundos y pasa los Core Web Vitals de Google, algo que las webs de plantilla rara vez consiguen. Y Google lo premia posicionándote por encima.",
    },
    {
      title: "SEO local desde el primer día",
      text: "Estructura, textos y datos técnicos preparados para que aparezcas cuando alguien busca tu servicio en Sevilla: en Google y en Google Maps.",
    },
    {
      title: "Pensada para convertir",
      text: "Botón de WhatsApp, llamada directa, formulario y las respuestas que tu cliente necesita para decidirse. El objetivo no es que la web sea bonita (que lo será): es que te escriban.",
    },
    {
      title: "Tuya de verdad",
      text: "Dominio, hosting y web a tu nombre. Sin cuotas ocultas ni quedarte atada a nadie. Te explico cómo funciona todo en lenguaje normal.",
    },
  ],
  process: [
    {
      title: "Hablamos de tu negocio",
      text: "Una llamada o un café: qué vendes, quién es tu cliente y qué quieres conseguir. Sin tecnicismos.",
    },
    {
      title: "Propuesta cerrada",
      text: "Te envío presupuesto con precio, plazos y qué incluye exactamente. Sin sorpresas después.",
    },
    {
      title: "Diseño y desarrollo",
      text: "Creo la web con los textos orientados a Google y a tus clientes. Vas viendo avances y das tu opinión.",
    },
    {
      title: "Lanzamiento y seguimiento",
      text: "Publico la web, la doy de alta en Google y te enseño a usarla. El primer mes de soporte va incluido.",
    },
  ],
  pricing: {
    from: "399 €",
    includes: [
      "Hasta 5 páginas (inicio, servicios, sobre mí, contacto…)",
      "Diseño a medida adaptado a móvil",
      "Textos optimizados para SEO local y GEO en Sevilla",
      "Botón de WhatsApp y formulario de contacto",
      "Alta en Google y Google Maps (Search Console + Business Profile)",
      "Dominio y hosting el primer año",
      "Un mes de soporte tras el lanzamiento",
    ],
    note: "¿Solo necesitas una landing de una página optimizada para SEO y GEO? Desde 149 €. Presupuesto cerrado antes de empezar.",
  },
  faqs: [
    {
      q: "¿Cuánto cuesta una página web en Sevilla?",
      a: "Una web profesional para un negocio local suele costar entre 500 y 3.000 € según su tamaño y funcionalidades. Mis webs completas de hasta 5 páginas parten de 399 € con todo lo esencial incluido (diseño a medida, SEO local, dominio y hosting el primer año), y las landings de una página desde 149 €. Siempre con presupuesto cerrado antes de empezar.",
    },
    {
      q: "¿Cuánto se tarda en hacer una página web?",
      a: "Una web de negocio local está lista en 2 a 4 semanas desde que tenemos los contenidos (textos, fotos, logo). Si necesitas ayuda con los textos, los redacto yo optimizados para Google.",
    },
    {
      q: "¿Mi web saldrá en Google?",
      a: "Sí. Todas mis webs se entregan indexadas en Google y optimizadas para SEO local: estructura correcta, velocidad de carga, datos estructurados y textos con las búsquedas que usan tus clientes en Sevilla. Posicionar arriba lleva tiempo, pero la base queda perfecta desde el día uno.",
    },
    {
      q: "¿Trabajas solo en Sevilla?",
      a: "Trabajo sobre todo con negocios de Sevilla y su área metropolitana porque el trato cercano marca la diferencia, pero también hago proyectos para el resto de España en remoto.",
    },
    {
      q: "¿Qué pasa si ya tengo una web y no funciona?",
      a: "Hago auditoría y rediseño. A veces basta con optimizar velocidad, textos y SEO local; otras compensa rehacerla. Te digo con sinceridad qué opción te conviene después de revisarla.",
    },
  ],
}

export const desarrolloSoftware: ServicePageData = {
  slug: "/servicios/desarrollo-software-medida",
  breadcrumbName: "Software a medida",
  seo: {
    title: "Desarrollo de software a medida en Sevilla | Aplicaciones web",
    description:
      "Desarrollo software y aplicaciones web a medida para empresas en Sevilla: gestión interna, reservas, presupuestos, portales de cliente. +10 años de experiencia.",
  },
  hero: {
    h1: "Software a medida para tu empresa en Sevilla",
    subtitle:
      "Cuando el Excel se queda corto y los programas genéricos no encajan con tu forma de trabajar, una aplicación hecha a tu medida ahorra horas cada semana. Desarrollo herramientas que se adaptan a tu negocio, y no al revés.",
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
      a: "Es una aplicación creada específicamente para tu negocio: una herramienta de gestión de pedidos, un sistema de reservas, un portal para tus clientes… A diferencia de un programa genérico, hace exactamente lo que tu empresa necesita, sin funciones sobrantes ni licencias mensuales por usuario.",
    },
    {
      q: "¿Cuánto cuesta desarrollar software a medida?",
      a: "Depende del alcance. Una herramienta interna sencilla parte de 999 €; sistemas más completos se presupuestan por fases para que empieces por lo esencial. Siempre sabes el precio total antes de empezar cada fase.",
    },
    {
      q: "¿No me vale con un Excel o un programa estándar?",
      a: "A veces sí, y te lo diré. El software a medida compensa cuando pierdes horas semanales en tareas repetitivas, cuando varias personas necesitan trabajar con los mismos datos o cuando el programa estándar te obliga a cambiar tu forma de trabajar.",
    },
    {
      q: "¿Qué pasa si en el futuro necesito cambios?",
      a: "El software queda documentado y preparado para crecer. Puedo encargarme del mantenimiento y las mejoras, y si algún día quieres que lo continúe otro profesional, podrá hacerlo sin problema: el código y la documentación son tuyos.",
    },
  ],
}

export const automatizaciones: ServicePageData = {
  slug: "/servicios/automatizaciones",
  breadcrumbName: "Automatizaciones",
  seo: {
    title: "Automatización de procesos para negocios en Sevilla | n8n y Make",
    description:
      "Automatizo las tareas repetitivas de tu negocio en Sevilla: facturas, correos, citas, informes. Con n8n y Make, tus herramientas trabajan solas.",
  },
  hero: {
    h1: "Automatizaciones: que tu negocio trabaje solo",
    subtitle:
      "¿Cuántas horas pierdes a la semana copiando datos, enviando los mismos correos o pasando pedidos de un sitio a otro? Conecto las herramientas que ya usas (correo, Excel, WhatsApp, facturación…) para que esas tareas se hagan solas.",
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
      q: "¿Qué tipo de tareas se pueden automatizar?",
      a: "Casi cualquier tarea repetitiva entre programas: enviar recordatorios de cita por WhatsApp o email, generar facturas al cerrar un pedido, volcar formularios web a una hoja de cálculo, avisarte de reseñas nuevas en Google, crear informes semanales de ventas… Si lo haces igual cada vez, probablemente se puede automatizar.",
    },
    {
      q: "¿Qué son n8n y Make?",
      a: "Son plataformas de automatización que conectan entre sí las aplicaciones que ya usas, sin programar desde cero. Son las herramientas líderes del sector y las uso a diario tanto en mis proyectos freelance como en empresas.",
    },
    {
      q: "¿Necesito conocimientos técnicos para usarlas después?",
      a: "No. Las automatizaciones funcionan solas y te entrego cada flujo documentado con instrucciones sencillas. Si algo falla, recibes un aviso y puedes contactarme para revisarlo.",
    },
    {
      q: "¿Esto no es solo para empresas grandes?",
      a: "Al contrario: donde más se nota es en negocios pequeños, donde cada hora cuenta. Una clínica que confirma citas automáticamente o una tienda que genera facturas solas recuperan la inversión en pocas semanas.",
    },
  ],
}

export const inteligenciaArtificial: ServicePageData = {
  slug: "/servicios/inteligencia-artificial",
  breadcrumbName: "Inteligencia artificial",
  seo: {
    title: "IA para negocios en Sevilla | Chatbots y asistentes con IA",
    description:
      "Llevo la inteligencia artificial a tu negocio en Sevilla: chatbots que atienden clientes, asistentes que redactan y clasifican, IA integrada en tus procesos.",
  },
  hero: {
    h1: "Inteligencia artificial aplicada a tu negocio",
    subtitle:
      "La IA ya no es cosa de grandes empresas. Un chatbot que responde a tus clientes a las 11 de la noche, un asistente que redacta respuestas a reseñas o clasifica tus correos: soluciones concretas, con retorno medible y sin humo.",
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
      a: "Los casos más rentables son: un chatbot que atiende dudas y recoge contactos en tu web o WhatsApp, asistentes que redactan respuestas a reseñas y correos, clasificación automática de mensajes, y extracción de datos de documentos como facturas o pedidos. Todo orientado a ahorrar horas de trabajo.",
    },
    {
      q: "¿El chatbot va a decir cosas raras a mis clientes?",
      a: "Se entrena únicamente con la información de tu negocio (servicios, precios, horarios, políticas) y se configura para que, ante dudas que no sabe resolver, tome el contacto y te avise en lugar de inventar. Antes de publicarlo lo pruebas tú misma.",
    },
    {
      q: "¿Qué pasa con la privacidad y el RGPD?",
      a: "Configuro cada solución definiendo qué datos se envían al proveedor de IA y con qué garantías, priorizando proveedores con acuerdos de tratamiento de datos europeos. Te lo dejo documentado para tu registro de tratamientos.",
    },
    {
      q: "¿Cuánto cuesta implantar IA en mi negocio?",
      a: "Un chatbot para web o WhatsApp parte de 399 €. Los proyectos que combinan IA con automatizaciones se presupuestan según el caso, siempre con una prueba piloto previa para que decidas con datos reales.",
    },
  ],
}

export const services = [
  disenoWeb,
  desarrolloSoftware,
  automatizaciones,
  inteligenciaArtificial,
]
