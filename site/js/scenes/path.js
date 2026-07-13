// Act III: Path — scroll-scrubbed timeline thread through era nodes
// Scene contract: createScene(ctx) → {mount, unmount, tick(progress, time), resize, setQuality}

import { makeBundle } from '../three/threads.js';
import { createPalette } from '../three/materials.js';
import { createCurve, sampleCurve, getCurveTangent } from '../three/curves.js';

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
  let bundle = null;
  let nodeMarkers = [];
  let curve = null;
  let nodeData = [];
  let cardElements = [];
  let inViewIndex = -1;

  const pathData = data?.default || [];

  return {
    mount() {
      group = new THREE.Group();
      scene.add(group);

      // Thread curve: parametric path into depth
      const controlPoints = [
        [0, 1.5, 0],     // Early career (2014–2018)
        [0.3, 0.8, 3],   // Blockchain era (2018–2020)
        [-0.2, 0, 6],    // Investing (2020–2024)
        [0, -1, 10]      // AI systems (2024–present)
      ];

      curve = createCurve(controlPoints);

      // Create gold thread bundle
      const goldPalette = createPalette(['#8B7355', '#C9A45C', '#D4AF86']);

      bundle = makeBundle(controlPoints, goldPalette, {
        filamentCount: qualityTier === 'low' ? 2 : 4,
        samplesPerFilament: qualityTier === 'full' ? 100 : 80,
        ribbonWidth: 0.2,
        qualityTier
      });

      group.add(bundle.mesh);

      // Create node markers along the thread
      nodeData = [];
      nodeMarkers = [];

      pathData.forEach((entry, i) => {
        const t = pathData.length > 1 ? i / (pathData.length - 1) : 0.5;
        const pos = sampleCurve(curve, t);

        nodeData.push({ t, pos, entry, index: i });

        // Glowing sphere marker
        const geom = new THREE.SphereGeometry(0.12, 16, 16);
        const mat = new THREE.MeshBasicMaterial({
          color: 0xC9A45C,
          emissive: 0xC9A45C,
          emissiveIntensity: 0.7,
          transparent: true,
          opacity: 0.85
        });
        const marker = new THREE.Mesh(geom, mat);
        marker.position.copy(pos);
        marker.userData.nodeIndex = i;
        group.add(marker);
        nodeMarkers.push(marker);
      });

      // Render DOM cards (initially hidden)
      renderCards(section, pathData);

      // Set initial camera position at start of curve
      const startPos = sampleCurve(curve, 0);
      camera.position.copy(startPos);
      camera.position.z += 1.5;
      camera.lookAt(0, 0, 8);

      console.log('[path] Scene mounted:', pathData.length, 'nodes');
    },

    unmount() {
      if (bundle) {
        bundle.dispose();
        bundle = null;
      }
      nodeMarkers.forEach(m => {
        if (m.geometry) m.geometry.dispose();
        if (m.material) m.material.dispose();
      });
      nodeMarkers = [];
      if (group) {
        scene.remove(group);
        group.clear();
        group = null;
      }
      cardElements.forEach(card => card.remove());
      cardElements = [];
    },

    tick(progress, time) {
      if (!group || !bundle || !curve) return;

      // Animate thread
      bundle.updateProgress(progress);

      // Camera travels along curve
      const t = Math.max(0, Math.min(1, progress));
      const camPos = sampleCurve(curve, t);
      camera.position.lerp(camPos, 0.15);
      camera.position.z += 1.5;

      // Look ahead on the curve
      const lookT = Math.min(1, t + 0.1);
      const lookPos = sampleCurve(curve, lookT);
      camera.lookAt(lookPos.x, lookPos.y, lookPos.z + 1);

      // Update node markers and card visibility
      let closestNode = -1;
      let minDist = Infinity;

      nodeData.forEach(({ t: nodeT, pos, index }) => {
        const marker = nodeMarkers[index];
        if (!marker) return;

        const dist = camera.position.distanceTo(pos);
        const bloomRange = 4;
        const bloomStrength = Math.max(0, 1 - dist / bloomRange);

        // Pulse marker as it approaches
        marker.scale.set(
          1 + bloomStrength * 0.6,
          1 + bloomStrength * 0.6,
          1 + bloomStrength * 0.6
        );
        marker.material.emissiveIntensity = 0.5 + bloomStrength * 0.9;

        // Track closest node
        if (dist < minDist) {
          minDist = dist;
          closestNode = index;
        }

        // Update card visibility based on bloom strength
        const card = cardElements[index];
        if (card) {
          const targetOpacity = bloomStrength > 0.25 ? 1 : 0;
          card.style.opacity = targetOpacity;

          if (bloomStrength > 0.25 && inViewIndex !== index) {
            card.classList.add('in-view');
            inViewIndex = index;
          } else if (bloomStrength <= 0.25 && inViewIndex === index) {
            card.classList.remove('in-view');
            inViewIndex = -1;
          }
        }
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
}

function renderCards(section, pathData) {
  const container = section.querySelector('.act-content');
  if (!container) return;

  // Clear any existing cards (safety)
  container.querySelectorAll('.path-card').forEach(c => c.remove());

  pathData.forEach((entry, index) => {
    const card = document.createElement('div');
    card.className = 'path-card';
    card.setAttribute('data-index', index);

    card.innerHTML = `
      <div class="path-card-head">
        <div class="path-era">${entry.era}</div>
        <div class="path-role">${entry.role}</div>
      </div>
      <div class="path-card-body">
        ${entry.org ? `<div class="path-org">${entry.org}</div>` : ''}
        <div class="path-industry">${entry.industry}</div>
        <p class="path-line">${entry.line}</p>
      </div>
    `;

    card.style.position = 'absolute';
    card.style.opacity = '0';
    card.style.transition = 'opacity 0.3s ease';
    card.style.pointerEvents = 'none';
    card.style.whiteSpace = 'nowrap';
    card.style.fontSize = '13px';
    card.style.lineHeight = '1.4';
    card.style.color = 'var(--pearl)';
    card.style.maxWidth = '200px';

    container.appendChild(card);
  });

  return Array.from(container.querySelectorAll('.path-card'));
}
