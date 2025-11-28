import { Users, Code, Palette } from "@lucide/astro"

export const getTypeIcon = (type: string) => {
	switch (type) {
		case "leadership":
			return Users
		case "development":
			return Code
		default:
			return Palette
	}
}

export const getTypeColor = (type: string) => {
	switch (type) {
		case "leadership":
			return "bg-blue-100 text-blue-800"
		case "development":
			return "bg-green-100 text-green-800"
		default:
			return "bg-purple-100 text-purple-800"
	}
}
