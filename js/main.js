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

  // ---------- Active section + dots + pager ----------
  let activeIndex = -1;

  function updateActiveSection() {
    const mid = window.scrollY + window.innerHeight * 0.4;
    let idx = 0;

    sections.forEach((sec, i) => {
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      if (mid >= top && mid < bottom) {
        idx = i;
      }
    });

    if (idx === activeIndex) return;
    activeIndex = idx;

    const currentId = sections[idx].id;
    dots.forEach(dot => {
      dot.classList.toggle('is-active', dot.dataset.target === currentId);
    });
    updatePager(idx, currentId);
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

  // ---------- Fixed pager (prev / next / back-to-start) ----------
  const pager = document.getElementById('pager');
  const pagerPrev = document.getElementById('pagerPrev');
  const pagerNext = document.getElementById('pagerNext');
  const pagerNextLabel = document.getElementById('pagerNextLabel');
  const pagerNextIcon = document.getElementById('pagerNextIcon');

  const arrowRightSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M19 12l-6-6M19 12l-6 6"/></svg>';
  const homeSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12l9-9 9 9"/><path d="M9 21V12h6v9"/></svg>';

  function goToIndex(i) {
    const clamped = Math.max(0, Math.min(sections.length - 1, i));
    const target = sections[clamped];
    if (target) window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
  }

  // Reflect current section into the pager (called only when index changes)
  function updatePager(index, id) {
    if (id === 'hero') {
      pager.classList.remove('is-visible');
      return;
    }
    pager.classList.add('is-visible');

    // prev is always usable (goes toward hero); dim it at the very first step
    pagerPrev.dataset.edge = index <= 1 ? 'start' : '';

    const isLast = index === sections.length - 1;
    if (isLast && !pagerNext.classList.contains('is-home')) {
      pagerNext.classList.add('is-home');
      pagerNext.setAttribute('aria-label', 'กลับไปหน้าแรก');
      pagerNextLabel.textContent = 'หน้าแรก';
      pagerNextIcon.innerHTML = homeSvg;
    } else if (!isLast && pagerNext.classList.contains('is-home')) {
      pagerNext.classList.remove('is-home');
      pagerNext.setAttribute('aria-label', 'ถัดไป');
      pagerNextLabel.textContent = 'ถัดไป';
      pagerNextIcon.innerHTML = arrowRightSvg;
    }
  }

  pagerPrev.addEventListener('click', () => goToIndex(activeIndex - 1));
  pagerNext.addEventListener('click', () => {
    if (activeIndex >= sections.length - 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      goToIndex(activeIndex + 1);
    }
  });

  // Keyboard navigation for presentation use (← / →)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      e.preventDefault();
      goToIndex(activeIndex + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      goToIndex(activeIndex - 1);
    }
  });

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