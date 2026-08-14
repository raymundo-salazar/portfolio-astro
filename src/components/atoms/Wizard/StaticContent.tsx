import { cn } from "@/lib/brief-wizard/evaluate"
import type { WizardStaticQuestion } from "@/lib/brief-wizard/types"

type Props = {
	question: WizardStaticQuestion
	theme?: Record<string, string | undefined>
}

export default function StaticContent({ question, theme }: Props) {
	if (question.type === "title") {
		return (
			<h3
				className={cn(
					"text-3xl font-semibold tracking-tight text-white",
					theme?.slideTitle
				)}
			>
				{question.content}
			</h3>
		)
	}

	if (question.type === "subtitle") {
		return (
			<h4 className={cn("text-xl font-medium text-blue-100", theme?.slideSubtitle)}>
				{question.content}
			</h4>
		)
	}

	return (
		<p className={cn("max-w-3xl text-base leading-7 text-gray-300", theme?.heroText)}>
			{question.content}
		</p>
	)
}
