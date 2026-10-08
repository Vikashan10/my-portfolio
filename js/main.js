/* ============================================================
   main.js — Portfolio Behavior
   Sections:
   1. Preloader
   2. Navbar: scroll effect + active link tracking
   3. Mobile menu toggle
   4. Scroll-reveal animations (Intersection Observer)
   5. Project filter
   6. Contact form
   7. Scroll-to-top button
============================================================ */


/* ============================================================
   1. PRELOADER
   Hides the loading overlay once the page is fully ready.
   'load' fires after ALL resources (images, fonts) are loaded.
   'DOMContentLoaded' fires earlier — just when HTML is parsed.
   We use 'load' so the page is fully rendered before we show it.
============================================================ */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');

  // Small extra delay so the animation doesn't feel abrupt
  setTimeout(() => {
    preloader.classList.add('hidden');
  }, 600);
});


/* ============================================================
   2. NAVBAR — Scroll Effect + Active Link Highlighting
============================================================ */
const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.nav-links a');
const sections  = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // --- 2a. Add shadow to navbar after scrolling 60px ---
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // --- 2b. Highlight the nav link matching the visible section ---
  // We loop through every section and check if we've scrolled past its top.
  // The last section that passes the check is the "current" one.
  let currentSection = 'home';

  sections.forEach(section => {
    // offsetTop = distance from page top to section top
    // We subtract navHeight so it activates a bit before reaching the section
    const sectionTop = section.offsetTop - navbar.offsetHeight - 20;

    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute('id');
    }
  });

  // Remove 'active' from all links, then add to the matching one
  navLinks.forEach(link => {
    link.classList.remove('active');
    // href="#projects" → slice(1) removes "#" → "projects"
    if (link.getAttribute('href').slice(1) === currentSection) {
      link.classList.add('active');
    }
  });
});


/* ============================================================
   3. MOBILE MENU TOGGLE
   Toggles the mobile nav drawer open/closed.
   Closes automatically when a link is clicked.
============================================================ */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('open');

  // Animate hamburger to X shape
  hamburger.classList.toggle('is-open');
});

// Close when clicking any mobile nav link
document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('is-open');
  });
});


/* ============================================================
   4. SCROLL-REVEAL ANIMATIONS (Intersection Observer)

   Why IntersectionObserver instead of listening to scroll events?
   - Scroll events fire hundreds of times per second (expensive)
   - IntersectionObserver is built into the browser and fires ONLY
     when an element enters or leaves the viewport (efficient)
   - This is the modern, performant, industry-standard approach
============================================================ */

// Create the observer
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Element entered the viewport — make it visible
      entry.target.classList.add('visible');

      // Once revealed, stop watching this element (no need to re-animate)
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,  // Trigger when 12% of the element is visible
  rootMargin: '0px 0px -40px 0px'  // Trigger 40px before the bottom of viewport
});

// Immediately reveal hero elements (they're already in view on load)
document.querySelectorAll('.hero .reveal-up').forEach(el => {
  // Small delay so it plays after the preloader hides
  setTimeout(() => el.classList.add('visible'), 700);
});

// Watch all other reveal elements outside the hero
document.querySelectorAll(
  '.about .reveal-up, .section-eyebrow, .section-heading, ' +
  '.project-card, .skill-group, .about-text, .about-image-wrap, ' +
  '.contact-text, .contact-form, .learning-bar, .languages-bar, ' +
  '.experience-card, .education-card, .achievement-card'
).forEach(el => {
  el.classList.add('reveal-up'); // Ensure they start hidden
  revealObserver.observe(el);
});


/* ============================================================
   5. PROJECT FILTER
   Filters project cards by technology tag.
   When a filter button is clicked, cards that don't match
   the selected category are hidden with CSS display:none.
============================================================ */
const filterBtns  = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.getAttribute('data-filter'); // e.g. "embedded", "web"

    // Update active button state
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Show/hide cards based on their data-tags attribute
    projectCards.forEach(card => {
      const rawTags = (card.getAttribute('data-tags') || '').toLowerCase();
      const tags = rawTags.split(/\s+/);

      if (filter === 'all' || tags.includes(filter)) {
        card.style.display = 'block';
        // Small animation when re-appearing
        card.style.animation = 'none';
        card.offsetHeight; // Force reflow (browser trick to restart animation)
        card.style.animation = 'fadeIn 0.4s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });
  });
});


/* ============================================================
   6. CONTACT FORM — Opens a real email draft (no fake success)
   This static site has no email-sending backend. The visitor
   must review and send the message using their own email app.
============================================================ */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    if (!name || !email || !subject || !message) {
      alert('Please complete all fields before opening your email draft.');
      return;
    }

    const body = `From: ${name} (${email})\n\n${message}`;
    const mailto = `mailto:vikashan1003@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  });
}


/* ============================================================
   7. SCROLL-TO-TOP BUTTON
   Shows a button in the corner after scrolling 400px.
   Clicking it smoothly scrolls back to the top.
============================================================ */
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ============================================================
   CSS ANIMATION: fadeIn (used by project filter)
   We inject this via JS because it's only needed for the filter.
============================================================ */
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);