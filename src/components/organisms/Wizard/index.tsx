import { useEffect, useMemo, useRef, useState } from "react"

import ChoiceField from "@/components/atoms/Wizard/ChoiceField"
import FileField from "@/components/atoms/Wizard/FileField"
import RichTextField from "@/components/atoms/Wizard/RichTextField"
import StaticContent from "@/components/atoms/Wizard/StaticContent"
import TextField from "@/components/atoms/Wizard/TextField"
import TextareaField from "@/components/atoms/Wizard/TextareaField"
import ToggleField from "@/components/atoms/Wizard/ToggleField"
import {
	cn,
	createInitialAnswers,
	getDefaultValue,
	getFieldValueText,
	getFirstVisibleSlideIndex,
	getStepErrors,
	getWizardErrors,
	isSlideVisible,
	getVisibleQuestions,
	getVisibleSlides,
	normalizeWizardConfig,
} from "@/lib/brief-wizard/evaluate"
import {
	clearWizardDraft,
	getWizardStorageKey,
	markWizardSubmitted,
	readWizardDraft,
	saveWizardDraft,
} from "@/lib/brief-wizard/storage"
import type {
	FieldValue,
	WizardAnswerMap,
	WizardConfig,
	WizardCustomValidator,
	WizardQuestion,
	WizardSlide,
} from "@/lib/brief-wizard/types"
import { FiArrowLeft, FiArrowRight } from "react-icons/fi"

import StepSlide from "./StepSlide"

export type WizardProps = {
	config: WizardConfig
	initialAnswers?: WizardAnswerMap
	successPath?: string
	onComplete?: (answers: WizardAnswerMap) => void | Promise<void>
	onSubmit?: (answers: WizardAnswerMap) => void | Promise<void>
	onChange?: (answers: WizardAnswerMap) => void
	onStepChange?: (step: WizardSlide, index: number) => void
	customValidators?: Record<string, WizardCustomValidator>
	className?: string
}

const themeFallback = {
	root: "min-h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_36%),linear-gradient(135deg,_#09090b_0%,_#111827_50%,_#09090b_100%)] text-white",
	panel: "mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-4 py-8 sm:px-6 lg:px-8",
	hero: "mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 px-6 py-6 shadow-2xl shadow-black/20 backdrop-blur-xl",
	heroEyebrow: "text-xs font-semibold uppercase tracking-[0.32em] text-blue-300",
	heroTitle: "text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl",
	heroText: "max-w-4xl text-sm leading-7 text-gray-300 sm:text-base",
	progressTrack: "h-2 rounded-full bg-white/10",
	progressFill:
		"h-2 rounded-full bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-300 transition-all duration-300",
	progressLabel: "text-sm font-medium text-gray-300",
	stepCounter: "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200",
	slideShell: "",
	slideHeader: "",
	slideTitle: "",
	slideSubtitle: "",
	questionStack: "",
	questionShell: "",
	label: "",
	helper: "",
	error: "",
	input: "",
	textarea: "",
	select: "",
	radio: "",
	checkbox: "",
	toolbar: "",
	buttonPrimary:
		"inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40",
	buttonSecondary:
		"inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40",
	buttonGhost:
		"inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-gray-200 transition hover:border-blue-400/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40",
	successShell: "rounded-[2rem] border border-emerald-400/30 bg-emerald-500/10 p-8 text-center",
}

const mergeTheme = (theme?: WizardConfig["theme"]) => ({ ...themeFallback, ...theme })
const FOOTER_HEIGHT = 88
const PROGRESS_HEIGHT = 7

type SlideStatus = "active" | "success" | "pending" | "blocked"

const serializeAnswerForSubmission = (value: FieldValue) => {
	if (value == null) return value
	if (value instanceof File) {
		return {
			name: value.name,
			size: value.size,
			type: value.type,
		}
	}
	if (typeof FileList !== "undefined" && value instanceof FileList) {
		return Array.from(value).map(file => ({
			name: file.name,
			size: file.size,
			type: file.type,
		}))
	}
	if (Array.isArray(value) && value.every(item => item instanceof File)) {
		return value.map(file => ({
			name: file.name,
			size: file.size,
			type: file.type,
		}))
	}
	if (Array.isArray(value)) return value
	if (typeof value === "object" && "html" in value && "text" in value) {
		return value
	}
	if (typeof value === "object") return value

	return value
}

const isMeaningfulStoredAnswer = (value: FieldValue) => {
	if (value == null) return false
	if (typeof value === "string") return value.trim().length > 0
	if (typeof value === "number") return !Number.isNaN(value)
	if (typeof value === "boolean") return true
	if (Array.isArray(value)) return value.length > 0
	if (typeof FileList !== "undefined" && value instanceof FileList) return value.length > 0
	if (value instanceof File) return true
	if (typeof value === "object" && "html" in value && "text" in value) {
		return Boolean(value.text.trim() || value.html.trim())
	}
	if (typeof value === "object") return Object.keys(value).length > 0

	return false
}

const mergeInitialAnswersWithDraft = (
	config: WizardConfig,
	initialAnswers: WizardAnswerMap = {},
	storedAnswers?: WizardAnswerMap
) => {
	const mergedAnswers: WizardAnswerMap = { ...initialAnswers }

	for (const [questionId, storedValue] of Object.entries(storedAnswers ?? {})) {
		if (isMeaningfulStoredAnswer(storedValue)) {
			mergedAnswers[questionId] = storedValue
		}
	}

	return createInitialAnswers(config, mergedAnswers)
}

const getFormspreeWizardEndpoint = () => {
	const formspreeId = import.meta.env.FORMSPREE_WIZARD_ID ?? import.meta.env.FORMSPREE_ID

	return formspreeId ? `https://formspree.io/f/${formspreeId}` : null
}

const ClockIcon = ({ className }: { className?: string }) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
		className={className}
	>
		<circle cx="12" cy="12" r="9" />
		<path d="M12 7v5l3 2" />
	</svg>
)

const isFilesValue = (value: FieldValue): value is File[] | FileList =>
	Array.isArray(value) || (typeof FileList !== "undefined" && value instanceof FileList)

const renderQuestion = (
	question: WizardQuestion,
	value: FieldValue,
	error: string | null,
	setValue: (next: FieldValue) => void,
	theme: ReturnType<typeof mergeTheme>
) => {
	switch (question.type) {
		case "text":
		case "email":
		case "tel":
		case "url":
		case "number":
		case "date":
			return (
				<TextField
					question={question}
					value={
						typeof value === "string" || typeof value === "number" ? value : undefined
					}
					error={error}
					onChange={setValue as (next: string) => void}
					theme={theme}
				/>
			)
		case "textarea":
			return (
				<TextareaField
					question={question}
					value={typeof value === "string" ? value : undefined}
					error={error}
					onChange={setValue as (next: string) => void}
					theme={theme}
				/>
			)
		case "richtext":
			return (
				<RichTextField
					question={question}
					value={
						typeof value === "object" && value && "html" in value ? value : undefined
					}
					error={error}
					onChange={setValue as (next: { html: string; text: string }) => void}
					theme={theme}
				/>
			)
		case "radio":
		case "select":
		case "multiselect":
			return (
				<ChoiceField
					question={question}
					value={
						typeof value === "string" ||
						(Array.isArray(value) && value.every(item => typeof item === "string"))
							? value
							: undefined
					}
					error={error}
					onChange={setValue as (next: string | string[]) => void}
					theme={theme}
				/>
			)
		case "checkbox":
			return (
				<ToggleField
					question={question}
					value={typeof value === "boolean" ? value : undefined}
					error={error}
					onChange={setValue as (next: boolean) => void}
					theme={theme}
				/>
			)
		case "file":
		case "image":
			return (
				<FileField
					question={question}
					value={isFilesValue(value) ? value : undefined}
					error={error}
					onChange={setValue as (next: File[]) => void}
					theme={theme}
				/>
			)
		case "title":
		case "subtitle":
		case "static":
			return <StaticContent question={question} theme={theme} />
		default:
			return null
	}
}

export default function Wizard({
	config,
	initialAnswers,
	successPath,
	onComplete,
	onSubmit,
	onChange,
	onStepChange,
	customValidators = {},
	className,
}: WizardProps) {
	const normalizedConfig = useMemo(() => normalizeWizardConfig(config), [config])
	const theme = useMemo(() => mergeTheme(normalizedConfig.theme), [normalizedConfig.theme])
	const wizardStorageKey = useMemo(
		() => getWizardStorageKey(normalizedConfig.id),
		[normalizedConfig.id]
	)
	const storedDraft = useMemo(() => readWizardDraft(wizardStorageKey), [wizardStorageKey])
	const [answers, setAnswers] = useState<WizardAnswerMap>(() =>
		mergeInitialAnswersWithDraft(normalizedConfig, initialAnswers, storedDraft?.answers)
	)
	const [currentIndex, setCurrentIndex] = useState(() => {
		const mergedAnswers = mergeInitialAnswersWithDraft(
			normalizedConfig,
			initialAnswers,
			storedDraft?.answers
		)
		const visibleSlides = getVisibleSlides(normalizedConfig.slides, mergedAnswers)
		const storedSlideId = storedDraft?.currentSlideId

		if (storedSlideId) {
			const visibleIndex = visibleSlides.findIndex(slide => slide.id === storedSlideId)
			if (visibleIndex >= 0) return visibleIndex
		}

		return Math.max(getFirstVisibleSlideIndex(normalizedConfig, mergedAnswers), 0)
	})
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [screen, setScreen] = useState<"wizard" | "review" | "submitting" | "error">(() =>
		storedDraft?.screen === "review" ? "review" : "wizard"
	)
	const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
		() => storedDraft?.selectedQuestionId ?? null
	)
	const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
		() => storedDraft?.selectedQuestionId ?? null
	)
	const [reviewReturnIndex, setReviewReturnIndex] = useState(() =>
		Math.max(getFirstVisibleSlideIndex(normalizedConfig, answers), 0)
	)
	const [submitError, setSubmitError] = useState<string | null>(null)
	const containerRef = useRef<HTMLDivElement | null>(null)
	const headerRef = useRef<HTMLElement | null>(null)
	const footerRef = useRef<HTMLElement | null>(null)
	const contentRef = useRef<HTMLDivElement | null>(null)
	const mainRef = useRef<HTMLElement | null>(null)
	const [isScrolled, setIsScrolled] = useState(false)

	const visibleSlides = useMemo(
		() => getVisibleSlides(normalizedConfig.slides, answers),
		[normalizedConfig.slides, answers]
	)
	const currentSlide = visibleSlides[currentIndex] ?? visibleSlides[0]
	const visibleQuestions = useMemo(
		() => (currentSlide ? getVisibleQuestions(currentSlide, answers) : []),
		[currentSlide, answers]
	)
	const allSlides = normalizedConfig.slides
	const currentStepErrors = useMemo(
		() => (currentSlide ? getStepErrors(currentSlide, answers, customValidators) : {}),
		[currentSlide, answers, customValidators]
	)
	const canAdvance = Object.keys(currentStepErrors).length === 0

	useEffect(() => {
		const nextAnswers = mergeInitialAnswersWithDraft(
			normalizedConfig,
			initialAnswers,
			storedDraft?.answers
		)
		setAnswers(nextAnswers)
		setErrors({})
		setScreen(storedDraft?.screen === "review" ? "review" : "wizard")
		setSelectedQuestionId(storedDraft?.selectedQuestionId ?? null)
		setEditingQuestionId(storedDraft?.selectedQuestionId ?? null)
		setSubmitError(null)
		const visibleSlides = getVisibleSlides(normalizedConfig.slides, nextAnswers)
		const storedSlideId = storedDraft?.currentSlideId
		const storedSlideIndex =
			storedSlideId != null
				? visibleSlides.findIndex(slide => slide.id === storedSlideId)
				: -1

		setCurrentIndex(
			storedSlideIndex >= 0
				? storedSlideIndex
				: Math.max(getFirstVisibleSlideIndex(normalizedConfig, nextAnswers), 0)
		)
		setReviewReturnIndex(Math.max(getFirstVisibleSlideIndex(normalizedConfig, nextAnswers), 0))
	}, [normalizedConfig, initialAnswers, storedDraft])

	useEffect(() => {
		if (!visibleSlides.length) return

		const visibleIndex = visibleSlides.findIndex(slide => slide.id === currentSlide?.id)
		if (visibleIndex === -1) {
			setCurrentIndex(0)
			return
		}

		if (visibleIndex !== currentIndex) {
			setCurrentIndex(visibleIndex)
		}
	}, [currentIndex, currentSlide?.id, visibleSlides])

	useEffect(() => {
		onChange?.(answers)
	}, [answers, onChange])

	useEffect(() => {
		if (currentSlide) {
			onStepChange?.(currentSlide, currentIndex)
		}
	}, [currentIndex, currentSlide, onStepChange])

	useEffect(() => {
		if (!currentSlide) return
		if (screen === "submitting") return

		saveWizardDraft(wizardStorageKey, {
			answers,
			currentSlideId: currentSlide.id,
			screen: screen === "review" ? "review" : "wizard",
			selectedQuestionId,
		})
	}, [answers, currentSlide?.id, screen, selectedQuestionId, wizardStorageKey])

	useEffect(() => {
		if (screen !== "wizard" || !selectedQuestionId) return

		const target = containerRef.current?.querySelector<HTMLElement>(
			`[data-question-id="${selectedQuestionId}"]`
		)
		if (!target) return

		const frame = requestAnimationFrame(() => {
			target.scrollIntoView({ behavior: "smooth", block: "center" })
			const focusable = target.querySelector<HTMLElement>(
				"input, textarea, select, button, [contenteditable='true']"
			)
			focusable?.focus?.()
		})

		return () => window.cancelAnimationFrame(frame)
	}, [currentSlide?.id, screen, selectedQuestionId])

	useEffect(() => {
		const scroller = mainRef.current
		if (!scroller) return

		const updateScrollState = () => {
			setIsScrolled(scroller.scrollTop > 8)
		}

		updateScrollState()
		scroller.addEventListener("scroll", updateScrollState, { passive: true })

		return () => scroller.removeEventListener("scroll", updateScrollState)
	}, [])

	const updateAnswer = (questionId: string, value: FieldValue) => {
		setAnswers(prev => ({ ...prev, [questionId]: value }))
		setErrors(prev => {
			const next = { ...prev }
			delete next[questionId]
			return next
		})
	}

	const validateCurrentSlide = (slide: WizardSlide) =>
		getStepErrors(slide, answers, customValidators)

	const focusFirstError = (errorMap: Record<string, string>) => {
		const firstId = Object.keys(errorMap)[0]
		if (!firstId || !containerRef.current) return

		const selector = [
			`[data-question-id="${firstId}"] input`,
			`[data-question-id="${firstId}"] textarea`,
			`[data-question-id="${firstId}"] select`,
			`[data-question-id="${firstId}"] [contenteditable="true"]`,
			`[data-question-id="${firstId}"] button`,
		].join(", ")
		const target = containerRef.current.querySelector<HTMLElement>(selector)
		target?.focus?.()
		target?.scrollIntoView({ behavior: "smooth", block: "center" })
	}

	const buildWizardSubmission = () => {
		const visibleAnswers = Object.fromEntries(
			Object.entries(answers)
				.filter(([, value]) => value !== undefined)
				.map(([key, value]) => [key, serializeAnswerForSubmission(value)])
		)

		return {
			form: "wizard-brief",
			submitted_at: new Date().toISOString(),
			current_slide: currentSlide?.id ?? null,
			answers: visibleAnswers,
		}
	}

	const runFinalSubmit = async () => {
		setSubmitError(null)

		const wizardErrors = getWizardErrors(normalizedConfig, answers, customValidators)
		if (Object.keys(wizardErrors).length > 0) {
			const firstErrorId = Object.keys(wizardErrors)[0]
			const slideIndex = visibleSlides.findIndex(slide =>
				slide.questions.some(question => question.id === firstErrorId)
			)
			setCurrentIndex(Math.max(slideIndex, 0))
			setSelectedQuestionId(firstErrorId ?? null)
			setEditingQuestionId(firstErrorId ?? null)
			setScreen("wizard")
			setSubmitError("Hay campos pendientes por completar antes de enviar.")
			return
		}

		setScreen("submitting")

		try {
			const endpoint = getFormspreeWizardEndpoint()
			if (!endpoint) {
				throw new Error("Falta configurar FORMSPREE_WIZARD_ID.")
			}

			const response = await fetch(endpoint, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify(buildWizardSubmission()),
			})

			if (!response.ok) {
				throw new Error("No se pudo enviar el brief.")
			}

			clearWizardDraft(wizardStorageKey)
			markWizardSubmitted(normalizedConfig.id)
			await Promise.resolve(onSubmit?.(answers) ?? onComplete?.(answers))
			if (successPath) {
				window.location.assign(successPath)
				return
			}
			setScreen("review")
		} catch (error) {
			setSubmitError(
				error instanceof Error ? error.message : "Ocurrió un error al enviar el brief."
			)
			setScreen("error")
			return
		}
	}

	const handleNext = () => {
		if (!currentSlide) return

		const slideErrors = validateCurrentSlide(currentSlide)
		if (Object.keys(slideErrors).length) {
			setErrors(prev => ({ ...prev, ...slideErrors }))
			requestAnimationFrame(() => focusFirstError(slideErrors))
			return
		}

		if (editingQuestionId) {
			setEditingQuestionId(null)
			setSelectedQuestionId(null)
			setCurrentIndex(reviewReturnIndex)
			setScreen("review")
			return
		}

		if (screen === "wizard" && currentIndex >= visibleSlides.length - 1) {
			setReviewReturnIndex(currentIndex)
			setScreen("review")
			return
		}

		setCurrentIndex(index => Math.min(index + 1, visibleSlides.length - 1))
	}

	const handleBack = () => setCurrentIndex(index => Math.max(index - 1, 0))
	const startEditingQuestion = (questionId: string) => {
		const slideIndex = visibleSlides.findIndex(slide =>
			slide.questions.some(question => question.id === questionId)
		)
		if (slideIndex < 0) return

		setReviewReturnIndex(slideIndex)
		setSelectedQuestionId(questionId)
		setEditingQuestionId(questionId)
		setScreen("wizard")
		setCurrentIndex(slideIndex)
	}

	const resumeReview = () => {
		setScreen("wizard")
		setSelectedQuestionId(null)
		setEditingQuestionId(null)
		setCurrentIndex(Math.max(reviewReturnIndex, 0))
	}

	const summarySlides = visibleSlides
		.map(slide => ({
			slide,
			questions: getVisibleQuestions(slide, answers).filter(
				question =>
					question.type !== "static" &&
					question.type !== "title" &&
					question.type !== "subtitle"
			),
		}))
		.filter(entry => entry.questions.length > 0)

	const renderLoadingScreen = () => (
		<div className={cn(theme.root, className)}>
			<div className={theme.panel}>
				<div className="mx-auto w-full max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
					<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
						<div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-[#FF6719]" />
					</div>
					<h2 className="mt-5 text-3xl font-semibold tracking-tight text-white">
						Estamos enviando tu brief
					</h2>
					<p className="mt-3 text-sm leading-7 text-gray-300 sm:text-base">
						Estamos preparando el envío final. No cierres esta ventana.
					</p>
				</div>
			</div>
		</div>
	)

	const renderErrorScreen = () => (
		<div className={cn(theme.root, className)}>
			<div className={theme.panel}>
				<div className="mx-auto w-full max-w-2xl rounded-[2rem] border border-red-400/20 bg-red-500/10 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
					<p className="text-xs font-semibold uppercase tracking-[0.32em] text-red-200">
						Error al enviar
					</p>
					<h2 className="mt-5 text-3xl font-semibold tracking-tight text-white">
						No se pudo completar el envío
					</h2>
					<p className="mt-3 text-sm leading-7 text-red-50/90 sm:text-base">
						{submitError ?? "Hubo un problema temporal. Puede intentar de nuevo."}
					</p>
					<div className="mt-8 flex flex-col gap-3 sm:flex-row">
						<button
							type="button"
							onClick={() => {
								setSubmitError(null)
								setScreen("review")
							}}
							className={theme.buttonSecondary}
						>
							Volver al resumen
						</button>
						<button
							type="button"
							onClick={() => void runFinalSubmit()}
							className={theme.buttonPrimary}
						>
							Reintentar envío
						</button>
					</div>
				</div>
			</div>
		</div>
	)

	if (!visibleSlides.length) {
		return (
			<div className={cn(theme.root, className)}>
				<div className={theme.panel}>
					<p className="rounded-[2rem] border border-amber-400/30 bg-amber-500/10 p-8 text-center text-amber-100">
						No hay slides visibles para la configuración actual.
					</p>
				</div>
			</div>
		)
	}

	if (screen === "submitting") {
		return renderLoadingScreen()
	}

	if (screen === "error") {
		return renderErrorScreen()
	}

	const currentErrors = Object.fromEntries(
		Object.entries(errors).filter(([key]) =>
			visibleQuestions.some(question => question.id === key)
		)
	)
	const currentVisibleIndex = visibleSlides.findIndex(item => item.id === currentSlide.id)
	const currentOriginalIndex = allSlides.findIndex(item => item.id === currentSlide.id)
	const isReviewMode = screen === "review"

	const getSlideStatus = (slide: WizardSlide): SlideStatus => {
		if (isReviewMode) {
			return isSlideVisible(slide, answers) ? "success" : "blocked"
		}

		const slideOriginalIndex = allSlides.findIndex(item => item.id === slide.id)
		if (!isSlideVisible(slide, answers)) {
			return slideOriginalIndex < currentOriginalIndex ? "blocked" : "pending"
		}
		if (slide.id === currentSlide.id) return "active"

		const slideVisibleIndex = visibleSlides.findIndex(item => item.id === slide.id)

		return slideVisibleIndex < currentVisibleIndex ? "success" : "pending"
	}

	const isWelcomeSlide = currentSlide.id === "welcome"

	const renderWizardView = () => (
		<div ref={containerRef} className={cn(theme.root, className)}>
			<header
				ref={headerRef}
				className={cn(
					"fixed inset-x-0 top-0 z-50 border-b text-white transition-all duration-300",
					isScrolled
						? "border-white/10 bg-neutral-950/80 shadow-[0_8px_24px_rgba(0,0,0,0.28)] backdrop-blur-md"
						: "border-transparent bg-transparent shadow-none backdrop-blur-none"
				)}
			>
				<div className="mx-auto flex h-[88px] w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
					<div className="flex items-center gap-3">
						<img
							src="/logo/logo-icon-white.webp"
							alt="Raymundo Salazar"
							className="h-11 w-11"
						/>
						<div className="leading-none">
							<p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-blue-300">
								Portafolio
							</p>
							<h1 className="text-lg font-semibold tracking-tight sm:text-xl">
								Raymundo Salazar
							</h1>
						</div>
					</div>
				</div>
			</header>

			<main ref={mainRef} className="relative h-screen overflow-y-auto pt-[88px] pb-[112px]">
				<div
					ref={contentRef}
					className="mx-auto flex min-h-[calc(100vh-200px)] w-full items-center justify-center px-4 sm:px-6 lg:px-8"
				>
					<div className="w-full max-w-2xl">
						<StepSlide
							title={currentSlide.title}
							subtitle={currentSlide.subtitle}
							description={currentSlide.description}
							className={currentSlide.className}
							theme={theme}
						>
							{visibleQuestions.map(question => {
								const value = answers[question.id] ?? getDefaultValue(question)
								const error = currentErrors[question.id] ?? null
								const isSelected = selectedQuestionId === question.id

								return (
									<div
										key={question.id}
										data-question-id={question.id}
										className={cn(
											"rounded-[1.75rem] border border-transparent p-1 transition-all duration-300",
											isSelected
												? "border-[#FF671955] bg-[#FF67190f] shadow-[0_0_0_1px_rgba(255,103,25,0.18)]"
												: ""
										)}
									>
										{isSelected ? (
											<p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#FFB38A]">
												Editando esta respuesta
											</p>
										) : null}
										{renderQuestion(
											question,
											value,
											error,
											next => updateAnswer(question.id, next),
											theme
										)}
									</div>
								)
							})}

							{isWelcomeSlide ? (
								<div className="space-y-2 text-sm text-gray-400">
									<div className="flex items-center gap-2">
										<ClockIcon className="h-4 w-4 text-blue-300" />
										<span>Tiempo estimado: 10–15 minutos</span>
									</div>
									<p className="text-xs leading-5 text-gray-500">
										No se perderá tu progreso si cierras la pestaña o decides
										pausar y continuar después.
									</p>
								</div>
							) : null}
						</StepSlide>
					</div>
				</div>
			</main>

			<div
				className="fixed inset-x-0 z-40"
				style={{ bottom: `${FOOTER_HEIGHT}px`, height: `${PROGRESS_HEIGHT}px` }}
			>
				<div className="mx-auto flex h-full w-full max-w-none items-stretch px-0">
					<div
						className="grid h-full w-full gap-x-2 transition-all duration-300 ease-out"
						style={{
							gridTemplateColumns: `repeat(${allSlides.length}, minmax(0, 1fr))`,
						}}
					>
						{allSlides.map(slide => {
							const status = getSlideStatus(slide)
							const barColor =
								status === "active"
									? "bg-blue-500"
									: status === "success"
										? "bg-emerald-500"
										: status === "blocked"
											? "bg-neutral-500/70"
											: "bg-neutral-700/70"
							return (
								<div
									key={slide.id}
									className="relative h-full overflow-visible bg-transparent transition-all duration-300 ease-out"
								>
									<div
										className={cn(
											"relative z-10 w-full transition-all duration-300 ease-out",
											barColor,
											status === "active"
												? "absolute inset-x-0 bottom-0 h-[12px] shadow-[inset_0_0_0_1px_rgba(96,165,250,0.45)]"
												: "h-full"
										)}
									/>
								</div>
							)
						})}
					</div>
				</div>
			</div>

			<footer
				ref={footerRef}
				className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-neutral-950/75 text-white shadow-[0_-8px_24px_rgba(0,0,0,0.22)] backdrop-blur-md"
			>
				<div className="mx-auto grid h-[88px] w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-6 lg:px-8">
					<div className="min-w-0">
						{screen === "review" ? (
							<button
								type="button"
								onClick={resumeReview}
								className={theme.buttonSecondary}
							>
								<FiArrowLeft className="h-4 w-4" />
								Seguir editando
							</button>
						) : currentIndex === 0 ? null : (
							<button
								type="button"
								onClick={handleBack}
								className={theme.buttonSecondary}
							>
								<FiArrowLeft className="h-4 w-4" />
								{normalizedConfig.buttons?.previous ?? "Regresar"}
							</button>
						)}
					</div>

					<button
						type="button"
						onClick={handleNext}
						disabled={screen === "submitting" || !canAdvance}
						className={theme.buttonPrimary}
					>
						{screen === "review"
							? "Enviar brief"
							: editingQuestionId
								? "Volver al resumen"
								: currentIndex >= visibleSlides.length - 1
									? (normalizedConfig.buttons?.finish ?? "Enviar brief")
									: currentSlide.id === "welcome"
										? "Comenzar"
										: (normalizedConfig.buttons?.next ?? "Continuar")}
						<FiArrowRight className="h-4 w-4" />
					</button>
				</div>
			</footer>
		</div>
	)

	const renderReviewView = () => (
		<div ref={containerRef} className={cn(theme.root, className)}>
			<header
				ref={headerRef}
				className={cn(
					"fixed inset-x-0 top-0 z-50 border-b text-white transition-all duration-300",
					isScrolled
						? "border-white/10 bg-neutral-950/80 shadow-[0_8px_24px_rgba(0,0,0,0.28)] backdrop-blur-md"
						: "border-transparent bg-transparent shadow-none backdrop-blur-none"
				)}
			>
				<div className="mx-auto flex h-[88px] w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
					<div className="flex items-center gap-3">
						<img
							src="/logo/logo-icon-white.webp"
							alt="Raymundo Salazar"
							className="h-11 w-11"
						/>
						<div className="leading-none">
							<p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-[#FFB38A]">
								Revisión final
							</p>
							<h1 className="text-lg font-semibold tracking-tight sm:text-xl">
								Raymundo Salazar
							</h1>
						</div>
					</div>
				</div>
			</header>

			<main ref={mainRef} className="relative h-screen overflow-y-auto pt-[88px] pb-[112px]">
				<div
					ref={contentRef}
					className="mx-auto flex min-h-[calc(100vh-200px)] w-full items-center justify-center px-4 py-8 sm:px-6 lg:px-8"
				>
					<div className="w-full max-w-4xl space-y-6">
						<div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
							<p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#FFB38A]">
								Resumen antes de enviar
							</p>
							<h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
								Revise sus respuestas antes de continuar
							</h2>
							<p className="mt-3 max-w-3xl text-sm leading-7 text-gray-300 sm:text-base">
								Si algo no está como quería, puede editar una respuesta específica y
								volver aquí sin recorrer todo el wizard otra vez.
							</p>
						</div>

						<div className="grid gap-4">
							{summarySlides.map(({ slide, questions }) => (
								<section
									key={slide.id}
									className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 backdrop-blur-md"
								>
									<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
										<div>
											{slide.subtitle ? (
												<p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#FFB38A]">
													{slide.subtitle}
												</p>
											) : null}
											<h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
												{slide.title ?? slide.id}
											</h3>
											{slide.description ? (
												<p className="mt-2 max-w-3xl text-sm leading-7 text-gray-300">
													{slide.description}
												</p>
											) : null}
										</div>
										<p className="text-xs uppercase tracking-[0.24em] text-white/40">
											{questions.length} preguntas
										</p>
									</div>

									<div className="mt-5 grid gap-3">
										{questions.map(question => {
											const value = answers[question.id]
											const valueText = getFieldValueText(value)
											const isEmpty = valueText.trim().length === 0

											return (
												<div
													key={question.id}
													className={cn(
														"rounded-2xl border p-4 transition-all",
														isEmpty
															? "border-amber-400/20 bg-amber-500/5"
															: "border-white/10 bg-neutral-950/40"
													)}
												>
													<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
														<div className="min-w-0">
															<p className="text-sm font-medium text-white">
																{question.label}
															</p>
															<p className="mt-2 text-sm leading-7 text-gray-300">
																{isEmpty
																	? "Sin respuesta"
																	: valueText}
															</p>
														</div>
														<button
															type="button"
															onClick={() =>
																startEditingQuestion(question.id)
															}
															className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#FF671933] bg-[#FF67190f] px-4 py-2 text-sm font-semibold text-[#FFB38A] transition hover:border-[#FF671955] hover:bg-[#FF67191a]"
														>
															Editar
															<FiArrowRight className="h-4 w-4" />
														</button>
													</div>
												</div>
											)
										})}
									</div>
								</section>
							))}
						</div>
					</div>
				</div>
			</main>

			<footer
				ref={footerRef}
				className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-neutral-950/75 text-white shadow-[0_-8px_24px_rgba(0,0,0,0.22)] backdrop-blur-md"
			>
				<div className="mx-auto grid h-[88px] w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-6 lg:px-8">
					<div className="min-w-0">
						<button
							type="button"
							onClick={resumeReview}
							className={theme.buttonSecondary}
						>
							<FiArrowLeft className="h-4 w-4" />
							Seguir editando
						</button>
					</div>
					<button
						type="button"
						onClick={() => void runFinalSubmit()}
						className={theme.buttonPrimary}
					>
						Enviar brief
						<FiArrowRight className="h-4 w-4" />
					</button>
				</div>
			</footer>
		</div>
	)

	return isReviewMode ? renderReviewView() : renderWizardView()
}
