const images = [
    'images/image1.jpg', 'images/image1.jpg',
    'images/image2.jpg', 'images/image2.jpg',
    'images/image3.jpg', 'images/image3.jpg',
    'images/image4.jpg', 'images/image4.jpg',
    'images/image5.jpg', 'images/image5.jpg',
    'images/image6.jpg', 'images/image6.jpg'
];

const gameBoard = document.getElementById('gameBoard');
const timerElement = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const messageBox = document.getElementById('messageBox');
const messageBoxLose = document.getElementById('messageBoxLose');

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let timer;
let timeLeft = 45;
let matchedPairs = 0;

startButton.addEventListener('click', startGame);

function startGame() {
    startButton.disabled = true;
    initializeGame();
    startTimer();
}

function startTimer() {
    timeLeft = 45;
    timerElement.textContent = `Time: ${timeLeft}s`;

    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Time: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            showWinMessageLose();
            // alert('Time is up! Game Over.');
            resetGame();
        }
    }, 1000);
}

function resetGame() {
    clearInterval(timer);
    gameBoard.innerHTML = '';
    startButton.disabled = false;
    matchedPairs = 0;
    messageBox.classList.add('hidden');
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createCard(image) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.image = image;

    const img = document.createElement('img');
    img.src = image;
    img.alt = 'Card image';
    img.classList.add('hidden');

    card.appendChild(img);
    card.addEventListener('click', flipCard);
    return card;
}

function flipCard() {
    if (lockBoard || this === firstCard) return;

    const img = this.querySelector('img');
    img.classList.remove('hidden');
    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkMatch();
}

function checkMatch() {
    const isMatch = firstCard.dataset.image === secondCard.dataset.image;

    if (isMatch) {
        disableCards();
        matchedPairs++;
        if (matchedPairs === images.length / 2) {
            clearInterval(timer);
            showWinMessage();
        }
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.querySelector('img').classList.add('hidden');
        secondCard.querySelector('img').classList.add('hidden');
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function initializeGame() {
    resetGame();
    shuffle(images);
    images.forEach(image => {
        const card = createCard(image);
        gameBoard.appendChild(card);
    });
}

function showWinMessage() {
    messageBox.classList.remove('hidden');
    messageBox.style.display = 'block';
}
function showWinMessageLose() {
    messageBoxLose.classList.remove('hidden');
    messageBoxLose.style.display = 'block';
}