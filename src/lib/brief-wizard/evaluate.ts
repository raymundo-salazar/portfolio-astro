import type {
	FieldValue,
	ValidationRule,
	VisibilityCondition,
	VisibilityRule,
	WizardAnswerMap,
	WizardConfig,
	WizardCustomValidator,
	WizardQuestion,
	WizardSlide,
} from "./types"

export const cn = (...parts: Array<string | undefined | false | null>) =>
	parts.filter(Boolean).join(" ")

const isEmptyValue = (value: FieldValue) => {
	if (value == null) return true
	if (typeof value === "string") return value.trim().length === 0
	if (typeof value === "number") return Number.isNaN(value)
	if (typeof value === "boolean") return false
	if (Array.isArray(value)) return value.length === 0
	if (typeof FileList !== "undefined" && value instanceof FileList) return value.length === 0
	if (value instanceof File) return false
	if (typeof value === "object") {
		if ("html" in value && "text" in value) {
			return !value.text.trim() && !value.html.trim()
		}

		return Object.keys(value).length === 0
	}

	return false
}

const toComparable = (value: FieldValue) => {
	if (value == null) return value
	if (Array.isArray(value)) return value
	if (typeof FileList !== "undefined" && value instanceof FileList) return Array.from(value)
	if (value instanceof File) return value
	if (typeof value === "object" && "text" in value) return value.text
	return value
}

const isConditionGroup = (
	condition: VisibilityCondition
): condition is { mode: "all" | "any"; rules: VisibilityCondition[] } => "mode" in condition

const isConditionRule = (condition: VisibilityCondition): condition is VisibilityRule =>
	"questionId" in condition

export const evaluateVisibilityCondition = (
	condition: VisibilityCondition | undefined,
	answers: WizardAnswerMap
): boolean => {
	if (!condition) return true

	if ("not" in condition) return !evaluateVisibilityCondition(condition.not, answers)

	if (isConditionGroup(condition)) {
		const results = condition.rules.map(rule => evaluateVisibilityCondition(rule, answers))
		return condition.mode === "all" ? results.every(Boolean) : results.some(Boolean)
	}

	if (!isConditionRule(condition)) return false

	const current = toComparable(answers[condition.questionId])

	switch (condition.operator) {
		case "truthy":
			return current ? true : false
		case "falsy":
			return current ? false : true
		case "empty":
			return isEmptyValue(current)
		case "notEmpty":
			return !isEmptyValue(current)
		case "equals":
			return Array.isArray(current)
				? current.some(item => String(item) === String(condition.value))
				: String(current) === String(condition.value)
		case "notEquals":
			return Array.isArray(current)
				? current.every(item => String(item) !== String(condition.value))
				: String(current) !== String(condition.value)
		case "contains":
			return typeof current === "string"
				? current.toLowerCase().includes(String(condition.value ?? "").toLowerCase())
				: Array.isArray(current)
					? current.some(item => String(item) === String(condition.value))
					: false
		case "notContains":
			return typeof current === "string"
				? !current.toLowerCase().includes(String(condition.value ?? "").toLowerCase())
				: Array.isArray(current)
					? current.every(item => String(item) !== String(condition.value))
					: true
		case "includesAny":
			return Array.isArray(current) && Array.isArray(condition.value)
				? condition.value.some(item =>
						current.some(currentItem => String(currentItem) === String(item))
					)
				: false
		case "includesAll":
			return Array.isArray(current) && Array.isArray(condition.value)
				? condition.value.every(item =>
						current.some(currentItem => String(currentItem) === String(item))
					)
				: false
		case "greaterThan":
			return Number(current) > Number(condition.value)
		case "greaterThanOrEqual":
			return Number(current) >= Number(condition.value)
		case "lessThan":
			return Number(current) < Number(condition.value)
		case "lessThanOrEqual":
			return Number(current) <= Number(condition.value)
		default:
			return false
	}
}

export const isSlideVisible = (slide: WizardSlide, answers: WizardAnswerMap) =>
	evaluateVisibilityCondition(slide.visibleWhen, answers)

export const isQuestionVisible = (question: WizardQuestion, answers: WizardAnswerMap) =>
	evaluateVisibilityCondition(question.visibleWhen, answers)

export const getVisibleSlides = (slides: WizardSlide[], answers: WizardAnswerMap) =>
	slides.filter(slide => isSlideVisible(slide, answers))

export const getVisibleQuestions = (slide: WizardSlide, answers: WizardAnswerMap) =>
	slide.questions.filter(question => isQuestionVisible(question, answers))

export const getDefaultValue = (question: WizardQuestion): FieldValue => {
	if ("defaultValue" in question && question.defaultValue !== undefined) {
		return question.defaultValue
	}

	switch (question.type) {
		case "checkbox":
			return false
		case "multiselect":
			return []
		case "file":
		case "image":
			return []
		case "richtext":
			return { html: "", text: "" }
		case "number":
			return null
		case "date":
			return ""
		default:
			return ""
	}
}

export const getFieldValueText = (value: FieldValue) => {
	if (value == null) return ""
	if (typeof value === "string") return value
	if (typeof value === "number") return String(value)
	if (typeof value === "boolean") return value ? "Sí" : "No"
	if (Array.isArray(value)) return value.map(item => String(item)).join(", ")
	if (typeof FileList !== "undefined" && value instanceof FileList) {
		return Array.from(value)
			.map(file => file.name)
			.join(", ")
	}
	if (value instanceof File) return value.name
	if (typeof value === "object" && "text" in value) return value.text
	return ""
}

const getErrorMessage = (question: WizardQuestion, fallback: string) =>
	question.label ? `${question.label}: ${fallback}` : fallback

const passesValidationCondition = (rule: ValidationRule, answers: WizardAnswerMap) =>
	!("when" in rule) || evaluateVisibilityCondition(rule.when, answers)

export const getFileCount = (value: FieldValue) => {
	if (typeof FileList !== "undefined" && value instanceof FileList) return value.length
	if (Array.isArray(value) && value.every(item => item instanceof File)) return value.length
	if (value instanceof File) return 1
	return 0
}

const getLargestSizeMb = (value: FieldValue) => {
	const files =
		typeof FileList !== "undefined" && value instanceof FileList
			? Array.from(value)
			: Array.isArray(value) && value.every(item => item instanceof File)
				? value
				: value instanceof File
					? [value]
					: []

	return files.reduce((size, file) => Math.max(size, file.size / (1024 * 1024)), 0)
}

const runCustomValidation = (
	rule: Extract<ValidationRule, { type: "custom" }>,
	value: FieldValue,
	answers: WizardAnswerMap,
	question: WizardQuestion,
	customValidators: Record<string, WizardCustomValidator> = {}
) => {
	const validator = customValidators[rule.name]

	if (!validator) {
		return null
	}

	return validator({
		value,
		answers,
		question,
		params: rule.params,
	})
}

export const evaluateValidation = (
	question: WizardQuestion,
	value: FieldValue,
	answers: WizardAnswerMap = {},
	customValidators: Record<string, WizardCustomValidator> = {}
) => {
	const validations: ValidationRule[] = [
		...("validations" in question ? (question.validations ?? []) : []),
	]
	const errors: string[] = []

	const required = "required" in question ? question.required : false
	const isRequired =
		typeof required === "boolean" ? required : evaluateVisibilityCondition(required, answers)

	if (isRequired && isEmptyValue(value)) {
		errors.push(getErrorMessage(question, "Este campo es obligatorio."))
	}

	if (!isEmptyValue(value)) {
		const textValue = getFieldValueText(value)

		for (const rule of validations) {
			if (!passesValidationCondition(rule, answers)) {
				continue
			}

			switch (rule.type) {
				case "email": {
					const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
					if (!emailPattern.test(textValue)) errors.push(rule.message)
					break
				}
				case "minLength":
					if (textValue.length < rule.value) errors.push(rule.message)
					break
				case "maxLength":
					if (textValue.length > rule.value) errors.push(rule.message)
					break
				case "pattern":
					if (!new RegExp(rule.value, rule.flags).test(textValue))
						errors.push(rule.message)
					break
				case "minFiles":
					if (getFileCount(value) < rule.value) errors.push(rule.message)
					break
				case "maxFiles":
					if (getFileCount(value) > rule.value) errors.push(rule.message)
					break
				case "maxSizeMb":
					if (getLargestSizeMb(value) > rule.value) errors.push(rule.message)
					break
				case "min":
					{
						const numericValue = Number(value)
						if (Number.isNaN(numericValue) || numericValue < rule.value) {
							errors.push(rule.message)
						}
					}
					break
				case "max":
					{
						const numericValue = Number(value)
						if (Number.isNaN(numericValue) || numericValue > rule.value) {
							errors.push(rule.message)
						}
					}
					break
				case "custom": {
					const customError = runCustomValidation(
						rule,
						value,
						answers,
						question,
						customValidators
					)
					if (customError) {
						errors.push(customError)
					} else if (!customValidators[rule.name] && rule.message) {
						errors.push(rule.message)
					}
					break
				}
				default:
					break
			}
		}
	}

	return errors
}

export const getStepErrors = (
	slide: WizardSlide,
	answers: WizardAnswerMap,
	customValidators: Record<string, WizardCustomValidator> = {}
) => {
	const nextErrors: Record<string, string> = {}

	for (const question of getVisibleQuestions(slide, answers)) {
		const messages = evaluateValidation(
			question,
			answers[question.id],
			answers,
			customValidators
		)
		if (messages.length) {
			nextErrors[question.id] = messages[0]
		}
	}

	return nextErrors
}

export const getWizardErrors = (
	config: WizardConfig,
	answers: WizardAnswerMap,
	customValidators: Record<string, WizardCustomValidator> = {}
) => {
	const nextErrors: Record<string, string> = {}

	for (const slide of getVisibleSlides(config.slides, answers)) {
		Object.assign(nextErrors, getStepErrors(slide, answers, customValidators))
	}

	return nextErrors
}

export const createInitialAnswers = (
	config: WizardConfig,
	initialAnswers: WizardAnswerMap = {}
) => {
	const answers: WizardAnswerMap = { ...initialAnswers }

	for (const slide of config.slides) {
		for (const question of slide.questions) {
			if (
				answers[question.id] === undefined &&
				question.type !== "title" &&
				question.type !== "subtitle" &&
				question.type !== "static"
			) {
				answers[question.id] = getDefaultValue(question)
			}
		}
	}

	return answers
}

export const normalizeWizardConfig = (config: WizardConfig): WizardConfig => ({
	...config,
	buttons: {
		previous: config.buttons?.previous ?? "Volver",
		next: config.buttons?.next ?? "Siguiente",
		finish: config.buttons?.finish ?? "Enviar",
	},
	theme: {
		...config.theme,
	},
	slides: config.slides.map(slide => ({
		...slide,
		questions: slide.questions.map(question => ({ ...question })),
	})),
})

export const getFirstVisibleSlideIndex = (config: WizardConfig, answers: WizardAnswerMap) => {
	const firstVisibleSlide = getVisibleSlides(config.slides, answers)[0]

	if (!firstVisibleSlide) {
		return -1
	}

	return config.slides.findIndex(slide => slide.id === firstVisibleSlide.id)
}

export const getWizardProgress = (
	config: WizardConfig,
	currentIndex: number,
	answers: WizardAnswerMap
) => {
	const visibleSlides = getVisibleSlides(config.slides, answers)
	const safeIndex =
		visibleSlides.length === 0
			? 0
			: Math.min(Math.max(currentIndex, 0), visibleSlides.length - 1)

	return {
		currentIndex: safeIndex,
		total: visibleSlides.length,
		percentage: visibleSlides.length > 0 ? ((safeIndex + 1) / visibleSlides.length) * 100 : 0,
	}
}

export const getFieldValueTextList = (answers: WizardAnswerMap) =>
	Object.entries(answers).map(([key, value]) => ({ key, value: getFieldValueText(value) }))
