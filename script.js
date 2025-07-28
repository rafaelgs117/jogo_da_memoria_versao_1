let cards = [];
let flippedCards = [];
let matchedCards = 0;
let lockBoard = false;
let isGameRunning = false;

let timerInterval;
let secondsElapsed = 0;

const imageUrls = [
  'img/halo.png',
  'img/minecraft.png',
  'img/halflife.png',
  'img/gta.png',
  'img/fortnite.png',
  'img/zelda.png',
  'img/reddead.png',
  'img/amongus.png',
  'img/sun.png',
  'img/bf1.png',
  'img/doom.png',
  'img/cath.png',
  'img/danji.png',
  'img/fallout.png',
  'img/forza.png',
  'img/mario.png',
  'img/pgr.png',
  'img/skyrim.png',
  'img/vargil.png',
  'img/truk.png'
];

// Função para sortear N imagens aleatórias do array
function getRandomImages(arr, n) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

function startGame(difficulty) {
  if (isGameRunning) {
    alert('Termine o jogo atual antes de trocar a dificuldade!');
    return;
  }
  isGameRunning = true;

  const combinations = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20;

  cards = [];
  matchedCards = 0;
  flippedCards = [];
  lockBoard = false;

  const gameBoard = document.getElementById('game-board');
  gameBoard.innerHTML = '';

  const msg = document.getElementById('message');
  if (msg) msg.style.display = 'none';

  window.lastDifficulty = difficulty;

  // Reinicia e inicia o temporizador
  clearInterval(timerInterval);
  secondsElapsed = 0;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    secondsElapsed++;
    updateTimerDisplay();
  }, 1000);

  let selectedImages;
  if (difficulty === 'hard') {
    // Para difícil, usa todas as imagens (20)
    selectedImages = [...imageUrls];
  } else {
    // Fácil e médio: sorteia aleatório N imagens entre as 20 disponíveis
    selectedImages = getRandomImages(imageUrls, combinations);
  }

  // Duplica as imagens para formar pares e embaralha
  const gameImages = [...selectedImages, ...selectedImages];
  cards = gameImages.sort(() => 0.5 - Math.random());

  // Cria as cartas no DOM
  cards.forEach((image) => {
    const card = document.createElement('div');
    card.classList.add('card');
    if (difficulty === 'medium') card.classList.add('medium');
    if (difficulty === 'hard') card.classList.add('hard');

    card.setAttribute('data-image', image);

    const inner = document.createElement('div');
    inner.classList.add('card-inner');

    const front = document.createElement('div');
    front.classList.add('card-front');

    const back = document.createElement('div');
    back.classList.add('card-back');
    back.style.backgroundImage = `url(${image})`;

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
  });
}

// Função para virar a carta ao clicar
function flipCard() {
  if (lockBoard || flippedCards.length >= 2 || this.classList.contains('flipped')) return;

  this.classList.add('flipped');
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    lockBoard = true;
    setTimeout(() => {
      checkMatch();
      lockBoard = false;
    }, 1000);
  }
}

// Verifica se as duas cartas viradas são iguais
function checkMatch() {
  const [firstCard, secondCard] = flippedCards;
  const img1 = firstCard.getAttribute('data-image');
  const img2 = secondCard.getAttribute('data-image');

  if (img1 === img2) {
    matchedCards += 2;
    if (matchedCards === cards.length) {
      const msg = document.getElementById('message');
      if (msg) {
        msg.textContent = `🎉 Parabéns! Você ganhou! Tempo: ${formatTime(secondsElapsed)}`;
        msg.style.display = 'block';
      }
      clearInterval(timerInterval);
      isGameRunning = false;
    }
  } else {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
  }
  flippedCards = [];
}

// Reinicia o jogo mantendo a última dificuldade
function restartGame() {
  if (isGameRunning) {
    alert('Termine o jogo atual antes de reiniciar!');
    return;
  }
  const board = document.getElementById('game-board');
  board.style.opacity = 0;

  setTimeout(() => {
    const difficulty = window.lastDifficulty || 'easy';
    startGame(difficulty);
    board.style.opacity = 1;
  }, 500);
}

// Atualiza o display do temporizador no HTML
function updateTimerDisplay() {
  const timer = document.getElementById('timer');
  if (!timer) return;

  timer.textContent = `⏱ Tempo: ${formatTime(secondsElapsed)}`;
}

// Formata segundos para mm:ss
function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}
