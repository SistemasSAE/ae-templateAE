/**
 * ============================================
 * ASISTESCOLAR - LANDING PAGE
 * Main JavaScript File
 * ============================================
 */

// ============================================
// 1. NAVBAR SCROLL EFFECT & ACTIVE SECTION
// ============================================

const navbar = document.querySelector('#mainNav');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Highlight active section in navbar using IntersectionObserver
const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
};

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('id');

            // Remove active class from all nav links
            navLinks.forEach(link => {
                link.classList.remove('active');
            });

            // Add active class to corresponding nav link
            const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// ============================================
// 2. SMOOTH SCROLL FOR NAVIGATION
// ============================================

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        // Only prevent default if it's an anchor link
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    navbarToggler.click();
                }
            }
        }
    });
});

// ============================================
// 3. STATS COUNTER ANIMATION
// ============================================

const statNumbers = document.querySelectorAll('.stat-number');
let hasAnimated = false;

const animateCounter = (element) => {
    // Check if it's a custom value (like "3/7")
    const customValue = element.getAttribute('data-custom');
    if (customValue) {
        // No animation for custom values, just display them
        element.textContent = customValue;
        return;
    }

    const target = parseInt(element.getAttribute('data-target'));
    const prefix = element.getAttribute('data-prefix') || '';
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
        current += increment;

        if (current < target) {
            element.textContent = prefix + Math.floor(current) + suffix;
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = prefix + target + suffix;
        }
    };

    updateCounter();
};

// Trigger animation when stats section is visible
const statsSection = document.querySelector('#stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                statNumbers.forEach(stat => animateCounter(stat));
            }
        });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
}

// ============================================
// 4. CONTACT FORM VALIDATION & SUBMISSION
// ============================================

const contactForm = document.querySelector('#contactForm');
const submitBtn = document.querySelector('#submitBtn');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form fields
        const nameInput = document.querySelector('#name');
        const emailInput = document.querySelector('#email');
        const messageInput = document.querySelector('#message');
        const institutionInput = document.querySelector('#institution');

        // Reset validation states
        [nameInput, emailInput, messageInput].forEach(input => {
            input.classList.remove('is-invalid');
        });

        // Validation flags
        let isValid = true;

        // Validate name (at least 2 characters)
        if (nameInput.value.trim().length < 2) {
            nameInput.classList.add('is-invalid');
            isValid = false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            emailInput.classList.add('is-invalid');
            isValid = false;
        }

        // Validate message (at least 10 characters)
        if (messageInput.value.trim().length < 10) {
            messageInput.classList.add('is-invalid');
            isValid = false;
        }

        // If validation fails, stop here
        if (!isValid) {
            return;
        }

        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Enviando...';

        // Prepare data
        const formData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            institution: institutionInput.value.trim(),
            message: messageInput.value.trim(),
            timestamp: new Date().toISOString()
        };

        try {
            // Simulate API call using fetch to local JSON
            const response = await fetch('data/contact.json', {
                method: 'GET', // Using GET since we can't POST to a static file
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // Show success alert
            showAlert('success', '¡Éxito!', data.message || 'Tu mensaje ha sido enviado correctamente. Te contactaremos pronto.');

            // Reset form
            contactForm.reset();

            // Log form data to console (in real scenario, this would be sent to server)
            console.log('Form data submitted:', formData);

        } catch (error) {
            // Show error alert
            showAlert('danger', 'Error', 'Hubo un problema al enviar tu mensaje. Por favor, intenta nuevamente.');
            console.error('Error submitting form:', error);
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bi bi-send me-2"></i>Enviar mensaje';
        }
    });
}

// ============================================
// 5. SHOW BOOTSTRAP ALERT
// ============================================

function showAlert(type, title, message) {
    const alertElement = document.querySelector('#liveAlert');
    const alertTitle = document.querySelector('#alertTitle');
    const alertMessage = document.querySelector('#alertMessage');

    // Set alert type
    alertElement.className = `alert alert-${type} alert-dismissible fade show`;

    // Set content
    alertTitle.textContent = title;
    alertMessage.textContent = message;

    // Auto-hide after 5 seconds
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alertElement);
        bsAlert.close();
    }, 5000);
}

// ============================================
// 6. BACK TO TOP BUTTON
// ============================================

const backToTopBtn = document.querySelector('#backToTop');

// Show/hide button based on scroll position
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

// Scroll to top when button is clicked
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ============================================
// 7. SCROLL INDICATOR (HERO SECTION)
// ============================================

const scrollIndicator = document.querySelector('.scroll-indicator');

if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const statsSection = document.querySelector('#stats');
        if (statsSection) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = statsSection.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
}

// ============================================
// 8. REMOVE VALIDATION ON INPUT
// ============================================

const formInputs = document.querySelectorAll('.form-control');

formInputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) {
            input.classList.remove('is-invalid');
        }
    });
});

// ============================================
// 9. INITIALIZE ON DOM CONTENT LOADED
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('AsistEscolar Landing Page - Loaded Successfully');

    // Add fade-in animation to hero content
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');

    if (heroTitle) heroTitle.classList.add('fade-in');
    if (heroSubtitle) {
        setTimeout(() => heroSubtitle.classList.add('fade-in'), 200);
    }
    if (heroButtons) {
        setTimeout(() => heroButtons.classList.add('fade-in'), 400);
    }
});

// ============================================
// 10. PERFORMANCE OPTIMIZATION
// ============================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Use debounced scroll for better performance
const optimizedScroll = debounce(() => {
    // Additional scroll-based logic can go here if needed
}, 100);

window.addEventListener('scroll', optimizedScroll);