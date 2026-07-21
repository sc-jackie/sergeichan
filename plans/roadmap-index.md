# Personal Website — Plan Index

> Single source of truth for forward work.
> **Verdicts are audited against code/migrations/PRs — not doc checkboxes.**
> When a plan doc's `- [ ]` boxes disagree with what's merged, the code wins;
> fix the doc. **After every ship:** agents prune [future-improvements](future-improvements.md) and
> refresh this index in the same commit ([wrap-up § Catalog cleanup](~/Jackie-OS/System/skills/wrap-up/SKILL.md#catalog-cleanup)).

_Last audited against `main` on 2026-07-21 (HEAD `ecfd302`)._

## Plan-doc status

| Plan doc | State | Open work |
| -------- | ----- | --------- |
| [2026-07-13-001 cinematic six-act scroll redesign](2026-07-13-001-feat-cinematic-six-act-scroll-redesign-plan.md) | ⤴ archived (owner verdict, 2026-07-14) | Two overnight builds rejected: Three.js v1 (shipped→reverted `14bd8e1`), Canvas-2D ten-door gallery (PR #2 closed unmerged; branch `sergeitran/eve-87-canvas2d-six-acts` archived). EVE-87 canceled. Prod = original one-scene site. Post-mortem on the Linear issue; future attempt = design-led with early static-mockup review, not fleet breadth. |
| [future-improvements](future-improvements.md) | 📋 catalog | owner-prioritized backlog (task queue itself lives in Linear — Personal Website project) |

**Genuinely-remaining engineering surface (2026-07-21):** three catalog items: real screenshots for main-site case frames (EVE-78), first essay (EVE-79), custom domain (EVE-80). Newfin product marketing at `/newfin` is live (not EVE-78).

## Shipped

| Area | Shipped in | Notes |
| ---- | ---------- | ----- |
| Newfin marketing landing | `ecfd302` (+ variants) | Keeper `/newfin`: Opus household-book copy, How-it-works ×5, redacted live UI screenshots (Home/Portfolio/Cashflow/Trading), scroll Feature Stack. Also live: `/newfin-fable` (`625957c`), `/newfin-fable-2` (`bf186d6`). |
| Jackie-OS case study | `685a45d` (#1) | Fuller rework: linked-memory particle field, two-ledger vault card, six-job loop w/ icons, before/after, ownership grid, grounded copy. The standalone landing (jackieos.vercel.app) was retired into this; that Vercel project is deleted. |
| Docs → Fumadocs | `ba7915e` | Replaced MkDocs Material with a Fumadocs (Next.js static-export) site at `/jackie-os/docs` (shadcn-neutral + gold accent, ⌘K search). Source app in `docs-src/`; built export in `site/jackie-os/`. |

## Conventions

- Read [README.md](README.md) in this folder for the planning workflow.
- One dated doc per initiative: `YYYY-MM-DD-<topic>.md`.
- Optional implementation plan: `YYYY-MM-DD-<topic>-implementation.md`.
- Statuses: ✅ shipped · 🔵 partial · 📋 catalog · ⏸ deferred · ⤴ superseded.
