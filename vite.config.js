import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import * as P from './src/partials.js';
import { CATEGORIES } from './src/js/config.js';

const root = import.meta.dirname;

// Une page par section du menu : creations/<id>/index.html, générée depuis src/templates/section.html.
const sectionPages = () => {
  const tpl = readFileSync(resolve(root, 'src/templates/section.html'), 'utf8');
  return Object.fromEntries(
    CATEGORIES.map((c) => {
      const file = resolve(root, 'creations', c.id, 'index.html');
      mkdirSync(resolve(root, 'creations', c.id), { recursive: true });
      writeFileSync(file, tpl.replaceAll('{{ID}}', c.id).replaceAll('{{TITLE}}', c.title).replaceAll('{{TEXT}}', c.text.replace(/"/g, '&quot;')));
      return [`creations-${c.id}`, file];
    }),
  );
};

// Remplace les marqueurs <!--@nom--> ou <!--@nom:argument--> par les gabarits de src/partials.js.
const partials = () => ({
  name: 'partials',
  transformIndexHtml(html) {
    return html.replace(/<!--@(\w+)(?::([\w-]+))?-->/g, (m, name, arg) => {
      if (typeof P[name] === 'function') return P[name](arg);
      if (P.SVG[name]) return P.SVG[name]();
      throw new Error(`Gabarit inconnu : ${name}`);
    });
  },
  handleHotUpdate({ file, server }) {
    if (/\/src\/(partials\.js|js\/config\.js|js\/data\.js|templates\/)/.test(file)) server.restart();
  },
});

// Plan du site pour Google, généré à chaque build à partir des pages.
const sitemap = () => ({
  name: 'sitemap',
  generateBundle() {
    const urls = ['/', '/creations/', ...CATEGORIES.map((c) => `/creations/${c.id}/`), '/commander/', '/contact/'];
    const today = new Date().toISOString().slice(0, 10);
    const body = urls.map((u) => `  <url><loc>https://linstantg.com${u}</loc><lastmod>${today}</lastmod></url>`).join('\n');
    this.emitFile({
      type: 'asset',
      fileName: 'sitemap.xml',
      source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
    });
  },
});

export default defineConfig({
  plugins: [partials(), sitemap()],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        creations: resolve(root, 'creations/index.html'),
        commander: resolve(root, 'commander/index.html'),
        contact: resolve(root, 'contact/index.html'),
        ...sectionPages(),
      },
    },
  },
});
