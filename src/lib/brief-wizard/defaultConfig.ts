import type { WizardConfig } from "./types"

export const briefWizardConfig: WizardConfig = {
	eyebrow: "Brief interactivo",
	title: "Cuéntame qué necesitas y diseñamos el flujo correcto",
	subtitle:
		"Este wizard es completamente configurable desde JSON: campos, pasos, validaciones, estados de visibilidad y estilos base.",
	description:
		"El objetivo es capturar requerimientos complejos sin perder claridad visual ni disciplina de validación.",
	progressLabel: "Avance del brief",
	counterLabel: "Paso",
	buttons: {
		previous: "Volver",
		next: "Siguiente",
		finish: "Enviar brief",
	},
	theme: {
		root: "min-h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_35%),linear-gradient(135deg,_#09090b_0%,_#111827_48%,_#09090b_100%)] text-white",
		panel: "mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-4 py-8 sm:px-6 lg:px-8",
	},
	slides: [
		{
			id: "intro",
			title: "Arranquemos con lo básico",
			subtitle: "Identificación",
			description:
				"Primero recolectamos la información mínima para poder construir el resto del brief con precisión.",
			questions: [
				{
					id: "introTitle",
					type: "title",
					content: "Brief del portafolio",
				},
				{
					id: "introCopy",
					type: "static",
					content:
						"Piensa en este formulario como una portada dinámica: cada pregunta puede activar o esconder otras, y cada paso valida antes de avanzar.",
				},
				{
					id: "fullName",
					type: "text",
					label: "Nombre completo",
					placeholder: "Raymundo Salazar",
					required: true,
					iconLeft: "text",
					helperText: "Lo usaremos para personalizar la experiencia.",
				},
				{
					id: "email",
					type: "email",
					label: "Correo electrónico",
					placeholder: "raymundo@empresa.com",
					required: true,
					iconLeft: "mail",
					helperText: "Debe ser un correo válido.",
					validations: [
						{ type: "email", message: "Escribe un correo electrónico válido." },
					],
				},
				{
					id: "projectType",
					type: "select",
					label: "Tipo de proyecto",
					placeholder: "Selecciona una opción",
					required: true,
					iconRight: "chevronDown",
					options: [
						{ label: "Sitio web / portafolio", value: "website" },
						{ label: "Sistema con flujo paso a paso", value: "wizard" },
						{ label: "Landing de conversión", value: "landing" },
						{ label: "Automatización / operación", value: "automation" },
					],
				},
			],
		},
		{
			id: "scope",
			title: "Alcance y prioridades",
			subtitle: "Requerimientos",
			description:
				"En este paso obtenemos el contexto funcional y el nivel de ambición del proyecto.",
			questions: [
				{
					id: "summary",
					type: "textarea",
					label: "Resumen del proyecto",
					placeholder:
						"Explícame qué debe resolver, para quién y qué problema de negocio ataca.",
					required: true,
					rows: 6,
					helperText: "Una descripción clara aquí reduce retrabajo más tarde.",
					validations: [
						{
							type: "minLength",
							value: 40,
							message: "Explica un poco más el proyecto.",
						},
					],
				},
				{
					id: "deliverables",
					type: "multiselect",
					label: "Entregables esperados",
					required: true,
					helperText: "Puedes elegir varias opciones.",
					options: [
						{ label: "UI / Diseño visual", value: "ui" },
						{ label: "Sistema de formulario", value: "wizard" },
						{ label: "Sitio marketing", value: "marketing" },
						{ label: "Branding / identidad", value: "branding" },
					],
				},
				{
					id: "needsBrandAssets",
					type: "checkbox",
					label: "¿Ya existen activos de marca?",
					helperText: "Marca la casilla si tienes logo, paleta o tipografías definidas.",
					iconLeft: "checkbox",
				},
				{
					id: "budget",
					type: "radio",
					label: "Rango de inversión",
					required: true,
					options: [
						{ label: "Exploratorio", value: "exploratory" },
						{ label: "Medio", value: "mid" },
						{ label: "Alto", value: "high" },
					],
				},
			],
		},
		{
			id: "assets",
			title: "Material de apoyo",
			subtitle: "Archivos y contenido",
			description:
				"Los campos de carga pueden aceptar uno o varios archivos, además de previews para imágenes.",
			visibleWhen: {
				mode: "any",
				rules: [
					{ questionId: "projectType", operator: "equals", value: "wizard" },
					{ questionId: "projectType", operator: "equals", value: "website" },
					{ questionId: "projectType", operator: "equals", value: "landing" },
				],
			},
			questions: [
				{
					id: "assetsTitle",
					type: "subtitle",
					content: "Comparte archivos de referencia",
				},
				{
					id: "referenceFiles",
					type: "file",
					label: "Archivos de referencia",
					multiple: true,
					accept: [".pdf", ".fig", ".psd", ".docx"],
					maxFiles: 6,
					maxSizeMb: 20,
					helperText: "Sube documentos, wireframes o material editable.",
				},
				{
					id: "referenceImages",
					type: "image",
					label: "Imágenes de apoyo",
					multiple: true,
					accept: ["image/*"],
					maxFiles: 8,
					maxSizeMb: 12,
					helperText: "Puedes cargar imágenes, capturas o moodboards.",
				},
				{
					id: "richNotes",
					type: "richtext",
					label: "Notas con formato",
					placeholder: "Describe detalles, enfásis o instrucciones especiales.",
					helperText: "El contenido se guarda como HTML + texto plano.",
				},
			],
		},
		{
			id: "advanced",
			title: "Preguntas condicionadas",
			subtitle: "Visible según respuestas",
			description:
				"Este paso solo aparece si el proyecto realmente requiere branding o sistema de diseño.",
			visibleWhen: {
				mode: "any",
				rules: [
					{
						questionId: "deliverables",
						operator: "includesAny",
						value: ["branding", "ui"],
					},
					{ questionId: "needsBrandAssets", operator: "equals", value: true },
				],
			},
			questions: [
				{
					id: "brandDirection",
					type: "text",
					label: "Dirección visual",
					placeholder: "Ej. sobrio, editorial, tecnólogico, premium",
					helperText: "Esta pregunta depende de entregables y activos de marca.",
					visibleWhen: {
						mode: "any",
						rules: [
							{
								questionId: "deliverables",
								operator: "includesAny",
								value: ["branding", "ui"],
							},
							{ questionId: "needsBrandAssets", operator: "equals", value: true },
						],
					},
				},
				{
					id: "tone",
					type: "radio",
					label: "Tono del proyecto",
					options: [
						{ label: "Corporativo", value: "corporate" },
						{ label: "Cercano", value: "warm" },
						{ label: "Técnico", value: "technical" },
					],
				},
				{
					id: "followUp",
					type: "text",
					label: "WhatsApp o teléfono",
					placeholder: "+52 818 000 0000",
					visibleWhen: {
						questionId: "budget",
						operator: "equals",
						value: "high",
					},
				},
			],
		},
		{
			id: "review",
			title: "Cierre y validación",
			subtitle: "Resumen final",
			description:
				"Antes de terminar, puedes revisar el resumen y confirmar que los datos están completos.",
			visibleWhen: {
				mode: "all",
				rules: [
					{ questionId: "fullName", operator: "notEmpty" },
					{ questionId: "email", operator: "notEmpty" },
				],
			},
			questions: [
				{
					id: "acceptTerms",
					type: "checkbox",
					label: "Confirmación",
					helperText:
						"Acepto que el brief se use para construir la siguiente iteración del proyecto.",
					required: true,
				},
				{
					id: "finalNotes",
					type: "textarea",
					label: "Notas finales",
					placeholder: "Cualquier instrucción que no hayamos cubierto arriba.",
					rows: 4,
				},
				{
					id: "closingCopy",
					type: "static",
					content:
						"Cuando estés listo, pulsa enviar. El wizard bloqueará el avance si hay validaciones pendientes o preguntas obligatorias vacías.",
				},
			],
		},
	],
}
