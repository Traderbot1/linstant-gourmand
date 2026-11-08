// Aperçus de partage (WhatsApp, Facebook, Instagram, LinkedIn, X…) : un par page.
// - `title` / `description` : texte affiché sous l'aperçu
// - `heading` / `eyebrow` / `photo` : contenu de l'image de partage (public/og/<clé>.jpg),
//   générée par `npm run og` (scripts/og-images.mjs) à partir de photos/<photo>.jpg
import { CATEGORIES } from './js/config.js';

const SITE = 'https://linstantg.com';

// Photo de chaque section (dans photos/)
const SECTION_PHOTOS = {
  gateaux: 'gateau-maison-de-luxe',
  bento: 'bento-couronne-perles',
  'trompe-loeil': 'trompe-loeil-cafe',
  tunisiennes: 'tunis-baklava-pistache',
  coffrets: 'coffret-bordeaux',
  sale: 'sale-buffet-festif',
  jus: 'jus-rubis',
};

export const OG_PAGES = {
  home: {
    path: '/',
    title: 'L’instant Gourmand — Pâtisserie franco-tunisienne sur commande',
    description: 'Gâteaux personnalisés, trompe-l’œil, douceurs tunisiennes, coffrets et salé, imaginés par Jihene Chaieb dans son atelier de La Garenne-Colombes.',
    eyebrow: 'Pâtisserie franco-tunisienne',
    heading: 'L’art de l’instant',
    photo: 'gateau-birthday-queen',
  },
  creations: {
    path: '/creations/',
    title: 'Nos créations — L’instant Gourmand',
    description: 'Gâteaux, bento cakes, trompe-l’œil, douceurs tunisiennes, coffrets, salé et jus : toutes les créations de l’atelier, sur commande.',
    eyebrow: 'La galerie',
    heading: 'Nos créations',
    photo: 'gateau-birthday-queen',
  },
  ...Object.fromEntries(
    CATEGORIES.map((c) => [
      c.id,
      {
        path: `/creations/${c.id}/`,
        title: `${c.title} — L’instant Gourmand`,
        description: c.text,
        eyebrow: 'Nos créations',
        heading: c.title,
        photo: SECTION_PHOTOS[c.id],
      },
    ]),
  ),
  commander: {
    path: '/commander/',
    title: 'Commander — L’instant Gourmand',
    description: 'Décrivez votre projet en quelques minutes : Jihene vous répond par WhatsApp sous 24 h. Retrait à La Garenne-Colombes, 48 h minimum.',
    eyebrow: 'Sur commande · 48 h minimum',
    heading: 'Composez votre instant',
    photo: 'gateau-bonne-fete-maman',
  },
  contact: {
    path: '/contact/',
    title: 'Contact — L’instant Gourmand',
    description: 'WhatsApp et téléphone +33 6 59 15 00 66, contact@linstantg.com. Atelier à La Garenne-Colombes (92250), retrait sur commande.',
    eyebrow: 'Restons en contact',
    heading: 'Parlons de votre projet',
    photo: 'coffret-prestige',
  },
};

export const ogImageUrl = (key) => `${SITE}/og/${key}.jpg`;
export const pageUrl = (key) => `${SITE}${OG_PAGES[key].path}`;
