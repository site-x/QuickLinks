document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobilePointer = window.matchMedia('(pointer: coarse)').matches;
    const bgMusic = document.getElementById('bg-music');
    const hoverSound = new Audio('hover.mp3');
    const clickSound = new Audio('onclick.mp3');
    const volumeControl = document.getElementById('volume-control');
    const musicToggle = document.getElementById('music-toggle');
    const volumeSlider = document.getElementById('volume-slider');
    const volPercentage = document.getElementById('vol-percentage');
    const volIcon = document.getElementById('vol-icon');
    const backToTop = document.getElementById('back-to-top');
    const btns = document.querySelectorAll('.universal-btn, .social-chip');
    const stream = document.querySelector('.binary-stream');
    let audioContext = null;

    const storedVolume = Number(localStorage.getItem('quicklinks_music_volume'));
    const targetVolume = Number.isFinite(storedVolume) && storedVolume > 0 ? storedVolume : 0.15;
    let musicEnabled = true;

    hoverSound.volume = isMobilePointer ? 0.08 : 0.16;
    hoverSound.preload = 'auto';
    hoverSound.load();
    clickSound.volume = isMobilePointer ? 0.12 : 0.2;
    clickSound.preload = 'auto';
    clickSound.load();
    document.body.classList.add('is-loading');

    window.quicklinkAudio = {
        playClick(type = 'link') {
            clickSound.currentTime = 0;
            clickSound.play().catch(() => {
                playUiTone(type === 'carousel' ? 560 : 760, type === 'carousel' ? 0.055 : 0.045);
            });
        }
    };

    initMusic();
    warmAudioEngine();
    initImages();
    initButtons();
    initBackToTop();

    if (!prefersReducedMotion) {
        document.addEventListener('pointermove', (event) => {
            document.body.style.setProperty('--cursor-x', `${event.clientX}px`);
            document.body.style.setProperty('--cursor-y', `${event.clientY}px`);
        }, { passive: true });

        setInterval(spawnBinary, 330);
    }

    function initMusic() {
        if (!bgMusic || !volumeSlider || !musicToggle) return;

        volumeSlider.value = String(targetVolume);
        bgMusic.volume = targetVolume;
        bgMusic.muted = false;
        bgMusic.load();
        updateMusicUi();

        bgMusic.play()
            .then(() => updateMusicUi(targetVolume))
            .catch(() => updateMusicUi(targetVolume));

        musicToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleMusic();
        });

        volumeSlider.addEventListener('input', (event) => {
            const nextVolume = Number(event.target.value);
            localStorage.setItem('quicklinks_music_volume', String(nextVolume));
            if (bgMusic.paused && nextVolume > 0) {
                musicEnabled = true;
                bgMusic.play().catch(() => {});
            }
            bgMusic.volume = nextVolume;
            updateMusicUi(nextVolume);
        });
    }

    function toggleMusic() {
        if (!bgMusic || !volumeSlider) return;
        const nextVolume = Number(volumeSlider.value) || 0.15;

        if (musicEnabled && !bgMusic.paused) {
            musicEnabled = false;
            localStorage.setItem('quicklinks_music_enabled', 'false');
            bgMusic.pause();
            updateMusicUi(0);
            return;
        }

        musicEnabled = true;
        localStorage.setItem('quicklinks_music_enabled', 'true');
        bgMusic.volume = nextVolume;
        bgMusic.play().then(() => updateMusicUi(nextVolume)).catch(() => {});
        updateMusicUi(nextVolume);
    }

    function updateMusicUi(overrideVolume) {
        if (!volIcon || !volPercentage || !volumeSlider) return;
        const volume = overrideVolume ?? Number(volumeSlider.value);
        volPercentage.innerText = `${Math.round(volume * 100)}%`;
        document.body.classList.toggle('music-playing', musicEnabled && volume > 0 && !bgMusic?.paused);

        if (!musicEnabled || volume === 0 || bgMusic?.paused) {
            volIcon.className = 'fa-solid fa-play';
            musicToggle?.setAttribute('aria-label', 'Play music');
        } else {
            volIcon.className = 'fa-solid fa-pause';
            musicToggle?.setAttribute('aria-label', 'Pause music');
        }
    }

    function initImages() {
        const images = document.querySelectorAll('.slide img');
        let loaded = 0;

        images.forEach((image) => {
            const markLoaded = () => {
                image.classList.add('is-loaded');
                loaded += 1;
                if (loaded >= 1) {
                    document.body.classList.remove('is-loading');
                }
            };

            if (image.complete) markLoaded();
            else {
                image.addEventListener('load', markLoaded, { once: true });
                image.addEventListener('error', markLoaded, { once: true });
            }
        });
    }

    function initButtons() {
        btns.forEach((btn) => {
            btn.addEventListener('mouseenter', () => {
                if (!window.matchMedia('(hover: hover)').matches) return;
                hoverSound.currentTime = 0;
                hoverSound.play().catch(() => {});
            });

            btn.addEventListener('mousemove', (event) => {
                if (prefersReducedMotion || isMobilePointer) return;

                const rect = btn.getBoundingClientRect();
                const x = event.clientX - rect.left - rect.width / 2;
                const y = event.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.055}px, ${y * 0.08}px) scale(1.015)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });

            btn.addEventListener('click', (event) => {
                window.quicklinkAudio.playClick('link');
                if (!prefersReducedMotion) spawnClickSparks(event.clientX, event.clientY);
            });
        });
    }

    function initBackToTop() {
        if (!backToTop) return;

        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('is-visible', window.scrollY > 420);
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.quicklinkAudio.playClick('carousel');
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });
    }

    function warmAudioEngine() {
        try {
            audioContext ??= new (window.AudioContext || window.webkitAudioContext)();
            playUiTone(440, 0.018, 0.0001);
        } catch {
            // AudioContext can be unavailable in strict browser modes.
        }
    }

    function playUiTone(frequency, duration, volume = 0.075) {
        try {
            audioContext ??= new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();

            oscillator.type = 'triangle';
            oscillator.frequency.value = frequency;
            gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(volume, audioContext.currentTime + 0.008);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
            oscillator.connect(gain);
            gain.connect(audioContext.destination);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + duration + 0.02);
        } catch {
            // AudioContext can be unavailable in strict browser modes.
        }
    }

    function spawnBinary() {
        if (!stream) return;

        const unit = document.createElement('span');
        const glyphs = ['01', '10', '2099', '42', 'zap', 'web'];
        const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];

        unit.className = 'binary-unit';
        unit.innerText = glyph === 'zap' ? 'ZAP' : glyph;
        unit.style.left = `${Math.random() * 100}vw`;
        unit.style.setProperty('--drift-x', `${Math.random() * 90 - 45}px`);
        unit.style.setProperty('--spin', `${Math.random() * 28 - 14}deg`);
        unit.style.fontSize = `${Math.random() * 10 + 10}px`;
        unit.style.animationDuration = `${Math.random() * 5 + 7}s`;
        unit.style.animationDelay = `${Math.random() * 0.8}s`;

        if (glyph === 'web') {
            unit.innerText = '///';
            unit.style.color = 'rgba(255,255,255,0.72)';
        }

        stream.appendChild(unit);
        setTimeout(() => unit.remove(), 14000);
    }

    function spawnClickSparks(x, y) {
        for (let i = 0; i < 7; i++) {
            const spark = document.createElement('span');
            spark.className = 'electric-spark';
            spark.style.left = `${x}px`;
            spark.style.top = `${y}px`;
            spark.style.setProperty('--spark-x', `${Math.random() * 80 - 40}px`);
            spark.style.setProperty('--spark-y', `${Math.random() * 80 - 40}px`);
            document.body.appendChild(spark);
            setTimeout(() => spark.remove(), 760);
        }
    }
});
