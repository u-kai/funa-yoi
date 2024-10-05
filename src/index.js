const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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
      //if (this.height === 0) {
      //  this.height = 10;
      //}
      this.height *= 1.01;
    }
    this.phase += this.speed;
  }
  toggleMotion() {
    this.motion.toggle();
  }
}

const state = new WaveState();

function drawWave() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 波を描画
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);

  for (let x = 0; x < canvas.width; x++) {
    const y = calcPixelIndex(state, x, canvas.height / 2);
    ctx.lineTo(x, y);
  }

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

  state.update();
  requestAnimationFrame(drawWave);
}

// クリックイベントを設定
canvas.addEventListener("click", () => {
  console.log("click");
  state.toggleMotion();
});

drawWave();

function calcPixelIndex(state, x, baseHeight) {
  return state.height * Math.sin(x * state.length + state.phase) + baseHeight;
}
