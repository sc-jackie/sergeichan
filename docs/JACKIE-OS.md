# Jackie-OS bridge

This code repo is registered in Sergei's knowledge OS (Jackie-OS). Keep vault and repo aligned.

| | |
|---|---|
| **Registry key** | `sergeichan` |
| **Vault note** | `~/Jackie-OS/Vault/Personal Website.md` |
| **Registry** | `~/Jackie-OS/System/project-registry.md` |

## Vault sync (how code work reaches the vault)

**Primary desk:** [bb](https://getbb.app). Hermes Agent runs the always-on COO loop. Temporary Cursor ACP workers handle delegated code, design, and research. **Git on `origin/main` is code truth**; the vault is PM truth.

1. **07:30 morning-brief (authoritative, daily).** The Hermes Agent (always-on COO/orchestrator) runs full `project-sync`, reading every merge on `origin/main` from `git log` → rich vault `## Status` + `hot.md`. Catches everything; needs nothing.
2. **Merge-poll (intraday, optional).** A scheduled GitHub Action *in jackie-os* (`.github/workflows/jackie-os-merge-poll.yml`) reads this repo every ~3h and prepends a **thin** entry when `main` advances (PR merge or direct push). One read-only PAT in jackie-os; this repo holds no token. The brief supersedes the thin entry.
3. **Manual.** Invoke **`/wrap-up`** (full handoff) or say **sync projects** (vault sync only). Use for shared/read-only repos or when you want it immediately.

**Cowork clock:** 07:30 morning-brief (research is on-demand) — see `~/Jackie-OS/System/OPERATOR.md`.

## Technical learnings

After a **non-trivial fix**, run **`jos-compound` in-session** (not automated) → writes this repo's `docs/solutions/` + the `~/Jackie-OS/Vault/Agent-Learnings/Personal Website learnings.md` index row.

## Roadmap reconcile

When a **tracked plan** on `main` is finished or advances: follow `~/Jackie-OS/System/skills/wrap-up/SKILL.md` § **Roadmap reconcile** in the same session — update this repo's roadmap index + plan doc, archive if fully realized, commit here, **then** sync vault from Jackie-OS. Ground-truth verification: `docs/solutions/workflow-issues/verify-plan-status-against-ground-truth.md` (Newfin; same rules apply elsewhere).

## Plans maintenance (after every ship)

When merged work realizes a `plans/future-improvements.md` line or finishes a tracked plan:
**same session, same code-repo commit** — prune/refine the catalog, bump `plans/roadmap-index.md`
audit stamp, archive dated plans. Full contract:
[`~/Jackie-OS/System/skills/wrap-up/SKILL.md`](~/Jackie-OS/System/skills/wrap-up/SKILL.md) § Catalog cleanup.
Morning-brief project-sync does **not** edit `plans/`.

## Do not

- Duplicate full solution docs into the vault.
- Assume Claude in Jackie-OS sees unpushed local commits — push first, then sync.
