/* ============================================
   DRIK PAUL - PORTFOLIO WEBSITE
   JavaScript - Particle Trail Cursor & Interactions
   ============================================ */

// ==========================================
// PARTICLE TRAIL CURSOR SYSTEM
// ==========================================

class ParticleTrail {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.isMoving = false;
        this.moveTimeout = null;

        this.init();
        this.bindEvents();
        this.animate();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    bindEvents() {
        // Mouse events for desktop
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.isMoving = true;

            // Create particles on mouse move
            this.createParticles(e.clientX, e.clientY);

            // Clear the moving flag after a delay
            clearTimeout(this.moveTimeout);
            this.moveTimeout = setTimeout(() => {
                this.isMoving = false;
            }, 100);
        });

        document.addEventListener('click', (e) => {
            // Create burst of particles on click
            this.createBurst(e.clientX, e.clientY);
        });

        // Touch events for mobile
        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            this.mouse.x = touch.clientX;
            this.mouse.y = touch.clientY;
            this.isMoving = true;

            // Create particles on touch move
            this.createParticles(touch.clientX, touch.clientY);

            // Clear the moving flag after a delay
            clearTimeout(this.moveTimeout);
            this.moveTimeout = setTimeout(() => {
                this.isMoving = false;
            }, 100);
        }, { passive: true });

        document.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            // Create a small burst on touch start
            this.createParticles(touch.clientX, touch.clientY);
        }, { passive: true });
    }

    createParticles(x, y) {
        const particleCount = 3;

        for (let i = 0; i < particleCount; i++) {
            const particle = {
                x: x,
                y: y,
                size: Math.random() * 4 + 2,
                speedX: (Math.random() - 0.5) * 2,
                speedY: (Math.random() - 0.5) * 2,
                life: 1,
                decay: Math.random() * 0.02 + 0.01,
                color: this.getRandomColor(),
                type: 'trail'
            };
            this.particles.push(particle);
        }
    }

    createBurst(x, y) {
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 / particleCount) * i;
            const velocity = Math.random() * 5 + 3;

            const particle = {
                x: x,
                y: y,
                size: Math.random() * 6 + 3,
                speedX: Math.cos(angle) * velocity,
                speedY: Math.sin(angle) * velocity,
                life: 1,
                decay: Math.random() * 0.015 + 0.01,
                color: this.getRandomColor(),
                type: 'burst'
            };
            this.particles.push(particle);
        }
    }

    getRandomColor() {
        const colors = [
            'rgba(0, 212, 255, ',    // Cyan
            'rgba(124, 58, 237, ',   // Purple
            'rgba(244, 114, 182, ',  // Pink
            'rgba(16, 185, 129, ',   // Green
            'rgba(255, 255, 255, '   // White
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            p.x += p.speedX;
            p.y += p.speedY;
            p.life -= p.decay;
            p.size *= 0.98;

            // Add some gravity for burst particles
            if (p.type === 'burst') {
                p.speedY += 0.1;
                p.speedX *= 0.98;
            }

            // Remove dead particles
            if (p.life <= 0 || p.size < 0.5) {
                this.particles.splice(i, 1);
            }
        }
    }

    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw cursor glow
        if (this.isMoving) {
            const gradient = this.ctx.createRadialGradient(
                this.mouse.x, this.mouse.y, 0,
                this.mouse.x, this.mouse.y, 30
            );
            gradient.addColorStop(0, 'rgba(0, 212, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');

            this.ctx.beginPath();
            this.ctx.arc(this.mouse.x, this.mouse.y, 30, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        }

        // Draw main cursor dot
        this.ctx.beginPath();
        this.ctx.arc(this.mouse.x, this.mouse.y, 6, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(0, 212, 255, 0.9)';
        this.ctx.fill();

        // Draw outer ring
        this.ctx.beginPath();
        this.ctx.arc(this.mouse.x, this.mouse.y, 12, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(0, 212, 255, 0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Draw particles
        for (const p of this.particles) {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color + p.life + ')';
            this.ctx.fill();

            // Add glow effect
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color + (p.life * 0.3) + ')';
            this.ctx.fill();
        }
    }

    animate() {
        this.updateParticles();
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// ==========================================
// TYPING ANIMATION
// ==========================================

class TypingAnimation {
    constructor(element, texts, speed = 100, pause = 2000) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.pause = pause;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;

        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];

        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.speed;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = this.pause;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ==========================================
// COUNTER ANIMATION
// ==========================================

class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('[data-count]');
        this.animated = new Set();

        this.observeCounters();
    }

    observeCounters() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated.has(entry.target)) {
                    this.animateCounter(entry.target);
                    this.animated.add(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOut);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        requestAnimationFrame(updateCounter);
    }
}

// ==========================================
// SCROLL REVEAL ANIMATION
// ==========================================

class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.glass-card, .section-title');
        this.init();
    }

    init() {
        this.elements.forEach(el => el.classList.add('reveal'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        this.elements.forEach(el => observer.observe(el));
    }
}

// ==========================================
// SMOOTH SCROLL & NAVIGATION
// ==========================================

class Navigation {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section');
        this.hamburger = document.querySelector('.hamburger');
        this.navLinksContainer = document.querySelector('.nav-links');

        this.init();
    }

    init() {
        // Smooth scroll
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);

                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    this.closeMenu();
                }
            });
        });

        // Active section highlight
        window.addEventListener('scroll', () => this.updateActiveSection());

        // Mobile menu toggle
        this.hamburger.addEventListener('click', () => this.toggleMenu());

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.glass-nav')) {
                this.closeMenu();
            }
        });
    }

    updateActiveSection() {
        const scrollPos = window.scrollY + 150;

        this.sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navLinksContainer.classList.toggle('active');
    }

    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navLinksContainer.classList.remove('active');
    }
}

// ==========================================
// PARALLAX EFFECT FOR ORBS
// ==========================================

class ParallaxOrbs {
    constructor() {
        this.orbs = document.querySelectorAll('.orb');
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            this.orbs.forEach((orb, index) => {
                const speed = (index + 1) * 20;
                const moveX = (x - 0.5) * speed;
                const moveY = (y - 0.5) * speed;

                orb.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });
    }
}

// ==========================================
// HERO PHOTO DISSOLVE - DISABLED
// User will implement this effect later
// ==========================================


// ==========================================
// MAGNETIC BUTTONS
// ==========================================

class MagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.btn, .project-link, .social-link');
        this.init();
    }

    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }
}

// ==========================================
// TILT EFFECT FOR CARDS
// ==========================================

class TiltCards {
    constructor() {
        this.cards = document.querySelectorAll('.project-card, .highlight-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
}

// ==========================================
// SKILL TAG HOVER EFFECT
// ==========================================

class SkillTagsEffect {
    constructor() {
        this.tags = document.querySelectorAll('.skill-tag');
        this.init();
    }

    init() {
        this.tags.forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                // Add ripple effect
                const ripple = document.createElement('span');
                ripple.style.cssText = `
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    background: rgba(0, 212, 255, 0.3);
                    border-radius: inherit;
                    animation: ripple 0.6s ease-out forwards;
                `;
                tag.style.position = 'relative';
                tag.style.overflow = 'hidden';
                tag.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Add ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                from { transform: scale(0); opacity: 1; }
                to { transform: scale(2); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// ==========================================
// INITIALIZE EVERYTHING
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle cursor
    new ParticleTrail();

    // Initialize typing animation
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        new TypingAnimation(typingElement, [
            'FPGA Designer',
            'Embedded Systems Developer',
            'IoT & Hardware Enthusiast',
            'Technical Head',
        ], 80, 2500);
    }

    // Initialize counters
    new CounterAnimation();

    // Initialize scroll reveal
    new ScrollReveal();

    // Initialize navigation
    new Navigation();

    // Initialize parallax orbs
    new ParallaxOrbs();

    // Initialize hero photo dissolve effect - DISABLED FOR NOW
    // new HeroPhotoDissolve();

    // Initialize magnetic buttons
    new MagneticButtons();

    // Initialize tilt cards
    new TiltCards();

    // Initialize skill tags effect
    new SkillTagsEffect();

    console.log('%c🚀 Drik Paul Portfolio Loaded!', 'color: #00d4ff; font-size: 20px; font-weight: bold;');
});

// ==========================================
// PRELOADER (Optional)
// ==========================================

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
