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

const state = new WaveState();

draw();

function draw() {
  drawCanvas(canvas, ctx);
  drawWave(ctx, canvas, state);

  state.update();
  requestAnimationFrame(draw);
}

canvas.addEventListener("click", () => {
  state.toggleMotion();
});

function drawCanvas(canvas, ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawWave(ctx, canvas, state) {
  ctx.beginPath();

  ctx.moveTo(0, canvas.height / 2);

  for (let x = 0; x < canvas.width; x++) {
    const y = calcPixelHeightIndex(state, x, canvas.height / 2);
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

function calcPixelHeightIndex(state, x, baseHeight) {
  return state.height * Math.sin(x * state.length + state.phase) + baseHeight;
}
