const $modal = document.querySelectorAll(".project-modal")

const closeModal = ($modalItem: Element) => {
	const $body = document.querySelector("body")
	const $content = $modalItem.querySelector(".modal-content")
	const $backdrop = $modalItem.querySelector(".backdrop")

	$body?.classList.remove("overflow-hidden")

	$modalItem.classList.add("pointer-events-none")

	$backdrop?.classList.add("opacity-0")

	$content?.classList.add("opacity-0")
	$content?.classList.remove("translate-y-0")
	$content?.classList.add("-translate-y-10")
}

$modal.forEach($modalItem => {
	const $closeButton = $modalItem.querySelectorAll(".close-modal")
	$closeButton.forEach(button => {
		button.addEventListener("click", () => {
			closeModal($modalItem)
		})
	})
})

document.addEventListener("keydown", event => {
	if (event.key === "Escape") {
		$modal.forEach($modalItem => {
			closeModal($modalItem)
		})
	}
})
