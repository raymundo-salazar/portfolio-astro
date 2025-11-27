const $projectItems = document.querySelectorAll(".project-item")

const openModal = ($modalItem: Element) => {
	const $body = document.querySelector("body")
	const $content = $modalItem.querySelector(".modal-content")
	const $backdrop = $modalItem.querySelector(".backdrop")

	$body?.classList.add("overflow-hidden")

	$modalItem.classList.remove("pointer-events-none")

	$backdrop?.classList.remove("opacity-0")

	$content?.classList.remove("opacity-0")
	$content?.classList.remove("-translate-y-10")
	$content?.classList.add("translate-y-0")
}

$projectItems.forEach($item => {
	const $moreDetails = $item.querySelectorAll(".more-details")
	const $projectId = $item.getAttribute("id")
	const $modal = document.getElementById("modal-" + $projectId)

	$moreDetails?.forEach($detail => {
		$detail.addEventListener("click", () => {
			if ($modal) openModal($modal)
		})
	})
})
