// Lenis + GSAP ScrollTrigger orchestration

// Global Lenis instance (autoRaf: false, we drive it from gsap.ticker)
window.lenis = new Lenis({
  duration: 1.2,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  smoothTouch: false,
  touchMultiplier: 2,
  autoRaf: false
});

// Wire Lenis to GSAP ticker
gsap.ticker.add(time => {
  lenis.raf(time * 1000);
});

// Update ScrollTriggers on Lenis scroll
lenis.on('scroll', () => {
  ScrollTrigger.update();
});

// Disable scroll during case view
window.lenisControl = {
  pause() {
    lenis.stop();
  },
  resume() {
    lenis.start();
  }
};

// ScrollTrigger with proximity snap (act starts)
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.defaults({
  scroller: window
});

// Create ScrollTriggers for each act (for snapping + pinning later)
const acts = document.querySelectorAll('.act');
const triggers = [];

// ponytail: snap disabled for now (interferes with deep-link navigation)
// Snapping will be added back as opt-in feature only for user-initiated scrolls
// acts.forEach((act, i) => {
//   const trigger = ScrollTrigger.create({
//     trigger: act,
//     start: 'top center',
//     snap: {
//       snapTo: 0,
//       inertia: true,
//       duration: 0.6,
//       delay: 0.1
//     }
//   });
//   triggers.push({ act, trigger, index: i });
// });

// Minimal trigger setup (no snap) for scroll detection
acts.forEach((act, i) => {
  const trigger = ScrollTrigger.create({
    trigger: act,
    start: 'top center'
  });
  triggers.push({ act, trigger, index: i });
});

console.log('[scroll] Lenis + ScrollTrigger wired, snap disabled');

// Expose for scene manager
window.scrollTriggers = triggers;

// Anchor deep-link resolution — handle hash on load and hashchange
async function resolveAnchor() {
  const hash = window.location.hash;
  if (!hash || hash === '#') return;

  const id = hash.substring(1);
  const target = document.getElementById(id);
  if (!target) return;

  // ponytail: wait for both scene manager and scene registration to be ready
  if (!window.sceneManager || !window.scenesReady) {
    setTimeout(resolveAnchor, 50);
    return;
  }

  // Wait for scenes to be registered before activating
  try {
    await window.scenesReady;
  } catch (e) {
    console.warn('[scroll] scenesReady promise failed:', e);
  }

  // ponytail: use native scroll for hash navigation (Lenis smooth scroll can be unreliable during page load)
  // Lenis is reserved for user-initiated navigation (nav clicks)
  target.scrollIntoView({ behavior: 'auto' });
  console.log('[scroll] Resolved anchor (native):', id);

  // Manual scene activation after hash resolution (IntersectionObserver may not fire in headless)
  const actIndex = Array.from(document.querySelectorAll('.act')).indexOf(target);
  if (actIndex !== -1 && window.sceneManager) {
    const actNames = ['origin', 'work', 'path', 'capital', 'voice', 'signal'];
    window.sceneManager.setCurrentActIndex(actIndex);
    window.sceneManager.setActiveSceneName(actNames[actIndex]);
    window.sceneManager.activateScene(actNames[actIndex]);
    console.log('[scroll] Manual scene activation:', actNames[actIndex]);
  }
}

// Set up hash resolution
window.addEventListener('hashchange', resolveAnchor);

// Resolve hash on page load (DOMContentLoaded or defer if already loaded)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', resolveAnchor);
} else {
  // DOM already ready; resolve immediately (Lenis is initialized at top of scroll.js)
  // Note: stage.js may not be loaded yet, so resolveAnchor will retry if needed
  resolveAnchor();
}
