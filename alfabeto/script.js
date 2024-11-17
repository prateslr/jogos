// Elementos
const modeSelectionModal = document.getElementById("mode-selection-modal");
const animalContainer = document.getElementById("animal-container");
const alphabetContainer = document.getElementById("alphabet-container");
const animalImage = document.getElementById("animal-image");
const animalInput = document.getElementById("animal-input");
const submitAnimalButton = document.getElementById("submit-animal");
const hintButton = document.getElementById("hint-button");
const animalFeedback = document.getElementById("animal-feedback");
const animalTimerDisplay = document.getElementById("timer");
const alphabetTimerDisplay = document.getElementById("alphabet-timer");
const timeOutModal = document.getElementById("time-out-modal");
const letterDisplay = document.getElementById("letter-display");
const optionsContainer = document.getElementById("options-container");
const alphabetFeedback = document.getElementById("alphabet-feedback");
const retryButton = document.getElementById("retry-button");

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

let currentAnimalIndex = 0;
let currentLetterIndex = 0;
let animalTimer = 15;
let alphabetTimer = 15;
let animalScore = 0;
let alphabetScore = 0;
let animalTimerInterval;
let alphabetTimerInterval;
let hintUsed = false;

const animals = [
  { name: "zebra", image: "zebra.png" },
  { name: "cachorro", image: "cachorro.png" },
  { name: "elefante", image: "elefante.png" },
  { name: "girafa", image: "girafa.png" },
  { name: "leao", image: "leao.png" }
];

const letters = Array.from({ length: 26 }, (_, i) => {
  const correctLetter = String.fromCharCode(65 + i);
  const allLetters = Array.from({ length: 26 }, (_, j) => String.fromCharCode(65 + j));
  
  const incorrectOptions = allLetters.filter(l => l !== correctLetter)
  .sort(() => 0.5 - Math.random())
  .slice(0, 3);

  const options = [...incorrectOptions];
  const correctIndex = Math.floor(Math.random() * 4);
  options.splice(correctIndex, 0, correctLetter);

  return { letter: correctLetter, options };
});

const correctSound = new Audio("correct.mp3");
const kidsSound = new Audio("kids_scream.mp3");

function showTimeOutModal(mode) {
  clearInterval(mode === 'animal' ? animalTimerInterval : alphabetTimerInterval);
  timeOutModal.style.display = "flex";

  retryButton.onclick = () => {
    timeOutModal.style.display = "none";
    if (mode === 'animal') {
      animalTimer = 15;
      startAnimalTimer();
      showAnimal();
    } else {
      alphabetTimer = 15;
      startAlphabetTimer();
      showLetter();
    }
  };
}

function startAnimalMode() {
 modeSelectionModal.style.display = "none";
 animalContainer.style.display = "block";
 alphabetContainer.style.display = "none";

 document.body.classList.add("animais-mode-body");

 showAnimal();
}

function showAnimal() {
  const currentAnimal = animals[currentAnimalIndex];
  animalImage.src = currentAnimal.image;
  animalInput.value = "";
  animalFeedback.textContent = "";
  animalTimer = 15;
  animalTimerDisplay.textContent = `Tempo restante: ${animalTimer}s`;
  startAnimalTimer();
}

function startAnimalTimer() {
  clearInterval(animalTimerInterval);
  animalTimerInterval = setInterval(() => {
    animalTimer--;
    animalTimerDisplay.textContent = `Tempo restante: ${animalTimer}s`;
    if (animalTimer <= 0) {
      clearInterval(animalTimerInterval);
      showTimeOutModal('animal');
    }
  }, 1000);
}

submitAnimalButton.onclick = () => {
  const currentAnimal = animals[currentAnimalIndex];
  const userAnswer = animalInput.value.trim().toLowerCase();

  if (userAnswer === currentAnimal.name.toLowerCase()) {
    correctSound.play();

    playerScore += hintUsed ? 1 : 2;

    correctSound.onended = () => {
      currentAnimalIndex++;
      if (currentAnimalIndex >= animals.length) {
        currentAnimalIndex = 0;
        sendScoreToDatabase();
        showEndModal("Você completou o modo Animais! Pontuação: " + playerScore);
      } else {
        showAnimal();
      }
    };    

    hintUsed = false;
    animalFeedback.textContent = "";
    animalInput.value = "";
  } else {
    animalFeedback.textContent = "Tente novamente!";
    animalFeedback.classList.add("incorrect-feedback");
  }
};

hintButton.onclick = () => {
  const currentAnimal = animals[currentAnimalIndex];
  hintText.textContent = `Dica: Este animal é um ${currentAnimal.name}`;
  hintModal.style.display = "flex";
  hintUsed = true;
};

animalInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    submitAnimalButton.click();
  }
});

const hintModal = document.getElementById("hint-modal");
const hintText = document.getElementById("hint-text");
const closeHintButton = document.getElementById("close-hint-button");

hintButton.style.display = "none";

function showHintButton() {
  hintButton.style.display = "block";
}

hintButton.onclick = () => {
  const currentAnimal = animals[currentAnimalIndex];
  hintText.textContent = `Dica: Este animal é um ${currentAnimal.name}`;
  hintModal.style.display = "flex";
};

closeHintButton.onclick = () => {
  hintModal.style.display = "none";
};

function startAnimalTimer() {
  clearInterval(animalTimerInterval);
  animalTimerInterval = setInterval(() => {
    animalTimer--;
    animalTimerDisplay.textContent = `Tempo restante: ${animalTimer}s`;

    if (animalTimer <= 0) {
      clearInterval(animalTimerInterval);
      showTimeOutModal('animal');
      showHintButton();
    }
  }, 1000);
}

function showAnimal() {
  const currentAnimal = animals[currentAnimalIndex];
  animalImage.src = currentAnimal.image;
  animalInput.value = "";
  animalFeedback.textContent = "";
  hintModal.style.display = "none";
  animalTimer = 15;
  animalTimerDisplay.textContent = `Tempo restante: ${animalTimer}s`;
  startAnimalTimer();
}

function startAlphabetMode() {
 modeSelectionModal.style.display = "none";
 alphabetContainer.style.display = "block";
 animalContainer.style.display = "none";

 document.body.classList.add("alphabet-mode-body");

 showLetter();
}

function showLetter() {
  const currentLetter = letters[currentLetterIndex];
  letterDisplay.textContent = currentLetter.letter;
  optionsContainer.innerHTML = "";
  currentLetter.options.forEach(option => {
    const optionButton = document.createElement("button");
    optionButton.textContent = option;
    optionButton.onclick = () => checkAlphabetAnswer(option);
    optionsContainer.appendChild(optionButton);
  });
  alphabetTimer = 15;
  alphabetTimerDisplay.textContent = `Tempo restante: ${alphabetTimer}s`;
  startAlphabetTimer();
}

function startAlphabetTimer() {
  clearInterval(alphabetTimerInterval);
  alphabetTimerInterval = setInterval(() => {
    alphabetTimer--;
    alphabetTimerDisplay.textContent = `Tempo restante: ${alphabetTimer}s`;
    if (alphabetTimer <= 0) {
      clearInterval(alphabetTimerInterval);
      showTimeOutModal('alphabet');
    }
  }, 1000);
}

function checkAlphabetAnswer(answer) {
  const correctAnswer = letters[currentLetterIndex].letter;

  if (answer === correctAnswer) {
    correctSound.play();

    playerScore += 1;

    correctSound.onended = () => {
      currentLetterIndex++;
      if (currentLetterIndex >= letters.length) {
        currentLetterIndex = 0;
        sendScoreToDatabase();
        showEndModal("Você completou o modo Alfabeto! Pontuação: " + playerScore);
      } else {
        showLetter();
      }
    };        

    alphabetFeedback.textContent = "";
  } else {
    alphabetFeedback.textContent = "Tente novamente!";
  }
}

const exitAlphabetButton = document.getElementById("exit-alphabet-button");

exitAlphabetButton.onclick = () => {
  modeSelectionModal.style.display = "flex";

  alphabetContainer.style.display = "none";

  clearInterval(alphabetTimerInterval);
  alphabetTimer = 15;
};

const exitAnimaisButton = document.getElementById("exit-animais-button");

exitAnimaisButton.onclick = () => {
  modeSelectionModal.style.display = "flex";

  animalContainer.style.display = "none";

  clearInterval(animalTimerInterval);
  animalTimer = 15;
};

const endModal = document.getElementById("end-modal");
const endModalMessage = document.getElementById("end-modal-message");
const endModalButton = document.getElementById("end-modal-button");

function showEndModal(message) {
  endModalMessage.textContent = message;
  endModal.style.display = "flex";
}

endModalButton.onclick = () => {
  endModal.style.display = "none";
  modeSelectionModal.style.display = "flex";
  animalContainer.style.display = "none";
  alphabetContainer.style.display = "none";
};
