// Act VI: Signal — contact finale with rotating knot glyph + dust particles
// tick(progress) reveals the knot as the act enters

import { makeBundle } from '../three/threads.js';
import { createPalette } from '../three/materials.js';

// Helper: create a torus knot curve (p=2, q=3 = trefoil knot in torus coordinates)
function torusKnotCurve(t, p = 2, q = 3, radius = 1) {
  const angle = t * Math.PI * 2;
  const r = Math.cos(q * angle) + 2;
  return {
    x: r * Math.cos(p * angle) * radius,
    y: Math.sin(q * angle) * radius,
    z: r * Math.sin(p * angle) * radius
  };
}

export function createScene(ctx) {
  const { THREE, scene, camera, qualityTier } = ctx;
  let group = null;
  let knot = null;
  let particles = [];
  let knotMaterial = null;

  return {
    mount() {
      group = new THREE.Group();
      scene.add(group);

      // Knot glyph: thread bundle wound into a torus knot curve
      const palette = createPalette(['#D4A574', '#E8C4A0']);
      const knotPoints = [];
      for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        const pt = torusKnotCurve(t, 2, 3, 0.8);
        knotPoints.push([pt.x, pt.y, pt.z]);
      }

      knot = makeBundle(knotPoints, palette, {
        filamentCount: qualityTier === 'low' ? 1 : 2,
        samplesPerFilament: qualityTier === 'full' ? 60 : 40,
        ribbonWidth: 0.12
      });

      group.add(knot.mesh);
      knotMaterial = knot.material;

      // Dust particles: a few small spheres drifting around the knot
      const particleGeom = new THREE.SphereGeometry(0.05, 8, 8);
      const particleMat = new THREE.MeshBasicMaterial({
        color: 0xAA9D7F,
        transparent: true,
        opacity: 0.6
      });

      const particleCount = qualityTier === 'low' ? 3 : 5;
      for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(particleGeom.clone(), particleMat.clone());
        // Random positions around the knot
        particle.position.set(
          Math.random() * 1.5 - 0.75,
          Math.random() * 1.5 - 0.75,
          Math.random() * 1.5 - 0.75
        );
        particle.userData.phase = Math.random() * Math.PI * 2;
        particle.userData.speed = 0.3 + Math.random() * 0.5;
        group.add(particle);
        particles.push(particle);
      }

      // Position knot slightly above center, in front
      group.position.z = -2;
      group.position.y = 0.3;

      console.log('[signal] Scene mounted');
    },

    unmount() {
      if (knot) {
        knot.dispose();
        knot = null;
      }
      particles.forEach(p => {
        if (p.geometry) p.geometry.dispose();
        if (p.material) p.material.dispose();
        group.remove(p);
      });
      particles = [];
      if (group) {
        scene.remove(group);
        group = null;
      }
    },

    tick(progress, time) {
      if (!group || !knot) return;

      // Reveal knot as progress enters (0 → 1)
      // At progress=0: invisible/small; at progress=1: fully visible
      const revealAlpha = Math.min(1, Math.max(0, progress * 2)); // double the rate for snappier reveal
      const revealScale = 0.5 + revealAlpha * 0.5; // scale from 0.5 to 1.0

      group.scale.set(revealScale, revealScale, revealScale);

      // Update knot material opacity
      if (knotMaterial) {
        knotMaterial.opacity = Math.max(0.3, revealAlpha * 0.8);
      }

      // Slow rotation: knot spins around y-axis
      group.rotation.y = time * 0.2;
      group.rotation.x = Math.sin(time * 0.15) * 0.1;

      // Dust particles drift and orbit around the knot
      particles.forEach((p, i) => {
        const phase = p.userData.phase + time * p.userData.speed;
        const radius = 1 + Math.sin(time * 0.5 + i) * 0.3;
        p.position.x = Math.cos(phase) * radius;
        p.position.y = Math.sin(phase * 0.7) * radius * 0.5;
        p.position.z = Math.sin(phase) * radius * 0.5;

        // Fade particles in with knot
        if (p.material) {
          p.material.opacity = 0.3 + revealAlpha * 0.3;
        }
      });

      // Update shader time
      knot.updateProgress(time * 0.05);
    },

    resize(w, h) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    },

    setQuality(tier) {}
  };
}
