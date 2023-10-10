const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const rectWidth = 50;
const rectHeight = 100;

let rectX = 20,
  rectY = canvas.height - rectHeight,
  jumping = false,
  canJump = true,
  jumpHeight = 150,
  jumpStartY = rectY,
  jumpTimer = 0,
  gravity = 5,
  moveX = 0;
let width = 30,
  height = 50,
  posiçaoY = canvas.height - 50,
  movi = 2;

const tartarugaImg = new Image();
tartarugaImg.src = "./tg.jpg";
const img = new Image();
img.src =
  "https://1.bp.blogspot.com/-2-k-QUZn7jI/UNx5Vs4c-AI/AAAAAAAANUk/7qBQy-QLwAE/s1600/74b7ca768630c4d24968a1a2b0bb875a.png";

// Array para armazenar obstáculos
const obstacles = [];

// Função para adicionar um obstáculo ao array
function addObstacle(x) {
  obstacles.push({ x, y: canvas.height - height, width, height, speed: movi });
}

// Adicione obstáculos ao array
addObstacle(200);
addObstacle(500);
addObstacle(900);

function update() {
  rectX += moveX;

  if (jumping) {
    jumpTimer++;
    rectY -= jumpHeight / 15;
    if (jumpTimer >= 15 || rectY <= jumpStartY - jumpHeight) {
      jumping = false;
      jumpTimer = 0;
    }
  } else if (rectY < canvas.height - rectHeight) {
    rectY += gravity;
  }

  if (rectX < 0) {
    rectX = 0;
  } else if (rectX + rectWidth > canvas.width) {
    rectX = canvas.width - rectWidth;
  }

  if (rectY >= canvas.height - rectHeight) {
    canJump = true;
    rectY = canvas.height - rectHeight;
  }

  // Variável para armazenar o índice do obstáculo atingido
  let obstacleHitIndex = -1;

  // Atualize a posição dos obstáculos e verifique a colisão com eles
  for (let i = 0; i < obstacles.length; i++) {
    const obstacle = obstacles[i];
    obstacle.x -= obstacle.speed; // Mova o obstáculo para a esquerda

    // Se o obstáculo saiu completamente do canvas, coloque-o novamente no final
    if (obstacle.x + width < 0) {
      obstacle.x = canvas.width;
    }

    if (
      checkPlayerOnTopOfObstacle(
        rectX,
        rectY,
        rectWidth,
        rectHeight,
        obstacle.x,
        obstacle.y,
        obstacle.width,
        obstacle.height
      )
    ) {
      // O jogador está em cima do obstáculo
      // Registre o índice do obstáculo atingido
      obstacleHitIndex = i;
    }

    if (
      checkCollision(
        rectX,
        rectY,
        rectWidth,
        rectHeight,
        obstacle.x,
        obstacle.y,
        obstacle.width,
        obstacle.height
      )
    ) {
      moveX = 0;
      rectX = obstacle.x - rectWidth;
    }
  }

  // Verifique se o jogador atingiu um obstáculo específico
  if (obstacleHitIndex !== -1) {
    // Remova o obstáculo atingido do array de obstáculos
    obstacles.splice(obstacleHitIndex, 1);
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRect();
  drawObstacles();
  requestAnimationFrame(update);
}

// Função para verificar se o jogador está em cima do obstáculo
function checkPlayerOnTopOfObstacle(
  playerX,
  playerY,
  playerWidth,
  playerHeight,
  obstacleX,
  obstacleY,
  obstacleWidth,
  obstacleHeight
) {
  const bottomPlayer = playerY + playerHeight;
  const topObstacle = obstacleY;

  return (
    playerX < obstacleX + obstacleWidth &&
    playerX + playerWidth > obstacleX &&
    playerY < obstacleY + obstacleHeight &&
    bottomPlayer > topObstacle
  );
}

// Função para verificar colisão entre dois retângulos
function checkCollision(
  rect1X,
  rect1Y,
  rect1Width,
  rect1Height,
  rect2X,
  rect2Y,
  rect2Width,
  rect2Height
) {
  return (
    rect1X < rect2X + rect2Width &&
    rect1X + rect1Width > rect2X &&
    rect1Y < rect2Y + rect2Height &&
    rect1Y + rect1Height > rect2Y
  );
}

// Função para desenhar o retângulo do jogador
function drawRect() {
  ctx.drawImage(img, rectX, rectY, rectWidth, rectHeight);
}

// Função para desenhar os obstáculos
function drawObstacles() {
  for (const obstacle of obstacles) {
    ctx.drawImage(tartarugaImg, obstacle.x, obstacle.y, width, height);
  }
}

// Event listeners para movimento do jogador
window.addEventListener("keydown", (event) => {
  if (event.key === " " && canJump) {
    jumping = true;
    jumpStartY = rectY;
    canJump = false;
  }

  if (event.key === "ArrowLeft") {
    moveX = -5;
  }

  if (event.key === "ArrowRight") {
    moveX = 5;
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    moveX = 0;
  }
});

img.onload = () => {
  update();
};
