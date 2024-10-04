const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let waveHeight = 50; // 波の高さ
let waveLength = 0.02; // 波の長さ
let waveSpeed = 0.05; // 波の速度
let phase = 0;

function drawWave() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);

  for (let x = 0; x < canvas.width; x++) {
    const y = waveHeight * Math.sin(x * waveLength + phase) + canvas.height / 2;
    ctx.lineTo(x, y);
  }

  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.closePath();

  ctx.fillStyle = "rgba(0, 255, 255, 0.5)"; // 波の色
  ctx.fill();

  phase += waveSpeed;
  requestAnimationFrame(drawWave);
}

drawWave();
