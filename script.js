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
    const DEFAULT_TRACK = 'bgmusic.mp3';
    let currentTrack = DEFAULT_TRACK;
    let fadeTimer = null;
    let volumeGain = null;

    // iOS ignores audio.volume (read-only), so once the Web Audio graph exists the slider drives a GainNode instead.
    function setVolume(v) {
        const level = Math.max(0, Math.min(1, Number(v) || 0));
        if (volumeGain && audioContext) {
            bgMusic.volume = 1;
            volumeGain.gain.setTargetAtTime(level, audioContext.currentTime, 0.02);
        } else {
            bgMusic.volume = level;
        }
    }

    hoverSound.volume = isMobilePointer ? 0.08 : 0.16;
    hoverSound.preload = 'auto';
    hoverSound.load();
    clickSound.volume = isMobilePointer ? 0.12 : 0.2;
    clickSound.preload = 'auto';
    clickSound.load();
    if (document.querySelector('.slide img')) document.body.classList.add('is-loading');

    window.quicklinkAudio = {
        playClick(type = 'link') {
            clickSound.currentTime = 0;
            clickSound.play().catch(() => {
                playUiTone(type === 'carousel' ? 560 : 760, type === 'carousel' ? 0.055 : 0.045);
            });
        }
    };

    // Block save-image routes on pictures: right-click / long-press menu and dragging out
    document.addEventListener('contextmenu', (e) => { if (e.target.closest('img, .profile-frame, .badge-marquee')) e.preventDefault(); });
    document.addEventListener('dragstart', (e) => { if (e.target.closest('img')) e.preventDefault(); });

    initMusic();
    window.addEventListener('themechange', () => updateMusicUi());
    initBeatVisualizer();
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
        setVolume(targetVolume);
        bgMusic.muted = false;
        currentTrack = window.quicklinkMusic || DEFAULT_TRACK;
        if (currentTrack !== DEFAULT_TRACK) bgMusic.src = currentTrack;
        bgMusic.load();
        window.addEventListener('themechange', () => switchTrack(window.quicklinkMusic));
        updateMusicUi();

        bgMusic.play()
            .then(() => updateMusicUi(targetVolume))
            .catch(() => {
                updateMusicUi(targetVolume);
                // Browser blocked autoplay: start on the first interaction, unless the user paused meanwhile.
                const startOnGesture = () => {
                    if (musicEnabled && bgMusic.paused) bgMusic.play().then(() => updateMusicUi()).catch(() => {});
                    ['pointerdown', 'keydown', 'touchstart'].forEach((evt) => document.removeEventListener(evt, startOnGesture));
                };
                ['pointerdown', 'keydown', 'touchstart'].forEach((evt) => document.addEventListener(evt, startOnGesture, { passive: true }));
            });

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
            setVolume(nextVolume);
            updateMusicUi(nextVolume);
        });
    }

    function initBeatVisualizer() {
        const bars = document.querySelectorAll('.music-visualizer span');
        const frame = document.querySelector('.profile-frame');
        if (!bgMusic || !bars.length || prefersReducedMotion) return;

        bars.forEach((bar, i) => bar.style.setProperty('--i', i));
        let analyser = null;
        let data = null;
        const levels = new Array(bars.length).fill(0);
        const avg = new Array(bars.length).fill(0.1);
        const pk = new Array(bars.length).fill(0.3);
        let bassAvg = 0.2;
        let beat = 0;
        let lastBeat = 0;
        let silentFrames = 0;

        function setup() {
            if (analyser) return;
            try {
                audioContext ??= new (window.AudioContext || window.webkitAudioContext)();
                // Routing through a suspended context would silence the music, so wait for a running one.
                if (audioContext.state !== 'running') {
                    audioContext.resume().then(() => { if (audioContext.state === 'running') setup(); }).catch(() => {});
                    return;
                }
                const source = audioContext.createMediaElementSource(bgMusic);
                analyser = audioContext.createAnalyser();
                analyser.fftSize = 2048;
                analyser.smoothingTimeConstant = 0.4;
                // analyser taps the raw signal (so bars ignore the volume slider); the gain node sets loudness
                volumeGain = audioContext.createGain();
                const silent = audioContext.createGain();
                silent.gain.value = 0;
                source.connect(analyser);
                analyser.connect(silent);
                silent.connect(audioContext.destination);
                source.connect(volumeGain);
                volumeGain.connect(audioContext.destination);
                setVolume(Number(volumeSlider?.value) || targetVolume);
                data = new Uint8Array(analyser.frequencyBinCount);
                requestAnimationFrame(tick);
            } catch {
                analyser = null;
            }
        }

        function tick() {
            requestAnimationFrame(tick);
            if (audioContext.state === 'suspended' && !bgMusic.paused) audioContext.resume().catch(() => {});
            analyser.getByteFrequencyData(data);

            // log-spaced bands over ~50Hz-8kHz
            const binHz = audioContext.sampleRate / analyser.fftSize;
            const lo = 50, hi = 8000;
            let frameMax = 0;
            const raw = [];
            for (let i = 0; i < bars.length; i++) {
                const f0 = lo * Math.pow(hi / lo, i / bars.length);
                const f1 = lo * Math.pow(hi / lo, (i + 1) / bars.length);
                const b0 = Math.max(1, Math.floor(f0 / binHz));
                const b1 = Math.max(b0 + 1, Math.ceil(f1 / binHz));
                let sum = 0;
                for (let b = b0; b < b1; b++) sum += data[b];
                const v = sum / (b1 - b0) / 255;
                raw.push(v);
                frameMax = Math.max(frameMax, v);
            }

            // kick / bass onset: bass energy jumping above its recent average
            const bassTop = Math.ceil(150 / binHz);
            let bass = 0;
            for (let b = Math.floor(40 / binHz); b <= bassTop; b++) bass = Math.max(bass, data[b] / 255);
            const now = performance.now();
            if (bass - bassAvg > 0.09 && now - lastBeat > 140) {
                beat = 1;
                lastBeat = now;
            }
            bassAvg += (bass - bassAvg) * 0.06;
            beat *= 0.86;

            // live only once real signal is seen (CORS/file:// gives silence -> CSS fallback)
            if (frameMax > 0.01) {
                silentFrames = 0;
                document.body.classList.add('viz-live');
            } else if (++silentFrames > 90 && !bgMusic.paused) {
                document.body.classList.remove('viz-live');
            }
            if (bgMusic.paused) document.body.classList.remove('viz-live');

            // each band is judged against its own history, so steady/bass-heavy bands don't pin at full
            bars.forEach((bar, i) => {
                avg[i] += (raw[i] - avg[i]) * 0.04;
                pk[i] = Math.max(raw[i], pk[i] * 0.992, avg[i] + 0.08);
                const rel = (raw[i] - avg[i]) / (pk[i] - avg[i] + 0.02);
                const target = Math.max(0.05, Math.min(1, 0.1 + rel * 0.75 + beat * 0.3));
                levels[i] += (target - levels[i]) * (target > levels[i] ? 0.7 : 0.22);
                bar.style.setProperty('--lvl', levels[i].toFixed(3));
            });
            frame?.style.setProperty('--bass', beat.toFixed(3));
        }

        bgMusic.addEventListener('play', setup);
        if (!bgMusic.paused) setup();
        ['pointerdown', 'keydown'].forEach((evt) => {
            document.addEventListener(evt, () => { setup(); audioContext?.resume?.().catch(() => {}); }, { passive: true });
        });
    }

    // Each theme has its own track. A paused player stays paused across theme changes.
    function switchTrack(path) {
        if (!bgMusic || !path || path === currentTrack) return;
        currentTrack = path;
        // The <audio autoplay> attribute would restart playback after load(); only play when the user has music on.
        bgMusic.autoplay = false;
        bgMusic.src = path;
        bgMusic.load();
        if (!musicEnabled) {
            bgMusic.pause();
            updateMusicUi();
            return;
        }
        const goal = () => Number(volumeSlider?.value) || targetVolume;
        clearInterval(fadeTimer);
        setVolume(0);
        bgMusic.play().then(() => {
            let step = 0;
            fadeTimer = setInterval(() => {
                step += 1;
                setVolume(Math.min(goal(), goal() * (step / 12)));
                if (step >= 12) clearInterval(fadeTimer);
            }, 50);
            updateMusicUi();
        }).catch(() => {
            setVolume(goal());
            updateMusicUi();
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
        setVolume(nextVolume);
        bgMusic.play().then(() => updateMusicUi(nextVolume)).catch(() => {});
        updateMusicUi(nextVolume);
    }

    function updateMusicUi(overrideVolume) {
        if (!volIcon || !volPercentage || !volumeSlider) return;
        const volume = overrideVolume ?? Number(volumeSlider.value);
        volPercentage.innerText = `${Math.round(volume * 100)}%`;
        document.body.classList.toggle('music-playing', musicEnabled && volume > 0 && !bgMusic?.paused);

        if (!musicEnabled || volume === 0 || bgMusic?.paused) {
            volIcon.className = `fa-solid ${window.quicklinkIcons?.play ?? 'fa-play'}`;
            musicToggle?.setAttribute('aria-label', 'Play music');
        } else {
            volIcon.className = `fa-solid ${window.quicklinkIcons?.pause ?? 'fa-pause'}`;
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

            btn.addEventListener('click', (event) => {
                window.quicklinkAudio.playClick('link');
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
        const bg = window.quicklinkBg || {};
        const glyphs = bg.glyphs || [];
        if (!glyphs.length) return;

        const unit = document.createElement('span');
        unit.className = 'binary-unit';
        unit.innerText = glyphs[Math.floor(Math.random() * glyphs.length)];
        if (bg.colors) {
            const color = bg.colors[Math.floor(Math.random() * bg.colors.length)];
            unit.style.color = color;
            unit.style.textShadow = `0 0 14px ${color}`;
        }
        unit.style.left = `${Math.random() * 100}vw`;
        unit.style.setProperty('--drift-x', `${Math.random() * 90 - 45}px`);
        unit.style.setProperty('--spin', `${Math.random() * 28 - 14}deg`);
        unit.style.fontSize = `${Math.random() * 10 + 10}px`;
        unit.style.animationDuration = `${Math.random() * 5 + 7}s`;
        unit.style.animationDelay = `${Math.random() * 0.8}s`;

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
