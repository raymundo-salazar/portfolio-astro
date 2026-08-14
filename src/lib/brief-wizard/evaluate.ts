import type {
	FieldValue,
	ValidationRule,
	VisibilityCondition,
	VisibilityRule,
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
	if (value instanceof FileList) return value.length === 0
	if (value instanceof File) return false
	if (typeof value === "object") {
		if ("html" in value && "text" in value) return !value.text.trim() && !value.html.trim()
		return Object.keys(value).length === 0
	}
	return false
}

const toComparable = (value: FieldValue) => {
	if (value == null) return value
	if (Array.isArray(value)) return value
	if (value instanceof FileList) return Array.from(value)
	if (value instanceof File) return value
	if (typeof value === "object" && "text" in value) return value.text
	return value
}

export const evaluateVisibilityCondition = (
	condition: VisibilityCondition | undefined,
	answers: Record<string, FieldValue>
): boolean => {
	if (!condition) return true

	if ("not" in condition) return !evaluateVisibilityCondition(condition.not, answers)

	if ("mode" in condition) {
		const results = condition.rules.map(rule => evaluateVisibilityCondition(rule, answers))
		return condition.mode === "all" ? results.every(Boolean) : results.some(Boolean)
	}

	const rule = condition as VisibilityRule
	const current = toComparable(answers[rule.questionId])

	switch (rule.operator) {
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
				? current.some(item => item === rule.value)
				: current === rule.value
		case "notEquals":
			return Array.isArray(current)
				? current.every(item => item !== rule.value)
				: current !== rule.value
		case "contains":
			return typeof current === "string"
				? current.toLowerCase().includes(String(rule.value ?? "").toLowerCase())
				: Array.isArray(current)
					? current.includes(rule.value as never)
					: false
		case "notContains":
			return typeof current === "string"
				? !current.toLowerCase().includes(String(rule.value ?? "").toLowerCase())
				: Array.isArray(current)
					? !current.includes(rule.value as never)
					: true
		case "includesAny":
			return Array.isArray(current) && Array.isArray(rule.value)
				? rule.value.some(item => current.includes(item))
				: false
		case "includesAll":
			return Array.isArray(current) && Array.isArray(rule.value)
				? rule.value.every(item => current.includes(item))
				: false
		case "greaterThan":
			return Number(current) > Number(rule.value)
		case "greaterThanOrEqual":
			return Number(current) >= Number(rule.value)
		case "lessThan":
			return Number(current) < Number(rule.value)
		case "lessThanOrEqual":
			return Number(current) <= Number(rule.value)
		default:
			return false
	}
}

export const isSlideVisible = (slide: WizardSlide, answers: Record<string, FieldValue>) =>
	evaluateVisibilityCondition(slide.visibleWhen, answers)

export const isQuestionVisible = (question: WizardQuestion, answers: Record<string, FieldValue>) =>
	evaluateVisibilityCondition(question.visibleWhen, answers)

export const getVisibleSlides = (slides: WizardSlide[], answers: Record<string, FieldValue>) =>
	slides.filter(slide => isSlideVisible(slide, answers))

export const getVisibleQuestions = (slide: WizardSlide, answers: Record<string, FieldValue>) =>
	slide.questions.filter(question => isQuestionVisible(question, answers))

export const getDefaultValue = (question: WizardQuestion) => {
	if ("defaultValue" in question && question.defaultValue !== undefined)
		return question.defaultValue
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
	if (value instanceof FileList)
		return Array.from(value)
			.map(file => file.name)
			.join(", ")
	if (value instanceof File) return value.name
	if (typeof value === "object" && "text" in value) return value.text
	return ""
}

export const evaluateValidation = (question: WizardQuestion, value: FieldValue) => {
	const validations: ValidationRule[] = [
		...("validations" in question ? (question.validations ?? []) : []),
	]
	const errors: string[] = []
	const isRequired = question.required === true

	if (isRequired && isEmptyValue(value)) errors.push("Este campo es obligatorio.")

	if (!isEmptyValue(value)) {
		const textValue = getFieldValueText(value)

		for (const rule of validations) {
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
					if (!new RegExp(rule.value).test(textValue)) errors.push(rule.message)
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
				default:
					break
			}
		}
	}

	return errors
}

export const getFileCount = (value: FieldValue) => {
	if (value instanceof FileList) return value.length
	if (Array.isArray(value) && value.every(item => item instanceof File)) return value.length
	if (value instanceof File) return 1
	return 0
}

export const getLargestSizeMb = (value: FieldValue) => {
	const files =
		value instanceof FileList
			? Array.from(value)
			: Array.isArray(value) && value.every(item => item instanceof File)
				? value
				: value instanceof File
					? [value]
					: []
	return files.reduce((size, file) => Math.max(size, file.size / (1024 * 1024)), 0)
}
