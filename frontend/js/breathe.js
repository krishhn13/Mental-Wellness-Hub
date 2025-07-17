document.addEventListener('DOMContentLoaded', () => {
    const breathingCircle = document.getElementById('breathing-circle');
    const breathingButtons = document.querySelectorAll('.controls button[data-time]');
    const musicToggle = document.getElementById('music-toggle');
    const breathCounter = document.getElementById('breath-counter');
    let breathingActive = false;
    let breathCount = 0;
    let sessionStartTime = null;
    const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');

    // Function to save breathing session
    async function saveBreathingSession(duration, breathCount) {
        try {
            console.log(`Saving session: ${duration}s, ${breathCount} breaths`);
            const response = await fetch('/api/breathe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    duration: duration,
                    breathCount: breathCount
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('Session saved successfully:', result);
            } else {
                console.error('Failed to save session:', response.statusText);
            }
        } catch (error) {
            console.error('Error saving session:', error);
        }
    }

    breathingButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!breathingActive) {
                breathingActive = true;
                breathCount = 0;
                sessionStartTime = Date.now();
                breathCounter.textContent = `Breaths: ${breathCount}`;
                const time = parseInt(btn.dataset.time) * 60; // Convert minutes to seconds
                
                // Start the breathing animation
                const breathingAnimation = gsap.to(breathingCircle, {
                    scale: 1.5,
                    duration: 4,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    onRepeat: () => {
                        breathCount++;
                        breathCounter.textContent = `Breaths: ${breathCount}`;
                    }
                });
                
                // Set a timer to stop the session after the specified time
                setTimeout(() => {
                    breathingActive = false;
                    
                    // Stop the animation
                    breathingAnimation.kill();
                    gsap.to(breathingCircle, { scale: 1, duration: 1 });
                    
                    // Calculate actual duration and save session
                    const actualDuration = Math.round((Date.now() - sessionStartTime) / 1000);
                    console.log(`Session completed: ${actualDuration}s, ${breathCount} breaths`);
                    saveBreathingSession(actualDuration, breathCount);
                }, time * 1000); // Convert seconds to milliseconds
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