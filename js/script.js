document.addEventListener('DOMContentLoaded', () => {
        // Theme Toggle
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            themeToggle.textContent = document.body.classList.contains('dark') ? '🌙' : '☀️';
            playSound('click');
        });
    
        // Back to Top
        document.getElementById('back-to-top').addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            playSound('click');
        });
    
        // Sound Effects
        const sounds = {
            click: new Audio('https://www.soundjay.com/buttons/button-1.mp3'),
            success: new Audio('https://www.soundjay.com/misc/sounds/bell-ring-01.mp3')
        };
        function playSound(type) { sounds[type].play(); }
    
        // Welcome Popup
        if (!localStorage.getItem('welcomeShown')) {
            setTimeout(() => {
                alert('Bhai, welcome to Mental Wellness Hub! Masti shuru kar!');
                localStorage.setItem('welcomeShown', 'true');
            }, 1000);
        }
    
        // Mood Journal
        const emojis = document.querySelectorAll('.emoji');
        const journal = document.getElementById('journal-entry');
        const saveMood = document.getElementById('save-mood');
        const heatmap = document.getElementById('calendar-heatmap');
        let selectedMood = '';
    
        emojis.forEach(emoji => {
            emoji.addEventListener('click', () => {
                emojis.forEach(e => e.style.opacity = '0.5');
                emoji.style.opacity = '1';
                selectedMood = emoji.dataset.mood;
                gsap.to(emoji, { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1 });
                playSound('click');
            });
        });
    
        saveMood.addEventListener('click', () => {
            if (selectedMood && journal.value) {
                const entry = { mood: selectedMood, text: journal.value, date: new Date().toISOString().split('T')[0] };
                let entries = JSON.parse(localStorage.getItem('moodEntries')) || [];
                entries.push(entry);
                localStorage.setItem('moodEntries', JSON.stringify(entries));
                journal.value = '';
                updateHeatmap();
                updateProgressChart();
                updateRecommendations(selectedMood);
                playSound('success');
                alert('Mood saved, bhai! Tu mast hai!');
            }
        });
    
        function updateHeatmap() {
            heatmap.innerHTML = '';
            const entries = JSON.parse(localStorage.getItem('moodEntries')) || [];
            const moodColors = { happy: '#4CAF50', calm: '#2196F3', sad: '#F44336', angry: '#FF9800' };
            for (let i = 0; i < 28; i++) {
                const day = document.createElement('div');
                day.classList.add('heatmap-day');
                const date = new Date();
                date.setDate(date.getDate() - (27 - i));
                const dateStr = date.toISOString().split('T')[0];
                const entry = entries.find(e => e.date === dateStr);
                if (entry) day.style.background = moodColors[entry.mood];
                heatmap.appendChild(day);
            }
        }
        updateHeatmap();
    
        // Breathing Exercise
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
                    playSound('click');
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
            playSound('click');
        });
    
        // Coping Recommendations
        const recSlider = document.getElementById('rec-slider');
        const recommendations = {
            happy: ['Nach le bhai!', 'Dost ke saath selfie le', 'Mithai kha le'],
            calm: ['Chai pi aur relax kar', 'Ek acchi kitab padh', 'Nature mein ghoom'],
            sad: ['Ek comedy movie dekh', 'Kisi se baat kar', 'Thodi si ice cream kha'],
            angry: ['Pillow pe chillao', 'Run pe jaa', 'Deep breaths le']
        };
    
        function updateRecommendations(mood) {
            recSlider.innerHTML = '';
            (recommendations[mood] || recommendations.calm).forEach(text => {
                const item = document.createElement('div');
                item.classList.add('rec-item');
                item.textContent = text;
                gsap.from(item, { opacity: 0, x: 50, duration: 0.5 });
                recSlider.appendChild(item);
            });
        }
        updateRecommendations('calm');
    
        // Stress Test
        const stressForm = document.getElementById('stress-form');
        const nextButton = document.getElementById('next-question');
        const stressResult = document.getElementById('stress-result');
        let currentStep = 1;
        let score = 0;
    
        nextButton.addEventListener('click', () => {
            const currentQ = document.querySelector(`.question[data-step="${currentStep}"]`);
            const selected = currentQ.querySelector('input:checked');
            if (selected) {
                score += parseInt(selected.value);
                if (currentStep === 1) {
                    currentQ.style.display = 'none';
                    document.querySelector(`.question[data-step="2"]`).style.display = 'block';
                    nextButton.textContent = 'Result Dekh!';
                    currentStep++;
                } else {
                    stressForm.style.display = 'none';
                    const level = score <= 4 ? 'Chill Hai Tu' : score <= 8 ? 'Thoda Stress Hai' : 'Bhai Relax Kar!';
                    stressResult.innerHTML = `Tera Stress Level: <strong>${level}</strong> (Score: ${score}/10)`;
                    gsap.from(stressResult, { opacity: 0, y: 20, duration: 1 });
                    playSound('success');
                }
            } else {
                alert('Bhai, kuch toh chun!');
            }
            playSound('click');
        });
    
        // Progress Dashboard
        const ctx = document.getElementById('progress-chart').getContext('2d');
        let chart;
    
        function updateProgressChart() {
            const entries = JSON.parse(localStorage.getItem('moodEntries')) || [];
            const moodCounts = { happy: 0, calm: 0, sad: 0, angry: 0 };
            entries.forEach(e => moodCounts[e.mood]++);
    
            if (chart) chart.destroy();
            chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Happy', 'Calm', 'Sad', 'Angry'],
                    datasets: [{
                        label: 'Mood ka Trend',
                        data: [moodCounts.happy, moodCounts.calm, moodCounts.sad, moodCounts.angry],
                        backgroundColor: ['#4CAF50', '#2196F3', '#F44336', '#FF9800']
                    }]
                },
                options: { scales: { y: { beginAtZero: true } } }
            });
        }
        updateProgressChart();
    
        // Daily Affirmations
        const affirmations = [
            "Tu ekdum rockstar hai, bhai!",
            "Har din naya maza, naya chance!",
            "Tu sabse bada champion hai!"
        ];
        document.getElementById('affirmation-text').textContent = affirmations[Math.floor(Math.random() * affirmations.length)];
    
        // Initial Animations
        gsap.from('.navbar', { opacity: 0, y: -50, duration: 1 });
        gsap.from('.mood-journal', { opacity: 0, y: 50, duration: 1, delay: 0.2 });
        gsap.from('.breathing', { opacity: 0, y: 50, duration: 1, delay: 0.4 });
        gsap.from('.recommendations', { opacity: 0, y: 50, duration: 1, delay: 0.6 });
    });