class WaveMotion {
  constructor() {
    this.isStop = false;
  }
  toggle() {
    this.isStop = !this.isStop;
  }
}

class WaveState {
  constructor(
    height = 50,
    length = 0.002,
    speed = 0.05,
    phase = 0,
    motion = new WaveMotion(),
    color = "rgba(160,192,207,1)"
  ) {
    this.height = height;
    this.maxHeight = height;
    this.length = length;
    this.speed = speed;
    this.phase = phase;
    this.motion = motion;
    this.color = color;
  }
  update() {
    if (this.motion.isStop) {
      this.height *= 0.99;
    }
    if (!this.motion.isStop && this.height < this.maxHeight) {
      this.height *= 1.01;
    }
    this.phase += this.speed;
  }
  toggleMotion() {
    this.motion.toggle();
  }
}

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

const blueWave = new WaveState();
const transparentWave = new WaveState(
  50,
  0.002,
  0.05,
  0,
  new WaveMotion(),
  "rgba(160,192,207,0.5)"
);

canvas.addEventListener("click", () => {
  blueWave.toggleMotion();
  transparentWave.toggleMotion();
});

draw();

function draw() {
  drawCanvas(canvas, ctx);
  drawWave(ctx, canvas, blueWave, Math.sin);
  drawWave(ctx, canvas, transparentWave, Math.cos);

  blueWave.update();
  transparentWave.update();
  requestAnimationFrame(draw);
}

function drawCanvas(canvas, ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawWave(ctx, canvas, state, mathFunc) {
  ctx.beginPath();

  ctx.moveTo(0, canvas.height / 2);

  for (let x = 0; x < canvas.width; x++) {
    const y = calcPixelHeightIndex(state, x, canvas.height / 2, mathFunc);
    ctx.lineTo(x, y);
  }

  // 画面下端への直線
  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.closePath();

  // 波の塗りつぶし
  ctx.fillStyle = state.color;
  ctx.fill();

  // 波の淵（境界線）を白色で描画
  ctx.strokeStyle = "white"; // 淵の色
  ctx.lineWidth = 2; // 淵の太さ
  ctx.stroke();
}

function calcPixelHeightIndex(state, x, baseHeight, mathFunc) {
  return state.height * mathFunc(x * state.length + state.phase) + baseHeight;
}
