document.addEventListener("DOMContentLoaded", () => {
	const pills = document.querySelectorAll<any>(".category-pill")
	const cards = document.querySelectorAll<any>(".skill-card")
	let activeCategory: string | null = null

	pills.forEach(pill => {
		pill.addEventListener("click", () => {
			const category = pill.dataset.category

			if (activeCategory === category) {
				// Si haces clic en la misma categoría, se desactiva el filtro
				activeCategory = null
				pills.forEach(p => p.classList.remove("ring-2", "ring-white", "opacity-100"))
				cards.forEach(card => (card.style.display = ""))
			} else {
				// Activar nueva categoría
				activeCategory = category
				pills.forEach(p => {
					if (p.dataset.category === category) {
						p.classList.add("ring-2", "ring-white", "opacity-100")
					} else {
						p.classList.remove("ring-2", "ring-white")
						p.classList.add("opacity-40")
					}
				})

				cards.forEach(card => {
					card.style.display = card.dataset.category === category ? "" : "none"
				})
			}
		})
	})

	const container = document.getElementById("skills")
	const toggleBtn = document.getElementById("toggle-skills")
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
