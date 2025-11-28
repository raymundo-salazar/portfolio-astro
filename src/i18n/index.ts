import en from "./en"
import es from "./es"

export const languages = {
	es,
	en,
}

export const useTranslation = (lang: keyof typeof languages) => {
	return languages[lang] || languages["es"]
}
