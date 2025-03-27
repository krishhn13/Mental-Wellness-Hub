document.addEventListener('DOMContentLoaded', () => {
    const stressForm = document.getElementById('stress-form');
    const nextButton = document.getElementById('next-question');
    const stressResult = document.getElementById('stress-result');
    let currentStep = 1;
    let score = 0;
    const totalSteps = 5;

    nextButton.addEventListener('click', () => {
        const currentQ = document.querySelector(`.question[data-step="${currentStep}"]`);
        const selected = currentQ.querySelector('input:checked');

        if (selected) {
            score += parseInt(selected.value);
            currentQ.style.display = 'none';
            currentStep++;
            
            if (currentStep <= totalSteps) {
                document.querySelector(`.question[data-step="${currentStep}"]`).style.display = 'block';
            } else {
                stressForm.style.display = 'none';
                let level, mood;

                if (score <= 5) {
                    level = 'Chill Hai Tu';
                    mood = 'happy';
                } else if (score <= 10) {
                    level = 'Thoda Stress Hai';
                    mood = 'calm';
                } else if (score <= 15) {
                    level = 'Bhai Relax Kar!';
                    mood = 'sad';
                } else {
                    level = 'Bhai Tu Toh Ekdam Gaya Kaam Se!';
                    mood = 'angry';
                }

                stressResult.innerHTML = `Tera Stress Level: <strong>${level}</strong> (Score: ${score}/25)`;
                gsap.from(stressResult, { opacity: 0, y: 20, duration: 1 });

                updateRecommendations(mood);
            }
        } else {
            alert('Bhai, kuch toh chun!');
        }
    });

    const recSlider = document.getElementById('rec-slider');
    const recommendations = {
        happy: [
            "Naach Meri Jaan 🥰 - Ek dance break le!", 
            "Mausam toh Ekdum Khushnuma hai 🌤️ - Chai bana aur enjoy kar!", 
            "Chal pahado pe ghoom kar aate hai 🏔️", 
            "Apna favorite gana chala aur gaane gaane ka mood bana!", 
            "Aaj kisi ko bina wajah thank you bol de, mast lagega!"
        ],
        calm: [
            "Chai pi aur relax kar ☕", 
            "Ek acchi kitab padh 📖", 
            "Nature mein ghoom 🚶‍♂️ - Garden ya lake ke paas baith!", 
            "Slow music sun aur chill kar 🎶", 
            "Yeh waqt leke thoda meditation try kar!"
        ],
        sad: [
            "Ek comedy movie dekh 🎥 - Hasne ka waqt aa gaya!", 
            "Kisi close dost ya family member se baat kar ☎️", 
            "Thodi si ice cream kha 🍦 - Tera mood fresh ho jayega!", 
            "Ek positive journal likh, jo cheezein achi lagti hain unko note kar 📝", 
            "Apna favorite comfort food order kar 🍕"
        ],
        angry: [
            "Pillow pe chillao 😤 - Frustration nikal de!", 
            "Run pe jaa 🏃‍♂️ - Energy use kar!", 
            "Deep breaths le 🧘‍♂️ - 4-7-8 technique try kar!", 
            "Boxing ya punching bag try kar 🥊", 
            "Ek art ya music activity kar, creative energy nikal!"
        ]
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

    gsap.from('.navbar', { opacity: 0, y: -50, duration: 1 });
    gsap.from('.stress-test', { opacity: 0, y: 50, duration: 1, delay: 0.2 });
    gsap.from('.recommendations', { opacity: 0, y: 50, duration: 1, delay: 0.4 });
});