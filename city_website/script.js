/**
 * Bergamo Tourism Website - Main JavaScript
 * Apple-inspired modern design with smooth interactions
 * 
 * Features:
 * - Form validation with error handling
 * - Mobile responsive navigation
 * - Automatic carousel functionality
 */

// ============================================================================
// CONSTANTS & REGEX PATTERNS
// ============================================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;

// ============================================================================
// FORM VALIDATION
// ============================================================================

/**
 * Clear all error messages from a form
 * @param {HTMLFormElement} form - The form to clear errors from
 */
function clearFormErrors(form) {
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(msg => {
        msg.textContent = '';
        msg.style.display = 'none';
    });
}

/**
 * Display an error message for a specific field
 * @param {string} fieldId - The ID of the form field
 * @param {string} message - The error message to display
 */
function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + '-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

/**
 * Validate contact form fields
 * @param {HTMLFormElement} form - The contact form to validate
 * @returns {boolean} True if form is valid, false otherwise
 */
function validateContactForm(form) {
    clearFormErrors(form);
    let isValid = true;

    // Validate name field
    const name = document.getElementById('name').value.trim();
    if (name === '') {
        showError('name', 'Introdu un nume');
        isValid = false;
    } else if (name.length < 2) {
        showError('name', 'Numele trebuie să conțină cel puțin 2 caractere');
        isValid = false;
    }

    // Validate email field
    const email = document.getElementById('email').value.trim();
    if (email === '') {
        showError('email', 'Introdu o adresă de email');
        isValid = false;
    } else if (!EMAIL_REGEX.test(email)) {
        showError('email', 'Introdu o adresă de email validă');
        isValid = false;
    }

    // Validate message field
    const message = document.getElementById('message').value.trim();
    if (message === '') {
        showError('message', 'Introdu un mesaj');
        isValid = false;
    } else if (message.length < 5) {
        showError('message', 'Mesajul trebuie să conțină cel puțin 5 caractere');
        isValid = false;
    }

    return isValid;
}

/**
 * Validate reservation form fields
 * @param {HTMLFormElement} form - The reservation form to validate
 * @returns {boolean} True if form is valid, false otherwise
 */
function validateReservationForm(form) {
    clearFormErrors(form);
    let isValid = true;

    // Validate last name
    const nume = document.getElementById('nume')?.value.trim() || '';
    if (nume === '') {
        showError('nume', 'Introdu un nume');
        isValid = false;
    } else if (nume.length < 2) {
        showError('nume', 'Numele trebuie să conțină cel puțin 2 caractere');
        isValid = false;
    }

    // Validate first name
    const prenume = document.getElementById('prenume')?.value.trim() || '';
    if (prenume === '') {
        showError('prenume', 'Introdu un prenume');
        isValid = false;
    } else if (prenume.length < 2) {
        showError('prenume', 'Prenumele trebuie să conțină cel puțin 2 caractere');
        isValid = false;
    }

    // Validate email
    const email = document.getElementById('email')?.value.trim() || '';
    if (email === '') {
        showError('email', 'Introdu o adresă de email');
        isValid = false;
    } else if (!EMAIL_REGEX.test(email)) {
        showError('email', 'Introdu o adresă de email validă');
        isValid = false;
    }

    // Validate phone
    const telefon = document.getElementById('telefon')?.value.trim() || '';
    if (telefon === '') {
        showError('telefon', 'Introdu un număr de telefon');
        isValid = false;
    } else if (!PHONE_REGEX.test(telefon)) {
        showError('telefon', 'Introdu un număr de telefon valid');
        isValid = false;
    }

    // Validate check-in date
    const checkIn = document.getElementById('check-in')?.value || '';
    if (checkIn === '') {
        showError('check-in', 'Selectează data de check-in');
        isValid = false;
    }

    // Validate check-out date
    const checkOut = document.getElementById('check-out')?.value || '';
    if (checkOut === '') {
        showError('check-out', 'Selectează data de check-out');
        isValid = false;
    }

    if (checkIn && checkOut && checkOut <= checkIn) {
        showError('check-out', 'Data de check-out trebuie să fie după check-in');
        isValid = false;
    }

    // Validate number of guests
    const nrPersoane = document.getElementById('nr-persoane')?.value || '';
    if (nrPersoane === '' || nrPersoane < 1) {
        showError('nr-persoane', 'Selectează numărul de persoane');
        isValid = false;
    }

    // Validate room type
    const tipCamera = document.getElementById('tip-camera')?.value || '';
    if (tipCamera === '') {
        showError('tip-camera', 'Selectează tipul de cameră');
        isValid = false;
    }

    // Validate terms acceptance
    const termeni = document.getElementById('termeni')?.checked || false;
    if (!termeni) {
        showError('termeni', 'Trebuie să accepți termenii și condițiile');
        isValid = false;
    }

    return isValid;
}

/**
 * Initialize contact form submission handler
 */
function initContactFormValidation() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            if (validateContactForm(this)) {
                const name = document.getElementById('name').value.trim();
                alert('Mulțumim, ' + name + '! Mesajul a fost trimis cu succes.');
                this.reset();
                clearFormErrors(this);
            }
        });
    }
}

/**
 * Initialize reservation form submission handlers
 */
function initReservationFormValidation() {
    const reservationForms = document.querySelectorAll('.reservation-form');
    reservationForms.forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            if (validateReservationForm(this)) {
                const nume = document.getElementById('nume').value.trim();
                alert('Mulțumim, ' + nume + '! Rezervarea a fost transmisă cu succes.');
                this.reset();
                clearFormErrors(this);
            }
        });
    });
}

// ============================================================================
// NAVIGATION & MENU MANAGEMENT
// ============================================================================

const hamburgerBtn = document.getElementById('hamburger-btn');
let navElement = document.querySelector('nav');
const navMenu = document.getElementById('nav-menu');

// If nav doesn't exist but nav-menu does, create a nav wrapper
if (!navElement && navMenu) {
    navElement = document.createElement('nav');
    navMenu.parentNode.insertBefore(navElement, navMenu);
    navElement.appendChild(navMenu);
}

/**
 * Setup hamburger menu for mobile navigation
 */
function initHamburgerMenu() {
    if (!hamburgerBtn || !navMenu || !navElement) return;

    hamburgerBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const isActive = navElement.classList.toggle('active');
        navMenu.classList.toggle('active');
        hamburgerBtn.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't close for dropdown buttons
            if (!this.classList.contains('dropbtn')) {
                navElement.classList.remove('active');
                navMenu.classList.remove('active');
                hamburgerBtn.classList.remove('active');
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('nav') && !e.target.closest('.hamburger')) {
            if (navElement.classList.contains('active')) {
                navElement.classList.remove('active');
                navMenu.classList.remove('active');
                hamburgerBtn.classList.remove('active');
            }
        }
    });
}

/**
 * Mark the currently active menu link based on the page URL
 */
function markActiveMenuLink() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'pagina_principala.html';
    
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        const href = link.getAttribute('href');
        if (href) {
            const hrefPage = href.split('/').pop();
            
            if (hrefPage === currentPage ||
                ((currentPage === '' || currentPage === 'index.html') && hrefPage === 'pagina_principala.html')) {
                link.classList.add('active');
            }
        }
    });
}

/**
 * Handle navigation visibility on window resize
 */
function handleResizeNav() {
    if (!navMenu) return;
    
    if (window.innerWidth >= 600) {
        navMenu.style.display = 'flex';
        navMenu.style.maxHeight = 'none';
        navMenu.classList.remove('active');
        if (hamburgerBtn) hamburgerBtn.classList.remove('active');
    } else {
        navMenu.style.display = 'none';
        navMenu.style.maxHeight = '0';
    }
}

// ============================================================================
// CAROUSEL FUNCTIONALITY
// ============================================================================

let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const carouselContainer = document.querySelector('.carousel-container');
let carouselInterval = null;

/**
 * Display a specific slide in the carousel
 * @param {number} n - The index of the slide to show
 */
function showSlide(n) {
    if (slides.length === 0) return;
    
    if (n >= slides.length) currentSlide = 0;
    if (n < 0) currentSlide = slides.length - 1;
    
    slides.forEach(slide => slide.classList.remove('active'));
    slides[currentSlide].classList.add('active');
}

/**
 * Navigate to the next slide
 */
function nextSlide() {
    currentSlide++;
    showSlide(currentSlide);
}

/**
 * Navigate to the previous slide
 */
function prevSlide() {
    currentSlide--;
    showSlide(currentSlide);
}

/**
 * Start automatic carousel rotation on desktop
 */
function startAutoCarousel() {
    if (!carouselContainer || window.innerWidth < 1024) return;
    
    carouselInterval = setInterval(() => {
        nextSlide();
    }, 5000);
}

/**
 * Stop automatic carousel rotation
 */
function stopAutoCarousel() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
        carouselInterval = null;
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize all event listeners and functionality
 */
function initializeApp() {
    // Setup forms
    initContactFormValidation();
    initReservationFormValidation();
    
    // Setup navigation
    markActiveMenuLink();
    initHamburgerMenu();
    handleResizeNav();
    
    // Setup carousel
    if (carouselContainer && slides.length > 0) {
        showSlide(currentSlide);
        startAutoCarousel();
    }
    
    // Setup window resize handler
    window.addEventListener('resize', () => {
        handleResizeNav();
        
        if (window.innerWidth >= 1024) {
            if (carouselContainer) carouselContainer.style.display = 'block';
            startAutoCarousel();
        } else {
            if (carouselContainer) carouselContainer.style.display = 'none';
            stopAutoCarousel();
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
