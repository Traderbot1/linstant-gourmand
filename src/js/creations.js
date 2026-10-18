import { initCommon, gsap, ScrollTrigger, lenis, reducedMotion } from './common.js';
import { Flip } from 'gsap/Flip';
import { CATEGORIES } from './config.js';
import { CREATIONS } from './data.js';

gsap.registerPlugin(Flip);
initCommon();

const grid = document.querySelector('.gallery');
const items = [...grid.children];
const filters = [...document.querySelectorAll('.filter')];
const titleEl = document.querySelector('[data-cat-title]');
const textEl = document.querySelector('[data-cat-text]');
const defaults = { title: titleEl.textContent, text: textEl.textContent };

function applyFilter(id, animate = true) {
  const cat = CATEGORIES.find((c) => c.id === id);
  if (!cat) id = 'all';
  filters.forEach((f) => f.setAttribute('aria-pressed', String(f.dataset.filter === id)));
  const state = Flip.getState(items);
  items.forEach((el) => {
    const match = id === 'all' ? !el.hasAttribute('data-soon') : el.dataset.cat === id;
    el.hidden = !match;
    if (match) gsap.set(el, { opacity: 1, y: 0 });
  });
  titleEl.textContent = cat ? cat.title : defaults.title;
  textEl.textContent = cat ? cat.text : defaults.text;
  if (animate && !reducedMotion) {
    Flip.from(state, {
      duration: 0.8,
      ease: 'expo.out',
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'expo.out' }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.94, duration: 0.4 }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  }
}

filters.forEach((f) =>
  f.addEventListener('click', () => {
    const id = f.dataset.filter;
    history.replaceState(null, '', id === 'all' ? location.pathname : `#${id}`);
    applyFilter(id);
  }),
);
window.addEventListener('hashchange', () => applyFilter(location.hash.slice(1)));
applyFilter(location.hash.slice(1), false);

// ─── Lightbox ───
const lb = document.querySelector('.lightbox');
const lbImg = lb.querySelector('.lightbox__media img');
let current = 0;
let lastFocus = null;
const visible = () => CREATIONS.filter((c) => !grid.querySelector(`[data-id="${c.id}"]`).hidden);

function fill(c) {
  const cat = CATEGORIES.find((k) => k.id === c.category);
  lbImg.src = `/img/${c.image}-1400.webp`;
  lbImg.alt = c.title;
  lb.querySelector('[data-lb-cat]').textContent = cat ? cat.title : '';
  lb.querySelector('#lb-title').textContent = c.title;
  lb.querySelector('[data-lb-occ]').textContent = c.occasion;
  lb.querySelector('[data-lb-desc]').textContent = c.description;
  lb.querySelector('[data-lb-order]').href = `/commander.html?categorie=${c.category}&modele=${encodeURIComponent(c.title)}`;
}
function open(id) {
  const list = visible();
  current = Math.max(0, list.findIndex((c) => c.id === id));
  fill(list[current]);
  lastFocus = document.activeElement;
  lb.classList.add('is-open');
  lb.setAttribute('aria-hidden', 'false');
  lenis?.stop();
  lb.querySelector('.lightbox__close').focus();
}
function close() {
  lb.classList.remove('is-open');
  lb.setAttribute('aria-hidden', 'true');
  lenis?.start();
  lastFocus?.focus();
}
function step(d) {
  const list = visible();
  current = (current + d + list.length) % list.length;
  fill(list[current]);
}
grid.addEventListener('click', (e) => {
  const card = e.target.closest('.card[data-id]');
  if (card) open(card.dataset.id);
});
lb.querySelector('.lightbox__close').addEventListener('click', close);
lb.querySelector('[data-lb-prev]').addEventListener('click', () => step(-1));
lb.querySelector('[data-lb-next]').addEventListener('click', () => step(1));
lb.addEventListener('click', (e) => e.target === lb && close());
document.addEventListener('keydown', (e) => {
  if (!lb.classList.contains('is-open')) return;
  if (e.key === 'Escape') close();
  if (e.key === 'ArrowRight') step(1);
  if (e.key === 'ArrowLeft') step(-1);
  if (e.key === 'Tab') {
    const f = [...lb.querySelectorAll('button, a[href]')];
    const i = f.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) {
      e.preventDefault();
      f[f.length - 1].focus();
    } else if (!e.shiftKey && i === f.length - 1) {
      e.preventDefault();
      f[0].focus();
    }
  }
});
