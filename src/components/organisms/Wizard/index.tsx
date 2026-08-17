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
	isSlideVisible,
	getVisibleQuestions,
	getVisibleSlides,
	normalizeWizardConfig,
} from "@/lib/brief-wizard/evaluate"
import type {
	FieldValue,
	WizardAnswerMap,
	WizardConfig,
	WizardCustomValidator,
	WizardQuestion,
	WizardSlide,
} from "@/lib/brief-wizard/types"
import { FiArrowLeft, FiArrowRight, FiCheckCircle } from "react-icons/fi"

import StepSlide from "./StepSlide"

export type WizardProps = {
	config: WizardConfig
	initialAnswers?: WizardAnswerMap
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
		"inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40",
	buttonSecondary:
		"inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40",
	buttonGhost:
		"inline-flex items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-gray-200 transition hover:border-blue-400/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40",
	successShell: "rounded-[2rem] border border-emerald-400/30 bg-emerald-500/10 p-8 text-center",
}

const mergeTheme = (theme?: WizardConfig["theme"]) => ({ ...themeFallback, ...theme })
const FOOTER_HEIGHT = 88
const PROGRESS_HEIGHT = 24

type SlideStatus = "active" | "success" | "pending" | "blocked"

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
					value={typeof value === "string" || Array.isArray(value) ? value : undefined}
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
	onComplete,
	onSubmit,
	onChange,
	onStepChange,
	customValidators = {},
	className,
}: WizardProps) {
	const normalizedConfig = useMemo(() => normalizeWizardConfig(config), [config])
	const theme = useMemo(() => mergeTheme(normalizedConfig.theme), [normalizedConfig.theme])
	const [answers, setAnswers] = useState<WizardAnswerMap>(() =>
		createInitialAnswers(normalizedConfig, initialAnswers)
	)
	const [currentIndex, setCurrentIndex] = useState(() =>
		Math.max(
			getFirstVisibleSlideIndex(
				normalizedConfig,
				createInitialAnswers(normalizedConfig, initialAnswers)
			),
			0
		)
	)
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [completed, setCompleted] = useState(false)
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

	useEffect(() => {
		const nextAnswers = createInitialAnswers(normalizedConfig, initialAnswers)
		setAnswers(nextAnswers)
		setErrors({})
		setCompleted(false)
		setCurrentIndex(Math.max(getFirstVisibleSlideIndex(normalizedConfig, nextAnswers), 0))
	}, [normalizedConfig, initialAnswers])

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

	const runFinalSubmit = async () => {
		setCompleted(true)
		await Promise.resolve(onSubmit?.(answers) ?? onComplete?.(answers))
	}

	const handleNext = () => {
		if (!currentSlide) return

		const slideErrors = validateCurrentSlide(currentSlide)
		if (Object.keys(slideErrors).length) {
			setErrors(prev => ({ ...prev, ...slideErrors }))
			requestAnimationFrame(() => focusFirstError(slideErrors))
			return
		}

		if (currentIndex >= visibleSlides.length - 1) {
			void runFinalSubmit()
			return
		}

		setCurrentIndex(index => Math.min(index + 1, visibleSlides.length - 1))
	}

	const handleBack = () => setCurrentIndex(index => Math.max(index - 1, 0))

	if (completed) {
		return (
			<div className={cn(theme.root, className)}>
				<div className={theme.panel}>
					<div className={theme.successShell}>
						<FiCheckCircle className="mx-auto mb-4 h-12 w-12 text-emerald-300" />
						<h2 className="text-3xl font-semibold text-white">
							{normalizedConfig.title}
						</h2>
						<p className="mt-3 text-base text-emerald-100/90">
							Gracias. El brief quedó completo y listo para enviarse.
						</p>
						<div className="mt-6 grid gap-3 text-left sm:grid-cols-2">
							{Object.entries(answers).map(([key, value]) => (
								<div
									key={key}
									className="rounded-2xl border border-white/10 bg-neutral-950/40 p-4"
								>
									<p className="text-xs uppercase tracking-[0.24em] text-emerald-200">
										{key}
									</p>
									<p className="mt-2 text-sm text-white">
										{getFieldValueText(value)}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		)
	}

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

	const currentErrors = Object.fromEntries(
		Object.entries(errors).filter(([key]) =>
			visibleQuestions.some(question => question.id === key)
		)
	)
	const currentVisibleIndex = visibleSlides.findIndex(item => item.id === currentSlide.id)
	const currentOriginalIndex = allSlides.findIndex(item => item.id === currentSlide.id)

	const getSlideStatus = (slide: WizardSlide): SlideStatus => {
		const slideOriginalIndex = allSlides.findIndex(item => item.id === slide.id)
		if (!isSlideVisible(slide, answers)) {
			return slideOriginalIndex < currentOriginalIndex ? "blocked" : "pending"
		}
		if (slide.id === currentSlide.id) return "active"

		const slideVisibleIndex = visibleSlides.findIndex(item => item.id === slide.id)

		return slideVisibleIndex < currentVisibleIndex ? "success" : "pending"
	}

	return (
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

								return (
									<div key={question.id} data-question-id={question.id}>
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
						className="grid h-full w-full gap-0"
						style={{
							gridTemplateColumns: `repeat(${allSlides.length}, minmax(0, 1fr))`,
						}}
					>
						{allSlides.map(slide => {
							const status = getSlideStatus(slide)
							const isActive = status === "active"
							return (
								<div
									key={slide.id}
									className={cn(
										"relative h-full overflow-visible",
										status === "active"
											? "bg-blue-500 shadow-[inset_0_0_0_1px_rgba(96,165,250,0.45)]"
											: status === "success"
												? "bg-emerald-500"
												: status === "blocked"
													? "bg-neutral-500/70"
													: "bg-neutral-700/70",
										"first:rounded-l-full last:rounded-r-full"
									)}
								>
									{isActive ? (
										<div className="pointer-events-none absolute inset-[-5px] rounded-full border border-blue-300/80 shadow-[0_0_0_1px_rgba(96,165,250,0.55),0_0_16px_rgba(59,130,246,0.6)] animate-pulse" />
									) : null}
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
				<div className="mx-auto flex h-[88px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
					<button
						type="button"
						onClick={handleBack}
						disabled={currentIndex === 0}
						className={theme.buttonSecondary}
					>
						<FiArrowLeft className="h-4 w-4" />
						{normalizedConfig.buttons?.previous ?? "Regresar"}
					</button>

					<button type="button" onClick={handleNext} className={theme.buttonPrimary}>
						{currentIndex >= visibleSlides.length - 1
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
}
