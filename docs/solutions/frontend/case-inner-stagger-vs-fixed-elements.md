# Fixed-position elements must not live inside `#case .inner` (staggered rise leak)

**Found in:** EVE-115 (mobile floating CTA audit). **Fix commit:** on branch
`fablio/eve-115-…` — moved `#cVisitFloat` out of `.inner`.

## Symptom

The floating product CTA (`#cVisitFloat`, `position:fixed`, hidden until `.on`) became fully
visible ~1s after a case opened — before the reveal threshold, right-clipped past the 390px
viewport (its `translate(-50%)` centering was gone), stuck visible after scrolling back up, and on
link-less cases (rodyna) it showed a stale label from the previous case. Headless screenshots taken
*during* the first second looked fine, which masked the bug in earlier reviews.

## Root cause

`site/index.html` staggers case content in with:

```css
#case .inner > *        { opacity:0; transform:translateY(12px); transition:… }
#case.settled .inner > * { opacity:1; transform:none }             /* (1,2,0) */
```

Any direct child of `.inner` is captured. The float's own rules (`#case .visit--float`, specificity
(1,1,0)) lose to the settled rule, so once `.settled` lands the float gets `opacity:1;
transform:none` regardless of `.on`. The reduced-motion override `#case .inner > *
{ transition:none !important }` captured it too.

## Rule

Overlay/fixed elements (floating CTAs, toasts, anything `position:fixed`) belong as direct children
of `#case`, **outside `.inner`** — they must never participate in the rise-in cascade. When adding
one, verify with a rendered check ≥1.6s after `settled` (the stagger uses transition-delay up to
.42s + .6s duration; earlier measurements can falsely pass).

Audit script that encodes all of this: `artifacts/eve-115/cta-audit.cjs` (16 assertions, exits
non-zero on failure).
