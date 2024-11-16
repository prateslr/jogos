const board = document.getElementById('puzzle-board');
const resetButton = document.getElementById('reset');

const images = [
    'https://designcomcafe.com.br/wp-content/uploads/2023/10/como-criar-prompts-para-geracao-de-imagens-com-ia-1024x538.jpg',
];

let pieces = [];
let currentLevel = 0;

// Carrega a fase selecionada
function loadLevel(level) {
    currentLevel = level - 1;
    pieces = [];
    board.innerHTML = '';
    createPuzzle(level);
}

// Cria o quebra-cabeça
function createPuzzle(level) {
    const imgSrc = images[currentLevel];
    const gridSize = 3;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const piece = document.createElement('div');
            piece.classList.add('piece');
            piece.style.backgroundImage = `url(${imgSrc})`;
            piece.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;
            piece.setAttribute('draggable', true);
            piece.setAttribute('data-position', `${row}-${col}`);
            piece.addEventListener('dragstart', dragStart);
            piece.addEventListener('dragover', dragOver);
            piece.addEventListener('drop', drop);
            pieces.push(piece);
        }
    }

    pieces = shuffleArray(pieces);
    pieces.forEach(piece => board.appendChild(piece));
}

// Embaralha as peças
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Inicia o arrasto
function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.position);
}

// Permite o arrasto sobre a peça
function dragOver(e) {
    e.preventDefault();
}

// Realiza o drop da peça
function drop(e) {
    e.preventDefault();
    const sourcePosition = e.dataTransfer.getData('text/plain');
    const targetPosition = e.target.dataset.position;

    if (sourcePosition !== targetPosition) {
        const sourcePiece = pieces.find(piece => piece.dataset.position === sourcePosition);
        const targetPiece = pieces.find(piece => piece.dataset.position === targetPosition);

        // Troca as posições
        const tempBgPos = sourcePiece.style.backgroundPosition;
        sourcePiece.style.backgroundPosition = targetPiece.style.backgroundPosition;
        targetPiece.style.backgroundPosition = tempBgPos;

        checkIfSolved();
    }
}

// Verifica se o quebra-cabeça foi resolvido
function checkIfSolved() {
    let allSolved = true;

    pieces.forEach(piece => {
        const [row, col] = piece.dataset.position.split('-').map(Number);
        const correctPosition = `-${col * 100}px -${row * 100}px`;

        if (piece.style.backgroundPosition !== correctPosition) {
            allSolved = false;
        }
    });

    if (allSolved) {
        setTimeout(() => {
            alert('Parabéns! Você completou o quebra-cabeça!');
            createParticles();
            loadLevel(currentLevel + 1);
        }, 500);
    }
}

// Função para criar partículas
function createParticles() {
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.position = 'absolute';
        particle.style.width = '5px';
        particle.style.height = '5px';
        particle.style.backgroundColor = 'gold';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.left = `${Math.random() * window.innerWidth}px`;
        particle.style.top = `${Math.random() * window.innerHeight}px`;
        document.getElementById('particles').appendChild(particle);

        // Animação da partícula
        setTimeout(() => {
            particle.style.transform = `translateY(-100px)`;
            particle.style.opacity = '0';
            particle.addEventListener('transitionend', () => {
                particle.remove();
            });
        }, 10);
    }
}

// Reinicia o jogo
resetButton.addEventListener('click', () => {
    loadLevel(currentLevel + 1);
});

// Iniciar o jogo na fase 1
loadLevel(1);
