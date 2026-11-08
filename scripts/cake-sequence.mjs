// Découpe les vidéos Kie.ai du gâteau en images pour l'animation au scroll de l'accueil.
//
//   npm run sequence
//
// Entrée : kie/videos/{rotation,ouverture}-{16x9,9x16}.mp4 (non versionnées)
// Sortie : public/sequence/{desktop,mobile}/NNN.webp + public/sequence/manifest.json
//
// La séquence = la rotation en aller-retour (le gâteau pivote puis revient face à la caméra,
// dans la pose exacte du début de l'ouverture), un fondu enchaîné, puis la partie propre de l'ouverture
// (le début des vidéos d'ouverture montre un couteau : on ne garde que la fin).
// Nécessite ffmpeg installé sur la machine.
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';

const ROOT = new URL('..', import.meta.url).pathname;
const VIDEOS = join(ROOT, 'kie/videos');
const OUT = join(ROOT, 'public/sequence');

// Plages d'images retenues dans chaque vidéo (24 images/s, 188 images par vidéo).
// `labels` : centre des couches sur la dernière image (fractions de l'image), pour les étiquettes.
const SETS = {
  desktop: {
    width: 1600,
    quality: 70,
    rotation: { file: 'rotation-16x9.mp4', from: 0, to: 96, step: 2, pingpong: true },
    opening: { file: 'ouverture-16x9.mp4', from: 108, to: 187, step: 2 },
    fade: 10,
    labels: [
      { text: 'Génoise moelleuse', x: 0.645, y: 0.3 },
      { text: 'Crème légère', x: 0.645, y: 0.385 },
      { text: 'Crème & éclats de pistache', x: 0.645, y: 0.52 },
    ],
  },
  mobile: {
    width: 720,
    quality: 68,
    rotation: { file: 'rotation-9x16.mp4', from: 0, to: 96, step: 2, pingpong: true },
    opening: { file: 'ouverture-9x16.mp4', from: 66, to: 187, step: 2 },
    fade: 10,
    labels: [
      { text: 'Génoise moelleuse', x: 0.76, y: 0.33 },
      { text: 'Crème légère', x: 0.76, y: 0.39 },
      { text: 'Crème & éclats de pistache', x: 0.76, y: 0.515 },
    ],
  },
};

// Extrait une plage d'images d'une vidéo, redimensionnées, en PNG dans `dir`.
async function extract({ file, from, to, step }, width, dir) {
  await mkdir(dir, { recursive: true });
  execFileSync('ffmpeg', [
    '-v', 'error', '-y', '-i', join(VIDEOS, file),
    '-vf', `select='between(n\\,${from}\\,${to})*not(mod(n-${from}\\,${step}))',scale=${width}:-2:flags=lanczos`,
    '-fps_mode', 'vfr', join(dir, '%04d.png'),
  ]);
  return (await readdir(dir)).sort().map((f) => join(dir, f));
}

const manifest = {};
const tmp = await mkdtemp(join(tmpdir(), 'cake-seq-'));
try {
  for (const [name, set] of Object.entries(SETS)) {
    const dest = join(OUT, name);
    await rm(dest, { recursive: true, force: true });
    await mkdir(dest, { recursive: true });

    let rot = await extract(set.rotation, set.width, join(tmp, `${name}-rot`));
    if (set.rotation.pingpong) rot = [...rot, ...rot.slice(0, -1).reverse()];
    const open = await extract(set.opening, set.width, join(tmp, `${name}-open`));
    const frames = [...rot.map((f) => ({ file: f }))];
    // Fondu enchaîné entre la fin de la rotation et le début de l'ouverture
    for (let i = 1; i <= set.fade; i++) frames.push({ from: rot.at(-1), to: open[0], t: i / (set.fade + 1) });
    const openStart = frames.length;
    frames.push(...open.map((f) => ({ file: f })));

    // Chaque image n'est encodée qu'une fois ; `order` donne l'image à afficher à chaque pas.
    const keys = new Map();
    const order = frames.map((fr) => {
      const key = fr.file ?? `${fr.from}|${fr.to}|${fr.t}`;
      if (!keys.has(key)) keys.set(key, { index: keys.size, fr });
      return keys.get(key).index;
    });
    let bytes = 0;
    for (const { index, fr } of keys.values()) {
      let img;
      if (fr.file) img = sharp(fr.file);
      else {
        const overlay = await sharp(fr.to).ensureAlpha(fr.t).png().toBuffer();
        img = sharp(await sharp(fr.from).composite([{ input: overlay }]).png().toBuffer());
      }
      const info = await img.webp({ quality: set.quality, effort: 5 }).toFile(join(dest, `${String(index).padStart(3, '0')}.webp`));
      bytes += info.size;
      if (index === 0) Object.assign(set, { w: info.width, h: info.height });
    }
    manifest[name] = { files: keys.size, order, rotationEnd: rot.length - 1, openStart, width: set.w, height: set.h, labels: set.labels };
    console.log(`✓ ${name} : ${frames.length} pas, ${keys.size} images, ${(bytes / 1e6).toFixed(1)} Mo`);
  }
} finally {
  await rm(tmp, { recursive: true, force: true });
}
await writeFile(join(OUT, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
