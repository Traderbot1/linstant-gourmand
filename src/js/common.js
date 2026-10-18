// Comportements partagés par toutes les pages : défilement doux, en-tête, menus,
// curseur, transitions de page et animations d'apparition.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
export let lenis = null;

// sessionStorage peut être bloqué (navigation privée, cookies refusés) : on ne plante jamais pour ça.
export const session = {
  get: (k) => {
    try {
      return sessionStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k, v) => {
    try {
      sessionStorage.setItem(k, v);
    } catch {}
  },
  remove: (k) => {
    try {
      sessionStorage.removeItem(k);
    } catch {}
  },
};

function initScroll() {
  if (reducedMotion) return;
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // Ancres internes en douceur
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a) return;
    const url = new URL(a.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    const el = document.querySelector(url.hash);
    if (!el) return;
    e.preventDefault();
    closeMobileMenu();
    lenis.scrollTo(el, { offset: 0, duration: 1.6 });
    history.replaceState(null, '', url.hash);
  });
}

function initHeader() {
  const header = document.querySelector('[data-header]');
  if (!header) return;
  let last = 0;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-solid', y > 40);
    const menuOpen = document.documentElement.classList.contains('menu-open');
    header.classList.toggle('is-hidden', !menuOpen && y > 400 && y > last + 2);
    if (y < last - 2) header.classList.remove('is-hidden');
    last = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  document.querySelectorAll('[data-header-theme]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top top+=42',
      end: 'bottom top+=42',
      onToggle: (self) => self.isActive && header.classList.toggle('is-dark', sec.dataset.headerTheme === 'dark'),
    });
  });

  const page = document.body.dataset.page;
  header.querySelectorAll('[data-nav]').forEach((a) => {
    if (a.dataset.nav === page) a.setAttribute('aria-current', 'page');
  });
}

function initMega() {
  const item = document.querySelector('[data-mega]');
  if (!item) return;
  const trigger = item.querySelector('.nav__trigger');
  const previews = item.querySelectorAll('[data-preview-img]');
  let timer;
  const open = (v) => {
    clearTimeout(timer);
    item.classList.toggle('is-open', v);
    trigger.setAttribute('aria-expanded', String(v));
  };
  item.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && open(true));
  item.addEventListener('pointerleave', (e) => {
    if (e.pointerType === 'mouse') timer = setTimeout(() => open(false), 220);
  });
  trigger.addEventListener('click', () => open(!item.classList.contains('is-open')));
  item.addEventListener('focusout', (e) => !item.contains(e.relatedTarget) && open(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && item.classList.contains('is-open')) {
      open(false);
      trigger.focus();
    }
  });
  const show = (i) => previews.forEach((p) => p.classList.toggle('is-active', p.dataset.previewImg === i));
  item.querySelectorAll('[data-preview]').forEach((a) => {
    a.addEventListener('pointerenter', () => show(a.dataset.preview));
    a.addEventListener('focus', () => show(a.dataset.preview));
  });
}

const burger = () => document.querySelector('.burger');
function closeMobileMenu() {
  const b = burger();
  if (!b || !document.documentElement.classList.contains('menu-open')) return;
  document.documentElement.classList.remove('menu-open');
  b.setAttribute('aria-expanded', 'false');
  b.setAttribute('aria-label', 'Ouvrir le menu');
  lenis?.start();
}
function initMobileMenu() {
  const b = burger();
  if (!b) return;
  const menu = document.getElementById('mobile-menu');
  b.addEventListener('click', () => {
    const open = !document.documentElement.classList.contains('menu-open');
    if (!open) return closeMobileMenu();
    document.documentElement.classList.add('menu-open');
    b.setAttribute('aria-expanded', 'true');
    b.setAttribute('aria-label', 'Fermer le menu');
    lenis?.stop();
    gsap.fromTo(
      menu.querySelectorAll('.mobile-menu__main a, .mobile-menu__cats li'),
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, stagger: 0.04, ease: 'expo.out', delay: 0.25 },
    );
  });
  document.addEventListener('keydown', (e) => e.key === 'Escape' && closeMobileMenu());
}

function initCursor() {
  if (isTouch || reducedMotion) return;
  const cursor = document.querySelector('.cursor');
  if (!cursor) return;
  const dot = cursor.querySelector('.cursor__dot');
  const ring = cursor.querySelector('.cursor__ring');
  const label = ring.querySelector('span');
  const dx = gsap.quickTo(dot, 'x', { duration: 0.1 });
  const dy = gsap.quickTo(dot, 'y', { duration: 0.1 });
  const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
  const ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
  window.addEventListener('pointermove', (e) => {
    cursor.classList.add('is-active');
    dx(e.clientX);
    dy(e.clientY);
    rx(e.clientX);
    ry(e.clientY);
  });
  document.documentElement.addEventListener('pointerleave', () => cursor.classList.remove('is-active'));
  document.addEventListener('pointerover', (e) => {
    const labelled = e.target.closest('[data-cursor]');
    const hover = e.target.closest('a, button, input, select, textarea, label');
    cursor.classList.toggle('is-label', !!labelled);
    cursor.classList.toggle('is-hover', !labelled && !!hover);
    label.textContent = labelled ? labelled.dataset.cursor : '';
  });
}

function initMagnetic() {
  if (isTouch || reducedMotion) return;
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - r.left - r.width / 2) * 0.3);
      y((e.clientY - r.top - r.height / 2) * 0.4);
    });
    el.addEventListener('pointerleave', () => {
      x(0);
      y(0);
    });
  });
}

// Transition rideau entre les pages
function initTransitions() {
  const curtain = document.querySelector('.curtain');
  if (!curtain) return;
  if (session.get('ig-curtain')) {
    session.remove('ig-curtain');
    gsap.set(curtain, { yPercent: 0 });
    gsap.to(curtain, { yPercent: -100, duration: 1, ease: 'expo.inOut', delay: 0.05 });
  }
  if (reducedMotion) return;
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.pathname === location.pathname) return;
    e.preventDefault();
    session.set('ig-curtain', '1');
    gsap.fromTo(curtain, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: 'expo.inOut', onComplete: () => (location.href = url.href) });
  });
  // Retour arrière depuis le cache : on retire le rideau
  window.addEventListener('pageshow', (e) => e.persisted && gsap.set(curtain, { yPercent: 100 }));
}

// Apparitions au scroll
function initReveals() {
  if (reducedMotion) {
    gsap.set('.reveal-up', { opacity: 1, y: 0 });
    return;
  }
  ScrollTrigger.batch('.reveal-up', {
    start: 'top 88%',
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1.2, stagger: 0.09, ease: 'expo.out', overwrite: true }),
  });
  document.fonts.ready.then(() => {
    document.querySelectorAll('[data-split]').forEach((el) => {
      SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.3,
            stagger: 0.09,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }),
      });
    });
    ScrollTrigger.refresh();
  });
  document.querySelectorAll('[data-speed]').forEach((el) => {
    gsap.to(el, {
      yPercent: parseFloat(el.dataset.speed) * 100,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

export function initCommon() {
  initScroll();
  initHeader();
  initMega();
  initMobileMenu();
  initCursor();
  initMagnetic();
  initTransitions();
  initReveals();
  document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
}

export { gsap, ScrollTrigger };
