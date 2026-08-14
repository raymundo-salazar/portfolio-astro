import type { ChangeEvent } from "react"

import FieldShell from "./FieldShell"
import { cn } from "@/lib/brief-wizard/evaluate"
import type { WizardTextareaQuestion } from "@/lib/brief-wizard/types"

type Props = {
	question: WizardTextareaQuestion
	value: string | undefined
	error?: string | null
	onChange: (value: string) => void
	theme?: Record<string, string | undefined>
}

export default function TextareaField({ question, value, error, onChange, theme }: Props) {
	return (
		<FieldShell
			label={question.label}
			helperText={question.helperText}
			error={error}
			required={typeof question.required === "boolean" ? question.required : false}
			iconLeft={question.iconLeft}
			iconRight={question.iconRight}
			className={question.className}
			labelClassName={question.labelClassName}
			helperClassName={question.helperClassName}
			errorClassName={question.errorClassName}
			theme={theme}
		>
			<textarea
				value={value ?? ""}
				placeholder={question.placeholder}
				rows={question.rows ?? 5}
				onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value)}
				className={cn(
					"w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none transition-all placeholder:text-gray-500 focus:border-blue-400 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/20",
					theme?.textarea,
					question.inputClassName,
					error ? "border-red-400/60 focus:border-red-300 focus:ring-red-500/20" : ""
				)}
			/>
		</FieldShell>
	)
}
