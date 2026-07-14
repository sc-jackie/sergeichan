# Diffui round 1 — sergeichan redesign, design-led

Per the EVE-87 post-mortem: **static mockups reviewed by Sergei before any motion or code.**
Diffui (https://diffui.ai) generates 9 static options per prompt in ~50s — this folder is the
input kit. Sergei drives the tool; taste stays with the owner.

## Setup (once)

1. Sign up at https://diffui.ai (pay-as-you-go, no card needed to start).
2. Upload the three brand screenshots from this folder so it learns the current design:
   - `01-hero.png` — silk-thread hero, chord hover state (Rodyna active)
   - `02-case-dive.png` — Jackie-OS case-study dive (Mode I layout)
   - `03-docs.png` — Fumadocs docs surface (brand's utilitarian sibling)

## How to run a round

- One surface per prompt. Generate, skim the 9, discard freely — rounds are cheap.
- Re-roll with a tweaked prompt rather than settling. Stop at 1–2 frames you actually like.
- Save picks (screenshot or export) into `plans/diffui-round-1/picks/`.
- Mockup text is placeholder — copy gets truth-gated later, never shipped as generated.

## Prompts (paste-ready)

### A · Home / hero

> Personal site hero for Sergei Tran, an AI-native builder running five production systems.
> Headline: "One thread, many vibrations — five systems in production, built with AI-native
> agents." Dark ink page, type-led, minimal. Five projects (Jackie-OS, Newfin, B-Unit, Rodyna,
> Draw) present as one visual system — not cards, not a grid of tiles. Monospaced smallcaps for
> labels and hints, one large grotesk statement line, exactly one accent color. Quiet, confident,
> no marketing language, no fake metrics.

Variant seeds (append one to explore a direction that was never built):

- **Chiaroscuro:** "Near-black page where a single warm light source reveals content; long soft
  shadows; candle-warm duotone; serif display headline."
- **Monolith:** "Fully achromatic; the five projects as engraved slabs of different proportions
  emerging from white haze; condensed engraved type."
- **Sanctum:** "Strict central-axis symmetry; a radial gold hairline rosette on near-black stone;
  inscriptional Roman capitals; verde accent; gravitas."
- **Split-flap:** "Mechanical departures-board aesthetic; monospaced flip-cell rows listing the
  five systems with live-data flavor (cron times, statuses); board black + departure green."

### B · Case-study page (Jackie-OS)

> Case-study page for "Jackie-OS — a personal AI operating system: memory, skills, and always-on
> agents running one life." Sections: What it is · Why it exists · How it works · What runs daily.
> Meta row: 2026 · TS + Markdown + Agent SDK · Running 24/7. Long-form readable column, mono
> smallcaps section labels, generous vertical rhythm, dark ink page with one accent. Editorial,
> honest, zero dashboard clichés — this is an essay about a system, not a product landing page.

### C · Writing / essay page (EVE-79)

> Essay page for a personal site — literary but technical. Big serif or grotesk title, readable
> measure (~65ch), mono smallcaps for date and reading time, footnote and pull-quote styles,
> dark ink theme with one accent. The writing is the hero; no sidebars, no engagement widgets.

### D · Work index (optional)

> Index page listing five case studies with equal weight — Jackie-OS, Newfin, B-Unit, Rodyna,
> Draw. Each row: mono smallcaps mode label (MODE I–V · CASE STUDY), project name, one-line
> description, year. Typographic list, not cards. Dark ink, one accent, hover state implied.

## After you pick

Hand the winning frames back to Claude Code. Then: tokens/layout implemented **by hand** into
`site/index.html` (single-file, no framework — Diffui's Web-Component export is spec, not paste),
under `jos-design-gate`, delivered as a **PR with Vercel preview** only. No motion is designed
until the stills are approved — motion is a second, separate gate.

## Source material

- `design-directions-2026-07-09.md` — the 15 archived directions (D1–D15) for prompt vocabulary.
- Post-mortem (EVE-87): fleet breadth ≠ taste; design-led, static-first, or outside designer.
