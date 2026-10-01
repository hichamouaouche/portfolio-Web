/** Portfolio — Hicham Ouaouche | script.js */
'use strict';
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  $('#year').textContent = new Date().getFullYear();

  // Scroll progress, nav style, scroll-to-top
  const bar = $('#progress-bar'), nav = $('.nav'), top = $('#scroll-top');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = max > 0 ? `${(scrollY / max) * 100}%` : '0';
    nav.classList.toggle('scrolled', scrollY > 40);
    top.classList.toggle('show', scrollY > 400);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  // Mobile menu
  const burger = $('.nav-hamburger'), links = $('.nav-links');
  const setMenu = (open) => {
    links.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  $$('a', links).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  // Active nav link
  const navLinks = $$('.nav-links a');
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${en.target.id}`));
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  $$('section[id]').forEach(s => spy.observe(s));

  // Scroll reveal
  const reveal = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('visible'); obs.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => reveal.observe(el));

  // Stat counters
  const counters = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target, target = parseInt(el.textContent, 10);
      obs.unobserve(el);
      if (reduceMotion) return;
      let start = null;
      const step = ts => {
        start ??= ts;
        const p = Math.min((ts - start) / 1200, 1);
        el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  $$('.stat-num').forEach(el => counters.observe(el));

  // Typed text
  const out = $('#typed-text');
  const phrases = ['Full Stack Developer', 'AI Engineer', 'Java Spring Boot & Angular', 'Multi-Agent Systems', 'Cybersecurity-minded Builder'];
  if (reduceMotion) return;
  let p = 0, c = 0, del = false;
  (function tick() {
    const phrase = phrases[p];
    c += del ? -1 : 1;
    out.textContent = phrase.slice(0, c);
    let delay = del ? 35 : 70;
    if (!del && c === phrase.length) { del = true; delay = 1800; }
    else if (del && c === 0) { del = false; p = (p + 1) % phrases.length; delay = 400; }
    setTimeout(tick, delay);
  })();
});