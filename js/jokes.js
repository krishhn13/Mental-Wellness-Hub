document.addEventListener('DOMContentLoaded', () => {
    const sounds = {
        click: new Audio('https://www.soundjay.com/buttons/button-1.mp3'),
        laugh: new Audio('https://www.soundjay.com/human/sounds/laughter-01.mp3'),
        success: new Audio('https://www.soundjay.com/misc/sounds/bell-ring-01.mp3')
    };
    function playSound(type) { sounds[type].play().catch(err => console.log('Audio failed:', err)); }

    const jokes = [
        { text: "Aaj kal log itne busy hai ki tension bhi appointment lekar aati hai!", category: "life" },
        { text: "Bhai, life ek joke hai—bas punchline samajh nahi aata!", category: "life" },
        { text: "Ek dost ne bola 'Chill kar,' maine bola 'Bhai, fridge mein baithu kya?'", category: "friends" },
        { text: "Tension lene ka nahi, dene ka hai—boss ko bol!", category: "work" },
        { text: "Bhai, Wi-Fi weak ho toh dil se connect kar!", category: "life" },
        { text: "Zindagi ek game hai, bas save option nahi milta!", category: "life" },
        { text: "Ek baar galti se 'LOL' bol diya, mummy boli 'Laugh kyun nahi kiya?'", category: "friends" },
        { text: "Bhai, gym jaane ka plan hai—kal se!", category: "life" },
        { text: "Paisa nahi hai toh kya, attitude toh full hai!", category: "life" },
        { text: "Boss ne bola 'Kaam karo,' maine bola 'Mood nahi hai!'", category: "work" },
        { text: "Dost bola 'Bhai tu hero hai,' maine bola 'Phir villain kaun hai?'", category: "friends" },
        { text: "Life mein ek hi rule: Jo bhi ho, thodi masti toh banta hai!", category: "life" },
        { text: "Phone mein battery 1% bachi, aur main call pe 'Haan, bol!'", category: "life" },
        { text: "Bhai, khud ko samajhdaar samajhta hoon, par mirror bolta hai 'Chill!'", category: "life" },
        { text: "Exam mein teacher boli 'Time up,' main bola 'Abhi toh dil khula!'", category: "work" }
    ];

    const jokeDisplay = document.getElementById('joke-display');
    const nextJoke = document.getElementById('next-joke');
    const favoriteJokeBtn = document.getElementById('favorite-joke');
    const shareJokeBtn = document.getElementById('share-joke');
    const jokeCategory = document.getElementById('joke-category');
    const jokeProgress = document.getElementById('joke-progress');
    let currentJoke = null;
    let seenJokes = new Set();

    function filterJokes(category) {
        return category === 'all' ? jokes : jokes.filter(joke => joke.category === category);
    }

    function showJoke() {
        const selectedCategory = jokeCategory.value;
        const filteredJokes = filterJokes(selectedCategory);
        const unseenJokes = filteredJokes.filter(joke => !seenJokes.has(joke.text));
        if (unseenJokes.length === 0) seenJokes.clear();
        const randomJoke = unseenJokes.length > 0 ? 
            unseenJokes[Math.floor(Math.random() * unseenJokes.length)] : 
            filteredJokes[Math.floor(Math.random() * filteredJokes.length)];
        currentJoke = randomJoke;
        jokeDisplay.textContent = randomJoke.text;
        seenJokes.add(randomJoke.text);
        jokeProgress.textContent = `Jokes Seen: ${seenJokes.size} / ${jokes.length}`;
        gsap.from(jokeDisplay, { opacity: 0, y: 20, duration: 0.5, ease: 'bounce.out' });
        playSound('laugh');
    }
    showJoke();

    nextJoke.addEventListener('click', () => {
        showJoke();
        playSound('click');
    });

    favoriteJokeBtn.addEventListener('click', () => {
        if (currentJoke) {
            let favorites = JSON.parse(localStorage.getItem('favoriteJokes')) || [];
            if (!favorites.includes(currentJoke.text)) {
                favorites.push(currentJoke.text);
                localStorage.setItem('favoriteJokes', JSON.stringify(favorites));
                updateFavoriteList();
                playSound('success');
            }
        }
    });

    shareJokeBtn.addEventListener('click', () => {
        if (currentJoke && navigator.share) {
            navigator.share({
                title: 'Funny Joke from Mental Wellness Hub',
                text: currentJoke.text,
                url: window.location.href
            }).then(() => playSound('success'))
              .catch(() => alert('Bhai, sharing failed! Copy kar le!'));
        } else {
            alert('Bhai, yeh joke copy kar le: ' + currentJoke.text);
            playSound('click');
        }
    });

    jokeCategory.addEventListener('change', () => {
        seenJokes.clear();
        showJoke();
        playSound('click');
    });

    const memeImage = document.getElementById('meme-image');
    const memeFallback = document.getElementById('meme-fallback');
    const nextMeme = document.getElementById('next-meme');
    const memes = [
        'https://via.placeholder.com/300x200?text=Meme+1',
        'https://via.placeholder.com/300x200?text=Meme+2',
        'https://via.placeholder.com/300x200?text=Meme+3',
        'https://via.placeholder.com/300x200?text=Meme+4',
        'https://via.placeholder.com/300x200?text=Meme+5'
    ];

    function showMeme() {
        const randomMeme = memes[Math.floor(Math.random() * memes.length)];
        memeImage.src = randomMeme;
        memeImage.style.display = 'none';
        memeFallback.style.display = 'none';
        memeImage.onload = () => {
            memeImage.style.display = 'block';
            gsap.from(memeImage, { opacity: 0, rotate: 10, duration: 0.5 });
        };
        memeImage.onerror = () => {
            memeFallback.style.display = 'block';
        };
    }
    showMeme();

    nextMeme.addEventListener('click', () => {
        showMeme();
        playSound('click');
    });

    const favoriteList = document.getElementById('favorite-list');
    function updateFavoriteList() {
        const favorites = JSON.parse(localStorage.getItem('favoriteJokes')) || [];
        favoriteList.innerHTML = '<h3>Favorite Jokes</h3>' + favorites.map(joke => `<p>${joke}</p>`).join('');
    }
    updateFavoriteList();

    gsap.from('.navbar', { opacity: 0, y: -50, duration: 1 });
    gsap.from('.jokes', { opacity: 0, y: 50, duration: 1, delay: 0.2 });
    gsap.from('.random-meme', { opacity: 0, y: 50, duration: 0.8, delay: 1.0 });
});