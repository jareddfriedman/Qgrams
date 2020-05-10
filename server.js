var express = require('express');

var app = express();
var server = app.listen(3000, listen);

var users = [];

var valCat = {"a": 1, "b": 3, "c": 3, "d": 2, "e": 1, "f": 4, "g": 2,
              "h": 4, "i": 1, "j": 8, "k": 5, "l": 1, "m": 3, "n": 1,
              "o": 1, "p": 3, "q": 10, "r": 1, "s": 1, "t": 1, "u": 1,
              "v": 4, "w": 4, "x": 8, "y": 4, "z": 10};

var allXTiles = [["a", 1], ["a", 1], ["a", 1], ["a", 1], ["a", 1], ["a", 1], ["a", 1], ["a", 1], ["a", 1],
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
["w", 4], ["w", 4], ["w", 4], ["w", 4], ["x", 8], ["x", 8], ["y", 4], ["y", 4], ["y", 4], ["y", 4], ["z", 10], ["z", 10]];

var allTiles = [["a", 1], ["d", 1], ["e", 1], ["r", 1], ["s", 1], ["t", 1], ["b", 1], ["o", 1], ["i", 1]];

var fs = require('fs');

var path = require('path');

var rawWordObject = fs.readFileSync('bigList.json');

var bigDict = JSON.parse(rawWordObject);

var specTiles = [];

var comTiles = [];

var activeTiles = [];

var allReady = 0;

var p1;
var p2;

var p1words = [];
var p2words = [];

var p1tiles = [];
var p2tiles = [];

var blockTiles = [];

var pNum = 1;

var dragX = 0;
var dragY = 0;

var grabbed = false;

var activeElement = {};

var passes = 0;

var enuff = 0;

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));

var io = require('socket.io')(server);

io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {

    console.log("We have a new client: " + socket.id);

    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on('mouse',
      function(data) {
        // Data comes in as whatever was sent, including objects
        console.log("Received: 'mouse' " + data.x + " " + data.y + "from " + socket.id);
        dragX = data.x;
        dragY = data.y;
        manageTiles();
        // Send it to all other clients
        //socket.broadcast.emit('mouse', data);

        // This is a way to send to everyone including sender
        // io.sockets.emit('message', "this goes to everyone");

      }
    );

    socket.on('noChallenge',
    function(data) {
      console.log("turn it back");
      io.emit('turnBack', "x");
    }
  );

    socket.on('word',
    function(data) {
      var stringed = data.join('');
      console.log("i got: " + stringed);
      socket.broadcast.emit('word', data);
    }
  );

  socket.on('hereComTiles',
  function(data) {
    comTiles = data;
    if (comTiles.length >= 1) {
      for (var i = 0; i < comTiles.length; i++) {
        console.log (comTiles[i]);
      }
    }
  });

  socket.on('hiThere',
    function() {
      console.log("Hi there!");
      users.push(socket.id);
      console.log("We are now serving " + users.length + " clients.")
      if (users.length == 1) {
        p1 = socket.id;
      socket.emit('hiBack', 1);
    } else if (users.length == 2) {
        p2 = socket.id;
      socket.emit('hiBack', 2);
      socket.emit('readyp2', "x");
      socket.broadcast.emit('readyp1', "x");
      getStarted();
    } else {
      socket.emit('hiBack', 3);
    }

    }
  );

  socket.on('makingWord', // tells active player and passive player their respective roles
  function() {
    if(socket.id == p1) {pNum = 1;} else {pNum = 2;}
    activeTiles = comTiles.concat(p1tiles, p2tiles);
    console.log ("Player " + pNum + " is making a word.");
    socket.emit('youreOn', "x");
    socket.broadcast.emit('youreOff', "x");
  });

  socket.on('putEmBack', // tells active player and passive player their respective roles
  function() {
    if(comTiles.length > 0){
      for (var i = 0; i<comTiles.length; i++) {
        comTiles[i].disp = true;
        comTiles[i].x = comTiles[i].snapx;
        comTiles[i].y = comTiles[i].snapy;
      }
    }

    if(p1words.length > 0){
      for (var i = 0; i<p1words.length; i++) {
        p1words[i].disp = true;
        p1words[i].x = p1words[i].snapx;
        p1words[i].y = p1words[i].snapy;
      }
    }

    if(p2words.length > 0){
      for (var i = 0; i<p2words.length; i++) {
        p2words[i].disp = true;
        p2words[i].x = p2words[i].snapx;
        p2words[i].y = p2words[i].snapy;
      }
    }

    blockTiles = [];

    placeWordTiles();

    // var eTpkg = {
    //   coms: comTiles,
    //   blocks: blockTiles,
    // }
    //
    // io.emit('endTurn', eTpkg);

  });

  socket.on('ready',
    function() {

      allReady ++;
        if (allReady == 2) {
          console.log("readying");
          if (pNum == 1) {
            socket.emit('readyp1', "x");
            allReady = 0;
            pNum = 2;
          } else if (pNum == 2) {
            socket.emit('readyp2', "x");
            allReady = 0;
            pNum = 1;
          }
        }
    });

    socket.on('drawTile',
    function() {
      if(specTiles.length>0) {
        var tT = specTiles[0];
        comTiles.unshift(tT);
        buildTiles();
        specTiles.shift();
        console.log("sending a tile: " + tT.letter);
      } else {
        io.emit('noMoreTiles', "x");
      }
    });

    socket.on('imDone',
    function() {
      passes++;
      if (passes == 2) {
        var p1tot = 0;
        var p2tot = 0;
        for (var i = 0; i < p1words.length; i++) {
          p1tot += p1words[i].points;
        }
        for (var i = 0; i < p2words.length; i++) {
          p2tot += p2words[i].points;
        }

        var totPkg = {p1: p1tot, p2: p2tot};

        io.emit('totScores', totPkg);
      }
    });

    socket.on('sendWord', // next steps: write code for challenging, for abandoning word
    function(data) {
      if(enuff >= 2) {
      makeWord(data);
    } else {
      socket.emit('notEnuff', "x");
    }
    });

    socket.on('grabbedTile',
    function(data) {
      grabbed = true;
      activeElement = data;
      console.log("Here's the tile you grabbed:");
      console.log(data);
    });

    socket.on('grabbedWord',
    function(data) {
      grabbed = true;
      activeElement = data;
      console.log("Here's the word you grabbed:");
      console.log(data);
    });
    //
    // socket.on('grabbedWord',
    // function(data) {
    //   grabbed = true;
    //   activeElement = data;
    //   console.log("Here's the word you grabbed:");
    //   console.log(data);
    // });

    socket.on('grabbedBT',
    function(data) {
      grabbed = true;
      activeElement = data;
      console.log("Here's the BT you grabbed:");
      console.log(data);
    });

    socket.on('challengeWord',
    function(data) {
      socket.emit('okChallenge', "x");
      socket.broadcast.emit('waitChallenge', "x");
    });


    socket.on('cWord',
    function(data) {
      console.log("challenging word: " + data.word);
      if(bigDict.hasOwnProperty(data.word)) {
        penaltySeq(data.pn);
      } else {
        if(data.pn == 1) {
          var tTile = p2words[data.elt];
          tTile.vul = false;
          p2words.splice(data.elt, 1);
          p1words.push(tTile);
          placeWordTiles();
        } else {
          var tTile = p1words[data.elt];
          tTile.vul = false;
          p1words.splice(data.elt, 1);
          p2words.push(tTile);
          placeWordTiles();
        }
      }

    });

    socket.on('tWord',
    function(data) {
      console.log("taking word: " + data.word);

        if(data.pn == 1) {
          var tTile = p2words[data.elt];
          p2words.splice(data.elt, 1);
          p1words.push(tTile);
          placeWordTiles();
        } else {
          var tTile = p1words[data.elt];
          p1words.splice(data.elt, 1);
          p2words.push(tTile);
          placeWordTiles();
        }
    });


    socket.on('dropLetter',
    function(data) {
      console.log('dropLetter');
      if (data.x < 150 || data.x > 1216 || data.y > 120) {
        if (activeElement.type<4) {
      console.log("snapping");
        var udPkg = {
          type: activeElement.type,
          element: activeElement.element,
          xpos: activeElement.snapx,
          ypos: activeElement.snapy
          }
          console.log(udPkg);
          activeElement = {};
        io.emit('updateTile', udPkg);
      } else if (activeElement.type == 4) {
        console.log("snapping bt")
        var tElt = activeElement.element;
        console.log("tile: " + blockTiles[tElt].id);
        if (blockTiles[tElt].id == 0) {
          console.log("can't break up word - snapping back");
          blockTiles[tElt].x = blockTiles[tElt].snapx;
          blockTiles[tElt].y = blockTiles[tElt].snapy;
          placeBlockTiles();
        } else {
          for (var i = 0; i < comTiles.length; i++) {
            if (comTiles[i].id == blockTiles[tElt].id) {
              console.log("making visible: " + comTiles[i].letter);
              comTiles[i].disp = true;
              comTiles[i].x = comTiles[i].snapx;
              comTiles[i].y = comTiles[i].snapy;
            }
          }
          blockTiles.splice(tElt, 1);
          placeBlockTiles();
        }
      }
      } else {
        console.log("moving to block");
        moveToBlock(data);
      }

    });

    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });
  }
);

console.log("My socket server is running, fool");

function oldPS() {
  placeWordTiles();
}

function penaltySeq(playNum) {
  io.emit('penSeq', playNum);
}

function moveToBlock(data) {
  if(activeElement.type == 2 || activeElement.type == 3) {
    wordToBlock(activeElement.type, activeElement.element, data);
  } else if (activeElement.type == 1) {
    tileToBlock(activeElement.element, data);
  } else if (activeElement.type == 4) {
    moveBlockTile(data);
  }
}

function moveBlockTile(data) {
  var snip = activeElement.element;
  var tempT = blockTiles[snip];
  console.log("placing tile: " + tempT);
  var tempBt = blockTiles;
  console.log("blockTiles length:" + tempBt.length);

  blockTiles.splice(snip, 1);

  console.log("removed element. new length: " + blockTiles.length);

  if (data.x < blockTiles[0].x) {
    blockTiles.unshift(tempT);
  } else if (data.x > blockTiles[blockTiles.length-1].x) {
    blockTiles.push(tempT);
  } else {
    console.log("i am here")
    var buildBt = [];
    for(var i = 0; i< blockTiles.length; i++) {
      buildBt.push(blockTiles[i]);
    }
    console.log ("working length: " + blockTiles.length);
    console.log ("buildBt working length: " + buildBt.length);
  for(var i = 0; i < blockTiles.length-1; i++) {
    if (data.x >= blockTiles[i].x && data.x < blockTiles[i+1].x){
      buildBt.splice(i+1, 0, tempT);
    }
  }

      console.log ("inserted elt. new buildBt working length: " + buildBt.length);
      console.log ("blocktiles working length: " + blockTiles.length);
  blockTiles = buildBt;

        console.log ("blocktiles new working length: " + blockTiles.length);
 }
 placeBlockTiles();
}


function wordToBlock(type, index, data) {
  console.log('word to block');
  var pushingLetters = [];
  var pushingTiles = [];
  if(type == 2) {
    p1words[index].x = data.x;
    p1words[index].disp = false;
    pushingLetters = p1words[index].word.split('');
  } else if (type == 3) {
    p2words[index].x = data.x;
    p2words[index].disp = false;
    pushingLetters = p2words[index].word.split('');
  }

  for (var i = 0; i < pushingLetters.length; i++) {
    var tLet = pushingLetters[i];
    pushingTiles.push(new LetterTile(tLet, valCat[tLet], 0, 0, 0));
  }

  console.log('placing word tiles on block');
  if (blockTiles.length == 0) {
    blockTiles = pushingTiles;
    placeBlockTiles();
  } else {
    if(data.x <= blockTiles[0].x) {
      var tempBlock = pushingTiles.concat(blockTiles);
      blockTiles = tempBlock;
      placeBlockTiles();
    } else if (data.x > blockTiles[blockTiles.length-1].x) {
      var tempBlock = blockTiles.concat(pushingTiles);
      blockTiles = tempBlock;
      placeBlockTiles();
    } else {

      var newBT = [];
    for (var i = 1; i < blockTiles.length; i++) {
      if (data.x > blockTiles[i-1].x && data.x < blockTiles[i].x) {
        console.log ('splitting tiles');
        var arr1 = blockTiles.slice(0, i);
        var arr2 = blockTiles.slice(i, blockTiles.length);
        newBT = arr1.concat(pushingTiles, arr2);
      } //this is where i am... it almost works
        }
        blockTiles = newBT;
        console.log('tile between tiles');
        placeBlockTiles();
    }
  }
}

function tileToBlock(index, data) {
  comTiles[index].x = data.x;
  console.log('placing tile on block: ' + comTiles[index].id);
  if (blockTiles.length == 0) {
    blockTiles.push(comTiles[index]);
    comTiles[index].disp = false;
    console.log('first tile placed');
    placeBlockTiles();
  } else {
    if(comTiles[index].x < blockTiles[0].x) {
      console.log("dropping tile at X: " + comTiles[index].x + " against blockTile at " + blockTiles[0].x);
      blockTiles.splice(0, 0, comTiles[index]);
      comTiles[index].disp = false;
      console.log('placing new tile at beginning');
      placeBlockTiles();
    } else if (comTiles[index].x > blockTiles[blockTiles.length-1].x) {
      console.log("dropping tile at X: " + comTiles[index].x + " against blockTile at " + blockTiles[0].x);
      blockTiles.push(comTiles[index]);
      comTiles[index].disp = false;
      console.log('new tile at end');
      placeBlockTiles();
    } else {
    for (var i = 0; i < blockTiles.length-1; i++) {
      if (comTiles[index].x > blockTiles[i].x && comTiles[index].x < blockTiles[i+1].x) {
        blockTiles.splice(i+1, 0, comTiles[index]);
      comTiles[index].disp = false;
        }
      }
      console.log('tile between tiles');
      placeBlockTiles();
    }
  }
}

function manageTiles() {
    var udPkg = {
      type: activeElement.type,
      element: activeElement.element,
      xpos: dragX,
      ypos: dragY
      }
      console.log("x is now " + udPkg.xpos);
    io.emit('updateTile', udPkg);
}

function makeWord(data) {
  enuff = 0;
  var tWord = new WordTile(data.word, data.valu);
  tWord.breadth = tWord.word.length;
  if (pNum == 1) {
    p1words.push(tWord);
  } else {
    p2words.push(tWord);
  }
  placeWordTiles();
}

function placeWordTiles() {

  if(p1words.length > 0) {
    var tempP1 = [];
    for (var i = 0; i < p1words.length; i++){
      if (p1words[i].disp) {
        tempP1.push(p1words[i]);
      }
    }
    p1words = tempP1; // gets rid of dead words
    var lCounter = 0;
    var lC2 = 0;
    for (var i = 0; i < p1words.length; i++){
      var wordBreadth = p1words[i].breadth * 30;
      if (lCounter + wordBreadth >= 563) {
        lCounter = 0;
        lC2 += 50;
      }
      p1words[i].x = 20 + lCounter;
      p1words[i].y = lC2 + 164;
      lCounter += wordBreadth + 10;
    }
  }

  if(p2words.length > 0) {
    var tempP2 = [];
    for (var i = 0; i < p2words.length; i++){
      if (p2words[i].disp) {
        tempP2.push(p2words[i]);
      }
    }
    p2words = tempP2; // gets rid of dead words
    var lCounter = 0;
    var lC2 = 0;
    for (var i = 0; i < p2words.length; i++){
      var wordBreadth = p2words[i].breadth * 30;
      if (lCounter + wordBreadth >= 563) {
        lCounter = 0;
        lC2 += 50;
      }
      p2words[i].x = 1346 - lCounter - wordBreadth;
      p2words[i].y = lC2 + 164;
      lCounter += wordBreadth + 10;
    }
  }

  var tempComs = [];

  for (var i = 0; i < comTiles.length; i++) {
    if (comTiles[i].disp) {
      tempComs.push(comTiles[i]);
    }
  }

  comTiles = tempComs;

  if (comTiles.length > 0) {buildTiles();} //this is letting in some asynchronicity so a good place to start hunting gremlins...

  var udWordPkg = {p1: p1words, p2: p2words};

  blockTiles = [];

  io.emit('updateWords', udWordPkg);
}

function placeBlockTiles() {
  var wordLength = (blockTiles.length - 1) * 70;
  var startPlace = 683 - (wordLength/2);
  for(var i = 0; i < blockTiles.length; i++) {
    blockTiles[i].x = startPlace + i*70;
    blockTiles[i].y = 60;
    console.log("tile " + i + " is " + blockTiles[i].letter + " at " + blockTiles[i].x);
  }
  grabbed = false;
  enuff++;
  activeElement = {};
  sendLists();
}

function sendLists() {
  console.log("sending lists");
  var listPkg = {
    coms: comTiles,
    blocks: blockTiles,
    p1s: p1words,
    p2s: p2words
  }
  io.emit('revLists', listPkg);
}

function dropTile() {

}

function buildTiles() {

  comTiles[0].x = 683;
  comTiles[0].y = 200;
  comTiles[0].xmin = comTiles[0].x - 30;
  comTiles[0].xmax = comTiles[0].x + 30;
  comTiles[0].ymin = comTiles[0].y - 40;
  comTiles[0].ymax = comTiles[0].y + 40;
  comTiles[0].snapx = comTiles[0].x;
  comTiles[0].snapy = comTiles[0].y;
  if (comTiles.length > 1) {
  for (var i = 1; i < comTiles.length; i++) {
    var ns = Math.floor((i-1)/2);
    if (i % 2 == 0) {
      comTiles[i].x = 733;
    } else {
      comTiles[i].x = 633;
    }

    comTiles[i].y = ns * 100 + 300;
    comTiles[i].xmin = comTiles[i].x - 30;
    comTiles[i].xmax = comTiles[i].x + 30;
    comTiles[i].ymin = comTiles[i].y - 40;
    comTiles[i].ymax = comTiles[i].y + 40;
    comTiles[i].snapx = comTiles[i].x;
    comTiles[i].snapy = comTiles[i].y;
    }
  }
        io.emit('hereTile', comTiles);
}

function getStarted() {
  allTiles = shuffle(allTiles);

for (var i = 0; i < allTiles.length; i++) {
  specTiles.push(new LetterTile(allTiles[i][0], allTiles[i][1], 0, 0, i+1));
  }
}

function WordTile(word, points) {
  this.word = word;
  this.points = points;
  this.x;
  this.y;
  this.snapx;
  this.snapy;
  this.disp = true;
  this.vul = true;
  this.breadth;
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

var shuffle = function (array) {

	var currentIndex = array.length;
	var temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;

};
