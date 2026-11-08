// Prépare les photos pour le site : public/img/<nom>-800.webp et <nom>-1400.webp.
//
//   npm run photos              → traite tout ce qui est dans photos/ (le nom du fichier = le nom de la photo)
//   npm run photos -- nom1 nom2 → ne traite que ces photos
//
// Pour chaque photo : légère mise en valeur (contraste, couleurs, netteté), puis ajout du logo
// L'instant Gourmand en bas de l'image — en bordeaux sur fond clair, en crème sur fond sombre.
// Réglages par photo (logo déjà présent, position du logo) : scripts/photos.config.json
import { mkdir, readdir, readFile } from 'node:fs/promises';
import { extname, basename, join } from 'node:path';
import sharp from 'sharp';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, 'photos');
const OUT = join(ROOT, 'public/img');
const SIZES = [800, 1400];

const config = JSON.parse(await readFile(join(ROOT, 'scripts/photos.config.json'), 'utf8'));
const logoSvg = await readFile(join(ROOT, 'public/brand/logo-ig.svg'), 'utf8');
const [, , vbW, vbH] = logoSvg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
const logoPath = logoSvg.match(/<path d="([^"]+)"/)[1];

// Logo vectoriel rendu à la taille voulue : ombre douce pour la version crème,
// ou petite plaque crème arrondie (comme une étiquette) quand le fond est trop chargé.
function logoOverlay(width, color, shadow, plate) {
  const height = Math.round((width * vbH) / vbW);
  const pad = Math.round(width * (plate ? 0.07 : 0.04));
  const filter = shadow
    ? `<filter id="s" x="-10%" y="-40%" width="120%" height="180%"><feGaussianBlur in="SourceAlpha" stdDeviation="${(vbW / width) * 3}"/><feOffset dy="${(vbW / width) * 1}"/><feComponentTransfer><feFuncA type="linear" slope="0.45"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>`
    : '';
  const u = vbW / width; // unités du logo par pixel
  const plateRect = plate
    ? `<rect x="${-pad * u * 0.9}" y="${-pad * u * 0.9}" width="${vbW + pad * u * 1.8}" height="${vbH + pad * u * 1.8}" rx="${pad * u * 1.6}" fill="#FBEFDC" fill-opacity="0.86"/>`
    : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width + pad * 2}" height="${height + pad * 2}" viewBox="${-pad * u} ${-pad * u} ${vbW + 2 * pad * u} ${vbH + 2 * pad * u}">${filter}${plateRect}<path d="${logoPath}" fill="${color}" fill-rule="evenodd" ${shadow ? 'filter="url(#s)"' : ''} fill-opacity="${shadow ? 0.96 : 0.92}"/></svg>`;
  return { input: Buffer.from(svg), width: width + pad * 2, height: height + pad * 2 };
}

async function render(file, name, w) {
  const opts = config.photos?.[name] ?? {};
  let img = sharp(join(SRC, file)).rotate().resize({ width: w, withoutEnlargement: true });
  if (opts.enhance !== false) {
    img = img
      .modulate({ saturation: 1.06, brightness: 1.01 })
      .linear(1.05, -6)
      .sharpen({ sigma: 0.6 });
  }
  const base = await img.toBuffer({ resolveWithObject: true });
  const { width, height } = base.info;
  const pipeline = sharp(base.data);
  const position = opts.logo ?? 'bottom';
  if (position === 'none') return pipeline;

  const landscape = width > height;
  const logoW = Math.round(width * (opts.logoScale ?? (landscape ? 0.28 : 0.38)));
  const logoH = Math.round((logoW * vbH) / vbW);
  const margin = Math.round(height * 0.035);
  const side = Math.round(width * 0.05);
  const left = position.endsWith('right') ? width - logoW - side : position.endsWith('left') ? side : Math.round((width - logoW) / 2);
  const top = position.startsWith('top') ? margin : height - logoH - margin;

  // Couleur selon la luminosité du fond à l'endroit du logo
  const { channels } = await sharp(base.data).extract({ left, top, width: logoW, height: logoH }).stats();
  const lum = 0.2126 * channels[0].mean + 0.7152 * channels[1].mean + 0.0722 * channels[2].mean;
  const busy = opts.plate ?? (channels[0].stdev + channels[1].stdev + channels[2].stdev) / 3 > 38;
  const dark = !busy && (opts.logoColor ? opts.logoColor === 'creme' : lum < 150);
  const ov = logoOverlay(logoW, dark ? '#FBEFDC' : '#4C1212', dark, busy);
  const pad = (ov.width - logoW) / 2;
  return pipeline.composite([{ input: ov.input, left: Math.max(0, Math.round(left - pad)), top: Math.max(0, Math.round(top - pad)) }]);
}

await mkdir(OUT, { recursive: true });
const only = process.argv.slice(2);
const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png|webp|avif|tiff?)$/i.test(f));
if (!files.length) console.log('Aucune photo dans photos/.');
for (const file of files) {
  const name = basename(file, extname(file)).toLowerCase().replace(/[^a-z0-9-]+/g, '-');
  if (only.length && !only.includes(name)) continue;
  for (const w of SIZES) {
    const out = await render(file, name, w);
    await out.webp({ quality: 82 }).toFile(join(OUT, `${name}-${w}.webp`));
  }
  console.log(`✓ public/img/${name}-{800,1400}.webp`);
}
