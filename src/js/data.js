// ─────────────────────────────────────────────────────────────
//  Les créations affichées sur le site.
//  `image` = nom de la photo dans public/img/ (sans -800.webp / -1400.webp).
//  Tant que la photo n'existe pas, une tuile « photo à venir » s'affiche.
//  Pour importer les photos : voir le README (npm run photos).
//  `category` doit correspondre à un `id` de CATEGORIES (config.js) ; `also` = autres sections où l'afficher.
// ─────────────────────────────────────────────────────────────
export const CREATIONS = [
  // Gâteaux (featured: true = mis en avant sur l’accueil)
  { id: 'birthday-queen', title: 'Birthday Queen', category: 'gateaux', tag: 'Anniversaire', description: 'Cœur rouge, couronne dorée et lettrage « Queen ».', image: 'gateau-birthday-queen', featured: true },
  { id: 'maison-de-luxe', title: 'Maison de luxe', category: 'gateaux', tag: 'Anniversaire', description: 'Orange iconique, sac et ceinture en sucre pour un 40e anniversaire.', image: 'gateau-maison-de-luxe', featured: true },
  { id: 'velours-violet', title: 'Velours Améthyste', category: 'gateaux', tag: 'Anniversaire', description: 'Finition velours lavande, col déchiré et cascade de fleurs pailletées d’or.', image: 'gateau-velours-violet', featured: true },
  { id: 'maison-noel', title: 'Maison de Noël', category: 'gateaux', tag: 'Fêtes', description: 'Façade de maison en sucre, sapins, lanternes et couronne de Noël.', image: 'gateau-maison-noel', featured: true },
  { id: 'vintage-rubans', title: 'Vintage aux rubans', category: 'gateaux', tag: 'Anniversaire', description: 'Style vintage, poches de crème et nœuds de satin rose, présenté dans sa boîte.', image: 'gateau-vintage-rubans' },
  { id: 'bienvenue-bebe', title: 'Bienvenue bébé', category: 'gateaux', tag: 'Naissance', description: 'Bébé endormi sur son coussin et décor toile de Jouy bleu.', image: 'gateau-bienvenue-bebe' },
  { id: 'initiales-dorees', title: 'Initiales dorées', category: 'gateaux', tag: 'Amour', description: 'Topper de couple, initiales dorées, roses blanches et voile rosé.', image: 'gateau-initiales-dorees', featured: true },
  { id: 'omra', title: 'Omra Makboula', category: 'gateaux', tag: 'Fêtes', description: 'Mosquée et chapelet en chocolat, message en calligraphie arabe.', image: 'gateau-omra' },
  { id: 'true-love', title: 'True Love', category: 'gateaux', tag: 'Amour', description: 'Gâteau rouge passion, ourson, cœurs et petit cadeau en pâte à sucre.', image: 'gateau-love-ourson' },
  { id: 'village-schtroumpfs', title: 'Le petit village', category: 'gateaux', tag: 'Enfants', description: 'Maison champignon, petits lutins bleus et prénom en relief.', image: 'gateau-village-schtroumpfs', featured: true },
  { id: 'happy-new-home', title: 'Happy New Home', category: 'gateaux', tag: 'Fêtes', description: 'Pour une crémaillère : clé dorée, porte d’entrée et lierre en sucre.', image: 'gateau-happy-new-home' },
  { id: 'ninja', title: 'Ninja', category: 'gateaux', tag: 'Enfants', description: 'Héros de manga et flammes pour un 16e anniversaire.', image: 'gateau-ninja' },
  { id: 'bonne-fete-maman', title: 'Bonne Fête Maman', category: 'gateaux', tag: 'Fêtes', description: 'Écrin framboise bordé d’or, bouquet de fleurs et perles dorées, message personnalisé.', image: 'gateau-bonne-fete-maman', featured: true },
  { id: 'kpop', title: 'K-pop', category: 'gateaux', tag: 'Enfants', description: 'Rose et noir, photo imprimée, nœuds et meringues.', image: 'gateau-kpop' },
  { id: 'best-dad', title: 'Best Dad', category: 'gateaux', tag: 'Fêtes', description: 'Costume bleu, nœud papillon et boutons dorés pour la fête des pères.', image: 'gateau-best-dad' },
  { id: 'halloween', title: 'Halloween', category: 'gateaux', tag: 'Fêtes', description: 'Orange citrouille, sorcière, maison hantée et arbres noirs.', image: 'gateau-halloween' },
  { id: 'sous-l-ocean', title: 'Sous l’océan', category: 'gateaux', tag: 'Enfants', description: 'Crabe, poulpe, coquillages et vagues colorées.', image: 'gateau-sous-l-ocean' },
  { id: 'ourson-pastel', title: 'Ourson pastel', category: 'gateaux', tag: 'Naissance', description: 'Vert d’eau, ourson en sucre, étoiles et papillons.', image: 'gateau-ourson-pastel' },
  { id: 'pop-stars', title: 'Pop stars', category: 'gateaux', tag: 'Enfants', description: 'Rose bonbon, chanteuses en topper et accessoires de scène.', image: 'gateau-pop-stars' },
  { id: 'chantier', title: 'Le chantier', category: 'gateaux', tag: 'Enfants', description: 'Pelleteuse, grue et rubalise pour un 2e anniversaire.', image: 'gateau-chantier' },
  { id: 'pat-patrouille', title: 'Pat’ Patrouille', category: 'gateaux', tag: 'Enfants', description: 'Les chiots sauveteurs en topper et prénom en couleurs.', image: 'gateau-pat-patrouille' },
  { id: 'plumes-roses', title: 'Plumes roses', category: 'gateaux', tag: 'Anniversaire', description: 'Crème vanille, poches rosées, rubans et topper plume.', image: 'gateau-plumes-roses' },
  { id: 'reine-des-neiges', title: 'Reine des neiges', category: 'gateaux', tag: 'Enfants', description: 'Princesse des glaces, flocons et étoiles en sucre.', image: 'gateau-reine-des-neiges' },
  { id: 'super-heros', title: 'Super-héros', category: 'gateaux', tag: 'Enfants', description: 'Gratte-ciel, toile d’araignée et héros masqué.', image: 'gateau-super-heros', featured: true },
  { id: 'train-des-animaux', title: 'Le train des animaux', category: 'gateaux', tag: 'Naissance', description: 'Locomotive, tronc en chocolat et petits wagons d’animaux.', image: 'gateau-train-des-animaux' },
  { id: 'premiere-bougie', title: 'Première bougie', category: 'gateaux', tag: 'Enfants', description: 'Style vintage, crème et rubans roses pour fêter un premier anniversaire.', image: 'gateau-premiere-bougie' },
  { id: 'baby', title: 'Baby', category: 'gateaux', tag: 'Naissance', description: 'Cubes « BABY », ourson et sphères chocolat pour une baby shower.', image: 'gateau-baby', featured: true },
  { id: 'pat-patrouille-rose', title: 'Pat’ Patrouille rose', category: 'gateaux', tag: 'Enfants', description: 'Rose bonbon, os en sucre et petite héroïne volante.', image: 'gateau-pat-patrouille-rose' },
  { id: 'i-love-you', title: 'I Love You', category: 'gateaux', tag: 'Amour', description: 'Petits amoureux et lettre d’amour sur un gâteau rouge.', image: 'gateau-i-love-you' },
  { id: 'mum', title: 'Mum', category: 'gateaux', tag: 'Fêtes', description: 'Rose poudré, lettrage doré et illustration pour la fête des mères.', image: 'gateau-mum' },

  // Bento cakes
  { id: 'bento-couronne-perles', title: 'Couronne de perles', category: 'bento', tag: 'Bento', description: 'Velours prune, perles nacrées et couronne dorée : un petit gâteau de reine.', image: 'bento-couronne-perles', featured: true },
  { id: 'bento-bleu-nuit', title: 'Bleu nuit', category: 'bento', tag: 'Bento', description: 'Fleur de velours bleu nuit et plaque au message personnalisé.', image: 'bento-bleu-nuit' },
  { id: 'bento-nuage-blanc', title: 'Nuage blanc', category: 'bento', tag: 'Bento', description: 'Nuage de velours blanc, chiffres bleu nuit et médaillon « Happy Birthday ».', image: 'bento-nuage-blanc' },

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
    featured: true,
    title: 'Café',
    category: 'trompe-loeil',
    tag: 'Trompe-l’œil signature',
    description: 'Un grain de café réinventé. Mousse arabica, cœur coulant chocolat noir.',
    image: 'trompe-loeil-cafe',
  },

  // Douceurs tunisiennes
  { id: 'baklava-pistache', title: 'Baklava pistache', category: 'tunisiennes', tag: 'Mignardises', description: 'Feuilletage croustillant, pistache généreuse et miel.', image: 'tunis-baklava-pistache', featured: true },
  { id: 'ramadan-mubarak', title: 'Ramadan Mubarak', category: 'tunisiennes', tag: 'Ramadan & Aïd', description: 'Grand gâteau croustillant, pistache, boutons de rose et médaillon doré.', image: 'tunis-gateau-ramadan-mubarak', featured: true },
  { id: 'tarte-pistache-ramadan', title: 'Croissant doré', category: 'tunisiennes', tag: 'Ramadan & Aïd', description: 'Tarte à la pistache, croissant de lune et calligraphie dorés.', image: 'tunis-tarte-pistache-ramadan' },
  { id: 'croissant-de-lune', title: 'Croissant de lune', category: 'tunisiennes', tag: 'Ramadan & Aïd', description: 'Gâteau en croissant de lune et sablés aux motifs de l’Aïd.', image: 'tunis-croissant-de-lune' },
  { id: 'pops-ramadan', title: 'Pops de l’Aïd', category: 'tunisiennes', tag: 'Ramadan & Aïd', description: 'Bouchées aux fruits secs en sucettes dorées, présentoir « Ramadan Mubarak ».', image: 'tunis-pops-ramadan' },
  { id: 'biscuits-aid', title: 'Biscuits de l’Aïd', category: 'tunisiennes', tag: 'Ramadan & Aïd', description: 'Biscuits à la poche et doigts à la pistache, sur plateau doré.', image: 'tunis-biscuits-aid' },
  { id: 'coupes-pralinees', title: 'Coupes pralinées', category: 'tunisiennes', tag: 'Verrines', description: 'Coupes aux fruits secs, noix de pécan et médaillons gravés.', image: 'tunis-coupes-pralinees' },
  { id: 'verrines-pistache', title: 'Verrines pistache', category: 'tunisiennes', tag: 'Verrines', description: 'Crème onctueuse, pistache et médaillon à l’effigie de l’Aïd.', image: 'tunis-verrines-pistache' },
  { id: 'creme-fruits-secs', title: 'Crème aux fruits secs', category: 'tunisiennes', tag: 'Verrines', description: 'Crème gourmande sous une pluie de fruits secs concassés.', image: 'tunis-creme-fruits-secs' },
  { id: 'cigares-creme', title: 'Cigares & crème', category: 'tunisiennes', tag: 'Verrines', description: 'Cigares croustillants et crème onctueuse à la pistache.', image: 'tunis-cigares-creme' },
  { id: 'carres-chocolat-pistache', title: 'Carrés chocolat-pistache', category: 'tunisiennes', tag: 'Mignardises', description: 'Carrés gravés au chocolat noir et blanc, cœur pistache.', image: 'tunis-carres-chocolat-pistache' },
  { id: 'presentoir-dore', title: 'Présentoir doré', category: 'tunisiennes', tag: 'Mignardises', description: 'Mignardises pistache et fruits secs sur présentoir cœur.', image: 'tunis-presentoir-dore' },
  { id: 'nids-pistache', title: 'Nids & perles', category: 'tunisiennes', tag: 'Mignardises', description: 'Boules à la pistache et nids aux perles de chocolat.', image: 'tunis-nids-pistache' },
  { id: 'assortiment-mignardises', title: 'Assortiment de mignardises', category: 'tunisiennes', tag: 'Mignardises', description: 'Un plateau de mignardises variées pour vos tables de fête.', image: 'tunis-assortiment-mignardises' },
  { id: 'triangles-gourmands', title: 'Triangles gourmands', category: 'tunisiennes', tag: 'Mignardises', description: 'Pistache, praliné, chocolat blanc et chocolat noir.', image: 'tunis-triangles-gourmands' },
  { id: 'rouleaux-pistache', title: 'Rouleaux pistache', category: 'tunisiennes', tag: 'Mignardises', description: 'Rouleaux croustillants au sirop, bouts à la pistache.', image: 'tunis-rouleaux-pistache' },
  { id: 'noix-gourmandes', title: 'Noix gourmandes', category: 'tunisiennes', tag: 'Mignardises', description: 'Biscuits en forme de noix, garnis de fruits secs.', image: 'tunis-noix-gourmandes' },
  { id: 'noix-fourrees', title: 'Noix fourrées', category: 'tunisiennes', tag: 'Mignardises', description: 'Coques dorées garnies de pignons, pistaches et perles.', image: 'tunis-noix-fourrees' },
  { id: 'sables-confiture', title: 'Sablés à la confiture', category: 'tunisiennes', tag: 'Mignardises', description: 'Sablés fleuris et biscuits fourrés à la confiture.', image: 'tunis-sables-confiture' },
  { id: 'gateau-semoule', title: 'Gâteau de semoule', category: 'tunisiennes', tag: 'Gâteaux & tartes', description: 'Moelleux de semoule doré, pistaches et amandes.', image: 'tunis-gateau-semoule' },
  { id: 'coupes-fruitees', title: 'Coupes fruitées', category: 'tunisiennes', tag: 'Verrines', description: 'Fraise, banane et pistache en coupe individuelle.', image: 'tunis-coupes-fruitees' },

  // Coffrets (visibles aussi dans « Douceurs tunisiennes »)
  { id: 'coffret-bordeaux', title: 'Coffret Bordeaux', category: 'coffrets', tag: 'Coffret', description: 'Le coffret signature aux couleurs de la maison : douze douceurs assorties.', image: 'coffret-bordeaux', featured: true, also: ['tunisiennes'] },
  { id: 'coffret-prestige', title: 'Coffret Prestige', category: 'coffrets', tag: 'Coffret', description: 'Seize pièces : chocolat, amande, pistache et madeleines dorées.', image: 'coffret-prestige', also: ['tunisiennes'] },
  { id: 'coffret-rose', title: 'Coffret Rose', category: 'coffrets', tag: 'Coffret', description: 'Neuf mignardises pistache, amande et chocolat dans un écrin rose.', image: 'coffret-rose', also: ['tunisiennes'] },
  { id: 'coffret-blanc', title: 'Coffret Blanc', category: 'coffrets', tag: 'Coffret', description: 'Un écrin blanc garni de biscuits artisanaux.', image: 'coffret-blanc', also: ['tunisiennes'] },

  // Salé (les box apparaissent aussi dans « Coffrets »)
  { id: 'buffet-festif', title: 'Buffet festif', category: 'sale', tag: 'Buffets', description: 'Un buffet complet autour du gâteau Maison de luxe : sandwichs, bouchées et douceurs.', image: 'sale-buffet-festif', featured: true },
  { id: 'plateau-prestige', title: 'Plateau prestige', category: 'sale', tag: 'Plateaux', description: 'Mini burgers, tartelettes, feuilletés et canapés.', image: 'sale-plateau-prestige', featured: true },
  { id: 'fricasse-thon', title: 'Fricassés', category: 'sale', tag: 'Box & coffrets', description: 'Le fricassé tunisien garni au thon et aux olives, en coffret.', image: 'sale-fricasses', also: ['coffrets'] },
  { id: 'burgers-gourmets', title: 'Mini burgers', category: 'sale', tag: 'Box & coffrets', description: 'Mini burgers gourmets et tomates cerises, en coffret.', image: 'sale-mini-burgers', also: ['coffrets'] },
  { id: 'box-wraps', title: 'Box de wraps', category: 'sale', tag: 'Box & coffrets', description: 'Wraps croustillants noués à la main, en coffret.', image: 'sale-box-wraps', also: ['coffrets'] },
  { id: 'coffret-mediterranee', title: 'Coffret Méditerranée', category: 'sale', tag: 'Box & coffrets', description: 'Verrines de crevettes, carrés et bricks en coffret.', image: 'sale-coffret-mediterranee', also: ['coffrets'] },
  { id: 'coffret-brunch', title: 'Coffret brunch', category: 'sale', tag: 'Box & coffrets', description: 'Verrines, sandwichs croustillants et salades, en coffret.', image: 'sale-coffret-brunch', also: ['coffrets'] },
  { id: 'box-kraft', title: 'Box apéritive', category: 'sale', tag: 'Box & coffrets', description: 'Sandwichs et pains garnis présentés en box kraft.', image: 'sale-box-kraft' },
  { id: 'grand-buffet', title: 'Grand buffet', category: 'sale', tag: 'Buffets', description: 'Mini burgers, croissants garnis et bouchées pour vos réceptions.', image: 'sale-grand-buffet' },
  { id: 'plateau-gourmand', title: 'Plateau gourmand', category: 'sale', tag: 'Plateaux', description: 'Crevettes, croquettes, sandwichs et feuilletés.', image: 'sale-plateau-gourmand' },
  { id: 'plateau-bouchees', title: 'Plateau de bouchées', category: 'sale', tag: 'Plateaux', description: 'Cuillères et bouchées apéritives par dizaines.', image: 'sale-plateau-bouchees' },
  { id: 'plateau-dore', title: 'Plateau doré', category: 'sale', tag: 'Plateaux', description: 'Assortiment de bouchées salées sur plateau doré.', image: 'sale-plateau-dore' },
  { id: 'plateau-partage', title: 'Plateau à partager', category: 'sale', tag: 'Plateaux', description: 'Plateau à compartiments : feuilletés, bouchées et sauce.', image: 'sale-plateau-partage' },
  { id: 'wraps-gourmands', title: 'Wraps gourmands', category: 'sale', tag: 'Plateaux', description: 'Wraps garnis de croquettes, crudités et fromage.', image: 'sale-wraps-gourmands' },
  { id: 'cuilleres-aperitives', title: 'Cuillères apéritives', category: 'sale', tag: 'Apéritif', description: 'Quatre bouchées en cuillère, servies sur ardoise.', image: 'sale-cuilleres-aperitives' },
  { id: 'carres-sales', title: 'Carrés salés', category: 'sale', tag: 'Apéritif', description: 'Carrés moelleux garnis, tomates cerises piquées.', image: 'sale-carres-sales' },
  { id: 'carres-aperitifs', title: 'Carrés apéritifs', category: 'sale', tag: 'Apéritif', description: 'Petites bouchées piquées, présentées sur plateau doré.', image: 'sale-carres-aperitifs' },

  // Jus
  { id: 'jus-rubis', title: 'Jus de fraise', category: 'jus', tag: 'Jus', description: 'Fraises pressées, servi frais en carafe ou au verre.', image: 'jus-rubis', featured: true },
  { id: 'jus-soleil', title: 'Jus d’orange', category: 'jus', tag: 'Jus', description: 'Oranges pressées, servi frais en carafe ou au verre.', image: 'jus-soleil' },
  { id: 'jus-orange-banane', title: 'Smoothie orange-banane', category: 'jus', tag: 'Smoothie', description: 'Orange pressée et banane, servi bien frais.', image: 'jus-orange-banane' },
];
