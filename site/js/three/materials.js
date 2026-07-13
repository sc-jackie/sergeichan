// Custom ShaderMaterial for silk-thread ribbons — unlit anisotropic sheen + glow.
// No scene lights required: sheen is a moving highlight band along the fiber,
// plus a view-angle shimmer. Palette gradient runs along the ribbon length.

import * as THREE from 'three';

const threadVertexShader = `
uniform float time;
uniform float breathe;
uniform float phase;
uniform float progress;

attribute float aFilament;
attribute float aParamT;
attribute float aRibbonT;

varying float vAlpha;
varying float vFilament;
varying float vParamT;
varying vec3 vNormalW;
varying vec3 vPositionW;

void main() {
  vFilament = aFilament;
  vParamT = aParamT;

  // Per-filament phase offset — independent oscillation (ported feel from the old engine)
  float ph = aFilament * 1.7 + phase;

  // Braid: two sine waves at different frequencies, per-filament independent
  float braid = sin(aParamT * 7.0 + time * 0.9 + ph) * 0.15
              + sin(aParamT * 3.2 - time * 0.55 + phase + aFilament * 0.8) * 0.08;

  // Breathe: amplitude modulation along the curve
  float breatheAmt = breathe * sin(3.14159 * aParamT * 2.0) * sin(time * 2.2 + aFilament * 0.9) * 0.2;

  vec3 displaced = position + (braid + breatheAmt) * normal;

  vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
  vPositionW = worldPos.xyz;
  vNormalW = normalize(mat3(modelMatrix) * normal);

  gl_Position = projectionMatrix * viewMatrix * worldPos;

  // Fade at ribbon edges
  vAlpha = 1.0 - abs(aRibbonT) * 0.65;
}
`;

const threadFragmentShader = `
uniform vec3 colorA;
uniform vec3 colorB;
uniform float time;
uniform float sheen;
uniform float glowIntensity;
uniform float opacity;

varying float vAlpha;
varying float vFilament;
varying float vParamT;
varying vec3 vNormalW;
varying vec3 vPositionW;

void main() {
  // Palette gradient along the fiber, slight per-filament variation
  vec3 base = mix(colorA, colorB, clamp(vParamT + (vFilament * 0.07 - 0.14), 0.0, 1.0));

  // Anisotropic sheen: a soft highlight band that travels along the fiber
  float bandPos = fract(vParamT - time * 0.055 + vFilament * 0.13);
  float band = exp(-pow((bandPos - 0.5) * 6.0, 2.0));

  // View-angle shimmer (fresnel-ish edge light)
  vec3 viewDir = normalize(cameraPosition - vPositionW);
  float fres = pow(1.0 - abs(dot(normalize(vNormalW), viewDir)), 2.0);

  float brightness = 0.55 + 0.65 * band * sheen + 0.35 * fres;
  vec3 finalColor = base * brightness + base * glowIntensity * 0.4;

  float alpha = vAlpha * opacity * (0.55 + 0.45 * band);
  gl_FragColor = vec4(finalColor, alpha);
}
`;

export function createThreadMaterial(options = {}) {
  const {
    palette = null,
    color = new THREE.Color(0xC9A45C),
    sheen = 0.9,
    glowIntensity = 0.35,
    qualityTier = 'medium',
  } = options;

  const colorA = palette && palette.length ? palette[0].clone() : color.clone();
  const colorB = palette && palette.length > 1 ? palette[palette.length - 1].clone() : color.clone();

  const material = new THREE.ShaderMaterial({
    vertexShader: threadVertexShader,
    fragmentShader: threadFragmentShader,
    uniforms: {
      time: { value: 0 },
      breathe: { value: qualityTier === 'low' ? 0.25 : 0.5 },
      phase: { value: Math.random() * Math.PI * 2 },
      progress: { value: 0 },
      colorA: { value: colorA },
      colorB: { value: colorB },
      sheen: { value: sheen },
      glowIntensity: { value: glowIntensity },
      opacity: { value: 0.85 },
    },
    transparent: true,
    blending: THREE.AdditiveBlending, // nebula-glow feel over the dark ground; no depth-sort artifacts
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  return material;
}

// Palette: use THREE.Color arrays to define gradients
export function createPalette(colors) {
  return colors.map(c => (typeof c === 'string' ? new THREE.Color(c) : c));
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
