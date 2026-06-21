const canvas = document.getElementById("spaceCanvas");
const ctx = canvas.getContext("2d");

let width, height;

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const stars = [];
const particles = [];
const STAR_COUNT = 200;

const mouse = {
  x: width / 2,
  y: height / 2
};

// Desktop
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;

  for (let i = 0; i < 4; i++) {
    particles.push(new Particle(mouse.x, mouse.y));
  }
});

// Mobile
window.addEventListener("touchmove", (e) => {
  mouse.x = e.touches[0].clientX;
  mouse.y = e.touches[0].clientY;

  for (let i = 0; i < 4; i++) {
    particles.push(new Particle(mouse.x, mouse.y));
  }
});

class Star {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * width - width / 2;
    this.y = Math.random() * height - height / 2;
    this.z = Math.random() * width;
    this.size = Math.random() * 2;
  }

  update() {
    this.z -= 6;

    if (this.z <= 0) {
      this.reset();
      this.z = width;
    }
  }

  draw() {
    const sx = (this.x / this.z) * width + width / 2;
    const sy = (this.y / this.z) * height + height / 2;

    const radius = (1 - this.z / width) * 3;

    ctx.beginPath();
    ctx.arc(sx, sy, radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.26)";
    ctx.fill();
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.vx = (Math.random() - 0.5) * 4;
    this.vy = (Math.random() - 0.5) * 4;

    this.size = Math.random() * 5 + 2;
    this.life = 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    this.life -= 0.02;
    this.size *= 0.98;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 1);

    ctx.fillStyle = `rgba(255,138,0,${this.life})`;

    ctx.shadowBlur = 10;
    ctx.shadowColor = "#FF8A00";

    ctx.fill();

    ctx.shadowBlur = 0;
  }
}

for (let i = 0; i < STAR_COUNT; i++) {
  stars.push(new Star());
}

function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(0, 0, width, height);

  stars.forEach((star) => {
    star.update();
    star.draw();
  });

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();

    if (particles[i].life <= 0) {
      particles.splice(i, 1);
    }
  }

  requestAnimationFrame(animate);
}

animate();