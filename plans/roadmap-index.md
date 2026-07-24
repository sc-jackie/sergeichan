# Personal Website — Plan Index

> Single source of truth for forward work.
> **Verdicts are audited against code/migrations/PRs — not doc checkboxes.**
> When a plan doc's `- [ ]` boxes disagree with what's merged, the code wins;
> fix the doc. **After every ship:** agents prune [future-improvements](future-improvements.md) and
> refresh this index in the same commit ([wrap-up § Catalog cleanup](~/Jackie-OS/System/skills/wrap-up/SKILL.md#catalog-cleanup)).

_Last audited against `main` on 2026-07-24 (docs agent-team update pending merge; prior HEAD `8ca67df`)._

## Plan-doc status

| Plan doc | State | Open work |
| -------- | ----- | --------- |
| 2026-07-13-001 cinematic six-act scroll redesign | ⤴ archived (owner verdict, 2026-07-14; body deleted per delete-on-ship policy — git history + Linear post-mortem hold the detail) | Two overnight builds rejected: Three.js v1 (shipped→reverted `14bd8e1`), Canvas-2D ten-door gallery (PR #2 closed unmerged; branch `sergeitran/eve-87-canvas2d-six-acts` archived). EVE-87 canceled. Prod = original one-scene site. Future attempt = design-led with early static-mockup review, not fleet breadth. |
| 2026-07-23 maker-mark + case expansion | ✅ shipped `8ca67df` (body deleted per delete-on-ship policy) | — |
| [future-improvements](future-improvements.md) | 📋 catalog | owner-prioritized backlog (task queue itself lives in Linear — Personal Website project) |

**Genuinely-remaining engineering surface (2026-07-21):** three catalog items: real screenshots for main-site case frames (EVE-78), first essay (EVE-79), custom domain (EVE-80). Newfin product marketing at `/newfin` is live (not EVE-78).

## Shipped

| Area | Shipped in | Notes |
| ---- | ---------- | ----- |
| Case-view expansion + maker's mark | `8ca67df` | Four case views (Newfin/B-Unit/Rodyna/Draw) to Jackie-OS flagship depth: data-driven loop/day/before-after/truths sections + signature canvases (net-worth stack, XP/streak, self-resolving bracket; Rodyna bilingual duo card). Deep links `/#<id>` with history/back support. Maker's-mark footer: Newfin landing → `/#newfin`; bunit parents pages (bunit repo `684cc36`) → `/#bunit`. Rams 87/100, 0 critical; a11y fixes applied (hero role, dialog roles + focus trap, mobile touch hint, tokenized grays). |
| Newfin marketing landing | `ecfd302` (+ variants) | Keeper `/newfin`: Opus household-book copy, How-it-works ×5, redacted live UI screenshots (Home/Portfolio/Cashflow/Trading), scroll Feature Stack. Also live: `/newfin-fable` (`625957c`), `/newfin-fable-2` (`bf186d6`). |
| Jackie-OS case study | `685a45d` (#1) | Fuller rework: linked-memory particle field, two-ledger vault card, six-job loop w/ icons, before/after, ownership grid, grounded copy. The standalone landing (jackieos.vercel.app) was retired into this; that Vercel project is deleted. |
| Docs → Fumadocs | `ba7915e` | Replaced MkDocs Material with a Fumadocs (Next.js static-export) site at `/jackie-os/docs` (shadcn-neutral + gold accent, ⌘K search). Source app in `docs-src/`; built export in `site/jackie-os/`. |
| Docs → 4-agent team | EVE-112 | Public Jackie-OS docs (`workers` / `concepts` / `architecture` + related) updated from single-Cyrus era to Fablio·Cursorio·Codexio·Cyrusio roster + team-member rails; static export regenerated. |

## Conventions

- Read [README.md](README.md) in this folder for the planning workflow.
- One dated doc per initiative: `YYYY-MM-DD-<topic>.md`.
- Optional implementation plan: `YYYY-MM-DD-<topic>-implementation.md`.
- Statuses: ✅ shipped · 🔵 partial · 📋 catalog · ⏸ deferred · ⤴ superseded.
