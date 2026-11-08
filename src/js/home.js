import { initCommon, gsap, ScrollTrigger, reducedMotion, isTouch, lenis, session } from './common.js';

initCommon();

const mobile = window.matchMedia('(max-width: 760px)').matches;
const canvas = document.querySelector('.cake-canvas');

// Le gâteau est une séquence d'images tirée d'une vraie vidéo : la première image s'affiche
// tout de suite, les autres se chargent en arrière-plan.
let cake = null;
const cakeReady = import('./cake-sequence.js')
  .then((mod) => mod.createCakeSequence(canvas, { mobile }))
  .then((c) => {
    cake = c;
    // Cadrage du héros : le gâteau sous le logo
    Object.assign(cake.state, mobile ? { y: -0.03, s: 1.45 } : { y: 0.17, s: 0.74 }, { fade: reducedMotion ? 0 : 1 });
    cake.draw();
  })
  .catch((err) => {
    console.warn('Animation du gâteau indisponible, affichage simplifié.', err);
    document.documentElement.classList.add('no-webgl');
  });

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
    // Filet de sécurité : l'écran de chargement ne peut jamais rester affiché
    setTimeout(() => {
      if (!loader.isConnected) return;
      loader.remove();
      lenis?.start();
      resolve();
    }, 5000);
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
  tl.fromTo('.hero__logo', { clipPath: 'inset(0 100% 0 0)', y: 20 }, { clipPath: 'inset(0 0% 0 0)', y: 0, duration: 1.8, ease: 'power3.inOut' }, 0.1)
    .from('[data-hero-in]', { y: 30, opacity: 0, duration: 1.2, stagger: 0.12, ease: 'expo.out' }, 0.5)
    .from('.scroll-hint', { opacity: 0, duration: 1 }, 1);
}

// Le gâteau apparaît en douceur
function cakeIntro() {
  if (!cake || reducedMotion) return;
  gsap.fromTo(cake.state, { fade: 1, s: cake.state.s * 0.94 }, { fade: 0, s: cake.state.s, duration: 1.8, ease: 'expo.out', delay: 0.2, onUpdate: cake.draw });
}

// ─── Histoire pilotée par le scroll : le gâteau tourne, s'ouvre, puis montre ses couches ───
function initStory() {
  const steps = gsap.utils.toArray('.story__step');
  if (!cake) return;
  const S = cake.state;
  const { rotationEnd, openStart, last } = cake.steps;

  const labelsBox = document.querySelector('.story__labels');
  const labels = cake.labels.map((L) => {
    const el = document.createElement('div');
    el.className = 'label3d is-center';
    el.innerHTML = `<span>${L.text}</span>`;
    labelsBox.appendChild(el);
    return { el, L };
  });
  const labelState = { o: 0 };
  const render = () => {
    cake.draw();
    labels.forEach(({ el, L }, k) => {
      const o = gsap.utils.clamp(0, 1, labelState.o * labels.length - (labels.length - 1 - k) * 0.6);
      el.style.opacity = String(o);
      if (o > 0) {
        // Centrée sur la couche, sans jamais dépasser du bord de l'écran
        const p = cake.project(L.x, L.y);
        const half = el.offsetWidth / 2 + 10;
        const x = gsap.utils.clamp(half, window.innerWidth - half, p.x);
        el.style.transform = `translate(${x}px, ${p.y}px)`;
      }
    });
  };

  const stepIn = () => ({ autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' });
  const stepOut = { autoAlpha: 0, y: -40, duration: 0.5, ease: 'power2.in' };
  gsap.set(steps, { autoAlpha: 0, y: 40 });

  // Cadrages : à droite du texte sur ordinateur, au-dessus du texte sur téléphone
  const story = mobile ? { x: 0, y: -0.2, s: 1.9 } : { x: 0.22, y: 0.06, s: 0.8 };
  const opened = mobile ? { x: 0, y: -0.16, s: 1.32 } : { x: 0.24, y: 0.05, s: 0.72 };

  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    onUpdate: render,
    scrollTrigger: { trigger: '.stage', start: 'top top', end: 'bottom bottom', scrub: 1 },
  });
  tl.to('.hero__logo', { yPercent: -80, opacity: 0, duration: 1.6, ease: 'none' }, 0)
    .to(S, { ...story, duration: 2 }, 0.4)
    .to(S, { p: rotationEnd, duration: 3.8, ease: 'none' }, 0)
    .to(steps[0], stepIn(), 1.7)
    .to(steps[0], stepOut, 3.3)
    .to(S, { p: openStart, duration: 0.6, ease: 'none' }, 3.8)
    .to(S, { p: last, duration: 1.8, ease: 'power1.out' }, 4.4)
    .to(S, { ...opened, duration: 1.8 }, 4.4)
    .to(steps[1], stepIn(), 3.8)
    .to(steps[1], stepOut, 5.4)
    .to(labelState, { o: 1, duration: 1 }, 6)
    .to(steps[2], stepIn(), 5.8)
    .to(steps[2], stepOut, 7.6)
    .to(labelState, { o: 0, duration: 0.5 }, 7.6)
    .to(steps[3], stepIn(), 8.2)
    .to('.story__progress i', { scaleY: 1, duration: 10, ease: 'none' }, 0)
    .to({}, { duration: 0.6 }, 9.4);

  // Le canvas fixe est masqué une fois l'histoire passée
  ScrollTrigger.create({
    trigger: '.stage',
    start: 'top top',
    end: 'bottom top',
    onLeave: () => (canvas.style.visibility = 'hidden'),
    onEnterBack: () => (canvas.style.visibility = 'visible'),
  });
  window.addEventListener('resize', render);
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

initShowcase();
initTilt();
initDraw();
const loaded = runLoader();
loaded.then(heroIntro);
Promise.all([loaded, cakeReady]).then(() => {
  initStory();
  cakeIntro();
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
});
window.addEventListener('load', () => ScrollTrigger.refresh());
