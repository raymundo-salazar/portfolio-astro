import type { AstroComponent } from "@lucide/astro"
import type { IconType } from "react-icons"

export interface HeroSocialIconProps {
	name: string
	url: string
	title?: string
	icon: IconType | AstroComponent
}
