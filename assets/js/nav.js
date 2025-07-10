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

document.addEventListener('DOMContentLoaded', function () {
    // scroll
    var script = document.createElement('script');
    script.src = "https://unpkg.com/lenis@1.1.2/dist/lenis.min.js";
    document.head.appendChild(script);

    script.onload = function () {
        const lenis = new Lenis()
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault()

                const target = document.querySelector(this.getAttribute('href'))
                if (target) {
                    lenis.scrollTo(target, {
                        offset: 0,
                        duration: 1,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                    })
                }
            })
        })
        function raf(time) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)
    };

});