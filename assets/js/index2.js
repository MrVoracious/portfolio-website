const bubblecontainer = document.getElementById('bubble-container');


function fitTextToWidth() {
    const container = document.getElementById('container');
    const text = document.getElementById('text');

    let fontSize = 248;
    text.style.fontSize = fontSize + 'px';

    function grow() {
        if (text.scrollWidth < (container.clientWidth - 50) && fontSize < 500) {
            fontSize++;
            text.style.fontSize = fontSize + 'px';
            grow()
        } else {
            container.style.height = fontSize + 'px'
            bubblecontainer.style.height = fontSize + 'px'
        }
    }

    grow()
}

fitTextToWidth()

window.onload = fitTextToWidth;
window.onresize = fitTextToWidth;

document.querySelectorAll('.char').forEach(span => {
    const popup = span.querySelector('.popup');
    if (popup) {
        span.addEventListener('mouseenter', () => {
            const rotate = popup.getAttribute('data-rotate');
            popup.style.transform = `scale(1) rotate(${rotate})`;
        });
        span.addEventListener('mouseleave', () => {
            popup.style.transform = 'scale(0) rotate(0deg)';
        });
    }
});

anime.timeline()
    .add({
        targets: '.char',
        translateY: [50, 0],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 800,
        delay: (el, i) => i * 50
    })

anime({
    targets: '.tagline',
    opacity: [0, 1],
    translateX: [-100, 0],
    translateY: [-100, -100],
    easing: 'easeOutExpo',
    duration: 1000,
    delay: 300
});



const skills = ['Python', 'Firebase', 'HTML', 'CSS', 'JS'];
const containerRect = bubblecontainer.getBoundingClientRect();
const bubbles = [];

for (let i = 0; i < skills.length; i++) {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.textContent = skills[i];

    const maxX = bubblecontainer.clientWidth;
    const maxY = bubblecontainer.clientHeight;

    const startX = Math.random() * (maxX - 80); // leave space for bubble size
    const startY = Math.random() * (maxY - 40);

    bubble.style.left = `${startX}px`;
    bubble.style.top = `${startY}px`;

    bubble.dataset.dx = (Math.random() * 0.5 + 0.3) * (Math.random() < 0.5 ? 1 : -1);
    bubble.dataset.dy = (Math.random() * 0.5 + 0.3) * (Math.random() < 0.5 ? 1 : -1);

    bubblecontainer.appendChild(bubble);
    bubbles.push(bubble);
}
function animate() {
    const maxX = bubblecontainer.clientWidth;
    const maxY = bubblecontainer.clientHeight;

    bubbles.forEach(bubble => {
        let x = parseFloat(bubble.style.left);
        let y = parseFloat(bubble.style.top);
        let dx = parseFloat(bubble.dataset.dx);
        let dy = parseFloat(bubble.dataset.dy);

        x += dx;
        y += dy;

        // Bounce off bubblecontainer walls
        if (x < 0 || x + bubble.offsetWidth > maxX) {
            dx = -dx;
            bubble.dataset.dx = dx;
        }
        if (y < 0 || y + bubble.offsetHeight > maxY) {
            dy = -dy;
            bubble.dataset.dy = dy;
        }

        bubble.style.left = `${x}px`;
        bubble.style.top = `${y}px`;
    });

    requestAnimationFrame(animate);
}

animate();