# Personal website — five design directions (v2 exploration)

**Date:** 2026-07-09 · **Status:** awaiting Sergei's pick
**Live previews:** claude.ai artifact "Personal site — 5 design directions" (each direction has a working motion sketch).

Supersedes the v1 plan's §6 design language (Ledger anchoring dropped) and §3.1 ordering
(all projects now get **equal-weight case studies** — Jackie-OS, Newfin, B-Unit, Rodyna, Draw —
each with its own Three.js scene). Shared skeleton across all directions: minimal, type-led,
one scroll-driven canvas system; scroll is the only controller (identical on mobile and desktop);
light + dark, reduced-motion, and 0-JS fallbacks always ship.

## D1 · Signal Field — dark, atmospheric particles

One persistent point-cloud behind the whole site; scroll scrubs a master timeline and the cloud
**reforms per section** — name at top, then a distinct formation per case study (Jackie-OS
constellation, Newfin chart-surface, B-Unit crystal burst, Rodyna steam drift, Draw ball-arc →
bracket). Neo-grotesk type (Neue Montreal / General Sans), ink-black + one signal blue.
Effort ●●●○. *Pick if:* the site should feel like one living system — strongest "AI-native builder" match.

## D2 · Blueprint — light, wireframe technical drawing

Ink lines on paper; every project is a **wireframe artifact that assembles/explodes on scroll**
(sticky scene, Apple-scrub pattern, line-drawn) with mono annotations + leader lines. Fragment/
JetBrains Mono + compact grotesk; paper #F6F5F0, ink, drafting blue. Cheapest to render, flawless
on mobile. Effort ●●○○ — lowest technical risk. *Pick if:* the work itself is the hero — best fit
for equal-weight case studies since each project literally becomes an object.

## D3 · Chromatic Glass — light gradients, refractive glass forms

MeshTransmissionMaterial-style glass sculptures drifting through depth layers on scroll, refracting
the type behind them; one tinted object per project (Newfin glass coin-lens, B-Unit faceted gem,
Rodyna amber vessel…). PP Editorial New italic + Neue Haas. GPU-hungry → needs a tiered renderer
for mobile. Effort ●●●● — highest wow, dates fastest. *Pick if:* maximum first-impression gloss.

## D4 · Terrain — dark, narrative journey

The site is one camera flight over a monochrome ridgeline landscape; **projects are waypoints**
where the terrain calms (Newfin's ridges are literally its net-worth curve; B-Unit a stepped
ascent). Persistent station-nav doubles as progress + tap-to-jump. Serif display (literary voice).
Deep pine + pale lines + waypoint amber. Effort ●●●○. *Pick if:* the writing matters as much as
the work — the storytelling identity becomes structural.

## D5 · ASCII Machine — terminal-meets-editorial

Real Three.js scenes post-processed into **live character grids**; sections resolve from noise as
they enter the viewport. Berkeley Mono identity, phosphor amber on CRT black + a designed light
"paper terminal" theme. Jackie-OS scene ticks sanitized agent-log lines as ambient content.
Nearly free on mobile GPUs. Effort ●●○○. *Pick if:* the most distinctive and honest signature —
looks like what the work actually is (agents, terminals, systems).

---

# Round two — ten more directions (D6–D15)

Requested same day: ten additional non-repeating directions, including 3D geometric figures and a
minimalist Medici Chapel (Cappella dei Principi) symmetry. Live previews: claude.ai artifact
"Personal site — 10 more design directions".

## D6 · Solids — matte platonic solids in a light studio
One solid per project (Jackie-OS dodecahedron, Newfin cube, B-Unit subdividing octahedron, Rodyna
tetrahedron, Draw icosahedron), flat-shaded, tumbling under soft light; scroll applies torque and
docks each project's solid center. Suisse Int'l/Aeonik type, studio-gray ground, muted clay/slate/
sage. Effort ●●○○. *Pick if:* maximum calm and timelessness.

## D7 · Sanctum — Medici Chapel symmetry, minimalized
Strict central-axis + octagonal order: a radial 3D rosette in gold hairline inlay on nero stone
rotates 45° per section ("bay per project"), reconfiguring its geometry while holding perfect
symmetry. Inscriptional Roman capitals (Cinzel/Trajan-class), centered axis, verde accents.
Effort ●●●○. *Pick if:* gravitas — the boldest identity statement of all fifteen.

## D8 · Dioramas — isometric miniature worlds
One continuous iso landscape; each project is a tiny room (Jackie-OS control room, Newfin vault,
B-Unit arena, Rodyna kitchen, Draw court) that assembles cube-by-cube as the camera pans to it on
scroll. GT Walsheim type, pale ground, one hue per room. Effort ●●●○. *Pick if:* the most human,
memorable read.

## D9 · Chiaroscuro — a moving light is the interface
Near-black page; scroll moves a warm light source, and extruded emblems + type cast long sweeping
shadows that reveal content ("sundial scroll"). Canela/GT Sectra display, candle-warm duotone.
Effort ●●●○. *Pick if:* cinematic atmosphere with almost nothing on screen.

## D10 · Silk — one cloth is the whole surface
Simulated silk ripples and folds as scroll pulls it; the weave re-threads per project (Newfin's
ridgeline = net-worth curve, Draw = net mesh); quiet nod to Vietnamese silk heritage. Light
extended sans, deep indigo + pearl + one iridescent roll. Effort ●●●○. *Pick if:* elegance and
touch, with a private meaning.

## D11 · Orbit — the architecture drawn honestly
Jackie-OS as the core; products as orbiting bodies with trails and ephemeris-style data tables;
scroll zooms overview → orbit → case study. Univers/IBM Plex, space black + one cyan. Effort ●●●○.
*Pick if:* the truest mapping of the actual system-of-systems.

## D12 · Monolith — concrete slabs in fog
Camera dollies past engraved brutalist slabs emerging from white haze; slab proportions encode
each project (Jackie-OS = the foundation slab). Druk-class condensed engraving, fully achromatic.
Effort ●●○○. *Pick if:* weight and silence — a body of work with permanence.

## D13 · Ink — sumi blooms on washi
Sections transition through fluid-sim ink wipes; each project opens with its ink gesture; one red
seal stamp is the only color. IvyPresto/Freight display. Effort ●●●● (real fluid sim or nothing).
*Pick if:* the essays are the heart of the site.

## D14 · Split-Flap — a mechanical departures board
Instanced 3D flip cells spell sections as they cross viewport center; rows can display *live true
data* (actual cron times, quest states, tonight's menu). Söhne Mono, board black + departure
green. Effort ●●○○. *Pick if:* charm + honesty — animation that tells the truth.

## D15 · Moiré — interference as imagery
Two overlaid line gratings create shifting op-art patterns; scroll phase-shifts them; each project
owns a pattern pair; headlines resolve like photographs developing. Founders Grotesk, strict
black/white + one electric blue. Cheapest GPU of all fifteen; needs a vestibular-safety toggle.
Effort ●●○○. *Pick if:* gallery-grade optical minimalism.

## Next step

Fifteen directions total (D1–D15). Sergei picks one (or shortlists 2–3 → head-to-head hero
prototypes in real Three.js). The chosen direction then expands into the full system: type scale +
grid, all five case-study scene designs, per-page scroll choreography, performance tiering — and
the v1 plan is revised around it.
