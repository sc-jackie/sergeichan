// Custom ShaderMaterial for silk-thread ribbons
// Anisotropic sheen + glow effect

import * as THREE from 'three';

// Vertex shader: per-filament sway + ribbon expansion
const threadVertexShader = `
uniform float time;
uniform float sway;
uniform float breathe;
uniform float phase;
uniform float progress;
uniform vec3 basePos[VERT_POSITIONS];

varying float vAlpha;
varying vec3 vNormal;
varying float vFilament;
varying float vParamT;

attribute float aFilament;
attribute float aParamT;
attribute float aRibbonT;

void main() {
  vFilament = aFilament;
  vParamT = aParamT;

  // Per-filament phase offset — independent oscillation (port from old engine)
  float ph = aFilament * 1.7 + phase;

  // Braid: two sine waves at different frequencies
  float braid = sin(aParamT * 7.0 + time * 0.9 + ph) * 0.15
              + sin(aParamT * 3.2 - time * 0.55 + phase + aFilament * 0.8) * 0.08;

  // Breathe: amplitude modulation along the curve
  float breathe_amt = breathe * sin(3.14159 * aParamT * 2.0) * sin(time * 2.2 + aFilament * 0.9) * 0.2;

  // Ribbon expansion (perpendicular to curve)
  vec3 pos = position + (braid + breathe_amt + aRibbonT * 0.3) * normal;

  vec4 modelPos = modelMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * viewMatrix * modelPos;

  vNormal = normalize(normalMatrix * normal);
  vAlpha = 1.0 - abs(aRibbonT); // fade at ribbon edges
}
`;

// Fragment shader: anisotropic sheen + soft glow
const threadFragmentShader = `
uniform vec3 color;
uniform float sheen;
uniform float glowIntensity;

varying float vAlpha;
varying vec3 vNormal;
varying float vFilament;
varying float vParamT;

void main() {
  // Anisotropic sheen: highlight travels with view angle
  vec3 viewDir = normalize(cameraPosition - vPositionW);
  vec3 lightDir = normalize(vec3(0.5, 1.0, 0.8));

  // Sheen effect on ribbon surface
  float sheen_val = pow(abs(dot(vNormal, viewDir)), 0.5) * sheen;

  // Soft glow: additive contribution
  float glow = glowIntensity * (1.0 - vParamT) * 0.3; // fade toward end

  vec3 finalColor = color * (0.7 + 0.3 * sheen_val) + glow * 0.5;

  gl_FragColor = vec4(finalColor, vAlpha * 0.8);
}
`;

export function createThreadMaterial(options = {}) {
  const {
    color = new THREE.Color(0xC9A45C),
    sheen = 0.8,
    glowIntensity = 0.3,
    transparent = true,
    qualityTier = 'medium'
  } = options;

  // ponytail: simplified shader — full anisotropic model deferred, this is the working baseline
  const material = new THREE.MeshPhongMaterial({
    color,
    emissive: new THREE.Color().multiplyColors(color, new THREE.Color(glowIntensity * 0.3)),
    wireframe: false,
    transparent,
    opacity: 0.85,
    side: THREE.DoubleSide,
    shininess: 100,
    fog: false
  });

  // Uniforms for animation
  material.uniforms = material.uniforms || {};
  Object.assign(material.uniforms, {
    time: { value: 0 },
    sway: { value: 0.5 },
    breathe: { value: 0.5 },
    phase: { value: 0 },
    progress: { value: 0 },
    sheen: { value: sheen },
    glowIntensity: { value: glowIntensity }
  });

  return material;
}

// Palette: use THREE.Color arrays to define gradients
export function createPalette(colors) {
  return colors.map(c => typeof c === 'string' ? new THREE.Color(c) : c);
}

// Sample a palette at a normalized position [0..1]
export function samplePalette(palette, t) {
  const idx = Math.max(0, Math.min(palette.length - 1, Math.floor(t * (palette.length - 1))));
  const nextIdx = Math.min(palette.length - 1, idx + 1);
  const localT = (t * (palette.length - 1)) % 1;

  const color = new THREE.Color();
  color.lerpColors(palette[idx], palette[nextIdx], localT);
  return color;
}
