# `/now` page: Live Wire Index

## Decision

The standalone static site now includes an additive `/now` route built as a self-contained HTML document. Its design concept is **Live Wire Index**: a workshop/editorial field log whose coral progress signal connects current projects, obsessions, inputs, and explicit non-priorities.

## Durable implementation notes

- Preserve the repository's zero-build, zero-dependency public-site architecture. Continuous scroll choreography uses native CSS scroll timelines; `IntersectionObserver` and the Web Animations API handle one-shot reveals.
- The document is readable without JavaScript. The `js` class only hides reveal targets after script execution begins.
- Reduced-motion users receive the full static composition with no scroll-linked ticker, reveal transitions, smooth scrolling, or progress rail.
- Add future entries inside the existing semantic `article` ledger rather than introducing generic cards.
- Keep visible styles on the named color/font tokens documented in `DESIGN.md`.

## Verification targets

Render at 390 × 844 and 1440 × 900, inspect both images, and check the browser console. Also test 320, 375, 414, and 768 px for horizontal overflow because the display type intentionally pushes the mobile measure.
