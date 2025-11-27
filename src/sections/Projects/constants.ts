import type { Projects } from "./types"

export const PROJECTS: Projects = [
	{
		company: "Vitti Logistics",
		images: ["/projects/vitti-vsta/cover.png"],
		title: "Sistema Integral de Logística y Aduanas",
		liveUrl: "",
		githubUrl: "",
		shortDescription:
			"Plataforma integral para la gestión operativa de logística, aduanas, facturación y tracking en tiempo real. Diseñada como ecosistema modular para la operación completa de transporte, carga y exportación.",
		description:
			"Este sistema se desarrolló para reemplazar procesos manuales y plataformas desconectadas dentro de la cadena logística de Vitti Logistics. Incluye módulos de aduanas, control documental, tracking GPS, monitoreo de rutas, facturación, maniobras y comunicación entre operadores. A nivel de producto, la plataforma centraliza operaciones que antes se distribuían entre Excel, WhatsApp y sistemas aislados, logrando trazabilidad completa y control de cumplimiento regulatorio.\n\nEn su arquitectura se implementaron microservicios en Node.js, SQL Server como motor transaccional y contenedorización con Docker, orquestados mediante pipelines de Azure DevOps. Se utilizaron colas para desacoplar servicios y asegurar resiliencia durante picos de tracking GPS. El frontend se desarrolló en React con un diseño escalable y componentes reutilizables para múltiples módulos. La infraestructura en Azure se definió con un enfoque de seguridad, acceso por roles (RBAC) y despliegue automatizado por ambiente.",
		technologies: [
			"Node.js",
			"Express",
			"React",
			"SQL Server",
			"Azure",
			"Docker",
			"Azure DevOps",
			"Microservices",
		],
		year: 2025,
		features: [
			"Gestión completa de logística y aduanas",
			"Microservicios escalables y desacoplados",
			"Tracking GPS en tiempo real",
			"Facturación y control documental",
			"Pipelines CI/CD en Azure DevOps",
		],
		role: "Team Lead & Fullstack Developer",
		duration: "12 meses",
		workMode: "Presencial",
	},

	/* ============================================================
	 * 2024 — COBALTO INMUEBLES (2 APPS)
	 * ============================================================ */
	{
		company: "Cobalto Inmuebles",
		images: ["/projects/cobalto-tenant/cover.png"],
		title: "App Móvil para Residentes",
		liveUrl: "https://cobalto.com.mx/",
		appleUrl: "https://apps.apple.com/mx/app/cobalto-inmuebles/id1472266028",
		androidUrl: "https://play.google.com/store/apps/details?id=com.aupa.cobalto&hl=es_MX",
		githubUrl: "",
		shortDescription:
			"Aplicación React Native para residentes con control de accesos, visitantes, QR dinámico y notificaciones. Incluye diseño UI/UX completo desde cero.",
		description:
			"Esta aplicación se creó como la solución principal para la experiencia de residentes dentro de complejos privados administrados por Cobalto. Permite gestionar accesos, generar códigos QR, registrar visitantes, recibir notificaciones del condominio y administrar información de vivienda. A nivel de producto, reemplaza procesos manuales y mejora la comunicación con seguridad.\n\nLa arquitectura se diseñó modular, usando React Native con TypeScript, almacenamiento seguro, manejo avanzado de navegación y flujos de autenticación. El sistema se integró con servicios backend mediante API REST y WebSockets para eventos en tiempo real. Además, se definió un diseño completo en Figma, con componentes reutilizables y lineamientos visuales escalables.",
		technologies: ["React Native", "TypeScript", "Figma", "Mobile Architecture"],
		year: 2024,
		features: [
			"Códigos QR dinámicos",
			"Gestión de visitantes y accesos",
			"Notificaciones push",
			"UI/UX diseñado desde cero",
		],
		role: "UI/UX Designer & Mobile Developer",
		duration: "12 meses",
		workMode: "Freelance",
	},

	{
		company: "Cobalto Inmuebles",
		images: ["/projects/cobalto-security/cover.png"],
		title: "App Móvil para Elementos de Seguridad",
		liveUrl: "https://cobalto.com.mx/",
		androidUrl: "",
		shortDescription:
			"Aplicación para guardias y personal de acceso. Controla entradas, validación de QR, bitácoras y alertas operativas en tiempo real.",
		description:
			"Esta app se desarrolló para el personal de seguridad de los condominios, permitiendo centralizar la verificación de accesos, escaneo de códigos QR, registro de eventos, bitácoras y comunicación interna. El producto ayuda a estandarizar procesos y reduce errores en validación manual.\n\nA nivel técnico, se construyó en React Native con integración a APIs del ecosistema de Cobalto. Se implementaron flujos offline para accesos de contingencia, un lector QR optimizado, validaciones de identidad y sincronización con los servicios backend. El diseño prioriza rapidez operativa, accesibilidad y visibilidad de eventos críticos.",
		technologies: ["React Native", "TypeScript", "QR Systems", "Mobile Development"],
		year: 2024,
		features: [
			"Escáner QR optimizado",
			"Bitácoras y eventos operativos",
			"Modos offline de contingencia",
			"Sincronización en tiempo real",
		],
		role: "UI/UX Designer & Mobile Developer",
		duration: "12 meses",
		workMode: "Freelance",
	},

	/* ============================================================
	 * 2024 — FORZA TRANSPORTATION (4 APPS)
	 * ============================================================ */
	{
		title: "Driver App estilo Uber para Camiones",
		company: "Forza Transportation Services",
		images: ["/projects/forza-drivers-app/cover.png"],
		liveUrl: "https://forzatrans.com/",
		androidUrl: "https://play.google.com/store/apps/details?id=com.driverappds",
		appleUrl: "https://apps.apple.com/mx/app/forza-drivers/id1611661768",
		shortDescription:
			"Aplicación para operadores con tracking, rutas, evidencias y comunicación con despacho. Inspirada en flujos estilo Uber pero adaptada al transporte pesado.",
		description:
			"La aplicación se diseñó para optimizar la operación de los operadores de transporte dentro de Forza. Permite recibir rutas asignadas, registrar maniobras, cargar fotos como evidencia, enviar estatus al despacho y recibir notificaciones operativas. El producto reduce tiempos muertos, evita llamadas innecesarias y mejora el control del ciclo de viaje.\n\nSu arquitectura se basa en React Native con integración a mapas, tracking GPS de alta frecuencia, almacenamiento local para modo offline y APIs internas del TMS. Se implementaron patrones para sincronización eficiente y reducción de consumo de batería, además de un backend Node.js que procesa eventos y registra la trazabilidad de cada operador.",
		technologies: ["React Native", "TypeScript", "Node.js", "Maps API"],
		year: 2024,
		features: [
			"Tracking GPS continuo",
			"Carga de evidencias fotográficas",
			"Rutas dinámicas sincronizadas",
			"Notificaciones push",
		],
		role: "Mobile Developer",
		duration: "3 meses",
		workMode: "Presencial",
	},

	{
		company: "Forza Transportation Services",
		images: ["/projects/forza-fleet-gate/cover.png"],
		title: "App de Gestión de Entrada/Salida y Validación CTPAT",
		liveUrl: "https://forzatrans.com/",
		androidUrl: "https://play.google.com/store/apps/details?id=com.forzatrans.fleet.gate",
		shortDescription:
			"Aplicación operativa para patios con control de unidades, checklist CTPAT y auditoría con evidencia fotográfica integrada.",
		description:
			"Desarrollada para modernizar el control de entradas y salidas en patios de Forza, esta app permite validar unidades, realizar auditorías CTPAT, registrar sellos, tomar fotos y sincronizar datos con los sistemas centrales. Se diseñó para uso en campo, bajo condiciones operativas exigentes.\n\nTécnicamente se implementó en React Native con módulos específicos para fotografía, formularios dinámicos, flujos offline y sincronización con backend. El backend en Node.js procesa auditorías, genera historiales verificables y mantiene trazabilidad completa de cada unidad. La arquitectura está orientada a confiabilidad y uso continuo.",
		technologies: ["React Native", "Node.js", "CTPAT Workflow"],
		year: 2024,
		features: [
			"Checklist CTPAT digital",
			"Fotos y evidencia automática",
			"Historial de auditorías",
			"Flujos offline",
		],
		role: "UX/UI & Mobile Leader",
		duration: "6 meses",
		workMode: "Presencial",
	},

	// {
	// 	title: "App de Accesos y Visitas con QR",
	// 	company: "Forza Transportation Services",
	// 	images: ["https://placehold.co/800x600"],
	// 	liveUrl: "https://forzatrans.com/",
	// 	shortDescription:
	// 		"Control de accesos y visitas mediante códigos QR dinámicos, roles y validaciones automáticas para instalaciones internas.",
	// 	description:
	// 		"Esta aplicación sustituyó procesos manuales de control de visitas y personal en instalaciones de Forza. Permite generar y validar códigos QR, registrar entradas, verificar identidades y administrar perfiles. A nivel de producto, mejora seguridad y trazabilidad.\n\nEn arquitectura, se construyó en React Native con validación QR, sincronización por roles y endpoints seguros. Se integró un sistema de QR rotativo para evitar suplantaciones e implementaron flujos de registro optimizados para personal con alto volumen de actividades.",
	// 	technologies: ["React Native", "QR Systems", "Node.js"],
	// 	year: 2024,
	// 	features: [
	// 		"QR dinámico rotativo",
	// 		"Validación de perfiles",
	// 		"Registro automático",
	// 		"Sincronización con TMS",
	// 	],
	// 	role: "UX/UI & Mobile Leader",
	// 	duration: "6 meses",
	// 	workMode: "Presencial",
	// },

	{
		company: "Forza Transportation Services",
		images: ["/projects/forza-tms/cover.png"],
		title: "App TMS Espejo",
		liveUrl: "https://forzatrans.com/",
		androidUrl: "https://play.google.com/store/apps/details?id=com.forzatrans.forza.core",
		githubUrl: "",
		shortDescription:
			"Versión móvil del TMS de Forza para supervisores y gerencia. Consulta de rutas, unidades, incidencias y datos operativos.",
		description:
			"Aplicación destinada a supervisores que necesitan acceso rápido a información del TMS desde campo. Permite visualizar rutas, unidades, estatus, incidencias y datos clave del transporte. Mejora la velocidad de respuesta operativa.\n\nLa arquitectura usa React Native con componentes reutilizables del ecosistema interno y un backend Node.js que provee datos procesados y optimizados. El enfoque fue movilidad, consumo eficiente y seguridad en datos sensibles.",
		technologies: ["React Native", "TypeScript", "Node.js"],
		year: 2024,
		features: [
			"Dashboard móvil",
			"Consulta de rutas y unidades",
			"Notificaciones críticas",
			"UI optimizada para supervisores",
		],
		role: "",
		duration: "",
		workMode: "",
	},
	/* ============================================================
	 * 2024 — FORZA TRANSPORTATION — CHATBOTS & AUTOMATION
	 * ============================================================ */
	{
		company: "Forza Transportation Services",
		title: "Chatbot de WhatsApp con OpenAI Assistant",
		liveUrl: "",
		githubUrl: "",
		shortDescription:
			"Chatbot avanzado conectado a OpenAI Assistant para automatizar consultas operativas y flujos internos. Reduce carga operativa y centraliza información del TMS.",
		description:
			"Este chatbot se integró al ecosistema de Forza para asistir a operadores y personal interno con información instantánea. Se conectó a OpenAI Assistant para procesar preguntas en lenguaje natural, permitiendo conocer estatus de unidades, rutas, documentos y procesos de logística. El flujo de interacción se diseñó para resolver tareas sin intervención humana.\n\nDesde el punto de vista técnico, se desarrolló en Node.js utilizando Baileys.js para la comunicación directa con WhatsApp. Se construyeron adaptadores que conectan la IA con APIs internas del TMS, aplicando validación de permisos, sanitización de consultas y logs operativos. El resultado es un sistema híbrido IA + backend que responde consultas complejas en segundos.",
		technologies: ["Node.js", "OpenAI API", "Baileys.js", "Automation"],
		year: 2024,
		features: [
			"Consultas al TMS vía IA",
			"Interpretación en lenguaje natural",
			"Automatización de flujos",
			"Integración WhatsApp Business",
		],
		role: "",
		duration: "",
		workMode: "",
	},

	{
		company: "Forza Transportation Services",
		title: "Chatbot de Filtrado Automático de Conductores",
		liveUrl: "",
		githubUrl: "",
		shortDescription:
			"Chatbot diseñado para filtrar candidatos a operadores mediante WhatsApp. Evalúa respuestas, clasifica perfiles y reduce carga de reclutamiento.",
		description:
			"Se desarrolló un chatbot totalmente automatizado para el área de reclutamiento de operadores. El sistema realiza preguntas dinámicas, evalúa respuestas, identifica experiencia relevante, clasifica al candidato y determina si pasa a entrevista. Esto sustituyó procesos manuales que requerían llamadas y seguimiento individual.\n\nEl backend usa Node.js con Baileys.js para comunicación con WhatsApp, además de un motor de reglas que determina la puntuación del candidato. La app almacena resultados y sincroniza datos con sistemas internos para el pipeline de contratación. Se optimizó para manejar cientos de candidatos por día sin intervención humana.",
		technologies: ["Node.js", "Baileys.js", "Scoring Engine", "Automation"],
		year: 2024,
		features: [
			"Evaluación automática",
			"Preguntas dinámicas",
			"Clasificación por experiencia",
			"Reglas configurables",
		],
		role: "",
		duration: "",
		workMode: "",
	},

	/* ============================================================
	 * 2023 — GOBIERNO DEL ESTADO DE NUEVO LEÓN
	 * ============================================================ */
	{
		company: "Gobierno del Estado de Nuevo León",
		images: ["/projects/genl-acceso/cover.png"],
		title: "Portal de Impuestos y Pagos Gubernamentales",
		liveUrl: "https://acceso.nl.gob.mx/",
		shortDescription:
			"Plataforma para pago de impuestos y servicios estatales. Incluye integración con pasarelas de pago, paneles administrativos y servicios ciudadanos.",
		description:
			"Este proyecto fue parte de la transformación digital del Gobierno de Nuevo León. El portal unifica trámites, pagos y consultas ciudadanas, permitiendo realizar operaciones que antes requerían asistencia presencial. Se diseñó un sistema modular que centralizara servicios dispersos y ofreciera una experiencia moderna y unificada.\n\nA nivel técnico, lideré el desarrollo frontend con React y TypeScript, implementando flujos críticos de pago, autenticación, dashboards administrativos y comunicación con AWS. También migré servicios PHP a Node.js para mejorar estabilidad, además de definir pipelines CI/CD y estándares de desarrollo para el equipo.",
		technologies: ["React", "TypeScript", "AWS", "Node.js", "Laravel"],
		year: 2023,
		features: [
			"Plataforma completa de pagos",
			"Panel administrativo",
			"Integraciones con servicios estatales",
			"CI/CD en AWS",
		],
		role: "",
		duration: "",
		workMode: "",
	},

	/* ============================================================
	 * 2019–2020 — ENVIA.COM / TENDENCYS
	 * ============================================================ */
	{
		company: "Envia.com / Tendencys Innovation",
		images: ["/projects/envia/cover.png"],
		title: "Multi-Carrier Shipping Engine (FedEx, UPS, DHL)",
		liveUrl: "https://envia.com/",
		shortDescription:
			"Motor de cálculos de envío con conexión simultánea a múltiples carriers. Procesa tarifas en tiempo real y normaliza respuestas.",
		description:
			"Este motor fue diseñado para conectar simultáneamente con APIs de FedEx, UPS y DHL, permitiendo calcular costos de envío en tiempo real. El objetivo era reemplazar procesos lentos y ofrecer una experiencia rápida y unificada dentro del checkout. El sistema maneja miles de consultas concurrentes y normaliza respuestas para ofrecer comparaciones consistentes.\n\nA nivel arquitectónico, se desarrolló un backend en Node.js con manejo asíncrono de solicitudes, caching estratégico, manejo de reintentos, logging avanzado y control de tiempos de respuesta. El motor soporta múltiples reglas de negocio y latencias variables de cada carrier. El resultado fue un aumento significativo en la velocidad de cotización global.",
		technologies: ["Node.js", "FedEx API", "UPS API", "DHL API", "MySQL"],
		year: 2019,
		features: [
			"Conexión multi-carrier simultánea",
			"Normalización de tarifas",
			"Caching y reintentos",
			"Procesamiento asíncrono",
		],
		role: "",
		duration: "",
		workMode: "",
	},

	{
		company: "Envia.com / Tendencys Innovation",
		title: "Migración de CodeIgniter a Laravel",
		shortDescription:
			"Migración completa del monolito CodeIgniter hacia Laravel. Reestructura de arquitectura, modelos, controladores y APIs internas.",
		description:
			"Se realizó una migración estratégica para modernizar la base tecnológica de los sistemas internos de Envia.com. El objetivo era mejorar mantenibilidad, escalabilidad y seguridad. Se reescribieron módulos centrales, procesos de checkout, integraciones internas y endpoints críticos.\n\nSe implementó Laravel como framework principal, con una arquitectura más segmentada, controladores limpios, validaciones centralizadas y modelos sólidos. Además, se optimizó la estructura de base de datos y se integraron nuevos componentes de seguridad. El resultado fue un sistema más estable y sencillo de mantener.",
		technologies: ["PHP", "Laravel", "MySQL", "REST API"],
		year: 2019,
		features: [
			"Reescritura completa",
			"Validaciones centralizadas",
			"Optimización de BD",
			"Endpoints más seguros",
		],
		role: "",
		duration: "",
		workMode: "",
	},

	/* ============================================================
	 * 2023 — GTR ACADEMY (3 PROYECTOS)
	 * ============================================================ */
	{
		company: "GTR Academy",
		images: ["/projects/gtr-backoffice/cover.png"],
		title: "App de Escaneo QR Offline",
		liveUrl: "https://gtr.academy/",
		githubUrl: "",
		shortDescription:
			"Aplicación móvil para validar tickets incluso sin conexión. Sincronización diferida y almacenamiento local seguro.",
		description:
			"Esta aplicación permite a organizadores validar tickets incluso sin acceso a internet. Diseñada para eventos masivos, evita filas y congestiones al permitir validación instantánea. Cuando la conexión regresa, sincroniza todos los registros.\n\nUsa React Native con almacenamiento local optimizado, un motor de verificación offline y sincronización inteligente con Firebase. Se trabajó en performance, manejando lectura de cientos de códigos por minuto.",
		technologies: ["React Native", "Offline Storage", "QR Scanner", "Firebase"],
		year: 2023,
		features: [
			"Modo offline completo",
			"Sincronización automática",
			"Escaneo de alta velocidad",
			"Validación segura",
		],
		role: "Fullstack Developer",
		duration: "6 meses",
		workMode: "Remoto",
	},

	{
		company: "GTR Academy",
		// images: ["https://placehold.co/800x600"],
		title: "Web App Gtr Academy",
		liveUrl: "https://gtr.academy/",
		githubUrl: "https://github.com/raymundo-salazar/gtr-access-control",
		shortDescription:
			"Dashboard web que refleja actividad en tiempo real: accesos, validaciones y estadísticas visuales del evento.",
		description:
			"La web app espejo permite a administradores visualizar en tiempo real todas las validaciones realizadas en las apps móviles. Se creó para monitorear capacidad, flujos de entrada y detectar intentos fallidos o fraudulentos.\n\nSu arquitectura usa Vue.js conectado a Firebase Realtime Database, permitiendo actualizaciones instantáneas sin recargar la página. Se diseñó con gráficos y widgets para apoyar decisiones operativas durante eventos.",
		technologies: ["Vue.js", "Firebase Realtime", "Dashboard"],
		year: 2023,
		features: [
			"Visualización en tiempo real",
			"Estadísticas en vivo",
			"Monitoreo de accesos",
			"Integración Firebase",
		],
		role: "",
		duration: "",
		workMode: "",
	},
	/* ============================================================
	 * 2022 — GLOBANT (3 PROYECTOS)
	 * ============================================================ */
	{
		company: "Globant",
		title: "Componentes y Pantallas para App de Tecate",
		shortDescription:
			"Desarrollo de componentes y pantallas en React Native para las aplicaciones oficiales de Tecate. Enfoque en branding, performance y UX.",
		description:
			"Participé como desarrollador móvil en la creación de pantallas y componentes clave dentro de la aplicación oficial de Tecate. Los módulos incluían flujos de promociones, dinámicas interactivas y contenidos multimedia, alineados a campañas nacionales.\n\nDesde el punto de vista técnico, trabajé construyendo interfaces altamente optimizadas, con navegación avanzada, manejo eficiente de estado y componentes adaptados a lineamientos de marca. Se priorizó el rendimiento en dispositivos de gama media, asegurando fluidez y tiempos de carga cortos.",
		technologies: ["React Native", "TypeScript", "Animations", "UX"],
		year: 2022,
		features: [
			"UI optimizada",
			"Componentes reutilizables",
			"Branding corporativo",
			"Integración multimedia",
		],
		role: "Mobile Developer",
		duration: "3 meses",
		workMode: "Remoto",
	},

	{
		company: "Globant",
		images: ["/projects/globant-disney-plus/cover.png"],
		title: "Componentes para App de Disney+",
		liveUrl: "https://www.disneyplus.com/",
		appleUrl: "https://apps.apple.com/es/app/disney/id1446075923",
		androidUrl: "https://play.google.com/store/apps/details?id=com.disney.disneyplus",
		shortDescription:
			"Desarrollo de componentes internos en React Native para Disney+. Cumplimiento estricto de lineamientos de producto global.",
		description:
			"En este proyecto contribuí con la implementación de componentes y pantallas internas para la app de Disney+. El trabajo exigía precisión visual y adherencia a guidelines internacionales, garantizando accesibilidad y consistencia.\n\nA nivel técnico, se trabajó con recursos gráficos de alto nivel, animaciones cuidadas y flujos de navegación específicos. Se integraron componentes reutilizables dentro del sistema de diseño existente, manteniendo estándares de calidad propios de plataformas globales.",
		technologies: ["React Native", "TypeScript", "UI/UX", "Animations"],
		year: 2022,
		features: [
			"Componentes escalables",
			"Calidad visual premium",
			"Cumplimiento de guidelines globales",
			"Integración con sistemas internos",
		],
		role: "Mobile Developer",
		duration: "3 meses",
		workMode: "Remoto",
	},

	/* ============================================================
	 * 2017 — VMC TECHNOLOGY / MEDIA FALCON (2 PROYECTOS)
	 * ============================================================ */
	{
		company: "VMC Technology / Media Falcon",
		images: ["/projects/ibugg/cover.png"],
		title: "iBugg — Business Card Scanner & Reader",
		shortDescription:
			"Aplicación híbrida para escanear tarjetas de presentación, extraer datos mediante OCR y administrarlos desde un directorio.",
		description:
			"iBugg fue una app híbrida diseñada para digitalizar tarjetas de presentación mediante OCR. Permitía escanear tarjetas, extraer texto automáticamente, guardar contactos, clasificarlos y sincronizarlos con un panel web.\n\nEl desarrollo incluía la integración del motor OCR, captura de imágenes, almacenamiento local y sincronización remota. Se construyó usando tecnologías híbridas para soportar Android, iOS y Windows Phone con un único código base.",
		technologies: ["Hybrid Apps", "OCR", "JavaScript", "Mobile"],
		year: 2017,
		features: [
			"OCR integrado",
			"Sincronización con backend",
			"Directorio de contactos",
			"Compatibilidad multiplataforma",
		],
		role: "Frontend Developer",
		duration: "6 meses",
		workMode: "Presencial",
	},

	{
		company: "VMC Technology / Media Falcon",
		title: "Editor Drag & Drop para Email Marketing",
		shortDescription:
			"Editor visual para construir plantillas de email mediante arrastrar y soltar, similar a Mailchimp. Exportación HTML lista para campañas.",
		description:
			"Este proyecto consistió en construir un editor visual para campañas de email marketing. Permitía arrastrar bloques, editar contenido, generar plantillas y exportarlas como HTML compatible con múltiples plataformas de correo.\n\nTécnicamente se implementó un sistema de componentes dinámicos, eventos drag & drop personalizados, almacenamiento de plantillas y un exportador HTML. El desarrollo mejoró la eficiencia de los equipos de marketing al reducir la dependencia de diseñadores o programadores.",
		technologies: ["Drag & Drop API", "JavaScript", "HTML", "CSS"],
		year: 2017,
		features: [
			"Editor completamente visual",
			"Exportación HTML",
			"Componentes personalizables",
			"Interfaz intuitiva",
		],
		role: "Frontend Developer",
		duration: "6 meses",
		workMode: "Presencial",
	},

	/* ============================================================
	 * 2015 — POSITIVO AGENCIA DE PUBLICIDAD
	 * ============================================================ */
	{
		company: "Positivo Agencia de Publicidad",
		images: ["/projects/llevaleflores/cover.png"],
		title: "Ecommerce llevaleflores.com + Backoffice / CRM",
		liveUrl: "https://llevaleflores.com/",
		shortDescription:
			"Desarrollo del ecommerce llevaleflores.com junto con su CRM y panel administrativo. Gestión de pedidos, envíos y catálogo.",
		description:
			"Este proyecto incluyó el diseño y desarrollo integral del sitio de ecommerce llevaleflores.com, permitiendo la compra de arreglos florales, la administración de pedidos y el manejo de inventario. Se integraron métodos de pago, cotización de envíos y notificaciones.\n\nEl backoffice incluía un CRM que permitía gestionar clientes, pedidos, reportes y campañas. El desarrollo se realizó con PHP, MySQL y JavaScript, asegurando una plataforma funcional y sencilla de administrar.",
		technologies: ["PHP", "MySQL", "JavaScript", "HTML/CSS"],
		year: 2015,
		features: [
			"Carrito de compras",
			"Panel administrativo",
			"CRM integrado",
			"Gestión de pedidos y envíos",
		],
		role: "Desarrollador web",
		duration: "12 meses",
		workMode: "Presencial",
	},

	/* ============================================================
	 * 2024 — DILO CON FLORES
	 * ============================================================ */
	{
		company: "Dilo con Flores",
		images: ["/projects/diloconflores/cover.png"],
		title: "Ecommerce diloconflores.com + Sistema Administrativo",
		liveUrl: "https://diloconflores.com/",
		shortDescription:
			"Plataforma de ecommerce con backend administrativo para manejo de ventas, inventario, aportaciones y reportes financieros.",
		description:
			"Desarrollé el ecommerce completo de Dilo con Flores junto con el sistema administrativo utilizado internamente. El frontend permite a clientes comprar productos, consultar disponibilidad y recibir notificaciones. El panel interno administra inventarios, aportaciones de capital, movimientos financieros, estadísticas y reportes.\n\nLa plataforma utiliza React para el frontend y Node.js con MySQL para el backend. Se añadieron flujos de autenticación, roles, reportes descargables y un módulo contable que permite administrar aportaciones, retiros y seguimiento operativo.",
		technologies: ["React", "Node.js", "MySQL", "Tailwind"],
		year: 2024,
		features: [
			"Ecommerce completo",
			"Sistema administrativo",
			"Reportes y finanzas",
			"Gestión de inventario",
		],
		role: "Fullstack Developer",
		duration: "6 meses",
		workMode: "Presencial",
	},
]
