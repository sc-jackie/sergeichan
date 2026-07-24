# Hero→case transition & fig-loop gotchas (site/index.html)

Learned while fixing EVE-114 (Draw case: faithful figure + jump-free motion).

## Transition jumps — root causes found

1. **Never override a fixed `inset:0` element's height with `100vh` on iOS.**
   `#hero.bgmode{height:100vh}` resized the hero canvas mid-dive on mobile
   Safari (visual viewport with URL bar ≠ `100vh`), making the silk field
   visibly jump at `casePrep` (dive.p = 0.8). The base `position:fixed;inset:0`
   already tracks the viewport — the override was removed.

2. **A shared-element "seat" must not participate in entrance transitions.**
   `#cIconCv` (the flying icon's landing pad) was caught by the
   `#case .inner > *` staggered rise (opacity 0 → 1, translateY 12px), so the
   opaque flying icon blinked out and the seat re-faded in 12px lower.
   The seat is exempted (`opacity:1;transform:none;transition:none`); JS
   toggles only `visibility` around the flight.

3. **rAF animations must be wall-clock and token-cancellable.**
   `flight.t += 1/60` ran 2× fast on 120Hz ProMotion and let two concurrent
   step-loops mutate the same object after close-mid-flight (stale `onLand`
   re-added `.settled` to a closing case). Pattern now: each flight is a local
   object `fl`; the loop bails when `flight !== fl`; time advances by clamped
   `(ts - last)/1000`. Same for the hero's `dive.p` (was `1/158` per frame).

4. **Teardown timers must be cancelled on reopen.** `doResurface()` schedules
   `.open` removal (500ms) and `unpinHero()` (1550ms). Reopening inside that
   window used to unpin the hero underneath the newly opened case. `casePrep`
   / `openDeep` now `clearTimeout` both.

5. **Close-mid-flight: start the return leg from the icon's in-air position**
   (`flight.x/y`), not from the seat rect, or the icon teleports.

## Fig loop seams (figViz `R.*` renderers)

A looped fig must end on the exact state it starts from. The `R.draw` pattern:
a static "skeleton" (cards, seeds, chrome) is always drawn; everything the
cycle adds (scores, highlights, advanced slots, champion) is multiplied by a
`dyn = 1 - ease((ph-0.90)/0.09)` envelope that exhales before the wrap. The
one-time entrance uses absolute `t` (`intro = ease(t/1.1)`), not `ph`, so it
plays once per open instead of re-hiding the skeleton every cycle.

`prefers-reduced-motion` figs pin `ph` to a *meaningful resolved* state
(e.g. 0.86 — champion visible, before the outro), with `t = 99` so intro
and score reveals are complete.

## Verification harness

`artifacts/verify.js` (Playwright, viewport 390×844) screenshots the fig at
several loop phases including the wrap, the dive mid-flight/settled, an
interruption sequence (back mid-flight → reopen against the pending teardown),
all other cases, and a reduced-motion context; it fails on any console error.
Serve with `python3 -m http.server 8123 --directory site`, run with
`NODE_PATH=<playwright install> node artifacts/verify.js`.

Note: project ids for deep links are `newfin, bunit, jackieos, rodyna, draw`
(`jackieos` has no hyphen — an unknown hash while a case is open resurfaces).
