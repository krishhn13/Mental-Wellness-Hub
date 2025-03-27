// DOM Elements
const moodButtons = document.querySelectorAll('.mood-btn');
const activityInput = document.getElementById('activity');
const saveBtn = document.getElementById('saveBtn');
const moodDate = document.getElementById('mood-date');
const logContainer = document.getElementById('logContainer');
const ctx = document.getElementById('moodChart').getContext('2d');

// Get Mood Data from Local Storage
let moodData = JSON.parse(localStorage.getItem('moodData')) || [];

// Save Mood
saveBtn.addEventListener('click', () => {
    const selectedMood = document.querySelector('.mood-btn.selected');
    if (!selectedMood) {
        alert('⚠️ Please select a mood!');
        return;
    }
    const mood = selectedMood.dataset.mood;
    const activity = activityInput.value.trim();
    const date = moodDate.value || new Date().toISOString().split('T')[0];

    moodData.push({ date, mood, activity });
    localStorage.setItem('moodData', JSON.stringify(moodData));

    alert('✅ Mood logged successfully!');
    resetForm();
    renderLogs();
    updateChart();
});

// Handle Mood Button Click
moodButtons.forEach(btn => {
    btn.addEventListener('click', (event) => {
        moodButtons.forEach(b => b.classList.remove('selected'));
        event.target.classList.add('selected');
    });
});

// Render Logs
function renderLogs() {
    logContainer.innerHTML = '';
    const logs = moodData.filter(log => log.date === moodDate.value);
    if (logs.length === 0) {
        logContainer.innerHTML = '<p>No logs for this date! 📅</p>';
    } else {
        logs.forEach(log => {
            logContainer.innerHTML += `
                <div class="log">
                    <strong>${log.mood}</strong> - ${log.activity || 'No activity recorded'}
                </div>
            `;
        });
    }
}

// Update Chart
function updateChart() {
    const moodCount = moodData.reduce((acc, log) => {
        acc[log.mood] = (acc[log.mood] || 0) + 1;
        return acc;
    }, {});

    const chartData = {
        labels: Object.keys(moodCount),
        datasets: [{
            data: Object.values(moodCount),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF9F40', '#9966FF'],
            hoverOffset: 8,
        }]
    };

    if (window.moodChart instanceof Chart) {
        window.moodChart.destroy();
    }

    window.moodChart = new Chart(ctx, {
        type: 'doughnut',
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' },
            },
        }
    });
}

// Reset Form After Saving
function resetForm() {
    moodButtons.forEach(b => b.classList.remove('selected'));
    activityInput.value = '';
}

// Initial Render
moodDate.value = new Date().toISOString().split('T')[0];
renderLogs();
updateChart();