if (sessionStorage.getItem('hasVisited')) {
    document.getElementById("loader1").style.display = "none"
    document.getElementById("loader2").style.display = "none"
} else{
    sessionStorage.setItem('hasVisited', 'true');
    document.getElementById("loader1").style.opacity = "1"
    document.getElementById("loader2").style.opacity = "1"
}

const center = document.getElementById('center');

let centerX, centerY;

function updateCenter() {
    const centerRect = center.getBoundingClientRect();
    centerX = centerRect.left + centerRect.width / 2;
    centerY = centerRect.top + centerRect.height / 2;
}
updateCenter();
window.addEventListener('resize', updateCenter);

const bubbles = document.querySelectorAll('.bubble');
const orbitData = [];

const total = bubbles.length;

bubbles.forEach((bubble, i) => {
    const baseAngle = (2 * Math.PI * i) / total;

    orbitData.push({
        el: bubble,
        angle: baseAngle,
        radiusX: 300 + Math.random() * 40,
        radiusY: 300 + Math.random() * 40,
        speed: 0.0015 + Math.random() * 0.0015,
        waveAmplitude: 5 + Math.random() * 10,
        waveFreq: 2 + Math.random() * 2,
    });
});

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateOrbit(t) {
    orbitData.forEach(data => {
        const { el, radiusX, radiusY, speed, waveAmplitude, waveFreq } = data;
        data.angle += speed;

        // Elliptical orbit
        let x = centerX + radiusX * Math.cos(data.angle);
        let y = centerY + radiusY * Math.sin(data.angle);

        // Add wave wobble
        x += Math.sin(t * 0.001 * waveFreq) * waveAmplitude;
        y += Math.cos(t * 0.001 * waveFreq) * waveAmplitude;


        // Repel from cursor
        const dx = mouseX - x;
        const dy = mouseY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 100;

        if (dist < repelRadius) {
            const angle = Math.atan2(dy, dx);
            const force = (repelRadius - dist) / repelRadius;
            x -= Math.cos(angle) * force * 30;
            y -= Math.sin(angle) * force * 30;
        }

        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
    });

    requestAnimationFrame(animateOrbit);
}

requestAnimationFrame(animateOrbit);