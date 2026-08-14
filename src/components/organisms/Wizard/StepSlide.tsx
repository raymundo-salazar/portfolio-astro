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
		<section
			className={cn(
				"rounded-[2rem] border border-white/10 bg-neutral-950/55 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8",
				theme?.slideShell,
				className
			)}
		>
			{title || subtitle || description ? (
				<header className={cn("mb-8 space-y-3", theme?.slideHeader)}>
					{title ? (
						<h3
							className={cn(
								"text-2xl font-semibold text-white sm:text-3xl",
								theme?.slideTitle
							)}
						>
							{title}
						</h3>
					) : null}
					{subtitle ? (
						<p
							className={cn(
								"text-sm uppercase tracking-[0.24em] text-blue-300",
								theme?.slideSubtitle
							)}
						>
							{subtitle}
						</p>
					) : null}
					{description ? (
						<p
							className={cn(
								"max-w-3xl text-sm leading-6 text-gray-300 sm:text-base",
								theme?.heroText
							)}
						>
							{description}
						</p>
					) : null}
				</header>
			) : null}

			<div className={cn("space-y-6", theme?.questionStack)}>{children}</div>
		</section>
	)
}
