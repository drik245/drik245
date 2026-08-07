/* ============================================
   SIGNAL DECK — Drik Paul Portfolio
   JavaScript: minimal, purposeful
   ============================================ */

'use strict';


/* ──────────────────────────────────────────── */
/*  1. CURSOR GLOW (desktop only)              */
/*  Soft accent radial that tracks the mouse   */
/* ──────────────────────────────────────────── */

function initCursorGlow() {
    const el = document.getElementById('cursorGlow');
    if (!el) return;

    // Disable on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        el.style.display = 'none';
        return;
    }

    // Disable if reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.style.display = 'none';
        return;
    }

    let mx = 0, my = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
    });

    function tick() {
        cx += (mx - cx) * 0.06;
        cy += (my - cy) * 0.06;
        el.style.left = cx + 'px';
        el.style.top = cy + 'px';
        requestAnimationFrame(tick);
    }

    tick();
}


/* ──────────────────────────────────────────── */
/*  2. SCROLL REVEAL                           */
/*  Fade-in + 14px drift, staggered ~80-100ms  */
/*  Threshold 0.2, once only                   */
/* ──────────────────────────────────────────── */

function initScrollReveal() {
    const items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => entry.target.classList.add('revealed'), delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -20px 0px' });

    items.forEach(el => observer.observe(el));
}


/* ──────────────────────────────────────────── */
/*  3. COUNTER — numbers count up from 0       */
/*  Triggered when scrolled into view          */
/* ──────────────────────────────────────────── */

function initCounters() {
    const els = document.querySelectorAll('[data-count]');
    if (!els.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target, reducedMotion);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    els.forEach(el => observer.observe(el));
}

function animateCount(el, instant) {
    const target = parseFloat(el.dataset.count);
    const hasDec = target % 1 !== 0;
    const decimals = hasDec ? (el.dataset.count.split('.')[1] || '').length : 0;

    if (instant) {
        el.textContent = hasDec ? target.toFixed(decimals) : target;
        return;
    }

    const duration = 2200;
    const start = performance.now();

    function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        const current = target * ease;

        el.textContent = hasDec ? current.toFixed(decimals) : Math.floor(current);

        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            el.textContent = hasDec ? target.toFixed(decimals) : target;
        }
    }

    requestAnimationFrame(tick);
}


/* ──────────────────────────────────────────── */
/*  4. NAVIGATION — scroll spy + mobile menu   */
/* ──────────────────────────────────────────── */

function initNavigation() {
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const toggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    // Smooth scroll
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
            closeMenu();
        });
    });

    // Also handle callsign click
    const callsign = document.querySelector('.nav-callsign');
    if (callsign) {
        callsign.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Scroll spy
    function spy() {
        const scrollY = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                links.forEach(l => {
                    l.classList.toggle('active', l.dataset.section === id);
                });
            }
        });
    }

    window.addEventListener('scroll', spy, { passive: true });
    spy();

    // Mobile menu toggle
    function closeMenu() {
        toggle.classList.remove('active');
        navLinks.classList.remove('open');
    }

    if (toggle) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            navLinks.classList.toggle('open');
        });
    }
}


/* ──────────────────────────────────────────── */
/*  5. SCROLL PROGRESS BAR (optional,          */
/*     handled via data attribute on bar)       */
/* ──────────────────────────────────────────── */

/* Not included — the nav active indicator     */
/* is sufficient for a restrained design       */


/* ──────────────────────────────────────────── */
/*  6. LIVE CLOCK                              */
/*  IST time, updates every second             */
/* ──────────────────────────────────────────── */

function initClock() {
    const el = document.getElementById('clockValue');
    if (!el) return;

    function update() {
        const now = new Date();
        // IST = UTC + 5:30
        const istOffset = 5.5 * 60 * 60 * 1000;
        const ist = new Date(now.getTime() + (istOffset + now.getTimezoneOffset() * 60000));

        const h = String(ist.getHours()).padStart(2, '0');
        const m = String(ist.getMinutes()).padStart(2, '0');
        const s = String(ist.getSeconds()).padStart(2, '0');
        el.textContent = `${h}:${m}:${s} IST`;
    }

    update();
    setInterval(update, 1000);
}


/* ──────────────────────────────────────────── */
/*  7. TIMELINE NODE ACTIVATION                */
/*  Nodes light up as user scrolls past them   */
/* ──────────────────────────────────────────── */

function initTimelineNodes() {
    const entries = document.querySelectorAll('.tl-entry');
    if (!entries.length) return;

    const observer = new IntersectionObserver((items) => {
        items.forEach(item => {
            if (item.isIntersecting) {
                item.target.classList.add('revealed');
                observer.unobserve(item.target);
            }
        });
    }, { threshold: 0.3 });

    entries.forEach(entry => observer.observe(entry));
}


/* ──────────────────────────────────────────── */
/*  8. EASTER EGG TERMINAL                     */
/* ──────────────────────────────────────────── */

function initTerminal() {
    const overlay = document.getElementById('terminalOverlay');
    const input = document.getElementById('terminalInput');
    const output = document.getElementById('terminalOutput');
    const closeBtn = document.getElementById('terminalClose');
    const body = document.getElementById('terminalBody');

    if (!overlay || !input) return;

    let isTerminalOpen = false;

    // Toggle on ~ or ` key
    document.addEventListener('keydown', (e) => {
        if (e.key === '`' || e.key === '~') {
            e.preventDefault(); 
            toggleTerminal();
        }
        
        // Close on ESC
        if (e.key === 'Escape' && isTerminalOpen) {
            toggleTerminal();
        }
    });

    closeBtn.addEventListener('click', toggleTerminal);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) toggleTerminal();
    });

    function toggleTerminal() {
        isTerminalOpen = !isTerminalOpen;
        if (isTerminalOpen) {
            overlay.classList.add('active');
            setTimeout(() => input.focus(), 100);
        } else {
            overlay.classList.remove('active');
            input.blur();
        }
    }

    const commands = {
        'help': 'Available commands: help, clear, about, date, whoami, ping, sudo, ls, cat [file], echo [text]',
        'clear': () => { output.innerHTML = ''; return ''; },
        'about': 'Signal Deck OS v1.0.0. Core systems online. Created by Drik Paul.',
        'date': () => new Date().toString(),
        'whoami': 'guest_user_992',
        'ping': 'pong',
        'sudo': '<span class="cmd-err">Permission denied. This incident will be reported.</span>',
        'ls': 'home   about.md   projects.txt   contact.info',
    };

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmdText = input.value.trim();
            input.value = '';
            
            if (cmdText) {
                printOutput(`<span style="color: var(--accent); margin-right: 8px;">guest@signal-deck:~$</span> ${cmdText}`);
                processCommand(cmdText);
            }
        }
    });

    function processCommand(cmdText) {
        const parts = cmdText.split(' ').filter(Boolean);
        const cmd = parts[0].toLowerCase();
        
        let response = '';

        if (cmd === 'echo') {
            response = parts.slice(1).join(' ');
        } else if (cmd === 'cat') {
            if (parts.length < 2) {
                response = '<pre style="color: var(--accent); margin: 4px 0; line-height: 1.2; font-family: var(--f-mono);"> /\\_/\\ \n( o.o ) &lt; Meow! Specify a file to read.\n &gt; ^ &lt; </pre>';
            } else {
                const file = parts[1].toLowerCase();
                const files = {
                    'home': '<pre style="color: var(--accent); margin: 4px 0; line-height: 1.2; font-family: var(--f-mono);"> /\\_/\\ \n( -.- ) &lt; Meow... home is a directory.\n &gt; ^ &lt; </pre>',
                    'about.md': 'Electronics & Communication Engineer with a strong foundation in embedded systems, FPGA development, and IoT.<br>Passionate about the intersection of hardware design, real-time systems, and AI-driven automation.',
                    'projects.txt': 'PRJ-001 FPGA Sound Synth<br>PRJ-002 AgroSmart<br>PRJ-003 BLE Encryption Device<br>PRJ-004 ESP32 Spatial Audio<br>PRJ-005 Matrix Display Driver<br>PRJ-006 V4K Shrike<br>PRJ-007 LPC1768 CAN Driver',
                    'contact.info': 'Email: drik@tuta.io<br>GitHub: github.com/drik245<br>LinkedIn: linkedin.com/in/drikpaul202<br>Location: Ghaziabad, UP, India'
                };
                response = files[file] || `<pre style="color: var(--accent); margin: 4px 0; line-height: 1.2; font-family: var(--f-mono);"> /\\_/\\ \n( o_O ) &lt; Meow? '${file}' not found.\n &gt; ^ &lt; </pre>`;
            }
        } else if (commands.hasOwnProperty(cmd)) {
            const result = commands[cmd];
            response = typeof result === 'function' ? result() : result;
        } else {
            response = `<span class="cmd-err">Command not found: ${cmd}. Type 'help' for available commands.</span>`;
        }

        if (response) {
            printOutput(response);
        }
    }

    function printOutput(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        output.appendChild(div);
        body.scrollTop = body.scrollHeight;
    }
}


/* ──────────────────────────────────────────── */
/*  BOOT                                       */
/* ──────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
    initCursorGlow();
    initScrollReveal();
    initCounters();
    initNavigation();
    initClock();
    initTimelineNodes();
    initTerminal();
});
