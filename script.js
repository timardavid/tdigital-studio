/**
 * TDigital Studio - Main JavaScript
 * Handles navigation, scroll effects, parallax, and animations
 */

// ============================================
// DOM ELEMENTS
// ============================================
const header = document.getElementById('header');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');
const heroParallax = document.getElementById('hero-parallax');
const contactForm = document.getElementById('contact-form');
const animatedElements = document.querySelectorAll('.animate-on-scroll');

// ============================================
// STICKY NAVIGATION
// ============================================
/**
 * Adds/removes 'scrolled' class to header based on scroll position
 * Header becomes solid white with shadow when scrolled past threshold
 */
function handleStickyNav() {
    const scrollThreshold = 100;

    if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Throttled scroll handler for performance
let ticking = false;
function onScroll() {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            handleStickyNav();
            handleParallax();
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', onScroll);

// ============================================
// MOBILE NAVIGATION
// ============================================
/**
 * Toggles mobile navigation menu
 */
function toggleMobileMenu() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');

    // Prevent body scroll when menu is open
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

navToggle.addEventListener('click', toggleMobileMenu);

/**
 * Closes mobile menu when a nav link is clicked
 */
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
});

/**
 * Close mobile menu on escape key
 */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
});

// ============================================
// ACTIVE NAVIGATION LINK
// ============================================
/**
 * Updates active navigation link based on current scroll position
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + header.offsetHeight + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// ============================================
// PARALLAX EFFECT
// ============================================
/**
 * Creates parallax scrolling effect on hero background
 * The background moves at a slower rate than the scroll
 */
function handleParallax() {
    if (!heroParallax) return;

    const scrolled = window.scrollY;
    const rate = scrolled * 0.3; // Parallax speed factor

    // Only apply parallax when hero is visible
    if (scrolled < window.innerHeight) {
        heroParallax.style.transform = `translateY(${rate}px)`;
    }
}

// ============================================
// SCROLL ANIMATIONS (Intersection Observer)
// ============================================
/**
 * Initializes Intersection Observer for scroll-triggered animations
 * Elements with 'animate-on-scroll' class will fade in when visible
 */
function initScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback: show all elements immediately
        animatedElements.forEach(el => el.classList.add('visible'));
        return;
    }

    const observerOptions = {
        root: null, // Use viewport as root
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before element is fully visible
        threshold: 0.1 // Trigger when 10% of element is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
/**
 * Handles smooth scrolling for anchor links
 * Accounts for fixed header height
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            const headerOffset = header.offsetHeight;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// ============================================
// CONTACT FORM HANDLING
// ============================================
/**
 * Handles contact form submission
 * Currently shows a demo alert - replace with actual form submission logic
 */
function initContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // Validate form
        if (!validateForm(data)) return;

        // Simulate form submission
        // In production, replace this with actual API call
        simulateFormSubmission(data);
    });
}

/**
 * Basic form validation
 * @param {Object} data - Form data object
 * @returns {boolean} - Whether form is valid
 */
function validateForm(data) {
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!data.name || data.name.trim().length < 2) {
        showFormMessage('Please enter your name.', 'error');
        return false;
    }

    if (!data.email || !emailRegex.test(data.email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return false;
    }

    if (!data.message || data.message.trim().length < 10) {
        showFormMessage('Please enter a message (at least 10 characters).', 'error');
        return false;
    }

    return true;
}

/**
 * Simulates form submission with loading state
 * @param {Object} data - Form data object
 */
function simulateFormSubmission(data) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Simulate API delay
    setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        // Show success message
        showFormMessage('Thank you! Your message has been sent successfully.', 'success');

        // Reset form
        contactForm.reset();

        // Log data (for demo purposes)
        console.log('Form submitted:', data);
    }, 1500);
}

/**
 * Shows a temporary message below the form
 * @param {string} message - Message to display
 * @param {string} type - 'success' or 'error'
 */
function showFormMessage(message, type) {
    // Remove existing message if any
    const existingMessage = contactForm.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message--${type}`;
    messageEl.textContent = message;

    // Style the message
    messageEl.style.cssText = `
        padding: 1rem;
        margin-top: 1rem;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        text-align: center;
        background-color: ${type === 'success' ? '#d1fae5' : '#fee2e2'};
        color: ${type === 'success' ? '#065f46' : '#991b1b'};
        border: 1px solid ${type === 'success' ? '#a7f3d0' : '#fecaca'};
    `;

    // Append to form
    contactForm.appendChild(messageEl);

    // Remove message after 5 seconds
    setTimeout(() => {
        messageEl.remove();
    }, 5000);
}

// ============================================
// UTILITIES
// ============================================

/**
 * Debounce function to limit function execution rate
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
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

/**
 * Throttle function to limit function execution rate
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// INITIALIZATION
// ============================================
/**
 * Initialize all functionality when DOM is ready
 */
function init() {
    // Initialize all features
    initScrollAnimations();
    initSmoothScroll();
    initContactForm();

    // Run initial checks
    handleStickyNav();
    updateActiveNavLink();

    // Add loaded class to body for potential CSS transitions
    document.body.classList.add('loaded');

    console.log('TDigital Studio - Website initialized successfully');
}

// Run initialization when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ============================================
// OPTIONAL: PRELOADER
// ============================================
/**
 * Simple preloader handler (if you add a preloader element)
 * Uncomment and add corresponding HTML/CSS if needed
 */
/*
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});
*/
