# L’instant Gourmand — linstantg.com

Site vitrine 3D de la pâtisserie **L’instant Gourmand** (Douceur & Saveur).

- **Accueil** : gâteau velours en 3D temps réel (Three.js) qui tourne, se découpe et s’éclate couche par couche au scroll, vitrine horizontale, atelier, étapes de commande.
- **Créations** : galerie filtrable par catégorie (gâteaux personnalisés, entremets, gâteaux coffret, bento, sucré, salé) avec visionneuse.
- **Commander** : formulaire qui prépare la demande par e-mail (et WhatsApp si un numéro est renseigné).

## Lancer le site

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # version en ligne dans dist/
```

Le dossier `dist/` est un site statique : il s’héberge partout (Netlify, Vercel, Cloudflare Pages, OVH, o2switch…). Il suffit d’y pointer le domaine `linstantg.com`.

## Modifier le contenu

| Quoi | Où |
| --- | --- |
| E-mail, téléphone, WhatsApp, Instagram, zone | `src/js/config.js` (`CONTACT`) |
| Catégories du menu « Créations » | `src/js/config.js` (`CATEGORIES`) |
| Gâteaux affichés (titre, catégorie, description, photo) | `src/js/data.js` |
| Photos | `public/img/` (`nom-800.webp` et `nom-1400.webp`) |
| Couleurs, typographies | haut de `src/css/main.css` |

**Ajouter un gâteau** : déposer `public/img/mon-gateau-800.webp` et `public/img/mon-gateau-1400.webp`, puis ajouter une entrée dans `src/js/data.js` avec `image: 'mon-gateau'`. Il apparaît automatiquement dans la galerie, la vitrine et le menu. Une catégorie sans photo affiche « Photos à venir ».

## Technique

- [Vite](https://vite.dev) — build multi-pages, gabarits partagés injectés au build (`src/partials.js`).
- [Three.js](https://threejs.org) — gâteau 100 % procédural (`src/js/cake-scene.js`) : aucun modèle 3D à charger ; le topper doré est le monogramme « iG » de la charte, extrudé depuis le SVG.
- [GSAP](https://gsap.com) + ScrollTrigger, SplitText, Flip — animations pilotées par le scroll.
- [Lenis](https://lenis.darkroom.engineering) — défilement doux.
- Accessibilité : navigation clavier, `prefers-reduced-motion` respecté, repli image si WebGL est indisponible.

## Typographies

La charte utilise **Agraham** (titres, licence « personal use ») et **Tenor Sans** (texte). Le site utilise Tenor Sans et **Italiana** (Google Fonts) comme équivalent libre d’Agraham. Pour utiliser Agraham, il faut acheter la licence web, déposer les fichiers dans `public/fonts/` et changer `--ff-display` dans `src/css/main.css`.
