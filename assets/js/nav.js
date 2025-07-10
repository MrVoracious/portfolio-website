const options = document.getElementById("options");
const highlight = document.getElementById("highlight");
let scaleTimeout;

function moveHighlight(option) {
    clearTimeout(scaleTimeout);

    options.querySelector(".active").classList.remove("active")
    option.classList.add("active")

    highlight.style.transform = 'scale(1.1)';
    highlight.style.background = 'rgba(255, 255, 255, 0)';
    highlight.style.border = "1px solid rgba(255, 255, 255, 0.1)"

    highlight.style.width = `calc(${option.offsetWidth}px - 0.75vw)`;
    highlight.style.left = `calc(${option.offsetLeft}px + 0.375vw)`;
    highlight.style.height = `calc(${option.offsetHeight}px - 0.5vw)`;

    scaleTimeout = setTimeout(() => {
        highlight.style.transform = 'scale(1)';
        highlight.style.background = 'rgba(255, 255, 255, 0.1)';
        highlight.style.border = "1px solid rgba(255, 255, 255, 0)"
    }, 300);
}

function returnToActive() {
    clearTimeout(scaleTimeout);
    const active = options.querySelector(".active");

    highlight.style.width = `calc(${active.offsetWidth}px - 0.75vw)`;
    highlight.style.left = `calc(${active.offsetLeft}px + 0.375vw)`;
    highlight.style.height = `calc(${active.offsetHeight}px - 0.5vw)`;
    highlight.style.transform = 'scale(1)';
}
options.querySelectorAll(".option").forEach(option => {
    option.addEventListener("click", () => moveHighlight(option));
});

options.addEventListener("mouseleave", returnToActive);
window.addEventListener("load", returnToActive);
window.addEventListener("resize", returnToActive);