# L’instant Gourmand — linstantg.com

Site vitrine 3D de **L’instant Gourmand** — pâtisserie franco-tunisienne sur commande de Jihene Chaieb, La Garenne-Colombes (92).

| Page | URL |
| --- | --- |
| Accueil : vrai gâteau Birthday Queen (vidéo) qui tourne puis s’ouvre au scroll et montre ses couches, catégories, vitrine, atelier, étapes | `/` |
| Créations : les sections, puis une page par section avec toutes ses photos et des sous-filtres | `/creations/`, `/creations/gateaux/`, `/creations/coffrets/`… |
| Commander : occasion, créations, date (48 h mini) et créneau, envoi par WhatsApp ou e-mail, FAQ | `/commander/` |
| Contact : WhatsApp / téléphone / e-mail, formulaire, atelier et carte, réseaux | `/contact/` |

L’ancienne URL `/atelier/` redirige vers la section « L’atelier » de l’accueil.

## Mettre en ligne sur Vercel

1. Pousser ce dépôt sur GitHub, puis sur vercel.com : **Add New → Project → importer le dépôt**. Vercel détecte Vite tout seul (réglages dans `vercel.json`).
2. Dans le projet Vercel : **Settings → Domains → ajouter `linstantg.com` et `www.linstantg.com`**, puis recopier chez le registrar du domaine les enregistrements DNS indiqués par Vercel.

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

**Ajouter une photo** : déposer l’original dans `photos/` en le nommant comme le champ `image` de `src/js/data.js` (ex. `photos/trompe-loeil-cafe.jpg`), puis `npm run photos` (ou `npm run photos -- nom-de-la-photo` pour une seule). Le script améliore légèrement la photo (contraste, couleurs, netteté) et **ajoute le logo** en bas : bordeaux sur fond clair, crème sur fond sombre, sur une petite plaque crème si le fond est chargé. Réglages par photo dans `scripts/photos.config.json` : `"logo": "none"` si la photo porte déjà le logo, ou une position (`top`, `bottom-left`, `bottom-right`…). Tant qu’une création n’a pas de photo, elle s’affiche avec le monogramme et « Photos à venir ».

**Ajouter une création** : ajouter une entrée dans `src/js/data.js` (titre, section, étiquette, description, nom de photo ; `featured: true` pour la mettre en avant sur l’accueil). Elle apparaît automatiquement dans la galerie, le formulaire de commande, et — si elle a une photo — dans la vitrine de l’accueil et l’aperçu du menu.

## Aperçus sur les réseaux sociaux

Quand on partage un lien du site (WhatsApp, Facebook, Instagram, LinkedIn, X), l’aperçu affiche une image de marque propre à chaque page (`public/og/<page>.jpg`, 1200 × 630), un titre et une description. Textes, titres et photos de ces images : `src/og.js`. Pour les régénérer : `npm run og` (nécessite Playwright avec Chromium). Après un changement, les réseaux gardent l’ancien aperçu en cache : le rafraîchir avec l’outil de débogage de partage de Facebook (developers.facebook.com/tools/debug), qui sert aussi pour Instagram et WhatsApp.

## Technique

- [Vite](https://vite.dev) — build multi-pages, gabarits partagés injectés au build (`src/partials.js`).
- Gâteau de l’accueil : vidéos générées avec Kie.ai (Veo 3.1) à partir de la vraie photo, découpées en images WebP par `npm run sequence` (`scripts/cake-sequence.mjs`, nécessite ffmpeg) et dessinées dans un canvas au scroll (`src/js/cake-sequence.js`). Pour changer de vidéo : déposer `rotation-16x9.mp4` et `ouverture-16x9.mp4` dans `kie/videos/` (le téléphone utilise aussi le 16:9), ajuster les plages d’images en haut du script, puis `npm run sequence`.
- [GSAP](https://gsap.com) + ScrollTrigger, SplitText, Flip — animations pilotées par le scroll.
- [Lenis](https://lenis.darkroom.engineering) — défilement doux.
- Accessibilité : navigation clavier, `prefers-reduced-motion` respecté, repli image si WebGL est indisponible.

## Typographies

La charte utilise **Agraham** (titres, licence « personal use ») et **Tenor Sans** (texte). Le site utilise Tenor Sans et **Italiana** (Google Fonts) comme équivalent libre d’Agraham. Pour utiliser Agraham, il faut acheter la licence web, déposer les fichiers dans `public/fonts/` et changer `--ff-display` dans `src/css/main.css`.
