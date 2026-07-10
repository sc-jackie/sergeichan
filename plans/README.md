# Personal Website Planning Workflow

This folder is the working planning surface for Personal Website.

## Source of truth

Start with [roadmap-index.md](roadmap-index.md). It is audited against actual
code, migrations, and merged PRs. If a checkbox in an older plan disagrees with
shipped code, the code wins and the plan should be archived or corrected.

## Current flow

1. Check [roadmap-index.md](roadmap-index.md) for shipped vs catalog state.
2. Pull the next initiative from [future-improvements.md](future-improvements.md)
   (owner-prioritized).
3. When an item is ready to build, create a dated plan in this folder:
   `YYYY-MM-DD-<topic>.md` or `YYYY-MM-DD-<topic>-implementation.md`.
4. When the work ships, move the plan to [archive/](archive/) and update the roadmap row.
5. **Catalog cleanup (required)** — in the **same commit**, edit [future-improvements.md](future-improvements.md): remove shipped bullets, or mark **🔵** + gap only for partials; bump [roadmap-index.md](roadmap-index.md) audit stamp and trim **Genuinely-remaining** / next-work blurb. Contract: [`~/Jackie-OS/System/skills/wrap-up/SKILL.md`](../../../Jackie-OS/System/skills/wrap-up/SKILL.md) § Catalog cleanup.
6. **Never archive** `future-improvements.md` — it is the idea catalog; prune stale lines instead.

## File types

- `roadmap-index.md` — current status and priority order.
- `future-improvements.md` — owner-prioritized idea catalog (stays active, no date prefix).
- `YYYY-MM-DD-<topic>.md` — roadmap or initiative plan (archive when realized).
- `YYYY-MM-DD-<topic>-implementation.md` — executable implementation plan (optional; archive when realized).
- `archive/` — shipped or superseded plans.

Post-fix learnings belong in [../docs/solutions/](../docs/solutions/), not here.

Verification discipline (when present): grep `docs/solutions/` for `verify-plan-status-against-ground-truth` or follow the same rules in [`wrap-up` § Roadmap reconcile](~/Jackie-OS/System/skills/wrap-up/SKILL.md#roadmap-reconcile).
