import { initCommon, gsap, ScrollTrigger, reducedMotion, isTouch, lenis, session } from './common.js';
import { createCakeScene, LAYERS, ROT_REVEAL } from './cake-scene.js';

initCommon();

const mobile = window.matchMedia('(max-width: 760px)').matches;
const canvas = document.querySelector('.webgl');

let scene = null;
try {
  scene = createCakeScene(canvas, { reducedMotion, mobile });
} catch (err) {
  console.warn('WebGL indisponible, affichage simplifié.', err);
  document.documentElement.classList.add('no-webgl');
}

// ─── Préchargement (une fois par session) ───
function runLoader() {
  const loader = document.querySelector('.loader');
  if (!loader) return Promise.resolve();
  if (session.get('ig-seen') || reducedMotion) {
    loader.remove();
    return Promise.resolve();
  }
  session.set('ig-seen', '1');
  lenis?.stop();
  const count = loader.querySelector('.loader__count');
  const n = { v: 0 };
  return new Promise((resolve) => {
    gsap
      .timeline({
        onComplete: () => {
          loader.remove();
          lenis?.start();
        },
      })
      .to(loader.querySelector('.loader__mono'), { clipPath: 'inset(0 0% 0 0)', duration: 1.8, ease: 'power2.inOut' }, 0)
      .to(n, { v: 100, duration: 1.8, ease: 'power2.inOut', onUpdate: () => (count.textContent = Math.round(n.v)) }, 0)
      .to(loader, { yPercent: -100, duration: 1.1, ease: 'expo.inOut', onStart: resolve }, 2.1);
  });
}

// ─── Entrée du héros ───
function heroIntro() {
  if (reducedMotion) return;
  const tl = gsap.timeline();
  tl.from('.hero__word path', { yPercent: 40, opacity: 0, duration: 1.6, stagger: 0.035, ease: 'expo.out' }, 0.1)
    .from('[data-hero-in]', { y: 30, opacity: 0, duration: 1.2, stagger: 0.12, ease: 'expo.out' }, 0.5)
    .from('.scroll-hint', { opacity: 0, duration: 1 }, 1);
  if (scene) tl.fromTo(scene.state, { fade: 1, zoom: -1.2 }, { fade: 0, zoom: 0, duration: 2.2, ease: 'expo.out' }, 0);
}

// ─── Histoire 3D pilotée par le scroll ───
function initStory() {
  const steps = gsap.utils.toArray('.story__step');
  if (!scene) return;
  const S = scene.state;
  const xRight = mobile ? 0 : 0.36;

  const labelsBox = document.querySelector('.story__labels');
  const labels = LAYERS.map((L, i) => {
    if (!L.label) return null;
    const el = document.createElement('div');
    el.className = 'label3d';
    el.innerHTML = `<span>${L.label}</span>`;
    labelsBox.appendChild(el);
    return { el, i };
  }).filter(Boolean);
  const labelState = { o: 0 };

  gsap.ticker.add(() => {
    if (labelState.o <= 0.001) {
      labels.forEach((l) => (l.el.style.opacity = '0'));
      return;
    }
    labels.forEach((l, k) => {
      const p = scene.layerAnchor(l.i);
      const o = gsap.utils.clamp(0, 1, labelState.o * labels.length - (labels.length - 1 - k) * 0.6);
      l.el.style.transform = `translate(${p.x + 14}px, ${p.y}px)`;
      l.el.style.opacity = String(o);
    });
  });

  const stepIn = () => ({ autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' });
  const stepOut = { autoAlpha: 0, y: -40, duration: 0.5, ease: 'power2.in' };
  gsap.set(steps, { autoAlpha: 0, y: 40 });

  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: { trigger: '.stage', start: 'top top', end: 'bottom bottom', scrub: 1.2 },
  });
  tl.to(S, { topper: 1, duration: 1.4, ease: 'power2.in' }, 0)
    .to(S, { rot: ROT_REVEAL, duration: 3 }, 0)
    .to(S, { x: xRight, duration: 2.2 }, 0.8)
    .to('.hero__word', { yPercent: -60, opacity: 0, duration: 1.6, ease: 'none' }, 0)
    .to(steps[0], stepIn(), 1.7)
    .to(steps[0], stepOut, 3.1)
    .to(S, { slice: 1, zoom: 1, duration: 1.4, ease: 'power3.out' }, 3.1)
    .to(steps[1], stepIn(), 3.6)
    .to(steps[1], stepOut, 5)
    .to(S, { explode: 1, slice: 0.45, x: mobile ? -0.3 : 0.1, zoom: 0.4, rot: ROT_REVEAL + 0.25, duration: 1.8 }, 5.1)
    .to(labelState, { o: 1, duration: 1 }, 6.1)
    .to(steps[2], stepIn(), 5.6)
    .to(steps[2], stepOut, 7.6)
    .to(labelState, { o: 0, duration: 0.5 }, 7.6)
    .to(S, { explode: 0, slice: 0, zoom: 0, x: xRight, rot: ROT_REVEAL + 2 * Math.PI * 0.25, duration: 1.6 }, 7.8)
    .to(steps[3], stepIn(), 8.4)
    .to('.story__progress i', { scaleY: 1, duration: 10, ease: 'none' }, 0)
    .to({}, { duration: 0.6 }, 9.4);

  ScrollTrigger.create({
    trigger: '.stage',
    start: 'top top',
    end: 'bottom top',
    onLeave: () => {
      scene.setRunning(false);
      canvas.style.visibility = 'hidden';
    },
    onEnterBack: () => {
      scene.setRunning(true);
      canvas.style.visibility = 'visible';
    },
  });
}

// ─── Vitrine horizontale ───
function initShowcase() {
  const section = document.querySelector('.showcase');
  const track = section?.querySelector('.showcase__track');
  if (!track) return;
  const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
  const tween = gsap.to(track, {
    x: () => -dist(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${dist()}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });
  gsap.to('.showcase__bar i', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${dist()}`, scrub: true, invalidateOnRefresh: true },
  });
  if (reducedMotion) return;
  section.querySelectorAll('[data-parallax]').forEach((img) => {
    gsap.fromTo(
      img,
      { xPercent: -7 },
      {
        xPercent: 7,
        ease: 'none',
        scrollTrigger: { trigger: img.closest('.slide'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
      },
    );
  });
}

// ─── Cartes catégories inclinables ───
function initTilt() {
  if (isTouch || reducedMotion) return;
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    const inner = card.querySelector('.cat__inner');
    const rx = gsap.quickTo(inner, 'rotationX', { duration: 0.8, ease: 'power3' });
    const ry = gsap.quickTo(inner, 'rotationY', { duration: 0.8, ease: 'power3' });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 14);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
    });
    card.addEventListener('pointerleave', () => {
      rx(0);
      ry(0);
    });
  });
}

function initDraw() {
  if (reducedMotion) return;
  document.querySelectorAll('[data-draw]').forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0 0% 0 0)', ease: 'none', scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 35%', scrub: 1 } },
    );
  });
}

initStory();
initShowcase();
initTilt();
initDraw();
runLoader().then(heroIntro);
window.addEventListener('load', () => ScrollTrigger.refresh());
