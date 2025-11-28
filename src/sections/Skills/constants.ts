import { Code, Database, Palette, Smartphone, Zap } from "@lucide/astro"
import { DiMsqlServer } from "react-icons/di"
import {
	SiReact,
	SiTypescript,
	SiTailwindcss,
	SiNodedotjs,
	SiPhp,
	SiMysql,
	SiDocker,
	SiGit,
	SiFigma,
	SiVuedotjs,
	SiPython,
	SiAwsamplify,
	SiAdobephotoshop,
	SiAdobeillustrator,
	SiFirebase,
	SiGithub,
	SiApple,
	SiAndroid,
	SiMongodb,
} from "react-icons/si"
import { TbBrandReactNative } from "react-icons/tb"
import { VscAzure, VscAzureDevops } from "react-icons/vsc"

import type { SkillCategory } from "./types"

export const SKILL_CATEGORIES: Record<string, SkillCategory> = {
	frontend: {
		title: "frontend",
		color: "bg-blue-900",
		skilIconColor: "text-blue-700",
		icon: Code,
	},
	backend: {
		title: "backend",
		color: "bg-emerald-900",
		skilIconColor: "text-emerald-700",
		icon: Database,
	},
	devops: {
		title: "devops",
		color: "bg-orange-900",
		skilIconColor: "text-orange-700",
		icon: Zap,
	},
	design: {
		title: "design",
		color: "bg-pink-900",
		skilIconColor: "text-pink-700",
		icon: Palette,
	},
	mobile: {
		title: "mobile",
		color: "bg-cyan-900",
		skilIconColor: "text-cyan-700",
		icon: Smartphone,
	},
}

export const SKILLS = [
	{ name: "React", icon: SiReact, size: "large", category: "frontend" },
	{ name: "TypeScript", icon: SiTypescript, size: "medium", category: "frontend" },
	{ name: "TailwindCSS", icon: SiTailwindcss, size: "large", category: "frontend" },
	{ name: "Vue.js", icon: SiVuedotjs, size: "small", category: "frontend" },
	{ name: "React Native", icon: TbBrandReactNative, size: "large", category: "mobile" },
	{ name: "iOS", icon: SiApple, size: "medium", category: "mobile" },
	{ name: "Android", icon: SiAndroid, size: "medium", category: "mobile" },
	{ name: "Node.js", icon: SiNodedotjs, size: "large", category: "backend" },
	{ name: "PHP (Laravel)", icon: SiPhp, size: "medium", category: "backend" },
	{ name: "MySQL", icon: SiMysql, size: "small", category: "backend" },
	{ name: "Python", icon: SiPython, size: "small", category: "backend" },
	{ name: "Firebase", icon: SiFirebase, size: "medium", category: "backend" },
	{ name: "SQL Server", icon: DiMsqlServer, size: "small", category: "backend" },
	{ name: "MongoDB", icon: SiMongodb, size: "small", category: "backend" },
	{ name: "Firestore", icon: SiFirebase, size: "medium", category: "backend" },
	{ name: "Docker", icon: SiDocker, size: "medium", category: "devops" },
	{ name: "Git / CI/CD", icon: SiGit, size: "large", category: "devops" },
	{ name: "AWS", icon: SiAwsamplify, size: "medium", category: "devops" },
	{ name: "GitHub", icon: SiGithub, size: "large", category: "devops" },
	{ name: "Azure DevOps", icon: VscAzureDevops, size: "medium", category: "devops" },
	{ name: "Azure", icon: VscAzure, size: "small", category: "devops" },
	{ name: "Figma", icon: SiFigma, size: "medium", category: "design" },
	{ name: "Photoshop", icon: SiAdobephotoshop, size: "medium", category: "design" },
	{ name: "Illustrator", icon: SiAdobeillustrator, size: "large", category: "design" },
]

function shuffle<T>(arr: T[]): T[] {
	const copy = arr.slice()
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[copy[i], copy[j]] = [copy[j], copy[i]]
	}
	return copy
}

export const SHUFFLED_SKILLS = shuffle(SKILLS)
