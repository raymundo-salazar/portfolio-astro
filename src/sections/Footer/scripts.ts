const scrollToTop = document.getElementById("scroll-to-top")
const navButtons = document.querySelectorAll("[data-section]")

if (scrollToTop) {
	scrollToTop.addEventListener("click", () => {
		window.scrollTo({ top: 0, behavior: "smooth" })
	})
}

navButtons.forEach(btn => {
	btn.addEventListener("click", () => {
		const id = btn.getAttribute("data-section")
		if (!id) return
		const target = document.getElementById(id)
		if (target) target.scrollIntoView({ behavior: "smooth" })
	})
})
