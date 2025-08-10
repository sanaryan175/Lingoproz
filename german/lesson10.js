document.addEventListener("DOMContentLoaded", function () {
  const questions = [
    {
      question: "How do you say 'How are you?' in German?",
      options: ["Wie geht's?", "Was ist das?", "Wo bist du?", "Wann ist das?"],
      answer: "Wie geht's?",
      explanation: "'Wie geht's?' means 'How are you?' in German."
    },
    {
      question: "What does 'Ich heiße Anna' mean?",
      options: ["I am Anna", "My name is Anna", "I have a cat", "I live in Anna"],
      answer: "My name is Anna",
      explanation: "'Ich heiße Anna' translates to 'My name is Anna'."
    },
    {
      question: "Translate to German: 'Nice to meet you'",
      options: ["Schön dich zu treffen", "Guten Tag", "Willkommen", "Danke"],
      answer: "Schön dich zu treffen",
      explanation: "'Schön dich zu treffen' means 'Nice to meet you'."
    },
    {
      question: "What is 'Where do you live?' in German?",
      options: ["Wo wohnst du?", "Wie alt bist du?", "Was machst du?", "Wann kommst du?"],
      answer: "Wo wohnst du?",
      explanation: "'Wo wohnst du?' means 'Where do you live?'."
    },
    {
      question: "Choose the German phrase for 'I don't understand'.",
      options: ["Ich verstehe nicht", "Ich habe Hunger", "Ich bin müde", "Ich mag Musik"],
      answer: "Ich verstehe nicht",
      explanation: "'Ich verstehe nicht' means 'I don't understand'."
    },
    {
      question: "How do you say 'Please speak slowly'?",
      options: ["Bitte sprechen Sie langsam", "Sprechen Sie schnell", "Ich verstehe", "Ich weiß nicht"],
      answer: "Bitte sprechen Sie langsam",
      explanation: "'Bitte sprechen Sie langsam' means 'Please speak slowly'."
    },
    {
      question: "Translate 'Do you speak English?' into German.",
      options: ["Sprechen Sie Englisch?", "Kannst du Deutsch?", "Magst du Englisch?", "Verstehst du das?"],
      answer: "Sprechen Sie Englisch?",
      explanation: "'Sprechen Sie Englisch?' means 'Do you speak English?'."
    },
    {
      question: "What does 'Ich komme aus Indien' mean?",
      options: ["I live in India", "I am from India", "I love India", "I travel to India"],
      answer: "I am from India",
      explanation: "'Ich komme aus Indien' means 'I am from India'."
    },
    {
      question: "Choose the correct German for 'I’m learning German'.",
      options: ["Ich lerne Deutsch", "Ich spreche Englisch", "Ich wohne in Berlin", "Ich heiße Hans"],
      answer: "Ich lerne Deutsch",
      explanation: "'Ich lerne Deutsch' means 'I’m learning German'."
    },
    {
      question: "Translate 'Can you help me?'",
      options: ["Können Sie mir helfen?", "Kann ich gehen?", "Wie geht’s dir?", "Was ist das?"],
      answer: "Können Sie mir helfen?",
      explanation: "'Können Sie mir helfen?' means 'Can you help me?'."
    },
    {
      question: "What does 'Ich habe eine Frage' mean?",
      options: ["I have a question", "I need food", "I am late", "I like football"],
      answer: "I have a question",
      explanation: "'Ich habe eine Frage' means 'I have a question'."
    },
    {
      question: "Translate 'What time is it?'",
      options: ["Wie spät ist es?", "Wo ist es?", "Was kostet das?", "Was machst du?"],
      answer: "Wie spät ist es?",
      explanation: "'Wie spät ist es?' means 'What time is it?'."
    },
    {
      question: "What is 'Good night' in German?",
      options: ["Gute Nacht", "Guten Morgen", "Guten Abend", "Hallo"],
      answer: "Gute Nacht",
      explanation: "'Gute Nacht' means 'Good night'."
    },
    {
      question: "How do you say 'Excuse me' in German?",
      options: ["Entschuldigung", "Achtung", "Bitte", "Gerne"],
      answer: "Entschuldigung",
      explanation: "'Entschuldigung' means 'Excuse me'."
    },
    {
      question: "Translate to German: 'I'm sorry'",
      options: ["Es tut mir leid", "Bitte sehr", "Keine Ursache", "Willkommen"],
      answer: "Es tut mir leid",
      explanation: "'Es tut mir leid' means 'I'm sorry'."
    }
  ];

  let xp = parseInt(localStorage.getItem(`xp_lesson10`)) || 0;
  let currentQuestion = parseInt(localStorage.getItem(`currentQuestion_lesson10`)) || 0;
  let lives = parseInt(localStorage.getItem(`lives_lesson10`)) || 3;
  let quizPassed = localStorage.getItem(`quizPassed_lesson10`) === "true";

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
    localStorage.setItem(`xp_lesson10`, xp);
    localStorage.setItem(`currentQuestion_lesson10`, currentQuestion);
    localStorage.setItem(`lives_lesson10`, lives);
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
      localStorage.setItem(`quizPassed_lesson10`, "true");
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
      localStorage.setItem(`quizPassed_lesson10`, "true");
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
  localStorage.removeItem(`xp_lesson10`);
  localStorage.removeItem(`currentQuestion_lesson10`);
  localStorage.removeItem(`lives_lesson10`);
  localStorage.removeItem(`quizPassed_lesson10`);
  location.reload();
}

function goToNextLesson() {
  window.location.href = "course_comp.html";
}

function returnToCourseList() {
  window.location.href = "index.html";
}

function restartQuiz() {
  restartLesson();
}
