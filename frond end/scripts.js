// script.js
let leftScore = 0;
let rightScore = 0;
let isBuzzed = false;
let currentQuestion = null;
let displayedQuestions = [];
let keyBinds = {
    option1: '1',
    option2: '2',
    option3: '3'
};
let questionTimeout, answerTimeout, nextQuestionTimeout;

document.getElementById('start-game').addEventListener('click', startGame);

function startGame() {
    const difficulty = document.getElementById('difficulty').value;
    keyBinds.option1 = document.getElementById('key-bind-option-1').value;
    keyBinds.option2 = document.getElementById('key-bind-option-2').value;
    keyBinds.option3 = document.getElementById('key-bind-option-3').value;

    document.getElementById('welcome-page').style.display = 'none';
    document.getElementById('game-page').style.display = 'block';

    loadQuestion(difficulty);
}

function resetBuzzers() {
    leftBuzzer.style.backgroundColor = 'red';
    rightBuzzer.style.backgroundColor = 'red';
    leftBuzzer.disabled = false;
    rightBuzzer.disabled = false;
    result.textContent = '';
    isBuzzed = false;
    clearTimeout(nextQuestionTimeout);
    nextQuestionTimeout = setTimeout(() => loadQuestion(difficulty), 3000); // 3 seconds to load next question
}

function handleLeftBuzz() {
    if (!isBuzzed) {
        isBuzzed = true;
        leftBuzzer.style.backgroundColor = 'green';
        result.textContent = 'Left buzzer was clicked first';
        rightBuzzer.disabled = true;
        var audio = new Audio('Buzzer sound effect.mp3');
        audio.play();
        clearTimeout(questionTimeout);
        answerTimeout = setTimeout(resetBuzzers, 5000); // 5 seconds to choose an answer
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
        clearTimeout(questionTimeout);
        answerTimeout = setTimeout(resetBuzzers, 5000); // 5 seconds to choose an answer
    }
}

leftBuzzer.addEventListener('click', handleLeftBuzz);
rightBuzzer.addEventListener('click', handleRightBuzz);

document.addEventListener('keydown', (event) => {
    if (event.key === 's' || event.key === 'S') {
        handleLeftBuzz();
    } else if (event.key === 'k' || event.key === 'K') {
        handleRightBuzz();
    } else if (event.key === keyBinds.option1) {
        handleAnswer(currentQuestion.options[0]);
    } else if (event.key === keyBinds.option2) {
        handleAnswer(currentQuestion.options[1]);
    } else if (event.key === keyBinds.option3) {
        handleAnswer(currentQuestion.options[2]);
    }
});

function loadQuestion(difficulty) {
    fetch('http://localhost:3000/api/questions')
        .then(response => response.json())
        .then(questions => {
            const filteredQuestions = questions.filter(q => q.difficulty === difficulty);
            const availableQuestions = filteredQuestions.filter(q => !displayedQuestions.includes(q.question));
            if (availableQuestions.length === 0) {
                displayedQuestions = [];
            }
            const randomIndex = Math.floor(Math.random() * availableQuestions.length);
            currentQuestion = availableQuestions[randomIndex];
            displayedQuestions.push(currentQuestion.question);

            questionElement.textContent = currentQuestion.question;
            optionsElement.innerHTML = '';
            answerFeedback.textContent = '';
            currentQuestion.options.forEach((option, index) => {
                const optionElement = document.createElement('div');
                optionElement.textContent = option;
                optionElement.className = 'option';
                optionElement.addEventListener('click', () => handleAnswer(option));
                optionsElement.appendChild(optionElement);
            });

            clearTimeout(questionTimeout);
            questionTimeout = setTimeout(resetBuzzers, 5000); // 5 seconds to click the buzzer
        });
}

function handleAnswer(selectedOption) {
    clearTimeout(answerTimeout);
    if (selectedOption === currentQuestion.correctAnswer) {
        answerFeedback.textContent = 'Correct!';
        answerFeedback.className = '';
        var audio = new Audio('Correct.mp3');
        audio.play();
        if (isBuzzed && leftBuzzer.style.backgroundColor === 'green') {
            leftScore++;
            document.getElementById('left-score').textContent = `Left Score: ${leftScore}`;
        } else if (isBuzzed && rightBuzzer.style.backgroundColor === 'green') {
            rightScore++;
            document.getElementById('right-score').textContent = `Right Score: ${rightScore}`;
        }
    } else {
        answerFeedback.textContent = 'Incorrect!';
        answerFeedback.className = 'incorrect';
        var audio = new Audio('Wrong.mp3');
        audio.play();
    }
    setTimeout(resetBuzzers, 3000); // 3 seconds to load the next question
}

loadQuestion();
