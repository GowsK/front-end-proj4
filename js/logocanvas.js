function initializeStartScreen() {
  var canvas,
      ctx,
      starfield, starX = 0, starY = 0, starY2 = -600;
  
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
  
  function initone() {
    canvas = document.getElementById('canvasone');
    ctx = canvas.getContext('2d');
    starfield = new Image();
    starfield.src = './images/stars.jpg';
    setInterval(gameLoop, 25);  
  }
  
  function gameLoop() {
    drawStarfield();
  }

  // initone();

};
