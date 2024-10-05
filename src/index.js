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
    color = "rgba(160,192,207,0.7)"
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

class Iceberg {
  constructor(points) {
    this.points = points;
  }
  move(x, y) {
    this.points.forEach((point) => {
      point.move(x, y);
    });
  }
}

class RandomPoint {
  constructor(xRange, yRange) {
    this.x = RandomPoint.randomRange(xRange);
    this.y = RandomPoint.randomRange(yRange);
  }
  move(x, y) {
    this.x += x;
    this.y += y;
  }
  static randomRange(range) {
    return Math.random() * (range.max - range.min) + range.min;
  }
}

class Range {
  constructor(min, max) {
    this.min = min;
    this.max = max;
  }
  static defaultPlus(base, addedPercent) {
    return new Range(base, base + base / addedPercent);
  }
  static defaultMinus(base, minusPercent) {
    return new Range(base - base / minusPercent, base);
  }
}

canvas.addEventListener("click", () => {
  blueWave.toggleMotion();
  transparentWave.toggleMotion();
});

const iceberg = new Iceberg([
  new RandomPoint(
    Range.defaultPlus(canvas.width * 0.5, 10),
    Range.defaultPlus(canvas.height * 0.2, 10)
  ),
  new RandomPoint(
    Range.defaultPlus(canvas.width * 0.25, 10),
    Range.defaultPlus(canvas.height * 0.5, 10)
  ),
  new RandomPoint(
    Range.defaultPlus(canvas.width * 0.5, 10),
    Range.defaultMinus(canvas.height, 10)
  ),
  new RandomPoint(
    Range.defaultPlus((canvas.width * 3) / 4, 10),
    Range.defaultPlus(canvas.height / 2, 10)
  ),
]);

draw();

function draw() {
  drawCanvas(canvas, ctx);
  drawIceberg(ctx, iceberg);
  drawWave(ctx, canvas, blueWave, Math.sin);
  drawWave(ctx, canvas, transparentWave, Math.cos);

  blueWave.update();
  transparentWave.update();
  iceberg.move(0, Math.sin(blueWave.phase) * 0.5);
  requestAnimationFrame(draw);
}

function drawCanvas(canvas, ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawIceberg(ctx, iceberg) {
  ctx.beginPath();
  for (let i = 0; i < iceberg.points.length; i++) {
    const point = iceberg.points[i];
    if (i === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  }
  ctx.closePath();
  ctx.fillStyle = "rgba(255,255,255,1)";
  ctx.fill();
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
