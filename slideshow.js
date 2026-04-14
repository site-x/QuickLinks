/**
 * Elijah's Portfolio Slideshow Logic
 * Handles manual navigation and auto-play for project showcases.
 */

(function() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    
    // DEBUG: Check if buttons are found
    console.log("Prev Button Found:", prevBtn);
    console.log("Next Button Found:", nextBtn);

    if (!prevBtn || !nextBtn) {
        console.error("Slideshow buttons missing from DOM!");
        return;
    }

    let currentSlide = 0;
    let isTransitioning = false;

    // Use a shared sound effect if available, or create a local one
    const switchSound = new Audio('hover.mp3');
    switchSound.volume = 0.5;

    function showSlide(index) {
        if (isTransitioning) return;
        isTransitioning = true;

        // Play feedback sound
        switchSound.currentTime = 0;
        switchSound.play().catch(() => {});

        // Remove active classes
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');

        // Calculate new index
        currentSlide = (index + slides.length) % slides.length;

        // Add active classes to new slide
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');

        // Reset transition lock after CSS animation finishes (600ms in style.css)
        setTimeout(() => {
            isTransitioning = false;
        }, 600);
    }

    // Event Listeners
    nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
    prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));

    // Support clicking on dots directly
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            if (idx !== currentSlide) showSlide(idx);
        });
    });

    // Keyboard navigation (Left/Right Arrows)
    document.addEventListener('keydown', (e) => {
        if (e.key === "ArrowLeft") showSlide(currentSlide - 1);
        if (e.key === "ArrowRight") showSlide(currentSlide + 1);
    });

    // Auto-advance every 8 seconds
    let autoPlay = setInterval(() => showSlide(currentSlide + 1), 8000);

    // Pause auto-play when user interacts
    const resetTimer = () => {
        clearInterval(autoPlay);
        autoPlay = setInterval(() => showSlide(currentSlide + 1), 8000);
    };

    nextBtn.addEventListener('click', resetTimer);
    prevBtn.addEventListener('click', resetTimer);
    dots.forEach(dot => dot.addEventListener('click', resetTimer));

})();