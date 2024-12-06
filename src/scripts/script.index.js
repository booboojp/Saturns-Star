/*
 * Copyright (c) 2022 booboojp
 * All rights reserved.
 */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const prideColors = [
  "#FF0000",
  "#FF8C00",
  "#FFFF00",
  "#008000",
  "#0000FF",
  "#8B00FF",
];

const dots = [];

function createDot() {
  const dot = {
    x: Math.random() * canvas.width,
    y: 0,
    radius: Math.random() * 5 + 2,
    color: prideColors[Math.floor(Math.random() * prideColors.length)],
    speed: Math.random() * 3 + 2,
    opacity: 1,
  };
  dots.push(dot);
}

function updateDots() {
  for (let i = dots.length - 1; i >= 0; i--) {
    const dot = dots[i];
    dot.y += dot.speed * 0.62;
    dot.opacity -= 0.001;

    if (dot.opacity <= 0) {
      dots.splice(i, 1);
    }
  }
}

function drawDots() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  dots.forEach((dot) => {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${hexToRgb(dot.color)},${dot.opacity})`;
    ctx.fill();
  });
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r},${g},${b}`;
}

function animate() {
  createDot();
  updateDots();
  drawDots();
  requestAnimationFrame(animate);
}

animate();

const lines = document.querySelectorAll(".line");
lines.forEach((line, index) => {
  line.style.color = prideColors[index % prideColors.length];
  const randomStart = Math.random() * 120;
  line.style.background = `linear-gradient(${randomStart}deg, #ef5350, #f48fb1, #7e57c2, #2196f3, #26c6da, #43a047, #eeff41, #f9a825, #ff5722)`;
  line.style.webkitBackgroundClip = "text";
  line.style.backgroundClip = "text";
  line.style.webkitTextFillColor = "transparent";
  line.style.textFillColor = "transparent";
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        entry.target.classList.remove("visible");
      }
    });
  },
  { threshold: 0.1 }
);

lines.forEach((line) => {
  observer.observe(line);
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
function initGrid() {
  const gridContainer = document.createElement('div');
  gridContainer.id = 'grid-background';
  document.body.prepend(gridContainer);

  const columns = Math.floor(window.innerWidth / 50);
  const rows = Math.floor(window.innerHeight / 50);
  const total = rows * columns;

  for (let i = 0; i < total; i++) {
    const gridItem = document.createElement('div');
    gridItem.className = 'grid-item';
    gridItem.id = `grid-${i}`;
    gridContainer.appendChild(gridItem);
  }

  function createPulse(clickX, clickY) {
    const items = document.querySelectorAll('.grid-item');
    const randomColor = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`;
    
    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const itemCenterX = rect.left + rect.width/2;
      const itemCenterY = rect.top + rect.height/2;
      
      const distance = Math.sqrt(
        Math.pow(itemCenterX - clickX, 2) + 
        Math.pow(itemCenterY - clickY, 2)
      );

      anime({
        targets: item,
        backgroundColor: [
          { value: randomColor, duration: 500, delay: distance },
          { value: '#ffffff', duration: 500, delay: 500 + distance }
        ],
        easing: 'easeInOutQuad'
      });
    });
  }

  gridContainer.addEventListener('click', (e) => {
    createPulse(e.clientX, e.clientY);
  });

  setTimeout(() => {
    createPulse(window.innerWidth/2, window.innerHeight/2);
  }, 1000);
}
window.addEventListener('resize', () => {
  const gridContainer = document.getElementById('grid-background');
  if (gridContainer) {
    gridContainer.innerHTML = '';
    initGrid();
  }
});
initGrid();
