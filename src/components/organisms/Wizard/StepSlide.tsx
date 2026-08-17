import type { ReactNode } from "react"

import { cn } from "@/lib/brief-wizard/evaluate"

type Props = {
	title?: string
	subtitle?: string
	description?: string
	children: ReactNode
	className?: string
	theme?: Record<string, string | undefined>
}

export default function StepSlide({
	title,
	subtitle,
	description,
	children,
	className,
	theme,
}: Props) {
	return (
		<section className={cn("mx-auto w-full max-w-2xl", theme?.slideShell, className)}>
			{title || subtitle || description ? (
				<header className={cn("mb-8 space-y-3", theme?.slideHeader)}>
					{title ? (
						<h3
							className={cn(
								"text-3xl font-semibold tracking-tight text-white sm:text-4xl",
								theme?.slideTitle
							)}
						>
							{title}
						</h3>
					) : null}
					{subtitle ? (
						<p
							className={cn(
								"text-xs font-semibold uppercase tracking-[0.32em] text-blue-300",
								theme?.slideSubtitle
							)}
						>
							{subtitle}
						</p>
					) : null}
					{description ? (
						<p
							className={cn(
								"max-w-3xl text-base leading-7 text-gray-300 sm:text-lg",
								theme?.heroText
							)}
						>
							{description}
						</p>
					) : null}
				</header>
			) : null}

			<div className={cn("space-y-8", theme?.questionStack)}>{children}</div>
		</section>
	)
}
