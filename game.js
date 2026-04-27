const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
  x: 50, y: 30, width: 40, height: 50, color: '#FF4500',
  velocityY: 0, isJumping: false
};

const obstacles = [];
let score = 0;
let gameSpeed = 10;
let gameRunning = true;

function createObstacle() {
  obstacles.push({
    x: canvas.width, y: 320, width: 30, height: 80, color: '#8b1313'
  });
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !player.isJumping && gameRunning) {
    player.velocityY = -15;
    player.isJumping = true;
  }

if (e.code === 'KeyR' && gameRunning) {
  resetGame();
}

if (e.code == 'KeyR' && !gameRunning) {
  resetGame();
}

if (e.code == 'KeyT') {
  addPoints();
}
});

function addPoints() {
  score += 1000;
}

function resetGame() {
  player.y = 300;
  player.velocityY = 0;
  player.isJumping = false;
  obstacles.length = 0;
  
  // ← ADICIONE:
  //obstacles.push(
  //  {x: canvas.width, y: 320, width: 30, height: 80, color: '#8b1313'},
  //  {x: canvas.width, y: 220, width: 30, height: 200, color: '#138b85'},
  //  {x: canvas.width, y: 320, width: 30, height: 80, color: '#8b8913'},
  //  {x: canvas.width, y: 320, width: 30, height: 80, color: '#25138b'}
  //);
  
  score = 0;
  gameSpeed = 10;
  gameRunning = true;
}

// Loop principal do jogo (60 FPS)
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameRunning) {
    // Atualiza jogador (gravidade e pulo)
    player.y += player.velocityY;
    player.velocityY += 0.8; // Gravidade
    if (player.y > 300) {
      player.y = 300;
      player.velocityY = 0;
      player.isJumping = false;
    }

    // Atualiza obstáculos
    obstacles.forEach((obs, index) => {
      obs.x -= gameSpeed;
      if (obs.x + obs.width < 0) obstacles.splice(index, 1);
    });

    if (Math.random() < 0.01) obstacles.push(
    {x: canvas.width, y: 320, width: 30, height: 80, color: '#8b1313'},
  );

   if (Math.random() < 0.0025) obstacles.push(
    {x: canvas.width, y: 220, width: 30, height: 180, color: '#138b85'},
  );

   if (Math.random() < 0.005) obstacles.push(
    {x: canvas.width, y: 320, width: 30, height: 80, color: '#8b8913'},
  );

   if (Math.random() < 0.0075) obstacles.push(
    {x: canvas.width, y: 320, width: 30, height: 80, color: '#25138b'}
  );

//      obstacles.push(
//    {x: canvas.width, y: 320, width: 30, height: 80, color: '#8b1313'},
//    {x: canvas.width, y: 220, width: 30, height: 200, color: '#138b85'},
//    {x: canvas.width, y: 320, width: 30, height: 80, color: '#8b8913'},
//    {x: canvas.width, y: 320, width: 30, height: 80, color: '#25138b'}
//  );

    // Gera novos obstáculos
    //if (Math.random() < 0.01) createObstacle();

    // Colisão
    obstacles.forEach(obs => {
      if (player.x < obs.x + obs.width &&
          player.x + player.width > obs.x &&
          player.y < obs.y + obs.height &&
          player.y + player.height > obs.y) {
        gameRunning = false;
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over! Score: ' + score, canvas.width/2, canvas.height/2);
        return;
      }
    });

    score += 1;
    gameSpeed += 0.001; // Aumenta dificuldade
  }

  // Desenha chão (scroll infinito)
  ctx.fillStyle = '#228B22';
  ctx.fillRect(0, 350, canvas.width, 100);
  ctx.fillRect((score * 0.5) % 100 - 100, 370, 100, 30);
  ctx.fillRect((score * 0.5) % 100, 370, 100, 30);

  // Desenha jogador
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Desenha obstáculos
  obstacles.forEach(obs => {
    ctx.fillStyle = obs.color;
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  });

  // Score
  ctx.fillStyle = 'black';
  ctx.font = '24px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Score: ' + Math.floor(score / 10), 40, 580);

  requestAnimationFrame(gameLoop);
}

gameLoop();
