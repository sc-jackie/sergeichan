// WebGL Renderer + Scene Manager + Quality Tiers

import * as THREE from 'three';

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
    this.renderer.setClearColor(0x0C0E16, 0);

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
  }

  registerScene(name, SceneClass) {
    this.scenes.set(name, new SceneClass());
  }

  activateScene(name) {
    if (this.activeScene) {
      this.activeScene.unmount();
    }
    this.activeScene = this.scenes.get(name);
    if (this.activeScene) {
      this.activeScene.mount();
    }
  }

  tick = () => {
    this.time += 1 / 60;

    if (this.activeScene) {
      this.activeScene.tick(this.time);
    }

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.tick);
  };
}

// Stub Scene Base Class
class Scene {
  constructor() {
    this.group = new THREE.Group();
  }

  mount() {
    // Override
  }

  unmount() {
    // Override
  }

  tick(time) {
    // Override
  }
}

// Stub scene implementations
class OriginScene extends Scene {
  mount() {
    // Placeholder: small colored threads drifting
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array([
      -2, 0, 0,
       2, 0, 0
    ]);
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.LineBasicMaterial({ color: 0xC9A45C });
    const line = new THREE.Line(geom, mat);
    this.group.add(line);
  }

  tick(time) {
    this.group.rotation.x = Math.sin(time * 0.3) * 0.1;
  }

  unmount() {
    this.group.clear();
  }
}

class WorkScene extends Scene {
  mount() {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array([
      -3, 0, 0,
       3, 0, 0
    ]);
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.LineBasicMaterial({ color: 0x7C93E8 });
    const line = new THREE.Line(geom, mat);
    this.group.add(line);
  }

  tick(time) {
    this.group.rotation.y = time * 0.2;
  }

  unmount() {
    this.group.clear();
  }
}

class PathScene extends Scene {
  mount() {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array([
      0, 0, 0,
      0, 0, 5
    ]);
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.LineBasicMaterial({ color: 0xC9A45C });
    const line = new THREE.Line(geom, mat);
    this.group.add(line);
  }

  unmount() {
    this.group.clear();
  }
}

class CapitalScene extends Scene {
  mount() {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array([
      -1, 0, 0,
       0, 1, 0,
       1, 0, 0
    ]);
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.LineBasicMaterial({ color: 0xE08D66 });
    const line = new THREE.LineSegments(geom, mat);
    this.group.add(line);
  }

  unmount() {
    this.group.clear();
  }
}

class VoiceScene extends Scene {
  mount() {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array([
      -2, 0, 0,
       2, 0, 0
    ]);
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.LineBasicMaterial({ color: 0x56C4D6 });
    const line = new THREE.Line(geom, mat);
    this.group.add(line);
  }

  unmount() {
    this.group.clear();
  }
}

class SignalScene extends Scene {
  mount() {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array([
      -1, -1, 0,
       1, -1, 0,
       1,  1, 0,
      -1,  1, 0,
      -1, -1, 0
    ]);
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.LineBasicMaterial({ color: 0x5FBF8E });
    const line = new THREE.Line(geom, mat);
    this.group.add(line);
  }

  tick(time) {
    this.group.rotation.z = time * 0.1;
  }

  unmount() {
    this.group.clear();
  }
}

// Initialize
const sceneManager = new SceneManager();
sceneManager.registerScene('origin', OriginScene);
sceneManager.registerScene('work', WorkScene);
sceneManager.registerScene('path', PathScene);
sceneManager.registerScene('capital', CapitalScene);
sceneManager.registerScene('voice', VoiceScene);
sceneManager.registerScene('signal', SignalScene);

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
        sceneManager.activateScene(actNames[index]);
      }
    }
  });
}, { threshold: 0.5 });

acts.forEach(act => actObserver.observe(act));

// Activate first scene
sceneManager.activateScene('origin');

console.log('[stage] WebGL renderer initialized, quality tier:', qualityTier);

// Expose for interaction
window.sceneManager = sceneManager;
