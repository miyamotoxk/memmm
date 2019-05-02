// your logic here
console.log("hello");
console.log(null);

const gameTime = 8;

const game = {
  time: gameTime,
  level: 1,
  score: 0,
  firstCard: null,
  secondCard: null
};

let timerInterval; //need to declear first

const beginBtn = document.getElementsByClassName('game-stats__button')[0];
const timeBar = document.getElementsByClassName('game-timer__bar')[0];

beginBtn.addEventListener('click',handleBegin);

const timer = () => {
  game.time -= 1;
  updateTimer();
  if (game.time === 0) {
    setTimeout(gameOver,50);
    //timeOver();
  }
}

function handleBegin() {
  //TODO
  updateTimer();
  clearInterval(timerInterval);
  timerInterval = setInterval(timer, 1000);
  beginBtn.removeEventListener("click", handleBegin);
  beginBtn.textContent = "End Game";
  beginBtn.addEventListener("click", gameOver);
  let cards = classArray("card"); //TODO
  cards.forEach(card => {
    card.addEventListener("click",handleFlip);
    card.classList.remove('card--flipped');
  });
};

function handleFlip() {
  //TODO
  console.log("click");
  this.className += ' card--flipped';
  this.removeEventListener("click",handleFlip);
  if (game.firstCard===null){
    game.firstCard = this;
  } else {
    game.secondCard = this;
    checkCards();
  }
};

function checkCards() {
  let first = game.firstCard;
  let second = game.secondCard;
  let increasement = 10 * 2 ** game.level;
  if(first.getAttribute('data-tech')===second.getAttribute('data-tech')){
    game.score += increasement;
    if (document.getElementsByClassName("card").length===document.getElementsByClassName("card--flipped").length){
      levelUp(); //TODO
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

function gameOver () {
  console.log("Time over");
  clearInterval(timerInterval);
  beginBtn.removeEventListener("click", gameOver);
  beginBtn.textContent = "New Game";
  beginBtn.addEventListener("click", handleBegin);
  let cards = classArray("card");
  cards.forEach(card => {
    card.removeEventListener("click",handleFlip);
  });
  alert(`Congratulation. Your score is ${game.score}.`);
  resetGame();
};

function updateTimer() {
  timeBar.textContent = `${game.time}s`;
  timeBar.style.width = (game.time/gameTime * 100).toFixed(2) + '%';
}

function levelUp() {
  //TODO
  console.log("level up");
}

function placeCards() {
  //TODO

}

function resetGame() {
  game.time = gameTime;
  game.level = 1;
  game.score = 0;
  game.firstCard = null;
  game.secondCard = null;
}

function classArray(className) {
  let nodelist = document.getElementsByClassName(className);
  let cards = [];
  for (let i=0;i<nodelist.length;i++) {
    cards[i] = nodelist[i];
  }
  return cards;
}