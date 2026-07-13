// WebGL Renderer + Scene Manager + Quality Tiers
// U10 → Scene Contract: ALL scenes implement createScene(ctx) returning {mount, unmount, tick(progress, time), resize, setQuality}

import * as THREE from 'three';

// ============ SCENE CONTRACT (five other agents build against this) ============
/*
createScene(ctx) → {mount, unmount, tick(progress, time), resize, setQuality}

ctx = {
  THREE: THREE module
  renderer: THREE.WebGLRenderer (full-viewport, fixed canvas)
  scene: THREE.Scene (one per act; scenes manage their own group)
  camera: THREE.PerspectiveCamera (shared; scenes may replace or manage per-camera rigs)
  section: HTMLElement (the #origin/#work/#path etc. section)
  data: object with loaded data from site/js/data/*.js if needed
  qualityTier: 'full' | 'medium' | 'low'
  dpr: devicePixelRatio (capped at 2)
  w, h: canvas width/height
}

Methods:
  mount(): called when scene enters viewport → add geometry/materials to ctx.scene, setup state
  unmount(): called on exit → dispose geometry/materials, clear ctx.scene
  tick(progress, time): called every frame while visible
    progress: [0..1] scroll-driven progress (0 = top of section, 1 = bottom)
    time: global elapsed time in seconds (continues across scene changes)
  resize(w, h): called on window.resize
  setQuality(tier): called at init and if quality shifts; update geometry counts, post-processing toggles

Contract constraints:
  - One global THREE.Scene; each scene adds a THREE.Group to ctx.scene
  - One global camera; scenes read it, do NOT replace it (per-scene rigs via groups + local transforms)
  - Dispose all geometries/materials in unmount() — context loss recovery depends on clean disposal
  - tick() MUST return immediately if unmount was called; no dangling references
*/

// Quality tier detection
function getQualityTier() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const memory = navigator.deviceMemory || 8;

  if (memory >= 8 && dpr >= 1.5) {
    return 'full'; // Post-processing on
  } else if (memory >= 4 && dpr <= 1.5) {
    return 'medium'; // No post-processing
  } else {
    return 'low'; // Reduced filaments
  }
}

const qualityTier = getQualityTier();
console.log('[stage] Quality tier:', qualityTier);

// WebGL Context Loss Handling
function setupContextLossHandling(renderer) {
  renderer.domElement.addEventListener('webglcontextlost', e => {
    e.preventDefault();
    console.warn('[stage] WebGL context lost');
    document.documentElement.classList.add('fallback');
  });
}

// Scene Manager
class SceneManager {
  constructor() {
    this.scenes = new Map();
    this.activeScene = null;
    this.activeSceneName = null;
    this.currentActIndex = 0;
    this.time = 0;
    this.canvas = document.getElementById('webgl-canvas');

    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: qualityTier !== 'low',
      powerPreference: qualityTier === 'low' ? 'low-power' : 'default'
    });

    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    // ponytail: set clear alpha to 1 (opaque) so AdditiveBlending renders properly; background color compositing via CSS if needed
    this.renderer.setClearColor(0x0C0E16, 1);

    setupContextLossHandling(this.renderer);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Start tick loop
    this.tick();
  }

  resize() {
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();

    if (this.activeScene?.resize) {
      this.activeScene.resize(w, h);
    }
  }

  async registerScene(name, createSceneFn) {
    const section = document.getElementById(name);
    const data = await import(`./data/${name}.js`).catch(() => ({}));
    const ctx = {
      THREE,
      renderer: this.renderer,
      scene: this.scene,
      camera: this.camera,
      section,
      data,
      qualityTier,
      dpr: Math.min(devicePixelRatio || 1, 2),
      w: this.canvas.clientWidth,
      h: this.canvas.clientHeight
    };

    const sceneApi = createSceneFn(ctx);
    this.scenes.set(name, { api: sceneApi, ctx, mounted: false });
  }

  activateScene(name) {
    if (this.activeScene?.unmount) {
      this.activeScene.unmount();
    }

    const entry = this.scenes.get(name);
    if (!entry) return;

    this.activeScene = entry.api;
    this.activeSceneName = name;
    entry.mounted = true;
    entry.api.mount?.();
  }

  tick = () => {
    // The rAF chain must survive scene bugs — one bad tick may not kill the site.
    try {
      this.time += 1 / 60;

      // Get scroll progress from ScrollTrigger for active scene
      let progress = 0;
      if (window.scrollTriggers && this.activeSceneName) {
        const triggerEntry = window.scrollTriggers.find(t => t.index === this.currentActIndex);
        if (triggerEntry?.trigger) {
          progress = triggerEntry.trigger.progress || 0;
        }
      }

      if (this.activeScene?.tick) {
        this.activeScene.tick(progress, this.time);
      }

      this.renderer.render(this.scene, this.camera);
    } catch (e) {
      if (!this._tickErrorLogged) {
        this._tickErrorLogged = true;
        console.error('[stage] tick error (loop continues):', e);
      }
    }
    requestAnimationFrame(this.tick);
  };

  setActiveSceneName(name) {
    this.activeSceneName = name;
  }

  setCurrentActIndex(index) {
    this.currentActIndex = index;
  }
}

// Initialize
const sceneManager = new SceneManager();

// Lazy-load scenes by name; createScene fn imported from site/js/scenes/{name}.js
async function initScenes() {
  const actNames = ['origin', 'work', 'path', 'capital', 'voice', 'signal'];
  for (const name of actNames) {
    try {
      const mod = await import(`./scenes/${name}.js`);
      await sceneManager.registerScene(name, mod.createScene);
    } catch (e) {
      console.error(`[stage] Failed to load scene: ${name}`, e);
    }
  }
}

// Activate scenes based on scroll position
let currentActIndex = 0;
const acts = document.querySelectorAll('.act');
const actNames = ['origin', 'work', 'path', 'capital', 'voice', 'signal'];

const actObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const index = Array.from(acts).indexOf(entry.target);
      if (index !== currentActIndex) {
        currentActIndex = index;
        sceneManager.setCurrentActIndex(index);
        sceneManager.setActiveSceneName(actNames[index]);
        sceneManager.activateScene(actNames[index]);
      }
    }
  });
}, { threshold: 0.5 });

acts.forEach(act => actObserver.observe(act));

// Expose for scroll.js / interaction (must precede any window.sceneManager use)
window.sceneManager = sceneManager;

// Boot scenes and activate first
initScenes().then(() => {
  sceneManager.activateScene('origin');
  console.log('[stage] Scenes initialized');
});

console.log('[stage] WebGL renderer initialized, quality tier:', qualityTier);
