const playerOne = {
  // SPECS FOR PLAYER 1
  x: 400,
  y: 390,
  w: 20,
  h: 20
}

const playerTwo = {
  // SPECS FOR PLAYER 2
  x: 400,
  y: 100,
  w: 20,
  h: 20
}

const portal = {
  // PORTAL SPECS
  x: 604,
  y: 390,
  w: 75,
  h: 25
}

let gameStarted;
let team;

function preload() {
  // load images here
  img = loadImage('images/assets/grass.png');
  rocketImg = loadImage('images/assets/rocket.png');
  bg = loadImage('images/assets/background.png');
  bgTop = loadImage('images/assets/topbg.png');
}

function setup() {
  createCanvas(800, 400);
  fill(0, 255, 0)

  socket = io.connect('http://localhost:8000/')


  // Create an Audio input
  mic = new p5.AudioIn();

  // start the Audio Input.
  // By default, it does not .connect() (to the computer speakers)
  mic.start();

  // set gameStarted equal to false
  gameStarted = false;



  PORTAL = createSprite(portal.x, portal.y, portal.w, portal.h)

  SHEMAR = createSprite(playerOne.x, playerOne.y, playerOne.w, playerOne.h); <<
  <<
  <<
  <
  HEAD
  SHEMAR.shapeColor = color(255, 0, 0, alpha); ===
  ===
  =
  SHEMAR.shapeColor = color(0, 255, 0); >>>
  >>>
  >
  b84dce97c81e2a02e3f83b2e124b769a25dba9a8
  SHEMAR.velocity.y = 0;

  SHIP = createSprite(playerTwo.x, playerTwo.y, playerTwo.w, playerTwo.h);
  SHIP.addImage(rocketImg)
  SHIP.shapeColor = color(255);
  SHIP.rotateToDirection = true;
  SHIP.maxSpeed = 2;
  SHIP.friction = 0.99;

  let tmp = new Platform
  let tmp2 = new Platform
  let tmp3 = new Platform

  // platform 1
  let p = tmp.sprite()
  // platform 2
  let q = tmp2.sprite()
  // static platform
  let s = tmp.sprite()

  // Player Count
  socket.on('player-number', (data) => {
    if (data.index == 1) {
      console.log("Player 1 Has Joined")
      console.log("Waiting for Player 2")
    } else if (data.index == 2) {
      console.log("Player 2 Has Joined")
    } else if (data.index >= 3) {
      alert("game is full")
    }

  });

  // Team Setter
  socket.on('team', (data) => {
    team = data
  })

  socket.on('startGame', (data) => {
    gameStarted = data.start
  });

  socket.on('mouse', (data) => {
    SHIP.attractionPoint(70, data.x, data.y);
  });

  socket.on('shoot', (data) => {
    BULLET = createSprite(width / 4, height / 4, 2, 10);
    BULLET.velocity.y = data.velocityY;
    BULLET.velocity.x = data.velocityX;
    BULLET.position.x = data.x;
    BULLET.position.y = data.y;

    bullets.push(BULLET)
    console.log('pew')
  });


  socket.on('linearS1', (data) => {
    SHEMAR.position.x = data.x
  });

  socket.on('jumpS1', (data) => {
    SHEMAR.velocity.y = data.Vy
  });

  socket.on('portal', (data) => {

    SHEMAR.position.y = data.y,
      SHEMAR.position.x = data.x,
      SHEMAR.velocity.x = data.vX,
      SHEMAR.velocity.y = data.vY

  });

  // Socket.io end

  randomDirection()

  platform1 = createSprite(platformX, p.y, p.w, 20)

  let p1Data = {
    x: platformX,
    y: p.y,
    w: p.w
  }
  socket.emit('platform1', p1Data)
  socket.on('platform1', (data) => {
    platform1 = createSprite(data.x, data.y, data.w, 20)
  });

  platform2 = createSprite(platformX, p.y - 50, p.w, 20)

  let plaformData2 = {
    x: platformX,
    y: p.y - 50,
    w: p.w
  }
  socket.emit('platform2', plaformData2)
  socket.on('platform2', (data) => {
    platform2 = createSprite(data.x, data.y, data.w, 20)
  });

  platformSTATIC = createSprite(200, 220, 40, 20)


  // create clear button
  startButton = createButton('Start Game').addClass('start-button');

  sB = document.querySelector('.start-button')

  startButton.position(500, height);
  shemarButton.position(500, height + 40);
  shipButton.position(500, height + 60);

  sB.addEventListener('click', (event) => {
    gameStarted = true;

    let data = {
      start: gameStarted
    }

    socket.emit('startGame', data)

  })
}
// setup() ends here

function draw() {
  background(bg);
  fill(255);
  noStroke();
  let bgWave

  // scene
  wave()
  rainRun()
  image(bgTop, 0, 0, window.width, window.height);
  groundLayout()

  if (gameStarted == true) {
    startButton.hide();
    //// start
    //invisibility
    if (invisible === true) {
      SHEMAR.shapeColor = color(255, 0, 0, alpha)
      if (alpha < 255) {
        alpha += 0.5
      } else if (alpha === 255) {
        invisible = false
      }
    }



    //space lizards
    if (LIZARD != undefined) {
      if (SHEMAR.position.x >= LIZARD.position.x) {
        LIZARD.velocity.x = 0.75
      } else if (SHEMAR.position.x < LIZARD.position.x) {
        LIZARD.velocity.x = -0.75
      }
    }

    // Regular Movement
    if (keyIsDown(RIGHT_ARROW) && SHEMAR.position.x < 790) {
      SHEMAR.position.x += 1;
    } else if (keyIsDown(LEFT_ARROW) && SHEMAR.position.x > 10) {
      SHEMAR.position.x -= 1;
    }

    ////// stop here

    // PLAYER TWO CLICK MOVEMENT
    if (mouseIsPressed) {
      getAudioContext().resume()
      // THIS SENDS IT TO THE SERVER, OTHER SERVER
      let data = {
        x: mouseX,
        y: mouseY
      }
      socket.emit('mouse', data)

      SHIP.attractionPoint(70, mouseX, mouseY);
    }


    timerSetter()
    gameLogic()
    drawSprites();

    mainMovementsDraw()

  }

}

//  MOVEMENTS
function keyPressed() {
  mainMovements()
}