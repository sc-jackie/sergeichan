---
version: alpha
name: Sergeichan — Live Wire Index
description: Design language for the sergeichan.com personal site and its /now field log.
colors:
  paper: "#f0efe9"
  ink: "#171714"
  muted: "#65645f"
  line: "#b8b6ad"
  signal: "#e84a26"
  signal-dark: "#a7270d"
  night: "#171714"
  night-text: "#f0efe9"
typography:
  display:
    fontFamily: Arial, Helvetica, sans-serif
  body:
    fontFamily: Arial, Helvetica, sans-serif
  mono:
    fontFamily: SFMono-Regular, Consolas, Liberation Mono, monospace
---

# Sergeichan design language

## Overview

The site treats each route as an authored spatial object rather than a reusable marketing template. The home page is the **Tesseract Loom**; `/now` is the **Live Wire Index**. They share precision, dark/light contrast, monospace metadata, and visible system behavior without sharing a literal layout.

An evolving field log should feel alive, provisional, and specific. The page borrows from workshop safety labels, editorial indexes, and marked-up studio walls: oversized compressed sans typography, a single acid-coral signal, ruled divisions, and a vertical progress line that accumulates as the reader moves.

## Colors

All visible color and font declarations must use named custom properties. Coral is the only accent; it represents current energy, progress, and active status.

## Typography

- Display text is heavy, uppercase, tightly tracked, and upright.
- Body copy stays conversational and compact, generally under 52 characters per line.
- Monospace is reserved for dates, status, sequence, and taxonomy.
- Avoid italic display type and decorative font mixing.

## Layout

- The opening view is an asymmetric 70/30 declaration, never a centered hero.
- Long chapters use a sticky numbered folio beside a scrolling ledger.
- Content is grouped with rules and negative space rather than cards or shadows.
- The dark “Not now” section is a deliberate voltage drop and semantic boundary.
- Mobile removes sticky staging and becomes a direct, single-column printed sequence.

## Components

- Page-scale scroll progress and the moving typographic ticker create the narrative thread.
- Entries reveal once, on approach; they do not continuously float.
- Hover and focus feedback remain CSS-only.
- `prefers-reduced-motion: reduce` removes reveals, ticker translation, smooth scrolling, and the progress rail while preserving the complete reading order.

## Do's and Don'ts

- Use semantic landmarks, headings, articles, lists, and machine-readable dates.
- Every link has a high-contrast `:focus-visible` ring; hover never carries meaning alone.
- The mobile layout must work at 320, 375, 390, 414, and 768 px without horizontal scrolling.
- Content is fully available with JavaScript disabled; motion is progressive enhancement.
- Update the masthead date, footer revision note, and relevant entry copy together.
- Keep current work in “On the bench,” active curiosities in “Current voltage,” and consciously deferred work in “Not now.”
- Do not invent metrics or imply public availability where none exists.
