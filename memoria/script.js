// ===============================
// SEÇÃO: VARIÁVEIS GLOBAIS
// ===============================
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

let memoriaScore = 0;
let phaseTimes = []; // Armazena os tempos de cada fase

// ===============================
// SEÇÃO: CONFETES
// ===============================
function startConfetti() {
    const confettiContainer = document.getElementById('confetti-container');
    confettiContainer.innerHTML = '';

    const confettiInterval = setInterval(() => {
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
    const confettiContainer = document.getElementById('confetti-container');
    confettiContainer.innerHTML = '';
}

function getRandomColor() {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#FF5733", "#33FFF0"];
    return colors[Math.floor(Math.random() * colors.length)];
}

// ===============================
// SEÇÃO: TIMER
// ===============================
function startTimer() {
    clearInterval(timerInterval);
    seconds = 0; // Reseta o timer

    timerInterval = setInterval(() => {
        seconds++; // Incrementa o tempo
        timerDisplay.innerText = seconds; // Atualiza o display
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    timerDisplay.innerText = seconds;
}

function savePhaseTime() {
    phaseTimes.push(seconds); // Armazena o tempo da fase atual
}

// ===============================
// SEÇÃO: CARTAS
// ===============================
const cardValues = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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

    if (matchedCards === cards.length) {
        clearInterval(timerInterval);
        savePhaseTime(); // Salva o tempo da fase
        setTimeout(() => {
            showCongratsModal();
        }, 500);
    }  

    resetBoard();
}

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

// ===============================
// SEÇÃO: TABULEIRO E FASES
// ===============================
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

function createBoard() {
    board.innerHTML = '';
    matchedCards = 0;
    resetTimer(); // Reseta o timer ao criar o tabuleiro
    updateTitle();

    const { rows, cols } = getGridDimensions(currentPhase);
    const numPairs = (rows * cols) / 2;
    const cardArray = [...cardValues.slice(0, numPairs), ...cardValues.slice(0, numPairs)];
    cards = shuffleArray(cardArray);

    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

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

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        card.setAttribute('data-value', value);
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });

    startTimer(); // Inicia o timer ao criar o tabuleiro
}

function nextPhase() {
    currentPhase++;
    memoriaScore++;
    if (currentPhase > 3) {
        showGameCompletedModal();
    } else {
        createBoard();
    }
}

function restartGame() {
    currentPhase = 1;
    phaseTimes = []; // Reseta os tempos
    createBoard();
}

resetButton.addEventListener('click', () => {
    clearInterval(timerInterval); // Para o cronômetro
    stopConfetti(); // Para os confetes
    restartGame(); // Reinicia o jogo
});

// ===============================
// SEÇÃO: MODAIS
// ===============================
function showCongratsModal() {
    const congratsModal = document.getElementById('congrats-modal');
    congratsModal.style.display = 'flex';

    setTimeout(() => {
        congratsModal.style.display = 'none';
        nextPhase();
    }, 1000);
}

function showGameCompletedModal() {
    const gameCompletedModal = document.getElementById('game-completed-modal');
    gameCompletedModal.style.display = 'flex';

    startConfetti();
    sendScoreToDatabase();

    const restartButton = document.getElementById('restart-button');
    restartButton.addEventListener('click', () => {
        gameCompletedModal.style.display = 'none';
        stopConfetti();
        restartGame();
    });
}

// ===============================
// SEÇÃO: BANCO DE DADOS
// ===============================
function sendScoreToDatabase() {
    const averageTime = (phaseTimes.reduce((a, b) => a + b, 0) / phaseTimes.length).toFixed(2); // Média dos tempos

    const payload = {
        score: memoriaScore,
        averageTime: averageTime, // Média dos tempos
        memoriaId: "12345"
    };

    fetch("http://localhost:3000/scores", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })
    .then((response) => {
        if (response.ok) {
            console.log("Dados enviados com sucesso!");
        } else {
            console.error("Erro ao enviar dados.");
        }
    })
    .catch((error) => console.error("Erro de rede:", error));
}

// ===============================
// SEÇÃO: INICIALIZAÇÃO DO JOGO
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    createBoard();
});

createBoard();