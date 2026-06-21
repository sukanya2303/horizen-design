const canvas = document.getElementById("spaceCanvas");
const ctx = canvas.getContext("2d");

let width, height;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

resize();
window.addEventListener("resize", resize);

const mouse = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
};

window.addEventListener("mousemove", (e) => {
  mouse.x += (e.clientX - mouse.x) * 0.15;
  mouse.y += (e.clientY - mouse.y) * 0.15;
});

window.addEventListener("touchmove", (e) => {
  mouse.x = e.touches[0].clientX;
  mouse.y = e.touches[0].clientY;
});

let time = 0;

function drawAurora(offset, opacity) {
  ctx.beginPath();

  for (let x = -100; x <= width + 100; x += 10) {
    const y =
      height / 2 +
      Math.sin(x * 0.004 + time + offset) * 120 +
      Math.cos(x * 0.002 + time * 0.7) * 80;

    const influence =
      Math.exp(-Math.abs(x - mouse.x) / 250) *
      ((mouse.y - height / 2) * 0.25);

    const finalY = y + influence;

    if (x === -100) {
      ctx.moveTo(x, finalY);
    } else {
      ctx.lineTo(x, finalY);
    }
  }

  ctx.strokeStyle = `rgba(255,138,0,${opacity})`;
  ctx.lineWidth = 80;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.shadowBlur = 80;
  ctx.shadowColor = "#FF8A00";

  ctx.stroke();
}

function animate() {
  time += 0.01;

  ctx.fillStyle = "rgba(0,0,0,0.08)";
  ctx.fillRect(0, 0, width, height);

  const gradient = ctx.createRadialGradient(
  mouse.x,
  mouse.y,
  0,
  mouse.x,
  mouse.y,
  500
);

gradient.addColorStop(0, "rgba(255,138,0,0.08)");
gradient.addColorStop(1, "rgba(255,138,0,0)");

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, width, height);

  drawAurora(0, 0.12);
  drawAurora(1.5, 0.08);
  drawAurora(3, 0.06);

  requestAnimationFrame(animate);
}

animate();