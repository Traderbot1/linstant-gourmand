// Scène 3D : un gâteau velours entièrement procédural (aucun modèle à charger),
// découpé en couches et en une part, piloté par le scroll depuis home.js.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

const TAU = Math.PI * 2;
const R = 1.5; // rayon du gâteau
const SLICE_START = 0;
const SLICE_LEN = Math.PI / 3;
const SLICE_DIR = SLICE_START + SLICE_LEN / 2;
const DECOR_THETA = Math.PI; // côté décoré, opposé à la part

// Angles de rotation du gâteau : départ (décor face caméra) et révélation (part vers la caméra).
export const ROT_START = -0.35 - DECOR_THETA;
export const ROT_REVEAL = 0.62 - SLICE_DIR;

// Couches, de bas en haut. `label` = texte affiché lors de l'éclaté.
export const LAYERS = [
  { h: 0.46, color: '#e3b67f', crumb: true, label: 'Biscuit moelleux' },
  { h: 0.12, color: '#fbefdc', label: 'Crème légère' },
  { h: 0.16, color: '#a3283a', gloss: true, label: 'Cœur fruité' },
  { h: 0.12, color: '#fbefdc' },
  { h: 0.46, color: '#6e3b2b', crumb: true, label: 'Biscuit cacao' },
  { h: 0.1, color: '#4c1212', gloss: true, label: 'Ganache & velours' },
];

// Bruit périodique (fréquences entières) pour le col « déchiré » : raccord parfait entre la part et le gâteau.
const tornNoise = (t) =>
  0.05 * Math.sin(3 * t + 1.3) +
  0.03 * Math.sin(7 * t + 0.4) +
  0.016 * Math.sin(19 * t + 2.1) +
  0.01 * Math.sin(53 * t) * Math.sin(31 * t + 0.7);

function canvasTexture(size, draw, { repeat = 1, srgb = false } = {}) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  draw(c.getContext('2d'), size);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function makeTextures() {
  const grain = canvasTexture(
    256,
    (ctx, s) => {
      const img = ctx.createImageData(s, s);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = 170 + Math.random() * 85;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
    },
    { repeat: 8 },
  );

  const crumb = canvasTexture(
    512,
    (ctx, s) => {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 1400; i++) {
        const r = Math.pow(Math.random(), 2.5) * 7 + 0.6;
        ctx.fillStyle = `rgba(80,45,30,${0.12 + Math.random() * 0.3})`;
        ctx.beginPath();
        ctx.ellipse(Math.random() * s, Math.random() * s, r, r * (0.6 + Math.random() * 0.5), Math.random() * 3, 0, TAU);
        ctx.fill();
      }
    },
    { srgb: true },
  );

  const dot = canvasTexture(64, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.25, 'rgba(255,240,200,0.8)');
    g.addColorStop(1, 'rgba(255,220,150,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });

  const shadow = canvasTexture(256, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, 'rgba(20,4,4,0.75)');
    g.addColorStop(0.55, 'rgba(20,4,4,0.35)');
    g.addColorStop(1, 'rgba(20,4,4,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });

  return { grain, crumb, dot, shadow };
}

// UV en unités monde, pour que la mie garde les mêmes proportions sur chaque face.
function worldUV(geo, w, h, density = 0.7) {
  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w * density, uv.getY(i) * h * density);
}

// Une portion de cylindre fermée (couche du gâteau ou de la part).
function wedge(h, start, len, mats, cuts) {
  const g = new THREE.Group();
  const segs = Math.max(10, Math.round((128 * len) / TAU));
  const geo = new THREE.CylinderGeometry(R, R, h, segs, 1, false, start, len);
  g.add(new THREE.Mesh(geo, [mats.side, mats.top, mats.cut]));
  for (const theta of [start, start + len]) {
    const pg = new THREE.PlaneGeometry(R, h);
    worldUV(pg, R, h);
    const p = new THREE.Mesh(pg, mats.cut);
    p.rotation.y = theta - Math.PI / 2;
    p.position.set((Math.sin(theta) * R) / 2, 0, (Math.cos(theta) * R) / 2);
    g.add(p);
    cuts.push(p);
  }
  return g;
}

// Col velours au bord déchiré + liseré d'or, comme sur les créations de la maison.
function collar(start, len, velvet, gold) {
  const g = new THREE.Group();
  const segs = Math.max(12, Math.round((220 * len) / TAU));
  const geo = new THREE.CylinderGeometry(R + 0.006, R + 0.006, 1, segs, 1, true, start, len);
  const pos = geo.attributes.position;
  const rim = [];
  for (let i = 0; i < pos.count; i++) {
    const col = i % (segs + 1);
    const theta = start + (col / segs) * len;
    if (i <= segs) {
      const y = 0.17 + tornNoise(theta);
      pos.setY(i, y);
      rim.push(new THREE.Vector3(Math.sin(theta) * (R + 0.006), y, Math.cos(theta) * (R + 0.006)));
    } else {
      pos.setY(i, -0.02);
    }
  }
  geo.computeVertexNormals();
  const wall = new THREE.Mesh(geo, velvet);
  g.add(wall);
  const tube = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rim), segs * 2, 0.016, 6, false);
  g.add(new THREE.Mesh(tube, gold));
  return g;
}

function flower(petalMat, centerMat, size) {
  const g = new THREE.Group();
  const petal = new THREE.SphereGeometry(1, 12, 8);
  for (const [count, len, tilt, offset] of [
    [14, 1, 0.25, 0],
    [10, 0.72, 0.55, 0.3],
  ]) {
    for (let i = 0; i < count; i++) {
      const a = (i / count) * TAU + offset;
      const m = new THREE.Mesh(petal, petalMat);
      m.scale.set(0.11 * len, 0.03, 0.34 * len);
      m.position.set(Math.sin(a) * 0.3 * len, 0, Math.cos(a) * 0.3 * len);
      m.rotation.set(0, a, 0);
      m.rotateX(-tilt);
      g.add(m);
    }
  }
  const c = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), centerMat);
  c.scale.y = 0.6;
  c.position.y = 0.06;
  g.add(c);
  g.scale.setScalar(size);
  return g;
}

function macaron(color, mats) {
  const g = new THREE.Group();
  const shell = new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.5,
    sheen: 0.6,
    sheenColor: new THREE.Color('#ffffff'),
    bumpMap: mats.grain,
    bumpScale: 0.6,
  });
  const dome = new THREE.SphereGeometry(0.5, 32, 16, 0, TAU, 0, Math.PI / 2);
  const top = new THREE.Mesh(dome, shell);
  top.scale.set(1, 0.42, 1);
  top.position.y = 0.17;
  const bottom = top.clone();
  bottom.rotation.x = Math.PI;
  bottom.position.y = -0.17;
  const footGeo = new THREE.CylinderGeometry(0.505, 0.49, 0.08, 48, 2, false);
  const p = footGeo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const k = 1 + (Math.random() - 0.5) * 0.06;
    p.setX(i, p.getX(i) * k);
    p.setZ(i, p.getZ(i) * k);
  }
  footGeo.computeVertexNormals();
  const footMat = shell.clone();
  footMat.roughness = 0.95;
  const f1 = new THREE.Mesh(footGeo, footMat);
  f1.position.y = 0.13;
  const f2 = f1.clone();
  f2.position.y = -0.13;
  const fill = new THREE.Mesh(
    new THREE.CylinderGeometry(0.44, 0.44, 0.18, 40),
    new THREE.MeshStandardMaterial({ color: '#fbefdc', roughness: 0.6 }),
  );
  g.add(top, bottom, f1, f2, fill);
  return g;
}

export function createCakeScene(canvas, { reducedMotion = false, mobile = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.98;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const target = new THREE.Vector3();

  scene.add(new THREE.HemisphereLight('#ffe9d6', '#4c1212', 0.7));
  const key = new THREE.DirectionalLight('#fff1e0', 2.4);
  key.position.set(4, 7, 6);
  const rim = new THREE.DirectionalLight('#ffb59a', 2.2);
  rim.position.set(-6, 3, -5);
  const warm = new THREE.PointLight('#ffcf8a', 8, 14, 1.6);
  warm.position.set(3, 1.5, 4);
  scene.add(key, rim, warm);

  const tex = makeTextures();
  const velvet = new THREE.MeshPhysicalMaterial({
    color: '#e6c9b9',
    roughness: 0.9,
    sheen: 1,
    sheenColor: new THREE.Color('#fff4ec'),
    sheenRoughness: 0.4,
    bumpMap: tex.grain,
    bumpScale: 0.8,
    side: THREE.DoubleSide,
  });
  const gold = new THREE.MeshPhysicalMaterial({ color: '#f2c879', metalness: 1, roughness: 0.2, clearcoat: 0.4 });
  const petals = new THREE.MeshPhysicalMaterial({
    color: '#69302c',
    roughness: 0.8,
    sheen: 1,
    sheenColor: new THREE.Color('#ab8275'),
    sheenRoughness: 0.5,
  });

  const root = new THREE.Group(); // le gâteau complet, tourne sur lui-même
  const main = new THREE.Group();
  const slice = new THREE.Group();
  root.add(main, slice);
  scene.add(root);

  // Plateau
  const board = new THREE.Mesh(
    new THREE.CylinderGeometry(R + 0.4, R + 0.42, 0.06, 96),
    [new THREE.MeshPhysicalMaterial({ color: '#d9b26a', metalness: 1, roughness: 0.3 }), new THREE.MeshStandardMaterial({ color: '#fbefdc', roughness: 0.4 }), gold],
  );
  board.position.y = -0.03;
  root.add(board);
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(R * 4.4, R * 4.4),
    new THREE.MeshBasicMaterial({ map: tex.shadow, transparent: true, depthWrite: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -0.065;
  scene.add(shadow);

  // Couches : chaque couche existe en deux morceaux, gâteau principal et part.
  const layers = [];
  const cuts = [];
  let y = 0;
  LAYERS.forEach((L, i) => {
    const isTop = i === LAYERS.length - 1;
    const cut = new THREE.MeshStandardMaterial({
      color: L.color,
      roughness: L.gloss ? 0.32 : 0.85,
      map: L.crumb ? tex.crumb : null,
      bumpMap: L.crumb ? tex.crumb : tex.grain,
      bumpScale: L.crumb ? 2.5 : 0.3,
      side: THREE.DoubleSide,
    });
    const mats = { side: velvet, top: isTop ? velvet : cut, cut };
    const baseY = y + L.h / 2;
    const m = wedge(L.h, SLICE_START + SLICE_LEN, TAU - SLICE_LEN, mats, cuts);
    const s = wedge(L.h, SLICE_START, SLICE_LEN, mats, cuts);
    m.position.y = s.position.y = baseY;
    main.add(m);
    slice.add(s);
    layers.push({ main: m, slice: s, baseY, h: L.h });
    y += L.h;
  });
  const H = y;
  const top = layers[layers.length - 1];
  const shells = [
    [main, SLICE_START + SLICE_LEN, TAU - SLICE_LEN],
    [slice, SLICE_START, SLICE_LEN],
  ].map(([parent, start, len]) => {
    const segs = Math.max(10, Math.round((128 * len) / TAU));
    const m = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.003, R + 0.003, H - 0.004, segs, 1, true, start, len), velvet);
    m.position.y = H / 2;
    parent.add(m);
    return m;
  });
  const topY = top.h / 2;

  const cm = collar(SLICE_START + SLICE_LEN, TAU - SLICE_LEN, velvet, gold);
  cm.position.y = topY;
  top.main.add(cm);
  const cs = collar(SLICE_START, SLICE_LEN, velvet, gold);
  cs.position.y = topY;
  top.slice.add(cs);

  // Cascade de fleurs sur le flanc décoré, rattachée à la couche qu'elle touche.
  const cascade = [
    [-0.42, 1.28, 1.0],
    [-0.2, 1.0, 0.85],
    [0.02, 0.72, 0.72],
    [0.2, 0.47, 0.6],
    [0.36, 0.25, 0.5],
  ];
  for (const [dt, fy, size] of cascade) {
    const theta = DECOR_THETA + dt;
    const fl = flower(petals, gold, size * 0.62);
    const li = layers.findIndex((l) => fy >= l.baseY - l.h / 2 && fy <= l.baseY + l.h / 2);
    const host = layers[li < 0 ? 0 : li].main;
    fl.position.set(Math.sin(theta) * (R + 0.03), fy - host.position.y, Math.cos(theta) * (R + 0.03));
    fl.lookAt(Math.sin(theta) * 10, fl.position.y, Math.cos(theta) * 10);
    fl.rotateX(Math.PI / 2);
    host.add(fl);
  }

  // Perles dorées posées au pied (comme le gâteau « Bonne Fête Maman »)
  for (const [r, py, dt] of [
    [0.26, 0.26, 0.95],
    [0.17, 0.66, 1.0],
    [0.11, 0.93, 1.04],
  ]) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(r, 48, 32), gold);
    const th = DECOR_THETA + dt;
    b.position.set(Math.sin(th) * (R + r * 0.55), py, Math.cos(th) * (R + r * 0.55));
    root.add(b);
  }
  // Perles sur le dessus, hors de la part
  const pearl = new THREE.SphereGeometry(0.05, 20, 14);
  for (let i = 0; i < 14; i++) {
    const th = SLICE_LEN + 0.25 + Math.random() * (TAU - SLICE_LEN - 0.5);
    const rr = 0.35 + Math.random() * (R - 0.55);
    const p = new THREE.Mesh(pearl, gold);
    p.scale.setScalar(0.6 + Math.random() * 0.9);
    p.position.set(Math.sin(th) * rr, topY + 0.03, Math.cos(th) * rr);
    top.main.add(p);
  }

  // Topper : le monogramme « iG » de la charte, extrudé en or.
  const topper = new THREE.Group();
  topper.position.y = H;
  topper.rotation.y = -ROT_START;
  root.add(topper);
  fetch(`${import.meta.env.BASE_URL}brand/monogram.svg`)
    .then((r) => r.text())
    .then((svg) => {
      const data = new SVGLoader().parse(svg);
      const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));
      const geo = new THREE.ExtrudeGeometry(shapes, {
        depth: 3,
        bevelEnabled: true,
        bevelThickness: 0.5,
        bevelSize: 0.2,
        bevelSegments: 2,
        curveSegments: 8,
      });
      geo.center();
      geo.rotateX(Math.PI);
      const s = 2.7 / 464;
      geo.scale(s, s, s);
      const mono = new THREE.Mesh(geo, gold);
      mono.position.y = 0.95;
      topper.add(mono);
      const stick = new THREE.CylinderGeometry(0.014, 0.014, 0.75, 8);
      for (const x of [-0.2, 0.22]) {
        const st = new THREE.Mesh(stick, gold);
        st.position.set(x, 0.42, 0);
        topper.add(st);
      }
    })
    .catch(() => {});

  // Éléments flottants : macarons, perles d'or et poussière dorée.
  const floaters = [];
  const macColors = ['#d1b6a5', '#ab8275', '#fbefdc', '#89564c', '#e8b4b8', '#69302c'];
  const macPositions = [
    [-4.2, 2.6, -2.5],
    [4.4, 3.1, -3],
    [-3.6, -0.4, 0.5],
    [3.8, 0.2, 1],
    [-1.6, 3.9, -4],
    [2.2, 4.4, -5],
  ];
  macPositions.forEach((p, i) => {
    if (mobile && i >= 4) return; // sur mobile, on dégage le titre
    const m = macaron(macColors[i], tex);
    m.position.set(...p);
    m.scale.setScalar(0.55 + (i % 3) * 0.15);
    m.rotation.set(Math.random() * 1.2, Math.random() * TAU, Math.random() * 0.8);
    scene.add(m);
    floaters.push({ obj: m, base: m.position.clone(), speed: 0.4 + Math.random() * 0.5, phase: Math.random() * TAU, spin: 0.15 + Math.random() * 0.2 });
  });
  for (let i = 0; i < 9; i++) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.08 + Math.random() * 0.14, 32, 24), gold);
    const a = Math.random() * TAU;
    const d = 3.2 + Math.random() * 2.5;
    b.position.set(Math.cos(a) * d, -0.5 + Math.random() * 4.5, Math.sin(a) * d - 1.5);
    scene.add(b);
    floaters.push({ obj: b, base: b.position.clone(), speed: 0.5 + Math.random() * 0.6, phase: Math.random() * TAU, spin: 0 });
  }

  const dustCount = mobile ? 160 : 380;
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 16;
    dustPos[i * 3 + 1] = Math.random() * 9 - 2;
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 1;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({
      size: 0.07,
      map: tex.dot,
      color: '#ffd98f',
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  scene.add(dust);

  // ─── État piloté de l'extérieur (GSAP) ───
  const state = { rot: ROT_START, x: 0, slice: 0, explode: 0, topper: 0, zoom: 0, fade: 0 };
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  window.addEventListener('pointermove', (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  });

  let width = 1;
  let height = 1;
  let baseDist = 10;
  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    const halfTan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    baseDist = Math.max(5.2 / (2 * halfTan), (camera.aspect < 0.8 ? 5.6 : 6.6) / (2 * halfTan * camera.aspect));
  }
  resize();
  window.addEventListener('resize', resize);

  const sliceDir = new THREE.Vector3(Math.sin(SLICE_DIR), 0, Math.cos(SLICE_DIR));
  const tmp = new THREE.Vector3();
  const clock = new THREE.Clock();
  let running = true;

  function update() {
    const t = clock.getElapsedTime();
    const idle = reducedMotion ? 0 : 1;
    pointer.sx += (pointer.x - pointer.sx) * 0.05;
    pointer.sy += (pointer.y - pointer.sy) * 0.05;

    root.rotation.y = state.rot + Math.sin(t * 0.35) * 0.08 * idle + pointer.sx * 0.12;
    root.rotation.x = pointer.sy * 0.04;
    // state.x est exprimé en fraction de la demi-largeur visible : indépendant de l'écran.
    const dist = baseDist * (1 - state.zoom * 0.12) + state.explode * 2.2;
    const halfW = dist * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect;
    root.position.x = state.x * halfW;
    shadow.position.x = root.position.x;

    const spread = 0.42;
    layers.forEach((l, i) => {
      l.main.position.y = l.baseY + state.explode * i * spread;
      l.slice.position.y = l.baseY + state.explode * i * spread;
    });
    const assembled = state.explode < 0.002;
    shells.forEach((m) => (m.visible = assembled));
    const opened = !assembled || state.slice > 0.002;
    cuts.forEach((c) => (c.visible = opened));
    slice.position.copy(sliceDir).multiplyScalar(state.slice * 1.25);
    slice.position.y = state.slice * 0.22 - state.explode * 0.15;
    slice.rotation.y = state.slice * 0.18;

    topper.position.y = H + state.topper * 3.2;
    topper.visible = state.topper < 0.99;

    floaters.forEach((f) => {
      f.obj.position.y = f.base.y + Math.sin(t * f.speed + f.phase) * 0.25 * idle;
      f.obj.rotation.y += f.spin * 0.01 * idle;
    });
    dust.rotation.y = t * 0.02 * idle;
    dust.position.y = Math.sin(t * 0.2) * 0.2 * idle;

    // Sur écran vertical, on remonte le gâteau pour laisser la place au texte en bas.
    const lift = camera.aspect < 0.8 ? -1.1 : 0;
    const lookY = 0.8 + state.explode * 1.1 + lift;
    camera.position.set(pointer.sx * 0.5, lookY + 1.6 + state.explode * 0.4 - pointer.sy * 0.3, dist);
    target.set(0, lookY, 0);
    camera.lookAt(target);
    canvas.style.opacity = String(1 - state.fade);
  }

  function loop() {
    if (running) {
      update();
      renderer.render(scene, camera);
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // Position écran (px) du bord droit d'une couche — sert aux étiquettes HTML.
  function layerAnchor(i) {
    const l = layers[i];
    l.main.updateWorldMatrix(true, false);
    tmp.setFromMatrixPosition(l.main.matrixWorld);
    tmp.x += R + 0.12 + state.slice * 0.95;
    tmp.project(camera);
    return { x: (tmp.x * 0.5 + 0.5) * width, y: (-tmp.y * 0.5 + 0.5) * height };
  }

  return {
    state,
    layerAnchor,
    setRunning(v) {
      running = v;
    },
  };
}
