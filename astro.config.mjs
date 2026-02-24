// @ts-check
import { defineConfig } from "astro/config"

import react from "@astrojs/react"
import tailwindcss from "@tailwindcss/vite"

// https://astro.build/config
export default defineConfig({
	integrations: [react()],

	i18n: {
		defaultLocale: "es",
		locales: ["es", "en"],
		routing: {
			prefixDefaultLocale: false,
		},
	},

	vite: {
		plugins: [tailwindcss()],
	},

	redirects: {
		"/whatsapp": "https://wa.me/528186843534",
		"/linkedin": "https://www.linkedin.com/in/raymundosalazar/",
		"/github": "https://github.com/raymundo-salazar"
	}
})
