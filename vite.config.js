import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import * as P from './src/partials.js';

// Remplace les marqueurs <!--@nom--> des pages HTML par les gabarits de src/partials.js.
const partials = () => ({
  name: 'partials',
  transformIndexHtml(html) {
    return html.replace(/<!--@(\w+)-->/g, (m, name) => {
      if (P[name] && typeof P[name] === 'function') return P[name]();
      if (P.SVG[name]) return P.SVG[name]();
      throw new Error(`Gabarit inconnu : ${name}`);
    });
  },
  handleHotUpdate({ file, server }) {
    if (file.includes('/src/partials.js') || file.includes('/src/js/config.js') || file.includes('/src/js/data.js')) {
      server.restart();
    }
  },
});

export default defineConfig({
  plugins: [partials()],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        creations: resolve(import.meta.dirname, 'creations/index.html'),
        commander: resolve(import.meta.dirname, 'commander/index.html'),
        contact: resolve(import.meta.dirname, 'contact/index.html'),
      },
    },
  },
});
