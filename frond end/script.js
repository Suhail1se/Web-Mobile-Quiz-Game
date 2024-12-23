const leftBuzzer = document.getElementById('leftBuzzer');
const rightBuzzer = document.getElementById('rightBuzzer');
const result = document.getElementById('result');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const answerFeedback = document.getElementById('answer-feedback');
let isBuzzed = false;
let currentQuestion = null;
let displayedQuestions = [];

function resetBuzzers() {
    leftBuzzer.style.backgroundColor = 'red';
    rightBuzzer.style.backgroundColor = 'red';
    leftBuzzer.disabled = false;
    rightBuzzer.disabled = false;
    result.textContent = '';
    isBuzzed = false;
    loadQuestion();
}

function handleLeftBuzz() {
    if (!isBuzzed) {
        isBuzzed = true;
        leftBuzzer.style.backgroundColor = 'green';
        result.textContent = 'Left buzzer was clicked first';
        rightBuzzer.disabled = true;
        var audio = new Audio('Buzzer sound effect.mp3');
        audio.play();
        setTimeout(resetBuzzers, 5000);
    }
}

function handleRightBuzz() {
    if (!isBuzzed) {
        isBuzzed = true;
        rightBuzzer.style.backgroundColor = 'green';
        result.textContent = 'Right buzzer was clicked first';
        leftBuzzer.disabled = true;
        var audio = new Audio('Buzzer sound effect.mp3');
        audio.play();
        setTimeout(resetBuzzers, 5000);
    }
}

leftBuzzer.addEventListener('click', handleLeftBuzz);
rightBuzzer.addEventListener('click', handleRightBuzz);

document.addEventListener('keydown', (event) => {
    if (event.key === 's' || event.key === 'S') {
        handleLeftBuzz();
    } else if (event.key === 'k' || event.key === 'K') {
        handleRightBuzz();
    }
});

function loadQuestion() {
    fetch('http://localhost:3000/api/questions')
        .then(response => response.json())
        .then(questions => {
            // Filter out already displayed questions
            const availableQuestions = questions.filter(q => !displayedQuestions.includes(q.question));
            if (availableQuestions.length === 0) {
                // If all questions have been displayed, reset the displayedQuestions array
                displayedQuestions = [];
            }
            // Pick a random question from the available ones
            const randomIndex = Math.floor(Math.random() * availableQuestions.length);
            currentQuestion = availableQuestions[randomIndex];
            displayedQuestions.push(currentQuestion.question); // Mark this question as displayed

            questionElement.textContent = currentQuestion.question;
            optionsElement.innerHTML = '';
            answerFeedback.textContent = '';
            currentQuestion.options.forEach(option => {
                const optionElement = document.createElement('div');
                optionElement.textContent = option;
                optionElement.className = 'option';
                optionElement.addEventListener('click', () => handleAnswer(option));
                optionsElement.appendChild(optionElement);
            });
        });
}

function handleAnswer(selectedOption) {
    if (selectedOption === currentQuestion.correctAnswer) {
        answerFeedback.textContent = 'Correct!';
        answerFeedback.className = '';
        var audio = new Audio('Correct.mp3');
        audio.play();
    } else {
        answerFeedback.textContent = 'Incorrect!';
        answerFeedback.className = 'incorrect';
        var audio = new Audio('Wrong.mp3');
        audio.play();
    }
    setTimeout(resetBuzzers, 3000); // Give 3 seconds to read the feedback before resetting
}

loadQuestion();
