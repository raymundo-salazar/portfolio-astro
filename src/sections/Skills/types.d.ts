import type { Code } from "@lucide/astro"
import type { DiMsqlServer } from "react-icons/di"
import type { TbBrandReactNative } from "react-icons/tb"
import type { VscAzure } from "react-icons/vsc"

export interface SkillCategory {
	title: string
	color: string
	skilIconColor: string
	icon: typeof Code | typeof DiMsqlServer | typeof VscAzure | typeof TbBrandReactNative
}
