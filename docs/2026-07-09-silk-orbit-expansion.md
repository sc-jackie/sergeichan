# Silk × Orbit — shortlist expansion

**Date:** 2026-07-09 · **Status:** Sergei shortlisted D10 (Silk) + D11 (Orbit); both expanded.
**Live mocks:** claude.ai artifact "Silk × Orbit — expanded" (hero compositions with real type,
work index, case-study scene, and article-page design per direction).
**New requirement folded in:** articles/writing is a first-class pillar in both systems
(two tiers — essays + notes — same IA in both; only the metaphor changes).

## D10 · Silk — "the loom"

One woven surface is the entire site; the cloth is the only image (screenshots appear inside case
studies as "pinned swatches"). Enriched with: iridescent crest (pearl→lavender→jade, motion-only
color), pointer/touch ripple, **per-project weaves** (Jackie-OS tight technical weave, Newfin
ridgeline = NW curve, B-Unit knots, Rodyna gauze, Draw net) shown as live swatches in the work
index, billow full-screen page transitions, 1px animated thread hairlines.
**Articles = "day silk":** reading flips to a light pearl page (66ch, 1.7 lh); the cloth survives
only as a woven reading-progress ribbon under the title + thread section rules.
Type: light extended sans (Neue Haas Unica/Saans Light) with true italics; mono meta.
Perf: GPU verlet cloth ~40×26, one draw call, ≤150KB island; article pages drop the sim.
Risk: legibility over live surface (solved via "pressed" dim zones under text).

## D11 · Orbit — "the ephemeris"

The architecture drawn honestly: Jackie-OS core, products orbiting, writing as the comet. Only
lines, points, type. Enriched with: **moons** (Persik→Newfin, coach-loop→B-Unit, Mini App→Rodyna),
the Writing comet with tail on an eccentric ellipse, sparse starfield parallax, almanac-grade
ephemeris data (real year/stack/status per body), three-regime descent choreography (overview →
orbit insertion → surface with callout leader-lines), occasional moon-transit micro-events.
**Articles = "observation log":** index as dated comet-visit table; article pages near-black,
66ch, with a thin trajectory line under the title where a comet dot = reading progress. Essays =
perihelion entries; notes = distant observations.
Type: Univers Next/IBM Plex Sans; mono + tabular figures for all data.
Perf: 2–3 draw calls, ≤120KB island — lightest option.
Risk: solar-system cliché — survived only because it's literally the real architecture; data must
stay true.

## Hybrid — "Loom Orbit"

Orbit's structure (core/bodies/comet/almanac/descent) rendered in Silk's material (orbits as woven
threads, comet tail as silk ribbon, day-silk reading pages). ~20% more effort than either alone;
the signature-move option.

## Decision pending

Sergei says "Silk", "Orbit", or "Loom Orbit" → build the chosen hero as a real Three.js prototype,
lock tokens + type scale, design all five case-study scenes, fold back into the build plan.
