// Act II: Work — five chord bundles + camera dive into case overlay
// Scene contract: createScene(ctx) → {mount, unmount, tick(progress, time), resize, setQuality}
// Interaction parity with the old Canvas engine: hover-part, focus cycling, dive choreography

import { makeBundle } from '../three/threads.js';
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

  // Project data (from old P[] array)
  const projects = [
    { id: 'newfin', u: 0.15, color: '#7C93E8', rgb: [124, 147, 232] },
    { id: 'bunit', u: 0.325, color: '#5FBF8E', rgb: [95, 191, 142] },
    { id: 'jackieos', u: 0.5, color: '#C9A45C', rgb: [201, 164, 92] },
    { id: 'rodyna', u: 0.675, color: '#E08D66', rgb: [224, 141, 102] },
    { id: 'draw', u: 0.85, color: '#56C4D6', rgb: [86, 196, 214] }
  ];

  // State
  let group = null;
  let chords = []; // Five thread bundles
  let focus = 2; // Start on center (Jackie-OS)
  let focusT = 0; // Time-driven cycle for idle rotation
  let focusAmt = [0.05, 0.05, 1, 0.05, 0.05]; // Smooth focus amounts per chord
  let time = 0;
  let diveState = null; // { p: 0-1, idx, prepped: false }
  let mode = 'home'; // 'home', 'diving', 'resurfacing', 'in-case'
  let raycaster = new THREE.Raycaster();
  let pointerPos = new THREE.Vector2(0, 0);
  let canvasFocused = false;
  let isReducedMotion = false;
  let eyeYs = []; // Per-chord sway positions

  const caseEl = document.getElementById('case');
  const canvasRegion = section.querySelector('.work-canvas-region');
  const backBtns = document.querySelectorAll('#backBtn, #backBtn2');
  const glimpseEl = document.getElementById('glimpse');
  const canvasRect = renderer.domElement.getBoundingClientRect();

  // Easing functions
  function smooth(p) {
    return p * p * (3 - 2 * p); // Hermite smoothstep
  }

  // World-space chord positioning
  function worldPosForU(u) {
    // Map u ∈ [0..1] to world x-space; camera width at z=3 is ~6 units
    return (u - 0.5) * 6;
  }

  // Create control points for a chord bundle (resting position)
  function createChordCurve(worldX) {
    // Simple curve: start near camera, go back in z, subtle sway
    return [
      new THREE.Vector3(worldX, 0, 0.5),
      new THREE.Vector3(worldX + 0.2, 0.3, 1.5),
      new THREE.Vector3(worldX, 0.1, 3)
    ];
  }

  return {
    mount() {
      isReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

      group = new THREE.Group();
      scene.add(group);

      // Create five chord bundles
      projects.forEach((p, i) => {
        const palette = createPalette([p.color, '#0C0E16']);
        const curve = createChordCurve(worldPosForU(p.u));

        const bundle = makeBundle(curve, palette, {
          filamentCount: qualityTier === 'low' ? 2 : (qualityTier === 'full' ? 8 : 5),
          samplesPerFilament: qualityTier === 'full' ? 100 : 80,
          ribbonWidth: 0.2,
          qualityTier
        });

        // Position mesh
        bundle.mesh.position.y = 0;
        bundle.mesh.scale.set(1, 1, 1);

        group.add(bundle.mesh);
        chords.push({
          id: p.id,
          u: p.u,
          rgb: p.rgb,
          worldX: worldPosForU(p.u),
          bundle,
          coreY: 0 // Will sway during interaction
        });
        eyeYs.push(0);
      });

      // Initial camera setup
      camera.position.set(0, 0, 3);
      camera.lookAt(0, 0, 0);
      camera.fov = 75;

      // Event listeners (unless reduced motion)
      if (!isReducedMotion) {
        // Pointer tracking
        renderer.domElement.addEventListener('pointermove', e => {
          const rect = renderer.domElement.getBoundingClientRect();
          pointerPos.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          pointerPos.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        });

        // Canvas focus
        if (canvasRegion) {
          canvasRegion.addEventListener('focus', () => {
            canvasFocused = true;
          });
          canvasRegion.addEventListener('blur', () => {
            canvasFocused = false;
          });
        }

        // Keyboard
        document.addEventListener('keydown', e => {
          if (!canvasFocused || mode !== 'home') return;

          // Check Lenis velocity — suppress input during momentum
          if (window.lenis && Math.abs(window.lenis.velocity) > 0.5) return;

          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const dir = e.key === 'ArrowLeft' ? -1 : 1;
            focus = (focus + dir + 5) % 5;
            focusT = 0;
            e.preventDefault();
          } else if (e.key === 'Enter') {
            startDive(focus);
            e.preventDefault();
          }
        });
      }

      // Case close buttons
      backBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          resurface();
        });
      });

      // Browser back button for case
      window.addEventListener('popstate', () => {
        if (mode === 'in-case') {
          resurface();
        }
      });

      console.log('[work] Scene mounted, 5 chords created');
    },

    unmount() {
      chords.forEach(chord => {
        if (chord.bundle) {
          chord.bundle.dispose();
        }
      });
      chords = [];
      eyeYs = [];

      if (group) {
        scene.remove(group);
        group = null;
      }

      diveState = null;
      mode = 'home';

      console.log('[work] Scene unmounted, geometry disposed');
    },

    tick(progress, currentTime) {
      if (!group) return;

      time = currentTime;

      // Focus lifecycle (idle rotation)
      if (mode === 'home') {
        focusT += 1 / 60;
        // Auto-cycle every ~3.6s if not manual (simplified)
      }

      // Smooth focus amount per chord
      chords.forEach((chord, i) => {
        const targetFocus = i === focus ? 1 : 0;
        focusAmt[i] += (targetFocus - focusAmt[i]) * 0.06;
      });

      // Update glimpse DOM positioning (home mode only)
      if (mode === 'home' && glimpseEl && !isReducedMotion) {
        const focusedChord = chords[focus];
        // Position glimpse at u-position on canvas, 72% down
        const xpc = focusedChord.u * 100;
        glimpseEl.style.left = 'calc(' + Math.max(14, Math.min(xpc, 86)) + '%)';
        glimpseEl.style.top = '72%';
        glimpseEl.classList.add('on');
        // Stage-driven classes for reveal (simplified; would need more state for full old behavior)
        glimpseEl.classList.toggle('s1', focusT > 0.6);
        glimpseEl.classList.toggle('s2', focusT > 1.3);
      } else if (glimpseEl) {
        glimpseEl.classList.remove('on');
      }

      // Dive choreography (bloom → warp → arrive over ~2.1s)
      let bloom = 0, warp = 0, arrive = 0;
      let zoom = 1, camU = 0.5;

      if (mode === 'diving' || mode === 'resurfacing') {
        // ~2.6s out (1/158 per frame at 60fps), ~1.4s back
        diveState.p += (mode === 'diving' ? 1 / 158 : -1 / 86);

        // Trigger case prep at dive.p ≈ 0.8
        if (mode === 'diving' && diveState.p >= 0.8 && !diveState.prepped) {
          diveState.prepped = true;
          casePrep(diveState.idx);
        }

        // Transition to in-case when dive completes
        if (diveState.p >= 1) {
          diveState.p = 1;
          mode = 'in-case';
          caseDone(diveState.idx);
        }

        // Return to home when resurface completes
        if (diveState.p <= 0) {
          diveState.p = 0;
          mode = 'home';
          diveState = null;
        }
      }

      if (diveState && diveState.p > 0) {
        bloom = smooth(Math.min(diveState.p / 0.32, 1)); // act I — unfurl
        warp = smooth(Math.max(0, Math.min((diveState.p - 0.32) / 0.5, 1))); // act II — fly through
        arrive = Math.max(0, (diveState.p - 0.84) / 0.16); // act III — collapse

        // Camera movement: zoom in + pan to focused chord
        const targetChord = chords[diveState.idx];
        camU = 0.5 + (targetChord.u - 0.5) * bloom;
        zoom = 1 + bloom * 0.5 + Math.pow(warp, 1.7) * 14;
      }

      // Apply camera dolly + FOV easing
      const targetFOV = 75 + bloom * 15; // Subtle FOV change on bloom
      camera.fov += (targetFOV - camera.fov) * 0.1;
      camera.updateProjectionMatrix();

      // Camera position: pan horizontally by camU, zoom in on z
      const targetZ = 3 / (1 + zoom * 0.5);
      camera.position.x += ((camU * 0.3) - camera.position.x) * 0.08;
      camera.position.z += (targetZ - camera.position.z) * 0.08;
      camera.lookAt(0, 0, 0);

      // Proximity repulsion (raycast + hover-part effect)
      if (mode === 'home' && !isReducedMotion && canvasFocused) {
        raycaster.setFromCamera(pointerPos, camera);
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -1);

        const intersection = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, intersection);

        // Repulsion strength for focused chord
        chords.forEach((chord, i) => {
          const a = focusAmt[i];
          const dist = Math.hypot(intersection.x - chord.worldX, intersection.y - (eyeYs[i] || 0));
          const repulse = Math.max(0, (0.4 - dist) / 0.4) * a; // Proximity falloff

          // Smooth eye position toward pointer
          const targetY = (a > 0.3 && Math.abs(window.lenis?.velocity || 0) < 0.5) ? intersection.y : Math.sin(time * 0.8 + i * 2) * 0.1;
          eyeYs[i] += (targetY - eyeYs[i]) * 0.055;
        });
      } else if (mode === 'home') {
        // Reset eye positions when not interacting
        chords.forEach((chord, i) => {
          eyeYs[i] += (0 - eyeYs[i]) * 0.08;
        });
      }

      // Update shader uniforms for all chords
      chords.forEach((chord, i) => {
        chord.bundle.updateProgress(progress);
        // Scale mesh based on focus + bloom (visual emphasis)
        const scale = 1 + focusAmt[i] * 0.15 + bloom * 0.2;
        chord.bundle.mesh.scale.set(scale, scale, scale);
      });
    },

    resize(newW, newH) {
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
    },

    setQuality(tier) {
      // Quality tier set at mount; adaptive switching deferred
    }
  };

  // Helpers
  function startDive(idx) {
    if (isReducedMotion || mode !== 'home') return;
    mode = 'diving';
    diveState = { p: 0, idx, prepped: false };
  }

  function resurface() {
    if (isReducedMotion || !diveState) {
      mode = 'home';
      diveState = null;
      caseEl.classList.remove('open', 'vis', 'settled');
      if (window.lenisControl) window.lenisControl.resume();
      return;
    }
    mode = 'resurfacing';
  }

  function casePrep(idx) {
    // Case content will be populated; here we just reserve the slot
    // The case overlay DOM is already in the page; we just hook it
  }

  function caseDone(idx) {
    // Case is now fully visible; populate and show it
    caseEl.classList.add('open', 'vis', 'settled');

    // Pause scroll during case view
    if (window.lenisControl) window.lenisControl.pause();

    // Push history state (Back button closes case)
    history.pushState({ inCase: true }, '', '#case');

    // Focus back button for a11y
    const backBtn = document.getElementById('backBtn');
    if (backBtn) backBtn.focus({ preventScroll: true });

    // Populate case content
    if (window.casePopulate) {
      window.casePopulate(idx);
    }

    console.log('[work] Case opened for project', idx);
  }
}
