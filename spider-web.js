(function() {
    const canvas = document.getElementById('web-canvas');
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight * 0.28, active: false };
    const nodes = [];
    const nodeCount = Math.min(42, Math.max(22, Math.floor(window.innerWidth / 28)));

    function resize() {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * ratio;
        canvas.height = window.innerHeight * ratio;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        seedNodes();
    }

    function seedNodes() {
        nodes.length = 0;
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: Math.random() * 0.35 - 0.175,
                vy: Math.random() * 0.35 - 0.175,
                pulse: Math.random() * Math.PI * 2
            });
        }
    }

    function updateNodes() {
        nodes.forEach((node) => {
            node.x += node.vx;
            node.y += node.vy;
            node.pulse += 0.026;

            if (node.x < -20) node.x = window.innerWidth + 20;
            if (node.x > window.innerWidth + 20) node.x = -20;
            if (node.y < -20) node.y = window.innerHeight + 20;
            if (node.y > window.innerHeight + 20) node.y = -20;
        });
    }

    function drawLine(a, b, distance, range, color) {
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

    function draw() {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        updateNodes();

        const floatingGlyphs = Array.from(document.querySelectorAll('.binary-unit')).slice(-26).map((unit) => {
            const rect = unit.getBoundingClientRect();
            return {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
                pulse: performance.now() * 0.002
            };
        });

        const points = pointer.active ? nodes.concat(floatingGlyphs, pointer) : nodes.concat(floatingGlyphs);

        for (let i = 0; i < points.length; i++) {
            const a = points[i];

            ctx.beginPath();
            ctx.arc(a.x, a.y, 1.3 + Math.sin((a.pulse || 0)) * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 233, 74, 0.42)';
            ctx.fill();

            for (let j = i + 1; j < points.length; j++) {
                const b = points[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 154) {
                    drawLine(a, b, distance, 154, (alpha) => `rgba(255, 233, 74, ${alpha * 0.38})`);
                } else if (distance < 210 && (i + j) % 7 === 0) {
                    drawLine(a, b, distance, 210, (alpha) => `rgba(255, 23, 68, ${alpha * 0.2})`);
                }
            }
        }

        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', (event) => {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        pointer.active = true;
    }, { passive: true });

    window.addEventListener('pointerleave', () => {
        pointer.active = false;
    });

    resize();
    draw();
})();
