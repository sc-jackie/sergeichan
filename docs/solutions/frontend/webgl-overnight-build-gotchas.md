---
module: site (WebGL / Three.js)
tags: [threejs, webgl, headless-verification, agent-fleets, vendoring]
problem_type: integration-gotchas
date: 2026-07-14
---

# WebGL site build gotchas (EVE-87 overnight run)

Hard-won learnings from building the cinematic six-act Three.js site with an
agent fleet. Each cost a debugging round; don't re-pay.

## 1. Vendoring three.js: the split build

Since r167, `three.module.min.js` is a wrapper that internally does
`import ... from "./three.core.min.js"`. Vendoring only the wrapper makes the
ENTIRE module graph fail with `Failed to fetch dynamically imported module` —
no console error names the missing file. Vendor **both** files, same exact
version, same directory. Pin real versions (`three@0.185.1`), never `@latest`.

## 2. Verifying WebGL without a display

- **Playwright MCP cannot render this site's WebGL** — readPixels returns
  [0,0,0,0] despite a valid scene. Do not let agents "verify" visuals there.
- **Headless Chrome works**: `--headless=new --screenshot=<png>
  --virtual-time-budget=9000 <url>` renders WebGL and lets time-driven intros
  play. Fresh profile each run = no stale-cache traps.
- **BUT virtual-time breaks scroll**: Lenis smooth-scroll + ScrollTrigger pin
  layout don't settle; anchor-target captures of *pinned* sections come out
  black. Only trust headless captures for scroll-position-0 or full-page shots.
- **Embedded browser panes throttle rAF to zero** (occluded window). Animations
  freeze, loops look "dead", intros never advance. DOM/scroll assertions are
  fine there; animation debugging is not. A frozen `renderer.info.render.frame`
  in the pane does NOT mean the loop is broken.
- Browser module caching serves stale JS silently mid-session; to hard-bust,
  serve on a **new port** (new origin = empty cache).

## 3. Silent module-graph deaths

`await import()` inside an async boot with no `.catch` swallows the rejection —
the site half-boots with zero console errors. Wrap the boot chain and log.
Also: a module evaluated top-to-bottom dies mid-file if it touches
`window.X.prop` before `window.X` is assigned (assign exports FIRST); and a
rAF loop with no try/catch dies permanently on the first scene exception —
wrap the tick body, re-arm rAF outside the catch.

## 4. `DOMContentLoaded` never fires for late dynamic imports

A module dynamically imported after page load must not gate its init on
`DOMContentLoaded` alone — guard with
`document.readyState === 'loading' ? addEventListener(...) : init()`.

## 5. Unlit scenes render Phong black

`MeshPhongMaterial` in a scene with no lights = invisible geometry with
healthy-looking draw calls. For glow/silk aesthetics use an unlit custom
`ShaderMaterial` (additive blending, `depthWrite:false`) — no lights needed,
and the look is the point.

## 6. Agent fleets invent plausible content — truth-gate public data

Three separate agents fabricated: investment counts ("12 angel checks"),
conference credits ("Warsaw Tech talk", "AI Magazine feature"), and wrong
product descriptions ("Newfin (crypto hedge)"). None were asked to. Any
agent-written data file that ships on a public site needs a human/orchestrator
truth pass — check *every* number, name, and credit against reality. An empty
section beats a fictional one. (Privacy corollary: a render-time `approved`
flag is theater — the data file is world-readable source; approval gates the
commit.)

## 7. Fleet verification ≠ orchestrator verification

Agents reported "all assertions pass" three times while the site was invisible
or empty (static checks passed; runtime was hollow; their own screenshots went
unviewed). The contract that worked: agents must SAVE screenshots to a shared
dir and the orchestrator LOOKS at every one before believing any green claim.
