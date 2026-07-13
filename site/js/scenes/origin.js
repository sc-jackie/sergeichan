// Act I: Origin — dual-heritage braid (UA + VN flags) + about reveal
// Scene contract: createScene(ctx) → {mount, unmount, tick(progress, time), resize, setQuality}

import { createRestingBraid } from '../three/threads.js';
import { createPalette } from '../three/materials.js';

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

  let group = null;
  let braid = null;
  let time = 0;

  // Flag palettes: UA (blue/yellow desaturated) + VN (red/yellow desaturated)
  const paletteUA = createPalette(['#004A99', '#8B9DC3', '#B8C5D6']); // blues desaturated
  const paletteVN = createPalette(['#A01A15', '#C9666F', '#D9999F']); // reds desaturated

  return {
    mount() {
      group = new THREE.Group();
      scene.add(group);

      // Create resting braid with flag palettes
      braid = createRestingBraid(paletteUA, paletteVN, {
        filamentCountA: qualityTier === 'low' ? 2 : 4,
        filamentCountB: qualityTier === 'low' ? 2 : 4,
        samplesPerFilament: qualityTier === 'full' ? 100 : 80,
        ribbonWidth: 0.4
      });

      group.add(braid.group);

      // Position camera for viewing
      camera.position.set(0, 0.5, 3);
      camera.lookAt(0, 0, 0);

      console.log('[origin] Scene mounted, braid created');
    },

    unmount() {
      if (braid) {
        braid.dispose();
        braid = null;
      }
      if (group) {
        scene.remove(group);
        group = null;
      }
    },

    tick(progress, currentTime) {
      if (!group) return;

      time = currentTime;

      // Update shader uniforms for all bundles
      braid.bundles.forEach(bundle => {
        bundle.updateProgress(progress);
      });

      // Gentle rotation for visual interest
      group.rotation.z = Math.sin(time * 0.3) * 0.1;
    },

    resize(newW, newH) {
      // Adjust camera aspect if needed
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
    },

    setQuality(tier) {
      // Quality tier already applied at mount; deferred for adaptive switching
      // Would regenerate geometry with different filament counts
    }
  };
}
