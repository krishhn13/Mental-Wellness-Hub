document.addEventListener('DOMContentLoaded', () => {
  const sounds = {
    click: new Audio('https://www.soundjay.com/buttons/button-1.mp3'),
    laugh: new Audio('https://www.soundjay.com/human/sounds/laughter-01.mp3'),
    success: new Audio('https://www.soundjay.com/misc/sounds/bell-ring-01.mp3')
  };
  function playSound(type) { sounds[type].play().catch(err => console.log('Audio failed:', err)); }

  const jokeDisplay = document.getElementById('joke-display');
  const nextJoke = document.getElementById('next-joke');
  const favoriteJokeBtn = document.getElementById('favorite-joke');
  const shareJokeBtn = document.getElementById('share-joke');
  const jokeCategory = document.getElementById('joke-category');
  const jokeProgress = document.getElementById('joke-progress');
  let currentJoke = null;
  let seenJokes = new Set();

  async function fetchJokes(category = 'all') {
    const url = category === 'all'
      ? '/api/jokes'
      : `/api/jokes?category=${category}`;

    const response = await fetch(url);
    return await response.json();
  }


  async function showJoke() {
    const selectedCategory = jokeCategory.value;
    const jokes = await fetchJokes(selectedCategory);
    const unseenJokes = jokes.filter(joke => !seenJokes.has(joke.text));
    if (unseenJokes.length === 0) seenJokes.clear();
    const randomJoke = unseenJokes.length > 0 ?
      unseenJokes[Math.floor(Math.random() * unseenJokes.length)] :
      jokes[Math.floor(Math.random() * jokes.length)];
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

  favoriteJokeBtn.addEventListener('click', async () => {
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