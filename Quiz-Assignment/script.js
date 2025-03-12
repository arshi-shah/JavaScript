const progressBar = document.querySelector(".progress-bar"),
  progressText = document.querySelector(".progress-text");

const progress = (value) => {
  const percentage = (value / DEFAULT_TIME) * 100;
  progressBar.style.width = `${percentage}%`;
  progressText.innerHTML = `${value}s`;
};

const startBtn = document.querySelector(".start"),
  numQuestions = document.querySelector("#num-questions"),
  category = document.querySelector("#category"),
  difficulty = document.querySelector("#difficulty"),
  quiz = document.querySelector(".quiz"),
  startScreen = document.querySelector(".start-screen"),
  submitBtn = document.querySelector(".submit"),
  nextBtn = document.querySelector(".next"),
  questionText = document.querySelector(".question"),
  answersWrapper = document.querySelector(".answer-wrapper"),
  questionNumber = document.querySelector(".number");

let questions = [],
  score = 0,
  currentQuestion = 0,
  timer,
  timeLeft;

const DEFAULT_TIME = 15; // Default 15s timer

const startQuiz = () => {
  const num = numQuestions.value || 5;
  const cat = category.value || 9;
  const diff = difficulty.value || "medium";

  loadingAnimation();

  const url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.results.length === 0) {
        alert("No questions found! Try different settings.");
        return;
      }
      questions = data.results;
      setTimeout(() => {
        startScreen.classList.add("hide");
        quiz.classList.remove("hide");
        currentQuestion = 0;
        showQuestion(questions[currentQuestion]);
      }, 1000);
    })
    .catch((error) => {
      console.error("Error fetching questions:", error);
      alert("Failed to load questions. Try again.");
    });
};

startBtn.addEventListener("click", startQuiz);

const showQuestion = (question) => {
  if (!question) return;

  questionText.innerHTML = question.question;
  const answers = [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5);

  answersWrapper.innerHTML = answers
    .map(
      (answer) => `
        <div class="answer">
          <span class="text">${answer}</span>
          <span class="checkbox">
            <i class="fas fa-check"></i>
          </span>
        </div>
      `
    )
    .join("");

  questionNumber.innerHTML = `Question <span class="current">${currentQuestion + 1}</span>
                              <span class="total">/${questions.length}</span>`;

  document.querySelectorAll(".answer").forEach((answer) => {
    answer.addEventListener("click", () => {
      if (!answer.classList.contains("checked")) {
        document.querySelectorAll(".answer").forEach((a) => a.classList.remove("selected"));
        answer.classList.add("selected");
        submitBtn.disabled = false;
      }
    });
  });

  // Start 15s countdown
  timeLeft = DEFAULT_TIME;
  startTimer();
};

const startTimer = () => {
  clearInterval(timer);
  timer = setInterval(() => {
    if (timeLeft === 3) {
      playAudio("countdown.mp3"); // Play countdown sound at 3s
    }

    if (timeLeft > 0) {
      progress(timeLeft);
      timeLeft--;
    } else {
      clearInterval(timer);
      checkAnswer(); // Auto-submit when time runs out
    }
  }, 1000);
};

submitBtn.addEventListener("click", () => {
  clearInterval(timer);
  checkAnswer();
});

nextBtn.addEventListener("click", () => {
  nextQuestion();
  submitBtn.style.display = "block";
  nextBtn.style.display = "none";
});

const checkAnswer = () => {
  clearInterval(timer);
  const selectedAnswer = document.querySelector(".answer.selected");

  if (selectedAnswer) {
    const answerText = selectedAnswer.querySelector(".text").innerHTML;
    if (answerText === questions[currentQuestion].correct_answer) {
      score++;
      selectedAnswer.classList.add("correct");
    } else {
      selectedAnswer.classList.add("wrong");
      document.querySelectorAll(".answer").forEach((a) => {
        if (a.querySelector(".text").innerHTML === questions[currentQuestion].correct_answer) {
          a.classList.add("correct");
        }
      });
    }
  } else {
    document.querySelectorAll(".answer").forEach((a) => {
      if (a.querySelector(".text").innerHTML === questions[currentQuestion].correct_answer) {
        a.classList.add("correct");
      }
    });
  }

  document.querySelectorAll(".answer").forEach((a) => a.classList.add("checked"));

  submitBtn.style.display = "none";
  nextBtn.style.display = "block";
};

const nextQuestion = () => {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    showQuestion(questions[currentQuestion]);
  } else {
    showScore();
  }
};

const showScore = () => {
  document.querySelector(".end-screen").classList.remove("hide");
  quiz.classList.add("hide");
  document.querySelector(".final-score").innerHTML = score;
  document.querySelector(".total-score").innerHTML = `/ ${questions.length}`;
};

const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", () => {
  window.location.reload();
});

const playAudio = (src) => {
  const audio = new Audio(src);
  audio.play();
};

const loadingAnimation = () => {
  startBtn.innerHTML = "Loading";
  const loadingInterval = setInterval(() => {
    if (startBtn.innerHTML.length === 10) {
      startBtn.innerHTML = "Loading";
    } else {
      startBtn.innerHTML += ".";
    }
  }, 500);
};
