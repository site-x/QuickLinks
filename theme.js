(function () {
    const THEMES = [
        { id: 'default', name: 'Default', colors: ['#3b82f6', '#93c5fd', '#0a0f1c'], pill: 'Quick Links', tag: 'ALL SYSTEMS ACTIVE', meta: '#04060c', music: 'bgmusic.mp3', pic: null, fx: 'none', fxMs: 0, bg: {"mode": "constellation", "glyphs": []}, bio: "Multimedia creator, marketer and web developer building brands, content and websites.", icons: { web: 'fa-code', portfolio: 'fa-bolt', mail: 'fa-envelope', ext: 'fa-arrow-up-right-from-square', send: 'fa-paper-plane', prev: 'fa-chevron-left', next: 'fa-chevron-right', theme: 'fa-palette', top: 'fa-chevron-up', play: 'fa-play', pause: 'fa-pause', close: 'fa-xmark' } },
        { id: 'spiderman', name: 'Spider-Man', colors: ['#ff1e2d', '#2a4bd7', '#ffffff'], pill: 'Spider-Verse Link Hub', tag: 'SPIDER-SENSE TINGLING', meta: '#06060a', music: 'bgmusic.mp3', pic: 'images/profile/web/spiderman.jpg', fx: 'glitch', fxMs: 2600, bg: {"mode": "web", "glyphs": ["2099", "ZAP", "///", "42", "THWIP", "01"]}, bio: "Anyone can wear the mask. Mine builds brands, content and websites.", icons: { web: 'fa-spider', portfolio: 'fa-bolt', mail: 'fa-envelope', ext: 'fa-arrow-up-right-from-square', send: 'fa-paper-plane', prev: 'fa-chevron-left', next: 'fa-chevron-right', theme: 'fa-palette', top: 'fa-chevron-up', play: 'fa-play', pause: 'fa-pause', close: 'fa-xmark' } },
        { id: 'batman', name: 'Batman', colors: ['#ffc400', '#6b7684', '#0b0c10'], pill: 'Gotham Link Hub', tag: 'I AM THE LINK', meta: '#030304', music: 'music/batman.wav', pic: 'images/profile/web/batman.jpg', fx: 'flash', fxMs: 2600, bg: {"mode": "bats", "glyphs": []}, bio: "I'm the signal in the dark, building brands, content and websites that get noticed.", icons: { web: 'fa-user-secret', portfolio: 'fa-mask', mail: 'fa-envelope-open', ext: 'fa-shield-halved', send: 'fa-satellite-dish', prev: 'fa-angle-left', next: 'fa-angle-right', theme: 'fa-moon', top: 'fa-angle-up', play: 'fa-play', pause: 'fa-pause', close: 'fa-xmark' } },
        { id: 'ironman', name: 'Iron Man', colors: ['#e11d2e', '#ffc94a', '#6fe3ff'], pill: 'Stark Link Hub', tag: 'JARVIS ONLINE', meta: '#060203', music: 'music/ironman.wav', pic: 'images/profile/web/ironman.jpg', fx: 'repulsor', fxMs: 2600, bg: {"mode": "circuit", "glyphs": ["MK-42", "ARC", "100%", "0xFF", "JARVIS", "Δ", "◎", "AI"]}, bio: "Creator, marketer, web developer. I build the brand, then ship the upgrade.", icons: { web: 'fa-robot', portfolio: 'fa-atom', mail: 'fa-satellite-dish', ext: 'fa-crosshairs', send: 'fa-rocket', prev: 'fa-angles-left', next: 'fa-angles-right', theme: 'fa-gear', top: 'fa-jet-fighter-up', play: 'fa-play', pause: 'fa-pause', close: 'fa-xmark' } },
        { id: 'cartoon', name: 'Cartoon', colors: ['#ff4d6d', '#ffe14d', '#4dd2ff'], pill: 'Toon Town Link Hub', tag: "THAT'S ALL FOLKS", meta: '#2a1a6e', music: 'music/cartoon.wav', pic: 'images/profile/web/cartoon.jpg', fx: 'swipe', fxMs: 2600, bg: {"mode": "confetti", "glyphs": ["POW!", "BAM!", "ZAP!", "WOW!", "★", "♥", "?!"], "colors": ["#ffe14d", "#ff4d6d", "#4dd2ff", "#ffffff"]}, bio: "Part artist, part marketer, part code wizard, turning wild ideas into websites and brands!", icons: { web: 'fa-wand-magic-sparkles', portfolio: 'fa-star', mail: 'fa-envelope-circle-check', ext: 'fa-heart', send: 'fa-face-laugh-beam', prev: 'fa-hand-point-left', next: 'fa-hand-point-right', theme: 'fa-masks-theater', top: 'fa-hand-point-up', play: 'fa-play', pause: 'fa-pause', close: 'fa-xmark' } },
        { id: 'cyberpunk', name: 'Cyberpunk', colors: ['#ff2a6d', '#fcee09', '#05d9e8'], pill: 'Night City Link Hub', tag: 'WAKE UP, SAMURAI', meta: '#08011a', music: 'music/cyberpunk.wav', pic: 'images/profile/web/cyberpunk.jpg', fx: 'scan', fxMs: 2600, bg: {"mode": "streaks", "glyphs": ["2077", "NET", "0x7F", "404", "///", "ERR", "サイバー"]}, bio: "Multimedia meets marketing meets code. Brands and websites built for the city that never sleeps.", icons: { web: 'fa-microchip', portfolio: 'fa-skull', mail: 'fa-at', ext: 'fa-bolt', send: 'fa-bolt-lightning', prev: 'fa-angles-left', next: 'fa-angles-right', theme: 'fa-cube', top: 'fa-angles-up', play: 'fa-play', pause: 'fa-pause', close: 'fa-xmark' } },
        { id: 'vaporwave', name: 'Vaporwave', colors: ['#ff71ce', '#b967ff', '#01cdfe'], pill: 'Vapor Link Hub', tag: 'A E S T H E T I C', meta: '#1a0b2e', music: 'music/vaporwave.wav', pic: 'images/profile/web/vaporwave.jpg', fx: 'dream', fxMs: 2600, bg: {"mode": "bubbles", "glyphs": ["ＡＥＳＴＨＥＴＩＣ", "♡", "✦", "夢", "◇", "▽", "ヴェイパー"]}, bio: "Aesthetic by design. Multimedia, marketing and web development in one smooth vibe.", icons: { web: 'fa-compact-disc', portfolio: 'fa-gem', mail: 'fa-envelope-open-text', ext: 'fa-sun', send: 'fa-heart', prev: 'fa-circle-chevron-left', next: 'fa-circle-chevron-right', theme: 'fa-ice-cream', top: 'fa-circle-chevron-up', play: 'fa-play', pause: 'fa-pause', close: 'fa-circle-xmark' } },
        { id: 'terminal', name: 'Matrix Terminal', colors: ['#00ff6a', '#00cc88', '#01120a'], pill: 'root@quicklinks', tag: 'FOLLOW THE WHITE RABBIT', meta: '#000a03', music: 'music/terminal.wav', pic: 'images/profile/web/matrix.jpg', fx: 'rain', fxMs: 2600, bg: {"mode": "matrix", "glyphs": []}, bio: "whoami: multimedia creator, marketer and web developer", icons: { web: 'fa-terminal', portfolio: 'fa-code', mail: 'fa-at', ext: 'fa-square-arrow-up-right', send: 'fa-greater-than', prev: 'fa-caret-left', next: 'fa-caret-right', theme: 'fa-sliders', top: 'fa-caret-up', play: 'fa-play', pause: 'fa-pause', close: 'fa-xmark' } },
        { id: 'aurora', name: 'Aurora', colors: ['#00e6a8', '#7cf0ff', '#9b7bff'], pill: 'Northern Link Hub', tag: 'ALL LIGHTS GREEN', meta: '#02101a', music: 'music/aurora.wav', pic: 'images/profile/web/aurora.jpg', fx: 'shimmer', fxMs: 2600, bg: {"mode": "stars", "glyphs": ["✦", "✧", "·"]}, bio: "Creating light in the dark with multimedia, marketing and web experiences that glow.", icons: { web: 'fa-wind', portfolio: 'fa-star', mail: 'fa-cloud', ext: 'fa-feather', send: 'fa-dove', prev: 'fa-chevron-left', next: 'fa-chevron-right', theme: 'fa-snowflake', top: 'fa-chevron-up', play: 'fa-play', pause: 'fa-pause', close: 'fa-xmark' } }
    ];
    const KEY = 'quicklinks_theme';
    const root = document.documentElement;
    const modal = document.getElementById('theme-modal');
    const toggle = document.getElementById('theme-toggle');
    const menu = document.getElementById('theme-menu');
    const pill = document.querySelector('.signal-pill');
    const tag = document.querySelectorAll('footer .timestamp')[1];
    const metaColor = document.querySelector('meta[name="theme-color"]');
    if (!modal || !toggle || !menu) return;

    const DEFAULT_PIC = 'images/profile/web/default.jpg';
    const picEl = document.querySelector('.profile-img');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const PULSE_EVERY = 5000;
    const FIRST_PULSE = 1200;
    const fxEl = document.querySelector('.profile-img-fx');
    let pulseTimer = null;
    let pulseOff = null;
    let pulseFirst = null;
    THEMES.forEach((th) => { if (th.pic) { const im = new Image(); im.src = th.pic; } });
    { const im = new Image(); im.src = DEFAULT_PIC; }

    // Default outfit normally; every 5s the theme's outfit pulses in over it with a theme-specific effect.
    function setPicture(theme, immediate) {
        if (!picEl || !fxEl) return;
        clearInterval(pulseTimer);
        clearTimeout(pulseOff);
        clearTimeout(pulseFirst);
        fxEl.className = 'profile-img-fx';
        picEl.src = DEFAULT_PIC;
        if (!theme.pic) return;
        fxEl.src = theme.pic;
        const pulse = () => {
            fxEl.className = 'profile-img-fx';
            void fxEl.offsetWidth;
            fxEl.classList.add('fx-' + theme.fx);
            fxEl.style.animationDuration = theme.fxMs + 'ms';
            pulseOff = setTimeout(() => { fxEl.className = 'profile-img-fx'; }, theme.fxMs + 40);
        };
        pulseFirst = setTimeout(() => { pulse(); pulseTimer = setInterval(pulse, PULSE_EVERY); }, immediate ? 0 : FIRST_PULSE);
    }

    // ---------- Full-screen splash when the theme changes ----------
    const splashEl = document.createElement('div');
    splashEl.className = 'theme-splash';
    splashEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(splashEl);
    let splashTimer = null;

    function webSvg() {
        const cx = 100, cy = 100, spokes = 14;
        let d = '';
        for (let i = 0; i < spokes; i++) {
            const a = (i / spokes) * Math.PI * 2;
            d += 'M100 100L' + (cx + Math.cos(a) * 150).toFixed(1) + ' ' + (cy + Math.sin(a) * 150).toFixed(1);
        }
        for (const r of [14, 28, 45, 64, 86, 112]) {
            for (let i = 0; i < spokes; i++) {
                const a0 = (i / spokes) * Math.PI * 2, a1 = ((i + 1) / spokes) * Math.PI * 2, am = (a0 + a1) / 2;
                const p = (a, rr) => (cx + Math.cos(a) * rr).toFixed(1) + ' ' + (cy + Math.sin(a) * rr).toFixed(1);
                d += 'M' + p(a0, r) + 'Q' + p(am, r * 0.84) + ' ' + p(a1, r);
            }
        }
        return '<svg class="sp-web" viewBox="0 0 200 200"><path d="' + d + '" pathLength="1"/></svg>';
    }

    function rainHtml() {
        const glyphs = '01\u30A2\u30A4\u30A6\u30A8\u30AA\u30AB\u30AD\u30AF\u30B1\u30B3\u30B5\u30B7\u30B9\u30BB\u30BD0101';
        let out = '';
        for (let i = 0; i < 30; i++) {
            let s = '';
            for (let k = 0; k < 18; k++) s += glyphs[Math.floor(Math.random() * glyphs.length)] + '<br>';
            out += '<span class="sp-col" style="left:' + (i * 3.4).toFixed(1) + '%;animation-delay:' + (Math.random() * 0.25).toFixed(2) + 's;font-size:' + (14 + Math.random() * 8).toFixed(0) + 'px">' + s + '</span>';
        }
        return out;
    }

    const SPLASH = {
        spiderman: () => webSvg(),
        batman: () => '<div class="sp-beam"></div><svg class="sp-bat" viewBox="0 0 100 50"><path d="M50 4 L56 14 Q62 10 70 12 Q82 6 98 20 Q86 20 82 28 Q80 24 74 26 Q68 28 66 36 Q60 30 56 34 L50 46 L44 34 Q40 30 34 36 Q32 28 26 26 Q20 24 18 28 Q14 20 2 20 Q18 6 30 12 Q38 10 44 14 Z"/></svg>',
        ironman: () => '<svg class="sp-hud" viewBox="0 0 200 200"><circle class="r1" cx="100" cy="100" r="90"/><circle class="r2" cx="100" cy="100" r="68"/><circle class="r3" cx="100" cy="100" r="46"/><polygon class="core" points="100,78 119,111 81,111"/></svg><div class="sp-hud-text">J.A.R.V.I.S. ONLINE</div>',
        cartoon: () => '<svg class="sp-burst" viewBox="0 0 200 200"><polygon points="100,6 118,48 160,22 152,70 196,72 162,102 194,138 148,134 150,184 112,156 92,196 78,152 34,176 48,130 6,120 42,98 14,60 62,70 60,24 92,52"/><text x="100" y="118" text-anchor="middle">POW!</text></svg>',
        cyberpunk: () => Array.from({ length: 7 }, (_, i) => '<span class="sp-bar b' + (i % 3) + '" style="top:' + (6 + i * 13 + Math.random() * 5).toFixed(0) + '%;animation-delay:' + (i * 0.05).toFixed(2) + 's"></span>').join(''),
        vaporwave: () => '<div class="sp-grid"></div><div class="sp-sun"></div>',
        terminal: () => rainHtml(),
        aurora: () => '<span class="sp-ribbon r1"></span><span class="sp-ribbon r2"></span><span class="sp-ribbon r3"></span>'
    };

    // Pin the splash to what the visitor actually sees (visual viewport), so it stays screen-centred on mobile
    // even when the page is scrolled, zoomed or the browser toolbar is showing.
    function fitSplash() {
        const vv = window.visualViewport;
        const s = splashEl.style;
        if (vv) {
            s.inset = 'auto';
            s.left = vv.offsetLeft + 'px';
            s.top = vv.offsetTop + 'px';
            s.width = vv.width + 'px';
            s.height = vv.height + 'px';
        } else {
            s.inset = '0';
            s.width = s.height = s.left = s.top = '';
        }
    }

    function playSplash(id) {
        clearTimeout(splashTimer);
        splashEl.className = 'theme-splash';
        splashEl.innerHTML = '';
        if (reduceMotion || !SPLASH[id]) return;
        splashEl.innerHTML = SPLASH[id]();
        fitSplash();
        void splashEl.offsetWidth;
        splashEl.className = 'theme-splash show splash-' + id;
        splashTimer = setTimeout(() => { splashEl.className = 'theme-splash'; splashEl.innerHTML = ''; }, 1000);
    }

    // The default theme pulses the theme controls until the visitor switches theme during this visit.
    function dismissHint() {
        root.classList.add('theme-hint-done');
    }

    function currentId() {
        const id = root.dataset.theme;
        return THEMES.some((t) => t.id === id) ? id : 'default';
    }

    function apply(id, persist, splash = true) {
        if (persist) {
            dismissHint();
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        }
        const theme = THEMES.find((t) => t.id === id) || THEMES[0];
        root.dataset.theme = theme.id;
        if (persist) { try { localStorage.setItem(KEY, theme.id); } catch {} }
        if (pill) { const dot = pill.querySelector('.pulse-dot'); pill.textContent = ' ' + theme.pill; if (dot) pill.prepend(dot); }
        if (tag) tag.textContent = 'EST. 2026 // ' + theme.tag;
        if (metaColor) metaColor.setAttribute('content', theme.meta);
        window.quicklinkIcons = theme.icons;
        window.quicklinkMusic = theme.music;
        window.quicklinkBg = theme.bg;
        setPicture(theme, splash);
        if (splash) playSplash(theme.id);
        const bioEl = document.getElementById('profile-bio');
        if (bioEl) bioEl.textContent = theme.bio;
        document.querySelectorAll('i[data-icon]').forEach((el) => {
            const name = theme.icons[el.dataset.icon];
            if (!name) return;
            Array.from(el.classList).filter((c) => c.startsWith('fa-') && c !== 'fa-solid' && c !== 'fa-brands').forEach((c) => el.classList.remove(c));
            el.classList.add(name);
        });
        menu.querySelectorAll('.theme-option').forEach((btn) => btn.setAttribute('aria-checked', String(btn.dataset.id === theme.id)));
        window.dispatchEvent(new Event('themechange'));
    }

    THEMES.forEach((theme) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'theme-option';
        btn.dataset.id = theme.id;
        btn.setAttribute('role', 'radio');
        btn.innerHTML = '<span class="theme-swatch">' + theme.colors.map((c) => '<i style="background:' + c + '"></i>').join('') + '</span><span>' + theme.name + '</span>';
        btn.addEventListener('click', () => {
            apply(theme.id, true);
            window.quicklinkAudio?.playClick('carousel');
            setOpen(false);
        });
        menu.appendChild(btn);
    });

    function setOpen(open) {
        modal.hidden = !open;
        document.body.style.overflow = open ? 'hidden' : '';
        if (open) (menu.querySelector('[aria-checked="true"]') || menu.firstElementChild)?.focus();
        else toggle.focus();
    }

    toggle.addEventListener('click', () => { window.quicklinkAudio?.playClick('carousel'); setOpen(true); });
    modal.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) setOpen(false); });

    function step(dir) {
        const i = THEMES.findIndex((th) => th.id === currentId());
        apply(THEMES[(i + dir + THEMES.length) % THEMES.length].id, true);
        window.quicklinkAudio?.playClick('carousel');
    }
    document.getElementById('theme-prev')?.addEventListener('click', () => step(-1));
    document.getElementById('theme-next')?.addEventListener('click', () => step(1));

    apply(currentId(), false, false);
})();
