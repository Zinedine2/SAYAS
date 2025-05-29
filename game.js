const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDiv = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');

const player = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 50,
  width: 80,
  height: 30,
  speed: 7,
  color: "#3a86ff"
};

const goodQualities = ["Paciente", "Creativo", "Empático", "Justo", "Innovador", "Responsable"];
const badQualities = ["Impuntual", "Grita", "Desorganizado", "Injusto", "Aburrido", "Desmotivado"];

let objects = [];
let score = 0;
let gameOver = false;

function randomQuality() {
  const isGood = Math.random() < 0.6; // 60% buenas, 40% malas
  if (isGood) {
    return {
      text: goodQualities[Math.floor(Math.random() * goodQualities.length)],
      good: true
    };
  } else {
    return {
      text: badQualities[Math.floor(Math.random() * badQualities.length)],
      good: false
    };
  }
}

function createObject() {
  const quality = randomQuality();
  const obj = {
    ...quality,
    x: Math.random() * (canvas.width - 100) + 20,
    y: -30,
    width: 90,
    height: 30,
    speed: 2 + Math.random() * 2
  };
  objects.push(obj);
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 18px Arial";
  ctx.textAlign = "center";
  ctx.fillText("TÚ", player.x + player.width / 2, player.y + 22);
}

function drawObjects() {
  for (let obj of objects) {
    ctx.fillStyle = obj.good ? "#06d6a0" : "#ef233c";
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    ctx.fillStyle = "#fff";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(obj.text, obj.x + obj.width / 2, obj.y + 20);
  }
}

function updateObjects() {
  for (let obj of objects) {
    obj.y += obj.speed;
  }
  // Colisión
  for (let i = objects.length - 1; i >= 0; i--) {
    const obj = objects[i];
    if (
      obj.y + obj.height > player.y &&
      obj.y < player.y + player.height &&
      obj.x + obj.width > player.x &&
      obj.x < player.x + player.width
    ) {
      if (obj.good) score++;
      else score--;
      objects.splice(i, 1);
    } else if (obj.y > canvas.height) {
      objects.splice(i, 1);
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawObjects();
}

function gameLoop() {
  if (gameOver) return;
  updateObjects();
  draw();
  scoreDiv.textContent = `Puntos: ${score}`;
  if (score < -5) {
    endGame();
    return;
  }
  requestAnimationFrame(gameLoop);
}

function endGame() {
  gameOver = true;
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(0, canvas.height / 2 - 50, canvas.width, 100);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 32px Arial";
  ctx.textAlign = "center";
  ctx.fillText("¡Juego Terminado!", canvas.width / 2, canvas.height / 2);
  ctx.font = "24px Arial";
  ctx.fillText(`Puntuación final: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
  restartBtn.style.display = "block";
}

let leftPressed = false;
let rightPressed = false;

document.addEventListener('keydown', (e) => {
  if (e.key === "ArrowLeft") leftPressed = true;
  if (e.key === "ArrowRight") rightPressed = true;
});
document.addEventListener('keyup', (e) => {
  if (e.key === "ArrowLeft") leftPressed = false;
  if (e.key === "ArrowRight") rightPressed = false;
});

function movePlayer() {
  if (leftPressed) player.x -= player.speed;
  if (rightPressed) player.x += player.speed;
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

setInterval(() => {
  if (!gameOver) createObject();
}, 1000);

function loop() {
  movePlayer();
  if (!gameOver) requestAnimationFrame(loop);
}

restartBtn.onclick = function() {
  score = 0;
  objects = [];
  gameOver = false;
  player.x = canvas.width / 2 - 40;
  restartBtn.style.display = "none";
  gameLoop();
  loop();
};

gameLoop();
loop();