var player;
var ground;
var invisibleGround;
var obstacles;
var clouds;
var cloudArray = [];
var obstacleArray = [];
var coinArray = [];
var stoneArray = [];
var plrImg,
  groundImg,
  fireImg,
  cactusImg,
  cactusImg2,
  cloudImg,
  cloudImg2,
  backgroundImg,
  coinImg,
  lifeImg,
  collidedPlayerImg,
  resetButton;
var gameOverImg, explosionImg, noFire, stoneImg, winImg;
var jumpSound, endSound, collideSound;
var gameState = 1;
var winner;
var count = 0;
var restart;
var bgImg = 'images/sky.jpg';
var life = 3;
var coin;
var gameOver;
var coinsCollected = 0;
var heart;
var heart2;
var heart3;
var database;
function preload() {
  plrImg = loadAnimation(
    'images/frame0.gif',
    'images/frame1.gif',
    'images/frame2.gif',
    'images/frame3.gif',
    'images/frame4.gif',
    'images/frame5.gif',
    'images/frame6.gif',
    'images/frame7.gif',
    'images/frame8.gif',
    'images/frame9.gif'
  );
  groundImg = loadImage('images/ground.png');

  fireImg = loadAnimation(
    'images/flame0.gif',
    'images/flame1.gif',
    'images/flame2.gif',
    'images/flame3.gif',
    'images/flame4.gif',
    'images/flame5.gif',
    'images/flame6.gif',
    'images/flame7.gif',
    'images/flame8.gif',
    'images/flame9.gif'
  );
  cloudImg = loadImage('images/cloud.png');

  cloudImg2 = loadImage('images/cloud2.png');
  getTimeBackground();

  cactusImg = loadImage('images/cactus1.png');
  cactusImg2 = loadImage('images/cactus2.png');

  coinImg = loadImage('images/coin2.png');
  lifeImg = loadImage('images/heart.png');

  resetButton = loadImage('images/restart.png');
  gameOverImg = loadImage('images/gameOver.png');
  winImg = loadImage('images/youWin.png');

  noFire = loadImage('images/flame6.gif');
  collidedPlayerImg = loadAnimation('images/frame3.gif');

  stoneImg = loadImage('images/rock.png');

  soundFormats('mp3');
  jumpSound = loadSound('sounds/jump.mp3');

  soundFormats('mp3');
  endSound = loadSound('sounds/endGame.mp3');

  soundFormats('mp3');
  collideSound = loadSound('sounds/collided.mp3');
}
function setup() {
  canvas = createCanvas(displayWidth, displayHeight - 150);
  canvas.mousePressed(jumpMouse);

  database = firebase.database();

  player = new Player(displayWidth - 1080, displayHeight - 310, 50, 50);
  player.player.addAnimation('playerImg', plrImg);
  player.player.addAnimation('playerCollided', collidedPlayerImg);
  player.player.scale = 0.5;

  ground = new Ground(displayWidth / 2, displayHeight - 99, 2000, 10);
  ground.ground.addImage('groundImg', groundImg);
  ground.ground.scale = 5;

  invisibleGround = createSprite(
    displayWidth / 2,
    displayHeight - 180,
    2000,
    10
  );
  invisibleGround.visible = false;

  restart = createSprite(displayWidth / 2, displayHeight / 2, 50, 50);
  restart.visible = false;
  restart.addImage('reset', resetButton);
  restart.scale = 0.1;

  gameOver = createSprite(displayWidth / 2, displayHeight / 2 - 120, 50, 50);
  gameOver.visible = false;
  gameOver.addImage('gameOver', gameOverImg);
  gameOver.scale = 0.9;

  heart = createSprite(displayWidth / 2 - 600, displayHeight / 2 - 250, 50, 50);
  heart.addImage('heart', lifeImg);
  heart.scale = 0.2;

  heart2 = createSprite(
    displayWidth / 2 - 500,
    displayHeight / 2 - 250,
    50,
    50
  );
  heart2.addImage('heart', lifeImg);
  heart2.scale = 0.2;

  heart3 = createSprite(
    displayWidth / 2 - 400,
    displayHeight / 2 - 250,
    50,
    50
  );
  heart3.addImage('heart', lifeImg);
  heart3.scale = 0.2;

  winner = createSprite(displayWidth / 2, displayHeight / 2 - 120, 50, 50);
  winner.addImage('winner', winImg);
  winner.visible = false;
  winner.scale = 0.5;

  textSize(18);
  textFont('Georgia');
  textStyle(BOLD);
  stroke(255);
  strokeWeight(5);
}
function winEndState() {
  ground.ground.velocityX = 0;

  for (var i = 0; i < obstacleArray.length; i++) {
    obstacleArray[i].obstacle.destroy();
  }

  for (var i = 0; i < obstacleArray.length; i++) {
    obstacleArray[i].obstacle.changeAnimation('nofire', noFire);
  }

  for (var s = 0; s < stoneArray.length; s++) {
    stoneArray[s].obstacle.destroy();
  }

  for (var j = 0; j < cloudArray.length; j++) {
    cloudArray[j].cloud.destroy();
  }

  for (var x = 0; x < coinArray.length; x++) {
    coinArray[x].destroy();
  }

  player.player.changeAnimation('playerCollided', collidedPlayerImg);
  restart.visible = true;
  winner.visible = true;
}
function draw() {
  // console.log(firebase);
  if (backgroundImg) background(backgroundImg);

  //displayWidth = 1280 and dislayHeight = 800

  text('Distance' + ':' + count, displayWidth - 200, displayHeight - 650);
  text('LIFE:' + life, displayWidth - 200, displayHeight - 550);
  text('COIN' + 'x' + coinsCollected, displayWidth - 200, displayHeight - 600);

  //playState
  if (gameState === 1) {
    ground.loop();

    ground.ground.velocityX = -(10 + count / 100);

    count = count + round(World.frameRate / 30);

    spawnObstacles();
    spawnStones();
    spawnClouds();
    spawnCoins();

    if (frameCount % 200 === 0) {
      pushData();
    } else if (frameCount % 300 === 0) {
      getData();
    }

    for (var i = 0; i < obstacleArray.length; i++) {
      if (obstacleArray[i].isTouching(player.player)) {
        if (life === 1) {
          gameState = 2;
          life--;
          endSound.play();
        } else {
          life--;
          obstacleArray[i].obstacle.destroy();
        }
        if (life === 2) {
          heart3.visible = false;
        } else if (life === 1) {
          heart2.visible = false;
        } else if (life === 0) {
          heart.visible = false;
        }
        collideSound.play();
      }
    }
    for (var i = 0; i < stoneArray.length; i++) {
      if (stoneArray[i].isTouching(player.player)) {
        if (life === 1) {
          gameState = 2;
          life--;
          endSound.play();
        } else {
          life--;
          stoneArray[i].obstacle.destroy();
        }
        if (life === 2) {
          heart3.visible = false;
        } else if (life === 1) {
          heart2.visible = false;
        } else if (life === 0) {
          heart.visible = false;
        }
        collideSound.play();
      }
    }

    for (var i = 0; i < coinArray.length; i++) {
      if (coinArray[i].isTouching(player.player)) {
        coinsCollected++;
        coinArray[i].coin.destroy();
      }
      if (coinsCollected > 10) {
        background(0);
        gameState = 3;
      }
    }
  } //endState
  else if (gameState === 2) {
    ground.ground.velocityX = 0;

    for (var i = 0; i < obstacleArray.length; i++) {
      if (gameState === 2) {
        obstacleArray[i].obstacle.velocityX = 0;
        obstacleArray[i].obstacle.lifetime = -1;
      }
    }

    for (var s = 0; s < stoneArray.length; s++) {
      if (gameState === 2) {
        stoneArray[s].obstacle.velocityX = 0;
        stoneArray[s].obstacle.lifetime = -1;
      }
    }

    for (var i = 0; i < obstacleArray.length; i++) {
      if (gameState === 2) {
        obstacleArray[i].obstacle.changeAnimation('nofire', noFire);
      }
    }
    for (var i = 0; i < stoneArray.length; i++) {
      if (gameState === 2) {
        stoneArray[i].obstacle.changeAnimation('stone', stoneImg);
      }
    }

    for (var j = 0; j < cloudArray.length; j++) {
      if (gameState === 2) {
        cloudArray[j].cloud.velocityX = 0;
        cloudArray[j].cloud.lifetime = -1;
      }
    }

    for (var x = 0; x < coinArray.length; x++) {
      if (gameState === 2) {
        coinArray[x].velocityX = 0;
        coinArray[x].lifetime = -1;
      }
    }

    player.player.changeAnimation('playerCollided', collidedPlayerImg);
    restart.visible = true;
    gameOver.visible = true;
  } //winState
  else if (gameState === 3) {
    ground.ground.velocityX = 0;

    for (var i = 0; i < obstacleArray.length; i++) {
      if (gameState === 2) {
        obstacleArray[i].obstacle.velocityX = 0;
        obstacleArray[i].obstacle.lifetime = -1;
      }
    }

    for (var s = 0; s < stoneArray.length; s++) {
      if (gameState === 2) {
        stoneArray[s].obstacle.velocityX = 0;
        stoneArray[s].obstacle.lifetime = -1;
      }
    }

    for (var i = 0; i < obstacleArray.length; i++) {
      if (gameState === 2) {
        obstacleArray[i].obstacle.changeAnimation('nofire', noFire);
      }
    }
    for (var i = 0; i < stoneArray.length; i++) {
      if (gameState === 2) {
        stoneArray[i].obstacle.changeAnimation('stone', stoneImg);
      }
    }

    for (var j = 0; j < cloudArray.length; j++) {
      if (gameState === 2) {
        cloudArray[j].cloud.velocityX = 0;
        cloudArray[j].cloud.lifetime = -1;
      }
    }

    for (var x = 0; x < coinArray.length; x++) {
      if (gameState === 2) {
        coinArray[x].velocityX = 0;
        coinArray[x].lifetime = -1;
      }
    }

    player.player.changeAnimation('playerCollided', collidedPlayerImg);
    restart.visible = true;
    winner.visible = true;
  }

  if (mousePressedOver(restart)) {
    reset();
  }

  player.player.collide(invisibleGround);
  player.display();
  ground.display();
}

function pushData() {
  var ref = database.ref('scores');
  data = {
    distance: count,
    heart: life,
    coins: coinsCollected,
  };
  ref.push(data);
}

function getData() {
  var ref = database.ref('scores');
  ref.on('value', function (data) {
    var score = data.val();
    console.log(score);
  });
}

function keyPressed() {
  if ((key = ' ' && gameState === 1 && player.player.y > displayHeight / 1.5)) {
    player.jump();
    jumpSound.play();
    console.log('working');
    touches = [];
  }
}
function jumpMouse() {
  if (gameState === 1 && player.player.y > displayHeight / 1.5) {
    player.jump();
    jumpSound.play();
  }
}

function spawnObstacles() {
  if (frameCount % 50 === 0) {
    obstacle = new Obstacles(displayWidth, displayHeight - 245, 50, 50);
    obstacle.obstacle.velocityX = -(10 + count / 100);
    obstacle.obstacle.addAnimation('obstacle', fireImg);
    obstacle.obstacle.addAnimation('nofire', noFire);
    obstacle.obstacle.scale = 0.5;
    obstacle.obstacle.setCollider('circle', 0, 0, 30);
    obstacle.display();
    obstacle.obstacle.lifetime = 200;
    obstacleArray.push(obstacle);
  }
}
function spawnStones() {
  if (frameCount % 100 === 0) {
    obstacle2 = new Obstacles(displayWidth, displayHeight - 245, 50, 50);
    obstacle2.obstacle.velocityX = -(10 + count / 100);
    obstacle2.obstacle.addAnimation('obstacle', stoneImg);
    obstacle2.obstacle.scale = 0.5;
    obstacle2.obstacle.setCollider('circle', 0, 0, 30);
    obstacle2.display();
    obstacle2.obstacle.lifetime = 200;
    stoneArray.push(obstacle2);
  }
}

function spawnClouds() {
  if (frameCount % 150 === 0) {
    clouds = new Cloud(displayWidth, random(0, displayHeight / 4), 50, 50);
    clouds.cloud.addAnimation('cloud', cloudImg);
    clouds.cloud.scale = 0.3;
    clouds.display();
    clouds.cloud.lifetime = 200;
    cloudArray.push(clouds);
  }
}
function spawnCoins() {
  if (frameCount % 200 === 0) {
    coin = new Coin(displayWidth, random(displayHeight / 2, displayHeight));
    coin.coin.addAnimation('coin', coinImg);
    coin.coin.scale = 0.3;
    coin.display();
    coin.coin.lifetime = 200;
    coinArray.push(coin);
  }
}

async function getTimeBackground() {
  var time = await fetch('https://worldtimeapi.org/api/timezone/Asia/Kolkata');
  var timeJSON = await time.json();

  var datetime = timeJSON.datetime;
  var hour = datetime.slice(11, 13);

  if (hour >= 0900 || hour <= 0900) {
    bgImg = 'images/sky.jpg';
  } else {
    bgImg = 'images/nightSky1.jpg';
  }

  backgroundImg = loadImage(bgImg);
  console.log(backgroundImg);
}

function resetHeart() {
  heart3.visible = true;
  heart2.visible = true;
  heart.visible = true;
}

function reset() {
  gameState = 1;
  resetHeart();

  for (var i = 0; i < obstacleArray.length; i++) {
    obstacleArray[i].obstacle.destroy();
  }

  for (var i = 0; i < cloudArray.length; i++) {
    cloudArray[i].cloud.destroy();
  }

  for (var i = 0; i < stoneArray.length; i++) {
    stoneArray[i].obstacle.destroy();
  }

  player.player.changeAnimation('playerImg', plrImg);

  life = 3;

  restart.visible = false;
  gameOver.visible = false;
  winner.visible = false;

  count = 0;
  coinsCollected = 0;
}
