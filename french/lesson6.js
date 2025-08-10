document.addEventListener("DOMContentLoaded", function () {
const questions = [
  {
    question: "What does 'Qui' mean?",
    options: ["What", "Where", "Who", "Why"],
    answer: "Who",
    explanation: "'Qui' means 'Who' in French.",
  },
  {
    question: "What does 'Où' mean?",
    options: ["When", "Where", "Why", "How"],
    answer: "Where",
    explanation: "'Où' means 'Where'.",
  },
  {
    question: "Which is a personal pronoun?",
    options: ["le", "je", "chat", "avoir"],
    answer: "je",
    explanation: "'je' means 'I' and is a personal pronoun.",
  },
  {
    question: "What is the plural of 'chien' (dog)?",
    options: ["chiens", "chiennes", "chienz", "chienes"],
    answer: "chiens",
    explanation: "The plural of 'chien' is 'chiens'.",
  },
  {
    question: "What does 'tu as' mean?",
    options: ["You are", "You have", "You go", "You eat"],
    answer: "You have",
    explanation: "'tu as' means 'you have'.",
  },
  {
    question: "Choose the correct form of 'être' (to be) for 'il':",
    options: ["es", "suis", "est", "êtes"],
    answer: "est",
    explanation: "'Il est' = He is.",
  },
  {
    question: "What article goes with 'pomme' (apple)?",
    options: ["le", "la", "les", "l'"],
    answer: "la",
    explanation: "'la pomme' is the correct form (feminine noun).",
  },
  {
    question: "Which sentence is grammatically correct?",
    options: ["Je suis content", "Tu suis content", "Je es content", "Elle es contente"],
    answer: "Je suis content",
    explanation: "Correct conjugation: 'Je suis' = I am.",
  },
  {
    question: "Which is the indefinite article for 'fille' (girl)?",
    options: ["un", "une", "des", "le"],
    answer: "une",
    explanation: "'fille' is feminine, so use 'une'.",
  },
  {
    question: "What is 'We have' in French?",
    options: ["Nous as", "Nous avons", "Nous êtes", "Nous suis"],
    answer: "Nous avons",
    explanation: "'Nous avons' means 'We have'.",
  },
  {
    question: "Which verb means 'to be'?",
    options: ["être", "avoir", "faire", "aller"],
    answer: "être",
    explanation: "'être' means 'to be'.",
  },
  {
    question: "What is the plural of 'livre' (book)?",
    options: ["livres", "livreses", "livrez", "livrens"],
    answer: "livres",
    explanation: "The plural of 'livre' is 'livres'.",
  },
  {
    question: "What does 'Pourquoi' mean?",
    options: ["Where", "How", "Why", "Who"],
    answer: "Why",
    explanation: "'Pourquoi' means 'Why'.",
  },
  {
    question: "How do you say 'They are'?",
    options: ["Ils est", "Ils sont", "Ils êtes", "Ils es"],
    answer: "Ils sont",
    explanation: "'Ils sont' = They are.",
  },
  {
    question: "Which is a simple French sentence?",
    options: ["Chat est noir", "Je mange une pomme", "Mange je pizza", "Bonjour je suis"],
    answer: "Je mange une pomme",
    explanation: "'Je mange une pomme' = I am eating an apple.",
  },
];
 
  let xp = parseInt(localStorage.getItem(`xp_lesson6`)) || 0;
  let currentQuestion = parseInt(localStorage.getItem(`currentQuestion_lesson6`)) || 0;
  let lives = parseInt(localStorage.getItem(`lives_lesson6`)) || 3;
  let quizPassed = localStorage.getItem(`quizPassed_lesson6`) === "true";

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
    localStorage.setItem(`xp_lesson6`, xp);
    localStorage.setItem(`currentQuestion_lesson6`, currentQuestion);
    localStorage.setItem(`lives_lesson6`, lives);
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
      localStorage.setItem(`quizPassed_lesson6`, "true");
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
      localStorage.setItem(`quizPassed_lesson6`, "true");
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
  localStorage.removeItem(`xp_lesson6`);
  localStorage.removeItem(`currentQuestion_lesson6`);
  localStorage.removeItem(`lives_lesson6`);
  localStorage.removeItem(`quizPassed_lesson6`);
  location.reload();
}

function goToNextLesson() {
  window.location.href = "lesson7_article.html"; // Update appropriately
}

function returnToCourseList() {
  window.location.href = "index.html";
}

function restartQuiz() {
  restartLesson();
}