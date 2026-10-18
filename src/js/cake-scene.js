// Scène 3D : le gâteau cœur « Birthday Queen » de l'atelier, modélisé entièrement en code
// (aucun modèle à télécharger). Au scroll, piloté depuis home.js : la couronne et le topper
// s'envolent, le fondant se soulève et les couches se séparent.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const TAU = Math.PI * 2;
const S = 0.1; // échelle de la courbe du cœur (largeur ≈ 3,2)
const INNER = 0.955; // les couches sont légèrement plus petites que le fondant qui les enveloppe

// Angles du gâteau : départ (pointe du cœur face à la caméra) et vue « éclatée ».
export const ROT_START = -0.32;
export const ROT_REVEAL = 0.85;

// Couches, de bas en haut. `label` = texte affiché lors de l'éclaté.
export const LAYERS = [
  { h: 0.42, color: '#e6b77c', crumb: true, label: 'Biscuit moelleux' },
  { h: 0.12, color: '#fbefdc', label: 'Crème légère' },
  { h: 0.16, color: '#b0182c', gloss: true, label: 'Cœur framboise' },
  { h: 0.12, color: '#fbefdc' },
  { h: 0.42, color: '#7a4330', crumb: true, label: 'Biscuit cacao' },
  { h: 0.1, color: '#4c1212', gloss: true, label: 'Ganache' },
];
const H = LAYERS.reduce((a, l) => a + l.h, 0);

// Contour du cœur (courbe classique), centré sur l'origine.
function heartShape(scale = 1, n = 160) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * TAU;
    const x = 16 * Math.sin(t) ** 3;
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t) + 2.5;
    pts.push(new THREE.Vector2(x * S * scale, y * S * scale));
  }
  return new THREE.Shape(pts);
}

// Extrusion verticale : la forme est dans le plan XZ, la pointe du cœur vers +Z (vers la caméra).
function heartSlab(scale, height, bevel = 0) {
  const geo = new THREE.ExtrudeGeometry(heartShape(scale), {
    depth: height,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 10,
    curveSegments: 1,
    steps: 1,
  });
  geo.rotateX(-Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

function canvasTexture(size, draw, { repeat = 1, srgb = false, w = size, h = size } = {}) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function makeTextures() {
  const grain = canvasTexture(
    256,
    (ctx, s) => {
      const img = ctx.createImageData(s, s);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = 190 + Math.random() * 65;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
    },
    { repeat: 3 },
  );
  // Pailletage du fondant : quelques points brillants (rugosité plus faible).
  const sparkle = canvasTexture(
    512,
    (ctx, s) => {
      ctx.fillStyle = '#b4b4b4';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 2600; i++) {
        const v = Math.random() < 0.5 ? 40 : 90;
        ctx.fillStyle = `rgb(${v},${v},${v})`;
        ctx.fillRect(Math.random() * s, Math.random() * s, 1.4, 1.4);
      }
    },
    { repeat: 2 },
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
    { srgb: true, repeat: 1.2 },
  );
  const dot = canvasTexture(64, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, 'rgba(255,236,190,1)');
    g.addColorStop(0.35, 'rgba(230,190,110,0.8)');
    g.addColorStop(1, 'rgba(217,178,106,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });
  const shadow = canvasTexture(256, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, 'rgba(76,18,18,0.42)');
    g.addColorStop(0.5, 'rgba(76,18,18,0.16)');
    g.addColorStop(1, 'rgba(76,18,18,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });
  return { grain, sparkle, crumb, dot, shadow };
}

// Le topper doré « Birthday Queen », dessiné avec les polices du site puis découpé (alphaMap).
function topperTexture() {
  const w = 1024;
  const h = 640;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    // Étiré en hauteur : posé à plat et vu de biais, le texte retrouve ses proportions.
    ctx.scale(1, 1.55);
    ctx.fillStyle = ctx.strokeStyle = '#fff';
    ctx.lineJoin = 'round';
    ctx.font = '400 300px "Pinyon Script", cursive';
    ctx.lineWidth = 9;
    ctx.strokeText('Queen', 60, 360);
    ctx.fillText('Queen', 60, 360);
    ctx.font = '400 104px "Italiana", "Didot", serif';
    ctx.lineWidth = 3;
    ctx.strokeText('BIRTHDAY', 380, 175);
    ctx.fillText('BIRTHDAY', 380, 175);
    ctx.restore();
    tex.needsUpdate = true;
  };
  const tex = new THREE.CanvasTexture(c);
  draw();
  document.fonts?.load('300px "Pinyon Script"').then(draw).catch(() => {});
  document.fonts?.load('80px "Italiana"').then(draw).catch(() => {});
  return tex;
}

function smallHeart(mat, size) {
  const m = new THREE.Mesh(heartSlab(1, 0.35, 0.18), mat);
  m.geometry.center();
  m.scale.setScalar(size);
  return m;
}

function crown(gold, gem) {
  const g = new THREE.Group();
  const R = 0.2;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(R, 0.022, 12, 64), gold);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.03;
  g.add(ring);
  // Deux rangées d'arches en zigzag, la seconde décalée et plus basse
  for (const [n, height, flare, offset, y0] of [
    [6, 0.42, 1.28, 0, 0.03],
    [6, 0.26, 1.12, Math.PI / 6, 0.05],
  ]) {
    const path = new THREE.CurvePath();
    const pts = [];
    for (let k = 0; k <= n * 2; k++) {
      const a = (k / (n * 2)) * TAU + offset;
      const top = k % 2 === 1;
      const r = top ? R * flare : R;
      pts.push(new THREE.Vector3(Math.cos(a) * r, top ? y0 + height : y0, Math.sin(a) * r));
    }
    for (let k = 0; k < pts.length - 1; k++) path.add(new THREE.LineCurve3(pts[k], pts[k + 1]));
    g.add(new THREE.Mesh(new THREE.TubeGeometry(path, n * 16, 0.014, 6, false), gold));
    pts.forEach((p, k) => {
      if (k % 2 === 1) {
        const tip = new THREE.Mesh(new THREE.SphereGeometry(height > 0.3 ? 0.032 : 0.022, 16, 12), gold);
        tip.position.copy(p);
        g.add(tip);
      }
    });
    // Strass le long des arches
    for (let k = 0; k < pts.length - 1; k++) {
      for (let j = 1; j < 4; j++) {
        const s = new THREE.Mesh(new THREE.SphereGeometry(0.011, 8, 6), gem);
        s.position.lerpVectors(pts[k], pts[k + 1], j / 4);
        g.add(s);
      }
    }
  }
  for (let k = 0; k < 28; k++) {
    const a = (k / 28) * TAU;
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.013, 8, 6), gem);
    s.position.set(Math.cos(a) * (R + 0.02), 0.03, Math.sin(a) * (R + 0.02));
    g.add(s);
  }
  g.traverse((o) => (o.castShadow = true));
  return g;
}

function macaron(color, grain) {
  const g = new THREE.Group();
  const shell = new THREE.MeshPhysicalMaterial({ color, roughness: 0.5, sheen: 0.6, sheenColor: new THREE.Color('#ffffff'), bumpMap: grain, bumpScale: 0.6 });
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
  const fill = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.18, 40), new THREE.MeshStandardMaterial({ color: '#fbefdc', roughness: 0.6 }));
  g.add(top, bottom, f1, f2, fill);
  return g;
}

export function createCakeScene(canvas, { reducedMotion = false, mobile = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // Neutral : couleurs fidèles à la photo (le rouge du fondant ne vire pas à l'orange).
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = !mobile;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.7;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const target = new THREE.Vector3();

  scene.add(new THREE.HemisphereLight('#fff6ec', '#d1b6a5', 0.9));
  const key = new THREE.DirectionalLight('#fff3e6', 2.1);
  key.position.set(3.5, 7, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = key.shadow.camera.bottom = -3;
  key.shadow.camera.right = key.shadow.camera.top = 3;
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 20;
  key.shadow.bias = -0.0005;
  key.shadow.radius = 6;
  const rim = new THREE.DirectionalLight('#ffd0c4', 1.8);
  rim.position.set(-6, 3, -5);
  const warm = new THREE.PointLight('#ffcf8a', 6, 14, 1.6);
  warm.position.set(-3, 1.2, 4);
  scene.add(key, rim, warm);

  const tex = makeTextures();
  const fondant = new THREE.MeshPhysicalMaterial({
    color: '#a8121c',
    roughness: 0.58,
    roughnessMap: tex.sparkle,
    sheen: 0.45,
    sheenColor: new THREE.Color('#ff8f8f'),
    sheenRoughness: 0.35,
    bumpMap: tex.grain,
    bumpScale: 0.35,
    transparent: true,
  });
  const heartMat = new THREE.MeshPhysicalMaterial({ color: '#c01a28', roughness: 0.7, sheen: 0.5, sheenColor: new THREE.Color('#ff9d9d') });
  const gold = new THREE.MeshPhysicalMaterial({ color: '#f0c66e', metalness: 1, roughness: 0.18, clearcoat: 0.5 });
  const gem = new THREE.MeshPhysicalMaterial({ color: '#ffffff', metalness: 0.1, roughness: 0.02, clearcoat: 1, envMapIntensity: 3 });

  const root = new THREE.Group(); // tout le gâteau, tourne sur lui-même
  scene.add(root);

  // Plateau carré blanc, comme sur la photo
  const board = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.04, 3.9), new THREE.MeshStandardMaterial({ color: '#fffdf9', roughness: 0.35 }));
  board.position.y = -0.02;
  board.receiveShadow = true;
  root.add(board);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), new THREE.MeshBasicMaterial({ map: tex.shadow, transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -0.045;
  scene.add(shadow);

  // Couches intérieures (visibles quand le fondant se soulève)
  const layers = [];
  let y = 0;
  LAYERS.forEach((L) => {
    const mat = new THREE.MeshStandardMaterial({
      color: L.color,
      roughness: L.gloss ? 0.3 : 0.85,
      map: L.crumb ? tex.crumb : null,
      bumpMap: L.crumb ? tex.crumb : tex.grain,
      bumpScale: L.crumb ? 2.2 : 0.3,
    });
    const m = new THREE.Mesh(heartSlab(INNER, L.h, 0.012), mat);
    const baseY = y;
    m.position.y = baseY;
    m.receiveShadow = true;
    root.add(m);
    layers.push({ mesh: m, baseY, h: L.h });
    y += L.h;
  });

  // Le fondant : une coque qui enveloppe tout (bords arrondis), et ses décors.
  const shell = new THREE.Group();
  root.add(shell);
  const bevel = 0.17; // bords bien arrondis, comme un fondant drapé
  const body = new THREE.Mesh(heartSlab(1, H + 0.02 - bevel * 2, bevel), fondant);
  body.position.y = bevel;
  body.castShadow = body.receiveShadow = true;
  shell.add(body);
  const topY = H + 0.02;

  // Petits cœurs sur le dessus et sur les épaules du cœur
  for (const [x, z, s, r] of [
    [-0.95, -0.55, 0.075, 0.4],
    [-0.35, -0.82, 0.07, -0.2],
    [0.05, 0.62, 0.075, 0.1],
    [-1.42, -0.1, 0.06, 0.9],
    [1.45, -0.18, 0.06, -0.9],
  ]) {
    const h = smallHeart(heartMat, s);
    h.position.set(x, topY + 0.015, z);
    h.rotation.y = r;
    h.castShadow = true;
    shell.add(h);
  }
  // Colonne de cœurs sur la pointe, face à la caméra
  const tipZ = (17 - 2.5) * S + bevel;
  for (let i = 0; i < 6; i++) {
    const h = smallHeart(heartMat, 0.095);
    h.rotation.x = Math.PI / 2;
    h.position.set(0, 0.16 + i * 0.19, tipZ + 0.01);
    h.castShadow = true;
    shell.add(h);
  }

  // Topper « Birthday Queen » posé à plat, en léger relief (plaques superposées)
  const topper = new THREE.Group();
  const tTex = topperTexture();
  // Un peu d'émission pour que l'or reste lisible même vu de biais
  const tMat = new THREE.MeshPhysicalMaterial({ color: '#f3cf7c', metalness: 0.9, roughness: 0.28, emissive: '#7a5414', emissiveIntensity: 0.55, alphaMap: tTex, alphaTest: 0.5, side: THREE.DoubleSide, clearcoat: 0.4 });
  const tGeo = new THREE.PlaneGeometry(2.1, 1.31);
  for (let i = 0; i < 5; i++) {
    const p = new THREE.Mesh(tGeo, tMat);
    p.rotation.x = -Math.PI / 2;
    p.position.y = i * 0.006;
    p.castShadow = i === 4;
    topper.add(p);
  }
  topper.position.set(-0.18, topY + 0.01, 0.12);
  topper.rotation.y = 0.05;
  shell.add(topper);

  const crownG = crown(gold, gem);
  crownG.position.set(0.95, topY, -0.6);
  crownG.rotation.set(0.05, 0.3, -0.06);
  shell.add(crownG);

  // Éléments flottants : macarons, cœurs, perles d'or et poussière dorée
  const floaters = [];
  const float = (obj, speed = 0.5, spin = 0.2) =>
    floaters.push({ obj, base: obj.position.clone(), speed: speed + Math.random() * 0.4, phase: Math.random() * TAU, spin });
  [
    ['#d1b6a5', [-7.2, 1.2, -3.5]],
    ['#ab8275', [5.2, 1.4, -3]],
    ['#fbefdc', [-6.2, -0.6, 0.5]],
    ['#e8b4b8', [4.4, -0.2, 1]],
  ].forEach(([c, p], i) => {
    if (mobile && i > 1) return;
    const m = macaron(c, tex.grain);
    m.position.set(...p);
    m.scale.setScalar(0.55 + (i % 3) * 0.15);
    m.rotation.set(Math.random() * 1.2, Math.random() * TAU, Math.random() * 0.8);
    scene.add(m);
    float(m);
  });
  // Positions choisies à la main : sur les côtés, jamais devant le logo ni le texte.
  const HEARTS = [
    [4.3, 1.9, -2.2, 0],
    [5.9, 0.1, -1.2, 1],
    [3.7, -0.7, 1.2, 1],
    [-6.6, 1.4, -2.6, 0],
    [-5.6, -0.6, 0.2, 1],
    [6.6, 2.3, -4.2, 1],
    [-7.4, -0.2, -3.5, 0],
  ];
  HEARTS.forEach(([x, y, z, red], i) => {
    if (mobile && i > 3) return;
    const h = smallHeart(red ? heartMat : gold, 0.17 + (i % 3) * 0.05);
    h.position.set(x, y, z);
    h.rotation.set(0.4 + i, i * 1.3, 0.2 * i);
    scene.add(h);
    float(h, 0.5, 0.4);
  });
  const PEARLS = [
    [4.9, 1.0, 0.4, 0.12],
    [3.4, 2.4, -3.0, 0.08],
    [6.2, -0.8, -0.5, 0.16],
    [-6.0, 2.2, -3.2, 0.1],
    [-4.9, 0.6, 1.2, 0.07],
    [5.4, 3.0, -5.0, 0.11],
  ];
  PEARLS.forEach(([x, y, z, r]) => {
    const b = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 24), gold);
    b.position.set(x, y, z);
    scene.add(b);
    float(b, 0.6, 0);
  });

  const dustCount = mobile ? 140 : 320;
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 16;
    dustPos[i * 3 + 1] = Math.random() * 9 - 2;
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 1;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ size: 0.06, map: tex.dot, transparent: true, opacity: 0.9, depthWrite: false }));
  scene.add(dust);

  // ─── État piloté de l'extérieur (GSAP) ───
  // open : le fondant se soulève · explode : les couches se séparent · topper : couronne et topper s'envolent
  const state = { rot: ROT_START, x: 0, open: 0, explode: 0, topper: 0, zoom: 0, fade: 0, drop: 0 };
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
    baseDist = Math.max(6.2 / (2 * halfTan), (camera.aspect < 0.8 ? 5.4 : 7.4) / (2 * halfTan * camera.aspect));
  }
  resize();
  window.addEventListener('resize', resize);

  const tmp = new THREE.Vector3();
  const clock = new THREE.Clock();
  let running = true;

  function update() {
    const t = clock.getElapsedTime();
    const idle = reducedMotion ? 0 : 1;
    pointer.sx += (pointer.x - pointer.sx) * 0.05;
    pointer.sy += (pointer.y - pointer.sy) * 0.05;

    root.rotation.y = state.rot + Math.sin(t * 0.35) * 0.1 * idle + pointer.sx * 0.15;
    root.rotation.x = pointer.sy * 0.04;
    root.position.y = state.drop * 4;

    const dist = baseDist * (1 - state.zoom * 0.12) + state.explode * 2;
    const halfW = dist * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect;
    root.position.x = state.x * halfW;
    shadow.position.x = root.position.x;
    shadow.material.opacity = 1 - state.drop;

    const spread = 0.38;
    layers.forEach((l, i) => (l.mesh.position.y = l.baseY + state.explode * i * spread));

    // Le fondant monte et s'efface pour dévoiler l'intérieur
    shell.position.y = state.open * 3.2 + state.explode * LAYERS.length * spread;
    fondant.opacity = 1 - THREE.MathUtils.smoothstep(state.open, 0.35, 0.85);
    fondant.depthWrite = fondant.opacity > 0.99;
    shell.visible = fondant.opacity > 0.01;

    // Couronne et topper s'envolent en tournant
    crownG.position.y = topY + state.topper * 2.6;
    crownG.rotation.y = 0.3 + state.topper * 3;
    topper.position.y = topY + 0.01 + state.topper * 1.8;
    topper.rotation.z = state.topper * 0.6;
    crownG.visible = topper.visible = state.topper < 0.98;

    floaters.forEach((f) => {
      f.obj.position.y = f.base.y + Math.sin(t * f.speed + f.phase) * 0.25 * idle;
      f.obj.rotation.y += f.spin * 0.01 * idle;
    });
    dust.rotation.y = t * 0.02 * idle;
    dust.position.y = Math.sin(t * 0.2) * 0.2 * idle;

    // Sur écran vertical, le gâteau remonte pour laisser la place au texte en bas.
    const lift = camera.aspect < 0.8 ? -0.7 : 0.6;
    const lookY = 0.7 + state.explode * 1.1 + lift - state.open * 0.4;
    camera.position.set(pointer.sx * 0.5, lookY + 3.4 - state.explode * 0.6 - pointer.sy * 0.3, dist);
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
  const right = new THREE.Vector3();
  function layerAnchor(i) {
    const l = layers[i];
    l.mesh.updateWorldMatrix(true, false);
    right.setFromMatrixColumn(camera.matrixWorld, 0); // direction « droite » de la caméra
    tmp.set(0, l.h / 2, 0).applyMatrix4(l.mesh.matrixWorld).addScaledVector(right, 1.75);
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
