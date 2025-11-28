import type { LucideIcon } from "lucide-react"

export interface Experience {
	id: number
	company: string
	position: string
	type: string
	period: string
	location: string
	technologies: string[]
	icon: LucideIcon
	color: string
	key: string
}

export interface TimelineItemProps {
	exp: Experience
	index: number
}
