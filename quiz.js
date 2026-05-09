const quizData = [
  {
    question: "Which HTML tag is used to define an internal style sheet?",
    options: ["<script>", "<style>", "<css>"],
    correct: 1,
  },
  {
    question:
      "In CSS, which property is used to change the text color of an element?",
    options: ["font-color", "text-style", "color"],
    correct: 2,
  },
  {
    question:
      "Which of the following is the correct way to write a JavaScript array?",
    options: [
      'var colors = ["red", "green", "blue"]',
      'var colors = (1:"red", 2:"green", 3:"blue")',
      'var colors = "red", "green", "blue"',
    ],
    correct: 0,
  },
  {
    question: "What does the z-index property in CSS control?",
    options: [
      "The zoom level of an element",
      "The horizontal position of an element",
      "The stack order of overlapping elements",
    ],
    correct: 2,
  },
  {
    question: "How do you create a function in JavaScript?",
    options: [
      "function:myFunction()",
      "function myFunction()",
      "create myFunction()",
    ],
    correct: 1,
  },
  {
    question:
      "In React, what is used to pass data to a component from outside?",
    options: ["SetState", "Props", "UseEffect"],
    correct: 1,
  },
  {
    question:
      "Which HTML attribute is used to provide an alternative text for an image if it cannot be displayed?",
    options: ["title", "src", "alt"],
    correct: 2,
  },
];

const quiz = document.querySelector("#quiz");
const answerEle = document.querySelectorAll(".answer");
const questionelem = document.getElementById("question");

const optionElements = [
  document.getElementById("option-1"),
  document.getElementById("option-2"),
  document.getElementById("option-3"),
];

const submitbtn = document.getElementById("submit");
const nextBtn = document.getElementById("next");

let currentQuiz = 0;
let score = 0;

const loadQuiz = () => {
  deselectedAnswer();

  const { question, options } = quizData[currentQuiz];
  questionelem.innerHTML = `${currentQuiz + 1}: ${question}`;

  options.forEach((curElem, index) => {
    if (optionElements[index]) {
      optionElements[index].innerText = curElem;
    }
  });
};

const getSelectedOption = () => {
  let answerElement = Array.from(answerEle);
  return answerElement.findIndex((curElem) => curElem.checked);
};

const deselectedAnswer = () => {
  answerEle.forEach((curElem) => (curElem.checked = false));
};

loadQuiz();

nextBtn.addEventListener("click", () => {
  if (currentQuiz === quizData.length - 1) {
    alert("This is the last question, please click Submit to finish the quiz.");
    return;
  }

  const selectedOptionIndex = getSelectedOption();

  if (selectedOptionIndex === -1) {
    alert("Please select an answer before proceeding!");
    return;
  }

  if (selectedOptionIndex === quizData[currentQuiz].correct) {
    score++;
  }

  currentQuiz++;
  loadQuiz();
});

submitbtn.addEventListener("click", () => {
  if (currentQuiz !== quizData.length - 1) {
    alert(
      "Please finish all questions using the Next button before submitting!",
    );
    return;
  }

  const selectedOptionIndex = getSelectedOption();

  if (selectedOptionIndex === -1) {
    alert("Please select an answer before submitting!");
    return;
  }
  if (selectedOptionIndex === quizData[currentQuiz].correct) {
    score++;
  }
  quiz.innerHTML = `
    <div class="result">
      <h2>Your Score: ${score}/${quizData.length} Correct Answers!</h2>
      <p>Congratulations on completing the quiz!</p>
      <button class="reload-button" onclick="location.reload()">Play Again</button>
    </div>
  `;
});
