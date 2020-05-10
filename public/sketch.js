var socket;

var myWords = [];
var thisWord = [];
var otherWords = [];

var allTiles = [["a", 1], ["a", 1], ["a", 1], ["a", 1], ["a", 1], ["a", 1], ["a", 1], ["a", 1], ["a", 1],
["a", 1], ["a", 1], ["a", 1], ["a", 1], ["a", 1], ["a", 1], ["a", 1], ["a", 1], ["a", 1], ["b", 3], ["b", 3], ["b", 3], ["b", 3],
["c", 3], ["c", 3], ["c", 3], ["c", 3], ["d", 2], ["d", 2], ["d", 2], ["d", 2], ["d", 2], ["d", 2], ["d", 2], ["d", 2], ["e", 1],
["e", 1], ["e", 1], ["e", 1], ["e", 1], ["e", 1], ["e", 1], ["e", 1], ["e", 1], ["e", 1], ["e", 1], ["e", 1],
["e", 1], ["e", 1], ["e", 1], ["e", 1], ["e", 1], ["e", 1], ["e", 1], ["e", 1], ["e", 1], ["e", 1], ["e", 1],
["e", 1], ["f", 4], ["f", 4], ["f", 4], ["f", 4], ["g", 2], ["g", 2], ["g", 2], ["g", 2], ["g", 2], ["g", 2],
["h", 4], ["h", 4], ["h", 4], ["h", 4], ["i", 1], ["i", 1], ["i", 1], ["i", 1], ["i", 1], ["i", 1], ["i", 1], ["i", 1], ["i", 1],
["i", 1], ["i", 1], ["i", 1], ["i", 1], ["i", 1], ["i", 1], ["i", 1], ["i", 1], ["i", 1], ["j", 8], ["j", 8],
["k", 5], ["k", 5], ["l", 1], ["l", 1], ["l", 1], ["l", 1], ["l", 1], ["l", 1], ["l", 1], ["l", 1], ["m", 3],
["m", 3], ["m", 3], ["m", 3], ["n", 1], ["n", 1], ["n", 1], ["n", 1], ["n", 1], ["n", 1], ["n", 1], ["n", 1],
["n", 1], ["n", 1], ["n", 1], ["n", 1], ["p", 3], ["p", 3], ["p", 3], ["p", 3], ["q", 10], ["q", 10],
["r", 1], ["r", 1], ["r", 1], ["r", 1], ["r", 1], ["r", 1], ["r", 1], ["r", 1], ["r", 1], ["r", 1], ["r", 1],
["r", 1], ["s", 1], ["s", 1], ["s", 1], ["s", 1], ["s", 1], ["s", 1], ["s", 1], ["s", 1], ["t", 1],
["t", 1], ["t", 1], ["t", 1], ["t", 1], ["t", 1], ["t", 1], ["t", 1], ["t", 1], ["t", 1], ["t", 1], ["t", 1],
["u", 1], ["u", 1], ["u", 1], ["u", 1], ["u", 1], ["u", 1], ["u", 1], ["u", 1], ["v", 4], ["v", 4], ["v", 4], ["v", 4],
["w", 4], ["w", 4], ["w", 4], ["w", 4], ["x", 8], ["x", 8], ["y", 4], ["y", 4], ["y", 4], ["y", 4], ["z", 10], ["z", 10], [" ", 0], [" ", 0]];

var specTiles = [];

var gameState = 0;

var turnState = 0; // turnState 1 is "player X draw", 2 is "player X make a word", 3 is challenging a word, 4 is penalty for bad challenge

var actState = false; //your turn or theirs

var transState = false;

var grabbed = false;

var initState = true; // moves text based on whether game is in progress

var animTime = 0;

var blockTiles = [];

var pn = 0;
var opn = 0;

var p1words = [];
var p2words = [];
var p1tiles = [];
var p2tiles = [];
var p1fields = [];
var p2fields = [];

var activeTiles = [];

var comTiles = [];

var invul = false;

var p1tot = 0;
var p2tot = 0;

var notEnuff = false;

function setup() {
  createCanvas(1366, 750);

  socket = io.connect('http://167.172.149.111:3000');

  // socket = io.connect('http://:::3000');
  socket.on('mouse',

    function(data) {
      console.log("got: " + data.x + " " + data.y);
      fill(0, 0, 255);
      noStroke();
      ellipse(data.x, data.y, 20, 20);
    });

  socket.on('word',

    function(data) {
      otherWords.push(data);
    });

  socket.on('hiBack',
    function(data) {
      console.log("you are player number " + data);
      pn = data;
      if (pn == 1) {
        gameState = 1;
        opn = 2;
      } else if (pn == 2) {opn = 1;}
    });

  socket.on('test',
    function(data) {
      console.log(data);
    });

    socket.on('turnBack',
    function() {
      console.log("turning back");
      turnState = 1;
    });

  socket.on('readyp1', // here's a new tile
    function() {
      turnState = 1;
      // transState = true;
      animTime = 620;
      if (pn == 1) {
        actState = true;
      } else {
        actState = false;
      }
      gameState = 2;
  });

  socket.on('readyp2',
    function() {
      turnState = 1;
      // transState = true
      animTime = 620;
      if (pn == 2) {
        actState = false;
      } else {
        actState = true;
      }
      gameState = 2;
  });

  socket.on('hereTile',
    function(data) {
      comTiles = data;
      actState = !actState;
      initState = false;
    });

    socket.on('youreOn',
    function() {
      turnState = 2;
      actState = true;
    });

    socket.on('youreOff',
    function() {
      turnState = 2;
      actState = false;
    });

    socket.on('updateTile',
    function(data) {
      if(data.type == 1) {
        console.log("I hear... ");
        console.log(data);
        moveComTile(data);
      }
      if(data.type == 2) {
        console.log("p1word grabbed");
        moveP1Word(data);
      }
      if(data.type == 3) {
        console.log("p2word grabbed");
        moveP2Word(data);
      }
      if(data.type == 4) {
        console.log("blockTile grabbed");
        moveBT(data);
      }

    });

    socket.on('noMoreTiles',
    function() {
      actState = true;
      turnState = 5;
    });

    socket.on('revLists',
    function(data) {
      console.log('receiving lists');
      comTiles = data.coms;
      blockTiles = data.blocks;
      p1words = data.p1s; // go find out if this is worth standardizing
      p2words = data.p2s;
      console.log("comtiles: " + comTiles.length + " blockTiles: " + blockTiles.length + " p1words: " + p1words.length + " p2words: " + p2words.length);
    });

    socket.on('endTurn',
    function(data) {
      comTiles = data.coms;
      blockTiles = data.blocks;

      turnState = 1;
      actState = !actState;
    });

    socket.on('updateWords',
    function(data) {
      p1words = data.p1;
      p2words = data.p2;
      blockTiles = [];
      turnState = 1;
      actState = !actState;
    });

    socket.on('okChallenge',
    function() {
      actState = true;
      turnState = 3;
    });

    socket.on('waitChallenge',
    function() {
      actState = false;
      turnState = 3;
    });


    socket.on('penSeq',
    function(data) {
      if (data == pn) {
        turnState = 4;
        actState = false;
        } else {
        turnState = 4;
        actState = true;
      }
    });

    socket.on('notEnuff',
    function() {
      notEnuff = true;
    });

    socket.on('totScores',
    function(data) {
      p1tot = data.p1;
      p2tot = data.p2;
      gameState = 3;
    });

    fill(255);
    textSize(24);
    textFont('Georgia');

}



function draw() {

  background(0, 128, 56);

  strokeWeight(12);
  stroke(255);
  noFill();

  rect(0, 0, 583, 750);
  rect(783, 0, 583, 750);

  fill(0, 128, 56);
  rect(150, 0, 1066, 120);

  if (gameState == 0) {
    opSeq();
  }

  if (gameState == 1) {
    setTheTable();
  }

  if (gameState == 2) {
    runGame();
  }

  if (gameState == 3) {
    endSeq();
  }
}

//-------------------------//

function runGame() {

  turnAnim();

    showTiles();


  makingWords();


  if (turnState == 3) {
    challengeAnim();
  }

  if (turnState == 4) {
    penaltyAnim();
  }

  if (turnState == 5) {
    passSeq();
  }

  idAnim();
}

function endSeq() {
  if (p1words.length > 0) {
    push();
    textSize(30);
    for (var i = 0; i < p1words.length; i++) {
      if(p1words[i].disp){
      var wordLetters = p1words[i].word.split('');
      var tX = p1words[i].x;
      var tY = p1words[i].y;

      for (var j = 0; j < wordLetters.length; j++) {
        fill(255);
        stroke(180);
        strokeWeight(1);
        rectMode(CORNER);
        rect((tX + (j * 30)), tY, 30, 40);
        push();
          fill(180);
          noStroke();
          translate(15, 20);
          textAlign(CENTER, CENTER);
          text(wordLetters[j].toUpperCase(), (tX + (j * 30)), tY);
        pop();
      }
    }
    var tSX = tX + (p1words[i].breadth * 15);
    push();
    textSize(64);
    fill(180, 0, 0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(p1words[i].points, tSX, tY + 15);
    pop();
    }

    pop();
  }

  if (p2words.length > 0) {
    push();
    textSize(30);
    for (var i = 0; i < p2words.length; i++) {
      if(p2words[i].disp){
      var wordLetters = p2words[i].word.split('');
      var tX = p2words[i].x;
      var tY = p2words[i].y;

      for (var j = 0; j < wordLetters.length; j++) {
        fill(255);
        stroke(180);
        strokeWeight(1);
        rectMode(CORNER);
        rect((tX + (j * 30)), tY, 30, 40);
        push();
          fill(180);
          noStroke();
          translate(15, 20);
          textAlign(CENTER, CENTER);
          text(wordLetters[j].toUpperCase(), (tX + (j * 30)), tY);
        pop();
      }
    }
    var tSX = tX + (p2words[i].breadth * 15);
    push();
    textSize(64);
    fill(180, 0, 0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(p2words[i].points, tSX, tY + 15);
    pop();
    }

    pop();
  }

  fill(255);
  strokeWeight(2);
  stroke(0);

  textSize(60);

  push();
  translate(683, 64);
  textAlign(CENTER, CENTER);
  text("Player 1: " + p1tot + " Player 2: " + p2tot, 0, 0);
  translate(0, 300);
  textSize(84);
  if ((p1tot > p2tot && pn == 1) || (p2tot>p1tot && pn == 2)) {
    text("You win!!", 0, 0);
  } else {
    text("Player " + opn + " wins. Better luck next time!", 0, 0);
  }
  pop();

}

function idAnim(){
  push();
  fill(0);
  noStroke();
  textSize(24);
  text ("You are\nplayer\nnumber " + pn, 20, 40);
  pop();
}

function passSeq() {
  if (actState) {
    fill(255);
    strokeWeight(2);
    stroke(0);

    textSize(36);

    push();
    translate(683, 32);
    textAlign(CENTER, CENTER);
    text("No more tiles!\nPress \"P\" when you're ready to add up the scores", 0, 0);
    pop();
  } else {
    fill(255);
    strokeWeight(2);
    stroke(0);

    textSize(48);

    push();
    translate(683, 64);
    textAlign(CENTER, CENTER);
    text("Waiting on player " + opn + " to end the game", 0, 0);
    pop();
  }
}

function penaltyAnim() {
  if (actState) {
    fill(255);
    strokeWeight(2);
    stroke(0);

    textSize(48);

    push();
    translate(683, 64);
    textAlign(CENTER, CENTER);
    text("Go ahead and take a word from Player " + opn, 0, 0);
    pop();
  } else {
    fill(255);
    strokeWeight(2);
    stroke(0);

    textSize(48);

    push();
    translate(683, 64);
    textAlign(CENTER, CENTER);
    text("Player " + opn + " gets to take one of your words", 0, 0);
    pop();
  }
}

function challengeAnim() {
  if (actState) {
    fill(255);
    strokeWeight(2);
    stroke(0);

    textSize(60);

    push();
    translate(683, 64);
    textAlign(CENTER, CENTER);
    if (!invul) {
    text("Click on a word to challenge it", 0, 0);
  } else {
    push();
    translate(0, -32);
    textSize(36);
    text("That word has already been challenged.\nChoose a different word or press C to exit", 0, 0);
    pop();
  }
    pop();
  } else {
    fill(255);
    strokeWeight(2);
    stroke(0);

    textSize(48);

    push();
    translate(683, 64);
    textAlign(CENTER, CENTER);
    text("Player " + opn + " is challenging one of your words!", 0, 0);
    pop();
  }
}

function moveComTile(udPkg) {
  console.log("moving tile")
  var tElt = udPkg.element;
  comTiles[tElt].x = udPkg.xpos;
  console.log("moveComTile makes x: " + comTiles[tElt].x + udPkg.xpos);
  comTiles[tElt].y = udPkg.ypos;
}

function moveBT(udPkg) {
    var tElt = udPkg.element;
  console.log("moving block tile");
  blockTiles[tElt].x = udPkg.xpos;
  //console.log("moveComTile makes x: " + blockTiles[tElt].x + udPkg.xpos);
  blockTiles[tElt].y = udPkg.ypos;
}

function moveP1Word(udPkg) {
  console.log("moving tile")
  var tElt = udPkg.element;
  p1words[tElt].x = udPkg.xpos;
  console.log("moveComTile makes x: " + p1words[tElt].x + udPkg.xpos);
  p1words[tElt].y = udPkg.ypos;
}

function moveP2Word(udPkg) {
  console.log("moving tile")
  var tElt = udPkg.element;
  p2words[tElt].x = udPkg.xpos;
  console.log("moveComTile makes x: " + p2words[tElt].x + udPkg.xpos);
  p2words[tElt].y = udPkg.ypos;
}

function grabTile() {
  if (comTiles.length >= 1) {
    for (var i = 0; i < comTiles.length; i++) {
      var cT = comTiles[i];
      if (mouseX > cT.xmin && mouseX < cT.xmax && mouseY > cT.ymin && mouseY < cT.ymax && cT.disp) {
        grabbed = true;
        var data = {type:1, element:i, snapx:cT.snapx, snapy:cT.snapy}
        socket.emit('grabbedTile', data);
      }
    }
  }

  if (p1words.length >= 1) {
    for (var i = 0; i < p1words.length; i++) {
      var cT = p1words[i];
      if (mouseX > cT.x && mouseX < (cT.x + (cT.breadth*30)) && mouseY > cT.y && mouseY < cT.y + 40 && cT.disp) {
        grabbed = true;
        var data = {type:2, element:i, snapx:cT.x, snapy:cT.y}
        socket.emit('grabbedWord', data);
      }
    }
  }

  if (p2words.length >= 1) {
    for (var i = 0; i < p2words.length; i++) {
      var cT = p2words[i];
      var nX = p2words[i].x;

      if (mouseX > nX && mouseX < cT.x + (p2words[i].breadth * 30) && mouseY > cT.y && mouseY < cT.y + 40 && cT.disp) {
        grabbed = true;
        var data = {type:3, element:i, snapx:nX, snapy:cT.y}
        socket.emit('grabbedWord', data);
      }
    }
  }

  if (blockTiles.length >= 1) {
    for (var i = 0; i < blockTiles.length; i++) {
      var cT = blockTiles[i];

      if (mouseX > cT.x-30 && mouseX < cT.x+30 && mouseY > cT.y - 40 && mouseY < cT.y + 40) {
        grabbed = true;
        var data = {type:4, element:i, snapx:cT.x, snapy:cT.y}
        socket.emit('grabbedBT', data);
      }
    }
  }
}

function grabCWord (){
  if (p1words.length >= 1 && pn == 2) {
    for (var i = 0; i < p1words.length; i++) {
      var cT = p1words[i];
      if (mouseX > cT.x && mouseX < (cT.x + (cT.breadth*30)) && mouseY > cT.y && mouseY < cT.y + 40) {
        if (cT.vul){
        var data =  {word: cT.word, elt: i, pn: pn};
        invul = false;
        socket.emit('cWord', data);
      } else {
        invul = true;
      }
      }
    }
  }

  if (p2words.length >= 1 && pn == 1) {
    for (var i = 0; i < p2words.length; i++) {
      var cT = p2words[i];
      var nX = p2words[i].x;

      if (mouseX > nX && mouseX < cT.x + (p2words[i].breadth * 30) && mouseY > cT.y && mouseY < cT.y + 40) {
        if (cT.vul){
        var data =  {word: cT.word, elt: i, pn: pn};
        invul = false;
        socket.emit('cWord', data);
      } else {
        invul = true;
      }
      }
    }
  }
}

function takeWord (){
  if (p1words.length >= 1 && pn == 2) {
    for (var i = 0; i < p1words.length; i++) {
      var cT = p1words[i];
      if (mouseX > cT.x && mouseX < (cT.x + (cT.breadth*30)) && mouseY > cT.y && mouseY < cT.y + 40) {

        var data =  {word: cT.word, elt: i, pn: pn};
        socket.emit('tWord', data);
      }
    }
  }

  if (p2words.length >= 1 && pn == 1) {
    for (var i = 0; i < p2words.length; i++) {
      var cT = p2words[i];
      var nX = p2words[i].x;

      if (mouseX > nX && mouseX < cT.x + (p2words[i].breadth * 30) && mouseY > cT.y && mouseY < cT.y + 40) {

        var data =  {word: cT.word, elt: i, pn: pn};
        socket.emit('tWord', data);
      }
    }
  }
}

function makingWords() {
  if (turnState == 2) {
    if (blockTiles.length == 0) {
    dragAnim();
  } else {
    direxAnim();
  }
  }
}

function direxAnim() {
  fill(255);
  strokeWeight(2);
  stroke(0);

  textSize(36);

  push();
  translate(20, 154);
  textAlign(LEFT, CENTER);
  if (actState) {
  text("Press enter when done", 0, 0);
} else {
  text("Player " + opn + " is making a word", 0, 0);
}
  pop();
  if (notEnuff) {
    push();
    translate(683, 300);
    fill(255);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("You must combine more than one element to make a new word", 0, 0);
    pop();
  }
}

function dragAnim(){
  var mouseIsHome;
  if (mouseX > 150 && mouseX < 1066 && mouseY > 0 && mouseY < 150) {
    mouseIsHome = true;
      } else {
    mouseIsHome = false;
      }

  if (!mouseIsPressed || !mouseIsHome) {
    fill(255);
    strokeWeight(2);
    stroke(0);

    textSize(64);

    push();
    translate(683, 64);
    textAlign(CENTER, CENTER);
    if (actState) {
    text("Drag tiles here to make words", 0, 0);
  } else {
    text("Player " + opn + " is making a word", 0, 0);
  }
    pop();
  }
}

function turnAnim() {
if (!transState && turnState == 1) {
  if (actState == true) {
    yourTurn();

  } else {
    theirTurn();

  }
}
}

function showTiles() {


  if (blockTiles.length > 0) {
  showBlockTiles();
  }

  if (p1words.length > 0 || p2words.length > 0) {
  showWordTiles();
  }

  if (comTiles.length > 0) {
    showComTiles();
  }
}

function showBlockTiles() {
  push();

  for (var i = 0; i < blockTiles.length; i++) {

    textSize(48);
    strokeWeight(2);
    stroke(0);
    fill(255);
    rectMode(CENTER);
    var tX = blockTiles[i].x;
    var tY = blockTiles[i].y;
    rect(tX, tY, 60, 80);
    noStroke();
    fill(0);
    textAlign(CENTER, CENTER);
    var tL = blockTiles[i].letter.toUpperCase();
    text(tL, tX, tY);
    textSize(14);
    text(blockTiles[i].points, tX + 20, tY + 28);
  }

  pop();
}

function showWordTiles() {
 if (p1words.length > 0) {
   push();
   textSize(30);
   for (var i = 0; i < p1words.length; i++) {
     if(p1words[i].disp){
     var wordLetters = p1words[i].word.split('');
     var tX = p1words[i].x;
     var tY = p1words[i].y;

     for (var j = 0; j < wordLetters.length; j++) {
       fill(255);
       stroke(0);
       strokeWeight(1);
       rectMode(CORNER);
       rect((tX + (j * 30)), tY, 30, 40);
       push();
       if (p1words[i].vul) {
         fill(0);
       } else {
         fill(180, 0, 0);
       }
         noStroke();
         translate(15, 20);
         textAlign(CENTER, CENTER);
         text(wordLetters[j].toUpperCase(), (tX + (j * 30)), tY);
       pop();
     }
   }
   }

   pop();
 }

 if (p2words.length > 0) {
   push();
   textSize(30);
   for (var i = 0; i < p2words.length; i++) {
     if(p2words[i].disp){
     var wordLetters = p2words[i].word.split('');
     var tX = p2words[i].x;
     var tY = p2words[i].y;

     for (var j = 0; j < wordLetters.length; j++) {
       fill(255);
       stroke(0);
       strokeWeight(1);
       rectMode(CORNER);
       rect((tX + (j * 30)), tY, 30, 40);
       push();
       if (p2words[i].vul) {
         fill(0);
       } else {
         fill(180, 0, 0);
       }
         noStroke();
         translate(15, 20);
         textAlign(CENTER, CENTER);
         text(wordLetters[j].toUpperCase(), (tX + (j * 30)), tY);
       pop();
     }
   }
   }

   pop();
 }
}

function showComTiles() {
  push();

  for (var i = 0; i < comTiles.length; i++) {
    if(comTiles[i].disp) {
    textSize(48);
    strokeWeight(2);
    stroke(0);
    fill(255);
    rectMode(CENTER);
    var tX = comTiles[i].x;
    var tY = comTiles[i].y;
    rect(tX, tY, 60, 80);
    noStroke();
    fill(0);
    textAlign(CENTER, CENTER);
    var tL = comTiles[i].letter.toUpperCase();
    text(tL, tX, tY);
    textSize(14);
    text(comTiles[i].points, tX + 20, tY + 28);

    }
  }
  pop();
}

function yourTurn(){

  if (initState) {
  fill(255);
  strokeWeight(2);
  stroke(0);

  textSize(72);

  push();
  translate(683, 384);
  textAlign(CENTER, CENTER);
  text("Your turn! Press enter to draw a tile", 0, 0);
  pop();
} else {
  fill(255);
  strokeWeight(2);
  stroke(0);

  textSize(72);

  push();
  translate(683, 64);
  textAlign(CENTER, CENTER);
  text("Your turn", 0, 0);
  pop();
}

}

function theirTurn() {
  if (initState) {
  fill(255);
  strokeWeight(2);
  stroke(0);

  textSize(72);

  push();
  translate(683, 384);
  textAlign(CENTER, CENTER);
  text("Player " + opn + " is drawing", 0, 0);
  pop();
} else {
  fill(255);
  strokeWeight(2);
  stroke(0);

  textSize(72);

  push();
  translate(683, 64);
  textAlign(CENTER, CENTER);
  text("Player " + opn + "\'s turn", 0, 0);
  pop();
}
}

function setTheTable() {

  fill(255);
  strokeWeight(2);
  stroke(0);

  textSize(72);

  push();
  translate(683, 384);
  textAlign(CENTER, CENTER);
  text("You are Player 1", 0, 0);
  translate(0, 140);
  textSize(36);
  text("Waiting on Player 2 to join...", 0, 0);
  pop();

}

function opSeq() {

fill(255);
strokeWeight(2);
stroke(0);

textSize(72);

push();
translate(683, 384);
textAlign(CENTER, CENTER);
text("QUARANTINAGRAMS!!", 0, 0);
translate(0, 140);
textSize(36);
text("Press X to get started!", 0, 0);
pop();

}


function LetterTile(letter, points, x, y, id){
  this.letter = letter;
  this.points = points;
  this.x = x;
  this.y = y;
  this.id = id;
  this.disp = true;
  this.xmin;
  this.xmax;
  this.ymin;
  this.ymax;
  this.snapx;
  this.snapy;
}

function mousePressed() {
  if  (turnState == 2 && actState) {
     grabTile();
   }

   if  (turnState == 3 && actState) {
    grabCWord();
    }

    if  (turnState == 4 && actState) {
     takeWord();
     }
}

function mouseDragged() {
  if (turnState == 2 && actState && grabbed) {
    sendMouse(mouseX, floor(mouseY));
  }
  return false;
}

function sendMouse(xpos, ypos) {
  //console.log("sendmouse: " + xpos + " " + ypos);
  var data = {
    x: xpos,
    y: ypos
  };

  socket.emit('mouse', data);
}


function sendHi() {
  socket.emit('hiThere', "x");
}

function keyTyped() {

  console.log("actState: " + actState);
  console.log("turnState: " + turnState);

if (key == "x" && gameState == 0) {
  sendHi();
  gameState = 1;
}

if (keyCode == ENTER && actState == true && turnState == 1) {
  socket.emit('drawTile', "x");
  console.log("drawing a tile");
  transState = false;
}

if (key == "c" && turnState == 1 && p1words.length > 0 && p2words.length > 0){
  console.log("player " + pn + " is challenging a word");
  socket.emit('challengeWord', pn);
}

if (key == "p" && turnState == 5 && actState){
  actState = false;
  socket.emit('imDone', pn);
}

if (key == "c" && turnState == 3 && actState){
  console.log("unchallenging");
  invul = false;
  socket.emit('noChallenge', "x");
}

if (keyCode == ENTER && actState == true && turnState == 2 && blockTiles.length > 0) {
  var blockWord;
  var blockLetters = [];
  var blockVal = 0;
  for (var i = 0; i < blockTiles.length; i++) {
    blockLetters.push(blockTiles[i].letter);
    blockVal += blockTiles[i].points;
  }

  blockWord = blockLetters.join('');

  blockPkg = {word: blockWord, valu: blockVal};

  socket.emit('sendWord', blockPkg); // leaving here 5/2
}

if (key == " " && (turnState == 1 || turnState == 5)) {
  socket.emit('makingWord', pn);
}

if (key == " " && turnState == 2 && actState) {
  socket.emit('putEmBack', pn);
}


return false;
}


function mouseReleased(){
  if(grabbed) {
  grabbed = false;
  var mousePos = {x: mouseX, y: floor(mouseY)};
  console.log("mouse is released at " + mousePos.x);
  socket.emit('dropLetter', mousePos);
  }
  return false;
}
