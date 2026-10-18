// ─────────────────────────────────────────────────────────────
//  Les créations affichées sur le site.
//  `image` = nom de la photo dans public/img/ (sans -800.webp / -1400.webp).
//  Tant que la photo n'existe pas, une tuile « photo à venir » s'affiche.
//  Pour importer les photos : voir le README (npm run photos).
//  `category` doit correspondre à un `id` de CATEGORIES (config.js).
// ─────────────────────────────────────────────────────────────
export const CREATIONS = [
  // Gâteaux personnalisés
  {
    id: 'velours-violet',
    title: 'Velours Améthyste',
    category: 'personnalises',
    tag: 'Anniversaire',
    description: 'Finition velours lavande, col déchiré et cascade de fleurs pailletées d’or.',
    image: 'gateau-velours-violet',
  },
  {
    id: 'bonne-fete-maman',
    title: 'Bonne Fête Maman',
    category: 'personnalises',
    tag: 'Fête des mères',
    description: 'Écrin framboise bordé d’or, bouquet de fleurs et perles dorées, message personnalisé.',
    image: 'gateau-bonne-fete-maman',
  },
  {
    id: 'love-ourson',
    title: 'True Love',
    category: 'personnalises',
    tag: 'Saint-Valentin',
    description: 'Gâteau rouge passion, ourson, cœurs et petit cadeau en pâte à sucre.',
    image: 'gateau-love-ourson',
  },
  {
    id: 'anniversaire-sur-mesure',
    title: 'Anniversaire sur-mesure',
    category: 'personnalises',
    tag: 'Sur-mesure',
    description: 'Votre thème, vos couleurs, votre prénom : un gâteau d’anniversaire imaginé pour vous.',
    image: 'gateau-anniversaire',
  },

  // Trompe-l'œil & entremets
  {
    id: 'trompe-loeil-cacahuete',
    title: 'Cacahuète',
    category: 'trompe-loeil',
    tag: 'Trompe-l’œil signature',
    description: 'L’illusion parfaite. Une coque dorée, un cœur fondant praliné qui défie l’œil.',
    image: 'trompe-loeil-cacahuete',
  },
  {
    id: 'trompe-loeil-cafe',
    title: 'Café',
    category: 'trompe-loeil',
    tag: 'Trompe-l’œil signature',
    description: 'Un grain de café réinventé. Mousse arabica, cœur coulant chocolat noir.',
    image: 'trompe-loeil-cafe',
  },
  {
    id: 'entremets-36',
    title: 'Nuage Velours',
    category: 'trompe-loeil',
    tag: 'Entremets',
    description: 'Entremets aux courbes de nuage, effet velours blanc et chiffres bleu nuit.',
    image: 'entremets-velours-36',
  },

  // Douceurs tunisiennes
  {
    id: 'pistache-ramadan',
    title: 'Pistache',
    category: 'tunisiennes',
    tag: 'Création signature',
    description: 'L’âme du Ramadan. Pistache concassée d’Iran, miel d’oranger, croquant et fondant à la fois.',
    image: 'gateau-pistache-ramadan',
  },
  {
    id: 'rose-naiem',
    title: 'Rose Naïem',
    category: 'tunisiennes',
    tag: 'Tradition tunisienne',
    description: 'Une douceur de la tradition tunisienne, parfumée à la rose.',
    image: 'gateau-rose-naiem',
  },
  {
    id: 'bourgeois',
    title: 'Bourgeois',
    category: 'tunisiennes',
    tag: 'Tradition tunisienne',
    description: 'Un grand classique de la pâtisserie tunisienne, préparé à l’atelier.',
    image: 'gateau-bourgeois',
  },
  {
    id: 'baklava-pistache',
    title: 'Baklava pistache',
    category: 'tunisiennes',
    tag: 'Tradition tunisienne',
    description: 'Feuilletage croustillant, pistache généreuse et miel.',
    image: 'baklava-pistache',
  },

  // Coffrets
  {
    id: 'coffret-bordeaux',
    title: 'Coffret Bordeaux',
    category: 'coffrets',
    tag: '4 assortiments',
    description: 'Le coffret signature aux couleurs de la maison, garni de quatre assortiments.',
    image: 'coffret-bordeaux-4',
  },
  {
    id: 'coffret-decouverte',
    title: 'Coffret Découverte',
    category: 'coffrets',
    tag: '7 assortiments',
    description: 'Sept assortiments pour découvrir toute la palette de l’atelier.',
    image: 'coffret-decouverte-7',
  },
  {
    id: 'coffret-luxe',
    title: 'Coffret Luxe',
    category: 'coffrets',
    tag: 'Pistache & pignon',
    description: 'Une sélection d’exception à la pistache et au pignon.',
    image: 'coffret-luxe-pistache-pignon',
  },
  {
    id: 'trio-eid',
    title: 'Trio Eid Moubarak',
    category: 'coffrets',
    tag: 'Édition saisonnière',
    description: 'Trois coffrets pistache et pignon pour célébrer l’Aïd.',
    image: 'coffret-trio-eid',
  },
  {
    id: 'coffret-blanc',
    title: 'Coffret Blanc',
    category: 'coffrets',
    tag: 'Biscuits artisanaux',
    description: 'Un écrin blanc garni de biscuits artisanaux.',
    image: 'coffret-blanc-biscuits',
  },
  {
    id: 'composition-sur-mesure',
    title: 'Composition sur-mesure',
    category: 'coffrets',
    tag: 'Gâteaux & coffrets',
    description: 'Coffrets et gâteaux réunis dans une composition pensée pour votre événement.',
    image: 'composition-sur-mesure',
  },

  // Salé
  {
    id: 'fricasse-thon',
    title: 'Fricassés au thon',
    category: 'sale',
    tag: 'Salé',
    description: 'Le fricassé tunisien, généreusement garni au thon.',
    image: 'fricasse-thon',
  },
  {
    id: 'mini-wrap-poulet',
    title: 'Mini wraps poulet',
    category: 'sale',
    tag: 'Salé',
    description: 'Des bouchées roulées au poulet pour vos brunchs et apéritifs.',
    image: 'mini-wrap-poulet',
  },
  {
    id: 'burgers-gourmets',
    title: 'Burgers gourmets',
    category: 'sale',
    tag: 'Salé',
    description: 'Mini burgers gourmets pour vos buffets et événements.',
    image: 'burgers-gourmets',
  },
];
