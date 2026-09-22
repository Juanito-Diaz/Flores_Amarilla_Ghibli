/**
 * STUDIO GHIBLI MEADOW ENGINE 🌾🌼💛
 * Features:
 * 1. Mouse Parallax Depth Effect on Ghibli Meadow Background
 * 2. Canvas Particles: Dandelion seeds, wind stream lines, soot sparkles & falling yellow petals
 * 3. Interactive Pointer Sparkle Burst
 */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('ghibliCanvas');
    const ctx = canvas.getContext('2d');
    const bgLayer = document.querySelector('.ghibli-bg-layer');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    /* ==========================================================================
       1. MOUSE / TOUCH PARALLAX DEPTH EFFECT
       ========================================================================== */
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - width / 2) / (width / 2);
        mouseY = (e.clientY - height / 2) / (height / 2);
    });

    window.addEventListener('deviceorientation', (e) => {
        if (e.gamma && e.beta) {
            mouseX = e.gamma / 30;
            mouseY = (e.beta - 45) / 30;
        }
    });

    function updateParallax() {
        targetX += (mouseX * 15 - targetX) * 0.05;
        targetY += (mouseY * 12 - targetY) * 0.05;

        if (bgLayer) {
            bgLayer.style.transform = `scale(1.06) translate(${targetX}px, ${targetY}px)`;
        }
        requestAnimationFrame(updateParallax);
    }
    updateParallax();

    /* ==========================================================================
       2. GHIBLI CANAL PARTICLES & WIND ENGINE
       ========================================================================== */
    const dandelionFluffs = [];
    const fallingPetals = [];
    const windStreams = [];
    const clickSparkles = [];

    // Dandelion Seed
    class DandelionFluff {
        constructor() {
            this.reset(true);
        }
        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : height + 20;
            this.size = Math.random() * 5 + 3.5;
            this.speedY = -(Math.random() * 0.45 + 0.2);
            this.speedX = Math.random() * 0.7 + 0.3; // Breeze blowing right
            this.alpha = Math.random() * 0.65 + 0.35;
            this.wobble = Math.random() * Math.PI * 2;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.wobble) * 0.35;
            this.wobble += 0.02;
            if (this.y < -30 || this.x > width + 40) this.reset();
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.translate(this.x, this.y);

            ctx.beginPath();
            ctx.arc(0, 0, 1.2, 0, Math.PI * 2);
            ctx.fillStyle = '#fef08a';
            ctx.fill();

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 0.8;
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI * 2 / 6) * i;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(Math.cos(angle) * this.size, Math.sin(angle) * this.size);
                ctx.stroke();
            }
            ctx.restore();
        }
    }

    // Drifting Yellow Petals
    class GhibliPetal {
        constructor() {
            this.reset(true);
        }
        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : -20;
            this.size = Math.random() * 12 + 7;
            this.speedY = Math.random() * 1.1 + 0.5;
            this.speedX = Math.random() * 0.7 + 0.2;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.03;
            this.alpha = Math.random() * 0.75 + 0.25;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.y * 0.012) * 0.5;
            this.rotation += this.rotSpeed;
            if (this.y > height + 20) this.reset();
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.alpha;

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(this.size * 0.5, -this.size * 0.4, this.size, 0);
            ctx.quadraticCurveTo(this.size * 0.5, this.size * 0.4, 0, 0);

            const petalGrad = ctx.createLinearGradient(0, 0, this.size, 0);
            petalGrad.addColorStop(0, '#fff5a6');
            petalGrad.addColorStop(0.6, '#facc15');
            petalGrad.addColorStop(1, '#eab308');

            ctx.fillStyle = petalGrad;
            ctx.fill();
            ctx.restore();
        }
    }

    // Wind Stream Line
    class WindStream {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = -150;
            this.y = Math.random() * (height * 0.65);
            this.length = Math.random() * 220 + 140;
            this.speed = Math.random() * 3.5 + 2;
            this.alpha = Math.random() * 0.28 + 0.1;
        }
        update() {
            this.x += this.speed;
            if (this.x > width + 250) this.reset();
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.bezierCurveTo(
                this.x + this.length * 0.4, this.y - 15,
                this.x + this.length * 0.7, this.y + 15,
                this.x + this.length, this.y
            );
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.8;
            ctx.lineCap = 'round';
            ctx.stroke();
            ctx.restore();
        }
    }

    // Click Sparkles
    class ClickSparkle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3.5 + 1;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.size = Math.random() * 12 + 8;
            this.alpha = 1;
            this.decay = Math.random() * 0.03 + 0.02;
            this.char = Math.random() > 0.4 ? '✨' : '🌼';
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay;
        }
        draw() {
            if (this.alpha <= 0) return;
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.font = `${this.size}px sans-serif`;
            ctx.fillText(this.char, this.x, this.y);
            ctx.restore();
        }
    }

    for (let i = 0; i < 35; i++) dandelionFluffs.push(new DandelionFluff());
    for (let i = 0; i < 22; i++) fallingPetals.push(new GhibliPetal());
    for (let i = 0; i < 5; i++) windStreams.push(new WindStream());

    function animateGhibliScene() {
        ctx.clearRect(0, 0, width, height);

        windStreams.forEach(ws => { ws.update(); ws.draw(); });
        dandelionFluffs.forEach(df => { df.update(); df.draw(); });
        fallingPetals.forEach(fp => { fp.update(); fp.draw(); });

        for (let i = clickSparkles.length - 1; i >= 0; i--) {
            const cs = clickSparkles[i];
            cs.update();
            cs.draw();
            if (cs.alpha <= 0) clickSparkles.splice(i, 1);
        }

        requestAnimationFrame(animateGhibliScene);
    }
    animateGhibliScene();

    window.addEventListener('pointerdown', (e) => {
        for (let i = 0; i < 12; i++) {
            clickSparkles.push(new ClickSparkle(e.clientX, e.clientY));
        }
    });
});
