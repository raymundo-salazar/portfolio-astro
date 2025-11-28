import { Mail, Phone, MapPin } from "@lucide/astro"

export const CONTACT_INFO = [
	{
		icon: Mail,
		key: "email",
		details: "raymundo.salser@hotmail.com",
		action: "mailto:raymundo.salser@hotmail.com",
	},
	{
		icon: Phone,
		key: "phone",
		details: "+52 818 6843 534",
		action: "tel:+528186843534",
	},
	{
		icon: MapPin,
		key: "location",
		details: "San Nicolás, NL. México",
		action: "#",
	},
]
