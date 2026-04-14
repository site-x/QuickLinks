document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. AUDIO ELEMENTS ---
    const bgMusic = document.getElementById('bg-music');
    const hoverSound = new Audio('hover.mp3');
    hoverSound.volume = 0.2; // Locked volume for UI feedback

    const volumeSlider = document.getElementById('volume-slider');
    const volPercentage = document.getElementById('vol-percentage');
    const volIcon = document.getElementById('vol-icon');

    // Function for Music Volume only
    const updateMusicVolume = (val) => {
        if (bgMusic) bgMusic.volume = val;
        volPercentage.innerText = `${Math.round(val * 100)}%`;
        
        // Icon logic
        if (val == 0) volIcon.className = "fa-solid fa-volume-xmark";
        else if (val < 0.5) volIcon.className = "fa-solid fa-volume-low";
        else volIcon.className = "fa-solid fa-volume-high";
    };

    volumeSlider.addEventListener('input', (e) => {
        updateMusicVolume(e.target.value);
    });

    // Interaction Unlock
    document.addEventListener('click', () => {
        if (bgMusic) {
            updateMusicVolume(volumeSlider.value);
            bgMusic.play().catch(() => {});
        }
    }, { once: true });


    // --- 2. MAGNETIC BUTTONS & UI SOUNDS ---
    const btns = document.querySelectorAll('.universal-btn');
    btns.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            if (window.matchMedia("(hover: hover)").matches) {
                hoverSound.currentTime = 0;
                hoverSound.play().catch(() => {}); // Always plays at 0.2 volume
            }
        });

        btn.addEventListener('mousemove', (e) => {
            if (window.matchMedia("(pointer: coarse)").matches) return;
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${(x * 0.12) + 5}px, ${y * 0.12}px) scale(1.02)`;
            btn.style.boxShadow = `0 10px 20px rgba(0, 242, 255, 0.15)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0, 0) scale(1)`;
            btn.style.boxShadow = 'none';
        });
    });


    // --- 3. BINARY DRIFT GENERATOR ---
    const stream = document.querySelector('.binary-stream');
    function spawnBinary() {
        if (!stream) return;
        const unit = document.createElement('span');
        unit.className = 'binary-unit';
        unit.innerText = Math.random() > 0.5 ? '0' : '1';
        unit.style.left = Math.random() * 100 + 'vw';
        unit.style.fontSize = (Math.random() * 8 + 12) + 'px';
        unit.style.animationDuration = (Math.random() * 7 + 8) + 's';
        stream.appendChild(unit);
        setTimeout(() => unit.remove(), 15000);
    }
    setInterval(spawnBinary, 400);
});
