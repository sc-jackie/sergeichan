# EVE-115 — Mobile floating CTA audit at 390×844

**Verdict: the audit FAILED against base `d0290d2`** (checks 1, 3, 5, 7, 8) — a real settled-state
CSS leak, not a scaffolding artifact. A minimal one-node DOM fix was applied on this branch, after
which **all 9 checks pass (16/16 assertions)**.

## How to reproduce

```sh
# from the repo root, two shells:
python3 -m http.server 8000 --directory site
node artifacts/eve-115/cta-audit.cjs        # exits 0 on full pass, prints per-check table
```

Playwright headless Chromium, viewport 390×844, DPR 3, `isMobile` + touch emulation. The script
resolves Playwright from `require()` or the npx cache automatically. Raw numbers land in
`artifacts/eve-115/results.json`.

## Root cause found (and fixed on this branch)

`#cVisitFloat` was a **direct child of `#case .inner`**, so the staggered rise-in rule
`#case.settled .inner > * { opacity:1; transform:none }` (specificity 1-2-0) overrode the float's
own hidden state `#case .visit--float { opacity:0; transform:translate(-50%,10px) }` (1-1-0) as
soon as the case settled (~1s after open). Consequences, all reproduced with rendered evidence:

* Float fully visible **before** the reveal threshold, with `transform:none` — so no `-50%`
  centering: left edge at x=195, right edge at 413.7px, **clipped 23.7px past the 390px viewport**
  (`failing-before-fix/03…png`, `failing-before-fix/probe-draw-settled-prescroll-cta-leak.png`).
* Scrolling back up removed `.on` but the settled rule pinned `opacity:1` — CTA never hid (check 5).
* Rodyna (no product link) showed a **stale clipped bunit CTA** at the page bottom
  (`failing-before-fix/11…png`).
* The reduced-motion override `#case .inner > * { transition:none !important }` (line 331) also
  captured the float, defeating its opacity-only transition (check 7, `transition="none"`).
* Earlier flow-A measurements passed only inside the 0.42s transition-delay window — the audit
  script now waits out the settled window (1.6s) before asserting.

**Fix (`site/index.html`, on this branch only):** moved the `#cVisitFloat` node out of `.inner` to
be a direct child of `#case`. It is `position:fixed`, so it never belonged in the rise-in flow;
all `#case .visit--float` selectors and JS hooks are unchanged. Sibling stagger delays are
unaffected (children after the old slot stay in the `nth-child(n+8)` bucket). No new CSS, no new JS.

## Pass/fail per check (after fix — before-fix state in parentheses)

| # | Check | Result | Measured |
|---|-------|--------|----------|
| 1 | Hidden initially (home + case open pre-threshold) | **PASS** (FAIL: leaked to opacity 1 after settle) | opacity=0, pointer-events=none, on=false; inline CTA top=407.5px on screen |
| 2 | Reveal past threshold | **PASS** | `.on` gained, opacity=1, pe=auto, label "Open @drawtennisbot" |
| 3 | Centered + not clipped | **PASS** (FAIL: center=304.3, right=413.7 > 390) | center=195.0 (target 195±2), rect x=85.7 w=218.7 right=304.3, scrollWidth=390 |
| 4 | Safe-area | **PASS** | computed bottom=18px (env()=0); with simulated 34px inset CTA bottom=792 < indicator top=810 |
| 5 | Scroll back up hides | **PASS** (FAIL: opacity stuck at 1) | `.on` removed, opacity→0, pe=none |
| 6 | Browser back stays on site | **PASS** | url=http://localhost:8000/, case closed, float hidden |
| 7 | Reduced motion | **PASS** (FAIL: transition=none) | transition="opacity 0.15s", CTA still reveals to opacity 1 |
| 8 | All five cases | **PASS** (FAIL: hiddenFirst=false everywhere; rodyna showed stale bunit CTA) | correct labels jackieos/newfin/bunit, all centered at 195.0; rodyna never shows float; draw→newfin switch clears `.on` + swaps label |
| 9 | Console | **PASS** | 0 errors, 0 warnings across all flows |

## Evidence files (`artifacts/eve-115/`)

Passing (after fix): `01-home-masthead-390.png`, `02-draw-open-pre-threshold.png`,
`03-draw-post-threshold-cta-visible.png`, `04-draw-cta-simulated-safe-area.png`,
`05-draw-cta-hidden-after-scroll-up.png`, `06-after-browser-back-home.png`,
`07-draw-reduced-motion-cta.png`, `08-jackieos-cta-visible.png`, `09-newfin-cta-visible.png`,
`10-bunit-cta-visible.png`, `11-rodyna-no-cta-at-bottom.png`, `results.json`.

Failing (base d0290d2): same filenames under `failing-before-fix/`, plus
`probe-draw-settled-prescroll-cta-leak.png` (float visible + right-clipped pre-threshold).

Notes: the 34px safe-area inset and the red indicator bar in `04…png` are injected test scaffolding
(`page.addStyleTag`) only — not committed to source. Check-5 recorded opacity 0.0071 (transition
tail at capture instant, asserted < 0.01). No Draw-case fig/transition code was touched or observed
misbehaving during the flows (EVE-114's scope).
