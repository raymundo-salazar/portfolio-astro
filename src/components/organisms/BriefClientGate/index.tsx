import { useEffect, useMemo, useState } from "react"
import { FiArrowRight, FiCheckCircle, FiClock } from "react-icons/fi"

import Wizard from "@/components/organisms/Wizard/index"
import { hasWizardBeenSubmitted } from "@/lib/brief-wizard/storage"
import type { WizardAnswerMap, WizardConfig } from "@/lib/brief-wizard/types"
import { cn } from "@/lib/brief-wizard/evaluate"

type BriefClientGateProps = {
	config: WizardConfig
	clientPath: string
	successPath: string
	mode: "wizard" | "success"
	initialAnswers?: WizardAnswerMap
}

const LoadingShell = ({ title, copy }: { title: string; copy: string }) => (
	<div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.18),_transparent_36%),linear-gradient(135deg,_#09090b_0%,_#111827_54%,_#09090b_100%)] text-white">
		<div className="absolute left-[-8rem] top-[-6rem] h-64 w-64 rounded-full bg-[#FF671926] blur-3xl" />
		<div className="absolute bottom-[-5rem] right-[-4rem] h-72 w-72 rounded-full bg-[#38bdf826] blur-3xl" />
		<div className="relative mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
			<div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
				<div className="flex items-center gap-3 text-[#FFB38A]">
					<FiClock className="h-5 w-5" />
					<p className="text-xs font-semibold uppercase tracking-[0.32em]">
						Preparando formulario
					</p>
				</div>
				<h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
					{title}
				</h1>
				<p className="mt-4 max-w-2xl text-sm leading-7 text-[#E5E7EB] sm:text-base">
					{copy}
				</p>
				<div className="mt-8 space-y-4">
					<div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
						<div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#FF6719] via-[#FF8A4A] to-[#FDBA74] animate-pulse" />
					</div>
					<p className="text-xs uppercase tracking-[0.24em] text-white/45">
						Si este proceso tarda un momento, es sólo para cargar tu versión.
					</p>
				</div>
			</div>
		</div>
	</div>
)

const SuccessScreen = ({
	title,
	copy,
	clientPath,
}: {
	title: string
	copy: string
	clientPath: string
}) => (
	<div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.18),_transparent_36%),linear-gradient(135deg,_#09090b_0%,_#111827_54%,_#09090b_100%)] text-white">
		<div className="absolute left-[-8rem] top-[-6rem] h-64 w-64 rounded-full bg-[#FF671926] blur-3xl" />
		<div className="absolute bottom-[-5rem] right-[-4rem] h-72 w-72 rounded-full bg-[#22c55e26] blur-3xl" />
		<div className="relative mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
			<div className="w-full max-w-2xl rounded-[2rem] border border-emerald-400/20 bg-emerald-500/10 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
				<div className="flex items-center gap-3 text-emerald-200">
					<FiCheckCircle className="h-5 w-5" />
					<p className="text-xs font-semibold uppercase tracking-[0.32em]">
						Formulario recibido
					</p>
				</div>
				<h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
					{title}
				</h1>
				<p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/90 sm:text-base">
					{copy}
				</p>
				<div className="mt-8 grid gap-3 sm:grid-cols-2">
					<div className="rounded-2xl border border-white/10 bg-white/5 p-4">
						<p className="text-xs uppercase tracking-[0.24em] text-emerald-200/80">
							Estado
						</p>
						<p className="mt-2 text-sm text-white">Listo y guardado</p>
					</div>
					<div className="rounded-2xl border border-white/10 bg-white/5 p-4">
						<p className="text-xs uppercase tracking-[0.24em] text-emerald-200/80">
							Siguiente paso
						</p>
						<p className="mt-2 text-sm text-white">Nosotros seguimos con la revisión</p>
					</div>
				</div>
				<div className="mt-8 flex flex-col gap-3 sm:flex-row">
					<a
						href={clientPath}
						className={cn(
							"inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF6719] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff8240]"
						)}
					>
						Volver al brief
						<FiArrowRight className="h-4 w-4" />
					</a>
					<a
						href="/"
						className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
					>
						Ir al portafolio
					</a>
				</div>
			</div>
		</div>
	</div>
)

export default function BriefClientGate({
	config,
	clientPath,
	successPath,
	mode,
	initialAnswers,
}: BriefClientGateProps) {
	const [status, setStatus] = useState<"loading" | "ready" | "redirecting">("loading")

	useEffect(() => {
		const submitted = hasWizardBeenSubmitted(config.id)

		if (mode === "wizard" && submitted) {
			setStatus("redirecting")
			window.location.replace(successPath)
			return
		}

		if (mode === "success" && !submitted) {
			setStatus("redirecting")
			window.location.replace(clientPath)
			return
		}

		setStatus("ready")
	}, [clientPath, config.id, mode, successPath])

	const loadingCopy = useMemo(() => {
		if (mode === "success") {
			return "Estamos comprobando que tu formulario ya fue enviado para mostrarte la confirmación correcta."
		}

		return "Estamos preparando tu versión personalizada del brief y verificando si ya existe una respuesta guardada."
	}, [mode])

	if (status !== "ready") {
		return (
			<LoadingShell
				title={
					mode === "success"
						? "Estamos confirmando tu envío"
						: "Estamos preparando tu formulario"
				}
				copy={loadingCopy}
			/>
		)
	}

	if (mode === "success") {
		return (
			<SuccessScreen
				title={config.title ?? "Brief enviado"}
				copy={config.description ?? "Tu brief ya quedó registrado."}
				clientPath={clientPath}
			/>
		)
	}

	return <Wizard config={config} initialAnswers={initialAnswers} successPath={successPath} />
}
