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
// True image disintegration effect
// ==========================================

class HeroPhotoDissolve {
    constructor() {
        this.photoContainer = document.querySelector('.hero-photo-container');
        this.photoWrapper = document.querySelector('.hero-photo-wrapper');
        this.heroPhoto = document.querySelector('.hero-photo');
        this.particles = [];
        this.scrollThreshold = 50;
        this.maxScroll = 400;
        this.canvas = null;
        this.lastProgress = 0;
        this.imageLoaded = false;
        this.tileSize = 1; // Size of each particle tile (smaller = more particles)

        if (this.photoContainer && this.heroPhoto) {
            this.init();
        }
    }

    init() {
        // Wait for image to load before sampling pixels
        if (this.heroPhoto.complete) {
            this.setupEffect();
        } else {
            this.heroPhoto.addEventListener('load', () => this.setupEffect());
        }
    }

    setupEffect() {
        // Create canvas for particles
        this.createCanvas();

        // Sample the image and create particles from actual pixels
        this.sampleImageAndCreateParticles();

        // Listen for scroll
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

        // Start animation
        this.animate();
        this.handleScroll();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.classList.add('dust-canvas');
        this.canvas.style.cssText = `
            position: absolute;
            top: -200px;
            left: -200px;
            width: calc(100% + 400px);
            height: calc(100% + 400px);
            pointer-events: none;
            z-index: 10;
        `;
        this.photoWrapper.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        const rect = this.photoContainer.getBoundingClientRect();
        this.canvas.width = rect.width + 400;
        this.canvas.height = rect.height + 400;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.radius = rect.width / 2;
    }

    sampleImageAndCreateParticles() {
        // Create a temporary canvas to sample the image
        const tempCanvas = document.createElement('canvas');
        const size = 300; // Match photo size
        tempCanvas.width = size;
        tempCanvas.height = size;
        const tempCtx = tempCanvas.getContext('2d');

        // Draw circular clipped image
        tempCtx.beginPath();
        tempCtx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        tempCtx.clip();
        tempCtx.drawImage(this.heroPhoto, 0, 0, size, size);

        // Get image data
        const imageData = tempCtx.getImageData(0, 0, size, size);
        const pixels = imageData.data;

        this.particles = [];

        // Sample pixels in a grid pattern
        for (let y = 0; y < size; y += this.tileSize) {
            for (let x = 0; x < size; x += this.tileSize) {
                // Check if this pixel is inside the circle
                const dx = x - size / 2;
                const dy = y - size / 2;
                const distFromCenter = Math.sqrt(dx * dx + dy * dy);

                if (distFromCenter < size / 2 - 2) {
                    // Get pixel color at this position
                    const i = (y * size + x) * 4;
                    const r = pixels[i];
                    const g = pixels[i + 1];
                    const b = pixels[i + 2];
                    const a = pixels[i + 3];

                    // Skip transparent pixels
                    if (a < 50) continue;

                    // Position in the main canvas (offset by 200 for the expanded canvas)
                    const originX = x + 200;
                    const originY = y + 200;

                    // Calculate fly direction (outward from center)
                    const angle = Math.atan2(dy, dx);
                    const flyAngle = angle + (Math.random() - 0.5) * 0.8;
                    const flyDistance = 120 + Math.random() * 180;

                    this.particles.push({
                        // Position on main canvas
                        x: originX,
                        y: originY,
                        originX: originX,
                        originY: originY,
                        // Target position
                        targetX: originX + Math.cos(flyAngle) * flyDistance,
                        targetY: originY + Math.sin(flyAngle) * flyDistance,
                        // Color from actual image
                        r: r,
                        g: g,
                        b: b,
                        // Size
                        size: this.tileSize,
                        // Delay for staggered effect (outer particles fly first)
                        delay: (distFromCenter / (size / 2)) * 0.4,
                        // Rotation
                        rotation: 0,
                        targetRotation: (Math.random() - 0.5) * Math.PI * 2
                    });
                }
            }
        }

        this.imageLoaded = true;
    }

    handleScroll() {
        const scrollY = window.scrollY;

        let progress = 0;
        if (scrollY > this.scrollThreshold) {
            progress = Math.min((scrollY - this.scrollThreshold) / (this.maxScroll - this.scrollThreshold), 1);
        }

        this.lastProgress = progress;

        // Hide original photo as particles take over
        if (this.heroPhoto) {
            this.heroPhoto.style.opacity = 1 - progress;
        }
    }

    animate() {
        if (!this.imageLoaded) {
            requestAnimationFrame(() => this.animate());
            return;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const progress = this.lastProgress;

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            // Staggered animation based on delay
            let adjustedProgress = Math.max(0, (progress - p.delay) / (1 - p.delay));
            adjustedProgress = Math.min(1, adjustedProgress);

            // Eased progress for smooth animation
            const easedProgress = this.easeOutCubic(adjustedProgress);

            // Interpolate position
            const x = p.originX + (p.targetX - p.originX) * easedProgress;
            const y = p.originY + (p.targetY - p.originY) * easedProgress;

            // Rotation
            const rotation = p.targetRotation * easedProgress;

            // Opacity: particles visible when moving, fade out at end
            let opacity = 1;
            if (adjustedProgress > 0.7) {
                opacity = 1 - ((adjustedProgress - 0.7) / 0.3);
            }

            // Size: slightly shrink as they fly
            const size = p.size * (1 - easedProgress * 0.3);

            // Only draw if particle has started moving OR we're scrolled
            if (progress > 0) {
                this.ctx.save();
                this.ctx.translate(x, y);
                this.ctx.rotate(rotation);
                this.ctx.globalAlpha = opacity;
                this.ctx.fillStyle = `rgb(${p.r}, ${p.g}, ${p.b})`;
                this.ctx.fillRect(-size / 2, -size / 2, size, size);
                this.ctx.restore();
            }
        }

        requestAnimationFrame(() => this.animate());
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
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
