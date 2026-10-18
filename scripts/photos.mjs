// Prépare les photos pour le site : public/img/<nom>-800.webp et <nom>-1400.webp.
//
//   npm run photos              → convertit tout ce qui est dans photos/ (le nom du fichier = le nom de la photo)
//   npm run photos:wordpress    → télécharge d'abord les photos de l'ancien site WordPress, puis convertit
//                                 (à lancer AVANT de faire pointer linstantg.com vers Vercel)
//   npm run photos:wordpress -- --from https://autre-adresse.com   → autre adresse pour l'ancien site
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { extname, basename, join } from 'node:path';
import sharp from 'sharp';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, 'photos');
const OUT = join(ROOT, 'public/img');
const SIZES = [800, 1400];

// Nom de la photo sur le site  ←  fichier sur l'ancien site WordPress
const WORDPRESS = {
  'trompe-loeil-cacahuete': '2026/04/trompe-l-oeil-cachauette.jpg',
  'trompe-loeil-cafe': '2026/04/trompe-l-oeil-cafe.jpg',
  'gateau-pistache-ramadan': '2026/04/gateau-pistache-ramadan.jpg',
  'gateau-rose-naiem': '2026/04/gateau-rose-asma.jpg',
  'gateau-bourgeois': '2026/04/gateau-bassem.jpg',
  'baklava-pistache': '2026/04/baklava-pistache-l-instant-gourmand.jpg',
  'coffret-bordeaux-4': '2026/04/packet-l-instant-gourmand-rouge-bordeaux-4-assortissement.jpg',
  'coffret-decouverte-7': '2026/04/packet-l-instant-gourmand-7-assortissement.jpg',
  'coffret-luxe-pistache-pignon': '2026/04/packet-luxe-pistache-pignon.jpg',
  'coffret-trio-eid': '2026/04/3-packet-eid-moubarak-pistache-et-pignon.jpg',
  'coffret-blanc-biscuits': '2026/04/packet-blanc-1-assortissement-biscuit-artisanale.jpg',
  'composition-sur-mesure': '2026/04/4-packets-l-instant-gourmand-avec-2-gateaux.jpg',
  'fricasse-thon': '2026/04/packet-friccasse-thon.jpg',
  'mini-wrap-poulet': '2026/04/packet-mini-vrap-poulet.jpg',
};

const args = process.argv.slice(2);
await mkdir(SRC, { recursive: true });
await mkdir(OUT, { recursive: true });

if (args.includes('--wordpress')) {
  const i = args.indexOf('--from');
  const base = (i >= 0 ? args[i + 1] : 'https://linstantg.com').replace(/\/$/, '');
  for (const [name, path] of Object.entries(WORDPRESS)) {
    const url = `${base}/wp-content/uploads/${path}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await writeFile(join(SRC, `${name}${extname(path)}`), Buffer.from(await res.arrayBuffer()));
      console.log(`↓ ${name}`);
    } catch (err) {
      console.warn(`✗ ${name} — ${url} (${err.message})`);
    }
  }
}

const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png|webp|avif|tiff?)$/i.test(f));
if (!files.length) console.log('Aucune photo dans photos/.');
for (const file of files) {
  const name = basename(file, extname(file)).toLowerCase().replace(/[^a-z0-9-]+/g, '-');
  for (const w of SIZES) {
    await sharp(join(SRC, file)).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 82 }).toFile(join(OUT, `${name}-${w}.webp`));
  }
  console.log(`✓ public/img/${name}-{800,1400}.webp`);
}
