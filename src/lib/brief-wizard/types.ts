export type FieldValue =
	| string
	| number
	| boolean
	| string[]
	| File[]
	| FileList
	| { html: string; text: string }
	| null
	| undefined

export type WizardValue = FieldValue

export type WizardAnswerMap = Record<string, FieldValue>
export type WizardAnswers = WizardAnswerMap

export interface WizardOption {
	label: string
	value: string | number | boolean
	description?: string
	disabled?: boolean
}

export type WizardVisibilityOperator =
	| "truthy"
	| "falsy"
	| "empty"
	| "notEmpty"
	| "equals"
	| "notEquals"
	| "contains"
	| "notContains"
	| "includesAny"
	| "includesAll"
	| "greaterThan"
	| "greaterThanOrEqual"
	| "lessThan"
	| "lessThanOrEqual"

export interface VisibilityRule {
	questionId: string
	operator: WizardVisibilityOperator
	value?: FieldValue
}

export interface VisibilityGroupCondition {
	mode: "all" | "any"
	rules: VisibilityCondition[]
}

export interface VisibilityNotCondition {
	not: VisibilityCondition
}

export type VisibilityCondition = VisibilityRule | VisibilityGroupCondition | VisibilityNotCondition

export type WizardCondition = VisibilityCondition

export type ValidationRule =
	| {
			type: "email"
			message: string
			when?: VisibilityCondition
	  }
	| {
			type: "minLength"
			value: number
			message: string
			when?: VisibilityCondition
	  }
	| {
			type: "maxLength"
			value: number
			message: string
			when?: VisibilityCondition
	  }
	| {
			type: "pattern"
			value: string
			message: string
			flags?: string
			when?: VisibilityCondition
	  }
	| {
			type: "minFiles"
			value: number
			message: string
			when?: VisibilityCondition
	  }
	| {
			type: "maxFiles"
			value: number
			message: string
			when?: VisibilityCondition
	  }
	| {
			type: "maxSizeMb"
			value: number
			message: string
			when?: VisibilityCondition
	  }
	| {
			type: "min"
			value: number
			message: string
			when?: VisibilityCondition
	  }
	| {
			type: "max"
			value: number
			message: string
			when?: VisibilityCondition
	  }
	| {
			type: "custom"
			name: string
			message?: string
			params?: Record<string, unknown>
			when?: VisibilityCondition
	  }

export type WizardValidationRule = ValidationRule

export interface WizardQuestionBase {
	id: string
	label?: string
	helperText?: string
	description?: string
	placeholder?: string
	defaultValue?: FieldValue
	required?: boolean | VisibilityCondition
	visibleWhen?: VisibilityCondition
	validations?: ValidationRule[]
	className?: string
	labelClassName?: string
	helperClassName?: string
	errorClassName?: string
	inputClassName?: string
	iconLeft?: string
	iconRight?: string
}

export interface WizardTextQuestion extends WizardQuestionBase {
	type: "text" | "email" | "tel" | "url" | "number" | "date"
	label: string
}

export interface WizardTextareaQuestion extends WizardQuestionBase {
	type: "textarea"
	label: string
	rows?: number
}

export interface WizardRichTextQuestion extends WizardQuestionBase {
	type: "richtext"
	label: string
}

export interface WizardChoiceQuestion extends WizardQuestionBase {
	type: "select" | "radio" | "multiselect"
	label: string
	options: WizardOption[]
	maxSelections?: number
}

export interface WizardCheckboxQuestion extends WizardQuestionBase {
	type: "checkbox"
	label: string
}

export interface WizardFileQuestion extends WizardQuestionBase {
	type: "file" | "image"
	label: string
	multiple?: boolean
	accept?: string[]
	maxFiles?: number
	maxSizeMb?: number
}

export interface WizardDateQuestion extends WizardQuestionBase {
	type: "date"
	label: string
	min?: string
	max?: string
}

export interface WizardStaticQuestion {
	id: string
	type: "title" | "subtitle" | "static"
	content: string
	className?: string
	visibleWhen?: VisibilityCondition
}

export type WizardQuestion =
	| WizardTextQuestion
	| WizardTextareaQuestion
	| WizardRichTextQuestion
	| WizardChoiceQuestion
	| WizardCheckboxQuestion
	| WizardFileQuestion
	| WizardDateQuestion
	| WizardStaticQuestion

export type WizardQuestionConfig = WizardQuestion

export interface WizardSlide {
	id: string
	title?: string
	subtitle?: string
	description?: string
	className?: string
	visibleWhen?: VisibilityCondition
	questions: WizardQuestion[]
}

export type WizardStepConfig = WizardSlide

export interface WizardButtons {
	previous?: string
	next?: string
	finish?: string
}

export interface WizardTheme {
	[key: string]: string | undefined
	root?: string
	panel?: string
	hero?: string
	heroEyebrow?: string
	heroTitle?: string
	heroText?: string
	progressTrack?: string
	progressFill?: string
	progressLabel?: string
	stepCounter?: string
	slideShell?: string
	slideHeader?: string
	slideTitle?: string
	slideSubtitle?: string
	questionStack?: string
	questionShell?: string
	label?: string
	helper?: string
	error?: string
	input?: string
	textarea?: string
	select?: string
	radio?: string
	checkbox?: string
	toolbar?: string
	buttonPrimary?: string
	buttonSecondary?: string
	buttonGhost?: string
	successShell?: string
}

export interface WizardConfig {
	id?: string
	eyebrow?: string
	title?: string
	subtitle?: string
	description?: string
	progressLabel?: string
	counterLabel?: string
	buttons?: WizardButtons
	theme?: WizardTheme
	slides: WizardSlide[]
}

export type WizardCustomValidator = (args: {
	value: FieldValue
	answers: WizardAnswerMap
	question: WizardQuestion
	params?: Record<string, unknown>
}) => string | null | undefined

export type WizardValidationMap = Record<string, string[]>
