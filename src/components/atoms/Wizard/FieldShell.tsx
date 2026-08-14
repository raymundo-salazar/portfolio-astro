import type { ReactNode } from "react"

import { cn } from "@/lib/brief-wizard/evaluate"
import { getWizardIcon } from "./iconRegistry"

type FieldShellProps = {
	label?: string
	helperText?: string
	error?: string | null
	required?: boolean
	iconLeft?: string
	iconRight?: string
	className?: string
	labelClassName?: string
	helperClassName?: string
	errorClassName?: string
	children: ReactNode
	theme?: {
		questionShell?: string
		label?: string
		helper?: string
		error?: string
	}
}

export default function FieldShell({
	label,
	helperText,
	error,
	required,
	iconLeft,
	iconRight,
	className,
	labelClassName,
	helperClassName,
	errorClassName,
	children,
	theme,
}: FieldShellProps) {
	const LeftIcon = getWizardIcon(iconLeft)
	const RightIcon = getWizardIcon(iconRight)

	return (
		<div className={cn("space-y-3", theme?.questionShell, className)}>
			{label ? (
				<div className={cn("flex items-start justify-between gap-3", labelClassName)}>
					<div className="flex items-center gap-2 text-sm font-medium text-white">
						{LeftIcon ? <LeftIcon className="h-4 w-4 text-blue-300" /> : null}
						<span>
							{label}
							{required ? <span className="ml-1 text-blue-300">*</span> : null}
						</span>
					</div>
					{RightIcon ? <RightIcon className="mt-0.5 h-4 w-4 text-blue-300" /> : null}
				</div>
			) : null}

			{children}

			{helperText ? (
				<p className={cn("text-sm text-gray-400", theme?.helper, helperClassName)}>
					{helperText}
				</p>
			) : null}

			{error ? (
				<p className={cn("text-sm text-red-300", theme?.error, errorClassName)}>{error}</p>
			) : null}
		</div>
	)
}
