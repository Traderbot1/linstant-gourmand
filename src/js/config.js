// ─────────────────────────────────────────────────────────────
//  Réglages du site — modifier ici les coordonnées et les catégories.
//  Un champ vide ('') masque automatiquement le bouton correspondant.
// ─────────────────────────────────────────────────────────────
export const CONTACT = {
  email: 'contact@linstantg.com', // TODO : confirmer l'adresse e-mail
  phone: '', // ex. '+33 6 12 34 56 78'
  whatsapp: '', // numéro au format international sans + ni espaces, ex. '33612345678'
  instagram: '', // ex. 'https://www.instagram.com/linstantgourmand'
  facebook: '',
  zone: '', // ex. 'Lyon & alentours — retrait à l’atelier ou livraison'
};

export const CATEGORIES = [
  {
    id: 'personnalises',
    title: 'Gâteaux personnalisés',
    short: 'Anniversaires, fêtes & thèmes',
    text: 'Des pièces uniques imaginées autour de votre histoire : prénom, âge, couleurs, univers.',
  },
  {
    id: 'entremets',
    title: 'Entremets',
    short: 'Mousses, velours & inserts',
    text: 'Textures aériennes, inserts fruités et finitions velours pour les palais exigeants.',
  },
  {
    id: 'coffret',
    title: 'Gâteaux coffret',
    short: 'La surprise dans un écrin',
    text: 'Un gâteau délicatement niché dans son coffret, fleuri et prêt à offrir.',
  },
  {
    id: 'bento',
    title: 'Bento & mini cakes',
    short: 'Le format intime',
    text: 'Petits formats pour deux, messages personnalisés et douceur à partager.',
  },
  {
    id: 'sucre',
    title: 'Douceurs sucrées',
    short: 'Cupcakes, cookies & mignardises',
    text: 'Bouchées gourmandes pour vos tables de fête, buffets et sweet tables.',
  },
  {
    id: 'sale',
    title: 'Salé',
    short: 'Buffets & bouchées',
    text: 'Pièces salées raffinées pour accompagner vos réceptions et apéritifs.',
  },
];
