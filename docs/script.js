/**
 * Portfolio — Hicham Ouaouche
 * script.js — Interactive features & animations
 */

'use strict';

/* =========================================================
   1) DOM READY HELPER
   ========================================================= */
const ready = (fn) => {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
};

ready(() => {
  initProgressBar();
  initNavScroll();
  initMobileMenu();
  initActiveNav();
  initScrollReveal();
  initTyped();
  initTimelineReveal();
  initScrollTop();
  initContactForm();
  initStatCounters();
  initTagHover();
});

/* =========================================================
   2) READING PROGRESS BAR
   ========================================================= */
function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const max = document.body.scrollHeight - window.innerHeight;
    bar.style.width = max > 0 ? `${(scrolled / max) * 100}%` : '0%';
  }, { passive: true });
}

/* =========================================================
   3) NAV SCROLL EFFECT (glassmorphism on scroll)
   ========================================================= */
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const update = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* =========================================================
   4) MOBILE HAMBURGER MENU
   ========================================================= */
function initMobileMenu() {
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* =========================================================
   5) ACTIVE NAV LINK (IntersectionObserver)
   ========================================================= */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !links.length) return;

  const activate = (id) => {
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) activate(entry.target.id);
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach(s => observer.observe(s));
}

/* =========================================================
   6) SCROLL REVEAL (generic .reveal elements)
   ========================================================= */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach(el => observer.observe(el));
}

/* =========================================================
   7) TYPED EFFECT (hero subtitle)
   ========================================================= */
function initTyped() {
  const target = document.getElementById('typed-text');
  if (!target) return;

  const phrases = [
    'Cybersecurity Expert',
    'AI/ML Enthusiast',
    'Penetration Tester',
    'Distributed Systems Engineer',
    'Open to Opportunities'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let paused = false;

  const TYPING_SPEED   = 70;
  const DELETING_SPEED = 35;
  const PAUSE_TIME     = 1800;

  function type() {
    if (paused) return;

    const phrase = phrases[phraseIdx];

    if (!deleting) {
      target.textContent = phrase.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === phrase.length) {
        paused = true;
        setTimeout(() => { paused = false; deleting = true; tick(); }, PAUSE_TIME);
        return;
      }
    } else {
      target.textContent = phrase.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    tick();
  }

  function tick() {
    setTimeout(type, deleting ? DELETING_SPEED : TYPING_SPEED);
  }

  tick();
}

/* =========================================================
   8) TIMELINE ITEMS REVEAL
   ========================================================= */
function initTimelineReveal() {
  const items = document.querySelectorAll('.timeline-item');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  items.forEach(item => observer.observe(item));
}

/* =========================================================
   9) SCROLL TO TOP BUTTON
   ========================================================= */
function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =========================================================
   10) CONTACT FORM (validation + toast feedback)
   ========================================================= */
function initContactForm() {
  const form = document.querySelector('.contact-form-simple');
  if (!form) return;

  // Create toast if not present
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }

  const showToast = (msg, isError = false) => {
    toast.textContent = msg;
    toast.style.borderColor = isError ? '#ff5f6d' : 'rgba(79,138,255,0.35)';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  };

  form.addEventListener('submit', (e) => {
    // Basic validation feedback before mailto fires
    const name  = form.querySelector('#full-name');
    const email = form.querySelector('#email');
    const msg   = form.querySelector('#message');

    if (!name.value.trim()) {
      e.preventDefault();
      showToast('⚠️ Please enter your full name.', true);
      name.focus();
      return;
    }
    if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      e.preventDefault();
      showToast('⚠️ Please enter a valid email address.', true);
      email.focus();
      return;
    }
    if (!msg.value.trim() || msg.value.trim().length < 10) {
      e.preventDefault();
      showToast('⚠️ Message must be at least 10 characters.', true);
      msg.focus();
      return;
    }

    showToast('✅ Message on its way — thank you!');
  });

  // Live field focus glow
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('focus', () => field.classList.add('focused'));
    field.addEventListener('blur',  () => field.classList.remove('focused'));
  });
}

/* =========================================================
   11) ANIMATED STAT COUNTERS
   ========================================================= */
function initStatCounters() {
  const stats = document.querySelectorAll('.stat-num');
  if (!stats.length) return;

  const parseTarget = (el) => {
    const text = el.textContent.trim();
    const num  = parseInt(text.replace(/\D/g, ''), 10);
    const suffix = text.replace(/[\d]/g, '');
    return { num, suffix };
  };

  const animateCounter = (el, target, suffix, duration = 1200) => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const { num, suffix } = parseTarget(el);
          el.textContent = '0' + suffix;
          animateCounter(el, num, suffix);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach(stat => observer.observe(stat));
}

/* =========================================================
   12) SKILL TAG RIPPLE / HOVER EFFECT
   ========================================================= */
function initTagHover() {
  document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('mouseenter', function () {
      this.style.setProperty('--scale', '1.08');
    });
    tag.addEventListener('mouseleave', function () {
      this.style.removeProperty('--scale');
    });
  });
}

/* =========================================================
   13) PROJECT CARD TILT EFFECT (subtle)
   ========================================================= */
(function initCardTilt() {
  const cards = document.querySelectorAll('.project-card, .about-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const maxTilt = 4;
      const rx = -(y / (rect.height / 2)) * maxTilt;
      const ry =  (x / (rect.width  / 2)) * maxTilt;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
})();
