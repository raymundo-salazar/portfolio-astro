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
	getVisibleQuestions,
	getVisibleSlides,
	getWizardProgress,
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
import { FiArrowLeft, FiArrowRight, FiCheckCircle, FiStar } from "react-icons/fi"

import StepSlide from "./StepSlide"

type Props = {
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
	root: "min-h-screen w-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_36%),linear-gradient(135deg,_#09090b_0%,_#111827_50%,_#09090b_100%)] text-white",
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

const isFilesValue = (value: FieldValue): value is File[] | FileList =>
	Array.isArray(value) || value instanceof FileList

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
}: Props) {
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

	const visibleSlides = useMemo(
		() => getVisibleSlides(normalizedConfig.slides, answers),
		[normalizedConfig.slides, answers]
	)
	const currentSlide = visibleSlides[currentIndex] ?? visibleSlides[0]
	const visibleQuestions = useMemo(
		() => (currentSlide ? getVisibleQuestions(currentSlide, answers) : []),
		[currentSlide, answers]
	)
	const progress = useMemo(
		() => getWizardProgress(normalizedConfig, currentIndex, answers),
		[normalizedConfig, currentIndex, answers]
	)

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

	return (
		<div ref={containerRef} className={cn(theme.root, className)}>
			<div className={theme.panel}>
				<div className={theme.hero}>
					<p className={theme.heroEyebrow}>
						{normalizedConfig.eyebrow ?? "Brief interactivo"}
					</p>
					<div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
						<div className="space-y-2">
							<h1 className={theme.heroTitle}>{normalizedConfig.title}</h1>
							{normalizedConfig.subtitle ? (
								<p className={theme.heroText}>{normalizedConfig.subtitle}</p>
							) : null}
							{normalizedConfig.description ? (
								<p className={theme.heroText}>{normalizedConfig.description}</p>
							) : null}
						</div>
						<div className={theme.stepCounter}>
							{normalizedConfig.counterLabel ?? "Paso"} {progress.currentIndex + 1}/
							{progress.total}
						</div>
					</div>

					<div className="space-y-2">
						<div
							className={cn("flex items-center justify-between", theme.progressLabel)}
						>
							<span>{normalizedConfig.progressLabel ?? "Progreso del brief"}</span>
							<span>{Math.round(progress.percentage)}%</span>
						</div>
						<div className={theme.progressTrack}>
							<div
								className={theme.progressFill}
								style={{ width: `${progress.percentage}%` }}
							/>
						</div>
					</div>
				</div>

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

					<div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
						<button
							type="button"
							onClick={handleBack}
							disabled={currentIndex === 0}
							className={theme.buttonSecondary}
						>
							<FiArrowLeft className="h-4 w-4" />
							{normalizedConfig.buttons?.previous ?? "Volver"}
						</button>

						<div className="flex items-center gap-3">
							<span className="hidden text-sm text-gray-400 sm:inline">
								{visibleQuestions.length} preguntas visibles
							</span>

							<button
								type="button"
								onClick={handleNext}
								className={theme.buttonPrimary}
							>
								{currentIndex >= visibleSlides.length - 1
									? (normalizedConfig.buttons?.finish ?? "Enviar brief")
									: (normalizedConfig.buttons?.next ?? "Avanzar")}
								<FiArrowRight className="h-4 w-4" />
							</button>
						</div>
					</div>
				</StepSlide>

				<div className="mt-4 rounded-[1.75rem] border border-white/10 bg-white/5 px-5 py-4 text-sm text-gray-300 backdrop-blur-xl">
					<div className="flex items-center gap-2 text-blue-300">
						<FiStar className="h-4 w-4" />
						<span className="font-medium">Vista previa de datos</span>
					</div>
					<p className="mt-2 text-gray-400">
						El wizard responde al JSON de configuración, evalúa visibilidad y valida
						cada paso antes de avanzar.
					</p>
				</div>
			</div>
		</div>
	)
}
