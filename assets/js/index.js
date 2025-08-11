const canvas = document.getElementById("grid-bg");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Mobile detection
function isMobile() {
  return /Mobi|Android/i.test(navigator.userAgent) ||
    (window.innerWidth <= 800 && window.innerHeight <= 800);
}

const spacing = 40;
let points = [];
let mouse = { x: -9999, y: -9999 };

if (!isMobile()) {
  window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initGrid();
  if (isMobile()) drawStaticGrid(); // redraw once for mobile
});

const PUSH_MULTIPLIER = 3;
const RETURN_SPEED = 0.05;
const MOUSE_INFLUENCE = 100;

let lastTime = 0;
const frameInterval = isMobile() ? 33 : 16;

function initGrid() {
  points = [];
  for (let y = 0; y <= canvas.height; y += spacing) {
    for (let x = 0; x <= canvas.width; x += spacing) {
      points.push({ x, y, ox: x, oy: y });
    }
  }
}
initGrid();

function drawStaticGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 1;

  // Horizontal
  for (let y = 0; y <= canvas.height; y += spacing) {
    ctx.beginPath();
    for (let x = 0; x <= canvas.width; x += spacing) {
      let pt = points.find(p =>
        Math.abs(p.x - x) < spacing && Math.abs(p.y - y) < spacing
      );
      if (pt) ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();
  }

  // Vertical
  for (let x = 0; x <= canvas.width; x += spacing) {
    ctx.beginPath();
    for (let y = 0; y <= canvas.height; y += spacing) {
      let pt = points.find(p =>
        Math.abs(p.x - x) < spacing && Math.abs(p.y - y) < spacing
      );
      if (pt) ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();
  }
}

function draw(time) {
  if (time - lastTime > frameInterval) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;

    // Update interactive points
    for (let p of points) {
      let dx = p.x - mouse.x;
      let dy = p.y - mouse.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MOUSE_INFLUENCE) {
        let force = (MOUSE_INFLUENCE - dist) / MOUSE_INFLUENCE;
        let angle = Math.atan2(dy, dx);
        p.x += Math.cos(angle) * force * PUSH_MULTIPLIER;
        p.y += Math.sin(angle) * force * PUSH_MULTIPLIER;
      }

      p.x += (p.ox - p.x) * RETURN_SPEED;
      p.y += (p.oy - p.y) * RETURN_SPEED;
    }

    // Horizontal lines
    for (let y = 0; y <= canvas.height; y += spacing) {
      ctx.beginPath();
      for (let x = 0; x <= canvas.width; x += spacing) {
        let pt = points.find(p =>
          Math.abs(p.x - x) < spacing && Math.abs(p.y - y) < spacing
        );
        if (pt) ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    }

    // Vertical lines
    for (let x = 0; x <= canvas.width; x += spacing) {
      ctx.beginPath();
      for (let y = 0; y <= canvas.height; y += spacing) {
        let pt = points.find(p =>
          Math.abs(p.x - x) < spacing && Math.abs(p.y - y) < spacing
        );
        if (pt) ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    }

    lastTime = time;
  }

  requestAnimationFrame(draw);
}

// Run once
if (isMobile()) {
  drawStaticGrid(); // Draw once, no animation
} else {
  draw(); // Interactive animation
}
