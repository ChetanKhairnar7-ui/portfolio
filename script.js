/**
 * Chetan Khairnar — Portfolio Script
 * Pure vanilla JavaScript: particles, mobile nav, and contact form handling.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ── 1. PARTICLE CANVAS ──────────────────────────────────────────
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W = canvas.width  = window.innerWidth;
        let H = canvas.height = window.innerHeight;
        let mouse = { x: null, y: null };

        window.addEventListener('resize', () => {
            W = canvas.width  = window.innerWidth;
            H = canvas.height = window.innerHeight;
        });
        window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
        window.addEventListener('mouseout',  () => { mouse.x = null; mouse.y = null; });

        const COUNT = Math.min(Math.floor((W * H) / 20000), 45);

        class Dot {
            constructor() {
                this.x  = Math.random() * W;
                this.y  = Math.random() * H;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.r  = Math.random() * 1.5 + 0.6;
                this.color = Math.random() > 0.45 ? 'rgba(6,182,212,' : 'rgba(52,211,153,';
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > W) this.vx *= -1;
                if (this.y < 0 || this.y > H) this.vy *= -1;

                if (mouse.x !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const d  = Math.sqrt(dx * dx + dy * dy);
                    if (d < 80) {
                        const f = (80 - d) / 80;
                        this.x -= (dx / d) * f * 1.5;
                        this.y -= (dy / d) * f * 1.5;
                    }
                }

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `${this.color}0.45)`;
                ctx.fill();
            }
        }

        const dots = Array.from({ length: COUNT }, () => new Dot());

        function frame() {
            ctx.clearRect(0, 0, W, H);
            for (let i = 0; i < dots.length; i++) {
                for (let j = i + 1; j < dots.length; j++) {
                    const dx = dots[i].x - dots[j].x;
                    const dy = dots[i].y - dots[j].y;
                    const d  = Math.sqrt(dx * dx + dy * dy);
                    if (d < 90) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(6,182,212,${(1 - d / 90) * 0.15})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(dots[i].x, dots[i].y);
                        ctx.lineTo(dots[j].x, dots[j].y);
                        ctx.stroke();
                    }
                }
                dots[i].update();
            }
            requestAnimationFrame(frame);
        }
        frame();
    }

    // ── 2. MOBILE MENU ──────────────────────────────────────────────
    const menuBtn  = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
        });
        mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
            });
        });
    }

    // ── 3. CONTACT FORM ─────────────────────────────────────────────
    const form     = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('form-submit-btn');

    if (form && feedback && submitBtn) {
        form.addEventListener('submit', e => {
            e.preventDefault();

            const name    = document.getElementById('form-name').value.trim();
            const email   = document.getElementById('form-email').value.trim();
            const subject = document.getElementById('form-subject').value.trim() || 'Backend Developer Opportunity';
            const message = document.getElementById('form-message').value.trim();

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';

            setTimeout(() => {
                feedback.classList.remove('hidden');
                feedback.className = 'p-3.5 rounded-xl text-xs text-center font-mono bg-emerald-950 border border-emerald-800 text-emerald-300';
                feedback.textContent = `Thank you, ${name}! Opening your email client to send the message.`;

                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Sent';
                form.reset();

                window.location.href = `mailto:chetan.khairnar234@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message)}`;
            }, 400);
        });
    }

});
