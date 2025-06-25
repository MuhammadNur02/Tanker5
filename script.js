const enemies = document.querySelectorAll(".enemy");
const bullet = document.getElementById("bullet");
const status = document.getElementById("status");
const shootSound = document.getElementById("shootSound");
const bgMusic = document.getElementById("bgMusic");
const explosion = document.getElementById("explosion");
const player = document.getElementById("player");
const boss = document.getElementById("boss");
const powerUp = document.getElementById("powerUp");
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");
const radar = document.getElementById("radar");
const ctx = radar.getContext("2d");

let score = 0;
let lives = 3;
let level = 1;
let speed = 3;
let bossHP = 10;
let playerY = 20;

const enemyImages = [
  "https://cdn-icons-png.flaticon.com/512/686/686589.png",
  "https://cdn-icons-png.flaticon.com/512/616/616408.png",
  "https://cdn-icons-png.flaticon.com/512/616/616410.png",
];

function startGame() {
  startScreen.style.display = "none";
}

function updateStatus() {
  let highScore = localStorage.getItem("highScore") || 0;
  if (score > highScore) localStorage.setItem("highScore", score);
  status.innerText = `Score: ${score} | Lives: ${lives} | Level: ${level} | High Score: ${localStorage.getItem(
    "highScore"
  )}`;
  document.body.style.filter =
    level % 2 === 0 ? "brightness(0.5)" : "brightness(1)";
}

function moveEnemies() {
  enemies.forEach((enemy, i) => {
    let pos = window.innerWidth;
    enemy.style.top = `${100 + i * 120}px`;
    enemy.style.backgroundImage = `url(${enemyImages[i % enemyImages.length]})`;

    setInterval(() => {
      if (pos < -60) {
        lives--;
        updateStatus();
        pos = window.innerWidth;
        if (lives <= 0) {
          finalScore.innerText = `Skor Akhir: ${score}`;
          gameOverScreen.style.display = "flex";
        }
      } else {
        pos -= speed;
        enemy.style.right = `${pos}px`;
      }
    }, 30);
  });
}

function fireBullet() {
  let bulletPos = 80;
  bullet.style.display = "block";
  bullet.style.bottom = `${playerY + 30}px`;
  bullet.style.left = `${bulletPos}px`;
  shootSound.play();

  const interval = setInterval(() => {
    if (bulletPos > window.innerWidth) {
      bullet.style.display = "none";
      clearInterval(interval);
    } else {
      bulletPos += 10;
      bullet.style.left = `${bulletPos}px`;

      enemies.forEach((enemy) => {
        const eRect = enemy.getBoundingClientRect();
        const bRect = bullet.getBoundingClientRect();
        if (
          bRect.left < eRect.right &&
          bRect.right > eRect.left &&
          bRect.top < eRect.bottom &&
          bRect.bottom > eRect.top
        ) {
          explosion.style.left = enemy.offsetLeft + "px";
          explosion.style.top = enemy.offsetTop + "px";
          explosion.style.display = "block";
          setTimeout(() => (explosion.style.display = "none"), 300);
          score += 10;
          enemy.style.right = "-60px";
          clearInterval(interval);
          bullet.style.display = "none";
          if (score % 50 === 0) {
            level++;
            speed++;
          }
          updateStatus();
        }
      });

      if (boss.style.display === "block") {
        const bossRect = boss.getBoundingClientRect();
        const bRect = bullet.getBoundingClientRect();
        if (
          bRect.left < bossRect.right &&
          bRect.right > bossRect.left &&
          bRect.top < bossRect.bottom &&
          bRect.bottom > bossRect.top
        ) {
          bossHP--;
          if (bossHP <= 0) {
            boss.style.display = "none";
            score += 100;
            updateStatus();
          }
        }
      }
    }
  }, 10);
}

document.getElementById("shootBtn").addEventListener("click", fireBullet);

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") fireBullet();
  if (e.code === "ArrowUp") {
    playerY = Math.max(0, playerY - 20);
    player.style.bottom = `${playerY}px`;
  } else if (e.code === "ArrowDown") {
    playerY = Math.min(window.innerHeight - 100, playerY + 20);
    player.style.bottom = `${playerY}px`;
  }
});

setInterval(() => {
  if (level % 5 === 0 && boss.style.display === "none") {
    boss.style.top = `${Math.random() * 300 + 50}px`;
    boss.style.right = "-100px";
    boss.style.display = "block";
    bossHP = 10;
  }
}, 5000);

setInterval(() => {
  powerUp.style.top = `${Math.random() * 400 + 50}px`;
  powerUp.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
  powerUp.style.display = "block";
  setTimeout(() => (powerUp.style.display = "none"), 5000);
}, 15000);

powerUp.addEventListener("click", () => {
  lives++;
  updateStatus();
  powerUp.style.display = "none";
});

function updateRadar() {
  ctx.clearRect(0, 0, radar.width, radar.height);
  enemies.forEach((enemy) => {
    let x = parseInt(enemy.style.right) || 0;
    let y = parseInt(enemy.style.top) || 0;
    ctx.fillStyle = "red";
    ctx.fillRect(120 - x / 10, y / 10, 5, 5);
  });
}
setInterval(updateRadar, 200);

updateStatus();
moveEnemies();
