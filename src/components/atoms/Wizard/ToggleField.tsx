import FieldShell from "./FieldShell"
import { cn } from "@/lib/brief-wizard/evaluate"
import type { WizardCheckboxQuestion } from "@/lib/brief-wizard/types"

type Props = {
	question: WizardCheckboxQuestion
	value: boolean | undefined
	error?: string | null
	onChange: (value: boolean) => void
	theme?: Record<string, string | undefined>
}

export default function ToggleField({ question, value, error, onChange, theme }: Props) {
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
			<label
				className={cn(
					"flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-200 transition-all hover:border-blue-400/40 hover:bg-white/10",
					value ? "border-blue-400/70 bg-blue-500/10 text-white" : "",
					theme?.checkbox
				)}
			>
				<input
					type="checkbox"
					checked={Boolean(value)}
					onChange={event => onChange(event.target.checked)}
					className="h-4 w-4 rounded border-white/20 bg-transparent text-blue-500 focus:ring-blue-500"
				/>
				<span className="font-medium text-white">{question.helperText ?? "Confirmar"}</span>
			</label>
		</FieldShell>
	)
}
