// Gabarits HTML partagés, injectés au build par le plugin Vite (vite.config.js).
// Tout est rendu en HTML statique : bon pour le référencement et le chargement.
import { readFileSync } from 'node:fs';
import { CATEGORIES, CONTACT } from './js/config.js';
import { CREATIONS } from './js/data.js';

const svg = (name, attrs = '') =>
  readFileSync(new URL(`../public/brand/${name}.svg`, import.meta.url), 'utf8').replace('<svg ', `<svg ${attrs} `);

export const ARROW = '<svg class="btn__arrow" viewBox="0 0 16 10" fill="none" stroke="currentColor" aria-hidden="true"><path d="M0 5h15M11 1l4 4-4 4"/></svg>';
const CHEVRON = '<svg viewBox="0 0 10 6" fill="none" stroke="currentColor" aria-hidden="true"><path d="M1 1l4 4 4-4"/></svg>';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const pad = (n) => String(n).padStart(2, '0');

export function img(name, alt, sizes = '(max-width: 760px) 90vw, 33vw', extra = '') {
  return `<img src="/img/${name}-800.webp" srcset="/img/${name}-800.webp 800w, /img/${name}-1400.webp 1400w" sizes="${sizes}" alt="${esc(alt)}" loading="lazy" decoding="async" ${extra}>`;
}

const monoTile = (soon = false) => `<div class="mono-tile${soon ? ' mono-tile--soon' : ''}" aria-hidden="true">${svg('monogram')}</div>`;
const coverOf = (catId) => CREATIONS.find((c) => c.category === catId);
const countOf = (catId) => CREATIONS.filter((c) => c.category === catId).length;

const socials = () =>
  [
    CONTACT.instagram && `<li><a class="link-line" href="${CONTACT.instagram}" target="_blank" rel="noopener">Instagram</a></li>`,
    CONTACT.facebook && `<li><a class="link-line" href="${CONTACT.facebook}" target="_blank" rel="noopener">Facebook</a></li>`,
  ]
    .filter(Boolean)
    .join('');

export function header() {
  const items = CATEGORIES.map(
    (c, i) =>
      `<li><a href="/creations.html#${c.id}" data-preview="${i}"><span class="mega__num">${pad(i + 1)}</span><span class="mega__title">${c.title}</span><span class="mega__sub">${c.short}</span></a></li>`,
  ).join('');
  const previews = CATEGORIES.map((c, i) => {
    const cover = coverOf(c.id);
    const cls = i === 0 ? ' is-active' : '';
    return cover
      ? img(cover.image, '', '380px', `data-preview-img="${i}" class="${cls.trim()}"`)
      : `<div class="mono-tile${cls}" data-preview-img="${i}">${svg('monogram')}</div>`;
  }).join('');
  const mobileCats = CATEGORIES.map((c) => `<li><a href="/creations.html#${c.id}">${c.title}</a></li>`).join('');

  return `
<a class="skip" href="#main">Aller au contenu</a>
<div class="grain" aria-hidden="true"></div>
<div class="curtain" aria-hidden="true"></div>
<div class="cursor" aria-hidden="true"><div class="cursor__dot"></div><div class="cursor__ring"><span></span></div></div>
<header class="header" data-header>
  <a class="header__logo" href="/" aria-label="L’instant Gourmand — accueil">${svg('wordmark', 'aria-hidden="true"')}</a>
  <nav class="nav" aria-label="Navigation principale">
    <div class="nav__links">
      <a class="link-line" href="/" data-nav="home">Accueil</a>
      <div class="nav__item" data-mega>
        <button class="nav__trigger" type="button" aria-expanded="false" aria-controls="mega" data-nav="creations">Créations ${CHEVRON}</button>
        <div class="mega" id="mega">
          <div>
            <ul class="mega__list">${items}</ul>
            <a class="mega__all link-line" href="/creations.html">Toutes les créations →</a>
            <div style="height:22px"></div>
          </div>
          <div class="mega__preview" aria-hidden="true">${previews}</div>
        </div>
      </div>
      <a class="link-line" href="/#atelier">L’atelier</a>
      <a class="link-line" href="/commander.html#contact" data-nav="contact">Contact</a>
    </div>
    <a class="btn" href="/commander.html" data-magnetic>Commander ${ARROW}</a>
    <button class="burger" type="button" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span></button>
  </nav>
</header>
<div class="mobile-menu" id="mobile-menu">
  <nav class="mobile-menu__main" aria-label="Menu mobile">
    <a href="/">Accueil</a>
    <a href="/creations.html">Créations</a>
    <a href="/#atelier">L’atelier</a>
    <a href="/commander.html">Commander</a>
  </nav>
  <div>
    <p class="eyebrow">Nos créations</p>
    <ul class="mobile-menu__cats">${mobileCats}</ul>
  </div>
</div>`;
}

export function footer() {
  const cats = CATEGORIES.map((c) => `<li><a class="link-line" href="/creations.html#${c.id}">${c.title}</a></li>`).join('');
  const contact = [
    CONTACT.email && `<li><a class="link-line" href="mailto:${CONTACT.email}">${CONTACT.email}</a></li>`,
    CONTACT.phone && `<li><a class="link-line" href="tel:${CONTACT.phone.replace(/\s/g, '')}">${CONTACT.phone}</a></li>`,
    CONTACT.zone && `<li>${CONTACT.zone}</li>`,
    socials(),
  ]
    .filter(Boolean)
    .join('');
  return `
<footer class="footer" data-header-theme="dark">
  <div class="wrap">
    <div class="footer__grid">
      <div>
        <div class="footer__logo">${svg('logo', 'aria-hidden="true"')}</div>
        <p class="muted" style="max-width:26em;margin-top:24px">Pâtisserie artisanale sur commande. Des gâteaux qui se regardent, puis se savourent.</p>
      </div>
      <div><h4>Créations</h4><ul>${cats}</ul></div>
      <div><h4>Maison</h4><ul>
        <li><a class="link-line" href="/">Accueil</a></li>
        <li><a class="link-line" href="/#atelier">L’atelier</a></li>
        <li><a class="link-line" href="/commander.html">Commander</a></li>
      </ul></div>
      <div id="contact-footer"><h4>Contact</h4><ul>${contact}</ul></div>
    </div>
    <div class="footer__big" aria-hidden="true">${svg('wordmark')}</div>
    <div class="footer__bottom">
      <span>© <span data-year>2026</span> L’instant Gourmand — Douceur &amp; Saveur</span>
      <span>linstantg.com</span>
    </div>
  </div>
</footer>`;
}

// ─── Accueil ───
export function homeCats() {
  return CATEGORIES.map((c, i) => {
    const cover = coverOf(c.id);
    const media = cover ? img(cover.image, `${c.title} — ${cover.title}`) : monoTile(true);
    return `<a class="cat reveal-up" href="/creations.html#${c.id}" data-tilt data-cursor="Voir">
  <div class="cat__inner">
    <div class="cat__media">${media}</div>
    <div class="cat__body">
      <div><span class="cat__num">${pad(i + 1)}</span><h3 class="cat__title">${c.title}</h3><span class="cat__short">${c.short}</span></div>
      <span class="cat__go" aria-hidden="true">${ARROW}</span>
    </div>
  </div>
</a>`;
  }).join('');
}

export function showcase() {
  const slides = CREATIONS.map(
    (c, i) => `<article class="slide" data-cursor="Voir">
  <span class="slide__index" aria-hidden="true">${pad(i + 1)}</span>
  <a class="slide__frame" href="/creations.html#${c.category}" aria-label="${esc(c.title)}">${img(c.image, c.title, '(max-width: 760px) 74vw, 30vw', 'data-parallax')}</a>
  <div class="slide__meta"><h3 class="slide__title">${c.title}</h3><span class="slide__occ">${c.occasion}</span></div>
</article>`,
  ).join('');
  return `${slides}
<div class="slide slide--end">
  <p class="display h3">Et bien d’autres<br><span class="script">douceurs…</span></p>
  <a class="btn btn--light" href="/creations.html" data-magnetic>Toute la galerie ${ARROW}</a>
</div>`;
}

// ─── Page Créations ───
export function filters() {
  const all = `<button class="filter" type="button" data-filter="all" aria-pressed="true">Tout<sup>${CREATIONS.length}</sup></button>`;
  return (
    all +
    CATEGORIES.map(
      (c) => `<button class="filter" type="button" data-filter="${c.id}" aria-pressed="false">${c.title}<sup>${countOf(c.id) || '·'}</sup></button>`,
    ).join('')
  );
}

export function gallery() {
  const cards = CREATIONS.map((c) => {
    const cat = CATEGORIES.find((k) => k.id === c.category);
    return `<button class="card reveal-up" type="button" data-cat="${c.category}" data-id="${c.id}" data-cursor="Voir">
  <div class="card__media">${img(c.image, c.title)}<span class="card__tag">${c.occasion}</span></div>
  <h3 class="card__title">${c.title}</h3>
  <p class="card__desc">${cat ? cat.title : ''}</p>
</button>`;
  }).join('');
  const soon = CATEGORIES.filter((c) => !countOf(c.id))
    .map(
      (c) => `<div class="card card--soon" data-cat="${c.id}" data-soon hidden>
  <div class="card__media">${monoTile(true)}</div>
  <h3 class="card__title">${c.title}</h3>
  <p class="card__desc">La galerie arrive bientôt. En attendant, parlons de votre projet : <a class="link-line" href="/commander.html?categorie=${c.id}">demander un devis</a>.</p>
</div>`,
    )
    .join('');
  return cards + soon;
}

// ─── Page Commander ───
export function orderOptions() {
  return CATEGORIES.map(
    (c, i) => `<label class="chip"><input type="radio" name="categorie" value="${c.id}"${i === 0 ? ' checked' : ''}><span>${c.title}</span></label>`,
  ).join('');
}

export function contactList() {
  return [
    CONTACT.email && `<li><a href="mailto:${CONTACT.email}"><small>E-mail</small><span class="link-line">${CONTACT.email}</span></a></li>`,
    CONTACT.phone && `<li><a href="tel:${CONTACT.phone.replace(/\s/g, '')}"><small>Téléphone</small><span class="link-line">${CONTACT.phone}</span></a></li>`,
    CONTACT.whatsapp && `<li><a href="https://wa.me/${CONTACT.whatsapp}" target="_blank" rel="noopener"><small>WhatsApp</small><span class="link-line">Écrire un message</span></a></li>`,
    CONTACT.instagram && `<li><a href="${CONTACT.instagram}" target="_blank" rel="noopener"><small>Instagram</small><span class="link-line">Suivre l’atelier</span></a></li>`,
    CONTACT.zone && `<li><span><small>Zone</small><span>${CONTACT.zone}</span></span></li>`,
  ]
    .filter(Boolean)
    .join('');
}

export const SVG = { logo: () => svg('logo'), wordmark: () => svg('wordmark'), monogram: () => svg('monogram') };
