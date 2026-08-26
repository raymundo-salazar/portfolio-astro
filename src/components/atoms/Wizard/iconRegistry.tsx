import {
	FiCheck,
	FiCheckSquare,
	FiChevronDown,
	FiChevronRight,
	FiFileText,
	FiImage,
	FiInfo,
	FiMail,
	FiMessageSquare,
	FiPaperclip,
	FiPlusSquare,
	FiRadio,
	FiSend,
	FiType,
	FiUpload,
} from "react-icons/fi"

export const wizardIcons = {
	check: FiCheck,
	checkbox: FiCheckSquare,
	chevronDown: FiChevronDown,
	chevronRight: FiChevronRight,
	file: FiFileText,
	image: FiImage,
	info: FiInfo,
	mail: FiMail,
	message: FiMessageSquare,
	paperclip: FiPaperclip,
	radio: FiRadio,
	send: FiSend,
	text: FiType,
	upload: FiUpload,
	multi: FiPlusSquare,
} as const

export type WizardIconName = keyof typeof wizardIcons

export const getWizardIcon = (name?: string) => {
	if (!name) return null
	return wizardIcons[name as WizardIconName] ?? null
}
