class MovingPosition {
  constructor(x, y, moveFunc) {
    this.x = x;
    this.y = y;
    this.initialX = x;
    this.initialY = y;
    this.moveFunc = moveFunc;
  }
  update() {
    this.moveFunc(this);
  }
}

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

class WaveDrawer {
  constructor(state, mathFunc, drewWidth, drewHeight) {
    this.state = state;
    this.mathFunc = mathFunc;
    this.drewWidth = drewWidth;
    this.drewHeight = drewHeight;
  }
  draw(ctx, canvas) {
    ctx.beginPath();

    ctx.moveTo(0, this.drewHeight);

    for (let x = 0; x < canvas.width; x++) {
      const position = new MovingPosition(
        x,
        this.drewHeight,
        moveByWave(this.state, this.mathFunc)
      );
      position.update();
      ctx.lineTo(position.x, position.y);
    }

    // 画面下端への直線
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();

    // 波の塗りつぶし
    ctx.fillStyle = this.state.color;
    ctx.fill();

    // 波の淵（境界線）を白色で描画
    ctx.strokeStyle = "white"; // 淵の色
    ctx.lineWidth = 2; // 淵の太さ
    ctx.stroke();
  }
  update() {
    this.state.update();
  }
  toggleMotion() {
    this.state.toggleMotion();
  }
}

function moveByWaveWithStaticX(waveState, mathFunc, x) {
  return (position) => {
    position.y =
      position.initialY +
      waveState.height * mathFunc(x * waveState.length + waveState.phase);
  };
}
function moveByWave(waveState, mathFunc) {
  return (p) => moveByWaveWithStaticX(waveState, mathFunc, p.x)(p);
}

class ImageDrawer {
  constructor(
    url,
    window,
    distanceFromCenterX,
    distanceFromCenterY,
    scale = 1,
    moveFunc
  ) {
    this.image = new Image();
    this.image.src = url;

    this.image.onload = () => {
      const centerX = window.innerWidth / 2 - (this.image.width * scale) / 2;
      const centerY = window.innerHeight / 2 - (this.image.height * scale) / 2;
      this.position = new MovingPosition(
        centerX + distanceFromCenterX,
        centerY + distanceFromCenterY,
        moveFunc
      );
      this.image.width = this.image.width * scale;
      this.image.height = this.image.height * scale;
    };
  }
  draw(ctx) {
    if (this.hasLoaded()) {
      ctx.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.image.width,
        this.image.height
      );
    }
  }
  update() {
    this.position?.update();
  }
  hasLoaded() {
    return this.image.complete && this.position;
  }
}

class CloudDrawer {
  constructor(url, window) {
    this.image = new Image();
    this.image.src = url;

    const scale = Math.random() * 0.5 + 0.5;
    this.scale = scale;

    this.position = new MovingPosition(
      Math.random() * window.innerWidth,
      Math.random() * (window.innerHeight / 6),
      (pos) => this.moveCloud(pos)
    );

    this.image.onload = () => {
      this.image.width = this.image.width * this.scale;
      this.image.height = this.image.height * this.scale;
    };
  }

  moveCloud(position) {
    position.x -= 0.3;

    if (position.x < -this.image.width) {
      position.x = window.innerWidth;
      position.y = Math.random() * (window.innerHeight / 6);
    }
  }

  draw(ctx) {
    if (this.image.complete) {
      ctx.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.image.width,
        this.image.height
      );
    }
  }

  update() {
    this.position.update();
  }
}

const clouds = [
  new CloudDrawer("static/cloud1.png", window),
  new CloudDrawer("static/cloud2.png", window),
];

// TODO
class Temperature {
  constructor() {
    this.temperature = 20;
  }
}

const canvas = document.getElementById("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

canvas.addEventListener("click", () => {
  blueWave.toggleMotion();
  transparentWave.toggleMotion();
});

const blueWave = new WaveDrawer(
  new WaveState(30, 0.002, 0.05),
  Math.sin,
  canvas.width,
  canvas.height / 2
);
const transparentWave = new WaveDrawer(
  new WaveState(30, 0.002, 0.05, 0, new WaveMotion(), "rgba(160,192,207,0.3)"),
  Math.cos,
  canvas.width,
  canvas.height / 2
);

const centerIceberg = new ImageDrawer(
  "static/center-iceberg.png",
  window,
  0,
  0,
  1.5,
  moveByWaveWithStaticX(blueWave.state, blueWave.mathFunc, 0)
);
const rightIceberg = new ImageDrawer(
  "static/right-iceberg.png",
  window,
  300,
  0,
  1.5,
  moveByWave(blueWave.state, blueWave.mathFunc)
);
const leftIceberg = new ImageDrawer(
  "static/left-iceberg.png",
  window,
  -150,
  0,
  1.5,
  moveByWave(blueWave.state, blueWave.mathFunc)
);

const bear1 = new ImageDrawer(
  "static/bear1.svg",
  window,
  50,
  -250,
  0.3,
  moveByWaveWithStaticX(blueWave.state, blueWave.mathFunc, 0)
);
const bear2 = new ImageDrawer(
  "static/bear2.svg",
  window,
  -70,
  -200,
  0.3,
  moveByWaveWithStaticX(blueWave.state, blueWave.mathFunc, 0)
);

const penguin1 = new ImageDrawer(
  "static/penguin1.svg",
  window,
  -180,
  350,
  0.2,
  (p) => {}
);

const penguin2 = new ImageDrawer(
  "static/penguin2.svg",
  window,
  -150,
  300,
  0.2,
  (p) => {}
);

const temperature = new Temperature();

function drawCanvas(canvas, ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
  drawCanvas(canvas, ctx);
  blueWave.draw(ctx, canvas);
  transparentWave.draw(ctx, canvas);

  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Temperature: " + temperature.temperature + "°C", 100, 100);

  clouds.forEach((cloud) => {
    cloud.draw(ctx);
    cloud.update();
  });

  rightIceberg.draw(ctx);
  leftIceberg.draw(ctx);
  centerIceberg.draw(ctx);
  bear1.draw(ctx);
  bear2.draw(ctx);
  penguin1.draw(ctx);
  penguin2.draw(ctx);

  blueWave.update();
  transparentWave.update();
  centerIceberg.update();
  rightIceberg.update();
  leftIceberg.update();
  bear1.update();
  bear2.update();
  penguin1.update();
  penguin2.update();

  requestAnimationFrame(draw);
}

draw();
