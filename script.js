// References: Aug 9, 2025
// Inspired by Langara course all labs (especially combining two labs from the course).
// I also used W3Schools and watched some similar YouTube videos for bubble pop games
// (but not for the bet with bubble pop idea). Details are provided in my report file.
// I also used some recommendations from and was inspired by my instructor, Steven-Bojiang Ma,
// whose creative teaching helped shape this game. All code, logic, and design are original and
// written by Amir Partow for the Langara 1045 course. Most of the work is based on my own
// ideas. If I used ideas from YouTube or labs, I always changed and adapted them.


function addHighlight(element) {
  element.classList.add('highlight');
}
function removeHighlight(element) {
  element.classList.remove('highlight');
}

// group document Object Model 
let documentObjectModel = {
  startButton: document.getElementsByClassName('start-btn')[0], // get the start button from the page
  betInput: document.getElementById('betAmount'), // get the input box for entering the bet amount
  placeBetButton: document.getElementById('placeBetBtn'), // get the button for placing a bet
  balanceDisplay: document.getElementById('balanceAmount'), // get the place where balance is shown
  messageBox: document.getElementById('betMessage'), // get the box for showing messages
  resetHighScoreBtn: document.getElementsByClassName('resetScore-btn')[0], // get the button to reset high score
  highScoreDisplay: document.getElementsByClassName('highScore')[0], // get the place where high score is shown
  winSound: document.getElementById('winSound'), // get the sound for win
  gameOverSound: document.getElementById('gameOverSound'), // get the sound for game over
  popSound: document.getElementById('popSound'),           // bubble pop sound for all levels
  lastLevelWinSound: document.getElementById('lastLevelWinSound')  // only for level 5 win
}

// group game - variables 
let gameState = {
  poppedCount: 0, // # of bubbles popped
  missedCount: 0, //# of bubbles missed
  currentBubbleNumber: 0, //The current bubble number
  balance: 0, // user balance
  lastBet: 0, // bet amount
  level: 1,
  gameEnded: false, //has not ended yet
  betPlaced: false // is not placed yet
}

let highScore = Number(localStorage.getItem('highScore')) || 0; //Gets high score - browser memory

// set high score and balance in document Object Model
documentObjectModel.highScoreDisplay.textContent = highScore; // show high score
documentObjectModel.balanceDisplay.textContent = gameState.balance; //show balance
documentObjectModel.messageBox.style.display = 'none'; // hide message box at start

documentObjectModel.resetHighScoreBtn.addEventListener('click', resetHighScore);
function resetHighScore() {
  localStorage.setItem('highScore', '0'); //Save 0 as the high score in browser memory
  highScore = 0; // at  initialize
  documentObjectModel.highScoreDisplay.textContent = '0'; //for showing
}

// array of settings for each level 
let levelSettings = [
  { total: 100, neededToWin: 10, radius: 100, speed: 2.4, maxMissed: 4 }, // level 1
  { total: 100, neededToWin: 15, radius: 100, speed: 2.6, maxMissed: 4 }, // level 2
  { total: 100, neededToWin: 20, radius: 100, speed: 2.8, maxMissed: 6 }, // level 3
  { total: 100, neededToWin: 25, radius: 100, speed: 3.0, maxMissed: 8 }, // level 4
  { total: 100, neededToWin: 30, radius: 100, speed: 3.2, maxMissed: 10 } // level 5
];

// settings
function getLevelSettings(level) {
  let maxLevel = 5;
  if (level > maxLevel) level = maxLevel;
  return levelSettings[level - 1]; // array index start from 0, so minus 1
}

documentObjectModel.placeBetButton.addEventListener('click', placeBet)
function placeBet() {
  let amount = Number(documentObjectModel.betInput.value);
  if (isNaN(amount) || amount <= 0) {
    documentObjectModel.messageBox.innerHTML = 'Please enter a valid positive number';
    documentObjectModel.messageBox.style.display = 'block';
    return;
  }

  if (gameState.balance === 0) {
    gameState.balance = amount; //Set  balance
  } else {
    gameState.balance = gameState.balance + amount; //add balance
  }

  gameState.lastBet = amount; //Save bet
  gameState.balance = gameState.balance - gameState.lastBet; // deduct
  documentObjectModel.balanceDisplay.textContent = gameState.balance.toFixed(2); // show balance
  gameState.betPlaced = true;// if user spend money game will start
  documentObjectModel.messageBox.style.display = 'none'; // hide message
  startGame();
};

documentObjectModel.startButton.addEventListener('click', displayGameButton);
function displayGameButton() {
  document.getElementsByClassName('main-game')[0].style.display = 'none'; // Hide the main game menu
  document.getElementsByClassName('score-popped')[0].style.display = 'flex'; // Show User Interface     POP
  document.getElementsByClassName('score-missed')[0].style.display = 'flex'; // Show User Interface     MISSED
  document.getElementsByClassName('score-level')[0].style.display = 'flex'; // Show User Interface      LEVELS
  document.getElementsByClassName('score-high')[0].style.display = 'flex'; // Show User Interface       HIGH SCORE
  document.getElementsByClassName('bet-section')[0].style.display = 'flex'; // Show User Interface      BET
  document.getElementsByClassName('balance-box')[0].style.display = 'flex'; // Show User Interface      BALACE
  documentObjectModel.messageBox.style.display = 'block';
  documentObjectModel.messageBox.innerHTML = 'Enter your bet and press Click to start.';
  document.getElementsByClassName('bubble-line')[0].style.display = 'block';  // show the footer at first
  document.getElementById('footer').style.display = 'none'; // Hide the footer for rest of the game
};

function startGame() {
  if (gameState.lastBet > 0 && gameState.balance >= 0 && gameState.betPlaced) { // is user put money game will start 
  } else {
    documentObjectModel.messageBox.innerHTML = 'You must place a valid bet to start!'; // if not, noway game start - first money
    documentObjectModel.messageBox.style.display = 'block'; // show the message box
    return;
  }

  let settings = getLevelSettings(gameState.level); // start with levels buts star level 1
  gameState.poppedCount = 0;   // reset each level # of bubbles popped
  gameState.missedCount = 0;   // reset each level # of bubbles missed
  gameState.currentBubbleNumber = 0;  // reset the current bubble number
  gameState.gameEnded = false; //  game can  move to the next level

  documentObjectModel.messageBox.style.display = 'none'; //hide message box
  document.getElementsByClassName('score')[0].textContent = gameState.poppedCount; // reset score display
  document.getElementsByClassName('missed')[0].textContent = gameState.missedCount;  // reset missed display
  document.getElementsByClassName('level')[0].textContent = gameState.level; // reset level display

  let bubbles = document.getElementsByClassName('bubble');
  while (bubbles.length > 0) { // when the all bubble for each level poped , no bubbles show on screen 
    bubbles[0].remove(); // remove rest
  }
  createBubble(settings);// creat new bubble for next level
}


function createBubble(settings) {
  if (gameState.currentBubbleNumber >= settings.total || gameState.gameEnded) return; // if bubbles is 100 based on(let settings)  || game is over, exit 

  let screenWidth = window.innerWidth; // find the width of the screen
  let minSize = 150;
  let maxSize = 100;
  let totalLevels = 5;
  let shapeLevel = gameState.level; // Use the current level to decide bubble size & shape

  if (shapeLevel > totalLevels) shapeLevel = 5; // after one round, stay on last level
  let size = maxSize - (shapeLevel - 1) * 15; //
  let div = document.createElement('div'); // Create a box in js memory, but it is not visible on the screen yet
  div.style.position = 'absolute'; // allow the box to be placed anywhere on the screen by 'absolute'
  div.style.left = Math.floor(Math.random() * (screenWidth - size)) + 'px'; // bubbles come at a random place from left to right
  div.style.top = '0px'; ///for bubbles come at top

  // Reset all styles b/c i want to use again and again
  div.style.transform = '';             // remove rotation from the bubble
  div.style.border = '';                // remove border from the bubble
  div.style.borderRadius = '';          // make the bubble's radius same as others 
  div.style.width = '';                 // remove the bubble's width styles
  div.style.height = '';                // remove the bubble's height styles
  div.style.backgroundColor = '';       // remove the bubble's background color

  // Random color
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);
  let color = 'rgb(' + r + ',' + g + ',' + b + ')';

  // different shapes
  switch (shapeLevel) {
    case 1:  // Circle
      div.style.transform = 'rotate(0deg)';      // no turn
      div.style.width = size + 'px';             // set width
      div.style.height = size + 'px';            // set height
      div.style.backgroundColor = color;         // set color
      div.style.borderRadius = '50%';            // make a circle
      break;

    case 2:  // Square
      div.style.transform = 'rotate(20deg)';     // turn a bit
      div.style.width = size + 'px';             // set width
      div.style.height = size + 'px';            // set height
      div.style.backgroundColor = color;         // set color
      div.style.borderRadius = '15px';              // no round corners 
      break;

    case 3: // Triangle 
      div.style.transform = 'rotate(-10deg)';    // turn a bit
      div.style.width = '0';                     //  no width
      div.style.height = '0';                    //  no height
      div.style.borderLeft = (size / 2) + 'px solid transparent';   // left side 
      div.style.borderRight = (size / 2) + 'px solid transparent';  // right side 
      div.style.borderBottom = size + 'px solid ' + color;          // bottom side and set color
      break;

    case 4:  // Tall Rectangle 
      div.style.transform = 'rotate(20deg)';     // turn a bit
      div.style.width = (size / 2) + 'px';       // width
      div.style.height = (size * 1.5) + 'px';    // height
      div.style.backgroundColor = color;         // set color
      div.style.borderRadius = '15px';           // round corners 
      break;
    case 5:
      // Oval
      div.style.transform = 'rotate(0deg)';    // no turn
      div.style.width = (size * 1.4) + 'px';     // Wide 
      div.style.height = (size * 0.7) + 'px';    // height
      div.style.backgroundColor = color;         // set color
      div.style.borderRadius = '50% / 50%';      // make a oval 
      break;

    default:
      // Circle
      div.style.transform = 'rotate(0deg)';      // no trun
      div.style.width = size + 'px';             // width
      div.style.height = size + 'px';            // height
      div.style.backgroundColor = color;         // color
      div.style.borderRadius = '50%';            // make circle
      break;
  }

  div.dataset.number = gameState.currentBubbleNumber;  // store the bubble # in div for reference
  gameState.currentBubbleNumber = gameState.currentBubbleNumber + 1; // increase bubble # by 1 for the next bubble
  document.body.appendChild(div);                // add the bubble in div and show in the screen

  let popped = false;                            // keeps track if a bubble is already popped or not

  div.addEventListener('click', handleBubbleClick)
  function handleBubbleClick() {                 // when the bubble is clicked

    if (!gameState.gameEnded) {                     // if the game is not over
      if (!popped) {                                // and a bubble has not been popped yet
        popped = true;                              // mark the bubble as popped

        if (documentObjectModel.popSound) {                         // if there is a pop sound
          documentObjectModel.popSound.currentTime = 0;              // no sound for start
          documentObjectModel.popSound.play();                       // play popping sound
        }
        div.remove();                            // remove bubble from page

        gameState.poppedCount = gameState.poppedCount + 1;           // increase the popped bubble count
        document.getElementsByClassName('score')[0].textContent = gameState.poppedCount; // update score on the screen

        if (gameState.poppedCount > highScore) {           // if current score is higher than high score
          highScore = gameState.poppedCount;               // set new high score
          localStorage.setItem('highScore', highScore); // save high score to browser storage
          documentObjectModel.highScoreDisplay.textContent = highScore;  // show new high score on screen
        }

        if (gameState.poppedCount >= settings.neededToWin) {  // if enough bubbles are popped to win
          endGame(true);    // end game as a win
        }
      }
    }
  }

  let position = 0; // Start at the top 
  let lineY = document.getElementsByClassName('bubble-line')[0].getBoundingClientRect().top; //bubble should ____stop____ to explain get the Y position vertical location of the bubble line 
  let interval = setInterval(moveBubble, 15); // Move the bubble down by the speed 15 set

  function moveBubble() {
    let moveSize = size; //how far the bubble moves in one jump


    if (position + moveSize > lineY) {  // if the bubble passed the line
      clearInterval(interval); // stop moving

      if (!popped) { // if the bubble was NOT popped by user

        gameState.missedCount = gameState.missedCount + 1; // add 1 to missed bubbles
        document.getElementsByClassName('missed')[0].textContent = gameState.missedCount; // update missed counter on screen

        if (gameState.missedCount > settings.maxMissed) { // if too many missed bubbles, end the game
          endGame(false); // user lost
        }
      }
      div.remove(); // remove the bubble from screen
    } else if (gameState.gameEnded) { // if game is over
      clearInterval(interval); // stop moving
      div.remove(); // remove bubble from screen
    } else {  // otherwise, keep moving bubbles down by speed amount
      position = position + settings.speed; // add speed to position
      div.style.top = position + 'px'; // update bubble's position on screen
    }
  }

  setTimeout(callAnimateBubble, 600);   // after 600 sec, make a next bubble
  function callAnimateBubble() {
    createBubble(settings); // start the next bubble
  }
}

function endGame(won) { // end the game and show the result
  gameState.gameEnded = true; // set game as ended
  documentObjectModel.messageBox.style.display = 'block'; // show message box
  documentObjectModel.messageBox.innerHTML = ''; // clear old message

  let addBtn = document.createElement('button'); // create add money button
  addBtn.textContent = 'Add Money'; // set button text
  addBtn.className = 'game-btn'; // set button style
  addBtn.onclick = function () { // add click event for add money
    documentObjectModel.betInput.value = ''; // clear bet input
    documentObjectModel.messageBox.innerHTML = 'Enter a new bet amount and press Click.'; // show message
  };

  let playBtn = document.createElement('button'); // create continue button
  playBtn.textContent = 'Continue'; // set button text
  playBtn.className = 'game-btn'; // set button style
  playBtn.onclick = function () { // add click event for continue
    if (gameState.balance > 0) { // if player has money
      if (won && gameState.level < 5) { // if player won and not last level, go to next
        gameState.level++; // next level
      }
      gameState.betPlaced = true; // set bet as placed
      documentObjectModel.messageBox.style.display = 'none'; // hide message box
      startGame(); // start new game
    } else { // if balance is 0
      documentObjectModel.messageBox.innerHTML = 'Your balance is 0. Add more money to play again.'; // show message
      documentObjectModel.messageBox.appendChild(addBtn); // show add money button
    }
  };

  let cashOutBtn = document.createElement('button'); // create cashout button
  cashOutBtn.textContent = 'Cash Out'; // set button text
  cashOutBtn.className = 'game-btn'; // set button style

  cashOutBtn.onclick = function () { // add click event for cash out
    let cashAmount = gameState.balance.toFixed(2); // get the balance from game state object, make it look like 0.00
    documentObjectModel.balanceDisplay.textContent = gameState.balance.toFixed(2); // show balance on the page, use document Object Modelobject
    gameState.level = 1; // set the level in game state to one
    documentObjectModel.messageBox.innerHTML = 'Congratulations! You cashed out ' + cashAmount + '! Add money to play again.'; // show message using document Object Model
    documentObjectModel.messageBox.appendChild(addBtn); // add the add money button in the message box, use document Object Model 
  };

  if (won) { // if player won
    if (gameState.level >= 5) { // last level, special sound
      if (documentObjectModel.lastLevelWinSound) {
        documentObjectModel.lastLevelWinSound.currentTime = 0;
        documentObjectModel.lastLevelWinSound.play();
      }
    } else { // not last level, normal win sound
      if (documentObjectModel.winSound) {
        documentObjectModel.winSound.currentTime = 0;
        documentObjectModel.winSound.play();
      }
    }
    gameState.balance = gameState.balance + gameState.lastBet * 2; // double the bet and add to balance

    if (gameState.level >= 5) { // if player finished last level
      documentObjectModel.messageBox.innerHTML = 'Congratulations! You finished all levels.<br>'; // show message
      documentObjectModel.messageBox.innerHTML += 'You can cash out your money, or play again.<br>See you!'; // show extra information
      documentObjectModel.messageBox.appendChild(document.createElement('br')); // add a line break
      documentObjectModel.messageBox.appendChild(playBtn); // show the continue button
      documentObjectModel.messageBox.appendChild(cashOutBtn); // show the cashout button
    } else { // not last level
      documentObjectModel.messageBox.innerHTML = 'You WON Level ' + gameState.level + '! Bet doubled.<br>Continue to next level?'; // show win message for this level
      documentObjectModel.messageBox.appendChild(document.createElement('br')); // add a line break
      documentObjectModel.messageBox.appendChild(playBtn); // show the continue button
    }
  } else { // if player lost
    let chance = Math.random(); // basd on LUCK
    if (chance > 0.5) { // if lucky, get 1.5x bet back
      gameState.balance = gameState.balance + gameState.lastBet * 1.5; // add 1.5 times the bet to balance
      documentObjectModel.messageBox.innerHTML = 'You lost, but got lucky! 1.5x returned.<br>Continue?'; // show lucky message
      documentObjectModel.messageBox.appendChild(document.createElement('br')); // add a line break
      documentObjectModel.messageBox.appendChild(playBtn); // show continue button
    } else { // not lucky
      if (documentObjectModel.gameOverSound) { // check if game over sound exists
        documentObjectModel.gameOverSound.currentTime = 0; // reset the sound
        documentObjectModel.gameOverSound.play(); // play the sound
      }
      gameState.balance = 0; // set balance to 0
      gameState.level = 1;  // reset level
      documentObjectModel.messageBox.innerHTML = 'You lost. Balance is 0.<br>Add money to play again.'; // show lose message
      documentObjectModel.messageBox.appendChild(document.createElement('br')); // add a line break
      documentObjectModel.messageBox.appendChild(addBtn); // show add money button
    }
  }
  documentObjectModel.balanceDisplay.textContent = gameState.balance.toFixed(2); // update balance display on screen
  gameState.betPlaced = false; // set betPlaced in game state to false
}

//endgame function, call it later
let oldEndGame = endGame;
endGame = function (won) {
  oldEndGame.apply(this, arguments); // run old endgame
  if (won && gameState.level >= 5) {   // if player wins level 5 or more
    showEmoji(); // show emoji celebration
  }
}

// show emoji 
function showEmoji() {
  let emojis = [
    '🎉', '🎊', '🥳', '✨', '😃', '🎇', '🎉', '🎊', '🤩', '💥', '🎆', '😆', '🎉', '🎊', '🎈', '🍾',
    '🎉', '🎊', '🥳', '✨', '😃', '🎇', '🎉', '🎊', '🤩', '💥', '🎆', '😆', '🎉', '🎊', '🎈', '🍾',
    '🎉', '🎊', '🥳', '✨', '😃', '🎇', '🎉', '🎊', '🤩', '💥', '🎆', '😆', '🎉', '🎊', '🎈', '🍾'
  ];

  let centerX = window.innerWidth / 2; // center x of screen
  let centerY = window.innerHeight / 2; // center y of screen
  let emojiCount = 300; // how many emojes

  // bottom line 
  let bubbleLineElem = document.getElementsByClassName('bubble-line')[0];
  let maxY = window.innerHeight - 50; // default bottom
  if (bubbleLineElem && bubbleLineElem.getBoundingClientRect) {
    maxY = bubbleLineElem.getBoundingClientRect().top - 40; // not go under line
    if (maxY < 0) maxY = 0;
  }

  //make one emoji
  function createEmoji(i) {
    let emoji = document.createElement('div'); // make emoji box
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)]; // pick emoji
    emoji.style.position = 'fixed'; // put on screen
    emoji.style.left = centerX + 'px'; // start center x
    emoji.style.top = centerY + 'px'; // start center y
    emoji.style.fontSize = (28 + Math.random() * 40) + 'px'; // random size
    emoji.style.zIndex = 10000; // on top
    emoji.style.transition = 'all 2.2s cubic-bezier(.12,1.04,.56,.93)'; // move smooth
    emoji.style.userSelect = 'none'; // not selectable
    emoji.style.pointerEvents = 'none'; // not clickable
    emoji.style.willChange = 'transform, opacity, left, top'; // for browser

    document.body.appendChild(emoji); // show on page

    // random place to go
    let endX = Math.random() * (window.innerWidth - 50); // random left/right
    let endY = Math.random() * maxY; // random up/down

    emoji.offsetWidth; //browser update

    // move emoji
    setTimeout(moveEmoji, Math.random() * 200);
    function moveEmoji() {
      emoji.style.left = endX + 'px'; // new x
      emoji.style.top = endY + 'px'; // new y
      emoji.style.opacity = 0.90; // little see through
      emoji.style.transform = 'rotate(' + (Math.random() * 720 - 360) + 'deg)'; // random spin
    }

    // solid
    setTimeout(solidEmoji, 2300);
    function solidEmoji() {
      emoji.style.transition = '';
      emoji.style.opacity = 1;
    }

    // remove emoji 
    setTimeout(removeEmoji, 5000);
    function removeEmoji() {
      emoji.remove();
    }
  }

  // delay 
  for (let i = 0; i < emojiCount; i++) {
    setTimeout(createEmojiTimeout, i * 7); // 7ms for each emoji
    function createEmojiTimeout() {
      createEmoji(i); // make one emoji
    }
  }
}

