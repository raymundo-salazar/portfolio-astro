import type { LucideIcon } from "lucide-react"

export interface Experience {
	id: number
	company: string
	position: string
	type: string
	period: string
	location: string
	description: string
	achievements: string[]
	technologies: string[]
	icon: LucideIcon
	color: string
}

export interface TimelineItemProps {
	exp: Experience
	index: number
}
