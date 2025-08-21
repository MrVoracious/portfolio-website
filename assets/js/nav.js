const options = document.getElementById("options");
const highlight = document.getElementById("highlight");
let scaleTimeout;

function moveHighlight(option) {
    clearTimeout(scaleTimeout);

    highlight.classList.add("higlightActive")

    const width = option.offsetWidth;
    const left = option.offsetLeft;
    const height = option.offsetHeight;

    highlight.style.width = `calc(${width}px - 0.75vw)`;
    highlight.style.left = `calc(${left}px + 0.375vw)`;
    highlight.style.height = `calc(${height}px - 0.5vw)`;

    scaleTimeout = setTimeout(() => {
        highlight.classList.remove("higlightActive")
    }, 300);
}

function returnToActive() {
    clearTimeout(scaleTimeout);
    const active = options.querySelector(".active");

    const width = active.offsetWidth;
    const left = active.offsetLeft;
    const height = active.offsetHeight;

    highlight.style.width = `calc(${width}px - 1vh)`;
    highlight.style.left = `calc(${left}px + 0.5vh)`;
    highlight.style.height = `calc(${height}px - 1vh)`;
    highlight.classList.remove("higlightActive")
}
options.querySelectorAll(".option").forEach(option => {
    option.addEventListener("click", (e) => {
        e.preventDefault();
        moveHighlight(option)

        scaleTimeout = setTimeout(() => {
            window.location.href = option.href;
        }, 400);
    });
});

window.addEventListener("load", returnToActive);
let resizeTimer;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(returnToActive, 100);
});

// document.addEventListener('DOMContentLoaded', function () {
//     // scroll
//     var script = document.createElement('script');
//     script.src = "https://unpkg.com/lenis@1.1.2/dist/lenis.min.js";
//     document.head.appendChild(script);

//     script.onload = function () {
//         const lenis = new Lenis()
//         document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//             anchor.addEventListener('click', function (e) {
//                 e.preventDefault()

//                 const target = document.querySelector(this.getAttribute('href'))
//                 if (target) {
//                     lenis.scrollTo(target, {
//                         offset: 0,
//                         duration: 1,
//                         easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
//                     })
//                 }
//             })
//         })
//         function raf(time) {
//             lenis.raf(time)
//             requestAnimationFrame(raf)
//         }
//         requestAnimationFrame(raf)
//     };

// });
