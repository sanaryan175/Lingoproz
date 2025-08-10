document.addEventListener("DOMContentLoaded", function () {
const questions = [
  {
    question: "What is the French word for 'Bread'?",
    options: ["Baguette", "Fromage", "Pain", "Lait"],
    answer: "Pain",
    explanation: "'Pain' means 'Bread' in French.",
  },
  {
    question: "Translate: 'I would like a coffee.'",
    options: [
      "Je voudrais un café.",
      "J'aime le café.",
      "Un café, s'il vous plaît.",
      "Je bois du café."
    ],
    answer: "Je voudrais un café.",
    explanation: "'Je voudrais un café' means 'I would like a coffee.'",
  },
  {
    question: "What does 'Fromage' mean in English?",
    options: ["Milk", "Fruit", "Cheese", "Bread"],
    answer: "Cheese",
    explanation: "'Fromage' means 'Cheese' in French.",
  },
  {
    question: "How do you say 'Water' in French?",
    options: ["Eau", "Jus", "Lait", "Vin"],
    answer: "Eau",
    explanation: "'Eau' means 'Water' in French.",
  },
  {
    question: "What is 'Apple' in French?",
    options: ["Pomme", "Poire", "Orange", "Raisin"],
    answer: "Pomme",
    explanation: "'Pomme' means 'Apple' in French.",
  },
  {
    question: "Translate: 'Do you want some tea?'",
    options: [
      "Tu veux du thé ?",
      "Tu bois du thé ?",
      "Je veux un thé.",
      "Vous avez du thé ?"
    ],
    answer: "Tu veux du thé ?",
    explanation: "'Tu veux du thé ?' means 'Do you want some tea?'",
  },
  {
    question: "What does 'Lait' mean?",
    options: ["Juice", "Milk", "Coffee", "Water"],
    answer: "Milk",
    explanation: "'Lait' means 'Milk' in French.",
  },
  {
    question: "How do you say 'Orange juice' in French?",
    options: ["Jus d'orange", "Jus de pomme", "Eau minérale", "Vin rouge"],
    answer: "Jus d'orange",
    explanation: "'Jus d'orange' means 'Orange juice' in French.",
  }
];


  let xp = parseInt(localStorage.getItem(`xp_lesson8`)) || 0;
  let currentQuestion = parseInt(localStorage.getItem(`currentQuestion_lesson8`)) || 0;
  let lives = parseInt(localStorage.getItem(`lives_lesson8`)) || 3;
  let quizPassed = localStorage.getItem(`quizPassed_lesson8`) === "true";

  const questionElem = document.getElementById("question");
  const optionsElem = document.getElementById("options");
  const xpElem = document.getElementById("xp");
  const livesElem = document.getElementById("lives");
  const feedbackElem = document.getElementById("feedback");
  const xpBar = document.getElementById("xpBar");

  const gameContainer = document.getElementById("gameContainer");
  const gameOverPopup = document.getElementById("gameOverPopup");
  const victoryPopup = document.getElementById("victoryPopup");
  const passedPopup = document.getElementById("passedPopup");
  const popupFinalXP = document.getElementById("popupFinalXP");

  const correctSound = document.getElementById("correctSound");
  const wrongSound = document.getElementById("wrongSound");
  const loseSound = document.getElementById("loseSound");
  const victorySound = document.getElementById("victorySound");

  const skipBtn = document.getElementById("skipBtn");
  const checkBtn = document.getElementById("checkBtn");
  const continueBtn = document.getElementById("continueBtn");

  const svgContainer = document.getElementById("svgReactionContainer");

  let waiting = false;
  let selectedOption = null;
  let selectedBtn = null;
  const skipPenalty = false;

  if (quizPassed) {
    gameContainer.style.display = "none";
    passedPopup.style.display = "flex";
    return;
  }

  function updateXPBar() {
    const percent = Math.min((xp / (questions.length * 10)) * 100, 100);
    xpBar.style.width = `${percent}%`;
  }

  function showAnswerButtons() {
    skipBtn.style.display = "inline-block";
    checkBtn.style.display = "inline-block";
    continueBtn.style.display = "none";
  }

  function showContinueButton() {
    skipBtn.style.display = "none";
    checkBtn.style.display = "none";
    continueBtn.style.display = "inline-block";
  }

  function hideControlButtons() {
    skipBtn.style.display = "none";
    checkBtn.style.display = "none";
    continueBtn.style.display = "none";
  }

  function saveProgress() {
    localStorage.setItem(`xp_lesson8`, xp);
    localStorage.setItem(`currentQuestion_lesson8`, currentQuestion);
    localStorage.setItem(`lives_lesson8`, lives);
  }

  function showSVGReaction(type) {
    if (!svgContainer) return;
    let svg = "";

    if (type === "wrong") {
      svg = `<svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" stroke="#ff4d4f" stroke-width="5" fill="none"/>
        <line x1="35" y1="35" x2="65" y2="65" stroke="#ff4d4f" stroke-width="5"/>
        <line x1="65" y1="35" x2="35" y2="65" stroke="#ff4d4f" stroke-width="5"/>
      </svg>`;
    } else if (type === "victory") {
      svg = `<svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" stroke="#00c853" stroke-width="5" fill="none"/>
        <polyline points="30,55 45,70 70,35" fill="none" stroke="#00c853" stroke-width="5"/>
      </svg>`;
    } else if (type === "gameover") {
      svg = `<svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" stroke="#ff1744" stroke-width="5" fill="none"/>
        <path d="M35,40 Q50,60 65,40" fill="none" stroke="#ff1744" stroke-width="5"/>
      </svg>`;
    }

    svgContainer.innerHTML = svg;
    svgContainer.classList.add("show");
    setTimeout(() => {
      svgContainer.classList.remove("show");
      svgContainer.innerHTML = "";
    }, 1200);
  }

  function checkAnswer(selected, btn) {
    if (waiting) return;
    waiting = true;

    const current = questions[currentQuestion];
    const buttons = document.querySelectorAll(".options button");

    buttons.forEach(button => {
      button.disabled = true;
      button.classList.remove("selected");
      if (button.innerText === current.answer) {
        button.classList.add("correct");
      } else if (button === btn) {
        button.classList.add("wrong");
      }
    });

    if (selected === current.answer) {
      xp += 10;
      feedbackElem.innerText = "✅ Correct!";
      btn.classList.add("bounce");
      correctSound?.cloneNode(true).play();
    } else {
      lives -= 1;
      feedbackElem.innerText = `❌ Wrong! ${current.explanation}`;
      wrongSound?.cloneNode(true).play();
      showSVGReaction("wrong");
    }

    xpElem.innerText = xp;
    livesElem.innerText = lives;
    updateXPBar();
    saveProgress();

    if (lives <= 0) {
      hideControlButtons();
      loseSound?.cloneNode(true).play();
      showSVGReaction("gameover");
      setTimeout(() => gameOverPopup.style.display = "flex", 800);
    } else if (currentQuestion === questions.length - 1) {
      hideControlButtons();
      localStorage.setItem(`quizPassed_lesson8`, "true");
      setTimeout(() => {
        popupFinalXP.innerText = xp;
        victoryPopup.style.display = "flex";
        confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
        victorySound?.cloneNode(true).play();
        showSVGReaction("victory");
      }, 800);
    } else {
      showContinueButton();
    }
  }

  function loadQuestion() {
    if (currentQuestion >= questions.length) return;

    waiting = false;
    selectedOption = null;
    selectedBtn = null;

    const current = questions[currentQuestion];
    questionElem.innerText = current.question;
    optionsElem.innerHTML = "";
    feedbackElem.innerText = "";

    current.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.innerText = opt;
      btn.classList.remove("selected", "correct", "wrong");
      btn.onclick = () => {
        selectedOption = opt;
        selectedBtn = btn;
        document.querySelectorAll(".options button").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
      };
      optionsElem.appendChild(btn);
    });

    xpElem.innerText = xp;
    livesElem.innerText = lives;
    updateXPBar();
    showAnswerButtons();
    saveProgress();
  }

  skipBtn.addEventListener("click", () => {
    if (skipPenalty) {
      lives -= 1;
      if (lives <= 0) {
        saveProgress();
        hideControlButtons();
        loseSound?.cloneNode(true).play();
        showSVGReaction("gameover");
        return setTimeout(() => gameOverPopup.style.display = "flex", 800);
      }
    }

    currentQuestion++;
    if (currentQuestion >= questions.length) {
      hideControlButtons();
      localStorage.setItem(`quizPassed_lesson8`, "true");
      popupFinalXP.innerText = xp;
      victoryPopup.style.display = "flex";
      confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
      victorySound?.cloneNode(true).play();
      showSVGReaction("victory");
    } else {
      loadQuestion();
    }
  });

  checkBtn.addEventListener("click", () => {
    if (!selectedOption) {
      alert("Please select an option first!");
      return;
    }
    checkAnswer(selectedOption, selectedBtn);
  });

  continueBtn.addEventListener("click", () => {
    currentQuestion++;
    loadQuestion();
  });

  loadQuestion();
});

// 🔄 Global Controls
function restartLesson() {
  const lessonId = "lessonX"; // Match this to the current lesson
  localStorage.removeItem(`xp_lesson8`);
  localStorage.removeItem(`currentQuestion_lesson8`);
  localStorage.removeItem(`lives_lesson8`);
  localStorage.removeItem(`quizPassed_lesson8`);
  location.reload();
}

function goToNextLesson() {
  window.location.href = "lesson9_article.html"; // Update appropriately
}

function returnToCourseList() {
  window.location.href = "index.html";
}

function restartQuiz() {
  restartLesson();
}
