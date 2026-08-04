/* ============================================================
   SAPPURISADHAMMA 7 — Interaction & Scrollytelling
   Organic timing · Soft easing · Spatial nav
   ============================================================ */

(() => {
  'use strict';

  // ---------- Elements ----------
  const progressBar = document.getElementById('progress');
  const guidance = document.getElementById('guidance');
  const dots = document.querySelectorAll('.spatial-nav__dot');
  const sections = document.querySelectorAll('[data-section]');
  const reveals = document.querySelectorAll('.reveal');
  const orbs = document.querySelectorAll('[data-parallax]');
  const startBtn = document.getElementById('startBtn');

  // ---------- Hero entrance ----------
  const heroEls = [
    document.querySelector('.hero__eyebrow'),
    document.querySelector('.hero__title'),
    document.querySelector('.hero__lead'),
    document.querySelector('.hero__cta')
  ];

  function animateHero() {
    heroEls.forEach((el, i) => {
      if (!el) return;
      setTimeout(() => {
        el.style.transition = `opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)`;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 180 + i * 160);
    });
  }

  // ---------- Progress ----------
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${pct}%`;
    progressBar.setAttribute('aria-valuenow', Math.round(pct));
  }

  // ---------- Guidance visibility ----------
  function updateGuidance() {
    if (window.scrollY > 80) {
      guidance.classList.add('is-hidden');
    } else {
      guidance.classList.remove('is-hidden');
    }
  }

  // ---------- Active section + dots ----------
  function updateActiveSection() {
    const mid = window.scrollY + window.innerHeight * 0.4;
    let currentId = 'hero';

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      if (mid >= top && mid < bottom) {
        currentId = sec.id;
      }
    });

    dots.forEach(dot => {
      const isActive = dot.dataset.target === currentId;
      dot.classList.toggle('is-active', isActive);
    });
  }

  // ---------- Reveal on scroll ----------
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          // slight delay feel for organic
          entry.target.style.transitionDelay = '0.08s';
        }
      });
    },
    { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
  );

  reveals.forEach(el => revealObserver.observe(el));

  // ---------- Soft parallax for ambient orbs ----------
  let ticking = false;
  function updateParallax() {
    const scrollY = window.scrollY;
    orbs.forEach(orb => {
      const speed = parseFloat(orb.dataset.parallax) || 0.1;
      const y = scrollY * speed;
      orb.style.transform = `translate3d(0, ${y}px, 0)`;
    });
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        updateGuidance();
        updateActiveSection();
        updateParallax();
      });
      ticking = true;
    }
  }

  // ---------- Spatial nav click ----------
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = document.getElementById(dot.dataset.target);
      if (!target) return;
      const top = target.offsetTop;
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    });
  });

  // ---------- Start button ----------
  if (startBtn) {
    startBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const intro = document.getElementById('intro');
      if (intro) {
        window.scrollTo({ top: intro.offsetTop, behavior: 'smooth' });
      }
    });
  }

  // ---------- Soft snap (optional gentle assist) ----------
  // We keep native smooth scroll; no hard scroll-jacking for better feel & a11y

  // ---------- Init ----------
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Initial state
  updateProgress();
  updateGuidance();
  updateActiveSection();
  animateHero();

  // Prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroEls.forEach(el => {
      if (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      }
    });
    reveals.forEach(el => el.classList.add('is-in'));
  }
})();