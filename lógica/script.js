const stages = [
 { question: "Estou pensando em um número entre 1 e 100.", answer: Math.floor(Math.random() * 100) + 1, type: "number" },
 { question: "Qual é a cor de uma banana?", answer: "amarelo", type: "color" },
 { question: "Que animal faz 'miau'?", answer: "gato", type: "animal" },
 { question: "Qual é a forma de uma pizza inteira?", answer: "circulo", type: "shape" },
 { question: "O que vem depois de 2? (1, 2, ...)", answer: "3" },
 { question: "Com o que você escreve?", answer: "lapis", type: "object" },
 { question: "O que você usa para ouvir música?", answer: "ouvidos", type: "body" },
 { question: "Onde vive um peixe?", answer: "água", type: "animal" },
 { question: "Se 3 maçãs estão em uma cesta e você tira 2, quantas maçãs restam na cesta?", answer: "1", type: "logic" },
 { question: "Qual é maior, um carro ou uma bicicleta?", answer: "carro", type: "logic" },
 { question: "O que você faz antes de dormir?", answer: "escovar os dentes", type: "routine" },
 { question: "O que é menor: um gato ou um elefante?", answer: "gato", type: "logic" },
 { question: "Se está escuro, o que você faz para enxergar?", answer: "acender a luz", type: "logic" },
 { question: "Se você tem 5 balas e come 2, quantas sobram?", answer: "3", type: "math" },
 { question: "Se eu estou dentro de casa e quero sair, por onde eu saio?", answer: "pela porta", type: "logic" }
];

let playerScore = 0;
let correctAnswers = 0;

function sendScoreToDatabase() {
    const payload = {
        score: playerScore,
        playerId: "12345",
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

let currentStage = 0;

function updateScore() {
    correctAnswers++;

    if (correctAnswers === 3) {
        playerScore++;
        correctAnswers = 0;

        document.getElementById('score-value').textContent = playerScore;
    }
}

function showStage() {
    const questionDiv = document.getElementById('question');
    const answerInput = document.getElementById('answer');
    const messageDiv = document.getElementById('message');
    const resetButton = document.getElementById('resetButton');

    messageDiv.textContent = '';

    if (currentStage < stages.length) {
        questionDiv.textContent = stages[currentStage].question;
        answerInput.value = '';
        answerInput.style.display = 'block';
        resetButton.style.display = 'none';
    } else {
        questionDiv.textContent = "Parabéns! Você concluiu todos os desafios!";
        answerInput.style.display = 'none';
        resetButton.style.display = 'block';
    }
}

function updateScore() {
    playerScore++;
    document.getElementById('score-value').textContent = playerScore;

    localStorage.setItem("playerScore", playerScore);
}

document.addEventListener("DOMContentLoaded", () => {
    const storedScore = localStorage.getItem("playerScore");
    if (storedScore) {
        playerScore = parseInt(storedScore, 10);
        document.getElementById('score-value').textContent = playerScore;
    }
});

function checkAnswer() {
    const userAnswer = document.getElementById('answer').value.trim();
    const currentStageData = stages[currentStage];
    const currentAnswer = currentStageData.answer;

    if (currentStageData.type === "number") {
        const userNumber = Number(userAnswer);

        if (userNumber === currentAnswer) {
            document.getElementById('message').textContent = "Parabéns! Você acertou! Avançando para a próxima fase...";
            updateScore();
            currentStage++;
            setTimeout(showStage, 2000);
        } else if (userNumber < currentAnswer) {
            document.getElementById('message').textContent = "Muito baixo! Tente um número maior.";
        } else {
            document.getElementById('message').textContent = "Muito alto! Tente um número menor.";
        }
    } else {
        if (userAnswer.toLowerCase() === currentAnswer.toString().toLowerCase()) {
            document.getElementById('message').textContent = "Parabéns! Você acertou! Avançando...";
            updateScore();
            currentStage++;
            setTimeout(showStage, 2000);
        } else {
            document.getElementById('message').textContent = "Tente novamente!";
        }
    }

    document.getElementById('answer').value = '';
}

document.getElementById('submitButton').addEventListener('click', checkAnswer);

document.getElementById('answer').addEventListener('keypress', (event) => {
 if (event.key === 'Enter') {
     checkAnswer();
 }
});

document.getElementById('resetButton').addEventListener('click', () => {
    currentStage = 0;
    playerScore = 0;
    correctAnswers = 0;
    document.getElementById('score-value').textContent = playerScore;
    document.getElementById('answer').style.display = 'block';
    showStage();
});

showStage();
