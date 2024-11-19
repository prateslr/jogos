let currentPhase = 0;
let currentQuestion = 0;
let playerScore = 0;
let correctStreak = 0;
let phases = [];

function updateScoreDisplay() {
    playerScore++;
    document.getElementById('score-value').textContent = playerScore;

    localStorage.setItem("playerScore", playerScore);
}

function sendScoreToDatabase() {
    const payload = {
        score: playerScore,
        playerId: "12345" // Id jogador / usuário
    };

    fetch("https://api.example.com/scores", { // Nossa URL
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

function generatePhases() {
    // Fase de Adição
    phases.push({
        title: "Fase 1: Adição",
        questions: Array.from({ length: 5 }, () => {
            const a = Math.floor(Math.random() * 10) + 1;
            const b = Math.floor(Math.random() * 10) + 1;
            return { question: `${a} + ${b} = ?`, answer: a + b };
        }),
    });

    // Fase de Subtração
    phases.push({
        title: "Fase 2: Subtração",
        questions: Array.from({ length: 5 }, () => {
            let a = Math.floor(Math.random() * 10) + 1;
            let b = Math.floor(Math.random() * 10) + 1;
            if (a < b) [a, b] = [b, a];
            return { question: `${a} - ${b} = ?`, answer: a - b };
        }),
    });

    // Fase de Multiplicação
    phases.push({
        title: "Fase 3: Multiplicação",
        questions: Array.from({ length: 5 }, () => {
            const a = Math.floor(Math.random() * 10) + 1;
            const b = Math.floor(Math.random() * 10) + 1;
            return { question: `${a} x ${b} = ?`, answer: a * b };
        }),
    });

    // Fase de Divisão
    phases.push({
        title: "Fase 4: Divisão",
        questions: Array.from({ length: 5 }, () => {
            const a = Math.floor(Math.random() * 10) + 1;
            const b = Math.floor(Math.random() * 10) + 1;
            return { question: `${a * b} ÷ ${b} = ?`, answer: a };
        }),
    });
}

function showQuestion() {
    const phase = phases[currentPhase];
    document.getElementById("phase-title").textContent = phase.title;
    document.getElementById("question").textContent = phase.questions[currentQuestion].question;
}

function checkAnswer() {
    const userAnswer = Number(document.getElementById("answer").value.trim());
    const phase = phases[currentPhase];
    const question = phase.questions[currentQuestion];

    if (userAnswer === question.answer) {
        correctStreak++;
        document.getElementById("message").textContent = "Correto!";
    } else {
        correctStreak = 0;
        document.getElementById("message").textContent = `Incorreto! A resposta certa é ${question.answer}.`;
    }

    if (correctStreak === 3) {
        updateScoreDisplay();
        correctStreak = 0;
    }

    currentQuestion++;
    if (currentQuestion < phase.questions.length) {
        setTimeout(() => {
            document.getElementById("message").textContent = "";
            document.getElementById("answer").value = "";
            showQuestion();
        }, 1500);
    } else {
        currentPhase++;
        if (currentPhase < phases.length) {
            document.getElementById("nextPhaseButton").style.display = "inline-block";
        } else {
            document.getElementById("restartButton").style.display = "inline-block";
            sendScoreToDatabase();
        }
    }
}

document.getElementById("submitButton").addEventListener("click", checkAnswer);
document.getElementById("nextPhaseButton").addEventListener("click", () => {
    document.getElementById("nextPhaseButton").style.display = "none";
    currentQuestion = 0;
    showQuestion();
});

document.getElementById("restartButton").addEventListener("click", () => {
    location.reload();
});

document.getElementById('answer').addEventListener('keypress', (event) => {
 if (event.key === 'Enter') {
     checkAnswer();
 }
});

generatePhases();
showQuestion();
updateScoreDisplay();