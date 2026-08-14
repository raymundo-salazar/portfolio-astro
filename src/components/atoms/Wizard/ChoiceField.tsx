import type { ChangeEvent } from "react"

import FieldShell from "./FieldShell"
import { cn } from "@/lib/brief-wizard/evaluate"
import type { WizardChoiceQuestion } from "@/lib/brief-wizard/types"

type Props = {
	question: WizardChoiceQuestion
	value: string | string[] | undefined
	error?: string | null
	onChange: (value: string | string[]) => void
	theme?: Record<string, string | undefined>
}

export default function ChoiceField({ question, value, error, onChange, theme }: Props) {
	const normalized = Array.isArray(value) ? value : value ? [value] : []

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
			{question.type === "select" ? (
				<select
					value={Array.isArray(value) ? (value[0] ?? "") : (value ?? "")}
					onChange={(event: ChangeEvent<HTMLSelectElement>) =>
						onChange(event.target.value)
					}
					className={cn(
						"w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none transition-all focus:border-blue-400 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/20",
						theme?.select,
						question.inputClassName,
						error ? "border-red-400/60 focus:border-red-300 focus:ring-red-500/20" : ""
					)}
				>
					<option value="" className="bg-neutral-900 text-white">
						{question.placeholder ?? "Selecciona una opción"}
					</option>
					{question.options.map(option => (
						<option
							key={option.value}
							value={String(option.value)}
							className="bg-neutral-900 text-white"
						>
							{option.label}
						</option>
					))}
				</select>
			) : question.type === "multiselect" ? (
				<div className="grid gap-3">
					{question.options.map(option => {
						const checked = normalized.includes(String(option.value))
						return (
							<label
								key={option.value}
								className={cn(
									"flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-200 transition-all hover:border-blue-400/40 hover:bg-white/10",
									checked ? "border-blue-400/70 bg-blue-500/10 text-white" : "",
									theme?.radio
								)}
							>
								<input
									type="checkbox"
									checked={checked}
									onChange={() => {
										const next = checked
											? normalized.filter(
													item => item !== String(option.value)
												)
											: [...normalized, String(option.value)]
										onChange(next)
									}}
									className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent text-blue-500 focus:ring-blue-500"
								/>
								<span className="space-y-1">
									<span className="block font-medium text-white">
										{option.label}
									</span>
									{option.description ? (
										<span className="block text-gray-400">
											{option.description}
										</span>
									) : null}
								</span>
							</label>
						)
					})}
				</div>
			) : (
				<div className="grid gap-3">
					{question.options.map(option => {
						const checked = normalized.includes(String(option.value))
						return (
							<label
								key={option.value}
								className={cn(
									"flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-200 transition-all hover:border-blue-400/40 hover:bg-white/10",
									checked ? "border-blue-400/70 bg-blue-500/10 text-white" : "",
									theme?.radio
								)}
							>
								<input
									type="radio"
									name={question.id}
									checked={checked}
									onChange={() => onChange(String(option.value))}
									className="mt-1 h-4 w-4 border-white/20 bg-transparent text-blue-500 focus:ring-blue-500"
								/>
								<span className="space-y-1">
									<span className="block font-medium text-white">
										{option.label}
									</span>
									{option.description ? (
										<span className="block text-gray-400">
											{option.description}
										</span>
									) : null}
								</span>
							</label>
						)
					})}
				</div>
			)}
		</FieldShell>
	)
}
