// Gabarits HTML partagés, injectés au build par le plugin Vite (vite.config.js).
// Tout est rendu en HTML statique : bon pour le référencement et le chargement.
import { existsSync, readFileSync } from 'node:fs';
import { CATEGORIES, CONTACT, FAQ, OCCASIONS } from './js/config.js';
import { CREATIONS } from './js/data.js';

const svg = (name, attrs = '') =>
  readFileSync(new URL(`../public/brand/${name}.svg`, import.meta.url), 'utf8').replace('<svg ', `<svg ${attrs} `);

export const ARROW = '<svg class="btn__arrow" viewBox="0 0 16 10" fill="none" stroke="currentColor" aria-hidden="true"><path d="M0 5h15M11 1l4 4-4 4"/></svg>';
const CHEVRON = '<svg viewBox="0 0 10 6" fill="none" stroke="currentColor" aria-hidden="true"><path d="M1 1l4 4 4-4"/></svg>';
export const ICONS = {
  whatsapp:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.28-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88a9.82 9.82 0 0 1 9.88 9.89c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.42"/></svg>',
  phone:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>',
  instagram:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></svg>',
  facebook:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>',
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const pad = (n) => String(n).padStart(2, '0');
const tel = () => CONTACT.phone.replace(/\s/g, '');

// Une photo n'est affichée que si ses fichiers existent dans public/img/.
export const hasImage = (name) => !!name && existsSync(new URL(`../public/img/${name}-800.webp`, import.meta.url));

export function img(name, alt, sizes = '(max-width: 760px) 90vw, 33vw', extra = '') {
  return `<img src="/img/${name}-800.webp" srcset="/img/${name}-800.webp 800w, /img/${name}-1400.webp 1400w" sizes="${sizes}" alt="${esc(alt)}" loading="lazy" decoding="async" ${extra}>`;
}

const monoTile = (soon = false) => `<div class="mono-tile${soon ? ' mono-tile--soon' : ''}" aria-hidden="true">${svg('monogram')}</div>`;
const media = (c, sizes) => (hasImage(c.image) ? img(c.image, c.title, sizes) : monoTile(true));
const withImages = () => CREATIONS.filter((c) => hasImage(c.image));
const coverOf = (catId) => {
  const list = withImages().filter((c) => c.category === catId);
  return list.find((c) => c.featured) ?? list[0];
};
const slug = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
const countOf = (catId) => CREATIONS.filter((c) => c.category === catId).length;

export function header() {
  const items = CATEGORIES.map(
    (c, i) =>
      `<li><a href="/creations/${c.id}/" data-preview="${i}"><span class="mega__num">${pad(i + 1)}</span><span class="mega__title">${c.title}</span><span class="mega__sub">${c.short}</span></a></li>`,
  ).join('');
  const previews = CATEGORIES.map((c, i) => {
    const cover = coverOf(c.id);
    const cls = i === 0 ? ' is-active' : '';
    return cover
      ? img(cover.image, '', '380px', `data-preview-img="${i}" class="${cls.trim()}"`)
      : `<div class="mono-tile${cls}" data-preview-img="${i}">${svg('monogram')}</div>`;
  }).join('');
  const mobileCats = CATEGORIES.map((c) => `<li><a href="/creations/${c.id}/">${c.title}</a></li>`).join('');

  return `
<a class="skip" href="#main">Aller au contenu</a>
<div class="grain" aria-hidden="true"></div>
<div class="curtain" aria-hidden="true"></div>
<div class="cursor" aria-hidden="true"><div class="cursor__dot"></div><div class="cursor__ring"><span></span></div></div>
<header class="header" data-header>
  <a class="header__logo" href="/" aria-label="L’instant Gourmand — accueil"><span class="brand-logo" aria-hidden="true"></span></a>
  <nav class="nav" aria-label="Navigation principale">
    <div class="nav__links">
      <a class="link-line" href="/" data-nav="home">Accueil</a>
      <div class="nav__item" data-mega>
        <button class="nav__trigger" type="button" aria-expanded="false" aria-controls="mega" data-nav="creations">Créations ${CHEVRON}</button>
        <div class="mega" id="mega">
          <div>
            <ul class="mega__list">${items}</ul>
            <a class="mega__all link-line" href="/creations/">Toutes les créations →</a>
            <div style="height:22px"></div>
          </div>
          <div class="mega__preview" aria-hidden="true">${previews}</div>
        </div>
      </div>
      <a class="link-line" href="/#atelier">L’atelier</a>
      <a class="link-line" href="/contact/" data-nav="contact">Contact</a>
      <a class="nav__tel link-line" href="tel:${tel()}">${CONTACT.phone}</a>
    </div>
    <a class="btn" href="/commander/" data-magnetic data-nav="commander">Commander ${ARROW}</a>
    <button class="burger" type="button" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span></button>
  </nav>
</header>
<div class="mobile-menu" id="mobile-menu">
  <nav class="mobile-menu__main" aria-label="Menu mobile">
    <a href="/">Accueil</a>
    <a href="/creations/">Créations</a>
    <a href="/#atelier">L’atelier</a>
    <a href="/commander/">Commander</a>
    <a href="/contact/">Contact</a>
  </nav>
  <div>
    <p class="eyebrow">Nos créations</p>
    <ul class="mobile-menu__cats">${mobileCats}</ul>
  </div>
  <div class="mobile-menu__contact">
    <a href="tel:${tel()}">${CONTACT.phone}</a>
    <a href="mailto:${CONTACT.email}">${CONTACT.email}</a>
    <span><a href="${CONTACT.instagram}" target="_blank" rel="noopener">Instagram</a> · <a href="${CONTACT.facebook}" target="_blank" rel="noopener">Facebook</a></span>
  </div>
</div>`;
}

export function socialIcons() {
  return `<div class="socials">
  <a class="social" href="${CONTACT.instagram}" target="_blank" rel="noopener" aria-label="Instagram ${CONTACT.instagramHandle}">${ICONS.instagram}</a>
  <a class="social" href="${CONTACT.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${ICONS.facebook}</a>
  <a class="social" href="https://wa.me/${CONTACT.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${ICONS.whatsapp}</a>
</div>`;
}

export function footer() {
  const cats = CATEGORIES.map((c) => `<li><a class="link-line" href="/creations/${c.id}/">${c.title}</a></li>`).join('');
  return `
<footer class="footer" data-header-theme="dark">
  <div class="wrap">
    <div class="footer__grid">
      <div>
        <div class="footer__logo"><span class="brand-logo" role="img" aria-label="L’instant Gourmand — Douceur &amp; Saveur"></span></div>
        <p class="muted" style="max-width:28em;margin:24px 0">Pâtisserie franco-tunisienne d’exception, sur commande. Créations sucrées et salées imaginées par <em class="script" style="font-size:1.35em">${CONTACT.chef}</em> dans son atelier de ${CONTACT.city}.</p>
        ${socialIcons()}
      </div>
      <div><h4>Créations</h4><ul>${cats}</ul></div>
      <div><h4>L’atelier</h4><ul>
        <li>${CONTACT.city}</li>
        <li>${CONTACT.region}, ${CONTACT.postalCode}</li>
        <li class="muted">Retrait à l’atelier</li>
        <li class="muted">Sur commande, ${CONTACT.minDelayHours} h minimum</li>
      </ul></div>
      <div><h4>Contact</h4><ul>
        <li><a class="link-line" href="tel:${tel()}">${CONTACT.phone}</a></li>
        <li><a class="link-line" href="mailto:${CONTACT.email}">${CONTACT.email}</a></li>
        <li><a class="link-line" href="https://wa.me/${CONTACT.whatsapp}" target="_blank" rel="noopener">WhatsApp</a></li>
        <li class="muted">${CONTACT.hours}</li>
      </ul></div>
    </div>
    <div class="footer__big" aria-hidden="true"><span class="brand-logo brand-logo--word"></span></div>
    <div class="footer__bottom">
      <span>© <span data-year>2026</span> L’instant Gourmand — Douceur &amp; Saveur · Tous droits réservés</span>
      <span>Fait avec amour sur Paris par <a class="link-line" href="https://agenticflow.fr" target="_blank" rel="noopener">agenticflow.fr</a></span>
    </div>
  </div>
</footer>`;
}

// ─── Données structurées (référencement local) ───
export function schema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    name: 'L’instant Gourmand',
    slogan: 'Douceur & Saveur',
    description: 'Pâtisserie franco-tunisienne sur commande : gâteaux personnalisés, trompe-l’œil, douceurs tunisiennes, coffrets et salé.',
    url: 'https://linstantg.com/',
    image: 'https://linstantg.com/img/gateau-velours-violet.jpg',
    telephone: CONTACT.phone,
    email: CONTACT.email,
    founder: { '@type': 'Person', name: CONTACT.chef },
    address: { '@type': 'PostalAddress', addressLocality: CONTACT.city, postalCode: CONTACT.postalCode, addressRegion: 'Île-de-France', addressCountry: 'FR' },
    areaServed: 'Île-de-France',
    sameAs: [CONTACT.instagram, CONTACT.facebook],
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

// ─── Accueil ───
export function homeCats() {
  return CATEGORIES.map((c, i) => {
    const cover = coverOf(c.id);
    const m = cover ? img(cover.image, `${c.title} — ${cover.title}`) : monoTile(true);
    return `<a class="cat reveal-up" href="/creations/${c.id}/" data-tilt data-cursor="Voir">
  <div class="cat__inner">
    <div class="cat__media">${m}</div>
    <div class="cat__body">
      <div><span class="cat__num">${pad(i + 1)}</span><h3 class="cat__title">${c.title}</h3><span class="cat__short">${c.short}</span></div>
      <span class="cat__go" aria-hidden="true">${ARROW}</span>
    </div>
  </div>
</a>`;
  }).join('');
}

export function showcase() {
  const featured = withImages().filter((c) => c.featured);
  const slides = (featured.length ? featured : withImages())
    .map(
      (c, i) => `<article class="slide" data-cursor="Voir">
  <span class="slide__index" aria-hidden="true">${pad(i + 1)}</span>
  <a class="slide__frame" href="/creations/${c.category}/" aria-label="${esc(c.title)}">${img(c.image, c.title, '(max-width: 760px) 74vw, 30vw', 'data-parallax')}</a>
  <div class="slide__meta"><h3 class="slide__title">${c.title}</h3><span class="slide__occ">${c.tag}</span></div>
</article>`,
    )
    .join('');
  return `${slides}
<div class="slide slide--end">
  <p class="display h3">Et bien d’autres<br><span class="script">douceurs…</span></p>
  <a class="btn btn--light" href="/creations/" data-magnetic>Toute la galerie ${ARROW}</a>
</div>`;
}

// ─── Pages Créations (une par section) ───
const catOf = (id) => CATEGORIES.find((c) => c.id === id);

export function sectionNav(id) {
  return CATEGORIES.map(
    (c) => `<a class="filter" href="/creations/${c.id}/"${c.id === id ? ' aria-current="page"' : ''}>${c.title}<sup>${countOf(c.id) || '·'}</sup></a>`,
  ).join('');
}

export function tagFilters(id) {
  const cat = catOf(id);
  if (!cat?.tags) return '';
  const n = (t) => CREATIONS.filter((c) => c.category === id && c.tag === t).length;
  return (
    `<button class="filter" type="button" data-filter="all" aria-pressed="true">Tout<sup>${countOf(id)}</sup></button>` +
    cat.tags.map((t) => `<button class="filter" type="button" data-filter="${slug(t)}" aria-pressed="false">${t}<sup>${n(t)}</sup></button>`).join('')
  );
}

export function sectionTitle(id) {
  return catOf(id).title;
}
export function sectionText(id) {
  return catOf(id).text;
}

export function gallery(id) {
  const list = CREATIONS.filter((c) => c.category === id);
  if (!list.length) {
    const cat = catOf(id);
    return `<div class="card card--soon">
  <div class="card__media">${monoTile(true)}</div>
  <h3 class="card__title">${cat.title}</h3>
  <p class="card__desc">La galerie arrive bientôt. En attendant, parlons de votre projet : <a class="link-line" href="/commander/">passer commande</a>.</p>
</div>`;
  }
  return list
    .map(
      (c) => `<button class="card reveal-up" type="button" data-id="${c.id}" data-tag="${slug(c.tag)}" data-img="${hasImage(c.image) ? c.image : ''}" data-cursor="Voir">
  <div class="card__media">${media(c)}<span class="card__tag">${c.tag}</span></div>
  <h3 class="card__title">${c.title}</h3>
  <p class="card__desc">${c.description}</p>
</button>`,
    )
    .join('');
}

// ─── Page Commander ───
export function occasionChoices() {
  return OCCASIONS.map(
    (o) => `<label class="choice"><input type="radio" name="occasion" value="${esc(o.value)}" required><span><b>${o.value}</b><small>${o.sub}</small></span></label>`,
  ).join('');
}

export function productPicks() {
  return CATEGORIES.map((cat) => {
    const all = CREATIONS.filter((c) => c.category === cat.id);
    const items = (all.length > 12 ? all.filter((c) => c.featured) : all)
      .map(
        (c) => `<label class="pick"><input type="checkbox" name="creations" value="${esc(c.title)}" data-id="${c.id}"><span class="pick__media">${media(c, '160px')}<i class="pick__check">${ICONS.check}</i></span><span class="pick__name">${c.title}</span></label>`,
      )
      .join('');
    return `<div class="picks__group"><p class="picks__title">${cat.title}</p><div class="picks">${items}</div></div>`;
  }).join('');
}

export function faq() {
  return FAQ.map(
    (f) => `<details class="faq__item reveal-up"><summary>${f.q}<span class="faq__icon" aria-hidden="true"></span></summary><div class="faq__a"><p>${f.a}</p></div></details>`,
  ).join('');
}

export function promises() {
  return `<ul class="promises">
  <li>${ICONS.clock}<small>Délai minimum</small><b>${CONTACT.minDelayHours} heures</b></li>
  <li>${ICONS.check}<small>Création</small><b>Sur-mesure</b></li>
  <li>${ICONS.pin}<small>Retrait</small><b>${CONTACT.city}</b></li>
</ul>`;
}

// ─── Page Contact ───
export function channels() {
  return `
<a class="channel channel--featured reveal-up" href="https://wa.me/${CONTACT.whatsapp}" target="_blank" rel="noopener">
  <span class="channel__badge">Recommandé</span>
  <span class="channel__icon">${ICONS.whatsapp}</span>
  <small>Le plus rapide</small><b>WhatsApp</b><span class="channel__value">${CONTACT.phone}</span>
  <span class="channel__sub">Discutez directement avec ${CONTACT.chef.split(' ')[0]}. Réponse souvent dans l’heure.</span>
</a>
<a class="channel reveal-up" href="tel:${tel()}">
  <span class="channel__icon">${ICONS.phone}</span>
  <small>Téléphone</small><b>Appelez-nous</b><span class="channel__value">${CONTACT.phone}</span>
  <span class="channel__sub">${CONTACT.hours}. Pour les demandes urgentes.</span>
</a>
<a class="channel reveal-up" href="mailto:${CONTACT.email}">
  <span class="channel__icon">${ICONS.mail}</span>
  <small>Par écrit</small><b>E-mail</b><span class="channel__value">${CONTACT.email}</span>
  <span class="channel__sub">Pour les demandes détaillées et les projets professionnels.</span>
</a>`;
}

export function atelierInfo() {
  return `<ul class="info-list">
  <li>${ICONS.pin}<div><small>Adresse</small><b>${CONTACT.city}</b><span>${CONTACT.postalCode} · ${CONTACT.region}</span></div></li>
  <li>${ICONS.check}<div><small>Retrait</small><b>À l’atelier</b><span>Sur commande, ${CONTACT.minDelayHours} h minimum</span></div></li>
  <li>${ICONS.clock}<div><small>Disponibilité</small><b>${CONTACT.hours}</b><span>Réponse sous 24 h</span></div></li>
  <li>${ICONS.phone}<div><small>Contact direct</small><b><a class="link-line" href="tel:${tel()}">${CONTACT.phone}</a></b><span><a class="link-line" href="mailto:${CONTACT.email}">${CONTACT.email}</a></span></div></li>
</ul>`;
}

export function socialCards() {
  return `
<a class="social-card reveal-up" href="${CONTACT.instagram}" target="_blank" rel="noopener"><span class="channel__icon">${ICONS.instagram}</span><span><small>Instagram</small><b>L’instant Gourmand</b><span>${CONTACT.instagramHandle}</span></span></a>
<a class="social-card reveal-up" href="${CONTACT.facebook}" target="_blank" rel="noopener"><span class="channel__icon">${ICONS.facebook}</span><span><small>Facebook</small><b>L’instant Gourmand</b><span>${CONTACT.facebookHandle}</span></span></a>`;
}

export const SVG = { logo: () => svg('logo'), wordmark: () => svg('wordmark'), monogram: () => svg('monogram') };
