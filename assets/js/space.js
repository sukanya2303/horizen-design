const canvas = document.getElementById("spaceCanvas");
const ctx = canvas.getContext("2d");

let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;

/* ---------------- Mouse ---------------- */

const mouse = {
  x: W / 2,
  y: H / 2
};

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

/* ---------------- Cursor ---------------- */

const cursorDot = document.getElementById("cursor");
const cursorRing = document.getElementById("cursor-ring");

let ringX = mouse.x;
let ringY = mouse.y;

function updateCursor() {
  cursorDot.style.left = mouse.x + "px";
  cursorDot.style.top = mouse.y + "px";

  ringX += (mouse.x - ringX) * 0.12;
  ringY += (mouse.y - ringY) * 0.12;

  cursorRing.style.left = ringX + "px";
  cursorRing.style.top = ringY + "px";
}

/* ---------------- Helpers ---------------- */

function rand(min, max) {
  return min + Math.random() * (max - min);
}



const coreGlow = ctx.createRadialGradient(
  W / 2,
  H / 2,
  0,
  W / 2,
  H / 2,
  120
);

coreGlow.addColorStop(0, "rgba(255,140,0,0.12)");
coreGlow.addColorStop(1, "rgba(255,140,0,0)");

ctx.fillStyle = coreGlow;
ctx.fillRect(0, 0, W, H);

/* ---------------- Stars ---------------- */

const stars = [];

function initStars() {
  stars.length = 0;

  const count = window.innerWidth < 768 ? 180 : 350;

  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      size: rand(0.3, 2.2),
      depth: rand(0.5, 4),
      opacity: rand(0.3, 1),
      twinkle: Math.random() * Math.PI * 2
    });
  }
}

/* ---------------- Orange Strokes ---------------- */

const strokes = [];

function createStroke() {
  const angle = Math.random() * Math.PI * 2;

  strokes.push({
    x: W / 2,
    y: H / 2 - 100,

    vx: Math.cos(angle) * rand(1, 3),
vy: Math.sin(angle) * rand(1, 3),

    length: rand(30, 80),

    life: 0,
    maxLife: rand(200, 400)
  });
}

function initStrokes() {
  strokes.length = 0;

  for (let i = 0; i < 60; i++) {
    createStroke();
  }
}

/* ---------------- Resize ---------------- */

window.addEventListener("resize", () => {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;

  initStars();
  initStrokes();
});

initStars();
initStrokes();

/* ---------------- Camera ---------------- */

let cameraX = 0;
let cameraY = 0;

/* ---------------- Animation ---------------- */

function animate() {
  requestAnimationFrame(animate);

  ctx.clearRect(0, 0, W, H);

  /* Background */

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);

  /* Camera movement */
const t = Date.now() * 0.0003;

const targetX =
  window.innerWidth < 768
    ? Math.sin(t) * 15
    : ((mouse.x / W) - 0.5) * 50;

const targetY =
  window.innerWidth < 768
    ? Math.cos(t * 0.8) * 10
    : ((mouse.y / H) - 0.5) * 50;

cameraX += (targetX - cameraX) * 0.05;
cameraY += (targetY - cameraY) * 0.05;

  /* Orange nebula */

  const nebula = ctx.createRadialGradient(
    W * 0.7,
    H * 0.3,
    0,
    W * 0.7,
    H * 0.3,
    600
  );

  nebula.addColorStop(0, "rgba(255,138,0,0.03)");
  nebula.addColorStop(0.4, "rgba(255,138,0,0.015)");
  nebula.addColorStop(1, "rgba(255,138,0,0)");

  ctx.fillStyle = nebula;
  ctx.fillRect(0, 0, W, H);

  /* Ambient glow */

  const ambient = ctx.createRadialGradient(
    W / 2,
    H / 2,
    0,
    W / 2,
    H / 2,
    W
  );

  ambient.addColorStop(0, "rgba(255,138,0,0.015)");
  ambient.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = ambient;
  ctx.fillRect(0, 0, W, H);

  /* Cursor glow */

  const spotlight = ctx.createRadialGradient(
    mouse.x,
    mouse.y,
    0,
    mouse.x,
    mouse.y,
    220
  );

  

  spotlight.addColorStop(0, "rgba(255,138,0,0.035)");
  spotlight.addColorStop(1, "rgba(255,138,0,0)");

  ctx.fillStyle = spotlight;
  ctx.fillRect(0, 0, W, H);

  /* Stars */

  stars.forEach((star) => {
    star.twinkle += 0.01;

    const alpha =
      star.opacity *
      (0.8 + Math.sin(star.twinkle) * 0.2);

    const x = star.x - cameraX * star.depth;
    const y = star.y - cameraY * star.depth;

    ctx.beginPath();
    ctx.arc(
      x,
      y,
      star.size,
      0,
      Math.PI * 2
    );

    if (star.size > 1.4) {
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#ffffff";
    }

    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fill();

    ctx.shadowBlur = 0;
  });

  /* Orange Energy Burst */

  for (let i = strokes.length - 1; i >= 0; i--) {

    const s = strokes[i];

    s.x += s.vx;
    s.y += s.vy;

    s.life++;

    const progress = s.life / s.maxLife;

    const tailX = s.x - s.vx * 8;
    const tailY = s.y - s.vy * 8;

    const opacity = (1 - progress) * 1;
    const blur = progress * 35;

    const gradient = ctx.createLinearGradient(
      s.x,
      s.y,
      tailX,
      tailY
    );

    gradient.addColorStop(
      0,
      `rgba(255,140,0,${opacity})`
    );

    gradient.addColorStop(
      1,
      "rgba(255,140,0,0)"
    );

    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(tailX, tailY);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1 + progress * 3;

    ctx.shadowBlur = blur;
    ctx.shadowColor = "#ff8c00";

    ctx.stroke();

    if (s.life >= s.maxLife) {
      strokes.splice(i, 1);
      createStroke();
    }
  }

  ctx.shadowBlur = 0;






  updateCursor();
}

animate();