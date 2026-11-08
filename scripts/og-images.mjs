// Images de partage pour les réseaux sociaux : public/og/<page>.jpg (1200 × 630).
//
//   npm run og
//
// Chaque image est mise en page en HTML (polices et logo du site) puis capturée par un navigateur.
// Contenu de chaque image : src/og.js. Photos : photos/<photo>.jpg (originaux sans logo).
// Nécessite Playwright avec Chromium (`npm i -D playwright && npx playwright install chromium`),
// ou PLAYWRIGHT_PATH pointant vers une installation existante.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { OG_PAGES } from '../src/og.js';

const ROOT = new URL('..', import.meta.url).pathname;
const OUT = join(ROOT, 'public/og');
const { chromium } = await import(process.env.PLAYWRIGHT_PATH ?? 'playwright');

const file = (p) => pathToFileURL(join(ROOT, p)).href;
const font = (pkg, name) => file(`node_modules/@fontsource/${pkg}/files/${name}-latin-400-normal.woff2`);
const logo = (await readFile(join(ROOT, 'public/brand/logo-ig.svg'), 'utf8')).replace('<svg ', '<svg class="logo" ');
const mono = (await readFile(join(ROOT, 'public/brand/monogram.svg'), 'utf8')).replace('<svg ', '<svg class="mono" ');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function page({ eyebrow, heading, photo }) {
  const src = ['jpg', 'jpeg', 'png', 'webp'].map((e) => `photos/${photo}.${e}`).find((p) => existsSync(join(ROOT, p)));
  if (!src) throw new Error(`Photo introuvable : photos/${photo}.jpg`);
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Italiana; src: url(${font('italiana', 'italiana')}); }
@font-face { font-family: Tenor; src: url(${font('tenor-sans', 'tenor-sans')}); }
@font-face { font-family: Pinyon; src: url(${font('pinyon-script', 'pinyon-script')}); }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; overflow: hidden; position: relative; color: #fbefdc; font-family: Tenor, sans-serif;
  background: radial-gradient(80% 90% at 75% 50%, #6a2620 0%, #4c1212 55%, #2e0909 100%); }
.mono-bg { position: absolute; left: -60px; bottom: -150px; width: 760px; color: #69302c; opacity: .55; }
.mono-bg svg { width: 100%; height: auto; }
.text { position: absolute; left: 72px; top: 64px; bottom: 60px; width: 600px; display: flex; flex-direction: column; }
.logo { width: 330px; height: auto; color: #fbefdc; }
.eyebrow { margin-top: auto; display: flex; align-items: center; gap: 16px; font-size: 17px; letter-spacing: .38em; text-transform: uppercase; color: #d1b6a5; }
.eyebrow::before { content: ''; width: 44px; height: 1px; background: currentColor; }
h1 { font-family: Italiana, serif; font-weight: 400; font-size: ${heading.length > 22 ? 70 : 84}px; line-height: 1.02; margin: 22px 0 16px; }
.script { font-family: Pinyon, cursive; font-size: 42px; color: #f2d59a; }
.foot { margin-top: auto; padding-top: 22px; border-top: 1px solid rgba(251,239,220,.22); display: flex; justify-content: space-between; font-size: 16px; letter-spacing: .24em; text-transform: uppercase; color: #d1b6a5; }
.arch { position: absolute; right: 72px; top: 48px; width: 380px; height: 534px; border-radius: 190px 190px 22px 22px; overflow: hidden;
  box-shadow: 0 40px 80px -30px rgba(0,0,0,.6), 0 0 0 1px rgba(242,213,154,.55); background: #fbefdc; }
.arch img { width: 100%; height: 100%; object-fit: cover; }
.ring { position: absolute; right: 50px; top: 26px; width: 424px; height: 578px; border-radius: 212px 212px 34px 34px; border: 1px solid rgba(242,213,154,.35); }
.seal { position: absolute; right: 392px; bottom: 54px; width: 128px; height: 128px; border-radius: 50%; background: #fbefdc; color: #4c1212; display: grid; place-items: center; box-shadow: 0 18px 40px -12px rgba(0,0,0,.55); }
.seal .mono { width: 64px; height: auto; }
.seal text { font-family: Tenor; }
</style></head><body>
<div class="mono-bg">${mono}</div>
<div class="ring"></div>
<div class="arch"><img src="${file(src)}"></div>
<div class="seal"><svg viewBox="0 0 100 100" style="position:absolute;inset:6px;width:calc(100% - 12px)"><defs><path id="c" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0"/></defs><text font-size="9" fill="currentColor" textLength="236" lengthAdjust="spacing"><textPath href="#c">FAIT MAIN · SUR COMMANDE ·</textPath></text></svg>${mono}</div>
<div class="text">
  ${logo}
  <p class="eyebrow">${esc(eyebrow)}</p>
  <h1>${esc(heading)}</h1>
  <p class="script">par Jihene Chaieb</p>
  <p class="foot"><span>La Garenne-Colombes</span><span>linstantg.com</span></p>
</div>
</body></html>`;
}

await mkdir(OUT, { recursive: true });
const tmp = join(OUT, '.render.html');
const browser = await chromium.launch();
const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } });
try {
  for (const [key, og] of Object.entries(OG_PAGES)) {
    await writeFile(tmp, page(og));
    await tab.goto(pathToFileURL(tmp).href, { waitUntil: 'networkidle' });
    await tab.evaluate(() => document.fonts.ready);
    const png = await tab.screenshot({ type: 'png' });
    // JPEG léger : WhatsApp n'affiche le grand aperçu que pour des images de moins de ~300 Ko
    const info = await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile(join(OUT, `${key}.jpg`));
    console.log(`✓ public/og/${key}.jpg (${Math.round(info.size / 1024)} Ko)`);
  }
} finally {
  await browser.close();
  await rm(tmp, { force: true });
}
