const board = document.getElementById('board');
const timerDisplay = document.getElementById('time');
const resetButton = document.getElementById('reset');
const gameTitle = document.getElementById('gameTitle');
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let matchedCards = 0;
let timerInterval;
let seconds = 0;
let currentPhase = 1;

let playerScore = 0;

function sendScoreToDatabase() {
    const payload = {
      score: playerScore,
      playerId: "12345"
    };
  
    fetch("https://api.example.com/scores", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })
        .then((response) => {
        if (response.ok) {
            console.log("Pontuação enviada com sucesso!");
        } else {
            console.error("Erro ao enviar pontuação.");
        }
        })
        .catch((error) => console.error("Erro de rede:", error));
}

const cardValues = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

function getGridDimensions(phase) {
    switch(phase) {
        case 1: return { rows: 2, cols: 4 };
        case 2: return { rows: 3, cols: 4 };
        case 3: return { rows: 4, cols: 4 };
        default: return { rows: 2, cols: 4 };
    }
}

function updateTitle() {
    gameTitle.innerText = `Fase ${currentPhase}`;
}

const colors = [
    '#418e8e', '#f07848', '#69d2cd', '#0f4ea8', '#FF8C33', '#8C33FF',
    '#33FFF0', '#F0FF33', '#FF5733', '#33A6FF', '#FF3333', '#A6FF33'
];

function createBoard() {
    board.innerHTML = '';
    matchedCards = 0;

    updateTitle();
    const { rows, cols } = getGridDimensions(currentPhase);
    const numPairs = (rows * cols) / 2;
    const cardArray = [...cardValues.slice(0, numPairs), ...cardValues.slice(0, numPairs)];
    cards = shuffleArray(cardArray);

    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    const cardColorMap = {};
    cardArray.slice(0, numPairs).forEach((value, index) => {
        cardColorMap[value] = colors[index % colors.length];
    });

    cards.forEach(value => {
        const card = document.createElement('div');
        card.classList.add('card');

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        cardFront.innerText = '';

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.innerText = value;
        
        cardBack.style.color = cardColorMap[value];

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        card.setAttribute('data-value', value);
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });

    startTimer();
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;
    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.getAttribute('data-value') === secondCard.getAttribute('data-value');
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    matchedCards += 2;
    firstCard.classList.add('disabled');
    secondCard.classList.add('disabled');


    firstCard.classList.add('bounce');
    secondCard.classList.add('bounce');

    generateCoins(firstCard);
    generateCoins(secondCard);

    setTimeout(() => {
        firstCard.classList.remove('bounce');
        secondCard.classList.remove('bounce');
    }, 300);

    resetBoard();

    if (matchedCards === cards.length) {
        clearInterval(timerInterval);
        setTimeout(() => {
            showCongratsModal();
        }, 500);
    }        
}

function showCongratsModal() {
    const congratsModal = document.getElementById('congrats-modal');
    congratsModal.style.display = 'flex';

    setTimeout(() => {
        congratsModal.style.display = 'none';
        nextPhase();
    }, 1000);
}

function generateCoins(cardElement) {
    const coinContainer = document.createElement("div");
    coinContainer.classList.add("coin-container");
    cardElement.appendChild(coinContainer);

    for (let i = 0; i < 8; i++) {
        const coin = document.createElement("div");
        coin.classList.add("coin");
        
        coin.style.setProperty('--coin-x', `${Math.random() * 40 - 20}px`);
        coin.style.setProperty('--coin-y', `${Math.random() * 40 - 20}px`);
        
        coinContainer.appendChild(coin);

        coin.addEventListener("animationend", () => coin.remove());
    }

    setTimeout(() => coinContainer.remove(), 600);
}

function nextPhase() {
    currentPhase++;
    if (currentPhase > 3) {
        showGameCompletedModal();
    } else {
        createBoard();
    }
}

function showGameCompletedModal() {
    const gameCompletedModal = document.getElementById('game-completed-modal');
    gameCompletedModal.style.display = 'flex';

    startConfetti();

    const restartButton = document.getElementById('restart-button');
    restartButton.addEventListener('click', () => {
        gameCompletedModal.style.display = 'none';
        stopConfetti();
        restartGame();
    });
}

let confettiInterval;

function startConfetti() {
    const confettiContainer = document.getElementById('confetti-container');
    confettiContainer.innerHTML = '';
    
    confettiInterval = setInterval(() => {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.backgroundColor = getRandomColor();
        confetti.style.animationDuration = Math.random() * 3 + 2 + "s";
        confettiContainer.appendChild(confetti);

        confetti.addEventListener('animationend', () => {
            confetti.remove();
        });
    }, 100);
}

function stopConfetti() {
    clearInterval(confettiInterval);
    const confettiContainer = document.getElementById('confetti-container');
    confettiContainer.innerHTML = '';
}

function getRandomColor() {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#FF5733", "#33FFF0"];
    return colors[Math.floor(Math.random() * colors.length)];
}

function restartGame() {
    currentPhase = 1;
    resetGame();
}

resetButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    currentPhase = 1;
    createBoard();
});

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

const toggleModeButton = document.getElementById('toggleMode');
let isTimedMode = true;

function startTimer() {
    clearInterval(timerInterval);
    seconds = 60;
    timerDisplay.innerText = seconds;

    timerInterval = setInterval(() => {
        seconds--;
        timerDisplay.innerText = seconds;

        if (isTimedMode && seconds <= 0) {
            clearInterval(timerInterval);
            endGameDueToTimeout();
        }
    }, 1000);
}

function endGameDueToTimeout() {
    lockBoard = true;
    const timeUpModal = document.getElementById('time-up-modal');
    timeUpModal.style.display = 'flex';

    const retryButton = document.getElementById('retry-button');
    retryButton.addEventListener('click', () => {
        timeUpModal.style.display = 'none';
        resetGame();
    });
}

function showTimeUpModal() {
    const timeUpModal = document.getElementById('time-up-modal');
    timeUpModal.style.display = 'flex';

    const retryButton = document.getElementById('retry-button');
    retryButton.addEventListener('click', () => {
        timeUpModal.style.display = 'none';
        resetGame();
    });
}

function resetGame() {
    clearInterval(timerInterval);
    lockBoard = false;
    createBoard();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('time-up-modal').style.display = 'none';
    document.getElementById('congrats-modal').style.display = 'none';
});

resetButton.addEventListener('click', resetGame);

createBoard();

resetButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    currentPhase = 1;
    createBoard();
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function playCelebration() {
    const celebrationSound = document.getElementById("celebration-sound");
    celebrationSound.play();

    const confettiContainer = document.getElementById("confetti-container");
    confettiContainer.innerHTML = "";

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.backgroundColor = getRandomColor();
        confetti.style.animationDuration = Math.random() * 3 + 2 + "s";
        confettiContainer.appendChild(confetti);
    }
}

function getRandomColor() {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#FF5733", "#33FFF0"];
    return colors[Math.floor(Math.random() * colors.length)];
}

createBoard();
