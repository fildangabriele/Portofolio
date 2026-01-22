// Main UI behaviors: image loading hints, sliders, ratings, nav state.
document.addEventListener('DOMContentLoaded', () => {
  // Add loading optimizations to images
  const images = Array.from(document.querySelectorAll('img'));
  images.forEach((img, index) => {
    if (!img.hasAttribute('decoding')) {
      img.decoding = 'async';
    }
    if (!img.hasAttribute('loading') && index > 0) {
      img.loading = 'lazy';
    }
  });

  // Honor OS reduced-motion preference; skip autoplay if set
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Basic auto-advancing sliders
  const sliderBlocks = Array.from(document.querySelectorAll('.slider'));

  sliderBlocks.forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const dots = Array.from(slider.querySelectorAll('.dot'));
    const tabs = Array.from(slider.querySelectorAll('.slider-tab'));
    // Prefer custom .slider-tab if present, otherwise use dots
    const controls = tabs.length ? tabs : dots;

    if (!slides.length || !controls.length || controls.length !== slides.length) return;

    // Track current slide index and autoplay timer
    let current = 0;
    let timer = null;

    // Clears any running interval
    const stopAutoPlay = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    // Switch active slide and control
    const setSlide = (index) => {
      slides[current].classList.remove('is-active');
      controls[current].classList.remove('is-active');
      current = index;
      slides[current].classList.add('is-active');
      controls[current].classList.add('is-active');
    };

    const nextSlide = () => {
      const next = (current + 1) % slides.length;
      setSlide(next);
    };

    // Start/refresh interval unless user prefers less motion
    const startAutoPlay = () => {
      if (prefersReducedMotion || slides.length < 2) return;
      stopAutoPlay();
      timer = window.setInterval(nextSlide, 5000);
    };

    // Click handlers for dots/tabs
    controls.forEach((ctrl, index) => {
      ctrl.dataset.index = String(index);
      ctrl.addEventListener('click', () => {
        stopAutoPlay();
        setSlide(index);
        startAutoPlay();
      });
    });

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAutoPlay();
      } else {
        startAutoPlay();
      }
    };

    setSlide(0);
    startAutoPlay();
    document.addEventListener('visibilitychange', handleVisibilityChange);
  });

  // Star rating interaction on recenzii page
  const starButtons = document.querySelectorAll('.star-btn');
  const ratingInput = document.querySelector('#rating');
  const feedbackForm = document.querySelector('.feedback-form--banner');
  const messageTextarea = document.querySelector('#mesaj');

  if (starButtons.length > 0) {
    let currentRating = 5;

    // Paint stars up to chosen value
    const setRating = (value) => {
      currentRating = value;
      if (ratingInput) {
        ratingInput.value = String(value);
      }
      
      starButtons.forEach((btn) => {
        const btnValue = Number(btn.dataset.value);
        btn.classList.remove('is-active', 'is-hover');
        if (btnValue <= value) {
          btn.classList.add('is-active');
        }
      });
    };

    // Click to set rating; hover to preview
    starButtons.forEach((btn) => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const clickedValue = Number(this.dataset.value);
        setRating(clickedValue);
      });

      btn.addEventListener('mouseenter', function() {
        const hoverValue = Number(this.dataset.value);
        starButtons.forEach((b) => {
          const btnValue = Number(b.dataset.value);
          if (btnValue <= hoverValue) {
            b.classList.add('is-hover');
          }
        });
      });

      btn.addEventListener('mouseleave', function() {
        starButtons.forEach((b) => {
          b.classList.remove('is-hover');
        });
      });
    });

    // Default to 5 stars selected
    setRating(5);
  }

  // Simple form validation for feedback
  if (feedbackForm && messageTextarea) {
    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const message = messageTextarea.value.trim();
      const rating = ratingInput ? ratingInput.value : '0';

      if (message === '') {
        alert('Te rugăm să scrii o recenzie înainte de a trimite.');
        messageTextarea.focus();
        return;
      }

      if (message.length < 10) {
        alert('Recenzia ta trebuie să conțină cel puțin 10 caractere.');
        messageTextarea.focus();
        return;
      }

      if (rating === '0') {
        alert('Te rugăm să selectezi un rating cu stele.');
        return;
      }

      // Success
      alert(`Mulțumim pentru recenzia ta de ${rating} stele!`);
      messageTextarea.value = '';
      
      // Reset to 5 stars
      if (starButtons.length > 0) {
        starButtons.forEach((btn) => {
          const btnValue = Number(btn.dataset.value);
          btn.classList.remove('is-active', 'is-hover');
          if (btnValue <= 5) {
            btn.classList.add('is-active');
          }
        });
        if (ratingInput) {
          ratingInput.value = '5';
        }
      }
    });
  }

  // Highlight the current page link in the nav
  const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  const navToggle = document.querySelector('.nav-toggle');
  const navLinksContainer = document.querySelector('.nav-links');

  if (navLinks.length) {
    const currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

    // Mark the link whose href filename matches the current page
    navLinks.forEach((link) => {
      const linkPage = new URL(link.getAttribute('href'), window.location.href)
        .pathname
        .split('/')
        .pop()
        .toLowerCase();

      if (linkPage === currentPage) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  // Mobile nav toggle
  if (navToggle && navLinksContainer) {
    // Toggle dropdown state when burger is clicked
    navToggle.addEventListener('click', () => {
      const isOpen = navLinksContainer.classList.toggle('is-open');
      document.body.classList.toggle('nav-open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close dropdown after navigating
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('is-open');
        document.body.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Contact form validation
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get form values
      const nume = document.querySelector('#nume').value.trim();
      const prenume = document.querySelector('#prenume').value.trim();
      const email = document.querySelector('#email').value.trim();
      const telefon = document.querySelector('#telefon').value.trim();
      const mesaj = document.querySelector('#mesaj').value.trim();
      const checkboxes = Array.from(document.querySelectorAll('input[name="servicii"]'));
      const atLeastOneChecked = checkboxes.some(cb => cb.checked);

      // Validation rules
      let errors = [];

      if (nume === '') {
        errors.push('Te rugăm să completezi câmpul "Nume".');
      }

      if (prenume === '') {
        errors.push('Te rugăm să completezi câmpul "Prenume".');
      }

      if (email === '') {
        errors.push('Te rugăm să completezi câmpul "Email".');
      } else if (!isValidEmail(email)) {
        errors.push('Te rugăm să introduci o adresă de email validă.');
      }

      if (telefon === '') {
        errors.push('Te rugăm să completezi câmpul "Număr de telefon".');
      } else if (!isValidPhone(telefon)) {
        errors.push('Te rugăm să introduci un număr de telefon valid.');
      }

      if (!atLeastOneChecked) {
        errors.push('Te rugăm să selectezi cel puțin un serviciu.');
      }

      if (mesaj === '') {
        errors.push('Te rugăm să completezi câmpul "Cu ce te pot ajuta?".');
      } else if (mesaj.length < 10) {
        errors.push('Mesajul trebuie să conțină cel puțin 10 caractere.');
      }

      // Show errors or success
      if (errors.length > 0) {
        alert(errors.join('\n'));
        return;
      }

      // Success
      alert('Mulțumim! Formularul a fost trimis cu succes. Te vom contacta în curând!');
      contactForm.reset();
    });

    // Helper functions for validation
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    function isValidPhone(phone) {
      const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
      return phoneRegex.test(phone);
    }
  }
});
