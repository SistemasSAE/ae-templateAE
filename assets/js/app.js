/**
 * ============================================
 * ASISTESCOLAR - LANDING PAGE
 * Main JavaScript File
 * ============================================
 */

// ============================================
// 0. COMPONENT LOADER UTILITY
// ============================================

const loadComponent = async (placeholderId, url) => {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Could not load ${url}`);
        const content = await response.text();
        placeholder.innerHTML = content;
        return true;
    } catch (error) {
        console.error('Error loading component:', error);
        return false;
    }
};

// ============================================
// 1. INITIALIZATION WRAPPER
// ============================================

const initApp = async () => {
    const preloader = document.getElementById('preloader');
    let initialized = false;

    // Function to reveal the page
    const revealPage = () => {
        if (initialized) return;
        initialized = true;

        document.body.classList.add('loaded');
        document.body.classList.remove('loading');

        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600);
        }

        // Initialize animations (AOS) only after reveal for better performance
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true,
                mirror: false
            });
        }
    };

    // Safety timeout: reveal page after 3 seconds anyway
    setTimeout(revealPage, 3000);

    // 1. Start loading Navbar and Footer in parallel
    const componentPromises = [
        loadComponent('navbar-placeholder', 'components/navbar.html'),
        loadComponent('footer-placeholder', 'components/footer.html')
    ];

    try {
        // 2. Wait for components
        const [navbarLoaded, footerLoaded] = await Promise.all(componentPromises);

        if (navbarLoaded) {
            initNavbarLogic();
        }

        // 3. Initialize independent logic
        initStatsCounter();
        initContactForm();
        initBackToTop();
        initScrollIndicator();
        initAnimations();
        initHeroCarousel();

        // 4. Reveal Page
        setTimeout(revealPage, 400);

    } catch (error) {
        console.error('Initialization error:', error);
        revealPage();
    }
};

// ============================================
// 2. NAVBAR & NAVIGATION LOGIC
// ============================================

const initNavbarLogic = () => {
    const navbar = document.querySelector('#mainNav');
    const navLinks = document.querySelectorAll('#mainNav .nav-link');
    const sections = document.querySelectorAll('section');

    if (!navbar) return;

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Highlight active section (IntersectionObserver)
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => link.classList.remove('active'));

                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"], .nav-link[href="index.html#${sectionId}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));

    // Smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.includes('#')) {
                const targetId = href.split('#')[1];
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    e.preventDefault();
                    const navbarHeight = navbar.offsetHeight;
                    const targetPosition = targetSection.offsetTop - navbarHeight;

                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });

                    // Close mobile menu
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show')) {
                        document.querySelector('.navbar-toggler').click();
                    }
                }
            }
        });
    });

    // Mega-menu toggle
    const megaItems = document.querySelectorAll('.has-megamenu');
    megaItems.forEach(item => {
        const trigger = item.querySelector('.nav-link--dropdown, .btn-comunidad');
        if (!trigger) return;

        // Desktop
        item.addEventListener('mouseenter', () => {
            if (window.innerWidth >= 992) item.classList.add('open');
        });
        item.addEventListener('mouseleave', () => {
            if (window.innerWidth >= 992) item.classList.remove('open');
        });

        // Mobile
        trigger.addEventListener('click', (e) => {
            if (window.innerWidth < 992) {
                e.preventDefault();
                const isOpen = item.classList.contains('open');
                megaItems.forEach(other => other.classList.remove('open'));
                if (!isOpen) item.classList.add('open');
            }
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.has-megamenu')) {
            megaItems.forEach(item => item.classList.remove('open'));
        }
    });
};

// ============================================
// 3. STATS COUNTER
// ============================================

const initStatsCounter = () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('#stats');
    let hasAnimated = false;

    if (!statsSection || statNumbers.length === 0) return;

    const animate = (el) => {
        const custom = el.getAttribute('data-custom');
        if (custom) { el.textContent = custom; return; }

        const target = parseInt(el.getAttribute('data-target'));
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const increment = target / (2000 / 16);
        let curr = 0;

        const update = () => {
            curr += increment;
            if (curr < target) {
                el.textContent = prefix + Math.floor(curr) + suffix;
                requestAnimationFrame(update);
            } else {
                el.textContent = prefix + target + suffix;
            }
        };
        update();
    };

    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
            hasAnimated = true;
            statNumbers.forEach(animate);
        }
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
};

// ============================================
// 4. CONTACT FORM
// ============================================

const initContactForm = () => {
    const form = document.querySelector('#contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.querySelector('#submitBtn');
        const inputs = form.querySelectorAll('.form-control');

        // Basic validation
        let isValid = true;
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                input.classList.add('is-invalid');
                isValid = false;
            }
        });

        if (!isValid) return;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Enviando...';

        try {
            await fetch('data/contact.json'); // Simulate
            showAlert('success', '¡Éxito!', 'Tu mensaje ha sido enviado correctamente.');
            form.reset();
        } catch (error) {
            showAlert('danger', 'Error', 'Hubo un problema. Intenta de nuevo.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bi bi-send me-2"></i>Enviar mensaje';
        }
    });

    inputs.forEach(input => {
        input.addEventListener('input', () => input.classList.remove('is-invalid'));
    });
};

const showAlert = (type, title, message) => {
    const alertEl = document.querySelector('#liveAlert');
    if (!alertEl) return;
    alertEl.className = `alert alert-${type} alert-dismissible fade show`;
    document.querySelector('#alertTitle').textContent = title;
    document.querySelector('#alertMessage').textContent = message;
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alertEl);
        bsAlert.close();
    }, 5000);
};

// ============================================
// 5. BACK TO TOP & SCROLL INDICATOR
// ============================================

const initBackToTop = () => {
    const btn = document.querySelector('#backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) btn.classList.add('show');
        else btn.classList.remove('show');
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
};

const initScrollIndicator = () => {
    const indicator = document.querySelector('.scroll-indicator');
    if (!indicator) return;
    indicator.addEventListener('click', () => {
        const stats = document.querySelector('#stats');
        if (stats) {
            const navbarHeight = document.querySelector('#mainNav')?.offsetHeight || 80;
            window.scrollTo({ top: stats.offsetTop - navbarHeight, behavior: 'smooth' });
        }
    });
};

// ============================================
// 6. ANIMATIONS & HERO CAROUSEL
// ============================================

const initAnimations = () => {
    const title = document.querySelector('.hero-title');
    const subtitle = document.querySelector('.hero-subtitle');
    const buttons = document.querySelector('.hero-buttons');

    if (title) title.classList.add('fade-in');
    if (subtitle) setTimeout(() => subtitle.classList.add('fade-in'), 200);
    if (buttons) setTimeout(() => buttons.classList.add('fade-in'), 400);
};

const initHeroCarousel = () => {
    const carousel = document.getElementById('heroCarousel');
    if (!carousel) return;

    const items = carousel.querySelectorAll('.hero-carousel-item');
    const indicators = carousel.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('prevHero');
    const nextBtn = document.getElementById('nextHero');

    let currentIndex = 0;
    let isTransitioning = false;
    let autoPlayInterval;

    const updateSlider = (newIndex) => {
        if (isTransitioning || newIndex === currentIndex) return;
        isTransitioning = true;
        items[currentIndex].classList.remove('active');
        indicators[currentIndex].classList.remove('active');
        currentIndex = newIndex;
        items[currentIndex].classList.add('active');
        indicators[currentIndex].classList.add('active');
        setTimeout(() => { isTransitioning = false; }, 600);
    };

    if (nextBtn) nextBtn.addEventListener('click', () => { updateSlider((currentIndex + 1) % items.length); resetAutoPlay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { updateSlider((currentIndex - 1 + items.length) % items.length); resetAutoPlay(); });

    indicators.forEach((ind, i) => ind.addEventListener('click', () => { updateSlider(i); resetAutoPlay(); }));

    const startAutoPlay = () => { autoPlayInterval = setInterval(() => updateSlider((currentIndex + 1) % items.length), 5000); };
    const resetAutoPlay = () => { clearInterval(autoPlayInterval); startAutoPlay(); };
    startAutoPlay();
};

// RUN APP
document.addEventListener('DOMContentLoaded', initApp);
