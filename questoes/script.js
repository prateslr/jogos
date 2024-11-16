document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('answer').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            submitAnswer();
        }
    });

    let userLevel = 1;
    getQuestion(userLevel);
});

let currentQuestion;

function getQuestion(level) {
    fetch(`/questions/${level}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                currentQuestion = data[0];
                document.getElementById('question').innerText = currentQuestion.question;
            } else {
                alert('Não há mais perguntas disponíveis para este nível.');
            }
        });
}

function submitAnswer() {
    const answer = document.getElementById('answer').value.trim().toLowerCase();
    let isCorrect = false;

    if (currentQuestion.answer === "vogais") {
        // Aceita qualquer vogal como resposta correta
        isCorrect = ["a", "e", "i", "o", "u"].includes(answer);
    } else {
        // Verifica a resposta padrão
        isCorrect = answer === currentQuestion.answer.toLowerCase();
    }
    
    fetch('/answers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, questionId: currentQuestion.id, isCorrect })
    }).then(() => {
        const xpGained = isCorrect ? 15 : 0;
        checkLevelUp(userId, xpGained);
    });

    document.getElementById('answer').value = '';
}

function checkLevelUp(userId, xpGained) {
    fetch('/updateXP', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, xpGained })
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            console.error('Erro ao atualizar XP');
            throw new Error('Erro ao atualizar XP');
        }
    }).then(data => {
        if (data.canLevelUp) {
            const confirmation = confirm(`Você atingiu ${data.nextLevelXP} XP. Deseja subir para o próximo nível?`);
            if (confirmation) {
                userLevel++;
                getQuestion(userLevel);
            } else {
                getQuestion(userLevel);
            }
        } else {
            getQuestion(userLevel);
        }
    });
}
