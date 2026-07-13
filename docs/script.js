/* DRIK PAUL - PORTFOLIO WEBSITE
   JavaScript - Interactions & Animations */

// TYPING ANIMATION

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

// COUNTER ANIMATION

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
        const target = parseFloat(element.dataset.count);
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        // Check if target has decimals
        const hasDecimals = target % 1 !== 0;
        const decimalPlaces = hasDecimals ? (element.dataset.count.split('.')[1] || '').length : 0;

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = start + (target - start) * easeOut;

            // Format with correct decimal places
            element.textContent = hasDecimals ? current.toFixed(decimalPlaces) : Math.floor(current);

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = hasDecimals ? target.toFixed(decimalPlaces) : target;
            }
        };

        requestAnimationFrame(updateCounter);
    }
}

// SCROLL REVEAL ANIMATION

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

// SMOOTH SCROLL & NAVIGATION

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

// PARALLAX EFFECT FOR ORBS

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

// HERO PHOTO DISSOLVE - DISABLED
// User will implement this effect later


// MAGNETIC BUTTONS

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

// TILT EFFECT FOR CARDS

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

// SKILL TAG HOVER EFFECT

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

// INITIALIZE EVERYTHING

document.addEventListener('DOMContentLoaded', () => {
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

// PRELOADER (Optional)

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
