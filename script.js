/* ============================================================
   script.js — Portfolio Interactive Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── 1. TYPED TEXT ANIMATION ──────────────────────────────
    const words = ['Intelligence', 'ML Models', 'GenAI Apps', 'Insights', 'Automation'];
    let wordIndex = 0, charIndex = 0, isDeleting = false;
    const typedEl = document.getElementById('typed-text');

    function type() {
        if (!typedEl) return;
        const current = words[wordIndex];
        typedEl.textContent = isDeleting
            ? current.substring(0, charIndex--)
            : current.substring(0, charIndex++);

        let speed = isDeleting ? 60 : 100;
        if (!isDeleting && charIndex === current.length + 1) {
            speed = 1800; isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            speed = 400;
        }
        setTimeout(type, speed);
    }
    setTimeout(type, 800);


    // ── 2. NAVBAR SCROLL EFFECT ──────────────────────────────
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });


    // ── 3. MOBILE HAMBURGER ──────────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    document.querySelectorAll('.nav-link, .nav-btn').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });


    // ── 4. ACTIVE NAV HIGHLIGHT ON SCROLL ───────────────────
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(s => {
            if (pageYOffset >= s.offsetTop - s.clientHeight / 3)
                current = s.getAttribute('id');
        });
        navItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`)
                link.classList.add('active');
        });
    }, { passive: true });


    // ── 5. SCROLL REVEAL (INTERSECTION OBSERVER) ─────────────
    const revealEls = document.querySelectorAll(
        '.reveal-fade-up, .reveal-fade-right, .reveal-fade-left'
    );

    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            // Use CSS --delay variable if present (project cards)
            const delay = el.style.getPropertyValue('--delay') || '0ms';
            el.style.transitionDelay = delay;
            el.classList.add('active');
            obs.unobserve(el);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));


    // ── 5.5 DYNAMIC EXPERIENCE COUNTER ───────────────────────
    const expCounter = document.getElementById('exp-counter');
    if (expCounter) {
        const timelineDates = document.querySelectorAll('.timeline-date');
        let totalMonths = 0;
        
        timelineDates.forEach(el => {
            const text = el.textContent.split('–').map(s => s.trim());
            if (text.length === 2 && text[0].length >= 3) {
                const startDate = new Date(text[0]);
                const endDate = text[1].toLowerCase() === 'present' ? new Date() : new Date(text[1]);
                if (!isNaN(startDate) && !isNaN(endDate)) {
                    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
                    if (months > 0) totalMonths += months;
                }
            }
        });
        
        const totalYears = Math.floor(totalMonths / 12);
        if (totalYears > 0) {
            expCounter.setAttribute('data-target', totalYears);
            
            // Also update the static text in the About Me section
            const aboutExpCounter = document.getElementById('about-exp-counter');
            if (aboutExpCounter) {
                aboutExpCounter.textContent = totalYears;
            }
        }
    }


    // ── 6. COUNTER-UP ANIMATION ──────────────────────────────
    const statNumbers = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = +el.dataset.target;
            const duration = 1400;
            const step = target / (duration / 16);
            let current = 0;
            const tick = () => {
                current = Math.min(current + step, target);
                el.textContent = Math.floor(current);
                if (current < target) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            obs.unobserve(el);
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));


    // ── 7. PROJECT FILTER TABS ───────────────────────────────
    const filterBtns   = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('#projectsGrid .project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            projectCards.forEach((card, i) => {
                const cat = card.dataset.category || '';
                const show = filter === 'all' || cat.includes(filter);

                if (show) {
                    card.style.display = '';
                    card.style.animation = 'none';
                    card.offsetHeight; // reflow
                    card.style.animation = `cardEntrance 0.5s ease ${i * 60}ms both`;
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });


    // ── 8. SET CURRENT YEAR ───────────────────────────────────
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();


    // ── 9. CONTACT FORM AJAX SUBMISSION ───────────────────────
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', async e => {
            e.preventDefault();
            const btn = document.getElementById('submitBtn');
            const orig = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });
                
                if (response.ok) {
                    btn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
                    btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
                    form.reset();
                } else {
                    btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Error!';
                    btn.style.background = '#EF4444';
                }
            } catch (error) {
                btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Error!';
                btn.style.background = '#EF4444';
            }
            
            setTimeout(() => {
                btn.innerHTML = orig;
                btn.style.background = '';
            }, 3000);
        });
    }


    // ── 10. DYNAMIC KEYFRAME FOR CARD ENTRANCE ────────────────
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes cardEntrance {
            from { opacity: 0; transform: translateY(24px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
    `;
    document.head.appendChild(styleSheet);

});
