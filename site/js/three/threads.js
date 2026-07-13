// Silk-thread system: ribbon bundles with morphing utilities
// Core asset for all six acts

import * as THREE from 'three';
import { createCurve, sampleCurve, getCurveTangent } from './curves.js';
import { createThreadMaterial, samplePalette } from './materials.js';

/**
 * makeBundle(controlPoints, palette, opts) → bundle object
 *
 * Creates a bundle of silk-ribbon filaments around a curve.
 *
 * @param {Array} controlPoints - 3D points defining the bundle curve
 * @param {Array} palette - color palette (hex strings or THREE.Color instances)
 * @param {Object} opts
 *   - filamentCount: number of ribbons per bundle (default: 5)
 *   - samplesPerFilament: curve resolution (default: 80)
 *   - ribbonWidth: ribbon expansion perpendicular to curve (default: 0.3)
 *   - qualityTier: 'full' | 'medium' | 'low'
 *
 * @returns {Object} bundle with {mesh, material, uniforms, dispose(), updateProgress(t)}
 */
export function makeBundle(controlPoints, palette, opts = {}) {
  const {
    filamentCount = 5,
    samplesPerFilament = 80,
    ribbonWidth = 0.3,
    qualityTier = 'medium'
  } = opts;

  const curve = createCurve(controlPoints);
  const material = createThreadMaterial({ qualityTier });

  // Build geometry: one merged geometry for all filaments in this bundle
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const normals = [];
  const indices = [];
  const filamentAttr = [];
  const paramTAttr = [];
  const ribbonTAttr = [];

  let vertexCount = 0;

  for (let f = 0; f < filamentCount; f++) {
    const filamentPhase = f / filamentCount;

    for (let i = 0; i <= samplesPerFilament; i++) {
      const t = i / samplesPerFilament;
      const pt = sampleCurve(curve, t);
      const tangent = getCurveTangent(curve, t);

      // Perpendicular directions for ribbon
      let normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
      if (normal.length() < 0.1) {
        normal.set(1, 0, 0); // fallback if tangent is vertical
      }
      const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();

      // Create ribbon strip: two vertices per sample (left/right of curve)
      for (let r = -1; r <= 1; r += 2) {
        const offset = ribbonWidth * r * 0.5;
        const pos = pt.clone()
          .addScaledVector(normal, offset * Math.cos(filamentPhase * Math.PI * 2))
          .addScaledVector(binormal, offset * Math.sin(filamentPhase * Math.PI * 2));

        positions.push(pos.x, pos.y, pos.z);
        normals.push(normal.x, normal.y, normal.z);
        filamentAttr.push(f);
        paramTAttr.push(t);
        ribbonTAttr.push(r > 0 ? 1 : -1);

        vertexCount++;
      }
    }

    // Indices: triangles connecting the ribbon strips
    const baseIdx = f * (samplesPerFilament + 1) * 2;
    for (let i = 0; i < samplesPerFilament; i++) {
      const a = baseIdx + i * 2;
      const b = baseIdx + i * 2 + 1;
      const c = baseIdx + (i + 1) * 2;
      const d = baseIdx + (i + 1) * 2 + 1;

      indices.push(a, c, b);
      indices.push(b, c, d);
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
  geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
  geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
  geometry.setAttribute('aFilament', new THREE.BufferAttribute(new Float32Array(filamentAttr), 1));
  geometry.setAttribute('aParamT', new THREE.BufferAttribute(new Float32Array(paramTAttr), 1));
  geometry.setAttribute('aRibbonT', new THREE.BufferAttribute(new Float32Array(ribbonTAttr), 1));

  const mesh = new THREE.Mesh(geometry, material);

  return {
    mesh,
    material,
    geometry,
    uniforms: material.uniforms,
    curve,
    controlPoints,
    palette,

    dispose() {
      geometry.dispose();
      material.dispose();
    },

    updateProgress(t) {
      // Set shader uniforms for time-driven animation
      if (material.uniforms) {
        material.uniforms.progress.value = Math.max(0, Math.min(1, t));
        material.uniforms.time.value = performance.now() / 1000;
      }
    }
  };
}

/**
 * braid(bundleA, bundleB, t) → new mesh
 *
 * Weave two bundles together; t ∈ [0..1] controls braid amount.
 * ponytail: simplified — stacks bundles; full helix weave deferred.
 */
export function braid(bundleA, bundleB, t = 0.5) {
  const group = new THREE.Group();

  // Apply rotation based on braid parameter
  const angleA = t * Math.PI * 2;
  const angleB = (1 - t) * Math.PI * 2;

  bundleA.mesh.rotation.z = angleA;
  bundleB.mesh.rotation.z = angleB;

  group.add(bundleA.mesh);
  group.add(bundleB.mesh);

  return group;
}

/**
 * splitToAnchors(bundle, anchors[], t) → array of meshes
 *
 * Split a bundle at target anchor points; t controls the split morphing.
 * Each output represents one sub-bundle heading toward an anchor.
 * ponytail: linear interpolation to anchor positions; easing deferred.
 */
export function splitToAnchors(bundle, anchors, t = 0) {
  const splits = anchors.map((anchor, i) => {
    const subBundle = makeBundle(
      bundle.controlPoints.slice(0, Math.ceil(bundle.controlPoints.length * (1 - t * 0.3))),
      bundle.palette,
      { filamentCount: Math.max(2, Math.floor(bundle.mesh.geometry.attributes.aFilament.array.length / anchors.length)) }
    );

    const targetPos = new THREE.Vector3(...anchor);
    subBundle.mesh.position.lerp(targetPos, t);
    subBundle.mesh.rotation.z = i * (Math.PI * 2 / anchors.length);

    return subBundle.mesh;
  });

  return splits;
}

/**
 * trifurcate(bundle, anchors3, t) → three meshes
 *
 * Split a bundle into three streams (for capital scene).
 * Convenience wrapper around splitToAnchors for the three-way split.
 */
export function trifurcate(bundle, anchors3, t = 0) {
  if (anchors3.length !== 3) throw new Error('trifurcate expects 3 anchor points');
  return splitToAnchors(bundle, anchors3, t);
}

/**
 * Demo: simple utility to create a resting braid (for origin stub)
 */
export function createRestingBraid(paletteA, paletteB, opts = {}) {
  const controlPoints = [
    [-2, -1, 0],
    [-1, 0, 0],
    [0, 0.5, 0],
    [1, 0, 0],
    [2, -1, 0]
  ];

  const bundleA = makeBundle(controlPoints, paletteA, {
    filamentCount: opts.filamentCountA || 4,
    ...opts
  });

  const bundleB = makeBundle(controlPoints, paletteB, {
    filamentCount: opts.filamentCountB || 4,
    ...opts
  });

  const group = new THREE.Group();
  group.add(bundleA.mesh);
  group.add(bundleB.mesh);

  return {
    group,
    bundles: [bundleA, bundleB],
    dispose() {
      bundleA.dispose();
      bundleB.dispose();
    }
  };
}
