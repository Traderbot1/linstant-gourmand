// Le gâteau de l'accueil : une séquence d'images tirée d'une vraie vidéo (scripts/cake-sequence.mjs),
// dessinée dans un canvas et pilotée par le scroll depuis home.js.
// state.p = position dans la séquence (fractionnaire : deux images voisines sont fondues),
// state.x / state.y / state.s = cadrage (décalage en fraction de l'écran, échelle).

const BG = '#f9e9d5'; // fond de la vidéo, repris par la page (.stage)

export async function createCakeSequence(canvas, { mobile = false } = {}) {
  const manifest = await (await fetch('/sequence/manifest.json')).json();
  const set = manifest[mobile ? 'mobile' : 'desktop'];
  const dir = `/sequence/${mobile ? 'mobile' : 'desktop'}/`;
  const ctx = canvas.getContext('2d');
  const images = new Array(set.files);
  const state = { p: 0, x: 0, y: 0, s: 1, fade: 0 };
  const last = set.order.length - 1;

  const load = (i) =>
    images[i] ??
    (images[i] = new Promise((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        images[i] = img;
        resolve(img);
      };
      img.onerror = () => resolve(null);
      img.src = `${dir}${String(i).padStart(3, '0')}.webp`;
    }));
  const ready = (i) => images[i] instanceof HTMLImageElement;

  // Image affichable la plus proche de l'index voulu (pendant le chargement progressif)
  function nearest(i) {
    if (ready(i)) return images[i];
    for (let d = 1; d < set.files; d++) {
      if (ready(i - d)) return images[i - d];
      if (ready(i + d)) return images[i + d];
    }
    return null;
  }

  let W = 0;
  let H = 0;
  let dpr = 1;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    draw();
  }

  // Rectangle de l'image à l'écran (en px CSS)
  function rect() {
    const scale = Math.max(W / set.width, H / set.height) * state.s;
    const rw = set.width * scale;
    const rh = set.height * scale;
    return { cx: W / 2 + state.x * W, cy: H / 2 + state.y * H, rw, rh };
  }

  function draw() {
    if (!W) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1;
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);
    const p = Math.min(Math.max(state.p, 0), last);
    const i = Math.floor(p);
    const a = nearest(set.order[i]);
    if (!a) return;
    const { cx, cy, rw, rh } = rect();
    const x0 = cx - rw / 2;
    const y0 = cy - rh / 2;
    ctx.drawImage(a, x0, y0, rw, rh);
    // Fondu entre deux images voisines : le mouvement reste fluide même entre deux pas
    const f = p - i;
    const nextIndex = set.order[Math.min(i + 1, last)];
    if (f > 0.01 && ready(nextIndex) && images[nextIndex] !== a) {
      ctx.globalAlpha = f;
      ctx.drawImage(images[nextIndex], x0, y0, rw, rh);
      ctx.globalAlpha = 1;
    }
    // Bords de la photo fondus dans le fond de la page
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(rw / 2, rh / 2);
    const g = ctx.createRadialGradient(0, 0, 0.74, 0, 0, 1);
    g.addColorStop(0, 'rgba(249,233,213,0)');
    g.addColorStop(1, BG);
    ctx.fillStyle = g;
    ctx.fillRect(-20, -20, 40, 40);
    ctx.restore();
    canvas.style.opacity = String(1 - state.fade);
  }

  // Position écran (px CSS) d'un point de l'image, en fractions (pour les étiquettes)
  function project(fx, fy) {
    const { cx, cy, rw, rh } = rect();
    return { x: cx + (fx - 0.5) * rw, y: cy + (fy - 0.5) * rh };
  }

  window.addEventListener('resize', resize);
  // Première image d'abord (affichée tout de suite), puis le reste en arrière-plan, dans l'ordre du scroll
  await load(set.order[0]);
  resize();
  (async () => {
    const queue = [...new Set(set.order)];
    const workers = Array.from({ length: 6 }, async () => {
      while (queue.length) {
        await load(queue.shift());
        draw();
      }
    });
    await Promise.all(workers);
  })();

  return { state, draw, project, labels: set.labels, steps: { rotationEnd: set.rotationEnd, openStart: set.openStart, last } };
}
