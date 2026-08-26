import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react"

import { cn } from "@/lib/brief-wizard/evaluate"

type BaseProps = {
	children: ReactNode
	variant?: "primary" | "secondary"
	outline?: boolean
	floating?: boolean
	ghost?: boolean
	square?: boolean
	rounded?: boolean
	link?: boolean
	class?: string
	className?: string
}

type LinkProps = BaseProps &
	AnchorHTMLAttributes<any> & {
		link: true
		href: string
	}

type ButtonProps = BaseProps &
	ButtonHTMLAttributes<any> & {
		link?: false
		href?: never
	}

type Props = LinkProps | ButtonProps

const getShapeClass = (square?: boolean, rounded?: boolean) => {
	if (square) return "rounded-none"
	if (rounded) return "rounded-full"
	return "rounded-2xl"
}

const getBaseClass = (isLink: boolean, ghost?: boolean) =>
	isLink && ghost
		? "inline-flex items-center gap-2 text-sm font-semibold transition duration-300"
		: "inline-flex cursor-pointer items-center justify-center gap-2 px-5 py-3 text-sm font-semibold transition duration-300 disabled:cursor-not-allowed disabled:opacity-40"

const getVariantClass = ({
	variant,
	outline,
	ghost,
	isLink,
}: {
	variant: "primary" | "secondary"
	outline?: boolean
	ghost?: boolean
	isLink: boolean
}) => {
	if (ghost && isLink) {
		return "text-blue-200 hover:text-white"
	}

	if (ghost) {
		return "border border-transparent bg-transparent text-white hover:bg-white/5"
	}

	if (outline) {
		return variant === "primary"
			? "border border-blue-500/40 bg-transparent text-blue-100 hover:bg-blue-500/10"
			: "border border-white/10 bg-transparent text-white hover:bg-white/5"
	}

	return variant === "secondary"
		? "border border-white/10 bg-white/5 text-white hover:bg-white/10"
		: "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-950/20"
}

export default function Button(props: Props) {
	const {
		children,
		variant = "primary",
		outline,
		floating,
		ghost,
		square,
		rounded,
		link,
		class: classProp,
		className,
		...rest
	} = props

	const isLink = Boolean(link)
	const shapeClass = getShapeClass(square, rounded)
	const variantClass = getVariantClass({ variant, outline, ghost, isLink })
	const motionClass = floating ? "shadow-lg hover:-translate-y-0.5 hover:shadow-xl" : ""
	const classes = cn(
		getBaseClass(isLink, ghost),
		shapeClass,
		variantClass,
		motionClass,
		classProp,
		className
	)

	if (isLink) {
		const linkProps = rest as AnchorHTMLAttributes<any>

		return (
			<a {...linkProps} className={classes}>
				{children}
			</a>
		)
	}

	const buttonProps = rest as ButtonHTMLAttributes<any>

	return (
		<button {...buttonProps} className={classes}>
			{children}
		</button>
	)
}
