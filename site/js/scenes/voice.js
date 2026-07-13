// Act V: Voice — thin horizon thread behind editorial rows
// Free scroll (not pinned); gentle drift + parallax for ambiance

import { makeBundle } from '../three/threads.js';
import { createPalette } from '../three/materials.js';

export function createScene(ctx) {
  const { THREE, scene, camera, qualityTier } = ctx;
  let group = null;
  let bundle = null;

  return {
    mount() {
      group = new THREE.Group();
      scene.add(group);

      // Thin horizontal horizon thread: shallow curve along the x-axis
      const palette = createPalette(['#A89F6E', '#B8B89F']);
      const controlPoints = [
        [-3, 0, 0],
        [-1.5, 0.1, 0],
        [0, 0, 0],
        [1.5, -0.05, 0],
        [3, 0, 0]
      ];

      bundle = makeBundle(controlPoints, palette, {
        filamentCount: qualityTier === 'low' ? 2 : 3,
        samplesPerFilament: qualityTier === 'full' ? 80 : 60,
        ribbonWidth: 0.15
      });

      group.add(bundle.mesh);

      // Position horizon far back, slightly above center
      group.position.z = -8;
      group.position.y = 0.5;

      console.log('[voice] Scene mounted');
    },

    unmount() {
      if (bundle) {
        bundle.dispose();
        bundle = null;
      }
      if (group) {
        scene.remove(group);
        group = null;
      }
    },

    tick(progress, time) {
      if (!group || !bundle) return;

      // Gentle horizontal drift: the thread oscillates left/right slowly
      group.position.x = Math.sin(time * 0.3) * 0.3;

      // Subtle parallax: shifts away as you scroll down (depth perception)
      // progress ∈ [0..1]; at progress=0 thread is closer, at progress=1 it drifts back
      group.position.z = -8 - progress * 1;

      // Gentle rotation for visual interest
      group.rotation.z = Math.sin(time * 0.2) * 0.02;

      // Update shader time/phase
      bundle.updateProgress(time * 0.1);
    },

    resize(w, h) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    },

    setQuality(tier) {}
  };
}
