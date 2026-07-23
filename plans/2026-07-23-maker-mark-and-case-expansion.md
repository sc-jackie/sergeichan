# Maker's mark on product landings + case-view expansion to Jackie-OS depth

_Design spec, approved 2026-07-23. Implementation plan to follow as
`2026-07-23-maker-mark-and-case-expansion-implementation.md`._

## Goal

1. Every product landing carries a consistent, on-brand credit linking back to the
   personal site, deep-linked to that project's case view.
2. The four non-flagship case views (Newfin, B-Unit, Rodyna, Draw) on the main site
   reach the same structural depth as the Jackie-OS case — using the existing
   optional-section system, not a redesign.

Constraint (EVE-87 post-mortem): incremental, design-led; no layout overhaul.

## Part 1 — Maker's mark

**Mark:** small inline SVG of the five-thread favicon motif (five vertical strokes,
gold center thread) + the text `Sergei Chan`, as one link in the footer meta line.

| Surface | File | Change |
| --- | --- | --- |
| Newfin landing | `site/newfin/index.html` footer (`.footer__links`) | Replace the plain `<a href="/">Sergei Chan</a>` with glyph + name, href `/#newfin` |
| B-Unit parents landing (EN) | `bunit` repo, `web/public/parents.html` (`.foot-links`) | Add glyph + `Sergei Chan`, absolute href `https://sergeichan.vercel.app/#bunit` |
| B-Unit parents landing (VI) | `bunit` repo, `web/public/parents-vi.html` | Same, localized label |

Notes:
- B-Unit hrefs are absolute; leave a comment to update when the custom domain
  (EVE-80) ships.
- Glyph inherits footer text color; gold center thread uses each page's accent or
  literal `#C9A45C` — keep it recognizable, not loud.

### Hash routing on the main site

`site/index.html` hero gains minimal hash support so case views are linkable:

- On load, if `location.hash` matches a project id (`#newfin`, `#bunit`,
  `#jackieos`, `#rodyna`, `#draw`), open that case directly (reduced-motion path —
  no dive animation on deep entry).
- Opening/closing a case sets/clears the hash (`history.replaceState`, no scroll
  jumps). Back button resurfaces.
- ~10–20 lines inside the existing IIFE; no router, no library.

## Part 2 — Case-view expansion

Author per-project data for the already-generic optional sections (`jobs`, `day`,
`duo`, `trick`, `truths`) plus one signature canvas figure per project in the
`memfig` pattern (one canvas, one draw fn, ~40–60 lines). All existing CSS classes
reused; the diff is mostly content.

| Project | Loop (`jobs`) | `day` | `trick` (before/after) | `truths` | Signature figure |
| --- | --- | --- | --- | --- | --- |
| Newfin | sync → normalize → net-worth line → advisor → Telegram | a day with the book | generic finance app vs. advisor bound to real payload | read-only by design · household scoping · one truth · no lock-in | stacked net-worth area chart, demo data |
| B-Unit | quest → submit → coach verify → coins → cashout → level | a teenager's day | parental nagging vs. game economy | honest economy · anti-cheat · real rewards · agent-built | XP/streak pulse over weeks |
| Rodyna | link → ack <1s → extract → validate → nutrition → library | — (loop covers it) | chat scrollback vs. recipe card with provenance | originals immutable · bilingual additive · ~$0/mo · multi-tenant | duo-card variant: original (UK) vs. translation (EN) |
| Draw | register → gate → draw → play → standings → rankings | tournament day strip | spreadsheet weekend vs. generated draw | — (in dev, keep lighter) | animated bracket resolving itself |

Copy is grounded in each repo's actual docs (same standard as the Jackie-OS case).

**Reciprocal links (case → landing).** Each case view gets a `doclink`-style
outbound link, completing the two-way loop with Part 1:

- Newfin case → `/newfin` ("Visit the product →"). The Newfin landing lives in
  THIS repo (`site/newfin/`), not the newfin code repo.
- B-Unit case → `https://bunit.vercel.app/parents` (landing lives in the bunit
  repo, `web/public/parents.html`).
- Jackie-OS already has its docs link; Rodyna and Draw have no public landing —
  nothing added.

Section-heading labels adapt per project (e.g. Jackie-OS "The loop — six jobs" →
Newfin "The pipeline"); headings become data-driven where currently hardcoded.

The `memfig` canvas inside the duo card is Jackie-OS-specific ("linked memory");
Rodyna's duo variant gets its own figure or none — decided at implementation, not
forced.

### Structure

`site/index.html` stays a single self-contained file (deliberate). If the project
data block grows unwieldy during implementation, extracting it to
`site/projects.js` is pre-approved as the one allowed structural change.

## Out of scope

- Any hero/dive redesign, new fonts, new pages.
- Real screenshots for case frames (EVE-78 — separate).
- Custom domain (EVE-80 — separate; only the comment breadcrumb above).

## Acceptance

- Both B-Unit parents pages and the Newfin landing show the mark; links land on the
  correct opened case view.
- Newfin and B-Unit case views link out to their landings (`/newfin`,
  `bunit.vercel.app/parents`).
- `/#<id>` opens each of the five cases directly; back/resurface clears the hash.
- Each of the four cases renders its new sections + figure; Jackie-OS unchanged.
- `prefers-reduced-motion` honored by all new canvases (static final frame).
- No horizontal scroll / layout breakage at 375px width.
