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
// HERO PHOTO DUST DISSOLVE ON SCROLL
// ==========================================

class HeroPhotoDissolve {
    constructor() {
        this.photoContainer = document.querySelector('.hero-photo-container');
        this.photoWrapper = document.querySelector('.hero-photo-wrapper');
        this.dustOverlay = document.getElementById('photoDust');
        this.particles = [];
        this.isDissolving = false;
        this.scrollThreshold = 100;
        this.canvas = null;

        if (this.photoContainer) {
            this.init();
        }
    }

    init() {
        // Create canvas for dust particles
        this.createDustCanvas();

        // Listen for scroll events
        window.addEventListener('scroll', () => this.handleScroll());

        // Initial check
        this.handleScroll();
    }

    createDustCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.classList.add('dust-canvas');
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10;
        `;
        this.photoContainer.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
    }

    resizeCanvas() {
        const rect = this.photoContainer.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    handleScroll() {
        const scrollY = window.scrollY;
        const progress = Math.min(scrollY / (this.scrollThreshold * 3), 1);

        if (scrollY > this.scrollThreshold) {
            if (!this.isDissolving) {
                this.startDissolve();
            }
            this.updateDissolve(progress);
        } else {
            if (this.isDissolving || this.photoContainer.classList.contains('hidden')) {
                this.reverseDissolve(progress);
            }
        }
    }

    startDissolve() {
        this.isDissolving = true;
        this.photoContainer.classList.add('dissolving');
        this.createParticles();
        this.animateParticles();
    }

    createParticles() {
        this.particles = [];
        const rect = this.photoContainer.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const radius = rect.width / 2;

        // Create particles around the circular photo
        for (let i = 0; i < 100; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = Math.random() * radius * 0.9;
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;

            this.particles.push({
                x: x,
                y: y,
                originX: x,
                originY: y,
                size: Math.random() * 4 + 1,
                speedX: (Math.random() - 0.5) * 8,
                speedY: (Math.random() - 0.5) * 8 - 2, // Slight upward bias
                life: 1,
                decay: Math.random() * 0.01 + 0.005,
                color: this.getRandomColor(),
                active: false
            });
        }
    }

    getRandomColor() {
        const colors = [
            'rgba(0, 212, 255, ',
            'rgba(124, 58, 237, ',
            'rgba(244, 114, 182, ',
            'rgba(255, 255, 255, '
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    updateDissolve(progress) {
        // Activate particles based on progress
        const activeCount = Math.floor(this.particles.length * progress);
        for (let i = 0; i < activeCount; i++) {
            if (!this.particles[i].active) {
                this.particles[i].active = true;
            }
        }

        // Update photo opacity and blur
        if (this.photoContainer) {
            const opacity = 1 - progress;
            const blur = progress * 8;
            const scale = 1 - (progress * 0.2);

            this.photoContainer.style.opacity = Math.max(0, opacity);
            this.photoContainer.style.filter = `blur(${blur}px)`;
            this.photoContainer.style.transform = `scale(${scale})`;

            if (progress >= 1) {
                this.photoContainer.classList.add('hidden');
                this.photoContainer.classList.remove('dissolving');
            }
        }
    }

    reverseDissolve(progress) {
        // Reverse the dissolve effect
        this.isDissolving = false;
        this.photoContainer.classList.remove('dissolving');
        this.photoContainer.classList.remove('hidden');

        const opacity = 1 - progress;
        const blur = progress * 8;
        const scale = 1 - (progress * 0.2);

        this.photoContainer.style.opacity = Math.max(0.1, opacity);
        this.photoContainer.style.filter = `blur(${blur}px)`;
        this.photoContainer.style.transform = `scale(${scale})`;

        if (progress <= 0) {
            this.photoContainer.style.opacity = 1;
            this.photoContainer.style.filter = '';
            this.photoContainer.style.transform = '';
            this.particles = [];
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    animateParticles() {
        if (!this.isDissolving && this.particles.every(p => !p.active)) {
            return;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            if (p.active) {
                p.x += p.speedX;
                p.y += p.speedY;
                p.life -= p.decay;
                p.size *= 0.99;
                p.speedY += 0.05; // Gravity

                if (p.life > 0 && p.size > 0.5) {
                    // Draw particle
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    this.ctx.fillStyle = p.color + p.life + ')';
                    this.ctx.fill();

                    // Glow effect
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
                    this.ctx.fillStyle = p.color + (p.life * 0.3) + ')';
                    this.ctx.fill();
                }
            }
        }

        if (this.isDissolving) {
            requestAnimationFrame(() => this.animateParticles());
        }
    }
}

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

    // Initialize hero photo dissolve effect
    new HeroPhotoDissolve();

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
