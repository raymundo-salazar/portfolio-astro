document.addEventListener("DOMContentLoaded", () => {
	const container = document.getElementById("timeline")
	const toggleBtn = document.getElementById("toggle-timeline")
	const chevronUp = toggleBtn?.querySelectorAll(".lucide-chevron-up")
	const chevronDown = toggleBtn?.querySelectorAll(".lucide-chevron-down")
	const showMore = toggleBtn?.querySelector(".show-more")
	const showLess = toggleBtn?.querySelector(".show-less")
	const screenHeight = window.innerHeight
	const maxHeight =
		(container?.scrollHeight ?? 0) > screenHeight
			? screenHeight + "px"
			: container?.scrollHeight + "px"
	let expanded = false

	if (container?.style) container.style.maxHeight = maxHeight

	toggleBtn?.addEventListener("click", () => {
		expanded = !expanded

		if (expanded) {
			if (container?.style) container.style.maxHeight = container.scrollHeight + "px"
			if (showMore) showMore.classList.add("hidden")
			if (showLess) showLess.classList.remove("hidden")
			chevronUp?.forEach(chevron => chevron.classList.remove("hidden"))
			chevronDown?.forEach(chevron => chevron.classList.add("hidden"))
		} else {
			if (container?.style) container.style.maxHeight = "1000px"
			if (showMore) showMore.classList.remove("hidden")
			if (showLess) showLess.classList.add("hidden")
			container?.scrollIntoView({ behavior: "smooth", block: "center" })
			chevronUp?.forEach(chevron => chevron.classList.add("hidden"))
			chevronDown?.forEach(chevron => chevron.classList.remove("hidden"))
		}
	})
})
