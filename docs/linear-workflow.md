# Linear workflow — Personal Website (sergeichan)

Operating manual for tracking this repo's work in Linear so it survives across
sessions. This is the short, repo-specific version; the **canonical full manual**
(status machine detail, agent Loop A/B prompts, definition of done, migration
deploy) lives in `~/dev/bunit/docs/linear-workflow.md` — read it for anything not
covered here.


**Fleet cadence (2026-07-26):** one Linear recurring issue — **Fablio PM pass** every **3 days** — runs Loop A (refine inbox) **and** light project status updates in the same session. No separate weekly status template. Hermes Linear PM/PO cron (if enabled) stays reconciliation-only.

## IDs

| Thing | Value |
|-------|-------|
| Workspace | `evegelin` |
| Team | `Evegelin` (key `EVE`) · `48daea3d-b403-4c71-b6c3-984db6b83fc4` |
| Project | `Personal Website` · `38c9ab37-880f-47db-be9c-8fb8c0f71718` |
| Board | https://linear.app/evegelin/project/personal-website-23c3aeec9577 |
| Repo | `sc-jackie/sergeichan` · branch `main` |

## Labels (workspace-shared — nothing to create per repo)

Three single-select groups apply to every project:
- **Pipeline** — `dev` (code → PR) · `content` (writing/media → draft, no PR) · `research` (decision → findings, no PR)
- **Stage** — `needs-refinement` (raw intent) → `needs-approval` (refined, awaiting your OK) → drop on approve
- **Type** — `Bug` · `Feature` · `Improvement`

## Status machine

`Backlog` (needs-refinement) → refine → (needs-approval) → you approve → `Todo`
→ `In Progress` → `In Review` (PR / draft) → `Done`.

## Sync contract (wrap-up)

This repo is **on the Hermes merge-poll auto-sync rail**: a batch of ≥2 merged
commits on `main` auto-posts a mirrored Linear **project status update** *and*
prepends `Vault/Personal Website.md` `## Status` (`System/ops/merge_poll.py`;
project name = the vault-note stem). So merged PRs flow to Linear + the vault on
their own. **Not** auto-synced: new issues, status moves, approvals, and
`content`/`research` work (no PR) — run `/wrap-up` for those.

On `/wrap-up`, after code is on `main`, in order:
1. **Issues → Done** — everything shipped this session (GitHub sync usually did `dev` issues on merge; verify).
2. **New work → Backlog** — bugs/ideas as `needs-refinement` + a Pipeline label.
3. **Post a Linear project status update** — mirror the vault `## Status` prepend (health + Shipped / Next / Blocked).

**Direction of truth:** code/`main` is ground truth; Linear + vault are projections of it.

## Enable full automation (one-time browser step)

**Linear → Settings → Integrations → GitHub** → connect `sc-jackie/sergeichan`,
and in status-automation map **PR opened → In Review** *and* **merged → Done**.
Until that's on, merge→Done won't fire and you'll bump issues by hand.

## Agent delegation (optional)

To let **Cyrus** / **Codex** build delegated issues: `ssh hermes` →
`cyrus self-add-repo https://github.com/sc-jackie/sergeichan evegelin` →
`systemctl --user restart cyrus.service`; put a `Personal Website` routing label
on any delegated issue. Full playbook: canonical manual § Agents + Rollout.

## Fleet PR standard (Draw #88 style — mandatory)

**One work unit = one PR.** Related fixes/bugs → one PR; one feature → one PR. No docs-only PRs — fold audits/notes into the implementing PR. **Parent opens the draft PR**; workers push into that branch (no sibling PRs). Combine sibling micro-fix PRs and close them as superseded.

**PR body for maintainers (not agents):**
1. `## Big UX changes (review these first)` + jump-link TOC whenever user/admin UX changes
2. Each big change: **Who** · **Where** · Before → After in plain sentences
3. Embed **real annotated screenshots** next to that item (public CDN URLs)
4. Then `## Smaller / chrome`, `## How to check`, `## Tickets` (last)

**Linear mirrors the PR:** one parent = the PR; each Big UX/ticket = sub-issue. **Lifecycle:** parent opens draft → workers push in → **Fablio** reviews each kid → kid **Done** only after review → when **all** kids Done, **Fablio** publishes → parent **In Review** until merge → parent **Done**.

Non-UI PRs: plain before/after + checklist + tickets. Canonical: Jackie-OS `System/agents/_shared/team-rules.md` §6–8. Example: AleannLab/draw#88 · EVE-160.
