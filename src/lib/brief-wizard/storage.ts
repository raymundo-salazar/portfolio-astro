import type { WizardAnswerMap } from "./types"

export type BriefWizardDraft = {
	answers: WizardAnswerMap
	currentSlideId: string | null
	screen?: "wizard" | "review"
	selectedQuestionId?: string | null
}

const getWizardStorage = () => {
	if (typeof window === "undefined") return null

	try {
		return window.localStorage
	} catch {
		return null
	}
}

const safeStringify = (value: unknown) => {
	try {
		return JSON.stringify(value)
	} catch {
		return "{}"
	}
}

export const getWizardStorageKey = (wizardId?: string) =>
	`portfolio-astro:brief-wizard:v1:${wizardId ?? "default"}`

export const getWizardSubmittedKey = (wizardId?: string) =>
	`portfolio-astro:brief-wizard:v1:${wizardId ?? "default"}:submitted`

export const readWizardDraft = (storageKey: string): BriefWizardDraft | null => {
	const storage = getWizardStorage()
	if (!storage) return null

	try {
		const raw = storage.getItem(storageKey)
		if (!raw) return null

		const parsed = JSON.parse(raw) as Partial<BriefWizardDraft>
		if (!parsed || typeof parsed !== "object") return null

		return {
			answers: (parsed.answers ?? {}) as WizardAnswerMap,
			currentSlideId:
				typeof parsed.currentSlideId === "string" ? parsed.currentSlideId : null,
			screen: parsed.screen === "review" ? "review" : "wizard",
			selectedQuestionId:
				typeof parsed.selectedQuestionId === "string" ? parsed.selectedQuestionId : null,
		}
	} catch {
		return null
	}
}

export const saveWizardDraft = (storageKey: string, draft: BriefWizardDraft) => {
	const storage = getWizardStorage()
	if (!storage) return

	try {
		storage.setItem(storageKey, safeStringify(draft))
	} catch {
		// noop: persistence is best-effort only
	}
}

export const clearWizardDraft = (storageKey: string) => {
	const storage = getWizardStorage()
	if (!storage) return

	try {
		storage.removeItem(storageKey)
	} catch {
		// noop
	}
}

export const hasWizardBeenSubmitted = (wizardId?: string) => {
	const storage = getWizardStorage()
	if (!storage) return false

	try {
		return storage.getItem(getWizardSubmittedKey(wizardId)) === "true"
	} catch {
		return false
	}
}

export const markWizardSubmitted = (wizardId?: string) => {
	const storage = getWizardStorage()
	if (!storage) return

	try {
		storage.setItem(getWizardSubmittedKey(wizardId), "true")
	} catch {
		// noop
	}
}
