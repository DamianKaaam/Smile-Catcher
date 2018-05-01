// Canvas settings
var myCanvas = document.getElementById('game');
var ctx = myCanvas.getContext('2d');

myCanvas.width = 700;
myCanvas.height = 500;

// Variables and object
var cW = myCanvas.width;
var cH = myCanvas.height;

var life = 3;

var player = {
   color: '#64b7ff',
   x: 0,
   y: 0,
   radius: 16,
   score: 0
}

// FUNCTIONS - DRAW

// Player
function playerDraw() {
   ctx.beginPath();
   ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
   ctx.fillStyle = player.color;
   ctx.fill();
   ctx.closePath();
}

// Faces
function facesDraw(faceType, y, bool) {
   ctx.beginPath();
   ctx.arc(faceType.x, faceType.y, faceType.radius, 0, Math.PI * 2);
   ctx.fillStyle = faceType.color;
   ctx.fill();
   ctx.moveTo(faceType.x - 6, faceType.y - 2);
   ctx.arc(faceType.x - 6, faceType.y - 2, 1, 0, Math.PI * 2);
   ctx.moveTo(faceType.x + 6, faceType.y - 2);
   ctx.arc(faceType.x + 6, faceType.y - 2, 1, 0, Math.PI * 2);
   ctx.moveTo(faceType.x + 6, faceType.y + y);
   ctx.arc(faceType.x, faceType.y + y, 6, 0, Math.PI, bool);
   ctx.stroke();
}

// Informations
function infoDraw() {
   ctx.font = "22px Indie Flower";
   ctx.fillStyle = "#64b7ff";
   ctx.textAlign = "left";
   ctx.fillText("Score : " + player.score, 20, 30);
   ctx.textAlign = "right";
   ctx.fillText("Your life : " + life, cW - 20, 30);
}

// FUNCTIONS - GAME

// Random numbers
function randomNum(min, max) {
   return Math.floor(Math.random() * (max - min + 1) + min)
}

// Movement
function faceMove(faceType) {
   faceType.x += faceType.offset.x;
   faceType.y += faceType.offset.y;
}

// Wall blocker
function wallBlocker(faceType) {
   if (faceType.x - faceType.radius <= 0 ||
      faceType.x + faceType.radius >= cW) {
      faceType.offset.x = -faceType.offset.x
   }
}

// Collisions detector
function hit(faceType, player) {
   var x = player.x - faceType.x;
   var y = player.y - faceType.y;
   var r = faceType.radius + player.radius;
   return (x * x + y * y <= (r * r) / 2);
}

// FUNCTIONS - EVENT

// Onload
function load() {
   ctx.font = "28px Indie Flower";
   ctx.fillStyle = "#000";
   ctx.textAlign = "center";
   ctx.fillText("Catch only :)", cW / 2, 110);
   ctx.fillText("Avoid :(", cW / 2, 170);
   ctx.fillText("If you don't catch three :)", cW / 2, 230);
   ctx.fillText("you will lose", cW / 2, 260);
   ctx.font = "40px Indie Flower";
   ctx.fillStyle = "#000";
   ctx.textAlign = "center";
   ctx.fillText("Press ENTER to start", cW / 2, 370);
}

// Start
function start(e) {
   if (e.keyCode == 13) {
      game();
   }
   window.removeEventListener('keydown', start);
}

// Try again
function refresh(e) {
   if (e.keyCode == 32) {
      location.reload();
   }
}

// Player movement
function playerMove(e) {
   player.x = e.clientX - myCanvas.offsetLeft;
   player.y = e.clientY - myCanvas.offsetTop;
}

// Events
window.addEventListener('load', load);
window.addEventListener('keydown', start);
window.addEventListener('keydown', refresh);
myCanvas.addEventListener('mousemove', playerMove);

// Arrays
var smileArray = [];
var sadArray = [];

// MAIN FUNCTION
function game() {
   ctx.clearRect(0, 0, cW, cH);

   infoDraw();
   playerDraw();

   // Smile object
   smileArray.push({
      color: '#e0b118',
      x: randomNum(20, 680),
      y: 0,
      radius: 16,
      offset: {
         x: randomNum(-5, 5),
         y: 2
      }
   });

   // Game over
   if (life == 0) {
      ctx.font = "40px Indie Flower";
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.fillText("You missed three :)", cW / 2, 120);
      ctx.font = "28px Indie Flower";
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.fillText("Press SPACE to try again", cW / 2, 155);
      return;
   }

   for (var i = 0; i < smileArray.length; i += 30) {
      var smile = smileArray[i];

      // Drawing
      facesDraw(smile, 4, false);

      // Movement
      faceMove(smile);

      // Wall blocker
      wallBlocker(smile);

      // Collisions
      if (hit(smile, player)) {
         smile.offset.x = 0;
         smile.offset.y = -1000000;
         player.score++;
      }

      // Fail catch
      if (smile.y - smile.radius - 5 >= cH) {
         smile.offset.y = -1000000;
         life--;
      }
   }

   // Sad object
   sadArray.push({
      color: '#e01818',
      x: randomNum(20, 680),
      y: 0,
      radius: 16,
      offset: {
         x: randomNum(-10, 10),
         y: 2
      }
   });

   for (var i = 0; i < sadArray.length; i += 70) {
      var sad = sadArray[i];

      // Drawing
      facesDraw(sad, 9, true);

      // Movement
      faceMove(sad);

      // Wall blocker
      wallBlocker(sad);

      // Game over
      if (hit(sad, player)) {
         ctx.font = "40px Indie Flower";
         ctx.fillStyle = "#000";
         ctx.textAlign = "center";
         ctx.fillText("Don't touch :(", cW / 2, 120);
         ctx.font = "28px Indie Flower";
         ctx.fillStyle = "#000";
         ctx.textAlign = "center";
         ctx.fillText("Press SPACE to try again", cW / 2, 155);
         return;
      }
   }

   requestAnimationFrame(game);
}