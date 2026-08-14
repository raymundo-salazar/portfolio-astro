export type WizardPrimitive = string | number | boolean | null

export type WizardValue = WizardPrimitive | WizardPrimitive[] | Record<string, unknown> | undefined

export type WizardAnswers = Record<string, WizardValue>

export type WizardQuestionType =
	| "text"
	| "textarea"
	| "email"
	| "number"
	| "select"
	| "radio"
	| "checkbox"
	| "checkbox-group"
	| "toggle"
	| "date"

export interface WizardOption {
	value: string
	label: string
	description?: string
	disabled?: boolean
}

export type WizardConditionOperator =
	| "equals"
	| "notEquals"
	| "includes"
	| "notIncludes"
	| "oneOf"
	| "noneOf"
	| "gt"
	| "gte"
	| "lt"
	| "lte"
	| "exists"
	| "truthy"
	| "falsy"
	| "empty"
	| "notEmpty"

export interface WizardFieldCondition {
	field: string
	operator: WizardConditionOperator
	value?: WizardPrimitive | WizardPrimitive[]
}

export interface WizardAndCondition {
	and: WizardCondition[]
}

export interface WizardOrCondition {
	or: WizardCondition[]
}

export interface WizardNotCondition {
	not: WizardCondition
}

export type WizardCondition =
	| WizardFieldCondition
	| WizardAndCondition
	| WizardOrCondition
	| WizardNotCondition

export type WizardValidationRule =
	| {
			type: "minLength"
			value: number
			message?: string
			when?: WizardCondition
	  }
	| {
			type: "maxLength"
			value: number
			message?: string
			when?: WizardCondition
	  }
	| {
			type: "min"
			value: number
			message?: string
			when?: WizardCondition
	  }
	| {
			type: "max"
			value: number
			message?: string
			when?: WizardCondition
	  }
	| {
			type: "pattern"
			value: string
			flags?: string
			message?: string
			when?: WizardCondition
	  }
	| {
			type: "oneOf"
			value: WizardPrimitive[]
			message?: string
			when?: WizardCondition
	  }
	| {
			type: "custom"
			name: string
			message?: string
			params?: Record<string, unknown>
			when?: WizardCondition
	  }

export interface WizardQuestionConfig {
	id: string
	type: WizardQuestionType
	label: string
	description?: string
	helperText?: string
	placeholder?: string
	options?: WizardOption[]
	defaultValue?: WizardValue
	visibleWhen?: WizardCondition
	required?: boolean | WizardCondition
	validation?: WizardValidationRule[]
	rows?: number
	min?: number
	max?: number
	step?: number
}

export interface WizardStepConfig {
	id: string
	title: string
	description?: string
	visibleWhen?: WizardCondition
	questions: WizardQuestionConfig[]
}

export type WizardCustomValidator = (args: {
	value: unknown
	answers: WizardAnswers
	question: WizardQuestionConfig
	params?: Record<string, unknown>
}) => string | null | undefined

export interface WizardConfig {
	id: string
	title?: string
	description?: string
	submitLabel?: string
	nextLabel?: string
	backLabel?: string
	finishLabel?: string
	steps: WizardStepConfig[]
}

export type WizardValidationMap = Record<string, string[]>
