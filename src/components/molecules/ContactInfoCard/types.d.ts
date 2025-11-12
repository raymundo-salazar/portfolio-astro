import type { AstroComponent } from "@lucide/astro"

export interface ContactInfoCardProps {
	icon: AstroComponent
	title: string
	details: string
	href: string
}
