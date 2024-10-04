const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const WAVE_COLOR = "rgba(160,192,207,1)";

// click したら徐々に止まってほしくて、最後は一直線になるようにしてほしい
// 止まった後に再度クリックすると再開するようにしたい

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let waveHeight = 50; // 波の高さ
let waveLength = 0.002; // 波の長さ
let waveSpeed = 0.05; // 波の速度
let phase = 0;
let onStop = false;

function drawWave() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 波を描画
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);

  for (let x = 0; x < canvas.width; x++) {
    const y = waveHeight * Math.sin(x * waveLength + phase) + canvas.height / 2;
    ctx.lineTo(x, y);
  }

  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.closePath();

  // 波の塗りつぶし
  ctx.fillStyle = WAVE_COLOR; // 外部で定義された色を使用
  ctx.fill();

  // 波の淵（境界線）を白色で描画
  ctx.strokeStyle = "white"; // 淵の色
  ctx.lineWidth = 2; // 淵の太さ
  ctx.stroke();
  phase += waveSpeed; // フェーズを進める
  if (onStop) {
    waveHeight *= 0.99; // 徐々に減速
  }

  // アニメーションが実行中の場合
  // if (isAnimating) {
  //   phase += waveSpeed; // フェーズを進める
  //   waveSpeed *= 0.99; // 徐々に減速

  //   // 一定の速度以下になったら一直線にする
  //   if (Math.abs(waveSpeed) < 0.001) {
  //     isAnimating = false; // フェーズの動きを止める
  //     isStopped = true; // 波を一直線にする
  //     waveSpeed = 0; // 完全に0にする
  //   }
  // }

  requestAnimationFrame(drawWave);
}

// クリックイベントを設定
canvas.addEventListener("click", () => {
  console.log("click");
  onStop = !onStop;
});

drawWave();
