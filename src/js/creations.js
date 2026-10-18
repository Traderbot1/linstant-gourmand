// Page d'une section (/creations/<id>/) : sous-filtres et visionneuse.
import { initCommon, gsap, ScrollTrigger, lenis, reducedMotion } from './common.js';
import { Flip } from 'gsap/Flip';
import { CATEGORIES } from './config.js';
import { CREATIONS } from './data.js';

gsap.registerPlugin(Flip);
initCommon();

const grid = document.querySelector('.gallery');
const cards = [...grid.querySelectorAll('.card[data-id]')];
const filters = [...document.querySelectorAll('.tagbar .filter')];

// ─── Sous-filtres (ex. Enfants, Naissance…) ───
function applyFilter(tag, animate = true) {
  if (!filters.some((f) => f.dataset.filter === tag)) tag = 'all';
  filters.forEach((f) => f.setAttribute('aria-pressed', String(f.dataset.filter === tag)));
  const state = Flip.getState(cards);
  cards.forEach((el) => {
    el.hidden = tag !== 'all' && el.dataset.tag !== tag;
    if (!el.hidden) gsap.set(el, { opacity: 1, y: 0 });
  });
  if (!animate || reducedMotion) return ScrollTrigger.refresh();
  Flip.from(state, {
    duration: 0.8,
    ease: 'expo.out',
    absolute: true,
    onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'expo.out' }),
    onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.94, duration: 0.4 }),
    onComplete: () => ScrollTrigger.refresh(),
  });
}

filters.forEach((f) =>
  f.addEventListener('click', () => {
    const tag = f.dataset.filter;
    history.replaceState(null, '', tag === 'all' ? location.pathname : `#${tag}`);
    applyFilter(tag);
  }),
);
if (filters.length) applyFilter(location.hash.slice(1), false);

// ─── Visionneuse ───
const lb = document.querySelector('.lightbox');
const lbImg = lb.querySelector('.lightbox__media img');
const lbMono = lb.querySelector('.lightbox__media .mono-tile');
let list = [];
let current = 0;
let lastFocus = null;

function fill(card) {
  const c = CREATIONS.find((k) => k.id === card.dataset.id);
  const cat = CATEGORIES.find((k) => k.id === c.category);
  const image = card.dataset.img;
  lbImg.hidden = !image;
  lbMono.hidden = !!image;
  if (image) lbImg.src = `/img/${image}-1400.webp`;
  lbImg.alt = c.title;
  lb.querySelector('[data-lb-cat]').textContent = cat ? cat.title : '';
  lb.querySelector('#lb-title').textContent = c.title;
  lb.querySelector('[data-lb-occ]').textContent = c.tag;
  lb.querySelector('[data-lb-desc]').textContent = c.description;
  lb.querySelector('[data-lb-order]').href = `/commander/?creation=${encodeURIComponent(c.id)}`;
}
function open(card) {
  list = cards.filter((c) => !c.hidden);
  current = Math.max(0, list.indexOf(card));
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
  current = (current + d + list.length) % list.length;
  fill(list[current]);
}
grid.addEventListener('click', (e) => {
  const card = e.target.closest('.card[data-id]');
  if (card) open(card);
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
