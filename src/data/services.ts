// Contenido de las 4 páginas de servicio.
// Precios acordados: landing 149 €, web 5 páginas 399 €, automatización 149 €,
// chatbot IA 399 €, software a medida 999 €. E-commerce: sin precio público.
import type { ServicePageData } from "@/data/types"

export const disenoWeb: ServicePageData = {
  slug: "/diseno-web-sevilla",
  breadcrumbName: "Diseño web en Sevilla",
  seo: {
    title: "Diseño web en Sevilla | Precio cerrado desde 149 €",
    description:
      "Diseño páginas web en Sevilla para negocios locales: rápidas, con SEO local y precio cerrado antes de empezar. Web completa desde 399 €, landing desde 149 €.",
  },
  hero: {
    h1: "Diseño web en Sevilla para negocios que quieren clientes, no solo una web bonita",
    subtitle:
      "Tu web trabaja 24 horas y es lo primero que ve un cliente antes de decidirse. Si buscan lo que ofreces en Sevilla, que te encuentren a ti.",
    secondaryCta: {
      label: "Ver precios",
      href: "#precios",
    },
  },
  sectionTitles: {
    benefits: "Diseño web en Sevilla hecho por una programadora, no con plantillas",
    process: "Así es el proceso de crear tu página web",
    pricing: "Cuánto cuesta una página web en Sevilla",
    faq: "Preguntas frecuentes sobre diseño web en Sevilla",
  },
  benefits: [
    {
      title: "Construida pensando en los Core Web Vitals de Google",
      text: "Los Core Web Vitals miden qué tan rápido carga tu web, qué tan estable se ve y qué tan rápido responde a un clic. Diseño y programo cada proyecto para cumplir esos tres puntos desde el primer día, sin plugins de sobra que la frenen. Te importa aunque no seas programador: Google usa esas métricas para decidir qué webs muestra antes.",
    },
    {
      title: "SEO local desde el primer día: apareces en Google y en Google Maps",
      text: "Estructura y textos con las búsquedas que hace tu cliente en Sevilla, datos técnicos correctos (velocidad, etiquetas, estructura semántica), y alta y configuración de tu ficha de Google Business Profile conectada con tu web.",
    },
    {
      title: "La web es tuya: dominio y hosting a tu nombre",
      text: "Dominio y hosting se contratan a tu nombre, no al mío. Si algún día cambias de proveedor o prefieres no depender de nadie, puedes hacerlo sin pedir permiso. Sin contratos que te atan ni cuotas mensuales que aparecen a los seis meses.",
    },
  ],
  process: [
    {
      title: "Hablamos de tu negocio",
      text: "Una llamada o un café. Me cuentas qué vendes, quién es tu cliente y qué quieres conseguir. Hablamos en tu idioma, no en el mío.",
    },
    {
      title: "Presupuesto cerrado",
      text: "Te envío una propuesta por escrito: precio, plazos y qué incluye. La apruebas y arrancamos. Si algo cambia por el camino, el precio de lo pactado no se mueve.",
    },
    {
      title: "Diseño y desarrollo",
      text: "Construyo la web con textos orientados a Google y a tus clientes reales. Ves avances durante el proceso y ajustas lo que haga falta antes de la entrega.",
    },
    {
      title: "Lanzamiento y primer mes de soporte",
      text: "Publico la web, la doy de alta en Google y Google Maps, y te enseño a cambiar tú misma un texto, una foto o un precio. El primer mes de soporte va incluido.",
    },
  ],
  pricing: {
    from: "149 €",
    note: "¿Cuál te conviene? Si necesitas estar online ya, con lo esencial: landing. Si tu negocio ya tiene definidos varios servicios y quieres posicionar cada uno por separado: web completa.",
    tiers: [
      {
        name: "Landing de una página",
        from: "149 €",
        includes: [
          "Diseño a medida adaptado a móvil",
          "Textos optimizados para SEO local en Sevilla",
          "Botón de WhatsApp y formulario de contacto",
          "Dominio y hosting el primer año",
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
        note: "¿Necesitas una tienda online completa? Se presupuesta aparte.",
      },
    ],
  },
  faqs: [
    {
      q: "¿Cuánto cuesta una página web en Sevilla?",
      a: "Para un negocio local en Sevilla, una web profesional suele costar entre 500 y 3.000 €. Trabajo con precio cerrado desde el principio: una landing de una página parte de 149 €, y una web completa de hasta 5 páginas parte de 399 €. Ese precio incluye diseño a medida adaptado a móvil, textos optimizados para SEO local, dominio y hosting el primer año, y un mes de soporte tras el lanzamiento. Sabes exactamente cuánto vas a pagar antes de empezar: nada de letra pequeña ni cuotas que aparecen a mitad de proyecto.",
    },
    {
      q: "¿Cuánto tiempo se tarda en tener la página web lista?",
      a: "Una web de negocio local suele estar lista en 2 a 4 semanas, contando desde que tengo todos los contenidos: textos, fotos y logo. Si necesitas ayuda para redactar los textos, los escribo yo misma ya optimizados para Google, aunque eso puede sumar unos días. Una landing de una sola página suele ir más rápido que una web completa de 5 páginas, simplemente porque hay menos contenido que preparar y revisar contigo. El plazo exacto siempre se cierra en la propuesta inicial, junto con el precio, así que lo sabes desde el primer día.",
    },
    {
      q: "¿Qué diferencia hay entre una web hecha a medida y una hecha con Wix o una plantilla de WordPress?",
      a: "La diferencia está en la base: una plantilla usa el mismo diseño y el mismo código para miles de webs distintas, mientras que yo vengo del desarrollo de software y construyo cada proyecto pensando en cumplir los Core Web Vitals de Google (las métricas que miden velocidad de carga, estabilidad visual y capacidad de respuesta). Eso significa menos código de sobra, menos plugins innecesarios y una base técnica más sólida para el SEO. También significa que el dominio y el hosting se contratan a tu nombre, no al mío, así que no dependes de una plataforma de terceros para seguir teniendo tu propia web.",
    },
    {
      q: "Si contrato a un diseñador web, ¿la página queda a mi nombre o me quedo atado a esa persona o agencia?",
      a: "En mi caso, la web queda a tu nombre de verdad: el dominio y el hosting se contratan directamente a tu nombre, no al mío. Esto significa que si en algún momento decides cambiar de proveedor, continuar tú misma o contratar a otra persona, puedes hacerlo sin pedirme permiso ni depender de nadie. No es lo habitual en todas las agencias: algunas retienen el dominio o el hosting bajo su cuenta, lo que te deja atado a ellas. Antes de contratar cualquier servicio de diseño web, es una pregunta que merece la pena hacer explícitamente.",
    },
    {
      q: "¿Mi página web va a aparecer en Google?",
      a: "Sí: todas las webs que hago se entregan indexadas en Google y optimizadas para SEO local, con estructura correcta, velocidad de carga cuidada, datos estructurados y textos escritos con las búsquedas reales que hacen tus clientes en Sevilla. Eso incluye también el alta en Google Search Console y en tu ficha de Google Business Profile. Lo que no puedo prometerte es una posición concreta en el buscador ni un plazo exacto para conseguirla, porque eso depende de más factores además de la web. Lo que sí garantizo es que la base técnica queda perfecta desde el primer día.",
    },
    {
      q: "¿Necesito saber de tecnología para gestionar mi web después de que me la entregues?",
      a: "No. En el lanzamiento te enseño a hacer los cambios básicos tú misma: actualizar un texto, cambiar una foto o ajustar un precio, sin necesidad de tocar código ni depender de mí para cada pequeño ajuste. El primer mes de soporte después de la entrega va incluido, así que si algo no te queda claro usando el panel, puedes preguntarme directamente. Para cambios más grandes (añadir una página nueva, rediseñar una sección) sí que suelo encargarme yo, pero el día a día de mantener actualizado tu contenido queda en tus manos.",
    },
    {
      q: "¿Trabajas solo con negocios de Sevilla o también en remoto?",
      a: "Trabajo sobre todo con negocios de Sevilla capital y su área metropolitana, porque el trato cercano (una llamada, un café, una reunión en persona si hace falta) marca la diferencia en cómo queda la web. Dicho esto, también hago proyectos para negocios del resto de España trabajando en remoto, cuando el cliente lo prefiere así. La diferencia principal es que con los negocios de Sevilla puedo ofrecer ese trato presencial si lo necesitas, mientras que fuera de Sevilla el proceso completo se hace por videollamada y mensajería.",
    },
    {
      q: "¿Qué incluye exactamente el precio de 399 € de la web completa?",
      a: "Los 399 € de la web completa incluyen: hasta 5 páginas (inicio, servicios, sobre mí, contacto y lo que necesite tu negocio), diseño a medida adaptado a móvil, textos optimizados para SEO local y para las búsquedas de tu zona en Sevilla, botón de WhatsApp y formulario de contacto, alta en Google Search Console y en Google Business Profile, dominio y hosting durante el primer año, y un mes de soporte tras el lanzamiento. Si necesitas algo adicional, como una tienda online completa con pasarela de pago, se presupuesta aparte y siempre con precio cerrado antes de empezar.",
    },
    {
      q: "Ya tengo una página web pero no me está funcionando, ¿qué puedo hacer?",
      a: "Lo primero que hago es una auditoría de tu web actual antes de proponerte nada. A veces el problema se resuelve optimizando velocidad, textos y SEO local sobre lo que ya tienes, sin necesidad de rehacer nada desde cero. Otras veces, sobre todo si la web es muy antigua o está construida sobre una plantilla muy limitada, compensa más rediseñarla por completo. Te digo con sinceridad cuál de las dos opciones te conviene después de revisarla, no la que más me convenga a mí facturar. Esa auditoría inicial no lleva ningún compromiso de contratar el rediseño después.",
    },
    {
      q: "¿Es mejor una landing de una página o una web completa de varias páginas?",
      a: "Depende de en qué momento esté tu negocio. Si necesitas estar online ya, con lo esencial (qué ofreces, cómo contactarte) y sin mucho presupuesto, la landing desde 149 € suele ser suficiente, sobre todo para validar una idea, un evento o un servicio puntual. Si tu negocio ya tiene varios servicios definidos y quieres que cada uno pueda posicionar por separado en Google, la web completa desde 399 € da mejor resultado, porque cada página trabaja para búsquedas distintas. En la primera llamada te digo cuál encaja mejor con tu caso concreto.",
    },
  ],
  cta: {
    title: "Empecemos con tu página web en Sevilla",
    text: "Cuéntame en qué punto está tu negocio y qué necesitas conseguir. Te respondo con una propuesta clara, sin compromiso.",
  },
}

export const desarrolloSoftware: ServicePageData = {
  slug: "/desarrollo-software-medida",
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
  slug: "/automatizaciones",
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
  slug: "/inteligencia-artificial",
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
