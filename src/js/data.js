// ─────────────────────────────────────────────────────────────
//  Les créations affichées sur le site.
//  `image` = nom de la photo dans public/img/ (sans -800.webp / -1400.webp).
//  Tant que la photo n'existe pas, une tuile « photo à venir » s'affiche.
//  Pour importer les photos : voir le README (npm run photos).
//  `category` doit correspondre à un `id` de CATEGORIES (config.js).
// ─────────────────────────────────────────────────────────────
export const CREATIONS = [
  // Gâteaux (featured: true = mis en avant sur l’accueil)
  { id: 'velours-violet', title: 'Velours Améthyste', category: 'gateaux', tag: 'Anniversaire', description: 'Finition velours lavande, col déchiré et cascade de fleurs pailletées d’or.', image: 'gateau-velours-violet', featured: true },
  { id: 'maison-noel', title: 'Maison de Noël', category: 'gateaux', tag: 'Fêtes', description: 'Façade de maison en sucre, sapins, lanternes et couronne de Noël.', image: 'gateau-maison-noel', featured: true },
  { id: 'vintage-rubans', title: 'Vintage aux rubans', category: 'gateaux', tag: 'Anniversaire', description: 'Style vintage, poches de crème et nœuds de satin rose, présenté dans sa boîte.', image: 'gateau-vintage-rubans' },
  { id: 'bienvenue-bebe', title: 'Bienvenue bébé', category: 'gateaux', tag: 'Naissance', description: 'Bébé endormi sur son coussin et décor toile de Jouy bleu.', image: 'gateau-bienvenue-bebe' },
  { id: 'initiales-dorees', title: 'Initiales dorées', category: 'gateaux', tag: 'Amour', description: 'Topper de couple, initiales dorées, roses blanches et voile rosé.', image: 'gateau-initiales-dorees', featured: true },
  { id: 'omra', title: 'Omra Makboula', category: 'gateaux', tag: 'Fêtes', description: 'Mosquée et chapelet en chocolat, message en calligraphie arabe.', image: 'gateau-omra' },
  { id: 'nuage-velours', title: 'Nuage Velours', category: 'gateaux', tag: 'Anniversaire', description: 'Entremets aux courbes de nuage, effet velours blanc et chiffres bleu nuit.', image: 'entremets-velours-36' },
  { id: 'true-love', title: 'True Love', category: 'gateaux', tag: 'Amour', description: 'Gâteau rouge passion, ourson, cœurs et petit cadeau en pâte à sucre.', image: 'gateau-love-ourson' },
  { id: 'village-schtroumpfs', title: 'Le petit village', category: 'gateaux', tag: 'Enfants', description: 'Maison champignon, petits lutins bleus et prénom en relief.', image: 'gateau-village-schtroumpfs', featured: true },
  { id: 'happy-new-home', title: 'Happy New Home', category: 'gateaux', tag: 'Fêtes', description: 'Pour une crémaillère : clé dorée, porte d’entrée et lierre en sucre.', image: 'gateau-happy-new-home' },
  { id: 'ninja', title: 'Ninja', category: 'gateaux', tag: 'Enfants', description: 'Héros de manga et flammes pour un 16e anniversaire.', image: 'gateau-ninja' },
  { id: 'bonne-fete-maman', title: 'Bonne Fête Maman', category: 'gateaux', tag: 'Fêtes', description: 'Écrin framboise bordé d’or, bouquet de fleurs et perles dorées, message personnalisé.', image: 'gateau-bonne-fete-maman', featured: true },
  { id: 'kpop', title: 'K-pop', category: 'gateaux', tag: 'Enfants', description: 'Rose et noir, photo imprimée, nœuds et meringues.', image: 'gateau-kpop' },
  { id: 'best-dad', title: 'Best Dad', category: 'gateaux', tag: 'Fêtes', description: 'Costume bleu, nœud papillon et boutons dorés pour la fête des pères.', image: 'gateau-best-dad' },
  { id: 'halloween', title: 'Halloween', category: 'gateaux', tag: 'Fêtes', description: 'Orange citrouille, sorcière, maison hantée et arbres noirs.', image: 'gateau-halloween' },
  { id: 'sous-l-ocean', title: 'Sous l’océan', category: 'gateaux', tag: 'Enfants', description: 'Crabe, poulpe, coquillages et vagues colorées.', image: 'gateau-sous-l-ocean' },
  { id: 'birthday-queen', title: 'Birthday Queen', category: 'gateaux', tag: 'Anniversaire', description: 'Cœur rouge, couronne dorée et lettrage « Queen ».', image: 'gateau-birthday-queen', featured: true },
  { id: 'ourson-pastel', title: 'Ourson pastel', category: 'gateaux', tag: 'Naissance', description: 'Vert d’eau, ourson en sucre, étoiles et papillons.', image: 'gateau-ourson-pastel' },
  { id: 'pop-stars', title: 'Pop stars', category: 'gateaux', tag: 'Enfants', description: 'Rose bonbon, chanteuses en topper et accessoires de scène.', image: 'gateau-pop-stars' },
  { id: 'chantier', title: 'Le chantier', category: 'gateaux', tag: 'Enfants', description: 'Pelleteuse, grue et rubalise pour un 2e anniversaire.', image: 'gateau-chantier' },
  { id: 'pat-patrouille', title: 'Pat’ Patrouille', category: 'gateaux', tag: 'Enfants', description: 'Les chiots sauveteurs en topper et prénom en couleurs.', image: 'gateau-pat-patrouille' },
  { id: 'plumes-roses', title: 'Plumes roses', category: 'gateaux', tag: 'Anniversaire', description: 'Crème vanille, poches rosées, rubans et topper plume.', image: 'gateau-plumes-roses' },
  { id: 'reine-des-neiges', title: 'Reine des neiges', category: 'gateaux', tag: 'Enfants', description: 'Princesse des glaces, flocons et étoiles en sucre.', image: 'gateau-reine-des-neiges' },
  { id: 'super-heros', title: 'Super-héros', category: 'gateaux', tag: 'Enfants', description: 'Gratte-ciel, toile d’araignée et héros masqué.', image: 'gateau-super-heros', featured: true },
  { id: 'maison-de-luxe', title: 'Maison de luxe', category: 'gateaux', tag: 'Anniversaire', description: 'Orange iconique, sac et ceinture en sucre pour un 40e anniversaire.', image: 'gateau-maison-de-luxe', featured: true },
  { id: 'train-des-animaux', title: 'Le train des animaux', category: 'gateaux', tag: 'Naissance', description: 'Locomotive, tronc en chocolat et petits wagons d’animaux.', image: 'gateau-train-des-animaux' },
  { id: 'premiere-bougie', title: 'Première bougie', category: 'gateaux', tag: 'Enfants', description: 'Style vintage, crème et rubans roses pour fêter un premier anniversaire.', image: 'gateau-premiere-bougie' },
  { id: 'baby', title: 'Baby', category: 'gateaux', tag: 'Naissance', description: 'Cubes « BABY », ourson et sphères chocolat pour une baby shower.', image: 'gateau-baby', featured: true },
  { id: 'pat-patrouille-rose', title: 'Pat’ Patrouille rose', category: 'gateaux', tag: 'Enfants', description: 'Rose bonbon, os en sucre et petite héroïne volante.', image: 'gateau-pat-patrouille-rose' },
  { id: 'i-love-you', title: 'I Love You', category: 'gateaux', tag: 'Amour', description: 'Petits amoureux et lettre d’amour sur un gâteau rouge.', image: 'gateau-i-love-you' },
  { id: 'mum', title: 'Mum', category: 'gateaux', tag: 'Fêtes', description: 'Rose poudré, lettrage doré et illustration pour la fête des mères.', image: 'gateau-mum' },

  // Trompe-l'œil
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
