# Personal Website Planning Workflow

This folder is the working planning surface for Personal Website (sergeichan).

## Source of truth

Start with [roadmap-index.md](roadmap-index.md). Audited against code and merged PRs.
If a checkbox disagrees with shipped code, the code wins — correct or delete the plan.

**Linear is the unit of work** (Personal Website project). Dated plans are optional HOW.

## Current flow

1. Check [roadmap-index.md](roadmap-index.md) for shipped vs catalog state.
2. Pull next from Linear or [future-improvements.md](future-improvements.md).
3. Heavy HOW → dated plan via **`jos-plan`** → **Create Linear parent + fleet handoff**.
4. **When the work ships (delete-on-ship):** ledger update + prune catalog + **delete** the
   dated plan body. No new `archive/` bodies — git history is the audit trail.
5. **Catalog cleanup** in the same commit — [`wrap-up` § Catalog cleanup](~/Jackie-OS/System/skills/wrap-up/SKILL.md#catalog-cleanup).
6. **Never archive** `future-improvements.md`.

## File types

- `roadmap-index.md` — status + Shipped ledger (permanent).
- `future-improvements.md` — idea catalog.
- `YYYY-MM-DD-<topic>.md` — optional plan (**deleted on ship**).
- `archive/` — legacy only; do not add new bodies.

Post-fix learnings: [../docs/solutions/](../docs/solutions/) when present.
