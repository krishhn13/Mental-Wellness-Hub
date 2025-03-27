document.addEventListener('DOMContentLoaded', () => {
        // Navbar animation
        gsap.from('.navbar', { opacity: 0, y: -50, duration: 1, ease: 'power2.out' });
    
        // Hero section animations
        gsap.from('.hero-content h1', { opacity: 0, y: 30, duration: 1, delay: 0.2, ease: 'power2.out' });
        gsap.from('.hero-content p', { opacity: 0, y: 20, duration: 1, delay: 0.4, ease: 'power2.out' });
        gsap.from('.hero-btn', { opacity: 0, scale: 0.8, duration: 0.8, delay: 0.6, ease: 'back.out(1.7)' });
        gsap.from('.emoji-bounce', { 
            opacity: 0, 
            y: -50, 
            duration: 1, 
            delay: 0.8, 
            stagger: 0.2, 
            ease: 'bounce.out' 
        });
    
        // Highlights section animations
        gsap.from('.highlights h2', { opacity: 0, y: 30, duration: 1, delay: 1, ease: 'power2.out' });
        gsap.from('.highlight-card', { 
            opacity: 0, 
            y: 50, 
            duration: 1, 
            delay: 1.2, 
            stagger: 0.2, 
            ease: 'power2.out' 
        });
    
        // CTA section animations
        gsap.from('.cta h2', { opacity: 0, y: 30, duration: 1, delay: 1.6, ease: 'power2.out' });
        gsap.from('.cta p', { opacity: 0, y: 20, duration: 1, delay: 1.8, ease: 'power2.out' });
        gsap.from('.cta-btn', { opacity: 0, scale: 0.8, duration: 0.8, delay: 2, ease: 'back.out(1.7)' });
    });