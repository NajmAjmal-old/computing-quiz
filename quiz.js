let questions = [];
let currentQuestionIndex = 0;
let startTime = new Date().getTime();
let totalCorrectAnswers = 0;
let totalAttempts = 0;

async function loadJSON() {
  try {
    const response = await fetch('qa.json');
    const data = await response.json();
    questions = data;
    renderQuestion();
  } catch (error) {
    console.error('Error fetching JSON:', error);
  }
}

function renderQuestion() {
  const questionContainer = document.getElementById('question-container');
  const questionElement = document.getElementById('question');
  const answerButtons = document.getElementById('answer-buttons');

  if (currentQuestionIndex >= questions.length) {
    displayFinalScoreAndStats();
    return;
  }

  const currentQuestion = questions[currentQuestionIndex];
  questionElement.innerText = currentQuestion.text;

  // Clear existing answer buttons
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }

  currentQuestion.answers.forEach(answer => {
    const button = document.createElement('button');
    button.innerText = answer.text;
    button.classList.add('btn');
    button.addEventListener('click', () => selectAnswer(answer));
    answerButtons.appendChild(button);
  });
}

function selectAnswer(answer) {
  totalAttempts++;
  if (answer.correct) {
    totalCorrectAnswers++;
  }

  currentQuestionIndex++;
  renderQuestion();
}

function displayFinalScoreAndStats() {
  const currentTime = new Date().getTime();
  const totalTime = (currentTime - startTime) / 1000;
  const accuracy = (totalCorrectAnswers / totalAttempts) * 100;

  const scoreboard = document.getElementById('scoreboard');
  scoreboard.innerHTML = `
    <span id="time">Time: ${totalTime.toFixed(1)}s</span>
    <span id="accuracy">Accuracy: ${accuracy.toFixed(2)}%</span>
    <span id="score">Score: ${totalCorrectAnswers}/${questions.length}</span>
  `;

  const nextButton = document.getElementById('next-button');
  nextButton.style.display = 'none';
}

window.addEventListener('DOMContentLoaded', () => {
  loadJSON();
});
