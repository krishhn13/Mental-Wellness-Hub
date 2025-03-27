document.addEventListener('DOMContentLoaded', () => {
    const sounds = {
        click: new Audio('https://www.soundjay.com/buttons/button-1.mp3'),
        success: new Audio('https://www.soundjay.com/misc/sounds/bell-ring-01.mp3')
    };
    function playSound(type) { sounds[type].play(); }

    const gameBoard = document.getElementById('game-board');
    const gameScore = document.getElementById('game-score');
    const gameTimer = document.getElementById('game-timer');
    const restartGame = document.getElementById('restart-game');
    let score = 0;
    let flippedCards = [];
    let timeLeft = 60;
    const emojis = ['😊', '😌', '😢', '😡', '😊', '😌', '😢', '😡'];

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function startGame() {
        gameBoard.innerHTML = '';
        score = 0;
        gameScore.textContent = `Score: ${score}`;
        flippedCards = [];
        timeLeft = 60;
        gameTimer.textContent = `Time: ${timeLeft}s`;
        const shuffledEmojis = shuffle([...emojis]);

        shuffledEmojis.forEach(emoji => {
            const card = document.createElement('div');
            card.classList.add('game-card');
            card.dataset.emoji = emoji;
            card.textContent = '?';
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
            gsap.from(card, { opacity: 0, scale: 0, duration: 0.5, delay: Math.random() * 0.5 });
        });

        const timer = setInterval(() => {
            timeLeft--;
            gameTimer.textContent = `Time: ${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                alert(`Time's up! Score: ${score}`);
                startGame();
            }
        }, 1000);
    }

    function flipCard() {
        if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
            this.classList.add('flipped');
            this.textContent = this.dataset.emoji;
            flippedCards.push(this);
            playSound('click');

            if (flippedCards.length === 2) {
                setTimeout(checkMatch, 1000);
            }
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;
        if (card1.dataset.emoji === card2.dataset.emoji) {
            score += 10;
            gameScore.textContent = `Score: ${score}`;
            playSound('success');
            flippedCards = [];
            if (score === 40) alert('Bhai, tu jeet gaya! Mast khela!');
        } else {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '?';
            card2.textContent = '?';
            flippedCards = [];
        }
    }

    restartGame.addEventListener('click', () => {
        startGame();
        playSound('click');
    });

    startGame();

    const guessGame = {
        hints: [
            { hint: "Feeling on top of the world!", emoji: "😊" },
            { hint: "Chill like a monk!", emoji: "😌" },
            { hint: "Rainy days and tears!", emoji: "😢" },
            { hint: "Ready to punch something!", emoji: "😡" }
        ],
        score: 0
    };

    const guessHint = document.getElementById('guess-hint');
    const guessOptions = document.getElementById('guess-options');
    const guessScore = document.getElementById('guess-score');
    const restartGuess = document.getElementById('restart-guess');

    function startGuessGame() {
        guessGame.score = 0;
        guessScore.textContent = `Score: ${guessGame.score}`;
        showGuessRound();
    }

    function showGuessRound() {
        const round = guessGame.hints[Math.floor(Math.random() * guessGame.hints.length)];
        guessHint.textContent = round.hint;
        guessOptions.innerHTML = '';
        const emojis = ['😊', '😌', '😢', '😡'];
        shuffle(emojis).forEach(emoji => {
            const btn = document.createElement('button');
            btn.textContent = emoji;
            btn.classList.add('guess-option');
            btn.addEventListener('click', () => checkGuess(emoji, round.emoji));
            guessOptions.appendChild(btn);
        });
    }

    function checkGuess(selected, correct) {
        if (selected === correct) {
            guessGame.score += 5;
            guessScore.textContent = `Score: ${guessGame.score}`;
            playSound('success');
            if (guessGame.score === 20) alert('Bhai, tu guess master hai!');
        } else {
            playSound('click');
        }
        showGuessRound();
    }

    restartGuess.addEventListener('click', () => {
        startGuessGame();
        playSound('click');
    });

    startGuessGame();

    gsap.from('.navbar', { opacity: 0, y: -50, duration: 1 });
    gsap.from('.games', { opacity: 0, y: 50, duration: 1, delay: 0.2 });
});