document.addEventListener("DOMContentLoaded", function () {
  const questions = [
    {
      question: "What is 'lesen' in English?",
      options: ["to sing", "to dance", "to read", "to swim"],
      answer: "to read",
      explanation: "'lesen' means 'to read'.",
    },
    {
      question: "Translate 'to play football' into German.",
      options: ["Fußball spielen", "lesen", "kochen", "tanzen"],
      answer: "Fußball spielen",
      explanation: "'Fußball spielen' means 'to play football'.",
    },
    {
      question: "What does 'schwimmen' mean?",
      options: ["to paint", "to sing", "to swim", "to draw"],
      answer: "to swim",
      explanation: "'schwimmen' means 'to swim'.",
    },
    {
      question: "What is 'to dance' in German?",
      options: ["tanzen", "schlafen", "hören", "schreiben"],
      answer: "tanzen",
      explanation: "'tanzen' means 'to dance'.",
    },
    {
      question: "Translate 'to cook' into German.",
      options: ["kochen", "lesen", "reisen", "laufen"],
      answer: "kochen",
      explanation: "'kochen' means 'to cook'.",
    },
    {
      question: "What does 'zeichnen' mean?",
      options: ["to draw", "to sleep", "to study", "to travel"],
      answer: "to draw",
      explanation: "'zeichnen' means 'to draw'.",
    }
  ];
  
  let xp = parseInt(localStorage.getItem(`xp_lesson4`)) || 0;
  let currentQuestion = parseInt(localStorage.getItem(`currentQuestion_lesson4`)) || 0;
  let lives = parseInt(localStorage.getItem(`lives_lesson4`)) || 3;
  let quizPassed = localStorage.getItem(`quizPassed_lesson4`) === "true";

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
    localStorage.setItem(`xp_lesson4`, xp);
    localStorage.setItem(`currentQuestion_lesson4`, currentQuestion);
    localStorage.setItem(`lives_lesson4`, lives);
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
      localStorage.setItem(`quizPassed_lesson4`, "true");
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
      localStorage.setItem(`quizPassed_lesson4`, "true");
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
  localStorage.removeItem(`xp_lesson4`);
  localStorage.removeItem(`currentQuestion_lesson4`);
  localStorage.removeItem(`lives_lesson4`);
  localStorage.removeItem(`quizPassed_lesson4`);
  location.reload();
}

function goToNextLesson() {
  window.location.href = "lesson5_article.html"; // Update appropriately
}

function returnToCourseList() {
  window.location.href = "index.html";
}

function restartQuiz() {
  restartLesson();
}
