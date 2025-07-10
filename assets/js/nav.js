const options = document.getElementById("options");
const highlight = document.getElementById("highlight");

options.querySelectorAll(".option").forEach(option => {
    option.addEventListener("mouseenter", () => {
        highlight.style.width = `calc(${option.offsetWidth}px - 0.75vw)`;
        highlight.style.left = `calc(${option.offsetLeft}px + 0.375vw)`;
        highlight.style.height = `calc(${option.offsetHeight}px - 0.5vw)`;
    });
});
options.addEventListener("mouseleave", () => {
    returnToActive()
});

// window.addEventListener('load', returnToActive);
// window.addEventListener('resize', returnToActive);

setTimeout(() => {
  highlight.classList.add("loaded")
  returnToActive()
}, 500);

function returnToActive() {
    const active = options.querySelector(".active");
    highlight.style.width = `calc(${active.offsetWidth}px - 0.75vw)`;
    highlight.style.left = `calc(${active.offsetLeft}px + 0.375vw)`;
    highlight.style.height = `calc(${active.offsetHeight}px - 0.5vw)`;
}