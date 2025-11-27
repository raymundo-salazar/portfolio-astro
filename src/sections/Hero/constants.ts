import { SiGithub } from "react-icons/si"
import { SlSocialLinkedin } from "react-icons/sl"
import { Download, Mail } from "@lucide/astro"

export const SOCIAL_LINKS = [
	{
		name: "Email",
		url: `mailto:${import.meta.env.PUBLIC_EMAIL_ADDRESS}`,
		icon: Mail,
	},
	{
		name: "GitHub",
		url: `https://github.com/${import.meta.env.PUBLIC_GITHUB_USERNAME}`,
		icon: SiGithub,
	},
	{
		name: "LinkedIn",
		url: `https://www.linkedin.com/in/${import.meta.env.PUBLIC_LINKEDIN_USERNAME}`,
		icon: SlSocialLinkedin,
	},
	{
		name: "Curriculum Vitae",
		title: "Descargar CV",
		url: `/curriculum-vitae/Raymundo Salazar - ES.pdf`,
		icon: Download,
	},
]
