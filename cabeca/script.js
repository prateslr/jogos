const puzzleBoard = document.getElementById("puzzle-board");
const puzzlePieces = document.getElementById("puzzle-pieces");
const message = document.getElementById("message");
let currentLevel = 2;

const images = [
    "img/fase1.jpg",
    "img/fase2.jpg",
    "img/fase3.png",
    "img/fase4.webp",
];

function createPuzzle(level) {
    puzzleBoard.innerHTML = "";
    puzzlePieces.innerHTML = "";

    puzzleBoard.style.gridTemplateColumns = `repeat(${level}, 1fr)`;
    puzzleBoard.style.gridTemplateRows = `repeat(${level}, 1fr)`;
    puzzlePieces.style.gridTemplateColumns = `repeat(${level}, 1fr)`;
    puzzlePieces.style.gridTemplateRows = `repeat(${level}, 1fr)`;

    const totalPieces = level * level;
    const image = images[currentLevel - 2]

    for (let i = 1; i <= totalPieces; i++) {
        const dropzone = document.createElement("div");
        dropzone.classList.add("dropzone");
        dropzone.dataset.piece = i;
        dropzone.style.width = `${300 / level}px`;
        dropzone.style.height = `${300 / level}px`;
        puzzleBoard.appendChild(dropzone);
    }

    const pieces = [];
    for (let i = 1; i <= totalPieces; i++) {
        const piece = document.createElement("div");
        piece.classList.add("puzzle-piece");
        piece.draggable = true;
        piece.dataset.piece = i;

        piece.style.backgroundImage = `url(${image})`;
        piece.style.backgroundSize = `${level * 100}% ${level * 100}%`;

        const x = ((i - 1) % level) * (100 / (level - 1));
        const y = Math.floor((i - 1) / level) * (100 / (level - 1));
        piece.style.backgroundPosition = `${x}% ${y}%`;

        piece.style.width = `${300 / level}px`;
        piece.style.height = `${300 / level}px`;

        pieces.push(piece);
    }

    pieces.sort(() => Math.random() - 0.5);
    pieces.forEach(piece => puzzlePieces.appendChild(piece));

    addDragAndDrop();
}

function addDragAndDrop() {
    const pieces = document.querySelectorAll(".puzzle-piece");
    const dropzones = document.querySelectorAll(".dropzone");

    pieces.forEach((piece) => {
        piece.addEventListener("dragstart", (e) => {
            if (!piece.classList.contains("locked")) {
                e.dataTransfer.setData("text", e.target.dataset.piece);
            }
        });
    });

    dropzones.forEach((zone) => {
        zone.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        zone.addEventListener("drop", (e) => {
            e.preventDefault();
            const pieceId = e.dataTransfer.getData("text");
            const piece = document.querySelector(`.puzzle-piece[data-piece="${pieceId}"]`);

            if (zone.dataset.piece === pieceId) {
                zone.appendChild(piece);
                zone.classList.add("correct");
                piece.classList.add("locked");
                piece.draggable = false;
            } else {
                if (!zone.classList.contains("correct")) {
                    if (zone.hasChildNodes()) {
                        const existingPiece = zone.firstChild;
                        const parent = piece.parentNode;

                        zone.appendChild(piece);
                        parent.appendChild(existingPiece);
                    } else {
                        zone.appendChild(piece);
                    }
                }
            }

            checkWinCondition();
        });
    });
}

function checkWinCondition() {
    const dropzones = document.querySelectorAll(".dropzone");
    let correct = 0;

    dropzones.forEach((zone) => {
        if (zone.hasChildNodes()) {
            const childId = zone.firstChild.dataset.piece;
            if (zone.dataset.piece === childId) {
                correct++;
            }
        }
    });

    if (correct === dropzones.length) {
        if (currentLevel < images.length + 2) {
            currentLevel++;
            message.textContent = `Parabéns! Avançando para o nível ${currentLevel}x${currentLevel}!`;
            setTimeout(() => {
                message.textContent = "";
                createPuzzle(currentLevel);
            }, 2000);
        } else {
            message.textContent = "Parabéns! Você completou todos os níveis!";
        }
    }
}

createPuzzle(currentLevel);
