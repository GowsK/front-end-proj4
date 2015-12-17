$(function(){
  var canvas,
      ctx,
      width = 600,
      height = 600,
      ship_x = (width / 2) - 25, 
      //ship_x is x coord of ship
      ship_y = height - 75, 
      ship_w = 50, 
      ship_h = 50,
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
      laserTotal = 2, 
      //want to limit the number of lasers player can have on screen at one time
      // in this case it is 3 as the array will start from 0
      lasers = [],
      score = 0,
      alive = true;
      starfield, starX = 0, starY = 0, starY2 = -600,
      //starfield variable holds img
      //starX= x position
      //starY and starY2 because we have 2 instances of background
      //get repeated
      intervalspeed = 15;


  for (var i = 0; i < enemyTotal; i++) {
    enemies.push([enemy_x, enemy_y, enemy_w, enemy_h, speed]);
    enemy_x += enemy_w + 60;
    // increasing the x position of each enemy by 60 in order to spread them out across the canvas.
  }

  function clearCanvas() {
    ctx.clearRect(0,0,width,height);
    //clearRect(x, y, width, height)
    //x = upper x-coordinae of the rectangle to clear
    //y = upper y-coordinate of the rectangle to clear
    //width of the rectangle to clear in pixels ie canvas width
    //height of the rectangle to clear in px ie heighgt of canvas

    //have to redraw the canvas every time we we run the game loop 
    //and we need to clear everything on the canvas first 
    //or else we’ll get multiple copies of the ship on the canvas.
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
  //draw 2 star images
  //one drawn on screen one is off screen but above -600
  //incrementing the y position of both images
  //so if both y's pos moving down until reaching certain level

  function drawEnemies() {
    for (var i = 0; i < enemies.length; i++) {
      //ctx.fillStyle = '#f00';
      //ctx.fillRect(enemies[i][0], enemies[i][1], enemy_w, enemy_h);

      // runs through the entire array, it uses the individual x and y positions of each enemy in the array.
      // enemies[i][0] refers to the enemy_x of the enemy ie the x corrdinate 
      // enemies[i][1] referes to enemy_y as we pushed in [enemy_x, enemy_y, enemy_w, enemy_h, speed]
      // remember after first enemy pushed into the array we enemy_x += enemy_w + 60;
      // pushes next drawn enemy across x-axis


      //ctx.fillStyle = '#f00';
      //ctx.fillRect(enemies[i][0], enemies[i][1], enemy_w, enemy_h);
      //ABOVE will be replaced by below
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

    //checking to see if the left or right arrow key is pressed and if so, 
    // move the ship 5 pixels in that direction
    // smae for up and down

    //ctx.fillStyle = 'white';
    //ctx.fillRect(ship_x, ship_y, ship_w, ship_h);
    //ABOVE is replaced by below as we no longer draw a block
    ctx.drawImage(ship, ship_x, ship_y);


    //give a color fill
    // set x, y coords
    //set the ships width and height
  }

  function moveEnemies() {
    for (var i = 0; i < enemies.length; i++) {
      if (enemies[i][1] < height) {
        enemies[i][1] += enemies[i][4];
        //as long as y coordinate is less than height of canvas
        //keep adding onto the y coordinate of the enemy 
        // to make it move downwards
      } else if (enemies[i][1] > height - 1) {
        enemies[i][1] = -45;
      }
    }
    //checking to see if they’ve passed beyond the bottom of the canvas.
    //If they have, then we move them back to above the top of the canvas
  }

  function drawLaser() {
    if (lasers.length)
      for (var i = 0; i < lasers.length; i++) {
        ctx.fillStyle = '#f00';
        ctx.fillRect(lasers[i][0],lasers[i][1],lasers[i][2],lasers[i][3])
        //checking to see if there are any lasers in the array 
        // if the player hasn’t shot one yet don’t want to draw any.
      }
  }

  function moveLaser() {
    for (var i = 0; i < lasers.length; i++) {
      if (lasers[i][1] > -11) {
        lasers[i][1] -= 10;
      } else if (lasers[i][1] < -10) {
        lasers.splice(i, 1);
      }
      // check the y coord of the laser we pushed in aray
      //if y coord is within canvas we keep decreasng 
      //so that laser heads upwards towards origin
      //once laser goes off camvas we remove from array
    }
  }

  // function hitTest() {
  //   for (var i = 0; i < lasers.length; i++) {
  //     for (var j = 0; j < enemies.length; j++) {
  //       if (lasers[i][1] <= (enemies[j][1] + enemies[j][3]) && lasers[i][0] >= enemies[j][0] && lasers[i][0] <= (enemies[j][0] + enemies[j][2])) {
  //         lasers.splice(i, 1);
  //         enemies.splice(j, 1);
  //         enemies.push([(Math.random() * 500) + 50, -45, enemy_w, enemy_h, speed]);
  //       }
  //     }
  //   }
  // }

  //laser’s x position is greater than an enemy ship’s x position 
  //and the laser’s x position is less than the enemy’s x position plus it’s width
  // as well see if the laser’s y position is less than the enemy’s y position plus it’s height
  // If all true then it means that the laser has hit the enemy ship.

  // if (lasers[i][1] <= (enemies[j][1] + enemies[j][3]) && lasers[i][0] >= enemies[j][0] && lasers[i][0] <= (enemies[j][0] + enemies[j][2])) {
  //   lasers.splice(i, 1);
  //   enemies.splice(j, 1);

  //PROBLEM WITH THIS
  // problem is that we are checking the one laser with all the enemies
  //so if there is a hit, we continue checking the other enemies for that same laser
  // even though this laser has been removed because we splice
  // so throws an error.

  //FIX
  //can fix this by just using boolean. 
  //If the laser hits, remove the laser is true.
  // Then we can move the lasers.splice outside of the enemies loop and won’t get errors.

  function hitTest() {
    var remove = false;
    for (var i = 0; i < lasers.length; i++) {
      for (var j = 0; j < enemies.length; j++) {
        if (lasers[i][1] <= (enemies[j][1] + enemies[j][3]) && lasers[i][0] >= enemies[j][0] && lasers[i][0] <= (enemies[j][0] + enemies[j][2])) {
          remove = true;
          var expl = new Audio("../sounds/explosion_one.mp3");
          expl.play();
          enemies.splice(j, 1);
          score += 10;
          intervaldec();
          enemies.push([(Math.random() * 500) + 50, -45, enemy_w, enemy_h, speed]);
        }
      }
      if (remove == true) {
        lasers.splice(i, 1);
        remove = false;
      }
    }
  }

  //laser’s x position is greater than an enemy ship’s x position 
  //and the laser’s x position is less than the enemy’s x position plus it’s width
  // as well see if the laser’s y position is less than the enemy’s y position plus it’s height
  // If all true then it means that the laser has hit the enemy ship.


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

  //if ship’s x position greater than enemy’s x position but less than it’s x position plus it’s width 
  //and it’s y position is greater than the enemy’s y position 
  //but less than the enemy’s y position plus it’s height, then a hit. 
  //And repeated for the other three sides of the ship.

  function scoreTotal() {
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText('Score: ', 490, 30);
    ctx.fillText(score, 550, 30);

    //ctx.fillStyle to set color of font
    //ctx.fillText(content, x position, y position)
    //first instance of fillText, pass content as ‘Score’

    //second instance use the variable score (defined earlier) to set the content 
    //and the score will update on the canvas for us.

    if (!alive) {
      ctx.fillText('Game Over!', 245, height / 2);
      //msg to pop up when collision
      ctx.fillText('Score: ', 245, (height/2)+40);
      ctx.fillText(score, 320, (height/2)+40);
      ctx.fillText('Continue?', 245, (height / 2)+80);
      canvas.addEventListener('click', continueButton, false);
      //event listener added to canvas element not doc
      //now when player clicks on canvas continueButton func called

    }
  }

    


  function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    enemy = new Image();
    enemy.src = 'tiefighter.png';
    ship = new Image();
    ship.src = 'xwing.png';
    //loaded imgs but still need to draw them
    starfield = new Image();
    starfield.src = 'stars.jpg';

    myVar =  setInterval(gameLoop, intervalspeed);
    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);

    //use to get everything started
    //get the canvas element
    //then get it’s context 
    // we use setInterval to call the gameLoop function every 25 milliseconds.
  }

  function gameLoop() {
      clearCanvas();
      if (alive) {
        //game will only run if alive is true
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
    if (e.keyCode == 38) upKey = true;
    else if (e.keyCode == 40) downKey = true;
    //checking which keys being pressed
    //if one of the arrow keys, change variable to true
    if (e.keyCode == 32 && lasers.length <= laserTotal && alive ) 
          { 
            e.preventDefault(),
            lasers.push([ship_x + 1, ship_y - 20, 4, 20]);
            var snd_one = new Audio("tie_fighter_sound.mp3"); // buffers automatically when created
            snd_one.play();
          }
        if (e.keyCode == 32 && lasers.length <= laserTotal && alive) 
          {
            e.preventDefault(),
            lasers.push([ship_x + 39, ship_y - 20, 4, 20]);
            // var snd_two = new Audio("tie_fighter_sound.mp3"); // buffers automatically when created
            // snd_two.play();
            //e.preventDefault added to stop spacebar from causing the page to scroll down.
            //&& alive added so that the spacebar still functions within the register form 

          }
          
    // if space bar is pressed and the number of lasers in the laser array is less than the total
    //then add a laser to our array

    //ship_x + 25 x coord of the laser will be slightly to the right
    // if it was just ship_x then laser would be coming out of the top right hand corner of ship
    // ship_y - 20 as the ship is at bottom, and coords starts from top of canvas
    // so for laser to move up canvas we are heading towards origin so -20
    //4 is the width
    //20 the height

    //SECOND LINE added for double firing like xwing

  }

  function keyUp(e) {
    if (e.keyCode == 39) rightKey = false;
    else if (e.keyCode == 37) leftKey = false;
    if (e.keyCode == 38) upKey = false;
    else if (e.keyCode == 40) downKey = false;
  }

   function intervaldec() {
     intervalspeed -= 2
     clearInterval(myVar)
     // setInterval(gameLoop, intervalspeed);
     console.log(intervalspeed)
     myVar = setInterval(gameLoop, intervalspeed);

     //Decrementing the interval speed with every hit
     

  }

   window.restart = function restart() {
     canvas = document.getElementById('canvas');
     ctx = canvas.getContext('2d');
     location.reload();
   }

    window.start = function start() {
     init();
    }




})