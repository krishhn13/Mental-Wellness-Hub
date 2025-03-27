document.addEventListener('DOMContentLoaded', () => {
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

    const affirmations = [
        "Tu ekdum rockstar hai, bhai!",
        "Har din naya maza, naya chance!",
        "Tu sabse bada champion hai!"
    ];
    document.getElementById('affirmation-text').textContent = affirmations[Math.floor(Math.random() * affirmations.length)];

    gsap.from('.navbar', { opacity: 0, y: -50, duration: 1 });
    gsap.from('.mood-journal', { opacity: 0, y: 50, duration: 1, delay: 0.2 });
    gsap.from('.affirmation', { opacity: 0, y: 50, duration: 1, delay: 0.4 });
});