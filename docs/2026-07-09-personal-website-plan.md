# Personal website — analysis & design plan

**Date:** 2026-07-09 · **Status:** plan, awaiting Sergei's go + open decisions below
**Brief:** minimal site focused on work and content; subtle Three.js; exceptional attention to detail; perfect typography, information architecture, and hierarchy.

> **Amended same day (v2), per Sergei:** (1) no flagship framing around `ai-os-quickstart` —
> **equal-weight case studies for every project** (Jackie-OS, Newfin, B-Unit, Rodyna, Draw), each
> showcased with its own Three.js-style scene; (2) §6's Ledger anchoring is **dropped** — the
> visual language will be slick-minimal with a bolder Three.js presence, chosen from
> [`2026-07-09-design-directions.md`](2026-07-09-design-directions.md) (five directions with live
> motion previews); (3) §7's single-hero restraint relaxes accordingly — the chosen direction's
> canvas system runs through the case studies, scroll-driven, mobile-first. IA (§4), privacy
> boundary (§3.3), content model (§5), budgets/stack (§9) and phases (§10) still stand, with §5's
> template gaining a "scene" block per project.

---

## 1. Positioning — what this site is

Not a portfolio in the 2015 sense (grid of thumbnails), and not a blog platform. It is a **professional identity surface + a home for writing**, built to a level of craft that itself demonstrates the skill it describes. The site is the case study.

**The through-line to tell:** designer (2014–2018, real client work — Lexus/Suzuki/Toyota dealership sites in Singapore) → blockchain analyst & community organizer (2018–2020) → full-time investor (2020–2025) → **builder of AI-native systems and products** (now). That arc is unusual and credible — the site should present it as one continuous curve (design sensibility + analytical instinct + capital literacy → AI-era product building), not as four disconnected jobs.

**One-liner candidates** (hero copy, pick at build time):

- "I design and build AI-native systems."
- "Designer by training, investor by decade, building AI-native products in Warsaw."
- "I build systems where humans and AI agents work as one team."

**What makes the body of work distinctive** (this is the pitch, and it's true):
Sergei doesn't just ship apps — he ships **an operating system for his life and businesses** where autonomous agents do real work daily (morning briefs, code dispatch from a Linear backlog, deploys, journal capture). Jackie-OS + the public `ai-os-quickstart` template is the flagship; Newfin, Rodyna, B-Unit, Draw are the products riding its rails. Very few individuals can show a working multi-agent operation of this depth. Lead with it.

**Goals (ranked):**
1. A credible, current answer to "who is this person and what can he do" — for collaborators, clients, employers, and the Warsaw/EU tech scene.
2. A home for essays (the storytelling thread: travel, awe, identity, two-cultures) that has been waiting since 2019 for a venue he controls.
3. A quiet proof of craft — typography, detail, restraint.

**Non-goals:** lead-gen funnels, newsletter pop-ups, analytics-driven anything, a CMS, project count over quality, anything that needs weekly maintenance to avoid looking stale.

---

## 2. Audience & the jobs each page does

| Audience | They arrive at | They need to leave with |
|---|---|---|
| Potential collaborator / client / employer | Home, Work | "He builds real, running systems — and has taste." In <60 seconds. |
| Essay reader (social/RSS referral) | /writing/slug | A superb reading experience; one click to who wrote it. |
| Tech peer inspecting the craft | Colophon, view-source | The details hold up everywhere they poke. |
| Future product user (B-Unit, Rodyna…) | /work/slug | What it is, one screenshot, an outbound link. |

---

## 3. Content inventory & the privacy boundary

### 3.1 Public work (case-study candidates, in recommended order)

1. **Jackie-OS / ai-os-quickstart** — flagship. Personal AI operating system: Obsidian vault as memory, markdown skills as contracts, a 24/7 VPS agent (Hermes) running cron briefs, journal capture, autonomous code agents dispatching from Linear. Public artifact already exists: [github.com/sc-jackie/ai-os-quickstart](https://github.com/sc-jackie/ai-os-quickstart). Strongest story; entirely defensible to publish (architecture, not contents).
2. **Newfin** — open-source personal-finance platform: net worth across crypto/real-estate/private deals, LLM advisor, household Telegram bot, "The Ledger" editorial design system. **Present with demo/seed data only — never real figures.**
3. **Rodyna** — Telegram-first bilingual (EN/UK) family recipe app; AI ingestion from YouTube/photos; multi-tenant, ~$0/mo. Warm human story (Vietnamese-Ukrainian family in Warsaw) — the case study where the two-cultures identity shows through product.
4. **B-Unit** — gamified habit/quest economy for a teenager; two autonomous coding agents working the backlog. Good "agents shipping production code" story.
5. **Draw** — tennis community platform (tournaments, draws, rankings). List as "in development"; shorter entry.
6. **Peaches Beauty** — optional, one-paragraph entry: SEO/web for a Munich salon. Shows range (small-business, hands-on); skippable at launch.

Rule of thumb: **3 deep case studies + 2–3 short entries** beats 6 equal ones. Depth for Jackie-OS, Newfin, Rodyna; index-lines for the rest.

### 3.2 Public writing (seed content)

- The storytelling direction is documented and pre-dates this site (Königssee essay 2019, "Past Lives" essay 2024, the unwritten *Two Cultures* piece). Seed the Writing section with **1–2 finished essays** — curating/finishing them from the journals is Sergei's work (agents can assist with structure, never write his story for him).
- A short **"Notes" tier** (500–1500 words, technical/observational — e.g. "What I learned running autonomous agents for a month") is much cheaper to produce and keeps the section alive between essays. Two tiers, one index.
- If zero pieces are ready at launch: ship the section with a single honest placeholder ("Writing is coming — the first essay is about growing up between two cultures") rather than fake stubs. Never launch an empty nav item without copy.

### 3.3 Hard privacy boundary — never on the public site

The vault behind this plan contains sensitive material. The public site draws **only** from the whitelist above. Explicitly excluded, non-negotiable:

- Any real financial figures, portfolio composition, net-worth history, trading records (Newfin appears with demo data only).
- Mental-health and recovery material, medication, coaching corpus, self-portraits, journals (essays may *draw on* life events once Sergei deliberately publishes them — that is his editorial call per piece, made at writing time, never harvested by an agent).
- Family members' names, photos, or identifying details beyond what Sergei explicitly opts in (wife, sister's salon staff, the B-Unit teenager — "a 14-year-old family member," never a name).
- Infrastructure identifiers: VPS IPs, bot tokens/handles used operationally, internal repo URLs, cron schedules, Supabase project ids.
- Anything from a `#private`-tagged note, in any form.

Add this list to the site repo's CLAUDE.md verbatim so every future agent inherits it.

---

## 4. Information architecture

Five pages. Flat, no dropdowns, no hamburger on desktop.

```
/                     Home — identity, selected work (3–4), latest writing (≤3), now-line
/work                 Index — ledger-style table of all projects
/work/<slug>          Case studies (jackie-os · newfin · rodyna) + short entries inline on /work
/writing              Index — essays + notes, one chronological list, tier-tagged
/writing/<slug>       Article page (the typographic showpiece)
/about                Bio (the arc), now section, contact, colophon
404                   Designed, not default
rss.xml · sitemap.xml · og images per page
```

**IA decisions and why:**

- **Home is a composed editorial front page, not a splash.** Above the fold: name, one-liner, the Three.js piece (§6), and the first work entry already visible. Nothing requires scrolling to learn who he is.
- **Case studies live at `/work/<slug>`** with a strict repeating template (§5) — sameness of structure is what makes three deep pieces feel like a system, not three brochures.
- **Short-entry projects don't get pages.** They render as rows on `/work` with a one-liner and an external link. No page is better than a thin page.
- **Writing and Work stay separate.** Merging them ("everything is a post") reads as a blog; he needs the work surface to stand alone for professional visitors.
- **About carries the colophon** (type, stack, how the site is built) — the page craft-inspectors end on. Contact = email + GitHub + Telegram handle (personal, not ops bots); no form.
- **A "now" line, not a /now page** — one sentence on Home + About sourced from a single data file ("Currently: building an AI operating system and the products on top of it — Warsaw"). A page goes stale; a line gets updated.
- **Navigation:** `Work · Writing · About` + wordmark home link. Footer: email, GitHub, RSS, colophon link, "Warsaw, [year]".

**Hierarchy contract (applies to every page):** exactly one h1; eyebrow → h1 → standfirst pattern for page heads; section heads are small caps eyebrows (Ledger's `EdSectionHead` DNA), not big bold text — size contrast comes from the h1 and figures, not from shouting subheads.

---

## 5. Content model & case-study template

Content as MDX files in the repo (no CMS — git is the CMS, which is also his actual workflow):

```yaml
# work/*.mdx frontmatter
title, oneliner, year_start, status (live | in-dev | archived)
role ("design, engineering, operations"), stack [..]
links { site?, repo?, template? }
cover (optional), order, featured (bool), draft (bool)

# writing/*.mdx frontmatter
title, summary, date, tier (essay | note), draft, lang (en)
```

**Case-study template (fixed sections, ~600–900 words + media):**

1. **Masthead** — title, one-liner, meta row (year · status · role · stack) in mono.
2. **What it is** — 2–3 sentences, plain language, no jargon.
3. **Why it exists** — the human story (this is where Rodyna's family angle, Jackie-OS's "I needed structure" angle live).
4. **How it works** — one architecture diagram (static SVG, drawn in the site's line style, not a screenshot of Excalidraw) + 3–5 bullets of the interesting decisions.
5. **Details worth zooming** — 1–3 close-ups (a screenshot crop, a schema, a design-system fragment) with captions. Captions in mono, like a printed journal's figure captions.
6. **Status & links** — where it is today, one outbound link block.

Media discipline: every screenshot retaken deliberately (consistent viewport, seed/demo data, light theme), saved as AVIF/WebP with explicit dimensions (CLS = 0), described alt text. No device mockup frames — flat, bordered figures, editorial style.

---

## 6. Design language

### 6.1 Direction

Extend the taste he already owns and ships — **"The Ledger" editorial DNA** (Newfin's design system: cream paper, serif mastheads, caps eyebrows, mono metadata, tabular figures) — **softened from "financial dashboard" into "printed journal."** This gives the site a real, practiced voice instead of a mood-board pastiche, and it makes the personal site and his products visibly one hand.

Feel targets: a well-set book page that happens to be alive. References for calibration (not imitation): rauno.me (interaction restraint), paco.me / berkeleygraphics.com (typographic discipline), the Ledger system itself.

### 6.2 Typography (the core investment)

**Faces — same trio as the Ledger, recomposed:**

| Face | Role on this site |
|---|---|
| **Spectral** (+ italic) | Display: h1/mastheads, pull quotes. **And essay body** at text sizes — it was designed for screen reading; this is what makes /writing feel like his. |
| **Inter** | UI: nav, captions, standfirsts, work-index rows, About body. |
| **JetBrains Mono** | Meta: dates, tags, stack lists, figure captions, footnotes markers. |

Self-hosted, subset (latin + latin-ext for Polish + cyrillic for name/essay fragments), `woff2`, ≤ ~90KB total, `font-display: swap` with metric-compatible fallbacks tuned via `size-adjust` (zero layout shift on font load).

**Scale — fluid modular, tokens only (no ad-hoc sizes, same rule he enforces in Newfin):**

```
--text-micro    10→11px   mono meta, figure numbers
--text-label    11→12px   caps eyebrows        (tracking .14–.18em)
--text-caption  12→13px   captions, footnotes
--text-body     16→17px   UI body
--text-reading  17→19px   essay body (Spectral) · line-height 1.65 · measure 62–68ch
--text-title    22→28px   section/article subheads
--text-display  36→64px   h1 / masthead (Spectral, tracking -.02—-.035em)
```
All steps `clamp()`-fluid between 360px and 1200px viewports. Spacing on an 8px base scale; baseline rhythm audited on the article template specifically.

**Micro-typography checklist (the "perfect typography" substance):**

- Real punctuation everywhere: ' ' " " — – · …; automated by a smartypants pass at build so MDX authors type dumb quotes.
- `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs; manual no-orphan check on the hero one-liner.
- `hanging-punctuation: first` where supported (progressive enhancement) for quote-opening paragraphs.
- Hyphenation ON for essay body (`hyphens: auto`, `lang="en"` correct), OFF for UI.
- Tabular figures (`font-variant-numeric: tabular-nums`) on every date/number column — the /work index must align like a ledger.
- Crafted underlines: `text-decoration-thickness: 1px; text-underline-offset: 0.18em`, color at 40% ink, full ink on hover — links look designed, not defaulted.
- Old-style figures in running essay text if Spectral's `onum` renders well; tabular lining elsewhere.
- First paragraph of an essay: no drop cap (too costume-y) — instead a slightly larger opener (`--text-reading` +1 step) or small-caps first phrase. Decide on the real content.
- Footnotes as sidenotes on wide viewports, tap-to-reveal inline on mobile.

### 6.3 Color

Paper-and-ink minimalism, both themes designed (not inverted):

```
Light: paper #FAF7F0 (warm cream) · ink #1A1917 · muted #6B675F · line rgba(ink,.12)
Dark:  paper #141311 (warm charcoal, never pure black) · ink #ECE8DF · muted #97928A
Accent: one indigo (Ledger continuity) — used ONLY for links-on-hover state,
        focus rings, selection background, and ≤1 element per view. If a page
        works without the accent, ship it without.
```

Contrast ≥ 4.5:1 text / 3:1 UI in both themes. Theme = `prefers-color-scheme` + a manual toggle (persisted, no-flash inline script). A barely-there paper grain (CSS, ~2% opacity, disabled in dark mode if it muddies) is allowed; test both ways.

### 6.4 Layout

Single-column editorial grid: content column `max-width: 68ch` (reading) / `~1100px` (work index, home composition) centered, generous margins that breathe on large screens. Hairline rules (1px, `--line`) as the primary structural device — like a newspaper, sections are divided, not boxed. No cards, no shadows. Mobile-first; the site must be flawless at 360px.

---

## 7. Three.js — the one signature piece

### 7.1 Concept (recommended): *"Two names"* — a particle identity mark

A monochrome point-cloud (~10–15k particles, single draw call) in the home masthead that **forms the glyph outlines of his name and slowly morphs between its three scripts** — `Sergei` → `Сергій` → `Kho Fu Chan` — holding each for ~8–10s with a ~3s morph. At rest the particles breathe with low-amplitude curl noise; the pointer displaces them gently within a small radius and they ease back.

Why this concept: it is *about him* (the two-cultures identity that his essays will explore — the visual and the writing tell one story), it is typographic (consistent with a type-led site), and it is naturally subtle — ink-colored points on the paper background, ~50–60% opacity, no bloom, no color, no rotation-on-scroll circus.

**Implementation sketch:** sample glyph outlines offline (opentype.js → point sets baked to a static JSON/Float32 binary at build time — no font parsing in the browser), three morph targets, GPU interpolation in a custom shader material (`mix(posA, posB, ease(t))` + simplex noise displacement + pointer uniform). Vanilla Three.js in one lazy island — **no react-three-fiber** (no React on this site; keeps the island ~130–160KB gz total).

**Rules of restraint (what makes it "subtle" in practice):**

- Ink-on-paper monochrome; adapts to theme via a single color uniform.
- Loads lazily *after* LCP (the name is also present as real text — the canvas layers behind/above it as texture, never as the only rendering of the name).
- `prefers-reduced-motion` → static rendered frame (baked PNG/SVG of state A), zero JS.
- No WebGL / island error → the same static fallback; the page is 100% complete without it.
- Pauses via `IntersectionObserver` + `visibilitychange`; DPR capped at 2; target 60fps on a mid-range phone, measured.
- **Nowhere else.** The 404 page may reuse the system (particles scattered, refusing to form a word — one wry caption). Work and Writing pages get zero Three.js: the restraint is the point, and it keeps content pages at ~0KB JS.

### 7.2 Alternatives (if the name-morph doesn't land in prototype)

- **B — Drift contours:** slowly-drifting topographic contour lines (places/travel motif; ties to the essays). Calmer, less personal.
- **C — Ledger field:** a breathing grid of points with occasional ripples (ties to the systems/ledger identity). Most abstract, least risky, least memorable.

Prototype A first (1 evening in isolation before integrating); fall back down the list only on real evidence (perf or "looks like a gimmick" in situ).

---

## 8. The detail inventory ("exceptional attention to detail," enumerated)

Craft is a checklist, not a vibe. Each item is cheap; the sum is the reputation:

**Interaction & motion**
- One easing family (`cubic-bezier(0.25, 0.1, 0.25, 1)`) and 2 durations (120ms micro / 240ms transitions) site-wide.
- View Transitions API for page navigation (progressive enhancement): crossfade + the persistent nav doesn't repaint.
- Hover states on work-index rows: date column swaps to "→ read" in mono; row background tints 2%.
- `:focus-visible` rings (accent, 2px, offset 2px) on everything tabbable; skip-link; full keyboard pass.
- Scroll: no hijacking, no parallax, no scroll-triggered entrance animations on text. Content is just *there*.

**Reading experience**
- Essay pages: reading-time in the meta row, sidenotes (§6.2), `<figure>`s break the measure slightly wide, subtle `:target` highlight for shared anchors.
- Print stylesheet for essays (they're essays — people print/PDF them): serif, black on white, URLs expanded in footnotes.
- Full-content RSS (not summaries), one feed for both tiers.

**Identity & meta**
- OG image per page, generated at build (satori/resvg): paper background, Spectral title, mono meta — the site's typography extends into the link preview.
- Favicon: light/dark variants (SVG `prefers-color-scheme`), plus touch icon.
- `<title>` pattern: `Page — Sergei Tran`; canonical URLs; JSON-LD `Person` + `Article`; humans.txt or a `/colophon` easter-egg comment in the HTML head (`<!-- set in Spectral & Inter · built with Astro · Warsaw -->`).
- Custom `::selection` (accent at 25% + ink text). Custom scrollbar **not** styled (native scrollbars are correct; restraint).
- 404 with the particle easter egg and a one-liner.

**Robustness**
- Zero CLS: image dimensions everywhere, font metric fallbacks, no layout-shifting async content.
- Every page valid with JS fully disabled (theme falls back to media query; canvas falls back to static frame).
- Dark/light both *designed*: screenshots and diagrams get theme-aware variants or a neutral treatment that survives both.

---

## 9. Technical architecture

| Layer | Choice | Why |
|---|---|---|
| Framework | **Astro 5 + MDX** | Content-first, 0KB JS by default, islands for the one Three.js piece; content collections give typed frontmatter (Zod — same validation philosophy as everything he ships). |
| Styling | **Tailwind v4 with `@theme` tokens** | Mirrors Newfin's token discipline exactly (`--text-*`, `--tracking-*`, `--space-*`); port the `lint:tokens` guard (no `text-[Npx]`). |
| 3D | **three** (vanilla, single island) | §7. No React anywhere on the site. |
| OG images | satori + resvg at build | §8. |
| Hosting | **Vercel** | His existing rail (Newfin, Rodyna, B-Unit all deploy there); zero new ops. Static output (`output: 'static'`), edge-cached. |
| Repo | New: `sc-jackie/website` (private ok; site is the public artifact) | Own CLAUDE.md carrying the privacy boundary (§3.3), design tokens doc, and the detail inventory as a living checklist. Wire into Jackie-OS via the `new-project` skill (registry, vault note, plans scaffold) when the build starts. |
| Analytics | None at launch (or Vercel Analytics only) | Aligned with non-goals; a personal site doesn't need a consent banner. |

**Performance budget (hard, CI-checked via Lighthouse CI on PRs):**

- Content pages (work, writing, about): **0KB client JS** (theme toggle inline script only, ~1KB), LCP < 1.2s on 4G, CLS = 0.
- Home: island ≤ 170KB gz (three + shaders + baked glyph data), loaded post-LCP; LCP < 1.5s; steady 60fps canvas on mid-range mobile.
- Fonts ≤ 90KB total; images AVIF with WebP fallback, lazy below fold.
- Lighthouse ≥ 95 across all four categories on every page (100/100/100/100 target on writing pages).

---

## 10. Build phases

**Phase 0 — Decisions (Sergei, ~1h):** resolve §11, register domain.

**Phase 1 — Foundation (1–2 sessions):** repo + Astro + Tailwind tokens + fonts (subsetting, fallback metrics) + base layout (nav/footer/theme) + the typographic system proven on a real article template with lorem-length *real* text. Exit: an essay page that already looks publishable.

**Phase 2 — Work pillar (2–3 sessions):** /work index + case-study template + Jackie-OS, Newfin, Rodyna case studies written and illustrated (screenshots retaken per §5, diagrams drawn). Short entries for B-Unit/Draw. Exit: /work is shippable alone.

**Phase 3 — Signature (1–2 sessions):** Three.js prototype in isolation → integrate on Home → home-page composition (selected work + latest writing + now-line). Exit: home at budget, reduced-motion + no-JS fallbacks verified.

**Phase 4 — Writing pillar + meta (1 session):** /writing index + 1–2 seeded pieces (Sergei edits, agent typesets) + RSS + OG generation + JSON-LD + 404.

**Phase 5 — QA & launch (1 session):** device pass (360px → 4K, iOS Safari, Android Chrome), a11y audit (keyboard, screen reader smoke, contrast), Lighthouse CI wiring, DNS + deploy, then Jackie-OS wiring (`new-project` skill, vault note, registry).

Total: ~7–9 working sessions. Phases 2 and 3 can run in parallel (content vs. canvas).

**Definition of done per phase** = the relevant §8 checklist items pass + budgets in §9 hold; the detail inventory graduates into the repo as `docs/craft-checklist.md` and gates every future PR.

---

## 11. Open decisions (for Sergei — recommendations included)

1. **Domain.** Recommend `sergeitran.com` (matches email identity; easy to say aloud). Check `khofuchan.com` too and redirect if taken cheaply. Decide before Phase 1 (OG URLs, canonical).
2. **Name presentation.** Recommend leading with **Sergei Tran** everywhere; *Kho Fu Chan* appears in the hero morph (§7) and the About first paragraph — present as identity, not as alias confusion.
3. **Language.** Recommend **EN-only at launch**. Ukrainian for selected essays later is a beautiful phase-2 (the infrastructure — `lang`, hyphenation, cyrillic subsets — is already specced); Polish only if the Warsaw-scene goal grows teeth.
4. **Photography.** The design works fully type-led (no headshot). Recommend one good b&w portrait on About only — optional, can ship without.
5. **Peaches Beauty on the site?** Recommend yes as a one-line short entry (shows range), no case study.
6. **Which essay first.** "Past Lives" (2024, described in the journals as a finished specimen of the genre) is the likeliest candidate to polish; the *Two Cultures* piece is the stronger flag but is unwritten. Recommend launching with Past Lives + one technical note, and writing *Two Cultures* as the first *new* piece the site motivates.

---

## 12. Risks & honest notes

- **Content is the long pole, not code.** The site is ~9 sessions; the case studies and first essay are Sergei-hours that no agent can substitute. Mitigation: template-driven case studies (§5) cap the writing to ~800 words each, and the site ships legitimately with Writing = 1 piece.
- **Three.js scope creep** is the classic failure ("just one more shader"). The §7 restraint rules and the phase-3 isolation prototype are the guardrails; if it isn't excellent in two sessions, ship the static mark and iterate post-launch.
- **Staleness risk** is designed against: no dates on the homepage except writing entries, a one-line "now" instead of a /now page, status fields on work entries instead of "recent work" framing.
- **Identity timing.** Per the vault's goal ordering, this project is a *venue*, not a new identity vessel — it serves goal #3/#4 (meaning, direction) without demanding a persona. The site describes what exists; it doesn't promise a brand to live up to. Worth keeping that framing at write-time.

---

*Next step when approved: Phase 0 decisions → create `sc-jackie/website` → run the `new-project` skill for Jackie-OS wiring → Phase 1.*
