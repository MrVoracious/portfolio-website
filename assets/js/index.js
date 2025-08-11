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











// const canvas = document.getElementById("grid-bg");
// const ctx = canvas.getContext("2d");
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// let mouse = { x: null, y: null };
// window.addEventListener("mousemove", e => {
//   mouse.x = e.clientX;
//   mouse.y = e.clientY;
// });
// window.addEventListener("resize", () => {
//   canvas.width = window.innerWidth;
//   canvas.height = window.innerHeight;
//   initGrid();
// });

// const spacing = 40;
// let points = [];

// function initGrid() {
//   points = [];
//   for (let y = 0; y <= canvas.height; y += spacing) {
//     for (let x = 0; x <= canvas.width; x += spacing) {
//       points.push({ x, y, ox: x, oy: y });
//     }
//   }
// }
// initGrid();

// function draw() {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.strokeStyle = "rgba(255,255,255,0.1)";
//   ctx.lineWidth = 1;

//   // Draw lines
//   for (let i = 0; i < points.length; i++) {
//     let p = points[i];

//     // Pull points near the mouse
//     let dx = p.x - mouse.x;
//     let dy = p.y - mouse.y;
//     let dist = Math.sqrt(dx * dx + dy * dy);
//     let force = Math.max(100 - dist, 0) / 100;

//     if (force > 0) {
//       let angle = Math.atan2(dy, dx);
//       p.x += Math.cos(angle) * force * 3;
//       p.y += Math.sin(angle) * force * 3;
//     }

//     // Ease back to original position
//     p.x += (p.ox - p.x) * 0.05;
//     p.y += (p.oy - p.y) * 0.05;
//   }

//   // Draw horizontal + vertical lines
//   for (let y = 0; y <= canvas.height; y += spacing) {
//     ctx.beginPath();
//     for (let x = 0; x <= canvas.width; x += spacing) {
//       let pt = points.find(p => Math.abs(p.x - x) < spacing && Math.abs(p.y - y) < spacing);
//       if (pt) ctx.lineTo(pt.x, pt.y);
//     }
//     ctx.stroke();
//   }

//   for (let x = 0; x <= canvas.width; x += spacing) {
//     ctx.beginPath();
//     for (let y = 0; y <= canvas.height; y += spacing) {
//       let pt = points.find(p => Math.abs(p.x - x) < spacing && Math.abs(p.y - y) < spacing);
//       if (pt) ctx.lineTo(pt.x, pt.y);
//     }
//     ctx.stroke();
//   }

//   requestAnimationFrame(draw);
// }
// draw();




const canvas = document.getElementById("grid-bg");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Adjust spacing based on device width
const spacing = window.innerWidth < 768 ? 80 : 40;
let points = [];
let pointMap = {};

// Mouse position
let mouse = { x: -9999, y: -9999 }; // Start off-screen
window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initGrid();
});

// Initialize grid and pre-index points
function initGrid() {
  points = [];
  pointMap = {};
  for (let y = 0; y <= canvas.height; y += spacing) {
    for (let x = 0; x <= canvas.width; x += spacing) {
      const p = { x, y, ox: x, oy: y };
      points.push(p);
      pointMap[`${x},${y}`] = p;
    }
  }
}
initGrid();

// Snappy preset values
const PUSH_MULTIPLIER = 15;   // higher = push away faster
const RETURN_SPEED = 0.05;   // higher = return faster

// Draw grid
let lastTime = 0;
const frameInterval = window.innerWidth < 768 ? 33 : 16; // 30fps mobile, 60fps desktop

function draw(time) {
  if (time - lastTime > frameInterval) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;

    // Update points near mouse
    const mouseInfluence = 100;
    for (let p of points) {
      let dx = p.x - mouse.x;
      let dy = p.y - mouse.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouseInfluence) {
        let force = (mouseInfluence - dist) / mouseInfluence;
        let angle = Math.atan2(dy, dx);
        p.x += Math.cos(angle) * force * PUSH_MULTIPLIER;
        p.y += Math.sin(angle) * force * PUSH_MULTIPLIER;
      }

      // Snap back faster
      p.x += (p.ox - p.x) * RETURN_SPEED;
      p.y += (p.oy - p.y) * RETURN_SPEED;
    }

    // Draw horizontal lines
    for (let y = 0; y <= canvas.height; y += spacing) {
      ctx.beginPath();
      for (let x = 0; x <= canvas.width; x += spacing) {
        let pt = pointMap[`${x},${y}`];
        if (pt) ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    }

    // Draw vertical lines
    for (let x = 0; x <= canvas.width; x += spacing) {
      ctx.beginPath();
      for (let y = 0; y <= canvas.height; y += spacing) {
        let pt = pointMap[`${x},${y}`];
        if (pt) ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    }

    lastTime = time;
  }

  requestAnimationFrame(draw);
}
draw();