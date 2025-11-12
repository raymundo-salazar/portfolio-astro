const loadingContent = document.getElementById("loading-button-content")
const buttonContent = document.getElementById("send-button-content")
const successMessage = document.getElementById("success-message")
const errorMessage = document.getElementById("error-message")

const form = document.getElementById("contact-form") as HTMLFormElement | null

form?.addEventListener("submit", async event => {
	event.preventDefault()

	loadingContent?.classList.remove("hidden")
	loadingContent?.classList.add("flex")
	buttonContent?.classList.add("hidden")

	const data = new FormData(event.target as HTMLFormElement)
	const res = await fetch(form.action, {
		method: "POST",
		body: data,
		headers: {
			Accept: "application/json",
		},
	})

	if (res.ok) {
		successMessage?.classList.remove("hidden")
		successMessage?.classList.add("flex")
		form.reset()
		setTimeout(() => {
			successMessage?.classList.add("hidden")
			successMessage?.classList.remove("flex")
		}, 10000)
		loadingContent?.classList.add("hidden")
		buttonContent?.classList.remove("hidden")
	} else {
		errorMessage?.classList.remove("hidden")
		errorMessage?.classList.add("flex")
		setTimeout(() => {
			errorMessage?.classList.add("hidden")
			errorMessage?.classList.remove("flex")
		}, 10000)
		loadingContent?.classList.add("hidden")
		buttonContent?.classList.remove("hidden")
	}
})
