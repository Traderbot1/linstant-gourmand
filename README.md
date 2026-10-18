# L’instant Gourmand — linstantg.com

Site vitrine 3D de **L’instant Gourmand** — pâtisserie franco-tunisienne sur commande de Jihene Chaieb, La Garenne-Colombes (92).

| Page | URL |
| --- | --- |
| Accueil : gâteau 3D (Three.js) qui se découpe et s’éclate au scroll, catégories, vitrine, atelier, étapes | `/` |
| Créations : les sections, puis une page par section avec toutes ses photos et des sous-filtres | `/creations/`, `/creations/gateaux/`, `/creations/coffrets/`… |
| Commander : occasion, créations, date (48 h mini) et créneau, envoi par WhatsApp ou e-mail, FAQ | `/commander/` |
| Contact : WhatsApp / téléphone / e-mail, formulaire, atelier et carte, réseaux | `/contact/` |

L’ancienne URL `/atelier/` redirige vers la section « L’atelier » de l’accueil.

## Mettre en ligne sur Vercel

1. Pousser ce dépôt sur GitHub, puis sur vercel.com : **Add New → Project → importer le dépôt**. Vercel détecte Vite tout seul (réglages dans `vercel.json`).
2. Dans le projet Vercel : **Settings → Domains → ajouter `linstantg.com` et `www.linstantg.com`**, puis recopier chez le registrar du domaine les enregistrements DNS indiqués par Vercel.
3. **Avant de changer les DNS**, récupérer les photos de l’ancien site WordPress (elles disparaîtront ensuite) :

   ```bash
   npm install
   npm run photos:wordpress   # télécharge les 15 photos de l’ancien site et les optimise dans public/img/
   git add public/img && git commit -m "Photos de l’ancien site" && git push
   ```

## Lancer le site

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # version en ligne dans dist/
```

Le dossier `dist/` est un site statique : il s’héberge partout (Vercel, Netlify, OVH…).

## Modifier le contenu

| Quoi | Où |
| --- | --- |
| Téléphone, WhatsApp, e-mail, Instagram, Facebook, ville, horaires, délai | `src/js/config.js` (`CONTACT`) |
| Sections du menu « Créations » (une page est créée automatiquement pour chacune) et leurs sous-filtres | `src/js/config.js` (`CATEGORIES`) |
| Occasions et FAQ de la page Commander | `src/js/config.js` (`OCCASIONS`, `FAQ`) |
| Gâteaux affichés (titre, catégorie, description, photo) | `src/js/data.js` |
| Photos | `public/img/` (`nom-800.webp` et `nom-1400.webp`) |
| Couleurs, typographies | haut de `src/css/main.css` |

**Ajouter une photo** : déposer l’original dans `photos/` en le nommant comme le champ `image` de `src/js/data.js` (ex. `photos/trompe-loeil-cafe.jpg`), puis `npm run photos`. Tant qu’une création n’a pas de photo, elle s’affiche avec le monogramme et « Photos à venir ».

**Ajouter une création** : ajouter une entrée dans `src/js/data.js` (titre, section, étiquette, description, nom de photo ; `featured: true` pour la mettre en avant sur l’accueil). Elle apparaît automatiquement dans la galerie, le formulaire de commande, et — si elle a une photo — dans la vitrine de l’accueil et l’aperçu du menu.

## Technique

- [Vite](https://vite.dev) — build multi-pages, gabarits partagés injectés au build (`src/partials.js`).
- [Three.js](https://threejs.org) — gâteau 100 % procédural (`src/js/cake-scene.js`) : aucun modèle 3D à charger ; le topper doré est le monogramme « iG » de la charte, extrudé depuis le SVG.
- [GSAP](https://gsap.com) + ScrollTrigger, SplitText, Flip — animations pilotées par le scroll.
- [Lenis](https://lenis.darkroom.engineering) — défilement doux.
- Accessibilité : navigation clavier, `prefers-reduced-motion` respecté, repli image si WebGL est indisponible.

## Typographies

La charte utilise **Agraham** (titres, licence « personal use ») et **Tenor Sans** (texte). Le site utilise Tenor Sans et **Italiana** (Google Fonts) comme équivalent libre d’Agraham. Pour utiliser Agraham, il faut acheter la licence web, déposer les fichiers dans `public/fonts/` et changer `--ff-display` dans `src/css/main.css`.
