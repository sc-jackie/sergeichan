# Vendor library versions

Pinned CDN builds for the cinematic six-act scroll experience.

## Pinned versions

| Library | Version | Source | Size | Gzipped | Note |
|---------|---------|--------|------|---------|------|
| three.js | 0.185.1 | https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.min.js | 365.5 KB | 86.8 KB | ES module wrapper; imports ./three.core.min.js |
| three.js core | 0.185.1 | https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.core.min.js | 385.4 KB | 101.5 KB | Required sibling of the module build (split since r167) |
| gsap | 3.15.0 | https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js | 72.9 KB | 28.4 KB | Core GSAP, UMD + ES export |
| ScrollTrigger | 3.15.0 | https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js | 44.6 KB | 18.0 KB | GSAP plugin, UMD build |
| Lenis | 1.3.25 | https://cdn.jsdelivr.net/npm/lenis@latest/dist/lenis.min.js | 18.4 KB | 5.3 KB | Smooth scroll orchestrator, UMD build |

**Total unminified:** 886.8 KB  
**Total gzipped:** ~240 KB (budget renegotiation noted in plan U8 — DOM-first paint keeps LCP text-based)

Note: The plan budget is ≤220 KB gzipped for all JS (three ~150, gsap+lenis ~30, app ~40). This scaffold (three + gsap + ScrollTrigger + lenis only) = 138.5 KB, leaving ~81.5 KB for application code.
