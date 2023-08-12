let questions = [];
let startTime = null; // Initialize startTime as null
let currentQuestionIndex = 0;
let totalCorrectAnswers = 0;
let totalAttempts = 0;
let accumulatedTime = 0;

async function loadJSON() {
  try {
    const response = await fetch('quiz.json');
    const data = await response.json();
    questions = data.questions;
    renderQuestion();
  } catch (error) {
    console.error('Error fetching JSON:', error);
  }
}


async function loadJSON() {
  try {
    const response = await fetch('quiz.json');
    const data = await response.json();
    questions = data.questions; // Use data.questions to access the array of questions
    renderQuestion();
    startTime = new Date().getTime(); // Start the timer
    updateTimer(); // Call the timer function
  } catch (error) {
    console.error('Error fetching JSON:', error);
  }
}

function updateTimer() {
  const currentTime = new Date().getTime();
  const totalTime = (currentTime - startTime) / 1000;
  const timeElement = document.getElementById('time');
  timeElement.textContent = `Time: ${totalTime.toFixed(1)}s`;

  requestAnimationFrame(updateTimer); // Recursively call the function
}


function renderQuestion() {
  const questionContainer = document.getElementById('question-container');
  const questionElement = document.getElementById('question');
  const answerButtons = document.getElementById('answer-buttons');
  const scoreboard = document.getElementById('scoreboard');
  
  if (currentQuestionIndex >= questions.length) {
    displayFinalScoreAndStats();
    return;
  }

  const currentQuestion = questions[currentQuestionIndex];
  questionElement.innerText = currentQuestion.question;

  // Clear existing answer buttons
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }

  const mixedAnswers = mixAnswers(currentQuestion.keywords); // Mix correct and random answers
  
  mixedAnswers.forEach(answer => {
    const button = document.createElement('button');
    button.innerText = answer;
    button.classList.add('btn');
    button.addEventListener('click', () => selectAnswer(answer === currentQuestion.keywords[0])); // Check if answer is correct
    answerButtons.appendChild(button);
  });

  scoreboard.innerHTML = `
    <span id="time">Time: ${getTimeElapsed().toFixed(1)}s</span>
    <span id="question-name">Question: ${currentQuestion.number}</span>
    <span id="accuracy">Accuracy: ${(totalCorrectAnswers / totalAttempts * 100).toFixed(2)}%</span>
    <span id="score">Score: ${totalCorrectAnswers}/${questions.length}</span>
  `;
}

function mixAnswers(correctAnswers) {
  const allAnswers = questions.flatMap(question => question.keywords);
  const shuffledAnswers = shuffleArray(allAnswers);
  return [correctAnswers[0], ...shuffledAnswers.slice(0, 4)]; // Mix correct and random answers
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function selectAnswer(isCorrect) {
  totalAttempts++;
  if (isCorrect) {
    totalCorrectAnswers++;
  }
  
  currentQuestionIndex++;
  startTime = new Date().getTime(); // Reset start time for the new question
  renderQuestion();
}

function getTimeElapsed() {
  const currentTime = new Date().getTime();
  return (currentTime - startTime) / 1000;
}

function displayFinalScoreAndStats() {
  const accuracy = ((totalCorrectAnswers / totalAttempts) * 100).toFixed(2);

  const scoreboard = document.getElementById('scoreboard');
  scoreboard.style.position = 'static'; // Reset the position of the scoreboard
  scoreboard.innerHTML = `
    <span id="time">Total Time: ${accumulatedTime.toFixed(1)}s</span>
    <span id="accuracy">Accuracy: ${accuracy}%</span>
    <span id="score">Score: ${totalCorrectAnswers}/${questions.length}</span>
  `;

  const questionContainer = document.getElementById('question-container');
  questionContainer.innerHTML = `
    <h2>Your Performance</h2>
    <p>Total time taken: ${accumulatedTime.toFixed(1)}s</p>
    <p>Accuracy: ${accuracy}%</p>
    <p>Score: ${totalCorrectAnswers}/${questions.length}</p>
  `;
}


window.addEventListener('DOMContentLoaded', () => {
  loadJSON();
});
