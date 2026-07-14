// Act I: Origin — dual-heritage braid (UA + VN flags) + about reveal + split handoff
// Choreography: load-time convergence (~2.4s) → resident breathing → scroll-scrubbed split exit

import {
  makeBundle,
  splitToAnchors
} from '../three/threads.js';
import { createPalette } from '../three/materials.js';

const INTRO_DURATION = 2.4; // seconds
const FIVE_CHORD_ANCHORS = [
  [0.15 * 2 - 1, 0, -3],  // newfin: u=0.15 → x=-0.7
  [0.325 * 2 - 1, 0, -3], // bunit: u=0.325 → x=-0.35
  [0.5 * 2 - 1, 0, -3],   // jackieos: u=0.5 → x=0
  [0.675 * 2 - 1, 0, -3], // rodyna: u=0.675 → x=0.35
  [0.85 * 2 - 1, 0, -3]   // draw: u=0.85 → x=0.7
];

export function createScene(ctx) {
  const {
    THREE,
    renderer,
    scene,
    camera,
    section,
    qualityTier,
    w,
    h
  } = ctx;

  // State
  let group = null;
  let bundleUA = null;
  let bundleVN = null;
  let splitMeshes = null;
  let timeAtMount = null; // ponytail: store mount time once; use for elapsed = time - timeAtMount
  let intro = {
    state: 'loading', // loading → converging → merged → resident → splitting
    progress: 0, // [0..1]
    scrollOverride: false
  };
  let pointerY = 0.5;

  const onMouseMove = (e) => {
    pointerY = e.clientY / window.innerHeight;
  };

  // Flag palettes: UA (blue desaturated) + VN (red desaturated)
  const paletteUA = createPalette(['#004A99', '#5B7EBB', '#8B9DC3']);
  const paletteVN = createPalette(['#A01A15', '#C9666F', '#E0999F']);

  // Intro animation curve: smooth ease in/out for convergence
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // Bloom/glow pulse on merge
  function createBloomPulse(mesh, intensity = 0.8) {
    const material = mesh.material;
    if (material.uniforms && material.uniforms.glow) {
      const startTime = performance.now();
      const pulseDuration = 1.2; // seconds

      const pulse = () => {
        const elapsed = (performance.now() - startTime) / 1000;
        if (elapsed > pulseDuration) return;

        const pulseT = elapsed / pulseDuration;
        const pulseIntensity = Math.sin(pulseT * Math.PI) * intensity;
        material.uniforms.glow.value = pulseIntensity;

        requestAnimationFrame(pulse);
      };
      pulse();
    }
  }

  // Reveal the about copy via CSS class + font loading gate
  async function revealCopy() {
    // Wait for fonts to be ready (per R17)
    if (document.fonts) {
      try {
        await document.fonts.ready;
      } catch (e) {
        console.warn('[origin] Font loading promise rejected, proceeding anyway', e);
      }
    }

    // Add revealed class to trigger CSS animations
    section.classList.add('revealed');
    console.log('[origin] About copy revealed');
  }

  return {
    mount() {
      console.log('[origin] Mounting scene');

      group = new THREE.Group();
      scene.add(group);

      // Create two bundles with gentle upward curves
      const controlPointsUA = [
        [-3, -2, 0],
        [-2, -1, 0],
        [-0.5, 0.5, 0],
        [0.5, 0.3, 0]
      ];

      const controlPointsVN = [
        [0.5, -2, 0],
        [2, -1, 0],
        [2.5, 0.5, 0],
        [3, 0.3, 0]
      ];

      bundleUA = makeBundle(controlPointsUA, paletteUA, {
        filamentCount: qualityTier === 'low' ? 2 : 7,
        samplesPerFilament: qualityTier === 'full' ? 100 : 80,
        ribbonWidth: 0.5,
        qualityTier
      });

      bundleVN = makeBundle(controlPointsVN, paletteVN, {
        filamentCount: qualityTier === 'low' ? 2 : 7,
        samplesPerFilament: qualityTier === 'full' ? 100 : 80,
        ribbonWidth: 0.5,
        qualityTier
      });

      group.add(bundleUA.mesh);
      group.add(bundleVN.mesh);

      // Initial camera position: far out, looking at center
      camera.position.set(0, 0.3, 8);
      camera.lookAt(0, 0.2, 0);

      timeAtMount = null; // Will be set on first tick
      intro.state = 'loading';
      intro.progress = 0;

      // Track pointer for parallax
      document.addEventListener('mousemove', onMouseMove);

      console.log('[origin] Scene mounted, intro animation starting');
    },

    unmount() {
      document.removeEventListener('mousemove', onMouseMove);

      if (group) {
        scene.remove(group);
        group = null;
      }
      if (bundleUA) {
        bundleUA.dispose();
        bundleUA = null;
      }
      if (bundleVN) {
        bundleVN.dispose();
        bundleVN = null;
      }
      if (splitMeshes) {
        splitMeshes.forEach(m => m.geometry?.dispose());
        splitMeshes = null;
      }
      section.classList.remove('revealed');
      console.log('[origin] Scene unmounted');
    },

    tick(scrollProgress, currentTime) {
      if (!group) return;

      // Set mount time on first tick
      if (timeAtMount === null) {
        timeAtMount = currentTime;
      }

      const elapsed = currentTime - timeAtMount; // Elapsed time since mount

      // ============ INTRO PHASE (time-driven, ~2.4s) ============
      if (intro.state === 'loading') {
        intro.progress = Math.min(elapsed / INTRO_DURATION, 1);

        // Scroll override: if scrollProgress > 0, we're being scrubbed, fast-forward intro
        if (scrollProgress > 0 && !intro.scrollOverride) {
          intro.scrollOverride = true;
          intro.progress = scrollProgress; // Jump to scroll position
        }

        // Ease the convergence
        const eased = easeInOutCubic(intro.progress);

        // Animate bundles converging: UA enters from upper-left, VN from lower-right
        // Start offscreen, move to center
        bundleUA.mesh.position.x = -3 + eased * 1.5; // moves toward center
        bundleUA.mesh.position.y = 0.5 + eased * 0.3;
        bundleUA.mesh.position.z = -2 + eased * 1;

        bundleVN.mesh.position.x = 3 - eased * 1.5;
        bundleVN.mesh.position.y = -0.5 + eased * 0.3;
        bundleVN.mesh.position.z = -2 + eased * 1;

        // Camera drifts in slowly
        camera.position.z = 8 - eased * 3; // zoom from 8 to 5
        camera.position.y = 0.3 + eased * 0.2;

        // Update shader progress for filament sway
        bundleUA.updateProgress(eased);
        bundleVN.updateProgress(eased);

        // On merge (progress === 1), transition to merged state
        if (eased >= 1) {
          intro.state = 'merged';
          revealCopy();
          // Optional: trigger bloom pulse
          createBloomPulse(bundleUA.mesh, 0.6);
        }
      }

      // ============ RESIDENT PHASE (breathing + parallax) ============
      else if (intro.state === 'merged' || intro.state === 'resident') {
        intro.state = 'resident';

        // Position bundles at rest (converged center)
        bundleUA.mesh.position.set(-0.6, 0.2, 1);
        bundleVN.mesh.position.set(0.6, 0.2, 1);

        // Gentle breathing: amplitude modulation along y via filament phase
        const breath = Math.sin(elapsed * 0.7) * 0.15;
        bundleUA.mesh.position.y += breath * 0.1;
        bundleVN.mesh.position.y += breath * 0.1;

        // Update shader for continuous motion
        bundleUA.updateProgress(0.5);
        bundleVN.updateProgress(0.5);

        // Subtle pointer parallax on camera
        const parallaxStrength = 0.3;
        camera.position.x = (pointerY - 0.5) * parallaxStrength;

        // ponytail: update camera look direction to track bundles as camera moves
        camera.lookAt(0, 0.2, 1);
      }

      // ============ SPLIT PHASE (scroll-driven exit) ============
      // ponytail: require scrollProgress > 0.5 to avoid false-triggering from scroll trigger initialization; only split when user scrolls past midpoint of section
      if (scrollProgress > 0.5 && intro.state === 'resident') {
        intro.state = 'splitting';
        intro.progress = scrollProgress;
      }

      if (intro.state === 'splitting') {
        const splitT = Math.max(scrollProgress, intro.progress);

        // Remove the two bundles, add split meshes
        if (!splitMeshes && splitT > 0.01) {
          group.remove(bundleUA.mesh);
          group.remove(bundleVN.mesh);

          // Create a temporary merged bundle for splitting
          const mergedControlPoints = [
            [-0.2, 0.2, 1],
            [0, 0, 0],
            [0.2, -0.2, -1]
          ];
          const merged = makeBundle(mergedControlPoints, paletteUA, {
            filamentCount: 5,
            qualityTier
          });

          // Split into five anchors
          splitMeshes = splitToAnchors(merged, FIVE_CHORD_ANCHORS, splitT);
          splitMeshes.forEach(m => group.add(m));
          merged.dispose();
        }

        if (splitMeshes) {
          // Update split meshes' positions toward anchors based on progress
          splitMeshes.forEach((mesh, i) => {
            const anchor = FIVE_CHORD_ANCHORS[i];
            mesh.position.lerp(new THREE.Vector3(...anchor), splitT);
            mesh.scale.lerp(new THREE.Vector3(1, 1, 0.3), splitT);
          });
        }

        // Camera pullback and recede
        camera.position.z = 5 - splitT * 2; // Pull back from 5 to 3
        camera.position.y = 0.5 - splitT * 0.3;

        // Optional: fade out old bundles if still visible
        if (bundleUA.mesh.material.uniforms?.opacity) {
          bundleUA.mesh.material.uniforms.opacity.value = Math.max(0, 1 - splitT);
          bundleVN.mesh.material.uniforms.opacity.value = Math.max(0, 1 - splitT);
        }
      }

      // Always update shader time for continuous motion
      if (bundleUA) bundleUA.updateProgress(Math.sin(elapsed * 0.3) * 0.3 + 0.5);
      if (bundleVN) bundleVN.updateProgress(Math.sin(elapsed * 0.3) * 0.3 + 0.5);

      // Update split meshes' material time uniforms (ponytail: direct uniform update since split meshes are raw THREE.Mesh objects)
      if (splitMeshes && splitMeshes.length > 0) {
        splitMeshes.forEach(mesh => {
          if (mesh.material?.uniforms?.time) {
            mesh.material.uniforms.time.value = performance.now() / 1000;
          }
        });
      }
    },

    resize(newW, newH) {
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
    },

    setQuality(tier) {
      // Quality tier applied at mount; adaptive switching deferred
    }
  };
}
