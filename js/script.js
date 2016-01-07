function initializeGameZone() {
  var canvas,
      ctx,
      width = 600,
      height = 600,
      ship_x = (width / 2) - 25, ship_y = height - 75, ship_w = 50, ship_h = 50,
      rightKey = false,
      leftKey = false,
      upKey = false,
      downKey = false,
      enemyTotal = 5,
      enemies = [],
      enemy_x = 50,
      enemy_y = -45,
      enemy_w = 50,
      enemy_h = 50,
      speed = 3,
      enemy, ship,
      laserTotal = 7, 
      lasers = [],
      score = 0,
      alive = true,
      lives = 2,
      starfield, starX = 0, starY = 0, starY2 = -600,
      intervalspeed = 15;


  var snd = new Audio("./sounds/star_wars.mp3");
  snd.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
  }, false);
  snd.play();

  for (var i = 0; i < enemyTotal; i++) {
    enemies.push([enemy_x, enemy_y, enemy_w, enemy_h, speed]);
    enemy_x += enemy_w + 60;
  }

  function clearCanvas() {
    ctx.clearRect(0,0,width,height);
  }

  function drawStarfield() {
    ctx.drawImage(starfield,starX,starY);
    ctx.drawImage(starfield,starX,starY2);
    if (starY > 600) {
      starY = -599;
    }
    if (starY2 > 600) {
      starY2 = -599;
    }
    starY += 1;
    starY2 += 1;
  }

  function drawEnemies() {
    for (var i = 0; i < enemies.length; i++) {
      ctx.drawImage(enemy, enemies[i][0], enemies[i][1]);
    }
  }

  function drawShip() {
    if (rightKey) ship_x += 5;
    else if (leftKey) ship_x -= 5;
    if (upKey) ship_y -= 5;
    else if (downKey) ship_y += 5;
    if (ship_x <= 0) ship_x = 0;
    if ((ship_x + ship_w) >= width) ship_x = width - ship_w;
    if (ship_y <= 0) ship_y = 0;
    if ((ship_y + ship_h) >= height) ship_y = height - ship_h;
    ctx.drawImage(ship, ship_x, ship_y);
  }

  function moveEnemies() {
    for (var i = 0; i < enemies.length; i++) {
      if (enemies[i][1] < height) {
        enemies[i][1] += enemies[i][4];
      } else if (enemies[i][1] > height - 1) {
        enemies[i][1] = -45;
      }
    }
  }

  function drawLaser() {
    if (lasers.length)
      for (var i = 0; i < lasers.length; i++) {
        ctx.fillStyle = '#f00';
        ctx.fillRect(lasers[i][0],lasers[i][1],lasers[i][2],lasers[i][3])
      }
  }

  function moveLaser() {
    for (var i = 0; i < lasers.length; i++) {
      if (lasers[i][1] > -11) {
        lasers[i][1] -= 10;
      } else if (lasers[i][1] < -10) {
        lasers.splice(i, 1);
      }
    }
  }

  function hitTest() {
    var remove = false;
    for (var i = 0; i < lasers.length; i++) {
      for (var j = 0; j < enemies.length; j++) {
        if (lasers[i][1] <= (enemies[j][1] + enemies[j][3]) && lasers[i][0] >= enemies[j][0] && lasers[i][0] <= (enemies[j][0] + enemies[j][2])) {
          remove = true;
          var expl = new Audio("./sounds/explosion_one.mp3");
          expl.play();
          enemies.splice(j, 1);
          score += 10;
          intervaldec();
          
          enemies.push([(Math.random() * 500) + 50, -45, enemy_w, enemy_h, speed]);

          $(window).trigger('myCustomEvent', { score: score });
        }
      }
      if (remove == true) {
        lasers.splice(i, 1);
        remove = false;
      }
    }
  }

  function shipCollision() {
    var ship_xw = ship_x + ship_w,
        ship_yh = ship_y + ship_h;
    for (var i = 0; i < enemies.length; i++) {
      if (ship_x > enemies[i][0] && ship_x < enemies[i][0] + enemy_w && ship_y > enemies[i][1] && ship_y < enemies[i][1] + enemy_h) {
        alive = false;
        
      }
      if (ship_xw < enemies[i][0] + enemy_w && ship_xw > enemies[i][0] && ship_y > enemies[i][1] && ship_y < enemies[i][1] + enemy_h) {
        alive = false;
        
      }
      if (ship_yh > enemies[i][1] && ship_yh < enemies[i][1] + enemy_h && ship_x > enemies[i][0] && ship_x < enemies[i][0] + enemy_w) {
        alive = false;
        
      }
      if (ship_yh > enemies[i][1] && ship_yh < enemies[i][1] + enemy_h && ship_xw < enemies[i][0] + enemy_w && ship_xw > enemies[i][0]) {
        alive = false;

      }
    }
  }


  function scoreTotal() {
    ctx.font = 'bold 18px Courier New';
    ctx.fillStyle = '#fff';
    ctx.fillText('Score: ', 490, 30);
    ctx.fillText(score, 555, 31);
    if (!alive) {
      ctx.fillText('Game Over!', 245, height / 2);
      ctx.fillText('Score: ', 245, (height/2)+40);
      ctx.fillText('Click Restart', 245, (height/2)+80);
      ctx.fillText(score, 320, (height/2)+40);
      canvas.addEventListener('click', continueButton, false);

    }
  }

  function continueButton() {
    console.log("hi");
    location.reload();
  }

  function init() {
    console.log("banana");
    canvas.removeEventListener('click', startButton, false);
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    enemy = new Image();
    enemy.src = './images/tiefighterone.png';
    ship = new Image();
    ship.src = './images/xwing.png';
    starfield = new Image();
    starfield.src = './images/stars.jpg';
    myVar =  setInterval(gameLoop, intervalspeed);
    console.log(intervalspeed);
    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);
  }

  function gameLoop() {

    clearCanvas();
    drawStarfield();

    if (alive) {
      hitTest();
      moveEnemies();
      moveLaser();
      drawEnemies();
      drawShip();
      drawLaser();
      shipCollision();
    }
    scoreTotal();
  }

  function keyDown(e) {
    if (e.keyCode == 39) rightKey = true;
    else if (e.keyCode == 37) leftKey = true;
    if (e.keyCode == 38) e.preventDefault(), upKey = true;
    else if (e.keyCode == 40) e.preventDefault(), downKey = true;
    if (e.keyCode == 32 && lasers.length <= laserTotal && alive) 
      { 
        e.preventDefault(),
        lasers.push([ship_x + 1, ship_y - 20, 4, 20]);
        var snd_one = new Audio("./sounds/tie_fighter_sound.mp3");
        snd_one.play();
      }
    if (e.keyCode == 32 && lasers.length <= laserTotal && alive) 
      {
        e.preventDefault(),
        lasers.push([ship_x + 39, ship_y - 20, 4, 20]);
        // var snd_two = new Audio("tie_fighter_sound.mp3");
        // snd_two.play();
      }

  }

  function keyUp(e) {
    if (e.keyCode == 39) rightKey = false;
    else if (e.keyCode == 37) leftKey = false;
    if (e.keyCode == 38) upKey = false;
    else if (e.keyCode == 40) downKey = false;
  }

  function intervaldec() {
    intervalspeed -= 0.2
    clearInterval(myVar)
    // setInterval(gameLoop, intervalspeed);
    console.log(intervalspeed)
    myVar = setInterval(gameLoop, intervalspeed);
    

 }

  window.restart = function restart() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    location.reload();
  }

  window.start = function start() {
    init();
  }

  window.onload = starting_screen();

  function starting_screen() {
    console.log("Hi");
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    ctx.font = 'bold 18px Courier New';
    ctx.fillStyle = '#fff';
    ctx.fillText('Ready?', 275, height / 2 - 40);
    ctx.fillText('Click Start', 245, height / 2);
    canvas.addEventListener('click', startButton, false);
  }

  function startButton() {
    init();
  }
  

}