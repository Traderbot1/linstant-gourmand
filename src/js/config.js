// ─────────────────────────────────────────────────────────────
//  Réglages du site — modifier ici les coordonnées et les catégories.
//  Un champ vide ('') masque automatiquement le bouton correspondant.
// ─────────────────────────────────────────────────────────────
export const CONTACT = {
  chef: 'Jihene Chaieb',
  email: 'contact@linstantg.com',
  phone: '+33 6 59 15 00 66',
  whatsapp: '33659150066', // format international, sans + ni espaces
  instagram: 'https://www.instagram.com/l_instant_gourmand9',
  instagramHandle: '@l_instant_gourmand9',
  facebook: 'https://www.facebook.com/LInstantGourmand99',
  facebookHandle: '@LInstantGourmand99',
  city: 'La Garenne-Colombes',
  postalCode: '92250',
  region: 'Hauts-de-Seine',
  pickup: 'Retrait à l’atelier de La Garenne-Colombes',
  hours: 'Lundi au samedi · 9h – 19h',
  minDelayHours: 48,
};

// Les sections du menu « Créations » : chacune a sa page /creations/<id>/.
// `tags` (facultatif) = sous-filtres affichés sur la page de la section.
export const CATEGORIES = [
  {
    id: 'gateaux',
    title: 'Gâteaux',
    short: 'Anniversaires, enfants, fêtes & sur-mesure',
    text: 'Des pièces uniques imaginées autour de votre histoire : prénom, âge, thème, couleurs. Comptez 5 à 7 jours pour une création sur-mesure.',
    tags: ['Anniversaire', 'Enfants', 'Naissance', 'Amour', 'Fêtes'],
  },
  {
    id: 'trompe-loeil',
    title: 'Trompe-l’œil',
    short: 'Les signatures de la maison',
    text: 'L’illusion parfaite : des entremets qui ressemblent à s’y méprendre à une cacahuète ou à un grain de café.',
  },
  {
    id: 'tunisiennes',
    title: 'Douceurs tunisiennes',
    short: 'Bourgeois, Naïem, baklavas, Ramadan',
    text: 'L’héritage tunisien sublimé par la rigueur de la pâtisserie française : pistache, miel d’oranger, croquant et fondant à la fois.',
  },
  {
    id: 'coffrets',
    title: 'Coffrets',
    short: 'Des écrins à offrir',
    text: 'Coffrets assortis, éditions saisonnières et compositions sur-mesure, pour offrir ou pour recevoir.',
  },
  {
    id: 'sale',
    title: 'Salé',
    short: 'Fricassés, wraps & burgers',
    text: 'Fricassés au thon, mini wraps, burgers gourmets : une généreuse parenthèse méditerranéenne pour vos brunchs, apéritifs et événements.',
  },
  {
    id: 'jus',
    title: 'Jus',
    short: 'Jus maison',
    text: 'Des jus maison pour accompagner vos tables de fête, brunchs et événements.',
  },
];

export const OCCASIONS = [
  { value: 'Mariage', sub: 'Pièce montée, coffrets cadeaux' },
  { value: 'Anniversaire', sub: 'Gâteau d’anniversaire, mignardises' },
  { value: 'Ramadan / Eid', sub: 'Pâtisseries traditionnelles, coffrets' },
  { value: 'Baptême / Communion', sub: 'Mignardises, pièce centrale' },
  { value: 'Événement professionnel', sub: 'Brunch, séminaire, cadeau client' },
  { value: 'Pour le plaisir', sub: 'Une envie de gourmandise' },
];

export const FAQ = [
  {
    q: 'Quel est le délai minimum pour commander ?',
    a: 'Le délai minimum est de 48 heures pour la plupart de nos créations. Pour les pièces sur-mesure (gâteaux d’anniversaire, mariages, événements de grande ampleur), comptez plutôt 5 à 7 jours. Plus vous commandez tôt, plus Jihene peut peaufiner votre création dans les moindres détails.',
  },
  {
    q: 'Où venir chercher ma commande ?',
    a: 'Les commandes sont à retirer directement à notre atelier de La Garenne-Colombes (92250), dans les Hauts-de-Seine. L’adresse exacte et les modalités de retrait vous sont communiquées par Jihene après confirmation de votre commande. Le créneau de retrait est défini ensemble selon vos disponibilités.',
  },
  {
    q: 'Comment se passe le paiement ?',
    a: 'Une fois le devis validé, un acompte de 30 % est demandé pour confirmer votre commande. Le solde est réglé au moment du retrait, en espèces ou par virement. Pour les commandes professionnelles, des conditions de facturation spécifiques peuvent être convenues.',
  },
  {
    q: 'Puis-je personnaliser une création (saveurs, couleurs, taille) ?',
    a: 'Absolument, c’est tout l’esprit de la maison. Jihene adapte saveurs, taille, présentation et thème selon vos envies. Allergies, intolérances, préférences : tout est pris en compte. Précisez-le dans le formulaire ou lors de votre échange avec elle.',
  },
  {
    q: 'Combien de temps les pâtisseries se conservent-elles ?',
    a: 'Nos créations sont fraîches et préparées à la main, sans conservateurs. Les pâtisseries sucrées se conservent 2 à 3 jours au réfrigérateur dans leur écrin. Les fricassés et créations salées sont à consommer dans les 24 à 48 heures suivant le retrait. Jihene vous indique les conditions de conservation de chaque produit.',
  },
  {
    q: 'Proposez-vous des cadeaux d’entreprise ?',
    a: 'Oui : cadeaux clients, événements internes (séminaires, brunchs, lancements presse) et cadeaux de fin d’année. Coffrets personnalisables avec votre logo, commandes groupées, facturation pro : contactez-nous pour un projet sur-mesure.',
  },
];
