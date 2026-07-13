// Act IV: Capital — thread trifurcation into three investment streams
// Scene contract: createScene(ctx) → {mount, unmount, tick(progress, time), resize, setQuality}

import { makeBundle } from '../three/threads.js';
import { createPalette } from '../three/materials.js';

export function createScene(ctx) {
  const {
    THREE,
    renderer,
    scene,
    camera,
    section,
    data,
    qualityTier,
    w,
    h
  } = ctx;

  let group = null;
  let incomingBundle = null;
  let splits = []; // Three trifurcated streams
  let time = 0;

  // Stream accent colors from capital.js: angel (ua blue), markets (vn green), real estate (mixed)
  // Desaturated and nebula-glow compatible per design direction
  const streamPalettes = data.default?.streams ? data.default.streams.map(stream => {
    const color = stream.color;
    return createPalette([
      shiftBrightness(color, -0.3),
      shiftBrightness(color, 0),
      shiftBrightness(color, 0.3)
    ]);
  }) : [
    createPalette(['#5B6DB8', '#7C93E8', '#9BB0F0']), // angel blue fallback
    createPalette(['#3A8B62', '#5FBF8E', '#7FD4A4']), // markets green fallback
    createPalette(['#C86540', '#E08D66', '#F0AB88'])  // real estate orange fallback
  ];

  // Incoming bundle control points: arrival from path, converging toward center
  const incomingPath = [
    [-3, 2, -1],
    [-1.5, 1, -0.5],
    [0, 0, 0]
  ];

  // Trifurcate anchor positions: left/center/right (diverging after apex at progress 0.4)
  const trifurcateAnchors = [
    [-1.5, 0, 0.5],  // angel stream left
    [0, 0, 0],       // markets stream center
    [1.5, 0, 0.5]    // real estate stream right
  ];

  function shiftBrightness(hexColor, amount) {
    const hex = hexColor.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.slice(0, 2), 16) + amount * 50)) | 0;
    const g = Math.max(0, Math.min(255, parseInt(hex.slice(2, 4), 16) + amount * 50)) | 0;
    const b = Math.max(0, Math.min(255, parseInt(hex.slice(4, 6), 16) + amount * 50)) | 0;
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  }

  return {
    mount() {
      group = new THREE.Group();
      scene.add(group);

      // Create incoming bundle (converging from path endpoint)
      incomingBundle = makeBundle(incomingPath, streamPalettes[0], {
        filamentCount: qualityTier === 'low' ? 2 : 4,
        samplesPerFilament: qualityTier === 'full' ? 100 : 80,
        ribbonWidth: 0.4
      });

      group.add(incomingBundle.mesh);

      // Initialize trifurcated streams (will morph in from progress 0→0.4)
      splits = streamPalettes.map((palette, i) => {
        const stream = makeBundle(
          [incomingPath[incomingPath.length - 1], trifurcateAnchors[i]],
          palette,
          {
            filamentCount: qualityTier === 'low' ? 2 : 3,
            samplesPerFilament: qualityTier === 'full' ? 80 : 60,
            ribbonWidth: 0.35
          }
        );

        // Start invisible; fade in with trifurcation progress
        stream.mesh.material.transparent = true;
        stream.mesh.material.opacity = 0;

        group.add(stream.mesh);
        return stream;
      });

      // Camera setup: positioned to view three columns
      camera.position.set(0, 0.3, 2.8);
      camera.lookAt(0, 0.2, 0);

      console.log('[capital] Scene mounted, trifurcation ready');
    },

    unmount() {
      if (incomingBundle) {
        incomingBundle.dispose();
        incomingBundle = null;
      }
      splits.forEach(stream => {
        if (stream) stream.dispose();
      });
      splits = [];
      if (group) {
        scene.remove(group);
        group = null;
      }
    },

    tick(progress, currentTime) {
      if (!group || !incomingBundle) return;

      time = currentTime;

      // Phase 1: 0→0.4 trifurcation morph
      const trifurcationT = Math.max(0, Math.min(1, progress * 2.5)); // 0→0.4 progress → 0→1 morph

      if (trifurcationT < 1) {
        // Incoming bundle visible, scales back as splits fade in
        incomingBundle.mesh.material.transparent = true;
        incomingBundle.mesh.material.opacity = Math.max(0, 1 - trifurcationT * 1.5);
      } else {
        incomingBundle.mesh.material.opacity = 0;
      }

      // Splits fade in and spread apart
      splits.forEach((stream, i) => {
        stream.mesh.material.transparent = true;
        stream.mesh.material.opacity = Math.min(1, trifurcationT * 1.2);

        // Lerp streams toward their anchor positions
        const startPos = new THREE.Vector3(...incomingPath[incomingPath.length - 1]);
        const endPos = new THREE.Vector3(...trifurcateAnchors[i]);
        stream.mesh.position.lerpVectors(startPos, endPos, Math.pow(trifurcationT, 1.5));
      });

      // Phase 2: 0.4+ resident sway
      if (progress >= 0.4) {
        splits.forEach((stream, i) => {
          // Gentle oscillation: small vertical/rotational sway per filament phase
          const sway = Math.sin(time * 0.8 + i * Math.PI * 0.66) * 0.08;
          stream.mesh.position.y = trifurcateAnchors[i][1] + sway;
          stream.mesh.rotation.z = Math.sin(time * 0.5 + i * Math.PI * 0.66) * 0.05;
        });
      }

      // Update shader uniforms for all bundles
      incomingBundle.updateProgress(trifurcationT);
      splits.forEach(stream => {
        stream.updateProgress(trifurcationT);
      });
    },

    resize(newW, newH) {
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
    },

    setQuality(tier) {
      // Quality tier applied at mount; deferred for adaptive switching
    }
  };
}
