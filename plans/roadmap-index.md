# Personal Website — Plan Index

> Single source of truth for forward work.
> **Verdicts are audited against code/migrations/PRs — not doc checkboxes.**
> When a plan doc's `- [ ]` boxes disagree with what's merged, the code wins;
> fix the doc. **After every ship:** agents prune [future-improvements](future-improvements.md) and
> refresh this index in the same commit ([wrap-up § Catalog cleanup](~/Jackie-OS/System/skills/wrap-up/SKILL.md#catalog-cleanup)).

_Last audited against `main` on 2026-07-14 (`c49e93b`)._

## Plan-doc status

| Plan doc | State | Open work |
| -------- | ----- | --------- |
| [2026-07-13-001 cinematic six-act scroll redesign](2026-07-13-001-feat-cinematic-six-act-scroll-redesign-plan.md) | 🔵 approved, in build | Rev 2 (2026-07-14, owner call): **full Three.js migration** — all six acts WebGL, act 2 ported with interaction parity, DOM-first content for fast load + fallback; U1–U10. Linear: EVE-87 (In Progress, overnight build). Supersedes EVE-77. |
| [future-improvements](future-improvements.md) | 📋 catalog | owner-prioritized backlog (task queue itself lives in Linear — Personal Website project) |

**Genuinely-remaining engineering surface (2026-07-14):** the six-act redesign (spec'd above) + three catalog items: real screenshots (EVE-78), first essay (EVE-79, becomes redesign act 5 content), custom domain (EVE-80).

## Shipped

| Area | Shipped in | Notes |
| ---- | ---------- | ----- |
| Jackie-OS case study | `685a45d` (#1) | Fuller rework: linked-memory particle field, two-ledger vault card, six-job loop w/ icons, before/after, ownership grid, grounded copy. The standalone landing (jackieos.vercel.app) was retired into this; that Vercel project is deleted. |
| Docs → Fumadocs | `ba7915e` | Replaced MkDocs Material with a Fumadocs (Next.js static-export) site at `/jackie-os/docs` (shadcn-neutral + gold accent, ⌘K search). Source app in `docs-src/`; built export in `site/jackie-os/`. |

## Conventions

- Read [README.md](README.md) in this folder for the planning workflow.
- One dated doc per initiative: `YYYY-MM-DD-<topic>.md`.
- Optional implementation plan: `YYYY-MM-DD-<topic>-implementation.md`.
- Statuses: ✅ shipped · 🔵 partial · 📋 catalog · ⏸ deferred · ⤴ superseded.
