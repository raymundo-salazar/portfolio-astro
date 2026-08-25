import { briefWizardConfig } from "./defaultConfig"
import type {
	VisibilityCondition,
	WizardAnswerMap,
	WizardConfig,
	WizardQuestion,
	WizardSlide,
} from "./types"

export type BriefClientProfile = {
	slug: string
	aliases?: string[]
	title?: string
	subtitle?: string
	description?: string
	eyebrow?: string
	theme?: Partial<WizardConfig["theme"]>
	initialAnswers?: WizardAnswerMap
	hiddenQuestionIds?: string[]
	requiredQuestionIds?: string[]
}

const seguroConSentidoClientProfile: BriefClientProfile = {
	slug: "seguro-con-sentido",
	aliases: ["seguro-con-proposito"],
	title: "Brief para Seguro con Sentido",
	subtitle: "Ayúdanos a entender el proyecto y la siguiente etapa",
	description:
		"Formulario personalizado para levantar contexto comercial, marca, sitio web, SEO, contenido, conversión y medición para Seguro con Sentido.",
	theme: {
		hero: "mb-8 flex flex-col gap-4 rounded-[2rem] border border-[#FF671933] bg-[#FF67190d] px-6 py-6 shadow-2xl shadow-black/20 backdrop-blur-xl",
		heroEyebrow: "text-xs font-semibold uppercase tracking-[0.32em] text-[#FFB38A]",
		heroTitle: "text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl",
		heroText: "max-w-4xl text-sm leading-7 text-[#F1F1F1] sm:text-base",
		progressFill:
			"h-2 rounded-full bg-gradient-to-r from-[#FF6719] via-[#FF8A4A] to-[#FDBA74] transition-all duration-300",
		buttonPrimary:
			"inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#FF6719] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff8240] disabled:cursor-not-allowed disabled:opacity-40",
		buttonSecondary:
			"inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40",
		buttonGhost:
			"inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-[#FF671933] bg-white/5 px-5 py-3 text-sm font-semibold text-[#F1F1F1] transition hover:border-[#FF671955] hover:bg-[#FF67190d] disabled:cursor-not-allowed disabled:opacity-40",
	},
	initialAnswers: {
		contact_company_name: "Seguro con Sentido",
		contact_respondent_name: "Gonzalo Daniel García",
		contact_role: "owner",
		contact_email: "gonzalo.garcia@seguroconsentido.mx",
		contact_phone: "8112770158",
		contact_website: "https://www.seguroconsentido.mx",
		business_context_category: "finance",
		business_context_description:
			"Asesoría, estrategias y soluciones en seguros para dar tranquilidad y seguridad a largo plazo.",
		project_goal_primary_goal: "trust",
		project_goal_priority: "trust",
		project_goal_urgency_reason: "outdated_presence",
		project_needs_primary: ["website", "seo", "content", "brand", "analytics"],
		website_goal: "trust",
		website_status: "unclear",
		seo_geography: ["local_city", "state"],
		digital_assets: ["website", "blog"],
		digital_desired_actions: ["contact", "schedule", "request_info"],
		brand_dependency: "human_backed_brand",
		brand_tone: ["professional", "close", "educational", "institutional", "calm"],
		scope_proposal_needs: ["diagnosis", "scope", "phases", "timeline", "investment"],
		insurance_priority_lines: [
			"life",
			"medical_expenses",
			"retirement_savings",
			"family_protection",
			"business_insurance",
		],
	},
	hiddenQuestionIds: ["contact_company_name", "contact_website", "business_context_category"],
	requiredQuestionIds: [
		"contact_email",
		"contact_phone",
		"business_context_stage",
		"business_context_purpose",
		"business_context_desired_perception",
		"project_goal_primary_goal",
		"project_goal_problem",
		"project_goal_success_definition",
		"ideal_customer_description",
		"ideal_customer_segment",
		"ideal_customer_trigger",
		"ideal_customer_objections",
		"offer_main_offers",
		"offer_priority_offer",
		"offer_differentiators",
		"sales_current_sources",
		"sales_flow",
		"sales_friction",
		"sales_tools",
		"digital_what_fails",
		"digital_measurement_tools",
		"project_needs_primary",
		"seo_priority_searches",
		"brand_assets",
		"brand_dependency",
		"scope_urgency",
		"scope_decision_makers",
		"scope_proposal_needs",
		"closing_one_sentence_need",
		"closing_confirmation",
	],
}

const clientProfiles = [seguroConSentidoClientProfile]
const hiddenVisibility: VisibilityCondition = {
	questionId: "__hidden__",
	operator: "equals",
	value: "__never__",
}

const patchQuestion = (question: WizardQuestion, profile: BriefClientProfile) => {
	if (profile.hiddenQuestionIds?.includes(question.id)) {
		return {
			...question,
			visibleWhen: hiddenVisibility,
		}
	}

	const shouldForceRequired = profile.requiredQuestionIds?.includes(question.id)

	if (shouldForceRequired && "required" in question) {
		return {
			...question,
			required: true,
		}
	}

	return question
}

const patchSlide = (slide: WizardSlide, profile: BriefClientProfile): WizardSlide | null => {
	return {
		...slide,
		questions: slide.questions.map(question => patchQuestion(question, profile)),
	}
}

export const buildClientWizardConfig = (profile: BriefClientProfile): WizardConfig => ({
	...briefWizardConfig,
	id: `brief:${profile.slug}`,
	eyebrow: profile.eyebrow ?? briefWizardConfig.eyebrow,
	title: profile.title ?? briefWizardConfig.title,
	subtitle: profile.subtitle ?? briefWizardConfig.subtitle,
	description: profile.description ?? briefWizardConfig.description,
	theme: {
		...briefWizardConfig.theme,
		...profile.theme,
	},
	slides: briefWizardConfig.slides
		.map(slide => patchSlide(slide, profile))
		.filter((slide): slide is WizardSlide => slide !== null),
})

export const getClientProfileBySlug = (slug: string) =>
	clientProfiles.find(profile => profile.slug === slug || profile.aliases?.includes(slug))

export const getClientPaths = () =>
	clientProfiles.flatMap(profile => [profile.slug, ...(profile.aliases ?? [])])
