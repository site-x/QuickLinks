(function() {
    const slides = Array.from(document.querySelectorAll('.slide'));
    const dots = Array.from(document.querySelectorAll('.dot'));
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const carousel = document.querySelector('.slideshow-container');

    if (!slides.length || !dots.length || !prevBtn || !nextBtn) return;

    let currentSlide = 0;
    let isTransitioning = false;
    let autoPlay = null;

    function showSlide(index, shouldPlaySound = true) {
        if (isTransitioning || index === currentSlide) return;
        isTransitioning = true;

        if (shouldPlaySound) {
            window.quicklinkAudio?.playClick('carousel');
        }

        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        dots[currentSlide].removeAttribute('aria-current');

        currentSlide = (index + slides.length) % slides.length;

        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        dots[currentSlide].setAttribute('aria-current', 'true');

        setTimeout(() => {
            isTransitioning = false;
        }, 650);
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlay = setInterval(() => showSlide(currentSlide + 1, false), 7000);
    }

    function stopAutoPlay() {
        if (autoPlay) clearInterval(autoPlay);
    }

    function resetTimer() {
        startAutoPlay();
    }

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetTimer();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetTimer();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetTimer();
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            prevSlide();
            resetTimer();
        }

        if (event.key === 'ArrowRight') {
            nextSlide();
            resetTimer();
        }
    });

    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
        carousel.addEventListener('focusin', stopAutoPlay);
        carousel.addEventListener('focusout', startAutoPlay);
    }

    dots[0].setAttribute('aria-current', 'true');
    startAutoPlay();
})();
