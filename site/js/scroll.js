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

acts.forEach((act, i) => {
  const trigger = ScrollTrigger.create({
    trigger: act,
    start: 'top center',
    snap: {
      snapTo: 0,
      inertia: true,
      duration: 0.6,
      delay: 0.1
    }
  });
  triggers.push({ act, trigger, index: i });
});

console.log('[scroll] Lenis + ScrollTrigger wired, snap enabled');

// Expose for scene manager
window.scrollTriggers = triggers;

// Anchor deep-link resolution — handle hash on load and hashchange
function resolveAnchor() {
  const hash = window.location.hash;
  if (!hash || hash === '#') return;

  const id = hash.substring(1);
  const target = document.getElementById(id);
  if (!target) return;

  if (window.lenis) {
    // Use Lenis to scroll smoothly (wrapped in rAF to ensure next frame)
    requestAnimationFrame(() => {
      window.lenis.scrollTo(target, { immediate: true, force: true });
      console.log('[scroll] Resolved anchor (Lenis):', id);
    });
  } else {
    // Fallback: native scroll (for headless/testing)
    target.scrollIntoView({ behavior: 'auto' });
    console.log('[scroll] Resolved anchor (native):', id);
  }
}

// Set up hash resolution
window.addEventListener('hashchange', resolveAnchor);

// Resolve hash on page load (DOMContentLoaded or defer if already loaded)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', resolveAnchor);
} else {
  // DOM already ready, schedule resolution after Lenis init (scroll.js top-level runs first)
  requestAnimationFrame(() => {
    setTimeout(resolveAnchor, 10);
  });
}
