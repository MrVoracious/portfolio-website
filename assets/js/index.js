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

  const startX = Math.random() * (maxX - 80);
  const startY = Math.random() * (maxY - 80);

  bubble.style.left = `${startX}px`;
  bubble.style.top = `${startY}px`;
  bubble.style.animation = `bubblePop 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards ${600 + (300 * i)}ms`

  bubble.dataset.dx = (Math.random() * 0.1 + 0.3) * (Math.random() < 0.5 ? 1 : -1);
  bubble.dataset.dy = (Math.random() * 0.1 + 0.3) * (Math.random() < 0.5 ? 1 : -1);

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

const canvas = document.getElementById("grid-bg");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = { x: null, y: null };
window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initGrid();
});

const spacing = 40;
let points = [];

function initGrid() {
  points = [];
  for (let y = 0; y <= canvas.height; y += spacing) {
    for (let x = 0; x <= canvas.width; x += spacing) {
      points.push({ x, y, ox: x, oy: y });
    }
  }
}
initGrid();

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 1;

  // Draw lines
  for (let i = 0; i < points.length; i++) {
    let p = points[i];

    // Pull points near the mouse
    let dx = p.x - mouse.x;
    let dy = p.y - mouse.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    let force = Math.max(100 - dist, 0) / 100;

    if (force > 0) {
      let angle = Math.atan2(dy, dx);
      p.x += Math.cos(angle) * force * 3;
      p.y += Math.sin(angle) * force * 3;
    }

    // Ease back to original position
    p.x += (p.ox - p.x) * 0.05;
    p.y += (p.oy - p.y) * 0.05;
  }

  // Draw horizontal + vertical lines
  for (let y = 0; y <= canvas.height; y += spacing) {
    ctx.beginPath();
    for (let x = 0; x <= canvas.width; x += spacing) {
      let pt = points.find(p => Math.abs(p.x - x) < spacing && Math.abs(p.y - y) < spacing);
      if (pt) ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();
  }

  for (let x = 0; x <= canvas.width; x += spacing) {
    ctx.beginPath();
    for (let y = 0; y <= canvas.height; y += spacing) {
      let pt = points.find(p => Math.abs(p.x - x) < spacing && Math.abs(p.y - y) < spacing);
      if (pt) ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();
  }

  requestAnimationFrame(draw);
}
draw();