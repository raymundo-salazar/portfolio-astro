document.addEventListener("DOMContentLoaded", () => {
	const container = document.getElementById("projects")
	const toggleBtn = document.getElementById("toggle-projects")
	const spanBtn = toggleBtn?.querySelector("span")
	const chevronUp = toggleBtn?.querySelectorAll(".lucide-chevron-up")
	const chevronDown = toggleBtn?.querySelectorAll(".lucide-chevron-down")
	const maxHeight =
		(container?.scrollHeight ?? 0) > 1000 ? "1000px" : container?.scrollHeight + "px"
	let expanded = false

	if (container?.style) container.style.maxHeight = maxHeight

	toggleBtn?.addEventListener("click", () => {
		expanded = !expanded

		if (expanded) {
			if (container?.style) container.style.maxHeight = container.scrollHeight + "px"
			if (spanBtn) spanBtn.textContent = "Mostrar menos"
			chevronUp?.forEach(chevron => chevron.classList.remove("hidden"))
			chevronDown?.forEach(chevron => chevron.classList.add("hidden"))
		} else {
			if (container?.style) container.style.maxHeight = "1000px"
			if (spanBtn) spanBtn.textContent = "Mostrar más"
			container?.scrollIntoView({ behavior: "smooth", block: "center" })
			chevronUp?.forEach(chevron => chevron.classList.add("hidden"))
			chevronDown?.forEach(chevron => chevron.classList.remove("hidden"))
		}
	})
})
