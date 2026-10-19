// Theme-aware animated background (canvas). Mode comes from window.quicklinkBg.mode (set by theme.js).
(function () {
    const canvas = document.getElementById('web-canvas');
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight * 0.28, active: false };
    let W = window.innerWidth;
    let H = window.innerHeight;
    let colA = '110, 160, 255';
    let colB = '255, 30, 45';
    let colC = '55, 221, 255';
    let mode = 'web';
    let items = [];
    let t0 = performance.now();

    const BAT = new Path2D('M50 4L56 14Q62 10 70 12Q82 6 98 20Q86 20 82 28Q80 24 74 26Q68 28 66 36Q60 30 56 34L50 46L44 34Q40 30 34 36Q32 28 26 26Q20 24 18 28Q14 20 2 20Q18 6 30 12Q38 10 44 14Z');
    const RAIN = '01アイウエオカキクケコサシスセソツナニヌネ0123456789';
    const rand = (a, b) => a + Math.random() * (b - a);

    function readTheme() {
        const cs = getComputedStyle(document.documentElement);
        colA = cs.getPropertyValue('--electric-rgb').trim() || colA;
        colB = cs.getPropertyValue('--red-rgb').trim() || colB;
        colC = cs.getPropertyValue('--cyan-rgb').trim() || colC;
        mode = (window.quicklinkBg && window.quicklinkBg.mode) || 'web';
        seed();
    }

    function resize() {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W * ratio;
        canvas.height = H * ratio;
        canvas.style.width = `${W}px`;
        canvas.style.height = `${H}px`;
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        seed();
    }

    function seed() {
        items = [];
        const n = Math.min(42, Math.max(22, Math.floor(W / 28)));
        switch (mode) {
            case 'web': case 'constellation': case 'circuit':
                for (let i = 0; i < (mode === 'circuit' ? Math.round(n * 0.7) : n); i++) {
                    items.push({ x: rand(0, W), y: rand(0, H), vx: rand(-0.175, 0.175), vy: rand(-0.175, 0.175), pulse: rand(0, 6.28) });
                }
                break;
            case 'confetti':
                for (let i = 0; i < 46; i++) items.push({ x: rand(0, W), y: rand(-H, H), s: rand(3, 8), vy: rand(0.4, 1.3), vx: rand(-0.3, 0.3), r: rand(0, 6.28), vr: rand(-0.05, 0.05), c: i % 4, kind: i % 3 });
                break;
            case 'streaks':
                for (let i = 0; i < 38; i++) items.push({ x: rand(0, W), y: rand(-H, H), len: rand(40, 140), v: rand(4, 10), c: i % 3, a: rand(0.25, 0.6) });
                break;
            case 'bubbles':
                for (let i = 0; i < 24; i++) items.push({ x: rand(0, W), y: rand(0, H), r: rand(8, 42), vy: rand(0.2, 0.7), sway: rand(0, 6.28), c: i % 3 });
                break;
            case 'matrix': {
                const colW = 16;
                const cols = Math.ceil(W / colW);
                const rows = Math.ceil(H / colW) + 2;
                for (let i = 0; i < cols; i++) {
                    items.push({
                        x: i * colW, head: rand(-rows, rows), speed: rand(0.15, 0.5), len: Math.floor(rand(8, 24)),
                        chars: Array.from({ length: rows }, () => RAIN[Math.floor(Math.random() * RAIN.length)]), rows
                    });
                }
                break;
            }
            case 'stars':
                for (let i = 0; i < 80; i++) items.push({ x: rand(0, W), y: rand(0, H), r: rand(0.6, 2), ph: rand(0, 6.28), sp: rand(0.01, 0.04) });
                items.shooting = null;
                break;
            case 'bats':
                for (let i = 0; i < 9; i++) items.push({ x: rand(0, W), y: rand(0, H * 0.8), s: rand(0.18, 0.5), vx: rand(0.4, 1.3) * (Math.random() < 0.5 ? -1 : 1), ph: rand(0, 6.28), bob: rand(0, 6.28), a: rand(0.18, 0.4) });
                break;
            default: break;
        }
    }

    // ---- shared helpers ----
    function drift(list) {
        list.forEach((n) => {
            n.x += n.vx; n.y += n.vy; n.pulse += 0.026;
            if (n.x < -20) n.x = W + 20;
            if (n.x > W + 20) n.x = -20;
            if (n.y < -20) n.y = H + 20;
            if (n.y > H + 20) n.y = -20;
        });
    }

    function curve(a, b, distance, range, color) {
        const alpha = Math.max(0, 1 - distance / range);
        if (alpha <= 0) return;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        const midX = (a.x + b.x) / 2 + Math.sin((a.pulse || 0) + distance) * 6;
        const midY = (a.y + b.y) / 2 + Math.cos((b.pulse || 0) + distance) * 6;
        ctx.quadraticCurveTo(midX, midY, b.x, b.y);
        ctx.strokeStyle = color(alpha);
        ctx.lineWidth = 0.7 + alpha * 0.9;
        ctx.stroke();
    }

    // ---- modes ----
    function drawWeb() {
        drift(items);
        const floating = Array.from(document.querySelectorAll('.binary-unit')).slice(-26).map((unit) => {
            const rect = unit.getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, pulse: performance.now() * 0.002 };
        });
        const pts = pointer.active ? items.concat(floating, pointer) : items.concat(floating);
        for (let i = 0; i < pts.length; i++) {
            const a = pts[i];
            ctx.beginPath();
            ctx.arc(a.x, a.y, 1.3 + Math.sin(a.pulse || 0) * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${colA}, 0.42)`;
            ctx.fill();
            for (let j = i + 1; j < pts.length; j++) {
                const b = pts[j];
                const d = Math.hypot(a.x - b.x, a.y - b.y);
                if (d < 154) curve(a, b, d, 154, (al) => `rgba(${colA}, ${al * 0.38})`);
                else if (d < 210 && (i + j) % 7 === 0) curve(a, b, d, 210, (al) => `rgba(${colB}, ${al * 0.2})`);
            }
        }
    }

    function drawConstellation() {
        drift(items);
        ctx.lineWidth = 0.8;
        for (let i = 0; i < items.length; i++) {
            const a = items[i];
            ctx.beginPath();
            ctx.arc(a.x, a.y, 1.6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${colA}, 0.5)`;
            ctx.fill();
            for (let j = i + 1; j < items.length; j++) {
                const b = items[j];
                const d = Math.hypot(a.x - b.x, a.y - b.y);
                if (d < 130) {
                    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(${colA}, ${(1 - d / 130) * 0.18})`;
                    ctx.stroke();
                }
            }
        }
    }

    function drawCircuit() {
        drift(items);
        ctx.lineWidth = 1;
        for (let i = 0; i < items.length; i++) {
            const a = items[i];
            ctx.fillStyle = `rgba(${colB}, 0.7)`;
            ctx.fillRect(a.x - 2, a.y - 2, 4, 4);
            for (let j = i + 1; j < items.length; j++) {
                const b = items[j];
                const d = Math.hypot(a.x - b.x, a.y - b.y);
                if (d < 190) {
                    const al = (1 - d / 190);
                    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, a.y); ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(${colC}, ${al * 0.3})`;
                    ctx.stroke();
                    const k = (performance.now() * 0.0004 + i * 0.37) % 1;
                    ctx.fillStyle = `rgba(${colA}, ${al * 0.9})`;
                    const px = k < 0.5 ? a.x + (b.x - a.x) * k * 2 : b.x;
                    const py = k < 0.5 ? a.y : a.y + (b.y - a.y) * (k - 0.5) * 2;
                    ctx.fillRect(px - 1.5, py - 1.5, 3, 3);
                }
            }
        }
    }

    function drawConfetti() {
        const cols = [colA, colB, colC, '255, 255, 255'];
        items.forEach((p) => {
            p.y += p.vy; p.x += p.vx + Math.sin(p.y * 0.01) * 0.3; p.r += p.vr;
            if (p.y > H + 20) { p.y = -20; p.x = rand(0, W); }
            ctx.save();
            ctx.translate(p.x, p.y); ctx.rotate(p.r);
            ctx.fillStyle = `rgba(${cols[p.c]}, 0.75)`;
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.55)';
            ctx.lineWidth = 1.5;
            if (p.kind === 0) { ctx.beginPath(); ctx.arc(0, 0, p.s, 0, 6.28); ctx.fill(); ctx.stroke(); }
            else if (p.kind === 1) { ctx.fillRect(-p.s, -p.s / 2, p.s * 2, p.s); ctx.strokeRect(-p.s, -p.s / 2, p.s * 2, p.s); }
            else { ctx.beginPath(); for (let k = 0; k < 5; k++) { const a = k * 1.2566 - 1.5708; ctx.lineTo(Math.cos(a) * p.s * 1.4, Math.sin(a) * p.s * 1.4); const b = a + 0.6283; ctx.lineTo(Math.cos(b) * p.s * 0.6, Math.sin(b) * p.s * 0.6); } ctx.closePath(); ctx.fill(); ctx.stroke(); }
            ctx.restore();
        });
    }

    function drawStreaks() {
        const cols = [colB, colC, colA];
        items.forEach((s) => {
            s.y += s.v;
            if (s.y - s.len > H) { s.y = -rand(20, 200); s.x = rand(0, W); }
            const g = ctx.createLinearGradient(s.x, s.y - s.len, s.x, s.y);
            g.addColorStop(0, `rgba(${cols[s.c]}, 0)`);
            g.addColorStop(1, `rgba(${cols[s.c]}, ${s.a})`);
            ctx.strokeStyle = g; ctx.lineWidth = 1.6;
            ctx.beginPath(); ctx.moveTo(s.x, s.y - s.len); ctx.lineTo(s.x, s.y); ctx.stroke();
        });
        if (Math.random() < 0.02) {
            ctx.fillStyle = `rgba(${colC}, 0.12)`;
            ctx.fillRect(0, rand(0, H), W, rand(2, 8));
        }
    }

    function drawBubbles() {
        const cols = [colB, colC, colA];
        items.forEach((b) => {
            b.y -= b.vy; b.sway += 0.01;
            const x = b.x + Math.sin(b.sway) * 14;
            if (b.y < -b.r * 2) { b.y = H + b.r * 2; b.x = rand(0, W); }
            const g = ctx.createRadialGradient(x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.1, x, b.y, b.r);
            g.addColorStop(0, `rgba(255, 255, 255, 0.28)`);
            g.addColorStop(1, `rgba(${cols[b.c]}, 0.08)`);
            ctx.beginPath(); ctx.arc(x, b.y, b.r, 0, 6.28);
            ctx.fillStyle = g; ctx.fill();
            ctx.strokeStyle = `rgba(${cols[b.c]}, 0.4)`; ctx.lineWidth = 1.2; ctx.stroke();
        });
    }

    function drawMatrix() {
        ctx.font = '14px ui-monospace, Consolas, monospace';
        ctx.textBaseline = 'top';
        items.forEach((c) => {
            c.head += c.speed;
            if (c.head - c.len > c.rows) { c.head = rand(-12, 0); c.len = Math.floor(rand(8, 24)); c.speed = rand(0.15, 0.5); }
            const headRow = Math.floor(c.head);
            for (let k = 0; k < c.len; k++) {
                const row = headRow - k;
                if (row < 0 || row >= c.rows) continue;
                if (Math.random() < 0.01) c.chars[row] = RAIN[Math.floor(Math.random() * RAIN.length)];
                const al = 1 - k / c.len;
                ctx.fillStyle = k === 0 ? `rgba(220, 255, 230, ${0.95})` : `rgba(${colB}, ${al * 0.65})`;
                ctx.fillText(c.chars[row], c.x, row * 16);
            }
        });
    }

    function drawStars(now) {
        items.forEach((s) => {
            s.ph += s.sp;
            const a = 0.25 + (Math.sin(s.ph) + 1) * 0.35;
            ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.28);
            ctx.fillStyle = `rgba(${s.r > 1.4 ? colA : '255, 255, 255'}, ${a})`;
            ctx.fill();
        });
        if (!items.shooting && Math.random() < 0.004) {
            items.shooting = { x: rand(0, W * 0.8), y: rand(0, H * 0.4), life: 0 };
        }
        const sh = items.shooting;
        if (sh) {
            sh.life += 1; sh.x += 9; sh.y += 4;
            const g = ctx.createLinearGradient(sh.x - 90, sh.y - 40, sh.x, sh.y);
            g.addColorStop(0, `rgba(${colA}, 0)`);
            g.addColorStop(1, `rgba(${colA}, 0.9)`);
            ctx.strokeStyle = g; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(sh.x - 90, sh.y - 40); ctx.lineTo(sh.x, sh.y); ctx.stroke();
            if (sh.life > 60) items.shooting = null;
        }
    }

    function drawBats(now) {
        items.forEach((b) => {
            b.x += b.vx; b.ph += 0.18; b.bob += 0.02;
            const y = b.y + Math.sin(b.bob) * 30;
            if (b.x < -80) b.x = W + 80;
            if (b.x > W + 80) b.x = -80;
            const flap = 0.65 + Math.abs(Math.sin(b.ph)) * 0.5;
            ctx.save();
            ctx.translate(b.x, y);
            ctx.scale(b.s * (b.vx < 0 ? 1 : -1), b.s * flap);
            ctx.translate(-50, -25);
            ctx.shadowColor = `rgba(${colB}, 0.6)`; ctx.shadowBlur = 14;
            ctx.fillStyle = `rgba(${colB}, ${b.a})`;
            ctx.fill(BAT);
            ctx.restore();
        });
    }

    function draw(now) {
        ctx.clearRect(0, 0, W, H);
        switch (mode) {
            case 'constellation': drawConstellation(); break;
            case 'circuit': drawCircuit(); break;
            case 'confetti': drawConfetti(); break;
            case 'streaks': drawStreaks(); break;
            case 'bubbles': drawBubbles(); break;
            case 'matrix': drawMatrix(); break;
            case 'stars': drawStars(now); break;
            case 'bats': drawBats(now); break;
            default: drawWeb();
        }
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('themechange', readTheme);
    window.addEventListener('pointermove', (event) => {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        pointer.active = true;
    }, { passive: true });
    window.addEventListener('pointerleave', () => { pointer.active = false; });

    resize();
    readTheme();
    requestAnimationFrame(draw);
})();
