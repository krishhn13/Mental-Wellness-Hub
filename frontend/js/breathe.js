document.addEventListener('DOMContentLoaded', () => {
    const breathingCircle = document.getElementById('breathing-circle');
    const breathingButtons = document.querySelectorAll('.controls button[data-time]');
    const musicToggle = document.getElementById('music-toggle');
    const breathCounter = document.getElementById('breath-counter');
    let breathingActive = false;
    let breathCount = 0;
    const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');

    breathingButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!breathingActive) {
                breathingActive = true;
                breathCount = 0;
                breathCounter.textContent = `Breaths: ${breathCount}`;
                const time = parseInt(btn.dataset.time) * 60;
                gsap.to(breathingCircle, {
                    scale: 1.5,
                    duration: 4,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    onRepeat: () => {
                        breathCount++;
                        breathCounter.textContent = `Breaths: ${breathCount}`;
                    },
                    onComplete: () => setTimeout(() => {
                        breathingActive = false;
                        gsap.to(breathingCircle, { scale: 1, duration: 1 });
                    }, time * 1000)
                });
            }
        });
    });

    musicToggle.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            musicToggle.textContent = '🔇';
        } else {
            audio.pause();
            musicToggle.textContent = '🎵';
        }
    });

    gsap.from('.navbar', { opacity: 0, y: -50, duration: 1 });
    gsap.from('.breathing', { opacity: 0, y: 50, duration: 1, delay: 0.2 });
});