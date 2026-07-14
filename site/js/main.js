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

// Nav nodes scroll behavior — use Lenis instead of scrollIntoView
navNodes.forEach(node => {
  node.addEventListener('click', e => {
    e.preventDefault();
    const href = node.getAttribute('href');
    const target = document.querySelector(href);
    if (target && window.lenis) {
      window.lenis.scrollTo(target, { force: true });
    } else if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Case population hook for work.js
async function initCasePopulate() {
  try {
    const { getCaseData } = await import('./data/work.js');
    window.casePopulate = (idx) => {
      const data = getCaseData(idx);
      if (!data) {
        console.warn('[case] No data for index', idx);
        return;
      }

      // Populate text fields
      document.getElementById('cRoman').textContent = data.roman;
      document.getElementById('cKick').textContent = data.kick;
      document.getElementById('cName').textContent = data.name;
      document.getElementById('cOne').textContent = data.one;
      document.getElementById('caseIdx').textContent = `CASE 0${idx + 1}`;

      // Populate meta row
      const metaEl = document.getElementById('cMeta');
      metaEl.innerHTML = data.meta
        .map(m => `<span><b>${m.label}:</b> ${m.value}</span>`)
        .join('');

      // Populate what/why/solves sections
      document.getElementById('cWhat').innerHTML = `<p>${data.what}</p>`;
      document.getElementById('cWhy').innerHTML = `<p>${data.why}</p>`;
      document.getElementById('cSolve').innerHTML = `<ul class="plain">${data.solves
        .map(s => `<li>${s}</li>`)
        .join('')}</ul>`;

      // Populate state
      document.getElementById('cState').innerHTML = `<p>${data.state}</p>`;

      // Populate architecture
      const archEl = document.getElementById('cArch');
      const archNodes = data.arch
        .map((n, i) => {
          const parts = [
            `<span class="node ${n.type === 'source' ? 'g' : ''}">${n.name}</span>`
          ];
          if (i < data.arch.length - 1) {
            parts.push('<span class="arr">→</span>');
          }
          return parts.join('');
        })
        .join('');
      archEl.innerHTML = archNodes;

      console.log('[case] Populated case data:', data.id);
    };
  } catch (e) {
    console.warn('[case] Failed to load case data:', e);
  }
}

// Initialize case populate on boot
if (canWebGL) {
  initCasePopulate();
}

// Load content renderers (Acts III–VI)
await import('./content.js');

console.log('[site] Bootstrap complete');
