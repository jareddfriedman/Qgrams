var cw = 800;
var ch = 800;

var wheelLetters = ["r", "s", "t", "l", "n"];

var comVowel = ["a", "e", "i"];

var anyVowel = ["a", "e", "i", "o", "u"];

var alphabetOne = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "k", "l", "m", "n", "o", "p", "r", "s", "t", "u", "v", "w", "y"];

var alphabetTwo = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "k", "l", "m", "n", "o", "p", "r", "s", "t", "u", "v", "w", "y"];

var alphabetThree = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

var alphabetFour = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

var allLetters = [wheelLetters, comVowel, anyVowel, alphabetOne, alphabetTwo, alphabetThree, alphabetFour];

var cTile;

var r1tiles = [];

var r2tiles = [];

var moving;

var allTiles = [];

var tWidth = 80;

var t2Width = 90;

var t3Width = 75;

var md = false;

var gotLetters = [];

var testNum = 0;

var lineVals = [];

var tempHold = 0;

var ard = false; // anti-redundancy device

var coinFlip = 0;

var madeWords = [];

var dispLets =[];

var dictionary = [];

var newDict = {};

var score = 0;

var badWord = -1;

var bad2 = -1;

var badTime = 0;

var wordVals = [];

var gameState = 0; //currently at 5, incl start, play, pause, end, instructions, reset

var mins = 3;

var secs = 0;

var timeStr;

var gameTime = 10800;

var endBreak = false;

var animOn = true;

var validator = [];

var possList = [];

var newPossList = [];

var rootDict;

var bkgLets = [];

var bkgImg;

function preload(){

  newDict = loadJSON('bigList.json');
  rootDict = loadJSON('rootDict.json');

  fontRegular = loadFont("texgyreschola-regular-webfont.ttf");
  fontItalic = loadFont("texgyreschola-italic.otf");

  bkgImg = loadImage('bkgImg.png');
}


function setup() {

  console.log("revising August 20");

//console.log("changed alphabets");

textFont(fontRegular);

validator = Object.keys(newDict);

//console.log(validator[93]);

createCanvas(cw, ch);

var cw1 = cw / 2;
var ch1 = ch / 2;

makeBkgLets();

makeTiles();

//makeBg();

}

function draw() {
  if(gameState == 0) {
    wScreen();
  } else if (gameState == 1) {
  runGame();
  } else if (gameState == 2) {
    eScreen();
  } else if (gameState == 3) {
    rScreen();
  } else if (gameState == 4) {
    pScreen();
  } else if (gameState == 5) {
    ruleScreen();
  }
}

function makeBkgLets() {

  var sourceLets = alphabetOne.concat(alphabetTwo, alphabetThree, alphabetFour);

  sourceLets = shuffle(sourceLets);

  for (var i = 0; i <= 90; i++) {
    var blSize = Math.floor(random(72,300));
    var blX = Math.floor(random(800));
    var blY = Math.floor(random(800));
    bkgLets.push(new BkgLet(sourceLets[i], blSize, blX, blY));
  }
}

function ruleScreen() {
    background(64, 64, 96);

    push();

    translate(cw/2, 0);

    fill(220, 255, 255);

    noStroke();

    textAlign(CENTER);

    textSize(60);

    text("How to play WordsAmok:", 0, 100);

    textFont(fontRegular);

    textSize(24);

    fill(255);

    text("You have three minutes to find as many words as you can.\nClick adjacent letters in order, and then double click on the\nlast letter to submit; you can also click and drag the mouse\nacross the letters.\n \nBut be alert! The letters shift position every time you\nfind a new word.\n \nWords are scored based on the length and the rarity of the\nword - the longer and more unusual it is, the more\npoints you'll score.", 0, 200);

    fill(220, 255, 255);

    textSize(48)

    text("Click anywhere to return\nto the main menu", 0, 600);

    pop();
}

function rScreen() {
    background(64, 64, 96);

    push();

    translate(cw/2, ch/2);

    fill(220, 255, 255);

    noStroke();

    textAlign(CENTER);

    textSize(60);

    text("Are you sure you\nwant to restart?", 0, -200);

    textFont(fontRegular);

    textSize(36);

    fill(255);

    text("Press any key to start over or\nclick anywhere to go back", 0, 0);

    pop();
}

function pScreen() {
    background(64, 64, 96);

    push();

    translate(cw/2, ch/2);

    fill(220, 255, 255);

    noStroke();

    textAlign(CENTER);

    textSize(72);

    text("Paused!", 0, -200);

    textFont(fontRegular);

    textSize(60);

    fill(255);

    text("Click anywhere to\nresume playing!", 0, 0);

    pop();
}

function eScreen() {
    background(64, 64, 96);

    push();

    translate(cw/2, ch/2);

    fill(220, 255, 255);

    noStroke();

    textAlign(CENTER);

    textSize(72);

    text("Great job!", 0, -300);

    textFont(fontRegular);

    textSize(90);

    fill(255);

    text("You scored\n" + score + " points!", 0, -150);

    textSize(48);

    fill(120, 150, 180);
    text("Click below to play again...", 0, 100);

    pop();

    endButtonDisp();
}

function wScreen() {
    background(64, 64, 96);

    fill(0, 0, 75);

    for (var i = 0; i<bkgLets.length; i++) {
      textSize (bkgLets[i].size);
      text(bkgLets[i].letter, bkgLets[i].x, bkgLets[i].y);
    }

    push();

    translate(cw/2, ch/2);

    fill(220, 255, 255);

    textAlign(CENTER);

    textSize(50);

    text("Let's play...", -200, -280);

    textFont(fontRegular);

    textSize(100);

    fill(255);

    text("WordsAmok 2!", 0, -60);
    //
    // textSize(60);
    //
    // text("(acoustic boogaloo)", 0, 80);

    fill(120, 150, 180);
    rect(-260, 150, 520, 70, 10);
    rect(-260, 250, 520, 70, 10);

    textSize(48);

    fill(0, 0, 64);
    text("Click here to begin!", 0, 200);
    textSize(36);
    text("(or click here to learn how...)", 0, 300);

    pop();
}

function runGame() {
  if (animOn == true) {
    sendTiles();
  }
else {
  background(32, 32, 64);

  image(bkgImg, 0, 0);

  makeTime();

  badDisp();

  scoreDisp();

  timeDisp();

  buttonDisp();

  //dispLetters();

  translate(cw/2, ch/2);

  writeWords();

  textFont(fontRegular);

  cTile.display();

  for (var i=0; i<r1tiles.length; i++) {
    r1tiles[i].display();
  }

  for (var i=0; i<r2tiles.length; i++) {
    r2tiles[i].display();
  }

  if (moving) {
    rotateTiles();
  }

currWord();

strokeWeight(8);
stroke(0, 200, 80, 255);

if (lineVals.length > 0) {

  for (var i = 1; i<lineVals.length; i++) {
    line(lineVals[i-1][0], lineVals[i-1][1], lineVals[i][0], lineVals[i][1]);
  }
  }


}
}

function sendTiles() {
  //console.log("boof");
//   background(32, 32, 64);
//   fill(48, 48, 80);
//
//   noStroke();
//
//   for (var i = 0; i<bkgLets.length; i++) {
//     textSize (bkgLets[i].size);
//     text(bkgLets[i].letter, bkgLets[i].x, bkgLets[i].y);
//   }
//   loadPixels();
//
//   bkgImg = createImage(800, 800);
//
//   bkgImg.loadPixels();
//
// for (var i = 0; i < pixels.length; i++) {
//   bkgImg.pixels[i] = pixels[i];
// }
//
//   bkgImg.updatePixels();
//
//   for (var i = 0; i < 20; i++) {
//     console.log(pixels[i]);
//   }
//
//   for (var i = 0; i < 20; i++) {
//     console.log(bkgImg.pixels[i]);
//   }

  animOn = false;
}

function buttonDisp() {
  push();
  // fill(0, 0, 64);
  //
  // rect(5, 735, 160, 60, 10);
  //
  // rect(635, 735, 160, 60, 10);
  stroke(0);
  strokeWeight(4);

  fill(150, 180, 210);

  rect(10, 740, 150, 50, 8);

  rect(640, 740, 150, 50, 8);

  fill(0, 0, 64);
  noStroke();
  textFont(fontItalic);
  textSize(36);

  textAlign(LEFT);

  text("Restart", 24, 778);

  text("Pause", 664, 778);

  pop();
}

function endButtonDisp() {

  push();

  stroke(0, 0, 64);

  strokeWeight(4);

  fill(150, 180, 210);

  rect(250, 585, 300, 100, 10);

  //fill(150, 180, 210);

  // rect(10, 740, 150, 50, 8);
  //
  // rect(640, 740, 150, 50, 8);

  fill(0, 0, 64);
  noStroke();
  //textFont(fontItalic);
  textSize(60);

  textAlign(CENTER);

  text("HIT ME!", 400, 658);

  //text("Pause", 664, 778);

  pop();
}

function scoreDisp() {
  push();
  fill(0, 0, 64);

  var sL = 0;

  if (score<10){
    sL = 170;
  } else if (score >= 10 && score <100) {
    sL = 190;
  } else {
    sL = 210;
  }

  rect(5, 5, sL, 60, 10);

  fill(220, 255, 255);
  noStroke();
  textFont(fontItalic);
  textSize(36);

  textAlign(LEFT);

  text("Score: " + score, 25, 48);

  pop();
}

function timeDisp() {
  push();
  fill(0, 0, 64);



  if (gameTime >= 1800) {
      rect(695, 5, 100, 60, 10);
  fill(220, 255, 255);
  noStroke();
  textFont(fontItalic);
  textSize(36);
  textAlign(RIGHT);
  text(timeStr, 780, 48);
} else {
    rect(680, 5, 115, 75, 10);
  fill(255, 64, 0);
  noStroke();
  textFont(fontItalic);
  textSize(48);
  textAlign(RIGHT);
  text(timeStr, 780, 60);
}


  pop();
}

function makeTime() {
  gameTime --;

  if (gameTime <= 0) {
    endBreak = true;
    gameState = 2;
  }

  var minSecs = int(gameTime/60);

  secs = minSecs % 60;

  mins = int(minSecs/60);

  var secStr;

  if (secs > 9) {
    secStr = str(secs);
  } else {
    secStr = str("0" + secs);
  }

  timeStr = str(mins + ":" + secStr);
}

function currWord() {
  push();

  translate(0, 350);

  stroke(0);
  fill(220, 255, 255);

  var wordLetters = [];
  for (var i = 0; i < gotLetters.length; i++) {
    wordLetters.push(gotLetters[i].letter);
  }

  var currW = join(wordLetters, "");

  textSize(60);

  text(currW, 0, 0);

  pop();
}

function makeTiles() {

  var cc = Math.floor(random(40));

  allLetters = shuffle(allLetters);
  var alpha = allLetters[0];
  console.log(alpha)

  cTile = new Ball(1, 0, 0, alpha, cc, 0, 0);

  allTiles.push(cTile);

  for (var i = 0; i<6; i++) {
    cc = Math.floor(random(40));
    var alpha = allLetters[i];
      console.log(alpha)
    r1tiles.push(new Ball(6, i, 100, alpha, cc, 0, i + 1));
    allTiles.push(r1tiles[i]);
  }

  for (var i = 0; i<12; i++) {
    cc = Math.floor(random(40));
    var alpha;

    if (i >= allLetters.length) {
    allLetters = shuffle(allLetters);
    alpha = allLetters[0];
    } else {
      alpha = allLetters[i];
    }
      console.log(alpha)
    r2tiles.push(new Ball(12, i, 200, alpha, cc, 0, i + 7));
    r2tiles[i].resetVals();
    allTiles.push(r2tiles[i]);
  }
  listPossibles(publishResults);
}

function rotateTiles() {

  var allSet = 0;

  if (coinFlip == 0) {

  for (var i = 0; i<r2tiles.length; i++) {
    if (r2tiles[i].rotateCW()) {
      allSet ++;
    }
  }

  for (var i = 0; i<r1tiles.length; i++) {
    if (r1tiles[i].rotateCCW()) {
      allSet ++;
    }
  }

} else if (coinFlip == 1) {
  for (var i = 0; i<r2tiles.length; i++) {
    if (r2tiles[i].rotateCCW()) {
      allSet ++;
    }
  }

  for (var i = 0; i<r1tiles.length; i++) {
    if (r1tiles[i].rotateCW()) {
      allSet ++;
    }
  }
} else if (coinFlip == 2) {
  for (var i = 0; i<r2tiles.length; i++) {
    if (r2tiles[i].rotateCCW()) {
      allSet ++;
    }
  }

  for (var i = 0; i<r1tiles.length; i++) {
    if (r1tiles[i].rotateCCW()) {
      allSet ++;
    }
  }
} else if (coinFlip == 3) {
  for (var i = 0; i<r2tiles.length; i++) {
    if (r2tiles[i].rotateCW()) {
      allSet ++;
    }
  }

  for (var i = 0; i<r1tiles.length; i++) {
    if (r1tiles[i].rotateCW()) {
      allSet ++;
    }
  }
}

  if (allSet == 0) {
    moving = false;
    listPossibles(publishResults);
  }
}

function flipACoin() {
  coinFlip = Math.floor(random(4));
}

function writeWords() {
  push();

  textFont(fontItalic);

  noStroke();
  // fill(150, 215, 215);
  textSize(36);

  rotate(-HALF_PI - PI/20);

  var blarg = madeWords.length;

  if (blarg > 40) {
    blarg = 40;
  }

  for (var i = 0; i<blarg; i++) {

    var ugh = madeWords.length-1-i;

    rotate(PI/20);
    if (ugh == badWord) {
      fill(255, 80, 80);
    } else {
      if (wordVals[ugh] == 20) {
        fill(215, 150, 215)
      } else if (wordVals[ugh] == 30) {
      fill(150, 235, 235);
      } else if (wordVals[ugh] == 40) {
      fill(120, 120, 255);
      } else {
      fill(150, 150, 215);
      }
    }
    text(madeWords[madeWords.length-1-i], 260, 0);
  }

  pop();
}

function badDisp() {
    if (badTime >=1 && badTime <= 20) {
    if (badTime <6 || badTime > 10) {
      badWord = bad2;
    } else {
      badWord = -1;
    }

    badTime++;

    if (badTime >= 20) {
      badWord = -1;
      bad2 = -1;
      badTime = 0;
    }
  }
}

function BkgLet(letter, size, thisx, thisy) {
  this.letter = letter;
  this.size = size;
  this.x = thisx;
  this.y = thisy;
}

function Ball(setVal, setPos, dist, letterSet, colorConstant, playVal, uid) {

  var index = Math.floor(random(letterSet.length));

  this.setVal = setVal;
  this.setPos = setPos;
  this.natDist = dist;
  this.dist = dist;
  this.state = 0;
  this.uid = uid;
  this.transState = 0;
  this.blinkState = 0;
  this.letter = letterSet[index];
  this.letterSet = letterSet;
  this.checkState = 0;
  this.colorConst = colorConstant;
  this.playVal = playVal;
  this.x;
  this.y;
  this.mV = 0;

  var aCon = TWO_PI/this.setVal;
  var newThing = aCon * this.setPos;
  this.x = sin(newThing) * dist;
  this.y = cos(newThing) * dist;

  this.rotateCW = function(){

    var timingC = 1 / 60;

    if (this.setVal >6) {var expC = (this.natDist * .1) / 30;} else {
      var expC = 0;
    }

    var targetVal = -1;
    if (this.setPos % 2 != 0) {
      if (this.mV > -0.5 && this.dist < this.natDist) {
        this.dist += expC;
      }
    }

    if (this.setPos % 2 == 0 && this.dist > this.natDist * .9) {
      if (this.mV < -0.5) {
        this.dist -= expC;
      }
    }

    if (this.mV > targetVal) {
          this.mV -= timingC;
          var nP = this.setPos + this.mV;
          var newNewThing = aCon * nP;
          this.x = sin(newNewThing) * this.dist;
          this.y = cos(newNewThing) * this.dist;

          return true;
      } else {

      this.setPos = this.setPos + targetVal;

      if (this.setPos < 0) {
        this.setPos = this.setVal - 1;
      }

      this.mV = 0;
      if (this.setVal > 6) {this.resetVals();}
      return false;
      }
    }

    this.rotateCCW = function(){


      var timingC = 1 / 60;

      if (this.setVal >6) {var expC = (this.natDist * .1) / 30;} else {
        var expC = 0;
      }

      if (this.setPos % 2 != 0) {
        if (this.mV < 0.5 && this.dist < this.natDist) {
          this.dist += expC;
        }
      }

      if (this.setPos % 2 == 0 && this.dist > this.natDist * .9) {
        if (this.mV > 0.5) {
          this.dist -= expC;
        }
      }

      var targetVal = 1;
      if (this.mV < targetVal) {
            this.mV += timingC;
            var nP = this.setPos + this.mV;
            var newNewThing = aCon * nP;
            this.x = sin(newNewThing) * this.dist;
            this.y = cos(newNewThing) * this.dist;

            return true;
        } else {
          this.setPos = this.setPos + targetVal;

          if (this.setPos > this.setVal - 1) {
            this.setPos = 0;
          }
        this.mV = 0;
        if (this.setVal > 6) {this.resetVals();}
        return false;
        }
      }

  this.resetVals = function() {
    if (this.setPos % 2 !== 0) {
      newThing = aCon * this.setPos;
      this.dist = this.natDist * .9;
      this.x = sin(newThing) * this.dist;
      this.y = cos(newThing) * this.dist;
    } else {
      newThing = aCon * this.setPos;
      this.dist = this.natDist;
      this.x = sin(newThing) * this.dist;
      this.y = cos(newThing) * this.dist;
    }
  }

  this.display = function(){

  smooth();

   if (this.state === 0) {
    index = floor(random(this.letterSet.length));

    noStroke();
    fill(0);
    ellipse(this.x, this.y, t2Width, t2Width);

    stroke(255);
    strokeWeight(2);
    noFill();
    arc (this.x, this.y, tWidth, tWidth, TWO_PI-QUARTER_PI, TWO_PI-(PI/12));


    if (this.checkState === 0) {
      if (this.playVal === 0) {
    fill(255, 255, 185+this.colorConst, 255);
      }

      if (this.playVal == 1) {
    fill(255, 185+this.colorConst, 185+this.colorConst, 255);
      }

      if (this.playVal == 2) {
    fill(255, 255, this.colorConst, 255);
      }

      if (this.playVal == 3) {
    fill(65, 205+this.colorConst, 85+this.colorConst, 255);
      }

      if (this.playVal == 4) {
    fill(125+this.colorConst, 35, 125+this.colorConst, 255);
      }

      if (this.playVal == 5) {
    fill(0, 0, 0, 255);
      }

      }

    if (this.checkState === 1) {
    fill(255, 220, 220);}

    if (this.checkState === 2) {
    fill(210, 210, 255);}

    if (this.checkState === 3) {
    fill(200, 255, 200);}

    noStroke();
    ellipse(this.x, this.y, t3Width, t3Width);

  if (this.playVal == 5) {
    fill(255);
  } else {
    fill(0);
  }
    textSize(t2Width/1.5);
    textAlign(CENTER);
    textStyle(BOLD);
    text(this.letter, this.x, this.y + 14);

  } else if (this.state == 1) {
    noStroke();
    fill(0);
    ellipse(this.x, this.y, t2Width, t2Width);

    stroke(255);
    strokeWeight(2);
    noFill();
    arc (this.x, this.y, tWidth, tWidth, TWO_PI-QUARTER_PI, TWO_PI-(PI/12));

    noStroke();
    fill(185);
    ellipse(this.x, this.y, t3Width, t3Width);

    fill(100);
    textSize(t2Width/1.5);
    textAlign(CENTER);
    textStyle(BOLD);
    text(this.letter, this.x, this.y + 14);
  }
  }

}

function whatWords() {

}

function dictCheck(word) {
  // {
  // if (dictionary10.indexOf(word) >= 0 && word.length >= 3) {
  //   return 10;
  //   } else if (dictionary20.indexOf(word) >= 0 && word.length >= 3) {
  //   return 10;
  //   } else if (dictionary35.indexOf(word) >= 0 && word.length >= 3) {
  //   return 10;
  //   } else if (dictionary40.indexOf(word) >= 0 && word.length >= 3) {
  //   return 20;
  //   } else if (dictionary50.indexOf(word) >= 0 && word.length >= 3) {
  //   return 30;
  //   } else if (dictionary55.indexOf(word) >= 0 && word.length >= 3) {
  //   return 30;
  //   } else if (dictionary60.indexOf(word) >= 0 && word.length >= 3) {
  //   return 30;
  //   } else if (dictionary70.indexOf(word) >= 0 && word.length >= 3) {
  //   return 40;
  //   } else {
  //     return 0;
  //   }
  // }

  if (newDict.hasOwnProperty(word)) {
    var ndw = newDict[word];
    if(newDict[word] <= 3) {
      console.log(ndw + " plain word");
      return 10;
    } else if (newDict[word] > 3 && newDict[word] <=8){
      console.log(ndw + " fancy word!");
      return 20;
    } else if (newDict[word] > 8 && newDict[word] <= 12){
      console.log(ndw + " very fancy word!");
      return 30;
    } else if (newDict[word] > 12){
      console.log(ndw + " very very fancy word!");
      return 40;
    }
  } else {
    return 0;
  }
}

function checkWord() {

  var wordLetters = [];
  for (var i = 0; i < gotLetters.length; i++) {
    gotLetters[i].playVal = 0;
    wordLetters.push(gotLetters[i].letter);
  }

  var word = join(wordLetters, "");

  console.log("checking " + word);

  var scorePoss = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233];

  var sC = word.length - 3;

  var scoreX = scorePoss[sC];

  var proof = dictCheck(word);

  if (proof == 0) {
    gotLetters = [];
  } else if (madeWords.indexOf(word) >= 0){
    gotLetters = [];
    badify(madeWords.indexOf(word));
    } else {
  console.log(word + ": " + proof)

  madeWords.push(word);

  wordVals.push(proof);

  score += scoreX * (proof/10);

  gotLetters = [];

  flipACoin();
  moving = true;
  }
}

function badify(n) {
  bad2 = n;
  badTime++;
}

function TilePointer(val) {
  this.myself = val;
  this.cousins = [];
}

function isRoot(possRoot) {
  var rooter = new RegExp('\\b'+ possRoot + '\\B', 'g');

  for (var i = 0; i < validator.length; i++) {
    if (validator[i].match(rooter)) {
      return true;
    }
  }

  return false;
}

function pointerCheck(inPoint) {

  var wordArr = [];
  var tileArr = [];
  for (var i = 0; i < inPoint.length; i++) {
    wordArr.push(inPoint[i].myself.letter);
    tileArr.push(inPoint[i].myself);
  }

  for (var i = 0; i < inPoint[inPoint.length-1].cousins.length; i++) {

    if (tileArr.indexOf(inPoint[inPoint.length-1].cousins[i]) < 0) {
      var nWordArr = wordArr;
      nWordArr.push(inPoint[inPoint.length-1].cousins[i].letter);

      var possWord = join(nWordArr, '');

      if (dictCheck(possWord) > 0) {
        ist.push(possWord);
      }

      if (isRoot(possWord)) {
        var newPointer = new TilePointer(inPoint[inPoint.length-1].cousins[i]);

        for (var j = 0; j < allTiles.length; j++) {
          if (dist(newPointer.myself.x, newPointer.myself.y, allTiles[j].x, allTiles[j].y) <= 120) {
            newPointer.cousins.push(allTiles[j]);
          }
        }

        inPoint.push(newPointer);
        pointerCheck(inPoint);
      }
    }
  }

}

function rootCheck(thisArr, newLetter) {
  var tArr = [];

  for (var i = 0; i < thisArr.length; i++) {
    tArr.push(thisArr[i]);
  }

  tArr.push(newLetter);

  var pRoot = [];

  for (var i = 0; i < tArr.length; i++) {
    pRoot.push(tArr[i].letter);
  }

  var pRootString = pRoot.join('');

  //console.log("working root: " + pRootString);

  var rootTip = newLetter;

  //console.log(rootTip.letter + " is the letter; neighbors are: ");

  var possNews = [];

  for (var i = 0; i < allTiles.length; i++) {
    if (dist(allTiles[i].x, allTiles[i].y, rootTip.x, rootTip.y) <= 120 && tArr.indexOf(allTiles[i]) < 0) {
      possNews.push(allTiles[i]);
    }
  }

  for (var i = 0; i < possNews.length; i++) {
    var newChar = possNews[i].letter;
    //console.log(pRootString);
    //console.log(newChar);
    amIAWord(pRootString, newChar);
    if (amIARoot(pRootString, newChar)) {
      //console.log("I am passing along: " + pRootString + newChar);
      //console.log(tArr);
      //console.log(possNews[i]);
      rootCheck(tArr, possNews[i]);
    }
  }
}

function amIAWord (inRoot, inLet) {
  var maybeWord = inRoot.concat(inLet);

  //console.log("Word check: " + maybeWord);

  if (newDict.hasOwnProperty(maybeWord)) {
    console.log(maybeWord + " is a word!");
    if (madeWords.indexOf(maybeWord) < 0 && possList.indexOf(maybeWord) < 0) {
      possList.push(maybeWord);
    }
  }

}

function amIARoot (inRoot, inLet) {
  var maybeRoot = inRoot.concat(inLet);

  //console.log("Root check: " + maybeRoot);

  if (rootDict.hasOwnProperty(maybeRoot) && rootDict[maybeRoot] <= 2) {
    //console.log(maybeRoot + " is a root!");
    return true;
  }
}
// function rootCheckx(thisArr) {
//
//   var tArr = thisArr;
//
//   var pRoot = [];
//
//   for (var i = 0; i < tArr.length; i++) {
//     pRoot.push(tArr[i].letter);
//   }
//
//   var rootTip = tArr[tArr.length-1];
//
//   for (var i = 0; i < allTiles.length; i++) {
//     if (dist(allTiles[i].x, allTiles[i].y, rootTip.x, rootTip.y) <= 120) {
//
//       var newPRoot = pRoot;
//
//       newPRoot.push(allTiles[i].letter);
//       var pRootString = newPRoot.join('');
//
//       if (rootDict.hasOwnProperty(pRootString)) {
//         if (rootDict[pRootString] >= 2) {
//           console.log(pRootString);
//         }
//
//         if (rootDict[pRootString] <= 2) {
//           console.log("now checking: " + pRootString);
//           var newArr = tArr;
//           newArr.push(allTiles[i]);
//           rootCheck(newArr);
//         }
//       } else {
//         console.log("no good: " + pRootString);
//       }
//
//     }
//   }
// }

function listPossibles(pubRes) {
  console.log("just spun")
  for (var i = 0; i < allTiles.length; i++) {
    var rootChecker = [];
    console.log(rootChecker.length);
    rootCheck(rootChecker, allTiles[i]);
  }
  pubRes();
}

function publishResults() {
  console.log("publishing results");
  for (var i = 0; i < possList.length; i++) {
    console.log(possList[i]);
  }

  possList = [];
}

function listPossiblesx() {

  var pointerList = [];

  for (var i = 0; i < allTiles.length; i++) {
    var thisPointer = new TilePointer(allTiles[i]);
    for (var j = 0; j < allTiles.length; j++) {
      if (dist(allTiles[i].x, allTiles[i].y, allTiles[j].x, allTiles[j].y) <= 120 && i != j) {
        thisPointer.cousins.push(allTiles[j]);
      }
    }
    pointerList.push(thisPointer);
  }

  for (var i = 0; i < pointerList.length; i++) {
    var pointArr = [];
    pointArr.push(pointerList[i]);

    pointerCheck(pointArr);
  }

  for (var i = 0; i < possList.length; i++) {
    console.log(possList[i]);
  }
  possList = [];
  /*for (var i = 1; i < allTiles.length; i++){
    if (if (dist(allTiles[0].x, allTiles[0].y, allTiles[i].x, allTiles[i].y) <= 120)) {

      possList.push(allTiles[i]);
    }
  }

    for (var i = 0; i < possList.length; i++){

      var newRootArr = [allTiles[0].letter, allTiles[i].letter];
      var newRoot = join(newRootArr, "");
      console.log(newRoot);
      var searchWord = new RegExp('\\b'+ newRoot, 'g');
      var vsw = false;

      for (var q = 0; q<validator.length; q++) {
        if (validator[q].match(searchWord) && !vsw) {
          console.log(newRoot + " is a valid root: " + validator[q]);
          var proxList = [];
          for (var j = 0; j < allTiles.length; j++) {
            if (dist(allTiles[i].x, allTiles[i].y, allTiles[j].x, allTiles[j].y) <= 120) {
              proxList.push(allTiles[j]);
            }
          }
          var csb = new CheckBiz(newRoot, proxList);
          possCheck(csb);
          vsw = true;
        }
      }

      if (!vsw) {
        console.log(newRoot + " doesn't appear anywhere in the damn dictionary.")

      }
  }*/
}

function CheckBiz(st, possibles) {
  this.root = st;
  this.poss = possibles;
}

function possCheck(thingy) {
  for (var i = 0; i<thingy.poss.length; i++) {
    console.log(thingy.poss[i].letter);
  }
}

function restartGame() {
  score = 0;

  gameTime = 10800;

  madeWords = [];

  wordVals = [];

  allTiles = [];

  cTile = null;

  r1tiles = [];

  r2tiles = [];

  lineVals = [];

  gotLetters = [];

  makeTiles();

  gameState = 1;

}
function mousePressed() {
    endBreak = false;
}

// function touchStarted() {
//     endBreak = false;
// }

function mouseReleased() {
  if (gameState == 0) {
    startMR();
  } else if (gameState == 1 && endBreak == false) {
    gameMR();
  } else if (gameState == 2 && endBreak == false) {
    endMR();
  } else if (gameState == 3 || gameState == 4) {
    gameState = 1;
  } else if (gameState == 5) {
    gameState = 0;
  }
}

// function touchEnded() {
//   if (gameState == 0) {
//     startMR();
//   } else if (gameState == 1 && endBreak == false) {
//     gameMR();
//   } else if (gameState == 2 && endBreak == false) {
//     endMR();
//   } else if (gameState == 3 || gameState == 4) {
//     gameState = 1;
//   } else if (gameState == 5) {
//     gameState = 0;
//   }
// }

function startMR() {

  if (mouseX > 140 && mouseY > 550 && mouseX < 660 && mouseY < 620) {
    gameState = 1;
  }

  if (mouseX > 140 && mouseY > 650 && mouseX < 660 && mouseY < 720) {
    gameState = 5;
  }

}

function endMR() {

  if (mouseX > 250 && mouseY > 585 && mouseX < 550 && mouseY < 685) {
    restartGame();
  }
}

function gameMR() {

  if (mouseX > 635 && mouseY > 735 && mouseX < 795 && mouseY < 795) {
    gameState = 4;
  } else if (mouseX > 5 && mouseY > 735 && mouseX < 165 && mouseY < 795) {
    gameState = 3;
  }

  if (!moving) {
  console.log(md);
  var mx = mouseX - cw/2;
  var my = mouseY - ch/2;
  var mq = false; // this tells the tiles whether or not to move
  var mc = false;
 for (var i = 0; i < allTiles.length; i++) {
   if (dist(mx, my, allTiles[i].x, allTiles[i].y) <= t2Width/2) {
     if (gotLetters.indexOf(allTiles[i]) == gotLetters.length-1 && gotLetters.length > 0 && !ard) {
        mc = true;
       console.log("here")
     } else if (gotLetters.indexOf(allTiles[i]) < 0 && (gotLetters.length < 1 || dist(allTiles[i].x, allTiles[i].y, gotLetters[gotLetters.length-1].x, gotLetters[gotLetters.length-1].y) <= 120)) {
       gotLetters.push(allTiles[i]);
        allTiles[i].playVal = 1;
     }
     mq = true;
   }
 }
 //
 // if (!mq) {
 //   moving = true;
 // }

 var dc = false;

 if (md && gotLetters.length >= 2) {
   dc = true;
 }

if (dc || mc) {
  checkWord();
}

  md = false;

  ard = false;

  tempHold = 0;

  lineVals = [];

 return false;
 }
}


function mouseDragged() {
  if (gameState == 1) {
    gameMD();
  }
  return false;
}

// function touchMoved() {
//   if (gameState == 1) {
//     gameMD();
//   }
//   return false;
// }

function gameMD() {
  if (!moving) {
  var mx = mouseX - cw/2;
  var my = mouseY - ch/2;

  var tempArr = [mx, my];
  lineVals.push(tempArr);

  for (var i = 0; i < allTiles.length; i++) {
    if (dist(mx, my, allTiles[i].x, allTiles[i].y) <= t2Width/2) {

      if (gotLetters.indexOf(allTiles[i]) < 0 && (gotLetters.length < 1 || dist(allTiles[i].x, allTiles[i].y, gotLetters[gotLetters.length-1].x, gotLetters[gotLetters.length-1].y) <= 120)) {
        gotLetters.push(allTiles[i]);
        allTiles[i].playVal = 1;
        tempHold++;
        console.log(tempHold);
        ard = true;
      } else if (gotLetters.indexOf(allTiles[i]) == gotLetters.length - 2) {
        gotLetters[gotLetters.length - 1].playVal = 0;
        gotLetters.splice(gotLetters.length - 1, 1);
      }
    }
  }

  if (tempHold >= 2) {
    md = true;
  }


  return false;
  }
}

function keyPressed() {
  if (gameState == 3) {
    restartGame();
  }
}
