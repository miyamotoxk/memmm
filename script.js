
const gameTime = 60;

// All card type array for card placing.
const cardType = ['html5', 'css3', 'js', 'react', 'nodejs', 'sass', 'linkedin', 'heroku', 'github', 'aws'];

// Constant for game.
const game = {
  time: gameTime,
  level: 1,
  score: 0,
  firstCard: null,
  secondCard: null
};

let timerInterval; // Need to be declared first.

const beginBtn = document.getElementsByClassName('game-stats__button')[0];
const timeBar = document.getElementsByClassName('game-timer__bar')[0];

beginBtn.addEventListener('click',handleBegin);

// Constant for timer.
const timer = () => {
  game.time -= 1;
  updateTimer();
  if (game.time === 0) {
    gameOver();
  }
}

// Begin a game.
function handleBegin() {
  updateTimer();
  placeCards();
  timerInterval = setInterval(timer, 1000);
  beginBtn.removeEventListener("click", handleBegin);
  beginBtn.textContent = "End Game";
  beginBtn.addEventListener("click", gameOver);
  let cards = classArray("card");
  cards.forEach(card => {
    card.addEventListener("click",handleFlip);
  });
};

// Flip a card.
function handleFlip() {
  this.classList.add('card--flipped');
  this.removeEventListener("click",handleFlip);
  if (game.firstCard===null){
    game.firstCard = this;
  } else {
    game.secondCard = this;
    checkCards();
  }
};

// Check two fliped cards.
function checkCards() {
  let first = game.firstCard;
  let second = game.secondCard;
  let increasement = game.level ** 2 * game.time;
  if(first.getAttribute('data-tech')===second.getAttribute('data-tech')){
    game.score += increasement;
    updateScore();
    if (document.getElementsByClassName("card").length===document.getElementsByClassName("card--flipped").length){
      if(game.level===3) {
        gameOver();
      } else {
        // levelUp();
        setTimeout(levelUp,10);
      }
    }
  } else {
    setTimeout(()=>{
      first.classList.remove('card--flipped');
      second.classList.remove('card--flipped');
    }, 500);
    first.addEventListener("click",handleFlip);
    second.addEventListener("click",handleFlip);
  }
  game.firstCard = game.secondCard = null;
};

// Finish a game.
function gameOver () {
  updateScore();
  clearInterval(timerInterval);
  beginBtn.removeEventListener("click", gameOver);
  beginBtn.textContent = "New Game";
  beginBtn.addEventListener("click", handleBegin);
  let cards = classArray("card");
  cards.forEach(card => {
    card.removeEventListener("click",handleFlip);
  });
  setTimeout(alert(`Congratulation. Your score is ${game.score}.`),10);
  resetGame();
};

// Update the time state on the page.
function updateTimer() {
  timeBar.textContent = `${game.time}s`;
  timeBar.style.width = (game.time/gameTime * 100).toFixed(2) + '%';
}

// Update the score on the page.
function updateScore() {
  document.getElementsByClassName("game-stats__score--value")[0].textContent = game.score;
}

// Change level of game, set a timer, and place cards.
function levelUp() {
  console.log("level up");
  clearInterval(timerInterval);
  game.time = gameTime;
  game.level += 1;
  updateTimer();
  document.getElementsByClassName("game-stats__level--value")[0].textContent = game.level;
  timerInterval = setInterval(timer, 1000);
  placeCards();
  let cards = classArray("card");
  cards.forEach(card => {
    card.addEventListener("click",handleFlip);
  });
}

// Place cards into game-board.
function placeCards() {
  let board = document.getElementsByClassName("game-board")[0];
  while (board.lastChild) {
    board.removeChild(board.lastChild);
  }
  if (game.level === 1) {
    board.setAttribute('style', 'grid-template-columns: 1fr 1fr');
    let cards = addPair(2);
    for (let i=0;i<3;i++) {
      board.appendChild(addCard(cards.splice(Math.floor(Math.random()*cards.length),1)[0]));
    }
    board.appendChild(addCard(cards[0]));
  } else if (game.level === 2) {
    board.setAttribute('style', 'grid-template-columns: repeat(4, 1fr)');
    let cards = addPair(8);
    for (let i=0;i<15;i++) {
      board.appendChild(addCard(cards.splice(Math.floor(Math.random()*cards.length),1)[0]));
    }
    board.appendChild(addCard(cards[0]));
  } else {
    board.setAttribute('style', 'grid-template-columns: repeat(6, 1fr)');
    let cards = addPair(18);
    for (let i=0;i<35;i++) {
      board.appendChild(addCard(cards.splice(Math.floor(Math.random()*cards.length),1)[0]));
    }
    board.appendChild(addCard(cards[0]));
  }
}

// Creat an array for less than 100 pairs.
function addPair(pairNumber) {
  let litteNumber = pairNumber % 10;
  let bigNumber = (pairNumber - litteNumber) / 10;
  let cards = addPairUnder10(litteNumber);
  if (bigNumber!==0) {
    for(let i=0;i<bigNumber;i++) {
      let card10 = addPairUnder10(10);
      cards = cards.concat(card10); // Add 10 pairs to existing cards array.
    }
  }
  return cards;
}

// Creat an array for no more than 10 pairs.
function addPairUnder10(pairNumber) {
  let cards = [];
  let temp = Object.assign([], cardType);
  for(let i=0;i<pairNumber;i++) {
    cards[2*i] = cards[2*i+1] = temp.splice(Math.floor(Math.random()*temp.length),1)[0];
  }
  return cards;
}

// Creat a card div.
function addCard(type) {
  let card = document.createElement('div');
  card.setAttribute('class', `card ${type}`);
  card.setAttribute('data-tech', type);
  let front = document.createElement('div');
  front.setAttribute('class', 'card__face card__face--front');
  let back = document.createElement('div');
  back.setAttribute('class', 'card__face card__face--back');
  card.appendChild(front);
  card.appendChild(back);
  return card;
}

// Reset the game state.
function resetGame() {
  game.time = gameTime;
  game.level = 1;
  game.score = 0;
  game.firstCard = null;
  game.secondCard = null;
}

// Return an array with given class name.
function classArray(className) {
  let nodelist = document.getElementsByClassName(className);
  let cards = [];
  for (let i=0;i<nodelist.length;i++) {
    cards[i] = nodelist[i];
  }
  return cards;
}