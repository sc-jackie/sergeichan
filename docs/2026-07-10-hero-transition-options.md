# Hero × Transition study — 5 + 5 options

**Date:** 2026-07-10 · **Status:** iteration 3 on the Tesseract Loom, per Sergei's feedback:
cleaner + more interesting hero; transition must not zoom the hover card; mouse-friendly (cursor
mostly idle); mobile view shown; **per-project colors**; **Jackie-OS = core**.
**Live demos:** claude.ai artifact "Hero × Transition — 5 + 5 options" (all playable + phone frame).

## New interaction rules (all options)

- **Idle life:** heroes auto-cycle focus — the page performs without the mouse.
- **Lazy pointer:** focus follows loose x anywhere on canvas; click anywhere enters the focused
  project; ← → / Enter on keyboard.
- **Color system:** deep space monochrome at rest; a project's color appears only via focus and
  inside its case study. Palette: Jackie-OS gold #C9A45C (core) · Newfin indigo #7C93E8 · B-Unit
  emerald #5FBF8E · Rodyna ember #E08D66 · Draw cyan #56C4D6.
- **Mobile:** no hover — auto-cycle + tap to focus, tap again to dive, swipe cycles; glimpse
  becomes a bottom sheet; dive capped 700ms / DPR 2.

## Heroes

- **H1 · The Core** — Jackie-OS as nucleus; four colored threads radiate to the corners; focus
  sends a pulse from core down the thread. Most iconic, emptiest.
- **H2 · Chords** — five verticals only (no background threads), core center + thicker; focus =
  standing-wave breath in color. Calmest evolution of the prior hero.
- **H3 · Score** — horizontal staff lines; projects as colored beads; an autonomous playhead
  sweeps and focuses whatever it crosses (pointer x overrides). Most editorial.
- **H4 · The Braid** — ONE thread through five knots ("one thread, many vibrations" literal);
  a pulse walks the braid blooming knots; Jackie-OS = biggest, double-wrapped center knot.
  Most distinctive mark.
- **H5 · The Instrument** — five strings rising from a bridge; idle auto-strum; focused string
  rings in its color. Most tactile.

## Transitions (none use the card zoom)

- **T1 · Color Flood** — thread swells, its color floods the frame, masthead surfaces, flood
  settles into a top accent line.
- **T2 · Curtain Pull** — chosen thread drags the whole weave sideways with staggered lag,
  wiping to the case page.
- **T3 · Warp Dive** — camera-only smoothed plunge with color-tinted streaks (no UI zoom).
- **T4 · Threshold** — lattice parts along the thread like doors; you pass through the opening;
  reverse = resurface. Calmest.
- **T5 · Resonance** — the thread rings in its color until vibration blurs the frame into a color
  field; the case study crystallizes as it decays. Most string-theory.

## Recommendation

**H4 Braid + T1 Color Flood** (thesis as a single mark + color that means something on entry);
runner-up **H1 Core + T4 Threshold** (most architectural/calm). Any H×T mix is valid.

## Next

Sergei names H + T → merge winner into the working home↔case prototype (hero, bottom-sheet
glimpse, chosen transition, five case studies) → then 1:1 Three.js rebuild.

---

## Decision + prototype v2 (same day)

Sergei picked **H2 Chords (upgraded to tesseract-silk) × T3 Warp Dive**, both "more interesting."
Working prototype shipped (claude.ai artifact "Chords × Warp — working prototype v2"):

- **Hero:** each project = a bundle of 3 silk filaments braiding slowly; 2 faint tesseract depth
  layers + sparse horizontals behind; focus opens the bundle, saturates its color, adds standing-
  wave breath + gravity bead + sheen. Jackie-OS center in gold. Auto-cycle focus; loose pointer x
  steers; click anywhere / Enter dives; ← → cycle; Esc resurfaces.
- **Warp dive (~1.3s, 3 phases):** approach (camera centers, bundle opens, space dims) → warp
  (fly between filaments; neighbors stretch into color-tinted streaks, chromatic echo, color
  bloom) → arrival (fade to near-black + color horizon line that becomes the case page accent).
  Resurface = fast reverse warp. No card scaling anywhere.
- **Case pages themed per project color** (kicker, chips, arch node, progress line, wireframes,
  next-link); all five case studies fully written (unchanged content).
- **Glimpse:** desktop side panel / mobile bottom sheet; idle cycle teases to stage 2, manual
  engagement unlocks stage 3; never used as the transition.
- **Phone frame** preview embedded; touch = tap to focus, tap again to dive; dive capped 700ms.

Next: Sergei tuning notes on v2 → 1:1 Three.js rebuild.

## Prototype v3 (same day) — hover + transition refined per Sergei

- **Glimpse shrunk & quieted** (196px, lighter glass, kicker+name only on idle cycle; one-liner +
  dive hint appear on engagement). The card is informational only.
- **Hover = chord expansion**: focus fans the bundle 3 → 7 filaments spreading ~30px in the
  project color with sheen + gravity bead — the chord itself is now the hover effect.
- **Dive rebuilt around expansion, ~2.1s, three acts:** I *bloom* — chord unfurls into a
  15-filament color curtain across the frame; II *warp* — fly through the fan as it stretches
  (streaks, chromatic shimmer, white core echo); III *arrival* — curtain collapses with a brief
  full-frame color flash into the horizon line that becomes the case-page accent. Resurface =
  fast reverse (~0.7s).

Same artifact URL (in-place update). Awaiting next tuning pass or go for Three.js rebuild.

## Round 2 study (same day) — hero immersion ×5, expansion dive ×5

Sergei: keep the core (silk chord bundles, colors, jackie core, chord-expansion dive), remove
horizontal lines, make hero more immersive-but-cleaner; add a no-warp "threads expand into page"
transition. Study shipped (artifact "Chords hero ×5 · Expansion dive ×5"):

**Hero immersion variants (no horizontals anywhere):**
V1 Depth Field (echo chords recede per project — corridor focus; recommended) · V2 The Nave
(strings converge upward, rising dust) · V3 Silk Rain (silk flows upward; focus stills its chord)
· V4 Nebula (3–4% color auras behind chords, breathe on focus; soft alternative) · V5 Inside
(room sways ±2°, pointer/gyro tilts — presence).

**Expansion dives (all start from the chord unfurling):**
E1 Pure Expansion — no warp, threads fill the page then settle to the accent line (Sergei's ask;
recommended default) · E2 Expansion+Warp (current v3, comparison) · E3 Weave-In (filaments lie
down and become the case page's own layout rules — the wow) · E4 Ripple (color wavefront develops
the page as it passes) · E5 Part (curtain fills then parts like theater doors; reverse = close).

Recommendation: V1 + E1 daily; E3 as optional first-visit-only beat. Awaiting V + E pick →
fold into prototype (same URL) → Three.js.

## Prototype v4 (same day) — nebula picked; pocket-follow hover, 3D cores, eye dive

- **Backdrop = V4 Nebula:** 3–4% per-project color auras behind chords; far layers and all
  horizontals removed; dust only.
- **Pocket hover:** threads part around the cursor position *inside* the chord (gaussian pocket
  that follows pointer y, chord leans toward pointer x); silk wraps around the point.
- **3D cores:** small rotating wireframe object at each chord center, always visible — octahedron
  (Jackie-OS) · cube (Newfin) · tetra (B-Unit) · gyre rings (Rodyna) · seamed ball (Draw).
- **Hidden identity:** project line-icon + name (canvas strokes, SVG style) reveal in the chord
  center only on engagement; the core rises and fades to make room. Bottom labels removed.
- **New dive — "the eye" (~2.1s, no warp streaks):** pocket snaps to the core → core spins up and
  swells toward the viewer while threads open wider until the eye is the page → color ring at the
  opening's edge + color wells up → soft flash → accent line the case page inherits. Resurface =
  eye closes. Glimpse card slimmed to kicker + one-liner + hint at 72% height.

Same prototype URL (in-place v4). Next: tuning or Three.js go.

## Prototype v5 (same day) — fans restored, icon-in-sphere cores, calm core-entry dive

Sergei on v4: pocket chords felt worse — wanted the previous smooth expanded feel with nebula;
liked the icons → make them 3D inside a sphere as the chord core; dive should expand smoothly and
the core must not spin fast.

- **Chords:** back to the full-height smooth fan (9 filaments, wide + easy, v3 breathing) over the
  nebula auras; fan weight eases toward pointer y with a wide envelope (0.6·sin(πv) + 0.4·gauss),
  eased at 0.055/frame — responsive but never pinched.
- **Cores:** each chord center = the project's **3D line icon rotating slowly inside a wireframe
  sphere** (3 rings). Always visible; pearl at rest, project color on focus; name reveals beneath
  only on engagement. Icon geometry as sampled 3D polylines (orbit / chart / chevrons / bowl+steam
  / seamed ball).
- **Dive:** single smooth gesture ~2.1s — fan expands to fill the page while the sphere swells
  toward the viewer at its normal slow rotation (no spin-up); you pass through the rings into the
  color welling up inside; soft settle → accent line. No warp streaks, no separate ring flourish.

Same prototype URL (in-place v5).

## Prototype v6 (same day) — globe core, threads flow around it

Sergei: chords/nebula good now; core shouldn't look like an atom — just a sphere; icon + sphere
must stay visible with threads moving around them.

- **Core = quiet wireframe globe:** outline circle + two latitude bands + one slowly turning
  meridian + soft inner color glow (atom rings removed). Project's 3D line icon turns inside.
- **Threads flow around the core:** each filament bows left/right (alternating sides, gaussian
  around core y) keeping the sphere in a permanent clear opening; during the dive the swelling
  globe itself pushes the silk aside — expansion and core-entry are one physical gesture.

Same prototype URL (in-place v6).

## Prototype v7 + core study (same day)

Sergei on v6: didn't like the look — revert threads to previous (v5) feel; explore the core as
options; icons must never rotate out of view (oscillate horizontally instead).

- **Prototype v7 (same URL):** threads reverted to v5 smooth fans (no bowing/avoidance); icons now
  oscillate ±35° yaw (always readable); core = temporary halo placeholder pending pick.
- **Core study shipped** (artifact "The core — five treatments"), all on v5 threads:
  C1 Halo (icon in soft color glow, no geometry) · C2 Lens (glass bead magnifying the threads
  behind it — recommended; magnification seeds the dive) · C3 Dial (static bezel + ticks lighting
  in sequence, nothing rotates) · C4 Cocoon (loose silk strands spun around the icon — most
  material-true) · C5 Free + satellite (bare larger icon + one slow orbiting bead).

Awaiting C1–C5 pick → fold into prototype → Three.js.

## Halo + pulse-dive study (same day)

Sergei picked C1 Halo; wants pulsating halo on hover (several versions) and a more beautiful
transition where the icon stays centered and unscaled — built from pulsation + thread expansion.
Study shipped (artifact "Halo pulses ×5 · Pulse dives ×5"):

**Halo pulses:** HA Breath (calm 2s cycle) · HB Rings (steady halo, quiet sonar rings depart) ·
HC Ember (organic noise flicker) · HD Twin (inner/outer halos in counter-phase) · HE Chord-synced
(halo + fan breathe in one phase; pulse rides up the threads — recommended).

**Pulse dives (icon constant size, center, fades only at the very end):**
P1 Pulse Cascade (three rings, each pushes the fan wider; third carries color) · P2 One Breath
(single giant inhale — halo + fan swell as one; recommended: hover and dive become one language at
two magnitudes) · P3 Waves on the Threads (luminous wavefronts run along filaments, widening the
fan per pass) · P4 Heartbeat (thump-thump, stillness, then one confident bloom — characterful
alt) · P5 Resonance (pulse quickens, threads vibrate in sympathy until they dissolve into the
color field).

Awaiting HA–HE + P1–P5 pick → fold into prototype → Three.js.

## Prototype v8 (same day) — FINAL interaction design folded in

Sergei picked: **halo = breath + rings** (subtle but eye-catching); **dive = waves from the
pulsating centered icon pushing the threads out, no top/bottom pinch**.

- **Halo:** icon (oscillating ±35°) in a color glow breathing on a ~2s cycle; one quiet ring
  departs on engagement. Same halo pulses through the dive, intensified.
- **Dive (~2.1s):** icon stays centered at constant size, pulsing; three waves (visible expanding
  rings at p=0.08/0.34/0.60) each push the fan a step wider (staircase spread, ~19% of width per
  wave) while threads straighten to parallel verticals (envelope sin(πv) → 1 by p=0.5) — elegant
  edge-to-edge spread with no center pull at the endpoints. Color wells up behind the steady icon
  → veil → accent line. Resurface reverses.

Prototype v8 live at the standing URL. Design is now fully specified: nebula chords + smooth fans
+ pointer-eased envelope + breath-and-rings halo cores with oscillating 3D icons + wave-spread
dive + color-themed case studies. **Ready for the Three.js rebuild on go.**

## Prototype v9 (same day) — dive smoothed per Sergei

- **Continuous spread:** staircase removed — one smooth ease over ~2.6s (faint pulse riding it),
  threads straighten to parallel verticals as before.
- **Threads stay alive:** braid + breath keep running at hero amplitude through the whole dive
  (damping removed).
- **Pulses contained:** page-crossing wave rings and full-screen color well removed; the halo
  intensifies but stays around the icon (local glow ≤120px).
- **Resurface smoothed:** ~1.4s eased reverse; case page fades while the silk re-gathers
  underneath simultaneously — one motion both directions.

v9 live at the standing URL. Design locked pending final look; Three.js rebuild on go.

## Prototype v10 (same day) — line removed, livelier silk, hero language inside case pages

- **Transition:** horizontal accent line removed from the arrival — soft color breath + veil only.
- **Threads:** braid amplitude up (~30%, plus a slow second harmonic) everywhere — "move a little
  more, but not too much."
- **Case pages inherit the hero:** each case masthead now has (a) the project's chord *laid down*
  — 5 horizontal silk filaments breathing across the top in the project color under a faint nebula
  glow, dissolving into the page; (b) the project's icon beside the title with its breathing halo,
  still oscillating. Runs on its own raf while the case is open (started on dive, stopped on
  resurface; reduced-motion = static frame). Shared globals refactor: proj3/ICONS/drawCoreSphereG
  now serve both hero and case renderers.

v10 live at the standing URL.

## Prototype v11 (same day) — case pages on full-page silk

Sergei: product pages should carry the threads as a subtle full background with small faint color,
no halo — "like the silk you first sent me" — with text fully readable.

- Masthead band replaced by a **fixed full-viewport silk background** in every case page: 24
  flowing rows (the original silk motion), pearl at ~5% alpha, every 4th row tinted the project
  color at ~7.5%, gentle breathing, zero glow/halo.
- **Pressed reading column**: a horizontal gradient quiets the silk exactly behind the 760px text
  column (~62% dim), keeping contrast effortless while the silk stays visible at the margins.
- Icon + breathing halo beside the title unchanged; runs only while the case is open.

v11 live at the standing URL.

## Prototype v12 (same day) — case silk vertical, project-colored

Case-page background silk turned **vertical** (the hero's chords continued through the page):
26 columns flowing with the same slow braid, **all tinted the project color** at ~6–9% alpha
(every 5th slightly brighter), no glow; pressed reading column unchanged.

v12 live at the standing URL.

## Prototype v13 (same day) — seamless continuity dive

Sergei: chords should spread out and STAY as the page background (a bit more color); the icon
should travel to its position on the case page; then text appears with a nice transition.

- **No veil at all:** the spreading threads recede into background alpha (×0.22 by p=1) and remain;
  the case's own vertical silk (bumped to ~8.5–13% color) crossfades over the settled state —
  the threads visually *become* the page background.
- **Shared-element icon flight:** at p=0.8 the hero's core hands off to a fixed-position flying
  canvas that eases (0.55s) from hero center to the icon's seat beside the case title, then the
  real seat takes over. Resurface flies it home (hero core reappears only after the flight,
  gated at p<0.55 on the way back).
- **Staggered content entrance:** case content is hidden until the icon lands ('settled' class) —
  backbar → roman → icon → kicker → title → one-liner → meta rise in 50–250ms steps; body sections
  follow at +420ms. Reduced-motion: everything at once, no flight.

v13 live at the standing URL.

## Prototype v14 (same day) — the hero's ACTUAL threads are the case background

Sergei: use the real hero threads for the project background (no added set), keep more color,
make the icon transition as smooth as possible.

- **True continuity:** the case view is fully transparent; on dive the hero element pins
  fullscreen (`.bgmode`, canvas refit) and keeps rendering underneath — the exact filaments you
  dove through remain as the living background (settle alpha ×0.38, color kept). The separate
  case-canvas silk is deleted. A CSS pressed-column gradient protects readability.
- **Icon flight upgraded:** 0.7s, double-eased (velvet ends), traveling on a gentle upward arc
  (quadratic bezier) from hero center to its seat; reverse flight home on resurface; hero un-pins
  only after the silk fully re-gathers (~1.55s).

v14 live at the standing URL.
