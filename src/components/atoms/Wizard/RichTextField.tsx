import { useEffect, useRef } from "react"

import FieldShell from "./FieldShell"
import { cn, getFieldValueText } from "@/lib/brief-wizard/evaluate"
import type { WizardRichTextQuestion } from "@/lib/brief-wizard/types"

type Props = {
	question: WizardRichTextQuestion
	value: { html: string; text: string } | string | undefined
	error?: string | null
	onChange: (value: { html: string; text: string }) => void
	theme?: Record<string, string | undefined>
}

const formatText = (element: HTMLDivElement) => ({
	html: element.innerHTML,
	text: element.textContent?.trim() ?? "",
})

export default function RichTextField({ question, value, error, onChange, theme }: Props) {
	const editorRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		if (!editorRef.current) return
		const next = typeof value === "string" ? value : (value?.html ?? "")
		if (editorRef.current.innerHTML !== next) editorRef.current.innerHTML = next
	}, [value])

	const applyFormat = (command: "bold" | "italic" | "underline") => {
		document.execCommand(command, false)
		editorRef.current?.focus()
		if (editorRef.current) onChange(formatText(editorRef.current))
	}

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
			<div className="space-y-3">
				<div
					className={cn(
						"flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/5 p-2",
						theme?.toolbar
					)}
				>
					{[
						{ label: "B", command: "bold" as const },
						{ label: "I", command: "italic" as const },
						{ label: "U", command: "underline" as const },
					].map(action => (
						<button
							key={action.command}
							type="button"
							onClick={() => applyFormat(action.command)}
							className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition hover:border-blue-400/50 hover:bg-blue-500/10"
						>
							{action.label}
						</button>
					))}
				</div>

				<div
					ref={editorRef}
					contentEditable
					suppressContentEditableWarning
					role="textbox"
					aria-multiline="true"
					aria-label={question.label ?? "Rich text input"}
					onInput={event => {
						const current = event.currentTarget as HTMLDivElement
						onChange(formatText(current))
					}}
					data-placeholder={question.placeholder ?? "Escribe con formato"}
					className={cn(
						"min-h-40 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none transition-all placeholder:text-gray-500 focus:border-blue-400 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/20 empty:before:pointer-events-none empty:before:block empty:before:text-gray-500 empty:before:content-[attr(data-placeholder)]",
						theme?.input,
						error ? "border-red-400/60 focus:border-red-300 focus:ring-red-500/20" : ""
					)}
				/>

				<p className="text-xs text-gray-500">Valor actual: {getFieldValueText(value)}</p>
			</div>
		</FieldShell>
	)
}
