import { useEffect, useMemo, useRef, useState } from "react"

import FieldShell from "./FieldShell"
import { cn, getFileCount } from "@/lib/brief-wizard/evaluate"
import type { WizardFileQuestion } from "@/lib/brief-wizard/types"

type Props = {
	question: WizardFileQuestion
	value: File[] | FileList | undefined
	error?: string | null
	onChange: (value: File[]) => void
	theme?: Record<string, string | undefined>
}

const toFileArray = (value: File[] | FileList | undefined) =>
	value instanceof FileList ? Array.from(value) : Array.isArray(value) ? value : []

export default function FileField({ question, value, error, onChange, theme }: Props) {
	const inputRef = useRef<HTMLInputElement | null>(null)
	const [isDragging, setIsDragging] = useState(false)
	const [previewUrls, setPreviewUrls] = useState<string[]>([])

	const files = useMemo(() => toFileArray(value), [value])
	const accept = question.accept?.join(", ")
	const canMultiple = Boolean(question.multiple)

	useEffect(() => {
		const urls = files.map(file => URL.createObjectURL(file))
		setPreviewUrls(urls)
		return () => {
			urls.forEach(url => URL.revokeObjectURL(url))
		}
	}, [files])

	const openPicker = () => inputRef.current?.click()

	return (
		<FieldShell
			label={question.label}
			helperText={question.helperText}
			error={error}
			required={question.required}
			iconLeft={question.iconLeft}
			iconRight={question.iconRight}
			className={question.className}
			labelClassName={question.labelClassName}
			helperClassName={question.helperClassName}
			errorClassName={question.errorClassName}
			theme={theme}
		>
			<div
				className={cn(
					"rounded-2xl border border-dashed border-white/15 bg-white/5 p-5 transition-all",
					isDragging ? "border-blue-400 bg-blue-500/10" : "",
					error ? "border-red-400/60" : ""
				)}
				onDragEnter={event => {
					event.preventDefault()
					setIsDragging(true)
				}}
				onDragOver={event => {
					event.preventDefault()
					setIsDragging(true)
				}}
				onDragLeave={event => {
					event.preventDefault()
					setIsDragging(false)
				}}
				onDrop={event => {
					event.preventDefault()
					setIsDragging(false)
					const dropped = Array.from(event.dataTransfer.files ?? [])
					onChange(canMultiple ? dropped : dropped.slice(0, 1))
				}}
			>
				<input
					ref={inputRef}
					type="file"
					accept={accept}
					multiple={canMultiple}
					className="hidden"
					onChange={event => {
						const selected = Array.from(event.target.files ?? [])
						onChange(canMultiple ? selected : selected.slice(0, 1))
					}}
				/>

				<button
					type="button"
					onClick={openPicker}
					className={cn(
						"flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-neutral-900/60 px-4 py-8 text-center text-gray-300 transition-all hover:border-blue-400/40 hover:bg-white/10",
						theme?.buttonGhost
					)}
				>
					<span className="text-sm uppercase tracking-[0.22em] text-blue-300">
						{question.type === "image" ? "Imagen" : "Archivos"}
					</span>
					<span className="text-base font-medium text-white">
						Arrastra y suelta o haz clic para seleccionar
					</span>
					<span className="text-sm text-gray-400">
						{question.multiple ? "Puedes cargar varios archivos." : "Solo un archivo."}
						{question.accept
							? ` Formatos permitidos: ${question.accept.join(", ")}`
							: ""}
					</span>
				</button>

				<div className="mt-4 space-y-3">
					{files.length ? (
						files.map((file, index) => (
							<div
								key={`${file.name}-${index}`}
								className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200"
							>
								<div className="min-w-0">
									<p className="truncate font-medium text-white">{file.name}</p>
									<p className="text-xs text-gray-400">
										{(file.size / (1024 * 1024)).toFixed(2)} MB
									</p>
								</div>
								<button
									type="button"
									onClick={() => {
										const next = files.filter(
											(_, fileIndex) => fileIndex !== index
										)
										onChange(next)
									}}
									className="rounded-full px-3 py-1 text-xs font-medium text-blue-200 transition hover:bg-blue-500/10 hover:text-white"
								>
									Eliminar
								</button>
							</div>
						))
					) : (
						<p className="text-sm text-gray-400">
							Aún no hay archivos cargados.{" "}
							{question.maxFiles ? `Máximo permitido: ${question.maxFiles}.` : ""}
							{question.maxSizeMb
								? ` Tamaño máximo por archivo: ${question.maxSizeMb} MB.`
								: ""}
						</p>
					)}
				</div>

				{question.type === "image" ? (
					<div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{files.map((file, index) => (
							<figure
								key={`preview-${file.name}-${index}`}
								className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/70"
							>
								<img
									src={previewUrls[index] ?? ""}
									alt={file.name}
									className="h-36 w-full object-cover"
								/>
							</figure>
						))}
					</div>
				) : null}

				<p className="mt-4 text-xs text-gray-500">Seleccionados: {getFileCount(files)}</p>
			</div>
		</FieldShell>
	)
}
