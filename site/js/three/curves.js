// Curve utilities for silk-thread bundles
// Parametric curves to guide ribbon formations

import * as THREE from 'three';

// Create a catmull-rom curve from control points
export function createCurve(controlPoints) {
  const curve = new THREE.CatmullRomCurve3(
    controlPoints.map(p => new THREE.Vector3(p[0], p[1], p[2]))
  );
  curve.curveType = 'catmullrom';
  return curve;
}

// Sample a curve at a given parametric position [0..1]
export function sampleCurve(curve, t) {
  return curve.getPoint(Math.max(0, Math.min(1, t)));
}

// Get curve tangent at position t
export function getCurveTangent(curve, t) {
  const pt = Math.max(0.001, Math.min(0.999, t));
  return curve.getTangent(pt).normalize();
}

// Create a bundle of curves around a primary curve (spiral pattern)
export function createBundleGuides(primaryCurve, bundleCount = 3, radius = 0.2) {
  const guides = [];
  for (let b = 0; b < bundleCount; b++) {
    const angle = (b / bundleCount) * Math.PI * 2;
    const samples = [];
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const pt = sampleCurve(primaryCurve, t);
      const tangent = getCurveTangent(primaryCurve, t);

      // Create perpendicular direction via rotation
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
      const binormal = new THREE.Vector3().crossVectors(tangent, normal);

      // Offset around primary curve
      const x = pt.x + Math.cos(angle) * radius * normal.x + Math.sin(angle) * radius * binormal.x;
      const y = pt.y + Math.cos(angle) * radius * normal.y + Math.sin(angle) * radius * binormal.y;
      const z = pt.z + Math.cos(angle) * radius * normal.z + Math.sin(angle) * radius * binormal.z;

      samples.push(new THREE.Vector3(x, y, z));
    }
    const guideCurve = new THREE.CatmullRomCurve3(samples);
    guides.push(guideCurve);
  }
  return guides;
}

// Interpolate between two curves (for morph transitions)
export function lerpCurves(curveA, curveB, t) {
  return (paramT) => {
    const ptA = sampleCurve(curveA, paramT);
    const ptB = sampleCurve(curveB, paramT);
    return new THREE.Vector3().lerpVectors(ptA, ptB, t);
  };
}
