// U1: Bootstrap — capability check, conditional WebGL boot

const isReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const html = document.documentElement;

// Capability check: WebGL2 or WebGL1?
function checkWebGL() {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('webgl2') || canvas.getContext('webgl');
    return ctx ? (canvas.getContext('webgl2') ? '2' : '1') : null;
  } catch (e) {
    return null;
  }
}

const webglVersion = checkWebGL();
const canWebGL = !!webglVersion && !isReducedMotion;

if (!canWebGL) {
  // Fallback: no WebGL or reduced-motion
  html.classList.add('fallback');
  console.log('[site] Fallback mode:', { isReducedMotion, webglVersion });
  // Nav rail still works; content is static editorial
  await import('./scroll.js');
} else {
  // Boot WebGL after first paint
  console.log('[site] WebGL', webglVersion, 'available, loading async...');

  // Load scroll system immediately (works both paths)
  const scrollPromise = import('./scroll.js');

  // Load stage (renderer + scenes) after requestIdleCallback
  await new Promise(resolve => {
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => resolve(), { timeout: 2000 });
    } else {
      setTimeout(resolve, 200);
    }
  });

  await scrollPromise;
  await import('./stage.js');
  console.log('[site] WebGL layer loaded');
}

// Nav rail active state (IntersectionObserver)
const navNodes = document.querySelectorAll('.nav-node');
const acts = document.querySelectorAll('.act');
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navNodes.forEach(n => n.classList.remove('active'));
        const activeNode = document.querySelector(`.nav-node[data-act="${id}"]`);
        if (activeNode) activeNode.classList.add('active');
      }
    });
  },
  { threshold: 0.5 }
);

acts.forEach(act => observer.observe(act));

// Nav nodes scroll behavior
navNodes.forEach(node => {
  node.addEventListener('click', e => {
    e.preventDefault();
    const href = node.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

console.log('[site] Bootstrap complete');
